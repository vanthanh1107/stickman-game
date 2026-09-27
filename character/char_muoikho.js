// ==========================================
// CHAR_TRUONGGIANG.JS - TRƯỜNG GIANG (MƯỜI KHÓ)
// ==========================================

window.currentLoadedChar = {
    id: "muoikho",
    className: "Muoi Kho",
    hp: 1100, speed: 7, dmgMod: 1.5, color: "#8B4513", // Tốc độ chạy rất nhanh (lươn lẹo), máu và đam ở mức khá. Màu chủ đạo: Nâu đất (áo bà ba)
    avatarUrl: "https://i.ibb.co/1JqfvVqd/anh-muoi-kho.png", // Sử dụng đúng ảnh Mười Khó
    skill: {},
    
    // CHIÊU CUỐI: "BÃO DÉP TỔ ONG" & "THÁI THỊT LÀM BẾP"
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái tung chiêu: Đứng lại phân bua, cằn nhằn
        caster.state = 'muoi_kho_scold'; 
        caster.attackTimer = 50; 
        caster.vx = 0; // Khựng lại để dùng chiêu
        
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Tạo hiệu ứng chém chéo đặc trưng
            if(typeof window.spawnSlash === 'function') {
                // Nhát chém 1: Phi dép tổ ong (Màu trắng ngà)
                window.spawnSlash(target.x, target.y - 35, caster.isFacingRight, "#f5f6fa", true, 6.0, 0);
                // Nhát chém 2: Dao phay đầu bếp (Màu xám kim loại sáng)
                window.spawnSlash(target.x, target.y - 15, !caster.isFacingRight, "#bdc3c7", true, 5.5, 0);
            }
            
            if(typeof window.takeDamage === 'function') {
                // Sát thương liên hoàn (gây ức chế tinh thần)
                window.takeDamage(target, baseDmg * 3.2, "#8B4513", true, false, caster);
            }
        }, 250);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // ==========================================
        // 1. VẼ THÂN (Mặc áo bà ba màu Nâu Đất mộc mạc)
        // ==========================================
        ctx.strokeStyle = "#8B4513"; // Màu Nâu SaddleBrown
        ctx.lineWidth = 6.5; 
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. VẼ CHÂN TAY (Tay áo bà ba xắn lên một chút - màu nâu nhạt hơn)
        ctx.strokeStyle = "#A0522D"; // Màu Nâu Sienna
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // ==========================================
        // 3. VẼ ĐẦU NHÂN VẬT: TRƯỜNG GIANG MƯỜI KHÓ
        // ==========================================
        let headSize = 38; 
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
                ctx.translate(head.x, head.y - 6); 
                
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
        // 4. VŨ KHÍ: CẦM DÉP TỔ ONG HUYỀN THOẠI TRÊN TAY PHẢI
        // ==========================================
        ctx.save();
        ctx.translate(handR.x, handR.y);
        // Xoay dép theo hướng nhìn
        ctx.rotate(p.isFacingRight ? Math.PI / 4 : -Math.PI / 4);

        ctx.fillStyle = "#f5f6fa"; // Màu dép tổ ong trắng ngà hơi cũ
        ctx.strokeStyle = "#dcdde1";
        ctx.lineWidth = 1;
        
        // Vẽ hình dáng chiếc dép (oval dẹt)
        ctx.beginPath();
        ctx.ellipse(5, -5, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Vẽ các "lỗ tổ ong" trên dép (các chấm đen/xám nhỏ)
        ctx.fillStyle = "#2f3640";
        for (let i = -2; i <= 2; i += 2) {
            for (let j = -2; j <= 2; j += 2) {
                ctx.beginPath();
                ctx.arc(5 + i * 2, -5 + j * 1.5, 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
        
        // 5. VẼ BÀN TAY / BÀN CHÂN (Đi chân trần hoặc dép lê)
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        
        // Tay phải đang cầm dép nên che đi một phần tay
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 3, 0, Math.PI*2); ctx.fill();
        
        if (p.state === 'kick') { 
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); 
        }
    }
};

// Đăng ký nhân vật vào hệ thống
if (!window.classStats) window.classStats = {};
window.classStats["truonggiang"] = window.currentLoadedChar;
