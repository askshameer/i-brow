# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-26

### Added
- ✅ **BTS Integration**: Complete Bug Tracking System integration with lookup functionality
- ✅ **Modern Web Interface**: Dark theme UI with responsive design and mobile support
- ✅ **Bug Lookup Feature**: Real-time bug information display with comprehensive metadata
- ✅ **API Proxy Endpoints**: Flask endpoints for BTS backend communication
- ✅ **GitHub Actions**: Complete CI/CD pipeline with automated testing and deployment
- ✅ **CUDA Support**: Optimized GPU acceleration with environment setup scripts
- ✅ **Troubleshooting Guide**: Comprehensive documentation for common issues
- ✅ **File Upload**: Drag-and-drop file analysis for logs and crash dumps

### Fixed
- ✅ **Chat Alignment**: Fixed message alignment issues (user right, assistant left)
- ✅ **UI Spacing**: Improved bug information display with proper formatting
- ✅ **Dependencies**: Resolved version conflicts and missing packages
- ✅ **GitHub Actions**: Fixed dependency cache paths and workflow syntax
- ✅ **Template Formatting**: Eliminated blank lines and improved HTML structure
- ✅ **Mobile Responsiveness**: Enhanced mobile device compatibility

### Changed
- ✅ **Requirements**: Updated to remove version upper bounds for better compatibility
- ✅ **Package Structure**: Reorganized BTS components for better maintainability
- ✅ **Documentation**: Comprehensive README with quick start guide and API documentation
- ✅ **Workflows**: Updated to use latest GitHub Actions versions (v4, v5)

### Technical Details
- **PyTorch**: Upgraded to 2.5.1+cu121 with CUDA 12.1 support
- **Bitsandbytes**: Successfully installed version 0.45.5
- **Flask**: Updated to 3.0.0+ with improved security
- **Node.js**: BTS backend using Express 5.1.0
- **Testing**: Added pytest, Jest, and integration testing

## [1.0.0] - 2025-05-25

### Added
- Initial release of Phi-3 Offline Chatbot
- Basic chat functionality with Microsoft Phi-3-mini-4k-instruct model
- File analysis capabilities for log files
- Simple web interface

### Features
- GPU acceleration with CUDA support
- Conversational memory
- Log file analysis
- Basic Flask web application

---

**Legend:**
- ✅ **Completed**: Feature fully implemented and tested
- 🚧 **In Progress**: Feature partially implemented
- 📋 **Planned**: Feature planned for future release
