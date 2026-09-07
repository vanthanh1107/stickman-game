// ==========================================
// CHAR_PHUONGHANG.JS - CEO NGUYỄN PHƯƠNG HẰNG
// ==========================================

window.currentLoadedChar = {
    id: "phuonghang",
    className: "Phuong Hang",
    hp: 1250, speed: 5, dmgMod: 1.8, color: "#e84393", // Đam cao, máu trâu, màu áo hồng/đỏ đặc trưng
    avatarUrl: "https://i.ibb.co/2Yn3vY99/Generated-Image-July-05-2026-8-47-PM-Recovered.png",
    skill: {},
    
    // CHIÊU CUỐI: LIVESTREAM "BÃO SAO KÊ" & "KIM CƯƠNG"
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái tung chiêu Livestream 
        caster.state = 'livestream_drama'; 
        caster.attackTimer = 55; 
        caster.vx = 0; // Đứng yên dõng dạc phát biểu
        
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Tạo hiệu ứng chém chéo: Màu trắng kim cương và màu vàng hoàng gia
            if(typeof window.spawnSlash === 'function') {
                // Nhát chém 1: Bão sao kê (Màu vàng)
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#f1c40f", true, 6.0, 0);
                // Nhát chém 2: Ánh sáng kim cương (Màu lục lam sáng)
                window.spawnSlash(target.x, target.y - 20, !caster.isFacingRight, "#00ffff", true, 5.0, 0);
            }
            
            if(typeof window.takeDamage === 'function') {
                // Sát thương cực mạnh (Sát thương tinh thần + vật lý)
                window.takeDamage(target, baseDmg * 3.5, "#e84393", true, false, caster);
            }
        }, 300);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // ==========================================
        // 1. VẼ THÂN (Mặc váy/vest dạ hội màu Đỏ Ruby / Hồng đậm sang trọng)
        // ==========================================
        ctx.strokeStyle = "#d63031"; // Đỏ dạ hội
        ctx.lineWidth = 7; // Thân hình đậm đà, quyền lực hơn chút
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. VẼ CHÂN TAY (Màu tone sur tone với áo)
        ctx.strokeStyle = "#ff7675"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // ==========================================
        // 3. VẼ ĐẦU NHÂN VẬT: ẢNH GỐC KHÔNG CẮT TRÒN (HỖ TRỢ PNG)
        // ==========================================
        let headSize = 38; // Tăng size đầu lên một chút để rõ mặt CEO
        let faceDir = p.isFacingRight ? 1 : -1;

        let currentAvatar = p.avatarUrl;
        if (!currentAvatar && p.classId && window.classStats && window.classStats[p.classId]) {
            currentAvatar = window.classStats[p.classId].avatarUrl;
        }
        if (!currentAvatar && window.currentLoadedChar) {
            currentAvatar = window.currentLoadedChar.avatarUrl;
        }

        if (currentAvatar) {
            if (!window.avatarImageCache) window.avatarImageCache = {};
            if (!window.avatarImageCache[currentAvatar]) {
                let img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = currentAvatar;
                window.avatarImageCache[currentAvatar] = img;
            }

            let img = window.avatarImageCache[currentAvatar];
            
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.translate(head.x, head.y - 6); // Nhấc cao lên xíu cho đỡ lùn cổ
                
                // In ảnh PNG gốc, giữ nguyên độ trong suốt
                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
                ctx.restore();
            } else {
                drawFallbackHead(); 
            }
        } else {
            drawFallbackHead();
        }

        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#ffddc1"; ctx.fill(); 
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }

        // ==========================================
        // 4. VŨ KHÍ: CẦM VIÊN KIM CƯƠNG "HÀNG KÝ" PHÁT SÁNG TRÊN TAY PHẢI
        // ==========================================
        ctx.fillStyle = "#00ffff"; // Màu kim cương lấp lánh
        ctx.shadowBlur = isTrail ? 0 : 15; 
        ctx.shadowColor = "#ffffff"; // Hào quang trắng
        
        // Vẽ hình thoi (Kim cương)
        ctx.beginPath();
        ctx.moveTo(handR.x, handR.y - 10);      // Đỉnh kim cương
        ctx.lineTo(handR.x + 8, handR.y - 2);   // Cạnh phải
        ctx.lineTo(handR.x, handR.y + 12);      // Đáy kim cương
        ctx.lineTo(handR.x - 8, handR.y - 2);   // Cạnh trái
        ctx.closePath();
        ctx.fill();
        
        // 5. VẼ BÀN TAY / BÀN CHÂN
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        // Tay phải trùng màu kim cương nên không cần vẽ thêm hoặc vẽ nhỏ lại
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 3, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["phuonghang"] = window.currentLoadedChar;
