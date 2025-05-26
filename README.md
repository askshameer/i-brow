
# Phi-3 Offline Chatbot with BTS Integration

An offline chatbot implementation using Microsoft's Phi-3 model with integrated Bug Tracking System (BTS) and web interface for log analysis and bug management.

## Features

- 🚀 GPU-accelerated inference with CUDA support
- 💬 Conversational memory and chat history
- 🐛 Integrated Bug Tracking System (BTS) with lookup functionality
- 📁 Log file analysis and crash dump examination
- 🌐 Modern web interface with dark theme
- 📦 Fully offline operation
- 🔧 Configurable AI parameters (temperature, max tokens)
- 📱 Responsive design for mobile and desktop

## Components

### 1. Phi-3 Chatbot (Flask Backend)
- **File**: `app.py`
- Microsoft Phi-3-mini-4k-instruct model
- Log analysis capabilities
- File upload and processing
- BTS integration endpoints

### 2. Bug Tracking System (BTS)
- **Location**: `bts/src/backend/`
- Node.js REST API server
- JSON-based bug database
- CRUD operations for bug management
- Demo data included

### 3. Web Interface
- **Template**: `templates/chat.html`
- Modern dark theme UI
- Real-time chat interface
- Bug lookup functionality
- File upload with drag-and-drop
- Responsive design

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
