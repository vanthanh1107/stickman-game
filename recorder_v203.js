// ==========================================
// RECORDER.JS - V94.2 CLASSIC VINTAGE INTRO EDITION (@gamenhuclon)
// ĐÃ KHÔI PHỤC MÀU INTRO HÚT VIEW:
// 1. Khôi phục bộ lọc màu cổ điển ít màu (grayscale(100%) contrast(200%) sepia(30%)) cho nhân vật múa ở Intro & Outro.
// 2. Nhân vật khi múa ở Intro vẫn giữ nguyên 100% thân thể, trang phục, đạo cụ riêng và điệu nhảy mượt mà.
// 3. Giữ nguyên toàn bộ nâng cấp mới: Tách riêng livechat.js, Trash Talk theo từng tướng, Không cắt chữ tên dài & Cache Gradient.
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

window._storyQuotes = [];
window._activeQuote = null;
window._activeQuoteStartTime = 0;

window.avatarImageCache = window.avatarImageCache || window.hudImages || {};
window.hudImages = window.avatarImageCache;

window.getSharedCachedImg = function(url) {
    if (!url) return null;
    if (window.avatarImageCache[url] && window.avatarImageCache[url].complete && window.avatarImageCache[url].naturalWidth > 0) {
        return window.avatarImageCache[url];
    }
    if (!window.avatarImageCache[url]) {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        window.avatarImageCache[url] = img;
    }
    return null;
};

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

window.getRealCharName = function(obj, fallback) {
    if (!obj) return fallback.toUpperCase();
    let n = null;
    if (obj.classId !== undefined && window.classStats && window.classStats[obj.classId]) { n = window.classStats[obj.classId].className || window.classStats[obj.classId].name; }
    if (!n) n = obj.className || obj.name || obj.type || obj.id;
    if (!n || n === "undefined" || n === "null") return fallback.toUpperCase();
    return String(n).toUpperCase().trim();
};

window.getCharDefObj = function(fighterObj) {
    if (!fighterObj || !window.classStats) return null;
    return window.classStats[fighterObj.classId] || window.classStats[(fighterObj.classId || "").toLowerCase()] || null;
};

window.formatTrashLine = function(rawText, myName, enemyName) {
    if (!rawText) return "";
    return String(rawText)
        .replace(/\{enemy\}/gi, enemyName)
        .replace(/\{target\}/gi, enemyName)
        .replace(/\{me\}/gi, myName);
};

// ==========================================
// TRẠM ĐỌC TRASH TALK TỪ FILE NHÂN VẬT (P1 ĐỐI ĐÁP VỚI P2)
// ==========================================
window.buildCharacterTrashTalk = function() {
    let p1Obj = window.p1;
    let p2Obj = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
    let p1Name = window.getRealCharName(p1Obj, "PLAYER 1");
    let p2Name = window.getRealCharName(p2Obj, "BOSS");

    let def1 = window.getCharDefObj(p1Obj);
    let def2 = window.getCharDefObj(p2Obj);

    let tt1 = (def1 && (def1.trashTalk || def1.quotes)) ? (def1.trashTalk || def1.quotes) : null;
    let tt2 = (def2 && (def2.trashTalk || def2.quotes)) ? (def2.trashTalk || def2.quotes) : null;

    let p1Lines = [];
    if (Array.isArray(tt1)) p1Lines = tt1.slice();
    else if (tt1 && Array.isArray(tt1.midMatch)) p1Lines = tt1.midMatch.slice();
    if (p1Lines.length === 0) {
        p1Lines = [
            `Nghe đồn ${p2Name} là trùm khu này à? Đứng im cho ${p1Name} vả mấy phát xem nào! 😎`,
            `Kỹ năng của ${p2Name} chỉ đủ làm bao cát cho tao khởi động thôi! 🥊`
        ];
    }

    let p2Lines = [];
    if (Array.isArray(tt2)) p2Lines = tt2.slice();
    else if (tt2 && Array.isArray(tt2.midMatch)) p2Lines = tt2.midMatch.slice();
    if (p2Lines.length === 0) {
        p2Lines = [
            `Cỡ ${p1Name} mà cũng đòi lên sàn đấu với tao á? Về tập thêm 10 năm nữa đi con! 💀`,
            `Đừng tưởng cào cấu được tí máu của ${p2Name} mà đã vội gáy nhé! 👺`
        ];
    }

    // Chọn ngẫu nhiên các câu gáy khác nhau trong danh sách của nhân vật ở mỗi trận
    let startIdx1 = Math.floor(Math.random() * p1Lines.length);
    let startIdx2 = Math.floor(Math.random() * p2Lines.length);

    const pickLine = (arr, idx, myN, oppN) => {
        let raw = arr[idx % arr.length];
        return window.formatTrashLine(raw, myN, oppN);
    };

    let p1Avatar = (def1 && def1.avatarUrl) || (p1Obj && p1Obj.avatarUrl) || "https://i.imgur.com/q3813rX.png";
    let p2Avatar = (def2 && def2.avatarUrl) || (p2Obj && p2Obj.avatarUrl) || "https://i.imgur.com/q3813rX.png";

    window._storyQuotes = [
        { triggerHp: 0.82, speaker: "P1", text: pickLine(p1Lines, startIdx1, p1Name, p2Name), face: p1Avatar, duration: 2600, triggered: false },
        { triggerHp: 0.62, speaker: "P2", text: pickLine(p2Lines, startIdx2, p2Name, p1Name), face: p2Avatar, duration: 2600, triggered: false },
        { triggerHp: 0.42, speaker: "P1", text: pickLine(p1Lines, startIdx1 + 1, p1Name, p2Name), face: p1Avatar, duration: 2600, triggered: false },
        { triggerHp: 0.22, speaker: "P2", text: pickLine(p2Lines, startIdx2 + 1, p2Name, p1Name), face: p2Avatar, duration: 2600, triggered: false }
    ];
};

window.buildCharacterOutroQuote = function() {
    let isP1Win = (window.p1 && window.p1.hp > 0);
    let p1Obj = window.p1;
    let p2Obj = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
    let p1N = window.getRealCharName(p1Obj, "Hảo hán");
    let p2N = window.getRealCharName(p2Obj, "Đối thủ");

    let def1 = window.getCharDefObj(p1Obj);
    let def2 = window.getCharDefObj(p2Obj);
    let tt1 = (def1 && (def1.trashTalk || def1.quotes)) ? (def1.trashTalk || def1.quotes) : null;
    let tt2 = (def2 && (def2.trashTalk || def2.quotes)) ? (def2.trashTalk || def2.quotes) : null;

    const formatOutroObj = (qObj, myN, oppN) => {
        if (typeof qObj === "string") {
            return { c: `${myN} GÁY KHÉT!`, s: window.formatTrashLine(qObj, myN, oppN) };
        }
        return {
            c: window.formatTrashLine(qObj.c || `${myN} ĐÃ LÊN TIẾNG!`, myN, oppN),
            s: window.formatTrashLine(qObj.s || "", myN, oppN)
        };
    };

    if (isP1Win) {
        if (tt1 && Array.isArray(tt1.winQuotes) && tt1.winQuotes.length > 0) {
            let pick = tt1.winQuotes[Math.floor(Math.random() * tt1.winQuotes.length)];
            return formatOutroObj(pick, p1N, p2N);
        }
        if (tt2 && Array.isArray(tt2.loseQuotes) && tt2.loseQuotes.length > 0) {
            let pick = tt2.loseQuotes[Math.floor(Math.random() * tt2.loseQuotes.length)];
            return formatOutroObj(pick, p2N, p1N);
        }
    } else {
        if (tt1 && Array.isArray(tt1.loseQuotes) && tt1.loseQuotes.length > 0) {
            let pick = tt1.loseQuotes[Math.floor(Math.random() * tt1.loseQuotes.length)];
            return formatOutroObj(pick, p1N, p2N);
        }
        if (tt2 && Array.isArray(tt2.winQuotes) && tt2.winQuotes.length > 0) {
            let pick = tt2.winQuotes[Math.floor(Math.random() * tt2.winQuotes.length)];
            return formatOutroObj(pick, p2N, p1N);
        }
    }

    let defaultWin = [
        { c: `Out trình hoàn toàn!`, s: `${p1N} vừa dạy cho ${p2N} một bài học nhớ đời. Ai đặt cửa ${p1N} điểm danh nhận thưởng!` },
        { c: `Thắng làm vua, thua xóa acc!`, s: `Màn trình diễn 500 IQ của ${p1N} khiến ${p2N} không kịp thở!` }
    ];
    let defaultLose = [
        { c: `Á đù, lỗi kỹ thuật!`, s: `${p1N} đang đánh thì trượt tay bấm nhầm nút thôi. Hẹn ${p2N} tập 2 phục thù ngay lập tức!` },
        { c: `Thua keo này ta bày keo khác!`, s: `Tại mạng lag 999ms nên ${p1N} nhường ${p2N} hiệp đầu cho kịch tính!` }
    ];
    let pool = isP1Win ? defaultWin : defaultLose;
    return pool[Math.floor(Math.random() * pool.length)];
};

const THEMES = [
    { id: "fire", c1: "#3a0000", c2: "#050000", aura: "#ff003c" }, { id: "ice", c1: "#001b3a", c2: "#00050a", aura: "#00f3ff" },
    { id: "toxic", c1: "#0a2a00", c2: "#000a00", aura: "#39ff14" }, { id: "void", c1: "#1a003a", c2: "#05000a", aura: "#b100ff" },
    { id: "gold", c1: "#3a2500", c2: "#0a0500", aura: "#ffb800" }, { id: "blood", c1: "#2a0000", c2: "#000000", aura: "#ff0000" }
];

const DEFAULT_CHAPTERS = [
    "KÈO CĂNG: {me} ĐẠI CHIẾN {enemy}",
    "TRẬN QUYẾT TỬ: AI THUA XÓA ACC",
    "ĐẠI CHIẾN ĐỈNH CAO: {me} VS {enemy}"
];

const WAGER_BADGES = ["🎬 PHIM NGẮN TƯƠNG TÁC", "📖 TIỂU THUYẾT TRỰC TUYẾN", "🎭 TRASH TALK CỰC CĂNG", "🍿 RẠP CHIẾU PHIM TIKTOK"];

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let p1N = window.getRealCharName(window.p1, "HERO");
    let p2N = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "BOSS");

    let def1 = window.getCharDefObj(window.p1);
    let tt1 = (def1 && (def1.trashTalk || def1.quotes)) ? (def1.trashTalk || def1.quotes) : null;

    let rawChapter = r(DEFAULT_CHAPTERS);
    if (tt1) {
        if (Array.isArray(tt1.chapters) && tt1.chapters.length > 0) rawChapter = r(tt1.chapters);
        else if (tt1.chapterTitle) rawChapter = tt1.chapterTitle;
    }

    let formattedChapter = window.formatTrashLine(rawChapter, p1N, p2N);
    let pinnedHook = (typeof window.getRandomPinnedHook === 'function')
        ? window.getRandomPinnedHook()
        : "📌 Ghim: Số cuối % Pin của bạn là Chẵn hay Lẻ? Comment bên dưới nhé!";

    return {
        themeP1: r(THEMES),
        themeP2: r(THEMES),
        lore: { chapter: formattedChapter },
        badge: r(WAGER_BADGES),
        pinnedHook: pinnedHook
    };
};

window.strokeTextClean = function(ctx, text, x, y, fillCol, strokeCol, strokeW) {
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = strokeCol;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillCol;
    ctx.fillText(text, x, y);
};

// HÀM HIỂN THỊ ĐỦ 100% TÊN NHÂN VẬT DÀI TRÊN 1 HÀNG
window.strokeTextFit = function(ctx, text, x, y, maxW, baseSize, fillCol, strokeCol, strokeW, fontFace) {
    if (!text) return;
    ctx.save();
    let face = fontFace || "'Oswald', 'Arial Black', Arial, sans-serif";
    let fontSize = baseSize;
    ctx.font = `900 ${fontSize}px ${face}`;
    
    while (ctx.measureText(text).width > maxW && fontSize > 18) {
        fontSize -= 1;
        ctx.font = `900 ${fontSize}px ${face}`;
    }
    
    let measuredW = ctx.measureText(text).width;
    let scaleX = 1.0;
    if (measuredW > maxW && measuredW > 0) {
        scaleX = maxW / measuredW;
    }
    
    let dynamicStroke = Math.max(2.5, strokeW * (fontSize / baseSize) * Math.min(1, scaleX + 0.15));
    
    ctx.translate(x, y);
    if (scaleX < 1.0) {
        ctx.scale(scaleX, 1.0);
    }
    
    ctx.lineWidth = dynamicStroke;
    ctx.strokeStyle = strokeCol;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = fillCol;
    ctx.fillText(text, 0, 0);
    ctx.restore();
};

window.fitWebHudNames = function() {
    ["name-display-red", "name-display-blue"].forEach((id, idx) => {
        let el = document.getElementById(id);
        if (!el) return;
        let span = el.querySelector("span") || el;
        if (!span || span.tagName === "IMG") return;
        span.style.transform = "scaleX(1)";
        let parentHud = el.closest(".player-hud") || el.parentElement;
        if (!parentHud) return;
        let availW = parentHud.clientWidth - 52;
        let textW = span.scrollWidth;
        if (availW > 40 && textW > availW) {
            let ratio = Math.max(0.55, availW / textW);
            span.style.transformOrigin = (idx === 0) ? "left center" : "right center";
            span.style.transform = `scaleX(${ratio.toFixed(3)})`;
        }
    });
};

window.StoryModeAI = {
    viralTitle: "",
    generateStoryTitle: function(p1Name, p2Name) {
        const titles = [
            `KÈO GÁY KHÉT: ${p1Name} ĐẠI CHIẾN ${p2Name} VÀ CÁI KẾT 😱⚔️`,
            `KHI ${p1Name} GÁY SỚM TRƯỚC MẶT ${p2Name} 🔥`,
            `TRẬN CHIẾN TỶ ĐÔ: ${p1Name} QUYẾT TỬ VỚI ${p2Name} 💵`,
            `PHA LẬT KÈO KHÔNG TƯỞNG GIỮA ${p1Name} VÀ ${p2Name} 🤯`,
            `AI THUA XÓA ACC: ${p1Name} VS ${p2Name} 🎬`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return r(titles) + " #gaming #gamenhuclon #xuhuong #stickman";
    },
    generateViralPostKit: function(p1Name, p2Name) {
        const title = this.generateStoryTitle(p1Name || "NHÂN VẬT CHÍNH", p2Name || "BOSS");
        const pinnedComments = [
            `👇 GHIM: Số cuối % Pin điện thoại của bạn đang là Chẵn hay Lẻ? Chẵn = ${p1Name} thắng, Lẻ = ${p2Name} thắng! Điểm danh xem ai đoán chuẩn nào 🔋`,
            `👇 GHIM: Quả gáy khét của ${p1Name} trong trận này xứng đáng mấy điểm anh em? 😂`,
            `👇 GHIM: Có ai vừa giật mình tưởng điện thoại báo Pin Yếu hay Crush nhắn tin ở giây thứ 6 không? Khai thật đi 💀`,
            `👇 GHIM: Tập tiếp theo trên kênh @gamenhuclon anh em muốn cặp đấu nào lên sóng? Comment nhiều tim nhất mình làm luôn! 🏆`
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
// INTRO MANGA CỔ ĐIỂN HÚT VIEW: NHÂN VẬT MÚA VỚI BỘ LỌC CỔ ĐIỂN ÍT MÀU (GRAYSCALE + CONTRAST + SEPIA)
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
        // KHÔI PHỤC MÀU CỔ ĐIỂN ÍT MÀU HÚT VIEW NHƯ CŨ (Vẫn giữ nguyên thân thể, đạo cụ và điệu nhảy của nhân vật)
        ctx.filter = "grayscale(100%) contrast(200%) sepia(30%)";
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
            ctx.textAlign = "center";
            window.strokeTextFit(ctx, label, 0, 0, 480, 34, "#111", "#fff", 4);
            ctx.beginPath(); ctx.moveTo(-70, 14); ctx.lineTo(70, 14);
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
    window.strokeTextFit(ctx, prm.lore.chapter, w/2 + jitterX, 210 + jitterY, 980, 50, "#fff", "#000", 12);

    ctx.font = "bold 26px Arial, sans-serif";
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillText(window.CREATOR_HANDLE, w/2, 1830);

    ctx.restore();
};

// ==========================================
// HỘP THOẠI TRASH TALK TRONG KHOANG RIÊNG (Y = 885)
// ==========================================
window.drawCinematicQuoteInPanel = function(ctx, quote, elapsed, panelY, p1Url, p2Url) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 250) alpha = elapsed / 250;
    if (elapsed > quote.duration - 250) alpha = (quote.duration - elapsed) / 250;
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

    let spkCol = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    ctx.lineWidth = 5;
    ctx.strokeStyle = spkCol;
    if(ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX + jitter, boxY + jitter, boxW, boxH, 16); ctx.stroke(); 
    } else { 
        ctx.strokeRect(boxX + jitter, boxY + jitter, boxW, boxH); 
    }

    let faceSize = 130;
    let faceX = quote.speaker === "P1" ? boxX + 25 : boxX + boxW - faceSize - 25;
    let faceY = boxY + 30;
    
    let faceImgUrl = (quote.speaker === "P1" ? p1Url : p2Url) || quote.face;
    let faceImg = window.getSharedCachedImg(faceImgUrl);
    
    if (faceImg) {
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

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    window.strokeTextFit(ctx, "🎙️ " + speakerName, textStartX, boxY + 20, maxTextW, 27, spkCol, "#000", 6);
    
    let charsToShow = Math.floor((elapsed - 100) / 12); 
    if (charsToShow < 0) charsToShow = 0;
    let displayedText = quote.text.substring(0, charsToShow);
    
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 26px Arial, sans-serif";
    
    let words = displayedText.split(" ");
    let line = "";
    let lineY = boxY + 64;
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > maxTextW && i > 0) {
            ctx.fillText(line, textStartX, lineY);
            line = words[i] + " "; lineY += 35;
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

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    
    window.introTimer = 215;

    setTimeout(window.fitWebHudNames, 50);
    setTimeout(window.fitWebHudNames, 300);

    window.buildCharacterTrashTalk();
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
        window._gamePhaseStarted = true; 
        window.gamePhaseStartTime = elapsed;
        if (window.introTimer > 25 || window.introTimer <= 0) {
            window.introTimer = 22;
        }
    }

    if (isOutroActive && !window._gamePhaseEnded) {
        window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed;
    }

    // ==========================================
    // PHẦN 1: INTRO 3.2 GIÂY (NHÂN VẬT MÚA MÀU CỔ ĐIỂN Ở GIỮA, SỐ ĐẾM Ở DƯỚI CHÂN Y = 1520)
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
    // PHẦN 2: MÀN HÌNH COMBAT FULL MÀU RỰC RỠ + CACHED GRADIENTS
    // ==========================================
    if (renderNormalV) {
        ctxV.imageSmoothingEnabled = false;
        
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
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
            let gradKey = (window._impactColor === "#ff0050") ? "edgeRed" : "edgeCyan";
            if (!window._cachedGradients[gradKey]) {
                let eg = ctxV.createRadialGradient(540, splitGameHeight/2, 260, 540, splitGameHeight/2, 680);
                eg.addColorStop(0, "rgba(0,0,0,0)");
                eg.addColorStop(1, window._impactColor);
                window._cachedGradients[gradKey] = eg;
            }
            ctxV.globalAlpha = (window._impactFrames / 14) * 0.45;
            ctxV.fillStyle = window._cachedGradients[gradKey];
            ctxV.fillRect(0, 0, 1080, splitGameHeight);
            ctxV.globalAlpha = 1.0;
            window._impactFrames--;
        } else if (isClimaxTension) {
            if (!window._cachedGradients.tensionGrad) {
                let tg = ctxV.createRadialGradient(540, splitGameHeight/2, 280, 540, splitGameHeight/2, 720);
                tg.addColorStop(0, "rgba(255, 0, 0, 0)");
                tg.addColorStop(1, "rgba(255, 0, 40, 1)");
                window._cachedGradients.tensionGrad = tg;
            }
            let tensionPulse = Math.abs(Math.sin(now / 200));
            ctxV.globalAlpha = 0.35 * tensionPulse;
            ctxV.fillStyle = window._cachedGradients.tensionGrad;
            ctxV.fillRect(0, 0, 1080, splitGameHeight);
            ctxV.globalAlpha = 1.0;
        }

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 25) | 0; ctxV.globalAlpha = 0.3;
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        ctxV.restore();

        // KÍCH HOẠT TRASH TALK ĐỐI ĐÁP THEO % MÁU
        if (!window._activeQuote && !window.gameOver && window._gamePhaseStarted) {
            let minHpNow = Math.min(p1HpPct, p2HpPct);
            for (let q of window._storyQuotes) {
                if (!q.triggered && minHpNow <= q.triggerHp && minHpNow > 0) {
                    q.triggered = true;
                    window._activeQuote = q;
                    window._activeQuoteStartTime = now;
                    window.playViralSfx("noti");
                    break;
                }
            }
        }

        // NỀN NỬA DƯỚI MÀN HÌNH
        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        if (!window._cachedGradients.botGrad) {
            let bg = ctxV.createLinearGradient(0, retainY, 0, 1920);
            bg.addColorStop(0, "#080b12");
            bg.addColorStop(1, "#151122");
            window._cachedGradients.botGrad = bg;
        }
        ctxV.fillStyle = window._cachedGradients.botGrad; 
        ctxV.fillRect(0, retainY, 1080, retainHeight); 
        
        if (!isOutroActive) {
            let p1Name = window.getRealCharName(window.p1, "PLAYER");
            let eName = repEnemyObj ? window.getRealCharName(repEnemyObj, "BOSS") : "BOSS";

            // 1. THANH TIẾN ĐỘ ĐỎ (Y = 609 -> 654)
            let bannerY = retainY + 2; 
            ctxV.fillStyle = "#1e293b"; ctxV.fillRect(0, bannerY, 1080, 45); 
            let matchSecs = (now - window.gamePhaseStartTime) / 1000;
            let fakeProgress = Math.min(0.99, (matchSecs / 60) + (1 - p1HpPct)*0.3 + (1 - p2HpPct)*0.4);
            ctxV.fillStyle = "#ff0050"; 
            ctxV.fillRect(0, bannerY, 1080 * fakeProgress, 45); 
            ctxV.font = "900 24px 'Arial Black', sans-serif"; 
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            let loadingText = `🔥 ĐANG NẠP CÚ CHỐT... ${Math.floor(fakeProgress * 100)}% 🔥`;
            window.strokeTextClean(ctxV, loadingText, 540, bannerY + 22, "#ffffff", "#000000", 5);

            // 2. THANH MÁU & TÊN NHÂN VẬT (HIỂN THỊ ĐỦ 100% TÊN DÀI TRÊN 1 HÀNG)
            if (window.p1) {
                let p1Stam = Math.max(0, window.p1.stamina / 100);
                let eStam = repEnemyObj ? Math.max(0, repEnemyObj.stamina / 100) : 0;

                let img1 = window.getSharedCachedImg(p1Url);
                let img2 = window.getSharedCachedImg(p2Url); 
                let hudBaseY = splitGameHeight + 118; 
                let avRadius = 52;
                
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
                    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.22)";
                    if(ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.stroke(); }
                    ctx.restore();
                };

                let p1Cx = 86, p1Cy = hudBaseY;
                let p1BarX = 152;
                if (img1) { 
                    ctxV.save(); ctxV.beginPath(); ctxV.arc(p1Cx, p1Cy, avRadius, 0, Math.PI*2); ctxV.clip(); 
                    ctxV.drawImage(img1, p1Cx-avRadius, p1Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                }
                ctxV.beginPath(); ctxV.arc(p1Cx, p1Cy, avRadius, 0, Math.PI*2);
                ctxV.lineWidth = 6; ctxV.strokeStyle = "#00f3ff"; ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 12; ctxV.stroke();
                ctxV.shadowBlur = 0;

                if(!window._cachedGradients.hpP1) { window._cachedGradients.hpP1 = ctxV.createLinearGradient(p1BarX, 0, p1BarX+330, 0); window._cachedGradients.hpP1.addColorStop(0, "#00f2fe"); window._cachedGradients.hpP1.addColorStop(1, "#4facfe"); }
                drawPillBar(ctxV, p1BarX, p1Cy + 6, 330, 24, window._cachedGradients.hpP1, p1HpPct, false);
                drawPillBar(ctxV, p1BarX, p1Cy + 36, 210, 8, "#ffeb3b", p1Stam, false);

                ctxV.textAlign = "left"; 
                ctxV.textBaseline = "middle";
                window.strokeTextFit(ctxV, p1Name, p1BarX, p1Cy - 20, 365, 25, "#ffffff", "#000000", 6);

                if (repEnemyObj) {
                    let p2Cx = 994, p2Cy = hudBaseY;
                    let p2BarRight = 928;
                    if (img2) { 
                        ctxV.save(); ctxV.beginPath(); ctxV.arc(p2Cx, p2Cy, avRadius, 0, Math.PI*2); ctxV.clip(); 
                        ctxV.drawImage(img2, p2Cx-avRadius, p2Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                    }
                    ctxV.beginPath(); ctxV.arc(p2Cx, p2Cy, avRadius, 0, Math.PI*2);
                    ctxV.lineWidth = 6; ctxV.strokeStyle = "#ff003c"; ctxV.shadowColor = "#ff003c"; ctxV.shadowBlur = 12; ctxV.stroke();
                    ctxV.shadowBlur = 0;

                    if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(p2BarRight-330, 0, p2BarRight, 0); window._cachedGradients.hpP2.addColorStop(0, "#ffb199"); window._cachedGradients.hpP2.addColorStop(1, "#ff0844"); }
                    drawPillBar(ctxV, p2BarRight - 330, p2Cy + 6, 330, 24, window._cachedGradients.hpP2, p2HpPct, true);
                    drawPillBar(ctxV, p2BarRight - 210, p2Cy + 36, 210, 8, "#ffeb3b", eStam, true);

                    ctxV.textAlign = "right"; 
                    ctxV.textBaseline = "middle";
                    window.strokeTextFit(ctxV, eName, p2BarRight, p2Cy - 20, 365, 25, "#ffffff", "#000000", 6);
                }

                ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = "italic 900 44px 'Impact'";
                window.strokeTextClean(ctxV, "VS", 540, hudBaseY + 16, "#fff", "#000", 9);
            }

            // 3. SÀN ĐẶT CƯỢC ĐIỂM THƯỞNG
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

            // 4. KHOANG TRUNG TÂM (Y = 885 -> 1075): TRASH TALK / QUÀ TẶNG / MINI-GAME % PIN
            let storyPanelY = splitGameHeight + 278;
            if (window._activeQuote) {
                let elapsedQuote = now - window._activeQuoteStartTime;
                if (elapsedQuote < window._activeQuote.duration) {
                    window.drawCinematicQuoteInPanel(ctxV, window._activeQuote, elapsedQuote, storyPanelY, p1Url, p2Url);
                } else {
                    window._activeQuote = null;
                }
            } else {
                if (!window._activeGift && elapsed > 7000 && Math.random() < 0.012 && !window.gameOver && typeof window.getRandomLiveGift === 'function') {
                    window._activeGift = window.getRandomLiveGift();
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

                if (window._activeGift && (now - window._activeGift.startTime < 2600)) {
                    let gElapsed = now - window._activeGift.startTime;
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
                        let pulseCTA = 1 + Math.abs(Math.sin(now / 150)) * 0.05;
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
                            window.strokeTextFit(ctxV, `Số Chẵn = ${p1Name} Thắng  |  Số Lẻ = ${eName} Thắng 👇`, 0, 24, 830, 22, "#ffffff", "#000", 3, "Arial");
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

            // 5. KHUNG LIVE CHAT (GỌI DỮ LIỆU TỪ LIVECHAT.JS)
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
            
            ctxV.save(); ctxV.rotate(-0.10); ctxV.font = "900 68px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            ctxV.fillStyle = "rgba(255, 255, 255, 0.045)"; ctxV.fillText(window.CREATOR_HANDLE, 0, 0); ctxV.restore();

            ctxV.fillStyle = "rgba(30, 41, 59, 0.85)";
            ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 54);
            ctxV.font = "bold 21px Arial"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; 
            window.strokeTextClean(ctxV, window.introParams.pinnedHook, -boxWidth/2 + 22, -boxHeight/2 + 27, "#ffeb3b", "#000", 4);
            
            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 56, boxWidth, boxHeight - 56); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 40; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 30px Arial"; let headerBottomY = -boxHeight/2 + 56; 
            
            if (!window._chatSystemInit && typeof window.generateLiveChatEvent === 'function') {
                window._chatSystemInit = true;
                window._liveChats = [];
                window._lastChatUpdate = now;
                window._nextChatDelay = 1000;
                for (let i = 0; i < 8; i++) {
                    let c = window.generateLiveChatEvent("normal");
                    window.precalcChatText(c, ctxV);
                    window._liveChats.push(c);
                }
            }

            if (window._liveChats) {
                for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                    let chat = window._liveChats[i];
                    if (!chat || !chat.lines) continue;
                    let nameStr = chat.name + ":"; 
                    let msgCol = chat.isHighlight ? "#ffeb3b" : "#ffffff";
                    for (let l = chat.lines.length - 1; l >= 0; l--) {
                        if (currentY - lineHeight < headerBottomY - 5) break;
                        if (l === 0) { 
                            window.strokeTextClean(ctxV, nameStr, -boxWidth/2 + 25, currentY, chat.color, "#000", 5);
                            window.strokeTextClean(ctxV, " " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY, msgCol, "#000", 5);
                        } else { 
                            window.strokeTextClean(ctxV, " " + chat.lines[l], -boxWidth/2 + 25 + chat.nameWidth, currentY, msgCol, "#000", 5);
                        }
                        currentY -= lineHeight; 
                    }
                    if (currentY - lineHeight < headerBottomY - 5) break;
                    currentY -= 12; 
                }
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
            // OUTRO STORYBOOK: ĐỒNG BỘ MÀU CỔ ĐIỂN VỚI INTRO ĐỂ LẬT TRANG LOOP MƯỢT 100%
            // ==========================================
            let outroAlpha = Math.min(1, (window.matchEndTimer - 85) / 35); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            
            if (!window._outroQuotesC) {
                window._outroQuotesC = window.buildCharacterOutroQuote();
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
                    // Đồng bộ bộ lọc cổ điển ít màu như Intro
                    ctxV.filter = "grayscale(100%) contrast(200%) sepia(30%)";
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
                    ctxV.textAlign = "center";
                    window.strokeTextFit(ctxV, "🏆 MVP: " + winnerName, 0, 0, 480, 28, "#111", "#fff", 4);
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

    // CẬP NHẬT TIN NHẮN MỚI TỪ LIVECHAT.JS
    if (typeof window.generateLiveChatEvent === 'function') {
        let isBaitActive = (window._baitTriggered && window._baitType !== -1);
        let isUltZoom = (window.isCinematicActive || (window.targetZoom && window.targetZoom > 1.1));
        let isHypeMoment = (window._impactFrames > 5 || window._activeQuote != null || isClimaxTension || isBaitActive || isUltZoom);
        let dynamicDelay = isHypeMoment ? (180 + Math.random() * 250) : (950 + Math.random() * 1600); 

        if (now - window._lastChatUpdate > dynamicDelay) { 
            window._lastChatUpdate = now; 
            window._nextChatDelay = dynamicDelay; 
            
            let ctxType = isBaitActive ? "bait" : ((isClimaxTension || isUltZoom) ? "climax" : "normal");
            let newChat = window.generateLiveChatEvent(ctxType);
            window.precalcChatText(newChat, ctxV);
            window._liveChats.push(newChat); 
            if (window._liveChats.length > 12) window._liveChats.shift(); 
            
            let viewChange = isHypeMoment ? Math.floor(Math.random() * 100) : (Math.floor(Math.random() * 41) - 15);
            window._fakeViewers += viewChange;
            if (window._fakeViewers < 300) window._fakeViewers += Math.floor(Math.random() * 50);
            if (window._fakeViewers > 3500) window._fakeViewers -= Math.floor(Math.random() * 50); 
        }
    }

    if (!isOutroActive && elapsed >= window.introDuration && now - window._lastAlertTime > 2800 + Math.random() * 3000) { 
        window._lastAlertTime = now; 
        if (window._liveAlerts.length < 2 && typeof window.getRandomLiveAlert === 'function') {
            window._liveAlerts.push({ text: window.getRandomLiveAlert(), life: 1.0, yOffset: 0 }); 
        }
    }

    if (!isOutroActive && elapsed >= window.introDuration) {
        let alertStartX = 16; let alertStartY_Left = splitGameHeight - 16;
        for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
            let al = window._liveAlerts[i]; al.life -= 0.015; al.yOffset += 1.4; ctxV.save(); 
            ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 2.0)); ctxV.font = "bold 20px Arial"; 
            let textW = ctxV.measureText(al.text).width; ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
            ctxV.fillStyle = "rgba(0, 0, 0, 0.7)"; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -18, textW + 28, 36, 18); ctxV.fill(); } else { ctxV.fillRect(0, -18, textW + 28, 36); } 
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 14, 0); ctxV.restore(); 
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        if (typeof window._fakeViewers !== "undefined") {
            ctxV.save(); let badgeY = splitGameHeight - 28; let badgeX = 1064; 
            ctxV.font = "bold 20px 'Arial Black'"; let viewStr = "👁️ " + window._fakeViewers.toLocaleString(); let viewW = ctxV.measureText(viewStr).width;
            ctxV.fillStyle = "rgba(0, 0, 0, 0.65)";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 20, badgeY - 17, viewW + 20, 34, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 20, badgeY - 17, viewW + 20, 34); }
            ctxV.textAlign = "right"; ctxV.textBaseline = "middle"; 
            window.strokeTextClean(ctxV, viewStr, badgeX - 10, badgeY, "#fff", "#000", 3);
            let liveW = 72; ctxV.fillStyle = (Math.floor(now/500)%2===0) ? "#ff0050" : "#d90040";
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(badgeX - viewW - 20 - liveW - 5, badgeY - 17, liveW, 34, 8); ctxV.fill(); } else { ctxV.fillRect(badgeX - viewW - 20 - liveW - 5, badgeY - 17, liveW, 34); }
            ctxV.textAlign = "center"; 
            window.strokeTextClean(ctxV, "LIVE", badgeX - viewW - 20 - liveW/2 - 5, badgeY + 1, "#fff", "#000", 3);
            ctxV.restore();
        }
    }

    drawBaitSạn(ctxV, 1080, splitGameHeight);

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

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
