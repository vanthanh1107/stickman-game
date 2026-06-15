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
var currentPlayer = { name: "", level: 1, xp: 0, elo: 1000, coins: 0, classId: "", countryCode: "VN", countryName: "Vietnam", bonusHp: 0, bonusDmg: 0, bonusSpeed: 0 };
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
function savePlayerData() { if(!currentUid || !database || currentUid === 'offline_user') return; database.ref('players/' + currentUid).set(currentPlayer).catch(e => {}); }

function spinGacha() { 
    if (currentPlayer.coins < 100) return; 
    currentPlayer.coins -= 100; 
    let roll = Math.random();
    if (roll < 0.4) { currentPlayer.bonusHp = (currentPlayer.bonusHp || 0) + 15; }
    else if (roll < 0.7) { currentPlayer.bonusDmg = (currentPlayer.bonusDmg || 0) + 5; }
    else if (roll < 0.95) { currentPlayer.bonusSpeed = (currentPlayer.bonusSpeed || 0) + 2; }
    else { currentPlayer.bonusDmg = (currentPlayer.bonusDmg || 0) + 15; currentPlayer.bonusHp = (currentPlayer.bonusHp || 0) + 50; }
    savePlayerData(); updatePlayerUI(); 
}

function autoLoginGame(uid, playerName) {
    currentUid = uid; currentPlayer.name = playerName; document.getElementById("login-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block"; loadStatsFromGoogleSheet(); document.getElementById("loading-status").innerText = "⏳🥋...";
    if (database && uid !== 'offline_user') {
        database.ref('players/' + currentUid).once('value').then(async (snapshot) => {
            if(snapshot.exists()) { 
                let d = snapshot.val(); 
                currentPlayer.level = parseInt(d.level) || 1; currentPlayer.xp = parseInt(d.xp) || 0; currentPlayer.elo = parseInt(d.elo) || 1000; currentPlayer.coins = parseInt(d.coins) || 0; 
                currentPlayer.countryCode = d.countryCode || "VN"; currentPlayer.countryName = d.countryName || "Vietnam"; currentPlayer.classId = d.classId || ""; 
                currentPlayer.bonusHp = parseInt(d.bonusHp) || 0; currentPlayer.bonusDmg = parseInt(d.bonusDmg) || 0; currentPlayer.bonusSpeed = parseInt(d.bonusSpeed) || 0;
            } else { let loc = await autoFetchUserCountry(); currentPlayer.countryCode = loc.code; currentPlayer.countryName = loc.name; savePlayerData(); }
            updatePlayerUI(); listenLeaderboard();
        }).catch((e) => { updatePlayerUI(); });
    } else { updatePlayerUI(); document.getElementById("loading-status").style.display = "none"; }
}

function getGameVisibleInput(className) { let els = document.querySelectorAll(className); for (let i=0; i<els.length; i++) { if (els[i].offsetParent !== null) return els[i]; } return els[0] || null; }
function focusNextVisible(className) { let el = getGameVisibleInput(className); if(el) el.focus(); }
function getFlagEmoji(code) { if (!code) return "🏴"; const points = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt()); return String.fromCodePoint(...points); }

function updatePlayerUI() {
    let flag = getFlagEmoji(currentPlayer.countryCode); let nNode = document.getElementById("user-display-name"); if(nNode) nNode.innerText = flag + " " + currentPlayer.name;
    let eloNode = document.getElementById("user-display-elo"); if(eloNode) eloNode.innerText = currentPlayer.elo || 1000; 
    let coinNode = document.getElementById("user-display-coins"); if(coinNode) coinNode.innerText = (currentPlayer.coins || 0);
    let lvlNode = document.getElementById("user-display-level"); if(lvlNode) lvlNode.innerText = currentPlayer.level || 1;
    let xpNeeded = (parseInt(currentPlayer.level) || 1) * 100; let fillNode = document.getElementById("xp-fill-bar"); if(fillNode) fillNode.style.width = ((currentPlayer.xp / xpNeeded) * 100) + "%"; 
    let xpTextNode = document.getElementById("xp-text"); if(xpTextNode) xpTextNode.innerText = `${currentPlayer.xp} / ${xpNeeded} 🌟`;

    let hpB = document.getElementById("bonus-hp"); if(hpB) hpB.innerText = currentPlayer.bonusHp || 0;
    let dmgB = document.getElementById("bonus-dmg"); if(dmgB) dmgB.innerText = currentPlayer.bonusDmg || 0;
    let spdB = document.getElementById("bonus-spd"); if(spdB) spdB.innerText = currentPlayer.bonusSpeed || 0;
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
        if (selectEl) { let cur = selectEl.value || currentPlayer.countryCode || "VN"; selectEl.innerHTML = ""; for (let code in countriesFound) { let opt = document.createElement("option"); opt.value = code; opt.innerText = getFlagEmoji(code) + " " + countriesFound[code]; if (code === cur) opt.selected = true; selectEl.appendChild(opt); } }
        if (document.getElementById("tab-country").classList.contains("active")) renderCountryPlayers();
    });
}
function renderCountryPlayers() { let selectEl = document.getElementById("country-filter-select"); if (!selectEl) return; let code = selectEl.value; let html = ""; let filtered = latestPlayersData.filter(p => p.countryCode === code); filtered.forEach((p, idx) => { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); html += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>🏆 ${parseInt(p.elo)||1000}</span></div>`; }); document.getElementById("country-players-inner").innerHTML = html || "⏳"; }

async function loadStatsFromGoogleSheet() { 
    try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 5000); const res = await fetch(SHEET_URL, { signal: c.signal }); clearTimeout(t); const csv = await res.text(); parseCSVData(csv); } catch (e) {} finally { 
        if (Object.keys(window.classStats).length === 0) { window.classStats = { 'dausi': { className: "Boxer", hp: 250, speed: 3.5, dmgMod: 1.2, regen: 0.3, avatarUrl: "", drawMethod: null, skill: {} }, 'satthu': { className: "Assassin", hp: 180, speed: 4.5, dmgMod: 1.5, regen: 0.2, avatarUrl: "", drawMethod: null, skill: {} } }; } 
        if (typeof window.renderCharacterGrid === 'function') window.renderCharacterGrid(); 
        document.getElementById("loading-status").style.display = "none"; document.getElementById("menu-content").style.display = "flex"; 
    } 
}

function parseCSVData(csvText) {
    let result = []; let row = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) { let char = csvText[i]; if (char === '"') { if (inQuotes && csvText[i+1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { row.push(cur.trim()); cur = ''; } else if ((char === '\n' || char === '\r') && !inQuotes) { if (char === '\r' && csvText[i+1] === '\n') i++; row.push(cur.trim()); result.push(row); row = []; cur = ''; } else { cur += char; } }
    if (cur || row.length > 0) { row.push(cur.trim()); result.push(row); } if (result.length < 2) return;
    let headers = result[0];
    for (let i = 1; i < result.length; i++) {
        let values = result[i]; if (values.length < headers.length && values.join('') === '') continue; let rowObj = {}; headers.forEach((h, idx) => rowObj[h] = values[idx] || "");
        if (rowObj.id) {
            let ac1 = null, ac2 = null, ac3 = null; try { if (rowObj.skill1Code) ac1 = new Function('p', 'target', 'gameContext', rowObj.skill1Code); } catch (e) {} try { if (rowObj.skill2Code) ac2 = new Function('p', 'target', 'gameContext', rowObj.skill2Code); } catch (e) {} try { if (rowObj.skill3Code) ac3 = new Function('p', 'target', 'gameContext', rowObj.skill3Code); } catch (e) {}
            let dm = null; try { if (rowObj.drawCode) dm = new Function('ctx', 'p', 'bounce', 'ext', 'pext', 'isTrail', rowObj.drawCode); } catch (e) { }
            window.classStats[rowObj.id] = { className: rowObj.className || "Unknown", hp: parseInt(rowObj.hp)||200, speed: (parseFloat(rowObj.speed)||1) * 3, dmgMod: parseFloat(rowObj.dmgMod)||1, regen: parseFloat(rowObj.regen)||0.3, avatarUrl: rowObj.avatarUrl || "", drawMethod: dm, skill: { actionCode1: ac1, actionCode2: ac2, actionCode3: ac3 } };
        }
    }
}
