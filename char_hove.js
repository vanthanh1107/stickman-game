window.currentLoadedChar = {
    id: "hove",
    className: "Hộ Vệ",
    hp: 180, speed: 3.5, dmgMod: 0.7, color: "#e67e22",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
    
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'dash_punch'; // Lấy đà đẩy mạnh toàn thân tới trước
        caster.attackTimer = 22; 
        caster.vx = caster.isFacingRight ? 8 : -8; 
        if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 15 * caster.dmgMod, "#e67e22", false, false, caster);
                target.vx = (target.x > caster.x) ? 18 : -18; target.vy = -3; 
                if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "ĐẨY LÙI!", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "bold 16px Arial", life: 25 });
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_punch'; caster.attackTimer = 25; caster.vx = caster.isFacingRight ? 15 : -15; caster.superArmor = 25;
            if(target && Math.abs(target.x - caster.x) < 90) {
                target.stunTimer = 60; target.state = 'stunned';
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#e67e22", false, true, caster);
            }
        },
        actionCode2: function(caster, target, ctx) {
            caster.state = 'block'; caster.attackTimer = 30; 
            let heal = Math.floor(caster.maxHp * 0.15); caster.hp = Math.min(caster.maxHp, caster.hp + heal);
            if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x, caster.y, "#2ecc71", true);
            if(typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${heal}`, color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 50 });
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'uppercut'; caster.attackTimer = 40; caster.vy = -15; 
        setTimeout(() => {
            if(window.gameOver) return;
            caster.vy = 25; 
            if(typeof window.shakeScreen === 'function') window.shakeScreen(20, 15);
            if(window.shockwaves) window.shockwaves.push({x: caster.x, y: window.GROUND_Y, r: 10, maxR: 400, color: "#e67e22", alpha: 1, speed: 20});
            if (Math.abs(target.x - caster.x) < 250 && typeof window.takeDamage === 'function') { 
                window.takeDamage(target, baseDmg * 2.0, "#e67e22", true, true, caster); target.stunTimer = 90; target.state = 'stunned';
            }
        }, 400); 
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 7; // Người que nét to hơn
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

        // Vẽ cái khiên đơn giản bám chặt tay trái
        ctx.save(); 
        ctx.translate(handL.x, handL.y); 
        ctx.rotate(p.isFacingRight ? Math.PI/12 : -Math.PI/12);
        ctx.fillStyle = "#111"; ctx.strokeStyle = "#e67e22"; ctx.lineWidth = 3; 
        ctx.fillRect(-8, -25, 16, 50); ctx.strokeRect(-8, -25, 16, 50); 
        ctx.restore(); 
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["hove"] = window.currentLoadedChar;
