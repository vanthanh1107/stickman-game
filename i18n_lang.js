// ==========================================
// I18N_LANG.JS - HỆ THỐNG ĐA NGÔN NGỮ TOÀN DIỆN (VI / EN / KO / JA)
// ĐẢM NHIỆM 100%:
// 1. Hiển thị Màn hình Chọn Ngôn Ngữ đầu tiên khi vào game + Nút đổi ngôn ngữ nhanh góc màn hình.
// 2. Dịch tự động Giao diện Web, Sảnh Online, Nút bấm điều khiển, Tên Kỹ Năng & Đòn Võ Thuật.
// 3. Dịch toàn bộ Intro Nhật Báo, Tội danh, Bong bóng thoại, Check VAR, Tin nhắn Bait, Live Chat & Trash Talk của nhân vật.
// 4. Sử dụng bộ nhớ đệm O(1) (Zero-lag) giữ nguyên tốc độ 60FPS cho Canvas và Recorder.
// ==========================================

window.currentLang = localStorage.getItem("stickman_game_lang") || "vi";
window._i18nCache = new Map();

// ==========================================
// 1. TỪ ĐIỂN ĐÒN ĐÁNH, KỸ NĂNG & HIỆU ỨNG TRONG TRẬN (CANVAS & FLOATING TEXTS)
// ==========================================
window.I18N_COMBAT_DICT = {
    // Đòn thế & Trạng thái võ thuật
    "⚡ EVADED!": { vi: "⚡ NÉ ĐÒN!", en: "⚡ EVADED!", ko: "⚡ 완벽 회피!", ja: "⚡ 完全回避!" },
    "⚡ COMBO BREAKER!": { vi: "⚡ PHÁ COMBO!", en: "⚡ COMBO BREAKER!", ko: "⚡ 콤보 브레이커!", ja: "⚡ コンボブレイク!" },
    "💔 GUARD CRUSH!": { vi: "💔 VỠ KHIÊN!", en: "💔 GUARD CRUSH!", ko: "💔 가드 크러시!", ja: "💔 ガードクラッシュ!" },
    "🛡️ PARRY COUNTER!": { vi: "🛡️ PHẢN ĐÒN!", en: "🛡️ PARRY COUNTER!", ko: "🛡️ 패링 반격!", ja: "🛡️ パリィ反撃!" },
    "🔥 MIRACLE 1 HP! AWAKENING!": { vi: "🔥 KỲ TÍCH 1 MÁU! THỨC TỈNH!", en: "🔥 MIRACLE 1 HP! AWAKENING!", ko: "🔥 기적의 1 HP! 각성!", ja: "🔥 奇跡の1HP！覚醒！" },
    "💀 K.O!": { vi: "💀 ĐO VÁN!", en: "💀 K.O!", ko: "💀 K.O!", ja: "💀 K.O!" },
    "🦅 FLYING KICK!": { vi: "🦅 PHI CƯỚC!", en: "🦅 FLYING KICK!", ko: "🦅 플라잉 킥!", ja: "🦅 飛び蹴り!" },
    "⚡ SLIDE SWEEP!": { vi: "⚡ XOẠC CHÂN QUÉT TRỤ!", en: "⚡ SLIDE SWEEP!", ko: "⚡ 슬라이딩 태클!", ja: "⚡ スライディング!" },
    "💨 FLASH CROSS-UP!": { vi: "💨 TỐC BIẾN SAU LƯNG!", en: "💨 FLASH CROSS-UP!", ko: "💨 섬광 배후 이동!", ja: "💨 閃光背後回り!" },
    "💥 WALL SPLAT!": { vi: "💥 ĐẬP DÍNH TƯỜNG!", en: "💥 WALL SPLAT!", ko: "💥 벽 꽝!", ja: "💥 壁激突!" },
    "⚔️ CLASH!": { vi: "⚔️ ĐỌ ĐÒN!", en: "⚔️ CLASH!", ko: "⚔️ 격돌!", ja: "⚔️ 激突!" },
    "⚡ ONE INCH BLAST!": { vi: "⚡ NHẤT THỐN QUYỀN!", en: "⚡ ONE INCH BLAST!", ko: "⚡ 촌경 폭발!", ja: "⚡ ワンインチパンチ!" },
    "🐉 DRAGON FANG!": { vi: "🐉 THĂNG LONG QUYỀN!", en: "🐉 DRAGON FANG!", ko: "🐉 승룡권!", ja: "🐉 昇龍拳!" },
    "🔥 ASURA FINISH!": { vi: "🔥 A TU LA KẾT LIỄU!", en: "🔥 ASURA FINISH!", ko: "🔥 아수라 피니시!", ja: "🔥 阿修羅フィニッシュ!" },
    "☄️ METEOR SLAM!": { vi: "☄️ THIÊN THẠCH BỔ CỦI!", en: "☄️ METEOR SLAM!", ko: "☄️ 메테오 슬램!", ja: "☄️ メテオスラム!" },
    "🌪️ AIR LAUNCH!": { vi: "🌪️ HẤT TUNG!", en: "🌪️ AIR LAUNCH!", ko: "🌪️ 에어 런치!", ja: "🌪️ エアーランチ!" },
    "🦵 LEG SWEEP!": { vi: "🦵 QUÉT TRỤ!", en: "🦵 LEG SWEEP!", ko: "🦵 하단 쓸기!", ja: "🦵 足払い!" },
    "🩸 BLEED!": { vi: "🩸 XUẤT HUYẾT!", en: "🩸 BLEED!", ko: "🩸 출혈!", ja: "🩸 出血!" },

    // Kỹ năng nhân vật (Bill Gates & Universal Skills)
    "💻 BSOD HACK!": { vi: "💻 MÀN HÌNH XANH TỬ THẦN!", en: "💻 BSOD HACK!", ko: "💻 블루스크린 해킹!", ja: "💻 ブルースクリーン攻撃!" },
    "🪟 ERROR": { vi: "🪟 LỖI WIN", en: "🪟 ERROR", ko: "🪟 시스템 오류", ja: "🪟 エラー" },
    "🔥 TUYỆT KỸ TỐI THƯỢNG!": { vi: "🔥 TUYỆT KỸ TỐI THƯỢNG!", en: "🔥 ULTIMATE SKILL!", ko: "🔥 궁극기 발동!", ja: "🔥 超必殺技!" },
    "⚠️ NGUY HIỂM!": { vi: "⚠️ NGUY HIỂM!", en: "⚠️ DANGER!", ko: "⚠️ 위험!", ja: "⚠️ 危険!" },
    "🥊 FIGHT! 🥊": { vi: "🥊 CHIẾN! 🥊", en: "🥊 FIGHT! 🥊", ko: "🥊 파이트! 🥊", ja: "🥊 ファイト! 🥊" },
    "FIGHT!": { vi: "CHIẾN!", en: "FIGHT!", ko: "시작!", ja: "勝負!" },

    // Các dòng cố định trên Video Recorder
    "WHO WILL WIN?": { vi: "AI SẼ THẮNG?", en: "WHO WILL WIN?", ko: "누가 이길까?", ja: "勝つのはどっち？" },
    "🔥 KÈO ĐANG BIẾN ĐỘNG MẠNH 🔥": { vi: "🔥 KÈO ĐANG BIẾN ĐỘNG MẠNH 🔥", en: "🔥 ODDS SHIFTING WILDLY 🔥", ko: "🔥 승률 급변동 중 🔥", ja: "🔥 勝率大変動中 🔥" },
    "👆 NHẤP ĐÚP MÀN HÌNH ĐỂ BƠM MÁU 💖": { vi: "👆 NHẤP ĐÚP MÀN HÌNH ĐỂ BƠM MÁU 💖", en: "👆 DOUBLE TAP SCREEN TO HEAL 💖", ko: "👆 화면을 두 번 탭해 체력 회복 💖", ja: "👆 画面をダブルタップで回復 💖" },
    "🚨 Máu đang nguy kịch! Thả tim kích hoạt hào quang 1 HP ngay!": { vi: "🚨 Máu đang nguy kịch! Thả tim kích hoạt hào quang 1 HP ngay!", en: "🚨 Critical HP! Drop a like to trigger 1 HP Miracle!", ko: "🚨 체력 위기! 좋아요로 1 HP 기적을 깨우세요!", ja: "🚨 HP危険！いいねで1HP覚醒を発動しよう！" },
    "🔋 SỐ CUỐI % PIN CỦA BẠN QUYẾT ĐỊNH KẾT QUẢ!": { vi: "🔋 SỐ CUỐI % PIN CỦA BẠN QUYẾT ĐỊNH KẾT QUẢ!", en: "🔋 YOUR BATTERY % LAST DIGIT DECIDES THE WINNER!", ko: "🔋 배터리 잔량 끝자리 숫자가 승자를 결정합니다!", ja: "🔋 バッテリー残量の最後の数字で勝敗が決まる！" },
    "📸 THỬ THÁCH: BẮT KHUNG HÌNH ẨN 0.05 GIÂY!": { vi: "📸 THỬ THÁCH: BẮT KHUNG HÌNH ẨN 0.05 GIÂY!", en: "📸 CHALLENGE: CATCH THE 0.05s HIDDEN FRAME!", ko: "📸 챌린지: 0.05초 히든 프레임을 포착하라!", ja: "📸 挑戦：0.05秒の隠しフレームを止めろ！" },
    "Bấm Tạm Dừng đúng lúc màn hình chớp trắng đen để thấy mật mã!": { vi: "Bấm Tạm Dừng đúng lúc màn hình chớp trắng đen để thấy mật mã!", en: "Pause right when the screen flashes black & white to see the secret!", ko: "화면이 흑백으로 번쩍일 때 일시정지해서 비밀 코드를 확인하세요!", ja: "画面が白黒に光る瞬間に一時停止して秘密を見よう！" },
    "🎂 THÁNG SINH CỦA BẠN ĐẶT CỬA CHO AI?": { vi: "🎂 THÁNG SINH CỦA BẠN ĐẶT CỬA CHO AI?", en: "🎂 YOUR BIRTH MONTH PICKS YOUR FIGHTER!", ko: "🎂 당신의 생월이 응원할 파이터를 결정합니다!", ja: "🎂 あなたの誕生月で応援するファイターが決まる！" },
    "↗️ ẤN CHIA SẺ ➡️ KHÁC XEM AI HIỆN RA ĐẦU TIÊN!": { vi: "↗️ ẤN CHIA SẺ ➡️ KHÁC XEM AI HIỆN RA ĐẦU TIÊN!", en: "↗️ TAP SHARE ➡️ MORE TO SEE YOUR RIVAL!", ko: "↗️ 공유 ➡️ 더보기를 눌러 첫 번째 사람을 확인하세요!", ja: "↗️ シェア ➡️ その他を押して最初の相手を見よう！" },
    "Người hiện ra đầu tiên chính là đối thủ định mệnh của bạn 😂": { vi: "Người hiện ra đầu tiên chính là đối thủ định mệnh của bạn 😂", en: "The 1st person shown is your destined rival 😂", ko: "첫 번째로 뜨는 사람이 당신의 운명적인 라이벌입니다 😂", ja: "最初に出た人があなたの運命のライバルです 😂" },
    "📸 BẮT TRÚNG KHUNG HÌNH ẨN 0.05s! CMT 'ĐÃ THẤY' NGAY! 👑": { vi: "📸 BẮT TRÚNG KHUNG HÌNH ẨN 0.05s! CMT 'ĐÃ THẤY' NGAY! 👑", en: "📸 CAUGHT THE 0.05s HIDDEN FRAME! COMMENT 'FOUND IT'! 👑", ko: "📸 0.05초 히든 프레임 포착 성공! 댓글에 '찾았다' 남기기! 👑", ja: "📸 0.05秒の隠しフレーム発見！コメントで教えてね！ 👑" },
    "📺 VAR: ĐANG KIỂM TRA NGHI VẤN HACK...": { vi: "📺 VAR: ĐANG KIỂM TRA NGHI VẤN HACK...", en: "📺 VAR: CHECKING FOR POSSIBLE AIMBOT/HACK...", ko: "📺 VAR: 핵 사용 여부 판독 중...", ja: "📺 VAR：チート疑惑を判定中..." },
    "✅ VAR: 100% KỸ NĂNG - KHÔNG HACK!": { vi: "✅ VAR: 100% KỸ NĂNG - KHÔNG HACK!", en: "✅ VAR VERDICT: 100% PURE SKILL - NO HACK!", ko: "✅ VAR 판정: 100% 순수 실력 - 핵 아님!", ja: "✅ VAR判定：100%純粋なスキル！" },
    "📜 HỒI KẾT TRẬN ĐẤU 📜": { vi: "📜 HỒI KẾT TRẬN ĐẤU 📜", en: "📜 MATCH EPILOGUE 📜", ko: "📜 결투 에필로그 📜", ja: "📜 決闘の結末 📜" },
    "🎬 ĐANG MỞ TẬP 2... ĐỪNG RỜI MẮT ⏩": { vi: "🎬 ĐANG MỞ TẬP 2... ĐỪNG RỜI MẮT ⏩", en: "🎬 LOADING EPISODE 2... DON'T BLINK ⏩", ko: "🎬 제2화 로딩 중... 눈을 떼지 마세요 ⏩", ja: "🎬 第2話を開始中... 目を離さないで ⏩" },
    "APPROVED": { vi: "ĐÃ DUYỆT", en: "APPROVED", ko: "공인 완료", ja: "承認済" },
    "TRIỆU VIEW": { vi: "TRIỆU VIEW", en: "VIRAL HIT", ko: "대박 영상", ja: "神回確定" },

    // Hộp thông báo Bait (Pin yếu / Mẹ / Crush)
    "Low Battery": { vi: "Pin Yếu", en: "Low Battery", ko: "배터리 부족", ja: "バッテリー残量低下" },
    "10% battery remaining.": { vi: "Còn lại 10% pin.", en: "10% battery remaining.", ko: "배터리가 10% 남았습니다.", ja: "バッテリー残量はあと10%です。" },
    "Close": { vi: "Đóng", en: "Close", ko: "닫기", ja: "閉じる" },
    "Low Power Mode": { vi: "Chế độ nguồn điện thấp", en: "Low Power Mode", ko: "저전력 모드", ja: "低電力モード" },
    "Mẹ 😡": { vi: "Mẹ 😡", en: "Mom 😡", ko: "엄마 😡", ja: "お母さん 😡" },
    "Tắt máy đi ngủ ngay không tao đập máy bây giờ!": { vi: "Tắt máy đi ngủ ngay không tao đập máy bây giờ!", en: "Turn off your phone and go to sleep right now!", ko: "당장 폰 끄고 안 자면 폰 부숴버린다!", ja: "今すぐスマホ消して寝ないと没収するわよ！" },
    "Crush ❤️": { vi: "Crush ❤️", en: "Crush ❤️", ko: "짝사랑 ❤️", ja: "好きな人 ❤️" },
    "Anh đang làm gì đấy? Sao mải chơi game thế 🥺": { vi: "Anh đang làm gì đấy? Sao mải chơi game thế 🥺", en: "What are you doing? Why are you ignoring me for games 🥺", ko: "오빠 뭐해? 왜 내 연락도 안 보고 게임만 해 🥺", ja: "今何してるの？ゲームばっかりで構ってくれない🥺" }
};

// ==========================================
// 2. KHO NỘI DUNG INTRO, LIVE CHAT & TRASH TALK ĐA NGÔN NGỮ
// ==========================================
window.I18N_PACKS = {
    vi: {
        ui: {
            searchPlaceholder: "🔍 Tìm kiếm chiến binh...",
            onlineBtn: "🌐 ĐẤU ONLINE 1V1",
            fightBtn: "⚔️ VÀO TRẬN NGAY",
            blockBtn: "🛡️ ĐỠ",
            dodgeBtn: "💨 NÉ",
            skillBtn: "🔥 TUYỆT KỸ",
            exitBtn: "🚪 THOÁT",
            newspaperHeader: "📰 NHẬT BÁO @GAMENHUCLON • KÈO ĐẶC BIỆT • GIÁ: 1 TIM ❤️",
            cinemaFooter: "🎬 RẠP CHIẾU BÓNG MINI @GAMENHUCLON",
            chargingPrefix: "🔥 ĐANG NẠP CÚ CHỐT...",
            betLeftSuffix: "K ĐẶT TRÁI",
            betRightPrefix: "ĐẶT PHẢI ",
            evenWin: "Số Chẵn",
            oddWin: "Số Lẻ",
            winWord: "Thắng",
            month1_6: "Tháng 1-6 = Phe",
            month7_12: "Tháng 7-12 = Phe",
            saveFollow: "📌 Lưu video & Follow @gamenhuclon để xem kèo tiếp theo!",
            giftSent: "Đã gửi tặng"
        },
        subHooks: [
            "🤫 KÈO NÀY AI THUA PHẢI BAO TRÀ SỮA! ĐOÁN XEM AI NẰM SÀN? 👇",
            "🥺 99% NGƯỜI XEM ĐOÁN SAI KẾT QUẢ Ở GIÂY CUỐI CÙNG!",
            "🍿 ĐỪNG CHỚP MẮT! CÓ PHA LẬT KÈO KHÔNG TƯỞNG Ở PHÚT CHÓT!",
            "🎟️ VÉ XEM MIỄN PHÍ: AI THẮNG KÈO NÀY ĐƯỢC PHONG LÀM TRÙM XÓM!"
        ],
        cuteCrimes: [
            "🍜 Tội danh: Ăn vụng mì tôm không chừa nước",
            "🧋 Truy nã: Quỵt 2 ly trà sữa full trân châu",
            "💤 Tội danh: Hứa dậy sớm tập thể dục nhưng ngủ tới trưa",
            "🎮 Tội danh: Chơi game toàn chọn tướng tủ mà vẫn thua",
            "🐱 Tội danh: Quá đáng yêu gây mất tập trung đối thủ"
        ],
        bubblesP1: [
            "Mẹ dặn thắng mới được về ăn cơm! 🍚😤",
            "Nhảy khởi động tí thôi chứ đánh thiệt đó nha! 🕺✨",
            "Ai đặt cửa cho mình nhớ thả tim tiếp sức nha! ❤️"
        ],
        bubblesP2: [
            "Chấp 1 tay luôn đó, nhào vô kiếm ăn! 😜",
            "Tưởng ai chứ kèo này dễ như ăn kẹo! 🍭😏",
            "Cẩn thận kẻo bay màu trong 3 nốt nhạc nha! 🎶⚡"
        ],
        vsOdds: [
            { p1Tag: "👑 Tỉ lệ thắng: 99.9%", p2Tag: "🎲 Tỉ lệ thắng: 0.1% (Phép màu)" },
            { p1Tag: "🌾 Hệ Cày Chay: Lv.1", p2Tag: "💎 Hệ Nạp VIP: Lv.999" },
            { p1Tag: "🧋 Cược: 100 Ly Trà Sữa", p2Tag: "🍜 Cược: 1 Thùng Mì Tôm" }
        ],
        pinnedHooks: [
            "📌 Ghim: Số cuối % Pin của bạn là Chẵn hay Lẻ? Comment bên dưới nhé!",
            "📌 Ghim: Đố ai bấm Tạm Dừng bắt trúng Khung Hình Ẩn 0.05s đấy! 📸",
            "📌 Ghim: Kèo sau anh em muốn ai lên sàn? Comment nhiều tim nhất mình làm luôn!"
        ],
        liveComments: [
            "Cốt truyện cuốn hơn cả phim chiếu rạp 🍿",
            "Ai dạy {p1} bộ võ mèo cào thế kia 😂",
            "Nhìn {p2} đánh mà áp lực hộ luôn á 💀",
            "Pin mình 88% số chẵn đặt hết niềm tin vào {p1} nhé 🔋",
            "Pin lẻ điểm danh! {p2} lụm kèo này chặt luôn 🔥",
            "Hai ông {p1} với {p2} đánh nhau như đòi nợ cuối năm 😂",
            "Pha né đòn vừa rồi ảo ma Canada thật sự 🤯",
            "Ông {p1} gáy cho cố vào rồi tý nữa nằm sàn bây giờ 💀",
            "Tay {p2} nhanh hơn cả tốc độ người yêu cũ trở mặt 😭",
            "Quả đấm vừa rồi thốn tận rốn 🥊💥",
            "Đừng để {p1} đầy thanh nộ, nó nổ Ulti là bay màu luôn đấy ⚠️"
        ],
        billGatesTrashTalk: {
            chapters: [
                "KÈO TỶ ĐÔ: VẢ VỠ MÀN HÌNH XANH 💻",
                "CHƯƠNG ĐẶC BIỆT: TƯ BẢN ĐI ĐẤM NHAU 💵",
                "TRUY QUÉT: {enemy} XÀI WINDOWS LẬU! 🚨"
            ],
            midMatch: [
                "Ê {enemy}! Mày đang xài Windows lậu chưa Active đúng không? Đứng im tao kiểm tra! 💻",
                "Tài sản của tao đè bẹp cả cây máu của mày đấy {enemy} ơi! Nhìn tiền rơi mà khóc đi! 💵",
                "Mạng nhà mày lag à {enemy}? Để tao mua đứt nhà mạng rồi cắt cáp nhà mày luôn nhé! 🌐",
                "Đừng làm tao nóng! Tao mua luôn cái game này rồi xóa acc thằng {enemy} bây giờ! 👺"
            ],
            winQuotes: [
                { c: "Tư bản luôn chiến thắng!", s: "Bill Gates vừa lấy tiền đè chết {enemy}. Cảm ơn phần mềm diệt virus đã tài trợ trận đấu này! 💵" },
                { c: "Màn Hình Xanh Tử Thần (BSOD)!", s: "Não của {enemy} đã bị lỗi hệ điều hành sau cú vả tỷ đô từ ngài Bill Gates! 💻" }
            ],
            loseQuotes: [
                { c: "Đang đánh thì máy bắt Update Win 11!", s: "Bill Gates chưa kịp tung chiêu cuối thì máy tự khởi động lại để cập nhật. Hẹn {enemy} kèo sau! 🔄" },
                { c: "Lỗi bàn phím cơ 50 triệu!", s: "Nói chung là kẹt nút Ctrl+Alt+Del thôi, chứ tầm {enemy} tuổi gì đòi ăn được Chủ tịch!" }
            ]
        }
    },

    // ==========================================
    // TIẾNG ANH (ENGLISH - GLOBAL TIKTOK)
    // ==========================================
    en: {
        ui: {
            searchPlaceholder: "🔍 Search fighters...",
            onlineBtn: "🌐 ONLINE 1V1 PVP",
            fightBtn: "⚔️ START BATTLE",
            blockBtn: "🛡️ BLOCK",
            dodgeBtn: "💨 DODGE",
            skillBtn: "🔥 ULTIMATE",
            exitBtn: "🚪 EXIT",
            newspaperHeader: "📰 DAILY GOSSIP @GAMENHUCLON • SPECIAL EDITION • PRICE: 1 LIKE ❤️",
            cinemaFooter: "🎬 VINTAGE MINI THEATER @GAMENHUCLON",
            chargingPrefix: "🔥 CHARGING FINISHER...",
            betLeftSuffix: "K ON LEFT",
            betRightPrefix: "ON RIGHT ",
            evenWin: "Even Digit",
            oddWin: "Odd Digit",
            winWord: "Wins",
            month1_6: "Jan-Jun = Team",
            month7_12: "Jul-Dec = Team",
            saveFollow: "📌 Save video & Follow @gamenhuclon for Episode 2!",
            giftSent: "sent"
        },
        subHooks: [
            "🤫 LOSER BUYS BOBA TEA! GUESS WHO HITS THE FLOOR FIRST? 👇",
            "🥺 99% OF VIEWERS GUESS THE WRONG WINNER AT THE LAST SECOND!",
            "🍿 DON'T BLINK! INSANE 1 HP COMEBACK AT THE END!",
            "🎟️ FREE TICKET: WINNER BECOMES THE SUPREME BOSS!"
        ],
        cuteCrimes: [
            "🍜 Crime: Ate all the ramen at 3 AM",
            "🧋 Wanted: Owes 2 large boba milk teas",
            "💤 Crime: Set 10 alarms and slept until noon",
            "🎮 Crime: Blames lag every time they lose",
            "🐱 Crime: Too cute, distracting the opponent"
        ],
        bubblesP1: [
            "Mom said I can't come home unless I win! 🍚😤",
            "Just warming up with a little dance! 🕺✨",
            "Drop a like to give me extra power! ❤️"
        ],
        bubblesP2: [
            "I can beat you with one hand tied! 😜",
            "This match is easier than eating candy! 🍭😏",
            "Watch out or you'll get KO'd in 3 seconds! 🎶⚡"
        ],
        vsOdds: [
            { p1Tag: "👑 Win Rate: 99.9%", p2Tag: "🎲 Win Rate: 0.1% (Miracle)" },
            { p1Tag: "🌾 Free-to-Play: Lv.1", p2Tag: "💎 Pay-to-Win VIP: Lv.999" },
            { p1Tag: "🧋 Wager: 100 Boba Teas", p2Tag: "🍜 Wager: 1 Box of Ramen" }
        ],
        pinnedHooks: [
            "📌 Pinned: Is your battery % last digit Even or Odd? Comment below!",
            "📌 Pinned: Bet you can't pause on the 0.05s Hidden Frame! 📸",
            "📌 Pinned: Who should fight next? Most liked comment decides!"
        ],
        liveComments: [
            "Better plot twist than Netflix movies 🍿",
            "Who taught {p1} those cat-scratch moves 😂",
            "{p2} is applying insane pressure right now 💀",
            "My battery is 88% even number, all in on {p1}! 🔋",
            "Odd battery gang! {p2} is taking this W for sure 🔥",
            "{p1} and {p2} fighting like it's Black Friday 😂",
            "That dodge was actual Ultra Instinct 🤯",
            "{p1} talking mad trash just to get folded 💀",
            "{p2} attacks faster than my Wi-Fi disconnects 😭",
            "Bro got sent to another dimension 🥊💥",
            "Don't let {p1} reach 100% stamina, that Ultimate is lethal ⚠️"
        ],
        billGatesTrashTalk: {
            chapters: [
                "BILLIONAIRE BRAWL: BLUE SCREEN OF DEATH 💻",
                "SPECIAL CHAPTER: CAPITALISM STRIKES BACK 💵",
                "SYSTEM ALERT: {enemy} USING PIRATED WINDOWS! 🚨"
            ],
            midMatch: [
                "Hey {enemy}! You're using unactivated Windows, aren't you? Hold still! 💻",
                "My net worth weighs more than your entire HP bar, {enemy}! Cry in dollars! 💵",
                "Lagging, {enemy}? I'll buy your internet provider and cut your cable! 🌐",
                "Don't make me mad! I'll buy this whole game and delete {enemy}'s account! 👺"
            ],
            winQuotes: [
                { c: "Capitalism Always Wins!", s: "Bill Gates just buried {enemy} under a mountain of cash. Sponsored by Windows Defender! 💵" },
                { c: "Blue Screen of Death (BSOD)!", s: "{enemy}'s brain just crashed after a billion-dollar slap from Chairman Bill Gates! 💻" }
            ],
            loseQuotes: [
                { c: "Forced Windows 11 Update Mid-Fight!", s: "Bill Gates was about to use his Ultimate when his PC restarted to update. Rematch soon, {enemy}! 🔄" },
                { c: "My $5,000 Keyboard Jammed!", s: "Ctrl+Alt+Del got stuck, otherwise {enemy} stood zero chance against the Chairman!" }
            ]
        }
    },

    // ==========================================
    // TIẾNG HÀN (KOREAN - 한국어)
    // ==========================================
    ko: {
        ui: {
            searchPlaceholder: "🔍 파이터 검색...",
            onlineBtn: "🌐 온라인 1V1 대결",
            fightBtn: "⚔️ 전투 시작",
            blockBtn: "🛡️ 방어",
            dodgeBtn: "💨 회피",
            skillBtn: "🔥 궁극기",
            exitBtn: "🚪 나가기",
            newspaperHeader: "📰 특종 신문 @GAMENHUCLON • 특별판 • 가격: 좋아요 1개 ❤️",
            cinemaFooter: "🎬 미니 빈티지 극장 @GAMENHUCLON",
            chargingPrefix: "🔥 필살기 충전 중...",
            betLeftSuffix: "K 왼쪽 베팅",
            betRightPrefix: "오른쪽 베팅 ",
            evenWin: "짝수",
            oddWin: "홀수",
            winWord: "승리",
            month1_6: "1~6월생 = 팀",
            month7_12: "7~12월생 = 팀",
            saveFollow: "📌 영상 저장 & @gamenhuclon 팔로우하고 다음 대결을 확인하세요!",
            giftSent: "선물:"
        },
        subHooks: [
            "🤫 지는 사람이 버블티 쏘기! 누가 먼저 쓰러질까요? 👇",
            "🥺 시청자 99%가 마지막 순간 승자를 틀립니다!",
            "🍿 눈 깜짝하지 마세요! 마지막 1 HP 기적의 역전극!",
            "🎟️ 무료 입장권: 이 대결의 승자가 동네 최강자!"
        ],
        cuteCrimes: [
            "🍜 죄목: 새벽에 라면 몰래 끓여 먹음",
            "🧋 수배: 버블티 2잔 먹튀 혐의",
            "💤 죄목: 알람 10개 맞춰놓고 낮 12시까지 늦잠",
            "🎮 죄목: 게임 질 때마다 핑 탓함",
            "🐱 죄목: 너무 귀여워서 상대방 집중력 방해"
        ],
        bubblesP1: [
            "엄마가 오늘 이겨야 밥 준대요! 🍚😤",
            "몸풀기 댄스 끝! 이제 진짜로 간다! 🕺✨",
            "좋아요 눌러서 나에게 힘을 줘! ❤️"
        ],
        bubblesP2: [
            "한 손만 써도 너한테는 안 지지! 😜",
            "이번 대결은 사탕 먹기보다 쉽네! 🍭😏",
            "3초 안에 끝내주마, 각오해라! 🎶⚡"
        ],
        vsOdds: [
            { p1Tag: "👑 예상 승률: 99.9%", p2Tag: "🎲 예상 승률: 0.1% (기적)" },
            { p1Tag: "🌾 무과금 유저: Lv.1", p2Tag: "💎 핵과금 VIP: Lv.999" },
            { p1Tag: "🧋 공약: 버블티 100잔", p2Tag: "🍜 공약: 라면 10박스" }
        ],
        pinnedHooks: [
            "📌 고정됨: 배터리 끝자리가 짝수인가요 홀수인가요? 댓글로 남겨주세요!",
            "📌 고정됨: 0.05초 히든 프레임에서 일시정지 성공한 사람?! 📸",
            "📌 고정됨: 다음 대결은 누구를 원하시나요? 좋아요 많은 댓글로 갑니다!"
        ],
        liveComments: [
            "영화보다 스토리가 더 흥미진진하네 🍿",
            "누가 {p1}한테 고양이 펀치 가르쳤냐 😂",
            "{p2} 공격 속도 숨도 못 쉬겠네 💀",
            "배터리 88% 짝수! {p1}에게 전 재산 올인합니다 🔋",
            "배터리 홀수 모여라! {p2}가 무조건 이긴다 🔥",
            "{p1}랑 {p2} 싸우는 거 완전 명절 조카들 싸움이네 😂",
            "방금 회피 컨트롤 진짜 신들렸다 🤯",
            "{p1} 입 털다가 바닥에 눕겠네 💀",
            "타격감 소리 진짜 찰지다 🥊💥",
            "{p1} 기력 100% 차면 궁극기 한 방에 끝난다 조심해 ⚠️"
        ],
        billGatesTrashTalk: {
            chapters: [
                "억만장자 매치: 블루스크린의 공포 💻",
                "특별편: 자본주의의 매운맛 💵",
                "긴급 수배: {enemy} 정품 미인증 윈도우 사용! 🚨"
            ],
            midMatch: [
                "어이 {enemy}! 너 지금 정품 인증 안 된 윈도우 쓰고 있지? 가만히 있어 봐! 💻",
                "내 재산이 네 체력바보다 훨씬 많아 {enemy}! 달러 비를 맞으며 울어라! 💵",
                "렉 걸리냐 {enemy}? 내가 통신사 통째로 사서 네 인터넷 선 끊어버린다! 🌐",
                "열받게 하지 마라! 이 게임 회사 인수해서 {enemy} 계정 삭제해 버린다! 👺"
            ],
            winQuotes: [
                { c: "자본주의가 언제나 승리한다!", s: "빌 게이츠가 돈다발로 {enemy}를 참교육했습니다! 💵" },
                { c: "죽음의 블루스크린 (BSOD)!", s: "빌 게이츠의 억만장자 펀치에 {enemy}의 뇌가 재부팅되었습니다! 💻" }
            ],
            loseQuotes: [
                { c: "싸우던 중에 윈도우 11 강제 업데이트!", s: "궁극기 쓰려는데 PC가 자동 재부팅되었습니다. 다음 판에 보자 {enemy}! 🔄" },
                { c: "500만 원짜리 키보드 키가 씹혔다!", s: "Ctrl+Alt+Del 키가 걸렸을 뿐, {enemy}가 실력으로 이긴 게 아닙니다!" }
            ]
        }
    },

    // ==========================================
    // TIẾNG NHẬT (JAPANESE - 日本語)
    // ==========================================
    ja: {
        ui: {
            searchPlaceholder: "🔍 ファイターを検索...",
            onlineBtn: "🌐 オンライン 1V1 対戦",
            fightBtn: "⚔️ バトル開始",
            blockBtn: "🛡️ ガード",
            dodgeBtn: "💨 回避",
            skillBtn: "🔥 超必殺技",
            exitBtn: "🚪 戻る",
            newspaperHeader: "📰 号外新聞 @GAMENHUCLON • 特別号 • 価格：いいね1回 ❤️",
            cinemaFooter: "🎬 ミニレトロ劇場 @GAMENHUCLON",
            chargingPrefix: "🔥 必殺技チャージ中...",
            betLeftSuffix: "K 左にベット",
            betRightPrefix: "右にベット ",
            evenWin: "偶数",
            oddWin: "奇数",
            winWord: "の 승리",
            month1_6: "1〜6月生まれ = ",
            month7_12: "7〜12月生まれ = ",
            saveFollow: "📌 動画を保存＆@gamenhuclonをフォローして第2話を見よう！",
            giftSent: "が贈りました："
        },
        subHooks: [
            "🤫 負けたらタピオカ奢り！どっちが先に倒れる？ 👇",
            "🥺 99%の視聴者が最後の逆転劇を予想できない！",
            "🍿 まばたき厳禁！残り1HPからの奇跡の大逆転！",
            "🎟️ 無料チケット：勝者がこの街の最強ボスになる！"
        ],
        cuteCrimes: [
            "🍜 罪状：夜中にこっそりラーメンを完食",
            "🧋 手配：タピオカミルクティー2杯のツケ",
            "💤 罪状：アラーム10個かけて昼まで爆睡",
            "🎮 罪状：負けるといつも回線のせいにする",
            "🐱 罪状：可愛すぎて相手の集中力を奪う"
        ],
        bubblesP1: [
            "勝たないと夕飯抜きって言われた！ 🍚😤",
            " 준비運動のダンスだよ！ここから本気！ 🕺✨",
            "いいねを押してオラに元気を分けてくれ！ ❤️"
        ],
        bubblesP2: [
            "片手だけでも余裕で勝てるぜ！ 😜",
            "この勝負、お菓子を食べるより簡単だね！ 🍭😏",
            "3秒で決着をつけてやるぜ！ 🎶⚡"
        ],
        vsOdds: [
            { p1Tag: "👑 勝率予想: 99.9%", p2Tag: "🎲 勝率予想: 0.1% (奇跡)" },
            { p1Tag: "🌾 無課金勢: Lv.1", p2Tag: "💎 廃課金VIP: Lv.999" },
            { p1Tag: "🧋 賭け: タピオカ100杯", p2Tag: "🍜 賭け: ラーメン1箱" }
        ],
        pinnedHooks: [
            "📌 固定：バッテリー残量の最後の数字は偶数？奇数？コメントしてね！",
            "📌 固定：0.05秒の隠しフレームで一時停止できた猛者はいる？ 📸",
            "📌 固定：次は誰と誰を戦わせてほしい？コメントで教えて！"
        ],
        liveComments: [
            "アニメ映画より熱い展開すぎる 🍿",
            "{p1}の猫パンチ可愛すぎるだろ 😂",
            "{p2}のラッシュ攻撃エグすぎる 💀",
            "バッテリー88%の偶数だから{p1}に全賭け！ 🔋",
            "奇数バッテリー勢！ここは{p2}が絶対勝つ 🔥",
            "今の回避は完全に身勝手の極意 🤯",
            "{p1}が調子に乗って煽ってるぞ 💀",
            "効果音と打撃感が気持ち良すぎる 🥊💥",
            "{p1}のゲージが100%になったら超必殺技が来るぞ ⚠️"
        ],
        billGatesTrashTalk: {
            chapters: [
                "大富豪バトル：死のブルースクリーン 💻",
                "特別編：資本主義の鉄槌 💵",
                "緊急手配：{enemy}が海賊版Windowsを使用中！ 🚨"
            ],
            midMatch: [
                "おい{enemy}！お前、未認証のWindowsを使ってるだろ！ 💻",
                "私の資産はお前のHPバーより重いぞ{enemy}！札束の雨に泣け！ 💵",
                "ラグいのか{enemy}？プロバイダごと買収して回線を切ってやろうか！ 🌐",
                "怒らせるなよ！このゲームごと買収して{enemy}のアカウントを消すぞ！ 👺"
            ],
            winQuotes: [
                { c: "資本主義は常に勝つ！", s: "ビル・ゲイツが札束の暴力で{enemy}を圧倒しました！ 💵" },
                { c: "死のブルースクリーン (BSOD)！", s: "ビル・ゲイツの100億ドルパンチで{enemy}の脳がフリーズしました！ 💻" }
            ],
            loseQuotes: [
                { c: "戦闘中にWindows 11の強制アップデート！", s: "必殺技を出す瞬間にPCが再起動しました。次は覚悟しろよ{enemy}！ 🔄" },
                { c: "高級キーボードのキーが引っかかった！", s: "Ctrl+Alt+Delが詰まっただけだ、{enemy}の実力じゃない！" }
            ]
        }
    }
};

// ==========================================
// 3. BỘ DỊCH THUẬT THỜI GIAN THỰC (SIÊU TỐC VỚI CACHE O(1))
// ==========================================
window.translateDynamicString = function(str) {
    if (!str || typeof str !== "string") return str;
    let lang = window.currentLang || "vi";
    if (lang === "vi" && !window.I18N_COMBAT_DICT[str]) return str;

    let cacheKey = lang + "::" + str;
    if (window._i18nCache.has(cacheKey)) {
        return window._i18nCache.get(cacheKey);
    }

    let trimmed = str.trim();
    let result = str;
    let pack = window.I18N_PACKS[lang] || window.I18N_PACKS.vi;

    // 1. Tra từ điển chính xác 100%
    if (window.I18N_COMBAT_DICT[trimmed] && window.I18N_COMBAT_DICT[trimmed][lang]) {
        result = window.I18N_COMBAT_DICT[trimmed][lang];
    }
    // 2. Dịch các câu có chứa biến số động (Hút máu, Thắng cuộc, Thanh nạp cú chốt, Đặt cược...)
    else if (trimmed.startsWith("🩸 LIFESTEAL +")) {
        let num = trimmed.replace("🩸 LIFESTEAL +", "");
        if (lang === "vi") result = `🩸 HÚT MÁU +${num}`;
        else if (lang === "ko") result = `🩸 흡혈 +${num}`;
        else if (lang === "ja") result = `🩸 HP吸収 +${num}`;
    }
    else if (trimmed.startsWith("👑 ") && trimmed.endsWith(" WIN")) {
        let wName = trimmed.replace("👑 ", "").replace(" WIN", "");
        if (lang === "vi") result = `👑 ${wName} CHIẾN THẮNG!`;
        else if (lang === "ko") result = `👑 ${wName} 승리!`;
        else if (lang === "ja") result = `👑 ${wName} の勝利!`;
    }
    else if (trimmed.includes("ĐANG NẠP CÚ CHỐT...")) {
        let pctMatch = trimmed.match(/\d+%/);
        let pct = pctMatch ? pctMatch[0] : "99%";
        result = `${pack.ui.chargingPrefix} ${pct} 🔥`;
    }
    else if (trimmed.includes("K ĐẶT TRÁI")) {
        let num = trimmed.replace("K ĐẶT TRÁI", "");
        result = `${num}${pack.ui.betLeftSuffix}`;
    }
    else if (trimmed.startsWith("ĐẶT PHẢI ")) {
        let num = trimmed.replace("ĐẶT PHẢI ", "");
        result = `${pack.ui.betRightPrefix}${num}`;
    }
    else if (trimmed.includes("Số Chẵn =") && trimmed.includes("Số Lẻ =")) {
        let p1N = (typeof window.getRealCharName === "function") ? window.getRealCharName(window.p1, "P1") : "P1";
        let eObj = (window.enemies && window.enemies[0]) ? window.enemies[0] : null;
        let p2N = (typeof window.getRealCharName === "function") ? window.getRealCharName(eObj, "P2") : "P2";
        result = `${pack.ui.evenWin} = ${p1N} ${pack.ui.winWord}  |  ${pack.ui.oddWin} = ${p2N} ${pack.ui.winWord} 👇`;
    }
    else if (trimmed.includes("Tháng 1-6 =") && trimmed.includes("Tháng 7-12 =")) {
        let p1N = (typeof window.getRealCharName === "function") ? window.getRealCharName(window.p1, "P1") : "P1";
        let eObj = (window.enemies && window.enemies[0]) ? window.enemies[0] : null;
        let p2N = (typeof window.getRealCharName === "function") ? window.getRealCharName(eObj, "P2") : "P2";
        result = `${pack.ui.month1_6} ${p1N}  |  ${pack.ui.month7_12} ${p2N} 🔥`;
    }
    else if (trimmed.includes("NHẬT BÁO") && trimmed.includes("GIÁ: 1 TIM")) {
        result = pack.ui.newspaperHeader;
    }
    else if (trimmed.includes("RẠP CHIẾU BÓNG MINI")) {
        result = pack.ui.cinemaFooter;
    }
    else if (trimmed.includes("Lưu video & Follow")) {
        result = pack.ui.saveFollow;
    }
    else if (trimmed.startsWith("Đã gửi tặng ")) {
        let gName = trimmed.replace("Đã gửi tặng ", "");
        result = `${pack.ui.giftSent} ${gName}`;
    }

    if (window._i18nCache.size > 600) window._i18nCache.clear();
    window._i18nCache.set(cacheKey, result);
    return result;
};

// ==========================================
// 4. HOOK TỰ ĐỘNG VÀO CANVAS, FLOATING TEXTS, LIVECHAT & NHÂN VẬT
// ==========================================
window.installI18nInterceptors = function() {
    if (window._i18nHooked) return;
    window._i18nHooked = true;

    // 1. Tự động dịch mọi lệnh vẽ chữ trên Canvas (fillText & strokeText)
    const origFillText = CanvasRenderingContext2D.prototype.fillText;
    const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;

    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
        let translated = window.translateDynamicString(text);
        if (maxWidth !== undefined) return origFillText.call(this, translated, x, y, maxWidth);
        return origFillText.call(this, translated, x, y);
    };

    CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
        let translated = window.translateDynamicString(text);
        if (maxWidth !== undefined) return origStrokeText.call(this, translated, x, y, maxWidth);
        return origStrokeText.call(this, translated, x, y);
    };
};

// ==========================================
// 5. ÁP DỤNG NGÔN NGỮ ĐÃ CHỌN CHO TOÀN BỘ HỆ THỐNG GAME
// ==========================================
window.applyLanguage = function(langCode) {
    if (!window.I18N_PACKS[langCode]) langCode = "vi";
    window.currentLang = langCode;
    localStorage.setItem("stickman_game_lang", langCode);
    window._i18nCache.clear();

    let pack = window.I18N_PACKS[langCode];

    // 1. Cập nhật nút hiển thị ngôn ngữ hiện tại ở góc trái trên
    let badgeBtn = document.getElementById("btn-switch-lang-corner");
    if (badgeBtn) {
        const flags = { vi: "🇻🇳 TIẾNG VIỆT", en: "🇺🇸 ENGLISH", ko: "🇰🇷 한국어", ja: "🇯🇵 日本語" };
        badgeBtn.innerHTML = flags[langCode] || "🌍 LANG";
    }

    // 2. Dịch các phần tử HTML trên trang
    let searchInp = document.getElementById("char-search");
    if (searchInp) searchInp.placeholder = pack.ui.searchPlaceholder;

    let onlineBtn = document.getElementById("btn-open-online-modal");
    if (onlineBtn) onlineBtn.innerHTML = pack.ui.onlineBtn;

    document.querySelectorAll("button").forEach(btn => {
        let onclickStr = (btn.getAttribute("onclick") || "");
        if (onclickStr.includes("startGame")) btn.innerHTML = pack.ui.fightBtn;
        else if (onclickStr.includes("playerBlock")) btn.innerHTML = pack.ui.blockBtn;
        else if (onclickStr.includes("playerDodge")) btn.innerHTML = pack.ui.dodgeBtn;
        else if (onclickStr.includes("playerUseSkill")) btn.innerHTML = pack.ui.skillBtn;
        else if (onclickStr.includes("backToMenu")) btn.innerHTML = pack.ui.exitBtn;
    });

    // 3. Cập nhật kho bình luận Live Chat (livechat.js) sang ngôn ngữ đã chọn
    if (pack.liveComments && pack.liveComments.length > 0) {
        window.GENERAL_FUNNY_COMMENTS = pack.liveComments.slice();
        window._shuffledGeneralPool = [];
        window._recentChatsMemory = [];
    }
    if (pack.pinnedHooks && pack.pinnedHooks.length > 0) {
        window.PINNED_HOOK_LIST = pack.pinnedHooks.slice();
    }

    // 4. Cập nhật bộ Trash Talk của Bill Gates & các nhân vật sang ngôn ngữ đã chọn
    if (window.classStats && window.classStats["billgates"] && pack.billGatesTrashTalk) {
        window.classStats["billgates"].trashTalk = JSON.parse(JSON.stringify(pack.billGatesTrashTalk));
    }

    // Nếu nhân vật bất kỳ có khai báo trashTalk_en / trashTalk_ko / trashTalk_ja riêng thì tự động kích hoạt
    if (window.classStats) {
        for (let cid in window.classStats) {
            let ch = window.classStats[cid];
            if (!ch) continue;
            if (!ch._origTrashTalk && ch.trashTalk) {
                ch._origTrashTalk = JSON.parse(JSON.stringify(ch.trashTalk));
            }
            let langSpecificTT = ch["trashTalk_" + langCode];
            if (langSpecificTT) {
                ch.trashTalk = JSON.parse(JSON.stringify(langSpecificTT));
            } else if (langCode === "vi" && ch._origTrashTalk) {
                ch.trashTalk = JSON.parse(JSON.stringify(ch._origTrashTalk));
            }
        }
    }

    // 5. Ghi đè hàm tạo thông số Intro của recorder.js để lấy đúng Tội danh, Bong bóng thoại, Kèo lệch theo ngôn ngữ
    if (!window._origGenerateIntroParams && typeof window.generateIntroParams === "function") {
        window._origGenerateIntroParams = window.generateIntroParams;
        window.generateIntroParams = function() {
            let base = window._origGenerateIntroParams();
            let activePack = window.I18N_PACKS[window.currentLang] || window.I18N_PACKS.vi;
            const r = (arr) => arr[Math.floor(Math.random() * arr.length)];

            let c1 = r(activePack.cuteCrimes);
            let c2 = r(activePack.cuteCrimes);
            while (c2 === c1 && activePack.cuteCrimes.length > 1) c2 = r(activePack.cuteCrimes);

            base.lore.subHook = r(activePack.subHooks);
            base.lore.p1Crime = c1;
            base.lore.p2Crime = c2;
            base.lore.p1Bubble = r(activePack.bubblesP1);
            base.lore.p2Bubble = r(activePack.bubblesP2);
            base.lore.vsOdds = r(activePack.vsOdds);
            base.pinnedHook = r(activePack.pinnedHooks);
            return base;
        };
    }

    // Đóng màn hình chọn ngôn ngữ sau khi người dùng đã chọn xong
    let screen = document.getElementById("language-select-screen");
    if (screen) screen.style.display = "none";
};

// ==========================================
// 6. TẠO MÀN HÌNH CHỌN NGÔN NGỮ ĐẦU TIÊN (FIRST-LOAD SCREEN)
// ==========================================
window.injectLanguageSelectScreen = function() {
    if (document.getElementById("language-select-screen")) return;

    // Nút chuyển ngôn ngữ nhanh ở góc trên bên trái màn hình
    let cornerBtn = document.createElement("button");
    cornerBtn.id = "btn-switch-lang-corner";
    cornerBtn.innerHTML = "🇻🇳 TIẾNG VIỆT";
    cornerBtn.style.cssText = "position:fixed; top:14px; left:14px; z-index:9999; background:rgba(15,23,42,0.9); color:#ffeb3b; font-family:'Arial Black', sans-serif; font-size:13px; padding:9px 15px; border:2px solid #ffeb3b; border-radius:25px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.5);";
    cornerBtn.onclick = () => {
        let scr = document.getElementById("language-select-screen");
        if (scr) scr.style.display = "flex";
    };
    document.body.appendChild(cornerBtn);

    // Màn hình Chọn Ngôn Ngữ Fullscreen xuất hiện đầu tiên khi mở game
    let langScreen = document.createElement("div");
    langScreen.id = "language-select-screen";
    langScreen.style.cssText = "position:fixed; inset:0; background:radial-gradient(circle at center, #1e293b 0%, #090d16 100%); z-index:200000; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', Arial, sans-serif; color:#fff; padding:20px;";
    langScreen.innerHTML = `
        <div style="background:rgba(15, 23, 42, 0.92); border:2px solid #00f3ff; border-radius:24px; padding:32px 28px; max-width:520px; width:100%; text-align:center; box-shadow:0 0 50px rgba(0, 243, 255, 0.25);">
            <div style="font-size:48px; margin-bottom:8px;">🌍⚔️</div>
            <h1 style="margin:0 0 8px 0; font-family:'Arial Black', Impact, sans-serif; font-size:26px; color:#00f3ff; letter-spacing:1px;">SELECT YOUR LANGUAGE</h1>
            <p style="margin:0 0 24px 0; color:#94a3b8; font-size:14px;">Chọn ngôn ngữ để dịch toàn bộ Giao diện, Kỹ năng, Trash Talk & Live Chat</p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                <button onclick="window.applyLanguage('vi')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18px 12px; background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid #00f3ff; border-radius:16px; color:#fff; cursor:pointer; transition:0.2s;">
                    <span style="font-size:36px; margin-bottom:6px;">🇻🇳</span>
                    <span style="font-weight:900; font-size:17px; color:#00f3ff;">TIẾNG VIỆT</span>
                    <span style="font-size:12px; color:#cbd5e1; margin-top:4px;">Bản gốc Gáy Khét</span>
                </button>

                <button onclick="window.applyLanguage('en')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18px 12px; background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid #ffeb3b; border-radius:16px; color:#fff; cursor:pointer; transition:0.2s;">
                    <span style="font-size:36px; margin-bottom:6px;">🇺🇸</span>
                    <span style="font-weight:900; font-size:17px; color:#ffeb3b;">ENGLISH</span>
                    <span style="font-size:12px; color:#cbd5e1; margin-top:4px;">Global TikTok Viral</span>
                </button>

                <button onclick="window.applyLanguage('ko')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18px 12px; background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid #ff0050; border-radius:16px; color:#fff; cursor:pointer; transition:0.2s;">
                    <span style="font-size:36px; margin-bottom:6px;">🇰🇷</span>
                    <span style="font-weight:900; font-size:17px; color:#ff7eb3;">한국어</span>
                    <span style="font-size:12px; color:#cbd5e1; margin-top:4px;">K-서버 & 찰진 입담</span>
                </button>

                <button onclick="window.applyLanguage('ja')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18px 12px; background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid #4ade80; border-radius:16px; color:#fff; cursor:pointer; transition:0.2s;">
                    <span style="font-size:36px; margin-bottom:6px;">🇯🇵</span>
                    <span style="font-weight:900; font-size:17px; color:#4ade80;">日本語</span>
                    <span style="font-size:12px; color:#cbd5e1; margin-top:4px;">アニメ・神回仕様</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(langScreen);
};

window.addEventListener("DOMContentLoaded", () => {
    window.installI18nInterceptors();
    window.injectLanguageSelectScreen();
    window.applyLanguage(window.currentLang || "vi");
    // Luôn hiện bảng chọn ngôn ngữ đầu tiên khi mới mở trang
    let scr = document.getElementById("language-select-screen");
    if (scr) scr.style.display = "flex";
});
