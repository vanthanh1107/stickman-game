// ==========================================
// RECORDER.JS - V88.0 DOPAMINE & SEAMLESS LOOP EDITION
// SIÊU NÂNG CẤP ĐẨY ĐỀ XUẤT TIKTOK:
// 1. Web Audio Synth SFX: Tự tạo âm thanh thông báo tin nhắn, pin yếu, nổ quà, bass drop thu thẳng vào video.
// 2. 1.4s Flash Hook Intro: Phủ intro lên cảnh hành động trực tiếp, giữ chân 3 giây đầu tuyệt đối.
// 3. Screen Crack & Neon Grading: Hiệu ứng vỡ kính màn hình khi nổ sát thương lớn + màu sắc rực rỡ.
// 4. TikTok Gift Combo & Floating Hearts: Hiệu ứng đại gia tặng Sư Tử x99 và bão tim bay bên phải màn hình.
// 5. Context-Aware Chat & Seamless Rewind Loop: Chat phản ứng theo sự kiện + Tua ngược vòng lặp vô tận ở cuối video.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "Sticklom"; 

window.introStartTime = 0; 
window.introDuration = 1400; // Rút gọn còn 1.4s để giữ chân người xem 3s đầu
window._sfxCuts = [false, false, false, false, false]; window.introParams = null; 
window._baitTriggered = false; window._baitStage = 0; window._baitType = -1; window._baitStartTime = 0;
window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 
window._outroQuotesC = null; 
window._combatTexts = []; 
window._floatingHearts = []; // Bão tim TikTok
window._activeGift = null;   // Hiệu ứng nổ quà lớn
window._screenCracks = [];   // Vết nứt màn hình khi nổ sát thương

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

window._lastP1Hp = 1; window._lastP2Hp = 1;
window._impactFrames = 0; window._impactIntensity = 0; window._impactColor = "#ffffff";

window._hypeWords = ["BRO NO WAY 💀", "WAIT FOR IT...", "500 IQ 🧠", "LOBOTOMY 📉", "ẢO THẬT ĐẤY 😭", "CHECK VAR!!", "GG EZ 🔥", "BRO IS COOKING 🍳"];
window._currentHype = { word: "", time: 0 };

// KHỞI TẠO HỆ THỐNG ÂM THANH & SYNTH SFX THU TRỰC TIẾP VÀO VIDEO
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

        if (type === "noti") {
            // Âm thanh Ting-Ting tin nhắn tới
            osc.type = "sine";
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.09); // E6
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now); osc.stop(now + 0.45);
        } else if (type === "lowbat") {
            // Âm thanh báo pin yếu iOS
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(392.00, now + 0.12);
            osc.frequency.setValueAtTime(329.63, now + 0.24);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if (type === "gift") {
            // Âm thanh nổ quà Combo
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.25);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now); osc.stop(now + 0.35);
        } else if (type === "crack") {
            // Âm thanh Bass Drop chấn động khi vỡ màn hình
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (type === "rewind") {
            // Âm thanh tua ngược vòng lặp
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.6);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
            osc.start(now); osc.stop(now + 0.65);
        }
    } catch (e) {}
};

window.STORY_TEMPLATES = [
    [
        { triggerHp: 0.82, speaker: "P2", text: "Nghịch đồ! Hôm nay vi sư phải thanh lý môn hộ!", face: "https://files.catbox.moe/kixqol.png", duration: 2200 },
        { triggerHp: 0.60, speaker: "P1", text: "Lão phu tử, thời đại của ông đã kết thúc rồi!", face: "https://files.catbox.moe/v68cni.png", duration: 2200 },
        { triggerHp: 0.40, speaker: "P2", text: "Khinh công của ngươi vẫn còn non lắm! Đỡ chiêu này!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2200 },
        { triggerHp: 0.20, speaker: "P1", text: "Khụ... Huyết Ma Công! Ta sẽ kéo ông theo cùng! 👺", face: "https://files.catbox.moe/t0h9n6.png", duration: 2200 }
    ],
    [
        { triggerHp: 0.82, speaker: "P2", text: "Tại sao anh lại phản bội em để đi theo cô ta? 💔", face: "https://files.catbox.moe/kixqol.png", duration: 2200 },
        { triggerHp: 0.60, speaker: "P1", text: "Cô ấy cho anh thứ mà em không thể... Tiền nạp VIP!", face: "https://files.catbox.moe/v68cni.png", duration: 2200 },
        { triggerHp: 0.40, speaker: "P2", text: "Anh đúng là đồ tồi! Trả lại thanh xuân cho tôi đây! 😭", face: "https://files.catbox.moe/v2rt0n.png", duration: 2200 },
        { triggerHp: 0.20, speaker: "P1", text: "Xin lỗi... Nhưng anh phải bảo vệ chuỗi thắng của mình!", face: "https://files.catbox.moe/t0h9n6.png", duration: 2200 }
    ],
    [
        { triggerHp: 0.82, speaker: "P2", text: "Thằng kia! 5 loét mày mượn tao từ tháng trước đâu?", face: "https://files.catbox.moe/kixqol.png", duration: 2200 },
        { triggerHp: 0.60, speaker: "P1", text: "Đợi mai trúng Vietlott tao trả! Làm gì căng thế bạn ơi? 🏃💨", face: "https://files.catbox.moe/v68cni.png", duration: 2200 },
        { triggerHp: 0.40, speaker: "P2", text: "Đưa tiền đây không tao nện cho má nhận không ra bây giờ!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2200 },
        { triggerHp: 0.20, speaker: "P1", text: "Được rồi... Mày ép tao! Tuyệt kỹ tối thượng: BÙNG NỢ! 🌪️", face: "https://files.catbox.moe/t0h9n6.png", duration: 2200 }
    ],
    [
        { triggerHp: 0.82, speaker: "P2", text: "Ngươi là kẻ nào? Sao dám bật Hack trong server của ta? ⚔️", face: "https://files.catbox.moe/kixqol.png", duration: 2200 },
        { triggerHp: 0.60, speaker: "P1", text: "Kỹ năng thượng thừa thôi bạn ơi, khóc to lên! 😎", face: "https://files.catbox.moe/v68cni.png", duration: 2200 },
        { triggerHp: 0.40, speaker: "P2", text: "Admin đâu rồi?! Khoá mõm thằng này lại cho tao!", face: "https://files.catbox.moe/v2rt0n.png", duration: 2200 },
        { triggerHp: 0.20, speaker: "P1", text: "Hệ thống! Kích hoạt nội tại 1 máu bất tử... Lên! 🌐", face: "https://files.catbox.moe/t0h9n6.png", duration: 2200 }
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
    { chapter: "KÈO CĂNG: AI THUA XÓA ACC", p2Sub: "Ta đã dạy ngươi mọi thứ...", p1Sub: "Giờ hãy xem cơn thịnh nộ của ta." },
    { chapter: "TRẬN CHIẾN SINH TỬ 1 VS 1", p2Sub: "Biết thân biết phận đi.", p1Sub: "Đế chế của ngươi sụp đổ rồi." },
    { chapter: "NGOẠI TRUYỆN: ĐÒI NỢ ĐÊM KHUYA", p2Sub: "Trốn đi đâu hả con?", p1Sub: "Cho khất nốt hôm nay thôi!" },
    { chapter: "CHƯƠNG CUỐI: CÚ LẬT KÈO LỊCH SỬ", p2Sub: "Sao ngươi còn đứng vững?", p1Sub: "Vì người xem đã thả tim cho ta!" }
];

const WAGER_BADGES = ["🎬 PHIM NGẮN TƯƠNG TÁC", "🔥 ĐỪNG CHỚP MẮT", "🎭 DRAMA CỰC CĂNG", "🍿 XEM ĐẾN GIÂY CUỐI"];

function makeTypo(str) {
    if(Math.random() > 0.65) return str; 
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
    { name: "NoobSlayer", color: "#ff9900" }, { name: "Độ Phùng 🔥", color: "#a55eea" }
];

const NORMAL_MSGS = [
    "Cốt truyện cuốn vãi 🍿", "Quả xử lý cồng kềnh vãi 💀", "Plot twist thế ai ngờ 🤯",
    "Đánh như cái máy khâu 🦾", "Xóa game đi bạn êi 😂", "Skill issue tbh 💀",
    "Bro got lobotomized 🧠📉", "P1 bật hack 100% check VAR đi!", "Nhìn quả né đòn ảo ma thật 🔥",
    "Ai đặt cửa bên trái điểm danh 👇", "Bro is playing on a microwave 😭", "Đừng chớp mắt khúc cuối!!"
];

const BAIT_REACTION_MSGS = [
    "Ơ kìa tin nhắn ai vừa nhảy xuống thế 💀", "Vừa thấy tin nhắn Crush hay Mẹ kìa ông ơi 😂",
    "Cắm sạc pin vào đi kìa 10% rồi!! 🔋", "Tập trung đánh đi nhắn tin gì tầm này 😭",
    "Ảo thật đấy tưởng điện thoại tôi hết pin 💀"
];

const CLIMAX_REACTION_MSGS = [
    "LẬT KÈO RỒI KHÔNG THỂ TIN ĐƯỢC!! 😱", "1 MÁU CÒN SỐNG KÌA WTF?? 🤯",
    "NHẤP ĐÚP MÀN HÌNH CỨU NÓ ANH EM ƠI 💖", "Nổ sát thương nứt cả màn hình luôn kìa 🔥",
    "W W W W W W W 🔥🔥🔥", "RIP BOZO 📉💀"
];

window._recentChatsMemory = [];

window.generateLiveChatEvent = function(contextType) {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    let pool = NORMAL_MSGS;
    if (contextType === "bait") pool = BAIT_REACTION_MSGS;
    else if (contextType === "climax") pool = CLIMAX_REACTION_MSGS;

    let msg = r(pool); let attempts = 0;
    while (window._recentChatsMemory.includes(msg) && attempts < 10) { msg = r(pool); attempts++; }
    window._recentChatsMemory.push(msg); if (window._recentChatsMemory.length > 12) window._recentChatsMemory.shift();
    return { name: celeb.name, color: celeb.color, msg: msg, lines: null, nameWidth: 0, isHighlight: contextType !== "normal" };
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

// Tạo vết nứt kính màn hình khi đánh mạnh
window.spawnScreenCrack = function(cx, cy) {
    let branches = [];
    let numRays = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numRays; i++) {
        let angle = (Math.PI * 2 / numRays) * i + (Math.random() - 0.5) * 0.4;
        let pts = [{x: cx, y: cy}];
        let curX = cx, curY = cy;
        let steps = 4 + Math.floor(Math.random() * 4);
        for (let s = 0; s < steps; s++) {
            let len = 35 + Math.random() * 65;
            curX += Math.cos(angle + (Math.random() - 0.5) * 0.5) * len;
            curY += Math.sin(angle + (Math.random() - 0.5) * 0.5) * len;
            pts.push({x: curX, y: curY});
        }
        branches.push(pts);
    }
    window._screenCracks.push({ branches: branches, life: 1.0 });
    window.playViralSfx("crack");
};

window.StoryModeAI = {
    viralTitle: "",
    generateStoryTitle: function(p1Name, p2Name) {
        const titles = [
            `ĐỪNG CHỚP MẮT: Pha lật kèo 1 máu không tưởng giữa ${p1Name} và ${p2Name} 😱⚔️`,
            `Đang đánh giải căng thẳng thì Crush nhắn tin và cái kết... 💔😭`,
            `Khi ${p1Name} bật chế độ Thần Thánh đối đầu Boss ${p2Name} 🔥🐉`,
            `99% người xem đều tưởng ${p1Name} sẽ thua ở giây thứ 15! 🤯`,
            `Kèo 500k: Ai thua phải xóa game ngay lập tức! (${p1Name} vs ${p2Name}) 🏃💨`,
            `Pha xử lý 500 IQ đi vào lòng đất của ${p1Name} 💀📉`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return r(titles) + " #stickman #gaming #xuhuong #tiktokgaming";
    },
    generateViralPostKit: function(p1Name, p2Name) {
        const title = this.generateStoryTitle(p1Name || "NHÂN VẬT CHÍNH", p2Name || "BOSS");
        const pinnedComments = [
            `👇 GHIM: Có ai vừa giật mình tưởng điện thoại mình báo Pin Yếu hay có tin nhắn ở giây thứ 4 không? Khai thật đi 💀`,
            `👇 GHIM: Pha ở giây 15 là kỹ năng 500 IQ hay do Admin độ thế anh em? Cãi nhau to rồi 🔥`,
            `👇 GHIM: Đố ai bấm TẠM DỪNG đúng lúc màn hình bị đấm nứt kính đấy! Chụp màn hình lại nhé 📸`,
            `👇 GHIM: Trận tiếp theo anh em muốn cặp đấu nào lên sóng? Comment tên nhân vật nhiều tim nhất mình làm luôn! 🏆`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `🎬 TIKTOK VIRAL KIT\n\n📌 TIÊU ĐỀ:\n${title}\n\n💬 BÌNH LUẬN GHIM KÍCH TƯƠNG TÁC:\n${r(pinnedComments)}`;
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
    if (window._baitType === -1) return;
    let timeSinceBait = Date.now() - window._baitStartTime;
    if (timeSinceBait > 3600) { window._baitType = -1; return; } 
    ctx.save(); let alpha = 1;
    if (timeSinceBait < 250) alpha = timeSinceBait / 250;
    if (timeSinceBait > 3300) alpha = 1 - ((timeSinceBait - 3300) / 300);
    ctx.globalAlpha = Math.max(0, alpha);

    if (window._baitType === 0) {
        // BAIT 0: BÁO PIN YẾU IOS
        ctx.translate(w/2, h/2); ctx.fillStyle = "rgba(242, 242, 247, 0.96)";
        ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 25;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-230, -105, 460, 210, 22); else ctx.fillRect(-230, -105, 460, 210); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000"; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.fillText("Low Battery", 0, -42);
        ctx.font = "21px Arial"; ctx.fillText("10% battery remaining.", 0, -2); ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-230, 40); ctx.lineTo(230, 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 105); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "23px Arial"; ctx.fillText("Close", -115, 78); ctx.font = "bold 23px Arial"; ctx.fillText("Low Power Mode", 115, 78);
    } 
    else if (window._baitType === 1) {
        // BAIT 1: TIN NHẮN TỪ MẸ
        let slideY = timeSinceBait < 350 ? -150 + (timeSinceBait/350)*240 : 90;
        ctx.translate(w/2, slideY); ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 25;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-420, -55, 840, 110, 28); else ctx.fillRect(-420, -55, 840, 110); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(-350, 0, 36, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("M", -350, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.font = "bold 27px Arial"; ctx.fillText("Mẹ 😡 • Bây giờ", -290, -16);
        ctx.font = "24px Arial"; ctx.fillStyle = "#333"; ctx.fillText("Tắt điện thoại đi ngủ ngay không tao cắt mạng bây giờ!", -290, 20);
    }
    else if (window._baitType === 2) {
        // BAIT 2: ADMIN CAN THIỆP / PHÁT HIỆN NGHI VẤN HACK
        let slideY = timeSinceBait < 300 ? -100 + (timeSinceBait/300)*180 : 80;
        ctx.translate(w/2, slideY);
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.strokeStyle = "#ff0050"; ctx.lineWidth = 4;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-430, -45, 860, 90, 16); else ctx.fillRect(-430, -45, 860, 90);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffeb3b"; ctx.font = "900 26px 'Arial Black'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("⚠️ HỆ THỐNG: PHÁT HIỆN SÁT THƯƠNG BẤT THƯỜNG (+999%) ⚠️", 0, 0);
    }
    else if (window._baitType === 3) {
        // BAIT 3: TIN NHẮN MESSENGER TỪ CRUSH
        let slideY = timeSinceBait < 350 ? -150 + (timeSinceBait/350)*235 : 85;
        ctx.translate(w/2, slideY);
        ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 25;
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-410, -52, 820, 104, 52); else ctx.fillRect(-410, -52, 820, 104); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ff0050";
        ctx.beginPath(); ctx.arc(-345, 0, 36, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 28px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("💖", -345, 0);
        ctx.fillStyle = "#000"; ctx.textAlign = "left";
        ctx.font = "bold 26px Arial"; ctx.fillText("Crush ❤️ • Messenger", -285, -16);
        ctx.font = "23px Arial"; ctx.fillStyle = "#333"; ctx.fillText("Nhà em đang không có ai ở nhà... Qua sửa ống nước giúp em 🥺", -285, 19);
    }
    ctx.restore();
}

// INTRO NHANH 1.4 GIÂY PHỦ LÊN TRÊN GAMEPLAY TRỰC TIẾP
window.drawFastViralIntro = function(ctx, w, h, splitH, progress) {
    ctx.save();
    let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "OPPONENT");

    // Làm tối nhẹ vùng trên để chữ nổi bật nhưng vẫn thấy nhân vật cử động phía sau
    ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * (1 - progress * 0.5)})`;
    ctx.fillRect(0, 0, w, splitH);

    let jitterX = (Math.random() - 0.5) * 8;
    let jitterY = (Math.random() - 0.5) * 8;

    // Dải băng cảnh báo giữ chân ở trên cùng
    ctx.fillStyle = "#ff0050";
    ctx.fillRect(0, 35, w, 56);
    ctx.font = "900 32px 'Arial Black', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    window.strokeTextClean(ctx, `⚡ ${prm.lore.chapter} ⚡`, w/2 + jitterX, 63, "#ffeb3b", "#000", 8);

    // Tên cặp đấu va chạm vào nhau ở giữa màn hình game
    let slideOffset = Math.max(0, (1 - progress * 2.2) * 400);
    ctx.font = "italic 900 54px 'Impact', sans-serif";
    window.strokeTextClean(ctx, realP1Name, w/2 - 220 - slideOffset, splitH/2 - 70, "#00f3ff", "#000", 12);
    window.strokeTextClean(ctx, realP2Name, w/2 + 220 + slideOffset, splitH/2 - 70, "#ff0050", "#000", 12);

    // Chữ FIGHT / ĐẾM NGƯỢC CỰC LỚN
    let countText = progress < 0.45 ? "READY?" : "FIGHT!!";
    let col = progress < 0.45 ? "#ffeb3b" : "#2ed573";
    let pulseScale = 1.1 + Math.sin(progress * Math.PI * 4) * 0.25;

    ctx.translate(w/2 + jitterX, splitH/2 + 30 + jitterY);
    ctx.scale(pulseScale, pulseScale);
    ctx.font = "900 130px 'Impact', sans-serif";
    window.strokeTextClean(ctx, countText, 0, 0, col, "#000", 20);
    ctx.restore();
};

window.drawCinematicQuote = function(ctx, quote, elapsed, w, h, p1Url, p2Url, getHudImg) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 250) alpha = elapsed / 250;
    if (elapsed > quote.duration - 250) alpha = (quote.duration - elapsed) / 250;
    ctx.globalAlpha = Math.max(0, alpha);

    let boxW = w - 60;
    let boxH = 155;
    let boxX = 30;
    let boxY = h - boxH - 55;

    let jitter = (Math.random() - 0.5) * 3;
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 18); ctx.fill(); 
    } else { 
        ctx.fillRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    ctx.lineWidth = 4;
    ctx.strokeStyle = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 18); ctx.stroke(); 
    } else { 
        ctx.strokeRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    let faceSize = 115;
    let faceX = quote.speaker === "P1" ? boxX + 20 : boxX + boxW - faceSize - 20;
    let faceY = boxY + 20;
    
    let faceImgUrl = quote.face || (quote.speaker === "P1" ? p1Url : p2Url);
    let faceImg = getHudImg ? getHudImg(faceImgUrl) : null;
    
    if (faceImg && faceImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(faceImg, faceX, faceY, faceSize, faceSize);
        ctx.restore();
        
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2);
        ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.stroke();
    }

    let speakerName = quote.speaker === "P1" ? window.getRealCharName(window.p1, "PLAYER") : (window.enemies && window.enemies.length ? window.getRealCharName(window.enemies[0], "BOSS") : "OPPONENT");
    let textStartX = quote.speaker === "P1" ? boxX + faceSize + 40 : boxX + 30;
    let maxTextW = boxW - faceSize - 70;

    ctx.font = "900 28px 'Arial Black', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    let nameCol = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    window.strokeTextClean(ctx, "🎙️ " + speakerName, textStartX, boxY + 18, nameCol, "#000", 5);
    
    let charsToShow = Math.floor((elapsed - 100) / 12); 
    if (charsToShow < 0) charsToShow = 0;
    let displayedText = quote.text.substring(0, charsToShow);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial, sans-serif";
    
    let words = displayedText.split(" ");
    let line = "";
    let lineY = boxY + 60;
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > maxTextW && i > 0) {
            window.strokeTextClean(ctx, line, textStartX, lineY, "#fff", "#000", 4);
            line = words[i] + " "; lineY += 36;
        } else { line = testLine; }
    }
    window.strokeTextClean(ctx, line, textStartX, lineY, "#fff", "#000", 4);
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

    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.introParams = window.generateIntroParams();

    window.recordedChunksV = []; 
    window._liveAlerts = []; window._lastAlertTime = Date.now(); 
    window._baitTriggered = false; window._baitStage = 0; window._baitType = -1;
    window._combatTexts = [];
    window._floatingHearts = [];
    window._activeGift = null;
    window._screenCracks = [];
    window._rewindSfxPlayed = false;
    
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
    if (typeof window._fakeViewers === "undefined") window._fakeViewers = 650 + Math.floor(Math.random() * 600);

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
        }, 600); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._sfxCuts = [false, false, false, false, false]; 
    window._lastCaptureTime = Date.now(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    window.showRenderToast("⏳ ĐANG XUẤT VIDEO TIKTOK...");
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    // Kết thúc nhanh ở matchEndTimer > 145 ngay sau khi chạy hiệu ứng Glitch Rewind Loop
    if (window.gameOver && window.matchEndTimer > 145) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 30) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV;
    let isLoopRewindActive = (window.gameOver && window.matchEndTimer > 75);
    let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0, 0, 1080, 1920);
    let elapsed = Date.now() - window.introStartTime;

    if (elapsed >= window.introDuration && !window._gamePhaseStarted) {
        window._gamePhaseStarted = true; window.gamePhaseStartTime = elapsed;
    }
    if (isLoopRewindActive && !window._gamePhaseEnded) {
        window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed;
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; let shakeX = 0, shakeY = 0;
    
    if (audioPeak > 0.55) { let shakeIntensity = (audioPeak - 0.55) * 40; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.72 && (window._glitchThrottle % 3 === 0);

    let isKillCamActive = (window.gameOver && window.matchEndTimer > 0 && window.matchEndTimer <= 75);

    // KÍCH HOẠT CHẮC CHẮN 2 MỒI NHỬ (GIÂY 3.8 VÀ GIÂY 11) KÈM ÂM THANH THẬT
    if (elapsed > 3800 && window._baitStage === 0) {
        window._baitStage = 1;
        window._baitType = Math.random() < 0.6 ? 3 : (Math.random() < 0.5 ? 0 : 1); // Ưu tiên tin nhắn Crush hoặc Pin yếu
        window._baitStartTime = Date.now();
        window.playViralSfx(window._baitType === 0 ? "lowbat" : "noti");
    } else if (elapsed > 11500 && window._baitStage === 1 && !window.gameOver) {
        window._baitStage = 2;
        window._baitType = 2; // Cảnh báo nghi vấn Hack giữa trận
        window._baitStartTime = Date.now();
        window.playViralSfx("noti");
    }

    let p1HpPct = window.p1 ? Math.max(0, window.p1.hp / window.p1.maxHp) : 1;
    let p2HpPct = 1;
    if (window.enemies && window.enemies.length > 0) {
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1;
        window.enemies.forEach(e => eHp += Math.max(0, e.hp));
        p2HpPct = Math.max(0, eHp / eMax);
    }

    let isClimaxTension = (p1HpPct < 0.35 || p2HpPct < 0.35) && window._gamePhaseStarted && !isLoopRewindActive;

    // 1. VẼ MÀN HÌNH GAME CHÍNH (VỚI MÀU SẮC NEON RỰC RỠ THAY VÌ SEPIA)
    ctxV.imageSmoothingEnabled = false;
    let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
    const getHudImg = (url) => { if (!url) return null; if (window.hudImages && window.hudImages[url] && window.hudImages[url].complete) return window.hudImages[url]; if(!window.hudImages) window.hudImages={}; let i = new Image(); i.crossOrigin="Anonymous"; i.src=url; window.hudImages[url]=i; return null; };
    let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url;
    if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url;

    if (!window.gameOver && window._gamePhaseStarted) {
        let p1Dmg = window._lastP1Hp - p1HpPct;
        let p2Dmg = window._lastP2Hp - p2HpPct;
        if (p1Dmg > 0.02 || p2Dmg > 0.02) {
            window._impactFrames = 18; 
            window._impactIntensity = Math.min((p1Dmg + p2Dmg) * 650, 85); 
            window._impactColor = (p1Dmg > p2Dmg) ? "#ff003c" : "#00f3ff"; 

            if (p1Dmg > 0.04 || p2Dmg > 0.04) {
                const popWords = ["💥 CHÍ MẠNG!", "🧠 500 IQ!", "⚡ OUTPLAYED!", "💀 ĐAU ĐẤY!", "🔥 COMBO!!"];
                let txt = popWords[Math.floor(Math.random() * popWords.length)];
                let col = (p1Dmg > p2Dmg) ? "#ff0050" : "#00f3ff";
                let hitX = 540 + (Math.random() - 0.5) * 320;
                let hitY = splitGameHeight / 2 + (Math.random() - 0.5) * 140;
                window._combatTexts.push({text: txt, x: hitX, y: hitY, life: 1.0, color: col});

                // Nứt màn hình nếu đòn đánh cực mạnh (> 7% máu)
                if ((p1Dmg > 0.07 || p2Dmg > 0.07) && window._screenCracks.length < 2) {
                    window.spawnScreenCrack(hitX, hitY);
                }
            }
        }
    }
    window._lastP1Hp = p1HpPct;
    window._lastP2Hp = p2HpPct;

    ctxV.save();
    let cinematicZoom = 1.0;
    if (window._activeQuote && !window.gameOver) {
        let qElapsed = Date.now() - window._activeQuoteStartTime;
        cinematicZoom = 1 + Math.min(0.18, (qElapsed / window._activeQuote.duration) * 0.18);
    }

    if (isKillCamActive) {
        ctxV.translate(540, splitGameHeight / 2); ctxV.scale(1.28, 1.28); ctxV.translate(-540, -splitGameHeight / 2);
        if (window.matchEndTimer < 18 && window.matchEndTimer % 4 === 0) ctxV.filter = "invert(100%) contrast(200%)";
    } else {
        let currentZoom = cinematicZoom;
        let extraShakeX = 0, extraShakeY = 0;
        if (window._impactFrames > 0) {
            currentZoom += (window._impactFrames * 0.014);
            extraShakeX = (Math.random() - 0.5) * window._impactIntensity;
            extraShakeY = (Math.random() - 0.5) * window._impactIntensity;
        }
        if (currentZoom > 1.0) {
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(currentZoom, currentZoom); ctxV.translate(-540 + extraShakeX, -splitGameHeight / 2 + extraShakeY);
        }
    }

    ctxV.save();
    // Chỉnh màu sắc rực rỡ, độ tương phản cao bắt mắt trên TikTok
    ctxV.filter = "contrast(115%) saturate(135%)"; 
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

    // VẼ VẾT NỨT KÍNH MÀN HÌNH
    for (let i = window._screenCracks.length - 1; i >= 0; i--) {
        let cr = window._screenCracks[i];
        cr.life -= 0.012;
        ctxV.save();
        ctxV.globalAlpha = Math.max(0, cr.life);
        ctxV.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 8;
        ctxV.lineWidth = 3;
        cr.branches.forEach(pts => {
            ctxV.beginPath();
            ctxV.moveTo(pts[0].x, pts[0].y);
            for (let p = 1; p < pts.length; p++) ctxV.lineTo(pts[p].x, pts[p].y);
            ctxV.stroke();
        });
        ctxV.restore();
        if (cr.life <= 0) window._screenCracks.splice(i, 1);
    }

    // VẼ DAMAGE POP-UPS
    for (let i = window._combatTexts.length - 1; i >= 0; i--) {
        let ct = window._combatTexts[i];
        ct.life -= 0.03; ct.y -= 3.0;
        ctxV.save();
        ctxV.globalAlpha = Math.max(0, ct.life);
        let popScale = 1 + Math.sin(ct.life * Math.PI) * 0.25;
        ctxV.translate(ct.x, ct.y); ctxV.scale(popScale, popScale);
        ctxV.font = "italic 900 46px 'Arial Black', sans-serif";
        ctxV.textAlign = "center";
        window.strokeTextClean(ctxV, ct.text, 0, 0, ct.color, "#000", 8);
        ctxV.restore();
        if (ct.life <= 0) window._combatTexts.splice(i, 1);
    }

    if (isClimaxTension) {
        let tensionPulse = Math.abs(Math.sin(Date.now() / 160));
        let gradTension = ctxV.createRadialGradient(540, splitGameHeight/2, 180, 540, splitGameHeight/2, 750);
        gradTension.addColorStop(0, "rgba(255, 0, 0, 0)");
        gradTension.addColorStop(1, `rgba(255, 0, 50, ${0.42 * tensionPulse})`);
        ctxV.fillStyle = gradTension;
        ctxV.fillRect(0, 0, 1080, splitGameHeight);

        ctxV.save();
        ctxV.translate(540, 65);
        ctxV.rotate((Math.random() - 0.5) * 0.06);
        ctxV.font = "900 44px 'Arial Black'";
        ctxV.textAlign = "center";
        window.strokeTextClean(ctxV, "🚨 SẮP CÓ BIẾN LỚN 🚨", 0, 0, "#ffeb3b", "#ff0050", 10);
        ctxV.restore();
    }

    if (window._impactFrames > 0) {
        let flashAlpha = window._impactFrames / 18;
        ctxV.fillStyle = window._impactColor;
        ctxV.globalAlpha = flashAlpha * 0.35;
        ctxV.globalCompositeOperation = "overlay";
        ctxV.fillRect(0, 0, 1080, splitGameHeight);
        ctxV.globalAlpha = 1.0;
        ctxV.globalCompositeOperation = "source-over";
        window._impactFrames--;
    }

    // FAKE CTA BƠM MÁU KHI MÁU P1 YẾU
    if (p1HpPct < 0.45 && !window.gameOver) {
        let pulseCTA = Math.abs(Math.sin(Date.now() / 140));
        ctxV.save();
        ctxV.font = "900 34px 'Arial Black'";
        ctxV.textAlign = "center";
        window.strokeTextClean(ctxV, "👆 NHẤP ĐÚP MÀN HÌNH ĐỂ BƠM MÁU 💖", 540, splitGameHeight - 38 - (pulseCTA * 12), "#ffeb3b", "#ff0050", 8);
        ctxV.restore();
    }

    ctxV.restore(); ctxV.restore(); 

    // NẾU ĐANG TRONG 1.4 GIÂY ĐẦU -> VẼ FLASH INTRO PHỦ LÊN GAME
    if (elapsed < window.introDuration) {
        window.drawFastViralIntro(ctxV, 1080, 1920, splitGameHeight, elapsed / window.introDuration);
    }

    // XỬ LÝ DIALOGUE CỐT TRUYỆN
    if (!window._activeQuote && !window.gameOver && elapsed >= window.introDuration) {
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
    if (window._activeQuote && !window.gameOver) {
        let elapsedQuote = Date.now() - window._activeQuoteStartTime;
        if (elapsedQuote < window._activeQuote.duration) {
            window.drawCinematicQuote(ctxV, window._activeQuote, elapsedQuote, 1080, splitGameHeight, p1Url, p2Url, getHudImg);
        } else { window._activeQuote = null; }
    }

    // HIỆU ỨNG GLITCH RGB KHI NHẠC CĂNG
    if (shouldGlitch) {
        let glitchStr = ((audioPeak - 0.72) * 32) | 0; ctxV.globalAlpha = 0.38;
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
        ctxV.globalAlpha = 1.0; 
    }

    // 2. VẼ NỬA DƯỚI MÀN HÌNH (HUD + KHUNG CHAT + QUÀ TIKTOK)
    let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
    let botGrad = ctxV.createLinearGradient(0, retainY, 0, 1920);
    botGrad.addColorStop(0, "#090d16");
    botGrad.addColorStop(1, "#130f24");
    ctxV.fillStyle = botGrad; 
    ctxV.fillRect(0, retainY, 1080, retainHeight); 
    
    // Thanh Progress Bar giữ chân tâm lý học
    let bannerY = retainY + 2; 
    ctxV.fillStyle = "#1e293b"; ctxV.fillRect(0, bannerY, 1080, 46); 
    let matchSecs = (Date.now() - window.gamePhaseStartTime) / 1000;
    let fakeProgress = Math.min(0.99, (matchSecs / 45) + (1 - p1HpPct)*0.35 + (1 - p2HpPct)*0.45);
    ctxV.fillStyle = "#ff0050"; 
    ctxV.fillRect(0, bannerY, 1080 * fakeProgress, 46); 
    ctxV.font = "900 24px 'Arial Black', sans-serif"; 
    ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
    let loadingText = fakeProgress > 0.85 ? `🚨 CHỜ XEM CÚ CHỐT... ${Math.floor(fakeProgress * 100)}% 🚨` : `🔥 ĐANG NẠP TUYỆT KỸ... ${Math.floor(fakeProgress * 100)}% 🔥`;
    window.strokeTextClean(ctxV, loadingText, 540, bannerY + 23, "#ffffff", "#000000", 5);

    if (window.p1) {
        let p1Stam = Math.max(0, window.p1.stamina / 100); let eStam = 0;
        let p1Name = window.getRealCharName(window.p1, "PLAYER"); let eName = "BOSS";
        if (repEnemyObj) { eStam = Math.max(0, repEnemyObj.stamina / 100); eName = window.getRealCharName(repEnemyObj, "BOSS"); }

        let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); 
        let hudBaseY = splitGameHeight + 115; 
        let avRadius = 55;
        
        const drawPillBar = (ctx, x, y, w, h, fillGrad, pct, isRightAligned) => {
            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,0.65)";
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
            ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.25)";
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

    if (window.p1 && repEnemyObj) {
        ctxV.save(); let pollY = splitGameHeight + 235; let pollWidth = 840; let pollX = 540; ctxV.translate(pollX, pollY);
        ctxV.font = "900 19px 'Arial Black'"; ctxV.textAlign = "center"; 
        window.strokeTextClean(ctxV, "👇 COMMENT ĐẶT CỬA AI THẮNG 👇", 0, -25, "#ffeb3b", "#000", 4);
        
        let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
        
        ctxV.fillStyle = "rgba(255, 0, 60, 0.85)"; 
        if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 26, 13); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 26); }
        ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 26, 13); ctxV.clip(); } 
        ctxV.fillStyle = "rgba(0, 243, 255, 0.9)"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 26); ctxV.restore();
        
        ctxV.fillStyle = "#0f172a"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 13, 19, 0, Math.PI*2); ctxV.fill(); 
        ctxV.lineWidth = 2; ctxV.strokeStyle = "#fff"; ctxV.stroke(); 
        ctxV.font = "900 12px 'Arial Black'"; 
        window.strokeTextClean(ctxV, "VS", -pollWidth/2 + pollWidth * p1Pct, 13, "#fff", "#000", 3);
        
        ctxV.font = "900 18px 'Arial Black'"; 
        ctxV.textAlign = "left"; window.strokeTextClean(ctxV, `${Math.round(p1Pct*100)}%`, -pollWidth/2 + 15, 13, "#fff", "#000", 4); 
        ctxV.textAlign = "right"; window.strokeTextClean(ctxV, `${Math.round((1-p1Pct)*100)}%`, pollWidth/2 - 15, 13, "#fff", "#000", 4);
        ctxV.restore();
    }

    // KHUNG LIVE CHAT THÔNG MINH
    let boxWidth = 880; let boxHeight = 720; let boxX = 540; let boxY = 1520; 

    ctxV.save(); ctxV.translate(boxX, boxY); 
    ctxV.fillStyle = "rgba(10, 15, 30, 0.68)"; 
    ctxV.strokeStyle = "rgba(0, 243, 255, 0.35)"; 
    ctxV.lineWidth = 2;
    
    ctxV.beginPath(); 
    if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16); 
    else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); 
    ctxV.fill(); ctxV.stroke();
    
    ctxV.beginPath();
    ctxV.moveTo(-boxWidth/2, -boxHeight/2 + 52);
    ctxV.lineTo(boxWidth/2, -boxHeight/2 + 52);
    ctxV.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctxV.stroke();

    ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16); ctxV.clip(); 
    
    ctxV.save(); ctxV.rotate(-0.10); ctxV.font = "900 70px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
    let brandWM = window.CREATOR_HANDLE || "Sticklom";
    ctxV.fillStyle = "rgba(255, 255, 255, 0.04)"; ctxV.fillText(brandWM, 0, 0); ctxV.restore();

    ctxV.font = "900 22px Arial"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
    window.strokeTextClean(ctxV, "🔴 TRỰC TIẾP • Kênh Chat Cao Thủ", -boxWidth/2 + 25, -boxHeight/2 + 26, "#00f3ff", "#000", 4);
    
    ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 54, boxWidth, boxHeight - 54); ctxV.clip();
    let currentY = boxHeight/2 - 20; let lineHeight = 42; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 31px Arial"; let headerBottomY = -boxHeight/2 + 54; 
    
    if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent("normal"); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }

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

    // BÃO TIM TIKTOK BAY LÊN BÊN PHẢI KHUNG CHAT
    if (Math.random() < 0.35) {
        const emojis = ["❤️", "🔥", "💖", "😱", "💀", "👏"];
        window._floatingHearts.push({
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            x: 960 + (Math.random() - 0.5) * 60,
            y: 1850,
            vx: (Math.random() - 0.5) * 2,
            vy: -4 - Math.random() * 4,
            scale: 0.7 + Math.random() * 0.6,
            life: 1.0
        });
    }
    for (let i = window._floatingHearts.length - 1; i >= 0; i--) {
        let fh = window._floatingHearts[i];
        fh.x += fh.vx; fh.y += fh.vy; fh.life -= 0.018;
        ctxV.save();
        ctxV.globalAlpha = Math.max(0, fh.life);
        ctxV.font = `${Math.floor(38 * fh.scale)}px Arial`;
        ctxV.textAlign = "center";
        ctxV.fillText(fh.emoji, fh.x, fh.y);
        ctxV.restore();
        if (fh.life <= 0) window._floatingHearts.splice(i, 1);
    }

    // HIỆU ỨNG ĐẠI GIA NỔ QUÀ TIKTOK (SƯ TỬ / VŨ TRỤ COMBO x99)
    if (!window._activeGift && elapsed > 5000 && Math.random() < 0.012 && !window.gameOver) {
        let sender = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name;
        const gifts = [
            { icon: "🦁", name: "SƯ TỬ VÀNG", count: 99 },
            { icon: "🌌", name: "TIKTOK UNIVERSE", count: 10 },
            { icon: "🐉", name: "HẮC LONG", count: 68 }
        ];
        let g = gifts[Math.floor(Math.random() * gifts.length)];
        window._activeGift = { sender: sender, icon: g.icon, name: g.name, count: g.count, startTime: Date.now() };
        window.playViralSfx("gift");
    }
    if (window._activeGift) {
        let gElapsed = Date.now() - window._activeGift.startTime;
        if (gElapsed < 2800) {
            ctxV.save();
            let slideX = gElapsed < 300 ? -500 + (gElapsed / 300) * 540 : 40;
            let giftY = splitGameHeight + 310;
            ctxV.translate(slideX, giftY);
            let gGrad = ctxV.createLinearGradient(0, 0, 560, 0);
            gGrad.addColorStop(0, "rgba(255, 0, 80, 0.92)");
            gGrad.addColorStop(1, "rgba(255, 153, 0, 0.85)");
            ctxV.fillStyle = gGrad;
            if (ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -40, 560, 80, 40); ctxV.fill(); } else { ctxV.fillRect(0, -40, 560, 80); }
            ctxV.lineWidth = 3; ctxV.strokeStyle = "#ffeb3b"; ctxV.stroke();

            ctxV.font = "55px Arial"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.fillText(window._activeGift.icon, 55, 0);
            ctxV.textAlign = "left";
            ctxV.font = "900 22px 'Arial Black'";
            window.strokeTextClean(ctxV, window._activeGift.sender, 105, -12, "#fff", "#000", 4);
            ctxV.font = "bold 20px Arial";
            ctxV.fillStyle = "#ffeb3b"; ctxV.fillText(`Đã tặng ${window._activeGift.name}!`, 105, 16);

            let comboScale = 1 + Math.abs(Math.sin(gElapsed / 80)) * 0.35;
            ctxV.translate(490, 0); ctxV.scale(comboScale, comboScale);
            ctxV.font = "italic 900 42px 'Impact'"; ctxV.textAlign = "center";
            window.strokeTextClean(ctxV, `x${window._activeGift.count}`, 0, 0, "#ffeb3b", "#000", 8);
            ctxV.restore();
        } else {
            window._activeGift = null;
        }
    }

    // CẬP NHẬT TIN NHẮN CHAT PHẢN ỨNG THEO TÌNH HUỐNG
    let chatNow = Date.now();
    let isBaitActive = (window._baitType !== -1);
    let isHypeMoment = (window._impactFrames > 5 || window._activeQuote != null || isClimaxTension || isBaitActive);
    let dynamicDelay = isHypeMoment ? (180 + Math.random() * 220) : (850 + Math.random() * 1400); 

    if (chatNow - window._lastChatUpdate > dynamicDelay) { 
        window._lastChatUpdate = chatNow; 
        let ctxType = isBaitActive ? "bait" : (isClimaxTension ? "climax" : "normal");
        let newChat = window.generateLiveChatEvent(ctxType);
        window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); 
        if (window._liveChats.length > 12) window._liveChats.shift(); 
        
        let viewChange = isHypeMoment ? Math.floor(Math.random() * 140) : (Math.floor(Math.random() * 41) - 12);
        window._fakeViewers += viewChange;
        if(window._fakeViewers < 400) window._fakeViewers += 80;
    }

    // LIVE ALERTS GÓC TRÁI
    if (Date.now() - window._lastAlertTime > 2200 + Math.random() * 2500) { 
        window._lastAlertTime = Date.now(); 
        let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name; 
        let alertTypes = [`❤️ ${randomUser} đã thích phiên LIVE!`, `🔄 ${randomUser} vừa chia sẻ LIVE!`, `➕ ${randomUser} đã theo dõi kênh!`, `🌹 ${randomUser} đã tặng Hoa Hồng!`]; 
        window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); 
    }

    let alertStartX = 20; let alertStartY_Left = splitGameHeight - 15;
    for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
        let al = window._liveAlerts[i]; al.life -= 0.014; al.yOffset += 1.8; ctxV.save(); 
        ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 2.0)); ctxV.font = "bold 23px Arial"; 
        let textW = ctxV.measureText(al.text).width; ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
        let alertGrad = ctxV.createLinearGradient(0, 0, textW + 40, 0); alertGrad.addColorStop(0, "rgba(0, 0, 0, 0.8)"); alertGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        ctxV.fillStyle = alertGrad; 
        if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -22, textW + 40, 44, 22); ctxV.fill(); } else { ctxV.fillRect(0, -22, textW + 40, 44); } 
        ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 15, 0); ctxV.restore(); 
        if (al.life <= 0) window._liveAlerts.splice(i, 1);
    }

    // BADGE MẮT XEM GÓC PHẢI
    if (typeof window._fakeViewers !== "undefined") {
        ctxV.save(); let badgeY = splitGameHeight - 35; let badgeX = 1060; 
        ctxV.font = "bold 24px 'Arial Black'"; let viewStr = "👁️ " + window._fakeViewers.toLocaleString(); let viewW = ctxV.measureText(viewStr).width;
        ctxV.fillStyle = "rgba(0, 0, 0, 0.7)";
        if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25, badgeY - 20, viewW + 25, 40); }
        ctxV.textAlign = "right"; ctxV.textBaseline = "middle"; 
        window.strokeTextClean(ctxV, viewStr, badgeX - 10, badgeY, "#fff", "#000", 3);
        let liveW = 85; ctxV.fillStyle = (Math.floor(Date.now()/450)%2===0) ? "#ff0050" : "#b8003a";
        if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 25 - liveW - 5, badgeY - 20, liveW, 40); }
        ctxV.textAlign = "center"; 
        window.strokeTextClean(ctxV, "LIVE", badgeX - viewW - 25 - liveW/2 - 5, badgeY + 2, "#fff", "#000", 3);
        ctxV.restore();
    }

    // VẼ MỒI NHỬ (CRUSH / PIN YẾU / MẸ Mắng / HACK)
    drawBaitSạn(ctxV, 1080, splitGameHeight);

    // 3. KỸ THUẬT SEAMLESS GLITCH REWIND LOOP Ở CUỐI TRẬN (THAY CHO MÀN HÌNH TĨNH CŨ)
    if (isLoopRewindActive) {
        if (!window._rewindSfxPlayed) {
            window._rewindSfxPlayed = true;
            window.playViralSfx("rewind");
        }
        let rewindProg = Math.min(1, (window.matchEndTimer - 75) / 65);
        ctxV.save();
        // Các thanh nhiễu sóng ngang cắt lát màn hình
        for (let s = 0; s < 14; s++) {
            let sliceY = Math.random() * 1920;
            let sliceH = 15 + Math.random() * 60;
            let offset = (Math.random() - 0.5) * 140 * rewindProg;
            ctxV.drawImage(window.recordCanvasV, 0, sliceY, 1080, sliceH, offset, sliceY, 1080, sliceH);
        }
        ctxV.fillStyle = `rgba(0, 0, 0, ${rewindProg * 0.45})`;
        ctxV.fillRect(0, 0, 1080, 1920);

        ctxV.translate(540, splitGameHeight / 2);
        let scaleHook = 1 + rewindProg * 0.35;
        ctxV.scale(scaleHook, scaleHook);
        ctxV.font = "italic 900 62px 'Impact', sans-serif";
        ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
        window.strokeTextClean(ctxV, "⏪ KHOAN ĐÃ... TẬP 2?!", 0, -30, "#00f3ff", "#000", 14);
        ctxV.font = "900 36px 'Arial Black'";
        window.strokeTextClean(ctxV, "XEM KỸ LẠI PHA NÀY 👇", 0, 45, "#ffeb3b", "#ff0050", 8);
        ctxV.restore();
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Đã chép bộ Caption & Comment Ghim! Giờ bạn có thể dán lên TikTok/YouTube."); }); };

window.mergeAndDownloadVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.href = vid.urlV;
    a.download = "[VIRAL_LOOP]_" + vid.safeFileName + "." + vid.ext;
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
        container.innerHTML = `<div style="text-align: center; padding: 20px;"><h3 style="margin: 0 0 10px 0; color: #00f3ff; font-weight: 800; letter-spacing: 1px; font-size: 28px;">🎬 TIKTOK VIRAL STUDIO V88</h3><p style="color: #94a3b8; margin: 0; font-size: 15px;">Chưa có video nào. Hãy chiến đấu để tạo siêu phẩm!</p></div>`; 
        return; 
    }
    
    let html = `<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #fff; font-weight: 800; letter-spacing: 1px; font-size: 24px;"><span style="color:#00f3ff;">🎬 TIKTOK</span> STUDIO V88</h3>
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
                            <button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">📋 Chép Caption & Ghim</button>
                            <button id="btn-dl-${vid.id}" onclick="window.mergeAndDownloadVideo(${vid.id})" style="background: #00f3ff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 800; flex: 1; cursor:pointer; box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3); transition: all 0.2s;">🚀 TẢI TIKTOK NGAY</button>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Xóa</button>
                        </div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
