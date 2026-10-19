// ==========================================
// CHAR_STEVEJOBS.JS - KỸ NĂNG REAL-TIME & ĐẠI TIỆC TRASH TALK TÁO KHUYẾT
// ĐẶC TRƯNG:
// 1. Vẽ trực tiếp ảnh đầu PNG nguyên bản + Trang phục Áo cổ lọ đen & Quần Jeans xanh huyền thoại.
// 2. Hơn 50 câu Trash Talk chuẩn phong cách "Giáo chủ Apple" (Intro, Giữa trận, Thắng, Thua) + Tự động trộn ngẫu nhiên!
// ==========================================

// Sử dụng hàm trộn ngẫu nhiên dùng chung từ config_v3.js
const shuffleSteveJobsLines = (arr) => (typeof window.shuffleTrashTalk === 'function') ? window.shuffleTrashTalk(arr) : arr;

window.currentLoadedChar = {
    id: "stevejobs",
    className: "Steve Jobs",
    hp: 1080, speed: 6.2, dmgMod: 1.65, color: "#a29bfe",
    // Thay link ảnh đầu PNG Steve Jobs của bạn vào đây
    avatarUrl: "https://i.ibb.co/jPTcRhZ0/stevejob.png",
    skill: {
        name: "ONE MORE THING...",
        icon: "🍎",
        description: "Siêu phẩm Keynote cuối cùng: Hai vệt chém Titanium hoàn mỹ xé toạc đối thủ kèm mưa Táo Khuyết, sát thương x4."
    },

    // ==========================================
    // 🗣️ SIÊU KHO TRASH TALK & CÂU CHỐT HẠ CỦA GIÁO CHỦ STEVE JOBS
    // ==========================================
    trashTalk: {
        // 10 Tên chương hiện ở màn hình Intro đầu video
        chapters: shuffleSteveJobsLines([
            "SỰ KIỆN KEYNOTE: ĐỊNH NGHĨA LẠI CÁCH ĐẤM {enemy} 🍎",
            "ONE MORE THING: TIỄN {enemy} ĐĂNG XUẤT TRÁI ĐẤT 📱",
            "KÈO BÁN THẬN: {enemy} ĐỦ TIỀN ĐỠ ĐÒN KHÔNG? 💸",
            "BẢO VỆ MÔI TRƯỜNG: CẮT LUÔN CÂY MÁU CỦA {enemy} 🌱",
            "GIÁO CHỦ TÁO KHUYẾT VS {enemy} ⚡",
            "KHÓA ICLOUD MÕM CỦA {enemy} VĨNH VIỄN 🔒",
            "THIẾT KẾ TỐI GIẢN: TỐI GIẢN LUÔN MẠNG SỐNG {enemy} ✨",
            "BẢN CẬP NHẬT IOS MỚI: XÓA SỔ {enemy} 📲",
            "HỆ SINH THÁI ĐÓNG: KHÔNG CÓ CỬA THOÁT CHO {enemy} 🚪",
            "SIÊU PHẨM PRO MAX: VẢ VỠ MÀN HÌNH {enemy} 💥"
        ]),

        // 22 Câu gáy khét lẹt trong lúc đánh nhau (Đã tự động trộn ngẫu nhiên)
        midMatch: shuffleSteveJobsLines([
            "Nhìn giao diện của thằng {enemy} kìa, thiết kế nhựa rẻ tiền thế này mà cũng đòi lên sàn đấu à? 🍎",
            "Đứng im nào {enemy}! Tao đang 'định nghĩa lại' cách vả vỡ alo mày đây! ✨",
            "Mày còn đủ 2 quả thận để trả tiền viện phí sau trận này không đấy {enemy}? 🏥",
            "Vì mục tiêu bảo vệ môi trường, hôm nay tao cắt luôn bình oxy của thằng {enemy} khỏi hộp! 🌱🔌",
            "Máu của mày tụt còn nhanh hơn pin iPhone chai 50% đấy {enemy} ơi! 🔋",
            "Đừng cố kết nối với tao {enemy}, hệ sinh thái của tao không nhận Bluetooth từ mấy đứa cùi bắp! 🚫",
            "Một chiếc khăn lau màn hình của tao còn đắt hơn cả bộ giáp mày đang mặc đấy {enemy}! 🧻",
            "Đợi tí nhé {enemy}, câu chốt hạ 'One More Thing' của tao là tiễn mày về nơi chín suối đấy! ☝️",
            "Nhìn mặt thằng {enemy} đơ như máy dính iCloud ẩn thế kia, đọc mật khẩu đây tao mở khóa nhân phẩm cho! 🔒",
            "Cỡ {enemy} mà đem ra Apple Store đổi cũ lấy mới thì nhân viên bắt bù thêm 100 triệu! 🏪",
            "Thấy cú đấm vừa rồi mượt không {enemy}? Màn hình ProMotion 120Hz nó phải khác bọt thế đấy! 📱",
            "Bấm nút Home làm gì nữa {enemy}, tao khai tử nút Home giống như khai tử mày hôm nay rồi! 🔘",
            "Mày ra đòn rườm rà quá {enemy} ạ, để tao dạy mày thế nào là triết lý Tối Giản (Minimalism)! 🖤",
            "Cẩn thận xước khung viền Titanium của tao nhé {enemy}, cái đầu mày không đền nổi đâu! 🛡️",
            "Tao vừa bật AirDrop gửi tặng {enemy} 1000 tấn hành tươi nguyên chất, bấm Chấp Nhận lẹ đi! 🧅",
            "Sao thế {enemy}? Bị tao đánh cho quên luôn mật khẩu mở máy rồi à? 🧠",
            "Mày chỉ là bản nhái Trung Quốc giá rẻ, gặp hàng chính hãng California là tắt điện ngay {enemy} ạ! 🇺🇸",
            "Đánh nhau với tao mà không mua gói bảo hành AppleCare+ là dại rồi {enemy} ơi! 🚑",
            "Nhịp tim của mày đang báo động đỏ trên Apple Watch của tao kìa {enemy}, gọi cấp cứu sẵn đi! ⌚",
            "Cáp sạc tao còn bán lẻ thì đừng mơ tao khuyến mãi cho mày 1 giọt máu nào nhé {enemy}! 🔌",
            "Cấu hình của {enemy} chỉ đáng chạy hệ điều hành đời cổ, nâng cấp lên gặp tao là văng ứng dụng ngay! 💥",
            "Siri ơi, tìm đường ngắn nhất đưa thằng {enemy} vào nghĩa địa giúp tao cái! 🗣️"
        ]),

        // 10 Câu chốt hạ khi Steve Jobs THẮNG ở màn hình Outro
        winQuotes: [
            { 
                c: "One More Thing... Mày Đã Nằm Sàn!", 
                s: "Buổi lễ ra mắt sản phẩm kết thúc thành công, {enemy} chính thức trở thành phụ kiện lót đường cho Steve Jobs! 🍎" 
            },
            { 
                c: "Định Nghĩa Lại Sự Thất Bại!", 
                s: "Steve Jobs vừa trình làng công nghệ vả mặt hoàn toàn mới, khiến {enemy} tâm phục khẩu phục! ✨" 
            },
            { 
                c: "Đã Khóa iCloud Vĩnh Viễn!", 
                s: "{enemy} đã bị biến thành cục gạch đúng nghĩa đen sau chuỗi combo mượt mà chuẩn iOS! 🔒" 
            },
            { 
                c: "Bảo Vệ Môi Trường Thành Công!", 
                s: "Để giảm thiểu rác thải điện tử, ngài Steve Jobs đã dọn dẹp sạch sẽ {enemy} khỏi sàn đấu! 🌱" 
            },
            { 
                c: "Hai Quả Thận Cũng Không Cứu Nổi!", 
                s: "{enemy} định bán thận mua máu hồi sinh nhưng cửa hàng Apple đã đóng cửa nghỉ bán! 💸" 
            },
            { 
                c: "Thiết Kế Tối Giản Tuyệt Đối!", 
                s: "Steve Jobs vừa lược bỏ hoàn toàn thanh máu và lòng tự trọng của {enemy} chỉ bằng vài thao tác vuốt! 📱" 
            },
            { 
                c: "AirDrop Thành Công 1 Rổ Hành!", 
                s: "Tốc độ truyền tải sát thương vào mặt {enemy} nhanh gấp 10 lần công nghệ không dây hiện đại! 📡" 
            },
            { 
                c: "Không Tương Thích Với Đẳng Cấp Này!", 
                s: "Hệ điều hành của {enemy} quá lỗi thời, bị từ chối kết nối và văng thẳng khỏi trận đấu! 🚫" 
            },
            { 
                c: "Khung Viền Titanium Siêu Cứng!", 
                s: "{enemy} đấm gãy cả tay nhưng không làm xước nổi vạt áo cổ lọ đen của Giáo chủ Táo Khuyết! 🛡️" 
            },
            { 
                c: "Thu Cũ Đổi Mới Giá 0 Đồng!", 
                s: "Sau khi giám định ngoại hình bầm dập của {enemy}, Steve Jobs định giá đối thủ bằng đúng 0 xu! 🗑️" 
            }
        ],

        // 10 Câu biện minh hài hước khi Steve Jobs THUA ở màn hình Outro
        loseQuotes: [
            { 
                c: "Do Mày Cầm Máy Sai Cách Thôi!", 
                s: "Không phải Steve Jobs thua đâu, là do góc nhìn của {enemy} bị lệch sóng ăng-ten đấy! 📶" 
            },
            { 
                c: "Hết Pin Do Quên Mua Củ Sạc Rời!", 
                s: "Mở hộp ra không có sẵn củ sạc nên sập nguồn giữa chừng, hẹn {enemy} lúc nào sạc đầy 100% nhé! 🔌" 
            },
            { 
                c: "Đây Không Phải Thua, Đây Là Tính Năng!", 
                s: "Việc nằm dài trên sàn là một 'tính năng ẩn' đang được thử nghiệm, {enemy} đừng vội mừng! ✨" 
            },
            { 
                c: "Đang Bận Chuẩn Bị Slide Keynote!", 
                s: "Mải duyệt kịch bản ra mắt iPhone đời mới nên nhường sân khấu cho {enemy} diễn vài giây thôi! 🎤" 
            },
            { 
                c: "Siri Nghe Nhầm Lệnh Tung Chiêu!", 
                s: "Hô 'Đấm vỡ mồm {enemy}' mà Siri lại bật nhạc thư giãn, lỗi tại trợ lý ảo chứ không phải tại trình! 🗣️" 
            },
            { 
                c: "Màn Hình Bị Dính Nước Mưa!", 
                s: "Cảm ứng hơi loạn nhịp một chút ở pha cuối, để lấy khăn Apple 500k lau khô rồi vả lại {enemy}! 🧻" 
            },
            { 
                c: "Bản iOS Beta Nên Hơi Nóng Máy!", 
                s: "Đang chạy bản thử nghiệm nên giảm xung nhịp tí thôi, đợi bản chính thức thì {enemy} xác định! 🔥" 
            },
            { 
                c: "Nhường Cho Người Dùng Trải Nghiệm!", 
                s: "Cho {enemy} nếm thử cảm giác chiến thắng dùng thử 7 ngày, hết hạn là thu phí gấp đôi! 💳" 
            },
            { 
                c: "Bận Đi Chọn Áo Cổ Lọ Đen Mới!", 
                s: "Tủ đồ có 100 cái áo giống hệt nhau nên phân vân hơi lâu, {enemy} tranh thủ đánh lén nhanh thật! 👕" 
            },
            { 
                c: "Đứt Cáp Chuyển Đổi Type-C!", 
                s: "Quên mang cổng chuyển đổi nên chưa xuất được 100% công lực, {enemy} ăn may quá đấy! 🔗" 
            }
        ]
    },
    
    // 🟢 ULTIMATE REAL-TIME: Chạy ngay lập tức, chỉ hiện 1 lần tên Skill, không dừng hình
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'cast'; 
        caster.attackTimer = 36; 
        caster.vx = 0; 
        
        window.floatingTexts.push({ 
            x: caster.x, y: caster.y - 95, 
            text: "🍎 ONE MORE THING...", 
            color: "#ffffff", alpha: 1.0, vx: 0, vy: -1.4, 
            font: "900 20px Arial", life: 48, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        // Âm thanh kích hoạt thanh thoát chuẩn tiếng chuông Mac khởi động
        if (typeof window.playSound === 'function') window.playSound(659, 'sine', 0.25, 0.4);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            
            window.shakeScreen(10, 8);
            if (typeof window.playSound === 'function') window.playSound(240, 'triangle', 0.4, 0.8, true);
            
            // Hai vệt chém ánh sáng Titanium Bạc & Tím Keynote
            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#dfe6e9", true, 3.5, Math.PI / 4);
                window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#a29bfe", true, 3.5, -Math.PI / 4);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.0, "#a29bfe", true, false, caster.isFacingRight);
            }

            // Văng mưa Táo Khuyết và thông báo cắt củ sạc / trừ tiền
            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 60, target.y - 40, 
                        (Math.random() - 0.5) * 12, -Math.random() * 15 - 5, 
                        "🍎", "#f5f6fa", "18px Arial", 45, true
                    );
                    if (k < 3) {
                        window.spawnCustomObj(
                            target.x + (Math.random() - 0.5) * 80, target.y - 60 + (Math.random() - 0.5) * 40, 
                            (Math.random() - 0.5) * 8, -Math.random() * 8, 
                            "🔌 NO CHARGER", "#ff7675", "900 12px Arial", 35, false
                        );
                    }
                }
            }
            
            window.impactAberration = 5;
        }, 280);
    },

    // ==========================================
    // HỌA SĨ VẼ NHÂN VẬT (ÁO CỔ LỌ ĐEN + QUẦN JEANS XANH + IPHONE TITANIUM)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Thân áo cổ lọ đen huyền thoại (Black Turtleneck)
        ctx.strokeStyle = "#111111"; ctx.lineWidth = 6.5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y - 3); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. Quần Jeans xanh Levi's 501 ở 2 chân
        ctx.strokeStyle = "#2980b9"; ctx.lineWidth = 4.5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR);

        // 3. Tay áo cổ lọ đen
        ctx.strokeStyle = "#1e272e"; ctx.lineWidth = 4;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 4. VẼ ĐẦU AVATAR DÙNG HÀM CHUNG CỦA GRAPHICS.JS
        window.drawAvatarHead(ctx, head, p, isTrail, 34);

        // 5. Vẽ chiếc iPhone Pro Max Titanium phát sáng trên tay phải
        ctx.save(); ctx.translate(handR.x, handR.y); ctx.rotate(p.isFacingRight ? 0.2 : -0.2); 
        ctx.fillStyle = "#1e272e"; ctx.shadowBlur = isTrail ? 0 : 15; ctx.shadowColor = "#a29bfe"; ctx.fillRect(-5, -9, 10, 18); 
        ctx.strokeStyle = "#dfe6e9"; ctx.lineWidth = 1.8; ctx.shadowBlur = 0; ctx.strokeRect(-5, -9, 10, 18);
        // Cụm 3 mắt camera Pro Max
        ctx.fillStyle = "#dfe6e9"; ctx.fillRect(-3.5, -7, 3, 3);
        ctx.restore();
        
        // 6. Bàn tay & Giày thể thao New Balance màu xám bạc
        ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#bdc3c7";
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI * 2); ctx.fill();

        if (p.state === 'kick') { 
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 5.5, 0, Math.PI * 2); ctx.fill(); 
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["stevejobs"] = window.currentLoadedChar;
