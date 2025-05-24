
import os
import sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, StoppingCriteria, StoppingCriteriaList
import warnings
import logging

# Suppress warnings
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)

# Suppress torch distributed warnings on Windows/MacOS
os.environ["TORCH_DISTRIBUTED_DEBUG"] = "OFF"
if sys.platform in ["win32", "darwin"]:
    os.environ["RANK"] = "-1"
    os.environ["WORLD_SIZE"] = "1"
    os.environ["MASTER_ADDR"] = "127.0.0.1"
    os.environ["MASTER_PORT"] = "29500"

class StopOnTokens(StoppingCriteria):
    def __init__(self, stop_token_ids):
        self.stop_token_ids = stop_token_ids

    def __call__(self, input_ids, scores, **kwargs):
        for stop_id in self.stop_token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False

class Phi3Chatbot:
    def __init__(self, model_name="microsoft/Phi-3-mini-4k-instruct"):
        """Initialize the Phi-3 chatbot with GPU support"""
        print("Loading Phi-3 model... This may take a few minutes on first run.")
        
        # Check if CUDA is available
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        if self.device == "cpu":
            print("WARNING: CUDA not available. Running on CPU. This will be slower.")
        else:
            print(f"Using GPU: {torch.cuda.get_device_name(0)}")
            # Print CUDA version for debugging
            print(f"CUDA Version: {torch.version.cuda}")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=True
        )
        
        # Configure model loading with explicit attention implementation
        model_kwargs = {
            "trust_remote_code": True,
            "low_cpu_mem_usage": True,
            "attn_implementation": "eager"  # Use eager attention instead of flash attention
        }
        
        if self.device == "cuda":
            # Use 4-bit quantization for better memory efficiency
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                quantization_config=bnb_config,
                device_map="auto",
                torch_dtype=torch.float16,
                **model_kwargs
            )
        else:
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                device_map="auto",
                torch_dtype=torch.float32,
                **model_kwargs
            )
        
        # Set up stopping criteria - only stop on end tokens
        stop_tokens = ["<|end|>", "<|user|>"]
        stop_token_ids = []
        for token in stop_tokens:
            if token in self.tokenizer.get_vocab():
                stop_token_ids.append(self.tokenizer.convert_tokens_to_ids(token))
        
        self.stop_criteria = StoppingCriteriaList([StopOnTokens(stop_token_ids)])
        
        # Initialize conversation history
        self.conversation_history = []
        
        # Generation parameters
        self.max_new_tokens = 250
        self.temperature = 0.3
        
        print("Model loaded successfully!")
        print("Note: Using eager attention implementation for compatibility.\n")
    
    def format_prompt(self, user_input, include_history=True):
        """Format the prompt using Phi-3 instruction format"""
        system_prompt = "You are a helpful assistant. Provide clear, complete answers. Always finish your thoughts and sentences."
        
        if include_history and self.conversation_history:
            # Build conversation context
            messages = [f"<|system|>\n{system_prompt}<|end|>\n"]
            
            for turn in self.conversation_history[-3:]:  # Keep last 3 turns
                messages.append(f"<|user|>\n{turn['user']}<|end|>\n")
                messages.append(f"<|assistant|>\n{turn['assistant']}<|end|>\n")
            
            messages.append(f"<|user|>\n{user_input}<|end|>\n<|assistant|>\n")
            prompt = "".join(messages)
        else:
            prompt = f"<|system|>\n{system_prompt}<|end|>\n<|user|>\n{user_input}<|end|>\n<|assistant|>\n"
        
        return prompt
    
    def generate_response(self, prompt):
        """Generate response using the model"""
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
        
        # Suppress generation warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=self.max_new_tokens,
                    temperature=self.temperature,
                    top_p=0.95,
                    do_sample=True,
                    stopping_criteria=self.stop_criteria,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    min_new_tokens=20,
                )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=False)
        return response
    
    def clean_response(self, response, prompt):
        """Extract and clean the assistant's response"""
        # Remove the prompt from the response
        if prompt in response:
            response = response.split(prompt)[-1]
        
        # Extract content between assistant tags
        if "<|assistant|>" in response:
            response = response.split("<|assistant|>")[-1]
        
        # Remove any ending tags
        for tag in ["<|end|>", "<|user|>", "<|assistant|>", "<|system|>"]:
            if tag in response:
                response = response.split(tag)[0]
        
        # Clean up
        response = response.strip()
        
        # Check if response seems truncated (ends mid-sentence)
        if response and not response[-1] in '.!?":;)]\'}' and len(response.split()) > 5:
            # Try to complete the sentence
            response += "."
        
        # Remove any hashtags, @ mentions, or obvious role-playing elements
        if '#' in response or '@' in response or '|' in response:
            lines = response.split('\n')
            cleaned_lines = []
            for line in lines:
                if not (line.strip().startswith('#') or 
                       line.strip().startswith('@') or 
                       '|' in line):
                    cleaned_lines.append(line)
            response = '\n'.join(cleaned_lines).strip()
        
        return response
    
    def chat(self, user_input):
        """Process user input and return response"""
        try:
            # Format prompt
            prompt = self.format_prompt(user_input)
            
            # Generate response
            raw_response = self.generate_response(prompt)
            
            # Clean response
            response = self.clean_response(raw_response, prompt)
            
            # If response is empty or too short, try again with more tokens
            if not response or len(response.split()) < 5:
                self.max_new_tokens = min(self.max_new_tokens + 100, 500)
                raw_response = self.generate_response(prompt)
                response = self.clean_response(raw_response, prompt)
                self.max_new_tokens = 250  # Reset to default
            
            # Add to conversation history
            self.conversation_history.append({
                'user': user_input,
                'assistant': response
            })
            
            # Keep history size manageable
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]
            
            return response
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def clear_memory(self):
        """Clear conversation history"""
        self.conversation_history = []
        print("Conversation memory cleared.")
    
    def get_conversation_history(self):
        """Get the conversation history"""
        if not self.conversation_history:
            return "No conversation history yet."
        
        history = []
        for i, turn in enumerate(self.conversation_history):
            history.append(f"\n--- Turn {i+1} ---")
            history.append(f"User: {turn['user']}")
            history.append(f"Assistant: {turn['assistant']}")
        
        return "\n".join(history)
    
    def adjust_response_length(self, max_tokens):
        """Adjust the maximum response length"""
        if 50 <= max_tokens <= 500:
            self.max_new_tokens = max_tokens
            print(f"Maximum response length set to {max_tokens} tokens.")
        else:
            print("Please provide a value between 50 and 500.")
    
    def adjust_temperature(self, temperature):
        """Adjust the temperature for response creativity"""
        if 0.1 <= temperature <= 1.0:
            self.temperature = temperature
            print(f"Temperature set to {temperature}.")
        else:
            print("Please provide a value between 0.1 and 1.0.")

def main():
    # Clear console for clean start
    if sys.platform == "win32":
        os.system("cls")
    else:
        os.system("clear")
    
    # Initialize chatbot
    print("Initializing Phi-3 Chatbot...")
    print("="*50)
    
    try:
        chatbot = Phi3Chatbot()
    except Exception as e:
        print(f"Error initializing chatbot: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Make sure you have CUDA installed if using GPU")
        print("2. Try running: pip install transformers==4.38.2")
        print("3. Ensure you have enough GPU memory (at least 4GB)")
        return
    
    print("\n" + "="*50)
    print("Phi-3 Offline Chatbot - Ready!")
    print("="*50)
    print("Commands:")
    print("- Type 'quit' or 'exit' to end the conversation")
    print("- Type 'clear' to clear conversation memory")
    print("- Type 'history' to view conversation history")
    print("- Type 'length <number>' to adjust response length (50-500)")
    print("- Type 'temp <number>' to adjust creativity (0.1-1.0)")
    print("="*50 + "\n")
    
    while True:
        try:
            # Get user input
            user_input = input("\nYou: ").strip()
            
            # Check for commands
            if user_input.lower() in ['quit', 'exit']:
                print("\nGoodbye!")
                break
            elif user_input.lower() == 'clear':
                chatbot.clear_memory()
                continue
            elif user_input.lower() == 'history':
                print("\nConversation History:")
                print("-" * 50)
                print(chatbot.get_conversation_history())
                print("-" * 50)
                continue
            elif user_input.lower().startswith('length '):
                try:
                    length = int(user_input.split()[1])
                    chatbot.adjust_response_length(length)
                except (ValueError, IndexError):
                    print("Usage: length <number> (e.g., 'length 300')")
                continue
            elif user_input.lower().startswith('temp '):
                try:
                    temp = float(user_input.split()[1])
                    chatbot.adjust_temperature(temp)
                except (ValueError, IndexError):
                    print("Usage: temp <number> (e.g., 'temp 0.7')")
                continue
            elif not user_input:
                continue
            
            # Get response
            print("\nPhi-3: ", end="", flush=True)
            response = chatbot.chat(user_input)
            print(response)
            
        except KeyboardInterrupt:
            print("\n\nInterrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()
