
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle, CheckCircle, Clock, User, GitBranch, Package } from 'lucide-react';
import './App.css';

const App = () => {
  const [bugs, setBugs] = useState([]);
  const [showNewBugForm, setShowNewBugForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBug, setSelectedBug] = useState(null);

  // Status workflow configuration
  const statusWorkflow = {
    'new': ['assigned'],
    'assigned': ['in-progress', 'closed'],
    'in-progress': ['fixed', 'assigned'],
    'fixed': ['closed', 'in-progress'],
    'closed': ['new']
  };

  const statusConfig = {
    'new': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    'assigned': { color: 'bg-yellow-100 text-yellow-800', icon: User },
    'in-progress': { color: 'bg-purple-100 text-purple-800', icon: Clock },
    'fixed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'closed': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
  };

  // New bug form state
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    releaseVersion: '',
    status: 'new'
  });

  // Load bugs from localStorage on mount
  useEffect(() => {
    const savedBugs = localStorage.getItem('bugs');
    if (savedBugs) {
      setBugs(JSON.parse(savedBugs));
    }
  }, []);

  // Save bugs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bugs', JSON.stringify(bugs));
  }, [bugs]);

  // Create new bug
  const handleCreateBug = (e) => {
    e.preventDefault();
    if (!newBug.title || !newBug.description || !newBug.releaseVersion) {
      alert('Please fill in all required fields');
      return;
    }

    const bug = {
      id: Date.now(),
      ...newBug,
      createdDate: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString()
    };

    setBugs([bug, ...bugs]);
    setNewBug({ title: '', description: '', releaseVersion: '', status: 'new' });
    setShowNewBugForm(false);
  };

  // Update bug status
  const updateBugStatus = (bugId, newStatus) => {
    setBugs(bugs.map(bug => 
      bug.id === bugId 
        ? { ...bug, status: newStatus, lastUpdated: new Date().toLocaleDateString() }
        : bug
    ));
  };

  // Delete bug
  const deleteBug = (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      setBugs(bugs.filter(bug => bug.id !== bugId));
      setSelectedBug(null);
    }
  };

  // Filter bugs
  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.releaseVersion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bug.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status statistics
  const getStatusCounts = () => {
    const counts = { new: 0, assigned: 0, 'in-progress': 0, fixed: 0, closed: 0 };
    bugs.forEach(bug => counts[bug.status]++);
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bug Tracking Portal</h1>
              <p className="text-gray-600 mt-1">Track and manage software bugs efficiently</p>
            </div>
            <button
              onClick={() => setShowNewBugForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              New Bug
            </button>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.entries(statusCounts).map(([status, count]) => {
              const StatusIcon = statusConfig[status].icon;
              return (
                <div key={status} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                    <StatusIcon size={16} className="text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="fixed">Fixed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Bug List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bug List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bug List ({filteredBugs.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredBugs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No bugs found. Create your first bug report!
                  </div>
                ) : (
                  filteredBugs.map(bug => {
                    const StatusIcon = statusConfig[bug.status].icon;
                    return (
                      <div
                        key={bug.id}
                        onClick={() => setSelectedBug(bug)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedBug?.id === bug.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{bug.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Package size={14} />
                                {bug.releaseVersion}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[bug.status].color}`}>
                                {bug.status.replace('-', ' ')}
                              </span>
                              <span>{bug.createdDate}</span>
                            </div>
                          </div>
                          <StatusIcon size={20} className="text-gray-400" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bug Details */}
          <div className="lg:col-span-1">
            {selectedBug ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bug Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Title</h3>
                    <p className="text-gray-900">{selectedBug.title}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Description</h3>
                    <p className="text-gray-900 whitespace-pre-wrap text-sm">{selectedBug.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Release Version</h3>
                    <p className="text-gray-900">{selectedBug.releaseVersion}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedBug.status].color}`}>
                      {selectedBug.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Created Date</h3>
                    <p className="text-gray-900">{selectedBug.createdDate}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Last Updated</h3>
                    <p className="text-gray-900">{selectedBug.lastUpdated}</p>
                  </div>

                  {/* Workflow Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Workflow Actions</h3>
                    <div className="space-y-2">
                      {statusWorkflow[selectedBug.status].map(nextStatus => (
                        <button
                          key={nextStatus}
                          onClick={() => updateBugStatus(selectedBug.id, nextStatus)}
                          className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <GitBranch size={16} />
                          Move to {nextStatus.replace('-', ' ')}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteBug(selectedBug.id)}
                        className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Delete Bug
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center text-gray-500">
                  <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Select a bug to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Bug Form Modal */}
        {showNewBugForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Bug</h2>
                
                <form onSubmit={handleCreateBug} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newBug.title}
                      onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the bug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newBug.description}
                      onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed description including steps to reproduce, actual result, and expected result"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Release Version <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newBug.releaseVersion}
                      onChange={(e) => setNewBug({...newBug, releaseVersion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., v1.2.3, Ubuntu 22.04"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={newBug.status}
                      onChange={(e) => setNewBug({...newBug, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="assigned">Assigned</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Bug
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewBugForm(false);
                        setNewBug({ title: '', description: '', releaseVersion: '', status: 'new' });
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
