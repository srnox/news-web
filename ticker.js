// Add this to your script.js file or create a new ticker.js file

document.addEventListener("DOMContentLoaded", () => {
    // Duplicate ticker items for seamless scrolling
    const tickerItems = document.querySelector(".ticker-items")
    if (tickerItems) {
      const tickerItemsClone = tickerItems.innerHTML
      tickerItems.innerHTML = tickerItemsClone + tickerItemsClone
  
      // Adjust animation speed based on content width
      const tickerWidth = tickerItems.scrollWidth / 2
      const animationDuration = tickerWidth / 50 // Adjust divisor for speed
  
      tickerItems.style.animationDuration = animationDuration + "s"
    }
  
    // Optional - Fetch real-time data for the ticker
    // This is a placeholder for where you would add API calls to get real financial data
    function updateTickerData() {
      // Example: fetch("https://api.example.com/market-data")
      //    .then(response => response.json())
      //    .then(data => {
      //        // Update ticker items with real data
      //    });
      // For now, we're using the static data in the HTML
    }
  
    // Call once on page load
    updateTickerData()
  
    // Update every 5 minutes (300000 ms)
    setInterval(updateTickerData, 300000)
  
    // Add pulse animation to search toggle after a delay
    setTimeout(() => {
      const searchToggle = document.getElementById("searchToggle")
      if (searchToggle) {
        searchToggle.classList.add("pulse")
  
        // Remove pulse after user interacts with search
        searchToggle.addEventListener("click", () => {
          searchToggle.classList.remove("pulse")
        })
  
        // Also remove pulse when user starts scrolling
        window.addEventListener(
          "scroll",
          () => {
            searchToggle.classList.remove("pulse")
          },
          { once: true },
        )
      }
    }, 3000)
  })
  