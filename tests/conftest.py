
"""Pytest configuration and shared fixtures."""
import pytest
import sys
import os

# Add parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set testing environment variable
os.environ['TESTING'] = 'true'

@pytest.fixture(autouse=True)
def mock_model_loading(monkeypatch):
    """Mock the model loading to speed up tests."""
    # This will prevent actual model loading during tests
    import app
    
    # Mock the model check
    if hasattr(app, 'model_loaded'):
        monkeypatch.setattr(app, 'model_loaded', False)
    
    # You can add more mocking here if needed

@pytest.fixture
def app_context():
    """Create application context for tests."""
    from app import app
    
    with app.app_context():
        yield app
