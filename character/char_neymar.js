// ==========================================
// CHAR_NEYMAR.JS - NEYMAR JR (HOÀNG TỬ SAMBA & DRAMA KING)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "neymar",
    className: "Neymar Jr",
    hp: 950, speed: 7, dmgMod: 1.5, color: "#f1c40f",
    avatarUrl: "character/picture/neymar.png",
    voiceUrl: "character/voice/neymar 1.wav",
    skill: {
        name: "SAMBA MAGIC & DRAMA",
        icon: "😭",
        description: "Ăn vạ đòi phạt đền, rút thẻ đỏ rồi lừa đối thủ bằng cú sút Samba. Sát thương x4.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🕺 VŨ ĐIỆU SAMBA!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                for (let k = 0; k < 15; k++) {
                    let color = Math.random() > 0.5 ? "#f1c40f" : "#2ecc71";
                    gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 80, target.y - 40, color, true);
                }

                if (Math.abs(caster.x - target.x) < 200) {
                    gameContext.takeDamage(target, 30 * (caster.currentDmgMod || caster.dmgMod || 1), "#2ecc71", false, false, caster.isFacingRight);
                    target.stunTimer = 90;
                    gameContext.floatingTexts.push({ x: target.x, y: target.y - 90, text: "💫 CHÓNG MẶT!", color: "#2ecc71", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial", life: 40, noGravity: true });
                }
            }, 200);
        }
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Vũ Điệu Samba Xuyên Lục Địa",
            "quote": "Biến đấu trường nguy hiểm thành sàn nhảy Samba! Dù có vấp ngã ăn vạ cũng phải đứng lên múa tiếp!",
            "specialLoot": "Mặt Nạ Lễ Hội Samba 🎭",
            "statBonusDesc": "+15% Tỷ lệ né đòn & Đòn choáng mê hoặc"
    },
    battleCries: {
            "intro": [
                    "VŨ ĐIỆU SAMBA ĐỐT CHÁY SÀN ĐẤU! 🕺🇧🇷",
                    "ĐỨNG IM CHO TAO GẮP BÓNG CẦU VỒNG! 🌈⚽",
                    "CHẠM VÀO LÀ TAO LĂN 18 VÒNG ĂN THẺ ĐỎ ĐẤY! 😭🟥",
                    "JOGA BONITO! NGHỆ THUẬT ĐƯỜNG PHỐ LÊN TIẾNG! 🎨"
            ],
            "finisher": [
                    "GẮP BÓNG CẦU VỒNG QUA ĐẦU ĐỐI THỦ! 🌈💥",
                    "VŨ ĐIỆU SAMBA BRAZIL ĐỈNH CAO! 🕺🔥",
                    "TRỌNG TÀI RÚT THẺ ĐỎ ĐUỔI THẲNG CỔ! 🟥📢",
                    "ĂN VẠ ĐỈNH CAO RINH TƯỢNG VÀNG OSCAR! 😭🎬"
            ],
            "parry": [
                    "ĐẢO CHÂN RANG LẠC XOẮN CỘT SỐNG! 🕺💫",
                    "ÔM CHÂN ĂN VẠ ĐÒI PENALTY NGAY! 😭📢",
                    "LƯỢN NHƯ CÁ CẢNH QUA MẶT {enemy}! 🌈"
            ],
            "ult": [
                    "LỄ HỘI SAMBA BRAZIL RỰC LỬA KHÔNG THỂ CẢN! 🕺🇧🇷",
                    "SIÊU PHẨM CẦU VỒNG MA THUẬT RÁCH LƯỚI! 🌈⚽"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA HOÀNG TỬ SAMBA NEYMAR JR
    // ==========================================
    trashTalk: {
        chapters: [
            "VŨ ĐIỆU SAMBA: GẮP BÓNG CẦU VỒNG QUA ĐẦU {enemy} 🌈",
            "GIẢI OSCAR DIỄN XUẤT: CÚ ĂN VẠ KHIẾN {enemy} DÍNH THẺ ĐỎ 🟥",
            "HOÀNG TỬ BRAZIL THƯỢNG ĐÀI MÚA KỸ THUẬT TRƯỚC {enemy} 🇧🇷",
            "KÈO CĂNG: ĐẢO CHÂN RANG LẠC LÀM {enemy} XOẮN CỘT SỐNG 🕺",
            "SỐ 10 HUYỀN THOẠI: BIẾN {enemy} THÀNH TRÒ HỀ TRÊN SÂN 🎪"
        ],
        midMatch: [
            "Đứng im cho tao gắp bóng Cầu Vồng (Rainbow Flick) qua đầu cái coi {enemy} ơi! 🌈⚽",
            "Cẩn thận đừng chạm vào người tao nhé {enemy}, tao lăn 18 vòng trên cỏ là mày ăn Thẻ Đỏ đấy! 🟥😭",
            "Nhạc Samba nổi lên rồi, nhìn đôi chân ma thuật Brazil nhảy múa đây này {enemy}! 🕺🇧🇷",
            "Kỹ thuật của {enemy} cứng đờ như khúc gỗ, gặp tao đảo chân 3 nhịp là ngã trật khớp háng! 💫",
            "Ở Ả Rập ngồi không tao cũng lĩnh lương trăm triệu đô, vào đây vả {enemy} giải trí thôi! 🤑",
            "Trọng tài đâu rồi!! Thằng {enemy} nó vừa thở mạnh làm bay tóc của tôi này, rút thẻ ngay! 📢🟨",
            "Múa kỹ thuật xong đứng chỉ tay cười vào mặt {enemy} mới gọi là phong cách Joga Bonito! 😜",
            "Đoán xem tao định sút góc nào đi {enemy}, nhịp lấy đà nhảy chân sáo này uy tín 100%! 🎯"
        ],
        winQuotes: [
            {
                c: "Vũ điệu Samba hủy diệt!",
                s: "Neymar Jr vừa nhảy múa qua mặt {enemy} rồi bật nhạc ăn mừng cực cháy cùng các vũ công Brazil! 🕺🇧🇷"
            },
            {
                c: "Tượng vàng Oscar cho pha ăn vạ!",
                s: "{enemy} vừa bị trọng tài đuổi thẳng cổ khỏi sân vì lỡ chạm nhẹ vào vạt áo của Neymar! 🟥🎬"
            },
            {
                c: "Gắp bóng Cầu Vồng đỉnh cao!",
                s: "{enemy} vẫn đang ngơ ngác tìm bóng trên trời trong khi thanh máu đã về 0 từ đời nào! 🌈⚽"
            },
            {
                c: "Đẳng cấp kỹ thuật đường phố!",
                s: "Một màn biểu diễn Freestyle biến {enemy} thành khán giả bất đắc dĩ ngay trên sàn đấu! 🎪"
            }
        ],
        loseQuotes: [
            {
                c: "Đau cổ chân quá bác sĩ ơi!",
                s: "Neymar vừa ôm chân lăn 20 vòng từ giữa sân về tận bệnh viện để kịp đi dự tiệc sinh nhật em gái! 🚑🎉"
            },
            {
                c: "Đang bận livestream bắn CS2!",
                s: "Tối qua thức khuya leo rank game bắn súng nên hôm nay cổ chân hơi mỏi tí thôi nhé {enemy}! 🎮"
            },
            {
                c: "Trọng tài thiên vị {enemy} trắng trợn!",
                s: "Pha đấy phạm lỗi mười mươi trong vòng cấm mà không thổi Penalty cho Neymar! 📢"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Cảnh báo trước nhé {enemy}! Mày chỉ cần thở mạnh trúng vạt áo tao thôi là tao ôm chân lăn 18 vòng kiếm Thẻ Đỏ đuổi mày đấy! 🟥😭",
            "Khoan đánh đã {enemy}! Bật nhạc Samba vũ hội Brazil lên cho Hoàng tử đường phố nhảy vài đường đảo chân làm nóng nào! 🕺🇧🇷",
            "Ê {enemy}, đánh nhanh thắng gọn trong 2 phút nhé! Tối nay tao còn lịch bay chuyên cơ về dự sinh nhật em gái với bắn CS2 nữa! ✈️🎮",
            "Đứng im tao nhìn cái {enemy}! Bộ pháp cứng đờ như robot gỉ sét thế kia mà gặp tao gắp bóng Cầu Vồng qua đầu thì quê lắm! 🌈😂",
            "Từ từ {enemy}! Ở Ả Rập tao ngồi chơi xơi nước mỗi tuần đút túi mấy triệu đô, vào đây múa kỹ thuật trêu chó mày cho vui thôi! 🤑⚽",
            "Trọng tài nhớ nhìn kỹ thằng {enemy} nhé! Mặt nó gian lắm, chưa đá đã thấy mùi chuẩn bị phạm lỗi thô bạo với nghệ sĩ rồi! 📢😏"
        ],
        replyOpening: [
            "Á à {enemy} dám dọa tao à! Trọng tài ơi nó vừa dùng lời nói gây chấn thương tâm lý cho tôi kìa, thổi Penalty ngay đi! 📢🟨",
            "Gáy to thế {enemy}? Để tao đứng nhấp nhả đảo chân rang lạc trước mặt rồi lấy mông hất bóng cho mày tức nổ đom đóm mắt nhé! 😜🇧🇷",
            "Ồ căng đấy {enemy}! Nhưng diễn xuất của mày còn non lắm, gặp Tượng Vàng Oscar ăn vạ như anh đây là mày ra chuồng gà! 🎬🏆",
            "Bớt hổ báo đi {enemy} ơi! Bóng đá là phải nghệ thuật Joga Bonito, ai lại hùng hục lao vào như trâu húc mả giống mày! 🎪🤣",
            "Nghe {enemy} nổ mà tao muốn thè lưỡi lêu lêu vào mặt luôn á! Vào đây mà lấy bóng trong chân số 10 Brazil này! 😛⚽",
            "Cứ hung hăng đi {enemy}, mày chạm nhẹ vào cọng tóc nhuộm vàng của tao là ăn ngay quả đá phạt đền nhảy chân sáo đấy! 🎯😈"
        ],
        midFight: [
            "Ái chà đau quá bác sĩ ơi... ủa lộn, {enemy} mới là đứa vừa bị tao lừa gãy lưng ngã dập mông mà, hê hê quê chưa! 🚑😜",
            "Khoan dừng lại {enemy}! Chóng mặt buồn nôn chưa em? Mới đảo chân Elastico có 3 nhịp mà mắt mày lác xệch sang hai bên rồi kìa! 😵‍💫🕺",
            "Ê {enemy}, bóng đang ở trên trời sau lưng mày kìa! Gắp Cầu Vồng Rainbow Flick mượt thế mà vẫn đứng ngửa cổ tìm à? 🌈🤣",
            "Từ từ nào {enemy}! Sao cay cú đòi chém chân người ta thế, bất lực trước kỹ thuật thượng thừa của Hoàng tử Samba rồi chứ gì! 🇧🇷😏",
            "Đứng lại tao chỉ tay cười cái coi {enemy}! Đánh đấm gì mà trông như diễn hài tấu sập gầm thế này! 🎪😂",
            "Trọng tài đâu không cần rút thẻ đâu, để tôi tự nhảy múa vờn thằng {enemy} đến khi nó tự trật khớp gối luôn! 🕺⚡"
        ],
        climax: [
            "Penalty mười mươi rồi nhé {enemy}! Nhìn nhịp chạy đà nhảy chân sáo thương hiệu của tao mà đoán hướng bóng trong tuyệt vọng đi! 🎯😈",
            "Sắp gục rồi hả {enemy}? Đáng đời cái tội dám thái độ lồi lõm với nghệ sĩ nhân dân sân cỏ Brazil! 🎬🇧🇷",
            "Còn đứng run lẩy bẩy kìa {enemy}! Để tao bật loa kẹo kéo nhảy điệu Paradinha tiễn mày lên cáng cho có không khí lễ hội nhé! 🎶🕺",
            "Tầm này {enemy} có lăn ra ăn vạ giống tao thì trọng tài cũng xua tay cho đá tiếp thôi con trai ạ! 🟥😂",
            "Chuẩn bị chụp ảnh màn hình pha bẽ mặt lịch sử này của {enemy} đăng lên mạng kiếm triệu tim nào anh em! 📸🔥"
        ],
        finisher: [
            "Joga Bonito! Nhảy Samba ăn mừng cực cháy ngay trên nỗi đau của {enemy}, nghệ thuật là đây chứ đâu! 🕺🇧🇷",
            "Trao ngay cúp Oscar và chiến thắng tuyệt đối cho Neymar! Còn {enemy} nhận thẻ đỏ rời cuộc chơi trong nước mắt! 🟥🏆",
            "Xong kèo nhẹ nhàng không bẩn đôi giày vàng! Giờ tao lên chuyên cơ đi quẩy tiệc rồi livestream CS2 đây, bye {enemy} gà mờ! ✈️🎮",
            "Một pha gắp bóng Cầu Vồng khép lại vở kịch! Cảm ơn diễn viên quần chúng {enemy} đã ngã rất đẹp mắt! 🌈👑"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: "ĂN VẠ ĐỈNH CAO" & PHẠT ĐỀN BÙNG NỔ
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'hurt';
        caster.attackTimer = 60;
        caster.vx = caster.isFacingRight ? 10 : -10;
        caster.iFrames = 60;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "😭 Á ĐAU QUÁ! PHẠT ĐỀN!",
            color: "#ffffff", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 18px Arial", life: 50, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.floatingTexts.push({
                x: target.x, y: target.y - 120,
                text: "🟥 THẺ ĐỎ!",
                color: "#e74c3c", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 60, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(15, 10);
            target.stunTimer = 90;
            target.vx = 0;
        }, 280);

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target) return;
            caster.state = 'kick';
            caster.attackTimer = 30;
            caster.vx = 0;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 100,
                text: "😜 LỪA ĐẤY! SAMBA SHOT!",
                color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 20px Arial", life: 60, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30),
                y: caster.y - 25,
                vx: caster.isFacingRight ? 32 : -32,
                vy: -3,
                r: 22,
                rot: 0,
                dmg: baseDmg * 4.0,
                isUlt: true,
                stun: 80,
                color: "#2ecc71",
                life: 80,
                caster: caster,
                target: target
            });

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 12, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🟥" : "🕺", "#f1c40f", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 580);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Đội tuyển Brazil (Vàng tươi viền Xanh lá)
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
        ctx.strokeStyle = "#2ecc71"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(neck.x - 2, neck.y); ctx.lineTo(neck.x + 2, neck.y); ctx.stroke();

        ctx.strokeStyle = "#2980b9"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#e0ac69"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Giày đá bóng Puma Future (Màu cam/hồng neon nổi bật)
        ctx.fillStyle = "#fd79a8";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#2ecc71";
            ctx.shadowBlur = 15; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["neymar"] = window.currentLoadedChar;
