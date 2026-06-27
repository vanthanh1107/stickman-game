// ==========================================
// RECORDER.JS - BẢN HỖ TRỢ SONG SONG NGANG (16:9) & DỌC (9:16)
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;

window.isRecording = false; 
window.recordAudioDestination = null; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];

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
    if (!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    // TẠO ỐNG DẪN ÂM THANH
    try { window.recordAudioDestination = window.audioCtx.createMediaStreamDestination(); } catch (e) { }
    
    // DẪN ÂM THANH TẦN SỐ 0 CHỐNG LỆCH TIẾNG
    try {
        if (window.silenceOsc) window.silenceOsc.stop();
        window.silenceOsc = window.audioCtx.createOscillator();
        let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; 
        window.silenceOsc.connect(silenceGain); silenceGain.connect(window.recordAudioDestination);
        window.silenceOsc.start();
    } catch(e) {}
    
    window.recordedChunksH = [];
    window.recordedChunksV = [];
    
    let videoStreamH = window.recordCanvasH.captureStream(); 
    let videoStreamV = window.recordCanvasV.captureStream(); 
    let audioTracks = (window.recordAudioDestination && window.recordAudioDestination.stream) ? window.recordAudioDestination.stream.getAudioTracks() : [];
    
    let combinedStreamH = new MediaStream();
    let combinedStreamV = new MediaStream();
    
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    // Dùng chung track audio cho cả 2 luồng
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

    // Xử lý lưu cả 2 video khi dừng
    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) {
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); 
                let videoUrlH = URL.createObjectURL(blobH);
                
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); 
                let videoUrlV = URL.createObjectURL(blobV);

                window.savedVideos.push({ 
                    id: Date.now(), 
                    urlH: videoUrlH, 
                    urlV: videoUrlV, 
                    ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                });
                window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings;
    window.mediaRecorderV.onstop = finalizeRecordings;

    window.mediaRecorderH.start(); 
    window.mediaRecorderV.start(); 
    window.isRecording = true;
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); } catch(e){} 
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); 
    window.isRecording = false; 
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

// VẼ HUD & CẮT KHUNG HÌNH (CHO CẢ 2 BẢN)
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    
    let ctxH = window.recordCtxH;
    let ctxV = window.recordCtxV;
    
    // === 1. VẼ BẢN NGANG (1920x1080) ===
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    let vignetteH = ctxH.createRadialGradient(960, 540, 500, 960, 540, 1200); vignetteH.addColorStop(0, 'rgba(0,0,0,0)'); vignetteH.addColorStop(1, 'rgba(0,0,0,0.7)'); 
    ctxH.fillStyle = vignetteH; ctxH.fillRect(0, 60, 1920, 960);

    // === 2. VẼ BẢN DỌC TIKTOK (1080x1920) ===
    // Căn giữa khung hình ngang 1920x1080 vào giữa khung dọc 1080x1920 (crop hai bên)
    ctxV.fillStyle = "#111"; ctxV.fillRect(0, 0, 1080, 1920); ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420, 420, 1920, 1080);
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // === 3. VẼ HUD (GIAO DIỆN MÁU) ===
    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h); } else { ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100);
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1, p2Hp = 0, isBoss = false, eStam = 0, eName = "";
        
        if (window.enemies && window.enemies.length > 0) {
            window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); 
            isBoss = window.enemies[0].isDragon; eStam = Math.max(0, window.enemies[0].stamina / 100);
            eName = isBoss ? "🐉 DRAGON BOSS" : `🤖 ĐỘI QUÂN ĐỊCH x${window.enemies.length}`;
        }
        let p1Name = "👤 " + (window.p1.className || "PLAYER").toUpperCase();

        // --- VẼ HUD CHO BẢN NGANG ---
        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000";
        // P1 Ngang
        ctxH.font = "900 48px Arial"; ctxH.textAlign = "left"; ctxH.strokeText(p1Name, 70, 75); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 70, 75);
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);
        // Địch Ngang
        if (window.enemies && window.enemies.length > 0) {
            ctxH.textAlign = "right"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1850, 75); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1850, 75);
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, isBoss ? "#c0392b" : "#1e90ff"); hpGrad.addColorStop(1, isBoss ? "#e74c3c" : "#70a1ff"); drawSkewedPath(ctxH, 1090 + (750 - 750 * p2Hp), 90, 750 * p2Hp, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }
        ctxH.textAlign = "center"; ctxH.font = "italic 900 80px Arial"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText("VS", 960, 130); let vsGrad = ctxH.createLinearGradient(0, 50, 0, 140); vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22"); ctxH.fillStyle = vsGrad; ctxH.fillText("VS", 960, 130);

        // --- VẼ HUD CHO BẢN DỌC ---
        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000";
        // P1 Dọc (Góc trên)
        ctxV.font = "900 55px Arial"; ctxV.textAlign = "left"; ctxV.strokeText(p1Name, 50, 140); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 50, 140);
        drawSkewedPath(ctxV, 50, 160, 930, 55, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 6; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
        if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(50, 0, 980, 0); hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxV, 50, 160, 930 * p1Hp, 55, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
        ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(50, 230, 500, 20); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(50, 230, 500 * p1Stam, 20);
        // Địch Dọc (Góc dưới)
        if (window.enemies && window.enemies.length > 0) {
            ctxV.textAlign = "right"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 1030, 1640); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 1030, 1640);
            drawSkewedPath(ctxV, 100, 1660, 930, 55, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 6; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(100, 0, 1030, 0); hpGradV2.addColorStop(0, isBoss ? "#c0392b" : "#1e90ff"); hpGradV2.addColorStop(1, isBoss ? "#e74c3c" : "#70a1ff"); drawSkewedPath(ctxV, 100 + (930 - 930 * p2Hp), 1660, 930 * p2Hp, 55, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(530, 1735, 500, 20); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(530 + (500 - (500 * eStam)), 1735, 500 * eStam, 20);
        }
        ctxV.textAlign = "center"; ctxV.font = "italic 900 100px Arial"; ctxV.lineWidth = 12; ctxV.strokeStyle = "#000"; ctxV.strokeText("VS", 540, 350); let vsGradV = ctxV.createLinearGradient(0, 250, 0, 360); vsGradV.addColorStop(0, "#f1c40f"); vsGradV.addColorStop(1, "#e67e22"); ctxV.fillStyle = vsGradV; ctxV.fillText("VS", 540, 350);
    }
};

// GHI ĐÈ TÊN HÀM CŨ ĐỂ KHÔNG PHẢI SỬA BÊN ENGINE
window.captureFrameTo1080p = window.captureFrames;

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 20px; background: #2f3542; border-radius: 12px; border: 2px solid #57606f; max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #f1c40f; text-align: center; font-style: italic;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU</h3><p style="text-align: center; color: #a4b0be; margin: 0; font-size: 14px;">Chưa có video trận đấu nào được lưu. Bấm "Thoát" sau khi đánh để lưu video vào danh sách!</p>`; return; }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #f1c40f; text-align: center; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (${window.savedVideos.length})</h3><div style="display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; padding-right: 5px;">`;
    window.savedVideos.forEach((vid, index) => { 
        let labelName = vid.ext.toUpperCase(); 
        html += `<div style="display: flex; justify-content: space-between; align-items: center; background: #353b48; padding: 12px 18px; border-radius: 8px; border: 1px solid #747d8c; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);">
                    <div style="text-align: left;">
                        <span style="font-weight: bold; color: #2ecc71; font-size: 15px;">🎬 HIGHLIGHT BATTLE #${index + 1}</span>
                        <span style="font-size: 12px; color: #ced6e0; margin-left: 12px; background: #57606f; padding: 2px 6px; border-radius: 4px;">🕒 ${vid.timestamp}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="${vid.urlH}" download="Stickman_Ngang_1080p_${index + 1}.${vid.ext}" style="background: #3498db; color: #fff; text-decoration: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 5px rgba(52,152,219,0.3); transition: 0.2s;">📥 TẢI NGANG</a>
                        <a href="${vid.urlV}" download="Stickman_Doc_1080p_${index + 1}.${vid.ext}" style="background: #9b59b6; color: #fff; text-decoration: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 5px rgba(155,89,182,0.3); transition: 0.2s;">📱 TẢI DỌC (TikTok)</a>
                        <button onclick="window.deleteVideo(${vid.id})" style="background: #ff4757; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer; box-shadow: 0 2px 5px rgba(255,71,87,0.3); transition: 0.2s;">❌ XÓA</button>
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
