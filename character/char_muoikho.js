// ==========================================
// CHAR_MUOIKHO.JS - TRƯỜNG GIANG (MƯỜI KHÓ & DÉP TỔ ONG HUYỀN THOẠI)
// ==========================================

window.currentLoadedChar = {
    id: "muoikho",
    className: "Muoi Kho",
    hp: 1100, speed: 7, dmgMod: 1.5, color: "#8B4513",
    avatarUrl: "https://i.ibb.co/1JqfvVqd/anh-muoi-kho.png",
    skill: {
        name: "BÃO DÉP TỔ ONG",
        icon: "🩴",
        description: "Ném bão dép tổ ong cùng hai vệt chém liên hoàn vào đối thủ, sát thương x3.8.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'muoi_kho_scold'; caster.attackTimer = 26; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🩴 VẢ DÉP TỔ ONG!", color: "#f5f6fa", alpha: 1, vx: 0, vy: -1, font: "900 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(12, 8);
                for (let k = 0; k < 14; k++) gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 60, target.y - 40, "#f5f6fa", true);
                gameContext.takeDamage(target, 36 * (caster.currentDmgMod || caster.dmgMod || 1), "#8B4513", true, false, caster.isFacingRight);
                target.stunTimer = 60;
            }, 220);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA MƯỜI KHÓ TRƯỜNG GIANG
    // ==========================================
    trashTalk: {
        chapters: [
            "MƯỜI KHÓ NỔI GIẬN: PHI DÉP TỔ ONG VỠ MỒM {enemy}! 🩴",
            "ĐẶC SẢN QUẢNG NAM: MỜI {enemy} ĂN MÌ QUẢNG KÈM COMBO 🍜",
            "CHẠY ĐI CHỜ CHI: XÉ BẢNG TÊN {enemy} TRONG 1 NỐT NHẠC 🏃",
            "BẾP TRƯỞNG MƯỜI KHÓ: ĐEM {enemy} LÊN THỚT BĂM NHỎ 🔪"
        ],
        midMatch: [
            "Trời đất quỷ thần ơi! Cỡ thằng {enemy} mà cũng đòi lên đây đôi co với già Mười Khó hả con! 🩴",
            "Nhìn chiếc dép tổ ong 100 lỗ huyền thoại trên tay tao đây này {enemy}, vả phát nào in dấu phát đó! 💥",
            "Đánh nhanh gọn lẹ cho tao còn về nấu cơm rửa bát cho Nhã Phương nữa {enemy} ơi! 🍚🧹",
            "Mày thích lươn lẹo không {enemy}? Về độ lươn trong Running Man thì mày phải gọi tao bằng cụ! 🏃",
            "Đứng im tao lấy dao phay bếp trưởng thái lát thanh máu của mày ra nấu Mì Quảng bây giờ {enemy}! 🍜🔪",
            "Thằng {enemy} này lì thiệt chớ, để ông Mười dạy cho mày biết lễ độ nghe con! 👺"
        ],
        winQuotes: [
            {
                c: "Uy lực Dép Tổ Ong huyền thoại!",
                s: "Mười Khó vừa dùng chiếc dép tổ ong vả in hằn 100 lỗ lên mặt {enemy} rồi xách giỏ đi chợ về nấu cơm! 🩴🍚"
            },
            {
                c: "Xé bảng tên gọn lẹ!",
                s: "Bằng kinh nghiệm lươn lẹo đỉnh cao, Trường Giang đã tiễn {enemy} vào nhà giam chỉ trong chớp mắt! 🏃"
            },
            {
                c: "Đặc sản Mì Quảng Mười Khó!",
                s: "{enemy} vừa được thưởng thức combo vừa đấm vừa mắng không kịp vuốt mặt từ ông Mười! 🍜"
            }
        ],
        loseQuotes: [
            {
                c: "Vợ gọi điện giục về đón con!",
                s: "Nhã Phương vừa nhá máy bắt về nhà ngay lập tức nên Mười Khó phải giả vờ thua để chuồn về đấy {enemy}! 📞🏃"
            },
            {
                c: "Đứt quai dép tổ ong giữa chừng!",
                s: "Vung tay mạnh quá làm đứt mất chiếc dép bảo bối thôi, đợi tao đi mua đôi dép mới là {enemy} chết với ông! 🩴"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: "BÃO DÉP TỔ ONG" & "THÁI THỊT LÀM BẾP"
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'muoi_kho_scold';
        caster.attackTimer = 50;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🩴 BÃO DÉP TỔ ONG!",
            color: "#f5f6fa", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 50, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(500, 'sine', 0.25, 0.5);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(16, 12);
            if (typeof window.playSound === 'function') window.playSound(170, 'square', 0.45, 0.8, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 35, caster.isFacingRight, "#f5f6fa", true, 5.0, Math.PI / 6);
                window.spawnSlash(target.x, target.y - 15, !caster.isFacingRight, "#bdc3c7", true, 4.5, -Math.PI / 6);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.8, "#8B4513", true, false, caster.isFacingRight);
            }

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🩴" : "🍜", "#f5f6fa", "20px Arial", 45, true
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

        // 1. VẼ THÂN (Mặc áo bà ba màu Nâu Đất mộc mạc)
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // 2. VẼ CHÂN TAY
        ctx.strokeStyle = "#A0522D";
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. VẼ ĐẦU NHÂN VẬT: TRƯỜNG GIANG MƯỜI KHÓ
        window.drawAvatarHead(ctx, head, p, isTrail, 38);

        // 4. VŨ KHÍ: CẦM DÉP TỔ ONG HUYỀN THOẠI TRÊN TAY PHẢI
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(Math.PI / 4);

        ctx.fillStyle = "#f5f6fa";
        ctx.strokeStyle = "#dcdde1";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.ellipse(5, -5, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#2f3640";
        for (let i = -2; i <= 2; i += 2) {
            for (let j = -2; j <= 2; j += 2) {
                ctx.beginPath();
                ctx.arc(5 + i * 2, -5 + j * 1.5, 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // 5. VẼ BÀN TAY / BÀN CHÂN
        ctx.shadowBlur = 0; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 3, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill();
        }
    }
};

// Đăng ký nhân vật vào hệ thống (đồng bộ với id: "muoikho")
if (!window.classStats) window.classStats = {};
window.classStats["muoikho"] = window.currentLoadedChar;
