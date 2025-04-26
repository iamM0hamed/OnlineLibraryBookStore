document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get input values
    const bookID = document.getElementById('bookID').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const coverImage = document.getElementById('coverImage').files[0]; // File input

    if (coverImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const bookCoverURL = event.target.result; // Base64 image string

            // Create book object
            const newBook = {
                bookID,
                title,
                author,
                category,
                description,
                coverImage: bookCoverURL // Save Base64 string for the image
            };

            // Save book data to localStorage
            const books = JSON.parse(localStorage.getItem('books')) || []; // Retrieve existing books
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books)); // Save updated books array

            alert('Book added successfully!');
            document.querySelector('form').reset(); // Reset form
        };
        reader.readAsDataURL(coverImage); // Read the file as a Base64 URL
    } else {
        alert('Please upload a cover image.');
    }
});