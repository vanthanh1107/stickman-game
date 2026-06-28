window.currentLoadedChar = {
    id: "phapsu",
    className: "Pháp Sư",
    hp: 90, speed: 4, dmgMod: 1.6, color: "#9b59b6",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'cast_magic';
        caster.attackTimer = 20; 
        caster.vx = caster.isFacingRight ? -2 : 2; 
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            window.spawnProjectile(caster.x, caster.y - 45, caster.isFacingRight ? 11 : -11, 0, 10, "#9b59b6", 14 * caster.dmgMod, target);
        }
    },

    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'cast'; caster.attackTimer = 45;
        if(typeof window.spawnProjectile === 'function') {
            window.projectiles.push({ x: target.x - 60, y: -100, vx: 3, vy: 15, radius: 18, color: "#9b59b6", dmg: baseDmg, target: target, isMeteor: true, owner: caster });
            setTimeout(() => { window.projectiles.push({ x: target.x, y: -200, vx: 0, vy: 20, radius: 28, color: "#e74c3c", dmg: baseDmg * 1.5, target: target, isMeteor: true, owner: caster }); }, 400);
        }
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
        
        ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; 
        ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); 
        ctx.fillStyle = "#9b59b6"; 
        let coreSize = (p.state === 'cast_magic') ? 12 : 6;
        ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, coreSize, 0, Math.PI * 2); ctx.fill();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["phapsu"] = window.currentLoadedChar;
