// ==========================================
// CHAR_MESSI.JS - LIONEL MESSI (EL PULGA - GOAT WORLD CUP)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "messi",
    className: "Lionel Messi",
    hp: 1000, speed: 7, dmgMod: 1.5, color: "#74b9ff",
    avatarUrl: "https://i.ibb.co/MyF8s9wR/messi.jpg",
    skill: {
        name: "WORLD CUP GOLDEN BALL",
        icon: "🐐",
        description: "Sút quả Bóng Vàng World Cup tốc độ cao xuyên thẳng vào đối thủ, sát thương x4.2.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🏆 EL PULGA!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 60, target.y - 50, "#f1c40f", true);

                if (Math.abs(caster.x - target.x) < 220) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#f1c40f", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                }
            }, 250);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA LIONEL MESSI (M10)
    // ==========================================
    trashTalk: {
        chapters: [
            "QUÉ MIRÁS BOBO: NHÌN CÁI GÌ ĐẤY HẢ {enemy}? 👀",
            "NHÀ VÔ ĐỊCH WORLD CUP 2022 THƯỢNG ĐÀI VS {enemy} 🏆",
            "8 QUẢ BÓNG VÀNG: OUT TRÌNH HOÀN TOÀN TRƯỚC {enemy} 🐐",
            "CÁI CHÂN TRÁI MA THUẬT XÂU KIM QUA HÁNG {enemy} 🇦🇷",
            "EL PULGA NỔI GIẬN: RÊ BÓNG QUA {enemy} NHƯ QUA CỌC GỖ ⚽",
            "CHUNG KẾT LUSAIL: KẾT LIỄU {enemy} TRÊN CHẤM 11M 🌟"
        ],
        midMatch: [
            "Qué mirás, bobo? Nhìn đi đâu đấy hả {enemy}, lượn về phòng thay đồ ngay! 👀🇦🇷",
            "8 Quả Bóng Vàng với 1 Cúp Vàng World Cup xếp kín tủ rồi, {enemy} nhìn có chói mắt không? 🏆✨",
            "Tao chỉ cần đi bộ vuốt râu trên sân rồi bất ngờ tăng tốc là {enemy} ngã sấp mặt! 🐐",
            "Đừng cố xoạc bóng {enemy} ơi, cái chân trái của tao dính keo 502 với trái bóng rồi! ⚽",
            "Một pha lắc hông Body Feint của tao đủ làm cột sống của {enemy} vặn xoắn 180 độ! 🌪️",
            "Cỡ {enemy} kèm tao thì chỉ có nước kéo áo từ giữa sân đến tận vạch vôi thôi! 👕",
            "Góc chữ A khung thành đã ngắm sẵn, quả đá phạt hàng rào này {enemy} đỡ bằng niềm tin! 🎯",
            "Tao đã phá đảo hoàn toàn thế giới bóng đá, giờ sang phá đảo nốt thanh máu của {enemy}! 👑",
            "Bình tĩnh nào {enemy}, mới chỉ là pha khởi động nhẹ ở Miami thôi mà đã thở dốc rồi à! 🌴",
            "Vệ sĩ riêng Yassine Chueko của tao còn chưa cần ra tay đâu nhé {enemy}! 🕶️"
        ],
        winQuotes: [
            {
                c: "Hoàn tất bộ sưu tập Danh Hiệu!",
                s: "Lionel Messi vừa nâng cao chiếc Cúp Vàng World Cup ngay trước ánh mắt tuyệt vọng của {enemy}! 🏆🇦🇷"
            },
            {
                c: "Qué mirás, bobo? Đi về đi ku!",
                s: "Sau khi rê bóng qua {enemy} 5 lần liên tiếp, Messi nhẹ nhàng bấm bóng kết liễu trận đấu! 🐐"
            },
            {
                c: "Quả Bóng Vàng thứ 9 gọi tên!",
                s: "Màn trình diễn điểm 10 tuyệt đối của El Pulga khiến {enemy} tâm phục khẩu phục! 🌟"
            },
            {
                c: "Out trình thiên tài bẩm sinh!",
                s: "Chỉ cần đi bộ 80% thời gian trận đấu, Messi vẫn dư sức tiễn {enemy} lên bảng đếm số! ⚽👑"
            }
        ],
        loseQuotes: [
            {
                c: "Đang mải đi bộ quan sát chiến thuật!",
                s: "Messi mới đang đi bộ đọc trận đấu ở hiệp 1 thôi, hiệp 2 bật chế độ GOAT là {enemy} tắt điện! 🐐"
            },
            {
                c: "Sút trúng xà ngang cột dọc 3 lần!",
                s: "Hôm nay khung thành hơi lệch vài milimet nên {enemy} mới thoát chết trong gang tấc! 🥅"
            },
            {
                c: "Vừa uống trà Yerba Mate thư giãn!",
                s: "Đang tận hưởng dưỡng già ở Inter Miami nên nhường {enemy} một ván làm kỷ niệm đấy! 🧉🌴"
            },
            {
                c: "Vệ sĩ chưa kịp chạy vào sân!",
                s: "Để anh vệ sĩ đặc nhiệm Mỹ của M10 vào sân thì {enemy} đã bị bế đi từ giây thứ nhất rồi! 💪"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: QUẢ BÓNG VÀNG & CÚP VÀNG THẾ GIỚI
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 50;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🐐 VÔ ĐỊCH WORLD CUP!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(540, 'sine', 0.2, 0.45);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.shakeScreen(18, 12);
            if (typeof window.playSound === 'function') window.playSound(190, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30),
                y: caster.y - 30,
                vx: caster.isFacingRight ? 30 : -30,
                vy: -2,
                r: 24,
                rot: 0,
                dmg: baseDmg * 4.2,
                isUlt: true,
                stun: 110,
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
                        k % 2 === 0 ? "🏆" : "🐐", "#f1c40f", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 250);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Argentina (Xanh da trời sọc Trắng)
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#111111"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#ffddc1"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Chiếc Cúp Vàng World Cup thu nhỏ bên hông
        if (!isTrail) {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 10; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.arc(pelvis.x - 8, pelvis.y - 4, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(pelvis.x - 10, pelvis.y, 4, 6);
            ctx.shadowBlur = 0;
        }

        // 4. Giày đá bóng Adidas Vàng Kim (Gold Boots)
        ctx.fillStyle = "#f1c40f";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#74b9ff";
            ctx.shadowBlur = 15; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["messi"] = window.currentLoadedChar;
