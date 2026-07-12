// ==========================================
// RECORDER.JS - BẢN HỖ TRỢ SONG SONG NGANG (16:9) & DỌC (9:16)
// ĐÃ NÂNG CẤP AUTO-CAPTURE THU TOÀN BỘ MỌI ÂM THANH (BGM, READY, FIGHT, SFX)
// BẢN TỐI ƯU HUD DỌC CHO TIKTOK (THANH MÁU TRÊN CÙNG, KHÔNG CHỮ VS, SÁT KHUNG GAME)
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;

window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];

// ==========================================
// HỆ THỐNG AUTO-CAPTURE TOÀN BỘ ÂM THANH TRONG GAME
// (Khắc phục lỗi mất tiếng Ready/Fight do CORS của trình duyệt)
// ==========================================
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) {
    window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
}

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true;

    // 1. Ép CORS cho mọi đối tượng Audio mới tạo để không bị trình duyệt Mute khi quay video
    const OriginalAudio = window.Audio;
    window.Audio = function() {
        let audio = new OriginalAudio(...arguments);
        audio.crossOrigin = "anonymous"; 
        return audio;
    };

    // 2. Bắt mọi âm thanh phát ra từ đối tượng Audio (Tiếng Ready, Fight, Win...)
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        // Cấp quyền CORS ngầm nếu bị thiếu
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) {
            this.crossOrigin = "anonymous";
        }
        
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try {
                let source = window.audioCtx.createMediaElementSource(this);
                source.connect(window.masterRecordDestination); // Dẫn vào máy quay
                source.connect(window.audioCtx.destination);    // Vẫn phát ra loa ngoài
                this._routedToRecorder = true;
            } catch (e) { 
                // Bỏ qua lỗi nếu engine game đã bọc âm thanh này từ trước
            }
        }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };

    // 3. Bắt mọi âm thanh từ Web Audio API (Tiếng đấm đá, hiệu ứng vũ khí SFX...)
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0];
        // Nếu đích đến là loa tổng (AudioDestinationNode) của bất kỳ context nào
        let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        
        if (isDestination && window.masterRecordDestination) {
            try { 
                originalConnect.call(this, window.masterRecordDestination); 
            } catch(e){}
        }
        return originalConnect.apply(this, arguments);
    };
}
// ==========================================


window.initRecorder = function() {
    // KHỞI TẠO CANVAS NGANG (1920x1080)
    if (!document.getElementById("hiddenRecordCanvasH")) {
        window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080;
        window.recordCanvasH.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasH); window.recordCtxH = window.recordCanvasH.getContext("2d");
    }
    // KHỞI TẠO CANVAS DỌC (1080x1920)
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
    
    // Backup: Bắt thẻ Audio nhạc nền nếu bị sót
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try {
            if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous";
            let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase);
            bgmSrc.connect(window.masterRecordDestination);
            bgmSrc.connect(window.audioCtx.destination);
            window.bgmBase._routedToRecorder = true;
        } catch (e) { }
    }

    // Backup: Bắt mọi thẻ <audio> tĩnh có trong trang web
    document.querySelectorAll('audio').forEach(audio => {
        if (!audio._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try {
                if (!audio.crossOrigin) audio.crossOrigin = "anonymous";
                let src = window.audioCtx.createMediaElementSource(audio);
                src.connect(window.masterRecordDestination);
                src.connect(window.audioCtx.destination);
                audio._routedToRecorder = true;
            } catch(e){}
        }
    });

    // DẪN ÂM THANH TẦN SỐ 0 CHỐNG LỆCH TIẾNG
    try {
        if (window.silenceOsc) window.silenceOsc.stop();
        window.silenceOsc = window.audioCtx.createOscillator();
        let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; 
        window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination);
        window.silenceOsc.start();
    } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    
    let videoStreamH = window.recordCanvasH.captureStream(); 
    let videoStreamV = window.recordCanvasV.captureStream(); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream(); let combinedStreamV = new MediaStream();
    
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    audioTracks.forEach(track => { combinedStreamH.addTrack(track); combinedStreamV.addTrack(track); });
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm";
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) { options = { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4"; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options = { mimeType: 'video/mp4', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4"; } 
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) { options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm"; }
    
    try { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); 
    } catch (e) { 
        window.mediaRecorderH = new MediaRecorder(combinedStreamH); 
        window.mediaRecorderV = new MediaRecorder(combinedStreamV); 
    }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    // BẮT LẤY THÔNG TIN NHÂN VẬT P1 TRƯỚC KHI LƯU VIDEO ĐỂ HIỂN THỊ
    let charName = "Chiến binh"; let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) {
        let stats = window.classStats[window.p1.classId];
        charName = stats.className || "Chiến binh";
        charAvatar = stats.avatarUrl || charAvatar;
    }

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) {
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); let videoUrlH = URL.createObjectURL(blobH);
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); let videoUrlV = URL.createObjectURL(blobV);

                window.savedVideos.push({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar
                });
                window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); window.isRecording = true;
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); } catch(e){} 
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); 
    window.isRecording = false; 
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
    // Không reset Auto-Capture để sẵn sàng thu tiếp vòng đấu sau
};

// ==========================================
// THUẬT TOÁN TẢI VÀ RENDER AVATAR LÊN KHUNG VIDEO
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV;
    
    // === 1. VẼ BẢN NGANG (1920x1080) ===
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    let vignetteH = ctxH.createRadialGradient(960, 540, 500, 960, 540, 1200); vignetteH.addColorStop(0, 'rgba(0,0,0,0)'); vignetteH.addColorStop(1, 'rgba(0,0,0,0.7)'); 
    ctxH.fillStyle = vignetteH; ctxH.fillRect(0, 60, 1920, 960);

    // === 2. VẼ BẢN DỌC TIKTOK (1080x1920) ===
    ctxV.fillStyle = "#111"; ctxV.fillRect(0, 0, 1080, 1920); ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420, 420, 1920, 1080);
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // BỘ TẢI ẢNH (BẮT BUỘC CÓ CROSS-ORIGIN ĐỂ KHÔNG ĐEN MÀN HÌNH VIDEO)
    if (!window.hudImages) window.hudImages = {};
    const getHudImg = (url) => {
        if (!url) return null;
        if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url];
        if (!window.hudImages[url]) {
            let img = new Image();
            img.crossOrigin = "Anonymous"; // Giúp Canvas không chặn ghi hình
            img.src = url;
            window.hudImages[url] = img;
        }
        return null;
    };

    // === 3. VẼ HUD (GIAO DIỆN MÁU & ẢNH AVATAR) ===
    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h); } else { ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
        
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100);
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1, p2Hp = 0, isBoss = false, eStam = 0;
        
        let p1Name = (window.p1.className || "PLAYER").toUpperCase();
        let eName = "ENEMY";
        
        let p1Url = "https://i.imgur.com/q3813rX.png";
        let p2Url = "https://i.imgur.com/q3813rX.png";

        // Lấy link ảnh của Người chơi
        if (window.classStats && window.classStats[window.p1.classId]) {
            p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url;
        }

        // Lấy link ảnh của Kẻ thù
        if (window.enemies && window.enemies.length > 0) {
            let e0 = window.enemies[0];
            window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); 
            isBoss = e0.isDragon || e0.isBruceLee || e0.isSamurai || e0.isNinja;
            eStam = Math.max(0, e0.stamina / 100);
            
            let firstEnemyName = (e0.className || "ENEMY").toUpperCase();
            
            if (isBoss) {
                if (e0.isDragon) { eName = "DRAGON BOSS"; p2Url = "https://cdn-icons-png.flaticon.com/512/3069/3069035.png"; }
                else if (e0.isBruceLee) { eName = "BRUCE LEE"; p2Url = "https://cdn-icons-png.flaticon.com/512/8207/8207573.png"; }
                else if (e0.isSamurai) { eName = "SAMURAI"; p2Url = "https://cdn-icons-png.flaticon.com/512/2200/2200554.png"; }
                else if (e0.isNinja) { eName = "NINJA"; p2Url = "https://cdn-icons-png.flaticon.com/512/3932/3932087.png"; }
            } else {
                eName = `${firstEnemyName}` + (window.enemies.length > 1 ? ` x${window.enemies.length}` : "");
                if (window.classStats && window.classStats[e0.classId]) p2Url = window.classStats[e0.classId].avatarUrl || p2Url;
            }
        }

        let img1 = getHudImg(p1Url);
        let img2 = getHudImg(p2Url);

        // ==========================================
        // --- VẼ HUD BẢN NGANG ---
        // ==========================================
        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.font = "900 48px Arial"; ctxH.textAlign = "left";
        
        // Vẽ Avatar P1
        if (img1) {
            ctxH.save();
            ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(70, 25, 55, 55, 6); else ctxH.rect(70, 25, 55, 55); ctxH.clip();
            ctxH.drawImage(img1, 70, 25, 55, 55); ctxH.restore();
            ctxH.lineWidth = 4; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(70, 25, 55, 55);
        }
        ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 145, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 145, 72);
        
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);

        // Vẽ Avatar Kẻ địch (Ngang)
        if (window.enemies && window.enemies.length > 0) {
            ctxH.textAlign = "right"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; 
            if (img2) {
                ctxH.save();
                ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(1795, 25, 55, 55, 6); else ctxH.rect(1795, 25, 55, 55); ctxH.clip();
                ctxH.drawImage(img2, 1795, 25, 55, 55); ctxH.restore();
                ctxH.lineWidth = 4; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(1795, 25, 55, 55);
            }
            ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1780, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1780, 72);
            
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, isBoss ? "#c0392b" : "#1e90ff"); hpGrad.addColorStop(1, isBoss ? "#e74c3c" : "#70a1ff"); drawSkewedPath(ctxH, 1090 + (750 - 750 * p2Hp), 90, 750 * p2Hp, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }
        ctxH.textAlign = "center"; ctxH.font = "italic 900 80px Arial"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText("VS", 960, 130); let vsGrad = ctxH.createLinearGradient(0, 50, 0, 140); vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22"); ctxH.fillStyle = vsGrad; ctxH.fillText("VS", 960, 130);

        // ==========================================
        // --- VẼ HUD BẢN DỌC TỐI ƯU TIKTOK ---
        // ==========================================
        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px Arial";
        
        // Vẽ P1 Dọc (Góc trên bên TRÁI)
        ctxV.textAlign = "left";
        if (img1) {
            ctxV.save();
            ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(40, 280, 80, 80, 10); else ctxV.rect(40, 280, 80, 80); ctxV.clip();
            ctxV.drawImage(img1, 40, 280, 80, 80); ctxV.restore();
            ctxV.lineWidth = 5; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(40, 280, 80, 80);
        }
        ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(p1Name, 140, 320); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 140, 320);
        
        // HP P1
        drawSkewedPath(ctxV, 140, 335, 380, 40, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
        if (p1Hp > 0) { 
            let hpGradV = ctxV.createLinearGradient(140, 0, 520, 0); 
            hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); 
            drawSkewedPath(ctxV, 140, 335, 380 * p1Hp, 40, true); ctxV.fillStyle = hpGradV; ctxV.fill(); 
        }
        // Thể lực P1
        ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(140, 385, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(140, 385, 300 * p1Stam, 15);

        // Vẽ Kẻ Địch Dọc (Góc trên bên PHẢI)
        if (window.enemies && window.enemies.length > 0) {
            ctxV.textAlign = "right"; 
            if (img2) {
                ctxV.save();
                ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(960, 280, 80, 80, 10); else ctxV.rect(960, 280, 80, 80); ctxV.clip();
                ctxV.drawImage(img2, 960, 280, 80, 80); ctxV.restore();
                ctxV.lineWidth = 5; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(960, 280, 80, 80);
            }
            ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 940, 320); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 940, 320);
            
            // HP Kẻ Địch
            drawSkewedPath(ctxV, 560, 335, 380, 40, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p2Hp > 0) { 
                let hpGradV2 = ctxV.createLinearGradient(560, 0, 940, 0); 
                hpGradV2.addColorStop(0, isBoss ? "#c0392b" : "#1e90ff"); hpGradV2.addColorStop(1, isBoss ? "#e74c3c" : "#70a1ff"); 
                let eHpWidth = 380 * p2Hp;
                drawSkewedPath(ctxV, 560 + (380 - eHpWidth), 335, eHpWidth, 40, false); 
                ctxV.fillStyle = hpGradV2; ctxV.fill(); 
            }
            // Thể lực Kẻ Địch
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(640, 385, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(640 + (300 - (300 * eStam)), 385, 300 * eStam, 15);
        }
    }
};

window.captureFrameTo1080p = window.captureFrames;

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 20px; background: #0a0d14; border-radius: 12px; border: 1px solid #1e293b; max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 KHO LƯU TRỮ TRẬN ĐẤU</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">Chưa có dữ liệu. Bấm "Thoát" sau khi đánh để hệ thống xử lý video!</p>`; return; }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 KHO LƯU TRỮ TRẬN ĐẤU (${window.savedVideos.length})</h3><div style="display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; padding-right: 5px;">`;
    
    window.savedVideos.forEach((vid, index) => { 
        html += `<div style="display: flex; justify-content: space-between; align-items: center; background: #141a27; padding: 12px 18px; border-radius: 8px; border: 1px solid #334155; box-shadow: inset 0 0 5px rgba(0,0,0,0.3);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${vid.heroAvatar}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #00f3ff; box-shadow: 0 0 8px rgba(0, 243, 255, 0.3);">
                        <div style="text-align: left; display: flex; flex-direction: column;">
                            <span style="font-weight: 700; color: #f8fafc; font-family: 'Teko', sans-serif; font-size: 22px; letter-spacing: 1px;">${vid.heroName}</span>
                            <span style="font-size: 13px; color: #94a3b8; font-weight: 600;">🕒 Thời gian: ${vid.timestamp}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="${vid.urlH}" download="${vid.heroName}_Ngang_1080p.${vid.ext}" style="background: #ff003c; color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-family: 'Teko', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 2px 5px rgba(255,0,60,0.3); transition: 0.2s;">📥 NGANG</a>
                        <a href="${vid.urlV}" download="${vid.heroName}_TikTok.${vid.ext}" style="background: #00f3ff; color: #0a0d14; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-family: 'Teko', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 2px 5px rgba(0,243,255,0.3); transition: 0.2s;">📱 DỌC (Tiktok)</a>
                        <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s;">❌</button>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { 
        URL.revokeObjectURL(window.savedVideos[index].urlH); 
        URL.revokeObjectURL(window.savedVideos[index].urlV); 
        window.savedVideos.splice(index, 1); 
        window.updateVideoListUI(); 
    } 
};
