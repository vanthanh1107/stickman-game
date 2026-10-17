// ==========================================
// CHAR_RONALDO.JS - CRISTIANO RONALDO (CR7 SIUUUU!)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "ronaldo",
    className: "Cristiano Ronaldo",
    hp: 1050, speed: 6, dmgMod: 1.5, color: "#c0392b",
    avatarUrl: "https://i.ibb.co/LDM044J5/ronaldo.jpg",
    skill: {
        name: "BICYCLE KICK & SIUUUU",
        icon: "⚽",
        description: "Tung cú Bicycle Kick rồi ăn mừng SIUUU, quả bóng lửa gây sát thương x4.2.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0; caster.vy = -10;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "👑 GOAT SIUUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 20px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(15, 10);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 100, window.GROUND_Y, "#f1c40f", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 40 * (caster.currentDmgMod || caster.dmgMod || 1), "#f1c40f", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vy = -8;
                    target.onGround = false;
                }
            }, 300);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CRISTIANO RONALDO (CR7)
    // ==========================================
    trashTalk: {
        chapters: [
            "SIUUUUU: CÚ XE ĐẠP CHỔNG NGƯỢC TIỄN {enemy} VỀ NƯỚC! ⚽",
            "CHƯƠNG ĐẶC BIỆT: 5 QUẢ BÓNG VÀNG ĐÈ BẸP {enemy} 🏆",
            "MR. CHAMPIONS LEAGUE THƯỢNG ĐÀI VS {enemy} 👑",
            "BẬT NHẢY 2M93: ĐÁNH ĐẦU VỠ MŨ {enemy} 🔥",
            "KỶ LUẬT THÉP CR7: DẠY CHO {enemy} BÀI HỌC THỂ LỰC 💪",
            "PHÚT 90+3: MÀN LẬT KÈO KINH ĐIỂN TRƯỚC {enemy} ⚡"
        ],
        midMatch: [
            "Chuẩn bị nghe cả sân vận động đồng thanh hô SIUUUUUU khi tao hạ gục mày nhé {enemy}! 🐐🔥",
            "Tao bật nhảy cao 2m93 trên không trung, nhìn xuống thấy {enemy} bé như con kiến! ⚽",
            "Bỏ chai Coca-Cola xuống và uống nước lọc đi {enemy}, yếu nhớt thế kia sao chịu nổi 90 phút! 💧",
            "5 Quả Bóng Vàng và hơn 900 bàn thắng trong sự nghiệp, còn {enemy} có danh hiệu gì chưa? 🏆",
            "Cú sút phạt Knuckleball vận tốc 130km/h này sẽ ghim thẳng vào giữa mặt {enemy}! ☄️",
            "Áp lực ư? Không có áp lực thì không có kim cương! {enemy} càng gáy tao đá càng sung! 💎",
            "Nhìn cơ đùi của anh Bảy đi {enemy}, một cước này là rách luôn lưới khung thành đấy! 🦵💥",
            "Khi nhạc hiệu C1 vang lên cũng là lúc {enemy} biết mình không còn cơ hội sống sót! 🎶👑",
            "Tao không tìm kiếm kỷ lục, kỷ lục tự tìm đến tao sau khi dứt điểm {enemy}! 📈",
            "Đứng làm hàng rào chắn bóng à {enemy}? Coi chừng bay luôn hàm răng nhé! 🥅"
        ],
        winQuotes: [
            {
                c: "SIUUUUUUUUUUUU!!",
                s: "Cristiano Ronaldo bật nhảy xoay người ăn mừng thương hiệu ngay bên cạnh cái xác của {enemy}! 🐐🔥"
            },
            {
                c: "Kỷ lục bàn thắng thứ 999!",
                s: "{enemy} vừa trở thành nạn nhân tiếp theo trong danh sách ghi bàn vĩ đại nhất lịch sử của CR7! ⚽🏆"
            },
            {
                c: "Ông Vua Champions League!",
                s: "Bản lĩnh phút bù giờ của Ronaldo đã nghiền nát hoàn toàn tâm lý thi đấu của {enemy}! 👑"
            },
            {
                c: "Siêu phẩm Xe Đạp Chổng Ngược!",
                s: "Cả khán đài đứng dậy vỗ tay cho cú móc bóng trên không tiễn {enemy} lên thẳng cáng cứu thương! 🏟️"
            }
        ],
        loseQuotes: [
            {
                c: "Trọng tài chưa check VAR!",
                s: "Pha vừa rồi {enemy} việt vị rõ mười mươi mà trọng tài biên lại ngủ gật! 📺🚩"
            },
            {
                c: "Sân cỏ hôm nay trơn quá!",
                s: "Trượt chân trụ lúc đang lấy đà sút phạt thôi, lượt về trên sân nhà {enemy} biết tay anh Bảy! 👟"
            },
            {
                c: "Giữ chân cho trận Chung kết C1!",
                s: "Trận giao hữu vô thưởng vô phạt nên CR7 đá giữ sức cho {enemy} vui tí thôi! 🏆"
            },
            {
                c: "Vừa tập tạ 5 tiếng trước khi vào trận!",
                s: "Hơi căng cơ đùi sau buổi tập cường độ cao, hẹn {enemy} hiệp phụ phân thắng bại! 💪"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: XE ĐẠP CHỔNG NGƯỢC & SIUUUUU!
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 60;
        caster.vx = caster.isFacingRight ? -3 : 3;
        caster.vy = -14;
        caster.onGround = false;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "⚽ BICYCLE KICK!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(520, 'sine', 0.2, 0.45);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 120,
                text: "🐐 SIUUUUUUUUU!",
                color: "#e74c3c", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 70, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(18, 12);
            if (typeof window.playSound === 'function') window.playSound(180, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30),
                y: caster.y - 60,
                vx: caster.isFacingRight ? 28 : -28,
                vy: 10,
                r: 22,
                rot: 0,
                dmg: baseDmg * 4.2,
                isUlt: true,
                stun: 100,
                color: "#e74c3c",
                life: 80,
                caster: caster,
                target: target
            });

            if (typeof window.spawnCustomObj === 'function' && target) {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 12, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "⚽" : "🏆", "#f1c40f", "20px Arial", 45, true
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

        // 1. Áo đấu Bồ Đào Nha (Đỏ Bordeaux phối Xanh lá)
        ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#27ae60"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#ffddc1"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Quả bóng vàng đeo lấp lánh bên hông
        if (!isTrail) {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 10; ctx.shadowColor = "#f39c12";
            ctx.beginPath(); ctx.arc(pelvis.x - 8, pelvis.y, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        // 4. Giày đá bóng Nike Mercurial Trắng/Vàng
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 15; ctx.shadowColor = "#e74c3c";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["ronaldo"] = window.currentLoadedChar;
