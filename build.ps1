# Build script for Bug Reproduction Engine Docker image (Windows)

Write-Host "🚀 Building Bug Reproduction Engine Docker Image..." -ForegroundColor Cyan

# Build the Docker image
docker build -t bug-reproduction-engine:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host "📦 Image: bug-reproduction-engine:latest" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run the container:" -ForegroundColor Cyan
    Write-Host "  docker-compose up -d" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run directly:" -ForegroundColor Cyan
    Write-Host "  docker run --gpus all -p 80:80 -p 5000:5000 -p 3001:3001 bug-reproduction-engine:latest" -ForegroundColor White
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
