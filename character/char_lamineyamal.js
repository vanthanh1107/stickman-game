// ==========================================
// CHAR_LAMINEYAMAL.JS - LAMINE YAMAL (THẦN ĐỒNG 304 ROCAFONDA)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "lamineyamal",
    className: "Lamine Yamal",
    hp: 950, speed: 8, dmgMod: 1.5, color: "#e84118",
    avatarUrl: "character/picture/lamineyamal.png",
    voiceUrl: "character/voice/lamine yamal.wav",
    skillPrompt: "sút bóng cứa lòng trivela cầu vồng ảo ảnh ma thuật 304 rocafonda, liên hoàn bão xoáy bóng ma thuật 🌟 ⚽ 🌈 💫, choáng tốc độ sát thương x4.2",
    skill: {
        name: "304 ROCAFONDA: ĐẠI PHÁP TRIVELA CẦU VỒNG BẤT KHẢ CẢN",
        icon: "🌟",
        description: "Thi triển đôi chân ma thuật tạo hàng loạt ảo ảnh lừa bóng chóng mặt, tung hai cú sút cứa lòng Trivela mang quỹ đạo cầu vồng Rocafonda 304 xé toạc không gian, quả bóng phát sáng ma thuật xoáy thẳng vào khung thành đối thủ gây nổ tung.",
        skillPrompt: "sút bóng cứa lòng trivela cầu vồng ảo ảnh ma thuật 304 rocafonda, liên hoàn bão xoáy bóng ma thuật 🌟 ⚽ 🌈 💫, choáng tốc độ sát thương x4.2"
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Kỳ Tích Tuổi Trẻ Barrio 304",
            "quote": "Tuổi trẻ không có giới hạn! Con số 304 sẽ được khắc ghi trên đỉnh các ngọn núi thiêng thế giới!",
            "specialLoot": "Vòng Tay May Mắn 304 🌟",
            "statBonusDesc": "+16% Sát thương kỹ năng uốn cong không gian"
    },
    battleCries: {
            "intro": [
                    "3-0-4 BARRIO CHÀO ĐỐI THỦ! 🤟🇪🇸",
                    "17 TUỔI VÔ ĐỊCH EURO GÁNH CẢ TEAM! 🏆🌟",
                    "ĐÁ LẸ CÒN VỀ LÀM BÀI TẬP TOÁN NỮA! 📚✏️",
                    "CHÂN TRÁI ĐƯỢC CHÚ LEO M10 BAN PHƯỚC ĐÂY! 🐐✨"
            ],
            "finisher": [
                    "KÝ HIỆU 304 BARRIO NGẠO NGHỄ! 🤟🔥",
                    "SIÊU PHẨM CỨA LÒNG EURO 2024 VÀO GÓC CHẾT! 🌈⚽",
                    "THẦN ĐỒNG THE ACADEMY ĐÓNG HÒM ĐỐI THỦ! 🌟🏆",
                    "TRUYỀN NHÂN SỐ 1 CỦA HUYỀN THOẠI LEO M10! 🐐"
            ],
            "parry": [
                    "THẦN ĐỒNG 17 TUỔI LẮC HÔNG ĐẢO HƯỚNG! 🌟💫",
                    "VẨY MÁ NGOÀI TRIVELA THOÁT PRESSING! 👟✨",
                    "CHƯA ĐỦ TRÌNH BẮT BÀI THE ACADEMY ĐÂU! 🤟"
            ],
            "ult": [
                    "CỨA LÒNG VẼ CẦU VỒNG VÀO GÓC CHẾT! 🌈⚽",
                    "KỲ TÍCH THẦN ĐỒNG 17 TUỔI BARRIO! 🤟🌟"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA THẦN ĐỒNG LAMINE YAMAL
    // ==========================================
    trashTalk: {
        chapters: [
            "304 ROCAFONDA: TRIVELA CẦU VỒNG XÉ LƯỚI {enemy}! 🌟",
            "THẦN ĐỒNG 17 TUỔI: CỨA LÒNG EURO TIỄN {enemy} VỀ NƯỚC 🌈⚽",
            "304 ROCAFONDA: CHÀO ĐÓN {enemy} ĐẾN VỚI LA MASIA 🤟",
            "ĐƯỢC MESSI TẮM CHO TỪ NHỎ: OUT TRÌNH {enemy} 🐐✨",
            "GOLDEN BOY THƯỢNG ĐÀI: MÚA KỸ THUẬT TRƯỚC {enemy} 🌟"
        ],
        midMatch: [
            "3-0-4 Rocafonda! Mới 17 tuổi thôi nhưng đủ sức sút vỡ mồm {enemy} rồi em trai! ⚽",
            "Năm 17 tuổi tao đã vô địch Euro rồi, còn {enemy} tầm này vẫn đang lo giữ thanh máu à? 🏆🇪🇸",
            "Hồi bé được chú Messi tắm rửa ban phước rồi nên chân trái của tao uy tín lắm {enemy} ơi! 🐐🛁",
            "Nhìn tao giơ ký hiệu tay 3-0-4 Rocafonda trước khi sút cháy lưới mày nhé {enemy}! 🤟🔥",
            "Đá xong trận này với {enemy} tao còn phải về phòng làm nốt bài tập Toán lớp 11 nữa! 📚✏️",
            "Một cú vẩy má ngoài Trivela của tao đủ làm hàng thủ {enemy} đứng nhìn bóng bay vào góc chết! 🌈⚽",
            "Cỡ {enemy} kèm cánh phải của tao thì chỉ có nước xin thay người sớm vì chuột rút! 🏃💨"
        ],
        winQuotes: [
            {
                c: "Kỷ lục gia trẻ tuổi nhất lịch sử!",
                s: "Lamine Yamal vẽ nên đường cong cầu vồng Rocafonda hoàn mỹ tiễn {enemy} về nước sớm! 🌈🏆"
            },
            {
                c: "Ký hiệu 304 Rocafonda ngạo nghễ!",
                s: "Lamine Yamal vừa cứa lòng vẽ cầu vồng tuyệt đẹp hạ gục {enemy} rồi giơ tay ăn mừng 304! 🤟🌟"
            },
            {
                c: "Thần đồng 17 tuổi gánh team!",
                s: "Giải quyết gọn {enemy} trong vài nốt nhạc để còn kịp giờ vào lớp nộp bài tập về nhà! 📚🏆"
            },
            {
                c: "Truyền nhân đích thực của Messi!",
                s: "Cái chân trái ma thuật từ lò La Masia đã khiến {enemy} hoàn toàn tâm phục khẩu phục! 🇪🇸⚽"
            }
        ],
        loseQuotes: [
            {
                c: "Mai phải dậy sớm đi học làm bài tập!",
                s: "Bận ôn thi tốt nghiệp cấp 3 nên nhả cho {enemy} 1 trận, lần sau đừng hòng! 📚"
            },
            {
                c: "Đến giờ giới nghiêm của cầu thủ trẻ!",
                s: "Luật lao động không cho trẻ 17 tuổi thức khuya tăng ca nên Yamal phải nghỉ sớm nhường {enemy}! ⏰"
            },
            {
                c: "Thầy giáo gọi điện kiểm tra bài cũ!",
                s: "Đang đá dở thì nhớ ra mai có bài kiểm tra Hóa học nên tạm tha cho {enemy} đấy! 📖"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan đá chú {enemy} ơi! Đợi em cất quyển vở bài tập Toán lớp 11 vào cặp cái đã, 8 giờ tối nay thầy giáo gọi nộp bài online rồi! 📚✏️",
            "Đứng im em bảo này {enemy}! Năm 17 tuổi chú đang làm gì ở nhà xin tiền mẹ, chứ em là em ẵm luôn cái Cúp Euro về phòng ngủ rồi đấy! 🏆🇪🇸",
            "Ê {enemy}, đừng có khinh trẻ con đeo niềng răng nhé! Hồi đỏ hỏn trong chậu em đã được chú Messi tắm gội truyền hết nội công chân trái rồi! 🐐🛁",
            "Từ từ {enemy}! Nhìn em giơ bàn tay ký hiệu 3-0-4 Rocafonda chào khu phố nghèo trước khi tiễn chú lên bảng điểm số nào! 🤟🌟",
            "Đánh nhanh gọn lẹ giùm em cái {enemy} ơi! Luật lao động châu Âu phạt tiền nếu bắt trẻ vị thành niên 17 tuổi tăng ca vả người già quá 9 giờ đêm đấy! ⏰😂",
            "Nhìn hai đầu gối củ lạc của tiền bối {enemy} kìa, lát em lắc vai vẩy má ngoài Trivela một phát khéo trật khớp háng gọi xe cấp cứu mất! 🌈⚽"
        ],
        replyOpening: [
            "Ơ hay tiền bối {enemy} nói nhiều thế nhờ! Hồi ở Euro mấy ông hậu vệ Pháp cũng gáy y hệt chú trước khi ăn quả cứa lòng 25 mét của em đấy! 🇫🇷🤣",
            "Suốt ngày lấy tuổi tác ra khè em thế {enemy}? Già đầu hơn mà đứng thở hồng hộc nhìn thằng nhóc 2007 múa bóng không thấy quê độ à! 👦😈",
            "Thôi bớt dọa nạt học sinh đi chú {enemy} ơi! Em nói câu nào là em làm thật trên sân câu đấy, không có mõm nhôm như chú đâu! 🤫🔥",
            "Nghe {enemy} nổ mà em quên mất công thức phương trình bậc hai luôn rồi! Vào kèo lẹ để em sút tung nóc lưới lấy lại trí nhớ nào! 📐⚽",
            "Cứ lao vào chém chân thoải mái đi {enemy}, lò đào tạo La Masia dạy em cách nhảy qua đầu mấy khúc gỗ chậm chạp từ năm lên 7 rồi! ✨🏃‍♂️",
            "Chú {enemy} gáy khẽ thôi kẻo bảo mẫu đội tuyển của em nghe thấy lại mắng chú tội ăn nói thiếu văn hóa trước mặt thiếu nhi đấy! 🍼😂"
        ],
        midFight: [
            "Khoan dừng bóng 2 giây chú {enemy}! Đấy thấy chưa, em mới nhấp vai sang phải rẽ sang trái một nhịp mà chú đã ngã vồ ếch ăn cỏ rồi! 🐸🤣",
            "Ê {enemy}, cái răng niềng sắt của em cười lấp lánh đẹp không? Nhìn mặt chú cay đỏ lựng vì không chạm nổi vào gấu quần em kìa! 😁✨",
            "Đứng lại thở đi lão tướng {enemy} ơi! Tuổi tác ập đến lưng mỏi gối chồn rồi thì xin về hưu sớm nhường sân khấu cho Gen Z tụi em đi! 👴💨",
            "Từ từ nào {enemy}! Vừa nãy là đường chuyền vẩy má ngoài Trivela điệu nghệ, còn quả tiếp theo là vẽ cầu vồng găm thẳng góc chữ A đấy! 🌈🎯",
            "Sao đứng chôn chân nhìn bóng bay thế {enemy}? Phép màu nước tắm của chú Messi ngấm vào giò trái em nó lại chả uy tín quá đi chứ! 🐐🛁",
            "Nhanh lên {enemy} ơi nằm xuống sớm đi, mẹ em nhắn tin hỏi sao chưa về ăn cơm chiều uống sữa tăng chiều cao rồi kìa! 🥛📱"
        ],
        climax: [
            "Góc sút huyền thoại trận Bán kết Euro đã mở ra! Tiền bối {enemy} chuẩn bị lên báo trang nhất làm nền cho Golden Boy nhé! 📰🌟",
            "Hết hơi sạch sành sanh rồi hả chú {enemy}? Đấy gọi là khoảng cách thế hệ không thể san lấp đấy ông chú già ạ! 📉😈",
            "Giơ sẵn hai tay ký hiệu 3-0-4 trước khi bóng chạm lưới luôn này {enemy}! Đỡ được quả cứa lòng này em đi đầu xuống đất! 🤟🔥",
            "Tầm này {enemy} chỉ còn biết ước gì mình trẻ lại 15 tuổi để chạy theo hít khói thằng nhóc Lamine thôi! 🏃‍♂️💀",
            "Chuẩn bị còi mãn cuộc nhé {enemy}, em giải quyết chú trong đúng 1 tiết học Thể dục 45 phút không sai một giây! ⏱️📚"
        ],
        finisher: [
            "3-0-4 Rocafonda ngạo nghễ! Vẽ cầu vồng tiễn tiền bối {enemy} về viện dưỡng lão, còn em đeo balo về nộp bài tập Toán đây! 🤟📚",
            "Golden Boy tuổi 17 chính thức out trình! Chào thân ái và quyết thắng nhé ông chú {enemy} chậm chạp! 🏆🇪🇸",
            "Chân trái mạ vàng truyền nhân La Masia không bao giờ nói dối! Cảm ơn {enemy} đã làm cọc gỗ tập sút buổi chiều! 🌈⚽",
            "Xong việc trước giờ giới nghiêm! Uống hộp sữa tươi ăn mừng chiến thắng, để mặc {enemy} nằm khóc tiếc tuổi thanh xuân! 🥛👑"
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

        // 1. Áo đấu FC Barcelona (Sọc Đỏ Rượu Vang & Xanh Lam - Blaugrana)
        ctx.strokeStyle = "#b33939"; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
        ctx.strokeStyle = "#1e3799"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#1e3799"; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#b33939"; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#8d5524"; ctx.lineWidth = 3.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 35);

        // 3. Giày đá bóng Adidas F50 (Màu Hồng/Tím Neon)
        ctx.fillStyle = "#fd79a8";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 15; ctx.shadowColor = "#e84118";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["lamineyamal"] = window.currentLoadedChar;
