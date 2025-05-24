
// server.js - Backend server for BTS
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'bugs_database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database file if it doesn't exist
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ bugs: [] }));
    console.log('Created new database file');
  }
}

// Read bugs from file
async function readBugs() {
  const data = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(data).bugs;
}

// Write bugs to file
async function writeBugs(bugs) {
  await fs.writeFile(DB_FILE, JSON.stringify({ bugs }, null, 2));
}

// Routes
// Get all bugs
app.get('/api/bugs', async (req, res) => {
  try {
    const bugs = await readBugs();
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read bugs' });
  }
});

// Create new bug
app.post('/api/bugs', async (req, res) => {
  try {
    const bugs = await readBugs();
    const newBug = {
      ...req.body,
      id: `BUG-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    bugs.push(newBug);
    await writeBugs(bugs);
    res.json(newBug);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bug' });
  }
});

// Update bug
app.put('/api/bugs/:id', async (req, res) => {
  try {
    const bugs = await readBugs();
    const index = bugs.findIndex(bug => bug.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    bugs[index] = { ...bugs[index], ...req.body };
    await writeBugs(bugs);
    res.json(bugs[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bug' });
  }
});

// Delete bug
app.delete('/api/bugs/:id', async (req, res) => {
  try {
    const bugs = await readBugs();
    const filteredBugs = bugs.filter(bug => bug.id !== req.params.id);
    await writeBugs(filteredBugs);
    res.json({ message: 'Bug deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bug' });
  }
});

// Bulk create bugs (for bug generator)
app.post('/api/bugs/bulk', async (req, res) => {
  try {
    const bugs = await readBugs();
    const newBugs = req.body.bugs;
    bugs.push(...newBugs);
    await writeBugs(bugs);
    res.json({ message: 'Bugs created', count: newBugs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bugs' });
  }
});

// Start server
app.listen(PORT, async () => {
  await initDB();
  console.log(`BTS Backend running on http://localhost:${PORT}`);
  console.log(`Database file: ${DB_FILE}`);
});
