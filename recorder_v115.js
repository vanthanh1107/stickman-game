// ==========================================
// RECORDER.JS - V69.2 ULTRA-LIGHTWEIGHT (9:16 SHORT ONLY)
// ĐÃ TỐI ƯU: Xóa hoàn toàn mã hóa 16:9, giảm 50% CPU/GPU.
// CẬP NHẬT: Áp dụng Intro 3D và Thumbnail vào video TikTok (9:16).
// NGÁCH VIRAL: "PSYCHOLOGICAL WARFARE & SCHIZO MOVEMENT" 
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; 
window.isRecording = false; 
window.currentVideoExt = "mp4"; 
window.savedVideos = [];
window.filmDustY = 0; 
window.thumbnailHoldFrames = 0; 
window.introHoldFrames = 0; 
window.totalIntroFrames = 150; 
window.bakedThumbV = null; 

// Biến Cache & Hiệu ứng
window._cachedGradients = {}; 
window._glitchThrottle = 0; 
window._gridVerticalPath = null; 
window._liveAlerts = []; 
window._lastAlertTime = Date.now();
window._lastCaptureTime = 0; 
window._recordLoopId = null; // Loop độc lập

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
    { name: "Mike Tyson 🥊", color: "#ff4757" }, { name: "Conor McGregor 🇮🇪", color: "#2ed573" }, 
    { name: "Jon Jones 🦴", color: "#a4b0be" }, { name: "Khabib 🦅", color: "#ffb8b8" },
    { name: "Elon Musk 🚀", color: "#00f3ff" }, { name: "Mark Zuckerberg 🦎", color: "#3498db" },
    { name: "Jeff Bezos 📦", color: "#f39c12" }, { name: "Bill Gates 💻", color: "#2ecc71" },
    { name: "Gordon Ramsay 🍳", color: "#ffffff" }, { name: "Andrew Tate 🏎️", color: "#ff7f50" },
    { name: "Snoop Dogg 🌿", color: "#2ed573" }, { name: "Drake 🦉", color: "#ffa502" },
    { name: "Kanye West 🐻", color: "#a4b0be" }, { name: "Eminem 🎤", color: "#ff4757" },
    { name: "The Rock 🪨", color: "#bdc3c7" }, { name: "John Cena 🤫", color: "#2ecc71" },
    { name: "Kevin Hart 🤨", color: "#f1c40f" }, { name: "Donald Trump 🇺🇸", color: "#ff6b81" },
    { name: "Batman 🦇", color: "#ffffff" }, { name: "Homelander 🇺🇸", color: "#ff4757" }
];

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    const targets = ["Bro", "Blud", "This dude", "Lil bro", "My guy", "OP", "The player"];
    const brutalActions = [
        "is legally blind", "has hands made of spaghetti", "is playing with his toes",
        "needs to be arrested for this gameplay", "is dropping my IQ by watching this",
        "is the definition of dogwater", "should be permanently banned",
        "has the reaction time of a dead turtle", "is playing on a smart fridge", 
        "makes me want to bleach my eyes", "is sweating for zero views", "forgets how to play"
    ];
    const supremeInsults = [
        "Absolute garbage", "Brain rot gameplay", "Negative aura", "Uninstall immediately",
        "Even my dead goldfish plays better", "Sell your PC bro", "Literally dogmeat",
        "You are completely washed", "Skill issue of the century", "NPC behavior spotted"
    ];
    const savageShorts = [
        "L", "LMAO NAHH", "WASHED", "COOKED", "RIP BOZO", "PLEASE STOP", "TRASH", "AINT NO WAY",
        "CRINGE", "ZERO IQ", "NPC DETECTED", "BOT BEHAVIOR", "PACK IT UP BRO", "FREE ELO"
    ];
    const gear = ["combo", "keyboard", "monitor", "gaming chair", "wifi", "mouse", "PC"];
    const emojis = ["💀", "😭", "🗑️", "🤡", "📉", "🤮", "💩", "🤬", "👎", "🤣", "🤦‍♂️", "🚑", "☢️"];
    const randomButtons = () => { const btns = ["A", "B", "X", "Y", "R1", "L2", "Space", "Click"]; return `${r(btns)} + ${r(btns)} + ${r(btns)} spammer`; };
    const toxicityTemplates = [
        () => `${r(targets)} ${r(brutalActions)} ${r(emojis)}`, () => `${r(supremeInsults)} ${r(emojis)}`,
        () => `${r(savageShorts)} ${r(emojis)}${r(emojis)}`, () => `Imagine being this bad... ${r(supremeInsults)} ${r(emojis)}`,
        () => `I lost brain cells watching this. ${r(savageShorts)} ${r(emojis)}`, () => `Why is ${r(targets).toLowerCase()} sweating so hard just to be trash? 😭🤡`,
        () => `Bro is the reason the game is dying 💀🗑️`, () => `Send me location. I smash him. 🦅`, 
        () => `Bro's gaming chair is doing all the work and still failing 💀`, () => `${r(targets)} thought he cooked... he burnt down the whole kitchen 🔥💀`,
        () => `Never play this game again. For everyone's sake. 🙏🗑️`, () => `Bro is literally an NPC. 🤖📉`,
        () => `What color is your ${r(gear)}? Broke ${r(emojis)}`, () => `Someone take his ${r(gear)} away immediately ${r(emojis)}`,
        () => `Reported for being this bad 💀`, () => `${randomButtons()} 🤡`, () => `Bro's aura is -9999 📉`
    ];

    let chatObj = { name: celeb.name, color: celeb.color, msg: r(toxicityTemplates)(), lines: null, nameWidth: 0 };
    return chatObj;
};

// Tiền xử lý chữ (tiết kiệm CPU)
window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; 
    ctx.font = "bold 34px Arial";
    chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 960 - 60 - chatObj.nameWidth - 10; 
    let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) {
        let testLine = currentLine + words[n] + " ";
        if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) {
            lines.push(currentLine.trim()); currentLine = words[n] + " ";
        } else { currentLine = testLine; }
    }
    lines.push(currentLine.trim());
    chatObj.lines = lines;
};

// ====================================================================

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
// ENGINE AI NỘI BỘ TẠO TIÊU ĐỀ
// ====================================================================
window.StoryModeAI = {
    scriptLines: [], viralTitle: "", _usedTitles: new Set(),
    generateViralStickmanTitle: function(hero, enemy) {
        const adjs = ["ILLEGAL", "SCHIZO", "BIBLICALLY ACCURATE", "UNETHICAL", "FORBIDDEN", "DIABOLICAL", "5D CHESS", "BRAINROT"];
        const acts = ["PSYCHOLOGICAL WARFARE", "LOBOTOMY COMBO", "SCHIZO MOVEMENT", "GASLIGHTING", "TAS MOVEMENT", "PIXEL PERFECT PARRY"];
        const subs = ["PAID ACTOR", "INNOCENT TIMMY", "DEV", "AI BOSS", "VICTIM", (enemy || "THE BOSS").toUpperCase()];
        const reas = ["😭💀", "☢️", "🧠📉", "👁️👄👁️", "🚑", "🤡", "🥶", "🚨"];
        const tmpls = [`BRO INITIATED [ACTION] ON A [SUBJECT] [REACTION]`, `USING [ADJ] [ACTION] IS BANNED IN 14 COUNTRIES [REACTION]`, `GASLIGHTING THE [SUBJECT] INTO RAGE QUITTING [REACTION]`, `VILLAIN ARC: TORTURING AN [SUBJECT] WITH [ACTION] [REACTION]`, `HE UNINSTALLED AFTER THIS [ADJ] [ACTION] [REACTION]`, `POV: YOU FACE A PLAYER WITH [ADJ] [ACTION] [REACTION]`, `ABSOLUTE CINEMA: 0 IQ [SUBJECT] VS [ADJ] AURA [REACTION]`, `THE MOST [ADJ] DISRESPECT IN GAMING HISTORY [REACTION]`];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let rawTitle = r(tmpls).replace(/\[ADJ\]/g, () => r(adjs)).replace(/\[ACTION\]/g, () => r(acts)).replace(/\[SUBJECT\]/g, () => r(subs)).replace(/\[REACTION\]/g, () => r(reas));
        let selectedTags = ["#schizomovement", "#psychologicalwarfare", "#villainarc", "#gaming", "#brainrot"].sort(() => 0.5 - Math.random()).slice(0, 4).join(" ");
        return `${rawTitle} ${selectedTags}`;
    },
    init: function(hero, enemy) { this.viralTitle = this.generateViralStickmanTitle(hero, enemy); },
    stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawLiveBadge(ctx, x, y, audioPeak) {
    let pulse = 1 + (audioPeak * 0.1);
    ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
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
        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
        let hue1 = Math.floor(Math.random() * 360); let hue2 = (hue1 + 180 + Math.floor(Math.random() * 60 - 30)) % 360; 
        
        const drawMemeBg = (ctx, w, h) => {
            ctx.fillStyle = `hsl(${hue1}, 100%, 15%)`; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.translate(w/2, h/2);
            for(let i=0; i<30; i++) { ctx.rotate(Math.PI / 15); ctx.fillStyle = `hsl(${hue2}, 100%, 35%)`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.max(w,h)*1.5, 100); ctx.lineTo(Math.max(w,h)*1.5, -100); ctx.fill(); }
            ctx.restore(); ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            for(let x=0; x<w; x+=20) { for(let y=0; y<h; y+=20) { if((x+y)%40===0) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); } } } ctx.globalCompositeOperation = 'source-over';
        };
        drawMemeBg(ctxV, 1080, 1920);
        
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            for(let i=0; i<3; i++) { if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); }
            if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        };
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        
        const drawClickbaitProps = (ctx, w, h) => {
            ctx.save(); let rx = w/2; let ry = h*0.4 + Math.random()*150;
            ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 18; ctx.beginPath(); ctx.ellipse(rx, ry, 90 + Math.random()*40, 135 + Math.random()*40, Math.random()*0.5, 0, Math.PI*2); ctx.stroke();
            ctx.font = "110px Arial"; ctx.fillText(rx > w/2 ? "⬅️" : "➡️", rx + (rx > w/2 ? -150 : 75), ry);
            ctx.translate(w*0.7, h*0.6); ctx.rotate((Math.random()-0.5)*0.5);
            ctx.font = "italic 900 80px Impact"; ctx.textAlign = "center"; ctx.lineWidth = 18; ctx.strokeStyle = "#000"; ctx.strokeText("-999,999 💢", 0,0);
            ctx.fillStyle = "#ff003c"; ctx.fillText("-999,999 💢", 0,0); ctx.fillStyle = "#fff"; ctx.fillText("-999,999 💢", -4,-4); ctx.restore();
        };
        drawClickbaitProps(ctxV, 1080, 1920);
        
        const draw3DTitle = (ctx, w, h, text) => {
            ctx.save(); let grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, Math.max(w,h)); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
            ctx.fillStyle = grad; ctx.fillRect(0,0,w,h); ctx.translate(w/2, h*0.15); ctx.rotate(-0.06); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            let fontSize = 85; ctx.font = `italic 900 ${fontSize}px 'Arial Black', Impact`; 
            let words = text.split(" "); let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
            let depth = 15; let colors = [["#f1c40f", "#d35400"], ["#00f3ff", "#0055ff"], ["#ff4757", "#8b0000"]]; let clr = colors[Math.floor(Math.random() * colors.length)];
            lines.forEach((line, index) => {
                let yOffset = index * (fontSize + 10); ctx.lineWidth = 25; ctx.strokeStyle = "#000";
                for(let d=depth; d>0; d--) { ctx.strokeText(line, d, yOffset + d); ctx.fillStyle = clr[1]; ctx.fillText(line, d, yOffset + d); }
                ctx.strokeText(line, 0, yOffset); ctx.fillStyle = clr[0]; ctx.fillText(line, 0, yOffset); ctx.fillStyle = "#ffffff"; ctx.fillText(line, -3, yOffset - 3);
            }); ctx.restore();
        };
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim();
        draw3DTitle(ctxV, 1080, 1920, shortTitle);
    } catch (e) { console.error("Lỗi Bake Thumbnail:", e); }
};

window.drawAnimatedIntro = function(ctx, w, h, isVertical, progress) {
    let originalCtx = window.ctx; window.ctx = ctx;
    ctx.save(); let zoom = 1 + (progress * 0.1); ctx.translate(w/2, h/2); ctx.scale(zoom, zoom); ctx.translate(-w/2, -h/2);
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let easeOut = 1 - Math.pow(1 - Math.min(1, progress * 4.5), 3); 
    let p1TargetX = w*0.45; let p1TargetY = h*0.3;
    let p1StartX = -w*0.8; let p1X = p1StartX + (p1TargetX - p1StartX) * easeOut;
    let p2TargetX = w*0.55; let p2TargetY = h*0.7;
    let p2StartX = w*1.8; let p2X = p2StartX + (p2TargetX - p2StartX) * easeOut;
    ctx.fillStyle = "#110000"; ctx.fillRect(-w, -h, w*3, h*3); 
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(Math.PI/12); let speedOffset = (progress * 3000) % 200; ctx.fillStyle = "rgba(255, 50, 50, 0.15)";
    for (let i = -w*1.5; i < w*1.5; i += 90) { ctx.fillRect(i - speedOffset, -h*1.5, 15, h*3); } ctx.restore();
    
    const drawMarquee = (yPos, text, speedMult, bgCol) => {
        ctx.save(); ctx.translate(0, yPos); ctx.rotate(-0.06); ctx.fillStyle = bgCol; ctx.fillRect(-w, -35, w*3, 70);
        let textOffset = (progress * 800 * speedMult) % 1200; ctx.fillStyle = "#000"; ctx.font = "900 45px 'Arial Black'"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        for(let j = -1; j <= 3; j++) { ctx.fillText(text, (j*1200) - textOffset, 0); } ctx.restore();
    };
    drawMarquee(h*0.2, window.bannerText1, 1.5, "#ffcc00"); drawMarquee(h*0.8, window.bannerText2, -2.0, "#ffcc00");
    
    ctx.save(); let p2Clone = Object.assign({}, e1, {x:0, y:0, scale: 4.7, state: 'cast', isFacingRight: false}); ctx.translate(p2X, p2TargetY); ctx.scale(-1, 1);
    if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p2Clone);
    ctx.scale(-1, 1); ctx.fillStyle = "#ff4757"; ctx.font = "900 35px Arial Black"; ctx.fillText(window.statBadgeP2, -80, 50); ctx.restore();
    
    ctx.fillStyle = "rgba(0, 15, 30, 0.95)"; ctx.beginPath();
    ctx.moveTo(-w,-h); ctx.lineTo(w*2,-h); ctx.lineTo(w*2, h*0.48); ctx.lineTo(-w, h*0.52); ctx.fill();
    ctx.save(); ctx.beginPath();
    ctx.moveTo(-w,-h); ctx.lineTo(w*2,-h); ctx.lineTo(w*2, h*0.48); ctx.lineTo(-w, h*0.52); ctx.clip(); 
    ctx.translate(w/2, h/2); ctx.rotate(Math.PI/12); ctx.fillStyle = "rgba(0, 150, 255, 0.15)";
    for (let i = -w*1.5; i < w*1.5; i += 120) { ctx.fillRect(i - speedOffset, -h*1.5, 20, h*3); } ctx.restore();
    
    ctx.save(); let p1Clone = Object.assign({}, window.p1, {x:0, y:0, scale: 4.7, state: 'cast', isFacingRight: true}); ctx.translate(p1X, p1TargetY); 
    if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p1Clone); ctx.fillStyle = "#00f3ff"; ctx.font = "900 35px Arial Black"; ctx.fillText(window.statBadgeP1, -80, 50); ctx.restore();
    
    ctx.lineWidth = 20; ctx.strokeStyle = "#fff"; ctx.beginPath();
    ctx.moveTo(-w, h*0.52 + w*0.02); ctx.lineTo(w*2, h*0.48 - w*0.02); ctx.stroke();
    
    if (progress > 0.25 && progress < 0.4) { let intensity = (0.4 - progress) * 80; ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity); }
    
    const drawSpeechAndEmoji = (x, y, text, isP1, emojiStr, popProgress) => {
        if (popProgress <= 0) return; ctx.save(); ctx.translate(x, y);
        let bounce = popProgress < 1 ? Math.sin(popProgress * Math.PI * 1.5) * (1 - popProgress) * 0.4 + 1 : 1; ctx.scale(bounce, bounce);
        let tw = text.length * 28 + 100; let th = 110; ctx.save(); ctx.transform(1, 0, -0.1, 1, 0, 0); 
        ctx.fillStyle = "#000"; ctx.fillRect(-tw/2 + 10, -th/2 + 10, tw, th); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000"; ctx.lineWidth = 8;
        ctx.fillRect(-tw/2, -th/2, tw, th); ctx.strokeRect(-tw/2, -th/2, tw, th); ctx.beginPath(); 
        if(isP1) { ctx.moveTo(tw/2 - 20, 0); ctx.lineTo(tw/2 + 50, 50); ctx.lineTo(tw/2 - 40, 20); } else { ctx.moveTo(-tw/2 + 20, 0); ctx.lineTo(-tw/2 - 50, 50); ctx.lineTo(-tw/2 + 40, 20); }
        ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke(); ctx.restore(); 
        ctx.fillStyle = isP1 ? "#0055ff" : "#c0392b"; ctx.font = "italic 900 50px 'Arial Black', Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 0, 0);
        let emX = isP1 ? tw/2 + 40 : -tw/2 - 40; let emY = -th/2 - 15; let tPulse = Date.now() / 80; 
        ctx.translate(emX, emY + Math.sin(tPulse) * 15); ctx.rotate(Math.sin(tPulse * 0.5) * 0.3);
        ctx.font = "100px Arial"; ctx.fillText(emojiStr, 0, 0); ctx.font = "80px Arial"; ctx.fillText(isP1 ? "⁉️" : "🧂", -85, -65); ctx.restore();
    };
    
    let p1Pop = Math.min(1, Math.max(0, (progress - 0.2) * 8)); drawSpeechAndEmoji(w*0.5, h*0.15, window.trashTalkP1, true, window.introEmojiP1, p1Pop);
    let p2Pop = Math.min(1, Math.max(0, (progress - 0.4) * 8)); drawSpeechAndEmoji(w*0.5, h*0.85, window.trashTalkP2, false, window.introEmojiP2, p2Pop);
    
    if (progress > 0.85) {
        let flashAlpha = Math.min(1, (progress - 0.85) * 6.6); ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = `rgb(255, 0, 50)`; ctx.fillRect(0, h * Math.random(), w, 150); ctx.fillStyle = `rgb(0, 255, 255)`; ctx.fillRect(0, h * Math.random(), w, 150);
        ctx.globalAlpha = Math.min(1, flashAlpha * 1.5); ctx.fillStyle = `rgb(255, 255, 255)`; ctx.fillRect(-w, -h, w*3, h*3); ctx.globalAlpha = 1.0; 
    }
    ctx.restore(); window.ctx = originalCtx;
};

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
    if (!toast) {
        toast = document.createElement("div"); toast.id = "render-toast-noti";
        toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff0050; color: white; padding: 12px 25px; border-radius: 30px; font-family: 'Arial Black', sans-serif; font-size: 16px; z-index: 2147483647; box-shadow: 0 4px 15px rgba(255,0,80,0.5); border: 2px solid #fff; transition: opacity 0.3s; pointer-events: none;";
        document.body.appendChild(toast);
    }
    toast.innerHTML = "⏳ RENDERING VIDEO... PLEASE WAIT (DON'T CLOSE)"; toast.style.opacity = "1";
};

window.hideRenderToast = function() { let toast = document.getElementById("render-toast-noti"); if (toast) toast.style.opacity = "0"; };

// Loop Độc Lập
window._recorderLoopFunction = function() {
    if (window.isRecording) {
        window.captureFrames();
        window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
    }
};

// Xóa Hook cũ gây lag game
if (window._hookedDrawForRecorder && window.draw && window._originalDrawBeforeHook) {
    window.draw = window._originalDrawBeforeHook; 
}
if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true;
    window._originalDrawBeforeHook = window.draw; 
    window.draw = function() { if (window._originalDrawBeforeHook) window._originalDrawBeforeHook.apply(this, arguments); };
}

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.recordedChunksV = [];
    window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    
    let videoStreamV = window.recordCanvasV.captureStream(0); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0];
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 6000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } 
    catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }

    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);
    
    const p1Talks = ["Bro skipped diagonal movement 🤡", "Your Jordans are fake.", "Touch grass immediately.", "I'm boutta end your career.", "My grandma plays better 💀", "Hold this L bozo."];
    const p2Talks = ["Skill issue detected.", "I'm lagging bro I swear 📶", "Stop spamming buttons!", "Mom said it's my turn 😡", "I'll put dirt in your eye.", "You're getting uninstalled 🗑️"];
    const emos = ["🤬", "🤡", "💀", "😭", "💦", "🔥", "🥶", "📉", "🤫", "🗿", "💩"];
    const banners = ["🚨 ALERT: SWEATY TRYHARD DETECTED 🚨", "🤡 BOZO INCOMING - DO NOT ENGAGE 🤡", "⚠️ ERROR 404: SKILL NOT FOUND ⚠️", "☢️ TOXICITY LEVEL: CRITICAL ☢️"];
    const stats = ["IQ: 10", "IQ: 9999", "PING: 999ms", "SWEAT: 100%", "NOOB: TRUE", "HACKS: ON"];
    
    window.trashTalkP1 = p1Talks[Math.floor(Math.random() * p1Talks.length)]; window.trashTalkP2 = p2Talks[Math.floor(Math.random() * p2Talks.length)];
    window.introEmojiP1 = emos[Math.floor(Math.random() * emos.length)]; window.introEmojiP2 = emos[Math.floor(Math.random() * emos.length)];
    window.bannerText1 = banners[Math.floor(Math.random() * banners.length)]; window.bannerText2 = banners[Math.floor(Math.random() * banners.length)];
    window.statBadgeP1 = stats[Math.floor(Math.random() * stats.length)]; window.statBadgeP2 = stats[Math.floor(Math.random() * stats.length)];

    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window.thumbnailHoldFrames = 30; window.introHoldFrames = window.totalIntroFrames; 

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

    window.mediaRecorderV.start(); 
    window.isRecording = true;
    window._lastCaptureTime = Date.now();
    window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 
    cancelAnimationFrame(window._recordLoopId); 
    
    window.showRenderToast();
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop();
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};


window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now();
    if (now - window._lastCaptureTime < 33) return; // 30FPS Throttling
    window._lastCaptureTime = now;
    
    let ctxV = window.recordCtxV; 
    let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true;

    if (window.thumbnailHoldFrames > 0) {
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); 
        window.thumbnailHoldFrames--; renderNormalV = false; 
    } else if (window.introHoldFrames > 0) {
        let progress = 1 - (window.introHoldFrames / window.totalIntroFrames);
        if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.75) && typeof window.playSound === 'function') window.playSound(400, 'square', 0.2, 0.6);
        if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.50) && typeof window.playSound === 'function') window.playSound(300, 'square', 0.2, 0.6);
        if (window.introHoldFrames === 5 && typeof window.playSound === 'function') window.playSound(100, 'sawtooth', 0.5, 0.8, true); 
        window.drawAnimatedIntro(ctxV, 1080, 1920, true, progress); 
        window.introHoldFrames--; renderNormalV = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 35; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    // CHỈ VẼ GAME/CHAT KHI ĐÃ HẾT INTRO
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
            let bannerY = retainY; 
            ctxV.fillStyle = "#ff0055"; ctxV.fillRect(0, bannerY, 1080, 60);
            ctxV.fillStyle = "#fff"; ctxV.font = "900 35px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
            let offsetBanner = ((Date.now() / 6) % 1000) | 0; 
            for(let i = -1; i < 5; i++) { ctxV.fillText("🚨 WAIT FOR THE END ⏩ DO NOT BLINK 🚨", i*850 - offsetBanner, bannerY + 30); }

            if (audioPeak > 0.35 && Math.random() < 0.25) { 
                let re = window.retentionEmojis.find(e => !e.active);
                if (re) {
                    const emos = ["🔥", "💀", "🤯", "🥶", "💯", "📈"];
                    re.active = true; re.x = 100 + Math.random() * 880; re.y = 1920 + 50; re.v = 10 + Math.random() * 8; re.e = emos[(Math.random() * emos.length) | 0]; re.r = (Math.random() - 0.5) * 0.5; re.age = 0;
                }
            }
            for (let i = 0; i < window.retentionEmojis.length; i++) {
                let re = window.retentionEmojis[i]; if (!re.active) continue;
                re.age++; re.y -= re.v; let sway = Math.sin(re.age * 0.05) * 50; 
                ctxV.save(); ctxV.translate((re.x + sway) | 0, re.y | 0); ctxV.rotate(re.r + Math.sin(Date.now()/200)*0.2); 
                let eScale = Math.min(1, re.age * 0.1); ctxV.scale(eScale, eScale);
                ctxV.font = "90px Arial"; ctxV.globalAlpha = Math.max(0, Math.min(1, (re.y - retainY - 100) / 400)); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(re.e, 0, 0); ctxV.restore();
                if (re.y < retainY) re.active = false;
            }

            // HUD
            if (!window.hudImages) window.hudImages = {};
            const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
            let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
            let p1Hp = 0.5, p2Hp = 0.5; 

            if (window.p1) {
                const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
                p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100); let eHp = 0, eMax = window.totalEnemyMaxHp || 1, eStam = 0;
                let p1Name = "PLAYER", p1Url = "https://i.imgur.com/q3813rX.png";
                if (window.p1) { p1Name = (window.p1.className || window.p1.name || "PLAYER").toUpperCase(); if (window.classStats && window.classStats[window.p1.classId]) { p1Name = (window.classStats[window.p1.classId].className || p1Name).toUpperCase(); p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; } }
                let eName = "ENEMY", p2Url = "https://i.imgur.com/q3813rX.png";
                if (repEnemyObj) {
                    window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100);
                    eName = (repEnemyObj.className || repEnemyObj.name || "ENEMY").toUpperCase();
                    if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
                }
                let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); let maxNameWidthV = 280; let hudBaseY = splitGameHeight + 90; 
                ctxV.lineJoin = "round"; ctxV.textAlign = "left"; ctxV.textBaseline = "alphabetic";
                if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(53, hudBaseY, 107, 107, 13); else ctxV.rect(53, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img1, 53, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(53, hudBaseY, 107, 107); }
                ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; 
                ctxV.strokeText(p1Name, 180, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 180, hudBaseY + 50, maxNameWidthV);
                drawSkewedPath(ctxV, 187, hudBaseY + 73, 300, 53, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                if (p1Hp > 0) { 
                    if(!window._cachedGradients.hpP1) { window._cachedGradients.hpP1 = ctxV.createLinearGradient(187, 0, 487, 0); window._cachedGradients.hpP1.addColorStop(0, "#00f2fe"); window._cachedGradients.hpP1.addColorStop(1, "#4facfe"); }
                    drawSkewedPath(ctxV, 187, hudBaseY + 73, (300 * p1Hp) | 0, 53, true); ctxV.fillStyle = window._cachedGradients.hpP1; ctxV.fill(); 
                }
                ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(187, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(187, hudBaseY + 140, (250 * p1Stam) | 0, 20);
                if (repEnemyObj) {
                    ctxV.textAlign = "right"; 
                    if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(920, hudBaseY, 107, 107, 13); else ctxV.rect(920, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img2, 920, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(920, hudBaseY, 107, 107); }
                    ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; 
                    ctxV.strokeText(eName, 900, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 900, hudBaseY + 50, maxNameWidthV);
                    drawSkewedPath(ctxV, 580, hudBaseY + 73, 300, 53, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                    if (p2Hp > 0) { 
                        if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(580, 0, 880, 0); window._cachedGradients.hpP2.addColorStop(0, "#ff0844"); window._cachedGradients.hpP2.addColorStop(1, "#ffb199"); }
                        let eHpWidth = (300 * p2Hp) | 0; drawSkewedPath(ctxV, 580 + (300 - eHpWidth), hudBaseY + 73, eHpWidth, 53, false); ctxV.fillStyle = window._cachedGradients.hpP2; ctxV.fill(); 
                    }
                    ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(650, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(650 + (250 - ((250 * eStam) | 0)), hudBaseY + 140, (250 * eStam) | 0, 20);
                }
            }

            if (window.p1 && repEnemyObj) {
                ctxV.save(); let pollY = splitGameHeight + 315; let pollWidth = 800; let pollX = 540; ctxV.translate(pollX, pollY);
                let pulseText = 1 + Math.sin(Date.now() / 150) * 0.05; ctxV.save(); ctxV.scale(pulseText, pulseText);
                ctxV.fillStyle = "#ffeb3b"; ctxV.font = "900 22px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "bottom";
                ctxV.shadowColor = "#ffeb3b"; ctxV.shadowBlur = 8; ctxV.fillText("👇 COMMENT 'WHO WILL WIN' 👇", 0, -25); ctxV.restore();
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp));
                let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                ctxV.fillStyle = "#ff0055"; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.clip(); }
                ctxV.fillStyle = "#00f3ff"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36); ctxV.restore();
                ctxV.strokeStyle = "rgba(255,255,255,0.6)"; ctxV.lineWidth = 4;
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); } else { ctxV.strokeRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.fillStyle = "#1e293b"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill();
                ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke(); ctxV.fillStyle = "#fff"; ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
                ctxV.fillStyle = "#000"; ctxV.font = "900 20px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.fillText(`[1] PLAYER: ${Math.round(p1Pct*100)}%`, -pollWidth/2 + 20, 18); ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}% :BOSS [2]`, pollWidth/2 - 20, 18);
                ctxV.restore();
            }

            // CHAT SYSTEM
            if (!window._chatSystemInit) {
                window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; window._fakeViewers = 1204512;
                for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent(); window.precalcChatText(c, ctxV); window._liveChats.push(c); }
            }
            let chatNow = Date.now();
            if (chatNow - window._lastChatUpdate > window._nextChatDelay) {
                window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; 
                let newChat = window.generateLiveChatEvent(); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat);
                if (window._liveChats.length > 12) window._liveChats.shift(); 
                window._fakeViewers += Math.floor(Math.random() * 3000) - 1000; 
            }
            if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) {
                window._lastAlertTime = Date.now();
                let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫| 🐻| 🎤| 🪨| 🤫| 🤨| 🇺🇸| ⛳| 🍦| 🤣| 😤| 🕺| 🐉| 🦇| 🧤/g, '');
                let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} liked the stream!`, `👤 ${randomUser} started following you!`, `🎁 ${randomUser} sent a Rose!`, `🔥 ${randomUser} joined the LIVE!`];
                window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 });
            }

            let boxWidth = 960; let boxHeight = 780; let boxX = 540; let boxY = 1450; 
            let chatTopY = boxY - boxHeight/2; 
            let alertStartY = chatTopY - 20; 
            for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
                let al = window._liveAlerts[i]; al.life -= 0.015; al.yOffset += 1.2; 
                ctxV.save(); ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 1.5)); ctxV.font = "bold 24px Arial";
                let textW = ctxV.measureText(al.text).width;
                ctxV.translate(540, alertStartY - al.yOffset); 
                ctxV.fillStyle = "rgba(0, 0, 0, 0.5)"; ctxV.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctxV.lineWidth = 2;
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-textW/2 - 20, 0, textW + 40, 46, 23); ctxV.fill(); ctxV.stroke(); } 
                else { ctxV.fillRect(-textW/2 - 20, 0, textW + 40, 46); }
                ctxV.fillStyle = "#fff"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 0, 23); ctxV.restore();
                if (al.life <= 0) window._liveAlerts.splice(i, 1);
            }

            let liveBadgeX = boxX + boxWidth/2 - 70; let liveBadgeY = chatTopY - 35; 
            drawLiveBadge(ctxV, liveBadgeX, liveBadgeY, audioPeak);

            ctxV.save(); ctxV.translate(boxX, boxY);
            ctxV.fillStyle = "rgba(10, 15, 30, 0.6)"; ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; ctxV.lineWidth = 3;
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); ctxV.fill(); ctxV.stroke();
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.clip(); 
            ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 70);
            ctxV.fillStyle = "#fff"; ctxV.font = "900 36px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
            ctxV.fillText("💬 TOXIC LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 35);
            ctxV.font = "900 28px 'Arial'"; ctxV.textAlign = "right";
            ctxV.fillText("👥 " + window._fakeViewers.toLocaleString() + " VIEWERS", boxWidth/2 - 30, -boxHeight/2 + 35);

            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 70, boxWidth, boxHeight - 70); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 45; 
            ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 34px Arial";
            let headerBottomY = -boxHeight/2 + 70; 

            for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                let chat = window._liveChats[i]; 
                let nameStr = chat.name + ":"; 
                for(let l = chat.lines.length - 1; l >= 0; l--) {
                    if (currentY - lineHeight < headerBottomY - 10) break;
                    if (l === 0) {
                        ctxV.fillStyle = chat.color; ctxV.fillText(nameStr, -boxWidth/2 + 30, currentY);
                        ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY);
                    } else {
                        ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY);
                    }
                    currentY -= lineHeight; 
                }
                if (currentY - lineHeight < headerBottomY - 10) break;
                currentY -= 15; 
            }
            ctxV.restore(); 

            if (audioPeak > 0.6) {
                ctxV.strokeStyle = "rgba(255, 0, 85, 0.6)"; ctxV.lineWidth = 12;
                ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.stroke();
            }
            ctxV.restore();
            
        } else {
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            let bgGrad = ctxV.createRadialGradient(540, 960, 0, 540, 960, 1920);
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
            ctxV.fillStyle = bgGrad; ctxV.fillRect(0, 0, 1080, 1920);
            let cx = 540; let cy = 960; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; 
            let floatY = (Math.sin(window.matchEndTimer * 0.05) * 10) | 0;
            
            ctxV.fillStyle = "#ffffff"; ctxV.font = `900 65px 'Arial Black', sans-serif`; ctxV.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500 + floatY);
            ctxV.fillStyle = "#ff0050"; ctxV.font = `900 45px 'Montserrat', sans-serif`; ctxV.fillText("👇 MORE COMBOS BELOW 👇", cx, cy - 430 + floatY);
            let gridY = cy - 350 + floatY; ctxV.lineWidth = 4;
            for(let i=-1; i<=1; i++) {
                let rx = cx + i*340 - 150; ctxV.fillStyle = "#111827"; ctxV.strokeStyle = (i===0) ? "#00f3ff" : "#334155";
                ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(rx, gridY, 300, 450, 20); else ctxV.rect(rx, gridY, 300, 450); ctxV.fill(); ctxV.stroke();
                ctxV.fillStyle = "#ffffff"; ctxV.font = "900 35px Arial Black"; ctxV.textAlign = "left";
                let views = (i===-1) ? "1.2M" : (i===0) ? "3.4M" : "800K"; ctxV.fillText(`▶ ${views}`, rx + 20, gridY + 410);
            }
            ctxV.textAlign = "center"; let btnWidth = 640; let btnHeight = 160; let btnY = cy + 200 + floatY; 
            let btnPulse = 1 + (audioPeak * 0.08); ctxV.translate(cx, btnY); ctxV.scale(btnPulse, btnPulse);
            if(!window._cachedGradients.btnCTA) { window._cachedGradients.btnCTA = ctxV.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); window._cachedGradients.btnCTA.addColorStop(0, "#ff0050"); window._cachedGradients.btnCTA.addColorStop(1, "#00f2fe"); }
            ctxV.fillStyle = window._cachedGradients.btnCTA; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctxV.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctxV.fill();
            ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctxV.stroke();
            ctxV.fillStyle = "#ffffff"; ctxV.font = `900 60px 'Arial Black', sans-serif`; ctxV.fillText("✨ CREATE YOUR OWN", 0, 7);
            ctxV.restore();
        }
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); container.id = "video-list-container"; 
        container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 99999; position: relative;"; 
        let gameContainer = document.getElementById("game-container"); 
        if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); 
    }
    if (window.savedVideos.length === 0) { 
        container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 32px;">🎬 STUDIO ARCHIVE</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">No battles recorded yet. Fight to generate content!</p>`; 
        return; 
    }
    let html = `<h3 style="margin: 0 0 20px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 35px;">🎬 STUDIO ARCHIVE (${window.savedVideos.length} VIDEOS)</h3>
                <div style="display: flex; flex-direction: column; gap: 15px; max-height: 500px; overflow-y: auto; padding-right: 10px;">`;
    window.savedVideos.forEach((vid) => { 
        html += `<div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <div style="position: relative; width: 140px; height: 249px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(0,243,255,0.2);">
                        <img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span style="position: absolute; bottom: 0px; left: 0px; width: 100%; text-align: center; background: rgba(30, 215, 96, 0.95); color: #fff; font-size: 11px; padding: 5px 0px; font-weight: bold; letter-spacing: 1px;">✅ THUMBNAIL</span>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="font-weight: 900; color: #ffeb3b; font-size: 20px; text-shadow: 0 0 5px rgba(255,235,59,0.3); display: block; margin-bottom: 8px; line-height: 1.2;">${vid.viralTitle}</span>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; font-weight: 600;">
                                <img src="${vid.heroAvatar}" style="width: 20px; height: 20px; border-radius: 50%;"> 
                                <span>${vid.heroName}</span>
                                <span>•</span>
                                <span>🕒 ${vid.timestamp}</span>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                            <button onclick="window.copyToClipboard('${vid.viralTitle.replace(/'/g, "\\'")}')" style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 13px;">📋 Copy Title</button>
                            <a href="${vid.urlV}" download="[SHORT]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4); border: 1px solid rgba(255,255,255,0.3); flex: 1; justify-content: center;">🚀 Download TikTok Video</a>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: pointer;">❌ DEL</button>
                        </div>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } 
};
