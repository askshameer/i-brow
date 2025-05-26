#!/bin/bash
# Build script for Bug Reproduction Engine Docker image

echo "🚀 Building Bug Reproduction Engine Docker Image..."

# Build the Docker image
docker build -t bug-reproduction-engine:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "📦 Image: bug-reproduction-engine:latest"
    echo ""
    echo "To run the container:"
    echo "  docker-compose up -d"
    echo ""
    echo "Or run directly:"
    echo "  docker run --gpus all -p 80:80 -p 5000:5000 -p 3001:3001 bug-reproduction-engine:latest"
else
    echo "❌ Docker build failed!"
    exit 1
fi
