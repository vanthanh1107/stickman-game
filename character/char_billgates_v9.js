// ==========================================
// CHAR_BILLGATES.JS - KỸ NĂNG REAL-TIME & TRASH TALK TỶ ĐÔ (BẢN TỐI ƯU V8.0)
// ĐÃ TỐI ƯU:
// 1. Hiện duy nhất 1 lần chữ "💻 BSOD HACK!" ngay khi kích hoạt, tung đòn sau 280ms không khựng hình.
// 2. Sử dụng window.drawAvatarHead của graphics.js (Tiết kiệm 25 dòng code, đầu tròn 3D sắc nét, lắc đầu theo nhạc).
// ==========================================

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/39n8XdgJ/Generated-Image-July-05-2026-8-47-PM.png",
    skill: { name: "BSOD HACK" },

    // 🗣️ BỘ TRASH TALK & CÂU CHỐT HẠ RIÊNG CỦA BILL GATES
    trashTalk: {
        chapters: [
            "KÈO TỶ ĐÔ: VẢ VỠ MÀN HÌNH XANH 💻",
            "CHƯƠNG ĐẶC BIỆT: TƯ BẢN ĐI ĐẤM NHAU 💵",
            "TRUY QUÉT: {enemy} XÀI WINDOWS LẬU! 🚨"
        ],
        midMatch: [
            "Ê {enemy}! Mày đang xài Windows lậu chưa Active đúng không? Đứng im tao kiểm tra! 💻",
            "Tài sản của tao đè bẹp cả cây máu của mày đấy {enemy} ơi! Nhìn tiền rơi mà khóc đi! 💵",
            "Mạng nhà mày lag à {enemy}? Để tao mua đứt nhà mạng rồi cắt cáp nhà mày luôn nhé! 🌐",
            "Đừng làm tao nóng! Tao mua luôn cái game này rồi xóa acc thằng {enemy} bây giờ! 👺"
        ],
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
            }
        ],
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

    // Họa Sĩ Vẽ Nhân Vật (Gọn nhẹ, dùng chung window.drawAvatarHead của graphics.js)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#2c3e50"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#34495e"; ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ đầu Avatar 3D tròn sắc nét và tự động nghiêng theo điệu nhảy
        if (typeof window.drawAvatarHead === 'function') {
            window.drawAvatarHead(ctx, head, p, isTrail, 34);
        }

        // Vẽ máy tính bảng Surface / Sổ đỏ Màn hình xanh trên tay phải
        ctx.save(); ctx.translate(handR.x, handR.y); ctx.rotate(p.isFacingRight ? 0.2 : -0.2); 
        ctx.fillStyle = "#0984e3"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#00cec9"; ctx.fillRect(-6, -8, 12, 16); 
        ctx.strokeStyle = "#2d3436"; ctx.lineWidth = 2; ctx.shadowBlur = 0; ctx.strokeRect(-6, -8, 12, 16); ctx.restore();
        
        ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI * 2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI * 2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI * 2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
