// ==========================================
// CHAR_ELONMUSK.JS - ELON MUSK (TESLA CYBERTRUCK, SPACEX & X)
// ==========================================

window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1050, speed: 6, dmgMod: 1.5, color: "#e84118",
    avatarUrl: "https://i.ibb.co/jZkZy4sS/Generated-Image-July-05-2026-8-52-PM.jpg",
    skill: {
        name: "CYBERTRUCK RAM",
        icon: "🚗",
        description: "Gọi xe Tesla Cybertruck lao từ ngoài màn hình tông bay đối thủ, kèm bão tên lửa SpaceX. Sát thương x4.2, hất tung và choáng.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "✖️ MUA ĐỨT TWITTER (X)!", color: "#ffffff", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                for (let k = 0; k < 15; k++) {
                    gameContext.spawnParticles(target.x + (Math.random() - 0.5) * 80, target.y - 60, "#ffffff", true);
                }
                gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#ffffff", false, false, caster.isFacingRight);
                target.stunTimer = 60;
            }, 250);
        }
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA TỶ PHÚ ELON MUSK
    // ==========================================
    trashTalk: {
        chapters: [
            "CHUYẾN TÀU Đưa {enemy} LÊN SAO HỎA 🚀",
            "TỶ PHÚ CÔNG NGHỆ: CYBERTRUCK CÁN PHẲNG {enemy} 🚗",
            "THƯƠNG VỤ TỶ ĐÔ: MUA ĐỨT {enemy} RỒI SA THẢI ✖️",
            "KÈO CĂNG: ĐỐT LÒ PHẢN ỨNG SPACEX NƯỚNG CHÍN {enemy} 🔥",
            "DOGECOIN TO THE MOON: ĐẬP TIỀN ẢO VÀO MẶT {enemy} 🐕",
            "AI GROK DỰ ĐOÁN: {enemy} TỶ LỆ THẮNG 0.00% 🤖"
        ],
        midMatch: [
            "Chuẩn bị hành lý đi {enemy}, tao vừa đặt vé một chiều phóng mày lên Sao Hỏa đấy! 🚀",
            "Đứng im tao thử độ cứng kính xe Tesla Cybertruck lên mặt mày cái coi {enemy}! 🚗💥",
            "Mày thích gáy trên mạng không {enemy}? Tao mua luôn mạng xã hội rồi khóa mõm mày bây giờ! ✖️",
            "Tài khoản của {enemy} còn chưa đủ tiền mua tích xanh tháng này mà đòi đấm nhau với tao à! ☑️",
            "Để tao gắn chip Neuralink vào não {enemy} xem có thông minh lên được chút nào không! 🧠⚡",
            "Súng phun lửa The Boring Company này nướng {enemy} thơm phải biết! 🔥",
            "Nhìn {enemy} đánh chậm như xe chạy xăng đời cũ, gặp động cơ điện Tesla là hít khói! ⚡",
            "Một dòng Tweet của tao làm chao đảo cả sàn chứng khoán, còn một đấm này làm {enemy} nằm sàn! 📈",
            "Bay lên nóc nhà như Dogecoin luôn đi {enemy} ơi! To The Moon! 🐕🌕",
            "Robot Optimus của tao đánh võ còn mượt hơn cái bộ pháp mèo cào của {enemy}! 🤖"
        ],
        winQuotes: [
            {
                c: "Đã phóng thành công lên Sao Hỏa!",
                s: "Elon Musk vừa buộc {enemy} vào đầu tên lửa Falcon Heavy và bấm nút phóng thẳng ra khỏi Trái Đất! 🚀"
            },
            {
                c: "Cybertruck không một vết xước!",
                s: "Sau cú tông 850km/h, chiếc xe bọc thép của Elon Musk vẫn bóng loáng còn {enemy} thì dẹp lép! 🚗"
            },
            {
                c: "Thương vụ thâu tóm hoàn tất!",
                s: "Elon Musk vừa mua đứt sàn đấu và ra quyết định sa thải {enemy} ngay lập tức không đền bù! ✖️"
            },
            {
                c: "Dogecoin To The Moon!",
                s: "Cổ phiếu Tesla tăng trần sau pha xử lý hủy diệt {enemy} chỉ trong vài giây! 🐕📈"
            },
            {
                c: "Trí tuệ nhân tạo đã tính trước!",
                s: "Siêu máy tính AI của Elon Musk đã mô phỏng 1 triệu kịch bản và không có kịch bản nào {enemy} sống sót! 🤖"
            }
        ],
        loseQuotes: [
            {
                c: "Chế độ Tự lái Autopilot bị lỗi!",
                s: "Đang vừa đánh vừa cập nhật phần mềm tự lái FSD nên xe phanh gấp thôi. Đợi bản vá sau nhé {enemy}! 🚗"
            },
            {
                c: "Bận canh phóng tên lửa Starship!",
                s: "Đài chỉ huy SpaceX gọi báo đếm ngược nên Elon Musk phải nhường {enemy} để về bấm nút! 🚀"
            },
            {
                c: "Vừa thức trắng đêm code lại Twitter!",
                s: "Ngủ ở văn phòng 3 ngày liền hơi thiếu pin tí thôi, sạc đầy bình điện là {enemy} tới công chuyện! 🔋"
            },
            {
                c: "Cổ phiếu biến động bất ngờ!",
                s: "Mải nhìn biểu đồ Dogecoin có 1 giây mà {enemy} đã tranh thủ cắn trộm! 🐕📉"
            }
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: GỌI TESLA CYBERTRUCK TÔNG ĐỊCH
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'punch';
        caster.attackTimer = 60;
        caster.vx = 0;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🚗 TESLA CYBERTRUCK!",
            color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(380, 'sawtooth', 0.25, 0.5);

        // Xe xuất phát phía sau Elon, tốc độ tính sao cho mũi xe chạm đối thủ đúng lúc gây sát thương (480ms)
        let carDir = (target.x >= caster.x) ? 1 : -1;
        let carStartX = caster.x - carDir * 420;
        let frontToTarget = carDir * ((target.x - carDir * 15) - carStartX) - 106;
        let carSpeed = Math.max(650, frontToTarget / 0.46);
        caster.teslaCar = {
            active: true,
            startX: carStartX,
            y: window.GROUND_Y,
            vx: carDir * carSpeed,
            startTime: Date.now(),
            duration: 1350
        };

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.shakeScreen(22, 14);
            if (typeof window.playSound === 'function') window.playSound(140, 'square', 0.5, 0.85, true);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#00f3ff", true, 4.0, Math.PI / 6);
                window.spawnSlash(target.x, target.y - 35, !caster.isFacingRight, "#e84118", true, 3.8, -Math.PI / 6);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.2, "#bdc3c7", true, true, caster.isFacingRight);
            }

            target.vx = caster.isFacingRight ? 20 : -20;
            target.vy = -12;
            target.onGround = false;
            target.state = 'hurt';
            target.stunTimer = 80;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "🚀" : "🐕", "#00f3ff", "20px Arial", 45, true
                    );
                    if (k < 3) {
                        window.spawnCustomObj(
                            target.x + (Math.random() - 0.5) * 80, target.y - 65,
                            (Math.random() - 0.5) * 9, -Math.random() * 9,
                            "✖️ SPACEX", "#ffffff", "900 12px Arial", 35, false
                        );
                    }
                }
            }

            window.impactAberration = 6;
        }, 480);
    },

    // ==========================================
    // 🚗 VẼ XE TESLA CYBERTRUCK THEO TỌA ĐỘ THẾ GIỚI (được engine_rend gọi trước khi vẽ đấu sĩ)
    // ==========================================
    drawWorldFX: function(ctx, p, layer) {
        let car = p.teslaCar;
        if (layer !== 'back' || !car || !car.active) return;

        let elapsed = (Date.now() - car.startTime) / 1000;
        if (elapsed > car.duration / 1000) { car.active = false; return; }

        let dir = car.vx >= 0 ? 1 : -1;
        let x = car.startX + car.vx * elapsed;
        let gy = car.y;
        let fadeIn = Math.min(1, elapsed / 0.12);
        let fadeOut = Math.min(1, (car.duration / 1000 - elapsed) / 0.3);
        let alpha = Math.max(0, Math.min(fadeIn, fadeOut));
        let bob = Math.sin(elapsed * 55) * 1.2;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Bóng đổ dưới gầm xe
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath(); ctx.ellipse(x, gy + 2, 118, 9, 0, 0, Math.PI * 2); ctx.fill();

        // Vệt tốc độ & bụi phía sau xe
        ctx.lineCap = "round";
        for (let i = 0; i < 7; i++) {
            let ly = gy - 12 - i * 11;
            let len = 70 + ((i * 37 + Math.floor(elapsed * 40)) % 5) * 22;
            let sx = x - dir * 105;
            let g = ctx.createLinearGradient(sx, ly, sx - dir * len, ly);
            g.addColorStop(0, "rgba(0, 243, 255, 0.55)");
            g.addColorStop(1, "rgba(0, 243, 255, 0)");
            ctx.strokeStyle = g;
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(sx, ly); ctx.lineTo(sx - dir * len, ly); ctx.stroke();
        }
        for (let i = 0; i < 6; i++) {
            let off = ((elapsed * 5 + i * 0.37) % 1);
            ctx.fillStyle = `rgba(190, 195, 199, ${0.35 * (1 - off)})`;
            ctx.beginPath();
            ctx.arc(x - dir * (95 + off * 120), gy - 6 - off * 26, 8 + off * 16, 0, Math.PI * 2);
            ctx.fill();
        }

        // Đèn gầm neon
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        let under = ctx.createRadialGradient(x, gy - 3, 8, x, gy - 3, 125);
        under.addColorStop(0, "rgba(0, 243, 255, 0.45)");
        under.addColorStop(1, "rgba(0, 243, 255, 0)");
        ctx.fillStyle = under;
        ctx.beginPath(); ctx.ellipse(x, gy - 3, 125, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Thân xe (hệ tọa độ cục bộ: +x là hướng mũi xe)
        ctx.translate(x, gy + bob);
        ctx.scale(dir, 1);

        let body = ctx.createLinearGradient(0, -90, 0, -14);
        body.addColorStop(0, "#e5ebef");
        body.addColorStop(0.45, "#aab4bb");
        body.addColorStop(1, "#5d6870");
        ctx.fillStyle = body;
        ctx.strokeStyle = "#2f3a42";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(-108, -20);      // đuôi dưới
        ctx.lineTo(-108, -58);      // đuôi trên
        ctx.lineTo(-20, -86);       // nóc xe
        ctx.lineTo(98, -42);        // mũi xe (kính chắn gió dốc xuống)
        ctx.lineTo(106, -24);       // cản trước
        ctx.lineTo(100, -16);
        ctx.lineTo(-100, -16);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Kính xe
        ctx.fillStyle = "#1b2833";
        ctx.beginPath();
        ctx.moveTo(-14, -80);
        ctx.lineTo(70, -48);
        ctx.lineTo(-86, -52);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Đường gân thép không gỉ
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-104, -44); ctx.lineTo(96, -34); ctx.stroke();

        // Dải đèn pha LED trước + đèn hậu đỏ
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(86, -40, 18, 4);
        let beam = ctx.createLinearGradient(104, 0, 230, 0);
        beam.addColorStop(0, "rgba(255, 255, 220, 0.55)");
        beam.addColorStop(1, "rgba(255, 255, 220, 0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(104, -40); ctx.lineTo(240, -62); ctx.lineTo(240, -6); ctx.lineTo(104, -34);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#ff2d3f";
        ctx.fillRect(-110, -54, 5, 28);
        ctx.restore();

        // Logo chữ T + chữ CYBERTRUCK
        ctx.fillStyle = "#e84118";
        ctx.font = "900 11px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TESLA", -30, -26);

        // 2 bánh xe quay
        const drawWheel = (wx) => {
            ctx.save();
            ctx.translate(wx, -18);
            ctx.rotate(elapsed * 24 * dir);
            ctx.fillStyle = "#101214";
            ctx.beginPath(); ctx.arc(0, 0, 21, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#cfd6db";
            ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#5d6870";
            ctx.lineWidth = 2.5;
            for (let s = 0; s < 4; s++) {
                ctx.rotate(Math.PI / 4);
                ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.stroke();
            }
            ctx.fillStyle = "#2f3a42";
            ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        };
        drawWheel(-62);
        drawWheel(64);

        ctx.restore();
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. XE TESLA CYBERTRUCK ĐƯỢC VẼ Ở drawWorldFX (tọa độ thế giới) - KHÔNG vẽ trong drawMethod vì
        //    drawMethod chạy trong hệ tọa độ đã dịch/lật theo nhân vật nên xe sẽ bị lệch khỏi màn hình.

        // 2. VẼ NHÂN VẬT (CƠ THỂ)
        ctx.strokeStyle = "#1e272e"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#2f3640"; ctx.lineWidth = 4.5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. VẼ ĐẦU AVATAR DÙNG CHUNG
        window.drawAvatarHead(ctx, head, p, isTrail, 38);

        // 4. VŨ KHÍ: SÚNG PHUN LỬA THE BORING COMPANY
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(p.state === 'punch' ? 0 : 0.25);

        ctx.fillStyle = "#ecf0f1"; ctx.fillRect(-5, -6, 22, 8);
        ctx.fillStyle = "#111"; ctx.fillRect(-8, -2, 8, 10);
        ctx.fillStyle = "#e84118"; ctx.fillRect(17, -5, 6, 6);

        if (p.state === 'punch' && !isTrail) {
            ctx.fillStyle = Math.random() > 0.5 ? "#e84118" : "#fbc531";
            ctx.beginPath();
            ctx.arc(28 + Math.random() * 10, -2, Math.random() * 8 + 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 5. BÀN TAY & GIÀY
        ctx.fillStyle = "#ffddc1";
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') {
            ctx.fillStyle = "#e84118";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 6, 0, Math.PI * 2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
