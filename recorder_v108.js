// ==========================================
// RECORDER.JS - V68.0 ULTIMATE EDITION (MP4 60 FPS)
// Tối ưu Layout: Clean Game -> HUD -> Poll -> Smart Alerts -> Chat -> Cat 
// ĐÃ FIX: LỖI KHÔNG HIỂN THỊ BẢNG TẢI VIDEO (FIXED MODAL UI)
// ĐÃ FIX: LỖI DROP FRAME & CHỐT FILE AN TOÀN
// NGÁCH VIRAL: "PSYCHOLOGICAL WARFARE & SCHIZO MOVEMENT" (ĐỘC LẠ - HÚT VIEW KHỦNG)
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackH = null; window.videoTrackV = null; 
window.isRecording = false; 
window.currentVideoExt = "mp4"; 
window.savedVideos = [];
window.filmDustY = 0; 
window.thumbnailHoldFrames = 0; 
window.introHoldFrames = 0; 
window.totalIntroFrames = 150; 
window.bakedThumbH = null; window.bakedThumbV = null; 

// Biến Cache & Hiệu ứng
window._cachedGradients = {}; 
window._glitchThrottle = 0; 
window._gridVerticalPath = null; 
window._liveAlerts = []; 
window._lastAlertTime = Date.now();

// ====================================================================
// 🎯 KHU VỰC TÙY CHỈNH: VIDEO MÈO NỀN XANH
// ====================================================================
window.CAT_GREEN_SCREEN_VIDEO = "Cat Scuba Dancing - Green Screen #scuba #cat #cats #trending #fyp.mp4"; 

// ====================================================================
// KHO NGƯỜI NỔI TIẾNG ĐÌNH ĐÁM TOÀN CẦU
// ====================================================================
window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "Ninja 🥷", color: "#1e90ff" }, { name: "DrDisrespect 🕶️", color: "#ff0000" },
    { name: "MrBeast 💰", color: "#2ecc71" }, { name: "Asmongold 🧙‍♂️", color: "#bdc3c7" },
    { name: "Faker_T1 🐐", color: "#ff0055" }, { name: "PewDiePie 👊", color: "#ff6b81" },
    { name: "Sketch 🤓", color: "#7bed9f" }, { name: "Cristiano Ronaldo ⚽", color: "#ffeb3b" }, 
    { name: "Lionel Messi 🐐", color: "#70a1ff" }, { name: "LeBron James 👑", color: "#ffeb3b" }, 
    { name: "Conor McGregor 🇮🇪", color: "#2ed573" }, { name: "Elon Musk 🚀", color: "#00f3ff" }
];

// ====================================================================
// ENGINE AI: TẠO TOXIC COMMENTS SIÊU ĐA DẠNG
// ====================================================================
window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    let randomName = celeb.name; let randomColor = celeb.color;

    const targets = ["Bro", "Blud", "This dude", "Lil bro", "My guy", "OP", "The player", "Broski", "Dawg"];
    const brutalActions = [
        "is legally blind", "has hands made of spaghetti", "is playing with his toes",
        "needs to be arrested for this gameplay", "is dropping my IQ",
        "is the definition of dogwater", "should be permanently banned", 
        "paid $0 for this game and still got scammed", "is sweating for zero views"
    ];
    const supremeInsults = [
        "Absolute garbage", "Brain rot gameplay", "Negative aura", "Uninstall immediately",
        "Even my dead goldfish plays better", "Sell your PC bro", "Literally dogmeat",
        "Skill issue of the century", "NPC behavior spotted", "0 IQ gameplay"
    ];
    const savageShorts = ["L", "LMAO NAHH", "WASHED", "COOKED", "RIP BOZO", "PLEASE STOP", "MY EYES", "TRASH", "ZERO IQ", "NPC DETECTED"];
    const gear = ["combo", "keyboard", "monitor", "gaming chair", "wifi", "mouse", "PC", "brain"];
    const emojis = ["💀", "😭", "🗑️", "🤡", "📉", "🤮", "💩", "🤬", "👎", "🤣", "🤦‍♂️", "💀💀", "☢️"];

    const toxicityTemplates = [
        () => `${r(targets)} ${r(brutalActions)} ${r(emojis)}`,
        () => `${r(supremeInsults)} ${r(emojis)}`,
        () => `${r(savageShorts)} ${r(emojis)}${r(emojis)}`,
        () => `Imagine being this bad... ${r(supremeInsults)} ${r(emojis)}`,
        () => `Why is ${r(targets).toLowerCase()} sweating so hard just to be trash? 😭🤡`,
        () => `Bro is the reason the game is dying 💀🗑️`,
        () => `Bro's gaming chair is doing all the work and still failing 💀`,
        () => `Bro is literally an NPC. 🤖📉`,
        () => `Someone take his ${r(gear)} away immediately ${r(emojis)}`,
        () => `Bro's aura is -9999 📉`
    ];

    let randomMsg = r(toxicityTemplates)();
    return { name: randomName, color: randomColor, msg: randomMsg };
};

window.trashTalkP1 = ""; window.trashTalkP2 = "";
window.introEmojiP1 = ""; window.introEmojiP2 = "";
window.bannerText1 = ""; window.bannerText2 = "";
window.statBadgeP1 = ""; window.statBadgeP2 = "";

window.retentionParticles = Array.from({length: 40}, () => ({ active: false, x: 0, y: 0, s: 0, v: 0, h: 0, age: 0 }));
window.retentionEmojis = Array.from({length: 15}, () => ({ active: false, x: 0, y: 0, v: 0, e: "", r: 0, age: 0 }));

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ====================================================================
// ENGINE AI: TẠO TIÊU ĐỀ & HASHTAG NGÁCH MỚI
// ====================================================================
window.StoryModeAI = {
    scriptLines: [], viralTitle: "", _usedTitles: new Set(),

    generateViralStickmanTitle: function(hero, enemy) {
        const adjectives = ["ILLEGAL", "SCHIZO", "BIBLICALLY ACCURATE", "UNETHICAL", "FORBIDDEN", "DIABOLICAL", "5D CHESS", "BRAINROT"];
        const actions = ["PSYCHOLOGICAL WARFARE", "LOBOTOMY COMBO", "SCHIZO MOVEMENT", "GASLIGHTING", "TAS MOVEMENT", "PIXEL PERFECT PARRY"];
        const subjects = ["PAID ACTOR", "INNOCENT TIMMY", "DEV", "AI BOSS", "VICTIM", (enemy || "THE BOSS").toUpperCase()];
        const reactions = ["😭💀", "☢️", "🧠📉", "👁️👄👁️", "🚑", "🤡", "🥶", "🚨"];

        const templates = [
            `BRO INITIATED [ACTION] ON A [SUBJECT] [REACTION]`,
            `USING [ADJ] [ACTION] IS BANNED IN 14 COUNTRIES [REACTION]`,
            `GASLIGHTING THE [SUBJECT] INTO RAGE QUITTING [REACTION]`,
            `VILLAIN ARC: TORTURING AN [SUBJECT] WITH [ACTION] [REACTION]`,
            `HE UNINSTALLED AFTER THIS [ADJ] [ACTION] [REACTION]`,
            `POV: YOU FACE A PLAYER WITH [ADJ] [ACTION] [REACTION]`,
            `ABSOLUTE CINEMA: 0 IQ [SUBJECT] VS [ADJ] AURA [REACTION]`,
            `I BROKE HIS MENTAL STATE WITH [ACTION] [REACTION]`
        ];

        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let rawTitle = r(templates).replace(/\[ADJ\]/g, () => r(adjectives)).replace(/\[ACTION\]/g, () => r(actions)).replace(/\[SUBJECT\]/g, () => r(subjects)).replace(/\[REACTION\]/g, () => r(reactions));

        const allTags = ["#schizomovement", "#psychologicalwarfare", "#villainarc", "#gaming", "#brainrot", "#tas", "#movementplayer", "#lobotomy", "#disrespect", "#clutch"];
        let selectedTags = allTags.sort(() => 0.5 - Math.random()).slice(0, 4).join(" ");
        let finalTitle = `${rawTitle} ${selectedTags}`;

        if (this._usedTitles.has(finalTitle) && this._usedTitles.size < 500) return this.generateViralStickmanTitle(hero, enemy); 
        this._usedTitles.add(finalTitle); return finalTitle;
    },

    init: function(hero, enemy) { this.viralTitle = this.generateViralStickmanTitle(hero, enemy); },
    stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawVTuberCommentator(ctx, x, y, audioPeak) {
    if (!window.catVideoObj) {
        window.catVideoObj = document.createElement('video');
        window.catVideoObj.src = window.CAT_GREEN_SCREEN_VIDEO;
        window.catVideoObj.loop = true; window.catVideoObj.muted = true; window.catVideoObj.crossOrigin = "anonymous";
        window.catVideoObj.play().catch(e => console.log("Auto-play Cat", e));
        window.catChromaCanvas = document.createElement('canvas');
        window.catChromaCanvas.width = 300; window.catChromaCanvas.height = 300;
        window.catChromaCtx = window.catChromaCanvas.getContext('2d', { willReadFrequently: true });
    }

    let t = Date.now(); ctx.save();
    let pulse = 1 + (audioPeak * 0.15); let floatY = Math.sin(t / 250) * 10;
    ctx.translate(x, y + floatY); ctx.scale(pulse, pulse);

    let radius = 160;
    if (window.analyserData) {
        ctx.lineWidth = 6; ctx.lineCap = "round";
        for (let i = 0; i < 32; i++) {
            let val = window.analyserData[i * 2] / 255; let barLength = 20 + (val * 80); 
            let angle = (i / 32) * Math.PI * 2 + (t/1000);
            ctx.strokeStyle = `hsl(${(i * 10 + t/10) % 360}, 100%, 60%)`;
            ctx.beginPath(); ctx.moveTo(Math.cos(angle) * (radius + 5), Math.sin(angle) * (radius + 5)); ctx.lineTo(Math.cos(angle) * (radius + barLength), Math.sin(angle) * (radius + barLength)); ctx.stroke();
        }
    }

    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.closePath();
    ctx.fillStyle = "#0f172a"; ctx.fill();
    ctx.shadowColor = audioPeak > 0.6 ? "#ff0055" : "#00f3ff"; ctx.shadowBlur = 30 + (audioPeak * 50);
    ctx.lineWidth = 15; ctx.strokeStyle = audioPeak > 0.6 ? "#ff0055" : "#00f3ff"; ctx.stroke(); ctx.clip();
    
    if (window.catVideoObj.readyState >= 2) { 
        let vCtx = window.catChromaCtx;
        vCtx.drawImage(window.catVideoObj, 0, 0, 300, 300);
        let frameData = vCtx.getImageData(0, 0, 300, 300); let l = frameData.data.length / 4;
        for (let i = 0; i < l; i++) {
            let r = frameData.data[i * 4 + 0]; let g = frameData.data[i * 4 + 1]; let b = frameData.data[i * 4 + 2];
            if (g > 80 && g > r * 1.2 && g > b * 1.2) frameData.data[i * 4 + 3] = 0; 
        }
        vCtx.putImageData(frameData, 0, 0);
        ctx.drawImage(window.catChromaCanvas, -radius, -radius, radius * 2, radius * 2);
    } else {
        ctx.shadowBlur = 0; ctx.fillStyle = "#ffffff"; ctx.font = "bold 90px 'Arial'";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🐈", 0, -20);
        ctx.fillStyle = "#ffeb3b"; ctx.font = "900 35px 'Arial Black'"; ctx.fillText("LOADING...", 0, 45);
    }
    ctx.restore();

    ctx.save(); ctx.translate(x, y + floatY + radius - 15); ctx.scale(pulse, pulse);
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 15; ctx.fillStyle = "#ff0000";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-70, -25, 140, 50, 15); else ctx.fillRect(-70, -25, 140, 50); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.font = "900 24px 'Arial Black'"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🔴 LIVE", 0, 2); ctx.restore();
}

window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbH = document.createElement('canvas'); window.bakedThumbH.width = 1920; window.bakedThumbH.height = 1080; 
        let ctxH = window.bakedThumbH.getContext('2d');
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
        let ctxV = window.bakedThumbV.getContext('2d');
        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
        let hue1 = Math.floor(Math.random() * 360); let hue2 = (hue1 + 180 + Math.floor(Math.random() * 60 - 30)) % 360; 
        
        const drawMemeBg = (ctx, w, h) => {
            ctx.fillStyle = `hsl(${hue1}, 100%, 15%)`; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.translate(w/2, h/2);
            for(let i=0; i<30; i++) { ctx.rotate(Math.PI / 15); ctx.fillStyle = `hsl(${hue2}, 100%, 35%)`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.max(w,h)*1.5, 100); ctx.lineTo(Math.max(w,h)*1.5, -100); ctx.fill(); }
            ctx.restore(); ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            for(let x=0; x<w; x+=20) { for(let y=0; y<h; y+=20) { if((x+y)%40===0) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); } } }
            ctx.globalCompositeOperation = 'source-over';
        };
        drawMemeBg(ctxH, 1920, 1080); drawMemeBg(ctxV, 1080, 1920);
        
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            if (typeof window.drawStickman === 'function') { window.drawStickman(ctx, clone); window.drawStickman(ctx, clone); window.drawStickman(ctx, clone); }
            ctx.restore();
        };
        drawCharSafe(ctxH, window.p1, 450, 850, 4.5, true); drawCharSafe(ctxH, e1, 1470, 850, 4.5, false);
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        
        const draw3DTitle = (ctx, w, h, text, isVertical) => {
            ctx.save();
            let grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, Math.max(w,h));
            grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)"); ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
            ctx.translate(w/2, isVertical ? h*0.15 : h*0.15); ctx.rotate(-0.06); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            let fontSize = isVertical ? 85 : 100; ctx.font = `italic 900 ${fontSize}px 'Arial Black', Impact`;
            let lines = [text]; if(isVertical) { let words = text.split(" "); lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; }
            let clr = ["#00f3ff", "#0055ff"];
            lines.forEach((line, index) => {
                let yOffset = index * (fontSize + 10); ctx.lineWidth = 25; ctx.strokeStyle = "#000";
                for(let d=15; d>0; d--) { ctx.strokeText(line, d, yOffset + d); ctx.fillStyle = clr[1]; ctx.fillText(line, d, yOffset + d); }
                ctx.strokeText(line, 0, yOffset); ctx.fillStyle = clr[0]; ctx.fillText(line, 0, yOffset); ctx.fillStyle = "#ffffff"; ctx.fillText(line, -3, yOffset - 3);
            });
            ctx.restore();
        };
        draw3DTitle(ctxH, 1920, 1080, (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(), false); draw3DTitle(ctxV, 1080, 1920, true);
    } catch (e) {}
};

window.drawAnimatedIntro = function(ctx, w, h, isVertical, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let zoom = 1 + (progress * 0.1); ctx.translate(w/2, h/2); ctx.scale(zoom, zoom); ctx.translate(-w/2, -h/2);
    let easeOut = 1 - Math.pow(1 - Math.min(1, progress * 4.5), 3); 
    let p1X = (isVertical ? -w*0.8 : -w*0.5) + ((isVertical ? w*0.45 : w*0.35) - (isVertical ? -w*0.8 : -w*0.5)) * easeOut;
    let p2X = (isVertical ? w*1.8 : w*1.5) + ((isVertical ? w*0.55 : w*0.65) - (isVertical ? w*1.8 : w*1.5)) * easeOut;
    
    ctx.fillStyle = "#110000"; ctx.fillRect(-w, -h, w*3, h*3); 
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(Math.PI/12); ctx.fillStyle = "rgba(255, 50, 50, 0.15)";
    for (let i = -w*1.5; i < w*1.5; i += 90) ctx.fillRect(i - ((progress * 3000) % 200), -h*1.5, 15, h*3);
    ctx.restore();
    
    ctx.fillStyle = "rgba(0, 15, 30, 0.95)"; ctx.beginPath();
    if (isVertical) { ctx.moveTo(-w,-h); ctx.lineTo(w*2,-h); ctx.lineTo(w*2, h*0.48); ctx.lineTo(-w, h*0.52); }
    else { ctx.moveTo(-w,-h); ctx.lineTo(w*0.55, -h); ctx.lineTo(w*0.45, h*2); ctx.lineTo(-w, h*2); }
    ctx.fill();
    
    ctx.save(); let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let p2Clone = Object.assign({}, e1, {x:0, y:0, scale: isVertical ? 4.7 : 6.0, state: 'cast', isFacingRight: false});
    ctx.translate(p2X, isVertical ? h*0.7 : h*0.65); ctx.scale(-1, 1); if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p2Clone);
    ctx.restore();
    
    ctx.save(); let p1Clone = Object.assign({}, window.p1, {x:0, y:0, scale: isVertical ? 4.7 : 6.0, state: 'cast', isFacingRight: true});
    ctx.translate(p1X, isVertical ? h*0.3 : h*0.65); if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p1Clone);
    ctx.restore();
    
    ctx.lineWidth = 20; ctx.strokeStyle = "#fff"; ctx.beginPath();
    if (isVertical) { ctx.moveTo(-w, h*0.52 + w*0.02); ctx.lineTo(w*2, h*0.48 - w*0.02); } else { ctx.moveTo(w*0.55 + h*0.02, -h); ctx.lineTo(w*0.45 - h*0.02, h*2); }
    ctx.stroke();

    if (progress > 0.85) {
        let flashAlpha = Math.min(1, (progress - 0.85) * 6.6); ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = `rgb(255, 255, 255)`; ctx.fillRect(-w, -h, w*3, h*3); ctx.globalAlpha = 1.0; 
    }
    ctx.restore(); window.ctx = originalCtx;
};

// AUDIO INTERCEPTOR
if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try { let source = window.audioCtx.createMediaElementSource(this); source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination); if (window.recordAnalyser) source.connect(window.recordAnalyser); this._routedToRecorder = true; } catch (e) { }
        }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
}

window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    
    window.recordCanvasH = document.getElementById("hiddenRecordCanvasH");
    if (!window.recordCanvasH) { window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; document.body.appendChild(window.recordCanvasH); }
    window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080; window.recordCanvasH.style.display = "none";
    window.recordCtxH = window.recordCanvasH.getContext("2d", ctxOpts);

    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV");
    if (!window.recordCanvasV) { window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; window.recordCanvasV.style.display = "none";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

// HIỂN THỊ TOAST THÔNG BÁO RENDERING (CHỐNG NGƯỜI DÙNG TƯỞNG GAME TREO)
window.showRenderToast = function() {
    let toast = document.getElementById("render-toast-noti");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "render-toast-noti";
        toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff0050; color: white; padding: 12px 25px; border-radius: 30px; font-family: 'Arial Black', sans-serif; font-size: 16px; z-index: 2147483647; box-shadow: 0 4px 15px rgba(255,0,80,0.5); border: 2px solid #fff; transition: opacity 0.3s; pointer-events: none;";
        document.body.appendChild(toast);
    }
    toast.innerHTML = "⏳ RENDERING VIDEO... PLEASE WAIT (DON'T CLOSE)";
    toast.style.opacity = "1";
};
window.hideRenderToast = function() {
    let toast = document.getElementById("render-toast-noti");
    if (toast) toast.style.opacity = "0";
};

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    if (window.catVideoObj && window.catVideoObj.paused) window.catVideoObj.play().catch(e => {});

    window.recordedChunksH = []; window.recordedChunksV = [];
    window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    
    let videoStreamH = window.recordCanvasH.captureStream(0); 
    let videoStreamV = window.recordCanvasV.captureStream(0); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    window.videoTrackH = videoStreamH.getVideoTracks()[0];
    window.videoTrackV = videoStreamV.getVideoTracks()[0];

    let combinedStreamH = new MediaStream([...videoStreamH.getVideoTracks(), ...audioTracks]);
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')) { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); window.mediaRecorderV = new MediaRecorder(combinedStreamV, options);

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png"; let enemyName = "BOSS";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    
    window.thumbnailHoldFrames = 30; window.introHoldFrames = window.totalIntroFrames; 

    // QUAN TRỌNG: SỰ KIỆN KHI DỪNG GHI SẼ GỌI HIỂN THỊ UI
    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) { 
            setTimeout(() => {
                window.hideRenderToast(); // Tắt thông báo render
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) { alert("⚠️ Render failed. Please try again."); return; }
                
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
                let blobH = new Blob(window.recordedChunksH, { type: window.mediaRecorderH.mimeType }); 
                let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 

                window.savedVideos.unshift({ 
                    id: Date.now(), 
                    urlH: URL.createObjectURL(blobH), urlV: URL.createObjectURL(blobV), 
                    ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.viralTitle, safeFileName: safeFileName,
                    previewThumb: window.bakedThumbH ? window.bakedThumbH.toDataURL("image/jpeg", 0.3) : "" 
                });
                
                // GỌI HÀM HIỂN THỊ UI MODAL BẢN MỚI
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 800); 
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); 
    window.isRecording = true;
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 
    
    window.showRenderToast(); // Hiển thị thông báo đang render

    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.recordCtxH) { window.recordCtxH.fillStyle = "#000000"; window.recordCtxH.fillRect(0,0,1920,1080); }

    // BƯỚC 1: DỪNG MEDIARECORDER TRƯỚC
    if (window.mediaRecorderH && window.mediaRecorderH.state !== "inactive") { try { window.mediaRecorderH.stop(); } catch(e){} }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }

    // BƯỚC 2: CHỜ 1 CHÚT RỒI MỚI DỪNG TRACK (TRÁNH LỖI MẤT TRUYỀN DỮ LIỆU)
    setTimeout(() => {
        if (window.videoTrackH) { window.videoTrackH.stop(); window.videoTrackH = null; }
        if (window.videoTrackV) { window.videoTrackV.stop(); window.videoTrackV = null; }
    }, 500);

    window.StoryModeAI.stop();
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true;
    const oldDraw = window.draw;
    window.draw = function() {
        if (oldDraw) oldDraw.apply(this, arguments);
        if (typeof window.captureFrames === 'function') window.captureFrames();
    };
}

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;

    // KHI GAME KẾT THÚC (HOẶC HẾT THỜI GIAN CHỜ OUTRO)
    if (window.gameOver && window.matchEndTimer > 350) {
        window.stopRecording();
        return;
    }
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 
    let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxH.fillStyle = "#000000"; ctxH.fillRect(0,0,1920,1080); ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);

    let renderNormalH = true;
    if (window.thumbnailHoldFrames > 0) {
        if (window.bakedThumbH) ctxH.drawImage(window.bakedThumbH, 0, 0, 1920, 1080);
        window.thumbnailHoldFrames--; renderNormalH = false; 
    } 
    else if (window.introHoldFrames > 0) {
        let progress = 1 - (window.introHoldFrames / window.totalIntroFrames);
        window.drawAnimatedIntro(ctxH, 1920, 1080, false, progress);
        window.introHoldFrames--; renderNormalH = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 35; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }

    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    if (renderNormalH) { ctxH.imageSmoothingEnabled = false; ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1920, 1080); }

    let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
    ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

    if (shouldGlitch) {
        let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; 
        ctxV.fillStyle = '#ff0000'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
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

    if (!isOutroActive) {
        // --- POLL CHAT HUD ---
        if (window.p1) {
            ctxV.save(); let pollY = splitGameHeight + 315; let pollWidth = 800; ctxV.translate(540, pollY);
            let p1Pct = 0.5; ctxV.fillStyle = "#ff0055";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); ctxV.save(); ctxV.clip(); ctxV.fillStyle = "#00f3ff"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36); ctxV.restore(); }
            ctxV.strokeStyle = "rgba(255,255,255,0.6)"; ctxV.lineWidth = 4;
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); }
            ctxV.fillStyle = "#1e293b"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill();
            ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke(); ctxV.fillStyle = "#fff"; ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
            ctxV.restore();
        }

        // --- KHỞI TẠO CHAT AI ---
        if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; window._fakeViewers = 1204512; for(let i = 0; i < 8; i++) { window._liveChats.push(window.generateLiveChatEvent()); } }
        let chatNow = Date.now();
        if (chatNow - window._lastChatUpdate > window._nextChatDelay) { window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; window._liveChats.push(window.generateLiveChatEvent()); if (window._liveChats.length > 8) window._liveChats.shift(); window._fakeViewers += Math.floor(Math.random() * 3000) - 1000; }

        // --- BẢNG CHAT ---
        ctxV.save(); let boxWidth = 960; let boxHeight = 440; ctxV.translate(540, 1250);
        ctxV.fillStyle = "rgba(10, 15, 30, 0.6)"; ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; ctxV.lineWidth = 3;
        ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.fill(); ctxV.stroke();
        ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.clip(); 
        ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 70); ctxV.fillStyle = "#fff"; 
        ctxV.font = "900 36px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText("🔴 TOXIC LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 35);
        ctxV.font = "900 28px 'Arial'"; ctxV.textAlign = "right"; ctxV.fillText("👥 " + window._fakeViewers.toLocaleString() + " VIEWERS", boxWidth/2 - 30, -boxHeight/2 + 35);
        
        ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 70, boxWidth, boxHeight - 70); ctxV.clip();
        let currentY = boxHeight/2 - 20; let lineHeight = 45; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 34px Arial"; let headerBottomY = -boxHeight/2 + 70; 
        for (let i = window._liveChats.length - 1; i >= 0; i--) { 
            let chat = window._liveChats[i]; let nameStr = chat.name + ":"; let nameWidth = ctxV.measureText(nameStr).width;
            ctxV.fillStyle = chat.color; ctxV.fillText(nameStr, -boxWidth/2 + 30, currentY); ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.msg, -boxWidth/2 + 30 + nameWidth, currentY); currentY -= lineHeight; 
            if (currentY - lineHeight < headerBottomY - 10) break;
        }
        ctxV.restore();

        // --- AVATAR MÈO GREEN SCREEN ĐÁY MÀN HÌNH ---
        drawVTuberCommentator(ctxV, 540, 1680, audioPeak);
        
    } else {
        // --- OUTRO ---
        let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
        let drawOutroCTA = (ctx, w, h, isMobile) => {
            ctx.save(); ctx.globalAlpha = outroAlpha;
            let bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)"); ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);
            let cx = (w / 2) | 0; let cy = (h / 2) | 0; ctx.textAlign = "center"; ctx.textBaseline = "middle"; 
            if (isMobile) {
                ctx.fillStyle = "#ffffff"; ctx.font = `900 65px 'Arial Black', sans-serif`; ctx.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500);
            } else {
                ctx.fillStyle = "#00f3ff"; ctx.font = `italic 900 107px 'Arial Black', sans-serif`; ctx.fillText("CREATE YOUR OWN", cx, cy - 200);
            }
            ctx.restore();
        };
        if (renderNormalH) drawOutroCTA(ctxH, 1920, 1080, false); drawOutroCTA(ctxV, 1080, 1920, true);
    }

    if (window.videoTrackH && window.videoTrackH.requestFrame) window.videoTrackH.requestFrame();
    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };
window.closeVideoListUI = function() { let c = document.getElementById("video-list-container"); if(c) c.style.display = "none"; };

// ==========================================
// [FIX CHÍNH]: HÀM GIAO DIỆN MỚI - HIỂN THỊ DẠNG MODAL FIXED
// Đảm bảo LUÔN LUÔN nằm trên cùng màn hình, không bị ẩn bởi CSS Game
// ==========================================
window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); container.id = "video-list-container"; 
        
        // CSS SIÊU MẠNH: position: fixed và z-index vô cực để xuyên thủng mọi lớp CSS của Canvas
        container.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 900px; max-height: 85vh; overflow-y: auto; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px); border-radius: 15px; border: 2px solid #00f3ff; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 0 50px rgba(0,243,255,0.4); z-index: 2147483647; padding: 25px; box-sizing: border-box;"; 
        
        // LUÔN APPEND VÀO THÂN BODY ĐỂ TRÁNH LỖI OVERFLOW CỦA GAME CONTAINER
        document.body.appendChild(container); 
    }
    
    container.style.display = "block"; // Hiển thị lại nếu đã bị đóng trước đó

    if (window.savedVideos.length === 0) { 
        container.innerHTML = `
            <button onclick="window.closeVideoListUI()" style="position: absolute; top: 15px; right: 15px; background: #ff0055; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; font-weight: bold; cursor: pointer; font-size: 16px;">X</button>
            <h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Arial Black', sans-serif; letter-spacing: 2px; font-size: 32px;">🎬 STUDIO ARCHIVE</h3>
            <p style="text-align: center; color: #94a3b8; margin: 0; font-size: 16px;">No battles recorded yet. Fight to generate content!</p>
        `; 
        return; 
    }

    let html = `
        <button onclick="window.closeVideoListUI()" style="position: absolute; top: 15px; right: 25px; background: #ff0055; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-weight: bold; cursor: pointer; font-size: 18px; box-shadow: 0 4px 10px rgba(255,0,85,0.5);">X</button>
        <h3 style="margin: 0 0 20px 0; color: #00f3ff; text-align: center; font-family: 'Arial Black', sans-serif; letter-spacing: 2px; font-size: 30px;">🎬 RECORDED CLIPS (${window.savedVideos.length})</h3>
        <div style="display: flex; flex-direction: column; gap: 15px; max-height: 60vh; overflow-y: auto; padding-right: 10px;">`;
    
    window.savedVideos.forEach((vid) => { 
        html += `
        <div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="position: relative; width: 260px; height: 146px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a;">
                <img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;">
                <span style="position: absolute; bottom: 6px; left: 6px; background: rgba(30, 215, 96, 0.85); color: #fff; font-size: 11px; padding: 3px 6px; border-radius: 4px; font-weight: bold;">✅ AUTO-THUMBNAIL</span>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-weight: 900; color: #ffeb3b; font-size: 20px; display: block; margin-bottom: 8px; line-height: 1.2;">${vid.viralTitle}</span>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; font-weight: 600;">
                        <span>🕒 ${vid.timestamp}</span> | <span>${vid.heroName}</span>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                    <button onclick="window.copyToClipboard('${vid.viralTitle.replace(/'/g, "\\'")}')" style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 13px;">📋 Copy Title</button>
                    <a href="${vid.urlH}" download="[HORZ]_${vid.safeFileName}.${vid.ext}" style="background: #475569; color: #fff; text-decoration: none; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold;">📥 PC Video (16:9)</a>
                    <a href="${vid.urlV}" download="[VIRAL]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4);">🚀 TikTok Shorts</a>
                    <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: pointer; margin-left: auto;">❌ DEL</button>
                </div>
            </div>
        </div>`; 
    });
    html += `</div>`; 
    container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlH); URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } 
};
