
# Quick Start Guide

Get up and running with Phi-3 Chatbot in 5 minutes!

## 🚀 Express Setup (Copy-Paste Commands)

### Windows
```powershell
# 1. Create project
mkdir phi3-chatbot
cd phi3-chatbot
mkdir templates uploads

# 2. Create virtual environment
python -m venv phi3_env
phi3_env\Scripts\activate

# 3. Install PyTorch (choose one)
# For NVIDIA GPU:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# For CPU only:
# pip install torch torchvision torchaudio

# 4. Install dependencies
pip install transformers==4.38.2 flask flask-cors accelerate sentencepiece protobuf einops bitsandbytes scipy

# 5. Create app.py and templates/chat.html with provided code

# 6. Run
python app.py
```

### Linux/macOS
```bash
# 1. Create project
mkdir phi3-chatbot && cd phi3-chatbot
mkdir -p templates uploads

# 2. Create virtual environment
python3 -m venv phi3_env
source phi3_env/bin/activate

# 3. Install PyTorch (choose one)
# For NVIDIA GPU:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# For CPU only:
# pip install torch torchvision torchaudio

# 4. Install dependencies
pip install transformers==4.38.2 flask flask-cors accelerate sentencepiece protobuf einops bitsandbytes scipy

# 5. Create app.py and templates/chat.html with provided code

# 6. Run
python app.py
```

## 📱 First Time Usage

1. **Wait for model download** (3-5 minutes, one-time only)
2. **Open browser**: http://localhost:5000
3. **Start chatting** or upload logs to analyze!

## 🔥 Quick Features

### Chat
- Just type and press Enter
- Ask anything - it's completely offline!

### Analyze Logs
1. Click 📎 or drag a log file
2. Click "Analyze"
3. Get instant debugging help

### Commands
- **Clear**: Start fresh conversation
- **Settings**: Adjust response style
- **Download**: Save chat history

## ⚡ Tips

- **GPU Users**: You'll see "Using GPU: NVIDIA..." - enjoy 10x faster responses!
- **CPU Users**: Works fine but slower - be patient
- **Best log size**: Under 1MB for quick analysis
- **Memory issues?**: Close Chrome tabs, they eat RAM

## 🆘 Quick Fixes

**"CUDA not available"**: You're on CPU mode - it works, just slower

**"Out of memory"**: Restart the app and close other programs

**"Module not found"**: Run `pip install -r requirements.txt` again

**Can't connect**: Make sure no firewall is blocking port 5000

---

Ready to dive deeper? Check out the full [README.md](README.md) for advanced features!
