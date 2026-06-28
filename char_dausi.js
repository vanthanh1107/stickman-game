window.currentLoadedChar = {
    id: "dausi",
    className: "Đấu Sĩ MMA",
    hp: 150, speed: 6.5, dmgMod: 1.1, color: "#ff4757",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
    
    // PHỤC HỒI COMBO TAY CHÂN NGUYÊN BẢN (Uy lực cao)
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 4; // Chuỗi 4 đòn
        
        if (caster.comboStep === 0) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 5 : -5; }
        else if (caster.comboStep === 1) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 8 : -8; }
        else if (caster.comboStep === 2) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else { caster.state = 'dash_punch'; caster.vx = caster.isFacingRight ? 18 : -18; } // Cú chốt lao tới cực mạnh
        
        caster.attackTimer = 14; 
        if (typeof window.playSound === 'function') window.playSound(250, 'square', 0.05, 0.1);
        
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 85) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 12 * caster.dmgMod, "#ff4757", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff4757", false);
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_punch'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? 25 : -25;
            if(typeof window.playSound === 'function') window.playSound(300, 'square', 0.1, 0.3);
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
        },
        actionCode2: function(caster, target, ctx) {
            caster.state = 'uppercut'; caster.attackTimer = 25; caster.vy = -15; caster.vx = caster.isFacingRight ? 5 : -5;
            if(target && Math.abs(target.x - caster.x) < 80) {
                target.vy = -15;
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 30 * caster.dmgMod, "#ff4757", false, true, caster);
            }
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; caster.attackTimer = 60; caster.vx = caster.isFacingRight ? 3 : -3;
        let punchCount = 0;
        let pInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || punchCount >= 8) { clearInterval(pInt); return; }
            if (Math.abs(target.x - caster.x) < 120 && typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 0.4, "#ff4757", true, false, caster);
                if(typeof window.shakeScreen === 'function') window.shakeScreen(5, 5);
            }
            punchCount++;
        }, 100);
    },
    
    // VẼ STICKMAN NGUYÊN THỦY TỐI GIẢN
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Chỉ để lại Găng tay đỏ phát sáng
        ctx.fillStyle = "#ff4757"; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["dausi"] = window.currentLoadedChar;
