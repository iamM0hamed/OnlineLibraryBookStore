

document.addEventListener("DOMContentLoaded", function () {
    const footerHTML = `
        <!-- Modal for About Popup -->
            <div class="modal" id="about-modal">
                <div class="modal-content">
                <h1>About</h1>
                <p>
                    Welcome to our library! We are dedicated to providing a vast
                    collection of books for reading and borrowing. Our mission is to
                    promote knowledge, education, and a love for literature in our
                    community.
                </p>
                <p>
                    Our library offers a diverse selection of books across different
                    genres, ensuring that every reader finds something of interest.
                    Whether you enjoy fiction, non-fiction, academic materials, or
                    children's books, we have something for everyone.
                </p>
                <p>
                    We also offer a book lending service, allowing members to borrow books
                    and enjoy them at their own convenience. Our friendly staff is always
                    available to help you find the perfect book or answer any questions
                    you may have.
                </p>
                <p>
                    Thank you for visiting our library. We look forward to seeing you
                    soon!
                </p>
                <div class="close-btn">&times;</div>
                </div>
            </div>
            <footer class="footer">
                <div class="footer-container">
                <div class="footer-icon">
                    <a href="https://github.com/nouran8890/OnlineLibrary.git"
                    ><i class="fab fa-github"></i
                    ></a>
                </div>
                <div class="footer-nav">
                    <ul>
                    <li>
                        <a class="about-modal" href="#" id="open-about-modal">About</a>
                    </li>
                    <li><a href="./contactUs.html">Contact Us</a></li>
                    <!-- Later Add Another page -->
                    <li><a href="./ourTeam.html">our Team</a></li>
                    </ul>
                </div>
                </div>
                <div id="footer-bottom">
                <p>
                    Copyright &copy; 2025 Designed by
                    <span class="designer">FCAI Team</span>
                </p>
                </div>
            </footer>
    `;
    const footerPlaceholder = document.getElementById("footer-placeholder");
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHTML;
        }

        const aboutModal = document.getElementById("about-modal");
        const openAboutModal = document.getElementById("open-about-modal");
        const closeBtn = document.querySelector(".close-btn");
    
        if (openAboutModal && aboutModal && closeBtn) {
            openAboutModal.addEventListener("click", function (e) {
                e.preventDefault();
                aboutModal.style.display = "block";
            });
    
            closeBtn.addEventListener("click", function () {
                aboutModal.style.display = "none";
            });
    
            window.addEventListener("click", function (e) {
                if (e.target === aboutModal) {
                    aboutModal.style.display = "none";
                }
            });
        }
    });