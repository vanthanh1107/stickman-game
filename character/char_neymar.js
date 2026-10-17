// ==========================================
// CHAR_NEYMAR.JS - NEYMAR JR (HOÀNG TỬ SAMBA & DRAMA KING)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "neymar",
    className: "Neymar Jr",
    hp: 950, speed: 7, dmgMod: 1.5, color: "#f1c40f",
    avatarUrl: "https://i.ibb.co/N6kZ65n1/neymar.jpg",
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

        setTimeout(() => {
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

        setTimeout(() => {
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
