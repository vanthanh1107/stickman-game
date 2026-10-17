// ==========================================
// CHAR_DONALDTRUMP.JS - DONALD TRUMP (YOU'RE FIRED! & BUILD THE WALL)
// ==========================================

window.currentLoadedChar = {
    id: "donaldtrump",
    className: "Donald Trump",
    hp: 1200, speed: 5, dmgMod: 1.8, color: "#e74c3c",
    avatarUrl: "https://i.ibb.co/zhGqyH13/donald-trump.png",
    skill: {
        name: "YOU'RE FIRED!",
        icon: "🦅",
        description: "Sa thải đối thủ: dội mưa đô la và gạch thuế quan 200% xuống đầu, sát thương x4.5.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🧱 ĐÁNH THUẾ 200%!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 17px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(12, 8);
                for (let k = 0; k < 14; k++) {
                    gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 75, target.y - 45, "#f1c40f", true);
                }
                gameContext.takeDamage(target, 38 * (caster.currentDmgMod || caster.dmgMod || 1), "#e74c3c", true, false, caster.isFacingRight);
                target.stunTimer = 55;
            }, 240);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA TỔNG THỐNG DONALD TRUMP
    // ==========================================
    trashTalk: {
        chapters: [
            "SẮC LỆNH TỔNG THỐNG: TRỤC XUẤT {enemy} KHỎI SÀN ĐẤU! 🦅",
            "XÂY TƯỜNG BIÊN GIỚI: NHỐT {enemy} NGOÀI VÒNG PHÁP LUẬT 🧱",
            "KÈO TỶ ĐÔ: ĐÁNH THUẾ 500% LÊN TOÀN BỘ MÁU CỦA {enemy} 💵",
            "YOU'RE FIRED: {enemy} CHÍNH THỨC BỊ SA THẢI! 🔥",
            "MAKE STICKMAN GREAT AGAIN: ĐÈ BẸP {enemy} 🇺🇸",
            "CÚ SWING GOLF LỊCH SỬ VẢ VỠ MỒM {enemy} ⛳"
        ],
        midMatch: [
            "Tin giả! Fake News! Không đời nào có chuyện {enemy} đánh thắng được tao! 📰🚫",
            "Tao sẽ xây một bức tường gạch thật lớn ngay trên mặt {enemy}, và {enemy} phải trả tiền cho nó! 🧱",
            "Không ai hiểu rõ về võ thuật hơn tao cả, {enemy} chỉ là tay mơ thôi! 🦅",
            "Kể từ giây phút này, mỗi cú đấm của {enemy} sẽ bị áp thuế nhập khẩu 200%! 💵",
            "YOU'RE FIRED! Mày bị sa thải khỏi cái sàn đấu này rồi {enemy} ơi! 🔥",
            "Nhìn gậy Golf mạ vàng của tao đây này {enemy}, chuẩn bị làm bóng cho tao vụt nhé! ⛳",
            "Cỡ {enemy} đến tòa tháp Trump Tower của tao còn không qua nổi cửa an ninh! 🏢",
            "Đây sẽ là pha комbo vĩ đại nhất lịch sử, chưa từng có ai làm được như tao đâu {enemy}! 🇺🇸",
            "Máu của {enemy} đang tụt thê thảm, một thảm họa thực sự! Sad! 📉",
            "Đội vệ sĩ Mật vụ Mỹ đâu, dọn dẹp cái bao cát {enemy} này khỏi đường đi của Tổng thống! 🕶️"
        ],
        winQuotes: [
            {
                c: "YOU'RE FIRED! Mày đã bị sa thải!",
                s: "Donald Trump vừa ký sắc lệnh tổng thống trục xuất {enemy} thẳng về nơi sản xuất! 🦅✍️"
            },
            {
                c: "Bức tường vĩ đại đã xây xong!",
                s: "Hàng tấn gạch và đô la Mỹ đã chôn vùi hoàn toàn mọi hy vọng lật kèo của {enemy}! 🧱💵"
            },
            {
                c: "Thương vụ đàm phán hoàn hảo (The Art of the Deal)!",
                s: "Kết quả đàm phán: Donald Trump lấy trọn chiến thắng, còn {enemy} nhận về một rổ gạch! 🤝"
            },
            {
                c: "Hole-in-One ngay giữa trán!",
                s: "Một cú vung gậy Golf chuẩn xác từ ngài Trump đã đưa {enemy} bay thẳng sang lỗ thứ 18! ⛳"
            },
            {
                c: "Make Arena Great Again!",
                s: "Sàn đấu đã vĩ đại trở lại sau khi {enemy} bị quét sạch khỏi màn hình! 🇺🇸👑"
            }
        ],
        loseQuotes: [
            {
                c: "Kết quả này là GIAN LẬN! (RIGGED)!",
                s: "Tôi yêu cầu kiểm phiếu và đếm lại thanh máu ngay lập tức! Không thể có chuyện {enemy} thắng được! 🗳️"
            },
            {
                c: "Fake News! Truyền thông cắt ghép video!",
                s: "Chắc chắn trọng tài đã thông đồng với {enemy}, chúng tôi sẽ kiện lên Tối cao Pháp viện! ⚖️"
            },
            {
                c: "Đang bận đi vận động tranh cử!",
                s: "Chuyên cơ Air Force One đang nổ máy đợi sẵn nên ngài Trump tạm tha cho {enemy} trận này! ✈️"
            },
            {
                c: "Hôm nay gió trên sân Golf hơi ngược!",
                s: "Do thời tiết làm lệch đường gậy Golf thôi, nhiệm kỳ sau {enemy} sẽ phải trả cả vốn lẫn lãi! ⛳"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: "YOU'RE FIRED!" & Xây tường
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'cast';
        caster.attackTimer = 40;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 90,
            text: "🦅 YOU'RE FIRED!",
            color: "#e74c3c", alpha: 1.5, vx: 0, vy: -1.5,
            font: "900 22px Arial", life: 50, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(300, 'sawtooth', 0.2, 0.5);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(15, 10);
            if (typeof window.playSound === 'function') window.playSound(150, 'square', 0.5, 0.8, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#c0392b", true, 4.0, Math.PI / 4);
                window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#f1c40f", true, 4.0, -Math.PI / 4);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.5, "#e74c3c", true, false, caster.isFacingRight);
            }

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 8; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 80, target.y - 50,
                        (Math.random() - 0.5) * 15, -Math.random() * 12 - 5,
                        "💵", "#2ecc71", "20px Arial", 50, true
                    );
                    if (k < 4) {
                        window.spawnCustomObj(
                            target.x + (Math.random() - 0.5) * 60, target.y - 70 + (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 10, -Math.random() * 15,
                            "🧱", "#e67e22", "22px Arial", 40, true
                        );
                    }
                }
            }

            window.impactAberration = 6;
        }, 300);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo Vest Xanh Navy (Dark Navy Suit)
        ctx.strokeStyle = "#192a56";
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // 2. Chân và tay khoác vest (Xanh Navy)
        ctx.strokeStyle = "#273c75";
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. Cà vạt đỏ cực dài đặc trưng (Red Tie)
        ctx.strokeStyle = "#c0392b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(neck.x, neck.y);
        ctx.lineTo(neck.x + (pelvis.x - neck.x) * 0.7, neck.y + (pelvis.y - neck.y) * 0.7);
        ctx.stroke();

        // 4. Vẽ Đầu (Avatar dùng chung)
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 5. Vẽ vũ khí (Gậy đánh Golf ở tay phải)
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(0.8);

        ctx.strokeStyle = "#bdc3c7";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -35); ctx.stroke();

        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(-6, -35, 12, 6);
        ctx.restore();

        ctx.fillStyle = "#ffddc1";
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') { ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["donaldtrump"] = window.currentLoadedChar;
