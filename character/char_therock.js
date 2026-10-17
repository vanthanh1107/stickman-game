// ==========================================
// CHAR_THEROCK.JS - DWAYNE "THE ROCK" JOHNSON (VUA BỌ CẠP & VINE BOOM)
// ==========================================

window.theRockBoulders = window.theRockBoulders || [];

window.currentLoadedChar = {
    id: "therock",
    className: "The Rock",
    hp: 1300, speed: 5, dmgMod: 1.8, color: "#d35400",
    avatarUrl: "https://i.ibb.co/wZSw3b4m/therock.jpg",
    skill: {
        name: "EYEBROW MEME & BOULDER",
        icon: "🌋",
        description: "Nhướn mày rồi quăng tảng đá khổng lồ nghiền nát đối thủ, sát thương x4.5.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🤨 NHƯỚN MÀY (VINE BOOM)!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(18, 12);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 60, target.y - 50, "#f1c40f", true);

                if (Math.abs(caster.x - target.x) < 220) {
                    gameContext.takeDamage(target, 30 * (caster.currentDmgMod || caster.dmgMod || 1), "#f1c40f", false, false, caster.isFacingRight);
                    target.stunTimer = 90;
                    gameContext.floatingTexts.push({ x: target.x, y: target.y - 90, text: "🗿 ĐỨNG HÌNH!", color: "#95a5a6", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial", life: 40, noGravity: true });
                }
            }, 200);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA THE ROCK
    // ==========================================
    trashTalk: {
        chapters: [
            "NHƯỚN MÀY VINE BOOM: LÀM {enemy} ĐỨNG HÌNH TOÀN TẬP! 🤨🗿",
            "ĐÔ VẬT WWE THƯỢNG ĐÀI: ROCK BOTTOM ĐẬP NÁT {enemy} 💪",
            "CƠN THỊNH NỘ CỦA ĐÁ: THIÊN THẠCH RƠI TRÚNG ĐẦU {enemy} 🌋",
            "LUẬT HỢP ĐỒNG HOLLYWOOD: THE ROCK KHÔNG ĐƯỢC PHÉP THUA {enemy}! 🎬"
        ],
        midMatch: [
            "Mày có ngửi thấy mùi gì không {enemy}? Mùi The Rock đang nấu chín thanh máu của mày đấy! 🤨🍳",
            "Chỉ cần tao nhướn lông mày một phát kèm tiếng Vine Boom là {enemy} hóa đá tại chỗ! 🗿💥",
            "Trong hợp đồng đóng phim của tao có điều khoản: Không bao giờ được phép thua trước {enemy}! 📜🎬",
            "Nhìn bắp tay to hơn cái đầu của mày đây này {enemy}, đỡ nổi cú People's Elbow không? 💪",
            "Đấm xuống đất một cái là nguyên tảng đá tảng nghìn cân rơi thẳng vào mồm {enemy}! 🌋🪨",
            "Bình thường tao đóng vai anh hùng cứu thế giới, hôm nay tao đóng vai ác tiễn {enemy} lên đường! 😎",
            "It doesn't matter what your name is! Tao không quan tâm mày tên là {enemy} hay gì cả! 🎤"
        ],
        winQuotes: [
            {
                c: "Nhướn mày Vine Boom chấn động!",
                s: "The Rock vừa nhướn mày nhìn thẳng vào camera sau khi tảng đá khổng lồ đè bẹp {enemy}! 🤨🗿"
            },
            {
                c: "Điều khoản Hợp đồng Bất Bại!",
                s: "Đúng như kịch bản Hollywood, The Rock giành chiến thắng tuyệt đối còn {enemy} làm diễn viên quần chúng! 🎬💪"
            },
            {
                c: "The People's Champion!",
                s: "Nhà vô địch WWE đã cho {enemy} nếm mùi sàn đấu thực thụ bằng những cú đấm ngàn cân! 🏆🪨"
            }
        ],
        loseQuotes: [
            {
                c: "Đạo diễn hô CẮT! Cảnh này đóng thế!",
                s: "Người vừa nằm xuống là diễn viên đóng thế Stuntman thôi, chứ The Rock thật không bao giờ thua {enemy}! 🎬"
            },
            {
                c: "Đang tới giờ đi tập Gym lúc 4 giờ sáng!",
                s: "Lịch tập thể hình nghiêm ngặt quá nên The Rock tạm rời sàn đấu nhường {enemy} đấy! 🏋️‍♂️"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: TRIỆU HỒI THIÊN THẠCH KHỔNG LỒ (THE PEOPLE'S BOULDER)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'cast';
        caster.attackTimer = 60;
        caster.vx = 0;
        caster.iFrames = 60;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🌋 CƠN THỊNH NỘ CỦA ĐÁ!",
            color: "#e67e22", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(240, 'sawtooth', 0.3, 0.6);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            window.shakeScreen(15, 10);
            if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            target.stunTimer = 50;
            target.vx = 0;
        }, 200);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            let targetX = target ? target.x : (caster.x + (caster.isFacingRight ? 150 : -150));

            window.theRockBoulders.push({
                x: targetX,
                y: -80,
                vx: 0,
                vy: 15,
                size: 55,
                rot: 0,
                dmg: baseDmg * 4.5,
                type: 'falling',
                life: 100,
                caster: caster,
                target: target
            });

            if (typeof window.spawnCustomObj === 'function' && target) {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 75, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🗿" : "🤨", "#e67e22", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 6;
        }, 350);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Thân hình Đồ Sộ Siêu Cơ Bắp
        ctx.strokeStyle = "#1e272e"; ctx.lineWidth = 9.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#2f3640"; ctx.lineWidth = 6;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);

        ctx.strokeStyle = "#cd8453"; ctx.lineWidth = 5.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        if (!isTrail) {
            ctx.fillStyle = "#111111";
            ctx.beginPath(); ctx.arc(elbowR.x, elbowR.y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
        }

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 37);

        // 3. Vũ khí: Cầm 2 Cục Đá Tảng Bọc Tay (Rock Gauntlets)
        ctx.fillStyle = "#576574";
        ctx.strokeStyle = "#222f3e";
        ctx.lineWidth = 1.5;

        ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 4. Giày bốt quân đội Đen
        ctx.fillStyle = "#111111";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick' || p.state === 'punch') {
            ctx.fillStyle = "#e67e22";
            ctx.shadowBlur = 15; ctx.shadowColor = "#d35400";
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["therock"] = window.currentLoadedChar;
