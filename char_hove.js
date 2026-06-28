window.currentLoadedChar = {
    id: "hove",
    className: "Hộ Vệ",
    hp: 180, speed: 3, dmgMod: 0.7, color: "#e67e22",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'shield_bash';
        caster.attackTimer = 22; 
        caster.vx = caster.isFacingRight ? 4 : -4; 

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 15 * caster.dmgMod, "#e67e22", false, false, caster);
                target.vx = (target.x > caster.x) ? 18 : -18; 
                target.vy = -3; 
                if (typeof window.floatingTexts === 'object') {
                    window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "🛡️ ĐẨY LÙI!", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial", life: 25 });
                }
            }
        });
    },

    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'dragon_uppercut'; caster.attackTimer = 35; caster.superArmor = 120; 
        if(typeof window.shockwaves !== 'undefined') window.shockwaves.push({x: caster.x, y: window.GROUND_Y, r: 10, maxR: 350, color: "#e67e22", alpha: 1, speed: 25});
        if (Math.abs(target.x - caster.x) < 200 && typeof window.takeDamage === 'function') { 
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
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
        
        ctx.save(); 
        ctx.translate(handL.x, handL.y); 
        if(p.state === 'shield_bash') {
            ctx.rotate(p.isFacingRight ? Math.PI/3 : -Math.PI/3); 
        }
        ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; 
        ctx.fillRect(-10, -25, 20, 50); ctx.strokeRect(-10, -25, 20, 50); 
        ctx.restore(); 
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["hove"] = window.currentLoadedChar;
