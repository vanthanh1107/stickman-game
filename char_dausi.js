window.currentLoadedChar = {
    id: "dausi",
    className: "Đấu Sĩ MMA",
    hp: 150, speed: 6.5, dmgMod: 1.1, color: "#ff4757",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
    
    // TRẢ LẠI COMBO ĐẤM VÀ ĐÁ CỦA ENGINE GỐC
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 4; // Chuỗi combo 4 đòn
        caster.state = caster.comboStep >= 2 ? 'kick' : 'punch'; // 2 phát đấm, 2 phát đá
        caster.attackTimer = 14; 
        caster.vx = caster.isFacingRight ? 12 : -12; 
        
        if (typeof window.playSound === 'function') window.playSound(250, 'square', 0.05, 0.1);
        
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 85) {
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 10 * caster.dmgMod, "#ff4757", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff4757", false);
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_punch'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? 20 : -20;
            if(typeof window.playSound === 'function') window.playSound(300, 'square', 0.1, 0.3);
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
        },
        actionCode2: function(caster, target, ctx) {
            caster.state = 'uppercut'; caster.attackTimer = 25; caster.vy = -12; caster.vx = caster.isFacingRight ? 5 : -5;
            if(target && Math.abs(target.x - caster.x) < 80) {
                target.vy = -12;
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 30 * caster.dmgMod, "#ff4757", false, true, caster);
            }
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; caster.attackTimer = 60; caster.vx = caster.isFacingRight ? 3 : -3;
        let punchCount = 0;
        let pInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || punchCount >= 8) { clearInterval(pInt); return; }
            if (Math.abs(target.x - caster.x) < 120 && typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 0.4, "#ff4757", true, false, caster);
                if(typeof window.shakeScreen === 'function') window.shakeScreen(5, 5);
            }
            punchCount++;
        }, 100);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        if (!isTrail) {
            ctx.fillStyle = "#1e272e"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pelvis.x - 12, pelvis.y - 5); ctx.lineTo(kneeL.x, kneeL.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.lineTo(pelvis.x + 12, pelvis.y - 5); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#f1c40f"; ctx.fillRect(pelvis.x - 12, pelvis.y - 8, 24, 6);
        }

        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.stroke(); 
        
        if (!isTrail) {
            let eyeX = p.isFacingRight ? head.x + 4 : head.x - 4;
            ctx.fillStyle = "#ff4757"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff4757";
            ctx.beginPath(); ctx.arc(eyeX, head.y - 2, 3, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        let dir = p.isFacingRight ? 1 : -1;
        let isPunching = (p.state === 'punch' || p.state === 'dash_punch');
        let pX = isPunching ? handR.x + (15 * dir) : handR.x;
        let pY = isPunching ? handR.y - 5 : handR.y;
        
        let grd = ctx.createRadialGradient(pX, pY, 2, pX, pY, 15);
        grd.addColorStop(0, "#ff7979"); grd.addColorStop(1, "#eb4d4b");
        ctx.fillStyle = grd; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 10, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(pX, pY, isPunching ? 18 : 10, 0, Math.PI*2); ctx.fill();
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["dausi"] = window.currentLoadedChar;
