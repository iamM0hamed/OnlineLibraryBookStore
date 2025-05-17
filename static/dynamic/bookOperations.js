// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Show notification
function showNotification(message, type = 'success') {
    const notifications = document.querySelector('.messages') || createNotificationsContainer();
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        if (notifications.children.length === 0) {
            notifications.remove();
        }
    }, 3000);
}

function createNotificationsContainer() {
    const container = document.createElement('div');
    container.className = 'messages';
    document.body.appendChild(container);
    return container;
}

// Like Book
async function likeBook(bookId) {
    try {
        const response = await fetch(`/books/like/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Update likes count in the UI
            const likesElement = document.querySelector(`#book-${bookId} .likes-count`);
            if (likesElement) {
                likesElement.textContent = data.likes;
            }
            showNotification('Book liked successfully!');
        } else {
            showNotification('Error liking book', 'error');
        }
    } catch (error) {
        showNotification('Error liking book', 'error');
    }
}

// Delete Book
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`/books/delete/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Remove book card from UI
            const bookCard = document.querySelector(`#book-${bookId}`);
            if (bookCard) {
                bookCard.remove();
                showNotification('Book deleted successfully!');
                // Update statistics if on admin dashboard
                updateAdminStats();
            }
        } else {
            showNotification('Error deleting book', 'error');
        }
    } catch (error) {
        showNotification('Error deleting book', 'error');
    }
}

// Add Book
async function addBook(formElement) {
    try {
        const formData = new FormData(formElement);
        const response = await fetch('/books/add/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Add new book card to the grid
            const bookGrid = document.querySelector('.book-grid');
            if (bookGrid) {
                bookGrid.insertAdjacentHTML('afterbegin', data.book_html);
                showNotification('Book added successfully!');
                formElement.reset();
                // Update statistics if on admin dashboard
                updateAdminStats();
            }
        } else {
            showNotification('Error adding book', 'error');
        }
    } catch (error) {
        showNotification('Error adding book', 'error');
    }
}

// Edit Book
async function editBook(formElement, bookId) {
    try {
        const formData = new FormData(formElement);
        const response = await fetch(`/books/edit/${bookId}/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Update book card in the UI
            const bookCard = document.querySelector(`#book-${bookId}`);
            if (bookCard) {
                bookCard.outerHTML = data.book_html;
                showNotification('Book updated successfully!');
            }
        } else {
            showNotification('Error updating book', 'error');
        }
    } catch (error) {
        showNotification('Error updating book', 'error');
    }
}

// Update Admin Dashboard Statistics
async function updateAdminStats() {
    try {
        const response = await fetch('/books/admin/stats/');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('total-books').textContent = data.total_books;
            document.getElementById('borrowed-books').textContent = data.borrowed_books;
            document.getElementById('available-books').textContent = data.available_books;
            document.getElementById('total-users').textContent = data.total_users;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const bookId = this.dataset.bookId;
            likeBook(bookId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const bookId = this.dataset.bookId;
            deleteBook(bookId);
        });
    });

    // Add book form
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addBook(this);
        });
    }

    // Edit book forms
    document.querySelectorAll('.edit-book-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const bookId = this.dataset.bookId;
            editBook(this, bookId);
        });
    });
}); 