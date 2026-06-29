// ==========================================
// MAIN.JS - BẢN ĐỐI KHÁNG MMA CHUYÊN NGHIỆP
// GỠ BỎ LEO THÁP + CẤY TRÍ TUỆ NHÂN TẠO ĐỌC TÊN (ANNOUNCER)
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

window.lastBaseIdx = -1; window.lastClimaxIdx = -1;

document.addEventListener("click", function(e) {
    let target = e.target.closest("button, a, div"); if (!target) return;
    let txt = target.innerText.toUpperCase(); let id = (target.id || "").toUpperCase(); let cls = (target.className || "").toUpperCase();
    if (target.closest("#game-screen") && (txt.includes("THOÁT") || txt.includes("BACK") || id.includes("BACK") || id.includes("EXIT") || cls.includes("BACK") || cls.includes("EXIT"))) {
        if (!cls.includes("SKILL") && !id.includes("SKILL")) { e.preventDefault(); window.backToMenu(); }
    }
});

// DANH SÁCH MENU TƯỚNG (Chỉ dùng để vẽ giao diện ban đầu)
window.CHARACTER_REGISTRY = [
    { id: "dausi", className: "Đấu Sĩ MMA", avatarUrl: "https://i.ibb.co/WvyCz0nk/7fe631a9-e7fa-4aef-bf69-4d405beb5166.jpg" },
    { id: "satthu", className: "Sát Thủ", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf" },
    { id: "phapsu", className: "Pháp Sư", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf" },
    { id: "hove", className: "Hộ Vệ", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf" },
    { id: "thichkhach", className: "Thích Khách", avatarUrl: "https://i.ibb.co/Xd26hLd/b8de0710-bed2-45f6-b258-a722729c3dfb.jpg" },
    // Có thể bổ sung ronaldo, messi... vào đây nếu muốn hiện trên UI
];

window.loadedCharacters = {}; 

// ==========================================
// HỆ THỐNG AI ĐỌC TÊN TRẬN ĐẤU (MMA ANNOUNCER UPGRADED)
// Hỗ trợ song ngữ: Đọc tên tiếng Việt, Hô hiệu lệnh tiếng Anh
// ==========================================
window.announceMMA = function(text, lang = 'vi-VN') {
    if ('speechSynthesis' in window && !window.isMuted) {
        window.speechSynthesis.cancel(); // Hủy giọng đọc đang kẹt
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; 
        utterance.rate = 0.9;     
        utterance.pitch = lang === 'en-US' ? 0.4 : 0.6; // Giọng Anh trầm và nguy hiểm hơn
        utterance.volume = 1.0;
        
        let voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.lang === lang) || voices[0];
        if (voice) utterance.voice = voice;
        
        window.speechSynthesis.speak(utterance);
    }
};

window.loadCharacterDynamic = function(charId) {
    return new Promise((resolve) => {
        if (window.classStats && window.classStats[charId] && window.classStats[charId].drawMethod) {
            window.loadedCharacters[charId] = window.classStats[charId];
            return resolve(window.classStats[charId]);
        }
        let script = document.createElement("script");
        let ts = Math.floor(new Date().getTime() / 60000); 
        script.src = `https://raw.githack.com/vanthanh1107/stickman-game/main/char_${charId}.js?v=${ts}`; 
        
        script.onload = () => {
            if (window.currentLoadedChar) {
                window.loadedCharacters[charId] = window.currentLoadedChar;
                if (!window.classStats[charId]) window.classStats[charId] = {};
                Object.assign(window.classStats[charId], window.currentLoadedChar);
                window.currentLoadedChar = null; 
                resolve(window.loadedCharacters[charId]);
            } else {
                resolve(window.classStats[charId] || null);
            }
        };
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
    });
};

window.initGame = async function() {
    if (!window.classStats) window.classStats = {};
    window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    
    // Vẽ giao diện dựa vào cuốn Menu
    window.CHARACTER_REGISTRY.forEach(item => {
        let card = document.createElement("div"); card.className = "char-card"; 
        card.innerHTML = `<div class="char-avatar"><img src="${item.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/png?seed=error'}"></div><div class="char-name">${item.className}</div>`;
        
        card.onclick = async () => { 
            window.selectedRedClass = item.id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); 
            card.classList.add('selected'); 
            
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>⏳ Đang tải chiến binh...</span>`;
            
            // Tải dữ liệu tướng động
            await window.loadCharacterDynamic(item.id);
            
            // Lấy thẳng chỉ số từ characters.js sau khi nạp xong
            let activeItem = window.classStats[item.id];
            if(activeItem && desc) {
                desc.innerHTML = `<span>❤️ Máu: <strong>${activeItem.hp || 100}</strong></span><span>💨 Tốc: <strong>${((activeItem.speed || 5)/3).toFixed(1)}</strong></span><span>⚔️ Công: <strong>x${activeItem.dmgMod || 1}</strong></span>`; 
            } else if (desc) {
                desc.innerHTML = `<span style="color:#ff4757;">⚠️ Lỗi tải dữ liệu tướng!</span>`;
            }
        };
        carousel.appendChild(card); if (!firstCardId) { firstCardId = item.id; }
    });

    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }

    let enemySelect = document.getElementById("enemy-count-select");
    if (enemySelect && !enemySelect.querySelector("option[value='97']")) {
        enemySelect.innerHTML += `
            <option value="98">🥋 Đánh Boss Lý Tiểu Long</option>
            <option value="97">🗡️ Đánh Boss Samurai</option>
            <option value="96">🥷 Đánh Boss Ninja</option>
        `;
    }
}

window.initBGM = function() {
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmBase.src = ""; window.bgmBase = null; }
    if (window.bgmClimax) { window.bgmClimax.pause(); window.bgmClimax.src = ""; window.bgmClimax = null; }
    let bIdx, cIdx;
    do { bIdx = Math.floor(Math.random() * window.BGM_BASE_POOL.length); } while (bIdx === window.lastBaseIdx);
    do { cIdx = Math.floor(Math.random() * window.BGM_CLIMAX_POOL.length); } while (cIdx === window.lastClimaxIdx);
    window.lastBaseIdx = bIdx; window.lastClimaxIdx = cIdx;
    window.bgmBase = new Audio(window.BGM_BASE_POOL[bIdx]); window.bgmClimax = new Audio(window.BGM_CLIMAX_POOL[cIdx]);
    window.bgmBase.crossOrigin = "anonymous"; window.bgmClimax.crossOrigin = "anonymous";
    window.bgmBase.loop = true; window.bgmClimax.loop = true; window.bgmBase.volume = 0; window.bgmClimax.volume = 0;
    window.bgmBase.play().catch(e=>{}); window.bgmClimax.play().catch(e=>{});
}

window.backToMenu = function() { 
    if (typeof window.stopRecording === 'function') window.stopRecording();
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmClimax.pause(); window.bgmBase = null; window.bgmClimax = null; }
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "block"; 
    window.gameOver = true; window.isLoopRunning = false; if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.startGame = async function() { 
    if(!window.selectedRedClass) return; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    window.initBGM(); 
    if(typeof window.matchStart === 'function') await window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.matchStart = async function() {
    try {
        // Lấy list tướng hợp lệ từ Registry
        let allKeys = window.CHARACTER_REGISTRY.map(item => item.id);
        if(allKeys.length === 0) return; 
        if (!window.selectedRedClass) { window.selectedRedClass = allKeys[0]; }
        
        await window.loadCharacterDynamic(window.selectedRedClass);
        let s1 = window.classStats[window.selectedRedClass];
        
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1; if(isNaN(selectedMode)) selectedMode = 1;
        
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
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.10, critMult: 1.5, className: s1.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, 
            introState: tauntList[Math.floor(Math.random() * tauntList.length)]
        };

        window.enemies = []; window.totalEnemyMaxHp = 0;
        for(let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; 
            
            await window.loadCharacterDynamic(blueClass);
            let s2 = window.classStats[blueClass];
            
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.6 : 1.0; 
            if(isBossMode) hpMultiplier = 12.0;

            let bossColor = "#1e90ff"; let bossScale = 1; let bossName = s2.className;
            if(isDragonBoss) { bossColor = "#e74c3c"; bossScale = 2.5; bossName = "Ác Long"; }
            else if(isBruceLeeBoss) { bossColor = "#f1c40f"; bossScale = 1.75; bossName = "Lý Tiểu Long"; }
            else if(isSamuraiBoss) { bossColor = "#e74c3c"; bossScale = 1.8; bossName = "Thánh Kiếm Samurai"; }
            else if(isNinjaBoss) { bossColor = "#8e44ad"; bossScale = 1.6; bossName = "Sát Thủ Ninja"; }

            let eHp = Math.floor((s2.hp || 100) * hpMultiplier); window.totalEnemyMaxHp += eHp;
            
            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: (s2.speed || 5) * (isBossMode ? 0.8 : (0.8 + Math.random()*0.4)), 
                color: bossColor, hp: eHp, maxHp: eHp, dmgMod: (s2.dmgMod || 1) * (isBossMode ? 2.5 : hpMultiplier), scale: bossScale, 
                isDragon: isDragonBoss, isBruceLee: isBruceLeeBoss, isSamurai: isSamuraiBoss, isNinja: isNinjaBoss,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.05, critMult: 1.5, className: isBossMode ? bossName : s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, 
                introState: tauntList[Math.floor(Math.random() * tauntList.length)]
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isDragonBoss ? "🐉" : (isBruceLeeBoss ? "🥋" : (isSamuraiBoss ? "🗡️" : (isNinjaBoss ? "🥷" : `🤖`)));
        
        // ==========================================
        // GỌI AI ĐỌC TÊN VÀ HIỆU LỆNH FIGHT!
        // ==========================================
        let playerRealName = window.p1.className || "Chiến binh";
        let enemyRealName = window.enemies[0].className || "Kẻ địch";
        if (window.enemies.length > 1 && !isBossMode) enemyRealName = `Đội quân ${enemyRealName}`;
        
        // 1. Đọc tên bằng Tiếng Việt
        window.announceMMA(`${playerRealName} ... vơ sớt ... ${enemyRealName}`, 'vi-VN');

        // 2. Chờ 2.5 giây cho AI đọc xong -> Vang tiếng Cồng + Hô FIGHT bằng tiếng Anh
        setTimeout(() => {
            if (!window.gameOver) {
                // Tạo tiếng Cồng (Gong) giả lập bằng engine
                if(typeof window.playSound === 'function') {
                    window.playSound(250, 'triangle', 2.0, 1.0, false); // Tiếng vang
                    window.playSound(200, 'square', 0.5, 0.5, true);    // Cú gõ
                }
                // Hô Fight bằng giọng Anh
                window.announceMMA("Fight!", 'en-US');
            }
        }, 2500);

        window.resetMatchVariables(); window.bindAttackEvent();

        if (!window.updateHooked && typeof window.update === 'function') {
            window.originalEngineUpdate = window.update;
            window.update = function() {
                if (window.isCinematicActive) {
                    if (window.floatingTexts) window.floatingTexts.forEach(t => { t.y -= 0.5; t.life--; });
                    if (window.particles) window.particles.forEach(p => { p.x += p.vx||0; p.y += p.vy||0; p.life--; });
                    return; 
                }
                window.originalEngineUpdate(); 
            };
            window.updateHooked = true;
        }

    } catch(e) { console.error("Lỗi khởi động trận:", e); }
}

window.resetMatchVariables = function() { 
    window.isCinematicActive = false;
    let gScreen = document.getElementById("game-screen");
    if(gScreen) {
        gScreen.style.transform = "scale(1)";
        gScreen.style.filter = "none";
        gScreen.style.transition = "none";
        let topBar = document.getElementById("cine-top");
        let botBar = document.getElementById("cine-bot");
        if(topBar) topBar.remove();
        if(botBar) botBar.remove();
    }
    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = []; window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1; window.camX = 0; window.camY = 0; window.cameraTilt = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0; window.impactFrameTimer = 0; window.weatherParticles = []; 
    window.endIconType = ""; window.matchEndTimer = 0;
    let ptCount = (window.currentWeather === 'none') ? 0 : 150; for(let i=0; i<ptCount; i++) { window.weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (window.currentWeather === 'rain') ? 12 + Math.random() * 10 : 2 + Math.random() * 3, size: Math.random() * 3 + 1, ang: Math.random() * Math.PI * 2 }); } if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.bindAttackEvent = function() { if (!window.attackBound) { window.attackBound = true; let triggerAttack = function(e) { let gScreen = document.getElementById("game-screen"); if (!gScreen || gScreen.style.display === "none") return; if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return; e.preventDefault(); if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) { if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { window.p1.comboStep++; } else { window.p1.comboStep = 0; } window.p1.comboTimeout = 60; if(typeof window.attack === 'function') window.attack(window.p1, window.enemies); } }; window.addEventListener('touchstart', triggerAttack, {passive: false}); window.addEventListener('mousedown', triggerAttack); } }

window.checkGameOver = function() {
    if (window.matchResolved) return; 
    let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; 
        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);
        
        window.endIconType = (window.p1.hp > 0) ? 'win' : 'lose';
        window.matchEndTimer = 0;

        let winnerText = (window.p1.hp > 0) ? "VICTORY!" : "GAME OVER!"; 
        let winnerColor = (window.p1.hp > 0) ? "#2ed573" : "#ff4757";
        window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: winnerText, color: winnerColor, alpha: 1, vx: 0, vy: -0.5, font: "900 70px Arial", life: 180 });

        // ==========================================
        // GỌI AI ĐỌC TÊN VÀ TIẾNG CHUÔNG KẾT THÚC TRẬN
        // ==========================================
        let isPlayerWin = (window.p1.hp > 0);
        
        setTimeout(() => {
            if (isPlayerWin) {
                // Thắng: Đánh chuông chiến thắng + Hô YOU WIN!
                if(typeof window.playSound === 'function') {
                    window.playSound(600, 'sine', 1.0, 0.5, false);
                    window.playSound(800, 'sine', 1.5, 0.5, false);
                }
                window.announceMMA("You Win!", 'en-US');
            } else {
                // Thua: Đánh chuông thất bại + Hô K.O.
                if(typeof window.playSound === 'function') {
                    window.playSound(200, 'sawtooth', 1.5, 0.5, false);
                    window.playSound(150, 'sawtooth', 2.0, 0.5, false);
                }
                // Phát âm "Kây Âu" để AI tiếng Anh đọc chuẩn là K.O.
                window.announceMMA("K. O. ! You Lose!", 'en-US');
            }
        }, 1000); // Chờ 1s sau khi màn hình nổ K.O mới đọc
    }
}

window.updateHPUIs = function() {
    if (!window.p1) return; let p1Pct = (window.p1.hp / window.p1.maxHp * 100) + "%"; let currentEnemyHp = 0; window.enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = window.totalEnemyMaxHp > 0 ? (currentEnemyHp / window.totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = window.p1.stamina + "%"; if(h6) h6.style.width = window.p1.shieldBreak + "%";
    
    if (window.bgmBase && window.bgmClimax) {
        let isClimax = (window.p1.hp < window.p1.maxHp * 0.3) || (window.enemies[0] && window.enemies[0].hp < window.enemies[0].maxHp * 0.3);
        if (isClimax && !window.gameOver) { window.bgmBase.volume = Math.max(0, window.bgmBase.volume - 0.01); window.bgmClimax.volume = Math.min(0.25, window.bgmClimax.volume + 0.01); } 
        else { window.bgmBase.volume = Math.min(0.15, window.bgmBase.volume + 0.01); window.bgmClimax.volume = Math.max(0, window.bgmClimax.volume - 0.01); }
    }
    if(typeof window.getClosestEnemy === 'function') { let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; } }
    window.checkGameOver(); 
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); try { if(typeof window.update === 'function') window.update(); } catch(e) { } try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } } 
}

window.playerBlock = function() {
    if (!window.p1 || window.p1.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (window.p1.hitStun > 0 || window.p1.stunTimer > 0) return; 
    
    window.p1.state = 'block';
    window.p1.attackTimer = 40; 
    window.p1.vx = 0; 
    window.spawnParticles(window.p1.x, window.p1.y - 20, "#3498db");
};

window.playerDodge = function() {
    if (!window.p1 || window.p1.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (window.p1.hitStun > 0 || window.p1.stunTimer > 0 || window.p1.dashTimer > 0) return;
    
    window.p1.state = 'dash_back';
    window.p1.dashTimer = 18;        
    window.p1.iFrames = 18;          
    window.p1.dashDir = window.p1.isFacingRight ? -1 : 1; 
    window.p1.attackTimer = 18;
    
    if (typeof window.playSound === 'function') window.playSound(400, 'sine', 0.2, 0.4);
    if (typeof window.spawnDust === 'function') window.spawnDust(window.p1.x, window.GROUND_Y);
};

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

    if(typeof window.playSound === 'function') window.playSound(400, 'sawtooth', 0.5, 0.8);
    for(let i=0; i<30; i++) {
        if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x + (Math.random()-0.5)*100, caster.y - 50 + (Math.random()-0.5)*100, "#f1c40f", true);
    }
    
    let ultText = caster.isPlayer ? "🔥 ĐANG TỤ LỰC..." : "⚠️ NGUY HIỂM!";
    window.floatingTexts.push({ x: caster.x, y: caster.y - 120, text: ultText, color: "#ff4757", alpha: 1, vx: 0, vy: -1, font: "900 45px Arial", life: 120 });

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
        gScreen.style.transform = "scale(1.7)"; 
        gScreen.style.filter = "brightness(0.6) contrast(1.2)"; 
        
        let topBar = document.createElement("div"); topBar.id = "cine-top";
        topBar.style.cssText = "position:absolute; top:0; left:0; width:100%; height:12%; background:black; z-index:9999; transition:0.5s; transform:translateY(-100%); pointer-events:none;";
        let botBar = document.createElement("div"); botBar.id = "cine-bot";
        botBar.style.cssText = "position:absolute; bottom:0; left:0; width:100%; height:12%; background:black; z-index:9999; transition:0.5s; transform:translateY(100%); pointer-events:none;";
        gScreen.appendChild(topBar); gScreen.appendChild(botBar);
        setTimeout(() => { topBar.style.transform = "translateY(0)"; botBar.style.transform = "translateY(0)"; }, 50);

        let flash = document.createElement("div");
        flash.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:white; z-index:10000; pointer-events:none; transition: opacity 0.5s;";
        gScreen.appendChild(flash);
        setTimeout(() => { flash.style.opacity = "0"; }, 50);
        setTimeout(() => { if(flash.parentNode) flash.remove(); }, 600);
    }

    let baseDmg = 50 * (caster.currentDmgMod || 1); 
    if (!caster.isPlayer) baseDmg = 35 * (caster.currentDmgMod || 1); 
    let charDef = window.classStats[caster.classId];

    setTimeout(() => {
        window.isCinematicActive = false; 

        if (gScreen) {
            gScreen.style.transform = "scale(1)";
            gScreen.style.filter = "none";
            let topBar = document.getElementById("cine-top");
            let botBar = document.getElementById("cine-bot");
            if(topBar) topBar.style.transform = "translateY(-100%)";
            if(botBar) botBar.style.transform = "translateY(100%)";
            
            setTimeout(() => { 
                gScreen.style.transition = "none"; 
                if(topBar) topBar.remove(); 
                if(botBar) botBar.remove(); 
            }, 500); 
        }

        if(window.gameOver || caster.hp <= 0) return;

        if (charDef && typeof charDef.executeUltimate === 'function') {
            charDef.executeUltimate(caster, target, baseDmg);
            if(typeof window.shakeScreen === 'function') window.shakeScreen(40, 30); 
        } else {
            caster.state = 'punch'; 
            caster.attackTimer = 30;
            caster.vx = caster.isFacingRight ? 10 : -10;
        }
    }, 2000); 
}

window.playerUseSkill = function() {
    let target = null;
    if(typeof window.getClosestEnemy === 'function') target = window.getClosestEnemy(window.p1, window.enemies);
    window.useUltimate(window.p1, target);
}
