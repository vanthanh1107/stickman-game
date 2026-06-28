window.currentLoadedChar = {
    id: "satthu",
    className: "Sát Thủ",
    hp: 80, speed: 8.5, dmgMod: 0.9, color: "#2ed573",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
    
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 15 : -15; }
        else if (caster.comboStep === 1) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else { caster.state = 'dash_punch'; caster.vx = caster.isFacingRight ? 20 : -20; }
        
        caster.attackTimer = 12; // Đánh cực nhanh
        
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                let damage = 10 * caster.dmgMod;
                if (Math.random() < 0.20) { 
                    damage *= 2;
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💥 CHÍ MẠNG!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "900 18px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#2ed573", false, false, caster);
                if (typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#2ed573", false, 1.0, Math.random()*Math.PI);
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 15;
            if(typeof window.spawnProjectile === 'function') window.spawnProjectile(caster.x, caster.y - 50, caster.isFacingRight ? 18 : -18, 0, 8, "#2ed573", 25 * caster.dmgMod, target);
        },
        actionCode2: function(caster, target, ctx) {
            if(!target) return; 
            if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x, caster.y, "#2ed573", true);
            caster.x = target.x + (target.isFacingRight ? -50 : 50); caster.isFacingRight = target.x > caster.x; 
            caster.state = 'kick'; caster.attackTimer = 15;
            if(typeof window.takeDamage === 'function') window.takeDamage(target, 40 * caster.dmgMod, "#2ed573", true, false, caster);
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'dash_punch'; caster.attackTimer = 50; caster.iFrames = 50;
        let slashes = 0;
        let sInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || slashes >= 3) { clearInterval(sInt); return; }
            caster.x = target.x + (slashes % 2 === 0 ? 100 : -100); caster.isFacingRight = target.x > caster.x;
            if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#2ed573", true, 3.0, 0);
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg, "#2ed573", true, false, caster);
            slashes++;
        }, 300);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 9, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Vẽ 2 cây dao găm xanh (chỉ là đường kẻ đơn giản)
        ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; 
        let dirL = p.isFacingRight ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x + (15*dirL), handL.y + 15); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + (20*dirL), handR.y - 10); ctx.stroke();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["satthu"] = window.currentLoadedChar;
