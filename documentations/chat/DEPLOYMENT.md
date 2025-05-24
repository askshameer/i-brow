
# Deployment Guide

## 🏠 Local Network Deployment

### Share with Team Members

1. **Find your IP address**:
   ```bash
   # Windows
   ipconfig
   
   # Linux/macOS
   ifconfig
   ```

2. **Modify app.py** (already configured):
   ```python
   app.run(debug=False, host='0.0.0.0', port=5000)
   ```

3. **Configure Firewall**:
   ```bash
   # Windows - Run as Administrator
   netsh advfirewall firewall add rule name="Phi3 Chatbot" dir=in action=allow protocol=TCP localport=5000
   
   # Linux
   sudo ufw allow 5000/tcp
   ```

4. **Access from other devices**:
   ```
   http://YOUR_IP_ADDRESS:5000
   ```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p templates uploads

# Expose port
EXPOSE 5000

# Run the application
CMD ["python3", "app.py"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  phi3-chatbot:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./uploads:/app/uploads
      - phi3-cache:/root/.cache
    environment:
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    restart: unless-stopped

volumes:
  phi3-cache:
```

### Build and Run
```bash
# Build image
docker build -t phi3-chatbot .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## ☁️ Cloud Deployment

### AWS EC2 Deployment

1. **Choose Instance Type**:
   - Minimum: `g4dn.xlarge` (1 GPU, 4 vCPUs, 16GB RAM)
   - Recommended: `g4dn.2xlarge` (1 GPU, 8 vCPUs, 32GB RAM)

2. **Setup Script**:
   ```bash
   #!/bin/bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install NVIDIA drivers
   sudo apt install -y nvidia-driver-525
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install NVIDIA Container Toolkit
   distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
   curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
   curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
   
   sudo apt update && sudo apt install -y nvidia-container-toolkit
   sudo systemctl restart docker
   
   # Clone and run application
   git clone https://github.com/yourusername/phi3-chatbot.git
   cd phi3-chatbot
   sudo docker-compose up -d
   ```

3. **Security Group Rules**:
   - Inbound: TCP 5000 from your IP range
   - Outbound: All traffic

### Google Cloud Platform

1. **Create VM with GPU**:
   ```bash
   gcloud compute instances create phi3-chatbot \
     --machine-type=n1-standard-4 \
     --accelerator=type=nvidia-tesla-t4,count=1 \
     --image-family=ubuntu-2204-lts \
     --image-project=ubuntu-os-cloud \
     --maintenance-policy=TERMINATE \
     --boot-disk-size=50GB
   ```

2. **Install NVIDIA drivers**:
   ```bash
   curl https://raw.githubusercontent.com/GoogleCloudPlatform/compute-gpu-installation/main/linux/install_gpu_driver.py --output install_gpu_driver.py
   sudo python3 install_gpu_driver.py
   ```

## 🔒 Production Security

### 1. Add Authentication

```python
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

auth = HTTPBasicAuth()

users = {
    "admin": generate_password_hash("your-secure-password")
}

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

# Protect endpoints
@app.route('/chat', methods=['POST'])
@auth.login_required
def chat():
    # ... existing code
```

### 2. HTTPS with Nginx

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 10M;
}
```

### 3. Environment Variables

```python
import os
from dotenv import load_dotenv

load_dotenv()

app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_FILE_SIZE', 10 * 1024 * 1024))
```

## 🚀 Production Optimizations

### 1. Use Gunicorn

```bash
pip install gunicorn

# Run with 4 workers
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 300 app:app
```

### 2. Add Redis for Session Storage

```python
import redis
from flask_session import Session

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')
Session(app)
```

### 3. Implement Request Queuing

```python
from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379')

@celery.task
def analyze_log_async(file_content, filename):
    return chatbot.analyze_log_file(file_content, filename)
```

## 📊 Monitoring

### 1. Add Logging

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/phi3.log', maxBytes=10240000, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### 2. Health Check Endpoint

```python
@app.route('/health')
def health_check():
    try:
        # Check model is loaded
        if chatbot and chatbot.model:
            return jsonify({
                'status': 'healthy',
                'model': 'loaded',
                'device': chatbot.device
            }), 200
    except:
        pass
    
    return jsonify({'status': 'unhealthy'}), 503
```

## 🔄 Backup and Recovery

### Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/phi3-chatbot"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Backup uploads
cp -r uploads/* $BACKUP_DIR/$DATE/

# Backup conversations (if using file-based storage)
cp -r sessions/* $BACKUP_DIR/$DATE/

# Compress
tar -czf $BACKUP_DIR/phi3-backup-$DATE.tar.gz -C $BACKUP_DIR $DATE

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "phi3-backup-*.tar.gz" -mtime +7 -delete
```

## 🌐 Scaling Considerations

### Horizontal Scaling
- Use load balancer (HAProxy/Nginx)
- Shared session storage (Redis)
- Shared file storage (NFS/S3)

### Vertical Scaling
- Increase GPU memory for larger batches
- Add more CPU cores for preprocessing
- Increase RAM for larger conversation histories

### Multi-GPU Setup
```python
# Modify model loading for multi-GPU
if torch.cuda.device_count() > 1:
    self.model = torch.nn.DataParallel(self.model)
```

## 📝 Production Checklist

- [ ] SSL/TLS certificates configured
- [ ] Authentication implemented
- [ ] Firewall rules configured
- [ ] Backup strategy in place
- [ ] Monitoring and alerts set up
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] Security headers added
- [ ] Environment variables secured
- [ ] Health checks configured
- [ ] Auto-restart on failure
- [ ] Resource limits set
- [ ] Update strategy planned
