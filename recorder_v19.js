// ==========================================
// RECORDER.JS - BẢN HOÀN HẢO CHO CONTENT CREATOR (V52.0 - HOLLYWOOD AUTO-EDITOR)
// [NEW] AI MONTAGE CUT: Tự động phát hiện cảnh hành động, loại bỏ cảnh đi bộ, tự cắt ghép Jump-Cut hoàn hảo.
// [NEW] HOLLYWOOD COLOR GRADING: Áp màu Teal & Orange, Light Leaks quang học xẹt qua màn hình.
// [NEW] 3RD DOWNLOAD BUTTON: Thêm nút tải bản cắt ghép chuẩn Action Movie.
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
// [VIRAL 52.0] MÁY QUAY THỨ 3: AUTO-DIRECTOR (CHUYÊN CẮT GHÉP HIGHLIGHT)
window.mediaRecorderM = null; window.recordedChunksM = []; window.recordCanvasM = null; window.recordCtxM = null;

window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];
window.filmDustY = 0; 
window.montageTimer = 0; // Biến giữ máy quay Montage chạy
window.cutFlash = 0; // Hiệu ứng chớp nháy khi nối cảnh cắt (Jump-Cut)
window.lightLeakPos = 0;

// Khởi tạo Audio Context
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (HUMANIZED GEN-Z TITLES)
// ==========================================
window.StoryModeAI = {
    scriptLines: [],      
    currentLineIndex: 0,  
    currentAudioSource: null,   
    fullText: "", displayedText: "", charIndex: 0, isTyping: false, scriptProgress: 0, viralTitle: "",

    generateScript: function(hero, enemy) {
        let h = hero.toUpperCase(); let e = enemy.toUpperCase();
        const narratives = [
            { title: `bro really tried to disrespect ${e} like that 💀 #gaming #clutch`, lines: ["Never disrespect a boss like this unless you are ready for the consequences.", "Watch what happens when you push the game's mechanics to the absolute limit.", "Most players would panic here, but you just need to stay perfectly calm.", "Notice the exact frame the dodge happens. That is not luck, that is pure muscle memory.", `If you thought ${e} was hard, just wait until you see this ending.`] },
            { title: `never picking ${h} against ${e} again 😭 #shorts #fightinggames`, lines: ["This has to be the most insane matchup in the entire game.", "Look at how the hitboxes interact during this specific animation.", "You literally cannot make a single mistake or your health bar is gone.", "The timing required to pull this off is completely ridiculous.", `Send this to someone who still thinks ${e} is an easy boss.`] },
            { title: `${h} vs ${e} is actually UNFAIR 🥶 #meta #gamingclips`, lines: ["I cannot believe they haven't patched this interaction yet.", "By canceling your attack at the exact moment of impact, you manipulate the DPS.", "The game engine actually gets confused and registers massive damage.", "Look at how fast the health bar just completely melts away.", `Use this trick with ${h} right now before the developers fix it.`] },
            { title: `the most DISRESPECTFUL ${h} combo on ${e} 😤 #esports #highlight`, lines: ["This might be the most disrespectful sequence ever captured in this game.", "The choreography, the timing, everything here feels absolutely perfect.", "Most fights are just button mashing, but this is a pure dance of mechanics.", "One missed frame and this entire run is completely dead.", `I cannot believe the clutch at the very end of this video. Watch this!`] },
            { title: `how to humiliate ${e} using only ${h} 👑 #proplayer #gaming`, lines: ["Here is a secret trick pro gamers use to completely dominate this fight.", "Your brain naturally filters out repetitive visual information during long fights.", "But if you force the parry window, you reset their entire attack pattern.", "Opponents literally have no mathematical way to punish you if done correctly.", `Watch how ${h} uses it here to completely humiliate them.`] },
            { title: `POV: you finally figured out how to counter ${e} 🧠 #pov #relatable`, lines: ["We have all been stuck on this exact part of the game for way too long.", "You memorize the patterns, you upgrade your gear, but nothing works.", "Until you finally reach that flow state where everything just clicks.", "The attack telegraphs start moving in slow motion, and you see the matrix.", `Watch how satisfying it is when ${h} finally gets the perfect run.`] }
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
// HỆ THỐNG AUTO-CAPTURE
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
    if (!document.getElementById("hiddenRecordCanvasM")) {
        window.recordCanvasM = document.createElement("canvas"); window.recordCanvasM.id = "hiddenRecordCanvasM"; window.recordCanvasM.width = 1080; window.recordCanvasM.height = 1920;
        window.recordCanvasM.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasM); window.recordCtxM = window.recordCanvasM.getContext("2d");
    }
};

window.startRecording = function() {
    if (window.isRecording) return; if (!window.recordCanvasH || !window.recordCanvasV || !window.recordCanvasM) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }

    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = []; window.recordedChunksM = [];
    let videoStreamH = window.recordCanvasH.captureStream(); 
    let videoStreamV = window.recordCanvasV.captureStream(); 
    let videoStreamM = window.recordCanvasM.captureStream(); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream(); let combinedStreamV = new MediaStream(); let combinedStreamM = new MediaStream();
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    videoStreamM.getVideoTracks().forEach(track => combinedStreamM.addTrack(track));
    audioTracks.forEach(track => { combinedStreamH.addTrack(track); combinedStreamV.addTrack(track); combinedStreamM.addTrack(track); });
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm";
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) { options = { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4"; } 
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) { options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm"; }
    
    try { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); 
        window.mediaRecorderM = new MediaRecorder(combinedStreamM, options); 
    } catch (e) { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV); 
        window.mediaRecorderM = new MediaRecorder(combinedStreamM); 
    }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };
    window.mediaRecorderM.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksM.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) { charName = window.p1.className || window.p1.name || "PLAYER"; if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; } }
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) { let e0 = window.enemies[0]; enemyName = e0.className || e0.name || "BOSS"; if (e0.isDragon) enemyName = "DRAGON"; if (e0.isBruceLee) enemyName = "BRUCE LEE"; if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName; }

    window.StoryModeAI.init(charName, enemyName);

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 3) {
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); let videoUrlH = URL.createObjectURL(blobH);
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); let videoUrlV = URL.createObjectURL(blobV);
                let blobM = new Blob(window.recordedChunksM, { type: mimeType }); let videoUrlM = URL.createObjectURL(blobM);

                window.savedVideos.push({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, urlM: videoUrlM, ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.viralTitle, 
                    safeFileName: safeFileName
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings; window.mediaRecorderM.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); window.mediaRecorderM.start(); 
    
    // [VIRAL 52.0] Ngay khi start, pause montage lại, chỉ bật khi có đấm nhau
    try { window.mediaRecorderM.pause(); } catch(e){}

    window.isRecording = true;
    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); window.mediaRecorderM.requestData(); } catch(e){} 
    // Resume montage before stopping if it was paused to avoid corrupt file
    if(window.mediaRecorderM && window.mediaRecorderM.state === "paused") { try { window.mediaRecorderM.resume(); } catch(e){} }
    
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); window.mediaRecorderM.stop();
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

// ==========================================
// RENDER KHUNG HÌNH CHÍNH (TÍCH HỢP HOLLYWOOD GRADING & AUTO MONTAGE)
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.recordCtxM || !window.canvas) return;
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; let ctxM = window.recordCtxM;
    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) {
        let shakeIntensity = (audioPeak - 0.6) * 30; 
        shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    // [VIRAL 52.0] AI MONTAGE DIRECTOR - Xác định khi nào có đấm nhau
    let actionLevel = (window.shakeTime || 0) + (window.hitStopFrames || 0) + (window.impactFrameCount || 0);
    if (actionLevel > 5 || audioPeak > 0.65 || (window.gameOver && window.matchEndTimer < 120)) {
        window.montageTimer = 90; // Quay tiếp 1.5 giây sau khi hết hành động
    }

    if (window.mediaRecorderM) {
        if (window.montageTimer > 0) {
            window.montageTimer--;
            if (window.mediaRecorderM.state === "paused") {
                try { window.mediaRecorderM.resume(); window.cutFlash = 5; } catch(e){}
            }
        } else {
            if (window.mediaRecorderM.state === "recording") {
                try { window.mediaRecorderM.pause(); } catch(e){}
            }
        }
    }

    // --- 1. RENDER NGANG (16:9) ---
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); 
    ctxH.imageSmoothingEnabled = false; 
    
    // Áp dụng Cinematic Color Grading (Hollywood Teal & Orange) bằng filter
    ctxH.filter = 'contrast(1.15) saturate(1.1) sepia(0.15) hue-rotate(-5deg)';
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX, shakeY + 100, 1920, 880); 
    ctxH.filter = 'none';

    // Viền Letterbox điện ảnh 21:9 cho bản Ngang
    ctxH.fillStyle = "#000"; ctxH.fillRect(0, 0, 1920, 100); ctxH.fillRect(0, 980, 1920, 100);

    // --- 2. RENDER DỌC (9:16) VÀ MONTAGE ---
    let renderVertical = (ctxTarget) => {
        ctxTarget.fillStyle = "#0a0a14"; ctxTarget.fillRect(0, 0, 1080, 1920); 
        ctxTarget.imageSmoothingEnabled = false;
        ctxTarget.filter = 'contrast(1.15) saturate(1.15) brightness(0.95)';
        ctxTarget.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420 + shakeX, 420 + shakeY, 1920, 1080); 
        ctxTarget.filter = 'none';
        
        // Vẽ HUD MÁU
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
                if (repEnemyObj.isDragon) eName = "DRAGON"; if (repEnemyObj.isBruceLee) eName = "BRUCE LEE";
                if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
            }
            let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url);

            ctxTarget.lineJoin = "round"; ctxTarget.lineWidth = 8; ctxTarget.strokeStyle = "#000"; ctxTarget.font = "900 42px Arial"; ctxTarget.textAlign = "left";
            if (img1) { ctxTarget.save(); ctxTarget.beginPath(); if (ctxTarget.roundRect) ctxTarget.roundRect(40, 450, 80, 80, 10); else ctxTarget.rect(40, 450, 80, 80); ctxTarget.clip(); ctxTarget.drawImage(img1, 40, 450, 80, 80); ctxTarget.restore(); ctxTarget.lineWidth = 5; ctxTarget.strokeStyle = "#00f3ff"; ctxTarget.strokeRect(40, 450, 80, 80); }
            ctxTarget.lineWidth = 7; ctxTarget.strokeStyle = "#000"; ctxTarget.strokeText(p1Name, 140, 490); ctxTarget.fillStyle = "#fff"; ctxTarget.fillText(p1Name, 140, 490);
            drawSkewedPath(ctxTarget, 140, 505, 380, 40, true); ctxTarget.fillStyle = "rgba(0,0,0,0.7)"; ctxTarget.fill(); ctxTarget.lineWidth = 5; ctxTarget.strokeStyle = "rgba(255,255,255,0.9)"; ctxTarget.stroke();
            if (p1Hp > 0) { let hpGradV = ctxTarget.createLinearGradient(140, 0, 520, 0); hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxTarget, 140, 505, 380 * p1Hp, 40, true); ctxTarget.fillStyle = hpGradV; ctxTarget.fill(); }
            ctxTarget.fillStyle = "rgba(0,0,0,0.8)"; ctxTarget.fillRect(140, 555, 300, 15); ctxTarget.fillStyle = "#f1c40f"; ctxTarget.fillRect(140, 555, 300 * p1Stam, 15);

            if (repEnemyObj) {
                ctxTarget.textAlign = "right"; 
                if (img2) { ctxTarget.save(); ctxTarget.beginPath(); if (ctxTarget.roundRect) ctxTarget.roundRect(960, 450, 80, 80, 10); else ctxTarget.rect(960, 450, 80, 80); ctxTarget.clip(); ctxTarget.drawImage(img2, 960, 450, 80, 80); ctxTarget.restore(); ctxTarget.lineWidth = 5; ctxTarget.strokeStyle = "#ff003c"; ctxTarget.strokeRect(960, 450, 80, 80); }
                ctxTarget.lineWidth = 7; ctxTarget.strokeStyle = "#000"; ctxTarget.strokeText(eName, 940, 490); ctxTarget.fillStyle = "#fff"; ctxTarget.fillText(eName, 940, 490);
                drawSkewedPath(ctxTarget, 560, 505, 380, 40, false); ctxTarget.fillStyle = "rgba(0,0,0,0.7)"; ctxTarget.fill(); ctxTarget.lineWidth = 5; ctxTarget.strokeStyle = "rgba(255,255,255,0.9)"; ctxTarget.stroke();
                if (p2Hp > 0) { let hpGradV2 = ctxTarget.createLinearGradient(560, 0, 940, 0); hpGradV2.addColorStop(0, "#c0392b"); hpGradV2.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxTarget, 560 + (380 - eHpWidth), 505, eHpWidth, 40, false); ctxTarget.fillStyle = hpGradV2; ctxTarget.fill(); }
                ctxTarget.fillStyle = "rgba(0,0,0,0.8)"; ctxTarget.fillRect(640, 555, 300, 15); ctxTarget.fillStyle = "#f1c40f"; ctxTarget.fillRect(640 + (300 - (300 * eStam)), 555, 300 * eStam, 15);
            }
        }

        if (!window.gameOver) {
            renderMobileSafeCombo(ctxTarget, window.p1, 140, 600, "left", true);
            let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; });
            renderMobileSafeCombo(ctxTarget, maxEnemyCombo, 940, 600, "right", true);
            
            // NÚT SUBSCRIBE 
            ctxTarget.save(); ctxTarget.translate(540, 240); let subScale = 1 + (audioPeak * 0.12); ctxTarget.scale(subScale, subScale);
            ctxTarget.fillStyle = "#ff0000"; ctxTarget.shadowColor = "rgba(255,0,0,0.8)"; ctxTarget.shadowBlur = 20;
            ctxTarget.beginPath(); if(ctxTarget.roundRect) ctxTarget.roundRect(-200, -45, 400, 90, 45); else ctxTarget.rect(-200, -45, 400, 90); ctxTarget.fill();
            ctxTarget.fillStyle = "#ffffff"; ctxTarget.font = "900 42px 'Montserrat', 'Arial Black', sans-serif"; ctxTarget.textAlign = "center"; ctxTarget.textBaseline = "middle";
            ctxTarget.shadowBlur = 0; ctxTarget.fillText("▶ SUBSCRIBE", 0, 4); ctxTarget.restore();
        }
        
        // MÀN HÌNH CHỐT SALE
        if (window.gameOver && window.matchEndTimer > 90) { 
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxTarget.save(); ctxTarget.globalAlpha = outroAlpha;
            let bgGrad = ctxTarget.createRadialGradient(540, 960, 0, 540, 960, 1920);
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.85)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
            ctxTarget.fillStyle = bgGrad; ctxTarget.fillRect(0, 0, 1080, 1920);
            let floatY = Math.sin(window.matchEndTimer * 0.05) * 10;
            ctxTarget.textAlign = "center"; ctxTarget.textBaseline = "middle"; ctxTarget.shadowBlur = 25;
            ctxTarget.font = `italic 900 65px 'Arial Black', sans-serif`; ctxTarget.fillStyle = "#00f3ff"; ctxTarget.shadowColor = "#00f3ff";
            ctxTarget.fillText("CREATE YOUR OWN", 540, 960 - 250 + floatY);
            ctxTarget.fillStyle = "#ffeb3b"; ctxTarget.shadowColor = "#ffeb3b"; ctxTarget.fillText("CHARACTER", 540, 960 - 170 + floatY);
            ctxTarget.fillStyle = "#fff"; ctxTarget.shadowColor = "transparent"; ctxTarget.shadowBlur = 0;
            ctxTarget.font = `900 45px 'Arial Black', sans-serif`; ctxTarget.fillText("BY DESCRIBING IT!", 540, 960 - 90 + floatY);
            ctxTarget.font = `bold 40px 'Montserrat', sans-serif`; ctxTarget.fillText("Check Link in Bio / Comments 👇", 540, 960 + 20 + floatY);
            
            let btnPulse = 1 + (audioPeak * 0.08); ctxTarget.translate(540, 960 + 140 + floatY); ctxTarget.scale(btnPulse, btnPulse);
            let btnGrad = ctxTarget.createLinearGradient(-240, 0, 240, 0); btnGrad.addColorStop(0, "#ff003c"); btnGrad.addColorStop(1, "#ff4757");
            ctxTarget.fillStyle = btnGrad; ctxTarget.shadowColor = "#ff003c"; ctxTarget.shadowBlur = 30 + Math.sin(window.matchEndTimer * 0.1) * 10;
            ctxTarget.beginPath(); if(ctxTarget.roundRect) ctxTarget.roundRect(-240, -60, 480, 120, 60); else ctxTarget.rect(-240, -60, 480, 120); ctxTarget.fill();
            ctxTarget.lineWidth = 4; ctxTarget.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctxTarget.stroke(); ctxTarget.shadowBlur = 0;
            ctxTarget.fillStyle = "#ffffff"; ctxTarget.font = `900 45px 'Arial Black', sans-serif`; ctxTarget.fillText("✨ TRY IT FREE", 0, 5);
            ctxTarget.restore();
        }
    };
    
    renderVertical(ctxV); // Bản dọc thường
    
    // [VIRAL 52.0] VẼ MONTAGE KÈM HIỆU ỨNG JUMP-CUT
    if (window.mediaRecorderM && window.mediaRecorderM.state === "recording") {
        renderVertical(ctxM);
        
        // Kỹ xảo Flash Trắng mượt mà khi Cut cảnh
        if (window.cutFlash > 0) {
            ctxM.fillStyle = `rgba(255, 255, 255, ${window.cutFlash / 5})`;
            ctxM.fillRect(0, 0, 1080, 1920);
            window.cutFlash--;
        }
    }

    // =====================================
    // [VIRAL 52.0] CINEMATIC FILM OVERLAY (CHỐNG AI QUÉT TẤT CẢ CÁC BẢN)
    // Bao gồm: Tối góc, Hạt bụi quang học (Lens Dust), Vết xước phim (Film Scratch), Light Leaks
    // =====================================
    window.filmDustY += 1.5;
    window.lightLeakPos += 5; if(window.lightLeakPos > 3000) window.lightLeakPos = -1000;
    
    let drawCinematicGrain = (ctx, w, h) => {
        ctx.save();
        // Light Leaks (Rò rỉ ánh sáng mép ống kính)
        ctx.globalCompositeOperation = 'screen';
        let llGrad = ctx.createLinearGradient(window.lightLeakPos, 0, window.lightLeakPos + 800, h);
        llGrad.addColorStop(0, "rgba(255, 50, 0, 0)"); llGrad.addColorStop(0.5, "rgba(255, 100, 50, 0.08)"); llGrad.addColorStop(1, "rgba(255, 50, 0, 0)");
        ctx.fillStyle = llGrad; ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';

        // Tối sâu góc (Vignette)
        let vig = ctx.createRadialGradient(w/2, h/2, h*0.35, w/2, h/2, h*0.85);
        vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.65)");
        ctx.fillStyle = vig; ctx.fillRect(0,0,w,h);

        // Hạt bụi điện ảnh (Optical Dust)
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)"; ctx.shadowBlur = 4; ctx.shadowColor = "#fff";
        for(let i=0; i<35; i++) {
            let px = (Math.sin(Date.now()/1200 + i) * w + w) % w;
            let py = (Math.cos(Date.now()/900 + i) * h + h - window.filmDustY * (i%3+1)) % h;
            if(py < 0) py += h;
            ctx.beginPath(); ctx.arc(px, py, Math.random()*2.5, 0, Math.PI*2); ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Vết xước phim ngẫu nhiên (Film Scratches - Anti AI Hash)
        if (Math.random() > 0.85) { ctx.fillStyle = "rgba(255, 255, 255, 0.08)"; ctx.fillRect(Math.random() * w, 0, Math.random() * 2 + 1, h); }
        if (Math.random() > 0.95) { ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; ctx.fillRect(Math.random() * w, 0, Math.random() * 4 + 1, h); }
        ctx.restore();
    };

    drawCinematicGrain(ctxH, 1920, 1080);
    drawCinematicGrain(ctxV, 1080, 1920);
    if(window.mediaRecorderM && window.mediaRecorderM.state === "recording") drawCinematicGrain(ctxM, 1080, 1920);
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
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <a href="${vid.urlH}" download="[HORZ]_${vid.safeFileName}.${vid.ext}" style="background: #334155; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center;">📥 HORIZONTAL</a>
                                <a href="${vid.urlV}" download="[VERT]_${vid.safeFileName}.${vid.ext}" style="background: #00f3ff; color: #0a0d14; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center;">📱 TIKTOK VERTICAL</a>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <a href="${vid.urlM}" download="[MONTAGE]_${vid.safeFileName}.${vid.ext}" style="background: #ff003c; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center; box-shadow: 0 0 10px rgba(255,0,60,0.5);">🎬 AI HIGHLIGHT CUT</a>
                                <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">❌ DELETE</button>
                            </div>
                        </div>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlH); URL.revokeObjectURL(window.savedVideos[index].urlV); URL.revokeObjectURL(window.savedVideos[index].urlM); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } 
};
