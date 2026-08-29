// ==========================================
// CHAR_BILLGATES.JS - NHÂN VẬT BILL GATES (CHỈ CÓ AVATAR GỐC NGUYÊN BẢN)
// ==========================================

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/KzjRHBh8/Generated-Image-July-05-2026-8-47-PM.jpg",
    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái tung chiêu Màn Hình Xanh (BSOD)
        caster.state = 'bsod_hack'; 
        caster.attackTimer = 45; 
        caster.vx = 0; // Đứng yên để gõ phím/tung chiêu
        
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            // Tạo hiệu ứng chém/laze màu xanh dương đặc trưng của Windows BSOD
            if(typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#0984e3", true, 5.0, 0);
                window.spawnSlash(target.x, target.y - 50, !caster.isFacingRight, "#74b9ff", true, 4.0, 0);
            }
            if(typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.0, "#0984e3", true, false, caster);
            }
        }, 350);
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Vẽ Thân (Mặc áo len/vest màu xanh dương đậm)
        ctx.strokeStyle = "#2c3e50"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. Vẽ Chân tay
        ctx.strokeStyle = "#34495e"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // ==========================================
        // 3. VẼ ĐẦU NHÂN VẬT: 100% ẢNH GỐC, KHÔNG HIỆU ỨNG
        // ==========================================
        let headSize = 34; // Kích thước đầu
        let faceDir = p.isFacingRight ? 1 : -1;

        // Tự động tìm lại link ảnh nếu hệ thống quên truyền vào
        let currentAvatar = p.avatarUrl;
        if (!currentAvatar && p.classId && window.classStats && window.classStats[p.classId]) {
            currentAvatar = window.classStats[p.classId].avatarUrl;
        }
        if (!currentAvatar && window.currentLoadedChar) {
            currentAvatar = window.currentLoadedChar.avatarUrl;
        }

        if (currentAvatar) {
            // Tải và lưu cache ảnh
            if (!window.avatarImageCache) window.avatarImageCache = {};
            if (!window.avatarImageCache[currentAvatar]) {
                let img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = currentAvatar;
                window.avatarImageCache[currentAvatar] = img;
            }

            let img = window.avatarImageCache[currentAvatar];
            
            // Nếu ảnh tải xong, vẽ ảnh tròn
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.translate(head.x, head.y - 4); // Chỉnh tọa độ khớp với cổ
                
                // Cắt khung tròn
                ctx.beginPath();
                ctx.arc(0, 0, headSize / 2, 0, Math.PI * 2);
                ctx.clip();
                
                // Lót nền đen phòng ảnh bị trong suốt
                ctx.fillStyle = "#111";
                ctx.fill();

                // 🟢 IN ẢNH GỐC (Bỏ hoàn toàn Filter màu và Đổ bóng 3D)
                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
                
                ctx.restore();

                // VẼ CẶP MẮT KÍNH ĐÈ LÊN AVATAR CHO RA CHẤT BILL GATES
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"; 
                ctx.lineWidth = 1.5;
                ctx.strokeRect(head.x + faceDir * 1 - 4, head.y - 6, 6, 4);
                ctx.strokeRect(head.x + faceDir * 8 - 4, head.y - 6, 6, 4);
                ctx.beginPath(); ctx.moveTo(head.x + faceDir * 3, head.y - 4); ctx.lineTo(head.x + faceDir * 4, head.y - 4); ctx.stroke();

            } else {
                drawFallbackHead(); // Nếu đang tải mạng chậm thì vẽ đầu mặc định
            }
        } else {
            drawFallbackHead();
        }

        // Hàm vẽ đầu tròn màu da (Dự phòng)
        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#ffddc1"; ctx.fill(); 
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
            // Kính đen
            ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5;
            ctx.strokeRect(head.x + faceDir * 1 - 4, head.y - 3, 5, 4);
            ctx.strokeRect(head.x + faceDir * 7 - 4, head.y - 3, 5, 4);
            ctx.beginPath(); ctx.moveTo(head.x + faceDir * 2, head.y - 1); ctx.lineTo(head.x + faceDir * 3, head.y - 1); ctx.stroke();
        }
        // ==========================================

        // 4. Vũ khí: Cầm một chiếc Tablet Windows phát sáng ở tay phải
        ctx.fillStyle = "#0984e3"; 
        ctx.shadowBlur = isTrail ? 0 : 8; 
        ctx.shadowColor = "#00cec9"; 
        ctx.fillRect(handR.x - 6, handR.y - 8, 12, 16);
        
        // 5. Vẽ Bàn tay / Bàn chân
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
