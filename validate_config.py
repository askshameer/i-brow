#!/usr/bin/env python3
"""
Configuration Validation Script for Bug Repro Engine with Assisted Debugging
Validates all configuration files and project setup.
"""

import os
import json
import sys
from pathlib import Path

def validate_file_exists(filepath, description):
    """Check if a file exists and report status."""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (MISSING)")
        return False

def validate_json_file(filepath, description):
    """Validate JSON file syntax."""
    if not validate_file_exists(filepath, description):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"   📄 JSON syntax: Valid")
        return True
    except json.JSONDecodeError as e:
        print(f"   ❌ JSON syntax error: {e}")
        return False

def validate_requirements_file(filepath, description):
    """Validate requirements file."""
    if not validate_file_exists(filepath, description):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        packages = [line.strip() for line in lines if line.strip() and not line.startswith('#')]
        print(f"   📦 Contains {len(packages)} packages")
        return True
    except Exception as e:
        print(f"   ❌ Error reading file: {e}")
        return False

def main():
    """Main validation function."""
    print("🔍 Bug Repro Engine Configuration Validation")
    print("=" * 50)
    
    base_path = Path(__file__).parent
    all_valid = True
    
    # Core Python configuration files
    print("\n📋 Python Configuration Files:")
    files_to_check = [
        (base_path / "requirements.txt", "Core Requirements", validate_requirements_file),
        (base_path / "requirements-dev.txt", "Development Requirements", validate_requirements_file),
        (base_path / "app.py", "Flask Application", validate_file_exists),
        (base_path / "main.py", "Main Application", validate_file_exists),
    ]
    
    for filepath, description, validator in files_to_check:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Docker configuration
    print("\n🐳 Docker Configuration:")
    docker_files = [
        (base_path / "Dockerfile", "Dockerfile", validate_file_exists),
        (base_path / "docker-compose.yml", "Docker Compose", validate_file_exists),
        (base_path / "docker-compose.override.yml", "Docker Override", validate_file_exists),
        (base_path / "nginx.conf", "Nginx Configuration", validate_file_exists),
    ]
    
    for filepath, description, validator in docker_files:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Node.js/React configuration
    print("\n⚛️ React/Node.js Configuration:")
    node_files = [
        (base_path / "bts" / "package.json", "BTS Package JSON", validate_json_file),
        (base_path / "bts" / "src" / "backend" / "package.json", "Backend Package JSON", validate_json_file),
        (base_path / "bts" / "tailwind.config.js", "Tailwind Config", validate_file_exists),
        (base_path / "bts" / "postcss.config.js", "PostCSS Config", validate_file_exists),
    ]
    
    for filepath, description, validator in node_files:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Git configuration
    print("\n📁 Git Configuration:")
    git_files = [
        (base_path / ".gitignore", "Git Ignore", validate_file_exists),
        (base_path / "uploads" / ".gitkeep", "Uploads GitKeep", validate_file_exists),
    ]
    
    for filepath, description, validator in git_files:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Documentation files
    print("\n📚 Documentation:")
    doc_files = [
        (base_path / "README.md", "Main README", validate_file_exists),
        (base_path / "CHANGELOG.md", "Changelog", validate_file_exists),
        (base_path / "documentations" / "DOCUMENTATION_SUMMARY.md", "Doc Summary", validate_file_exists),
        (base_path / "documentations" / "chat" / "README.md", "Chat README", validate_file_exists),
        (base_path / "documentations" / "chat" / "FEATURES.md", "Features Doc", validate_file_exists),
        (base_path / "documentations" / "chat" / "UPGRADE_GUIDE.md", "Upgrade Guide", validate_file_exists),
    ]
    
    for filepath, description, validator in doc_files:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Build and setup scripts
    print("\n🔨 Build Scripts:")
    script_files = [
        (base_path / "build.ps1", "PowerShell Build Script", validate_file_exists),
        (base_path / "build.sh", "Bash Build Script", validate_file_exists),
        (base_path / "set_cuda_env.ps1", "CUDA Environment Script", validate_file_exists),
    ]
    
    for filepath, description, validator in script_files:
        if not validator(str(filepath), description):
            all_valid = False
    
    # Final validation summary
    print("\n" + "=" * 50)
    if all_valid:
        print("🎉 All configuration files are properly set up!")
        print("✅ Bug Repro Engine with Assisted Debugging is ready to deploy")
    else:
        print("⚠️  Some configuration issues were found")
        print("❌ Please review and fix the missing or invalid files")
        sys.exit(1)
    
    print("\n📋 Quick Setup Commands:")
    print("  Install Python dependencies: pip install -r requirements.txt")
    print("  Install dev dependencies: pip install -r requirements-dev.txt")
    print("  Install Node.js dependencies: cd bts && npm install")
    print("  Start Flask app: python app.py")
    print("  Start BTS frontend: cd bts && npm start")
    print("  Start BTS backend: cd bts/src/backend && npm start")
    print("  Build with Docker: docker-compose up --build")

if __name__ == "__main__":
    main()
