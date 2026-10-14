// ==========================================
// MAIN.JS - BẢN NÂNG CẤP GOD-TIER ANIME EDITION
// + ANIME CUT-IN BANNER KHI TUNG ULTIMATE (AVATAR + SLASH EFFECT)
// + HỆ THỐNG PERFECT DODGE (BẢN NĂNG VÔ CỰC) & PERFECT PARRY
// + RAGE AWAKENING (BỘC PHÁT NỘ KHÍ KHI MÁU DƯỚI 30%)
// + DRAMATIC K.O. FINISH (SLOW-MO + CAMERA ZOOM KẾT LIỄU)
// + FIX TRIỆT ĐỂ LỖI CHỮ WIN BỊ RƠI & LỖI TIMEOUT KHI THOÁT MENU
// ==========================================

window.BGM_BASE_POOL = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/A_Slipping_Glimpse_-_Nihilore.mp3",
    "https://upload.wikimedia.org/wikipedia/commons/c/c2/The_Descent_-_Kevin_MacLeod.mp3",
    "https://upload.wikimedia.org/wikipedia/commons/5/5b/Dark_Alley_-_Kevin_MacLeod.mp3"
];

window.BGM_CLIMAX_POOL = [
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Volatile_Reaction_-_Kevin_MacLeod.mp3",
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/Killers_-_Kevin_MacLeod.mp3",
    "https://upload.wikimedia.org/wikipedia/commons/a/a2/Movement_Proposition_-_Kevin_MacLeod.mp3"
];

window.lastBaseIdx = -1; 
window.lastClimaxIdx = -1;
window.ultimateTimeoutId = null;

document.addEventListener("click", function(e) {
    let target = e.target.closest("button, a, div"); 
    if (!target) return;
    let txt = (target.innerText || "").toUpperCase(); 
    let id = (target.id || "").toUpperCase(); 
    let cls = (target.className || "").toUpperCase();
    if (target.closest("#game-screen") && (txt.includes("THOÁT") || txt.includes("BACK") || id.includes("BACK") || id.includes("EXIT") || cls.includes("BACK") || cls.includes("EXIT"))) {
        if (!cls.includes("SKILL") && !id.includes("SKILL")) { 
            e.preventDefault(); 
            window.backToMenu(); 
        }
    }
});

window.loadedCharacters = {}; 

window.loadCharacterDynamic = function(charId) {
    return new Promise((resolve) => {
        if (window.classStats && window.classStats[charId]) {
            window.loadedCharacters[charId] = window.classStats[charId];
            return resolve(window.classStats[charId]);
        }
        console.warn("⚠️ Lỗi: Không tìm thấy dữ liệu của " + charId);
        resolve(null);
    });
};

window.initGame = async function() {
    if (!window.classStats) window.classStats = {};
    
    for (let id in window.classStats) {
        if (!window.classStats[id].hp) window.classStats[id].hp = 100;
        if (!window.classStats[id].speed) window.classStats[id].speed = 5;
        if (!window.classStats[id].dmgMod) window.classStats[id].dmgMod = 1;
    }
    
    window.renderCharacterGrid(); 
};

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); 
    if (!carousel) return; 
    carousel.innerHTML = ""; 
    let firstCardId = null;

    if (!window.classStats || Object.keys(window.classStats).length === 0) {
        carousel.innerHTML = "<h3 style='color:red;'>Chưa load được nhân vật nào! Hãy kiểm tra lại index.html</h3>";
        return;
    }
    
    for (let id in window.classStats) {
        let item = window.classStats[id]; 
        let card = document.createElement("div"); 
        card.className = "char-card"; 
        card.innerHTML = `
            <div class="char-avatar"><img src="${item.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/png?seed=error'}"></div>
            <div class="char-name">${item.className || 'Unknown'}</div>
        `;
        
        card.onclick = async () => { 
            window.selectedRedClass = id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); 
            card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if (desc) desc.innerHTML = `<span>⏳ Đang tải...</span>`;
            
            await window.loadCharacterDynamic(id);
            let activeItem = window.classStats[id];
            
            if (desc) desc.innerHTML = `
                <span>${activeItem.className}</span>
                <span>❤️ <strong>${activeItem.hp || 100}</strong></span>
                <span>⚔️ <strong>x${activeItem.dmgMod || 1}</strong></span>
                <span>⚡ <strong>${((activeItem.speed || 5)/3).toFixed(1)}</strong></span>
            `; 
            
            window.startPreviewLoop(activeItem);
        };
        carousel.appendChild(card); 
        if (!firstCardId) firstCardId = id;
    }
    if (!window.selectedRedClass && firstCardId) { 
        let firstCard = carousel.querySelector(`.char-card`); 
        if (firstCard) firstCard.click(); 
    }

    let enemySelect = document.getElementById("enemy-count-select");
    if (enemySelect && !enemySelect.querySelector("option[value='97']")) {
        enemySelect.innerHTML += `
            <option value="98">🥋 Đánh Boss Lý Tiểu Long</option>
            <option value="97">🗡️ Đánh Boss Samurai</option>
            <option value="96">🥷 Đánh Boss Ninja</option>
        `;
    }
};

window.initBGM = function() {
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmBase.src = ""; window.bgmBase = null; }
    if (window.bgmClimax) { window.bgmClimax.pause(); window.bgmClimax.src = ""; window.bgmClimax = null; }
    let bIdx, cIdx;
    do { bIdx = Math.floor(Math.random() * window.BGM_BASE_POOL.length); } while (bIdx === window.lastBaseIdx && window.BGM_BASE_POOL.length > 1);
    do { cIdx = Math.floor(Math.random() * window.BGM_CLIMAX_POOL.length); } while (cIdx === window.lastClimaxIdx && window.BGM_CLIMAX_POOL.length > 1);
    window.lastBaseIdx = bIdx; 
    window.lastClimaxIdx = cIdx;
    window.bgmBase = new Audio(window.BGM_BASE_POOL[bIdx]); 
    window.bgmClimax = new Audio(window.BGM_CLIMAX_POOL[cIdx]);
    window.bgmBase.crossOrigin = "anonymous"; 
    window.bgmClimax.crossOrigin = "anonymous";
    window.bgmBase.loop = true; 
    window.bgmClimax.loop = true; 
    window.bgmBase.volume = 0; 
    window.bgmClimax.volume = 0;
    window.bgmBase.play().catch(e => {}); 
    window.bgmClimax.play().catch(e => {});
};

window.cleanupCinematicDOM = function() {
    if (window.ultimateTimeoutId) {
        clearTimeout(window.ultimateTimeoutId);
        window.ultimateTimeoutId = null;
    }
    window.isCinematicActive = false;
    let gScreen = document.getElementById("game-screen");
    if (gScreen) {
        gScreen.style.transform = "scale(1)";
        gScreen.style.filter = "none";
        gScreen.style.transition = "none";
        ["cine-top", "cine-bot", "cine-cutin", "cine-flash"].forEach(id => {
            let el = document.getElementById(id);
            if (el) el.remove();
        });
    }
};

window.backToMenu = function() { 
    if (typeof window.stopRecording === 'function') window.stopRecording();
    window.cleanupCinematicDOM();
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmBase = null; }
    if (window.bgmClimax) { window.bgmClimax.pause(); window.bgmClimax = null; }
    
    let game = document.getElementById("game-screen"); if (game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if (sel) sel.style.display = "block"; 
    window.gameOver = true; 
    window.isLoopRunning = false; 
    if (typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
    
    if (window.selectedRedClass && window.classStats) {
        window.startPreviewLoop(window.classStats[window.selectedRedClass]);
    }
};

window.startGame = async function() { 
    if (!window.selectedRedClass) return;
    
    window.isPreviewRunning = false; 
    if (window.previewAnimId) cancelAnimationFrame(window.previewAnimId);
    
    let sel = document.getElementById("selection-screen"); if (sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if (game) game.style.display = "block"; 
    window.initBGM(); 
    if (typeof window.matchStart === 'function') await window.matchStart(); 
    if (!window.isLoopRunning) { 
        window.isLoopRunning = true; 
        requestAnimationFrame(window.gameLoop); 
    } 
};

window.matchStart = async function() {
    try {
        let allKeys = Object.keys(window.classStats || {}); 
        if (allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { 
            window.selectedRedClass = allKeys[0]; 
        }
        
        await window.loadCharacterDynamic(window.selectedRedClass);
        let s1 = window.classStats[window.selectedRedClass];
        
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1; 
        if (isNaN(selectedMode)) selectedMode = 1;
        
        let isDragonBoss = (selectedMode === 99);
        let isBruceLeeBoss = (selectedMode === 98);
        let isSamuraiBoss = (selectedMode === 97);
        let isNinjaBoss = (selectedMode === 96);
        let isBossMode = isDragonBoss || isBruceLeeBoss || isSamuraiBoss || isNinjaBoss;

        window.rewardMultiplier = isBossMode ? 15 : selectedMode;
        let actualEnemiesCount = isBossMode ? 1 : selectedMode;

        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
        window.currentWeather = window.currentMap.weather;

        if (typeof window.startRecording === 'function') window.startRecording();

        let tauntList = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex', 'cast', 'idle'];

        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, currentDmgMod: s1.dmgMod,
            scale: s1.scale || 1, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, 
            aiDelay: 0, comboHits: 0, comboTimeout: 0, lastAnnouncedCombo: 0,
            critChance: 0.10, critMult: 1.5, className: s1.className, isRage: false, rageAwakened: false,
            shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, 
            introState: tauntList[Math.floor(Math.random() * tauntList.length)],
            avatarUrl: s1.avatarUrl
        };

        window.enemies = []; 
        window.totalEnemyMaxHp = 0;
        for (let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; 
            
            await window.loadCharacterDynamic(blueClass);
            let s2 = window.classStats[blueClass];
            
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.6 : 1.0; 
            if (isBossMode) hpMultiplier = 12.0;

            let bossColor = "#1e90ff"; 
            let bossScale = s2.scale || 1; 
            let bossName = s2.className;
            if (isDragonBoss) { bossColor = "#e74c3c"; bossScale = 2.5; bossName = "Ác Long"; }
            else if (isBruceLeeBoss) { bossColor = "#f1c40f"; bossScale = 1.75; bossName = "Lý Tiểu Long"; }
            else if (isSamuraiBoss) { bossColor = "#e74c3c"; bossScale = 1.8; bossName = "Thánh Kiếm Samurai"; }
            else if (isNinjaBoss) { bossColor = "#8e44ad"; bossScale = 1.6; bossName = "Sát Thủ Ninja"; }

            let eHp = Math.floor((s2.hp || 100) * hpMultiplier); 
            window.totalEnemyMaxHp += eHp;
            let calcDmgMod = (s2.dmgMod || 1) * (isBossMode ? 2.5 : hpMultiplier);
            
            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: (s2.speed || 5) * (isBossMode ? 0.85 : (0.8 + Math.random() * 0.4)), 
                color: bossColor, hp: eHp, maxHp: eHp, dmgMod: calcDmgMod, currentDmgMod: calcDmgMod, scale: bossScale, 
                isDragon: isDragonBoss, isBruceLee: isBruceLeeBoss, isSamurai: isSamuraiBoss, isNinja: isNinjaBoss, isBoss: isBossMode,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: isBossMode ? 0.15 : 0.05, critMult: 1.5, className: isBossMode ? bossName : s2.className, 
                isRage: false, rageAwakened: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, 
                introState: tauntList[Math.floor(Math.random() * tauntList.length)],
                avatarUrl: s2.avatarUrl 
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if (nb) nb.innerText = isDragonBoss ? "🐉" : (isBruceLeeBoss ? "🥋" : (isSamuraiBoss ? "🗡️" : (isNinjaBoss ? "🥷" : `🤖`)));
        
        window.resetMatchVariables(); 
        window.bindAttackEvent();

        if (!window.updateHooked && typeof window.update === 'function') {
            window.originalEngineUpdate = window.update;
            window.update = function() {
                if (window.hitStopFrames > 0) {
                    window.hitStopFrames--;
                    if (window.particles) window.particles.forEach(p => { p.x += p.vx || 0; p.y += p.vy || 0; }); 
                    return; 
                }

                if (window.isCinematicActive) {
                    if (window.floatingTexts) window.floatingTexts.forEach(t => { t.y -= 0.4; t.life--; });
                    if (window.particles) window.particles.forEach(p => { p.x += p.vx || 0; p.y += p.vy || 0; p.life--; });
                    window.updateGhostTrails(); 
                    return; 
                }

                window.updateGhostTrails(); 
                window.checkComboMilestones();
                window.originalEngineUpdate(); 
            };
            window.updateHooked = true;
        }

    } catch(e) { console.error("Lỗi khởi động trận:", e); }
};

window.resetMatchVariables = function() { 
    window.cleanupCinematicDOM();

    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; 
    window.slashes = []; window.shockwaves = []; window.impactSparks = []; 
    window.ghostTrails = []; window.hitStopFrames = 0; 
    
    window.shakeTime = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
    window.currentZoom = 1; window.targetZoom = 1; window.camX = 0; window.camY = 0; window.cameraTilt = 0; 
    window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; 
    window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0; 
    window.impactFrameTimer = 0; window.weatherParticles = []; 
    window.matchEndTimer = 0;
    
    let ptCount = (window.currentWeather === 'none') ? 0 : 150; 
    for (let i = 0; i < ptCount; i++) { 
        window.weatherParticles.push({ 
            x: Math.random() * 1200 - 300, 
            y: Math.random() * 400, 
            speed: (window.currentWeather === 'rain') ? 12 + Math.random() * 10 : 2 + Math.random() * 3, 
            size: Math.random() * 3 + 1, 
            ang: Math.random() * Math.PI * 2 
        }); 
    } 
    if (typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
};

window.bindAttackEvent = function() { 
    if (!window.attackBound) { 
        window.attackBound = true; 
        let triggerAttack = function(e) { 
            let gScreen = document.getElementById("game-screen"); 
            if (!gScreen || gScreen.style.display === "none") return; 
            if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return; 
            e.preventDefault(); 
            if (!window.gameOver && !window.isCinematicActive && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) { 
                if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { 
                    window.p1.comboStep++; 
                } else { 
                    window.p1.comboStep = 0; 
                } 
                window.p1.comboTimeout = 60; 
                if (typeof window.attack === 'function') window.attack(window.p1, window.enemies); 
            } 
        }; 
        window.addEventListener('touchstart', triggerAttack, {passive: false}); 
        window.addEventListener('mousedown', triggerAttack); 
    } 
};

// ==========================================
// HỆ THỐNG THÔNG BÁO COMBO & BỘC PHÁT NỘ KHÍ
// ==========================================
window.checkComboMilestones = function() {
    if (!window.p1 || window.gameOver) return;
    let hits = window.p1.comboHits || 0;
    if (hits === 0) {
        window.p1.lastAnnouncedCombo = 0;
        return;
    }
    if (hits !== window.p1.lastAnnouncedCombo) {
        let msg = null;
        let col = "#f1c40f";
        if (hits === 5) { msg = "🔥 5 HIT COMBO!"; col = "#f39c12"; }
        else if (hits === 10) { msg = "⚡ 10 HITS - ĐIÊN CUỒNG!"; col = "#e74c3c"; }
        else if (hits === 15) { msg = "👑 15 HITS - THẦN THÁNH!"; col = "#00d2d3"; }
        else if (hits >= 20 && hits % 5 === 0) { msg = `🌌 ${hits} HITS - VÔ CỰC!`; col = "#ff9ff3"; }

        if (msg) {
            window.p1.lastAnnouncedCombo = hits;
            window.floatingTexts.push({
                x: window.p1.x, y: window.p1.y - 110,
                text: msg, color: col, alpha: 1.2,
                vx: 0, vy: -1.5, font: "italic 900 22px 'Arial Black', Impact",
                life: 55, scale: 1.6
            });
        }
    }
};

window.triggerRageAwakening = function(char) {
    if (!char || char.rageAwakened || char.hp <= 0) return;
    char.rageAwakened = true;
    char.isRage = true;
    char.speed *= 1.15;
    char.dmgMod *= 1.25;
    char.currentDmgMod = char.dmgMod;
    char.stamina = Math.min(100, (char.stamina || 0) + 40);

    window.hitStopFrames = 10;
    if (typeof window.shakeScreen === 'function') window.shakeScreen(20, 15);
    if (typeof window.playSound === 'function') window.playSound(220, 'sawtooth', 0.4, 0.7);

    for (let i = 0; i < 25; i++) {
        if (typeof window.spawnParticles === 'function') {
            window.spawnParticles(char.x + (Math.random() - 0.5) * 80, char.y - Math.random() * 70, char.isPlayer ? "#ff4757" : "#a55eea", true);
        }
    }

    window.floatingTexts.push({
        x: char.x, y: char.y - 105,
        text: char.isPlayer ? "💢 BỘC PHÁT NỘ KHÍ!" : "👹 BOSS CUỒNG NỘ!",
        color: char.isPlayer ? "#ff4757" : "#a55eea",
        alpha: 1.4, vx: 0, vy: -1,
        font: "italic 900 26px 'Arial Black', Impact",
        life: 80, scale: 1.8
    });
};

// ==========================================
// HIỆU ỨNG KẾT LIỄU K.O. & CHECK GAME OVER
// ==========================================
window.checkGameOver = function() {
    if (window.matchResolved) return; 
    let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; 
        window.gameOver = true; 
        window.cleanupCinematicDOM();

        if (typeof window.triggerVibration === 'function') window.triggerVibration([120, 40, 180]);
        window.matchEndTimer = 0;
        window.hitStopFrames = 22; // Đóng băng khoảnh khắc K.O.

        let winnerName = "";
        let winnerChar = window.p1;

        if (window.p1.hp > 0) {
            winnerName = (window.p1.className || "PLAYER").toUpperCase();
            winnerChar = window.p1;
        } else {
            let killer = window.enemies.find(e => e.hp > 0) || window.enemies[0];
            if (killer) {
                winnerName = (killer.className || "ENEMY").toUpperCase();
                winnerChar = killer;
            }
        }

        // Hiệu ứng Dramatic K.O. Zoom nhẹ vào người chiến thắng
        let gScreen = document.getElementById("game-screen");
        let canvas = document.querySelector("canvas");
        if (gScreen && canvas && winnerChar) {
            let cW = canvas.width || 800;
            let pctX = Math.max(20, Math.min(80, (winnerChar.x / cW) * 100));
            gScreen.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            gScreen.style.transformOrigin = `${pctX}% 60%`;
            gScreen.style.transform = "scale(1.22)";
            setTimeout(() => {
                if (gScreen && window.gameOver) gScreen.style.transform = "scale(1)";
            }, 1800);
        }
        
        let finalWinnerName = "👑 " + winnerName + " WIN"; 
        let winnerColor = (window.p1.hp > 0) ? "#f1c40f" : "#ff4757"; 
        
        window.floatingTexts.push({ 
            x: winnerChar.x, 
            y: winnerChar.y - 125, 
            text: finalWinnerName, 
            color: winnerColor, 
            alpha: 1.0, 
            vx: 0, 
            vy: 0, 
            font: "italic 900 26px 'Arial Black', Impact", 
            life: 9999, 
            scale: 1.8, 
            noGravity: true,
            followChar: winnerChar
        });
    }
};

window.updateHPUIs = function() {
    if (!window.p1) return; 
    let p1Pct = Math.max(0, (window.p1.hp / window.p1.maxHp * 100)) + "%"; 
    let currentEnemyHp = 0; 
    window.enemies.forEach(e => currentEnemyHp += Math.max(0, e.hp)); 
    let p2Pct = window.totalEnemyMaxHp > 0 ? (currentEnemyHp / window.totalEnemyMaxHp * 100) + "%" : "0%";
    
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), 
        h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), 
        h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if (h1) h1.style.width = p1Pct; if (h2) h2.style.width = p1Pct; 
    if (h3) h3.style.width = p2Pct; if (h4) h4.style.width = p2Pct; 
    if (h5) h5.style.width = window.p1.stamina + "%"; 
    if (h6) h6.style.width = window.p1.shieldBreak + "%";
    
    // Kiểm tra kích hoạt Bộc Phát Nộ Khí (Rage Awakening) khi máu dưới 30%
    if (!window.gameOver) {
        if (window.p1.hp > 0 && window.p1.hp < window.p1.maxHp * 0.3 && !window.p1.rageAwakened) {
            window.triggerRageAwakening(window.p1);
        }
        window.enemies.forEach(e => {
            if (e.isBoss && e.hp > 0 && e.hp < e.maxHp * 0.3 && !e.rageAwakened) {
                window.triggerRageAwakening(e);
            }
        });
    }

    if (window.bgmBase && window.bgmClimax) {
        let isClimax = (window.p1.hp < window.p1.maxHp * 0.3) || (window.enemies[0] && window.enemies[0].hp < window.enemies[0].maxHp * 0.3);
        if (isClimax && !window.gameOver) { 
            window.bgmBase.volume = Math.max(0, window.bgmBase.volume - 0.01); 
            window.bgmClimax.volume = Math.min(0.25, window.bgmClimax.volume + 0.01); 
        } else { 
            window.bgmBase.volume = Math.min(0.15, window.bgmBase.volume + 0.01); 
            window.bgmClimax.volume = Math.max(0, window.bgmClimax.volume - 0.01); 
        }
    }
    if (typeof window.getClosestEnemy === 'function') { 
        let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); 
        if (closestEnemy) { 
            let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); 
            if (sb) sb.style.width = closestEnemy.stamina + "%"; 
            if (stb) stb.style.width = closestEnemy.shieldBreak + "%"; 
        } 
    }
    window.checkGameOver(); 
};

// ==========================================
// ĐỠ ĐÒN (PERFECT PARRY) & NÉ ĐÒN (PERFECT DODGE)
// ==========================================
window.playerBlock = function() {
    if (!window.p1 || window.p1.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (window.p1.hitStun > 0 || window.p1.stunTimer > 0) return; 
    
    window.p1.state = 'block';
    window.p1.attackTimer = 40; 
    window.p1.vx = 0; 

    // Kiểm tra Perfect Parry nếu có kẻ địch đang vung đòn sát bên
    let attacker = window.enemies && window.enemies.find(e => e.hp > 0 && e.attackTimer > 0 && Math.abs(e.x - window.p1.x) < 130);
    if (attacker) {
        window.p1.iFrames = 25;
        window.p1.stamina = Math.min(100, window.p1.stamina + 25);
        attacker.hitStun = 35;
        attacker.attackTimer = 0;
        window.hitStopFrames = 8;
        if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);
        if (typeof window.playSound === 'function') window.playSound(800, 'triangle', 0.25, 0.8);
        window.floatingTexts.push({
            x: window.p1.x, y: window.p1.y - 95,
            text: "🛡️ PHẢN ĐÒN HOÀN HẢO!", color: "#00d2d3",
            alpha: 1.3, vx: 0, vy: -1.5, font: "italic 900 20px 'Arial Black'", life: 45, scale: 1.5
        });
    }

    if (typeof window.spawnParticles === 'function') window.spawnParticles(window.p1.x, window.p1.y - 20, "#3498db");
};

window.playerDodge = function() {
    if (!window.p1 || window.p1.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (window.p1.hitStun > 0 || window.p1.stunTimer > 0 || window.p1.dashTimer > 0) return;
    
    window.p1.state = 'dash_back';
    window.p1.dashTimer = 18;        
    window.p1.iFrames = 20;          
    window.p1.dashDir = window.p1.isFacingRight ? -1 : 1; 
    window.p1.attackTimer = 18;

    // Kiểm tra Perfect Dodge (Bản Năng Vô Cực) khi né sát đòn địch
    let dangerEnemy = window.enemies && window.enemies.find(e => e.hp > 0 && e.attackTimer > 0 && Math.abs(e.x - window.p1.x) < 150);
    if (dangerEnemy) {
        window.p1.iFrames = 35;
        window.p1.stamina = Math.min(100, window.p1.stamina + 25);
        window.hitStopFrames = 6;
        window.floatingTexts.push({
            x: window.p1.x, y: window.p1.y - 95,
            text: "⚡ BẢN NĂNG VÔ CỰC! (+25 NỘ)", color: "#a29bfe",
            alpha: 1.3, vx: 0, vy: -1.5, font: "italic 900 20px 'Arial Black'", life: 50, scale: 1.5
        });
    }
    
    if (typeof window.playSound === 'function') window.playSound(400, 'sine', 0.2, 0.4);
    if (typeof window.spawnDust === 'function') window.spawnDust(window.p1.x, window.GROUND_Y);
};

// ==========================================
// ULTIMATE CINEMATIC + ANIME CUT-IN BANNER
// ==========================================
window.useUltimate = function(caster, target) {
    if (!caster || caster.hp <= 0 || window.gameOver || window.isCinematicActive) return;
    if (caster.hitStun > 0 || caster.stunTimer > 0) return;
    if (!target || target.hp <= 0) return;

    window.isCinematicActive = true; 
    
    caster.stamina = 0; 
    caster.state = 'cast'; 
    caster.attackTimer = 200; 
    caster.vx = 0; 
    caster.isFacingRight = target.x > caster.x;

    if (typeof window.playSound === 'function') window.playSound(400, 'sawtooth', 0.5, 0.8);
    for (let i = 0; i < 35; i++) {
        if (typeof window.spawnParticles === 'function') {
            window.spawnParticles(caster.x + (Math.random() - 0.5) * 110, caster.y - 50 + (Math.random() - 0.5) * 110, "#f1c40f", true);
        }
    }
    
    let skillName = (caster.skill && caster.skill.name) ? caster.skill.name.toUpperCase() : "TUYỆT KỸ TỐI THƯỢNG!";
    let ultText = caster.isPlayer ? `🔥 ${skillName}` : "⚠️ NGUY HIỂM TỘT ĐỘ!";
    window.floatingTexts.push({ 
        x: caster.x, y: caster.y - 120, text: ultText, color: "#ff4757", 
        alpha: 1, vx: 0, vy: -0.8, font: "italic 900 32px 'Arial Black', Impact", life: 120, scale: 1.4 
    });

    let gScreen = document.getElementById("game-screen");
    let canvas = document.querySelector("canvas");
    
    if (gScreen && canvas) {
        gScreen.style.overflow = "hidden"; 
        
        let cW = canvas.width || 800;
        let cH = canvas.height || 400;
        
        let pctX = Math.max(20, Math.min(80, (caster.x / cW) * 100));
        let pctY = Math.max(20, Math.min(80, ((caster.y - 60) / cH) * 100));
        
        gScreen.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s";
        gScreen.style.transformOrigin = `${pctX}% ${pctY}%`;
        gScreen.style.transform = "scale(1.65)"; 
        gScreen.style.filter = "brightness(0.7) contrast(1.25) saturate(1.2)"; 
        
        // 2 Thanh điện ảnh trên dưới
        let topBar = document.createElement("div"); topBar.id = "cine-top";
        topBar.style.cssText = "position:absolute; top:0; left:0; width:100%; height:12%; background:black; z-index:9998; transition:0.4s; transform:translateY(-100%); pointer-events:none;";
        let botBar = document.createElement("div"); botBar.id = "cine-bot";
        botBar.style.cssText = "position:absolute; bottom:0; left:0; width:100%; height:12%; background:black; z-index:9998; transition:0.4s; transform:translateY(100%); pointer-events:none;";
        gScreen.appendChild(topBar); 
        gScreen.appendChild(botBar);

        // Dải Anime Cut-in Banner ngang màn hình
        let cutIn = document.createElement("div"); cutIn.id = "cine-cutin";
        let accentCol = caster.isPlayer ? "#f1c40f" : "#ff4757";
        cutIn.style.cssText = `
            position:absolute; top:22%; left:-120%; width:120%; height:70px;
            background: linear-gradient(90deg, rgba(0,0,0,0.95), ${accentCol}, rgba(0,0,0,0.95));
            border-top: 3px solid #fff; border-bottom: 3px solid #fff;
            transform: skewY(-4deg); z-index:9999; display:flex; align-items:center;
            justify-content:center; gap:20px; pointer-events:none;
            box-shadow: 0 0 25px ${accentCol};
            transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        let avatarHtml = caster.avatarUrl ? `<img src="${caster.avatarUrl}" style="height:62px; width:62px; object-fit:cover; border-radius:50%; border:2px solid #fff; background:#111;">` : "";
        cutIn.innerHTML = `
            ${avatarHtml}
            <span style="color:#fff; font-family:'Arial Black', Impact, sans-serif; font-size:26px; font-style:italic; text-shadow: 3px 3px 0 #000; letter-spacing:2px;">
                ${(caster.className || "FIGHTER").toUpperCase()} — ${skillName}
            </span>
        `;
        gScreen.appendChild(cutIn);

        setTimeout(() => { 
            topBar.style.transform = "translateY(0)"; 
            botBar.style.transform = "translateY(0)"; 
            cutIn.style.left = "-10%";
        }, 40);

        setTimeout(() => {
            if (cutIn) cutIn.style.left = "120%";
        }, 1450);

        let flash = document.createElement("div"); flash.id = "cine-flash";
        flash.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:white; z-index:10000; pointer-events:none; transition: opacity 0.45s;";
        gScreen.appendChild(flash);
        setTimeout(() => { flash.style.opacity = "0"; }, 50);
        setTimeout(() => { if (flash.parentNode) flash.remove(); }, 550);
    }

    let dmgFactor = caster.currentDmgMod || caster.dmgMod || 1;
    let baseDmg = (caster.isPlayer ? 50 : 35) * dmgFactor; 
    let charDef = window.classStats[caster.classId];

    window.ultimateTimeoutId = setTimeout(() => {
        window.cleanupCinematicDOM();
        if (window.gameOver || !window.isLoopRunning || caster.hp <= 0) return;

        if (charDef && typeof charDef.executeUltimate === 'function') {
            charDef.executeUltimate(caster, target, baseDmg);
            window.hitStopFrames = 15; 
            if (typeof window.shakeScreen === 'function') window.shakeScreen(40, 30); 
        } else {
            caster.state = 'punch'; 
            caster.attackTimer = 30;
            caster.vx = caster.isFacingRight ? 12 : -12;
        }
    }, 1900); 
};

window.playerUseSkill = function() {
    let target = null;
    if (typeof window.getClosestEnemy === 'function') target = window.getClosestEnemy(window.p1, window.enemies);
    window.useUltimate(window.p1, target);
};

// ==========================================
// HỆ THỐNG LIVE PREVIEW NHÂN VẬT TẠI MENU
// ==========================================
window.previewFighter = null;
window.isPreviewRunning = false;
window.previewAnimId = null;

window.startPreviewLoop = function(charStats) {
    if (window.previewAnimId) cancelAnimationFrame(window.previewAnimId);
    if (!charStats) return;
    
    window.previewFighter = {
        classId: window.selectedRedClass,
        avatarUrl: charStats.avatarUrl,
        x: 0, y: 0, 
        scale: (charStats.scale || 1) * 1.5, 
        color: charStats.color || "#fff",
        state: 'idle', attackTimer: 0, isFacingRight: true, onGround: true, hp: 100, maxHp: 100, iFrames: 0,
        drawMethod: charStats.drawMethod,
        isBruceLee: charStats.className && charStats.className.includes("Lý"),
        isSamurai: charStats.className && charStats.className.includes("Samurai"),
        isNinja: charStats.className && charStats.className.includes("Ninja"),
        isDragon: charStats.className && charStats.className.includes("Long")
    };

    window.isPreviewRunning = true;
    window.previewLoop();
};

window.previewLoop = function() {
    if (!window.isPreviewRunning) return;
    
    let canvas = document.getElementById("preview-canvas");
    if (!canvas) {
        window.previewAnimId = requestAnimationFrame(window.previewLoop);
        return;
    }
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let p = window.previewFighter;
    if (!p) return;

    if (p.attackTimer > 0) p.attackTimer--;
    if (p.attackTimer <= 0) {
        let taunts = ['idle', 'taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex', 'punch', 'high_kick', 'uppercut'];
        p.state = taunts[Math.floor(Math.random() * taunts.length)];
        p.attackTimer = Math.floor(Math.random() * 60) + 40; 
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 30); 
    
    if (p.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, p); 
    else if (p.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(ctx, p);
    else if (p.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(ctx, p);
    else if (p.isNinja && typeof window.drawNinja === 'function') window.drawNinja(ctx, p);
    else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, p);
    
    ctx.restore();
    window.previewAnimId = requestAnimationFrame(window.previewLoop);
};

// ==========================================
// GHOST TRAILS, AURA RAGE & ANIME DAMAGE TEXT
// ==========================================
window.updateGhostTrails = function() {
    if (!window.p1 || window.gameOver) return;
    
    let allFighters = [window.p1, ...(window.enemies || [])];
    allFighters.forEach(f => {
        if (!f || f.hp <= 0) return;
        let shouldSpawn = (f.dashTimer > 0 || f.state === 'cast' || (f.isRage && Math.abs(f.vx) > 3));
        if (shouldSpawn && Math.random() > 0.45) {
            window.ghostTrails.push({
                x: f.x, y: f.y,
                scale: f.scale, state: f.state,
                isFacingRight: f.isFacingRight,
                alpha: 0.55, life: 14,
                drawMethod: f.drawMethod,
                isBruceLee: f.isBruceLee, isSamurai: f.isSamurai, isNinja: f.isNinja, isDragon: f.isDragon,
                avatarUrl: f.avatarUrl,
                color: f.isRage ? "#ff4757" : (f.color || "#00d2d3"),
                tintFilter: f.isRage ? "brightness(1.8) sepia(1) hue-rotate(-50deg)" : "brightness(2.2) sepia(1) hue-rotate(180deg)"
            });
        }
    });

    for (let i = window.ghostTrails.length - 1; i >= 0; i--) {
        let t = window.ghostTrails[i];
        t.life--; 
        t.alpha -= 0.04;
        if (t.life <= 0 || t.alpha <= 0) window.ghostTrails.splice(i, 1);
    }
};

window.drawGhostTrails = function(ctx) {
    if (!window.ghostTrails) return;
    window.ghostTrails.forEach(t => {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.filter = t.tintFilter || "brightness(2.5) sepia(1) hue-rotate(180deg)"; 
        
        if (t.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, t); 
        else if (t.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(ctx, t);
        else if (t.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(ctx, t);
        else if (t.isNinja && typeof window.drawNinja === 'function') window.drawNinja(ctx, t);
        else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, t, true);
        
        ctx.restore();
    });
};

window.drawAura = function(ctx, char) {
    if (!char || (char.state !== 'cast' && !char.isRage)) return;
    
    let isCasting = (char.state === 'cast');
    let time = Date.now() / (isCasting ? 45 : 70); 
    let layers = isCasting ? 5 : 3;

    ctx.save();
    ctx.translate(char.x, char.y);
    
    for (let i = 0; i < layers; i++) {
        let offsetY = Math.sin(time + i) * 10 - 20;
        let scaleX = (isCasting ? 1 : 0.75) + Math.sin(time * 0.5 + i) * 0.2;
        
        ctx.beginPath();
        ctx.ellipse(0, offsetY, 40 * scaleX * char.scale, (80 + offsetY) * char.scale, 0, 0, Math.PI * 2);
        
        let grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 100 * char.scale);
        if (isCasting) {
            grad.addColorStop(0, char.isPlayer ? "rgba(255, 200, 0, 0.8)" : "rgba(255, 50, 50, 0.8)");
        } else {
            grad.addColorStop(0, char.isPlayer ? "rgba(255, 71, 87, 0.45)" : "rgba(165, 94, 234, 0.45)");
        }
        grad.addColorStop(1, "rgba(255, 100, 0, 0)");
        
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "lighter"; 
        ctx.fill();
    }
    ctx.restore();
};

window.spawnDamageText = function(x, y, damage, isCrit) {
    if (!window.floatingTexts) window.floatingTexts = [];
    let roundedDmg = Math.round(damage);
    window.floatingTexts.push({ 
        x: x + (Math.random() * 40 - 20), 
        y: y - 55, 
        text: isCrit ? `💥 ${roundedDmg} CRIT!` : `-${roundedDmg}`, 
        color: isCrit ? "#ff9f43" : "#ffffff", 
        scale: isCrit ? 2.2 : 1.25, 
        alpha: 1, 
        vx: (Math.random() - 0.5) * 5, 
        vy: -6 - Math.random() * 3,    
        life: 45 
    });
};

window.drawFloatingTexts = function(ctx) {
    if (!window.floatingTexts) return;
    
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) {
        let t = window.floatingTexts[i];
        
        // Nếu là chữ WIN đi theo đầu nhân vật chiến thắng
        if (t.followChar) {
            t.x = t.followChar.x;
            t.y = t.followChar.y - 125 + Math.sin(Date.now() / 180) * 5;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha));
        ctx.translate(t.x, t.y);
        
        if (t.scale > 1) t.scale = Math.max(1, t.scale - 0.08); 
        let currentScale = t.noGravity ? (1 + Math.sin(Date.now() / 200) * 0.08) : Math.max(1, t.scale);
        ctx.scale(currentScale, currentScale);
        
        ctx.font = t.font || "900 24px 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000";
        ctx.strokeText(t.text, 0, 0);
        
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
        
        if (!window.isCinematicActive || window.hitStopFrames <= 0) { 
            t.x += (t.vx || 0);
            t.y += (t.vy || 0);
            if (!t.noGravity) {
                t.vy = (t.vy !== undefined) ? t.vy + 0.45 : -1; 
                t.alpha -= 0.022;
            }
            t.life--;
        }
        
        if (t.life <= 0 || t.alpha <= 0) window.floatingTexts.splice(i, 1);
    }
};

// ==========================================
// HỆ THỐNG TÌM KIẾM NHÂN VẬT (REAL-TIME FILTER)
// ==========================================
window.filterCharacters = function() {
    let input = document.getElementById('char-search');
    if (!input) return;
    
    let filter = input.value.toUpperCase(); 
    let carousel = document.getElementById('character-carousel');
    if (!carousel) return;
    
    let cards = carousel.getElementsByClassName('char-card');
    
    for (let i = 0; i < cards.length; i++) {
        let nameElement = cards[i].querySelector('.char-name');
        if (nameElement) {
            let txtValue = nameElement.textContent || nameElement.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                cards[i].style.display = ""; 
            } else {
                cards[i].style.display = "none"; 
            }
        }
    }
};
