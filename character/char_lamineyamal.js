// ==========================================
// CHAR_LAMINEYAMAL.JS - LAMINE YAMAL (THẦN ĐỒNG 304 ROCAFONDA)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "lamineyamal",
    className: "Lamine Yamal",
    hp: 950, speed: 8, dmgMod: 1.5, color: "#e84118",
    avatarUrl: "https://i.ibb.co/svxB5b7B/yamal.jpg",
    skill: {
        name: "304 ROCAFONDA & TRIVELA",
        icon: "🌟",
        description: "Sút hai siêu phẩm cong Rocafonda liên tiếp (x2.2 và x2.3), mỗi quả đều gây choáng.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🤟 304 ROCAFONDA!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 90, caster.y - 40, "#f1c40f", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#f1c40f", false, false, caster.isFacingRight);
                    target.stunTimer = 65;
                    target.vx = caster.isFacingRight ? 12 : -12;
                }
            }, 200);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA THẦN ĐỒNG LAMINE YAMAL
    // ==========================================
    trashTalk: {
        chapters: [
            "THẦN ĐỒNG 17 TUỔI: CỨA LÒNG EURO TIỄN {enemy} VỀ NƯỚC 🌈⚽",
            "304 ROCAFONDA: CHÀO ĐÓN {enemy} ĐẾN VỚI LA MASIA 🤟",
            "ĐƯỢC MESSI TẮM CHO TỪ NHỎ: OUT TRÌNH {enemy} 🐐✨",
            "GOLDEN BOY THƯỢNG ĐÀI: MÚA KỸ THUẬT TRƯỚC {enemy} 🌟"
        ],
        midMatch: [
            "Năm 17 tuổi tao đã vô địch Euro rồi, còn {enemy} tầm này vẫn đang lo giữ thanh máu à? 🏆🇪🇸",
            "Hồi bé được chú Messi tắm rửa ban phước rồi nên chân trái của tao uy tín lắm {enemy} ơi! 🐐🛁",
            "Nhìn tao giơ ký hiệu tay 3-0-4 Rocafonda trước khi sút cháy lưới mày nhé {enemy}! 🤟🔥",
            "Đá xong trận này với {enemy} tao còn phải về phòng làm nốt bài tập Toán lớp 11 nữa! 📚✏️",
            "Một cú vẩy má ngoài Trivela của tao đủ làm hàng thủ {enemy} đứng nhìn bóng bay vào góc chết! 🌈⚽",
            "Cỡ {enemy} kèm cánh phải của tao thì chỉ có nước xin thay người sớm vì chuột rút! 🏃💨"
        ],
        winQuotes: [
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
                c: "Đến giờ giới nghiêm của cầu thủ trẻ!",
                s: "Luật lao động không cho trẻ 17 tuổi thức khuya tăng ca nên Yamal phải nghỉ sớm nhường {enemy}! ⏰"
            },
            {
                c: "Thầy giáo gọi điện kiểm tra bài cũ!",
                s: "Đang đá dở thì nhớ ra mai có bài kiểm tra Hóa học nên tạm tha cho {enemy} đấy! 📖"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: SIÊU PHẨM CỨA LÒNG EURO 2024 (GOLDEN BOY CURVE SHOT)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 55;
        caster.vx = caster.isFacingRight ? -4 : 4;
        caster.vy = -8;
        caster.onGround = false;
        caster.iFrames = 55;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🌟 THẦN ĐỒNG 17 TUỔI!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(560, 'sine', 0.2, 0.45);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 125,
                text: "🌈 SIÊU PHẨM EURO 2024!",
                color: "#e84118", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 65, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(18, 12);
            if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 25 : -25),
                y: caster.y - 45,
                vx: caster.isFacingRight ? 28 : -28,
                vy: -4,
                r: 20,
                rot: 0,
                dmg: baseDmg * 2.2,
                isUlt: true,
                stun: 60,
                color: "#e84118",
                life: 80,
                caster: caster,
                target: target
            });

            setTimeout(() => {
                if (window.gameOver || !caster || caster.hp <= 0) return;
                window.cr7Balls.push({
                    x: caster.x + (caster.isFacingRight ? 30 : -30),
                    y: caster.y - 30,
                    vx: caster.isFacingRight ? 32 : -32,
                    vy: 4,
                    r: 22,
                    rot: 0,
                    dmg: baseDmg * 2.3,
                    isUlt: true,
                    stun: 95,
                    color: "#f1c40f",
                    life: 80,
                    caster: caster,
                    target: target
                });

                if (typeof window.spawnCustomObj === 'function' && target) {
                    for (let k = 0; k < 6; k++) {
                        window.spawnCustomObj(
                            target.x + (Math.random() - 0.5) * 70, target.y - 45,
                            (Math.random() - 0.5) * 12, -Math.random() * 14 - 5,
                            k % 2 === 0 ? "🌟" : "🌈", "#f1c40f", "20px Arial", 45, true
                        );
                    }
                }
                window.impactAberration = 5;
            }, 150);
        }, 250);
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
