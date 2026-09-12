// 24 張圖片對應的低飽和度背景色列表
const backgroundColors = [
    "#EFECE6",
    "#E6EBE0",
    "#EDF2F4",
    "#F4EAD4",
    "#F0E6EF",
    "#E2ECE9",
    "#EAE4E9",
    "#FFF1E6",
    "#FDE2E4",
    "#DBE7E4",
    "#E4C1F9",
    "#D6E2E9",
    "#E9ECEF",
    "#F3E9DC",
    "#D8E2DC",
    "#FFE5D9",
    "#ECE4DB",
    "#E0E1DD",
    "#F1FAEE",
    "#E8D8CE",
    "#DFE7FD",
    "#F0F3F4",
    "#EAD7D7",
    "#DCE1E3"
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
   更新背景色
========================= */

function updateBackgroundColor() {
    document.body.style.backgroundColor = backgroundColors[getRealIndex()];
}

/* =========================
   移動圖片
========================= */

function moveSlide(direction) {
    /* 動畫還沒結束時不接受下一次操作，防止 index 跑掉 */
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
    /* 只監聽 transform 動畫 */
    if (event.propertyName !== 'transform') {
        return;
    }

    /* 24 → 假 1：動畫結束後瞬間跳到真正的 1 */
    if (currentIndex === totalSlides + 1) {
        slideTrack.classList.add('no-transition');
        currentIndex = 1;
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        void slideTrack.offsetWidth;
        slideTrack.classList.remove('no-transition');
    }
    /* 1 → 假 24：動畫結束後瞬間跳到真正的 24 */
    else if (currentIndex === 0) {
        slideTrack.classList.add('no-transition');
        currentIndex = totalSlides;
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        void slideTrack.offsetWidth;
        slideTrack.classList.remove('no-transition');
    }

    updateBackgroundColor();

    /* 動畫結束，重新允許操作 */
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

    /* 至少滑動 50px 才判定為有效手勢 */
    const swipeThreshold = 50;

    /* 水平距離必須大於 50px 且大於垂直距離，避免上下滑頁面時誤切圖片 */
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        /* 往左滑 → 下一張 */
        if (deltaX < 0) {
            moveSlide(1);
        }
        /* 往右滑 → 上一張 */
        else {
            moveSlide(-1);
        }
    }
}, { passive: true });

/* 初始化背景色 */
updateBackgroundColor();
