window.currentLoadedChar = {
    id: "phapsu",
    className: "Pháp Sư",
    hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'cast'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? -8 : 8; 
            if(ctx && ctx.playSound) ctx.playSound(600, 'sine', 0.2, 0.5);
            let bulletVx = caster.isFacingRight ? 12 : -12;
            if(ctx && ctx.spawnProjectile) ctx.spawnProjectile(caster.x, caster.y - 40, bulletVx, 0, 12, "#9b59b6", 45 * caster.dmgMod, target);
        }
    },
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'cast'; caster.attackTimer = 45;
        if(typeof window.spawnProjectile === 'function') {
            window.projectiles.push({ x: target.x - 60, y: -100, vx: 3, vy: 15, radius: 18, color: "#9b59b6", dmg: baseDmg, target: target, isMeteor: true, owner: caster });
            setTimeout(() => { window.projectiles.push({ x: target.x + 60, y: -100, vx: -3, vy: 15, radius: 18, color: "#9b59b6", dmg: baseDmg, target: target, isMeteor: true, owner: caster }); }, 250);
            setTimeout(() => { window.projectiles.push({ x: target.x, y: -200, vx: 0, vy: 20, radius: 28, color: "#e74c3c", dmg: baseDmg * 1.5, target: target, isMeteor: true, owner: caster }); }, 500);
        }
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        if (!isTrail) { 
            ctx.strokeStyle = "rgba(155, 89, 182, 0.4)"; ctx.lineWidth = 4; 
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 12, pelvis.y + 10); ctx.stroke(); 
        }

        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; 
        ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); 
        ctx.fillStyle = "#9b59b6"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#9b59b6"; 
        ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, 6, 0, Math.PI * 2); ctx.fill();
        
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};
if (!window.classStats) window.classStats = {};
window.classStats["phapsu"] = window.currentLoadedChar;
