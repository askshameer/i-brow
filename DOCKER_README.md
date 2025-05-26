# 🐳 Docker Deployment Guide

This guide explains how to deploy the Bug Reproduction Engine using Docker.

## 📋 Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **NVIDIA Container Toolkit** (for GPU support)
- At least **8GB RAM** and **4GB GPU memory**

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd AI_Solution

# Build and start the services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t bug-reproduction-engine:latest .

# Run the container
docker run --gpus all \
  -p 80:80 \
  -p 5000:5000 \
  -p 3001:3001 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/logs:/app/logs \
  bug-reproduction-engine:latest
```

### Option 3: Using build scripts

**Windows PowerShell:**
```powershell
.\build.ps1
```

**Linux/macOS:**
```bash
chmod +x build.sh
./build.sh
```

## 🌐 Access Points

After starting the container:

- **Main Application**: http://localhost
- **Direct Flask App**: http://localhost:5000
- **BTS API**: http://localhost:3001
- **Health Check**: http://localhost/status

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | Flask environment |
| `CUDA_VISIBLE_DEVICES` | `0` | GPU device selection |
| `PYTHONUNBUFFERED` | `1` | Python output buffering |

### Volume Mounts

| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `./uploads` | `/app/uploads` | Uploaded log files |
| `./logs` | `/app/logs` | Application logs |

## 🛠️ Development Mode

For development with live reloading:

```bash
# Use development override
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

This mounts your source code into the container for live development.

## 📊 Monitoring

### Health Checks

The container includes automatic health checks:

```bash
# Check container health
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' <container_id>
```

### Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs bug-reproduction-engine

# Follow logs in real-time
docker-compose logs -f
```

## 🔧 Troubleshooting

### Common Issues

1. **GPU not detected**
   - Ensure NVIDIA Container Toolkit is installed
   - Verify with: `docker run --rm --gpus all nvidia/cuda:12.1-base-ubuntu22.04 nvidia-smi`

2. **Out of memory errors**
   - Reduce model precision in app.py
   - Increase Docker memory limits
   - Use CPU-only mode by setting `CUDA_VISIBLE_DEVICES=""`

3. **Port conflicts**
   - Change port mappings in docker-compose.yml
   - Check for services using ports 80, 5000, or 3001

4. **Model download issues**
   - Ensure internet connectivity during first run
   - Models are cached after first download

### Resource Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8GB | 16GB+ |
| GPU Memory | 4GB | 8GB+ |
| Disk Space | 10GB | 20GB+ |
| CPU | 4 cores | 8+ cores |

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🛡️ Security Notes

- The container runs as root by default
- Logs may contain sensitive information
- Consider using secrets management for production
- Ensure proper firewall configuration

## 📝 Production Deployment

For production environments:

1. Use the production nginx profile:
   ```bash
   docker-compose --profile production up -d
   ```

2. Configure proper SSL certificates
3. Set up log rotation
4. Configure backup strategies for uploads and data
5. Implement monitoring and alerting

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify system requirements
3. Ensure GPU drivers are compatible
4. Check the troubleshooting section above
