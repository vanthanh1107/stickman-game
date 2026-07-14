// ==========================================
// RECORDER.JS - BẢN HỖ TRỢ NGANG (16:9) & DỌC (9:16)
// ĐÃ FIX LỖI: VƯỢT TƯỜNG LỬA CORS CHO GIỌNG ĐỌC AI & HIỂN THỊ SUB TRỰC TIẾP LÚC CHƠI
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];
window.recordFrameCount = 0; 

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (CỐT TRUYỆN NGẪU NHIÊN)
// ==========================================
window.StoryModeAI = {
    currentStory: null,
    isSpeaking: false,

    generateRandomStory: function(hero, enemy) {
        const timeFrames = ["At 3 AM", "After 500 hours of coding", "During a sweaty ranked match", "When I thought the game was easy", "I let my little brother play and"];
        const incidents = [`${enemy} became self-aware`, `${hero} unlocked Ultra Instinct`, "the physics engine completely broke", `a forbidden combo was unleashed`, `${enemy} started dodging everything`];
        const results = ["and I am terrified 💀", "and the result is shocking 😱", "and it broke the internet 🔥", "and instant karma hit hard 🩸", "and it was brutal 🥶"];
        const titles = [
            `🔥 NOBODY EXPECTED THIS! {hero} vs {enemy}! (SHOCKING)`,
            `😱 AI GONE WRONG! WATCH {hero} DESTROY {enemy}!`,
            `🚨 INSTANT KARMA! {enemy} REGRETS CHALLENGING {hero}!`,
            `💀 THE SHADOW REALM! {hero} ANNIHILATES {enemy}!`,
            `⚡ GOD MODE ACTIVATED! {hero} OUTPLAYS {enemy}!`
        ];

        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let p1 = r(timeFrames); let p2 = r(incidents); let p3 = r(results);
        
        let customText = `${p1},\n${p2}\n${p3}`;
        let customVoice = `${p1}, ${p2}, ${p3}`.replace(/💀|😱|🔥|🩸|🥶|📉/g, "").trim();
        let customTitle = r(titles).replace(/{hero}/g, hero.toUpperCase()).replace(/{enemy}/g, enemy.toUpperCase());

        return { title: customTitle, tiktokText: customText, voice: customVoice };
    },

    init: function(hero, enemy) {
        this.currentStory = this.generateRandomStory(hero, enemy);
        window.recordFrameCount = 0; 
    },

    playVoiceHook: function() {
        if (!this.currentStory || !window.isRecording) return;
        this.isSpeaking = true;
        
        // DÙNG CORSPROXY ĐỂ VƯỢT TƯỜNG LỬA GOOGLE (GIÚP THU ÂM ĐƯỢC GIỌNG AI)
        let ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(this.currentStory.voice)}`;
        let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ttsUrl)}`;
        
        let voice = new Audio(proxyUrl);
        voice.crossOrigin = "anonymous";
        voice.volume = 1.0; 
        
        voice.onended = () => { this.isSpeaking = false; };
        voice.onerror = () => { 
            this.isSpeaking = false; 
            console.log("Lỗi tải giọng AI - Thử link trực tiếp...");
            // Fallback nếu proxy sập
            let fbVoice = new Audio(ttsUrl); fbVoice.play().catch(e=>{});
        };
        
        voice.play().catch(e => { this.isSpeaking = false; console.error("Lỗi Autoplay (Bạn chưa click chuột vào màn hình):", e); });
    }
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ==========================================
// HỆ THỐNG BÌNH LUẬN VIÊN AI
// ==========================================
window.AICommentator = {
    timer: null,
    isSpeaking: false,
    
    getPhrases: function(hero, enemy) {
        return [
            "Oh my god, what a brutal combo!", "Did you see that? Absolutely insane!",
            "The health bar is melting faster than my motivation!", "Stop playing with your food and finish him!",
            "That dodge was straight out of the Matrix!", "Someone call an ambulance, this is getting illegal!",
            `Rumor has it ${hero} trained by punching titanium walls.`,
            `I asked ChatGPT who would win, it just replied with a skull emoji for ${enemy}.`
        ];
    },
    
    speak: function(text) {
        if (this.isSpeaking || !window.isRecording) return;
        this.isSpeaking = true;
        let ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
        let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ttsUrl)}`;
        
        let voice = new Audio(proxyUrl);
        voice.crossOrigin = "anonymous"; voice.volume = 1.0;
        voice.onended = () => { this.isSpeaking = false; };
        voice.onerror = () => { this.isSpeaking = false; };
        voice.play().catch(e => { this.isSpeaking = false; });
    },
    
    start: function(hero, enemy) {
        this.stop();
        let phrases = this.getPhrases(hero, enemy);
        this.timer = setInterval(() => {
            if (window.isRecording && window.p1 && window.p1.hp > 0 && !window.gameOver && !window.StoryModeAI.isSpeaking) {
                this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
            }
        }, 6000 + Math.random() * 4000); 
    },
    
    stop: function() {
        if (this.timer) clearInterval(this.timer);
        this.isSpeaking = false;
    }
};

// ==========================================
// HỆ THỐNG AUTO-CAPTURE TOÀN BỘ ÂM THANH
// ==========================================
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();

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
                this._routedToRecorder = true;
            } catch (e) { }
        }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };

    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { try { originalConnect.call(this, window.masterRecordDestination); } catch(e){} }
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
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || "WARRIOR"; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; }
    let enemyName = "UNKNOWN BOSS";
    if (window.enemies && window.enemies.length > 0) {
        let e0 = window.enemies[0];
        if (e0.isDragon) enemyName = "DRAGON BOSS"; else if (e0.isBruceLee) enemyName = "BRUCE LEE"; else enemyName = e0.className || "BOSS";
    }

    // Tự sinh kịch bản Story
    window.StoryModeAI.init(charName, enemyName);

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) {
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.currentStory.title);
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); let videoUrlH = URL.createObjectURL(blobH);
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); let videoUrlV = URL.createObjectURL(blobV);

                window.savedVideos.push({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.currentStory.title, 
                    safeFileName: safeFileName
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); 
    window.isRecording = true;

    // PHÁT GIỌNG ĐỌC STORY SAU 1 GIÂY
    setTimeout(() => {
        window.StoryModeAI.playVoiceHook();
        window.AICommentator.start(charName, enemyName);
    }, 1000);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); } catch(e){} 
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); 
    window.isRecording = false; 
    window.AICommentator.stop();
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

// VÁ LÕI DRAW ĐỂ CHẮC CHẮN QUAY ĐƯỢC VIDEO
if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true;
    const oldDraw = window.draw;
    window.draw = function() {
        if (oldDraw) oldDraw.apply(this, arguments);
        if (typeof window.captureFrames === 'function') window.captureFrames();
    };
}

// ==========================================
// RENDER KHUNG HÌNH (VẼ SUB LÊN VIDEO & LÊN MÀN HÌNH GAME CHÍNH)
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    window.recordFrameCount++; 
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; let gCtx = window.canvas.getContext("2d");
    
    // GHI HÌNH CHO BẢN NGANG
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    
    // GHI HÌNH CHO BẢN DỌC
    ctxV.fillStyle = "#111"; ctxV.fillRect(0, 0, 1080, 1920); ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420, 420, 1920, 1080);
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // HIỂN THỊ CÂU CHUYỆN (SUB) TRONG 4.5 GIÂY ĐẦU (~270 frames)
    if (window.StoryModeAI.currentStory && window.recordFrameCount < 270) {
        let lines = window.StoryModeAI.currentStory.tiktokText.split('\n');

        // 1. VẼ SUB LÊN VIDEO DỌC TIKTOK
        ctxV.save(); ctxV.textAlign = "center"; ctxV.font = "900 60px 'Arial Black', Arial, sans-serif";
        ctxV.fillStyle = "#ffffff"; ctxV.strokeStyle = "#000000"; ctxV.lineWidth = 12; ctxV.lineJoin = "round";
        lines.forEach((line, index) => {
            ctxV.shadowColor = "rgba(0,0,0,0.8)"; ctxV.shadowBlur = 15; ctxV.shadowOffsetX = 5; ctxV.shadowOffsetY = 5;
            ctxV.strokeText(line, 540, 220 + (index * 75));
            ctxV.shadowBlur = 0; ctxV.fillText(line, 540, 220 + (index * 75));
        });
        ctxV.restore();

        // 2. VẼ SUB TRỰC TIẾP LÊN MÀN HÌNH GAME BẠN ĐANG CHƠI (Để bạn biết nó đang nói gì)
        if (gCtx) {
            gCtx.save(); gCtx.textAlign = "center"; gCtx.font = "900 24px 'Arial Black', Arial, sans-serif";
            gCtx.fillStyle = "#ffffff"; gCtx.strokeStyle = "#000000"; gCtx.lineWidth = 6; gCtx.lineJoin = "round";
            lines.forEach((line, index) => {
                gCtx.strokeText(line, window.canvas.width/2, 100 + (index * 30));
                gCtx.fillText(line, window.canvas.width/2, 100 + (index * 30));
            });
            gCtx.restore();
        }
    }

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

        // --- HUD DỌC GHI VÀO VIDEO ---
        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px Arial";
        ctxV.textAlign = "left";
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
};

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
