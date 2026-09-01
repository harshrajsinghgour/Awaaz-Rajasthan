// 1. ऑटोमेटिक हीरो स्लाइडर (Hero Slider)
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// हर 4 सेकंड में स्लाइडर बदलेगा
setInterval(nextSlide, 4000);
showSlide(currentSlide);

// 2. ऑडियो (खबर सुनें) फ़ीचर डेमो
document.querySelectorAll('.btn-audio').forEach(button => {
    button.addEventListener('click', function() {
        alert('ऑडियो प्लेयर: खबर पढ़ी जा रही है...');
    });
});

// 3. डार्क मोड टॉगल
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    alert('थिम मोड बदल गया है!');
});
