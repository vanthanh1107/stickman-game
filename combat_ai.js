// ==========================================
// COMBAT_AI.JS - TRÍ TUỆ NHÂN TẠO BOSS VÀ HỆ THỐNG VÕ THUẬT MMA
// ==========================================

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}

window.takeDamage = function(target, amount, color, isCrit, wallBounce) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;
    let finalDmg = amount;
    if (target.shield > 0) {
        target.shield -= finalDmg;
        if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; }
        window.playSound(300, 'sine', 0.2, 0.4, true); window.spawnParticles(target.x, target.y - 40, "#3498db");
    }

    if (finalDmg > 0) {
        target.hp -= finalDmg; if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥 -${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        window.floatingTexts.push({ x: target.x + (Math.random()*40-20), y: target.y - 60 - Math.random()*20, text: dmgText, color: color || (isCrit ? "#ff4757" : "#fff"), alpha: 1, vx: (Math.random()-0.5)*2, vy: -2 - Math.random()*2, font: isCrit ? "900 32px Arial" : "bold 24px Arial", life: 40 });

        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);
        if (target.superArmor <= 0) { target.state = 'hurt'; target.hitStun = isCrit ? 20 : 12; target.attackTimer = 0; target.comboStep = 0; }
        if (wallBounce) { target.vx = target.isFacingRight ? -4 : 4; } 
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (target.hp <= 0) {
            window.impactFrameTimer = 6; window.hitStopFrames = 6; window.shakeScreen(20, 15); window.targetZoom = 1.3; 
            window.playSound(80, 'square', 1.5, 0.8, true); window.koGlitchTimer = 60; 
            target.state = 'ko_falling'; target.koTimer = 100; target.vy = -8; target.onGround = false;
        } else if (isCrit) {
            window.impactFrameTimer = 2; window.hitStopFrames = 2; window.shakeScreen(10, 8); window.targetZoom = 1.1; 
            window.playSound(180, 'square', 0.3, 0.6, true);
        } else {
            window.hitStopFrames = 0; window.shakeScreen(3, 3); 
            window.playSound(250, 'sine', 0.15, 0.3, true);
        }
    }
};

window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) { attacker.state = 'jab'; attacker.attackTimer = 10; return; }

    let MathDist = Math.abs(attacker.x - target.x); let reach = 85 * (attacker.scale || 1);
    attacker.isFacingRight = target.x > attacker.x;
    
    let moves_Close = ['hook', 'elbow_strike', 'uppercut', 'knee_strike', 'backfist'];
    let moves_Mid = ['jab', 'cross', 'low_kick', 'axe_kick', 'palm_strike'];
    let moves_Far = ['teep_kick', 'high_kick', 'spinning_heel', 'shoulder_bash'];
    let moves_Finisher = ['dragon_uppercut', 'asura_strike', 'dempsey_roll', 'one_inch_punch'];

    let selectedMove = 'jab'; let isFinisher = false; let isCrit = false;
    if (attacker.comboStep >= 4 || Math.random() < 0.15) {
        selectedMove = moves_Finisher[Math.floor(Math.random() * moves_Finisher.length)];
        isFinisher = true; attacker.comboStep = 0;
    } else {
        if (MathDist < 55) { selectedMove = moves_Close[Math.floor(Math.random() * moves_Close.length)]; }
        else if (MathDist < 90) { selectedMove = moves_Mid[Math.floor(Math.random() * moves_Mid.length)]; }
        else { selectedMove = moves_Far[Math.floor(Math.random() * moves_Far.length)]; }
    }

    if (MathDist > reach && !isFinisher) {
        attacker.vx = (attacker.isFacingRight ? 1 : -1) * attacker.currentSpeed * 3;
        attacker.state = 'dash'; attacker.attackTimer = 12; window.spawnDust(attacker.x, attacker.y); return;
    }

    attacker.state = selectedMove; attacker.attackTimer = isFinisher ? 30 : 18;
    attacker.vx = (attacker.isFacingRight ? 1 : -1) * (isFinisher ? 5 : 1.5); 

    let baseDmg = 12 * attacker.currentDmgMod; let finalDmg = baseDmg; 
    let slashAngle = 0; 
    if (['uppercut', 'dragon_uppercut', 'knee_strike', 'high_kick'].includes(selectedMove)) { slashAngle = -Math.PI / 5; } 
    else if (['axe_kick', 'elbow_strike', 'spinning_heel'].includes(selectedMove)) { slashAngle = Math.PI / 5; } 
    else if (['low_kick'].includes(selectedMove)) { slashAngle = Math.PI / 8; } 
    else { slashAngle = (Math.random() - 0.5) * 0.2; }

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5;
        window.shakeScreen(15, 12); target.vx = (attacker.isFacingRight ? 5 : -5); 
        target.state = 'hurt'; target.hitStun = 45;
        window.spawnParticles(target.x, target.y - 40, "#ff4757", true);
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "💥", color: "#ff4757", alpha: 1, vx: (Math.random()-0.5)*2, vy: -4, font: "900 45px Arial", life: 50 });
    } else {
        if (Math.random() < attacker.critChance) {
            isCrit = true; finalDmg = baseDmg * attacker.critMult;
            window.floatingTexts.push({ x: target.x + (Math.random()*40-20), y: target.y - 60, text: "💢", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "italic 900 30px Arial", life: 30 });
        } else { window.playSound(350, 'sine', 0.1, 0.1, false); }
        
        if ((selectedMove === 'low_kick' || selectedMove === 'teep_kick') && Math.random() < 0.4) {
            target.stunTimer = 35; target.state = 'stunned'; 
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🦵", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "900 35px Arial", life: 40 });
        }
        if ((selectedMove === 'uppercut' || selectedMove === 'elbow_strike') && Math.random() < 0.3) {
            finalDmg *= 1.5; window.spawnParticles(target.x, target.y - 60, "#c0392b", true);
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🩸", color: "#c0392b", alpha: 1, vx: 0, vy: -1, font: "900 35px Arial", life: 40 });
        }
        target.vx = (attacker.isFacingRight ? 2 : -2); target.hitStun = 15; target.state = 'hurt';
    }

    if (typeof window.takeDamage === 'function') { window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, false); }
    attacker.comboHits = (attacker.comboHits || 0) + 1;
    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, isFinisher ? 1.8 : 1.2, slashAngle);
};

// HÀM QUẢN LÝ BỘ NÃO AI (Được tách ra từ hàm Update)
window.processFighterAI = function(f, gameContext) {
    if (f.isDragon) {
        if (f.hp > 0 && f.hp <= f.maxHp * 0.3 && !f.isEvolved) { f.isEvolved = true; window.slowMoTimer = 60; window.screenFlash = 1.0; window.shakeScreen(50, 15); window.playSound(50, 'sawtooth', 2.0, 1.0, true); f.color = "#8e44ad"; f.scale *= 1.25; window.floatingTexts.push({ x: f.x, y: f.y - 150, text: "🐉🔥", color: "#8e44ad", alpha: 1, vx: 0, vy: -3, font: "italic 900 60px Arial", life: 100 }); window.shockwaves.push({x: f.x, y: window.GROUND_Y, r: 10, maxR: 500, color: "#8e44ad", alpha: 1, speed: 25}); }
        let targetFighter = window.p1;
        if (targetFighter && targetFighter.hp > 0) {
            let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
            if (f.aiDelay <= 0) {
                f.aiDelay = f.isEvolved ? 0 : Math.floor(Math.random() * 20) + 20; let randAction = Math.random();
                if (randAction < 0.45) { f.state = 'breathe_fire'; f.attackTimer = 40; f.vx = 0; window.playSound(250, 'sawtooth', 0.6, 0.3, false); let fireCount = 0; let fireInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(fireInterval); return; } let fireVx = f.isFacingRight ? (f.isEvolved ? 15 : 11) : (f.isEvolved ? -15 : -11); if (f.isEvolved) { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, -3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 0, 15, "#8e44ad", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); } else { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, (Math.random() - 0.5) * 4, 13, "#e74c3c", Math.floor(25 * f.dmgMod), window.p1 ); } fireCount++; if (fireCount >= (f.isEvolved ? 8 : 6)) clearInterval(fireInterval); }, f.isEvolved ? 60 : 85); } 
                else if (randAction < 0.85) { f.state = 'scratch'; f.attackTimer = 30; f.vx = Math.sign(dist) * (f.currentSpeed * (f.isEvolved ? 2.0 : 1.6)); let scratchCount = 0; let scratchInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(scratchInterval); return; } if (Math.abs(window.p1.x - f.x) < (f.isEvolved ? 160 : 130)) { window.takeDamage(window.p1, Math.floor(10 * f.dmgMod * (f.isEvolved ? 1.5 : 1)), f.isEvolved ? "#9b59b6" : "#ff7675", Math.random() < 0.25); window.shakeScreen(6, 4); } scratchCount++; if (scratchCount >= 5) clearInterval(scratchInterval); }, f.isEvolved ? 50 : 70); } 
                else { f.vx = Math.sign(dist) * (f.currentSpeed * 0.3); f.state = 'walk'; }
            }
        }
    } 
    else if (f.isBruceLee) {
        let targetFighter = window.p1;
        if (targetFighter && targetFighter.hp > 0) {
            let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
            if (f.aiDelay <= 0) {
                f.aiDelay = Math.floor(Math.random() * 12) + 6; let randAction = Math.random();
                if (absDist > 110) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.5; if (Math.random() < 0.3) { f.state = 'dash'; f.dashTimer = 8; f.dashDir = Math.sign(dist); window.spawnDust(f.x, f.y); } } 
                else if (randAction < 0.33) { 
                    f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 4; window.playSound(380, 'square', 0.25, 0.9, true); 
                    if (absDist < 65) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(32 * f.currentDmgMod), "#f1c40f", true, false); window.p1.vx = Math.sign(dist) * 6; window.shakeScreen(15, 12); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: "🗣️", color: "#f1c40f", alpha: 1, vx: 0, vy: -3, font: "900 40px Arial", life: 50 }); } 
                } 
                else if (randAction < 0.66) { 
                    f.state = 'high_kick'; f.attackTimer = 28; f.vx = Math.sign(dist) * 5; let kickCount = 0; 
                    let kickInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(kickInterval); return; } if (Math.abs(window.p1.x - f.x) < 85) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(12 * f.currentDmgMod), "#ecf0f1", false, false); window.p1.vx = Math.sign(dist) * 3; window.shakeScreen(4, 3); } kickCount++; if (kickCount >= 3) clearInterval(kickInterval); }, 70); 
                    window.floatingTexts.push({ x: f.x, y: f.y - 100, text: "👟", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); 
                } 
                else { 
                    f.state = 'machine_gun_punches'; f.attackTimer = 30; f.vx = Math.sign(dist) * 2.5; window.playSound(280, 'sine', 0.4, 0.5); 
                    if (absDist < 85) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(16 * f.currentDmgMod), "#f1c40f", false, false); window.shakeScreen(5, 4); window.spawnParticles(window.p1.x, window.p1.y, "#f1c40f"); } 
                }
            }
        }
    }
    else if (f.isSamurai) {
        let targetFighter = window.p1;
        if (targetFighter && targetFighter.hp > 0) {
            let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
            if (f.aiDelay <= 0) {
                f.aiDelay = Math.floor(Math.random() * 20) + 30; 
                if (absDist > 250 && Math.random() < 0.6) { f.state = 'cast'; f.attackTimer = 25; window.playSound(300, 'sine', 0.3, 0.6); window.spawnSlash(f.x + (f.isFacingRight? 50:-50), f.y - 40, f.isFacingRight, "#fff", true, 2.0, Math.PI/2); window.spawnProjectile(f.x, f.y - 40, f.isFacingRight ? 12 : -12, 0, 15, "#fff", Math.floor(25 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🗡️", color: "#fff", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); } 
                else { 
                    f.state = 'dash'; f.dashTimer = 15; f.dashDir = Math.sign(dist); f.currentSpeed *= 2.5; f.iFrames = 20; window.playSound(400, 'sawtooth', 0.4, 0.8, true); 
                    setTimeout(() => { if(window.gameOver || f.hp <= 0 || !window.p1) return; if(Math.abs(window.p1.x - f.x) < 180) { if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(40 * f.dmgMod), "#e74c3c", true, false); window.shakeScreen(20, 15); window.p1.vx = Math.sign(dist) * 6; } window.spawnSlash(f.x, window.p1.y - 30, f.isFacingRight, "#e74c3c", true, 3.0, (Math.random()-0.5)); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "⚡", color: "#e74c3c", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); }, 200); 
                }
            } else if (absDist > 150) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 0.5; }
        }
    }
    else if (f.isNinja) {
        let targetFighter = window.p1;
        if (targetFighter && targetFighter.hp > 0) {
            let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
            if (f.aiDelay <= 0) {
                f.aiDelay = Math.floor(Math.random() * 15) + 15; let randAction = Math.random();
                if (randAction < 0.4) { f.state = 'cast'; f.attackTimer = 20; window.playSound(400, 'sine', 0.2, 0.4); window.spawnProjectile(f.x, f.y - 50, f.isFacingRight ? 15 : -15, 0, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); if(Math.random() < 0.5) window.spawnProjectile(f.x, f.y - 60, f.isFacingRight ? 14 : -14, -3, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🥷", color: "#9b59b6", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 30 }); } 
                else if (randAction < 0.7) { window.spawnParticles(f.x, f.y, "#2c3e50"); f.x = window.p1.x + (window.p1.isFacingRight ? -80 : 80); f.y = window.p1.y; f.isFacingRight = window.p1.x > f.x; window.spawnParticles(f.x, f.y, "#9b59b6"); f.state = 'spinning_backfist'; f.attackTimer = 15; window.playSound(200, 'square', 0.2, 0.6); if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(20 * f.dmgMod), "#9b59b6", false, false); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "💨", color: "#8e44ad", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 30 }); } 
                else { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 2.5; }
            }
        }
    }
    else {
        let targetGroup = f.isPlayer ? window.enemies : [window.p1]; let closest = window.getClosestEnemy(f, targetGroup);
        if (closest && closest.hp > 0) {
            let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);
            if (absDist > reach) { f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) window.spawnDust(f.x, f.y); } 
            else {
                f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                if (f.aiDelay <= 0) {
                    f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; let usedSkill = false;
                    if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.05) { f.stamina -= 100; usedSkill = true; window.triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                    if (!usedSkill) { let rand = Math.random(); if (closest.attackTimer > 0 || closest.state === 'dash') { if (rand < 0.4) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; window.spawnDust(f.x, f.y); } else { if(typeof window.attack === 'function') window.attack(f, targetGroup); } } else { if (rand < 0.9) { if (f.comboTimer > 0 && f.comboStep < 14) { f.comboStep++; } else { f.comboStep = 0; } f.comboTimer = 50; if(typeof window.attack === 'function') window.attack(f, targetGroup); } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } } }
                }
            }
        } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
    }
};
