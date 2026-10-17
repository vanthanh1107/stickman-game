// ==========================================
// CHAR_PHUONGHANG.JS - CEO NGUYỄN PHƯƠNG HẰNG (BÃO LIVESTREAM & KIM CƯƠNG)
// ==========================================

window.currentLoadedChar = {
    id: "phuonghang",
    className: "Phuong Hang",
    hp: 1250, speed: 5, dmgMod: 1.8, color: "#e84393",
    avatarUrl: "https://i.ibb.co/2Yn3vY99/Generated-Image-July-05-2026-8-47-PM-Recovered.png",
    skill: {
        name: "LIVESTREAM BÃO SAO KÊ",
        icon: "💎",
        description: "Livestream bão sao kê: ném mưa kim cương và tiền xuống đối thủ, sát thương x3.8.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'livestream_drama'; caster.attackTimer = 28; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "💎 ĐÊM NAY TÔI NẰM MƠ!", color: "#e84393", alpha: 1, vx: 0, vy: -1, font: "900 17px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(12, 8);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 70, target.y - 45, "#00ffff", true);
                gameContext.takeDamage(target, 38 * (caster.currentDmgMod || caster.dmgMod || 1), "#e84393", true, false, caster.isFacingRight);
                target.stunTimer = 60;
            }, 240);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CEO PHƯƠNG HẰNG
    // ==========================================
    trashTalk: {
        chapters: [
            "BÃO LIVESTREAM KỶ LỤC: GỌI THẲNG TÊN {enemy} LÊN SÓNG! 📢",
            "KIM CƯƠNG CÂN KÝ & SỔ ĐỎ CÂN ĐOẠN ĐÈ BẸP {enemy} 💎",
            "ĐÊM QUA TÔI NẰM MƠ THẤY {enemy} NẰM SÀN! 🔮",
            "SAO KÊ MINH BẠCH: QUÉT SẠCH CÂY MÁU CỦA {enemy} 📄"
        ],
        midMatch: [
            "Quý vị ơi! Đêm qua tôi vừa nằm mơ thấy {enemy} bị tôi vả không trượt phát nào! 🔮📢",
            "Kim cương của tôi tính bằng ký, sổ đỏ tính bằng sấp, lấy đè lên người {enemy} là tắt thở! 💎📕",
            "Đứng im đấy {enemy}! Hôm nay tôi mở Livestream bóc trần toàn bộ thanh máu của {enemy}! 📱",
            "Dĩ vãng dơ dáy dễ gì giấu giếm hả {enemy}, mau nộp bản sao kê sát thương ra đây! 📄🔥",
            "Nhìn viên হột xoàn 50 carat trên tay tôi có làm {enemy} lóa mắt không? 💍✨",
            "Thư ký đâu! Bật nhạc remix lên cho tôi combat với {enemy} tới sáng luôn! 🎶💃"
        ],
        winQuotes: [
            {
                c: "Phiên Livestream triệu mắt xem!",
                s: "CEO Phương Hằng vừa chốt hạ {enemy} ngay trên sóng trực tiếp trước sự chứng kiến của hàng triệu khán giả! 📢💎"
            },
            {
                c: "Lấy kim cương và sổ đỏ đè bẹp!",
                s: "Sức nặng từ bộ sưu tập hột xoàn hàng hiệu đã khiến {enemy} tâm phục khẩu phục! 💍📕"
            },
            {
                c: "Giấc mơ tiên tri chuẩn 100%!",
                s: "Đúng như giấc chiêm bao tối qua, {enemy} đã không trụ nổi quá một hiệp đấu! 🔮"
            }
        ],
        loseQuotes: [
            {
                c: "Mạng Wifi phòng Livestream bị nghẽn!",
                s: "Do có quá nhiều người tràn vào xem cùng lúc làm sập đường truyền thôi, hẹn {enemy} buổi phát sóng tối mai! 📱"
            },
            {
                c: "Đeo nhiều nhẫn kim cương nặng tay quá!",
                s: "Mỗi ngón đeo một viên hột xoàn to đùng nên vung tay hơi mỏi, tháo bớt trang sức là {enemy} tới số! 💎"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: LIVESTREAM "BÃO SAO KÊ" & "KIM CƯƠNG"
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'livestream_drama';
        caster.attackTimer = 55;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "💎 BÃO SAO KÊ & KIM CƯƠNG!",
            color: "#00ffff", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 19px Arial", life: 52, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(550, 'sine', 0.25, 0.5);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(16, 12);
            if (typeof window.playSound === 'function') window.playSound(190, 'square', 0.45, 0.8, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#f1c40f", true, 5.0, Math.PI / 5);
                window.spawnSlash(target.x, target.y - 25, !caster.isFacingRight, "#00ffff", true, 4.5, -Math.PI / 5);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.8, "#e84393", true, false, caster.isFacingRight);
            }

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 7; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 75, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "💎" : "📄", "#00ffff", "20px Arial", 45, true
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

        // 1. VẼ THÂN (Mặc váy/vest dạ hội màu Đỏ Ruby / Hồng đậm sang trọng)
        ctx.strokeStyle = "#d63031";
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // 2. VẼ CHÂN TAY
        ctx.strokeStyle = "#ff7675";
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. VẼ ĐẦU NHÂN VẬT DÙNG CHUNG
        window.drawAvatarHead(ctx, head, p, isTrail, 38);

        // 4. VŨ KHÍ: CẦM VIÊN KIM CƯƠNG "HÀNG KÝ" PHÁT SÁNG TRÊN TAY PHẢI
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = isTrail ? 0 : 15;
        ctx.shadowColor = "#ffffff";

        ctx.beginPath();
        ctx.moveTo(handR.x, handR.y - 10);
        ctx.lineTo(handR.x + 8, handR.y - 2);
        ctx.lineTo(handR.x, handR.y + 12);
        ctx.lineTo(handR.x - 8, handR.y - 2);
        ctx.closePath();
        ctx.fill();

        // 5. VẼ BÀN TAY / BÀN CHÂN
        ctx.shadowBlur = 0; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 3, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["phuonghang"] = window.currentLoadedChar;
