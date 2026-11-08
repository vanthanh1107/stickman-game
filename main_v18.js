// ==========================================
// MAIN.JS - QUẢN LÝ LUỒNG GAME 1V1 & REAL-TIME ULTIMATE (60FPS)
// ĐÃ FIX TRIỆT ĐỂ:
// 1. Bỏ đóng băng 650ms (isCinematicActive) -> Ultimate chạy Real-Time mượt 100% trên cả Web và Video TikTok.
// 2. Không đẩy trùng tên chiêu cuối (nhường cho executeUltimate của từng tướng tự hiển thị).
// 3. Dọn sạch toàn bộ mảng hiệu ứng V8.0 (Lãnh địa, Phân thân, Mưa tiền, Hố đen...) khi bắt đầu trận mới.
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
window.ultimateZoomTimeoutId = null;

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

        if (window.classStats[id].avatarUrl && typeof window.getSharedCachedImg === "function") {
            let img = window.getSharedCachedImg(window.classStats[id].avatarUrl);
            if (img) {
                window.avatarImageCache[id] = img; // Map trực tiếp id tướng -> img để frame sau O(1)
            }
        }
    }
    if (window.UniversalSkillEngine) window.UniversalSkillEngine.upgradeAllCharacters();
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
        let avatarSrc = (typeof window.resolveImageUrl === 'function')
            ? window.resolveImageUrl(item.avatarUrl)
            : (item.avatarUrl || 'character/picture/billgates.png');
        let rawFile = String(item.avatarUrl || 'billgates.png').split('/').pop().split('?')[0];
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}" onerror="if(!this._fb){this._fb=1;this.src='character/picture/${rawFile}';}else if(this._fb===1){this._fb=2;this.src='https://raw.githack.com/vanthanh1107/stickman-game/main/character/picture/${rawFile}';}" loading="lazy"></div><div class="char-name">${item.className || 'Unknown'}</div>`;
        
        card.onclick = async () => { 
            window.selectedRedClass = id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); 
            card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if (desc) desc.innerHTML = `<span>⏳ Đang tải...</span>`;
            
            await window.loadCharacterDynamic(id);
            let activeItem = window.classStats[id];
            
            if (desc) {
                let questTitle = (activeItem.quest && activeItem.quest.title) ? activeItem.quest.title : "Chinh Phục Đỉnh Cao Võ Đài";
                desc.innerHTML = `
                    <span>${activeItem.className}</span>
                    <span>❤️ <strong>${activeItem.hp || 100}</strong></span>
                    <span>⚔️ <strong>x${activeItem.dmgMod || 1}</strong></span>
                    <span>⚡ <strong>${((activeItem.speed || 5)/3).toFixed(1)}</strong></span>
                    <span style="color:#ffd700; font-weight:800;">🎯 ${questTitle}</span>
                `;
            } 
            
            window.startPreviewLoop(activeItem);
        };
        carousel.appendChild(card); 
        if (!firstCardId) { firstCardId = id; }
    }
    if (!window.selectedRedClass && firstCardId) { 
        let firstCard = carousel.querySelector(`.char-card`); 
        if (firstCard) firstCard.click(); 
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

window.cleanupCinematic = function() {
    if (window.ultimateZoomTimeoutId) {
        clearTimeout(window.ultimateZoomTimeoutId);
        window.ultimateZoomTimeoutId = null;
    }
    window.ultZoomTicks = 0;
    window.zoomPulseTicks = 0;
    window.isCinematicActive = false;
    window.targetZoom = 1.0;
};

window.backToMenu = function() { 
    if (typeof window.stopRecording === 'function') window.stopRecording();
    if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
    if (window.GoogleStoryTTS) window.GoogleStoryTTS.stop();
    window.cleanupCinematic();
    if (window.bgmBase) { window.bgmBase.pause(); window.bgmBase = null; }
    if (window.bgmClimax) { window.bgmClimax.pause(); window.bgmClimax = null; }
    let gc = document.getElementById("game-container"); if (gc) gc.classList.remove("in-battle");
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
    
    let gc = document.getElementById("game-container"); if (gc) gc.classList.add("in-battle");
    let sel = document.getElementById("selection-screen"); if (sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if (game) game.style.display = "block"; 
    window.initBGM(); 
    if (typeof window.matchStart === 'function') await window.matchStart(); 
    window.lastFrameTime = performance.now();
    window.physicsAccumulator = 0;
    if (!window.isLoopRunning) { 
        window.isLoopRunning = true; 
        requestAnimationFrame(window.gameLoop); 
    } 
};

window.matchStart = async function() {
    try {
        if (window.UniversalSkillEngine) window.UniversalSkillEngine.upgradeAllCharacters();

        let allKeys = Object.keys(window.classStats || {}); 
        if (allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { 
            window.selectedRedClass = allKeys[0]; 
        }
        
        await window.loadCharacterDynamic(window.selectedRedClass);
        let s1 = window.classStats[window.selectedRedClass];

        window.rewardMultiplier = 1;
        if (window.DanceEngine && typeof window.DanceEngine.pickRandomDances === 'function') {
            window.DanceEngine.pickRandomDances();
        }
        let tauntList = (window.DanceEngine && Array.isArray(window.DanceEngine.danceList))
            ? window.DanceEngine.danceList.slice()
            : ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex', 'cast', 'idle'];

        // 1. KHỞI TẠO NHÂN VẬT CHÍNH (P1)
        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, currentDmgMod: s1.dmgMod,
            scale: s1.scale || 1, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.10, critMult: 1.5, className: s1.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, 
            introState: tauntList[Math.floor(Math.random() * tauntList.length)],
            avatarUrl: s1.avatarUrl,
            voiceUrl: s1.voiceUrl
        };

        // 2. CHỌN NGẪU NHIÊN 1 ĐỐI THỦ DUY NHẤT (1 VS 1)
        let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)];
        if (allKeys.length > 1) {
            let tries = 0;
            while (blueClass === window.selectedRedClass && tries < 10) {
                blueClass = allKeys[Math.floor(Math.random() * allKeys.length)];
                tries++;
            }
        }
        
        await window.loadCharacterDynamic(blueClass);
        let s2 = window.classStats[blueClass];
        
        window.enemies = []; 
        window.totalEnemyMaxHp = s2.hp || 100;
        
        window.enemies.push({ 
            id: "enemy_0", classId: blueClass, isPlayer: false, x: 500, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s2.speed || 5, color: s2.color || "#1e90ff", hp: s2.hp || 100, maxHp: s2.hp || 100, 
            dmgMod: s2.dmgMod || 1, currentDmgMod: s2.dmgMod || 1, scale: s2.scale || 1, 
            onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 15), comboHits: 0, comboTimeout: 0, 
            critChance: 0.05, critMult: 1.5, className: s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, 
            introState: tauntList[Math.floor(Math.random() * tauntList.length)],
            avatarUrl: s2.avatarUrl,
            voiceUrl: s2.voiceUrl
        });
        
        // 3. CẬP NHẬT GIAO DIỆN THANH MÁU (HUD)
        let nr = document.getElementById("name-display-red");
        if (nr && window.p1) {
            let p1Av = (typeof window.resolveImageUrl === 'function')
                ? window.resolveImageUrl(window.p1.avatarUrl)
                : (window.p1.avatarUrl || "character/picture/billgates.png");
            nr.innerHTML = `<img class="hud-avatar-img" src="${p1Av}"><span>${window.p1.className || "PLAYER"}</span>`;
        }
        let nb = document.getElementById("name-display-blue");
        if (nb && window.enemies.length > 0) {
            let repE = window.enemies[0];
            let p2Av = (typeof window.resolveImageUrl === 'function')
                ? window.resolveImageUrl(repE.avatarUrl)
                : (repE.avatarUrl || "character/picture/spiderman.png");
            nb.innerHTML = `<span>${repE.className || "ENEMY"}</span><img class="hud-avatar-img" src="${p2Av}">`;
        }
        if (typeof window.fitWebHudNames === 'function') setTimeout(window.fitWebHudNames, 30);
        
        // 4. KHỞI TẠO BIẾN TRẬN ĐẤU, MÔI TRƯỜNG & TỰ ĐỘNG GHI HÌNH (ĐÃ ĐƯỢC TỐI ƯU SIÊU MƯỢT)
        window.resetMatchVariables(); 
        if (typeof window.startRecording === 'function') {
            window.startRecording();
        }
        window.bindAttackEvent();

        if (!window.updateHooked && typeof window.update === 'function') {
            window.originalEngineUpdate = window.update;
            window.update = function() {
                if (typeof window.updateGhostTrails === 'function') window.updateGhostTrails(); 
                window.originalEngineUpdate(); 
            };
            window.updateHooked = true;
        }

    } catch(e) { console.error("Lỗi khởi động trận:", e); }
};

window.setupIntroVoiceTimeline = function() {
    if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
    let p1Dur = (typeof window.getCharacterVoiceDurationMs === 'function')
        ? window.getCharacterVoiceDurationMs(window.p1, 2500)
        : 2500;
    let repE = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
    let p2Dur = (typeof window.getCharacterVoiceDurationMs === 'function')
        ? window.getCharacterVoiceDurationMs(repE, 2500)
        : 2500;
    let clashDur = 1150;
    window.introP1DurMs = p1Dur;
    window.introP2DurMs = p2Dur;
    window.introClashDurMs = clashDur;
    window.introP1EndMs = p1Dur;
    window.introP2EndMs = p1Dur + p2Dur;
    window.introDuration = p1Dur + p2Dur + clashDur;
    window.introTotalTicks = Math.ceil(window.introDuration / (1000 / 60)) + 25;
    window.introTimer = window.introTotalTicks;
    window.introStartTime = Date.now();
    window._sfxCuts = [false, false, false, false, false];
};

window.updateIntroVoiceTimeline = function(elapsedMs) {
    if (window.gameOver) return;
    let p1End = window.introP1EndMs || 2500;
    let p2End = window.introP2EndMs || 5000;
    let totalDur = window.introDuration || 6150;
    if (!window._sfxCuts) window._sfxCuts = [false, false, false, false, false];

    if (elapsedMs < p1End) {
        if (!window._sfxCuts[0]) {
            window._sfxCuts[0] = true;
            if (typeof window.playCharacterIntroVoice === 'function') {
                window.playCharacterIntroVoice(window.p1);
            }
        }
    } else if (elapsedMs < p2End) {
        if (!window._sfxCuts[1]) {
            window._sfxCuts[1] = true;
            let repE = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
            if (typeof window.playCharacterIntroVoice === 'function') {
                window.playCharacterIntroVoice(repE);
            }
        }
    } else if (elapsedMs < totalDur) {
        let clashProg = (elapsedMs - p2End) / Math.max(1, totalDur - p2End);
        if (clashProg < 0.45 && !window._sfxCuts[2]) {
            window._sfxCuts[2] = true;
            if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
            if (typeof window.playViralSfx === 'function') window.playViralSfx("countdown");
        } else if (clashProg >= 0.45 && !window._sfxCuts[3]) {
            window._sfxCuts[3] = true;
            if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
            if (typeof window.playViralSfx === 'function') window.playViralSfx("fight");
        }
    } else if (!window._sfxCuts[4]) {
        window._sfxCuts[4] = true;
        if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
    }
};

window.resetMatchVariables = function() { 
    window.cleanupCinematic();
    if (typeof window.clearAllCombatTimers === 'function') window.clearAllCombatTimers();
    if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
    if (window.GoogleStoryTTS) window.GoogleStoryTTS.stop();
    window._hudPrevVals = {};
    window._hudDirty = false;
    window._simShakeX = 0; window._simShakeY = 0;
    window._prevShakeX = 0; window._prevShakeY = 0;
    if (window.p1) window.p1.teslaCar = null;
    if (window.enemies) window.enemies.forEach(e => { if (e) e.teslaCar = null; });

    // Dọn sạch 100% mảng hiệu ứng cơ bản & các mảng Đại Chiêu Thức V8.0
    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; 
    window.slashes = []; window.shockwaves = []; window.impactSparks = []; 
    window.ghostTrails = []; window.koGhosts = []; window.hitStopFrames = 0; 
    
    window.activeDomain = null; window.phantomClones = []; window.giantDrops = [];
    window.customObjs = []; window.dimensionCracks = []; window.blackHoles = [];
    window.energyPillars = []; window.lightningArcs = []; window.auras = [];
    window.lasers = []; window.spaceRipples = []; window.lensFlares = [];
    window.activeSequences = [];
    window.cr7Balls = []; window.theRockBoulders = [];
    window.timeStopTimer = 0; window.timeStopCaster = null;
    window.invertFrames = 0; window.impactAberration = 0;

    window.shakeTime = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
    window.currentZoom = 1; window.targetZoom = 1; window.camX = 0; window.camY = 0; window.cameraTilt = 0; 
    window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; 
    window.matchResolved = false; window.gameOver = false; 
    window.isLoading = false; window.loadProgress = 100;
    window.setupIntroVoiceTimeline();
    window.matchTimer = 0; 
    window.impactFrameTimer = 0; 
    window.matchEndTimer = 0;
    
    if (typeof window.setupEnvironment === 'function') window.setupEnvironment();
    if (window.StoryDialogueEngine && typeof window.StoryDialogueEngine.initMatch === 'function') {
        window.StoryDialogueEngine.initMatch();
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
            if (window.StoryDialogueEngine && window.StoryDialogueEngine.isDialoguePausingCombat()) return;
            if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) {  
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

window.checkGameOver = function() {
    if (window.matchResolved) return; 
    let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; 
        window.gameOver = true; 
        window.cleanupCinematic();
        if (typeof window.clearAllCombatTimers === 'function') window.clearAllCombatTimers();
        window.ghostTrails = [];
        window.phantomClones = [];
        window.auras = [];
        window.impactAberration = 0;

        if (window.p1) {
            window.p1.iFrames = 0;
            window.p1.shield = 0;
            window.p1.superArmor = 0;
            window.p1.attackTrail = [];
            window.p1.teslaCar = null;
        }
        if (window.enemies) {
            window.enemies.forEach(e => {
                if (e) { e.iFrames = 0; e.shield = 0; e.superArmor = 0; e.attackTrail = []; e.teslaCar = null; }
            });
        }

        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);
        window.matchEndTimer = 0;

        let winnerName = "";
        let winnerChar = window.p1;
        let loserChar = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;

        if (window.p1.hp > 0) {
            winnerName = (window.p1.className || "PLAYER").toUpperCase();
            winnerChar = window.p1;
            loserChar = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
        } else {
            let killer = window.enemies.find(e => e.hp > 0) || window.enemies[0];
            if (killer) {
                winnerName = (killer.className || "ENEMY").toUpperCase();
                winnerChar = killer;
            }
            loserChar = window.p1;
        }

        if (window.StoryDialogueEngine && typeof window.StoryDialogueEngine.triggerFinisher === 'function') {
            window.StoryDialogueEngine.triggerFinisher(winnerChar, loserChar);
        }
        
        let finalWinnerName = "👑 " + winnerName + " WIN"; 
        let winnerColor = (window.p1.hp > 0) ? "#f1c40f" : "#ff4757"; 
        
        window.floatingTexts.push({ 
            x: winnerChar.x, 
            y: winnerChar.y - 105, 
            text: finalWinnerName, 
            color: winnerColor, 
            alpha: 1.0, 
            vx: 0, 
            vy: -0.25, 
            font: "italic 900 20px 'Arial Black', sans-serif", 
            life: 9999, 
            scale: 1.0, 
            targetScale: 1.0, 
            scaleVel: 0, 
            rot: 0, 
            noGravity: true 
        });
    }
};

window._hudDomCache = null;
window._hudPrevVals = {};

window.updateHPUIs = function() {
    if (!window.p1) return; 
    if (!window._hudDomCache || !window._hudDomCache.h1) {
        window._hudDomCache = {
            h1: document.getElementById("hp-red"),
            h2: document.getElementById("hp-red-trail"),
            h3: document.getElementById("hp-blue"),
            h4: document.getElementById("hp-blue-trail"),
            h5: document.getElementById("stamina-red"),
            h6: document.getElementById("stun-red"),
            sb: document.getElementById("stamina-blue"),
            stb: document.getElementById("stun-blue")
        };
    }

    let dom = window._hudDomCache;
    let pv = window._hudPrevVals;

    let p1Num = Math.round(Math.max(0, (window.p1.hp / window.p1.maxHp * 100)) * 5) / 5;
    let currentEnemyHp = 0; 
    for (let i = 0; i < window.enemies.length; i++) {
        if (window.enemies[i]) currentEnemyHp += Math.max(0, window.enemies[i].hp);
    }
    let p2Num = window.totalEnemyMaxHp > 0 ? (Math.round((currentEnemyHp / window.totalEnemyMaxHp * 100) * 5) / 5) : 0;

    if (pv.p1 !== p1Num) {
        pv.p1 = p1Num;
        let t = "scaleX(" + Math.max(0, Math.min(1, p1Num / 100)).toFixed(3) + ") translateZ(0)";
        if (dom.h1) dom.h1.style.transform = t;
        if (dom.h2) dom.h2.style.transform = t;
    }
    if (pv.p2 !== p2Num) {
        pv.p2 = p2Num;
        let t = "scaleX(" + Math.max(0, Math.min(1, p2Num / 100)).toFixed(3) + ") translateZ(0)";
        if (dom.h3) dom.h3.style.transform = t;
        if (dom.h4) dom.h4.style.transform = t;
    }

    let p1StamNum = Math.round((window.p1.stamina || 0) * 2) / 2;
    if (pv.s1 !== p1StamNum) {
        pv.s1 = p1StamNum;
        if (dom.h5) dom.h5.style.transform = "scaleX(" + Math.max(0, Math.min(1, p1StamNum / 100)).toFixed(3) + ") translateZ(0)";
    }

    let p1StunRaw = (window.p1.stunTimer > 0) ? Math.min(100, (window.p1.stunTimer / 85) * 100) : (window.p1.shieldBreak || 0);
    let p1StunNum = Math.round(p1StunRaw * 2) / 2;
    if (pv.st1 !== p1StunNum) {
        pv.st1 = p1StunNum;
        if (dom.h6) dom.h6.style.transform = "scaleX(" + Math.max(0, Math.min(1, p1StunNum / 100)).toFixed(3) + ") translateZ(0)";
    }
    
    if (window.bgmBase && window.bgmClimax) {
        let isIntroVoiceActive = (window.introTimer > 0 && window.introStartTime > 0 && (Date.now() - window.introStartTime) < (window.introP2EndMs || 5000));
        let isStoryVoiceActive = (window.GoogleStoryTTS && window.GoogleStoryTTS.isSpeaking()) || (window.StoryDialogueEngine && !!window.StoryDialogueEngine.activeLine);
        let isClimax = (window.p1.hp < window.p1.maxHp * 0.3) || (window.enemies[0] && window.enemies[0].hp < window.enemies[0].maxHp * 0.3);
        if (isIntroVoiceActive && !window.gameOver) {
            window.bgmBase.volume = 0.035;
            window.bgmClimax.volume = 0;
        } else if (isStoryVoiceActive && !window.gameOver) {
            // Audio Ducking khi Chị Google đang đọc thoại để giọng đọc rõ nét 100%
            if (isClimax) {
                window.bgmBase.volume = 0;
                window.bgmClimax.volume = 0.042;
            } else {
                window.bgmBase.volume = 0.032;
                window.bgmClimax.volume = 0;
            }
        } else if (isClimax && !window.gameOver) { 
            if (window.bgmBase.volume > 0) window.bgmBase.volume = Math.max(0, +(window.bgmBase.volume - 0.01).toFixed(3)); 
            if (window.bgmClimax.volume < 0.25) window.bgmClimax.volume = Math.min(0.25, +(window.bgmClimax.volume + 0.01).toFixed(3)); 
        } else { 
            if (window.bgmBase.volume < 0.15) window.bgmBase.volume = Math.min(0.15, +(window.bgmBase.volume + 0.01).toFixed(3)); 
            if (window.bgmClimax.volume > 0) window.bgmClimax.volume = Math.max(0, +(window.bgmClimax.volume - 0.01).toFixed(3)); 
        }
    }

    if (typeof window.getClosestEnemy === 'function') { 
        let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); 
        if (closestEnemy) { 
            let p2StamNum = Math.round((closestEnemy.stamina || 0) * 2) / 2;
            if (pv.s2 !== p2StamNum) {
                pv.s2 = p2StamNum;
                if (dom.sb) dom.sb.style.transform = "scaleX(" + Math.max(0, Math.min(1, p2StamNum / 100)).toFixed(3) + ") translateZ(0)";
            }
            let p2StunRaw = (closestEnemy.stunTimer > 0) ? Math.min(100, (closestEnemy.stunTimer / 85) * 100) : (closestEnemy.shieldBreak || 0);
            let p2StunNum = Math.round(p2StunRaw * 2) / 2;
            if (pv.st2 !== p2StunNum) {
                pv.st2 = p2StunNum;
                if (dom.stb) dom.stb.style.transform = "scaleX(" + Math.max(0, Math.min(1, p2StunNum / 100)).toFixed(3) + ") translateZ(0)";
            }
        } 
    }
    window.checkGameOver(); 
};

window.playerBlock = function() {
    if (!window.p1 || window.p1.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (window.p1.hitStun > 0 || window.p1.stunTimer > 0) return; 
    
    window.p1.state = 'block';
    window.p1.attackTimer = 40; 
    window.p1.vx = 0; 
    if (typeof window.spawnParticles === 'function') window.spawnParticles(window.p1.x, window.p1.y - 20, "#3498db");
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

// ==========================================
// REAL-TIME ULTIMATE (KHÔNG ĐÓNG BĂNG GAME, ZOOM TRỰC TIẾP TRÊN CANVAS, KHÔNG TRÙNG TÊN SKILL)
// ==========================================
window.useUltimate = function(caster, target) {
    if (!caster || caster.hp <= 0 || window.gameOver) return;
    if (caster.hitStun > 0 || caster.stunTimer > 0) return;
    if (!target || target.hp <= 0) return;

    caster.stamina = 0; 
    caster.vx = 0; 
    caster.isFacingRight = (target.x >= caster.x);
    caster.superArmor = 45; // Kháng gián đoạn trong lúc đang tung chiêu cuối

    // Phóng to mượt trực tiếp trên Camera của Canvas (đồng bộ theo physics tick 60Hz, không phụ thuộc setTimeout!)
    if (window.ultimateZoomTimeoutId) {
        clearTimeout(window.ultimateZoomTimeoutId);
        window.ultimateZoomTimeoutId = null;
    }
    window.isCinematicActive = true;
    window.ultZoomTicks = 42;
    window.targetZoom = 1.16;

    // Tạo hạt năng lượng tụ lực quanh người
    for (let i = 0; i < 10; i++) {
        if (typeof window.spawnParticles === 'function') {
            window.spawnParticles(caster.x + (Math.random() - 0.5) * 55, caster.y - 40 + (Math.random() - 0.5) * 55, caster.color || "#f1c40f", true);
        }
    }
    if (typeof window.spawnAura === 'function') {
        window.spawnAura(caster.x, window.GROUND_Y, caster.color || "#f1c40f", 70, 22);
    }

    let dmgFactor = caster.currentDmgMod || caster.dmgMod || 1;
    let baseDmg = (caster.isPlayer ? 50 : 38) * dmgFactor; 
    let charDef = window.classStats ? (window.classStats[caster.classId] || window.classStats[(caster.classId || "").toLowerCase()]) : null;

    // Ghi nhớ số chữ nổi hiện có để đánh dấu tên tuyệt kỹ do executeUltimate tạo ra (vẽ đẹp hơn ở engine_rend)
    if (!window.floatingTexts) window.floatingTexts = [];
    let ftStart = window.floatingTexts.length;

    // GỌI THẲNG EXECUTEULTIMATE NGAY LẬP TỨC (Không chờ 650ms và không đẩy trùng floatingText)
    if (charDef && typeof charDef.executeUltimate === 'function') {
        charDef.executeUltimate(caster, target, baseDmg);
    } else if (window.UniversalSkillEngine) {
        let promptText = (charDef && (charDef.skillPrompt || charDef.ultimateDescription)) || "";
        let skillName = (charDef && charDef.skill && charDef.skill.name) || "TUYỆT KỸ";
        window.UniversalSkillEngine.executeFromDescription(caster, target, baseDmg, promptText, skillName);
    } else {
        caster.state = 'punch'; 
        caster.attackTimer = 30;
        caster.vx = caster.isFacingRight ? 10 : -10;
    }

    // Đánh dấu tên tuyệt kỹ (vẫn hiện trên đầu nhân vật như trước, chỉ đổi phong cách hiển thị)
    for (let i = ftStart; i < window.floatingTexts.length; i++) {
        let ft = window.floatingTexts[i];
        if (!ft) continue;
        ft.isSkillTitle = true;
        ft.skillColor = ft.color || caster.color || "#00f3ff";
        ft.age = 0;
        ft.vy = Math.max(ft.vy || 0, -0.9);
        ft.life = Math.max(ft.life || 0, 60);
    }
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
        color: charStats.color || "#00f3ff",
        state: 'idle', attackTimer: 0, isFacingRight: true, onGround: true, hp: 100, maxHp: 100, iFrames: 0,
        drawMethod: charStats.drawMethod
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
    if (ctx && !ctx._fastGlowInstalled && typeof window.installFastGlowContext === 'function') {
        window.installFastGlowContext(ctx);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let p = window.previewFighter;
    if (!p) return;

    if (p.attackTimer > 0) p.attackTimer--;
    if (p.attackTimer <= 0) {
        let taunts = ['idle', 'taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex', 'punch', 'high_kick', 'uppercut'];
        if (window.DanceEngine && window.DanceEngine.danceList) {
            taunts = taunts.concat(window.DanceEngine.danceList);
        }
        p.state = taunts[Math.floor(Math.random() * taunts.length)];
        p.attackTimer = Math.floor(Math.random() * 60) + 50; 
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 30); 
    if (typeof window.drawStickman === 'function') window.drawStickman(ctx, p);
    ctx.restore();

    window.previewAnimId = requestAnimationFrame(window.previewLoop);
};

window.spawnDamageText = function(x, y, damage, isCrit) {
    if (!window.floatingTexts) window.floatingTexts = [];
    let d = Math.round(damage);
    window.floatingTexts.push({ 
        x: x + (Math.random() * 24 - 12), 
        y: y - 55, 
        text: isCrit ? `💥-${d}` : `-${d}`, 
        color: isCrit ? "#ff9f43" : "#ffffff", 
        font: isCrit ? "bold 18px Arial, sans-serif" : "bold 15px Arial, sans-serif",
        scale: 1.0, 
        targetScale: 1.0, 
        scaleVel: 0, 
        rot: 0,
        alpha: 1, 
        vx: (Math.random() - 0.5) * 2.5, 
        vy: -3.5,    
        life: 32 
    });
};

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
