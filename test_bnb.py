import torch
import bitsandbytes as bnb

# Create a sample linear layer in 8-bit
linear_8bit = bnb.nn.Linear8bitLt(256, 256, has_fp16_weights=False)
print("Linear8bitLt layer created successfully")

# Test if CUDA is available and being used
if torch.cuda.is_available():
    # Move the layer to CUDA
    linear_8bit = linear_8bit.cuda()
    print(f"CUDA is available and being used: {torch.cuda.get_device_name()}")
    
    # Create sample input
    x = torch.randn(32, 256).cuda()
    
    # Forward pass
    output = linear_8bit(x)
    print("Forward pass successful!")
    print(f"Output shape: {output.shape}")
else:
    print("CUDA is not available")
