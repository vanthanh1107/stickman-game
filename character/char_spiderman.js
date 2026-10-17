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
    avatarUrl: "https://i.ibb.co/rR4m20k7/images.jpg",
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

        setTimeout(() => {
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

        // Vẽ Đầu (Mặt nạ nhện màu đỏ)
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = "#e23636";
        ctx.fill();
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.0; ctx.stroke();

        // Vẽ Mắt Nhện (Trục X dương luôn là hướng nhìn về phía trước)
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(head.x - 1, head.y - 3);
        ctx.lineTo(head.x + 2, head.y - 6);
        ctx.lineTo(head.x + 2, head.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(head.x + 5, head.y - 3);
        ctx.lineTo(head.x + 9, head.y - 7);
        ctx.lineTo(head.x + 8, head.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

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
