// ==========================================
// RECORDER.JS - VERTICAL 9:16 (CENTERED GAME & SCROLLING CHAT)
// - Màn hình 1080x1920 (Dọc)
// - Giữ nguyên Intro & Outro cực ngầu.
// - Game đặt giữa màn hình. Chat chạy từ dưới lên, chui ra sau lưng game.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

window.introStartTime = 0; window.introDuration = 3200; window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._recordLoopId = null; 
window._lastCaptureTime = 0;

// TIMING CHO AI
window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

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

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return { themeP1: r(THEMES), themeP2: r(THEMES), lore: { ...r(LORES) }, badge: "🏆 RANKED DUEL" };
};

// ================= HỆ THỐNG CHAT TRÔI (SCROLLING CHAT) =================
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
window._lastChatUpdate = 0; window._nextChatDelay = 500; // Ra chat liên tục

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST); let msg = r(TOXIC_MSGS); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(TOXIC_MSGS); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 15) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, x: 0, y: 0, speed: 0, nameWidth: 0, msgWidth: 0 };
};

window.spawnScrollingChat = function(ctxV) {
    let chat = window.generateLiveChatEvent();
    ctxV.font = "bold 26px Arial";
    chat.nameWidth = ctxV.measureText(chat.name + ": ").width;
    chat.msgWidth = ctxV.measureText(chat.msg).width;
    
    // Vị trí ngang ngẫu nhiên
    chat.x = 30 + Math.random() * (1080 - (chat.nameWidth + chat.msgWidth) - 100);
    // Bắt đầu từ dưới đáy màn hình
    chat.y = 1950; 
    // Tốc độ bay lên (pixel/frame)
    chat.speed = 3 + Math.random() * 3.5; 
    
    window._scrollingChats.push(chat);
};

// ================= SETUP AUDIO & AI =================
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    viralTitle: "",
    init: function() { this.viralTitle = "EPIC FIGHT #gaming"; }, stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ================= THUMBNAIL INTRO =================
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
        
        ctxV.save(); let grad = ctxV.createRadialGradient(540, 960, 500, 540, 960, 1920); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
        ctxV.fillStyle = grad; ctxV.fillRect(0,0,1080,1920); ctxV.translate(540, 300); ctxV.rotate(-0.06); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `italic 900 85px 'Arial Black', Impact`; 
        let lines = ["EPIC", "FIGHT"]; 
        lines.forEach((line, index) => { let yOffset = index * 95; ctxV.lineWidth = 25; ctxV.strokeStyle = "#000"; for(let d=15; d>0; d--) { ctxV.strokeText(line, d, yOffset + d); ctxV.fillStyle = prm.themeP1.c1; ctxV.fillText(line, d, yOffset + d); } ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = prm.themeP1.aura; ctxV.fillText(line, 0, yOffset); ctxV.fillStyle = "#ffffff"; ctxV.fillText(line, -3, yOffset - 3); }); ctxV.restore();
    } catch (e) {}
};

// ================= HÀM VẼ INTRO 3D =================
window.drawProceduralIntro = function(ctx, w, h, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let prm = window.introParams;

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

    const drawFighterArtistic = (charObj, cx, cy, forcedState, isFacingRight, theme) => {
        if(!charObj) return; ctx.save(); ctx.translate(cx, cy); 
        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.2, isFacingRight: true, state: forcedState});
        ctx.filter = "contrast(115%) saturate(120%) drop-shadow(0 20px 20px rgba(0,0,0,0.8))";
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
    };

    ctx.save();
    let cutShake = 0; let panX = 0; let currentZoom = 2.0; 

    if (act === 0) { currentZoom = 2.5 - localProg * 0.3; panX = 40; cutShake = (Math.random()-0.5)*10; } 
    else if (act === 1) { currentZoom = 2.5; panX = 60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 2) { currentZoom = 2.2; panX = -60; cutShake = (Math.random()-0.5)*5; } 
    else if (act === 3) { currentZoom = 1.2 + localProg * 0.5; cutShake = (Math.random() - 0.5) * 50; }
    
    ctx.translate(w/2 + cutShake + panX, h/2 + cutShake);
    ctx.scale(currentZoom, currentZoom); ctx.translate(0, 100); 

    let bgTheme = (act === 0 || act === 1) ? prm.themeP2 : prm.themeP1;
    let bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    bgGrad.addColorStop(0, bgTheme.c1); bgGrad.addColorStop(1, bgTheme.c2);
    ctx.fillStyle = bgGrad; ctx.fillRect(-w, -h, w*2, h*2);

    if (act === 0) { drawFighterArtistic(window.p1, 0, 100, 'idle', true, prm.themeP1); } 
    else if (act === 1) { drawFighterArtistic(window.p1, 0, 100, 'cast', true, prm.themeP1); }
    else if (act === 2) { drawFighterArtistic(e1, 0, 100, 'cast', false, prm.themeP2); } 
    else if (act === 3) {
        let easeIn = Math.pow(localProg, 3); let pushP1 = -500 + (easeIn * 400); let pushP2 = 500 - (easeIn * 400);
        drawFighterArtistic(e1, pushP2, 100, 'attack', false, prm.themeP2);
        drawFighterArtistic(window.p1, pushP1, 100, 'attack', true, prm.themeP1);

        ctx.save(); ctx.translate(0, -150); let vsScale = 3.5 - easeIn*1.5; ctx.scale(vsScale, vsScale);
        ctx.font = "900 120px 'Arial Black', sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.lineWidth = 15; ctx.strokeStyle = "#000"; ctx.strokeText("VS", 0, 0); ctx.fillStyle = "#ffeb3b"; ctx.fillText("VS", 0, 0); ctx.fillStyle = "#fff"; ctx.fillText("VS", -4, -4); ctx.restore();

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
    drawCRTScanlines(); ctx.restore(); window.ctx = originalCtx;
};

// ================= AUDIO INTERCEPTOR =================
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
}

// ================= KHỞI TẠO RECORDER =================
window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasV = document.createElement("canvas");
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; 
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    window.introParams = window.generateIntroParams();
    window.recordedChunksV = []; 
    window._scrollingChats = [];
    
    window._gamePhaseStarted = false; window._gamePhaseEnded = false;
    window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

    let videoStreamV = window.recordCanvasV.captureStream(60); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; 
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
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
                timestamp: new Date().toLocaleTimeString('en-US'),
                heroName: charName, heroAvatar: charAvatar, viralTitle: window.StoryModeAI.viralTitle
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 500); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._sfxCuts = [false, false, false, false, false]; 
    window._lastCaptureTime = Date.now(); 
    window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
};


// ================= VÒNG LẶP RENDER CHÍNH (QUAN TRỌNG) =================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 16) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    // Quản lý Timing
    if (elapsed >= window.introDuration && !window._gamePhaseStarted) { window._gamePhaseStarted = true; window.gamePhaseStartTime = elapsed; }
    if (isOutroActive && !window._gamePhaseEnded) { window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed; }

    // RENDER INTRO
    if (elapsed < 150) {
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); renderNormalV = false; 
    } else if (elapsed < window.introDuration) {
        let introProgress = (elapsed - 150) / (window.introDuration - 150); 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress); renderNormalV = false; 
    }

    // ================= RENDER LÚC CHƠI GAME =================
    if (renderNormalV) {
        
        // ----------------------------------------------------
        // LỚP 1: BACKGROUND (NỀN DƯỚI CÙNG)
        // ----------------------------------------------------
        let bgGrad = ctxV.createLinearGradient(0, 0, 0, 1920);
        bgGrad.addColorStop(0, "#0b001a");
        bgGrad.addColorStop(1, "#200030");
        ctxV.fillStyle = bgGrad;
        ctxV.fillRect(0, 0, 1080, 1920);

        // ----------------------------------------------------
        // LỚP 2: COMMENT TRÔI (NẰM GIỮA, BỊ GAME CHE KHUẤT)
        // ----------------------------------------------------
        let chatNow = Date.now();
        if (chatNow - window._lastChatUpdate > window._nextChatDelay) { 
            window._lastChatUpdate = chatNow; 
            window._nextChatDelay = 400 + Math.random() * 800; // Random thời gian đẻ comment
            window.spawnScrollingChat(ctxV); 
        }

        ctxV.font = "bold 26px Arial"; 
        ctxV.textAlign = "left"; 
        ctxV.textBaseline = "middle";

        for (let i = window._scrollingChats.length - 1; i >= 0; i--) { 
            let c = window._scrollingChats[i];
            c.y -= c.speed; // Di chuyển lên trên

            let totalWidth = c.nameWidth + c.msgWidth + 40;
            
            // Vẽ bọt khí (Background cho comment)
            ctxV.fillStyle = "rgba(0,0,0,0.4)";
            if(ctxV.roundRect) {
                ctxV.beginPath();
                ctxV.roundRect(c.x - 15, c.y - 25, totalWidth, 50, 25);
                ctxV.fill();
            } else {
                ctxV.fillRect(c.x - 15, c.y - 25, totalWidth, 50);
            }

            // Vẽ chữ
            ctxV.fillStyle = c.color; 
            ctxV.fillText(c.name + ":", c.x, c.y); 
            ctxV.fillStyle = "#ffffff"; 
            ctxV.fillText(" " + c.msg, c.x + c.nameWidth, c.y); 
            
            // Xóa comment khi bay khỏi màn hình
            if (c.y < -100) window._scrollingChats.splice(i, 1);
        }

        // ----------------------------------------------------
        // LỚP 3: MÀN HÌNH GAME (TRÊN CÙNG, ĐẶT Ở GIỮA)
        // ----------------------------------------------------
        ctxV.imageSmoothingEnabled = false;
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        
        // TÍNH TOÁN ĐỂ ĐẶT GAME VÀO CHÍNH GIỮA MÀN HÌNH DỌC
        let gameY = (1920 - splitGameHeight) / 2;

        // Thêm viền phát sáng (Shadow) cho game nổi bật so với comment
        ctxV.shadowColor = "#00f3ff";
        ctxV.shadowBlur = 35;
        ctxV.fillStyle = "#000";
        ctxV.fillRect(0, gameY, 1080, splitGameHeight);
        ctxV.shadowBlur = 0;

        // Vẽ màn hình game
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, gameY, 1080, splitGameHeight); 

        // ----------------------------------------------------
        // LỚP 4 (OUTRO): RENDER OUTRO NẾU GAME OVER
        // ----------------------------------------------------
        if (isOutroActive) {
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            let oGrad = ctxV.createRadialGradient(540, 960, 0, 540, 960, 1920); oGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); oGrad.addColorStop(1, "rgba(0, 0, 0, 1)"); ctxV.fillStyle = oGrad; ctxV.fillRect(0, 0, 1080, 1920);
            let cx = 540; let cy = 960; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; let floatY = (Math.sin(window.matchEndTimer * 0.05) * 10) | 0;
            
            ctxV.fillStyle = "#ffffff"; ctxV.font = `900 65px 'Arial Black', sans-serif`; ctxV.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500 + floatY); ctxV.fillStyle = "#ff0050"; ctxV.font = `900 45px 'Montserrat', sans-serif`; ctxV.fillText("👇 MORE COMBOS BELOW 👇", cx, cy - 430 + floatY);
            let gridY = cy - 350 + floatY; ctxV.lineWidth = 4;
            for(let i=-1; i<=1; i++) {
                let rx = cx + i*340 - 150; ctxV.fillStyle = "#111827"; ctxV.strokeStyle = (i===0) ? "#00f3ff" : "#334155";
                ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(rx, gridY, 300, 450, 20); else ctxV.rect(rx, gridY, 300, 450); ctxV.fill(); ctxV.stroke();
                ctxV.fillStyle = "#ffffff"; ctxV.font = "900 35px Arial Black"; ctxV.textAlign = "left"; let views = (i===-1) ? "1.2M" : (i===0) ? "3.4M" : "800K"; ctxV.fillText(`▶ ${views}`, rx + 20, gridY + 410);
            }
            ctxV.restore();

            // Hiệu ứng chém màn hình hoàn hảo cuối clip
            if (window.matchEndTimer > 230 && window.bakedThumbV) {
                let loopProg = Math.min(1, (window.matchEndTimer - 230) / 120); 
                let easeProg = Math.pow(loopProg, 3); 
                ctxV.save();
                let slashWidth = 5 + (easeProg * 2500); 
                ctxV.beginPath();
                ctxV.moveTo(-500, 1920 + slashWidth); ctxV.lineTo(1580, 0 + slashWidth); ctxV.lineTo(1580, 0 - slashWidth); ctxV.lineTo(-500, 1920 - slashWidth); ctxV.closePath(); ctxV.clip(); 
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

// ================= GIAO DIỆN TẢI VIDEO =================
// Đã xóa hàm ghép Facecam, tải thẳng video RAW cho tốc độ tên lửa!
window.downloadRawVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.href = vid.urlV;
    a.download = "[CLEAN_TIKTOK]_" + vid.viralTitle.replace(/[^a-z0-9]/gi, '_') + "." + vid.ext;
    a.click();
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
