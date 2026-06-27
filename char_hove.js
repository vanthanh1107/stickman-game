window.currentLoadedChar = {
    id: "hove",
    className: "Hộ Vệ",
    hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
    skill: {
        actionCode2: function(caster, target, ctx) {
            caster.state = 'block'; caster.attackTimer = 30; 
            if(ctx && ctx.setInvulnerable) ctx.setInvulnerable(caster, 60); 
            let healAmount = Math.floor(caster.maxHp * 0.2); caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
            if(ctx && ctx.playSound) ctx.playSound(300, 'sine', 0.5, 0.5); 
            if(ctx && ctx.spawnParticles) ctx.spawnParticles(caster.x, caster.y, "#e67e22", true);
        }
    },
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'dragon_uppercut'; caster.attackTimer = 35; caster.superArmor = 120; 
        let heal = Math.floor(caster.maxHp * 0.3); caster.hp = Math.min(caster.maxHp, caster.hp + heal);
        window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${heal} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 50 });
        if(typeof window.shockwaves !== 'undefined') window.shockwaves.push({x: caster.x, y: window.GROUND_Y, r: 10, maxR: 350, color: "#e67e22", alpha: 1, speed: 25});
        let dist = target.x - caster.x;
        if (Math.abs(dist) < 200 && typeof window.takeDamage === 'function') { 
            window.takeDamage(target, baseDmg * 1.5, "#e67e22", true, true, caster); 
            if (target.state !== 'block') { target.stunTimer = 90; target.state = 'stunned'; } 
        }
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        if(!isTrail) { 
            ctx.save(); ctx.translate(handL.x, handL.y); ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; 
            ctx.fillRect(-8, -20, 16, 40); ctx.strokeRect(-8, -20, 16, 40); ctx.restore(); 
        }
        ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 15, handR.y - 15); ctx.stroke(); 
        ctx.fillStyle = "#57606f"; ctx.beginPath(); ctx.arc(handR.x + 15, handR.y - 15, 5, 0, Math.PI*2); ctx.fill();
        
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};
if (!window.classStats) window.classStats = {};
window.classStats["hove"] = window.currentLoadedChar;
