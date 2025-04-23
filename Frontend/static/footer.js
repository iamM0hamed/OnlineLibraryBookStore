let openBtn = document.getElementById('open-about-modal');
let modal = document.getElementById('about-modal');
let closeBtn = modal.querySelector('.close-btn');

openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
})




closeBtn.addEventListener('click', () => {
    
    modal.style.display = 'none';
});


modal.addEventListener('click', (e) => {
    if (e.target === modal){
        modal.style.display = 'none';
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});