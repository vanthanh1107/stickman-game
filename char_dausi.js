window.currentLoadedChar = {
    id: "dausi",
    className: "Đấu Sĩ MMA",
    hp: 150, speed: 6.5, dmgMod: 1.1, color: "#ff4757",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG: COMBO 2 HIT (Đấm Lửa)
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch_heavy'; caster.attackTimer = 18; 
        caster.vx = caster.isFacingRight ? 15 : -15; // Áp sát cực gắt
        
        if (typeof window.playSound === 'function') window.playSound(250, 'square', 0.05, 0.1);
        
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 90) {
                // Hit 1: Sát thương tức thì
                if (typeof window.takeDamage === 'function') window.takeDamage(target, 6 * caster.dmgMod, "#ff4757", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#ff4757", false);
                
                // Hit 2: Đấm bồi sau 0.15s (Tạo combo)
                setTimeout(() => {
                    if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                        if (typeof window.takeDamage === 'function') window.takeDamage(target, 8 * caster.dmgMod, "#ff6b81", false, false, caster);
                        if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 40, "#f1c40f", true);
                    }
                }, 150);
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
        caster.state = 'machine_gun_punches'; caster.attackTimer = 60; caster.vx = caster.isFacingRight ? 3 : -3;
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
    
    // NÂNG CẤP ĐỒ HỌA: VẼ QUẦN BOXING VÀ MẮT ĐỎ
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ Quần Boxing
        if (!isTrail) {
            ctx.fillStyle = "#1e272e"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pelvis.x - 12, pelvis.y - 5); ctx.lineTo(kneeL.x, kneeL.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.lineTo(pelvis.x + 12, pelvis.y - 5); ctx.closePath(); ctx.fill(); ctx.stroke();
            // Đai lưng vô địch
            ctx.fillStyle = "#f1c40f"; ctx.fillRect(pelvis.x - 12, pelvis.y - 8, 24, 6);
        }

        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.stroke(); 
        
        // Mắt đỏ phát sáng rực lửa
        if (!isTrail) {
            let eyeX = p.isFacingRight ? head.x + 4 : head.x - 4;
            ctx.fillStyle = "#ff4757"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff4757";
            ctx.beginPath(); ctx.arc(eyeX, head.y - 2, 3, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        let dir = p.isFacingRight ? 1 : -1;
        let isPunching = (p.state === 'punch_heavy' || p.state === 'machine_gun_punches' || p.state === 'dash_punch');
        
        // Găng tay boxing to và gradient lửa
        let pX = isPunching ? handR.x + (20 * dir) : handR.x;
        let pY = isPunching ? handR.y - 10 : handR.y;
        
        let grd = ctx.createRadialGradient(pX, pY, 2, pX, pY, 15);
        grd.addColorStop(0, "#ff7979"); grd.addColorStop(1, "#eb4d4b");
        
        ctx.fillStyle = grd; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 10, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(pX, pY, isPunching ? 18 : 10, 0, Math.PI*2); ctx.fill();
        
        if (isPunching && !isTrail) {
            ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(pX, pY); ctx.lineTo(pX - (40 * dir), pY); ctx.stroke();
        }
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["dausi"] = window.currentLoadedChar;
