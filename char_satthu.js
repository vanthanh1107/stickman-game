window.currentLoadedChar = {
    id: "satthu",
    className: "Sát Thủ",
    hp: 80, speed: 8.5, dmgMod: 0.9, color: "#2ed573",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
    
    // ĐÒN ĐÁNH THƯỜNG: VẼ CHỮ X CHỚP NHOÁNG
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'dagger_slash'; caster.attackTimer = 16; 
        caster.vx = caster.isFacingRight ? 18 : -18; // Tốc độ lướt bàn thờ
        
        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                let damage = 12 * caster.dmgMod;
                if (Math.random() < 0.25) { // 25% Chí mạng
                    damage *= 2;
                    window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💥 CHÍ MẠNG!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "900 18px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#2ed573", false, false, caster);
                
                // Vẽ 2 tia chém tạo hình chữ X
                if (typeof window.spawnSlash === 'function') {
                    window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#2ed573", false, 1.2, Math.PI/4);
                    window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#2ecc71", false, 1.2, -Math.PI/4);
                }
            }
        });
    },

    skill: {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'throw'; caster.attackTimer = 15;
            if(typeof window.spawnProjectile === 'function') {
                window.spawnProjectile(caster.x, caster.y - 50, caster.isFacingRight ? 16 : -16, 0, 8, "#2ed573", 25 * caster.dmgMod, target);
            }
        },
        actionCode2: function(caster, target, ctx) {
            if(!target) return; 
            if(typeof window.spawnParticles === 'function') window.spawnParticles(caster.x, caster.y, "#2ed573", true);
            caster.x = target.x + (target.isFacingRight ? -50 : 50); caster.isFacingRight = target.x > caster.x; 
            caster.state = 'backstab'; caster.attackTimer = 15;
            if(typeof window.takeDamage === 'function') window.takeDamage(target, 40 * caster.dmgMod, "#2ed573", true, false, caster);
        }
    },
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'shadow_strike'; caster.attackTimer = 50; caster.iFrames = 50;
        let slashes = 0;
        let sInt = setInterval(() => {
            if (window.gameOver || caster.hp <= 0 || slashes >= 3) { clearInterval(sInt); return; }
            caster.x = target.x + (slashes % 2 === 0 ? 100 : -100); caster.isFacingRight = target.x > caster.x;
            if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#2ed573", true, 3.0, 0);
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg, "#2ed573", true, false, caster);
            slashes++;
        }, 300);
    },
    
    // NÂNG CẤP ĐỒ HỌA: MŨ TRÙM ĐẦU VÀ KHĂN BAY TRONG GIÓ
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Mũ trùm Assassin (Hood)
        ctx.fillStyle = "#2c3e50"; 
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#111"; // Mặt đen ngòm
        ctx.beginPath(); ctx.arc(head.x + (p.isFacingRight? 2 : -2), head.y, 8, 0, Math.PI * 2); ctx.fill(); 
        
        // Khăn choàng (Scarf) bay lượn bằng hàm sóng sin
        if (!isTrail) {
            let dir = p.isFacingRight ? -1 : 1;
            let wave = Math.sin(Date.now() / 150) * 10;
            ctx.strokeStyle = "#e74c3c"; ctx.lineWidth = 4; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); 
            ctx.quadraticCurveTo(neck.x + (15*dir), neck.y - 10 + wave, neck.x + (30*dir), neck.y + wave); 
            ctx.stroke(); ctx.lineCap = "butt";
        }
        
        // Cử động dao găm chi tiết
        ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = 10; ctx.shadowColor = "#2ed573";
        let dirL = p.isFacingRight ? 1 : -1;
        
        if (p.state === 'dagger_slash' || p.state === 'backstab') {
            // Cầm dao ngược chém tới
            ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x + (25*dirL), handL.y + 15); ctx.stroke(); 
            ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + (30*dirL), handR.y - 15); ctx.stroke();
        } else {
            // Dáng Ninja thủ dao
            ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - (15*dirL), handL.y - 15); ctx.stroke(); 
            ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + (20*dirL), handR.y - 5); ctx.stroke();
        }
        ctx.shadowBlur = 0;
    }
};
if (!window.classStats) window.classStats = {}; window.classStats["satthu"] = window.currentLoadedChar;
