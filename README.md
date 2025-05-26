
# Bug Repro Engine with Assisted Debugging

An AI-powered debugging assistant that helps analyze bugs, reproduce issues, and understand problems through intelligent log analysis.

## Features

- 🤖 **AI-Powered Analysis**: Phi-3 model for intelligent bug analysis
- 📁 **Log File Analysis**: Upload and analyze crash logs, error files
- 🐛 **Bug Tracking**: Integrated BTS for bug management
- 🎯 **Progress Tracking**: Real-time analysis with visual feedback
- 🌐 **Web Interface**: Modern, responsive chat interface
- 💾 **Offline Operation**: Works completely offline after setup

## Quick Start

### 1. Setup Environment
```powershell
# Clone repository
git clone <your-repo-url>
cd AI_Solution

# Create Python environment
python -m venv phi3_env
.\phi3_env\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 2. Start BTS Backend
```powershell
cd bts\src\backend
npm install
npm start  # Runs on port 3001
```

### 3. Start Main Application
```powershell
# In new terminal, from project root
.\phi3_env\Scripts\Activate.ps1
python app.py  # Runs on port 5000
```

### 4. Access Application
Open browser to: `http://localhost:5000`

## Usage

1. **Chat**: Ask questions about bugs and issues
2. **Upload Files**: Drag & drop log files for analysis
3. **Bug Lookup**: Search bugs using ID (e.g., `BUG-DEMO-1748084066155-0`)
4. **Progress Tracking**: Watch real-time analysis progress

## Requirements

- Python 3.8+
- Node.js 16+
- NVIDIA GPU with CUDA (recommended)
- 8GB+ GPU memory

## Troubleshooting

### GPU Issues
```powershell
# Check CUDA availability
python -c "import torch; print(torch.cuda.is_available())"
```

### Port Issues
- Ensure ports 5000 and 3001 are available
- Kill existing processes if needed

### Memory Issues
- Use CPU if GPU memory insufficient
- Reduce max_tokens in settings

## License

MIT License
