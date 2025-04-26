// Function to handle heart button clicks
function heartClick(id, event) {
    console.log("Heart click triggered for ID:", id);

    // Prevent default behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Get elements
    const checkbox = document.getElementById(id);
    const heartContainer = checkbox.closest('.book-card'); // Ensure correct parent selection
    const counterSpan = heartContainer.querySelector('.favorite-number');
    let currentLikes = parseInt(counterSpan.textContent);
    if (isNaN(currentLikes)) currentLikes = 0; // Set default if invalid

    // Toggle checkbox state (checked/unchecked)
    checkbox.checked = !checkbox.checked;

    // Update the counter based on the new state
    if (checkbox.checked) {
        currentLikes += 1;
        console.log(`Liked: Increased count for ${id} to ${currentLikes}`);
    } else {
        currentLikes -= 1;
        console.log(`Unliked: Decreased count for ${id} to ${currentLikes}`);
    }

    // Update the counter display
    counterSpan.textContent = currentLikes;
}

// Initialize functionality when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard script initialized");

    // Add event listeners to all heart buttons programmatically
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const checkboxId = button.getAttribute('for');

        // Add single click event listener
        button.addEventListener('click', function(event) {
            heartClick(checkboxId, event);
        });
    });
});