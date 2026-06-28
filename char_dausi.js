window.currentLoadedChar = {
    id: "dausi",
    className: "Đấu Sĩ MMA",
    hp: 150, speed: 6, dmgMod: 1.1, color: "#ff4757",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; 
        caster.attackTimer = 12; 
        caster.vx = caster.isFacingRight ? 12 : -12; 
        if (typeof window.playSound === 'function') window.playSound(250, 'square', 0.05, 0.1);
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 85) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 12 * caster.dmgMod, "#ff4757", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff4757", false);
            }
        });
    },

    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'machine_gun_punches'; caster.attackTimer = 60; caster.vx = caster.isFacingRight ? 3 : -3;
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
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
        let punchScale = (p.state === 'punch') ? 14 : 8;
        ctx.fillStyle = "#ff4757"; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, punchScale, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, punchScale, 0, Math.PI*2); ctx.fill();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["dausi"] = window.currentLoadedChar;
