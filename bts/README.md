
# Bug Tracking System (BTS)

A modern, responsive bug tracking portal built with React and Tailwind CSS, designed to streamline bug reporting and management for development teams.

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## ✨ Features

- **User-Friendly Interface**: Clean, modern UI built with React and Tailwind CSS
- **Real-time Updates**: Instant bug status updates and notifications
- **Comprehensive Bug Management**:
  - Create, view, edit, and delete bug reports
  - Priority levels (Low, Medium, High, Critical)
  - Status tracking (Open, In Progress, Resolved, Closed)
  - Category classification
- **Search & Filter**: Advanced filtering by status, priority, category, and date
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Export Functionality**: Export bug reports to CSV format
- **Local Storage**: Data persistence using browser's local storage

## 📋 Requirements

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd AI_Solution/bts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

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
   - **Category**: Select from dropdown (UI, Backend, Database, etc.)
   - **Priority**: Choose priority level
   - **Assigned To**: Enter the assignee's name

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
  - 🔵 Open
  - 🟡 In Progress
  - 🟢 Resolved
  - ⚫ Closed

### Filtering and Searching

#### Search Function
- Use the search bar at the top to find bugs by:
  - Title
  - Description
  - Bug ID
  - Assigned person

#### Filter Options
Click the **"Filters"** button to access:
- **Status Filter**: Show only bugs with specific status
- **Priority Filter**: Filter by priority level
- **Category Filter**: Display bugs from specific categories
- **Date Range**: Filter bugs created within a date range

### Exporting Data

1. Apply desired filters (optional)
2. Click the **"Export"** button
3. Choose export format (currently CSV)
4. The file will download automatically

### Statistics Dashboard

View real-time statistics including:
- Total number of bugs
- Bugs by status (pie chart)
- Bugs by priority (bar chart)
- Recent activity timeline

## 📁 Project Structure

```
bts/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/         # React components
│   │   ├── BugList.js     # Bug listing component
│   │   ├── BugForm.js     # Bug creation/edit form
│   │   ├── FilterBar.js   # Filter controls
│   │   └── Stats.js       # Statistics dashboard
│   ├── utils/             # Utility functions
│   │   ├── storage.js     # Local storage helpers
│   │   └── export.js      # Export functionality
│   ├── App.js             # Main app component
│   ├── App.css            # Tailwind directives
│   └── index.js           # React entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## ⚙️ Configuration

### Customizing Categories

Edit the categories in `src/App.js`:

```javascript
const CATEGORIES = [
  'UI/UX',
  'Backend',
  'Database',
  'API',
  'Performance',
  'Security',
  'Other'
];
```

### Modifying Priority Levels

Update priority options in `src/App.js`:

```javascript
const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }
];
```

### Styling Customization

Modify `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

## 🔌 API Integration

### Connecting to Backend

To integrate with a backend API, modify `src/utils/api.js`:

```javascript
// Example API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const bugAPI = {
  // Fetch all bugs
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bugs`);
    return response.json();
  },
  
  // Create new bug
  create: async (bugData) => {
    const response = await fetch(`${API_BASE_URL}/bugs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bugData)
    });
    return response.json();
  },
  
  // Update bug
  update: async (id, bugData) => {
    const response = await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bugData)
    });
    return response.json();
  },
  
  // Delete bug
  delete: async (id) => {
    await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'DELETE'
    });
  }
};
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENABLE_AUTH=false
REACT_APP_VERSION=1.0.0
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

**1. npm start fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**2. Tailwind styles not applying**
```bash
# Rebuild Tailwind
npm run build:css
# or
npx tailwindcss -i ./src/App.css -o ./dist/output.css --watch
```

**3. Local storage not persisting**
- Check browser settings for local storage
- Ensure not in private/incognito mode
- Clear browser cache and cookies

**4. Export function not working**
- Check browser permissions for downloads
- Verify popup blockers are disabled
- Try a different browser

### Debug Mode

Enable debug mode by adding to `.env`:
```env
REACT_APP_DEBUG=true
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

- All data is stored locally in the browser
- No sensitive information should be stored in bug reports
- For production use, implement:
  - User authentication
  - Data encryption
  - API security headers
  - Input validation

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

**Version**: 1.0.0  
**Last Updated**: May 2024  
**Maintainer**: Your Name  
**Contact**: your.email@example.com
