const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH4sd570saD4qD4rPTVqVdXYmgpiwghIyIMQoIXjA0fWYqIAXjXqFym_nNTKg4H6nCds1qNG6X902B/pub?output=csv"; 
const classImages = { 'dausi': 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=ffdfbf', 'phapsu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka&backgroundColor=c0aede', 'satthu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Shadow&backgroundColor=ffdfbf', 'hove': 'https://api.dicebear.com/7.x/adventurer/png?seed=Knight&backgroundColor=b6e3f4', 'thichkhach': 'https://api.dicebear.com/7.x/adventurer/png?seed=Loki&backgroundColor=c0aede' };

let currentUid = ""; 
let currentPlayer = { name: "", level: 1, xp: 0, classId: "", countryCode: "VN", countryName: "Vietnam" };
let classStats = {}; 
let selectedRedClass = ""; 
let latestPlayersData = [];

let database = null;
try {
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = { apiKey: "AIzaSyDZ1g9V9K9X4gWcBRsGkDEN9OEnWuKgXzg", authDomain: "vietnamspacex-be507.firebaseapp.com", databaseURL: "https://vietnamspacex-be507-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "vietnamspacex-be507" };
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
    }
} catch(e) {
    console.warn("Firebase Init Blocked:", e);
}

document.addEventListener("DOMContentLoaded", function() {
    let authText = document.getElementById("auth-status-text");
    let authForm = document.getElementById("game-auth-form");

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                let realName = user.displayName || (user.email ? user.email.split('@')[0] : "Khách");
                autoLoginGame(user.uid, realName);
            } else {
                authText.innerText = "Vui lòng đăng nhập để lưu cấp độ xếp hạng!";
                authForm.style.display = "block";
            }
        });
    } else {
        authText.innerText = "Lỗi kết nối máy chủ. Trải nghiệm chế độ Offline ngay!";
        authForm.innerHTML = `<button type="button" class="game-btn-solid" onclick="autoLoginGame('offline_user', 'Khách')" style="background: #f1c40f; color: #111; box-shadow: 0 0 15px rgba(241,196,15,0.5);">BẮT ĐẦU CHƠI THỬ</button>`;
        authForm.style.display = "block";
    }
});

async function autoFetchUserCountry() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); 
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        return { code: data.country || "VN", name: data.country_name || "Vietnam" };
    } catch (e) { return { code: "VN", name: "Vietnam" }; }
}

function getFlagEmoji(countryCode) {
    if (!countryCode) return "🏳️";
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function getGameVisibleInput(className) {
    let elements = document.querySelectorAll(className);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].offsetParent !== null) { return elements[i]; }
    }
    return elements[0] || null;
}
 
function focusNextVisible(className) { let el = getGameVisibleInput(className); if(el) el.focus(); }

function fallbackLogin() {
    autoLoginGame('offline_user', 'Khách Demo');
}

function gameLoginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    document.getElementById('game-auth-form').style.display = 'none';
    document.getElementById('auth-status-text').innerText = "Đang kết nối với Google...";
    firebase.auth().signInWithPopup(provider).catch((error) => {
        document.getElementById('auth-status-text').innerText = "Đăng nhập thất bại. Vui lòng thử lại.";
        document.getElementById('game-auth-form').style.display = 'block';
    });
}

function gameLoginWithEmail() {
    let emailEl = getGameVisibleInput('.game-email-target');
    let passEl = getGameVisibleInput('.game-pass-target');
    let email = emailEl ? emailEl.value.trim() : ""; let pass = passEl ? passEl.value : ""; 
    if(!email || !pass) { alert("Vui lòng nhập đầy đủ Email và Mật khẩu!"); return; }

    document.getElementById('game-auth-form').style.display = 'none';
    document.getElementById('auth-status-text').innerText = "Đang kiểm tra hồ sơ chiến binh...";
    
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        alert("Lỗi đăng nhập: " + error.message);
        document.getElementById('auth-status-text').innerText = "Vui lòng đăng nhập để tham gia đấu trường sinh tử";
        document.getElementById('game-auth-form').style.display = 'block';
    });
}

function gameRegisterWithEmail() {
    let emailEl = getGameVisibleInput('.game-email-target');
    let passEl = getGameVisibleInput('.game-pass-target');
    let email = emailEl ? emailEl.value.trim() : ""; let pass = passEl ? passEl.value : "";
    if(!email || !pass) { alert("Vui lòng nhập đầy đủ Email và Mật khẩu để Đăng ký!"); return; }

    document.getElementById('game-auth-form').style.display = 'none';
    document.getElementById('auth-status-text').innerText = "Đang rèn giũa thẻ bài chiến binh mới...";
    
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
        alert("Lỗi đăng ký: " + error.message);
        document.getElementById('auth-status-text').innerText = "Vui lòng đăng nhập để tham gia đấu trường sinh tử";
        document.getElementById('game-auth-form').style.display = 'block';
    });
}

function savePlayerData() {
    if(!currentUid || !database || currentUid === 'offline_user') return;
    database.ref('players/' + currentUid).set(currentPlayer).catch(e => console.error(e));
}

function autoLoginGame(uid, playerName) {
    currentUid = uid; currentPlayer.name = playerName;
    document.getElementById("login-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block";
    
    loadStatsFromGoogleSheet(); 
    document.getElementById("loading-status").innerText = "⏳ Đang tải dữ liệu...";
    
    if (database && uid !== 'offline_user') {
        database.ref('players/' + currentUid).once('value').then(async (snapshot) => {
            if(snapshot.exists()) {
                let data = snapshot.val();
                currentPlayer.level = parseInt(data.level) || 1;
                currentPlayer.xp = parseInt(data.xp) || 0;
                currentPlayer.countryCode = data.countryCode || "VN";
                currentPlayer.countryName = data.countryName || "Vietnam";
                currentPlayer.classId = data.classId || "";
            } else {
                let locationData = await autoFetchUserCountry();
                currentPlayer.countryCode = locationData.code;
                currentPlayer.countryName = locationData.name;
                savePlayerData();
            }
            updatePlayerUI(); listenLeaderboard();
        }).catch((e) => {
            updatePlayerUI(); 
            document.getElementById("loading-status").innerHTML = `<span style="color:#ff4757;">Chơi Offline (Lưu ý: Bạn cần mở Rules Firebase)</span>`;
        });
    } else {
        updatePlayerUI();
        document.getElementById("loading-status").style.display = "none";
    }
}

function updatePlayerUI() {
    let flag = getFlagEmoji(currentPlayer.countryCode);
    document.getElementById("user-display-name").innerText = flag + " " + currentPlayer.name;
    
    let currentLvl = parseInt(currentPlayer.level) || 1;
    let currentXp = parseInt(currentPlayer.xp) || 0;
    
    document.getElementById("user-display-level").innerText = currentLvl;
    document.getElementById("xp-fill-bar").style.width = ((currentXp / (currentLvl * 100)) * 100) + "%";
    document.getElementById("xp-text").innerText = `XP: ${currentXp} / ${currentLvl * 100}`;
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
        latestPlayersData = []; 
        let countriesFound = {};

        snapshot.forEach((child) => { 
            let p = child.val();
            if(p) {
                latestPlayersData.push(p); 
                if (p.countryCode) countriesFound[p.countryCode] = p.countryName || p.countryCode;
            }
        });
        
        latestPlayersData.sort((a, b) => {
            let lvlA = parseInt(a.level) || 1;
            let lvlB = parseInt(b.level) || 1;
            let xpA = parseInt(a.xp) || 0;
            let xpB = parseInt(b.xp) || 0;

            if (lvlB !== lvlA) return lvlB - lvlA;
            return xpB - xpA;
        });
        
        let globalHTML = "";
        let displayCount = 0;
        latestPlayersData.forEach((p, idx) => {
            if (displayCount < 10) {
                let topClass = (idx === 0) ? "top1" : "";
                let flag = getFlagEmoji(p.countryCode);
                globalHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>Lv.${parseInt(p.level)||1}</span></div>`;
                displayCount++;
            }
        });
        document.getElementById("leaderboard-list").innerHTML = globalHTML || "<p style='text-align:center;color:#aaa;'>Chưa có ai lên bảng!</p>";

        let
