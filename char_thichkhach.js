window.currentLoadedChar = {
    id: "thichkhach",
    className: "Thích Khách",
    hp: 100, speed: 7, dmgMod: 1.2, color: "#dfe4ea",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'sword_slash';
        caster.attackTimer = 16; 
        caster.vx = caster.isFacingRight ? 6 : -6; 

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 130) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 14 * caster.dmgMod, "#f1c40f", false, false, caster);
                if (typeof window.spawnSlash === 'function') {
                    window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#dfe4ea", false, 1.2, 0);
                }
            }
        });
    },

    skill: {},
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'one_inch_punch'; caster.attackTimer = 38; caster.vx = caster.isFacingRight ? 10 : -10;
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#f1c40f", true, 4.0, 0);
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 2.5, "#f1c40f", true, false, caster);
        }, 300);
    },
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); 
        
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2;
        let swordDir = p.isFacingRight ? 1 : -1;
        ctx.beginPath(); 
        ctx.moveTo(handR.x, handR.y); 
        if (p.state === 'sword_slash') {
            ctx.lineTo(handR.x + (55 * swordDir), handR.y + 15); 
        } else {
            ctx.lineTo(handR.x + (42 * swordDir), handR.y - 20); 
        }
        ctx.stroke();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["thichkhach"] = window.currentLoadedChar;
