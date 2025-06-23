
# Bug Repro Engine with Assisted Debugging

An intelligent AI-powered debugging assistant that helps developers analyze bugs, reproduce issues, and understand complex problems through advanced log analysis and conversational AI.

## 🚀 Features

- 🤖 **Microsoft Phi-3 AI Model**: State-of-the-art language model for intelligent bug analysis
- 📁 **Multi-Format Log Analysis**: Support for .log, .txt, .err, .out, .crash, .trace, .dmp files
- 🐛 **Integrated Bug Tracking System**: Full-featured BTS with search and management
- 🔄 **Interactive Reproduction Simulation**: Advanced modal-based simulation for bug reproduction scenarios
- 📝 **AI-Powered Script Generation**: Generate Python automation scripts from bug descriptions using Phi-3 AI
- 🎯 **Real-Time Progress Tracking**: Visual feedback during analysis with progress indicators
- 🌐 **Modern Web Interface**: Responsive chat-based UI with drag-and-drop file upload
- 💾 **Offline Operation**: Complete functionality without internet after initial setup
- 🔧 **Cross-Platform Support**: Windows and Linux compatibility
- ⚡ **GPU Acceleration**: CUDA and ROCm support for enhanced performance
- 🛡️ **Secure**: Local processing ensures your logs stay private

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Usage](#-usage)
- [System Requirements](#-system-requirements)
- [Technology Stack](#-technology-stack)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ⚡ Quick Start

> **New to the project?** Check out our comprehensive [Getting Started Guide](documentations/GETTING_STARTED.md) for detailed setup instructions.

### Prerequisites
- Python 3.8-3.11 (3.10 recommended)
- Node.js 18+
- 8GB+ RAM (16GB recommended)
- 10GB+ free disk space

### 1. Clone and Setup Environment
```powershell
# Clone repository
git clone https://github.com/askshameer/i-brow.git
cd AI_Solution

# Create and activate Python environment
python -m venv phi3_env
.\phi3_env\Scripts\Activate.ps1

# Install Python dependencies
pip install --upgrade pip
# For GPU support (CUDA 12.1)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

### 2. Setup BTS Backend
```powershell
# Navigate to BTS directory and install dependencies
cd bts
npm install
cd ..
```

### 3. Start the Application
```powershell
# Terminal 1: Start BTS Backend
cd bts\src\backend
npm start  # Runs on http://localhost:3001

# Terminal 2: Start Main Application (new PowerShell window)
cd AI_Solution
.\phi3_env\Scripts\Activate.ps1
python app.py  # Runs on http://localhost:5000
```

### 4. Access the Application
Open your browser and navigate to: **http://localhost:5000**

On first run, the Phi-3 model (~2.4GB) will be automatically downloaded.

## 📚 Documentation

We provide comprehensive documentation to help you get started and contribute effectively:

| Document | Description |
|----------|-------------|
| [**Getting Started Guide**](documentations/GETTING_STARTED.md) | Complete setup instructions for Windows and Linux |
| [**Developer Guide**](documentations/DEVELOPER_GUIDE.md) | Architecture, API reference, and development workflow |
| [**Troubleshooting Guide**](documentations/TROUBLESHOOTING.md) | Common issues and solutions |
| [**Chat Documentation**](documentations/chat/) | Chat system implementation details |

## 🎯 Usage

### Basic Workflow
1. **Start both services** (BTS backend and main application)
2. **Upload log files** via drag-and-drop interface
3. **Chat with AI** about your bugs and issues
4. **Search bugs** using IDs (e.g., `BUG-DEMO-1748084066155-0`)
5. **Use reproduction simulation** for bug scenario testing
6. **Generate Python automation scripts** using AI from bug descriptions
7. **Get insights** through AI-powered analysis

### 🔄 Reproduction Simulation (New in v4.0.0)
The integrated reproduction simulation feature provides an interactive, visual workflow for testing bug scenarios:

#### **Simulation Stages:**
- 🔍 **Decoding the Bug** - Analyzes bug report structure and parameters
- ⚙️ **Generating Automation Script** - Creates automated test sequences
- 🔎 **Searching for Setup** - Scans for compatible test environments
- ✅ **Setup Found** - Verifies configuration and dependencies
- ⏳ **Setup Busy** - Waits for resource allocation
- 📋 **Queued for Run** - Submits test job to execution queue
- ⚡ **Running in Progress** - Executes reproduction steps
- 🎯 **Reproduction Complete** - Generates comprehensive report
- ✨ **Issue Reproduced** - Captures diagnostic data for analysis

#### **How to Use:**
1. Look up a bug using the Bug Lookup feature
2. Click the **"Repro Scenario"** button on the bug card
3. Launch the interactive simulation modal
4. Click **"Start Simulation"** to begin the reproduction process
5. Watch the real-time progress through all 9 stages
6. Review the completion report and captured data

### 📝 AI-Powered Script Generation (New in v5.0.0)
Transform bug descriptions into executable Python automation scripts using advanced AI:

#### **Key Features:**
- 🤖 **Phi-3 AI Integration**: Uses Microsoft's Phi-3-mini-4k-instruct model for intelligent script generation
- 🔍 **Smart Parsing**: Automatically extracts reproduction steps, expected vs actual results from bug descriptions
- 🎯 **Category-Aware**: Generates specialized scripts for multimedia, driver, kernel, performance, and security issues
- 🖥️ **Platform-Specific**: Creates Linux/Windows-specific implementations
- 📊 **Comprehensive Testing**: Includes logging, error handling, and detailed reporting
- 💾 **Export Options**: Copy to clipboard or download as `.py` files

#### **How to Use:**
1. Look up a bug using the Bug Lookup feature
2. Click **"Repro Scenario"** to open the reproduction modal
3. Click **"📝 Generate Script"** next to "Start Simulation"
4. Watch the loading animation as AI analyzes the bug
5. View the generated script in the popup modal with syntax highlighting
6. Copy to clipboard or download the Python automation script
7. Execute the script in your test environment

#### **Generated Script Features:**
- **Intelligent Analysis**: AI understands bug context and creates relevant test automation
- **Production-Ready**: Complete scripts with imports, error handling, and logging
- **Customizable**: Well-structured code that can be easily modified for specific environments
- **Detailed Reporting**: Automatic test result tracking and report generation

### Supported File Types
- **Log files**: `.log`, `.txt`
- **Error files**: `.err`, `.out`
- **Crash files**: `.crash`, `.trace`
- **Memory dumps**: `.dmp`

### Example Commands
```bash
# Check application status
curl http://localhost:5000/status

# Test BTS API
curl http://localhost:3001/api/bugs

# Upload a file programmatically
curl -X POST -F "file=@sample.log" http://localhost:5000/upload
```

## 💻 System Requirements

### Minimum Requirements
- **OS**: Windows 10/11 or Linux (Ubuntu 20.04+, CentOS 8+)
- **CPU**: 4-core processor (8-core recommended)
- **RAM**: 8GB (16GB recommended for optimal performance)
- **Storage**: 10GB free space for models and dependencies
- **Network**: Internet connection for initial model download

### GPU Support (Optional but Recommended)
- **NVIDIA**: CUDA 11.8+ compatible GPU with 4GB+ VRAM
- **AMD**: ROCm compatible GPU (Linux only)
- **Performance boost**: 3-5x faster inference with GPU acceleration

## 🛠️ Technology Stack

### Backend
- **Python 3.8-3.11**: Core application framework
- **Flask**: Web framework for API and UI
- **PyTorch**: ML framework for model inference
- **Transformers**: Hugging Face library for Phi-3 model
- **Node.js**: BTS backend service

### Frontend
- **HTML5/CSS3**: Modern web interface
- **JavaScript (ES6+)**: Interactive chat functionality
- **Responsive Design**: Works on desktop and mobile

### AI Model
- **Microsoft Phi-3-mini-4k-instruct**: 3.8B parameter language model
- **Quantization**: Support for 4-bit and 8-bit quantization
- **Local Inference**: Complete offline operation after setup

## 🔧 Troubleshooting

### Quick Fixes

#### Port Conflicts
```powershell
# Check what's using the ports
netstat -ano | findstr :5000
netstat -ano | findstr :3001

# Kill processes if needed
taskkill /PID <PID> /F
```

#### GPU Issues
```powershell
# Verify CUDA availability
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
python -c "import torch; print(f'GPU count: {torch.cuda.device_count()}')"

# If GPU not detected, check drivers
nvidia-smi
```

#### Model Download Issues
```powershell
# Clear Hugging Face cache and retry
Remove-Item -Recurse -Force $env:USERPROFILE\.cache\huggingface\
python app.py
```

#### Memory Issues
- Close other applications to free RAM
- Use CPU mode if GPU memory is insufficient
- Reduce batch size in model configuration

For more detailed troubleshooting, see our [Troubleshooting Guide](documentations/TROUBLESHOOTING.md).

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Read the Documentation**: Check our [Developer Guide](documentations/DEVELOPER_GUIDE.md)
2. **Fork the Repository**: Create your own fork on GitHub
3. **Create a Branch**: `git checkout -b feature/your-feature-name`
4. **Make Changes**: Follow our coding standards
5. **Test Your Changes**: Run the test suite
6. **Submit a Pull Request**: Describe your changes clearly

### Development Setup
```powershell
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Check code style
flake8 .
black .
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Microsoft**: For the Phi-3 language model
- **Hugging Face**: For the Transformers library
- **PyTorch Team**: For the deep learning framework
- **Flask Community**: For the web framework

## 📞 Support

- **Issues**: Report bugs and feature requests on [GitHub Issues](https://github.com/your-username/AI_Solution/issues)
- **Documentation**: Check our comprehensive [documentation](documentations/)
- **Community**: Join discussions in our GitHub repository

---

**Ready to start debugging smarter?** Follow our [Getting Started Guide](documentations/GETTING_STARTED.md) and join the AI-powered debugging revolution! 🚀
