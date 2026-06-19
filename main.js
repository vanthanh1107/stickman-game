// Thay LINK BẢNG GOOGLE SHEET CỦA BẠN (Dạng CSV) VÀO ĐÂY:
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXYZ_ABC_123/pub?gid=0&single=true&output=csv";

async function loadStatsFromGoogleSheets() {
    try {
        let response = await fetch(GOOGLE_SHEET_URL);
        if(!response.ok) throw new Error("HTTP error");
        let csvText = await response.text();
        
        let rows = csvText.split('\n');
        window.classStats = {}; 
        
        for (let i = 1; i < rows.length; i++) {
            let cols = rows[i].split(',');
            if (cols.length >= 6) {
                let id = cols[0].trim();
                if(id === "") continue;
                window.classStats[id] = {
                    className: cols[1].trim(),
                    hp: parseInt(cols[2].trim()),
                    speed: parseInt(cols[3].trim()),
                    dmgMod: parseFloat(cols[4].trim()),
                    color: cols[5].trim().replace(/\r/g, ''),
                    avatarUrl: `https://api.dicebear.com/7.x/adventurer/png?seed=${id}&backgroundColor=ffdfbf`
                };
            }
        }
        window.renderCharacterGrid(); 
    } catch(e) {
        console.log("Lỗi tải Google Sheets. Dùng nhân vật dự phòng.");
        if (typeof window.classStats === 'undefined' || !window.classStats || Object.keys(window.classStats).length === 0) {
            window.classStats = {
                "mma": { className: "Võ Sư MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=mma&backgroundColor=ffdfbf" },
                "tank": { className: "Hộ Vệ Thép", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=tank&backgroundColor=ffdfbf" }
            };
        }
        window.renderCharacterGrid();
    }
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); 
    if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;

    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        let avatarSrc = item.avatarUrl; 
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => { 
            window.selectedRedClass = id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ <strong>${item.hp}</strong></span><span>💨 <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ <strong>x${item.dmgMod}</strong></span>`; 
            if(typeof window.currentPlayer !== 'undefined') window.currentPlayer.classId = id; 
        };
        carousel.appendChild(card); if (typeof window.currentPlayer !== 'undefined' && window.currentPlayer.classId && id === window.currentPlayer.classId) { card.click(); firstCardId = id; } if(!firstCardId) { firstCardId = id; }
    }
    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

window.startGame = function() { 
    if(!window.selectedRedClass) return; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    if(typeof matchStart === 'function') matchStart(); 
    if (!isLoopRunning) { isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.backToMenu = function() { 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "block"; 
    gameOver = true; isLoopRunning = false; 
    if(typeof updatePlayerUI === 'function') updatePlayerUI(); 
}

window.gameLoop = function(timestamp) { 
    if (!isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    
    if (!timestamp) timestamp = 0; 
    let deltaTime = timestamp - lastFrameTime; 
    if (deltaTime >= FRAME_MIN_TIME) { 
        lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME); 
        try { if(typeof update === 'function') update(); } catch(e) { console.error(e); } 
        try { if(typeof draw === 'function') draw(); } catch(e) { console.error(e); } 
    } 
}

// Bắt đầu tải dữ liệu khi trang web sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    loadStatsFromGoogleSheets();
});
