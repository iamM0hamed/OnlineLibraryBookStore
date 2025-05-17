// Variables

const favBooks = document.getElementsByClassName("favorite-books");
const borBooks = document.getElementsByClassName("recent-borrowed");

for (i=0;i<favBooks.length; i++){

    favBooks[i].addEventListener("click", function (){
        this.classList.toggle('active')
    })

}

for (i=0;i<borBooks.length; i++){

    borBooks[i].addEventListener("click", function (){
        this.classList.toggle('active')
    })

}

document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content sections
    const tabButtons = document.querySelectorAll('.tab-button');
    const bookLists = document.querySelectorAll('.book-list');

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and lists
            tabButtons.forEach(btn => btn.classList.remove('active'));
            bookLists.forEach(list => list.classList.remove('active'));

            // Add active class to clicked button and corresponding list
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-list`).classList.add('active');
        });
    });

    // Add hover effects for book items
    const bookItems = document.querySelectorAll('.book-info');
    bookItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });

    // Handle view book clicks
    const viewButtons = document.querySelectorAll('.view-book');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a subtle click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});