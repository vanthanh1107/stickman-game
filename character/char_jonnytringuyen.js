// ==========================================
// CHAR_JONNYTRINGUYEN.JS - VÕ SƯ JOHNNY TRÍ NGUYỄN (LIÊN PHONG MMA)
// ==========================================

window.currentLoadedChar = {
    id: "jonny",
    className: "Johnny Trí Nguyễn",
    hp: 1050, speed: 7, dmgMod: 2.1, color: "#ff4757",
    avatarUrl: "https://i.ibb.co/qLNrvKRM/jonny.png",
    skill: {
        name: "LIÊN PHONG VÔ ẢNH CƯỚC",
        icon: "🐉",
        description: "Combo võ thuật Liên Phong: 3 đường chém liên hoàn kèm gối bay nội công. Sát thương x4.2, hất tung đối thủ.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'flying_knee'; caster.attackTimer = 24;
            caster.vx = caster.isFacingRight ? 10 : -10;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 75, text: "🥊 BẪY RỒNG SONG PHI!", color: "#ff4757", alpha: 1, vx: 0, vy: -1, font: "900 18px Arial", life: 42, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(14, 9);
                for (let k = 0; k < 14; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 60, target.y - 45, "#ff4757", true);
                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 42 * (caster.currentDmgMod || caster.dmgMod || 1), "#ff4757", true, false, caster.isFacingRight);
                    target.stunTimer = 55;
                }
            }, 200);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA VÕ SƯ JOHNNY TRÍ NGUYỄN
    // ==========================================
    trashTalk: {
        chapters: [
            "DÒNG MÁU ANH HÙNG: LIÊN PHONG VÔ ẢNH CƯỚC HẠ GỤC {enemy}! 🥊",
            "BẪY RỒNG THƯỢNG ĐÀI: DẠY {enemy} VÕ THUẬT THỰC CHIẾN 🐉",
            "BỤI ĐỜI CHỢ LỚN: MỘT MÌNH CÂN ĐẸP {enemy} 🔥",
            "LỒNG BÁT GIÁC MMA: KHÓA SIẾT {enemy} TRONG 3 GIÂY 💪"
        ],
        midMatch: [
            "Võ thuật trên phim chỉ là biểu diễn, hôm nay tao cho {enemy} nếm thử võ thực chiến Liên Phong! 🥊🔥",
            "Nhìn bộ tấn của {enemy} lỏng lẻo thế kia, một cú Low Kick của tao là sập nguồn ngay! 🦵💥",
            "Dòng Máu Anh Hùng đang sôi sục, chuẩn bị đỡ chuỗi liên hoàn cước không kịp thở nhé {enemy}! 🐉",
            "Đừng chớp mắt {enemy} ơi, đòn chỏ lật kết hợp gối bay này không có cascader đóng thế cho mày đâu! ⚡",
            "Bước vào lồng bát giác với tao thì chỉ có nằm cáng đi ra thôi {enemy} ạ! 🏆",
            "Găng tay MMA đỏ rực nội công đã lên nòng, {enemy} giơ tay xin hàng đi còn kịp! 🥊"
        ],
        winQuotes: [
            {
                c: "Knock-out kỹ thuật tuyệt đối!",
                s: "Võ sư Johnny Trí Nguyễn vừa tung chuỗi Liên Phong Vô Ảnh Cước khiến {enemy} đo sàn ngay hiệp 1! 🥊🐉"
            },
            {
                c: "Đẳng cấp Dòng Máu Anh Hùng!",
                s: "Không cần kỹ xảo điện ảnh, những đòn thế MMA thực chiến đã hạ gục hoàn toàn {enemy}! 🔥💪"
            },
            {
                c: "Bậc thầy võ đường Liên Phong!",
                s: "Johnny Trí Nguyễn cúi chào võ đạo lịch lãm sau khi dạy cho {enemy} một bài học võ học nhớ đời! 🙏"
            }
        ],
        loseQuotes: [
            {
                c: "Đang giữ sức chỉ đạo võ thuật phim mới!",
                s: "Hôm nay lên sàn thị phạm vài đường quyền cho {enemy} học hỏi thôi, chưa tung hết 10 thành công lực! 🎬"
            },
            {
                c: "Vừa chạy mô tô phân khối lớn xuyên Việt về!",
                s: "Phượt đường dài hơi mỏi cổ tay tí thôi, hẹn {enemy} tái đấu trên đài võ đường Liên Phong! 🏍️"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: LIÊN PHONG VÔ ẢNH CƯỚC (COMBO VÕ THUẬT RỰC LỬA)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'martial_arts_combo';
        caster.attackTimer = 42;
        caster.vx = caster.isFacingRight ? 8 : -8;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🐉 LIÊN PHONG VÔ ẢNH CƯỚC!",
            color: "#ff4757", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 19px Arial", life: 50, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(480, 'sawtooth', 0.25, 0.5);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(18, 12);
            if (typeof window.playSound === 'function') window.playSound(160, 'square', 0.5, 0.85, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#ff4757", true, 5.5, 0);
                window.spawnSlash(target.x, target.y - 15, !caster.isFacingRight, "#ffa502", true, 5.0, Math.PI / 6);
                window.spawnSlash(target.x, target.y - 50, caster.isFacingRight, "#ff4757", true, 6.0, -Math.PI / 4);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.2, "#ff4757", true, true, caster.isFacingRight);
            }
            target.vy = -10;
            target.onGround = false;
            target.stunTimer = 75;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🥊" : "🔥", "#ff4757", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 220);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. VẼ THÂN (Võ phục Liên Phong đen cơ bắp)
        ctx.strokeStyle = "#2d3436";
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // 2. VẼ CHÂN TAY
        ctx.strokeStyle = "#2d3436";
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);

        ctx.strokeStyle = "#e8b689";
        ctx.lineWidth = 4.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. VẼ ĐẦU NHÂN VẬT DÙNG CHUNG
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 4. GĂNG TAY MMA ĐỎ CÓ NỘI CÔNG
        ctx.fillStyle = "#ff4757";
        ctx.shadowBlur = isTrail ? 0 : 12;
        ctx.shadowColor = "#ff4757";
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 6.5, 0, Math.PI * 2); ctx.fill();

        // 5. VẼ BÀN CHÂN & HIỆU ỨNG CÚ ĐÁ
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#2d3436";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#ffa502";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ff4757";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["jonny"] = window.currentLoadedChar;
