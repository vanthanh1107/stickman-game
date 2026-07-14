// ==========================================
// RECORDER.JS - BẢN HỖ TRỢ NGANG (16:9) & DỌC (9:16)
// [NEW] TÍCH HỢP HỆ THỐNG STORYTELLING AI NGẪU NHIÊN BẰNG TIẾNG ANH (MILLIONS OF COMBINATIONS)
// TỰ ĐỘNG CHÈN HOOK TIKTOK, GIỌNG ĐỌC ENG, LORE TRONG TRẬN & TIÊU ĐỀ CLICKBAIT
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];
window.recordFrameCount = 0; // Biến đếm frame để tắt text sau 5 giây

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (CỐT TRUYỆN NGẪU NHIÊN CHUẨN VIRAL)
// ==========================================
window.StoryModeAI = {
    currentStory: null,
    isSpeaking: false,

    // Cỗ máy tạo câu chuyện ngẫu nhiên (Mad-libs style)
    generateRandomStory: function(hero, enemy) {
        const timeFrames = [
            "At 3 AM", 
            "After 500 hours of coding", 
            "During a sweaty ranked match", 
            "When I thought the game was easy", 
            "I let my little brother play and",
            "I asked AI to design a boss and"
        ];
        
        const incidents = [
            `${enemy} became self-aware`, 
            `${hero} unlocked Ultra Instinct`, 
            "the physics engine completely broke", 
            `a forbidden combo was unleashed`, 
            `${enemy} started dodging everything`,
            `${hero} hit the most illegal move`
        ];
        
        const results = [
            "and I am terrified 💀", 
            "and the result is shocking 😱", 
            "and it broke the internet 🔥", 
            "and instant karma hit hard 🩸", 
            "and it was absolutely brutal 🥶",
            "and someone broke their keyboard 📉"
        ];
        
        const titles = [
            `🔥 NOBODY EXPECTED THIS! {hero} vs {enemy}! (SHOCKING)`,
            `😱 AI GONE WRONG! WATCH {hero} DESTROY {enemy}!`,
            `🚨 INSTANT KARMA! {enemy} REGRETS CHALLENGING {hero}!`,
            `💀 THE SHADOW REALM! {hero} ANNIHILATES {enemy}!`,
            `⚡ GOD MODE ACTIVATED! {hero} OUTPLAYS {enemy}!`,
            `🤯 99% OF PLAYERS CAN'T DO THIS SICK COMBO!`,
            `😈 NEVER TAUNT A {hero} MAIN! FULL FIGHT VS {enemy}!`,
            `🥶 BROKEN MECHANIC? {hero} HUMILIATES {enemy}!`,
            `🏆 RANK 1 {hero} EXPOSES {enemy}'S WEAKNESS!`,
            `👀 EVERYONE THOUGHT {enemy} WON... UNTIL THIS HAPPENED!`
        ];

        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        let p1 = r(timeFrames);
        let p2 = r(incidents);
        let p3 = r(results);
        
        // Tạo Text Hook trên màn hình
        let customText = `${p1},\n${p2}\n${p3}`;
        // Tạo giọng đọc (loại bỏ emoji để Google TTS đọc mượt)
        let customVoice = `${p1}, ${p2}, ${p3}`.replace(/💀|😱|🔥|🩸|🥶|📉/g, "").trim();
        // Tạo Tiêu đề
        let customTitle = r(titles).replace(/{hero}/g, hero.toUpperCase()).replace(/{enemy}/g, enemy.toUpperCase());

        return {
            title: customTitle,
            tiktokText: customText,
            voice: customVoice
        };
    },

    init: function(hero, enemy) {
        this.currentStory = this.generateRandomStory(hero, enemy);
        window.recordFrameCount = 0; 
    },

    playVoiceHook: function() {
        if (!this.currentStory || !window.isRecording) return;
        this.isSpeaking = true;
        
        // Sử dụng Google TTS Tiếng Anh (chuẩn giọng Tiktok basic)
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(this.currentStory.voice)}`;
        let voice = new Audio(url);
        voice.crossOrigin = "anonymous";
        voice.volume = 1.0; 
        
        voice.onended = () => { this.isSpeaking = false; };
        voice.onerror = () => { this.isSpeaking = false; };
        
        voice.play().catch(e => { this.isSpeaking = false; console.log("Blocked by browser:", e); });
    }
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ==========================================
// HỆ THỐNG BÌNH LUẬN VIÊN AI TỰ ĐỘNG (ENGLISH + RANDOM LORE)
// ==========================================
window.AICommentator = {
    timer: null,
    isSpeaking: false,
    
    getPhrases: function(hero, enemy) {
        return [
            "Oh my god, what a brutal combo!",
            "Did you see that? Absolutely insane!",
            "The health bar is melting faster than my motivation!",
            "Stop playing with your food and finish him!",
            "That dodge was straight out of the Matrix!",
            "Someone call an ambulance, this is getting illegal!",
            "According to my AI calculations, that hurt a lot.",
            `Fun fact: ${enemy} is currently re-evaluating their life choices.`,
            `Rumor has it ${hero} trained by punching titanium walls. Let's see if it pays off.`,
            `I asked ChatGPT who would win, it just replied with a skull emoji for ${enemy}.`,
            `Wait, is ${hero} using a cheat code right now?`,
            `If ${enemy} survives this, I will literally delete my own source code.`
        ];
    },
    
    speak: function(text) {
        if (this.isSpeaking || !window.isRecording) return;
        this.isSpeaking = true;
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
        let voice = new Audio(url);
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
                let r = Math.floor(Math.random() * phrases.length);
                this.speak(phrases[r]);
            }
        }, 6000 + Math.random() * 4000); // Random 6 - 10s
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
    window.recordCtxH.fillStyle = "#050505"; window.recordCtxH.fillRect(0, 0, 1920, 1080);
    window.recordCtxV.fillStyle = "#050505"; window.recordCtxV.fillRect(0, 0, 1080, 1920);
    setTimeout(() => { if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI(); }, 1000);
};

window.startRecording = function() {
    if (window.isRecording) return; if (!window.recordCanvasH || !window.recordCanvasV) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    // Thu âm BGM
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try {
            if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous";
            let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase);
            bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination);
            window.bgmBase._routedToRecorder = true;
        } catch (e) { }
    }

    // Luồng câm để ép chạy Recorder
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

    // --- LẤY TÊN VÀ KHỞI TẠO STORY ---
    let charName = "WARRIOR"; let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) {
        charName = window.classStats[window.p1.classId].className || "WARRIOR"; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    }
    let enemyName = "UNKNOWN BOSS";
    if (window.enemies && window.enemies.length > 0) {
        let e0 = window.enemies[0];
        if (e0.isDragon) enemyName = "DRAGON BOSS"; else if (e0.isBruceLee) enemyName = "BRUCE LEE"; else enemyName = e0.className || "BOSS";
    }

    // Khởi tạo Kịch bản siêu ngẫu nhiên
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
                window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); 
    window.isRecording = true;

    // PHÁT GIỌNG ĐỌC STORY (Voice Hook) TRÌ HOÃN 1 GIÂY
    setTimeout(() => {
        window.StoryModeAI.playVoiceHook();
        // Sau đó gọi Commentator bắt đầu
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

// ==========================================
// THUẬT TOÁN RENDER CANVAS & CHÈN TEXT TIKTOK
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    window.recordFrameCount++; 
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV;
    
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    let vignetteH = ctxH.createRadialGradient(960, 540, 500, 960, 540, 1200); vignetteH.addColorStop(0, 'rgba(0,0,0,0)'); vignetteH.addColorStop(1, 'rgba(0,0,0,0.7)'); 
    ctxH.fillStyle = vignetteH; ctxH.fillRect(0, 60, 1920, 960);

    ctxV.fillStyle = "#111"; ctxV.fillRect(0, 0, 1080, 1920); ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420, 420, 1920, 1080);
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // [NEW] CHÈN CÂU CHUYỆN (HOOK TIKTOK) VÀO BẢN DỌC TRONG 4.5 GIÂY ĐẦU (~270 frames)
    if (window.StoryModeAI.currentStory && window.recordFrameCount < 270) {
        ctxV.save();
        ctxV.textAlign = "center";
        ctxV.font = "900 60px 'Arial Black', Arial, sans-serif";
        ctxV.fillStyle = "#ffffff";
        ctxV.strokeStyle = "#000000";
        ctxV.lineWidth = 12;
        ctxV.lineJoin = "round";
        
        let lines = window.StoryModeAI.currentStory.tiktokText.split('\n');
        let startY = 220; 
        
        lines.forEach((line, index) => {
            ctxV.shadowColor = "rgba(0,0,0,0.8)";
            ctxV.shadowBlur = 15; ctxV.shadowOffsetX = 5; ctxV.shadowOffsetY = 5;
            ctxV.strokeText(line, 540, startY + (index * 75));
            ctxV.shadowBlur = 0; 
            ctxV.fillText(line, 540, startY + (index * 75));
        });
        ctxV.restore();
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

        // --- HUD NGANG ---
        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.font = "900 48px Arial"; ctxH.textAlign = "left";
        if (img1) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(70, 25, 55, 55, 6); else ctxH.rect(70, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img1, 70, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(70, 25, 55, 55); }
        ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 145, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 145, 72);
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);

        if (window.enemies && window.enemies.length > 0) {
            ctxH.textAlign = "right"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; 
            if (img2) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(1795, 25, 55, 55, 6); else ctxH.rect(1795, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img2, 1795, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(1795, 25, 55, 55); }
            ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1780, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1780, 72);
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, "#c0392b"); hpGrad.addColorStop(1, "#e74c3c"); drawSkewedPath(ctxH, 1090 + (750 - 750 * p2Hp), 90, 750 * p2Hp, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }
        ctxH.textAlign = "center"; ctxH.font = "italic 900 80px Arial"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText("VS", 960, 130); let vsGrad = ctxH.createLinearGradient(0, 50, 0, 140); vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22"); ctxH.fillStyle = vsGrad; ctxH.fillText("VS", 960, 130);

        // --- HUD DỌC (Đã đẩy xuống để không che chữ) ---
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
