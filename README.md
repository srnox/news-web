# NewsHub - Modern News Aggregation Website

![NewsHub Logo](./logo/logo.png)

## Project Overview

NewsHub is a responsive, feature-rich news aggregation website that provides users with the latest news articles across various categories. The platform offers a modern, intuitive interface with advanced features such as real-time news tickers, article sliders, category filtering, search functionality, and responsive design that works seamlessly across all device sizes.

## Table of Contents

- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Implementation Details](#implementation-details)
- [API Integration](#api-integration)
- [Responsive Design](#responsive-design)
- [Performance Optimizations](#performance-optimizations)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Setup and Installation](#setup-and-installation)
- [Usage Instructions](#usage-instructions)

## Features

### Core Features

1. **News Article Aggregation**
   - Displays the latest news articles from various sources
   - Rich article cards with images, titles, descriptions, and metadata
   - Detailed article view with full content and additional information

2. **Featured News Slider**
   - Prominently showcases breaking/important news
   - Auto-scrolling carousel with navigation controls
   - Featured article badges for key stories

3. **Category Filtering**
   - Filter news by categories (technology, business, sports, entertainment, health, science)
   - Visual indicators for active category filters
   - Smooth transitions between category views

4. **Search Functionality**
   - Search across all articles by keywords
   - Responsive search UI for desktop and mobile
   - Category tag filters in mobile search view

5. **Responsive Design**
   - Fully responsive layout that adapts to all screen sizes
   - Mobile-optimized interface with touch-friendly controls
   - Adaptive content presentation based on device capabilities

6. **Real-time News Ticker**
   - Scrolling ticker for breaking news and market updates
   - Smooth animation with hover-pause functionality
   - Designed for high visibility and quick information scanning

7. **Pagination**
   - Navigate through multiple pages of news content
   - Clear page indicators and navigation controls
   - Maintains current category and search context during navigation

8. **Article Detail View**
   - Comprehensive article view with full content
   - Article metadata including source, date, and categories
   - Sentiment analysis visualization for article tone (positive/neutral/negative)
   - Related keywords/tags for article context

## Technical Architecture

NewsHub is built using a modern front-end architecture with the following technologies:

- **HTML5** - Semantic markup for content structure
- **CSS3** - Advanced styling with CSS variables, flex/grid layouts, and animations
- **JavaScript (ES6+)** - Client-side functionality and API integration
- **RESTful API Integration** - Connection to the NewsHub API for fetching article data
- **Responsive Design** - Mobile-first approach using media queries and flexible layouts
- **Font Awesome Icons** - Visual elements and action indicators
- **Google Fonts** - Typography using Montserrat font family

The application follows a component-based structure with clear separation of concerns:

- **Content Rendering** - Dynamic article generation based on API data
- **State Management** - Tracking and managing application state (current page, category, search)
- **API Integration** - Authentication and data fetching from the NewsHub API
- **UI Interactions** - Event handling for user actions
- **Error Handling** - Graceful fallbacks and user feedback for failures

## Project Structure

```
NewsHub/
├── index.html              # Main landing page
├── detail.html             # Article detail page
├── script.js               # Main JavaScript functionality
├── auth.js                 # Authentication handling
├── slider.js               # News slider component
├── ticker.js               # News ticker component
├── detail.js               # Article detail page functionality
├── styles.css              # Global styles
├── slider.css              # Slider component styles
├── detail.css              # Article detail page styles
└── logo/                   # Logo and favicon images
```

## Implementation Details

### News Card Component

Each news article is displayed as a card with consistent styling and interactive elements:

```html
<div class="news-card">
    <img src="article-image.jpg" alt="Article Title" class="card-img">
    <div class="card-content">
        <span class="card-category"><i class="fas fa-microchip"></i> Technology</span>
        <h3 class="card-title">Article Title Goes Here</h3>
        <p class="card-desc">Article description text...</p>
        <div class="card-footer">
            <span class="card-date"><i class="far fa-calendar-alt"></i> Apr 10, 2025</span>
            <span class="card-source"><i class="far fa-newspaper"></i> Source Name</span>
        </div>
    </div>
</div>
```

The cards feature:
- Hover animations for enhanced user engagement
- Dynamic category icons based on article type
- Fallback images for missing article images
- Click interaction to navigate to detailed article view

### News Slider Implementation

The slider component provides a focal point for featured articles:

```javascript
class NewsSlider {
    constructor(containerId, options = {}) {
        // Initialize slider properties and elements
        this.container = document.getElementById(containerId);
        this.options = {
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            ...options
        };
        
        // Set up slider elements and state
        this.init();
    }
    
    // Slider methods for navigation, autoplay, and event handling
    // ...
}
```

The slider includes:
- Auto-scrolling with configurable intervals
- Pause-on-hover functionality
- Dot indicators for current slide position
- Previous/next navigation controls
- Smooth transition animations

### Search Functionality

Search is implemented with both desktop and mobile-optimized interfaces:

```javascript
function performSearch(term) {
    if (!term || !term.trim()) {
        return;
    }

    searchTerm = term.trim();
    isSearchActive = true;

    // Update URL and UI for search state
    // ...

    // Fetch and render search results
    fetchNewsWithSearch(searchTerm);
}
```

The search system includes:
- URL parameter integration for shareable search results
- Visual feedback during search operations
- Clear search option to return to normal browsing
- Mobile-optimized search experience with filter tags

### Authentication System

The application uses token-based authentication for API requests:

```javascript
async function getAuthToken() {
    try {
        // Try to use the centralized auth module first
        if (window.auth && typeof window.auth.getToken === 'function') {
            return await window.auth.getToken();
        }
        
        // Fallback to permanent token if auth module unavailable
        const permanentToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        return `Bearer ${permanentToken}`;
    } catch (error) {
        console.error("Failed to get authentication token:", error);
        throw error;
    }
}
```

## API Integration

NewsHub connects to a RESTful API endpoint for article data:

```javascript
const API_BASE_URL = "http://apps.maida.co:8013";
const API_URL = `${API_BASE_URL}/api/v1/articles/latest`;
```

### API Endpoints

The application uses the following endpoints:

1. **Latest Articles**: `GET /api/v1/articles/latest`
   - Query parameters: `page`, `limit`, `category`, `search`
   - Returns paginated article data

2. **Article Detail**: `GET /api/v1/articles/{id}`
   - Returns detailed information for a specific article

3. **Authentication**: `GET /api/v1/auth/generate`
   - Provides authentication tokens for API access

4. **News Api Details**: 
   - Get your api from http://apps.maida.co:8013/docs

### Data Handling

The application processes and displays API data with robust error handling:

```javascript
async function fetchNewsData(category = "", page = 1, limit = ITEMS_PER_PAGE) {
    try {
        // Authentication and API request
        // ...
        
        const data = await response.json();
        
        // Process and render news data
        renderNews(data);
        return data;
    } catch (error) {
        console.error("Error fetching news data:", error);
        
        // Fall back to sample data when API fails
        // ...
    }
}
```

## Responsive Design

NewsHub implements a comprehensive responsive design approach:

### CSS Variables for Consistent Styling

```css
:root {
  --primary-color: #e63946;
  --primary-hover: #ff4d5e;
  --primary-dark: #c1121f;
  --text-color: #121212;
  --bg-color: #f1faee;
  --card-bg: #ffffff;
  --header-bg: #f8f9fa;
  --border-color: #ddd;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
  --border-radius: 12px;
}
```

### Media Queries for Different Screen Sizes

```css
@media (max-width: 768px) {
    .logo-img {
        max-height: 40px;
    }

    .news-grid {
        grid-template-columns: 1fr;
    }
    
    /* Mobile-specific adjustments */
    /* ... */
}

@media (max-width: 480px) {
    .slider-container {
        height: 350px;
    }
    
    .slider-content {
        padding: 1rem;
    }
    
    /* Small-screen specific adjustments */
    /* ... */
}
```

### Mobile-Optimized Search Experience

The application provides a specialized search interface for mobile devices with an overlay design and category quick filters.

## Performance Optimizations

NewsHub implements several performance optimizations:

1. **Optimized Asset Loading**
   - External resources loaded from CDNs
   - Deferred JavaScript loading for non-critical scripts

2. **Efficient DOM Manipulation**
   - Use of document fragments for batch DOM updates
   - Throttled event handlers for scroll and resize events

3. **Lazy Loading and Fallbacks**
   - Fallback data for API failures
   - Error handling for image loading with fallback images

4. **Animation Performance**
   - CSS transitions and animations optimized for GPU acceleration
   - Minimal layout thrashing with transform/opacity animations

## Error Handling

The application implements comprehensive error handling:

1. **API Request Failures**
   - Fallback to sample data when API requests fail
   - Detailed error logging for debugging
   - User-friendly error messages

2. **Resource Loading Errors**
   - Image loading error handling with fallbacks
   - Graceful degradation of features when resources are unavailable

3. **Authentication Failures**
   - Token refresh mechanism for expired authentication
   - Fallback authentication methods

## Security Considerations

1. **Authentication**
   - Token-based authentication for API requests
   - Secure token storage practices

2. **Data Handling**
   - Input sanitization for search terms and URL parameters
   - Protection against XSS through proper HTML escaping

3. **External Resources**
   - Trusted CDN sources for external libraries
   - Content Security Policy considerations

## Future Enhancements

Potential areas for future development:

1. **User Accounts and Personalization**
   - User registration and login
   - Saved articles and reading history
   - Personalized news recommendations

2. **Enhanced Content Features**
   - Comment system for articles
   - Social media sharing integration
   - Bookmarking functionality

3. **Technical Improvements**
   - Progressive Web App (PWA) capabilities
   - Offline mode support
   - Advanced caching strategies

4. **Analytics and Insights**
   - Enhanced sentiment analysis
   - Reading time estimates
   - Popularity indicators

## Setup and Installation

To set up the NewsHub project locally:

1. Clone the repository:
   ```
   git clone https://https://github.com/srnox/news-web
   cd newshub
   ```

2. Since this is a frontend-only project, you can serve it using any static file server:
   ```
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js with http-server
   npx http-server
   ```

3. Access the website at `http://localhost:8000` in your browser

## Usage Instructions

### Browsing Articles

- The homepage displays the latest news articles in a grid layout
- Featured articles appear in the slider at the top of the page
- The breaking news ticker provides quick updates at the top of the screen

### Filtering Content

- Click on category buttons to filter articles by topic
- Active category filters are highlighted
- Filter transitions include smooth animations for better user experience

### Searching for Articles

- Click the search icon in the header to open the search interface
- Enter keywords and press Enter or click the search button
- Results will display with the search term and count highlighted
- Click "Clear search" to return to the regular article view

### Reading Articles

- Click on any article card to view the full article details
- Article detail page includes:
  - Full article content
  - Publication date and source information
  - Category and related tags
  - Sentiment analysis (if available)
- Use the back button to return to the article listing

### Mobile Navigation

- On mobile devices, tap the search icon for a full-screen search interface
- Use the category filters in the mobile search menu for quick filtering
- Responsive layout adapts to your device's screen size

---

Created by Salman Ali 
© 2025 NewsHub. All rights reserved.
