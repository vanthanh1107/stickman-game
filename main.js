// ==========================================
// MAIN.JS - BỔ SUNG LAZY LOADING (PREFIX CHAR_) & TỰ ĐỘNG HÓA TUYỆT CHIÊU
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

window.BUFF_POOL = [
    { id: 'heal', name: '💊 BÌNH MÁU MA THUẬT', desc: 'Hồi phục ngay 50% HP tối đa.', color: '#2ecc71', action: (p) => { p.hp = Math.min(p.maxHp, p.hp + p.maxHp * 0.5); } },
    { id: 'maxhp', name: '❤️ THỂ CHẤT TITAN', desc: 'Tăng 30% Máu tối đa vĩnh viễn.', color: '#e74c3c', action: (p) => { let gain = p.maxHp * 0.3; p.maxHp += gain; p.hp += gain; } },
    { id: 'dmg', name: '⚔️ CUỒNG NỘ CHIẾN THẦN', desc: 'Tăng 30% Sát thương đòn đánh.', color: '#f39c12', action: (p) => { p.dmgMod *= 1.3; } },
    { id: 'speed', name: '⚡ BƯỚC CHÂN PHONG THẦN', desc: 'Tăng 30% Tốc độ di chuyển.', color: '#3498db', action: (p) => { p.speed *= 1.3; } },
    { id: 'regen', name: '🔋 NỘI TẠI VÔ HẠN', desc: 'Tăng mạnh tốc độ hồi Thể Lực.', color: '#9b59b6', action: (p) => { p.regen = (p.regen || 0.4) + 0.3; } }
];

document.addEventListener("click", function(e) {
    let target = e.target.closest("button, a, div"); if (!target) return;
    let txt = target.innerText.toUpperCase(); let id = (target.id || "").toUpperCase(); let cls = (target.className || "").toUpperCase();
    if (target.closest("#game-screen") && (txt.includes("THOÁT") || txt.includes("BACK") || id.includes("BACK") || id.includes("EXIT") || cls.includes("BACK") || cls.includes("EXIT"))) {
        if (!cls.includes("SKILL") && !id.includes("SKILL")) { e.preventDefault(); window.backToMenu(); }
    }
});

// ==========================================
// HỆ THỐNG LAZY LOADING TỪ FILE CÙNG THƯ MỤC (char_*.js)
// ==========================================
window.loadedCharacters = {}; // Bộ nhớ đệm

window.loadCharacterDynamic = function(charId) {
    return new Promise((resolve) => {
        if (window.loadedCharacters[charId]) return resolve(window.loadedCharacters[charId]);

        let script = document.createElement("script");
        let ts = Math.floor(new Date().getTime() / 60000); 
        
        // SỬA LẠI: Lấy trực tiếp từ raw.githack để đảm bảo 100% không bị sai thư mục
        script.src = `https://raw.githack.com/vanthanh1107/stickman-game/main/char_${charId}.js?v=${ts}`; 
        
        script.onload = () => {
            if (window.currentLoadedChar) {
                window.loadedCharacters[charId] = window.currentLoadedChar;
                
                if (!window.classStats[charId]) window.classStats[charId] = {};
                
                let sheetHp = window.classStats[charId].hp;
                let sheetSpeed = window.classStats[charId].speed;
                let sheetDmgMod = window.classStats[charId].dmgMod;
                let sheetClassName = window.classStats[charId].className;
                let sheetAvatarUrl = window.classStats[charId].avatarUrl;

                Object.assign(window.classStats[charId], window.currentLoadedChar);

                if(sheetHp) window.classStats[charId].hp = sheetHp;
                if(sheetSpeed) window.classStats[charId].speed = sheetSpeed;
                if(sheetDmgMod) window.classStats[charId].dmgMod = sheetDmgMod;
                if(sheetClassName) window.classStats[charId].className = sheetClassName;
                if(sheetAvatarUrl) window.classStats[charId].avatarUrl = sheetAvatarUrl;

                window.currentLoadedChar = null; 
                resolve(window.loadedCharacters[charId]);
            } else {
                resolve(null);
            }
        };

        script.onerror = () => {
            console.error("Cảnh báo: Không tìm thấy file nhân vật: char_" + charId + ".js");
            resolve(null);
        };
        document.head.appendChild(script);
    });
};

window.initGame = async function() {
    window.classStats = {
        "dausi": { className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf" },
        "satthu": { className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf" },
        "phapsu": { className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf" },
        "hove": { className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf" },
        "thichkhach": { className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf" }
    };

    try {
        let response = await fetch(window.GOOGLE_SHEET_URL);
        if(response.ok) {
            let csvText = await response.text(); let rows = csvText.split('\n');
            for (let i = 1; i < rows.length; i++) {
                let rowText = rows[i] ? rows[i].trim() : ""; if (rowText === "") continue;
                let cols = rowText.split(','); let id = cols[0] ? cols[0].trim().toLowerCase() : "";
                if (id !== "") {
                    if (!window.classStats[id]) window.classStats[id] = { hp: 1000, speed: 5, dmgMod: 1 };
                    if (cols[1] && cols[1].trim() !== "") window.classStats[id].className = cols[1].trim();
                    for(let c=2; c<cols.length; c++) { if (cols[c] && cols[c].includes("http")) { window.classStats[id].avatarUrl = cols[c].trim().replace(/\r/g, ''); break; } }
                }
            }
        }
    } catch(e) {}
    window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    if (!window.classStats || Object.keys(window.classStats).length === 0) { carousel.innerHTML = "<div style='color:red; font-weight:bold; padding:20px;'>LỖI TẢI NHÂN VẬT!</div>"; return; }
    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        card.innerHTML = `<div class="char-avatar"><img src="${item.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/png?seed=error'}"></div><div class="char-name">${item.className || 'Unknown'}</div>`;
        card.onclick = () => { 
            window.selectedRedClass = id; document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>💨 Tốc: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Công: <strong>x${item.dmgMod}</strong></span>`; 
        };
        carousel.appendChild(card); if (!firstCardId) { firstCardId = id; }
    }
    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }

    let selScreen = document.getElementById("selection-screen");
    let enemySelect = document.getElementById("enemy-count-select");
    if (enemySelect && !enemySelect.querySelector("option[value='97']")) {
        enemySelect.innerHTML += `
            <option value="98">🥋 Đánh Boss Lý Tiểu Long</option>
            <option value="97">🗡️ Đánh Boss Samurai</option>
            <option value="96">🥷 Đánh Boss Ninja</option>
        `;
    }

    if (selScreen && !document.getElementById("btn-tower")) {
        let startBtnContainer = document.querySelector("#selection-screen .control-btns");
        if (!startBtnContainer) { let sBtn = document.querySelector("#selection-screen button[onclick*='startGame']"); if (sBtn) startBtnContainer = sBtn.parentNode; }
        if (startBtnContainer) {
            let tBtn = document.createElement("button"); tBtn.id = "btn-tower"; tBtn.innerText = "🏰 LEO THÁP TỬ CHIẾN"; tBtn.className = "game-btn";
            tBtn.style.cssText = "background: linear-gradient(45deg, #8e44ad, #9b59b6); color: #fff; padding: 12px 20px; font-weight: 900; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-left: 10px; box-shadow: 0 4px 15px rgba(142,68,173,0.4); text-transform: uppercase;";
            tBtn.onclick = () => window.startTowerMode();
            startBtnContainer.appendChild(tBtn);
        }
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
    let towerDiv = document.getElementById("tower-screen"); if (towerDiv) towerDiv.style.display = "none";
    let buffDiv = document.getElementById("buff-screen"); if (buffDiv) buffDiv.style.display = "none";
    window.gameOver = true; window.isLoopRunning = false; if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.startGame = async function() { 
    if(!window.selectedRedClass) return; window.isTowerMode = false;
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    window.initBGM(); 
    if(typeof window.matchStart === 'function') await window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.matchStart = async function() {
    try {
        let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { window.selectedRedClass = allKeys[0]; }
        
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
            
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; 
            if(isBossMode) hpMultiplier = 12.0;

            let bossColor = "#1e90ff"; let bossScale = 1; let bossName = s2.className;
            if(isDragonBoss) { bossColor = "#e74c3c"; bossScale = 2.2; bossName = "Ác Long"; }
            else if(isBruceLeeBoss) { bossColor = "#f1c40f"; bossScale = 1.75; bossName = "Lý Tiểu Long"; }
            else if(isSamuraiBoss) { bossColor = "#e74c3c"; bossScale = 1.8; bossName = "Thánh Kiếm Samurai"; }
            else if(isNinjaBoss) { bossColor = "#8e44ad"; bossScale = 1.6; bossName = "Sát Thủ Ninja"; }

            let eHp = Math.floor(s2.hp * hpMultiplier); window.totalEnemyMaxHp += eHp;
            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: s2.speed * (isBossMode ? 0.8 : (0.8 + Math.random()*0.4)), 
                color: bossColor, hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), scale: bossScale, 
                isDragon: isDragonBoss, isBruceLee: isBruceLeeBoss, isSamurai: isSamuraiBoss, isNinja: isNinjaBoss,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.05, critMult: 1.5, className: isBossMode ? bossName : s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, 
                introState: tauntList[Math.floor(Math.random() * tauntList.length)]
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isDragonBoss ? "🐉" : (isBruceLeeBoss ? "🥋" : (isSamuraiBoss ? "🗡️" : (isNinjaBoss ? "🥷" : `🤖`)));
        
        window.resetMatchVariables(); window.bindAttackEvent();
    } catch(e) { console.error("Lỗi khởi động trận:", e); }
}

window.startTowerMode = function() {
    if(!window.selectedRedClass) return; window.isTowerMode = true; window.towerFloor = 1;
    let stat = JSON.parse(JSON.stringify(window.classStats[window.selectedRedClass])); stat.classId = window.selectedRedClass; stat.id = "PLAYER_HERO"; window.towerPlayer = stat; 
    window.showTowerUI(); if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.showTowerUI = function() {
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let buffUI = document.getElementById("buff-screen"); if(buffUI) buffUI.style.display = "none"; 
    let towerDiv = document.getElementById("tower-screen");
    if (!towerDiv) { towerDiv = document.createElement("div"); towerDiv.id = "tower-screen"; towerDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(to bottom, #111, #2c3e50); color:#fff; z-index:9999; display:flex; flex-direction:column; align-items:center; padding:20px; overflow:auto; box-sizing: border-box; font-family: Arial, sans-serif;"; document.body.appendChild(towerDiv); }
    towerDiv.style.display = "flex";
    let isBoss = window.towerFloor === 10;
    
    let html = `<h1 style="color:#9b59b6; text-shadow: 0 4px 10px rgba(155,89,182,0.5); margin: 0 0 10px 0; text-transform:uppercase; font-style:italic;">🏰 THÁP TỬ CHIẾN 🏰</h1>
                <p style="color:#bdc3c7; font-size:14px; margin-top:0;">Hành trình sinh tồn khắc nghiệt không hồi máu!</p>
                <div style="background:#2f3542; padding:15px; border-radius:10px; border:2px solid #57606f; width:100%; max-width:400px; display:flex; flex-direction:column; gap:10px; margin-bottom:20px; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:16px;">
                        <span style="color:#f1c40f;">👤 ${window.towerPlayer.className}</span>
                        <span style="color:#e74c3c;">TẦNG ${window.towerFloor} / 10</span>
                    </div>
                    <div style="width:100%; background:#111; height:15px; border-radius:10px; border:1px solid #747d8c; overflow:hidden;">
                        <div style="width:${(window.towerPlayer.hp / window.towerPlayer.maxHp) * 100}%; background:linear-gradient(90deg, #c0392b, #ff4757); height:100%;"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:#bdc3c7;">
                        <span>❤️ ${Math.floor(window.towerPlayer.hp)} / ${Math.floor(window.towerPlayer.maxHp)}</span>
                        <span>⚔️ x${window.towerPlayer.dmgMod.toFixed(1)} | ⚡ ${(window.towerPlayer.speed/3).toFixed(1)}</span>
                    </div>
                </div>
                <div style="border: 4px solid ${isBoss ? '#f1c40f' : '#3498db'}; background: rgba(0,0,0,0.6); border-radius:15px; padding:30px; text-align:center; box-shadow: 0 0 30px ${isBoss ? 'rgba(241,196,15,0.4)' : 'rgba(52,152,219,0.4)'}; margin-bottom:30px;">
                    <div style="font-size:50px; margin-bottom:10px;">${isBoss ? '👑' : '🦹'}</div>
                    <div style="color:${isBoss ? '#f1c40f' : '#3498db'}; font-weight:900; font-size:24px; text-transform:uppercase;">
                        ${isBoss ? 'TỨ ĐẠI ÁC BOSS TẦNG ĐỈNH' : 'ĐỘI QUÂN HỘC MÁU'}
                    </div>
                    <div style="color:#7f8c8d; font-size:14px; margin-top:5px;">SỐ LƯỢNG ĐỊCH: ${isBoss ? '1 (BOSS NGẪU NHIÊN)' : Math.ceil(window.towerFloor / 3)}</div>
                </div>
                <div style="display:flex; gap:15px;">
                    <button onclick="window.playNextTowerMatch()" style="background:linear-gradient(45deg, #e74c3c, #c0392b); color:#fff; font-size:18px; font-weight:900; padding:15px 40px; border:none; border-radius:30px; cursor:pointer; box-shadow: 0 5px 15px rgba(231,76,60,0.4);">⚔️ CHIẾN ĐẤU</button>
                    <button onclick="window.backToMenu()" style="background:#7f8c8d; color:#fff; font-size:16px; font-weight:bold; padding:15px 20px; border:none; border-radius:30px; cursor:pointer;">🔙 ĐẦU HÀNG</button>
                </div>`;
    towerDiv.innerHTML = html;
};

window.playNextTowerMatch = async function() {
    let towerDiv = document.getElementById("tower-screen"); if (towerDiv) towerDiv.style.display = "none";
    let game = document.getElementById("game-screen"); if (game) game.style.display = "block";
    window.initBGM(); window.currentMap = window.MAPS[Math.min(window.towerFloor, window.MAPS.length - 1)]; window.currentWeather = window.currentMap.weather;
    if (typeof window.startRecording === 'function') window.startRecording();

    let tauntList = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex', 'cast', 'idle'];

    await window.loadCharacterDynamic(window.towerPlayer.classId);
    let loadedDrawMethod = window.classStats[window.towerPlayer.classId].drawMethod;
    let loadedSkill = window.classStats[window.towerPlayer.classId].skill || {};

    let p = window.towerPlayer;
    window.p1 = { 
        id: p.id, classId: p.classId, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, speed: p.speed, color: p.color, hp: p.hp, maxHp: p.maxHp, dmgMod: p.dmgMod, scale: 1, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: loadedDrawMethod, skill: loadedSkill, regen: p.regen || 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, critChance: 0.10, critMult: 1.5, className: p.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, 
        introState: tauntList[Math.floor(Math.random() * tauntList.length)]
    };

    window.enemies = []; window.totalEnemyMaxHp = 0;
    let allKeys = Object.keys(window.classStats || {});
    let isBossMode = window.towerFloor === 10;
    let actualEnemiesCount = isBossMode ? 1 : Math.ceil(window.towerFloor / 3);

    for(let i = 0; i < actualEnemiesCount; i++) {
        let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; 
        
        await window.loadCharacterDynamic(blueClass);
        let s2 = window.classStats[blueClass];
        
        let hpMultiplier = (actualEnemiesCount > 1) ? 0.6 : 1.0; 
        
        let rollBoss = Math.random();
        let isDragonBoss = isBossMode && rollBoss < 0.25;
        let isBruceLeeBoss = isBossMode && rollBoss >= 0.25 && rollBoss < 0.5;
        let isSamuraiBoss = isBossMode && rollBoss >= 0.5 && rollBoss < 0.75;
        let isNinjaBoss = isBossMode && rollBoss >= 0.75;

        if(isBossMode) hpMultiplier = 16.0; else hpMultiplier += (window.towerFloor * 0.15); 

        let bossColor = "#1e90ff"; let bossScale = 1; let bossName = s2.className;
        if(isDragonBoss) { bossColor = "#e74c3c"; bossScale = 2.5; bossName = "Ác Long Vương"; }
        else if(isBruceLeeBoss) { bossColor = "#f1c40f"; bossScale = 1.75; bossName = "Võ Sư Lý Tiểu Long"; }
        else if(isSamuraiBoss) { bossColor = "#e74c3c"; bossScale = 1.8; bossName = "Kiếm Khách Samurai"; }
        else if(isNinjaBoss) { bossColor = "#8e44ad"; bossScale = 1.6; bossName = "Sát Thủ Ninja"; }

        window.enemies.push({ 
            id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s2.speed * (isBossMode ? 0.8 : (0.8 + Math.random()*0.4)), 
            color: bossColor, hp: Math.floor(s2.hp * hpMultiplier), maxHp: Math.floor(s2.hp * hpMultiplier), dmgMod: s2.dmgMod * (isBossMode ? 3.0 : (1 + window.towerFloor * 0.1)), scale: bossScale, 
            isDragon: isDragonBoss, isBruceLee: isBruceLeeBoss, isSamurai: isSamuraiBoss, isNinja: isNinjaBoss,
            onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, critChance: 0.05, critMult: 1.5, className: isBossMode ? bossName : s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, 
            introState: tauntList[Math.floor(Math.random() * tauntList.length)]
        });
        window.totalEnemyMaxHp += Math.floor(s2.hp * hpMultiplier);
    }

    let nb = document.getElementById("name-display-blue");
    if(nb) nb.innerText = isBossMode ? "👑" : `🤖`;
    window.resetMatchVariables();
    window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 150, text: isBossMode ? "🔥 ĐỈNH THÁP - TRẬN CHIẾN CUỐI CÙNG 🔥" : `TẦNG THỨ ${window.towerFloor}`, color: "#9b59b6", alpha: 1, vx: 0, vy: -0.5, font: "italic 900 45px Arial", life: 120 });
    window.bindAttackEvent();
}

window.showBuffSelectionUI = function() {
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let buffDiv = document.getElementById("buff-screen");
    if (!buffDiv) { buffDiv = document.createElement("div"); buffDiv.id = "buff-screen"; buffDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); color:#fff; z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing: border-box; font-family: Arial, sans-serif;"; document.body.appendChild(buffDiv); }
    buffDiv.style.display = "flex";
    let shuffled = [...window.BUFF_POOL].sort(() => 0.5 - Math.random()); let options = shuffled.slice(0, 3);
    let html = `<h1 style="color:#f1c40f; text-shadow: 0 0 15px #f1c40f; text-transform:uppercase; font-size:40px; margin-bottom:10px;">🎉 CLEAR TẦNG ${window.towerFloor}! 🎉</h1><p style="color:#bdc3c7; font-size:18px; margin-bottom:40px;">Hãy chọn 1 Thẻ Bài Ma Thuật để cường hóa bản thân:</p><div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">`;
    options.forEach((buff) => { html += `<div onclick="window.applyBuff('${buff.id}')" style="background:linear-gradient(180deg, #2f3542, #111); border: 3px solid ${buff.color}; border-radius:15px; width:220px; padding:30px 20px; text-align:center; cursor:pointer; transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 15px 40px ${buff.color}88';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.8)';"><div style="font-size:40px; margin-bottom:15px;">${buff.name.split(' ')[0]}</div><div style="color:${buff.color}; font-weight:900; font-size:20px; margin-bottom:15px;">${buff.name.substring(buff.name.indexOf(' ')+1)}</div><div style="color:#bdc3c7; font-size:14px; line-height:1.5;">${buff.desc}</div></div>`; });
    html += `</div>`; buffDiv.innerHTML = html;
};

window.applyBuff = function(buffId) { let buff = window.BUFF_POOL.find(b => b.id === buffId); if (buff) { buff.action(window.towerPlayer); } window.towerFloor++; let buffDiv = document.getElementById("buff-screen"); if(buffDiv) buffDiv.style.display = "none"; window.showTowerUI(); }

window.resetMatchVariables = function() { 
    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = []; window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1; window.camX = 0; window.camY = 0; window.cameraTilt = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0; window.impactFrameTimer = 0; window.weatherParticles = []; 
    window.endIconType = ""; window.matchEndTimer = 0;
    let ptCount = (window.currentWeather === 'none') ? 0 : 150; for(let i=0; i<ptCount; i++) { window.weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (window.currentWeather === 'rain') ? 12 + Math.random() * 10 : 2 + Math.random() * 3, size: Math.random() * 3 + 1, ang: Math.random() * Math.PI * 2 }); } if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.bindAttackEvent = function() { if (!window.attackBound) { window.attackBound = true; let triggerAttack = function(e) { let gScreen = document.getElementById("game-screen"); if (!gScreen || gScreen.style.display === "none") return; if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return; e.preventDefault(); if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) { if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { window.p1.comboStep++; } else { window.p1.comboStep = 0; } window.p1.comboTimeout = 60; if(typeof window.attack === 'function') window.attack(window.p1, window.enemies); } }; window.addEventListener('touchstart', triggerAttack, {passive: false}); window.addEventListener('mousedown', triggerAttack); } }

window.checkGameOver = function() {
    if (window.matchResolved) return; let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);
        
        window.endIconType = (window.p1.hp > 0) ? 'win' : 'lose';
        window.matchEndTimer = 0;

        if (window.isTowerMode) {
            if (window.p1.hp > 0) {
                window.towerPlayer.hp = window.p1.hp;
                if (window.towerFloor >= 10) {
                    window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: "🎉 CLEAR THÁP THÀNH CÔNG! 🎉", color: "#f1c40f", alpha: 1, vx: 0, vy: -0.5, font: "900 60px Arial", life: 180 });
                    setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); alert("BẠN ĐÃ PHÁ ĐẢO THÁP THÀNH CÔNG!"); window.backToMenu(); }, 5000);
                } else {
                    window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 100, text: "QUA TẦNG!", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 60px Arial", life: 180 });
                    setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); window.showBuffSelectionUI(); }, 4000);
                }
            } else {
                window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: "💀 RỚT THÁP 💀", color: "#e74c3c", alpha: 1, vx: 0, vy: -0.5, font: "900 70px Arial", life: 180 });
                setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); alert("ĐÃ TỬ TRẬN TẠI TẦNG " + window.towerFloor); window.backToMenu(); }, 4000);
            }
        } else {
            let winnerText = (window.p1.hp > 0) ? "VICTORY!" : "GAME OVER!"; let winnerColor = (window.p1.hp > 0) ? "#2ed573" : "#ff4757";
            window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: winnerText, color: winnerColor, alpha: 1, vx: 0, vy: -0.5, font: "900 70px Arial", life: 180 });
        }
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

// ==========================================
// HỆ THỐNG TUYỆT CHIÊU THÔNG MINH - ĐỌC TỪ FILE CHAR_*.JS
// ==========================================
window.useUltimate = function(caster, target) {
    if (!caster || caster.hp <= 0 || window.gameOver || window.introTimer > 0) return;
    if (caster.hitStun > 0 || caster.stunTimer > 0) return;
    if (!target || target.hp <= 0) return;

    // Rút sạch thể lực để tung chiêu
    caster.stamina = 0;
    
    if(typeof window.playSound === 'function') window.playSound(400, 'sine', 0.5, 0.6);
    if(typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);
    if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x, caster.y, "#f1c40f", true);
    
    let ultText = caster.isPlayer ? "🔥 ULTIMATE!" : "⚠️ DANGER!";
    let ultColor = caster.isPlayer ? "#ff4757" : "#ff0000";
    window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: ultText, color: ultColor, alpha: 1, vx: 0, vy: -3, font: "900 35px Arial", life: 50 });

    // Tính toán góc nhìn và sát thương
    let dist = target.x - caster.x;
    caster.isFacingRight = dist > 0;
    
    let baseDmg = 50 * (caster.currentDmgMod || 1); 
    if (!caster.isPlayer) baseDmg = 35 * (caster.currentDmgMod || 1); 

    // GỌI HÀM TUYỆT CHIÊU TỪ FILE NHÂN VẬT ĐÃ ĐƯỢC LOAD
    let charDef = window.classStats[caster.classId];
    if (charDef && typeof charDef.executeUltimate === 'function') {
        charDef.executeUltimate(caster, target, baseDmg);
    } else {
        // Fallback an toàn nếu nhân vật chưa có tuyệt chiêu riêng
        caster.state = 'punch'; 
        caster.attackTimer = 30;
        caster.vx = caster.isFacingRight ? 5 : -5;
    }
}

window.playerUseSkill = function() {
    let target = null;
    if(typeof window.getClosestEnemy === 'function') target = window.getClosestEnemy(window.p1, window.enemies);
    window.useUltimate(window.p1, target);
}


// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA TRUNG TÂM HOÀN CHỈNH 2.0
// KHUNG XƯƠNG HOẠT ẢNH, NỘI SUY MMA & ĐỒ HỌA ĐỘC QUYỀN BOSS
// ==========================================

// 1. HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG TOÀN CỤC
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
    let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
    let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
    let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
    
    let t = Date.now() / 150; 

    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
    else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
    else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
    else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
    else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } 
    else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } 
    else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } 
    else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
    
    else if (p.state === 'taunt_crane') { head.y += Math.sin(t)*2; footR = {x: -5, y: -25}; kneeR = {x: 15, y: -20}; footL = {x: 0, y: 0}; kneeL = {x: -10, y: -10}; handL = {x: -30, y: -60 + Math.sin(t)*5}; elbowL = {x: -15, y: -50}; handR = {x: 30, y: -60 - Math.sin(t)*5}; elbowR = {x: 15, y: -50}; }
    else if (p.state === 'taunt_power') { let shake = Math.random()*2 - 1; head.x += shake; head.y = -50 + shake; pelvis.y = -10; footL = {x: -20, y: 0}; kneeL = {x: -25, y: -10}; footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10}; handL = {x: -15, y: -40}; elbowL = {x: -25, y: -30}; handR = {x: 15, y: -40}; elbowR = {x: 25, y: -30}; if(Math.random()<0.2 && window.particles){ window.particles.push({x: p.x+(Math.random()-0.5)*30, y: window.GROUND_Y, vx: 0, vy: -Math.random()*4, life: 15, maxLife: 15, color: p.color||"#f1c40f", size: 2}); } }
    else if (p.state === 'taunt_dance') { let swing = Math.sin(t * 2) * 20; let hip = Math.cos(t * 2) * 10; pelvis.x = hip; head.x = -hip/2; handL = {x: -15 + swing, y: -30}; elbowL = {x: -20 + swing, y: -40}; handR = {x: 15 + swing, y: -30}; elbowR = {x: 20 + swing, y: -40}; }
    else if (p.state === 'taunt_point') { head.x = 5; handR = {x: 35, y: -40 + Math.sin(t)*2}; elbowR = {x: 20, y: -40}; handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; }
    else if (p.state === 'taunt_flex') { head.y = -55 + Math.sin(t)*2; pelvis.y = -20; handL = {x: -20, y: -55}; elbowL = {x: -30, y: -45}; handR = {x: 20, y: -55}; elbowR = {x: 30, y: -45}; }

    return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
};

// 2. HÀM CHỦ LỰC VẼ STICKMAN (GỌI TỪ ENGINE_V2.JS)
window.drawStickman = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = "#fff"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : (p.color || "#fff"); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    
    // Đồng bộ frame toán học đòn đánh với engine
    let maxT = 15;
    if (p.state === 'jab') maxT = 10; 
    else if (p.state === 'cross' || p.state === 'hook') maxT = 14; 
    else if (p.state === 'low_kick' || p.state === 'teep_kick') maxT = 16; 
    else if (p.state === 'backfist' || p.state === 'spinning_backfist' || p.state === 'elbow_strike' || p.state === 'palm_strike') maxT = 18; 
    else if (p.state === 'shoulder_bash' || p.state === 'knee_strike' || p.state === 'flying_knee' || p.state === 'superman_punch') maxT = 20; 
    else if (p.state === 'high_kick' || p.state === 'spinning_heel') maxT = 22; 
    else if (p.state === 'uppercut' || p.state === 'tornado_kick') maxT = 24; 
    else if (p.state === 'axe_kick') maxT = 26; 
    else if (p.state === 'dragon_uppercut') maxT = 35; 
    else if (p.state === 'machine_gun_punches') maxT = 60; 
    else if (p.state === 'one_inch_punch') maxT = 38; 
    else if (p.state === 'asura_strike') maxT = 35; 
    else if (p.state === 'cast') maxT = 45; 
    else if (p.state === 'dash' || p.state === 'dash_back') maxT = 15; 
    else if (p.state === 'dempsey_roll') maxT = 30;
    
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; if (progress > 0) { if (progress < 0.3) ext = Math.sin((progress / 0.3) * (Math.PI / 2)); else ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); }
    let pext = (progress > 0.5) ? (1 - progress)*2 : progress*2;

    let customDrawSuccess = false;
    
    // NẾU LÀ NHÂN VẬT ĐÃ LOAD TỪ FILE CHAR_*.JS -> GỌI HÀM VẼ CỦA NÓ
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let oldState = p.state;
        let passedExt = ext;
        let passedPext = pext;

        if (p.state === 'machine_gun_punches') {
            p.state = 'punch';
            let multiProgress = (progress * 5) % 1; 
            passedExt = Math.sin(multiProgress * Math.PI);
            passedPext = passedExt;
        } else if (p.state === 'asura_strike') {
            p.state = 'punch';
            passedExt = progress < 0.2 ? 0 : (progress > 0.8 ? 0 : 1);
            passedPext = passedExt;
        } else if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'one_inch_punch', 'dempsey_roll'].includes(p.state)) {
            p.state = 'punch';
        } else if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(p.state)) {
            p.state = 'kick';
        }

        try { 
            p.drawMethod(ctx, p, bounce, passedExt, passedPext, isTrail); 
            customDrawSuccess = true; 
        } catch (e) {
            console.error("Lỗi vẽ nhân vật tùy chỉnh, chuyển sang vẽ dự phòng:", e);
        } finally { 
            p.state = oldState; 
        }
    }

    // NẾU CHƯA LOAD ĐƯỢC FILE NHÂN VẬT TÙY CHỈNH -> VẼ KHUNG MẶC ĐỊNH CHỐNG TÀNG HÌNH
    if (!customDrawSuccess) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;

        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

        ctx.shadowBlur = 0; ctx.fillStyle = p.color || "#fff"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    }

    // Vẽ Aura bảo vệ
    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); }
    if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -95, 40, 6); ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -95, 40 * (Math.max(0, p.hp)/p.maxHp), 6); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -95, 40, 6); }
    ctx.restore();
};

// ==========================================
// ĐỒ HỌA ĐỘC QUYỀN CỦA BỐN ĐẠI ÁC BOSS TẦNG CAO
// ==========================================

window.drawDragon = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);
    ctx.strokeStyle = p.color || "#e74c3c"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 15; ctx.shadowColor = p.color || "#e74c3c"; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }
    let t = Date.now() / 150; let bounce = (p.state === 'walk') ? Math.abs(Math.sin(t)) * 6 : Math.sin(t) * 4; let wingFlap = Math.sin(t * 1.5) * 15; 
    let cx = 0, cy = -45 + bounce; let head = { x: cx + 45, y: cy - 35 }; let jaw = { x: cx + 45, y: cy - 20 }; let neck = { x: cx + 15, y: cy - 15 }; let pelvis = { x: cx - 25, y: cy + 10 }; let tailTip = { x: cx - 70 - Math.cos(t)*15, y: cy - 10 + Math.sin(t*1.5)*20 };
    let wingJoint = { x: cx - 5, y: cy - 20 }; let wingTip1 = { x: cx - 20, y: cy - 70 + wingFlap }; let wingTip2 = { x: cx + 20, y: cy - 55 + wingFlap*0.8 }; let wingTip3 = { x: cx - 45, y: cy - 40 + wingFlap*1.2 };
    let legFrontKnee = { x: cx + 15, y: cy + 20 }; let legFrontFoot = { x: cx + 25, y: 0 }; let legBackKnee = { x: cx - 15, y: cy + 25 }; let legBackFoot = { x: cx - 10, y: 0 };
    let armElbow1 = { x: cx + 30, y: cy + 5 }; let armClaw1 = { x: cx + 45, y: cy + 20 }; let armElbow2 = { x: cx + 15, y: cy + 0 }; let armClaw2 = { x: cx + 30, y: cy + 15 };
    if (p.state === 'scratch') { let progress = 1 - (p.attackTimer / 30); let strike = Math.sin(progress * Math.PI); cx += strike * 20; head.x += 10; jaw.x += 10; wingFlap = -25; armElbow1.x += strike * 30; armElbow1.y -= strike * 20; armClaw1.x += strike * 50; armClaw1.y -= strike * 10; armElbow2.x -= strike * 10; armClaw2.x -= strike * 10; if (progress > 0.2 && progress < 0.8 && !isTrail) { ctx.save(); ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3; ctx.shadowColor = "#f1c40f"; ctx.beginPath(); ctx.moveTo(armClaw1.x - 15, armClaw1.y - 15); ctx.lineTo(armClaw1.x + 25, armClaw1.y + 25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(armClaw1.x - 5, armClaw1.y - 25); ctx.lineTo(armClaw1.x + 35, armClaw1.y + 15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(armClaw1.x - 25, armClaw1.y - 5); ctx.lineTo(armClaw1.x + 15, armClaw1.y + 35); ctx.stroke(); ctx.restore(); } } 
    else if (p.state === 'breathe_fire') { head.x -= 15; head.y -= 10; jaw.x += 5; jaw.y += 20; neck.x -= 10; wingFlap = 20; armElbow1.y -= 10; armClaw1.y -= 10; if (!isTrail) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for(let i=0; i<8; i++) { let fx = jaw.x + 10 + Math.random() * 80; let fy = (head.y + jaw.y)/2 + (Math.random() - 0.5) * fx * 0.6; ctx.fillStyle = Math.random() > 0.4 ? "#e74c3c" : "#f1c40f"; ctx.beginPath(); ctx.arc(fx, fy, Math.random() * 12 + 4, 0, Math.PI*2); ctx.fill(); } ctx.restore(); } } 
    else if (p.state === 'stunned') { head.y += 20; jaw.y += 20; neck.y += 15; wingFlap = 20; if (!isTrail) { ctx.fillStyle = "#f1c40f"; ctx.font = "20px Arial"; ctx.fillText("💫", head.x, head.y - 20); } } 
    else if (p.state === 'hurt') { head.x -= 15; jaw.x -= 15; neck.x -= 10; cx -= 10; wingFlap = -10; }
    const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip1.x, wingTip1.y); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip2.x, wingTip2.y); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip3.x, wingTip3.y); ctx.moveTo(wingTip2.x, wingTip2.y); ctx.quadraticCurveTo(cx, cy - 50 + wingFlap, wingTip1.x, wingTip1.y); ctx.quadraticCurveTo(cx - 25, cy - 40 + wingFlap, wingTip3.x, wingTip3.y); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx - 30, cy + 20, tailTip.x, tailTip.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x - 8, tailTip.y - 12); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x + 8, tailTip.y - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx, cy + 15, neck.x, neck.y); ctx.stroke();
    drawLimb(pelvis, legBackKnee, legBackFoot); drawLimb({x: cx+5, y: cy+10}, legFrontKnee, legFrontFoot); drawLimb(neck, armElbow2, armClaw2); drawLimb(neck, armElbow1, armClaw1);
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(head.x, head.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(jaw.x, jaw.y); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(head.x - 5, head.y - 5); ctx.lineTo(head.x - 15, head.y - 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(head.x - 12, head.y); ctx.lineTo(head.x - 22, head.y - 12); ctx.stroke(); ctx.beginPath(); ctx.arc(head.x - 8, head.y + 2, 2.5, 0, Math.PI*2); ctx.fillStyle = (p.state === 'scratch' || p.state === 'breathe_fire' || p.isRage) ? "#f1c40f" : "#fff"; ctx.fill();
    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.translate(p.x, window.GROUND_Y); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 0; ctx.beginPath(); ctx.ellipse(0, 0, 45, 7, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-35, -100, 70, 8); ctx.fillStyle = p.color || "#e74c3c"; ctx.fillRect(-35, -100, 70 * (Math.max(0, p.hp)/p.maxHp), 8); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-35, -100, 70, 8); }
    ctx.restore();
};

window.drawBruceLee = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, -62, 16, Math.PI, Math.PI * 2); ctx.lineTo(-5, -76); ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-3, -45); ctx.lineTo(-3, -15); ctx.stroke(); ctx.fillStyle = "#f1c40f"; ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.save(); ctx.translate(-12, -32); if (['machine_gun_punches', 'one_inch_punch'].includes(p.state)) { ctx.rotate(Math.sin(Date.now() * 0.05)); } ctx.fillRect(0, 0, 5, 22); ctx.strokeRect(0, 0, 5, 22); ctx.restore(); ctx.restore();
};

window.drawSamurai = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.fillStyle = "#d2b48c"; ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-28, -58); ctx.lineTo(0, -75); ctx.lineTo(28, -58); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5c4033"; ctx.beginPath(); ctx.arc(0, -74, 4, 0, Math.PI, true); ctx.fill(); ctx.fillStyle = "rgba(192, 57, 43, 0.85)"; ctx.beginPath(); ctx.moveTo(0, -45); let waveX = -42 + Math.sin(Date.now() * 0.01) * 8; let waveY = -22 + Math.cos(Date.now() * 0.01) * 5; ctx.lineTo(waveX, waveY); ctx.lineTo(-10, -12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#eaf2f8"; ctx.lineWidth = 3; ctx.save(); ctx.translate(0, -25); ctx.rotate(p.state === 'dash' ? -Math.PI / 4 : Math.PI / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(35, -8); ctx.stroke(); ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, 2); ctx.stroke(); ctx.restore(); ctx.restore();
};

window.drawNinja = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.strokeStyle = "#9b59b6"; ctx.lineWidth = 3; ctx.shadowBlur = 10; ctx.shadowColor = "#9b59b6"; ctx.beginPath(); ctx.moveTo(-6, -62); ctx.lineTo(12, -62); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = "#8e44ad"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-6, -55); let sX1 = -25; let sY1 = -45 + Math.sin(Date.now() * 0.015) * 8; let sX2 = -45; let sY2 = -50 + Math.cos(Date.now() * 0.015) * 12; ctx.quadraticCurveTo(sX1, sY1, sX2, sY2); ctx.stroke(); ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-5, -45); ctx.lineTo(15, -15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(5, -45); ctx.lineTo(-15, -15); ctx.stroke(); if (!isTrail && Math.random() < 0.25 && window.particles) { window.particles.push({ x: p.x + (Math.random() - 0.5) * 25 * (p.scale || 1), y: p.y - Math.random() * 60 * (p.scale || 1), vx: (Math.random() - 0.5) * 1.5, vy: -Math.random() * 2, life: 15, maxLife: 15, color: Math.random() > 0.5 ? "rgba(142, 68, 173, 0.4)" : "rgba(44, 62, 80, 0.4)", size: Math.random() * 3 + 2 }); } ctx.restore();
};

// Đăng ký rỗng giữ tính tương thích kiến trúc cũ
window.assignDrawMethods = function(statsObj) { };
