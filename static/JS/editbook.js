// Extract bookID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookID = urlParams.get("bookID");

// Retrieve books from localStorage
const books = JSON.parse(localStorage.getItem("books")) || [];
const bookIndex = books.findIndex(b => String(b.bookID) === String(bookID));

if (bookIndex === -1) {
    alert("Book not found!");
} else {
    const book = books[bookIndex];

    // Populate the form dynamically
    document.getElementById("editBookContainer").innerHTML = `
        <form id="editform">
            <label for="title">Book Name:</label>
            <input type="text" id="title" name="title" value="${book.title}">
            
            <label for="author">Author:</label>
            <input type="text" id="author" name="author" value="${book.author}">
            
            <label for="category">Category:</label>
            <input type="text" id="category" name="category" value="${book.category}">
            
            <label for="description">Description:</label>
            <textarea id="description" name="description">${book.description}</textarea>

            <button class="buttonlink edit" type="submit">Edit Book</button>
            <button class="buttonlink delete" type="button">Delete Book</button>
        </form>
    `;
}

// Handle book edit functionality
document.querySelector(".buttonlink.edit").addEventListener("click", function(event) {
    event.preventDefault();

    if (bookIndex !== -1) {
        books[bookIndex] = {
            bookID: books[bookIndex].bookID, // Preserve book ID
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            coverImage: books[bookIndex].coverImage // Ensure image isn't lost
        };

        localStorage.setItem("books", JSON.stringify(books)); // Save changes
        alert("Book updated successfully!");
        window.location.href = "mainAdmin.html"; // Redirect after updating
    } else {
        alert("Error updating book!");
    }
});

// Handle book delete functionality
document.querySelector(".buttonlink.delete").addEventListener("click", function(event) {
    event.preventDefault();

    if (bookIndex === -1) {
        alert("Book not found!");
        return;
    }

    // Remove book from localStorage
    const updatedBooks = books.filter(book => book.bookID !== bookID);
    localStorage.setItem("books", JSON.stringify(updatedBooks)); // Save changes

    alert("Book deleted successfully!");
    window.location.href = "mainAdmin.html"; // Redirect after deletion
});
