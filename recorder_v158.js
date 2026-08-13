// ==========================================
// RECORDER.JS - V75.7 THE ALGORITHM BREAKER (DYNAMIC RATIO FACECAM)
// ĐÃ FIX & GIỮ NGUYÊN: Intro God-Tier, Vỡ kính 3D, Kanji Manga, Đa ngôn ngữ, Kill-Cam.
// NÂNG CẤP TỐI THƯỢNG: Mưa Tim, Bookmark thôi miên, Rung chấn combat, Viral Post Kit.
// TÂM LÝ HỌC (NEW): Tối ưu tên Sticklom, Chat gọn gàng, FACE-CAM VIDEO RANDOM.
// NÂNG CẤP MỚI NHẤT: Khung Facecam tự động biến đổi tỷ lệ (Vuông/Dọc/Ngang) theo Video gốc và Neo chuẩn góc phải!
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

// QUẢN LÝ VIDEO FACECAM STREAMER CÂU VIEW (Tự động Random)
// Bạn hãy thay các link bên dưới bằng link video gái xinh/streamer (MP4/WebM) của riêng bạn nhé
window.FACECAM_VIDEO_URLS = [
    "https://files.catbox.moe/fy9m1o.mp4", // Video 1
    "https://files.catbox.moe/xdmtwq.mp4", // Video 2
    "https://files.catbox.moe/3z34lr.mp4", // Video 3
    "https://files.catbox.moe/lcsam2.mp4", // Video 4
    "https://files.catbox.moe/dp7obz.mp4", // Video 5
    "https://files.catbox.moe/r2wq16.mp4", // Video 2
    "https://files.catbox.moe/yhoaz3.mp4", // Video 3
    "https://files.catbox.moe/yg0ftp.mp4", // Video 4
    "https://files.catbox.moe/58d0mj.mp4", // Video 1
    "https://files.catbox.moe/3z34lr.mp4", // Video 2
    "https://files.catbox.moe/ku9sdi.mp4", // Video 3
    "https://files.catbox.moe/ceg81a.mp4", // Video 4
     "https://files.catbox.moe/7ho7yx.mp4", // Video 1
    "https://files.catbox.moe/uap62b.mp4", // Video 2
    "https://files.catbox.moe/4n1o24.mp4", // Video 3
    "https://files.catbox.moe/995cuf.mp4" // Video 10
];

// QUẢN LÝ INTRO ĐIỆN ẢNH (3.2 GIÂY)
window.introStartTime = 0; 
window.introDuration = 3200; 
window._sfxCuts = [false, false, false, false, false]; 
window.introParams = null; 

// QUẢN LÝ SẠN (BAIT) IN-GAME
window._baitTriggered = false;
window._baitType = -1; // 0: Pin yếu, 1: Tin nhắn mẹ, 2: Ping 999ms
window._baitStartTime = 0;

window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 

// HỆ THỐNG ENGAGEMENT PARTICLES (TIM, SAVE, COMMENT BAY LÊN)
window._engagementParticles = Array.from({length: 20}, () => ({ active: false, x: 0, y: 0, v: 0, icon: "", alpha: 0, scale: 1 }));

window.getRealCharName = function(obj, fallback) {
    if (!obj) return fallback.toUpperCase();
    let n = null;
    if (obj.classId !== undefined && window.classStats && window.classStats[obj.classId]) { n = window.classStats[obj.classId].className || window.classStats[obj.classId].name; }
    if (!n) n = obj.className || obj.name || obj.type || obj.id;
    if (!n || n === "undefined" || n === "null") return fallback.toUpperCase();
    return String(n).toUpperCase().trim();
};

const THEMES = [
    { id: "fire", c1: "#3a0000", c2: "#050000", aura: "#ff003c" }, { id: "ice", c1: "#001b3a", c2: "#00050a", aura: "#00f3ff" },
    { id: "toxic", c1: "#0a2a00", c2: "#000a00", aura: "#39ff14" }, { id: "void", c1: "#1a003a", c2: "#05000a", aura: "#b100ff" },
    { id: "gold", c1: "#3a2500", c2: "#0a0500", aura: "#ffb800" }, { id: "blood", c1: "#2a0000", c2: "#000000", aura: "#ff0000" }
];

const LORES = [
    { chapter: "ACT I: THE BETRAYAL", p2Sub: "I taught you everything...", p1Sub: "Now I'll show you my wrath." },
    { chapter: "FINAL CHAPTER: ENDGAME", p2Sub: "Know your place, kid.", p1Sub: "Your era ends tonight." },
    { chapter: "제 1막: 배신", p2Sub: "내가 모든 걸 가르쳤거늘...", p1Sub: "이제 내 분노를 보여주지." },
    { chapter: "마지막 장: 종말", p2Sub: "주제를 알아라, 꼬마야.", p1Sub: "네 시대는 오늘 끝난다." },
    { chapter: "第一幕：裏切り", p2Sub: "すべてを教えたというのに…", p1Sub: "今、私の怒りを見せてやる。" }
];

const WAGER_BADGES = [
    "🏆 GLOBAL TOP 1% RANKED DUEL", "💰 $10,000 WAGER MATCH", "💀 PERMA-BAN DEATHMATCH"
];

function makeTypo(str) {
    if(Math.random() > 0.5) return str; 
    let arr = str.split('');
    let idx = Math.floor(Math.random() * (arr.length - 2)) + 1;
    if (arr[idx] !== ' ' && arr[idx+1] !== ' ') {
        let temp = arr[idx]; arr[idx] = arr[idx+1]; arr[idx+1] = temp;
    }
    return arr.join('');
}

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let t1 = r(THEMES); let t2 = r(THEMES.filter(t => t.id !== t1.id));
    let lore = r(LORES);
    let fakeChapter = makeTypo(lore.chapter);
    return { themeP1: t1, themeP2: t2, lore: { ...lore, chapter: fakeChapter }, badge: r(WAGER_BADGES) };
};

window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "GamerPro99", color: "#aaaaaa" }, { name: "User_8492", color: "#cccccc" },
    { name: "TienBip", color: "#00ffcc" }, { name: "WangZhe", color: "#ff66b2" },
    { name: "ParkJi", color: "#99ccff" }, { name: "NoobSlayer", color: "#ff9900" }
];

const TOXIC_MSGS = [
    "Skill issue tbh 💀", "Bro is playing on a microwave 🍞", "AIN'T NO WAY HE MISSED THAT 😭",
    "Uninstall the game bro", "RIP BOZO 📉", "L L L L L L", "W W W W W W", "Bro got lobotomized 🧠📉",
    "Đánh như cái máy khâu 🐔", "Xóa game đi bạn êi 🤡", "Quả xử lý cồng kềnh vãi 💀", "Mua acc à bạn?", 
    "Tuyển bạn này vào đánh giải... làng 🤣", "Khóc đi 😭", "Gà 🐔🐔", 
    "ㅋㅋ 봇인줄", "실화냐? 💀", "草", "太菜了吧 😂", "wwwwwwww", "回家种田吧"
];

window._recentChatsMemory = [];

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    let msg = r(TOXIC_MSGS);
    let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(TOXIC_MSGS); attempts++; }
    
    window._recentChatsMemory.push(msg); 
    if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, lines: null, nameWidth: 0 };
};

// Căn lề Bảng Chat nhỏ lại một chút bên phải để nhường chỗ Facecam (Trừ đi 250px)
window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; ctx.font = "bold 34px Arial"; chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 960 - 250 - chatObj.nameWidth - 10; 
    let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { let testLine = currentLine + words[n] + " "; if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { lines.push(currentLine.trim()); currentLine = words[n] + " "; } else { currentLine = testLine; } }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

window.retentionParticles = Array.from({length: 40}, () => ({ active: false, x: 0, y: 0, s: 0, v: 0, h: 0, age: 0 }));
window.retentionEmojis = Array.from({length: 15}, () => ({ active: false, x: 0, y: 0, v: 0, e: "", r: 0, age: 0 }));

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    viralTitle: "",
    generateViralStickmanTitle: function() {
        const adjs = ["ILLEGAL", "SCHIZO", "BIBLICALLY ACCURATE", "DIABOLICAL", "5D CHESS"];
        const acts = ["PSYCHOLOGICAL WARFARE", "LOBOTOMY COMBO", "SCHIZO MOVEMENT", "GASLIGHTING"];
        const subs = ["PAID ACTOR", "INNOCENT TIMMY", "DEV", "AI BOSS"];
        const tmpls = [`BRO INITIATED [ACTION] ON A [SUBJECT] 💀`, `USING [ADJ] [ACTION] IS BANNED ☢️`, `ABSOLUTE CINEMA: 0 IQ [SUBJECT] VS [ADJ] AURA 👁️👄👁️`];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let rawTitle = r(tmpls).replace(/\[ADJ\]/g, () => r(adjs)).replace(/\[ACTION\]/g, () => r(acts)).replace(/\[SUBJECT\]/g, () => r(subs));
        return `${rawTitle} #gaming #cinema`;
    },
    generateViralPostKit: function() {
        const title = this.generateViralStickmanTitle();
        const pinnedComments = [
            `👇 PINNED: Did they actually deserve to win this or was it pure luck? Be honest. 💀`,
            `👇 PINNED: Rate this combo 1-10 in the comments. Be brutal. 🔥`,
            `👇 PINNED: Did anyone notice the typo at the start? 😭📉` 
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `🎬 TIKTOK POST KIT\n\n📌 TITLE:\n${title}\n\n💬 PINNED COMMENT:\n${r(pinnedComments)}`;
    },
    init: function() { this.viralTitle = this.generateViralStickmanTitle(); }, stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
        let ctxV = window.bakedThumbV.getContext('2d');
        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1; let prm = window.introParams; 
        
        ctxV.fillStyle = prm.themeP1.c1; ctxV.fillRect(0, 0, 1080, 1920); ctxV.save(); ctxV.translate(540, 960);
        for(let i=0; i<30; i++) { ctxV.rotate(Math.PI / 15); ctxV.fillStyle = prm.themeP2.c1; ctxV.beginPath(); ctxV.moveTo(0, 0); ctxV.lineTo(2000, 100); ctxV.lineTo(2000, -100); ctxV.fill(); }
        ctxV.restore(); ctxV.globalCompositeOperation = 'overlay'; ctxV.fillStyle = "rgba(0, 0, 0, 0.5)";
        for(let x=0; x<1080; x+=20) { for(let y=0; y<1920; y+=20) { if((x+y)%40===0) { ctxV.beginPath(); ctxV.arc(x, y, 4, 0, Math.PI*2); ctxV.fill(); } } } ctxV.globalCompositeOperation = 'source-over';
        
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            for(let i=0; i<3; i++) { if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); }
            if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        };
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        
        ctxV.save(); let rx = 540; let ry = 1920*0.4 + Math.random()*150;
        ctxV.strokeStyle = prm.themeP2.aura; ctxV.lineWidth = 18; ctxV.beginPath(); ctxV.ellipse(rx, ry, 90 + Math.random()*40, 135 + Math.random()*40, Math.random()*0.5, 0, Math.PI*2); ctxV.stroke();
        ctxV.font = "110px Arial"; ctxV.fillText(rx > 540 ? "⬅️" : "➡️", rx + (rx > 540 ? -150 : 75), ry);
        ctxV.translate(1080*0.7, 1920*0.6); ctxV.rotate((Math.random()-0.5)*0.5); 
        ctxV.font = "italic 900 80px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.lineWidth = 18; ctxV.strokeStyle = "#000"; ctxV.strokeText(prm.lore.chapter, 0,0);
        ctxV.fillStyle = prm.themeP2.aura; ctxV.fillText(prm.lore.chapter, 0,0); ctxV.fillStyle = "#fff"; ctxV.fillText(prm.lore.chapter, -4,-4); ctxV.restore();
        
        ctxV.save(); let grad = ctxV.createRadialGradient(540, 960, 500, 540, 960, 1920); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
        ctxV.fillStyle = grad; ctxV.fillRect(0,0,1080,1920); ctxV.translate(540, 300); ctxV.rotate(-0.06); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `italic 900 85px 'Arial Black', Impact`; 
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(); let words = shortTitle.split(" "); let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
        lines.forEach((line, index) => { let yOffset = index * 95; ctxV.lineWidth = 25; ctxV.strokeStyle = "#000"; for(let d=15; d>0; d--) { ctxV.strokeText(line, d, yOffset + d); ctxV.fillStyle = prm.themeP1.c1; ctxV.fillText(line, d, yOffset + d); } ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = prm.themeP1.aura; ctxV.fillText(line, 0, yOffset); ctxV.fillStyle = "#ffffff"; ctxV.fillText(line, -3, yOffset - 3); }); ctxV.restore();
    } catch (e) {}
};

function drawBaitSạn(ctx, w, h) {
    if (!window._baitTriggered || window._baitType === -1) return;
    let timeSinceBait = Date.now() - window._baitStartTime;
    if (timeSinceBait > 3500) { window._baitType = -1; return; } 

    ctx.save();
    let alpha = 1;
    if (timeSinceBait < 300) alpha = timeSinceBait / 300;
    if (timeSinceBait > 3200) alpha = 1 - ((timeSinceBait - 3200) / 300);
    ctx.globalAlpha = alpha;

    if (window._baitType === 0) {
        ctx.translate(w/2, h/2);
        ctx.fillStyle = "rgba(230, 230, 230, 0.95)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-220, -100, 440, 200, 20); else ctx.fillRect(-220, -100, 440, 200); ctx.fill();
        ctx.fillStyle = "#000"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
        ctx.fillText("Low Battery", 0, -40);
        ctx.font = "20px Arial";
        ctx.fillText("10% battery remaining.", 0, 0);
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-220, 40); ctx.lineTo(220, 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 100); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "22px Arial";
        ctx.fillText("Close", -110, 75); ctx.fillText("Low Power Mode", 110, 75);
    } 
    else if (window._baitType === 1) {
        let slideY = timeSinceBait < 400 ? -150 + (timeSinceBait/400)*250 : 100;
        ctx.translate(w/2, slideY);
        ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 20;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-400, -50, 800, 100, 25); else ctx.fillRect(-400, -50, 800, 100); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(-330, 0, 35, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("M", -330, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left";
        ctx.font = "bold 28px Arial"; ctx.fillText("Mẹ 😡", -270, -15);
        ctx.font = "24px Arial"; ctx.fillStyle = "#555"; ctx.fillText("Tắt máy đi ngủ ngay không tao đập máy bây giờ", -270, 20);
    }
    else if (window._baitType === 2) {
        if (Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.translate(w - 200, 150);
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-30, -30, 180, 60, 10); else ctx.fillRect(-30, -30, 180, 60); ctx.fill();
            ctx.fillStyle = "#ff0000"; ctx.font = "bold 30px 'Arial Black', sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("📶 999ms", 60, 0);
        }
    }
    ctx.restore();
}

window.drawProceduralIntro = function(ctx, w, h, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let prm = window.introParams;

    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(e1, "OPPONENT");

    let act = 0; let localProg = 0;
    if (progress < 0.25) { act = 0; localProg = progress / 0.25; } 
    else if (progress < 0.55) { act = 1; localProg = (progress - 0.25) / 0.30; } 
    else if (progress < 0.80) { act = 2; localProg = (progress - 0.55) / 0.25; } 
    else { act = 3; localProg = (progress - 0.80) / 0.20; } 

    if (!window._sfxCuts[act]) {
        if (act === 0 && typeof window.playSound === 'function') window.playSound(100, 'sine', 0.5, 1.0); 
        if (act === 1 && typeof window.playSound === 'function') window.playSound(300, 'square', 0.1, 0.5); 
        if (act === 2 && typeof window.playSound === 'function') window.playSound(200, 'triangle', 0.2, 0.5); 
        if (act === 3 && typeof window.playSound === 'function') window.playSound(120, 'sawtooth', 0.8, 1.5, true); 
        window._sfxCuts[act] = true;
    }

    const drawCRTScanlines = () => {
        ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = "#000";
        for(let y=0; y<h; y+=8) ctx.fillRect(0, y, w, 2);
        ctx.restore();
    };

    const drawFighterArtistic = (charObj, cx, cy, forcedState, isFacingRight, theme, charName, isTrail = false) => {
        if(!charObj) return; ctx.save(); ctx.translate(cx, cy); 
        if (charName && act < 3 && !isTrail) {
            ctx.save(); ctx.translate(0, -200); ctx.scale(0.8, 0.8); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.font = "900 40px 'Arial Black', sans-serif"; ctx.shadowColor = theme.aura; ctx.shadowBlur = 25;
            ctx.lineWidth = 6; ctx.strokeStyle = "#000"; ctx.strokeText(charName, 0, 0); 
            ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.fillText(charName, 0, 0);
            ctx.fillStyle = theme.aura; ctx.fillRect(-40, 25, 80, 4); ctx.restore();
        }
        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.2, isFacingRight: true, state: forcedState});
        if (!isTrail) ctx.filter = "contrast(115%) saturate(120%) drop-shadow(0 20px 20px rgba(0,0,0,0.8))";
        if (!isTrail) {
            ctx.save(); ctx.globalAlpha = 0.5 + Math.sin(Date.now()*0.02)*0.1; 
            ctx.shadowBlur = 50; ctx.shadowColor = theme.aura; ctx.scale(1.15, 1.15);
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        }
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
    };

    ctx.save();
    let cutShake = 0; let panX = 0; let currentZoom = 2.0; 

    if (act === 0) { currentZoom = 2.5 - localProg * 0.3; panX = 40; cutShake = (Math.random()-0.5)*10; } 
    else if (act === 1) { currentZoom = 2.5; panX = 60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 2) { currentZoom = 2.2; panX = -60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 3) { currentZoom = 1.2 + localProg * 0.5; cutShake = (Math.random() - 0.5) * 50; }
    
    ctx.translate(w/2 + cutShake + panX, h/2 + cutShake);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(0, 100); 

    let bgTheme = (act === 0 || act === 1) ? prm.themeP2 : prm.themeP1;
    let bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    bgGrad.addColorStop(0, bgTheme.c1); bgGrad.addColorStop(1, bgTheme.c2);
    ctx.fillStyle = bgGrad; ctx.fillRect(-w, -h, w*2, h*2);

    if (act === 0) {
        drawFighterArtistic(window.p1, 0, 100, 'idle', true, prm.themeP1, realP1Name);
        ctx.restore(); 
        ctx.save();
        if(!window._introEmojis || window._introEmojis.length === 0) {
            window._introEmojis = [];
            const emos = ["💀", "🤡", "🐔", "❓", "📉", "😂", "🔥", "🥶", "🤯"];
            for(let c=0; c<25; c++) {
                window._introEmojis.push({
                    e: emos[Math.floor(Math.random()*emos.length)],
                    x: (Math.random()-0.5)*900, y: (Math.random()-0.5)*900,
                    s: 0.1, maxS: 1 + Math.random()*2.5, rot: (Math.random()-0.5)*1
                });
            }
        }
        for(let e of window._introEmojis) {
            if (e.s < e.maxS) e.s += 0.2;
            e.y -= 4; 
            ctx.save(); ctx.translate(w/2 + e.x, h/2 + e.y); ctx.rotate(e.rot); ctx.scale(e.s, e.s);
            ctx.font = "60px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(e.e, 0, 0); ctx.restore();
        }
        ctx.restore();
        ctx.save(); ctx.translate(w/2 + cutShake + panX, h/2 + cutShake); ctx.scale(currentZoom, currentZoom); ctx.translate(0, 100); 
    } 
    else if (act === 1) {
        drawFighterArtistic(window.p1, 0, 100, 'cast', true, prm.themeP1, "");
        ctx.restore(); 
        ctx.save();
        
        let chatW = 850; let chatH = 260;
        ctx.translate(w/2, h - chatH/2 - 200); 
        
        ctx.fillStyle = "rgba(10, 15, 30, 0.85)";
        ctx.strokeStyle = "rgba(0, 243, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-chatW/2, -chatH/2, chatW, chatH, 20); else ctx.fillRect(-chatW/2, -chatH/2, chatW, chatH);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = "#ff0050";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-chatW/2, -chatH/2 - 20, 110, 45, 12); else ctx.fillRect(-chatW/2, -chatH/2 - 20, 110, 45);
        ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "900 22px 'Arial Black'"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("LIVE", -chatW/2 + 55, -chatH/2 + 2);
        
        ctx.textAlign="right"; ctx.font="bold 24px Arial"; ctx.fillStyle="#ccc";
        ctx.fillText("👁️ " + (Math.floor(Math.random()*500)+1500) + " Viewers", chatW/2 - 20, -chatH/2 + 35);
        
        if(!window._introBottomChats) {
            window._introBottomChats = [window.generateLiveChatEvent(), window.generateLiveChatEvent(), window.generateLiveChatEvent(), window.generateLiveChatEvent()];
        }
        
        ctx.textAlign="left"; ctx.font="bold 30px Arial";
        let cY = -chatH/2 + 80;
        let numChatsToShow = Math.floor(localProg * 5); 
        for(let i=0; i<numChatsToShow && i < window._introBottomChats.length; i++) {
            let c = window._introBottomChats[i];
            ctx.fillStyle = c.color; ctx.fillText(c.name + ":", -chatW/2 + 30, cY);
            let nW = ctx.measureText(c.name + ":").width;
            ctx.fillStyle = "#fff"; 
            let text = c.msg.length > 35 ? c.msg.substring(0,35)+"..." : c.msg;
            ctx.fillText(" " + text, -chatW/2 + 30 + nW, cY);
            cY += 55;
        }
        
        ctx.restore();
        ctx.save(); ctx.translate(w/2 + cutShake + panX, h/2 + cutShake); ctx.scale(currentZoom, currentZoom); ctx.translate(0, 100); 
    }
    else if (act === 2) {
        drawFighterArtistic(e1, 0, 100, 'cast', false, prm.themeP2, realP2Name);
        
        ctx.restore(); 
        ctx.save();
        ctx.translate(w/2 + cutShake, h/2 - 250 + cutShake);
        if (!window._p2Bubbles) {
            window._p2Bubbles = [window.generateLiveChatEvent().msg, window.generateLiveChatEvent().msg];
        }
        ctx.font = "bold 28px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
        
        ctx.fillStyle = "rgba(255,255,255,0.95)"; 
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-380, -60, 360, 70, 35); else ctx.fillRect(-380, -60, 360, 70); ctx.fill();
        ctx.fillStyle = "#000"; ctx.fillText(window._p2Bubbles[0].substring(0, 22) + "...", -200, -25);
        
        if (localProg > 0.3) {
            ctx.fillStyle = "rgba(255,255,255,0.95)"; 
            ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(20, 60, 360, 70, 35); else ctx.fillRect(20, 60, 360, 70); ctx.fill();
            ctx.fillStyle = "#000"; ctx.fillText(window._p2Bubbles[1].substring(0, 22) + "...", 200, 95);
        }
        ctx.restore();
        ctx.save(); ctx.translate(w/2 + cutShake + panX, h/2 + cutShake); ctx.scale(currentZoom, currentZoom); ctx.translate(0, 100); 
    } 
    else if (act === 3) {
        let easeIn = Math.pow(localProg, 3); 
        let pushP1 = -500 + (easeIn * 400); 
        let pushP2 = 500 - (easeIn * 400);
        
        for(let t=1; t<=3; t++) {
            let prevProg = Math.max(0, localProg - t*0.05); let prevEaseIn = Math.pow(prevProg, 3);
            let trP1 = -500 + (prevEaseIn * 400); let trP2 = 500 - (prevEaseIn * 400);
            ctx.globalAlpha = 0.3 / t; 
            drawFighterArtistic(e1, trP2, 100, 'attack', false, prm.themeP2, null, true);
            drawFighterArtistic(window.p1, trP1, 100, 'attack', true, prm.themeP1, null, true);
        }
        ctx.globalAlpha = 1.0;
        drawFighterArtistic(e1, pushP2, 100, 'attack', false, prm.themeP2, null);
        drawFighterArtistic(window.p1, pushP1, 100, 'attack', true, prm.themeP1, null);

        ctx.save();
        ctx.translate(0, -150);
        let vsScale = 3.5 - easeIn*1.5;
        ctx.scale(vsScale, vsScale);
        ctx.font = "900 120px 'Arial Black', sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.lineWidth = 15; ctx.strokeStyle = "#000"; ctx.strokeText("VS", 0, 0);
        ctx.fillStyle = "#ffeb3b"; ctx.fillText("VS", 0, 0);
        ctx.fillStyle = "#fff"; ctx.fillText("VS", -4, -4);
        ctx.restore();

        if (localProg > 0.8) {
            let shatterProg = (localProg - 0.8) * 5; 
            ctx.save(); ctx.translate(0, -100); ctx.strokeStyle = "#00f3ff"; ctx.lineWidth = 8; ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 20;
            for(let i=0; i<12; i++) {
                let ang = (Math.PI * 2 / 12) * i; let crackLen = Math.min(w, h) * shatterProg * 1.5;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang)*crackLen, Math.sin(ang)*crackLen); ctx.stroke();
            }
            if (shatterProg > 0.5) { let whiteFlash = (shatterProg - 0.5) * 2; ctx.fillStyle = `rgba(255, 255, 255, ${whiteFlash})`; ctx.fillRect(-w*2, -h*2, w*4, h*4); }
            ctx.restore();
        }
    }

    ctx.restore(); 

    let vigGrad = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.8);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)"); vigGrad.addColorStop(1, "rgba(0,0,0,0.95)");
    ctx.fillStyle = vigGrad; ctx.fillRect(0, 0, w, h);

    drawCRTScanlines();
    ctx.restore(); window.ctx = originalCtx;
};

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) { try { let source = window.audioCtx.createMediaElementSource(this); source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination); if (window.recordAnalyser) source.connect(window.recordAnalyser); this._routedToRecorder = true; } catch (e) { } }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { try { originalConnect.call(this, window.masterRecordDestination); if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser); } catch(e){} }
        return originalConnect.apply(this, arguments);
    };
}

window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV") || document.createElement("canvas");
    if (!window.recordCanvasV.id) { window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window.showRenderToast = function() {
    let toast = document.getElementById("render-toast-noti");
    if (!toast) { toast = document.createElement("div"); toast.id = "render-toast-noti"; toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff0050; color: white; padding: 12px 25px; border-radius: 30px; font-family: 'Arial Black', sans-serif; font-size: 16px; z-index: 2147483647; box-shadow: 0 4px 15px rgba(255,0,80,0.5); border: 2px solid #fff; transition: opacity 0.3s; pointer-events: none;"; document.body.appendChild(toast); }
    toast.innerHTML = "⏳ RENDERING TIKTOK... PLEASE WAIT (DON'T CLOSE)"; toast.style.opacity = "1";
};
window.hideRenderToast = function() { let toast = document.getElementById("render-toast-noti"); if (toast) toast.style.opacity = "0"; };

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

if (window._hookedDrawForRecorder && window.draw && window._originalDrawBeforeHook) { window.draw = window._originalDrawBeforeHook; }
if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true; window._originalDrawBeforeHook = window.draw; 
    window.draw = function() { if (window._originalDrawBeforeHook) window._originalDrawBeforeHook.apply(this, arguments); };
}

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    
    // ĐÓNG & RESET VIDEO FACECAM CŨ ĐỂ RANDOM LẠI KHI QUAY TRẬN MỚI
    if (window._facecamVideo) {
        window._facecamVideo.pause();
        window._facecamVideo.removeAttribute('src');
        window._facecamVideo.load();
        window._facecamVideo = null;
    }

    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.introParams = window.generateIntroParams();

    window.recordedChunksV = []; window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    window._introChatSpam = []; window._introEmojis = []; window._introBottomChats = null; window._p2Bubbles = null;
    window._liveAlerts = []; window._lastAlertTime = Date.now(); 
    window._baitTriggered = false; window._baitType = -1;
    let videoStreamV = window.recordCanvasV.captureStream(0); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 6000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    let charName = window.getRealCharName(window.p1, "PLAYER");
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) enemyName = window.getRealCharName(window.enemies[0], "BOSS");

    window.StoryModeAI.init(charName, enemyName);
    
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window._chatSystemInit = false; window._cachedGradients = {};
    if (typeof window._fakeViewers === "undefined") window._fakeViewers = 350 + Math.floor(Math.random() * 500);

    window.mediaRecorderV.onstop = () => {
        setTimeout(() => {
            window.hideRenderToast();
            if (window.recordedChunksV.length === 0) return;
            let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
            let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
            window.savedVideos.unshift({ 
                id: Date.now(), urlV: URL.createObjectURL(blobV), ext: window.currentVideoExt, 
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heroName: charName, heroAvatar: charAvatar, viralTitle: window.StoryModeAI.viralTitle, safeFileName: safeFileName,
                previewThumb: window.bakedThumbV ? window.bakedThumbV.toDataURL("image/jpeg", 0.3) : "" 
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 800); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._sfxCuts = [false, false, false, false, false]; 
    window._lastCaptureTime = Date.now(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    window.showRenderToast();
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 33) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    if (elapsed < 150) {
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); renderNormalV = false; 
    } else if (elapsed < window.introDuration) {
        let introProgress = (elapsed - 150) / (window.introDuration - 150); 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress); renderNormalV = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 35; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    let isKillCamActive = (window.gameOver && window.matchEndTimer > 0 && window.matchEndTimer < 45);

    if (renderNormalV && elapsed > 4000 && !window._baitTriggered && Math.random() < 0.008) {
        window._baitTriggered = true;
        window._baitType = Math.floor(Math.random() * 3); 
        window._baitStartTime = Date.now();
    }

    if (renderNormalV) {
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        ctxV.imageSmoothingEnabled = false;

        if (isKillCamActive) {
            ctxV.save(); ctxV.translate(540, splitGameHeight / 2); ctxV.scale(1.25, 1.25); ctxV.translate(-540, -splitGameHeight / 2);
            if (window.matchEndTimer < 16 && window.matchEndTimer % 4 === 0) ctxV.filter = "invert(100%) contrast(200%)";
        }

        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

        // HIỂN THỊ "LIVE & VIEWERS" TRONG GÓC GAME BÊN PHẢI ĐỒNG BỘ NGANNG HÀNG THÔNG BÁO BÊN TRÁI
        if (typeof window._fakeViewers !== "undefined") {
            ctxV.save();
            let badgeY = splitGameHeight - 35;
            let badgeX = 1060; 
            
            ctxV.font = "bold 22px Arial";
            let viewStr = "👁️ " + window._fakeViewers.toLocaleString();
            let viewW = ctxV.measureText(viewStr).width;
            
            ctxV.fillStyle = "rgba(0, 0, 0, 0.65)";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40); }
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "right"; ctxV.textBaseline = "middle";
            ctxV.fillText(viewStr, badgeX - 10, badgeY);

            let liveW = 75;
            ctxV.fillStyle = (Math.floor(Date.now()/500)%2===0) ? "#ff0050" : "#d90040";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40); }
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "center";
            ctxV.fillText("LIVE", badgeX - viewW - 25 - liveW/2 - 5, badgeY + 2);
            ctxV.restore();
        }

        // HỆ THỐNG THÔNG BÁO FOLLOW / ROSE TIKTOK (BOTTOM LEFT, BAY LÊN) - NGANG HÀNG LIVE & VIEWERS
        if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) { 
            window._lastAlertTime = Date.now(); 
            let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫| 🐻| 🎤| 🪨| 🤫| 🤨| 🇺🇸| ⛳| 🍦| 🤣| 😤| 🕺| 🐉| 🦇| 🧤/g, ''); 
            let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} shared the stream!`, `👤 ${randomUser} started following you!`, `🎁 ${randomUser} sent a Rose!`, `🔥 ${randomUser} joined the LIVE!`]; 
            window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); 
        }

        let alertStartX = 20; 
        let alertStartY_Left = splitGameHeight - 15; // Nằm sát mép dưới bên trái game
        
        for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
            let al = window._liveAlerts[i]; 
            al.life -= 0.012; 
            al.yOffset += 1.8; 
            ctxV.save(); 
            ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 2.0)); 
            ctxV.font = "bold 24px Arial"; 
            let textW = ctxV.measureText(al.text).width; 
            ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
            
            let alertGrad = ctxV.createLinearGradient(0, 0, textW + 40, 0);
            alertGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
            alertGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            
            ctxV.fillStyle = alertGrad; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -23, textW + 40, 46, 23); ctxV.fill(); } else { ctxV.fillRect(0, -23, textW + 40, 46); } 
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
            ctxV.fillText(al.text, 15, 0); 
            ctxV.restore(); 
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        if (isKillCamActive) ctxV.restore();

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; ctxV.fillStyle = '#ff0000'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.fillStyle = '#00ffff'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        drawBaitSạn(ctxV, 1080, splitGameHeight);

        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        if(!window._cachedGradients.bgGrid) { window._cachedGradients.bgGrid = ctxV.createLinearGradient(0, retainY, 0, 1920); window._cachedGradients.bgGrid.addColorStop(0, "#0b001a"); window._cachedGradients.bgGrid.addColorStop(1, "#3c003c"); }
        ctxV.fillStyle = window._cachedGradients.bgGrid; ctxV.fillRect(0, retainY, 1080, retainHeight); 
        
        ctxV.strokeStyle = "rgba(0, 255, 200, 0.15)"; ctxV.lineWidth = 2; 
        if(!window._gridVerticalPath) { window._gridVerticalPath = new Path2D(); for(let x = -20; x <= 20; x+=2) { window._gridVerticalPath.moveTo(540, retainY); window._gridVerticalPath.lineTo(540 + x * 200, 1920); } }
        ctxV.stroke(window._gridVerticalPath); ctxV.beginPath(); 
        let zSpeed = (Date.now() / 15) % 20; for(let y = 1; y < 30; y++) { let actualY = retainY + Math.pow(y, 1.8) * 2.5 + zSpeed; if (actualY <= 1920) { ctxV.moveTo(0, actualY | 0); ctxV.lineTo(1080, actualY | 0); } }
        ctxV.stroke(); 

        if (Math.random() < 0.3) {
            let p = window.retentionParticles.find(p => !p.active);
            if (p) { p.active = true; p.x = Math.random() * 1080; p.y = 1920 + 50; p.s = Math.random() * 6 + 3; p.v = Math.random() * 8 + 4; p.h = Math.random() > 0.5 ? 300 : 190; p.age = 0; }
        }
        ctxV.fillStyle = "rgba(0, 255, 200, 0.8)"; ctxV.beginPath(); 
        for (let i = 0; i < window.retentionParticles.length; i++) {
            let p = window.retentionParticles[i]; if (!p.active) continue;
            p.age++; p.y -= p.v; p.x += Math.sin(p.age * 0.1) * 3; ctxV.rect(p.x | 0, p.y | 0, p.s | 0, p.s | 0); 
            if (p.y < retainY) p.active = false; 
        }
        ctxV.fill(); 

        if (!isOutroActive) {
            let bannerY = retainY; ctxV.fillStyle = "#ff0055"; ctxV.fillRect(0, bannerY, 1080, 60);
            ctxV.fillStyle = "#fff"; ctxV.font = "900 35px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
            let offsetBanner = ((Date.now() / 6) % 1000) | 0; 
            for(let i = -1; i < 5; i++) { ctxV.fillText("🚨 WAIT FOR THE END ⏩ DO NOT BLINK 🚨", i*850 - offsetBanner, bannerY + 30); }

            if (audioPeak > 0.5 && Math.random() < 0.35) { 
                let ep = window._engagementParticles.find(e => !e.active);
                if (ep) {
                    const icons = ["❤️", "❤️", "🔖", "💬", "🔥", "💯"];
                    ep.active = true; ep.x = 900 + Math.random() * 120; ep.y = 1800;
                    ep.v = 6 + Math.random() * 6; ep.icon = icons[Math.floor(Math.random() * icons.length)];
                    ep.alpha = 1.0; ep.scale = 0.5;
                }
            }
            for (let i = 0; i < window._engagementParticles.length; i++) {
                let ep = window._engagementParticles[i]; if (!ep.active) continue;
                ep.y -= ep.v; ep.alpha -= 0.01; ep.scale += 0.05;
                ctxV.save(); ctxV.globalAlpha = Math.max(0, ep.alpha);
                ctxV.font = "50px Arial"; ctxV.textAlign = "center";
                ctxV.translate(ep.x + Math.sin(ep.y * 0.05) * 15, ep.y); ctxV.scale(Math.min(1.5, ep.scale), Math.min(1.5, ep.scale));
                ctxV.fillText(ep.icon, 0, 0); ctxV.restore();
                if (ep.alpha <= 0 || ep.y < retainY) ep.active = false;
            }

            if (audioPeak > 0.35 && Math.random() < 0.25) { 
                let re = window.retentionEmojis.find(e => !e.active);
                if (re) { const emos = ["🔥", "💀", "🤯", "🥶", "💯", "📈"]; re.active = true; re.x = 100 + Math.random() * 880; re.y = 1920 + 50; re.v = 10 + Math.random() * 8; re.e = emos[(Math.random() * emos.length) | 0]; re.r = (Math.random() - 0.5) * 0.5; re.age = 0; }
            }
            for (let i = 0; i < window.retentionEmojis.length; i++) {
                let re = window.retentionEmojis[i]; if (!re.active) continue;
                re.age++; re.y -= re.v; let sway = Math.sin(re.age * 0.05) * 50; 
                ctxV.save(); ctxV.translate((re.x + sway) | 0, re.y | 0); ctxV.rotate(re.r + Math.sin(Date.now()/200)*0.2); let eScale = Math.min(1, re.age * 0.1); ctxV.scale(eScale, eScale);
                ctxV.font = "90px Arial"; ctxV.globalAlpha = Math.max(0, Math.min(1, (re.y - retainY - 100) / 400)); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(re.e, 0, 0); ctxV.restore();
                if (re.y < retainY) re.active = false;
            }

            if (!window.hudImages) window.hudImages = {};
            const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
            let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; let p1Hp = 0.5, p2Hp = 0.5; 

            if (window.p1) {
                const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
                p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100); let eHp = 0, eMax = window.totalEnemyMaxHp || 1, eStam = 0;
                
                let p1Name = window.getRealCharName(window.p1, "PLAYER");
                let eName = "BOSS";
                if (repEnemyObj) {
                    window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100); 
                    eName = window.getRealCharName(repEnemyObj, "BOSS");
                }

                let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";
                if (window.p1 && window.classStats && window.classStats[window.p1.classId]) { p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; }
                if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) { p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
                
                let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); let maxNameWidthV = 280; let hudBaseY = splitGameHeight + 90; 
                ctxV.lineJoin = "round"; ctxV.textAlign = "left"; ctxV.textBaseline = "alphabetic";
                
                if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(53, hudBaseY, 107, 107, 13); else ctxV.rect(53, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img1, 53, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(53, hudBaseY, 107, 107); }
                ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; ctxV.strokeText(p1Name, 180, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 180, hudBaseY + 50, maxNameWidthV);
                drawSkewedPath(ctxV, 187, hudBaseY + 73, 300, 53, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                if (p1Hp > 0) { if(!window._cachedGradients.hpP1) { window._cachedGradients.hpP1 = ctxV.createLinearGradient(187, 0, 487, 0); window._cachedGradients.hpP1.addColorStop(0, "#00f2fe"); window._cachedGradients.hpP1.addColorStop(1, "#4facfe"); } drawSkewedPath(ctxV, 187, hudBaseY + 73, (300 * p1Hp) | 0, 53, true); ctxV.fillStyle = window._cachedGradients.hpP1; ctxV.fill(); }
                ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(187, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(187, hudBaseY + 140, (250 * p1Stam) | 0, 20);
                
                if (repEnemyObj) {
                    ctxV.textAlign = "right"; 
                    if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(920, hudBaseY, 107, 107, 13); else ctxV.rect(920, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img2, 920, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(920, hudBaseY, 107, 107); }
                    ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; ctxV.strokeText(eName, 900, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 900, hudBaseY + 50, maxNameWidthV);
                    drawSkewedPath(ctxV, 580, hudBaseY + 73, 300, 53, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                    if (p2Hp > 0) { if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(580, 0, 880, 0); window._cachedGradients.hpP2.addColorStop(0, "#ff0844"); window._cachedGradients.hpP2.addColorStop(1, "#ffb199"); } let eHpWidth = (300 * p2Hp) | 0; drawSkewedPath(ctxV, 580 + (300 - eHpWidth), hudBaseY + 73, eHpWidth, 53, false); ctxV.fillStyle = window._cachedGradients.hpP2; ctxV.fill(); }
                    ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(650, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(650 + (250 - ((250 * eStam) | 0)), hudBaseY + 140, (250 * eStam) | 0, 20);
                }
            }

            if (window.p1 && repEnemyObj) {
                ctxV.save(); let pollY = splitGameHeight + 315; let pollWidth = 800; let pollX = 540; ctxV.translate(pollX, pollY);
                let pulseText = 1 + Math.sin(Date.now() / 150) * 0.05; ctxV.save(); ctxV.scale(pulseText, pulseText); ctxV.fillStyle = "#ffeb3b"; ctxV.font = "900 22px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "bottom"; ctxV.shadowColor = "#ffeb3b"; ctxV.shadowBlur = 8; ctxV.fillText("👇 WHO WILL WIN? 👇", 0, -25); ctxV.restore();
                
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                
                ctxV.fillStyle = "#ff0055"; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.clip(); } ctxV.fillStyle = "#00f3ff"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36); ctxV.restore();
                ctxV.strokeStyle = "rgba(255,255,255,0.6)"; ctxV.lineWidth = 4; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); } else { ctxV.strokeRect(-pollWidth/2, 0, pollWidth, 36); }
                
                ctxV.fillStyle = "#1e293b"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill(); 
                ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke(); ctxV.fillStyle = "#fff"; ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
                
                ctxV.fillStyle = "#000"; ctxV.font = "900 24px 'Arial Black'"; 
                ctxV.textAlign = "left"; ctxV.fillText(`${Math.round(p1Pct*100)}%`, -pollWidth/2 + 20, 18); 
                ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}%`, pollWidth/2 - 20, 18);
                ctxV.restore();
            }

            if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent(); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }
            let chatNow = Date.now();
            if (chatNow - window._lastChatUpdate > window._nextChatDelay) { window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; let newChat = window.generateLiveChatEvent(); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); if (window._liveChats.length > 12) window._liveChats.shift(); window._fakeViewers += Math.floor(Math.random() * 41) - 15; if(window._fakeViewers < 200) window._fakeViewers += Math.floor(Math.random() * 50); if(window._fakeViewers > 2500) window._fakeViewers -= Math.floor(Math.random() * 50); }

            // =========================================================
            // CHAT BOX KHUNG CAO HƠN & TÍCH HỢP WATERMARK / FACECAM
            // =========================================================
            let boxWidth = 960; let boxHeight = 920; let boxX = 540; let boxY = 1390; 

            ctxV.save(); ctxV.translate(boxX, boxY); 
            ctxV.fillStyle = "rgba(10, 15, 30, 0.6)"; ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; ctxV.lineWidth = 3;
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); ctxV.fill(); ctxV.stroke();
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.clip(); 
            
            // 1. WATERMARK CHÌM VÀO NỀN CHAT BOX
            ctxV.save();
            ctxV.rotate(-0.15); 
            ctxV.font = "900 80px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            let brandWM = window.CREATOR_HANDLE || "Sticklom";
            ctxV.lineWidth = 4; ctxV.strokeStyle = "rgba(0, 243, 255, 0.1)"; ctxV.strokeText(brandWM, 0, 50);
            ctxV.fillStyle = "rgba(255, 255, 255, 0.08)"; ctxV.fillText(brandWM, 0, 50);
            ctxV.restore();

            // 2. HEADER CỦA BẢNG CHAT
            ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 60); 
            ctxV.fillStyle = "#fff"; ctxV.font = "900 30px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
            ctxV.fillText("💬 LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 30); 
            
            // 3. FACECAM GÁI XINH (VIDEO DYNAMIC KÍCH THƯỚC)
            if (!window._facecamVideo) {
                window._facecamVideo = document.createElement('video');
                window._facecamVideo.crossOrigin = "Anonymous";
                window._facecamVideo.muted = true; // Bắt buộc mute để autoplay trên trình duyệt
                window._facecamVideo.loop = true;
                window._facecamVideo.playsInline = true;
                
                // Lấy random 1 video trong mảng
                let randomVid = window.FACECAM_VIDEO_URLS[Math.floor(Math.random() * window.FACECAM_VIDEO_URLS.length)];
                window._facecamVideo.src = randomVid;
                window._facecamVideo.play().catch(e => console.log("Lỗi chạy facecam: ", e));
            }

            if (window._facecamVideo && window._facecamVideo.readyState >= 2) { // HAVE_CURRENT_DATA
                ctxV.save();
                
                // Thuật toán tự động định dạng tỷ lệ Facecam theo Video Gốc
                let vW = window._facecamVideo.videoWidth;
                let vH = window._facecamVideo.videoHeight;
                
                if (vW > 0 && vH > 0) {
                    let maxW = 240; // Độ rộng tối đa để không đè lên text chat
                    let maxH = 280; // Độ cao tối đa
                    let camW, camH;
                    
                    if (vW / vH > maxW / maxH) {
                        // Video vuông hoặc thiên về chiều ngang -> Fit theo width
                        camW = maxW;
                        camH = maxW * (vH / vW);
                    } else {
                        // Video thiên về chiều dọc -> Fit theo height
                        camH = maxH;
                        camW = maxH * (vW / vH);
                    }
                    
                    // NGUYÊN TẮC NEO GÓC (ANCHOR): Cố định lề Phải (margin 20) và lề Trên (margin 15 - tương đương cách mép header 15px)
                    let camX = (boxWidth/2 - 20) - camW/2; 
                    let camY = (-boxHeight/2 + 75) + camH/2; 
                    
                    // Rung lắc nhẹ khi combat
                    if (audioPeak > 0.5) { camX += (Math.random() - 0.5) * 12; camY += (Math.random() - 0.5) * 12; }
                    
                    ctxV.translate(camX, camY);
                    
                    // Bo góc Facecam theo kích thước đã fit
                    ctxV.beginPath();
                    if(ctxV.roundRect) ctxV.roundRect(-camW/2, -camH/2, camW, camH, 15); else ctxV.rect(-camW/2, -camH/2, camW, camH);
                    ctxV.clip();
                    
                    // ZOOM HACK (AUDIO REACTIVE)
                    let zoom = 1.0 + (audioPeak * 0.25);
                    ctxV.scale(zoom, zoom);
                    
                    // Vì tỷ lệ cam đã tính khớp 100% tỷ lệ video, vẽ tràn khung là sẽ không bao giờ bị méo
                    ctxV.drawImage(window._facecamVideo, -camW/2, -camH/2, camW, camH);
                    ctxV.restore();
                    
                    // VẼ KHUNG VIỀN NEON BO GÓC BÊN NGOÀI
                    ctxV.save();
                    ctxV.translate(camX, camY);
                    ctxV.lineWidth = 5;
                    ctxV.strokeStyle = (Math.floor(Date.now()/200)%2===0) ? "#ff0055" : "#00f3ff";
                    ctxV.beginPath();
                    if(ctxV.roundRect) ctxV.roundRect(-camW/2, -camH/2, camW, camH, 15); else ctxV.rect(-camW/2, -camH/2, camW, camH);
                    ctxV.stroke();
                    ctxV.restore();
                }
            }

            // 4. CHAT TEXT (Đã tính toán chiều rộng an toàn để không đè lên khung 240px Facecam)
            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 60, boxWidth, boxHeight - 60); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 45; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 34px Arial"; let headerBottomY = -boxHeight/2 + 60; 
            
            for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                let chat = window._liveChats[i]; let nameStr = chat.name + ":"; 
                for(let l = chat.lines.length - 1; l >= 0; l--) {
                    if (currentY - lineHeight < headerBottomY - 10) break;
                    if (l === 0) { ctxV.fillStyle = chat.color; ctxV.fillText(nameStr, -boxWidth/2 + 30, currentY); ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY); } 
                    else { ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY); }
                    currentY -= lineHeight; 
                }
                if (currentY - lineHeight < headerBottomY - 10) break; currentY -= 15; 
            }
            ctxV.restore(); 

            // VIỀN CHỚP ĐỎ CỦA BOX CHAT KHI COMBAT
            if (audioPeak > 0.6) { ctxV.strokeStyle = "rgba(255, 0, 85, 0.6)"; ctxV.lineWidth = 12; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.stroke(); }
            ctxV.restore(); // KẾT THÚC VẼ BẢNG CHAT
            
        } else {
            // OUTRO ACTIVE (Kết thúc trận đấu) - Vùng vẽ in-game (cùng với Facecam) sẽ bị TẮT
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            let bgGrad = ctxV.createRadialGradient(540, 960, 0, 540, 960, 1920); bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)"); ctxV.fillStyle = bgGrad; ctxV.fillRect(0, 0, 1080, 1920);
            let cx = 540; let cy = 960; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; let floatY = (Math.sin(window.matchEndTimer * 0.05) * 10) | 0;
            
            ctxV.fillStyle = "#ffffff"; ctxV.font = `900 65px 'Arial Black', sans-serif`; ctxV.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500 + floatY); ctxV.fillStyle = "#ff0050"; ctxV.font = `900 45px 'Montserrat', sans-serif`; ctxV.fillText("👇 MORE COMBOS BELOW 👇", cx, cy - 430 + floatY);
            let gridY = cy - 350 + floatY; ctxV.lineWidth = 4;
            for(let i=-1; i<=1; i++) {
                let rx = cx + i*340 - 150; ctxV.fillStyle = "#111827"; ctxV.strokeStyle = (i===0) ? "#00f3ff" : "#334155";
                ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(rx, gridY, 300, 450, 20); else ctxV.rect(rx, gridY, 300, 450); ctxV.fill(); ctxV.stroke();
                ctxV.fillStyle = "#ffffff"; ctxV.font = "900 35px Arial Black"; ctxV.textAlign = "left"; let views = (i===-1) ? "1.2M" : (i===0) ? "3.4M" : "800K"; ctxV.fillText(`▶ ${views}`, rx + 20, gridY + 410);
            }
            ctxV.textAlign = "center"; let btnWidth = 640; let btnHeight = 160; let btnY = cy + 200 + floatY; let btnPulse = 1 + (audioPeak * 0.08); ctxV.translate(cx, btnY); ctxV.scale(btnPulse, btnPulse);
            if(!window._cachedGradients.btnCTA) { window._cachedGradients.btnCTA = ctxV.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); window._cachedGradients.btnCTA.addColorStop(0, "#ff0050"); window._cachedGradients.btnCTA.addColorStop(1, "#00f2fe"); }
            ctxV.fillStyle = window._cachedGradients.btnCTA; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctxV.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctxV.fill();
            ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctxV.stroke(); ctxV.fillStyle = "#ffffff"; ctxV.font = `900 60px 'Arial Black', sans-serif`; ctxV.fillText("✨ CREATE YOUR OWN", 0, 7);
            ctxV.restore();
        }
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 99999; position: relative;"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 32px;">🎬 STUDIO ARCHIVE</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">No battles recorded yet. Fight to generate content!</p>`; return; }
    let html = `<h3 style="margin: 0 0 20px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 35px;">🎬 STUDIO ARCHIVE (${window.savedVideos.length} VIDEOS)</h3><div style="display: flex; flex-direction: column; gap: 15px; max-height: 500px; overflow-y: auto; padding-right: 10px;">`;
    window.savedVideos.forEach((vid) => { 
        let postKitText = window.StoryModeAI.generateViralPostKit ? window.StoryModeAI.generateViralPostKit(vid.heroName, "BOSS") : vid.viralTitle;
        html += `<div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <div style="position: relative; width: 140px; height: 249px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(0,243,255,0.2);"><img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;"><span style="position: absolute; bottom: 0px; left: 0px; width: 100%; text-align: center; background: rgba(30, 215, 96, 0.95); color: #fff; font-size: 11px; padding: 5px 0px; font-weight: bold; letter-spacing: 1px;">✅ THUMBNAIL</span></div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div><span style="font-weight: 900; color: #ffeb3b; font-size: 20px; text-shadow: 0 0 5px rgba(255,235,59,0.3); display: block; margin-bottom: 8px; line-height: 1.2;">${vid.viralTitle}</span><div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; font-weight: 600;"><img src="${vid.heroAvatar}" style="width: 20px; height: 20px; border-radius: 50%;"> <span>${vid.heroName}</span><span>•</span><span>🕒 ${vid.timestamp}</span></div></div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;"><button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 13px;">📋 Copy Viral Post Kit</button><a href="${vid.urlV}" download="[SHORT]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4); border: 1px solid rgba(255,255,255,0.3); flex: 1; justify-content: center;">🚀 Download TikTok Video</a><button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: pointer;">❌ DEL</button></div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
