// ==========================================
// CHAR_VOZINHA.JS - CRISTIANO RONALDO JR (TIỂU CR7 - HỔ PHỤ SINH HỔ TỬ)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "vozinha",
    className: "Cristiano Jr",
    hp: 950, speed: 8, dmgMod: 1.5, color: "#f1c40f",
    avatarUrl: "character/picture/reonaldojr.png",
    voiceUrl: "character/voice/cristinorolnaldojr.wav",
    skill: {
        name: "GENETIC SIUUUU",
        icon: "🐐",
        description: "Hai cha con cùng tung cước: hai quả bóng liên tiếp (x2.0 và x2.5), mỗi quả đều gây choáng.",
        actionCode3: function(caster, target, gameContext) {
            if (!target) return;
            caster.state = 'cast'; caster.attackTimer = 25; caster.vx = 0; caster.vy = -8;
            gameContext.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🧬 GENETIC SIUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 45, noGravity: true });

            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0 || !target) return;
                gameContext.shakeScreen(10, 8);
                for (let k = 0; k < 12; k++) gameContext.spawnParticles(caster.x + (Math.random() - 0.5) * 80, window.GROUND_Y, "#3498db", true);

                if (Math.abs(caster.x - target.x) < 180) {
                    gameContext.takeDamage(target, 35 * (caster.currentDmgMod || caster.dmgMod || 1), "#3498db", false, false, caster.isFacingRight);
                    target.stunTimer = 60;
                    target.vy = -6;
                    target.onGround = false;
                }
            }, 250);
        }
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Kế Thừa Vương Quyền Siu Nhí",
            "quote": "Theo bước chân cha, em sẽ chứng minh cho thế giới thấy sức mạnh của thế hệ Siu kế tiếp!",
            "specialLoot": "Huy Hiệu Tiểu Siu 🧬",
            "statBonusDesc": "+12% Nhanh nhẹn & Hồi phục thể lực"
    },
    battleCries: {
            "intro": [
                    "HỔ PHỤ SINH HỔ TỬ! TIỂU SIU-7 ĐÂY! 👦🐐",
                    "BỐ SIU STRIKER ĐANG ĐỨNG NGOÀI BIÊN COI ĐẤY! 👀⚽",
                    "KẾ THỪA 100% BỘ GEN GOAT VĨ ĐẠI! 🧬🔥",
                    "SÚT RÁCH LƯỚI TỪ NĂM LÊN 5 TUỔI RỒI! 💛💙"
            ],
            "finisher": [
                    "DOUBLE SIUUUUUUU HAI CHA CON SONG KIẾM! 🔥🐐",
                    "SÚT RÁCH LƯỚI KHÔNG THỂ CẢN PHÁ! ⚽💥",
                    "THÁI TỬ AL-NASSR DỨT ĐIỂM HOÀN HẢO! 👑👦",
                    "BỐ SIU-7 GẬT ĐẦU TỰ HÀO TRÊN KHÁN ĐÀI! 🏆✨"
            ],
            "parry": [
                    "TỐC ĐỘ DI TRUYỀN KHÔNG THỂ CHẠM VÀO! 🏃💨",
                    "BỐ DẠY TỪNG THẾ NÉ VÀ TÌ ĐÈ RỒI! 🐐🛡️",
                    "ĐỪNG NGHĨ TRẺ CON MÀ DỄ ĂN HIẾP NHÉ! 👦⚡"
            ],
            "ult": [
                    "FATHER & SON DOUBLE SIUUUUUU! 🐐x👦🔥",
                    "BỘ GEN GOAT BẤT DIỆT TỎA SÁNG KHẮP SÀN! 🧬⚡"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CRISTIANO JR (TIỂU CR7)
    // ==========================================
    trashTalk: {
        chapters: [
            "HỔ PHỤ SINH HỔ TỬ: TIỂU CR7 DẠY DỖ {enemy} 👦🐐",
            "GEN DI TRUYỀN HUYỀN THOẠI: SÚT BAY MÀU {enemy} 🧬⚽",
            "CHA TRUYỀN CON NỐI: DOUBLE SIUUUU VÀO MẶT {enemy} 🔥",
            "THÁI TỬ AL-NASSR THƯỢNG ĐÀI THỬ SỨC VỚI {enemy} 👑"
        ],
        midMatch: [
            "Đừng thấy tao nhỏ tuổi mà nhờn nhé {enemy}, bố tao dạy tao sút rách lưới từ năm lên 5 rồi! 👦⚽",
            "Đánh thắng tao đã khó, coi chừng bố CR7 của tao đang đứng khoanh tay nhìn ở ngoài đường biên kìa {enemy}! 🐐👀",
            "Thừa hưởng 100% bộ gen GOAT, cú đá phạt này của tao chuẩn từng milimet vào trán {enemy}! 🧬🔥",
            "Ở giải trẻ Al-Nassr một trận tao ghi 5 bàn, gặp {enemy} chỉ cần nửa hiệp là xong! 💛💙",
            "Chuẩn bị xem hai cha con tao song kiếm hợp bích Double SIUUUU tiễn mày nhé {enemy}! ⚡",
            "Tốc độ và kỹ thuật của tao làm các đàn anh còn phải ngước nhìn đấy {enemy} ơi! 🏃💨"
        ],
        winQuotes: [
            {
                c: "Hổ phụ sinh hổ tử!",
                s: "Cristiano Jr vừa tái hiện hoàn hảo cú nhảy SIUUUU của người cha huyền thoại trước mặt {enemy}! 👦🐐"
            },
            {
                c: "Bộ gen GOAT không lẫn vào đâu được!",
                s: "Tài năng không đợi tuổi! Tiểu CR7 dễ dàng hạ đẹp {enemy} mà không tốn một giọt mồ hôi! 🧬⚽"
            },
            {
                c: "Bố Ronaldo gật đầu tự hào!",
                s: "Từ trên khán đài VIP, CR7 nở nụ cười mãn nguyện khi thấy con trai dứt điểm gọn gàng {enemy}! 👑"
            }
        ],
        loseQuotes: [
            {
                c: "Đợi đấy tao về mách bố CR7!",
                s: "{enemy} dám ăn hiếp trẻ vị thành niên à? Đợi bố tao xỏ giày vào sân là mày tới số! 🐐💢"
            },
            {
                c: "Đang đến giờ về làm bài tập về nhà!",
                s: "Bố bắt về ăn ức gà tập gym đúng giờ nên nhường {enemy} trận này đấy nhé! 📚💪"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan đánh chú {enemy} ơi! Nhìn ra đường biên xem ai đang khoanh tay lườm chú kìa... Bố Ronaldo của cháu đấy, liệu hồn! 👦🐐",
            "Đứng im khởi động cái đã {enemy}! Thắng trẻ con 14 tuổi thì chẳng có gì vẻ vang, mà thua cháu hôm nay là chú xóa game giải nghệ luôn nhé! 😂⚽",
            "Ê {enemy}, sáng nay bố cháu vừa bắt cháu gập bụng 1000 cái với ăn ức gà luộc xong, đang dư năng lượng sút vào mồm chú đây! 💪🔥",
            "Từ từ {enemy}! Cháu mang 100% bộ gen săn bàn vĩ đại nhất lịch sử trong người đấy, đừng tưởng mặt học sinh mà dễ bắt nạt! 🧬👑",
            "Đá lẹ trong 5 phút thôi nhé {enemy}, bố cháu tịch thu điện thoại không cho thức khuya, cháu phải xử đẹp chú sớm còn đi ngủ! ⏰😎",
            "Nhìn bộ giò chậm chạp của {enemy} còn thua cả hậu vệ giải U15 Al-Nassr mà cháu vừa ghi 5 bàn tuần trước nữa! 💛💙"
        ],
        replyOpening: [
            "Ơ kìa lớn đầu rồi mà phải đi hù dọa trẻ vị thành niên hả {enemy}? Không biết ngượng mồm với khán giả à chú ơi! 👦🤣",
            "Gáy to thế {enemy}! Bố cháu dặn mấy đứa mở mồm sủa to đầu trận thường là mấy đứa nằm cáng đầu tiên đấy! 🐐😈",
            "Bớt khè cháu đi {enemy}! Chú có tập thêm 20 năm nữa cũng không nhảy cao đánh đầu bằng nửa ông già nhà cháu đâu! ⚽🦅",
            "Nghe {enemy} nổ mà cháu tưởng chú mới uống nhầm chai Coca-Cola bố cháu vứt đi! Vào sân cháu dạy cho bài học thể lực! 💧😂",
            "Chú {enemy} cứ liệu cái thần hồn! Đụng gãy một sợi tóc xoăn của cháu là hai cha con cháu Double SIUUUU nát người chú ngay! ⚡🐐",
            "Thôi đừng làm mặt ngầu nữa {enemy}, nhìn chú giống ông chú bụng bia đá bóng chiều chủ nhật quá đi mất! 🍺😜"
        ],
        midFight: [
            "Khoan dừng lại chú {enemy} ơi! Sao thở dốc dữ vậy, để cháu chạy ra ghế dự bị xin bố cháu chai nước lọc cho chú uống nhé! 💧😂",
            "Ê {enemy}, bị một thằng nhóc cấp 2 xâu kim lừa bóng quay như dế thế này, lát về chú ăn nói sao với hàng xóm đây? 👦⚽",
            "Đứng lại cháu hỏi thật {enemy}: Chú đang giả vờ nhường trẻ em hay là trình độ thật của chú chỉ tới mức thảm họa này thôi vậy? 🤭🤣",
            "Từ từ nào {enemy}! Nhìn cú sút phạt giáng hương bản sao 1:1 của CR7 đây này, đỡ bằng răng nhé chú ơi! ☄️🧬",
            "Sao mặt {enemy} tái mét thế kia? Thấy bóng dáng ông già cháu đứng dậy khởi động ngoài biên là bắt đầu đái ra quần rồi chứ gì! 🐐👀",
            "Cố lên chú {enemy} ơi, già cả xương khớp kêu răng rắc hết rồi mà vẫn ráng đu theo bước chạy của cháu làm gì cho khổ! 🦴💨"
        ],
        climax: [
            "Bố ơi nhìn con dứt điểm pha cuối này!! Chú {enemy} chuẩn bị lên tivi làm tấm gương người lớn bị trẻ con hành ra bã nhé! 📺😈",
            "Hết xí quách rồi hả {enemy}? Tre già mà măng mọc đâm xuyên thủng luôn cây máu của chú rồi kìa! 🎋💥",
            "Tầm này {enemy} có quỳ xuống xin làm em nuôi của cháu thì bố cháu cũng không cho tha đâu! 👦👑",
            "Chuẩn bị bịt tai lại đi {enemy}, hai cha con nhà Ronaldo chuẩn bị bật nhảy xoay người nổ tung màng nhĩ chú bây giờ! 🐐🔥",
            "Đừng khóc nhè nhé chú {enemy}, lớn rồi ai lại để thua thằng nhóc 14 tuổi xong nằm ăn vạ ra đất thế kia! 😭🤣"
        ],
        finisher: [
            "Hổ phụ sinh hổ tử! Mini SIUUUUUUUU ngay trước mặt chú {enemy}, bố ơi con làm được rồi! 👦🐐",
            "Tài không đợi tuổi! Giải quyết gọn gàng ông chú {enemy}, giờ cháu xách cặp về làm bài tập rồi đi ngủ đúng giờ đây! 📚👑",
            "Quê chữ ê kéo dài chưa {enemy}! Để thua cả truyền nhân nhí nhà CR7 thì treo giày về vườn chăn vịt đi là vừa! ⚽😂",
            "Gen GOAT uy tín 100%! Bố Ronaldo trên khán đài vỗ tay rần rần, còn {enemy} thì úp mặt xuống cỏ trốn nhục! 🏆✨"
        ]
    },

    // 🟢 ULTIMATE REAL-TIME: TRIỆU HỒI HUYỀN THOẠI (FATHER & SON DOUBLE SIUUUU!)
    executeUltimate: function(caster, target, baseDmg) {
        if (!target) return;
        caster.state = 'kick';
        caster.attackTimer = 60;
        caster.vx = 0;
        caster.vy = -10;
        caster.onGround = false;
        caster.iFrames = 60;

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 95,
            text: "🐐x👦 HAI CHA CON TUNG CƯỚC!",
            color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 18px Arial", life: 55, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
        });

        if (typeof window.playSound === 'function') window.playSound(550, 'sine', 0.2, 0.45);

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 25 : -25),
                y: caster.y - 30,
                vx: caster.isFacingRight ? 26 : -26,
                vy: 2,
                r: 18,
                rot: 0,
                dmg: baseDmg * 2.0,
                isUlt: true,
                stun: 60,
                color: "#3498db",
                life: 80,
                caster: caster,
                target: target
            });
        }, 220);

        (window.scheduleCombatTimer || setTimeout)(() => {
            if (window.gameOver || !caster || caster.hp <= 0) return;

            window.floatingTexts.push({
                x: caster.x, y: caster.y - 125,
                text: "⚡ DOUBLE SIUUUUUU!",
                color: "#e74c3c", alpha: 1.0, vx: 0, vy: -1.5,
                font: "900 24px Impact", life: 70, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true
            });
            window.shakeScreen(20, 14);
            if (typeof window.playSound === 'function') window.playSound(190, 'square', 0.45, 0.8, true);

            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 35 : -35),
                y: caster.y - 50,
                vx: caster.isFacingRight ? 32 : -32,
                vy: 6,
                r: 24,
                rot: 0,
                dmg: baseDmg * 2.5,
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
                        k % 2 === 0 ? "⚽" : "🔥", "#f1c40f", "20px Arial", 45, true
                    );
                }
            }

            window.impactAberration = 5;
        }, 420);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

        // 1. Áo đấu Học viện Al-Nassr (Vàng tươi phối tay Xanh Navy)
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        ctx.strokeStyle = "#2980b9"; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();

        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        ctx.strokeStyle = "#e0ac69"; ctx.lineWidth = 3.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 2. Vẽ Đầu Avatar
        window.drawAvatarHead(ctx, head, p, isTrail, 35);

        // 3. Giày đá bóng Nike Trắng/Xanh
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') {
            ctx.fillStyle = "#3498db";
            ctx.shadowBlur = 15; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["vozinha"] = window.currentLoadedChar;
