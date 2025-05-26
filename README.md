
# Bug Repro Engine with Assisted Debugging

An advanced offline debugging assistant powered by Microsoft's Phi-3 model with integrated Bug Tracking System (BTS) and enhanced web interface for intelligent log analysis and bug reproduction guidance.

## Features

- 🚀 GPU-accelerated inference with CUDA support
- 💬 Conversational memory and chat history
- 🐛 Integrated Bug Tracking System (BTS) with intelligent lookup functionality
- 📁 Advanced log file analysis and crash dump examination with progress indicators
- 🌐 Modern web interface with enhanced dark theme and animated progress states
- 📦 Fully offline operation with local AI processing
- 🔧 Configurable AI parameters (temperature, max tokens)
- 📱 Responsive design optimized for mobile and desktop
- 🎯 **NEW**: Interactive bug guidance with contextual assistance
- 📊 **NEW**: Real-time analysis progress with visual feedback
- 🔄 **NEW**: Enhanced reproduction scenario workflows
- ✨ **NEW**: Animated progress indicators and completion states

## Components

### 1. Phi-3 Chatbot (Flask Backend)
- **File**: `app.py`
- Microsoft Phi-3-mini-4k-instruct model
- Advanced log analysis capabilities with progress tracking
- File upload and processing with visual feedback
- BTS integration endpoints with auto-fetch functionality
- Real-time analysis status updates

### 2. Bug Tracking System (BTS)
- **Location**: `bts/src/backend/`
- Node.js REST API server
- JSON-based bug database with demo data
- CRUD operations for comprehensive bug management
- Auto-fetch log files from bug records
- Integration with main chat interface

### 3. Enhanced Web Interface
- **Template**: `templates/chat.html`
- Modern dark theme UI with enhanced styling
- Real-time chat interface with animated progress indicators
- Interactive bug lookup with contextual action buttons
- File upload with drag-and-drop and progress visualization
- Responsive design with mobile optimization
- **NEW**: Analysis progress indicators with shimmer animations
- **NEW**: Contextual bug guidance workflows
- **NEW**: Enhanced visual feedback for all operations

## Prerequisites

- Python 3.8 or higher
- Node.js 16.x or higher (for BTS backend)
- NVIDIA GPU with CUDA support (recommended)
- At least 8GB of GPU memory for Phi-3-mini
- Windows 10/11 with PowerShell (tested environment)
- Git (for version control)

## Quick Start

### 1. Clone the repository

```powershell
git clone https://github.com/your-username/AI_Solution.git
cd AI_Solution
```

### 2. Setup CUDA Environment (Windows)

```powershell
# Run the CUDA environment setup script
.\set_cuda_env.ps1
```

### 3. Install Python Dependencies

```powershell
# Create and activate virtual environment
python -m venv phi3_env
.\phi3_env\Scripts\Activate.ps1

# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install other dependencies
pip install -r requirements.txt
```

### 4. Setup BTS Backend

```powershell
# Navigate to BTS backend directory
cd bts\src\backend

# Install Node.js dependencies
npm install

# Start BTS server (runs on port 3001)
npm start
```

### 5. Start the Web Application

```powershell
# In a new terminal, navigate back to project root
cd AI_Solution

# Activate Python environment
.\phi3_env\Scripts\Activate.ps1

# Start Flask application
python app.py
```

### 6. Access the Application

Open your web browser and go to: `http://localhost:5000`
## Usage

### Web Interface Features

1. **Chat with AI**: Type messages to interact with the Phi-3 model
2. **File Analysis**: Upload log files (.log, .txt, .dmp, .crash) for analysis
3. **Bug Lookup**: Search and display bug information from the BTS
4. **Settings**: Adjust AI parameters (temperature, max tokens)
5. **Chat History**: Download conversation history

### Bug Tracking System

- **Bug Lookup**: Enter bug IDs (e.g., `BUG-DEMO-1748084066155-0`) to retrieve detailed information
- **Bug Information**: View title, description, status, priority, assignee, and metadata
- **Demo Data**: Sample bugs are included for testing

### API Endpoints

#### Flask Application (Port 5000)
- `GET /` - Web interface
- `POST /chat` - Chat with AI
- `POST /upload` - Upload files for analysis
- `POST /analyze/{file_id}` - Analyze uploaded files
- `GET /bts/bugs` - Proxy to BTS for all bugs
- `GET /bts/bugs/{bug_id}` - Proxy to BTS for specific bug

#### BTS Backend (Port 3001)
- `GET /bugs` - Get all bugs
- `GET /bugs/{id}` - Get specific bug
- `POST /bugs` - Create new bug
- `PUT /bugs/{id}` - Update bug
- `DELETE /bugs/{id}` - Delete bug

## Testing

### Python Tests
```powershell
# Run Python tests
python -m pytest tests/
```

### BTS Backend Tests
```powershell
# Navigate to BTS backend
cd bts\src\backend

# Run Node.js tests
npm test
```

## First Run

On the first run, the Flask application will:
1. Download the Phi-3 model (approximately 2.8GB)
2. Initialize the model with CUDA support
3. Start the web server on `http://localhost:5000`

The model is cached locally for offline use after the initial download.

## GPU Verification

To verify GPU is being used, check the console output when starting the chatbot. It should display:
```
Using GPU: [Your GPU Name]
```

If you see "WARNING: CUDA not available. Running on CPU.", ensure:
1. You have an NVIDIA GPU
2. CUDA drivers are installed
3. PyTorch is installed with CUDA support

## Documentation

### 📚 Complete Documentation
- **[Features Guide](documentations/chat/FEATURES.md)** - Comprehensive feature documentation
- **[Quick Start](documentations/chat/QUICKSTART.md)** - Get running in 5 minutes
- **[API Documentation](documentations/chat/API_DOCUMENTATION.md)** - Complete API reference
- **[Changelog](documentations/chat/CHANGELOG.md)** - Version history and updates
- **[Troubleshooting](documentations/TROUBLESHOOTING.md)** - Common issues and solutions

### 🔧 Development Resources
- **[Contributing Guide](documentations/chat/CONTRIBUTING.md)** - How to contribute
- **[Deployment Guide](documentations/chat/DEPLOYMENT.md)** - Production deployment
- **[Security Guide](documentations/chat/SECURITY.md)** - Security best practices

## Troubleshooting

### CUDA not available
```powershell
# Check PyTorch CUDA availability
python -c "import torch; print(torch.cuda.is_available())"
```

### Out of memory errors
- Try using a smaller model variant
- Reduce `max_new_tokens` in the pipeline configuration
- Clear GPU memory by restarting the Python kernel

### BTS Integration Issues
- Ensure BTS backend is running on port 3001
- Check network connectivity between Flask app and BTS
- Verify bug database contains valid data

### Slow performance on CPU
- The model will run significantly slower on CPU
- Consider using a cloud GPU service or upgrading to a CUDA-capable GPU

## Project Structure

```
bug-repro-engine/
├── app.py                      # Flask backend with Phi-3 integration
├── templates/chat.html         # Enhanced web interface
├── bts/src/backend/           # Bug Tracking System backend
├── documentations/            # Complete documentation suite
├── uploads/                   # Uploaded log files
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
