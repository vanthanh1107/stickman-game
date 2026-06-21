// ==========================================
// RECORDER.JS - HỆ THỐNG QUAY VIDEO 1080P BITRATE CAO KÈM HUD VÀ ÂM THANH TRẬN ĐẤU
// ==========================================

window.mediaRecorder = null;
window.recordedChunks = [];
window.recordCanvas = null;
window.recordCtx = null;
window.isRecording = false;
window.recordAudioDestination = null;

window.savedVideos = [];

// 1. Khởi tạo canvas ẩn độ phân giải cao 1080p
window.initRecorder = function() {
    window.recordCanvas = document.createElement("canvas");
    window.recordCanvas.width = 1920;
    window.recordCanvas.height = 1080;
    window.recordCtx = window.recordCanvas.getContext("2d");
    
    setTimeout(() => { if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI(); }, 1000);
};

// 2. Bắt đầu thu luồng stream trận đấu (Gồm cả Hình Ảnh 1080p và Âm Thanh Đánh Nhau)
window.startRecording = function() {
    if (window.isRecording) return;
    if (!window.recordCanvas) window.initRecorder();
    
    // Đảm bảo AudioContext đã được khởi tạo để trích xuất luồng âm thanh song song
    if (!window.audioCtx) {
        window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();

    // Tạo "bể chứa" thu âm âm thanh ngầm kết nối trực tiếp với bộ xử lý game
    try {
        window.recordAudioDestination = window.audioCtx.createMediaStreamDestination();
    } catch (e) {
        console.error("Thiết bị không hỗ trợ MediaStream Destination Node:", e);
    }
    
    window.recordedChunks = [];
    
    // Khởi tạo luồng hỗn hợp trống để gom cả hình lẫn tiếng
    let combinedStream = new MediaStream();
    
    // Lấy luồng Video từ Canvas 1080p ẩn (Chạy chuẩn 60 khung hình/giây mượt mà)
    let videoStream = window.recordCanvas.captureStream(60); 
    videoStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    
    // Lấy luồng Âm thanh từ Audio Node đính kèm vào luồng tổng hợp của video
    if (window.recordAudioDestination && window.recordAudioDestination.stream) {
        let audioTracks = window.recordAudioDestination.stream.getAudioTracks();
        audioTracks.forEach(track => combinedStream.addTrack(track));
    }
    
    // Ép băng thông video lên 25Mbps (Chất lượng Ultra HD chống nhiễu, chống mờ vỡ hạt tuyệt đối)
    let options = { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 25000000 };
    try {
        window.mediaRecorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
        // Phương án dự phòng cho Safari hoặc các thiết bị iOS đời cũ sử dụng codec VP8
        options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 25000000 };
        try {
            window.mediaRecorder = new MediaRecorder(combinedStream, options);
        } catch (err) {
            window.mediaRecorder = new MediaRecorder(combinedStream);
        }
    }

    window.mediaRecorder.ondataavailable = function(event) {
        if (event.data && event.data.size > 0) {
            window.recordedChunks.push(event.data);
        }
    };

    window.mediaRecorder.onstop = function() {
        let blob = new Blob(window.recordedChunks, { type: 'video/webm' });
        let videoUrl = URL.createObjectURL(blob);
        
        window.savedVideos.push({
            id: Date.now(),
            url: videoUrl,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        
        window.updateVideoListUI();
        console.log("🎬 Trận đấu đã được ghi hình và thu âm ở chất lượng tối đa!");
    };

    window.mediaRecorder.start(100); 
    window.isRecording = true;
};

window.stopRecording = function() {
    if (!window.isRecording || !window.mediaRecorder) return;
    window.mediaRecorder.stop();
    window.isRecording = false;
};

// ==========================================
// THUẬT TOÁN VẼ GIAO DIỆN ARCADE NATIVE 1080P VÀ BỘ LỌC ĐIỆN ẢNH
// ==========================================
window.captureFrameTo1080p = function() {
    if (!window.isRecording || !window.recordCtx || !window.canvas) return;
    
    let ctx = window.recordCtx;

    // 1. Phủ nền đen toàn màn hình (Tạo viền điện ảnh trên dưới)
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, 1920, 1080);
    
    // 2. Chép khung hình game (Pixel Perfect - Tắt làm mờ tự động khi upscale)
    ctx.imageSmoothingEnabled = false; 
    ctx.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    
    // 3. Phủ bộ lọc Vignette điện ảnh làm tối nhẹ 4 góc màn hình
    let vignette = ctx.createRadialGradient(960, 540, 500, 960, 540, 1200);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 60, 1920, 960);

    // =====================================
    // 4. VẼ HUD THANH MÁU CHUẨN VECTOR 1080P
    // =====================================
    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        ctx.lineJoin = "round";
        
        const drawSkewedPath = (x, y, w, h, isLeft) => {
            ctx.beginPath();
            if (isLeft) {
                ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h);
            } else {
                ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h);
            }
            ctx.closePath();
        };

        // -------- NGƯỜI CHƠI BÊN TRÁI --------
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp);
        let p1Stam = Math.max(0, window.p1.stamina / 100);
        
        // Tên P1 bọc viền chữ đậm nét
        ctx.font = "900 48px Arial";
        ctx.textAlign = "left";
        ctx.lineWidth = 8; ctx.strokeStyle = "#000";
        let p1Name = "👤 " + (window.p1.className || "PLAYER").toUpperCase();
        ctx.strokeText(p1Name, 70, 75);
        ctx.fillStyle = "#fff";
        ctx.fillText(p1Name, 70, 75);
        
        // Nền thanh máu P1
        drawSkewedPath(80, 90, 750, 45, true);
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fill();
        ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.stroke();
        
        // Lõi máu P1 (Hiệu ứng màu Gradient đổ vát chéo)
        if (p1Hp > 0) {
            let hpGrad1 = ctx.createLinearGradient(80, 0, 830, 0);
            hpGrad1.addColorStop(0, "#ff4757"); hpGrad1.addColorStop(1, "#ff7f50");
            drawSkewedPath(80, 90, 750 * p1Hp, 45, true);
            ctx.fillStyle = hpGrad1; ctx.fill();
        }
        
        // Thanh thể lực P1
        ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(60, 145, 400, 15);
        ctx.fillStyle = "#f1c40f"; ctx.fillRect(60, 145, 400 * p1Stam, 15);

        // -------- KẺ ĐỊCH BÊN PHẢI --------
        if (window.enemies && window.enemies.length > 0) {
            let eHp = 0, eMax = window.totalEnemyMaxHp || 1;
            window.enemies.forEach(e => eHp += Math.max(0, e.hp));
            let p2Hp = Math.max(0, eHp / eMax);
            let isBoss = window.enemies[0].isDragon;
            let eStam = Math.max(0, window.enemies[0].stamina / 100);
            
            // Tên P2 bọc viền chữ đậm nét
            ctx.textAlign = "right";
            let eName = isBoss ? "🐉 DRAGON BOSS" : `🤖 ĐỘI QUÂN ĐỊCH x${window.enemies.length}`;
            ctx.lineWidth = 8; ctx.strokeStyle = "#000";
            ctx.strokeText(eName, 1850, 75);
            ctx.fillStyle = "#fff";
            ctx.fillText(eName, 1850, 75);
            
            // Nền thanh máu P2
            drawSkewedPath(1090, 90, 750, 45, false);
            ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fill();
            ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.stroke();
            
            // Lõi máu P2 (Rút cạn mượt mà từ trái qua phải)
            if (p2Hp > 0) {
                let hpGrad2 = ctx.createLinearGradient(1090, 0, 1840, 0);
                hpGrad2.addColorStop(0, isBoss ? "#c0392b" : "#1e90ff"); 
                hpGrad2.addColorStop(1, isBoss ? "#e74c3c" : "#70a1ff");
                
                let p2HpWidth = 750 * p2Hp;
                drawSkewedPath(1090 + (750 - p2HpWidth), 90, p2HpWidth, 45, false);
                ctx.fillStyle = hpGrad2; ctx.fill();
            }
            
            // Thanh thể lực P2
            ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(1460, 145, 400, 15);
            ctx.fillStyle = "#f1c40f"; ctx.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }

        // -------- BIỂU TƯỢNG VS Ở TÂM ĐIỂM --------
        ctx.textAlign = "center";
        ctx.font = "italic 900 80px Arial";
        ctx.lineWidth = 10; ctx.strokeStyle = "#000";
        ctx.strokeText("VS", 960, 130);
        let vsGrad = ctx.createLinearGradient(0, 50, 0, 140);
        vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22");
        ctx.fillStyle = vsGrad;
        ctx.fillText("VS", 960, 130);
    }
};

// ==========================================
// KỸ THUẬT ĐỒNG BỘ LUỒNG SÓNG ÂM THANH VÀO VIDEO
// ==========================================
const originalPlaySound = window.playSound;
window.playSound = function(freq, type, duration, vol, isImpact = false) {
    if (typeof originalPlaySound === 'function') {
        originalPlaySound(freq, type, duration, vol, isImpact);
    }
    
    // Nếu hệ thống ghi hình đang chạy, tiến hành trích sao sóng âm đưa thẳng vào MediaRecorder ngầm
    if (window.isRecording && window.audioCtx && window.recordAudioDestination) {
        try {
            let t = window.audioCtx.currentTime;
            let osc = window.audioCtx.createOscillator();
            let gain = window.audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(window.recordAudioDestination); // Kết nối nút tổng hợp âm của video
            
            if (isImpact) {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.exponentialRampToValueAtTime(30, t + duration);
                gain.gain.setValueAtTime(vol * 2.5, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq * 0.5, t);
                osc.frequency.linearRampToValueAtTime(freq, t + duration * 0.5);
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(vol * 1.5, t + duration * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
            }
            osc.start(t);
            osc.stop(t + duration);
        } catch(e) {}
    }
};

// ==========================================
// HỆ THỐNG GIAO DIỆN DANH SÁCH LƯU TRỮ DƯỚI ĐÁY
// ==========================================
window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "video-list-container";
        container.style.cssText = "margin-top: 35px; padding: 20px; background: #2f3542; border-radius: 12px; border: 2px solid #57606f; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
        let gameContainer = document.getElementById("game-container");
        if (gameContainer) gameContainer.appendChild(container);
        else document.body.appendChild(container);
    }
    
    if (window.savedVideos.length === 0) {
        container.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #f1c40f; text-align: center; font-style: italic; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (1080P ULTRA HD)</h3>
            <p style="text-align: center; color: #a4b0be; margin: 0; font-size: 14px;">Chưa có video trận đấu nào được lưu. Bấm "Thoát" sau khi đánh để lưu video vào danh sách!</p>
        `;
        return;
    }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #f1c40f; text-align: center; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (${window.savedVideos.length})</h3>`;
    html += `<div style="display: flex; flex-direction: column; gap: 12px; max-height: 280px; overflow-y: auto; padding-right: 5px;">`;
    
    window.savedVideos.forEach((vid, index) => {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #353b48; padding: 12px 18px; border-radius: 8px; border: 1px solid #747d8c; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);">
                <div style="text-align: left;">
                    <span style="font-weight: bold; color: #2ecc71; font-size: 15px;">🎬 HIGHLIGHT BATTLE #${index + 1}</span>
                    <span style="font-size: 12px; color: #ced6e0; margin-left: 12px; background: #57606f; padding: 2px 6px; border-radius: 4px;">🕒 ${vid.timestamp}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="${vid.url}" download="Stickman_1080p_UltraHD_${index + 1}.webm" style="background: #2ecc71; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 5px rgba(46,204,113,0.3); transition: 0.2s;">📥 TẢI MP4 1080P</a>
                    <button onclick="window.deleteVideo(${vid.id})" style="background: #ff4757; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer; box-shadow: 0 2px 5px rgba(255,71,87,0.3); transition: 0.2s;">❌ XÓA</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
};

window.deleteVideo = function(id) {
    let index = window.savedVideos.findIndex(v => v.id === id);
    if (index !== -1) {
        URL.revokeObjectURL(window.savedVideos[index].url);
        window.savedVideos.splice(index, 1);
        window.updateVideoListUI();
    }
};
