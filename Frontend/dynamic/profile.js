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