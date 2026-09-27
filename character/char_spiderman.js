window.currentLoadedChar = {
    id: "spiderman",
    className: "Spider-Man",
    hp: 1250,       // Trâu hơn một chút so với người thường
    speed: 9,       // Tốc độ di chuyển rất cao, đúng với bản chất đu tơ
    dmgMod: 1.5,    // Sát thương cân bằng
    color: "#e23636", // Màu đỏ đặc trưng của Nhện
    avatarUrl: "https://i.ibb.co/rR4m20k7/images.jpg", // Bạn tự điền link ảnh của bạn vào đây nhé
    skill: {},
    
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái tung chiêu Tơ Nhện (Web Strike)
        caster.state = 'web_strike'; 
        caster.attackTimer = 50; 
        caster.vx = 0; // Khựng lại để lấy thế bắn tơ
        
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Tạo hiệu ứng chém/tơ nhện (kết hợp Trắng của tơ, Đỏ và Xanh của đồ)
            if(typeof window.spawnSlash === 'function') {
                // Sợi tơ trói
                window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#ffffff", true, 5.0, 0);
                // Cú đá bồi màu đỏ/xanh
                window.spawnSlash(target.x, target.y - 45, !caster.isFacingRight, "#e23636", true, 4.0, 0);
                window.spawnSlash(target.x, target.y - 15, caster.isFacingRight, "#0984e3", true, 4.0, 0);
            }
            
            if(typeof window.takeDamage === 'function') {
                // Sát thương diện rộng/bạo kích với màu trắng của tơ nhện
                window.takeDamage(target, baseDmg * 3.5, "#ffffff", true, false, caster);
            }
        }, 300); // Tốc độ tung chiêu nhanh hơn Bill Gates một chút (300ms thay vì 350ms)
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // Vẽ Thân (Màu xanh dương đậm đặc trưng của Spider-Man)
        ctx.strokeStyle = "#0984e3"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // Vẽ Chân tay
        ctx.lineWidth = 4;
        // Chân màu xanh dương
        ctx.strokeStyle = "#0984e3"; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
        // Cánh tay màu đỏ
        ctx.strokeStyle = "#e23636"; 
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ Đầu (Mặt nạ nhện màu đỏ)
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#e23636"; // Da đầu màu đỏ
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.0; ctx.stroke(); 
        
        // Vẽ Mắt Nhện (To, màu trắng, viền đen vếch lên)
        let faceDir = p.isFacingRight ? 1 : -1;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        
        // Mắt phía sau (nhỏ hơn do góc nhìn)
        ctx.beginPath();
        ctx.moveTo(head.x + faceDir * 1 - 2, head.y - 3);
        ctx.lineTo(head.x + faceDir * 4 - 2, head.y - 6); // Đỉnh mắt vếch lên
        ctx.lineTo(head.x + faceDir * 4 - 2, head.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Mắt phía trước (to hơn)
        ctx.beginPath();
        ctx.moveTo(head.x + faceDir * 5, head.y - 3);
        ctx.lineTo(head.x + faceDir * 9, head.y - 7); // Đỉnh mắt vếch lên
        ctx.lineTo(head.x + faceDir * 8, head.y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Hiệu ứng tia tơ nhện phóng ra từ tay khi tung Ultimate hoặc đang đánh
        if (p.state === 'web_strike' || p.state === 'punch') {
            ctx.strokeStyle = "#ffffff"; // Màu tơ trắng
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(handR.x, handR.y);
            // Kéo dài sợi tơ về phía trước
            ctx.lineTo(handR.x + faceDir * 20, handR.y + (p.state === 'web_strike' ? -10 : 5));
            ctx.stroke();
        }
        
        // Vẽ Bàn tay / Bàn chân (Màu đỏ - Găng tay & Giày)
        ctx.shadowBlur = 0; ctx.fillStyle = "#e23636"; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["spiderman"] = window.currentLoadedChar;
