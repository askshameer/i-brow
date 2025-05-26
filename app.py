
import os
import sys
import torch
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, StoppingCriteria, StoppingCriteriaList
import warnings
import logging
import secrets
from datetime import datetime
import json
import re
from werkzeug.utils import secure_filename
import hashlib

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

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'txt', 'log', 'dmp', 'dump', 'err', 'out', 'crash', 'trace', 'logs'}

# Global variable to store the chatbot instance
chatbot = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class StopOnTokens(StoppingCriteria):
    def __init__(self, stop_token_ids):
        self.stop_token_ids = stop_token_ids

    def __call__(self, input_ids, scores, **kwargs):
        for stop_id in self.stop_token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False

class LogAnalyzer:
    """Analyze error logs and crash dumps"""
    
    @staticmethod
    def extract_key_info(content, max_lines=200):
        """Extract key information from log content"""
        lines = content.split('\n')[:max_lines]  # Limit lines to prevent token overflow
        
        # Patterns to look for
        patterns = {
            'errors': re.compile(r'(error|exception|fail|crash|fatal|critical)', re.IGNORECASE),
            'warnings': re.compile(r'(warning|warn)', re.IGNORECASE),
            'stack_traces': re.compile(r'(traceback|stack trace|at .+\(.+:\d+\)|Exception in thread)', re.IGNORECASE),
            'timestamps': re.compile(r'(\d{4}-\d{2}-\d{2}|\d{2}:\d{2}:\d{2}|\d{2}/\d{2}/\d{4})'),
            'memory': re.compile(r'(memory|heap|stack overflow|out of memory|oom)', re.IGNORECASE),
            'segfault': re.compile(r'(segmentation fault|sigsegv|access violation)', re.IGNORECASE),
            'null_pointer': re.compile(r'(null pointer|nullptr|nullreferenceexception)', re.IGNORECASE),
            'file_paths': re.compile(r'([A-Za-z]:\\[\w\\\.-]+|/[\w/\.-]+)'),
            'ip_addresses': re.compile(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'),
            'urls': re.compile(r'https?://[^\s]+'),
        }
        
        findings = {
            'total_lines': len(lines),
            'errors': [],
            'warnings': [],
            'stack_traces': [],
            'timestamps': [],
            'critical_issues': [],
            'file_paths': [],  # Changed from set to list
            'summary': ''
        }
        
        # Use a set temporarily for deduplication
        file_paths_set = set()
        
        # Analyze each line
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check for errors
            if patterns['errors'].search(line):
                findings['errors'].append({'line': i+1, 'content': line.strip()[:200]})  # Limit line length
                
                # Check for specific critical issues
                if patterns['segfault'].search(line):
                    findings['critical_issues'].append(f"Segmentation fault detected at line {i+1}")
                elif patterns['null_pointer'].search(line):
                    findings['critical_issues'].append(f"Null pointer exception at line {i+1}")
                elif patterns['memory'].search(line):
                    findings['critical_issues'].append(f"Memory issue detected at line {i+1}")
            
            # Check for warnings
            elif patterns['warnings'].search(line):
                findings['warnings'].append({'line': i+1, 'content': line.strip()[:200]})
            
            # Check for stack traces
            if patterns['stack_traces'].search(line):
                # Try to capture the full stack trace
                stack_trace = [line]
                for j in range(i+1, min(i+20, len(lines))):
                    if lines[j].strip() and (lines[j].startswith(' ') or lines[j].startswith('\t') or 'at ' in lines[j]):
                        stack_trace.append(lines[j])
                    else:
                        break
                findings['stack_traces'].append('\n'.join(stack_trace)[:500])  # Limit stack trace length
            
            # Extract timestamps
            timestamp_match = patterns['timestamps'].search(line)
            if timestamp_match and len(findings['timestamps']) < 5:  # Limit timestamps
                findings['timestamps'].append(timestamp_match.group())
            
            # Extract file paths
            file_match = patterns['file_paths'].search(line)
            if file_match:
                file_paths_set.add(file_match.group())
        
        # Convert set to list for JSON serialization
        findings['file_paths'] = list(file_paths_set)[:10]  # Limit to 10 paths
        
        # Limit the number of errors and warnings to prevent overflow
        findings['errors'] = findings['errors'][:20]
        findings['warnings'] = findings['warnings'][:20]
        findings['stack_traces'] = findings['stack_traces'][:5]
        
        # Create summary
        if findings['errors']:
            findings['summary'] = f"Found {len(findings['errors'])} error(s)"
            if findings['critical_issues']:
                findings['summary'] += f" including {len(findings['critical_issues'])} critical issue(s)"
        elif findings['warnings']:
            findings['summary'] = f"Found {len(findings['warnings'])} warning(s), no errors detected"
        else:
            findings['summary'] = "No obvious errors or warnings found in the log"
        
        return findings

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
            "attn_implementation": "eager"
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
        
        # Set up stopping criteria - only stop on specific end tokens
        stop_tokens = ["<|end|>", "<|user|>"]
        stop_token_ids = []
        for token in stop_tokens:
            if token in self.tokenizer.get_vocab():
                stop_token_ids.append(self.tokenizer.convert_tokens_to_ids(token))
        
        self.stop_criteria = StoppingCriteriaList([StopOnTokens(stop_token_ids)])
        
        # Generation parameters - increased for better completeness
        self.max_new_tokens = 400
        self.temperature = 0.3
        
        # Session storage for conversation histories
        self.conversations = {}
        
        # Log analyzer
        self.log_analyzer = LogAnalyzer()
        
        print("Model loaded successfully!")
        print("Note: Using eager attention implementation for compatibility.\n")
    
    def format_prompt(self, user_input, conversation_history):
        """Format the prompt using Phi-3 instruction format"""
        system_prompt = "You are a helpful assistant specializing in debugging and log analysis. Provide clear, complete answers. Always finish your thoughts and complete all sentences properly. Do not stop mid-sentence."
        
        messages = [f"<|system|>\n{system_prompt}<|end|>\n"]
        
        # Add conversation history (last 3 turns)
        for turn in conversation_history[-3:]:
            messages.append(f"<|user|>\n{turn['user']}<|end|>\n")
            messages.append(f"<|assistant|>\n{turn['assistant']}<|end|>\n")
        
        messages.append(f"<|user|>\n{user_input}<|end|>\n<|assistant|>\n")
        prompt = "".join(messages)
        
        return prompt
    
    def generate_response(self, prompt):
        """Generate response using the model with better completion handling"""
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
        
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
                    min_new_tokens=50,
                )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=False)
        return response
    
    def clean_response(self, response, prompt):
        """Extract and clean the assistant's response with better completion detection"""
        if prompt in response:
            response = response.split(prompt)[-1]
        
        if "<|assistant|>" in response:
            response = response.split("<|assistant|>")[-1]
        
        # Remove any ending tags
        for tag in ["<|end|>", "<|user|>", "<|assistant|>", "<|system|>"]:
            if tag in response:
                response = response.split(tag)[0]
        
        response = response.strip()
        
        # Check if response seems truncated and try to complete it
        if response:
            # Check if the response ends properly
            last_char = response[-1] if response else ''
            sentence_endings = '.!?:;"\''
            
            # If it doesn't end with proper punctuation and seems cut off
            if last_char not in sentence_endings and len(response.split()) > 10:
                # Check if it ends mid-word
                if response and response[-1].isalnum():
                    # Find the last complete sentence
                    sentences = re.split(r'(?<=[.!?])\s+', response)
                    if len(sentences) > 1:
                        # Keep only complete sentences
                        response = ' '.join(sentences[:-1])
                        if not response[-1] in sentence_endings:
                            response += '.'
                else:
                    # Just add a period if it's missing
                    response += '.'
        
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
    
    def analyze_log_file(self, file_content, filename):
        """Analyze a log file and generate insights"""
        try:
            # Extract key information from the log
            findings = self.log_analyzer.extract_key_info(file_content)
            
            # Create a structured prompt for analysis
            analysis_prompt = f"""Analyze this error log file '{filename}' and provide debugging guidance.

Summary of findings:
- Total lines analyzed: {findings['total_lines']}
- Errors found: {len(findings['errors'])}
- Warnings found: {len(findings['warnings'])}
- Critical issues: {', '.join(findings['critical_issues'][:5]) if findings['critical_issues'] else 'None detected'}

Key errors (showing first 3):
{chr(10).join([f"Line {e['line']}: {e['content']}" for e in findings['errors'][:3]])}

Stack traces found: {len(findings['stack_traces'])}
{findings['stack_traces'][0] if findings['stack_traces'] else 'No stack traces found'}

Based on this analysis, provide:
1. A brief summary of the main issues
2. The likely root cause
3. Specific debugging steps to resolve the issues
4. Any additional recommendations

Keep your response concise and actionable."""
            
            # Generate analysis using the model
            session_id = 'log_analysis'
            if session_id not in self.conversations:
                self.conversations[session_id] = []
            
            response = self.chat(analysis_prompt, session_id)
            
            # Prepare safe findings for JSON serialization
            safe_findings = {
                'summary': findings['summary'],
                'error_count': len(findings['errors']),
                'warning_count': len(findings['warnings']),
                'critical_issues': findings['critical_issues'][:5],  # Limit to 5
                'has_stack_traces': len(findings['stack_traces']) > 0
            }
            
            return {
                'raw_findings': safe_findings,
                'analysis': response,
                'filename': filename
            }
            
        except Exception as e:
            print(f"Error in analyze_log_file: {str(e)}")
            return {
                'raw_findings': {'summary': 'Error during analysis', 'error_count': 0},
                'analysis': f"I encountered an error while analyzing the log file: {str(e)}. Please try again with a smaller file or check the file format.",
                'filename': filename
            }
    
    def chat(self, user_input, session_id):
        """Process user input and return response with retry logic"""
        try:
            # Get or create conversation history for this session
            if session_id not in self.conversations:
                self.conversations[session_id] = []
            
            conversation_history = self.conversations[session_id]
            
            # Format prompt
            prompt = self.format_prompt(user_input, conversation_history)
            
            # Try up to 3 times to get a complete response
            best_response = ""
            for attempt in range(3):
                # Generate response
                raw_response = self.generate_response(prompt)
                
                # Clean response
                response = self.clean_response(raw_response, prompt)
                
                # Keep the longest response
                if len(response) > len(best_response):
                    best_response = response
                
                # If response seems complete, use it
                if response and response[-1] in '.!?":;)\']':
                    best_response = response
                    break
                
                # Otherwise, try with more tokens
                if attempt < 2:
                    self.max_new_tokens = min(self.max_new_tokens + 100, 600)
            
            # Reset to default token count
            self.max_new_tokens = 400
            
            # Use the best response we got
            response = best_response if best_response else "I apologize, but I had trouble generating a complete response. Please try asking your question again."
            
            # Add to conversation history
            conversation_history.append({
                'user': user_input,
                'assistant': response,
                'timestamp': datetime.now().isoformat()
            })
            
            # Keep history size manageable
            if len(conversation_history) > 10:
                self.conversations[session_id] = conversation_history[-10:]
            
            return response
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def clear_session(self, session_id):
        """Clear conversation history for a session"""
        if session_id in self.conversations:
            self.conversations[session_id] = []
    
    def get_session_history(self, session_id):
        """Get conversation history for a session"""
        return self.conversations.get(session_id, [])

@app.route('/')
def index():
    if 'session_id' not in session:
        session['session_id'] = secrets.token_hex(16)
    return render_template('chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    session_id = session.get('session_id', 'default')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Get response from chatbot
    response = chatbot.chat(user_message, session_id)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Create unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(file.filename)
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save file
        file.save(filepath)
        
        # Get file info
        file_size = os.path.getsize(filepath)
        
        # Store file info in session
        if 'uploaded_files' not in session:
            session['uploaded_files'] = []
        
        file_info = {
            'id': hashlib.md5(unique_filename.encode()).hexdigest()[:8],
            'filename': filename,
            'filepath': filepath,
            'size': file_size,
            'timestamp': datetime.now().isoformat()
        }
        
        session['uploaded_files'].append(file_info)
        session.modified = True
        
        return jsonify({
            'status': 'success',
            'file': file_info
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/analyze/<file_id>', methods=['POST'])
def analyze_file(file_id):
    if 'uploaded_files' not in session:
        return jsonify({'error': 'No files uploaded'}), 404
    
    # Find the file
    file_info = None
    for f in session['uploaded_files']:
        if f['id'] == file_id:
            file_info = f
            break
    
    if not file_info:
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Read file content
        with open(file_info['filepath'], 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
          # Analyze the log file
        analysis_result = chatbot.analyze_log_file(content, file_info['filename'])
        
        return jsonify({
            'status': 'success',
            'analysis': analysis_result['analysis'],
            'findings': analysis_result['raw_findings'],
            'filename': file_info['filename']
        })
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({'error': f'Error analyzing file: {str(e)}'}), 500

@app.route('/fetch-log', methods=['POST'])
def fetch_log():
    try:
        data = request.get_json()
        file_path = data.get('path')
        filename = data.get('filename')
        
        if not file_path or not filename:
            return jsonify({'error': 'Missing file path or filename'}), 400
        
        # Security check - only allow reading log files
        if not any(file_path.lower().endswith(ext) for ext in ['.log', '.txt', '.err', '.out', '.crash', '.trace', '.dmp', '.dump']):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Check if file exists and is readable
        if not os.path.exists(file_path):
            return jsonify({'error': f'File not found: {file_path}'}), 404
        
        if not os.path.isfile(file_path):
            return jsonify({'error': f'Path is not a file: {file_path}'}), 400
        
        # Read the file
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except PermissionError:
            return jsonify({'error': f'Permission denied reading file: {file_path}'}), 403
        except Exception as e:
            return jsonify({'error': f'Error reading file: {str(e)}'}), 500
        
        # Create a file entry similar to uploaded files
        file_id = hashlib.md5(f"{file_path}{datetime.now().isoformat()}".encode()).hexdigest()
        
        # Save to uploads folder for analysis
        safe_filename = secure_filename(filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{safe_filename}")
        
        with open(upload_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        file_info = {
            'id': file_id,
            'filename': filename,
            'filepath': upload_path,
            'size': len(content.encode('utf-8')),
            'source': 'auto-fetched',
            'original_path': file_path
        }
        
        # Add to session
        if 'uploaded_files' not in session:
            session['uploaded_files'] = []
        session['uploaded_files'].append(file_info)
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully fetched log file from {file_path}',
            'file': file_info
        })
        
    except Exception as e:
        print(f"Error in fetch-log endpoint: {str(e)}")
        return jsonify({'error': f'Error fetching log file: {str(e)}'}), 500

@app.route('/clear', methods=['POST'])
def clear():
    session_id = session.get('session_id', 'default')
    chatbot.clear_session(session_id)
    return jsonify({'status': 'success', 'message': 'Conversation cleared'})

@app.route('/history', methods=['GET'])
def history():
    session_id = session.get('session_id', 'default')
    history = chatbot.get_session_history(session_id)
    return jsonify({'history': history})

@app.route('/settings', methods=['POST'])
def settings():
    data = request.json
    
    if 'temperature' in data:
        temp = float(data['temperature'])
        if 0.1 <= temp <= 1.0:
            chatbot.temperature = temp
            return jsonify({'status': 'success', 'message': f'Temperature set to {temp}'})
    
    if 'max_tokens' in data:
        tokens = int(data['max_tokens'])
        if 50 <= tokens <= 600:
            chatbot.max_new_tokens = tokens
            return jsonify({'status': 'success', 'message': f'Max tokens set to {tokens}'})
    
    return jsonify({'error': 'Invalid settings'}), 400

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'online',
        'device': chatbot.device,
        'temperature': chatbot.temperature,
        'max_tokens': chatbot.max_new_tokens,
        'model': 'Phi-3-mini-4k-instruct'
    })

@app.route('/bts/bugs', methods=['GET'])
def get_bugs():
    """Proxy endpoint to fetch bugs from BTS backend"""
    import requests
    try:
        # Make request to BTS backend
        response = requests.get('http://localhost:3001/api/bugs', timeout=10)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': f'BTS API returned status {response.status_code}'}), response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Cannot connect to BTS backend. Make sure it is running on port 3001.'}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': 'BTS backend request timed out.'}), 504
    except Exception as e:
        return jsonify({'error': f'Error connecting to BTS: {str(e)}'}), 500

@app.route('/bts/bugs/<bug_id>', methods=['GET'])
def get_bug(bug_id):
    """Proxy endpoint to fetch a specific bug from BTS backend"""
    import requests
    try:
        # Get all bugs and find the specific one
        response = requests.get('http://localhost:3001/api/bugs', timeout=10)
        if response.status_code == 200:
            bugs = response.json()
            bug = next((b for b in bugs if b['id'] == bug_id), None)
            if bug:
                return jsonify(bug)
            else:
                return jsonify({'error': f'Bug with ID {bug_id} not found'}), 404
        else:
            return jsonify({'error': f'BTS API returned status {response.status_code}'}), response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Cannot connect to BTS backend. Make sure it is running on port 3001.'}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': 'BTS backend request timed out.'}), 504
    except Exception as e:
        return jsonify({'error': f'Error connecting to BTS: {str(e)}'}), 500

if __name__ == '__main__':
    print("Initializing Phi-3 Web Chatbot with Log Analysis...")
    print("="*50)
    
    try:
        chatbot = Phi3Chatbot()
        print("\n" + "="*50)
        print("Starting web server...")
        print("Open your browser and go to: http://localhost:5000")
        print("="*50 + "\n")
        
        app.run(debug=False, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nMake sure you have all dependencies installed.")
