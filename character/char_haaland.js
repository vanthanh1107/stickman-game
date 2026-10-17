// ==========================================
// CHAR_HAALAND.JS - ERLING HAALAND (MA BƯ VIKING & CỖ MÁY GHI BÀN)
// ==========================================

window.currentLoadedChar = {
    id: "haaland",
    className: "Erling Haaland",
    hp: 1200, speed: 6, dmgMod: 1.7, color: "#74b9ff",
    avatarUrl: "https://i.ibb.co/hxX41j7C/halland.jpg",
    skill: {
        name: "ZEN MEDITATION & CYBORG BEAM",
        icon: "🤖",
        description: "Bật Cyborg Mode, quét 5 tia laser rồi nhảy lên giáng Búa Tạ Viking. Sát thương x4.5, hất văng và choáng lâu.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 30; caster.vx = 0;
            caster.hp = Math.min(caster.maxHp || 1200, caster.hp + 60);
            if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🧘‍♂️ THIỀN ĐỊNH (+60 HP)!", color: "#2ecc71", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(15, 10);
                for (let k = 0; k < 20; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 120, caster.y - 40, "#74b9ff", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#74b9ff", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vx = caster.isFacingRight ? 18 : -18;
                }
            }, 250);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA MA BƯ HAALAND
    // ==========================================
    trashTalk: {
        chapters: [
            "STAY HUMBLE EH: MA BƯ HAALAND DẠY {enemy} KHIÊM TỐN 🤖",
            "CỖ MÁY CYBORG BẮC ÂU NGHIỀN NÁT HÀNG THỦ {enemy} ⚡",
            "BÚA TẠ VIKING: MỘT CƯỚC ĐẠP BAY {enemy} KHỎI KHUNG THÀNH 🔨",
            "THIỀN ĐỊNH HỒI MÁU: {enemy} ĐÁNH ĐẾN SÁNG MAI CŨNG KHÔNG THẤM 🧘‍♂️"
        ],
        midMatch: [
            "Stay humble, eh! Biết điều thì khiêm tốn lại đi {enemy} trước khi tao nổi điên! 🤖🔥",
            "Tao chỉ cần chạm bóng 3 lần cả trận là đủ bỏ túi Hat-trick vào lưới {enemy} rồi! ⚽",
            "Nhìn thân hình hộ pháp Viking 1m95 này đi {enemy}, húc nhẹ một cái là mày văng khỏi sân! 💪",
            "Ngồi thiền định Zen hồi ngay 60 máu, {enemy} đánh mỏi tay chưa? 🧘‍♂️✨",
            "Hệ thống Cyborg đã khóa mục tiêu {enemy}, chuẩn bị nhận cú song phi trên không nhé! 🎯",
            "Bữa sáng của tao gồm tim bò, gan bò và thanh máu của {enemy} đấy! 🥩",
            "Đừng cố kèm tao trong vòng cấm {enemy} ơi, tao tì đè một phát là bay cả người lẫn bóng! 🥅💥"
        ],
        winQuotes: [
            {
                c: "Stay Humble, Eh!",
                s: "Erling Haaland vỗ vai dặn dò {enemy} lần sau nhớ khiêm tốn hơn rồi ngồi thiền ăn mừng! 🧘‍♂️🤖"
            },
            {
                c: "Cỗ máy ghi bàn hủy diệt!",
                s: "Chỉ cần đúng 1 pha chạm bóng cận thành, Ma Bư Haaland đã làm bốc hơi cây máu của {enemy}! ⚡⚽"
            },
            {
                c: "Sức mạnh Chiến binh Viking!",
                s: "Cú giậm nhảy sấm sét của Haaland khiến mặt sân nứt toác và {enemy} nằm bất động! 🔨"
            }
        ],
        loseQuotes: [
            {
                c: "Đói bụng quá chưa kịp ăn Bít tết!",
                s: "Cỗ máy Cyborg thiếu nhiên liệu thịt bò nướng nên tụt áp suất tí thôi nhé {enemy}! 🥩🔋"
            },
            {
                c: "Hôm nay De Bruyne không vào sân chuyền bóng!",
                s: "Thiếu chân chuyền kiến tạo nên Haaland đứng đợi bóng hơi lâu, hẹn {enemy} trận lượt về! ⚽"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: CỖ MÁY HỦY DIỆT & CÚ ĐẠP TRÊN KHÔNG (KARATE SKY KICK)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 65;
        caster.vx = caster.isFacingRight ? 12 : -12;
        caster.vy = -16;
        caster.onGround = false;
        caster.iFrames = 65;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🤖 KÍCH HOẠT: CYBORG MODE!",
            color: "#00cec9", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(450, 'sawtooth', 0.25, 0.5);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            for (let i = 1; i <= 5; i++) {
                let beamX = caster.x + (caster.isFacingRight ? 60 * i : -60 * i);
                if (typeof window.spawnSlash === 'function') {
                    window.spawnSlash(beamX, window.GROUND_Y - 40, caster.isFacingRight, "#00cec9", true, 5.0, 0);
                }
                if (typeof window.spawnParticles === 'function') {
                    for (let k = 0; k < 8; k++) window.spawnParticles(beamX, window.GROUND_Y - 30, "#74b9ff", true);
                }
            }
        }, 280);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            caster.vy = 20;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 120,
                text: "🔨 BÚA TẠ VIKING!",
                color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 65, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(25, 18);
            if (typeof window.playSound === 'function') window.playSound(140, 'square', 0.5, 0.85, true);
            if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.5, "#00cec9", true, true, caster.isFacingRight);
            }
            target.vy = -14;
            target.vx = caster.isFacingRight ? 22 : -22;
            target.onGround = false;
            target.stunTimer = 100;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 75, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🤖" : "⚡", "#00cec9", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 6;
        }, 600);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Manchester City (Xanh da trời nhạt - Sky Blue)
        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 8.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#ffddc1"; ctx.lineWidth = 5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 37);

        // 3. Giày đá bóng Nike Phantom (Màu Cam Đỏ rực lửa)
        ctx.fillStyle = "#ff7675";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#00cec9";
            ctx.shadowBlur = 15; ctx.shadowColor = "#74b9ff";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["haaland"] = window.currentLoadedChar;
