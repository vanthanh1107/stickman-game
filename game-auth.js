var SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH4sd570saD4qD4rPTVqVdXYmgpiwghIyIMQoIXjA0fWYqIAXjXqFym_nNTKg4H6nCds1qNG6X902B/pub?output=csv"; 
var classImages = { 
    'dausi': 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=ffdfbf', 
    'phapsu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka&backgroundColor=c0aede', 
    'satthu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Shadow&backgroundColor=ffdfbf', 
    'hove': 'https://api.dicebear.com/7.x/adventurer/png?seed=Knight&backgroundColor=b6e3f4', 
    'thichkhach': 'https://api.dicebear.com/7.x/adventurer/png?seed=Loki&backgroundColor=c0aede' 
};

var imageCache = {};
for (var key in classImages) { imageCache[key] = new Image(); imageCache[key].src = classImages[key]; }

var currentUid = ""; 
var currentPlayer = { name: "", level: 1, xp: 0, elo: 1000, coins: 0, classId: "", countryCode: "VN", countryName: "Vietnam", bonusHp: 0, bonusDmg: 0, bonusSpeed: 0, bonusCrit: 0 };
window.classStats = {}; 
var selectedRedClass = ""; 
var latestPlayersData = [];
var database = null;

try { if (typeof firebase !== 'undefined') { const firebaseConfig = { apiKey: "AIzaSyDZ1g9V9K9X4gWcBRsGkDEN9OEnWuKgXzg", authDomain: "vietnamspacex-be507.firebaseapp.com", databaseURL: "https://vietnamspacex-be507-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "vietnamspacex-be507" }; firebase.initializeApp(firebaseConfig); database = firebase.database(); } } catch(e) { }

function initAuthSystem() {
    let authText = document.getElementById("auth-status-text"); let authForm = document.getElementById("game-auth-form");
    if (!authText || !authForm) return false;
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) { 
            if (user) { 
                let realName = user.displayName || (user.email ? user.email.split('@')[0] : "👤"); 
                autoLoginGame(user.uid, realName); 
            } else { 
                authText.innerText = "🔐"; authForm.style.display = "block"; 
            } 
        });
    } else { 
        authText.innerText = "🚫📶"; authForm.innerHTML = `<button type="button" class="game-btn-solid" onclick="autoLoginGame('offline_user', '👤')" style="background: #f1c40f; color: #111;">🥊</button>`; authForm.style.display = "block"; 
    }
    return true;
}
var waitDOM = setInterval(() => { if (initAuthSystem()) clearInterval(waitDOM); }, 200);

async function autoFetchUserCountry() { try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 3000); const res = await fetch('https://ipapi.co/json/', { signal: c.signal }); clearTimeout(t); const data = await res.json(); return { code: data.country || "VN", name: data.country_name || "Vietnam" }; } catch (e) { return { code: "VN", name: "Vietnam" }; } }
function gameLoginWithGoogle() { let p = new firebase.auth.GoogleAuthProvider(); document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = "⏳🌐"; firebase.auth().signInWithPopup(p).catch(() => { document.getElementById('game-auth-form').style.display = 'block'; }); }
function gameLoginWithEmail() { let e = getGameVisibleInput('.game-email-target'); let p = getGameVisibleInput('.game-pass-target'); let em = e ? e.value.trim() : ""; let pa = p ? p.value : ""; if(!em || !pa) return; document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = "⏳"; firebase.auth().signInWithEmailAndPassword(em, pa).catch(function(err) { document.getElementById('game-auth-form').style.display = 'block'; }); }
function gameRegisterWithEmail() { let e = getGameVisibleInput('.game-email-target'); let p = getGameVisibleInput('.game-pass-target'); let em = e ? e.value.trim() : ""; let pa = p ? p.value : ""; if(!em || !pa) return; document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = "⏳"; firebase.auth().createUserWithEmailAndPassword(em, pa).catch(function(err) { document.getElementById('game-auth-form').style.display = 'block'; }); }
function savePlayerData() { if(!currentUid || !database || currentUid === 'offline_user') return; database.ref('players/' + currentUid).set(window.currentPlayer).catch(e => {}); }

function spinGacha() { 
    if (window.currentPlayer.coins < 100) return; 
    window.currentPlayer.coins -= 100; 
    let roll = Math.random();
    if (roll < 0.4) { window.currentPlayer.bonusHp = (window.currentPlayer.bonusHp || 0) + 15; }
    else if (roll < 0.7) { window.currentPlayer.bonusDmg = (window.currentPlayer.bonusDmg || 0) + 5; }
    else if (roll < 0.90) { window.currentPlayer.bonusSpeed = (window.currentPlayer.bonusSpeed || 0) + 2; }
    else if (roll < 0.98) { window.currentPlayer.bonusCrit = (window.currentPlayer.bonusCrit || 0) + 2; }
    else { window.currentPlayer.bonusDmg = (window.currentPlayer.bonusDmg || 0) + 15; window.currentPlayer.bonusHp = (window.currentPlayer.bonusHp || 0) + 50; window.currentPlayer.bonusCrit = (window.currentPlayer.bonusCrit || 0) + 5; }
    savePlayerData(); updatePlayerUI(); 
}

function autoLoginGame(uid, playerName) {
    currentUid = uid; window.currentPlayer.name = playerName; document.getElementById("login-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block"; loadStatsFromGoogleSheet(); document.getElementById("loading-status").innerText = "⏳🥋...";
    if (database && uid !== 'offline_user') {
        database.ref('players/' + currentUid).once('value').then(async (snapshot) => {
            if(snapshot.exists()) { 
                let d = snapshot.val(); 
                window.currentPlayer.level = parseInt(d.level) || 1; window.currentPlayer.xp = parseInt(d.xp) || 0; window.currentPlayer.elo = parseInt(d.elo) || 1000; window.currentPlayer.coins = parseInt(d.coins) || 0; 
                window.currentPlayer.countryCode = d.countryCode || "VN"; window.currentPlayer.countryName = d.countryName || "Vietnam"; window.currentPlayer.classId = d.classId || ""; 
                window.currentPlayer.bonusHp = parseInt(d.bonusHp) || 0; window.currentPlayer.bonusDmg = parseInt(d.bonusDmg) || 0; window.currentPlayer.bonusSpeed = parseInt(d.bonusSpeed) || 0; window.currentPlayer.bonusCrit = parseInt(d.bonusCrit) || 0;
            } else { let loc = await autoFetchUserCountry(); window.currentPlayer.countryCode = loc.code; window.currentPlayer.countryName = loc.name; savePlayerData(); }
            updatePlayerUI(); listenLeaderboard();
        }).catch((e) => { updatePlayerUI(); });
    } else { updatePlayerUI(); document.getElementById("loading-status").style.display = "none"; }
}

function getGameVisibleInput(className) { let els = document.querySelectorAll(className); for (let i=0; i<els.length; i++) { if (els[i].offsetParent !== null) return els[i]; } return els[0] || null; }
function focusNextVisible(className) { let el = getGameVisibleInput(className); if(el) el.focus(); }
function getFlagEmoji(code) { if (!code) return "🏴"; const points = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt()); return String.fromCodePoint(...points); }

function updatePlayerUI() {
    let flag = getFlagEmoji(window.currentPlayer.countryCode); let nNode = document.getElementById("user-display-name"); if(nNode) nNode.innerText = flag + " " + window.currentPlayer.name;
    let eloNode = document.getElementById("user-display-elo"); if(eloNode) eloNode.innerText = window.currentPlayer.elo || 1000; 
    let coinNode = document.getElementById("user-display-coins"); if(coinNode) coinNode.innerText = (window.currentPlayer.coins || 0);
    let lvlNode = document.getElementById("user-display-level"); if(lvlNode) lvlNode.innerText = window.currentPlayer.level || 1;
    let xpNeeded = (parseInt(window.currentPlayer.level) || 1) * 100; let fillNode = document.getElementById("xp-fill-bar"); if(fillNode) fillNode.style.width = ((window.currentPlayer.xp / xpNeeded) * 100) + "%"; 
    let xpTextNode = document.getElementById("xp-text"); if(xpTextNode) xpTextNode.innerText = `${window.currentPlayer.xp} / ${xpNeeded} 🌟`;
}

function switchLeaderboard(type) { document.getElementById("leaderboard-list").style.display = (type === 'global') ? "block" : "none"; document.getElementById("country-leaderboard-list").style.display = (type === 'global') ? "none" : "block"; document.getElementById("tab-global").classList.toggle("active", type === 'global'); document.getElementById("tab-country").classList.toggle("active", type === 'country'); if (type === 'country') renderCountryPlayers(); }
function listenLeaderboard() {
    if (!database) return;
    database.ref('players').on('value', (snapshot) => {
        latestPlayersData = []; let countriesFound = {}; snapshot.forEach((c) => { let p = c.val(); if(p) { latestPlayersData.push(p); if (p.countryCode) countriesFound[p.countryCode] = p.countryName || p.countryCode; } });
        latestPlayersData.sort((a, b) => { return (parseInt(b.elo) || 1000) - (parseInt(a.elo) || 1000); }); let globalHTML = ""; let displayCount = 0;
        latestPlayersData.forEach((p, idx) => { if (displayCount < 10) { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); globalHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>🏆 ${parseInt(p.elo)||1000}</span></div>`; displayCount++; } });
        document.getElementById("leaderboard-list").innerHTML = globalHTML || "⏳";
        let selectEl = document.getElementById("country-filter-select");
        if (selectEl) { let cur = selectEl.value || window.currentPlayer.countryCode || "VN"; selectEl.innerHTML = ""; for (let code in countriesFound) { let opt = document.createElement("option"); opt.value = code; opt.innerText = getFlagEmoji(code) + " " + countriesFound[code]; if (code === cur) opt.selected = true; selectEl.appendChild(opt); } }
        if (document.getElementById("tab-country").classList.contains("active")) renderCountryPlayers();
    });
}
function renderCountryPlayers() { let selectEl = document.getElementById("country-filter-select"); if (!selectEl) return; let code = selectEl.value; let html = ""; let filtered = latestPlayersData.filter(p => p.countryCode === code); filtered.forEach((p, idx) => { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); html += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>🏆 ${parseInt(p.elo)||1000}</span></div>`; }); document.getElementById("country-players-inner").innerHTML = html || "⏳"; }

async function loadStatsFromGoogleSheet() { 
    try { 
        const c = new AbortController(); const t = setTimeout(() => c.abort(), 5000); 
        let fetchUrl = SHEET_URL;
        if (fetchUrl.includes('?')) fetchUrl += '&t=' + Date.now(); else fetchUrl += '?t=' + Date.now();
        const res = await fetch(fetchUrl, { signal: c.signal }); clearTimeout(t); 
        const csv = await res.text(); parseCSVData(csv); 
    } catch (e) { 
        console.error("Loi load Sheet:", e); 
    } finally { 
        if (Object.keys(window.classStats).length === 0) { 
            window.classStats = { 'dausi': { className: "Boxer", hp: 250, speed: 3.5, dmgMod: 1.2, regen: 0.3, avatarUrl: "", drawMethod: null, skill: {} } }; 
        } 
        if (typeof window.renderCharacterGrid === 'function') window.renderCharacterGrid(); 
        document.getElementById("loading-status").style.display = "none"; document.getElementById("menu-content").style.display = "flex"; 
    } 
}

// BỘ ĐỌC CSV NGUYÊN BẢN CHUẨN XÁC NHẤT (Sửa 100% lỗi làm hỏng Code của bạn)
function parseCSVData(csvText) {
    if (!csvText) return;
    csvText = csvText.replace(/^\uFEFF/, ''); // Dọn rác BOM
    let arr = []; let quote = false; let row = 0; let col = 0;
    for (let c = 0; c < csvText.length; c++) {
        let cc = csvText[c], nc = csvText[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
        if (cc === '"') { quote = !quote; continue; }
        if (cc === ',' && !quote) { ++col; continue; }
        if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc === '\n' && !quote) { ++row; col = 0; continue; }
        if (cc === '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    
    if (arr.length < 2) return;
    let headers = arr[0].map(h => h.trim().toLowerCase());
    
    for (let i = 1; i < arr.length; i++) {
        let values = arr[i];
        if (values.join('').trim() === '') continue;
        let rowObj = {};
        headers.forEach((h, idx) => { rowObj[h] = values[idx] !== undefined ? values[idx].trim() : ""; });
        
        if (rowObj.id) {
            let ac1 = null, ac2 = null, ac3 = null, dm = null;
            try { if (rowObj.skill1code && rowObj.skill1code.length > 5) ac1 = new Function('p', 'target', 'gameContext', rowObj.skill1code); } catch(e){}
            try { if (rowObj.skill2code && rowObj.skill2code.length > 5) ac2 = new Function('p', 'target', 'gameContext', rowObj.skill2code); } catch(e){}
            try { if (rowObj.skill3code && rowObj.skill3code.length > 5) ac3 = new Function('p', 'target', 'gameContext', rowObj.skill3code); } catch(e){}
            try { 
                if (rowObj.drawcode && rowObj.drawcode.length > 10) {
                    dm = new Function('ctx', 'p', 'bounce', 'ext', 'pext', 'isTrail', rowObj.drawcode); 
                }
            } catch(e) { console.error("Lỗi biên dịch hình vẽ của nhân vật " + rowObj.id + ":", e); }
            
            window.classStats[rowObj.id] = {
                className: rowObj.classname || "Unknown",
                hp: parseInt(rowObj.hp) || 200,
                speed: (parseFloat(rowObj.speed) || 1) * 3,
                dmgMod: parseFloat(rowObj.dmgmod) || 1,
                regen: parseFloat(rowObj.regen) || 0.3,
                avatarUrl: rowObj.avatarurl || "",
                drawMethod: dm,
                skill: { actionCode1: ac1, actionCode2: ac2, actionCode3: ac3 }
            };
        }
    }
}
