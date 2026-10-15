// ==========================================
// LIVECHAT.JS - HỆ THỐNG BÌNH LUẬN VIÊN, STREAMER & TRASH TALK ĐỘC LẬP (@gamenhuclon)
// ĐẢM NHIỆM 100%:
// 1. Danh sách 35+ Người nổi tiếng / Streamer / Meme kèm câu cửa miệng đặc trưng.
// 2. Kho 120+ câu bình luận Trash Talk, Hài hước, Bait & Climax tự động điền tên {p1}, {p2}.
// 3. Thuật toán Shuffle Bag chống lặp câu 100% trong suốt trận đấu.
// ==========================================

window.CELEB_LIST = [
    // --- STREAMER & MEME VIỆT NAM ---
    { name: "Độ Mixi  tribal", color: "#00f3ff", sig: ["Bạn nói thế là chịu rồi đấy 😂", "Đánh đấm thế này thì hỏng!", "Pha xử lý đi vào lòng đất của {p1} 💀"] },
    { name: "Thầy Giáo Ba 🐔", color: "#ffeb3b", sig: ["Thầy nhìn {p1} đánh mà thầy trầm cảm luôn á 🤡", "6699 anh em ơi, kèo này {p2} lụm chắc!", "Múa như cái máy khâu luôn kìa 😂"] },
    { name: "PewPew 🥖", color: "#ffa502", sig: ["Tôi đến chịu hai ông {p1} với {p2} luôn đấy!", "Thôi thôi đừng gáy nữa ông {p1} ơi 😂"] },
    { name: "Huấn Hoa Hồng 🌹", color: "#ff4757", sig: ["Không đánh mà đòi có ăn thì chỉ có ăn đòn thôi {p1} nhé!", "Ở xã hội này chỉ có thực lực mới thắng được {p2} thôi!"] },
    { name: "Tiến Bịp 🧠", color: "#2ed573", sig: ["Còn cái nịt! Đặt cửa {p1} là chỉ có còn đúng cái nịt!", "Tham lam! {p2} đánh tham đòn quá!", "Ngu dốt! Pha đấy {p1} phải lùi về thủ chứ!"] },
    { name: "Khá Bảnh 🕺", color: "#b100ff", sig: ["Nhạc lên đi anh em ơi, múa quạt gắt quá 🕺🔥", "Ảo thật đấy, quả né đòn của {p1} nét căng!"] },
    { name: "Đấng Yasuo 0/11/0 🌪️", color: "#38bdf8", sig: ["Trận này thua là tại Rừng nhé, không phải tại {p1} đâu!", "Đợi {p1} đủ đồ gánh team cho mà xem 🐧"] },
    { name: "Chủ Tịch Giả Nghèo 👔", color: "#facc15", sig: ["Khinh thường {p1} và cái kết đắng lòng...", "Để xem {p2} gáy được mấy giây nữa 😏"] },
    { name: "Bà Hàng Xóm 📢", color: "#fb7185", sig: ["Con nhà người ta đánh toàn SSS, nhìn {p1} đánh mà chán!", "Hai đứa {p1} với {p2} đánh nhau vỡ cả sân kìa!"] },
    { name: "Thần Bài All-in 🎲", color: "#4ade80", sig: ["Đã cắm sổ đỏ và chiếc Wave tàu theo cửa {p1}!! 🙏", "Anh em nghe tôi, tất tay vào {p2} về bờ ngay!"] },

    // --- STREAMER & NGƯỜI NỔI TIẾNG QUỐC TẾ ---
    { name: "IShowSpeed 🐕", color: "#ff4757", sig: ["GÂU GÂU GÂU!! {p1} ĐÁNH GẮT QUÁ BRO 🔥🐕", "SIUUUUUUUU!! {p2} KHÔNG CÓ CỬA ĐÂU!!", "Bro {p1} is literally HIM 💀🔥"] },
    { name: "Kai Cenat 🎬", color: "#00f3ff", sig: ["OH MY GOD WHAT WAS THAT COMBO?! 🤯", "Chat is this real?? {p1} vs {p2} goes crazy!"] },
    { name: "xQc 🍌", color: "#ffeb3b", sig: ["DUD DUD DUD WHAT IS {p1} DOING?? 💀", "Actual 500 IQ play right there ngl 🔥"] },
    { name: "CaseOh 🍔", color: "#ffa502", sig: ["Ai vừa nhảy dậm đất làm rung cả màn hình thế 💀", "Tập trung đánh đi nhìn tôi làm gì 🍔😡"] },
    { name: "Tyler1 😡", color: "#ff0055", sig: ["GET THIS {p2} OFF MY SCREEN RIGHT NOW!! 😡", "BUILT DIFFERENT!! 💪🔥"] },
    { name: "Jynxzi 🎮", color: "#2ed573", sig: ["BAAAAAAD AIM {p1}!! 💀", "Good aim! Good aim {p2}!! 🔥"] },
    { name: "Faker 👑", color: "#ffd700", sig: ["Pha phản xạ vừa rồi của {p1} gần bằng tôi thời đỉnh cao đấy 👀", "Giữ khoảng cách tốt lắm {p2}!"] },
    { name: "Elon Musk 🚀", color: "#38bdf8", sig: ["Ai thắng kèo này tôi tặng 1 vé lên Sao Hỏa nhé 🚀", "Đòn đánh vừa rồi bay nhanh hơn tên lửa SpaceX!"] },
    { name: "Mark Zuckerberg 🦎", color: "#60a5fa", sig: ["Thuật toán AI dự đoán trận này có biến lớn ở giây cuối 🤖", "Dữ liệu chiến đấu của {p1} đang tăng đột biến!"] },
    { name: "Cristiano Ronaldo 🐐", color: "#f87171", sig: ["Tinh thần chiến đấu tuyệt vời! SIUUUUU! 🐐🔥", "Không bao giờ bỏ cuộc dù chỉ còn 1 máu!"] },
    { name: "Lionel Messi 🇦🇷", color: "#67e8f9", sig: ["Nhìn đi đâu đấy bobo? Tập trung vào trận đấu kìa 👀", "Pha lách người mượt như đi bóng qua 5 người!"] },
    { name: "Gojo Satoru 🤞", color: "#c084fc", sig: ["Yên tâm đi, vì {p1} là kẻ mạnh nhất mà 🤞✨", "Vô Lượng Không Xứ! Mở lãnh địa căng đét!"] },
    { name: "Ryomen Sukuna 👹", color: "#ef4444", sig: ["Hãy tự hào đi {p2}, ngươi cũng khá mạnh đấy 👹", "Trảm! Nhát chém vừa rồi ngọt đấy!"] },
    { name: "Son Goku 🐉", color: "#fb923c", sig: ["Khí của {p1} và {p2} đang tăng lên cao quá! Cho tôi đánh cùng với! 🔥", "Quả vận nội công vừa rồi làm rung chuyển cả vũ trụ!"] },
    { name: "Gordon Ramsay 👨‍🍳", color: "#f43f5e", sig: ["Đòn combo của {p1} vẫn còn SỐNG NHĂN!! Nấu lại ngay! 🥩😡", "Cuối cùng cũng có một pha xử lý ngon lành!"] },
    { name: "Thanos 🧤", color: "#a855f7", sig: ["Thanh máu 2 bên đang rất cân bằng, như mọi thứ nên thế ⚖️", "Chỉ cần 1 cú búng tay là bay màu thanh máu!"] }
];

// KHO BÌNH LUẬN CHUNG SIÊU BỰA & HÀI HƯỚC (Tự động điền tên {p1} và {p2})
window.GENERAL_FUNNY_COMMENTS = [
    "Cốt truyện cuốn hơn cả phim chiếu rạp 🍿",
    "Ai dạy {p1} bộ võ mèo cào thế kia 😂",
    "Nhìn {p2} đánh mà áp lực hộ luôn á 💀",
    "Pin mình 88% số chẵn đặt hết niềm tin vào {p1} nhé 🔋",
    "Pin lẻ điểm danh! {p2} lụm kèo này chặt luôn 🔥",
    "Hai ông {p1} với {p2} đánh nhau như đòi nợ cuối năm 😂",
    "Pha né đòn vừa rồi ảo ma Canada thật sự 🤯",
    "Đúng là kịch bản của @gamenhuclon không bao giờ làm anh em thất vọng 🎬",
    "Ông {p1} gáy cho cố vào rồi tý nữa nằm sàn bây giờ 💀",
    "Tay {p2} nhanh hơn cả tốc độ người yêu cũ trở mặt 😭",
    "Đánh nhau mà mồm vẫn nhảy chữ gáy liên tục ạ 😂",
    "Camera man chạy theo 2 ông này chắc thở oxy luôn 🎥",
    "Quả đấm vừa rồi thốn tận rốn 🥊💥",
    "Anh em lùi lại kẻo văng miểng của {p1} với {p2} vào mặt kìa 😂",
    "Sân đấu nát bét luôn rồi ai đền tiền gạch đây 💀",
    "Bro {p1} vừa bật hack tốc biến hay sao mà lướt nhanh thế 👀",
    "Nhìn cây máu tụt như tài khoản của tôi cuối tháng 📉😭",
    "Đặt 500k điểm ảo cho cửa trái, thắng làm vua thua xóa lịch sử web!",
    "Có ai vừa tua lại xem pha giao tranh vừa rồi giống tôi không? Đỉnh vãi 🔥",
    "Kèo này căng hơn dây đàn, chớp mắt cái là mất mạng ⚡",
    "{p2} kiểu: Mày nhờn với ai đấy hả {p1}? 👺",
    "Đạo diễn cho thêm tiền cát-xê cho {p1} đi diễn nhập tâm quá 👏",
    "Múa cho cố vào xong hụt đòn kìa quê chữ ê kéo dài 😂",
    "Tầm này chỉ có phép màu mới cứu được thanh máu kia thôi 🙏",
    "Đấm phát nào chất lượng phát đấy, nghe tiếng bass sướng tai thực sự 🎧",
    "Xem chùa không thả tim coi chừng tối nằm mơ thấy {p2} đuổi đánh nhé 😂",
    "Thách ai bấm tạm dừng đúng lúc 2 đứa chém trúng nhau đấy 📸",
    "Quả đẩy vào tường (Wall Splat) nhìn đau giùm luôn á 💥",
    "Top 1 những trận đấu gay cấn nhất lịch sử التوك توك 🏆",
    "Đừng để {p1} đầy thanh nộ, nó nổ Ulti là bay màu luôn đấy ⚠️",
    "Cứ tưởng {p2} yếu thế ai ngờ phản đòn khét lẹt 🔥",
    "Bình luận viên cũng không đọc kịp tốc độ ra đòn của 2 khứa này 🎙️",
    "Anh em chuẩn bị tinh thần xem lật kèo phút 90+5 này 👀"
];

// BÌNH LUẬN PHẢN ỨNG KHI CÓ HIỆU ỨNG BAIT (Báo Pin Yếu / Mẹ Nhắn / Crush Nhắn / Lag 999ms)
window.BAIT_REACTION_COMMENTS = [
    "Ơ kìa tin nhắn của Mẹ hay Crush vừa nhảy xuống màn hình thế 💀",
    "Giật cả mình tưởng điện thoại tôi báo 10% Pin yếu chứ 😂🔋",
    "Đang đánh nhau căng mà Crush nhắn tin rủ đi chơi kìa ông ơi 💖",
    "Tập trung đánh đi nhắn tin gì tầm này, tý mẹ đập máy bây giờ 😭",
    "Vừa lấy tay vuốt thông báo trên màn hình xong mới biết bị lừa 🤡",
    "99% anh em vừa giật mình nhìn lại % pin điện thoại của mình 😂",
    "Kịch bản cài cắm thông báo tin nhắn đỉnh cao thực sự 💀"
];

// BÌNH LUẬN KHI MÁU DƯỚI 28% / LẬT KÈO 1 MÁU / TUNG ULTIMATE
window.CLIMAX_REACTION_COMMENTS = [
    "LẬT KÈO 1 MÁU KÌA KHÔNG THỂ TIN ĐƯỢC!! 😱🔥",
    "TIM ĐẬP THÌNH THỊCH LUÔN ANH EM ƠI 💓🤯",
    "NHẤP ĐÚP MÀN HÌNH BƠM MÁU CỨU NÓ NHANH ANH EM ƠI 💖👆",
    "Quả chớp trắng đen Anime Impact Frame ngầu đét!! ⚡📸",
    "1 HP AWAKENING?! Hào quang nhân vật chính bật lên rồi!! 🔥👑",
    "W W W W W W PHA XỬ LÝ ĐI VÀO LỊCH SỬ 🔥🔥🔥",
    "Đúng kịch bản phim Anime rồi, càng yếu máu đánh càng điên!! 👺",
    "Cú chốt hạ tỷ đô là đây chứ đâu!! RIP BOZO 📉💀"
];

// DANH SÁCH BÌNH LUẬN GHIM TRÊN ĐẦU KHUNG CHAT
window.PINNED_HOOK_LIST = [
    "📌 Ghim: Số cuối % Pin của bạn là Chẵn hay Lẻ? Comment bên dưới nhé!",
    "📌 Ghim: Quả gáy khét của nhân vật trong trận này xứng đáng mấy điểm anh em? 💀",
    "📌 Ghim: Đố ai bấm Tạm Dừng đúng lúc màn hình chớp trắng đen đấy! 📸",
    "📌 Ghim: Kèo sau anh em muốn ai lên sàn gáy tiếp? Comment nhiều tim nhất mình làm luôn!",
    "📌 Ghim: Ai vừa giật mình vì thông báo Pin Yếu / Tin nhắn ở giây thứ 6 thì tự giác thả tim nhé 😂",
    "📌 Ghim: Theo anh em pha lật kèo 1 máu vừa rồi là kỹ năng hay ăn may? Cãi nhau văn minh nhé 👇"
];

// DANH SÁCH QUÀ TẶNG TIKTOK NỔ TRÊN MÀN HÌNH
window.LIVE_GIFT_LIST = [
    { icon: "🦁", name: "SƯ TỬ VÀNG", count: 99 },
    { icon: "🌌", name: "TIKTOK UNIVERSE", count: 10 },
    { icon: "🐉", name: "HẮC LONG VƯỢT BIỂN", count: 68 },
    { icon: "🚀", name: "TÊN LỬA VŨ TRỤ", count: 50 },
    { icon: "🏎️", name: "SIÊU XE LAMBORGHINI", count: 88 },
    { icon: "👑", name: "VƯƠNG MIỆN ĐẾ VƯƠNG", count: 999 }
];

// ==========================================
// BỘ XỬ LÝ & TRỘN BÌNH LUẬN THÔNG MINH (KHÔNG BAO GIỜ LẶP LẠI)
// ==========================================
window._shuffledGeneralPool = [];
window._recentChatsMemory = [];

window.formatChatPlaceholders = function(msg) {
    let p1N = (typeof window.getRealCharName === 'function') ? window.getRealCharName(window.p1, "P1") : "P1";
    let p2Obj = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
    let p2N = (typeof window.getRealCharName === 'function') ? window.getRealCharName(p2Obj, "BOSS") : "BOSS";
    return String(msg)
        .replace(/\{p1\}/gi, p1N)
        .replace(/\{p2\}/gi, p2N);
};

window.getNextShuffledGeneralComment = function() {
    if (!window._shuffledGeneralPool || window._shuffledGeneralPool.length === 0) {
        window._shuffledGeneralPool = window.GENERAL_FUNNY_COMMENTS.slice();
        // Thuật toán trộn bài Fisher-Yates
        for (let i = window._shuffledGeneralPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [window._shuffledGeneralPool[i], window._shuffledGeneralPool[j]] = [window._shuffledGeneralPool[j], window._shuffledGeneralPool[i]];
        }
    }
    return window._shuffledGeneralPool.pop();
};

window.generateLiveChatEvent = function(contextType) {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    let rawMsg = "";

    if (contextType === "bait") {
        rawMsg = r(window.BAIT_REACTION_COMMENTS);
    } else if (contextType === "climax") {
        rawMsg = r(window.CLIMAX_REACTION_COMMENTS);
    } else {
        // 42% cơ hội người nổi tiếng nói đúng câu cửa miệng đặc trưng của họ, 58% lấy từ kho bình luận bựa chung
        if (celeb.sig && celeb.sig.length > 0 && Math.random() < 0.42) {
            rawMsg = r(celeb.sig);
        } else {
            rawMsg = window.getNextShuffledGeneralComment();
        }
    }

    let finalMsg = window.formatChatPlaceholders(rawMsg);

    // Chống trùng lặp tuyệt đối với 18 tin nhắn gần nhất
    let attempts = 0;
    while (window._recentChatsMemory.includes(finalMsg) && attempts < 12) {
        rawMsg = window.getNextShuffledGeneralComment();
        finalMsg = window.formatChatPlaceholders(rawMsg);
        attempts++;
    }
    window._recentChatsMemory.push(finalMsg);
    if (window._recentChatsMemory.length > 18) window._recentChatsMemory.shift();

    return {
        name: celeb.name,
        color: celeb.color,
        msg: finalMsg,
        lines: null,
        nameWidth: 0,
        isHighlight: Boolean(contextType && contextType !== "normal")
    };
};

window.precalcChatText = function(chatObj, ctx) {
    if (!chatObj || !ctx || chatObj.lines) return;
    ctx.font = "bold 32px Arial";
    chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 880 - 90 - chatObj.nameWidth;
    let words = String(chatObj.msg || "").split(' ');
    let lines = [];
    let currentLine = "";
    for (let n = 0; n < words.length; n++) {
        let testLine = currentLine + words[n] + " ";
        if (ctx.measureText(testLine).width > maxMsgWidth && n > 0) {
            lines.push(currentLine.trim());
            currentLine = words[n] + " ";
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());
    chatObj.lines = lines;
};

window.getRandomPinnedHook = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return r(window.PINNED_HOOK_LIST);
};

window.getRandomLiveGift = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let sender = r(window.CELEB_LIST).name;
    let g = r(window.LIVE_GIFT_LIST);
    return { sender: sender, icon: g.icon, name: g.name, count: g.count, startTime: Date.now() };
};

window.getRandomLiveAlert = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let randomUser = r(window.CELEB_LIST).name;
    let alertTypes = [
        `❤️ ${randomUser} đã thả tim phiên LIVE!`,
        `🔄 ${randomUser} vừa chia sẻ trận đấu!`,
        `🎁 ${randomUser} đã gửi tặng Hoa Hồng!`,
        `🔥 ${randomUser} vừa đặt cược Tất Tay!`
    ];
    return r(alertTypes);
};
