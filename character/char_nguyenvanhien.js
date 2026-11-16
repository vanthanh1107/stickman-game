// =========================================================================
// CHARACTER: NGUYỄN VĂN HIẾN - ÔNG HOÀNG NHỰA NGUYÊN SINH HDPE
// ("HDPE LÀ NGON LUÔN!" - ĐỘ BỀN 50 NĂM, ĐẬP BÚA KHÔNG VỠ)
// =========================================================================

window.currentLoadedChar = {
    id: "nguyenvanhien",
    className: "Nguyễn Văn Hiến",
    hp: 1250,
    speed: 6,
    dmgMod: 1.65,
    color: "#00b4d8",
    avatarUrl: "character/picture/hpde.png",
    voiceUrl: "character/voice/hdpe.wav",

    skillPrompt: "khiên đàn hồi giáp bảo vệ hdpe, triệu hồi xe lu công trình cán qua, đè giáng búa tạ thiết bảng ống nhựa 50 năm 🧪 🔨 🚜 🛡️, choáng phản đòn sát thương x4.4",

    // Kỹ năng riêng
    skill: {
        name: "CÔNG TRÌNH THẾ KỶ: THIẾT BẢNG HDPE BÚA TẠ BẤT HOẠI 50 NĂM",
        icon: "🧪",
        description: "Vác cây Thiết Bảng Ống Nhựa Nguyên Sinh HDPE PN20 khổng lồ độ bền 50 năm, bật khiên đàn hồi tuyệt đối chặn mọi sát thương, gọi nguyên cỗ xe lu công trình cán qua đối thủ rồi vung búa tạ đập ống nhựa giáng cú nện trời giáng khẳng định 'Cứ HDPE là ngon luôn'!",
        skillPrompt: "khiên đàn hồi giáp bảo vệ hdpe, triệu hồi xe lu công trình cán qua, đè giáng búa tạ thiết bảng ống nhựa 50 năm 🧪 🔨 🚜 🛡️, choáng phản đòn sát thương x4.4"
    },

    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU
    // ==========================================
    quest: {
        title: "Đường Ống Thế Kỷ & Nhựa Nguyên Sinh HDPE",
        quote: "Cứ dùng nhựa nguyên sinh HDPE là ngon luôn anh em nhé! Đập búa tạ không vỡ, xe tải cán qua lại đàn hồi như mới, độ bền trên 50 năm!",
        specialLoot: "Ống Nhựa HDPE Sọc Xanh PN20 Siêu Bền 🧪",
        statBonusDesc: "+20% Giáp đàn hồi HDPE & Phản đòn chịu lực búa tạ"
    },

    battleCries: {
        intro: [
            "🧪 Nguyễn Văn Hiến chào anh em! Nhựa HDPE là ngon luôn!",
            "🔨 Đập búa tạ không vỡ, {enemy} định lấy gì xuyên thủng giáp HDPE?!",
            "🛡️ Độ bền 50 năm phơi mưa phơi nắng, vào việc luôn {enemy} ơi!"
        ],
        finisher: [
            "🧪 QUẢ NÀY DÙNG HDPE LÀ NGON LUÔN NHÉ {enemy}!",
            "🔨 BÚA ĐẬP KHÔNG VỠ, XE LU CÁN KHÔNG BẸP ĐÈ BẸP {enemy}!",
            "💦 MỐI HÀN NHIỆT KHÍT KHÌN KHỊT TIỄN {enemy} LÊN ĐƯỜNG!"
        ],
        parry: [
            "🛡️ Nhựa nguyên sinh HDPE đàn hồi cực đỉnh, nảy bật mọi đòn đánh!",
            "🔨 Đập thoải mái đi! Ống HDPE chịu va đập số 1 Việt Nam!"
        ],
        ult: [
            "🏗️ ĐẠI CÔNG TRÌNH HDPE: ĐỘ BỀN 50 NĂM BẤT DIỆT!",
            "🧪 NGUYỄN VĂN HIẾN KIỂM ĐỊNH: HDPE LÀ NGON LUÔN!"
        ]
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA NGUYỄN VĂN HIẾN (HIỆN TƯỢNG HDPE)
    // ==========================================
    trashTalk: {
        chapters: [
            "HDPE LÀ NGON LUÔN: BÚA ĐẬP KHÔNG VỠ VẢ NÁT {enemy}! 🧪",
            "HDPE LÀ NGON LUÔN: ĐẬP SẤP MẶT {enemy}! 🧪",
            "ĐỘ BỀN 50 NĂM: {enemy} ĐÁNH ĐẾN MÙA QUÝT CŨNG KHÔNG VỠ! 🛡️",
            "NGUYỄN VĂN HIẾN XUẤT CHIÊU: VỤT ỐNG HDPE VÀO MỒM {enemy}! 🔨",
            "CHỊU NHIỆT CHỊU VA ĐẬP: OUT TRÌNH {enemy} TOÀN TẬP! ⚡",
            "HÀN NHIỆT KHÍT KHÌN KHỊT: KHÓA CHẶT ĐƯỜNG SỐNG CỦA {enemy}! 🔥"
        ],
        midMatch: [
            "Cứ nhựa nguyên sinh HDPE là ngon luôn anh em nhé! Xe lu cán qua còn phồng lại, {enemy} tuổi gì! 🚜",
            "Anh nói thật với {enemy} nhé: Cứ dùng nhựa nguyên sinh HDPE là ngon luôn! 🧪",
            "Mày đấm vào người anh như lấy búa gõ ống nhựa HDPE thôi {enemy} ơi, đàn hồi lại nguyên vẹn! 🛡️",
            "Nhìn xương cốt {enemy} giòn như nhựa tái chế pha tạp chất thế kia thì chịu sao nổi 1 vụt HDPE! 🔨",
            "Ống nhựa HDPE của anh độ bền 50 năm, còn thanh máu của {enemy} không trụ nổi 50 giây! ⏱️",
            "Xe lu cán qua ống HDPE còn phồng lại như cũ, cỡ {enemy} vào đây anh uốn cong trong một nốt nhạc! 🚜",
            "Mối hàn nhiệt HDPE khít khìn khịt không rò rỉ một giọt, {enemy} định chạy đằng trời! 🔥",
            "Chống tia UV, kháng axit, chịu áp lực PN20... {enemy} tung chiêu gì anh cũng bao tất! 💎",
            "Nghe lời anh Hiến đi {enemy}, chuyển sang hệ HDPE là ngon luôn chứ đánh đấm thế này toang rồi! 😂"
        ],
        winQuotes: [
            {
                c: "Độ bền 50 năm chứng nhận uy tín!",
                s: "Nguyễn Văn Hiến vừa dùng thiết bảng HDPE kiểm định chất lượng lên thẳng mặt {enemy} và kết quả quá ngon! 🧪🔨"
            },
            {
                c: "Cứ nhựa HDPE là ngon luôn anh em nhé!",
                s: "Chủ tịch Nguyễn Văn Hiến vừa dùng ống nhựa nguyên sinh HDPE kiểm định độ bền lên thẳng mặt {enemy} và cái kết quá uy tín! 🧪🔥"
            },
            {
                c: "Độ bền 50 năm, đập búa không vỡ!",
                s: "{enemy} đấm mỏi cả tay không xước nổi lớp giáp HDPE, bị anh Hiến quật nhẹ một ống nằm thở oxy! 🔨🛡️"
            },
            {
                c: "Mối hàn nhiệt khít khìn khịt!",
                s: "Không một kẽ hở! Nguyễn Văn Hiến khóa chặt toàn bộ chiêu thức của {enemy} bằng công nghệ ống nhựa đỉnh cao! 💦👑"
            }
        ],
        loseQuotes: [
            {
                c: "Pha này đang thử áp suất ống PN25 thôi!",
                s: "Anh Hiến đứng im test thử độ đàn hồi thôi nhé, hiệp sau bật chế độ nguyên sinh 100% thì xác định! 🛡️"
            },
            {
                c: "Pha này đang thử nghiệm áp suất PN25 thôi!",
                s: "Anh Hiến đứng im cho {enemy} test thử độ đàn hồi của giáp HDPE thôi nhé, hiệp sau bật chế độ nhựa nguyên sinh 100% là tới công chuyện! 🧪😤"
            },
            {
                c: "Bận đi giao lô ống HDPE cho công trình lớn!",
                s: "Khách gọi chốt đơn 10 container ống nhựa HDPE nên anh Hiến nhường {enemy} thắng tạm để về ký hợp đồng! 🚛💸"
            },
            {
                c: "Nhiệt độ máy hàn chưa đủ 220 độ C!",
                s: "Chưa kịp bật máy hàn nhiệt đối đầu thôi, hẹn {enemy} kèo tái đấu anh lấy ống Ø500mm ra nói chuyện! 🔥🛠️"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN CỐT TRUYỆN 5 HỒI (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        // Hồi 1: Mở đầu (Khi Nguyễn Văn Hiến là người mở lời trước)
        opening: [
            "Chào {enemy} nhé! Anh là Nguyễn Văn Hiến đây, hôm nay lên sàn kiểm định xem đầu mày cứng hơn hay ống nhựa HDPE của anh bền hơn! 🧪🔨",
            "Anh tư vấn thật lòng cho {enemy} câu này: Cứ dùng nhựa nguyên sinh HDPE là ngon luôn, chứ giáp giấy như mày ăn một vụt là vỡ! 🛡️🔥",
            "Ê {enemy}! Ống nhựa HDPE bên anh độ bền 50 năm, đập búa tạ không nứt, xe tải cán không bẹp... mày nhắm chịu nổi mấy đòn?! 🚜⚡",
            "Bình tĩnh nào {enemy}! Để anh Hiến cầm cây ống HDPE sọc xanh này gõ thử vào mồm mày xem tiếng kêu có đanh không nhé! 😂💥"
        ],
        // Hồi 1: Đáp trả (Khi đối thủ mở lời trước)
        replyOpening: [
            "Nghe {enemy} gáy mà giòn tan như ống nhựa dỏm phơi nắng 3 hôm thế nhở! Vào đây anh Hiến dạy cho thế nào là độ dẻo dai của HDPE! 🧪🤣",
            "Mày bớt nổ đi {enemy} ơi! Sức công phá của mày còn chưa bằng áp suất nước PN16 trong lòng ống HDPE của anh đâu! 💦😎",
            "Á à {enemy} thích va chạm mạnh hả? Đúng bài của nhựa HDPE chịu va đập cực đại rồi, cứ lao vào đây! 🔨🛡️",
            "Hợp lý đấy {enemy}! Để anh bật máy hàn nhiệt 220 độ hàn kín cái mồm hay gáy sớm của mày lại luôn cho khít khìn khịt! 🔥😈"
        ],
        // Hồi 2: Giữa trận (HP < 75%)
        midFight: [
            "Ơ kìa {enemy}, đấm hết sức chưa đấy? Nhựa nguyên sinh HDPE đàn hồi tốt lắm, mày càng đấm anh càng nảy lực bật lại thôi! 🛡️😂",
            "Nhìn {enemy} thở dốc kìa! Mới va chạm vài hiệp đã rò rỉ hết cả thể lực, không kín khít bền bỉ như ống HDPE rồi! 💦⚡",
            "Thấy chưa {enemy}?! Anh đã bảo cứ HDPE là ngon luôn mà không nghe, ăn mấy vụt ống nhựa sọc xanh đã choáng váng mặt mày rồi à! 🧪🔨",
            "Uốn cong 360 độ không gãy nhé {enemy}! Kỹ thuật lạng lách đàn hồi chuẩn ISO của anh Hiến làm mày hoa mắt chưa?! 🌀😎"
        ],
        // Hồi 3: Cao trào (HP < 40%)
        climax: [
            "Giờ thì hết nói chuyện nhẹ nhàng nhé {enemy}! Anh xả van áp suất cực đại PN25 cho nổ tung sàn đấu luôn đây! 💥🔥",
            "Độ bền 50 năm của Nguyễn Văn Hiến không phải để làm cảnh đâu {enemy}! Chuẩn bị nhận combo Búa Tạ Kiểm Định HDPE! 🔨⚡",
            "Tầm này {enemy} có mặc giáp sắt cũng bị axit ăn mòn, chỉ có nhựa nguyên sinh HDPE của anh mới trường tồn bất diệt! 🧪👑",
            "Lên áp lực tối đa! Đập cho {enemy} bẹp dí như ống nhựa hàng chợ gặp xe lu 20 tấn luôn! 🚜💀"
        ],
        // Hồi 4: Kết liễu (Khi tung đòn kết thúc hoặc hạ gục đối thủ)
        finisher: [
            "Uy tín luôn nhé {enemy}! Đã bảo từ đầu là cứ HDPE là ngon luôn mà cứ thích cãi cố! 🧪👑",
            "Kiểm định hoàn tất! {enemy} chính thức vỡ vụn sau bài test va đập bằng ống nhựa HDPE siêu bền của Nguyễn Văn Hiến! 🔨💥",
            "Nằm im dưới sàn 50 năm đúng bằng tuổi thọ công trình HDPE nhé {enemy}! Anh Hiến đi chốt đơn tiếp đây! 🚛💸",
            "Khít khìn khịt, không một chút rò rỉ! Tạm biệt {enemy}, nhớ đặt mua ống nhựa HDPE ủng hộ anh Hiến nhé! ❤️🧪"
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

    // Hàm vẽ nhân vật Nguyễn Văn Hiến (Áo sơ mi kỹ sư/chủ tịch xanh HDPE + Cầm Thiết Bảng Ống Nhựa HDPE Đen Sọc Xanh)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        };

        // 1. Áo Chủ Tịch / Kỹ Sư Nhà Máy Nhựa HDPE (Xanh dương phối sọc phản quang)
        ctx.strokeStyle = "#0077b6";
        ctx.lineWidth = 8.5;
        ctx.beginPath();
        ctx.moveTo(neck.x, neck.y);
        ctx.lineTo(pelvis.x, pelvis.y);
        ctx.stroke();

        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(neck.x, neck.y + 2);
        ctx.lineTo(pelvis.x, pelvis.y - 3);
        ctx.stroke();

        // Quần âu đen công trình
        ctx.strokeStyle = "#1b263b";
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL);
        drawLimb(pelvis, kneeR, footR);

        // Cánh tay áo sơ mi xanh nhạt
        ctx.strokeStyle = "#90e0ef";
        ctx.lineWidth = 4.5;
        drawLimb(neck, elbowL, handL);
        drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar Nguyễn Văn Hiến (hpde.png)
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Vũ khí đặc trưng: Khúc Ống Nhựa Nguyên Sinh HDPE Đen Sọc Xanh Dương (Siêu bền đập không vỡ)
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(p.state === 'punch' ? 0.65 : -0.35);

        // Thân ống nhựa HDPE màu đen bóng
        ctx.fillStyle = "#11161d";
        ctx.fillRect(-3.5, -24, 7, 30);

        // Đường sọc xanh dương chuẩn ống nhựa HDPE nguyên sinh
        ctx.fillStyle = "#00f3ff";
        ctx.shadowBlur = isTrail ? 0 : 10;
        ctx.shadowColor = "#00f3ff";
        ctx.fillRect(-1, -24, 2.2, 30);

        // Miệng ống HDPE tròn ở đầu trên
        ctx.strokeStyle = "#00b4d8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -24, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 4. Giày bảo hộ công trình chống va đập
        ctx.fillStyle = "#0d1b2a";
        ctx.beginPath();
        ctx.arc(footL.x, footL.y, 4.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(footR.x, footR.y, 4.6, 0, Math.PI * 2);
        ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#00f3ff";
            ctx.shadowBlur = 14;
            ctx.shadowColor = "#ffffff";
            ctx.beginPath();
            ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

// Tự động ghi danh vào hệ thống
if (!window.classStats) window.classStats = {};
window.classStats[window.currentLoadedChar.id] = window.currentLoadedChar;
