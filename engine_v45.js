// ==========================================
// ENGINE.JS - THE ABSOLUTE ULTIMATE MASTERPIECE 37.0 [NEXT-GEN CINEMATIC]
// [NEW] Lightning Arcs - Sét động học cuốn quanh cơ thể.
// [NEW] Energy Pillars - Cột năng lượng rực sáng anime.
// [NEW] True RGB Chromatic Aberration - Tách màu thị giác khi bạo kích.
// [NEW] Black Hole Physics - Hút vỡ hạt (particles) khi K.O Lethal Void.
// [ENHANCED] Hyper Slashes & Shockwaves.
// [BASE] Giữ nguyên 100% 360 Camera, Lethal Void, RTX Floor cũ.
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; window.lensFlares = [];

// [EPIC UPGRADE 37.0] NEW VFX ARRAYS
window.lightningArcs = []; window.energyPillars = []; window.blackHoles = [];

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

const MAX_PARTICLES = 300; const MAX_SHOCKWAVES = 15;

// ==========================================
// 1. HỆ THỐNG ÂM THANH & COLOR GRADING
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    window.viralColorGrade = { contrast: 125 + Math.random() * 15, brightness: 90 + Math.random() * 10, saturation: 100 + Math.random() * 30, hue: Math.floor((Math.random() - 0.5) * 20) };

    const lightingThemes = [
        { mix: 'overlay', color1: 'rgba(255, 120, 30, 0.3)', color2: 'rgba(10, 0, 20, 0.5)' },
        { mix: 'hard-light', color1: 'rgba(0, 180, 255, 0.2)', color2: 'rgba(0, 5, 30, 0.7)' }
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
        } else { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.6, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
}

// ==========================================
// 2. HỆ THỐNG SPAWN VFX VẬT LÝ & EPIC SKILLS
// ==========================================
window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude; }

// [EPIC UPGRADE 37.0] Năng lượng bùng nổ
window.spawnEnergyPillar = function(x, y, color, radius, life) {
    window.energyPillars.push({x: x, y: y, color: color, r: radius, life: life, maxLife: life, scaleY: 0});
    window.shakeScreen(life, 5);
}

// [EPIC UPGRADE 37.0] Tia sét cuộn quanh nhân vật
window.spawnLightning = function(x, y, color, length, branches) {
    let pts = [{x: x, y: y}]; let currX = x, currY = y;
    for(let i=0; i<branches; i++) {
        currX += (Math.random() - 0.5) * length; currY -= Math.random() * length; pts.push({x: currX, y: currY});
    }
    window.lightningArcs.push({pts: pts, color: color, life: 10, maxLife: 10});
}

// [EPIC UPGRADE 37.0] Hố đen hút vật chất
window.spawnBlackHole = function(x, y, radius, life) {
    window.blackHoles.push({x: x, y: y - 50, r: radius, life: life, maxLife: life});
}

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ x: x, y: y, isRight: isRight, life: 15, maxLife: 15, color: color, scale: (isCrit ? 2.8 : 1.8) * scale, rotation: rotation }); 
    // Sinh thêm hạt sáng li ti tỏa ra từ vết chém
    for(let i=0; i<10; i++) {
        window.impactSparks.push({ x: x, y: y, vx: (isRight ? 1 : -1)*(Math.random()*15+5), vy: (Math.random()-0.5)*15, life: 20, maxLife: 30, color: color, scale: Math.random() * 1.5 });
    }
}

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    let count = isCrit ? 35 : 15; 
    for(let i=0; i<count; i++) { 
        let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?25:12) + 2; 
        window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 35, maxLife: 35, color: color, size: Math.random() * 6 + 2 }); 
    } 
}
window.spawnDust = function(x, y) { if (window.particles.length > MAX_PARTICLES) return; for(let i=0; i<8; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y, vx: (Math.random()-0.5)*8, vy: -Math.random()*2 - 0.2, life: 30, maxLife: 30, color: "rgba(189, 195, 199, 0.4)", size: Math.random() * 12 + 6, isGroundDust: true }); } }
window.spawnInk = function(x, y, color, isRight) { window.inkSplatters.push({ x: x, y: y, color: color, life: 35, maxLife: 35, scale: Math.random() * 0.8 + 0.6, ang: (Math.random() - 0.5)*0.5 + (isRight ? 0 : Math.PI) }); }
window.spawnForegroundDebris = function(x, y, isRight) { let count = 6 + Math.floor(Math.random() * 4); for(let i=0; i<count; i++) { let vx = (isRight ? 1 : -1) * (15 + Math.random() * 20); let vy = -10 - Math.random() * 15; let scaleSpeed = 1.05 + Math.random() * 0.05; window.foregroundDebris.push({ x: x, y: y, vx: vx, vy: vy, life: 40, maxLife: 40, scale: 1.0, scaleSpeed: scaleSpeed, rot: Math.random() * Math.PI, rotSpeed: (Math.random() - 0.5) * 0.4 }); } }

window.spawnGlassShatter = function(x, y) {
    window.playSound(600, 'sawtooth', 0.5, 0.8, true); window.shakeScreen(25, 18);
    for(let i=0; i<25; i++) { window.particles.push({ x: x + (Math.random()*40-20), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*18, vy: -Math.random()*18, life: 30, maxLife: 30, color: "rgba(100, 255, 255, 0.9)", size: Math.random()*6+2, isGlass: true }); }
}
window.spawnLensFlare = function(x, y, color, scale) { window.lensFlares.push({x: x, y: y, color: color, scale: scale, life: 30, maxLife: 30}); }
window.spawnMangaSFX = function(x, y, isCrit) {
    let sfxList = ['ゴゴゴ', 'ドドド', 'ドム', 'ズバーン', 'バキッ'];
    let text = sfxList[Math.floor(Math.random() * sfxList.length)];
    window.mangaSfx.push({ x: x + (Math.random()*60-30), y: y + (Math.random()*40-20), vx: (Math.random()-0.5)*4, vy: -2 - Math.random()*3, life: 40, maxLife: 40, text: text, size: isCrit ? 65 : 40, isCrit: isCrit, ang: (Math.random()-0.5)*0.5 });
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
// 3. HỆ THỐNG NHẬN SÁT THƯƠNG & FINISHER
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    let finalDmg = amount;
    if (target.shield > 0) { target.shield -= finalDmg; if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; } window.spawnParticles(target.x, target.y - 40, "#3498db"); }

    if (finalDmg > 0) {
        target.hp -= finalDmg; if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥 -${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        window.floatingTexts.push({ x: target.x, y: target.y - 60, text: dmgText, color: color || (isCrit ? "#ff4757" : "#fff"), alpha: 1.5, vx: (attackerDirRight ? 1 : -1) * (Math.random() * 6 + 3), vy: -8 - Math.random() * 6, font: isCrit ? "italic 900 45px 'Arial Black'" : "italic 900 30px 'Arial Black'", life: 45, scale: isCrit ? 5.5 : 2.5, targetScale: isCrit ? 1.5 : 1.0, scaleVel: 0, rot: (Math.random()-0.5)*0.5 });
        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);

        if (isCrit) {
            window.screenFlash = 0.5; 
            window.impactFrameCount = 3; 
            window.targetZoom = 1.45; setTimeout(() => { window.targetZoom = 1.1; }, 100); 
            window.impactAberration = 25; window.spawnForegroundDebris(target.x, target.y, attackerDirRight);
            window.targetCamOrbitAngle = attackerDirRight ? -0.4 : 0.4; window.orbitFocusX = target.x; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 600);
            window.spawnMangaSFX(target.x, target.y - 60, true); window.spawnInk(target.x, target.y - 40, color || "#ff003c", target.isFacingRight); 
            window.targetTimeScale = 0.15; setTimeout(()=>{ window.targetTimeScale = 1.2; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 200); }, 300);
            
            // Sét điện nổ ra khi dính Crit
            for(let i=0; i<3; i++) window.spawnLightning(target.x, target.y-40, color || "#f1c40f", 30, 4);
        } else { 
            window.targetZoom = 1.15; setTimeout(() => { window.targetZoom = 1.1; }, 50); window.impactAberration = 8; 
        }

        if (target.superArmor <= 0 && target.state !== 'stunned') { target.state = 'hurt'; target.hitStun = isCrit ? 25 : 12; target.attackTimer = 0; target.comboStep = 0; }
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (target.hp <= 0) {
            if (isCrit) {
                window.screenFlash = 0.6; 
                window.invertFrames = 3; 
                window.speedLinesAlpha = 1.0; window.spawnLensFlare(target.x, target.y - 40, "#ff003c", 6.0);
                window.floatingTexts.push({ x: target.x, y: target.y - 120, text: "💀 LETHAL FINISH!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -2, font: "italic 900 70px 'Arial Black'", life: 100, scale: 5.0, targetScale: 1.2, scaleVel: 0, rot: 0 });
                window.targetZoom = 2.0; window.actionCamOffsetX = (target.isFacingRight ? 120 : -120); window.actionCamOffsetY = -60; window.dynamicBlur = 30; window.cameraTilt = (Math.random() > 0.5 ? 1 : -1) * 0.18; 
                window.lethalVoid = 100; window.impactAberration = 50; 
                window.hitStopFrames = 30; window.shakeScreen(60, 45); window.triggerDimensionShatter(); 
                
                // [EPIC UPGRADE 37.0] Bật Hố Đen Trung Tâm
                window.spawnBlackHole(target.x, target.y, 400, 150);
                window.spawnEnergyPillar(target.x, window.GROUND_Y, "#ff003c", 100, 80);

                // [VIRAL 36.0] ĐẠO DIỄN QUAY CHẬM 360 ĐỘ
                window.isSpinningCam = true; 
                window.orbitFocusX = (target.x + window.p1.x) / 2; 
                window.targetTimeScale = 0.01; 
                setTimeout(()=>{ window.targetTimeScale = 1.0; window.cameraTilt = 0; window.isSpinningCam = false; window.targetCamOrbitAngle = 0; }, 4000); 

            } else { window.hitStopFrames = 15; window.shakeScreen(30, 25); window.targetZoom = 1.5; window.targetTimeScale = 0.2; window.impactAberration = 20; setTimeout(()=>{window.targetTimeScale = 1.0; }, 1000); }
            window.impactFrameTimer = 0; window.chromaTimer = 40; window.playSound(80, 'square', 1.5, 0.8, true); window.koGlitchTimer = 60; target.state = 'ko_falling'; target.koTimer = 100; target.vy = -12; target.onGround = false;
        } else if (isCrit) { window.hitStopFrames = 8; window.shakeScreen(20, 15); window.chromaTimer = 15; window.playSound(180, 'square', 0.3, 0.6, true); } 
    }
};

// ==========================================
// 4. CORE UPDATE VẬT LÝ & PARTICLES
// ==========================================
window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1 || window.isLoading) return; 

    window.actionCamOffsetX *= 0.85; window.actionCamOffsetY *= 0.85; window.actionCamSkew *= 0.85; window.dynamicBlur *= 0.9;
    if (window.impactAberration > 0) window.impactAberration -= 1.5; if (window.lethalVoid > 0) window.lethalVoid--;
    if (window.invertFrames > 0) window.invertFrames--; if (window.impactFrameCount > 0) window.impactFrameCount--;

    // [EPIC UPGRADE 37.0] Cập nhật VFX mới
    window.lightningArcs.forEach(l => l.life--); window.lightningArcs = window.lightningArcs.filter(l => l.life > 0);
    window.energyPillars.forEach(p => { p.life--; p.scaleY += (1 - p.scaleY) * 0.2; }); window.energyPillars = window.energyPillars.filter(p => p.life > 0);
    window.blackHoles.forEach(b => b.life--); window.blackHoles = window.blackHoles.filter(b => b.life > 0);

    window.lensFlares.forEach(lf => lf.life--); window.lensFlares = window.lensFlares.filter(lf => lf.life > 0);
    if (window.dimensionCracks) { window.dimensionCracks.forEach(c => c.life--); window.dimensionCracks = window.dimensionCracks.filter(c => c.life > 0); }
    if (window.inkSplatters) { window.inkSplatters.forEach(i => i.life--); window.inkSplatters = window.inkSplatters.filter(i => i.life > 0); }
    if (window.foregroundDebris) { window.foregroundDebris.forEach(d => { d.x += d.vx; d.y += d.vy; d.vy += window.GRAVITY; d.scale *= d.scaleSpeed; d.rot += d.rotSpeed; d.life--; }); window.foregroundDebris = window.foregroundDebris.filter(d => d.life > 0 && d.scale < 10); }

    let isTimeStopped = window.timeStopTimer > 0;
    if (isTimeStopped) window.timeStopTimer--;

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; 
    if (window.screenFlash > 0) { window.screenFlash -= 0.08; if (window.screenFlash <= 0) window.screenFlash = 0; }
    
    if (isSlowMoFrame) return;

    // Lực hút hố đen lên Particles
    let activeBlackHole = window.blackHoles.length > 0 ? window.blackHoles[0] : null;

    if (!isTimeStopped) {
        for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
        for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
        
        for (let i = window.particles.length - 1; i >= 0; i--) { 
            let pt = window.particles[i]; 
            // [EPIC UPGRADE] Lực hút hố đen
            if (activeBlackHole) {
                let dx = activeBlackHole.x - pt.x; let dy = activeBlackHole.y - pt.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 10) { pt.vx += (dx/dist) * 3; pt.vy += (dy/dist) * 3; }
                pt.life -= 0.5; // Hạt chết nhanh hơn khi bị hút
            } else {
                pt.vy += window.GRAVITY * 0.9;
            }
            pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); 
        }
    }

    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }

    let allFighters = [window.p1].concat(window.enemies);

    allFighters.forEach(f => {
        if (!f) return;
        if (f.hp <= 0) { 
            f.vy += window.GRAVITY * 0.5; 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.93; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }
        
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--;
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.2); 
        if (f.isRage && Math.random() < 0.1) {
            // [EPIC UPGRADE] Sét tự động văng ra khi vận nội công
            window.spawnLightning(f.x, f.y - 40, f.isPlayer ? "#ff4757" : "#9b59b6", 20, 3);
        }

        f.vy += window.GRAVITY; 
        f.y += f.vy; if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (f.dashTimer > 0) { f.vx = f.dashDir * (f.speed||3) * 1.9; } else if (f.onGround) { f.vx *= 0.85; }
        f.x += f.vx;
    });

    // CAMERA LOGIC CŨ GIỮ NGUYÊN (Khóa mục tiêu, 3D Quay mượt)
    if (window.isSpinningCam) { window.camOrbitAngle += 0.05; } else { window.camOrbitAngle += (window.targetCamOrbitAngle - window.camOrbitAngle) * 0.1; }
    let midPointX = window.p1 ? window.p1.x : window.canvas.width/2;
    if (window.p1 && window.enemies.length > 0) { midPointX = (window.p1.x + window.enemies[0].x) / 2; }
    window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.15;
    window.targetCamX = (window.canvas.width / 2) - window.orbitFocusX + window.actionCamOffsetX;
    window.targetCamY = (window.canvas.height / 2) - window.orbitFocusY + window.actionCamOffsetY + 60;
    if (window.gameOver) { window.targetZoom = 2.0; if(window.isSpinningCam) window.targetCamY += 40; } 
    else if (window.slowMoTimer <= 0) { window.targetZoom = Math.max(0.9, Math.min(1.35, 1.35 - (Math.abs(window.p1.x - midPointX) / 400) * 0.4)); }
}

// ==========================================
// 5. RENDERING (DRAW) VỚI EPIC VFX
// ==========================================
window.draw = function() {
    if (!window.canvas || !window.ctx) return;
    
    window.camVelocityX = window.targetCamX - window.camX;
    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;
    
    // Nền mờ tạo Blur
    window.ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.9, 0.35 + Math.abs(window.camVelocityX)*0.01)})`;
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    // [EPIC UPGRADE 37.0] TÍNH TOÁN CHROMATIC ABERRATION (RGB SPLIT)
    let chromaOffset = 0;
    if (window.impactAberration > 0) { chromaOffset = window.impactAberration * 0.8; }

    // HÀM VẼ TOÀN BỘ CẢNH (CÓ THỂ VẼ NHIỀU LẦN ĐỂ TÁCH MÀU)
    const renderScene = (colorTint, xOffset) => {
        window.ctx.save();
        
        // Rung & Translate Camera
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(window.currentZoom, window.currentZoom); 
        window.ctx.translate(-window.canvas.width / 2 + window.camX + xOffset, -window.canvas.height / 2 + window.camY);

        // Toán học 3D Projection
        let cosA = Math.cos(window.camOrbitAngle || 0); let sinA = Math.sin(window.camOrbitAngle || 0);
        let project3D = (obj) => {
            let dx = obj.x - window.orbitFocusX; let pX = window.orbitFocusX + dx * cosA; let pZ = dx * sinA;
            let pY = obj.y - pZ * 0.02; 
            let pScale = (obj.scale || 1.0) * (1 + pZ * 0.0035); if (pScale < 0.1) pScale = 0.1;
            let pFacing = obj.isFacingRight;
            if (typeof obj.isFacingRight !== 'undefined') { let nAng = ((window.camOrbitAngle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2); if (nAng > Math.PI/2 && nAng < Math.PI*1.5) { pFacing = !pFacing; } }
            return { drawX: pX, drawY: pY, drawZ: pZ, drawScale: pScale, drawFacingRight: pFacing };
        };

        // Render Background (Giả lập lưới sàn RTX)
        window.ctx.strokeStyle = "#ff4757"; window.ctx.lineWidth = 2; window.ctx.beginPath(); window.ctx.moveTo(-2000, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 2000, window.GROUND_Y); window.ctx.stroke();

        let allFighters = [window.p1].concat(window.enemies).filter(f => f);
        let sortedFighters = allFighters.map(f => { let proj = project3D(f); f.drawX = proj.drawX; f.drawY = proj.drawY; f.drawZ = proj.drawZ; f.drawScale = proj.drawScale; f.drawFacingRight = proj.drawFacingRight; return f; }).sort((a,b) => a.drawZ - b.drawZ);

        // Render Bóng
        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        sortedFighters.forEach(p => { if (p && p.hp >= 0) { window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * p.drawScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.drawX, window.GROUND_Y - p.drawZ * 0.15, 35 * p.drawScale, 7 * p.drawScale, 0, 0, Math.PI * 2); window.ctx.fill(); } });
        window.ctx.restore();

        // Render Nhân Vật
        sortedFighters.forEach(p => { 
            window.ctx.save(); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
            let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
            if(colorTint) window.ctx.filter = colorTint; // Áp dụng màu tách RGB
            if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone);
            window.ctx.restore();
        }); 

        // [EPIC UPGRADE] Vẽ Black Hole (Hố đen)
        window.blackHoles.forEach(b => {
            let pr = project3D(b);
            window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.scale(pr.drawScale, pr.drawScale);
            let alpha = Math.min(1, b.life / 20);
            window.ctx.globalAlpha = alpha; window.ctx.globalCompositeOperation = 'destination-out';
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.5, 0, Math.PI*2); window.ctx.fill(); // Lõi đen
            window.ctx.globalCompositeOperation = 'lighter';
            window.ctx.shadowBlur = 50; window.ctx.shadowColor = "#9b59b6";
            window.ctx.strokeStyle = "#8e44ad"; window.ctx.lineWidth = 15;
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.8 + Math.random()*20, 0, Math.PI*2); window.ctx.stroke(); // Viền Event Horizon
            window.ctx.restore();
        });

        // [EPIC UPGRADE] Vẽ Energy Pillars
        window.ctx.globalCompositeOperation = 'lighter';
        window.energyPillars.forEach(p => {
            let pr = project3D(p); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY);
            let alpha = Math.min(1, p.life / 15); window.ctx.globalAlpha = alpha;
            let grad = window.ctx.createLinearGradient(0, 0, 0, -800 * p.scaleY);
            grad.addColorStop(0, p.color); grad.addColorStop(1, "rgba(255,255,255,0)");
            window.ctx.fillStyle = grad; window.ctx.shadowBlur = 40; window.ctx.shadowColor = p.color;
            window.ctx.fillRect(-p.r * pr.drawScale, -800 * p.scaleY, p.r * 2 * pr.drawScale, 800 * p.scaleY);
            window.ctx.restore();
        });

        // [EPIC UPGRADE] Vẽ Slashes Mới (Đẹp hơn, răng cưa hơn)
        window.slashes.forEach(s => { 
            let pr = project3D(s); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); 
            if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale * pr.drawScale, s.scale * pr.drawScale); window.ctx.rotate(s.rotation || 0); 
            let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); 
            
            // Lõi trắng sắc lẹm
            window.ctx.beginPath(); window.ctx.arc(0, 0, 50 + prog * 30, -Math.PI/2 + prog*1.5, Math.PI/2 - prog*1.5); 
            window.ctx.lineWidth = 20 * (1 - prog); window.ctx.strokeStyle = "#fff"; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 30; window.ctx.shadowColor = s.color; window.ctx.stroke(); 
            // Viền ngoài phát sáng màu
            window.ctx.beginPath(); window.ctx.arc(0, 0, 45 + prog * 35, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); 
            window.ctx.lineWidth = 40 * (1 - prog); window.ctx.strokeStyle = s.color; window.ctx.globalAlpha *= 0.5; window.ctx.stroke(); 
            window.ctx.restore(); 
        });

        // [EPIC UPGRADE] Vẽ Lightning Arcs
        window.lightningArcs.forEach(l => {
            window.ctx.save(); window.ctx.shadowBlur = 20; window.ctx.shadowColor = l.color; window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 3 + Math.random()*2;
            window.ctx.beginPath();
            let p0 = project3D(l.pts[0]); window.ctx.moveTo(p0.drawX, p0.drawY);
            for(let i=1; i<l.pts.length; i++) {
                let pi = project3D({x: l.pts[i].x + (Math.random()-0.5)*10, y: l.pts[i].y + (Math.random()-0.5)*10});
                window.ctx.lineTo(pi.drawX, pi.drawY);
            }
            window.ctx.stroke(); window.ctx.restore();
        });

        // Hạt Particles
        window.particles.forEach(pt => { 
            let pr = project3D(pt); window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fillStyle = pt.color; 
            window.ctx.shadowBlur = 15; window.ctx.shadowColor = pt.color; window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, pt.size*pr.drawScale, 0, Math.PI*2); window.ctx.fill(); 
        }); window.ctx.shadowBlur = 0; window.ctx.globalAlpha = 1.0;

        window.ctx.restore(); // Hết Camera Context
    };

    // [VIRAL 37.0] RENDER KÉP TẠO HIỆU ỨNG TÁCH MÀU RGB KHI DÍNH CRIT
    if (chromaOffset > 0) {
        window.ctx.globalCompositeOperation = 'screen';
        renderScene('drop-shadow(0 0 0 red)', -chromaOffset);    // Layer Đỏ trượt trái
        renderScene('drop-shadow(0 0 0 blue)', chromaOffset);    // Layer Xanh trượt phải
        window.ctx.globalCompositeOperation = 'source-over';
    } else {
        renderScene(null, 0); // Render bình thường
    }

    // CHỚP MÀN HÌNH (Flash) LỚP TRÊN CÙNG
    if (window.screenFlash > 0) { 
        window.ctx.globalCompositeOperation = 'screen';
        window.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(window.screenFlash, 0.8)})`; 
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
        window.ctx.globalCompositeOperation = 'source-over';
    }

    // Floating Texts
    window.floatingTexts.forEach(t => { 
        let cosA = Math.cos(window.camOrbitAngle || 0); let dx = t.x - window.orbitFocusX;
        let prX = window.canvas.width/2 + (dx * cosA) + window.actionCamOffsetX;
        let prY = window.canvas.height/2 + (t.y - window.orbitFocusY) + window.actionCamOffsetY;
        
        window.ctx.save(); window.ctx.translate(prX, prY); if (t.rot) window.ctx.rotate(t.rot); 
        window.ctx.scale(t.scale, t.scale); window.ctx.font = t.font; window.ctx.fillStyle = t.color; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); 
        window.ctx.lineWidth = 4; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(t.text, 0, 0); window.ctx.shadowBlur = 15; window.ctx.shadowColor = t.color; window.ctx.fillText(t.text, 0, 0); window.ctx.restore();
    }); 
}

// HỆ THỐNG LOOP (Giữ nguyên)
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
    
    if (window.hitStopFrames > 0) { window.hitStopFrames--; try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } return; }

    window.timeScale += (window.targetTimeScale - window.timeScale) * 0.15;
    let scaledDelta = deltaTime * window.timeScale;
    window.physicsAccumulator += scaledDelta;

    while (window.physicsAccumulator >= window.PHYSICS_STEP) {
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        window.physicsAccumulator -= window.PHYSICS_STEP;
    }

    let dZoom = window.targetZoom - window.currentZoom; window.cameraZoomVel += dZoom * 0.18; window.cameraZoomVel *= 0.72; window.currentZoom += window.cameraZoomVel;
    let lerp = 1 - Math.pow(1 - 0.12, deltaTime / 16.666); if(lerp > 1) lerp = 1; else if(lerp < 0) lerp = 0;
    
    window.camX += (window.targetCamX - window.camX) * lerp; 
    window.camY += (window.targetCamY - window.camY) * lerp; 

    try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
}

if (typeof window !== 'undefined') { setTimeout(() => { if(typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100); }
