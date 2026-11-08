// =========================================================================
// CHARACTER: ĐỘ MIXI - TỘC TRƯỞNG BỘ TỘC MIXIGAMING (LƯƠN CAO BẰNG)
// =========================================================================

window.currentLoadedChar = {
    id: "domixi",
    className: "Độ Mixi",
    hp: 1180,
    speed: 6,
    dmgMod: 1.65,
    color: "#00f3ff",
    avatarUrl: "character/picture/domixi.png",
    voiceUrl: "character/voice/domixi.wav",

    // Kỹ năng riêng (hệ thống Action Code sẽ tự động đọc và kích hoạt)
    skill: {
        name: "LƯƠNG 7 TRIỆU & BÃO KHÔ GÀ",
        icon: "🎙️",
        description: "Bật mic gắt chửi thề cực mạnh, ném Khô Gà MixiFood và triệu hồi hàng vạn anh em Bộ Tộc spam donate đè bẹp đối thủ!",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast';
            caster.attackTimer = 25;
            caster.vx = 0;
            gameContext.floatingTexts.push({
                x: caster.x, y: caster.y - 70,
                text: "🎙️ LƯƠNG 7-8 TRIỆU THÔI!",
                color: "#00f3ff", alpha: 1, vx: 0, vy: -1,
                font: "bold 18px Arial", life: 45, noGravity: true
            });

            (window.scheduleCombatTimer || setTimeout)(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 15; k++) {
                    gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 120, caster.y - 40, "#00f3ff", true);
                }
                if (typeof window.spawnCustomObj === 'function') {
                    window.spawnCustomObj(target.x, target.y - 50, (Math.random() - 0.5) * 8, -8, "🐔", "#ffd700", "22px Arial", 40, true);
                }
                if (Math.abs(caster.x - target.x) < 185) {
                    gameContext.takeDamage(target, 38 * (caster.currentDmgMod || caster.dmgMod || 1), "#00f3ff", false, false, caster.isFacingRight);
                    target.stunTimer = 70;
                    target.vx = caster.isFacingRight ? 15 : -15;
                }
            }, 200);
        }
    },

    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU
    // ==========================================
    quest: {
        title: "Quỹ Đen Trong Vỏ Case & Bịch Khô Gà",
        quote: "Lương tháng 7-8 triệu bạc thôi anh em ạ, đánh nhanh thắng gọn còn về rửa bát bế con cho bà chủ kênh!",
        specialLoot: "Micro Streamer RGB & Khô Gà MixiFood 🐔",
        statBonusDesc: "+18% Tốc độ lươn lẹo & Sát thương sóng âm Độ Tộc"
    },

    battleCries: {
        intro: [
            "🎙️ Hê lô anh em! Tộc Trưởng đã lên sóng!",
            "🐔 Lương tháng 7-8 triệu mà {enemy} đòi gáy à?!",
            "⚡ Bộ Tộc MixiGaming đâu, nổi nhạc Độ Tộc 2 lên!"
        ],
        finisher: [
            "🐔 ĂN NGUYÊN RỔ KHÔ GÀ MIXIFOOD NHÉ CON!",
            "🎙️ HỢP LÝ LUÔN! TẮT MÁY SỦI STREAM ĐI NGỦ!",
            "💸 LƯƠNG 8 TRIỆU LÀM VIỆC THẾ THÔI NHÉ {enemy}!"
        ],
        parry: [
            "🐍 Lươn Cao Bằng né đòn trơn tuột luôn bạn ơi!",
            "📺 Check VAR! Pha đấy né chuẩn từng mi-li-mét!"
        ],
        ult: [
            "🎙️ ĐỘ TỘC 2: BỘ TỘC MIXIGAMING ĐẠI NÁO!",
            "🐔 BÃO DONATE & KHÔ GÀ ĐÈ BẸP {enemy}!"
        ]
    },

    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA TỘC TRƯỞNG ĐỘ MIXI
    // ==========================================
    trashTalk: {
        chapters: [
            "LƯƠN CAO BẰNG XUẤT CHIÊU: VẢ SẤP MẶT {enemy}! 🎙️",
            "LƯƠNG 7-8 TRIỆU: DỌN GỌN {enemy} CÒN VỀ RỬA BÁT! 💸",
            "ĐỘ TỘC 2 NỔI NHẠC: OUT TRÌNH {enemy} TRÊN SÓNG LIVE! 🔥",
            "BÃO KHÔ GÀ MIXIFOOD: {enemy} TẮT ĐIỆN TOÀN TẬP! 🐔",
            "ĐẠI NỘI SỦI STREAM: HẠ GỤC {enemy} TRONG 1 NỐT NHẠC! ⚡"
        ],
        midMatch: [
            "Mày đánh đấm kiểu Ao Làng thế này thì bao giờ mới lên hạng hả {enemy}?! 🎮",
            "Đỡ thế nào được con Lươn Cao Bằng trơn tuột này hả {enemy} ơi?! 🐍",
            "Ăn miếng Khô Gà MixiFood cho tỉnh táo lại đi {enemy}, nhìn mày ngơ ngác lắm rồi! 🐔",
            "Đánh lẹ lên {enemy} ơi, còn về nộp quỹ đen cho bà chủ kênh không tối ngủ sofa! 💸",
            "Check VAR! Pha đấy tao né chuẩn từng mi-li-mét, {enemy} tuổi gì đòi chạm vào áo ba lỗ của anh! 📺",
            "Anh em Bộ Tộc đâu, cap màn hình pha xử lý cồng kềnh đi vào lòng đất của {enemy} lại cho tôi! 😂",
            "Bà chủ kênh phát có 50 nghìn ăn sáng đang cay đây, {enemy} đứng im làm bao cát coi nào! 🥊",
            "Nhạc Độ Tộc 2 bật căng đét lên anh em ơi! Tiễn {enemy} về nơi chín suối rồi sủi stream! 🎙️"
        ],
        winQuotes: [
            {
                c: "Hợp lý! Quá hợp lý luôn anh em ơi!",
                s: "Tộc Trưởng Độ Mixi vừa dạy cho {enemy} một bài học nhớ đời trên sóng livestream trăm nghìn mắt xem! 🎙️🔥"
            },
            {
                c: "Lương 7-8 triệu làm việc thế thôi nhé!",
                s: "Dọn gọn {enemy} trong một nốt nhạc, giờ Tộc Trưởng tắt máy sủi stream về rửa bát cho bà chủ kênh đây! 💸😂"
            },
            {
                c: "Gáy sớm ăn gì? Ăn Khô Gà MixiFood!",
                s: "{enemy} đòi va chạm với Lươn Cao Bằng và cái kết nằm thở oxy giữa phòng stream! 🐔⚡"
            }
        ],
        loseQuotes: [
            {
                c: "Ơ kìa! Tại mạng lag với bàn phím kẹt nút thôi!",
                s: "Pha đấy Tộc Trưởng đang mải đọc kênh chat nên nhường {enemy} một hiệp thôi nhé, làm lại ván nữa coi! 🎮😤"
            },
            {
                c: "Bà chủ kênh gọi về bế con gấp!",
                s: "Vợ gọi rát quá nên Độ Mixi giả vờ nằm sàn để sủi stream sớm thôi, {enemy} ăn may đấy! 📞🏃‍♂️"
            },
            {
                c: "Toang sạch quỹ đen giấu trong vỏ case!",
                s: "Chưa ăn sáng 50 nghìn nên hơi tụt huyết áp tí thôi, hẹn {enemy} tối mai lên sóng phục thù! 💸🔥"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN CỐT TRUYỆN 5 HỒI (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        // Hồi 1: Mở đầu (Khi Độ Mixi là người mở lời trước)
        opening: [
            "Hê lô {enemy}! Đang bật stream chém gió với anh em Bộ Tộc thì mày nhảy vào đòi solo à? Nổ cái địa chỉ luôn đi! 🎙️🔥",
            "{enemy} à! Lương anh tháng có 7-8 triệu bạc thôi, đánh nhẹ tay còn giữ sức tối về nộp thuế cho bà chủ kênh! 💸😂",
            "Ủa {enemy} đấy hả? Lên sóng MixiGaming thì ngoan ngoãn donate đi, chứ đòi va chạm với Lươn Cao Bằng là dở rồi! 🐍⚡",
            "Chào bạn {enemy} nhé! Tối nay sủi stream 15 phút ra giải quyết nhanh gọn thanh niên gáy to nhất cái Ao Làng này! 🎮🐔"
        ],
        // Hồi 1: Đáp trả (Khi đối thủ mở lời trước)
        replyOpening: [
            "Mày bớt văn vở đi {enemy} ơi! Nghe giọng là biết fan cứng xem chùa chưa donate đồng nào rồi! 💸🤣",
            "Á à {enemy} gáy to phết nhở! Anh em Bộ Tộc đâu, chuẩn bị cap màn hình pha gáy sớm của thanh niên này lại cho tôi! 📸😈",
            "Bình tĩnh bạn {enemy} ơi! Mới đầu game đã căng thế, làm miếng Khô Gà MixiFood hạ hỏa rồi vào việc! 🐔🔥",
            "Hợp lý! Nghe {enemy} nổ mà Tộc Trưởng cười muốn nội thương, để tao xem mày trụ được mấy giây trên sóng! 🎙️😎"
        ],
        // Hồi 2: Giữa trận (HP < 75%)
        midFight: [
            "Ơ kìa {enemy}, đánh đấm kiểu Ao Làng thế à? Pha đấy tại tao trượt tay bấm nhầm nút thôi nhé! 🎮😂",
            "Căng phết nhờ! {enemy} hôm nay có vẻ thuộc bài đấy, nhưng gặp Lươn Cao Bằng lạng lách thì tắt điện! 🐍⚡",
            "Mày đánh rách mất cái áo ba lỗ huyền thoại của tao rồi {enemy} ơi! Quả này bà chủ kênh trừ hết tiền ăn sáng của tao! 👕😭",
            "Trọng tài đâu Check VAR pha vừa rồi cái! Rõ ràng {enemy} đánh phạm quy lúc tao đang đọc kênh chat nhé! 📺💢"
        ],
        // Hồi 3: Cao trào (HP < 40%)
        climax: [
            "Mày làm tao cáu thật sự rồi đấy {enemy}! Động vào quỹ đen giấu trong thùng máy của Tộc Trưởng là xác định! 💸🔥",
            "Anh em Bộ Tộc MixiGaming đâu?! Bật nhạc Độ Tộc 2 max âm lượng lên! Tầm này khô máu với {enemy} luôn! 🎙️⚡",
            "Hết lươn lẹo nhé {enemy}! Bật chế độ Tộc Trưởng gắt, ném sập phòng stream cho mày biết tay! 💥😈",
            "Định mệnh {enemy}! Bà chủ kênh cho có 50 nghìn ăn sáng mà mày còn ép tao tung hết bài tẩy à?! 🐔👑"
        ],
        // Hồi 4: Kết liễu (Khi tung đòn kết thúc hoặc hạ gục đối thủ)
        finisher: [
            "Hợp lý luôn {enemy} ơi! Tắt máy đi ngủ, hẹn anh em tối mai... à mà mai sủi stream nhé! 🎙️😴",
            "Gáy sớm ăn gì hả {enemy}? Ăn trọn combo Lương 8 Triệu và Bão Khô Gà của Tộc Trưởng nhé! 🐔💥",
            "Xong việc! Dọn gọn {enemy} trong một nốt nhạc, giờ chuồn lẹ về rửa bát cho vợ không tối ra gầm cầu! 🩴🏃‍♂️",
            "Tạm biệt {enemy} nhé! Nhớ vào kênh bấm theo dõi và mua Khô Gà MixiFood ủng hộ Tộc Trưởng nha con gà! ❤️🐔"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: ĐỘ TỘC 2 - TRIỆU HỒI BỘ TỘC MIXIGAMING & BÃO KHÔ GÀ
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'cast';
        caster.attackTimer = 65;
        caster.vx = 0;
        caster.iFrames = 65;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🎙️ ĐỘ TỘC 2: BỘ TỘC MIXIGAMING!",
            color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 60, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(520, 'sawtooth', 0.22, 0.45);

        let waves = 0;
        let stepMixi = (id) => {
            if (window.gameOver || !caster || caster.hp <= 0 || waves >= 6) {
                if (id && typeof window.cancelCombatTimer === 'function') window.cancelCombatTimer(id);
                return;
            }
            waves++;
            let randX = caster.x + (caster.isFacingRight ? 1 : -1) * (Math.random() * 230 + 30);
            let fxColor = (waves % 2 === 0) ? "#00f3ff" : "#ff0055";

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(randX, window.GROUND_Y - 120, true, fxColor, true, 5.0, 90);
            }
            if (typeof window.spawnParticles === 'function') {
                for (let k = 0; k < 6; k++) window.spawnParticles(randX, window.GROUND_Y - 25, "#ffd700", true);
            }
            if (typeof window.spawnCustomObj === 'function') {
                let gag = ["🐔", "🎙️", "💸", "🎮", "🩴", "🔥"][(waves - 1) % 6];
                window.spawnCustomObj(
                    randX, window.GROUND_Y - 110,
                    (Math.random() - 0.5) * 10, -Math.random() * 10 - 4,
                    gag, fxColor, "20px Arial", 45, true
                );
            }
        };

        if (typeof window.scheduleCombatInterval === 'function') {
            window.scheduleCombatInterval(stepMixi, 105, 6);
        } else {
            let mixiInterval = setInterval(() => {
                if (waves >= 6) clearInterval(mixiInterval);
                else stepMixi();
            }, 105);
        }

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 120,
                text: "🐔 BÃO KHÔ GÀ & SỦI STREAM!",
                color: "#ffd700", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 65, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(24, 16);
            if (typeof window.playSound === 'function') window.playSound(150, 'square', 0.5, 0.85, true);

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.3, "#00f3ff", true, true, caster.isFacingRight);
            }
            target.vy = -13;
            target.vx = caster.isFacingRight ? 18 : -18;
            target.onGround = false;
            target.stunTimer = 95;

            if (typeof window.spawnCustomObj === 'function') {
                let props = ["🐔", "🎙️", "💸", "🩴", "🎮", "🐔"];
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 75, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        props[k], "#00f3ff", "20px Arial", 48, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 660);
    },

    // Hàm vẽ nhân vật Độ Mixi (Áo ba lỗ trắng huyền thoại + Quần đùi đỏ + Dép tổ ong + Cầm Micro Streamer RGB)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        };

        // 1. Áo ba lỗ trắng huyền thoại của Tộc Trưởng + Viền Đỏ - Cyan phòng Stream
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 8.5;
        ctx.beginPath();
        ctx.moveTo(neck.x, neck.y);
        ctx.lineTo(pelvis.x, pelvis.y);
        ctx.stroke();

        ctx.strokeStyle = "#ff0055";
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(neck.x, neck.y + 2);
        ctx.lineTo(pelvis.x, pelvis.y - 4);
        ctx.stroke();

        // Quần đùi đỏ & chân
        ctx.strokeStyle = "#d90429";
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL);
        drawLimb(pelvis, kneeR, footR);

        // Cánh tay khoe cơ bắp
        ctx.strokeStyle = "#f5cd79";
        ctx.lineWidth = 4.5;
        drawLimb(neck, elbowL, handL);
        drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar Độ Mixi
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Vũ khí: Micro Streamer RGB phát sáng trên tay phải
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(p.state === 'punch' ? 0.5 : -0.3);
        ctx.fillStyle = "#2b2d42";
        ctx.fillRect(-2, -10, 4, 12);
        ctx.fillStyle = "#00f3ff";
        ctx.shadowBlur = isTrail ? 0 : 10;
        ctx.shadowColor = "#00f3ff";
        ctx.beginPath();
        ctx.arc(0, -12, 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Dép Tổ Ong Huyền Thoại màu vàng/trắng dưới chân
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#00f3ff";
            ctx.shadowBlur = 14;
            ctx.shadowColor = "#ffffff";
            ctx.beginPath();
            ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

// Tự động ghi danh vào hệ thống
if (!window.classStats) window.classStats = {};
window.classStats[window.currentLoadedChar.id] = window.currentLoadedChar;
