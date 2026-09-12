// 24 張圖片對應的背景色列表（支援單色與漸層色）
const backgroundColors = [
    "linear-gradient(135deg, #EFECE6 0%, #E6EBE0 100%)", // 圖片 1：暖奶茶漸柔綠
    "linear-gradient(135deg, #E6EBE0 0%, #EDF2F4 100%)", // 圖片 2：淡綠漸莫蘭迪藍
    "linear-gradient(135deg, #EDF2F4 0%, #F4EAD4 100%)", // 圖片 3：霧藍漸燕麥色
    "linear-gradient(135deg, #F4EAD4 0%, #F0E6EF 100%)", // 圖片 4：燕麥漸柔粉紫
    "linear-gradient(135deg, #F0E6EF 0%, #E2ECE9 100%)", // 圖片 5：柔粉紫漸薄荷灰
    "linear-gradient(135deg, #E2ECE9 0%, #EAE4E9 100%)", // 圖片 6：薄荷灰漸玫瑰灰
    "linear-gradient(135deg, #EAE4E9 0%, #FFF1E6 100%)", // 圖片 7：玫瑰灰漸暖杏色
    "linear-gradient(135deg, #FFF1E6 0%, #FDE2E4 100%)", // 圖片 8：暖杏漸柔粉色
    "linear-gradient(135deg, #FDE2E4 0%, #DBE7E4 100%)", // 圖片 9：柔粉漸莫蘭迪綠
    "linear-gradient(135deg, #DBE7E4 0%, #E4C1F9 100%)", // 圖片 10：莫蘭迪綠漸淡紫
    "linear-gradient(135deg, #E4C1F9 0%, #D6E2E9 100%)", // 圖片 11：淡紫漸莫蘭迪藍
    "linear-gradient(135deg, #D6E2E9 0%, #E9ECEF 100%)", // 圖片 12：莫蘭迪藍漸極簡灰
    "linear-gradient(135deg, #E9ECEF 0%, #F3E9DC 100%)", // 圖片 13：極簡灰漸暖砂色
    "linear-gradient(135deg, #F3E9DC 0%, #D8E2DC 100%)", // 圖片 14：暖砂漸灰綠色
    "linear-gradient(135deg, #D8E2DC 0%, #FFE5D9 100%)", // 圖片 15：灰綠漸蜜桃粉
    "linear-gradient(135deg, #FFE5D9 0%, #ECE4DB 100%)", // 圖片 16：蜜桃粉漸木質灰
    "linear-gradient(135deg, #ECE4DB 0%, #E0E1DD 100%)", // 圖片 17：木質灰漸石灰藍
    "linear-gradient(135deg, #E0E1DD 0%, #F1FAEE 100%)", // 圖片 18：石灰藍漸蛋白綠
    "linear-gradient(135deg, #F1FAEE 0%, #E8D8CE 100%)", // 圖片 19：蛋白綠漸淺駝色
    "linear-gradient(135deg, #E8D8CE 0%, #DFE7FD 100%)", // 圖片 20：淺駝漸天藍灰
    "linear-gradient(135deg, #DFE7FD 0%, #F0F3F4 100%)", // 圖片 21：天藍灰漸雲霧白
    "linear-gradient(135deg, #F0F3F4 0%, #EAD7D7 100%)", // 圖片 22：雲霧白漸藕粉灰
    "linear-gradient(135deg, #EAD7D7 0%, #DCE1E3 100%)", // 圖片 23：藕粉灰漸冷灰
    "linear-gradient(135deg, #DCE1E3 0%, #EFECE6 100%)"  // 圖片 24：冷灰漸暖奶茶
];

function switchPage(pageName) {
    const pages = document.querySelectorAll('.page-content');
    const buttons = document.querySelectorAll('.nav-btn');

    pages.forEach(page => page.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    if (pageName === 'gallery') {
        document.getElementById('gallery-page').classList.add('active');
        buttons[0].classList.add('active');
    } else if (pageName === 'text') {
        document.getElementById('text-page').classList.add('active');
        buttons[1].classList.add('active');
    }
}

/* =========================
   輪播初始化
========================= */

const slideTrack = document.getElementById('carouselSlide');
const originalSlides = Array.from(document.querySelectorAll('.slide-item'));
const totalSlides = originalSlides.length;

const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

slideTrack.appendChild(firstClone);
slideTrack.insertBefore(lastClone, slideTrack.firstChild);

let currentIndex = 1;
let isAnimating = false;

/* 初始化到真正的第一張 */
slideTrack.classList.add('no-transition');
slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

void slideTrack.offsetWidth; // 強制重繪

slideTrack.classList.remove('no-transition');

/* =========================
   取得真正圖片編號
========================= */

function getRealIndex() {
    /* 假 24 */
    if (currentIndex === 0) {
        return totalSlides - 1;
    }

    /* 假 1 */
    if (currentIndex === totalSlides + 1) {
        return 0;
    }

    return currentIndex - 1;
}

/* =========================
   更新背景色（改為支援漸層與單色）
========================= */

function updateBackgroundColor() {
    // 改用 .background 以全面支援漸層語法 (linear-gradient)
    document.body.style.background = backgroundColors[getRealIndex()];
}

/* =========================
   移動圖片
========================= */

function moveSlide(direction) {
    if (isAnimating) {
        return;
    }

    isAnimating = true;
    currentIndex += direction;

    slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    updateBackgroundColor();
}

/* =========================
   無縫循環
========================= */

slideTrack.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'transform') {
        return;
    }

    if (currentIndex === totalSlides + 1) {
        slideTrack.classList.add('no-transition');
        currentIndex = 1;
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        void slideTrack.offsetWidth;
        slideTrack.classList.remove('no-transition');
    } else if (currentIndex === 0) {
        slideTrack.classList.add('no-transition');
        currentIndex = totalSlides;
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        void slideTrack.offsetWidth;
        slideTrack.classList.remove('no-transition');
    }

    updateBackgroundColor();
    isAnimating = false;
});

/* =========================
   手機左右滑動
========================= */

const carouselViewport = document.querySelector('.carousel-viewport');

let touchStartX = 0;
let touchStartY = 0;

carouselViewport.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

carouselViewport.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
            moveSlide(1);
        } else {
            moveSlide(-1);
        }
    }
}, { passive: true });

/* 初始化背景色 */
updateBackgroundColor();
