window.currentLoadedChar = {
    id: "thichkhach",
    className: "Thích Khách",
    hp: 100, speed: 7.5, dmgMod: 1.2, color: "#dfe4ea",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf",
    
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Kết hợp chém ngang và đá gạt
        if (caster.comboStep === 0) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else if (caster.comboStep === 1) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 8 : -8; }
        else { caster.state = 'dash_punch'; caster.vx = caster.isFacingRight ? 15 : -15; }
        
        caster.attackTimer = 16; 
        if (typeof window.playSound === 'function') window.playSound(350, 'sawtooth', 0.1, 0.2);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 130) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 14 * caster.dmgMod, "#f1c40f", false, false, caster);
                if (typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#dfe4ea", false, 1.2, 0);
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'slash_dash'; caster.attackTimer = 15; caster.vx = caster.isFacingRight ? 30 : -30; caster.iFrames = 15;
            if(target && Math.abs(target.x - caster.x) < 150) {
                if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#fff", false, 1.5, 0);
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 45 * caster.dmgMod, "#fff", true, false, caster);
            }
        },
        actionCode2: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 30;
            let hits = 0;
            let fInt = setInterval(() => {
                if (window.gameOver || caster.hp <= 0 || hits >= 4) { clearInterval(fInt); return; }
                if(target && Math.abs(target.x - caster.x) < 100) {
                    if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x + (Math.random()-0.5)*40, target.y - 40 + (Math.random()-0.5)*40, caster.isFacingRight, "#dfe4ea", false, 1.0, Math.random()*Math.PI);
                    if(typeof window.takeDamage === 'function') window.takeDamage(target, 15 * caster.dmgMod, "#dfe4ea", false, false, caster);
                }
                hits++;
            }, 100);
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'block'; caster.attackTimer = 40; 
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            caster.x = target.x + (caster.isFacingRight ? 100 : -100); caster.isFacingRight = !caster.isFacingRight;
            if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#f1c40f", true, 5.0, 0);
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 2.5, "#f1c40f", true, true, caster);
        }, 300);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Vẽ 1 đường kiếm Katana siêu thẳng bám vào tay phải
        let swordDir = p.isFacingRight ? 1 : -1;
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(handR.x, handR.y); 
        
        // Kiếm xoay theo góc độ của cánh tay
        let handDX = handR.x - elbowR.x;
        let handDY = handR.y - elbowR.y;
        let len = Math.sqrt(handDX*handDX + handDY*handDY);
        
        if (len > 0) {
            // Vươn dài lưỡi kiếm theo hướng cánh tay vung ra
            ctx.lineTo(handR.x + (handDX/len)*50, handR.y + (handDY/len)*50);
        } else {
            ctx.lineTo(handR.x + (50 * swordDir), handR.y - 30); 
        }
        ctx.stroke();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["thichkhach"] = window.currentLoadedChar;
