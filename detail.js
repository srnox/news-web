// Constants for API
const DETAIL_API_BASE_URL = "http://apps.maida.co:8013";
const DETAIL_API_URL = `${DETAIL_API_BASE_URL}/api/v1/articles`;

// DOM Elements
const articleDetail = document.getElementById('articleDetail');
const backBtn = document.getElementById('backBtn');
// Removed themeToggle variable

// State
// Removed isDarkTheme variable

// Fallback article data
const FALLBACK_ARTICLE = {
    id: "fallback-article",
    title: "Article Currently Unavailable",
    description: "We're experiencing some issues with our article service. Our team is working to resolve this as quickly as possible.",
    content: "This is a placeholder article shown when we're unable to load the requested content. Please try again later or browse other articles on our homepage.\n\nIn the meantime, here are some things you might be interested in:\n\n1. Check out our homepage for the latest news across all categories.\n\n2. Use the search function to find articles related to topics you're interested in.\n\n3. Our technology section features the latest updates in tech and innovation.\n\n4. Visit our business section for market updates and industry news.",
    category: "general",
    created_at: new Date().toISOString(),
    source_name: "NewsHub",
    authors: ["NewsHub Team"],
    country: "Global",
    keywords: ["news", "update", "service"]
};

// Function to get a fresh token for article detail requests (read-only version)
async function getDetailAuthToken() {
    try {
        // Try to use the centralized auth module first
        if (window.auth && typeof window.auth.getToken === 'function') {
            return await window.auth.getToken();
        }
        
        console.log("Using permanent token for article detail");
        
        // Use your permanent token
        const permanentToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2lyZW4iLCJ0eXBlIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTAzLTI1VDE2OjM4OjE0LjQ5MTI1MiJ9.Vrp-HEJLb1dB_KHlu4vz1TZutGM6g0_iiLonrfIBdFE";
        return `Bearer ${permanentToken}`; // Add Bearer prefix
    } catch (error) {
        console.error("Failed to get detail authentication token:", error);
        throw error;
    }
}

// Initialize page with improved error handling
document.addEventListener('DOMContentLoaded', function() {
    // Always use light mode - removed theme checks
    
    // Add animation to logo
    if (document.querySelector('.logo')) {
        document.querySelector('.logo').classList.add('animate-logo');
    }
    
    // Load article data
    const articleId = getArticleIdFromUrl();
    if (!articleId) {
        showError('Article ID not found in URL. Please return to the homepage and try again.');
        return;
    }
    
    loadArticleData(articleId);
    
    // Set up event listeners
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Add animation to back button
            backBtn.classList.add('btn-click-effect');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    }
    
    // Removed theme toggle event listener
});

// Get article ID from URL parameter
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load article data from API with improved error handling and fallback
async function loadArticleData(articleId) {
    try {
        const token = await getDetailAuthToken();
        console.log("Using token for article detail:", token);
        
        // First try to load article by ID if it's a valid ID
        if (articleId && !articleId.includes('%20')) {
            try {
                const response = await fetch(`${DETAIL_API_URL}/${articleId}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': token
                    }
                });
                
                console.log("Article detail API response status:", response.status);
                
                if (response.ok) {
                    const article = await response.json();
                    if (article && article.title) {
                        renderArticleDetail(article);
                        return;
                    }
                }
                // If fetching by ID fails, continue to fetching from latest
                console.log("Could not fetch article by ID, trying from latest articles");
            } catch (idError) {
                console.error("Error fetching by ID:", idError);
                // Continue to fallback methods
            }
        }
        
        // Fetch from latest articles as fallback or if ID is not a simple string
        await fetchArticleFromLatest(articleId);
    } catch (error) {
        console.error("Error loading article:", error);
        // Use the fallback article as last resort
        renderArticleDetail({...FALLBACK_ARTICLE, id: articleId});
    }
}

// Fallback to fetch article from latest articles endpoint
async function fetchArticleFromLatest(articleId) {
    try {
        // Try to find the article in the latest articles
        const token = await getDetailAuthToken();
        let apiUrl = new URL(`${DETAIL_API_BASE_URL}/api/v1/articles/latest`);
        apiUrl.searchParams.set('limit', '50'); // Set a higher limit to increase chances of finding the article
        
        console.log("Trying fallback fetch from:", apiUrl.toString());
        
        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': token
            }
        });
        
        // Log response status
        console.log("Fallback API Response Status:", response.status);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fallback data received, searching for article ID or title:", articleId);
        
        // Try to decode the title if it's URL encoded
        const decodedId = decodeURIComponent(articleId);
        
        // Find the article by ID or title
        const article = data.items.find(item => 
            (item.id && item.id === articleId) || 
            item.title === decodedId
        );
        
        if (!article) {
            throw new Error('Article not found. It may have been removed or is no longer available.');
        }
        
        renderArticleDetail(article);
        return true;
    } catch (error) {
        console.error('Error in fallback fetch:', error);
        throw error;
    }
}

function renderArticleDetail(article) {
    if (!articleDetail) {
        console.error('Article detail container not found');
        return;
    }
    
    // Add animation class
    articleDetail.classList.add('article-animate-in');
    
    // Format date
    const publishedDate = new Date(article.created_at || new Date());
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create icon for category
    let categoryIcon = '';
    switch(article.category) {
        case 'technology':
            categoryIcon = '<i class="fas fa-microchip"></i>';
            break;
        case 'business':
            categoryIcon = '<i class="fas fa-chart-line"></i>';
            break;
        case 'sports':
            categoryIcon = '<i class="fas fa-running"></i>';
            break;
        case 'entertainment':
            categoryIcon = '<i class="fas fa-film"></i>';
            break;
        case 'health':
            categoryIcon = '<i class="fas fa-heartbeat"></i>';
            break;
        case 'science':
            categoryIcon = '<i class="fas fa-atom"></i>';
            break;
        default:
            categoryIcon = '<i class="fas fa-newspaper"></i>';
    }
    
    // Process content to safely display HTML
    const processedContent = article.content 
        ? article.content.replace(/\n/g, '<br>') 
        : 'Full article content not available.';
    
    // Use urlToImage instead of article_image_url
    const imageUrl = article.urlToImage || null;
    
    // Create HTML content
    let html = `
        ${imageUrl ? 
            `<img src="${imageUrl}" alt="${article.title}" class="article-hero" onerror="this.onerror=null;this.src='https://picsum.photos/1200/600?random=1';this.alt='Placeholder image';">` : 
            `<div class="article-hero-placeholder">NewsHub</div>`
        }
        <div class="article-content">
            <div class="article-header">
                <span class="article-category">${categoryIcon} ${article.category || 'General'}</span>
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    <span class="article-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="article-country"><i class="fas fa-globe-americas"></i> ${article.country || 'Global'}</span>
                </div>
                <p class="article-description">${article.description || 'No description available.'}</p>
            </div>
            
            <div class="article-body">
                ${processedContent}
            </div>
            
            ${article.sentiment ? renderSentimentSection(article.sentiment) : ''}
            
            ${article.keywords && article.keywords.length > 0 ? `
                <div class="article-keywords">
                    ${article.keywords.map(keyword => `<span class="keyword-tag"><i class="fas fa-tag"></i> ${keyword}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="article-footer">
                <div class="article-authors">
                    <i class="fas fa-user-edit"></i> By ${article.authors && article.authors.length > 0 ? article.authors.join(', ') : 'Unknown'}
                </div>
                <div class="article-source">
                    <i class="far fa-newspaper"></i> Source: ${article.source_name || 'Unknown Source'}
                </div>
                ${article.url ? `
                <div class="article-original">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> Read Original Article
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    articleDetail.innerHTML = html;
    
    // Add scroll effects to elements
    addScrollEffects();
    
    // Update page title
    document.title = `${article.title} - NewsHub`;
}

// Add scroll effects to elements
function addScrollEffects() {
    const elements = document.querySelectorAll('.article-title, .article-description, .article-body, .sentiment-container, .article-keywords, .article-footer');
    
    // Use IntersectionObserver if supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        elements.forEach(el => {
            el.classList.add('scroll-animate');
        });
    }
}

// Render sentiment analysis section
function renderSentimentSection(sentiment) {
    if (!sentiment) return '';
    
    const positive = sentiment.positive || 0;
    const neutral = sentiment.neutral || 0;
    const negative = sentiment.negative || 0;
    
    return `
        <div class="sentiment-container">
            <h3 class="sentiment-title"><i class="fas fa-chart-pie"></i> Article Sentiment Analysis</h3>
            <div class="sentiment-bar">
                <div class="sentiment-positive" style="width: ${positive * 100}%"></div>
                <div class="sentiment-neutral" style="width: ${neutral * 100}%"></div>
                <div class="sentiment-negative" style="width: ${negative * 100}%"></div>
            </div>
            <div class="sentiment-labels">
                <span>Positive: ${Math.round(positive * 100)}%</span>
                <span>Neutral: ${Math.round(neutral * 100)}%</span>
                <span>Negative: ${Math.round(negative * 100)}%</span>
            </div>
        </div>
    `;
}

// Show improved error message with support information
function showError(message) {
    if (!articleDetail) {
        console.error('Article detail container not found');
        return;
    }
    
    articleDetail.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-circle"></i> 
            ${message}
            <p>
                <button onclick="window.location.href='index.html'" class="error-button">
                    <i class="fas fa-home"></i> Return to Homepage
                </button>
            </p>
            <small>If this problem persists, please contact our support team.</small>
        </div>
    `;
}