# Getting Started Guide

Welcome to the Bug Repro Engine with Assisted Debugging! This guide will help you set up and run the application on both Windows and Linux environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Windows Installation](#windows-installation)
- [Linux Installation](#linux-installation)
- [First Run](#first-run)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended for optimal performance)
- **Storage**: At least 10GB free space for models and dependencies
- **GPU**: Optional but recommended (CUDA-compatible for Windows, ROCm for AMD on Linux)

### Software Dependencies

#### Windows
- **Python**: 3.8 to 3.11 (3.10 recommended)
- **Node.js**: 18.x or higher
- **Git**: For cloning the repository
- **PowerShell**: For running scripts (included in Windows)

#### Linux
- **Python**: 3.8 to 3.11 (3.10 recommended)
- **Node.js**: 18.x or higher
- **Git**: For cloning the repository
- **Build tools**: gcc, make, python3-dev

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI_Solution.git
cd AI_Solution
```

### 2. Choose Your Platform
- **Windows Users**: Continue to [Windows Installation](#windows-installation)
- **Linux Users**: Continue to [Linux Installation](#linux-installation)

## Windows Installation

### Step 1: Install Python Dependencies
```powershell
# Create virtual environment
python -m venv phi3_env

# Activate virtual environment
.\phi3_env\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Install Node.js Dependencies
```powershell
# Navigate to BTS directory
cd bts

# Install Node.js dependencies
npm install

# Return to project root
cd ..
```

### Step 3: GPU Setup (Optional)
If you have an NVIDIA GPU with CUDA support:

```powershell
# Set CUDA environment (if you have CUDA installed)
.\set_cuda_env.ps1

# Verify GPU detection
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

### Step 4: Start the Application
```powershell
# Terminal 1: Start BTS Backend
cd bts\src\backend
npm start

# Terminal 2: Start Main Application (new PowerShell window)
cd AI_Solution
.\phi3_env\Scripts\Activate.ps1
python app.py
```

## Linux Installation

### Step 1: Install System Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv nodejs npm build-essential python3-dev

# CentOS/RHEL/Fedora
sudo dnf install python3 python3-pip nodejs npm gcc gcc-c++ python3-devel

# Arch Linux
sudo pacman -S python python-pip nodejs npm base-devel
```

### Step 2: Install Python Dependencies
```bash
# Create virtual environment
python3 -m venv phi3_env

# Activate virtual environment
source phi3_env/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Install Node.js Dependencies
```bash
# Navigate to BTS directory
cd bts

# Install Node.js dependencies
npm install

# Return to project root
cd ..
```

### Step 4: GPU Setup (Optional)
For NVIDIA GPUs:
```bash
# Check NVIDIA driver
nvidia-smi

# Verify CUDA/PyTorch
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

For AMD GPUs (ROCm):
```bash
# Install ROCm (Ubuntu example)
wget -q -O - https://repo.radeon.com/rocm/rocm.gpg.key | sudo apt-key add -
echo 'deb [arch=amd64] https://repo.radeon.com/rocm/apt/debian/ ubuntu main' | sudo tee /etc/apt/sources.list.d/rocm.list
sudo apt update
sudo apt install rocm-dkms

# Install PyTorch with ROCm
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.6
```

### Step 5: Start the Application
```bash
# Terminal 1: Start BTS Backend
cd bts/src/backend
npm start

# Terminal 2: Start Main Application (new terminal)
cd AI_Solution
source phi3_env/bin/activate
python app.py
```

## First Run

### 1. Model Download
On first startup, the application will automatically download the Phi-3 model (~2.4GB). This may take several minutes depending on your internet connection.

### 2. Access the Application
Open your web browser and navigate to:
- **Main Application**: `http://localhost:5000`
- **BTS Frontend**: `http://localhost:3000` (if using the React frontend)
- **BTS API**: `http://localhost:3001/api/bugs` (API endpoint)

### 3. Verify Setup
1. Check that both services are running without errors
2. Visit the main application URL
3. Try uploading a sample log file
4. Test the chat functionality

## Usage Guide

### Basic Workflow
1. **Start Application**: Run both BTS backend and main application
2. **Upload Files**: Drag and drop log files into the upload area
3. **Chat Interface**: Ask questions about bugs or request analysis
4. **Bug Lookup**: Use the bug lookup feature to find specific issues
5. **Analysis**: Get AI-powered insights on your log files

### Key Features
- **File Analysis**: Supports .log, .txt, .err, .out, .crash, .trace, .dmp files
- **Bug Tracking**: Integrated bug tracking system
- **Real-time Chat**: AI-powered assistance for debugging
- **Offline Operation**: Works without internet after initial setup

### Sample Commands
```bash
# Check application status
curl http://localhost:5000/status

# Test BTS API
curl http://localhost:3001/api/bugs

# View uploaded files
ls uploads/
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Windows: Find and kill process using port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux: Find and kill process using port
lsof -i :5000
kill -9 <PID>
```

#### Python Virtual Environment Issues
```bash
# Windows: Recreate environment
Remove-Item -Recurse -Force phi3_env
python -m venv phi3_env
.\phi3_env\Scripts\Activate.ps1
pip install -r requirements.txt

# Linux: Recreate environment
rm -rf phi3_env
python3 -m venv phi3_env
source phi3_env/bin/activate
pip install -r requirements.txt
```

#### GPU Not Detected
```bash
# Verify CUDA installation
nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"

# Reinstall PyTorch with CUDA
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

#### Model Download Issues
```bash
# Clear cache and retry
rm -rf ~/.cache/huggingface/
python app.py
```

### Getting Help
- Check the [Troubleshooting Guide](documentations/TROUBLESHOOTING.md)
- Review application logs in the terminal
- Ensure all dependencies are correctly installed
- Verify network connectivity for model downloads

### Performance Tips
1. **Use GPU**: Enable CUDA/ROCm for faster inference
2. **Increase RAM**: Close unnecessary applications
3. **SSD Storage**: Use SSD for faster model loading
4. **Network**: Stable internet for initial model download

## Next Steps
- Read the [Developer Guide](documentations/DEVELOPER_GUIDE.md) for advanced configuration
- Explore the [API Documentation](documentations/chat/API_DOCUMENTATION.md)
- Check out the [Contributing Guide](documentations/chat/CONTRIBUTING.md)
