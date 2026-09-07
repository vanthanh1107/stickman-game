// ==========================================
// CHAR_JONNY.JS - VÕ SƯ JONNY TRÍ NGUYỄN
// ==========================================

window.currentLoadedChar = {
    id: "jonny",
    className: "Johnny Trí Nguyễn",
    hp: 1050, speed: 7, dmgMod: 2.1, color: "#ff4757", // Tốc độ cực nhanh, sát thương võ thuật cao
    avatarUrl: "https://i.ibb.co/qLNrvKRM/jonny.png",
    skill: {},
    
    // CHIÊU CUỐI: LIÊN PHONG VÔ ẢNH CƯƠC (COMBO VÕ THUẬT RỰC LỬA)
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái tung combo võ thuật
        caster.state = 'martial_arts_combo'; 
        caster.attackTimer = 40; // Tung đòn cực nhanh
        
        // Vận nội công lướt nhẹ về phía mục tiêu
        caster.vx = caster.isFacingRight ? 8 : -8; 
        
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Tạo hiệu ứng chém: Cước pháp tốc độ cao mang màu Đỏ và Cam rực lửa
            if(typeof window.spawnSlash === 'function') {
                // Đòn đấm ngang (Hook)
                window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#ff4757", true, 7.0, 0);
                // Cú đá xoay (Roundhouse kick)
                window.spawnSlash(target.x, target.y - 15, !caster.isFacingRight, "#ffa502", true, 6.0, 0);
                // Cú chẻ uy lực từ trên xuống (Axe kick)
                window.spawnSlash(target.x, target.y - 50, caster.isFacingRight, "#ff4757", true, 8.0, 90);
            }
            
            if(typeof window.takeDamage === 'function') {
                // Sát thương dồn cực mạnh từ combo
                window.takeDamage(target, baseDmg * 4.0, "#ff4757", true, false, caster);
            }
        }, 200);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // ==========================================
        // 1. VẼ THÂN (Mặc áo ba lỗ đen / Võ phục Liên Phong, ngực nở)
        // ==========================================
        ctx.strokeStyle = "#2d3436"; // Đen mạnh mẽ, cool ngầu
        ctx.lineWidth = 8; // Body đô con, cơ bắp
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // ==========================================
        // 2. VẼ CHÂN TAY (Tay trần cơ bắp, quần võ thuật đen)
        // ==========================================
        // Chân (Mặc quần đen võ thuật)
        ctx.strokeStyle = "#2d3436"; 
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
        
        // Tay (Tay trần lộ cơ bắp, màu da)
        ctx.strokeStyle = "#e8b689"; // Màu da trần
        ctx.lineWidth = 4.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // ==========================================
        // 3. VẼ ĐẦU NHÂN VẬT: ẢNH GỐC KHÔNG CẮT TRÒN
        // ==========================================
        let headSize = 36; // Cân đối với body bự
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
                ctx.translate(head.x, head.y - 5); 
                
                // In ảnh PNG gốc
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
        // 4. VŨ KHÍ: KHÔNG DÙNG ĐỒ VẬT - SỬ DỤNG GĂNG TAY MMA ĐỎ CÓ NỘI CÔNG
        // ==========================================
        ctx.fillStyle = "#ff4757"; // Màu đỏ găng tay MMA
        ctx.shadowBlur = isTrail ? 0 : 12; 
        ctx.shadowColor = "#ff4757"; // Hào quang đỏ tỏa ra từ nắm đấm
        
        // Bàn tay trái (Găng tay đấm bốc/MMA)
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 6.5, 0, Math.PI*2); ctx.fill(); 
        
        // Bàn tay phải (Găng tay đấm bốc/MMA)
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 6.5, 0, Math.PI*2); ctx.fill();

        // ==========================================
        // 5. VẼ BÀN CHÂN & HIỆU ỨNG CÚ ĐÁ
        // ==========================================
        ctx.shadowBlur = 0; 
        ctx.fillStyle = "#2d3436"; // Giày đen
        ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();
        
        // Khi nhân vật tung cước (đá), bàn chân sẽ tụ khí to lên và phát sáng
        if (p.state === 'kick') { 
            ctx.fillStyle = "#ffa502"; // Lửa cam ở chân
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ff4757";
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 8, 0, Math.PI*2); ctx.fill(); 
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["jonny"] = window.currentLoadedChar;
