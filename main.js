// ==========================================
// MAIN.JS - HỆ THỐNG VẬN HÀNH & KHO NHẠC NỀN EPIC KEVIN MACLEOD (FIX VOLUME)
// ==========================================

// KHO PLAYLIST NHẠC NỀN VĨNH VIỄN (WIKIMEDIA COMMONS)
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

// Bộ nhớ để đảm bảo không bị lặp lại bài cũ
window.lastBaseIdx = -1;
window.lastClimaxIdx = -1;

window.initGame = async function() {
    try {
        let response = await fetch(window.GOOGLE_SHEET_URL);
        if(response.ok) {
            let csvText = await response.text(); let rows = csvText.split('\n');
            for (let i = 1; i < rows.length; i++) {
                let rowText = rows[i] ? rows[i].trim() : ""; if (rowText === "") continue;
                let cols = rowText.split(','); let id = cols[0] ? cols[0].trim().toLowerCase() : "";
                if (id !== "" && window.classStats[id]) {
                    if (cols[1] && cols[1].trim() !== "") window.classStats[id].className = cols[1].trim();
                    for(let c=2; c<cols.length; c++) { if (cols[c] && cols[c].includes("http")) { window.classStats[id].avatarUrl = cols[c].trim().replace(/\r/g, ''); break; } }
                }
            }
        }
    } catch(e) {}
    if(typeof window.assignDrawMethods === 'function') window.assignDrawMethods(window.classStats); 
    window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        card.innerHTML = `<div class="char-avatar"><img src="${item.avatarUrl}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => { 
            window.selectedRedClass = id; document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>💨 Tốc: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Công: <strong>x${item.dmgMod}</strong></span>`; 
        };
        carousel.appendChild(card); if (!firstCardId) { firstCardId = id; }
    }
    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }

    let selScreen = document.getElementById("selection-screen");
    if (selScreen && !document.getElementById("btn-tournament")) {
        let startBtnContainer = document.querySelector("#selection-screen .control-btns");
        if (!startBtnContainer) {
            let sBtn = document.querySelector("#selection-screen button[onclick*='startGame']");
            if (sBtn) startBtnContainer = sBtn.parentNode;
        }
        if (startBtnContainer) {
            let tBtn = document.createElement("button");
            tBtn.id = "btn-tournament";
            tBtn.innerText = "🏆 GIẢI ĐẤU AUTO";
            tBtn.className = "game-btn";
            tBtn.style.cssText = "background: linear-gradient(45deg, #f1c40f, #e67e22); color: #111; padding: 12px 20px; font-weight: 900; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-left: 10px; box-shadow: 0 4px 15px rgba(241,196,15,0.4); text-transform: uppercase;";
            tBtn.onclick = () => window.startTournament();
            startBtnContainer.appendChild(tBtn);
        }
    }
}

// KHỞI TẠO BGM: ÉP BUỘC CHỌN BÀI MỚI SO VỚI TRẬN TRƯỚC
window.initBGM = function() {
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmBase.src = ""; window.bgmBase = null; }
    if (window.bgmClimax) { window.bgmClimax.pause(); window.bgmClimax.src = ""; window.bgmClimax = null; }
    
    let bIdx, cIdx;
    
    // Vòng lặp chống trùng bài: Bốc tới khi nào ra bài khác bài cũ thì thôi
    do { bIdx = Math.floor(Math.random() * window.BGM_BASE_POOL.length); } while (bIdx === window.lastBaseIdx);
    do { cIdx = Math.floor(Math.random() * window.BGM_CLIMAX_POOL.length); } while (cIdx === window.lastClimaxIdx);
    
    window.lastBaseIdx = bIdx;
    window.lastClimaxIdx = cIdx;
    
    window.bgmBase = new Audio(window.BGM_BASE_POOL[bIdx]);
    window.bgmClimax = new Audio(window.BGM_CLIMAX_POOL[cIdx]);
    
    window.bgmBase.crossOrigin = "anonymous";
    window.bgmClimax.crossOrigin = "anonymous";
    
    window.bgmBase.loop = true; window.bgmClimax.loop = true;
    window.bgmBase.volume = 0; window.bgmClimax.volume = 0;
    
    window.bgmBase.play().catch(e=>{}); window.bgmClimax.play().catch(e=>{});
}

window.startGame = function() { 
    if(!window.selectedRedClass) return; 
    window.isTournamentMode = false;
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    
    window.initBGM();
    if(typeof window.matchStart === 'function') window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.startTournament = function() {
    window.isTournamentMode = true;
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    
    let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
    window.tournamentQueue = []; window.nextRoundQueue = [];
    
    for(let i=0; i<8; i++) {
        let k = allKeys[Math.floor(Math.random() * allKeys.length)];
        let stat = JSON.parse(JSON.stringify(window.classStats[k]));
        stat.classId = k; stat.id = "T_" + i;
        window.tournamentQueue.push(stat);
    }

    window.initBGM();
    window.runTournamentMatch(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.backToMenu = function() { 
    if (typeof window.stopRecording === 'function') window.stopRecording();
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmClimax.pause(); window.bgmBase = null; window.bgmClimax = null; }
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "block"; 
    window.gameOver = true; window.isLoopRunning = false; if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
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
        if (btnExit) { btnExit.innerText = "🔙 THOÁT"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }

        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
        window.currentWeather = window.currentMap.weather;

        let animatedTaunts = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'];
        let p1Pose = animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)];
        let p2Pose = animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)];

        if (typeof window.startRecording === 'function') window.startRecording();

        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1,
            onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: window.classStats[window.selectedRedClass].drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0,
            introState: p1Pose 
        };

        window.enemies = []; window.totalEnemyMaxHp = 0;
        for(let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; if(isBossMode) hpMultiplier = 10.0;
            let eHp = Math.floor(s2.hp * hpMultiplier); window.totalEnemyMaxHp += eHp;
            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
                hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), scale: isBossMode ? 2.2 : 1, isDragon: isBossMode,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: window.classStats[blueClass].drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false,
                introState: p2Pose 
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isBossMode ? `🐉` : ((actualEnemiesCount > 1) ? `🤖 x${window.enemies.length}` : `🤖`);
        
        window.resetMatchVariables();
        window.bindAttackEvent();
    } catch(e) { console.error("Lỗi:", e); }
}

window.runTournamentMatch = function() {
    if (window.tournamentQueue.length < 2) {
        if (window.nextRoundQueue.length <= 1) {
            let champ = window.nextRoundQueue.length === 1 ? window.nextRoundQueue[0].className : "HÒA NHAU";
            alert("🏆 NHÀ VÔ ĐỊCH GIẢI ĐẤU LÀ: " + champ.toUpperCase() + " 🏆");
            window.backToMenu();
            return;
        }
        window.tournamentQueue = window.nextRoundQueue;
        window.nextRoundQueue = [];
    }

    // Tự động bốc thăm đổi bài nhạc nền khác cho trận đấu tiếp theo
    window.initBGM();

    let f1Stats = window.tournamentQueue.shift();
    let f2Stats = window.tournamentQueue.shift();

    let btnExit = document.querySelector(".control-btns .game-btn");
    if (btnExit) { btnExit.innerText = "🔙 HỦY GIẢI ĐẤU"; btnExit.style.background = "#e74c3c"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }

    window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
    window.currentWeather = window.currentMap.weather;
    let animatedTaunts = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'];

    if (typeof window.startRecording === 'function') window.startRecording();

    window.p1 = { 
        id: f1Stats.id, classId: f1Stats.classId, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
        speed: f1Stats.speed, color: f1Stats.color, hp: f1Stats.hp, maxHp: f1Stats.hp, dmgMod: f1Stats.dmgMod, scale: 1,
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: window.classStats[f1Stats.classId].drawMethod, skill: window.classStats[f1Stats.classId].skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.25, critMult: 1.5, className: f1Stats.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0,
        introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
    };

    window.enemies = [{ 
        id: f2Stats.id, classId: f2Stats.classId, isPlayer: false, x: 400, y: window.GROUND_Y, vx: 0, vy: 0, 
        speed: f2Stats.speed, color: f2Stats.color, hp: f2Stats.hp, maxHp: f2Stats.hp, dmgMod: f2Stats.dmgMod, scale: 1, isDragon: false,
        onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: window.classStats[f2Stats.classId].drawMethod, skill: window.classStats[f2Stats.classId].skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.1, critMult: 1.5, className: f2Stats.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false,
        introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
    }];
    
    window.totalEnemyMaxHp = window.enemies[0].maxHp;
    window.resetMatchVariables();
    
    let stageName = "TỨ KẾT";
    if (window.tournamentQueue.length + window.nextRoundQueue.length <= 4) stageName = "BÁN KẾT";
    if (window.tournamentQueue.length + window.nextRoundQueue.length <= 2) stageName = "CHUNG KẾT CUỐI CÙNG";
    window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 150, text: `🏆 VÒNG ${stageName} 🏆`, color: "#f1c40f", alpha: 1, vx: 0, vy: -0.5, font: "italic 900 45px Arial", life: 120 });

    window.bindAttackEvent();
}

window.resetMatchVariables = function() {
    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
    window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1;
    window.camX = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0;
    window.impactFrameTimer = 0;
    
    window.weatherParticles = []; 
    let ptCount = (window.currentWeather === 'none') ? 0 : 150;
    for(let i=0; i<ptCount; i++) { window.weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (window.currentWeather === 'rain') ? 12 + Math.random() * 10 : 2 + Math.random() * 3, size: Math.random() * 3 + 1, ang: Math.random() * Math.PI * 2 }); }
    if(typeof window.updateHPUIs === 'function') window.updateHPUIs();
}

window.bindAttackEvent = function() {
    if (!window.attackBound) {
        window.attackBound = true;
        let triggerAttack = function(e) { 
            let gScreen = document.getElementById("game-screen"); if (!gScreen || gScreen.style.display === "none") return;
            if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return;
            e.preventDefault(); 
            if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) {
                if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { window.p1.comboStep++; } else { window.p1.comboStep = 0; }
                window.p1.comboTimeout = 60; if(typeof window.attack === 'function') window.attack(window.p1, window.enemies); 
            }
        };
        window.addEventListener('touchstart', triggerAttack, {passive: false});
        window.addEventListener('mousedown', triggerAttack);
    }
}

window.checkGameOver = function() {
    if (window.matchResolved) return; let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; 
        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);

        if (window.isTournamentMode) {
            let winner = (window.p1.hp > 0) ? window.p1 : window.enemies[0];
            window.floatingTexts.push({ x: winner.x, y: winner.y - 100, text: "WINNER!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 60px Arial", life: 180 });

            let winnerStats = JSON.parse(JSON.stringify(window.classStats[winner.classId]));
            winnerStats.classId = winner.classId; winnerStats.id = winner.id; winnerStats.className = winner.className;
            window.nextRoundQueue.push(winnerStats);

            setTimeout(() => {
                if (typeof window.stopRecording === 'function') window.stopRecording();
                window.runTournamentMatch();
            }, 5000);
        } else {
            let winnerText = (window.p1.hp > 0) ? "VICTORY!" : "GAME OVER!";
            let winnerColor = (window.p1.hp > 0) ? "#2ed573" : "#ff4757";
            window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: winnerText, color: winnerColor, alpha: 1, vx: 0, vy: -0.5, font: "900 70px Arial", life: 180 });

            let btnExit = document.querySelector(".control-btns .game-btn"); 
            if (btnExit) { btnExit.innerText = "🔙 THOÁT"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
        }
    }
}

window.updateHPUIs = function() {
    if (!window.p1) return; let p1Pct = (window.p1.hp / window.p1.maxHp * 100) + "%"; let currentEnemyHp = 0; window.enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = window.totalEnemyMaxHp > 0 ? (currentEnemyHp / window.totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = window.p1.stamina + "%"; if(h6) h6.style.width = window.p1.shieldBreak + "%";
    
    // MIX NHẠC ĐỘNG NHỎ LẠI: GIẢM MAX VOLUME XUỐNG 0.03 (RẤT NHỎ, TÔN LÊN TIẾNG ĐÁNH)
    if (window.bgmBase && window.bgmClimax) {
        let isClimax = (window.p1.hp < window.p1.maxHp * 0.3) || (window.enemies[0] && window.enemies[0].hp < window.enemies[0].maxHp * 0.3);
        if (isClimax && !window.gameOver) {
            if (window.bgmBase.volume > 0.005) window.bgmBase.volume -= 0.005;
            if (window.bgmClimax.volume < 0.05) window.bgmClimax.volume += 0.005;
        } else {
            if (window.bgmBase.volume < 0.03) window.bgmBase.volume += 0.005;
            if (window.bgmClimax.volume > 0.005) window.bgmClimax.volume -= 0.005;
        }
    }

    if(typeof window.getClosestEnemy === 'function') {
        let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; }
    }
    window.checkGameOver(); 
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); 
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
    } 
}
