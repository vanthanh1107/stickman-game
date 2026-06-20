window.takeDamage = function(target, amount, color, isCrit = false, isWallBounce = false) {
    if(!target || target.hp <= 0) return;
    if (target.iFrames > 0 && !isWallBounce) return; 
    if (target.shield > 0 && !isWallBounce) { target.shield--; window.spawnParticles(target.x, target.y, "#3498db"); return; }
    
    let actualDmg = amount;
    if (target.hp - amount <= 0 && !window.matchResolved) { 
        actualDmg = target.hp; let aliveEnemies = window.enemies.filter(e => e.hp > 0).length;
        if (target.isPlayer || aliveEnemies <= 1) { window.slowMoTimer = 100; window.screenFlash = 0.8; window.playSound(100, 'sine', 1.0, 0.6, true); }
    }
    target.hp -= actualDmg; if(target.hp < 0) target.hp = 0;
    
    let hitWord = actualDmg > 0 ? `-${Math.round(actualDmg)}` : "";
    if (isCrit && !isWallBounce) { hitWord += " 💥"; window.screenFlash = 0.4; window.targetZoom = 1.06; window.shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 140, color: "#f1c40f", alpha: 1, speed: 12}); window.triggerVibration([40, 30, 40]); } 
    if (isWallBounce) { hitWord += " 🧱"; window.screenFlash = 0.2; window.shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); window.triggerVibration(60); } 
    
    if (actualDmg > 0 || isCrit || isWallBounce) {
        let dynamicSize = Math.min(45, 18 + actualDmg * 0.4); 
        let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`;
        let rndX = (Math.random() - 0.5) * 40; let rndY = -Math.random() * 30 - 50 * (target.scale||1);
        window.floatingTexts.push({ x: target.x + rndX, y: target.y + rndY, text: hitWord.trim(), color: isCrit ? "#f1c40f" : color, alpha: 1, vx: (Math.random() - 0.5) * 6, vy: isCrit ? -8 : -5, font: fontStyle, life: 40 });
        for(let i=0; i < (isCrit?12:6); i++) { window.impactSparks.push({ x: target.x, y: target.y - 30, vx: (Math.random()-0.5)*18, vy: -Math.random()*12, life: 15, maxLife: 15, color: isCrit ? "#fff" : "#ff9f43" }); }
        if (target.isPlayer) window.uiShakeP1 = 15; else window.uiShakeP2 = 15;
    }
    window.spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); 
    if (typeof window.updateHPUIs === 'function') window.updateHPUIs();
}

window.attack = function(attacker, potentialTargets) {
    if (!attacker || attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
    if (!Array.isArray(potentialTargets)) potentialTargets = [potentialTargets];

    let cStep = attacker.comboStep || 0; let currentType = 'jab'; let dmgMult = 1; let knockback = 0; let liftVy = 0; let atkTime = 12;

    if (cStep === 0) { currentType = 'jab'; atkTime = 12; dmgMult = 1.0; knockback = 0; attacker.vx = attacker.isFacingRight ? 4 : -4; }
    else if (cStep === 1) { currentType = 'cross'; atkTime = 14; dmgMult = 1.2; knockback = 1; attacker.vx = attacker.isFacingRight ? 5 : -5; }
    else if (cStep === 2) { currentType = 'low_kick'; atkTime = 16; dmgMult = 1.3; knockback = 0; attacker.vx = attacker.isFacingRight ? 3 : -3; }
    else if (cStep === 3) { currentType = 'hook'; atkTime = 16; dmgMult = 1.4; knockback = 2; attacker.vx = attacker.isFacingRight ? 4 : -4;}
    else if (cStep === 4) { currentType = 'elbow_strike'; atkTime = 18; dmgMult = 1.6; knockback = 2; attacker.vx = attacker.isFacingRight ? 8 : -8; }
    else if (cStep === 5) { currentType = 'backfist'; atkTime = 18; dmgMult = 1.7; knockback = 3; attacker.vx = attacker.isFacingRight ? 6 : -6; }
    else if (cStep === 6) { currentType = 'teep_kick'; atkTime = 18; dmgMult = 1.5; knockback = 8; }
    else if (cStep === 7) { currentType = 'high_kick'; atkTime = 22; dmgMult = 1.8; knockback = 2; attacker.vx = attacker.isFacingRight ? 4 : -4; }
    else if (cStep === 8) { currentType = 'spinning_heel'; atkTime = 22; dmgMult = 2.0; knockback = 6; attacker.vx = attacker.isFacingRight ? 5 : -5; } 
    else if (cStep === 9) { currentType = 'shoulder_bash'; atkTime = 20; dmgMult = 2.2; knockback = 10; attacker.vx = attacker.isFacingRight ? 14 : -14; } 
    else if (cStep === 10) { currentType = 'palm_strike'; atkTime = 18; dmgMult = 2.0; knockback = 4; attacker.vx = attacker.isFacingRight ? 6 : -6; } 
    else if (cStep === 11) { currentType = 'uppercut'; atkTime = 24; dmgMult = 2.5; knockback = 2; liftVy = -12; }
    else if (cStep === 12) { currentType = 'knee_strike'; atkTime = 20; dmgMult = 2.8; knockback = 4; attacker.vx = attacker.isFacingRight ? 8 : -8; }
    else if (cStep === 13) { currentType = 'axe_kick'; atkTime = 26; dmgMult = 3.2; knockback = 0; liftVy = 8; attacker.vx = attacker.isFacingRight ? 6 : -6; }
    else if (cStep === 14) { currentType = 'one_inch_punch'; atkTime = 38; dmgMult = 5.0; knockback = 25; attacker.vx = attacker.isFacingRight ? 15 : -15; } 

    attacker.state = currentType; attacker.attackTimer = atkTime; 
    let sfxFreq = (currentType.includes('kick')) ? 450 : 800; if(currentType === 'one_inch_punch') sfxFreq = 200;
    window.playSound(sfxFreq, 'sine', 0.15, 0.1, false);
    
    let attackRange = (['axe_kick', 'one_inch_punch', 'high_kick', 'teep_kick', 'spinning_heel'].includes(currentType)) ? 100 : 80;
    attackRange *= (attacker.scale || 1); 

    let isCrit = Math.random() < attacker.critChance; 
    let effectX = attacker.x + (attacker.isFacingRight ? 35 : -35);

    if (currentType === 'one_inch_punch') { window.targetZoom = 1.2; window.shakeScreen(30, 20); window.shockwaves.push({x: effectX, y: attacker.y - 40, r: 10, maxR: 350, color: "#f1c40f", alpha: 1, speed: 25}); window.spawnSlash(effectX, attacker.y - 40, attacker.isFacingRight, "#f1c40f", true, 3.5, 0); } 
    else if (currentType === 'axe_kick') { window.shockwaves.push({x: effectX, y: window.GROUND_Y, r: 10, maxR: 180, color: "#1abc9c", alpha: 1, speed: 12}); window.spawnSlash(effectX, attacker.y - 30, attacker.isFacingRight, "#1abc9c", isCrit, 2.5, Math.PI/2); }
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
        let dist = defender.x - attacker.x; let isHit = false; let hitBoxAllowance = 35 * (defender.scale || 1);
        if (attacker.isFacingRight && dist > -hitBoxAllowance && dist <= attackRange + hitBoxAllowance) isHit = true;
        if (!attacker.isFacingRight && dist < hitBoxAllowance && dist >= -attackRange - hitBoxAllowance) isHit = true;
        if (Math.abs(attacker.y - defender.y) > 130 * Math.max(attacker.scale, defender.scale)) isHit = false; 
        if(isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        window.hitStopFrames = (['one_inch_punch', 'axe_kick', 'shoulder_bash'].includes(currentType)) ? 10 : 4;
        hitTargets.forEach(defender => {
            window.playSound(150, 'sine', 0.2, isCrit ? 0.6 : 0.4, true);
            let poiseDmg = isCrit ? 30 : (10 + cStep * 2); 
            let baseDmg = 6 * (attacker.dmgMod || 1) * dmgMult * (1 + (attacker.comboHits * 0.05));
            let isStunnedBonus = false;
            
            if (defender.state === 'stunned') { baseDmg *= 2.0; isStunnedBonus = true; } 
            if (isCrit) baseDmg *= attacker.critMult; baseDmg = Math.floor(baseDmg + Math.random() * 3); 

            if (defender.state === 'dash_back' && defender.iFrames > 0) return; 
            
            let isBlocked = false;
            if (defender.state === 'block') { isBlocked = true; baseDmg = Math.floor(baseDmg * 0.2); poiseDmg *= 2.5; window.playSound(300, 'sine', 0.1, 0.2, true); defender.vx = attacker.isFacingRight ? 5 : -5; } 
            
            let isCounter = defender.attackTimer > 0 && defender.state !== 'hurt' && defender.state !== 'stunned';
            if (isCounter) { window.spawnParticles(defender.x, defender.y - 40, "#fff", true); window.floatingTexts.push({ x: defender.x, y: defender.y - 60, text: "⚔️", color: "#fff", alpha: 1, vx: 0, vy: -2, font: "900 28px Arial", life: 30 }); baseDmg = Math.floor(baseDmg * 1.5); window.playSound(100, 'sine', 0.3, 0.6, true); window.hitStopFrames = 12; }

            window.takeDamage(defender, baseDmg, isBlocked ? "#bdc3c7" : "#fff", isCrit, false);
            if (isStunnedBonus) { window.floatingTexts.push({ x: defender.x + (Math.random()-0.5)*20, y: defender.y - 50, text: "💥 x2!", color: "#e056fd", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 40 }); }

            if (defender.shieldBreak > 0 && defender.state !== 'stunned') {
                defender.shieldBreak -= poiseDmg;
                if (defender.shieldBreak <= 0) {
                    defender.shieldBreak = 0; defender.stunTimer = 180; defender.maxStunTimer = 180; defender.state = 'stunned'; defender.hitStun = 0;
                    window.playSound(100, 'sawtooth', 0.5, 0.8, true); window.takeDamage(defender, 0, "#ff4757", false, false);
                    window.floatingTexts.push({ x: defender.x, y: defender.y - 80, text: "🛡️💥", color: "#ff4757", alpha: 1, vx: 0, vy: -3, font: "900 36px Arial", life: 60 });
                    window.shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 120, color: "#ff4757", alpha: 1, speed: 10}); window.shakeScreen(20, 10);
                }
            }

            if (defender.stunTimer > 0) { defender.state = 'stunned'; defender.hitStun = 10; } else { defender.hitStun = (['one_inch_punch', 'shoulder_bash'].includes(currentType) || isCounter) ? 35 : 15; defender.state = 'hurt'; }
            let pushForce = (attacker.comboHits > 0 && attacker.comboHits % 15 === 0) ? 50 : (isCrit ? 25 : knockback); defender.vx = attacker.isFacingRight ? pushForce : -pushForce; window.spawnDust(defender.x, defender.y);
            if (liftVy !== 0) { defender.vy = liftVy; defender.onGround = false; window.spawnDust(defender.x, window.GROUND_Y); }
            if (currentType === 'axe_kick') { defender.y = window.GROUND_Y; defender.vy = 0; defender.vx = 0; defender.state = 'stunned'; defender.stunTimer = 60; defender.shieldBreak = 0; window.shakeScreen(15,10); }
            if (currentType === 'one_inch_punch') { defender.state = 'stunned'; defender.stunTimer = 80; defender.shieldBreak = 0; }
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
            window.p1.vx = window.p1.isFacingRight ? 20 : -20; window.p1.state = 'dempsey_roll'; window.p1.attackTimer = 30; window.playSound(500, 'sine', 0.2, 0.1, false);
            window.spawnSlash(effectX, window.p1.y - 30, window.p1.isFacingRight, "#f1c40f", true, 1.5, Math.PI/4);
            setTimeout(() => { if(window.p1) { window.spawnSlash(effectX + (window.p1.isFacingRight?10:-10), window.p1.y - 45, !window.p1.isFacingRight, "#f39c12", true, 1.8, -Math.PI/4); window.playSound(500, 'sine', 0.2, 0.1, false); } }, 150);
            if (closestEnemy && Math.abs(closestEnemy.x - window.p1.x) < 120) { window.takeDamage(closestEnemy, 35 * window.p1.dmgMod, "#f1c40f", true); closestEnemy.vx = window.p1.isFacingRight?15:-15; }
        }
    }
    if (skillType === 2 && window.p1.stamina >= 50) { 
        window.p1.stamina -= 50; 
        if (window.p1.skill && typeof window.p1.skill.actionCode2 === 'function') { window.p1.skill.actionCode2(window.p1, closestEnemy, gameContext); } 
        else { 
            window.p1.state = 'axe_kick'; window.p1.attackTimer = 26; window.p1.vy = 0; window.p1.vx = window.p1.isFacingRight ? 8 : -8; window.playSound(400, 'sine', 0.3, 0.1, false);
            window.shockwaves.push({x: effectX, y: window.p1.y - 30, r: 10, maxR: 150, color: "#1abc9c", alpha: 1, speed: 10});
            if (closestEnemy && Math.abs(closestEnemy.x - window.p1.x) < 120) { closestEnemy.vy = -5; closestEnemy.onGround = false; window.takeDamage(closestEnemy, 40 * window.p1.dmgMod, "#1abc9c", true); }
        }
    }
    if (skillType === 3 && window.p1.stamina >= 100) { 
        window.p1.stamina -= 100; 
        window.triggerCinematic(window.p1, () => { 
            if (window.p1.skill && typeof window.p1.skill.actionCode3 === 'function') { window.p1.skill.actionCode3(window.p1, closestEnemy, gameContext); } 
            else { 
                window.p1.superArmor = 30; window.p1.state = 'one_inch_punch'; window.p1.attackTimer = 38; window.p1.vy = 0;
                window.shockwaves.push({x: window.p1.x, y: window.GROUND_Y, r: 10, maxR: 260, color: "#f1c40f", alpha: 1, speed: 14});
                window.playSound(100, 'sine', 0.5, 0.6, true); window.spawnSlash(window.p1.x, window.p1.y - 10, window.p1.isFacingRight, "#f1c40f", true, 3.5, 0);
                window.enemies.forEach(e => { if(Math.abs(e.x - window.p1.x) < 200) window.takeDamage(e, 100 * window.p1.dmgMod, "#f1c40f", true); }); 
            }
        });
    }
}

window.playerDodge = function(fighter = window.p1) {
    if (window.gameOver || !fighter || fighter.attackTimer > 0 || fighter.hitStun > 0 || window.cinematicTimer > 0 || window.slowMoTimer > 0 || fighter.stunTimer > 0 || window.introTimer > 0) return;
    if (fighter.stamina >= 15) { fighter.stamina -= 15; fighter.state = 'dash_back'; fighter.iFrames = 20; fighter.attackTimer = 15; window.playSound(600, 'sine', 0.2, 0.1, false); window.spawnDust(fighter.x, fighter.y); fighter.x += fighter.isFacingRight ? -35 : 35; window.spawnDust(fighter.x, fighter.y); window.shockwaves.push({x: fighter.x, y: fighter.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6}); window.triggerVibration(20); }
}
