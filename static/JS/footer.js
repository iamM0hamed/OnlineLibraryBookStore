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
