// Centralized authentication for NewsHub (FastAPI version)

const AUTH_API_URL = "http://apps.maida.co:8013/api/v1/auth/generate"; // Updated API endpoint
const TOKEN_STORAGE_KEY = "newshub_api_token";
const TOKEN_EXPIRY_KEY = "newshub_token_expiry";

// Your permanent token - this is provided by the API service
const PERMANENT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2lyZW4iLCJ0eXBlIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTAzLTI1VDE2OjM4OjE0LjQ5MTI1MiJ9.Vrp-HEJLb1dB_KHlu4vz1TZutGM6g0_iiLonrfIBdFE";

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