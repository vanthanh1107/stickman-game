// ==========================================
// CHAR_SPIDERMAN.JS - SPIDER-MAN (NGƯỜI NHỆN ĐA VŨ TRỤ)
// ==========================================

window.currentLoadedChar = {
    id: "spiderman",
    className: "Spider-Man",
    hp: 1250,
    speed: 9,
    dmgMod: 1.5,
    color: "#e23636",
    avatarUrl: "character/picture/spiderman.png",
    voiceUrl: "character/voice/spiderman.wav",
    skill: {
        name: "SPIDER WEB STRIKE",
        icon: "🕸️",
        description: "Spider-Verse Strike: ba đường chém tơ nhện liên hoàn, sát thương x3.8.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'web_strike'; caster.attackTimer = 24; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 75, text: "🕸️ BẮN TƠ TRÓI CHÂN!", color: "#ffffff", alpha: 1, vx: 0, vy: -1, font: "bold 17px Arial", life: 42, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                for (let k = 0; k < 14; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 60, target.y - 40, "#ffffff", true);
                gameContext.takeDamage(target, 34 * (caster.currentDmgMod || caster.dmgMod || 1), "#ffffff", false, false, caster.isFacingRight);
                target.stunTimer = 65;
            }, 220);
        }
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Sứ Mệnh Khâu Vá Đa Vũ Trụ",
            "quote": "Giác quan nhện rung lên dữ dội! Các vết nứt đa vũ trụ đang thả quái vật cổ đại xuống 8 vùng đất. Ta phải phóng tơ quét sạch chúng!",
            "specialLoot": "Tơ Nhện Đa Vũ Trụ 🕸️",
            "statBonusDesc": "+15% Tốc độ di chuyển & Giác quan né đòn"
    },
    battleCries: {
            "intro": [
                    "🕸️ Giác quan Nhện rung lên rồi!",
                    "🕷️ Người hàng xóm thân thiện tới đây!",
                    "🍕 Pizza time! Đánh nhanh còn đi giao hàng!"
            ],
            "finisher": [
                    "🕸️ Dán chặt mồm vào tường nhé {enemy}!",
                    "🕷️ Sức mạnh lớn - Trách nhiệm lớn!",
                    "🕺 Bully Maguire: Put dirt in your eye!"
            ],
            "parry": [
                    "⚡ Giác quan Nhện đọc vị 100%!",
                    "🕸️ Đu tơ né đòn quá ảo diệu!"
            ],
            "ult": [
                    "🕸️ WEB-VERSE ĐA VŨ TRỤ STRIKE!",
                    "🕷️ BẮN TƠ BỦA VÂY KHÔNG LỐI THOÁT!"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA NHỆN NHỌ SPIDER-MAN
    // ==========================================
    trashTalk: {
        chapters: [
            "NGƯỜI HÀNG XÓM THÂN THIỆN: BẮN TƠ DÁN MỒM {enemy}! 🕸️🕷️",
            "SPIDER-VERSE ĐẠI CHIẾN: TỐNG CỔ {enemy} VỀ VŨ TRỤ GỐC 🌌",
            "GIÁC QUAN NHỆN BÁO HIỆU: {enemy} SẮP NẰM SÀN! ⚡",
            "BULLY MAGUIRE NHẢY MÚA: XÁT MUỐI VÀO MẶT {enemy} 🕺"
        ],
        midMatch: [
            "Giác quan Nhện (Spider-Sense) của tao vừa rung lên, hóa ra là báo hiệu {enemy} sắp ăn đòn! 🕷️⚡",
            "Đứng im cho tao bắn một cục tơ dán chặt mồm mày vào tường nhé {enemy}! 🕸️",
            "I'm gonna put some dirt in your eye! Chuẩn bị ăn bụi vào mắt đi {enemy} ơi! 😎",
            "Mày định khóc đấy à {enemy}? Gonna cry? Đánh đấm chậm thế sao bắt được Nhện! 😂",
            "Sức mạnh càng lớn thì trách nhiệm vả vỡ mồm {enemy} càng cao! 💪🕷️",
            "Đu tơ lượn vòng vòng trên đầu làm {enemy} hoa mắt chóng mặt luôn này! 🏙️"
        ],
        winQuotes: [
            {
                c: "Đã gói gọn trong kén tơ nhện!",
                s: "Spider-Man vừa treo ngược {enemy} lên cột đèn giao thông chờ cảnh sát tới hốt! 🕸️🚨"
            },
            {
                c: "Vũ điệu Bully Maguire!",
                s: "Sau khi hạ đo ván {enemy}, Nhện Nhọ vừa vuốt tóc mái vừa nhảy điệu nhạc đường phố cực chất! 🕺🕷️"
            },
            {
                c: "Giác quan Nhện out trình 100%!",
                s: "Mọi đòn đánh của {enemy} đều bị đọc vị trước 5 giây, không trúng được dù chỉ một sợi lông! ⚡"
            }
        ],
        loseQuotes: [
            {
                c: "Hết bình dung dịch bắn tơ!",
                s: "Đang đu giữa không trung thì hộp phóng tơ hết đạn, đợi Peter Parker về phòng thí nghiệm nạp thêm nhé {enemy}! 🧪🕸️"
            },
            {
                c: "Bận đi giao bánh Pizza đúng giờ!",
                s: "Chủ tiệm gọi giục giao Pizza trong 29 phút nên Nhện Nhọ phải đu đi gấp, hẹn {enemy} tối nay! 🍕"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan khoan đừng đấm {enemy}! Ông chủ trọ vừa gọi đòi tiền phòng tháng này, tao đang cáu sẵn nên lên đây trút giận vào mặt mày đấy! 🕸️😤",
            "Đứng im tạo dáng cái nào {enemy}! Tao phải chụp vội tấm ảnh 'Người Nhện đập tơi bời tội phạm {enemy}' đem bán cho tòa báo kiếm tiền ăn sáng đã! 📸🕷️",
            "Ê {enemy}, nhìn bộ trang phục chiến đấu của mày buồn cười thế? Mẹ mày khâu tay cho mày lúc đi ngủ đấy à! 🧵😂",
            "Bình tĩnh nào {enemy}! Giác quan Nhện của tao vừa rung bần bật... ồ nhầm, là cái bụng đói meo của tao đang kêu gào đòi giao Pizza! 🍕🤣",
            "I'm gonna put some dirt in your eye! Chuẩn bị tinh thần ăn một vốc cát bụi đường phố xát thẳng vào mắt chưa hả {enemy}? 😎🕺",
            "Từ từ {enemy}! Muốn tao bắn tơ dán khóa kéo cái mồm hay cột hai giò mày treo ngược lên cột đèn giao thông trước đây? 🕸️🚦"
        ],
        replyOpening: [
            "Gonna cry? Định mếu máo khóc nhè về mách mẹ đấy à {enemy}, nghe giọng hù dọa mà run rẩy yếu ớt thế! 😢👉",
            "Gáy to ghê chưa {enemy}! Thanos búng tay bay nửa vũ trụ tao còn từng nhảy lên đạp vào mặt lão được, cỡ mày chỉ là trộm vặt cấp phường thôi! 🌌🕷️",
            "Ồ tao sợ {enemy} quá cơ, sợ đến mức phải bật nhạc Jazz vuốt tóc mái xéo nhảy điệu Bully Maguire cà khịa ngay trước mũi mày này! 🕺😈",
            "Bớt lải nhải diễn văn phản diện đi {enemy}! Mấy thằng ác nhân nói nhiều trong phim siêu anh hùng toàn bị tao đấm ngất lúc chưa hết câu thôi! 🎬😂",
            "Mày muốn tao xin lỗi vì đã chê mày gà á {enemy}? You want forgiveness? Ra nhà thờ mà cầu nguyện đi con trai! ⛪😎",
            "Cứ vung tay chém gió đi {enemy}, hộp dung dịch tơ nhân tạo của tao mới pha thêm keo con voi siêu dính dành riêng cho mồm mày đấy! 🧪🕸️"
        ],
        midFight: [
            "Khoan dừng lại 2 giây {enemy}! Đấm vào không khí nãy giờ có mỏi bả vai không, tao đang bám dính ngược trên trần nhà nhìn mày đây này! 🙃🕷️",
            "Ê {enemy}, mắt bị làm sao mà nheo nheo thế? Bị anh Nhện Bully Maguire hất bụi bẩn vào mắt cay xè không thấy đường rồi chứ gì! 😎💨",
            "Đứng lại tao hỏi {enemy}: Bác Ben từng dặn 'Sức mạnh càng lớn trách nhiệm càng cao', thế sao mày yếu nhớt mà cứ thích gánh lấy cái cáng cứu thương thế? 🚑🤣",
            "Từ từ nào {enemy}! Mới quấn có 3 vòng tơ nhện vào cổ chân mà đã ngã sấp mặt đo đường như bao tải khoai tây rồi à! 🕸️😂",
            "Sao thế {enemy}? Giác quan Nhện báo trước đòn đánh của mày sớm tận 5 giây, tao vừa nhai bánh mì vừa né cũng không trúng nổi một sợi chỉ áo! 🥖⚡",
            "Nhìn {enemy} vung đấm chậm như phim quay chậm kìa! Nhanh cái tay lên mày ơi, quá 29 phút giao bánh Pizza là tao bị trừ sạch lương đấy! 🍕⏰"
        ],
        climax: [
            "Mặt mày méo xệch sắp khóc thật rồi kìa {enemy}! Gonna cry? Để tao dệt sẵn cái khăn tay bằng tơ nhện lau nước mắt cho nhé! 😭🕸️",
            "Hết mana giãy giụa rồi hả {enemy}? Chuẩn bị đóng gói tròn xoe như con nhộng tằm treo lủng lẳng chờ xe cảnh sát phường tới hốt nào! 🚨🕷️",
            "See ya, chump! Hẹn gặp lại trong buồng giam nhé thằng đần {enemy}, cú đu dây song phi cuối cùng đang lao tới mặt mày với tốc độ tàu cao tốc đấy! 🚆💥",
            "Đừng nhìn tao bằng ánh mắt cầu xin thế {enemy}! Bạn gái bỏ, tiền nhà nợ, nay không đấm gục mày lấy ảnh đăng báo thì tao uống nước lã cầm hơi à! 📸😈",
            "Bật sẵn điệu nhảy xoay hông chỉ tay Bully Maguire ăn mừng trước luôn này {enemy}, thanh máu mày hết thuốc chữa rồi! 🕺💀"
        ],
        finisher: [
            "Gói hàng hoàn tất! Treo ngược cục kén {enemy} lên cột điện kèm tờ giấy nhắn: 'Người Nhện hàng xóm thân thiện gửi tặng các chú công an'! 🕸️🚨",
            "See ya, chump! Vuốt tóc mái xéo nhảy điệu Bully Maguire cực cháy bước qua cái xác bất động của {enemy}! 🕺😎",
            "Chụp xong 5 kiểu ảnh góc đẹp sắc nét của {enemy} nằm bẹp dí! Quả này đem bán cho ông tổng biên tập Jameson kiếm bộn tiền trả tiền trọ rồi! 📸💵",
            "Vừa kịp còn 2 phút đi giao hộp bánh Pizza nóng hổi! Tạm biệt tội phạm hạng xoàng {enemy}, lần sau nhớ tập phản xạ trước khi ra đường nhé! 🍕🕷️"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: WEB STRIKE COMBO
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'web_strike';
        caster.attackTimer = 50;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🕸️ SPIDER-VERSE STRIKE!",
            color: "#e23636", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 50, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(640, 'sine', 0.2, 0.45);

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(16, 10);
            if (typeof window.playSound === 'function') window.playSound(210, 'square', 0.45, 0.8, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#ffffff", true, 5.0, 0);
                window.spawnSlash(target.x, target.y - 45, !caster.isFacingRight, "#e23636", true, 4.0, Math.PI / 5);
                window.spawnSlash(target.x, target.y - 15, caster.isFacingRight, "#0984e3", true, 4.0, -Math.PI / 5);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.8, "#ffffff", true, false, caster.isFacingRight);
            }
            target.stunTimer = 75;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🕸️" : "🕷️", "#ffffff", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 280);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // Vẽ Thân (Màu xanh dương đậm đặc trưng của Spider-Man)
        ctx.strokeStyle = "#0984e3";
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // Vẽ Chân tay
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#0984e3";
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);
        ctx.strokeStyle = "#e23636";
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // Vẽ Đầu (Avatar Spider-Man từ picture_data.js / character/picture/spiderman.png)
        if (typeof window.drawAvatarHead === 'function') {
            window.drawAvatarHead(ctx, head, p, isTrail, 36);
        } else {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2);
            ctx.fillStyle = "#e23636";
            ctx.fill();
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.0; ctx.stroke();
        }

        // Hiệu ứng tia tơ nhện phóng ra từ tay khi tung Ultimate hoặc đang đánh
        if (p.state === 'web_strike' || p.state === 'punch') {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(handR.x, handR.y);
            ctx.lineTo(handR.x + 24, handR.y + (p.state === 'web_strike' ? -10 : 5));
            ctx.stroke();
        }

        // Vẽ Bàn tay / Bàn chân
        ctx.shadowBlur = 0; ctx.fillStyle = "#e23636";
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["spiderman"] = window.currentLoadedChar;
