
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
    assert b'Phi-3 Offline Chatbot' in response.data or b'chat' in response.data.lower()

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

def test_chat_endpoint_with_valid_message(client, monkeypatch):
    """Test chat endpoint with valid message (mocked model)."""
    # Mock the model to avoid loading it during tests
    class MockModel:
        def __call__(self, *args, **kwargs):
            return [{'generated_text': 'This is a test response'}]
    
    class MockTokenizer:
        def apply_chat_template(self, *args, **kwargs):
            return "mocked template"
    
    # Mock the global model and tokenizer
    import app as app_module
    monkeypatch.setattr(app_module, 'model', MockModel())
    monkeypatch.setattr(app_module, 'tokenizer', MockTokenizer())
    
    response = client.post('/chat', 
                         json={'message': 'Hello'},
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'response' in data
    assert len(data['response']) > 0

def test_analyze_endpoint_without_file(client):
    """Test analyze endpoint without file ID."""
    response = client.post('/analyze/nonexistent')
    assert response.status_code == 404

def test_settings_update(client):
    """Test settings update endpoint."""
    response = client.post('/update_settings',
                         json={
                             'temperature': '0.8',
                             'max_tokens': '500'
                         },
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True

def test_download_history_empty(client):
    """Test downloading empty history."""
    response = client.get('/download_history')
    assert response.status_code == 200
    assert response.content_type == 'text/plain; charset=utf-8'
