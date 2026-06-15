var SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH4sd570saD4qD4rPTVqVdXYmgpiwghIyIMQoIXjA0fWYqIAXjXqFym_nNTKg4H6nCds1qNG6X902B/pub?output=csv"; 
var classImages = { 
    'dausi': 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=ffdfbf', 
    'phapsu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka&backgroundColor=c0aede', 
    'satthu': 'https://api.dicebear.com/7.x/adventurer/png?seed=Shadow&backgroundColor=ffdfbf', 
    'hove': 'https://api.dicebear.com/7.x/adventurer/png?seed=Knight&backgroundColor=b6e3f4', 
    'thichkhach': 'https://api.dicebear.com/7.x/adventurer/png?seed=Loki&backgroundColor=c0aede' 
};

var imageCache = {};
for (var key in classImages) { 
    imageCache[key] = new Image(); 
    imageCache[key].src = classImages[key]; 
}

var currentUid = ""; 
var currentPlayer = { name: "", level: 1, xp: 0, elo: 1000, coins: 0, classId: "", countryCode: "VN", countryName: "Vietnam" };
var classStats = {}; 
var selectedRedClass = ""; 
var latestPlayersData = [];
var database = null;

// HỆ THỐNG TỪ ĐIỂN ĐA NGÔN NGỮ (VI - EN - KO)
window.currentLang = localStorage.getItem('gameLang') || 'vi';

var langDictionary = {
    'vi': {
        'checking': 'Đang kiểm tra dữ liệu đăng nhập...', 'plz_login': 'Vui lòng đăng nhập để lưu cấp độ xếp hạng!',
        'login': 'ĐĂNG NHẬP', 'no_acc': 'Chưa có tài khoản? ', 'reg_now': 'Đăng ký ngay', 'or': 'HOẶC', 'play_gg': 'Chơi bằng Google',
        'hello': '👋 Xin chào: ', 'gold': 'Vàng', 'gacha': '🎲 GACHA', 'syncing': '⏳ Đang đồng bộ dữ liệu Võ sĩ...',
        'select_fighter': 'CHỌN CHIẾN BINH', 'loading_stats': 'Đang tải chỉ số...', 'select_mode': 'CHỌN CHẾ ĐỘ ĐẤU:',
        'enter_arena': 'BƯỚC LÊN SÀN ĐẤU 🔥', 'global_elo': '🏆 ELO TOÀN CẦU', 'country': '🌍 QUỐC GIA',
        'survival_title': '⛈️ Chế Độ Sinh Tồn: Đánh Lan Đạo Quân Máy!', 'retreat': 'Rút Lui', 'continue': 'TIẾP TỤC ➔',
        'skill1': 'CHIÊU 1', 'skill2': 'ĐẨY LÙI', 'dodge': 'NÉ ĐÒN', 'ultimate': 'TUYỆT KỸ', 'army': 'Đạo Quân Máy',
        'win_text': 'K.O! THẮNG 1 CHẤP', 'lose_text': 'K.O! BẠN ĐÃ BỊ HẠ 💥', 'reward_win': 'Thưởng:', 'reward_lose': 'Phạt:',
        'reward_comfort': 'Vàng an ủi', 'click_continue': 'Nhấn nút [TIẾP TỤC] ở góc HP để thoát sảnh'
    },
    'en': {
        'checking': 'Checking login data...', 'plz_login': 'Please login to save your rank/ELO!',
        'login': 'LOGIN', 'no_acc': "Don't have an account? ", 'reg_now': 'Register now', 'or': 'OR', 'play_gg': 'Play with Google',
        'hello': '👋 Hello: ', 'gold': 'Gold', 'gacha': '🎲 GACHA', 'syncing': '⏳ Synchronizing Fighter data...',
        'select_fighter': 'SELECT FIGHTER', 'loading_stats': 'Loading stats...', 'select_mode': 'SELECT MATCH MODE:',
        'enter_arena': 'ENTER THE ARENA 🔥', 'global_elo': '🏆 GLOBAL ELO', 'country': '🌍 COUNTRY',
        'survival_title': '⛈️ Survival Mode: Multi-Target Battle!', 'retreat': 'Retreat', 'continue': 'CONTINUE ➔',
        'skill1': 'SKILL 1', 'skill2': 'KNOCKBACK', 'dodge': 'DODGE', 'ultimate': 'ULTIMATE', 'army': 'Bot Army',
        'win_text': 'K.O! VICTORY 1 VS', 'lose_text': 'K.O! DEFEATED 💥', 'reward_win': 'Rewards:', 'reward_lose': 'Penalty:',
        'reward_comfort': 'Comfort Gold', 'click_continue': 'Press [CONTINUE] button at HP bar to exit'
    },
    'ko': {
        'checking': '로그인 데이터 확인 중...', 'plz_login': 'ELO 및 랭킹을 저장하려면 로그인하세요!',
        'login': '로그인', 'no_acc': '계정이 없으신가요? ', 'reg_now': '지금 가입', 'or': '또는', 'play_gg': 'Google로 플레이',
        'hello': '👋 안녕하세요: ', 'gold': '골드', 'gacha': '🎲 가챠', 'syncing': '⏳ 파이터 데이터 동기화 중...',
        'select_fighter': '파이터 선택', 'loading_stats': '능력치 로딩 중...', 'select_mode': '대전 모드 선택:',
        'enter_arena': '아레나 입장 🔥', 'global_elo': '🏆 글로벌 ELO', 'country': '🌍 국가별',
        'survival_title': '⛈️ 서바이벌 모드: 멀티 타겟 대전!', 'retreat': '후퇴', 'continue': '계속하기 ➔',
        'skill1': '스킬 1', 'skill2': '밀치기', 'dodge': '회피', 'ultimate': '필살기', 'army': '봇 군대',
        'win_text': 'K.O! 1 대 승리', 'lose_text': 'K.O! 패배했습니다 💥', 'reward_win': '보상:', 'reward_lose': '벌점:',
        'reward_comfort': '위로 골드', 'click_continue': '나가려면 HP 바의 [계속하기] 버튼을 누르세요'
    }
};

window.getTxt = function(key) {
    return langDictionary[window.currentLang][key] || langDictionary['en'][key] || key;
};

window.changeLanguage = function(lang) {
    window.currentLang = lang;
    localStorage.setItem('gameLang', lang);
    applyUiLanguage();
    if(typeof updateHPUIs === 'function') updateHPUIs();
    if(typeof renderCharacterGrid === 'function') renderCharacterGrid();
};

function applyUiLanguage() {
    // Cập nhật DOM tĩnh ngoài màn hình chờ
    var ids = [
        'auth-status-text', 'game-auth-form', 'char-select-title', 'btn-start', 
        'tab-global', 'tab-country', 'match-title'
    ];
    
    var selectEl = document.getElementById("enemy-count-select");
    if(selectEl) {
        selectEl.options[0].text = "⚔️ 1 vs 1 (" + (window.currentLang === 'vi' ? 'Thưởng' : window.currentLang === 'ko' ? '보상' : 'Reward') + " x1)";
        selectEl.options[1].text = "⚔️ 1 vs 2 (" + (window.currentLang === 'vi' ? 'Thưởng' : window.currentLang === 'ko' ? '보상' : 'Reward') + " x2)";
        selectEl.options[2].text = "🔥 1 vs 5 (" + (window.currentLang === 'vi' ? 'Thưởng' : window.currentLang === 'ko' ? '보상' : 'Reward') + " x5)";
        selectEl.options[3].text = "💀 1 vs 10 (" + (window.currentLang === 'vi' ? 'Thử thách' : window.currentLang === 'ko' ? '도전' : 'Challenge') + " - " + (window.currentLang === 'vi' ? 'Thưởng' : window.currentLang === 'ko' ? '보상' : 'Reward') + " x10)";
    }

    var btnExit = document.querySelector(".control-btns .game-btn");
    if (btnExit && btnExit.innerText !== "TIẾP TỤC ➔" && btnExit.innerText !== "CONTINUE ➔" && btnExit.innerText !== "계속하기 ➔") {
        btnExit.innerText = window.getTxt('retreat');
    }

    var b1 = document.getElementById("btn-s1"), b2 = document.getElementById("btn-s2"), bDodge = document.getElementById("btn-dodge"), b3 = document.getElementById("btn-s3");
    if(b1) b1.innerHTML = window.getTxt('skill1') + "<br><small>25 TL</small>";
    if(b2) b2.innerHTML = window.getTxt('skill2') + "<br><small>50 TL</small>";
    if(bDodge) bDodge.innerHTML = window.getTxt('dodge') + "<br><small>15 TL</small>";
    if(b3) b3.innerHTML = window.getTxt('ultimate') + "<br><small>100 TL</small>";
    
    // Đồng bộ giá trị hiển thị ELO/Coins
    updatePlayerUI();
}

try {
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = { apiKey: "AIzaSyDZ1g9V9K9X4gWcBRsGkDEN9OEnWuKgXzg", authDomain: "vietnamspacex-be507.firebaseapp.com", databaseURL: "https://vietnamspacex-be507-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "vietnamspacex-be507" };
        firebase.initializeApp(firebaseConfig); 
        database = firebase.database();
    }
} catch(e) { console.warn("Firebase Init Blocked:", e); }

function initAuthSystem() {
    let authText = document.getElementById("auth-status-text"); 
    let authForm = document.getElementById("game-auth-form");
    if (!authText || !authForm) return false;

    // Đặt mặc định select ngôn ngữ trên giao diện
    var selectLang = document.getElementById("lang-select");
    if(selectLang) selectLang.value = window.currentLang;
    applyUiLanguage();

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) { 
                let realName = user.displayName || (user.email ? user.email.split('@')[0] : "Khách"); 
                autoLoginGame(user.uid, realName); 
            } else { 
                authText.innerText = window.getTxt('plz_login'); 
                authForm.style.display = "block"; 
            }
        });
    } else {
        authText.innerText = "Offline Mode Active!";
        authForm.innerHTML = `<button type="button" class="game-btn-solid" onclick="autoLoginGame('offline_user', 'Guest')" style="background: #f1c40f; color: #111; box-shadow: 0 0 15px rgba(241,196,15,0.5);">START GAME</button>`;
        authForm.style.display = "block";
    }
    return true;
}

var waitDOM = setInterval(() => { if (initAuthSystem()) clearInterval(waitDOM); }, 200);

async function autoFetchUserCountry() { 
    try { 
        const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), 3000); 
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal }); clearTimeout(timeoutId); 
        const data = await response.json(); return { code: data.country || "VN", name: data.country_name || "Vietnam" }; 
    } catch (e) { return { code: "VN", name: "Vietnam" }; } 
}

function gameLoginWithGoogle() { 
    let provider = new firebase.auth.GoogleAuthProvider(); document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = "Connecting Google..."; 
    firebase.auth().signInWithPopup(provider).catch((error) => { document.getElementById('game-auth-form').style.display = 'block'; }); 
}
 
function gameLoginWithEmail() { 
    let emailEl = getGameVisibleInput('.game-email-target'); let passEl = getGameVisibleInput('.game-pass-target'); 
    let email = emailEl ? emailEl.value.trim() : ""; let pass = passEl ? passEl.value : ""; if(!email || !pass) return;
    document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = window.getTxt('checking'); 
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) { document.getElementById('game-auth-form').style.display = 'block'; }); 
}
 
function gameRegisterWithEmail() { 
    let emailEl = getGameVisibleInput('.game-email-target'); let passEl = getGameVisibleInput('.game-pass-target'); 
    let email = emailEl ? emailEl.value.trim() : ""; let pass = passEl ? passEl.value : ""; if(!email || !pass) return;
    document.getElementById('game-auth-form').style.display = 'none'; document.getElementById('auth-status-text').innerText = "..."; 
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) { document.getElementById('game-auth-form').style.display = 'block'; }); 
}
 
function savePlayerData() { if(!currentUid || !database || currentUid === 'offline_user') return; database.ref('players/' + currentUid).set(currentPlayer).catch(e => console.error(e)); }
function spinGacha() { if (currentPlayer.coins < 100) return alert("Low Gold!"); currentPlayer.coins -= 100; alert("Gacha Success!"); savePlayerData(); updatePlayerUI(); }

function autoLoginGame(uid, playerName) {
    currentUid = uid; currentPlayer.name = playerName; document.getElementById("login-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block";
    loadStatsFromGoogleSheet(); document.getElementById("loading-status").innerText = window.getTxt('syncing');
    if (database && uid !== 'offline_user') {
        database.ref('players/' + currentUid).once('value').then(async (snapshot) => {
            if(snapshot.exists()) { 
                let data = snapshot.val(); currentPlayer.level = parseInt(data.level) || 1; currentPlayer.xp = parseInt(data.xp) || 0; currentPlayer.elo = parseInt(data.elo) || 1000; currentPlayer.coins = parseInt(data.coins) || 0; currentPlayer.countryCode = data.countryCode || "VN"; currentPlayer.countryName = data.countryName || "Vietnam"; currentPlayer.classId = data.classId || ""; 
            } else { 
                let locationData = await autoFetchUserCountry(); currentPlayer.countryCode = locationData.code; currentPlayer.countryName = locationData.name; savePlayerData(); 
            }
            updatePlayerUI(); listenLeaderboard();
        }).catch((e) => { updatePlayerUI(); });
    } else { updatePlayerUI(); document.getElementById("loading-status").style.display = "none"; }
}

function updatePlayerUI() {
    let flag = getFlagEmoji(currentPlayer.countryCode); 
    let nameNode = document.getElementById("user-display-name"); if(nameNode) nameNode.innerText = flag + " " + currentPlayer.name;
    let eloNode = document.getElementById("user-display-elo"); if(eloNode) eloNode.innerText = currentPlayer.elo || 1000; 
    let coinNode = document.getElementById("user-display-coins"); if(coinNode) coinNode.innerText = (currentPlayer.coins || 0) + " " + window.getTxt('gold');
    let lvlNode = document.getElementById("user-display-level"); if(lvlNode) lvlNode.innerText = currentPlayer.level || 1;
    let xpNeeded = (parseInt(currentPlayer.level) || 1) * 100;
    let fillNode = document.getElementById("xp-fill-bar"); if(fillNode) fillNode.style.width = ((currentPlayer.xp / xpNeeded) * 100) + "%"; 
    let xpTextNode = document.getElementById("xp-text"); if(xpTextNode) xpTextNode.innerText = `XP: ${currentPlayer.xp} / ${xpNeeded}`;
    
    // Đổi chữ tĩnh trong sảnh chờ
    let t1 = document.getElementById("char-select-title"); if(t1) t1.innerText = window.getTxt('select_fighter');
    let t2 = document.getElementById("tab-global"); if(t2) t2.innerText = window.getTxt('global_elo');
    let t3 = document.getElementById("tab-country"); if(t3) t3.innerText = window.getTxt('country');
    let t4 = document.getElementById("btn-start"); if(t4) t4.innerText = window.getTxt('enter_arena');
    let t5 = document.getElementById("match-title"); if(t5) t5.innerText = window.getTxt('survival_title');
}

function listenLeaderboard() {
    if (!database) return;
    database.ref('players').on('value', (snapshot) => {
        latestPlayersData = []; let countriesFound = {};
        snapshot.forEach((child) => { let p = child.val(); if(p) { latestPlayersData.push(p); if (p.countryCode) countriesFound[p.countryCode] = p.countryName || p.countryCode; } });
        latestPlayersData.sort((a, b) => { return (parseInt(b.elo) || 1000) - (parseInt(a.elo) || 1000); });
        let globalHTML = ""; let displayCount = 0;
        latestPlayersData.forEach((p, idx) => { if (displayCount < 10) { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); globalHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>⚔️ ${parseInt(p.elo)||1000}</span></div>`; displayCount++; } });
        document.getElementById("leaderboard-list").innerHTML = globalHTML || "...";
        let selectEl = document.getElementById("country-filter-select");
        if (selectEl) { 
            let currentSelection = selectEl.value || currentPlayer.countryCode || "VN"; selectEl.innerHTML = ""; 
            for (let code in countriesFound) { let opt = document.createElement("option"); opt.value = code; opt.innerText = getFlagEmoji(code) + " " + countriesFound[code]; if (code === currentSelection) opt.selected = true; selectEl.appendChild(opt); } 
        }
        if (document.getElementById("tab-country").classList.contains("active")) renderCountryPlayers();
    });
}

function renderCountryPlayers() { 
    let selectEl = document.getElementById("country-filter-select"); if (!selectEl) return;
    let selectedCountry = selectEl.value; let countryHTML = ""; 
    let filteredPlayers = latestPlayersData.filter(p => p.countryCode === selectedCountry); 
    filteredPlayers.forEach((p, idx) => { let topClass = (idx === 0) ? "top1" : ""; let flag = getFlagEmoji(p.countryCode); countryHTML += `<div class="rank-item ${topClass}"><span><b>#${idx+1}</b> ${flag} ${p.name}</span><span>⚔️ ${parseInt(p.elo)||1000}</span></div>`; }); 
    document.getElementById("country-players-inner").innerHTML = countryHTML || "..."; 
}

async function loadStatsFromGoogleSheet() { 
    try { 
        const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), 5000); 
        const response = await fetch(SHEET_URL, { signal: controller.signal }); clearTimeout(timeoutId); const csvText = await response.text(); parseCSVData(csvText); 
    } catch (error) { console.warn("Network error"); } finally { 
        if (Object.keys(classStats).length === 0) { classStats = { 'dausi': { className: "Boxer", hp: 250, speed: 3.5, dmgMod: 1.2, regen: 0.3, avatarUrl: "", drawMethod: null, skill: {} }, 'satthu': { className: "Assassin", hp: 180, speed: 4.5, dmgMod: 1.5, regen: 0.2, avatarUrl: "", drawMethod: null, skill: {} } }; } 
        if(typeof renderCharacterGrid === 'function') renderCharacterGrid(); document.getElementById("loading-status").style.display = "none"; document.getElementById("menu-content").style.display = "flex"; 
    } 
}
