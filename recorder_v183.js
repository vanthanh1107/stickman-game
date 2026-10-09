// ==========================================
// RECORDER.JS - V77.0 STORYBOOK MANGA EDITION (CLEAN CHAT UI)
// NÂNG CẤP TỪ V76.9:
// 1. STORY GENERATOR: Cốt truyện ngẫu nhiên (Kiếm hiệp, Drama, Đòi nợ, Anime).
// 2. HAND-DRAWN FILTER: Hiệu ứng vẽ tay, giấy nhám, boiling lines.
// 3. COMIC UI: Lời thoại kiểu Manga, Kết thúc kể chuyện như 1 cuốn sách.
// 4. CLEAN CHAT: Bỏ nền hộp thoại và hạt bay lơ lửng cho giao diện gọn gàng hơn.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

window.introStartTime = 0; window.introDuration = 3200; window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._baitTriggered = false; window._baitType = -1; window._baitStartTime = 0;
window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

window._lastP1Hp = 1; window._lastP2Hp = 1;
window._impactFrames = 0; window._impactIntensity = 0; window._impactColor = "#ffffff";

window._hypeWords = ["BRO NO WAY 💀", "WAIT FOR IT...", "500 IQ 🧠", "LOBOTOMY 📉", "NAHHH 😭", "WHAT???", "GG EZ 🔥", "BRO IS COOKING 🍳"];
window._currentHype = { word: "", time: 0 };
window._engagementParticles = Array.from({length: 20}, () => ({ active: false, x: 0, y: 0, v: 0, icon: "", alpha: 0, scale: 1 }));

// ==========================================
// HỆ THỐNG CỐT TRUYỆN NGẪU NHIÊN KHI XUẤT VIDEO
// ==========================================
window.STORY_TEMPLATES = [
    // 1. CỐT TRUYỆN: SƯ ĐỒ TƯƠNG TÀN (Kiếm hiệp)
    [
        { triggerHp: 0.8, speaker: "P2", text: "Nghịch đồ! Hôm nay vi sư phải thanh lý môn hộ!", face: "https://files.catbox.moe/kixqol.png", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Lão phu tử, thời đại của ông đã kết thúc rồi!", face: "https://files.catbox.moe/v68cni.png", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Khinh công của ngươi vẫn còn non kém lắm! Đỡ chiêu này!", face: "https://files.catbox.moe/v2rt0n.png", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Khụ... Đừng hòng! Huyết Ma Công... Ta sẽ kéo ông theo cùng! 👺", face: "https://files.catbox.moe/t0h9n6.png", duration: 4500 }
    ],
    // 2. CỐT TRUYỆN: TÌNH YÊU NGANG TRÁI (Drama)
    [
        { triggerHp: 0.8, speaker: "P2", text: "Tại sao... Tại sao anh lại phản bội em để đi theo cô ta? 💔", face: "https://files.catbox.moe/kixqol.png", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Em không hiểu đâu! Cô ấy cho anh thứ mà em không thể... V-Bucks!", face: "https://files.catbox.moe/v68cni.png", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Anh đúng là đồ tồi! Trả lại thanh xuân cho tôi đây! 😭", face: "https://files.catbox.moe/v2rt0n.png", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Xin lỗi... Nhưng anh phải vung kiếm để bảo vệ Acc phụ của mình!", face: "https://files.catbox.moe/t0h9n6.png", duration: 4500 }
    ],
    // 3. CỐT TRUYỆN: ĐÒI NỢ THUÊ (Hài hước đời thực)
    [
        { triggerHp: 0.8, speaker: "P2", text: "Thằng kia! 5 loét mày mượn tao từ tháng trước đâu? Chạy đi đâu?", face: "https://files.catbox.moe/kixqol.png", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Đợi mai trúng lô tao trả! Làm gì mà căng thế hả bạn ơi? 🏃💨", face: "https://files.catbox.moe/v68cni.png", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Căng à? Đưa tiền đây không tao nện cho mẹ nhìn không ra bây giờ!", face: "https://files.catbox.moe/v2rt0n.png", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Được rồi... Mày ép tao! Phép thuật biến hình: SỦI! 🌪️", face: "https://files.catbox.moe/t0h9n6.png", duration: 4500 }
    ],
    // 4. CỐT TRUYỆN: XUYÊN KHÔNG VÀO GAME (Isekai)
    [
        { triggerHp: 0.8, speaker: "P2", text: "Ngươi là kẻ dị giới nào? Tại sao dám xâm phạm cấm địa? ⚔️", face: "https://files.catbox.moe/kixqol.png", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Vừa bị xe tải tông xong đã bắt đi đánh Boss? Khổ vãi! 😩", face: "https://files.catbox.moe/v68cni.png", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Lải nhải gì thế? Dưới lưỡi kiếm của ta, mọi sinh linh đều bình đẳng!", face: "https://files.catbox.moe/v2rt0n.png", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Hệ thống! Kích hoạt thẻ bài VIP cho ta... Á đù, lỗi mạng?! 🌐", face: "https://files.catbox.moe/t0h9n6.png", duration: 4500 }
    ],
    // 5. CỐT TRUYỆN: ANIME CHUUNIBYOU (Ảo tưởng sức mạnh)
    [
        { triggerHp: 0.8, speaker: "P2", text: "Hahahaha! Sự hủy diệt đã điểm! Hắc Huyết Ma Long chuẩn bị thức tỉnh!", face: "https://files.catbox.moe/kixqol.png", duration: 4000 },
        { triggerHp: 0.6, speaker: "P1", text: "Cánh tay phải của ta đang gào thét... Không thể kìm nén sức mạnh này nữa! 👁", face: "https://files.catbox.moe/v68cni.png", duration: 4000 },
        { triggerHp: 0.4, speaker: "P2", text: "Chỉ với chút hào quang yếu ớt đó mà đòi cản ta sao? Ngu ngốc!", face: "https://files.catbox.moe/v2rt0n.png", duration: 4000 },
        { triggerHp: 0.2, speaker: "P1", text: "Bởi vì ta... không cô đơn! Sức mạnh tình bạn... BANKAI! 🌸🔥", face: "https://files.catbox.moe/t0h9n6.png", duration: 4500 }
    ]
];

window._storyQuotes = [];
window._activeQuote = null;
window._activeQuoteStartTime = 0;

window.getRealCharName = function(obj, fallback) {
    if (!obj) return fallback.toUpperCase();
    let n = null;
    if (obj.classId !== undefined && window.classStats && window.classStats[obj.classId]) { n = window.classStats[obj.classId].className || window.classStats[obj.classId].name; }
    if (!n) n = obj.className || obj.name || obj.type || obj.id;
    if (!n || n === "undefined" || n === "null") return fallback.toUpperCase();
    return String(n).toUpperCase().trim();
};

const THEMES = [
    { id: "fire", c1: "#3a0000", c2: "#050000", aura: "#ff003c" }, { id: "ice", c1: "#001b3a", c2: "#00050a", aura: "#00f3ff" },
    { id: "toxic", c1: "#0a2a00", c2: "#000a00", aura: "#39ff14" }, { id: "void", c1: "#1a003a", c2: "#05000a", aura: "#b100ff" },
    { id: "gold", c1: "#3a2500", c2: "#0a0500", aura: "#ffb800" }, { id: "blood", c1: "#2a0000", c2: "#000000", aura: "#ff0000" }
];

const LORES = [
    { chapter: "CHƯƠNG 1: SỰ PHẢN BỘI", p2Sub: "Ta đã dạy ngươi mọi thứ...", p1Sub: "Giờ hãy xem cơn thịnh nộ của ta." },
    { chapter: "CHƯƠNG CUỐI: KẾT THÚC", p2Sub: "Biết thân biết phận đi.", p1Sub: "Đế chế của ngươi sụp đổ rồi." },
    { chapter: "NGOẠI TRUYỆN: MÓN NỢ", p2Sub: "Trốn đi đâu hả con?", p1Sub: "Cho khất nốt hôm nay thôi!" },
    { chapter: "CHƯƠNG 2: TÌNH VÀ HẬN", p2Sub: "Sao anh nỡ làm thế?", p1Sub: "Đó là do số phận..." }
];

const WAGER_BADGES = ["🎬 PHIM NGẮN TƯƠNG TÁC", "📖 TIỂU THUYẾT TRỰC TUYẾN", "🎭 DRAMA CỰC CĂNG", "🍿 RẠP CHIẾU PHIM TIKTOK"];

function makeTypo(str) {
    if(Math.random() > 0.5) return str; 
    let arr = str.split(''); let idx = Math.floor(Math.random() * (arr.length - 2)) + 1;
    if (arr[idx] !== ' ' && arr[idx+1] !== ' ') { let temp = arr[idx]; arr[idx] = arr[idx+1]; arr[idx+1] = temp; }
    return arr.join('');
}

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return { themeP1: r(THEMES), themeP2: r(THEMES), lore: { ...r(LORES), chapter: makeTypo(r(LORES).chapter) }, badge: r(WAGER_BADGES) };
};

window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "NoobSlayer", color: "#ff9900" }
];

const TOXIC_MSGS = [
    "Cốt truyện cuốn vãi 🍿", "Đạo diễn xuất sắc quá!", "Plot twist thế ai ngờ 🤯",
    "Khóc mẹ rồi 😭", "Ông P1 ác vãi", "Đúng là phim truyền hình 📺",
    "Chờ phần 2!!!", "Quả thoại đỉnh cao 🔥", "P2 diễn sâu quá", "Xin info nhạc phim 🎵", "Phim hay hơn Netflop 🎬"
];

window._recentChatsMemory = [];

window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST); let msg = r(TOXIC_MSGS); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(TOXIC_MSGS); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, lines: null, nameWidth: 0 };
};

window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; ctx.font = "bold 34px Arial"; chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 880 - 150 - chatObj.nameWidth - 10; 
    let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { let testLine = currentLine + words[n] + " "; if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { lines.push(currentLine.trim()); currentLine = words[n] + " "; } else { currentLine = testLine; } }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

window.retentionParticles = Array.from({length: 40}, () => ({ active: false, x: 0, y: 0, s: 0, v: 0, h: 0, age: 0 }));
window.retentionEmojis = Array.from({length: 15}, () => ({ active: false, x: 0, y: 0, v: 0, e: "", r: 0, age: 0 }));

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    viralTitle: "",
    generateStoryTitle: function(p1Name, p2Name) {
        const titles = [
            `CUỘC CHIẾN ĐỊNH MỆNH: ${p1Name} QUYẾT TỬ VỚI ${p2Name} ⚔️`,
            `CHUYỆN TÌNH NGANG TRÁI: ĐOẠN KIẾM CẮT ĐỨT TƠ HỒNG 💔`,
            `SỰ THỨC TỈNH CỦA HẮC LONG: ${p1Name} BẠO TẨU 🐉`,
            `TRUYỀN THUYẾT DỊ GIỚI: ${p2Name} PHẢI ĐỀN MẠNG! 🔥`,
            `NGOẠI TRUYỆN: KHI BẠN BỊ ĐÒI NỢ LÚC NỬA ĐÊM 🏃💨`,
            `SƯ ĐỒ TƯƠNG TÀN: KẾT CỤC BUỒN CHO ${p2Name} 🍂`,
            `TẬP ĐẶC BIỆT: ÂN OÁN GIANG HỒ GIỮA ${p1Name} VÀ ${p2Name} 🎬`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return r(titles) + " #cottruyen #gaming";
    },
    generateViralPostKit: function(p1Name, p2Name) {
        const title = this.generateStoryTitle(p1Name || "NHÂN VẬT CHÍNH", p2Name || "BOSS");
        const pinnedComments = [
            `👇 GHIM: Theo bạn ai mới là người đúng trong câu chuyện này? 😢`,
            `👇 GHIM: Cốt truyện plot twist quá, không ai ngờ được kết cục này! 🔥`,
            `👇 GHIM: Nếu là nhân vật chính, bạn sẽ xử lý tình huống này thế nào? 🤔`,
            `👇 GHIM: Biên kịch xứng đáng nhận giải Oscar 🏆 Mọi người chấm mấy điểm?`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `🎬 TIKTOK STORY KIT\n\n📌 TIÊU ĐỀ:\n${title}\n\n💬 BÌNH LUẬN GHIM:\n${r(pinnedComments)}`;
    },
    init: function(p1Name, p2Name) { 
        this.viralTitle = this.generateStoryTitle(p1Name || "HERO", p2Name || "BOSS"); 
    }, 
    stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

window.showRenderToast = function(msg) {
    let toast = document.getElementById("render-toast-noti");
    if (!toast) { toast = document.createElement("div"); toast.id = "render-toast-noti"; toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff0050; color: white; padding: 12px 25px; border-radius: 30px; font-family: 'Arial Black', sans-serif; font-size: 16px; z-index: 2147483647; box-shadow: 0 4px 15px rgba(255,0,80,0.5); border: 2px solid #fff; transition: opacity 0.3s; pointer-events: none;"; document.body.appendChild(toast); }
    toast.innerHTML = msg || "⏳ RENDERING TIKTOK... PLEASE WAIT (DON'T CLOSE)"; toast.style.opacity = "1";
};
window.hideRenderToast = function() { let toast = document.getElementById("render-toast-noti"); if (toast) toast.style.opacity = "0"; };

window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
        let ctxV = window.bakedThumbV.getContext('2d');
        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1; let prm = window.introParams; 
        ctxV.fillStyle = prm.themeP1.c1; ctxV.fillRect(0, 0, 1080, 1920); ctxV.save(); ctxV.translate(540, 960);
        for(let i=0; i<30; i++) { ctxV.rotate(Math.PI / 15); ctxV.fillStyle = prm.themeP2.c1; ctxV.beginPath(); ctxV.moveTo(0, 0); ctxV.lineTo(2000, 100); ctxV.lineTo(2000, -100); ctxV.fill(); }
        ctxV.restore(); ctxV.globalCompositeOperation = 'overlay'; ctxV.fillStyle = "rgba(0, 0, 0, 0.5)";
        for(let x=0; x<1080; x+=20) { for(let y=0; y<1920; y+=20) { if((x+y)%40===0) { ctxV.beginPath(); ctxV.arc(x, y, 4, 0, Math.PI*2); ctxV.fill(); } } } ctxV.globalCompositeOperation = 'source-over';
        
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        };
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        
        ctxV.save(); let rx = 540; let ry = 1920*0.4 + Math.random()*150;
        ctxV.strokeStyle = prm.themeP2.aura; ctxV.lineWidth = 18; ctxV.beginPath(); ctxV.ellipse(rx, ry, 90 + Math.random()*40, 135 + Math.random()*40, Math.random()*0.5, 0, Math.PI*2); ctxV.stroke();
        ctxV.font = "110px Arial"; ctxV.fillText(rx > 540 ? "⬅️" : "➡️", rx + (rx > 540 ? -150 : 75), ry);
        ctxV.translate(1080*0.7, 1920*0.6); ctxV.rotate((Math.random()-0.5)*0.5); 
        ctxV.font = "italic 900 80px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.lineWidth = 18; ctxV.strokeStyle = "#000"; ctxV.strokeText(prm.lore.chapter, 0,0);
        ctxV.fillStyle = prm.themeP2.aura; ctxV.fillText(prm.lore.chapter, 0,0); ctxV.fillStyle = "#fff"; ctxV.fillText(prm.lore.chapter, -4,-4); ctxV.restore();
        
        ctxV.save(); let grad = ctxV.createRadialGradient(540, 960, 500, 540, 960, 1920); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
        ctxV.fillStyle = grad; ctxV.fillRect(0,0,1080,1920); ctxV.translate(540, 300); ctxV.rotate(-0.06); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `italic 900 85px 'Arial Black', Impact`; 
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(); let words = shortTitle.split(" "); let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
        lines.forEach((line, index) => { let yOffset = index * 95; ctxV.lineWidth = 25; ctxV.strokeStyle = "#000"; for(let d=15; d>0; d--) { ctxV.strokeText(line, d, yOffset + d); ctxV.fillStyle = prm.themeP1.c1; ctxV.fillText(line, d, yOffset + d); } ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = prm.themeP1.aura; ctxV.fillText(line, 0, yOffset); ctxV.fillStyle = "#ffffff"; ctxV.fillText(line, -3, yOffset - 3); }); ctxV.restore();
    } catch (e) {}
};

function drawBaitSạn(ctx, w, h) {
    if (!window._baitTriggered || window._baitType === -1) return;
    let timeSinceBait = Date.now() - window._baitStartTime;
    if (timeSinceBait > 3500) { window._baitType = -1; return; } 
    ctx.save(); let alpha = 1;
    if (timeSinceBait < 300) alpha = timeSinceBait / 300;
    if (timeSinceBait > 3200) alpha = 1 - ((timeSinceBait - 3200) / 300);
    ctx.globalAlpha = alpha;

    if (window._baitType === 0) {
        ctx.translate(w/2, h/2); ctx.fillStyle = "rgba(230, 230, 230, 0.95)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-220, -100, 440, 200, 20); else ctx.fillRect(-220, -100, 440, 200); ctx.fill();
        ctx.fillStyle = "#000"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center"; ctx.fillText("Low Battery", 0, -40);
        ctx.font = "20px Arial"; ctx.fillText("10% battery remaining.", 0, 0); ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-220, 40); ctx.lineTo(220, 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 100); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "22px Arial"; ctx.fillText("Close", -110, 75); ctx.fillText("Low Power Mode", 110, 75);
    } 
    else if (window._baitType === 1) {
        let slideY = timeSinceBait < 400 ? -150 + (timeSinceBait/400)*250 : 100;
        ctx.translate(w/2, slideY); ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 20;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-400, -50, 800, 100, 25); else ctx.fillRect(-400, -50, 800, 100); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(-330, 0, 35, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("M", -330, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.font = "bold 28px Arial"; ctx.fillText("Mẹ 😡", -270, -15);
        ctx.font = "24px Arial"; ctx.fillStyle = "#555"; ctx.fillText("Tắt máy đi ngủ ngay không tao đập máy bây giờ", -270, 20);
    }
    else if (window._baitType === 2) {
        if (Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.translate(w - 200, 150); ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-30, -30, 180, 60, 10); else ctx.fillRect(-30, -30, 180, 60); ctx.fill();
            ctx.fillStyle = "#ff0000"; ctx.font = "bold 30px 'Arial Black', sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("📶 999ms", 60, 0);
        }
    }
    ctx.restore();
}

// INTRO MỚI: PHÁC THẢO SÁCH TRUYỆN TRANH
window.drawProceduralIntro = function(ctx, w, h, progress) {
    ctx.save();
    let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "OPPONENT");

    // Nền giấy phác thảo
    ctx.fillStyle = "#f0ebdf"; // Màu giấy nhám
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.1;
    for(let i=0; i<w; i+=4) { ctx.fillStyle = "#000"; ctx.fillRect(i, 0, 1, h); } // Sọc giấy
    ctx.globalAlpha = 1.0;

    let act = progress < 0.3 ? 0 : progress < 0.6 ? 1 : 2;
    let localProg = progress < 0.3 ? progress/0.3 : progress < 0.6 ? (progress-0.3)/0.3 : (progress-0.6)/0.4;
    
    // Nét bút chì rung (Boiling lines)
    let jitterX = (Math.random() - 0.5) * 6;
    let jitterY = (Math.random() - 0.5) * 6;
    ctx.translate(w/2 + jitterX, h/2 + jitterY);
    ctx.scale(2.0, 2.0);

    const drawSketchFighter = (charObj, cx, cy, isFacingRight, label) => {
        if(!charObj) return;
        ctx.save(); ctx.translate(cx, cy);
        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.5, isFacingRight: true, state: 'idle'});
        
        // Filter bút chì
        ctx.filter = "grayscale(100%) contrast(200%) sepia(30%)";
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
        ctx.restore();

        if (label) {
            ctx.save(); ctx.translate(cx, cy - 250);
            ctx.font = "900 35px 'Comic Sans MS', sans-serif";
            ctx.textAlign = "center"; ctx.fillStyle = "#000";
            ctx.fillText(label, 0, 0);
            // Gạch chân vẽ tay
            ctx.beginPath(); ctx.moveTo(-50, 10); ctx.lineTo(50 + Math.random()*10, 10 + Math.random()*5);
            ctx.lineWidth = 3; ctx.strokeStyle = "#000"; ctx.stroke();
            ctx.restore();
        }
    };

    if (act === 0) {
        drawSketchFighter(window.p1, 0, 100, true, realP1Name);
    } else if (act === 1) {
        drawSketchFighter(window.enemies ? window.enemies[0] : null, 0, 100, false, realP2Name);
    } else {
        let pushP1 = -300 + Math.pow(localProg, 2) * 150;
        let pushP2 = 300 - Math.pow(localProg, 2) * 150;
        drawSketchFighter(window.p1, pushP1, 100, true, null);
        drawSketchFighter(window.enemies ? window.enemies[0] : null, pushP2, 100, false, null);

        ctx.translate(0, -150);
        ctx.font = "900 100px 'Comic Sans MS', sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillStyle = "#000"; 
        ctx.fillText("VS", Math.random()*4 - 2, Math.random()*4 - 2);
    }

    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = "#000"; ctx.textAlign = "center";
    ctx.font = "bold 50px 'Comic Sans MS', sans-serif";
    ctx.fillText(prm.lore.chapter, w/2 + jitterX, 150 + jitterY);

    ctx.restore();
};

// UI LỜI THOẠI TRUYỆN TRANH MỚI
window.drawCinematicQuote = function(ctx, quote, elapsed, w, h, p1Url, p2Url, getHudImg) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 400) alpha = elapsed / 400;
    if (elapsed > quote.duration - 400) alpha = (quote.duration - elapsed) / 400;
    ctx.globalAlpha = alpha;

    // Làm mờ nền kiểu truyện tranh
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, w, h);

    let boxW = w - 80;
    let boxH = 180;
    let boxX = 40;
    let boxY = h - 120 - boxH - 30;

    // Khung nhám vẽ tay
    let jitter = (Math.random() - 0.5) * 4;
    ctx.fillStyle = "#f8f5e6";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 15); ctx.fill(); 
    } else { 
        ctx.fillRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#1a1a1a";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 15); ctx.stroke(); 
    } else { 
        ctx.strokeRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    let faceSize = 130;
    let faceX = quote.speaker === "P1" ? boxX + 25 : boxX + boxW - faceSize - 25;
    let faceY = boxY + 25;
    
    let faceImgUrl = quote.face || (quote.speaker === "P1" ? p1Url : p2Url);
    let faceImg = getHudImg ? getHudImg(faceImgUrl) : null;
    
    if (faceImg && faceImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2); ctx.clip();
        ctx.filter = "grayscale(100%) contrast(150%)";
        ctx.drawImage(faceImg, faceX, faceY, faceSize, faceSize);
        ctx.restore();
        
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2);
        ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.stroke();
    }

    let speakerName = quote.speaker === "P1" ? window.getRealCharName(window.p1, "PLAYER") : (window.enemies && window.enemies.length ? window.getRealCharName(window.enemies[0], "BOSS") : "OPPONENT");
    let textStartX = quote.speaker === "P1" ? boxX + faceSize + 50 : boxX + 35;
    let maxTextW = boxW - faceSize - 80;

    ctx.fillStyle = "#000";
    ctx.font = "900 32px 'Comic Sans MS', 'Arial Black', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(speakerName, textStartX, boxY + 25);
    
    let charsToShow = Math.floor((elapsed - 400) / 35); 
    if (charsToShow < 0) charsToShow = 0;
    let displayedText = quote.text.substring(0, charsToShow);
    
    ctx.fillStyle = "#222";
    ctx.font = "bold 30px 'Comic Sans MS', Arial, sans-serif";
    
    let words = displayedText.split(" ");
    let line = "";
    let lineY = boxY + 75;
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

    window.recordedChunksV = []; window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    window._introChatSpam = []; window._introEmojis = []; window._introBottomChats = null; window._p2Bubbles = null;
    window._liveAlerts = []; window._lastAlertTime = Date.now(); 
    window._baitTriggered = false; window._baitType = -1;
    
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
    window._chatSystemInit = false; window._cachedGradients = {};
    if (typeof window._fakeViewers === "undefined") window._fakeViewers = 350 + Math.floor(Math.random() * 500);

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
    window._sfxCuts = [false, false, false, false, false]; 
    window._lastCaptureTime = Date.now(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    window.showRenderToast("⏳ ĐANG LƯU CLIP...");
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 33) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
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
    let audioPeak = window.analyserData[3] / 255 || 0; let shakeX = 0, shakeY = 0;
    
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 35; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    let isKillCamActive = (window.gameOver && window.matchEndTimer > 0 && window.matchEndTimer < 45);

    if (renderNormalV && elapsed > 4000 && !window._baitTriggered && Math.random() < 0.008) {
        window._baitTriggered = true; window._baitType = Math.floor(Math.random() * 3); window._baitStartTime = Date.now();
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
                window._impactFrames = 12; 
                window._impactIntensity = Math.min((p1Dmg + p2Dmg) * 300, 40); 
                window._impactColor = (p1Dmg > p2Dmg) ? "#ff003c" : "#ffffff"; 
            }
        }
        window._lastP1Hp = p1HpPct;
        window._lastP2Hp = p2HpPct;

        ctxV.save();

        if (isKillCamActive) {
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(1.25, 1.25); ctxV.translate(-540, -splitGameHeight / 2);
            if (window.matchEndTimer < 16 && window.matchEndTimer % 4 === 0) ctxV.filter = "invert(100%) contrast(200%)";
        } else if (window._impactFrames > 0) {
            let zoom = 1 + (window._impactFrames * 0.015);
            let extraShakeX = (Math.random() - 0.5) * window._impactIntensity;
            let extraShakeY = (Math.random() - 0.5) * window._impactIntensity;
            
            ctxV.translate(540, splitGameHeight / 2);
            ctxV.scale(zoom, zoom);
            ctxV.translate(-540 + extraShakeX, -splitGameHeight / 2 + extraShakeY);
        }

        // ======= HIỆU ỨNG VẼ TAY & RUNG (BOILING LINES) TRONG TRẬN ĐÁNH =======
        let jitterGameX = (Math.random() - 0.5) * 3;
        let jitterGameY = (Math.random() - 0.5) * 3;
        ctxV.save();
        ctxV.translate(jitterGameX, jitterGameY);
        ctxV.filter = "sepia(40%) contrast(130%) saturate(90%)"; 

        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

        if (window._impactFrames > 0) {
            let flashAlpha = window._impactFrames / 15;
            ctxV.fillStyle = window._impactColor;
            ctxV.globalAlpha = flashAlpha * 0.5;
            ctxV.globalCompositeOperation = "overlay";
            ctxV.fillRect(0, 0, 1080, splitGameHeight);
            ctxV.globalAlpha = 1.0;
            ctxV.globalCompositeOperation = "source-over";
            
            ctxV.save();
            ctxV.translate(540, splitGameHeight/2);
            ctxV.strokeStyle = "rgba(0, 0, 0, 0.4)";
            ctxV.lineWidth = 3 + Math.random() * 5;
            ctxV.beginPath();
            for(let i=0; i<30; i++) {
                let angle = Math.random() * Math.PI * 2;
                let innerRadius = 300 + Math.random() * 100;
                let outerRadius = 800;
                ctxV.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
                ctxV.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
            }
            ctxV.stroke();
            ctxV.restore();

            window._impactFrames--;
        }
        
        ctxV.restore(); 
        ctxV.restore(); 

        ctxV.save();
        ctxV.shadowColor = "#000000"; ctxV.shadowBlur = 15;
        ctxV.fillStyle = "#111"; ctxV.fillRect(0, splitGameHeight, 1080, 4);
        ctxV.restore();

        if (!window._activeQuote && !window.gameOver) {
            for (let q of window._storyQuotes) {
                if (!q.triggered) {
                    let targetHp = (q.speaker === "P1") ? p1HpPct : p2HpPct;
                    if (targetHp <= q.triggerHp && targetHp > 0) {
                        q.triggered = true; window._activeQuote = q; window._activeQuoteStartTime = Date.now(); break; 
                    }
                }
            }
        }
        if (window._activeQuote) {
            let elapsedQuote = Date.now() - window._activeQuoteStartTime;
            if (elapsedQuote < window._activeQuote.duration) {
                window.drawCinematicQuote(ctxV, window._activeQuote, elapsedQuote, 1080, splitGameHeight, p1Url, p2Url, getHudImg);
            } else { window._activeQuote = null; }
        }

        if (typeof window._fakeViewers !== "undefined") {
            ctxV.save(); let badgeY = splitGameHeight - 35; let badgeX = 1060; 
            ctxV.font = "bold 22px Arial"; let viewStr = "👁️ " + window._fakeViewers.toLocaleString(); let viewW = ctxV.measureText(viewStr).width;
            ctxV.fillStyle = "rgba(0, 0, 0, 0.65)";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40); }
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "right"; ctxV.textBaseline = "middle"; ctxV.fillText(viewStr, badgeX - 10, badgeY);
            let liveW = 75; ctxV.fillStyle = (Math.floor(Date.now()/500)%2===0) ? "#ff0050" : "#d90040";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40); }
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "center"; ctxV.fillText("LIVE", badgeX - viewW - 25 - liveW/2 - 5, badgeY + 2); ctxV.restore();
        }

        if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) { 
            window._lastAlertTime = Date.now(); 
            let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫| 🐻| 🎤| 🪨| 🤫| 🤨| 🇺🇸| ⛳| 🍦| 🤣| 😤| 🕺| 🐉| 🦇| 🧤/g, ''); 
            let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} shared the stream!`, `👤 ${randomUser} started following you!`, `🎁 ${randomUser} sent a Rose!`, `🔥 ${randomUser} joined the LIVE!`]; 
            window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); 
        }

        let alertStartX = 20; let alertStartY_Left = splitGameHeight - 15;
        for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
            let al = window._liveAlerts[i]; al.life -= 0.012; al.yOffset += 1.8; ctxV.save(); 
            ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 2.0)); ctxV.font = "bold 24px Arial"; 
            let textW = ctxV.measureText(al.text).width; ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
            let alertGrad = ctxV.createLinearGradient(0, 0, textW + 40, 0); alertGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)"); alertGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            ctxV.fillStyle = alertGrad; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -23, textW + 40, 46, 23); ctxV.fill(); } else { ctxV.fillRect(0, -23, textW + 40, 46); } 
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 15, 0); ctxV.restore(); 
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; ctxV.fillStyle = '#ff0000'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.fillStyle = '#00ffff'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        drawBaitSạn(ctxV, 1080, splitGameHeight);

        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        let botGrad = ctxV.createLinearGradient(0, retainY, 0, 1920);
        botGrad.addColorStop(0, "#080b12");
        botGrad.addColorStop(1, "#151122");
        ctxV.fillStyle = botGrad; 
        ctxV.fillRect(0, retainY, 1080, retainHeight); 
        
        if (!isOutroActive) {
            let bannerY = retainY + 2; 
            ctxV.fillStyle = "#ff0050"; ctxV.fillRect(0, bannerY, 1080, 40);
            ctxV.fillStyle = "#fff"; ctxV.font = "900 24px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
            let offsetBanner = ((Date.now() / 8) % 1000) | 0; 
            for(let i = -1; i < 5; i++) { ctxV.fillText("🚨 CHỜ ĐẾN CUỐI ⏩ ĐỪNG BỎ LỠ 🚨", i*600 - offsetBanner, bannerY + 20); }
        }

        // [ĐÃ XÓA] Ẩn hiệu ứng hạt màu xanh bay lên gây rối mắt

        if (!isOutroActive) {

            if (window.p1) {
                let p1Stam = Math.max(0, window.p1.stamina / 100); let eStam = 0;
                let p1Name = window.getRealCharName(window.p1, "PLAYER"); let eName = "BOSS";
                if (repEnemyObj) { eStam = Math.max(0, repEnemyObj.stamina / 100); eName = window.getRealCharName(repEnemyObj, "BOSS"); }

                let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); 
                let hudBaseY = splitGameHeight + 110; 
                let avRadius = 55;
                
                const drawPillBar = (ctx, x, y, w, h, fillGrad, pct, isRightAligned) => {
                    ctx.save();
                    ctx.fillStyle = "rgba(0,0,0,0.6)";
                    if(ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.fill(); } else { ctx.fillRect(x, y, w, h); }
                    let fillW = Math.max(0, w * pct);
                    if (fillW > 0) {
                        ctx.fillStyle = fillGrad;
                        if(ctx.roundRect) { 
                            ctx.beginPath(); 
                            if(isRightAligned) ctx.roundRect(x + (w - fillW), y, fillW, h, h/2);
                            else ctx.roundRect(x, y, fillW, h, h/2);
                            ctx.fill(); 
                        } else {
                            if(isRightAligned) ctx.fillRect(x + (w - fillW), y, fillW, h);
                            else ctx.fillRect(x, y, fillW, h);
                        }
                    }
                    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.2)";
                    if(ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.stroke(); }
                    ctx.restore();
                };

                let p1Cx = 120, p1Cy = hudBaseY;
                if (img1) { 
                    ctxV.save(); ctxV.beginPath(); ctxV.arc(p1Cx, p1Cy, avRadius, 0, Math.PI*2); ctxV.clip(); 
                    ctxV.drawImage(img1, p1Cx-avRadius, p1Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                }
                ctxV.beginPath(); ctxV.arc(p1Cx, p1Cy, avRadius, 0, Math.PI*2);
                ctxV.lineWidth = 6; ctxV.strokeStyle = "#00f3ff"; ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 15; ctxV.stroke();
                ctxV.shadowBlur = 0;

                ctxV.textAlign = "left"; ctxV.fillStyle = "#fff"; ctxV.font = "900 32px 'Arial Black', sans-serif"; 
                ctxV.fillText(p1Name, p1Cx + 70, p1Cy - 15);
                
                if(!window._cachedGradients.hpP1) { window._cachedGradients.hpP1 = ctxV.createLinearGradient(p1Cx+70, 0, p1Cx+70+320, 0); window._cachedGradients.hpP1.addColorStop(0, "#00f2fe"); window._cachedGradients.hpP1.addColorStop(1, "#4facfe"); }
                drawPillBar(ctxV, p1Cx + 70, p1Cy + 5, 320, 24, window._cachedGradients.hpP1, p1HpPct, false);
                drawPillBar(ctxV, p1Cx + 70, p1Cy + 35, 200, 8, "#ffeb3b", p1Stam, false);

                if (repEnemyObj) {
                    let p2Cx = 960, p2Cy = hudBaseY;
                    if (img2) { 
                        ctxV.save(); ctxV.beginPath(); ctxV.arc(p2Cx, p2Cy, avRadius, 0, Math.PI*2); ctxV.clip(); 
                        ctxV.drawImage(img2, p2Cx-avRadius, p2Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                    }
                    ctxV.beginPath(); ctxV.arc(p2Cx, p2Cy, avRadius, 0, Math.PI*2);
                    ctxV.lineWidth = 6; ctxV.strokeStyle = "#ff003c"; ctxV.shadowColor = "#ff003c"; ctxV.shadowBlur = 15; ctxV.stroke();
                    ctxV.shadowBlur = 0;

                    ctxV.textAlign = "right"; ctxV.fillStyle = "#fff"; ctxV.font = "900 32px 'Arial Black', sans-serif"; 
                    ctxV.fillText(eName, p2Cx - 70, p2Cy - 15);
                    
                    if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(p2Cx-70-320, 0, p2Cx-70, 0); window._cachedGradients.hpP2.addColorStop(0, "#ffb199"); window._cachedGradients.hpP2.addColorStop(1, "#ff0844"); }
                    drawPillBar(ctxV, p2Cx - 70 - 320, p2Cy + 5, 320, 24, window._cachedGradients.hpP2, p2HpPct, true);
                    drawPillBar(ctxV, p2Cx - 70 - 200, p2Cy + 35, 200, 8, "#ffeb3b", eStam, true);
                }

                ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = "italic 900 45px 'Arial Black'";
                ctxV.fillStyle = "#334155"; ctxV.fillText("VS", 540, hudBaseY); ctxV.fillStyle = "#fff"; ctxV.fillText("VS", 537, hudBaseY - 3);
            }

            if (window.p1 && repEnemyObj) {
                ctxV.save(); let pollY = splitGameHeight + 230; let pollWidth = 840; let pollX = 540; ctxV.translate(pollX, pollY);
                ctxV.fillStyle = "#94a3b8"; ctxV.font = "700 18px Arial"; ctxV.textAlign = "center"; ctxV.fillText("VOTE WINNER", 0, -25);
                
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                
                ctxV.fillStyle = "rgba(255, 0, 60, 0.8)"; 
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 24, 12); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 24); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 24, 12); ctxV.clip(); } 
                ctxV.fillStyle = "rgba(0, 243, 255, 0.9)"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 24); ctxV.restore();
                
                ctxV.fillStyle = "#0f172a"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 12, 18, 0, Math.PI*2); ctxV.fill(); 
                ctxV.lineWidth = 2; ctxV.strokeStyle = "#fff"; ctxV.stroke(); 
                ctxV.fillStyle = "#fff"; ctxV.font = "900 12px 'Arial Black'"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 12);
                
                ctxV.fillStyle = "#fff"; ctxV.font = "900 18px 'Arial Black'"; 
                ctxV.textAlign = "left"; ctxV.fillText(`${Math.round(p1Pct*100)}%`, -pollWidth/2 + 15, 12); 
                ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}%`, pollWidth/2 - 15, 12);
                ctxV.restore();
            }

            if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent(); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }
            let chatNow = Date.now();
            if (chatNow - window._lastChatUpdate > window._nextChatDelay) { window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; let newChat = window.generateLiveChatEvent(); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); if (window._liveChats.length > 12) window._liveChats.shift(); window._fakeViewers += Math.floor(Math.random() * 41) - 15; if(window._fakeViewers < 200) window._fakeViewers += Math.floor(Math.random() * 50); if(window._fakeViewers > 2500) window._fakeViewers -= Math.floor(Math.random() * 50); }

            // ======= BẮT ĐẦU VẼ CHAT MỚI (CLEAN) =======
            let boxWidth = 880; let boxHeight = 720; let boxX = 540; let boxY = 1520; 

            ctxV.save(); ctxV.translate(boxX, boxY); 
            
            // Chỉ dùng clip để giới hạn khu vực hiển thị chat, KHÔNG vẽ background box
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 20); ctxV.clip(); 
            
            ctxV.save(); ctxV.rotate(-0.10); ctxV.font = "900 70px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            let brandWM = window.CREATOR_HANDLE || "Sticklom";
            ctxV.fillStyle = "rgba(255, 255, 255, 0.04)"; ctxV.fillText(brandWM, 0, 0); ctxV.restore();

            ctxV.fillStyle = "#e2e8f0"; ctxV.font = "700 22px Arial"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
            ctxV.fillText("💬 Mọi người đang nói gì...", -boxWidth/2 + 25, -boxHeight/2 + 25); 
            
            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 50, boxWidth, boxHeight - 50); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 40; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 30px Arial"; let headerBottomY = -boxHeight/2 + 50; 
            
            for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                let chat = window._liveChats[i]; let nameStr = chat.name + ":"; 
                for(let l = chat.lines.length - 1; l >= 0; l--) {
                    if (currentY - lineHeight < headerBottomY - 5) break;
                    if (l === 0) { ctxV.fillStyle = chat.color; ctxV.fillText(nameStr, -boxWidth/2 + 25, currentY); ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY); } 
                    else { ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY); }
                    currentY -= lineHeight; 
                }
                if (currentY - lineHeight < headerBottomY - 5) break; currentY -= 12; 
            }
            ctxV.restore(); 
            ctxV.restore(); 
            // ======= KẾT THÚC VẼ CHAT =======

            if (audioPeak > 0.75 && Date.now() - window._currentHype.time > 2000) { window._currentHype.word = window._hypeWords[Math.floor(Math.random() * window._hypeWords.length)]; window._currentHype.time = Date.now(); }
            let hypeElapsed = Date.now() - window._currentHype.time;
            if (hypeElapsed < 1500 && window._currentHype.word) {
                ctxV.save(); let hypeScale = 1 + Math.sin(hypeElapsed / 100) * 0.2; let hypeAlpha = hypeElapsed > 1000 ? 1 - ((hypeElapsed - 1000)/500) : 1;
                ctxV.globalAlpha = hypeAlpha; ctxV.translate(540, splitGameHeight / 2 - 100); ctxV.scale(hypeScale, hypeScale); ctxV.rotate((Math.random() - 0.5) * 0.05);
                ctxV.font = "900 70px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.lineWidth = 12; ctxV.strokeStyle = "#000";
                ctxV.strokeText(window._currentHype.word, 0, 0); ctxV.fillStyle = "#ffeb3b"; ctxV.fillText(window._currentHype.word, 0, 0); ctxV.fillStyle = "#fff"; ctxV.fillText(window._currentHype.word, -3, -3); ctxV.restore();
            }
            
        } else {
            // ==========================================
            // OUTRO KỂ CHUYỆN (SÁCH KẾT THÚC)
            // ==========================================
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            
            // Vẽ nền giấy
            ctxV.fillStyle = "#f0ebdf"; 
            ctxV.fillRect(0, 0, 1080, 1920);
            
            let cx = 540; let cy = 960; 
            ctxV.textAlign = "center"; 
            ctxV.fillStyle = "#1a1a1a";
            
            // Hiệu ứng chữ nổi lên từ từ
            let storyProg = Math.min(1, (window.matchEndTimer - 120) / 100);
            if (storyProg > 0) {
                let p1Name = window.getRealCharName(window.p1, "Nhân vật chính");
                let p2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "Kẻ thù");
                
                // Xác định ai là người chiến thắng
                let isP1Win = (window.p1 && window.p1.hp > 0);
                let conclusion = isP1Win 
                    ? `Cuối cùng, ${p1Name} đã đánh bại ${p2Name}.`
                    : `${p1Name} đã gục ngã dưới tay ${p2Name}...`;
                let subConclusion = isP1Win
                    ? "Mọi ân oán đã được giải quyết. Cuộc hành trình khép lại."
                    : "Một kết cục bi thảm. Liệu có kiếp sau làm lại?";

                // Vẽ chữ kể chuyện (Font viết tay)
                ctxV.font = "italic bold 45px 'Times New Roman', serif";
                ctxV.globalAlpha = storyProg * outroAlpha;
                ctxV.fillText(conclusion, cx, cy - 100);
                
                ctxV.font = "italic 35px 'Times New Roman', serif";
                ctxV.fillText(subConclusion, cx, cy);

                // Dấu chấm hết
                ctxV.font = "bold 30px 'Times New Roman', serif";
                ctxV.fillText("— HẾT —", cx, cy + 150);

                // Viền truyện tranh ở các góc
                ctxV.lineWidth = 4; ctxV.strokeStyle = "#000";
                ctxV.strokeRect(40, 40, 1000, 1840);
                ctxV.beginPath();
                ctxV.moveTo(60, 60); ctxV.lineTo(150, 60);
                ctxV.moveTo(60, 60); ctxV.lineTo(60, 150);
                ctxV.stroke();
            }
            ctxV.restore();
        }
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Đã chép tiêu đề! Giờ bạn có thể dán lên TikTok/YouTube."); }); };

window.mergeAndDownloadVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.href = vid.urlV;
    a.download = "[STORY_MODE]_" + vid.safeFileName + "." + vid.ext;
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
        container.innerHTML = `<div style="text-align: center; padding: 20px;"><h3 style="margin: 0 0 10px 0; color: #00f3ff; font-weight: 800; letter-spacing: 1px; font-size: 28px;">🎬 TIKTOK STUDIO</h3><p style="color: #94a3b8; margin: 0; font-size: 15px;">Chưa có video nào. Hãy chiến đấu để tạo siêu phẩm!</p></div>`; 
        return; 
    }
    
    let html = `<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #fff; font-weight: 800; letter-spacing: 1px; font-size: 24px;"><span style="color:#00f3ff;">🎬 TIKTOK</span> STUDIO</h3>
                    <span style="background: rgba(0,243,255,0.1); color: #00f3ff; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">${window.savedVideos.length} Videos</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; max-height: 550px; overflow-y: auto; padding-right: 10px;">`;
    
    window.savedVideos.forEach((vid) => { 
        let postKitText = window.StoryModeAI.generateViralPostKit ? window.StoryModeAI.generateViralPostKit(vid.heroName, "BOSS") : vid.viralTitle;
        html += `<div style="display: flex; gap: 20px; background: rgba(30, 41, 59, 0.6); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s ease;">
                    <div style="position: relative; width: 130px; height: 231px; flex-shrink: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
                        <img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${vid.timestamp}</span>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <div>
                            <span style="font-weight: 800; color: #fff; font-size: 20px; display: block; margin-bottom: 10px; line-height: 1.3;">${vid.viralTitle}</span>
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; font-weight: 500;">
                                <img src="${vid.heroAvatar}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #334155;"> 
                                <span style="color: #cbd5e1;">${vid.heroName}</span>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 25px;">
                            <button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">📋 Chép Caption</button>
                            <button id="btn-dl-${vid.id}" onclick="window.mergeAndDownloadVideo(${vid.id})" style="background: #00f3ff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 800; flex: 1; cursor:pointer; box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3); transition: all 0.2s;">🚀 TẢI TIKTOK NGAY</button>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Xóa</button>
                        </div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
