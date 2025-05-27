# Developer Guide

This comprehensive guide provides detailed information for developers working on the Bug Repro Engine with Assisted Debugging project.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Architecture Overview

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Flask Backend  │    │  BTS Backend    │
│   (Browser)     │◄──►│   (Python)      │◄──►│   (Node.js)     │
│                 │    │                 │    │                 │
│ - Chat UI       │    │ - AI Model      │    │ - Bug Database  │
│ - File Upload   │    │ - Log Analysis  │    │ - Bug API       │
│ - Bug Display   │    │ - File Handler  │    │ - Search Engine │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Backend**: Flask (Python), Express.js (Node.js)
- **AI Model**: Microsoft Phi-3-mini-4k-instruct
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: JSON-based file storage
- **ML Framework**: PyTorch, Transformers (Hugging Face)

## Development Environment Setup

### Prerequisites
- Python 3.8-3.11
- Node.js 18+
- Git
- Code editor (VS Code recommended)

### Initial Setup

#### Windows Development Environment
```powershell
# Clone repository
git clone https://github.com/askshameer/i-brow.git
cd AI_Solution

# Setup Python environment
python -m venv phi3_env
.\phi3_env\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Setup Node.js environment
cd bts
npm install
npm run dev  # Development mode

# Return to root
cd ..
```

#### Linux Development Environment
```bash
# Clone repository
git clone https://github.com/your-username/AI_Solution.git
cd AI_Solution

# Setup Python environment
python3 -m venv phi3_env
source phi3_env/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Setup Node.js environment
cd bts
npm install
npm run dev  # Development mode

# Return to root
cd ..
```

### Development Dependencies
```python
# requirements-dev.txt
pytest>=7.0.0
pytest-flask>=1.2.0
pytest-cov>=4.0.0
black>=22.0.0
flake8>=5.0.0
mypy>=1.0.0
pre-commit>=2.20.0
```

### IDE Configuration

#### VS Code Extensions
- Python
- Pylance
- JavaScript (ES6) code snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (for API testing)

#### VS Code Settings (.vscode/settings.json)
```json
{
    "python.defaultInterpreterPath": "./phi3_env/Scripts/python.exe",
    "python.terminal.activateEnvironment": true,
    "python.formatting.provider": "black",
    "python.linting.flake8Enabled": true,
    "python.linting.mypyEnabled": true,
    "editor.formatOnSave": true,
    "files.autoSave": "onFocusChange"
}
```

## Project Structure

```
AI_Solution/
├── app.py                      # Main Flask application
├── main.py                     # Alternative entry point
├── requirements.txt            # Python dependencies
├── requirements-dev.txt        # Development dependencies
├── Dockerfile                  # Container configuration
├── docker-compose.yml          # Multi-service setup
├── README.md                   # Project overview
├── CHANGELOG.md               # Version history
│
├── templates/                  # HTML templates
│   └── chat.html              # Main chat interface
│
├── uploads/                    # File upload directory
│   └── .gitkeep               # Keep directory in git
│
├── bts/                       # Bug Tracking System
│   ├── package.json           # Node.js dependencies
│   ├── src/
│   │   ├── backend/           # Express.js API server
│   │   │   ├── server.js      # Main server file
│   │   │   ├── package.json   # Backend dependencies
│   │   │   └── bugs_database.json  # Bug data storage
│   │   └── components/        # React components (if using frontend)
│   └── public/                # Static files
│
├── tests/                     # Test files
│   ├── __init__.py
│   ├── conftest.py           # Pytest configuration
│   ├── test_app.py           # Main app tests
│   ├── test_log_analyzer.py  # Log analysis tests
│   └── test_minimal.py       # Basic functionality tests
│
├── documentations/            # Documentation
│   ├── GETTING_STARTED.md    # Setup guide
│   ├── DEVELOPER_GUIDE.md    # This file
│   ├── TROUBLESHOOTING.md    # Common issues
│   └── chat/                 # Component documentation
│
├── phi3_env/                 # Python virtual environment
└── .github/                  # GitHub workflows (if applicable)
```

### Key Files Explained

#### app.py
Main Flask application containing:
- Model loading and initialization
- API endpoints for chat, file upload, analysis
- Configuration management
- Error handling

#### templates/chat.html
Single-page application with:
- Chat interface
- File upload functionality
- Bug lookup system
- Real-time updates

#### bts/src/backend/server.js
Bug Tracking System API providing:
- Bug CRUD operations
- Search functionality
- Category management
- Priority handling

## Development Workflow

### 1. Setting Up Development Environment
```bash
# Start development servers
# Terminal 1: Flask development server
source phi3_env/bin/activate  # Linux
# or .\phi3_env\Scripts\Activate.ps1  # Windows
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py

# Terminal 2: BTS development server
cd bts/src/backend
npm run dev
```

### 2. Making Changes

#### Backend Development (Python)
```python
# app.py example modification
@app.route('/api/custom-endpoint', methods=['POST'])
def custom_endpoint():
    try:
        data = request.get_json()
        # Your logic here
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

#### Frontend Development (JavaScript)
```javascript
// templates/chat.html - adding new functionality
async function newFeature() {
    try {
        const response = await fetch('/api/custom-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        // Handle response
    } catch (error) {
        console.error('Error:', error);
    }
}
```

#### BTS Development (Node.js)
```javascript
// bts/src/backend/server.js - adding new routes
app.get('/api/bugs/custom', (req, res) => {
    try {
        // Your logic here
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### 3. Testing Changes
```bash
# Run Python tests
pytest tests/ -v --cov=app

# Run specific test file
pytest tests/test_app.py -v

# Run with coverage report
pytest tests/ --cov=app --cov-report=html
```

### 4. Code Quality
```bash
# Format Python code
black app.py

# Lint Python code
flake8 app.py

# Type checking
mypy app.py

# Format JavaScript (if using Prettier)
npx prettier --write templates/chat.html
```

## API Reference

### Flask Backend Endpoints

#### Chat and Analysis
```http
POST /chat
Content-Type: application/json

{
    "message": "User input text",
    "history": [...] // Optional conversation history
}

Response:
{
    "response": "AI response text",
    "status": "success"
}
```

#### File Upload
```http
POST /upload
Content-Type: multipart/form-data

Form data: file (binary)

Response:
{
    "file_id": "unique_identifier",
    "filename": "original_filename.log",
    "size": 1024,
    "status": "uploaded"
}
```

#### File Analysis
```http
POST /analyze/<file_id>

Response:
{
    "analysis": "Detailed analysis text",
    "findings": {
        "errors": [...],
        "warnings": [...],
        "critical_issues": [...],
        "file_paths": [...],
        "stack_traces": [...]
    },
    "status": "success"
}
```

#### Application Status
```http
GET /status

Response:
{
    "model_loaded": true,
    "device": "cuda",
    "temperature": 0.7,
    "max_tokens": 512,
    "uptime": "2h 15m"
}
```

### BTS Backend Endpoints

#### Bug Management
```http
GET /api/bugs
GET /api/bugs/:id
POST /api/bugs
PUT /api/bugs/:id
DELETE /api/bugs/:id

GET /api/bugs/search?q=search_term
GET /api/bugs/category/:category
GET /api/bugs/priority/:priority
```

## Testing

### Test Structure
```python
# tests/test_app.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_status_endpoint(client):
    """Test the status endpoint"""
    rv = client.get('/status')
    assert rv.status_code == 200
    data = rv.get_json()
    assert 'model_loaded' in data

def test_chat_endpoint(client):
    """Test the chat endpoint"""
    rv = client.post('/chat', 
                    json={'message': 'Hello'})
    assert rv.status_code == 200
    data = rv.get_json()
    assert 'response' in data
```

### Running Tests
```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test
pytest tests/test_app.py::test_status_endpoint

# Run with coverage
pytest --cov=app --cov-report=html

# Generate coverage report
open htmlcov/index.html  # View coverage report
```

### Test Categories
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Component interaction testing
3. **API Tests**: Endpoint functionality testing
4. **Performance Tests**: Load and response time testing

## Performance Optimization

### Model Optimization
```python
# Use quantization for faster inference
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=quantization_config,
    device_map="auto"
)
```

### Caching Strategies
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def analyze_log_cached(file_content_hash):
    """Cache analysis results for identical files"""
    return analyze_log_content(file_content)
```

### Memory Management
```python
import gc
import torch

def cleanup_memory():
    """Clean up GPU memory after processing"""
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    gc.collect()
```

## Deployment

### Docker Deployment
```dockerfile
# Dockerfile optimization
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . /app
WORKDIR /app

EXPOSE 5000
CMD ["python", "app.py"]
```

### Production Configuration
```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'

class ProductionConfig(Config):
    DEBUG = False
    MODEL_CACHE_DIR = '/opt/models'
    LOG_LEVEL = 'INFO'

class DevelopmentConfig(Config):
    DEBUG = True
    MODEL_CACHE_DIR = './models'
    LOG_LEVEL = 'DEBUG'
```

### Environment Variables
```bash
# .env file for production
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
MODEL_CACHE_DIR=/opt/models
UPLOAD_FOLDER=/opt/uploads
BTS_API_URL=http://localhost:3001
```

## Contributing

### Development Process
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Make** changes and test thoroughly
4. **Commit** with descriptive messages
5. **Push** to your fork
6. **Create** a Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(api): add new log analysis endpoint

- Implement advanced pattern recognition
- Add support for custom log formats
- Include performance metrics

Closes #123
```

### Code Style Guidelines
- **Python**: Follow PEP 8, use Black formatter
- **JavaScript**: Use ES6+ features, consistent indentation
- **HTML/CSS**: Semantic markup, BEM methodology
- **Comments**: Document complex logic and API endpoints

### Pull Request Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No breaking changes (or clearly documented)

## Advanced Development Topics

### Custom Model Integration
```python
# Adding support for different models
class ModelManager:
    def __init__(self):
        self.models = {}
    
    def load_model(self, model_name, config):
        """Load and cache models dynamically"""
        if model_name not in self.models:
            self.models[model_name] = AutoModelForCausalLM.from_pretrained(
                model_name, **config
            )
        return self.models[model_name]
```

### Plugin Architecture
```python
# Plugin system for extensibility
class PluginManager:
    def __init__(self):
        self.plugins = []
    
    def register_plugin(self, plugin):
        """Register analysis plugins"""
        self.plugins.append(plugin)
    
    def analyze_with_plugins(self, content):
        """Run analysis through all plugins"""
        results = {}
        for plugin in self.plugins:
            results[plugin.name] = plugin.analyze(content)
        return results
```

### Real-time Features
```javascript
// WebSocket implementation for real-time updates
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    updateUI(data);
};

function sendAnalysisRequest(fileId) {
    ws.send(JSON.stringify({
        type: 'analyze',
        fileId: fileId
    }));
}
```

## Troubleshooting Development Issues

### Common Problems
1. **Model Loading Issues**: Check memory availability and model cache
2. **Port Conflicts**: Use different ports for development
3. **Dependencies**: Keep requirements.txt updated
4. **CUDA Issues**: Verify GPU driver compatibility

### Debug Mode
```python
# Enable detailed logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Add debug endpoints
@app.route('/debug/memory')
def debug_memory():
    import psutil
    return jsonify({
        'memory_percent': psutil.virtual_memory().percent,
        'available_gb': psutil.virtual_memory().available / (1024**3)
    })
```

For more specific issues, check the [Troubleshooting Guide](TROUBLESHOOTING.md).
