// 24 張圖片對應的背景色列表（由中心向外放射狀漸層，飽和度較高）
const backgroundColors = [
    "radial-gradient(circle at center, #F7DFB0 0%, #D4A373 100%)", // 圖片 1：溫暖金杏
    "radial-gradient(circle at center, #CDEAC0 0%, #7CB518 100%)", // 圖片 2：鮮活草綠
    "radial-gradient(circle at center, #C8E7F5 0%, #5B92E5 100%)", // 圖片 3：湛藍湖水
    "radial-gradient(circle at center, #FEE3B8 0%, #F1A208 100%)", // 圖片 4：亮麗琥珀
    "radial-gradient(circle at center, #F3C4FB 0%, #B5179E 100%)", // 圖片 5：霓光淡紫
    "radial-gradient(circle at center, #B8F2E6 0%, #38B000 100%)", // 圖片 6：清爽翡翠
    "radial-gradient(circle at center, #FFCBF2 0%, #F72585 100%)", // 圖片 7：甜美玫紅
    "radial-gradient(circle at center, #FFE5EC 0%, #FB6F92 100%)", // 圖片 8：繽紛珊瑚粉
    "radial-gradient(circle at center, #E0AFA0 0%, #8A5A44 100%)", // 圖片 9：濃郁赤陶
    "radial-gradient(circle at center, #D8F3DC 0%, #52B788 100%)", // 圖片 10：活力深綠
    "radial-gradient(circle at center, #E1BEE7 0%, #8E24AA 100%)", // 圖片 11：夢幻紫色
    "radial-gradient(circle at center, #BEE3F8 0%, #3182CE 100%)", // 圖片 12：海洋湛藍
    "radial-gradient(circle at center, #E2E8F0 0%, #64748B 100%)", // 圖片 13：質感岩藍
    "radial-gradient(circle at center, #FDE2E4 0%, #E07A5F 100%)", // 圖片 14：暖陽橙紅
    "radial-gradient(circle at center, #CCD5AE 0%, #6B705C 100%)", // 圖片 15：橄欖綠
    "radial-gradient(circle at center, #FFD6A5 0%, #FF9F1C 100%)", // 圖片 16：鮮明亮橙
    "radial-gradient(circle at center, #E9D8A6 0%, #EE9B00 100%)", // 圖片 17：熾黃藤黃
    "radial-gradient(circle at center, #94D2BD 0%, #0A9396 100%)", // 圖片 18：熱帶孔雀綠
    "radial-gradient(circle at center, #E8AEB7 0%, #B80046 100%)", // 圖片 19：緋紅玫瑰
    "radial-gradient(circle at center, #DDA15E 0%, #BC6C25 100%)", // 圖片 20：焦糖焦茶
    "radial-gradient(circle at center, #C77DFF 0%, #7B2CBF 100%)", // 圖片 21：艷麗深紫
    "radial-gradient(circle at center, #E0FAFF 0%, #00B4D8 100%)", // 圖片 22：明亮天藍
    "radial-gradient(circle at center, #F4ACB7 0%, #9D8189 100%)", // 圖片 23：煙燻粉紫
    "radial-gradient(circle at center, #E0E1DD 0%, #415A77 100%)"  // 圖片 24：深蔚藍灰
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
   更新背景色（Radial Gradient 中心向外擴散）
========================= */

function updateBackgroundColor() {
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
