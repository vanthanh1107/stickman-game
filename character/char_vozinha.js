// ==========================================
// CHAR_VOZINHA.JS - CRISTIANO RONALDO JR (TIỂU CR7 - HỔ PHỤ SINH HỔ TỬ)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "vozinha",
    className: "Cristiano Jr",
    hp: 950, speed: 8, dmgMod: 1.5, color: "#f1c40f",
    avatarUrl: "https://i.ibb.co/ch4y1F97/conronaldo.jpg",
    skill: {
        name: "GENETIC SIUUUU",
        icon: "🐐",
        description: "Hai cha con cùng tung cước: hai quả bóng liên tiếp (x2.0 và x2.5), mỗi quả đều gây choáng.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0; caster.vy = -8;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🧬 GENETIC SIUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 12; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 80, window.GROUND_Y, "#3498db", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#3498db", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vy = -6;
                    target.onGround = false;
                }
            }, 250);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CRISTIANO JR (TIỂU CR7)
    // ==========================================
    trashTalk: {
        chapters: [
            "HỔ PHỤ SINH HỔ TỬ: TIỂU CR7 DẠY DỖ {enemy} 👦🐐",
            "GEN DI TRUYỀN HUYỀN THOẠI: SÚT BAY MÀU {enemy} 🧬⚽",
            "CHA TRUYỀN CON NỐI: DOUBLE SIUUUU VÀO MẶT {enemy} 🔥",
            "THÁI TỬ AL-NASSR THƯỢNG ĐÀI THỬ SỨC VỚI {enemy} 👑"
        ],
        midMatch: [
            "Đừng thấy tao nhỏ tuổi mà nhờn nhé {enemy}, bố tao dạy tao sút rách lưới từ năm lên 5 rồi! 👦⚽",
            "Đánh thắng tao đã khó, coi chừng bố CR7 của tao đang đứng khoanh tay nhìn ở ngoài đường biên kìa {enemy}! 🐐👀",
            "Thừa hưởng 100% bộ gen GOAT, cú đá phạt này của tao chuẩn từng milimet vào trán {enemy}! 🧬🔥",
            "Ở giải trẻ Al-Nassr một trận tao ghi 5 bàn, gặp {enemy} chỉ cần nửa hiệp là xong! 💛💙",
            "Chuẩn bị xem hai cha con tao song kiếm hợp bích Double SIUUUU tiễn mày nhé {enemy}! ⚡",
            "Tốc độ và kỹ thuật của tao làm các đàn anh còn phải ngước nhìn đấy {enemy} ơi! 🏃💨"
        ],
        winQuotes: [
            {
                c: "Hổ phụ sinh hổ tử!",
                s: "Cristiano Jr vừa tái hiện hoàn hảo cú nhảy SIUUUU của người cha huyền thoại trước mặt {enemy}! 👦🐐"
            },
            {
                c: "Bộ gen GOAT không lẫn vào đâu được!",
                s: "Tài năng không đợi tuổi! Tiểu CR7 dễ dàng hạ đẹp {enemy} mà không tốn một giọt mồ hôi! 🧬⚽"
            },
            {
                c: "Bố Ronaldo gật đầu tự hào!",
                s: "Từ trên khán đài VIP, CR7 nở nụ cười mãn nguyện khi thấy con trai dứt điểm gọn gàng {enemy}! 👑"
            }
        ],
        loseQuotes: [
            {
                c: "Đợi đấy tao về mách bố CR7!",
                s: "{enemy} dám ăn hiếp trẻ vị thành niên à? Đợi bố tao xỏ giày vào sân là mày tới số! 🐐💢"
            },
            {
                c: "Đang đến giờ về làm bài tập về nhà!",
                s: "Bố bắt về ăn ức gà tập gym đúng giờ nên nhường {enemy} trận này đấy nhé! 📚💪"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: TRIỆU HỒI HUYỀN THOẠI (FATHER & SON DOUBLE SIUUUU!)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 60;
        caster.vx = 0;
        caster.vy = -10;
        caster.onGround = false;
        caster.iFrames = 60;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🐐x👦 HAI CHA CON TUNG CƯỚC!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 18px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(550, 'sine', 0.2, 0.45);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 25 : -25),
                y: caster.y - 30,
                vx: caster.isFacingRight ? 26 : -26,
                vy: 2,
                r: 18,
                rot: 0,
                dmg: baseDmg * 2.0,
                isUlt: true,
                stun: 60,
                color: "#3498db",
                life: 80,
                caster: caster,
                target: target
            });
        }, 220);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 125,
                text: "⚡ DOUBLE SIUUUUUU!",
                color: "#e74c3c", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 70, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(20, 14);
            if (typeof window.playSound === 'function') window.playSound(190, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 35 : -35),
                y: caster.y - 50,
                vx: caster.isFacingRight ? 32 : -32,
                vy: 6,
                r: 24,
                rot: 0,
                dmg: baseDmg * 2.5,
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
                        k % 2 === 0 ? "⚽" : "🔥", "#f1c40f", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 420);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Học viện Al-Nassr (Vàng tươi phối tay Xanh Navy)
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#2980b9"; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#e0ac69"; ctx.lineWidth = 3.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 35);

        // 3. Giày đá bóng Nike Trắng/Xanh
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#3498db";
            ctx.shadowBlur = 15; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["vozinha"] = window.currentLoadedChar;
