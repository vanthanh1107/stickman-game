// ĐIỀN LINK GOOGLE SHEET (DẠNG CSV) CỦA BẠN VÀO ĐÂY:
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
        window.classStats = { "mma": { className: "Võ Sư MMA (Lỗi Mạng)", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=mma&backgroundColor=ffdfbf" } };
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

window.matchStart = function() {
    try {
        let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { window.selectedRedClass = allKeys[0]; }
        let s1 = window.classStats[window.selectedRedClass];
        
        let nr = document.getElementById("name-display-red"); if(nr) nr.innerText = `👤`; 
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1;
        if(isNaN(selectedMode)) selectedMode = 1;
        let isBossMode = (selectedMode === 99);
        
        window.rewardMultiplier = isBossMode ? 15 : selectedMode;
        let actualEnemiesCount = isBossMode ? 1 : selectedMode;
        let btnExit = document.querySelector(".control-btns .game-btn");
        if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }

        p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color || "#ff4757", hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1,
            onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: s1.regen || 0.4, shield: 0, 
            buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, 
            shieldBreak: 100, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0,
            taunt: ["🔥", "💢", "💪", "👊"][Math.floor(Math.random()*4)]
        };

        enemies = []; totalEnemyMaxHp = 0;
        for(let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; if(isBossMode) hpMultiplier = 10.0;
            let eHp = Math.floor(s2.hp * hpMultiplier); totalEnemyMaxHp += eHp;

            enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: GROUND_Y, vx: 0, vy: 0, 
                speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
                hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), 
                scale: isBossMode ? 2.2 : 1, isDragon: isBossMode,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, 
                stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: s2.regen || 0.3, shield: 0, 
                buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, 
                shieldBreak: 100, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false,
                taunt: isBossMode ? "🐉 ROAR!!" : ["🤖", "🔪", "🎯", "🩸"][Math.floor(Math.random()*4)]
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isBossMode ? `🐉 DRAGON BOSS` : ((actualEnemiesCount > 1) ? `🤖 x${enemies.length}` : `🤖`);
        
        floatingTexts = []; particles = []; projectiles = []; traps = []; slashes = []; shockwaves = []; impactSparks = [];
        shakeTime = 0; hitStopFrames = 0; cinematicTimer = 0; cinematicCaster = null; cinematicCallback = null; currentZoom = 1; targetZoom = 1;
        camX = 0; screenFlash = 0; slowMoTimer = 0; uiShakeP1 = 0; uiShakeP2 = 0; matchResolved = false; gameOver = false; introTimer = 160;
        
        weatherParticles = []; for(let i=0; i<100; i++) { weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (currentWeather === 'rain') ? 15 + Math.random() * 10 : 2 + Math.random() * 3 }); }
        if(typeof updateHPUIs === 'function') updateHPUIs();

        if (!window.attackBound) {
            window.attackBound = true;
            let triggerAttack = function(e) { 
                let gScreen = document.getElementById("game-screen");
                if (!gScreen || gScreen.style.display === "none") return;
                if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return;
                
                e.preventDefault(); 
                if (!gameOver && p1 && introTimer <= 0 && p1.attackTimer === 0 && p1.hitStun === 0 && p1.stunTimer === 0) {
                    if (p1.comboTimeout > 0 && p1.comboStep < 14) { p1.comboStep++; } else { p1.comboStep = 0; }
                    p1.comboTimeout = 60; 
                    if(typeof attack === 'function') attack(p1, enemies); 
                }
            };
            window.addEventListener('touchstart', triggerAttack, {passive: false});
            window.addEventListener('mousedown', triggerAttack);
        }
    } catch(e) { console.error("Match Start Error:", e); }
}

window.checkGameOver = function() {
    if (matchResolved) return; let allDead = enemies.length === 0 || enemies.every(e => e.hp <= 0);
    if (p1 && (p1.hp <= 0 || allDead)) {
        matchResolved = true; gameOver = true; 
        if (typeof triggerVibration === 'function') triggerVibration([100, 50, 100]);
        let btnExit = document.querySelector(".control-btns .game-btn"); if (btnExit) { btnExit.innerText = "⏭️"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
    }
}

window.updateHPUIs = function() {
    if (!p1) return; let p1Pct = (p1.hp / p1.maxHp * 100) + "%"; let currentEnemyHp = 0; enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = totalEnemyMaxHp > 0 ? (currentEnemyHp / totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = p1.stamina + "%"; if(h6) h6.style.width = p1.shieldBreak + "%";
    let closestEnemy = getClosestEnemy(p1, enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; }
    checkGameOver(); 
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

document.addEventListener("DOMContentLoaded", () => {
    loadStatsFromGoogleSheets();
});
