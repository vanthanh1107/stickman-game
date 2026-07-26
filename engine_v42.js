// ==========================================
// ENGINE.JS - THE ABSOLUTE ULTIMATE MASTERPIECE 36.0 [THE CLARITY ORBIT]
// [FIXED] Tinh chỉnh Màn hình loá (Screen Flash) giảm nhanh để không che khuất hiệu ứng xoay 360.
// [ENHANCED] Vòng quay 360 độ Ma Trận mượt hơn, chậm hơn, khóa cứng tâm điểm vào 2 nhân vật.
// [BASE] Giữ nguyên 100% Gương vỡ (Glass Shatter), Lò xo số, Lethal Void và RTX Floor.
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; window.lensFlares = [];

window.p1 = null; window.gameOver = false; window.isLoopRunning = false;
window.enemies = []; window.totalEnemyMaxHp = 0; window.rewardMultiplier = 1; 

window.shakeTime = 0; window.shakeMag = 0; window.hitStopFrames = 0; window.matchResolved = false;
window.screenFlash = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
window.introTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0;
window.currentWeather = 'none'; window.weatherParticles = [];

window.GROUND_Y = 320; window.GRAVITY = 0.8; 
window.matchTimer = 0; window.impactFrameTimer = 0;

window.camX = 0; window.camY = 0; window.currentZoom = 1; window.cameraTilt = 0;
window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0;
window.actionCamOffsetX = 0; window.actionCamOffsetY = 0; window.dynamicBlur = 0; window.cinemaBarsHeight = 0; 

// [VIRAL 36.0] 3D MATRIX CAMERA VARS
window.camOrbitAngle = 0; 
window.targetCamOrbitAngle = 0; 
window.isSpinningCam = false; 
window.orbitFocusX = 0;
window.orbitFocusY = window.GROUND_Y - 60; 

window.globalWind = 0; window.chromaTimer = 0; window.vhsGlitchTimer = 0;
window.envHazards = []; window.WALL_PADDING = 40; window.koGlitchTimer = 0; window.envDamage = []; 
window.timeStopTimer = 0; window.timeStopCaster = null; window.screenFilter = null; window.filterTimer = 0;
window.vignetteAlpha = 0.5; window.isLowHpPulsing = 0; window.speedLinesAlpha = 0; 
window.impactFrameCount = 0; window.cameraZoomVel = 0; window.actionCamSkew = 0;

window.mangaSfx = []; window.dimensionCracks = []; window.inkSplatters = []; window.invertFrames = 0; window.noiseCanvas = null; 
window.timeScale = 1.0; window.targetTimeScale = 1.0; window.camVelocityX = 0; window.camDriftX = 0; window.camDriftY = 0;
window.foregroundDebris = []; window.lethalVoid = 0; window.impactAberration = 0; window.bassDropFrames = 0; window.screenTearing = 0; 

window.viralColorGrade = { contrast: 100, brightness: 100, saturation: 100, hue: 0 };
window.globalIllumination = null; window.isLoading = true; window.loadProgress = 0; window.chromaCanvas = null; 

const MAX_PARTICLES = 250; const MAX_SHOCKWAVES = 10;

// ==========================================
// 1. HỆ THỐNG ÂM THANH & COLOR GRADING
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    window.viralHueShift = Math.floor(Math.random() * 360);
    window.viralShakeMult = 0.9 + Math.random() * 0.4;
    window.viralColorGrade = { 
        contrast: 125 + Math.random() * 15, 
        brightness: 90 + Math.random() * 10, 
        saturation: 100 + Math.random() * 30, 
        hue: Math.floor((Math.random() - 0.5) * 20) 
    };

    const lightingThemes = [
        { mix: 'overlay', color1: 'rgba(255, 120, 30, 0.3)', color2: 'rgba(10, 0, 20, 0.5)' },
        { mix: 'hard-light', color1: 'rgba(0, 180, 255, 0.2)', color2: 'rgba(0, 5, 30, 0.7)' },
        { mix: 'color-burn', color1: 'rgba(255, 30, 30, 0.2)', color2: 'rgba(0, 0, 0, 0.6)' },
        { mix: 'multiply', color1: 'rgba(255, 255, 255, 0.0)', color2: 'rgba(15, 20, 35, 0.8)' }
    ];
    window.globalIllumination = lightingThemes[Math.floor(Math.random() * lightingThemes.length)];

    window.noiseCanvas = document.createElement('canvas'); window.noiseCanvas.width = 300; window.noiseCanvas.height = 300;
    let nCtx = window.noiseCanvas.getContext('2d'); let imgData = nCtx.createImageData(300, 300);
    for (let i = 0; i < imgData.data.length; i += 4) { let val = Math.random() * 255; imgData.data[i] = val; imgData.data[i+1] = val; imgData.data[i+2] = val; imgData.data[i+3] = Math.random() * 20; }
    nCtx.putImageData(imgData, 0, 0);

    if (!window.audioCtx) { try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} }
    let loadInterval = setInterval(() => {
        window.loadProgress += Math.random() * 10 + 5; 
        if (window.loadProgress >= 100) { window.loadProgress = 100; clearInterval(loadInterval); setTimeout(() => { window.isLoading = false; window.playSound(800, 'sine', 0.5, 0.5); }, 300); }
    }, 30);
};

window.triggerVibration = function(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); window.isMuted = !window.isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } }
window.playSound = function(freq, type, duration, vol, isImpact = false) { 
    if (window.isMuted) return; 
    try {
        if (!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        let t = window.audioCtx.currentTime; let osc = window.audioCtx.createOscillator(); let gain = window.audioCtx.createGain(); 
        osc.connect(gain); gain.connect(window.audioCtx.destination); let safeVol = Math.min(vol, 1.0); 
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : type; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(15, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
            let snap = window.audioCtx.createOscillator(); let snapGain = window.audioCtx.createGain(); snap.type = 'square'; snap.frequency.setValueAtTime(freq * 3, t); snap.frequency.exponentialRampToValueAtTime(30, t + 0.05); snapGain.gain.setValueAtTime(safeVol * 0.4, t); snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05); snap.connect(snapGain); snapGain.connect(window.audioCtx.destination); snap.start(t); snap.stop(t + 0.05);
        } else { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.6, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
}

// ==========================================
// 2. HỆ THỐNG SPAWN VFX VẬT LÝ
// ==========================================
window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude * (window.viralShakeMult || 1); }
window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit) { window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { window.slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 2.5 : 1.5) * scale, rotation: rotation }); }
window.spawnParticles = function(x, y, color, isCrit = false) { if (window.particles.length > MAX_PARTICLES) return; let count = isCrit ? 25 : 10; for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?18:8) + 2; window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 25, maxLife: 25, color: color, size: Math.random() * 5 + 2 }); } }
window.spawnDust = function(x, y) { if (window.particles.length > MAX_PARTICLES) return; for(let i=0; i<8; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y, vx: (Math.random()-0.5)*8, vy: -Math.random()*2 - 0.2, life: 30, maxLife: 30, color: "rgba(189, 195, 199, 0.4)", size: Math.random() * 12 + 6, isGroundDust: true }); } }
window.spawnInk = function(x, y, color, isRight) { window.inkSplatters.push({ x: x, y: y, color: color, life: 35, maxLife: 35, scale: Math.random() * 0.8 + 0.6, ang: (Math.random() - 0.5)*0.5 + (isRight ? 0 : Math.PI) }); }
window.spawnForegroundDebris = function(x, y, isRight) { let count = 6 + Math.floor(Math.random() * 4); for(let i=0; i<count; i++) { let vx = (isRight ? 1 : -1) * (15 + Math.random() * 20); let vy = -10 - Math.random() * 15; let scaleSpeed = 1.05 + Math.random() * 0.05; window.foregroundDebris.push({ x: x, y: y, vx: vx, vy: vy, life: 40, maxLife: 40, scale: 1.0, scaleSpeed: scaleSpeed, rot: Math.random() * Math.PI, rotSpeed: (Math.random() - 0.5) * 0.4 }); } }
window.triggerCinematic = function(caster, callback) { window.cinematicTimer = 50; window.cinematicCaster = caster; window.cinematicCallback = callback; window.targetZoom = 1.35; window.playSound(400, 'sine', 0.4, 0.2, false); window.speedLinesAlpha = 1.0; }
window.spawnAura = function(x, y, color, radius, duration) { window.auras.push({ x: x, y: y, color: color, r: radius, life: duration, maxLife: duration }); }
window.spawnLaser = function(x, y, isRight, color, width, duration) { window.lasers.push({ x: x, y: y, isRight: isRight, color: color, width: width, life: duration, maxLife: duration }); }
window.focusCinematic = function(frames) { window.screenFlash = -frames; }
window.applyFilter = function(type, frames) { window.screenFilter = type; window.filterTimer = frames; }

window.triggerTimeStop = function(frames, caster) { 
    window.targetTimeScale = 0.05; setTimeout(() => { window.targetTimeScale = 1.5; setTimeout(() => { window.targetTimeScale = 1.0; }, 300); }, frames * 16);
    window.timeStopCaster = caster; window.applyFilter('invert', frames); window.playSound(100, 'square', 1.0, 1.0, true); window.shakeScreen(30, 20); 
    if (window.shockwaves.length < MAX_SHOCKWAVES) { window.shockwaves.push({x: caster.x, y: caster.y, r: 10, maxR: 1500, color: "#fff", alpha: 1, speed: 40}); } 
}
window.spawnCustomObj = function(x, y, vx, vy, textOrEmoji, color, font, duration, isSpinning = false) { window.customObjs.push({ x: x, y: y, vx: vx, vy: vy, text: textOrEmoji, color: color, font: font, life: duration, maxLife: duration, spin: isSpinning, ang: 0 }); }

window.spawnGlassShatter = function(x, y) {
    window.playSound(600, 'sawtooth', 0.5, 0.8, true); window.shakeScreen(25, 18);
    if (window.particles.length > MAX_PARTICLES) return;
    for(let i=0; i<25; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*18, vy: -Math.random()*18, life: 30, maxLife: 30, color: "rgba(100, 255, 255, 0.9)", size: Math.random()*6+2, isGlass: true }); }
}
window.spawnLensFlare = function(x, y, color, scale) { window.lensFlares.push({x: x, y: y, color: color, scale: scale, life: 30, maxLife: 30}); }
window.spawnMangaSFX = function(x, y, isCrit) {
    let sfxList = ['ゴゴゴ', 'ドドド', 'ドム', 'ズバーン', 'バキッ'];
    let text = sfxList[Math.floor(Math.random() * sfxList.length)];
    let size = isCrit ? (55 + Math.random()*20) : (35 + Math.random()*10);
    window.mangaSfx.push({ x: x + (Math.random()*60-30), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*4, vy: -2 - Math.random()*3, life: 40, maxLife: 40, text: text, size: size, isCrit: isCrit, ang: (Math.random()-0.5)*0.5 });
}
window.triggerDimensionShatter = function() {
    window.dimensionCracks = [];
    let cx = window.canvas ? window.canvas.width/2 : 600; let cy = window.canvas ? window.canvas.height/2 : 300;
    for(let i=0; i<8; i++) {
        let ang = (Math.PI*2/8)*i + (Math.random()-0.5); let len = 600 + Math.random()*300; let points = [{x: cx, y: cy}];
        let dist = 0; let currX = cx; let currY = cy;
        while(dist < len) {
            let step = 40 + Math.random()*60; dist+=step; ang += (Math.random()-0.5)*0.8;
            currX += Math.cos(ang)*step; currY += Math.sin(ang)*step; points.push({x: currX, y: currY});
        }
        window.dimensionCracks.push({points: points, life: 45, maxLife: 45});
    }
}

// ==========================================
// 3. HỆ THỐNG VẾT NỨT MÔI TRƯỜNG CHÂN THỰC
// ==========================================
window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {
    let cracks = []; let numCracks = (type === 'crater') ? 6 + Math.floor(Math.random()*4) : 4 + Math.floor(Math.random()*3); let maxRadius = 0;
    for(let i=0; i<numCracks; i++) {
        let angle;
        if (type === 'crater') { let step = (Math.PI * 0.8) / Math.max(1, numCracks - 1); angle = Math.PI * 0.1 + step * i + (Math.random() - 0.5) * 0.2; }
        else if (type === 'wall_left') angle = -Math.PI/2 + (Math.random() * Math.PI * 0.8) + Math.PI*0.1; else angle = Math.PI/2 + (Math.random() * Math.PI * 0.8) - Math.PI*0.4; 
        let len = (30 + Math.random()*50) * scale; if (len > maxRadius) maxRadius = len;
        let path = [{x: 0, y: 0}]; let segments = 3 + Math.floor(Math.random()*2); let currX = 0, currY = 0; let currAngle = angle;
        for(let s = 1; s <= segments; s++) {
            let segLen = len / segments; currAngle += (Math.random() - 0.5) * 0.8; currX += Math.cos(currAngle) * segLen; currY += Math.sin(currAngle) * segLen; path.push({x: currX, y: currY});
            if (Math.random() < 0.4 && s < segments) { let branchAngle = currAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5); let bLen = segLen * (0.6 + Math.random() * 0.6); cracks.push([{x: currX, y: currY}, {x: currX + Math.cos(branchAngle) * bLen, y: currY + Math.sin(branchAngle) * bLen}]); }
        }
        cracks.push(path);
    }
    if (window.particles.length < MAX_PARTICLES) { for(let d=0; d < 8 * scale; d++) { window.particles.push({ x: x + (Math.random()-0.5)*30, y: y + (Math.random()-0.5)*20, vx: (Math.random()-0.5)*10, vy: -Math.random()*10 - 4, life: 40, maxLife: 40, color: isBurning ? "#e74c3c" : "#57606f", size: Math.random()*4 + 2, isRubble: true }); } }
    window.envDamage.push({ x: x, y: y, type: type, cracks: cracks, scale: scale, radius: maxRadius, isBurning: isBurning, life: 800, maxLife: 800 });
    if (window.envDamage.length > 3) { window.envDamage.shift(); } 
};

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null; let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}

// ==========================================
// 4. HỆ THỐNG VẬT LÝ NHẬN SÁT THƯƠNG
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 14) {
            window.playSound(800, 'sine', 0.5, 1.0, true); 
            window.targetTimeScale = 0.1; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 400);
            window.applyFilter('invert', 8); window.speedLinesAlpha = 1.0; 
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "⚡ EVADED!", color: "#00f3ff", alpha: 1.5, vx: (Math.random()-0.5)*2, vy: -5, font: "italic 900 35px 'Arial Black', Impact", life: 50, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.3 });
            window.spawnParticles(target.x, target.y - 40, "#00f3ff", true);
            if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: target.x, y: target.y - 40, r: 5, maxR: 400, color: "#00f3ff", alpha: 1, speed: 25});
            target.stamina = 100; target.x += target.isFacingRight ? -120 : 120; target.iFrames = 30; return; 
        }
    }

    let finalDmg = amount;

    if (target.state === 'block') { 
        if (target.stamina < 15) {
            target.stamina = 0; target.state = 'stunned'; target.stunTimer = 100; target.hitStun = 100; window.spawnGlassShatter(target.x, target.y - 40);
            window.floatingTexts.push({ x: target.x, y: target.y - 90, text: "💔 CRUSH!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -4, font: "italic 900 45px 'Arial Black', Impact", life: 60, scale: 4.0, targetScale: 1.2, scaleVel: 0, rot: (Math.random()-0.5)*0.4 });
            window.actionCamOffsetX = 0; window.actionCamOffsetY = -30;
            window.targetCamOrbitAngle = attackerDirRight ? 0.6 : -0.6; window.orbitFocusX = target.x; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 800);
            window.targetZoom = 1.5; window.dynamicBlur = 10; window.hitStopFrames = 25; window.impactAberration = 25; window.chromaTimer = 20; window.vhsGlitchTimer = 20; window.spawnForegroundDebris(target.x, target.y, attackerDirRight); 
        } 
        else if (target.attackTimer >= 22) { 
            window.playSound(600, 'triangle', 0.4, 0.9, true); window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
            if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: target.x, y: target.y - 40, r: 5, maxR: 200, color: "#00ffff", alpha: 1, speed: 15});
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PARRY!", color: "#00ffff", alpha: 1.5, vx: 0, vy: -3, font: "italic 900 40px 'Arial Black', Impact", life: 50, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.2 });
            target.stamina = Math.min(100, target.stamina + 30); window.shakeScreen(15, 10); window.hitStopFrames = 15; window.chromaTimer = 10; window.impactAberration = 15;
            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => { if (e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 140) { e.state = 'hurt'; e.hitStun = 50; e.vx = target.isFacingRight ? 12 : -12; window.spawnDust(e.x, e.y); } });
            return;
        } else { target.stamina -= finalDmg * 0.5; finalDmg *= 0.2; }
    }
    
    if (target.shield > 0) { target.shield -= finalDmg; if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; } window.playSound(300, 'sine', 0.2, 0.4, true); window.spawnParticles(target.x, target.y - 40, "#3498db"); }

    if (finalDmg > 0) {
        target.hp -= finalDmg; if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥 -${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        let textVx = (attackerDirRight ? 1 : -1) * (Math.random() * 6 + 3); let textVy = -8 - Math.random() * 6; let initialScale = isCrit ? 5.5 : 2.5; let targetScale = isCrit ? 1.5 : 1.0; 
        window.floatingTexts.push({ x: target.x, y: target.y - 60, text: dmgText, color: color || (isCrit ? "#ff4757" : "#fff"), alpha: 1.5, vx: textVx, vy: textVy, font: isCrit ? "italic 900 40px 'Arial Black', Impact" : "italic 900 30px 'Arial Black', Impact", life: 45, scale: initialScale, targetScale: targetScale, scaleVel: 0, rot: (Math.random()-0.5)*0.5 });
        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);
        
        let sparkCount = isCrit ? 15 : 6; let baseDirX = attackerDirRight ? 1 : -1;
        for(let i=0; i<sparkCount; i++) { let vx = baseDirX * (Math.random() * 20 + 5) + (Math.random()-0.5)*5; let vy = (Math.random()-0.5)*15 - 5; window.impactSparks.push({ x: target.x, y: target.y - 40, vx: vx, vy: vy, life: 25 + Math.random()*15, maxLife: 40, color: color || "#f1c40f", scale: 1.0, zSpeed: Math.random() > 0.5 ? 1.05 : 0.95 }); }

        if (isCrit) {
            window.screenFlash = 0.5; // [VIRAL 36.0] Giảm loá ngay để không che tầm nhìn
            window.impactFrameCount = 2; // Cắt ngắn hiệu ứng âm bản
            window.targetZoom = 1.45; setTimeout(() => { window.targetZoom = 1.1; }, 100); 
            window.impactAberration = 15; window.spawnForegroundDebris(target.x, target.y, attackerDirRight);
            
            window.targetCamOrbitAngle = attackerDirRight ? -0.4 : 0.4; window.orbitFocusX = target.x; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 600);

            window.spawnMangaSFX(target.x, target.y - 60, true); window.spawnInk(target.x, target.y - 40, color || "#ff003c", target.isFacingRight); 
            for(let i=0; i<12; i++) { window.impactSparks.push({ x: target.x, y: target.y - 40, vx: (Math.random()-0.5)*25, vy: (Math.random()-0.5)*25, life: 25 + Math.random()*15, maxLife: 40, color: color || "#f1c40f" }); }
            window.targetTimeScale = 0.15; setTimeout(()=>{ window.targetTimeScale = 1.2; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 200); }, 300);
        } else if (Math.random() > 0.5) { window.spawnMangaSFX(target.x, target.y - 50, false); window.targetZoom = 1.15; setTimeout(() => { window.targetZoom = 1.1; }, 50); window.impactAberration = 4; }

        if (target.superArmor <= 0 && target.state !== 'stunned') { target.state = 'hurt'; target.hitStun = isCrit ? 25 : 12; target.attackTimer = 0; target.comboStep = 0; }
        if (wallBounce) { target.vx = target.isFacingRight ? -6 : 6; } 
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (target.hp <= 0) {
            let isNearWall = (target.x < 80) || (target.x > window.canvas.width - 80);
            if (isNearWall && isCrit && typeof window.triggerStageTransition === 'function') { window.triggerStageTransition(target); } 
            else {
                if (isCrit) {
                    window.screenFlash = 0.6; // [VIRAL 36.0] Giảm loá khi K.O để thấy rõ 360 độ
                    window.invertFrames = 3; 
                    window.speedLinesAlpha = 1.0; window.spawnLensFlare(target.x, target.y - 40, "#ff003c", 5.0);
                    window.floatingTexts.push({ x: target.x, y: target.y - 120, text: "💀 LETHAL FINISH!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -2, font: "italic 900 65px 'Arial Black', Impact", life: 90, scale: 5.0, targetScale: 1.2, scaleVel: 0, rot: (Math.random()-0.5)*0.2 });
                    window.targetZoom = 2.0; window.actionCamOffsetX = (target.isFacingRight ? 120 : -120); window.actionCamOffsetY = -60; window.dynamicBlur = 30; window.cameraTilt = (Math.random() > 0.5 ? 1 : -1) * 0.18; 
                    window.lethalVoid = 80; window.impactAberration = 40; window.spawnForegroundDebris(target.x, target.y, attackerDirRight); window.spawnForegroundDebris(target.x, target.y, attackerDirRight); 
                    window.hitStopFrames = 30; window.shakeScreen(60, 45); window.vhsGlitchTimer = 45; window.triggerDimensionShatter(); 
                    
                    // [VIRAL 36.0] ĐẠO DIỄN QUAY CHẬM 360 ĐỘ SIÊU MƯỢT XUYÊN THẤU
                    window.isSpinningCam = true; 
                    window.orbitFocusX = (target.x + window.p1.x) / 2; // Luôn khóa cứng giữa 2 nhân vật
                    window.targetTimeScale = 0.01; // Siêu chậm Matrix Style
                    setTimeout(()=>{ window.targetTimeScale = 1.0; window.cameraTilt = 0; window.isSpinningCam = false; window.targetCamOrbitAngle = 0; }, 3500); // Tăng thời gian thưởng thức lên 3.5s

                } else { window.hitStopFrames = 15; window.shakeScreen(30, 25); window.targetZoom = 1.5; window.actionCamOffsetY = -40; window.targetTimeScale = 0.2; window.impactAberration = 20; setTimeout(()=>{window.targetTimeScale = 1.0; }, 1000); }
                window.impactFrameTimer = 0; window.chromaTimer = 40; window.playSound(80, 'square', 1.5, 0.8, true); window.koGlitchTimer = 60; target.state = 'ko_falling'; target.koTimer = 100; target.vy = -12; target.onGround = false;
            }
        } else if (isCrit) { window.impactFrameTimer = 3; window.hitStopFrames = 8; window.shakeScreen(15, 12); window.chromaTimer = 15; window.playSound(180, 'square', 0.3, 0.6, true); } 
        else { window.hitStopFrames = 2; window.shakeScreen(5, 4); window.playSound(250, 'sine', 0.15, 0.3, true); }
    }
};

window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) { attacker.state = 'jab'; attacker.attackTimer = 10; return; }

    let MathDist = Math.abs(attacker.x - target.x); let reach = 85 * (attacker.scale || 1); attacker.isFacingRight = target.x > attacker.x;
    let moves_Close = ['hook', 'elbow_strike', 'uppercut', 'knee_strike', 'backfist']; let moves_Mid = ['jab', 'cross', 'low_kick', 'axe_kick', 'palm_strike']; let moves_Far = ['teep_kick', 'high_kick', 'spinning_heel', 'shoulder_bash']; let moves_Finisher = ['dragon_uppercut', 'asura_strike', 'dempsey_roll', 'one_inch_punch'];

    let selectedMove = 'jab'; let isFinisher = false; let isCrit = false;
    let finisherChance = attacker.isRage ? 0.35 : 0.20;

    if (attacker.comboStep >= 3 || Math.random() < finisherChance) { selectedMove = moves_Finisher[Math.floor(Math.random() * moves_Finisher.length)]; isFinisher = true; attacker.comboStep = 0; } 
    else { if (MathDist < 55) { selectedMove = moves_Close[Math.floor(Math.random() * moves_Close.length)]; } else if (MathDist < 90) { selectedMove = moves_Mid[Math.floor(Math.random() * moves_Mid.length)]; } else { selectedMove = moves_Far[Math.floor(Math.random() * moves_Far.length)]; } }

    if (MathDist > reach && !isFinisher) { 
        attacker.vx = (attacker.isFacingRight ? 1 : -1) * attacker.currentSpeed * 3.5; attacker.state = 'dash'; attacker.attackTimer = 12; window.spawnDust(attacker.x, attacker.y); 
        window.speedLinesAlpha = 1.0; window.actionCamOffsetX = attacker.isFacingRight ? 60 : -60; return; 
    }

    attacker.state = selectedMove; attacker.attackTimer = isFinisher ? 30 : 18; attacker.vx = (attacker.isFacingRight ? 1 : -1) * (isFinisher ? 6 : 2.0); 
    let baseDmg = 12 * attacker.currentDmgMod; let finalDmg = baseDmg; let slashAngle = 0; 
    
    if (['uppercut', 'dragon_uppercut', 'high_kick'].includes(selectedMove)) { slashAngle = -Math.PI / 5; window.actionCamOffsetY = 60; } 
    else if (['axe_kick', 'elbow_strike'].includes(selectedMove)) { slashAngle = Math.PI / 5; window.actionCamOffsetY = -30; } 
    else if (['low_kick'].includes(selectedMove)) { slashAngle = Math.PI / 8; } 
    else { slashAngle = (Math.random() - 0.5) * 0.2; }

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5; window.shakeScreen(20, 15); target.vx = (attacker.isFacingRight ? 6 : -6); target.state = 'hurt'; target.hitStun = 50; window.spawnParticles(target.x, target.y - 40, "#ff4757", true); 
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "💥", color: "#ff4757", alpha: 1.5, vx: (Math.random()-0.5)*4, vy: -6, font: "900 65px Arial", life: 50, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.3 });
        window.speedLinesAlpha = 1.0; window.actionCamOffsetX = attacker.isFacingRight ? 100 : -100; 
        window.targetCamOrbitAngle = attacker.isFacingRight ? 0.3 : -0.3; // Quay góc lúc Finisher
    } else {
        if (Math.random() < attacker.critChance) { isCrit = true; finalDmg = baseDmg * attacker.critMult; window.floatingTexts.push({ x: target.x + (Math.random()*40-20), y: target.y - 60, text: "💢", color: "#f1c40f", alpha: 1.5, vx: 0, vy: -4, font: "italic 900 35px 'Arial Black', Impact", life: 30, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); } else { window.playSound(350, 'sine', 0.1, 0.1, false); }
        if ((selectedMove === 'low_kick' || selectedMove === 'teep_kick') && Math.random() < 0.4) { target.stunTimer = 35; target.state = 'stunned'; window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🦵", color: "#e67e22", alpha: 1.5, vx: 0, vy: -3, font: "900 35px Arial", life: 40, scale: 1.8, targetScale: 1.0, scaleVel: 0, rot: 0 }); }
        if ((selectedMove === 'uppercut' || selectedMove === 'elbow_strike') && Math.random() < 0.3) { finalDmg *= 1.5; window.spawnParticles(target.x, target.y - 60, "#c0392b", true); window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🩸", color: "#c0392b", alpha: 1.5, vx: 0, vy: -3, font: "900 35px Arial", life: 40, scale: 1.8, targetScale: 1.0, scaleVel: 0, rot: 0 }); }
        target.vx = (attacker.isFacingRight ? 3 : -3); target.hitStun = 18; target.state = 'hurt';
    }

    if (typeof window.takeDamage === 'function') { window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, false, attacker.isFacingRight); }
    attacker.comboHits = (attacker.comboHits || 0) + 1; attacker.comboDisplayTimer = 90; attacker.comboAlpha = 1; attacker.stamina = Math.min(100, attacker.stamina + (isCrit ? 5.0 : 1.5));
    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, isFinisher ? 2.5 : 1.5, slashAngle);
};

// ==========================================
// 5. CORE UPDATE VẬT LÝ
// ==========================================
window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1 || window.isLoading) return; 

    window.actionCamOffsetX *= 0.85; window.actionCamOffsetY *= 0.85; window.actionCamSkew *= 0.85; window.dynamicBlur *= 0.9;
    if (window.impactAberration > 0) window.impactAberration -= 1.5; if (window.lethalVoid > 0) window.lethalVoid--;
    if (window.invertFrames > 0) window.invertFrames--; if (window.impactFrameCount > 0) window.impactFrameCount--;
    if (window.filterTimer > 0) { window.filterTimer--; if (window.filterTimer <= 0) window.screenFilter = null; }
    if (window.impactFrameTimer > 0) window.impactFrameTimer--; if (window.chromaTimer > 0) window.chromaTimer--;
    if (window.vhsGlitchTimer > 0) window.vhsGlitchTimer--; if (window.speedLinesAlpha > 0) window.speedLinesAlpha -= 0.04;

    window.auras.forEach(a => a.life--); window.auras = window.auras.filter(a => a.life > 0);
    window.lasers.forEach(l => l.life--); window.lasers = window.lasers.filter(l => l.life > 0);
    window.lensFlares.forEach(lf => lf.life--); window.lensFlares = window.lensFlares.filter(lf => lf.life > 0);
    if (window.mangaSfx) { window.mangaSfx.forEach(sfx => { sfx.x += sfx.vx; sfx.y += sfx.vy; sfx.vy += window.GRAVITY * 0.2; sfx.life--; }); window.mangaSfx = window.mangaSfx.filter(sfx => sfx.life > 0); }
    if (window.dimensionCracks) { window.dimensionCracks.forEach(c => c.life--); window.dimensionCracks = window.dimensionCracks.filter(c => c.life > 0); }
    if (window.inkSplatters) { window.inkSplatters.forEach(i => i.life--); window.inkSplatters = window.inkSplatters.filter(i => i.life > 0); }
    if (window.foregroundDebris) { window.foregroundDebris.forEach(d => { d.x += d.vx; d.y += d.vy; d.vy += window.GRAVITY; d.scale *= d.scaleSpeed; d.rot += d.rotSpeed; d.life--; }); window.foregroundDebris = window.foregroundDebris.filter(d => d.life > 0 && d.scale < 10); }

    if (window.p1 && window.p1.hp > 0 && window.p1.hp <= window.p1.maxHp * 0.2 && !window.gameOver) { window.isLowHpPulsing += 0.15; if (Math.sin(window.isLowHpPulsing) > 0.95 && window.matchTimer % 10 === 0) window.playSound(80, 'sine', 0.3, 0.5, false); }
    if (window.gameOver) { window.matchEndTimer = (window.matchEndTimer || 0) + 1; }
    if (window.koGlitchTimer > 0) { window.koGlitchTimer--; if (window.bgmBase) window.bgmBase.volume = 0; if (window.bgmClimax) window.bgmClimax.volume = 0; }
    if (window.uiShakeP1 > 0) { window.uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }

    if (window.introTimer > 0) { window.introTimer -= 2; }

    window.globalWind = Math.sin(Date.now() / 2500) * 1.5;
    if (typeof window.updateStageTransition === 'function') window.updateStageTransition();

    let isTimeStopped = window.timeStopTimer > 0;
    if (isTimeStopped) window.timeStopTimer--;

    if (!window.gameOver && !isTimeStopped) {
        window.matchTimer++; if (window.matchTimer === 1) { window.envHazards = []; window.envDamage = []; }
        let meteorChance = 0.002 + (window.matchTimer / 3600) * 0.01; 
        if (Math.random() < meteorChance && window.projectiles.length < 10) { window.projectiles.push({ x: Math.random() * window.canvas.width, y: -100, vx: (Math.random() - 0.5) * 4, vy: 8 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); }
        if (window.currentWeather === 'rain' && Math.random() < 0.005) { window.envHazards.push({ type: 'lightning', x: Math.random() * window.canvas.width, timer: 45, state: 'warning' }); }
        else if (window.currentWeather === 'ash' && Math.random() < 0.003) { window.envHazards.push({ type: 'lava', x: Math.random() * window.canvas.width, timer: 60 }); }
    }

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; 
    if (window.screenFlash > 0) { window.screenFlash -= 0.1; if (window.screenFlash <= 0.001) window.screenFlash = 0; } else if (window.screenFlash < 0) { window.screenFlash += 1; if (window.screenFlash >= 0) window.screenFlash = 0; }
    if (window.cinematicTimer > 0 && !isSlowMoFrame) { window.cinematicTimer--; if (window.cinematicTimer === 0 && window.cinematicCallback) { try { window.cinematicCallback(); } catch(e) {} window.cinematicCallback = null; } return; }
    if (isSlowMoFrame) return;

    if (!isTimeStopped) {
        for (let i = window.envDamage.length - 1; i >= 0; i--) { let dmg = window.envDamage[i]; if (dmg.life <= 0) { window.envDamage.splice(i, 1); continue; } dmg.life--; if (dmg.isBurning && Math.random() < 0.15 && window.particles.length < MAX_PARTICLES) { window.particles.push({ x: dmg.x + (Math.random()-0.5) * dmg.radius * 0.8, y: window.GROUND_Y, vx: (Math.random()-0.5), vy: -Math.random()*5 - 1, life: 40, maxLife: 40, color: Math.random() > 0.4 ? "#e74c3c" : "#f1c40f", size: Math.random()*4+1 }); } }
    }

    let allFighters = [window.p1].concat(window.enemies);

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
                    allActiveFighters.forEach(fighter => { if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 100 && fighter.y >= window.GROUND_Y - 50) { if(typeof window.takeDamage === 'function') window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false, true); fighter.vx = Math.sign(fighter.x - proj.x) * 12; fighter.state = 'hurt'; fighter.hitStun = 25; } }); window.projectiles.splice(i, 1);
                }
            } else {
                let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y;
                if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); if(typeof window.takeDamage === 'function') window.takeDamage(proj.target, proj.dmg, proj.color || "#e74c3c", false, false, proj.vx > 0); window.shakeScreen(8, 4); window.projectiles.splice(i, 1); }
                else if (proj.x < -100 || proj.x > window.canvas.width + 100 || proj.y < -100 || proj.y > window.canvas.height + 100) { window.projectiles.splice(i, 1); }
            }
        }
        for (let i = window.traps.length - 1; i >= 0; i--) { let t = window.traps[i]; t.life--; if (t.life <= 0) { window.traps.splice(i, 1); continue; } }
        
        for (let i = window.envHazards.length - 1; i >= 0; i--) {
            let haz = window.envHazards[i]; haz.timer--;
            if (haz.type === 'lightning') {
                if (haz.state === 'warning' && haz.timer <= 0) { haz.state = 'striking'; haz.timer = 12; window.playSound(300, 'sawtooth', 0.8, 0.8, true); window.screenFlash = 0.8; window.shakeScreen(20, 15); window.spawnEnvDamage(haz.x, window.GROUND_Y, 'crater', 1.2, false); 
                    allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 70) { if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#00f3ff", true, false, f.x < haz.x); f.state = 'hurt'; f.hitStun = 45; f.vx = (f.x - haz.x > 0 ? 18 : -18); } });
                } else if (haz.state === 'striking' && haz.timer <= 0) { window.envHazards.splice(i, 1); }
            } else if (haz.type === 'lava' && haz.timer <= 0) {
                window.playSound(100, 'square', 0.8, 0.8, true); window.shakeScreen(25, 12); window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                if (window.particles.length < MAX_PARTICLES) { for(let k=0; k<15; k++) window.particles.push({ x: haz.x + (Math.random()-0.5)*40, y: window.GROUND_Y, vx: (Math.random()-0.5)*12, vy: -10 - Math.random()*15, life: 40, maxLife: 40, color: "#e67e22", size: Math.random()*12+5 }); }
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false, f.x < haz.x); f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; } });
                window.envHazards.splice(i, 1);
            }
        }
        
        window.weatherParticles.forEach(w => { 
            let parallaxSpeed = w.speed * (w.size / 3); 
            if (['toxic', 'ash', 'fireflies'].includes(window.currentWeather)) { w.y -= parallaxSpeed * 0.5; w.x += Math.sin(w.y/30)*2 + window.globalWind; if(w.y < -20) { w.y = window.canvas.height + 20; w.x = Math.random() * 1200 - 300; } } 
            else if (window.currentWeather === 'matrix_rain') { w.y += parallaxSpeed * 1.6; if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; w.char = Math.random() > 0.5 ? "1" : "0"; } } 
            else if (window.currentWeather === 'cosmic_dust') { w.y += Math.sin(Date.now()/1000 + w.x)*0.3; w.x += Math.cos(Date.now()/1000 + w.y)*0.3; } 
            else if (window.currentWeather === 'shooting_stars') { w.y += parallaxSpeed * 3; w.x -= parallaxSpeed * 2; if(w.y > window.canvas.height + 20 || w.x < -100) { w.y = -200 - Math.random()*200; w.x = Math.random() * 2000; } } 
            else { w.y += parallaxSpeed; w.x += ((window.currentWeather === 'rain' || window.currentWeather === 'blood_rain') ? -3 : Math.sin(w.y/50)*2) + window.globalWind; if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } }
        });
        
        for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
        for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
        for (let i = window.impactSparks.length - 1; i >= 0; i--) { let isp = window.impactSparks[i]; if (isp.zSpeed) { isp.scale *= isp.zSpeed; } }
        for (let i = window.particles.length - 1; i >= 0; i--) { 
            let pt = window.particles[i]; 
            if (pt.isCoin) { pt.vy += window.GRAVITY * 0.5; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } 
            else if (pt.isRubble) { pt.vy += window.GRAVITY * 0.9; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.4; pt.vx *= 0.6; } } 
            else if (pt.isGlass) { window.ctx.save(); window.ctx.translate(pt.x, pt.y); window.ctx.rotate(pt.life * 0.2); window.ctx.beginPath(); window.ctx.moveTo(0, -pt.size); window.ctx.lineTo(pt.size, pt.size); window.ctx.lineTo(-pt.size, pt.size); window.ctx.fill(); window.ctx.restore(); } 
            else if (pt.isAuraFlame) { pt.vy -= 0.5; pt.vx += (Math.random()-0.5); pt.size *= 0.95; }
            pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); 
        }
        for (let i = window.customObjs.length - 1; i >= 0; i--) { let obj = window.customObjs[i]; obj.x += obj.vx; obj.y += obj.vy; obj.vy += window.GRAVITY * 0.5; if(obj.spin) obj.ang += 0.2; obj.life--; if(obj.life <= 0) window.customObjs.splice(i, 1); }
        if (Math.random() < 0.12 && window.particles.length < MAX_PARTICLES) { window.particles.push({ x: Math.random() * window.canvas.width, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }
    }

    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }

    if (!isTimeStopped) {
        window.enemies.forEach(e => { 
            if (e.hp <= 0 && !e.deathTriggered) {
                e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; window.spawnParticles(e.x, e.y, "#fff", true); window.playSound(100, 'sine', 0.5, 0.5, true); 
                if (window.particles.length < MAX_PARTICLES) { for(let c=0; c<5; c++) window.particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true }); }
                if (window.p1 && window.p1.hp > 0) { let heal = Math.floor(window.p1.maxHp * 0.08); window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1.5, vx: (Math.random()-0.5)*4, vy: -6, font: "italic 900 30px 'Arial Black', Impact", life: 45, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); }
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

        if (f.state === 'idle' && !isTimeStopped) { f.x += Math.sin(Date.now() / 80 + f.x) * (f.isRage ? 1.5 : 0.8); }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) f.state = 'idle'; }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') f.state = 'idle'; }
        if (f.state === 'idle' || f.state === 'walk') f.iFrames = 0;

        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.2); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; 

        if (window.currentWeather === 'snow') f.currentSpeed *= 0.65; 
        else if (window.currentWeather === 'rain') f.currentSpeed *= 1.25; 
        else if (window.currentWeather === 'ash') f.currentDmgMod *= 1.30; 
        else if (window.currentWeather === 'toxic') { f.currentDmgMod *= 0.80; if (window.matchTimer % 90 === 0 && f.hp > 1 && !window.gameOver) { f.hp -= 1; window.particles.push({x: f.x, y: f.y-30, vx:0, vy:-1, life:20, maxLife:20, color:"#2ecc71", size:4}); } }

        if (f.isRage) { 
            f.currentSpeed *= 1.8; f.currentDmgMod *= 1.5; f.aiDelay = 0; 
            if(window.particles.length < MAX_PARTICLES) { let auraColor = f.isPlayer ? "#ff4757" : "#9b59b6"; window.particles.push({ x: f.x + (Math.random() - 0.5) * 50, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 8 - 4, life: 40, maxLife: 40, color: auraColor, size: Math.random() * 8 + 4, isAuraFlame: true }); }
            if (Math.random() < 0.08) { window.shakeScreen(3, 3); if(f.state === 'idle' || f.state === 'walk') { f.dashTimer = 15; f.dashDir = f.isFacingRight ? 1 : -1; f.state = 'dash'; window.spawnDust(f.x, f.y); } }
        }

        if (f.hp > 0 && f.stamina < 100) f.stamina += (f.isRage ? 0.6 : (f.regen * 0.2 || 0.05)); 
        if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false; if (f.isExhausted) f.currentSpeed *= 0.6;

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.life % 15 === 0 && window.particles.length < MAX_PARTICLES) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        let launchedUltimate = false; let targetGroup = f.isPlayer ? window.enemies : [window.p1]; let closestTarget = typeof window.getClosestEnemy === 'function' ? window.getClosestEnemy(f, targetGroup) : null;

        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x; let absDist = Math.abs(distToTarget); let type = (f.classId || "dausi").toLowerCase(); let isCloseEnough = (absDist < 250) || type.includes('satthu') || type.includes('phapsu');
                if (isCloseEnough) {
                    if (window.classStats && window.classStats[type] && typeof window.classStats[type].executeUltimate === 'function') {
                        f.stamina = 0; let baseDmg = 50 * (f.currentDmgMod || 1); if (!f.isPlayer) baseDmg = 35 * (f.currentDmgMod || 1); window.playSound(400, 'sine', 0.5, 0.6); window.shakeScreen(15, 10); window.spawnParticles(f.x, f.y, "#f1c40f", true); window.floatingTexts.push({ x: f.x, y: f.y - 100, text: f.isPlayer ? "🔥 ULTIMATE!" : "⚠️ DANGER!", color: f.isPlayer ? "#ff4757" : "#ff0000", alpha: 1.5, vx: 0, vy: -6, font: "italic 900 45px 'Arial Black', Impact", life: 50, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); f.isFacingRight = distToTarget > 0; window.classStats[type].executeUltimate(f, closestTarget, baseDmg); f.vx = 0; window.speedLinesAlpha = 1.0; 
                        window.targetCamOrbitAngle = f.isFacingRight ? -0.7 : 0.7; 
                    } else if (typeof window.useUltimate === 'function') { window.useUltimate(f, closestTarget); f.vx = 0; window.speedLinesAlpha = 1.0; window.targetCamOrbitAngle = f.isFacingRight ? -0.7 : 0.7; }
                    launchedUltimate = true;
                } else { f.state = 'walk'; f.vx = Math.sign(distToTarget) * f.currentSpeed * 1.5; f.attackTimer = 5; launchedUltimate = true; }
            }
        }

        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (f.isDragon) {
                if (f.hp > 0 && f.hp <= f.maxHp * 0.3 && !f.isEvolved) { f.isEvolved = true; window.slowMoTimer = 60; window.screenFlash = 0; window.shakeScreen(50, 15); window.playSound(50, 'sawtooth', 2.0, 1.0, true); f.color = "#8e44ad"; f.scale *= 1.25; window.floatingTexts.push({ x: f.x, y: f.y - 150, text: "🐉🔥", color: "#8e44ad", alpha: 1.5, vx: 0, vy: -5, font: "italic 900 60px 'Arial Black', Impact", life: 100, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.shockwaves.push({x: f.x, y: window.GROUND_Y, r: 10, maxR: 500, color: "#8e44ad", alpha: 1, speed: 25}); window.targetCamOrbitAngle = 0.5; }
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isEvolved ? 0 : Math.floor(Math.random() * 20) + 20; let randAction = Math.random();
                        if (randAction < 0.45) { f.state = 'breathe_fire'; f.attackTimer = 40; f.vx = 0; window.playSound(250, 'sawtooth', 0.6, 0.3, false); let fireCount = 0; let fireInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(fireInterval); return; } let fireVx = f.isFacingRight ? (f.isEvolved ? 15 : 11) : (f.isEvolved ? -15 : -11); if (f.isEvolved) { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, -3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 0, 15, "#8e44ad", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); } else { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, (Math.random() - 0.5) * 4, 13, "#e74c3c", Math.floor(25 * f.dmgMod), window.p1 ); } fireCount++; if (fireCount >= (f.isEvolved ? 8 : 6)) clearInterval(fireInterval); }, f.isEvolved ? 60 : 85); window.targetCamOrbitAngle = f.isFacingRight ? -0.2 : 0.2; } 
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
                        if (absDist > 110) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.5; if (Math.random() < 0.3) { f.state = 'dash'; f.dashTimer = 8; f.dashDir = Math.sign(dist); window.spawnDust(f.x, f.y); window.targetCamOrbitAngle = f.isFacingRight ? 0.1 : -0.1; } } 
                        else if (randAction < 0.33) { f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 4; window.playSound(380, 'square', 0.25, 0.9, true); if (absDist < 65) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(32 * f.currentDmgMod), "#f1c40f", true, false); window.p1.vx = Math.sign(dist) * 6; window.shakeScreen(15, 12); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: "🗣️", color: "#f1c40f", alpha: 1.5, vx: 0, vy: -5, font: "900 40px Arial", life: 50, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.targetCamOrbitAngle = f.isFacingRight ? 0.3 : -0.3; } } 
                        else if (randAction < 0.66) { f.state = 'high_kick'; f.attackTimer = 28; f.vx = Math.sign(dist) * 5; let kickCount = 0; let kickInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(kickInterval); return; } if (Math.abs(window.p1.x - f.x) < 85) { if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(12 * f.currentDmgMod), "#ecf0f1", false, false); window.p1.vx = Math.sign(dist) * 3; window.shakeScreen(4, 3); } kickCount++; if (kickCount >= 3) clearInterval(kickInterval); }, 70); window.floatingTexts.push({ x: f.x, y: f.y - 100, text: "👟", color: "#f1c40f", alpha: 1.5, vx: 0, vy: -4, font: "900 40px Arial", life: 40, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.targetCamOrbitAngle = f.isFacingRight ? -0.1 : 0.1; } 
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
                        if (absDist > 250 && Math.random() < 0.6) { f.state = 'cast'; f.attackTimer = 25; window.playSound(300, 'sine', 0.3, 0.6); window.spawnSlash(f.x + (f.isFacingRight? 50:-50), f.y - 40, f.isFacingRight, "#fff", true, 2.0, Math.PI/2); window.spawnProjectile(f.x, f.y - 40, f.isFacingRight ? 12 : -12, 0, 15, "#fff", Math.floor(25 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🗡️", color: "#fff", alpha: 1.5, vx: 0, vy: -4, font: "900 40px Arial", life: 40, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.targetCamOrbitAngle = f.isFacingRight ? 0.2 : -0.2; } 
                        else { f.state = 'dash'; f.dashTimer = 15; f.dashDir = Math.sign(dist); f.currentSpeed *= 2.5; f.iFrames = 20; window.playSound(400, 'sawtooth', 0.4, 0.8, true); window.targetCamOrbitAngle = f.isFacingRight ? 0.3 : -0.3; setTimeout(() => { if(window.gameOver || f.hp <= 0 || !window.p1) return; if(Math.abs(window.p1.x - f.x) < 180) { if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(40 * f.dmgMod), "#e74c3c", true, false); window.shakeScreen(20, 15); window.p1.vx = Math.sign(dist) * 6; window.targetCamOrbitAngle = f.isFacingRight ? -0.2 : 0.2; } window.spawnSlash(f.x, window.p1.y - 30, f.isFacingRight, "#e74c3c", true, 3.0, (Math.random()-0.5)); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "⚡", color: "#e74c3c", alpha: 1.5, vx: 0, vy: -5, font: "900 40px Arial", life: 40, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: 0 }); }, 200); }
                    } else if (absDist > 150) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 0.5; }
                }
            }
            else if (f.isNinja) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 15) + 15; let randAction = Math.random();
                        if (randAction < 0.4) { f.state = 'cast'; f.attackTimer = 20; window.playSound(400, 'sine', 0.2, 0.4); window.spawnProjectile(f.x, f.y - 50, f.isFacingRight ? 15 : -15, 0, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); if(Math.random() < 0.5) window.spawnProjectile(f.x, f.y - 60, f.isFacingRight ? 14 : -14, -3, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🥷", color: "#9b59b6", alpha: 1.5, vx: 0, vy: -4, font: "900 40px Arial", life: 30, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.targetCamOrbitAngle = f.isFacingRight ? -0.1 : 0.1; } 
                        else if (randAction < 0.7) { window.spawnParticles(f.x, f.y, "#2c3e50"); f.x = window.p1.x + (window.p1.isFacingRight ? -80 : 80); f.y = window.p1.y; f.isFacingRight = window.p1.x > f.x; window.spawnParticles(f.x, f.y, "#9b59b6"); f.state = 'spinning_backfist'; f.attackTimer = 15; window.playSound(200, 'square', 0.2, 0.6); if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(20 * f.dmgMod), "#9b59b6", false, false); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "💨", color: "#8e44ad", alpha: 1.5, vx: 0, vy: -4, font: "900 40px Arial", life: 30, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 }); window.targetCamOrbitAngle = f.isFacingRight ? 0.2 : -0.2; } 
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
                            if (!usedSkill) { let rand = Math.random(); if (closest.attackTimer > 0 || closest.state === 'dash') { if (rand < 0.4) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; window.spawnDust(f.x, f.y); window.targetCamOrbitAngle = f.isFacingRight ? -0.1 : 0.1; } else { if(typeof window.attack === 'function') window.attack(f, targetList); } } else { if (rand < 0.9) { if (f.comboTimer > 0 && f.comboStep < 14) f.comboStep++; else f.comboStep = 0; f.comboTimer = 50; if(typeof window.attack === 'function') window.attack(f, targetList); } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } } }
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
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.9; if (f.onGround && window.matchTimer % 3 === 0) window.spawnDust(f.x, window.GROUND_Y); } 
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
                        
                        window.shakeScreen(30, 20); window.playSound(500, 'square', 0.2, 0.8, true);
                        window.targetZoom = 1.6; window.screenFlash = 0.5; 
                        let midX = (f1.x + f2.x)/2; let midY = (f1.y + f2.y)/2 - 30;
                        window.spawnParticles(midX, midY, "#ffffff", true);
                        if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: midX, y: midY, r: 10, maxR: 400, color: "#ffffff", alpha: 1, speed: 20});
                        
                        window.floatingTexts.push({ x: midX, y: midY - 60, text: "⚔️ CLASH!", color: "#f1c40f", alpha: 1.5, vx: 0, vy: -5, font: "italic 900 60px 'Arial Black', Impact", life: 50, scale: 3.5, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.2 });
                        
                        window.spawnLensFlare(midX, midY, "#00f3ff", 4.0); window.speedLinesAlpha = 1.0;
                        window.impactAberration = 25; 
                        window.triggerDimensionShatter(); 
                        
                        // [VIRAL 36.0] CHỚP NHANH & DUAL-ORBIT MƯỢT QUANH TÂM CLASH
                        window.invertFrames = 3;
                        window.isSpinningCam = true; 
                        window.orbitFocusX = midX;
                        window.targetTimeScale = 0.05;
                        setTimeout(() => { window.targetTimeScale = 1.0; window.isSpinningCam = false; window.targetCamOrbitAngle = 0; }, 1500);
                    }
                }
                if(f1.clashCooldown > 0) f1.clashCooldown--; if(f2.clashCooldown > 0) f2.clashCooldown--;
            } 
        }
    }

    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { 
        let t = window.floatingTexts[i]; 
        if (t.life !== undefined) { 
            t.vy += window.GRAVITY * 0.6; t.x += t.vx; t.y += t.vy; t.life--; 
            if (t.scale !== undefined && t.targetScale !== undefined) { t.scaleVel = (t.scaleVel || 0) + (t.targetScale - t.scale) * 0.25; t.scaleVel *= 0.75; t.scale += t.scaleVel; }
            if (t.life <= 15) t.alpha -= 0.1; 
        } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } 
        if (t.alpha <= 0) window.floatingTexts.splice(i, 1); 
    }

    // [VIRAL 36.0] 360 DUAL-ORBIT VÀ KHÓA TÂM Y-AXIS (MƯỢT & BÁM CHÂN)
    if (window.isSpinningCam) {
        window.camOrbitAngle += 0.05; // Giảm tốc độ quay để nhìn rõ 3D hơn
    } else {
        window.camOrbitAngle += (window.targetCamOrbitAngle - window.camOrbitAngle) * 0.1; 
    }

    let midPointX = window.canvas.width / 2;
    if (window.p1 && window.enemies.length > 0) {
        let aliveEnemy = window.getClosestEnemy(window.p1, window.enemies) || window.enemies[0];
        midPointX = (window.p1.x + aliveEnemy.x) / 2;
    } else if (window.p1) {
        midPointX = window.p1.x;
    }

    // Khóa tâm X luôn ở giữa trận đấu
    window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.15;

    let closest = window.p1 ? window.getClosestEnemy(window.p1, window.enemies) : null;
    let actionPan = (!window.gameOver && closest && window.slowMoTimer <= 0 && !window.isSpinningCam) ? (window.p1.vx + (closest.vx || 0)) * 6 : 0;
    
    window.targetCamX = (window.canvas.width / 2) - window.orbitFocusX + window.actionCamOffsetX + actionPan;
    // BÙ TRỪ TRỤC Y CHO CHÂN BÁM MẶT ĐẤT
    window.targetCamY = (window.canvas.height / 2) - window.orbitFocusY + window.actionCamOffsetY + 60;

    if (window.gameOver && closest) {
        window.targetZoom = 2.0; 
        // Khi K.O đang quay chậm, đẩy nhẹ góc nhìn lên trên một chút cho điện ảnh
        if(window.isSpinningCam) window.targetCamY += 40; 
    } 
    else if (closest && !window.gameOver && window.slowMoTimer <= 0) {
        let distance = Math.abs(window.p1.x - closest.x); 
        let dynamicZoom = 1.35 - (distance / 800) * 0.4; 
        window.targetZoom = Math.max(0.9, Math.min(1.35, dynamicZoom));
        
        let p1Low = window.p1.hp < window.p1.maxHp * 0.3; let eLow = closest.hp < closest.maxHp * 0.3;
        if (p1Low && eLow) { window.targetTilt = 0.05 * Math.sin(window.matchTimer * 0.06); } 
        else if (p1Low || eLow) { window.targetTilt = 0.025 * Math.sin(window.matchTimer * 0.04); } 
        else { window.targetTilt = 0; }
    } else if (window.slowMoTimer > 0) {
        window.targetTilt = 0.025 * Math.sin(window.slowMoTimer * 0.1);
    }
}

// ==========================================
// 6. HỆ THỐNG VẼ ĐỒ HỌA TRUNG TÂM (DRAW)
// ==========================================
window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    window.camVelocityX = window.targetCamX - window.camX;
    window.cinemaBarsHeight += (window.targetCinemaBars - window.cinemaBarsHeight) * 0.1;

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;
    
    if (window.bassDropFrames > 0) {
        window.ctx.filter = `blur(${window.bassDropFrames * 1.5}px) saturate(${100 + window.bassDropFrames * 30}%) contrast(1.5)`;
    } else {
        window.ctx.filter = 'none';
    }

    let blurStrength = 0.35 + (Math.abs(window.camVelocityX) * 0.01);
    if (blurStrength > 0.9) blurStrength = 0.9;
    window.ctx.fillStyle = `rgba(0, 0, 0, ${blurStrength})`;
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    let impactShift = 0;
    if (window.impactAberration > 0) {
        impactShift = window.impactAberration * (Math.random() > 0.5 ? 1 : -1);
    }

    // [VIRAL 36.0] TOÁN HỌC 3D (GIÚP CHÂN BÁM SÀN VÀ TỰ QUAY MẶT)
    let cosA = Math.cos(window.camOrbitAngle || 0);
    let sinA = Math.sin(window.camOrbitAngle || 0);
    window.orbitFocusX = window.orbitFocusX || window.canvas.width/2;

    let project3D = (obj) => {
        let dx = obj.x - window.orbitFocusX;
        let pX = window.orbitFocusX + dx * cosA;
        let pZ = dx * sinA;
        // Bám đất chuẩn tuyệt đối
        let pY = obj.y - pZ * 0.02; 
        
        let bScale = obj.scale || 1.0;
        let pScale = bScale * (1 + pZ * 0.0035);
        if (pScale < 0.1) pScale = 0.1;
        
        let pFacing = obj.isFacingRight;
        if (typeof obj.isFacingRight !== 'undefined') {
            let normAngle = ((window.camOrbitAngle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2);
            // Flip tự động khi camera quay qua gáy
            if (normAngle > Math.PI / 2 && normAngle < Math.PI * 1.5) { pFacing = !pFacing; }
        }
        return { drawX: pX, drawY: pY, drawZ: pZ, drawScale: pScale, drawFacingRight: pFacing };
    };

    let allFighters = [];
    if (window.p1) allFighters.push(window.p1);
    if (window.enemies) allFighters = allFighters.concat(window.enemies);
    allFighters = allFighters.filter(f => f);

    let sortedFighters = allFighters.map(f => {
        let proj = project3D(f);
        f.drawX = proj.drawX; f.drawY = proj.drawY; f.drawZ = proj.drawZ; f.drawScale = proj.drawScale; f.drawFacingRight = proj.drawFacingRight;
        return f;
    }).sort((a,b) => a.drawZ - b.drawZ);

    if (window.invertFrames > 0) {
        window.ctx.save();
        window.ctx.fillStyle = "#ffffff";
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.globalCompositeOperation = 'difference';
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0 && typeof window.drawStickman === 'function') { 
                window.ctx.save(); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
                let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                else window.drawStickman(window.ctx, clone); 
                window.ctx.restore(); 
            } 
        });
        window.ctx.restore();
        return; 
    }

    if (window.impactFrameCount > 0) {
        window.ctx.save();
        window.ctx.fillStyle = window.impactFrameCount % 2 === 0 ? "#000000" : "#ffffff"; 
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.globalCompositeOperation = window.impactFrameCount % 2 === 0 ? 'screen' : 'multiply';
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0) { 
                window.ctx.save();
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(window.currentZoom, window.currentZoom); window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);
                window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1);
                let sketchColor = window.impactFrameCount % 2 === 0 ? "#ff003c" : "#000000";
                if (typeof window.drawStickman === 'function') {
                    window.ctx.strokeStyle = sketchColor; window.ctx.lineWidth = 15; window.ctx.lineCap = "round"; window.ctx.lineJoin = "round";
                    window.ctx.beginPath(); window.ctx.moveTo(0, 0); window.ctx.lineTo(0, -60); window.ctx.lineTo(-20, -30); window.ctx.moveTo(0, -60); window.ctx.lineTo(20, -30); window.ctx.moveTo(0, 0); window.ctx.lineTo(-20, 40); window.ctx.moveTo(0, 0); window.ctx.lineTo(20, 40); window.ctx.stroke();
                    window.ctx.fillStyle = sketchColor; window.ctx.beginPath(); window.ctx.arc(0, -80, 20, 0, Math.PI*2); window.ctx.fill();
                }
                window.ctx.restore(); 
            } 
        });
        window.ctx.restore();
        return; 
    }
    
    if (window.isLoading) {
        window.ctx.fillStyle = "#050505"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.strokeStyle = "rgba(0, 243, 255, 0.05)"; window.ctx.lineWidth = 1;
        for(let i=0; i<window.canvas.width; i+=40) { window.ctx.beginPath(); window.ctx.moveTo(i, 0); window.ctx.lineTo(i, window.canvas.height); window.ctx.stroke(); }
        let cx = window.canvas.width / 2; let cy = window.canvas.height / 2;
        window.ctx.fillStyle = "#00f3ff"; window.ctx.font = "italic 900 40px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 15; window.ctx.shadowColor = "#00f3ff"; window.ctx.fillText("360 CLARITY ORBIT INITIALIZING...", cx, cy - 50);
        window.ctx.shadowBlur = 0; window.ctx.strokeStyle = "#333"; window.ctx.lineWidth = 4; window.ctx.strokeRect(cx - 250, cy, 500, 24);
        window.ctx.fillStyle = "#ff4757"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#ff4757"; window.ctx.fillRect(cx - 247, cy + 3, (window.loadProgress / 100) * 494, 18); window.ctx.shadowBlur = 0;
        window.ctx.fillStyle = "#fff"; window.ctx.font = "bold 16px monospace"; window.ctx.fillText(`RENDERING PERFECT FRAME... ${Math.floor(window.loadProgress)}%`, cx, cy + 60);
        return; 
    }

    window.ctx.save();
    if (window.screenTearing > 0) {
        let tearY = Math.random() * window.canvas.height; let tearHeight = Math.random() * 150 + 50; let tearShift = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 50 + 20);
        window.ctx.beginPath(); window.ctx.rect(0, tearY, window.canvas.width, tearHeight); window.ctx.clip(); window.ctx.translate(tearShift, 0); window.ctx.filter = `hue-rotate(${Math.random()*360}deg) saturate(300%)`;
    }

    try {
        if (window.vhsGlitchTimer > 0) { let glitchShift = (Math.random() - 0.5) * 30; window.ctx.translate(glitchShift, 0); }
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        
        window.camDriftX = (window.camDriftX || 0) + (Math.random() - 0.5) * 0.5; window.camDriftY = (window.camDriftY || 0) + (Math.random() - 0.5) * 0.5;
        window.camDriftX *= 0.95; window.camDriftY *= 0.95;
        
        let camBreathX = Math.sin(Date.now() / 1300) * 3 + Math.cos(Date.now() / 700) * 2 + window.camDriftX;
        let camBreathY = Math.cos(Date.now() / 1100) * 3 + Math.sin(Date.now() / 900) * 2 + window.camDriftY;
        window.ctx.translate(camBreathX, camBreathY);

        if (typeof impactShift !== 'undefined' && impactShift !== 0) { window.ctx.translate(impactShift, 0); }

        let focusHunt = Math.sin(Date.now() / 200) * 0.005;
        let actualZoom = window.currentZoom + focusHunt;

        let dynamicYaw = Math.max(0.85, 1 - Math.abs(window.camVelocityX) * 0.001);
        let dynamicSkew = -(window.camVelocityX * 0.002) + window.actionCamSkew; 
        
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        
        window.ctx.transform(dynamicYaw, 0, dynamicSkew, 1, 0, 0);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        if (window.filterTimer > 0 && window.screenFilter) {
            if (window.screenFilter === 'invert') { window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = "#fff"; window.ctx.fillRect(-800, -800, 3000, 3000); window.ctx.globalCompositeOperation = 'source-over'; }
            else if (window.screenFilter === 'blood') { window.ctx.globalCompositeOperation = 'multiply'; window.ctx.fillStyle = `rgba(255, 0, 0, ${window.filterTimer/100})`; window.ctx.fillRect(-800, -800, 3000, 3000); window.ctx.globalCompositeOperation = 'source-over'; }
            else if (window.screenFilter === 'dark') { window.ctx.fillStyle = `rgba(0, 0, 0, 0.75)`; window.ctx.fillRect(-800, -800, 3000, 3000); }
        }
        
        if (window.screenFilter === 'grayscale') { window.ctx.filter = 'grayscale(100%) contrast(120%) brightness(60%)'; } 
        else if (!window.bassDropFrames) { window.ctx.filter = `contrast(${window.viralColorGrade.contrast}%) brightness(${window.viralColorGrade.brightness}%) saturate(${window.viralColorGrade.saturation}%) hue-rotate(${window.viralColorGrade.hue}deg)`; }

        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        
        // Trượt Background vô tận 360 độ
        let bgPanOffset = window.camOrbitAngle * 1200;

        let skyGrad = window.ctx.createLinearGradient(0, -400, 0, window.GROUND_Y);
        skyGrad.addColorStop(0, cmap.sky); skyGrad.addColorStop(1, cmap.bg1); 
        window.ctx.fillStyle = skyGrad; 
        window.ctx.save();
        let cxSky = (window.camX + bgPanOffset) * 0.95;
        window.ctx.translate(cxSky, 0); 
        window.ctx.fillRect(-cxSky - 1500, -3000, window.canvas.width + 3000, window.canvas.height + 6000);
        window.ctx.restore();

        window.ctx.save(); window.ctx.globalCompositeOperation = "screen"; let rayShift = Date.now() / 3000;
        let cxRays = (window.camX + bgPanOffset) * 0.85;
        window.ctx.translate(cxRays, 0);
        let startR = Math.floor((-cxRays - 1500) / 250) * 250;
        let endR = -cxRays + window.canvas.width + 1500;
        for(let r = startR; r < endR; r += 250) { 
            let rayAlpha = 0.05 + Math.abs(Math.sin(rayShift + r * 0.01)) * 0.05; 
            window.ctx.fillStyle = `rgba(255, 255, 255, ${rayAlpha})`; 
            window.ctx.beginPath(); 
            window.ctx.moveTo(r + Math.sin(rayShift)*100, -800); 
            window.ctx.lineTo(r + 100 + Math.sin(rayShift)*100, -800); 
            window.ctx.lineTo(r + 400, window.GROUND_Y); 
            window.ctx.lineTo(r + 200, window.GROUND_Y); 
            window.ctx.fill(); 
        }
        window.ctx.restore();

        window.ctx.save(); 
        let cx2 = (window.camX + bgPanOffset) * 0.6;
        window.ctx.translate(cx2, 0); 
        window.ctx.fillStyle = cmap.bg2;
        let t2 = cmap.bg2Type || "mountains";
        if (t2 === "flowing_water" || t2 === "flowing_lava") {
            let isLava = (t2 === "flowing_lava"); let waveSpeed = Date.now() / (isLava ? 600 : 300); let waterBaseY = window.GROUND_Y - 10; 
            let colorBack = isLava ? "rgba(192, 57, 43, 0.9)" : "rgba(22, 160, 133, 0.9)"; let colorMid = isLava ? "rgba(211, 84, 0, 0.8)" : "rgba(41, 128, 185, 0.8)"; let colorFront = isLava ? "rgba(241, 196, 15, 0.7)" : "rgba(52, 152, 219, 0.7)"; 
            const drawWaveLayer = (color, amplitude, frequency, phase, offsetY) => { 
                window.ctx.fillStyle = color; window.ctx.beginPath(); 
                let startX = -cx2 - 1500; let endX = -cx2 + window.canvas.width + 1500; 
                window.ctx.moveTo(startX, window.canvas.height + 400); window.ctx.lineTo(startX, waterBaseY + offsetY); 
                for (let x = startX; x <= endX; x += 40) { let y = waterBaseY + offsetY + Math.sin((x * frequency) + waveSpeed + phase) * amplitude; window.ctx.lineTo(x, y); } 
                window.ctx.lineTo(endX, window.canvas.height + 400); window.ctx.fill(); 
            };
            drawWaveLayer(colorBack, 12, 0.008, 0, -5); drawWaveLayer(colorMid, 8, 0.012, 2, 5); drawWaveLayer(colorFront, 5, 0.018, 4, 15); 
        } else {
            let startI2 = Math.floor((-cx2 - 1500) / 150) * 150;
            let endI2 = -cx2 + window.canvas.width + 1500;
            for(var i = startI2; i < endI2; i += 150) {
                if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+75, window.GROUND_Y-120+Math.sin(i*0.01)*30); window.ctx.lineTo(i+150, window.GROUND_Y); window.ctx.fill(); }
                else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+100, window.GROUND_Y-150); window.ctx.lineTo(i+200, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+40, window.GROUND_Y-50, 120, 5); window.ctx.fillRect(i+60, window.GROUND_Y-80, 80, 5); }
                else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i+75, window.GROUND_Y-15, 100, 10, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.ellipse(i+20, window.GROUND_Y-30, 60, 5, 0, 0, Math.PI*2); window.ctx.fill(); }
                else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y-180+Math.sin(i*0.01)*30, 60, 0, Math.PI*2); window.ctx.arc(i+50, window.GROUND_Y-150+Math.cos(i*0.01)*20, 50, 0, Math.PI*2); window.ctx.fill(); }
                else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i+Math.sin(i*0.01)*50, window.GROUND_Y-250+Math.cos(i*0.01)*100, 3+Math.random()*4, 0, Math.PI*2); window.ctx.fill(); }
            }
        }
        window.ctx.restore();

        window.ctx.save(); 
        let cx1 = (window.camX + bgPanOffset) * 0.2;
        window.ctx.translate(cx1, 0); 
        window.ctx.fillStyle = cmap.bg1;
        let startI1 = Math.floor((-cx1 - 1500) / 120) * 120;
        let endI1 = -cx1 + window.canvas.width + 1500;
        for(var i = startI1; i < endI1; i += 120) {
            let t1 = cmap.bg1Type || "city"; let h = 100 + Math.abs(Math.sin(i*0.01))*80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y-h, 70, h); if(Math.abs(i)%360===0) window.ctx.clearRect(i+10, window.GROUND_Y-h+20, 15, 20); }
            else if (t1 === "trees") { window.ctx.fillRect(i+25, window.GROUND_Y-h, 20, h); window.ctx.beginPath(); window.ctx.arc(i+35, window.GROUND_Y-h, 45, 0, Math.PI*2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i+25, window.GROUND_Y-30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y-20); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+60, window.GROUND_Y-20); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y-10); window.ctx.lineTo(i+30, window.GROUND_Y-h+40); window.ctx.lineTo(i+70, window.GROUND_Y-10); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i+10, window.GROUND_Y-h, 40, h); window.ctx.fillRect(i, window.GROUND_Y-20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y-h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i+30, window.GROUND_Y-60, 30, Math.PI, 0); window.ctx.lineTo(i+60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+25, window.GROUND_Y-100, 10, 30); window.ctx.fillRect(i+15, window.GROUND_Y-90, 30, 5); }
            else if (t1 === "digital") { window.ctx.fillStyle = "rgba(0, 255, 0, 0.15)"; window.ctx.font="bold 20px monospace"; window.ctx.fillText("01", i, window.GROUND_Y-h); }
        }
        window.ctx.restore();

        window.ctx.save(); let fogT = Date.now() / 1500;
        let startFog = Math.floor((-window.camX * 0.2 - 1500) / 250) * 250;
        let endFog = -window.camX * 0.2 + window.canvas.width + 1500;
        for(let i = startFog; i < endFog; i += 250) {
            let fogX = i + Math.cos(fogT + i*0.01)*40; let fogY = window.GROUND_Y - 20 + Math.sin(fogT + i*0.01)*10;
            let fogGrad = window.ctx.createRadialGradient(fogX, fogY, 0, fogX, fogY, 180); fogGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 + Math.sin(fogT+i*0.01)*0.03})`); fogGrad.addColorStop(1, "rgba(255, 255, 255, 0)"); window.ctx.fillStyle = fogGrad; window.ctx.beginPath(); window.ctx.arc(fogX, fogY, 180, 0, Math.PI*2); window.ctx.fill();
        }
        window.ctx.restore();
        
        let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); groundGrad.addColorStop(0, cmap.ground); groundGrad.addColorStop(1, "#000000"); 
        window.ctx.fillStyle = groundGrad; window.ctx.fillRect(-6000, window.GROUND_Y, window.canvas.width + 12000, window.canvas.height - window.GROUND_Y + 1000); 

        // Holo Grid 3D
        window.ctx.save(); window.ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`; window.ctx.lineWidth = 2; window.ctx.beginPath();
        let vanishingPointX = window.canvas.width / 2 + window.camX * 0.3 + Math.sin(window.camOrbitAngle) * 500; 
        let startG = Math.floor((-window.camX * 1.5 - 6000) / 150) * 150;
        let endG = -window.camX * 1.5 + window.canvas.width + 6000;
        for(let i = startG; i <= endG; i += 150) { window.ctx.moveTo(vanishingPointX, window.GROUND_Y); window.ctx.lineTo(i, window.canvas.height + 800); }
        for(let j = 0; j <= 800; j += 40) { let wY = window.GROUND_Y + j*j*0.005; if(wY > window.canvas.height + 300) break; window.ctx.moveTo(-6000, wY); window.ctx.lineTo(window.canvas.width + 6000, wY); }
        window.ctx.stroke(); window.ctx.restore();

        if (window.lethalVoid > 0) {
            window.ctx.save();
            window.ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.95, window.lethalVoid / 20)})`;
            window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000);
            window.ctx.restore();
        }

        // Reflection
        window.ctx.save();
        let reflectionGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.GROUND_Y + 300);
        reflectionGrad.addColorStop(0, "rgba(255, 255, 255, 0.2)"); reflectionGrad.addColorStop(1, "rgba(0, 0, 0, 0.8)"); 
        window.ctx.globalAlpha = 0.35; window.ctx.translate(0, window.GROUND_Y); window.ctx.scale(1, -0.6); 
        let distY = window.shakeTime > 0 ? Math.sin(Date.now() / 50) * 10 : 0; window.ctx.translate(0, -window.GROUND_Y + distY);
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0 && typeof window.drawStickman === 'function') { 
                window.ctx.save(); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
                let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                else window.drawStickman(window.ctx, clone); 
                window.ctx.restore(); 
            } 
        });
        window.ctx.restore();
        window.ctx.save(); window.ctx.fillStyle = reflectionGrad; window.ctx.globalCompositeOperation = "overlay"; window.ctx.fillRect(-6000, window.GROUND_Y, window.canvas.width + 12000, 300); window.ctx.restore();

        if (window.globalIllumination && window.lethalVoid <= 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = window.globalIllumination.mix;
            let cx = window.canvas.width/2 - window.camX; let cy = window.GROUND_Y - 300 - window.camY;
            let dynGlow = window.ctx.createRadialGradient(cx, cy, 0, cx, cy, 2500);
            dynGlow.addColorStop(0, window.globalIllumination.color1); dynGlow.addColorStop(1, window.globalIllumination.color2);
            window.ctx.fillStyle = dynGlow; window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000); window.ctx.restore();
        }

        window.ctx.strokeStyle = cmap.line; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-2000, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 2000, window.GROUND_Y); window.ctx.stroke();
        
        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        sortedFighters.forEach(p => { if (p && p.hp >= 0) { let heightDist = Math.max(0, window.GROUND_Y - p.drawY); let shadowScale = Math.max(0.15, 1 - heightDist / 250) * p.drawScale; window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.drawX, window.GROUND_Y - p.drawZ * 0.15, 35 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2); window.ctx.fill(); } });
        window.ctx.restore();

        if (window.inkSplatters) {
            window.inkSplatters.forEach(ink => {
                let proj = project3D(ink);
                window.ctx.save(); window.ctx.translate(proj.drawX, proj.drawY); window.ctx.rotate(ink.ang); window.ctx.scale(proj.drawScale, proj.drawScale);
                window.ctx.globalAlpha = Math.max(0, ink.life / ink.maxLife); window.ctx.fillStyle = ink.color;
                window.ctx.beginPath(); window.ctx.moveTo(0,0); window.ctx.quadraticCurveTo(60, -25, 200, -10); window.ctx.quadraticCurveTo(90, 25, 0, 0); window.ctx.fill();
                for(let i=0; i<4; i++) { window.ctx.beginPath(); window.ctx.arc(120 + Math.random()*100, (Math.random()-0.5)*70, Math.random()*12, 0, Math.PI*2); window.ctx.fill(); }
                window.ctx.restore();
            });
        }

        window.ctx.filter = 'none';

        if (window.p1) {
            window.ctx.globalCompositeOperation = 'lighter'; 
            sortedFighters.forEach(p => { 
                if (p && p.hp > 0 && p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let pseudoObj = {x: t.x, y: p.y, scale: t.scale, isFacingRight: t.isFacingRight};
                        let proj = project3D(pseudoObj);
                        window.ctx.save(); window.ctx.globalAlpha = t.alpha;
                        let scaleDown = 1 - (t.timer * 0.02); if (scaleDown < 0.1) scaleDown = 0.1;
                        window.ctx.filter = p.isPlayer ? 'sepia(1) hue-rotate(180deg) saturate(300%) contrast(200%)' : 'sepia(1) hue-rotate(300deg) saturate(300%) contrast(200%)';
                        let trailP = Object.assign({}, p, {x: 0, y: 0, state: t.state, isFacingRight: proj.drawFacingRight, color: t.color, alpha: t.alpha, scale: proj.drawScale * scaleDown}); 
                        window.ctx.translate(proj.drawX, proj.drawY); if (!proj.drawFacingRight) window.ctx.scale(-1, 1);
                        if (trailP.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, trailP, true); 
                        else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                        window.ctx.restore();
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = "source-over"; window.ctx.globalAlpha = 1.0; window.ctx.filter = 'none';

            sortedFighters.forEach(p => { 
                window.ctx.save(); window.ctx.globalAlpha = 1.0; window.ctx.filter = 'none';
                if (p.state === 'ko_falling' || p.state === 'dead') { window.ctx.translate(p.drawX, p.drawY); let angle = Math.PI / 2; if (p.state === 'ko_falling') { let progress = (100 - p.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = p.drawFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } else { let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); window.ctx.translate(p.drawX, p.drawY); if(!p.drawFacingRight) window.ctx.scale(-1, 1); if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); }
                window.ctx.restore();
            }); 
        }

        window.ctx.filter = 'none'; window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0;

        window.traps.forEach(t => { let proj = project3D(t); window.ctx.beginPath(); window.ctx.arc(proj.drawX, proj.drawY, t.radius * proj.drawScale, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
        window.projectiles.forEach(proj => { let pr = project3D(proj); window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, proj.radius * pr.drawScale, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.shadowBlur = 15; window.ctx.shadowColor = proj.color; window.ctx.fill(); if(proj.isMeteor) { window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, (proj.radius + 10) * pr.drawScale, 0, Math.PI * 2); window.ctx.fillStyle = "rgba(230, 126, 34, 0.4)"; window.ctx.fill(); } window.ctx.shadowBlur = 0; });
        
        window.auras.forEach(a => { let pr = project3D(a); let prog = a.life / a.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog * 0.8; let aGrad = window.ctx.createRadialGradient(pr.drawX, pr.drawY - 10, 0, pr.drawX, pr.drawY - 10, a.r * pr.drawScale); aGrad.addColorStop(0, a.color); aGrad.addColorStop(1, "rgba(0,0,0,0)"); window.ctx.fillStyle = aGrad; if (a.life % 4 > 1) { window.ctx.beginPath(); window.ctx.ellipse(pr.drawX, window.GROUND_Y - pr.drawZ*0.15, a.r*pr.drawScale, a.r*0.3*pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); } window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; });

        window.lasers.forEach(l => { let pr = project3D(l); let prog = l.life / l.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog; window.ctx.shadowBlur = 20; window.ctx.shadowColor = l.color; window.ctx.fillStyle = l.color; let currentWidth = l.width * (0.8 + Math.random() * 0.4) * pr.drawScale; let startX = pr.drawX; let endX = l.isRight ? window.canvas.width + 500 : -500; window.ctx.fillRect(l.isRight ? startX : endX, pr.drawY - currentWidth/2, Math.abs(endX - startX), currentWidth); window.ctx.fillStyle = "#fff"; window.ctx.fillRect(l.isRight ? startX : endX, pr.drawY - currentWidth/4, Math.abs(endX - startX), currentWidth/2); window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0; window.ctx.globalCompositeOperation = 'source-over'; });

        window.slashes.forEach(s => { let pr = project3D(s); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale * pr.drawScale, s.scale * pr.drawScale); window.ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); window.ctx.lineWidth = 15 * (1 - prog); let grad = window.ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); window.ctx.strokeStyle = grad; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 25; window.ctx.shadowColor = s.color; window.ctx.stroke(); window.ctx.restore(); });
        
        window.particles.forEach(pt => { 
            let pr = project3D(pt);
            window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fillStyle = pt.color; 
            if (pt.isGroundDust) { window.ctx.beginPath(); window.ctx.ellipse(pr.drawX, window.GROUND_Y - pr.drawZ*0.15 - pt.size/2, pt.size * 1.5 * pr.drawScale, pt.size * 0.4 * pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); }
            else if (pt.isRubble) { window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(pt.life * 0.1); window.ctx.fillRect(-pt.size/2*pr.drawScale, -pt.size/2*pr.drawScale, pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.restore(); } 
            else if (pt.isGlass) { window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(pt.life * 0.2); window.ctx.beginPath(); window.ctx.moveTo(0, -pt.size*pr.drawScale); window.ctx.lineTo(pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.lineTo(-pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.fill(); window.ctx.restore(); } 
            else { window.ctx.shadowBlur = 10; window.ctx.shadowColor = pt.color; window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, pt.size*pr.drawScale, 0, Math.PI*2); window.ctx.fill(); window.ctx.shadowBlur = 0; if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } }
        }); window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0;
        
        window.ctx.globalCompositeOperation = 'lighter';
        window.lensFlares.forEach(lf => { let pr = project3D(lf); let lProg = lf.life / lf.maxLife; window.ctx.globalAlpha = Math.pow(lProg, 2); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); let lfGrad = window.ctx.createRadialGradient(0, 0, 0, 0, 0, 300 * lf.scale * pr.drawScale); lfGrad.addColorStop(0, "#fff"); lfGrad.addColorStop(0.1, lf.color); lfGrad.addColorStop(1, "rgba(0,0,0,0)"); window.ctx.fillStyle = lfGrad; window.ctx.fillRect(-400 * lf.scale * pr.drawScale, -4 * lf.scale * pr.drawScale, 800 * lf.scale * pr.drawScale, 8 * lf.scale * pr.drawScale); window.ctx.fillRect(-8 * lf.scale, -100 * lf.scale, 16 * lf.scale, 200 * lf.scale); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 * lf.scale * pr.drawScale, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
        window.ctx.globalAlpha = 1.0;

        window.shockwaves.forEach(sw => { let pr = project3D(sw); window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, sw.r*pr.drawScale, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.shadowBlur = 15; window.ctx.shadowColor = sw.color; window.ctx.stroke(); window.ctx.shadowBlur = 0; });
        
        window.ctx.globalCompositeOperation = 'lighter';
        window.impactSparks.forEach(isp => { 
            let pr = project3D(isp);
            window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.shadowBlur = 15; window.ctx.shadowColor = isp.color; 
            window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2.5 * pr.drawScale; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 3*pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); 
        });
        window.ctx.globalCompositeOperation = "source-over"; window.ctx.shadowBlur = 0;

        if (window.dimensionCracks && window.dimensionCracks.length > 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = "#ffffff";
            window.dimensionCracks.forEach(c => {
                let alpha = c.life / c.maxLife; window.ctx.globalAlpha = alpha; window.ctx.beginPath(); 
                let p0 = project3D(c.points[0]); window.ctx.moveTo(p0.drawX, p0.drawY);
                for(let i=1; i<c.points.length; i++) { let pi = project3D(c.points[i]); window.ctx.lineTo(pi.drawX, pi.drawY); }
                let plast = project3D({x: c.points[c.points.length-1].x + 20, y: c.points[c.points.length-1].y + 20});
                let p0_2 = project3D({x: c.points[0].x + 20, y: c.points[0].y + 20});
                window.ctx.lineTo(plast.drawX, plast.drawY); window.ctx.lineTo(p0_2.drawX, p0_2.drawY); window.ctx.closePath(); window.ctx.fill();
            });
            window.ctx.restore();
        }

        if (window.mangaSfx) {
            window.mangaSfx.forEach(sfx => {
                let pr = project3D(sfx);
                window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(sfx.ang); window.ctx.scale(pr.drawScale, pr.drawScale); let alpha = Math.min(1, sfx.life / 10); window.ctx.globalAlpha = alpha;
                window.ctx.font = `900 italic ${sfx.size}px Impact, Arial Black, sans-serif`; window.ctx.lineWidth = 4; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(sfx.text, 0, 0); window.ctx.fillStyle = sfx.isCrit ? "#ff003c" : "#ffffff"; window.ctx.fillText(sfx.text, 0, 0); window.ctx.restore();
            });
        }

        if (window.foregroundDebris && window.foregroundDebris.length > 0) {
            window.ctx.save(); window.ctx.filter = 'blur(4px)'; 
            window.foregroundDebris.forEach(d => {
                window.ctx.save(); window.ctx.translate(d.x, d.y); window.ctx.rotate(d.rot); window.ctx.scale(d.scale, d.scale); window.ctx.globalAlpha = Math.max(0, d.life / d.maxLife); window.ctx.fillStyle = "#333"; window.ctx.fillRect(-15, -15, 30, 30); window.ctx.restore();
            });
            window.ctx.restore();
        }

        window.ctx.save(); window.ctx.filter = 'blur(15px)'; window.ctx.globalCompositeOperation = 'screen'; let timeB = Date.now() / 1000; window.ctx.fillStyle = window.p1 ? (window.p1.isFacingRight ? 'rgba(255, 50, 50, 0.15)' : 'rgba(50, 150, 255, 0.15)') : 'rgba(255, 255, 255, 0.1)';
        for(let b=0; b<6; b++) { let bx = ((b * 500 + timeB * 400 - window.camX * 2.5) % 3000) - 500; let by = window.canvas.height/2 + Math.sin(b + timeB)*300; window.ctx.beginPath(); window.ctx.arc(bx, by, 80 + b*20, 0, Math.PI*2); window.ctx.fill(); }
        window.ctx.restore();

        window.floatingTexts.forEach(t => { 
            let pr = project3D(t);
            window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (t.rot) window.ctx.rotate(t.rot); let s = t.scale || 1.0; window.ctx.scale(s * pr.drawScale, s * pr.drawScale); window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.lineWidth = 4; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(t.text, 0, 0); window.ctx.shadowBlur = 15; window.ctx.shadowColor = t.color; window.ctx.fillText(t.text, 0, 0); window.ctx.restore();
        }); 

        window.ctx.restore(); // END MAIN TRANSFORM CAMERA 3D

        // [VIRAL 36.0] HIỆU ỨNG VẼ LỚP TRÊN CÙNG (KHÔNG BỊ QUAY)

        // CHỚP MÀN HÌNH NHƯNG ĐƯỢC VẼ SAU CAMERA
        if (window.screenFlash > 0) { 
            window.ctx.globalCompositeOperation = 'screen';
            // Không để chớp sáng che mờ hoàn toàn
            window.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(window.screenFlash, 0.8)})`; 
            window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
            window.ctx.globalCompositeOperation = 'source-over';
        }

        if (window.cinemaBarsHeight > 1) {
            window.ctx.fillStyle = "#000000"; window.ctx.fillRect(0, 0, window.canvas.width, window.cinemaBarsHeight); window.ctx.fillRect(0, window.canvas.height - window.cinemaBarsHeight, window.canvas.width, window.cinemaBarsHeight);
        }

        let renderComboRank = function(fighter, xPos, align) {
            if (fighter && fighter.comboHits >= 2) {
                let alpha = Math.max(0, fighter.comboAlpha || 1); let hits = fighter.comboHits; let rank = "D"; let rankColor = "#bdc3c7"; let rankSize = 40; let rankGlow = 10;
                if (hits >= 4) { rank = "C"; rankColor = "#2ecc71"; rankSize = 45; } if (hits >= 6) { rank = "B"; rankColor = "#3498db"; rankSize = 50; } if (hits >= 8) { rank = "A"; rankColor = "#9b59b6"; rankSize = 55; rankGlow = 15; } if (hits >= 12) { rank = "S"; rankColor = "#f1c40f"; rankSize = 65; rankGlow = 20; } if (hits >= 16) { rank = "SS"; rankColor = "#e67e22"; rankSize = 75; rankGlow = 25; } if (hits >= 20) { rank = "SSS"; rankColor = "#ff003c"; rankSize = 90 + Math.sin(Date.now()/50)*10; rankGlow = 35; }
                window.ctx.globalAlpha = alpha; window.ctx.textAlign = align; let bounceY = Math.sin(Date.now() / 100) * 5; let baseY = 80; 
                window.ctx.shadowBlur = rankGlow; window.ctx.shadowColor = rankColor; window.ctx.fillStyle = rankColor; window.ctx.font = `italic 900 ${rankSize}px 'Arial Black', Impact`; window.ctx.fillText(rank, xPos, baseY + bounceY);
                window.ctx.font = "italic 900 20px Arial"; window.ctx.fillStyle = "#fff"; window.ctx.shadowBlur = 5; window.ctx.shadowColor = "#000"; window.ctx.fillText(`🔥 ${hits} HITS`, xPos, baseY + rankSize * 0.5 + 15 + bounceY); window.ctx.shadowBlur = 0;
            }
        };

        renderComboRank(window.p1, 40, "left"); let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; }); renderComboRank(maxEnemyCombo, window.canvas.width - 40, "right");

        if (window.gameOver && window.endIconType) {
            window.ctx.save(); let popScale = Math.min(1, (window.matchEndTimer - 90) / 25); if(popScale < 0) popScale = 0; let easeScale = Math.sin(popScale * Math.PI / 2); window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(easeScale * 1.2, easeScale * 1.2); window.ctx.font = "140px Arial"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; if (window.endIconType === 'win') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🏆", 0, 0); } else if (window.endIconType === 'lose') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#ff4757"; window.ctx.fillText("💀", 0, 0); } window.ctx.restore(); 
        }

        if (window.cinematicTimer > 0 && window.cinematicCaster) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let stripY = window.canvas.height / 2 - 50; window.ctx.fillStyle = window.cinematicCaster.color; window.ctx.fillRect(0, stripY, window.canvas.width, 100); let progress = (50 - window.cinematicTimer) / 50; let slideX = -200 + (progress * 800); window.ctx.fillStyle = "#fff"; window.ctx.font = "italic 900 60px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#fff"; window.ctx.fillText("⚡", slideX, stripY + 70); window.ctx.shadowBlur = 0; let avaX = window.canvas.width - slideX; let casterClone = Object.assign({}, window.cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); if(casterClone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, casterClone); else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, casterClone);
        }
        
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.save(); window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.introTimer > 60) {
                let progress = Math.min(1, (160 - window.introTimer) / 40); let cx = window.canvas.width / 2; let cy = window.canvas.height / 2; let p1Name = (window.p1.className || "PLAYER 1").toUpperCase(); let repEnemy = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; let p2Name = repEnemy ? (repEnemy.className || "ENEMY").toUpperCase() : "ENEMY";
                window.ctx.fillStyle = "#001b36"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.beginPath(); window.ctx.moveTo(cx + 150, 0); window.ctx.lineTo(window.canvas.width, 0); window.ctx.lineTo(window.canvas.width, window.canvas.height); window.ctx.lineTo(cx - 150, window.canvas.height); window.ctx.fillStyle = "#2b000b"; window.ctx.fill();
                window.ctx.lineWidth = 2; window.ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"; for(let i = -200; i < window.canvas.width + 200; i += 40) { window.ctx.beginPath(); window.ctx.moveTo(i, 0); window.ctx.lineTo(i - 200, window.canvas.height); window.ctx.stroke(); }
                window.ctx.beginPath(); window.ctx.moveTo(cx + 150, 0); window.ctx.lineTo(cx - 150, window.canvas.height); window.ctx.lineWidth = 8; window.ctx.strokeStyle = "#f1c40f"; window.ctx.stroke();
                let easeOut = 1 - Math.pow(1 - progress, 4); let textX1 = -300 + (cx - 100 - (-300)) * easeOut; let textX2 = window.canvas.width + 300 - ((window.canvas.width + 300) - (cx + 100)) * easeOut;
                window.ctx.font = "900 50px Arial"; window.ctx.textAlign = "right"; window.ctx.textBaseline = "middle"; window.ctx.fillStyle = "#00f3ff"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#00f3ff"; window.ctx.fillText(p1Name, textX1, cy - 80); window.ctx.textAlign = "left"; window.ctx.fillStyle = "#ff003c"; window.ctx.shadowColor = "#ff003c"; window.ctx.fillText(p2Name, textX2, cy - 80); window.ctx.shadowBlur = 0;
                let targetX1 = 200; let targetX2 = window.canvas.width - 200; let slideX1 = -100 + (targetX1 - (-100)) * easeOut; let slideX2 = window.canvas.width + 100 - (window.canvas.width + 100 - targetX2) * easeOut; let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y + 50, state: window.p1.introState || 'idle', isFacingRight: true, scale: (window.p1.scale || 1) * 1.5}); if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                if (repEnemy) { let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y + 50, state: repEnemy.isDragon ? 'idle' : (repEnemy.introState || 'idle'), isFacingRight: false, scale: (repEnemy.scale || 1) * 1.5}); if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, repEnemy); else if (repEnemy.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p2Clone); else if (repEnemy.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p2Clone); else if (repEnemy.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p2Clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); }
                if (window.introTimer <= 140) { let vsProgress = Math.min(1, (140 - window.introTimer) / 10); let vsScale = Math.max(1, 5 - vsProgress * 4); window.ctx.save(); window.ctx.translate(cx, cy + 50); window.ctx.scale(vsScale, vsScale); window.ctx.font = "italic 900 90px Arial"; window.ctx.textAlign = "center"; window.ctx.fillStyle = "#fff"; window.ctx.shadowColor = "#f1c40f"; window.ctx.shadowBlur = 25; window.ctx.fillText("VS", 0, 0); window.ctx.restore(); }
            } else { 
                let fadeAlpha = window.introTimer / 60; window.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let scale = 1 + ((60 - window.introTimer) / 60) * 0.4; window.ctx.save(); window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(scale, scale); window.ctx.font = "italic 900 110px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 5; window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#ff4757"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.strokeText("🥊 FIGHT! 🥊", 0, 0); window.ctx.fillText("🥊 FIGHT! 🥊", 0, 0); window.ctx.restore(); 
            }
            window.ctx.restore();
        }

        if (window.noiseCanvas) {
            window.ctx.save(); window.ctx.setTransform(1,0,0,1,0,0); window.ctx.globalCompositeOperation = 'overlay'; window.ctx.globalAlpha = 0.6; 
            let offsetX = (Math.random() * 100) % window.noiseCanvas.width; let offsetY = (Math.random() * 100) % window.noiseCanvas.height;
            let ptrn = window.ctx.createPattern(window.noiseCanvas, 'repeat'); window.ctx.fillStyle = ptrn; window.ctx.translate(-offsetX, -offsetY); window.ctx.fillRect(0, 0, window.canvas.width + 100, window.canvas.height + 100); window.ctx.restore();
        }

    } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}

// ==========================================
// 7. TIME-ENGINE VÀ PHYSICS LOOP CHUẨN XÁC
// ==========================================
window.lastFrameTime = 0; 
window.physicsAccumulator = 0;
window.PHYSICS_STEP = 1000 / 60; 

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    
    if (!timestamp) timestamp = performance.now(); 
    if (!window.lastFrameTime) window.lastFrameTime = timestamp;
    let deltaTime = timestamp - window.lastFrameTime; 
    window.lastFrameTime = timestamp; 
    
    if (deltaTime > 250) deltaTime = 250; 
    
    if (window.hitStopFrames > 0) {
        window.hitStopFrames--;
        let lerpFactor = 1 - Math.pow(1 - 0.12, deltaTime / 16.666);
        if(lerpFactor > 1) lerpFactor = 1; else if(lerpFactor < 0) lerpFactor = 0;
        window.camX += (window.targetCamX - window.camX) * lerpFactor; 
        window.camY += (window.targetCamY - window.camY) * lerpFactor; 
        window.cameraTilt += (window.targetTilt - window.cameraTilt) * lerpFactor;
        
        // [VIRAL 36.0] Xoay mượt khi đóng băng - Tạo hiệu ứng trượt 360 cực chất
        if (window.isSpinningCam) { window.camOrbitAngle += 0.05 * (deltaTime / 16.666); } 
        else { window.camOrbitAngle += (window.targetCamOrbitAngle - window.camOrbitAngle) * 0.1 * (deltaTime / 16.666); }

        try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
        return; 
    }

    window.timeScale += (window.targetTimeScale - window.timeScale) * 0.15;
    let scaledDelta = deltaTime * window.timeScale;

    window.physicsAccumulator += scaledDelta;

    while (window.physicsAccumulator >= window.PHYSICS_STEP) {
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        window.physicsAccumulator -= window.PHYSICS_STEP;
    }

    let dZoom = window.targetZoom - window.currentZoom;
    window.cameraZoomVel += dZoom * 0.18;
    window.cameraZoomVel *= 0.72; 
    window.currentZoom += window.cameraZoomVel;

    let lerpFactor = 1 - Math.pow(1 - 0.12, deltaTime / 16.666);
    if(lerpFactor > 1) lerpFactor = 1; else if(lerpFactor < 0) lerpFactor = 0;
    
    window.camX += (window.targetCamX - window.camX) * lerpFactor; 
    window.camY += (window.targetCamY - window.camY) * lerpFactor; 
    window.cameraTilt += (window.targetTilt - window.cameraTilt) * lerpFactor;

    if (window.isSpinningCam) { window.camOrbitAngle += 0.05 * (deltaTime / 16.666); } 
    else { window.camOrbitAngle += (window.targetCamOrbitAngle - window.camOrbitAngle) * 0.1 * (deltaTime / 16.666); }

    try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
}

if (typeof window !== 'undefined') {
    setTimeout(() => { if(typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100);
}
