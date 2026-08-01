// ==========================================
// RECORDER.JS - V67.0 ULTRA SMOOTH (FIX LAG & FIX VIDEO SPEED)
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];
window.thumbnailHoldFrames = 0; window.introHoldFrames = 0; window.totalIntroFrames = 150; 
window.bakedThumbH = null; window.bakedThumbV = null; 

// Biến Cache tối ưu hóa
window._cachedGradients = {}; 
window._glitchThrottle = 0; 
window._lastFrameTime = 0;

window.trashTalkP1 = ""; window.trashTalkP2 = "";
window.introEmojiP1 = ""; window.introEmojiP2 = "";
window.bannerText1 = ""; window.bannerText2 = "";
window.statBadgeP1 = ""; window.statBadgeP2 = "";

window.retentionParticles = []; window.retentionEmojis = [];

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
    generateScript: function(hero, enemy) {
        let h = hero.toUpperCase(); let e = enemy.toUpperCase();
        const narratives = [
            { title: `NEVER play Stickman at 3 AM 💀🚫`, lines: ["This might be the most ridiculous stickman sequence ever captured.", "Most players would button mash, but this is pure mechanics.", "One missed frame and this entire run is completely dead."] },
            { title: `who let this STICKMAN COOK?! 🗣️🔥`, lines: ["Never disrespect a boss like this unless you are ready for the consequences.", "Watch what happens when you push the stickman physics to the limit.", "Notice the exact frame the dodge happens. Pure muscle memory."] },
            { title: `this stickman glitch is ILLEGAL 🤯🚫`, lines: ["I cannot believe they haven't patched this broken interaction yet.", "By canceling your attack at the exact moment, you break the game.", "Look at how fast the health bar just completely melts away."] },
            { title: `1 HP STICKMAN CLUTCH (I stopped breathing) 🚨📈`, lines: ["I want you to honestly ask yourself: would you have survived this situation?", "When your HP gets this low, the adrenaline usually makes you spam buttons.", "But the discipline to hold back and wait for the perfect opening is insane."] }
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

        fetch(ttsUrl).catch(() => fetch(proxyUrl))
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
            }).catch(() => {
                this.isTyping = false; this.currentLineIndex++;
                setTimeout(() => { this.playNextLine(); }, 1200);
            });
    },
    stop: function() {
        if (this.currentAudioSource) { try { this.currentAudioSource.stop(); } catch(e){} this.currentAudioSource = null; }
        this.fullText = ""; this.displayedText = ""; this.isTyping = false; this.scriptProgress = 0;
    }
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawVTuberCommentator(ctx, x, y, audioPeak, isTyping) {
    let t = Date.now(); ctx.save();
    let floatY = Math.sin(t / 250) * 10; let tilt = Math.sin(t / 600) * 0.05;
    ctx.translate(x, y + floatY); ctx.rotate(tilt);

    ctx.fillStyle = "#1e293b"; ctx.strokeStyle = "#00f3ff"; ctx.lineWidth = 6;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-120, -90, 240, 180, 30); else ctx.rect(-120, -90, 240, 180);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#020617"; ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(-100, -75, 200, 150, 15); else ctx.rect(-100, -75, 200, 150);
    ctx.fill();

    let isBlinking = (t % 3500 < 150);
    ctx.fillStyle = audioPeak > 0.6 ? "#ff0055" : "#ffeb3b"; 
    
    if (isBlinking) {
        ctx.fillRect(-60, -30, 40, 6); ctx.fillRect(20, -30, 40, 6);
    } else {
        ctx.beginPath(); ctx.ellipse(-45, -35, 18, 25, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(45, -35, 18, 25, -0.3, 0, Math.PI*2); ctx.fill();
    }

    let mouthHeight = 8 + (audioPeak * 60); 
    if (!isTyping && audioPeak < 0.2) mouthHeight = 8; 

    ctx.fillStyle = "#ff0055"; ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(-35, 25, 70, mouthHeight, 10); else ctx.fillRect(-35, 25, 70, mouthHeight);
    ctx.fill();

    ctx.fillStyle = "#ffeb3b"; ctx.fillRect(120, -20, 15, 40);
    ctx.beginPath(); ctx.arc(140, 0, 10, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}

window.bakeThumbnailsForVideo = function(titleText) { /* Code giữ nguyên vì chỉ chạy 1 lần */ };
window.drawAnimatedIntro = function(ctx, w, h, isVertical, progress) { /* Code giữ nguyên */ };

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true;
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
}

window.initRecorder = function() {
    // Tối ưu cờ Canvas context
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    
    if (!window.recordCanvasH) {
        window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH";
        document.body.appendChild(window.recordCanvasH);
    }
    window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080; 
    window.recordCtxH = window.recordCanvasH.getContext("2d", ctxOpts);

    if (!window.recordCanvasV) {
        window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV";
        document.body.appendChild(window.recordCanvasV);
    }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; 
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    window.retentionParticles = []; window.retentionEmojis = []; 
    
    let videoStreamH = window.recordCanvasH.captureStream(60); 
    let videoStreamV = window.recordCanvasV.captureStream(60); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream([...videoStreamH.getVideoTracks(), ...audioTracks]);
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    // [FIX LÕI] Giảm Bitrate xuống 12 Mbps - Loại bỏ giật lag và sửa lỗi video chạy nhanh/chậm
    let options = { videoBitsPerSecond: 12000000 }; 
    window.currentVideoExt = "webm";

    if (MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')) {
        options.mimeType = 'video/webm; codecs="vp8"'; // Ưu tiên VP8 vì render Real-time nhẹ hơn VP9
    } else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) {
        options.mimeType = 'video/mp4; codecs="avc1"'; 
        window.currentVideoExt = "mp4";
    }
    
    try { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); 
    } catch (e) { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV); 
    }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = window.p1 ? (window.p1.className || "PLAYER") : "PLAYER";
    let enemyName = (window.enemies && window.enemies.length > 0) ? (window.enemies[0].className || "BOSS") : "BOSS";

    window.StoryModeAI.init(charName, enemyName);
    window.trashTalkP1 = "Bro skipped diagonal movement 🤡"; window.introEmojiP1 = "🔥";
    window.trashTalkP2 = "Skill issue detected."; window.introEmojiP2 = "💀";
    
    // Bake Thumbnail ẩn để tránh lag lúc record
    if(typeof window.bakeThumbnailsForVideo === 'function') setTimeout(() => window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle), 100);
    
    window.thumbnailHoldFrames = 30; window.introHoldFrames = window.totalIntroFrames;

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) { 
            setTimeout(() => {
                if (window.recordedChunksH.length === 0) return;
                let blobH = new Blob(window.recordedChunksH, { type: window.mediaRecorderH.mimeType }); 
                let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
                window.savedVideos.unshift({ 
                    id: Date.now(), urlH: URL.createObjectURL(blobH), urlV: URL.createObjectURL(blobV), ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN'), heroName: charName, viralTitle: window.StoryModeAI.viralTitle, 
                    safeFileName: window.sanitizeFileName(window.StoryModeAI.viralTitle)
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 800); 
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(1000); // Thêm timeslice để tránh tràn RAM
    window.mediaRecorderV.start(1000); 
    window.isRecording = true;
    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; 
    if (window.mediaRecorderH && window.mediaRecorderH.state !== "inactive") window.mediaRecorderH.stop();
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") window.mediaRecorderV.stop();
    window.StoryModeAI.stop();
};

if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true;
    const oldDraw = window.draw;
    window.draw = function() {
        if (oldDraw) oldDraw.apply(this, arguments);
        if (typeof window.captureFrames === 'function') window.captureFrames();
    };
}

function wrapTextTikTok(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' '); let currentLine = ""; let lines = [];
    for(let i=0; i<words.length; i++) {
        let testLine = currentLine + words[i] + " ";
        if(ctx.measureText(testLine).width > maxWidth && i > 0) { lines.push(currentLine.trim()); currentLine = words[i] + " "; } 
        else { currentLine = testLine; }
    }
    lines.push(currentLine.trim());
    
    // Tối ưu: Bỏ shadowBlur trong vòng lặp text, chỉ dùng viền stroke để tối ưu GPU
    for(let i=0; i<lines.length; i++) {
        let lineWidth = ctx.measureText(lines[i]).width;
        let startX = x - lineWidth / 2; 
        ctx.strokeText(lines[i], startX, y + i * lineHeight);
        ctx.fillText(lines[i], startX, y + i * lineHeight);
    }
}

function drawAudioVisualizer(ctx, x, y, width, height) {
    if(!window.analyserData) return;
    let numBars = 24; let barWidth = (width / numBars) - 4; let center = x;
    
    // Cache Gradient cho Visualizer để không tạo lại mỗi frame
    if(!window._cachedGradients.vis) {
        window._cachedGradients.vis = ctx.createLinearGradient(0, y, 0, y - height);
        window._cachedGradients.vis.addColorStop(0, "#00f3ff"); window._cachedGradients.vis.addColorStop(1, "#f1c40f");
    }
    ctx.fillStyle = window._cachedGradients.vis;
    
    ctx.beginPath(); 
    for (let i = 0; i < numBars / 2; i++) {
        let barHeight = Math.max(5, (window.analyserData[i + 2] / 255) * height); 
        let offsetX = i * (barWidth + 4) + (barWidth/2);
        ctx.fillRect((center + offsetX) | 0, (y - barHeight) | 0, barWidth | 0, barHeight | 0); 
        ctx.fillRect((center - offsetX - barWidth) | 0, (y - barHeight) | 0, barWidth | 0, barHeight | 0);
    }
}

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.canvas) return;

    // Giới hạn FPS ghi hình nếu game bị chậm (Bảo vệ luồng chính)
    let now = performance.now();
    if (now - window._lastFrameTime < 15) return; 
    window._lastFrameTime = now;

    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 
    ctxH.fillStyle = "#000"; ctxH.fillRect(0,0,1920,1080);
    ctxV.fillStyle = "#000"; ctxV.fillRect(0,0,1080,1920);

    let renderNormalH = true;
    if (window.thumbnailHoldFrames > 0 && window.bakedThumbH) {
        ctxH.drawImage(window.bakedThumbH, 0, 0, 1920, 1080);
        window.thumbnailHoldFrames--; renderNormalH = false; 
    } else if (window.introHoldFrames > 0) {
        if(typeof window.drawAnimatedIntro === 'function') window.drawAnimatedIntro(ctxH, 1920, 1080, false, 1 - (window.introHoldFrames / window.totalIntroFrames));
        window.introHoldFrames--; renderNormalH = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    let shakeY = audioPeak > 0.6 ? (Math.random() - 0.5) * ((audioPeak - 0.6) * 20) : 0;

    // Tối ưu Glitch: Chỉ vẽ tối đa 15 frames/giây để tránh tụt FPS
    window._glitchThrottle++;
    let shouldGlitch = audioPeak > 0.8 && window._glitchThrottle % 4 === 0;

    if (renderNormalH) {
        ctxH.imageSmoothingEnabled = false; 
        ctxH.drawImage(window.canvas, 0, shakeY | 0, 1920, 1080); 
        
        if (shouldGlitch) {
            let glitchStr = 10;
            ctxH.globalCompositeOperation = 'screen';
            ctxH.fillStyle = 'rgba(255, 0, 0, 0.4)'; ctxH.drawImage(window.canvas, -glitchStr, shakeY | 0, 1920, 1080);
            ctxH.fillStyle = 'rgba(0, 255, 255, 0.4)'; ctxH.drawImage(window.canvas, glitchStr, shakeY | 0, 1920, 1080);
            ctxH.globalCompositeOperation = 'source-over';
        }
    }

    let splitGameHeight = 607;
    ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, shakeY | 0, 1080, splitGameHeight); 

    if (shouldGlitch) {
        let glitchStr = 10;
        ctxV.globalCompositeOperation = 'screen'; 
        ctxV.fillStyle = 'rgba(255, 0, 0, 0.4)'; ctxV.drawImage(window.canvas, -glitchStr, shakeY | 0, 1080, splitGameHeight);
        ctxV.fillStyle = 'rgba(0, 255, 255, 0.4)'; ctxV.drawImage(window.canvas, glitchStr, shakeY | 0, 1080, splitGameHeight);
        ctxV.globalCompositeOperation = 'source-over';
    }

    // --- BACKGROUND 3D (TỐI ƯU HÓA) ---
    let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
    
    // Cache Gradient nền 3D
    if(!window._cachedGradients.bg) {
        window._cachedGradients.bg = ctxV.createLinearGradient(0, retainY, 0, 1920);
        window._cachedGradients.bg.addColorStop(0, "#0b001a"); window._cachedGradients.bg.addColorStop(1, "#3c003c");
    }
    ctxV.fillStyle = window._cachedGradients.bg; 
    ctxV.fillRect(0, retainY, 1080, retainHeight); 
    
    ctxV.strokeStyle = "rgba(0, 255, 200, 0.15)"; ctxV.lineWidth = 2; // Giảm lineWidth
    ctxV.beginPath(); 
    for(let x = -20; x <= 20; x+=2) { // Giảm số lượng line x2
        ctxV.moveTo(540, retainY); ctxV.lineTo(540 + x * 200, 1920);
    }
    let zSpeed = (Date.now() / 15) % 20; 
    for(let y = 1; y < 30; y++) { // Giảm số lượng line ngang
        let actualY = retainY + Math.pow(y, 1.8) * 2.5 + zSpeed;
        if (actualY <= 1920) { ctxV.moveTo(0, actualY | 0); ctxV.lineTo(1080, actualY | 0); }
    }
    ctxV.stroke(); 

    // HUD và Particle - Loại bỏ shadowBlur gây lag
    if (Math.random() < 0.2 && window.retentionParticles.length < 20) { // Giảm spawn rate
        window.retentionParticles.push({ x: Math.random() * 1080, y: 1970, s: 4, v: Math.random() * 5 + 3, age: 0 });
    }
    ctxV.fillStyle = "rgba(0, 255, 255, 0.6)";
    for (let i = window.retentionParticles.length - 1; i >= 0; i--) {
        let p = window.retentionParticles[i]; p.age++; p.y -= p.v; p.x += Math.sin(p.age * 0.1) * 3; 
        ctxV.fillRect(p.x | 0, p.y | 0, p.s, p.s); // Dùng fillRect thay arc() nhanh hơn 3 lần
        if (p.y < retainY) window.retentionParticles.splice(i, 1); 
    }

    if (!window.gameOver && window.introTimer > 120) drawVTuberCommentator(ctxV, 540, splitGameHeight + 280, audioPeak, window.StoryModeAI.isTyping);

    if (!window.gameOver) {
        if (window.StoryModeAI.isTyping) {
            window.StoryModeAI.charIndex += 0.5;
            window.StoryModeAI.displayedText = window.StoryModeAI.fullText.substring(0, Math.floor(window.StoryModeAI.charIndex));
        }
        if (window.StoryModeAI.displayedText.length > 0) {
            let visY = 1600; 
            drawAudioVisualizer(ctxV, 540, visY, 1000, 150); 
            
            ctxV.textAlign = "center"; ctxV.textBaseline = "top";
            ctxV.font = "900 60px 'Arial Black', sans-serif"; 
            ctxV.fillStyle = "#fff"; ctxV.strokeStyle = "#000"; ctxV.lineWidth = 10;
            wrapTextTikTok(ctxV, window.StoryModeAI.displayedText, 540, visY + 30, 950, 75); 

            if (renderNormalH) {
                drawAudioVisualizer(ctxH, 960, 960, 800, 80);  
                ctxH.font = "900 45px 'Arial Black', sans-serif"; ctxH.fillStyle = "#fff"; ctxH.strokeStyle = "#000"; ctxH.lineWidth = 8;
                wrapTextTikTok(ctxH, window.StoryModeAI.displayedText, 960, 980, 1700, 55); 
            }
        }
    }
};

window.captureFrameTo1080p = window.captureFrames;
