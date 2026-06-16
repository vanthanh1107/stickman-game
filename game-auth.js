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
function savePlayerData() { if(!currentUid || !database || currentUid === 'offline_user') return; database.ref('players/' + currentUid).set(currentPlayer).catch(e => {}); }

function spinGacha() { 
    if (currentPlayer.coins < 100) return; 
    currentPlayer.coins -= 100; 
    let roll = Math.random();
    if (roll < 0.4) { currentPlayer.bonusHp = (currentPlayer.bonusHp || 0) + 15; }
    else if (roll < 0.7) { currentPlayer.bonusDmg = (currentPlayer.bonusDmg || 0) + 5; }
    else if (roll < 0.90) { currentPlayer.bonusSpeed = (currentPlayer.bonusSpeed || 0) + 2; }
    else if (roll < 0.98) { currentPlayer.bonusCrit = (currentPlayer.bonusCrit || 0) + 2; }
    else { currentPlayer.bonusDmg = (currentPlayer.bonusDmg || 0) + 15; currentPlayer.bonusHp = (currentPlayer.bonusHp || 0) + 50; currentPlayer.bonusCrit = (currentPlayer.bonusCrit || 0) + 5; }
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
                currentPlayer.bonusHp = parseInt(d.bonusHp) || 0; currentPlayer.bonusDmg = parseInt(d.bonusDmg) || 0; currentPlayer.bonusSpeed = parseInt(d.bonusSpeed) || 0; currentPlayer.bonusCrit = parseInt(d.bonusCrit) || 0;
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
    let eloNode = document.getElementById
