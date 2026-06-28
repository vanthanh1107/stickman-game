window.currentLoadedChar = {
    id: "thichkhach",
    className: "Thích Khách",
    hp: 100, speed: 7.5, dmgMod: 1.2, color: "#dfe4ea",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf",
    
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 2; // Nhịp chém 1-2
        caster.state = 'punch'; // Engine vung tay mượt mà
        caster.attackTimer = 16; 
        caster.vx = caster.isFacingRight ? 8 : -8; 
        
        if (typeof window.playSound === 'function') window.playSound(350, 'sawtooth', 0.1, 0.2);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 140) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 14 * caster.dmgMod, "#f1c40f", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff0000", false);
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_punch'; caster.attackTimer = 15; caster.vx = caster.isFacingRight ? 25 : -25; caster.iFrames = 15;
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
        
        if (!isTrail) {
            ctx.fillStyle = "#d35400"; 
            ctx.beginPath(); ctx.moveTo(head.x - 22, head.y); ctx.lineTo(head.x + 22, head.y); ctx.lineTo(head.x, head.y - 18); ctx.closePath(); ctx.fill();
        }

        let swordDir = p.isFacingRight ? 1 : -1;
        let isSlashing = (p.state === 'punch' || p.state === 'dash_punch');

        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(handR.x, handR.y); 
        
        if (isSlashing) {
            ctx.lineTo(handR.x + (70 * swordDir), handR.y + 30); 
            if (!isTrail) {
                let grad = ctx.createLinearGradient(handR.x, handR.y, handR.x + (60 * swordDir), handR.y + 30);
                grad.addColorStop(0, "rgba(241, 196, 15, 0.8)"); grad.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(handR.x, handR.y, 80, p.isFacingRight ? -Math.PI/6 : 7*Math.PI/6, p.isFacingRight ? Math.PI/2 : Math.PI/2, false); 
                ctx.lineTo(handR.x, handR.y); ctx.fill();
            }
        } else {
            ctx.lineTo(handR.x + (50 * swordDir), handR.y - 35); 
        }
        ctx.stroke(); ctx.lineCap = "butt";
        
        if (!isTrail) {
            ctx.fillStyle = "#2c3e50"; ctx.fillRect(handR.x - 2, handR.y - 4, 8, 8);
        }
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["thichkhach"] = window.currentLoadedChar;
