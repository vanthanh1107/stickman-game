window.currentLoadedChar = {
    id: "dausi",
    className: "Fighter",
    hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757",
    avatarUrl: "https://ibb.co/ZwLvnXw",
    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'machine_gun_punches'; 
        caster.attackTimer = 60;
        caster.vx = caster.isFacingRight ? 5 : -5;
        let punchCount = 0;
        let pInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || punchCount >= 5) { clearInterval(pInt); return; }
            if (Math.abs(target.x - caster.x) < 120 && typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 0.6, "#ff4757", true, false, caster);
                if(typeof window.shakeScreen === 'function') window.shakeScreen(6, 6);
            }
            punchCount++;
        }, 120);
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        if (!isTrail) { 
            ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 3; 
            ctx.beginPath(); ctx.moveTo(head.x - 10, head.y); ctx.lineTo(head.x - 22, head.y + 5 + Math.sin(Date.now()/150)*3); 
            ctx.moveTo(head.x - 10, head.y + 2); ctx.lineTo(head.x - 18, head.y + 12 + Math.cos(Date.now()/150)*2); ctx.stroke(); 
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; 
        }
        ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#ff9f43"; ctx.fillStyle = "#ff4757"; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
    }
};
if (!window.classStats) window.classStats = {};
window.classStats["dausi"] = window.currentLoadedChar;
