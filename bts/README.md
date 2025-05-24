
# Bug Tracking System (BTS)

A modern, full-stack bug tracking portal built with React and Node.js, designed to streamline bug reporting and management for development teams with a focus on Linux/Multimedia driver testing.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Data Persistence](#data-persistence)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [License](#license)

## ✨ Features

### Core Functionality
- **User-Friendly Interface**: Clean, modern UI built with React and Tailwind CSS
- **Real-time Updates**: Instant bug status updates and notifications
- **Comprehensive Bug Management**:
  - Create, view, edit, and delete bug reports
  - Priority levels (Low, Medium, High, Critical)
  - Status tracking (New, Open, In Progress, Resolved, Closed)
  - Category classification optimized for Linux/driver testing
- **Search & Filter**: Advanced filtering by status, priority, category, and date
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Export Functionality**: Export bug reports to CSV format
- **Persistent Storage**: JSON file-based backend storage (replaced localStorage)

### New Features (v2.0.0)
- **Full-Stack Architecture**: Separated frontend and backend with RESTful API
- **View Mode**: Detailed read-only view with formatted description display
- **Bug Generator**: One-time generation of 50 test bugs for Linux/driver testing
- **Statistics Dashboard**: Real-time bug metrics with visual indicators
- **Connection Status**: Visual indicator of backend connection status
- **Refresh Capability**: Manual sync with backend database
- **Enhanced Categories**: Driver, Multimedia, Kernel, Hardware, Audio, Video, Performance, Network, Security

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Fetch API**: For backend communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **File System**: JSON file-based persistence

## 📋 Requirements

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Two terminal windows (for running frontend and backend)

## 🚀 Installation

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/askshameer/i-brow.git
   cd AI_Solution/bts
   ```

2. **Install Backend Dependencies**
   ```bash
   cd src/backend
   npm install
   cd ../..
   ```

3. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

## 🏃 Running the Application

The BTS requires both frontend and backend servers to be running:

### Terminal 1 - Backend Server (Port 3001)
```bash
cd src/backend
npm start
```

You should see:
```
BTS Backend running on http://localhost:3001
Database file: [path]\bugs_database.json
```

### Terminal 2 - Frontend Application (Port 3000)
```bash
# In the main bts directory
npm start
```

The application will open automatically at `http://localhost:3000`

### Production Build

To create a production-ready build:

```bash
npm run build
```

The optimized files will be in the `build/` directory.

## 📖 Usage Guide

### Creating a New Bug Report

1. Click the **"New Bug"** button in the top navigation
2. Fill in the required fields:
   - **Title**: Brief description of the bug
   - **Description**: Detailed explanation of the issue
   - **Category**: Select from dropdown (Driver, Multimedia, Kernel, etc.)
   - **Priority**: Choose priority level
   - **Assigned To**: Enter the assignee's name
   - **Release Version**: Specify the version (optional)

3. Click **"Submit"** to create the bug report

### Managing Bug Reports

#### Viewing Bugs
- All bugs are displayed in a card layout on the main dashboard
- Each card shows:
  - Bug ID and title
  - Status badge with color coding
  - Priority indicator
  - Category tag
  - Creation date
  - Assigned person
  - Three action buttons: View (👁️), Edit (✏️), Delete (🗑️)

#### Viewing Bug Details
1. Click the **view icon** (👁️) on any bug card
2. See complete bug information in a modal
3. Option to edit directly from the view modal

#### Editing Bugs
1. Click the **edit icon** (✏️) on any bug card
2. Modify the desired fields
3. Click **"Update"** to save changes

#### Deleting Bugs
1. Click the **delete icon** (🗑️) on any bug card
2. Confirm the deletion in the popup dialog

#### Changing Bug Status
- Click the **status dropdown** on any bug card
- Select the new status:
  - 🟣 New
  - 🔵 Open
  - 🟡 In Progress
  - 🟢 Resolved
  - ⚫ Closed

### Using the Bug Generator

1. Click the **"Bug Generator"** button (only available when no demo bugs exist)
2. Automatically generates 50 test bugs with:
   - Realistic Linux/driver-related issues
   - Various priorities and categories
   - Sample descriptions and steps to reproduce
   - Demo-data tag for identification

### Filtering and Searching

#### Search Function
- Use the search bar at the top to find bugs by:
  - Title
  - Description
  - Bug ID

#### Filter Options
Click the **"Filters"** button to access:
- **Status Filter**: Show only bugs with specific status
- **Priority Filter**: Filter by priority level
- **Category Filter**: Display bugs from specific categories

### Exporting Data

1. Apply desired filters (optional)
2. Click the **"Export"** button
3. CSV file will download automatically with filtered results

### Statistics Dashboard

Click **"Stats"** to view:
- Total number of bugs
- Open bugs count
- In Progress count
- Resolved bugs count
- Storage information and backend status

## 📁 Project Structure

```
bts/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/         # React components
│   │   └── BugGenerator.js # Test data generator
│   ├── backend/            # Backend server
│   │   ├── server.js       # Express server with API routes
│   │   ├── package.json    # Backend dependencies
│   │   ├── bugs_database.json # Persistent storage (auto-created)
│   │   └── .gitignore      # Excludes node_modules and database
│   ├── App.js             # Main app component with all logic
│   ├── index.css          # Tailwind CSS imports
│   └── index.js           # React entry point
├── docs/
│   └── BTS_User_Manual.md # Detailed user documentation
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🔌 API Documentation

The backend provides RESTful endpoints at `http://localhost:3001/api`:

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/bugs` | Retrieve all bugs | None |
| POST | `/api/bugs` | Create a new bug | Bug object |
| PUT | `/api/bugs/:id` | Update a specific bug | Updated fields |
| DELETE | `/api/bugs/:id` | Delete a specific bug | None |
| POST | `/api/bugs/bulk` | Create multiple bugs | { bugs: [...] } |

### Example API Calls

```javascript
// Get all bugs
fetch('http://localhost:3001/api/bugs')

// Create a new bug
fetch('http://localhost:3001/api/bugs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Bug title',
    description: 'Bug description',
    priority: 'high',
    category: 'Driver',
    status: 'new'
  })
})
```

## ⚙️ Configuration

### Customizing Categories

Edit the categories in `src/App.js`:

```javascript
const categories = ['Driver', 'Multimedia', 'Kernel', 'Hardware', 'Audio', 'Video', 'Performance', 'Network', 'Security', 'Other'];
```

### Modifying Priority Levels

The priority levels are:
- `low` (Blue)
- `medium` (Yellow)
- `high` (Orange)  
- `critical` (Red)

### Styling Customization

Modify `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

## 💾 Data Persistence

- Bug data is stored in `src/backend/bugs_database.json`
- File is automatically created on first run
- Data persists across server restarts
- Survives browser cache clearing (unlike localStorage)
- Regular backups recommended for production use

### Backup Strategy

```bash
# Create a backup
cp src/backend/bugs_database.json src/backend/bugs_backup_$(date +%Y%m%d).json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use functional components with hooks
- Follow React best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Write meaningful commit messages

## 🐛 Troubleshooting

### Common Issues

**1. Backend Connection Failed**
```bash
# Ensure backend is running
cd src/backend
npm start
# Check if port 3001 is available
```

**2. npm start fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**3. Tailwind styles not applying**
```bash
# Rebuild Tailwind
npm run build:css
# or restart the development server
npm start
```

**4. Data not persisting**
- Check if `src/backend/bugs_database.json` exists
- Ensure backend server is running
- Verify write permissions in src/backend directory

**5. Export function not working**
- Check browser permissions for downloads
- Verify popup blockers are disabled
- Try a different browser

### Debug Mode

Check backend logs for errors:
```bash
# Backend terminal will show all API requests and errors
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

- No authentication implemented (suitable for internal use)
- Data stored in plain JSON format
- CORS enabled for local development
- For production use, implement:
  - User authentication
  - Data encryption
  - API security headers
  - Input validation
  - Rate limiting
  - HTTPS

## 🚦 Future Enhancements

- [ ] User authentication and authorization
- [ ] PostgreSQL/MongoDB integration
- [ ] File attachments for bugs
- [ ] Email notifications
- [ ] Bug history and audit trail
- [ ] Advanced reporting and analytics
- [ ] REST API documentation (Swagger)
- [ ] Automated testing suite
- [ ] Docker containerization
- [ ] Real-time updates with WebSockets

## 📄 License

This project is part of the AI_Solution suite and is licensed under the MIT License.

---

## 🔗 Integration with Phi3 Chatbot

This Bug Tracking System is designed to work seamlessly with the Phi3 Chatbot system. Users can:
- Report bugs found in the chatbot through this interface
- Track chatbot-related issues and improvements
- Monitor the resolution status of reported problems

For more information about the complete AI_Solution project, see the main [README.md](../README.md).

---

**Version**: 2.0.0  
**Last Updated**: May 2024  
**Maintainer**: Shameer Mohammed  
**Contact**: mohammed.shameer@hotmail.com  
**Status**: Production Ready with Persistent Backend Storage
