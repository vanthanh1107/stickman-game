// ==========================================
// ENGINE_CORE.JS - BIẾN TOÀN CỤC, LOGIC, COMBAT & UPDATE
// [BẢN CẬP NHẬT CLEAN & PROFESSIONAL - XÓA BÓNG ĐEN VÀ CHỚP LÓA]
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; window.lensFlares = [];

window.lightningArcs = []; window.energyPillars = []; window.blackHoles = [];
window.bokehs = []; window.spaceRipples = [];

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

const MAX_PARTICLES = 300; const MAX_SHOCKWAVES = 15;

// ==========================================
// 1. HỆ THỐNG ÂM THANH & COLOR GRADING
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    
    window.thumbnailConfig = {
        hue: Math.floor(Math.random() * 360),
        title: ["EPIC BRAWL", "WTF MOMENT?!", "OH MY GAWD", "STICKMAN VIBES", "LEGENDARY", "MEME FIGHT", "9999 IQ PLAY", "BRUH..."][Math.floor(Math.random() * 8)],
        emoji: ["🤡", "💀", "😎", "🌭", "🔥", "👽", "🗿", "🥵"][Math.floor(Math.random() * 8)],
        rayCount: 12 + Math.floor(Math.random() * 8) * 2
    };

    window.viralHueShift = Math.floor(Math.random() * 360);
    window.viralShakeMult = 0.9 + Math.random() * 0.4;
    window.viralColorGrade = { 
        contrast: 110 + Math.random() * 15, 
        brightness: 90 + Math.random() * 5, 
        saturation: 100 + Math.random() * 20, 
        hue: Math.floor((Math.random() - 0.5) * 20) 
    };

    const lightingThemes = [
        { mix: 'overlay', color1: 'rgba(255, 120, 30, 0.15)', color2: 'rgba(10, 0, 20, 0.4)' },
        { mix: 'hard-light', color1: 'rgba(0, 180, 255, 0.1)', color2: 'rgba(0, 5, 30, 0.5)' },
        { mix: 'color-burn', color1: 'rgba(255, 30, 30, 0.1)', color2: 'rgba(0, 0, 0, 0.4)' }
    ];
    window.globalIllumination = lightingThemes[Math.floor(Math.random() * lightingThemes.length)];

    window.noiseCanvas = document.createElement('canvas'); window.noiseCanvas.width = 300; window.noiseCanvas.height = 300;
    let nCtx = window.noiseCanvas.getContext('2d'); let imgData = nCtx.createImageData(300, 300);
    for (let i = 0; i < imgData.data.length; i += 4) { let val = Math.random() * 255; imgData.data[i] = val; imgData.data[i+1] = val; imgData.data[i+2] = val; imgData.data[i+3] = Math.random() * 20; }
    nCtx.putImageData(imgData, 0, 0);

    if (!window.audioCtx) { try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} }
    let loadInterval = setInterval(() => {
        window.loadProgress += Math.random() * 5 + 2; 
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
// 2. HỆ THỐNG SPAWN VFX VẬT LÝ & EPIC SKILLS
// ==========================================
window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude * (window.viralShakeMult || 1); }

window.spawnEnergyPillar = function(x, y, color, radius, life) { window.energyPillars.push({x: x, y: y, color: color, r: radius, life: life, maxLife: life, scaleY: 0}); window.shakeScreen(life, 5); }
window.spawnLightning = function(x, y, color, length, branches) { let pts = [{x: x, y: y}]; let currX = x, currY = y; for(let i=0; i<branches; i++) { currX += (Math.random() - 0.5) * length; currY -= Math.random() * length; pts.push({x: currX, y: currY}); } window.lightningArcs.push({pts: pts, color: color, life: 10, maxLife: 10}); }
window.spawnBlackHole = function(x, y, radius, life) { window.blackHoles.push({x: x, y: y - 50, r: radius, life: life, maxLife: life}); }
window.spawnSpaceRipple = function(x, y, color) { window.spaceRipples.push({x: x, y: y, r: 10, maxR: 400, color: color, life: 35, maxLife: 35}); }

window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit) { window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 2.8 : 1.8) * scale, rotation: rotation }); 
    let sparkCount = isCrit ? 6 : 3;
    for(let i=0; i<sparkCount; i++) { window.impactSparks.push({ x: x, y: y, vx: (isRight ? 1 : -1)*(Math.random()*15+5), vy: (Math.random()-0.5)*15, life: 20 + Math.random()*15, maxLife: 35, color: color, scale: Math.random() * 1.5 }); }
}

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    let count = isCrit ? 15 : 6; 
    for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?20:10) + 2; window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 35, maxLife: 35, color: color, size: Math.random() * 5 + 2 }); } 
}
window.spawnDust = function(x, y) { if (window.particles.length > MAX_PARTICLES) return; for(let i=0; i<6; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y, vx: (Math.random()-0.5)*8, vy: -Math.random()*2 - 0.2, life: 30, maxLife: 30, color: "rgba(189, 195, 199, 0.4)", size: Math.random() * 10 + 6, isGroundDust: true }); } }
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
    window.playSound(600, 'sawtooth', 0.5, 0.8, true); window.shakeScreen(20, 15);
    if (window.particles.length > MAX_PARTICLES) return;
    for(let i=0; i<15; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*18, vy: -Math.random()*18, life: 30, maxLife: 30, color: "rgba(100, 255, 255, 0.9)", size: Math.random()*6+2, isGlass: true }); }
}
window.spawnLensFlare = function(x, y, color, scale) { window.lensFlares.push({x: x, y: y, color: color, scale: scale, life: 30, maxLife: 30}); }
window.spawnMangaSFX = function(x, y, isCrit) {
    let sfxList = ['ゴゴゴ', 'ドドド', 'ドム', 'ズバーン', 'バキッ']; let text = sfxList[Math.floor(Math.random() * sfxList.length)]; let size = isCrit ? (65 + Math.random()*20) : (40 + Math.random()*10);
    window.mangaSfx.push({ x: x + (Math.random()*60-30), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*4, vy: -2 - Math.random()*3, life: 40, maxLife: 40, text: text, size: size, isCrit: isCrit, ang: (Math.random()-0.5)*0.5 });
}

window.triggerDimensionShatter = function(x, y) {
    window.dimensionCracks = []; // Đã vô hiệu hóa vỡ kính không gian để bớt rườm rà
}

// ==========================================
// 3. HỆ THỐNG VẾT NỨT MÔI TRƯỜNG CHÂN THỰC (GIẢM SỐ LƯỢNG)
// ==========================================
window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {
    let cracks = []; 
    // CẬP NHẬT: GIẢM SỐ LƯỢNG VẾT NỨT XUỐNG CÒN 1 ĐẾN 2 VẾT CHO CHUYÊN NGHIỆP
    let numCracks = (type === 'crater') ? 1 + Math.floor(Math.random() * 2) : 1; 
    let maxRadius = 0;
    
    for(let i=0; i<numCracks; i++) {
        let angle;
        if (type === 'crater') { 
            let step = (Math.PI * 0.8) / Math.max(1, numCracks - 1); 
            angle = Math.PI * 0.1 + step * i + (Math.random() - 0.5) * 0.2; 
        }
        else if (type === 'wall_left') angle = -Math.PI/2 + (Math.random() * Math.PI * 0.8) + Math.PI*0.1; 
        else angle = Math.PI/2 + (Math.random() * Math.PI * 0.8) - Math.PI*0.4; 
        
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
// 4. HỆ THỐNG VẬT LÝ NHẬN SÁT THƯƠNG & ATTACK 
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 14) {
            window.playSound(800, 'sine', 0.5, 1.0, true); 
            window.targetTimeScale = 0.2; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 350);
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
            target.stamina = 0; target.state = 'stunned'; target.stunTimer = 100; target.hitStun = 100; 
            window.spawnParticles(target.x, target.y - 40, "#ff003c", true); // Tắt vỡ kính khi gãy thủ
            window.floatingTexts.push({ x: target.x, y: target.y - 90, text: "💔 CRUSH!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -4, font: "italic 900 45px 'Arial Black', Impact", life: 60, scale: 4.0, targetScale: 1.2, scaleVel: 0, rot: (Math.random()-0.5)*0.4 });
            window.actionCamOffsetX = 0; window.actionCamOffsetY = -30;
            window.targetCamOrbitAngle = attackerDirRight ? 0.6 : -0.6; window.orbitFocusX = target.x; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 800);
            window.targetZoom = 1.5; window.dynamicBlur = 10; window.hitStopFrames = 20; window.impactAberration = 15; window.chromaTimer = 20; window.vhsGlitchTimer = 20; window.spawnForegroundDebris(target.x, target.y, attackerDirRight); 
        } 
        else if (target.attackTimer >= 22) { 
            window.playSound(600, 'triangle', 0.4, 0.9, true); window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
            if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: target.x, y: target.y - 40, r: 5, maxR: 200, color: "#00ffff", alpha: 1, speed: 15});
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PARRY!", color: "#00ffff", alpha: 1.5, vx: 0, vy: -3, font: "italic 900 40px 'Arial Black', Impact", life: 50, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.2 });
            target.stamina = Math.min(100, target.stamina + 30); window.shakeScreen(12, 8); window.hitStopFrames = 12; window.chromaTimer = 10; window.impactAberration = 10;
            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => { if (e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 140) { e.state = 'hurt'; e.hitStun = 50; e.vx = target.isFacingRight ? 12 : -12; window.spawnDust(e.x, e.y); } });
            return;
        } else { target.stamina -= finalDmg * 0.5; finalDmg *= 0.2; }
    }
    
    if (target.shield > 0) { target.shield -= finalDmg; if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; } window.playSound(300, 'sine', 0.2, 0.4, true); window.spawnParticles(target.x, target.y - 40, "#3498db"); }

    if (finalDmg > 0) {
        target.hp -= finalDmg; if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥 -${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        let textVx = (attackerDirRight ? 1 : -1) * (Math.random() * 6 + 3); let textVy = -8 - Math.random() * 6; let initialScale = isCrit ? 4.0 : 2.0; let targetScale = isCrit ? 1.2 : 1.0; 
        window.floatingTexts.push({ x: target.x, y: target.y - 60, text: dmgText, color: color || (isCrit ? "#ff4757" : "#fff"), alpha: 1.5, vx: textVx, vy: textVy, font: isCrit ? "italic 900 40px 'Arial Black', Impact" : "italic 900 30px 'Arial Black', Impact", life: 45, scale: initialScale, targetScale: targetScale, scaleVel: 0, rot: (Math.random()-0.5)*0.3 });
        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);
        
        let sparkCount = isCrit ? 8 : 3; let baseDirX = attackerDirRight ? 1 : -1;
        for(let i=0; i<sparkCount; i++) { let vx = baseDirX * (Math.random() * 20 + 5) + (Math.random()-0.5)*5; let vy = (Math.random()-0.5)*15 - 5; window.impactSparks.push({ x: target.x, y: target.y - 40, vx: vx, vy: vy, life: 20 + Math.random()*15, maxLife: 35, color: color || "#f1c40f", scale: 0.9, zSpeed: Math.random() > 0.5 ? 1.05 : 0.95 }); }

        if (isCrit) {
            window.screenFlash = 0; // Đã bỏ nháy trắng lóa mắt
            // ĐÃ BỎ IMPACT FRAME (BÓNG ĐEN) XUẤT HIỆN KHI CRIT
            window.targetZoom = 1.25; setTimeout(() => { window.targetZoom = 1.1; }, 100); 
            window.impactAberration = 8; 
            window.spawnForegroundDebris(target.x, target.y, attackerDirRight);
            
            window.targetCamOrbitAngle = attackerDirRight ? -0.3 : 0.3; window.orbitFocusX = target.x; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 500);

            window.spawnMangaSFX(target.x, target.y - 60, true); window.spawnInk(target.x, target.y - 40, color || "#ff003c", target.isFacingRight); 
            for(let i=0; i<6; i++) { window.impactSparks.push({ x: target.x, y: target.y - 40, vx: (Math.random()-0.5)*20, vy: (Math.random()-0.5)*20, life: 20 + Math.random()*10, maxLife: 30, color: color || "#f1c40f" }); }
            window.targetTimeScale = 0.25; setTimeout(()=>{ window.targetTimeScale = 1.1; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 150); }, 200);
            
            window.spawnLightning(target.x, target.y-40, color || "#f1c40f", 30, 3);
            window.spawnSpaceRipple(target.x, target.y - 40, color || "#f1c40f");

        } else if (Math.random() > 0.5) { window.spawnMangaSFX(target.x, target.y - 50, false); window.targetZoom = 1.15; setTimeout(() => { window.targetZoom = 1.1; }, 50); window.impactAberration = 4; }

        if (target.superArmor <= 0 && target.state !== 'stunned') { target.state = 'hurt'; target.hitStun = isCrit ? 22 : 12; target.attackTimer = 0; target.comboStep = 0; }
        if (wallBounce) { target.vx = target.isFacingRight ? -6 : 6; } 
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (target.hp <= 0) {
            let isNearWall = (target.x < 80) || (target.x > window.canvas.width - 80);
            if (isNearWall && isCrit && typeof window.triggerStageTransition === 'function') { window.triggerStageTransition(target); } 
            else {
                if (isCrit) {
                    window.screenFlash = 0; // Tắt chớp trắng lóa mắt
                    window.invertFrames = 0; // Tắt đảo ngược màu màn hình
                    window.speedLinesAlpha = 0.5; 
                    window.spawnLensFlare(target.x, target.y - 40, "#ff003c", 3.0);
                    
                    window.floatingTexts.push({ x: target.x, y: target.y - 120, text: "💀 K.O!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -2, font: "italic 900 65px 'Arial Black', Impact", life: 100, scale: 4.0, targetScale: 1.2, scaleVel: 0, rot: (Math.random()-0.5)*0.2 });
                    
                    window.targetZoom = 1.6; 
                    window.actionCamOffsetX = 0; window.actionCamOffsetY = -20; 
                    window.dynamicBlur = 10; // Giảm mờ nhòe camera
                    
                    window.lethalVoid = 60; // Nền tối lại để nổi bật nhân vật
                    window.impactAberration = 10; 
                    window.spawnForegroundDebris(target.x, target.y, attackerDirRight); 
                    
                    window.hitStopFrames = 20; 
                    window.shakeScreen(30, 20); 
                    
                    window.spawnEnergyPillar(target.x, window.GROUND_Y, "#ff003c", 80, 60);
                    window.spawnSpaceRipple(target.x, target.y - 40, "#ff003c");

                    window.isSpinningCam = true; 
                    window.orbitFocusX = target.x; 
                    window.targetTimeScale = 0.1; 
                    setTimeout(()=>{ window.targetTimeScale = 1.0; window.cameraTilt = 0; window.isSpinningCam = false; window.targetCamOrbitAngle = 0; }, 2500); 

                } else { window.hitStopFrames = 15; window.shakeScreen(20, 15); window.targetZoom = 1.4; window.actionCamOffsetY = -30; window.targetTimeScale = 0.25; window.impactAberration = 15; setTimeout(()=>{window.targetTimeScale = 1.0; }, 900); }
                window.chromaTimer = 40; window.playSound(80, 'square', 1.5, 0.8, true); window.koGlitchTimer = 60; target.state = 'ko_falling'; target.koTimer = 100; target.vy = -12; target.onGround = false;
            }
        } else if (isCrit) { window.hitStopFrames = 6; window.shakeScreen(12, 10); window.chromaTimer = 12; window.playSound(180, 'square', 0.3, 0.6, true); } 
        else { window.hitStopFrames = 1; window.shakeScreen(4, 3); window.playSound(250, 'sine', 0.15, 0.3, true); }
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
        window.speedLinesAlpha = 0.8; window.actionCamOffsetX = attacker.isFacingRight ? 50 : -50; return; 
    }

    attacker.state = selectedMove; attacker.attackTimer = isFinisher ? 30 : 18; attacker.vx = (attacker.isFacingRight ? 1 : -1) * (isFinisher ? 6 : 2.0); 
    let baseDmg = 12 * attacker.currentDmgMod; let finalDmg = baseDmg; let slashAngle = 0; 
    
    if (['uppercut', 'dragon_uppercut', 'high_kick'].includes(selectedMove)) { slashAngle = -Math.PI / 5; window.actionCamOffsetY = 50; } 
    else if (['axe_kick', 'elbow_strike'].includes(selectedMove)) { slashAngle = Math.PI / 5; window.actionCamOffsetY = -25; } 
    else if (['low_kick'].includes(selectedMove)) { slashAngle = Math.PI / 8; } 
    else { slashAngle = (Math.random() - 0.5) * 0.2; }

    if (isFinisher) {
        isCrit = true; finalDmg = baseDmg * 3.5; window.shakeScreen(15, 12); target.vx = (attacker.isFacingRight ? 6 : -6); target.state = 'hurt'; target.hitStun = 50; window.spawnParticles(target.x, target.y - 40, "#ff4757", true); 
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "💥", color: "#ff4757", alpha: 1.5, vx: (Math.random()-0.5)*4, vy: -6, font: "900 65px Arial", life: 50, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.3 });
        window.speedLinesAlpha = 1.0; window.actionCamOffsetX = attacker.isFacingRight ? 80 : -80; 
        window.targetCamOrbitAngle = attacker.isFacingRight ? 0.3 : -0.3;
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

    window.lightningArcs.forEach(l => l.life--); window.lightningArcs = window.lightningArcs.filter(l => l.life > 0);
    window.energyPillars.forEach(p => { p.life--; p.scaleY += (1 - p.scaleY) * 0.2; }); window.energyPillars = window.energyPillars.filter(p => p.life > 0);
    window.blackHoles.forEach(b => b.life--); window.blackHoles = window.blackHoles.filter(b => b.life > 0);
    window.spaceRipples.forEach(r => { r.r += 12; r.life--; }); window.spaceRipples = window.spaceRipples.filter(r => r.life > 0);
    
    if (Math.random() < 0.15 && window.bokehs.length < 35 && window.lethalVoid <= 0) {
        window.bokehs.push({
            x: window.camX + Math.random()*1500 - 750, 
            y: Math.random()*window.canvas.height + 100, 
            vx: (Math.random()-0.5)*0.5, vy: -Math.random()*1 - 0.5, 
            life: 250, maxLife: 250, size: Math.random()*20+15, z: Math.random()*2 + 1.5, 
            color: Math.random() > 0.6 ? "#f1c40f" : "#00f3ff"
        });
    }
    window.bokehs.forEach(b => { b.x += b.vx; b.y += b.vy; b.life--; }); window.bokehs = window.bokehs.filter(b => b.life > 0);

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
    let activeBlackHole = window.blackHoles.length > 0 ? window.blackHoles[0] : null;

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
                if (haz.state === 'warning' && haz.timer <= 0) { haz.state = 'striking'; haz.timer = 12; window.playSound(300, 'sawtooth', 0.8, 0.8, true); window.shakeScreen(20, 15); window.spawnEnvDamage(haz.x, window.GROUND_Y, 'crater', 1.2, false); 
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
            if (activeBlackHole) {
                let dx = activeBlackHole.x - pt.x; let dy = activeBlackHole.y - pt.y; let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 10) { pt.vx += (dx/dist) * 3; pt.vy += (dy/dist) * 3; } pt.life -= 0.5;
            } else if (pt.isCoin) { pt.vy += window.GRAVITY * 0.5; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } 
            else if (pt.isRubble) { pt.vy += window.GRAVITY * 0.9; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.4; pt.vx *= 0.6; } } 
            else if (pt.isGlass) { window.ctx.save(); window.ctx.translate(pt.x, pt.y); window.ctx.rotate(pt.life * 0.2); window.ctx.beginPath(); window.ctx.moveTo(0, -pt.size); window.ctx.lineTo(pt.size, pt.size); window.ctx.lineTo(-pt.size, pt.size); window.ctx.fill(); window.ctx.restore(); } 
            else if (pt.isAuraFlame) { pt.vy -= 0.5; pt.vx += (Math.random()-0.5); pt.size *= 0.95; }
            else { pt.vy += window.GRAVITY * 0.9; }
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
            if (Math.random() < 0.05) window.spawnLightning(f.x, f.y - 40, f.isPlayer ? "#ff4757" : "#9b59b6", 20, 3);
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
                    
                    // --- CẬP NHẬT: ĐỤNG GĂNG (TRADE HIT BRAWL) ---
                    if (!f1.clashCooldown && !f2.clashCooldown && f1.isFacingRight !== f2.isFacingRight) {
                        f1.clashCooldown = 45; f2.clashCooldown = 45; 
                        
                        window.shakeScreen(15, 10); 
                        window.playSound(500, 'square', 0.2, 0.8, true);
                        window.targetZoom = 1.35; 
                        window.screenFlash = 0; // Đã loại bỏ nháy sáng
                        
                        let midX = (f1.x + f2.x)/2; let midY = (f1.y + f2.y)/2 - 30;
                        window.spawnParticles(midX, midY, "#f1c40f", true);
                        
                        if (window.shockwaves.length < MAX_SHOCKWAVES) {
                            window.shockwaves.push({x: midX, y: midY, r: 10, maxR: 250, color: "#ffffff", alpha: 0.8, speed: 25});
                        }
                        
                        window.floatingTexts.push({ x: midX, y: midY - 60, text: "⚔️ BRAWL!", color: "#f1c40f", alpha: 1.5, vx: 0, vy: -5, font: "italic 900 45px 'Arial Black', Impact", life: 40, scale: 2.5, targetScale: 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.1 });
                        
                        window.speedLinesAlpha = 0.4; 
                        window.impactAberration = 5; 
                        
                        window.isSpinningCam = true; 
                        window.orbitFocusX = midX; 
                        
                        window.targetTimeScale = 0.8;
                        setTimeout(() => { 
                            window.targetTimeScale = 1.0; 
                            window.isSpinningCam = false; 
                            window.targetCamOrbitAngle = 0; 
                        }, 800); 
                    }
                    // ---------------------------------------------

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

    if (window.isSpinningCam) { window.camOrbitAngle += 0.05; } 
    else { window.camOrbitAngle += (window.targetCamOrbitAngle - window.camOrbitAngle) * 0.1; }

    let midPointX = window.canvas.width / 2;
    if (window.p1 && window.enemies.length > 0) {
        let aliveEnemy = window.getClosestEnemy(window.p1, window.enemies) || window.enemies[0];
        midPointX = (window.p1.x + aliveEnemy.x) / 2;
    } else if (window.p1) { midPointX = window.p1.x; }

    if (!window.isSpinningCam) {
        window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.15;
    }

    let closest = window.p1 ? window.getClosestEnemy(window.p1, window.enemies) : null;
    let actionPan = (!window.gameOver && closest && window.slowMoTimer <= 0 && !window.isSpinningCam) ? (window.p1.vx + (closest.vx || 0)) * 6 : 0;
    
    window.targetCamX = (window.canvas.width / 2) - window.orbitFocusX + window.actionCamOffsetX + actionPan;
    window.targetCamY = (window.canvas.height / 2) - window.orbitFocusY + window.actionCamOffsetY + 60;

    if (window.gameOver && closest) {
        window.targetZoom = 2.0; 
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
    } else if (window.slowMoTimer > 0) { window.targetTilt = 0.025 * Math.sin(window.slowMoTimer * 0.1); }
}
