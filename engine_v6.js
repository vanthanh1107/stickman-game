// ==========================================
// ENGINE.JS - THE ABSOLUTE ULTIMATE MASTERPIECE 8.0
// [PHIÊN BẢN ULTIMATE WEATHER - KHÔNG GỘP DÒNG - FULL TÍNH NĂNG & VFX]
// [ĐÃ NÂNG CẤP: 8 HIỆU ỨNG THỜI TIẾT ĐIÊN RỒ KHÔNG LAG CHUẨN 60FPS]
// [ĐÃ FIX: TRIỆT TIÊU LỖI KẸT NHÂN VẬT & ĐỒNG BỘ AVATAR CHUẨN ESPORTS]
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; 

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
window.globalWind = 0; window.chromaTimer = 0; 

window.envHazards = []; window.WALL_PADDING = 40; window.koGlitchTimer = 0; 
window.envDamage = []; 

window.timeStopTimer = 0; window.timeStopCaster = null;
window.screenFilter = null; window.filterTimer = 0;

// Giới hạn số lượng hạt (Particles) để chống lag
const MAX_PARTICLES = 150; 
const MAX_SHOCKWAVES = 5;

// ==========================================
// 1. HỆ THỐNG ÂM THANH & RUNG
// ==========================================
window.triggerVibration = function(pattern) { 
    if (typeof window !== 'undefined' && navigator && navigator.vibrate) { 
        try { navigator.vibrate(pattern); } catch(e) {} 
    } 
}

window.toggleAudio = function(e) { 
    e.stopPropagation(); window.isMuted = !window.isMuted; 
    let btn = document.getElementById("btn-audio"); 
    if(btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; 
    if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } 
}

window.speakAnnouncer = function(text) { 
    if (window.isMuted || typeof speechSynthesis === 'undefined') return; 
    window.speechSynthesis.cancel(); 
    let utterance = new SpeechSynthesisUtterance(text); 
    utterance.lang = "en-US"; utterance.pitch = 0.5; utterance.rate = 1.0; 
    window.speechSynthesis.speak(utterance); 
};

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

// ==========================================
// 2. HỆ THỐNG SPAWN VFX (CÓ CHỐNG LAG)
// ==========================================
window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude; }

window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { 
    window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); 
}

window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit) { 
    window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); 
}

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 1.5 : 1) * scale, rotation: rotation }); 
}

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; // Chống lag: Không sinh thêm hạt nếu quá tải
    let count = isCrit ? 15 : 8; 
    for(let i=0; i<count; i++) { 
        let angle = Math.random() * Math.PI * 2; 
        let speed = Math.random() * (isCrit?12:6) + 2; 
        window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 4 + 2 }); 
    } 
}

window.spawnDust = function(x, y) { 
    if (window.particles.length > MAX_PARTICLES) return;
    for(let i=0; i<6; i++) { 
        window.particles.push({ x: x + (Math.random()*30-15), y: y, vx: (Math.random()-0.5)*5, vy: -Math.random()*3 - 0.5, life: 20, maxLife: 20, color: "rgba(189, 195, 199, 0.4)", size: Math.random() * 8 + 5 }); 
    } 
}

window.triggerCinematic = function(caster, callback) { 
    window.cinematicTimer = 50; window.cinematicCaster = caster; window.cinematicCallback = callback; window.targetZoom = 1.15; window.playSound(400, 'sine', 0.4, 0.2, false); 
}

window.spawnAura = function(x, y, color, radius, duration) { 
    window.auras.push({ x: x, y: y, color: color, r: radius, life: duration, maxLife: duration }); 
}

window.spawnLaser = function(x, y, isRight, color, width, duration) { 
    window.lasers.push({ x: x, y: y, isRight: isRight, color: color, width: width, life: duration, maxLife: duration }); 
}

window.focusCinematic = function(frames) { window.screenFlash = -frames; }

window.applyFilter = function(type, frames) { window.screenFilter = type; window.filterTimer = frames; }

window.triggerTimeStop = function(frames, caster) { 
    window.timeStopTimer = frames; window.timeStopCaster = caster; 
    window.applyFilter('invert', frames); 
    window.playSound(100, 'square', 1.0, 1.0, true); window.shakeScreen(20, 15); 
    if (window.shockwaves.length < MAX_SHOCKWAVES) {
        window.shockwaves.push({x: caster.x, y: caster.y, r: 10, maxR: 1500, color: "#fff", alpha: 1, speed: 40}); 
    }
}

window.spawnCustomObj = function(x, y, vx, vy, textOrEmoji, color, font, duration, isSpinning = false) { 
    window.customObjs.push({ x: x, y: y, vx: vx, vy: vy, text: textOrEmoji, color: color, font: font, life: duration, maxLife: duration, spin: isSpinning, ang: 0 }); 
}

// ==========================================
// 3. HỆ THỐNG VẾT NỨT MÔI TRƯỜNG CHÂN THỰC 4.0
// ==========================================
window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {
    let cracks = [];
    let numCracks = (type === 'crater') ? 6 + Math.floor(Math.random()*4) : 4 + Math.floor(Math.random()*3); // Giảm số lượng nứt để đỡ lag
    let maxRadius = 0;
    
    for(let i=0; i<numCracks; i++) {
        let angle;
        if (type === 'crater') {
            let step = (Math.PI * 0.8) / Math.max(1, numCracks - 1);
            angle = Math.PI * 0.1 + step * i + (Math.random() - 0.5) * 0.2;
        }
        else if (type === 'wall_left') angle = -Math.PI/2 + (Math.random() * Math.PI * 0.8) + Math.PI*0.1;
        else angle = Math.PI/2 + (Math.random() * Math.PI * 0.8) - Math.PI*0.4; 
        
        let len = (30 + Math.random()*50) * scale;
        if (len > maxRadius) maxRadius = len;
        
        let path = [{x: 0, y: 0}];
        let segments = 3 + Math.floor(Math.random()*2); 
        let currX = 0, currY = 0;
        let currAngle = angle;
        
        for(let s = 1; s <= segments; s++) {
            let segLen = len / segments;
            currAngle += (Math.random() - 0.5) * 0.8; 
            currX += Math.cos(currAngle) * segLen;
            currY += Math.sin(currAngle) * segLen;
            path.push({x: currX, y: currY});
            
            if (Math.random() < 0.4 && s < segments) {
                let branchAngle = currAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5);
                let bLen = segLen * (0.6 + Math.random() * 0.6);
                cracks.push([
                    {x: currX, y: currY},
                    {x: currX + Math.cos(branchAngle) * bLen, y: currY + Math.sin(branchAngle) * bLen}
                ]);
            }
        }
        cracks.push(path);
    }
    
    if (window.particles.length < MAX_PARTICLES) {
        for(let d=0; d < 8 * scale; d++) {
            window.particles.push({
                x: x + (Math.random()-0.5)*30,
                y: y + (Math.random()-0.5)*20,
                vx: (Math.random()-0.5)*10,
                vy: -Math.random()*10 - 4,
                life: 40, maxLife: 40,
                color: isBurning ? "#e74c3c" : "#57606f",
                size: Math.random()*4 + 2,
                isRubble: true 
            });
        }
    }

    window.envDamage.push({ x: x, y: y, type: type, cracks: cracks, scale: scale, radius: maxRadius, isBurning: isBurning, life: 800, maxLife: 800 });
    if (window.envDamage.length > 3) { window.envDamage.shift(); } // Chỉ giữ tối đa 3 vết nứt
};

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { 
        if (targetsArray[i].hp <= 0) continue; 
        let d = Math.abs(source.x - targetsArray[i].x); 
        if (d < minDist) { minDist = d; closest = targetsArray[i]; } 
    }
    return closest.hp > 0 ? closest : null;
}

// ==========================================
// 4. HỆ THỐNG VẬT LÝ NHẬN SÁT THƯƠNG
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;
    let finalDmg = amount;

    if (target.state === 'block' && target.attackTimer >= 22) { 
        window.playSound(600, 'triangle', 0.4, 0.9, true);
        window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
        if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: target.x, y: target.y - 40, r: 5, maxR: 200, color: "#00ffff", alpha: 1, speed: 15});
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PERFECT PARRY!", color: "#00ffff", alpha: 1, vx: 0, vy: -3, font: "900 35px Arial", life: 50 });
        
        target.stamina = Math.min(100, target.stamina + 25); 
        window.shakeScreen(15, 8); window.hitStopFrames = 12; window.chromaTimer = 8;
        
        let allFighters = [window.p1].concat(window.enemies);
        allFighters.forEach(e => {
            if (e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 140) { 
                e.state = 'hurt'; e.hitStun = 50; e.vx = target.isFacingRight ? 10 : -10; 
                window.spawnDust(e.x, e.y); 
            }
        });
        return;
    }
    
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
            let isNearWall = (target.x < 80) || (target.x > window.canvas.width - 80);
            if (isNearWall && isCrit && typeof window.triggerStageTransition === 'function') {
                window.triggerStageTransition(target);
            } else {
                window.slowMoTimer = 60; 
                window.screenFlash = 0; window.impactFrameTimer = 0; window.hitStopFrames = 8; 
                window.shakeScreen(30, 20); window.targetZoom = 1.4; window.chromaTimer = 25;
                window.playSound(80, 'square', 1.5, 0.8, true); window.koGlitchTimer = 60; 
                target.state = 'ko_falling'; target.koTimer = 100; target.vy = -10; target.onGround = false;
            }
        } else if (isCrit) {
            window.impactFrameTimer = 2; window.hitStopFrames = 2; window.shakeScreen(10, 8); window.targetZoom = 1.1; 
            window.chromaTimer = 10; window.playSound(180, 'square', 0.3, 0.6, true);
        } else {
            window.hitStopFrames = 0; window.shakeScreen(3, 3); window.playSound(250, 'sine', 0.15, 0.3, true);
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
    if (['uppercut', 'dragon_uppercut', 'knee_strike', 'high_kick'].includes(selectedMove)) slashAngle = -Math.PI / 5; 
    else if (['axe_kick', 'elbow_strike', 'spinning_heel'].includes(selectedMove)) slashAngle = Math.PI / 5; 
    else if (['low_kick'].includes(selectedMove)) slashAngle = Math.PI / 8; 
    else slashAngle = (Math.random() - 0.5) * 0.2; 

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5; window.shakeScreen(15, 12);
        target.vx = (attacker.isFacingRight ? 5 : -5); target.state = 'hurt'; target.hitStun = 45;
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
    attacker.comboHits = (attacker.comboHits || 0) + 1; attacker.comboDisplayTimer = 90; attacker.comboAlpha = 1;
    attacker.stamina = Math.min(100, attacker.stamina + (isCrit ? 5.0 : 1.5));
    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, isFinisher ? 1.8 : 1.2, slashAngle);
};

// ==========================================
// 5. VÒNG LẶP UPDATE CHÍNH (VẬT LÝ & THỜI TIẾT ĐỘC LẠ)
// ==========================================
window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1) return; 

    if (window.gameOver) { window.matchEndTimer = (window.matchEndTimer || 0) + 1; }
    if (window.koGlitchTimer > 0) { window.koGlitchTimer--; if (window.bgmBase) window.bgmBase.volume = 0; if (window.bgmClimax) window.bgmClimax.volume = 0; }
    
    if (window.uiShakeP1 > 0) { window.uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }

    if (window.introTimer > 0) { 
        window.introTimer--; 
        if (window.p1 && window.enemies.length > 0) { window.p1.x = 150; window.enemies.forEach((e, i) => { e.x = window.canvas.width - 150 + (i * 40); }); }
        if (window.introTimer === 120 && typeof window.speakAnnouncer === 'function') { window.speakAnnouncer("Ready?"); }
        if (window.introTimer === 60) { 
            window.playSound(100, 'sine', 0.5, 0.5, true); window.shakeScreen(15, 10);
            window.shockwaves.push({x: window.canvas.width/2, y: window.canvas.height/2, r: 10, maxR: 800, color: "#ff9f43", alpha: 1, speed: 30});
            if(typeof window.speakAnnouncer === 'function') window.speakAnnouncer("Fight!");
        }
        return; 
    }

    window.globalWind = Math.sin(Date.now() / 2500) * 1.5;
    if (typeof window.updateStageTransition === 'function') window.updateStageTransition();

    let isTimeStopped = window.timeStopTimer > 0;
    if (isTimeStopped) window.timeStopTimer--;

    if (!window.gameOver && !isTimeStopped) {
        window.matchTimer++; if (window.matchTimer === 1) { window.envHazards = []; window.envDamage = []; }
        let meteorChance = 0.002 + (window.matchTimer / 3600) * 0.01; 
        if (Math.random() < meteorChance && window.projectiles.length < 10) { window.projectiles.push({ x: Math.random() * window.canvas.width, y: -100, vx: (Math.random() - 0.5) * 4, vy: 8 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); }
        if (window.currentWeather === 'rain' && Math.random() < 0.005) { window.envHazards.push({ type: 'lightning', x: Math.random() * window.canvas.width, timer: 45 }); } 
        else if (window.currentWeather === 'ash' && Math.random() < 0.003) { window.envHazards.push({ type: 'lava', x: Math.random() * window.canvas.width, timer: 60 }); }
    }

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; 
    
    if (window.screenFlash > 0) { 
        window.screenFlash -= 0.05;
        if (window.screenFlash <= 0.001) window.screenFlash = 0; 
    } else if (window.screenFlash < 0) { 
        window.screenFlash += 1; 
        if (window.screenFlash >= 0) window.screenFlash = 0; 
    }

    if (window.cinematicTimer > 0 && !isSlowMoFrame) { window.cinematicTimer--; if (window.cinematicTimer === 0 && window.cinematicCallback) { try { window.cinematicCallback(); } catch(e) {} window.cinematicCallback = null; } return; }
    if (window.hitStopFrames > 0 && !isSlowMoFrame) { window.hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    if (!isTimeStopped) {
        for (let i = window.envDamage.length - 1; i >= 0; i--) {
            let dmg = window.envDamage[i];
            if (dmg.life <= 0) { window.envDamage.splice(i, 1); continue; }
            dmg.life--;
            if (dmg.isBurning && Math.random() < 0.15 && window.particles.length < MAX_PARTICLES) { window.particles.push({ x: dmg.x + (Math.random()-0.5) * dmg.radius * 0.8, y: window.GROUND_Y, vx: (Math.random()-0.5), vy: -Math.random()*5 - 1, life: 40, maxLife: 40, color: Math.random() > 0.4 ? "#e74c3c" : "#f1c40f", size: Math.random()*4+1 }); }
        }
    }

    let allFighters = [window.p1].concat(window.enemies);

    if (!isTimeStopped) {
        for (let i = window.envHazards.length - 1; i >= 0; i--) {
            let haz = window.envHazards[i]; haz.timer--;
            if (haz.timer <= 0) {
                if (haz.type === 'lightning') {
                    window.playSound(300, 'sawtooth', 0.8, 0.8, true); window.screenFlash = 0.8; window.shakeScreen(20, 15); 
                    window.slashes.push({ x: haz.x, y: window.GROUND_Y - 300, isRight: true, life: 15, maxLife: 15, color: "#ffffff", scale: 5, rotation: Math.PI/2 });
                    allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 60) { if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#f1c40f", true, false); f.state = 'hurt'; f.hitStun = 35; f.vx = (f.x - haz.x > 0 ? 15 : -15); } });
                } else if (haz.type === 'lava') {
                    window.playSound(100, 'square', 0.8, 0.8, true); window.shakeScreen(25, 12); window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                    if (window.particles.length < MAX_PARTICLES) { for(let k=0; k<15; k++) window.particles.push({ x: haz.x + (Math.random()-0.5)*40, y: window.GROUND_Y, vx: (Math.random()-0.5)*12, vy: -10 - Math.random()*15, life: 40, maxLife: 40, color: "#e67e22", size: Math.random()*12+5 }); }
                    allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false); f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; } });
                } 
                window.envHazards.splice(i, 1);
            }
        }
        
        // 🌟 1. VẬT LÝ THỜI TIẾT ĐA DẠNG
        window.weatherParticles.forEach(w => { 
            // Nhóm 1: Các hạt bay ngược lên trời
            if (['toxic', 'ash', 'fireflies'].includes(window.currentWeather)) { 
                w.y -= w.speed * 0.5; w.x += Math.sin(w.y/30)*2 + window.globalWind; 
                if(w.y < -20) { w.y = window.canvas.height + 20; w.x = Math.random() * 1200 - 300; } 
            } 
            // Nhóm 2: Mưa mã code Ma Trận
            else if (window.currentWeather === 'matrix_rain') {
                w.y += w.speed * 1.6; 
                if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; w.char = Math.random() > 0.5 ? "1" : "0"; }
            } 
            // Nhóm 3: Bụi tinh vân vũ trụ
            else if (window.currentWeather === 'cosmic_dust') {
                w.y += Math.sin(Date.now()/1000 + w.x)*0.3; w.x += Math.cos(Date.now()/1000 + w.y)*0.3;
            } 
            // Nhóm 4: Mưa sao băng 
            else if (window.currentWeather === 'shooting_stars') {
                w.y += w.speed * 3; w.x -= w.speed * 2;
                if(w.y > window.canvas.height + 20 || w.x < -100) { w.y = -200 - Math.random()*200; w.x = Math.random() * 2000; }
            } 
            // Nhóm 5: Rơi bình thường
            else { 
                w.y += w.speed; w.x += ((window.currentWeather === 'rain' || window.currentWeather === 'blood_rain') ? -3 : Math.sin(w.y/50)*2) + window.globalWind; 
                if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } 
            }
        });
        
        for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
        for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
        for (let i = window.particles.length - 1; i >= 0; i--) { let pt = window.particles[i]; if (pt.isCoin) { pt.vy += window.GRAVITY * 0.5; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } else if (pt.isRubble) { pt.vy += window.GRAVITY * 0.9; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.4; pt.vx *= 0.6; } } pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); }
        for (let i = window.customObjs.length - 1; i >= 0; i--) { let obj = window.customObjs[i]; obj.x += obj.vx; obj.y += obj.vy; obj.vy += window.GRAVITY * 0.5; if(obj.spin) obj.ang += 0.2; obj.life--; if(obj.life <= 0) window.customObjs.splice(i, 1); }
        if (Math.random() < 0.12 && window.particles.length < MAX_PARTICLES) { window.particles.push({ x: Math.random() * window.canvas.width, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }
    }

    if (!isTimeStopped) {
        window.enemies.forEach(e => { 
            if (e.hp <= 0 && !e.deathTriggered) {
                e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; window.spawnParticles(e.x, e.y, "#fff", true); window.playSound(100, 'sine', 0.5, 0.5, true); 
                if (window.particles.length < MAX_PARTICLES) { for(let c=0; c<5; c++) window.particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true }); }
                if (window.p1 && window.p1.hp > 0) { let heal = Math.floor(window.p1.maxHp * 0.08); window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 }); }
            }
        });
        if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -8; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; window.spawnParticles(window.p1.x, window.p1.y, "#fff", true); }
    }
    
    let gameContext = { floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (!f) return;
        if (isTimeStopped && f !== window.timeStopCaster) { f.trailArr = []; return; }
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; f.vy += window.GRAVITY * 0.5; 
            if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { window.spawnDust(f.x, window.GROUND_Y); if (f.vy > 8 || f.state === 'ko_falling') { window.shakeScreen(f.vy > 10 ? 8 : 5, 4); window.spawnEnvDamage(f.x, window.GROUND_Y, 'crater', f.scale || 1, false); } } 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.93; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }

        if (f.iFrames > 0) f.iFrames--;
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout <= 0) f.comboStep = 0; }
        if (f.comboTimer > 0) f.comboTimer--; if (f.superArmor > 0) f.superArmor--; if (f.wallDamageCooldown > 0) f.wallDamageCooldown--;
        
        if (f.comboDisplayTimer > 0) { f.comboDisplayTimer--; f.comboAlpha = 1; } 
        else if (f.comboHits > 0) { f.comboAlpha = (f.comboAlpha || 1) - 0.02; if (f.comboAlpha <= 0) { f.comboAlpha = 0; f.comboHits = 0; } }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) f.state = 'idle'; }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') f.state = 'idle'; }
        if (f.state === 'idle' || f.state === 'walk') f.iFrames = 0;

        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.2); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; 

        if (window.currentWeather === 'snow') f.currentSpeed *= 0.65; 
        else if (window.currentWeather === 'rain') f.currentSpeed *= 1.25; 
        else if (window.currentWeather === 'ash') f.currentDmgMod *= 1.30; 
        else if (window.currentWeather === 'toxic') { f.currentDmgMod *= 0.80; if (window.matchTimer % 90 === 0 && f.hp > 1 && !window.gameOver) { f.hp -= 1; window.particles.push({x: f.x, y: f.y-30, vx:0, vy:-1, life:20, maxLife:20, color:"#2ecc71", size:4}); } }

        if (f.isRage) { f.currentSpeed *= 1.5; f.currentDmgMod *= 1.5; f.aiDelay = 0; if(window.particles.length < MAX_PARTICLES) window.particles.push({ x: f.x + (Math.random() - 0.5) * 40, y: f.y - Math.random() * 80, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 6 - 2, life: 30, maxLife: 30, color: "#ff4757", size: Math.random() * 6 + 3 }); if (Math.random() < 0.05) window.shakeScreen(2, 2); }
        if (f.hp > 0 && f.stamina < 100) f.stamina += (f.isRage ? 0.4 : (f.regen * 0.2 || 0.05)); 
        if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false; if (f.isExhausted) f.currentSpeed *= 0.6;

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.life % 15 === 0 && window.particles.length < MAX_PARTICLES) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        let launchedUltimate = false;
        let targetGroup = f.isPlayer ? window.enemies : [window.p1];
        let closestTarget = typeof window.getClosestEnemy === 'function' ? window.getClosestEnemy(f, targetGroup) : null;

        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x; let absDist = Math.abs(distToTarget);
                let type = (f.classId || "dausi").toLowerCase(); let isCloseEnough = (absDist < 250) || type.includes('satthu') || type.includes('phapsu');

                if (isCloseEnough) {
                    if (window.classStats && window.classStats[type] && typeof window.classStats[type].executeUltimate === 'function') {
                        f.stamina = 0; let baseDmg = 50 * (f.currentDmgMod || 1); if (!f.isPlayer) baseDmg = 35 * (f.currentDmgMod || 1);
                        window.playSound(400, 'sine', 0.5, 0.6); window.shakeScreen(15, 10); window.spawnParticles(f.x, f.y, "#f1c40f", true);
                        let ultText = f.isPlayer ? "🔥 ULTIMATE!" : "⚠️ DANGER!";
                        window.floatingTexts.push({ x: f.x, y: f.y - 100, text: ultText, color: f.isPlayer ? "#ff4757" : "#ff0000", alpha: 1, vx: 0, vy: -3, font: "900 35px Arial", life: 50 });
                        f.isFacingRight = distToTarget > 0; window.classStats[type].executeUltimate(f, closestTarget, baseDmg); f.vx = 0;
                    } else if (typeof window.useUltimate === 'function') {
                        window.useUltimate(f, closestTarget); f.vx = 0;
                    }
                    launchedUltimate = true;
                } else { f.state = 'walk'; f.vx = Math.sign(distToTarget) * f.currentSpeed * 1.5; f.attackTimer = 5; launchedUltimate = true; }
            }
        }

        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (f.isDragon) {
                if (f.hp > 0 && f.hp <= f.maxHp * 0.3 && !f.isEvolved) { f.isEvolved = true; window.slowMoTimer = 60; window.screenFlash = 0; window.shakeScreen(50, 15); window.playSound(50, 'sawtooth', 2.0, 1.0, true); f.color = "#8e44ad"; f.scale *= 1.25; window.floatingTexts.push({ x: f.x, y: f.y - 150, text: "🐉🔥", color: "#8e44ad", alpha: 1, vx: 0, vy: -3, font: "italic 900 60px Arial", life: 100 }); window.shockwaves.push({x: f.x, y: window.GROUND_Y, r: 10, maxR: 500, color: "#8e44ad", alpha: 1, speed: 25}); }
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
                        else if (randAction < 0.33) { f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 4; window.playSound(380, 'square', 0.25, 0.9, true); if (absDist < 65) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(32 * f.currentDmgMod), "#f1c40f", true, false); window.p1.vx = Math.sign(dist) * 6; window.shakeScreen(15, 12); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: "🗣️", color: "#f1c40f", alpha: 1, vx: 0, vy: -3, font: "900 40px Arial", life: 50 }); } } 
                        else if (randAction < 0.66) { f.state = 'high_kick'; f.attackTimer = 28; f.vx = Math.sign(dist) * 5; let kickCount = 0; let kickInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(kickInterval); return; } if (Math.abs(window.p1.x - f.x) < 85) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(12 * f.currentDmgMod), "#ecf0f1", false, false); window.p1.vx = Math.sign(dist) * 3; window.shakeScreen(4, 3); } kickCount++; if (kickCount >= 3) clearInterval(kickInterval); }, 70); window.floatingTexts.push({ x: f.x, y: f.y - 100, text: "👟", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); } 
                        else { f.state = 'machine_gun_punches'; f.attackTimer = 30; f.vx = Math.sign(dist) * 2.5; window.playSound(280, 'sine', 0.4, 0.5); if (absDist < 85) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(16 * f.currentDmgMod), "#f1c40f", false, false); window.shakeScreen(5, 4); window.spawnParticles(window.p1.x, window.p1.y, "#f1c40f"); } }
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
                        else { f.state = 'dash'; f.dashTimer = 15; f.dashDir = Math.sign(dist); f.currentSpeed *= 2.5; f.iFrames = 20; window.playSound(400, 'sawtooth', 0.4, 0.8, true); setTimeout(() => { if(window.gameOver || f.hp <= 0 || !window.p1) return; if(Math.abs(window.p1.x - f.x) < 180) { if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(40 * f.dmgMod), "#e74c3c", true, false); window.shakeScreen(20, 15); window.p1.vx = Math.sign(dist) * 6; } window.spawnSlash(f.x, window.p1.y - 30, f.isFacingRight, "#e74c3c", true, 3.0, (Math.random()-0.5)); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "⚡", color: "#e74c3c", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); }, 200); }
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
                let targetList = f.isPlayer ? window.enemies : [window.p1]; let closest = window.getClosestEnemy(f, targetList);
                if (closest && closest.hp > 0) {
                    let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);
                    if (absDist > reach) { f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) window.spawnDust(f.x, f.y); } 
                    else {
                        f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                        if (f.aiDelay <= 0) {
                            f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; let usedSkill = false;
                            if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.05) { f.stamina -= 100; usedSkill = true; window.triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                            if (!usedSkill) { let rand = Math.random(); if (closest.attackTimer > 0 || closest.state === 'dash') { if (rand < 0.4) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; window.spawnDust(f.x, f.y); } else { if(typeof window.attack === 'function') window.attack(f, targetList); } } else { if (rand < 0.9) { if (f.comboTimer > 0 && f.comboStep < 14) f.comboStep++; else f.comboStep = 0; f.comboTimer = 50; if(typeof window.attack === 'function') window.attack(f, targetList); } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } } }
                        }
                    }
                } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
            }
        }

        if (f.state === 'wall_splat') { f.vy = 0; f.vx = 0; if (f.hitStun < 25) { f.state = 'hurt'; f.vy = 2; f.vx = f.x < window.canvas.width/2 ? 3 : -3; } } 
        else { f.vy += window.GRAVITY; if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { window.spawnDust(f.x, window.GROUND_Y); if (f.vy > 8) window.shakeScreen(5, 3); } }

        f.y += f.vy; if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        let friction = (window.currentWeather === 'rain') ? 0.95 : 0.85;
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; if (f.onGround && window.matchTimer % 4 === 0) window.spawnDust(f.x, window.GROUND_Y); } 
        else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.state !== 'wall_splat' && f.onGround) { f.vx *= friction; }
        f.x += f.vx;
    });

    if (!isTimeStopped) {
        for (let i = 0; i < allFighters.length; i++) { 
            for (let j = i + 1; j < allFighters.length; j++) { 
                let f1 = allFighters[i], f2 = allFighters[j]; if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
                let overlapX = f2.x - f1.x; let pushDist = 30 * Math.max(f1.scale||1, f2.scale||1); 
                if (Math.abs(overlapX) < pushDist) { let pushForce = (pushDist - Math.abs(overlapX)) / 2; if (overlapX === 0) overlapX = 1; let sign = Math.sign(overlapX); f1.x -= pushForce * sign; f2.x += pushForce * sign; } 
            } 
        }
        for (let i = 0; i < allFighters.length; i++) { 
            for (let j = i + 1; j < allFighters.length; j++) { 
                let f1 = allFighters[i], f2 = allFighters[j]; if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
                let dist = Math.abs(f1.x - f2.x);
                if (dist < 80 && f1.attackTimer > 5 && f1.attackTimer < 20 && f2.attackTimer > 5 && f2.attackTimer < 20) {
                    if (!f1.clashCooldown && !f2.clashCooldown && f1.isFacingRight !== f2.isFacingRight) {
                        f1.clashCooldown = 30; f2.clashCooldown = 30; f1.attackTimer = 0; f2.attackTimer = 0; 
                        f1.vx = f1.isFacingRight ? -6 : 6; f2.vx = f2.isFacingRight ? -6 : 6; 
                        window.hitStopFrames = 15; window.shakeScreen(20, 10); window.playSound(500, 'square', 0.2, 0.8, true);
                        let midX = (f1.x + f2.x)/2; let midY = (f1.y + f2.y)/2 - 30;
                        window.spawnParticles(midX, midY, "#ffffff", true);
                        if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: midX, y: midY, r: 5, maxR: 200, color: "#ffffff", alpha: 1, speed: 15});
                        window.floatingTexts.push({ x: midX, y: midY - 40, text: "⚔️ CLASH!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 45px Arial", life: 45 });
                    }
                }
                if(f1.clashCooldown > 0) f1.clashCooldown--; if(f2.clashCooldown > 0) f2.clashCooldown--;
            } 
        }
    }

    allFighters.forEach(f => {
        if (!f || f.hp <= 0) return;
        let wallBound = 35 * (f.scale || 1);
        if (f.x < wallBound) { 
            f.x = wallBound; 
            if (f.hitStun > 0 && f.vx < -8 && !f.wallBounced) {
                f.wallBounced = true; f.vx = 0; f.vy = 0; f.state = 'wall_splat'; f.hitStun = 50; window.shakeScreen(15, 8); window.chromaTimer = 10;
                if (!f.wallDamageCooldown) { window.spawnEnvDamage(wallBound, f.y, 'wall_left', f.scale || 1, false); f.wallDamageCooldown = 60; }
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 5) + 15, "#f1c40f", true, false); 
                window.playSound(200, 'square', 0.4, 0.8, true); window.spawnDust(f.x, f.y);
                window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "💥 WALL SPLAT!", color: "#f1c40f", alpha: 1, vx: 2, vy: -2, font: "900 30px Arial", life: 40 });
            } else if (f.hitStun > 0 && f.vx < -3 && !f.wallBounced && f.state !== 'wall_splat') {
                f.wallBounced = true; f.vx = 4; f.hitStun = 15; window.shakeScreen(10, 4); 
                if (!f.wallDamageCooldown) { window.spawnEnvDamage(wallBound, f.y, 'wall_left', f.scale || 1, false); f.wallDamageCooldown = 60; }
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back' && f.state !== 'wall_splat') f.vx = 0;
        }
        if (window.canvas && f.x > window.canvas.width - wallBound) { 
            f.x = window.canvas.width - wallBound; 
            if (f.hitStun > 0 && f.vx > 8 && !f.wallBounced) {
                f.wallBounced = true; f.vx = 0; f.vy = 0; f.state = 'wall_splat'; f.hitStun = 50; window.shakeScreen(15, 8); window.chromaTimer = 10;
                if (!f.wallDamageCooldown) { window.spawnEnvDamage(window.canvas.width - wallBound, f.y, 'wall_right', f.scale || 1, false); f.wallDamageCooldown = 60; }
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 5) + 15, "#f1c40f", true, false); 
                window.playSound(200, 'square', 0.4, 0.8, true); window.spawnDust(f.x, f.y);
                window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "💥 WALL SPLAT!", color: "#f1c40f", alpha: 1, vx: -2, vy: -2, font: "900 30px Arial", life: 40 });
            } else if (f.hitStun > 0 && f.vx > 3 && !f.wallBounced && f.state !== 'wall_splat') {
                f.wallBounced = true; f.vx = -4; f.hitStun = 15; window.shakeScreen(10, 4); 
                if (!f.wallDamageCooldown) { window.spawnEnvDamage(window.canvas.width - wallBound, f.y, 'wall_right', f.scale || 1, false); f.wallDamageCooldown = 60; }
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back' && f.state !== 'wall_splat') f.vx = 0;
        }
        if (f.hitStun <= 0 && f.x > wallBound + 10 && (window.canvas && f.x < window.canvas.width - wallBound - 10)) f.wallBounced = false;

        if (!f.trailArr) f.trailArr = [];
        let isAttacking = f.attackTimer > 0 && ['jab','cross','low_kick','hook','backfist','teep_kick','elbow_strike','high_kick','spinning_heel','shoulder_bash','palm_strike','uppercut','knee_strike','axe_kick','one_inch_punch','dempsey_roll','machine_gun_punches','dragon_uppercut','asura_strike','scratch','breathe_fire', 'taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'].includes(f.state);
        if (((f.state === 'dash' || f.state === 'dash_back' || f.isRage) && Math.abs(f.vx) > 1) || (isAttacking && f.attackTimer % 2 === 0)) { f.trailArr.push({x: f.x, y: f.y, state: f.state, isFacingRight: f.isFacingRight, color: f.color, alpha: 0.5, scale: f.scale, isDragon: f.isDragon}); }
        for (let i = f.trailArr.length - 1; i >= 0; i--) { f.trailArr[i].alpha -= 0.05; if (f.trailArr[i].alpha <= 0) f.trailArr.splice(i, 1); }
    });

    if (!isTimeStopped) {
        for (let i = window.projectiles.length - 1; i >= 0; i--) { 
            let proj = window.projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; 
            if (proj.isMeteor) {
                window.particles.push({ x: proj.x + (Math.random()-0.5)*10, y: proj.y, vx: 0, vy: -2, life: 15, maxLife: 15, color: "#f1c40f", size: Math.random()*4+2 });
                if (proj.y >= window.GROUND_Y) {
                    window.shakeScreen(15, 6); window.playSound(200, 'sawtooth', 0.5, 0.6, true);
                    if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: proj.x, y: window.GROUND_Y, r: 10, maxR: 150, color: "#e74c3c", alpha: 1, speed: 10}); 
                    window.spawnEnvDamage(proj.x, window.GROUND_Y, 'crater', 1.5, true);
                    let allActiveFighters = [window.p1].concat(window.enemies);
                    allActiveFighters.forEach(fighter => { if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 100 && fighter.y >= window.GROUND_Y - 50) { if(typeof window.takeDamage === 'function') window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false); fighter.vx = Math.sign(fighter.x - proj.x) * 12; fighter.state = 'hurt'; fighter.hitStun = 25; } }); window.projectiles.splice(i, 1);
                }
            } else {
                let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; 
                if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); if(typeof window.takeDamage === 'function') window.takeDamage(proj.target, proj.dmg, proj.color || "#e74c3c", false, false); window.shakeScreen(8, 4); window.projectiles.splice(i, 1); } 
                else if (proj.x < -100 || proj.x > window.canvas.width + 100 || proj.y < -100 || proj.y > window.canvas.height + 100) { window.projectiles.splice(i, 1); } 
            }
        }
        for (let i = window.traps.length - 1; i >= 0; i--) { let t = window.traps[i]; t.life--; if (t.life <= 0) { window.traps.splice(i, 1); continue; } }
    }
    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }
    
    if (window.p1 && window.introTimer === 0) {
        let closest = window.getClosestEnemy(window.p1, window.enemies);
        if (!closest && window.enemies && window.enemies.length > 0) { closest = window.enemies.reduce((prev, curr) => Math.abs(curr.x - window.p1.x) < Math.abs(prev.x - window.p1.x) ? curr : prev); }
        if (window.gameOver && closest) {
            let midX = (window.p1.x + closest.x) / 2; let midY = (window.p1.y + closest.y) / 2; let distance = Math.abs(window.p1.x - closest.x);
            window.targetCamX = (window.canvas.width / 2) - midX; window.targetCamY = Math.max(0, (window.GROUND_Y - midY) * 0.5 + 40); 
            let maxZoomForDistance = Math.max(1.0, 1.6 - (distance / 800) * 0.5); let dynamicZoom = 1.25 - (distance / 600) * 0.35;
            window.targetZoom = Math.min(maxZoomForDistance, dynamicZoom + (window.matchEndTimer * 0.002)); window.targetTilt = 0; 
        } 
        else if (closest && !window.gameOver && window.slowMoTimer <= 0) {
            let midX = (window.p1.x + closest.x) / 2; let midY = (window.p1.y + closest.y) / 2; let maxPanX = window.canvas.width * 0.85; let desiredCamX = (window.canvas.width / 2) - midX; 
            window.targetCamX = Math.max(-maxPanX, Math.min(maxPanX, desiredCamX)); window.targetCamY = Math.max(0, Math.min(280, (window.GROUND_Y - midY) * 0.5)); 
            let distance = Math.abs(window.p1.x - closest.x); let dynamicZoom = 1.25 - (distance / 600) * 0.35; window.targetZoom = Math.max(0.9, Math.min(1.25, dynamicZoom));
            let p1Low = window.p1.hp < window.p1.maxHp * 0.3; let eLow = closest.hp < closest.maxHp * 0.3;
            if (p1Low && eLow) { window.targetTilt = 0.05 * Math.sin(window.matchTimer * 0.06); } 
            else if (p1Low || eLow) { window.targetTilt = 0.025 * Math.sin(window.matchTimer * 0.04); } 
            else { window.targetTilt = 0; }
        } 
        else if (window.slowMoTimer > 0) {
            let focusX = window.canvas.width / 2; let focusY = window.GROUND_Y; 
            if (window.p1 && window.p1.hp > 0) { focusX = window.p1.x; focusY = window.p1.y; } 
            else { let aliveEnemy = window.enemies.find(e => e.hp > 0); if (aliveEnemy) { focusX = aliveEnemy.x; focusY = aliveEnemy.y; } }
            window.targetCamX = (window.canvas.width / 2) - focusX; window.targetCamY = Math.max(0, Math.min(280, (window.GROUND_Y - focusY) * 0.5)); 
            window.targetZoom = 1.35; window.targetTilt = 0.025 * Math.sin(window.slowMoTimer * 0.1);
        }
    } else { window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0; }

    window.camX += (window.targetCamX - window.camX) * 0.08; window.camY += (window.targetCamY - window.camY) * 0.08; window.currentZoom += (window.targetZoom - window.currentZoom) * 0.08; window.cameraTilt += (window.targetTilt - window.cameraTilt) * 0.08;
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { let t = window.floatingTexts[i]; if (t.life !== undefined) { t.vy += window.GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) window.floatingTexts.splice(i, 1); }
}

// ==========================================
// 6. HỆ THỐNG VẼ ĐỒ HỌA TRUNG TÂM (DRAW)
// ==========================================
window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    window.ctx.setTransform(1, 0, 0, 1, 0, 0); window.ctx.globalAlpha = 1.0; window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.save();
    
    try {
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(window.currentZoom, window.currentZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        if (window.filterTimer > 0 && window.screenFilter) {
            window.filterTimer--;
            if (window.screenFilter === 'invert') { window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = "#fff"; window.ctx.fillRect(-800, -800, 3000, 3000); }
            else if (window.screenFilter === 'blood') { window.ctx.globalCompositeOperation = 'multiply'; window.ctx.fillStyle = `rgba(255, 0, 0, ${window.filterTimer/100})`; window.ctx.fillRect(-800, -800, 3000, 3000); }
            else if (window.screenFilter === 'dark') { window.ctx.fillStyle = `rgba(0, 0, 0, 0.75)`; window.ctx.fillRect(-800, -800, 3000, 3000); }
            window.ctx.globalCompositeOperation = 'source-over';
            if (window.filterTimer <= 0) window.screenFilter = null;
        }

        if (window.screenFlash < 0) { window.ctx.fillStyle = `rgba(0, 0, 0, 0.75)`; window.ctx.fillRect(-800, -800, window.canvas.width + 1600, window.canvas.height + 1600); }
        if (window.impactFrameTimer > 0) { window.impactFrameTimer--; } 
        window.ctx.globalCompositeOperation = "source-over"; 

        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        
        let skyGrad = window.ctx.createLinearGradient(0, -400, 0, window.GROUND_Y);
        skyGrad.addColorStop(0, cmap.sky); skyGrad.addColorStop(1, cmap.bg1); 
        window.ctx.fillStyle = skyGrad; window.ctx.fillRect(-800, -800, window.canvas.width + 1600, window.canvas.height + 1600);
        
        window.ctx.save(); window.ctx.translate(-window.camX * 0.7, -window.camY * 0.3); window.ctx.fillStyle = cmap.bg2;
        for(var i = -800; i < window.canvas.width + 1200; i += 150) {
            let t2 = cmap.bg2Type || "mountains";
            if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+75, window.GROUND_Y-120+Math.sin(i)*30); window.ctx.lineTo(i+150, window.GROUND_Y); window.ctx.fill(); }
            else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+100, window.GROUND_Y-150); window.ctx.lineTo(i+200, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+40, window.GROUND_Y-50, 120, 5); window.ctx.fillRect(i+60, window.GROUND_Y-80, 80, 5); }
            else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i+75, window.GROUND_Y-15, 100, 10, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.ellipse(i+20, window.GROUND_Y-30, 60, 5, 0, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y-180+Math.sin(i)*30, 60, 0, Math.PI*2); window.ctx.arc(i+50, window.GROUND_Y-150+Math.cos(i)*20, 50, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i+Math.sin(i)*50, window.GROUND_Y-250+Math.cos(i)*100, 3+Math.random()*4, 0, Math.PI*2); window.ctx.fill(); }
        }
        window.ctx.restore();

        window.ctx.save(); window.ctx.translate(-window.camX * 0.4, -window.camY * 0.15); window.ctx.fillStyle = cmap.bg1;
        for(var i = -800; i < window.canvas.width + 1200; i += 120) {
            let t1 = cmap.bg1Type || "city"; let h = 100 + Math.abs(Math.sin(i))*80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y-h, 70, h); if(i%3===0) window.ctx.clearRect(i+10, window.GROUND_Y-h+20, 15, 20); }
            else if (t1 === "trees") { window.ctx.fillRect(i+25, window.GROUND_Y-h, 20, h); window.ctx.beginPath(); window.ctx.arc(i+35, window.GROUND_Y-h, 45, 0, Math.PI*2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i+25, window.GROUND_Y-30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y-20); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+60, window.GROUND_Y-20); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y-10); window.ctx.lineTo(i+30, window.GROUND_Y-h+40); window.ctx.lineTo(i+70, window.GROUND_Y-10); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i+10, window.GROUND_Y-h, 40, h); window.ctx.fillRect(i, window.GROUND_Y-20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y-h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i+30, window.GROUND_Y-60, 30, Math.PI, 0); window.ctx.lineTo(i+60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+25, window.GROUND_Y-100, 10, 30); window.ctx.fillRect(i+15, window.GROUND_Y-90, 30, 5); }
            else if (t1 === "digital") { window.ctx.fillStyle = "rgba(0, 255, 0, 0.15)"; window.ctx.font="bold 20px monospace"; window.ctx.fillText("01", i, window.GROUND_Y-h); }
        }
        window.ctx.restore();

        window.ctx.save();
        let fogT = Date.now() / 1500;
        for(let i = -800; i < window.canvas.width + 1200; i += 250) {
            let fogX = i - (window.camX * 0.2 % 250) + Math.cos(fogT + i)*40; let fogY = window.GROUND_Y - 20 + Math.sin(fogT + i)*10;
            let fogGrad = window.ctx.createRadialGradient(fogX, fogY, 0, fogX, fogY, 180); fogGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 + Math.sin(fogT+i)*0.03})`); fogGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
            window.ctx.fillStyle = fogGrad; window.ctx.beginPath(); window.ctx.arc(fogX, fogY, 180, 0, Math.PI*2); window.ctx.fill();
        }
        window.ctx.restore();
        
        let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); groundGrad.addColorStop(0, cmap.ground); groundGrad.addColorStop(1, "#000000"); 
        window.ctx.fillStyle = groundGrad; window.ctx.fillRect(-800, window.GROUND_Y, window.canvas.width + 1600, window.canvas.height - window.GROUND_Y + 400); 

        window.ctx.strokeStyle = cmap.line; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-400, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 400, window.GROUND_Y); window.ctx.stroke();
        window.ctx.strokeStyle = "#222"; window.ctx.lineWidth = 2; for(var i = -400; i < window.canvas.width + 400; i+=50) { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i - 20, window.canvas.height); window.ctx.stroke(); }
        
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.WALL_PADDING, 0, 4, window.canvas.height); 
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.canvas.width - window.WALL_PADDING, 0, 4, window.canvas.height); 

        if (window.envDamage && window.envDamage.length > 0) {
            window.ctx.save(); window.ctx.lineCap = "round"; window.ctx.lineJoin = "round";
            window.envDamage.forEach(dmg => {
                let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1; window.ctx.globalAlpha = alpha;
                window.ctx.save(); window.ctx.translate(dmg.x, dmg.y);
                if (dmg.type === 'crater') {
                    window.ctx.save(); window.ctx.scale(1, 0.15); 
                    if (dmg.isBurning) {
                        let pulse = 0.5 + Math.abs(Math.sin(Date.now() / 150)) * 0.5;
                        let burnGrad = window.ctx.createRadialGradient(0, 0, 0, 0, 0, (dmg.radius || 40) * 1.5);
                        burnGrad.addColorStop(0, `rgba(255, 150, 0, ${pulse * 0.9 * alpha})`); burnGrad.addColorStop(0.3, `rgba(255, 30, 0, ${pulse * 0.5 * alpha})`); burnGrad.addColorStop(1, "rgba(0,0,0,0)");
                        window.ctx.fillStyle = burnGrad; window.ctx.beginPath(); window.ctx.arc(0, 0, (dmg.radius || 40) * 1.5, 0, Math.PI * 2); window.ctx.fill();
                    } else { window.ctx.fillStyle = `rgba(15, 15, 15, ${0.8 * alpha})`; window.ctx.beginPath(); window.ctx.arc(0, 0, (dmg.radius || 40), 0, Math.PI * 2); window.ctx.fill(); }
                    window.ctx.restore();
                }
                let baseLw = (dmg.isBurning ? 4 : 3) * (dmg.scale || 1);
                dmg.cracks.forEach(path => {
                    if (Array.isArray(path) && path.length > 0) {
                        if (dmg.isBurning) { window.ctx.strokeStyle = `rgba(255, 50, 0, ${0.8 * alpha})`; window.ctx.lineWidth = baseLw + 2; window.ctx.shadowBlur = 15; window.ctx.shadowColor = "#ff4757"; } 
                        else { window.ctx.strokeStyle = `rgba(10, 10, 10, ${0.5 * alpha})`; window.ctx.lineWidth = baseLw + 2; window.ctx.shadowBlur = 5; window.ctx.shadowColor = "#000"; }
                        window.ctx.beginPath(); path.forEach((pt, idx) => { if (idx === 0) window.ctx.moveTo(pt.x, pt.y); else window.ctx.lineTo(pt.x, pt.y); }); window.ctx.stroke();
                        window.ctx.strokeStyle = dmg.isBurning ? `rgba(255, 230, 100, ${1.0 * alpha})` : `rgba(0, 0, 0, ${0.9 * alpha})`;
                        window.ctx.lineWidth = baseLw * 0.4; window.ctx.shadowBlur = 0;
                        window.ctx.beginPath(); path.forEach((pt, idx) => { if (idx === 0) window.ctx.moveTo(pt.x, pt.y); else window.ctx.lineTo(pt.x, pt.y); }); window.ctx.stroke();
                    }
                });
                window.ctx.restore();
            });
            window.ctx.restore(); window.ctx.globalAlpha = 1.0;
        }

        if (window.envHazards && window.envHazards.length > 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = 'lighter';
            window.envHazards.forEach(haz => {
                if (haz.type === 'lightning') { window.ctx.fillStyle = `rgba(241, 196, 15, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.fillRect(haz.x - 40, -500, 80, window.GROUND_Y + 500); } 
                else if (haz.type === 'lava') { window.ctx.fillStyle = `rgba(231, 76, 60, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.beginPath(); window.ctx.ellipse(haz.x, window.GROUND_Y, 60 + Math.sin(haz.timer)*10, 15, 0, 0, Math.PI*2); window.ctx.fill(); }
            });
            window.ctx.restore(); window.ctx.globalCompositeOperation = "source-over";
        }

        // 🌟 2. ĐỒ HỌA THỜI TIẾT SIÊU THỰC
        window.ctx.save(); window.ctx.lineWidth = 1;
        window.weatherParticles.forEach(w => { 
            if (window.currentWeather === 'snow') { window.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size, 0, Math.PI*2); window.ctx.fill(); } 
            else if (window.currentWeather === 'rain') { window.ctx.strokeStyle = "rgba(155, 155, 255, 0.6)"; window.ctx.beginPath(); window.ctx.moveTo(w.x, w.y); window.ctx.lineTo(w.x - 6, w.y + 15); window.ctx.stroke(); } 
            else if (window.currentWeather === 'ash') { window.ctx.fillStyle = "rgba(230, 126, 34, 0.6)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 0.8, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'toxic') { window.ctx.fillStyle = "rgba(46, 204, 113, 0.4)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 1.2, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'petals') { window.ctx.fillStyle = "rgba(253, 121, 168, 0.7)"; window.ctx.beginPath(); window.ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'fireflies') {
                let glow = 0.3 + Math.abs(Math.sin(Date.now()/350 + w.x)) * 0.7; window.ctx.fillStyle = `rgba(241, 196, 15, ${glow})`;
                window.ctx.shadowBlur = 8; window.ctx.shadowColor = "#f1c40f"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 1.4, 0, Math.PI*2); window.ctx.fill(); window.ctx.shadowBlur = 0;
            } else if (window.currentWeather === 'matrix_rain') {
                window.ctx.fillStyle = `rgba(0, 255, 68, ${0.4 + Math.random()*0.5})`; window.ctx.font = "bold 15px monospace";
                window.ctx.fillText(w.char || (Math.random() > 0.5 ? "1" : "0"), w.x, w.y);
            } else if (window.currentWeather === 'cosmic_dust') {
                let cglow = 0.2 + Math.abs(Math.sin(Date.now()/500 + w.y)) * 0.6;
                window.ctx.fillStyle = w.size > 2 ? `rgba(0, 243, 255, ${cglow})` : `rgba(155, 89, 182, ${cglow})`;
                window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 2, 0, Math.PI*2); window.ctx.fill();
            } else if (window.currentWeather === 'blood_rain') {
                window.ctx.strokeStyle = "rgba(214, 48, 49, 0.75)"; window.ctx.lineWidth = 2;
                window.ctx.beginPath(); window.ctx.moveTo(w.x, w.y); window.ctx.lineTo(w.x - 4, w.y + 22); window.ctx.stroke();
            } else if (window.currentWeather === 'shooting_stars') {
                if (Math.random() > 0.95) return; 
                let tailX = w.x + w.speed * 2; let tailY = w.y - w.speed * 3;
                let grad = window.ctx.createLinearGradient(w.x, w.y, tailX, tailY);
                grad.addColorStop(0, "rgba(255, 255, 255, 1)"); grad.addColorStop(1, "rgba(0, 243, 255, 0)");
                window.ctx.strokeStyle = grad; window.ctx.lineWidth = w.size * 0.8;
                window.ctx.beginPath(); window.ctx.moveTo(w.x, w.y); window.ctx.lineTo(tailX, tailY); window.ctx.stroke();
            }
        });
        window.ctx.restore();

        window.traps.forEach(t => { window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
        window.projectiles.forEach(proj => { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.fill(); if(proj.isMeteor) { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius + 10, 0, Math.PI * 2); window.ctx.fillStyle = "rgba(230, 126, 34, 0.4)"; window.ctx.fill(); } });
        
        window.auras.forEach(a => {
            let prog = a.life / a.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog * 0.8;
            let aGrad = window.ctx.createRadialGradient(a.x, a.y - 10, 0, a.x, a.y - 10, a.r); aGrad.addColorStop(0, a.color); aGrad.addColorStop(1, "rgba(0,0,0,0)");
            window.ctx.fillStyle = aGrad; if (a.life % 4 > 1) { window.ctx.beginPath(); window.ctx.ellipse(a.x, window.GROUND_Y, a.r, a.r*0.3, 0, 0, Math.PI*2); window.ctx.fill(); }
            window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; a.life--;
        }); window.auras = window.auras.filter(a => a.life > 0);

        window.lasers.forEach(l => {
            let prog = l.life / l.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog; window.ctx.shadowBlur = 20; window.ctx.shadowColor = l.color; window.ctx.fillStyle = l.color;
            let currentWidth = l.width * (0.8 + Math.random() * 0.4); let startX = l.x; let endX = l.isRight ? window.canvas.width + 500 : -500;
            window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth/2, Math.abs(endX - startX), currentWidth); window.ctx.fillStyle = "#fff"; window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth/4, Math.abs(endX - startX), currentWidth/2);
            window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0; window.ctx.globalCompositeOperation = 'source-over'; l.life--;
        }); window.lasers = window.lasers.filter(l => l.life > 0);

        window.customObjs.forEach(obj => { window.ctx.save(); window.ctx.translate(obj.x, obj.y); if (obj.spin) window.ctx.rotate(obj.ang); window.ctx.font = obj.font || "30px Arial"; window.ctx.fillStyle = obj.color || "#fff"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.fillText(obj.text, 0, 0); window.ctx.restore(); });

        window.ctx.globalCompositeOperation = 'lighter';
        window.shockwaves.forEach(sw => { window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); });
        window.impactSparks.forEach(isp => { window.ctx.save(); window.ctx.translate(isp.x, isp.y); window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 2, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
        window.ctx.globalCompositeOperation = "source-over";

        let allFighters = [window.p1].concat(window.enemies); 

        if (cmap.id === 'matrix_grid' || cmap.id === 'river_styx' || cmap.weather === 'snow' || cmap.weather === 'rain') {
            window.ctx.save(); window.ctx.translate(0, window.GROUND_Y); window.ctx.scale(1, -0.4); window.ctx.translate(0, -window.GROUND_Y); window.ctx.globalAlpha = 0.15;
            allFighters.forEach(p => {
                if (p && p.hp > 0) {
                    window.ctx.save(); window.ctx.translate(p.x, p.y); if (!p.isFacingRight) window.ctx.scale(-1, 1);
                    if(p.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, p); 
                    else if (p.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p);
                    else if (p.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p);
                    else if (p.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p);
                    else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p);
                    window.ctx.restore();
                }
            });
            window.ctx.restore();
        }

        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        allFighters.forEach(p => {
            if (p && p.hp >= 0) {
                let heightDist = Math.max(0, window.GROUND_Y - p.y); 
                let shadowScale = Math.max(0.15, 1 - heightDist / 250) * (p.scale || 1);
                window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.x, window.GROUND_Y, 35 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2); window.ctx.fill();
            }
        });
        window.ctx.restore();

        if (window.p1) {
            window.ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => { 
                if (p && p.hp > 0 && p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); 
                        if (trailP.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, trailP, true); 
                        else if (trailP.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, trailP);
                        else if (trailP.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, trailP);
                        else if (trailP.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, trailP);
                        else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = "source-over";

            window.enemies.forEach(e => { 
                window.ctx.save();
                if (e.state === 'ko_falling' || e.state === 'dead') { 
                    window.ctx.translate(e.x, e.y); let angle = Math.PI / 2; if (e.state === 'ko_falling') { let progress = (100 - e.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = e.isFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, e, { x: 0, y: 0 }); 
                    if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                    else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone);
                    else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone);
                    else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } else { 
                    if(e.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, e); 
                    else if (e.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, e);
                    else if (e.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, e);
                    else if (e.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, e);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, e); 
                }
                window.ctx.restore();
            }); 

            window.ctx.save();
            if (window.p1.state === 'ko_falling' || window.p1.state === 'dead') { window.ctx.translate(window.p1.x, window.p1.y); let angle = Math.PI / 2; if (window.p1.state === 'ko_falling') { let progress = (100 - window.p1.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = window.p1.isFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, window.p1, { x: 0, y: 0 }); if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); } 
            else { if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, window.p1); }
            window.ctx.restore();
        }

        window.slashes.forEach(s => { window.ctx.save(); window.ctx.translate(s.x, s.y); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale, s.scale); window.ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); window.ctx.lineWidth = 15 * (1 - prog); let grad = window.ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); window.ctx.strokeStyle = grad; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 15; window.ctx.shadowColor = s.color; window.ctx.stroke(); window.ctx.restore(); });
        
        window.particles.forEach(pt => { 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fillStyle = pt.color; 
            if (pt.isRubble) { window.ctx.save(); window.ctx.translate(pt.x, pt.y); window.ctx.rotate(pt.life * 0.1); window.ctx.fillRect(-pt.size/2, -pt.size/2, pt.size, pt.size); window.ctx.restore(); } 
            else { window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); window.ctx.fill(); if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } }
        }); window.ctx.globalAlpha = 1.0;
        
        window.floatingTexts.forEach(t => { window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.shadowBlur = 5; window.ctx.shadowColor = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.fillText(t.text, t.x, t.y); window.ctx.shadowBlur = 0; }); window.ctx.globalAlpha = 1.0;

        if (typeof window.drawStageTransition === 'function') window.drawStageTransition(window.ctx);

        window.ctx.save(); window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
        let vX = window.canvas.width / 2; let vY = window.canvas.height / 2;
        let vGrad = window.ctx.createRadialGradient(vX, vY, window.canvas.height * 0.4, vX, vY, window.canvas.width * 0.75); vGrad.addColorStop(0, "rgba(0,0,0,0)"); vGrad.addColorStop(1, "rgba(0,0,0,0.65)");
        window.ctx.fillStyle = vGrad; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

        if (window.p1 && window.p1.comboHits >= 2) {
            window.ctx.globalAlpha = Math.max(0, window.p1.comboAlpha || 1); window.ctx.font = "italic 900 24px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.textAlign = "left"; window.ctx.shadowBlur = 10; window.ctx.shadowColor = "#ff9f43";
            window.ctx.fillText(`🔥 ${window.p1.comboHits} HITS`, 20, 70 + Math.sin(Date.now() / 100) * 2);
        }
        let maxEnemyCombo = null;
        window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; });
        if (maxEnemyCombo) {
            window.ctx.globalAlpha = Math.max(0, maxEnemyCombo.comboAlpha || 1); window.ctx.font = "italic 900 24px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.textAlign = "right"; window.ctx.shadowBlur = 10; window.ctx.shadowColor = "#ff4757";
            window.ctx.fillText(`🔥 ${maxEnemyCombo.comboHits} HITS`, window.canvas.width - 20, 70 + Math.sin(Date.now() / 100) * 2);
        }

        if (window.gameOver && window.matchEndTimer >= 90 && window.endIconType) {
            window.ctx.save(); let popScale = Math.min(1, (window.matchEndTimer - 90) / 25); let easeScale = Math.sin(popScale * Math.PI / 2); 
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(easeScale * 1.2, easeScale * 1.2); window.ctx.font = "140px Arial"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle";
            if (window.endIconType === 'win') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🏆", 0, 0); } 
            else if (window.endIconType === 'lose') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#ff4757"; window.ctx.fillText("💀", 0, 0); }
            window.ctx.restore();
        }
        window.ctx.restore();

        if (window.screenFlash > 0) { window.ctx.fillStyle = `rgba(255, 255, 255, ${window.screenFlash})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); }
        if (window.cinematicTimer > 0 && window.cinematicCaster) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let stripY = window.canvas.height / 2 - 50; window.ctx.fillStyle = window.cinematicCaster.color; window.ctx.fillRect(0, stripY, window.canvas.width, 100);
            let progress = (50 - window.cinematicTimer) / 50; let slideX = -200 + (progress * 800); window.ctx.fillStyle = "#fff"; window.ctx.font = "italic 900 60px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#fff"; window.ctx.fillText("⚡", slideX, stripY + 70); window.ctx.shadowBlur = 0;
            let avaX = window.canvas.width - slideX; let casterClone = Object.assign({}, window.cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); if(casterClone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, casterClone); else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, casterClone);
        }
        
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.textAlign = "center";
            if (window.introTimer > 60) {
                let slideProgress = Math.min(1, (160 - window.introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let targetX1 = 150; let targetX2 = window.canvas.width - 150; let slideX1 = -100 + (targetX1 - (-100)) * easeOut; let slideX2 = window.canvas.width + 100 - (window.canvas.width + 100 - targetX2) * easeOut;
                
                let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y, state: window.p1.introState || 'idle', isFacingRight: true, scale: (window.p1.scale || 1) * 1.2}); if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                if (window.enemies && window.enemies.length > 0) { 
                    let repEnemy = window.enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y, state: repEnemy.isDragon ? 'idle' : (repEnemy.introState || 'idle'), isFacingRight: false, scale: (repEnemy.scale || 1) * 1.2}); 
                    if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, repEnemy); else if (repEnemy.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p2Clone); else if (repEnemy.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p2Clone); else if (repEnemy.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p2Clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                }
                if (window.introTimer <= 120) { window.ctx.font = "italic 900 80px Arial"; window.ctx.fillStyle = "#f1c40f"; window.ctx.shadowBlur = 25; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🆚", window.canvas.width/2, window.GROUND_Y - 120); window.ctx.shadowBlur = 0; }
            } else { 
                let scale = 1 + (window.introTimer / 60) * 0.5; window.ctx.save(); window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(scale, scale); window.ctx.font = "italic 900 100px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 4; window.ctx.shadowBlur = 30; window.ctx.shadowColor = "#ff4757"; window.ctx.strokeText("🥊 FIGHT! 🥊", 0, 30); window.ctx.fillText("🥊 FIGHT! 🥊", 0, 30); window.ctx.restore(); 
            }
        }

        if (window.koGlitchTimer > 0) {
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.koGlitchTimer > 45) { window.ctx.fillStyle = `rgba(0, 0, 0, ${1 - (window.koGlitchTimer - 45) / 15})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); } 
            else { window.ctx.fillStyle = `rgba(0, 0, 0, 0.6)`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); }
            if (window.koGlitchTimer > 10) { window.ctx.font = "italic 900 120px Courier New"; window.ctx.fillStyle = `rgba(255, 0, 0, 0.9)`; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#ff0000"; window.ctx.fillText("💀", window.canvas.width/2, window.canvas.height/2 + 20); window.ctx.shadowBlur = 0; }
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; for(let i=0; i<window.canvas.height; i+=5) { window.ctx.fillRect(0, i, window.canvas.width, 1); }
        }

        if (window.chromaTimer > 0) {
            let shift = window.chromaTimer * 1.5; let tempCanvas = document.createElement('canvas'); tempCanvas.width = window.canvas.width; tempCanvas.height = window.canvas.height;
            let tCtx = tempCanvas.getContext('2d'); tCtx.drawImage(window.canvas, 0, 0);
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = 0.4;
            window.ctx.drawImage(tempCanvas, shift, 0); window.ctx.drawImage(tempCanvas, -shift, 0);
            window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; window.chromaTimer--;
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); try { if(typeof window.update === 'function') window.update(); } catch(e) { } try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } } 
}
