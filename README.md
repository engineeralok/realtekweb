# RetakeTech Static Website

A dark-themed static website for RetakeTech, built with HTML, CSS, and JavaScript. The site features dynamic content loaded from backend APIs and includes interactive elements like example carousels, project tables, and news feeds.

## Features

- **Home Page**: Hero section with example carousel showing 3 random examples at a time
- **War Room**: Tables showing captured and liberated open-source projects with API integration
- **News Page**: Live feed of project status changes with submission form and progress modal
- **About Page**: Mission statement and company information
- **Responsive Design**: Mobile-first approach with dark theme
- **API Integration**: Fetches data from backend APIs for dynamic content

## Project Structure

```
/
├── index.html              # Home page
├── war-room.html           # War Room page
├── news.html               # News page
├── about.html              # About page
├── css/
│   └── style.css           # Main stylesheet with dark theme
├── js/
│   ├── main.js             # Shared utilities and API config
│   ├── examples.js         # Home page carousel logic
│   ├── war-room.js         # War Room data fetching and rendering
│   └── news.js             # News feed and submission with modal
├── data/
│   └── examples.json       # All examples data (40+ entries)
├── netlify.toml            # Netlify deployment configuration
└── README.md               # This file
```

## Setup and Deployment

### Local Development

1. Clone or download the project files
2. Open `index.html` in a web browser
3. For full functionality, serve from a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

### Netlify Deployment

1. **Option 1: Drag and Drop**
   - Zip the entire project folder
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the zip file to deploy

2. **Option 2: Git Integration**
   - Push code to GitHub/GitLab
   - Connect repository to Netlify
   - Deploy automatically on push

3. **Option 3: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir .
   ```

### API Configuration

The website is configured to use the working RetakeTech APIs:

```javascript
const API_CONFIG = {
    baseUrl: 'https://api.retaketech.com',
    staticBaseUrl: 'https://static.retaketech.com',
    endpoints: {
        news: '/news/',
        repos: '/repos.json',
        activism: '/activism/github_issue',
        score: '/score'
    }
};
```

**API Test**: Open `test-api.html` in your browser to test the API endpoints.

## API Endpoints

The website expects the following API endpoints:

### GET /repos
Returns an array of project objects:
```json
[
  {
    "name": "owner/repo",
    "noCoc": true,
    "masterBranch": false,
    "neutralMessaging": true,
    "activism": true,
    "priority": 1
  }
]
```

### GET /news?days=7
Returns an object with news items:
```json
{
  "items": [
    {
      "url": "https://github.com/travisbrown/cancel-culture",
      "slug": "travisbrown/cancel-culture",
      "description": "Tools for fighting abuse on Twitter",
      "date": "2025-10-22",
      "currentOrientation": "Political",
      "isPolitical": true,
      "hasCoc": true,
      "defaultBranch": "main"
    }
  ]
}
```

### POST /news
Submit a new news item:
```json
{
  "slug": "owner/repo"
}
```

### GET /score?slug=owner/repo
Get scoring information for a specific repository:
```json
{
  "url": "https://github.com/travisbrown/cancel-culture",
  "slug": "travisbrown/cancel-culture",
  "description": "Tools for fighting abuse on Twitter",
  "orientation": "Political",
  "isPolitical": true,
  "hasCoc": true,
  "defaultBranch": "main",
  "stars": 428
}
```

## Features in Detail

### Home Page Examples Carousel
- Displays 3 random examples from a database of 40+ entries
- Left/right arrow navigation to cycle through all examples
- Keyboard navigation (arrow keys)
- Each example shows title, description, and source link

### War Room Tables
- **Captured Projects**: Projects flagged by neutrality criteria
- **Liberated Projects**: Exemplars meeting neutrality criteria
- Real-time data from API
- Submit Issue buttons (GitHub integration or API)

### News Page
- Live feed of project status changes
- Submit form for new GitHub repositories
- Progress modal with 11-step analysis simulation
- 30-second progress display + API call

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)
- Collapsible navigation on mobile
- Horizontal scrolling tables on small screens

## Customization

### Styling
- Edit `css/style.css` to modify colors, fonts, and layout
- Dark theme with teal/cyan accent colors
- Tech-inspired gradients and effects

### Content
- Update `data/examples.json` to modify example database
- Modify hero text in HTML files
- Update API endpoints in `js/main.js`

### Functionality
- Add new JavaScript features in respective `.js` files
- Modify API integration in `js/main.js`
- Update form handling in `js/news.js`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Fetch API

## License

Copyright 2025 RetakeTech.Com - All Rights Reserved.
Designed and built by Ziverge.com for RetakeTech.Com.
