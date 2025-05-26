
# Changelog

All notable changes to Phi-3 Offline Chatbot will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚧 In Development
- Docker containerization with GPU support
- Multi-language interface support
- Batch file analysis
- Export analysis reports as PDF

---

## [1.3.0] - 2025-05-26

### ✨ Added
- **Enhanced Progress Indicators**: Real-time analysis progress with animated visual feedback
- **Interactive Bug Actions**: Contextual action buttons for "Guide Me", "Analyze Log", and "Repro Scenario"
- **Visual State Management**: Animated shimmer effects, rotating progress icons, and completion states
- **Enhanced User Interface**: Updated title to "Bug Repro Engine with Assisted Debugging"
- **Contextual Bug Analysis**: Intelligent analysis tied to specific bug records and contexts
- **Auto-Fetch Integration**: Seamless integration with BTS for automatic log file retrieval
- **Progress Animation System**: CSS animations for analysis states (active, complete, error)

### 🎨 UI/UX Improvements
- **Loading Messages**: Changed from "Phi-3 is thinking" to "Processing Request"
- **Progress Styling**: Added gradient backgrounds, pulsing borders, and rotating icons
- **Completion States**: Visual feedback when analysis completes with green success styling
- **Enhanced Messaging**: Dynamic message updates with state-aware animations
- **Mobile Optimization**: Improved responsive design for progress indicators

### 🔧 Technical Enhancements
- **Message System Refactor**: Enhanced `addMessage()` and `updateMessage()` functions
- **CSS Animation Framework**: Comprehensive keyframe animations for progress states
- **State Management**: Improved animation state handling for seamless transitions
- **Function Enhancement**: Updated `analyzeFile()` and `analyzeFileForBug()` with progress tracking

### 📈 Performance
- **Animation Optimization**: Smooth transitions without performance impact
- **Memory Efficiency**: Better handling of dynamic content updates
- **Visual Feedback**: Immediate user feedback for all operations

---

## [1.2.0] - 2024-01-15

### ✨ Added
- **Log File Analysis**: Upload and analyze error logs, crash dumps, and system logs
- **Drag & Drop Support**: Intuitive file upload via drag and drop
- **Analysis Insights**: AI-powered debugging suggestions and root cause analysis
- **File Type Support**: Added support for `.log`, `.txt`, `.err`, `.crash`, `.trace`, `.dump` files
- **Pattern Recognition**: Automatic detection of errors, warnings, stack traces, and memory issues

### 🔧 Fixed
- **Response Truncation**: Fixed issue where long responses were cut off mid-sentence
- **JSON Serialization**: Resolved "set is not JSON serializable" error in log analysis
- **Token Limits**: Increased max tokens to 600 for more complete responses
- **Retry Logic**: Added automatic retry for incomplete responses

### 📈 Improved
- **Memory Efficiency**: Better handling of large log files (up to 10MB)
- **Error Detection**: Enhanced pattern matching for various log formats
- **UI Feedback**: Added loading indicators for file analysis

---

## [1.1.0] - 2024-01-10

### ✨ Added
- **Settings Panel**: Adjustable temperature and response length
- **Download History**: Export conversation as text file
- **Session Management**: Separate conversations for different users
- **Dark Theme**: Modern dark UI design
- **Mobile Responsive**: Optimized for mobile devices

### 🔧 Fixed
- **GPU Detection**: Better CUDA availability checking
- **Memory Leaks**: Fixed conversation history memory issues
- **Input Validation**: Improved message validation

### 📈 Improved
- **Response Quality**: Better prompt engineering for complete answers
- **Performance**: Optimized model loading with 4-bit quantization
- **UI/UX**: Smoother animations and transitions

---

## [1.0.0] - 2024-01-05

### 🎉 Initial Release

#### Core Features
- **Offline Operation**: Complete privacy with local processing
- **Phi-3 Integration**: Microsoft's Phi-3-mini-4k-instruct model
- **Web Interface**: Flask-based web application
- **GPU Support**: Automatic CUDA acceleration
- **Chat Interface**: Real-time conversation with AI

#### Technical Features
- **4-bit Quantization**: Memory-efficient model loading
- **Conversation History**: Maintains context across messages
- **Cross-Platform**: Windows, Linux, macOS support
- **Easy Setup**: Simple installation process

---

## [0.9.0-beta] - 2023-12-20

### 🧪 Beta Release
- Initial beta testing version
- Basic chat functionality
- Command-line interface only
- Limited to 250 tokens per response

---

## Version History Summary

| Version | Release Date | Major Changes |
|---------|--------------|---------------|
| 1.2.0   | 2024-01-15  | Log analysis, file upload |
| 1.1.0   | 2024-01-10  | Settings, history, dark theme |
| 1.0.0   | 2024-01-05  | First stable release |
| 0.9.0   | 2023-12-20  | Beta release |

---

## Upgrade Instructions

### From 1.1.0 to 1.2.0
```bash
# Update code
git pull origin main

# Install new dependencies (if any)
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

# Restart application
python app.py
```

### From 1.0.0 to 1.1.0
```bash
# Update code
git pull origin main

# Clear cache (optional)
rm -rf __pycache__

# Restart application
python app.py
```

---

## Deprecations

### Planned for 2.0.0
- Python 3.8 support (will require 3.9+)
- Legacy file upload endpoint `/upload_old`

### Removed in 1.2.0
- Console-only mode (replaced by web interface)

---

## Known Issues

### Current
- Large files (>10MB) may cause timeout
- Some Unicode characters in logs may not display correctly
- GPU memory not released properly on Windows in some cases

### Workarounds
- **Large files**: Split into smaller chunks
- **Unicode issues**: Save logs as UTF-8
- **GPU memory**: Restart application if needed

---

## Links

- [Full Documentation](README.md)
- [API Reference](API_DOCUMENTATION.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Report Issues](https://github.com/askshameer/i-brow/issues)

---

**Note**: Dates are in ISO 8601 format (YYYY-MM-DD)
