window.currentLoadedChar = {
    id: "satthu",
    className: "Sát Thủ",
    hp: 80, speed: 8, dmgMod: 0.9, color: "#2ed573",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'dagger_slash';
        caster.attackTimer = 14; 
        caster.vx = caster.isFacingRight ? 14 : -14; 
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                let damage = 10 * caster.dmgMod;
                if (Math.random() < 0.20) {
                    damage *= 2;
                    window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💥 CHÍ MẠNG!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "900 18px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#2ed573", false, false, caster);
                if (typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#2ed573", false, 1.0, Math.random()*Math.PI);
            }
        });
    },

    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.x = target.x + (target.x > caster.x ? -40 : 40); caster.isFacingRight = target.x > caster.x;
        caster.state = 'asura_strike'; caster.attackTimer = 35;
        setTimeout(() => { if (!window.gameOver && typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 2.5, "#2ed573", true, false, caster); }, 200);
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
        
        ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3;
        let daggerLen = (p.state === 'dagger_slash') ? 25 : 15;
        let dirL = p.isFacingRight ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x + (daggerLen*dirL), handL.y + 12); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + ((daggerLen+5)*dirL), handR.y - 8); ctx.stroke();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["satthu"] = window.currentLoadedChar;
