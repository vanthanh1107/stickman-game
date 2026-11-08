// ==========================================
// RECORDER.JS - V97.0 CLEAN VINTAGE & ALGORITHM SAFE-ZONE EDITION (@gamenhuclone)
// TỐI ƯU ĐẶC BIỆT CHO TIKTOK & YOUTUBE SHORTS:
// 1. Intro Cổ Điển Tối Giản (Clean Vintage): Giữ màu nhân vật ít màu hút view, loại bỏ chữ rối mắt, tập trung 100% vào vũ đạo.
// 2. Chuẩn Safe-Zone (Y: 180 -> 1480): Không bị nút Like/Share hay Caption của TikTok & YouTube Shorts che mất chữ.
// 3. Tối ưu Frame-0 Thumbnail & Nhịp nhún Camera theo nhạc (Beat-Bounce).
// 4. Giữ nguyên toàn bộ tính năng trong trận: Check VAR, Khung hình ẩn 0.05s, Trash Talk theo tướng & Seamless Loop.
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "@gamenhuclone"; 

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

window._varCheckActive = false;
window._varCheckStartTime = 0;
window._varCheckTriggered = false;

window._gamePhaseStarted = false; window._gamePhaseEnded = false;
window.gamePhaseStartTime = 0; window.gamePhaseEndTime = 0;

window._lastP1Hp = 1; window._lastP2Hp = 1;
window._impactFrames = 0; window._impactIntensity = 0; window._impactColor = "#ffffff";

window._storyQuotes = [];
window._activeQuote = null;
window._activeQuoteStartTime = 0;

window.avatarImageCache = window.avatarImageCache || window.hudImages || {};
window.hudImages = window.avatarImageCache;

window.getSharedCachedImg = window.getSharedCachedImg || function(url) {
    if (!url) return null;
    let cached = window.avatarImageCache[url];
    if (cached && cached.complete && cached.naturalWidth > 0) {
        return cached;
    }
    let resolvedUrl = (typeof window.resolveImageUrl === "function") ? window.resolveImageUrl(url) : url;
    if (resolvedUrl && resolvedUrl !== url) {
        cached = window.avatarImageCache[resolvedUrl];
        if (cached && cached.complete && cached.naturalWidth > 0) {
            window.avatarImageCache[url] = cached;
            return cached;
        }
    }
    if (!cached || (cached.complete && cached.naturalWidth === 0 && !cached._retryDone)) {
        let img = new Image();
        if (typeof resolvedUrl === "string" && (resolvedUrl.startsWith("http://") || resolvedUrl.startsWith("https://"))) {
            img.crossOrigin = "Anonymous";
        }
        img._retryDone = true;
        img.src = resolvedUrl;
        window.avatarImageCache[url] = img;
        if (resolvedUrl !== url) window.avatarImageCache[resolvedUrl] = img;
    }
    return null;
};

// HỆ THỐNG ÂM THANH SYNTH SFX THU TRỰC TIẾP VÀO VIDEO (ZERO-LEAK MASTER BUS)
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();

window.playViralSfx = function(type) {
    if (window.isMuted || !window.audioCtx || !window.masterRecordDestination) return;
    try {
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        const now = window.audioCtx.currentTime;
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc._internalMasterConnect = true;
        gain._internalMasterConnect = true;
        osc.connect(gain);
        if (typeof window.ensureMasterAudioBus === 'function') {
            gain.connect(window.ensureMasterAudioBus());
        } else {
            gain.connect(window.masterRecordDestination);
            gain.connect(window.audioCtx.destination);
        }
        osc.onended = function() {
            try { osc.disconnect(); gain.disconnect(); } catch (e) {}
        };

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
        .replace(/\{opp\}/gi, enemyName)
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

    if (typeof window.shuffleTrashTalk === 'function') {
        p1Lines = window.shuffleTrashTalk(p1Lines);
        p2Lines = window.shuffleTrashTalk(p2Lines);
    }
    let startIdx1 = Math.floor(Math.random() * p1Lines.length);
    let startIdx2 = Math.floor(Math.random() * p2Lines.length);

    const pickLine = (arr, idx, myN, oppN) => {
        let raw = arr[idx % arr.length];
        return window.formatTrashLine(raw, myN, oppN);
    };

    let rawP1Av = (def1 && def1.avatarUrl) || (p1Obj && p1Obj.avatarUrl) || "character/picture/billgates.png";
    let rawP2Av = (def2 && def2.avatarUrl) || (p2Obj && p2Obj.avatarUrl) || "character/picture/spiderman.png";
    let p1Avatar = (typeof window.resolveImageUrl === 'function') ? window.resolveImageUrl(rawP1Av) : rawP1Av;
    let p2Avatar = (typeof window.resolveImageUrl === 'function') ? window.resolveImageUrl(rawP2Av) : rawP2Av;

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
        { c: `Out trình hoàn toàn!`, s: `${p1N} vừa dạy cho ${p2N} một bài học nhớ đời. Ai đặt cửa ${p1N} điểm danh nhận thưởng!` }
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
    "KÈO CĂNG: {me} VS {enemy}",
    "AI THUA XÓA ACC: {me} VS {enemy}",
    "ĐẠI CHIẾN ĐỈNH CAO: {me} VS {enemy}"
];

// CÂU HOOK NGẮN GỌN, ĐỌC XONG TRONG 0.5 GIÂY (TỐI ƯU THUẬT TOÁN GIỮ CHÂN TIKTOK & SHORTS)
const CLEAN_HOOK_BANNERS = [
    "⚡ 99% NGƯỜI XEM ĐOÁN SAI KẾT QUẢ!",
    "🔥 ĐỪNG CHỚP MẮT Ở GIÂY CUỐI CÙNG!",
    "👀 KÈO NÀY AI NẰM SÀN TRƯỚC?",
    "👑 PHA LẬT KÈO 1 MÁU KHÔNG TƯỞNG!",
    "💎 ĐẶT CỬA ĐI ANH EM: TRÁI HAY PHẢI?"
];

const SHORT_TRAIT_TAGS = [
    "🔥 HỆ TẤT TAY",
    "⚡ TỐC ĐỘ ÁNH SÁNG",
    "👑 ỨNG CỬ VIÊN VÔ ĐỊCH",
    "💎 HỆ ĐẬP TIỀN",
    "🌪️ THÁNH NÉ ĐÒN",
    "🥊 CÚ ĐẤM NGÀN CÂN"
];

const VS_SHORT_ODDS = [
    { p1Tag: "👑 TỈ LỆ THẮNG: 99%", p2Tag: "🎲 TỈ LỆ THẮNG: 1%" },
    { p1Tag: "🌾 HỆ CÀY CHAY", p2Tag: "💎 HỆ NẠP VIP" },
    { p1Tag: "🔥 KÈO TRÊN", p2Tag: "⚡ KÈO DƯỚI LẬT KÈO" }
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

    let t1 = r(SHORT_TRAIT_TAGS);
    let t2 = r(SHORT_TRAIT_TAGS);
    while (t2 === t1) t2 = r(SHORT_TRAIT_TAGS);

    return {
        themeP1: r(THEMES),
        themeP2: r(THEMES),
        lore: {
            chapter: formattedChapter,
            subHook: r(CLEAN_HOOK_BANNERS),
            p1Trait: t1,
            p2Trait: t2,
            vsOdds: r(VS_SHORT_ODDS)
        },
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

// HÀM HIỂN THỊ ĐỦ 100% TÊN NHÂN VẬT DÀI TRÊN 1 HÀNG (CACHED ZERO-LOOP MEASURE)
window._strokeFitCache = new Map();
window.strokeTextFit = function(ctx, text, x, y, maxW, baseSize, fillCol, strokeCol, strokeW, fontFace) {
    if (!text) return;
    let face = fontFace || "'Oswald', 'Arial Black', Arial, sans-serif";
    let key = face + '|' + baseSize + '|' + maxW + '|' + strokeW + '|' + text;
    let fit = window._strokeFitCache.get(key);
    if (!fit) {
        if (window._strokeFitCache.size >= 256) {
            let firstK = window._strokeFitCache.keys().next().value;
            if (firstK !== undefined) window._strokeFitCache.delete(firstK);
        }
        let fontSize = baseSize;
        ctx.save();
        ctx.font = `900 ${fontSize}px ${face}`;
        let measuredW = ctx.measureText(text).width;
        if (measuredW > maxW && measuredW > 0) {
            fontSize = Math.max(18, Math.floor(baseSize * (maxW / measuredW)));
            ctx.font = `900 ${fontSize}px ${face}`;
            measuredW = ctx.measureText(text).width;
            while (measuredW > maxW && fontSize > 18) {
                fontSize -= 1;
                ctx.font = `900 ${fontSize}px ${face}`;
                measuredW = ctx.measureText(text).width;
            }
        }
        ctx.restore();
        let scaleX = (measuredW > maxW && measuredW > 0) ? (maxW / measuredW) : 1.0;
        let dynamicStroke = Math.max(2.5, strokeW * (fontSize / baseSize) * Math.min(1, scaleX + 0.15));
        fit = { fontStr: `900 ${fontSize}px ${face}`, scaleX: scaleX, dynamicStroke: dynamicStroke };
        window._strokeFitCache.set(key, fit);
    }

    ctx.save();
    ctx.font = fit.fontStr;
    ctx.translate(x, y);
    if (fit.scaleX < 1.0) {
        ctx.scale(fit.scaleX, 1.0);
    }
    ctx.lineWidth = fit.dynamicStroke;
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
    viralHeadline: "",
    viralTags: "",
    _recentTitleIndices: [],
    _recentTagClusterIdx: -1,
    MAX_YOUTUBE_CHARS: 100,

    SHORT_NAME_MAP: {
        "ronaldo": "Ronaldo",
        "cristiano ronaldo": "Ronaldo",
        "messi": "Messi",
        "lionel messi": "Messi",
        "neymar": "Neymar",
        "neymar jr": "Neymar",
        "mbappe": "Mbappe",
        "kylian mbappe": "Mbappe",
        "haaland": "Haaland",
        "erling haaland": "Haaland",
        "lamineyamal": "Yamal",
        "lamine yamal": "Yamal",
        "vozinha": "Ronaldo Jr",
        "cristiano ronaldo jr": "Ronaldo Jr",
        "cristiano jr": "Ronaldo Jr",
        "mtp": "Sơn Tùng MTP",
        "sơn tùng m-tp": "Sơn Tùng MTP",
        "phuonghang": "Bà Hằng",
        "bà phương hằng": "Bà Hằng",
        "muoikho": "Mười Khó",
        "mười khó": "Mười Khó",
        "jonny": "Johnny Trí Nguyễn",
        "jonnytringuyen": "Johnny Trí Nguyễn",
        "johnny trí nguyễn": "Johnny Trí Nguyễn",
        "elonmusk": "Elon Musk",
        "elon musk": "Elon Musk",
        "billgates": "Bill Gates",
        "bill gates": "Bill Gates",
        "stevejobs": "Steve Jobs",
        "steve jobs": "Steve Jobs",
        "donaldtrump": "Trump",
        "donald trump": "Trump",
        "therock": "The Rock",
        "the rock": "The Rock",
        "spiderman": "Spider-Man",
        "spider-man": "Spider-Man",
        "domixi": "Độ Mixi",
        "độ mixi": "Độ Mixi",
        "do mixi": "Độ Mixi",
        "nguyenvanhien": "Nguyễn Văn Hiến",
        "nguyễn văn hiến": "Nguyễn Văn Hiến",
        "nguyen van hien": "Nguyễn Văn Hiến",
        "hdpe": "Nguyễn Văn Hiến"
    },

    CHARACTER_HASHTAG_MAP: {
        "ronaldo": ["#ronaldo", "#cr7"],
        "messi": ["#messi", "#goat"],
        "neymar": ["#neymar", "#bongda"],
        "mbappe": ["#mbappe", "#bongda"],
        "haaland": ["#haaland", "#bongda"],
        "lamineyamal": ["#yamal", "#bongda"],
        "vozinha": ["#ronaldojr", "#cr7"],
        "mtp": ["#sontungmtp", "#mtp"],
        "phuonghang": ["#baphuonghang", "#drama"],
        "muoikho": ["#muoikho", "#haihuoc"],
        "jonny": ["#johnnytringuyen", "#vothuat"],
        "jonnytringuyen": ["#johnnytringuyen", "#vothuat"],
        "elonmusk": ["#elonmusk", "#typhu"],
        "billgates": ["#billgates", "#typhu"],
        "stevejobs": ["#stevejobs", "#apple"],
        "donaldtrump": ["#trump", "#usa"],
        "therock": ["#therock", "#wwe"],
        "spiderman": ["#spiderman", "#marvel"],
        "domixi": ["#domixi", "#mixigaming"],
        "nguyenvanhien": ["#hdpe", "#nguyenvanhien"]
    },

    formatShortViralName: function(rawName) {
        if (!rawName) return "Cao Thủ";
        let clean = String(rawName).replace(/\([^)]*\)/g, "").trim();
        let low = clean.toLowerCase();
        if (this.SHORT_NAME_MAP[low]) return this.SHORT_NAME_MAP[low];
        for (let k in this.SHORT_NAME_MAP) {
            if (low.includes(k)) return this.SHORT_NAME_MAP[k];
        }
        return clean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ").slice(0, 14);
    },

    getDailyTrendContext: function() {
        let now = new Date();
        let day = now.getDay(); // 0 = CN, 1 = T2 ... 6 = T7
        let hour = now.getHours();
        let dateStr = `${now.getDate()}/${now.getMonth() + 1}`;

        const dayLabels = [
            "Chủ Nhật rực lửa",
            "Đầu tuần căng đét",
            "Tâm điểm Thứ 3",
            "Kèo nóng Thứ 4",
            "Tâm điểm Thứ 5",
            "Thứ 6 bùng nổ",
            "Siêu kinh điển Thứ 7"
        ];
        let timeHook = "hôm nay";
        if (hour >= 5 && hour < 11) timeHook = "sáng nay";
        else if (hour >= 11 && hour < 17) timeHook = "chiều nay";
        else if (hour >= 17 && hour < 23) timeHook = "tối nay";
        else timeHook = "đêm nay";

        return {
            dayLabel: dayLabels[day] || "Tâm điểm hôm nay",
            timeHook: timeHook,
            dateStr: dateStr
        };
    },

    slugifyTag: function(str) {
        if (!str) return "";
        return "#" + String(str)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/gi, "d")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
    },

    getCharSpecificTags: function(charNameOrId) {
        if (!charNameOrId) return [];
        let raw = String(charNameOrId).toLowerCase().trim();
        let slug = this.slugifyTag(raw).slice(1);
        for (let key in this.CHARACTER_HASHTAG_MAP) {
            if (raw.includes(key) || slug.includes(key)) {
                return this.CHARACTER_HASHTAG_MAP[key];
            }
        }
        if (window.classStats) {
            for (let cid in window.classStats) {
                let st = window.classStats[cid];
                let stName = String((st && (st.className || st.name)) || "").toLowerCase();
                if (stName === raw || cid.toLowerCase() === raw) {
                    let mapped = this.CHARACTER_HASHTAG_MAP[cid.toLowerCase()];
                    if (mapped) return mapped;
                }
            }
        }
        let autoTag = this.slugifyTag(this.formatShortViralName(charNameOrId));
        return (autoTag && autoTag.length > 2) ? [autoTag.slice(0, 12)] : [];
    },

    generateViralHeadline: function(p1Name, p2Name) {
        let n1 = this.formatShortViralName(p1Name || "Hero");
        let n2 = this.formatShortViralName(p2Name || "Boss");
        let trend = this.getDailyTrendContext();

        // Bộ tiêu đề siêu cô đọng (38 - 54 ký tự), cập nhật theo xu hướng từng ngày & khung giờ thực tế
        const templates = [
            // 1. Xu hướng theo ngày / khung giờ thực tế
            `${trend.dayLabel}: ${n1} vs ${n2} ai nằm sàn? 🔥`,
            `Kèo căng ${trend.timeHook}: ${n1} đại chiến ${n2}! ⚔️`,
            `Tâm điểm ${trend.dateStr}: ${n1} quyết tử ${n2} 👑`,
            `Kèo hot ${trend.timeHook}: ${n1} đụng độ ${n2} cực gắt 💥`,

            // 2. Gáy sớm & Nghiệp quật (Trash-Talk Hook)
            `Gáy sớm ăn gì? ${n1} cà khịa ${n2} và cái kết 💀`,
            `Đấu khẩu cực gắt: ${n1} vs ${n2} câu cuối chí mạng 🎙️`,
            `Vừa mở mồm khịa, ${n1} bị ${n2} bật nộ dạy dỗ! ⚡`,
            `Màn cà khịa căng nhất ${trend.timeHook}: ${n1} vs ${n2} 🤣`,

            // 3. Plot Twist & Lật kèo phút 90 (Giữ chân 100% thời lượng)
            `Đừng chớp mắt! ${n1} lật kèo 1 máu trước ${n2} 🤯`,
            `99% đoán sai người thắng kèo ${n1} vs ${n2}! 👀`,
            `Giây cuối nổi da gà! ${n1} bật ngược ${n2} phút 90 🔥`,
            `Tưởng thua mà ${n1} tung chiêu cuối hạ gục ${n2}! 😱`,

            // 4. Check VAR & Bắt khung hình 0.05s (Kéo bình luận)
            `Check VAR gấp kèo ${n1} vs ${n2}: Kỹ năng hay Hack? 🚨`,
            `Đố ai dừng đúng 0.05s lúc ${n1} tung tuyệt kỹ! 📸`,
            `Kèo xóa acc ${trend.timeHook}: ${n1} hay ${n2} khóc? 😭`,
            `Phe ${n1} hay Phe ${n2}? Xem kết quả cuối trận! 🏆`
        ];

        let compactTemplates = templates.map((tpl, idx) => {
            if (tpl.length <= 58) return tpl;
            const shortFallbacks = [
                `${n1} vs ${n2}: Pha lật kèo chấn động ${trend.timeHook}! 🔥`,
                `Kèo căng ${trend.timeHook}: ${n1} đại chiến ${n2}! ⚔️`,
                `Gáy sớm ăn gì? ${n1} vs ${n2} và cái kết 💀`,
                `Đừng chớp mắt! ${n1} lật kèo 1 máu ${n2} 🤯`,
                `Check VAR gấp: ${n1} vs ${n2} ai nằm sàn? 🚨`,
                `99% đoán sai kết quả ${n1} vs ${n2}! 👀`
            ];
            return shortFallbacks[idx % shortFallbacks.length];
        });

        let candidates = [];
        for (let i = 0; i < compactTemplates.length; i++) {
            if (!this._recentTitleIndices.includes(i) && compactTemplates[i] !== this._lastHeadlineText) {
                candidates.push(i);
            }
        }
        if (candidates.length === 0) {
            this._recentTitleIndices = [];
            for (let i = 0; i < compactTemplates.length; i++) {
                if (compactTemplates[i] !== this._lastHeadlineText) candidates.push(i);
            }
            if (candidates.length === 0) candidates.push(0);
        }

        let pickIdx = candidates[Math.floor(Math.random() * candidates.length)];
        this._recentTitleIndices.push(pickIdx);
        if (this._recentTitleIndices.length > 8) this._recentTitleIndices.shift();

        let headline = compactTemplates[pickIdx];
        this._lastHeadlineText = headline;
        return headline;
    },

    generateViralHashtags: function(p1Name, p2Name, p1Id, p2Id, maxBudgetChars) {
        let budget = (typeof maxBudgetChars === "number" && maxBudgetChars > 15) ? maxBudgetChars : 42;
        const coreClusters = [
            ["#shorts", "#xuhuong", "#fyp", "#stickman", "#gamenhuclone"],
            ["#shorts", "#xuhuong", "#viral", "#gamehay", "#gamenhuclone"],
            ["#shorts", "#fyp", "#xuhuongtiktok", "#pk", "#gamenhuclone"],
            ["#shorts", "#xuhuong", "#trending", "#haihuoc", "#stickman"],
            ["#shorts", "#viral", "#xuhuong", "#keocang", "#gamenhuclone"]
        ];
        let clusterIdx = Math.floor(Math.random() * coreClusters.length);
        if (clusterIdx === this._recentTagClusterIdx && coreClusters.length > 1) {
            clusterIdx = (clusterIdx + 1) % coreClusters.length;
        }
        this._recentTagClusterIdx = clusterIdx;

        let p1Tags = this.getCharSpecificTags(p1Id || p1Name);
        let p2Tags = this.getCharSpecificTags(p2Id || p2Name);
        let cluster = coreClusters[clusterIdx];

        // Ưu tiên #shorts + #xuhuong + tag riêng của 2 tướng + tag xu hướng trong đúng giới hạn ký tự còn lại
        let ordered = [
            cluster[0], // #shorts
            cluster[1], // #xuhuong / #fyp
            p1Tags[0] || "",
            p2Tags[0] || "",
            cluster[2],
            cluster[3],
            cluster[4],
            p1Tags[1] || "",
            p2Tags[1] || ""
        ];

        let chosen = [];
        let seen = new Set();
        let currentLen = 0;
        for (let i = 0; i < ordered.length; i++) {
            let t = String(ordered[i] || "").trim();
            if (!t) continue;
            let low = t.toLowerCase();
            if (seen.has(low)) continue;
            let addedLen = chosen.length === 0 ? t.length : (currentLen + 1 + t.length);
            if (addedLen <= budget) {
                seen.add(low);
                chosen.push(t);
                currentLen = addedLen;
            }
        }
        if (chosen.length === 0) return "#shorts #xuhuong";
        return chosen.join(" ");
    },

    buildCompactViralPack: function(p1Name, p2Name, p1Obj, p2Obj) {
        let headline = this.generateViralHeadline(p1Name, p2Name);
        let p1Id = (p1Obj && p1Obj.classId) || p1Name;
        let p2Id = (p2Obj && p2Obj.classId) || p2Name;
        let remainingForTags = Math.max(22, this.MAX_YOUTUBE_CHARS - headline.length - 1);
        let tags = this.generateViralHashtags(p1Name, p2Name, p1Id, p2Id, remainingForTags);
        let full = `${headline} ${tags}`.trim();
        if (full.length > this.MAX_YOUTUBE_CHARS) {
            // Đảm bảo tuyệt đối 100% không bao giờ vượt quá 100 ký tự của YouTube Shorts
            let tagParts = tags.split(/\s+/);
            while (tagParts.length > 2 && (`${headline} ${tagParts.join(" ")}`).length > this.MAX_YOUTUBE_CHARS) {
                tagParts.pop();
            }
            tags = tagParts.join(" ");
            full = `${headline} ${tags}`.trim();
            if (full.length > this.MAX_YOUTUBE_CHARS) {
                headline = headline.slice(0, this.MAX_YOUTUBE_CHARS - tags.length - 1).trim();
                full = `${headline} ${tags}`.trim();
            }
        }
        return { headline: headline, tags: tags, full: full };
    },

    generateStoryTitle: function(p1Name, p2Name, p1Obj, p2Obj) {
        let pack = this.buildCompactViralPack(p1Name, p2Name, p1Obj, p2Obj);
        this.viralHeadline = pack.headline;
        this.viralTags = pack.tags;
        this.viralTitle = pack.full;
        return this.viralTitle;
    },

    generateViralPostKit: function(p1Name, p2Name, transcript, existingHeadline, existingTags) {
        if (existingHeadline && existingTags) {
            return `${existingHeadline} ${existingTags}`.trim();
        }
        let pack = this.buildCompactViralPack(p1Name || "Hero", p2Name || "Boss");
        return pack.full;
    },

    init: function(p1Name, p2Name) { 
        let eObj = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
        this.generateStoryTitle(p1Name || "HERO", p2Name || "BOSS", window.p1, eObj);
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
        ctx.translate(w/2, h/2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-206, -89, 420, 190, 20); else ctx.fillRect(-206, -89, 420, 190); ctx.fill();
        ctx.fillStyle = "rgba(235, 235, 240, 0.95)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-210, -95, 420, 190, 20); else ctx.fillRect(-210, -95, 420, 190); ctx.fill();
        ctx.fillStyle = "#000"; ctx.font = "bold 25px Arial"; ctx.textAlign = "center"; ctx.fillText("Low Battery", 0, -38);
        ctx.font = "19px Arial"; ctx.fillText("10% battery remaining.", 0, -2); ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-210, 36); ctx.lineTo(210, 36); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 36); ctx.lineTo(0, 95); ctx.stroke();
        ctx.fillStyle = "#007aff"; ctx.font = "21px Arial"; ctx.fillText("Close", -105, 70); ctx.font = "bold 21px Arial"; ctx.fillText("Low Power Mode", 105, 70);
    } 
    else if (window._baitType === 1) {
        let slideY = timeSinceBait < 350 ? -100 + (timeSinceBait/350)*168 : 68;
        ctx.translate(w/2, slideY);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-386, -38, 780, 88, 22); else ctx.fillRect(-386, -38, 780, 88); ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-390, -44, 780, 88, 22); else ctx.fillRect(-390, -44, 780, 88); ctx.fill();
        ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(-325, 0, 32, 0, Math.PI*2); ctx.fill();
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
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-376, -38, 760, 88, 44); else ctx.fillRect(-376, -38, 760, 88); ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-380, -44, 760, 88, 44); else ctx.fillRect(-380, -44, 760, 88); ctx.fill();
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
// BỘ CHUYỂN MÀU VINTAGE CỔ ĐIỂN O(1) & NỀN GIẤY PRE-BAKED (ZERO CTX.FILTER STALL)
// Giữ nguyên 100% tông màu grayscale(100%) contrast(200%) sepia(30%) mà nhanh gấp 60 lần!
// ==========================================
window._vintageColorMap = window._vintageColorMap || {
    "transparent": "rgba(0,0,0,0)",
    "rgba(0,0,0,0)": "rgba(0,0,0,0)",
    "rgba(0, 0, 0, 0)": "rgba(0,0,0,0)",
    "#000": "rgb(0,0,0)",
    "#000000": "rgb(0,0,0)",
    "#111": "rgb(0,0,0)",
    "#111111": "rgb(0,0,0)",
    "#fff": "rgb(255,255,250)",
    "#ffffff": "rgb(255,255,250)"
};

window.toVintageCssColor = function(col) {
    if (typeof col !== 'string') return col;
    let cached = window._vintageColorMap[col];
    if (cached !== undefined) return cached;

    let s = col.trim();
    let r = -1, g = 0, b = 0, a = 1;

    if (s.charCodeAt(0) === 35) { // '#'
        if (s.length === 4) {
            r = parseInt(s[1] + s[1], 16);
            g = parseInt(s[2] + s[2], 16);
            b = parseInt(s[3] + s[3], 16);
        } else if (s.length >= 7) {
            r = parseInt(s.slice(1, 3), 16);
            g = parseInt(s.slice(3, 5), 16);
            b = parseInt(s.slice(5, 7), 16);
            if (s.length === 9) a = parseInt(s.slice(7, 9), 16) / 255;
        }
    } else if (s.startsWith('rgb')) {
        let m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
        if (m) {
            r = parseFloat(m[1]);
            g = parseFloat(m[2]);
            b = parseFloat(m[3]);
            if (m[4] !== undefined) a = parseFloat(m[4]);
        }
    }

    if (r < 0 || isNaN(r)) {
        try {
            if (!window._colorProbeCtx) {
                let cv = document.createElement('canvas');
                cv.width = 1; cv.height = 1;
                window._colorProbeCtx = cv.getContext('2d', { willReadFrequently: true });
            }
            let pCtx = window._colorProbeCtx;
            pCtx.clearRect(0, 0, 1, 1);
            pCtx.fillStyle = s;
            pCtx.fillRect(0, 0, 1, 1);
            let d = pCtx.getImageData(0, 0, 1, 1).data;
            r = d[0]; g = d[1]; b = d[2]; a = +(d[3] / 255).toFixed(3);
        } catch (e) {
            window._vintageColorMap[col] = col;
            return col;
        }
    }

    if (a <= 0.001) {
        window._vintageColorMap[col] = "rgba(0,0,0,0)";
        return "rgba(0,0,0,0)";
    }

    let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let v = (lum - 128) * 2.0 + 128;
    if (v < 0) v = 0; else if (v > 255) v = 255;
    let vr = Math.min(255, Math.round(v * 1.1053));
    let vg = Math.min(255, Math.round(v * 1.0609));
    let vb = Math.min(255, Math.round(v * 0.9811));

    let out = (a >= 0.999) ? `rgb(${vr},${vg},${vb})` : `rgba(${vr},${vg},${vb},${a})`;
    window._vintageColorMap[col] = out;
    return out;
};

window.installVintageColorContext = function(ctx) {
    if (!ctx || ctx._vintageHookInstalled) return ctx;
    let proto = Object.getPrototypeOf(ctx);
    let fillDesc = proto ? Object.getOwnPropertyDescriptor(proto, 'fillStyle') : null;
    let strokeDesc = proto ? Object.getOwnPropertyDescriptor(proto, 'strokeStyle') : null;
    if (!fillDesc || !strokeDesc) return ctx;

    ctx._vintageHookInstalled = true;
    ctx._vintageColorActive = false;

    Object.defineProperty(ctx, 'fillStyle', {
        configurable: true,
        enumerable: true,
        get: function() { return fillDesc.get.call(this); },
        set: function(val) {
            fillDesc.set.call(this, (this._vintageColorActive && typeof val === 'string') ? window.toVintageCssColor(val) : val);
        }
    });

    Object.defineProperty(ctx, 'strokeStyle', {
        configurable: true,
        enumerable: true,
        get: function() { return strokeDesc.get.call(this); },
        set: function(val) {
            strokeDesc.set.call(this, (this._vintageColorActive && typeof val === 'string') ? window.toVintageCssColor(val) : val);
        }
    });

    const wrapGrad = (grad) => {
        if (grad && typeof grad.addColorStop === 'function') {
            const origStop = grad.addColorStop;
            grad.addColorStop = function(offset, color) {
                return origStop.call(this, offset, typeof color === 'string' ? window.toVintageCssColor(color) : color);
            };
        }
        return grad;
    };

    const origLinGrad = ctx.createLinearGradient;
    const origRadGrad = ctx.createRadialGradient;
    ctx.createLinearGradient = function(x0, y0, x1, y1) {
        let g = origLinGrad.call(this, x0, y0, x1, y1);
        return this._vintageColorActive ? wrapGrad(g) : g;
    };
    ctx.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
        let g = origRadGrad.call(this, x0, y0, r0, x1, y1, r1);
        return this._vintageColorActive ? wrapGrad(g) : g;
    };

    return ctx;
};

window._ensureVintagePaperCanvas = function(w, h) {
    if (window._vintagePaperCanvas && window._vintagePaperCanvas.width === w && window._vintagePaperCanvas.height === h) {
        return window._vintagePaperCanvas;
    }
    let cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    let pCtx = cv.getContext('2d', { alpha: false });
    pCtx.fillStyle = "#f2ece1";
    pCtx.fillRect(0, 0, w, h);

    let vg = pCtx.createRadialGradient(w / 2, h / 2, 320, w / 2, h / 2, 1050);
    vg.addColorStop(0, "rgba(0, 0, 0, 0)");
    vg.addColorStop(1, "rgba(25, 20, 15, 0.22)");
    pCtx.fillStyle = vg;
    pCtx.fillRect(0, 0, w, h);

    pCtx.globalAlpha = 0.05;
    pCtx.fillStyle = "#000000";
    for (let i = 0; i < w; i += 6) {
        pCtx.fillRect(i, 0, 1, h);
    }
    pCtx.globalAlpha = 1.0;
    window._vintagePaperCanvas = cv;
    return cv;
};

window._ensureStaticBottomCanvas = function(splitGameHeight) {
    let retainHeight = 1920 - splitGameHeight;
    let hookTxt = (window.introParams && window.introParams.pinnedHook) ? window.introParams.pinnedHook : "";
    let key = splitGameHeight + "|" + hookTxt;
    if (window._staticBottomCanvas && window._staticBottomKey === key) {
        return window._staticBottomCanvas;
    }
    window._staticBottomKey = key;
    let cv = window._staticBottomCanvas || document.createElement('canvas');
    cv.width = 1080;
    cv.height = retainHeight;
    let bCtx = cv.getContext('2d', { alpha: false });

    // 1. Nền Gradient nửa dưới màn hình
    let bg = bCtx.createLinearGradient(0, 0, 0, retainHeight);
    bg.addColorStop(0, "#080b12");
    bg.addColorStop(1, "#151122");
    bCtx.fillStyle = bg;
    bCtx.fillRect(0, 0, 1080, retainHeight);

    // 2. Rãnh nền thanh tiến độ (Y = 2)
    bCtx.fillStyle = "#1e293b";
    bCtx.fillRect(0, 2, 1080, 45);

    // 3. Khung tĩnh Live Chat + Watermark chìm + Pinned Hook
    let boxWidth = 880, boxHeight = 730, boxX = 540, boxY = 1490 - splitGameHeight;
    bCtx.save();
    bCtx.translate(boxX, boxY);
    bCtx.fillStyle = "rgba(10, 15, 30, 0.65)";
    bCtx.strokeStyle = "rgba(0, 243, 255, 0.3)";
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    if (bCtx.roundRect) bCtx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 16);
    else bCtx.rect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
    bCtx.fill();
    bCtx.stroke();

    bCtx.beginPath();
    if (bCtx.roundRect) bCtx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 16);
    else bCtx.rect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
    bCtx.clip();

    bCtx.save();
    bCtx.rotate(-0.10);
    bCtx.font = "900 68px 'Arial Black', sans-serif";
    bCtx.textAlign = "center";
    bCtx.textBaseline = "middle";
    bCtx.fillStyle = "rgba(255, 255, 255, 0.045)";
    bCtx.fillText(window.CREATOR_HANDLE, 0, 0);
    bCtx.restore();

    bCtx.fillStyle = "rgba(30, 41, 59, 0.85)";
    bCtx.fillRect(-boxWidth / 2, -boxHeight / 2, boxWidth, 54);

    bCtx.beginPath();
    bCtx.moveTo(-boxWidth / 2, -boxHeight / 2 + 54);
    bCtx.lineTo(boxWidth / 2, -boxHeight / 2 + 54);
    bCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    bCtx.stroke();

    if (hookTxt) {
        bCtx.font = "bold 21px Arial";
        bCtx.textAlign = "left";
        bCtx.textBaseline = "middle";
        window.strokeTextClean(bCtx, hookTxt, -boxWidth / 2 + 22, -boxHeight / 2 + 27, "#ffeb3b", "#000", 4);
    }
    bCtx.restore();

    window._staticBottomCanvas = cv;
    return cv;
};

// ==========================================
// INTRO VINTAGE TỐI GIẢN & THU HÚT ÁNH NHÌN (CLEAN VIRAL MINIMALIST INTRO)
// - Giữ nguyên bộ lọc màu cổ điển ít màu (grayscale + contrast + sepia) đã chứng minh hút view.
// - Tối giản 100% chi tiết thừa: Chỉ giữ Spotlight trung tâm, Đường tụ tâm Manga nhẹ & 1 Câu Hook sắc nét.
// - Tự động nhún nhẹ theo nhịp nhạc (Beat-Bounce) và nằm trọn trong vùng an toàn của TikTok & YouTube Shorts.
// ==========================================
window.drawProceduralIntro = function(ctx, w, h, progress, elapsedMs) {
    ctx.save();
    let prm = window.introParams;
    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(window.enemies && window.enemies[0] ? window.enemies[0] : null, "OPPONENT");

    // 1. Nền giấy cổ điển sạch sẽ + Vignette + Vân sọc (Blit 1 lần từ Offscreen Cache -> 0.05ms)
    let paperCv = window._ensureVintagePaperCanvas(w, h);
    ctx.drawImage(paperCv, 0, 0);

    // 2. Đường tụ tâm Manga (Focus Lines) rất thanh mảnh hướng ánh nhìn vào thẳng nhân vật
    ctx.save();
    ctx.translate(w / 2, h / 2 - 20);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.065)";
    ctx.lineWidth = 3;
    let rotStep = Math.floor(Date.now() / 120) * 0.05;
    ctx.beginPath();
    for (let i = 0; i < 18; i++) {
        let ang = (Math.PI * 2 / 18) * i + rotStep;
        ctx.moveTo(Math.cos(ang) * 340, Math.sin(ang) * 340);
        ctx.lineTo(Math.cos(ang) * 950, Math.sin(ang) * 950);
    }
    ctx.stroke();
    ctx.restore();

    // 3. Khung viền đơn thanh lịch nằm gọn trong Safe-Zone
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 5;
    ctx.strokeRect(48, 64, w - 96, h - 128);

    // Đồng bộ thời lượng từng màn nhảy Intro khớp 100% với độ dài Voice của P1 và P2:
    let totalDur = window.introDuration || 3200;
    let p1End = window.introP1EndMs || (totalDur * 0.32);
    let p2End = window.introP2EndMs || (totalDur * 0.64);
    let curMs = (typeof elapsedMs === 'number') ? elapsedMs : (progress * totalDur);
    let act = curMs < p1End ? 0 : (curMs < p2End ? 1 : 2);
    let localProg = (act === 0)
        ? (curMs / Math.max(1, p1End))
        : (act === 1)
            ? ((curMs - p1End) / Math.max(1, p2End - p1End))
            : ((curMs - p2End) / Math.max(1, totalDur - p2End));
    localProg = Math.max(0, Math.min(1, localProg));

    // Nhịp nhún Camera nhẹ theo beat nhạc (Beat-Bounce)
    let beatPulse = 1.0 + Math.abs(Math.sin(Date.now() / 125)) * 0.025;

    ctx.save();
    ctx.translate(w / 2, h / 2 + 20);
    ctx.scale(2.0 * beatPulse, 2.0 * beatPulse);

    let p1Dance = window.DanceEngine ? window.DanceEngine.currentP1Dance : "dance_apt";
    let p2Dance = window.DanceEngine ? window.DanceEngine.currentP2Dance : "dance_slickback";

    // Vòng tròn Spotlight cổ điển phía sau lưng nhân vật giúp nhân vật nổi bật tuyệt đối
    ctx.fillStyle = "rgba(26, 26, 26, 0.06)";
    ctx.beginPath();
    ctx.arc(0, -15, 165, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(26, 26, 26, 0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const drawCleanVintageFighter = (charObj, cx, cy, isFacingRight, nameLabel, subTag, danceState) => {
        if (!charObj) return;
        ctx.save();
        // GIỮ NGUYÊN BỘ LỌC CỔ ĐIỂN ÍT MÀU HÚT VIEW (GRAYSCALE + CONTRAST + SEPIA - TĂNG TỐC O(1) KHÔNG DÙNG CTX.FILTER)
        ctx._vintageColorActive = true;
        window._vintageRenderMode = 'sepia';
        try {
            if (window.DanceEngine) {
                window.DanceEngine.drawDancer(ctx, charObj, cx, cy, isFacingRight, 3.55, danceState);
            } else {
                ctx.translate(cx, cy);
                if (!isFacingRight) ctx.scale(-1, 1);
                let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.55, isFacingRight: true, state: 'idle', hideHpBar: true});
                if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone);
            }
        } finally {
            ctx._vintageColorActive = false;
            window._vintageRenderMode = null;
            ctx.restore();
        }

        // Thẻ tên tối giản, sắc nét, đọc được ngay trong 0.2 giây
        if (nameLabel) {
            ctx.save();
            ctx.translate(cx, cy - 295);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            window.strokeTextFit(ctx, nameLabel, 0, 0, 420, 34, "#111111", "#ffffff", 6);

            if (subTag) {
                ctx.fillStyle = "#111111";
                if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(-115, 22, 230, 26, 13); ctx.fill(); }
                else { ctx.fillRect(-115, 22, 230, 26); }
                window.strokeTextFit(ctx, subTag, 0, 35, 210, 13, "#ffeb3b", "#000000", 2, "Arial");
            }
            ctx.restore();
        }
    };

    if (act === 0) {
        drawCleanVintageFighter(window.p1, 0, 95, true, realP1Name, prm.lore.p1Trait, p1Dance);
    } else if (act === 1) {
        drawCleanVintageFighter(window.enemies ? window.enemies[0] : null, 0, 95, false, realP2Name, prm.lore.p2Trait, p2Dance);
    } else {
        let easeOut = 1 - Math.pow(1 - localProg, 3);
        let pushP1 = -260 + easeOut * 115;
        let pushP2 = 260 - easeOut * 115;

        drawCleanVintageFighter(window.p1, pushP1, 95, true, null, null, p1Dance);
        drawCleanVintageFighter(window.enemies ? window.enemies[0] : null, pushP2, 95, false, null, null, p2Dance);

        // Đường cắt chéo Sấm Sét ở giữa 2 nhân vật
        ctx.save();
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(25, -220);
        ctx.lineTo(-8, -60);
        ctx.lineTo(12, -60);
        ctx.lineTo(-25, 110);
        ctx.stroke();
        ctx.restore();

        // Nhãn Kèo Trên 99% vs Kèo Dưới 1% tối giản, rõ ràng trên đầu 2 đấu sĩ
        if (prm.lore.vsOdds) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "#111111";
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(pushP1 - 102, -165, 204, 28, 8); ctx.fill(); }
            else { ctx.fillRect(pushP1 - 102, -165, 204, 28); }
            window.strokeTextFit(ctx, prm.lore.vsOdds.p1Tag, pushP1, -151, 190, 13, "#ffeb3b", "#000", 2, "Arial");

            ctx.fillStyle = "#b91c1c";
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(pushP2 - 102, -165, 204, 28, 8); ctx.fill(); }
            else { ctx.fillRect(pushP2 - 102, -165, 204, 28); }
            window.strokeTextFit(ctx, prm.lore.vsOdds.p2Tag, pushP2, -151, 190, 13, "#ffffff", "#000", 2, "Arial");
            ctx.restore();
        }

        ctx.save();
        ctx.translate(0, -195);
        ctx.font = "italic 900 96px 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        window.strokeTextClean(ctx, "VS", 0, 0, "#ff0050", "#ffffff", 14);
        ctx.restore();
    }
    ctx.restore();

    // 4. TIÊU ĐỀ TRẬN ĐẤU & 1 DẢI HOOK DUY NHẤT Ở PHÍA TRÊN (NẰM TRONG VÙNG AN TOÀN TIKTOK & SHORTS)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    window.strokeTextFit(ctx, prm.lore.chapter, w / 2, 195, 900, 52, "#ffffff", "#111111", 12);

    if (prm.lore.subHook) {
        ctx.save();
        ctx.fillStyle = "#111111";
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(w / 2 - 380, 244, 760, 48, 24); ctx.fill(); }
        else { ctx.fillRect(w / 2 - 380, 244, 760, 48); }
        window.strokeTextFit(ctx, prm.lore.subHook, w / 2, 268, 720, 24, "#ffeb3b", "#000000", 4);
        ctx.restore();
    }

    // Watermark tinh tế
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
    ctx.fillText(window.CREATOR_HANDLE, w / 2, 1665);

    ctx.restore();
};

// ==========================================
// HỘP THOẠI TRASH TALK TRONG KHOANG RIÊNG (Y = 885) - ĐỒNG BỘ 100% STORY DIALOGUE & KHÔNG RUNG GIẬT
// ==========================================
window.drawCinematicQuoteInPanel = function(ctx, quote, elapsed, panelY, p1Url, p2Url) {
    ctx.save();
    let alpha = 1;
    if (elapsed < 180) alpha = elapsed / 180;
    if (elapsed > quote.duration - 200) alpha = (quote.duration - elapsed) / 200;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    let boxW = 880;
    let boxH = 190;
    let boxX = 100;
    let boxY = panelY;

    ctx.fillStyle = "#f8f5e6";
    if (ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 16); ctx.fill(); 
    } else { 
        ctx.fillRect(boxX, boxY, boxW, boxH); 
    }

    let spkCol = (quote.speaker === "P1") ? "#00f3ff" : "#ff0050";
    ctx.lineWidth = 5;
    ctx.strokeStyle = spkCol;
    if (ctx.roundRect) { 
        ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 16); ctx.stroke(); 
    } else { 
        ctx.strokeRect(boxX, boxY, boxW, boxH); 
    }

    let faceSize = 130;
    let faceX = quote.speaker === "P1" ? boxX + 25 : boxX + boxW - faceSize - 25;
    let faceY = boxY + 30;
    
    let faceImgUrl = (quote.speaker === "P1" ? p1Url : p2Url) || quote.face;
    let faceImg = (typeof window.getVintageCachedImg === 'function')
        ? (window.getVintageCachedImg(faceImgUrl, 'quote') || window.getSharedCachedImg(faceImgUrl))
        : window.getSharedCachedImg(faceImgUrl);
    
    if (faceImg) {
        ctx.save();
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(faceImg._mip96 || faceImg, faceX, faceY, faceSize, faceSize);
        ctx.restore();
        
        ctx.beginPath(); ctx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, Math.PI*2);
        ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.stroke();
    }

    let speakerName = quote.speakerName || (quote.speaker === "P1" ? window.getRealCharName(window.p1, "PLAYER") : (window.enemies && window.enemies.length ? window.getRealCharName(window.enemies[0], "BOSS") : "OPPONENT"));
    let headerLabel = quote.badge ? `🔊 ${speakerName} • ${quote.badge}` : `🔊 ${speakerName}`;
    let textStartX = quote.speaker === "P1" ? boxX + faceSize + 45 : boxX + 30;
    let maxTextW = boxW - faceSize - 75;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    window.strokeTextFit(ctx, headerLabel, textStartX, boxY + 18, maxTextW - 48, 25, spkCol, "#000", 6);

    // Sóng âm Equalizer nhấp nháy trực quan theo giọng đọc Chị Google
    let eqX = quote.speaker === "P1" ? (boxX + boxW - 52) : (boxX + boxW - faceSize - 72);
    let eqNow = Date.now() / 60;
    ctx.fillStyle = spkCol;
    for (let b = 0; b < 4; b++) {
        let bh = 8 + Math.abs(Math.sin(eqNow + b * 1.35)) * 18;
        ctx.fillRect(eqX + b * 8, boxY + 32 - bh * 0.5, 5, bh);
    }

    // Thanh tiến trình thời gian đọc thoại ở đáy khung (chạy từ 0% -> 100% đúng lúc đọc xong)
    let readProg = Math.max(0, Math.min(1, elapsed / Math.max(1, quote.duration)));
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(textStartX, boxY + boxH - 14, maxTextW, 6);
    ctx.fillStyle = spkCol;
    ctx.fillRect(textStartX, boxY + boxH - 14, maxTextW * readProg, 6);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 25px Arial, sans-serif";

    if (!quote._wrappedPanelLines) {
        let words = String(quote.text || "").split(" ");
        let wrapped = [];
        let cur = "";
        for (let i = 0; i < words.length; i++) {
            let testLine = cur ? (cur + " " + words[i]) : words[i];
            if (ctx.measureText(testLine).width > maxTextW && cur) {
                wrapped.push(cur);
                cur = words[i];
            } else {
                cur = testLine;
            }
        }
        if (cur) wrapped.push(cur);
        quote._wrappedPanelLines = wrapped.slice(0, 3);
    }

    let totalLen = 0;
    for (let i = 0; i < quote._wrappedPanelLines.length; i++) totalLen += quote._wrappedPanelLines[i].length;
    // Đồng bộ tốc độ chạy chữ (Typewriter) bám sát nhịp đọc của Chị Google
    let revealMs = Math.max(450, Math.min(2600, quote.duration * 0.68));
    let charsToShow = (elapsed >= revealMs) ? totalLen : Math.max(1, Math.floor((elapsed / revealMs) * totalLen));

    let rem = charsToShow;
    let lineY = boxY + 60;
    for (let i = 0; i < quote._wrappedPanelLines.length; i++) {
        if (rem <= 0) break;
        let ln = quote._wrappedPanelLines[i];
        let sub = (rem >= ln.length) ? ln : ln.substring(0, rem);
        ctx.fillText(sub, textStartX, lineY);
        rem -= ln.length;
        lineY += 34;
    }
    ctx.restore();
};

// HOOK ĐỒNG BỘ 100% HỘI THOẠI NHÂN VẬT & THỜI LƯỢNG GIỌNG ĐỌC GOOGLE TTS SANG VIDEO & LIVE CHAT
window.onStoryDialogueDurationUpdate = function(newDurationMs) {
    if (window._activeQuote && typeof newDurationMs === "number" && newDurationMs > 300) {
        window._activeQuote.duration = newDurationMs;
    }
};

window.onStoryDialogueEnd = function() {
    window._activeQuote = null;
};

window.onStoryDialogueStart = function(record, lineObj) {
    if (!record) return;
    let durMs = (lineObj && lineObj.voiceDurationMs)
        ? (lineObj.voiceDurationMs + 110)
        : Math.round((((lineObj && lineObj.durationTicks) || 130) / 60) * 1000);
    window._activeQuote = {
        speaker: record.isPlayer ? "P1" : "P2",
        speakerName: record.speakerName,
        badge: record.badge || "",
        face: record.avatarUrl,
        text: record.text,
        duration: durMs,
        triggered: true
    };
    window._activeQuoteStartTime = Date.now();

    let ctxForMeasure = window.recordCtxV || window.ctx;
    if (!window._chatSystemInit && typeof window.generateLiveChatEvent === 'function' && ctxForMeasure) {
        window._chatSystemInit = true;
        window._liveChats = [];
        window._lastChatUpdate = Date.now();
        window._nextChatDelay = 950;
        for (let i = 0; i < 5; i++) {
            let c = window.generateLiveChatEvent("normal");
            if (typeof window.precalcChatText === 'function') window.precalcChatText(c, ctxForMeasure);
            window._liveChats.push(c);
        }
    }

    window._liveChats = window._liveChats || [];
    let fighterChat = {
        name: `🎙️ ${record.speakerName}`,
        color: record.isPlayer ? "#00f3ff" : "#ff3366",
        msg: record.text,
        lines: null,
        nameWidth: 0,
        isHighlight: true,
        isFighterSpeech: true
    };
    if (ctxForMeasure && typeof window.precalcChatText === 'function') {
        window.precalcChatText(fighterChat, ctxForMeasure);
    }
    window._liveChats.push(fighterChat);
    if (window._liveChats.length > 12) window._liveChats.shift();
    window._chatDirty = true;
    window._lastChatUpdate = Date.now();
};

if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try {
                let source = window.audioCtx.createMediaElementSource(this);
                source._internalMasterConnect = true;
                source.connect(window.masterRecordDestination);
                source.connect(window.audioCtx.destination);
                this._routedToRecorder = true;
            } catch (e) { }
        }
        if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0];
        let isSpeakerDest = !this._internalMasterConnect && target && target.context && (target === target.context.destination) && (target !== window.masterRecordDestination);
        if (isSpeakerDest && window.masterRecordDestination && target.context === window.masterRecordDestination.context) {
            try { originalConnect.call(this, window.masterRecordDestination); } catch (e) {}
        }
        return originalConnect.apply(this, arguments);
    };
}

window.RECORD_OUT_W = 720;
window.RECORD_OUT_H = 1280;

window.initRecorder = function() {
    // Độ phân giải chuẩn HD 9:16 (720x1280) @ 60FPS: Nhẹ hơn 2.25 lần Readback GPU, đạt chuẩn Hardware H.264 60FPS trên mọi PC & Điện thoại!
    let ctxOpts = { alpha: false, willReadFrequently: false };
    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV") || document.createElement("canvas");
    if (!window.recordCanvasV.id) {
        window.recordCanvasV.id = "hiddenRecordCanvasV";
        document.body.appendChild(window.recordCanvasV);
    }
    if (window.recordCanvasV.width !== window.RECORD_OUT_W || window.recordCanvasV.height !== window.RECORD_OUT_H) {
        window.recordCanvasV.width = window.RECORD_OUT_W;
        window.recordCanvasV.height = window.RECORD_OUT_H;
    }
    window.recordCanvasV.style.cssText = "position: fixed; bottom: 0; right: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -100;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts) || window.recordCanvasV.getContext("2d");
    if (window.recordCtxV) {
        if (typeof window.installFastGlowContext === 'function') window.installFastGlowContext(window.recordCtxV);
        if (typeof window.installVintageColorContext === 'function') window.installVintageColorContext(window.recordCtxV);
    }
};

window._recorderLoopFunction = function(ts) {
    if (!window.isRecording) return;
    // Chỉ chạy fallback rAF khi gameLoop chính tạm dừng; bình thường engine_rend gọi captureFrames đồng bộ ngay sau draw()
    if (!window.isLoopRunning && typeof window.captureFrames === 'function') {
        window.captureFrames(ts || performance.now());
    }
    if (!window.isLoopRunning) {
        window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
    }
};

// ==========================================
// BỘ SỬA METADATA THỜI LƯỢNG VIDEO CHUẨN MOBILE & PC (WEBM EBML + MP4 ISO-BMFF 2-PASS)
// Đảm bảo 100% chỉnh sửa, tua, cắt ghép mượt trên CapCut, TikTok, iOS Photos, Android Gallery, Premiere & VLC
// ==========================================
(function() {
    var sections = {
        0xa45dfa3: { name: 'EBML', type: 'Container' },
        0x286: { name: 'EBMLVersion', type: 'Uint' },
        0x2f7: { name: 'EBMLReadVersion', type: 'Uint' },
        0x2f2: { name: 'EBMLMaxIDLength', type: 'Uint' },
        0x2f3: { name: 'EBMLMaxSizeLength', type: 'Uint' },
        0x282: { name: 'DocType', type: 'String' },
        0x287: { name: 'DocTypeVersion', type: 'Uint' },
        0x285: { name: 'DocTypeReadVersion', type: 'Uint' },
        0x6c: { name: 'Void', type: 'Binary' },
        0x3f: { name: 'CRC-32', type: 'Binary' },
        0x8538067: { name: 'Segment', type: 'Container' },
        0x14d9b74: { name: 'SeekHead', type: 'Container' },
        0xdbb: { name: 'Seek', type: 'Container' },
        0x13ab: { name: 'SeekID', type: 'Binary' },
        0x13ac: { name: 'SeekPosition', type: 'Uint' },
        0x549a966: { name: 'Info', type: 'Container' },
        0xad7b1: { name: 'TimecodeScale', type: 'Uint' },
        0x489: { name: 'Duration', type: 'Float' },
        0x461: { name: 'DateUTC', type: 'Date' },
        0x3ba9: { name: 'Title', type: 'String' },
        0xd80: { name: 'MuxingApp', type: 'String' },
        0x1741: { name: 'WritingApp', type: 'String' },
        0x654ae6b: { name: 'Tracks', type: 'Container' },
        0x2e: { name: 'TrackEntry', type: 'Container' },
        0xc53bb6b: { name: 'Cues', type: 'Container' }
    };

    function doInherit(newClass, baseClass) {
        newClass.prototype = Object.create(baseClass.prototype);
        newClass.prototype.constructor = newClass;
    }

    function WebmBase(name, type) {
        this.name = name || 'Unknown';
        this.type = type || 'Unknown';
    }
    WebmBase.prototype.updateBySource = function() {};
    WebmBase.prototype.setSource = function(source) {
        this.source = source;
        this.updateBySource();
    };
    WebmBase.prototype.updateByData = function() {};
    WebmBase.prototype.setData = function(data) {
        this.data = data;
        this.updateByData();
    };

    function padHex(hex) {
        return hex.length % 2 === 1 ? '0' + hex : hex;
    }

    function WebmUint(name, type) {
        WebmBase.call(this, name, type || 'Uint');
    }
    doInherit(WebmUint, WebmBase);
    WebmUint.prototype.updateBySource = function() {
        this.data = '';
        for (var i = 0; i < this.source.length; i++) {
            this.data += padHex(this.source[i].toString(16));
        }
    };
    WebmUint.prototype.updateByData = function() {
        var length = this.data.length / 2;
        this.source = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
            this.source[i] = parseInt(this.data.substr(i * 2, 2), 16);
        }
    };
    WebmUint.prototype.getValue = function() {
        return parseInt(this.data, 16);
    };
    WebmUint.prototype.setValue = function(value) {
        this.setData(padHex(value.toString(16)));
    };

    function WebmFloat(name, type) {
        WebmBase.call(this, name, type || 'Float');
    }
    doInherit(WebmFloat, WebmBase);
    WebmFloat.prototype.getFloatArrayType = function() {
        return this.source && this.source.length === 4 ? Float32Array : Float64Array;
    };
    WebmFloat.prototype.updateBySource = function() {
        var byteArray = this.source.slice().reverse();
        var floatArrayType = this.getFloatArrayType();
        var floatArray = new floatArrayType(byteArray.buffer);
        this.data = floatArray[0];
    };
    WebmFloat.prototype.updateByData = function() {
        var floatArrayType = this.getFloatArrayType();
        var floatArray = new floatArrayType([this.data]);
        var byteArray = new Uint8Array(floatArray.buffer);
        this.source = byteArray.reverse();
    };
    WebmFloat.prototype.getValue = function() {
        return this.data;
    };
    WebmFloat.prototype.setValue = function(value) {
        this.setData(value);
    };

    function WebmContainer(name, type) {
        WebmBase.call(this, name, type || 'Container');
    }
    doInherit(WebmContainer, WebmBase);
    WebmContainer.prototype.readByte = function() {
        return this.source[this.offset++];
    };
    WebmContainer.prototype.readUint = function() {
        var firstByte = this.readByte();
        var bytes = 8 - firstByte.toString(2).length;
        var value = firstByte - (1 << (7 - bytes));
        for (var i = 0; i < bytes; i++) {
            value *= 256;
            value += this.readByte();
        }
        return value;
    };
    WebmContainer.prototype.updateBySource = function() {
        this.data = [];
        var end = 0;
        for (this.offset = 0; this.offset < this.source.length; this.offset = end) {
            var id = this.readUint();
            var len = this.readUint();
            end = Math.min(this.offset + len, this.source.length);
            var data = this.source.slice(this.offset, end);

            var info = sections[id] || { name: 'Unknown', type: 'Unknown' };
            var ctr = WebmBase;
            if (info.type === 'Container') ctr = WebmContainer;
            else if (info.type === 'Uint') ctr = WebmUint;
            else if (info.type === 'Float') ctr = WebmFloat;

            var section = new ctr(info.name, info.type);
            section.setSource(data);
            this.data.push({ id: id, idHex: id.toString(16), data: section });
        }
    };
    WebmContainer.prototype.writeUint = function(x, draft) {
        for (var bytes = 1, flag = 0x80; x >= flag && bytes < 8; bytes++, flag *= 0x80) {}
        if (!draft) {
            var value = flag + x;
            for (var i = bytes - 1; i >= 0; i--) {
                var c = value % 256;
                this.source[this.offset + i] = c;
                value = (value - c) / 256;
            }
        }
        this.offset += bytes;
    };
    WebmContainer.prototype.writeSections = function(draft) {
        this.offset = 0;
        for (var i = 0; i < this.data.length; i++) {
            var section = this.data[i],
                content = section.data.source,
                contentLength = content.length;
            this.writeUint(section.id, draft);
            this.writeUint(contentLength, draft);
            if (!draft) {
                this.source.set(content, this.offset);
            }
            this.offset += contentLength;
        }
        return this.offset;
    };
    WebmContainer.prototype.updateByData = function() {
        var length = this.writeSections('draft');
        this.source = new Uint8Array(length);
        this.writeSections();
    };
    WebmContainer.prototype.getSectionById = function(id) {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) return this.data[i].data;
        }
        return null;
    };

    function WebmFile(source) {
        WebmContainer.call(this, 'File', 'File');
        this.setSource(source);
    }
    doInherit(WebmFile, WebmContainer);
    WebmFile.prototype.fixDuration = function(duration) {
        var segmentSection = this.getSectionById(0x8538067);
        if (!segmentSection) return false;
        var infoSection = segmentSection.getSectionById(0x549a966);
        if (!infoSection) return false;
        var timeScaleSection = infoSection.getSectionById(0xad7b1);
        if (!timeScaleSection) return false;

        var durationSection = infoSection.getSectionById(0x489);
        if (durationSection) {
            if (durationSection.getValue() <= 0) {
                durationSection.setValue(duration);
            } else {
                return false;
            }
        } else {
            durationSection = new WebmFloat('Duration', 'Float');
            durationSection.setValue(duration);
            infoSection.data.push({ id: 0x489, data: durationSection });
        }

        timeScaleSection.setValue(1000000);
        infoSection.updateByData();
        segmentSection.updateByData();
        this.updateByData();
        return true;
    };
    WebmFile.prototype.toBlob = function(mimeType) {
        return new Blob([this.source.buffer], { type: mimeType || 'video/webm' });
    };

    function fixWebmDuration(blob, duration, callback) {
        if (!callback) {
            return new Promise(function(resolve) {
                fixWebmDuration(blob, duration, resolve);
            });
        }
        try {
            blob.arrayBuffer().then(function(buf) {
                try {
                    var file = new WebmFile(new Uint8Array(buf));
                    if (file.fixDuration(duration)) {
                        blob = file.toBlob(blob.type);
                    }
                } catch (ex) {}
                callback(blob);
            }).catch(function() {
                callback(blob);
            });
        } catch (ex) {
            callback(blob);
        }
    }

    if (typeof window !== 'undefined') {
        window.ysFixWebmDuration = fixWebmDuration;
    }
})();

// MP4 Box Duration Patching Engine (ISO-BMFF 2-Pass: đọc mvhd timescale trước, sau đó vá mvhd, tkhd, mdhd, mehd)
window.patchMp4Duration = function(buffer, durationMs) {
    if (!buffer || buffer.byteLength < 32) return buffer;
    const view = new DataView(buffer);
    let movieTimescale = 1000;

    function walkBoxes(start, end, mode) {
        let pos = start;
        while (pos + 8 <= end) {
            let size = view.getUint32(pos);
            const type = String.fromCharCode(
                view.getUint8(pos + 4), view.getUint8(pos + 5),
                view.getUint8(pos + 6), view.getUint8(pos + 7)
            );
            let headerSize = 8;
            if (size === 1) {
                if (pos + 16 > end) break;
                size = Number(view.getBigUint64(pos + 8));
                headerSize = 16;
            } else if (size === 0) {
                size = end - pos;
            }
            if (size < headerSize || pos + size > end) break;

            const boxStart = pos + headerSize;
            const boxEnd = pos + size;

            if (type === 'moov' || type === 'trak' || type === 'mdia' || type === 'mvex') {
                walkBoxes(boxStart, boxEnd, mode);
            } else if (mode === 'read_ts' && type === 'mvhd') {
                const version = view.getUint8(boxStart);
                if (version === 0 && boxStart + 20 <= boxEnd) {
                    movieTimescale = view.getUint32(boxStart + 12) || 1000;
                } else if (version === 1 && boxStart + 32 <= boxEnd) {
                    movieTimescale = view.getUint32(boxStart + 20) || 1000;
                }
            } else if (mode === 'patch') {
                const movieDur = Math.max(1, Math.round((durationMs / 1000) * movieTimescale));
                const movieDurU32 = Math.min(0xFFFFFFFE, movieDur);
                if (type === 'mvhd') {
                    const version = view.getUint8(boxStart);
                    if (version === 0 && boxStart + 20 <= boxEnd) {
                        view.setUint32(boxStart + 16, movieDurU32);
                    } else if (version === 1 && boxStart + 32 <= boxEnd) {
                        view.setBigUint64(boxStart + 24, BigInt(movieDur));
                    }
                } else if (type === 'tkhd') {
                    const version = view.getUint8(boxStart);
                    if (version === 0 && boxStart + 24 <= boxEnd) {
                        view.setUint32(boxStart + 20, movieDurU32);
                    } else if (version === 1 && boxStart + 36 <= boxEnd) {
                        view.setBigUint64(boxStart + 28, BigInt(movieDur));
                    }
                } else if (type === 'mdhd') {
                    const version = view.getUint8(boxStart);
                    if (version === 0 && boxStart + 20 <= boxEnd) {
                        const ts = view.getUint32(boxStart + 12) || movieTimescale;
                        view.setUint32(boxStart + 16, Math.min(0xFFFFFFFE, Math.max(1, Math.round((durationMs / 1000) * ts))));
                    } else if (version === 1 && boxStart + 32 <= boxEnd) {
                        const ts = view.getUint32(boxStart + 20) || movieTimescale;
                        view.setBigUint64(boxStart + 24, BigInt(Math.max(1, Math.round((durationMs / 1000) * ts))));
                    }
                } else if (type === 'mehd') {
                    const version = view.getUint8(boxStart);
                    if (version === 0 && boxStart + 8 <= boxEnd) {
                        view.setUint32(boxStart + 4, movieDurU32);
                    } else if (version === 1 && boxStart + 12 <= boxEnd) {
                        view.setBigUint64(boxStart + 4, BigInt(movieDur));
                    }
                }
            }
            pos += size;
        }
    }

    walkBoxes(0, buffer.byteLength, 'read_ts');
    walkBoxes(0, buffer.byteLength, 'patch');
    return buffer;
};

window.fixVideoDuration = async function(blob, durationMs) {
    if (!blob || blob.size < 64) return { blob: blob, ext: window.currentVideoExt || 'mp4' };
    try {
        let buffer = await blob.arrayBuffer();
        let bytes = new Uint8Array(buffer, 0, Math.min(64, buffer.byteLength));

        // 1. Nhận diện WebM (EBML Header: 0x1A 0x45 0xDF 0xA3)
        if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
            if (typeof window.ysFixWebmDuration === 'function') {
                let fixedWebm = await new Promise((resolve) => {
                    try {
                        window.ysFixWebmDuration(blob, durationMs, function(fixed) {
                            resolve(fixed || blob);
                        });
                    } catch (e) {
                        resolve(blob);
                    }
                });
                return { blob: fixedWebm, ext: 'webm' };
            }
            return { blob: blob, ext: 'webm' };
        }

        // 2. Nhận diện MP4 (ISO-BMFF ftyp signature)
        let isMp4 = false;
        for (let i = 0; i + 3 < bytes.length && i < 32; i++) {
            if (bytes[i] === 0x66 && bytes[i + 1] === 0x74 && bytes[i + 2] === 0x79 && bytes[i + 3] === 0x70) {
                isMp4 = true;
                break;
            }
        }
        if (isMp4) {
            let patchedBuffer = window.patchMp4Duration(buffer, durationMs);
            return { blob: new Blob([patchedBuffer], { type: 'video/mp4' }), ext: 'mp4' };
        }
    } catch (e) {
        console.warn('⚠️ [fixVideoDuration] Lỗi khi xử lý duration clip:', e);
    }
    return { blob: blob, ext: window.currentVideoExt || 'mp4' };
};

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    
    if (typeof window.setupIntroVoiceTimeline === 'function') {
        window.setupIntroVoiceTimeline();
    } else {
        window.introTimer = 215;
    }

    let recInd = document.getElementById("rec-indicator");
    if (recInd) recInd.style.display = "flex";

    setTimeout(window.fitWebHudNames, 50);
    setTimeout(window.fitWebHudNames, 300);

    window.buildCharacterTrashTalk();
    window._activeQuote = null;
    window._outroQuotesC = null; 

    window._lastP1Hp = 1; window._lastP2Hp = 1; window._impactFrames = 0; window._impactIntensity = 0;
    window._animeFlashFrames = 0;
    window._betPoolP1 = 110 + Math.floor(Math.random() * 60);
    window._betPoolP2 = 125 + Math.floor(Math.random() * 60);
    window._varCheckActive = false;
    window._varCheckTriggered = false;

    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (typeof window.ensureMasterAudioBus === 'function') window.ensureMasterAudioBus();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try {
            if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous";
            let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase);
            bgmSrc._internalMasterConnect = true;
            bgmSrc.connect(window.masterRecordDestination);
            bgmSrc.connect(window.audioCtx.destination);
            window.bgmBase._routedToRecorder = true;
        } catch (e) { }
    }
    try {
        if (window.silenceOsc) { try { window.silenceOsc.stop(); window.silenceOsc.disconnect(); } catch (e) {} }
        if (window.silenceGain) { try { window.silenceGain.disconnect(); } catch (e) {} }
        window.silenceOsc = window.audioCtx.createOscillator();
        window.silenceGain = window.audioCtx.createGain();
        window.silenceOsc._internalMasterConnect = true;
        window.silenceGain._internalMasterConnect = true;
        window.silenceGain.gain.value = 0;
        window.silenceOsc.connect(window.silenceGain);
        window.silenceGain.connect(window.masterRecordDestination);
        window.silenceOsc.start();
    } catch(e) {}
    
    window.introParams = window.generateIntroParams();
    window._staticBottomKey = ""; // Làm mới cache khung tĩnh cho trận mới
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

    // Khóa cứng chuẩn 60.000 FPS không xé hình (720x1280 HD 9:16):
    // Trên Chrome/Edge/Android/Firefox: ưu tiên captureStream(0) + requestFrame() ở cuối mỗi lần vẽ xong để KHÔNG BAO GIỜ chụp nửa chừng hoặc bị bộ lọc nội bộ của trình duyệt nuốt frame ở nhịp 12.12ms trên màn 165Hz!
    // Trên Safari/iOS WebKit: tự động dùng captureStream(60) tương thích phần cứng Apple.
    let videoStreamV = null;
    window._useManualTrackRequest = false;
    window._videoStreamRef = null;
    window._capturedFrameCount = 0;
    let uaStr = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    let isSafariWebKit = /^((?!chrome|chromium|crios|edg|opr|android).)*safari/i.test(uaStr);
    if (!isSafariWebKit) {
        try {
            let manualStream = window.recordCanvasV.captureStream(0);
            let manualTrack = manualStream && manualStream.getVideoTracks()[0];
            if (manualTrack && (typeof manualTrack.requestFrame === 'function' || typeof manualStream.requestFrame === 'function')) {
                videoStreamV = manualStream;
                window._videoStreamRef = manualStream;
                window._useManualTrackRequest = true;
            } else if (manualTrack && typeof manualTrack.stop === 'function') {
                manualTrack.stop();
            }
        } catch (e0) {}
    }
    if (!videoStreamV) {
        try {
            videoStreamV = window.recordCanvasV.captureStream(60);
        } catch (e1) {
            try {
                videoStreamV = window.recordCanvasV.captureStream();
            } catch (e2) {
                videoStreamV = window.recordCanvasV.captureStream(0);
                window._useManualTrackRequest = true;
            }
        }
    }
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0];
    let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    // Ưu tiên chuẩn vàng H.264 Level 4.1 / 4.0 + AAC-LC tường minh (mp4a.40.2) hoặc Opus để luôn có 100% KÊNH ÂM THANH & GIỌNG ĐỌC trong video tải về!
    const mimeCandidates = [
        { mime: 'video/mp4; codecs="avc1.4D4029,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.42E029,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.640029,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.4D4028,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.42E028,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.4D402A,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.64002A,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.42E02A,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1,mp4a.40.2"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.4D4029,opus"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.42E029,opus"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1.42E028,opus"', ext: 'mp4' },
        { mime: 'video/mp4; codecs="avc1,opus"', ext: 'mp4' },
        { mime: 'video/mp4', ext: 'mp4' },
        { mime: 'video/webm; codecs="h264,opus"', ext: 'webm' },
        { mime: 'video/webm; codecs="vp9,opus"', ext: 'webm' },
        { mime: 'video/webm; codecs="vp8,opus"', ext: 'webm' },
        { mime: 'video/webm', ext: 'webm' }
    ];

    let options = { videoBitsPerSecond: 6500000, audioBitsPerSecond: 128000 };
    window.currentVideoExt = "mp4";
    for (let c = 0; c < mimeCandidates.length; c++) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeCandidates[c].mime)) {
            options.mimeType = mimeCandidates[c].mime;
            window.currentVideoExt = mimeCandidates[c].ext;
            break;
        }
    }
    
    try {
        window.mediaRecorderV = new MediaRecorder(combinedStreamV, options);
    } catch (e) {
        window.mediaRecorderV = new MediaRecorder(combinedStreamV);
        let actualMime = (window.mediaRecorderV && window.mediaRecorderV.mimeType) || "";
        window.currentVideoExt = actualMime.includes("mp4") ? "mp4" : "webm";
    }
    let localChunks = [];
    window.recordedChunksV = localChunks;
    let recInstance = window.mediaRecorderV;
    let recExtSnap = window.currentVideoExt;
    let recViralTitleSnap = window.StoryModeAI.viralTitle;
    recInstance.ondataavailable = (e) => { if (e.data && e.data.size > 0) localChunks.push(e.data); };

    let charAvatar = "character/picture/billgates.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    if (typeof window.resolveImageUrl === 'function') charAvatar = window.resolveImageUrl(charAvatar);
    let enemyAvatar = "character/picture/spiderman.png";
    if (window.enemies && window.enemies[0] && window.classStats && window.classStats[window.enemies[0].classId]) {
        enemyAvatar = window.classStats[window.enemies[0].classId].avatarUrl || enemyAvatar;
    }
    if (typeof window.resolveImageUrl === 'function') enemyAvatar = window.resolveImageUrl(enemyAvatar);
    let charName = window.getRealCharName(window.p1, "PLAYER");
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) enemyName = window.getRealCharName(window.enemies[0], "BOSS");

    window.StoryModeAI.init(charName, enemyName);
    recViralTitleSnap = window.StoryModeAI.viralTitle;
    let recViralHeadlineSnap = window.StoryModeAI.viralHeadline;
    let recViralTagsSnap = window.StoryModeAI.viralTags;
    
    window._chatSystemInit = false; window._cachedGradients = {}; window._chatDirty = true;
    if (typeof window._fakeViewers === "undefined") window._fakeViewers = 680 + Math.floor(Math.random() * 500);
    window._fakeViewersStr = "";
    window._fakeViewersWidth = 0;

    let recStartPerfSnap = performance.now();
    recInstance.onstop = () => {
        let recStopPerfSnap = window._recordStopPerfTime || performance.now();
        let transcriptSnap = Array.isArray(window._matchDialogueTranscript) ? window._matchDialogueTranscript.slice() : [];
        let gStartSecSnap = window.gamePhaseStartTime / 1000;
        let gEndSecSnap = window.gamePhaseEndTime > 0 ? (window.gamePhaseEndTime / 1000) : 999999;
        let finalHeadlineSnap = recViralHeadlineSnap || (window.StoryModeAI && window.StoryModeAI.viralHeadline) || "";
        let finalTagsSnap = recViralTagsSnap || (window.StoryModeAI && window.StoryModeAI.viralTags) || "";
        let finalTitleSnap = finalHeadlineSnap && finalTagsSnap
            ? `${finalHeadlineSnap} ${finalTagsSnap}`
            : ((window.StoryModeAI && window.StoryModeAI.viralTitle) || recViralTitleSnap);
        setTimeout(async () => {
            window.hideRenderToast();
            if (!localChunks || localChunks.length === 0) return;
            let safeFileName = window.sanitizeFileName(finalHeadlineSnap || finalTitleSnap);
            let rawMime = (recInstance && recInstance.mimeType) || (recExtSnap === 'mp4' ? 'video/mp4' : 'video/webm');
            let rawBlob = new Blob(localChunks, { type: rawMime });
            let totalDurationMs = Math.max(1000, Math.round(recStopPerfSnap - recStartPerfSnap));
            let fixedRes = await window.fixVideoDuration(rawBlob, totalDurationMs);
            let finalBlob = (fixedRes && fixedRes.blob) ? fixedRes.blob : rawBlob;
            let finalExt = (fixedRes && fixedRes.ext) ? fixedRes.ext : recExtSnap;

            let capturedTranscript = transcriptSnap.map(item => {
                let av = item.avatarUrl || (item.isPlayer ? charAvatar : enemyAvatar);
                if (typeof window.resolveImageUrl === 'function') av = window.resolveImageUrl(av);
                return Object.assign({}, item, { resolvedAvatar: av });
            });

            window.savedVideos.unshift({ 
                id: Date.now() + Math.floor(Math.random() * 999), urlV: URL.createObjectURL(finalBlob), ext: finalExt, 
                durationSec: Math.round(totalDurationMs / 1000),
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heroName: charName, heroAvatar: charAvatar,
                enemyName: enemyName, enemyAvatar: enemyAvatar,
                storyTranscript: capturedTranscript,
                viralHeadline: finalHeadlineSnap,
                viralTags: finalTagsSnap,
                viralTitle: finalTitleSnap,
                safeFileName: safeFileName,
                gameStartSec: gStartSecSnap,
                gameEndSec: gEndSecSnap
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 450); 
    };

    // Flush dữ liệu mỗi 1000ms giúp RAM nhẹ nhàng suốt trận, không bị khựng khi kết thúc
    try { window.mediaRecorderV.start(1000); } catch (e) { window.mediaRecorderV.start(); }
    window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._recordStartPerfTime = performance.now();
    window._recordStopPerfTime = 0;
    window._sfxCuts = [false, false, false, false, false]; 
    window._lastCaptureTime = Date.now();
    window._lastCapturePerfTime = 0;
    window._nextCapturePerfTime = 0;
    if (window._recordLoopId) cancelAnimationFrame(window._recordLoopId);
    if (!window.isLoopRunning) {
        window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
    }
};

window.stopRecording = function() { 
    if (!window.isRecording) return;
    window.isRecording = false;
    window._recordStopPerfTime = performance.now();
    if (window._recordLoopId) cancelAnimationFrame(window._recordLoopId); 
    let recInd = document.getElementById("rec-indicator");
    if (recInd) recInd.style.display = "none";
    window.showRenderToast("⏳ ĐANG CHUẨN HÓA CLIP CHO PC & MOBILE...");
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") {
        try { if (window.mediaRecorderV.state === "recording") window.mediaRecorderV.requestData(); } catch(e){}
        try { window.mediaRecorderV.stop(); } catch(e){}
    }
    let trackToStop = window.videoTrackV;
    setTimeout(() => { if (trackToStop) trackToStop.stop(); }, 500);
    window.StoryModeAI.stop();
    if (window.GoogleStoryTTS) window.GoogleStoryTTS.stop();
    if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
    if (window.silenceOsc) { try { window.silenceOsc.stop(); window.silenceOsc.disconnect(); } catch(e){} window.silenceOsc = null; }
    if (window.silenceGain) { try { window.silenceGain.disconnect(); } catch(e){} window.silenceGain = null; }
};

window.captureFrames = function(nowPerf) {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 232) { window.stopRecording(); return; }

    // Bộ điều nhịp Monotonic 60.000 FPS chính xác cho mọi màn hình (60Hz / 120Hz / 144Hz / 165Hz / 240Hz):
    // Khóa cứng đầu ra đúng 60.0 FPS (thay vì 82.5 FPS trên màn 165Hz hay 72 FPS trên màn 144Hz gây lệch pha judder!)
    let pNow = (typeof nowPerf === 'number' && nowPerf > 0) ? nowPerf : performance.now();
    const FRAME_INTERVAL_MS = 1000 / 60;
    if (!window._nextCapturePerfTime) {
        window._nextCapturePerfTime = pNow + FRAME_INTERVAL_MS;
    } else {
        if (pNow < window._nextCapturePerfTime - 2.6) return;
        window._nextCapturePerfTime += FRAME_INTERVAL_MS;
        if (pNow - window._nextCapturePerfTime > FRAME_INTERVAL_MS) {
            window._nextCapturePerfTime = pNow + FRAME_INTERVAL_MS * 0.5;
        }
    }
    window._lastCapturePerfTime = pNow;

    let now = Date.now(); 
    window._lastCaptureTime = now;
    let ctxV = window.recordCtxV;
    let outW = window.RECORD_OUT_W || 720;
    let outH = window.RECORD_OUT_H || 1280;

    ctxV.save();
    ctxV.setTransform(outW / 1080, 0, 0, outH / 1920, 0, 0);
    try {

    let isOutroActive = (window.gameOver && window.matchEndTimer > 85);
    let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;

    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;
    if (elapsed < window.introDuration || isOutroActive) {
        ctxV.fillStyle = "#000000"; ctxV.fillRect(0, 0, 1080, 1920);
    }

    if (elapsed >= window.introDuration && !window._gamePhaseStarted) {
        window._gamePhaseStarted = true; 
        window.gamePhaseStartTime = elapsed;
        if (typeof window.stopCharacterIntroVoice === 'function') window.stopCharacterIntroVoice();
        if (window.introTimer > 25 || window.introTimer <= 0) {
            window.introTimer = 22;
        }
    }

    if (isOutroActive && !window._gamePhaseEnded) {
        window._gamePhaseEnded = true; window.gamePhaseEndTime = elapsed;
    }

    // ==========================================
    // PHẦN 1: INTRO THEO VOICE TỪNG NHÂN VẬT (P1 NHẢY HẾT VOICE P1 -> P2 NHẢY HẾT VOICE P2 -> 2 TƯỚNG TIẾN LẠI GẦN FIGHT!)
    // ==========================================
    if (elapsed < window.introDuration) {
        let introProgress = elapsed / window.introDuration; 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress, elapsed); 
        renderNormalV = false; 

        if (typeof window.updateIntroVoiceTimeline === 'function') {
            window.updateIntroVoiceTimeline(elapsed);
        }

        ctxV.save();
        let p1End = window.introP1EndMs || (window.introDuration * 0.32) || 2500;
        let p2End = window.introP2EndMs || (window.introDuration * 0.64) || 5000;
        let totalDur = window.introDuration || 6150;
        let pulseProg = 0;
        let countText = ""; let col = "#111111";

        if (elapsed < p1End) {
            pulseProg = Math.max(0, Math.min(1, elapsed / Math.max(1, p1End)));
            countText = "3"; col = "#ef4444";
        } else if (elapsed < p2End) {
            pulseProg = Math.max(0, Math.min(1, (elapsed - p1End) / Math.max(1, p2End - p1End)));
            countText = "2"; col = "#f97316";
        } else {
            let clashProg = Math.max(0, Math.min(1, (elapsed - p2End) / Math.max(1, totalDur - p2End)));
            if (clashProg < 0.45) {
                pulseProg = clashProg / 0.45;
                countText = "1"; col = "#eab308";
            } else {
                pulseProg = (clashProg - 0.45) / 0.55;
                countText = "FIGHT!"; col = "#22c55e";
            }
        }

        let scale = 1 + (1 - pulseProg) * 0.42; 
        let alpha = 1 - pulseProg * 0.3; 

        // Đặt ở Y = 1450 để không bao giờ bị dòng Caption của TikTok / YouTube Shorts che khuất
        ctxV.translate(540, 1450);

        // Vòng cung tiến độ đếm ngược gọn gàng, hiện đại
        ctxV.save();
        ctxV.strokeStyle = "rgba(0, 0, 0, 0.12)";
        ctxV.lineWidth = 10;
        ctxV.beginPath(); ctxV.arc(0, 0, 95, 0, Math.PI * 2); ctxV.stroke();

        ctxV.strokeStyle = col;
        ctxV.lineWidth = 10;
        ctxV.lineCap = "round";
        ctxV.beginPath();
        ctxV.arc(0, 0, 95, -Math.PI / 2, -Math.PI / 2 + (1 - pulseProg) * Math.PI * 2);
        ctxV.stroke();
        ctxV.restore();

        ctxV.scale(scale, scale);
        ctxV.globalAlpha = alpha;
        ctxV.font = "900 135px 'Impact', sans-serif";
        ctxV.textAlign = "center";
        ctxV.textBaseline = "middle";
        window.strokeTextClean(ctxV, countText, 0, 0, col, "#ffffff", 18);
        ctxV.restore();
    }

    // Loại bỏ hoàn toàn rung giật ngẫu nhiên theo Bass nhạc & Glitch xé hình để Video 60FPS êm mượt tuyệt đối!
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

    if (!window._varCheckTriggered && (p1HpPct < 0.35 || p2HpPct < 0.35) && window._gamePhaseStarted && !window.gameOver) {
        window._varCheckTriggered = true;
        window._varCheckActive = true;
        window._varCheckStartTime = now;
    }

    if (isClimaxTension && !window.gameOver && Date.now() - window._lastHeartbeatTime > 1100) {
        window._lastHeartbeatTime = Date.now();
        window.playViralSfx("heartbeat");
    }

    // ==========================================
    // PHẦN 2: MÀN HÌNH COMBAT + KHUNG HÌNH ẨN 0.05s + CHECK VAR
    // ==========================================
    if (renderNormalV) {
        ctxV.imageSmoothingEnabled = true;
        ctxV.imageSmoothingQuality = "low";
        
        let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;
        let p1Url = "character/picture/billgates.png"; let p2Url = "character/picture/spiderman.png";
        if (window.p1 && window.classStats && window.classStats[window.p1.classId]) p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url;
        if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url;
        if (typeof window.resolveImageUrl === 'function') {
            p1Url = window.resolveImageUrl(p1Url);
            p2Url = window.resolveImageUrl(p2Url);
        }

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

        let isShowingHiddenFrame = (window._animeFlashFrames > 0);

        ctxV.save();
        ctxV.beginPath(); ctxV.rect(0, 0, 1080, splitGameHeight); ctxV.clip();

        if (isKillCamActive) {
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(1.16, 1.16); ctxV.translate(-540, -splitGameHeight / 2);
        } else if (window._impactFrames > 0) {
            // Chỉ phóng nhẹ mượt mà theo Ease-Out, loại bỏ hoàn toàn rung lắc ngẫu nhiên extraShakeX/Y gây giật mắt!
            let hitZoom = 1 + (window._impactFrames / 14) * 0.028;
            ctxV.translate(540, splitGameHeight / 2); ctxV.scale(hitZoom, hitZoom); ctxV.translate(-540, -splitGameHeight / 2);
        }

        // Vẽ khung hình đấu trường 60FPS sắc nét, ổn định 100% không rung mép
        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 0, 1080, splitGameHeight); 

        if (window._animeFlashFrames > 0) {
            window._animeFlashFrames--;
        }

        if (isShowingHiddenFrame) {
            if (!window._hiddenFrameBadgeCanvas && typeof document !== 'undefined') {
                let bCv = document.createElement('canvas');
                bCv.width = 720; bCv.height = 54;
                let bCtx = bCv.getContext('2d');
                bCtx.fillStyle = "rgba(8, 12, 24, 0.88)";
                if (bCtx.roundRect) { bCtx.beginPath(); bCtx.roundRect(4, 4, 712, 46, 23); bCtx.fill(); }
                else { bCtx.fillRect(4, 4, 712, 46); }
                bCtx.strokeStyle = "#ffeb3b";
                bCtx.lineWidth = 3;
                if (bCtx.roundRect) { bCtx.beginPath(); bCtx.roundRect(4, 4, 712, 46, 23); bCtx.stroke(); }
                else { bCtx.strokeRect(4, 4, 712, 46); }
                bCtx.textAlign = "center";
                bCtx.textBaseline = "middle";
                window.strokeTextFit(bCtx, "📸 KHUNG HÌNH ẨN 0.05s! CMT 'ĐÃ THẤY' NGAY! 👑", 360, 27, 680, 22, "#ffeb3b", "#000", 4);
                window._hiddenFrameBadgeCanvas = bCv;
            }
            if (window._hiddenFrameBadgeCanvas) {
                ctxV.drawImage(window._hiddenFrameBadgeCanvas, 540 - 360, 18);
            }
        }

        if (window._varCheckActive && !isOutroActive) {
            let varElapsed = now - window._varCheckStartTime;
            if (varElapsed < 4200) {
                ctxV.save();
                let isVerdict = (varElapsed > 2200);
                ctxV.fillStyle = "rgba(10, 15, 30, 0.88)";
                if (ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(20, 20, 450, 48, 10); ctxV.fill(); }
                else { ctxV.fillRect(20, 20, 450, 48); }
                ctxV.lineWidth = 3;
                ctxV.strokeStyle = isVerdict ? "#22c55e" : "#ffeb3b";
                if (ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(20, 20, 450, 48, 10); ctxV.stroke(); }
                ctxV.textAlign = "left";
                ctxV.textBaseline = "middle";
                let varTxt = isVerdict ? "✅ VAR: 100% KỸ NĂNG - KHÔNG HACK!" : "📺 VAR: ĐANG KIỂM TRA NGHI VẤN HACK...";
                window.strokeTextFit(ctxV, varTxt, 36, 44, 420, 21, isVerdict ? "#4ade80" : "#ffeb3b", "#000", 4);
                ctxV.restore();
            } else {
                window._varCheckActive = false;
            }
        }

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

        ctxV.restore();

        // HỘI THOẠI STORY MODE ĐƯỢC ĐỒNG BỘ 100% TỪ window.onStoryDialogueStart (StoryDialogueEngine)

        // NỀN NỬA DƯỚI MÀN HÌNH (BLIT TỨC THÌ TỪ STATIC OFFSCREEN CANVAS -> ZERO-LAG)
        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        
        if (!isOutroActive) {
            let staticBotCv = window._ensureStaticBottomCanvas(splitGameHeight);
            ctxV.drawImage(staticBotCv, 0, retainY);

            let p1Name = window.getRealCharName(window.p1, "PLAYER");
            let eName = repEnemyObj ? window.getRealCharName(repEnemyObj, "BOSS") : "BOSS";

            // 1. THANH TIẾN ĐỘ ĐỎ (Y = 609 -> 654; giữ chân người xem đến giây cuối cùng bằng mốc cốt truyện!)
            let bannerY = retainY + 2; 
            let matchSecs = (now - window.gamePhaseStartTime) / 1000;
            let fakeProgress = Math.min(0.99, (matchSecs / 60) + (1 - p1HpPct)*0.3 + (1 - p2HpPct)*0.4);
            let progPctInt = Math.floor(fakeProgress * 100);
            ctxV.fillStyle = fakeProgress >= 0.80 ? "#dc2626" : "#ff0050"; 
            ctxV.fillRect(0, bannerY, 1080 * fakeProgress, 45); 
            ctxV.font = "900 24px 'Arial Black', sans-serif"; 
            ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
            let loadingText = (fakeProgress < 0.48)
                ? `🔥 ĐANG TÍCH NỘ PHÁ GIÁP... ${progPctInt}% 🔥`
                : (fakeProgress < 0.82)
                    ? `⚠️ SẮP KÍCH HOẠT LẬT KÈO Ở 100%... ${progPctInt}% ⚡`
                    : `🚨 ĐỪNG LƯỚT QUA! GIÂY CUỐI NỔI DA GÀ... ${progPctInt}% 🤯`;
            window.strokeTextClean(ctxV, loadingText, 540, bannerY + 22, "#ffffff", "#000000", 5);

            // 1B. HIỆU ỨNG NHẤP ĐÚP THẢ TIM TRÊN SÂN ĐẤU KHI MÁU ĐỎ HOẶC KÍCH HOẠT NỘI TẠI LẬT KÈO (KHÔNG BỊ HỘP THOẠI CHE!)
            let isAwakeningBurst = (window._heartAwakeningBurstUntil && now < window._heartAwakeningBurstUntil);
            if (isAwakeningBurst || Math.min(p1HpPct, p2HpPct) < 0.38) {
                ctxV.save();
                let ctaBannerY = splitGameHeight - 28;
                let pulseHeart = 1 + Math.abs(Math.sin(now / 110)) * 0.06;
                ctxV.translate(540, ctaBannerY);
                ctxV.scale(pulseHeart, pulseHeart);
                ctxV.fillStyle = isAwakeningBurst ? "rgba(220, 38, 38, 0.92)" : "rgba(15, 23, 42, 0.86)";
                ctxV.strokeStyle = "#ffeb3b";
                ctxV.lineWidth = 3;
                if (ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-355, -20, 710, 40, 20); ctxV.fill(); ctxV.stroke(); }
                else { ctxV.fillRect(-355, -20, 710, 40); }
                ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
                let boostLabel = isAwakeningBurst
                    ? `💖 ĐÃ NHẬN TIM KHÁN GIẢ -> ${window._heartAwakeningTargetName || "IDOL"} BẬT MAX NỘ!`
                    : `👆 NHẤP ĐÚP MÀN HÌNH (THẢ TIM ❤️) TIẾP SỨC LẬT KÈO!`;
                window.strokeTextFit(ctxV, boostLabel, 0, 1, 680, 20, "#ffeb3b", "#000000", 4, "Arial");
                ctxV.restore();
            }

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
                    ctxV.drawImage(img1._mip96 || img1, p1Cx-avRadius, p1Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                }
                ctxV.beginPath(); ctxV.arc(p1Cx, p1Cy, avRadius, 0, Math.PI*2);
                ctxV.strokeStyle = "rgba(0, 243, 255, 0.28)"; ctxV.lineWidth = 13; ctxV.stroke();
                ctxV.strokeStyle = "#00f3ff"; ctxV.lineWidth = 6; ctxV.stroke();

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
                        ctxV.drawImage(img2._mip96 || img2, p2Cx-avRadius, p2Cy-avRadius, avRadius*2, avRadius*2); ctxV.restore(); 
                    }
                    ctxV.beginPath(); ctxV.arc(p2Cx, p2Cy, avRadius, 0, Math.PI*2);
                    ctxV.strokeStyle = "rgba(255, 0, 60, 0.28)"; ctxV.lineWidth = 13; ctxV.stroke();
                    ctxV.strokeStyle = "#ff003c"; ctxV.lineWidth = 6; ctxV.stroke();

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

            // 3. SÀN BẦU CHỌN TƯƠNG TÁC (CHIA PHE THẢ TIM ❤️ VS BÌNH LUẬN 💬)
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
                window.strokeTextClean(ctxV, `❤️ THẢ TIM: PHE TRÁI (${window._betPoolP1}K)`, -pollWidth/2, -18, "#00f3ff", "#000", 4);
                ctxV.textAlign = "center"; 
                window.strokeTextClean(ctxV, isComeback ? "🔥 KÈO ĐANG BIẾN ĐỘNG MẠNH 🔥" : "👆 NHẤP ĐÚP CHỌN PHE!", 0, -18, isComeback ? "#ffeb3b" : "#f8fafc", "#000", 4);
                ctxV.textAlign = "right";
                window.strokeTextClean(ctxV, `💬 CMT: PHE PHẢI (${window._betPoolP2}K)`, pollWidth/2, -18, "#ff0050", "#000", 4);
                
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

            // 4. KHOANG TRUNG TÂM (Y = 885 -> 1075): TRASH TALK CÓ GIỌNG ĐỌC / QUÀ TẶNG / 5 MINI-GAME KÍCH THÍCH THẢ TIM & CMT
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
                    if (p1HpPct < 0.44 || p2HpPct < 0.44) {
                        let lowCharName = (p1HpPct <= p2HpPct) ? p1Name : eName;
                        let pulseCTA = 1 + Math.abs(Math.sin(now / 140)) * 0.055;
                        ctxV.save(); ctxV.scale(pulseCTA, pulseCTA);
                        window.strokeTextFit(ctxV, `👆 NHẤP ĐÚP 2 LẦN BƠM MÁU CHO ${lowCharName} 💖`, 0, -16, 840, 30, "#ffeb3b", "#ff0050", 6);
                        ctxV.restore();
                        ctxV.font = "bold 22px Arial"; ctxV.fillStyle = "#cbd5e1";
                        ctxV.fillText("🚨 Thả tim ngay để kích hoạt Nội Tại Bất Tử 1 Máu & Lật Kèo!", 0, 28);
                    } else {
                        let challengeMode = Math.floor(elapsed / 4200) % 5;
                        let chKey = challengeMode + '|' + p1Name + '|' + eName;
                        if (window._challengeCardKey !== chKey || !window._challengeCardCanvas) {
                            window._challengeCardKey = chKey;
                            if (!window._challengeCardCanvas && typeof document !== 'undefined') {
                                window._challengeCardCanvas = document.createElement('canvas');
                                window._challengeCardCanvas.width = 880;
                                window._challengeCardCanvas.height = 150;
                            }
                            if (window._challengeCardCanvas) {
                                let chCtx = window._challengeCardCanvas.getContext('2d');
                                chCtx.clearRect(0, 0, 880, 150);
                                chCtx.save();
                                chCtx.translate(440, 75);
                                chCtx.textAlign = "center";
                                chCtx.textBaseline = "middle";
                                if (challengeMode === 0) {
                                    chCtx.font = "900 26px 'Arial Black'";
                                    window.strokeTextClean(chCtx, "❤️ NHẤP ĐÚP MÀN HÌNH 2 LẦN ĐỂ BẦU CHỌN IDOL!", 0, -20, "#ffeb3b", "#ff0050", 5);
                                    window.strokeTextFit(chCtx, `❤️ Thả Tim = Cổ vũ ${p1Name}  |  💬 Bình Luận = Cổ vũ ${eName}`, 0, 24, 830, 22, "#ffffff", "#000", 3, "Arial");
                                } else if (challengeMode === 1) {
                                    chCtx.font = "900 26px 'Arial Black'";
                                    window.strokeTextClean(chCtx, "🔋 SỐ CUỐI % PIN CỦA BẠN QUYẾT ĐỊNH KẾT QUẢ!", 0, -20, "#ffeb3b", "#000", 5);
                                    window.strokeTextFit(chCtx, `Số Chẵn = ${p1Name} Thắng  |  Số Lẻ = ${eName} Thắng 👇`, 0, 24, 830, 22, "#ffffff", "#000", 3, "Arial");
                                } else if (challengeMode === 2) {
                                    chCtx.font = "900 26px 'Arial Black'";
                                    window.strokeTextClean(chCtx, "📸 THỬ THÁCH: BẮT KHUNG HÌNH ẨN 0.05 GIÂY!", 0, -20, "#00f3ff", "#000", 5);
                                    chCtx.font = "bold 22px Arial"; chCtx.fillStyle = "#cbd5e1";
                                    chCtx.fillText("Bấm Tạm Dừng đúng lúc hiện huy hiệu vàng để thấy mật mã!", 0, 24);
                                } else if (challengeMode === 3) {
                                    chCtx.font = "900 26px 'Arial Black'";
                                    window.strokeTextClean(chCtx, "🎂 THÁNG SINH CỦA BẠN ĐẶT CỬA CHO AI?", 0, -20, "#4ade80", "#000", 5);
                                    window.strokeTextFit(chCtx, `Tháng 1-6 = Phe ${p1Name}  |  Tháng 7-12 = Phe ${eName} 🔥`, 0, 24, 830, 22, "#ffffff", "#000", 3, "Arial");
                                } else {
                                    chCtx.font = "900 26px 'Arial Black'";
                                    window.strokeTextClean(chCtx, "↗️ ẤN CHIA SẺ ➡️ KHÁC XEM AI HIỆN RA ĐẦU TIÊN!", 0, -20, "#f472b6", "#000", 5);
                                    chCtx.font = "bold 22px Arial"; chCtx.fillStyle = "#cbd5e1";
                                    chCtx.fillText("Người hiện ra đầu tiên chính là đối thủ định mệnh của bạn 😂", 0, 24);
                                }
                                chCtx.restore();
                            }
                        }
                        if (window._challengeCardCanvas) {
                            ctxV.drawImage(window._challengeCardCanvas, -440, -75);
                        }
                    }
                }
                ctxV.restore();
            }

            // 5. KHUNG LIVE CHAT (KHUNG VIỀN + WATERMARK + PINNED HOOK ĐÃ NƯỚNG TRONG STATIC CANVAS; CHỈ BLIT TIN NHẮN!)
            let boxWidth = 880; let boxHeight = 730; let boxX = 540; let boxY = 1490; 

            ctxV.save();
            ctxV.translate(boxX, boxY); 
            ctxV.beginPath();
            if (ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 16);
            else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
            ctxV.clip(); 
            
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
                window._chatDirty = true;
            }

            let chatH = boxHeight - 56;
            if (window._chatDirty || !window._chatBufferCanvas) {
                if (!window._chatBufferCanvas) {
                    window._chatBufferCanvas = document.createElement("canvas");
                    window._chatBufferCanvas.width = boxWidth;
                    window._chatBufferCanvas.height = chatH;
                }
                let cCtx = window._chatBufferCanvas.getContext("2d");
                cCtx.clearRect(0, 0, boxWidth, chatH);
                let curY = chatH - 16;
                let lH = 40;
                if (window._liveChats) {
                    for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                        let chat = window._liveChats[i];
                        if (!chat || !chat.lines || chat.lines.length === 0) continue;
                        if (!chat._rowCanvas && typeof document !== 'undefined') {
                            let rowH = chat.lines.length * lH + 10;
                            let rCv = document.createElement("canvas");
                            rCv.width = boxWidth;
                            rCv.height = rowH;
                            let rCtx = rCv.getContext("2d");
                            rCtx.textAlign = "left";
                            rCtx.textBaseline = "bottom";
                            rCtx.font = "bold 30px Arial";
                            let nameStr = chat.name + ":";
                            let msgCol = chat.isFighterSpeech ? "#fff3a1" : (chat.isHighlight ? "#ffeb3b" : "#ffffff");
                            if (chat.isFighterSpeech) {
                                rCtx.fillStyle = "rgba(0, 243, 255, 0.12)";
                                rCtx.fillRect(14, 2, boxWidth - 28, rowH - 4);
                                rCtx.fillStyle = chat.color || "#00f3ff";
                                rCtx.fillRect(14, 2, 6, rowH - 4);
                            }
                            for (let l = 0; l < chat.lines.length; l++) {
                                let lineBottomY = (l + 1) * lH + 2;
                                if (l === 0) {
                                    window.strokeTextClean(rCtx, nameStr, 25, lineBottomY, chat.color, "#000", 4);
                                    window.strokeTextClean(rCtx, " " + chat.lines[l], 25 + chat.nameWidth, lineBottomY, msgCol, "#000", 4);
                                } else {
                                    window.strokeTextClean(rCtx, " " + chat.lines[l], 25 + chat.nameWidth, lineBottomY, msgCol, "#000", 4);
                                }
                            }
                            chat._rowCanvas = rCv;
                            chat._rowH = rowH;
                        }
                        if (chat._rowCanvas) {
                            let topY = curY - chat._rowH;
                            if (topY < -chat._rowH + 10) break;
                            cCtx.drawImage(chat._rowCanvas, 0, topY);
                            curY = topY - 6;
                            if (curY < 0) break;
                        }
                    }
                }
                window._chatDirty = false;
            }
            if (window._chatBufferCanvas) {
                ctxV.drawImage(window._chatBufferCanvas, -boxWidth/2, -boxHeight/2 + 56);
            }
            ctxV.restore(); 

            if (window._floatingHearts.length < 6 && Math.random() < 0.25) {
                const emojis = ["❤️", "🔥", "💖", "😱"];
                window._floatingHearts.push({
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    x: 1025 + (Math.random() - 0.5) * 30,
                    y: 1840,
                    vy: -3.5 - Math.random() * 2.5,
                    life: 1.0
                });
            }
            if (window._floatingHearts.length > 0) {
                ctxV.save();
                for (let i = window._floatingHearts.length - 1; i >= 0; i--) {
                    let fh = window._floatingHearts[i];
                    fh.y += fh.vy; fh.life -= 0.025;
                    ctxV.globalAlpha = Math.max(0, fh.life);
                    let hSp = (typeof window.getTextSpriteCached === 'function')
                        ? window.getTextSpriteCached(fh.emoji, "32px Arial", "#ffffff", "", 0)
                        : null;
                    if (hSp) {
                        ctxV.drawImage(hSp.cv, fh.x - hSp.w * 0.5, fh.y - hSp.h * 0.75, hSp.w, hSp.h);
                    } else {
                        ctxV.font = "32px Arial";
                        ctxV.textAlign = "center";
                        ctxV.fillText(fh.emoji, fh.x, fh.y);
                    }
                    if (fh.life <= 0) window._floatingHearts.splice(i, 1);
                }
                ctxV.restore();
            }
            
        } else {
            // ==========================================
            // OUTRO STORYBOOK: ĐỒNG BỘ MÀU CỔ ĐIỂN TỐI GIẢN VỚI INTRO ĐỂ LẬT TRANG LOOP MƯỢT 100%
            // ==========================================
            let outroAlpha = Math.min(1, (window.matchEndTimer - 85) / 35); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            
            if (!window._outroQuotesC) {
                window._outroQuotesC = window.buildCharacterOutroQuote();
                if (window.GoogleStoryTTS && typeof window.GoogleStoryTTS.playOutroVoice === "function") {
                    let isP1Winner = !!(window.p1 && window.p1.hp > 0);
                    window.GoogleStoryTTS.playOutroVoice(isP1Winner);
                }
            }

            let outroPaperCv = window._ensureVintagePaperCanvas(1080, 1920);
            ctxV.drawImage(outroPaperCv, 0, 0);
            
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
                    window.strokeTextClean(ctxV, "📜 HỒI KẾT TRẬN ĐẤU 📜", cx, 180, "#fff", "#000", 12);

                    ctxV.fillStyle = "#8b0000"; ctxV.font = "italic 900 48px 'Times New Roman', serif";
                    let nextY = drawWrap(window._outroQuotesC.c, cx, 290, 880, 60);
                    
                    ctxV.fillStyle = "#222222"; ctxV.font = "italic 36px 'Times New Roman', serif";
                    nextY = drawWrap(window._outroQuotesC.s, cx, nextY + 60, 840, 48);

                    let winnerObj = (window.p1 && window.p1.hp > 0) ? window.p1 : (window.enemies && window.enemies[0] ? window.enemies[0] : window.p1);
                    let winnerName = window.getRealCharName(winnerObj, "MVP");
                    let winDance = window.DanceEngine ? window.DanceEngine.currentWinDance : "dance_siuuuu";

                    ctxV.save();
                    ctxV.translate(540, 930);
                    ctxV.scale(2.0, 2.0);

                    ctxV.save();
                    ctxV._vintageColorActive = true;
                    window._vintageRenderMode = 'sepia';
                    try {
                        if (window.DanceEngine) {
                            window.DanceEngine.drawDancer(ctxV, winnerObj, 0, 100, true, 3.55, winDance);
                        } else {
                            ctxV.translate(0, 100);
                            let clone = Object.assign({}, winnerObj, {x:0, y:0, scale: 3.55, isFacingRight: true, state: 'idle', hideHpBar: true, iFrames: 0, shield: 0, superArmor: 0, attackTimer: 0, attackTrail: []});
                            if (typeof window.drawStickman === 'function') window.drawStickman(ctxV, clone);
                        }
                    } finally {
                        ctxV._vintageColorActive = false;
                        window._vintageRenderMode = null;
                        ctxV.restore();
                    }

                    ctxV.save();
                    ctxV.translate(0, -165);
                    ctxV.textAlign = "center";
                    window.strokeTextFit(ctxV, "🏆 MVP: " + winnerName, 0, 0, 460, 28, "#111", "#fff", 4);
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
                        ctxV.translate(800, 1080);
                        ctxV.rotate(-0.2);
                        ctxV.scale(stampScale, stampScale);
                        ctxV.strokeStyle = "rgba(220, 38, 38, 0.85)"; ctxV.lineWidth = 6;
                        ctxV.beginPath(); ctxV.arc(0, 0, 90, 0, Math.PI*2); ctxV.stroke();
                        ctxV.beginPath(); ctxV.arc(0, 0, 75, 0, Math.PI*2); ctxV.stroke();
                        ctxV.fillStyle = "rgba(220, 38, 38, 0.85)";
                        ctxV.font = "900 24px 'Arial Black'"; ctxV.fillText("CHƠI NGAY", 0, -10);
                        ctxV.font = "900 20px 'Arial Black'"; ctxV.fillText("TRÊN BIO!", 0, 20);
                        ctxV.restore();
                    }

                    // 1 KHUNG KÊU GỌI DUY NHẤT - GỌN, SANG & NỔI BẬT TUYỆT ĐỐI
                    let ctaY = 1425;
                    let pulseScale = 1 + Math.sin(now / 110) * 0.032;
                    ctxV.save();
                    ctxV.translate(cx, ctaY);
                    ctxV.scale(pulseScale, pulseScale);

                    ctxV.fillStyle = "#111111";
                    if (ctxV.roundRect) {
                        ctxV.beginPath(); ctxV.roundRect(-435, -62, 870, 124, 62); ctxV.fill();
                    } else {
                        ctxV.fillRect(-435, -62, 870, 124);
                    }
                    ctxV.lineWidth = 5;
                    ctxV.strokeStyle = "#ef4444";
                    if (ctxV.roundRect) {
                        ctxV.beginPath(); ctxV.roundRect(-435, -62, 870, 124, 62); ctxV.stroke();
                    } else {
                        ctxV.strokeRect(-435, -62, 870, 124);
                    }

                    ctxV.textAlign = "center";
                    ctxV.textBaseline = "middle";
                    window.strokeTextFit(
                        ctxV,
                        `🎮 VÀO TRANG CÁ NHÂN ${window.CREATOR_HANDLE} ĐỂ CHƠI GAME!`,
                        0, -12, 810, 34, "#ffeb3b", "#000000", 6
                    );
                    window.strokeTextFit(
                        ctxV,
                        "👆 Bấm Link trên Bio (Tiểu sử) • Chơi miễn phí ngay!",
                        0, 28, 780, 23, "#ffffff", "#000000", 4
                    );
                    ctxV.restore();

                    ctxV.lineWidth = 5; ctxV.strokeStyle = "#1a1a1a"; ctxV.strokeRect(48, 64, 984, 1792);
                }
            } else {
                // CẦU NỐI SEAMLESS LOOP KHỚP TỪNG PIXEL VỚI GIÂY 0.0 CỦA INTRO
                if (!window._loopSfxPlayed) {
                    window._loopSfxPlayed = true;
                    window.playViralSfx("pageflip");
                }
                let bridgeProg = Math.min(1, (window.matchEndTimer - 195) / 30);
                window.drawProceduralIntro(ctxV, 1080, 1920, 0.02);

                let flipX = 1080 * (1 - bridgeProg);
                if (flipX > 0) {
                    let pageGrad = ctxV.createLinearGradient(flipX - 80, 0, flipX + 40, 0);
                    pageGrad.addColorStop(0, "rgba(0,0,0,0)");
                    pageGrad.addColorStop(0.5, "rgba(0,0,0,0.35)");
                    pageGrad.addColorStop(1, "#f2ece1");
                    ctxV.fillStyle = pageGrad;
                    ctxV.fillRect(flipX - 80, 0, 120, 1920);
                }

                ctxV.save();
                ctxV.translate(540, 1450);
                ctxV.strokeStyle = "#ef4444";
                ctxV.lineWidth = 10;
                ctxV.beginPath(); ctxV.arc(0, 0, 95, 0, Math.PI * 2); ctxV.stroke();
                ctxV.scale(1.4, 1.4);
                ctxV.font = "900 135px 'Impact', sans-serif";
                ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
                window.strokeTextClean(ctxV, "3", 0, 0, "#ef4444", "#ffffff", 18);
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
        let dynamicDelay = isHypeMoment ? (380 + Math.random() * 340) : (950 + Math.random() * 1600); 

        if (now - window._lastChatUpdate > dynamicDelay) { 
            window._lastChatUpdate = now; 
            window._nextChatDelay = dynamicDelay; 
            
            let ctxType = isBaitActive ? "bait" : ((isClimaxTension || isUltZoom) ? "climax" : "normal");
            let newChat = window.generateLiveChatEvent(ctxType);
            window.precalcChatText(newChat, ctxV);
            window._liveChats.push(newChat); 
            if (window._liveChats.length > 12) window._liveChats.shift(); 
            window._chatDirty = true; 
            
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
            if (al._w === undefined) al._w = ctxV.measureText(al.text).width;
            let textW = al._w; ctxV.translate(alertStartX, alertStartY_Left - al.yOffset); 
            ctxV.fillStyle = "rgba(0, 0, 0, 0.7)"; 
            if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(0, -18, textW + 28, 36, 18); ctxV.fill(); } else { ctxV.fillRect(0, -18, textW + 28, 36); } 
            ctxV.fillStyle = "#fff"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 14, 0); ctxV.restore(); 
            if (al.life <= 0) window._liveAlerts.splice(i, 1);
        }

        if (typeof window._fakeViewers !== "undefined") {
            ctxV.save(); let badgeY = splitGameHeight - 28; let badgeX = 1064; 
            ctxV.font = "bold 20px 'Arial Black'";
            if (window._lastFormattedViewers !== window._fakeViewers) {
                window._lastFormattedViewers = window._fakeViewers;
                window._fakeViewersStr = "👁️ " + window._fakeViewers.toLocaleString();
                window._fakeViewersWidth = ctxV.measureText(window._fakeViewersStr).width;
            }
            let viewStr = window._fakeViewersStr; let viewW = window._fakeViewersWidth;
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

    } finally {
        ctxV.restore();
    }

    window._capturedFrameCount = (window._capturedFrameCount || 0) + 1;
    if (window._useManualTrackRequest) {
        if (window.videoTrackV && typeof window.videoTrackV.requestFrame === 'function') {
            window.videoTrackV.requestFrame();
        } else if (window._videoStreamRef && typeof window._videoStreamRef.requestFrame === 'function') {
            window._videoStreamRef.requestFrame();
        }
    }
};

window.escapeHtmlSafe = function(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("✅ Đã chép Tiêu đề & Thẻ Tag! Giờ bạn có thể dán thẳng lên TikTok/YouTube Shorts.");
    });
};

window.copyVideoPostKit = function(vidId) {
    let vid = (window.savedVideos || []).find(v => v.id === vidId);
    if (!vid) return;
    let headline = vid.viralHeadline || vid.viralTitle || "";
    let tags = vid.viralTags || "";
    let captionOnly = tags ? `${headline} ${tags}`.trim() : headline.trim();
    window.copyToClipboard(captionOnly);
};

window.regenerateVideoCaption = function(vidId) {
    let vid = (window.savedVideos || []).find(v => v.id === vidId);
    if (!vid || !window.StoryModeAI) return;
    let pack = window.StoryModeAI.buildCompactViralPack(vid.heroName, vid.enemyName || "BOSS");
    vid.viralHeadline = pack.headline;
    vid.viralTags = pack.tags;
    vid.viralTitle = pack.full;
    vid.safeFileName = window.sanitizeFileName(pack.headline);
    if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
};

window.mergeAndDownloadVideo = function(vidId) {
    let vid = window.savedVideos.find(v => v.id === vidId);
    if (!vid) return;
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = vid.urlV;
    a.download = "[GAMENHUCLONE_60FPS]_" + vid.safeFileName + "." + vid.ext;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); }, 200);
};

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { 
        container = document.createElement("div"); 
        container.id = "video-list-container"; 
        container.style.cssText = "margin-top: 35px; padding: 30px; background: rgba(15, 23, 42, 0.96); border-radius: 16px; border: 1px solid rgba(255,255,255,0.12); max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 99999; position: relative;"; 
        let gameContainer = document.getElementById("game-container"); 
        if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); 
    }
    
    if (window.savedVideos.length === 0) { 
        container.innerHTML = `<div style="text-align: center; padding: 20px;"><h3 style="margin: 0 0 10px 0; color: #00f3ff; font-weight: 800; letter-spacing: 1px; font-size: 28px;">🎬 TIKTOK STUDIO (${window.CREATOR_HANDLE})</h3><p style="color: #94a3b8; margin: 0; font-size: 15px;">Chưa có video nào. Hãy chiến đấu để tạo siêu phẩm 60FPS kèm câu chuyện riêng!</p></div>`; 
        return; 
    }
    
    let html = `<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #fff; font-weight: 800; letter-spacing: 1px; font-size: 24px;"><span style="color:#00f3ff;">🎬 TIKTOK</span> STUDIO (${window.CREATOR_HANDLE})</h3>
                    <span style="background: rgba(0,243,255,0.12); color: #00f3ff; padding: 5px 12px; border-radius: 20px; font-size: 13.5px; font-weight: 700;">${window.savedVideos.length} Videos • 720x1280 60FPS Mượt</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 18px; max-height: 760px; overflow-y: auto; padding-right: 10px;">`;
    
    window.savedVideos.forEach((vid) => { 
        let badgeExt = (vid.ext || "mp4").toUpperCase();
        let durBadge = vid.durationSec ? ` • ${vid.durationSec}s` : "";
        let vsSub = vid.enemyName ? `${window.escapeHtmlSafe(vid.heroName)} ⚔️ ${window.escapeHtmlSafe(vid.enemyName)}` : window.escapeHtmlSafe(vid.heroName);
        let displayHeadline = vid.viralHeadline || vid.viralTitle || "";
        let displayTags = vid.viralTags || "";
        let fullCaptionLen = (displayTags ? `${displayHeadline} ${displayTags}`.trim() : displayHeadline.trim()).length;

        html += `<div style="display: flex; flex-direction: column; gap: 14px; background: rgba(30, 41, 59, 0.76); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; gap: 20px;">
                        <div style="position: relative; width: 130px; height: 130px; flex-shrink: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; background: #000;">
                            <img src="${vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: contain;">
                            <span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.78); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${vid.timestamp}</span>
                            <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0, 243, 255, 0.22); border: 1px solid rgba(0, 243, 255, 0.55); color: #00f3ff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 800;">${badgeExt} • 60FPS${durBadge}</span>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                            <div>
                                <span style="font-weight: 800; color: #fff; font-size: 18px; display: block; margin-bottom: 8px; line-height: 1.38;">${window.escapeHtmlSafe(displayHeadline)}</span>
                                ${displayTags ? `<div style="font-size: 13.5px; color: #38bdf8; font-weight: 700; line-height: 1.45; margin-bottom: 10px; background: rgba(15, 23, 42, 0.65); padding: 8px 11px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.22); word-break: break-word;">${window.escapeHtmlSafe(displayTags)}</div>` : ""}
                                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13.5px; color: #94a3b8; font-weight: 500;">
                                    <img src="${vid.heroAvatar}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #334155;"> 
                                    <span style="color: #cbd5e1;">${vsSub}</span>
                                    <span style="background: rgba(34, 197, 94, 0.14); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.35); padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 700;">✅ ${fullCaptionLen}/100 ký tự • Chuẩn YouTube & TikTok</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px;">
                                <button onclick="window.copyVideoPostKit(${vid.id})" style="background: rgba(59, 130, 246, 0.16); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.42); padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px;">📋 Chép Caption</button>
                                <button onclick="window.regenerateVideoCaption(${vid.id})" style="background: rgba(168, 85, 247, 0.14); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.38); padding: 10px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px;">🎲 Đổi Caption & Tag</button>
                                <button id="btn-dl-${vid.id}" onclick="window.mergeAndDownloadVideo(${vid.id})" style="background: #00f3ff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 800; flex: 1; cursor:pointer; box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3);">🚀 TẢI TIKTOK 60FPS NGAY</button>
                                <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
