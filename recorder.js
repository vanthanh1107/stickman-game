// ==========================================
// RECORDER.JS - HỆ THỐNG LƯU TRỮ VÀ QUẢN LÝ VIDEO TRẬN ĐẤU 1080P
// ==========================================

window.mediaRecorder = null;
window.recordedChunks = [];
window.recordCanvas = null;
window.recordCtx = null;
window.isRecording = false;

// Mảng lưu trữ danh sách các video đã quay trong phiên chơi game này
window.savedVideos = [];

// 1. Khởi tạo canvas ẩn độ phân giải cao 1080p
window.initRecorder = function() {
    window.recordCanvas = document.createElement("canvas");
    window.recordCanvas.width = 1920;
    window.recordCanvas.height = 1080;
    window.recordCtx = window.recordCanvas.getContext("2d");
    
    // Tạo sẵn giao diện trống khi vừa vào game
    setTimeout(() => { if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI(); }, 1000);
};

// 2. Bắt đầu thu luồng stream trận đấu
window.startRecording = function() {
    if (window.isRecording) return;
    if (!window.recordCanvas) window.initRecorder();
    
    window.recordedChunks = [];
    let stream = window.recordCanvas.captureStream(60); 
    
    let options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8000000 };
    try {
        window.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 6000000 };
        window.mediaRecorder = new MediaRecorder(stream, options);
    }

    window.mediaRecorder.ondataavailable = function(event) {
        if (event.data && event.data.size > 0) {
            window.recordedChunks.push(event.data);
        }
    };

    // THAY ĐỔI CỐT LÕI: Không tự động tải xuống nữa, mà đẩy vào rương lưu trữ danh sách
    window.mediaRecorder.onstop = function() {
        let blob = new Blob(window.recordedChunks, { type: 'video/webm' });
        let videoUrl = URL.createObjectURL(blob);
        
        // Lưu thông tin video vào mảng toàn cục
        window.savedVideos.push({
            id: Date.now(),
            url: videoUrl,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        
        // Cập nhật lại giao diện danh sách hiển thị phía dưới
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

window.captureFrameTo1080p = function() {
    if (!window.isRecording || !window.recordCtx || !window.canvas) return;
    window.recordCtx.fillStyle = "#1e272e";
    window.recordCtx.fillRect(0, 0, 1920, 1080);
    window.recordCtx.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 60, 1920, 960);
};

// ==========================================
// HỆ THỐNG TỰ ĐỘNG VẼ VÀ QUẢN LÝ GIAO DIỆN DANH SÁCH VIDEO
// ==========================================
window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    
    // Nếu chưa có hộp chứa danh sách video ở dưới đáy, tự động tạo bằng code mã hóa cứng
    if (!container) {
        container = document.createElement("div");
        container.id = "video-list-container";
        container.style.cssText = "margin-top: 35px; padding: 20px; background: #2f3542; border-radius: 12px; border: 2px solid #57606f; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
        
        // Đính hộp này vào cuối khu vực chứa game chính
        let gameContainer = document.getElementById("game-container");
        if (gameContainer) gameContainer.appendChild(container);
        else document.body.appendChild(container);
    }
    
    // Trường hợp chưa có video nào được quay
    if (window.savedVideos.length === 0) {
        container.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #f1c40f; text-align: center; font-style: italic; letter-spacing: 1px;">📹 KHO LƯU TRỮ VIDEO TRẬN ĐẤU (1080P)</h3>
            <p style="text-align: center; color: #a4b0be; margin: 0; font-size: 14px;">Chưa có video trận đấu nào được lưu. Đánh xong một trận và bấm nút Thoát 🔙 để ghi danh sách!</p>
        `;
        return;
    }
    
    // Xây dựng cấu trúc danh sách video
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

// Hàm xử lý khi người dùng ấn nút xóa một video ra khỏi danh sách tạm để giải phóng RAM
window.deleteVideo = function(id) {
    let index = window.savedVideos.findIndex(v => f.id === id || v.id === id);
    if (index !== -1) {
        // Thu hồi đường dẫn URL để tránh làm tràn RAM bộ nhớ máy điện thoại
        URL.revokeObjectURL(window.savedVideos[index].url);
        window.savedVideos.splice(index, 1);
        window.updateVideoListUI();
        console.log("🗑️ Đã xóa một video khỏi hàng đợi bộ nhớ.");
    }
};
