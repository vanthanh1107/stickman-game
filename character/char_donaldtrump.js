// ==========================================
// CHAR_DONALDTRUMP.JS - DONALD TRUMP (YOU'RE FIRED! & BUILD THE WALL)
// ==========================================

window.currentLoadedChar = {
    id: "donaldtrump",
    className: "Donald Trump",
    hp: 1200, speed: 5, dmgMod: 1.8, color: "#e74c3c",
    avatarUrl: "character/picture/trump.png",
    voiceUrl: "character/voice/donaldtrump.wav",
    skillPrompt: "lãnh địa không gian bức tường the wall biên giới, thiên thạch khổng lồ đè giáng khối gạch thuế quan 200%, bão ném mưa tiền đô la đại bàng 🦅 💵 🧱 🇺🇸, sát thương x4.5",
    skill: {
        name: "MAKE AMERICA GREAT AGAIN: SIÊU THUẾ QUAN 200% & THE WALL",
        icon: "🦅",
        description: "Dựng lãnh địa bức tường biên giới The Wall sừng sững, thét vang câu nói thương hiệu 'YOU'RE FIRED!', giáng khối thiên thạch gạch thuế quan 200% khổng lồ đè bẹp đối thủ kèm bão đô la nghìn tỷ và đại bàng cất cánh.",
        skillPrompt: "lãnh địa không gian bức tường the wall biên giới, thiên thạch khổng lồ đè giáng khối gạch thuế quan 200%, bão ném mưa tiền đô la đại bàng 🦅 💵 🧱 🇺🇸, sát thương x4.5"
    },
    // ==========================================
    // 🎯 MỤC ĐÍCH RIÊNG & CÂU THOẠI CHIẾN ĐẤU (PORT TỪ BẢN LOCAL)
    // ==========================================
    quest: {
            "title": "Chuyến Công Du Xây Bức Tường Vĩ Đại",
            "quote": "Chúng ta sẽ vượt qua tất cả các ải này và biến nó thành một cuộc phiêu lưu vĩ đại nhất lịch sử, tin tôi đi!",
            "specialLoot": "Cục Gạch Vàng Thuế Quan 🧱",
            "statBonusDesc": "+20% Giáp phòng ngự & Đô la rơi vãi gây choáng"
    },
    battleCries: {
            "intro": [
                    "🦅 MAKE STICKMAN GREAT AGAIN!",
                    "🧱 Chuẩn bị nộp tiền xây tường đi con!",
                    "📰 Toàn là Fake News, tao bất bại!"
            ],
            "finisher": [
                    "🔥 YOU'RE FIRED! BỊ SA THẢI!",
                    "🧱 ĐÁNH THUẾ 200% VÀO MẶT {enemy}!",
                    "⛳ HOLE-IN-ONE VĂNG KHỎI SÀN ĐẤU!"
            ],
            "parry": [
                    "💵 Tiền đè chết người đỡ nhẹ hều!",
                    "🦅 Sắc lệnh Tổng Thống bác bỏ đòn đánh!"
            ],
            "ult": [
                    "🦅 SẮC LỆNH TỔNG THỐNG TỐI CAO BẤT KHẢ KHÁNG!",
                    "🧱 BỨC TƯỜNG GẠCH NGHÌN TỶ ĐÔ ĐÈ BẸP!"
            ]
    },


    // ==========================================
    // 🗣️ KHO TRASH TALK ĐỘC QUYỀN CỦA TỔNG THỐNG DONALD TRUMP
    // ==========================================
    trashTalk: {
        chapters: [
            "ĐÁNH THUẾ 200%: SA THẢI {enemy} KHỎI TRÁI ĐẤT! 🦅",
            "SẮC LỆNH TỔNG THỐNG: TRỤC XUẤT {enemy} KHỎI SÀN ĐẤU! 🦅",
            "XÂY TƯỜNG BIÊN GIỚI: NHỐT {enemy} NGOÀI VÒNG PHÁP LUẬT 🧱",
            "KÈO TỶ ĐÔ: ĐÁNH THUẾ 500% LÊN TOÀN BỘ MÁU CỦA {enemy} 💵",
            "YOU'RE FIRED: {enemy} CHÍNH THỨC BỊ SA THẢI! 🔥",
            "MAKE STICKMAN GREAT AGAIN: ĐÈ BẸP {enemy} 🇺🇸",
            "CÚ SWING GOLF LỊCH SỬ VẢ VỠ MỒM {enemy} ⛳"
        ],
        midMatch: [
            "YOU'RE FIRED! Đóng thuế quan 200% cho nước Mỹ rồi cút khỏi sàn đấu đi {enemy}! 🧱",
            "Tin giả! Fake News! Không đời nào có chuyện {enemy} đánh thắng được tao! 📰🚫",
            "Tao sẽ xây một bức tường gạch thật lớn ngay trên mặt {enemy}, và {enemy} phải trả tiền cho nó! 🧱",
            "Không ai hiểu rõ về võ thuật hơn tao cả, {enemy} chỉ là tay mơ thôi! 🦅",
            "Kể từ giây phút này, mỗi cú đấm của {enemy} sẽ bị áp thuế nhập khẩu 200%! 💵",
            "YOU'RE FIRED! Mày bị sa thải khỏi cái sàn đấu này rồi {enemy} ơi! 🔥",
            "Nhìn gậy Golf mạ vàng của tao đây này {enemy}, chuẩn bị làm bóng cho tao vụt nhé! ⛳",
            "Cỡ {enemy} đến tòa tháp Trump Tower của tao còn không qua nổi cửa an ninh! 🏢",
            "Đây sẽ là pha combo vĩ đại nhất lịch sử, chưa từng có ai làm được như tao đâu {enemy}! 🇺🇸",
            "Máu của {enemy} đang tụt thê thảm, một thảm họa thực sự! Sad! 📉",
            "Đội vệ sĩ Mật vụ Mỹ đâu, dọn dẹp cái bao cát {enemy} này khỏi đường đi của Tổng thống! 🕶️"
        ],
        winQuotes: [
            {
                c: "Make America Great Again!",
                s: "Ngài Donald Trump vừa xây tường The Wall đè bẹp {enemy} và bắt đối thủ phải trả tiền! 🦅💵"
            },
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
                c: "Gian lận bầu cử trắng trợn!",
                s: "Trump khẳng định đối thủ đã hack phiếu điểm số, chuẩn bị kháng cáo lên Tối Cao Pháp Viện! ⚖️"
            },
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

    // ==========================================
    // 🎭 KỊCH BẢN HỘI THOẠI STORY MODE (GIÀ DƠ & TOXIC VUI VẺ)
    // ==========================================
    storyDialogues: {
        opening: [
            "Khoan đánh đã! Tin giả! FAKE NEWS hoàn toàn! Bọn truyền thông lá cải dám đồn {enemy} có cửa thắng tao, chuyện hài hước nhất lịch sử nhân loại! 📰🚫",
            "Đứng im nghe Sắc Lệnh Tổng Thống mới ký sáng nay đây {enemy}: Áp thuế nhập khẩu 500% lên mọi cú đấm của mày, đánh tao 10 máu mày tự mất 50 máu! 💵🦅",
            "Ê {enemy}, tao sẽ xây một bức tường gạch khổng lồ vĩ đại nhất thế giới đè thẳng lên mặt mày... và chính ví tiền của mày phải thanh toán hóa đơn đó! 🧱😎",
            "Bình tĩnh nào {enemy}! Không một ai trên hành tinh này hiểu rõ về võ thuật đối kháng hơn Donald Trump cả, tin tao đi, ai cũng nói thế! 🇺🇸👌",
            "Từ từ {enemy}! Để các đặc vụ Mật vụ đeo kính đen kiểm tra xem trong người mày có giấu phiếu bầu gian lận nào không trước khi tao vung gậy Golf vàng! 🕶️⛳",
            "Nhìn bộ dạng thảm hại của {enemy} kìa, năng lượng quá thấp (Low Energy)! Đứng trước tòa tháp Trump Tower là bị bảo vệ đuổi từ vỉa hè rồi! 🏢😂"
        ],
        replyOpening: [
            "WRONG! Sai bét nhè rồi {enemy} ơi! Mồm mày mở ra câu nào là thảm họa thương mại câu đấy, quá tệ hại, cực kỳ đáng buồn! Sad! 🎙️😒",
            "Gáy to thế hả {enemy}? Mày đang đàm phán với bậc thầy 'Nghệ Thuật Đàm Phán' đấy, và hợp đồng hôm nay ghi rõ: Tao lấy cúp, mày lấy gạch! 🤝🧱",
            "Ồ {enemy} dám ngắt lời Tổng thống đang phát biểu à? YOU'RE FIRED! Mày chính thức bị sa thải khỏi cuộc đời ngay sau tiếng còi này! 🔥🫵",
            "Bớt bốc phét đi {enemy}! Hàng triệu người hâm mộ tuyệt vời nhất vừa gọi điện cho tao bảo rằng: 'Ngài Trump ơi hãy vả vỡ mồm nó đi'! 📞🇺🇸",
            "Nghe {enemy} hù mà mái tóc vàng bồng bềnh tỷ đô của tao chẳng bay lấy một sợi! Chuẩn bị làm quả bóng trắng cho tao vụt gậy sắt số 9 nhé! ⛳💥",
            "Cứ tiếp tục tung tin giả đi {enemy}, lát nữa tao ký lệnh trục xuất thẳng cổ mày ra khỏi biên giới bản đồ game không cho nhập cảnh lại! 🦅✍️"
        ],
        midFight: [
            "Khoan dừng cuộc họp báo 2 giây! Nhìn thanh máu của {enemy} đang lao dốc thẳng đứng như thị trường sụp đổ kìa, một thảm họa tồi tệ chưa từng có! 📉😂",
            "Ê {enemy}, sao đấm yếu như mèo cào thế? Bị hàng rào thuế quan 200% của tao chặn đứng ở hải quan mất hết sát thương rồi đúng không! 💵🤣",
            "Đứng lại tao hỏi {enemy}: Thấy những viên gạch biên giới Mỹ rơi trúng đầu có tuyệt vời không? Gạch loại 1 siêu cứng, rất đẹp, ai ăn xong cũng nằm im! 🧱👌",
            "Từ từ nào {enemy}! Cú vung tay vừa rồi của tao là cú đấm hoàn hảo nhất lịch sử võ đài, các giáo sư võ học nhìn thấy đều bật khóc vì quá đỉnh! 🥊🇺🇸",
            "Sao mếu máo đòi kiểm tra lại máu thế {enemy}? Đừng có học đòi trò kiện cáo gian lận của tao, kèo này tao thắng áp đảo hợp pháp 100% nhé! 🗳️😎",
            "Nhìn {enemy} lảo đảo tìm chỗ nấp kìa! Chuyên cơ Air Force One của tao đang nổ máy chờ ngoài sân, giải quyết lẹ để tao còn bay đi đánh Golf ở Florida! ✈️⛳"
        ],
        climax: [
            "Phiên điều trần kết thúc tại đây! {enemy} đã phá sản hoàn toàn thanh máu, nộp đơn xin bảo hộ phá sản Chương 11 cũng không kịp nữa đâu! 💼💀",
            "Nghe rõ hai chữ định mệnh này chưa {enemy}: YOU'RE FIRED!! Thu dọn răng lợi vào thùng các-tông và cút khỏi sàn đấu của tao ngay! 🔥🫵",
            "Bức tường vĩ đại chuẩn bị đặt viên gạch cuối cùng chôn sống tia hy vọng mong manh của chú hề {enemy}! 🧱😈",
            "Còn 1% máu thoi thóp à {enemy}? Kể cả bọn Fake News CNN có vào bình luận thiên vị thì cũng không cứu nổi cái mặt sưng vù của mày đâu! 📰🚫",
            "Ngắm chuẩn lỗ cờ số 18 ngay giữa trán {enemy} rồi... Một cú Swing gậy vàng Hole-in-One chấn động toàn cầu! ⛳⚡"
        ],
        finisher: [
            "MAKE STICKMAN GREAT AGAIN!! Giơ nắm đấm vẫy chào đám đông cuồng nhiệt, dưới chân là kẻ thất bại thảm hại {enemy}! 🇺🇸✊",
            "YOU'RE FIRED! Đã ký sắc lệnh đóng dấu đỏ trục xuất vĩnh viễn {enemy}, một chiến thắng vĩ đại chưa từng có trong lịch sử! 🦅✍️",
            "Thương vụ thế kỷ khép lại với lợi nhuận tuyệt đối! Cảm ơn {enemy} đã tự trả tiền viện phí và tiền gạch xây tường cho ngài Tổng thống! 🧱💵",
            "Hole-in-One tuyệt đẹp! Lên chuyên cơ Air Force One đi ăn gà rán uống Diet Coke ăn mừng thôi, tạm biệt kẻ thua cuộc {enemy}! ✈️🍔"
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
