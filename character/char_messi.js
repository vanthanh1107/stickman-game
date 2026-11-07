// ==========================================
// CHAR_MESSI.JS - LIONEL MESSI (EL PULGA - GOAT WORLD CUP)
// ==========================================

window.cr7Balls = window.cr7Balls || [];

window.currentLoadedChar = {
    id: "messi",
    className: "Lionel Messi",
    hp: 1000, speed: 7, dmgMod: 1.5, color: "#74b9ff",
    avatarUrl: "character/picture/messi.png",
    voiceUrl: "character/voice/messi 1.wav",
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
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Hành Trình Bọ Chét Ma Thuật",
            "quote": "Họ nói có những con quái thú bất khả chiến bại... Nhưng không ai có thể lấy được quả bóng ma thuật dưới chân ta!",
            "specialLoot": "Đôi Giày Vàng Vĩnh Hằng 👟",
            "statBonusDesc": "+18% Khả năng lừa đòn & Phản xạ né đòn hoàn hảo"
    },
    battleCries: {
            "intro": [
                    "👀 Qué mirás, bobo?! Đi chỗ khác!",
                    "🐐 Nhà Vô Địch Grand Cup xuất trận!",
                    "🇦🇷 Chân trái dính keo 502 với trái bóng!"
            ],
            "finisher": [
                    "🏆 CÚP VÀNG THẾ GIỚI 2022 LÊN TIẾNG!",
                    "🐐 ANKARA LEO M10! ANKARA LEO M10!",
                    "⚽ XÂU KIM QUA HÁNG NGOẠN MỤC!"
            ],
            "parry": [
                    "🌪️ Lắc hông Body Feint lừa tình!",
                    "🐐 Đi bộ cũng out trình tuyệt đối!"
            ],
            "ult": [
                    "🏆 8 QUẢ BÓNG VÀNG CỦA GOAT VĨ ĐẠI!",
                    "🇦🇷 SIÊU PHẨM CHÂN TRÁI MA THUẬT GRAND CUP!"
            ]
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

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Qué mirás, bobo? Nhìn cái gì mà trợn mắt thế hả {enemy}, lượn thẳng về phòng thay đồ khi còn kịp đi ku! 👀🇦🇷",
            "Khoan đá đã {enemy}! Cho tao nhấp nốt ngụm trà Yerba Mate rồi đi bộ túc tắc xâu kim qua háng mày nhé! 🧉😎",
            "Ê {enemy}, đeo kính râm vào chưa? Chứ 8 Quả Bóng Vàng với cái Cúp Vàng World Cup của tao nó chói lòa mù mắt đấy! 🏆✨",
            "Bình tĩnh nào {enemy}, anh vệ sĩ đặc nhiệm Yassine của tao đang đứng sát đường biên kìa, mày ho mạnh là ảnh bế đi luôn đấy! 🕶️💪",
            "Từ từ {enemy}! Tao phá đảo hết mọi danh hiệu bóng đá nhân loại rồi, hôm nay ghé qua Miami vả mày dưỡng già giải trí thôi! 🌴🐐",
            "Đứng khép hai chân vào đi {enemy}! Sơ hở 10 centimet là trái bóng đi xuyên qua háng mày lúc nào không hay đâu! ⚽😏"
        ],
        replyOpening: [
            "Mày sủa căng thế {enemy}? Người có Cúp Vàng Thế Giới thường ít nói lắm, để cái chân trái của tao trả lời hộ vào mặt mày nhé! 🏆🤫",
            "Ồ sợ ghê chưa {enemy}! Thấy tao đi bộ vuốt râu tưởng tao hiền à, tao lắc hông một nhịp là cột sống mày gãy làm đôi đấy! 🌪️🐐",
            "Thôi bớt múa mồm đi {enemy} ơi! Mười thằng hậu vệ vây quanh kéo rách áo tao còn chẳng ăn thua, cỡ mày tuổi tôm à? 👕😂",
            "Anda pa' allá, bobo! Biến ra đằng kia chơi đi {enemy}, trình độ mẫu giáo mà đòi lên giọng dạy đời GOAT! 👀🇦🇷",
            "Nghe {enemy} nổ mà tao buồn ngủ quá! Vào trận lẹ đi còn về ăn tối với Antonela các con ở Miami nữa! 🌴🥱",
            "Cứ gáy to lên {enemy}, lát nữa nằm xoạc cẳng nhìn tao bấm bóng Panenka vào lưới thì đừng có khóc nhè nhé! 🎯😈"
        ],
        midFight: [
            "Khoan dừng nhịp {enemy}! Nãy giờ tao mới đi bộ 80% thời gian đọc vị thôi mà mày đã thở hồng hộc như trâu cày thế kia? 🚶‍♂️😂",
            "Ê {enemy}, kiểm tra lại khớp cổ chân với đốt sống lưng xem còn nguyên không sau pha đảo người vừa rồi của tao cái! 🌪️⚽",
            "Đứng im hỏi nhỏ {enemy}: Bị xâu kim 3 quả liên tiếp trước hàng vạn khán giả cảm giác quê độ thế nào kể tao nghe coi? 🤭🇦🇷",
            "Từ từ nào {enemy}! Đừng cố lao vào xoạc bóng vô ích, trái bóng nó tự dính keo 502 vào chân trái thiên tài của tao rồi! ✨🐐",
            "Sao đứng ngây ra như cọc gỗ tập rê bóng thế {enemy}? Hoa mắt chóng mặt vì không biết tao rẽ hướng nào đúng không? 😵‍💫🤣",
            "Nghỉ uống miếng nước đi {enemy} ơi! Nhìn mày đuổi theo cái bóng lùn 1m70 của tao mà lưỡi thè dài cả thước kìa! 👅💨"
        ],
        climax: [
            "Góc chữ A cự ly 22 mét đã khóa mục tiêu! {enemy} lo mà viết di chúc đi chứ nhảy lên làm hàng rào cũng vô nghĩa thôi! 🎯🔥",
            "Hết hơi rồi hả {enemy}? Trận Chung kết Lusail căng gấp trăm lần thế này tao còn gánh được, cỡ mày chỉ là đá tập! 🏆🇦🇷",
            "Qué mirás, bobo? Còn trừng mắt nhìn tao nữa à {enemy}, chuẩn bị nhận cú cứa lòng tiễn thẳng về quê ngoại nhé! 👀💀",
            "Anh vệ sĩ ơi khỏi cần chạy vào sân đâu, một mình tôi búng nhẹ cái nữa là thằng {enemy} tự ngất xỉu rồi! 🕶️😏",
            "Tầm này {enemy} chỉ còn nước quỳ xuống xin đổi áo đấu làm kỷ niệm trước khi thanh máu bay sạch thôi! 👕🐐"
        ],
        finisher: [
            "Hoàn tất bộ sưu tập! Hôn nhẹ lên Cúp Vàng World Cup và gửi lời chào tạm biệt tới chú hề {enemy}! 🏆🇦🇷",
            "Anda pa' allá, bobo! Đi thẳng về nhà đắp chăn khóc đi {enemy}, đừng bao giờ chọc giận El Pulga! 👀🐐",
            "Chỉ cần đi bộ vuốt râu cũng đủ out trình hoàn toàn! Cảm ơn {enemy} đã tài trợ Quả Bóng Vàng thứ 9 cho tao! 🌟👑",
            "Xong buổi tập nhẹ ở Miami! Chúc {enemy} bó bột khớp háng vui vẻ nhé, tao về uống trà Mate đây! 🧉🌴"
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

        (window.scheduleCombatTimer || setTimeout)(() => {
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
