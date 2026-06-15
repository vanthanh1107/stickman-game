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

// ==========================================
// HỆ THỐNG ĐA NGÔN NGỮ (KÈM HIỆU ỨNG COMBAT)
// ==========================================
window.currentLang = localStorage.getItem('gameLang') || 'vi';

var langDictionary = {
    'vi': {
        // UI Menu
        'checking': 'Đang kiểm tra dữ liệu đăng nhập...', 'plz_login': 'Vui lòng đăng nhập để lưu cấp độ xếp hạng!',
        'login': 'ĐĂNG NHẬP', 'no_acc': 'Chưa có tài khoản? ', 'reg_now': 'Đăng ký ngay', 'or': 'HOẶC', 'play_gg': 'Chơi bằng Google',
        'hello': '👋 Xin chào: ', 'gold': 'Vàng', 'gacha': '🎲 GACHA', 'syncing': '⏳ Đang đồng bộ dữ liệu Võ sĩ...',
        'select_fighter': 'CHỌN CHIẾN BINH', 'loading_stats': 'Đang tải chỉ số...', 'select_mode': 'CHỌN CHẾ ĐỘ ĐẤU:',
        'enter_arena': 'BƯỚC LÊN SÀN ĐẤU 🔥', 'global_elo': '🏆 ELO TOÀN CẦU', 'country': '🌍 QUỐC GIA',
        'survival_title': '⛈️ Chế Độ Sinh Tồn: Đánh Lan Đạo Quân Máy!', 'retreat': 'Rút Lui', 'continue': 'TIẾP TỤC ➔',
        'skill1': 'CHIÊU 1', 'skill2': 'ĐẨY LÙI', 'dodge': 'NÉ ĐÒN', 'ultimate': 'TUYỆT KỸ', 'army': 'Đạo Quân Máy',
        'win_text': 'K.O! THẮNG 1 CHẤP', 'lose_text': 'K.O! BẠN ĐÃ BỊ HẠ 💥', 'reward_win': 'Thưởng:', 'reward_lose': 'Phạt:',
        'reward_comfort': 'Vàng an ủi', 'click_continue': 'Nhấn nút [TIẾP TỤC] ở góc HP để thoát sảnh',
        // In-game Canvas Effects
        'fx_miss': 'NÉ!', 'fx_block': '🛡️ ĐỠ!', 'fx_crit': 'BẠO KÍCH!', 'fx_wall': '💥 ĐẬP TƯỜNG!',
        'fx_parry': '⚔️ PHẢN ĐÒN!', 'fx_armor': 'BÁ THỂ!', 'fx_miss_fail': 'TRƯỢT!', 'fx_break': '⚡ VỠ KHIÊN!',
        'fx_hits': 'LIÊN KÍCH!', 'fx_unstoppable': 'VÔ ĐỊCH!', 'fx_awesome': 'TUYỆT ĐỈNH!',
        'fx_rage': 'THỨC TỈNH', 'fx_vs': 'VS', 'fx_fight': 'CHIẾN!',
        // Taunts (Cà khịa)
        't_p1_1': 'Tới đây hết đi!', 't_p1_2': 'Một chấp tất!', 't_p1_3': 'Vô đây!', 't_p1_4': 'Quét sạch!',
        't_p2_1': 'Hội đồng nó!', 't_p2_2': 'Bao vây!', 't_p2_3': 'Kết liễu!', 't_p2_4': 'Gục ngã đi!'
    },
    'en': {
        // UI Menu
        'checking': 'Checking login data...', 'plz_login': 'Please login to save your rank/ELO!',
        'login': 'LOGIN', 'no_acc': "Don't have an account? ", 'reg_now': 'Register now', 'or': 'OR', 'play_gg': 'Play with Google',
        'hello': '👋 Hello: ', 'gold': 'Gold', 'gacha': '🎲 GACHA', 'syncing': '⏳ Synchronizing Fighter data...',
        'select_fighter': 'SELECT FIGHTER', 'loading_stats': 'Loading stats...', 'select_mode': 'SELECT MATCH MODE:',
        'enter_arena': 'ENTER THE ARENA 🔥', 'global_elo': '🏆 GLOBAL ELO', 'country': '🌍 COUNTRY',
        'survival_title': '⛈️ Survival Mode: Multi-Target Battle!', 'retreat': 'Retreat', 'continue': 'CONTINUE ➔',
        'skill1': 'SKILL 1', 'skill2': 'KNOCKBACK', 'dodge': 'DODGE', 'ultimate': 'ULTIMATE', 'army': 'Bot Army',
        'win_text': 'K.O! VICTORY 1 VS', 'lose_text': 'K.O! DEFEATED 💥', 'reward_win': 'Rewards:', 'reward_lose': 'Penalty:',
        'reward_comfort': 'Comfort Gold', 'click_continue': 'Press [CONTINUE] button at HP bar to exit',
        // In-game Canvas Effects
        'fx_miss': 'MISS!', 'fx_block': '🛡️ BLOCK!', 'fx_crit': 'CRITICAL!', 'fx_wall': '💥 WALL SPLAT!',
        'fx_parry': '⚔️ PARRY!', 'fx_armor': 'SUPER ARMOR!', 'fx_miss_fail': 'EVADED!', 'fx_break': '⚡ GUARD CRASH!',
        'fx_hits': 'HITS!', 'fx_unstoppable': 'UNSTOPPABLE!', 'fx_awesome': 'AWESOME!',
        'fx_rage': 'RAGE MODE', 'fx_vs': 'VS', 'fx_fight': 'FIGHT!',
        // Taunts (Cà khịa)
        't_p1_1': 'Come at me!', 't_p1_2': '1 vs All!', 't_p1_3': 'Bring it on!', 't_p1_4': 'Clear!',
        't_p2_1': 'Attack!', 't_p2_2': 'Surround!', 't_p2_3': 'Finish him!', 't_p2_4': 'Go down!'
    },
    'ko': {
        // UI Menu
        'checking': '로그인 데이터 확인 중...', 'plz_login': 'ELO 및 랭킹을 저장하려면 로그인하세요!',
        'login': '로그인', 'no_acc': '계정이 없으신가요? ', 'reg_now': '지금 가입', 'or': '또는', 'play_gg': 'Google로 플레이',
        'hello': '👋 안녕하세요: ', 'gold': '골드', 'gacha': '🎲 가챠', 'syncing': '⏳ 파이터 데이터 동기화 중...',
        'select_fighter': '파이터 선택', 'loading_stats': '능력치 로딩 중...', 'select_mode': '대전 모드 선택:',
        'enter_arena': '아레나 입장 🔥', 'global_elo': '🏆 글로벌 ELO', 'country': '🌍 국가별',
        'survival_title': '⛈️ 서바이벌 모드: 멀티 타겟 대전!', 'retreat': '후퇴', 'continue': '계속하기 ➔',
        'skill1': '스킬 1', 'skill2': '밀치기', 'dodge': '회피', 'ultimate': '필살기', 'army': '봇 군대',
        'win_text': 'K.O! 승리 1 대', 'lose_text': 'K.O! 패배했습니다 💥', 'reward_win': '보상:', 'reward_lose': '벌점:',
        'reward_comfort': '위로 골드', 'click_continue': '나가려면 HP 바의 [계속하기] 버튼을 누르세요',
        // In-game Canvas Effects
        'fx_miss': '회피!', 'fx_block': '🛡️ 방어!', 'fx_crit': '크리티컬!', 'fx_wall': '💥 벽 꽝!',
        'fx_parry': '⚔️ 패리!', 'fx_armor': '슈퍼 아머!', 'fx_miss_fail': '빗나감!', 'fx_break': '⚡ 가드 파괴!',
        'fx_hits': '연타!', 'fx_unstoppable': '멈출 수 없음!', 'fx_awesome': '최고야!',
        'fx_rage': '분노 모드', 'fx_vs': 'VS', 'fx_fight': '파이트!',
        // Taunts (Cà khịa)
        't_p1_1': '다 덤벼!', 't_p1_2': '일당백!', 't_p1_3': '들어와!', 't_p1_4': '싹 쓸어주마!',
        't_p2_1': '공격해!', 't_p2_2': '포위해!', 't_p2_3': '끝내버려!', 't_p2_4': '쓰러져라!'
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

function getGameVisibleInput(className) { 
    let elements = document.querySelectorAll(className); 
    for (let i = 0; i < elements.length; i++) { 
        if (elements[i].offsetParent !== null) return elements[i]; 
    } 
    return elements[0] || null; 
}
function focusNextVisible(className) { let el = getGameVisibleInput(className); if(el) el.focus(); }

function getFlagEmoji(countryCode) { 
    if (!countryCode) return "🏴"; 
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()); 
    return String.fromCodePoint(...codePoints); 
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
    
    let t1 = document.getElementById("char-select-title"); if(t1) t1.innerText = window.getTxt('select_fighter');
    let t2 = document.getElementById("tab-global"); if(t2) t2.innerText = window.getTxt('global_elo');
    let t3 = document.getElementById("tab-country"); if(t3) t3.innerText = window.getTxt('country');
    let t4 = document.getElementById("btn-start"); if(t4) t4.innerText = window.getTxt('enter_arena');
    let t5 = document.getElementById("match-title"); if(t5) t5.innerText = window.getTxt('survival_title');
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

function parseCSVData(csvText) {
    let result = []; let row = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) { 
        let char = csvText[i]; 
        if (char === '"') { if (inQuotes && csvText[i+1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; } } 
        else if (char === ',' && !inQuotes) { row.push(cur.trim()); cur = ''; } 
        else if ((char === '\n' || char === '\r') && !inQuotes) { if (char === '\r' && csvText[i+1] === '\n') i++; row.push(cur.trim()); result.push(row); row = []; cur = ''; } 
        else { cur += char; } 
    }
    if (cur || row.length > 0) { row.push(cur.trim()); result.push(row); } 
    if (result.length < 2) return;
    
    let headers = result[0];
    for (let i = 1; i < result.length; i++) {
        let values = result[i]; if (values.length < headers.length && values.join('') === '') continue; 
        let rowObj = {}; headers.forEach((h, idx) => rowObj[h] = values[idx] || "");
        
        if (rowObj.id) {
            let actionCode1 = null, actionCode2 = null, actionCode3 = null;
            try { if (rowObj.skill1Code) actionCode1 = new Function('p', 'target', 'gameContext', rowObj.skill1Code); } catch (e) {}
            try { if (rowObj.skill2Code) actionCode2 = new Function('p', 'target', 'gameContext', rowObj.skill2Code); } catch (e) {}
            try { if (rowObj.skill3Code) actionCode3 = new Function('p', 'target', 'gameContext', rowObj.skill3Code); } catch (e) {}
            
            let drawMethod = null; try { if (rowObj.drawCode) drawMethod = new Function('ctx', 'p', 'bounce', 'ext', 'pext', 'isTrail', rowObj.drawCode); } catch (e) { }
            
            classStats[rowObj.id] = { 
                className: rowObj.className || "Unknown", hp: parseInt(rowObj.hp)||200, speed: (parseFloat(rowObj.speed)||1) * 3, dmgMod: parseFloat(rowObj.dmgMod)||1, regen: parseFloat(rowObj.regen)||0.3, avatarUrl: rowObj.avatarUrl || "", drawMethod: drawMethod, skill: { actionCode1: actionCode1, actionCode2: actionCode2, actionCode3: actionCode3 } 
            };
        }
    }
}
