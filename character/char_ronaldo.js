// ==========================================
// CHAR_RONALDO.JS - CRISTIANO RONALDO (CR7 SIUUUU!)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "ronaldo",
    className: "Cristiano Ronaldo",
    hp: 1050, speed: 6, dmgMod: 1.5, color: "#c0392b",
    avatarUrl: "character/picture/ronaldo.png",
    voiceUrl: "character/voice/ronaldo 1.wav",
    skill: {
        name: "BICYCLE KICK & SIUUUU",
        icon: "⚽",
        description: "Tung cú Bicycle Kick rồi ăn mừng SIUUU, quả bóng lửa gây sát thương x4.2.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0; caster.vy = -10;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "👑 GOAT SIUUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 20px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(15, 10);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 100, window.GROUND_Y, "#f1c40f", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 40 * (caster.currentDmgMod || caster.dmgMod || 1), "#f1c40f", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vy = -8;
                    target.onGround = false;
                }
            }, 300);
        }
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Truy Tìm Quả Cầu Vàng Vô Cực",
            "quote": "Mục tiêu duy nhất của ta là chiếc Cúp Vô Địch Tối Thượng! Mọi quái vật dám cản đường đều sẽ phải lắng nghe tiếng SIUUUU!",
            "specialLoot": "Cúp Vàng Thần Thoại 🏆",
            "statBonusDesc": "+20% Sát thương đòn đánh dứt điểm & Bạo kích"
    },
    battleCries: {
            "intro": [
                    "🐐 Anh Bảy Siu đã vào sân đấu!",
                    "⚽ Cả khán đài chuẩn bị hô SIUUU!",
                    "💧 Uống nước lọc đi, đừng uống coca!"
            ],
            "finisher": [
                    "🔥 SIUUUUUUUUUUUU!!",
                    "⚽ BICYCLE KICK KHÔNG THỂ CẢN!",
                    "🏆 BÀN THẮNG THỨ 999 TRONG SỰ NGHIỆP!"
            ],
            "parry": [
                    "💨 Bật nhảy 2m93 trên không trung!",
                    "🐐 Không có cửa chạm vào bóng!"
            ],
            "ult": [
                    "🔥 SIUUUUUUUUUUUU!! CÚ SÚT LỊCH SỬ!",
                    "⚽ SIÊU PHẨM XE ĐẠP CHỔNG NGƯỢC!"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CRISTIANO RONALDO (CR7)
    // ==========================================
    trashTalk: {
        chapters: [
            "SIUUUUU: CÚ XE ĐẠP CHỔNG NGƯỢC TIỄN {enemy} VỀ NƯỚC! ⚽",
            "CHƯƠNG ĐẶC BIỆT: 5 QUẢ BÓNG VÀNG ĐÈ BẸP {enemy} 🏆",
            "MR. CHAMPIONS LEAGUE THƯỢNG ĐÀI VS {enemy} 👑",
            "BẬT NHẢY 2M93: ĐÁNH ĐẦU VỠ MŨ {enemy} 🔥",
            "KỶ LUẬT THÉP CR7: DẠY CHO {enemy} BÀI HỌC THỂ LỰC 💪",
            "PHÚT 90+3: MÀN LẬT KÈO KINH ĐIỂN TRƯỚC {enemy} ⚡"
        ],
        midMatch: [
            "Chuẩn bị nghe cả sân vận động đồng thanh hô SIUUUUUU khi tao hạ gục mày nhé {enemy}! 🐐🔥",
            "Tao bật nhảy cao 2m93 trên không trung, nhìn xuống thấy {enemy} bé như con kiến! ⚽",
            "Bỏ chai Coca-Cola xuống và uống nước lọc đi {enemy}, yếu nhớt thế kia sao chịu nổi 90 phút! 💧",
            "5 Quả Bóng Vàng và hơn 900 bàn thắng trong sự nghiệp, còn {enemy} có danh hiệu gì chưa? 🏆",
            "Cú sút phạt Knuckleball vận tốc 130km/h này sẽ ghim thẳng vào giữa mặt {enemy}! ☄️",
            "Áp lực ư? Không có áp lực thì không có kim cương! {enemy} càng gáy tao đá càng sung! 💎",
            "Nhìn cơ đùi của anh Bảy đi {enemy}, một cước này là rách luôn lưới khung thành đấy! 🦵💥",
            "Khi nhạc hiệu C1 vang lên cũng là lúc {enemy} biết mình không còn cơ hội sống sót! 🎶👑",
            "Tao không tìm kiếm kỷ lục, kỷ lục tự tìm đến tao sau khi dứt điểm {enemy}! 📈",
            "Đứng làm hàng rào chắn bóng à {enemy}? Coi chừng bay luôn hàm răng nhé! 🥅"
        ],
        winQuotes: [
            {
                c: "SIUUUUUUUUUUUU!!",
                s: "Cristiano Ronaldo bật nhảy xoay người ăn mừng thương hiệu ngay bên cạnh cái xác của {enemy}! 🐐🔥"
            },
            {
                c: "Kỷ lục bàn thắng thứ 999!",
                s: "{enemy} vừa trở thành nạn nhân tiếp theo trong danh sách ghi bàn vĩ đại nhất lịch sử của CR7! ⚽🏆"
            },
            {
                c: "Ông Vua Champions League!",
                s: "Bản lĩnh phút bù giờ của Ronaldo đã nghiền nát hoàn toàn tâm lý thi đấu của {enemy}! 👑"
            },
            {
                c: "Siêu phẩm Xe Đạp Chổng Ngược!",
                s: "Cả khán đài đứng dậy vỗ tay cho cú móc bóng trên không tiễn {enemy} lên thẳng cáng cứu thương! 🏟️"
            }
        ],
        loseQuotes: [
            {
                c: "Trọng tài chưa check VAR!",
                s: "Pha vừa rồi {enemy} việt vị rõ mười mươi mà trọng tài biên lại ngủ gật! 📺🚩"
            },
            {
                c: "Sân cỏ hôm nay trơn quá!",
                s: "Trượt chân trụ lúc đang lấy đà sút phạt thôi, lượt về trên sân nhà {enemy} biết tay anh Bảy! 👟"
            },
            {
                c: "Giữ chân cho trận Chung kết C1!",
                s: "Trận giao hữu vô thưởng vô phạt nên CR7 đá giữ sức cho {enemy} vui tí thôi! 🏆"
            },
            {
                c: "Vừa tập tạ 5 tiếng trước khi vào trận!",
                s: "Hơi căng cơ đùi sau buổi tập cường độ cao, hẹn {enemy} hiệp phụ phân thắng bại! 💪"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan đá đã {enemy}! Dẹp ngay lon Coca-Cola trên bàn đi, uống nước lọc Aqua vào rồi hãng nói chuyện với anh Bảy! 💧😤",
            "Đứng im nhìn cơ đùi 7% mỡ thừa của tao đây này {enemy}! Sáng giờ tao gập bụng 3000 cái chỉ để lên đây khởi động với mày đấy! 🦵🔥",
            "Ê {enemy}, nghe tiếng nhạc Champions League nổi lên chưa? Chuẩn bị tinh thần làm nền cho siêu phẩm thứ 999 của tao nhé! 🎶👑",
            "Từ từ {enemy}! Kêu đạo diễn quay góc nghiêng 45 độ đẹp nhất của anh Bảy cái đã, thắng thì cũng phải đẹp trai tuyệt đối! 📸😎",
            "Nhìn thể lực của {enemy} bụng mỡ thế kia đá nổi 5 phút không, hay chưa hết hiệp 1 đã xin thay người? ⚽😂",
            "Cả khán đài trật tự! Để {enemy} nói lời trăn trối trước khi cả sân vận động đồng thanh hô SIUUUUUU! 🏟️🐐"
        ],
        replyOpening: [
            "Mày gáy cái gì cơ {enemy}? Tài năng mà không có kỷ luật thép như anh Bảy thì cũng chỉ làm cầu thủ dự bị lau ghế thôi! 💪😈",
            "Ồ to mồm phết nhỉ {enemy}! Để xem lúc tao bật nhảy cao 2m93 giậm lên đầu mày thì còn mở mồm gáy nổi không nhé! ⚽🦅",
            "Áp lực từ mồm {enemy} á? Quá muỗi! Anh Bảy ăn áp lực thay ức gà luộc mỗi sáng để hóa kim cương đấy ku ạ! 💎🔥",
            "Bớt khua môi múa mép đi {enemy}! Đứng xếp hàng rào che mặt cho kỹ vào, cú sút Knuckleball 130km/h này không có bảo hiểm đâu! ☄️🥅",
            "Nghe {enemy} sủa mà tao ngứa chân sút Penalty quá! Trọng tài đâu, thổi còi bắt đầu ngay cho anh Bảy ghi bàn! 📢⚽",
            "Cứ chê tao đi {enemy}! Khán giả càng la ó tên Ronaldo thì tao càng lập Hat-trick tiễn mày về nước sớm! 🐐🏆"
        ],
        midFight: [
            "Khoan dừng bóng {enemy}! Mới va chạm nhẹ một cái mà đã thở bằng tai rồi à? Về phòng gym tập tạ chân thêm 10 năm đi! 🏋️‍♂️😂",
            "Ê {enemy}, ngước lên trời mà nhìn! Trên độ cao 2m93 không khí trong lành lắm, còn dưới mặt đất chỗ mày toàn mùi hành thôi! 🦅⚽",
            "Đứng lại check VAR cái {enemy}! Sao mày phòng ngự hớ hênh như đội hạng 3 thế này, biếu không bàn thắng cho anh Bảy à? 📺🤣",
            "Từ từ thở đi {enemy}! Nhịp tim của tao vẫn đang 60 nhịp/phút như đi dạo công viên, còn mày sắp gọi cáng tới nơi rồi kìa! 💓😎",
            "Sao thế {enemy}? Bóng đi lắc quá bắt không dính đúng không? Đấy gọi là đẳng cấp của 5 Quả Bóng Vàng đấy em trai! 🏆✨",
            "Nhìn {enemy} kèm người kìa, chạy hụt hơi theo cái bóng áo số 7 của tao trông có tội nghiệp không cơ chứ! 🏃‍♂️💨"
        ],
        climax: [
            "Phút 90+3 rồi nhé {enemy}! Giờ hoàng đạo của Mr. Champions League đã điểm, chuẩn bị lên cáng cứu thương nằm! ⏱️👑",
            "Nhìn tao lùi lại 5 bước chân dạng háng đứng thở sâu là {enemy} tự hiểu sắp ăn quả đại bác cháy lưới rồi nhé! 😤☄️",
            "Hết pin rồi hả {enemy}? Đấy, tao bảo bỏ nước ngọt uống nước lọc đi không nghe, giờ chuột rút cả hai chân chưa! 💧💀",
            "Khán giả chuẩn bị lấy hơi nào! Chỉ còn 1 cú Xe Đạp Chổng Ngược nữa là {enemy} chính thức lên truyền hình làm nền! 🚲🔥",
            "Đừng nhìn trọng tài cầu cứu nữa {enemy}, kèo này VAR check 10 góc máy cũng chỉ thấy mày bị out trình thôi! 📺😈"
        ],
        finisher: [
            "SIUUUUUUUUUUUUU!! Cả thế giới ngước nhìn anh Bảy xoay người hạ cánh bên cạnh {enemy}! 🐐🔥",
            "Bàn thắng thứ 999 đã được ghi! Cảm ơn {enemy} đã đóng vai cọc gỗ tập sút cực kỳ nhiệt tình! ⚽🏆",
            "Kỷ lục không cần tìm kiếm, nó tự chạy đến chân tao sau khi tiễn {enemy} rời giải đấu! 📈👑",
            "Tắt đèn sân vận động! Gọi xe cứu thương chở {enemy} về, còn anh Bảy đi ngâm bồn nước đá hồi phục đây! 🧊😎"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: XE ĐẠP CHỔNG NGƯỢC & SIUUUUU!
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 60;
        caster.vx = caster.isFacingRight ? -3 : 3;
        caster.vy = -14;
        caster.onGround = false;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "⚽ BICYCLE KICK!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(520, 'sine', 0.2, 0.45);

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 120,
                text: "🐐 SIUUUUUUUUU!",
                color: "#e74c3c", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 70, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(18, 12);
            if (typeof window.playSound === 'function') window.playSound(180, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30),
                y: caster.y - 60,
                vx: caster.isFacingRight ? 28 : -28,
                vy: 10,
                r: 22,
                rot: 0,
                dmg: baseDmg * 4.2,
                isUlt: true,
                stun: 100,
                color: "#e74c3c",
                life: 80,
                caster: caster,
                target: target
            });

            if (typeof window.spawnCustomObj === 'function' && target) {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 70, target.y - 45,
                        (Math.random() - 0.5) * 12, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "⚽" : "🏆", "#f1c40f", "20px Arial", 45, true
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

        // 1. Áo đấu Bồ Đào Nha (Đỏ Bordeaux phối Xanh lá)
        ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#27ae60"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#ffddc1"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Quả bóng vàng đeo lấp lánh bên hông
        if (!isTrail) {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 10; ctx.shadowColor = "#f39c12";
            ctx.beginPath(); ctx.arc(pelvis.x - 8, pelvis.y, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        // 4. Giày đá bóng Nike Mercurial Trắng/Vàng
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowBlur = 15; ctx.shadowColor = "#e74c3c";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["ronaldo"] = window.currentLoadedChar;
