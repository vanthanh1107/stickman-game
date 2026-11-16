// ==========================================
// CHAR_JONNYTRINGUYEN.JS - VÕ SƯ JOHNNY TRÍ NGUYỄN (LIÊN PHONG MMA)
// ==========================================

window.currentLoadedChar = {
    id: "jonny",
    className: "Johnny Trí Nguyễn",
    hp: 1050, speed: 7, dmgMod: 2.1, color: "#ff4757",
    avatarUrl: "character/picture/jonnytri.png",
    voiceUrl: "character/voice/jonny tri nguyen.wav",
    skillPrompt: "triệu hồi rồng cưỡi rồng thần long linh thú quái thú uy mãnh, liên hoàn chém cước vô ảnh gối bay khí công võ thuật 🐉 🥋 ⚡ 🌪️, hất tung sát thương x4.5",
    skill: {
        name: "LONG THẦN LIÊN PHONG: THẦN LONG GIÁNG THẾ VÔ ẢNH CƯỚC",
        icon: "🐉",
        description: "Vận nội công Long Thần triệu hồi Thần Long rồng vàng khổng lồ uốn lượn từ tầng mây, Johnny Trí Nguyễn cưỡi rồng phóng xuống sàn đấu, tung chuỗi Vô Ảnh Cước liên hoàn cước phong kết hợp tiếng long ngâm rung chuyển đất trời!",
        skillPrompt: "triệu hồi rồng cưỡi rồng thần long linh thú quái thú uy mãnh, liên hoàn chém cước vô ảnh gối bay khí công võ thuật 🐉 🥋 ⚡ 🌪️, hất tung sát thương x4.5"
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Hiệp Khách Phong Trần Hành Đạo",
            "quote": "Một thân một võ nghệ phiêu lãng chân trời, gặp chuyện bất bình rút cước tương trợ!",
            "specialLoot": "Bí Kíp Liên Phong Chân Kinh 🥊",
            "statBonusDesc": "+20% Sát thương võ thuật liên hoàn & Phá giáp"
    },
    battleCries: {
            "intro": [
                    "DÒNG MÁU ANH HÙNG ĐANG SÔI SỤC! 🥊🔥",
                    "VÕ ĐƯỜNG LIÊN PHONG MMA THỰC CHIẾN ĐÂY! 🐉🥋",
                    "KHÔNG CÓ DIỄN VIÊN ĐÓNG THẾ ĐÂU NHÉ {enemy}! 🎬⚡",
                    "BƯỚC VÀO LỒNG BÁT GIÁC THÌ ĐỪNG XIN HÀNG! 🏆"
            ],
            "finisher": [
                    "LIÊN PHONG VÔ ẢNH CƯỚC ĐO SÀN! 🐉💥",
                    "KNOCK-OUT KỸ THUẬT HIỆP 1 TUYỆT ĐỐI! 🥊🔥",
                    "BẪY RỒNG GỐI BAY NỘI CÔNG THƯỢNG THỪA! ⚡🥋",
                    "BẬC THẦY VÕ THUẬT VIỆT NAM THỊ PHẠM! 🙏🏆"
            ],
            "parry": [
                    "KHÓA SIẾT BÁT GIÁC TRONG 3 GIÂY! 🥋💪",
                    "ĐÒN CHỎ LẬT HÓA GIẢI TOÀN BỘ QUYỀN CƯỚC! 🥊✨",
                    "BỘ TẤN LIÊN PHONG VỮNG NHƯ BÀN THẠCH! 🐉"
            ],
            "ult": [
                    "ĐẠI CHIÊU THỨC DÒNG MÁU ANH HÙNG! 🐉🔥",
                    "LIÊN PHONG BẪY RỒNG SONG PHI PHÁ GIÁP! 🥊⚡"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA VÕ SƯ JOHNNY TRÍ NGUYỄN
    // ==========================================
    trashTalk: {
        chapters: [
            "DÒNG MÁU ANH HÙNG: LONG THẦN LIÊN PHONG TRẢM {enemy}! 🐉",
            "DÒNG MÁU ANH HÙNG: LIÊN PHONG VÔ ẢNH CƯỚC HẠ GỤC {enemy}! 🥊",
            "BẪY RỒNG THƯỢNG ĐÀI: DẠY {enemy} VÕ THUẬT THỰC CHIẾN 🐉",
            "BỤI ĐỜI CHỢ LỚN: MỘT MÌNH CÂN ĐẸP {enemy} 🔥",
            "LỒNG BÁT GIÁC MMA: KHÓA SIẾT {enemy} TRONG 3 GIÂY 💪"
        ],
        midMatch: [
            "Dòng Máu Anh Hùng thức tỉnh! Đỡ thử một cước Long Thần Liên Phong của ta xem nào {enemy}! 🥋",
            "Võ thuật trên phim chỉ là biểu diễn, hôm nay tao cho {enemy} nếm thử võ thực chiến Liên Phong! 🥊🔥",
            "Nhìn bộ tấn của {enemy} lỏng lẻo thế kia, một cú Low Kick của tao là sập nguồn ngay! 🦵💥",
            "Dòng Máu Anh Hùng đang sôi sục, chuẩn bị đỡ chuỗi liên hoàn cước không kịp thở nhé {enemy}! 🐉",
            "Đừng chớp mắt {enemy} ơi, đòn chỏ lật kết hợp gối bay này không có cascader đóng thế cho mày đâu! ⚡",
            "Bước vào lồng bát giác với tao thì chỉ có nằm cáng đi ra thôi {enemy} ạ! 🏆",
            "Găng tay MMA đỏ rực nội công đã lên nòng, {enemy} giơ tay xin hàng đi còn kịp! 🥊"
        ],
        winQuotes: [
            {
                c: "Thần Long giáng thế vô địch!",
                s: "Johnny Trí Nguyễn cưỡi rồng vàng quét sạch sàn đấu, tiễn {enemy} nhập viện trong 1 nốt nhạc! 🐉👑"
            },
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
                c: "Đang diễn cảnh quay thử thôi!",
                s: "Đạo diễn chưa bấm máy, hiệp sau đóng thật là {enemy} chỉ có nước khóc thét! 🎬"
            },
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

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan ra đòn {enemy}! Nhìn cái bộ tấn hai chân chụm vào nhau của mày là biết học võ cấp tốc qua mạng TikTok 3 ngày rồi! 🥊😂",
            "Đứng im chỉnh lại khớp cổ tay đi {enemy}! Đây là sàn thực chiến Liên Phong chứ không phải phim trường đâu, không có diễn viên đóng thế ăn đòn hộ mày đâu! 🎬🔥",
            "Ê {enemy}, ngầu cỡ Phong Bụi Đời Chợ Lớn như anh còn phải khởi động kỹ, mày tay ngang bụng bự thế kia chịu nổi mấy cú phang ống quyển? 🦵💥",
            "Bình tĩnh nào {enemy}! Chắp tay chào võ đạo lịch sự cái đã, rồi lát anh nắn lại xương hàm lệch cho mày hoàn toàn miễn phí! 🙏😎",
            "Từ từ {enemy}! Vừa dựng con mô tô phân khối lớn Ducati ngoài cửa xong, đánh lẹ trong 1 hiệp để anh còn đi tua phượt chiều nay! 🏍️💨",
            "Nhìn mắt {enemy} chớp liên tục lúc anh nhứ đòn kìa, tâm lý yếu thế này bước vào lồng bát giác MMA là tự xỉu trước khi ăn đấm đấy! 🐉😏"
        ],
        replyOpening: [
            "Khí thế gáy cũng ra gì đấy {enemy}, nhưng lúc vung tay thì hở nguyên vùng cằm chữ V mời gọi anh đấm móc kìa chú em! 🥊🤣",
            "Ồ {enemy} thích xài võ mồm hả? Trong Dòng Máu Anh Hùng với Bẫy Rồng mấy thằng sủa to nhất toàn bị anh quật cắm đầu xuống chiếu đầu tiên! 🐉😈",
            "Bớt múa may quay cuồng làm màu đi {enemy} ơi! Hoa quyền thêu cước gặp một đòn chỏ lật thực chiến của anh là tắt điện toàn tập! 💪⚡",
            "Nghe {enemy} dọa mà anh ngứa nghề chỉ đạo võ thuật quá! Lại đây anh dạy cho bài nhập môn: Cách tiếp đất bằng mặt êm ái nhất! 🎬😂",
            "Cứ gồng cứng cả người lên thế {enemy}, càng gồng cứng anh phang Low Kick vào đùi non càng thấm đau thấu trời xanh đấy! 🦵🔥",
            "Thôi khỏi cần trọng tài dặn luật bảo hộ đâu, với cái mồm hỗn hào của {enemy} thì hôm nay anh đánh full 10 thành công lực! 🥊😤"
        ],
        midFight: [
            "Khoan dừng tay 2 giây {enemy}! Đấy thấy chưa, anh mới nhá nhẹ chân trước mà hai tay mày đã che đầu rối loạn hết cả đội hình rồi! 🥊😂",
            "Ê {enemy}, cái đùi trái bị anh phang 3 cú nãy giờ tê rần đi cà nhắc rồi đúng không? Võ thật nó buốt tận tủy chứ không êm như phim đâu! 🦵💥",
            "Đứng lại thở đều bằng mũi đi {enemy} ơi! Há hốc mồm thở dốc thế kia dính một cú đấm thẳng là rớt hàm bảo hộ răng ngay! 😬🤣",
            "Từ từ nào {enemy}! Sao lao vào ôm vật ngây thơ thế, quên mất anh là bậc thầy khóa siết địa chiến Jiu-Jitsu trên sàn MMA à? 🤼‍♂️😎",
            "Nhìn {enemy} quờ quạng trong tuyệt vọng kìa, tốc độ ra đòn của mày chậm đến mức anh kịp né sang bên uống ngụm nước rồi đấm trả! ⚡💨",
            "Có cần anh hô 'CẮT' cho nhân viên y tế vào xịt thuốc tê lạnh lên mặt không {enemy}, sưng vù như cái bánh bao chiều rồi kìa! 🎬🏥"
        ],
        climax: [
            "Hết trụ vững nổi trên hai chân rồi nhé {enemy}! Chuẩn bị đón nhận tuyệt kỹ Liên Phong Vô Ảnh Cước kết thúc trận đấu! 🐉🔥",
            "Hai tay rũ xuống không che nổi mặt nữa rồi hả {enemy}? Góc độ hoàn hảo cho một cú gối bay Flying Knee chuẩn sách giáo khoa! 🦵💀",
            "Đừng cố gượng dậy làm gì {enemy} ơi, trọng tài đang cầm sẵn khăn trắng chuẩn bị ném vào lồng cứu mạng mày rồi kìa! 🏳️😈",
            "Một pha dứt điểm Knock-out kỹ thuật đẹp như tranh vẽ để đưa vào thước phim hành động kinh điển chiều nay! 🎬⚡",
            "Chắp tay niệm câu bình an đi {enemy}, cơn lốc liên hoàn cước cuối cùng này không có nút phanh đâu chú em! 🌪️🥊"
        ],
        finisher: [
            "Knock-out tuyệt đối! Cúi chào võ đạo chuẩn mực bên cạnh {enemy}, cảm ơn vì buổi đấu tập làm nóng gân cốt! 🙏🥊",
            "Đẳng cấp thực chiến Liên Phong lên tiếng! Không cần kỹ xảo dây cáp, {enemy} vẫn bay xa ba thước nằm thẳng cẳng! 🐉🏆",
            "Xong cảnh quay hành động một đúp ăn ngay! Anh đội mũ bảo hiểm lên mô tô Ducati đi đây, chúc {enemy} bó bột mau lành! 🏍️😎",
            "Dòng Máu Anh Hùng bất diệt! Hy vọng sau trận thua tâm phục khẩu phục này {enemy} sẽ bỏ tật múa võ mồm trên mạng! 🔥👑"
        ]
    },

    // 🟢 ULTIMATE: Triệu hồi UniversalSkillEngine thi triển chiêu thức theo mô tả
    executeUltimate: function(caster, target, baseDmg) {
        if (window.UniversalSkillEngine && typeof window.UniversalSkillEngine.executeFromDescription === 'function') {
            window.UniversalSkillEngine.executeFromDescription(
                caster, target, baseDmg,
                this.skillPrompt || (this.skill && this.skill.description),
                (this.skill && this.skill.name) || this.skillName
            );
        }
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
