
# Phi-3 Offline Chatbot with LangChain

An offline chatbot implementation using Microsoft's Phi-3 model with LangChain framework, optimized for GPU usage.

## Features

- 🚀 GPU-accelerated inference
- 💬 Conversational memory
- 🔧 Easy-to-use command-line interface
- 📦 Fully offline operation
- 🐍 Clean Python implementation with LangChain

## Prerequisites

- Python 3.8 or higher
- NVIDIA GPU with CUDA support (recommended)
- At least 8GB of GPU memory for Phi-3-mini
- Git (for version control)

## Installation

### 1. Clone the repository (or create your project directory)

```bash
mkdir phi3-chatbot
cd phi3-chatbot
```

### 2. Create a virtual environment

```bash
# On Windows
python -m venv phi3_env
phi3_env\Scripts\activate

# On macOS/Linux
python3 -m venv phi3_env
source phi3_env/bin/activate
```

### 3. Install PyTorch with CUDA support

First, install PyTorch with CUDA support (adjust CUDA version as needed):

```bash
# For CUDA 11.8
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# For CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### 4. Install other dependencies

```bash
pip install -r requirements.txt
```

## Usage

### Running the chatbot

```bash
python main.py
```

### Available commands

- **Type your message**: Chat with the bot
- **`quit` or `exit`**: End the conversation
- **`clear`**: Clear conversation memory
- **`history`**: View conversation history

## First Run

On the first run, the script will download the Phi-3 model (approximately 2.8GB). This is a one-time download and the model will be cached locally for offline use.

## GPU Verification

To verify GPU is being used, check the console output when starting the chatbot. It should display:
```
Using GPU: [Your GPU Name]
```

If you see "WARNING: CUDA not available. Running on CPU.", ensure:
1. You have an NVIDIA GPU
2. CUDA drivers are installed
3. PyTorch is installed with CUDA support

## Troubleshooting

### CUDA not available
```bash
# Check PyTorch CUDA availability
python -c "import torch; print(torch.cuda.is_available())"
```

### Out of memory errors
- Try using a smaller model variant
- Reduce `max_new_tokens` in the pipeline configuration
- Clear GPU memory by restarting the Python kernel

### Slow performance on CPU
- The model will run significantly slower on CPU
- Consider using a cloud GPU service or upgrading to a CUDA-capable GPU

## Project Structure

```
phi3-chatbot/
├── main.py          # Main chatbot implementation
├── requirements.txt # Python dependencies
├── .gitignore      # Git ignore file
└── README.md       # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
