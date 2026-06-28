window.currentLoadedChar = {
    id: "dausi",
    className: "Đấu Sĩ MMA",
    hp: 150, speed: 6.5, dmgMod: 1.1, color: "#ff4757",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
    
    // Kỹ năng riêng
    skill: {
        // Skill 1: Cú đấm lao tới (Dash Punch)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_punch'; 
            caster.attackTimer = 20; 
            caster.vx = caster.isFacingRight ? 15 : -15; // Lao tới cực nhanh
            if(typeof window.playSound === 'function') window.playSound(300, 'square', 0.1, 0.3);
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
        },
        // Skill 2: Đấm móc lên trời (Uppercut)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'uppercut'; 
            caster.attackTimer = 25; 
            caster.vy = -10; // Nhảy lên nhẹ
            caster.vx = caster.isFacingRight ? 5 : -5;
            if(target && Math.abs(target.x - caster.x) < 80) {
                target.vy = -12; // Hất tung kẻ địch
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 30 * caster.dmgMod, "#ff4757", false, true, caster);
            }
        }
    },
    
    // Tuyệt chiêu: Đấm liên hoàn 100 hit
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'machine_gun_punches'; 
        caster.attackTimer = 60;
        caster.vx = caster.isFacingRight ? 3 : -3; // Vừa đấm vừa tiến lên từ từ
        let punchCount = 0;
        
        let pInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || punchCount >= 8) { clearInterval(pInt); return; }
            if (Math.abs(target.x - caster.x) < 120 && typeof window.takeDamage === 'function') {
                // Đấm liên tục mỗi 100ms
                window.takeDamage(target, baseDmg * 0.4, "#ff4757", true, false, caster);
                if(typeof window.shakeScreen === 'function') window.shakeScreen(5, 5);
                
                // Hiệu ứng tia lửa văng ra
                if(typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff4757", false);
            }
            punchCount++;
        }, 100);
    },
    
    // Vẽ nhân vật: Hai nắm đấm bốc lửa đỏ
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Băng quấn tay đỏ phát sáng
        ctx.shadowBlur = isTrail ? 0 : 15; ctx.shadowColor = "#ff4757"; ctx.fillStyle = "#ff4757"; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 10, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 10, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["dausi"] = window.currentLoadedChar;
