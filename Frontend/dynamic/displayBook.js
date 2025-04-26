document.addEventListener('DOMContentLoaded', function () {
    // Function to display books dynamically
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookContainer = document.querySelector('.book-grid');

    // Display books in the grid
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.setAttribute('onclick', "window.location.href = 'BookDescription.html';");
        bookCard.style.cursor = 'pointer';

        bookCard.innerHTML = `
        <div onclick="event.stopPropagation();">
            <input type="checkbox" id="favorite${book.bookID}" />
            <label for="favorite${book.bookID}" class="favorite-btn">
                <i class="fa-solid fa-heart"></i>
            </label>
            <div class="favorite-counter">
                <span class="favorite-number">0</span>
            </div>
        </div>
        <img src="${book.coverImage}" alt="${book.title} Cover" />
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Genre: ${book.category}</p>
        <div class="book-actions">
            <a href="borrow.html" onclick="event.stopPropagation();">Borrow</a>
        </div>
        `;
        bookContainer.appendChild(bookCard); // Add the card to the container
    });

    // Function to search and filter books
    function searchBooks() {
        const searchInput = document.querySelector(".search-box input").value.toLowerCase().trim();
        const bookCards = bookContainer.querySelectorAll('.book-card'); // Select dynamically added cards
        if(searchInput)
        {
            console.log("get it");
        }

        bookCards.forEach((card) => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            
            // Check if the title starts with the entered text
            if (title.startsWith(searchInput)) {
                card.style.display = 'block'; // Show matching books
            } else {
                card.style.display = 'none'; // Hide non-matching books
            }
        });
    }

    // Attach search functionality to the search box
    const searchButton = document.querySelector(".search-box button");
    const searchInputField = document.querySelector(".search-box input");

    // Listen for search button click
    searchButton.addEventListener("click", function (e) {
        e.preventDefault();
        searchBooks();
    });

    // Listen for real-time user input
    searchInputField.addEventListener("input", searchBooks);
});
