// ==========================================
// COMBAT.JS - HỆ THỐNG VÕ THUẬT & COMBO ĐỈNH CAO
// ==========================================

window.takeDamage = function(target, amount, color, isCrit = false, isWallBounce = false) {
    if(!target || target.hp <= 0) return;
    
    let actualDmg = (isNaN(amount) || amount === undefined) ? 0 : amount;
    if (target.iFrames > 0 && !isWallBounce) return; 
    
    // ĐÒN KẾT LIỄU ĐẬM CHẤT ĐIỆN ẢNH (K.O)
    if (target.hp - actualDmg <= 0 && !window.matchResolved) { 
        actualDmg = target.hp; let aliveEnemies = window.enemies.filter(e => e.hp > 0).length;
        if (target.isPlayer || aliveEnemies <= 1) { 
            window.slowMoTimer = 180; // Trôi chậm siêu lâu (3 giây)
            window.targetZoom = 1.4;  // Zoom sát mặt nhân vật
            window.screenFlash = 1.0; // Chớp lóa trắng màn hình
            window.playSound(100, 'sine', 2.0, 0.8, true);
            
            // Chữ K.O rực lửa văng lên
            window.floatingTexts.push({ x: target.x, y: target.y - 100, text: "K.O!", color: "#ff4757", alpha: 1, vx: 0, vy: -1, font: "italic 900 80px Arial", life: 180 });
            window.shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 500, color: "#ff4757", alpha: 1, speed: 15});
        }
    }
    
    target.hp -= actualDmg; if(target.hp < 0) target.hp = 0;
    
    let hitWord = actualDmg > 0 ? `-${Math.round(actualDmg)}` : "";
    if (isCrit && !isWallBounce) { hitWord += " 💥"; window.screenFlash = 0.4; window.targetZoom = 1.08; window.shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 140, color: "#f1c40f", alpha: 1, speed: 12}); window.triggerVibration([40, 30, 40]); } 
    if (isWallBounce) { hitWord += " 🧱"; window.screenFlash = 0.2; window.shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); window.triggerVibration(60); } 
    
    if (actualDmg > 0 || isCrit || isWallBounce) {
        let dynamicSize = Math.min(50, 20 + actualDmg * 0.5); // Chữ to hơn, bạo lực hơn
        let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`;
        let rndX = (Math.random() - 0.5) * 40; let rndY = -Math.random() * 30 - 50 * (target.scale||1);
        window.floatingTexts.push({ x: target.x + rndX, y: target.y + rndY, text: hitWord.trim(), color: isCrit ? "#f1c40f" : color, alpha: 1, vx: (Math.random() - 0.5) * 6, vy: isCrit ? -8 : -5, font: fontStyle, life: 40 });
        for(let i=0; i < (isCrit?15:8); i++) { window.impactSparks.push({ x: target.x, y: target.y - 30, vx: (Math.random()-0.5)*20, vy: -Math.random()*15, life: 20, maxLife: 20, color: isCrit ? "#fff" : "#ff9f43" }); }
        if (target.isPlayer) window.uiShakeP1 = 20; else window.uiShakeP2 = 20;
    }
    window.spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); 
    if (typeof window.updateHPUIs === 'function') window.updateHPUIs();
}

window.attack = function(attacker, potentialTargets) {
    if (!attacker || attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
    if (!Array.isArray(potentialTargets)) potentialTargets = [potentialTargets];

    let cStep = attacker.comboStep || 0; let currentType = 'jab'; let dmgMult = 1; let knockback = 0; let liftVy = 0; let atkTime = 12;

    // CHUỖI COMBO 18 BƯỚC ĐỈNH CAO VÕ THUẬT
    if (cStep === 0) { currentType = 'jab'; atkTime = 10; dmgMult = 1.0; knockback = 0; attacker.vx = attacker.isFacingRight ? 4 : -4; }
    else if (cStep === 1) { currentType = 'cross'; atkTime = 12; dmgMult = 1.2; knockback = 1; attacker.vx = attacker.isFacingRight ? 5 : -5; }
    else if (cStep === 2) { currentType = 'low_kick'; atkTime = 14; dmgMult = 1.3; knockback = 0; attacker.vx = attacker.isFacingRight ? 3 : -3; }
    else if (cStep === 3) { currentType = 'hook'; atkTime = 14; dmgMult = 1.4; knockback = 2; attacker.vx = attacker.isFacingRight ? 4 : -4;}
    else if (cStep === 4) { currentType = 'spinning_backfist'; atkTime = 18; dmgMult = 1.6; knockback = 4; attacker.vx = attacker.isFacingRight ? 8 : -8; }
    else if (cStep === 5) { currentType = 'teep_kick'; atkTime = 16; dmgMult = 1.5; knockback = 8; }
    else if (cStep === 6) { currentType = 'elbow_strike'; atkTime = 16; dmgMult = 1.6; knockback = 2; attacker.vx = attacker.isFacingRight ? 8 : -8; }
    else if (cStep === 7) { currentType = 'flying_knee'; atkTime = 20; dmgMult = 1.8; knockback = 3; liftVy = -6; attacker.vx = attacker.isFacingRight ? 12 : -12; }
    else if (cStep === 8) { currentType = 'high_kick'; atkTime = 20; dmgMult = 1.8; knockback = 2; attacker.vx = attacker.isFacingRight ? 4 : -4; }
    else if (cStep === 9) { currentType = 'superman_punch'; atkTime = 20; dmgMult = 2.0; knockback = 8; liftVy = -4; attacker.vx = attacker.isFacingRight ? 15 : -15; } 
    else if (cStep === 10) { currentType = 'spinning_heel'; atkTime = 22; dmgMult = 2.2; knockback = 6; attacker.vx = attacker.isFacingRight ? 5 : -5; } 
    else if (cStep === 11) { currentType = 'palm_strike'; atkTime = 16; dmgMult = 2.0; knockback = 4; attacker.vx = attacker.isFacingRight ? 6 : -6; } 
    else if (cStep === 12) { currentType = 'tornado_kick'; atkTime = 24; dmgMult = 2.4; knockback = 5; liftVy = -5; attacker.vx = attacker.isFacingRight ? 8 : -8; }
    else if (cStep === 13) { currentType = 'shoulder_bash'; atkTime = 20; dmgMult = 2.5; knockback = 12; attacker.vx = attacker.isFacingRight ? 18 : -18; } 
    else if (cStep === 14) { currentType = 'uppercut'; atkTime = 22; dmgMult = 2.5; knockback = 2; liftVy = -12; }
    else if (cStep === 15) { currentType = 'axe_kick'; atkTime = 24; dmgMult = 3.0; knockback = 0; liftVy = 8; attacker.vx = attacker.isFacingRight ? 6 : -6; }
    else if (cStep === 16) { currentType = 'dragon_uppercut'; atkTime = 28; dmgMult = 3.5; knockback = 3; liftVy = -16; attacker.vx = attacker.isFacingRight ? 10 : -10; }
    else if (cStep === 17) { currentType = 'one_inch_punch'; atkTime = 38; dmgMult = 5.0; knockback = 25; attacker.vx = attacker.isFacingRight ? 15 : -15; } 

    attacker.state = currentType; attacker.attackTimer = atkTime; 
    let sfxFreq = (currentType.includes('kick') || currentType.includes('knee')) ? 450 : 800; if(currentType === 'one_inch_punch') sfxFreq = 200;
    window.playSound(sfxFreq, 'sine', 0.15, 0.1, false);
    
    let attackRange = (['axe_kick', 'one_inch_punch', 'high_kick', 'teep_kick', 'spinning_heel', 'tornado_kick', 'superman_punch'].includes(currentType)) ? 100 : 80;
    attackRange *= (attacker.scale || 1); 

    let isCrit = Math.random() < attacker.critChance; 
    let effectX = attacker.x + (attacker.isFacingRight ? 35 : -35);

    // KẾT HỢP HIỆU ỨNG VFX CHO TỪNG ĐÒN ĐÁNH
    if (currentType === 'one_inch_punch') { window.targetZoom = 1.2; window.shakeScreen(30, 20); window.shockwaves.push({x: effectX, y: attacker.y - 40, r: 10, maxR: 350, color: "#f1c40f", alpha: 1, speed: 25}); window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#f1c40f", true, 3.5, 0); } 
    else if (currentType === 'axe_kick') { window.shockwaves.push({x: effectX, y: window.GROUND_Y, r: 10, maxR: 180, color: "#1abc9c", alpha: 1, speed: 12}); window.spawnSlash(effectX, attacker.y - 30, attacker.isFacingRight, "#1abc9c", isCrit, 2.5, Math.PI/2); }
    else if (currentType === 'dragon_uppercut') { window.spawnSlash(effectX, attacker.y - 50, attacker.isFacingRight, "#ff4757", true, 2.8, -Math.PI/3); window.spawnParticles(effectX, attacker.y, "#ff4757", true); }
    else if (currentType === 'superman_punch') { window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#3498db", true, 2.2, 0); window.shockwaves.push({x: attacker.x, y: attacker.y, r: 10, maxR: 80, color: "#fff", alpha: 0.5, speed: 8}); }
    else if (currentType === 'tornado_kick') { window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#9b59b6", isCrit, 2.5, 0); window.spawnSlash(effectX, attacker.y - 50, !attacker.isFacingRight, "#8e44ad", isCrit, 2.0, 0); }
    else if (currentType === 'flying_knee') { window.spawnSlash(effectX, attacker.y - 30, attacker.isFacingRight, "#e67e22", isCrit, 2.0, -Math.PI/6); }
    else if (currentType === 'spinning_backfist') { window.spawnSlash(effectX, attacker.y - 45, attacker.isFacingRight, "#f39c12", isCrit, 1.8, Math.PI/8); }
    else if (currentType === 'shoulder_bash') { window.spawnSlash(effectX, attacker.y - 35, attacker.isFacingRight, "#e67e22", true, 2.0, Math.PI/2); }
    else if (currentType === 'palm_strike') { window.shockwaves.push({x: effectX, y: attacker.y - 40, r: 10, maxR: 100, color: "#3498db", alpha: 0.8, speed: 8}); window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#3498db", isCrit, 1.8, 0); }
    else if (currentType === 'spinning_heel') { window.spawnSlash(effectX, attacker.y - 50, attacker.isFacingRight, "#9b59b6", isCrit, 2.2, -Math.PI/8); }
    else if (currentType === 'high_kick') { window.spawnSlash(effectX, attacker.y - 50, attacker.isFacingRight, "#2ecc71", isCrit, 2.0, -Math.PI/6); }
    else if (currentType === 'teep_kick') { window.spawnSlash(effectX, attacker.y - 20, attacker.isFacingRight, "#ecf0f1", false, 1.5, Math.PI/2); }
    else if (currentType === 'backfist') { window.spawnSlash(effectX, attacker.y - 45, attacker.isFacingRight, "#e74c3c", isCrit, 1.8, 0); }
    else if (currentType === 'uppercut') { window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#9b59b6", true, 2.0, -Math.PI/4); }
    else if (currentType === 'knee_strike') { window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#e67e22", isCrit, 1.8, -Math.PI/8); }
    else if (currentType === 'elbow_strike') { window.spawnSlash(effectX, attacker.y - 45, attacker.isFacingRight, "#fff", isCrit, 1.5, Math.PI/4); }
    else if (currentType === 'hook') { window.spawnSlash(effectX, attacker.y - 45, attacker.isFacingRight, "#e67e22", isCrit, 1.5, 0); }
    else if (currentType === 'cross') { window.spawnSlash(effectX + 10, attacker.y - 40, attacker.isFacingRight, "#3498db", isCrit, 1.2, 0); }
    else if (currentType === 'low_kick') { window.spawnSlash(effectX, attacker.y - 15, attacker.isFacingRight, "#2ecc71", false, 1.2, Math.PI/8); }
    else { window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#ecf0f1", false, 1, 0); }

    let hitTargets = [];
    potentialTargets.forEach(defender => {
        if (!defender || defender.hp <= 0) return;
        if (defender.iFrames > 0) return; 

        let dist = defender.x - attacker.x; let isHit = false; let hitBoxAllowance = 40 * (defender.scale || 1);
        if (attacker.isFacingRight && dist >= -hitBoxAllowance && dist <= attackRange + hitBoxAllowance) isHit = true;
        if (!attacker.isFacingRight && dist <= hitBoxAllowance && dist >= -attackRange - hitBoxAllowance) isHit = true;
        if (Math.abs(attacker.y - defender.y) > 130 * Math.max(attacker.scale || 1, defender.scale || 1)) isHit = false; 
        
        if(isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        window.hitStopFrames = (['one_inch_punch', 'axe_kick', 'shoulder_bash', 'dragon_uppercut'].includes(currentType)) ? 10 : 4;
        hitTargets.forEach(defender => {
            window.playSound(150, 'sine', 0.2, isCrit ? 0.6 : 0.4, true);
            let baseDmg = 6 * (attacker.dmgMod || 1) * dmgMult * (1 + ((attacker.comboHits || 0) * 0.05));
            let isStunnedBonus = false;
            
            if (defender.state === 'stunned') { baseDmg *= 2.0; isStunnedBonus = true; } 
            if (isCrit) baseDmg *= (attacker.critMult || 1.5); baseDmg = Math.floor(baseDmg + Math.random() * 3); 

            window.takeDamage(defender, baseDmg, "#fff", isCrit, false);
            if (isStunnedBonus) { window.floatingTexts.push({ x: defender.x + (Math.random()-0.5)*20, y: defender.y - 50, text: "💥 x2!", color: "#e056fd", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 40 }); }

            if (defender.stunTimer > 0) { 
                defender.state = 'stunned'; defender.hitStun = 10; 
            } else { 
                defender.hitStun = (['one_inch_punch', 'shoulder_bash', 'dragon_uppercut'].includes(currentType)) ? 35 : 15; defender.state = 'hurt'; 
            }
            
            let pushForce = (attacker.comboHits > 0 && attacker.comboHits % 18 === 0) ? 50 : (isCrit ? 25 : knockback); defender.vx = attacker.isFacingRight ? pushForce : -pushForce; window.spawnDust(defender.x, defender.y);
            if (liftVy !== 0) { defender.vy = liftVy; defender.onGround = false; window.spawnDust(defender.x, window.GROUND_Y); }
            if (currentType === 'axe_kick') { defender.y = window.GROUND_Y; defender.vy = 0; defender.vx = 0; defender.state = 'stunned'; defender.stunTimer = 60; window.shakeScreen(15,10); }
            if (currentType === 'one_inch_punch') { defender.state = 'stunned'; defender.stunTimer = 80; }
            defender.comboHits = 0; 
        });
        attacker.comboHits++; attacker.comboTimeout = 120; 
    } else { attacker.comboHits = 0; }
}

window.playerUseSkill = function(skillType) {
    if (window.gameOver || !window.p1 || window.p1.attackTimer > 0 || window.p1.hitStun > 0 || window.cinematicTimer > 0 || window.slowMoTimer > 0 || window.p1.stunTimer > 0 || window.introTimer > 0) return;
    let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); 
    let gameContext = { floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    let effectX = window.p1.x + (window.p1.isFacingRight ? 35 : -35);

    if (skillType === 1 && window.p1.stamina >= 25) { 
        window.p1.stamina -= 25; 
        if (window.p1.skill && typeof window.p1.skill.actionCode1 === 'function') { window.p1.skill.actionCode1(window.p1, closestEnemy, gameContext); } 
        else { 
            // KỸ NĂNG 1 MỚI: ORA ORA ORA! (Máy khâu liên hoàn)
            window.p1.vx = window.p1.isFacingRight ? 15 : -15; window.p1.state = 'machine_gun_punches'; window.p1.attackTimer = 30; window.p1.iFrames = 15;
            let hits = 0;
            let punchInterval = setInterval(() => {
                if (window.gameOver || window.p1.hp <= 0) { clearInterval(punchInterval); return; }
                window.playSound(700, 'sine', 0.1, 0.1, false);
                let hitX = window.p1.x + (window.p1.isFacingRight ? 40 : -40);
                window.spawnSlash(hitX, window.p1.y - 30 - Math.random()*20, window.p1.isFacingRight, "#f1c40f", true, 1.2, (Math.random()-0.5));
                if (closestEnemy && Math.abs(closestEnemy.x - window.p1.x) < 100 && closestEnemy.iFrames <= 0) { 
                    window.takeDamage(closestEnemy, 8 * window.p1.dmgMod, "#f1c40f", true); 
                    closestEnemy.vx = window.p1.isFacingRight ? 2 : -2; 
                }
                hits++; if (hits >= 6) clearInterval(punchInterval);
            }, 80);
        }
    }
    if (skillType === 2 && window.p1.stamina >= 50) { 
        window.p1.stamina -= 50; 
        if (window.p1.skill && typeof window.p1.skill.actionCode2 === 'function') { window.p1.skill.actionCode2(window.p1, closestEnemy, gameContext); } 
        else { 
            // KỸ NĂNG 2 MỚI: DRAGON UPPERCUT (Móc Hàm Rồng Bay)
            window.p1.state = 'dragon_uppercut'; window.p1.attackTimer = 28; window.p1.vy = -16; window.p1.vx = window.p1.isFacingRight ? 12 : -12; window.p1.iFrames = 20;
            window.playSound(400, 'sine', 0.4, 0.2, false);
            window.spawnSlash(effectX, window.p1.y - 50, window.p1.isFacingRight, "#ff4757", true, 3.0, -Math.PI/2);
            window.shockwaves.push({x: effectX, y: window.GROUND_Y, r: 10, maxR: 120, color: "#ff4757", alpha: 1, speed: 10});
            if (closestEnemy && Math.abs(closestEnemy.x - window.p1.x) < 120 && closestEnemy.iFrames <= 0) { 
                closestEnemy.vy = -18; closestEnemy.onGround = false; 
                window.takeDamage(closestEnemy, 60 * window.p1.dmgMod, "#ff4757", true); 
            }
        }
    }
    if (skillType === 3 && window.p1.stamina >= 100) { 
        window.p1.stamina -= 100; 
        window.triggerCinematic(window.p1, () => { 
            if (window.p1.skill && typeof window.p1.skill.actionCode3 === 'function') { window.p1.skill.actionCode3(window.p1, closestEnemy, gameContext); } 
            else { 
                // KỸ NĂNG 3 MỚI: ASURA STRIKE (Ảo ảnh ngàn quyền)
                window.p1.superArmor = 40; window.p1.state = 'asura_strike'; window.p1.attackTimer = 40; window.p1.vy = 0; window.p1.vx = 0;
                window.screenFlash = 1.0; window.playSound(100, 'sine', 0.8, 0.8, true); 
                window.shockwaves.push({x: window.p1.x, y: window.GROUND_Y, r: 10, maxR: 400, color: "#9b59b6", alpha: 1, speed: 20});
                
                let asuraHits = 0;
                let asuraInterval = setInterval(() => {
                    if (window.gameOver || window.p1.hp <= 0) { clearInterval(asuraInterval); return; }
                    let slashX = window.p1.x + (window.p1.isFacingRight ? 60 : -60) + (Math.random()-0.5)*80;
                    let slashY = window.p1.y - 40 + (Math.random()-0.5)*80;
                    window.spawnSlash(slashX, slashY, window.p1.isFacingRight, "#9b59b6", true, 2.5 + Math.random(), Math.random()*Math.PI);
                    window.playSound(600, 'sawtooth', 0.1, 0.1, false);
                    asuraHits++; if (asuraHits >= 10) clearInterval(asuraInterval);
                }, 50);

                window.enemies.forEach(e => { 
                    if(Math.abs(e.x - window.p1.x) < 250 && e.iFrames <= 0) {
                        e.state = 'stunned'; e.stunTimer = 60;
                        window.takeDamage(e, 150 * window.p1.dmgMod, "#9b59b6", true); 
                    }
                }); 
            }
        });
    }
}

window.playerDodge = function(fighter = window.p1) {
    if (window.gameOver || !fighter || fighter.attackTimer > 0 || fighter.hitStun > 0 || window.cinematicTimer > 0 || window.slowMoTimer > 0 || fighter.stunTimer > 0 || window.introTimer > 0) return;
    if (fighter.stamina >= 15) { fighter.stamina -= 15; fighter.state = 'dash_back'; fighter.iFrames = 20; fighter.attackTimer = 15; window.playSound(600, 'sine', 0.2, 0.1, false); window.spawnDust(fighter.x, fighter.y); fighter.x += fighter.isFacingRight ? -35 : 35; window.spawnDust(fighter.x, fighter.y); window.shockwaves.push({x: fighter.x, y: fighter.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6}); window.triggerVibration(20); }
}
