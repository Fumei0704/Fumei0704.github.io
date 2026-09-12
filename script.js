document.addEventListener('DOMContentLoaded', () => {
    const bgBtn = document.getElementById('change-bg-btn');
    
    // 定義幾組好看的背景顏色 (Hex 色碼)
    const colors = [
        '#f0f4f8', // 淡藍灰
        '#e8f5e9', // 淡綠色
        '#fff3e0', // 暖橙色
        '#f3e5f5', // 淡粉紫
        '#1e1e2e'  # 深色模式
    ];
    
    let colorIndex = 0;

    bgBtn.addEventListener('click', () => {
        // 輪流切換陣列中的背景顏色
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
});
