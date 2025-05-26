
# Quick Start Guide

Get up and running with Bug Repro Engine with Assisted Debugging in 5 minutes!

## 🚀 Express Setup (Copy-Paste Commands)

### Windows
```powershell
# 1. Create project
mkdir bug-repro-engine
cd bug-repro-engine
mkdir templates uploads bts

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

# 5. Setup BTS Backend (separate terminal)
cd bts
# Follow BTS setup instructions in main README

# 6. Create app.py and templates/chat.html with provided code

# 7. Run the Flask application
python app.py
```

### Linux/macOS
```bash
# 1. Create project
mkdir bug-repro-engine && cd bug-repro-engine
mkdir -p templates uploads bts

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

### Enhanced Features (v1.3.0)
- **Bug Lookup**: Click "Bug Lookup" and enter bug IDs for contextual analysis
- **Interactive Actions**: Use "Guide Me", "Analyze Log", and "Repro Scenario" buttons
- **Progress Indicators**: Watch real-time analysis progress with animated feedback
- **Auto-Fetch**: System automatically retrieves log files from bug records
- **Enhanced UI**: Enjoy the improved "Bug Repro Engine with Assisted Debugging" interface

### Commands
- **Clear**: Start fresh conversation
- **Bug Lookup**: Search and analyze specific bug records
- **Settings**: Adjust response style and AI parameters
- **Download**: Save chat history with bug analysis context

## 🔧 New Workflows

### Bug Analysis Workflow
1. Click "Bug Lookup" button
2. Enter a bug ID (e.g., `BUG-DEMO-1748084066155-17`)
3. Review bug details with enhanced styling
4. Use action buttons:
   - **🎯 Guide Me**: Get step-by-step resolution guidance
   - **📊 Analyze Log**: Perform contextual log analysis
   - **🔄 Repro Scenario**: Get reproduction steps and scenarios

### Enhanced File Analysis
1. Upload files via drag-and-drop or browse button
2. Watch animated progress indicators during analysis
3. See real-time "Analysis in progress" messages
4. Get completion notifications with enhanced styling

## ⚡ Tips

- **GPU Users**: You'll see "Using GPU: NVIDIA..." - enjoy 10x faster responses!
- **CPU Users**: Works fine but slower - be patient
- **Best log size**: Under 1MB for quick analysis
- **Memory issues?**: Close Chrome tabs, they eat RAM
- **Bug Analysis**: Use specific bug IDs for more targeted analysis results
- **Progress Tracking**: Watch the animated indicators for visual feedback

## 🆘 Quick Fixes

**"CUDA not available"**: You're on CPU mode - it works, just slower

**"Out of memory"**: Restart the app and close other programs

**"Module not found"**: Run `pip install -r requirements.txt` again

**Can't connect**: Make sure no firewall is blocking port 5000

**BTS not working**: Ensure the BTS backend is running on port 3001

**Progress indicators stuck**: Refresh the page and try again

---

Ready to dive deeper? Check out the full [README.md](README.md) for advanced features!
