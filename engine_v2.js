// ==========================================
// ENGINE_V2.JS - LÕI VẬT LÝ, GAME LOOP VÀ RENDER TỔNG
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

window.triggerVibration = function(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); window.isMuted = !window.isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } }

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
            osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(15, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
            
            let snap = window.audioCtx.createOscillator(); let snapGain = window.audioCtx.createGain();
            snap.type = 'square'; snap.frequency.setValueAtTime(freq * 3, t); snap.frequency.exponentialRampToValueAtTime(30, t + 0.05);
            snapGain.gain.setValueAtTime(safeVol * 0.4, t); snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            snap.connect(snapGain); snapGain.connect(window.audioCtx.destination);
            if (window.isRecording && window.recordAudioDestination) { snapGain.connect(window.recordAudioDestination); }
            snap.start(t); snap.stop(t + 0.05);
        } else { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); 
            gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.6, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
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

window.envDamage = [];
window.spawnEnvDamage = function(x, y, type, scale) {
    let cracks = []; let numCracks = (type === 'crater') ? 5 + Math.floor(Math.random()*4) : 3 + Math.floor(Math.random()*3);
    for(let i=0; i<numCracks; i++) {
        let angle; if (type === 'crater') angle = Math.random() * Math.PI * 2; else if (type === 'wall_left') angle = -Math.PI/2 + Math.random() * Math.PI; else angle = Math.PI/2 + Math.random() * Math.PI; 
        let len = (25 + Math.random()*40) * scale; let endX = Math.cos(angle) * len; let endY = Math.sin(angle) * len;
        let midX = endX * 0.5 + (Math.random()-0.5)*15; let midY = endY * 0.5 + (Math.random()-0.5)*15;
        cracks.push({ mx: midX, my: midY, ex: endX, ey: endY });
    }
    window.envDamage.push({x: x, y: y, type: type, cracks: cracks, scale: scale});
};

window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1) return; 

    if (window.koGlitchTimer > 0) { window.koGlitchTimer--; if (window.bgmBase) window.bgmBase.volume = 0; if (window.bgmClimax) window.bgmClimax.volume = 0; }
    if (window.uiShakeP1 > 0) { window.uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }

    if (window.introTimer > 0) { 
        window.introTimer--; 
        if (window.p1 && window.enemies.length > 0) { window.p1.x = 150; window.enemies.forEach((e, i) => { e.x = window.canvas.width - 150 + (i * 40); }); }
        if (window.introTimer === 60) window.playSound(100, 'sine', 0.5, 0.5, true); 
        return; 
    }

    if (!window.gameOver) {
        window.matchTimer++; if (window.matchTimer === 1) { window.envHazards = []; window.envDamage = []; }
        let meteorChance = 0.002 + (window.matchTimer / 3600) * 0.01; 
        if (Math.random() < meteorChance) { window.projectiles.push({ x: Math.random() * window.canvas.width, y: -100, vx: (Math.random() - 0.5) * 4, vy: 8 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); }
        if (window.currentWeather === 'rain' && Math.random() < 0.005) { window.envHazards.push({ type: 'lightning', x: Math.random() * window.canvas.width, timer: 45 }); } 
        else if (window.currentWeather === 'ash' && Math.random() < 0.003) { window.envHazards.push({ type: 'lava', x: Math.random() * window.canvas.width, timer: 60 }); }
    }

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; if (window.screenFlash > 0) window.screenFlash -= 0.05;
    if (window.cinematicTimer > 0 && !isSlowMoFrame) { window.cinematicTimer--; if (window.cinematicTimer === 0 && window.cinematicCallback) { try { window.cinematicCallback(); } catch(e) {} window.cinematicCallback = null; } return; }
    if (window.hitStopFrames > 0 && !isSlowMoFrame) { window.hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    let allFighters = [window.p1].concat(window.enemies);

    for (let i = window.envHazards.length - 1; i >= 0; i--) {
        let haz = window.envHazards[i]; haz.timer--;
        if (haz.timer <= 0) {
            if (haz.type === 'lightning') {
                window.playSound(300, 'sawtooth', 0.8, 0.8, true); window.screenFlash = 0.8; window.shakeScreen(20, 15); window.slashes.push({ x: haz.x, y: window.GROUND_Y - 300, isRight: true, life: 15, maxLife: 15, color: "#ffffff", scale: 5, rotation: Math.PI/2 });
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 60) { if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#f1c40f", true, false); f.state = 'hurt'; f.hitStun = 35; f.vx = (f.x - haz.x > 0 ? 15 : -15); } });
            } else if (haz.type === 'lava') {
                window.playSound(100, 'square', 0.8, 0.8, true); window.shakeScreen(25, 12); window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); for(let k=0; k<15; k++) window.particles.push({ x: haz.x + (Math.random()-0.5)*40, y: window.GROUND_Y, vx: (Math.random()-0.5)*12, vy: -10 - Math.random()*15, life: 40, maxLife: 40, color: "#e67e22", size: Math.random()*12+5 });
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false); f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; } });
            } window.envHazards.splice(i, 1);
        }
    }

    window.weatherParticles.forEach(w => { 
        if (window.currentWeather === 'toxic' || window.currentWeather === 'ash') { w.y -= w.speed * 0.5; w.x += Math.sin(w.y/30)*2; if(w.y < -20) { w.y = window.canvas.height + 20; w.x = Math.random() * 1200 - 300; } } 
        else { w.y += w.speed; w.x += (window.currentWeather === 'rain') ? -3 : Math.sin(w.y/50)*2; if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } }
    });

    for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
    for (let i = window.particles.length - 1; i >= 0; i--) { let pt = window.particles[i]; if (pt.isCoin) { pt.vy += window.GRAVITY * 0.5; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); }
    if (Math.random() < 0.12) { window.particles.push({ x: Math.random() * window.canvas.width, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -6; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; window.spawnParticles(e.x, e.y, "#fff", true); window.playSound(100, 'sine', 0.5, 0.5, true); 
            for(let c=0; c<5; c++) window.particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true });
            if (window.p1 && window.p1.hp > 0) { let heal = Math.floor(window.p1.maxHp * 0.08); window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 }); }
        }
    });

    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -6; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; window.spawnParticles(window.p1.x, window.p1.y, "#fff", true); }
    
    let gameContext = { floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (!f) return;
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; f.vy += window.GRAVITY * 0.5; 
            if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { 
                window.spawnDust(f.x, window.GROUND_Y); 
                if (f.vy > 8 || f.state === 'ko_falling') { window.shakeScreen(f.vy > 10 ? 8 : 5, 4); window.spawnEnvDamage(f.x, window.GROUND_Y, 'crater', f.scale || 1); } 
                else if (f.vy > 6) { window.shakeScreen(4, 2); }
            } 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.93; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } return; 
        }

        if (f.iFrames > 0) { f.iFrames--; } else { f.iFrames = 0; }
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout <= 0) f.comboStep = 0; }
        if (f.comboTimer > 0) f.comboTimer--; if (f.superArmor > 0) f.superArmor--; 
        
        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) { f.state = 'idle'; } }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') { f.state = 'idle'; } }
        if (f.state === 'idle' || f.state === 'walk') { f.iFrames = 0; }

        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.2); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; 

        if (window.currentWeather === 'snow') { f.currentSpeed *= 0.65; } else if (window.currentWeather === 'rain') { f.currentSpeed *= 1.25; } else if (window.currentWeather === 'ash') { f.currentDmgMod *= 1.30; } 
        else if (window.currentWeather === 'toxic') { f.currentDmgMod *= 0.80; if (window.matchTimer % 90 === 0 && f.hp > 1 && !window.gameOver) { f.hp -= 1; window.particles.push({x: f.x, y: f.y-30, vx:0, vy:-1, life:20, maxLife:20, color:"#2ecc71", size:4}); } }

        if (f.isRage) { f.currentSpeed *= 1.5; f.currentDmgMod *= 1.5; f.aiDelay = 0; window.particles.push({ x: f.x + (Math.random() - 0.5) * 40, y: f.y - Math.random() * 80, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 6 - 2, life: 30, maxLife: 30, color: "#ff4757", size: Math.random() * 6 + 3 }); if (Math.random() < 0.05) window.shakeScreen(2, 2); }
        if (f.hp > 0 && f.stamina < 100) f.stamina += (f.isRage ? 1.0 : (f.regen || 0.3)); if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false; if (f.isExhausted) { f.currentSpeed *= 0.6; }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        // GỌI HÀM AI ĐÃ ĐƯỢC TÁCH RA COMBAT_AI.JS ĐỂ FILE GỌN HƠN
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (typeof window.processFighterAI === 'function') {
                window.processFighterAI(f, gameContext);
            }
        }

        f.vy += window.GRAVITY; if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { window.spawnDust(f.x, window.GROUND_Y); if (f.vy > 8) window.shakeScreen(5, 3); }
        f.y += f.vy; if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        let friction = (window.currentWeather === 'rain') ? 0.95 : 0.85;
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; if (f.onGround && window.matchTimer % 4 === 0) window.spawnDust(f.x, window.GROUND_Y); } 
        else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { f.vx *= friction; }
        f.x += f.vx;
    });

    for (let i = 0; i < allFighters.length; i++) { 
        for (let j = i + 1; j < allFighters.length; j++) { 
            let f1 = allFighters[i], f2 = allFighters[j]; if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
            let overlapX = f2.x - f1.x; let pushDist = 30 * Math.max(f1.scale||1, f2.scale||1); 
            if (Math.abs(overlapX) < pushDist) { let pushForce = (pushDist - Math.abs(overlapX)) / 2; if (overlapX === 0) overlapX = 1; let sign = Math.sign(overlapX); f1.x -= pushForce * sign; f2.x += pushForce * sign; } 
        } 
    }

    allFighters.forEach(f => {
        if (!f || f.hp <= 0) return;
        let wallBound = 35 * (f.scale || 1);
        
        if (f.x < wallBound) { 
            f.x = wallBound; 
            if (f.hitStun > 0 && f.vx < -4 && !f.wallBounced) { 
                f.wallBounced = true; f.vx = 4; f.hitStun = 15; window.shakeScreen(10, 4); window.spawnEnvDamage(wallBound, f.y, 'wall_left', f.scale || 1);
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } 
        }
        if (window.canvas && f.x > window.canvas.width - wallBound) { 
            f.x = window.canvas.width - wallBound; 
            if (f.hitStun > 0 && f.vx > 4 && !f.wallBounced) { 
                f.wallBounced = true; f.vx = -4; f.hitStun = 15; window.shakeScreen(10, 4); window.spawnEnvDamage(window.canvas.width - wallBound, f.y, 'wall_right', f.scale || 1);
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } 
        }
        if (f.hitStun <= 0 || f.onGround) f.wallBounced = false; 

        if (!f.trailArr) f.trailArr = [];
        let isAttacking = f.attackTimer > 0 && ['jab','cross','low_kick','hook','backfist','teep_kick','elbow_strike','high_kick','spinning_heel','shoulder_bash','palm_strike','uppercut','knee_strike','axe_kick','one_inch_punch','dempsey_roll','machine_gun_punches','dragon_uppercut','asura_strike','scratch','breathe_fire', 'taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'].includes(f.state);
        if (((f.state === 'dash' || f.state === 'dash_back' || f.isRage) && Math.abs(f.vx) > 1) || (isAttacking && f.attackTimer % 2 === 0)) { f.trailArr.push({x: f.x, y: f.y, state: f.state, isFacingRight: f.isFacingRight, color: f.color, alpha: 0.5, scale: f.scale, isDragon: f.isDragon}); }
        for (let i = f.trailArr.length - 1; i >= 0; i--) { f.trailArr[i].alpha -= 0.05; if (f.trailArr[i].alpha <= 0) f.trailArr.splice(i, 1); }
    });

    for (let i = window.projectiles.length - 1; i >= 0; i--) { 
        let proj = window.projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; 
        if (proj.isMeteor) {
            window.particles.push({ x: proj.x + (Math.random()-0.5)*10, y: proj.y, vx: 0, vy: -2, life: 15, maxLife: 15, color: "#f1c40f", size: Math.random()*4+2 });
            if (proj.y >= window.GROUND_Y) {
                window.shakeScreen(15, 6); window.shockwaves.push({x: proj.x, y: window.GROUND_Y, r: 10, maxR: 150, color: "#e74c3c", alpha: 1, speed: 10}); window.playSound(200, 'sawtooth', 0.5, 0.6, true);
                window.spawnEnvDamage(proj.x, window.GROUND_Y, 'crater', 1);
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
    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }
    
    if (window.p1 && window.introTimer === 0) {
        let closest = window.getClosestEnemy(window.p1, window.enemies);
        if (closest && !window.gameOver && window.slowMoTimer <= 0) {
            let midX = (window.p1.x + closest.x) / 2; let midY = (window.p1.y + closest.y) / 2; let maxPanX = window.canvas.width * 0.25; let desiredCamX = (window.canvas.width / 2) - midX; window.targetCamX = Math.max(-maxPanX, Math.min(maxPanX, desiredCamX));
            let jumpFollowY = (window.GROUND_Y - midY) * 0.5; window.targetCamY = Math.max(0, Math.min(100, jumpFollowY)); 
            let distance = Math.abs(window.p1.x - closest.x); let dynamicZoom = 1.25 - (distance / 600) * 0.35; window.targetZoom = Math.max(0.9, Math.min(1.25, dynamicZoom));
            let p1Low = window.p1.hp < window.p1.maxHp * 0.3; let eLow = closest.hp < closest.maxHp * 0.3;
            if (p1Low && eLow) { window.targetTilt = 0.05 * Math.sin(window.matchTimer * 0.06); } else if (p1Low || eLow) { window.targetTilt = 0.025 * Math.sin(window.matchTimer * 0.04); } else { window.targetTilt = 0; }
        } else if (window.slowMoTimer > 0) {
            let focusX = window.canvas.width / 2; let focusY = window.GROUND_Y; if (window.p1 && window.p1.hp > 0) { focusX = window.p1.x; focusY = window.p1.y; } else { let aliveEnemy = window.enemies.find(e => e.hp > 0); if (aliveEnemy) { focusX = aliveEnemy.x; focusY = aliveEnemy.y; } }
            window.targetCamX = (window.canvas.width / 2) - focusX; window.targetCamY = Math.max(0, (window.GROUND_Y - focusY) * 0.5); window.targetZoom = 1.35; window.targetTilt = 0.025 * Math.sin(window.slowMoTimer * 0.1);
        } else { window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0; }
    } else { window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0; }

    window.camX += (window.targetCamX - window.camX) * 0.08; window.camY += (window.targetCamY - window.camY) * 0.08; window.currentZoom += (window.targetZoom - window.currentZoom) * 0.08; window.cameraTilt += (window.targetTilt - window.cameraTilt) * 0.08;
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { let t = window.floatingTexts[i]; if (t.life !== undefined) { t.vy += window.GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) window.floatingTexts.splice(i, 1); }
}

window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    window.ctx.setTransform(1, 0, 0, 1, 0, 0); window.ctx.globalAlpha = 1.0; window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.save();
    
    try {
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(window.currentZoom, window.currentZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        if (window.impactFrameTimer > 0) { window.impactFrameTimer--; window.ctx.fillStyle = (window.impactFrameTimer % 2 === 0) ? "#ffffff" : "#000000"; window.ctx.fillRect(-800, -800, window.canvas.width + 1600, window.canvas.height + 1600); window.ctx.globalCompositeOperation = "difference"; } 
        else { window.ctx.globalCompositeOperation = "source-over"; }

        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        window.ctx.fillStyle = cmap.sky; window.ctx.fillRect(-400, -100, window.canvas.width + 800, window.canvas.height + 100);
        
        window.ctx.save(); window.ctx.translate(-window.camX * 0.7, 0); window.ctx.fillStyle = cmap.bg2;
        for(var i = -800; i < window.canvas.width + 1200; i += 150) {
            let t2 = cmap.bg2Type || "mountains";
            if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+75, window.GROUND_Y-120+Math.sin(i)*30); window.ctx.lineTo(i+150, window.GROUND_Y); window.ctx.fill(); }
            else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+100, window.GROUND_Y-150); window.ctx.lineTo(i+200, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+40, window.GROUND_Y-50, 120, 5); window.ctx.fillRect(i+60, window.GROUND_Y-80, 80, 5); }
            else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i+75, window.GROUND_Y-15, 100, 10, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.ellipse(i+20, window.GROUND_Y-30, 60, 5, 0, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y-180+Math.sin(i)*30, 60, 0, Math.PI*2); window.ctx.arc(i+50, window.GROUND_Y-150+Math.cos(i)*20, 50, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i+Math.sin(i)*50, window.GROUND_Y-250+Math.cos(i)*100, 3+Math.random()*4, 0, Math.PI*2); window.ctx.fill(); }
        }
        window.ctx.restore();

        window.ctx.save(); window.ctx.translate(-window.camX * 0.4, 0); window.ctx.fillStyle = cmap.bg1;
        for(var i = -800; i < window.canvas.width + 1200; i += 120) {
            let t1 = cmap.bg1Type || "city"; let h = 100 + Math.abs(Math.sin(i))*80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y-h, 70, h); if(i%3===0) window.ctx.clearRect(i+10, window.GROUND_Y-h+20, 15, 20); }
            else if (t1 === "trees") { window.ctx.fillRect(i+25, window.GROUND_Y-h, 20, h); window.ctx.beginPath(); window.ctx.arc(i+35, window.GROUND_Y-h, 45, 0, Math.PI*2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i+25, window.GROUND_Y-30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y-20); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+60, window.GROUND_Y-20); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y-10); window.ctx.lineTo(i+30, window.GROUND_Y-h+40); window.ctx.lineTo(i+70, window.GROUND_Y-10); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i+10, window.GROUND_Y-h, 40, h); window.ctx.fillRect(i, window.GROUND_Y-20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y-h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i+30, window.GROUND_Y-60, 30, Math.PI, 0); window.ctx.lineTo(i+60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+25, window.GROUND_Y-100, 10, 30); window.ctx.fillRect(i+15, window.GROUND_Y-90, 30, 10); }
            else if (t1 === "crystals") { window.ctx.beginPath(); window.ctx.moveTo(i+10, window.GROUND_Y); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+50, window.GROUND_Y); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y); window.ctx.lineTo(i+10, window.GROUND_Y-h*0.6); window.ctx.lineTo(i+30, window.GROUND_Y); window.ctx.fill(); }
            else if (t1 === "ruins") { window.ctx.fillRect(i, window.GROUND_Y-h, 50, h); window.ctx.clearRect(i+10, window.GROUND_Y-h-5, 20, 30); window.ctx.clearRect(i+30, window.GROUND_Y-h+40, 25, 20); }
            else if (t1 === "digital") { window.ctx.font="bold 24px monospace"; window.ctx.fillText(Math.random()>0.5?"10101":"01100", i, window.GROUND_Y-h); window.ctx.fillText(Math.random()>0.5?"111":"000", i+10, window.GROUND_Y-h+30); }
        }
        window.ctx.restore();
        
        window.ctx.fillStyle = cmap.ground; window.ctx.fillRect(-400, window.GROUND_Y, window.canvas.width + 800, window.canvas.height - window.GROUND_Y); 
        window.ctx.strokeStyle = cmap.line; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-400, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 400, window.GROUND_Y); window.ctx.stroke();
        window.ctx.strokeStyle = "#222"; window.ctx.lineWidth = 2; for(var i = -400; i < window.canvas.width + 400; i+=50) { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i - 20, window.canvas.height); window.ctx.stroke(); }
        
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.WALL_PADDING, 0, 4, window.canvas.height); 
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.canvas.width - window.WALL_PADDING, 0, 4, window.canvas.height); 

        if (window.envDamage && window.envDamage.length > 0) {
            window.ctx.save(); window.ctx.lineCap = "round"; window.ctx.lineJoin = "round";
            window.envDamage.forEach(dmg => {
                window.ctx.save(); window.ctx.translate(dmg.x, dmg.y);
                if (dmg.type === 'crater') window.ctx.scale(1, 0.35); 
                window.ctx.fillStyle = "#000"; window.ctx.beginPath(); window.ctx.arc(0, 0, 8 * dmg.scale, 0, Math.PI * 2); window.ctx.fill();
                window.ctx.strokeStyle = "rgba(0, 0, 0, 0.65)"; window.ctx.lineWidth = 3 * dmg.scale;
                dmg.cracks.forEach(c => {
                    window.ctx.beginPath(); window.ctx.moveTo(0, 0);
                    window.ctx.lineTo(c.mx, c.my); window.ctx.lineTo(c.ex, c.ey); window.ctx.stroke();
                });
                window.ctx.restore();
            });
            window.ctx.restore();
        }

        if (window.envHazards && window.envHazards.length > 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = 'lighter';
            window.envHazards.forEach(haz => {
                if (haz.type === 'lightning') { window.ctx.fillStyle = `rgba(241, 196, 15, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.fillRect(haz.x - 40, -500, 80, window.GROUND_Y + 500); } 
                else if (haz.type === 'lava') { window.ctx.fillStyle = `rgba(231, 76, 60, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.beginPath(); window.ctx.ellipse(haz.x, window.GROUND_Y, 60 + Math.sin(haz.timer)*10, 15, 0, 0, Math.PI*2); window.ctx.fill(); }
            });
            window.ctx.restore(); window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";
        }

        window.ctx.save(); window.ctx.lineWidth = 1;
        window.weatherParticles.forEach(w => { 
            if (window.currentWeather === 'snow') { window.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size, 0, Math.PI*2); window.ctx.fill(); } 
            else if (window.currentWeather === 'rain') { window.ctx.strokeStyle = "rgba(155, 155, 255, 0.6)"; window.ctx.beginPath(); window.ctx.moveTo(w.x, w.y); window.ctx.lineTo(w.x - 6, w.y + 15); window.ctx.stroke(); } 
            else if (window.currentWeather === 'ash') { window.ctx.fillStyle = "rgba(230, 126, 34, 0.6)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 0.8, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'toxic') { window.ctx.fillStyle = "rgba(46, 204, 113, 0.4)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 1.2, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'petals') { window.ctx.fillStyle = "rgba(253, 121, 168, 0.7)"; window.ctx.beginPath(); window.ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); window.ctx.fill(); }
        });
        window.ctx.restore();

        window.traps.forEach(t => { window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
        window.projectiles.forEach(proj => { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.fill(); if(proj.isMeteor) { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius + 10, 0, Math.PI * 2); window.ctx.fillStyle = "rgba(230, 126, 34, 0.4)"; window.ctx.fill(); } });
        
        window.ctx.globalCompositeOperation = 'lighter';
        window.shockwaves.forEach(sw => { window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); });
        window.impactSparks.forEach(isp => { window.ctx.save(); window.ctx.translate(isp.x, isp.y); window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 2, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
        window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";

        let allFighters = [window.p1].concat(window.enemies); 

        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        allFighters.forEach(p => {
            if (p && p.hp >= 0) {
                let heightDist = Math.max(0, window.GROUND_Y - p.y); let shadowScale = Math.max(0.15, 1 - heightDist / 250) * (p.scale || 1);
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
            window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";
            if (window.p1.stamina >= 100) { window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#f1c40f"; } 

            window.enemies.forEach(e => { 
                window.ctx.save();
                if (e.state === 'ko_falling' || e.state === 'dead') { 
                    window.ctx.translate(e.x, e.y); let angle = Math.PI / 2; if (e.state === 'ko_falling') { let progress = (100 - e.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = e.isFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, e, { x: 0, y: 0 }); 
                    if(e.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                    else if (e.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone);
                    else if (e.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone);
                    else if (e.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } 
                else { 
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

            window.ctx.shadowBlur = 0;
            if (window.p1.comboHits >= 2) { window.ctx.save(); window.ctx.font = "italic 900 28px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.textAlign = "left"; window.ctx.shadowBlur = 10; window.ctx.shadowColor = "#ff9f43"; window.ctx.fillText(`🔥 ${window.p1.comboHits}`, 30, 100 + Math.sin(Date.now() / 100) * 5); window.ctx.restore(); }
        }

        window.slashes.forEach(s => { window.ctx.save(); window.ctx.translate(s.x, s.y); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale, s.scale); window.ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); window.ctx.lineWidth = 15 * (1 - prog); let grad = window.ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); window.ctx.strokeStyle = grad; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 15; window.ctx.shadowColor = s.color; window.ctx.stroke(); window.ctx.restore(); });
        window.particles.forEach(pt => { window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); window.ctx.fillStyle = pt.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fill(); if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } }); window.ctx.globalAlpha = 1.0;
        window.floatingTexts.forEach(t => { window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.shadowBlur = 5; window.ctx.shadowColor = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.fillText(t.text, t.x, t.y); window.ctx.shadowBlur = 0; }); window.ctx.globalAlpha = 1.0;

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
                    if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, repEnemy); 
                    else if (repEnemy.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p2Clone);
                    else if (repEnemy.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p2Clone);
                    else if (repEnemy.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p2Clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                }
                
                window.ctx.font = "italic 900 35px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.fillText("👤", slideX1, window.GROUND_Y + 60);
                
                let eName = (window.rewardMultiplier === 15) ? (window.enemies[0].isBruceLee ? "🥋" : (window.enemies[0].isSamurai ? "🗡️" : (window.enemies[0].isNinja ? "🥷" : "🐉"))) : "🤖"; 
                window.ctx.fillStyle = "#1e90ff"; window.ctx.fillText(eName, slideX2, window.GROUND_Y + 60);
                
                if (window.introTimer <= 120) { window.ctx.font = "italic 900 80px Arial"; window.ctx.fillStyle = "#f1c40f"; window.ctx.shadowBlur = 25; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🆚", window.canvas.width/2, window.GROUND_Y - 120); window.ctx.shadowBlur = 0; }
            } else { let scale = 1 + (window.introTimer / 60); window.ctx.save(); window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(scale, scale); window.ctx.font = "italic 900 90px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.shadowBlur = 30; window.ctx.shadowColor = "#ff9f43"; window.ctx.fillText("🥊", 0, 30); window.ctx.restore(); }
        }

        if (window.koGlitchTimer > 0) {
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.koGlitchTimer % 3 === 0) {
                for(let i=0; i<3; i++) {
                    let sliceY = Math.random() * window.canvas.height; let sliceH = Math.random() * 80 + 10; let offset = (Math.random() - 0.5) * 50;
                    window.ctx.drawImage(window.canvas, 0, sliceY, window.canvas.width, sliceH, offset, sliceY, window.canvas.width, sliceH);
                    window.ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 0, 0, 0.25)" : "rgba(0, 255, 255, 0.25)";
                    window.ctx.globalCompositeOperation = 'screen'; window.ctx.fillRect(0, sliceY, window.canvas.width, sliceH); window.ctx.globalCompositeOperation = 'source-over';
                }
            }
            if (window.koGlitchTimer > 45) { window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = 'white'; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = 'source-over'; }
            if (window.koGlitchTimer > 10) {
                window.ctx.font = "italic 900 120px Courier New"; window.ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.5})`; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#ff0000";
                window.ctx.fillText("💀", window.canvas.width/2 + (Math.random()-0.5)*10, window.canvas.height/2 + (Math.random()-0.5)*10); window.ctx.shadowBlur = 0;
            }
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; for(let i=0; i<window.canvas.height; i+=5) { window.ctx.fillRect(0, i, window.canvas.width, 1); }
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); try { if(typeof window.update === 'function') window.update(); } catch(e) { } try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } } 
}
