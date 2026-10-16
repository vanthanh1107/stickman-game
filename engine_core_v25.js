// ==========================================
// ENGINE_CORE.JS - V9.0 HYPER COMBO & BLACK FLASH EDITION (60FPS - 1V1)
// NÂNG CẤP HỆ THỐNG COMBO ĐỈNH CAO:
// 1. Directional 3D Hit-Rings (Vòng xung kích 3D nghiêng theo góc đòn đánh).
// 2. Z-Vanish Air Chase (Tốc biến đuổi theo trên không sau khi hất tung đối thủ).
// 3. Ground Bounce & Wall Bounce (Đập đất nảy lên & Bật tường nối tiếp chuỗi Combo).
// 4. Phantom Rush Barrage (Mưa kình lực liên hoàn kiểu Anime khi tung chuỗi đấm nhanh).
// 5. Black Flash (Hắc Thiểm - Sét Đen Đỏ khi nổ Chí Mạng trong chuỗi từ 6 Hits trở lên).
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; window.lensFlares = [];

window.lightningArcs = []; window.energyPillars = []; window.blackHoles = [];
window.bokehs = []; window.spaceRipples = [];
window.activeSequences = []; 

// MẢNG HIỆU ỨNG ĐẠI CHIÊU THỨC & HYPER COMBO V9.0
window.activeDomain = null;     
window.phantomClones = [];      
window.giantDrops = [];         
window.dimensionCracks = [];    
window.hitRings = [];           // Vòng xung kích 3D theo góc đòn đánh
window.phantomFists = [];       // Luồng kình lực đấm liên hoàn (Gatling / Ora Ora)

window.p1 = null; window.gameOver = false; window.isLoopRunning = false;
window.enemies = []; window.totalEnemyMaxHp = 0; window.rewardMultiplier = 1; 

window.shakeTime = 0; window.shakeMag = 0; window.hitStopFrames = 0; window.matchResolved = false;
window.screenFlash = 0; window.screenFlashColor = "#ffffff";
window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
window.introTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0;
window.currentWeather = 'none'; window.weatherParticles = [];

window.GROUND_Y = 320; window.GRAVITY = 0.8; 
window.matchTimer = 0; window.impactFrameTimer = 0;

window.camX = 0; window.camY = 0; window.currentZoom = 1; window.cameraTilt = 0;
window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0;
window.actionCamOffsetX = 0; window.actionCamOffsetY = 0; window.dynamicBlur = 0; window.cinemaBarsHeight = 0; 

window.camOrbitAngle = 0; window.targetCamOrbitAngle = 0; window.isSpinningCam = false; 
window.orbitFocusX = 0; window.orbitFocusY = window.GROUND_Y - 60; 

window.globalWind = 0; window.chromaTimer = 0; window.vhsGlitchTimer = 0;
window.envHazards = []; window.WALL_PADDING = 40; window.koGlitchTimer = 0; window.envDamage = []; 
window.timeStopTimer = 0; window.timeStopCaster = null; window.screenFilter = null; window.filterTimer = 0;
window.vignetteAlpha = 0.5; window.isLowHpPulsing = 0; window.speedLinesAlpha = 0; 
window.impactFrameCount = 0; window.cameraZoomVel = 0; window.actionCamSkew = 0;

window.mangaSfx = []; window.inkSplatters = []; window.invertFrames = 0; window.noiseCanvas = null; 
window.timeScale = 1.0; window.targetTimeScale = 1.0; window.camVelocityX = 0; window.camDriftX = 0; window.camDriftY = 0;
window.foregroundDebris = []; window.lethalVoid = 0; window.impactAberration = 0; window.bassDropFrames = 0; window.screenTearing = 0; 

window.viralColorGrade = { contrast: 100, brightness: 100, saturation: 100, hue: 0 };
window.globalIllumination = null; window.isLoading = true; window.loadProgress = 0; window.chromaCanvas = null; 

const MAX_PARTICLES = 260; 
const MAX_SHOCKWAVES = 20;

// ==========================================
// 1. AUDIO & ENGINE INITIALIZATION
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    
    window.thumbnailConfig = {
        hue: Math.floor(Math.random() * 360),
        title: ["EPIC BRAWL", "SUPREME FIGHT", "STICKMAN VIBES", "LEGENDARY", "GOD TIER CLASH", "ULTIMATE DUEL"][Math.floor(Math.random() * 6)],
        emoji: ["🔥", "⚡", "⚔️", "👑", "🐉", "💥"][Math.floor(Math.random() * 6)],
        rayCount: 12 + Math.floor(Math.random() * 6) * 2
    };

    if (!window.audioCtx) { try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} }
    let loadInterval = setInterval(() => {
        window.loadProgress += 15; 
        if (window.loadProgress >= 100) { 
            window.loadProgress = 100; 
            clearInterval(loadInterval); 
            setTimeout(() => { window.isLoading = false; window.playSound(800, 'sine', 0.35, 0.4); }, 150); 
        }
    }, 25);
};

window.triggerVibration = function(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } };
window.toggleAudio = function(e) { e.stopPropagation(); window.isMuted = !window.isMuted; let btn = document.getElementById("btn-audio"); if (btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } };
window.playSound = function(freq, type, duration, vol, isImpact = false) { 
    if (window.isMuted) return; 
    try {
        if (!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        let t = window.audioCtx.currentTime; let osc = window.audioCtx.createOscillator(); let gain = window.audioCtx.createGain(); 
        osc.connect(gain); gain.connect(window.audioCtx.destination);
        if (window.masterRecordDestination) { try { gain.connect(window.masterRecordDestination); } catch(e){} }
        let safeVol = Math.min(vol || 0.5, 0.85); 
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : (type || 'sawtooth'); osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(18, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
            let snap = window.audioCtx.createOscillator(); let snapGain = window.audioCtx.createGain(); 
            snap.type = 'square'; snap.frequency.setValueAtTime(freq * 2.6, t); snap.frequency.exponentialRampToValueAtTime(30, t + 0.045); 
            snapGain.gain.setValueAtTime(safeVol * 0.35, t); snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.045); 
            snap.connect(snapGain); snapGain.connect(window.audioCtx.destination);
            if (window.masterRecordDestination) { try { snapGain.connect(window.masterRecordDestination); } catch(e){} }
            snap.start(t); snap.stop(t + 0.045);
        } else { 
            osc.type = type || 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.5), t + duration); 
            gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.55, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
};

// ==========================================
// 2. BỘ CÔNG CỤ KỸ NĂNG & HIỆU ỨNG COMBO V9.0
// ==========================================
window.shakeScreen = function(frames, magnitude) { 
    window.shakeTime = Math.min(frames || 10, 20); 
    window.shakeMag = Math.min((magnitude || 5) * 0.45, 6.0); 
};

window.playSequence = function(sequenceEvents) {
    window.activeSequences.push({ currentFrame: 0, events: sequenceEvents });
};

// VÒNG XUNG KÍCH 3D NGHIÊNG THEO GÓC ĐÒN ĐÁNH (DIRECTIONAL HIT-RING)
window.spawnHitRing = function(x, y, angle = 0, color = "#00f3ff", maxRadius = 68) {
    if (!window.hitRings) window.hitRings = [];
    if (window.hitRings.length < 14) {
        window.hitRings.push({
            x: x, y: y,
            angle: angle,
            color: color,
            r: 8,
            maxR: maxRadius,
            life: 14,
            maxLife: 14
        });
    }
};

// HIỆU ỨNG HẮC THIỂM (BLACK FLASH - SÉT ĐEN VIỀN ĐỎ CHÍ MẠNG)
window.spawnBlackFlash = function(x, y) {
    window.playSound(95, 'sawtooth', 0.45, 0.9, true);
    window.shakeScreen(14, 8);
    window.impactAberration = 7;

    // 4 luồng sét lõi Đen viền Đỏ Thẫm tỏa ra 4 hướng
    for (let b = 0; b < 4; b++) {
        let pts = [{x: x, y: y}];
        let currX = x, currY = y;
        let ang = (Math.PI / 2) * b + (Math.random() - 0.5) * 0.6;
        for (let i = 0; i < 5; i++) {
            ang += (Math.random() - 0.5) * 0.9;
            currX += Math.cos(ang) * (24 + Math.random() * 18);
            currY += Math.sin(ang) * (24 + Math.random() * 18);
            pts.push({x: currX, y: currY});
        }
        window.lightningArcs.push({
            pts: pts,
            color: "#ff003c",
            isBlackFlash: true,
            life: 18,
            maxLife: 18
        });
    }

    window.spawnHitRing(x, y, -0.4, "#ff003c", 95);
    window.spawnHitRing(x, y, 0.4, "#000000", 80);
    window.spawnCrossSlash(x, y, true, "#ff003c", "#000000", 2.1);
};

// MƯA KÌNH LỰC ĐẤM LIÊN HOÀN (PHANTOM RUSH BARRAGE)
window.spawnPhantomBarrage = function(caster, target, color = "#00f3ff", count = 8) {
    if (!caster || !target) return;
    if (!window.phantomFists) window.phantomFists = [];
    let isRight = (target.x >= caster.x);
    let dir = isRight ? 1 : -1;

    for (let i = 0; i < count; i++) {
        let offsetY = -20 - Math.random() * 50;
        window.phantomFists.push({
            x: caster.x + dir * (15 + Math.random() * 20),
            y: caster.y + offsetY,
            vx: dir * (16 + Math.random() * 10),
            vy: (Math.random() - 0.5) * 4,
            color: (i % 2 === 0) ? color : "#ffffff",
            size: 10 + Math.random() * 6,
            isRight: isRight,
            life: 10 + Math.floor(Math.random() * 6),
            maxLife: 15
        });
    }
};

window.spawnEnergyPillar = function(x, y, color, radius, life) { 
    window.energyPillars.push({x: x, y: y || window.GROUND_Y, color: color || "#00f3ff", r: Math.min(radius || 45, 90), life: life || 24, maxLife: life || 24, scaleY: 0}); 
    window.shakeScreen(8, 5); 
};

window.spawnLightning = function(x, y, color, length, branches) { 
    let pts = [{x: x, y: y}]; 
    let currX = x, currY = y; 
    let count = Math.max(3, branches || 4);
    for (let i = 0; i < count; i++) { 
        currX += (Math.random() - 0.5) * (length || 30) * 1.2; 
        currY -= Math.random() * (length || 30); 
        pts.push({x: currX, y: currY}); 
    } 
    window.lightningArcs.push({pts: pts, color: color || "#00f3ff", life: 14, maxLife: 14}); 
};

window.spawnSkyLightning = function(targetX, targetY, color = "#00f3ff") {
    for (let bolt = 0; bolt < 2; bolt++) {
        let pts = [];
        let currX = targetX + (Math.random() - 0.5) * 40;
        let currY = -150;
        pts.push({x: currX, y: currY});
        let steps = 8;
        let stepY = ((targetY || window.GROUND_Y) - currY) / steps;
        for (let i = 1; i <= steps; i++) {
            currY += stepY;
            currX = (i === steps) ? targetX : (currX + (Math.random() - 0.5) * 55);
            pts.push({x: currX, y: currY});
        }
        window.lightningArcs.push({pts: pts, color: color, life: 16, maxLife: 16});
    }
    window.spawnEnergyPillar(targetX, targetY || window.GROUND_Y, color, 45, 18);
};

window.spawnBlackHole = function(x, y, radius, life, color = "#8e44ad") { 
    window.blackHoles.push({x: x, y: y - 55, r: Math.min(radius || 65, 110), life: life || 60, maxLife: life || 60, color: color}); 
};

window.spawnSpaceRipple = function(x, y, color) { 
    window.spaceRipples.push({x: x, y: y, r: 10, maxR: 260, color: color || "#00f3ff", life: 24, maxLife: 24});
    if (window.shockwaves.length < MAX_SHOCKWAVES) {
        window.shockwaves.push({x: x, y: y, r: 8, maxR: 220, color: color || "#00f3ff", alpha: 0.85, speed: 15});
    }
};

window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { 
    window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); 
};

window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit, imageUrl = null, imgW = 100, imgH = 100, emoji = null) { 
    window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius || 12, color: color || "#00f3ff", dmg: dmg || 15, target: target, onHit: customOnHit, imageUrl: imageUrl, imgW: imgW, imgH: imgH, emoji: emoji }); 
};

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ 
        x: x, y: y, isRight: isRight, life: 15, maxLife: 15, color: color || "#00f3ff", 
        scale: Math.min(scale || (isCrit ? 1.95 : 1.35), 4.5), 
        rotation: rotation 
    }); 
    // Tự động đính kèm Vòng Xung Kích 3D theo đúng góc chém!
    window.spawnHitRing(x, y, rotation, color || "#00f3ff", isCrit ? 78 : 52);

    let sparkCount = isCrit ? 8 : 4;
    for (let i = 0; i < sparkCount; i++) { 
        window.impactSparks.push({ 
            x: x, y: y, 
            vx: (isRight ? 1 : -1) * (Math.random() * 15 + 5), 
            vy: (Math.random() - 0.5) * 14, 
            life: 18 + Math.random() * 10, maxLife: 28, 
            color: color || "#00f3ff", scale: Math.random() * 1.2 + 0.6,
            zSpeed: Math.random() > 0.5 ? 1.03 : 0.97
        }); 
    }
};

window.spawnCrossSlash = function(x, y, isRight, color1, color2, scale = 1.6) {
    window.spawnSlash(x, y, isRight, color1, true, scale, -0.48);
    window.spawnSlash(x, y, isRight, color2 || "#ffffff", true, scale * 0.92, 0.48);
    window.spawnAura(x, window.GROUND_Y, color1, 65, 18);
    if (window.shockwaves.length < MAX_SHOCKWAVES) {
        window.shockwaves.push({x: x, y: y, r: 10, maxR: 190, color: color1, alpha: 0.9, speed: 16});
    }
};

window.spawnFighterAfterimage = function(f, customColor) {
    if (!f) return;
    if (!window.ghostTrails) window.ghostTrails = [];
    if (window.ghostTrails.length < 10) {
        window.ghostTrails.push({
            x: f.x, y: f.y,
            scale: f.scale || 1, state: f.state,
            isFacingRight: f.isFacingRight,
            alpha: 0.45, life: 12,
            drawMethod: f.drawMethod,
            avatarUrl: f.avatarUrl,
            color: customColor || f.color
        });
    }
};

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    let count = isCrit ? 14 : 6; 
    for (let i = 0; i < count; i++) { 
        let angle = Math.random() * Math.PI * 2; 
        let speed = Math.random() * (isCrit ? 16 : 9) + 2; 
        window.particles.push({ 
            x: x, y: y - 30, 
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, 
            life: 26, maxLife: 26, color: color || "#fff", size: Math.random() * 4.5 + 2 
        }); 
    } 
};

window.spawnDust = function(x, y) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    for (let i = 0; i < 4; i++) { 
        window.particles.push({ 
            x: x + (Math.random() * 36 - 18), y: y, 
            vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 2 - 0.2, 
            life: 22, maxLife: 22, color: "rgba(189, 195, 199, 0.4)", 
            size: Math.random() * 8 + 5, isGroundDust: true 
        }); 
    } 
};

window.spawnCustomObj = function(x, y, vx, vy, textOrEmoji, color, font, duration, isSpinning = false, bounceGround = true) { 
    window.customObjs.push({ 
        x: x, y: y, vx: vx || 0, vy: vy || 0, 
        text: textOrEmoji || "🔥", color: color || "#fff", 
        font: font || "22px Arial", 
        life: duration || 45, maxLife: duration || 45, 
        spin: isSpinning, ang: 0, bounceGround: bounceGround 
    }); 
};

window.spawnInk = function(x, y, color) { window.spawnParticles(x, y, color, false); };
window.spawnForegroundDebris = function(x, y) { window.spawnDust(x, y); };
window.spawnLensFlare = function(x, y, color, scale) { 
    window.lensFlares.push({x: x, y: y, color: color || "#00f3ff", scale: Math.min(scale || 1.2, 2.2), life: 20, maxLife: 20}); 
};
window.spawnMangaSFX = function() {};

window.triggerCinematic = function(caster, callback) { 
    window.cinematicTimer = 30; 
    window.cinematicCaster = caster; 
    window.cinematicCallback = callback; 
    window.playSound(400, 'sine', 0.35, 0.3, false); 
};

window.spawnAura = function(x, y, color, radius, duration) { 
    window.auras.push({ x: x, y: y, color: color || "#00f3ff", r: Math.min(radius || 65, 110), life: duration || 20, maxLife: duration || 20 }); 
};

window.spawnLaser = function(x, y, isRight, color, width, duration, angle = 0) { 
    window.lasers.push({ x: x, y: y, isRight: isRight, color: color || "#00f3ff", width: Math.min(width || 28, 65), life: duration || 18, maxLife: duration || 18, angle: angle }); 
};

window.focusCinematic = function(frames, color = "#ffffff") { 
    window.screenFlash = Math.min(0.65, (frames || 15) * 0.03); 
    window.screenFlashColor = color;
};
window.applyFilter = function(type, frames) { window.screenFilter = type; window.filterTimer = Math.min(frames, 20); };

window.triggerTimeStop = function(frames, caster) { 
    window.timeStopTimer = Math.min(frames || 55, 90);
    window.timeStopCaster = caster;
    window.invertFrames = 12;
    window.playSound(120, 'square', 0.6, 0.7, true); 
    window.shakeScreen(10, 6); 
    if (caster) window.spawnSpaceRipple(caster.x, caster.y - 40, "#00f3ff");
};

window.spawnGlassShatter = function(x, y) { 
    window.playSound(600, 'sawtooth', 0.45, 0.75, true); 
    window.shakeScreen(10, 6);
    window.spawnSpaceRipple(x, y, "#00f3ff");
    window.spawnParticles(x, y, "rgba(100, 255, 255, 0.9)", true);
    window.impactAberration = 6;
};

window.triggerDimensionShatter = function(x, y, color = "#00f3ff") { 
    if (!window.dimensionCracks) window.dimensionCracks = [];
    let mainPath = [{x: x, y: y}];
    let branches = [];
    let currX = x, currY = y;
    let baseAngle = (Math.random() - 0.5) * Math.PI;
    for (let i = 0; i < 6; i++) {
        baseAngle += (Math.random() - 0.5) * 0.8;
        currX += Math.cos(baseAngle) * (25 + Math.random() * 20);
        currY += Math.sin(baseAngle) * (25 + Math.random() * 20);
        mainPath.push({x: currX, y: currY});
        if (Math.random() < 0.65) {
            let bPath = [{x: currX, y: currY}];
            let bx = currX, by = currY;
            let bAng = baseAngle + (Math.random() > 0.5 ? 0.7 : -0.7);
            for (let j = 0; j < 3; j++) {
                bx += Math.cos(bAng) * 18;
                by += Math.sin(bAng) * 18;
                bPath.push({x: bx, y: by});
            }
            branches.push(bPath);
        }
    }
    window.dimensionCracks.push({ main: mainPath, branches: branches, color: color, life: 32, maxLife: 32 });
    window.spawnGlassShatter(x, y);
};

window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {
    if (!window.envDamage) window.envDamage = [];
    window.envDamage.push({ x: x, y: y, type: type || 'crater', radius: 45 * (scale || 1), isBurning: isBurning, life: 120, cracks: [] });
};

// ==========================================
// 2B. ĐẠI CHIÊU THỨC CAO CẤP
// ==========================================
window.spawnDomain = function(name, bgColor1, bgColor2, symbolEmoji, durationFrames = 140) {
    window.activeDomain = {
        name: name || "LÃNH ĐỊA TỐI THƯỢNG",
        bg1: bgColor1 || "#041b2d",
        bg2: bgColor2 || "#0984e3",
        emoji: symbolEmoji || "🌌",
        life: durationFrames,
        maxLife: durationFrames
    };
    window.focusCinematic(18, bgColor2 || "#00f3ff");
    window.shakeScreen(12, 6);
    window.playSound(140, 'sawtooth', 0.6, 0.8, true);
};

window.spawnClones = function(caster, target, count = 4, dmgPerClone = 15) {
    if (!caster || !target) return;
    for (let i = 0; i < count; i++) {
        let side = (i % 2 === 0) ? -1 : 1;
        let startX = target.x + side * (140 + i * 35);
        window.phantomClones.push({
            caster: caster,
            target: target,
            x: startX,
            y: window.GROUND_Y - (i > 1 ? 70 : 0),
            vx: -side * 16,
            vy: (i > 1 ? 5 : 0),
            scale: caster.scale || 1,
            isFacingRight: side < 0,
            state: (i % 2 === 0) ? 'flying_knee' : 'high_kick',
            color: caster.color || "#00f3ff",
            avatarUrl: caster.avatarUrl,
            drawMethod: caster.drawMethod,
            dmg: dmgPerClone,
            life: 24,
            hasHit: false
        });
    }
};

window.spawnGiantDrop = function(targetX, emojiOrText, color = "#f1c40f", dmg = 80, target = null, caster = null) {
    window.giantDrops.push({
        x: targetX,
        y: -180,
        vy: 22,
        emoji: emojiOrText || "☄️",
        color: color,
        dmg: dmg,
        target: target,
        caster: caster,
        size: 110,
        impacted: false,
        life: 45
    });
    window.playSound(320, 'sine', 0.35, 0.6);
};

window.omniSlash = function(caster, target, hits = 5, totalDmg = 100, color = "#00f3ff") {
    if (!caster || !target) return;
    let dmgPerHit = totalDmg / hits;
    for (let i = 0; i < hits; i++) {
        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            window.spawnFighterAfterimage(caster, color);
            let side = (i % 2 === 0) ? -1 : 1;
            caster.x = Math.max(50, Math.min((window.canvas ? window.canvas.width : 800) - 50, target.x + side * 55));
            caster.y = window.GROUND_Y - (i === hits - 1 ? 0 : Math.random() * 55);
            caster.isFacingRight = (target.x >= caster.x);
            caster.state = (i % 2 === 0) ? 'punch' : 'kick';
            caster.attackTimer = 12;

            window.spawnCrossSlash(target.x, target.y - 40, caster.isFacingRight, color, "#ffffff", 1.5 + (i * 0.15));
            window.takeDamage(target, dmgPerHit, color, i === hits - 1, i === hits - 1, caster.isFacingRight);
            if (i === hits - 1) {
                window.triggerDimensionShatter(target.x, target.y - 40, color);
            }
        }, i * 85);
    }
};

window.spawnObjectStorm = function(centerX, centerY, emojiList, count = 12, color = "#00f3ff", isRainFromSky = false) {
    let list = Array.isArray(emojiList) ? emojiList : [emojiList || "🔥"];
    for (let i = 0; i < count; i++) {
        let pick = list[i % list.length];
        if (isRainFromSky) {
            window.spawnCustomObj(
                centerX + (Math.random() - 0.5) * 360,
                -40 - Math.random() * 180,
                (Math.random() - 0.5) * 4,
                10 + Math.random() * 8,
                pick, color, "bold 24px Arial", 55, true, true
            );
        } else {
            window.spawnCustomObj(
                centerX + (Math.random() - 0.5) * 70,
                centerY - 40 + (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 14,
                -Math.random() * 14 - 4,
                pick, color, "bold 20px Arial", 45, true, true
            );
        }
    }
};

// ==========================================
// 2C. AI SKILL INTERPRETER
// ==========================================
window.UniversalSkillEngine = {
    executeFromDescription: function(caster, target, baseDmg, descText, customSkillName) {
        if (!caster || !target) return;
        let text = (descText || "").toLowerCase();
        let col = caster.color || "#00f3ff";
        let sName = customSkillName || (caster.skill && caster.skill.name) || "TUYỆT KỸ TỐI THƯỢNG";

        caster.state = 'cast';
        caster.attackTimer = 38;
        caster.vx = 0;
        caster.isFacingRight = (target.x >= caster.x);

        let emojiMatches = (descText || "").match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu);
        let mainEmoji = (emojiMatches && emojiMatches.length > 0) ? emojiMatches[0] : (caster.weaponIcon || "⚡");

        window.floatingTexts.push({
            x: caster.x, y: caster.y - 92,
            text: `${mainEmoji} ${sName.toUpperCase()}!`,
            color: col, alpha: 1.0, vx: 0, vy: -1.4,
            font: "900 20px Arial", life: 48, scale: 1.15, targetScale: 1.0, noGravity: true
        });

        if (text.includes("lãnh địa") || text.includes("không gian") || text.includes("ma trận") || text.includes("màn hình xanh") || text.includes("bsod") || text.includes("sân")) {
            window.spawnDomain(sName.toUpperCase(), "#050b14", col, mainEmoji, 130);
        }

        if (text.includes("thời gian") || text.includes("đóng băng") || text.includes("time") || text.includes("bất động")) {
            window.triggerTimeStop(50, caster);
        }

        if (text.includes("hố đen") || text.includes("hút") || text.includes("xoáy") || text.includes("trọng lực")) {
            window.spawnBlackHole(target.x, target.y, 75, 55, col);
        }

        if (text.includes("phân thân") || text.includes("hội đồng") || text.includes("đệ tử") || text.includes("bóng")) {
            window.spawnClones(caster, target, 4, baseDmg * 0.6);
        }

        if (text.includes("mưa") || text.includes("bão") || text.includes("tiền") || text.includes("đô la") || text.includes("ném") || (emojiMatches && emojiMatches.length > 0)) {
            let stormIcons = (emojiMatches && emojiMatches.length > 0) ? emojiMatches : ["💵", "⚡", "🔥"];
            window.spawnObjectStorm(target.x, target.y, stormIcons, 12, col, text.includes("mưa"));
        }

        setTimeout(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;

            let executedMainHit = false;

            if (text.includes("liên hoàn") || text.includes("dịch chuyển") || text.includes("tốc biến") || text.includes("chém")) {
                window.omniSlash(caster, target, 5, baseDmg * 3.8, col);
                executedMainHit = true;
            }

            if (text.includes("chưởng") || text.includes("laser") || text.includes("kame") || text.includes("tia") || text.includes("bắn")) {
                window.spawnLaser(caster.x, caster.y - 40, caster.isFacingRight, col, 42, 24);
                window.triggerDimensionShatter(target.x, target.y - 40, col);
                window.takeDamage(target, baseDmg * 3.6, col, true, true, caster.isFacingRight);
                executedMainHit = true;
            }

            if (text.includes("khổng lồ") || text.includes("đè") || text.includes("thiên thạch") || text.includes("bàn tay") || text.includes("giáng") || text.includes("rơi")) {
                window.spawnGiantDrop(target.x, mainEmoji, col, baseDmg * 3.8, target, caster);
                executedMainHit = true;
            }

            if (text.includes("sét") || text.includes("lôi") || text.includes("điện")) {
                window.spawnSkyLightning(target.x, window.GROUND_Y, col);
                window.takeDamage(target, baseDmg * 3.5, col, true, false, caster.isFacingRight);
                executedMainHit = true;
            }

            if (text.includes("hồi máu") || text.includes("chữa") || text.includes("khiên")) {
                let healAmt = Math.floor(caster.maxHp * 0.25);
                caster.hp = Math.min(caster.maxHp, caster.hp + healAmt);
                caster.shield = Math.floor(caster.maxHp * 0.2);
                window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: `💚 +${healAmt} HP & SHIELD!`, color: "#2ed573", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 45, noGravity: true });
            }

            if (!executedMainHit) {
                window.shakeScreen(12, 8);
                window.spawnSkyLightning(target.x, window.GROUND_Y, col);
                window.spawnCrossSlash(target.x, target.y - 40, caster.isFacingRight, col, "#ffffff", 3.2);
                window.triggerDimensionShatter(target.x, target.y - 40, col);
                window.takeDamage(target, baseDmg * 4.0, col, true, true, caster.isFacingRight);
                window.impactAberration = 6;
            }
        }, 280);
    },

    upgradeAllCharacters: function() {
        if (!window.classStats) return;
        for (let id in window.classStats) {
            let ch = window.classStats[id];
            if (!ch || ch._skillUpgraded) continue;
            ch._skillUpgraded = true;
            let promptText = ch.skillPrompt || ch.ultimateDescription || (ch.skill && ch.skill.description);
            if (promptText && typeof ch.executeUltimate !== 'function') {
                ch.executeUltimate = function(caster, target, baseDmg) {
                    window.UniversalSkillEngine.executeFromDescription(caster, target, baseDmg, promptText, ch.skillName || (ch.skill && ch.skill.name));
                };
            }
        }
    }
};

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null; 
    let closest = null; 
    let minDist = Infinity;
    for (let i = 0; i < targetsArray.length; i++) { 
        if (!targetsArray[i] || targetsArray[i].hp <= 0) continue; 
        let d = Math.abs(source.x - targetsArray[i].x); 
        if (d < minDist) { minDist = d; closest = targetsArray[i]; } 
    }
    return closest;
};

window.syncAllFightersFacing = function() {
    if (!window.p1) return;
    let allFighters = [window.p1].concat(window.enemies || []);
    allFighters.forEach(f => {
        if (!f || f.hp <= 0 || f.state === 'ko_falling' || f.state === 'dead') return;
        let targetGroup = f.isPlayer ? window.enemies : [window.p1];
        let closest = window.getClosestEnemy(f, targetGroup);
        if (closest && closest.hp > 0) {
            let dx = closest.x - f.x;
            if (Math.abs(dx) > 1) {
                f.isFacingRight = (dx > 0);
            }
        }
    });
};

// ==========================================
// 3. DAMAGE SYSTEM + MIRACLE COMEBACK & COMBO BREAKER
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    window.syncAllFightersFacing();
    let wasInAir = !target.onGround || target.y < window.GROUND_Y - 5;
    let wasBlocking = target.state === 'block';

    // 1. PERFECT EVADE
    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 16) {
            window.playSound(800, 'sine', 0.4, 0.8, true); 
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "⚡ EVADED!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 38, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            window.spawnParticles(target.x, target.y - 40, "#00f3ff", true);
            window.spawnSpaceRipple(target.x, target.y - 40, "#00f3ff");
            window.spawnFighterAfterimage(target, "#00f3ff");
            target.stamina = Math.min(100, target.stamina + 35); 
            let minX = (window.WALL_PADDING || 40) + 10;
            let maxX = (window.canvas ? window.canvas.width : 800) - minX;
            target.x = Math.max(minX, Math.min(maxX, target.x + (target.isFacingRight ? -85 : 85))); 
            target.iFrames = 26; 
            window.syncAllFightersFacing();
            return; 
        }
    }

    // 2. COMBO BREAKER
    target.consecutiveHitsTaken = (target.consecutiveHitsTaken || 0) + 1;
    target.lastHitResetTimer = 45;
    let hpRatio = target.hp / (target.maxHp || 100);
    if (target.consecutiveHitsTaken >= 5 && hpRatio < 0.65 && (!target.breakerCooldown || target.breakerCooldown <= 0) && Math.random() < 0.42) {
        target.consecutiveHitsTaken = 0;
        target.breakerCooldown = 180;
        target.hitStun = 0;
        target.stunTimer = 0;
        target.iFrames = 28;
        target.state = 'high_kick';
        target.vy = -7;
        target.onGround = false;
        target.attackTimer = 16;
        target.stamina = Math.min(100, target.stamina + 30);

        window.playSound(520, 'sawtooth', 0.35, 0.85, true);
        window.spawnSpaceRipple(target.x, target.y - 40, "#00f3ff");
        window.spawnSkyLightning(target.x, window.GROUND_Y, "#00f3ff");
        window.floatingTexts.push({ 
            x: target.x, y: target.y - 90, text: "⚡ COMBO BREAKER!", color: "#00f3ff", 
            alpha: 1.0, vx: 0, vy: -1.4, font: "bold 16px Arial", life: 42, 
            scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        let allFighters = [window.p1].concat(window.enemies);
        allFighters.forEach(e => {
            if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 165) {
                e.vx = (e.x >= target.x ? 1 : -1) * 11.5;
                e.vy = -6;
                e.onGround = false;
                e.state = 'hurt';
                e.hitStun = 28;
                window.spawnDust(e.x, window.GROUND_Y);
            }
        });
        window.syncAllFightersFacing();
        return;
    }

    let finalDmg = amount;

    // 3. BLOCK, PARRY & GUARD CRUSH
    if (target.state === 'block') { 
        if (target.stamina < 15) {
            target.stamina = 0; target.state = 'stunned'; target.stunTimer = 85; target.hitStun = 85; 
            window.spawnParticles(target.x, target.y - 40, "#ff003c", true); 
            window.triggerDimensionShatter(target.x, target.y - 40, "#ff003c");
            window.floatingTexts.push({ x: target.x, y: target.y - 85, text: "💔 GUARD CRUSH!", color: "#ff003c", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 45, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
        } 
        else if (target.attackTimer >= 20) { 
            window.playSound(650, 'triangle', 0.4, 0.85, true); 
            window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
            window.spawnSpaceRipple(target.x, target.y - 40, "#00ffff");
            window.spawnLightning(target.x, target.y - 40, "#00ffff", 28, 4);
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PARRY COUNTER!", color: "#00ffff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            target.stamina = Math.min(100, target.stamina + 35); 
            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => { 
                if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 145) { 
                    e.state = 'hurt'; e.hitStun = 45; e.vx = (e.x >= target.x ? 10 : -10); 
                    e.vy = -5; e.onGround = false;
                    window.spawnDust(e.x, e.y); 
                } 
            });
            window.syncAllFightersFacing();
            return;
        } else { 
            target.stamina -= finalDmg * 0.5; 
            finalDmg *= 0.2; 
        }
    }
    
    // 4. SHIELD ABSORPTION
    if (target.shield > 0) { 
        target.shield -= finalDmg; 
        if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; } 
        window.playSound(300, 'sine', 0.2, 0.4, true); 
        window.spawnParticles(target.x, target.y - 40, "#3498db");
    }

    // 5. DAMAGE CALCULATION & MIRACLE 1 HP SURVIVAL
    if (finalDmg > 0) {
        if (wasInAir && !wasBlocking) {
            finalDmg *= 1.22;
        }

        if (target.isPlayer) window.uiShakeP1 = 10;
        else window.uiShakeP2 = 10;

        let canMiracle = !target.miracleUsed;
        if (canMiracle && (target.hp - finalDmg <= 0) && Math.random() < 0.82) {
            target.miracleUsed = true;
            target.hp = Math.floor(target.maxHp * 0.16) + 1;
            target.shield = Math.floor(target.maxHp * 0.12);
            target.stamina = 100;
            target.iFrames = 40;
            target.hitStun = 0;
            target.stunTimer = 0;
            target.state = 'dragon_uppercut';
            target.vy = -8;
            target.onGround = false;
            target.attackTimer = 20;

            let miracleColor = target.isPlayer ? "#f1c40f" : "#ff003c";
            window.playSound(150, 'sawtooth', 0.7, 0.9, true);
            window.shakeScreen(10, 6);
            window.spawnSkyLightning(target.x, window.GROUND_Y, miracleColor);
            window.triggerDimensionShatter(target.x, target.y - 45, miracleColor);
            window.spawnCrossSlash(target.x, target.y - 40, target.isFacingRight, miracleColor, "#ffffff", 1.7);

            window.floatingTexts.push({ 
                x: target.x, y: target.y - 98, 
                text: "🔥 MIRACLE 1 HP! AWAKENING!", 
                color: miracleColor, alpha: 1.0, vx: 0, vy: -1.2, 
                font: "bold 17px Arial", life: 65, 
                scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
            });

            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => {
                if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 180) {
                    e.vx = (e.x >= target.x ? 1 : -1) * 12;
                    e.vy = -7;
                    e.onGround = false;
                    e.state = 'hurt';
                    e.hitStun = 32;
                }
            });

            window.syncAllFightersFacing();
            if (typeof window.updateHPUIs === 'function') window.updateHPUIs();
            return;
        }

        target.hp -= finalDmg; 
        if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥-${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        
        let textVx = (attackerDirRight ? 1 : -1) * (Math.random() * 3.5 + 2); 
        let textVy = -5 - Math.random() * 2.5; 
        
        window.floatingTexts.push({ 
            x: target.x + (Math.random() * 20 - 10), 
            y: target.y - 55, 
            text: dmgText, 
            color: color || (isCrit ? "#ff9f43" : "#ffffff"), 
            alpha: 1.0, vx: textVx, vy: textVy, 
            font: isCrit ? "bold 18px Arial, sans-serif" : "bold 15px Arial, sans-serif", 
            life: 38, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0 
        });
        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);

        let sparkCount = isCrit ? 7 : 3; 
        let baseDirX = attackerDirRight ? 1 : -1;
        for (let i = 0; i < sparkCount; i++) { 
            let vx = baseDirX * (Math.random() * 14 + 4); 
            let vy = (Math.random() - 0.5) * 12 - 3; 
            window.impactSparks.push({ x: target.x, y: target.y - 40, vx: vx, vy: vy, life: 18 + Math.random() * 10, maxLife: 28, color: color || "#f1c40f", scale: 1 }); 
        }

        if (isCrit) {
            window.spawnLightning(target.x, target.y - 40, color || "#f1c40f", 30, 4);
            window.spawnSpaceRipple(target.x, target.y - 40, color || "#f1c40f");
            if (!window.isCinematicActive) {
                window.targetZoom = 1.06;
                setTimeout(() => { if (!window.isCinematicActive) window.targetZoom = 1.0; }, 120);
            }
        }

        if (target.hp > 0 && wasInAir && !wasBlocking && !target.slammedDown) {
            target.vy = isCrit ? -8.5 : -6.5; 
            target.onGround = false;
            window.spawnLightning(target.x, target.y - 45, "#00f3ff", 24, 3);
        }

        if (target.superArmor <= 0 && target.state !== 'stunned') { 
            target.state = 'hurt'; 
            target.hitStun = isCrit ? 22 : 14; 
            target.attackTimer = 0; 
            target.comboStep = 0; 
        }
        if (wallBounce) { target.vx = attackerDirRight ? 9.5 : -9.5; } 
        window.syncAllFightersFacing();
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        // 6. K.O FINISH VFX
        if (target.hp <= 0) {
            window.spawnBlackFlash(target.x, target.y - 40);
            window.spawnSkyLightning(target.x, window.GROUND_Y, "#ff003c");
            window.triggerDimensionShatter(target.x, target.y - 40, "#ff003c");
            window.floatingTexts.push({ 
                x: target.x, y: target.y - 95, text: "💀 K.O!", color: "#ff4757", 
                alpha: 1.0, vx: 0, vy: -0.6, font: "italic 900 22px 'Arial Black', Impact", 
                life: 70, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
            });
            window.shakeScreen(12, 6);
            window.playSound(85, 'square', 1.0, 0.75, true); 
            target.state = 'ko_falling'; 
            target.koTimer = 100; 
            target.vy = -10; 
            target.onGround = false;
        } else if (isCrit) { 
            window.shakeScreen(6, 4);
            window.playSound(180, 'square', 0.25, 0.55, true); 
        } else { 
            window.playSound(250, 'sine', 0.14, 0.3, true); 
        }
    }
};

// ==========================================
// 4. HỆ THỐNG HYPER COMBO 8 BƯỚC + Z-VANISH AIR CHASE + PHANTOM BARRAGE
// ==========================================
window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) { attacker.state = 'jab'; attacker.attackTimer = 10; return; }

    attacker.isFacingRight = (target.x >= attacker.x);
    target.isFacingRight = (attacker.x > target.x);

    let MathDist = Math.abs(attacker.x - target.x); 
    let reach = 90 * (attacker.scale || 1); 
    let dir = attacker.isFacingRight ? 1 : -1;
    let targetInAir = !target.onGround && target.y < window.GROUND_Y - 22;

    // A. Z-VANISH AIR CHASE (Nếu đối thủ vừa bị hất tung lên không -> Tốc biến chéo lên không trung truy kích!)
    if (targetInAir && attacker.onGround && (attacker.comboStep >= 4 || MathDist > 65) && Math.random() < 0.78) {
        window.spawnFighterAfterimage(attacker, "#00f3ff");
        window.spawnLightning(attacker.x, attacker.y - 40, "#00f3ff", 28, 4);
        let minX = (window.WALL_PADDING || 40) + 15;
        let maxX = (window.canvas ? window.canvas.width : 800) - minX;
        attacker.x = Math.max(minX, Math.min(maxX, target.x - dir * 42));
        attacker.y = Math.max(120, target.y + 8);
        attacker.vy = -7.5;
        attacker.vx = dir * 2.5;
        attacker.onGround = false;
        window.spawnFighterAfterimage(attacker, "#f1c40f");
        window.spawnHitRing(attacker.x, attacker.y - 35, 0, "#00f3ff", 65);
        window.floatingTexts.push({ x: attacker.x, y: attacker.y - 75, text: "⚡ Z-VANISH!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 26, noGravity: true });
        MathDist = Math.abs(attacker.x - target.x);
    }

    // B. ACROBATIC GAP CLOSERS (Khi ở xa)
    if (MathDist > reach + 15) { 
        if (MathDist < 245 && Math.random() < 0.62) {
            if (Math.random() < 0.5) {
                attacker.state = Math.random() < 0.5 ? 'high_kick' : 'spinning_heel';
                attacker.vy = -9.0;
                attacker.vx = dir * Math.min((attacker.currentSpeed || 5) * 2.2, (MathDist - 40) / 10);
                attacker.onGround = false;
                attacker.attackTimer = 18;
                window.spawnSpaceRipple(attacker.x, attacker.y - 30, "#00f3ff");
                window.spawnFighterAfterimage(attacker, "#00f3ff");
                window.floatingTexts.push({ x: attacker.x, y: attacker.y - 80, text: "🦅 FLYING KICK!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 28, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                attacker.pendingHit = {
                    target: target, delay: 9, isFinisher: false, isLauncher: false, isMultiHit: false, isFlyingKick: true,
                    moveName: attacker.state, baseDmg: 15 * (attacker.currentDmgMod || attacker.dmgMod || 1)
                };
                return;
            } else {
                attacker.state = 'low_kick';
                attacker.vx = dir * Math.min((attacker.currentSpeed || 5) * 2.6, (MathDist - 35) / 8);
                attacker.attackTimer = 15;
                window.spawnDust(attacker.x, window.GROUND_Y);
                window.spawnFighterAfterimage(attacker, "#f1c40f");
                window.floatingTexts.push({ x: attacker.x, y: attacker.y - 75, text: "⚡ SLIDE SWEEP!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 28, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                attacker.pendingHit = {
                    target: target, delay: 7, isFinisher: false, isLauncher: false, isMultiHit: false, isSlideSweep: true,
                    moveName: 'low_kick', baseDmg: 13 * (attacker.currentDmgMod || attacker.dmgMod || 1)
                };
                return;
            }
        }
        attacker.vx = dir * Math.min((attacker.currentSpeed || 5) * 2.8, Math.max(4, (MathDist - 40) / 6)); 
        attacker.state = 'dash'; 
        attacker.attackTimer = 11; 
        window.spawnDust(attacker.x, attacker.y); 
        window.spawnFighterAfterimage(attacker);
        return; 
    }

    // C. CÂY COMBO VÕ THUẬT & LIÊN HOÀN KHÔNG CHIẾN
    let step = attacker.comboStep || 0;
    let selectedMove = 'jab';
    let isFinisher = false;
    let isLauncher = false;
    let isMultiHit = false;
    let isSlideSweep = false;
    let isMeteorSlam = false;
    let isFlyingKick = false;
    let didCrossUp = false;

    if (targetInAir && step >= 4 && Math.random() < 0.80) {
        if (step >= 6) {
            selectedMove = 'axe_kick';
            isMeteorSlam = true;
            attacker.vy = -6;
            attacker.onGround = false;
            attacker.comboStep = 0;
        } else {
            selectedMove = Math.random() < 0.5 ? 'spinning_heel' : 'asura_strike';
            isMultiHit = true;
            attacker.vy = -8.0;
            attacker.onGround = false;
        }
    } else if (step === 0) {
        selectedMove = Math.random() < 0.5 ? 'jab' : 'palm_strike';
    } else if (step === 1) {
        selectedMove = Math.random() < 0.5 ? 'cross' : 'hook';
    } else if (step === 2) {
        selectedMove = Math.random() < 0.5 ? 'low_kick' : 'teep_kick';
        isSlideSweep = true;
    } else if (step === 3) {
        selectedMove = Math.random() < 0.55 ? 'knee_strike' : 'elbow_strike';
        if (selectedMove === 'knee_strike' && attacker.onGround) {
            attacker.vy = -5.5;
            attacker.onGround = false;
        }
    } else if (step === 4) {
        selectedMove = Math.random() < 0.5 ? 'uppercut' : 'high_kick';
        isLauncher = true;
        if (attacker.onGround) {
            attacker.vy = -7.5;
            attacker.onGround = false;
        }
    } else if (step === 5) {
        selectedMove = Math.random() < 0.5 ? 'dempsey_roll' : 'asura_strike';
        isMultiHit = true;
        // Kích hoạt mưa kình lực Phantom Barrage!
        window.spawnPhantomBarrage(attacker, target, attacker.color || "#00f3ff", 9);
    } else if (step === 6) {
        selectedMove = Math.random() < 0.5 ? 'spinning_heel' : 'axe_kick';
        if (selectedMove === 'axe_kick') {
            isMeteorSlam = true;
            if (attacker.onGround) { attacker.vy = -8.0; attacker.onGround = false; }
        } else {
            isFlyingKick = true;
            if (attacker.onGround) { attacker.vy = -6.5; attacker.onGround = false; }
        }
    } else {
        if (Math.random() < 0.45) {
            didCrossUp = true;
            window.spawnFighterAfterimage(attacker, "#00f3ff");
            window.spawnLightning(attacker.x, attacker.y - 40, "#00f3ff", 25, 3);
            let wasLeftOfTarget = (attacker.x <= target.x);
            let minX = (window.WALL_PADDING || 40) + 15;
            let maxX = (window.canvas ? window.canvas.width : 800) - minX;
            let newX = wasLeftOfTarget ? (target.x + 58) : (target.x - 58);
            if (newX >= minX && newX <= maxX) {
                attacker.x = newX;
            }
            attacker.isFacingRight = (target.x >= attacker.x);
            target.isFacingRight = (attacker.x > target.x);
            dir = attacker.isFacingRight ? 1 : -1;
            window.spawnLightning(attacker.x, attacker.y - 40, "#00f3ff", 25, 3);
            window.floatingTexts.push({ x: attacker.x, y: attacker.y - 85, text: "💨 FLASH CROSS-UP!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
        }
        let finishers = ['dragon_uppercut', 'one_inch_punch', 'asura_strike', 'shoulder_bash'];
        selectedMove = finishers[Math.floor(Math.random() * finishers.length)];
        isFinisher = true;
        attacker.comboStep = 0; 
    }

    if (!isFinisher && !isMeteorSlam && (attacker.isRage || attacker.isUnderdog) && step >= 3 && Math.random() < 0.38) {
        let clutchFinishers = ['dragon_uppercut', 'one_inch_punch', 'asura_strike'];
        selectedMove = clutchFinishers[Math.floor(Math.random() * clutchFinishers.length)];
        isFinisher = true;
        attacker.comboStep = 0;
    }

    attacker.state = selectedMove; 
    attacker.attackTimer = isFinisher ? 24 : (isMultiHit ? 22 : 14); 
    
    if (didCrossUp) {
        attacker.vx = dir * 1.5;
    } else if (isSlideSweep) {
        attacker.vx = dir * 5.0;
        window.spawnDust(attacker.x, window.GROUND_Y);
    } else if (isFlyingKick || isMeteorSlam) {
        attacker.vx = dir * 3.8;
    } else {
        attacker.vx = dir * (isFinisher ? 4.2 : (isLauncher ? 3.0 : 2.0)); 
    }
    
    if (isFinisher || isMultiHit || isLauncher || isSlideSweep || isMeteorSlam || isFlyingKick) {
        window.spawnFighterAfterimage(attacker, isFinisher ? "#ff4757" : "#00f3ff");
        if (isFinisher || isLauncher) window.spawnAura(attacker.x, window.GROUND_Y, isFinisher ? "#ff4757" : "#00f3ff", 55, 15);
    }

    attacker.pendingHit = {
        target: target,
        delay: isFinisher ? 8 : (isMultiHit ? 5 : 5),
        isFinisher: isFinisher,
        isLauncher: isLauncher,
        isMultiHit: isMultiHit,
        isSlideSweep: isSlideSweep,
        isMeteorSlam: isMeteorSlam,
        isFlyingKick: isFlyingKick,
        moveName: selectedMove,
        baseDmg: 12 * (attacker.currentDmgMod || attacker.dmgMod || 1)
    };
};

// ==========================================
// 5. CORE UPDATE (XỬ LÝ GROUND BOUNCE, WALL BOUNCE, BLACK FLASH & VFX)
// ==========================================
window.update = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx || !window.p1 || window.isLoading) return; 

    if (window.matchTimer <= 1) {
        window.hitRings = [];
        window.phantomFists = [];
        if (window.UniversalSkillEngine) window.UniversalSkillEngine.upgradeAllCharacters();
    }

    window.actionCamOffsetX = 0; window.actionCamOffsetY = 0; window.actionCamSkew = 0; 
    window.cameraTilt = 0; window.targetTilt = 0; window.camOrbitAngle = 0; window.targetCamOrbitAngle = 0; window.isSpinningCam = false;

    window.syncAllFightersFacing();

    // 1. Cập nhật thời gian sống của toàn bộ VFX & Hit-Rings V9.0
    window.lightningArcs.forEach(l => l.life--); window.lightningArcs = window.lightningArcs.filter(l => l.life > 0);
    window.energyPillars.forEach(p => { p.life--; p.scaleY += (1 - p.scaleY) * 0.22; }); window.energyPillars = window.energyPillars.filter(p => p.life > 0);
    window.blackHoles.forEach(b => b.life--); window.blackHoles = window.blackHoles.filter(b => b.life > 0);
    window.spaceRipples.forEach(r => { r.r += 11; r.life--; }); window.spaceRipples = window.spaceRipples.filter(r => r.life > 0);
    window.auras.forEach(a => a.life--); window.auras = window.auras.filter(a => a.life > 0);
    window.lasers.forEach(l => l.life--); window.lasers = window.lasers.filter(l => l.life > 0);
    window.lensFlares.forEach(lf => lf.life--); window.lensFlares = window.lensFlares.filter(lf => lf.life > 0);
    if (window.dimensionCracks) { window.dimensionCracks.forEach(c => c.life--); window.dimensionCracks = window.dimensionCracks.filter(c => c.life > 0); }
    if (window.hitRings) { window.hitRings.forEach(hr => { hr.r += (hr.maxR - hr.r) * 0.28; hr.life--; }); window.hitRings = window.hitRings.filter(hr => hr.life > 0); }
    if (window.phantomFists) { window.phantomFists.forEach(pf => { pf.x += pf.vx; pf.y += pf.vy; pf.life--; }); window.phantomFists = window.phantomFists.filter(pf => pf.life > 0); }
    if (window.impactAberration > 0) window.impactAberration--;
    if (window.invertFrames > 0) window.invertFrames--;
    if (window.timeStopTimer > 0) window.timeStopTimer--;

    if (window.activeDomain) {
        window.activeDomain.life--;
        if (window.activeDomain.life <= 0) window.activeDomain = null;
    }

    for (let i = window.phantomClones.length - 1; i >= 0; i--) {
        let cl = window.phantomClones[i];
        cl.x += cl.vx;
        cl.y += cl.vy;
        if (cl.y > window.GROUND_Y) cl.y = window.GROUND_Y;
        cl.life--;
        if (!cl.hasHit && cl.target && cl.target.hp > 0 && Math.abs(cl.x - cl.target.x) < 55) {
            cl.hasHit = true;
            window.spawnSlash(cl.target.x, cl.target.y - 38, cl.isFacingRight, cl.color, true, 1.4, (Math.random() - 0.5) * 0.8);
            window.takeDamage(cl.target, cl.dmg, cl.color, false, false, cl.isFacingRight);
        }
        if (cl.life <= 0) window.phantomClones.splice(i, 1);
    }

    for (let i = window.giantDrops.length - 1; i >= 0; i--) {
        let gd = window.giantDrops[i];
        if (!gd.impacted) {
            gd.y += gd.vy;
            if (gd.y >= window.GROUND_Y - 15) {
                gd.y = window.GROUND_Y - 15;
                gd.impacted = true;
                window.shakeScreen(15, 8);
                window.playSound(95, 'sawtooth', 0.65, 0.85, true);
                window.spawnEnvDamage(gd.x, window.GROUND_Y, 'crater', 1.5, true);
                window.triggerDimensionShatter(gd.x, window.GROUND_Y - 50, gd.color);
                window.spawnEnergyPillar(gd.x, window.GROUND_Y, gd.color, 65, 22);
                if (gd.target && gd.target.hp > 0 && Math.abs(gd.target.x - gd.x) < 160) {
                    window.takeDamage(gd.target, gd.dmg, gd.color, true, true, gd.caster ? gd.caster.isFacingRight : true);
                }
            }
        } else {
            gd.life--;
            if (gd.life <= 0) window.giantDrops.splice(i, 1);
        }
    }

    for (let i = window.customObjs.length - 1; i >= 0; i--) { 
        let obj = window.customObjs[i]; 
        obj.x += obj.vx; 
        obj.y += obj.vy; 
        obj.vy += window.GRAVITY * 0.45; 
        if (obj.bounceGround && obj.y >= window.GROUND_Y - 6) {
            obj.y = window.GROUND_Y - 6;
            obj.vy *= -0.45;
            obj.vx *= 0.75;
        }
        if (obj.spin) obj.ang += 0.22; 
        obj.life--; 
        if (obj.life <= 0) window.customObjs.splice(i, 1); 
    }

    let hudEls = document.querySelectorAll(".player-hud");
    if (window.uiShakeP1 > 0) { window.uiShakeP1--; if (hudEls[0]) hudEls[0].style.transform = `translate(${(Math.random()*4-2)}px, ${(Math.random()*4-2)}px)`; } else if (hudEls[0]) { hudEls[0].style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; if (hudEls[1]) hudEls[1].style.transform = `translate(${(Math.random()*4-2)}px, ${(Math.random()*4-2)}px)`; } else if (hudEls[1]) { hudEls[1].style.transform = "none"; }

    if (window.gameOver) { window.matchEndTimer = (window.matchEndTimer || 0) + 1; }
    if (window.introTimer > 0) { window.introTimer -= 1; }
    if (!window.gameOver && window.introTimer <= 0) { window.matchTimer++; }

    window.globalWind = Math.sin(Date.now() / 2500) * 1.4;

    if (window.shakeTime > 0) window.shakeTime--; 
    if (window.screenFlash > 0) { window.screenFlash -= 0.06; if (window.screenFlash <= 0.001) window.screenFlash = 0; }
    if (window.cinematicTimer > 0) { 
        window.cinematicTimer--; 
        if (window.cinematicTimer === 0 && window.cinematicCallback) { 
            try { window.cinematicCallback(); } catch(e) {} 
            window.cinematicCallback = null; 
        } 
    }

    let allFighters = [window.p1].concat(window.enemies);
    let activeBlackHole = window.blackHoles.length > 0 ? window.blackHoles[0] : null;

    if (activeBlackHole && !window.gameOver) {
        allFighters.forEach(f => {
            if (f && f.hp > 0) {
                let dx = activeBlackHole.x - f.x;
                let dist = Math.abs(dx);
                if (dist < 280 && dist > 15) {
                    f.x += Math.sign(dx) * 2.2;
                }
                if (dist < 80 && window.matchTimer % 18 === 0) {
                    window.takeDamage(f, 9, activeBlackHole.color || "#9b59b6", false, false, dx > 0);
                }
            }
        });
    }

    // Projectiles & Meteors
    for (let i = window.projectiles.length - 1; i >= 0; i--) {
        let proj = window.projectiles[i]; 
        proj.x += proj.vx; 
        proj.y += proj.vy;
        if (proj.isMeteor) {
            if (window.particles.length < MAX_PARTICLES) {
                window.particles.push({ x: proj.x + (Math.random() - 0.5) * 8, y: proj.y, vx: 0, vy: -2, life: 14, maxLife: 14, color: "#f1c40f", size: Math.random() * 3.5 + 2 });
            }
            if (proj.y >= window.GROUND_Y) {
                window.shakeScreen(10, 5); 
                window.playSound(200, 'sawtooth', 0.45, 0.55, true);
                if (typeof window.spawnEnvDamage === 'function') window.spawnEnvDamage(proj.x, window.GROUND_Y, 'crater', 1.0, true);
                if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: proj.x, y: window.GROUND_Y, r: 10, maxR: 150, color: "#e74c3c", alpha: 0.9, speed: 12});
                if (window.particles.length < MAX_PARTICLES) { 
                    for (let p = 0; p < 12; p++) { 
                        window.particles.push({ x: proj.x + (Math.random() - 0.5) * 45, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 7 - 4, life: 32, maxLife: 32, color: Math.random() > 0.4 ? "#f1c40f" : "#ff4757", size: Math.random() * 5 + 3, isAuraFlame: true }); 
                    } 
                }
                allFighters.forEach(fighter => { 
                    if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 95 && fighter.y >= window.GROUND_Y - 55) { 
                        window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false, fighter.x > proj.x); 
                        fighter.vx = Math.sign(fighter.x - proj.x) * 10; 
                        fighter.vy = -6; fighter.onGround = false;
                    } 
                }); 
                window.projectiles.splice(i, 1);
            }
        } else if (proj.target) {
            let dx = proj.x - proj.target.x; 
            let dy = proj.y - (proj.target.y - 35);
            if (Math.sqrt(dx * dx + dy * dy) < proj.radius + 24) { 
                if (proj.onHit) proj.onHit(); 
                window.takeDamage(proj.target, proj.dmg, proj.color || "#e74c3c", false, false, proj.vx > 0); 
                window.projectiles.splice(i, 1); 
            } else if (proj.x < -300 || proj.x > window.canvas.width + 300 || proj.y < -300 || proj.y > window.canvas.height + 300) { 
                window.projectiles.splice(i, 1); 
            }
        } else {
            window.projectiles.splice(i, 1);
        }
    }

    // Active Ground Traps
    for (let i = window.traps.length - 1; i >= 0; i--) { 
        let t = window.traps[i];
        t.life--; 
        if (t.life > 0 && t.damage > 0 && window.matchTimer % 15 === 0) {
            allFighters.forEach(f => {
                if (f && f !== t.owner && f.hp > 0 && Math.abs(f.x - t.x) < t.radius + 15 && f.y >= window.GROUND_Y - 30) {
                    window.takeDamage(f, t.damage, t.color || "#9b59b6", false, false, f.x > t.x);
                }
            });
        }
        if (t.life <= 0) window.traps.splice(i, 1); 
    }
    
    for (let i = window.shockwaves.length - 1; i >= 0; i--) { 
        let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.045; 
        if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); 
    }
    
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { 
        let isp = window.impactSparks[i];
        isp.x += isp.vx; isp.y += isp.vy; isp.vy += window.GRAVITY * 0.6; isp.life--; 
        if (isp.zSpeed) isp.scale *= isp.zSpeed;
        if (isp.life <= 0) window.impactSparks.splice(i, 1); 
    }
    
    for (let i = window.particles.length - 1; i >= 0; i--) { 
        let pt = window.particles[i]; 
        if (activeBlackHole) {
            let dx = activeBlackHole.x - pt.x; let dy = activeBlackHole.y - pt.y; let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 10) { pt.vx += (dx / dist) * 2.5; pt.vy += (dy / dist) * 2.5; }
            pt.life -= 0.5;
        } else if (pt.isCoin) { 
            pt.vy += window.GRAVITY * 0.5; 
            if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } 
        } else if (pt.isRubble) { 
            pt.vy += window.GRAVITY * 0.85; 
            if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.4; pt.vx *= 0.6; } 
        } else if (pt.isAuraFlame) { 
            pt.vy -= 0.4; pt.vx += (Math.random() - 0.5) * 0.6; pt.size *= 0.95; 
        } else if (!pt.isGroundDust) { 
            pt.vy += window.GRAVITY * 0.75; 
        }
        pt.x += pt.vx; pt.y += pt.vy; pt.life--; 
        if (pt.life <= 0) window.particles.splice(i, 1); 
    }

    for (let i = window.slashes.length - 1; i >= 0; i--) { 
        window.slashes[i].life--; 
        if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); 
    }

    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; 
            window.spawnParticles(e.x, e.y, "#fff", true); 
            window.playSound(100, 'sine', 0.5, 0.5, true);
        }
    });
    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { 
        window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -8; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; 
        window.spawnParticles(window.p1.x, window.p1.y, "#fff", true);
    }
    
    let gameContext = { 
        floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, 
        spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, 
        playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, 
        dash: (f, fx, fy) => { f.vx = fx; if (fy) { f.vy = fy; f.onGround = false; } f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnFighterAfterimage(f); window.syncAllFightersFacing(); }, 
        teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if (dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); window.syncAllFightersFacing(); }, 
        addBuff: (f, st, v, fr) => { f.buffs.push({stat: st || f.state, value: v, life: fr, maxLife: fr}); }, 
        setInvulnerable: (f, fr) => { f.iFrames = fr; } 
    };

    // Update Fighters (1 vs 1)
    allFighters.forEach(f => {
        if (!f) return;
        
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; 
            f.vy += window.GRAVITY * 0.5; 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.92; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }

        if (window.timeStopTimer > 0 && window.timeStopCaster && window.timeStopCaster !== f) {
            return;
        }

        if (f.iFrames > 0) f.iFrames--;
        if (f.attackTimer > 0) f.attackTimer--; 
        if (f.hitStun > 0) f.hitStun--; 
        if (f.dashTimer > 0) f.dashTimer--; 
        if (f.aiDelay > 0) f.aiDelay--;
        if (f.breakerCooldown > 0) f.breakerCooldown--;
        if (f.wallDamageCooldown > 0) f.wallDamageCooldown--;
        if (f.lastHitResetTimer > 0) { f.lastHitResetTimer--; if (f.lastHitResetTimer <= 0) f.consecutiveHitsTaken = 0; }
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout <= 0) f.comboStep = 0; }
        if (f.comboTimer > 0) f.comboTimer--; 
        if (f.superArmor > 0) f.superArmor--;
        if (f.comboPopScale && f.comboPopScale > 1.0) f.comboPopScale += (1.0 - f.comboPopScale) * 0.25;
        
        if (f.comboDisplayTimer > 0) { f.comboDisplayTimer--; f.comboAlpha = 1; } 
        else if (f.comboHits > 0) { f.comboAlpha = (f.comboAlpha || 1) - 0.025; if (f.comboAlpha <= 0) { f.comboAlpha = 0; f.comboHits = 0; } }

        if (window.gameOver && f.hp > 0) {
            f.dashTimer = 0; 
            if (f.onGround) { f.vx *= 0.5; if (Math.abs(f.vx) < 0.5) f.vx = 0; }
            if (f.state === 'walk' || f.state === 'dash' || f.state === 'dash_back') f.state = 'idle';
        } else if (f.state === 'idle' && f.onGround) {
            f.x += Math.sin(Date.now() / 80 + f.x) * (f.isRage ? 1.2 : 0.6);
        }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) f.state = 'idle'; }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') f.state = 'idle'; }
        if (f.state === 'idle' || f.state === 'walk') f.iFrames = 0;

        let targetGroup = f.isPlayer ? window.enemies : [window.p1]; 
        let closestTarget = window.getClosestEnemy(f, targetGroup);

        if (closestTarget && closestTarget.hp > 0 && Math.abs(closestTarget.x - f.x) > 1) {
            f.isFacingRight = (closestTarget.x > f.x);
        }

        let myHpPct = f.hp / (f.maxHp || 100);
        let oppHpPct = (closestTarget && closestTarget.maxHp) ? (closestTarget.hp / closestTarget.maxHp) : myHpPct;
        let hpDeficit = Math.max(0, oppHpPct - myHpPct);

        f.isUnderdog = (hpDeficit > 0.18);
        f.isRage = (f.hp > 0 && myHpPct <= 0.30); 
        f.currentSpeed = f.speed || 4; 
        f.currentDmgMod = f.dmgMod || 1; 
        f.dynamicCritChance = (f.critChance || 0.12) + (hpDeficit * 0.45);

        if (window.currentWeather === 'snow') f.currentSpeed *= 0.78;
        else if (window.currentWeather === 'rain') f.currentSpeed *= 1.20;
        else if (window.currentWeather === 'ash') f.currentDmgMod *= 1.25;
        else if (window.currentWeather === 'toxic') {
            f.currentDmgMod *= 0.90;
            if (window.matchTimer % 90 === 0 && f.hp > 5 && !window.gameOver) {
                f.hp -= 1;
                window.particles.push({x: f.x, y: f.y - 30, vx: 0, vy: -1.2, life: 20, maxLife: 20, color: "#2ecc71", size: 4});
            }
        }

        if (f.isUnderdog) {
            f.currentSpeed *= (1 + hpDeficit * 0.35);
            f.currentDmgMod *= (1 + hpDeficit * 0.45);
        }

        if (f.isRage) { 
            f.currentSpeed *= 1.45; 
            f.currentDmgMod *= 1.38; 
            if (window.particles.length < MAX_PARTICLES && Math.random() < 0.5) { 
                let auraColor = f.isPlayer ? "#ff4757" : "#9b59b6"; 
                window.particles.push({ x: f.x + (Math.random() - 0.5) * 45, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1.5, vy: -Math.random() * 6 - 3, life: 30, maxLife: 30, color: auraColor, size: Math.random() * 6 + 3, isAuraFlame: true }); 
            }
            if (Math.random() < 0.06) window.spawnLightning(f.x, f.y - 40, f.isPlayer ? "#ff4757" : "#9b59b6", 24, 3);
        }

        if (!f.onGround && Math.abs(f.vy) > 3 && Math.random() < 0.45) {
            window.spawnFighterAfterimage(f);
        }

        let staminaGain = f.isRage ? 0.65 : (f.regen * 0.25 || 0.09);
        if (f.isUnderdog) staminaGain += hpDeficit * 0.35;
        if (f.hp > 0 && f.stamina < 100) f.stamina += staminaGain; 
        if (f.stamina > 100) f.stamina = 100;

        for (let i = f.buffs.length - 1; i >= 0; i--) { 
            let b = f.buffs[i]; b.life--; 
            if (b.life <= 0) { f.buffs.splice(i, 1); continue; } 
            if (b.stat === 'dmg') f.currentDmgMod += b.value; 
            if (b.stat === 'speed') f.currentSpeed += b.value; 
            if (b.life % 15 === 0 && window.particles.length < MAX_PARTICLES) {
                window.particles.push({ x: f.x + (Math.random() * 20 - 10), y: f.y - 15, vx: 0, vy: -2, life: 12, maxLife: 12, color: "#f1c40f", size: 2.5 });
            }
        }

        let launchedUltimate = false; 

        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x; 
                let absDist = Math.abs(distToTarget); 
                let type = f.classId || "dausi"; 
                let charDef = window.classStats ? (window.classStats[type] || window.classStats[type.toLowerCase()]) : null;
                let isCloseEnough = (absDist < 260) || (charDef && (charDef.skillPrompt || charDef.executeUltimate));
                if (isCloseEnough) {
                    f.isFacingRight = (distToTarget >= 0);
                    closestTarget.isFacingRight = (distToTarget < 0);
                    if (typeof window.useUltimate === 'function') { 
                        window.useUltimate(f, closestTarget); 
                    } else if (charDef && typeof charDef.executeUltimate === 'function') {
                        f.stamina = 0; 
                        let baseDmg = (f.isPlayer ? 50 : 38) * (f.currentDmgMod || 1); 
                        charDef.executeUltimate(f, closestTarget, baseDmg); 
                        f.vx = 0; 
                    }
                    launchedUltimate = true;
                } else { 
                    f.state = 'walk'; 
                    f.vx = Math.sign(distToTarget) * f.currentSpeed * 1.4; 
                    f.attackTimer = 5; 
                    launchedUltimate = true; 
                }
            }
        }

        // 1 VS 1 FIGHTER AI
        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && window.introTimer <= 0 && f.hp > 0) {
            let targetList = f.isPlayer ? window.enemies : [window.p1]; 
            let closest = window.getClosestEnemy(f, targetList);
            if (closest && closest.hp > 0) {
                let dist = closest.x - f.x; f.isFacingRight = dist >= 0; 
                let absDist = Math.abs(dist); 
                let reach = 70 * Math.max(f.scale || 1, closest.scale || 1);
                if (absDist > reach) { 
                    if (absDist < 220 && f.aiDelay <= 0 && Math.random() < 0.35) {
                        f.aiDelay = 9;
                        window.attack(f, targetList);
                    } else {
                        f.vx = Math.sign(dist) * f.currentSpeed; 
                        f.state = 'walk'; 
                        if (Math.random() < 0.08 && f.onGround) window.spawnDust(f.x, f.y);
                    }
                } else {
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isUnderdog ? 3 : (f.isPlayer ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 5) + 5); 
                        let usedSkill = false;
                        if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.1) {
                            f.stamina -= 100; usedSkill = true;
                            f.superArmor = 25;
                            window.triggerCinematic(f, () => {
                                try { f.skill.actionCode3(f, closest, gameContext); if (f.state === 'idle') { f.state = 'cast'; f.attackTimer = 15; } } catch(e) {}
                            });
                        }
                        if (!usedSkill) {
                            let evadeChance = (f.isUnderdog || f.isRage) ? 0.48 : 0.28;
                            if ((closest.attackTimer > 0 || closest.state === 'dash') && Math.random() < evadeChance) {
                                if (Math.random() < 0.45) {
                                    f.state = 'block'; f.attackTimer = 28; f.vx = 0;
                                } else {
                                    f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 12; f.attackTimer = 10;
                                    window.spawnDust(f.x, f.y);
                                    window.spawnFighterAfterimage(f);
                                }
                            } else {
                                if (f.comboTimer > 0 && f.comboStep < 14) f.comboStep++; else f.comboStep = 0; 
                                f.comboTimer = 58; 
                                window.attack(f, targetList);
                            }
                        }
                    }
                }
            } else { 
                f.vx = 0; if (f.state === 'walk') f.state = 'idle'; 
            }
        }

        // GROUND BOUNCE (Đập đất nảy lên nối tiếp Air Combo) & WALL SPLAT PHYSICS
        if (f.state === 'wall_splat') {
            f.vy = 0; f.vx = 0;
            if (f.hitStun < 20) {
                f.state = 'hurt';
                f.vy = -7.5; // Nảy bổng ra giữa sân để đối thủ nối tiếp Combo!
                f.vx = f.x < window.canvas.width / 2 ? 6.5 : -6.5;
                f.onGround = false;
                window.spawnHitRing(f.x, f.y - 35, 1.57, "#ff9f43", 70);
                window.floatingTexts.push({ x: f.x, y: f.y - 65, text: "🔄 WALL BOUNCE!", color: "#ff9f43", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 30, noGravity: true });
            }
        } else {
            f.vy += window.GRAVITY; 
            if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) {
                window.spawnDust(f.x, window.GROUND_Y);
                if (f.slammedDown) {
                    f.slammedDown = false;
                    window.shakeScreen(11, 6);
                    window.spawnSpaceRipple(f.x, window.GROUND_Y, "#ff4757");
                    window.spawnHitRing(f.x, window.GROUND_Y, 0, "#ff4757", 85);
                    window.spawnParticles(f.x, window.GROUND_Y, "#f1c40f", true);
                    for (let r = 0; r < 6; r++) {
                        window.particles.push({ x: f.x + (Math.random() - 0.5) * 30, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 8, vy: -5 - Math.random() * 6, life: 28, maxLife: 28, color: "#7f8c8d", size: Math.random() * 5 + 3, isRubble: true });
                    }
                    // Kích hoạt GROUND BOUNCE nảy bổng lên không trung!
                    f.y = window.GROUND_Y - 2;
                    f.vy = -10.5;
                    f.onGround = false;
                    f.hitStun = 32;
                    window.floatingTexts.push({ x: f.x, y: window.GROUND_Y - 70, text: "☄️ GROUND BOUNCE!", color: "#ff9f43", alpha: 1.0, vx: 0, vy: -1.4, font: "bold 15px Arial", life: 34, noGravity: true });
                }
            }
        }

        f.y += f.vy; 
        if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        
        let friction = (window.currentWeather === 'rain') ? 0.90 : 0.82;
        if (f.dashTimer > 0) { 
            f.vx = f.dashDir * f.currentSpeed * 1.65; 
            if (f.onGround && window.matchTimer % 3 === 0) window.spawnDust(f.x, window.GROUND_Y);
        } else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.state !== 'wall_splat' && f.onGround) { 
            f.vx *= friction; 
        }

        // ANTI-OVERSHOOT COMBAT BRAKE
        if (closestTarget && closestTarget.hp > 0 && f.state !== 'hurt' && f.state !== 'ko_falling') {
            let beforeSide = Math.sign(closestTarget.x - f.x);
            let nextX = f.x + f.vx;
            let minSpacing = 36 * Math.max(f.scale || 1, closestTarget.scale || 1);
            if (beforeSide > 0 && nextX > closestTarget.x - minSpacing) {
                nextX = Math.min(nextX, closestTarget.x - minSpacing);
                if (f.attackTimer > 0 || f.dashTimer > 0) f.vx = 0;
            } else if (beforeSide < 0 && nextX < closestTarget.x + minSpacing) {
                nextX = Math.max(nextX, closestTarget.x + minSpacing);
                if (f.attackTimer > 0 || f.dashTimer > 0) f.vx = 0;
            }
            f.x = nextX;
        } else {
            f.x += f.vx;
        }

        // Arena Boundary & Wall Splat Trigger
        if (window.canvas) {
            let minX = window.WALL_PADDING || 40;
            let maxX = window.canvas.width - (window.WALL_PADDING || 40);
            if (f.x <= minX || f.x >= maxX) {
                let hitLeft = (f.x <= minX);
                f.x = hitLeft ? minX : maxX;
                if (f.state === 'hurt' && Math.abs(f.vx) >= 6.0 && (!f.wallDamageCooldown || f.wallDamageCooldown <= 0)) {
                    f.wallDamageCooldown = 60;
                    f.state = 'wall_splat';
                    f.hitStun = 30;
                    f.vx = 0;
                    window.shakeScreen(8, 5);
                    window.playSound(140, 'square', 0.35, 0.7, true);
                    window.triggerDimensionShatter(f.x, f.y - 40, "#ff9f43");
                    window.floatingTexts.push({ x: f.x, y: f.y - 85, text: "💥 WALL SPLAT!", color: "#ff9f43", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 36, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                } else {
                    f.vx = 0;
                }
            }
        }
    });

    // Collision Push & CLASH System
    for (let i = 0; i < allFighters.length; i++) { 
        for (let j = i + 1; j < allFighters.length; j++) { 
            let f1 = allFighters[i], f2 = allFighters[j]; 
            if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
            
            let overlapX = f2.x - f1.x; 
            let pushDist = 34 * Math.max(f1.scale || 1, f2.scale || 1); 
            if (Math.abs(overlapX) < pushDist) { 
                let pushForce = (pushDist - Math.abs(overlapX)) / 2; 
                let sign = overlapX === 0 ? (f1.isFacingRight ? 1 : -1) : Math.sign(overlapX); 
                f1.x -= pushForce * sign; 
                f2.x += pushForce * sign; 
            } 

            let dist = Math.abs(f1.x - f2.x);
            if (dist < 85 && f1.attackTimer > 5 && f1.attackTimer < 20 && f2.attackTimer > 5 && f2.attackTimer < 20) {
                if (!f1.clashCooldown && !f2.clashCooldown && f1.isFacingRight !== f2.isFacingRight) {
                    f1.clashCooldown = 45; f2.clashCooldown = 45;
                    let midX = (f1.x + f2.x) / 2; 
                    let midY = (f1.y + f2.y) / 2 - 35;
                    window.shakeScreen(6, 4);
                    window.playSound(420, 'square', 0.15, 0.5, true);
                    window.spawnParticles(midX, midY, "#f1c40f", true);
                    window.spawnLightning(midX, midY, "#f1c40f", 30, 4);
                    window.spawnCrossSlash(midX, midY, true, "#f1c40f", "#00f3ff", 1.3);
                    f1.vx = (f1.x < f2.x) ? -5.5 : 5.5;
                    f2.vx = (f2.x < f1.x) ? -5.5 : 5.5;
                    window.floatingTexts.push({ x: midX, y: midY - 45, text: "⚔️ CLASH!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                }
            }
            if (f1.clashCooldown > 0) f1.clashCooldown--;
            if (f2.clashCooldown > 0) f2.clashCooldown--;
        } 
    }

    window.syncAllFightersFacing();

    // PENDING HIT RESOLUTION + BLACK FLASH TRIGGER
    allFighters.forEach(f => {
        if (f && f.pendingHit && f.hp > 0) {
            let hit = f.pendingHit;
            if (hit.target && hit.target.hp > 0) {
                f.isFacingRight = (hit.target.x >= f.x);
            }
            hit.delay--;
            if (hit.delay <= 0) {
                let target = hit.target;
                let reach = 95 * (f.scale || 1);
                if (target && target.hp > 0 && Math.abs(f.x - target.x) <= reach + 42) {
                    f.isFacingRight = (target.x >= f.x);
                    target.isFacingRight = (f.x > target.x);
                    let strikeRight = f.isFacingRight;

                    let isCrit = false;
                    let finalDmg = hit.baseDmg;

                    if (hit.isFinisher) {
                        isCrit = true; 
                        finalDmg *= 2.9;
                        target.vx = (strikeRight ? 9.5 : -9.5); 
                        target.vy = -6.5;
                        target.onGround = false;
                        target.state = 'hurt'; 
                        target.hitStun = 40; 
                        window.shakeScreen(10, 6);
                        window.spawnParticles(target.x, target.y - 40, "#ff4757", true);

                        if (hit.moveName === 'one_inch_punch') {
                            window.spawnLaser(f.x, f.y - 38, strikeRight, "#00f3ff", 24, 12);
                            window.triggerDimensionShatter(target.x, target.y - 38, "#00f3ff");
                            window.spawnCrossSlash(target.x, target.y - 38, strikeRight, "#00f3ff", "#ffffff", 1.65);
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "⚡ ONE INCH BLAST!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        } else if (hit.moveName === 'dragon_uppercut') {
                            target.vy = -12.5;
                            window.spawnSkyLightning(target.x, window.GROUND_Y, "#f1c40f");
                            window.spawnCrossSlash(target.x, target.y - 40, strikeRight, "#f1c40f", "#ff4757", 1.75);
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "🐉 DRAGON FANG!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        } else {
                            window.spawnCrossSlash(target.x, target.y - 38, strikeRight, "#ff003c", "#9b59b6", 1.7);
                            window.spawnSkyLightning(target.x, window.GROUND_Y, "#ff003c");
                            window.triggerDimensionShatter(target.x, target.y - 40, "#ff003c");
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "🔥 ASURA FINISH!", color: "#ff4757", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        }
                    } 
                    else if (hit.isMeteorSlam) {
                        isCrit = true;
                        finalDmg *= 2.1;
                        target.vy = 15;
                        target.vx = (strikeRight ? 4 : -4);
                        target.slammedDown = true;
                        target.state = 'hurt';
                        target.hitStun = 35;
                        window.spawnCrossSlash(target.x, target.y - 35, strikeRight, "#ff9f43", "#ff4757", 1.55);
                        window.spawnSkyLightning(target.x, window.GROUND_Y, "#ff9f43");
                        window.floatingTexts.push({ x: target.x, y: target.y - 85, text: "☄️ METEOR SLAM!", color: "#ff9f43", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 34, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                    }
                    else if (hit.isMultiHit) {
                        finalDmg *= 0.85;
                        target.vx = (strikeRight ? 2 : -2);
                        target.hitStun = 30;
                        target.state = 'hurt';
                        window.spawnSlash(target.x, target.y - 35, strikeRight, "#00f3ff", true, 1.4, 0.3);
                        window.spawnAura(f.x, window.GROUND_Y, "#00f3ff", 60, 18);
                        window.spawnPhantomBarrage(f, target, f.color || "#00f3ff", 8);

                        for (let m = 1; m <= 2; m++) {
                            setTimeout(() => {
                                if (window.gameOver || !f || f.hp <= 0 || !target || target.hp <= 0) return;
                                f.isFacingRight = (target.x >= f.x);
                                target.isFacingRight = (f.x > target.x);
                                if (Math.abs(f.x - target.x) <= reach + 55) {
                                    let isLast = (m === 2);
                                    f.state = isLast ? 'spinning_heel' : 'hook';
                                    window.takeDamage(target, Math.floor(hit.baseDmg * (isLast ? 1.25 : 0.85)), isLast ? "#f1c40f" : "#00f3ff", isLast, false, f.isFacingRight);
                                    if (isLast) {
                                        window.spawnCrossSlash(target.x, target.y - 38, f.isFacingRight, "#f1c40f", "#00f3ff", 1.5);
                                        window.spawnLightning(target.x, target.y - 38, "#00f3ff", 28, 4);
                                    } else {
                                        window.spawnSlash(target.x, target.y - 38, f.isFacingRight, "#9b59b6", true, 1.4, -0.35);
                                    }
                                    f.comboHits = (f.comboHits || 0) + 1;
                                    f.comboDisplayTimer = 95;
                                    f.comboPopScale = 1.45;
                                }
                            }, m * 60);
                        }
                    }
                    else if (hit.isLauncher) {
                        isCrit = true;
                        finalDmg *= 1.5;
                        target.vy = -12.0;
                        target.vx = (strikeRight ? 2.2 : -2.2);
                        target.onGround = false;
                        target.state = 'hurt';
                        target.hitStun = 36;
                        window.spawnSlash(target.x, target.y - 40, strikeRight, "#00f3ff", true, 1.55, -Math.PI / 3);
                        window.spawnSpaceRipple(target.x, window.GROUND_Y, "#00f3ff");
                        window.spawnLightning(target.x, target.y - 40, "#00f3ff", 25, 3);
                        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🌪️ AIR LAUNCH!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.4, font: "bold 15px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                    }
                    else {
                        if (Math.random() < (f.dynamicCritChance || f.critChance || 0.15)) { 
                            isCrit = true; 
                            finalDmg *= (f.critMult || 1.55); 
                        }
                        if ((f.state === 'low_kick' || f.state === 'teep_kick') && Math.random() < 0.35) {
                            target.stunTimer = 28; target.state = 'stunned';
                            window.floatingTexts.push({ x: target.x, y: target.y - 70, text: "🦵 LEG SWEEP!", color: "#e67e22", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        }
                        if ((f.state === 'elbow_strike' || f.state === 'knee_strike') && Math.random() < 0.35) {
                            finalDmg *= 1.35;
                            window.spawnParticles(target.x, target.y - 50, "#c0392b", true);
                            window.floatingTexts.push({ x: target.x, y: target.y - 70, text: "🩸 BLEED!", color: "#ff4757", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        }
                        target.vx = (strikeRight ? 2.8 : -2.8); 
                        target.hitStun = 16; 
                        target.state = 'hurt';

                        let slashColors = ["#00f3ff", "#f1c40f", "#ff4757", "#9b59b6", "#2ed573"];
                        let pickColor = isCrit ? "#ff4757" : slashColors[(f.comboStep || 0) % slashColors.length];
                        let slashAngle = (f.state.includes('spinning') || f.state.includes('axe')) ? 0.15 : (Math.random() - 0.5) * 0.45;
                        window.spawnSlash(target.x, target.y - 35, strikeRight, pickColor, isCrit, isCrit ? 1.45 : 1.15, slashAngle);
                    }

                    // KÍCH HOẠT HẮC THIỂM (BLACK FLASH) KHI COMBO TỪ 6 HITS TRỞ LÊN & NỔ CRIT!
                    if (isCrit && (f.comboHits || 0) >= 5 && Math.random() < 0.55) {
                        finalDmg *= 1.35;
                        f.stamina = Math.min(100, f.stamina + 15);
                        window.spawnBlackFlash(target.x, target.y - 42);
                        window.floatingTexts.push({
                            x: target.x, y: target.y - 102,
                            text: "⚡ BLACK FLASH! HẮC THIỂM!",
                            color: "#ff003c", alpha: 1.0, vx: 0, vy: -1.5,
                            font: "italic 900 18px 'Arial Black', Impact", life: 45, noGravity: true
                        });
                    }

                    // VAMPIRIC COMEBACK LIFESTEAL
                    if (isCrit && (f.isRage || f.isUnderdog) && f.hp < f.maxHp * 0.40) {
                        let vampHeal = Math.max(4, Math.floor(finalDmg * 0.28));
                        f.hp = Math.min(f.maxHp, f.hp + vampHeal);
                        window.spawnParticles(f.x, f.y - 35, "#2ed573", false);
                        window.floatingTexts.push({ 
                            x: f.x, y: f.y - 82, text: `🩸 LIFESTEAL +${vampHeal}`, color: "#2ed573", 
                            alpha: 1.0, vx: 0, vy: -1.2, font: "bold 14px Arial", life: 34, 
                            scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
                        });
                    }

                    window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, hit.isFlyingKick || hit.isFinisher, strikeRight);
                    f.comboHits = (f.comboHits || 0) + 1; 
                    f.comboDisplayTimer = 95; 
                    f.comboAlpha = 1; 
                    f.comboPopScale = 1.45;
                    f.stamina = Math.min(100, f.stamina + (isCrit ? 6.5 : 3.0));
                } else if (f.onGround) {
                    window.spawnDust(f.x + (f.isFacingRight ? 35 : -35), f.y);
                }
                f.pendingHit = null; 
            }
        }
    });

    window.syncAllFightersFacing();

    // Update Floating Texts Physics
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { 
        let t = window.floatingTexts[i]; 
        t.scale = 1.0;
        t.targetScale = 1.0;

        if (!t.noGravity) {
            t.vy += window.GRAVITY * 0.35; 
            t.x += t.vx; 
            t.y += t.vy; 
            if (t.y >= window.GROUND_Y - 5) {
                t.y = window.GROUND_Y - 5;
                t.vy *= -0.4; 
                t.vx *= 0.6;  
            }
        } else {
            t.x += (t.vx || 0);
            t.y += (t.vy || 0);
            t.vx = (t.vx || 0) * 0.88; 
            t.vy = (t.vy || 0) * 0.88; 
        }

        if (t.life !== undefined) { 
            t.life--; 
            if (t.life <= 15) t.alpha -= 0.06; 
        } else { 
            t.alpha -= 0.03; 
        } 
        if (t.alpha <= 0 || t.life <= 0) window.floatingTexts.splice(i, 1); 
    }

    // Active Sequences Director
    if (window.activeSequences && window.activeSequences.length > 0) {
        for (let i = window.activeSequences.length - 1; i >= 0; i--) {
            let seq = window.activeSequences[i];
            seq.events.forEach(e => { if (e.frame === seq.currentFrame) e.action(); });
            seq.currentFrame++;
            let maxFrame = Math.max(...seq.events.map(e => e.frame));
            if (seq.currentFrame > maxFrame) window.activeSequences.splice(i, 1);
        }
    }

    // STABLE & SMOOTH CAMERA TRACKING
    let midPointX = window.canvas.width / 2;
    if (window.p1 && window.enemies.length > 0) {
        let aliveEnemy = window.getClosestEnemy(window.p1, window.enemies) || window.enemies[0];
        midPointX = (window.p1.x + aliveEnemy.x) / 2;
    } else if (window.p1) { 
        midPointX = window.p1.x; 
    }

    window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.08;
    window.targetCamX = ((window.canvas.width / 2) - window.orbitFocusX) * 0.3;
    window.targetCamY = 0;
    if (!window.isCinematicActive && (!window.targetZoom || window.targetZoom > 1.08)) {
        window.targetZoom = 1.0;
    }
    window.targetTilt = 0;
};
