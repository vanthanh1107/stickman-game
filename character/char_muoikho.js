// ==========================================
// CHAR_MUOIKHO.JS - TRƯỜNG GIANG (MƯỜI KHÓ & DÉP TỔ ONG HUYỀN THOẠI)
// ==========================================

window.currentLoadedChar = {
    id: "muoikho",
    className: "Muoi Kho",
    hp: 1100, speed: 7, dmgMod: 1.5, color: "#8B4513",
    avatarUrl: "character/picture/muoikho.png",
    voiceUrl: "character/voice/muoikho.wav",
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
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Huyền Thoại Dép Tổ Ong Du Ký",
            "quote": "Chỉ với một đôi dép tổ ong và chiếc áo bà ba, ta đã đi qua trăm ngọn núi, vả bay mọi yêu ma quỷ quái!",
            "specialLoot": "Dép Tổ Ong Bất Hoại 🩴",
            "statBonusDesc": "+22% Sát thương đòn vả dép & Tốc độ chạy lùi"
    },
    battleCries: {
            "intro": [
                    "🩴 Dép tổ ong 100 lỗ huyền thoại lên nòng!",
                    "🍜 Đánh lẹ tao còn về nấu cơm cho Nhã Phương!",
                    "🏃 Xé bảng tên trong 1 nốt nhạc nghe {enemy}!"
            ],
            "finisher": [
                    "🩴 VẢ DÉP TỔ ONG 100 LỖ IN DẤU LÊN MẶT!",
                    "🍜 THÁI LÁT THỊT NẤU NỒI MÌ QUẢNG!",
                    "🔪 BẾP TRƯỞNG CHÚ DÉP BĂM NHỎ {enemy}!"
            ],
            "parry": [
                    "🏃 Độ lươn lẹo Running Man né ngọt xớt!",
                    "🩴 Giơ chiếc dép tổ ong lên đỡ nhẹ hều!"
            ],
            "ult": [
                    "🩴 BÃO DÉP TỔ ONG HUYỀN THOẠI QUẢNG NAM!",
                    "💥 CƠN THỊNH NỘ CỦA GIÀ CHÚ DÉP!"
            ]
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

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Trời đất quỷ thần thiên địa ơi!! Cỡ thằng ranh {enemy} vắt mũi chưa sạch mà hôm nay cũng dám vác mặt lên đây đôi co với ông Mười Khó hả con! 🩴👺",
            "Khoan khoan đừng đánh ông già tội nghiệp {enemy} ơi... cái lưng đau nhức quá, lại gần đỡ ông dậy cái coi... ĐỂ ÔNG PHANG CHIẾC DÉP TỔ ONG VÀO MỒM MÀY! 🩴😂",
            "Đứng im nghe dặn nè {enemy}! Đánh lẹ lẹ trong 3 phút giùm tao cái, 5 giờ chiều tao chưa về vo gạo nấu cơm lau nhà là Nhã Phương nhốt tao ngoài cổng đó! 🍚🧹",
            "Ê {enemy}, mày đói bụng chưa con? Để bếp trưởng Trường Giang thái lát mỏng cái thanh máu của mày ra làm nhân tô Mì Quảng đặc sản đãi khách nghe! 🍜🔪",
            "Bình tĩnh nào {enemy}! Bắt tay làm hòa tình thương mến thương anh em mình không đánh nhau nha... HÁ HÁ LỪA ĐẤY, XÉ BẢNG TÊN MÀY NÈ CON! 🏃‍♂️🤣",
            "Nhìn tướng tá {enemy} cao to mà cái mặt ngơ ngơ khờ khạo dữ thần ôn, đúng chuẩn con mồi ngon cho già Mười lươn lẹo xoay như chong chóng! 😜🩴"
        ],
        replyOpening: [
            "Ái chà chà cái mỏ hỗn dữ ta ơi! Làng nước bà con cô bác xứ Quảng ra mà coi thằng {enemy} nó dám lớn tiếng mất dạy với người lớn tuổi nè! 📢👺",
            "Mày gáy cái gì mà dữ dằn vậy {enemy}? Chiếc dép tổ ong huyền thoại 100 lỗ trên tay ông Mười đang rung bần bật đòi in dấu lên hai bên má mày kìa! 🩴💥",
            "Ồ sợ quá sợ quá {enemy} ơi, chân ông già run cầm cập rồi nè... run vì nhịn cười trước cái trình độ múa may như khỉ ăn ớt của mày đó con! 🐒😂",
            "Thôi bớt nổ banh nhà lồng chợ đi {enemy}! Về độ mưu hèn kế bẩn lươn lẹo trên đời này mày còn phải xách dép đi học ông Mười 10 khóa nữa! 🐍😎",
            "Nghe {enemy} hù mà tao tưởng tiếng nồi nước lèo đang sôi ùng ục! Lại đây ông nêm nếm cho mày hai muỗng ớt hiểm Quảng Nam cay xé lưỡi luôn! 🌶️🍜",
            "Cứ vỗ ngực xưng tên đi con trai {enemy}, lát bị già lùn 1m65 vả cho lật mặt thì đừng có ngồi khóc hu hu đòi mẹ nghe chưa! 😭🤣"
        ],
        midFight: [
            "Khoan dừng tay một chút {enemy} ơi! Dây giày của mày bị tuột dưới đất kìa con... ĐÓ THẤY CHƯA CÚI XUỐNG LÀ ĂN NGAY ĐẾ DÉP TỔ ONG LÊN ĐẦU NGU CHƯA! 🩴🤣",
            "Ê {enemy}, đếm thử giùm ông trên trán mày in đủ 100 cái lỗ tròn xoe của chiếc dép cao su trắng chưa hay thiếu lỗ nào để ông dặm thêm? 🔍😂",
            "Đứng lại tao biểu coi {enemy}! Hồi nãy mở mồm chê ông già chân ngắn yếu sức, sao giờ bị ông lùa chạy trối chết khắp cái sân khấu vậy con! 🏃‍♂️💨",
            "Từ từ thở đi {enemy}! Đau quá thì nói ông Mười dừng tay múc cho chén nước mắm nguyên chất uống cho tỉnh người rồi ăn đòn tiếp nghe! 🥣😜",
            "Trời ơi nhìn cái bản mặt {enemy} bị lừa cú thứ ba liên tiếp mà vẫn tin sái cổ kìa, ngây thơ cỡ này ra đời sao chơi lại hệ lươn chúa! 🐍😎",
            "Nhanh cái chân lên {enemy} ơi! Nhã Phương vừa nhắn tin hỏi mua rau muống chưa kìa, mày còn lì đòn câu giờ là ông lấy dao phay bếp trưởng rượt thiệt đó! 🔪🥬"
        ],
        climax: [
            "Mệt đứt hơi tai rồi hả con trai {enemy}? Để ông Mười rút luôn chiếc dép tổ ong chân trái ra chơi song kiếm hợp bích tiễn mày về chầu ông vải luôn! 🩴🔥",
            "Còn thoi thóp nhấp nháy cây máu đỏ lòm kìa {enemy}! Nằm đại xuống đất giả chết đi cho ông còn kịp chạy ra chợ chiều mua cá kho tộ! 🐟😈",
            "Tầm này {enemy} có quỳ lạy kêu 'Bác Mười tha con' thì cũng muộn rồi, ai biểu nãy đầu trận dám chê chiều cao nhạy cảm của ông chi! 👺💥",
            "Chuẩn bị lên đĩa bày ra bàn tiệc nghe {enemy}, món 'Đối thủ xào lăn tẩm hành tây' do đích thân Mười Khó đứng bếp đã chín tới! 🍳🍜",
            "Đừng có ngó sau lưng tìm đường trốn {enemy} ơi, bảng tên sau lưng mày chuẩn bị nằm gọn trong tay già lươn rồi! 🏃‍♂️💀"
        ],
        finisher: [
            "BỐP!! Dấu ấn dép tổ ong 100 lỗ đóng mộc đỏ chót lên mặt {enemy}! Thôi ông xách giỏ đi chợ về nấu cơm cho vợ đây, bye nghe con! 🩴🍚",
            "Đã bảo gừng càng già càng cay mà không tin! {enemy} nằm dưới đất suy ngẫm lại bài học lễ phép với người lớn đi nhé! 🌶️👑",
            "Xé toạc bảng tên gọn ơ không tốn giọt mồ hôi! Đỉnh cao trí tuệ lươn lẹo xứ Quảng làm sao {enemy} đỡ nổi! 🏃‍♂️😂",
            "Hoàn thành món Mì Quảng full topping hành ngò tặng {enemy}! Hẹn gặp lại ở gameshow tuần sau nếu mày còn đủ răng ăn mì nha con! 🍜✨"
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

        (window.scheduleCombatTimer || setTimeout)(() => {
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
