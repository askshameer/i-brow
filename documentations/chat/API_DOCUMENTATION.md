
# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
No authentication required (local deployment only)

## Response Format
All API responses follow this structure:

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "ISO-8601 timestamp"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## Endpoints

### Chat Endpoints

#### Send Message
```http
POST /chat
Content-Type: application/json

{
  "message": "What is a segmentation fault?"
}
```

**Response:**
```json
{
  "response": "A segmentation fault is a specific kind of error...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing message
- `500`: Server error

---

### File Management Endpoints

#### Upload File
```http
POST /upload
Content-Type: multipart/form-data

file: [binary data]
```

**Response:**
```json
{
  "status": "success",
  "file": {
    "id": "a1b2c3d4",
    "filename": "app.log",
    "filepath": "/uploads/20240101_120000_app.log",
    "size": 102400,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200`: Upload successful
- `400`: No file or invalid file type
- `413`: File too large

**File Size Limit:** 10MB (configurable)

**Allowed Extensions:** 
- `.txt`, `.log`, `.err`, `.out`
- `.crash`, `.trace`, `.dmp`, `.dump`

---

#### Analyze File
```http
POST /analyze/{file_id}
```

**Response:**
```json
{
  "status": "success",
  "analysis": "Based on the log analysis, I found 3 critical errors...",
  "findings": {
    "summary": "Found 15 errors including 3 critical issues",
    "error_count": 15,
    "warning_count": 42,
    "critical_issues": [
      "Null pointer exception at line 145",
      "Memory leak detected at line 203"
    ],
    "has_stack_traces": true
  },
  "filename": "app.log"
}
```

**Status Codes:**
- `200`: Analysis complete
- `404`: File not found
- `500`: Analysis error

---

### Bug Tracking System (BTS) Integration

#### Get All Bugs
```http
GET /bts/bugs
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "BUG-DEMO-1748084066155-17",
      "title": "Application crashes with segmentation fault",
      "description": "The application crashes unexpectedly...",
      "status": "open",
      "priority": "high",
      "category": "crash",
      "assignedTo": "dev-team",
      "severity": "critical",
      "platform": "Linux",
      "createdAt": "2025-01-15T10:30:00Z",
      "logPath": "C:\\Users\\moham\\Downloads\\Linux_2k.log",
      "tags": ["crash", "segfault", "memory"]
    }
  ]
}
```

---

#### Get Specific Bug
```http
GET /bts/bugs/{bug_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "BUG-DEMO-1748084066155-17",
    "title": "Application crashes with segmentation fault",
    "description": "The application crashes unexpectedly...",
    "status": "open",
    "priority": "high",
    "category": "crash",
    "assignedTo": "dev-team",
    "severity": "critical",
    "platform": "Linux",
    "createdAt": "2025-01-15T10:30:00Z",
    "logPath": "C:\\Users\\moham\\Downloads\\Linux_2k.log",
    "tags": ["crash", "segfault", "memory"]
  }
}
```

---

#### Auto-Fetch Log File
```http
POST /fetch-log
Content-Type: application/json

{
  "logPath": "C:\\Users\\moham\\Downloads\\Linux_2k.log"
}
```

**Response:**
```json
{
  "status": "success",
  "file": {
    "id": "auto_fetched_123",
    "filename": "Linux_2k.log",
    "filepath": "/uploads/20250526_auto_Linux_2k.log",
    "size": 204800,
    "timestamp": "2025-05-26T12:00:00.000Z",
    "source": "auto-fetch"
  }
}
```

**Status Codes:**
- `200`: Log fetched successfully
- `400`: Invalid log path
- `404`: Log file not found
- `500`: Server error

---

#### Analyze File for Bug Context
```http
POST /analyze-bug/{file_id}
Content-Type: application/json

{
  "bugId": "BUG-DEMO-1748084066155-17",
  "context": "Analyzing crash logs for segmentation fault investigation"
}
```

**Response:**
```json
{
  "status": "success",
  "analysis": "Based on the bug context and log analysis...",
  "findings": {
    "bug_related": true,
    "confidence": 0.95,
    "key_indicators": ["segmentation fault", "memory access violation"],
    "recommendations": ["Check pointer dereferencing", "Verify memory allocation"]
  }
}
```

---

### Enhanced Progress Tracking

#### Real-Time Analysis Status
All analysis endpoints now support enhanced progress tracking with visual feedback:

**Progress States:**
- `analysis-active`: Shows animated progress indicators
- `analysis-complete`: Shows completion state with success styling
- `analysis-error`: Shows error state with appropriate styling

**Visual Features:**
- Shimmer animations during processing
- Rotating progress icons
- Pulsing border effects
- Gradient backgrounds
- Smooth state transitions

---

#### Clear Session
```http
POST /clear
```

**Response:**
```json
{
  "status": "success",
  "message": "Conversation cleared"
}
```

---

#### Get History
```http
GET /history
```

**Response:**
```json
{
  "history": [
    {
      "user": "What is Python?",
      "assistant": "Python is a high-level programming language...",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### Configuration

#### Update Settings
```http
POST /settings
Content-Type: application/json

{
  "temperature": 0.7,
  "max_tokens": 400
}
```

**Parameters:**
- `temperature`: Float (0.1 - 1.0) - Response creativity
- `max_tokens`: Integer (50 - 600) - Maximum response length

**Response:**
```json
{
  "status": "success",
  "message": "Temperature set to 0.7"
}
```

---

#### Get Status
```http
GET /status
```

**Response:**
```json
{
  "status": "online",
  "device": "cuda",
  "temperature": 0.3,
  "max_tokens": 400,
  "model": "Phi-3-mini-4k-instruct"
}
```

## Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check request format |
| 404 | Not Found | Verify file ID or endpoint |
| 413 | File Too Large | Reduce file size to under 10MB |
| 500 | Internal Error | Check server logs |

## Rate Limiting

No rate limiting (local deployment)

## Examples

### Python Example
```python
import requests

# Send a message
response = requests.post('http://localhost:5000/chat', 
    json={'message': 'Hello, Phi-3!'})
print(response.json()['response'])

# Upload and analyze a file
with open('error.log', 'rb') as f:
    upload = requests.post('http://localhost:5000/upload', 
        files={'file': f})
    file_id = upload.json()['file']['id']
    
    # Analyze the file
    analysis = requests.post(f'http://localhost:5000/analyze/{file_id}')
    print(analysis.json()['analysis'])
```

### JavaScript Example
```javascript
// Send a message
fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: 'Hello, Phi-3!'})
})
.then(res => res.json())
.then(data => console.log(data.response));

// Upload a file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData
})
.then(res => res.json())
.then(data => {
    // Analyze the uploaded file
    return fetch(`/analyze/${data.file.id}`, {method: 'POST'});
})
.then(res => res.json())
.then(data => console.log(data.analysis));
```

### cURL Examples
```bash
# Send a message
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a memory leak?"}'

# Upload a file
curl -X POST http://localhost:5000/upload \
  -F "file=@error.log"

# Get status
curl http://localhost:5000/status
```

## WebSocket Support

Currently not implemented. All communication is via REST API.

## CORS Policy

CORS is enabled for all origins (development mode). For production, configure specific origins in `app.py`.
