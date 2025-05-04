document.addEventListener('DOMContentLoaded', function() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookContainer = document.querySelector('.book-grid');

    // Dynamically create book cards
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
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
                <a href="editbook.html?bookID=${book.bookID}" onclick="event.stopPropagation();">Edit</a>
            </div>
        `;

        // Use event listener for book selection navigation
        bookCard.addEventListener('click', function() {
            window.location.href = `BookDescription.html?bookID=${book.bookID}`;
        });

        bookContainer.appendChild(bookCard);
    });

    // Function to filter books based on search input
    function searchBooks() {
        const searchInput = document.querySelector(".search-box input").value.toLowerCase().trim();
        const bookCards = bookContainer.querySelectorAll('.book-card');

        bookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            
            // Show books that contain the search term
            card.style.display = title.includes(searchInput) ? 'block' : 'none';
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

    // Enable real-time filtering while typing
    searchInputField.addEventListener("input", searchBooks);
});
