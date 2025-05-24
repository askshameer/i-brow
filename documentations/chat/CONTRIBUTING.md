
# Contributing to Phi-3 Offline Chatbot

First off, thank you for considering contributing to Phi-3 Offline Chatbot! It's people like you that make this tool better for everyone. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion, or sexual identity

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

1. **Clear title and description**
2. **Steps to reproduce**
   ```
   1. Go to '...'
   2. Click on '....'
   3. Scroll down to '....'
   4. See error
   ```
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** (if applicable)
6. **Environment details**:
   - OS: [e.g., Windows 11]
   - Python version: [e.g., 3.10.0]
   - CUDA version: [e.g., 11.8]
   - GPU: [e.g., NVIDIA RTX 3070]
   - Browser: [e.g., Chrome 120]

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When creating an enhancement suggestion, include:**
- **Clear title and description**
- **Use case** - Why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** you've considered
- **Additional context** (mockups, examples, etc.)

### Code Contributions

#### Your First Code Contribution

Unsure where to begin? Look for these tags:
- `good first issue` - Simple issues for beginners
- `help wanted` - Issues needing attention
- `documentation` - Documentation improvements
- `bug` - Bug fixes needed
- `enhancement` - New features or improvements

#### Development Workflow

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/phi3-chatbot.git
   cd phi3-chatbot
   ```

3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

4. **Set up development environment**:
   ```bash
   python -m venv phi3_dev
   source phi3_dev/bin/activate  # Windows: phi3_dev\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # Development dependencies
   ```

5. **Make your changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Update documentation if needed

6. **Test your changes**:
   ```bash
   # Run unit tests
   python -m pytest tests/
   
   # Run linting
   python -m flake8 app.py
   
   # Test manually
   python app.py
   ```

7. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add log pattern for kubernetes errors"
   # Use conventional commits (see below)
   ```

8. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex parts
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Commit messages follow conventions

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Tested on GPU
- [ ] Tested on CPU
- [ ] Tested file upload/analysis
- [ ] Tested on Windows/Linux/macOS

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
```

### Review Process

1. Automated checks run (linting, tests)
2. Code review by maintainers
3. Address feedback
4. Approval and merge

## 💻 Style Guidelines

### Python Code Style

Follow PEP 8 with these specifics:

```python
# Good: Clear variable names
user_message = request.json.get('message', '')

# Bad: Unclear names
msg = request.json.get('message', '')

# Good: Docstrings for functions
def analyze_log_file(self, file_content: str, filename: str) -> dict:
    """
    Analyze a log file and generate insights.
    
    Args:
        file_content: The content of the log file
        filename: Name of the file being analyzed
        
    Returns:
        Dictionary containing analysis results and findings
    """
    pass

# Good: Type hints
def process_message(message: str, max_length: int = 500) -> str:
    pass
```

### JavaScript/HTML/CSS Style

```javascript
// Good: Clear function names and comments
async function analyzeFile(fileId) {
    // Disable button during analysis
    const button = document.getElementById(`analyze-${fileId}`);
    button.disabled = true;
    
    try {
        const response = await fetch(`/analyze/${fileId}`, {
            method: 'POST'
        });
        // ... rest of function
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```bash
feat(analysis): add support for JSON log files

fix(chat): prevent response truncation for long outputs
- Increased max_tokens to 600
- Added retry logic for incomplete responses
- Fixes #123

docs(api): update endpoint documentation with examples

refactor(log-analyzer): optimize pattern matching for large files
```

## 🧪 Testing Guidelines

### Unit Tests

Create tests in the `tests/` directory:

```python
# tests/test_log_analyzer.py
import pytest
from app import LogAnalyzer

def test_extract_errors():
    """Test error extraction from log content."""
    content = "ERROR: Database connection failed\nINFO: Starting app"
    analyzer = LogAnalyzer()
    findings = analyzer.extract_key_info(content)
    
    assert findings['error_count'] == 1
    assert 'database' in findings['errors'][0]['content'].lower()
```

### Integration Tests

```python
# tests/test_api.py
def test_chat_endpoint(client):
    """Test chat endpoint responds correctly."""
    response = client.post('/chat', 
        json={'message': 'Hello'})
    
    assert response.status_code == 200
    assert 'response' in response.json
```

### Manual Testing Checklist

- [ ] Chat functionality works
- [ ] File upload accepts valid files
- [ ] File analysis provides meaningful results
- [ ] Settings update correctly
- [ ] UI is responsive on mobile
- [ ] No console errors in browser

## 📝 Documentation

### When to Update Documentation

Update docs when you:
- Add new features
- Change API endpoints
- Modify installation process
- Add new dependencies
- Change configuration options

### Documentation Standards

1. **Clear and concise** - Avoid jargon
2. **Include examples** - Show, don't just tell
3. **Keep it updated** - Outdated docs are worse than no docs
4. **Test your docs** - Ensure instructions work

### Where to Document

- **Code comments**: For complex logic
- **Docstrings**: For functions and classes
- **README.md**: For major features
- **API_DOCUMENTATION.md**: For endpoint changes
- **CHANGELOG.md**: For all changes

## 🌐 Community

### Getting Help

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: [maintainer@example.com]

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commits

## 🎯 Areas Needing Help

### High Priority
- 🧪 Test coverage improvement
- 📱 Mobile UI enhancements
- 🌍 Internationalization support
- 🔧 Performance optimization

### Good First Issues
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🐛 Simple bug fixes
- ✨ Small feature additions

### Advanced Contributions
- 🧠 Model optimization
- 📊 Advanced log analysis patterns
- 🔄 Real-time log streaming
- 🔌 Plugin system

## 📌 Final Notes

- **Be patient** - Reviews may take time
- **Be open** - To feedback and suggestions
- **Be respectful** - To all community members
- **Have fun** - Enjoy contributing!

Thank you for making Phi-3 Offline Chatbot better! 🚀

---

**Questions?** Feel free to open an issue or reach out to the maintainers.
