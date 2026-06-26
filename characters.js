// ==========================================
// CHARACTERS.JS - KHO CHỈ SỐ, KỸ NĂNG VÀ ĐỒ HỌA ĐỘC LẬP TỪNG NHÂN VẬT
// ==========================================

window.classStats = {
    // ----------------------------------------------------
    // 1. ĐẤU SĨ MMA
    // ----------------------------------------------------
    "dausi": { 
        className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", 
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf",
        lineWidth: 5, headSize: 10,
        skill: {},
        executeUltimate: function(caster, target, baseDmg) {
            caster.state = 'machine_gun_punches'; 
            caster.attackTimer = 60;
            caster.vx = caster.isFacingRight ? 5 : -5;
            let punchCount = 0;
            let pInt = setInterval(() => {
                if (window.gameOver || caster.hp <= 0 || punchCount >= 5) { clearInterval(pInt); return; }
                if (Math.abs(target.x - caster.x) < 120 && typeof window.takeDamage === 'function') {
                    window.takeDamage(target, baseDmg * 0.6, "#ff4757", true, false, caster);
                    if(typeof window.shakeScreen === 'function') window.shakeScreen(6, 6);
                }
                punchCount++;
            }, 120);
        },
        drawBackground: null,
        drawForeground: function(ctx, p, pts, isTrail) {
            let {head, handL, handR} = pts;
            if (!isTrail) { 
                ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 3; 
                ctx.beginPath(); ctx.moveTo(head.x - 10, head.y); ctx.lineTo(head.x - 22, head.y + 5 + Math.sin(Date.now()/150)*3); 
                ctx.moveTo(head.x - 10, head.y + 2); ctx.lineTo(head.x - 18, head.y + 12 + Math.cos(Date.now()/150)*2); ctx.stroke(); 
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; 
            }
            ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#ff9f43"; ctx.fillStyle = "#ff4757"; 
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
        }
    },

    // ----------------------------------------------------
    // 2. SÁT THỦ
    // ----------------------------------------------------
    "satthu": { 
        className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, color: "#2ed573", 
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
        lineWidth: 5, headSize: 10,
        skill: {
            // Bộ action riêng của người chơi
            actionCode2: function(caster, target, ctx) {
                if(!target) return; let behindX = target.x + (target.isFacingRight ? -50 : 50);
                if(ctx && ctx.teleport) ctx.teleport(caster, behindX, target.y); 
                caster.isFacingRight = target.x > caster.x; 
                caster.state = 'spinning_backfist'; caster.attackTimer = 15;
                if(ctx && ctx.takeDamage) ctx.takeDamage(target, 80 * caster.dmgMod, "#2ed573", true);
                if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: target.x, y: target.y - 70, text: "BÁM SÁT!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 24px Arial", life: 40 });
            }
        },
        executeUltimate: function(caster, target, baseDmg) {
            caster.x = target.x + (target.x > caster.x ? -40 : 40);
            caster.isFacingRight = target.x > caster.x;
            caster.state = 'asura_strike'; 
            caster.attackTimer = 35;
            setTimeout(() => { 
                if (!window.gameOver && typeof window.takeDamage === 'function') {
                    window.takeDamage(target, baseDmg * 2.5, "#2ed573", true, false, caster);
                }
            }, 200);
        },
        drawBackground: null,
        drawForeground: function(ctx, p, pts, isTrail) {
            let {handL, handR} = pts;
            ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#2ed573"; 
            ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - 15, handL.y + 10); ctx.stroke(); 
            ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 18, handR.y - 5); ctx.stroke();
            ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        }
    },

    // ----------------------------------------------------
    // 3. PHÁP SƯ
    // ----------------------------------------------------
    "phapsu": { 
        className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6", 
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
        lineWidth: 5, headSize: 10,
        skill: {
            actionCode1: function(caster, target, ctx) {
                caster.state = 'cast'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? -8 : 8; 
                if(ctx && ctx.playSound) ctx.playSound(600, 'sine', 0.2, 0.5);
                let bulletVx = caster.isFacingRight ? 12 : -12;
                if(ctx && ctx.spawnProjectile) ctx.spawnProjectile(caster.x, caster.y - 40, bulletVx, 0, 12, "#9b59b6", 45 * caster.dmgMod, target);
            },
            actionCode3: function(caster, target, ctx) {
                caster.state = 'cast'; caster.attackTimer = 40; 
                if(ctx && ctx.shakeScreen) ctx.shakeScreen(30, 15); 
                if(ctx && ctx.playSound) ctx.playSound(100, 'sawtooth', 0.8, 0.8);
                window.enemies.forEach(e => { if(ctx && ctx.spawnProjectile) ctx.spawnProjectile(e.x, -50, 0, 20, 15, "#f1c40f", 100 * caster.dmgMod, e); });
            }
        },
        executeUltimate: function(caster, target, baseDmg) {
            caster.state = 'cast'; 
            caster.attackTimer = 45;
            if(typeof window.spawnProjectile === 'function') {
                window.projectiles.push({ x: target.x - 60, y: -100, vx: 3, vy: 15, radius: 18, color: "#9b59b6", dmg: baseDmg, target: target, isMeteor: true, owner: caster });
                setTimeout(() => { window.projectiles.push({ x: target.x + 60, y: -100, vx: -3, vy: 15, radius: 18, color: "#9b59b6", dmg: baseDmg, target: target, isMeteor: true, owner: caster }); }, 250);
                setTimeout(() => { window.projectiles.push({ x: target.x, y: -200, vx: 0, vy: 20, radius: 28, color: "#e74c3c", dmg: baseDmg * 1.5, target: target, isMeteor: true, owner: caster }); }, 500);
            }
        },
        drawBackground: function(ctx, p, pts, isTrail) {
            let {neck, pelvis} = pts;
            if (!isTrail) { 
                ctx.strokeStyle = "rgba(155, 89, 182, 0.4)"; ctx.lineWidth = 4; 
                ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 12, pelvis.y + 10); ctx.stroke(); 
            }
        },
        drawForeground: function(ctx, p, pts, isTrail) {
            let {handL, handR} = pts;
            ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; 
            ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); 
            ctx.fillStyle = "#9b59b6"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#9b59b6"; 
            ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, 6, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        }
    },

    // ----------------------------------------------------
    // 4. HỘ VỆ
    // ----------------------------------------------------
    "hove": { 
        className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", 
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
        lineWidth: 6, headSize: 11,
        skill: {
            actionCode2: function(caster, target, ctx) {
                caster.state = 'block'; caster.attackTimer = 30; 
                if(ctx && ctx.setInvulnerable) ctx.setInvulnerable(caster, 60); 
                let healAmount = Math.floor(caster.maxHp * 0.2); caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
                if(ctx && ctx.playSound) ctx.playSound(300, 'sine', 0.5, 0.5); 
                if(ctx && ctx.spawnParticles) ctx.spawnParticles(caster.x, caster.y, "#e67e22", true);
                if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${healAmount} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -3, font: "900 28px Arial", life: 50 });
            }
        },
        executeUltimate: function(caster, target, baseDmg) {
            caster.state = 'dragon_uppercut'; 
            caster.attackTimer = 35;
            caster.superArmor = 120; 
            let heal = Math.floor(caster.maxHp * 0.3); caster.hp = Math.min(caster.maxHp, caster.hp + heal);
            window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${heal} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 50 });
            if(typeof window.shockwaves !== 'undefined') window.shockwaves.push({x: caster.x, y: window.GROUND_Y, r: 10, maxR: 350, color: "#e67e22", alpha: 1, speed: 25});
            
            let dist = target.x - caster.x;
            if (Math.abs(dist) < 200 && typeof window.takeDamage === 'function') { 
                window.takeDamage(target, baseDmg * 1.5, "#e67e22", true, true, caster); 
                if (target.state !== 'block') { target.stunTimer = 90; target.state = 'stunned'; } 
            }
        },
        drawBackground: null,
        drawForeground: function(ctx, p, pts, isTrail) {
            let {handL, handR} = pts;
            if(!isTrail) { 
                ctx.save(); ctx.translate(handL.x, handL.y); ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; 
                ctx.fillRect(-8, -20, 16, 40); ctx.strokeRect(-8, -20, 16, 40); ctx.restore(); 
            }
            ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 15, handR.y - 15); ctx.stroke(); 
            ctx.fillStyle = "#57606f"; ctx.beginPath(); ctx.arc(handR.x + 15, handR.y - 15, 5, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        }
    },

    // ----------------------------------------------------
    // 5. THÍCH KHÁCH
    // ----------------------------------------------------
    "thichkhach": { 
        className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, color: "#dfe4ea", 
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf",
        lineWidth: 5, headSize: 10,
        skill: {},
        executeUltimate: function(caster, target, baseDmg) {
            caster.state = 'one_inch_punch'; 
            caster.attackTimer = 38;
            caster.vx = caster.isFacingRight ? 10 : -10;
            setTimeout(() => { 
                if(window.gameOver || caster.hp <= 0) return;
                if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#f1c40f", true, 4.0, 0);
                if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 2.5, "#f1c40f", true, false, caster);
            }, 300);
        },
        drawBackground: function(ctx, p, pts, isTrail) {
            let {neck} = pts;
            if (!isTrail) { 
                ctx.strokeStyle = "rgba(241, 196, 15, 0.4)"; ctx.lineWidth = 3; 
                ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(neck.x - 25, neck.y + 15 + Math.sin(Date.now()/120)*4); ctx.stroke(); 
            }
        },
        drawForeground: function(ctx, p, pts, isTrail) {
            let {handL, handR} = pts;
            ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 2; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#fff"; 
            ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 30, handR.y - 12); ctx.stroke();
            ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
        }
    }
};

// ==========================================
// HỆ THỐNG GẮN TỌA ĐỘ KHỚP XƯƠNG CHO ĐỒ HỌA
// ==========================================
window.assignDrawMethods = function(statsObj) {
    let drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
        let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
        let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
        let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
        
        let t = Date.now() / 150; 

        if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
        else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
        else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
        else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
        else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } 
        else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } 
        else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } 
        else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
        
        else if (p.state === 'taunt_crane') { head.y += Math.sin(t)*2; footR = {x: -5, y: -25}; kneeR = {x: 15, y: -20}; footL = {x: 0, y: 0}; kneeL = {x: -10, y: -10}; handL = {x: -30, y: -60 + Math.sin(t)*5}; elbowL = {x: -15, y: -50}; handR = {x: 30, y: -60 - Math.sin(t)*5}; elbowR = {x: 15, y: -50}; }
        else if (p.state === 'taunt_power') { let shake = Math.random()*2 - 1; head.x += shake; head.y = -50 + shake; pelvis.y = -10; footL = {x: -20, y: 0}; kneeL = {x: -25, y: -10}; footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10}; handL = {x: -15, y: -40}; elbowL = {x: -25, y: -30}; handR = {x: 15, y: -40}; elbowR = {x: 25, y: -30}; if(Math.random()<0.2 && window.particles){ window.particles.push({x: p.x+(Math.random()-0.5)*30, y: window.GROUND_Y, vx: 0, vy: -Math.random()*4, life: 15, maxLife: 15, color: p.color||"#f1c40f", size: 2}); } }
        else if (p.state === 'taunt_dance') { let swing = Math.sin(t * 2) * 20; let hip = Math.cos(t * 2) * 10; pelvis.x = hip; head.x = -hip/2; handL = {x: -15 + swing, y: -30}; elbowL = {x: -20 + swing, y: -40}; handR = {x: 15 + swing, y: -30}; elbowR = {x: 20 + swing, y: -40}; }
        else if (p.state === 'taunt_point') { head.x = 5; handR = {x: 35, y: -40 + Math.sin(t)*2}; elbowR = {x: 20, y: -40}; handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; }
        else if (p.state === 'taunt_flex') { head.y = -55 + Math.sin(t)*2; pelvis.y = -20; handL = {x: -20, y: -55}; elbowL = {x: -30, y: -45}; handR = {x: 20, y: -55}; elbowR = {x: 30, y: -45}; }

        return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    };

    for (let id in statsObj) {
        let classDef = statsObj[id];
        classDef.drawMethod = function(ctx, p, bounce, ext, pext, isTrail) {
            let pts = drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
            const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
            
            // 1. Vẽ Phụ kiện Background
            if (classDef.drawBackground) classDef.drawBackground(ctx, p, pts, isTrail);
            
            // 2. Vẽ Body Khung xương chính
            ctx.strokeStyle = "#fff"; ctx.lineWidth = classDef.lineWidth || 5;
            let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
            drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
            ctx.beginPath(); ctx.arc(head.x, head.y, classDef.headSize || 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
            
            // 3. Vẽ Phụ kiện Foreground
            if (classDef.drawForeground) classDef.drawForeground(ctx, p, pts, isTrail);
            
            // 4. Vẽ Box bàn chân khi tung cước
            if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
        };
    }
};
