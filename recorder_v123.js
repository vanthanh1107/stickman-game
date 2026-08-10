// ==========================================
// RECORDER.JS - V70.0 HOLLYWOOD SAKUGA (THE DIRECTOR'S CUT)
// ĐÃ FIX: Intro 3.5 giây chuẩn điện ảnh.
// CẬP NHẬT MỚI: Tên nhân vật 3D trên đầu, Lens Flare ánh sáng xé ngang, Sương mù khí chất.
// CẢM XÚC: Trailer Game Hạng AAA, Nghệ thuật thị giác đỉnh cao, không video nào trùng.
// NGÁCH VIRAL: "PSYCHOLOGICAL WARFARE & SCHIZO MOVEMENT" 
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// QUẢN LÝ INTRO
window.introStartTime = 0; 
window.introDuration = 3500; // 3.5 giây kể chuyện Cinematic
window._sfxCuts = [false, false, false, false, false]; 
window.introParams = null; 

window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 

// ====================================================================
// PROCEDURAL ENGINE (ĐẠO DIỄN LORE & STORYTELLING)
// ====================================================================
const THEMES = [
    { id: "fire", c1: "#4a0000", c2: "#0a0000", aura: "#ff003c" }, { id: "ice", c1: "#002b4a", c2: "#000a12", aura: "#00f3ff" },
    { id: "toxic", c1: "#0a3a00", c2: "#001200", aura: "#39ff14" }, { id: "void", c1: "#2a004a", c2: "#080012", aura: "#b100ff" },
    { id: "gold", c1: "#4a3500", c2: "#120a00", aura: "#ffb800" }, { id: "blood", c1: "#3a0000", c2: "#000000", aura: "#ff0000" }
];

const LORES = [
    { title: "THE BETRAYAL", p2Sub: "You were my greatest student...", p1Sub: "And now, I am your end." },
    { title: "LAST STAND", p2Sub: "Give up. You have nothing left.", p1Sub: "I still have my pride." },
    { title: "THE REMATCH", p2Sub: "Back for another beating?", p1Sub: "This time, I don't hold back." },
    { title: "NEW ERA", p2Sub: "Know your place, kid.", p1Sub: "Your era ends tonight, old man." },
    { title: "THE ANOMALY", p2Sub: "What are you?!", p1Sub: "I am the glitch in your system." },
    { title: "VENGEANCE", p2Sub: "I don't even remember you.", p1Sub: "You will. Very soon." }
];

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let t1 = r(THEMES); let t2 = r(THEMES.filter(t => t.id !== t1.id));
    let lore = r(LORES);
    
    let cuts = [];
    const states = ['idle', 'cast', 'run'];
    // Cut 1: Boss nói (Góc rộng, Slow-mo)
    cuts.push({ focus: 'p2', state: 'idle', camX: 0, camY: 50, zoom: 3.5, rot: -0.02, fx: 'cinematic', txt: lore.p2Sub });
    // Cut 2: Player đáp (Cận cảnh, Slow-mo)
    cuts.push({ focus: 'p1', state: 'cast', camX: 0, camY: 100, zoom: 4.5, rot: 0.05, fx: 'cinematic', txt: lore.p1Sub });
    // Cut 3: Silhouette Tích Tụ
    cuts.push({ focus: r(['p1', 'p2']), state: 'attack', camX: 0, camY: 50, zoom: 5.0, rot: -0.08, fx: 'silhouette', txt: "AWAKENING." });
    // Cut 4: Lao vào (The Clash)
    cuts.push({ focus: 'clash', state: 'attack', camX: 0, camY: 100, zoom: 3.2, rot: 0, fx: 'impact', txt: "" });

    return { themeP1: t1, themeP2: t2, lore: lore, montageCuts: cuts, warningText: r(["⚠️ " + lore.title + " ⚠️", "🚨 " + lore.title + " 🚨"]) };
};

// ====================================================================
// CHAT & CELEBS
// ====================================================================
window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "Ninja 🥷", color: "#1e90ff" }, { name: "DrDisrespect 🕶️", color: "#ff0000" },
    { name: "MrBeast 💰", color: "#2ecc71" }, { name: "Faker_T1 🐐", color: "#ff0055" }
];
window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    const tmpls = [() => `Bro is plotting something... 💀`, () => `THE LORE GOES CRAZY 😭`, () => `Bro has anime protagonist aura ☢️`, () => `RIP BOZO 📉`, () => `Absolute cinema 🍿🎬`];
    return { name: celeb.name, color: celeb.color, msg: r(tmpls)(), lines: null, nameWidth: 0 };
};
window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; ctx.font = "bold 34px Arial"; chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 960 - 60 - chatObj.nameWidth - 10; let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { let testLine = currentLine + words[n] + " "; if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { lines.push(currentLine.trim()); currentLine = words[n] + " "; } else { currentLine = testLine; } }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

// ====================================================================
window.bannerText1 = ""; window.bannerText2 = "";
window.retentionParticles = Array.from({length: 40}, () => ({ active: false, x: 0, y: 0, s: 0, v: 0, h: 0, age: 0 }));
window.retentionEmojis = Array.from({length: 15}, () => ({ active: false, x: 0, y: 0, v: 0, e: "", r: 0, age: 0 }));

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    scriptLines: [], viralTitle: "", _usedTitles: new Set(),
    generateViralStickmanTitle: function(hero, enemy) {
        const adjs = ["ILLEGAL", "SCHIZO", "BIBLICALLY ACCURATE", "UNETHICAL", "FORBIDDEN", "DIABOLICAL", "5D CHESS", "BRAINROT"];
        const acts = ["PSYCHOLOGICAL WARFARE", "LOBOTOMY COMBO", "SCHIZO MOVEMENT", "GASLIGHTING", "TAS MOVEMENT"];
        const subs = ["PAID ACTOR", "INNOCENT TIMMY", "DEV", "AI BOSS", "VICTIM"];
        const reas = ["😭💀", "☢️", "🧠📉", "👁️👄👁️", "🚑", "🤡", "🥶"];
        const tmpls = [`BRO INITIATED [ACTION] ON A [SUBJECT] [REACTION]`, `USING [ADJ] [ACTION] IS BANNED IN 14 COUNTRIES [REACTION]`, `GASLIGHTING THE [SUBJECT] INTO RAGE QUITTING [REACTION]`, `ABSOLUTE CINEMA: 0 IQ [SUBJECT] VS [ADJ] AURA [REACTION]`];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let rawTitle = r(tmpls).replace(/\[ADJ\]/g, () => r(adjs)).replace(/\[ACTION\]/g, () => r(acts)).replace(/\[SUBJECT\]/g, () => r(subs)).replace(/\[REACTION\]/g, () => r(reas));
        let selectedTags = ["#schizomovement", "#psychologicalwarfare", "#villainarc", "#gaming", "#cinema"].sort(() => 0.5 - Math.random()).slice(0, 4).join(" ");
        return `${rawTitle} ${selectedTags}`;
    },
    init: function(hero, enemy) { this.viralTitle = this.generateViralStickmanTitle(hero, enemy); }, stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawLiveBadge(ctx, x, y, audioPeak) {
    let pulse = 1 + (audioPeak * 0.1); ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 15; ctx.fillStyle = "#ff0000";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-70, -25, 140, 50, 15); else ctx.fillRect(-70, -25, 140, 50); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.font = "900 24px 'Arial Black'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🔴 LIVE", 0, 2); ctx.restore();
}

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
        ctxV.translate(1080*0.7, 1920*0.6); ctxV.rotate((Math.random()-0.5)*0.5); ctxV.font = "italic 900 80px Impact"; ctxV.textAlign = "center"; ctxV.lineWidth = 18; ctxV.strokeStyle = "#000"; ctxV.strokeText(prm.lore.title, 0,0);
        ctxV.fillStyle = prm.themeP2.aura; ctxV.fillText(prm.lore.title, 0,0); ctxV.fillStyle = "#fff"; ctxV.fillText(prm.lore.title, -4,-4); ctxV.restore();
        
        ctxV.save(); let grad = ctxV.createRadialGradient(540, 960, 500, 540, 960, 1920); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
        ctxV.fillStyle = grad; ctxV.fillRect(0,0,1080,1920); ctxV.translate(540, 300); ctxV.rotate(-0.06); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `italic 900 85px 'Arial Black', Impact`; 
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(); let words = shortTitle.split(" "); let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
        lines.forEach((line, index) => { let yOffset = index * 95; ctxV.lineWidth = 25; ctxV.strokeStyle = "#000"; for(let d=15; d>0; d--) { ctxV.strokeText(line, d, yOffset + d); ctxV.fillStyle = prm.themeP1.c1; ctxV.fillText(line, d, yOffset + d); } ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = prm.themeP1.aura; ctxV.fillText(line, 0, yOffset); ctxV.fillStyle = "#ffffff"; ctxV.fillText(line, -3, yOffset - 3); }); ctxV.restore();
    } catch (e) { console.error("Lỗi Bake Thumbnail:", e); }
};

// ====================================================================
// ĐẠO DIỄN: CINEMATIC HOLLYWOOD SAKUGA INTRO
// ====================================================================
window.drawProceduralIntro = function(ctx, w, h, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let prm = window.introParams;

    // 1. CẢNH BÁO MỞ ĐẦU (0.0 -> 0.05)
    if (progress < 0.05) {
        ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, w, h);
        let shake = (Math.random() - 0.5) * 60; ctx.translate(w/2 + shake, h/2 + shake);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = prm.themeP2.aura; ctx.font = "italic 900 120px Impact"; ctx.fillText(prm.warningText, 0, -100);
        ctx.fillStyle = "#fff"; ctx.font = "900 70px 'Arial Black'"; ctx.fillText(prm.lore.title, 0, 50);
        for(let i=0; i<20; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? prm.themeP1.aura : prm.themeP2.aura;
            ctx.fillRect(-w, (Math.random()-0.5)*h, w*2, 10 + Math.random()*30);
        }
        ctx.restore(); window.ctx = originalCtx; return;
    }

    // 2. CHIA TIMELINE CUTS
    let cutIndex = 0; let cutProg = 0;
    if (progress < 0.40) { cutIndex = 0; cutProg = (progress - 0.05) / 0.35; }
    else if (progress < 0.70) { cutIndex = 1; cutProg = (progress - 0.40) / 0.30; }
    else if (progress < 0.85) { cutIndex = 2; cutProg = (progress - 0.70) / 0.15; }
    else { cutIndex = 3; cutProg = (progress - 0.85) / 0.15; }

    let cut = prm.montageCuts[cutIndex];

    if (!window._sfxCuts[cutIndex]) {
        if (cutIndex < 2 && typeof window.playSound === 'function') window.playSound(100 + Math.random()*100, 'sine', 0.1, 0.8);
        if (cutIndex === 2 && typeof window.playSound === 'function') window.playSound(400, 'square', 0.2, 0.4); 
        if (cutIndex === 3 && typeof window.playSound === 'function') window.playSound(100, 'sawtooth', 0.6, 1.0, true); 
        window._sfxCuts[cutIndex] = true;
    }

    // --- SETUP TỌA ĐỘ CAMERA NGHỆ THUẬT ---
    ctx.save();
    let cutShake = 0;
    if (cutIndex === 2) cutShake = (Math.random() - 0.5) * 40 * cutProg; 
    if (cutIndex === 3 && cutProg < 0.2) cutShake = (Math.random() - 0.5) * 100; 

    let panX = cutIndex < 2 ? (cutProg * 100) - 50 : 0; 
    ctx.translate(w/2 + cutShake + panX, h/2 + cutShake);
    ctx.rotate(cut.rot);
    
    let currentZoom = cut.zoom + (cutProg * 0.15); 
    if (cutIndex === 3) currentZoom = cut.zoom + (cutProg * 2); 
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(cut.camX, cut.camY); 

    // VẼ NỀN HOÀNH TRÁNG
    let bgTheme = cut.focus === 'p1' ? prm.themeP1 : prm.themeP2;
    if (cut.focus === 'clash') bgTheme = prm.themeP1; 
    ctx.fillStyle = bgTheme.c1; ctx.fillRect(-w, -h, w*2, h*2);
    
    // Sương mù / Mây khói điện ảnh ở dưới nền
    ctx.fillStyle = bgTheme.aura; ctx.globalAlpha = 0.2 + (Math.sin(Date.now() * 0.005) * 0.1);
    ctx.beginPath();
    ctx.arc(-100 + panX, 200, 300, 0, Math.PI*2);
    ctx.arc(100 - panX, 250, 400, 0, Math.PI*2);
    ctx.filter = "blur(50px)";
    ctx.fill();
    ctx.filter = "none";
    ctx.globalAlpha = 1.0;

    // Hạt điện ảnh bay bay
    ctx.fillStyle = bgTheme.aura; ctx.globalAlpha = 0.6;
    for(let i=0; i<40; i++) {
        let px = (Math.sin(i*12 + Date.now()*0.001)*w) - w/2;
        let py = (Math.cos(i*24 + Date.now()*0.002)*h) - h/2;
        ctx.beginPath(); ctx.arc(px, py, 1+Math.random()*4, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // HÀM VẼ NHÂN VẬT & NAME TAG 3D
    const drawFighterArtistic = (charObj, cx, cy, forcedState, isFacingRight, theme, fx, charName, titleStr) => {
        if(!charObj) return; 
        ctx.save(); ctx.translate(cx, cy); 
        
        // VẼ TÊN NHÂN VẬT LƠ LỬNG TRÊN ĐẦU
        if (charName && fx !== 'silhouette') {
            ctx.save();
            ctx.translate(0, -360); // Bay cao lên trên đầu
            // Hiệu ứng thở / nhịp đập cho Name Tag
            let nameScale = 1 + Math.sin(Date.now() * 0.005) * 0.02;
            ctx.scale(nameScale, nameScale);
            
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.font = "italic 900 50px 'Arial Black', Impact";
            
            // Đổ bóng màu Aura
            ctx.shadowColor = theme.aura; ctx.shadowBlur = 25; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.lineWidth = 10; ctx.strokeStyle = "#000";
            
            // Tên chính
            ctx.strokeText(charName, 0, 0); 
            ctx.shadowBlur = 0; // Tắt blur đi để fill cho nét
            ctx.fillStyle = "#fff"; ctx.fillText(charName, 0, 0);
            
            // Danh xưng nhỏ ở dưới
            ctx.font = "900 22px Arial"; ctx.letterSpacing = "4px";
            ctx.fillStyle = theme.aura;
            ctx.fillText(titleStr, 0, 45);
            
            ctx.restore();
        }

        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.5, isFacingRight: true, state: forcedState});
        
        if (fx === 'silhouette') ctx.filter = "brightness(0) drop-shadow(0 0 20px " + theme.aura + ")";
        else if (fx === 'cinematic') ctx.filter = "contrast(125%) saturate(115%) drop-shadow(0 15px 15px rgba(0,0,0,0.5))";

        if (fx !== 'silhouette') {
            ctx.save(); ctx.globalAlpha = 0.4; ctx.shadowBlur = 40; ctx.shadowColor = theme.aura; ctx.scale(1.1, 1.1);
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        }
        
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); 
        ctx.restore();
    };

    // --- RENDER DỰA TRÊN KỊCH BẢN ---
    if (cut.focus === 'p1') {
        drawFighterArtistic(window.p1, 0, 100, cut.state, true, prm.themeP1, cut.fx, prm.p1Name, "✦ AWAKENED ✦");
    } 
    else if (cut.focus === 'p2') {
        drawFighterArtistic(e1, 0, 100, cut.state, false, prm.themeP2, cut.fx, prm.p2Name, "✦ THE BOSS ✦");
    } 
    else { // Clash
        let easeIn = Math.pow(cutProg, 3);
        let pushP1 = -300 + (easeIn * 250); 
        let pushP2 = 300 - (easeIn * 250);
        drawFighterArtistic(e1, pushP2, 150, 'attack', false, prm.themeP2, cut.fx, null, "");
        drawFighterArtistic(window.p1, pushP1, 150, 'attack', true, prm.themeP1, cut.fx, null, "");

        // TIA SÁNG XÉ NGANG LÚC VA CHẠM (ANAMORPHIC LENS FLARE)
        if (cutIndex === 3) {
            let flareWidth = w * 3 * cutProg;
            let flareHeight = 20 + Math.random() * 40;
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle = prm.themeP1.aura;
            ctx.fillRect(-flareWidth/2, 100 - flareHeight/2, flareWidth, flareHeight);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(-flareWidth/2, 100 - flareHeight/4, flareWidth, flareHeight/2);
            ctx.globalCompositeOperation = "source-over";
        }
    }

    if (cut.fx === 'impact' && cutProg < 0.3) {
        if (Math.floor(cutProg * 100) % 2 === 0) {
            ctx.fillStyle = "#ffffff"; ctx.globalCompositeOperation = "difference"; ctx.fillRect(-w, -h, w*2, h*2); ctx.globalCompositeOperation = "source-over";
        }
    }

    ctx.restore(); // THOÁT KHỎI CAMERA

    // --- CINEMATIC VIGNETTE (Viền mờ góc màn hình để tăng Focus) ---
    let vigGrad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.8);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)"); vigGrad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = vigGrad; ctx.fillRect(0, 0, w, h);

    // --- CINEMATIC LETTERBOX (VIỀN ĐEN TRÊN DƯỚI) ---
    let barHeight = 250; 
    if (cutIndex === 2) barHeight = 250 - (Math.pow(cutProg, 2) * 120); // Từ từ mở rông ra
    if (cutIndex === 3) barHeight = 0; 

    if (barHeight > 0) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, barHeight); 
        ctx.fillRect(0, h - barHeight, w, barHeight); 
    }

    // --- CINEMATIC SUBTITLES (PHỤ ĐỀ NHƯ XEM PHIM) ---
    if (cut.txt && cutIndex < 2) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, cutProg * 3); 
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.font = "bold 45px Arial";
        let subY = h - barHeight + 80; 
        ctx.lineWidth = 6; ctx.strokeStyle = "#000"; ctx.strokeText(`"${cut.txt}"`, w/2, subY);
        ctx.fillStyle = "#f1c40f"; ctx.fillText(`"${cut.txt}"`, w/2, subY);
        ctx.restore();
    }

    // --- SNAPPY TEXT ---
    if (cutIndex === 2 && cut.txt) {
        ctx.save(); ctx.translate(w/2, h/2); 
        let txtScale = 1 + Math.pow(cutProg, 0.5) * 0.5; 
        ctx.scale(txtScale, txtScale);
        ctx.font = "italic 900 130px Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 15; ctx.strokeStyle = "#000"; ctx.strokeText(cut.txt, 0,0);
        ctx.fillStyle = "#fff"; ctx.fillText(cut.txt, 0,0);
        ctx.restore();
    }

    // --- BÙM! CHUYỂN CẢNH KẾT THÚC ---
    if (cutIndex === 3) {
        let flashP = cutProg;
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - flashP})`;
        ctx.fillRect(0,0,w,h);
        ctx.save(); ctx.translate(w/2, h/2); let pop = 1 + (flashP * 8); ctx.scale(pop, pop);
        ctx.font = "italic 900 250px Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 40; ctx.strokeStyle = "#000"; ctx.strokeText("VS", 0,0); ctx.fillStyle = prm.themeP1.aura; ctx.fillText("VS", 0,0); ctx.restore();
    }

    ctx.restore(); window.ctx = originalCtx;
};


// AUDIO & RECORDER CORE (GIỮ NGUYÊN)
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
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    // TẠO ĐẠO DIỄN INTRO (LORE)
    window.introParams = window.generateIntroParams();

    window.recordedChunksV = []; window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    let videoStreamV = window.recordCanvasV.captureStream(0); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 6000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);
    
    // Truyền tên vào Engine Intro
    window.introParams.p1Name = charName;
    window.introParams.p2Name = enemyName;

    window.bannerText1 = window.introParams.warningText;
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window._chatSystemInit = false; window._cachedGradients = {};

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

    if (renderNormalV) {
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        ctxV.imageSmoothingEnabled = false;
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; ctxV.fillStyle = '#ff0000'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.fillStyle = '#00ffff'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

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

            // HUD
            if (!window.hudImages) window.hudImages = {};
            const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
            let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; let p1Hp = 0.5, p2Hp = 0.5; 

            if (window.p1) {
                const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
                p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100); let eHp = 0, eMax = window.totalEnemyMaxHp || 1, eStam = 0;
                let p1Name = "PLAYER", p1Url = "https://i.imgur.com/q3813rX.png";
                if (window.p1) { p1Name = (window.p1.className || window.p1.name || "PLAYER").toUpperCase(); if (window.classStats && window.classStats[window.p1.classId]) { p1Name = (window.classStats[window.p1.classId].className || p1Name).toUpperCase(); p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; } }
                let eName = "ENEMY", p2Url = "https://i.imgur.com/q3813rX.png";
                if (repEnemyObj) { window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100); eName = (repEnemyObj.className || repEnemyObj.name || "ENEMY").toUpperCase(); if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; } }
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
                let pulseText = 1 + Math.sin(Date.now() / 150) * 0.05; ctxV.save(); ctxV.scale(pulseText, pulseText); ctxV.fillStyle = "#ffeb3b"; ctxV.font = "900 22px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "bottom"; ctxV.shadowColor = "#ffeb3b"; ctxV.shadowBlur = 8; ctxV.fillText("👇 COMMENT 'WHO WILL WIN' 👇", 0, -25); ctxV.restore();
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                ctxV.fillStyle = "#ff0055"; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.clip(); } ctxV.fillStyle = "#00f3ff"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36); ctxV.restore();
                ctxV.strokeStyle = "rgba(255,255,255,0.6)"; ctxV.lineWidth = 4; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); } else { ctxV.strokeRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.fillStyle = "#1e293b"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill(); ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke(); ctxV.fillStyle = "#fff"; ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
                ctxV.fillStyle = "#000"; ctxV.font = "900 20px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.fillText(`[1] PLAYER: ${Math.round(p1Pct*100)}%`, -pollWidth/2 + 20, 18); ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}% :BOSS [2]`, pollWidth/2 - 20, 18);
                ctxV.restore();
            }

            if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; window._fakeViewers = 1204512; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent(); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }
            let chatNow = Date.now();
            if (chatNow - window._lastChatUpdate > window._nextChatDelay) { window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; let newChat = window.generateLiveChatEvent(); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); if (window._liveChats.length > 12) window._liveChats.shift(); window._fakeViewers += Math.floor(Math.random() * 3000) - 1000; }
            if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) { window._lastAlertTime = Date.now(); let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫| 🐻| 🎤| 🪨| 🤫| 🤨| 🇺🇸| ⛳| 🍦| 🤣| 😤| 🕺| 🐉| 🦇| 🧤/g, ''); let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} liked the stream!`, `👤 ${randomUser} started following you!`, `🎁 ${randomUser} sent a Rose!`, `🔥 ${randomUser} joined the LIVE!`]; window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); }

            let boxWidth = 960; let boxHeight = 780; let boxX = 540; let boxY = 1450; let chatTopY = boxY - boxHeight/2; let alertStartY = chatTopY - 20; 
            for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
                let al = window._liveAlerts[i]; al.life -= 0.015; al.yOffset += 1.2; ctxV.save(); ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 1.5)); ctxV.font = "bold 24px Arial"; let textW = ctxV.measureText(al.text).width; ctxV.translate(540, alertStartY - al.yOffset); ctxV.fillStyle = "rgba(0, 0, 0, 0.5)"; ctxV.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctxV.lineWidth = 2;
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-textW/2 - 20, 0, textW + 40, 46, 23); ctxV.fill(); ctxV.stroke(); } else { ctxV.fillRect(-textW/2 - 20, 0, textW + 40, 46); } ctxV.fillStyle = "#fff"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 0, 23); ctxV.restore(); if (al.life <= 0) window._liveAlerts.splice(i, 1);
            }

            drawLiveBadge(ctxV, boxX + boxWidth/2 - 70, chatTopY - 35, audioPeak);

            ctxV.save(); ctxV.translate(boxX, boxY); ctxV.fillStyle = "rgba(10, 15, 30, 0.6)"; ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; ctxV.lineWidth = 3;
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); ctxV.fill(); ctxV.stroke();
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.clip(); 
            ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 70); ctxV.fillStyle = "#fff"; ctxV.font = "900 36px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText("💬 TOXIC LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 35); ctxV.font = "900 28px 'Arial'"; ctxV.textAlign = "right"; ctxV.fillText("👥 " + window._fakeViewers.toLocaleString() + " VIEWERS", boxWidth/2 - 30, -boxHeight/2 + 35);

            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 70, boxWidth, boxHeight - 70); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 45; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 34px Arial"; let headerBottomY = -boxHeight/2 + 70; 

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

            if (audioPeak > 0.6) { ctxV.strokeStyle = "rgba(255, 0, 85, 0.6)"; ctxV.lineWidth = 12; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.stroke(); }
            ctxV.restore();
            
        } else {
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
        html += `<div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <div style="position: relative; width: 140px; height: 249px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(0,243,255,0.2);"><img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;"><span style="position: absolute; bottom: 0px; left: 0px; width: 100%; text-align: center; background: rgba(30, 215, 96, 0.95); color: #fff; font-size: 11px; padding: 5px 0px; font-weight: bold; letter-spacing: 1px;">✅ THUMBNAIL</span></div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div><span style="font-weight: 900; color: #ffeb3b; font-size: 20px; text-shadow: 0 0 5px rgba(255,235,59,0.3); display: block; margin-bottom: 8px; line-height: 1.2;">${vid.viralTitle}</span><div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; font-weight: 600;"><img src="${vid.heroAvatar}" style="width: 20px; height: 20px; border-radius: 50%;"> <span>${vid.heroName}</span><span>•</span><span>🕒 ${vid.timestamp}</span></div></div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;"><button onclick="window.copyToClipboard('${vid.viralTitle.replace(/'/g, "\\'")}')" style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 13px;">📋 Copy Title</button><a href="${vid.urlV}" download="[SHORT]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4); border: 1px solid rgba(255,255,255,0.3); flex: 1; justify-content: center;">🚀 Download TikTok Video</a><button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: pointer;">❌ DEL</button></div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
