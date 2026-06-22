// ==========================================
// MAIN.JS - CHỐNG 403 AUDIO VÀ FIX LỖI TẢI GOOGLE SHEET
// ==========================================

// KHO PLAYLIST NHẠC NỀN WIKIMEDIA COMMONS (Tuyệt đối không bị lỗi 403 Forbidden)
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
    { id: 'heal', name: '💊 BÌNH MÁU M THUẬT', desc: 'Hồi phục ngay 50% HP tối đa.', color: '#2ecc71', action: (p) => { p.hp = Math.min(p.maxHp, p.hp + p.maxHp * 0.5); } },
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
        } else {
            console.warn("⚠️ Link Google Sheet bị lỗi 404. Game đang chuyển sang tải nhân vật mặc định từ cấu hình hệ thống...");
        }
    } catch(e) {
        console.warn("⚠️ Không thể tải dữ liệu Google Sheet, dùng bản sao lưu offline.");
    }
    if(typeof window.assignDrawMethods === 'function') window.assignDrawMethods(window.classStats); 
    window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    
    // Nếu object trống, báo lỗi ra màn hình để nhận diện
    if (!window.classStats || Object.keys(window.classStats).length === 0) {
        carousel.innerHTML = "<div style='color:red; font-weight:bold; padding:20px;'>LỖI TẢI NHÂN VẬT: Vui lòng kiểm tra lại file config.js hoặc Google Sheet!</div>";
        return;
    }

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
    
    // Gán nhạc từ Wiki để không bao giờ bị 403 Forbidden
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

window.startGame = function() { 
    if(!window.selectedRedClass) return; window.isTowerMode = false;
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    window.initBGM();
    if(typeof window.matchStart === 'function') window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
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

        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
        window.currentWeather = window.currentMap.weather;

        let animatedTaunts = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'];

        if (typeof window.startRecording === 'function') window.startRecording();

        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: window.classStats[window.selectedRedClass].drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
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
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isBossMode ? `🐉` : ((actualEnemiesCount > 1) ? `🤖 x${window.enemies.length}` : `🤖`);
        
        window.resetMatchVariables(); window.bindAttackEvent();
    } catch(e) { console.error("Lỗi:", e); }
}

window.startTowerMode = function() {
    if(!window.selectedRedClass) return;
    window.isTowerMode = true;
    window.towerFloor = 1;
    
    let stat = JSON.parse(JSON.stringify(window.classStats[window.selectedRedClass]));
    stat.classId = window.selectedRedClass; stat.id = "PLAYER_HERO";
    window.towerPlayer = stat; 

    window.showTowerUI();
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.showTowerUI = function() {
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let buffUI = document.getElementById("buff-screen"); if(buffUI) buffUI.style.display = "none"; 

    let towerDiv = document.getElementById("tower-screen");
    if (!towerDiv) {
        towerDiv = document.createElement("div"); towerDiv.id = "tower-screen";
        towerDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(to bottom, #111, #2c3e50); color:#fff; z-index:9999; display:flex; flex-direction:column; align-items:center; padding:20px; overflow:auto; box-sizing: border-box; font-family: Arial, sans-serif;";
        document.body.appendChild(towerDiv);
    }
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

                <div style="border: 4px solid ${isBoss ? '#e74c3c' : '#3498db'}; background: rgba(0,0,0,0.6); border-radius:15px; padding:30px; text-align:center; box-shadow: 0 0 30px ${isBoss ? 'rgba(231,76,60,0.4)' : 'rgba(52,152,219,0.4)'}; margin-bottom:30px;">
                    <div style="font-size:50px; margin-bottom:10px;">${isBoss ? '🐉' : '🦹'}</div>
                    <div style="color:${isBoss ? '#e74c3c' : '#3498db'}; font-weight:900; font-size:24px; text-transform:uppercase;">
                        ${isBoss ? 'ÁC LONG VƯƠNG' : 'ĐỘI QUÂN HỘC MÁU'}
                    </div>
                    <div style="color:#7f8c8d; font-size:14px; margin-top:5px;">SỐ LƯỢNG ĐỊCH: ${isBoss ? '1 (BOSS KHỦNG)' : Math.ceil(window.towerFloor / 3)}</div>
                </div>

                <div style="display:flex; gap:15px;">
                    <button onclick="window.playNextTowerMatch()" style="background:linear-gradient(45deg, #e74c3c, #c0392b); color:#fff; font-size:18px; font-weight:900; padding:15px 40px; border:none; border-radius:30px; cursor:pointer; box-shadow: 0 5px 15px rgba(231,76,60,0.4);">⚔️ CHIẾN ĐẤU</button>
                    <button onclick="window.backToMenu()" style="background:#7f8c8d; color:#fff; font-size:16px; font-weight:bold; padding:15px 20px; border:none; border-radius:30px; cursor:pointer;">🔙 ĐẦU HÀNG</button>
                </div>`;
    towerDiv.innerHTML = html;
};

window.playNextTowerMatch = function() {
    let towerDiv = document.getElementById("tower-screen"); if (towerDiv) towerDiv.style.display = "none";
    let game = document.getElementById("game-screen"); if (game) game.style.display = "block";

    window.initBGM();

    window.currentMap = window.MAPS[Math.min(window.towerFloor, window.MAPS.length - 1)];
    window.currentWeather = window.currentMap.weather;
    let animatedTaunts = ['taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'];

    if (typeof window.startRecording === 'function') window.startRecording();

    let p = window.towerPlayer;
    window.p1 = { 
        id: p.id, classId: p.classId, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
        speed: p.speed, color: p.color, hp: p.hp, maxHp: p.maxHp, dmgMod: p.dmgMod, scale: 1,
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: window.classStats[p.classId].drawMethod, skill: window.classStats[p.classId].skill || {}, regen: p.regen || 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.25, critMult: 1.5, className: p.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0, introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
    };

    window.enemies = []; window.totalEnemyMaxHp = 0;
    let allKeys = Object.keys(window.classStats || {});
    
    let isBossMode = window.towerFloor === 10;
    let actualEnemiesCount = isBossMode ? 1 : Math.ceil(window.towerFloor / 3);

    for(let i = 0; i < actualEnemiesCount; i++) {
        let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
        let hpMultiplier = (actualEnemiesCount > 1) ? 0.6 : 1.0; 
        if(isBossMode) hpMultiplier = 15.0; 
        else hpMultiplier += (window.towerFloor * 0.15); 

        let eHp = Math.floor(s2.hp * hpMultiplier); window.totalEnemyMaxHp += eHp;
        window.enemies.push({ 
            id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
            hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 3.0 : (1 + window.towerFloor * 0.1)), scale: isBossMode ? 2.5 : 1, isDragon: isBossMode,
            onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: window.classStats[blueClass].drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
            critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, introState: animatedTaunts[Math.floor(Math.random() * animatedTaunts.length)] 
        });
    }

    let nb = document.getElementById("name-display-blue");
    if(nb) nb.innerText = isBossMode ? `🐉` : ((actualEnemiesCount > 1) ? `🤖 x${window.enemies.length}` : `🤖`);
    
    window.resetMatchVariables();
    window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 150, text: isBossMode ? `🔥 ĐỈNH THÁP - BOSS CUỐI 🔥` : `TẦNG THỨ ${window.towerFloor}`, color: "#9b59b6", alpha: 1, vx: 0, vy: -0.5, font: "italic 900 45px Arial", life: 120 });
    window.bindAttackEvent();
}

window.showBuffSelectionUI = function() {
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    
    let buffDiv = document.getElementById("buff-screen");
    if (!buffDiv) {
        buffDiv = document.createElement("div"); buffDiv.id = "buff-screen";
        buffDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); color:#fff; z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing: border-box; font-family: Arial, sans-serif;";
        document.body.appendChild(buffDiv);
    }
    buffDiv.style.display = "flex";

    let shuffled = [...window.BUFF_POOL].sort(() => 0.5 - Math.random());
    let options = shuffled.slice(0, 3);

    let html = `
        <h1 style="color:#f1c40f; text-shadow: 0 0 15px #f1c40f; text-transform:uppercase; font-size:40px; margin-bottom:10px;">🎉 CLEAR TẦNG ${window.towerFloor}! 🎉</h1>
        <p style="color:#bdc3c7; font-size:18px; margin-bottom:40px;">Hãy chọn 1 Thẻ Bài Ma Thuật để cường hóa bản thân cho vòng tiếp theo:</p>
        <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">
    `;

    options.forEach((buff, idx) => {
        html += `
            <div onclick="window.applyBuff('${buff.id}')" style="background:linear-gradient(180deg, #2f3542, #111); border: 3px solid ${buff.color}; border-radius:15px; width:220px; padding:30px 20px; text-align:center; cursor:pointer; transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 15px 40px ${buff.color}88';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.8)';">
                <div style="font-size:40px; margin-bottom:15px;">${buff.name.split(' ')[0]}</div>
                <div style="color:${buff.color}; font-weight:900; font-size:20px; margin-bottom:15px;">${buff.name.substring(buff.name.indexOf(' ')+1)}</div>
                <div style="color:#bdc3c7; font-size:14px; line-height:1.5;">${buff.desc}</div>
            </div>
        `;
    });

    html += `</div>`;
    buffDiv.innerHTML = html;
};

window.applyBuff = function(buffId) {
    let buff = window.BUFF_POOL.find(b => b.id === buffId);
    if (buff) { buff.action(window.towerPlayer); }
    window.towerFloor++;
    
    let buffDiv = document.getElementById("buff-screen"); if(buffDiv) buffDiv.style.display = "none";
    window.showTowerUI();
}

window.resetMatchVariables = function() {
    window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
    window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1;
    window.camX = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0; window.impactFrameTimer = 0;
    window.weatherParticles = []; let ptCount = (window.currentWeather === 'none') ? 0 : 150;
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
        window.addEventListener('touchstart', triggerAttack, {passive: false}); window.addEventListener('mousedown', triggerAttack);
    }
}

window.checkGameOver = function() {
    if (window.matchResolved) return; let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; 
        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);

        if (window.isTowerMode) {
            if (window.p1.hp > 0) {
                window.towerPlayer.hp = window.p1.hp;
                
                if (window.towerFloor >= 10) {
                    window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: "🎉 CLEAR THÁP THÀNH CÔNG! 🎉", color: "#f1c40f", alpha: 1, vx: 0, vy: -0.5, font: "900 60px Arial", life: 180 });
                    setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); alert("BẠN ĐÃ TIÊU DIỆT ÁC LONG VÀ PHÁ ĐẢO THÁP!"); window.backToMenu(); }, 5000);
                } else {
                    window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 100, text: "QUA TẦNG!", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 60px Arial", life: 180 });
                    setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); window.showBuffSelectionUI(); }, 4000);
                }
            } else {
                window.floatingTexts.push({ x: window.innerWidth > 0 ? window.innerWidth/2 : 400, y: 200, text: "💀 RỚT THÁP 💀", color: "#e74c3c", alpha: 1, vx: 0, vy: -0.5, font: "900 70px Arial", life: 180 });
                setTimeout(() => { if (typeof window.stopRecording === 'function') window.stopRecording(); alert("BẠN ĐÃ TỬ TRẬN TẠI TẦNG " + window.towerFloor); window.backToMenu(); }, 4000);
            }
        } else {
            let winnerText = (window.p1.hp > 0) ? "VICTORY!" : "GAME OVER!";
            let winnerColor = (window.p1.hp > 0) ? "#2ed573" : "#ff4757";
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
        if (isClimax && !window.gameOver) {
            window.bgmBase.volume = Math.max(0, window.bgmBase.volume - 0.01);
            window.bgmClimax.volume = Math.min(0.25, window.bgmClimax.volume + 0.01);
        } else {
            window.bgmBase.volume = Math.min(0.15, window.bgmBase.volume + 0.01);
            window.bgmClimax.volume = Math.max(0, window.bgmClimax.volume - 0.01);
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
