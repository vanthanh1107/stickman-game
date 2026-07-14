// ==========================================
// RECORDER.JS - BẢN HOÀN HẢO CHO CONTENT CREATOR (V47.0)
// QUY HOẠCH LẠI LAYOUT: TÁCH RIÊNG SUB & SÓNG ÂM RA KHỎI GAME (NẰM Ở BLACK BAR)
// ĐÃ XÓA HIỆU ỨNG NHÁY ĐỎ, HUD Ở ĐÚNG VỊ TRÍ
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];

// Khởi tạo Audio Context toàn cục và Bộ phân tích Sóng Âm
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (MA TRẬN KIẾN THỨC)
// ==========================================
window.StoryModeAI = {
    scriptLines: [],      
    currentLineIndex: 0,  
    currentAudioSource: null,   
    
    fullText: "",
    displayedText: "",
    charIndex: 0,
    isTyping: false,
    scriptProgress: 0, 

    knowledgeCategories: [
        [
            "Here is a psychological trick to instantly know if someone is secretly looking at you.",
            "All you have to do is fake a big yawn. Yes, just yawn right now.",
            "Yawning is highly contagious due to a biological system called mirror neurons.",
            "If someone has been staring at you, their brain will force them to yawn right after.",
            "Try it next time, it works almost every single time.",
            "Now look at this AI, it is also trying to read my next move. Watch until the end!"
        ],
        [
            "Did you know that time actually moves slower at the Pyramids of Giza?",
            "This is not a myth, it is a real physics phenomenon called gravitational time dilation.",
            "Einstein proved that super heavy objects literally warp the fabric of space and time.",
            "So if you stand next to a pyramid, you are technically aging slower.",
            "The universe is incredibly strange. Mind blowing, right?",
            "Just like this match, time is running out for the enemy. Look what happens next!"
        ],
        [
            "Your brain is actually actively deleting the vision of your own nose all day long.",
            "Right now, your eyes can see your nose clearly, but your brain ignores it.",
            "This process is called unconscious selective attention.",
            "But now that I mentioned it, you cannot stop looking at your own nose, can you?",
            "Human biology is absolutely fascinating when you think about it.",
            "Speaking of focus, watch how this fighter focuses on a perfect counter. Watch the finish!"
        ],
        [
            "If you want to know if someone is lying to you, look at their eyes.",
            "When people try to recall a real memory, they usually glance up and to the left.",
            "But if they are constructing a fake story, their eyes move up and to the right.",
            "This is because the right hemisphere controls creative imagination.",
            "Be careful who you trust out there, the human mind is full of secrets.",
            "But this AI boss cannot hide its next move from me. Wait for the ultimate smash!"
        ]
    ],

    generateScript: function() {
        let randomCategory = this.knowledgeCategories[Math.floor(Math.random() * this.knowledgeCategories.length)];
        return [...randomCategory]; 
    },

    init: function(hero, enemy) {
        this.scriptLines = this.generateScript();
        this.currentLineIndex = 0; this.fullText = ""; this.displayedText = ""; this.charIndex = 0; this.isTyping = false; this.scriptProgress = 0;
        
        const titles = [`🤯 MIND BLOWING! {hero} vs {enemy}!`, `🧠 LIFE HACK! {hero} EXPOSES {enemy}!`, `🔥 YOU WON'T BELIEVE THIS! {hero} VS {enemy}!`, `🚨 99% OF PEOPLE DON'T KNOW THIS! {hero} vs {enemy}!`];
        this.viralTitle = titles[Math.floor(Math.random() * titles.length)].replace(/{hero}/g, hero.toUpperCase()).replace(/{enemy}/g, enemy.toUpperCase());
    },

    playNextLine: function() {
        if (!window.isRecording || this.currentLineIndex >= this.scriptLines.length || window.gameOver) {
            this.fullText = ""; this.displayedText = ""; this.isTyping = false;
            return;
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
                let fallbackAudio = new Audio(proxyUrl); fallbackAudio.crossOrigin = "anonymous";
                fallbackAudio.volume = 1.0;
                try {
                    let fbSrc = window.audioCtx.createMediaElementSource(fallbackAudio);
                    fbSrc.connect(window.masterRecordDestination); fbSrc.connect(window.audioCtx.destination);
                } catch(e){}

                fallbackAudio.onended = () => { 
                    this.isTyping = false; this.currentLineIndex++; 
                    if(this.currentLineIndex >= this.scriptLines.length) this.scriptProgress = 1.0; 
                    setTimeout(() => { this.playNextLine(); }, 1200); 
                };
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
// HỆ THỐNG AUTO-CAPTURE TOÀN BỘ ÂM THANH IN-GAME
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
            try { 
                originalConnect.call(this, window.masterRecordDestination); 
                if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser);
            } catch(e){} 
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
    if (window.isRecording) return; if (!window.recordCanvasH || !window.recordCanvasV) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try {
            if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous";
            let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase);
            bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination);
            if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser);
            window.bgmBase._routedToRecorder = true;
        } catch (e) { }
    }

    try {
        if (window.silenceOsc) window.silenceOsc.stop();
        window.silenceOsc = window.audioCtx.createOscillator();
        let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; 
        window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination);
        window.silenceOsc.start();
    } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    let videoStreamH = window.recordCanvasH.captureStream(); let videoStreamV = window.recordCanvasV.captureStream(); 
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

    let charName = "WARRIOR"; let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) {
        charName = window.classStats[window.p1.classId].className || "WARRIOR"; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    }
    let enemyName = "UNKNOWN BOSS";
    if (window.enemies && window.enemies.length > 0) {
        let e0 = window.enemies[0];
        if (e0.isDragon) enemyName = "DRAGON BOSS"; else if (e0.isBruceLee) enemyName = "BRUCE LEE"; else enemyName = e0.className || "BOSS";
    }

    window.StoryModeAI.init(charName, enemyName);

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

                window.savedVideos.push({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.viralTitle, 
                    safeFileName: safeFileName
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); 
    window.isRecording = true;

    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); } catch(e){} 
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); 
    window.isRecording = false; 
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
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
            ctx.strokeText(line, x, y); ctx.shadowBlur = 0; ctx.fillText(line, x, y);
            line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
    ctx.strokeText(line, x, y); ctx.shadowBlur = 0; ctx.fillText(line, x, y);
}

function drawAudioVisualizer(ctx, x, y, width, height) {
    if (!window.recordAnalyser) return;
    window.recordAnalyser.getByteFrequencyData(window.analyserData);
    
    let barWidth = (width / 24) - 4; 
    let posX = x - width / 2;

    ctx.save();
    for (let i = 0; i < 24; i++) {
        let barHeight = (window.analyserData[i + 2] / 255) * height; 
        if (barHeight < 5) barHeight = 5; 

        let grad = ctx.createLinearGradient(0, y, 0, y - barHeight);
        grad.addColorStop(0, "#00f3ff"); grad.addColorStop(1, "#f1c40f");
        ctx.fillStyle = grad;
        
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(posX, y - barHeight, barWidth, barHeight, 5); ctx.fill(); } 
        else { ctx.fillRect(posX, y - barHeight, barWidth, barHeight); }
        posX += barWidth + 4;
    }
    ctx.restore();
}

// ==========================================
// RENDER KHUNG HÌNH (QUY HOẠCH TÁCH BIỆT GAME, TEXT VÀ VISUALIZER)
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 
    
    // --- 1. RENDER NGANG (16:9) ---
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); // Nền đen toàn bộ
    
    // Vẽ Game ở phía trên (Chiều cao 880px, để lại 200px dưới cùng màu đen cho Sub)
    ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 0, 1920, 880);
    let vignetteH = ctxH.createRadialGradient(960, 440, 500, 960, 440, 1200); 
    vignetteH.addColorStop(0, 'rgba(0,0,0,0)'); vignetteH.addColorStop(1, 'rgba(0,0,0,0.7)'); 
    ctxH.fillStyle = vignetteH; ctxH.fillRect(0, 0, 1920, 880);

    // --- 2. RENDER DỌC (9:16) ---
    ctxV.fillStyle = "#0a0a14"; ctxV.fillRect(0, 0, 1080, 1920); // Nền đen không gian
    
    // Cyber Grid chạy ngầm làm background cho viền đen
    ctxV.save();
    ctxV.strokeStyle = "rgba(0, 243, 255, 0.1)"; ctxV.lineWidth = 3;
    let timeOffset = (Date.now() / 20) % 100;
    ctxV.beginPath();
    for(let i = 0; i < 1080; i += 100) { ctxV.moveTo(i, 0); ctxV.lineTo(i, 1920); }
    for(let j = timeOffset; j < 1920; j += 100) { ctxV.moveTo(0, j); ctxV.lineTo(1080, j); }
    ctxV.stroke();
    ctxV.restore();

    // Vẽ Game ở giữa (Y: 420 đến 1500), để trống trên và dưới
    ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420, 420, 1920, 1080);
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); 
    vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // =====================================
    // VẼ HUD MÁU & AVATAR ĐÚNG CHUẨN VÀO KHU VỰC GAME
    // =====================================
    if (!window.hudImages) window.hudImages = {};
    const getHudImg = (url) => {
        if (!url) return null;
        if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url];
        if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; }
        return null;
    };

    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h); } else { ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100);
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1, p2Hp = 0, eStam = 0;
        let p1Name = (window.p1.className || "PLAYER").toUpperCase(); let eName = "ENEMY";
        let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";

        if (window.classStats && window.classStats[window.p1.classId]) p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url;

        if (window.enemies && window.enemies.length > 0) {
            let e0 = window.enemies[0];
            window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); 
            eStam = Math.max(0, e0.stamina / 100);
            eName = (e0.className || "ENEMY").toUpperCase() + (window.enemies.length > 1 ? ` x${window.enemies.length}` : "");
            if (window.classStats && window.classStats[e0.classId]) p2Url = window.classStats[e0.classId].avatarUrl || p2Url;
        }

        let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url);

        // HUD NGANG (Nằm gọn ở đỉnh khu vực game Y=25)
        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.font = "900 48px Arial"; ctxH.textAlign = "left";
        if (img1) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(70, 25, 55, 55, 6); else ctxH.rect(70, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img1, 70, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(70, 25, 55, 55); }
        ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 145, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 145, 72);
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);

        if (window.enemies && window.enemies.length > 0) {
            ctxH.textAlign = "right"; 
            if (img2) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(1795, 25, 55, 55, 6); else ctxH.rect(1795, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img2, 1795, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(1795, 25, 55, 55); }
            ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1780, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1780, 72);
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, "#c0392b"); hpGrad.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxH, 1090 + (750 - eHpWidth), 90, eHpWidth, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }
        ctxH.textAlign = "center"; ctxH.font = "italic 900 80px Arial"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText("VS", 960, 130); let vsGrad = ctxH.createLinearGradient(0, 50, 0, 140); vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22"); ctxH.fillStyle = vsGrad; ctxH.fillText("VS", 960, 130);

        // HUD DỌC (Nằm gọn ở đỉnh khu vực game Y=450)
        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px Arial"; ctxV.textAlign = "left";
        if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(40, 450, 80, 80, 10); else ctxV.rect(40, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img1, 40, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(40, 450, 80, 80); }
        ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(p1Name, 140, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 140, 490);
        drawSkewedPath(ctxV, 140, 505, 380, 40, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
        if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(140, 0, 520, 0); hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxV, 140, 505, 380 * p1Hp, 40, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
        ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(140, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(140, 555, 300 * p1Stam, 15);

        if (window.enemies && window.enemies.length > 0) {
            ctxV.textAlign = "right"; 
            if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(960, 450, 80, 80, 10); else ctxV.rect(960, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img2, 960, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(960, 450, 80, 80); }
            ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 940, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 940, 490);
            drawSkewedPath(ctxV, 560, 505, 380, 40, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(560, 0, 940, 0); hpGradV2.addColorStop(0, "#c0392b"); hpGradV2.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxV, 560 + (380 - eHpWidth), 505, eHpWidth, 40, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(640, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(640 + (300 - (300 * eStam)), 555, 300 * eStam, 15);
        }
    }

    // =====================================
    // VẼ TIKTOK STICKER "WAIT FOR IT 🤯" NẰM TRONG VÙNG ĐEN TRÊN CÙNG
    // =====================================
    let audioPeak = 0;
    if (window.analyserData) audioPeak = window.analyserData[3] / 255; 
    
    ctxV.save();
    ctxV.translate(540, 220); // Vùng đen trên cùng
    ctxV.rotate(-0.05);       
    let scaleSize = 1 + (audioPeak * 0.15); // Nảy theo âm thanh đấm đá
    ctxV.scale(scaleSize, scaleSize);
    
    ctxV.fillStyle = "rgba(255, 10, 50, 0.9)";
    ctxV.shadowColor = "rgba(0,0,0,0.9)"; ctxV.shadowBlur = 15;
    ctxV.beginPath(); 
    if(ctxV.roundRect) ctxV.roundRect(-240, -40, 480, 80, 20); else ctxV.rect(-240, -40, 480, 80); 
    ctxV.fill();
    ctxV.fillStyle = "#ffffff"; ctxV.font = "900 40px 'Arial Black', Gadget, sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
    ctxV.shadowBlur = 0;
    ctxV.fillText("WAIT FOR THE END 🤯", 0, 0);
    ctxV.restore();

    // =====================================
    // XỬ LÝ GÕ CHỮ (TYPEWRITER) VÀ VẼ VÀO VÙNG ĐEN DƯỚI CÙNG
    // =====================================
    if (window.StoryModeAI.isTyping) {
        window.StoryModeAI.charIndex += 0.5;
        if (window.StoryModeAI.charIndex > window.StoryModeAI.fullText.length) window.StoryModeAI.charIndex = window.StoryModeAI.fullText.length;
        window.StoryModeAI.displayedText = window.StoryModeAI.fullText.substring(0, Math.floor(window.StoryModeAI.charIndex));
    }

    if (window.StoryModeAI.displayedText.length > 0) {
        // AUDIO VISUALIZER (SÓNG ÂM) 
        drawAudioVisualizer(ctxV, 540, 1580, 600, 80); // Video Dọc: Vùng đen Y=1500->1920
        drawAudioVisualizer(ctxH, 960, 910, 600, 60);  // Video Ngang: Vùng đen Y=880->1080

        // TEXT VIDEO DỌC TIKTOK
        ctxV.save(); ctxV.textAlign = "center"; ctxV.textBaseline = "top";
        ctxV.font = "900 45px 'Montserrat', 'Arial Black', sans-serif";
        ctxV.fillStyle = "#f1c40f"; ctxV.strokeStyle = "#000000"; ctxV.lineWidth = 10; ctxV.lineJoin = "round";
        wrapText(ctxV, window.StoryModeAI.displayedText, 540, 1600, 950, 60); // Bắt đầu ở Y=1600
        ctxV.restore();

        // TEXT VIDEO NGANG 16:9
        ctxH.save(); ctxH.textAlign = "center"; ctxH.textBaseline = "top";
        ctxH.font = "900 40px 'Montserrat', 'Arial Black', sans-serif";
        ctxH.fillStyle = "#f1c40f"; ctxH.strokeStyle = "#000000"; ctxH.lineWidth = 8; ctxH.lineJoin = "round";
        wrapText(ctxH, window.StoryModeAI.displayedText, 960, 930, 1700, 50); // Bắt đầu ở Y=930
        ctxH.restore();
    }

    // =====================================
    // THANH TIẾN TRÌNH NEON CẢ 2 BẢN
    // =====================================
    let progressWidthV = 1080 * window.StoryModeAI.scriptProgress;
    ctxV.save();
    ctxV.fillStyle = "rgba(255,255,255,0.1)"; ctxV.fillRect(0, 1910, 1080, 10); 
    let gradV = ctxV.createLinearGradient(0, 0, progressWidthV, 0); gradV.addColorStop(0, "#00f3ff"); gradV.addColorStop(1, "#f1c40f");
    ctxV.fillStyle = gradV; ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 15;
    ctxV.fillRect(0, 1910, progressWidthV, 10); 
    ctxV.restore();

    let progressWidthH = 1920 * window.StoryModeAI.scriptProgress;
    ctxH.save();
    ctxH.fillStyle = "rgba(255,255,255,0.1)"; ctxH.fillRect(0, 1070, 1920, 10);
    let gradH = ctxH.createLinearGradient(0, 0, progressWidthH, 0); gradH.addColorStop(0, "#00f3ff"); gradH.addColorStop(1, "#f1c40f");
    ctxH.fillStyle = gradH; ctxH.shadowColor = "#00f3ff"; ctxH.shadowBlur = 15;
    ctxH.fillRect(0, 1070, progressWidthH, 10);
    ctxH.restore();
};

window.captureFrameTo1080p = window.captureFrames;

window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 20px; background: #0a0d14; border-radius: 12px; border: 1px solid #1e293b; max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 MATCH ARCHIVE</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">No data yet. Fight and hit Exit!</p>`; return; }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 MATCH ARCHIVE (${window.savedVideos.length} VIDEOS)</h3><div style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 5px;">`;
    window.savedVideos.forEach((vid) => { 
        html += `<div style="display: flex; flex-direction: column; background: #141a27; padding: 15px; border-radius: 8px; border: 1px solid #334155; box-shadow: inset 0 0 5px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                        <span style="font-weight: bold; color: #ffeb3b; font-size: 18px; text-shadow: 0 0 5px rgba(255,235,59,0.3); flex: 1; text-align: left;">📝 ${vid.viralTitle}</span>
                        <button onclick="window.copyToClipboard('${vid.viralTitle.replace(/'/g, "\\'")}')" style="margin-left: 10px; background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">📋 Copy Title</button>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${vid.heroAvatar}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #00f3ff;">
                            <div style="text-align: left; display: flex; flex-direction: column;">
                                <span style="font-weight: 700; color: #f8fafc; font-family: 'Teko', sans-serif; font-size: 22px; letter-spacing: 1px;">${vid.heroName}</span>
                                <span style="font-size: 13px; color: #94a3b8; font-weight: 600;">🕒 Time: ${vid.timestamp}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <a href="${vid.urlH}" download="[HORIZONTAL]_${vid.safeFileName}.${vid.ext}" style="background: #ff003c; color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: 600;">📥 HORIZONTAL</a>
                            <a href="${vid.urlV}" download="[VERTICAL]_${vid.safeFileName}.${vid.ext}" style="background: #00f3ff; color: #0a0d14; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: 600;">📱 VERTICAL (TikTok)</a>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">❌</button>
                        </div>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlH); URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } 
};
