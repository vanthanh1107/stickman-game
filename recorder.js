// ==========================================
// RECORDER.JS - HỆ THỐNG LƯU TRỮ VIDEO 1080P KÈM GIAO DIỆN (HUD) SIÊU NÉT
// ==========================================

window.mediaRecorder = null;
window.recordedChunks = [];
window.recordCanvas = null;
window.recordCtx = null;
window.isRecording = false;

window.savedVideos = [];

// 1. Khởi tạo canvas ẩn độ phân giải cao 1080p
window.initRecorder = function() {
    window.recordCanvas = document.createElement("canvas");
    window.recordCanvas.width = 1920;
    window.recordCanvas.height = 1080;
    window.recordCtx = window.recordCanvas.getContext("2d");
    
    setTimeout(() => { if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI(); }, 1000);
};

// 2. Bắt đầu thu luồng stream trận đấu
window.startRecording = function() {
    if (window.isRecording) return;
    if (!window.recordCanvas) window.initRecorder();
    
    window.recordedChunks = [];
    let stream = window.recordCanvas.captureStream(60); 
    
    // TĂNG BITRATE LÊN 12Mbps (Độ nét cực cao chống vỡ hạt)
    let options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12000000 };
    try {
        window.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 10000000 };
        window.mediaRecorder = new MediaRecorder(stream, options);
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
        console.log("🎬 Trận đấu đã được xử lý xong và đưa vào danh sách chờ tải!");
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
// THUẬT TOÁN RENDER HÌNH ẢNH & GIAO DIỆN (HUD) SIÊU NÉT LÊN VIDEO 1080P
// ==========================================
window.captureFrameTo1080p = function() {
    if (!window.isRecording || !window.recordCtx || !window.canvas) return;
    
    let ctx = window.recordCtx;

    // 1. Phủ nền đen hai viền trên dưới (Tỷ lệ Cinematic)
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 1920, 1080);
    
    // 2. Chép khung hình game lên Canvas 1080p
    // Bật làm nét ảnh (chống mờ)
    ctx.imageSmoothingEnabled = false; 
    ctx.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
    
    // =====================================
    // 3. VẼ GIAO DIỆN (Thanh máu, Tên, Thể lực) CHUẨN ĐỘ PHÂN GIẢI CAO
    // =====================================
    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 10; // Đổ bóng để UI nổi bật khỏi nền game

        // -------- NGƯỜI CHƠI BÊN TRÁI --------
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp);
        let p1Stam = Math.max(0, window.p1.stamina / 100);
        
        // Tên & Icon P1
        ctx.font = "bold 45px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.fillText("👤 " + (window.p1.className || "Player"), 80, 110);
        
        // Thanh máu P1
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(80, 130, 750, 40); // Khung rỗng
        ctx.fillStyle = window.p1.color || "#ff4757"; // Lõi máu
        ctx.fillRect(80, 130, 750 * p1Hp, 40); 
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(80, 130, 750, 40); // Viền trắng
        
        // Thanh thể lực P1
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(80, 180, 500, 15);
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(80, 180, 500 * p1Stam, 15);


        // -------- KẺ ĐỊCH BÊN PHẢI --------
        if (window.enemies && window.enemies.length > 0) {
            let eHp = 0, eMax = window.totalEnemyMaxHp || 1;
            window.enemies.forEach(e => eHp += Math.max(0, e.hp));
            let p2Hp = Math.max(0, eHp / eMax);
            let isBoss = window.enemies[0].isDragon;
            let repEnemy = window.enemies[0];
            let eStam = Math.max(0, repEnemy.stamina / 100);
            
            // Tên & Icon P2
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            let eName = isBoss ? "🐉 DRAGON BOSS" : `🤖 ĐỘI QUÂN ĐỊCH x${window.enemies.length}`;
            ctx.fillText(eName, 1840, 110);
            
            // Thanh máu P2
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(1090, 130, 750, 40);
            ctx.fillStyle = isBoss ? "#e74c3c" : "#1e90ff";
            
            // Địch rút máu từ trái qua phải cho chuẩn đối kháng
            let p2HpWidth = 750 * p2Hp;
            ctx.fillRect(1090 + (750 - p2HpWidth), 130, p2HpWidth, 40);
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
            ctx.strokeRect(1090, 130, 750, 40);
            
            // Thanh thể lực P2
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(1340, 180, 500, 15);
            ctx.fillStyle = "#f1c40f";
            let eStamWidth = 500 * eStam;
            ctx.fillRect(1340 + (500 - eStamWidth), 180, eStamWidth, 15);
        }
        
        ctx.shadowBlur = 0; // Tắt đổ bóng
    }
};

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
            <h3 style="margin: 0 0 10px 0; color: #f1c40f; text-align: center; font-style: italic; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (1080P)</h3>
            <p style="text-align: center; color: #a4b0be; margin: 0; font-size: 14px;">Chưa có video trận đấu nào được lưu. Đánh xong một trận và bấm nút Thoát 🔙 để ghi danh sách!</p>
        `;
        return;
    }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #f1c40f; text-align: center; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (${window.savedVideos.length})</h3>`;
    html += `<div style="display: flex; flex-direction: column; gap: 12px; max-height: 280px; overflow-y: auto; padding-right: 5px;">`;
    
    window.savedVideos.forEach((vid, index) => {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #353b48; padding: 12px 18px; border-radius: 8px; border: 1px solid #747d8c; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);">
                <div style="text-align: left;">
                    <span style="font-weight: bold; color: #2ecc71; font-size: 15px;">🎬 TRẬN CHIẾN #${index + 1}</span>
                    <span style="font-size: 12px; color: #ced6e0; margin-left: 12px; background: #57606f; padding: 2px 6px; border-radius: 4px;">🕒 ${vid.timestamp}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="${vid.url}" download="Stickman_Battle_1080p_Tran_${index + 1}.webm" style="background: #2ecc71; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 5px rgba(46,204,113,0.3); transition: 0.2s;">📥 TẢI XUỐNG 1080P</a>
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
        console.log("🗑️ Đã xóa một video khỏi hàng đợi bộ nhớ.");
    }
};
