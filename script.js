document.addEventListener('DOMContentLoaded', () => {
    const slideTrack = document.querySelector('.carousel-slide');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    // 更新輪播位置與指示點狀態
    function updateCarousel() {
        // 移動軌道
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // 更新圓點 active 狀態
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // 切換到下一張
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    // 切換到上一張
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // 重設自動播放定時器
    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 4000); // 4000 毫秒 (4 秒) 自動換頁
    }

    // 綁定按鈕點擊事件
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    // 綁定指示點點擊事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        });
    });

    // 啟動自動播放
    resetAutoPlay();
});
