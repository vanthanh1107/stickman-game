// ==========================================
// CHAR_MTP.JS - SƠN TÙNG M-TP (CHỦ TỊCH SKY TOUR)
// ==========================================

window.currentLoadedChar = {
    id: "mtp",
    className: "Sơn Tùng M-TP",
    hp: 1000, speed: 6, dmgMod: 1.5, color: "#00a8ff",
    avatarUrl: "character/picture/sontung.png",
    voiceUrl: "character/voice/sontung mtp.wav",
    skill: {
        name: "HÃY TRAO CHO ANH",
        icon: "👑",
        description: "Gọi mưa tia sét từ trời cao rồi giáng đòn kết liễu \"Chạy ngay đi\", sát thương x4.2.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "💎 CHỦ TỊCH!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 15; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 120, caster.y - 40, "#00a8ff", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#00a8ff", false, false, caster.isFacingRight);
                    target.stunTimer = 70;
                    target.vx = caster.isFacingRight ? 15 : -15;
                }
            }, 200);
        }
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Bầu Trời Sky & Chiếc Vương Miện",
            "quote": "Mang theo tình yêu của đại gia đình Sky, giai điệu phiêu lưu này sẽ soi sáng mọi màn đêm tăm tối!",
            "specialLoot": "Micro Kim Cương Tỏa Sáng 💎",
            "statBonusDesc": "+15% Hào quang bảo hộ & Sấm sét dứt điểm"
    },
    battleCries: {
            "intro": [
                    "👑 Chủ tịch đã bước lên sân khấu!",
                    "🔥 Chạy ngay đi trước khi quá muộn!",
                    "💎 Chúng ta không thuộc về nhau đâu {enemy}!"
            ],
            "finisher": [
                    "👑 HÃY TRAO CHO EM TOÀN BỘ MÁU!",
                    "🔥 CHẠY NGAY ĐI KHÔNG THỂ CẢN!",
                    "💙 TOP 1 TRENDING TOÀN CẦU ĐÈ BẸP!"
            ],
            "parry": [
                    "💎 Hào quang Chủ tịch chói lòa!",
                    "🎶 Lạc Trôi giữa sàn đấu né ngọt xớt!"
            ],
            "ult": [
                    "👑 ĐẠI NHẠC HỘI SKY TOUR HỦY DIỆT!",
                    "🎤 GIỌNG CA VÀNG THÔI MIÊN TOÀN DIỆN!"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CHỦ TỊCH SƠN TÙNG M-TP
    // ==========================================
    trashTalk: {
        chapters: [
            "CHẠY NGAY ĐI: TRƯỚC KHI CHỦ TỊCH QUÉT SẠCH MÁU {enemy}! 🔥",
            "CHÚNG TA KHÔNG THUỘC VỀ NHAU: OUT TRÌNH {enemy} 💎",
            "HÃY TRAO CHO ANH: TOÀN BỘ THANH MÁU CỦA {enemy}! 👑",
            "LẠC TRÔI GIỮA SÀN ĐẤU: {enemy} ĐỨNG HÌNH NGHE NHẠC 🎶",
            "SKY TOUR ĐẠI CHIẾN: ĐÈ BẸP {enemy} BẰNG TOP 1 TRENDING 📈"
        ],
        midMatch: [
            "Chúng ta không thuộc về nhau đâu {enemy} ơi, trình của mày ở dưới đáy xã hội! 💎",
            "Chạy ngay đi! Trước khi mọi điều dần tồi tệ hơn với thanh máu của mày nhé {enemy}! 🔥🏃",
            "Hãy trao cho anh... toàn bộ số máu còn lại của mày đi {enemy} ơi! 👑🎤",
            "Nhìn bộ cánh hàng hiệu trăm triệu của Chủ tịch có làm {enemy} khớp tâm lý không? 🧥✨",
            "Cầm Micro vàng gõ nhẹ một nhịp Bass là {enemy} Lạc Trôi sang thế giới bên kia luôn! 🎶",
            "Sky ơi!! Giơ cao Lightstick xanh cổ vũ Chủ tịch tiễn {enemy} về nơi chín suối nào! 💙🔦",
            "Muốn ngồi ở một vị trí không ai ngồi được, thì phải vả {enemy} những cú không ai đỡ được! 👑",
            "Đừng làm trái tim anh đau nhé {enemy}, đứng yên cho anh combo 100 hit coi nào! 💖💥"
        ],
        winQuotes: [
            {
                c: "Top 1 Trending toàn cầu!",
                s: "MV mới của Chủ tịch Sơn Tùng M-TP quay cảnh vả sấp mặt {enemy} vừa đạt 100 triệu view! 📈👑"
            },
            {
                c: "Đã bảo là Chạy Ngay Đi mà không nghe!",
                s: "{enemy} lì lợm đứng lại đôi công với Chủ tịch và cái kết nằm thở oxy giữa sân khấu! 🔥🎤"
            },
            {
                c: "Hào quang Sky Tour rực sáng!",
                s: "Hàng triệu Lightstick xanh đã chứng kiến màn trình diễn out trình tuyệt đối trước {enemy}! 💙💎"
            },
            {
                c: "Chúng ta không thuộc về nhau!",
                s: "Đẳng cấp của Chủ tịch ở tầng mây thứ 9, còn {enemy} thì vừa bị đạp xuống đất! ☁️"
            }
        ],
        loseQuotes: [
            {
                c: "Đang bận ấp ủ MV Comeback!",
                s: "Chủ tịch ở ẩn dưỡng sức 1 năm để ra siêu phẩm mới thôi, hẹn {enemy} ngày tái xuất! 🎬💎"
            },
            {
                c: "Hệ thống âm thanh sân khấu bị rè!",
                s: "Loa kiểm âm bị lệch nhịp Bass nên Chủ tịch ngừng diễn giữa chừng, {enemy} ăn may thôi! 🎧"
            },
            {
                c: "Trượt chân vì áo lông hàng hiệu nặng quá!",
                s: "Chiếc áo khoác 500 triệu hơi vướng tay tí thôi, cởi áo khoác ra là {enemy} tới công chuyện! 🧥"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan lên nhạc {enemy}! Chúng ta không thuộc về nhau đâu em ơi, Chủ tịch ở tầng mây còn mày thuộc về mặt đất! ☁️💎",
            "Đứng xa cái áo lông 800 triệu bản giới hạn của anh ra nhé {enemy}! Đánh văng bụi vào áo anh là đền cả thanh xuân đấy! 🧥✨",
            "Ê {enemy}, anh ở ẩn 2 năm mới thèm xuất hiện một lần, hôm nay vinh dự lắm mới được ăn cú gõ Micro vàng của Chủ tịch đấy! 🎤👑",
            "Bình tĩnh nào {enemy}! Để anh vuốt lại tóc chỉnh kính râm cái đã, đại chiến thì thần thái vẫn phải Top 1 Trending! 😎📈",
            "Sky ơi giơ cao Lightstick lên nào!! Hôm nay Chủ tịch mở liveshow dạy {enemy} cách hát nốt trầm dưới sàn đấu! 💙🔦",
            "Chạy ngay đi {enemy}! Trước khi mọi điều dần tồi tệ hơn với hàm răng tiền đạo của mày đấy em trai! 🔥🏃‍♂️"
        ],
        replyOpening: [
            "Ồ {enemy} gáy nghe chói tai quá nhờ! Giọng lệch tông phô chênh thế này nộp demo vào công ty M-TP là bị loại từ cửa bảo vệ! 🎧😂",
            "Muốn ngồi ở một vị trí không ai ngồi được... thì hôm nay {enemy} phải chịu cảm giác nằm sàn không ai cứu được! 👑😈",
            "Bớt sủa lại đi {enemy} ơi! Hãy trao cho anh... nguyên cây máu và chút liêm sỉ cuối cùng của mày ngay lập tức! 🎤💥",
            "Nghe {enemy} hù mà anh tưởng tiếng nhạc dạo mở màn thôi á! Vào nhịp Drop đi cưng, anh cho mày Lạc Trôi luôn! 🎶🌪️",
            "Thôi đừng cố làm màu trước mặt Chủ tịch {enemy} ạ! Cỡ mày chỉ hợp đóng vai quần chúng bị đánh bay trong MV của anh thôi! 🎬🤣",
            "Cứ gáy cho sướng mồm đi {enemy}, lát nữa anh chỉ cười mỉm thả tim là mày tự khắc tăng xông máu nằm vật ra đấy! 💖😎"
        ],
        midFight: [
            "Khoan tắt nhạc 2 giây {enemy}! Sao nhịp thở của em loạn xị ngậu rớt hết cả nhịp Bass thế kia, đuối hơi rồi à? 🎧😂",
            "Ê {enemy}, có chắc yêu là đây chưa? Hay là choáng váng đầu óc vì ăn trọn combo hàng hiệu của Chủ tịch rồi! 💫💎",
            "Đứng im anh hỏi {enemy}: Nãy anh khuyên 'Chạy Ngay Đi' từ đầu sao không chịu nghe, giờ chân run cầm cập chạy đường nào nữa! 🔥🤣",
            "Từ từ nào {enemy}! Đừng làm trái tim anh đau bằng mấy đòn gãi ngứa muỗi đốt inox đấy chứ! 💖😏",
            "Nhìn {enemy} ngơ ngác giữa sân khấu như người tối cổ lạc vào Sky Tour kìa, thương ghê cơ! 💙🎤",
            "Sao thế {enemy}? Ánh hào quang ngôi sao hạng S của anh chiếu thẳng vào mắt làm em mù phương hướng rồi hả? ✨😎"
        ],
        climax: [
            "Đoạn cao trào kết bài tới rồi nhé {enemy}! Chuẩn bị nhận nốt nhạc cuối cùng tiễn thẳng về hậu trường thở bình oxy! 🎶💀",
            "Cơn mưa ngang qua... mang thanh máu của {enemy} đi xa mãi mãi không ngày trở lại luôn rồi em ơi! 🌧️😈",
            "Còn ráng cầm cự được mấy giây nữa hả {enemy}? Ngoan ngoãn nằm xuống làm cảnh kết MV trăm triệu view cho Chủ tịch nào! 🎬📈",
            "Tầm này {enemy} có gọi cả họ hàng vào cày view hộ cũng không kéo lại nổi 1 giọt máu nào đâu! 💎🔥",
            "Nơi này có anh... và có luôn chiếc cáng cứu thương đặt sẵn tên {enemy} ngay cánh gà sân khấu rồi đấy! 🚑👑"
        ],
        finisher: [
            "Top 1 Trending toàn cầu! Màn trình diễn hủy diệt {enemy} chính thức phá vỡ mọi kỷ lục phòng vé! 📈👑",
            "Đã bảo Chúng Ta Không Thuộc Về Nhau mà cứ cố đấm ăn xôi! Ngủ ngon dưới ánh đèn sân khấu nhé {enemy}! 💙🎤",
            "Hạ màn đại nhạc hội! Chủ tịch phủi nhẹ tà áo hàng hiệu bước đi, để lại {enemy} nằm khóc một dòng sông! 🧥✨",
            "Cảm ơn các Sky! Buổi giao lưu âm nhạc kết hợp vả sấp mặt {enemy} xin được phép khép lại tại đây! 💎🔥"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: ĐẠI NHẠC HỘI SKY TOUR & "HÃY TRAO CHO ANH"
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'cast';
        caster.attackTimer = 65;
        caster.vx = 0;
        caster.iFrames = 65;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "👑 HÃY TRAO CHO ANH!",
            color: "#00a8ff", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 60, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(580, 'sine', 0.2, 0.45);

        let drops = 0;
        let stepSky = (id) => {
            if (window.gameOver || !caster || caster.hp <= 0 || drops >= 6) {
                if (id && typeof window.cancelCombatTimer === 'function') window.cancelCombatTimer(id);
                return;
            }
            drops++;
            let randX = caster.x + (caster.isFacingRight ? 1 : -1) * (Math.random() * 240 + 30);

            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(randX, window.GROUND_Y - 120, true, "#00a8ff", true, 5.0, 90);
            }
            if (typeof window.spawnParticles === 'function') {
                for (let k = 0; k < 6; k++) window.spawnParticles(randX, window.GROUND_Y - 20, "#ffffff", true);
            }
        };
        if (typeof window.scheduleCombatInterval === 'function') {
            window.scheduleCombatInterval(stepSky, 110, 6);
        } else {
            let skyInterval = setInterval(() => {
                if (drops >= 6) clearInterval(skyInterval);
                else stepSky();
            }, 110);
        }

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 120,
                text: "🔥 CHẠY NGAY ĐI!",
                color: "#e84118", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 65, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(22, 16);
            if (typeof window.playSound === 'function') window.playSound(160, 'square', 0.5, 0.85, true);

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.2, "#00a8ff", true, true, caster.isFacingRight);
            }
            target.vy = -12;
            target.vx = caster.isFacingRight ? 18 : -18;
            target.onGround = false;
            target.stunTimer = 95;

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 75, target.y - 45,
                        (Math.random() - 0.5) * 14, -Math.random() * 14 - 5,
                        k % 2 === 0 ? "💎" : "🎤", "#00a8ff", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 680);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo Khoác Lông / Vest Trắng Bạch Công Tử (Chủ tịch)
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
        ctx.strokeStyle = "#111111"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#1e272e"; ctx.lineWidth = 4.5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 36);

        // 3. Vũ khí: Micro Vàng Đính Kim Cương trên tay phải
        ctx.save();
        ctx.translate(handR.x, handR.y);
        ctx.rotate(p.state === 'punch' ? 0.5 : -0.3);
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(-2, -10, 4, 12);
        ctx.fillStyle = "#00a8ff";
        ctx.shadowBlur = isTrail ? 0 : 10; ctx.shadowColor = "#00a8ff";
        ctx.beginPath(); ctx.arc(0, -12, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 4. Giày hiệu Gucci / Balenciaga Đế Đỏ
        ctx.fillStyle = "#111111";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#00a8ff";
            ctx.shadowBlur = 15; ctx.shadowColor = "#ffffff";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["mtp"] = window.currentLoadedChar;
