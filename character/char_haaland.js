// ==========================================
// CHAR_HAALAND.JS - ERLING HAALAND (MA BƯ VIKING & CỖ MÁY GHI BÀN)
// ==========================================

window.currentLoadedChar = {
    id: "haaland",
    className: "Erling Haaland",
    hp: 1200, speed: 6, dmgMod: 1.7, color: "#74b9ff",
    avatarUrl: "character/picture/haland.png",
    voiceUrl: "character/voice/haland.wav",
    skillPrompt: "biến hình cyborg người máy viking, chưởng laser tia quét bắn 5 tia, khổng lồ giáng rơi búa tạ sấm sét lôi điện 🤖 🔨 ⚡ 🔥, choáng hất văng sát thương x4.5",
    skill: {
        name: "BÚA TẠ VIKING & TIA QUANG HỌC CYBORG HOÁ THẦN",
        icon: "🤖",
        description: "Chuyển sang tư thế thiền định Zen nạp đầy năng lượng, kích hoạt chế độ Người Máy Cyborg mắt phát sáng đỏ rực, bắn chùm 5 tia laser công nghệ cao xé toạc mặt đất rồi bay vút lên không trung giáng búa tạ Viking sấm sét nghiền nát đối thủ.",
        skillPrompt: "biến hình cyborg người máy viking, chưởng laser tia quét bắn 5 tia, khổng lồ giáng rơi búa tạ sấm sét lôi điện 🤖 🔨 ⚡ 🔥, choáng hất văng sát thương x4.5"
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Nhiệm Vụ Nâng Cấp Lò Phản Ứng Cyborg",
            "quote": "Hệ thống đang quét mục tiêu: 24 Trùm Quái Thú. Lò phản ứng hạt nhân Viking đã sẵn sàng nghiền nát tất cả!",
            "specialLoot": "Lõi Năng Lượng Viking 🤖",
            "statBonusDesc": "+250 Máu tối đa & Kháng choáng siêu cấp"
    },
    battleCries: {
            "intro": [
                    "STAY HUMBLE, EH! KHIÊM TỐN LẠI ĐI {enemy}! 🤖",
                    "NGỒI THIỀN NẠP ĐẦY NĂNG LƯỢNG CYBORG! 🧘‍♂️⚡",
                    "BÚA TẠ VIKING ĐÃ KHÓA CHẶT MỤC TIÊU! 🔨🎯",
                    "BỮA SÁNG CỦA TAO LÀ BÍT TẾT VÀ {enemy}! 🥩"
            ],
            "finisher": [
                    "CỖ MÁY GHI BÀN HỦY DIỆT HOÀN TOÀN! 🤖🔥",
                    "KARATE SKY KICK BAY KHỎI SÂN ĐẤU! ⚡🦵",
                    "BÚA TẠ VIKING NGHIỀN NÁT HÀNG PHÒNG NGỰ! 🔨💥",
                    "STAY HUMBLE EH! ĐO SÀN TRONG 1 NỐT NHẠC! 🧘‍♂️"
            ],
            "parry": [
                    "THIỀN ĐỊNH ZEN MIỄN NHIỄM SÁT THƯƠNG! 🧘‍♂️✨",
                    "THỂ HÌNH 1M95 TÌ ĐÈ VĂNG LUÔN {enemy}! 💪🛡️",
                    "GIÁP KIM LOẠI CYBORG DÀY CỘP! 🤖⚡"
            ],
            "ult": [
                    "KÍCH HOẠT CHẾ ĐỘ CYBORG QUÉT LASER! 🤖⚡",
                    "CÚ ĐẬP BÚA TẠ VIKING SẤM SÉT! 🔨💥"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA MA BƯ HAALAND
    // ==========================================
    trashTalk: {
        chapters: [
            "CỖ MÁY HUY DIỆT: BÚA TẠ VIKING NỆN VỠ ĐẦU {enemy}! 🤖",
            "STAY HUMBLE EH: MA BƯ HAALAND DẠY {enemy} KHIÊM TỐN 🤖",
            "CỖ MÁY CYBORG BẮC ÂU NGHIỀN NÁT HÀNG THỦ {enemy} ⚡",
            "BÚA TẠ VIKING: MỘT CƯỚC ĐẠP BAY {enemy} KHỎI KHUNG THÀNH 🔨",
            "THIỀN ĐỊNH HỒI MÁU: {enemy} ĐÁNH ĐẾN SÁNG MAI CŨNG KHÔNG THẤM 🧘‍♂️"
        ],
        midMatch: [
            "Mắt Cyborg của tao vừa khóa mục tiêu vào hộp sọ của mày rồi {enemy}! Thiền xong rồi đấy! 🔨",
            "Stay humble, eh! Biết điều thì khiêm tốn lại đi {enemy} trước khi tao nổi điên! 🤖🔥",
            "Tao chỉ cần chạm bóng 3 lần cả trận là đủ bỏ túi Hat-trick vào lưới {enemy} rồi! ⚽",
            "Nhìn thân hình hộ pháp Viking 1m95 này đi {enemy}, húc nhẹ một cái là mày văng khỏi sân! 💪",
            "Ngồi thiền định Zen hồi ngay 60 máu, {enemy} đánh mỏi tay chưa? 🧘‍♂️✨",
            "Hệ thống Cyborg đã khóa mục tiêu {enemy}, chuẩn bị nhận cú song phi trên không nhé! 🎯",
            "Bữa sáng của tao gồm tim bò, gan bò và thanh máu của {enemy} đấy! 🥩",
            "Đừng cố kèm tao trong vòng cấm {enemy} ơi, tao tì đè một phát là bay cả người lẫn bóng! 🥅💥"
        ],
        winQuotes: [
            {
                c: "Cyborg lập trình sẵn chiến thắng!",
                s: "Erling Haaland hoàn tất cú hat-trick hủy diệt {enemy} rồi ngồi xuống thiền định ngắm hoàng hôn! 🧘‍♂️⚡"
            },
            {
                c: "Stay Humble, Eh!",
                s: "Erling Haaland vỗ vai dặn dò {enemy} lần sau nhớ khiêm tốn hơn rồi ngồi thiền ăn mừng! 🧘‍♂️🤖"
            },
            {
                c: "Cỗ máy ghi bàn hủy diệt!",
                s: "Chỉ cần đúng 1 pha chạm bóng cận thành, Ma Bư Haaland đã làm bốc hơi cây máu của {enemy}! ⚡⚽"
            },
            {
                c: "Sức mạnh Chiến binh Viking!",
                s: "Cú giậm nhảy sấm sét của Haaland khiến mặt sân nứt toác và {enemy} nằm bất động! 🔨"
            }
        ],
        loseQuotes: [
            {
                c: "Hết pin Cyborg chưa kịp cắm sạc!",
                s: "Bộ vi xử lý nhiệt độ hơi cao, hiệp sau lắp thêm tản nhiệt nước rồi vả {enemy} sau! 🔋"
            },
            {
                c: "Đói bụng quá chưa kịp ăn Bít tết!",
                s: "Cỗ máy Cyborg thiếu nhiên liệu thịt bò nướng nên tụt áp suất tí thôi nhé {enemy}! 🥩🔋"
            },
            {
                c: "Hôm nay De Bruyne không vào sân chuyền bóng!",
                s: "Thiếu chân chuyền kiến tạo nên Haaland đứng đợi bóng hơi lâu, hẹn {enemy} trận lượt về! ⚽"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Stay humble, eh! Khuyên thật lòng một câu: Biết thân biết phận thì khiêm tốn cúi đầu xuống đi {enemy}! 🤖🫵",
            "Khoan đánh đã {enemy}! Hệ thống Cyborg Bắc Âu vừa quét X-quang cơ thể mày: Xương thủy tinh, tỷ lệ sống sót 0%! 🎯⚡",
            "Đứng im tao nhìn mặt cái {enemy}! Sáng nay tao vừa nuốt chửng 2 cân tim bò sống với sữa tươi, đang khát thêm thanh máu của mày đây! 🥩😈",
            "Ê {enemy}, mày cao được mét mấy mà đứng trước hộ pháp Viking 1m95 nặng gần tạ như tao trông giống khúc giò thế? 🔨😂",
            "Từ từ {enemy}! Cho tao ngồi xếp bằng Thiền Định Zen hít khí trời 2 giây trước khi bẻ gãy đôi hàng phòng ngự của mày! 🧘‍♂️✨",
            "Tao nói ít làm nhiều lắm {enemy}: Cả trận tao chạm người mày đúng 3 cái là mày lên xe cấp cứu đủ Hat-trick! ⚽🤖"
        ],
        replyOpening: [
            "Mày là ai nhỉ {enemy}? Xin lỗi bộ nhớ RAM của tao không lưu tên mấy thằng vô danh chưa từng vô địch C1! 🏆🤷‍♂️",
            "Stay humble, eh! Càng sủa to đầu trận thì lúc bị tao ném bóng thẳng vào sau gáy giống hậu vệ Arsenal lại càng nhục đấy {enemy}! ⚽🤣",
            "Ồ {enemy} hung hăng phết! Giống hệt con bò tót trước khi bị người Viking bọn tao xẻ thịt làm bít tết buổi tối vậy! 🥩🔥",
            "Bớt lải nhải đi {enemy}! Phần mềm hủy diệt phiên bản mới nhất của tao vừa tải xong 100% rồi, chuẩn bị nát gáo! 🤖💥",
            "Nghe {enemy} gáy mà tao chỉ biết cười ngoác mồm kiểu Ma Bư! Lại gần vòng cấm địa xem tao tì vai một phát mày bay mấy chục mét! 💪😈",
            "Cứ đánh thoải mái đi {enemy}, mày đấm gãy tay tao ngồi thiền 1 giây lại đầy cây máu cho mày tuyệt vọng chơi! 🧘‍♂️😂"
        ],
        midFight: [
            "Khoan dừng lại {enemy}! Sao mày tông hết sức vào người tao mà tao không nhúc nhích, còn mày lại tự bật ngửa ra đằng sau thế kia? 🧱🤣",
            "Stay humble, eh! Đã dặn từ đầu là phải biết khiêm tốn rồi không nghe, giờ gãy hết mấy cái xương sườn chưa {enemy}? 🤖🫵",
            "Ê {enemy}, nhìn tao xoạc chân bay người cao 2 mét trên không trung như Karate thế này có làm mày sang chấn tâm lý không? 🦵⚡",
            "Từ từ thở đi {enemy}! Đánh mỏi nhừ cả hai tay chưa, nhìn tao ngồi Thiền hồi phục lại nguyên cục máu cho tức trào đờm nhé! 🧘‍♂️✨",
            "Sao thế {enemy}? Bị Ma Bư tóc vàng lùa chạy khắp mặt sân như gà mắc tóc thế này còn dám gáy câu nào nữa không? 🏃‍♂️😂",
            "Cỗ máy săn bàn đang vào guồng nhiệt độ cao đấy {enemy}, đứng chắn trước mặt khung thành là tao sút lủng lưới cả người lẫn bóng! 🥅☄️"
        ],
        climax: [
            "Cảnh báo Đỏ: Mục tiêu {enemy} đã rơi vào vùng tử thần 5m50! Kích hoạt chế độ Đệm Bóng Cận Thành kết liễu ngay lập tức! 🎯🤖",
            "Hết pin sạch trơn rồi hả con người yếu ớt {enemy}? Còn pin hạt nhân của Cyborg Haaland vẫn đang 99% công suất đấy! 🔋😈",
            "Stay humble nhé {enemy}! Lần sau gặp quái vật Na Uy thì nhớ giả chết ngay từ phút đầu tiên cho đỡ đau đớn! 🔨💀",
            "Một cú búa tạ Viking giáng từ trên trời xuống nữa thôi là mặt sàn in nguyên hình cái xác dẹp lép của {enemy}! ⚡🪨",
            "Đừng cố ôm chân tao nữa {enemy}, tao kéo lê cả mày trên cỏ chạy thẳng vào gôn ghi bàn luôn bây giờ! ⚽💪"
        ],
        finisher: [
            "Stay humble, eh! Vỗ nhẹ lên đầu {enemy} dặn dò bài học nhớ đời rồi ngồi xếp bằng Thiền Định cực ngầu! 🧘‍♂️🤖",
            "Nhiệm vụ hủy diệt hoàn tất! Giờ Ma Bư về nhà nướng 3 tảng sườn bò ăn mừng cú Hat-trick lên đầu {enemy}! 🥩🏆",
            "Chạm bóng tối thiểu, sát thương tối đa! {enemy} chính thức bị nghiền nát dưới gót giày chiến binh Viking! 🔨⚡",
            "Tắt nguồn mục tiêu {enemy}! Cập nhật thống kê: Thêm 1 nạn nhân xấu số cố tình sủa bậy trước mặt cỗ máy Bắc Âu! 📈👑"
        ]
    },

    // 🟢 ULTIMATE: Triệu hồi UniversalSkillEngine thi triển chiêu thức theo mô tả
    executeUltimate: function(caster, target, baseDmg) {
        if (window.UniversalSkillEngine && typeof window.UniversalSkillEngine.executeFromDescription === 'function') {
            window.UniversalSkillEngine.executeFromDescription(
                caster, target, baseDmg,
                this.skillPrompt || (this.skill && this.skill.description),
                (this.skill && this.skill.name) || this.skillName
            );
        }
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Manchester City (Xanh da trời nhạt - Sky Blue)
        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 8.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#ffddc1"; ctx.lineWidth = 5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 37);

        // 3. Giày đá bóng Nike Phantom (Màu Cam Đỏ rực lửa)
        ctx.fillStyle = "#ff7675";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#00cec9";
            ctx.shadowBlur = 15; ctx.shadowColor = "#74b9ff";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["haaland"] = window.currentLoadedChar;
