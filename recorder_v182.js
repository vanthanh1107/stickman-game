// ==========================================
// RECORDER.JS - V78.0 PURE MANGA CINEMATIC
// NÂNG CẤP TỪ V77.0:
// 1. CLEAN UI: Xóa bỏ mọi yếu tố Livestream rác (Chat, Mắt xem, Donate).
// 2. AUTHENTIC HAND-DRAWN: Nét mực đen trắng tương phản cao, giấy nhám.
// 3. CINEMATIC OUTRO: Freeze-frame, Tia tốc độ (Speedlines), Typewriter text.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

window.introStartTime = 0; window.introDuration = 3500; window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._lastCaptureTime = 0; window._recordLoopId = null; 

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

window._lastP1Hp = 1; window._lastP2Hp = 1;
window._impactFrames = 0; window._impactIntensity = 0;

// HỆ THỐNG CỐT TRUYỆN MỚI
window.STORY_TEMPLATES = [
    [ // 1. Kiếm Hiệp
        { triggerHp: 0.8, speaker: "P2", text: "Nghịch đồ! Hôm nay vi sư phải thanh lý môn hộ!", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Lão phu tử, thời đại của ông đã kết thúc rồi!", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Khinh công của ngươi vẫn còn non kém lắm! Đỡ chiêu này!", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Khụ... Đừng hòng! Ta sẽ kéo ông theo cùng! Huyết Ma Công!", duration: 4500 }
    ],
    [ // 2. Drama
        { triggerHp: 0.8, speaker: "P2", text: "Tại sao... Tại sao anh lại phản bội tôi?", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Kẻ yếu không có quyền lên tiếng. Tránh ra!", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Tôi đã trao cho anh tất cả! Đồ tồi, đền mạng đi!", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Xin lỗi... Nhưng ta phải vung kiếm để bảo vệ lý tưởng của mình!", duration: 4500 }
    ],
    [ // 3. Shounen Anime
        { triggerHp: 0.8, speaker: "P2", text: "Ngươi chỉ là con sâu cái kiến! Quỳ xuống đi!", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Ta sẽ không bao giờ bỏ cuộc! Dù thân tàn ma dại!", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Hahahaha! Chết đi trong sự bất lực của ngươi!", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Chưa đâu! Sức mạnh của tình bạn... THỨC TỈNH!", duration: 4500 }
    ]
];

window._storyQuotes = []; window._activeQuote = null; window._activeQuoteStartTime = 0;

window.getRealCharName = function(obj, fallback) {
    if (!obj) return fallback.toUpperCase();
    let n = null;
    if (obj.classId !== undefined && window.classStats && window.classStats[obj.classId]) { n = window.classStats[obj.classId].className || window.classStats[obj.classId].name; }
    if (!n) n = obj.className || obj.name || obj.type || obj.id;
    if (!n || n === "undefined" || n === "null") return fallback.toUpperCase();
    return String(n).toUpperCase().trim();
};

const LORES = [
    { chapter: "CHƯƠNG 1: HUYẾT LỆ TÌNH CỪU" },
    { chapter: "CHƯƠNG CUỐI: HOÀNG HÔN CỦA ĐẾ CHẾ" },
    { chapter: "NGOẠI TRUYỆN: KẺ KẾ VỊ" },
    { chapter: "CHƯƠNG 2: SỰ THỨC TỈNH" }
];

window.generateIntroParams = function() {
    return { lore: LORES[Math.floor(Math.random() * LORES.length)] };
};

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    viralTitle: "",
    generateStoryTitle: function(p1Name, p2Name) {
        const titles = [
            `TẬP CUỐI: TRẬN CHIẾN HUYỀN THOẠI CỦA ${p1Name} ⚔️`,
            `CHƯƠNG CUỐI: ÁNH KIẾM ĐỊNH MỆNH 💔`,
            `NGOẠI TRUYỆN: KHI ${p2Name} ĐỤNG ĐỘ ÁC QUỶ 🐉`,
            `HỒI KẾT: CÁI CHẾT CỦA ${p2Name} 🔥`
        ];
        return titles[Math.floor(Math.random() * titles.length)] + " #manga #story";
    },
    generateViralPostKit: function(p1Name, p2Name) {
        return `🎬 MANGA CUT\n\n📌 TIÊU ĐỀ:\n${this.viralTitle}\n\n💬 BÌNH LUẬN:\nNét vẽ này quá đỉnh, chấm mấy điểm mọi người?`;
    },
    init: function(p1Name, p2Name) { this.viralTitle = this.generateStoryTitle(p1Name || "HERO", p2Name || "BOSS"); }, 
    stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
        let ctxV = window.bakedThumbV.getContext('2d');
        ctxV.fillStyle = "#eaddcf"; ctxV.fillRect(0, 0, 1080, 1920); // Màu giấy manga
        
        ctxV.save(); ctxV.translate(540, 960);
        ctxV.fillStyle = "rgba(0,0,0,0.1)";
        for(let i=0; i<30; i++) { ctxV.rotate(Math.PI / 15); ctxV.beginPath(); ctxV.moveTo(0, 0); ctxV.lineTo(2000, 40); ctxV.lineTo(2000, -40); ctxV.fill(); }
        ctxV.restore(); 

        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            ctx.filter = "grayscale(100%) contrast(200%) brightness(80%)";
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        };
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, window.enemies && window.enemies[0], 540, 700, 5.5, false);
        
        // Manga Title Typography
        ctxV.save(); ctxV.translate(540, 400); ctxV.rotate(-0.05);
        ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `900 85px 'Arial Black', Impact`; 
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(); let words = shortTitle.split(" "); 
        let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
        lines.forEach((line, index) => { 
            let yOffset = index * 95; ctxV.lineWidth = 15; ctxV.strokeStyle = "#fff"; 
            ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = "#000"; ctxV.fillText(line, 0, yOffset); 
        }); 
        ctxV.restore();
    } catch (e) {}
};

// MANGA INTRO (Sách phác thảo tinh tế)
window.drawProceduralIntro = function(ctx, w, h, progress) {
    ctx.save();
    let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "OPPONENT");

    // Nền giấy phác thảo đẹp
    ctx.fillStyle = "#e8e1d5"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for(let i=0; i<w; i+=8) ctx.fillRect(i, 0, 2, h); 
    for(let j=0; j<h; j+=8) ctx.fillRect(0, j, w, 2); 

    let act = progress < 0.35 ? 0 : progress < 0.7 ? 1 : 2;
    let localProg = progress < 0.35 ? progress/0.35 : progress < 0.7 ? (progress-0.35)/0.35 : (progress-0.7)/0.3;
    
    // Nét rung tĩnh lặng
    let jitterX = (Math.random() - 0.5) * 4;
    let jitterY = (Math.random() - 0.5) * 4;
    ctx.translate(w/2 + jitterX, h/2 + jitterY);
    let introZoom = 2.2 + localProg * 0.2; // Zoom chậm điện ảnh
    ctx.scale(introZoom, introZoom);

    const drawSketchFighter = (charObj, cx, cy, isFacingRight, label) => {
        if(!charObj) return;
        ctx.save(); ctx.translate(cx, cy);
        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.5, isFacingRight: true, state: 'idle'});
        
        ctx.filter = "grayscale(100%) contrast(250%) brightness(80%) drop-shadow(5px 5px 0px rgba(0,0,0,0.3))";
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
        ctx.restore();

        if (label) {
            ctx.save(); ctx.translate(cx, cy - 250);
            ctx.font = "900 35px 'Times New Roman', serif";
            ctx.textAlign = "center"; ctx.fillStyle = "#000";
            
            // Xóa nền chữ
            let txtW = ctx.measureText(label).width;
            ctx.fillStyle = "#e8e1d5"; ctx.fillRect(-txtW/2 - 10, -35, txtW + 20, 50);
            ctx.fillStyle = "#000"; ctx.fillText(label, 0, 0);
            
            ctx.beginPath(); ctx.moveTo(-txtW/2, 15); ctx.lineTo(txtW/2, 15);
            ctx.lineWidth = 2; ctx.strokeStyle = "#000"; ctx.stroke();
            ctx.restore();
        }
    };

    if (act === 0) {
        drawSketchFighter(window.p1, 0, 100, true, realP1Name);
    } else if (act === 1) {
        drawSketchFighter(window.enemies ? window.enemies[0] : null, 0, 100, false, realP2Name);
    } else {
        let pushP1 = -250 + Math.pow(localProg, 2) * 100;
        let pushP2 = 250 - Math.pow(localProg, 2) * 100;
        drawSketchFighter(window.p1, pushP1, 100, true, null);
        drawSketchFighter(window.enemies ? window.enemies[0] : null, pushP2, 100, false, null);

        ctx.translate(0, -100);
        ctx.font = "900 120px 'Georgia', serif";
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillStyle = "#000"; 
        ctx.fillText("VS", 0, 0);
        ctx.fillStyle = "#fff"; ctx.fillText("VS", -4, -4);
    }

    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = "#000"; ctx.textAlign = "center";
    ctx.font = "italic 900 55px 'Times New Roman', serif";
    ctx.fillText(prm.lore.chapter, w/2, 180);
    
    // Khung truyện tranh
    ctx.lineWidth = 10; ctx.strokeStyle = "#111";
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.restore();
};

// UI LỜI THOẠI TRUYỆN TRANH (Speech Bubble Tinh Tế)
window.drawCinematicQuote = function(ctx, quote, elapsed, w, h, p1Url, p2Url, getHudImg) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 300) alpha = elapsed / 300;
    if (elapsed > quote.duration - 300) alpha = (quote.duration - elapsed) / 300;
    ctx.globalAlpha = alpha;

    let boxW = w - 80;
    let boxH = 160;
    let boxX = 40;
    let boxY = h - boxH - 40;

    // Bong bóng chat trắng viền đen lởm chởm
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(boxX, boxY);
    for(let i=0; i<boxW; i+=20) ctx.lineTo(boxX + i + (Math.random()*4-2), boxY + (Math.random()*4-2));
    ctx.lineTo(boxX + boxW, boxY + boxH);
    ctx.lineTo(boxX, boxY + boxH);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.stroke();

    // Mũi nhọn chỉ về nhân vật
    ctx.beginPath();
    if (quote.speaker === "P1") {
        ctx.moveTo(boxX + 150, boxY); ctx.lineTo(boxX + 180, boxY - 50); ctx.lineTo(boxX + 210, boxY);
    } else {
        ctx.moveTo(boxX + boxW - 210, boxY); ctx.lineTo(boxX + boxW - 180, boxY - 50); ctx.lineTo(boxX + boxW - 150, boxY);
    }
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.moveTo(quote.speaker === "P1" ? boxX+150 : boxX+boxW-210, boxY);
    ctx.lineTo(quote.speaker === "P1" ? boxX+180 : boxX+boxW-180, boxY-50);
    ctx.lineTo(quote.speaker === "P1" ? boxX+210 : boxX+boxW-150, boxY);
    ctx.stroke();

    let faceSize = 110;
    let faceX = quote.speaker === "P1" ? boxX + 25 : boxX + boxW - faceSize - 25;
    let faceY = boxY + 25;
    
    let faceImgUrl = quote.face || (quote.speaker === "P1" ? p1Url : p2Url);
    let faceImg = getHudImg ? getHudImg(faceImgUrl) : null;
    
    if (faceImg && faceImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2); ctx.clip();
        ctx.filter = "grayscale(100%) contrast(150%) brightness(120%)";
        ctx.drawImage(faceImg, faceX, faceY, faceSize, faceSize);
        ctx.restore();
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2);
        ctx.lineWidth = 3; ctx.strokeStyle = "#000"; ctx.stroke();
    }

    let speakerName = quote.speaker === "P1" ? window.getRealCharName(window.p1, "PLAYER") : (window.enemies && window.enemies.length ? window.getRealCharName(window.enemies[0], "BOSS") : "OPPONENT");
    let textStartX = quote.speaker === "P1" ? boxX + faceSize + 50 : boxX + 35;
    let maxTextW = boxW - faceSize - 80;

    ctx.fillStyle = "#000";
    ctx.font = "900 28px 'Courier New', monospace";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(`[ ${speakerName} ]`, textStartX, boxY + 20);
    
    let charsToShow = Math.floor((elapsed - 300) / 30); 
    if (charsToShow < 0) charsToShow = 0;
    let displayedText = quote.text.substring(0, charsToShow);
    
    ctx.font = "bold 32px 'Arial', sans-serif";
    let words = displayedText.split(" ");
    let line = ""; let lineY = boxY + 65;
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > maxTextW && i > 0) {
            ctx.fillText(line, textStartX, lineY);
            line = words[i] + " "; lineY += 40;
        } else { line = testLine; }
    }
    ctx.fillText(line, textStartX, lineY);
    ctx.restore();
};

window.drawMangaSpeedLines = function(ctx, w, h, intensity) {
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    for(let i=0; i<150; i++) {
        let angle = Math.random() * Math.PI * 2;
        let dist = 250 + Math.random() * 300;
        let length = 300 + Math.random() * 500;
        let thick = Math.random() * 4 * intensity;
        
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * dist, Math.sin(angle) * dist);
        ctx.lineTo(Math.cos(angle) * (dist + length), Math.sin(angle) * (dist + length));
        ctx.lineWidth = thick;
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }
    ctx.restore();
};

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) { try { let source = window.audioCtx.createMediaElementSource(this); source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination); if (window.recordAnalyser) source.connect(window.recordAnalyser); this._routedToRecorder = true; } catch (e) { } }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { try { originalConnect.call(this, window.masterRecordDestination); if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser); } catch(e){} }
        return originalConnect.apply(this, arguments);
    };
}

window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV") || document.createElement("canvas");
    if (!window.recordCanvasV.id) { window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

if (window._hookedDrawForRecorder && window.draw && window._originalDrawBeforeHook) { window.draw = window._originalDrawBeforeHook; }
if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true; window._originalDrawBeforeHook = window.draw; 
    window.draw = function() { if (window._originalDrawBeforeHook) window._originalDrawBeforeHook.apply(this, arguments); };
}

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    
    let randomTemplate = window.STORY_TEMPLATES[Math.floor(Math.random() * window.STORY_TEMPLATES.length)];
    window._storyQuotes = JSON.parse(JSON.stringify(randomTemplate));
    window._storyQuotes.forEach(q => q.triggered = false);
    window._activeQuote = null;

    window._lastP1Hp = 1; window._lastP2Hp = 1; window._impactFrames = 0; window._impactIntensity = 0;

    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.introParams = window.generateIntroParams();

    window.recordedChunksV = []; 
    window._gamePhaseStarted = false; window._gamePhaseEnded = false;
    window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

    let videoStreamV = window.recordCanvasV.captureStream(0); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 6000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    let charName = window.getRealCharName(window.p1, "PLAYER");
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) enemyName = window.getRealCharName(window.enemies[0], "BOSS");

    window.StoryModeAI.init(charName, enemyName);
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);

    window.mediaRecorderV.onstop = () => {
        setTimeout(() => {
            window.hideRenderToast();
            if (window.recordedChunksV.length === 0) return;
            let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
            let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
            window.savedVideos.unshift({ 
                id: Date.now(), urlV: URL.createObjectURL(blobV), ext: window.currentVideoExt, 
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heroName: charName, heroAvatar: charAvatar, viralTitle: window.StoryModeAI.viralTitle, safeFileName: safeFileName,
                previewThumb: window.bakedThumbV ? window.bakedThumbV.toDataURL("image/jpeg", 0.3) : "",
                gameStartSec: window.gamePhaseStartTime / 1000,
                gameEndSec: window.gamePhaseEndTime > 0 ? (window.gamePhaseEndTime / 1000) : 999999
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 800); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._lastCaptureTime = Date.now(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    window.showRenderToast("⏳ ĐANG LƯU TẬP PHIM...");
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 400) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 33) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 80);

    ctxV.fillStyle = "#111"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    if (elapsed >= window.introDuration && !window._gamePhaseStarted) {
        window._gamePhaseStarted = true; window.gamePhaseStartTime = elapsed;
    }
    if (isOutroActive && !window._gamePhaseEnded) {
        window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed;
    }

    if (elapsed < 150) {
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); renderNormalV = false; 
    } else if (elapsed < window.introDuration) {
        let introProgress = (elapsed - 150) / (window.introDuration - 150); 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress); renderNormalV = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    let shakeX = 0, shakeY = 0;
    
    if (audioPeak > 0.6) { 
        let shakeIntensity = (audioPeak - 0.6) * 20; 
        shakeX = (Math.random() - 0.5) * shakeIntensity; 
        shakeY = (Math.random() - 0.5) * shakeIntensity; 
    }

    if (renderNormalV) {
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        ctxV.imageSmoothingEnabled = false;

        if (!window.hudImages) window.hudImages = {};
        const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
        
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
        let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";
        if (window.p1 && window.classStats && window.classStats[window.p1.classId]) { p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; }
        if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) { p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }

        let p1HpPct = window.p1 ? Math.max(0, window.p1.hp / window.p1.maxHp) : 1;
        let p2HpPct = 1;
        if (window.enemies && window.enemies.length > 0) {
            let eHp = 0, eMax = window.totalEnemyMaxHp || 1;
            window.enemies.forEach(e => eHp += Math.max(0, e.hp));
            p2HpPct = Math.max(0, eHp / eMax);
        }

        if (!isOutroActive && !window.gameOver && window._gamePhaseStarted) {
            let p1Dmg = window._lastP1Hp - p1HpPct;
            let p2Dmg = window._lastP2Hp - p2HpPct;
            
            if (p1Dmg > 0.02 || p2Dmg > 0.02) {
                window._impactFrames = 8; 
                window._impactIntensity = Math.min((p1Dmg + p2Dmg) * 300, 30); 
            }
        }
        window._lastP1Hp = p1HpPct;
        window._lastP2Hp = p2HpPct;

        ctxV.save();

        // CAMERA GAMEPLAY
        let zoom = 1.0;
        let finalYPos = 1920/2 - splitGameHeight/2; // Center game vertically

        if (isOutroActive) {
            // OUTRO: Freeze frame zoom out
            let outroProgress = Math.min(1, (window.matchEndTimer - 80) / 250);
            let easeOut = 1 - Math.pow(1 - outroProgress, 3);
            zoom = 1.0 - (easeOut * 0.15); // Slight zoom out
            ctxV.translate(540, 960); ctxV.scale(zoom, zoom); ctxV.translate(-540, -960);
        } else if (window._impactFrames > 0) {
            zoom = 1 + (window._impactFrames * 0.01);
            ctxV.translate(540, finalYPos + splitGameHeight/2);
            ctxV.scale(zoom, zoom);
            ctxV.translate(-540 + shakeX, -(finalYPos + splitGameHeight/2) + shakeY);
        }

        // ======= FILTER VẼ TAY (MANGA STYLE) =======
        let jitterGameX = (Math.random() - 0.5) * 2;
        let jitterGameY = (Math.random() - 0.5) * 2;
        
        ctxV.save();
        ctxV.translate(jitterGameX, jitterGameY);
        
        // High contrast Black & White manga filter
        if (isOutroActive) {
            ctxV.filter = "grayscale(100%) contrast(250%) brightness(110%)"; 
        } else {
            ctxV.filter = "grayscale(100%) contrast(180%) sepia(20%) brightness(110%)"; 
        }

        // IMPACT FRAME - CHỚP ÂM BẢN KINH ĐIỂN
        if (window._impactFrames > 4) {
            ctxV.filter += " invert(100%)";
        }

        // Vẽ Game
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, finalYPos, 1080, splitGameHeight); 
        ctxV.restore(); 

        // Manga Speedlines during Impact or Outro
        if (window._impactFrames > 0) {
            window.drawMangaSpeedLines(ctxV, 1080, 1920, window._impactFrames / 8);
            window._impactFrames--;
        }
        if (isOutroActive) {
            let speedLineInt = Math.min(1, (window.matchEndTimer - 80) / 50);
            window.drawMangaSpeedLines(ctxV, 1080, 1920, speedLineInt);
        }

        // Viền Vignette đen tối tập trung vào nhân vật
        let vigGrad = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1100);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(1, "rgba(0,0,0,0.8)");
        ctxV.fillStyle = vigGrad;
        ctxV.fillRect(0, 0, 1080, 1920);

        ctxV.restore(); // Restore Camera

        // ==========================================
        // HUD THANH MÁU KIỂU NÉT MỰC (INK STROKE)
        // ==========================================
        if (!isOutroActive && window._gamePhaseStarted) {
            let hudBaseY = finalYPos - 90; 

            const drawInkHpBar = (ctx, x, y, w, h, pct, isRightAligned) => {
                ctx.save();
                // Nền đen xước xước
                ctx.fillStyle = "#111";
                ctx.beginPath();
                ctx.moveTo(x - 10, y - 5);
                ctx.lineTo(x + w + 10, y - 2);
                ctx.lineTo(x + w + 5, y + h + 5);
                ctx.lineTo(x - 5, y + h + 2);
                ctx.fill();

                // Lõi máu trắng
                let fillW = Math.max(0, w * pct);
                if (fillW > 0) {
                    ctx.fillStyle = "#fff";
                    ctx.beginPath();
                    if(isRightAligned) {
                        ctx.moveTo(x + (w - fillW), y);
                        ctx.lineTo(x + w, y);
                        ctx.lineTo(x + w, y + h);
                        ctx.lineTo(x + (w - fillW) - 15, y + h); // Nét chéo cọ vẽ
                    } else {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + fillW, y);
                        ctx.lineTo(x + fillW + 15, y + h);
                        ctx.lineTo(x, y + h);
                    }
                    ctx.fill();
                }
                ctx.restore();
            };

            // P1
            if (window.p1) {
                let p1Name = window.getRealCharName(window.p1, "PLAYER");
                ctxV.textAlign = "left"; ctxV.fillStyle = "#fff"; ctxV.font = "900 35px 'Times New Roman', serif"; 
                ctxV.fillText(p1Name, 50, hudBaseY - 10);
                drawInkHpBar(ctxV, 50, hudBaseY, 400, 25, p1HpPct, false);
            }
            // P2
            if (repEnemyObj) {
                let eName = window.getRealCharName(repEnemyObj, "BOSS");
                ctxV.textAlign = "right"; ctxV.fillStyle = "#fff"; ctxV.font = "900 35px 'Times New Roman', serif"; 
                ctxV.fillText(eName, 1030, hudBaseY - 10);
                drawInkHpBar(ctxV, 1030 - 400, hudBaseY, 400, 25, p2HpPct, true);
            }
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = "italic 900 50px 'Georgia'";
            ctxV.fillStyle = "#fff"; ctxV.fillText("VS", 540, hudBaseY + 12);
        }

        // HỘI THOẠI TRONG GAME
        if (!window._activeQuote && !window.gameOver && !isOutroActive) {
            for (let q of window._storyQuotes) {
                if (!q.triggered) {
                    let targetHp = (q.speaker === "P1") ? p1HpPct : p2HpPct;
                    if (targetHp <= q.triggerHp && targetHp > 0) {
                        q.triggered = true; window._activeQuote = q; window._activeQuoteStartTime = Date.now(); break; 
                    }
                }
            }
        }
        if (window._activeQuote && !isOutroActive) {
            let elapsedQuote = Date.now() - window._activeQuoteStartTime;
            if (elapsedQuote < window._activeQuote.duration) {
                window.drawCinematicQuote(ctxV, window._activeQuote, elapsedQuote, 1080, 1920, p1Url, p2Url, getHudImg);
            } else { window._activeQuote = null; }
        }

        // ==========================================
        // OUTRO KỂ CHUYỆN ĐIỆN ẢNH TỐI GIẢN
        // ==========================================
        if (isOutroActive) {
            let outroAlpha = Math.min(1, (window.matchEndTimer - 80) / 100); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            
            // Dải gradient đen che mờ 2 đầu trên dưới để nổi bật text
            let outroGrad = ctxV.createLinearGradient(0, 0, 0, 1920);
            outroGrad.addColorStop(0, "rgba(0,0,0,1)");
            outroGrad.addColorStop(0.2, "rgba(0,0,0,0)");
            outroGrad.addColorStop(0.7, "rgba(0,0,0,0)");
            outroGrad.addColorStop(1, "rgba(0,0,0,1)");
            ctxV.fillStyle = outroGrad;
            ctxV.fillRect(0, 0, 1080, 1920);
            
            // Typewriter Effect (Hiện từng chữ một)
            let typeWriterFrames = window.matchEndTimer - 120;
            if (typeWriterFrames > 0) {
                let p1Name = window.getRealCharName(window.p1, "Nhân vật chính");
                let p2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "Kẻ thù");
                let isP1Win = (window.p1 && window.p1.hp > 0);
                
                let conclusion = isP1Win 
                    ? `Cuối cùng, ${p1Name} đã tung đòn chí mạng kết liễu ${p2Name}.`
                    : `${p1Name} đã gục ngã dưới tay ${p2Name}...`;
                let subConclusion = isP1Win
                    ? "Mọi ân oán đã được giải quyết. Kẻ mạnh nhất đã được xướng tên."
                    : "Một kết cục bi thảm. Lịch sử thuộc về kẻ chiến thắng.";

                ctxV.textAlign = "center"; 
                ctxV.fillStyle = "#fff";
                ctxV.shadowColor = "#000"; ctxV.shadowBlur = 15;
                
                let chars1 = Math.min(conclusion.length, Math.floor(typeWriterFrames / 2));
                let chars2 = typeWriterFrames > 80 ? Math.min(subConclusion.length, Math.floor((typeWriterFrames - 80) / 2)) : 0;
                
                ctxV.font = "italic 40px 'Times New Roman', serif";
                ctxV.fillText(conclusion.substring(0, chars1), 540, 1600);
                
                ctxV.font = "30px 'Times New Roman', serif";
                ctxV.fillStyle = "#aaa";
                ctxV.fillText(subConclusion.substring(0, chars2), 540, 1660);

                if (typeWriterFrames > 200) {
                    ctxV.font = "bold 50px 'Georgia', serif";
                    ctxV.fillStyle = "#fff";
                    ctxV.fillText("— HẾT —", 540, 1780);
                }
            }
            ctxV.restore();
        }
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Đã chép tiêu đề! Dán ngay lên TikTok/YouTube."); }); };

window.mergeAndDownloadVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.href = vid.urlV;
    a.download = "MANGA_STORY_" + vid.safeFileName + "." + vid.ext;
    a.click();
};

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); 
        container.id = "video-list-container"; 
        container.style.cssText = "margin-top: 35px; padding: 30px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 99999; position: relative;"; 
        let gameContainer = document.getElementById("game-container"); 
        if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); 
    }
    
    if (window.savedVideos.length === 0) { 
        container.innerHTML = `<div style="text-align: center; padding: 20px;"><h3 style="margin: 0 0 10px 0; color: #fff; font-weight: 800; font-size: 28px;">📖 MANGA STUDIO</h3><p style="color: #94a3b8; margin: 0;">Chưa có tập phim nào. Hãy bắt đầu trận chiến!</p></div>`; 
        return; 
    }
    
    let html = `<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #fff; font-weight: 800; letter-spacing: 1px; font-size: 24px;">📖 MANGA STUDIO</h3>
                    <span style="background: rgba(255,255,255,0.1); color: #fff; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">${window.savedVideos.length} Phim</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; max-height: 550px; overflow-y: auto; padding-right: 10px;">`;
    
    window.savedVideos.forEach((vid) => { 
        let postKitText = window.StoryModeAI.generateViralPostKit ? window.StoryModeAI.generateViralPostKit(vid.heroName, "BOSS") : vid.viralTitle;
        html += `<div style="display: flex; gap: 20px; background: rgba(0, 0, 0, 0.4); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s ease;">
                    <div style="position: relative; width: 130px; height: 231px; flex-shrink: 0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.8); border: 2px solid #333;">
                        <img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span style="position: absolute; bottom: 8px; right: 8px; background: #000; color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 2px; font-weight: bold;">${vid.timestamp}</span>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <div>
                            <span style="font-weight: 800; color: #fff; font-size: 20px; display: block; margin-bottom: 10px; line-height: 1.3;">${vid.viralTitle}</span>
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; font-weight: 500;">
                                <img src="${vid.heroAvatar}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #555;"> 
                                <span style="color: #cbd5e1;">Nhân vật chính: ${vid.heroName}</span>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 25px;">
                            <button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: rgba(255,255,255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.3); padding: 10px 16px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 13px;">📋 Chép Caption</button>
                            <button id="btn-dl-${vid.id}" onclick="window.mergeAndDownloadVideo(${vid.id})" style="background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; font-weight: 800; flex: 1; cursor:pointer;">📥 XUẤT PHIM</button>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer;">Xóa</button>
                        </div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
