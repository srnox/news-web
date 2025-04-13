// Constants
const API_BASE_URL = "http://apps.maida.co:8013"
const API_URL = `${API_BASE_URL}/api/v1/articles/latest`
const ITEMS_PER_PAGE = 9

// State variables
let currentCategory = ""
let currentPage = 1
// Removed isDarkTheme variable
let searchTerm = ""
const searchCategory = ""
const searchField = "all"
let isSearchActive = false

// DOM Elements
const newsContainer = document.getElementById("newsContainer")
const categoryFilters = document.getElementById("categoryFilters")
// Removed themeToggle variable

// Search DOM Elements
const searchToggle = document.getElementById("searchToggle")
const searchContainer = document.getElementById("searchContainer")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const searchResults = document.getElementById("searchResults")
const searchQuery = document.getElementById("searchQuery")
const searchResultsCount = document.getElementById("searchResultsCount")
const clearSearch = document.getElementById("clearSearch")
const searchMobileContainer = document.getElementById("searchMobileContainer")
const searchMobileClose = document.getElementById("searchMobileClose")
const searchInputMobile = document.getElementById("searchInputMobile")
const searchBtnMobile = document.getElementById("searchBtnMobile")
const searchOverlay = document.getElementById("searchOverlay")
const searchFilterTags = document.getElementById("searchFilterTags")

// Sample data for fallback
const FALLBACK_NEWS = {
  items: [
    {
      id: "1",
      title: "News API Currently Unavailable",
      description:
        "We're experiencing some issues with our news service. Our team is working to resolve this as quickly as possible.",
      category: "technology",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
    {
      id: "2",
      title: "Using Placeholder News During Maintenance",
      description: "These are placeholder news items displayed while we're reconnecting to our news service.",
      category: "business",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
    {
      id: "3",
      title: "Top Tech Trends of 2025",
      description: "Explore the emerging technologies that are shaping our future and transforming industries.",
      category: "technology",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
    {
      id: "4",
      title: "Global Markets Report",
      description: "Analysis of recent market trends and economic forecasts for the coming quarter.",
      category: "business",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
    {
      id: "5",
      title: "Health Breakthrough: New Treatment Shows Promise",
      description: "Researchers announce promising results in clinical trials for innovative medical treatment.",
      category: "health",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
    {
      id: "6",
      title: "Sports Highlights: Championship Finals",
      description: "Recap of the exciting championship finals and analysis of key moments.",
      category: "sports",
      created_at: new Date().toISOString(),
      source_name: "NewsHub",
    },
  ],
  page: 1,
  pages: 1,
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Always use light mode - removed theme checks
  
  // Add animation class to logo
  if (document.querySelector(".logo")) {
    document.querySelector(".logo").classList.add("animate-logo")
  }

  // Check for search query in URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const searchParam = urlParams.get("search")

  if (searchParam) {
    // If there's a search query in the URL, perform search
    performSearch(searchParam)
  } else {
    // Otherwise load normal data
    loadNewsData(currentCategory)
  }

  // Initialize search
  initializeSearch()

  // Removed theme toggle event listener

  // Category Filter Event Listeners
  if (categoryFilters) {
    categoryFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("category-btn")) {
        // Add animation to button click
        e.target.classList.add("btn-click-effect")
        setTimeout(() => {
          e.target.classList.remove("btn-click-effect")
        }, 300)

        const categoryBtns = document.querySelectorAll(".category-btn")
        categoryBtns.forEach((btn) => btn.classList.remove("active"))
        e.target.classList.add("active")

        currentCategory = e.target.dataset.category

        // Clear any active search when changing category
        if (isSearchActive) {
          clearSearchResults()
        }

        // Add fade-out animation to container
        newsContainer.classList.add("fade-out")

        // Wait for animation to complete before loading new data
        setTimeout(() => {
          // Load real data by category
          loadNewsData(currentCategory)
          // Add fade-in animation after data is loaded
          setTimeout(() => {
            newsContainer.classList.remove("fade-out")
            newsContainer.classList.add("fade-in")
            setTimeout(() => {
              newsContainer.classList.remove("fade-in")
            }, 500)
          }, 100)
        }, 300)
      }
    })
  }
})

// Initialize search functionality
function initializeSearch() {
  if (!searchToggle) return // Skip if elements don't exist

  // Toggle search panel with animation
  searchToggle.addEventListener("click", (e) => {
    e.stopPropagation()

    if (window.innerWidth <= 768) {
      // Show mobile search on smaller screens
      searchMobileContainer.classList.add("active")
      searchOverlay.classList.add("active")
      setTimeout(() => searchInputMobile.focus(), 300)
    } else {
      // Toggle search container with animation on larger screens
      searchContainer.classList.toggle("active")
      searchToggle.classList.toggle("active")

      if (searchContainer.classList.contains("active")) {
        setTimeout(() => searchInput.focus(), 300)

        // Add ripple effect to search button
        const searchBtn = document.getElementById("searchBtn")
        if (searchBtn) {
          searchBtn.classList.add("ripple")
          setTimeout(() => {
            searchBtn.classList.remove("ripple")
          }, 700)
        }
      }
    }
  })

  // Close mobile search
  if (searchMobileClose) {
    searchMobileClose.addEventListener("click", () => {
      searchMobileContainer.classList.remove("active")
      searchOverlay.classList.remove("active")
    })
  }

  // Close search when clicking overlay
  if (searchOverlay) {
    searchOverlay.addEventListener("click", () => {
      searchMobileContainer.classList.remove("active")
      searchOverlay.classList.remove("active")
    })
  }

  // Document click to close search
  document.addEventListener("click", (e) => {
    if (
      searchContainer &&
      !searchContainer.contains(e.target) &&
      !searchToggle.contains(e.target) &&
      searchContainer.classList.contains("active")
    ) {
      searchContainer.classList.remove("active")
      searchToggle.classList.remove("active")
    }
  })

  // Search button click with visual feedback
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      // Add click animation
      searchBtn.classList.add("btn-click")
      setTimeout(() => {
        searchBtn.classList.remove("btn-click")
        performSearch(searchInput.value)
        searchContainer.classList.remove("active")
        searchToggle.classList.remove("active")
      }, 200)
    })
  }

  // Mobile search button click
  if (searchBtnMobile) {
    searchBtnMobile.addEventListener("click", () => {
      // Add click animation
      searchBtnMobile.classList.add("btn-click")
      setTimeout(() => {
        searchBtnMobile.classList.remove("btn-click")
        performSearch(searchInputMobile.value)
        searchMobileContainer.classList.remove("active")
        searchOverlay.classList.remove("active")
      }, 200)
    })
  }

  // Enter key in search input
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // Add animation to search button
        const searchBtn = document.getElementById("searchBtn")
        if (searchBtn) {
          searchBtn.classList.add("btn-click")
          setTimeout(() => {
            searchBtn.classList.remove("btn-click")
          }, 200)
        }

        performSearch(searchInput.value)
        searchContainer.classList.remove("active")
        searchToggle.classList.remove("active")
      }
    })
  }

  // Enter key in mobile search input
  if (searchInputMobile) {
    searchInputMobile.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // Add animation to search button
        const searchBtnMobile = document.getElementById("searchBtnMobile")
        if (searchBtnMobile) {
          searchBtnMobile.classList.add("btn-click")
          setTimeout(() => {
            searchBtnMobile.classList.remove("btn-click")
          }, 200)
        }

        performSearch(searchInputMobile.value)
        searchMobileContainer.classList.remove("active")
        searchOverlay.classList.remove("active")
      }
    })
  }

  // Clear search results
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      clearSearchResults()
    })
  }

  // Category filters in mobile search
  if (searchFilterTags) {
    searchFilterTags.addEventListener("click", (e) => {
      if (e.target.classList.contains("search-filter-tag")) {
        const category = e.target.dataset.category

        // Add click animation
        e.target.classList.add("tag-click")
        setTimeout(() => {
          e.target.classList.remove("tag-click")

          // Update URL with category parameter without reloading
          const url = new URL(window.location)
          url.searchParams.set("category", category)
          window.history.pushState({}, "", url)

          // Update the UI
          searchMobileContainer.classList.remove("active")
          searchOverlay.classList.remove("active")

          // Update category buttons to match selection
          const categoryBtns = document.querySelectorAll(".category-btn")
          categoryBtns.forEach((btn) => {
            if (btn.dataset.category === category) {
              btn.classList.add("active")
            } else {
              btn.classList.remove("active")
            }
          })

          // Update current category and load data
          currentCategory = category
          loadNewsData(currentCategory)
        }, 200)
      }
    })
  }

  // Add CSS for button click animations
  const style = document.createElement("style")
  style.textContent = `
        .btn-click {
            transform: scale(0.95);
            opacity: 0.8;
        }
        
        .tag-click {
            transform: scale(0.95);
            background-color: var(--primary-color) !important;
            color: white !important;
        }
        
        .ripple {
            position: relative;
            overflow: hidden;
        }
        
        .ripple:after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform .5s, opacity 1s;
        }
        
        .ripple:active:after {
            transform: scale(0, 0);
            opacity: .3;
            transition: 0s;
        }
    `
  document.head.appendChild(style)
}

// Function to get a fresh token for API requests (read-only version)
async function getAuthToken() {
  try {
    // Try to use the centralized auth module first
    if (window.auth && typeof window.auth.getToken === "function") {
      return await window.auth.getToken()
    }

    // Fallback to permanent token if auth module not available
    console.log("Auth module not available, using permanent token")

    // This is your permanent token
    const permanentToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2lyZW4iLCJ0eXBlIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTAzLTI1VDE2OjM4OjE0LjQ5MTI1MiJ9.Vrp-HEJLb1dB_KHlu4vz1TZutGM6g0_iiLonrfIBdFE"
    return `Bearer ${permanentToken}` // Always include "Bearer " prefix
  } catch (error) {
    console.error("Failed to get authentication token:", error)
    throw error
  }
}

// Perform search with the given term
function performSearch(term) {
  if (!term || !term.trim()) {
    return
  }

  searchTerm = term.trim()
  isSearchActive = true

  // Update URL with search parameter without reloading
  const url = new URL(window.location)
  url.searchParams.set("search", searchTerm)
  window.history.pushState({}, "", url)

  // Update UI to show search is active
  if (searchQuery) searchQuery.textContent = searchTerm
  if (searchResults) searchResults.style.display = "block"

  // Sync the search inputs
  if (searchInput) searchInput.value = searchTerm
  if (searchInputMobile) searchInputMobile.value = searchTerm

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })

  // Show loading
  newsContainer.innerHTML =
    '<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Searching articles...</div>'

  // Fetch news with search term
  fetchNewsWithSearch(searchTerm)
}

// Fetch news with search term
async function fetchNewsWithSearch(term) {
  try {
    // Fetch the token
    const token = await getAuthToken()
    console.log("Using token for search:", token)

    const apiUrl = new URL(API_URL)
    apiUrl.searchParams.set("search", term)

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: token, // Changed: Remove 'Bearer ' prefix
        accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Search failed with status ${response.status}`)
    }

    const data = await response.json()
    renderSearchResults(data)
  } catch (error) {
    console.error("Error fetching search results:", error)

    // Filter fallback data by search term (case-insensitive)
    const term = searchTerm.toLowerCase()
    const filteredItems = FALLBACK_NEWS.items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term)),
    )

    // Display fallback search results
    renderSearchResults({
      items: filteredItems,
      page: 1,
      pages: 1,
    })
  }
}

// Render search results
function renderSearchResults(results) {
  // Update the count if the element exists
  if (searchResultsCount && results.items) searchResultsCount.textContent = results.items.length

  // If no results found
  if (!results.items || results.items.length === 0) {
    newsContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-search"></i> 
                No articles found matching "${searchTerm}".
                <p>Try different keywords or remove some filters.</p>
            </div>
        `
    return
  }

  // Render the results
  renderNews(results)
}

// Clear search and return to normal view
function clearSearchResults() {
  searchTerm = ""
  isSearchActive = false

  // Update URL to remove search parameter
  const url = new URL(window.location)
  url.searchParams.delete("search")
  window.history.pushState({}, "", url)

  // Update UI
  if (searchResults) searchResults.style.display = "none"
  if (searchInput) searchInput.value = ""
  if (searchInputMobile) searchInputMobile.value = ""

  // Load normal data based on the selected category
  loadNewsData(currentCategory)
}

// Function to go to a specific page
function goToPage(page) {
  currentPage = page
  window.scrollTo({ top: 0, behavior: "smooth" })
  loadNewsData(currentCategory, page)
}

// Load news data from API
function loadNewsData(category = "", page = currentPage) {
  // Skip if search is active
  if (isSearchActive) {
    return
  }

  // Show loading animation
  newsContainer.innerHTML =
    '<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Loading news articles...</div>'

  // Fetch data from API
  fetchNewsData(category, page, ITEMS_PER_PAGE)
    .then((data) => {
      // When data is loaded, add pagination
      if (data && data.page && data.pages) {
        // Use the simple pagination style
        addSimplePagination(data.page, data.pages)
      }
    })
    .catch((error) => {
      console.error("Error adding pagination:", error)
    })
}

// Fetch news data from API with fallback
async function fetchNewsData(category = "", page = 1, limit = ITEMS_PER_PAGE) {
  try {
    // Try to get a token and make the API request
    let token
    try {
      token = await getAuthToken()
      console.log("Token for news data:", token)
    } catch (error) {
      console.error("Authentication failed, using fallback data:", error)
      // Filter fallback data by category if specified
      if (category) {
        const filteredItems = FALLBACK_NEWS.items.filter((item) => item.category === category)
        const fallbackData = { ...FALLBACK_NEWS, items: filteredItems }
        renderNews(fallbackData)
        return fallbackData
      }
      renderNews(FALLBACK_NEWS)
      return FALLBACK_NEWS
    }

    // Construct URL with query parameters
    const apiUrl = new URL(API_URL)
    apiUrl.searchParams.set("page", page.toString())
    apiUrl.searchParams.set("limit", limit.toString())

    // Add category filter if specified
    if (category) {
      apiUrl.searchParams.set("category", category)
    }

    console.log("Fetching news from URL:", apiUrl.toString())

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token, // This should now include "Bearer " prefix
      },
    })

    // Log response status for debugging
    console.log("API Response Status:", response.status)

    if (!response.ok) {
      // Try to get more detailed error information
      try {
        const errorData = await response.json()
        console.error("API Error details:", errorData)
      } catch (e) {
        console.error("Could not parse error response")
      }
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response Data:", data)

    // Process items to add missing category if needed
    if (data && data.items && data.items.length > 0) {
      data.items = data.items.map((article) => {
        if (!article.category) {
          article.category = extractCategory(article)
        }
        return article
      })
    }

    // Check if the response contains the expected data structure
    if (!data || !data.items) {
      throw new Error("Invalid response format from API")
    }

    renderNews(data)

    // Return the data for pagination
    return data
  } catch (error) {
    console.error("Error fetching news data:", error)

    // Filter fallback data by category if specified
    let fallbackData = FALLBACK_NEWS
    if (category) {
      const filteredItems = FALLBACK_NEWS.items.filter((item) => item.category === category)
      fallbackData = { ...FALLBACK_NEWS, items: filteredItems }
    }

    // Display error message and use fallback data
    newsContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i> 
                Error fetching news: ${error.message}
                <p>Showing placeholder news instead.</p>
            </div>
        `

    // Render fallback news after a small delay to show the error
    setTimeout(() => {
      renderNews(fallbackData)
    }, 2000)

    // Return fallback data for pagination
    return fallbackData
  }
}

function renderNews(newsData) {
  // Clear loading message
  newsContainer.innerHTML = ""

  if (!newsData || !newsData.items || newsData.items.length === 0) {
    newsContainer.innerHTML = '<div class="error"><i class="fas fa-exclamation-circle"></i> No articles found.</div>'
    return
  }

  // Create a document fragment to hold all the news cards
  const fragment = document.createDocumentFragment()

  // Loop through each news item and create card
  newsData.items.forEach((article, index) => {
    const card = document.createElement("div")
    card.className = "news-card"

    // Add animation delay based on index for staggered appearance
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("card-animate-in")

    // Format date
    const publishedDate = new Date(article.created_at || new Date())
    const formattedDate = publishedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    // Create icon for card based on category
    let categoryIcon = ""
    switch (article.category) {
      case "technology":
        categoryIcon = '<i class="fas fa-microchip"></i>'
        break
      case "business":
        categoryIcon = '<i class="fas fa-chart-line"></i>'
        break
      case "sports":
        categoryIcon = '<i class="fas fa-running"></i>'
        break
      case "entertainment":
        categoryIcon = '<i class="fas fa-film"></i>'
        break
      case "health":
        categoryIcon = '<i class="fas fa-heartbeat"></i>'
        break
      case "science":
        categoryIcon = '<i class="fas fa-atom"></i>'
        break
      default:
        categoryIcon = '<i class="fas fa-newspaper"></i>'
    }

    // Use urlToImage instead of article_image_url for image source
    const imageUrl = article.urlToImage || `https://picsum.photos/600/400?random=${index}`

    card.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}" class="card-img" onerror="this.onerror=null;this.src='https://picsum.photos/600/400?random=${index}';this.alt='Placeholder image';">
            <div class="card-content">
                <span class="card-category">${categoryIcon} ${article.category || "General"}</span>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-desc">${article.description || "No description available."}</p>
                <div class="card-footer">
                    <span class="card-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="card-source"><i class="far fa-newspaper"></i> ${article.source_name || "Unknown Source"}</span>
                </div>
            </div>
        `

    // Add click event to card to open article detail page
    card.addEventListener("click", () => {
      // Add click animation
      card.classList.add("card-click")

      // Navigate to detail page with article ID
      setTimeout(() => {
        window.location.href = `detail.html?id=${article.id || encodeURIComponent(article.title)}`
      }, 200)
    })

    fragment.appendChild(card)
  })

  // Append all cards to the news container
  newsContainer.appendChild(fragment)
}

// Function to extract category from article content, title, or description
function extractCategory(article) {
  // If article already has a category, use it
  if (article.category) {
    return article.category
  }

  // List of categories to detect
  const categoryKeywords = {
    technology: [
      "tech",
      "apple",
      "google",
      "microsoft",
      "android",
      "iphone",
      "smartphone",
      "app",
      "software",
      "hardware",
      "gadget",
      "computer",
      "ai",
      "artificial intelligence",
      "digital",
      "programming",
      "code",
      "developer",
      "cyber",
      "gaming",
      "game",
    ],
    business: [
      "business",
      "economy",
      "market",
      "stock",
      "finance",
      "economic",
      "company",
      "startup",
      "entrepreneur",
      "investment",
      "investor",
      "profit",
      "revenue",
      "fiscal",
      "commercial",
      "trade",
      "corporate",
      "industry",
    ],
    sports: [
      "sport",
      "football",
      "soccer",
      "basketball",
      "baseball",
      "nfl",
      "nba",
      "mlb",
      "tennis",
      "golf",
      "olympic",
      "athlete",
      "championship",
      "tournament",
      "match",
      "game",
      "team",
      "player",
      "coach",
      "league",
    ],
    entertainment: [
      "entertainment",
      "movie",
      "film",
      "tv",
      "television",
      "show",
      "actor",
      "actress",
      "celebrity",
      "music",
      "song",
      "album",
      "artist",
      "concert",
      "festival",
      "award",
      "hollywood",
      "star",
      "fame",
      "theater",
    ],
    health: [
      "health",
      "medical",
      "doctor",
      "hospital",
      "patient",
      "disease",
      "treatment",
      "therapy",
      "medicine",
      "drug",
      "pharmaceutical",
      "wellness",
      "fitness",
      "diet",
      "nutrition",
      "mental health",
      "healthcare",
      "vaccine",
    ],
    science: [
      "science",
      "scientific",
      "research",
      "study",
      "discovery",
      "experiment",
      "laboratory",
      "space",
      "nasa",
      "astronomy",
      "physics",
      "chemistry",
      "biology",
      "earth",
      "climate",
      "environment",
      "planet",
      "species",
      "evolution",
    ],
  }

  // Combine all text fields for analysis
  const textToAnalyze = [article.title || "", article.description || "", article.content || ""].join(" ").toLowerCase()

  // Check for keywords in each category
  const categoryMatches = {}

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    // Count matches for this category
    let matches = 0

    for (const keyword of keywords) {
      // Use word boundary to match whole words only
      const regex = new RegExp(`\\b${keyword}\\b`, "i")
      if (regex.test(textToAnalyze)) {
        matches++
      }
    }

    if (matches > 0) {
      categoryMatches[category] = matches
    }
  }

  // If there are matches, find the category with the most matches
  if (Object.keys(categoryMatches).length > 0) {
    let bestMatch = ""
    let highestCount = 0

    for (const [category, count] of Object.entries(categoryMatches)) {
      if (count > highestCount) {
        highestCount = count
        bestMatch = category
      }
    }

    return bestMatch
  }

  // Special case: Check source name for category clues
  if (article.source_name) {
    const sourceLower = article.source_name.toLowerCase()

    // Common tech sources
    if (/techcrunch|wired|cnet|verge|engadget|mashable|gizmodo|zdnet|arstechnica|venturebeat/.test(sourceLower)) {
      return "technology"
    }

    // Common business sources
    if (/forbes|bloomberg|wsj|wall street|cnbc|economist|business|financial|reuters|fortune/.test(sourceLower)) {
      return "business"
    }

    // Common sports sources
    if (/espn|sport|athletic|bleacher report|nba|nfl|mlb|fifa|tennis|golf/.test(sourceLower)) {
      return "sports"
    }

    // Common entertainment sources
    if (/entertainment|hollywood|variety|tmz|billboard|rolling stone|cinema|movie|film|theater/.test(sourceLower)) {
      return "entertainment"
    }

    // Common health sources
    if (/health|medical|medicine|webmd|mayo|healthline|fitness|wellbeing|wellness/.test(sourceLower)) {
      return "health"
    }

    // Common science sources
    if (/science|scientific|nature|natgeo|national geographic|discover|space|nasa|physics|earth/.test(sourceLower)) {
      return "science"
    }
  }

  // Default fallback
  return "general"
}

// Removed enableDarkMode and enableLightMode functions

// Make goToPage function available globally
window.goToPage = goToPage