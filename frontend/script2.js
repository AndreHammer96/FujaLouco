const images = document.querySelectorAll('.background-image');
let currentIndex = 0;
const intervalTime = 5000; // Intervalo em milissegundos (5 segundos)

function changeBackground() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
}

setInterval(changeBackground, intervalTime);