// ==========================================
// RECORDER.JS - V92.1 ULTIMATE TIKTOK DOPAMINE & FULL-BODY DANCE EDITION
// GIỮ NGUYÊN 100% BỐ CỤC SẠCH (@gamenhuclon) + VŨ ĐẠO THÂN THỂ GỐC:
// 1. Nhảy Intro & Outro bằng chính thân thể, tay chân và màu sắc gốc của nhân vật (dances.js).
// 2. Mini-game tương tác "% Pin điện thoại" & "Thử thách chụp màn hình" trong Khoang Cốt Truyện.
// 3. Anime Impact Frame (0.06s): Chớp tia sét Anime trong 2 frame khi nổ đòn chí mạng (>6.5% máu).
// 4. Heartbeat Bass Synth: Tiếng nhịp tim đập trầm hồi hộp khi máu tụt xuống dưới 28%.
// 5. Live Betting Pool & Pinned Comment Bar kích thích tranh luận.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "@gamenhuclon"; 

window.introStartTime = 0; 
window.introDuration = 3200; 
window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._baitTriggered = false; window._baitType = -1; window._baitStartTime = 0;
window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 
window._outroQuotesC = null; 
window._floatingHearts = []; 
window._activeGift = null;   
window._stampSfxPlayed = false;
window._loopSfxPlayed = false;
window._animeFlashFrames = 0;
window._lastHeartbeatTime = 0;
window._betPoolP1 = 120;
window._betPoolP2 = 135;

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

window._lastP1Hp = 1; window._lastP2Hp = 1;
window._impactFrames = 0; window._impactIntensity = 0; window._impactColor = "#ffffff";

// HỆ THỐNG ÂM THANH SYNTH SFX THU TRỰC TIẾP VÀO VIDEO
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.playViralSfx = function(type) {
    if (!window.audioCtx || !window.masterRecordDestination) return;
    try {
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        const now = window.audioCtx.currentTime;
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(window.masterRecordDestination);
        gain.connect(window.audioCtx.destination);

        if (type === "countdown") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now); osc.stop(now + 0.18);
        } else if (type === "fight") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.setValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.38, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now); osc.stop(now + 0.45);
        } else if (type === "noti") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.09);
            gain.gain.setValueAtTime(0.32, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now); osc.stop(now + 0.45);
        } else if (type === "lowbat") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(392.00, now + 0.12);
            osc.frequency.setValueAtTime(329.63, now + 0.24);
            gain.gain.setValueAtTime(0.38, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if (type === "gift") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.25);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now); osc.stop(now + 0.35);
        } else if (type === "animehit") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(28, now + 0.22);
            gain.gain.setValueAtTime(0.42, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now); osc.stop(now + 0.25);
        } else if (type === "heartbeat") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(65, now);
            osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);
            osc.frequency.setValueAtTime(70, now + 0.18);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.34);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
            osc.start(now); osc.stop(now + 0.38);
        } else if (type === "stamp") {
            osc.type = "square";
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (type === "pageflip") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(900, now + 0.35);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        }
    } catch (e) {}
};

window.STORY_TEMPLATES = [
    [
        { triggerHp: 0.8, speaker: "P2", text: "Nghịch đồ! Hôm nay vi sư phải thanh lý môn hộ!", face: "https://files.catbox.moe/kixqol.png", duration: 2600 },
        { triggerHp: 0.6, speaker: "P1", text: "Lão phu tử, thời đại của ông đã kết thúc rồi!", face: "https://files.catbox.moe/v68cni.png", duration: 2600 },
        { triggerHp: 0.4, speaker: "P2", text: "Khinh công của ngươi vẫn còn non kém lắm! Đỡ chiêu này!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2600 },
        { triggerHp: 0.2, speaker: "P1", text: "Khụ... Đừng hòng! Huyết Ma Công... Ta sẽ kéo ông theo cùng! 👺", face: "https://files.catbox.moe/t0h9n6.png", duration: 2600 }
    ],
    [
        { triggerHp: 0.8, speaker: "P2", text: "Tại sao... Tại sao anh lại phản bội em để đi theo cô ta? 💔", face: "https://files.catbox.moe/kixqol.png", duration: 2600 },
        { triggerHp: 0.6, speaker: "P1", text: "Em không hiểu đâu! Cô ấy cho anh thứ mà em không thể... V-Bucks!", face: "https://files.catbox.moe/v68cni.png", duration: 2600 },
        { triggerHp: 0.4, speaker: "P2", text: "Anh đúng là đồ tồi! Trả lại thanh xuân cho tôi đây! 😭", face: "https://files.catbox.moe/v2rt0n.png", duration: 2600 },
        { triggerHp: 0.2, speaker: "P1", text: "Xin lỗi... Nhưng anh phải vung kiếm để bảo vệ Acc phụ của mình!", face: "https://files.catbox.moe/t0h9n6.png", duration: 2600 }
    ],
    [
        { triggerHp: 0.8, speaker: "P2", text: "Thằng kia! 5 loét mày mượn tao từ tháng trước đâu? Chạy đi đâu?", face: "https://files.catbox.moe/kixqol.png", duration: 2600 },
        { triggerHp: 0.6, speaker: "P1", text: "Đợi mai trúng lô tao trả! Làm gì mà căng thế hả bạn ơi? 🏃💨", face: "https://files.catbox.moe/v68cni.png", duration: 2600 },
        { triggerHp: 0.4, speaker: "P2", text: "Căng à? Đưa tiền đây không tao nện cho mẹ nhìn không ra bây giờ!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2600 },
        { triggerHp: 0.2, speaker: "P1", text: "Được rồi... Mày ép tao! Phép thuật biến hình: SỦI! 🌪️", face: "https://files.catbox.moe/t0h9n6.png", duration: 2600 }
    ],
    [
        { triggerHp: 0.8, speaker: "P2", text: "Ngươi là kẻ dị giới nào? Tại sao dám xâm phạm cấm địa? ⚔️", face: "https://files.catbox.moe/kixqol.png", duration: 2600 },
        { triggerHp: 0.6, speaker: "P1", text: "Vừa bị xe tải tông xong đã bắt đi đánh Boss? Khổ vãi! 😩", face: "https://files.catbox.moe/v68cni.png", duration: 2600 },
        { triggerHp: 0.4, speaker: "P2", text: "Lải nhải gì thế? Dưới lưỡi kiếm của ta, mọi sinh linh đều bình đẳng!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2600 },
        { triggerHp: 0.2, speaker: "P1", text: "Hệ thống! Kích hoạt thẻ bài VIP cho ta... Á đù, lỗi mạng?! 🌐", face: "https://files.catbox.moe/t0h9n6.png", duration: 2600 }
    ],
    [
        { triggerHp: 0.8, speaker: "P2", text: "Hahahaha! Sự hủy diệt đã điểm! Hắc Huyết Ma Long chuẩn bị thức tỉnh!", face: "https://files.catbox.moe/kixqol.png", duration: 2600 },
        { triggerHp: 0.6, speaker: "P1", text: "Cánh tay phải của ta đang gào thét... Không thể kìm nén sức mạnh này nữa! 👁", face: "https://files.catbox.moe/v68cni.png", duration: 2600 },
        { triggerHp: 0.4, speaker: "P2", text: "Chỉ với chút hào quang yếu ớt đó mà đòi cản ta sao? Ngu ngốc!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2600 },
        { triggerHp: 0.2, speaker: "P1", text: "Bởi vì ta... không cô đơn! Sức mạnh tình bạn... BANKAI! 🌸🔥", face: "https://files.catbox.moe/t0h9n6.png", duration: 2600 }
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

const PINNED_HOOKS = [
    "📌 Ghim: Số cuối % Pin của bạn là Chẵn hay Lẻ? Comment bên dưới nhé!",
    "📌 Ghim: Ai bảo P1 bật hack thì tua lại nhìn kỹ pha né đòn vừa rồi nhé 💀",
    "📌 Ghim: Đố ai bấm Tạm Dừng đúng lúc màn hình chớp trắng đen đấy! 📸",
    "📌 Ghim: Kèo sau anh em muốn ai lên sàn? Comment nhiều tim nhất mình làm luôn!"
];

function makeTypo(str) {
    if(Math.random() > 0.5) return str; 
    let arr = str.split(''); let idx = Math.floor(Math.random() * (arr.length - 2)) + 1;
    if (arr[idx] !== ' ' && arr[idx+1] !== ' ') { let temp = arr[idx]; arr[idx] = arr[idx+1]; arr[idx+1] = temp; }
    return arr.join('');
}

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return { themeP1: r(THEMES), themeP2: r(THEMES), lore: { ...r(LORES), chapter: makeTypo(r(LORES).chapter) }, badge: r(WAGER_BADGES), pinnedHook: r(PINNED_HOOKS) };
};

window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "NoobSlayer", color: "#ff9900" }
];

const TOXIC_MSGS = [
    "Cốt truyện cuốn vãi 🍿", "Đạo diễn xuất sắc quá!", "Plot twist thế ai ngờ 🤯",
    "Pin mình 48% số chẵn đặt cửa bên trái nhé 😂", "Ông P1 ác vãi", "Đúng là phim truyền hình 📺",
    "Chờ phần 2!!!", "Quả thoại đỉnh cao 🔥", "Pin lẻ đặt hết cửa phải rồi anh em ơi!",
    "Phim hay hơn Netflop 🎬", "Đánh như cái máy khâu 🦾", "Xóa game đi bạn êi 😂",
    "Quả xử lý cồng kềnh vãi 💀", "Bro got lobotomized 🧠📉", "Skill issue tbh 💀"
];

const BAIT_REACTION_MSGS = [
    "Ơ kìa tin nhắn ai vừa nhảy xuống thế 💀", "Vừa thấy tin nhắn Crush hay Mẹ kìa ông ơi 😂",
    "Cắm sạc pin vào đi kìa 10% rồi!! 🔋", "Tập trung đánh đi nhắn tin gì tầm này 😭",
    "Ảo thật đấy tưởng điện thoại tôi hết pin 💀"
];

const CLIMAX_REACTION_MSGS = [
    "LẬT KÈO RỒI KHÔNG THỂ TIN ĐƯỢC!! 😱", "1 MÁU CÒN SỐNG KÌA WTF?? 🤯",
    "NHẤP ĐÚP MÀN HÌNH CỨU NÓ ANH EM ƠI 💖", "Quả chớp màn hình chất vãi 🔥",
    "W W W W W W W 🔥🔥🔥", "RIP BOZO 📉💀"
];

window._recentChatsMemory = [];

window.generateLiveChatEvent = function(contextType) {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    let pool = TOXIC_MSGS;
    if (contextType === "bait") pool = BAIT_REACTION_MSGS;
    else if (contextType === "climax") pool = CLIMAX_REACTION_MSGS;

    let msg = r(pool); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(pool); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, lines: null, nameWidth: 0, isHighlight: contextType && contextType !== "normal" };
};

window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; ctx.font = "bold 32px Arial"; chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 880 - 90 - chatObj.nameWidth; 
    let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { let testLine = currentLine + words[n] + " "; if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { lines.push(currentLine.trim()); currentLine = words[n] + " "; } else { currentLine = testLine; } }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

window.strokeTextClean = function(ctx, text, x, y, fillCol, strokeCol, strokeW) {
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = strokeCol;
    ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillCol;
    ctx.fillText(text, x, y);
};

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
        return r(titles) + " #cottruyen #gaming #gamenhuclon #xuhuong";
    },
    generateViralPostKit: function(p1Name, p2Name) {
        const title = this.generateStoryTitle(p1Name || "NHÂN VẬT CHÍNH", p2Name || "BOSS");
        const pinnedComments = [
            `👇 GHIM: Số cuối % Pin điện thoại của bạn đang là Chẵn hay Lẻ? Chẵn = ${p1Name} thắng, Lẻ = ${p2Name} thắng! Điểm danh xem ai đoán chuẩn nào 🔋`,
            `👇 GHIM: Đố ai bấm TẠM DỪNG đúng khoảnh khắc màn hình chớp trắng đen (Impact Frame) khi tung đòn chí mạng đấy! 📸`,
            `👇 GHIM: Có ai vừa giật mình tưởng điện thoại báo Pin Yếu hay Crush nhắn tin ở giây thứ 6 không? Khai thật đi 💀`,
            `👇 GHIM: Biên kịch @gamenhuclon xứng đáng nhận giải Oscar 🏆 Tập tiếp theo anh em muốn cặp đấu nào lên sóng?`
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

function drawBaitSạn(ctx, w, h) {
    if (!window._baitTriggered || window._baitType === -1) return;
    let timeSinceBait = Date.now() - window._baitStartTime;
    if (timeSinceBait > 3800) { window._baitType = -1; return; } 
    ctx.save(); let alpha = 1;
    if (timeSinceBait < 300) alpha = timeSinceBait / 300;
    if (timeSinceBait > 3500) alpha = 1 - ((timeSinceBait - 3500) / 300);
    ctx.globalAlpha = Math.max(0, alpha);

    if (window._baitType === 0) {
        ctx.translate(w/2, h/2); ctx.fillStyle = "rgba(235, 235, 240, 0.95)";
        ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 20;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-210, -95, 420, 190, 20); else ctx.fillRect(-210, -95, 420, 190); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000"; ctx.font = "bold 25px Arial"; ctx.textAlign = "center"; ctx.fillText("Low Battery", 0, -38);
        ctx.font = "19px Arial"; ctx.fillText("10% battery remaining.", 0, -2); ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-210, 36); ctx.lineTo(210, 36); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 36); ctx.lineTo(0, 95); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "21px Arial"; ctx.fillText("Close", -105, 70); ctx.font = "bold 21px Arial"; ctx.fillText("Low Power Mode", 105, 70);
    } 
    else if (window._baitType === 1) {
        let slideY = timeSinceBait < 350 ? -100 + (timeSinceBait/350)*168 : 68;
        ctx.translate(w/2, slideY); ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 18;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-390, -44, 780, 88, 22); else ctx.fillRect(-390, -44, 780, 88); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(-325, 0, 32, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("M", -325, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.font = "bold 24px Arial"; ctx.fillText("Mẹ 😡", -270, -13);
        ctx.font = "21px Arial"; ctx.fillStyle = "#444"; ctx.fillText("Tắt máy đi ngủ ngay không tao đập máy bây giờ!", -270, 16);
    }
    else if (window._baitType === 2) {
        if (Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.translate(w - 180, 70); ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-25, -25, 160, 50, 10); else ctx.fillRect(-25, -25, 160, 50); ctx.fill();
            ctx.fillStyle = "#ff0000"; ctx.font = "bold 24px 'Arial Black', sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("📶 999ms", 55, 0);
        }
    }
    else if (window._baitType === 3) {
        let slideY = timeSinceBait < 350 ? -100 + (timeSinceBait/350)*168 : 68;
        ctx.translate(w/2, slideY);
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 18;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-380, -44, 760, 88, 44); else ctx.fillRect(-380, -44, 760, 88); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ff4757";
        ctx.beginPath(); ctx.arc(-320, 0, 32, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 24px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("💖", -320, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left";
        ctx.font = "bold 23px Arial"; ctx.fillText("Crush ❤️", -265, -13);
        ctx.font = "20px Arial"; ctx.fillStyle = "#444"; ctx.fillText("Anh đang làm gì đấy? Sao mải chơi game thế 🥺", -265, 16);
    }
    ctx.restore();
}

// ==========================================
// INTRO MANGA GỐC: NHÂN VẬT NHẢY VỚI THÂN THỂ & MÀU SẮC GỐC Ở GIỮA (w/2, h/2, cy=100)
// ==========================================
window.drawProceduralIntro = function(ctx, w, h, progress) {
    ctx.save();
    let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "OPPONENT");

    ctx.fillStyle = "#f0ebdf"; 
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.1;
    for(let i=0; i<w; i+=4) { ctx.fillStyle = "#000"; ctx.fillRect(i, 0, 1, h); } 
    ctx.globalAlpha = 1.0;

    let act = progress < 0.3 ? 0 : progress < 0.6 ? 1 : 2;
    let localProg = progress < 0.3 ? progress/0.3 : progress < 0.6 ? (progress-0.3)/0.3 : (progress-0.6)/0.4;
    
    let jitterX = (Math.random() - 0.5) * 6;
    let jitterY = (Math.random() - 0.5) * 6;

    ctx.save();
    ctx.translate(w/2 + jitterX, h/2 + jitterY);
    ctx.scale(2.0, 2.0);

    let p1Dance = window.DanceEngine ? window.DanceEngine.currentP1Dance : "dance_hakari";
    let p2Dance = window.DanceEngine ? window.DanceEngine.currentP2Dance : "dance_griddy";

    const drawSketchFighter = (charObj, cx, cy, isFacingRight, label, danceState) => {
        if(!charObj) return;
        ctx.save();
        ctx.filter = "none"; // Giữ nguyên thân thể và màu sắc gốc của nhân vật!
        if (window.DanceEngine) {
            window.DanceEngine.drawDancer(ctx, charObj, cx, cy, isFacingRight, 3.5, danceState);
        } else {
            ctx.translate(cx, cy);
            if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.5, isFacingRight: true, state: 'idle', hideHpBar: true});
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
        }
        ctx.restore();

        if (label) {
            ctx.save(); ctx.translate(cx, cy - 310);
            ctx.font = "900 34px 'Arial Black', sans-serif";
            ctx.textAlign = "center"; ctx.fillStyle = "#111";
            ctx.fillText(label, 0, 0);
            ctx.beginPath(); ctx.moveTo(-70, 12); ctx.lineTo(70, 12);
            ctx.lineWidth = 3.5; ctx.strokeStyle = "#ff0050"; ctx.stroke();
            ctx.restore();
        }
    };

    if (act === 0) {
        drawSketchFighter(window.p1, 0, 100, true, realP1Name, p1Dance);
    } else if (act === 1) {
        drawSketchFighter(window.enemies ? window.enemies[0] : null, 0, 100, false, realP2Name, p2Dance);
    } else {
        let pushP1 = -300 + Math.pow(localProg, 2) * 150;
        let pushP2 = 300 - Math.pow(localProg, 2) * 150;
        drawSketchFighter(window.p1, pushP1, 100, true, null, p1Dance);
        drawSketchFighter(window.enemies ? window.enemies[0] : null, pushP2, 100, false, null, p2Dance);

        ctx.save();
        ctx.translate(0, -210);
        ctx.font = "900 110px 'Impact', sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle";
        window.strokeTextClean(ctx, "VS", Math.random()*4-2, Math.random()*4-2, "#ff0050", "#fff", 15);
        ctx.restore();
    }
    ctx.restore();

    ctx.textAlign = "center";
    ctx.font = "900 50px 'Arial Black', sans-serif";
    window.strokeTextClean(ctx, prm.lore.chapter, w/2 + jitterX, 210 + jitterY, "#fff", "#000", 12);

    ctx.font = "bold 26px Arial, sans-serif";
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillText(window.CREATOR_HANDLE, w/2, 1830);

    ctx.restore();
};

// ==========================================
// HỘP THOẠI CỐT TRUYỆN ĐẶT TRONG KHOANG RIÊNG (Y = 885)
// ==========================================
window.drawCinematicQuoteInPanel = function(ctx, quote, elapsed, panelY, p1Url, p2Url, getHudImg) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 300) alpha = elapsed / 300;
    if (elapsed > quote.duration - 300) alpha = (quote.duration - elapsed) / 300;
    ctx.globalAlpha = Math.max(0, alpha);

    let boxW = 880;
    let boxH = 190;
    let boxX = 100;
    let boxY = panelY;

    let jitter = (Math.random() - 0.5) * 3;
    ctx.fillStyle = "#f8f5e6";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 16); ctx.fill(); 
    } else { 
        ctx.fillRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 16); ctx.stroke(); 
    } else { 
        ctx.strokeRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    let faceSize = 130;
    let faceX = quote.speaker === "P1" ? boxX + 25 : boxX + boxW - faceSize - 25;
    let faceY = boxY + 30;
    
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
    let textStartX = quote.speaker === "P1" ? boxX + faceSize + 45 : boxX + 30;
    let maxTextW = boxW - faceSize - 75;

    ctx.font = "900 28px 'Arial Black', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    let spkCol = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    window.strokeTextClean(ctx, "🎙️ " + speakerName, textStartX, boxY + 22, spkCol, "#000", 6);
    
    let charsToShow = Math.floor((elapsed - 150) / 14); 
    if (charsToShow < 0) charsToShow = 0;
    let displayedText = quote.text.substring(0, charsToShow);
    
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 28px Arial, sans-serif";
    
    let words = displayedText.split(" ");
    let line = "";
    let lineY = boxY + 68;
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > maxTextW && i > 0) {
            ctx.fillText(line, textStartX, lineY);
            line = words[i] + " "; lineY += 38;
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
    window._outroQuotesC = null; 

    window._lastP1Hp = 1; window._lastP2Hp = 1; window._impactFrames = 0; window._impactIntensity = 0;
    window._animeFlashFrames = 0;
    window._betPoolP1 = 110 + Math.floor(Math.random() * 60);
    window._betPoolP2 = 125 + Math.floor(Math.random() * 60);

    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.introParams = window.generateIntroParams();
    // Chọn ngẫu nhiên các điệu nhảy TikTok cho P1, P2 và MVP ở mỗi video mới
    if (window.DanceEngine && typeof window.DanceEngine.pickRandomDances === 'function') {
        window.DanceEngine.pickRandomDances();
    }

    window.recordedChunksV = []; 
    window._liveAlerts = []; window._lastAlertTime = Date.now(); 
    window._baitTriggered = false; window._baitType = -1;
    window._floatingHearts = [];
    window._activeGift = null;
    window._stampSfxPlayed = false;
    window._loopSfxPlayed = false;
    
    window._gamePhaseStarted = false; window._gamePhaseEnded = false;
    window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

    let videoStreamV = window.recordCanvasV.captureStream(0); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4";
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
    
    window._chatSystemInit = false; window._cachedGradients = {};
    if (typeof window._fakeViewers === "undefined") window._fakeViewers = 680 + Math.floor(Math.random() * 500);

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
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 240) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 33) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV;
    let isOutroActive = (window.gameOver && window.matchEndTimer > 85);
    let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0, 0, 1080, 1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    if (elapsed >= window.introDuration && !window._gamePhaseStarted) {
        window._gamePhaseStarted = true; window.gamePhaseStartTime = elapsed;
    }
    if (isOutroActive && !window._gamePhaseEnded) {
        window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed;
    }

    // ==========================================
    // PHẦN 1: INTRO 3.2 GIÂY (NHÂN VẬT Ở GIỮA, SỐ ĐẾM Ở DƯỚI CHÂN Y = 1520)
    // ==========================================
    if (elapsed < window.introDuration) {
        let introProgress = elapsed / window.introDuration; 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress); 
        renderNormalV = false; 

        ctxV.save();
        if (Math.floor(elapsed / 200) % 2 === 0) {
            ctxV.font = "900 42px 'Arial Black', sans-serif";
            ctxV.textAlign = "center";
            window.strokeTextClean(ctxV, "⚠️ ĐỪNG LƯỚT QUA ⚠️", 540, 95, "#ffeb3b", "#000", 10);
        }
        
        let secElapsed = Math.floor(elapsed / 1000); 
        let pulseProg = (elapsed % 1000) / 1000; 
        
        if (secElapsed === 0 && !window._sfxCuts[0]) { window._sfxCuts[0] = true; window.playViralSfx("countdown"); }
        if (secElapsed === 1 && !window._sfxCuts[1]) { window._sfxCuts[1] = true; window.playViralSfx("countdown"); }
        if (secElapsed === 2 && !window._sfxCuts[2]) { window._sfxCuts[2] = true; window.playViralSfx("countdown"); }
        if (secElapsed >= 3 && !window._sfxCuts[3]) { window._sfxCuts[3] = true; window.playViralSfx("fight"); }

        let countText = ""; let col = "#fff";
        if (secElapsed === 0) { countText = "3"; col = "#ef4444"; }
        else if (secElapsed === 1) { countText = "2"; col = "#f97316"; }
        else if (secElapsed === 2) { countText = "1"; col = "#eab308"; }
        else { countText = "FIGHT!"; col = "#22c55e"; }

        let scale = 1 + (1 - pulseProg) * 0.55; 
        let alpha = 1 - pulseProg * 0.4; 

        ctxV.translate(540, 1520);
        ctxV.scale(scale, scale);
        ctxV.globalAlpha = alpha;
        ctxV.font = "900 160px 'Impact', sans-serif";
        ctxV.textAlign = "center";
        ctxV.textBaseline = "middle";
        window.strokeTextClean(ctxV, countText, 0, 0, col, "#000", 22);
        ctxV.restore();
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; let shakeX = 0, shakeY = 0;
    
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 32; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    let isKillCamActive = (window.gameOver && window.matchEndTimer > 0 && window.matchEndTimer < 50);

    if (elapsed > 6000 && !window._baitTriggered && !window.gameOver) {
        window._baitTriggered = true;
        window._baitType = Math.random() < 0.55 ? 3 : (Math.random() < 0.5 ? 0 : 1);
        window._baitStartTime = Date.now();
        window.playViralSfx(window._baitType === 0 ? "lowbat" : "noti");
    }

    let p1HpPct = window.p1 ? Math.max(0, window.p1.hp / window.p1.maxHp) : 1;
    let p2HpPct = 1;
    if (window.enemies && window.enemies.length > 0) {
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1;
        window.enemies.forEach(e => eHp += Math.max(0, e.hp));
        p2HpPct = Math.max(0, eHp / eMax);
    }

    let isClimaxTension = (p1HpPct < 0.28 || p2HpPct < 0.28) && window._gamePhaseStarted && !isOutroActive;

    if (isClimaxTension && !window.gameOver && Date.now() - window._lastHeartbeatTime > 1100) {
        window._lastHeartbeatTime = Date.now();
        window.playViralSfx("heartbeat");
    }

    // ==========================================
    // PHẦN 2: MÀN HÌNH COMBAT SẠCH 100% + HIỆU ỨNG ANIME IMPACT FRAME
    // ==========================================
    if (renderNormalV) {
        ctxV.imageSmoothingEnabled = false;
        
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
        const getHudImg = (url) => { if (!url) return null; if (window.hudImages && window.hudImages[url] && window.hudImages[url].complete) return window.hudImages[url]; if(!window.hudImages) window.hudImages={}; let i = new Image(); i.crossOrigin="Anonymous"; i.src=url; window.hudImages[url]=i; return null; };
        let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";
        if (window.p1 && window.classStats && window.classStats[window.p1.classId]) p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url;
        if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url;

        if (!isOutroActive && !window.gameOver && window._gamePhaseStarted) {
            let p1Dmg = window._lastP1Hp - p1HpPct;
            let p2Dmg = window._lastP2Hp - p2HpPct;
            if (p1Dmg > 0.025 || p2Dmg > 0.025) {
                window._impactFrames = 14; 
                window._impactIntensity = Math.min((p1Dmg + p2Dmg) * 480, 55); 
                window._impactColor = (p1Dmg > p2Dmg) ? "#ff0050" : "#00f3ff"; 

                if (p1Dmg > 0.065 || p2Dmg > 0.065) {
                    window._animeFlashFrames = 2;
                    window.playViralSfx("animehit");
                }
            }
        }
        window._lastP1Hp = p1HpPct;
        window._lastP2Hp = p2HpPct;

        ctxV.save();
        ctxV.beginPath(); ctxV.rect(0, 0, 1080, splitGameHeight); ctxV.clip();

        if (isKillCamActive) {
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(1.22, 1.22); ctxV.translate(-540, -splitGameHeight / 2);
            if (window.matchEndTimer < 14 && window.matchEndTimer % 4 === 0) ctxV.filter = "invert(100%) contrast(180%)";
        } else if (window._impactFrames > 0) {
            let hitZoom = 1 + (window._impactFrames * 0.008);
            let extraShakeX = (Math.random() - 0.5) * window._impactIntensity;
            let extraShakeY = (Math.random() - 0.5) * window._impactIntensity;
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(hitZoom, hitZoom); ctxV.translate(-540 + extraShakeX, -splitGameHeight / 2 + extraShakeY);
        }

        if (window._animeFlashFrames > 0) {
            ctxV.filter = "invert(100%) grayscale(100%) contrast(300%)";
            window._animeFlashFrames--;
        } else {
            ctxV.filter = "contrast(106%) saturate(112%)"; 
        }

        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 
        ctxV.filter = "none";

        if (window._impactFrames > 0) {
            let edgeGrad = ctxV.createRadialGradient(540, splitGameHeight/2, 260, 540, splitGameHeight/2, 680);
            edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
            edgeGrad.addColorStop(1, window._impactColor);
            ctxV.globalAlpha = (window._impactFrames / 14) * 0.45;
            ctxV.fillStyle = edgeGrad;
            ctxV.fillRect(0, 0, 1080, splitGameHeight);
            ctxV.globalAlpha = 1.0;
            window._impactFrames--;
        } else if (isClimaxTension) {
            let tensionPulse = Math.abs(Math.sin(Date.now() / 200));
            let gradTension = ctxV.createRadialGradient(540, splitGameHeight/2, 280, 540, splitGameHeight/2, 720);
            gradTension.addColorStop(0, "rgba(255, 0, 0, 0)");
            gradTension.addColorStop(1, `rgba(255, 0, 40, ${0.35 * tensionPulse})`);
            ctxV.fillStyle = gradTension;
            ctxV.fillRect(0, 0, 1080, splitGameHeight);
        }

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 25) | 0; ctxV.globalAlpha = 0.3;
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        ctxV.restore();

        // KÍCH HOẠT THOẠI CỐT TRUYỆN THEO % MÁU
        if (!window._activeQuote && !window.gameOver) {
            for (let q of window._storyQuotes) {
                if (!q.triggered) {
                    let targetHp = (q.speaker === "P1") ? p1HpPct : p2HpPct;
                    if (targetHp <= q.triggerHp && targetHp > 0) {
                        q.triggered = true; window._activeQuote = q; window._activeQuoteStartTime = Date.now();
                        window.playViralSfx("noti");
                        break; 
                    }
                }
            }
        }

        // NỀN NỬA DƯỚI MÀN HÌNH
        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        let botGrad = ctxV.createLinearGradient(0, retainY, 0, 1920);
        botGrad.addColorStop(0, "#080b12");
        botGrad.addColorStop(1, "#151122");
        ctxV.fillStyle = botGrad; 
        ctxV.fillRect(0, retainY, 1080, retainHeight); 
        
        if (!isOutroActive) {
            let p1Name = window.getRealCharName(window.p1, "PLAYER");
            let eName = repEnemyObj ? window.getRealCharName(repEnemyObj, "BOSS") : "BOSS";

            // 1. THANH TIẾN ĐỘ ĐỎ (Y = 609 -> 654)
            let bannerY = retainY + 2; 
            ctxV.fillStyle = "#1e293b"; ctxV.fillRect(0, bannerY, 1080, 45); 
            let matchSecs = (Date.now() - window.gamePhaseStartTime) / 1000;
            let fakeProgress = Math.min(0.99, (matchSecs / 60) + (1 - p1HpPct)*0.3 + (1 - p2HpPct)*0.4);
            ctxV.fillStyle = "#ff0050"; 
            ctxV.fillRect(0, bannerY, 1080 * fakeProgress, 45); 
            ctxV.font = "900 24px 'Arial Black', sans-serif"; 
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            let loadingText = `🔥 ĐANG NẠP CÚ CHỐT... ${Math.floor(fakeProgress * 100)}% 🔥`;
            window.strokeTextClean(ctxV, loadingText, 540, bannerY + 22, "#ffffff", "#000000", 5);

            // 2. THANH MÁU & AVATAR 2 NHÂN VẬT (Y = 722)
            if (window.p1) {
                let p1Stam = Math.max(0, window.p1.stamina / 100);
                let eStam = repEnemyObj ? Math.max(0, repEnemyObj.stamina / 100) : 0;

                let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); 
                let hudBaseY = splitGameHeight + 115; 
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

                ctxV.textAlign = "left"; 
                ctxV.font = "900 24px 'Arial Black', sans-serif";
                window.strokeTextClean(ctxV, p1Name, p1Cx + 70, p1Cy - 15, "#fff", "#000", 6);
                
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

                    ctxV.textAlign = "right"; 
                    ctxV.font = "900 24px 'Arial Black', sans-serif"; 
                    window.strokeTextClean(ctxV, eName, p2Cx - 70, p2Cy - 15, "#fff", "#000", 6);
                    
                    if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(p2Cx-70-320, 0, p2Cx-70, 0); window._cachedGradients.hpP2.addColorStop(0, "#ffb199"); window._cachedGradients.hpP2.addColorStop(1, "#ff0844"); }
                    drawPillBar(ctxV, p2Cx - 70 - 320, p2Cy + 5, 320, 24, window._cachedGradients.hpP2, p2HpPct, true);
                    drawPillBar(ctxV, p2Cx - 70 - 200, p2Cy + 35, 200, 8, "#ffeb3b", eStam, true);
                }

                ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = "italic 900 50px 'Impact'";
                window.strokeTextClean(ctxV, "VS", 540, hudBaseY, "#fff", "#000", 10);
            }

            // 3. SÀN ĐẶT CƯỢC ĐIỂM THƯỞNG (LIVE BETTING POOL TRÊN THANH VOTE)
            if (window.p1 && repEnemyObj) {
                if (Math.random() < 0.25) {
                    window._betPoolP1 += Math.floor(Math.random() * 3);
                    window._betPoolP2 += Math.floor(Math.random() * 3);
                }
                ctxV.save(); let pollY = splitGameHeight + 225; let pollWidth = 880; let pollX = 540; ctxV.translate(pollX, pollY);
                
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                let isComeback = Math.abs(p1Pct - 0.5) > 0.22;

                ctxV.font = "900 18px 'Arial Black'";
                ctxV.textAlign = "left";
                window.strokeTextClean(ctxV, `💎 ${window._betPoolP1}K ĐẶT TRÁI`, -pollWidth/2, -18, "#00f3ff", "#000", 4);
                ctxV.textAlign = "center"; 
                window.strokeTextClean(ctxV, isComeback ? "🔥 KÈO ĐANG BIẾN ĐỘNG MẠNH 🔥" : "WHO WILL WIN?", 0, -18, isComeback ? "#ffeb3b" : "#94a3b8", "#000", 4);
                ctxV.textAlign = "right";
                window.strokeTextClean(ctxV, `ĐẶT PHẢI ${window._betPoolP2}K 💎`, pollWidth/2, -18, "#ff0050", "#000", 4);
                
                ctxV.fillStyle = "rgba(255, 0, 60, 0.8)"; 
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 24, 12); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 24); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 24, 12); ctxV.clip(); } 
                ctxV.fillStyle = "rgba(0, 243, 255, 0.9)"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 24); ctxV.restore();
                
                ctxV.fillStyle = "#0f172a"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 12, 18, 0, Math.PI*2); ctxV.fill(); 
                ctxV.lineWidth = 2; ctxV.strokeStyle = "#fff"; ctxV.stroke(); 
                ctxV.font = "900 12px 'Arial Black'"; 
                window.strokeTextClean(ctxV, "VS", -pollWidth/2 + pollWidth * p1Pct, 12, "#fff", "#000", 3);
                
                ctxV.font = "900 18px 'Arial Black'"; 
                ctxV.textAlign = "left"; window.strokeTextClean(ctxV, `${Math.round(p1Pct*100)}%`, -pollWidth/2 + 15, 12, "#fff", "#000", 4); 
                ctxV.textAlign = "right"; window.strokeTextClean(ctxV, `${Math.round((1-p1Pct)*100)}%`, pollWidth/2 - 15, 12, "#fff", "#000", 4);
                ctxV.restore();
            }

            // 4. KHOANG TRUNG TÂM (Y = 885 -> 1075): HỘP THOẠI / QUÀ TẶNG / MINI-GAME % PIN KÍCH COMMENT
            let storyPanelY = splitGameHeight + 278;
            if (window._activeQuote) {
                let elapsedQuote = Date.now() - window._activeQuoteStartTime;
                if (elapsedQuote < window._activeQuote.duration) {
                    window.drawCinematicQuoteInPanel(ctxV, window._activeQuote, elapsedQuote, storyPanelY, p1Url, p2Url, getHudImg);
                } else {
                    window._activeQuote = null;
                }
            } else {
                if (!window._activeGift && elapsed > 7000 && Math.random() < 0.012 && !window.gameOver) {
                    let sender = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name;
                    const gifts = [
                        { icon: "🦁", name: "SƯ TỬ VÀNG", count: 99 },
                        { icon: "🌌", name: "TIKTOK UNIVERSE", count: 10 }
                    ];
                    let g = gifts[Math.floor(Math.random() * gifts.length)];
                    window._activeGift = { sender: sender, icon: g.icon, name: g.name, count: g.count, startTime: Date.now() };
                    window.playViralSfx("gift");
                }

                ctxV.save();
                ctxV.translate(540, storyPanelY + 95);
                ctxV.fillStyle = "rgba(15, 23, 42, 0.8)";
                ctxV.strokeStyle = isClimaxTension ? "rgba(255, 0, 80, 0.7)" : "rgba(0, 243, 255, 0.25)";
                ctxV.lineWidth = 2;
                ctxV.beginPath();
                if (ctxV.roundRect) ctxV.roundRect(-440, -75, 880, 150, 16);
                else ctxV.rect(-440, -75, 880, 150);
                ctxV.fill(); ctxV.stroke();

                if (window._activeGift && (Date.now() - window._activeGift.startTime < 2600)) {
                    let gElapsed = Date.now() - window._activeGift.startTime;
                    ctxV.font = "60px Arial"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
                    ctxV.fillText(window._activeGift.icon, -340, 0);
                    ctxV.textAlign = "left";
                    ctxV.font = "900 26px 'Arial Black'";
                    window.strokeTextClean(ctxV, window._activeGift.sender, -275, -18, "#fff", "#000", 4);
                    ctxV.font = "bold 24px Arial";
                    ctxV.fillStyle = "#ffeb3b"; ctxV.fillText(`Đã gửi tặng ${window._activeGift.name}!`, -275, 20);

                    let comboScale = 1 + Math.abs(Math.sin(gElapsed / 80)) * 0.25;
                    ctxV.save(); ctxV.translate(340, 0); ctxV.scale(comboScale, comboScale);
                    ctxV.font = "italic 900 48px 'Impact'"; ctxV.textAlign = "center";
                    window.strokeTextClean(ctxV, `x${window._activeGift.count}`, 0, 0, "#ff0050", "#fff", 6);
                    ctxV.restore();
                } else {
                    window._activeGift = null;
                    ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
                    if (p1HpPct < 0.42) {
                        let pulseCTA = 1 + Math.abs(Math.sin(Date.now() / 150)) * 0.05;
                        ctxV.save(); ctxV.scale(pulseCTA, pulseCTA);
                        ctxV.font = "900 32px 'Arial Black'";
                        window.strokeTextClean(ctxV, "👆 NHẤP ĐÚP MÀN HÌNH ĐỂ BƠM MÁU 💖", 0, -16, "#ffeb3b", "#ff0050", 6);
                        ctxV.restore();
                        ctxV.font = "bold 22px Arial"; ctxV.fillStyle = "#cbd5e1";
                        ctxV.fillText("🚨 Máu đang nguy kịch! Thả tim tiếp sức lật kèo ngay!", 0, 28);
                    } else {
                        let challengeMode = Math.floor(elapsed / 6000) % 2;
                        if (challengeMode === 0) {
                            ctxV.font = "900 27px 'Arial Black'";
                            window.strokeTextClean(ctxV, "🔋 SỐ CUỐI % PIN CỦA BẠN QUYẾT ĐỊNH KẾT QUẢ!", 0, -20, "#ffeb3b", "#000", 5);
                            ctxV.font = "bold 23px Arial"; ctxV.fillStyle = "#ffffff";
                            ctxV.fillText(`Số Chẵn = ${p1Name} Thắng  |  Số Lẻ = ${eName} Thắng 👇`, 0, 24);
                        } else {
                            ctxV.font = "900 27px 'Arial Black'";
                            window.strokeTextClean(ctxV, "📸 THỬ THÁCH: BẤM DỪNG KHI MÀN HÌNH CHỚP TRẮNG!", 0, -20, "#00f3ff", "#000", 5);
                            ctxV.font = "bold 23px Arial"; ctxV.fillStyle = "#cbd5e1";
                            ctxV.fillText(`99% người xem không thể dừng đúng khoảnh khắc ra đòn chí mạng!`, 0, 24);
                        }
                    }
                }
                ctxV.restore();
            }

            // 5. KHUNG LIVE CHAT (Y = 1120 -> 1860) KÈM DÒNG BÌNH LUẬN GHIM CỦA @gamenhuclon
            let boxWidth = 880; let boxHeight = 730; let boxX = 540; let boxY = 1490; 

            ctxV.save(); ctxV.translate(boxX, boxY); 
            ctxV.fillStyle = "rgba(10, 15, 30, 0.65)"; 
            ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; 
            ctxV.lineWidth = 2;
            
            ctxV.beginPath(); 
            if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16); 
            else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); 
            ctxV.fill(); ctxV.stroke();
            
            ctxV.beginPath();
            ctxV.moveTo(-boxWidth/2, -boxHeight/2 + 54);
            ctxV.lineTo(boxWidth/2, -boxHeight/2 + 54);
            ctxV.strokeStyle = "rgba(255, 255, 255, 0.12)";
            ctxV.stroke();

            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16); ctxV.clip(); 
            
            // Watermark chìm @gamenhuclon
            ctxV.save(); ctxV.rotate(-0.10); ctxV.font = "900 68px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.fillStyle = "rgba(255, 255, 255, 0.045)"; ctxV.fillText(window.CREATOR_HANDLE, 0, 0); ctxV.restore();

            // Header của Khung Chat: Hiển thị Bình luận Ghim nổi bật
            ctxV.fillStyle = "rgba(30, 41, 59, 0.85)";
            ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 54);
            ctxV.font = "bold 21px Arial"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
            window.strokeTextClean(ctxV, window.introParams.pinnedHook, -boxWidth/2 + 22, -boxHeight/2 + 27, "#ffeb3b", "#000", 4);
            
            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 56, boxWidth, boxHeight - 56); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 40; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 30px Arial"; let headerBottomY = -boxHeight/2 + 56; 
            
            if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent("normal"); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }

            for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                let chat = window._liveChats[i]; let nameStr = chat.name + ":"; 
                let msgCol = chat.isHighlight ? "#ffeb3b" : "#ffffff";
                for(let l = chat.lines.length - 1; l >= 0; l--) {
                    if (currentY - lineHeight < headerBottomY - 5) break;
                    if (l === 0) { 
                        window.strokeTextClean(ctxV, nameStr, -boxWidth/2 + 25, currentY, chat.color, "#000", 5);
                        window.strokeTextClean(ctxV, " " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY, msgCol, "#000", 5);
                    } 
                    else { 
                        window.strokeTextClean(ctxV, " " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY, msgCol, "#000", 5);
                    }
                    currentY -= lineHeight; 
                }
                if (currentY - lineHeight < headerBottomY - 5) break; currentY -= 12; 
            }
            ctxV.restore(); 
            ctxV.restore(); 

            if (Math.random() < 0.25) {
                const emojis = ["❤️", "🔥", "💖", "😱"];
                window._floatingHearts.push({
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    x: 1025 + (Math.random() - 0.5) * 30,
                    y: 1840,
                    vy: -3.5 - Math.random() * 2.5,
                    life: 1.0
                });
            }
            for (let i = window._floatingHearts.length - 1; i >= 0; i--) {
                let fh = window._floatingHearts[i];
                fh.y += fh.vy; fh.life -= 0.02;
                ctxV.save();
                ctxV.globalAlpha = Math.max(0, fh.life);
                ctxV.font = "32px Arial"; ctxV.textAlign = "center";
                ctxV.fillText(fh.emoji, fh.x, fh.y);
                ctxV.restore();
                if (fh.life <= 0) window._floatingHearts.splice(i, 1);
            }
            
        } else {
            // ==========================================
            // OUTRO STORYBOOK: NHÂN VẬT MVP NHẢY ĂN MỪNG Ở GIỮA VỚI THÂN THỂ & MÀU GỐC
            // ==========================================
            let outroAlpha = Math.min(1, (window.matchEndTimer - 85) / 35); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            
            if (!window._outroQuotesC) {
                let isP1Win = (window.p1 && window.p1.hp > 0);
                let p1N = window.getRealCharName(window.p1, "Hảo hán");
                let p2N = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "Đối thủ");
                
                let winQuotes = [
                    { c: `Chân lý luôn thuộc về kẻ mạnh!`, s: `${p1N} đã bón hành ngập mồm ${p2N}. Ai pin số Chẵn vừa đoán đúng điểm danh!` },
                    { c: `Thắng làm vua, thua làm content!`, s: `Xin một tràng pháo tay cho diễn xuất thần sầu của ${p1N} 👏👏👏` },
                    { c: `Đạo diễn hô "CẮT!"`, s: `${p2N} diễn cảnh gục ngã đạt lắm, ra phường nhận hộp cơm đùi gà đi em!` },
                    { c: `Check VAR! Không có gian lận!`, s: `${p1N} thắng áp đảo nhờ nạp lần đầu. Cảm ơn nhà tài trợ!` }
                ];
                let loseQuotes = [
                    { c: `Á đù, bay acc!`, s: `${p1N} chưa kịp dùng Ulti thì máy báo pin yếu. Xin hẹn ${p2N} kèo sau!` },
                    { c: `Một phút bốc đồng, ngàn năm cày lại.`, s: `Chỉ vì mải lướt top top, ${p1N} đã phải trả giá đắt...` },
                    { c: `Đạo diễn hô "CẮT!"`, s: `${p1N} quên kịch bản à? Sao lại để thua lãng nhách vậy, trừ nửa tiền cát-xê!` },
                    { c: `Thua trong vinh quang...`, s: `Nói chung là tại mạng lag, phím cứng, gió to. ${p1N} không phục!` }
                ];
                window._outroQuotesC = isP1Win ? winQuotes[Math.floor(Math.random()*winQuotes.length)] : loseQuotes[Math.floor(Math.random()*loseQuotes.length)];
            }

            ctxV.fillStyle = "#f0ebdf"; ctxV.fillRect(0, 0, 1080, 1920);
            ctxV.globalAlpha = 0.1 * outroAlpha;
            for(let i=0; i<1080; i+=4) { ctxV.fillStyle = "#000"; ctxV.fillRect(i, 0, 1, 1920); }
            ctxV.globalAlpha = outroAlpha;
            ctxV.fillStyle = "rgba(0,0,0,0.04)";
            for(let i=0; i<1920; i+=60) { ctxV.fillRect(0, i, 1080, 2); }
            
            let cx = 540;
            const drawWrap = (txt, px, py, mw, lh) => {
                let words = txt.split(' '); let line = ''; let curY = py;
                for(let i = 0; i < words.length; i++) {
                    let testLine = line + words[i] + ' ';
                    if(ctxV.measureText(testLine).width > mw && i > 0) {
                        ctxV.fillText(line.trim(), px, curY); line = words[i] + ' '; curY += lh;
                    } else { line = testLine; }
                }
                ctxV.fillText(line.trim(), px, curY); return curY;
            };

            if (window.matchEndTimer <= 195) {
                let storyProg = Math.min(1, (window.matchEndTimer - 90) / 35);
                if (storyProg > 0) {
                    ctxV.globalAlpha = Math.min(1, storyProg * outroAlpha);

                    ctxV.textAlign = "center";
                    ctxV.font = "900 46px 'Arial Black', sans-serif";
                    window.strokeTextClean(ctxV, "📜 HỒI KẾT TRẬN ĐẤU 📜", cx, 160, "#fff", "#000", 12);

                    ctxV.fillStyle = "#8b0000"; ctxV.font = "italic 900 50px 'Times New Roman', serif";
                    let nextY = drawWrap(window._outroQuotesC.c, cx, 290, 900, 62);
                    
                    ctxV.fillStyle = "#222222"; ctxV.font = "italic 38px 'Times New Roman', serif";
                    nextY = drawWrap(window._outroQuotesC.s, cx, nextY + 65, 860, 50);

                    let winnerObj = (window.p1 && window.p1.hp > 0) ? window.p1 : (window.enemies && window.enemies[0] ? window.enemies[0] : window.p1);
                    let winnerName = window.getRealCharName(winnerObj, "MVP");
                    let winDance = window.DanceEngine ? window.DanceEngine.currentWinDance : "dance_siuuuu";

                    ctxV.save();
                    ctxV.translate(540, 960);
                    ctxV.scale(2.0, 2.0);
                    ctxV.save();
                    ctxV.filter = "none"; // Giữ nguyên thân thể và màu sắc gốc của nhân vật khi nhảy ăn mừng!
                    if (window.DanceEngine) {
                        window.DanceEngine.drawDancer(ctxV, winnerObj, 0, 100, true, 3.5, winDance);
                    } else {
                        ctxV.translate(0, 100);
                        let clone = Object.assign({}, winnerObj, {x:0, y:0, scale: 3.5, isFacingRight: true, state: 'idle', hideHpBar: true});
                        if (typeof window.drawStickman === 'function') window.drawStickman(ctxV, clone);
                    }
                    ctxV.restore();

                    ctxV.save();
                    ctxV.translate(0, -160);
                    ctxV.font = "900 28px 'Arial Black', sans-serif";
                    ctxV.textAlign = "center"; ctxV.fillStyle = "#111";
                    ctxV.fillText("🏆 MVP: " + winnerName, 0, 0);
                    ctxV.restore();
                    ctxV.restore();

                    if (window.matchEndTimer >= 115) {
                        if (!window._stampSfxPlayed) {
                            window._stampSfxPlayed = true;
                            window.playViralSfx("stamp");
                        }
                        let stampProg = Math.min(1, (window.matchEndTimer - 115) / 12);
                        let stampScale = 2.2 - stampProg * 1.2;
                        ctxV.save();
                        ctxV.translate(810, 1120);
                        ctxV.rotate(-0.2);
                        ctxV.scale(stampScale, stampScale);
                        ctxV.strokeStyle = "rgba(220, 38, 38, 0.85)"; ctxV.lineWidth = 6;
                        ctxV.beginPath(); ctxV.arc(0, 0, 90, 0, Math.PI*2); ctxV.stroke();
                        ctxV.beginPath(); ctxV.arc(0, 0, 75, 0, Math.PI*2); ctxV.stroke();
                        ctxV.fillStyle = "rgba(220, 38, 38, 0.85)";
                        ctxV.font = "900 24px 'Arial Black'"; ctxV.fillText("APPROVED", 0, -10);
                        ctxV.font = "900 20px 'Arial Black'"; ctxV.fillText("TRIỆU VIEW", 0, 20);
                        ctxV.restore();
                    }

                    ctxV.font = "900 62px 'Arial Black', sans-serif";
                    window.strokeTextClean(ctxV, "🎬 HẾT TẬP 1 • LẬT TẬP 2 ⏩", cx, 1520, "#000", "#fff", 12);

                    ctxV.font = "bold 28px Arial, sans-serif";
                    ctxV.fillStyle = "#444";
                    ctxV.fillText("Follow " + window.CREATOR_HANDLE + " để xem tiếp", cx, 1610);

                    ctxV.lineWidth = 8; ctxV.strokeStyle = "#1a1a1a"; ctxV.strokeRect(40, 40, 1000, 1840);
                    ctxV.beginPath(); ctxV.moveTo(20, 60); ctxV.lineTo(150, 60); ctxV.moveTo(60, 20); ctxV.lineTo(60, 150); ctxV.stroke();
                    ctxV.beginPath(); ctxV.moveTo(1060, 60); ctxV.lineTo(930, 60); ctxV.moveTo(1020, 20); ctxV.lineTo(1020, 150); ctxV.stroke();
                    ctxV.beginPath(); ctxV.moveTo(20, 1860); ctxV.lineTo(150, 1860); ctxV.moveTo(60, 1900); ctxV.lineTo(60, 1770); ctxV.stroke();
                    ctxV.beginPath(); ctxV.moveTo(1060, 1860); ctxV.lineTo(930, 1860); ctxV.moveTo(1020, 1900); ctxV.lineTo(1020, 1770); ctxV.stroke();
                }
            } else {
                if (!window._loopSfxPlayed) {
                    window._loopSfxPlayed = true;
                    window.playViralSfx("pageflip");
                }
                let bridgeProg = Math.min(1, (window.matchEndTimer - 195) / 40);
                window.drawProceduralIntro(ctxV, 1080, 1920, 0.02);

                let flipX = 1080 * (1 - bridgeProg);
                if (flipX > 0) {
                    let pageGrad = ctxV.createLinearGradient(flipX - 80, 0, flipX + 40, 0);
                    pageGrad.addColorStop(0, "rgba(0,0,0,0)");
                    pageGrad.addColorStop(0.5, "rgba(0,0,0,0.35)");
                    pageGrad.addColorStop(1, "#f0ebdf");
                    ctxV.fillStyle = pageGrad;
                    ctxV.fillRect(flipX - 80, 0, 120, 1920);
                }

                ctxV.font = "900 42px 'Arial Black', sans-serif";
                ctxV.textAlign = "center";
                window.strokeTextClean(ctxV, "⚠️ ĐỪNG LƯỚT QUA ⚠️", 540, 95, "#ffeb3b", "#000", 10);

                ctxV.save();
                ctxV.translate(540, 1520);
                ctxV.scale(1.5, 1.5);
                ctxV.font = "900 160px 'Impact', sans-serif";
                ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
                window.strokeTextClean(ctxV, "3", 0, 0, "#ef4444", "#000", 22);
                ctxV.restore();
            }
            ctxV.restore();
        }
    }

    if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent("normal"); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }
    
    let chatNow = Date.now();
    let isBaitActive = (window._baitTriggered && window._baitType !== -1);
    let isHypeMoment = (window._impactFrames > 5 || window._activeQuote != null || isClimaxTension || isBaitActive);
    let dynamicDelay = isHypeMoment ? (180 + Math.random() * 250) : (950 + Math.random() * 1600); 

    if (chatNow - window._lastChatUpdate > dynamicDelay) { 
        window._lastChatUpdate = chatNow; 
        window._nextChatDelay = dynamicDelay; 
        
        let ctxType = isBaitActive ? "bait" : (isClimaxTension ? "climax" : "normal");
        let newChat = window.generateLiveChatEvent(ctxType); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); 
        if (window._liveChats.length > 12) window._liveChats.shift(); 
        
        let viewChange = isHypeMoment ? Math.floor(Math.random() * 100) : (Math.floor(Math.random() * 41) - 15);
        window._fakeViewers += viewChange;
        if(window._fakeViewers < 300) window._fakeViewers += Math.floor(Math.random() * 50); if(window._fakeViewers > 3500) window._fakeViewers -= Math.floor(Math.random() * 50); 
    }

    if (!isOutroActive && elapsed >= window.introDuration && Date.now() - window._lastAlertTime > 2800 + Math.random() * 3000) { 
        window._lastAlertTime = Date.now(); 
        let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name; 
        let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} shared the stream!`, `🎁 ${randomUser} sent a Rose!`]; 
        if (window._liveAlerts.length < 2) {
            window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); 
        }
    }

    if (!isOutroActive && elapsed >= window.introDuration) {
        let alertStartX = 16; let alertStartY_Left = splitGameHeight - 16;
        for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
            let al = window._liveAlerts[i]; al.life -= 0.015; al.yOffset += 1.4; ctxV.save(); 
            ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 2.0)); ctxV.font = "bold 20px Arial"; 
            let textW = ctxV.measureText(al.text).width; ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
            let alertGrad = ctxV.createLinearGradient(0, 0, textW + 30, 0); alertGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)"); alertGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            ctxV.fillStyle = alertGrad; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -18, textW + 30, 36, 18); ctxV.fill(); } else { ctxV.fillRect(0, -18, textW + 30, 36); } 
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 12, 0); ctxV.restore(); 
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        if (typeof window._fakeViewers !== "undefined") {
            ctxV.save(); let badgeY = splitGameHeight - 28; let badgeX = 1064; 
            ctxV.font = "bold 20px 'Arial Black'"; let viewStr = "👁️ " + window._fakeViewers.toLocaleString(); let viewW = ctxV.measureText(viewStr).width;
            ctxV.fillStyle = "rgba(0, 0, 0, 0.65)";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 20, badgeY - 17, viewW + 20, 34, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 20, badgeY - 17, viewW + 20, 34); }
            ctxV.textAlign = "right"; ctxV.textBaseline = "middle"; 
            window.strokeTextClean(ctxV, viewStr, badgeX - 10, badgeY, "#fff", "#000", 3);
            let liveW = 72; ctxV.fillStyle = (Math.floor(Date.now()/500)%2===0) ? "#ff0050" : "#d90040";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 20 - liveW - 5, badgeY - 17, liveW, 34, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 20 - liveW - 5, badgeY - 17, liveW, 34); }
            ctxV.textAlign = "center"; 
            window.strokeTextClean(ctxV, "LIVE", badgeX - viewW - 20 - liveW/2 - 5, badgeY + 1, "#fff", "#000", 3);
            ctxV.restore();
        }
    }

    drawBaitSạn(ctxV, 1080, splitGameHeight);

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Đã chép tiêu đề & bình luận ghim! Giờ bạn có thể dán lên TikTok/YouTube."); }); };

window.mergeAndDownloadVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.href = vid.urlV;
    a.download = "[GAMENHUCLON]_" + vid.safeFileName + "." + vid.ext;
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
        container.innerHTML = `<div style="text-align: center; padding: 20px;"><h3 style="margin: 0 0 10px 0; color: #00f3ff; font-weight: 800; letter-spacing: 1px; font-size: 28px;">🎬 TIKTOK STUDIO (${window.CREATOR_HANDLE})</h3><p style="color: #94a3b8; margin: 0; font-size: 15px;">Chưa có video nào. Hãy chiến đấu để tạo siêu phẩm!</p></div>`; 
        return; 
    }
    
    let html = `<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #fff; font-weight: 800; letter-spacing: 1px; font-size: 24px;"><span style="color:#00f3ff;">🎬 TIKTOK</span> STUDIO (${window.CREATOR_HANDLE})</h3>
                    <span style="background: rgba(0,243,255,0.1); color: #00f3ff; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">${window.savedVideos.length} Videos</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; max-height: 550px; overflow-y: auto; padding-right: 10px;">`;
    
    window.savedVideos.forEach((vid) => { 
        let postKitText = window.StoryModeAI.generateViralPostKit ? window.StoryModeAI.generateViralPostKit(vid.heroName, "BOSS") : vid.viralTitle;
        html += `<div style="display: flex; gap: 20px; background: rgba(30, 41, 59, 0.6); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s ease;">
                    <div style="position: relative; width: 130px; height: 130px; flex-shrink: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; background: #000;">
                        <img src="${vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: contain;">
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
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                            <button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">📋 Chép Caption</button>
                            <button id="btn-dl-${vid.id}" onclick="window.mergeAndDownloadVideo(${vid.id})" style="background: #00f3ff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 800; flex: 1; cursor:pointer; box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3); transition: all 0.2s;">🚀 TẢI TIKTOK NGAY</button>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Xóa</button>
                        </div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
