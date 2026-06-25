// ==========================================
// 4. COMBAT.JS - HỆ THỐNG CHIẾN ĐẤU & TRÍ TUỆ NHÂN TẠO (AI)
// ==========================================

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}

window.takeDamage = function(target, amount, color, isCrit, wallBounce, attacker = null) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;
    let finalDmg = amount;
    
    let ignoreShield = (attacker && attacker.classId && attacker.classId.toLowerCase().includes('dausi') && attacker.comboHits >= 3);
    
    if (target.superArmor > 0 && target.classId && target.classId.toLowerCase().includes('hove') && attacker && !ignoreShield) {
        window.playSound(600, 'square', 0.1, 0.8, true); 
        window.shakeScreen(5, 5);
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PARRY!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 24px Arial", life: 40 });
        window.spawnParticles(target.x, target.y - 40, "#f1c40f", true);
        attacker.vx = attacker.isFacingRight ? -12 : 12;
        attacker.hitStun = 25; attacker.state = 'hurt';
        return; 
    }
    
    if (target.shield > 0 && !ignoreShield) {
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
    if (!target || target.hp <= 0) { attacker.state = 'idle'; attacker.attackTimer = 10; return; }

    let type = (attacker.classId || "dausi").toLowerCase();
    let moves_Close = ['hook', 'elbow_strike', 'uppercut', 'knee_strike'];
    let moves_Mid   = ['jab', 'cross', 'low_kick', 'axe_kick'];
    let moves_Far   = ['teep_kick', 'high_kick', 'flying_knee'];
    let moves_Finisher = ['machine_gun_punches', 'dempsey_roll', 'dragon_uppercut'];
    
    let reachMult = 1.0; let speedMult = 1.0; let dmgMult = 1.0; let critMod = 1.0;
    let slashColor = attacker.color || "#e74c3c"; let hitIcon = "🥊";

    if (type.includes('satthu')) { 
        moves_Close = ['hook', 'backfist']; moves_Mid = ['palm_strike', 'spinning_backfist']; moves_Far = ['dash']; moves_Finisher = ['asura_strike'];
        reachMult = 0.7; speedMult = 1.6; dmgMult = 0.8; critMod = 2.0; slashColor = "#2ecc71"; hitIcon = "🔪";
    } else if (type.includes('phapsu')) { 
        moves_Close = ['palm_strike']; moves_Mid = ['cast']; moves_Far = ['cast']; moves_Finisher = ['cast'];
        reachMult = 4.0; speedMult = 0.7; dmgMult = 1.2; critMod = 0.5; slashColor = "#9b59b6"; hitIcon = "🔮";
    } else if (type.includes('hove')) { 
        moves_Close = ['uppercut', 'knee_strike']; moves_Mid = ['shoulder_bash', 'axe_kick']; moves_Far = ['teep_kick', 'dash']; moves_Finisher = ['dragon_uppercut'];
        reachMult = 1.1; speedMult = 0.6; dmgMult = 1.5; critMod = 0.8; slashColor = "#e67e22"; hitIcon = "🛡️";
        attacker.superArmor = 30; 
    } else if (type.includes('thichkhach')) { 
        moves_Close = ['elbow_strike', 'cross']; moves_Mid = ['spinning_heel', 'low_kick']; moves_Far = ['flying_knee', 'dash']; moves_Finisher = ['one_inch_punch'];
        reachMult = 1.4; speedMult = 1.3; dmgMult = 1.0; critMod = 1.5; slashColor = "#f1c40f"; hitIcon = "🗡️";
    } else if (type.includes('dausi')) {
        let comboBonus = Math.floor((attacker.comboHits || 0) / 3) * 0.1;
        speedMult += comboBonus; dmgMult += comboBonus;
        if ((attacker.comboHits || 0) >= 3) slashColor = "#ff4757"; 
    }

    let reach = 85 * (attacker.scale || 1) * reachMult;
    let MathDist = Math.abs(attacker.x - target.x);
    attacker.isFacingRight = target.x > attacker.x;

    let selectedMove = 'jab'; let isFinisher = false; let isCrit = false;
    
    if (attacker.comboStep >= 4 || Math.random() < 0.15) {
        selectedMove = moves_Finisher[Math.floor(Math.random() * moves_Finisher.length)];
        isFinisher = true; attacker.comboStep = 0;
    } else {
        if (MathDist < 55) { selectedMove = moves_Close[Math.floor(Math.random() * moves_Close.length)]; }
        else if (MathDist < 90 * reachMult) { selectedMove = moves_Mid[Math.floor(Math.random() * moves_Mid.length)]; }
        else { selectedMove = moves_Far[Math.floor(Math.random() * moves_Far.length)]; }
    }

    if (MathDist > reach && !isFinisher && selectedMove !== 'cast') {
        if (type.includes('satthu') && Math.random() < 0.6) {
            window.spawnParticles(attacker.x, attacker.y, "#2c3e50");
            attacker.x = target.x + (target.x > attacker.x ? -30 : 30);
            attacker.isFacingRight = target.x > attacker.x;
            window.spawnParticles(attacker.x, attacker.y, slashColor);
            window.playSound(400, 'sine', 0.2, 0.5);
            attacker.state = 'spinning_backfist'; attacker.attackTimer = 15;
            return;
        } else {
            attacker.vx = (attacker.isFacingRight ? 1 : -1) * attacker.currentSpeed * 3;
            attacker.state = 'dash'; attacker.attackTimer = 12; window.spawnDust(attacker.x, attacker.y); return;
        }
    }

    attacker.state = selectedMove; 
    attacker.attackTimer = isFinisher ? Math.floor(35 / speedMult) : Math.floor(18 / speedMult);
    
    let forwardPush = isFinisher ? 5 : 2;
    if (selectedMove === 'dash') forwardPush = 8;
    if (type.includes('phapsu')) forwardPush = -1; 
    
    attacker.vx = (attacker.isFacingRight ? 1 : -1) * forwardPush;
    let baseDmg = 12 * attacker.currentDmgMod * dmgMult; let finalDmg = baseDmg; 

    if (selectedMove === 'cast') {
        window.playSound(400, 'sine', 0.3, 0.4);
        if (isFinisher) {
            window.projectiles.push({ x: target.x, y: -50, vx: 0, vy: 15, radius: 15, color: slashColor, dmg: Math.floor(baseDmg * 3), target: target, isMeteor: true });
            window.floatingTexts.push({ x: attacker.x, y: attacker.y - 80, text: "☄️", color: slashColor, alpha: 1, vx: 0, vy: -2, font: "900 20px Arial", life: 40 });
        } else {
            let elements = ['ice', 'fire', 'lightning'];
            let el = elements[Math.floor(Math.random() * elements.length)];
            let pColor = el === 'ice' ? '#74b9ff' : (el === 'fire' ? '#ff7675' : '#fdcb6e');
            let pIcon = el === 'ice' ? '❄️' : (el === 'fire' ? '🔥' : '⚡');
            let projVx = attacker.isFacingRight ? 15 : -15;
            window.projectiles.push({ x: attacker.x, y: attacker.y - 40, vx: projVx, vy: 0, radius: 10, color: pColor, dmg: Math.floor(baseDmg), target: target, element: el, icon: pIcon });
        }
        attacker.comboHits = (attacker.comboHits || 0) + 1;
        return; 
    }

    if (type.includes('thichkhach') && MathDist > reach * 0.5 && Math.random() < 0.5) {
        let waveVx = attacker.isFacingRight ? 14 : -14;
        window.spawnProjectile(attacker.x, attacker.y - 40, waveVx, 0, 15, slashColor, Math.floor(baseDmg * 0.8), target, null, 'sword_wave');
        window.playSound(450, 'sine', 0.2, 0.5);
    }

    let slashAngle = (Math.random() - 0.5) * 0.2; 
    if (['uppercut', 'dragon_uppercut', 'knee_strike', 'high_kick'].includes(selectedMove)) slashAngle = -Math.PI / 5; 
    else if (['axe_kick', 'elbow_strike', 'spinning_heel'].includes(selectedMove)) slashAngle = Math.PI / 5; 
    else if (['low_kick'].includes(selectedMove)) slashAngle = Math.PI / 8; 

    if (type.includes('hove') && (selectedMove === 'shoulder_bash' || isFinisher)) {
        window.shockwaves.push({x: attacker.x, y: window.GROUND_Y, r: 10, maxR: 150, color: "#e67e22", alpha: 1, speed: 20});
        window.shakeScreen(12, 8); window.playSound(100, 'triangle', 0.5, 1.0, true);
        targetGroup.forEach(e => {
            if (e && e.hp > 0 && Math.abs(e.x - attacker.x) < 150 && e !== attacker) {
                e.stunTimer = 60; e.state = 'stunned';
                window.floatingTexts.push({ x: e.x, y: e.y - 50, text: "💥", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "900 25px Arial", life: 40 });
            }
        });
    }

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5;
        window.shakeScreen(15, 12); target.vx = (attacker.isFacingRight ? 5 : -5); target.state = 'hurt'; target.hitStun = 45;
        window.spawnParticles(target.x, target.y - 40, slashColor, true);
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: hitIcon, color: slashColor, alpha: 1, vx: (Math.random()-0.5)*2, vy: -4, font: "900 45px Arial", life: 50 });
        slashAngle = -Math.PI / 4;
    } else {
        if (Math.random() < (attacker.critChance * critMod)) {
            isCrit = true; finalDmg = baseDmg * attacker.critMult;
            window.floatingTexts.push({ x: target.x + (Math.random()*40-20), y: target.y - 60, text: "💢", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "italic 900 30px Arial", life: 30 });
        } else { window.playSound(350, 'sine', 0.1, 0.1, false); }
        
        if (['low_kick', 'teep_kick', 'shoulder_bash'].includes(selectedMove) && Math.random() < 0.4) {
            target.stunTimer = 35; target.state = 'stunned'; 
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "💫", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "900 35px Arial", life: 40 });
        }
        if (['uppercut', 'elbow_strike', 'axe_kick'].includes(selectedMove) && Math.random() < 0.3) {
            finalDmg *= 1.5; window.spawnParticles(target.x, target.y - 60, "#c0392b", true);
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🩸", color: "#c0392b", alpha: 1, vx: 0, vy: -1, font: "900 35px Arial", life: 40 });
        }
        target.vx = (attacker.isFacingRight ? 2 : -2); target.hitStun = 15; target.state = 'hurt';
    }

    if (type.includes('satthu') && target.hp > 0) {
        target.bleedTimer = 150; 
        target.bleedDmg = Math.floor(finalDmg * 0.15);
    }

    if (typeof window.takeDamage === 'function') { window.takeDamage(target, Math.floor(finalDmg), isCrit ? slashColor : "#fff", isCrit, false, attacker); }
    attacker.comboHits = (attacker.comboHits || 0) + 1;
    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? slashColor : "#ecf0f1", isCrit, isFinisher ? 1.8 : 1.2, slashAngle);
};
