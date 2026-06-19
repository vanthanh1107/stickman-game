// ==========================================
// MAIN.JS - GIAO DIỆN MENU & LIÊN KẾT GOOGLE SHEETS
// ==========================================

// ĐIỀN LINK GOOGLE SHEET CSV CỦA BẠN VÀO ĐÂY:
window.GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXYZ_ABC_123/pub?gid=0&single=true&output=csv";

window.initGame = async function() {
    try {
        let response = await fetch(window.GOOGLE_SHEET_URL);
        if(!response.ok) throw new Error("HTTP error");
        let csvText = await response.text();
        let rows = csvText.split('\n');
        
        // Quét file Sheet, update tên và Avatar vào classStats
        for (let i = 1; i < rows.length; i++) {
            let cols = rows[i].split(',');
            if (cols.length >= 2) {
                let id = cols[0].trim().toLowerCase();
                if(id !== "" && window.classStats[id]) {
                    if (cols[1]) window.classStats[id].className = cols[1].trim();
                    for(let c=2; c<cols.length; c++) {
                        if (cols[c] && cols[c].includes("http")) {
                            window.classStats[id].avatarUrl = cols[c].trim().replace(/\r/g, ''); break;
                        }
                    }
                }
            }
        }
    } catch(e) { console.log("Lỗi tải Google Sheets. Chạy dữ liệu mặc định."); }
    
    // Gắn Đồ họa vào Nhân vật & Vẽ Menu
    if(typeof window.assignDrawMethods === 'function') window.assignDrawMethods(window.classStats);
    window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); 
    if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;

    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        card.innerHTML = `<div class="char-avatar"><img src="${item.avatarUrl}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => { 
            window.selectedRedClass = id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ <strong>${item.hp}</strong></span><span>💨 <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ <strong>x${item.dmgMod}</strong></span>`; 
        };
        carousel.appendChild(card); if (!firstCardId) { firstCardId = id; }
    }
    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

window.startGame = function() { 
    if(!window.selectedRedClass) return; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    if(typeof window.matchStart === 'function') window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.backToMenu = function() { 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "block"; 
    window.gameOver = true; window.isLoopRunning = false; 
    if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.matchStart = function() {
    try {
        let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { window.selectedRedClass = allKeys[0]; }
        let s1 = window.classStats[window.selectedRedClass];
        
        let nr = document.getElementById("name-display-red"); if(nr) nr.innerText = `👤`; 
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1; if(isNaN(selectedMode)) selectedMode = 1;
        let isBossMode = (selectedMode === 99);
        window.rewardMultiplier = isBossMode ? 15 : selectedMode;
        let actualEnemiesCount = isBossMode ? 1 : selectedMode;
        let btnExit = document.querySelector(".control-btns .game-btn");
        if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }

        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1,
            onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, 
            buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, 
            shieldBreak: 100, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0,
            taunt: ["🔥", "💢", "💪", "👊"][Math.floor(Math.random()*4)]
        };

        window.enemies = []; window.totalEnemyMaxHp = 0;
        for(let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; if(isBossMode) hpMultiplier = 10.0;
            let eHp = Math.floor(s2.hp * hpMultiplier); window.totalEnemyMaxHp += eHp;

            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
                hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), 
                scale: isBossMode ? 2.2 : 1, isDragon: isBossMode,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, 
                stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, 
                buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, 
                shieldBreak: 100, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false,
                taunt: isBossMode ? "🐉 ROAR!!" : ["🤖", "🔪", "🎯", "🩸"][Math.floor(Math.random()*4)]
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isBossMode ? `🐉 DRAGON BOSS` : ((actualEnemiesCount > 1) ? `🤖 x${window.enemies.length}` : `🤖`);
        
        window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
        window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1;
        window.camX = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160;
        window.weatherParticles = []; for(let i=0; i<100; i++) { window.weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (window.currentWeather === 'rain') ? 15 + Math.random() * 10 : 2 + Math.random() * 3 }); }
        
        if(typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (!window.attackBound) {
            window.attackBound = true;
            let triggerAttack = function(e) { 
                let gScreen = document.getElementById("game-screen");
                if (!gScreen || gScreen.style.display === "none") return;
                if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return;
                e.preventDefault(); 
                if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) {
                    if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { window.p1.comboStep++; } else { window.p1.comboStep = 0; }
                    window.p1.comboTimeout = 60; 
                    if(typeof window.attack === 'function') window.attack(window.p1, window.enemies); 
                }
            };
            window.addEventListener('touchstart', triggerAttack, {passive: false});
            window.addEventListener('mousedown', triggerAttack);
        }
    } catch(e) { console.error("Lỗi:", e); }
}

window.checkGameOver = function() {
    if (window.matchResolved) return; let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; 
        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);
        let btnExit = document.querySelector(".control-btns .game-btn"); if (btnExit) { btnExit.innerText = "⏭️"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
    }
}

window.updateHPUIs = function() {
    if (!window.p1) return; let p1Pct = (window.p1.hp / window.p1.maxHp * 100) + "%"; let currentEnemyHp = 0; window.enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = window.totalEnemyMaxHp > 0 ? (currentEnemyHp / window.totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = window.p1.stamina + "%"; if(h6) h6.style.width = window.p1.shieldBreak + "%";
    if(typeof window.getClosestEnemy === 'function') {
        let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; }
    }
    window.checkGameOver(); 
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { 
        window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); 
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
    } 
}
