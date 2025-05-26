# Troubleshooting Guide

## CUDA and GPU-Related Issues

### CUDA Version Compatibility
- **Symptom**: CUDA version mismatch or "CUDA not available" errors
- **Solution**: 
  1. Check your NVIDIA driver and CUDA versions:
     ```powershell
     nvidia-smi
     ```
  2. Install PyTorch with the closest supported CUDA version
     ```bash
     pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu121
     ```
  3. Set CUDA environment variables in PowerShell:
     ```powershell
     $env:CUDA_PATH = "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8"
     $env:CUDA_HOME = "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8"
     ```

### Bitsandbytes Installation Issues
- **Symptom**: Import errors or "CUDA capabilities not found" with bitsandbytes
- **Solution**:
  1. Uninstall existing installations:
     ```bash
     pip uninstall bitsandbytes bitsandbytes-windows
     ```
  2. Install the latest version:
     ```bash
     pip install bitsandbytes
     ```
  3. Verify installation:
     ```python
     import torch
     import bitsandbytes as bnb
     print(torch.cuda.is_available())
     print(torch.cuda.get_device_name(0))
     ```

### Common Error Messages and Solutions

#### "CUDA out of memory"
- **Symptom**: RuntimeError: CUDA out of memory
- **Solution**:
  1. Reduce batch size
  2. Enable gradient checkpointing
  3. Use 8-bit or 4-bit quantization
  4. Clear CUDA cache:
     ```python
     torch.cuda.empty_cache()
     ```

#### "CUDA kernel not found"
- **Symptom**: Missing CUDA kernel or operation not supported
- **Solution**:
  1. Verify CUDA toolkit installation
  2. Check PyTorch CUDA version matches installed CUDA
  3. Update GPU drivers
  4. Use supported operations for your GPU architecture

## Environment Setup Issues

### Python Environment
- **Issue**: Package conflicts or version mismatches
- **Solution**:
  1. Create fresh virtual environment:
     ```bash
     python -m venv env
     ```
  2. Install dependencies in correct order:
     ```bash
     pip install -r requirements.txt
     ```

### System Requirements
- CUDA-capable GPU (Compute Capability 3.5+)
- NVIDIA driver version 450.80.02 or higher
- Python 3.8 or higher
- Windows 10/11 64-bit

## Performance Optimization

### Memory Usage
- Monitor GPU memory: `nvidia-smi`
- Use mixed precision training when possible
- Implement gradient accumulation for large models
- Enable memory efficient attention mechanisms

### Speed Optimization
- Enable JIT compilation when possible
- Use appropriate batch sizes
- Implement data loading optimization
- Consider using 8-bit optimizers for training

## Getting Help
If you encounter issues not covered in this guide:
1. Check NVIDIA System Management Interface: `nvidia-smi`
2. Verify environment variables are set correctly
3. Review PyTorch and bitsandbytes documentation
4. Check GPU compatibility and driver updates
5. File an issue with relevant error messages and system information

## System Information Commands
Gather system information for troubleshooting:
```powershell
# GPU Information
nvidia-smi

# CUDA Version
nvcc --version

# Python Version
python --version

# PyTorch CUDA Information
python -c "import torch; print('CUDA:', torch.cuda.is_available())"

# Environment Variables
echo $env:CUDA_PATH
echo $env:CUDA_HOME
```
