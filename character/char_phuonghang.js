// ==========================================
// CHAR_PHUONGHANG.JS - CEO NGUYỄN PHƯƠNG HẰNG (BÃO LIVESTREAM & KIM CƯƠNG)
// ==========================================

window.currentLoadedChar = {
    id: "phuonghang",
    className: "Phuong Hang",
    hp: 1250, speed: 5, dmgMod: 1.8, color: "#e84393",
    avatarUrl: "character/picture/phuonghang.png",
    voiceUrl: "character/voice/phuonghang.wav",
    skillPrompt: "lãnh địa livestream triệu view đại nam, mưa bão ném kim cương hột xoàn sổ đỏ giấy sao kê 💎 📱 💵 📄, chọi bể đầu choáng sát thương x4.3",
    skill: {
        name: "ĐẠI CHIẾN SAO KÊ: MƯA KIM CƯƠNG HỘT XOÀN & GIẤC MƠ TRIỆU VIEW",
        icon: "💎",
        description: "Bật camera Livestream chấn động hàng triệu view mở ra lãnh địa Đại Nam, vung tay ném cơn bão kim cương hột xoàn kích cỡ nắm tay chọi vỡ đầu đối thủ, dội mưa sổ đỏ và hàng ngàn trang giấy sao kê đè bẹp hoàn toàn danh dự kẻ thù!",
        skillPrompt: "lãnh địa livestream triệu view đại nam, mưa bão ném kim cương hột xoàn sổ đỏ giấy sao kê 💎 📱 💵 📄, chọi bể đầu choáng sát thương x4.3"
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Chuyến Du Ngoạn Săn Kim Cương Sổ Đỏ",
            "quote": "Một chuyến du lịch khám phá thế giới sang chảnh! Quái vật nào dám cản đường chị mở livestream bão kim cương luôn!",
            "specialLoot": "Viên Kim Cương Nước D 💎",
            "statBonusDesc": "+18% Mưa tiền gây lóa mắt & Hồi phục sinh lực"
    },
    battleCries: {
            "intro": [
                    "📢 Bão Livestream triệu view bắt đầu!",
                    "💎 Kim cương cân ký sổ đỏ cân đoạn!",
                    "🔮 Đêm qua tôi nằm mơ thấy {enemy} nằm sàn!"
            ],
            "finisher": [
                    "💎 KIM CƯƠNG 50 CARAT ĐÈ BẸP DẸP LÉP!",
                    "📄 KIM CƯƠNG MINH BẠCH TẬN TAY ĐỐI THỦ!",
                    "📢 BÓC PHỐT KHÔNG KỊP VUỐT MẶT {enemy}!"
            ],
            "parry": [
                    "💍 Hột xoàn 50 carat làm lóa mắt đối thủ!",
                    "🔮 Giấc mơ tiên tri né sạch đòn đánh!"
            ],
            "ult": [
                    "💎 ĐẠI HỘI KIM CƯƠNG & BÃO KIM CƯƠNG TỶ ĐÔ!",
                    "📢 PHIÊN LIVESTREAM BẤT HỦ TRIỆU MẮT XEM!"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA CEO PHƯƠNG HẰNG
    // ==========================================
    trashTalk: {
        chapters: [
            "GIẤC MƠ NÓI RỒI: KIM CƯƠNG CHỌI BỂ ĐẦU {enemy}! 💎",
            "BÃO LIVESTREAM KỶ LỤC: GỌI THẲNG TÊN {enemy} LÊN SÓNG! 📢",
            "KIM CƯƠNG CÂN KÝ & SỔ ĐỎ CÂN ĐOẠN ĐÈ BẸP {enemy} 💎",
            "ĐÊM QUA TÔI NẰM MƠ THẤY {enemy} NẰM SÀN! 🔮",
            "SAO KÊ MINH BẠCH: QUÉT SẠCH CÂY MÁU CỦA {enemy} 📄"
        ],
        midMatch: [
            "Quý vị thấy không! Kim cương hột xoàn của em chọi bể đầu thằng {enemy} ngay trên sóng Livestream! 📱",
            "Quý vị ơi! Đêm qua tôi vừa nằm mơ thấy {enemy} bị tôi vả không trượt phát nào! 🔮📢",
            "Kim cương của tôi tính bằng ký, sổ đỏ tính bằng sấp, lấy đè lên người {enemy} là tắt thở! 💎📕",
            "Đứng im đấy {enemy}! Hôm nay tôi mở Livestream bóc trần toàn bộ thanh máu của {enemy}! 📱",
            "Dĩ vãng dơ dáy dễ gì giấu giếm hả {enemy}, mau nộp bản sao kê sát thương ra đây! 📄🔥",
            "Nhìn viên hột xoàn 50 carat trên tay tôi có làm {enemy} lóa mắt không? 💍✨",
            "Thư ký đâu! Bật nhạc remix lên cho tôi combat với {enemy} tới sáng luôn! 🎶💃"
        ],
        winQuotes: [
            {
                c: "Sao kê rõ ràng minh bạch!",
                s: "Bà Phương Hằng vừa bóc trần dĩ vãng dơ dáy của {enemy} trước sự chứng kiến của 1 triệu view trực tiếp! 💎👑"
            },
            {
                c: "Phiên Livestream triệu mắt xem!",
                s: "CEO Phương Hằng vừa chốt hạ {enemy} ngay trên sóng trực tiếp trước sự chứng kiến của hàng triệu khán giả! 📢💎"
            },
            {
                c: "Lấy kim cương và sổ đỏ đè bẹp!",
                s: "Sức nặng từ bộ sưu tập hột xoàn hàng hiệu đã khiến {enemy} tâm phục khẩu phục! 💍📕"
            },
            {
                c: "Giấc mơ tiên tri chuẩn 100%!",
                s: "Đúng như giấc chiêm bao tối qua, {enemy} đã không trụ nổi quá một hiệp đấu! 🔮"
            }
        ],
        loseQuotes: [
            {
                c: "Mạng 4G Đại Nam đang bị nghẽn sóng!",
                s: "Đang livestream thì bị báo cáo vi phạm tiêu chuẩn cộng đồng, hiệp sau lên sóng là {enemy} bay màu! 🌐"
            },
            {
                c: "Mạng Wifi phòng Livestream bị nghẽn!",
                s: "Do có quá nhiều người tràn vào xem cùng lúc làm sập đường truyền thôi, hẹn {enemy} buổi phát sóng tối mai! 📱"
            },
            {
                c: "Đeo nhiều nhẫn kim cương nặng tay quá!",
                s: "Mỗi ngón đeo một viên hột xoàn to đùng nên vung tay hơi mỏi, tháo bớt trang sức là {enemy} tới số! 💎"
            }
        ]
    },

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Quý vị ơi vào xem đông đủ giùm tôi!! Đêm qua tôi vừa nằm chiêm bao thấy {enemy} hôm nay lên sàn bị tôi vả sấp mặt quý vị ơi! 🔮📢",
            "Khoan đánh đã {enemy}! Thư ký Nhi đâu, bê nguyên cái rổ hột xoàn 50 carat với xấp sổ đỏ cân ký ra đây cho nó lóa mắt coi! 💎📕",
            "Đứng im đó {enemy}! Dĩ vãng dơ dáy dễ gì giấu giếm, hôm nay tôi chính thức gọi thẳng tên {enemy} lên sóng Livestream triệu mắt xem! 📱🔥",
            "Ê {enemy}, trước khi bước lên đây đã sao kê minh bạch 18 trang giấy A4 lượng máu của mình chưa mà dám lớn tiếng với bà Hằng? 📄😎",
            "Từ từ quý vị ơi! Bật nhạc DJ Remix căng đét lên cho tôi vừa nhún nhảy vừa bóc trần cái trình độ rởm đời của {enemy} nào! 🎶💃",
            "Nhìn {enemy} là biết dân chơi hệ pha-ke rồi, đụng vào hàng thật kim cương thật Đại Nam là nát bét nha con! 💍✨"
        ],
        replyOpening: [
            "Trời ơi quý vị nghe {enemy} nó nổ kìa!! Tôi cười muốn rớt luôn cái vương miện hột xoàn tiền tỷ trên đầu xuống đất luôn á! 👑🤣",
            "Gáy to dữ thần hôn {enemy}! Đợi tôi lật cuốn sổ thiên tạng dày 500 trang ra đọc đúng trang tiểu sử ăn hại của mày cho thiên hạ nghe nhé! 📖😈",
            "Đừng có hù bà Hằng này nha {enemy}! Một mình tôi chấp hết nguyên bầy, cỡ mày chỉ là cái tên phụ lướt qua giấc mơ trưa của tôi thôi! 🔮💅",
            "Mồm miệng {enemy} lẻo mép ghê chưa! Để tôi lấy xấp sổ đỏ đất mặt tiền quật tơi bời xem mồm còn cứng hơn giấy chứng nhận quyền sử dụng đất không! 📕💥",
            "Thôi bớt diễn kịch nước mắt cá sấu đi {enemy} ơi! Khán giả trên kênh của tôi nhìn thấu tim đen cái thanh máu yếu nhớt của mày rồi! 📱😂",
            "Cứ sủa tiếp đi {enemy}, trợ lý của tôi đang quay màn hình 10 máy điện thoại lưu bằng chứng lát tiễn mày về vườn luôn! 📸🔥"
        ],
        midFight: [
            "Khoan dừng nhạc 2 giây thư ký ơi! Sao mới chọi nhẹ vài viên kim cương vào trán mà {enemy} đã choáng váng quay cuồng thế kia quý vị? 💎😂",
            "Ê {enemy}, sao im thin thít tắt đài luôn rồi? Hồi đầu trận gáy vang trời lắm mà giờ thở oxy hổn hển tội nghiệp dữ vậy! 📢🤣",
            "Đứng lại đó {enemy}! Đừng có chạy trốn khỏi khung hình Livestream, 2 triệu người đang vỗ tay xem tôi chốt sổ thanh máu của mày kìa! 📱👀",
            "Từ từ cho tôi uống miếng nước suối lấy hơi chửi tiếp coi {enemy}! Vừa đánh vừa giảng đạo lý cho mày nghe hao tổn nguyên khí quá! 💧💃",
            "Nhìn {enemy} đỡ đòn kìa quý vị ơi, yếu như sên mà bày đặt ra gió, đúng y chang trong giấc mơ tối hôm qua của tôi không trượt chữ nào! 🔮😎",
            "Sao thế {enemy}? Bị bão sao kê giấy tờ đập trúng mặt tối tăm mặt mũi không thấy đường về nhà luôn rồi hả? 📄🌪️"
        ],
        climax: [
            "Tới hồi kết của bộ phim truyền hình dài tập rồi nha quý vị! {enemy} còn đúng cái nịt máu cuối cùng đang run lẩy bẩy kìa! 📢😈",
            "Chốt hạ kèo này luôn thư ký ơi! Lấy viên kim cương bự nhất két sắt Đại Nam ném dứt điểm cho {enemy} tâm phục khẩu phục! 💍💥",
            "Đừng có quỳ xuống xin tắt Livestream muộn rồi {enemy} ơi, dĩ vãng thua cuộc hôm nay lưu vĩnh viễn trên mạng xã hội nhé! 📱💀",
            "Giấc mơ tiên tri chuẩn xác 1000%! Còn 3 giây nữa là {enemy} chính thức nằm đo ván đúng tư thế tôi thấy trong mơ! 🔮🔥",
            "Lên nhạc chốt đơn tiễn khách nào DJ! Tặng {enemy} một vé VIP đi nghỉ dưỡng bệnh viện miễn phí không hẹn ngày tái ngộ! 🎶🚑"
        ],
        finisher: [
            "Tắt sóng Livestream đại thắng! Cảm ơn hàng triệu quý vị khán giả đã chứng kiến {enemy} bị đè bẹp dưới núi kim cương! 💎👑",
            "Giấc chiêm bao linh ứng tuyệt đối! {enemy} đã chính thức nộp đủ sao kê 100% thanh máu và nằm im thin thít! 📄🔮",
            "Thư ký thu dọn nhẫn hột xoàn với sổ đỏ về két! Một buổi phát sóng quá cảm xúc, tạm biệt chú hề {enemy} nhé! 📕💃",
            "Chốt sổ thành công mỹ mãn! Chúc {enemy} nằm dưới sàn nghe nhạc Remix vui vẻ, bà Hằng đi nghỉ ngơi dưỡng nhan đây! 🎶✨"
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

        // 1. VẼ THÂN (Mặc váy/vest dạ hội màu Đỏ Ruby / Hồng đậm sang trọng)
        ctx.strokeStyle = "#d63031";
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();

        // 2. VẼ CHÂN TAY
        ctx.strokeStyle = "#ff7675";
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);

        // 3. VẼ ĐẦU NHÂN VẬT DÙNG CHUNG
        window.drawAvatarHead(ctx, head, p, isTrail, 38);

        // 4. VŨ KHÍ: CẦM VIÊN KIM CƯƠNG "HÀNG KÝ" PHÁT SÁNG TRÊN TAY PHẢI
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = isTrail ? 0 : 15;
        ctx.shadowColor = "#ffffff";

        ctx.beginPath();
        ctx.moveTo(handR.x, handR.y - 10);
        ctx.lineTo(handR.x + 8, handR.y - 2);
        ctx.lineTo(handR.x, handR.y + 12);
        ctx.lineTo(handR.x - 8, handR.y - 2);
        ctx.closePath();
        ctx.fill();

        // 5. VẼ BÀN TAY / BÀN CHÂN
        ctx.shadowBlur = 0; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 3, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["phuonghang"] = window.currentLoadedChar;
