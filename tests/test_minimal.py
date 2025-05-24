
"""Minimal tests to ensure basic functionality."""

def test_imports():
    """Test that main modules can be imported."""
    try:
        import app
        from app import LogAnalyzer
        assert True
    except ImportError as e:
        assert False, f"Failed to import required modules: {e}"

def test_flask_app_exists():
    """Test that Flask app is created."""
    from app import app
    assert app is not None
    assert app.name == 'app'

def test_routes_exist():
    """Test that main routes are registered."""
    from app import app
    
    # Get all registered routes
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    
    # Check for essential routes
    assert '/' in routes
    assert '/chat' in routes
    assert '/upload' in routes
    assert '/analyze/<file_id>' in routes

def test_upload_folder_config():
    """Test that upload folder is configured."""
    from app import app
    assert 'UPLOAD_FOLDER' in app.config
    assert app.config['UPLOAD_FOLDER'] == 'uploads'

def test_log_analyzer_class():
    """Test LogAnalyzer class basic functionality."""
    from app import LogAnalyzer
    
    analyzer = LogAnalyzer()
    
    # Test with simple content
    result = analyzer.analyze("Test log content")
    
    # Check basic structure
    assert isinstance(result, dict)
    assert 'findings' in result
    assert 'summary' in result
    assert 'severity' in result
