window.currentLoadedChar = {
    id: "phapsu",
    className: "Pháp Sư",
    hp: 90, speed: 4.0, dmgMod: 1.6, color: "#9b59b6",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
    
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; // Engine sẽ giơ tay thẳng ra trước
        caster.attackTimer = 22; 
        caster.vx = caster.isFacingRight ? -2 : 2; 
        
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            let dirX = caster.isFacingRight ? 12 : -12;
            let dmg = 8 * caster.dmgMod;
            window.spawnProjectile(caster.x, caster.y - 45, dirX, -3, 6, "#9b59b6", dmg, target);
            window.spawnProjectile(caster.x, caster.y - 45, dirX + (dirX>0?2:-2), 0, 8, "#e056fd", dmg*1.5, target);
            window.spawnProjectile(caster.x, caster.y - 45, dirX, 3, 6, "#9b59b6", dmg, target);
        }
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 25; caster.vx = caster.isFacingRight ? -3 : 3;
            if(typeof window.spawnProjectile === 'function') window.spawnProjectile(caster.x, caster.y - 60, caster.isFacingRight ? 10 : -10, 0, 15, "#be2edd", 40 * caster.dmgMod, target);
        },
        actionCode2: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 30;
            if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x, caster.y - 40, "#9b59b6", true);
            if(target && Math.abs(target.x - caster.x) < 150) {
                target.vx = target.x > caster.x ? 25 : -25; target.vy = -5;
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#9b59b6", false, true, caster);
            }
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'block'; caster.attackTimer = 60;
        if(typeof window.spawnProjectile === 'function') {
            setTimeout(() => { window.projectiles.push({ x: target.x - 80, y: -50, vx: 2, vy: 15, radius: 20, color: "#e74c3c", dmg: baseDmg, target: target, isMeteor: true, owner: caster }); }, 100);
            setTimeout(() => { window.projectiles.push({ x: target.x + 80, y: -100, vx: -2, vy: 15, radius: 20, color: "#e74c3c", dmg: baseDmg, target: target, isMeteor: true, owner: caster }); }, 400);
            setTimeout(() => { window.projectiles.push({ x: target.x, y: -200, vx: 0, vy: 20, radius: 35, color: "#f1c40f", dmg: baseDmg * 2.0, target: target, isMeteor: true, owner: caster }); }, 700);
        }
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        
        if (!isTrail) {
            ctx.save(); ctx.translate(p.x, window.GROUND_Y); ctx.scale(1, 0.3);
            ctx.strokeStyle = "rgba(155, 89, 182, 0.6)"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, 40 + Math.sin(Date.now()/200)*10, 0, Math.PI*2); ctx.stroke();
            ctx.restore();
        }

        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        if (!isTrail) {
            ctx.fillStyle = "rgba(108, 92, 231, 0.8)";
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 15, pelvis.y + 25); ctx.lineTo(pelvis.x + 15, pelvis.y + 25); ctx.closePath(); ctx.fill();
        }

        let isCasting = (p.state === 'punch');
        let staffAngle = isCasting ? (p.isFacingRight ? Math.PI/3 : -Math.PI/3) : 0;
        
        ctx.save();
        ctx.translate(handR.x, handR.y); ctx.rotate(staffAngle);
        ctx.strokeStyle = "#d1ccc0"; ctx.lineWidth = 5; 
        ctx.beginPath(); ctx.moveTo(-5, 40); ctx.lineTo(12, -45); ctx.stroke(); 
        ctx.fillStyle = "#e056fd"; ctx.shadowBlur = 20; ctx.shadowColor = "#e056fd";
        ctx.beginPath(); ctx.arc(12, -50, isCasting ? 15 : 9, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["phapsu"] = window.currentLoadedChar;
