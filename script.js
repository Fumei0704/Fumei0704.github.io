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

const siteMenu = document.getElementById('siteMenu');
const menuToggle = document.getElementById('menuToggle');
let menuCloseTimer;

function openMenu() {
    clearTimeout(menuCloseTimer);
    if (!siteMenu.open) siteMenu.showModal();
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    void siteMenu.offsetWidth;
    siteMenu.classList.add('is-open');
}

function closeMenu() {
    if (!siteMenu.open) return;
    clearTimeout(menuCloseTimer);
    siteMenu.classList.remove('is-open');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280;
    menuCloseTimer = setTimeout(() => siteMenu.close(), delay);
}

siteMenu.addEventListener('click', (event) => {
    if (event.target === siteMenu) closeMenu();
});
siteMenu.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
});
siteMenu.addEventListener('close', () => {
    clearTimeout(menuCloseTimer);
    siteMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus({ preventScroll: true });
});

function switchPage(pageName) {
    const targetPage = document.getElementById(`${pageName}-page`);
    const targetButton = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.dataset.page === pageName);
    if (!targetPage || !targetButton) return;
    // 隱藏輪播前完成定位，避免動畫中斷後無法繼續換圖。
    if (isAnimating) {
        currentIndex = getRealIndex() + 1;
        slideTrack.classList.add('no-transition');
        slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        void slideTrack.offsetWidth;
        slideTrack.classList.remove('no-transition');
        isAnimating = false;
    }

    const pages = document.querySelectorAll('.page-content');
    const buttons = document.querySelectorAll('.nav-btn');

    pages.forEach(page => page.classList.remove('active'));
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
    });
    targetPage.classList.add('active');
    document.body.classList.toggle('text-page-active', pageName === 'text');
    targetButton.classList.add('active');
    targetButton.setAttribute('aria-current', 'page');
    document.getElementById('currentPageLabel').textContent = {
        gallery: '作品展示', text: '繪師資訊', planning: '籌畫細節'
    }[pageName];
    window.scrollTo({ top: 0, behavior: 'instant' });
    closeMenu();
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
