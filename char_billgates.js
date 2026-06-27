window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=billgates&backgroundColor=bde0fe",
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
        
        // Vẽ Thân (Mặc áo len/vest màu xanh dương đậm)
        ctx.strokeStyle = "#2c3e50"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // Vẽ Chân tay
        ctx.strokeStyle = "#34495e"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ Đầu
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffddc1"; // Màu da người
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        // Vẽ Mắt Kính cho Bill Gates
        let faceDir = p.isFacingRight ? 1 : -1;
        ctx.strokeStyle = "#222"; 
        ctx.lineWidth = 1.5;
        // Mắt kính trái và phải
        ctx.strokeRect(head.x + faceDir * 1 - 4, head.y - 3, 5, 4);
        ctx.strokeRect(head.x + faceDir * 7 - 4, head.y - 3, 5, 4);
        // Gọng kính nối giữa
        ctx.beginPath(); ctx.moveTo(head.x + faceDir * 2, head.y - 1); ctx.lineTo(head.x + faceDir * 3, head.y - 1); ctx.stroke();
        
        // Vũ khí: Cầm một chiếc Tablet Windows phát sáng ở tay phải
        ctx.fillStyle = "#0984e3"; 
        ctx.shadowBlur = isTrail ? 0 : 8; 
        ctx.shadowColor = "#00cec9"; 
        ctx.fillRect(handR.x - 6, handR.y - 8, 12, 16);
        
        // Vẽ Bàn tay / Bàn chân
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
