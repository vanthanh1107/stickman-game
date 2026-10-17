// ==========================================
// CHAR_MBAPPE.JS - KYLIAN MBAPPÉ (NINJA RÙA TỐC ĐỘ ÁNH SÁNG)
// ==========================================

window.currentLoadedChar = {
    id: "mbappe",
    className: "Kylian Mbappé",
    hp: 1000, speed: 9, dmgMod: 1.4, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/Nnyq35G2/mbappe.jpg",
    skill: {
        name: "SONIC TURTLE BLITZ",
        icon: "⚡",
        description: "Tốc độ ánh sáng: lướt chém 5 lần rồi Ninja Rùa kết liễu. Sát thương x4.2, hất tung đối thủ.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🙅‍♂️ KHOANH TAY!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 100, caster.y - 40, "#00cec9", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#00cec9", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vx = caster.isFacingRight ? 12 : -12;
                }
            }, 200);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA KYLIAN MBAPPÉ
    // ==========================================
    trashTalk: {
        chapters: [
            "TỐC ĐỘ ÁNH SÁNG: NINJA RÙA BỎ XA {enemy} HÀNG CÂY SỐ 🐢⚡",
            "CHỦ TỊCH MBAPPÉ LÊN SÀN: KHOANH TAY CƯỜI VÀO MẶT {enemy} 🙅‍♂️",
            "HAT-TRICK CHUNG KẾT: SÚT CHÁY LƯỚI {enemy} 🇫🇷",
            "ĐỘNG CƠ PHẢN LỰC: VƯỢT MẶT {enemy} TRONG 1 NHÁY MẮT 💨",
            "REAL MADRID GALÁCTICOS: BẢN HỢP ĐỒNG TỶ ĐÔ NGHIỀN NÁT {enemy} 👑"
        ],
        midMatch: [
            "Nhìn thấy khói giày của tao không {enemy}? Tốc độ 38km/h này radar còn không bắt kịp! ⚡🐢",
            "Đứng khoanh tay kẹp nách tạo dáng chụp ảnh trước khi {enemy} nằm sàn nào! 🙅‍♂️📸",
            "Cỡ {enemy} đua tốc độ với tao chỉ có nước gọi xe ôm đuổi theo thôi! 🛵💨",
            "Một cú đẩy bóng dài rồi bứt tốc của tao là hậu vệ {enemy} thở bằng bình oxy ngay! ⚽",
            "Ghi Hat-trick ở Chung kết World Cup tao còn làm được, huống chi là dọn dẹp {enemy}! 🏆🇫🇷",
            "Chào mừng {enemy} đến với sân Bernabéu, nơi Ninja Rùa làm chủ cuộc chơi! 👑",
            "Mắt {enemy} đảo liên tục mà vẫn không biết bóng đang ở chân trái hay chân phải của tao kìa! 👀",
            "Đừng chớp mắt nhé {enemy}, tao lướt qua 5 lần là cây máu của mày bốc hơi đấy! 🌪️"
        ],
        winQuotes: [
            {
                c: "Khoanh tay ăn mừng thương hiệu!",
                s: "Kylian Mbappé vừa trượt cỏ khoanh tay cười tươi rói trước sự bất lực của {enemy}! 🙅‍♂️🐢"
            },
            {
                c: "Vận tốc siêu thanh 38km/h!",
                s: "{enemy} thậm chí còn chưa kịp nhìn thấy bóng dáng Mbappé đã bị đánh bay khỏi sàn đấu! ⚡💨"
            },
            {
                c: "Hat-trick trong nháy mắt!",
                s: "Ba cú dứt điểm sấm sét liên tiếp từ ngôi sao tuyển Pháp đã đóng hòm {enemy}! 🇫🇷⚽"
            },
            {
                c: "Bản lĩnh siêu sao Hoàng Gia!",
                s: "Mbappé chứng minh vì sao anh là cơn ác mộng của mọi hàng phòng ngự lẫn {enemy}! 👑"
            }
        ],
        loseQuotes: [
            {
                c: "Lại bị thổi việt vị nửa mũi giày!",
                s: "Chạy nhanh quá nên xuất phát sớm hơn {enemy} có 0.01 giây, VAR bắt lỗi cay thật sự! 🚩📺"
            },
            {
                c: "Vừa đeo mặt nạ Ninja Rùa hơi vướng mắt!",
                s: "Chiếc mặt nạ bảo vệ mũi làm khuất tầm nhìn thôi, tháo mặt nạ ra là {enemy} tới số! 🎭🐢"
            },
            {
                c: "Đang giữ sức cho trận Siêu Kinh Điển!",
                s: "Lịch thi đấu dày đặc quá nên Mbappé chạy bộ khởi động nhường {enemy} một hiệp! ⚽"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: PHÂN THÂN SIÊU THANH (SONIC TURTLE BLITZ)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'dash';
        caster.attackTimer = 65;
        caster.iFrames = 65;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "⚡ TỐC ĐỘ ÁNH SÁNG!",
            color: "#00cec9", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(620, 'sine', 0.2, 0.45);

        let slashes = 0;
        let slashInterval = setInterval(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || slashes >= 5) {
                clearInterval(slashInterval);
                return;
            }
            slashes++;
            caster.vx = (slashes % 2 === 0 ? 1 : -1) * 45;
            if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(caster.x, caster.y - 30, slashes % 2 === 0, "#00cec9", true, 5.0, Math.random() * 40 - 20);
            }
        }, 110);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            caster.vx = 0;
            caster.state = 'cast';

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 110,
                text: "🐢 NINJA RÙA KẾT LIỄU!",
                color: "#0984e3", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 22px Impact", life: 65, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(22, 16);
            if (typeof window.playSound === 'function') window.playSound(180, 'square', 0.45, 0.8, true);

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.2, "#00cec9", true, true, caster.isFacingRight);
            }
            target.vy = -14;
            target.onGround = false;
            target.stunTimer = 90;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🐢" : "⚡", "#00cec9", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 620);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Đội tuyển Pháp / Real Madrid
        ctx.strokeStyle = "#192a56"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#e84118"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#8d5524"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Đôi giày Tốc độ phát sáng Tia chớp Xanh
        ctx.fillStyle = "#00cec9";
        ctx.shadowBlur = isTrail ? 0 : 10; ctx.shadowColor = "#00cec9";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        if (p.state === 'kick' || p.state === 'dash') {
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 15; ctx.shadowColor = "#0984e3";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["mbappe"] = window.currentLoadedChar;
