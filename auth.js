// Centralized authentication for NewsHub (FastAPI version)

const AUTH_API_URL = "PLACE_YOUR_BASEURL"; // Updated API endpoint
const TOKEN_STORAGE_KEY = "newshub_api_token";
const TOKEN_EXPIRY_KEY = "newshub_token_expiry";

// Your permanent token - this is provided by the API service
const PERMANENT_TOKEN = "PLACE_YOUR_TOKEN";

// Function to check if token is valid and not expired
function isTokenValid() {
    // We're using a permanent token, so it's always valid
    return true;
}

// Function to get a valid token (either from storage or a new one)
async function getValidToken() {
    return `Bearer ${PERMANENT_TOKEN}`; // Always prefix with "Bearer " as required by API
}

// This function is no longer needed but kept for API compatibility
async function requestNewToken() {
    return PERMANENT_TOKEN;
}

// Function to make authenticated API requests with token
async function authenticatedFetch(url, options = {}) {
    try {
        const token = await getValidToken();
        
        // Ensure headers object exists
        const headers = {
            'Accept': 'application/json',
            ...options.headers,
            'Authorization': token  // Use Bearer prefix
        };
        
        // Make the request
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        return response;
    } catch (error) {
        console.error("Error making authenticated request:", error);
        throw error;
    }
}

// Export functions to be used in other files
window.auth = {
    getToken: getValidToken,
    fetch: authenticatedFetch
};
