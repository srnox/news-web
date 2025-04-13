// Constants for API
const SLIDER_API_BASE_URL = "http://apps.maida.co:8013";
const SLIDER_API_URL = `${SLIDER_API_BASE_URL}/api/v1/articles/latest`;

// Slider functionality
class NewsSlider {
    constructor(containerId, options = {}) {
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Default options
        this.options = {
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            ...options
        };
        
        // Slider elements
        this.wrapper = this.container.querySelector('.slider-wrapper');
        this.slides = this.container.querySelectorAll('.slider-slide');
        this.dotsContainer = this.container.querySelector('.slider-dots');
        this.prevButton = this.container.querySelector('.slider-prev');
        this.nextButton = this.container.querySelector('.slider-next');
        
        // Slider state
        this.currentIndex = 0;
        this.slidesCount = this.slides.length;
        this.slideWidth = this.container.offsetWidth;
        this.autoplayInterval = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create dots if container exists
        if (this.dotsContainer) {
            this.createDots();
        }
        
        // Set up event listeners
        this.addEventListeners();
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Set initial slide position
        this.goToSlide(this.currentIndex);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slideWidth = this.container.offsetWidth;
            this.goToSlide(this.currentIndex);
        });
    }
    
    createDots() {
        for (let i = 0; i < this.slidesCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    addEventListeners() {
        // Button navigation
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling to slide
                this.prevSlide();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling to slide
                this.nextSlide();
            });
        }
        
        // Pause on hover
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                if (this.options.autoplay) {
                    this.startAutoplay();
                }
            });
        }
        
        // Click on slide
        this.slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                // Get article ID from data attribute
                const articleId = slide.dataset.articleId;
                if (articleId) {
                    // Add click animation
                    slide.classList.add('slider-slide-click');
                    
                    // Navigate after a short delay for animation
                    setTimeout(() => {
                        window.location.href = `detail.html?id=${articleId}`;
                    }, 200);
                }
            });
        });
    }
    
    prevSlide() {
        let index = this.currentIndex - 1;
        if (index < 0) {
            index = this.slidesCount - 1;
        }
        this.goToSlide(index);
    }
    
    nextSlide() {
        let index = this.currentIndex + 1;
        if (index >= this.slidesCount) {
            index = 0;
        }
        this.goToSlide(index);
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        
        // Update transform
        const translateX = -index * this.slideWidth;
        this.wrapper.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Reset autoplay timer
        if (this.options.autoplay) {
            this.pauseAutoplay();
            this.startAutoplay();
        }
    }
    
    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.interval);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Function to get a fresh token for slider requests
async function getSliderAuthToken() {
    try {
        // Try to use the centralized auth module first
        if (window.auth && typeof window.auth.getToken === 'function') {
            return await window.auth.getToken();
        }
        
        console.log("Using permanent token for slider");
        
        // Use your permanent token
        const permanentToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2lyZW4iLCJ0eXBlIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTAzLTI1VDE2OjM4OjE0LjQ5MTI1MiJ9.Vrp-HEJLb1dB_KHlu4vz1TZutGM6g0_iiLonrfIBdFE";
        return `Bearer ${permanentToken}`; // Add Bearer prefix
    } catch (error) {
        console.error("Failed to get slider authentication token:", error);
        throw error;
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch featured articles from API and create slider
    fetchFeaturedArticles();
});

// Fetch featured articles from API with improved error handling and fallback
async function fetchFeaturedArticles() {
    try {
        createLoadingSlider(); // Show loading state
        
        const token = await getSliderAuthToken();
        console.log("Using token for slider:", token);

        const response = await fetch(`${SLIDER_API_URL}?limit=5`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': token  // Changed: Remove 'Bearer ' prefix
            }
        });
        
        console.log("Slider API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Slider data received, articles count:", data.items ? data.items.length : 0);
        
        if (!data || !data.items || data.items.length === 0) {
            throw new Error("No featured articles found");
        }

        // Create the slider with the fetched articles
        createNewsSlider(data.items);
    } catch (error) {
        console.error('Error fetching slider data:', error);
        
        // Use fallback data for slider
        const fallbackArticles = [
            {
                id: "featured1",
                title: "Breaking: NewsHub API Update In Progress",
                description: "We're updating our news database. Featured articles will return shortly. Thank you for your patience.",
                category: "technology",
                created_at: new Date().toISOString(),
                source_name: "NewsHub",
                article_image_url: "https://picsum.photos/1200/600?random=1"
            },
            {
                id: "featured2",
                title: "Technology Trends Reshaping Industries in 2025",
                description: "Discover how AI, quantum computing, and sustainable tech are transforming businesses worldwide.",
                category: "technology",
                created_at: new Date().toISOString(),
                source_name: "NewsHub",
                article_image_url: "https://picsum.photos/1200/600?random=2"
            },
            {
                id: "featured3",
                title: "Global Market Watch: Economic Forecasts",
                description: "Analysis of current market trends and predictions for the coming quarter.",
                category: "business",
                created_at: new Date().toISOString(),
                source_name: "NewsHub",
                article_image_url: "https://picsum.photos/1200/600?random=3"
            }
        ];
        
        // Create slider with fallback data
        createNewsSlider(fallbackArticles);
    }
}

// Create loading placeholder for slider
function createLoadingSlider() {
    const container = document.createElement('div');
    container.id = 'newsSlider';
    container.className = 'slider-container';
    
    container.innerHTML = `
        <div class="slider-loading">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Loading featured articles...</p>
        </div>
    `;
    
    // Insert slider at the beginning of the container
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        // Check if the newsSlider already exists
        const existingSlider = document.getElementById('newsSlider');
        if (existingSlider) {
            existingSlider.innerHTML = container.innerHTML;
        } else {
            mainContainer.insertBefore(container, mainContainer.firstChild);
        }
    }
}

// Improved error slider with more specific error message
function createErrorSlider(errorMessage) {
    const container = document.getElementById('newsSlider');
    if (!container) {
        // Create container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = 'newsSlider';
        newContainer.className = 'slider-container';
        
        newContainer.innerHTML = `
            <div class="slider-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading featured articles: ${errorMessage}</p>
                <small>Please refresh the page to try again or contact support if the problem persists.</small>
            </div>
        `;
        
        // Insert into page
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.insertBefore(newContainer, mainContainer.firstChild);
        }
        return;
    }
    
    container.innerHTML = `
        <div class="slider-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error loading featured articles: ${errorMessage}</p>
            <small>Please refresh the page to try again or contact support if the problem persists.</small>
        </div>
    `;
}

function createNewsSlider(articles) {
    // If no articles, show error
    if (!articles || articles.length === 0) {
        createErrorSlider('No featured articles found');
        return;
    }
    
    console.log(`Creating slider with ${articles.length} articles`);
    
    // Get or create container
    let container = document.getElementById('newsSlider');
    if (!container) {
        container = document.createElement('div');
        container.id = 'newsSlider';
        container.className = 'slider-container';
        
        // Insert slider at the beginning of the container
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.insertBefore(container, mainContainer.firstChild);
        }
    } else {
        // Clear loading state
        container.innerHTML = '';
    }
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    
    // Create slides
    articles.forEach((article, index) => {
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        slide.dataset.articleId = article.id || encodeURIComponent(article.title); // Use title if id is not available
        
        // Format date
        const publishedDate = new Date(article.created_at || new Date());
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

        const breakingBadge = index === 0 ? '<div class="breaking-news-badge">Featured</div>' : '';
        
        // Use urlToImage instead of article_image_url
        const imageUrl = article.urlToImage || `https://picsum.photos/1200/600?random=${index}`;
        
        slide.innerHTML = `
            ${breakingBadge}
            <img src="${imageUrl}" alt="${article.title}" class="slider-image" onerror="this.onerror=null;this.src='https://picsum.photos/1200/600?random=${index}';this.alt='Placeholder image';">
            <div class="slider-content">
                <span class="slider-category">${categoryIcon} ${article.category || 'General'}</span>
                <h2 class="slider-title">${article.title}</h2>
                <p class="slider-desc">${article.description || 'No description available.'}</p>
                <div class="slider-meta">
                    <span class="slider-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="slider-source"><i class="far fa-newspaper"></i> ${article.source_name || 'Unknown Source'}</span>
                </div>
            </div>
        `;
        
        wrapper.appendChild(slide);
    });
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    controls.innerHTML = `
        <button class="slider-button slider-prev"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-button slider-next"><i class="fas fa-chevron-right"></i></button>
    `;
    
    // Create dots
    const dots = document.createElement('div');
    dots.className = 'slider-dots';
    
    // Assemble slider
    container.appendChild(wrapper);
    container.appendChild(controls);
    container.appendChild(dots);
    
    // Initialize the slider
    try {
        const newsSlider = new NewsSlider('newsSlider', {
            autoplay: true, 
            interval: 6000, 
            pauseOnHover: true
        });
        console.log("Slider initialized successfully");
    } catch (error) {
        console.error("Error initializing slider:", error);
    }
}