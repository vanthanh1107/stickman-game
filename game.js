// Cấu hình chỉ số chỉ định cho Võ sĩ
const classStatsDefault = {
    'dausi': { className: "Võ Sĩ Quyền Anh", hp: 250, speed: 3.5, dmgMod: 1.2, regen: 0.3, avatarUrl: "", drawMethod: null, skill: {} },
    'satthu': { className: "Sát Thủ Bóng Đêm", hp: 180, speed: 4.5, dmgMod: 1.5, regen: 0.2, avatarUrl: "", drawMethod: null, skill: {} }
};

let classStats = {};
let selectedRedClass = "";
let latestPlayersData = [];
let database = null;

const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
let audioCtx = null, isMuted = false;

let floatingTexts = [], particles = [], projectiles = [], traps = [], slashes = [], shockwaves = [], impactSparks = [];
let gameMode = 'horde';
let p1, enemies = [], windowEnemyCount = 1;
let worldBoss = null, onlinePlayersData = {}, syncInterval = null;

let gameOver = false, isLoopRunning = false, matchResolved = false;
let shakeTime = 0, shakeMag = 0, hitStopFrames = 0;
let camX = 0, screenFlash = 0, cinematicTimer = 0, cinematicCaster = null, cinematicCallback = null, slowMoTimer = 0;
let introTimer = 0, uiShakeP1 = 0, uiShakeP2 = 0;
let currentWeather = 'none', weatherParticles = [];
let isGlitching = false, mangaKO = false, heartbeatTick = 0, stageHazards = [];
let zoomLevel = 1;

const GROUND_Y = 320;
const GRAVITY = 0.8;

function speak(text) {
    if (isMuted || !window.speechSynthesis) return;
    let msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1.2; msg.pitch = 0.8; msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function triggerVibration(pattern) {
    if (typeof window !== 'undefined' && navigator && navigator.vibrate) {
        try { navigator.vibrate(pattern); } catch(e) {}
    }
}

function toggleAudio(e) {
    e.stopPropagation();
    isMuted = !isMuted;
    document.getElementById("btn-audio").innerText = isMuted ? "🔇" : "🔊";
    if (!isMuted && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!isMuted && audioCtx.state === 'suspended') audioCtx.resume();
}

function focusNextVisible(className) {
    let el = getGameVisibleInput(className);
    if(el) el.focus();
}

function savePlayerData() {
    if(!currentUid || !database) return;
    database.ref('players/' + currentUid).set(currentPlayer).catch(e => console.error(e));
}

function spinGacha() {
    if (currentPlayer.coins < 100) return alert("Bạn cần ít nhất 100 Vàng để quay Gacha!");
    currentPlayer.coins -= 100;
    alert("🎉 Chúc mừng! Bạn quay được một trang bị Ảo (Tính năng đang nâng cấp...)");
    savePlayerData(); updatePlayerUI();
}

function autoLoginGame(uid, playerName) {
    currentUid = uid; currentPlayer.name = playerName;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("selection-screen").style.display = "block";
    loadStatsFromGoogleSheet();
    document.getElementById("loading-status").innerText = "⏳ Đang tải dữ liệu...";
    if (database) {
        database.ref('players/' + currentUid).once('value').then(async (snapshot) => {
            if(snapshot.exists()) {
                let data = snapshot.val();
                currentPlayer.level = parseInt(data.level) || 1; currentPlayer.xp = parseInt(data.xp) || 0;
                currentPlayer.elo = parseInt(data.elo) || 1000; currentPlayer.coins = parseInt(data.coins) || 0;
                currentPlayer.countryCode = data.countryCode || "VN"; currentPlayer.countryName = data.countryName || "Vietnam";
                currentPlayer.classId = data.classId || ""; currentPlayer.achievements = data.achievements || [];
            } else {
                let locationData = await autoFetchUserCountry();
                currentPlayer.countryCode = locationData.code; currentPlayer.countryName = locationData.name;
                currentPlayer.achievements = []; savePlayerData();
            }
            if (currentPlayer.classId) selectedRedClass = currentPlayer.classId;
            renderCharacterGrid(); updatePlayerUI(); listenLeaderboard();
        }).catch((e) => {
            updatePlayerUI();
            document.getElementById("loading-status").innerHTML = `<span style="color:#ff4757;">Chơi Offline (Lưu ý: Bạn cần mở Rules Firebase)</span>`;
        });
    } else { updatePlayerUI(); document.getElementById("loading-status").style.display = "none"; }
}

function updatePlayerUI() {
    let flag = getFlagEmoji(currentPlayer.countryCode);
    document.getElementById("user-display-name").innerText = flag + " " + currentPlayer.name;
    let currentLvl = parseInt(currentPlayer.level) || 1; let currentXp = parseInt(currentPlayer.xp) || 0;
    document.getElementById("user-display-level").innerText = currentLvl;
    document.getElementById("user-display-elo").innerText = currentPlayer.elo || 1000;
    document.getElementById("user-display-coins").innerText = currentPlayer.coins || 0;
    document.getElementById("xp-fill-bar").style.width = ((currentXp / (currentLvl * 100)) * 100) + "%";
    document.getElementById("xp-text").innerText = `XP: ${currentXp} / ${currentLvl * 100}`;
}

function unlockAchievement(id) {
    if (!currentPlayer.achievements) currentPlayer.achievements = [];
    if (!currentPlayer.achievements.includes(id)) {
        currentPlayer.achievements.push(id); currentPlayer.coins += ACHIEVEMENTS[id].reward;
        savePlayerData(); updatePlayerUI();
        let popup = document.getElementById("achievement-popup");
        document.getElementById("ach-name").innerText = ACHIEVEMENTS[id].name;
        popup.style.display = "block";
        setTimeout(() => { popup.style.top = "20px"; }, 10);
        playSound(800, 'sine', 0.5, 0.5); speak("Achievement Unlocked");
        setTimeout(() => { popup.style.top = "-100px"; setTimeout(() => { popup.style.display = "none"; }, 500); }, 4000);
    }
}

function showAchievementsModal() {
    let listHtml = "";
    for (let key in ACHIEVEMENTS) {
        let ach = ACHIEVEMENTS[key]; let isUnlocked = (currentPlayer.achievements || []).includes(key);
        listHtml += `<div class="ach-item ${isUnlocked ? 'unlocked' : ''}"><div class="ach-icon">${ach.icon}</div><div class="ach-info"><h5>${ach.name}</h5><p>${ach.desc}</p></div><div style="font-weight:bold; color:#f1c40f; font-size:12px;">${isUnlocked ? 'XONG' : '+' + ach.reward + '💰'}</div></div>`;
    }
    document.getElementById("achievements-list").innerHTML = listHtml;
    document.getElementById("achievements-modal").style.display = "flex";
}

function switchLeaderboard(type) {
    document.getElementById("leaderboard-list").style.display = (type === 'global') ? "block" : "none";
    document.getElementById("country-leaderboard-list").style.display = (type === 'global') ? "none" : "block";
    document.getElementById("tab-global").classList.toggle("active", type === 'global');
    document.getElementById("tab-country").classList.toggle("active", type === 'country');
    if (type === 'country') renderCountryPlayers();
}

function listenLeaderboard() {
    if (!database) return;
    database.ref('players').on('value', (snapshot) => {
        latestPlayersData = []; let countriesFound = {};
        snapshot.forEach((child) => { let p = child.val(); if(p) { latestPlayersData.push(p); if (p.countryCode) countriesFound[p.countryCode] = p.countryName || p.countryCode; } });
        latestPlayersData.sort((a, b) => { return (parseInt(b.elo) || 1000) - (parseInt(a.elo) || 1000); });
        let globalHTML = ""; let displayCount = 0;
        latestPlayersData.forEach((p, idx) => { if (displayCount < 10) { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); globalHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>⚔️ ${parseInt(p.elo)||1000}</span></div>`; displayCount++; } });
        document.getElementById("leaderboard-list").innerHTML = globalHTML || "<p style='text-align:center;color:#aaa;'>Chưa có ai lên bảng!</p>";
        let selectEl = document.getElementById("country-filter-select");
        if (selectEl) {
            let currentSelection = selectEl.value || currentPlayer.countryCode || "VN";
            selectEl.innerHTML = "";
            for (let code in countriesFound) {
                let opt = document.createElement("option"); opt.value = code; opt.innerText = getFlagEmoji(code) + " " + countriesFound[code];
                if (code === currentSelection) opt.selected = true; selectEl.appendChild(opt);
            }
        }
        if (document.getElementById("tab-country").classList.contains("active")) renderCountryPlayers();
    });
}

function renderCountryPlayers() {
    let selectEl = document.getElementById("country-filter-select"); if (!selectEl) return;
    let selectedCountry = selectEl.value; let countryHTML = "";
    let filteredPlayers = latestPlayersData.filter(p => p.countryCode === selectedCountry);
    filteredPlayers.forEach((p, idx) => { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); countryHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>⚔️ ${parseInt(p.elo)||1000}</span></div>`; });
    document.getElementById("country-players-inner").innerHTML = countryHTML || "<p style='text-align:center;color:#aaa;'>Chưa có chiến binh nào!</p>";
}

async function loadStatsFromGoogleSheet() {
    try {
        const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(SHEET_URL, { signal: controller.signal }); clearTimeout(timeoutId);
        const csvText = await response.text(); parseCSVData(csvText);
    } catch (error) { console.warn("Mạng lỗi, sử dụng dữ liệu dự phòng"); }
    finally {
        if (Object.keys(classStats).length === 0) { classStats = classStatsDefault; }
        renderCharacterGrid();
        document.getElementById("loading-status").style.display = "none";
        document.getElementById("menu-content").style.display = "flex";
    }
}

function parseCSVData(csvText) {
    let result = []; let row = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) {
        let char = csvText[i];
        if (char === '"') { if (inQuotes && csvText[i+1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; } }
        else if (char === ',' && !inQuotes) { row.push(cur.trim()); cur = ''; }
        else if ((char === '\n' || char === '\r') && !inQuotes) { if (char === '\r' && csvText[i+1] === '\n') i++; row.push(cur.trim()); result.push(row); row = []; cur = ''; }
        else { cur += char; }
    }
    if (cur || row.length > 0) { row.push(cur.trim()); result.push(row); } if (result.length < 2) return;
    let headers = result[0];
    for (let i = 1; i < result.length; i++) {
        let values = result[i]; if (values.length < headers.length && values.join('') === '') continue;
        let rowObj = {}; headers.forEach((h, idx) => rowObj[h] = values[idx] || "");
        if (rowObj.id) {
            let actionCode1 = null, actionCode2 = null, actionCode3 = null;
            try { if (rowObj.skill1Code) actionCode1 = new Function('p', 'target', 'gameContext', rowObj.skill1Code); } catch (e) {}
            try { if (rowObj.skill2Code) actionCode2 = new Function('p', 'target', 'gameContext', rowObj.skill2Code); } catch (e) {}
            try { if (rowObj.skill3Code) actionCode3 = new Function('p', 'target', 'gameContext', rowObj.skill3Code); } catch (e) {}
            let drawMethod = null; try { if (rowObj.drawCode) drawMethod = new Function('ctx', 'p', 'bounce', 'ext', 'pext', 'isTrail', rowObj.drawCode); } catch (e) { console.error("Lỗi biên dịch drawCode:", e); }
            classStats[rowObj.id] = {
                className: rowObj.className || "Ẩn Danh", hp: parseInt(rowObj.hp)||200, speed: (parseFloat(rowObj.speed)||1) * 3,
                dmgMod: parseFloat(rowObj.dmgMod)||1, regen: parseFloat(rowObj.regen)||0.3, avatarUrl: rowObj.avatarUrl || "",
                drawMethod: drawMethod, skill: { actionCode1: actionCode1, actionCode2: actionCode2, actionCode3: actionCode3 }
            };
        }
    }
}

function renderCharacterGrid() {
    const carousel = document.getElementById("character-carousel"); carousel.innerHTML = ""; let firstCardId = null;
    for (let id in classStats) {
        let item = classStats[id]; let card = document.createElement("div"); card.className = "char-card";
        let avatarSrc = item.avatarUrl || classImages[id] || `https://api.dicebear.com/7.x/adventurer/png?seed=${id}&backgroundColor=ffdfbf`;
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => {
            selectedRedClass = id; document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected');
            document.getElementById("desc-red").innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>⚡ Tốc độ: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Sát thương: <strong>x${item.dmgMod}</strong></span>`;
            currentPlayer.classId = id; savePlayerData();
        };
        carousel.appendChild(card); if (currentPlayer.classId && id === currentPlayer.classId) { card.click(); firstCardId = id; } if(!firstCardId) { firstCardId = id; }
    }
    if(!selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

function matchStart() {
    let allKeys = Object.keys(classStats); if(allKeys.length === 0) return alert("Dữ liệu Võ Sĩ bị lỗi!"); if (!selectedRedClass || !classStats[selectedRedClass]) { selectedRedClass = allKeys[0]; }
    let s1 = classStats[selectedRedClass];
    let eCountInput = document.getElementById("enemy-count-input"); let numEnemies = parseInt(eCountInput ? eCountInput.value : 1) || 1;
    if (numEnemies < 1) numEnemies = 1; if (numEnemies > 10) numEnemies = 10;

    let tauntsP1 = ["Tới đây!", "Sợ chưa?", "Nhào vô!", "Lên luôn!"]; let tauntsP2 = ["Bỏ cuộc đi!", "Nộp mạng đi!", "Chịu chết đi!", "Hủy diệt!"];

    p1 = {
        classId: selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0,
        speed: s1.speed, color: "#ff4757", hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scaleMod: 1,
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0,
        stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0,
        drawMethod: s1.drawMethod, skill: s1.skill, regen: s1.regen, shield: 0,
        buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0,
        critChance: 0.2, critMult: 1.5, className: s1.className, isRage: false,
        shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false,
        taunt: tauntsP1[Math.floor(Math.random()*tauntsP1.length)], flashTimer: 0
    };

    enemies = []; worldBoss = null; onlinePlayersData = {}; matchResolved = false; gameOver = false; introTimer = 160;
    stageHazards = []; mangaKO = false; isGlitching = false; heartbeatTick = 0; zoomLevel = 1;

    if (gameMode === 'horde') {
        document.getElementById("world-boss-ui").style.display = "none"; document.getElementById("normal-hp-ui").style.display = "flex";
        document.getElementById("match-subtitle").innerText = "⚔️ Cố gắng sống sót trước bầy địch!";
        let isBossEncounter = false; if (numEnemies >= 5 && Math.random() < 0.2) { isBossEncounter = true; numEnemies = 1; }
        windowEnemyCount = numEnemies;
        for(let i=0; i < windowEnemyCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = classStats[blueClass]; let spawnX = 400 + i * 50;
            let e = {
                classId: blueClass, isPlayer: false, x: spawnX, y: GROUND_Y - 200 - (i*50), vx: 0, vy: 10,
                speed: s2.speed * (1 + Math.random() * 0.2 - 0.1), color: "#1e90ff", hp: s2.hp, maxHp: s2.hp, dmgMod: s2.dmgMod, scaleMod: 1,
                onGround: false, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0,
                stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0,
                drawMethod: s2.drawMethod, skill: s2.skill, regen: s2.regen, shield: 0,
                buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0,
                critChance: 0.15, critMult: 1.5, className: s2.className, isRage: false,
                shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false, isBoss: false, flashTimer: 0,
                taunt: tauntsP2[Math.floor(Math.random()*tauntsP2.length)]
            };
            if (isBossEncounter) { e.className = "👹 ÁC MỘNG VỰC THẲM (BOSS)"; e.maxHp *= 5; e.hp = e.maxHp; e.dmgMod *= 2; e.scaleMod = 1.5; e.isBoss = true; e.superArmor = 999999; e.color = "#9b59b6"; }
            enemies.push(e);
        }
        document.getElementById("name-display-red").innerText = `${currentPlayer.name} (${s1.className})`;
        document.getElementById("name-display-blue").innerText = isBossEncounter ? enemies[0].className : `Bầy Địch (x${windowEnemyCount})`;
    }
    else if (gameMode === 'boss') {
        document.getElementById("normal-hp-ui").style.display = "none"; document.getElementById("world-boss-ui").style.display = "block";
        document.getElementById("match-subtitle").innerText = "🌐 CO-OP ONLINE: Săn Boss Khổng Lồ!";
        document.getElementById("name-display-red").innerText = `${currentPlayer.name}`;

        worldBoss = {
            classId: allKeys[0], isPlayer: false, x: canvas.width - 80, y: GROUND_Y, vx: 0, vy: 0,
            speed: 0, color: "#8e44ad", hp: 1000000, maxHp: 1000000, dmgMod: 5, scaleMod: 2.5,
            onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0,
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0,
            drawMethod: null, skill: null, regen: 0, shield: 0,
            buffs: [], iFrames: 0, aiDelay: 60, comboHits: 0, comboTimeout: 0,
            critChance: 0.3, critMult: 2.0, className: "HẮC LONG TRƯỞNG LÃO", isRage: false,
            shieldBreak: 1000, stunTimer: 0, superArmor: 999999, isExhausted: false, isBoss: true, flashTimer: 0,
            taunt: "BỌN RÃNH RỖI!"
        };
        enemies = [worldBoss];

        if (database && currentUid) {
            database.ref('boss/haclong').off(); database.ref('boss_room').off();
            database.ref('boss/haclong').on('value', (snap) => {
                let data = snap.val();
                if (data && data.hp != null) { worldBoss.hp = data.hp; if (worldBoss.hp <= 0 && !gameOver && introTimer <= 0) checkGameOver(); }
                else { database.ref('boss/haclong').set({ hp: 1000000, maxHp: 1000000 }); }
            });

            let myRef = database.ref('boss_room/' + currentUid); myRef.onDisconnect().remove();
            database.ref('boss_room').on('value', (snap) => {
                let data = snap.val() || {}; onlinePlayersData = data; let count = Object.keys(data).length;
                document.getElementById("online-players-count").innerText = `👥 Đang tham gia: ${count}`;
            });

            if (syncInterval) clearInterval(syncInterval);
            syncInterval = setInterval(() => { if (gameOver) return; myRef.set({ x: p1.x, state: p1.state, isFacingRight: p1.isFacingRight, classId: p1.classId, name: currentPlayer.name }); }, 150);
        }
    }

    weatherParticles = []; for(let i=0; i<100; i++) { weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (currentWeather === 'rain') ? 15 + Math.random() * 10 : 2 + Math.random() * 3 }); }
    updateHPUIs();
}

function syncBossDamageToFirebase(dmg) {
    if (database && gameMode === 'boss') {
        database.ref('boss/haclong/hp').transaction(currentHp => {
            if (currentHp === null) return 1000000;
            let newHp = currentHp - dmg; return newHp < 0 ? 0 : newHp;
        });
    }
}

function takeDamage(target, amount, text, color, isCrit = false, isWallBounce = false) {
    if (!target || target.hp <= 0) return;
    if (target.iFrames > 0 && !isWallBounce) { floatingTexts.push({ x: target.x, y: target.y - 80, text: "MISS", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" }); return; }
    if (target.shield > 0 && !isWallBounce) { target.shield--; floatingTexts.push({ x: target.x, y: target.y - 80, text: `🛡️ ĐỠ!`, color: "#3498db", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" }); spawnParticles(target.x, target.y, "#3498db"); return; }

    let actualDmg = amount; target.flashTimer = 5;

    if (gameMode === 'boss' && target === worldBoss) {
        syncBossDamageToFirebase(actualDmg);
        if (!matchResolved && target.hp - actualDmg <= 0) { slowMoTimer = 120; screenFlash = 0.8; playSound(150, 'square', 1.0, 0.5); speak("K.O."); if(actualDmg > 50) mangaKO = true; }
    } else {
        if (target.hp - amount <= 0 && !matchResolved) { actualDmg = target.hp; slowMoTimer = 120; screenFlash = 0.8; playSound(150, 'square', 1.0, 0.5); speak("K.O."); if(actualDmg >= 50) mangaKO = true; }
        target.hp -= actualDmg; if(target.hp < 0) target.hp = 0;
    }

    let hitWord = text || `-${Math.round(actualDmg)}`;
    if (isCrit && !isWallBounce) { hitWord = "CRITICAL!"; screenFlash = 0.5; shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 120, color: "#f1c40f", alpha: 1, speed: 8}); triggerVibration([40, 30, 40]); isGlitching = true; setTimeout(()=>{isGlitching=false;}, 200);}
    if (isWallBounce) { hitWord = "💥 ĐẬP TƯỜNG!"; screenFlash = 0.2; shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); triggerVibration(60); }

    let dynamicSize = Math.min(45, 18 + actualDmg * 0.4); let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`; let rndX = (Math.random() - 0.5) * 40; let rndY = -Math.random() * 30 - 50;
    floatingTexts.push({ x: target.x + rndX, y: target.y + rndY, text: hitWord, color: isCrit ? "#f1c40f" : color, alpha: 1, vx: (Math.random() - 0.5) * 4, vy: isCrit ? -5 : -3, font: fontStyle });

    if (!isWallBounce && amount > 0) {
        if (isCrit || actualDmg >= 50) { spawnParticles(target.x, target.y, "#e74c3c", true); }
        impactSparks.push({x: target.x, y: target.y - 30, life: 10, maxLife: 10, angle: Math.random() * Math.PI, color: isCrit ? "#fff" : "#ff9f43", scale: isCrit ? 2 : 1});
        if (target === p1) uiShakeP1 = 15; else uiShakeP2 += 5;
        if (uiShakeP2 > 25) uiShakeP2 = 25;
    }
    spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); updateHPUIs();
}

function attack(attacker, type) {
    if (attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.state === 'dash_back' || attacker.stunTimer > 0) return;
    attacker.state = type; attacker.attackTimer = (type === 'punch') ? 12 : 20; playSound(type === 'punch' ? 400 : 250, 'square', 0.1, 0.1);
    let attackRange = ((type === 'punch') ? 70 : 90) * (attacker.scaleMod || 1);
    let potentialTargets = attacker.isPlayer ? enemies : [p1]; let hitTargets = [];

    potentialTargets.forEach(defender => {
        if (!defender || defender.hp <= 0) return;
        let dist = defender.x - attacker.x; let isHit = false;
        if (attacker.isFacingRight && dist > 0 && dist <= attackRange) isHit = true;
        if (!attacker.isFacingRight && dist < 0 && dist >= -attackRange) isHit = true;
        if (Math.abs(attacker.y - defender.y) > 60) isHit = false;
        if (isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        let isCrit = Math.random() < attacker.critChance; let anyHitLanded = false;
        hitTargets.forEach(defender => {
            if (defender.state === 'dash_back' && defender.iFrames > 10) {
                defender.stamina = Math.min(100, defender.stamina + 35); attacker.hitStun = 40; attacker.state = 'hurt'; attacker.vx = attacker.isFacingRight ? -8 : 8; screenFlash = 0.4; playSound(500, 'sine', 0.2, 0.4); shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 150, color: "#f39c12", alpha: 1, speed: 12}); floatingTexts.push({ x: defender.x, y: defender.y - 90, text: "⚔️ PARRY!", color: "#f39c12", alpha: 1, vx: 0, vy: -2, font: "900 26px Arial" }); attacker.comboHits = 0; triggerVibration([50, 50, 100]); return;
            }
            anyHitLanded = true;
            spawnSlash(defender.x + (attacker.isFacingRight ? -20 : 20), defender.y - 30, attacker.isFacingRight, attacker.color, isCrit);

            setTimeout(() => {
                if (gameOver || attacker.hitStun > 0 || attacker.stunTimer > 0) return;
                let dmg = (type === 'punch') ? (6 * (attacker.currentDmgMod || 1)) : (10 * (attacker.currentDmgMod || 1));
                let comboBonus = 1 + (attacker.comboHits * 0.05); dmg = dmg * comboBonus;
                if (defender.state === 'stunned') dmg *= 1.5;
                if (isCrit) dmg *= attacker.critMult; dmg = Math.floor(dmg + Math.random() * 3);

                if (defender.superArmor > 0) {
                    takeDamage(defender, dmg, null, "#fff", isCrit); floatingTexts.push({ x: defender.x, y: defender.y - 100, text: "BÁ THỂ!", color: "#e74c3c", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial" }); spawnParticles(defender.x, defender.y, "#e74c3c"); return;
                }
                if (defender.state === 'block') {
                    dmg = Math.floor(dmg * 0.2); playSound(500, 'triangle', 0.1, 0.1); defender.vx = attacker.isFacingRight ? 5 : -5;
                } else if (defender.state === 'dash_back' && defender.iFrames > 0) {
                    floatingTexts.push({ x: defender.x, y: defender.y - 80, text: "NÉ TRƯỢT!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" });
                } else {
                    playSound(150, 'sawtooth', 0.1, 0.2); shakeScreen(isCrit ? 10 : 5, isCrit ? 8 : ((type==='kick')? 6:3));
                    takeDamage(defender, dmg, null, "#fff", isCrit); defender.hitStun = 12; defender.state = 'hurt';

                    if (attacker.comboHits >= 10 && attacker.hp > 0) {
                        let heal = Math.floor(dmg * 0.1); if (heal < 1) heal = 1; attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);
                        floatingTexts.push({ x: attacker.x, y: attacker.y - 80, text: `+${heal} HP`, color: "#2ed573", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial" });
                    }
                    if (!defender.isBoss) { if (type === 'kick' || isCrit) { defender.vx = attacker.isFacingRight ? 35 : -35; spawnDust(defender.x, defender.y); } else { defender.vx = attacker.isFacingRight ? 12 : -12; } }

                    if (defender.state !== 'stunned' && !defender.isBoss) {
                        defender.shieldBreak -= isCrit ? 35 : 15;
                        if (defender.shieldBreak <= 0) { defender.shieldBreak = 0; defender.stunTimer = 90; defender.state = 'stunned'; defender.vx = 0; takeDamage(defender, 0, "⚡ SHIELD BREAK!", "#00d2d3"); shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 100, color: "#00d2d3", alpha: 1, speed: 8}); }
                    }
                    defender.comboHits = 0;
                }
            }, (type === 'punch') ? 50 : 80);
        });

        if(anyHitLanded) {
            if (isCrit) hitStopFrames = 6; else if (type === 'kick') hitStopFrames = 3;
            attacker.comboHits++; attacker.comboTimeout = 120;
            if (attacker.comboHits === 5 && attacker.isPlayer) speak("Unstoppable!");
            if (attacker.comboHits === 10 && attacker.isPlayer) { speak("Awesome!"); unlockAchievement('combo_master'); }
        }
    }

    function checkGameOver() {
        if (matchResolved) return;
        if (!enemies) return;
        let aliveEnemies = enemies.filter(e => e.hp > 0).length;
        if (p1.hp <= 0 || aliveEnemies === 0) {
            matchResolved = true; gameOver = true;
            if (syncInterval) clearInterval(syncInterval);
            let N = windowEnemyCount || 1; unlockAchievement('first_blood');

            if (p1.hp > 0) {
                if (gameMode === 'horde' && N >= 5 && !enemies.some(e=>e.isBoss)) unlockAchievement('horde_survivor');
                if (gameMode === 'boss' || enemies.some(e=>e.isBoss)) { unlockAchievement('boss_slayer'); N = 20; }
                currentPlayer.xp = parseInt(currentPlayer.xp || 0) + (50 * N); currentPlayer.level = parseInt(currentPlayer.level || 1); currentPlayer.elo = parseInt(currentPlayer.elo || 1000) + (15 * N); currentPlayer.coins = parseInt(currentPlayer.coins || 0) + (50 * N);
                let xpNeeded = currentPlayer.level * 100; let isLevelUp = false; while (currentPlayer.xp >= xpNeeded) { currentPlayer.xp -= xpNeeded; currentPlayer.level += 1; xpNeeded = currentPlayer.level * 100; isLevelUp = true; }
                savePlayerData(); updatePlayerUI(); triggerVibration([100, 50, 100, 50, 300]);
                setTimeout(() => { alert(`🎉 CHÚC MỪNG!\nĐã dọn dẹp kẻ địch.\nNhận ${50 * N} Vàng và +${15 * N} ELO` + (isLevelUp ? `\nLên LEVEL ${currentPlayer.level}!` : "")); backToMenu(); }, 2500);
                if (gameMode === 'boss' && database) { database.ref('boss/haclong').set({ hp: 1000000, maxHp: 1000000 }); }
            } else {
                currentPlayer.elo = Math.max(0, parseInt(currentPlayer.elo || 1000) - (10 * N)); currentPlayer.coins = parseInt(currentPlayer.coins || 0) + (10 * N); savePlayerData(); updatePlayerUI(); triggerVibration([300, 100, 400]);
                setTimeout(() => { alert(`💀 BẠN ĐÃ BỊ HẠ GỤC!\nNhận an ủi ${10 * N} Vàng, bị trừ ${10 * N} ELO`); backToMenu(); }, 2500);
            }
        }
    }

    function updateHPUIs() {
        if (!p1 || !enemies || enemies.length === 0) return;
        let p1Pct = (p1.hp / p1.maxHp * 100) + "%";
        if (gameMode === 'boss' && worldBoss) {
            let bossPct = (worldBoss.hp / worldBoss.maxHp * 100) + "%";
            let wbBar = document.getElementById("world-boss-hp-bar"); if(wbBar) wbBar.style.width = bossPct;
            let wbText = document.getElementById("world-boss-hp-text"); if(wbText) wbText.innerText = `${worldBoss.hp.toLocaleString()} / ${worldBoss.maxHp.toLocaleString()}`;
        } else {
            let totalBlueHp = enemies.reduce((sum, e) => sum + e.hp, 0); let totalBlueMax = enemies.reduce((sum, e) => sum + e.maxHp, 0);
            let p2Pct = (totalBlueMax > 0 ? (totalBlueHp / totalBlueMax * 100) : 0) + "%";
            let bHp = document.getElementById("hp-blue"); if(bHp) bHp.style.width = p2Pct;
            let bTr = document.getElementById("hp-blue-trail"); if(bTr) bTr.style.width = p2Pct;
        }
        let closestE = getClosestAliveEnemy();
        let p2StaminaPct = closestE ? closestE.stamina + "%" : "0%";
        let p2StunPct = closestE ? closestE.shieldBreak + "%" : "100%";
        document.getElementById("hp-red").style.width = p1Pct; document.getElementById("hp-red-trail").style.width = p1Pct;
        document.getElementById("stamina-red").style.width = p1.stamina + "%"; document.getElementById("stamina-blue").style.width = p2StaminaPct;
        document.getElementById("stun-red").style.width = p1.shieldBreak + "%"; document.getElementById("stun-blue").style.width = p2StunPct;
        checkGameOver();
    }

    function update() {
        if (!p1 || enemies.length === 0) return;

        if (p1 && !gameOver && introTimer === 0 && !isMuted) {
            heartbeatTick++; let tickLimit = p1.isRage ? 30 : 70;
            if (heartbeatTick >= tickLimit) { heartbeatTick = 0; playSound(p1.isRage ? 120 : 80, 'triangle', 0.1, p1.isRage ? 0.3 : 0.1); }
        }

        if (uiShakeP1 > 0) { uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
        if (uiShakeP2 > 0) { uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }

        if (introTimer > 0) { introTimer--; if (introTimer === 60) { playSound(800, 'square', 0.2, 0.5); speak("Fight!"); } return; }

        let isSlowMoFrame = false; if (slowMoTimer > 0) { slowMoTimer--; if (slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
        if (shakeTime > 0) shakeTime--; if (screenFlash > 0) screenFlash -= 0.05;
        if (cinematicTimer > 0 && !isSlowMoFrame) { cinematicTimer--; if (cinematicTimer === 0 && cinematicCallback) { cinematicCallback(); cinematicCallback = null; } return; }
        if (hitStopFrames > 0 && !isSlowMoFrame) { hitStopFrames--; return; }

        weatherParticles.forEach(w => {
            if(!isSlowMoFrame) w.y += w.speed; w.x += (currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2;
            if(w.y > canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; }
        });

        if (!gameOver && introTimer === 0 && !isSlowMoFrame && Math.random() < 0.005) { stageHazards.push({x: Math.random() * canvas.width, timer: 120, state: 'warning'}); }
        for (let i = stageHazards.length - 1; i >= 0; i--) {
            let hz = stageHazards[i]; hz.timer--;
            if (hz.timer <= 0) {
                if (hz.state === 'warning') {
                    hz.state = 'strike'; hz.timer = 20; playSound(200, 'square', 0.5, 0.4); shakeScreen(20, 10);
                    let allFighters = [p1].concat(enemies);
                    allFighters.forEach(f => { if (f && f.hp > 0 && Math.abs(f.x - hz.x) < 60) { f.vy = -10; f.hitStun = 20; takeDamage(f, 30, "🔥 THIÊN THẠCH", "#e74c3c", true); } });
                } else if (hz.state === 'strike') { stageHazards.splice(i, 1); }
            }
        }

        for (let i = shockwaves.length - 1; i >= 0; i--) { let sw = shockwaves[i]; if (!isSlowMoFrame) sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) shockwaves.splice(i, 1); }
        for (let i = particles.length - 1; i >= 0; i--) { let pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; if (pt.bounce && !isSlowMoFrame) { pt.vy += GRAVITY * 0.5; if (pt.y > GROUND_Y) { pt.y = GROUND_Y; pt.vy = -pt.vy * 0.6; pt.vx *= 0.8; } } pt.life--; if (pt.life <= 0) particles.splice(i, 1); }
        for (let i = impactSparks.length - 1; i >= 0; i--) { impactSparks[i].life--; if (impactSparks[i].life <= 0) impactSparks.splice(i, 1); }

        if (isSlowMoFrame) return;

        let allFighters = [p1].concat(enemies);

        allFighters.forEach(p => {
            if (!p.trailArr) p.trailArr = [];
            if ((p.state === 'dash' || p.state === 'dash_back' || p.isRage) && Math.abs(p.vx) > 1) { p.trailArr.push({x: p.x, y: p.y, state: p.state, isFacingRight: p.isFacingRight, alpha: 0.5, classId: p.classId, color: p.color}); }
            for (let i = p.trailArr.length - 1; i >= 0; i--) { p.trailArr[i].alpha -= 0.05; if (p.trailArr[i].alpha <= 0) p.trailArr.splice(i, 1); }
        });

        allFighters.forEach(p => {
            if (p.hp <= 0) { p.state = 'hurt'; p.hitStun = 10; p.vx *= 0.85; p.vy += GRAVITY; p.y += p.vy; if(p.y >= GROUND_Y) { p.y = GROUND_Y; p.vy = 0; p.vx = 0; p.onGround = true; } p.x += p.vx; return; }

            if (p.stunTimer > 0) { p.stunTimer--; p.state = 'stunned'; p.vx = 0; if (p.stunTimer === 0) p.shieldBreak = 100; }
            if (p.superArmor > 0) p.superArmor--; if (p.flashTimer > 0) p.flashTimer--;

            if (p.attackTimer > 0) p.attackTimer--; if (p.hitStun > 0) p.hitStun--; if (p.iFrames > 0) p.iFrames--;
            if (p.comboTimer > 0) p.comboTimer--; if (p.dashTimer > 0) p.dashTimer--; if (p.aiDelay > 0) p.aiDelay--;
            if (p.comboTimeout > 0) { p.comboTimeout--; if (p.comboTimeout === 0) p.comboHits = 0; }

            if (p.stamina < 10) p.isExhausted = true; if (p.stamina > 40) p.isExhausted = false;
            p.isRage = (p.hp > 0 && p.hp <= p.maxHp * 0.3);
            p.currentDmgMod = p.dmgMod || 1; p.currentSpeed = p.speed || 3; p.currentRegen = p.regen || 0.3;

            if (p.isRage) { p.currentDmgMod *= 1.2; p.currentSpeed *= 1.2; p.currentRegen += 0.2; if (Math.random() < 0.2) spawnParticles(p.x, p.y - 20, "rgba(255, 71, 87, 0.4)"); }
            if (p.isExhausted) { p.currentSpeed *= 0.6; if (Math.random() < 0.05) spawnSweat(p.x, p.y - 40); }

            for (let i = p.buffs.length - 1; i >= 0; i--) { let b = p.buffs[i]; b.life--; if (b.life <= 0) { p.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') p.currentDmgMod += b.value; if (b.stat === 'speed') p.currentSpeed += b.value; if (b.stat === 'regen') p.currentRegen += b.value; if (b.life % 15 === 0) particles.push({ x: p.x + (Math.random()*20-10), y: p.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

            p.vy += GRAVITY; p.y += p.vy;
            if (p.y >= GROUND_Y) {
                if(!p.onGround && p.hitStun > 0 && p.vy > 5 && !p.isBoss) { p.vy = -p.vy * 0.3; p.y = GROUND_Y; spawnDust(p.x, GROUND_Y); }
                else { p.y = GROUND_Y; p.vy = 0; p.onGround = true; }
            } else { p.onGround = false; }

            if(isNaN(p.x)) p.x = 100; if(isNaN(p.vx)) p.vx = 0;
            if (p.dashTimer > 0) { p.vx = p.dashDir * p.currentSpeed * 2.5; if (p.onGround && Math.random() < 0.5) spawnDust(p.x, p.y); } else { if (p.state !== 'walk' && p.state !== 'dash' && p.state !== 'dash_back' && p.onGround) p.vx *= 0.85; }
            p.x += p.vx;

            let overlapX = 0;
            if (p.isPlayer && enemies.length > 0) {
                enemies.forEach(e => {
                    if(!e || e.hp <= 0) return; let ovX = e.x - p.x;
                    if (Math.abs(ovX) < 40) { let pushForce = (40 - Math.abs(ovX)) / 2; let sign = Math.sign(ovX) || 1; p.x -= pushForce * sign; e.x += pushForce * sign; }
                });
            }

            let wallBound = p.isBoss ? 80 : 30;
            if (p.x <= wallBound) { p.x = wallBound; if (p.hitStun > 0 && p.vx < -1) { p.vx = -p.vx * 0.5; p.hitStun = 10; shakeScreen(10, 4); let bounceDmg = Math.floor(Math.random() * 5) + 3; takeDamage(p, bounceDmg, null, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(p.x, p.y); } else { p.vx = 0; } }
            if (p.x >= canvas.width - wallBound) { p.x = canvas.width - wallBound; if (p.hitStun > 0 && p.vx > 1) { p.vx = -p.vx * 0.5; p.hitStun = 10; shakeScreen(10, 4); let bounceDmg = Math.floor(Math.random() * 5) + 3; takeDamage(p, bounceDmg, null, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(p.x, p.y); } else { p.vx = 0; } }

            // LOGIC PHÁT TÍN HIỆU ĐƯỜNG ĐI CHUẨN XÁC CHỐNG LỖI ĐỨNG YÊN
            if (p.attackTimer === 0 && p.hitStun === 0 && p.dashTimer <= 0 && p.stunTimer <= 0 && !gameOver) {
                let targetFighter = p.isPlayer ? getClosestAliveEnemy() : p1;
                if (!targetFighter || targetFighter.hp <= 0) { p.state = 'idle'; return; }

                let xDistance = targetFighter.x - p.x; p.isFacingRight = xDistance > 0; let absDistance = Math.abs(xDistance);
                let isWalking = false;

                if (absDistance > 60 * (p.scaleMod || 1)) {
                    p.vx += Math.sign(xDistance) * p.currentSpeed * 0.4;
                    if(Math.abs(p.vx) > p.currentSpeed) p.vx = Math.sign(p.vx) * p.currentSpeed;
                    p.state = 'walk'; isWalking = true;
                    if(Math.random() < 0.1 && p.onGround) spawnDust(p.x, p.y);
                } else {
                    p.state = 'idle'; p.vx *= 0.85;
                }

                if (p.aiDelay <= 0) {
                    p.aiDelay = Math.floor(Math.random() * 10) + 5; let usedSkill = false;
                    if (!p.isPlayer) {
                        if (p.isBoss && Math.random() < 0.1 && p.stamina >= 50 && absDistance > 100) {
                            p.stamina -= 50; usedSkill = true; p.state = 'punch'; p.attackTimer = 25;
                            spawnProjectile(p.x, p.y - 40, (p.isFacingRight ? 12 : -12), 0, 20, "#e74c3c", 20, p1, null); playSound(600, 'sine', 0.2, 0.4);
                        }
                        else if (p.skill) {
                            if (p.stamina >= 100 && p.skill.actionCode3) { p.stamina -= 100; usedSkill = true; triggerCinematic(p, () => { p.superArmor = 25; try { p.skill.actionCode3(p, targetFighter, gameContext); if(p.state==='idle') { p.state = 'cast'; p.attackTimer = 15; } } catch (e) {} }); }
                            else if (p.stamina >= 50 && p.skill.actionCode2 && Math.random() < 0.05) { p.stamina -= 50; try { p.skill.actionCode2(p, targetFighter, gameContext); usedSkill = true; if(p.state==='idle') { p.state = 'kick'; p.attackTimer = 20; } } catch (e) {} }
                            else if (p.stamina >= 25 && p.skill.actionCode1 && Math.random() < 0.03) { p.stamina -= 25; try { p.skill.actionCode1(p, targetFighter, gameContext); usedSkill = true; if(p.state==='idle') { p.state = 'punch'; p.attackTimer = 12; } } catch (e) {} }
                        }
                    }
                    if (!usedSkill && !isWalking) {
                        let rand = Math.random();
                        if (targetFighter.attackTimer > 0 || targetFighter.state === 'dash') {
                            if (rand < 0.6 && !p.isBoss) { p.dashTimer = 12; p.dashDir = -Math.sign(xDistance); p.state = 'dash_back'; p.iFrames = 12; p.attackTimer = 12; spawnDust(p.x, p.y); }
                            else if (rand < 0.9) { p.state = 'block'; p.attackTimer = 15; } else { attack(p, 'punch'); p.vx = Math.sign(xDistance) * 2; }
                        } else {
                            const COMBO_WINDOW = 35; let decidedToAttack = (rand < 0.85);
                            if (decidedToAttack) {
                                if (p.comboTimer > 0 && p.comboStep < 2) { p.comboStep++; if (p.comboStep === 1) { attack(p, 'punch'); p.vx = Math.sign(xDistance) * 4; } else if (p.comboStep === 2) { attack(p, 'kick'); p.vx = Math.sign(xDistance) * 6; } }
                                else { p.comboStep = 0; attack(p, 'punch'); p.vx = Math.sign(xDistance) * 2; } p.comboTimer = COMBO_WINDOW;
                            } else { if (Math.random() < 0.6) { p.state = 'block'; p.attackTimer = 10; } else { p.vx = -Math.sign(xDistance) * p.currentSpeed * 1.5; p.state = 'walk'; } }
                        }
                    }
                }
            }
        });

        for(let i=0; i<enemies.length; i++) {
            if(!enemies[i] || enemies[i].hp <= 0) continue;
            for(let j=i+1; j<enemies.length; j++) {
                if(!enemies[j] || enemies[j].hp <= 0) continue;
                let overlapX = enemies[j].x - enemies[i].x;
                if (Math.abs(overlapX) < 30) { let pushForce = (30 - Math.abs(overlapX)) / 2; let sign = Math.sign(overlapX) || 1; enemies[i].x -= pushForce * sign; enemies[j].x += pushForce * sign; }
            }
        }

        for (let i = projectiles.length - 1; i >= 0; i--) { let proj = projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); takeDamage(proj.target, proj.dmg, `🎇 -${proj.dmg}`, "#9b59b6"); shakeScreen(8, 4); projectiles.splice(i, 1); } else if (proj.x < -100 || proj.x > canvas.width + 100 || proj.y < -100 || proj.y > canvas.height + 100) { projectiles.splice(i, 1); } }
        for (let i = traps.length - 1; i >= 0; i--) { let t = traps[i]; t.life--; if (t.life <= 0) { traps.splice(i, 1); continue; } let enemy = (t.owner === p1) ? getClosestAliveEnemy() : p1; if(!enemy) continue; let dx = enemy.x - t.x; let dy = enemy.y - t.y; if (Math.sqrt(dx*dx + dy*dy) < 20 + t.radius && t.life % 30 === 0) { takeDamage(enemy, t.damage, `🤢 -${t.damage}`, t.color); } }
        for (let i = particles.length - 1; i >= 0; i--) { let pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; if (pt.bounce && !isSlowMoFrame) { pt.vy += GRAVITY * 0.5; if (pt.y > GROUND_Y) { pt.y = GROUND_Y; pt.vy = -pt.vy * 0.6; pt.vx *= 0.8; } } pt.life--; if (pt.life <= 0) particles.splice(i, 1); }
        for (let i = slashes.length - 1; i >= 0; i--) { slashes[i].life--; if (slashes[i].life <= 0) slashes.splice(i, 1); }
        for (let i = floatingTexts.length - 1; i >= 0; i--) { let t = floatingTexts[i]; t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; if (t.alpha <= 0) floatingTexts.splice(i, 1); }

        if (p1 && enemies.length > 0 && !gameOver && introTimer === 0) {
            let targetDist = Math.abs(closestE.x - p1.x); let targetZoom = 1;
            if (targetDist > 300) targetZoom = 0.85; if (targetDist < 150) targetZoom = 1.1; zoomLevel += (targetZoom - zoomLevel) * 0.05;
        }
    }

    function drawCharacter(ctx, p, isTrail = false) {
        if(!p || isNaN(p.x) || isNaN(p.y)) return;
        ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
        let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
        let maxT = (p.state === 'punch') ? 15 : 20; let pext = 0; if (p.state === 'punch' && p.comboStep === 1) pext = 10;
        let progress = (p.attackTimer > 0) ? 1 - (p.attackTimer / maxT) : 0; let ext = Math.sin(progress * Math.PI);

        let hitSquash = p.hitStun > 0 ? 0.85 : 1; ctx.scale(1 / hitSquash, hitSquash);

        if (p.drawMethod) { try { p.drawMethod(ctx, p, bounce, ext, pext, isTrail); ctx.restore(); return; } catch (e) { console.error("Lỗi thực thi mã drawCode:", e); } }
        if (p.state === 'dash' || p.state === 'dash_back') bounce = -10; if (!p.onGround) bounce = -20;
        let s = (p.scaleMod || 1);
        if (p.state === 'punch') { bounce -= 5; s *= 1.1; }
        if (p.state === 'kick') { bounce -= 10; s *= 1.15; }
        if (p.state === 'hurt' || p.state === 'stunned') { bounce = -5; if(p.state==='stunned') bounce += Math.sin(Date.now()/30)*3; ctx.rotate(p.state==='stunned'? 0.1 : -0.2); }

        let imgSize = 70 * s;

        if (!isTrail && p.y >= GROUND_Y) {
            ctx.save(); ctx.scale(1, -0.3); ctx.globalAlpha = 0.2; let img = imageCache[p.classId]; if (img && img.complete) { ctx.drawImage(img, -imgSize/2, -imgSize - 10, imgSize, imgSize); } ctx.restore();
        }

        // TÍNH TOÁN VẼ TỨ CHI HOẠT HÌNH DI CHUYỂN TÁCH RỜI MƯỢT MÀ THEO PHONG CÁCH BRAWLHALLA
        let walkCycle = p.state === 'walk' ? Date.now() / 80 : 0;
        let armL_X = Math.sin(walkCycle) * 15;
        let armR_X = -Math.sin(walkCycle) * 15;
        let legL_X = Math.cos(walkCycle) * 12;
        let legR_X = -Math.cos(walkCycle) * 12;

        if (isTrail) {
            if (p.iFrames > 0 && Math.floor(Date.now() / 50) % 2 === 0) { ctx.globalAlpha = 0.5; } else { ctx.globalAlpha = 0.3; }
        }
        else {
            ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); let shadowW = Math.max(10, 25 * s - (GROUND_Y - p.y) * 0.2); ctx.ellipse(0, GROUND_Y - p.y, shadowW, 6 * s, 0, 0, Math.PI*2); ctx.fill();
            if (p.iFrames > 0 && Math.floor(Date.now() / 50) % 2 === 0) ctx.globalAlpha = 0.5;
        }

        // Vẽ Khớp Chân Phía Sau
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath(); ctx.arc(-10 * s + legL_X, bounce, 8 * s, 0, Math.PI * 2); ctx.fill();

        let img = imageCache[p.classId];
        if (img && img.complete) {
            ctx.drawImage(img, -imgSize/2, -imgSize + bounce + 10, imgSize, imgSize);

            if (p.flashTimer > 0) {
                ctx.globalCompositeOperation = "source-atop"; ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.fillRect(-imgSize/2, -imgSize + bounce + 10, imgSize, imgSize); ctx.globalCompositeOperation = "source-over";
            }

            ctx.fillStyle = p.color;
            if (p.state === 'punch') {
                ctx.beginPath(); ctx.arc(imgSize/2 + 10 * ext, -imgSize/2 + bounce, 12 * s, 0, Math.PI*2); ctx.fill();
            } else if (p.state === 'kick') {
                ctx.beginPath(); ctx.arc(imgSize/2 + 18 * ext, -10 + bounce, 15 * s, 0, Math.PI*2); ctx.fill();
            } else if (p.state === 'block') {
                ctx.beginPath(); ctx.arc(10, -imgSize/2 + bounce + 10, imgSize/2 + 8, -Math.PI/2.5, Math.PI/2.5); ctx.lineWidth = 6; ctx.strokeStyle = "rgba(52, 152, 219, 0.9)"; ctx.stroke(); ctx.fillStyle = "rgba(52, 152, 219, 0.3)"; ctx.fill();
            } else {
                // Tay bình thường đập nhịp khi chạy
                ctx.beginPath(); ctx.arc(12 * s + armL_X, -imgSize/3 + bounce, 7 * s, 0, Math.PI*2); ctx.fill();
            }
            if (p.state === 'stunned') { ctx.fillStyle = "#f1c40f"; ctx.font = `${14*s}px Arial`; let rotX = Math.sin(Date.now()/100) * 15; ctx.fillText("💫", rotX, -imgSize + bounce - 5); }
        } else {
            ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, -35 + bounce, 25 * s, 0, Math.PI*2); ctx.fill();
        }

        // Vẽ Khớp Chân Phía Trước
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(10 * s + legR_X, bounce, 9 * s, 0, Math.PI * 2); ctx.fill();

        if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30 * s, 50 * s, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.2)"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(52, 152, 219, 0.9)"; ctx.stroke(); }
        if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -imgSize/2 + bounce, imgSize/2 + 5, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }

        ctx.restore();
    }

    function drawAnnouncer(ctx, text, color, x, y, size = 32) { ctx.save(); ctx.font = `italic 900 ${size}px Arial`; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "#111"; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.shadowBlur = 15; ctx.shadowColor = color; ctx.fillText(text, x, y); ctx.restore(); }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save();
        
        let aliveEnemies = enemies ? enemies.filter(e => e.hp > 0) : [];
        let closestE = aliveEnemies.length > 0 ? aliveEnemies.reduce((prev, curr) => Math.abs(curr.x - p1.x) < Math.abs(prev.x - p1.x) ? curr : prev) : (enemies[0] || p1);

        if (slowMoTimer > 0) { let loser = (p1.hp <= 0) ? p1 : closestE; let targetCamX = (canvas.width / 2) - loser.x; camX += (targetCamX - camX) * 0.1; ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(1.2, 1.2); ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); }
        else if (p1 && enemies && enemies.length > 0 && !gameOver && introTimer === 0) {
            let centerX = (p1.x + closestE.x) / 2; let targetCamX = (canvas.width / 2) - centerX; targetCamX = Math.max(-60, Math.min(60, targetCamX)); camX += (targetCamX - camX) * 0.1;
            ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(zoomLevel, zoomLevel); ctx.translate(-canvas.width/2 + camX, -canvas.height/2);
        }
        
        if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag);
        if (screenFlash > 0.4 && isGlitching) { ctx.translate((Math.random()-0.5)*10, 0); ctx.globalCompositeOperation = "screen"; }

        if (mangaKO && slowMoTimer > 0) { ctx.fillStyle = "#fff"; ctx.fillRect(-400, -100, canvas.width + 800, canvas.height + 100); }
        else { ctx.fillStyle = "#1e272e"; ctx.fillRect(-400, -100, canvas.width + 800, canvas.height + 100); }

        ctx.save(); let bgOffset1 = (camX * 0.2) % 120; ctx.fillStyle = mangaKO ? "#ddd" : "#2f3640"; for(let i = -240; i < canvas.width + 480; i += 120) { ctx.fillRect(i + bgOffset1, GROUND_Y - 150 + Math.sin(i)*30, 80, 150); } ctx.restore();
        ctx.save(); let bgOffset2 = (camX * 0.5) % 90; ctx.fillStyle = mangaKO ? "#bbb" : "#353b48"; for(let i = -180; i < canvas.width + 360; i += 90) { ctx.beginPath(); ctx.moveTo(i + bgOffset2, GROUND_Y); ctx.lineTo(i + 45 + bgOffset2, GROUND_Y - 100); ctx.lineTo(i + 90 + bgOffset2, GROUND_Y); ctx.fill(); } ctx.restore();

        ctx.fillStyle = mangaKO ? "#eee" : "#111"; ctx.fillRect(-400, GROUND_Y, canvas.width + 800, canvas.height - GROUND_Y);
        ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-400, GROUND_Y); ctx.lineTo(canvas.width + 400, GROUND_Y); ctx.stroke();
        ctx.strokeStyle = mangaKO ? "#ccc" : "#222"; ctx.lineWidth = 2; let gridOffset = camX % 50; for(let i = -100; i < canvas.width + 200; i+=50) { ctx.beginPath(); ctx.moveTo(i + gridOffset, GROUND_Y); ctx.lineTo(i - 20 + gridOffset, canvas.height); ctx.stroke(); }

        ctx.fillStyle = "#ff4757"; ctx.fillRect(10, 0, 5, canvas.height); ctx.fillStyle = "#1e90ff"; ctx.fillRect(canvas.width - 15, 0, 5, canvas.height);

        stageHazards.forEach(hz => {
            ctx.fillStyle = "rgba(255, 71, 87, 0.3)"; ctx.fillRect(hz.x - 60, GROUND_Y, 120, 20);
            if (hz.state === 'warning') { ctx.fillStyle = "rgba(255, 71, 87, 0.8)"; ctx.font = "20px Arial"; ctx.fillText("⚠️", hz.x, GROUND_Y - 10 + Math.sin(Date.now()/50)*5); }
            else if (hz.state === 'strike') { ctx.beginPath(); ctx.moveTo(hz.x, 0); ctx.lineTo(hz.x - 20, GROUND_Y/2); ctx.lineTo(hz.x + 10, GROUND_Y/2); ctx.lineTo(hz.x, GROUND_Y); ctx.fillStyle = "#f1c40f"; ctx.fill(); ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; ctx.shadowBlur = 0; }
        });

        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 1;
        weatherParticles.forEach(w => {
            if (currentWeather === 'snow') { ctx.beginPath(); ctx.arc(w.x + camX * 0.8, w.y, 2, 0, Math.PI*2); ctx.fill(); }
            else if (currentWeather === 'rain') { ctx.beginPath(); ctx.moveTo(w.x + camX * 0.8, w.y); ctx.lineTo(w.x - 5 + camX * 0.8, w.y + 15); ctx.stroke(); }
        });
        ctx.restore();

        traps.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); ctx.fillStyle = t.color; ctx.globalAlpha = (t.life / t.maxLife) * 0.5; ctx.fill(); ctx.globalAlpha = 1.0; });
        projectiles.forEach(proj => { ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); ctx.fillStyle = proj.color; ctx.fill(); ctx.shadowBlur = 10; ctx.shadowColor = proj.color; ctx.shadowBlur = 0;});

        ctx.globalCompositeOperation = 'lighter';
        shockwaves.forEach(sw => { ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); ctx.lineWidth = 5; ctx.strokeStyle = sw.color; ctx.globalAlpha = Math.max(0, sw.alpha); ctx.stroke(); });

        impactSparks.forEach(isp => {
            ctx.save(); ctx.translate(isp.x, isp.y); ctx.rotate(isp.angle); ctx.scale(isp.scale, isp.scale); ctx.globalAlpha = isp.life / isp.maxLife; ctx.fillStyle = isp.color;
            ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(3, -5); ctx.lineTo(30, 0); ctx.lineTo(3, 5); ctx.lineTo(0, 30); ctx.lineTo(-3, 5); ctx.lineTo(-30, 0); ctx.lineTo(-3, -5); ctx.closePath(); ctx.fill(); ctx.restore();
        });
        ctx.globalCompositeOperation = 'source-over';

        if (p1 && enemies.length > 0) {
            if (gameMode === 'boss') {
                ctx.globalAlpha = 0.5;
                for (let uid in onlinePlayersData) {
                    if (uid === currentUid) continue;
                    let op = onlinePlayersData[uid];
                    let ghostP = { x: op.x, y: GROUND_Y, state: op.state, isFacingRight: op.isFacingRight, classId: op.classId, color: "#aaa", hp: 100, maxHp: 100, shield: 0, iFrames: 0, superArmor: 0 };
                    drawCharacter(ctx, ghostP, true);
                    ctx.fillStyle = "#fff"; ctx.font = "10px Arial"; ctx.fillText(op.name, op.x, GROUND_Y - 80);
                }
                ctx.globalAlpha = 1;
            }

            let allFighters = [p1].concat(enemies);
            ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => {
                if (p && p.trailArr) {
                    p.trailArr.forEach(t => {
                        ctx.save(); ctx.translate(t.x, p.y); if (!t.isFacingRight) ctx.scale(-1, 1);
                        ctx.globalAlpha = t.alpha * 0.6; let img = imageCache[t.classId];
                        if (img && img.complete) { ctx.drawImage(img, -35, -70 + 10, 70, 70); }
                        else { ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(0, -35, 25, 0, Math.PI*2); ctx.fill(); }
                        ctx.restore();
                    });
                }
            });
            ctx.globalCompositeOperation = 'source-over';

            if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; }
            if (p1.attackTimer > 0 || p1.state === 'cast') { drawCharacter(ctx, p2); drawCharacter(ctx, p1); } else { drawCharacter(ctx, p1); drawCharacter(ctx, p2); } ctx.shadowBlur = 0;

            [p1].concat(enemies).forEach(p => {
                if (p.comboHits >= 2) {
                    let side = (p === p1) ? 30 - camX : canvas.width - 30 - camX;
                    let align = (p === p1) ? "left" : "right";
                    let col = (p === p1) ? "#ff9f43" : "#1e90ff";
                    ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = col; ctx.textAlign = align; ctx.shadowBlur = 10; ctx.shadowColor = col;
                    ctx.fillText(`🔥 ${p.comboHits} HITS!`, side, 100 + Math.sin(Date.now() / 100) * 5);
                    if (p.comboHits >= 5) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("UNSTOPPABLE!", side, 130 + Math.sin(Date.now() / 100) * 5); }
                    else if (p.comboHits >= 3) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#2ed573"; ctx.fillText("AWESOME!", side, 130 + Math.sin(Date.now() / 100) * 5); }
                    ctx.restore();
                }
            });

            if (p1.isRage && p1.hp > 0 && Math.sin(Date.now() / 100) > 0.5) { drawAnnouncer(ctx, "P1 RAGE MODE", "#ff4757", (canvas.width/4) - camX, 60); }
            if (closestE.isRage && closestE.hp > 0 && Math.sin(Date.now() / 100) > 0.5 && !closestE.isBoss) { drawAnnouncer(ctx, "ENEMY RAGE", "#ff4757", (canvas.width*0.75) - camX, 60); }
        }

        slashes.forEach(s => { ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.globalAlpha = s.life / s.maxLife; ctx.beginPath(); ctx.arc(0, 0, 40, -Math.PI/4, Math.PI/4); ctx.lineWidth = 8; ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.stroke(); ctx.restore(); });
        particles.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); }); ctx.globalAlpha = 1.0;

        ctx.textAlign = "center"; floatingTexts.forEach(t => { ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; });

        if (mangaKO && slowMoTimer > 0) {
            ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 2; ctx.beginPath();
            for(let i=0; i<100; i++) { let angle = Math.random() * Math.PI * 2; let startR = 150 + Math.random() * 50; ctx.moveTo(canvas.width/2 + Math.cos(angle)*startR, canvas.height/2 + Math.sin(angle)*startR); ctx.lineTo(canvas.width/2 + Math.cos(angle)*800, canvas.height/2 + Math.sin(angle)*800); }
            ctx.stroke();
        }
        ctx.restore();

        if (screenFlash > 0 && !isGlitching) { ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }

        if (cinematicTimer > 0 && cinematicCaster) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let stripY = canvas.height / 2 - 50; ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
            let progress = (50 - cinematicTimer) / 50; let slideX = -200 + (progress * 800);
            ctx.fillStyle = "#fff"; ctx.font = "italic 900 45px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 15; ctx.shadowColor = "#fff"; ctx.fillText(cinematicCaster.className + " ULTIMATE!", slideX, stripY + 60); ctx.shadowBlur = 0;
            let img = imageCache[cinematicCaster.classId]; if (img && img.complete) { let avaX = canvas.width - slideX; ctx.drawImage(img, avaX - 60, stripY - 60, 120, 120); }
        }

        if (gameOver && p1 && enemies && slowMoTimer <= 0) { ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.font = "bold 35px Arial"; ctx.fillStyle = p1.hp > 0 ? "#2ed573" : "#ff4757"; ctx.textAlign = "center"; ctx.fillText(p1.hp > 0 ? "K.O! BẠN ĐÃ CHIẾN THẮNG 🏆" : "K.O! BẠN ĐÃ BỊ HẠ 💥", canvas.width / 2, canvas.height / 2); }
        else if (slowMoTimer > 0) { let size = 150 - (120 - slowMoTimer); ctx.font = `italic 900 ${Math.max(50, size)}px Arial`; ctx.fillStyle = mangaKO ? "#111" : "#ff4757"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = mangaKO ? "#fff" : "#ff4757"; ctx.fillText("K.O!", canvas.width / 2, canvas.height / 2 + 20); ctx.shadowBlur = 0; }

        if (introTimer > 0 && !gameOver && enemies.length > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.textAlign = "center";
            if (introTimer > 60) {
                let slideProgress = Math.min(1, (160 - introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let slideX1 = -200 + easeOut * (canvas.width / 2 - 120); let slideX2 = canvas.width + 200 - easeOut * (canvas.width / 2 - 120);
                let img1 = imageCache[p1.classId]; if (img1 && img1.complete) { ctx.drawImage(img1, slideX1 - 50, canvas.height/2 - 100, 100, 100); }
                let img2 = imageCache[enemies[0].classId]; if (img2 && img2.complete) { ctx.save(); ctx.translate(slideX2, canvas.height/2 - 50); ctx.scale(-1, 1); ctx.drawImage(img2, -50, -50, 100, 100); ctx.restore(); }
                ctx.font = "italic 900 35px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText(p1.className, slideX1, canvas.height/2 + 40);
                ctx.fillStyle = "#1e90ff"; ctx.fillText(enemies[0].className + ((windowEnemyCount>1 && !enemies[0].isBoss) ? ` x${windowEnemyCount}` : ""), slideX2, canvas.height/2 + 40);
                if (introTimer < 130 && introTimer > 70) {
                    ctx.font = "bold 15px Arial";
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.beginPath(); ctx.roundRect(slideX1 - 30, canvas.height/2 - 150, ctx.measureText(p1.taunt).width + 20, 30, 8); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillText(p1.taunt, slideX1 - 20 + ctx.measureText(p1.taunt).width/2, canvas.height/2 - 130);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.beginPath(); ctx.roundRect(slideX2 - 40, canvas.height/2 - 150, ctx.measureText(enemies[0].taunt).width + 20, 30, 8); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillText(enemies[0].taunt, slideX2 - 30 + ctx.measureText(enemies[0].taunt).width/2, canvas.height/2 - 130);
                }
                if (introTimer <= 120) { ctx.font = "italic 900 80px Arial"; ctx.fillStyle = "#f1c40f"; ctx.shadowBlur = 25; ctx.shadowColor = "#f1c40f"; ctx.fillText("VS", canvas.width/2, canvas.height/2 - 10); ctx.shadowBlur = 0; }
            } else {
                let scale = 1 + (introTimer / 60); ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale);
                ctx.font = "italic 900 90px Arial"; ctx.fillStyle = "#ff9f43"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff9f43"; ctx.fillText("FIGHT!", 0, 30); ctx.restore();
            }
        }
    }

    let lastFrameTime = 0; const FRAME_MIN_TIME = 1000 / 60;
    function gameLoop(timestamp) {
        if (!isLoopRunning) return; requestAnimationFrame(gameLoop);
        if (!lastFrameTime) lastFrameTime = timestamp; let deltaTime = timestamp - lastFrameTime;
        if (deltaTime > 100) deltaTime = FRAME_MIN_TIME;
        if (deltaTime >= FRAME_MIN_TIME) { lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME); try { update(); } catch(e) { console.error("Lỗi update:", e); } try { draw(); } catch(e) { console.error("Lỗi draw:", e); } }
    }
