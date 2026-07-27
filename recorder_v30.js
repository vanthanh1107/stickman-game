// ==========================================
// RECORDER.JS - BẢN HOÀN HẢO CHO CONTENT CREATOR (V56.0 - ULTRA VIRAL MEME EDITION)
// [NEW] Cỗ máy sinh Thumbnail siêu cấp: Text 3D, Hào quang, Vòng đỏ clickbait, Mắt laze đỏ, Nền Manga.
// [FIXED] Sửa triệt để lỗi "Fail - No Network" khi tải video do file bị rỗng 0-byte.
// [FIXED] Thumbnail 100% được ghi thẳng vào 1.5s đầu tiên của Video ngang & dọc.
// [RETAINED] UI danh sách video giữ nguyên dưới đáy game, không tạo popup.
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];
window.filmDustY = 0; 
window.thumbnailHoldFrames = 0; // Biến đếm thời gian giữ frame Thumbnail
window.bakedThumbH = null; window.bakedThumbV = null; // Canvas chứa thumbnail tĩnh

// Khởi tạo Audio Context toàn cục và Bộ phân tích Sóng Âm
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (ULTRA VIRAL / TRENDING TITLES)
// ==========================================
window.StoryModeAI = {
    scriptLines: [], currentLineIndex: 0, currentAudioSource: null,   
    fullText: "", displayedText: "", charIndex: 0, isTyping: false, scriptProgress: 0, viralTitle: "",

    generateScript: function(hero, enemy) {
        let h = hero.toUpperCase(); let e = enemy.toUpperCase();
        const narratives = [
            { title: `lore accurate ${h} is ABSOLUTE CINEMA 🍿🥶`, lines: ["This might be the most cinematic sequence ever captured in this game.", "The choreography, the timing, everything here feels like a movie.", "Most players would just button mash, but this is a pure dance of mechanics.", "One missed frame and this entire run is completely dead.", `I cannot believe the clutch at the very end. Watch this!`] },
            { title: `who let ${h} COOK against ${e}?! 🗣️🔥`, lines: ["Never disrespect a boss like this unless you are ready for the consequences.", "Watch what happens when you push the game's mechanics to the absolute limit.", "Most players would panic here, but you just need to stay perfectly calm.", "Notice the exact frame the dodge happens. That is pure muscle memory.", `If you thought ${e} was hard, just wait until you see this ending.`] },
            { title: `is ${h} actually BROKEN right now?! 🤯🚫`, lines: ["I cannot believe they haven't patched this interaction yet.", "By canceling your attack at the exact moment of impact, you manipulate the DPS.", "The game engine actually gets confused and registers massive damage.", "Look at how fast the health bar just completely melts away.", `Use this trick with ${h} right now before the developers fix it.`] },
            { title: `maximum disrespect against ${e} 📉💀`, lines: ["This has to be the most disrespectful combo ever pulled off.", "Look at how the hitboxes interact during this specific animation.", "You literally cannot make a single mistake or your health bar is gone.", "The timing required to pull this off is completely ridiculous.", `Send this to someone who still thinks ${e} is an easy boss.`] },
            { title: `POV: average ${e} boss fight experience 😭🚩`, lines: ["We have all been stuck on this exact part of the game for way too long.", "You memorize the patterns, you upgrade your gear, but nothing works.", "Until you finally reach that flow state where everything just clicks.", "The attack telegraphs start moving in slow motion, and you see the matrix.", `Watch how satisfying it is when ${h} finally gets the perfect run.`] },
            { title: `the most ILLEGAL ${h} trick developers are hiding 🤫💻`, lines: ["Here is a secret trick pro gamers use to completely dominate this fight.", "Your brain naturally filters out repetitive visual information during long fights.", "But if you force the parry window, you reset their entire attack pattern.", "Opponents literally have no mathematical way to punish you if done correctly.", `Watch how ${h} uses it here to completely humiliate them.`] },
            { title: `my heart stopped at the end... 1 HP CLUTCH 🚨📈`, lines: ["I want you to honestly ask yourself: would you have survived this situation?", "Look at the health bar. Look at the spacing. The margin for error is zero.", "When your HP gets this low, the adrenaline usually makes you spam buttons.", "But the discipline to hold back and wait for the perfect parry window is insane.", `This is the exact difference between an average player and an absolute god.`] },
            { title: `bro really thought he was the main character 💀👑`, lines: ["Everyone said this was an impossible matchup to win.", "But if you understand the internal stamina scaling, you can control the fight.", "It creates a loop where the opponent literally cannot counter-attack.", "Average players attack when they see an opening. Pros attack before it happens.", `Look at how ${h} is constantly three steps ahead of ${e}.`] },
            { title: `they need to BAN ${h} for this combo 🥶❌`, lines: ["This specific setup is considered so toxic it should be banned.", "Instead of trading damage, you create a perfect loop of invincibility frames.", "The boss AI literally breaks trying to figure out what to do.", "Look closely at the spacing on this heavy attack.", `Watch ${e} try to retaliate, only to realize they are completely trapped.`] },
            { title: `when you finally LOCK IN against ${e} 🧘‍♂️⚡`, lines: ["This is what happens when you stop playing for fun and just lock in.", "No panic rolling, no button mashing. Just pure, calculated aggression.", "Notice how every single movement has a specific purpose.", "You don't even need to look at the health bar anymore.", `This is peak performance from ${h}.`] }
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
// 🎨 THUMBNAIL GENERATOR V56.0 - SIÊU CLICKBAIT CHUẨN YOUTUBE/TIKTOK
// ==========================================
window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    
    // 1. Tạo Canvas Ngang và Dọc
    window.bakedThumbH = document.createElement('canvas'); window.bakedThumbH.width = 1920; window.bakedThumbH.height = 1080; 
    let ctxH = window.bakedThumbH.getContext('2d');
    window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
    let ctxV = window.bakedThumbV.getContext('2d');

    let originalCtx = window.ctx; 
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    
    // 2. Random phong cách thiết kế Meme
    let hue1 = Math.floor(Math.random() * 360); 
    let hue2 = (hue1 + 150 + Math.random()*60) % 360; 
    let bgThemes = ['anime_burst', 'comic_split', 'neon_matrix'];
    let selectedTheme = bgThemes[Math.floor(Math.random() * bgThemes.length)];

    const drawBackground = (ctx, w, h, isVertical) => {
        let grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, `hsl(${hue1}, 80%, 20%)`);
        grad.addColorStop(1, `hsl(${hue2}, 80%, 15%)`);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        ctx.save();
        if (selectedTheme === 'anime_burst') {
            // Nền tia chớp Sunburst lan tỏa
            ctx.translate(w/2, h/2);
            for(let i=0; i<45; i++) {
                ctx.rotate(Math.PI / 22.5);
                ctx.fillStyle = (i % 2 === 0) ? `hsl(${hue1}, 100%, 35%)` : `hsl(${hue2}, 100%, 25%)`;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.max(w,h)*1.5, 120); ctx.lineTo(Math.max(w,h)*1.5, -120); ctx.fill();
            }
        } else if (selectedTheme === 'comic_split') {
            // Nền cắt chéo Comic Halftone
            ctx.fillStyle = `hsl(${hue1}, 90%, 35%)`; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(w,0); ctx.lineTo(0,h); ctx.fill();
            ctx.fillStyle = `hsl(${hue2}, 90%, 25%)`; ctx.beginPath(); ctx.moveTo(w,h); ctx.lineTo(w,0); ctx.lineTo(0,h); ctx.fill();
            ctx.lineWidth = 20; ctx.strokeStyle = "#fff"; ctx.beginPath(); ctx.moveTo(-100, h+100); ctx.lineTo(w+100, -100); ctx.stroke();
        } else {
            // Nền Matrix Lưới Neon
            ctx.strokeStyle = `hsl(${hue1}, 100%, 50%)`; ctx.lineWidth = 4;
            let step = isVertical ? 80 : 120;
            for(let x=0; x<w; x+=step) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
            for(let y=0; y<h; y+=step) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
        }
        ctx.restore();

        // Chèn Họa tiết Halftone / Dust chấm bi che phủ
        ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        for(let x=0; x<w; x+=20) { for(let y=0; y<h; y+=20) { if((x+y)%40===0) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); } } }
        ctx.globalCompositeOperation = 'source-over';
    };

    drawBackground(ctxH, 1920, 1080, false);
    drawBackground(ctxV, 1080, 1920, true);

    // 3. VẼ NHÂN VẬT CHUẨN XÁC VÀ PHÁT HÀO QUANG CỰC MẠNH
    let p1Poses = ['high_kick', 'uppercut', 'cast', 'dash'];
    let p2Poses = ['hook', 'axe_kick', 'breathe_fire', 'cast'];
    let sP1 = p1Poses[Math.floor(Math.random() * p1Poses.length)];
    let sP2 = p2Poses[Math.floor(Math.random() * p2Poses.length)];
    
    // Hàm siêu tối ưu vẽ nhân vật không bị lệch toạ độ
    const drawCharWithAura = (ctx, charObj, cx, cy, scale, state, isFacingRight, colorGlow) => {
        ctx.save();
        ctx.translate(cx, cy);
        if (!isFacingRight) ctx.scale(-1, 1);
        
        let clone = Object.assign({}, charObj, { x: 0, y: 0, scale: scale, state: state, isFacingRight: true }); // Reset isFacingRight vì đã scale context

        // Vẽ Lớp Hào quang (Aura) rực rỡ
        ctx.shadowColor = colorGlow; ctx.shadowBlur = 60;
        for(let i=0; i<3; i++) {
            if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); 
            else if(clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(ctx, clone);
            else if(clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(ctx, clone);
            else if(clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(ctx, clone);
            else if(typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
        }
        ctx.shadowBlur = 0;
        
        // Vẽ Nhân vật chính (Core)
        if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); 
        else if(clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(ctx, clone);
        else if(clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(ctx, clone);
        else if(clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(ctx, clone);
        else if(typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
        
        // [CLICKBAIT] Chế mắt Laze đỏ rực (NANI / Thug Life)
        if (Math.random() > 0.4) {
            let headY = -90 * scale;
            let grad = ctx.createRadialGradient(10, headY, 0, 10, headY, 40*scale);
            grad.addColorStop(0, "white"); grad.addColorStop(0.3, "red"); grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(10, headY, 40*scale, 0, Math.PI*2); ctx.fill();
            
            ctx.fillStyle = "rgba(255, 0, 0, 0.85)"; ctx.shadowColor = "red"; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.ellipse(10, headY, 200*scale, 8*scale, (Math.random()-0.5)*0.3, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    };

    // Vẽ P1 & P2 cho Bản Ngang
    window.ctx = ctxH;
    drawCharWithAura(ctxH, window.p1, 550, 950, (window.p1.scale || 1) * 4.8, sP1, true, `hsl(${hue1}, 100%, 60%)`);
    drawCharWithAura(ctxH, e1, 1370, 950, (e1.scale || 1) * 4.8, sP2, false, `hsl(${hue2}, 100%, 60%)`);

    // Vẽ P1 & P2 cho Bản Dọc
    window.ctx = ctxV;
    drawCharWithAura(ctxV, window.p1, 540, 1650, (window.p1.scale || 1) * 5.5, sP1, true, `hsl(${hue1}, 100%, 60%)`);
    drawCharWithAura(ctxV, e1, 540, 750, (e1.scale || 1) * 5.5, sP2, false, `hsl(${hue2}, 100%, 60%)`);
    window.ctx = originalCtx;

    // 4. CHÈN CÔNG CỤ CLICKBAIT (Vòng đỏ, Mũi tên, Chữ giật gân)
    const drawMemeProps = (ctx, w, h, isVertical) => {
        ctx.save();
        // Chèn Vòng tròn đỏ và mũi tên
        if (Math.random() > 0.2) {
            let cx = w/2 + (Math.random() > 0.5 ? 200 : -200);
            let cy = h/2 + (Math.random() > 0.5 ? 200 : -200);
            if(isVertical) { cx = w/2; cy = h * (Math.random() > 0.5 ? 0.3 : 0.7); }
            
            ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 25; ctx.shadowColor = "#000"; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.ellipse(cx, cy, 120 + Math.random()*60, 180 + Math.random()*80, Math.random()*Math.PI, 0, Math.PI*2); ctx.stroke();
            ctx.font = "150px Arial"; ctx.fillText("⬅️", cx + 180, cy - 80);
        }

        // Chữ Damage Nổ tung
        if (Math.random() > 0.4) {
            let cx = isVertical ? w*0.8 : w*0.7; let cy = isVertical ? h*0.7 : h*0.4;
            ctx.translate(cx, cy); ctx.rotate((Math.random()-0.5)*0.4);
            ctx.font = "italic 900 100px 'Impact'"; ctx.textAlign = "center";
            ctx.lineWidth = 20; ctx.strokeStyle = "#000"; ctx.strokeText("-999,999 💢", 0, 0);
            ctx.fillStyle = "#ff4757"; ctx.fillText("-999,999 💢", 0, 0);
            ctx.fillStyle = "#fff"; ctx.fillText("-999,999 💢", -4, -4);
            ctx.setTransform(1,0,0,1,0,0); // reset transform cho prop kế tiếp
        }

        // Nhãn dán bựa
        if (Math.random() > 0.5) {
            let stickers = ["[BANNED]", "[WTF?!]", "GLITCH", "BROKEN 💀"];
            let s = stickers[Math.floor(Math.random()*stickers.length)];
            let sx = isVertical ? w*0.5 : w*0.8; let sy = isVertical ? h*0.85 : h*0.35;
            ctx.translate(sx, sy); ctx.rotate((Math.random()-0.5)*0.5);
            ctx.font = "italic 900 100px 'Impact'"; ctx.textAlign = "center";
            ctx.lineWidth = 25; ctx.strokeStyle = "#000"; ctx.strokeText(s, 0, 0);
            ctx.fillStyle = "#ff4757"; ctx.fillText(s, 0, 0); ctx.fillStyle = "#fff"; ctx.fillText(s, -5, -5);
            ctx.setTransform(1,0,0,1,0,0);
        }

        // Khuôn mặt há hốc mồm 
        let cornerEmoji = ["😱", "🤬", "🤯", "🥶", "💀", "🚫"][Math.floor(Math.random() * 6)];
        ctx.font = isVertical ? "200px Arial" : "250px Arial"; 
        ctx.shadowColor = "#000"; ctx.shadowBlur = 30;
        ctx.fillText(cornerEmoji, isVertical ? w*0.15 : w*0.85, isVertical ? h*0.15 : h*0.85);
        ctx.restore();
    };

    drawMemeProps(ctxH, 1920, 1080, false);
    drawMemeProps(ctxV, 1080, 1920, true);

    // 5. VẼ TIÊU ĐỀ ĐÙN KHỐI 3D (3D EXTRUDED TEXT)
    const draw3DText = (ctx, text, x, y, fontSize) => {
        ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = `italic 900 ${fontSize}px 'Arial Black', Impact`;
        
        let depth = Math.floor(fontSize * 0.15); // Độ dày của khối 3D
        let colors = [["#f1c40f", "#d35400"], ["#00f3ff", "#0055ff"], ["#ff4757", "#c0392b"], ["#fff", "#95a5a6"]];
        let clr = colors[Math.floor(Math.random() * colors.length)];
        
        // Vẽ phần đùn 3D phía sau
        ctx.fillStyle = clr[1]; ctx.strokeStyle = "#000"; ctx.lineWidth = fontSize * 0.25;
        for (let i = depth; i > 0; i--) { ctx.strokeText(text, x + i, y + i); ctx.fillText(text, x + i, y + i); }
        
        // Vẽ mặt trên của chữ
        ctx.strokeText(text, x, y); 
        ctx.fillStyle = clr[0]; ctx.fillText(text, x, y);
        
        // Highlight mỏng mượt mà
        ctx.fillStyle = "#ffffff"; ctx.fillText(text, x - 5, y - 5);
        ctx.restore();
    };

    let shortTitle = (titleText || "EPIC BRAWL").replace(/#.*/g, '').trim(); // Bỏ hashtag khỏi ảnh
    
    // Tối góc Vignette cho Bản Ngang và Render Tiêu Đề
    ctxH.save();
    let gradH = ctxH.createRadialGradient(960, 540, 200, 960, 540, 1200);
    gradH.addColorStop(0, "rgba(0,0,0,0)"); gradH.addColorStop(1, "rgba(0,0,0,0.85)");
    ctxH.fillStyle = gradH; ctxH.fillRect(0,0,1920,1080);
    ctxH.translate(960, 540); ctxH.rotate(-0.08);
    draw3DText(ctxH, "VS", 0, 0, 250); 
    draw3DText(ctxH, shortTitle, 0, -380, 130);
    ctxH.restore();

    // Tối góc Vignette cho Bản Dọc và Render Tiêu Đề (Tách dòng)
    ctxV.save();
    let gradV = ctxV.createRadialGradient(540, 960, 200, 540, 960, 1200);
    gradV.addColorStop(0, "rgba(0,0,0,0)"); gradV.addColorStop(1, "rgba(0,0,0,0.85)");
    ctxV.fillStyle = gradV; ctxV.fillRect(0,0,1080,1920);
    ctxV.translate(540, 960); ctxV.rotate(-0.08);
    draw3DText(ctxV, "VS", 0, -100, 220);
    
    let words = shortTitle.split(" ");
    let line1 = words.slice(0, Math.ceil(words.length/2)).join(" "); 
    let line2 = words.slice(Math.ceil(words.length/2)).join(" ");
    draw3DText(ctxV, line1, 0, -450, 120); 
    draw3DText(ctxV, line2, 0, -320, 120);
    ctxV.restore();
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
        window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080;
        window.recordCanvasH.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasH); window.recordCtxH = window.recordCanvasH.getContext("2d");
    }
    if (!document.getElementById("hiddenRecordCanvasV")) {
        window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV"; window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920;
        window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasV); window.recordCtxV = window.recordCanvasV.getContext("2d");
    }
};

window.startRecording = function() {
    if (window.isRecording) {
        window.stopRecording(); 
    }
    
    if (!window.recordCanvasH || !window.recordCanvasV) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }

    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    let videoStreamH = window.recordCanvasH.captureStream(60); 
    let videoStreamV = window.recordCanvasV.captureStream(60); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream(); let combinedStreamV = new MediaStream();
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    audioTracks.forEach(track => { combinedStreamH.addTrack(track); combinedStreamV.addTrack(track); });
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm";
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) { options = { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4"; } 
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) { options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } 
    catch (e) { window.mediaRecorderH = new MediaRecorder(combinedStreamH); window.mediaRecorderV = new MediaRecorder(combinedStreamV); }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);
    
    // 🔥 TẠO THUMBNAIL VÀ ĐẶT THỜI GIAN HIỂN THỊ TRONG VIDEO LÀ 90 frames = 1.5s
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window.thumbnailHoldFrames = 90; 

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
                    previewThumb: window.bakedThumbH ? window.bakedThumbH.toDataURL("image/jpeg", 0.5) : ""
                });
                
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 500); 
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    
    // [FIX TRỌNG TÂM] Ép trình duyệt xả file video vào bộ nhớ mỗi 1 giây để chống mất file
    window.mediaRecorderH.start(1000); 
    window.mediaRecorderV.start(1000); 

    window.isRecording = true;
    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 

    if (window.mediaRecorderH && window.mediaRecorderH.state !== "inactive") {
        try { window.mediaRecorderH.stop(); } catch(e){ console.error(e); }
    }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") {
        try { window.mediaRecorderV.stop(); } catch(e){ console.error(e); }
    }

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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' '); let line = '';
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '; let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.shadowColor = "#000"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3; ctx.strokeText(line, x, y);
            ctx.shadowColor = "#f1c40f"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.fillText(line, x, y);
            line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.shadowColor = "#000"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3; ctx.strokeText(line, x, y);
    ctx.shadowColor = "#f1c40f"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.fillText(line, x, y);
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
        ctx.font = `italic 900 ${28 * scale}px 'Arial Black', Impact`;
        ctx.fillStyle = fighter.isPlayer ? "#ff9f43" : "#ff4757"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10 * scale;
        ctx.fillText(`🔥 ${hits} HITS`, xPos, yPos);
        ctx.font = `italic 900 ${20 * scale}px 'Arial Black', Impact`; ctx.fillStyle = rankColor; ctx.shadowColor = rankColor; ctx.shadowBlur = 15 * scale;
        ctx.fillText(`${rank} - ${rankText}`, xPos, yPos + (32 * scale)); ctx.restore();
    }
}

function drawAudioVisualizer(ctx, x, y, width, height) {
    if(!window.analyserData) return;
    let numBars = 24; let barWidth = (width / numBars) - 4; let center = x;
    ctx.save();
    for (let i = 0; i < numBars / 2; i++) {
        let barHeight = (window.analyserData[i + 2] / 255) * height; 
        if (barHeight < 5) barHeight = 5; 
        let grad = ctx.createLinearGradient(0, y, 0, y - barHeight);
        grad.addColorStop(0, "#00f3ff"); grad.addColorStop(1, "#f1c40f");
        ctx.fillStyle = grad;
        let offsetX = i * (barWidth + 4) + (barWidth/2);
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(center + offsetX, y - barHeight, barWidth, barHeight, 5); ctx.fill(); } else { ctx.fillRect(center + offsetX, y - barHeight, barWidth, barHeight); }
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(center - offsetX - barWidth, y - barHeight, barWidth, barHeight, 5); ctx.fill(); } else { ctx.fillRect(center - offsetX - barWidth, y - barHeight, barWidth, barHeight); }
    }
    ctx.restore();
}

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;

    // 🔥 [AUTO CUT] TỰ ĐỘNG TẮT RECORD SAU KHI K.O Khoảng 2 giây
    if (window.gameOver && window.matchEndTimer > 120) {
        window.stopRecording();
        return;
    }
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 

    // 🔥 XỬ LÝ NHÚNG THUMBNAIL TRỰC TIẾP VÀO VIDEO (1.5 GIÂY ĐẦU TIÊN LÀ ẢNH MEME CỰC ĐỈNH)
    if (window.thumbnailHoldFrames > 0) {
        if (window.bakedThumbH) ctxH.drawImage(window.bakedThumbH, 0, 0);
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0);
        
        // Hiệu ứng Fade out (Mờ dần nháy sang game play)
        if (window.thumbnailHoldFrames < 15) {
            let fadeAlpha = 1 - (window.thumbnailHoldFrames / 15);
            ctxH.fillStyle = `rgba(255,255,255,${fadeAlpha})`; ctxH.fillRect(0,0,1920,1080);
            ctxV.fillStyle = `rgba(255,255,255,${fadeAlpha})`; ctxV.fillRect(0,0,1080,1920);
        }
        
        window.thumbnailHoldFrames--;
        return; 
    }

    // TỪ SAU 1.5s, THUẬT TOÁN CAPTURE GAME PLAY BÌNH THƯỜNG
    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) {
        let shakeIntensity = (audioPeak - 0.6) * 35; 
        shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); 
    ctxH.imageSmoothingEnabled = false; 
    
    ctxH.filter = 'contrast(1.15) saturate(1.15) brightness(0.95) sepia(0.1) hue-rotate(-5deg)';
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX, shakeY, 1920, 1080); 
    
    ctxH.globalCompositeOperation = 'screen'; ctxH.globalAlpha = 0.15 + (audioPeak * 0.1); ctxH.filter = 'blur(10px) contrast(1.5)';
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX, shakeY, 1920, 1080);
    ctxH.filter = 'none'; ctxH.globalAlpha = 1.0; ctxH.globalCompositeOperation = 'source-over';

    ctxV.fillStyle = "#0a0a14"; ctxV.fillRect(0, 0, 1080, 1920); 
    ctxV.imageSmoothingEnabled = false;

    ctxV.filter = 'contrast(1.2) saturate(1.2) brightness(0.95) sepia(0.15) hue-rotate(-5deg)';
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420 + shakeX, 420 + shakeY, 1920, 1080); 

    ctxV.globalCompositeOperation = 'screen'; ctxV.globalAlpha = 0.2 + (audioPeak * 0.15); ctxV.filter = 'blur(12px) contrast(1.5)';
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420 + shakeX, 420 + shakeY, 1920, 1080);
    ctxV.filter = 'none'; ctxV.globalAlpha = 1.0; ctxV.globalCompositeOperation = 'source-over';
    
    if (!window.hudImages) window.hudImages = {};
    const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
    let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;

    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h); } else { ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
        
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

        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.font = "900 48px Arial"; ctxH.textAlign = "left";
        if (img1) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(70, 25, 55, 55, 6); else ctxH.rect(70, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img1, 70, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(70, 25, 55, 55); }
        ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 145, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 145, 72);
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);

        if (repEnemyObj) {
            ctxH.textAlign = "right"; 
            if (img2) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(1795, 25, 55, 55, 6); else ctxH.rect(1795, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img2, 1795, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(1795, 25, 55, 55); }
            ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1780, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1780, 72);
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, "#c0392b"); hpGrad.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxH, 1090 + (750 - eHpWidth), 90, eHpWidth, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }

        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px Arial"; ctxV.textAlign = "left";
        if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(40, 450, 80, 80, 10); else ctxV.rect(40, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img1, 40, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(40, 450, 80, 80); }
        ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(p1Name, 140, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 140, 490);
        drawSkewedPath(ctxV, 140, 505, 380, 40, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
        if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(140, 0, 520, 0); hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxV, 140, 505, 380 * p1Hp, 40, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
        ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(140, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(140, 555, 300 * p1Stam, 15);

        if (repEnemyObj) {
            ctxV.textAlign = "right"; 
            if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(960, 450, 80, 80, 10); else ctxV.rect(960, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img2, 960, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(960, 450, 80, 80); }
            ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 940, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 940, 490);
            drawSkewedPath(ctxV, 560, 505, 380, 40, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(560, 0, 940, 0); hpGradV2.addColorStop(0, "#c0392b"); hpGradV2.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxV, 560 + (380 - eHpWidth), 505, eHpWidth, 40, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(640, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(640 + (300 - (300 * eStam)), 555, 300 * eStam, 15);
        }
    }

    if (!window.gameOver) {
        renderMobileSafeCombo(ctxH, window.p1, 80, 190, "left", false);
        let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; });
        renderMobileSafeCombo(ctxH, maxEnemyCombo, 1840, 190, "right", false);

        renderMobileSafeCombo(ctxV, window.p1, 140, 600, "left", true);
        renderMobileSafeCombo(ctxV, maxEnemyCombo, 940, 600, "right", true);
        
        ctxV.save(); ctxV.translate(540, 240); let subScale = 1 + (audioPeak * 0.12); ctxV.scale(subScale, subScale);
        ctxV.fillStyle = "#ff0000"; ctxV.shadowColor = "rgba(255,0,0,0.8)"; ctxV.shadowBlur = 20;
        ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-200, -45, 400, 90, 45); else ctxV.rect(-200, -45, 400, 90); ctxV.fill();
        ctxV.fillStyle = "#ffffff"; ctxV.font = "900 42px 'Montserrat', 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
        ctxV.shadowBlur = 0; ctxV.fillText("▶ SUBSCRIBE", 0, 4); ctxV.restore();
    }
    
    if (window.gameOver && window.matchEndTimer > 90) { 
        let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
        let drawOutroCTA = (ctx, w, h, isMobile) => {
            ctx.save(); ctx.globalAlpha = outroAlpha;
            let bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.85)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
            ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);

            let cx = w / 2; let cy = h / 2;
            ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#00f3ff"; ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 25;
            let floatY = Math.sin(window.matchEndTimer * 0.05) * 10;
            
            if (isMobile) {
                ctx.font = `italic 900 65px 'Arial Black', sans-serif`; ctx.fillText("CREATE YOUR OWN", cx, cy - 250 + floatY);
                ctx.fillStyle = "#ffeb3b"; ctx.shadowColor = "#ffeb3b"; ctx.fillText("CHARACTER", cx, cy - 170 + floatY);
                ctx.fillStyle = "#fff"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
                ctx.font = `900 45px 'Arial Black', sans-serif`; ctx.fillText("BY DESCRIBING IT!", cx, cy - 90 + floatY);
            } else {
                ctx.font = `italic 900 80px 'Arial Black', sans-serif`; ctx.fillText("CREATE YOUR OWN CHARACTER", cx, cy - 150 + floatY);
                ctx.fillStyle = "#ffeb3b"; ctx.shadowColor = "#ffeb3b"; ctx.shadowBlur = 15;
                ctx.font = `900 55px 'Arial Black', sans-serif`; ctx.fillText("BY DESCRIBING IT!", cx, cy - 60 + floatY);
            }

            ctx.shadowBlur = 0; ctx.fillStyle = "#ffffff"; ctx.font = `bold ${isMobile ? 40 : 35}px 'Montserrat', sans-serif`;
            ctx.fillText("Check Link in Bio / Comments 👇", cx, cy + 20 + floatY);

            let btnWidth = isMobile ? 480 : 420; let btnHeight = isMobile ? 120 : 100; let btnY = cy + 140 + floatY;
            let btnPulse = 1 + (audioPeak * 0.08); ctx.translate(cx, btnY); ctx.scale(btnPulse, btnPulse);
            let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); btnGrad.addColorStop(0, "#ff003c"); btnGrad.addColorStop(1, "#ff4757");
            ctx.fillStyle = btnGrad; ctx.shadowColor = "#ff003c"; ctx.shadowBlur = 30 + Math.sin(window.matchEndTimer * 0.1) * 10;
            ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke(); ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff"; ctx.font = `900 ${isMobile ? 45 : 35}px 'Arial Black', sans-serif`; ctx.fillText("✨ TRY IT FREE", 0, 5);
            ctx.restore();
        };
        drawOutroCTA(ctxH, 1920, 1080, false); drawOutroCTA(ctxV, 1080, 1920, true);
    }

    if (!window.gameOver) {
        if (window.StoryModeAI.isTyping) {
            window.StoryModeAI.charIndex += 0.5;
            if (window.StoryModeAI.charIndex > window.StoryModeAI.fullText.length) window.StoryModeAI.charIndex = window.StoryModeAI.fullText.length;
            window.StoryModeAI.displayedText = window.StoryModeAI.fullText.substring(0, Math.floor(window.StoryModeAI.charIndex));
        }
        if (window.StoryModeAI.displayedText.length > 0) {
            drawAudioVisualizer(ctxV, 540, 1580, 600, 80); drawAudioVisualizer(ctxH, 960, 910, 600, 60);  
            let textPulse = 1 + (audioPeak * 0.1);

            ctxV.save(); ctxV.translate(540, 1600); ctxV.scale(textPulse, textPulse); ctxV.textAlign = "center"; ctxV.textBaseline = "top";
            ctxV.font = "900 45px 'Montserrat', 'Arial Black', sans-serif"; ctxV.fillStyle = "#fff"; ctxV.strokeStyle = "#000000"; ctxV.lineWidth = 10; ctxV.lineJoin = "round";
            wrapText(ctxV, window.StoryModeAI.displayedText, 0, 0, 950, 60); ctxV.restore();

            ctxH.save(); ctxH.translate(960, 930); ctxH.scale(textPulse, textPulse); ctxH.textAlign = "center"; ctxH.textBaseline = "top";
            ctxH.font = "900 40px 'Montserrat', 'Arial Black', sans-serif"; ctxH.fillStyle = "#fff"; ctxH.strokeStyle = "#000000"; ctxH.lineWidth = 8; ctxH.lineJoin = "round";
            wrapText(ctxH, window.StoryModeAI.displayedText, 0, 0, 1700, 50); ctxH.restore();
        }
        let progressWidthV = 1080 * window.StoryModeAI.scriptProgress;
        ctxV.save(); ctxV.fillStyle = "rgba(255,255,255,0.1)"; ctxV.fillRect(0, 1910, 1080, 10); 
        let gradV = ctxV.createLinearGradient(0, 0, progressWidthV, 0); gradV.addColorStop(0, "#00f3ff"); gradV.addColorStop(1, "#f1c40f");
        ctxV.fillStyle = gradV; ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 15; ctxV.fillRect(0, 1910, progressWidthV, 10); ctxV.restore();

        let progressWidthH = 1920 * window.StoryModeAI.scriptProgress;
        ctxH.save(); ctxH.fillStyle = "rgba(255,255,255,0.1)"; ctxH.fillRect(0, 1070, 1920, 10);
        let gradH = ctxH.createLinearGradient(0, 0, progressWidthH, 0); gradH.addColorStop(0, "#00f3ff"); gradH.addColorStop(1, "#f1c40f");
        ctxH.fillStyle = gradH; ctxH.shadowColor = "#00f3ff"; ctxH.shadowBlur = 15; ctxH.fillRect(0, 1070, progressWidthH, 10); ctxH.restore();
    }

    window.filmDustY += 1.5;
    let drawCinematicEnhancements = (ctx, w, h) => {
        ctx.save();
        if (audioPeak > 0.7) {
            ctx.globalCompositeOperation = 'screen';
            let flareIntensity = (audioPeak - 0.7) * 3.3; 
            let flareGrad = ctx.createLinearGradient(0, h/2, w, h/2);
            flareGrad.addColorStop(0, "rgba(0, 200, 255, 0)"); 
            flareGrad.addColorStop(0.5, `rgba(0, 240, 255, ${flareIntensity})`);
            flareGrad.addColorStop(1, "rgba(0, 200, 255, 0)");
            ctx.fillStyle = flareGrad;
            ctx.fillRect(0, h/2 - 15 + shakeY, w, 30);
            ctx.fillRect(0, h/2 - 3 + shakeY, w, 6);
            ctx.globalCompositeOperation = 'source-over';
        }

        let vig = ctx.createRadialGradient(w/2, h/2, h*0.35, w/2, h/2, h*0.85);
        vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.75)");
        ctx.fillStyle = vig; ctx.fillRect(0,0,w,h);

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; ctx.shadowBlur = 6; ctx.shadowColor = "#fff";
        for(let i=0; i<40; i++) {
            let px = (Math.sin(Date.now()/1200 + i) * w + w) % w;
            let py = (Math.cos(Date.now()/900 + i) * h + h - window.filmDustY * (i%3+1)) % h;
            if(py < 0) py += h;
            ctx.beginPath(); ctx.arc(px, py, Math.random()*2.5 + 0.5, 0, Math.PI*2); ctx.fill();
        } ctx.shadowBlur = 0;

        if (Math.random() > 0.8) { ctx.fillStyle = "rgba(255, 255, 255, 0.08)"; ctx.fillRect(Math.random() * w, 0, Math.random() * 2 + 1, h); }
        if (Math.random() > 0.9) { ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; ctx.fillRect(Math.random() * w, 0, Math.random() * 3 + 1, h); }

        if (window.noiseCanvas) {
            ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.55; 
            let offsetX = (Math.random() * 100) % window.noiseCanvas.width; let offsetY = (Math.random() * 100) % window.noiseCanvas.height;
            let ptrn = ctx.createPattern(window.noiseCanvas, 'repeat');
            ctx.fillStyle = ptrn; ctx.translate(-offsetX, -offsetY); ctx.fillRect(0, 0, w + 100, h + 100);
        }
        ctx.restore();
    };

    drawCinematicEnhancements(ctxH, 1920, 1080);
    drawCinematicEnhancements(ctxV, 1080, 1920);
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
                            <a href="${vid.urlV}" download="[VERT]_${vid.safeFileName}.${vid.ext}" style="background: #00f3ff; color: #0a0d14; text-decoration: none; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; display: flex; align-items: center;">📱 TikTok/Shorts (9:16)</a>
                            
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
