// ==========================================
// UTILS.JS - BIẾN TOÀN CỤC, ÂM THANH, HIỆU ỨNG VÀ XỬ LÝ SÁT THƯƠNG
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.p1 = null; window.gameOver = false; window.isLoopRunning = false;
window.enemies = []; window.totalEnemyMaxHp = 0; window.rewardMultiplier = 1; 
window.shakeTime = 0; window.shakeMag = 0; window.hitStopFrames = 0; window.matchResolved = false;
window.screenFlash = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
window.slowMoTimer = 0; window.introTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0;
window.currentWeather = 'none'; window.weatherParticles = [];
window.GROUND_Y = 320; window.GRAVITY = 0.8; window.lastFrameTime = 0; window.FRAME_MIN_TIME = 1000 / 60;
window.matchTimer = 0; window.impactFrameTimer = 0;

window.camX = 0; window.camY = 0; window.currentZoom = 1; window.cameraTilt = 0;
window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0;

window.envHazards = []; window.WALL_PADDING = 40; window.koGlitchTimer = 0; 
window.envDamage = []; // Mảng chứa vết nứt môi trường

window.triggerVibration = function(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); window.isMuted = !window.isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } }

// HỆ THỐNG ÂM THANH KÉP (TRIANGLE + SQUARE)
window.playSound = function(freq, type, duration, vol, isImpact = false) { 
    if (window.isMuted) return; 
    try {
        if (!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        let t = window.audioCtx.currentTime; 
        
        let osc = window.audioCtx.createOscillator(); 
        let gain = window.audioCtx.createGain(); 
        osc.connect(gain); gain.connect(window.audioCtx.destination); 
        if (window.isRecording && window.recordAudioDestination) { gain.connect(window.recordAudioDestination); }
        
        let safeVol = Math.min(vol, 1.0); 
        
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : type; 
            osc.frequency.setValueAtTime(freq, t); 
            osc.frequency.exponentialRampToValueAtTime(15, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); 
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
            
            let snap = window.audioCtx.createOscillator();
            let snapGain = window.audioCtx.createGain();
            snap.type = 'square';
            snap.frequency.setValueAtTime(freq * 3, t);
            snap.frequency.exponentialRampToValueAtTime(30, t + 0.05);
            snapGain.gain.setValueAtTime(safeVol * 0.4, t);
            snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            
            snap.connect(snapGain); snapGain.connect(window.audioCtx.destination);
            if (window.isRecording && window.recordAudioDestination) { snapGain.connect(window.recordAudioDestination); }
            snap.start(t); snap.stop(t + 0.05);
        } else { 
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t); 
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); 
            gain.gain.setValueAtTime(0.01, t); 
            gain.gain.linearRampToValueAtTime(safeVol * 0.6, t + duration * 0.1); 
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
}

window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude; }
window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit) { window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { window.slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 1.5 : 1) * scale, rotation: rotation }); }
window.spawnParticles = function(x, y, color, isCrit = false) { let count = isCrit ? 20 : 10; for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 4 + 2 }); } }
window.spawnDust = function(x, y) { for(let i=0; i<8; i++) { window.particles.push({ x: x + (Math.random()*30-15), y: y, vx: (Math.random()-0.5)*5, vy: -Math.random()*3 - 0.5, life: 20, maxLife: 20, color: "rgba(189, 195, 199, 0.4)", size: Math.random() * 8 + 5 }); } }
window.triggerCinematic = function(caster, callback) { window.cinematicTimer = 50; window.cinematicCaster = caster; window.cinematicCallback = callback; window.targetZoom = 1.15; window.playSound(400, 'sine', 0.4, 0.2, false); }

// ==========================================
// HỆ THỐNG VẾT NỨT MÔI TRƯỜNG CHÂN THỰC 3.0 (FRACTAL CRACKS)
// ==========================================
window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {
    let cracks = [];
    let numCracks = (type === 'crater') ? 7 + Math.floor(Math.random()*5) : 4 + Math.floor(Math.random()*3);
    let maxRadius = 0;
    
    for(let i=0; i<numCracks; i++) {
        let angle;
        if (type === 'crater') angle = Math.random() * Math.PI * 2;
        else if (type === 'wall_left') angle = -Math.PI/2 + (Math.random() * Math.PI * 0.8) + Math.PI*0.1;
        else angle = Math.PI/2 + (Math.random() * Math.PI * 0.8) - Math.PI*0.4; 
        
        let len = (35 + Math.random()*60) * scale;
        if (len > maxRadius) maxRadius = len;
        
        let path = [{x: 0, y: 0}];
        let segments = 3 + Math.floor(Math.random()*2); 
        let currX = 0, currY = 0;
        let currAngle = angle;
        
        for(let s = 1; s <= segments; s++) {
            let segLen = len / segments;
            currAngle += (Math.random() - 0.5) * 1.0; 
            currX += Math.cos(currAngle) * segLen;
            currY += Math.sin(currAngle) * segLen;
            path.push({x: currX, y: currY});
            
            if (Math.random() < 0.4 && s < segments) {
                let branchAngle = currAngle + (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.4);
                let bLen = segLen * (0.8 + Math.random() * 0.5);
                cracks.push([
                    {x: currX, y: currY},
                    {x: currX + Math.cos(branchAngle) * bLen, y: currY + Math.sin(branchAngle) * bLen}
                ]);
            }
        }
        cracks.push(path);
    }
    
    for(let d=0; d < 12 * scale; d++) {
        window.particles.push({
            x: x + (Math.random()-0.5)*30,
            y: y + (Math.random()-0.5)*20,
            vx: (Math.random()-0.5)*10,
            vy: -Math.random()*10 - 4,
            life: 60, maxLife: 60,
            color: isBurning ? "#e74c3c" : "#57606f",
            size: Math.random()*5 + 3,
            isRubble: true 
        });
    }

    window.envDamage.push({ x: x, y: y, type: type, cracks: cracks, scale: scale, radius: maxRadius, isBurning: isBurning, life: 1200, maxLife: 1200 });
};

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
            target.state = 'ko_falling'; target.koTimer = 100; target.vy = -10; target.onGround = false;
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

    let MathDist = Math.abs(attacker.x - target.x);
    let reach = 85 * (attacker.scale || 1);
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
    if (['uppercut', 'dragon_uppercut', 'knee_strike', 'high_kick'].includes(selectedMove)) {
        slashAngle = -Math.PI / 5; 
    } else if (['axe_kick', 'elbow_strike', 'spinning_heel'].includes(selectedMove)) {
        slashAngle = Math.PI / 5; 
    } else if (['low_kick'].includes(selectedMove)) {
        slashAngle = Math.PI / 8; 
    } else {
        slashAngle = (Math.random() - 0.5) * 0.2; 
    }

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5;
        window.shakeScreen(15, 12);
        target.vx = (attacker.isFacingRight ? 5 : -5); 
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
    attacker.comboDisplayTimer = 90; 
    attacker.comboAlpha = 1;
    
    let staminaGain = isCrit ? 5.0 : 1.5;
    attacker.stamina += staminaGain;
    if (attacker.stamina > 100) attacker.stamina = 100;

    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, isFinisher ? 1.8 : 1.2, slashAngle);
};
