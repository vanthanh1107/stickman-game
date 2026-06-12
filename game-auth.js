const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH4sd570saD4qD4rPTVqVdXYmgpiwghIyIMQoIXjA0fWYqIAXjXqFym_nNTKg4H6nCds1qNG6X902B/pub?output=csv"; 
const classImages = { 'dausi': 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=ffdfbf', 'phapsu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka&backgroundColor=c0aede', 'satthu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Shadow&backgroundColor=ffdfbf', 'hove': 'https://api.dicebear.com/7.x/adventurer/png?seed=Knight&backgroundColor=b6e3f4', 'thichkhach': 'https://api.dicebear.com/7.x/adventurer/png?seed=Loki&backgroundColor=c0aede' };

// Kéo toàn bộ biến ra chuẩn VAR để chia sẻ với game-core.js
var currentUid = ""; 
var currentPlayer = { name: "", level: 1, xp: 0, classId: "", countryCode: "VN", countryName: "Vietnam" };
var classStats = {}; 
var selectedRedClass = ""; 
var latestPlayersData = [];
var database = null;

try {
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = { apiKey: "AIzaSyDZ1g9V9K9X4gWcBRsGkDEN9OEnWuKgXzg", authDomain: "vietnamspacex-be507.firebaseapp.com", databaseURL: "https://vietnamspacex-be507-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "vietnamspacex-be507" };
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
    }
} catch(e) {
    console.warn("Firebase Init Blocked:", e);
}

// Chống treo Blogspot bằng cơ chế Auto-Polling
function initAuthSystem() {
    let authText = document.getElementById("auth-status-text");
    let authForm = document.getElementById("game-auth-form");

    if (!authText || !authForm) return false;

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
    return true;
}

let waitDOM = setInterval(() => {
    if (initAuthSystem()) {
        clearInterval(waitDOM);
    }
}, 200);

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
    document.getElementById('auth-status-text').innerText = "Đang kiểm hồ sơ chiến binh...";
    
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

        let selectEl = document.getElementById("country-filter-select");
        if (selectEl) {
            let currentSelection = selectEl.value || currentPlayer.countryCode || "VN";
            selectEl.innerHTML = "";
            for (let code in countriesFound) {
                let opt = document.createElement("option"); opt.value = code;
                opt.innerText = getFlagEmoji(code) + " " + countriesFound[code];
                if (code === currentSelection) opt.selected = true;
                selectEl.appendChild(opt);
            }
        }
        if (document.getElementById("tab-country").classList.contains("active")) renderCountryPlayers();
    });
}

function renderCountryPlayers() {
    let selectEl = document.getElementById("country-filter-select");
    if (!selectEl) return;
    let selectedCountry = selectEl.value; 
    let countryHTML = "";
    let filteredPlayers = latestPlayersData.filter(p => p.countryCode === selectedCountry);
    filteredPlayers.forEach((p, idx) => {
        let topClass = (idx === 0) ? "top1" : "";
        let flag = getFlagEmoji(p.countryCode);
        countryHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>Lv.${parseInt(p.level)||1}</span></div>`;
    });
    document.getElementById("country-players-inner").innerHTML = countryHTML || "<p style='text-align:center;color:#aaa;'>Chưa có chiến binh nào!</p>";
}

async function loadStatsFromGoogleSheet() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        const response = await fetch(SHEET_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        const csvText = await response.text();
        parseCSVData(csvText);
    } catch (error) {
        console.warn("Mạng lỗi, sử dụng dữ liệu dự phòng");
    } finally {
        if (Object.keys(classStats).length === 0) {
            classStats = {
                'dausi': { className: "Võ Sĩ Quyền Anh", hp: 250, speed: 3.5, dmgMod: 1.2, regen: 0.3, avatarUrl: "", drawMethod: null, skill: {} },
                'satthu': { className: "Sát Thủ Bóng Đêm", hp: 180, speed: 4.5, dmgMod: 1.5, regen: 0.2, avatarUrl: "", drawMethod: null, skill: {} }
            };
        }
        if(typeof renderCharacterGrid === 'function') renderCharacterGrid(); 
        document.getElementById("loading-status").style.display = "none";
        document.getElementById("menu-content").style.display = "flex";
    }
}

function parseCSVData(csvText) {
    let result = []; let row = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) {
        let char = csvText[i];
        if (char === '"') {
            if (inQuotes && csvText[i+1] === '"') { cur += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (char === ',' && !inQuotes) {
            row.push(cur.trim()); cur = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && csvText[i+1] === '\n') i++; 
            row.push(cur.trim()); result.push(row); row = []; cur = '';
        } else { cur += char; }
    }
    if (cur || row.length > 0) { row.push(cur.trim()); result.push(row); }
    if (result.length < 2) return;
    
    let headers = result[0];
    for (let i = 1; i < result.length; i++) {
        let values = result[i];
        if (values.length < headers.length && values.join('') === '') continue; 
        let rowObj = {};
        headers.forEach((h, idx) => rowObj[h] = values[idx] || "");
        
        if (rowObj.id) {
            let actionCode1 = null, actionCode2 = null, actionCode3 = null;
            try { if (rowObj.skill1Code) actionCode1 = new Function('p', 'target', 'gameContext', rowObj.skill1Code); } catch (e) {}
            try { if (rowObj.skill2Code) actionCode2 = new Function('p', 'target', 'gameContext', rowObj.skill2Code); } catch (e) {}
            try { if (rowObj.skill3Code) actionCode3 = new Function('p', 'target', 'gameContext', rowObj.skill3Code); } catch (e) {}

            let drawMethod = null;
            try { 
                if (rowObj.drawCode) {
                    drawMethod = new Function('ctx', 'p', 'bounce', 'ext', 'pext', 'isTrail', rowObj.drawCode); 
                }
            } catch (e) {
                console.error("Lỗi biên dịch drawCode của nhân vật " + rowObj.id, e);
            }

            classStats[rowObj.id] = { 
                className: rowObj.className || "Ẩn Danh", 
                hp: parseInt(rowObj.hp)||200, 
                speed: (parseFloat(rowObj.speed)||1) * 3,
                dmgMod: parseFloat(rowObj.dmgMod)||1,
                regen: parseFloat(rowObj.regen)||0.3,
                avatarUrl: rowObj.avatarUrl || "", 
                drawMethod: drawMethod, 
                skill: { actionCode1: actionCode1, actionCode2: actionCode2, actionCode3: actionCode3 }
            };
        }
    }
}
