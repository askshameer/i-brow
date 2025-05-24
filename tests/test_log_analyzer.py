
import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import LogAnalyzer

@pytest.fixture
def analyzer():
    """Create a LogAnalyzer instance."""
    return LogAnalyzer()

def test_extract_errors(analyzer):
    """Test error extraction from log content."""
    content = """
    [2024-01-12 10:30:45] INFO: Application started
    [2024-01-12 10:30:46] ERROR: Database connection failed
    [2024-01-12 10:30:47] WARNING: Retry attempt 1
    [2024-01-12 10:30:48] ERROR: Connection timeout
    """
    
    findings = analyzer.extract_key_info(content)
    
    assert findings['error_count'] == 2
    assert findings['warning_count'] == 1
    assert len(findings['errors']) == 2
    assert 'database connection failed' in findings['errors'][0]['content'].lower()

def test_identify_log_type(analyzer):
    """Test log type identification."""
    error_log = "[ERROR] Something went wrong"
    crash_log = "FATAL EXCEPTION: main"
    system_log = "kernel: Out of memory"
    
    assert analyzer.identify_log_type("error.log", error_log) == "Error Log"
    assert analyzer.identify_log_type("crash.dump", crash_log) == "Crash Dump"
    assert analyzer.identify_log_type("system.log", system_log) == "System Log"

def test_extract_timestamps(analyzer):
    """Test timestamp extraction."""
    content = """
    2024-01-12 10:30:45 First event
    [2024-01-12T10:31:00.123Z] Second event
    Jan 12 10:32:15 Third event
    """
    
    findings = analyzer.extract_key_info(content)
    
    # Should find at least some timestamps
    assert findings['timeline_events'] > 0

def test_extract_stack_traces(analyzer):
    """Test stack trace extraction."""
    content = """
    Exception in thread "main" java.lang.NullPointerException
        at com.example.MyClass.method1(MyClass.java:10)
        at com.example.MyClass.method2(MyClass.java:20)
        at com.example.Main.main(Main.java:5)
    """
    
    findings = analyzer.extract_key_info(content)
    
    assert findings['stack_traces'] == 1
    assert any('java.lang.NullPointerException' in pattern['content'] 
              for pattern in findings['critical_patterns'])

def test_memory_issues_detection(analyzer):
    """Test memory issue detection."""
    content = """
    java.lang.OutOfMemoryError: Java heap space
    MemoryError: Unable to allocate array
    ERROR: Memory allocation failed
    """
    
    findings = analyzer.extract_key_info(content)
    
    assert findings['memory_issues'] == 3

def test_generate_debug_suggestions(analyzer):
    """Test debug suggestions generation."""
    findings = {
        'error_count': 5,
        'errors': [
            {'content': 'Database connection timeout', 'type': 'ERROR'}
        ],
        'memory_issues': 2,
        'critical_patterns': [
            {'type': 'OutOfMemory', 'content': 'Java heap space'}
        ]
    }
    
    suggestions = analyzer.generate_debug_suggestions(findings)
    
    assert len(suggestions) > 0
    assert any('memory' in s.lower() for s in suggestions)
    assert any('database' in s.lower() or 'connection' in s.lower() for s in suggestions)

def test_empty_log_analysis(analyzer):
    """Test analysis of empty log."""
    content = ""
    findings = analyzer.extract_key_info(content)
    
    assert findings['error_count'] == 0
    assert findings['warning_count'] == 0
    assert findings['lines_analyzed'] == 0

def test_large_log_performance(analyzer):
    """Test performance with large log content."""
    # Generate a large log (1000 lines)
    lines = []
    for i in range(1000):
        if i % 10 == 0:
            lines.append(f"[ERROR] Error at line {i}")
        else:
            lines.append(f"[INFO] Normal operation at line {i}")
    
    content = '\n'.join(lines)
    findings = analyzer.extract_key_info(content)
    
    assert findings['lines_analyzed'] == 1000
    assert findings['error_count'] == 100
