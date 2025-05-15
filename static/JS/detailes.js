// Get the book ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookID = urlParams.get('bookID');

// Retrieve the books array from localStorage
const books = JSON.parse(localStorage.getItem('books')) || [];

// Find the specific book based on the bookID
const book = books.find(b => b.bookID === bookID);

if (!book) {
    alert('Book details not found.');
    // Optionally, redirect to another page
} else {
    // Display the book details
    document.getElementById('bookDetails').innerHTML = `
<div class="book-details-container">
    <div class="book-cover">
        <img src="${book.coverImage}" alt="${book.title} Cover" />
    </div>
    <div class="book-info">
        <h1 class="book-title">${book.title}</h1>
        <h2 class="book-author">By ${book.author}</h2>
        <p class="book-category"><strong>Category:</strong> ${book.category}</p>
        <p class="book-description"><strong>Description:</strong> ${book.description}</p>
        <div class="book-actions">
            <a href="borrow.html?bookID=${book.bookID}" class="borrow-button" onclick="event.stopPropagation();">Borrow</a>
        </div>
    </div>
</div>
    `;
}