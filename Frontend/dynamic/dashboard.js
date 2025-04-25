// Function to handle heart button clicks
function heartClick(id) {
    // Get elements
    const checkbox = document.getElementById(id);
    const heartContainer = document.querySelector(`label[for="${id}"]`).parentElement;
    const counterSpan = heartContainer.querySelector('.favorite-number');
    let currentLikes = parseInt(counterSpan.textContent);
    
    // Toggle checkbox state (checked/unchecked)
    checkbox.checked = !checkbox.checked;
    
    // If now checked (liked), increment counter
    if (checkbox.checked) {
        currentLikes += 1;
        console.log(`Liked: Increased count for ${id} to ${currentLikes}`);
    } else {
        // If now unchecked (unliked), decrement counter
        currentLikes -= 1;
        console.log(`Unliked: Decreased count for ${id} to ${currentLikes}`);
    }
    
    // Update the counter display
    counterSpan.textContent = currentLikes;
    
    // Prevent default behavior and event propagation
    event.preventDefault();
    event.stopPropagation();
    return false;
}

// Initialize functionality when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard script loaded successfully");
    
    // Add event listeners to all heart buttons programmatically
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const checkboxId = button.getAttribute('for');
        
        // Remove any inline onclick attributes to prevent double-triggering
        button.removeAttribute('onclick');
        
        // Add single click event listener
        button.addEventListener('click', function(event) {
            heartClick(checkboxId);
            event.preventDefault();
            event.stopPropagation();
        }, { once: false }); // Allow multiple clicks
    });
    
    // Initialize all checkboxes to unchecked state
    document.querySelectorAll('input[id^="favorite"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}); 