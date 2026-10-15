// ==========================================
// CHAR_BILLGATES.JS - KỸ NĂNG REAL-TIME & ĐẠI TIỆC TRASH TALK TỶ ĐÔ
// ĐÃ FIX:
// 1. Khôi phục vẽ trực tiếp ảnh đầu PNG nguyên bản (Không bị vòng tròn cắt mất mặt/tóc).
// 2. Nâng cấp hơn 50 câu Trash Talk (Intro, Giữa trận, Thắng, Thua) + Tự động trộn ngẫu nhiên mỗi trận!
// ==========================================

// Hàm trộn ngẫu nhiên mảng để mỗi trận Bill Gates gáy những câu hoàn toàn khác nhau
const shuffleBillGatesLines = (arr) => {
    let copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/39n8XdgJ/Generated-Image-July-05-2026-8-47-PM.png",
    skill: { name: "BSOD HACK" },

    // ==========================================
    // 🗣️ SIÊU KHO TRASH TALK & CÂU CHỐT HẠ CỦA CHỦ TỊCH BILL GATES
    // ==========================================
    trashTalk: {
        // 10 Tên chương hiện ở màn hình Intro đầu video
        chapters: shuffleBillGatesLines([
            "KÈO TỶ ĐÔ: VẢ VỠ MÀN HÌNH XANH 💻",
            "CHƯƠNG ĐẶC BIỆT: TƯ BẢN ĐI ĐẤM NHAU 💵",
            "TRUY QUÉT: {enemy} XÀI WINDOWS LẬU! 🚨",
            "PHÁP SƯ CÔNG NGHỆ VS {enemy} ⚡",
            "KHI CHỦ TỊCH MICROSOFT NỔI GIẬN 🪟",
            "ĐẬP TIỀN VÀO MẶT {enemy} ĐẾN KHI NẰM SÀN 💰",
            "CẬP NHẬT WINDOWS: XÓA SỔ {enemy} 🔄",
            "TỶ PHÚ THƯỢNG ĐÀI: AI CỨU NỔI {enemy}? 👑",
            "LỖI HỆ THỐNG 404: KHÔNG TÌM THẤY CỬA THẮNG CHO {enemy} 💀",
            "NGOẠI TRUYỆN: BÀI HỌC ĐẦU TƯ CHO {enemy} 📈"
        ]),

        // 22 Câu gáy khét lẹt trong lúc đánh nhau (Đã tự động trộn ngẫu nhiên)
        midMatch: shuffleBillGatesLines([
            "Ê {enemy}! Mày đang xài Windows lậu chưa Active đúng không? Đứng im tao kiểm tra! 💻",
            "Tài sản của tao đè bẹp cả cây máu của mày đấy {enemy} ơi! Nhìn tiền rơi mà khóc đi! 💵",
            "Mạng nhà mày lag à {enemy}? Để tao mua đứt nhà mạng rồi cắt cáp nhà mày luôn nhé! 🌐",
            "Đừng làm tao nóng! Tao mua luôn cái game này rồi xóa acc thằng {enemy} bây giờ! 👺",
            "Mỗi giây tao đứng đấm nhau với mày là tao kiếm thêm được 1 triệu đô đấy {enemy} ạ! 🤑",
            "Nhìn mặt thằng {enemy} đơ như máy tính dính màn hình xanh thế kia 😂🪟",
            "Mày thích nhảy nhót không {enemy}? Tao lập bảng Excel tính sẵn 1000 cách vả vỡ mồm mày rồi! 📊",
            "Bấm Alt + F4 rồi đi ngủ đi {enemy} ơi, tầm này đánh đấm gì nữa! ⌨️",
            "Máu của mày tụt nhanh hơn cả cổ phiếu lúc tao xả hàng đấy {enemy}! 📉",
            "Để tao gọi đội kỹ thuật cài lại não cho thằng {enemy}, chứ đánh ngáo quá rồi! 🧠",
            "Cẩn thận nhé {enemy}, tao vừa đặt lịch ép máy mày Update Windows 11 giữa trận đấy! 🔄",
            "Tao làm từ thiện mấy chục tỷ đô còn không tiếc, nhưng cho {enemy} 1 máu thì KHÔNG BAO GIỜ! 💸",
            "Mày dùng chuột bi đời Tống hay sao mà ra đòn chậm rì vậy hả {enemy}? 🖱️",
            "Đỡ thử пачка tiền đô la mệnh giá 100$ này xem có gãy răng không {enemy}! 💵💥",
            "Hệ điều hành của {enemy} quá cổ lỗ sĩ, chuẩn bịFormat ổ C đi là vừa! 💾",
            "Đứng im cho tao quét Virus nhân phẩm cái coi nào {enemy}! 🛡️",
            "Cỡ {enemy} nộp CV vào công ty tao làm bảo vệ tao còn đánh trượt từ vòng gửi xe! 🏢",
            "Bật Task Manager lên rồi chọn End Task cuộc đời mày đi {enemy} ơi! 💀",
            "Đánh với tao mà không nạp VIP à {enemy}? Nghèo thì đừng có đòi hỏi công bằng! 💎",
            "Một cú đấm của tao bằng cả GDP xóm nhà mày cộng lại đấy {enemy}! 🌍",
            "Tưởng {enemy} thế nào, hóa ra chỉ là bản dùng thử 30 ngày chưa nhập Key! 🔑",
            "Mày có nghe tiếng quạt tản nhiệt kêu không {enemy}? Là tiếng mồm mày đang thở oxy đấy! 💨"
        ]),

        // 10 Câu chốt hạ khi Bill Gates THẮNG ở màn hình Outro
        winQuotes: [
            { 
                c: "Tư bản luôn chiến thắng!", 
                s: "Bill Gates vừa lấy tiền đè chết {enemy}. Cảm ơn phần mềm diệt virus đã tài trợ trận đấu này! 💵" 
            },
            { 
                c: "Màn Hình Xanh Tử Thần (BSOD)!", 
                s: "Não của {enemy} đã bị lỗi hệ điều hành sau cú vả tỷ đô từ ngài Bill Gates! 💻" 
            },
            { 
                c: "Activate Windows đi em trai!", 
                s: "{enemy} thua là phải, ai bảo đánh nhau với chủ tịch Microsoft mà dám xài bản Crack!" 
            },
            { 
                c: "Đã chuyển vào Thùng Rác (Recycle Bin)!", 
                s: "Bill Gates vừa bấm Shift + Delete xóa vĩnh viễn {enemy} khỏi bản đồ thế giới! 🗑️" 
            },
            { 
                c: "Thương vụ đầu tư siêu lợi nhuận!", 
                s: "Bỏ ra vài giây múa phím, ngài Chủ tịch đã thu về nguyên cái xác của {enemy}! 📈" 
            },
            { 
                c: "Ctrl + Z cũng không cứu được mày!", 
                s: "{enemy} muốn xin đánh lại từ đầu nhưng Bill Gates đã khóa luôn bàn phím! ⌨️" 
            },
            { 
                c: "Quỹ từ thiện Bill & Melinda tài trợ!", 
                s: "Bill Gates vừa phát từ thiện cho {enemy} một vé về thẳng bệnh viện Chợ Rẫy! 🏥" 
            },
            { 
                c: "Cấu hình quá yếu đòi chạy đồ họa cao!", 
                s: "Sức mạnh của {enemy} chỉ ngang máy tính Pentium 4, gặp siêu máy tính Bill Gates là bốc khói! 🔥" 
            },
            { 
                c: "Đã xuất báo cáo ra file Excel!", 
                s: "Tổng kết trận đấu: Bill Gates lãi 100% danh tiếng, còn {enemy} âm sạch điểm xã hội! 📊" 
            },
            { 
                c: "Mua đứt luôn đối thủ!", 
                s: "Đánh thắng xong Bill Gates viết luôn tờ ngân phiếu mua {enemy} về làm osin dọn vườn! 💰" 
            }
        ],

        // 10 Câu biện minh hài hước khi Bill Gates THUA ở màn hình Outro
        loseQuotes: [
            { 
                c: "Đang đánh thì máy bắt Update Win 11!", 
                s: "Bill Gates chưa kịp tung chiêu cuối thì máy tự khởi động lại để cập nhật. Hẹn {enemy} kèo sau! 🔄" 
            },
            { 
                c: "Tại vừa chia tài sản cho vợ cũ!", 
                s: "Mất nửa thanh máu cho vụ ly hôn nghìn tỷ nên hơi đuối, để bán thêm cổ phiếu rồi quay lại phục thù {enemy}!" 
            },
            { 
                c: "Lỗi bàn phím cơ 50 triệu!", 
                s: "Nói chung là kẹt nút Ctrl+Alt+Del thôi, chứ tầm {enemy} tuổi gì đòi ăn được Chủ tịch!" 
            },
            { 
                c: "Đang bận nhìn bảng chứng khoán!", 
                s: "Vừa quay sang chốt lời cổ phiếu Microsoft có 2 giây mà {enemy} đã đánh lén. Chơi thế ai chơi! 📉" 
            },
            { 
                c: "Nhường cho {enemy} đỡ tủi thân!", 
                s: "Người giàu thường hay làm từ thiện, hôm nay Chủ tịch bố thí cho {enemy} 1 trận thắng đấy! 💸" 
            },
            { 
                c: "Trình duyệt Internet Explorer bị đơ!", 
                s: "Lệnh tung chiêu bấm từ hôm qua nhưng do xài mạng IE nên hôm nay chưa kịp nổ. {enemy} ăn may thôi! 🌐" 
            },
            { 
                c: "Bị cá mập cắn đứt cáp quang biển!", 
                s: "Ping nhảy lên 9999ms đúng lúc chuẩn bị kết liễu {enemy}. Đợi tao mua tàu ngầm xuống nối cáp rồi tính sổ! 🦈" 
            },
            { 
                c: "Quên cắm sạc chiếc Laptop Gaming!", 
                s: "Máy sập nguồn ở 1% pin đúng pha quyết định, {enemy} nhớ mặt tao đấy! 🔋" 
            },
            { 
                c: "Thư ký gọi điện báo có họp cổ đông!", 
                s: "Bận đi ký hợp đồng 10 tỷ đô nên giả vờ nằm xuống nghỉ ngơi tí thôi nhé {enemy}! 💼" 
            },
            { 
                c: "Chơi bằng Touchpad nên trượt tay!", 
                s: "Quên mang chuột rời nên vuốt nhầm nút, tập 2 mang chuột văn phòng ra vả {enemy} không trượt phát nào! 🖱️" 
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
            text: "💻 BSOD HACK!", 
            color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.4, 
            font: "900 20px Arial", life: 48, scale: 1.15, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        if (typeof window.playSound === 'function') window.playSound(600, 'sine', 0.2, 0.4);

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            
            window.shakeScreen(10, 8);
            if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.4, 0.8, true);
            
            if (typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#0984e3", true, 3.5, Math.PI / 4);
                window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#74b9ff", true, 3.5, -Math.PI / 4);
            }

            if (typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.0, "#0984e3", true, false, caster.isFacingRight);
            }

            if (typeof window.spawnCustomObj === 'function') {
                for (let k = 0; k < 6; k++) {
                    window.spawnCustomObj(
                        target.x + (Math.random() - 0.5) * 60, target.y - 40, 
                        (Math.random() - 0.5) * 12, -Math.random() * 15 - 5, 
                        "💵", "#2ecc71", "18px Arial", 45, true
                    );
                    if (k < 3) {
                        window.spawnCustomObj(
                            target.x + (Math.random() - 0.5) * 80, target.y - 60 + (Math.random() - 0.5) * 40, 
                            (Math.random() - 0.5) * 8, -Math.random() * 8, 
                            "🪟 ERROR", "#0984e3", "900 12px Arial", 35, false
                        );
                    }
                }
            }
            
            window.impactAberration = 5;
        }, 280);
    },

    // ==========================================
    // HỌA SĨ VẼ NHÂN VẬT (ĐÃ KHÔI PHỤC VẼ FULL ĐẦU PNG KHÔNG BỊ VÒNG TRÒN CẮT MẶT)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#2c3e50"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#34495e"; ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // VẼ TRỰC TIẾP ẢNH ĐẦU PNG NGUYÊN BẢN (KHÔNG CẮT VÒNG TRÒN, HIỂN THỊ HẾT TÓC & MẶT)
        let headSize = 34; 
        let currentAvatar = p.avatarUrl;
        if (!currentAvatar && p.classId && window.classStats && window.classStats[p.classId]) { currentAvatar = window.classStats[p.classId].avatarUrl; }
        if (!currentAvatar && window.currentLoadedChar) { currentAvatar = window.currentLoadedChar.avatarUrl; }

        if (currentAvatar) {
            if (!window.avatarImageCache) window.avatarImageCache = {};
            if (!window.avatarImageCache[currentAvatar]) {
                let img = new Image(); img.crossOrigin = "Anonymous"; img.src = currentAvatar; window.avatarImageCache[currentAvatar] = img;
            }
            let img = window.avatarImageCache[currentAvatar];
            if (img && img.complete && img.naturalWidth > 0) {
                let tilt = (p.headTilt !== undefined) ? p.headTilt : (p.vx || 0) * 0.05;
                ctx.save();
                ctx.translate(head.x, head.y - 4);
                ctx.rotate(tilt);
                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
                ctx.restore();
            } else { drawFallbackHead(); }
        } else { drawFallbackHead(); }

        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#ffddc1"; ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }

        // Vẽ máy tính bảng Surface / Sổ đỏ Màn hình xanh trên tay phải
        ctx.save(); ctx.translate(handR.x, handR.y); ctx.rotate(p.isFacingRight ? 0.2 : -0.2); 
        ctx.fillStyle = "#0984e3"; ctx.shadowBlur = isTrail ? 0 : 15; ctx.shadowColor = "#00cec9"; ctx.fillRect(-6, -8, 12, 16); 
        ctx.strokeStyle = "#2d3436"; ctx.lineWidth = 2; ctx.shadowBlur = 0; ctx.strokeRect(-6, -8, 12, 16); ctx.restore();
        
        ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
