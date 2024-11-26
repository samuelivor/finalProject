function explore() {
    console.log("Explore function called");
    const popup = document.getElementById('myPopup');
    
    // Show the popup
    console.log(popup.visibility);
    showPopup(popup);
    
    // Display temporary loading text
    popup.textContent = 'Loading destinations...';

    // Fetch data from the JSON file and update the popup content
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse JSON
        })
        .then(data => {
            // Use the fetched data to populate the popup
            popup.innerHTML = formatPopupContent(data);
        })
        .catch(error => {
            console.error("Error fetching destinations:", error);
            popup.innerHTML = "Failed to load destinations.";
        });
}

async function fetchJSON(url) {
    try {
        // Fetch data from the provided URL
        const response = await fetch(url);

        // Check if the response is OK (status code 200–299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and return the JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        // Log and rethrow the error for the caller to handle
        console.error(`Error fetching JSON data: ${error.message}`);
        throw error;
    }
}

function showPopup(popup) {
    const visibility = window.getComputedStyle(popup).visibility;
    if(visibility == 'hidden'){
        popup.style.visibility = 'visible';
    }
}

function hidePopup(popup) {
    const visibility = window.getComputedStyle(popup).visibility;
    if(visibility == 'visible'){
        popup.style.visibility = 'hidden';
    }
}

function clearSearch() {
    // Get the search input element
    const searchInput = document.getElementById('search');

    // Clear its value
    searchInput.value = '';
    const popup = document.getElementById('myPopup');
    hidePopup(popup);
}

function formatPopupContent(data) {
    // Assuming `data` is an array of destinations
    if (Array.isArray(data)) {
        return data
        .map(item => `
            <div class="destination">
                <div class="country-name">${item.country}</div>
                <img src="${item.imgURL}" alt="${item.imgURL}" class="destination-image">
                <strong>Main city:</strong> ${item.city}<br>
                <strong>Description:</strong> ${item.description}<br><br>
            </div>
        `)
        .join('');
    }
    return "No destinations found.";
}

async function search() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    const popup = document.getElementById('myPopup');
    const homeSection = document.getElementById('home-page'); // Reference to the home section

    // Scroll to the home section
    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        // Fetch the data
        const destinations = await fetchJSON('travel_recommendation_api.json');

        // Search for a match by checking if any keyword is contained within the search sentence
        const matches = destinations.filter(destination => 
            destination.keywords.some(keyword => searchValue.includes(keyword.toLowerCase()))
        );

        if (matches.length > 0) {
            // Display the result in the popup for all matches
            popup.innerHTML = matches.map(match => `
                <div class="destination">
                    <div class="country-name">${match.country}</div>
                    <img src="${match.imgURL}" alt="${match.country}" class="destination-image">
                    <strong>Main city:</strong> ${match.city}<br>
                    <strong>Description:</strong> ${match.description}<br><br>
                </div>
            `).join('');
        } else {
            popup.innerHTML = "Sorry, it seems this is not yet an SF-Adventure Travel destination.";
        }
        // Scroll the popup to the top
        popup.scrollTop = 0;  // Scroll to the top of the popup window
    } catch (error) {
        // Display an error message in the popup
        popup.innerHTML = 'Failed to fetch data. Please try again later.';
    }

    // Show the popup
    showPopup(popup);
}

function sendMessage() {
    // Get the send button and the flex container
    const sendButton = document.getElementById('send_message');

    // Clear the form inputs
    const formInputs = document.querySelectorAll('#contact-us input, #contact-us textarea');
    formInputs.forEach(input => input.value = '');

    sendButton.textContent = "SENT!";
    sendButton.disabled = true;
}

