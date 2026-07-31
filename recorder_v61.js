// ==========================================
// RECORDER.JS - BẢN HOÀN HẢO CHO CONTENT CREATOR (V66.9 - ANTI-LAG ENGINE)
// [FIX] Khắc phục triệt để lỗi "Có tiếng không hình" do quá tải Encoder trình duyệt.
// [FIX] Smart Downscale (1080p): Nhẹ máy hơn 2.5 lần, tương thích 100% chuẩn tối đa của TikTok.
// [FIX] Video Chunking: Ép lưu gói video mỗi 1 giây, xem trên PC mượt như lụa.
// [RETAINED] Binge-Watch Fake Grid, CapCut AI Highlight, 3D Neon Grid, Action Lines.
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "mp4"; 
window.savedVideos = [];
window.filmDustY = 0; 
window.thumbnailHoldFrames = 0; 
window.introHoldFrames = 0; 
window.totalIntroFrames = 150; 
window.bakedThumbH = null; window.bakedThumbV = null; 

window.trashTalkP1 = ""; window.trashTalkP2 = "";
window.introEmojiP1 = ""; window.introEmojiP2 = "";
window.bannerText1 = ""; window.bannerText2 = "";
window.statBadgeP1 = ""; window.statBadgeP2 = "";

// Biến lưu trữ hiệu ứng Retention
window.retentionParticles = [];
window.retentionEmojis = [];

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI 
// ==========================================
window.StoryModeAI = {
    scriptLines: [], currentLineIndex: 0, currentAudioSource: null,   
    fullText: "", displayedText: "", charIndex: 0, isTyping: false, scriptProgress: 0, viralTitle: "",

    generateScript: function(hero, enemy) {
        let h = hero.toUpperCase(); let e = enemy.toUpperCase();
        const narratives = [
            { title: `NEVER play Stickman at 3 AM 💀🚫`, lines: ["This might be the most ridiculous stickman sequence ever captured.", "Most players would button mash, but this is pure mechanics.", "One missed frame and this entire run is completely dead."] },
            { title: `who let this STICKMAN COOK?! 🗣️🔥`, lines: ["Never disrespect a boss like this unless you are ready for the consequences.", "Watch what happens when you push the stickman physics to the limit.", "Notice the exact frame the dodge happens. Pure muscle memory."] },
            { title: `this stickman glitch is ILLEGAL 🤯🚫`, lines: ["I cannot believe they haven't patched this broken interaction yet.", "By canceling your attack at the exact moment, you break the game.", "Look at how fast the health bar just completely melts away."] },
            { title: `how to DESTROY any stickman boss 📉💀`, lines: ["This has to be the most disrespectful stickman combo ever pulled off.", "Look at how the hitboxes interact during this specific animation.", "You literally cannot make a single mistake or your health bar is gone."] },
            { title: `average stickman Ohio boss fight 😭🚩`, lines: ["We have all been stuck on this exact part of the game for way too long.", "You memorize the patterns, you upgrade your gear, but nothing works.", "Until you finally reach that flow state where everything just clicks."] },
            { title: `bro unlocked the FORBIDDEN technique 🤫💻`, lines: ["Here is a secret trick pro gamers use to completely dominate this fight.", "If you force the parry window, you reset their entire attack pattern.", `Watch how ${h} uses it here to completely humiliate them.`] },
            { title: `1 HP STICKMAN CLUTCH (I stopped breathing) 🚨📈`, lines: ["I want you to honestly ask yourself: would you have survived this situation?", "When your HP gets this low, the adrenaline usually makes you spam buttons.", "But the discipline to hold back and wait for the perfect opening is insane."] },
            { title: `BRO THINKS HE IS HIM 💀🤡`, lines: ["Everyone said this was an impossible matchup to win.", "But if you understand the internal stamina scaling, you can control the fight.", `Look at how ${h} is constantly three steps ahead.`] },
            { title: `they need to BAN this combo 🥶❌`, lines: ["This specific setup is considered so toxic it should be banned.", "Instead of trading damage, you create a perfect loop of invincibility frames.", "Watch the boss AI literally break trying to figure out what to do."] },
            { title: `when you finally LOCK IN 🧘‍♂️⚡`, lines: ["This is what happens when you stop playing for fun and just lock in.", "No panic rolling, no button mashing. Just pure, calculated aggression.", "This is peak performance right here."] }
        ];
        return narratives[Math.floor(Math.random() * narratives.length)];
    },

    init: function(hero, enemy) {
        let narrative = this.generateScript(hero, enemy);
        this.scriptLines = narrative.lines; this.viralTitle = narrative.title;
        this.currentLineIndex = 0; this.fullText = ""; this.displayedText = ""; this.charIndex = 0; this.isTyping = false; this.scriptProgress = 0;
    },

    playNextLine: function() {
        if (!window.isRecording || this.currentLineIndex >= this.scriptLines.length || window.gameOver) {
            this.fullText = ""; this.displayedText = ""; this.isTyping = false; return;
        }
        let textToSpeak = this.scriptLines[this.currentLineIndex];
        this.fullText = textToSpeak; this.charIndex = 0; this.displayedText = ""; this.isTyping = true;
        this.scriptProgress = (this.currentLineIndex) / this.scriptLines.length;

        let ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(textToSpeak)}`;
        let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ttsUrl)}`;
        
        if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();

        let fetchPromise = fetch(ttsUrl).catch(() => fetch(proxyUrl));
        fetchPromise
            .then(res => { if (!res.ok) throw new Error("Blocked"); return res.arrayBuffer(); })
            .then(buffer => window.audioCtx.decodeAudioData(buffer))
            .then(decodedData => {
                if (this.currentAudioSource) { try { this.currentAudioSource.stop(); } catch(e){} }
                let source = window.audioCtx.createBufferSource(); source.buffer = decodedData;
                let gainNode = window.audioCtx.createGain(); gainNode.gain.value = 1.6; 
                source.connect(gainNode); gainNode.connect(window.audioCtx.destination);
                if (window.masterRecordDestination) gainNode.connect(window.masterRecordDestination);
                if (window.recordAnalyser) gainNode.connect(window.recordAnalyser);
                this.currentAudioSource = source;
                source.onended = () => {
                    this.isTyping = false; this.currentLineIndex++;
                    if(this.currentLineIndex >= this.scriptLines.length) this.scriptProgress = 1.0;
                    setTimeout(() => { this.playNextLine(); }, 1200); 
                };
                source.start(0);
            })
            .catch(err => {
                let fallbackAudio = new Audio(proxyUrl); fallbackAudio.crossOrigin = "anonymous"; fallbackAudio.volume = 1.0;
                try { let fbSrc = window.audioCtx.createMediaElementSource(fallbackAudio); fbSrc.connect(window.masterRecordDestination); fbSrc.connect(window.audioCtx.destination); } catch(e){}
                fallbackAudio.onended = () => { this.isTyping = false; this.currentLineIndex++; if(this.currentLineIndex >= this.scriptLines.length) this.scriptProgress = 1.0; setTimeout(() => { this.playNextLine(); }, 1200); };
                fallbackAudio.play().catch(e => { setTimeout(() => { fallbackAudio.onended(); }, textToSpeak.length * 60); });
            });
    },

    stop: function() {
        if (this.currentAudioSource) { try { this.currentAudioSource.stop(); } catch(e){} this.currentAudioSource = null; }
        this.fullText = ""; this.displayedText = ""; this.isTyping = false; this.scriptProgress = 0;
    }
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ==========================================
// 🎨 THUMBNAIL MEME GENERATOR 
// ==========================================
window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbH = document.createElement('canvas'); window.bakedThumbH.width = 2560; window.bakedThumbH.height = 1440; 
        let ctxH = window.bakedThumbH.getContext('2d');
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1440; window.bakedThumbV.height = 2560; 
        let ctxV = window.bakedThumbV.getContext('2d');

        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
        let hue1 = Math.floor(Math.random() * 360); 
        let hue2 = (hue1 + 180 + Math.floor(Math.random() * 60 - 30)) % 360; 

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

        drawMemeBg(ctxH, 2560, 1440); drawMemeBg(ctxV, 1440, 2560);

        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return;
            ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            
            ctx.shadowColor = `hsl(${isFacingRight ? hue1 : hue2}, 100%, 70%)`; ctx.shadowBlur = 60;
            for(let i=0; i<3; i++) {
                if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone);
                else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
            }
            ctx.shadowBlur = 0; 
            if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone);
            else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
            ctx.restore();
        };

        drawCharSafe(ctxH, window.p1, 600, 1130, 6.0, true); drawCharSafe(ctxH, e1, 1960, 1130, 6.0, false);
        drawCharSafe(ctxV, window.p1, 720, 2130, 7.3, true); drawCharSafe(ctxV, e1, 720, 930, 7.3, false);

        const drawClickbaitProps = (ctx, w, h, isVertical) => {
            ctx.save();
            let rx = isVertical ? w/2 : w/2 + (Math.random() > 0.5 ? 250 : -250);
            let ry = isVertical ? h*0.4 + Math.random()*200 : h/2 + Math.random()*100;
            ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 25; ctx.shadowColor = "#000"; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.ellipse(rx, ry, 120 + Math.random()*50, 180 + Math.random()*50, Math.random()*0.5, 0, Math.PI*2); ctx.stroke();
            ctx.font = "150px Arial"; ctx.fillText(rx > w/2 ? "⬅️" : "➡️", rx + (rx > w/2 ? -200 : 100), ry);

            ctx.translate(isVertical ? w*0.7 : w*0.75, isVertical ? h*0.6 : h*0.35); ctx.rotate((Math.random()-0.5)*0.5);
            ctx.font = "italic 900 110px Impact"; ctx.textAlign = "center";
            ctx.lineWidth = 25; ctx.strokeStyle = "#000"; ctx.strokeText("-999,999 💢", 0,0);
            ctx.fillStyle = "#ff003c"; ctx.fillText("-999,999 💢", 0,0); ctx.fillStyle = "#fff"; ctx.fillText("-999,999 💢", -5,-5);
            ctx.restore();

            let labels = ["[BANNED]", "[WTF?!]", "GLITCH 💀", "BROKEN"];
            let lb = labels[Math.floor(Math.random()*labels.length)];
            ctx.save(); ctx.translate(isVertical ? w*0.3 : w*0.25, isVertical ? h*0.85 : h*0.75); ctx.rotate(-0.2);
            ctx.font = "italic 900 100px Impact"; ctx.textAlign = "center";
            ctx.lineWidth = 25; ctx.strokeStyle = "#000"; ctx.strokeText(lb, 0,0);
            ctx.fillStyle = "#f1c40f"; ctx.fillText(lb, 0,0); ctx.fillStyle = "#fff"; ctx.fillText(lb, -5,-5);
            ctx.restore();
        };

        drawClickbaitProps(ctxH, 2560, 1440, false); drawClickbaitProps(ctxV, 1440, 2560, true);

        const draw3DTitle = (ctx, w, h, text, isVertical) => {
            ctx.save();
            let grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, Math.max(w,h));
            grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
            ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

            ctx.translate(w/2, isVertical ? h*0.15 : h*0.15); ctx.rotate(-0.06);
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            let fontSize = isVertical ? 110 : 130; ctx.font = `italic 900 ${fontSize}px 'Arial Black', Impact`;
            
            let lines = [text];
            if(isVertical) { let words = text.split(" "); lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; }
            
            let depth = 20; let colors = [["#f1c40f", "#d35400"], ["#00f3ff", "#0055ff"], ["#ff4757", "#8b0000"]];
            let clr = colors[Math.floor(Math.random() * colors.length)];

            lines.forEach((line, index) => {
                let yOffset = index * (fontSize + 10);
                ctx.lineWidth = 35; ctx.strokeStyle = "#000";
                for(let d=depth; d>0; d--) { ctx.strokeText(line, d, yOffset + d); ctx.fillStyle = clr[1]; ctx.fillText(line, d, yOffset + d); }
                ctx.strokeText(line, 0, yOffset); ctx.fillStyle = clr[0]; ctx.fillText(line, 0, yOffset); ctx.fillStyle = "#ffffff"; ctx.fillText(line, -4, yOffset - 4);
            });
            ctx.restore();
        };

        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim();
        draw3DTitle(ctxH, 2560, 1440, shortTitle, false); draw3DTitle(ctxV, 1440, 2560, true);
    } catch (e) { console.error("Lỗi Bake Thumbnail:", e); }
};

// ==========================================
// 💥 HỆ THỐNG VẼ ANIMATED INTRO (CHỈ VẼ CHO BẢN PC)
// ==========================================
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
    for (let i = -w*1.5; i < w*1.5; i += 120) { ctx.fillRect(i - speedOffset, -h*1.5, 20, h*3); }
    ctx.restore();

    const drawMarquee = (yPos, text, speedMult, bgCol) => {
        ctx.save(); ctx.translate(0, yPos); ctx.rotate(isVertical ? -0.06 : -0.03);
        ctx.fillStyle = bgCol; ctx.fillRect(-w, -45, w*3, 90);
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
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255, 0, 50, ${flashAlpha})`; ctx.fillRect(0, h * Math.random(), w, 150);
        ctx.fillStyle = `rgba(0, 255, 255, ${flashAlpha})`; ctx.fillRect(0, h * Math.random(), w, 150);
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 1.5})`; ctx.fillRect(-w, -h, w*3, h*3);
    }
    ctx.restore(); window.ctx = originalCtx;
};

// ==========================================
// HỆ THỐNG AUTO-CAPTURE AUDIO IN-GAME
// ==========================================
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
    if (!document.getElementById("hiddenRecordCanvasH")) {
        // Thuật toán Smart Downscale: Thu nhỏ Canvas ghi hình về chuẩn 1080p giúp giảm lag 2.5 lần
        window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; 
        window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080; 
        window.recordCanvasH.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasH); window.recordCtxH = window.recordCanvasH.getContext("2d", {alpha: false});
    }
    if (!document.getElementById("hiddenRecordCanvasV")) {
        window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV"; 
        window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; 
        window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasV); window.recordCtxV = window.recordCanvasV.getContext("2d", {alpha: false});
    }
};

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    
    if (!window.recordCanvasH || !window.recordCanvasV) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }

    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    window.retentionParticles = []; window.retentionEmojis = []; 
    
    let videoStreamH = window.recordCanvasH.captureStream(60); 
    let videoStreamV = window.recordCanvasV.captureStream(60); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream(); let combinedStreamV = new MediaStream();
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    audioTracks.forEach(track => { combinedStreamH.addTrack(track); combinedStreamV.addTrack(track); });
    
    // Đã hạ Bitrate về mức chuẩn 10 Mbps để chống đứng hình khi xem lại trên máy tính
    let options = { videoBitsPerSecond: 10000000 }; 
    window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) { options = { mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', videoBitsPerSecond: 10000000 }; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options = { mimeType: 'video/mp4; codecs="avc1"', videoBitsPerSecond: 10000000 }; }
    else if (MediaRecorder.isTypeSupported('video/webm; codecs="h264"')) { options = { mimeType: 'video/webm; codecs="h264"', videoBitsPerSecond: 10000000 }; window.currentVideoExt = "webm"; }
    else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')) { options = { mimeType: 'video/webm; codecs="vp9"', videoBitsPerSecond: 10000000 }; window.currentVideoExt = "webm"; }
    else { options = { mimeType: 'video/webm; codecs="vp8"', videoBitsPerSecond: 10000000 }; window.currentVideoExt = "webm"; }
    
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
    window.thumbnailHoldFrames = 30; // 0.5s Thumbnail
    window.introHoldFrames = window.totalIntroFrames; // 2.5s Intro Manga

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) { 
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); let videoUrlH = URL.createObjectURL(blobH);
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); let videoUrlV = URL.createObjectURL(blobV);

                window.savedVideos.unshift({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, ext: window.currentVideoExt, 
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
    
    // Ép MediaRecorder lưu dữ liệu mỗi 1 giây (1000ms) để chống kẹt Keyframe trên Windows Media Player
    window.mediaRecorderH.start(1000); 
    window.mediaRecorderV.start(1000); 

    window.isRecording = true;
    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 

    // THE LOOP GLITCH: Flash trắng màn hình ở khoảnh khắc kết thúc để ẩn vết cắt ghép khi TikTok lặp lại video.
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#ffffff"; window.recordCtxV.fillRect(0,0,1440,2560); }
    if (window.recordCtxH) { window.recordCtxH.fillStyle = "#ffffff"; window.recordCtxH.fillRect(0,0,2560,1440); }

    if (window.mediaRecorderH && window.mediaRecorderH.state !== "inactive") { try { window.mediaRecorderH.requestData(); window.mediaRecorderH.stop(); } catch(e){} }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.requestData(); window.mediaRecorderV.stop(); } catch(e){} }

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

// HIỆU ỨNG TIKTOK: Tô Vàng & Phóng to từ mới nhất (CapCut Style AI Captions)
function wrapTextTikTok(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = "";
    
    for(let i=0; i<words.length; i++) {
        let testLine = currentLine + words[i] + " ";
        let metrics = ctx.measureText(testLine);
        if(metrics.width > maxWidth && i > 0) {
            lines.push(currentLine.trim());
            currentLine = words[i] + " ";
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());
    
    ctx.textAlign = "left";
    let totalWords = words.length;
    let wordCount = 0;

    for(let i=0; i<lines.length; i++) {
        let lineWords = lines[i].split(' ');
        let lineWidth = ctx.measureText(lines[i]).width;
        let startX = x - lineWidth / 2; 
        let currentX = startX;
        
        for(let j=0; j<lineWords.length; j++) {
            wordCount++;
            let w = lineWords[j];
            let isLastWord = (wordCount === totalWords && w !== "");
            
            ctx.save();
            if(isLastWord) {
                ctx.fillStyle = "#ffeb3b"; 
                ctx.shadowColor = "#ff9800";
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = "#000000";
                ctx.shadowBlur = 8;
            }
            ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
            ctx.strokeText(w, currentX | 0, (y + i * lineHeight) | 0);
            ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.fillText(w, currentX | 0, (y + i * lineHeight) | 0);
            ctx.restore();
            
            currentX += ctx.measureText(w + " ").width;
        }
    }
}

function renderMobileSafeCombo(ctx, fighter, xPos, yPos, align, isMobile) {
    if (fighter && fighter.comboHits >= 2) {
        let scale = isMobile ? 1.4 : 1; 
        let alpha = Math.max(0, fighter.comboAlpha || 1);
        let hits = fighter.comboHits;
        let rank = "D"; let rankColor = "#bdc3c7"; let rankText = "NICE";
        
        if (hits >= 4) { rank = "C"; rankColor = "#2ecc71"; rankText = "COOL!"; }
        if (hits >= 6) { rank = "B"; rankColor = "#3498db"; rankText = "BRUTAL!"; }
        if (hits >= 8) { rank = "A"; rankColor = "#9b59b6"; rankText = "AWESOME!"; }
        if (hits >= 12) { rank = "S"; rankColor = "#f1c40f"; rankText = "SAVAGE!"; }
        if (hits >= 16) { rank = "SS"; rankColor = "#e67e22"; rankText = "SICK!!"; }
        if (hits >= 20) { rank = "SSS"; rankColor = "#ff003c"; rankText = "SMOKIN' SICK!!!"; }

        ctx.save(); ctx.globalAlpha = alpha; ctx.textAlign = align;
        ctx.font = `italic 900 ${Math.floor(36 * scale)}px 'Arial Black', Impact`;
        ctx.fillStyle = fighter.isPlayer ? "#ff9f43" : "#ff4757"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 15 * scale;
        ctx.fillText(`🔥 ${hits} HITS`, xPos | 0, yPos | 0);
        ctx.font = `italic 900 ${Math.floor(26 * scale)}px 'Arial Black', Impact`; ctx.fillStyle = rankColor; ctx.shadowColor = rankColor; ctx.shadowBlur = 20 * scale;
        ctx.fillText(`${rank} - ${rankText}`, xPos | 0, (yPos + (42 * scale)) | 0); ctx.restore();
    }
}

function drawAudioVisualizer(ctx, x, y, width, height) {
    if(!window.analyserData) return;
    let numBars = 24; let barWidth = (width / numBars) - 4; let center = x;
    ctx.save();
    ctx.beginPath(); 
    for (let i = 0; i < numBars / 2; i++) {
        let barHeight = (window.analyserData[i + 2] / 255) * height; 
        if (barHeight < 5) barHeight = 5; 
        let grad = ctx.createLinearGradient(0, y, 0, y - barHeight);
        grad.addColorStop(0, "#00f3ff"); grad.addColorStop(1, "#f1c40f");
        ctx.fillStyle = grad;
        let offsetX = i * (barWidth + 4) + (barWidth/2);
        ctx.fillRect((center + offsetX) | 0, (y - barHeight) | 0, barWidth | 0, barHeight | 0); 
        ctx.fillRect((center - offsetX - barWidth) | 0, (y - barHeight) | 0, barWidth | 0, barHeight | 0);
    }
    ctx.restore();
}

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;

    if (window.gameOver && window.matchEndTimer > 350) {
        window.stopRecording();
        return;
    }
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 

    // Dùng try...finally để bảo đảm dù cho Return sớm ở đâu, hệ số Scale vẫn được Restore lại.
    ctxH.save(); ctxV.save();
    ctxH.scale(0.75, 0.75); ctxV.scale(0.75, 0.75);

    try {
        ctxH.fillStyle = `rgba(0,0,0,${Math.random() * 0.01})`; ctxH.fillRect(0,0,1,1);
        ctxV.fillStyle = `rgba(0,0,0,${Math.random() * 0.01})`; ctxV.fillRect(0,0,1,1);

        let renderNormalH = true;

        if (window.thumbnailHoldFrames > 0) {
            if (window.bakedThumbH) ctxH.drawImage(window.bakedThumbH, 0, 0, 2560, 1440);
            window.thumbnailHoldFrames--;
            renderNormalH = false; 
        } 
        else if (window.introHoldFrames > 0) {
            let progress = 1 - (window.introHoldFrames / window.totalIntroFrames);
            if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.75) && typeof window.playSound === 'function') window.playSound(400, 'square', 0.2, 0.6);
            if (window.introHoldFrames === Math.floor(window.totalIntroFrames * 0.50) && typeof window.playSound === 'function') window.playSound(300, 'square', 0.2, 0.6);
            if (window.introHoldFrames === 5 && typeof window.playSound === 'function') window.playSound(100, 'sawtooth', 0.5, 0.8, true); 

            window.drawAnimatedIntro(ctxH, 2560, 1440, false, progress);
            window.introHoldFrames--;
            renderNormalH = false; 
        }

        if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
        let audioPeak = window.analyserData[3] / 255 || 0; 
        
        let shakeX = 0, shakeY = 0;
        if (audioPeak > 0.6) {
            let shakeIntensity = (audioPeak - 0.6) * 35; 
            shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity;
        }

        // --- RENDER BẢN NGANG 2K ---
        if (renderNormalH) {
            ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 2560, 1440); 
            ctxH.imageSmoothingEnabled = false; 
            ctxH.globalCompositeOperation = 'source-over';
            ctxH.filter = 'contrast(1.15) saturate(1.15) brightness(0.95) sepia(0.1) hue-rotate(-5deg)';
            
            ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 2560, 1440); 
            ctxH.filter = 'none';
            
            if (audioPeak > 0.6) {
                let glitchStr = ((audioPeak - 0.6) * 40) | 0;
                ctxH.globalCompositeOperation = 'screen';
                ctxH.fillStyle = 'rgba(255, 0, 0, 0.4)'; 
                ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 2560 + glitchStr, 1440);
                ctxH.fillStyle = 'rgba(0, 255, 255, 0.4)'; 
                ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 2560 + glitchStr, 1440);
                ctxH.globalCompositeOperation = 'source-over';
            }
        }

        // --- RENDER BẢN DỌC 2K ---
        ctxV.fillStyle = "#07070c"; ctxV.fillRect(0, 0, 1440, 2560); 
        
        let splitGameHeight = window.canvas ? Math.floor(1440 * (window.canvas.height / window.canvas.width)) : 810;
        
        ctxV.imageSmoothingEnabled = false;
        ctxV.globalCompositeOperation = 'source-over';
        ctxV.filter = 'contrast(1.2) saturate(1.2) brightness(0.95)';
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1440, splitGameHeight); 
        ctxV.filter = 'none';

        if (audioPeak > 0.6) {
            let glitchStr = ((audioPeak - 0.6) * 30) | 0;
            ctxV.globalCompositeOperation = 'screen'; 
            ctxV.fillStyle = 'rgba(255, 0, 0, 0.4)'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1440 + glitchStr, splitGameHeight);
            ctxV.fillStyle = 'rgba(0, 255, 255, 0.4)'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1440 + glitchStr, splitGameHeight);
            ctxV.globalCompositeOperation = 'source-over';
        }

        if (audioPeak > 0.4) {
            ctxV.save(); ctxV.translate(720, (splitGameHeight / 2) | 0);
            ctxV.strokeStyle = `rgba(255, 255, 255, ${audioPeak * 0.5})`;
            ctxV.beginPath();
            let linesCount = (audioPeak * 30) | 0;
            for (let i=0; i<linesCount; i++) {
                let ang = Math.random() * Math.PI * 2;
                let inner = 200 + Math.random() * 200;
                let outer = 1200;
                ctxV.lineWidth = 1 + Math.random() * 3;
                ctxV.moveTo((Math.cos(ang)*inner)|0, (Math.sin(ang)*inner)|0);
                ctxV.lineTo((Math.cos(ang)*outer)|0, (Math.sin(ang)*outer)|0);
            }
            ctxV.stroke(); ctxV.restore();
        }

        // ==========================================
        // TRAFFIC ROUTING (MỎ NEO THỊ GIÁC ĐIỀU HƯỚNG FOLLOWER)
        // ==========================================

        if (!window.gameOver && Date.now() % 1000 < 600) {
            ctxV.save();
            ctxV.translate(1420, splitGameHeight - 40);
            ctxV.textAlign = "right"; ctxV.textBaseline = "middle";
            ctxV.font = "italic 900 35px 'Arial Black'";
            ctxV.fillStyle = "#ffeb3b"; ctxV.shadowColor = "#ff003c"; ctxV.shadowBlur = 10;
            ctxV.fillText("🔥 PART 2 ON PROFILE 👉", 0, 0);
            ctxV.restore();
        }

        if (!window.gameOver) {
            ctxV.save();
            let bouncerY = 1050 + Math.sin(Date.now() / 150) * 30; 
            ctxV.translate(1350, bouncerY); 
            ctxV.rotate(-0.1); 
            
            ctxV.fillStyle = "#00f2fe"; ctxV.shadowColor = "#00f2fe"; ctxV.shadowBlur = 20;
            ctxV.font = "900 65px 'Arial Black'"; ctxV.textAlign = "right"; ctxV.textBaseline = "middle";
            ctxV.fillText("FOLLOW ➕", -80, 0);
            
            ctxV.font = "120px Arial";
            ctxV.fillText("👉", 20, 0);
            ctxV.restore();
        }

        // ==========================================
        // 3. BACKGROUND LƯỚI KHÔNG GIAN 3D (TRUE 3D PERSPECTIVE) 
        // ==========================================
        let retainY = splitGameHeight; 
        let retainHeight = 2560 - retainY;
        
        let bgPulse = (Date.now() / 2000) % (Math.PI * 2);
        let gradBg = ctxV.createLinearGradient(0, retainY, 0, 2560);
        gradBg.addColorStop(0, "#0b001a"); 
        gradBg.addColorStop(1, `rgba(${Math.floor(60 + Math.sin(bgPulse)*30)}, 0, 60, 1)`);
        ctxV.fillStyle = gradBg; 
        ctxV.fillRect(0, retainY, 1440, retainHeight); 
        
        ctxV.strokeStyle = "rgba(0, 255, 200, 0.15)"; 
        ctxV.lineWidth = 3;
        ctxV.beginPath(); 
        
        for(let x = -20; x <= 20; x++) {
            ctxV.moveTo(720, retainY);
            ctxV.lineTo(720 + x * 200, 2560);
        }
        let zSpeed = (Date.now() / 15) % 20; 
        for(let y = 1; y < 40; y++) {
            let actualY = retainY + Math.pow(y, 1.8) * 2.5 + zSpeed;
            if (actualY <= 2560) {
                ctxV.moveTo(0, actualY | 0); ctxV.lineTo(1440, actualY | 0);
            }
        }
        ctxV.stroke(); 

        if (!window.retentionParticles) window.retentionParticles = [];
        if (Math.random() < 0.4 && window.retentionParticles.length < 40) {
            window.retentionParticles.push({
                x: Math.random() * 1440, y: 2560 + 50,
                s: Math.random() * 8 + 4, v: Math.random() * 8 + 4,
                h: Math.random() > 0.5 ? 300 : 190, 
                age: 0
            });
        }
        ctxV.globalCompositeOperation = "screen";
        ctxV.shadowBlur = 0; 
        for (let i = window.retentionParticles.length - 1; i >= 0; i--) {
            let p = window.retentionParticles[i];
            p.age++; p.y -= p.v; p.x += Math.sin(p.age * 0.1) * 3; 
            ctxV.fillStyle = `hsla(${p.h}, 100%, 65%, 0.8)`;
            ctxV.beginPath(); ctxV.arc(p.x | 0, p.y | 0, p.s, 0, Math.PI*2); ctxV.fill();
            if (p.y < retainY) window.retentionParticles.splice(i, 1); 
        }
        ctxV.globalCompositeOperation = "source-over";

        let bannerY = retainY + 25;
        ctxV.fillStyle = "#ff0055"; 
        ctxV.fillRect(0, retainY, 1440, 50);
        ctxV.fillStyle = "#fff";
        ctxV.font = "900 35px 'Arial Black'";
        ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
        let offsetBanner = ((Date.now() / 6) % 1000) | 0; 
        for(let i = -1; i < 5; i++) {
            ctxV.fillText("🚨 WAIT FOR THE END ⏩ DO NOT BLINK 🚨", i*850 - offsetBanner, bannerY);
        }

        if (!window.retentionEmojis) window.retentionEmojis = [];
        if (audioPeak > 0.35 && Math.random() < 0.25 && !window.gameOver && window.retentionEmojis.length < 15) { 
            const emos = ["🔥", "💀", "🤯", "🥶", "💯", "📈"];
            window.retentionEmojis.push({
                x: 150 + Math.random() * 1140, y: 2560 + 50,
                v: 10 + Math.random() * 8,
                e: emos[(Math.random() * emos.length) | 0],
                r: (Math.random() - 0.5) * 0.5,
                age: 0
            });
        }
        for (let i = window.retentionEmojis.length - 1; i >= 0; i--) {
            let re = window.retentionEmojis[i];
            re.age++;
            re.y -= re.v;
            let sway = Math.sin(re.age * 0.05) * 50; 
            ctxV.save();
            ctxV.translate((re.x + sway) | 0, re.y | 0);
            ctxV.rotate(re.r + Math.sin(Date.now()/200)*0.2); 
            
            let eScale = Math.min(1, re.age * 0.1); 
            ctxV.scale(eScale, eScale);
            
            ctxV.font = "90px Arial";
            ctxV.globalAlpha = Math.max(0, Math.min(1, (re.y - retainY - 100) / 400)); 
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.shadowBlur = 0;
            ctxV.fillText(re.e, 0, 0);
            ctxV.restore();
            if (re.y < retainY) window.retentionEmojis.splice(i, 1);
        }
        
        if (!window.hudImages) window.hudImages = {};
        const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;

        if (window.p1 && !window.gameOver && window.introTimer <= 120) {
            const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
            
            let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100);
            let eHp = 0, eMax = window.totalEnemyMaxHp || 1, p2Hp = 0, eStam = 0;
            let p1Name = "PLAYER", p1Url = "https://i.imgur.com/q3813rX.png";
            if (window.p1) { p1Name = (window.p1.className || window.p1.name || "PLAYER").toUpperCase(); if (window.classStats && window.classStats[window.p1.classId]) { p1Name = (window.classStats[window.p1.classId].className || p1Name).toUpperCase(); p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; } }
            let eName = "ENEMY", p2Url = "https://i.imgur.com/q3813rX.png";
            if (repEnemyObj) {
                window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100);
                eName = (repEnemyObj.className || repEnemyObj.name || "ENEMY").toUpperCase();
                if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
            }
            let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url);

            // --- HUD NGANG 2K ---
            if (renderNormalH) {
                ctxH.lineJoin = "round"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.font = "900 64px Arial"; ctxH.textAlign = "left";
                if (img1) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(93, 33, 73, 73, 8); else ctxH.rect(93, 33, 73, 73); ctxH.clip(); ctxH.drawImage(img1, 93, 33, 73, 73); ctxH.restore(); ctxH.lineWidth = 5; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(93, 33, 73, 73); }
                ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 193, 96); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 193, 96);
                drawSkewedPath(ctxH, 107, 120, 1000, 60, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 7; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
                if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(107, 0, 1107, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 107, 120, (1000 * p1Hp) | 0, 60, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
                ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(80, 193, 533, 20); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(80, 193, (533 * p1Stam) | 0, 20);

                if (repEnemyObj) {
                    ctxH.textAlign = "right"; 
                    if (img2) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(2393, 33, 73, 73, 8); else ctxH.rect(2393, 33, 73, 73); ctxH.clip(); ctxH.drawImage(img2, 2393, 33, 73, 73); ctxH.restore(); ctxH.lineWidth = 5; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(2393, 33, 73, 73); }
                    ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 2373, 96); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 2373, 96);
                    drawSkewedPath(ctxH, 1453, 120, 1000, 60, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 7; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
                    if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1453, 0, 2453, 0); hpGrad.addColorStop(0, "#c0392b"); hpGrad.addColorStop(1, "#e74c3c"); let eHpWidth = (1000 * p2Hp) | 0; drawSkewedPath(ctxH, 1453 + (1000 - eHpWidth), 120, eHpWidth, 60, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
                    ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1947, 193, 533, 20); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1947 + (533 - ((533 * eStam) | 0)), 193, (533 * eStam) | 0, 20);
                }
            }

            // --- HUD DỌC 2K ---
            let hudBaseY = splitGameHeight + 170; 

            ctxV.lineJoin = "round"; ctxV.lineWidth = 10; ctxV.strokeStyle = "#000"; ctxV.font = "900 56px Arial"; ctxV.textAlign = "left"; ctxV.textBaseline = "alphabetic";
            if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(53, hudBaseY, 107, 107, 13); else ctxV.rect(53, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img1, 53, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(53, hudBaseY, 107, 107); }
            ctxV.lineWidth = 9; ctxV.strokeStyle = "#000"; ctxV.strokeText(p1Name, 187, hudBaseY + 53); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 187, hudBaseY + 53);
            drawSkewedPath(ctxV, 187, hudBaseY + 73, 507, 53, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(187, 0, 693, 0); hpGradV.addColorStop(0, "#00f2fe"); hpGradV.addColorStop(1, "#4facfe"); drawSkewedPath(ctxV, 187, hudBaseY + 73, (507 * p1Hp) | 0, 53, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(187, hudBaseY + 140, 400, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(187, hudBaseY + 140, (400 * p1Stam) | 0, 20);

            if (repEnemyObj) {
                ctxV.textAlign = "right"; 
                if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(1280, hudBaseY, 107, 107, 13); else ctxV.rect(1280, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img2, 1280, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(1280, hudBaseY, 107, 107); }
                ctxV.lineWidth = 9; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 1253, hudBaseY + 53); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 1253, hudBaseY + 53);
                drawSkewedPath(ctxV, 747, hudBaseY + 73, 507, 53, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(747, 0, 1253, 0); hpGradV2.addColorStop(0, "#ff0844"); hpGradV2.addColorStop(1, "#ffb199"); let eHpWidth = (507 * p2Hp) | 0; drawSkewedPath(ctxV, 747 + (507 - eHpWidth), hudBaseY + 73, eHpWidth, 53, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
                ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(853, hudBaseY + 140, 400, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(853 + (400 - ((400 * eStam) | 0)), hudBaseY + 140, (400 * eStam) | 0, 20);
            }
        }

        // ==========================================
        // 4. BINGE-WATCH GRID (GIẢ LẬP TRANG CÁ NHÂN TIKTOK)
        // ==========================================
        if (window.gameOver && window.matchEndTimer > 90) { 
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
                    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
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
                    let btnWidth = 640; let btnHeight = 160; let btnY = cy + 250 + floatY;
                    let btnPulse = 1 + (audioPeak * 0.08); ctx.translate(cx, btnY); ctx.scale(btnPulse, btnPulse);
                    let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); btnGrad.addColorStop(0, "#ff0050"); btnGrad.addColorStop(1, "#00f2fe");
                    ctx.fillStyle = btnGrad; ctx.shadowColor = "#ff0050"; ctx.shadowBlur = 20 + ((Math.sin(window.matchEndTimer * 0.1) * 10) | 0);
                    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctx.fill();
                    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke(); ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff"; ctx.font = `900 60px 'Arial Black', sans-serif`; ctx.fillText("✨ CREATE YOUR OWN", 0, 7);
                    
                } else {
                    ctx.fillStyle = "#00f3ff"; ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 15;
                    ctx.font = `italic 900 107px 'Arial Black', sans-serif`; ctx.fillText("CREATE YOUR OWN CHARACTER", cx, cy - 200 + floatY);
                    ctx.fillStyle = "#ffeb3b"; ctx.shadowColor = "#ffeb3b"; ctx.shadowBlur = 15;
                    ctx.font = `900 73px 'Arial Black', sans-serif`; ctx.fillText("BY DESCRIBING IT!", cx, cy - 80 + floatY);
                    ctx.shadowBlur = 0; ctx.fillStyle = "#ffffff"; ctx.font = `bold 47px 'Montserrat', sans-serif`;
                    ctx.fillText("Check Link in Bio / Comments 👇", cx, cy + 27 + floatY);

                    let btnWidth = 560; let btnHeight = 133; let btnY = cy + 187 + floatY;
                    let btnPulse = 1 + (audioPeak * 0.08); ctx.translate(cx, btnY); ctx.scale(btnPulse, btnPulse);
                    let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); btnGrad.addColorStop(0, "#00f2fe"); btnGrad.addColorStop(1, "#4facfe");
                    ctx.fillStyle = btnGrad; ctx.shadowColor = "#00f2fe"; ctx.shadowBlur = 20 + ((Math.sin(window.matchEndTimer * 0.1) * 10) | 0);
                    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctx.fill();
                    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke(); ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff"; ctx.font = `900 47px 'Arial Black', sans-serif`; ctx.fillText("✨ TRY IT FREE", 0, 7);
                }
                ctx.restore();
            };
            
            if (renderNormalH) drawOutroCTA(ctxH, 2560, 1440, false); 
            drawOutroCTA(ctxV, 1440, 2560, true);
        }

        if (!window.gameOver) {
            if (window.StoryModeAI.isTyping) {
                window.StoryModeAI.charIndex += 0.5;
                if (window.StoryModeAI.charIndex > window.StoryModeAI.fullText.length) window.StoryModeAI.charIndex = window.StoryModeAI.fullText.length;
                window.StoryModeAI.displayedText = window.StoryModeAI.fullText.substring(0, Math.floor(window.StoryModeAI.charIndex));
            }
            if (window.StoryModeAI.displayedText.length > 0) {
                let visY = 2050; 
                drawAudioVisualizer(ctxV, 720, visY, 1000, 150); 
                if (renderNormalH) drawAudioVisualizer(ctxH, 1280, 1213, 800, 80);  
                
                let textPulse = 1 + (audioPeak * 0.1);

                ctxV.save(); ctxV.translate(720, visY + 30); ctxV.scale(textPulse, textPulse); ctxV.textAlign = "center"; ctxV.textBaseline = "top";
                ctxV.font = "900 80px 'Montserrat', 'Arial Black', sans-serif"; 
                ctxV.fillStyle = "#fff"; ctxV.strokeStyle = "#000000"; ctxV.lineWidth = 18; ctxV.lineJoin = "round";
                ctxV.shadowBlur = 0; 
                wrapTextTikTok(ctxV, window.StoryModeAI.displayedText, 0, 0, 1300, 100); 
                ctxV.restore();

                if (renderNormalH) {
                    ctxH.save(); ctxH.translate(1280, 1240); ctxH.scale(textPulse, textPulse); ctxH.textAlign = "center"; ctxH.textBaseline = "top";
                    ctxH.font = "900 55px 'Montserrat', 'Arial Black', sans-serif"; ctxH.fillStyle = "#fff"; ctxH.strokeStyle = "#000000"; ctxH.lineWidth = 11; ctxH.lineJoin = "round";
                    ctxH.shadowBlur = 0;
                    wrapTextTikTok(ctxH, window.StoryModeAI.displayedText, 0, 0, 2260, 66); 
                    ctxH.restore();
                }
            }
        }

    } finally {
        // Phục hồi lại toạ độ mặc định để chống lỗi lặp Scale
        ctxH.restore();
        ctxV.restore();
    }
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

// ==========================================
// GIAO DIỆN KHO LƯU TRỮ CHUẨN INLINE DƯỚI ĐÁY GAME
// ==========================================
window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); container.id = "video-list-container"; 
        container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 900px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8);"; 
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
