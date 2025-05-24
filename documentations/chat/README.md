
# Phi-3 Offline Chatbot with Log Analysis

A powerful offline AI chatbot powered by Microsoft's Phi-3 model, featuring a modern web interface and advanced log file analysis capabilities. Perfect for developers and system administrators who need intelligent debugging assistance without sending sensitive data to cloud services.

## 🌟 Features

### Core Capabilities
- **100% Offline Operation**: All processing happens locally on your machine
- **GPU Acceleration**: Automatic CUDA support for faster responses
- **Web Interface**: Modern, responsive design with dark theme
- **Log Analysis**: Intelligent analysis of error logs and crash dumps
- **Session Management**: Maintains conversation context across interactions
- **File Upload Support**: Drag-and-drop or browse for log files

### Technical Features
- 4-bit quantization for efficient memory usage
- Conversation history with export functionality
- Adjustable response parameters (temperature, length)
- Real-time status indicators
- Multi-format log file support

## 📋 Requirements

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **GPU**: NVIDIA GPU with 4GB+ VRAM (optional but recommended)
- **Storage**: ~5GB free space for model files
- **OS**: Windows 10/11, Linux, macOS

### Software Requirements
- Python 3.8 or higher
- CUDA Toolkit 11.8+ (for GPU acceleration)
- Git (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/phi3-chatbot.git
cd phi3-chatbot
```

### 2. Create Project Structure
```bash
mkdir templates
mkdir uploads
```

### 3. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv phi3_env

# Activate virtual environment
# Windows:
phi3_env\Scripts\activate

# Linux/macOS:
source phi3_env/bin/activate
```

### 4. Install PyTorch
Choose the appropriate command for your system:

**For CUDA 11.8 (GPU)**:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**For CPU only**:
```bash
pip install torch torchvision torchaudio
```

### 5. Install Dependencies
```bash
pip install -r requirements.txt
```

### 6. Save Application Files
- Save `app.py` in the root directory
- Save `chat.html` in the `templates/` directory

## 💻 Usage

### Starting the Application
```bash
python app.py
```

The application will:
1. Load the Phi-3 model (first run will download ~3GB)
2. Start the web server on port 5000
3. Display the URL: `http://localhost:5000`

### Web Interface Guide

#### Chat Features
- **Send Message**: Type in the input field and press Enter or click Send
- **Clear Chat**: Remove all messages and start fresh
- **Download History**: Export conversation as a text file

#### File Upload and Analysis
1. **Upload Methods**:
   - Click the 📎 attachment button
   - Drag and drop files onto the upload area
   - Browse and select files

2. **Supported File Types**:
   - `.log` - Standard log files
   - `.txt` - Text logs
   - `.err` - Error logs
   - `.out` - Output logs
   - `.crash` - Crash dumps
   - `.trace` - Stack traces
   - `.dmp` - Memory dumps

3. **Analysis Process**:
   - Upload a log file
   - Click the "Analyze" button
   - Receive AI-powered insights and debugging suggestions

#### Settings Panel
- **Temperature** (0.1-1.0): Controls response creativity
  - Lower values (0.1-0.3): More focused, deterministic
  - Higher values (0.7-1.0): More creative, varied
- **Max Response Length** (50-600 tokens): Controls response verbosity

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
# Server Configuration
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Model Configuration
MODEL_NAME=microsoft/Phi-3-mini-4k-instruct
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Paths
UPLOAD_FOLDER=uploads
```

### Advanced Settings
Modify these in `app.py`:
```python
# Adjust generation parameters
self.max_new_tokens = 400  # Default response length
self.temperature = 0.3     # Default creativity
self.top_p = 0.95         # Nucleus sampling parameter

# Modify file upload limits
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
```

## 📡 API Reference

### Endpoints

#### `GET /`
Returns the main chat interface HTML page.

#### `POST /chat`
Send a message and receive AI response.

**Request Body**:
```json
{
  "message": "Your message here"
}
```

**Response**:
```json
{
  "response": "AI response text",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### `POST /upload`
Upload a log file for analysis.

**Request**: Multipart form data with file

**Response**:
```json
{
  "status": "success",
  "file": {
    "id": "abc12345",
    "filename": "error.log",
    "size": 1024,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

#### `POST /analyze/{file_id}`
Analyze an uploaded file.

**Response**:
```json
{
  "status": "success",
  "analysis": "Detailed analysis text...",
  "findings": {
    "summary": "Found 5 errors",
    "error_count": 5,
    "warning_count": 10,
    "critical_issues": ["Segmentation fault at line 123"],
    "has_stack_traces": true
  }
}
```

#### `POST /clear`
Clear the current session's conversation history.

#### `GET /history`
Retrieve conversation history for the current session.

#### `POST /settings`
Update model parameters.

**Request Body**:
```json
{
  "temperature": 0.5,
  "max_tokens": 300
}
```

#### `GET /status`
Get current system status and configuration.

## 🐛 Troubleshooting

### Common Issues

#### 1. CUDA/GPU Not Detected
```
WARNING: CUDA not available. Running on CPU.
```
**Solution**: 
- Verify CUDA installation: `nvidia-smi`
- Check PyTorch CUDA: `python -c "import torch; print(torch.cuda.is_available())"`
- Reinstall PyTorch with correct CUDA version

#### 2. Out of Memory Error
```
torch.cuda.OutOfMemoryError: CUDA out of memory
```
**Solutions**:
- Close other GPU applications
- Use CPU mode (slower but works)
- Reduce batch size in code

#### 3. Model Download Issues
**Solution**:
- Check internet connection
- Clear Hugging Face cache: `rm -rf ~/.cache/huggingface/`
- Use a different mirror or manual download

#### 4. File Upload Errors
**Solutions**:
- Check file size (max 10MB by default)
- Verify file extension is allowed
- Ensure uploads folder exists and is writable

### Performance Optimization

#### For Faster Responses:
1. Use GPU acceleration (CUDA)
2. Reduce max_tokens for shorter responses
3. Lower temperature for more deterministic outputs
4. Close unnecessary browser tabs

#### For Better Analysis:
1. Upload well-formatted log files
2. Include full stack traces
3. Keep log files under 5MB for optimal performance
4. Include timestamps in logs

## 🛠️ Development

### Project Structure
```
phi3-chatbot/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── README.md          # This documentation
├── templates/
│   └── chat.html      # Web interface
├── uploads/           # Temporary file storage
└── phi3_env/         # Virtual environment (not in git)
```

### Adding New Features

#### Custom Log Patterns
Add new patterns in `LogAnalyzer.extract_key_info()`:
```python
patterns = {
    'custom_error': re.compile(r'YOUR_PATTERN_HERE', re.IGNORECASE),
    # Add more patterns...
}
```

#### New File Types
Add extensions to `ALLOWED_EXTENSIONS`:
```python
ALLOWED_EXTENSIONS = {'txt', 'log', 'xml', 'json', ...}
```

## 🔒 Security Considerations

1. **Local Operation**: All data stays on your machine
2. **Session Management**: Each user gets a unique session
3. **File Handling**: 
   - Filename sanitization prevents path traversal
   - File size limits prevent DoS
   - Temporary files are session-scoped
4. **No External APIs**: No data sent to external services

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Guidelines
- Follow PEP 8 for Python code
- Add comments for complex logic
- Update documentation for new features
- Include error handling
- Test on both CPU and GPU

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Microsoft for the Phi-3 model
- Hugging Face for the Transformers library
- Flask community for the web framework
- Contributors and testers

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with:
   - System information
   - Error messages
   - Steps to reproduce

## 🚧 Roadmap

### Planned Features
- [ ] Docker containerization
- [ ] Multi-language support
- [ ] Enhanced log pattern detection
- [ ] Batch file analysis
- [ ] Real-time log streaming
- [ ] Integration with monitoring tools
- [ ] Custom model fine-tuning
- [ ] Export analysis reports as PDF

### Known Limitations
- Maximum file size: 10MB (configurable)
- GPU memory requirements: 4GB+ VRAM
- First load takes 3-5 minutes
- Limited to text-based logs

---

**Note**: This is an offline tool designed for privacy-conscious users. Your data never leaves your machine.
