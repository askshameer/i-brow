# Multi-stage Docker build for Bug Repro Engine with Assisted Debugging
# Stage 1: Python environment with Phi-3 model
FROM nvidia/cuda:12.1-devel-ubuntu22.04 AS python-base

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV TORCH_CUDA_ARCH_LIST="6.0 6.1 7.0 7.5 8.0 8.6+PTX"
ENV FORCE_CUDA="1"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy Python requirements
COPY requirements.txt .
COPY requirements-dev.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir --upgrade pip setuptools wheel
RUN pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
RUN pip3 install --no-cache-dir -r requirements.txt

# Stage 2: Node.js environment for BTS backend
FROM node:18-alpine AS node-base

WORKDIR /app/bts

# Copy BTS package files
COPY bts/src/backend/package*.json ./
COPY bts/src/backend/ ./

# Install Node.js dependencies
RUN npm install --production

# Stage 3: Final combined image
FROM nvidia/cuda:12.1-runtime-ubuntu22.04

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    nodejs \
    npm \
    supervisor \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy Python environment from python-base stage
COPY --from=python-base /usr/local/lib/python3.10/dist-packages /usr/local/lib/python3.10/dist-packages
COPY --from=python-base /usr/local/bin /usr/local/bin

# Copy Node.js backend from node-base stage
COPY --from=node-base /app/bts /app/bts

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs /var/log/supervisor

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        proxy_pass http://localhost:5000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    \
    location /api/ { \
        proxy_pass http://localhost:3001/api/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Create supervisor configuration
RUN echo '[supervisord] \
nodaemon=true \
user=root \
\
[program:flask] \
command=python3 app.py \
directory=/app \
autostart=true \
autorestart=true \
stderr_logfile=/var/log/supervisor/flask.err.log \
stdout_logfile=/var/log/supervisor/flask.out.log \
environment=CUDA_VISIBLE_DEVICES="0" \
\
[program:bts] \
command=npm start \
directory=/app/bts \
autostart=true \
autorestart=true \
stderr_logfile=/var/log/supervisor/bts.err.log \
stdout_logfile=/var/log/supervisor/bts.out.log \
\
[program:nginx] \
command=nginx -g "daemon off;" \
autostart=true \
autorestart=true \
stderr_logfile=/var/log/supervisor/nginx.err.log \
stdout_logfile=/var/log/supervisor/nginx.out.log' > /etc/supervisor/conf.d/supervisord.conf

# Install additional Python packages if needed
RUN pip3 install --no-cache-dir supervisor

# Expose ports
EXPOSE 80 5000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=120s --retries=3 \
    CMD curl -f http://localhost/status || exit 1

# Start supervisor to manage all services
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
