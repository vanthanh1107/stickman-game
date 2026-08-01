// ==========================================
// RECORDER.JS - V67.8 MP4 GOLD STANDARD (BUTTER SMOOTH 60 FPS)
// Tối ưu Layout: Clean Game -> HUD -> Short Yellow Text -> Poll -> Smart Alerts -> Chat -> Cat 
// ĐÃ FIX LỖI TIME & METADATA CHO CAPCUT/PREMIERE
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
window._lastFrameTime = performance.now(); 
window._textLinesCache = { text: "", maxWidth: 0, lines: [] }; 
window._gridVerticalPath = null; 
window._liveAlerts = []; 
window._lastAlertTime = Date.now();

// ====================================================================
// 🎯 KHU VỰC TÙY CHỈNH: VIDEO MÈO NỀN XANH & BÌNH LUẬN 
// ====================================================================

window.CAT_GREEN_SCREEN_VIDEO = "Cat Scuba Dancing - Green Screen #scuba #cat #cats #trending #fyp.mp4"; 

window.CELEB_LIST = [
    { name: "Elon Musk 🚀", color: "#00f3ff" },
    { name: "Cristiano Ronaldo ⚽", color: "#ffeb3b" },
    { name: "IShowSpeed 🐕", color: "#ff4757" },
    { name: "MrBeast 💰", color: "#2ecc71" },
    { name: "Faker_T1 🐐", color: "#ff0055" },
    { name: "Gordon Ramsay 🍳", color: "#ffffff" },
    { name: "Lionel Messi 🐐", color: "#70a1ff" },
    { name: "Snoop Dogg 🌿", color: "#2ed573" },
    { name: "Drake 🦉", color: "#ffa502" },
    { name: "Andrew Tate 🏎️", color: "#ff7f50" }
];

window.TOXIC_COMMENTS = [
    "Bro plays like he's using a steering wheel 💀",
    "DELETE THE GAME NOW",
    "Uninstall pls 🗑️",
    "This is why aliens don't visit us 👽",
    "I could do this blindfolded 🙈",
    "Absolute garbage! Get out! 🥊",
    "Bro is literally trash 😭🗑️",
    "What color is your combo? Broke.",
    "Bro skipped the tutorial 🤡",
    "Skill issue spotted 📸",
    "My grandma has better combos",
    "Send me location. I smash him. 🦅",
    "THIS COMBO IS F***ING RAW! 🤬",
    "Bro thinks he is him 💀",
    "NAHHH WHAT WAS THAT 💀💀",
    "I stopped breathing 🥶",
    "Someone take his PC away immediately.",
    "Imagine sweating this hard and still being absolute trash at a simple game. Touch grass immediately and never come back to this app again 💀",
    "I'm billing you for my wasted time ⏰",
    "Even Jesus can't save this gameplay 🙏",
    "Bro is actively trying to get negative views 📉",
    "Are you playing with your feet? Because there is no way human hands did that.",
    "Worst gameplay I have ever seen in my entire life."
];

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

window.StoryModeAI = {
    scriptLines: [], currentLineIndex: 0, currentAudioSource: null,   
    fullText: "", displayedText: "", charIndex: 0, isTyping: false, scriptProgress: 0, viralTitle: "",

    generateScript: function(hero, enemy) { return { title: `BRO THINKS HE IS HIM 💀🤡`, lines: [] }; },
    init: function(hero, enemy) {
        let narrative = this.generateScript(hero, enemy);
        this.scriptLines = narrative.lines; this.viralTitle = narrative.title;
        this.currentLineIndex = 0; this.fullText = ""; this.displayedText = ""; this.charIndex = 0; this.isTyping = false; this.scriptProgress = 0;
    },
    playNextLine: function() {},
    stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawVTuberCommentator(ctx, x, y, audioPeak) {
    if (!window.catVideoObj) {
        window.catVideoObj = document.createElement('video');
        window.catVideoObj.src = window.CAT_GREEN_SCREEN_VIDEO;
        window.catVideoObj.loop = true;
        window.catVideoObj.muted = true; 
        window.catVideoObj.crossOrigin = "anonymous";
        window.catVideoObj.play().catch(e => console.log("Auto-play Mèo", e));

        window.catChromaCanvas = document.createElement('canvas');
        window.catChromaCanvas.width = 300; 
        window.catChromaCanvas.height = 300;
        window.catChromaCtx = window.catChromaCanvas.getContext('2d', { willReadFrequently: true });
    }

    let t = Date.now();
    ctx.save();
    
    let pulse = 1 + (audioPeak * 0.15);
    let floatY = Math.sin(t / 250) * 10;
    ctx.translate(x, y + floatY);
    ctx.scale(pulse, pulse);

    let radius = 160;

    if (window.analyserData) {
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        for (let i = 0; i < 32; i++) {
            let val = window.analyserData[i * 2] / 255;
            let barLength = 20 + (val * 80); 
            let angle = (i / 32) * Math.PI * 2 + (t/1000);
            
            ctx.strokeStyle = `hsl(${(i * 10 + t/10) % 360}, 100%, 60%)`;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * (radius + 5), Math.sin(angle) * (radius + 5));
            ctx.lineTo(Math.cos(angle) * (radius + barLength), Math.sin(angle) * (radius + barLength));
            ctx.stroke();
        }
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#0f172a";
    ctx.fill();

    ctx.shadowColor = audioPeak > 0.6 ? "#ff0055" : "#00f3ff";
    ctx.shadowBlur = 30 + (audioPeak * 50);

    ctx.lineWidth = 15;
    ctx.strokeStyle = audioPeak > 0.6 ? "#ff0055" : "#00f3ff";
    ctx.stroke();
    
    ctx.clip();
    
    if (window.catVideoObj.readyState >= 2) { 
        let vCanvas = window.catChromaCanvas;
        let vCtx = window.catChromaCtx;
        
        vCtx.drawImage(window.catVideoObj, 0, 0, vCanvas.width, vCanvas.height);
        let frameData = vCtx.getImageData(0, 0, vCanvas.width, vCanvas.height);
        let l = frameData.data.length / 4;

        for (let i = 0; i < l; i++) {
            let r = frameData.data[i * 4 + 0];
            let g = frameData.data[i * 4 + 1];
            let b = frameData.data[i * 4 + 2];
            
            if (g > 80 && g > r * 1.2 && g > b * 1.2) {
                frameData.data[i * 4 + 3] = 0; 
            }
        }
        
        vCtx.putImageData(frameData, 0, 0);
        ctx.drawImage(vCanvas, -radius, -radius, radius * 2, radius * 2);
    } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 90px 'Arial'";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("🐈", 0, -20);
        ctx.fillStyle = "#ffeb3b";
        ctx.font = "900 35px 'Arial Black'";
        ctx.fillText("LOADING...", 0, 45);
    }
    ctx.restore();

    ctx.save();
    ctx.translate(x, y + floatY + radius - 15);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 15;
    ctx.fillStyle = "#ff0000";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-70, -25, 140, 50, 15); else ctx.fillRect(-70, -25, 140, 50); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.font = "900 24px 'Arial Black'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🔴 LIVE", 0, 2);
    ctx.restore();
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
            ctx.fillStyle = `hsl(${hue1}, 100%, 15%)`; ctx.fillRect(0, 0, w, h);
            ctx.save(); ctx.translate(w/2, h/2);
            for(let i=0; i<30; i++) {
                ctx.rotate(Math.PI / 15); ctx.fillStyle = `hsl(${hue2}, 100%, 35%)`;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.max(w,h)*1.5, 100); ctx.lineTo(Math.max(w,h)*1.5, -100); ctx.fill();
            }
            ctx.restore();
            ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            for(let x=0; x<w; x+=20) { for(let y=0; y<h; y+=20) { if((x+y)%40===0) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); } } }
            ctx.globalCompositeOperation = 'source-over';
        };
        drawMemeBg(ctxH, 1920, 1080); drawMemeBg(ctxV, 1080, 1920);
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return;
            ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            for(let i=0; i<3; i++) {
                if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone);
                else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
            }
            if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone);
            else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
            ctx.restore();
        };
        drawCharSafe(ctxH, window.p1, 450, 850, 4.5, true); drawCharSafe(ctxH, e1, 1470, 850, 4.5, false);
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        const drawClickbaitProps = (ctx, w, h, isVertical) => {
            ctx.save();
            let rx = isVertical ? w/2 : w/2 + (Math.random() > 0.5 ? 200 : -200); let ry = isVertical ? h*0.4 + Math.random()*150 : h/2 + Math.random()*80;
            ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 18;
            ctx.beginPath(); ctx.ellipse(rx, ry, 90 + Math.random()*40, 135 + Math.random()*40, Math.random()*0.5, 0, Math.PI*2); ctx.stroke();
            ctx.font = "110px Arial"; ctx.fillText(rx > w/2 ? "⬅️" : "➡️", rx + (rx > w/2 ? -150 : 75), ry);
            ctx.translate(isVertical ? w*0.7 : w*0.75, isVertical ? h*0.6 : h*0.35); ctx.rotate((Math.random()-0.5)*0.5);
            ctx.font = "italic 900 80px Impact"; ctx.textAlign = "center"; ctx.lineWidth = 18; ctx.strokeStyle = "#000"; ctx.strokeText("-999,999 💢", 0,0);
            ctx.fillStyle = "#ff003c"; ctx.fillText("-999,999 💢", 0,0); ctx.fillStyle = "#fff"; ctx.fillText("-999,999 💢", -4,-4);
            ctx.restore();
        };
        drawClickbaitProps(ctxH, 1920, 1080, false); drawClickbaitProps(ctxV, 1080, 1920, true);
        const draw3DTitle = (ctx, w, h, text, isVertical) => {
            ctx.save();
            let grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, Math.max(w,h));
            grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
            ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
            ctx.translate(w/2, isVertical ? h*0.15 : h*0.15); ctx.rotate(-0.06);
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            let fontSize = isVertical ? 85 : 100; ctx.font = `italic 900 ${fontSize}px 'Arial Black', Impact`;
            let lines = [text];
            if(isVertical) { let words = text.split(" "); lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; }
            let depth = 15; let colors = [["#f1c40f", "#d35400"], ["#00f3ff", "#0055ff"], ["#ff4757", "#8b0000"]]; let clr = colors[Math.floor(Math.random() * colors.length)];
            lines.forEach((line, index) => {
                let yOffset = index * (fontSize + 10);
                ctx.lineWidth = 25; ctx.strokeStyle = "#000";
                for(let d=depth; d>0; d--) { ctx.strokeText(line, d, yOffset + d); ctx.fillStyle = clr[1]; ctx.fillText(line, d, yOffset + d); }
                ctx.strokeText(line, 0, yOffset); ctx.fillStyle = clr[0]; ctx.fillText(line, 0, yOffset); ctx.fillStyle = "#ffffff"; ctx.fillText(line, -3, yOffset - 3);
            });
            ctx.restore();
        };
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim();
        draw3DTitle(ctxH, 1920, 1080, shortTitle, false); draw3DTitle(ctxV, 1080, 1920, true);
    } catch (e) { console.error("Lỗi Bake Thumbnail:", e); }
};

window.drawAnimatedIntro = function(ctx, w, h, isVertical, progress) {
    let originalCtx = window.ctx; window.ctx = ctx;
    ctx.save();
    let zoom = 1 + (progress * 0.1); 
    ctx.translate(w/2, h/2); ctx.scale(zoom, zoom); ctx.translate(-w/2, -h/2);
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let easeOut = 1 - Math.pow(1 - Math.min(1, progress * 4.5), 3); 
    let p1TargetX = isVertical ? w*0.45 : w*0.35; let p1TargetY = isVertical ? h*0.3 : h*0.65;
    let p1StartX = isVertical ? -w*0.8 : -w*0.5; let p1X = p1StartX + (p1TargetX - p1StartX) * easeOut;
    let p2TargetX = isVertical ? w*0.55 : w*0.65; let p2TargetY = isVertical ? h*0.7 : h*0.65;
    let p2StartX = isVertical ? w*1.8 : w*1.5; let p2X = p2StartX + (p2TargetX - p2StartX) * easeOut;
    ctx.fillStyle = "#110000"; ctx.fillRect(-w, -h, w*3, h*3); 
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(Math.PI/12);
    let speedOffset = (progress * 3000) % 200;
    ctx.fillStyle = "rgba(255, 50, 50, 0.15)";
    for (let i = -w*1.5; i < w*1.5; i += 90) { ctx.fillRect(i - speedOffset, -h*1.5, 15, h*3); }
    ctx.restore();
    const drawMarquee = (yPos, text, speedMult, bgCol) => {
        ctx.save(); ctx.translate(0, yPos); ctx.rotate(isVertical ? -0.06 : -0.03);
        ctx.fillStyle = bgCol; ctx.fillRect(-w, -35, w*3, 70);
        let textOffset = (progress * 800 * speedMult) % 1200;
        ctx.fillStyle = "#000"; ctx.font = "900 45px 'Arial Black'"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        for(let j = -1; j <= 3; j++) { ctx.fillText(text, (j*1200) - textOffset, 0); }
        ctx.restore();
    };
    drawMarquee(h*0.2, window.bannerText1, 1.5, "#ffcc00"); 
    drawMarquee(h*0.8, window.bannerText2, -2.0, "#ffcc00");
    ctx.save();
    let p2Clone = Object.assign({}, e1, {x:0, y:0, scale: isVertical ? 4.7 : 6.0, state: 'cast', isFacingRight: false});
    ctx.translate(p2X, p2TargetY); ctx.scale(-1, 1);
    if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p2Clone);
    ctx.scale(-1, 1); ctx.fillStyle = "#ff4757"; ctx.font = "900 35px Arial Black"; ctx.fillText(window.statBadgeP2, -80, 50);
    ctx.restore();
    ctx.fillStyle = "rgba(0, 15, 30, 0.95)"; 
    ctx.beginPath();
    if (isVertical) { ctx.moveTo(-w,-h); ctx.lineTo(w*2,-h); ctx.lineTo(w*2, h*0.48); ctx.lineTo(-w, h*0.52); }
    else { ctx.moveTo(-w,-h); ctx.lineTo(w*0.55, -h); ctx.lineTo(w*0.45, h*2); ctx.lineTo(-w, h*2); }
    ctx.fill();
    ctx.save(); ctx.beginPath();
    if (isVertical) { ctx.moveTo(-w,-h); ctx.lineTo(w*2,-h); ctx.lineTo(w*2, h*0.48); ctx.lineTo(-w, h*0.52); }
    else { ctx.moveTo(-w,-h); ctx.lineTo(w*0.55, -h); ctx.lineTo(w*0.45, h*2); ctx.lineTo(-w, h*2); }
    ctx.clip(); 
    ctx.translate(w/2, h/2); ctx.rotate(Math.PI/12);
    ctx.fillStyle = "rgba(0, 150, 255, 0.15)";
    for (let i = -w*1.5; i < w*1.5; i += 120) { ctx.fillRect(i - speedOffset, -h*1.5, 20, h*3); }
    ctx.restore();
    ctx.save();
    let p1Clone = Object.assign({}, window.p1, {x:0, y:0, scale: isVertical ? 4.7 : 6.0, state: 'cast', isFacingRight: true});
    ctx.translate(p1X, p1TargetY); 
    if(typeof window.drawStickman === 'function') window.drawStickman(ctx, p1Clone);
    ctx.fillStyle = "#00f3ff"; ctx.font = "900 35px Arial Black"; ctx.fillText(window.statBadgeP1, -80, 50);
    ctx.restore();
    ctx.lineWidth = 20; ctx.strokeStyle = "#fff";
    ctx.beginPath();
    if (isVertical) { ctx.moveTo(-w, h*0.52 + w*0.02); ctx.lineTo(w*2, h*0.48 - w*0.02); }
    else { ctx.moveTo(w*0.55 + h*0.02, -h); ctx.lineTo(w*0.45 - h*0.02, h*2); }
    ctx.stroke();
    if (progress > 0.25 && progress < 0.4) {
        let intensity = (0.4 - progress) * 80;
        ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
    }
    const drawSpeechAndEmoji = (x, y, text, isP1, emojiStr, popProgress) => {
        if (popProgress <= 0) return;
        ctx.save(); ctx.translate(x, y);
        let bounce = popProgress < 1 ? Math.sin(popProgress * Math.PI * 1.5) * (1 - popProgress) * 0.4 + 1 : 1;
        ctx.scale(bounce, bounce);
        let tw = text.length * 28 + 100; let th = 110; 
        ctx.save(); ctx.transform(1, 0, -0.1, 1, 0, 0); 
        ctx.fillStyle = "#000"; ctx.fillRect(-tw/2 + 10, -th/2 + 10, tw, th); 
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000"; ctx.lineWidth = 8;
        ctx.fillRect(-tw/2, -th/2, tw, th); ctx.strokeRect(-tw/2, -th/2, tw, th);
        ctx.beginPath(); 
        if(isP1) { ctx.moveTo(tw/2 - 20, 0); ctx.lineTo(tw/2 + 50, 50); ctx.lineTo(tw/2 - 40, 20); }
        else { ctx.moveTo(-tw/2 + 20, 0); ctx.lineTo(-tw/2 - 50, 50); ctx.lineTo(-tw/2 + 40, 20); }
        ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke(); 
        ctx.restore(); 
        ctx.fillStyle = isP1 ? "#0055ff" : "#c0392b";
        ctx.font = "italic 900 50px 'Arial Black', Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 0);
        let emX = isP1 ? tw/2 + 40 : -tw/2 - 40; let emY = -th/2 - 15;
        let tPulse = Date.now() / 80; 
        ctx.translate(emX, emY + Math.sin(tPulse) * 15); ctx.rotate(Math.sin(tPulse * 0.5) * 0.3);
        ctx.font = "100px Arial"; ctx.fillText(emojiStr, 0, 0);
        ctx.font = "80px Arial"; ctx.fillText(isP1 ? "⁉️" : "🧂", -85, -65); 
        ctx.restore();
    };
    let p1Pop = Math.min(1, Math.max(0, (progress - 0.2) * 8)); 
    drawSpeechAndEmoji(isVertical ? w*0.5 : w*0.25, isVertical ? h*0.15 : h*0.25, window.trashTalkP1, true, window.introEmojiP1, p1Pop);
    let p2Pop = Math.min(1, Math.max(0, (progress - 0.4) * 8)); 
    drawSpeechAndEmoji(isVertical ? w*0.5 : w*0.75, isVertical ? h*0.85 : h*0.75, window.trashTalkP2, false, window.introEmojiP2, p2Pop);
    if (progress > 0.85) {
        let flashAlpha = Math.min(1, (progress - 0.85) * 6.6);
        ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = `rgb(255, 0, 50)`; ctx.fillRect(0, h * Math.random(), w, 150);
        ctx.fillStyle = `rgb(0, 255, 255)`; ctx.fillRect(0, h * Math.random(), w, 150);
        ctx.globalAlpha = Math.min(1, flashAlpha * 1.5);
        ctx.fillStyle = `rgb(255, 255, 255)`; ctx.fillRect(-w, -h, w*3, h*3);
        ctx.globalAlpha = 1.0; 
    }
    ctx.restore(); window.ctx = originalCtx;
};

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true;
    const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try {
                let source = window.audioCtx.createMediaElementSource(this);
                source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination);
                if (window.recordAnalyser) source.connect(window.recordAnalyser); 
                this._routedToRecorder = true;
            } catch (e) { }
        }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { 
            try { originalConnect.call(this, window.masterRecordDestination); if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser); } catch(e){} 
        }
        return originalConnect.apply(this, arguments);
    };
}

window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasH = document.getElementById("hiddenRecordCanvasH");
    if (!window.recordCanvasH) { window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; document.body.appendChild(window.recordCanvasH); }
    window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080; 
    window.recordCanvasH.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxH = window.recordCanvasH.getContext("2d", ctxOpts);

    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV");
    if (!window.recordCanvasV) { window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; 
    window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
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
    window.retentionParticles.forEach(p => p.active = false);
    window.retentionEmojis.forEach(e => e.active = false);
    
    let videoStreamH = window.recordCanvasH.captureStream(0); 
    let videoStreamV = window.recordCanvasV.captureStream(0); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    // [FIX LỖI QUAY LẠI LẦN 2 BỊ ĐỨNG HÌNH] - Luôn lấy Track mới mỗi khi record
    window.videoTrackH = videoStreamH.getVideoTracks()[0];
    window.videoTrackV = videoStreamV.getVideoTracks()[0];

    let combinedStreamH = new MediaStream([...videoStreamH.getVideoTracks(), ...audioTracks]);
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 8000000 }; 
    window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } 
    catch (e) { window.mediaRecorderH = new MediaRecorder(combinedStreamH); window.mediaRecorderV = new MediaRecorder(combinedStreamV); }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);
    
    const p1Talks = ["Bro skipped diagonal movement 🤡", "Your Jordans are fake.", "Touch grass immediately.", "I'm boutta end your career.", "My grandma plays better 💀", "You smell like onions.", "Hold this L bozo.", "I'm reporting you."];
    const p2Talks = ["Skill issue detected.", "I'm lagging bro I swear 📶", "Stop spamming buttons!", "Mom said it's my turn 😡", "I'll put dirt in your eye.", "You're getting uninstalled 🗑️", "Look at this clown 🤡"];
    const emos = ["🤬", "🤡", "💀", "😭", "💦", "🔥", "🥶", "📉", "🤫", "🗿", "💩"];
    const banners = ["🚨 ALERT: SWEATY TRYHARD DETECTED 🚨", "🤡 BOZO INCOMING - DO NOT ENGAGE 🤡", "⚠️ ERROR 404: SKILL NOT FOUND ⚠️", "☢️ TOXICITY LEVEL: CRITICAL ☢️"];
    const stats = ["IQ: 10", "IQ: 9999", "PING: 999ms", "SWEAT: 100%", "NOOB: TRUE", "HACKS: ON"];
    
    window.trashTalkP1 = p1Talks[Math.floor(Math.random() * p1Talks.length)];
    window.trashTalkP2 = p2Talks[Math.floor(Math.random() * p2Talks.length)];
    window.introEmojiP1 = emos[Math.floor(Math.random() * emos.length)];
    window.introEmojiP2 = emos[Math.floor(Math.random() * emos.length)];
    window.bannerText1 = banners[Math.floor(Math.random() * banners.length)];
    window.bannerText2 = banners[Math.floor(Math.random() * banners.length)];
    window.statBadgeP1 = stats[Math.floor(Math.random() * stats.length)];
    window.statBadgeP2 = stats[Math.floor(Math.random() * stats.length)];

    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window.thumbnailHoldFrames = 30; 
    window.introHoldFrames = window.totalIntroFrames; 

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) { 
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) {
                    alert("⚠️ Lỗi trích xuất video! Vui lòng F5 trang web, đợi 3 giây rồi mới bắt đầu chơi lại.");
                    return; 
                }
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
                let blobH = new Blob(window.recordedChunksH, { type: window.mediaRecorderH.mimeType }); 
                let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 

                window.savedVideos.unshift({ 
                    id: Date.now(), 
                    urlH: URL.createObjectURL(blobH), 
                    urlV: URL.createObjectURL(blobV), 
                    ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.viralTitle, 
                    safeFileName: safeFileName,
                    previewThumb: window.bakedThumbH ? window.bakedThumbH.toDataURL("image/jpeg", 0.3) : "" 
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 800); 
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    
    // [FIX QUAN TRỌNG NHẤT]: XÓA BỎ SỐ 1000 Ở ĐÂY ĐỂ TRÌNH DUYỆT TỰ ĐỘNG CHỐT THỜI LƯỢNG KHI KẾT THÚC
    window.mediaRecorderH.start(); 
    window.mediaRecorderV.start(); 

    window.isRecording = true;
    window._lastFrameTime = performance.now(); 
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 

    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.recordCtxH) { window.recordCtxH.fillStyle = "#000000"; window.recordCtxH.fillRect(0,0,1920,1080); }

    // [FIX ĐỂ CHỐT ĐUÔI VIDEO]: DỪNG TOÀN BỘ CÁC TRACK ĐỂ BÁO HIỆU CHO MEDIARECORDER BIẾT VIDEO ĐÃ KẾT THÚC
    if (window.videoTrackH) { window.videoTrackH.stop(); window.videoTrackH = null; }
    if (window.videoTrackV) { window.videoTrackV.stop(); window.videoTrackV = null; }

    if (window.mediaRecorderH && window.mediaRecorderH.state !== "inactive") { try { window.mediaRecorderH.stop(); } catch(e){} }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }

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

    let now = performance.now();
    let elapsed = now - window._lastFrameTime;
    if (elapsed < 15.5) return; 
    window._lastFrameTime = now - (elapsed % 16.66); 

    if (window.gameOver && window.matchEndTimer > 350) {
        window.stopRecording();
        return;
    }
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 
    let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxH.fillStyle = "#000000"; ctxH.fillRect(0,0,1920,1080);
    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);

    let renderNormalH = true;

    if (window.thumbnailHoldFrames > 0) {
        if (window.bakedThumbH) ctxH.drawImage(window.bakedThumbH, 0, 0, 1920, 1080);
        window.thumbnailHoldFrames--; renderNormalH = false; 
    } 
    else if (window.introHoldFrames > 0) {
        let progress = 1 - (window.introHoldFrames / window.totalIntroFrames);
        if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.75) && typeof window.playSound === 'function') window.playSound(400, 'square', 0.2, 0.6);
        if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.50) && typeof window.playSound === 'function') window.playSound(300, 'square', 0.2, 0.6);
        if (window.introHoldFrames === 5 && typeof window.playSound === 'function') window.playSound(100, 'sawtooth', 0.5, 0.8, true); 

        window.drawAnimatedIntro(ctxH, 1920, 1080, false, progress);
        window.introHoldFrames--; renderNormalH = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) {
        let shakeIntensity = (audioPeak - 0.6) * 35; 
        shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    window._glitchThrottle++;
    let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    // --- RENDER BẢN NGANG 1080P ---
    if (renderNormalH) {
        ctxH.imageSmoothingEnabled = false; 
        ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1920, 1080); 
    }

    // --- RENDER BẢN DỌC 1080P ---
    let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
    ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

    if (shouldGlitch) {
        let glitchStr = ((audioPeak - 0.75) * 30) | 0;
        ctxV.globalAlpha = 0.4; 
        ctxV.fillStyle = '#ff0000'; 
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
        ctxV.fillStyle = '#00ffff'; 
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
        ctxV.globalAlpha = 1.0; 
    }

    // ==========================================
    // KHU VỰC LƯỚI 3D KHÔNG GIAN
    // ==========================================
    let retainY = splitGameHeight; 
    let retainHeight = 1920 - retainY;
    
    if(!window._cachedGradients.bgGrid) {
        window._cachedGradients.bgGrid = ctxV.createLinearGradient(0, retainY, 0, 1920);
        window._cachedGradients.bgGrid.addColorStop(0, "#0b001a"); window._cachedGradients.bgGrid.addColorStop(1, "#3c003c");
    }
    ctxV.fillStyle = window._cachedGradients.bgGrid; 
    ctxV.fillRect(0, retainY, 1080, retainHeight); 
    
    ctxV.strokeStyle = "rgba(0, 255, 200, 0.15)"; 
    ctxV.lineWidth = 2; 
    if(!window._gridVerticalPath) {
        window._gridVerticalPath = new Path2D();
        for(let x = -20; x <= 20; x+=2) { 
            window._gridVerticalPath.moveTo(540, retainY);
            window._gridVerticalPath.lineTo(540 + x * 200, 1920);
        }
    }
    ctxV.stroke(window._gridVerticalPath);
    ctxV.beginPath(); 
    let zSpeed = (Date.now() / 15) % 20; 
    for(let y = 1; y < 30; y++) { 
        let actualY = retainY + Math.pow(y, 1.8) * 2.5 + zSpeed;
        if (actualY <= 1920) { ctxV.moveTo(0, actualY | 0); ctxV.lineTo(1080, actualY | 0); }
    }
    ctxV.stroke(); 

    if (Math.random() < 0.3) {
        let p = window.retentionParticles.find(p => !p.active);
        if (p) { p.active = true; p.x = Math.random() * 1080; p.y = 1920 + 50; p.s = Math.random() * 6 + 3; p.v = Math.random() * 8 + 4; p.h = Math.random() > 0.5 ? 300 : 190; p.age = 0; }
    }
    ctxV.fillStyle = "rgba(0, 255, 200, 0.8)";
    ctxV.beginPath(); 
    for (let i = 0; i < window.retentionParticles.length; i++) {
        let p = window.retentionParticles[i]; if (!p.active) continue;
        p.age++; p.y -= p.v; p.x += Math.sin(p.age * 0.1) * 3; 
        ctxV.rect(p.x | 0, p.y | 0, p.s | 0, p.s | 0); 
        if (p.y < retainY) p.active = false; 
    }
    ctxV.fill(); 

    // ==========================================
    // HIỂN THỊ TRONG LÚC CHƠI (Tắt khi Outro hiện)
    // ==========================================
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
                re.active = true; re.x = 100 + Math.random() * 880; re.y = 1920 + 50;
                re.v = 10 + Math.random() * 8; re.e = emos[(Math.random() * emos.length) | 0];
                re.r = (Math.random() - 0.5) * 0.5; re.age = 0;
            }
        }
        for (let i = 0; i < window.retentionEmojis.length; i++) {
            let re = window.retentionEmojis[i];
            if (!re.active) continue;
            re.age++; re.y -= re.v; let sway = Math.sin(re.age * 0.05) * 50; 
            ctxV.save(); ctxV.translate((re.x + sway) | 0, re.y | 0); ctxV.rotate(re.r + Math.sin(Date.now()/200)*0.2); 
            let eScale = Math.min(1, re.age * 0.1); ctxV.scale(eScale, eScale);
            ctxV.font = "90px Arial"; ctxV.globalAlpha = Math.max(0, Math.min(1, (re.y - retainY - 100) / 400)); 
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(re.e, 0, 0); ctxV.restore();
            if (re.y < retainY) re.active = false;
        }

        // --- THANH MÁU HUD ---
        if (!window.hudImages) window.hudImages = {};
        const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;

        let p1Hp = 0.5, p2Hp = 0.5; 

        if (window.p1) {
            const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
            
            p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); 
            let p1Stam = Math.max(0, window.p1.stamina / 100);
            let eHp = 0, eMax = window.totalEnemyMaxHp || 1, eStam = 0;
            
            let p1Name = "PLAYER", p1Url = "https://i.imgur.com/q3813rX.png";
            if (window.p1) { p1Name = (window.p1.className || window.p1.name || "PLAYER").toUpperCase(); if (window.classStats && window.classStats[window.p1.classId]) { p1Name = (window.classStats[window.p1.classId].className || p1Name).toUpperCase(); p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; } }
            
            let eName = "ENEMY", p2Url = "https://i.imgur.com/q3813rX.png";
            if (repEnemyObj) {
                window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100);
                eName = (repEnemyObj.className || repEnemyObj.name || "ENEMY").toUpperCase();
                if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
            }
            
            let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url);
            let maxNameWidthV = 280; 

            let hudBaseY = splitGameHeight + 90; // Y ~ 697
            ctxV.lineJoin = "round"; ctxV.textAlign = "left"; ctxV.textBaseline = "alphabetic";
            
            if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(53, hudBaseY, 107, 107, 13); else ctxV.rect(53, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img1, 53, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(53, hudBaseY, 107, 107); }
            ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; 
            ctxV.strokeText(p1Name, 180, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 180, hudBaseY + 50, maxNameWidthV);
            drawSkewedPath(ctxV, 187, hudBaseY + 73, 300, 53, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(187, 0, 487, 0); hpGradV.addColorStop(0, "#00f2fe"); hpGradV.addColorStop(1, "#4facfe"); drawSkewedPath(ctxV, 187, hudBaseY + 73, (300 * p1Hp) | 0, 53, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(187, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(187, hudBaseY + 140, (250 * p1Stam) | 0, 20);

            if (repEnemyObj) {
                ctxV.textAlign = "right"; 
                if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(920, hudBaseY, 107, 107, 13); else ctxV.rect(920, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img2, 920, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(920, hudBaseY, 107, 107); }
                ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; 
                ctxV.strokeText(eName, 900, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 900, hudBaseY + 50, maxNameWidthV);
                drawSkewedPath(ctxV, 580, hudBaseY + 73, 300, 53, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(580, 0, 880, 0); hpGradV2.addColorStop(0, "#ff0844"); hpGradV2.addColorStop(1, "#ffb199"); let eHpWidth = (300 * p2Hp) | 0; drawSkewedPath(ctxV, 580 + (300 - eHpWidth), hudBaseY + 73, eHpWidth, 53, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
                ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(650, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(650 + (250 - ((250 * eStam) | 0)), hudBaseY + 140, (250 * eStam) | 0, 20);
            }
        }

        // --- [NEW HOOK] THANH BÌNH CHỌN "WHO WILL WIN" ---
        if (window.p1 && repEnemyObj) {
            ctxV.save();
            let pollY = splitGameHeight + 315; // Nằm an toàn ngay bên dưới thanh thể lực (Y ~ 922)
            let pollWidth = 800; // Thu nhỏ lại chút cho thanh thoát
            let pollX = 540;
            
            ctxV.translate(pollX, pollY);
            
            // Dòng chữ kích thích Comment (Nhỏ, Gọn, Đẹp)
            let pulseText = 1 + Math.sin(Date.now() / 150) * 0.05;
            ctxV.save();
            ctxV.scale(pulseText, pulseText);
            ctxV.fillStyle = "#ffeb3b";
            ctxV.font = "900 22px 'Arial Black'"; // Giảm size chữ xuống 22px
            ctxV.textAlign = "center";
            ctxV.textBaseline = "bottom";
            ctxV.shadowColor = "#ffeb3b"; ctxV.shadowBlur = 8;
            ctxV.fillText("👇 COMMENT 'WHO WILL WIN' 👇", 0, -25);
            ctxV.restore();

            let actualP1 = Math.max(0, window.p1.hp);
            let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp));
            let total = actualP1 + actualP2;
            let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
            
            ctxV.fillStyle = "#ff0055";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); }
            else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 36); }
            
            ctxV.save();
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.clip(); }
            ctxV.fillStyle = "#00f3ff";
            ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36);
            ctxV.restore();
            
            ctxV.strokeStyle = "rgba(255,255,255,0.6)";
            ctxV.lineWidth = 4;
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); }
            else { ctxV.strokeRect(-pollWidth/2, 0, pollWidth, 36); }

            ctxV.fillStyle = "#1e293b";
            ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill();
            ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke();
            ctxV.fillStyle = "#fff";
            ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
            
            ctxV.fillStyle = "#000";
            ctxV.font = "900 20px 'Arial Black'";
            ctxV.textAlign = "left"; ctxV.fillText(`[1] PLAYER: ${Math.round(p1Pct*100)}%`, -pollWidth/2 + 20, 18);
            ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}% :BOSS [2]`, pollWidth/2 - 20, 18);
            
            ctxV.restore();
        }

        // --- KHỞI TẠO DỮ LIỆU CHAT & THÔNG BÁO ---
        if (!window._chatSystemInit) {
            window._chatSystemInit = true;
            window._liveChats = [];
            window._lastChatUpdate = Date.now();
            window._nextChatDelay = 1000; 
            window._fakeViewers = 1204512;
            
            for(let i = 0; i < 8; i++) {
                let randomCeleb = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)];
                let randomMsg = window.TOXIC_COMMENTS[Math.floor(Math.random() * window.TOXIC_COMMENTS.length)];
                window._liveChats.push({ name: randomCeleb.name, color: randomCeleb.color, msg: randomMsg });
            }
        }

        let chatNow = Date.now();
        if (chatNow - window._lastChatUpdate > window._nextChatDelay) {
            window._lastChatUpdate = chatNow;
            window._nextChatDelay = 1000 + Math.random() * 2000; 
            
            let randomCeleb = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)];
            let randomMsg = window.TOXIC_COMMENTS[Math.floor(Math.random() * window.TOXIC_COMMENTS.length)];
            
            window._liveChats.push({ name: randomCeleb.name, color: randomCeleb.color, msg: randomMsg });
            if (window._liveChats.length > 8) window._liveChats.shift();
            window._fakeViewers += Math.floor(Math.random() * 3000) - 1000; 
        }

        // --- [SỬA LỖI] THÔNG BÁO LIVE ALERTS ---
        if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) {
            window._lastAlertTime = Date.now();
            
            let randomUser = "Ai đó";
            if (window._liveChats && window._liveChats.length > 0) {
                randomUser = window._liveChats[Math.floor(Math.random() * window._liveChats.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫/g, ''); 
            } else {
                randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫/g, '');
            }

            let alertTypes = [
                `❤️ ${randomUser} đã thả tim video!`,
                `👍 ${randomUser} đã thích video!`,
                `👤 ${randomUser} vừa mới Follow bạn!`,
                `🎁 ${randomUser} đã gửi 1 Hoa Hồng!`,
                `🔥 ${randomUser} đang xem live!`
            ];
            window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 });
        }
        
        // Cố định thông báo bắt đầu trôi từ khoảng Y = 1007 (Nằm dưới thanh Bình Chọn, và trên Bảng Chat)
        let alertStartY = splitGameHeight + 400; 
        
        for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
            let al = window._liveAlerts[i];
            al.life -= 0.015; 
            al.yOffset += 1.2; 
            
            ctxV.save();
            ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 1.5));
            ctxV.font = "bold 24px Arial";
            let textW = ctxV.measureText(al.text).width;
            
            // Căn giữa màn hình hoàn hảo
            ctxV.translate(540, alertStartY - al.yOffset); 
            
            ctxV.fillStyle = "rgba(0, 0, 0, 0.5)"; 
            ctxV.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctxV.lineWidth = 2;
            
            if(ctxV.roundRect) { 
                ctxV.beginPath(); ctxV.roundRect(-textW/2 - 20, 0, textW + 40, 46, 23); 
                ctxV.fill(); ctxV.stroke(); 
            } else {
                ctxV.fillRect(-textW/2 - 20, 0, textW + 40, 46);
            }
            
            ctxV.fillStyle = "#fff";
            ctxV.textAlign = "center";
            ctxV.textBaseline = "middle";
            ctxV.fillText(al.text, 0, 23);
            ctxV.restore();
            
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        // --- KHUNG LIVE CHAT (HỖ TRỢ WORD WRAP CHUẨN XÁC) ---
        ctxV.save();
        let boxWidth = 960;
        let boxHeight = 440;
        let boxX = 540; 
        // Dời bảng chat thấp xuống để chừa chỗ cho Who Will Win Poll & Live Alerts
        let boxY = 1250; 

        ctxV.translate(boxX, boxY);
        ctxV.fillStyle = "rgba(10, 15, 30, 0.6)";
        ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)";
        ctxV.lineWidth = 3;
        ctxV.beginPath(); 
        if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); 
        else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
        ctxV.fill(); ctxV.stroke();
        
        ctxV.beginPath(); 
        if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); 
        ctxV.clip(); 

        ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 70);
        ctxV.fillStyle = "#fff"; 
        ctxV.font = "900 36px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
        ctxV.fillText("🔴 TOXIC LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 35);
        ctxV.font = "900 28px 'Arial'"; ctxV.textAlign = "right";
        ctxV.fillText("👥 " + window._fakeViewers.toLocaleString() + " VIEWERS", boxWidth/2 - 30, -boxHeight/2 + 35);

        // --- MẶT NẠ CẮT CHỮ CỦA BẢNG CHAT ---
        ctxV.save();
        ctxV.beginPath();
        // Cắt bỏ phần header đỏ (70px trên cùng) để chữ khi trôi lên sẽ tàng hình
        ctxV.rect(-boxWidth/2, -boxHeight/2 + 70, boxWidth, boxHeight - 70);
        ctxV.clip();

        let currentY = boxHeight/2 - 20; 
        let lineHeight = 45; 
        
        ctxV.textAlign = "left"; 
        ctxV.textBaseline = "bottom";
        ctxV.font = "bold 34px Arial";
        
        let headerBottomY = -boxHeight/2 + 70; 

        for (let i = window._liveChats.length - 1; i >= 0; i--) { 
            let chat = window._liveChats[i];
            let nameStr = chat.name + ":";
            let nameWidth = ctxV.measureText(nameStr).width;
            let maxMsgWidth = boxWidth - 60 - nameWidth - 10; 
            
            let words = chat.msg.split(' ');
            let lines = [];
            let currentLine = "";
            for(let n = 0; n < words.length; n++) {
                let testLine = currentLine + words[n] + " ";
                let metrics = ctxV.measureText(testLine);
                if(metrics.width > maxMsgWidth && n > 0) {
                    lines.push(currentLine.trim());
                    currentLine = words[n] + " ";
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine.trim());

            for(let l = lines.length - 1; l >= 0; l--) {
                if (currentY - lineHeight < headerBottomY - 10) break;

                if (l === 0) {
                    ctxV.fillStyle = chat.color;
                    ctxV.fillText(nameStr, -boxWidth/2 + 30, currentY);
                    ctxV.fillStyle = "#ffffff";
                    ctxV.fillText(" " + lines[l], -boxWidth/2 + 30 + nameWidth, currentY);
                } else {
                    ctxV.fillStyle = "#ffffff";
                    ctxV.fillText(" " + lines[l], -boxWidth/2 + 30 + nameWidth, currentY);
                }
                currentY -= lineHeight; 
            }
            if (currentY - lineHeight < headerBottomY - 10) break;
            currentY -= 15; 
        }
        ctxV.restore(); // Gỡ mặt nạ cắt chữ

        if (audioPeak > 0.6) {
            ctxV.strokeStyle = "rgba(255, 0, 85, 0.6)"; ctxV.lineWidth = 12;
            ctxV.beginPath(); 
            if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); 
            ctxV.stroke();
        }
        ctxV.restore();

        // --- AVATAR MÈO GREEN SCREEN ĐÁY MÀN HÌNH ---
        // Đẩy chú mèo/Avatar xuống Y=1680 cho rộng rãi
        let vtuberY = 1680; 
        drawVTuberCommentator(ctxV, 540, vtuberY, audioPeak);
        
    } else {
        
        // ==========================================
        // 6. BINGE-WATCH GRID (CHỈ HIỂN THỊ KHI OUTRO BẬT)
        // ==========================================
        let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
        let drawOutroCTA = (ctx, w, h, isMobile) => {
            ctx.save(); ctx.globalAlpha = outroAlpha;
            let bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
            ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);

            let cx = (w / 2) | 0; let cy = (h / 2) | 0;
            ctx.textAlign = "center"; ctx.textBaseline = "middle"; 
            let floatY = (Math.sin(window.matchEndTimer * 0.05) * 10) | 0;
            
            if (isMobile) {
                ctx.fillStyle = "#ffffff";
                ctx.font = `900 65px 'Arial Black', sans-serif`; 
                ctx.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500 + floatY);
                
                ctx.fillStyle = "#ff0050"; ctx.font = `900 45px 'Montserrat', sans-serif`;
                ctx.fillText("👇 MORE COMBOS BELOW 👇", cx, cy - 430 + floatY);

                let gridY = cy - 350 + floatY;
                ctx.lineWidth = 4;
                for(let i=-1; i<=1; i++) {
                    let rx = cx + i*340 - 150;
                    ctx.fillStyle = "#111827"; ctx.strokeStyle = (i===0) ? "#00f3ff" : "#334155";
                    ctx.beginPath();
                    if(ctx.roundRect) ctx.roundRect(rx, gridY, 300, 450, 20); else ctx.rect(rx, gridY, 300, 450);
                    ctx.fill(); ctx.stroke();
                    
                    ctx.fillStyle = "#ffffff"; ctx.font = "900 35px Arial Black";
                    ctx.textAlign = "left";
                    let views = (i===-1) ? "1.2M" : (i===0) ? "3.4M" : "800K";
                    ctx.fillText(`▶ ${views}`, rx + 20, gridY + 410);
                }
                
                ctx.textAlign = "center";
                let btnWidth = 640; let btnHeight = 160; let btnY = cy + 200 + floatY; 
                let btnPulse = 1 + (audioPeak * 0.08); ctx.translate(cx, btnY); ctx.scale(btnPulse, btnPulse);
                let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); btnGrad.addColorStop(0, "#ff0050"); btnGrad.addColorStop(1, "#00f2fe");
                ctx.fillStyle = btnGrad; 
                ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctx.fill();
                ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke();
                ctx.fillStyle = "#ffffff"; ctx.font = `900 60px 'Arial Black', sans-serif`; ctx.fillText("✨ CREATE YOUR OWN", 0, 7);
                
            } else {
                ctx.fillStyle = "#00f3ff";
                ctx.font = `italic 900 107px 'Arial Black', sans-serif`; ctx.fillText("CREATE YOUR OWN CHARACTER", cx, cy - 200 + floatY);
                ctx.fillStyle = "#ffeb3b";
                ctx.font = `900 73px 'Arial Black', sans-serif`; ctx.fillText("BY DESCRIBING IT!", cx, cy - 80 + floatY);
                ctx.fillStyle = "#ffffff"; ctx.font = `bold 47px 'Montserrat', sans-serif`;
                ctx.fillText("Check Link in Bio / Comments 👇", cx, cy + 27 + floatY);

                let btnWidth = 560; let btnHeight = 133; let btnY = cy + 187 + floatY;
                let btnPulse = 1 + (audioPeak * 0.08); ctx.translate(cx, btnY); ctx.scale(btnPulse, btnPulse);
                let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); btnGrad.addColorStop(0, "#00f2fe"); btnGrad.addColorStop(1, "#4facfe");
                ctx.fillStyle = btnGrad; 
                ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctx.fill();
                ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke();
                ctx.fillStyle = "#ffffff"; ctx.font = `900 47px 'Arial Black', sans-serif`; ctx.fillText("✨ TRY IT FREE", 0, 7);
            }
            ctx.restore();
        };
        
        if (renderNormalH) drawOutroCTA(ctxH, 1920, 1080, false); 
        drawOutroCTA(ctxV, 1080, 1920, true);
    }

    if (window.videoTrackH && window.videoTrackH.requestFrame) window.videoTrackH.requestFrame();
    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); container.id = "video-list-container"; 
        container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 900px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 99999; position: relative;"; 
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
                    
                    <div style="position: relative; width: 260px; height: 146px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(0,243,255,0.2);">
                        <img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span style="position: absolute; bottom: 6px; left: 6px; background: rgba(30, 215, 96, 0.85); color: #fff; font-size: 11px; padding: 3px 6px; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">✅ AUTO-THUMBNAIL EMBEDDED</span>
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
                            <a href="${vid.urlH}" download="[HORZ]_${vid.safeFileName}.${vid.ext}" style="background: #475569; color: #fff; text-decoration: none; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; display: flex; align-items: center;">📥 PC Video (16:9)</a>
                            
                            <a href="${vid.urlV}" download="[RETENTION]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4); border: 1px solid rgba(255,255,255,0.3);">🚀 TikTok (Split-Screen)</a>
                            
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: margin-left: auto;">❌ DEL</button>
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
