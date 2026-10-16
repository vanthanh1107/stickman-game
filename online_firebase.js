// ==========================================
// ONLINE_FIREBASE.JS - HỆ THỐNG ĐẤU ONLINE 1V1 REAL-TIME QUA GOOGLE FIREBASE
// Tích hợp độc lập 100%:
// 1. Tự động nạp Firebase SDK & Tạo giao diện Sảnh Chờ (Tạo phòng 4 số / Vào phòng / Ghép nhanh).
// 2. Đồng bộ Vị trí, Máu, Nộ, Đòn đánh, Tuyệt kỹ Ultimate & Biểu cảm Trash Talk ở 60FPS (Nội suy mượt).
// 3. Hỗ trợ chuyển đổi linh hoạt giữa Tự Điều Khiển (WASD/Phím mũi tên) và Bán Tự Động ngay trong trận.
// ==========================================

// 🔴 BẠN DÁN CẤU HÌNH FIREBASE CỦA BẠN VÀO ĐÂY (Xem hướng dẫn lấy ở Bước 3)
window.FIREBASE_CONFIG = {
    apiKey: "DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY",
    authDomain: "TEN_PROJECT.firebaseapp.com",
    databaseURL: "https://TEN_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "TEN_PROJECT",
    storageBucket: "TEN_PROJECT.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

window.isOnlineMatch = false;
window.onlineRole = null; // 'host' (P1 - Bên trái) hoặc 'guest' (P2 - Bên phải)
window.currentRoomId = null;
window.onlineControlMode = "semi"; // 'manual' (Tự di chuyển WASD) hoặc 'semi' (AI di chuyển + Tự bấm skill)
window.onlinePingMs = 0;

window._fbDb = null;
window._roomRef = null;
window._eventsRef = null;
window._syncIntervalId = null;
window._remoteTargetPos = { x: 500, y: 320 };
window._keysPressed = {};
window._processedEventIds = new Set();

// ==========================================
// 1. TỰ ĐỘNG NẠP THƯ VIỆN FIREBASE & KHỞI TẠO GIAO DIỆN
// ==========================================
window.initFirebaseScripts = function() {
    if (window.firebase && window.firebase.database) {
        window.setupFirebaseConnection();
        return;
    }
    const appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
    appScript.onload = () => {
        const dbScript = document.createElement("script");
        dbScript.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js";
        dbScript.onload = () => window.setupFirebaseConnection();
        document.head.appendChild(dbScript);
    };
    document.head.appendChild(appScript);
};

window.setupFirebaseConnection = function() {
    try {
        if (!window.FIREBASE_CONFIG || window.FIREBASE_CONFIG.apiKey.includes("DÁN_API_KEY")) {
            console.warn("⚠️ Chưa cấu hình window.FIREBASE_CONFIG trong online_firebase.js");
            return;
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(window.FIREBASE_CONFIG);
        }
        window._fbDb = firebase.database();

        // Đo Ping thời gian thực
        setInterval(() => {
            if (!window._fbDb || !window.isOnlineMatch) return;
            let startT = Date.now();
            window._fbDb.ref(".info/connected").once("value", () => {
                window.onlinePingMs = Date.now() - startT;
                let pingEl = document.getElementById("online-ping-badge");
                if (pingEl) {
                    let col = window.onlinePingMs < 80 ? "#2ecc71" : (window.onlinePingMs < 150 ? "#f1c40f" : "#ff4757");
                    pingEl.innerHTML = `<span style="color:${col};">●</span> ${window.onlinePingMs}ms`;
                }
            });
        }, 2500);
    } catch (e) {
        console.error("Lỗi khởi tạo Firebase:", e);
    }
};

// ==========================================
// 2. GIAO DIỆN SẢNH CHỜ ONLINE (TỰ ĐỘNG CHÈN VÀO MÀN HÌNH CHỌN TƯỚNG)
// ==========================================
window.injectOnlineLobbyUI = function() {
    if (document.getElementById("btn-open-online-modal")) return;

    // Nút mở Sảnh Online ở màn hình chọn tướng
    let openBtn = document.createElement("button");
    openBtn.id = "btn-open-online-modal";
    openBtn.innerHTML = "🌐 ĐẤU ONLINE 1V1";
    openBtn.style.cssText = "position:fixed; top:14px; right:14px; z-index:9999; background:linear-gradient(135deg, #00f3ff, #0984e3); color:#000; font-family:'Arial Black', sans-serif; font-size:14px; font-weight:900; padding:10px 18px; border:2px solid #fff; border-radius:25px; cursor:pointer; box-shadow:0 0 18px rgba(0,243,255,0.6); transition:0.2s;";
    openBtn.onclick = () => window.toggleOnlineModal(true);
    document.body.appendChild(openBtn);

    // Hộp thoại Sảnh chờ Online
    let modal = document.createElement("div");
    modal.id = "online-lobby-modal";
    modal.style.cssText = "display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); z-index:100000; align-items:center; justify-content:center; font-family:Arial, sans-serif; color:#fff;";
    modal.innerHTML = `
        <div style="background:#0f172a; border:2px solid #00f3ff; border-radius:18px; width:92%; max-width:440px; padding:24px; text-align:center; box-shadow:0 0 35px rgba(0,243,255,0.35); position:relative;">
            <button onclick="window.toggleOnlineModal(false)" style="position:absolute; top:12px; right:14px; background:transparent; border:none; color:#94a3b8; font-size:22px; cursor:pointer;">✖</button>
            <h2 style="margin:0 0 8px 0; color:#00f3ff; font-family:'Arial Black', sans-serif; font-size:22px;">🌐 ĐẤU TRƯỜNG ONLINE 1V1</h2>
            <p id="online-char-picked" style="margin:0 0 16px 0; color:#cbd5e1; font-size:14px;">Hãy chọn tướng của bạn ở ngoài trước khi vào phòng!</p>

            <div style="display:flex; gap:8px; justify-content:center; margin-bottom:16px;">
                <button id="mode-btn-semi" onclick="window.setOnlineControlMode('semi')" style="flex:1; padding:8px; border-radius:8px; border:2px solid #00f3ff; background:rgba(0,243,255,0.2); color:#fff; font-weight:bold; cursor:pointer; font-size:12px;">🤖 Bán Tự Động (Khuyên dùng)</button>
                <button id="mode-btn-manual" onclick="window.setOnlineControlMode('manual')" style="flex:1; padding:8px; border-radius:8px; border:1px solid #334155; background:#1e293b; color:#94a3b8; font-weight:bold; cursor:pointer; font-size:12px;">🎮 Tự Điều Khiển (WASD)</button>
            </div>

            <button onclick="window.quickMatchOnline()" style="width:100%; padding:13px; background:linear-gradient(90deg, #ff0050, #ff7eb3); color:#fff; border:none; border-radius:10px; font-weight:900; font-size:16px; cursor:pointer; margin-bottom:12px; box-shadow:0 4px 15px rgba(255,0,80,0.4);">⚡ TÌM TRẬN NHANH (QUICK MATCH)</button>

            <div style="display:flex; gap:10px; margin-bottom:14px;">
                <button onclick="window.createOnlineRoom()" style="flex:1; padding:11px; background:#0984e3; color:#fff; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">➕ TẠO PHÒNG MỚI</button>
            </div>

            <div style="display:flex; gap:8px; margin-bottom:14px;">
                <input id="input-room-code" type="text" maxlength="6" placeholder="Nhập mã phòng (VD: 8899)" style="flex:1; padding:11px; border-radius:10px; border:1px solid #334155; background:#1e293b; color:#fff; font-size:15px; text-align:center; font-weight:bold; text-transform:uppercase;">
                <button onclick="window.joinOnlineRoomByInput()" style="padding:11px 18px; background:#2ecc71; color:#000; border:none; border-radius:10px; font-weight:900; cursor:pointer;">VÀO</button>
            </div>

            <div id="online-status-box" style="min-height:36px; padding:10px; border-radius:8px; background:rgba(255,255,255,0.05); color:#ffeb3b; font-weight:bold; font-size:14px; display:flex; align-items:center; justify-content:center;">
                Sẵn sàng kết nối máy chủ Firebase
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Thanh trạng thái Ping & Gửi Biểu Cảm Nhanh trong trận
    let matchHud = document.createElement("div");
    matchHud.id = "online-in-game-bar";
    matchHud.style.cssText = "display:none; position:fixed; top:8px; left:50%; transform:translateX(-50%); z-index:9999; background:rgba(15,23,42,0.85); border:1px solid #00f3ff; border-radius:20px; padding:4px 14px; color:#fff; font-size:12px; font-weight:bold; gap:12px; align-items:center;";
    matchHud.innerHTML = `
        <span id="online-room-badge" style="color:#00f3ff;">PHÒNG: ----</span>
        <span id="online-ping-badge"><span style="color:#2ecc71;">●</span> 24ms</span>
        <button onclick="window.sendQuickOnlineEmote('😂 Gáy sớm!')" style="background:#334155; color:#fff; border:none; border-radius:6px; padding:3px 7px; cursor:pointer;">😂</button>
        <button onclick="window.sendQuickOnlineEmote('🔥 Căng đét!')" style="background:#334155; color:#fff; border:none; border-radius:6px; padding:3px 7px; cursor:pointer;">🔥</button>
        <button onclick="window.sendQuickOnlineEmote('💀 Xóa game đi!')" style="background:#334155; color:#fff; border:none; border-radius:6px; padding:3px 7px; cursor:pointer;">💀</button>
    `;
    document.body.appendChild(matchHud);
};

window.setOnlineControlMode = function(mode) {
    window.onlineControlMode = mode;
    let bSemi = document.getElementById("mode-btn-semi");
    let bMan = document.getElementById("mode-btn-manual");
    if (bSemi && bMan) {
        if (mode === "semi") {
            bSemi.style.border = "2px solid #00f3ff"; bSemi.style.background = "rgba(0,243,255,0.2)"; bSemi.style.color = "#fff";
            bMan.style.border = "1px solid #334155"; bMan.style.background = "#1e293b"; bMan.style.color = "#94a3b8";
        } else {
            bMan.style.border = "2px solid #00f3ff"; bMan.style.background = "rgba(0,243,255,0.2)"; bMan.style.color = "#fff";
            bSemi.style.border = "1px solid #334155"; bSemi.style.background = "#1e293b"; bSemi.style.color = "#94a3b8";
        }
    }
};

window.toggleOnlineModal = function(show) {
    let modal = document.getElementById("online-lobby-modal");
    if (!modal) return;
    modal.style.display = show ? "flex" : "none";
    if (show) {
        let charId = window.selectedRedClass || Object.keys(window.classStats || {})[0];
        let charObj = (window.classStats && window.classStats[charId]) ? window.classStats[charId] : null;
        let label = document.getElementById("online-char-picked");
        if (label && charObj) {
            label.innerHTML = `Chiến binh đã chọn: <strong style="color:#00f3ff;">${charObj.className}</strong> (❤️ ${charObj.hp})`;
        }
    }
};

window.setLobbyStatus = function(msg, color = "#ffeb3b") {
    let box = document.getElementById("online-status-box");
    if (box) { box.style.color = color; box.innerHTML = msg; }
};

// ==========================================
// 3. TẠO PHÒNG, VÀO PHÒNG & TÌM TRẬN NHANH QUA FIREBASE RTDB
// ==========================================
window.getSelectedCharPayload = function() {
    let allKeys = Object.keys(window.classStats || {});
    let cid = window.selectedRedClass || allKeys[0] || "billgates";
    let st = (window.classStats && window.classStats[cid]) ? window.classStats[cid] : {};
    return {
        classId: cid,
        className: st.className || "Fighter",
        hp: st.hp || 1000,
        speed: st.speed || 5,
        dmgMod: st.dmgMod || 1.2,
        color: st.color || "#00f3ff",
        avatarUrl: st.avatarUrl || ""
    };
};

window.createOnlineRoom = function(isQuickMatch = false) {
    if (!window._fbDb) {
        window.setLobbyStatus("⚠️ Bạn chưa điền FIREBASE_CONFIG trong online_firebase.js!", "#ff4757");
        return;
    }
    window.leaveOnlineRoom();

    let roomCode = String(Math.floor(1000 + Math.random() * 9000));
    window.currentRoomId = roomCode;
    window.onlineRole = "host";

    let hostChar = window.getSelectedCharPayload();
    let mapIdx = Math.floor(Math.random() * 8);

    window._roomRef = window._fbDb.ref("rooms/" + roomCode);
    let roomData = {
        roomId: roomCode,
        status: "waiting",
        isQuick: Boolean(isQuickMatch),
        mapSeed: mapIdx,
        createdAt: Date.now(),
        host: { char: hostChar, ready: true },
        p1State: { x: 100, y: window.GROUND_Y || 320, vx: 0, vy: 0, hp: hostChar.hp, maxHp: hostChar.hp, stamina: 0, shield: 0, state: "idle", attackTimer: 0, isFacingRight: true, comboHits: 0 }
    };

    window._roomRef.set(roomData);
    window._roomRef.onDisconnect().remove();

    window.setLobbyStatus(`⏳ Mã phòng của bạn: <span style="font-size:20px; color:#00f3ff; margin-left:6px;">${roomCode}</span> (Đang chờ đối thủ...)`, "#ffeb3b");

    // Lắng nghe khi có Khách (Guest) bước vào phòng
    window._roomRef.child("guest").on("value", (snap) => {
        let guestData = snap.val();
        if (guestData && guestData.char && !window.isOnlineMatch) {
            window._roomRef.update({ status: "playing" });
            window.setLobbyStatus(`🔥 Đã tìm thấy đối thủ: ${guestData.char.className}! Đang vào trận...`, "#2ecc71");
            setTimeout(() => {
                window.startOnlineMatch(hostChar, guestData.char, "host", roomCode);
            }, 400);
        }
    });
};

window.joinOnlineRoomByInput = function() {
    let inp = document.getElementById("input-room-code");
    if (!inp || !inp.value.trim()) {
        window.setLobbyStatus("⚠️ Vui lòng nhập mã phòng 4 số!", "#ff4757");
        return;
    }
    window.joinOnlineRoom(inp.value.trim());
};

window.joinOnlineRoom = function(roomCode) {
    if (!window._fbDb) {
        window.setLobbyStatus("⚠️ Bạn chưa điền FIREBASE_CONFIG trong online_firebase.js!", "#ff4757");
        return;
    }
    window.leaveOnlineRoom();
    window.setLobbyStatus(`⏳ Đang kết nối vào phòng ${roomCode}...`, "#00f3ff");

    let targetRef = window._fbDb.ref("rooms/" + roomCode);
    targetRef.once("value", (snap) => {
        let data = snap.val();
        if (!data || !data.host) {
            window.setLobbyStatus("❌ Không tìm thấy phòng này hoặc phòng đã đóng!", "#ff4757");
            return;
        }
        if (data.status !== "waiting" && data.guest) {
            window.setLobbyStatus("❌ Phòng này đã đủ 2 người chơi!", "#ff4757");
            return;
        }

        window.currentRoomId = roomCode;
        window.onlineRole = "guest";
        window._roomRef = targetRef;

        let guestChar = window.getSelectedCharPayload();
        window._roomRef.update({
            status: "playing",
            guest: { char: guestChar, ready: true },
            p2State: { x: 500, y: window.GROUND_Y || 320, vx: 0, vy: 0, hp: guestChar.hp, maxHp: guestChar.hp, stamina: 0, shield: 0, state: "idle", attackTimer: 0, isFacingRight: false, comboHits: 0 }
        });

        window.setLobbyStatus(`🔥 Đã kết nối với ${data.host.char.className}! Đang vào sàn đấu...`, "#2ecc71");
        setTimeout(() => {
            window.startOnlineMatch(data.host.char, guestChar, "guest", roomCode);
        }, 400);
    });
};

window.quickMatchOnline = function() {
    if (!window._fbDb) {
        window.setLobbyStatus("⚠️ Bạn chưa điền FIREBASE_CONFIG trong online_firebase.js!", "#ff4757");
        return;
    }
    window.setLobbyStatus("🔍 Đang quét tìm đối thủ Online...", "#00f3ff");

    window._fbDb.ref("rooms").orderByChild("status").equalTo("waiting").limitToFirst(5).once("value", (snap) => {
        let rooms = snap.val();
        let foundRoomCode = null;
        if (rooms) {
            for (let code in rooms) {
                let r = rooms[code];
                if (r && r.host && !r.guest && (Date.now() - (r.createdAt || 0) < 300000)) {
                    foundRoomCode = code;
                    break;
                }
            }
        }
        if (foundRoomCode) {
            window.joinOnlineRoom(foundRoomCode);
        } else {
            window.createOnlineRoom(true);
        }
    });
};

window.leaveOnlineRoom = function() {
    if (window._syncIntervalId) { clearInterval(window._syncIntervalId); window._syncIntervalId = null; }
    if (window._roomRef) {
        window._roomRef.off();
        if (window._roomRef.child) {
            window._roomRef.child("guest").off();
            window._roomRef.child("p1State").off();
            window._roomRef.child("p2State").off();
            window._roomRef.child("events").off();
        }
        if (window.onlineRole === "host") {
            try { window._roomRef.remove(); } catch (e) {}
        }
        window._roomRef = null;
    }
    window.isOnlineMatch = false;
    window.onlineRole = null;
    window.currentRoomId = null;
    let bar = document.getElementById("online-in-game-bar");
    if (bar) bar.style.display = "none";
};

// ==========================================
// 4. KHỞI CHẠY TRẬN ĐẤU ONLINE 1V1 & ĐỒNG BỘ THỜI GIAN THỰC
// ==========================================
window.startOnlineMatch = async function(hostCharInfo, guestCharInfo, myRole, roomCode) {
    window.toggleOnlineModal(false);
    window.isPreviewRunning = false;
    if (window.previewAnimId) cancelAnimationFrame(window.previewAnimId);

    let sel = document.getElementById("selection-screen"); if (sel) sel.style.display = "none";
    let game = document.getElementById("game-screen"); if (game) game.style.display = "block";
    let openBtn = document.getElementById("btn-open-online-modal"); if (openBtn) openBtn.style.display = "none";

    let bar = document.getElementById("online-in-game-bar");
    if (bar) {
        bar.style.display = "flex";
        let badge = document.getElementById("online-room-badge");
        if (badge) badge.innerText = `PHÒNG #${roomCode} (${myRole === 'host' ? 'P1 ĐỎ' : 'P2 XANH'})`;
    }

    if (typeof window.initBGM === "function") window.initBGM();
    if (window.UniversalSkillEngine) window.UniversalSkillEngine.upgradeAllCharacters();

    let s1 = (window.classStats && window.classStats[hostCharInfo.classId]) ? window.classStats[hostCharInfo.classId] : hostCharInfo;
    let s2 = (window.classStats && window.classStats[guestCharInfo.classId]) ? window.classStats[guestCharInfo.classId] : guestCharInfo;

    window.isOnlineMatch = true;
    window.onlineRole = myRole;
    window._processedEventIds.clear();

    // Khởi tạo P1 (Host - Bên trái)
    window.p1 = {
        id: "player", classId: hostCharInfo.classId, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0,
        speed: s1.speed || 5, color: s1.color || "#00f3ff", hp: s1.hp || 1000, maxHp: s1.hp || 1000,
        dmgMod: s1.dmgMod || 1, currentDmgMod: s1.dmgMod || 1, scale: s1.scale || 1,
        onGround: true, isFacingRight: true, state: "idle", attackTimer: 0, hitStun: 0, stamina: 0,
        comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0,
        drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0,
        comboHits: 0, comboTimeout: 0, critChance: 0.12, critMult: 1.5, className: hostCharInfo.className,
        isRage: false, shieldBreak: 100, stunTimer: 0, superArmor: 0, avatarUrl: hostCharInfo.avatarUrl
    };

    // Khởi tạo P2 (Guest - Bên phải)
    window.enemies = [{
        id: "enemy_0", classId: guestCharInfo.classId, isPlayer: false, x: 500, y: window.GROUND_Y, vx: 0, vy: 0,
        speed: s2.speed || 5, color: s2.color || "#ff0050", hp: s2.hp || 1000, maxHp: s2.hp || 1000,
        dmgMod: s2.dmgMod || 1, currentDmgMod: s2.dmgMod || 1, scale: s2.scale || 1,
        onGround: true, isFacingRight: false, state: "idle", attackTimer: 0, hitStun: 0, stamina: 0,
        comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0,
        drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0,
        comboHits: 0, comboTimeout: 0, critChance: 0.12, critMult: 1.5, className: guestCharInfo.className,
        isRage: false, shieldBreak: 100, stunTimer: 0, superArmor: 0, avatarUrl: guestCharInfo.avatarUrl
    }];
    window.totalEnemyMaxHp = window.enemies[0].maxHp;

    // Cập nhật HUD tên và ảnh đại diện
    let nr = document.getElementById("name-display-red");
    if (nr) nr.innerHTML = `<img class="hud-avatar-img" src="${window.p1.avatarUrl || 'https://i.imgur.com/q3813rX.png'}"><span>${window.p1.className} (P1)</span>`;
    let nb = document.getElementById("name-display-blue");
    if (nb) nb.innerHTML = `<span>${window.enemies[0].className} (P2)</span><img class="hud-avatar-img" src="${window.enemies[0].avatarUrl || 'https://i.imgur.com/q3813rX.png'}">`;
    if (typeof window.fitWebHudNames === "function") setTimeout(window.fitWebHudNames, 30);

    if (typeof window.resetMatchVariables === "function") window.resetMatchVariables();
    if (typeof window.startRecording === "function") window.startRecording();

    window.setupOnlineSyncListeners();

    if (!window.isLoopRunning) {
        window.isLoopRunning = true;
        requestAnimationFrame(window.gameLoop);
    }
};

// ==========================================
// 5. ĐỒNG BỘ TỌA ĐỘ 25HZ & SỰ KIỆN ĐÒN ĐÁNH TỨC THỜI (0MS DELAY)
// ==========================================
window.setupOnlineSyncListeners = function() {
    if (!window._roomRef) return;

    let myFighter = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
    let remoteFighter = (window.onlineRole === "host") ? window.enemies[0] : window.p1;
    window._remoteTargetPos = { x: remoteFighter.x, y: remoteFighter.y };

    // 1. Lắng nghe tọa độ của đối phương
    let remoteStateKey = (window.onlineRole === "host") ? "p2State" : "p1State";
    window._roomRef.child(remoteStateKey).on("value", (snap) => {
        if (!window.isOnlineMatch) return;
        let st = snap.val();
        if (!st || !remoteFighter) return;

        window._remoteTargetPos.x = st.x;
        window._remoteTargetPos.y = st.y;
        remoteFighter.vx = st.vx || 0;
        remoteFighter.vy = st.vy || 0;
        remoteFighter.isFacingRight = st.isFacingRight;

        if (st.attackTimer > 0 || remoteFighter.attackTimer <= 0) {
            remoteFighter.state = st.state || "idle";
            remoteFighter.attackTimer = st.attackTimer || 0;
        }

        // Máy Chủ (Host) chịu trách nhiệm đồng bộ chuẩn Thanh Máu (HP) cho cả 2 bên để không bao giờ bị lệch máu
        if (window.onlineRole === "guest" && st.syncHp) {
            window.p1.hp = st.p1Hp;
            window.p1.stamina = st.p1Stam;
            window.p1.shield = st.p1Shield || 0;
            window.p1.comboHits = st.p1Combo || 0;

            window.enemies[0].hp = st.p2Hp;
            window.enemies[0].stamina = st.p2Stam;
            window.enemies[0].shield = st.p2Shield || 0;
            window.enemies[0].comboHits = st.p2Combo || 0;
            if (typeof window.updateHPUIs === "function") window.updateHPUIs();
        }
    });

    // 2. Lắng nghe Sự Kiện Kỹ Năng / Đòn Đánh / Biểu cảm tức thời
    window._eventsRef = window._roomRef.child("events");
    window._eventsRef.limitToLast(10).on("child_added", (snap) => {
        if (!window.isOnlineMatch) return;
        let ev = snap.val();
        let evKey = snap.key;
        if (!ev || window._processedEventIds.has(evKey)) return;
        window._processedEventIds.add(evKey);

        // Nếu sự kiện do đối phương gửi tới -> Kích hoạt ngay trên máy mình
        if (ev.sender !== window.onlineRole) {
            let actor = (ev.sender === "host") ? window.p1 : window.enemies[0];
            let target = (ev.sender === "host") ? window.enemies[0] : window.p1;
            if (!actor || !target) return;

            if (ev.type === "attack") {
                actor.x = ev.x || actor.x;
                actor.comboStep = ev.comboStep || 0;
                if (typeof window.attack === "function") window.attack(actor, [target]);
            } else if (ev.type === "ultimate") {
                actor.x = ev.x || actor.x;
                if (typeof window.useUltimate === "function") window.useUltimate(actor, target);
            } else if (ev.type === "block") {
                actor.state = "block";
                actor.attackTimer = 40;
                actor.vx = 0;
            } else if (ev.type === "dodge") {
                actor.state = "dash_back";
                actor.dashTimer = 18;
                actor.iFrames = 18;
                actor.dashDir = actor.isFacingRight ? -1 : 1;
                actor.attackTimer = 18;
            } else if (ev.type === "emote") {
                window.floatingTexts.push({
                    x: actor.x, y: actor.y - 105, text: ev.text, color: "#00f3ff",
                    alpha: 1.0, vx: 0, vy: -1.0, font: "bold 17px Arial", life: 45, noGravity: true
                });
                if (typeof window.playSound === "function") window.playSound(600, "sine", 0.15, 0.3);
            }
        }
    });

    // 3. Vòng lặp gửi trạng thái của mình lên Firebase (25 lần/giây)
    let myStateKey = (window.onlineRole === "host") ? "p1State" : "p2State";
    window._syncIntervalId = setInterval(() => {
        if (!window.isOnlineMatch || !window._roomRef || !window.p1 || !window.enemies[0]) return;
        let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];

        let payload = {
            x: Math.round(me.x),
            y: Math.round(me.y),
            vx: Number((me.vx || 0).toFixed(1)),
            vy: Number((me.vy || 0).toFixed(1)),
            state: me.state || "idle",
            attackTimer: me.attackTimer || 0,
            isFacingRight: Boolean(me.isFacingRight)
        };

        if (window.onlineRole === "host") {
            payload.syncHp = true;
            payload.p1Hp = Math.max(0, Math.round(window.p1.hp));
            payload.p1Stam = Math.round(window.p1.stamina || 0);
            payload.p1Shield = Math.round(window.p1.shield || 0);
            payload.p1Combo = window.p1.comboHits || 0;

            payload.p2Hp = Math.max(0, Math.round(window.enemies[0].hp));
            payload.p2Stam = Math.round(window.enemies[0].stamina || 0);
            payload.p2Shield = Math.round(window.enemies[0].shield || 0);
            payload.p2Combo = window.enemies[0].comboHits || 0;
        }

        window._roomRef.child(myStateKey).set(payload);
    }, 40);
};

window.pushOnlineEvent = function(type, extraData = {}) {
    if (!window.isOnlineMatch || !window._eventsRef) return;
    let me = (window.onlineRole === "host") ? window.p1 : (window.enemies ? window.enemies[0] : null);
    window._eventsRef.push(Object.assign({
        sender: window.onlineRole,
        type: type,
        x: me ? Math.round(me.x) : 0,
        t: Date.now()
    }, extraData));
};

window.sendQuickOnlineEmote = function(txt) {
    if (!window.isOnlineMatch) return;
    let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
    if (me) {
        window.floatingTexts.push({
            x: me.x, y: me.y - 105, text: txt, color: "#ffeb3b",
            alpha: 1.0, vx: 0, vy: -1.0, font: "bold 17px Arial", life: 45, noGravity: true
        });
    }
    window.pushOnlineEvent("emote", { text: txt });
};

// ==========================================
// 6. BỘ ĐIỀU KHIỂN BÀN PHÍM & NÚT BẤM CHO CẢ CHỦ PHÒNG (P1) VÀ KHÁCH (P2)
// ==========================================
window.addEventListener("keydown", (e) => {
    window._keysPressed[e.code] = true;
    if (!window.isOnlineMatch || window.gameOver || window.introTimer > 0) return;
    if (e.code === "KeyJ" || e.code === "Space") window.triggerOnlineAttack();
    else if (e.code === "KeyK") window.playerDodge();
    else if (e.code === "KeyL") window.playerBlock();
    else if (e.code === "KeyU") window.playerUseSkill();
});

window.addEventListener("keyup", (e) => {
    window._keysPressed[e.code] = false;
});

window.triggerOnlineAttack = function() {
    if (!window.isOnlineMatch || window.gameOver || window.introTimer > 0) return;
    let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
    let opp = (window.onlineRole === "host") ? window.enemies[0] : window.p1;
    if (!me || !opp || me.hp <= 0 || me.attackTimer > 0 || me.hitStun > 0 || me.stunTimer > 0) return;

    if (me.comboTimeout > 0 && me.comboStep < 14) me.comboStep++;
    else me.comboStep = 0;
    me.comboTimeout = 60;

    window.pushOnlineEvent("attack", { comboStep: me.comboStep });
    if (typeof window.attack === "function") window.attack(me, [opp]);
};

// Hook tự động các nút Đỡ, Né, Ultimate và Vòng lặp Vật lý khi đang ở chế độ Online
window.hookOnlineControls = function() {
    if (window._onlineHooksApplied) return;
    window._onlineHooksApplied = true;

    const origBlock = window.playerBlock;
    window.playerBlock = function() {
        if (!window.isOnlineMatch) { if (origBlock) origBlock(); return; }
        let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
        if (!me || me.hp <= 0 || window.gameOver || window.introTimer > 0 || me.hitStun > 0) return;
        me.state = "block"; me.attackTimer = 40; me.vx = 0;
        window.pushOnlineEvent("block");
    };

    const origDodge = window.playerDodge;
    window.playerDodge = function() {
        if (!window.isOnlineMatch) { if (origDodge) origDodge(); return; }
        let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
        if (!me || me.hp <= 0 || window.gameOver || window.introTimer > 0 || me.hitStun > 0 || me.dashTimer > 0) return;
        me.state = "dash_back"; me.dashTimer = 18; me.iFrames = 18;
        me.dashDir = me.isFacingRight ? -1 : 1; me.attackTimer = 18;
        window.pushOnlineEvent("dodge");
    };

    const origSkill = window.playerUseSkill;
    window.playerUseSkill = function() {
        if (!window.isOnlineMatch) { if (origSkill) origSkill(); return; }
        let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
        let opp = (window.onlineRole === "host") ? window.enemies[0] : window.p1;
        if (!me || !opp || me.hp <= 0 || window.gameOver || window.introTimer > 0) return;
        window.pushOnlineEvent("ultimate");
        if (typeof window.useUltimate === "function") window.useUltimate(me, opp);
    };

    const origBackToMenu = window.backToMenu;
    window.backToMenu = function() {
        window.leaveOnlineRoom();
        let openBtn = document.getElementById("btn-open-online-modal");
        if (openBtn) openBtn.style.display = "block";
        if (origBackToMenu) origBackToMenu();
    };

    // Nội suy mượt 60FPS cho đối thủ từ xa & Xử lý phím di chuyển WASD
    setInterval(() => {
        if (!window.isOnlineMatch || window.gameOver || !window.p1 || !window.enemies[0]) return;
        let me = (window.onlineRole === "host") ? window.p1 : window.enemies[0];
        let remote = (window.onlineRole === "host") ? window.enemies[0] : window.p1;

        // Khóa AI của đối phương để chỉ di chuyển theo dữ liệu mạng Firebase
        remote.aiDelay = 999;
        if (window._remoteTargetPos && remote.hp > 0) {
            remote.x += (window._remoteTargetPos.x - remote.x) * 0.35;
        }

        // Nếu người chơi chọn chế độ Tự Điều Khiển (Manual WASD / Phím mũi tên)
        if (window.onlineControlMode === "manual" && me.hp > 0 && window.introTimer <= 0) {
            me.aiDelay = 999;
            if (me.attackTimer <= 0 && me.hitStun <= 0 && me.dashTimer <= 0) {
                let moveLeft = window._keysPressed["KeyA"] || window._keysPressed["ArrowLeft"];
                let moveRight = window._keysPressed["KeyD"] || window._keysPressed["ArrowRight"];
                let jump = window._keysPressed["KeyW"] || window._keysPressed["ArrowUp"];

                if (moveLeft) { me.vx = -(me.currentSpeed || 5) * 1.15; me.state = "walk"; }
                else if (moveRight) { me.vx = (me.currentSpeed || 5) * 1.15; me.state = "walk"; }
                else { me.vx *= 0.7; if (Math.abs(me.vx) < 0.5) me.state = "idle"; }

                if (jump && me.onGround) { me.vy = -11.5; me.onGround = false; }
            }
        }
    }, 16);
};

// Tự động khởi chạy khi trang Web tải xong
window.addEventListener("DOMContentLoaded", () => {
    window.injectOnlineLobbyUI();
    window.initFirebaseScripts();
    setTimeout(window.hookOnlineControls, 400);
});
