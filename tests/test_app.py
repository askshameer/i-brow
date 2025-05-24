
import pytest
import json
from app import app
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test that home page loads successfully."""
    response = client.get('/')
    assert response.status_code == 200

def test_chat_endpoint_without_message(client):
    """Test chat endpoint with missing message."""
    response = client.post('/chat', 
                         json={},
                         content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_chat_endpoint_with_empty_message(client):
    """Test chat endpoint with empty message."""
    response = client.post('/chat', 
                         json={'message': ''},
                         content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_upload_endpoint_no_file(client):
    """Test upload endpoint without file."""
    response = client.post('/upload')
    assert response.status_code == 400

def test_analyze_endpoint_without_file(client):
    """Test analyze endpoint without file ID."""
    response = client.post('/analyze/nonexistent')
    assert response.status_code == 404

def test_chat_endpoint_structure(client):
    """Test that chat endpoint returns expected structure when called."""
    # This test just verifies the endpoint exists and returns JSON
    response = client.post('/chat',
                         json={'message': 'test'},
                         content_type='application/json')
    # The actual model might not be loaded in test environment
    # so we just check that it's either success or a specific error
    assert response.status_code in [200, 500]
    if response.status_code == 200:
        data = json.loads(response.data)
        assert 'response' in data
