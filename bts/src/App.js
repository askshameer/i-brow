import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, AlertCircle, Edit2, Trash2, BarChart, Eye, RefreshCw } from 'lucide-react';
import BugGenerator from './components/BugGenerator';

// API Configuration
const API_URL = 'http://localhost:3001/api';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [viewingBug, setViewingBug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Updated categories for Linux/Multimedia focus
  const categories = ['Driver', 'Multimedia', 'Kernel', 'Hardware', 'Audio', 'Video', 'Performance', 'Network', 'Security', 'Other'];

  // Fetch bugs from backend
  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/bugs`);
      if (!response.ok) throw new Error('Failed to fetch bugs');
      const data = await response.json();
      setBugs(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the server is running on port 3001.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load bugs on mount
  useEffect(() => {
    fetchBugs();
  }, []);

  // Handle bug generator
  const handleGenerateBugs = async (generatedBugs) => {
    try {
      const response = await fetch(`${API_URL}/bugs/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bugs: generatedBugs })
      });
      if (!response.ok) throw new Error('Failed to create bugs');
      await fetchBugs(); // Refresh the list
      alert('Generated 50 test bugs successfully!');
    } catch (err) {
      alert('Failed to generate bugs. Make sure the backend is running.');
      console.error('Generate error:', err);
    }
  };

  // Create or update bug
  const handleSubmit = async (bugData) => {
    try {
      if (editingBug) {
        // Update existing bug
        const response = await fetch(`${API_URL}/bugs/${editingBug.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bugData)
        });
        if (!response.ok) throw new Error('Failed to update bug');
      } else {
        // Create new bug
        const response = await fetch(`${API_URL}/bugs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bugData)
        });
        if (!response.ok) throw new Error('Failed to create bug');
      }
      await fetchBugs(); // Refresh the list
      setShowForm(false);
      setEditingBug(null);
    } catch (err) {
      alert('Failed to save bug. Make sure the backend is running.');
      console.error('Save error:', err);
    }
  };

  // Delete bug
  const deleteBug = async (id) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        const response = await fetch(`${API_URL}/bugs/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete bug');
        await fetchBugs(); // Refresh the list
      } catch (err) {
        alert('Failed to delete bug. Make sure the backend is running.');
        console.error('Delete error:', err);
      }
    }
  };

  // Update bug status
  const updateBugStatus = async (id, newStatus) => {
    try {
      const bug = bugs.find(b => b.id === id);
      const response = await fetch(`${API_URL}/bugs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bug, status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchBugs(); // Refresh the list
    } catch (err) {
      alert('Failed to update status. Make sure the backend is running.');
      console.error('Update error:', err);
    }
  };

  // Filter bugs
  const filteredBugs = bugs.filter(bug => {
    if (!bug) return false;
    const matchesSearch = 
      ((bug.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bug.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bug.id || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || bug.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || bug.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || bug.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Export bugs to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Category', 'Assigned To', 'Release Version', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredBugs.map(bug => [
        bug.id,
        `"${bug.title.replace(/"/g, '""')}"`,
        `"${bug.description.replace(/"/g, '""')}"`,
        bug.status,
        bug.priority,
        bug.category,
        bug.assignedTo || '',
        bug.releaseVersion || '',
        new Date(bug.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugs-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Format description for display
  const formatDescription = (description) => {
    return description.split('\n').map((line, index) => {
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </div>
        );
      }
      // Handle list items
      if (line.trim().startsWith('-')) {
        return (
          <div key={index} className="ml-4 mb-1">
            • {line.trim().substring(1).trim()}
          </div>
        );
      }
      // Handle numbered items
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="ml-4 mb-1">
            {line.trim()}
          </div>
        );
      }
      // Regular lines
      return line.trim() ? <div key={index} className="mb-2">{line}</div> : <br key={index} />;
    });
  };

  // Show loading state
  if (loading && bugs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading bugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchBugs}
              className="text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Bug Tracking System</h1>
              <span className="ml-4 text-sm text-green-600">
                {error ? '⚠️ Offline Mode' : '✓ Connected to Database'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBugs}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Refresh bugs"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Stats
              </button>
              <BugGenerator onGenerateBugs={handleGenerateBugs} existingBugs={bugs} />
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Bug
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same... */}
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      {showStats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Bug Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{bugs.length}</div>
                <div className="text-sm text-gray-500">Total Bugs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {bugs.filter(b => b.status === 'new' || b.status === 'open').length}
                </div>
                <div className="text-sm text-gray-500">Open</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {bugs.filter(b => b.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {bugs.filter(b => b.status === 'resolved' || b.status === 'closed').length}
                </div>
                <div className="text-sm text-gray-500">Resolved</div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Data stored in: bugs_database.json</p>
              <p className="mt-1">Backend running on: {API_URL}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bug List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBugs.map((bug) => (
            <div key={bug.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-mono text-gray-500">{bug.id}</span>
                <select
                  value={bug.status}
                  onChange={(e) => updateBugStatus(bug.id, e.target.value)}
                  className={`text-sm px-2 py-1 rounded ${
                    bug.status === 'new' ? 'bg-purple-100 text-purple-800' :
                    bug.status === 'open' ? 'bg-blue-100 text-blue-800' :
                    bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    bug.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{bug.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{bug.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`font-medium ${
                    bug.priority === 'critical' ? 'text-red-600' :
                    bug.priority === 'high' ? 'text-orange-600' :
                    bug.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {(bug.priority || 'unknown').charAt(0).toUpperCase() + (bug.priority || 'unknown').slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{bug.category}</span>
                </div>
                {bug.assignedTo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assigned to:</span>
                    <span className="text-gray-900">{bug.assignedTo}</span>
                  </div>
                )}
                {bug.releaseVersion && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Release:</span>
                    <span className="text-gray-900">{bug.releaseVersion}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setViewingBug(bug)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  title="View bug details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingBug(bug);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit bug"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBug(bug.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete bug"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBugs.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bugs found. Create your first bug report!</p>
            <p className="text-sm text-gray-400 mt-2">
              {bugs.length > 0 ? 'Try adjusting your filters.' : 'Click "New Bug" or use the Bug Generator to get started.'}
            </p>
          </div>
        )}
      </main>

      {/* Bug View Modal */}
      {viewingBug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Bug Details</h2>
              <button
                onClick={() => setViewingBug(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono text-gray-600">{viewingBug.id}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  viewingBug.status === 'new' ? 'bg-purple-100 text-purple-800' :
                  viewingBug.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  viewingBug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  viewingBug.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {viewingBug.status.charAt(0).toUpperCase() + viewingBug.status.slice(1).replace('-', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewingBug.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
                  <p className={`font-medium ${
                    viewingBug.priority === 'critical' ? 'text-red-600' :
                    viewingBug.priority === 'high' ? 'text-orange-600' :
                    viewingBug.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {(viewingBug.priority || 'unknown').charAt(0).toUpperCase() + (viewingBug.priority || 'unknown').slice(1)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                  <p className="text-gray-900">{viewingBug.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Assigned To</label>
                  <p className="text-gray-900">{viewingBug.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Release Version</label>
                  <p className="text-gray-900">{viewingBug.releaseVersion || 'N/A'}</p>
                </div>
              </div>

              {viewingBug.severity && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Severity</label>
                    <p className="text-gray-900">{viewingBug.severity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Reproducibility</label>
                    <p className="text-gray-900">{viewingBug.reproducibility || 'N/A'}</p>
                  </div>
                </div>
              )}

              {viewingBug.platform && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Platform</label>
                  <p className="text-gray-900">{viewingBug.platform}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  {formatDescription(viewingBug.description)}
                </div>
              </div>

              {viewingBug.tags && viewingBug.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {viewingBug.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
                <p className="text-gray-900">
                  {new Date(viewingBug.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setViewingBug(null);
                    setEditingBug(viewingBug);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Bug
                </button>
                <button
                  onClick={() => setViewingBug(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bug Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingBug ? 'Edit Bug' : 'Create New Bug'}
            </h2>
            <BugForm
              bug={editingBug}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingBug(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Bug Form Component (remains the same)
function BugForm({ bug, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: bug?.title || '',
    description: bug?.description || '',
    priority: bug?.priority || 'medium',
    category: bug?.category || categories[0],
    assignedTo: bug?.assignedTo || '',
    releaseVersion: bug?.releaseVersion || '',
    status: bug?.status || 'new'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Include steps to reproduce, expected result, and actual result..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Release Version
            </label>
            <input
              type="text"
              value={formData.releaseVersion}
              onChange={(e) => setFormData({ ...formData, releaseVersion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g., v2.1.0"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {bug ? 'Update Bug' : 'Create Bug'}
        </button>
      </div>
    </form>
  );
}

export default App;
