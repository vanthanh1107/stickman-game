// ==========================================
// RECORDER.JS - CINEMATIC STREAMER LAYOUT
// - Giao diện Sang trọng: Nền sâu thẳm, Bụi sáng điện ảnh.
// - Chat chuẩn Stream (Căn trái thẳng hàng, bọt khí Glassmorphism).
// - Thêm UI Livestream (LIVE Badge, Viewers) cho hợp lý.
// - Giữ nguyên Intro God-Tier & Outro Chém Neon.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

window.introStartTime = 0; window.introDuration = 3200; window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._baitTriggered = false; window._baitType = -1; window._baitStartTime = 0;
window._glitchThrottle = 0; 
window._lastCaptureTime = 0; window._recordLoopId = null; 
window._fakeViewers = 1500 + Math.floor(Math.random() * 500);

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

// MODULE KINETIC SUBTITLE (CHỮ NẢY MRBEAST)
window._hypeWords = ["BRO NO WAY 💀", "WAIT FOR IT...", "500 IQ 🧠", "LOBOTOMY 📉", "NAHHH 😭", "WHAT???", "GG EZ 🔥", "BRO IS COOKING 🍳"];
window._currentHype = { word: "", time: 0 };
window.ambientDust = Array.from({length: 30}, () => ({ x: Math.random()*1080, y: Math.random()*1920, s: Math.random()*2+1, v: Math.random()*1.5+0.5, a: Math.random() }));

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
    { chapter: "FINAL CHAPTER: ENDGAME", p2Sub: "Know your place, kid.", p1Sub: "Your era ends tonight." }
];

const WAGER_BADGES = ["🏆 GLOBAL TOP 1% RANKED DUEL", "💰 $10,000 WAGER MATCH", "💀 PERMA-BAN DEATHMATCH"];
window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return { themeP1: r(THEMES), themeP2: r(THEMES), lore: { ...r(LORES) }, badge: r(WAGER_BADGES) };
};

// ================= HỆ THỐNG CHAT TRÔI (STREAM ALIGNED) =================
window.CELEB_LIST = [
    { name: "IShowSpeed", color: "#ff4757" }, { name: "xQc", color: "#ffeb3b" },
    { name: "Kai Cenat", color: "#00f3ff" }, { name: "CaseOh", color: "#ffa502" },
    { name: "Jynxzi", color: "#2ed573" }, { name: "Tyler1", color: "#ff0055" },
    { name: "NoobSlayer", color: "#ff9900" }
];
const TOXIC_MSGS = [
    "Skill issue tbh 💀", "Bro is playing on a microwave 🍞", "AIN'T NO WAY HE MISSED THAT 😭",
    "Uninstall the game bro", "RIP BOZO 📉", "L L L L L L", "W W W W W W", "Bro got lobotomized 🧠",
    "Đánh như cái máy khâu 🐔", "Xóa game đi bạn êi 🤡", "Quả xử lý cồng kềnh vãi 💀", "Khóc đi 😭", "Gà 🐔🐔"
];

window._recentChatsMemory = [];
window._scrollingChats = []; 
window._lastChatUpdate = 0; window._nextChatDelay = 600;

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST); let msg = r(TOXIC_MSGS); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(TOXIC_MSGS); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, y: 1950, nameWidth: 0, msgWidth: 0 };
};

window.spawnScrollingChat = function(ctxV) {
    let chat = window.generateLiveChatEvent();
    ctxV.font = "bold 28px 'Segoe UI', Arial, sans-serif";
    chat.nameWidth = ctxV.measureText(chat.name + ": ").width;
    chat.msgWidth = ctxV.measureText(chat.msg).width;
    
    // Đẩy tốc độ cố định để các dòng chat không đè lên nhau
    chat.speed = 3.5; 
    window._scrollingChats.push(chat);
};

// ================= AUDIO & AI =================
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    viralTitle: "",
    generateViralStickmanTitle: function() { return `ABSOLUTE CINEMA 💀 #gaming #cinema`; },
    init: function() { this.viralTitle = this.generateViralStickmanTitle(); }, stop: function() {}
};
window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ================= INTRO & OUTRO THUMBNAILS =================
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
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
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

function drawBaitSạn(ctx, w, h, floatY) {
    if (!window._baitTriggered || window._baitType === -1) return;
    let timeSinceBait = Date.now() - window._baitStartTime;
    if (timeSinceBait > 3500) { window._baitType = -1; return; } 
    ctx.save(); let alpha = 1;
    if (timeSinceBait < 300) alpha = timeSinceBait / 300;
    if (timeSinceBait > 3200) alpha = 1 - ((timeSinceBait - 3200) / 300);
    ctx.globalAlpha = alpha;

    if (window._baitType === 0) {
        ctx.translate(w/2, 200 + floatY); ctx.fillStyle = "rgba(230, 230, 230, 0.95)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-220, -100, 440, 200, 20); else ctx.fillRect(-220, -100, 440, 200); ctx.fill();
        ctx.fillStyle = "#000"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center"; ctx.fillText("Low Battery", 0, -40);
        ctx.font = "20px Arial"; ctx.fillText("10% battery remaining.", 0, 0); ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-220, 40); ctx.lineTo(220, 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 100); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "22px Arial"; ctx.fillText("Close", -110, 75); ctx.fillText("Low Power Mode", 110, 75);
    } 
    ctx.restore();
}

window.drawProceduralIntro = function(ctx, w, h, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1; let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER"); let realP2Name = window.getRealCharName(e1, "OPPONENT");

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

    const drawCRTScanlines = () => { ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = "#000"; for(let y=0; y<h; y+=8) ctx.fillRect(0, y, w, 2); ctx.restore(); };

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

    ctx.save(); let cutShake = 0; let panX = 0; let currentZoom = 2.0; 

    if (act === 0) { currentZoom = 2.5 - localProg * 0.3; panX = 40; cutShake = (Math.random()-0.5)*10; } 
    else if (act === 1) { currentZoom = 2.5; panX = 60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 2) { currentZoom = 2.2; panX = -60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 3) { currentZoom = 1.2 + localProg * 0.5; cutShake = (Math.random() - 0.5) * 50; }
    
    ctx.translate(w/2 + cutShake + panX, h/2 + cutShake);
    ctx.scale(currentZoom, currentZoom); ctx.translate(0, 100); 

    let bgTheme = (act === 0 || act === 1) ? prm.themeP2 : prm.themeP1; let bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, w); bgGrad.addColorStop(0, bgTheme.c1); bgGrad.addColorStop(1, bgTheme.c2); ctx.fillStyle = bgGrad; ctx.fillRect(-w, -h, w*2, h*2);

    if (act === 0) { drawFighterArtistic(window.p1, 0, 100, 'idle', true, prm.themeP1, realP1Name); } 
    else if (act === 1) { drawFighterArtistic(window.p1, 0, 100, 'cast', true, prm.themeP1, ""); }
    else if (act === 2) { drawFighterArtistic(e1, 0, 100, 'cast', false, prm.themeP2, realP2Name); } 
    else if (act === 3) {
        let easeIn = Math.pow(localProg, 3); let pushP1 = -500 + (easeIn * 400); let pushP2 = 500 - (easeIn * 400);
        for(let t=1; t<=3; t++) { let prevProg = Math.max(0, localProg - t*0.05); let prevEaseIn = Math.pow(prevProg, 3); let trP1 = -500 + (prevEaseIn * 400); let trP2 = 500 - (prevEaseIn * 400); ctx.globalAlpha = 0.3 / t; drawFighterArtistic(e1, trP2, 100, 'attack', false, prm.themeP2, null, true); drawFighterArtistic(window.p1, trP1, 100, 'attack', true, prm.themeP1, null, true); }
        ctx.globalAlpha = 1.0; drawFighterArtistic(e1, pushP2, 100, 'attack', false, prm.themeP2, null); drawFighterArtistic(window.p1, pushP1, 100, 'attack', true, prm.themeP1, null);
        ctx.save(); ctx.translate(0, -150); let vsScale = 3.5 - easeIn*1.5; ctx.scale(vsScale, vsScale); ctx.font = "900 120px 'Arial Black', sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.lineWidth = 15; ctx.strokeStyle = "#000"; ctx.strokeText("VS", 0, 0); ctx.fillStyle = "#ffeb3b"; ctx.fillText("VS", 0, 0); ctx.fillStyle = "#fff"; ctx.fillText("VS", -4, -4); ctx.restore();
        if (localProg > 0.8) {
            let shatterProg = (localProg - 0.8) * 5; 
            ctx.save(); ctx.translate(0, -100); ctx.strokeStyle = "#00f3ff"; ctx.lineWidth = 8; ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 20;
            for(let i=0; i<12; i++) { let ang = (Math.PI * 2 / 12) * i; let crackLen = Math.min(w, h) * shatterProg * 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang)*crackLen, Math.sin(ang)*crackLen); ctx.stroke(); }
            if (shatterProg > 0.5) { let whiteFlash = (shatterProg - 0.5) * 2; ctx.fillStyle = `rgba(255, 255, 255, ${whiteFlash})`; ctx.fillRect(-w*2, -h*2, w*4, h*4); }
            ctx.restore();
        }
    }
    ctx.restore(); let vigGrad = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.8); vigGrad.addColorStop(0, "rgba(0,0,0,0)"); vigGrad.addColorStop(1, "rgba(0,0,0,0.95)"); ctx.fillStyle = vigGrad; ctx.fillRect(0, 0, w, h); drawCRTScanlines(); ctx.restore(); window.ctx = originalCtx;
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
    window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; 
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

if (window._hookedDrawForRecorder && window.draw && window._originalDrawBeforeHook) { window.draw = window._originalDrawBeforeHook; }
if (!window._hookedDrawForRecorder) { window._hookedDrawForRecorder = true; window._originalDrawBeforeHook = window.draw;  window.draw = function() { if (window._originalDrawBeforeHook) window._originalDrawBeforeHook.apply(this, arguments); }; }

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    window.introParams = window.generateIntroParams();
    window.recordedChunksV = []; 
    window._scrollingChats = [];
    window._liveAlerts = []; window._lastAlertTime = Date.now(); 
    window._baitTriggered = false; window._baitType = -1; 
    window._gamePhaseStarted = false; window._gamePhaseEnded = false; window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

    let videoStreamV = window.recordCanvasV.captureStream(60); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charAvatar = "https://i.imgur.com/q3813rX.png";
    let charName = window.getRealCharName(window.p1, "PLAYER");
    window.StoryModeAI.init();
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);

    window.mediaRecorderV.onstop = () => {
        setTimeout(() => {
            if (window.recordedChunksV.length === 0) return;
            let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
            window.savedVideos.unshift({ 
                id: Date.now(), urlV: URL.createObjectURL(blobV), ext: window.currentVideoExt, 
                timestamp: new Date().toLocaleTimeString('en-US'), heroName: charName, heroAvatar: charAvatar, viralTitle: window.StoryModeAI.viralTitle
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 800); 
    };

    window.mediaRecorderV.start(); window.isRecording = true; window.introStartTime = Date.now(); 
    window._sfxCuts = [false, false, false, false, false]; window._lastCaptureTime = Date.now(); 
    window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
};

// ================= THE MAIN RENDER LOOP =================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 16) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    if (elapsed >= window.introDuration && !window._gamePhaseStarted) { window._gamePhaseStarted = true; window.gamePhaseStartTime = elapsed; }
    if (isOutroActive && !window._gamePhaseEnded) { window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed; }

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

    if (renderNormalV && elapsed > 4000 && !window._baitTriggered && Math.random() < 0.008) { window._baitTriggered = true; window._baitType = Math.floor(Math.random() * 2); window._baitStartTime = Date.now(); }

    if (renderNormalV) {
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        let gameY = (1920 - splitGameHeight) / 2; // CHÍNH GIỮA MÀN HÌNH
        ctxV.imageSmoothingEnabled = false;

        // ================= LỚP 1: NỀN CINEMATIC SANG TRỌNG =================
        let bgGrad = ctxV.createRadialGradient(540, 960, 0, 540, 960, 1500);
        bgGrad.addColorStop(0, "#1e1b4b"); // Màu tím than sáng ở giữa
        bgGrad.addColorStop(1, "#020617"); // Đen sẫm ở viền ngoài
        ctxV.fillStyle = bgGrad; ctxV.fillRect(0, 0, 1080, 1920); 

        // Ambient Dust (Hạt bụi sáng điện ảnh bay lơ lửng, chậm rãi)
        ctxV.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < window.ambientDust.length; i++) {
            let p = window.ambientDust[i];
            p.y -= p.v; p.x += Math.sin(now * 0.001 + p.y) * 0.5;
            ctxV.beginPath(); ctxV.arc(p.x, p.y, p.s, 0, Math.PI*2); ctxV.fill();
            if (p.y < -10) p.y = 1930;
        }

        // ================= LỚP 2: UI LIVESTREAM (GÓC TRÊN) =================
        ctxV.save();
        // Nút LIVE nhấp nháy
        if (Math.floor(now / 500) % 2 === 0) {
            ctxV.fillStyle = "#ef4444"; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(40, 60, 110, 45, 10); ctxV.fill(); } else { ctxV.fillRect(40, 60, 110, 45); }
            ctxV.fillStyle = "#fff"; ctxV.font = "bold 24px Arial"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.fillText("LIVE", 95, 84);
        }
        // Mắt xem
        if (Math.random() < 0.05) window._fakeViewers += (Math.floor(Math.random() * 21) - 10);
        ctxV.fillStyle = "rgba(0, 0, 0, 0.5)";
        if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(165, 60, 140, 45, 10); ctxV.fill(); } else { ctxV.fillRect(165, 60, 140, 45); }
        ctxV.fillStyle = "#fff"; ctxV.font = "bold 24px Arial"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
        ctxV.fillText("👁️ " + window._fakeViewers, 235, 84);
        ctxV.restore();

        // ================= LỚP 3: SCROLLING CHAT (CĂN TRÁI CHUẨN MỰC) =================
        let chatNow = Date.now();
        if (chatNow - window._lastChatUpdate > window._nextChatDelay) { 
            window._lastChatUpdate = chatNow; 
            window._nextChatDelay = 400 + Math.random() * 600; 
            window.spawnScrollingChat(ctxV); 
        }

        ctxV.textAlign = "left"; 
        ctxV.textBaseline = "middle";
        
        for (let i = window._scrollingChats.length - 1; i >= 0; i--) { 
            let c = window._scrollingChats[i]; 
            c.y -= c.speed; 
            
            // Xóa ngay nếu bay khỏi màn hình
            if (c.y < -100) { window._scrollingChats.splice(i, 1); continue; }

            // Hiệu ứng mờ dần ở hai đầu trên và dưới để chat không bị cắt cụt phũ phàng
            let alpha = 1;
            if (c.y > 1750) alpha = Math.max(0, (1920 - c.y) / 170); // Fade in từ đáy
            if (c.y < gameY) alpha = Math.max(0, (c.y + 100) / (gameY + 100)); // Fade out khi trôi lên qua game

            ctxV.save();
            ctxV.globalAlpha = alpha;
            ctxV.font = "bold 28px 'Segoe UI', Arial, sans-serif";

            let totalWidth = c.nameWidth + c.msgWidth + 50;
            let chatX = 40; // Gắn cứng lề trái

            // Vẽ Glassmorphism Bubble
            ctxV.fillStyle = "rgba(15, 23, 42, 0.65)"; // Màu nền slate đậm mờ
            ctxV.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Viền kính mỏng
            ctxV.lineWidth = 1.5;
            if(ctxV.roundRect) { 
                ctxV.beginPath(); 
                ctxV.roundRect(chatX, c.y - 30, totalWidth, 60, 30); 
                ctxV.fill(); ctxV.stroke();
            } else { 
                ctxV.fillRect(chatX, c.y - 30, totalWidth, 60); 
            }
            
            // Vẽ Text
            ctxV.fillStyle = c.color; 
            ctxV.fillText(c.name + ":", chatX + 20, c.y); 
            ctxV.fillStyle = "#ffffff"; 
            ctxV.fillText(" " + c.msg, chatX + 20 + c.nameWidth, c.y); 
            ctxV.restore();
        }

        // ================= LỚP 4: MÀN HÌNH GAME VÀ VIỀN SANG TRỌNG =================
        // Vẽ Shadow / Glow nền phía sau game
        ctxV.shadowColor = "#3b82f6"; ctxV.shadowBlur = 40;
        ctxV.fillStyle = "#000"; 
        ctxV.fillRect(shakeX | 0, (gameY + shakeY) | 0, 1080, splitGameHeight);
        ctxV.shadowBlur = 0;
        
        // Vẽ màn hình Game thực tế
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, (gameY + shakeY) | 0, 1080, splitGameHeight); 
        
        // Vẽ viền kính (Border) siêu mỏng bao quanh Game để đóng khung đẹp hơn
        ctxV.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctxV.lineWidth = 2;
        ctxV.strokeRect(shakeX | 0, (gameY + shakeY) | 0, 1080, splitGameHeight);

        // Hiệu ứng Glitch khi bass to
        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; ctxV.fillStyle = '#ff0000'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, gameY + (shakeY|0), 1080 + glitchStr, splitGameHeight);
            ctxV.fillStyle = '#00ffff'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, gameY + (shakeY|0), 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        // ================= LỚP 5: KINETIC SUBTITLES (CHỮ NẢY MRBEAST) =================
        if (!isOutroActive) {
            drawBaitSạn(ctxV, 1080, splitGameHeight, gameY); // Pop-up Troll
            
            if (audioPeak > 0.75 && Date.now() - window._currentHype.time > 2000) {
                window._currentHype.word = window._hypeWords[Math.floor(Math.random() * window._hypeWords.length)]; window._currentHype.time = Date.now();
            }
            let hypeElapsed = Date.now() - window._currentHype.time;
            if (hypeElapsed < 1500 && window._currentHype.word) {
                ctxV.save(); let hypeScale = 1 + Math.sin(hypeElapsed / 100) * 0.2; let hypeAlpha = hypeElapsed > 1000 ? 1 - ((hypeElapsed - 1000)/500) : 1;
                ctxV.globalAlpha = hypeAlpha; ctxV.translate(540, gameY + splitGameHeight / 2); ctxV.scale(hypeScale, hypeScale); ctxV.rotate((Math.random() - 0.5) * 0.05);
                ctxV.font = "900 80px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.lineWidth = 14; ctxV.strokeStyle = "#000"; ctxV.strokeText(window._currentHype.word, 0, 0); ctxV.fillStyle = "#ffeb3b"; ctxV.fillText(window._currentHype.word, 0, 0); ctxV.fillStyle = "#fff"; ctxV.fillText(window._currentHype.word, -4, -4); ctxV.restore();
            }
        }

        // ================= LỚP 6: OUTRO ANIME SLASH =================
        if (isOutroActive) {
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

            if (window.matchEndTimer > 230 && window.bakedThumbV) {
                let loopProg = Math.min(1, (window.matchEndTimer - 230) / 120); 
                let easeProg = Math.pow(loopProg, 3); 
                ctxV.save(); let slashWidth = 5 + (easeProg * 2500); 
                ctxV.beginPath(); ctxV.moveTo(-500, 1920 + slashWidth); ctxV.lineTo(1580, 0 + slashWidth); ctxV.lineTo(1580, 0 - slashWidth); ctxV.lineTo(-500, 1920 - slashWidth); ctxV.closePath(); ctxV.clip(); 
                let thumbScale = 1.3 - (easeProg * 0.3); ctxV.translate(540, 960); ctxV.scale(thumbScale, thumbScale); ctxV.translate(-540, -960); ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); ctxV.restore();
                if (loopProg > 0 && loopProg < 0.95) {
                    ctxV.save(); ctxV.globalCompositeOperation = "screen"; ctxV.shadowColor = (Math.random() > 0.5) ? "#00f3ff" : "#ff0050"; ctxV.shadowBlur = 40 + Math.random() * 20; ctxV.lineWidth = 15 + Math.random() * 25; ctxV.strokeStyle = "rgba(255, 255, 255, 0.95)"; 
                    ctxV.beginPath(); ctxV.moveTo(-500, 1920 - slashWidth); ctxV.lineTo(1580, 0 - slashWidth); ctxV.stroke(); 
                    ctxV.beginPath(); ctxV.moveTo(-500, 1920 + slashWidth); ctxV.lineTo(1580, 0 + slashWidth); ctxV.stroke(); 
                    if (loopProg > 0.75 && loopProg < 0.90) { ctxV.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`; ctxV.fillRect(0, 0, 1080, 1920); } ctxV.restore();
                }
                if (loopProg >= 0.98) { ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); }
            }
        }
    }
    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;

window.downloadRawVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId); if (!vid) return;
    let a = document.createElement("a"); a.href = vid.urlV; a.download = "[CINEMA_TIKTOK]_" + vid.viralTitle.replace(/[^a-z0-9]/gi, '_') + "." + vid.ext; a.click();
};

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 99999; position: relative;"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center;">🎬 STUDIO ARCHIVE</h3>`; return; }
    let html = `<h3 style="margin: 0 0 20px 0; color: #00f3ff; text-align: center; font-size: 35px;">🎬 STUDIO ARCHIVE</h3><div style="display: flex; flex-direction: column; gap: 15px; max-height: 500px; overflow-y: auto;">`;
    window.savedVideos.forEach((vid) => { 
        html += `<div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155;">
                    <div style="width: 140px; height: 249px; border-radius: 8px; overflow: hidden;"><img src="${vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div><span style="font-weight: 900; color: #ffeb3b; font-size: 20px;">${vid.viralTitle}</span><br><span style="color:#ccc; font-size:14px;">🕒 ${vid.timestamp}</span></div>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button onclick="window.downloadRawVideo(${vid.id})" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; padding: 8px 15px; border-radius: 5px; font-weight: 900; border: none; cursor:pointer; flex:1;">🚀 Tải Video Ngay</button>
                        </div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};
