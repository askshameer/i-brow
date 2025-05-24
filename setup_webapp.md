
# Phi-3 Web Chatbot Setup Instructions

## Directory Structure

Create the following directory structure:

```
phi3-web-chatbot/
├── app.py
├── requirements.txt
├── templates/
│   └── chat.html
└── static/
    └── (optional: for additional CSS/JS files)
```

## Setup Steps

1. **Create the directory structure:**
   ```bash
   mkdir phi3-web-chatbot
   cd phi3-web-chatbot
   mkdir templates
   ```

2. **Save the files:**
   - Save `app.py` in the root directory
   - Save `chat.html` in the `templates/` directory
   - Save `requirements.txt` in the root directory

3. **Create and activate virtual environment:**
   ```bash
   python -m venv phi3_web_env
   
   # Windows:
   phi3_web_env\Scripts\activate
   
   # macOS/Linux:
   source phi3_web_env/bin/activate
   ```

4. **Install PyTorch (choose based on your system):**
   ```bash
   # For CUDA 11.8:
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   
   # For CPU only:
   pip install torch torchvision torchaudio
   ```

5. **Install other dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run the web application:**
   ```bash
   python app.py
   ```

7. **Access the chatbot:**
   - Open your browser and go to: `http://localhost:5000`
   - The interface will load automatically

## Features

### Chat Interface
- Modern dark theme design
- Real-time chat with loading indicators
- Message timestamps
- Responsive design for mobile devices

### Controls
- **Clear Chat**: Clears conversation history
- **Settings**: Adjust temperature and response length
- **Download History**: Save conversation as text file

### Settings Panel
- **Temperature**: Control response creativity (0.1 - 1.0)
- **Max Response Length**: Control response length (50 - 500 tokens)
- **Model Info**: View current device (GPU/CPU) and model details

### API Endpoints
- `GET /`: Main chat interface
- `POST /chat`: Send message and get response
- `POST /clear`: Clear conversation history
- `GET /history`: Get conversation history
- `POST /settings`: Update model settings
- `GET /status`: Get model status

## Advanced Configuration

### Running on Different Port
```python
# In app.py, change the last line:
app.run(debug=False, host='0.0.0.0', port=8080)
```

### Enabling HTTPS (Production)
```python
# Add SSL context:
app.run(debug=False, host='0.0.0.0', port=5000, ssl_context='adhoc')
```

### Running with Gunicorn (Production)
```bash
pip install gunicorn
gunicorn -w 1 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

1. **Model loading takes too long:**
   - First run downloads the model (~3GB)
   - Subsequent runs will be faster

2. **Out of memory errors:**
   - The 4-bit quantization should work on GPUs with 4GB+ VRAM
   - For less memory, try CPU mode (slower)

3. **Connection refused:**
   - Make sure the Flask server is running
   - Check firewall settings
   - Try accessing via `http://127.0.0.1:5000`

## Security Notes

- The app generates a random secret key for sessions
- For production, use environment variables for sensitive data
- Consider adding authentication for public deployment
