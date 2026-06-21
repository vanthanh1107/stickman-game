// ==========================================
// RECORDER.JS - HỆ THỐNG QUAY VIDEO TRẬN ĐẤU CHUẨN FULL HD 1080P
// ==========================================

window.mediaRecorder = null;
window.recordedChunks = [];
window.recordCanvas = null;
window.recordCtx = null;
window.isRecording = false;

// 1. Khởi tạo canvas ẩn độ phân giải cao 1080p
window.initRecorder = function() {
    window.recordCanvas = document.createElement("canvas");
    window.recordCanvas.width = 1920;
    window.recordCanvas.height = 1080;
    window.recordCtx = window.recordCanvas.getContext("2d");
};

// 2. Bắt đầu thu luồng stream trận đấu
window.startRecording = function() {
    if (window.isRecording) return;
    if (!window.recordCanvas) window.initRecorder();
    
    window.recordedChunks = [];
    // Capture stream từ canvas ẩn với tốc độ 60 khung hình/giây mượt mà
    let stream = window.recordCanvas.captureStream(60); 
    
    // Cấu hình bitrate cực cao (8 Mbps) để video nét căng không bị vỡ hạt
    let options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8000000 };
    try {
        window.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        // Phương án dự phòng nếu trình duyệt/thiết bị cũ không hỗ trợ bộ mã VP9
        options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 6000000 };
        window.mediaRecorder = new MediaRecorder(stream, options);
    }

    window.mediaRecorder.ondataavailable = function(event) {
        if (event.data && event.data.size > 0) {
            window.recordedChunks.push(event.data);
        }
    };

    // Khi bấm dừng, tự động đóng gói cấu trúc file và kích hoạt lệnh tải xuống
    window.mediaRecorder.onstop = function() {
        let blob = new Blob(window.recordedChunks, { type: 'video/webm' });
        let url = URL.createObjectURL(blob);
        
        let a = document.createElement('a');
        a.href = url;
        a.download = `Stickman_MartialArts_1080p_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("🎬 Đã xuất và tải xuống video trận đấu Full HD 1080p thành công!");
    };

    window.mediaRecorder.start(100); // Cứ mỗi 100ms đóng gói dữ liệu một lần
    window.isRecording = true;
    console.log("🎥 Hệ thống đang quay ngầm trận đấu ở độ phân giải 1080p...");
};

// 3. Lệnh dừng quay phim
window.stopRecording = function() {
    if (!window.isRecording || !window.mediaRecorder) return;
    window.mediaRecorder.stop();
    window.isRecording = false;
};

// 4. Hàm đồng bộ copy ảnh từ màn hình chơi sang màn hình Full HD ẩn
window.captureFrameTo1080p = function() {
    if (!window.isRecording || !window.recordCtx || !window.canvas) return;
    
    // Phủ một lớp nền tối tối giản lên toàn bộ khung hình 1920x1080
    window.recordCtx.fillStyle = "#1e272e";
    window.recordCtx.fillRect(0, 0, 1920, 1080);
    
    // THUẬT TOÁN ĐIỆN ẢNH: Phóng lớn 800x400 thành 1920x960 để giữ nguyên tỷ lệ gốc
    // Chừa lại đúng 60 pixel vạch đen ở cả trên và dưới tạo hiệu ứng Cinematic rạp phim
    window.recordCtx.drawImage(
        window.canvas, 
        0, 0, window.canvas.width, window.canvas.height, 
        0, 60, 1920, 960
    );
};
