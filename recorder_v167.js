// ==========================================
// RECORDER.JS - CLEAN HORIZONTAL VERSION (16:9)
// Tối giản: Chỉ Màn hình Game (1920x1080) + Khung Chat Toxic góc dưới.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];

// ================= TỪ VỰNG CHAT TOXIC =================
window.CHARACTER_LIST = [
    { name: "NoobMaster69", color: "#ff4757" }, { name: "Yasuo_Gank_Tem", color: "#ffeb3b" },
    { name: "Faker_Fake", color: "#00f3ff" }, { name: "Gà_Công_Nghiệp", color: "#ffa502" },
    { name: "Chúa_Tể_Check_Map", color: "#2ed573" }, { name: "Thích_Thể_Hiện", color: "#ff0055" },
    { name: "Kẻ_Hủy_Diệt", color: "#ff9900" }
];

const TOXIC_MSGS = [
    "Múa như rặn đẻ 💀", "Bro is playing on a microwave 🍞", "Mù mắt tao rồi 😭",
    "Xóa game đi bạn êi 🤡", "RIP BOZO 📉", "L L L L L L", "W W W W W W", "Lỗi do mạng ping 999 🧠📉",
    "Đánh như cái máy khâu 🐔", "Ăn may thôi con zai 😂", "Quả xử lý cồng kềnh vãi 💀", "Khóc đi 😭", "Gà 🐔🐔"
];

window._recentChatsMemory = [];
window._liveChats = []; window._lastChatUpdate = 0; window._nextChatDelay = 1000;

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CHARACTER_LIST); let msg = r(TOXIC_MSGS); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(TOXIC_MSGS); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    
    return { name: celeb.name, color: celeb.color, msg: msg, lines: null, nameWidth: 0 };
};

window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; 
    ctx.font = "bold 24px Arial"; // Nhỏ lại cho vừa màn hình ngang
    chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 450 - chatObj.nameWidth - 10; 
    let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { 
        let testLine = currentLine + words[n] + " "; 
        if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { 
            lines.push(currentLine.trim()); currentLine = words[n] + " "; 
        } else { currentLine = testLine; } 
    }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

// ================= AUDIO & STREAM =================
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) { try { let source = window.audioCtx.createMediaElementSource(this); source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination); this._routedToRecorder = true; } catch (e) { } }
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

// ================= KHỞI TẠO QUAY =================
window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV") || document.createElement("canvas");
    if (!window.recordCanvasV.id) { window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    // CHUYỂN THÀNH MÀN HÌNH NGANG 1920x1080
    window.recordCanvasV.width = 1920; window.recordCanvasV.height = 1080; 
    window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

window.startRecording = function() {
    if (window.isRecording) window.stopRecording();
    window.initRecorder();
    
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    window.recordedChunksV = []; window._liveChats = [];
    
    // Khởi tạo vài dòng chat ban đầu
    for(let i=0; i<5; i++) { 
        let c = window.generateLiveChatEvent(); window.precalcChatText(c, window.recordCtxV); window._liveChats.push(c); 
    }

    let videoStreamV = window.recordCanvasV.captureStream(60); // 60 FPS mượt mà
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; 
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')) { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    // Khi dừng quay, tự động tải xuống luôn
    window.mediaRecorderV.onstop = () => {
        setTimeout(() => {
            if (window.recordedChunksV.length === 0) return;
            let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
            let finalUrl = URL.createObjectURL(blobV);
            let a = document.createElement("a");
            a.href = finalUrl;
            a.download = "Game_Record_Horizontal." + window.currentVideoExt;
            a.click();
            alert("✅ Video đã được tải xuống!");
        }, 500); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
};

// ================= LOOP VẼ RENDER (RENDER LOOP) =================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;

    let ctxV = window.recordCtxV;
    
    // 1. Vẽ Full màn hình game (Scale vừa khớp 1920x1080)
    ctxV.imageSmoothingEnabled = false;
    ctxV.fillStyle = "#000000"; 
    ctxV.fillRect(0, 0, 1920, 1080);
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 0, 1920, 1080); 

    // 2. Logic cập nhật chat liên tục
    let chatNow = Date.now();
    if (chatNow - window._lastChatUpdate > window._nextChatDelay) { 
        window._lastChatUpdate = chatNow; 
        window._nextChatDelay = 1000 + Math.random() * 2500; // Delay chat ngẫu nhiên 1s-3.5s
        let newChat = window.generateLiveChatEvent(); 
        window.precalcChatText(newChat, ctxV); 
        window._liveChats.push(newChat); 
        if (window._liveChats.length > 8) window._liveChats.shift(); 
    }

    // 3. Vẽ khung chat (Góc dưới cùng bên trái)
    let boxWidth = 500; 
    let boxHeight = 350; 
    let boxX = 30; // Cách viền trái 30px
    let boxY = 1080 - boxHeight - 30; // Cách viền dưới 30px

    ctxV.save();
    ctxV.translate(boxX, boxY);
    
    // Nền mờ cho dễ đọc chữ
    ctxV.fillStyle = "rgba(0, 0, 0, 0.4)"; 
    ctxV.beginPath(); 
    if(ctxV.roundRect) ctxV.roundRect(0, 0, boxWidth, boxHeight, 15); 
    else ctxV.fillRect(0, 0, boxWidth, boxHeight); 
    ctxV.fill();
    
    // Tiêu đề khung chat
    ctxV.fillStyle = "rgba(0, 0, 0, 0.7)"; 
    if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, 0, boxWidth, 40, {tl: 15, tr: 15, bl: 0, br: 0}); ctxV.fill(); }
    else { ctxV.fillRect(0, 0, boxWidth, 40); }
    ctxV.fillStyle = "#fff"; 
    ctxV.font = "bold 20px Arial"; 
    ctxV.textAlign = "left"; 
    ctxV.textBaseline = "middle"; 
    ctxV.fillText("💬 Mõm Streamers", 15, 20);

    // Vẽ từng dòng chat từ dưới lên trên
    ctxV.beginPath(); 
    ctxV.rect(0, 45, boxWidth, boxHeight - 50); 
    ctxV.clip(); // Không cho text tràn ra ngoài box

    let currentY = boxHeight - 15; 
    let lineHeight = 30; 
    ctxV.textAlign = "left"; 
    ctxV.textBaseline = "bottom"; 
    ctxV.font = "bold 22px Arial"; 
    
    for (let i = window._liveChats.length - 1; i >= 0; i--) { 
        let chat = window._liveChats[i]; let nameStr = chat.name + ":"; 
        for(let l = chat.lines.length - 1; l >= 0; l--) {
            if (currentY - lineHeight < 40) break;
            if (l === 0) { 
                ctxV.fillStyle = chat.color; 
                ctxV.fillText(nameStr, 15, currentY); 
                ctxV.fillStyle = "#ffffff"; 
                ctxV.fillText(" " + chat.lines[l], 15 + chat.nameWidth, currentY); 
            } 
            else { 
                ctxV.fillStyle = "#ffffff"; 
                ctxV.fillText(" " + chat.lines[l], 15 + chat.nameWidth, currentY); 
            }
            currentY -= lineHeight; 
        }
        if (currentY - lineHeight < 40) break; currentY -= 10; 
    }
    ctxV.restore(); 

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};
