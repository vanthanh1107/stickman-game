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
window.ensureMasterAudioBus = function() {
    if (!window.audioCtx) {
        window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!window._masterBusGain || window._masterBusCtx !== window.audioCtx) {
        window._masterBusCtx = window.audioCtx;
        let bus = window.audioCtx.createGain();
        bus.gain.value = 0.86;
        let comp = window.audioCtx.createDynamicsCompressor();
        comp.threshold.value = -10;
        comp.knee.value = 14;
        comp.ratio.value = 6;
        comp.attack.value = 0.003;
        comp.release.value = 0.12;
        bus._internalMasterConnect = true;
        comp._internalMasterConnect = true;
        bus.connect(comp);
        comp.connect(window.audioCtx.destination);
        window._masterBusGain = bus;
        window._masterCompressor = comp;
        window._connectedRecordDest = null;
    }
    if (window.masterRecordDestination && window._connectedRecordDest !== window.masterRecordDestination) {
        if (window._connectedRecordDest) {
            try { window._masterCompressor.disconnect(window._connectedRecordDest); } catch (e) {}
            try { window._masterCompressor.connect(window.audioCtx.destination); } catch (e) {}
        }
        try {
            window._masterCompressor.connect(window.masterRecordDestination);
            window._connectedRecordDest = window.masterRecordDestination;
        } catch (e) {}
    }
    return window._masterBusGain;
};

window.playSound = function(freq, type, duration, vol, isImpact = false) { 
    if (window.isMuted) return; 
    try {
        let nowPerf = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (!window._sfxWindowStart || (nowPerf - window._sfxWindowStart) > 24) {
            window._sfxWindowStart = nowPerf;
            window._sfxWindowCount = 0;
        }
        if (isImpact && window._lastImpactPerf && (nowPerf - window._lastImpactPerf) < 14) return;
        if (window._sfxWindowCount >= 3) return;
        window._sfxWindowCount++;
        if (isImpact) window._lastImpactPerf = nowPerf;

        let masterBus = window.ensureMasterAudioBus();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        let dur = Math.max(0.03, Math.min(duration || 0.2, 1.5));
        let t = window.audioCtx.currentTime;
        let osc = window.audioCtx.createOscillator();
        let gain = window.audioCtx.createGain();
        osc._internalMasterConnect = true;
        gain._internalMasterConnect = true;
        osc.connect(gain);
        gain.connect(masterBus);

        let safeVol = Math.min(vol || 0.5, 0.82); 
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : (type || 'sawtooth');
            osc.frequency.setValueAtTime(Math.max(20, freq || 120), t);
            osc.frequency.exponentialRampToValueAtTime(18, t + Math.min(0.15, dur)); 
            gain.gain.setValueAtTime(safeVol, t);
            gain.gain.exponentialRampToValueAtTime(0.008, t + dur); 

            let snap = window.audioCtx.createOscillator();
            let snapGain = window.audioCtx.createGain();
            snap._internalMasterConnect = true;
            snapGain._internalMasterConnect = true;
            snap.type = 'square';
            snap.frequency.setValueAtTime(Math.min(12000, Math.max(40, (freq || 120) * 2.5)), t);
            snap.frequency.exponentialRampToValueAtTime(30, t + 0.042); 
            snapGain.gain.setValueAtTime(safeVol * 0.32, t);
            snapGain.gain.exponentialRampToValueAtTime(0.008, t + 0.042); 
            snap.connect(snapGain);
            snapGain.connect(masterBus);
            snap.onended = function() {
                try { snap.disconnect(); snapGain.disconnect(); } catch (e) {}
            };
            snap.start(t);
            snap.stop(t + 0.044);
        } else { 
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(Math.max(20, freq || 300), t);
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, (freq || 300) * 0.5), t + dur); 
            gain.gain.setValueAtTime(0.01, t);
            gain.gain.linearRampToValueAtTime(safeVol * 0.55, t + dur * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.008, t + dur); 
        }
        osc.onended = function() {
            try { osc.disconnect(); gain.disconnect(); } catch (e) {}
        };
        osc.start(t);
        osc.stop(t + dur + 0.005); 
    } catch(e){}
};

// ==========================================
// 2. BỘ CÔNG CỤ KỸ NĂNG, BỘ ĐỊNH THỜI VẬT LÝ & HIỆU ỨNG COMBO V9.5
// ==========================================
window._combatTimers = [];
window._combatTimerSeq = 1;
window._combatTimerTickClock = 0;

window.snapFighterPos = function(f, nx, ny) {
    if (!f) return;
    if (nx !== undefined && nx !== null && !Number.isNaN(nx)) {
        f.x = nx;
        f._prevX = nx;
    }
    if (ny !== undefined && ny !== null && !Number.isNaN(ny)) {
        f.y = ny;
        f._prevY = ny;
    }
};

window.scheduleCombatTimer = function(fn, delayMs) {
    if (typeof fn !== 'function') return 0;
    if (!delayMs || delayMs <= 0) {
        try { fn(); } catch (e) {}
        return 0;
    }
    let ticks = Math.max(1, Math.round(delayMs / (1000 / 60)));
    let id = window._combatTimerSeq++;
    window._combatTimers.push({
        id: id,
        ticks: ticks,
        intervalTicks: 0,
        remainingCount: 1,
        fn: fn,
        bornTick: window._combatTimerTickClock
    });
    return id;
};

window.scheduleCombatInterval = function(fn, intervalMs, maxCount) {
    if (typeof fn !== 'function') return 0;
    let stepTicks = Math.max(1, Math.round((intervalMs || 16.67) / (1000 / 60)));
    let id = window._combatTimerSeq++;
    window._combatTimers.push({
        id: id,
        ticks: stepTicks,
        intervalTicks: stepTicks,
        remainingCount: (maxCount && maxCount > 0) ? maxCount : 9999,
        fn: fn,
        bornTick: window._combatTimerTickClock
    });
    return id;
};

window.cancelCombatTimer = function(id) {
    if (!id || !window._combatTimers) return;
    for (let i = window._combatTimers.length - 1; i >= 0; i--) {
        if (window._combatTimers[i].id === id) {
            window._combatTimers.splice(i, 1);
            break;
        }
    }
};

window.clearAllCombatTimers = function() {
    window._combatTimers = [];
};

window.tickCombatTimers = function() {
    if (!window._combatTimers || window._combatTimers.length === 0) return;
    window._combatTimerTickClock++;
    let currentClock = window._combatTimerTickClock;
    let snapshotLen = window._combatTimers.length;
    for (let i = 0; i < snapshotLen && i < window._combatTimers.length; i++) {
        let item = window._combatTimers[i];
        if (!item || item.bornTick === currentClock) continue;
        item.ticks--;
        if (item.ticks <= 0) {
            try { item.fn(item.id); } catch (e) {}
            if (!window._combatTimers || i >= window._combatTimers.length || window._combatTimers[i] !== item) {
                i--;
                snapshotLen = window._combatTimers ? window._combatTimers.length : 0;
                continue;
            }
            if (item.intervalTicks > 0 && item.remainingCount > 1) {
                item.remainingCount--;
                item.ticks = item.intervalTicks;
            } else {
                window._combatTimers.splice(i, 1);
                i--;
                snapshotLen--;
            }
        }
    }
};

window.shakeScreen = function(frames, magnitude) { 
    let nextFrames = Math.min(frames || 10, 18);
    let nextMag = Math.min((magnitude || 5) * 0.42, 5.2);
    if (nextFrames > (window.shakeTime || 0)) window.shakeTime = nextFrames;
    if (nextMag > (window.shakeMag || 0)) window.shakeMag = nextMag;
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
    if (!f || window.gameOver) return;
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
    window.cinematicTimer = 0; 
    window.cinematicCaster = null; 
    window.cinematicCallback = null; 
    window.playSound(400, 'sine', 0.25, 0.28, false); 
    if (typeof callback === 'function') {
        try { callback(); } catch (e) {}
    }
};

window.spawnAura = function(x, y, color, radius, duration) { 
    window.auras.push({ x: x, y: y, color: color || "#00f3ff", r: Math.min(radius || 65, 110), life: duration || 20, maxLife: duration || 20 }); 
};

window.spawnLaser = function(x, y, isRight, color, width, duration, angle = 0) { 
    window.lasers.push({ x: x, y: y, isRight: isRight, color: color || "#00f3ff", width: Math.min(width || 28, 65), life: duration || 18, maxLife: duration || 18, angle: angle }); 
};

window.focusCinematic = function(frames, color = "#ffffff") { 
    window.screenFlash = Math.min(0.32, (frames || 15) * 0.02); 
    window.screenFlashColor = color;
};
window.applyFilter = function(type, frames) { window.screenFilter = type; window.filterTimer = Math.min(frames, 20); };

window.triggerTimeStop = function(frames, caster) { 
    let stunTicks = Math.min(frames || 36, 42);
    window.timeStopTimer = stunTicks;
    window.timeStopCaster = caster;
    window.invertFrames = 0;
    window.playSound(150, 'triangle', 0.35, 0.55, true); 
    window.shakeScreen(8, 4.5); 
    if (caster) window.spawnSpaceRipple(caster.x, caster.y - 40, caster.color || "#00f3ff");
    let allF = [window.p1].concat(window.enemies || []);
    for (let i = 0; i < allF.length; i++) {
        let f = allF[i];
        if (f && f !== caster && f.hp > 0) {
            f.stunTimer = Math.max(f.stunTimer || 0, stunTicks);
            f.state = 'stunned';
            f.vx *= 0.25;
        }
    }
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
        window.scheduleCombatTimer(() => {
            if (window.gameOver || !caster || caster.hp <= 0 || !target || target.hp <= 0) return;
            window.spawnFighterAfterimage(caster, color);
            let side = (i % 2 === 0) ? -1 : 1;
            let nx = Math.max(50, Math.min((window.canvas ? window.canvas.width : 800) - 50, target.x + side * 55));
            let ny = window.GROUND_Y - (i === hits - 1 ? 0 : Math.random() * 55);
            window.snapFighterPos(caster, nx, ny);
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

        window.scheduleCombatTimer(() => {
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
// 3. DAMAGE SYSTEM + MIRACLE COMEBACK & COMBO BREAKER + SLAPSTICK COMEDY GAGS
// ==========================================
window.spawnComedyHitGag = function(target, isCrit, attackerDirRight = true, isKO = false) {
    if (!target || !window.customObjs) return;
    if (window.customObjs.length > 18) return; // Giữ mượt 60fps tuyệt đối

    let isVi = (window.currentLang === 'vi' || true);
    let cid = (target.classId || target.id || "").toLowerCase();
    let dir = attackerDirRight ? 1 : -1;

    // Đạo cụ hài hước theo đặc trưng từng nhóm nhân vật + đạo cụ slapstick chung
    let generalProps = ["🦷", "🩴", "🐓", "🐟", "🍗", "🍌", "🍳", "🤡"];
    let charProps = generalProps;
    if (["messi", "ronaldo", "mbappe", "haland", "haaland", "neymar", "lamineyamal", "vozinha"].includes(cid)) {
        charProps = ["⚽", "🟨", "🟥", "🦷", "🩴", "👟", "🐓"];
    } else if (["billgates", "elonmusk", "stevejob", "trump", "donaldtrump", "phuonghang", "nguyenvanhien"].includes(cid)) {
        charProps = ["💸", "💎", "🪙", "🦷", "🩴", "🍎", "🐓"];
    } else if (["muoikho", "sontung", "mtp", "jonnytri", "jonnytringuyen", "therock", "spiderman", "domixi"].includes(cid)) {
        charProps = ["🩴", "🐓", "🦷", "🍳", "🍕", "😭", "🍌"];
    }

    if (isKO) {
        let koProps = ["🦷", "🩴", "🐓", "🏳️", "👻"];
        for (let i = 0; i < koProps.length; i++) {
            let vx = (Math.random() - 0.5) * 11 + dir * 2.5;
            let vy = -6.5 - Math.random() * 5.5;
            window.spawnCustomObj(target.x, target.y - 45, vx, vy, koProps[i], "#fff", "22px Arial", 65, true, true);
        }
        window.floatingTexts.push({
            x: target.x, y: target.y - 122,
            text: isVi ? "👻 ĐĂNG XUẤT KHỎI TRÁI ĐẤT! 🏳️" : "👻 SOUL LEFT THE BODY! 🏳️",
            color: "#ffd700", alpha: 1.0, vx: 0, vy: -0.9,
            font: "bold 15px Arial", life: 68, noGravity: true
        });
        return;
    }

    // Văng đạo cụ hài hước nảy tưng tưng trên sàn (Răng rụng, Dép tổ ong, Gà cao su, Cá mặn...)
    if (isCrit || Math.random() < 0.42) {
        let count = isCrit ? 2 : 1;
        for (let i = 0; i < count; i++) {
            let prop = charProps[Math.floor(Math.random() * charProps.length)];
            let vx = dir * (2.5 + Math.random() * 6.5) + (Math.random() - 0.5) * 3;
            let vy = -5.5 - Math.random() * 4.5;
            window.spawnCustomObj(target.x, target.y - 48, vx, vy, prop, "#ffffff", isCrit ? "23px Arial" : "19px Arial", 48, true, true);
        }
    }

    // Chữ tượng thanh truyện tranh hài hước khi nổ Chí Mạng (có cooldown chống rối mắt)
    let now = Date.now();
    if (isCrit && (!target._lastGagTextTime || now - target._lastGagTextTime > 1100) && Math.random() < 0.72) {
        target._lastGagTextTime = now;
        let gagsVi = [
            "💥 BỐP! RỤNG RĂNG! 🦷",
            "🩴 DÉP TỔ ONG VẢ MẶT!",
            "💫 NỔ ĐOM ĐÓM MẮT!",
            "🐓 GÀ KÊU ÉC ÉC!",
            "🍳 CHẢO CHỐNG DÍNH!",
            "😭 MÁ ƠI CỨU CON!",
            "🍑 THỐN ĐẾN TẬN RỐN!",
            "🔔 BOONG!! U ĐẦU!"
        ];
        let gagsEn = [
            "💥 BONK! TOOTH LOST! 🦷",
            "🩴 SLIPPER SLAP!",
            "💫 SEEING STARS!",
            "🐓 RUBBER CHICKEN!",
            "🍳 FRYING PAN BONK!",
            "😭 MOMMY HELP!",
            "🍑 EMOTIONAL DAMAGE!",
            "🔔 DING!! HEAD BUMP!"
        ];
        let pool = isVi ? gagsVi : gagsEn;
        let gagText = pool[Math.floor(Math.random() * pool.length)];
        let gagColors = ["#ffeb3b", "#00f3ff", "#ff66cc", "#7bed9f", "#ffa502"];
        let gCol = gagColors[Math.floor(Math.random() * gagColors.length)];
        window.floatingTexts.push({
            x: target.x + (Math.random() * 24 - 12),
            y: target.y - 88,
            text: gagText,
            color: gCol,
            alpha: 1.0,
            vx: dir * 0.8,
            vy: -1.35,
            font: "italic 900 15px Arial, sans-serif",
            life: 44,
            noGravity: true
        });
    }
};

window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;
    if (window.StoryDialogueEngine && window.StoryDialogueEngine.isDialoguePausingCombat()) return;

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
            window.snapFighterPos(target, Math.max(minX, Math.min(maxX, target.x + (target.isFacingRight ? -85 : 85)))); 
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
            window._hudDirty = true;
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
                window.zoomPulseTicks = 8;
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
        window._hudDirty = true;
        if (target.hp <= 0 && typeof window.updateHPUIs === 'function') {
            window._hudDirty = false;
            window.updateHPUIs();
        }

        if (target.hp > 0 && typeof window.spawnComedyHitGag === 'function') {
            window.spawnComedyHitGag(target, isCrit, attackerDirRight, false);
        }

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
            target.deathTriggered = true;
            target.state = 'ko_falling'; 
            target.koTimer = 100; 
            target.vy = -10; 
            target.vx = attackerDirRight ? 3.5 : -3.5;
            target.onGround = false;
            if (typeof window.spawnComedyHitGag === 'function') {
                window.spawnComedyHitGag(target, true, attackerDirRight, true);
            }
            if (typeof window.spawnKoGhost === 'function') window.spawnKoGhost(target);
        } else if (isCrit) { 
            window.shakeScreen(6, 4);
            window.playSound(180, 'square', 0.25, 0.55, true); 
        } else { 
            window.playSound(250, 'sine', 0.14, 0.3, true); 
        }
    }
};

// ==========================================
// HÀM TẠO BÓNG MA LINH HỒN BAY LÊN TRỜI KHI BỊ K.O
// ==========================================
window.spawnKoGhost = function(f) {
    if (!f || f._ghostSpawned) return;
    f._ghostSpawned = true;
    if (!window.koGhosts) window.koGhosts = [];
    let av = f.avatarUrl;
    if (!av && f.classId && window.classStats && window.classStats[f.classId]) {
        av = window.classStats[f.classId].avatarUrl;
    }
    window.koGhosts.push({
        x: f.x,
        y: f.y - 25,
        vx: (f.isFacingRight ? -0.8 : 0.8) + (Math.random() - 0.5) * 0.4,
        vy: -2.2,
        seed: Math.random() * 100,
        alpha: 0.95,
        life: 240,
        maxLife: 240,
        color: f.color || "#ffffff",
        avatarUrl: av,
        className: f.className || "GHOST"
    });
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
        window.snapFighterPos(attacker, Math.max(minX, Math.min(maxX, target.x - dir * 42)), Math.max(120, target.y + 8));
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
                window.snapFighterPos(attacker, newX);
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

    // 1. Cập nhật thời gian sống của toàn bộ VFX & Hit-Rings V9.0 (Tối ưu In-Place, không cấp phát rác GC)
    for (let i = window.lightningArcs.length - 1; i >= 0; i--) {
        window.lightningArcs[i].life--;
        if (window.lightningArcs[i].life <= 0) window.lightningArcs.splice(i, 1);
    }
    for (let i = window.energyPillars.length - 1; i >= 0; i--) {
        let p = window.energyPillars[i];
        p.life--; p.scaleY += (1 - p.scaleY) * 0.22;
        if (p.life <= 0) window.energyPillars.splice(i, 1);
    }
    for (let i = window.blackHoles.length - 1; i >= 0; i--) {
        window.blackHoles[i].life--;
        if (window.blackHoles[i].life <= 0) window.blackHoles.splice(i, 1);
    }
    for (let i = window.spaceRipples.length - 1; i >= 0; i--) {
        let r = window.spaceRipples[i];
        r.r += 11; r.life--;
        if (r.life <= 0) window.spaceRipples.splice(i, 1);
    }
    for (let i = window.auras.length - 1; i >= 0; i--) {
        window.auras[i].life--;
        if (window.auras[i].life <= 0) window.auras.splice(i, 1);
    }
    for (let i = window.lasers.length - 1; i >= 0; i--) {
        window.lasers[i].life--;
        if (window.lasers[i].life <= 0) window.lasers.splice(i, 1);
    }
    for (let i = window.lensFlares.length - 1; i >= 0; i--) {
        window.lensFlares[i].life--;
        if (window.lensFlares[i].life <= 0) window.lensFlares.splice(i, 1);
    }
    if (window.dimensionCracks) {
        for (let i = window.dimensionCracks.length - 1; i >= 0; i--) {
            window.dimensionCracks[i].life--;
            if (window.dimensionCracks[i].life <= 0) window.dimensionCracks.splice(i, 1);
        }
    }
    if (window.hitRings) {
        for (let i = window.hitRings.length - 1; i >= 0; i--) {
            let hr = window.hitRings[i];
            hr.r += (hr.maxR - hr.r) * 0.28; hr.life--;
            if (hr.life <= 0) window.hitRings.splice(i, 1);
        }
    }
    if (window.phantomFists) {
        for (let i = window.phantomFists.length - 1; i >= 0; i--) {
            let pf = window.phantomFists[i];
            pf.x += pf.vx; pf.y += pf.vy; pf.life--;
            if (pf.life <= 0) window.phantomFists.splice(i, 1);
        }
    }
    if (window.impactAberration > 0) window.impactAberration--;
    if (window.invertFrames > 0) window.invertFrames--;
    if (window.timeStopTimer > 0) window.timeStopTimer--;

    if (window.activeDomain) {
        window.activeDomain.life--;
        if (window.activeDomain.life <= 0) window.activeDomain = null;
    }

    let isStoryPausedNow = !!(window.StoryDialogueEngine && window.StoryDialogueEngine.isDialoguePausingCombat());

    if (!isStoryPausedNow) {
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

    if (!window._cachedHudRed) {
        window._cachedHudRed = document.getElementById("hp-wrapper-1");
        window._cachedHudBlue = document.getElementById("hp-wrapper-2");
    }
    if (window.uiShakeP1 > 0) { 
        window.uiShakeP1--; 
        if (window._cachedHudRed && (window.uiShakeP1 % 2 === 0)) {
            let sx = ((window.uiShakeP1 % 4 < 2) ? 1.5 : -1.5);
            let sy = ((window.uiShakeP1 % 3 === 0) ? -1.0 : 1.0);
            window._cachedHudRed.style.transform = `translate3d(${sx}px, ${sy}px, 0)`; 
        }
    } else if (window._cachedHudRed && window._cachedHudRed._shook) { 
        window._cachedHudRed._shook = false;
        window._cachedHudRed.style.transform = "translate3d(0, 0, 0)"; 
    }
    if (window.uiShakeP1 > 0 && window._cachedHudRed) window._cachedHudRed._shook = true;

    if (window.uiShakeP2 > 0) { 
        window.uiShakeP2--; 
        if (window._cachedHudBlue && (window.uiShakeP2 % 2 === 0)) {
            let sx = ((window.uiShakeP2 % 4 < 2) ? -1.5 : 1.5);
            let sy = ((window.uiShakeP2 % 3 === 0) ? 1.0 : -1.0);
            window._cachedHudBlue.style.transform = `translate3d(${sx}px, ${sy}px, 0)`; 
        }
    } else if (window._cachedHudBlue && window._cachedHudBlue._shook) { 
        window._cachedHudBlue._shook = false;
        window._cachedHudBlue.style.transform = "translate3d(0, 0, 0)"; 
    }
    if (window.uiShakeP2 > 0 && window._cachedHudBlue) window._cachedHudBlue._shook = true;

    if (window.gameOver) { window.matchEndTimer = (window.matchEndTimer || 0) + 1; }
    if (window.introTimer > 0) {
        window.introTimer -= 1;
        if (window.introStartTime > 0) {
            let introElapsed = Date.now() - window.introStartTime;
            if (typeof window.updateIntroVoiceTimeline === 'function') {
                window.updateIntroVoiceTimeline(introElapsed);
            }
            if (introElapsed < (window.introDuration || 3200) && window.introTimer < 56) {
                window.introTimer = 56;
            }
        }
    }

    let allFighters = [window.p1].concat(window.enemies);
    if (window.StoryDialogueEngine) {
        window.StoryDialogueEngine.update(allFighters);
    }
    let isDialoguePause = !!(window.StoryDialogueEngine && window.StoryDialogueEngine.isDialoguePausingCombat());

    if (!window.gameOver && window.introTimer <= 0 && !isDialoguePause) {
        window.matchTimer++;
        window.tickCombatTimers();
    } else if (window.gameOver && window._combatTimers && window._combatTimers.length > 0) {
        window.clearAllCombatTimers();
    }

    window.globalWind = Math.sin((window.matchTimer || 0) / 150) * 1.4;

    window._prevShakeX = window._simShakeX || 0;
    window._prevShakeY = window._simShakeY || 0;
    if (window.shakeTime > 0) {
        window.shakeTime--;
        window._shakePhase = (window._shakePhase || 0) + 1.85;
        let decay = Math.min(1, window.shakeTime / 10);
        let mag = (window.shakeMag || 3) * decay;
        window._simShakeX = Math.sin(window._shakePhase) * mag;
        window._simShakeY = Math.cos(window._shakePhase * 1.35) * mag * 0.72;
        if (window.shakeTime <= 0) { window.shakeMag = 0; }
    } else {
        window._simShakeX = 0;
        window._simShakeY = 0;
    } 
    if (window.screenFlash > 0) { window.screenFlash -= 0.06; if (window.screenFlash <= 0.001) window.screenFlash = 0; }
    if (window.cinematicTimer > 0 && !isDialoguePause) { 
        window.cinematicTimer--; 
        if (window.cinematicTimer === 0 && window.cinematicCallback) { 
            try { window.cinematicCallback(); } catch(e) {} 
            window.cinematicCallback = null; 
        } 
    }

    // 🎭 KHI NHÂN VẬT ĐANG NÓI HỘI THOẠI STORY MODE -> TẠM DỪNG GIAO CHIẾN, ĐỨNG ĐỐI MẶT GÁY KHÉT!
    if (isDialoguePause) {
        for (let i = window.shockwaves.length - 1; i >= 0; i--) { 
            let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.045; 
            if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); 
        }
        for (let i = window.impactSparks.length - 1; i >= 0; i--) { 
            let isp = window.impactSparks[i];
            isp.x += isp.vx; isp.y += isp.vy; isp.vy += window.GRAVITY * 0.6; isp.life--; 
            if (isp.life <= 0) window.impactSparks.splice(i, 1); 
        }
        for (let i = window.particles.length - 1; i >= 0; i--) { 
            let pt = window.particles[i];
            if (!pt.isGroundDust && !pt.isAuraFlame) pt.vy += window.GRAVITY * 0.65;
            pt.x += pt.vx; pt.y += pt.vy; pt.life--;
            if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.35; pt.vx *= 0.7; }
            if (pt.life <= 0) window.particles.splice(i, 1); 
        }
        for (let i = window.slashes.length - 1; i >= 0; i--) { 
            window.slashes[i].life--; 
            if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); 
        }
        for (let i = window.floatingTexts.length - 1; i >= 0; i--) { 
            let t = window.floatingTexts[i];
            t.age = (t.age || 0) + 1;
            if (!t.noGravity) {
                t.vy += window.GRAVITY * 0.35; t.x += t.vx; t.y += t.vy;
                if (t.y >= window.GROUND_Y - 5) { t.y = window.GROUND_Y - 5; t.vy *= -0.4; t.vx *= 0.6; }
            } else {
                t.x += (t.vx || 0); t.y += (t.vy || 0); t.vx = (t.vx || 0) * 0.88; t.vy = (t.vy || 0) * 0.88;
            }
            if (t.life !== undefined) { t.life--; if (t.life <= 15) t.alpha -= 0.06; } else { t.alpha -= 0.03; }
            if (t.alpha <= 0 || t.life <= 0) window.floatingTexts.splice(i, 1);
        }

        let activeSpeaker = window.StoryDialogueEngine.getActiveSpeaker();
        let minWallX = (window.WALL_PADDING || 40) + 20;
        let maxWallX = (window.canvas ? window.canvas.width : 800) - minWallX;

        allFighters.forEach(f => {
            if (!f || f.hp <= 0) return;
            f.attackTimer = 0;
            f.pendingHit = null;
            f.dashTimer = 0;
            f.hitStun = 0;
            f.stunTimer = 0;
            f.vx = 0;
            if (!f.onGround || f.y < window.GROUND_Y) {
                f.vy = (f.vy || 0) + window.GRAVITY * 0.95;
                f.y += f.vy;
                if (f.y >= window.GROUND_Y) {
                    f.y = window.GROUND_Y;
                    f.vy = 0;
                    f.onGround = true;
                }
            } else {
                f.y = window.GROUND_Y;
                f.vy = 0;
            }
            f.x = Math.max(minWallX, Math.min(maxWallX, f.x));
            if (activeSpeaker === f) {
                f.state = 'story_talk';
                f._isSpeakingNow = true;
            } else {
                f.state = 'idle';
                f._isSpeakingNow = false;
            }
        });

        // Giữ khoảng cách đứng nói chuyện đẹp mắt (không chồng đầu lên nhau)
        if (window.p1 && window.enemies.length > 0 && window.enemies[0] && window.p1.hp > 0 && window.enemies[0].hp > 0) {
            let e0 = window.enemies[0];
            let dx = e0.x - window.p1.x;
            let absDx = Math.abs(dx);
            let minTalkDist = 120;
            if (absDx < minTalkDist) {
                let sign = dx >= 0 ? 1 : -1;
                let push = Math.min(4.5, (minTalkDist - absDx) * 0.25);
                window.p1.x = Math.max(minWallX, Math.min(maxWallX, window.p1.x - sign * push));
                e0.x = Math.max(minWallX, Math.min(maxWallX, e0.x + sign * push));
            }
        }

        window.syncAllFightersFacing();

        let talkMidX = window.canvas.width / 2;
        if (window.p1 && window.enemies.length > 0 && window.enemies[0]) {
            talkMidX = (window.p1.x + window.enemies[0].x) / 2;
        }
        window.orbitFocusX += (talkMidX - window.orbitFocusX) * 0.12;
        window.targetCamX = ((window.canvas.width / 2) - window.orbitFocusX) * 0.34;
        window.targetCamY = 0;
        window.targetZoom = 1.05;
        window.targetTilt = 0;
        return;
    }

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

    // Special Character Projectiles: Soccer Balls (CR7, Messi, Neymar, Vozinha, Yamal)
    if (window.cr7Balls && window.cr7Balls.length > 0) {
        for (let i = window.cr7Balls.length - 1; i >= 0; i--) {
            let b = window.cr7Balls[i];
            b.x += b.vx;
            b.y += b.vy;
            b.rot = (b.rot || 0) + (b.vx > 0 ? 0.35 : -0.35);

            if (b.y >= window.GROUND_Y - b.r) {
                b.y = window.GROUND_Y - b.r;
                b.vy = -Math.abs(b.vy) * 0.65;
                if (typeof window.spawnDust === 'function') window.spawnDust(b.x, window.GROUND_Y);
            }

            if (window.particles && window.particles.length < MAX_PARTICLES) {
                window.particles.push({
                    x: b.x + (Math.random() - 0.5) * 10,
                    y: b.y + (Math.random() - 0.5) * 10,
                    vx: -b.vx * 0.2, vy: (Math.random() - 0.5) * 2,
                    color: b.color || "#f1c40f",
                    size: b.isUlt ? Math.random() * 6 + 4 : Math.random() * 4 + 2,
                    life: 12, maxLife: 12
                });
            }

            let targets = b.target ? [b.target] : ((b.caster && !b.caster.isPlayer) ? (window.p1 ? [window.p1] : []) : (window.enemies || []));
            for (let t of targets) {
                if (t && t !== b.caster && t.hp > 0 && Math.abs(b.x - t.x) < b.r + 30 && Math.abs(b.y - (t.y - 40)) < b.r + 45) {
                    let hitRight = b.vx >= 0;
                    window.takeDamage(t, b.dmg, b.color || "#f1c40f", true, b.isUlt, hitRight);
                    t.vx = hitRight ? (b.isUlt ? 22 : 12) : (b.isUlt ? -22 : -12);
                    t.vy = b.isUlt ? -10 : -5;
                    t.onGround = false;
                    t.state = 'hurt';
                    if (b.stun) t.stunTimer = Math.max(t.stunTimer || 0, b.stun);
                    window.shakeScreen(b.isUlt ? 20 : 8, b.isUlt ? 12 : 5);
                    if (typeof window.spawnParticles === 'function') {
                        for (let k = 0; k < (b.isUlt ? 18 : 8); k++) window.spawnParticles(t.x, t.y - 40, b.color || "#f1c40f", true);
                    }
                    b.life = 0;
                    break;
                }
            }

            b.life--;
            if (b.life <= 0 || b.x < -300 || b.x > (window.canvas ? window.canvas.width + 300 : 1200)) {
                window.cr7Balls.splice(i, 1);
            }
        }
    }

    // Special Character Projectiles: The Rock Boulders
    if (window.theRockBoulders && window.theRockBoulders.length > 0) {
        for (let i = window.theRockBoulders.length - 1; i >= 0; i--) {
            let r = window.theRockBoulders[i];
            r.x += r.vx;
            r.y += r.vy;
            if (r.type === 'falling') r.vy += 0.8;
            r.rot = (r.rot || 0) + (r.vx !== 0 ? (r.vx > 0 ? 0.15 : -0.15) : 0.08);

            let targets = r.target ? [r.target] : ((r.caster && !r.caster.isPlayer) ? (window.p1 ? [window.p1] : []) : (window.enemies || []));

            if (r.type === 'falling' && r.y >= window.GROUND_Y - r.size / 2) {
                r.y = window.GROUND_Y - r.size / 2;
                window.shakeScreen(30, 20);
                if (typeof window.spawnDust === 'function') window.spawnDust(r.x, window.GROUND_Y);
                if (typeof window.spawnParticles === 'function') {
                    for (let k = 0; k < 20; k++) window.spawnParticles(r.x + (Math.random() - 0.5) * 100, window.GROUND_Y, "#d35400", true);
                }
                targets.forEach(t => {
                    if (t && t !== r.caster && t.hp > 0 && Math.abs(r.x - t.x) < r.size + 50) {
                        let hitRight = r.caster ? r.caster.isFacingRight : (t.x >= r.x);
                        window.takeDamage(t, r.dmg, "#e67e22", true, true, hitRight);
                        t.vy = -12;
                        t.onGround = false;
                        t.stunTimer = Math.max(t.stunTimer || 0, 90);
                    }
                });
                r.life = 0;
            }

            if (r.type === 'rolling') {
                if (r.y >= window.GROUND_Y - r.size) {
                    r.y = window.GROUND_Y - r.size;
                    r.vy = -Math.abs(r.vy) * 0.4;
                    if (typeof window.spawnDust === 'function') window.spawnDust(r.x, window.GROUND_Y);
                } else {
                    r.vy += 0.8;
                }
                for (let t of targets) {
                    if (t && t !== r.caster && t.hp > 0 && Math.abs(r.x - t.x) < r.size + 25 && Math.abs(r.y - (t.y - 30)) < r.size + 40) {
                        let hitRight = r.vx >= 0;
                        window.takeDamage(t, r.dmg, "#7f8c8d", true, false, hitRight);
                        t.vx = hitRight ? 15 : -15;
                        t.vy = -6;
                        t.onGround = false;
                        t.state = 'hurt';
                        window.shakeScreen(12, 8);
                        if (typeof window.spawnParticles === 'function') {
                            for (let k = 0; k < 10; k++) window.spawnParticles(t.x, t.y - 30, "#95a5a6", true);
                        }
                        r.life = 0;
                        break;
                    }
                }
            }

            r.life--;
            if (r.life <= 0) window.theRockBoulders.splice(i, 1);
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

    // Cập nhật bóng ma linh hồn bay lên trời (KO Ghosts)
    if (window.koGhosts && window.koGhosts.length > 0) {
        for (let i = window.koGhosts.length - 1; i >= 0; i--) {
            let g = window.koGhosts[i];
            g.life--;
            g.y += g.vy;
            g.x += g.vx + Math.sin((g.maxLife - g.life) * 0.08 + g.seed) * 0.8;
            g.vy = Math.max(-3.5, g.vy - 0.015);
            g.alpha = Math.max(0, g.life / g.maxLife);
            if (g.life <= 0 || g.y < -120) {
                window.koGhosts.splice(i, 1);
            }
        }
    }

    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; 
            window.spawnParticles(e.x, e.y, "#fff", true); 
            window.playSound(100, 'sine', 0.5, 0.5, true);
            if (typeof window.spawnKoGhost === 'function') window.spawnKoGhost(e);
        }
    });
    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { 
        window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -8; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; 
        window.spawnParticles(window.p1.x, window.p1.y, "#fff", true);
        if (typeof window.spawnKoGhost === 'function') window.spawnKoGhost(window.p1);
    }
    
    let gameContext = { 
        floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, 
        spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, 
        playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, 
        dash: (f, fx, fy) => { f.vx = fx; if (fy) { f.vy = fy; f.onGround = false; } f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnFighterAfterimage(f); window.syncAllFightersFacing(); }, 
        teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); window.snapFighterPos(f, dx, dy ? dy : undefined); f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); window.syncAllFightersFacing(); }, 
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
            if (f.y >= window.GROUND_Y) { 
                f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; 
                f.state = 'dead'; 
                f.isCrying = true;
            } 
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
            if (f.attackTimer <= 0 && f.hitStun <= 0 && f.stunTimer <= 0) {
                f.state = (window.DanceEngine && window.DanceEngine.currentWinDance) ? window.DanceEngine.currentWinDance : 'dance_siuuuu';
            }
        } else if (window.gameOver && f.hp <= 0) {
            f.isCrying = true;
            f.state = 'dead';
        } else if (f.state === 'idle' && f.onGround) {
            f.x += Math.sin((window.matchTimer || 0) * 0.21 + (f.isPlayer ? 0 : 1.7)) * (f.isRage ? 0.55 : 0.3);
        }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) f.state = 'idle'; }
        if (!window.gameOver && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') f.state = 'idle'; }
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
                            window.scheduleCombatTimer(() => {
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
        t.age = (t.age || 0) + 1;

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
    if (window.gameOver) {
        if (window.activeSequences && window.activeSequences.length > 0) window.activeSequences = [];
    } else if (window.activeSequences && window.activeSequences.length > 0) {
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
    if (window.ultZoomTicks > 0) {
        window.ultZoomTicks--;
        if (window.ultZoomTicks <= 0) {
            window.isCinematicActive = false;
            window.targetZoom = 1.0;
        }
    } else if (window.zoomPulseTicks > 0) {
        window.zoomPulseTicks--;
        if (window.zoomPulseTicks <= 0 && !window.isCinematicActive) {
            window.targetZoom = 1.0;
        }
    } else if (!window.isCinematicActive && (!window.targetZoom || window.targetZoom > 1.08)) {
        window.targetZoom = 1.0;
    }
    window.targetTilt = 0;

    if (window._hudDirty || (window.matchTimer % 3 === 0)) {
        window._hudDirty = false;
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();
    }
};

// ==========================================
// 6. STORY DIALOGUE ENGINE (MỖI TRẬN ĐẤU LÀ MỘT CÂU CHUYỆN - DỪNG ĐÁNH ĐỂ NÓI & ĐỒNG BỘ CHAT)
// ==========================================
// HỆ THỐNG GIỌNG ĐỌC CHỊ GOOGLE TIẾNG VIỆT CÓ HỒN (SOULFUL GOOGLE STORY TTS ENGINE)
// - Tự động đọc mọi câu chat/thoại nhân vật khi hiển thị và kết thúc hộp thoại đúng lúc đọc xong.
// - Sử dụng kho Giọng Đọc Cảm Xúc đóng gói sẵn (character/story_voice_data.js) kết hợp Bộ Xử Lý Ngữ Điệu
//   Đa Vế (Dynamic Prosody Resampler: lên giọng câu hỏi ?, gằn giọng câu cảm thán !, phân vai chất giọng từng tướng,
//   lọc âm phòng thu Warmth + Presence EQ) nối thẳng vào window.masterRecordDestination để THU 100% VÀO VIDEO 60FPS!
// ==========================================
window.GoogleStoryTTS = {
    _decodedClipCache: new Map(),
    _clipPromiseCache: new Map(),
    _lineBufferCache: new Map(),
    _chunkBufferCache: new Map(),
    _inflightPromises: new Map(),
    _activeNodes: null,
    _activeUtterance: null,
    _speakingNow: false,
    _speechStartedAt: 0,
    _speechDurationMs: 0,
    _preferredProxyIdx: 0,
    _idbPromise: null,

    _getVoiceProfile: function(speakerId, isPlayer, stage) {
        let cid = String(speakerId || "").toLowerCase();
        const archetypes = {
            powerhouse: { baseRate: 1.13, baseDetune: -34, lowShelfDb: 3.8, presenceDb: 3.5 },
            trickster:  { baseRate: 1.17, baseDetune: 26,  lowShelfDb: 2.0, presenceDb: 4.2 },
            cool_boss:  { baseRate: 1.14, baseDetune: -8,  lowShelfDb: 2.8, presenceDb: 3.8 },
            diva_queen: { baseRate: 1.16, baseDetune: 48,  lowShelfDb: 1.8, presenceDb: 4.5 }
        };
        const charMap = {
            ronaldo: "powerhouse", therock: "powerhouse", haaland: "powerhouse",
            donaldtrump: "powerhouse", jonny: "powerhouse", muoikho: "powerhouse",
            domixi: "trickster", vozinha: "trickster", neymar: "trickster",
            lamineyamal: "trickster", spiderman: "trickster",
            mtp: "cool_boss", messi: "cool_boss", mbappe: "cool_boss",
            elonmusk: "cool_boss", billgates: "cool_boss", stevejobs: "cool_boss",
            nguyenvanhien: "cool_boss",
            phuonghang: "diva_queen"
        };
        let key = charMap[cid] || (isPlayer ? "cool_boss" : "powerhouse");
        let prof = Object.assign({}, archetypes[key]);
        // Phân tách nhẹ cao độ P1 vs P2 để người xem nghe rõ 2 cá tính đối đáp nhau
        prof.baseDetune += isPlayer ? 12 : -14;
        if (stage === "climax" || stage === "finisher") {
            prof.baseRate *= 1.02;
            prof.presenceDb += 0.8;
        }
        return prof;
    },

    _trimAudioBufferSilence: function(buf, ctx) {
        if (!buf || !ctx || buf.length < 400) return buf;
        let ch = buf.getChannelData(0);
        let sr = buf.sampleRate || 24000;
        let len = ch.length;
        let threshold = 0.0075;
        let start = 0;
        let end = len - 1;
        while (start < len - 200 && Math.abs(ch[start]) < threshold) start++;
        while (end > start + 200 && Math.abs(ch[end]) < threshold) end--;

        let padLead = Math.floor(sr * 0.012);
        let padTrail = Math.floor(sr * 0.018);
        start = Math.max(0, start - padLead);
        end = Math.min(len - 1, end + padTrail);
        let newLen = end - start + 1;
        if (newLen >= len * 0.94 || newLen < 200) return buf;

        let out = ctx.createBuffer(1, newLen, sr);
        let dst = out.getChannelData(0);
        let fadeLen = Math.min(Math.floor(sr * 0.008), Math.floor(newLen * 0.1));
        for (let i = 0; i < newLen; i++) {
            let env = 1.0;
            if (i < fadeLen) env = i / fadeLen;
            else if (i > newLen - fadeLen) env = (newLen - i) / fadeLen;
            dst[i] = ch[start + i] * env;
        }
        return out;
    },

    _decodeLocalClipId: function(clipId) {
        if (!clipId || !window.LOCAL_STORY_VOICE_CLIPS || !window.LOCAL_STORY_VOICE_CLIPS[clipId]) {
            return Promise.resolve(null);
        }
        if (this._decodedClipCache.has(clipId)) {
            return Promise.resolve(this._decodedClipCache.get(clipId));
        }
        if (this._clipPromiseCache.has(clipId)) {
            return this._clipPromiseCache.get(clipId);
        }
        if (!window.audioCtx) {
            try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        }
        let ctx = window.audioCtx;
        if (!ctx) return Promise.resolve(null);

        let p = (async () => {
            try {
                let b64 = window.LOCAL_STORY_VOICE_CLIPS[clipId];
                let binStr = atob(b64);
                let len = binStr.length;
                let bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binStr.charCodeAt(i) & 0xff;
                }
                let decoded = await ctx.decodeAudioData(bytes.buffer.slice(0));
                if (decoded && decoded.duration > 0.08) {
                    let trimmed = this._trimAudioBufferSilence(decoded, ctx);
                    this._decodedClipCache.set(clipId, trimmed);
                    return trimmed;
                }
                return null;
            } catch (e) {
                return null;
            } finally {
                this._clipPromiseCache.delete(clipId);
            }
        })();

        this._clipPromiseCache.set(clipId, p);
        return p;
    },

    // Bộ tổng hợp Ngữ Điệu Cảm Xúc (Soulful Prosody Resampler):
    // Biến thiên cao độ (Pitch), nhịp độ (Pace) và trọng âm (Accent) cho từng vế câu (hook !, question ?, punch !)
    // giúp giọng đọc Chị Google thực sự có hồn, biết gằn giọng khiêu khích và lên giọng mỉa mai ở cuối câu hỏi!
    _buildSoulfulExpressiveBuffer: function(clauseItems, profile, stage, ctx) {
        if (!clauseItems || clauseItems.length === 0 || !ctx) return null;
        let sr = (clauseItems[0].buf && clauseItems[0].buf.sampleRate) || 24000;
        let processedArrays = [];
        let totalSamples = 0;

        for (let idx = 0; idx < clauseItems.length; idx++) {
            let item = clauseItems[idx];
            let srcBuf = item.buf;
            if (!srcBuf || srcBuf.length < 100) continue;
            let srcData = srcBuf.getChannelData(0);
            let srcLen = srcData.length;
            let tone = item.tone || "body";

            // Tính toán đường cong tốc độ & cao độ theo sắc thái cảm xúc của vế câu
            let baseRatio = (profile.baseRate || 1.14) * Math.pow(2, (profile.baseDetune || 0) / 1200);
            if (tone === "callout" || tone === "hook") {
                baseRatio *= 1.045;
            } else if (tone === "question") {
                baseRatio *= 1.015;
            } else if (tone === "punch") {
                baseRatio *= 0.99;
            }

            let estOutLen = Math.max(64, Math.ceil(srcLen / (baseRatio * 0.85)));
            let tempOut = new Float32Array(estOutLen);
            let readPos = 0;
            let writeIdx = 0;

            while (readPos < srcLen - 2 && writeIdx < estOutLen) {
                let prog = readPos / srcLen; // 0.0 -> 1.0 trong vế câu
                let centsOffset = 0;
                let gainEnv = 1.0;

                if (tone === "callout" || tone === "hook") {
                    // Mở đầu gọi tên / quát lớn: Nhấn cao độ đầu vế (+45 cents) rồi đanh giọng xuống (-15 cents)
                    centsOffset = 45 * (1 - prog * 1.25) + Math.sin(prog * Math.PI * 2) * 14;
                    gainEnv = prog < 0.42 ? 1.15 : 1.05;
                } else if (tone === "question") {
                    // Câu hỏi cà khịa (?): Lên giọng rõ nét ở 35% cuối câu (+82 cents) cực kỳ có hồn!
                    if (prog < 0.65) {
                        centsOffset = Math.sin(prog * Math.PI * 2.5) * 16;
                        gainEnv = 1.04;
                    } else {
                        let qProg = (prog - 0.65) / 0.35;
                        centsOffset = qProg * qProg * 84;
                        gainEnv = 1.04 + qProg * 0.14;
                    }
                } else if (tone === "punch") {
                    // Câu chốt hạ cuối (!): Nhấn trọng âm mạnh ở giữa và hạ giọng uy quyền ở từ cuối
                    if (prog < 0.72) {
                        centsOffset = 22 * Math.sin(prog * Math.PI * 1.5);
                        gainEnv = 1.14;
                    } else {
                        let pProg = (prog - 0.72) / 0.28;
                        centsOffset = 10 - pProg * 38;
                        gainEnv = 1.14 - pProg * 0.06;
                    }
                } else {
                    // Vế dẫn chuyện giữa câu: Dao động ngữ điệu tự nhiên như người thật nói chuyện
                    centsOffset = Math.sin(prog * Math.PI * 3) * 18;
                    gainEnv = 1.05;
                }

                let instStep = baseRatio * Math.pow(2, centsOffset / 1200);
                let i0 = readPos | 0;
                let frac = readPos - i0;
                let sample = srcData[i0] + frac * (srcData[i0 + 1] - srcData[i0]);
                // Soft-clip nhẹ giữ âm sắc dày, không bao giờ bị rè tiếng
                let boosted = sample * gainEnv;
                if (boosted > 0.96) boosted = 0.96 + (boosted - 0.96) * 0.2;
                else if (boosted < -0.96) boosted = -0.96 + (boosted + 0.96) * 0.2;

                tempOut[writeIdx++] = boosted;
                readPos += instStep;
            }

            let actualSlice = tempOut.subarray(0, writeIdx);
            processedArrays.push(actualSlice);
            totalSamples += actualSlice.length;

            // Khoảng nghỉ lấy hơi tự nhiên giữa các vế câu cảm xúc (Nếu là nối liền tên riêng joinNext thì nối mượt 14ms!)
            if (idx < clauseItems.length - 1) {
                let isJoined = !!clauseItems[idx].joinNext;
                let pauseSec = isJoined
                    ? 0.014
                    : ((tone === "callout" || tone === "hook") ? 0.080 : (tone === "question" ? 0.086 : 0.062));
                let pauseSamples = Math.floor(sr * pauseSec);
                processedArrays.push(new Float32Array(pauseSamples));
                totalSamples += pauseSamples;
            }
        }

        if (totalSamples <= 0) return null;
        let finalBuf = ctx.createBuffer(1, totalSamples, sr);
        let dst = finalBuf.getChannelData(0);
        let offset = 0;
        for (let k = 0; k < processedArrays.length; k++) {
            dst.set(processedArrays[k], offset);
            offset += processedArrays[k].length;
        }
        return finalBuf;
    },

    _getOpponentIdForLine: function(lineObj) {
        if (lineObj && lineObj.opponent) {
            let oid = String(lineObj.opponent.classId || lineObj.opponent.id || "").toLowerCase();
            if (oid) return oid;
        }
        let isPl = !!(lineObj && lineObj.isPlayer);
        let fallbackOpp = isPl
            ? ((window.enemies && window.enemies[0]) || null)
            : (window.p1 || null);
        if (fallbackOpp) {
            let fId = String(fallbackOpp.classId || fallbackOpp.id || "").toLowerCase();
            if (fId) return fId;
        }
        return "ronaldo";
    },

    _getCacheKeyForLine: function(lineObj) {
        if (!lineObj) return "";
        let baseKey = lineObj.voiceKey || lineObj.rawTemplate || lineObj.text || "";
        let oppId = this._getOpponentIdForLine(lineObj);
        return baseKey ? (baseKey + "@@" + oppId) : "";
    },

    _resolveLineClipEntries: function(lineObj) {
        if (!lineObj || !window.LOCAL_STORY_LINE_MAP) return null;
        let map = window.LOCAL_STORY_LINE_MAP;
        let rawEntries = null;
        if (lineObj.voiceKey && map[lineObj.voiceKey]) {
            rawEntries = map[lineObj.voiceKey];
        } else if (lineObj.rawTemplate && map[lineObj.rawTemplate]) {
            rawEntries = map[lineObj.rawTemplate];
        } else if (lineObj.text && map[lineObj.text]) {
            rawEntries = map[lineObj.text];
        }
        if (!rawEntries || rawEntries.length === 0) return null;

        let oppId = this._getOpponentIdForLine(lineObj);
        let nameMap = (window.LOCAL_STORY_ENEMY_NAME_MAP && window.LOCAL_STORY_ENEMY_NAME_MAP[oppId])
            ? window.LOCAL_STORY_ENEMY_NAME_MAP[oppId]
            : null;

        let resolved = [];
        for (let i = 0; i < rawEntries.length; i++) {
            let item = rawEntries[i];
            if (!item) continue;
            if (item.enemySlot) {
                let clipId = null;
                if (nameMap) {
                    clipId = nameMap[item.enemySlot] || nameMap.exclaim || nameMap.mid || nameMap.nay;
                }
                if (!clipId && window.LOCAL_STORY_CALLOUT_MAP && window.LOCAL_STORY_CALLOUT_MAP[oppId]) {
                    clipId = window.LOCAL_STORY_CALLOUT_MAP[oppId][0];
                }
                if (clipId) {
                    resolved.push({
                        id: clipId,
                        tone: item.tone || "callout",
                        joinNext: !!item.joinNext
                    });
                }
            } else if (item.id) {
                resolved.push({
                    id: item.id,
                    tone: item.tone || "body",
                    joinNext: !!item.joinNext
                });
            }
        }
        return resolved.length > 0 ? resolved : null;
    },

    preloadDialogueObj: async function(lineObj) {
        if (!lineObj) return null;
        let cacheKey = this._getCacheKeyForLine(lineObj);
        if (cacheKey && this._lineBufferCache.has(cacheKey)) {
            return this._lineBufferCache.get(cacheKey);
        }

        let entries = this._resolveLineClipEntries(lineObj);
        if (entries && entries.length > 0) {
            let clauseItems = [];
            for (let i = 0; i < entries.length; i++) {
                let decoded = await this._decodeLocalClipId(entries[i].id);
                if (decoded) {
                    clauseItems.push({
                        buf: decoded,
                        tone: entries[i].tone,
                        joinNext: !!entries[i].joinNext
                    });
                }
            }
            if (clauseItems.length > 0 && window.audioCtx) {
                let prof = this._getVoiceProfile(lineObj.speakerId, !!lineObj.isPlayer, lineObj.category);
                let soulfulBuf = this._buildSoulfulExpressiveBuffer(clauseItems, prof, lineObj.category, window.audioCtx);
                if (soulfulBuf && cacheKey) {
                    this._lineBufferCache.set(cacheKey, soulfulBuf);
                }
                return soulfulBuf;
            }
        }

        // Dự phòng cho văn bản tùy chỉnh ngoài kho
        if (lineObj.text) {
            return await this.preloadLine(lineObj.text);
        }
        return null;
    },

    _openIdb: function() {
        if (this._idbPromise) return this._idbPromise;
        if (typeof indexedDB === "undefined") return Promise.resolve(null);
        this._idbPromise = new Promise((resolve) => {
            try {
                let req = indexedDB.open("StickmanGoogleTTS_v1", 1);
                req.onupgradeneeded = function(e) {
                    let db = e.target.result;
                    if (!db.objectStoreNames.contains("tts_mp3")) {
                        db.createObjectStore("tts_mp3");
                    }
                };
                req.onsuccess = function(e) { resolve(e.target.result); };
                req.onerror = function() { resolve(null); };
            } catch (err) {
                resolve(null);
            }
        });
        return this._idbPromise;
    },

    _getIdbMp3: async function(key) {
        try {
            let db = await this._openIdb();
            if (!db) return null;
            return await new Promise((resolve) => {
                let tx = db.transaction("tts_mp3", "readonly");
                let st = tx.objectStore("tts_mp3");
                let r = st.get(key);
                r.onsuccess = () => resolve(r.result || null);
                r.onerror = () => resolve(null);
            });
        } catch (e) {
            return null;
        }
    },

    _setIdbMp3: async function(key, arrayBuf) {
        try {
            let db = await this._openIdb();
            if (!db || !arrayBuf) return;
            let tx = db.transaction("tts_mp3", "readwrite");
            tx.objectStore("tts_mp3").put(arrayBuf, key);
        } catch (e) {}
    },

    cleanTextForSpeech: function(rawText) {
        if (!rawText) return "";
        let s = String(rawText)
            .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]+/gu, " ")
            .replace(/[•|_*#~^`<>[\]{}]/g, " ")
            .replace(/\bSIU+\b/gi, "Siuuu")
            .replace(/\bCR7\b/gi, "Cê Rờ Bảy")
            .replace(/\bM-?TP\b/gi, "Em Ti Pi")
            .replace(/\bHDPE\b/gi, "Hắt Đê Pê E")
            .replace(/\bK\.?O\.?\b/gi, "nốc ao")
            .replace(/\b1\s*HP\b/gi, "một máu")
            .replace(/\bHP\b/gi, "máu")
            .replace(/\bVAR\b/gi, "Va")
            .replace(/\bGOAT\b/gi, "Gốt")
            .replace(/\bC1\b/gi, "Cê một")
            .replace(/\bOut\s+trình\b/gi, "ao trình")
            .replace(/\b500\s*IQ\b/gi, "năm trăm Ai Kiu")
            .replace(/\b999\s*ms\b/gi, "chín trăm chín mươi chín mi li giây")
            .replace(/\b(\d+)\s*km\/h\b/gi, "$1 ki lô mét trên giờ")
            .replace(/\b(\d+)m(\d+)\b/gi, "$1 mét $2")
            .replace(/\bsolo\b/gi, "sô lô")
            .replace(/\bcombo\b/gi, "com bô")
            .replace(/\bstream\b/gi, "lai chim")
            .replace(/\bdonate\b/gi, "đô nết")
            .replace(/\bHat-?trick\b/gi, "Hát trích")
            .replace(/\bPenalty\b/gi, "Pê nan ti")
            .replace(/\bKnuckleball\b/gi, "sút phạt lắc bóng")
            .replace(/\bBicycle\s+Kick\b/gi, "xe đạp chổng ngược")
            .replace(/\bChampions\s+League\b/gi, "Cúp Cê một")
            .replace(/\bWorld\s+Cup\b/gi, "Guôn Cúp")
            .replace(/\bMixiGaming\b/gi, "Mi Xi Gêm Minh")
            .replace(/\bMixiFood\b/gi, "Mi Xi Phút")
            .replace(/\s+/g, " ")
            .trim();
        return s;
    },

    splitTextIntoChunks: function(cleanText, maxLen) {
        let limit = maxLen || 165;
        if (!cleanText) return [];
        if (cleanText.length <= limit) return [cleanText];

        let clauses = cleanText.split(/(?<=[.!?;,])\s+/);
        let chunks = [];
        let cur = "";
        for (let i = 0; i < clauses.length; i++) {
            let part = clauses[i].trim();
            if (!part) continue;
            if (!cur) {
                cur = part;
            } else if ((cur + " " + part).length <= limit) {
                cur += " " + part;
            } else {
                chunks.push(cur);
                cur = part;
            }
        }
        if (cur) chunks.push(cur);
        return chunks;
    },

    estimateSpeechDurationMs: function(text) {
        let clean = this.cleanTextForSpeech(text);
        if (!clean) return 1800;
        let words = clean.split(/\s+/).filter(Boolean).length;
        return Math.max(1500, Math.min(4600, Math.round(words * 225 + 320)));
    },

    _concatAudioBuffers: function(buffers, ctx) {
        if (!buffers || buffers.length === 0) return null;
        if (buffers.length === 1) return buffers[0];
        let sampleRate = buffers[0].sampleRate || 24000;
        let totalLength = 0;
        let pauseSamples = Math.floor(sampleRate * 0.045);
        for (let i = 0; i < buffers.length; i++) {
            totalLength += buffers[i].length + (i < buffers.length - 1 ? pauseSamples : 0);
        }
        let out = ctx.createBuffer(1, totalLength, sampleRate);
        let dst = out.getChannelData(0);
        let offset = 0;
        for (let i = 0; i < buffers.length; i++) {
            let srcData = buffers[i].getChannelData(0);
            dst.set(srcData, offset);
            offset += buffers[i].length + pauseSamples;
        }
        return out;
    },

    _fetchChunkAudioBuffer: async function(chunkText) {
        if (!chunkText) return null;
        if (this._chunkBufferCache.has(chunkText)) {
            return this._chunkBufferCache.get(chunkText);
        }
        if (!window.audioCtx) {
            try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        }
        let ctx = window.audioCtx;
        if (!ctx) return null;

        let cachedMp3 = await this._getIdbMp3(chunkText);
        if (cachedMp3 && cachedMp3.byteLength > 200) {
            try {
                let decodedCached = await ctx.decodeAudioData(cachedMp3.slice(0));
                if (decodedCached && decodedCached.duration > 0.12) {
                    this._chunkBufferCache.set(chunkText, decodedCached);
                    return decodedCached;
                }
            } catch (e) {}
        }
        return null;
    },

    preloadLine: function(rawText) {
        let clean = this.cleanTextForSpeech(rawText);
        if (!clean) return Promise.resolve(null);
        if (this._lineBufferCache.has(clean)) {
            return Promise.resolve(this._lineBufferCache.get(clean));
        }
        return Promise.resolve(null);
    },

    preloadLines: function(lineDescriptorList) {
        if (!Array.isArray(lineDescriptorList)) return;
        (async () => {
            for (let i = 0; i < lineDescriptorList.length; i++) {
                let item = lineDescriptorList[i];
                if (!item) continue;
                try {
                    if (typeof item === "object") {
                        await this.preloadDialogueObj(item);
                    }
                } catch (e) {}
            }
        })();
    },

    getCachedLineBuffer: function(rawText) {
        let clean = this.cleanTextForSpeech(rawText);
        return clean ? (this._lineBufferCache.get(clean) || null) : null;
    },

    isSpeaking: function() {
        return !!this._speakingNow;
    },

    getVoiceProgress: function() {
        if (!this._speakingNow || this._speechDurationMs <= 0) return 0;
        let el = Date.now() - this._speechStartedAt;
        return Math.max(0, Math.min(1, el / this._speechDurationMs));
    },

    stop: function() {
        this._speakingNow = false;
        this._speechDurationMs = 0;
        if (this._activeNodes) {
            let cur = this._activeNodes;
            this._activeNodes = null;
            try { if (cur.src) { cur.src.onended = null; cur.src.stop(); } } catch (e) {}
            try { if (cur.src) cur.src.disconnect(); } catch (e) {}
            try { if (cur.lowEQ) cur.lowEQ.disconnect(); } catch (e) {}
            try { if (cur.presEQ) cur.presEQ.disconnect(); } catch (e) {}
            try { if (cur.delayNode) cur.delayNode.disconnect(); } catch (e) {}
            try { if (cur.wetGain) cur.wetGain.disconnect(); } catch (e) {}
            try { if (cur.recGain) cur.recGain.disconnect(); } catch (e) {}
            try { if (cur.spkGain) cur.spkGain.disconnect(); } catch (e) {}
        }
        if (this._activeUtterance && typeof window.speechSynthesis !== "undefined") {
            this._activeUtterance = null;
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
    },

    // Phát AudioBuffer qua chuỗi Lọc Âm Phòng Thu (Warmth Low-Shelf + Presence EQ + Climax Slapback)
    // Nối TRỰC TIẾP vào window.masterRecordDestination để Video tải về LUÔN LUÔN có 100% giọng đọc sắc nét!
    _playSoulfulBuffer: function(audioBuf, profile, stage, onEndedCallback) {
        if (!audioBuf) return 0;
        if (!window.audioCtx) {
            try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        }
        let ctx = window.audioCtx;
        if (!ctx) return 0;
        if (ctx.state === "suspended") {
            try { ctx.resume(); } catch (e) {}
        }
        if (!window.masterRecordDestination || window.masterRecordDestination.context !== ctx) {
            try { window.masterRecordDestination = ctx.createMediaStreamDestination(); } catch (e) {}
        }
        if (typeof window.ensureMasterAudioBus === "function") {
            try { window.ensureMasterAudioBus(); } catch (e) {}
        }

        let playDurationMs = Math.max(750, Math.round(audioBuf.duration * 1000));
        let now = ctx.currentTime;

        let src = ctx.createBufferSource();
        src.buffer = audioBuf;
        src._internalMasterConnect = true;

        // 1. Low-Shelf EQ (210Hz): Tăng độ ấm và lực dày cho giọng đọc
        let lowEQ = ctx.createBiquadFilter();
        lowEQ.type = "lowshelf";
        lowEQ.frequency.setValueAtTime(210, now);
        lowEQ.gain.setValueAtTime((profile && profile.lowShelfDb) || 2.8, now);
        lowEQ._internalMasterConnect = true;

        // 2. Presence Peaking EQ (3100Hz): Làm rõ phụ âm & dấu thanh tiếng Việt nổi bật trên nền nhạc
        let presEQ = ctx.createBiquadFilter();
        presEQ.type = "peaking";
        presEQ.frequency.setValueAtTime(3100, now);
        presEQ.Q.setValueAtTime(1.05, now);
        presEQ.gain.setValueAtTime((profile && profile.presenceDb) || 3.6, now);
        presEQ._internalMasterConnect = true;

        // 3. Nhánh thu thẳng vào Video Recorder (LUÔN BẬT 100% kể cả khi người chơi bấm tắt loa ngoài!)
        let recGain = ctx.createGain();
        recGain.gain.setValueAtTime(1.48, now);
        recGain._internalMasterConnect = true;

        // 4. Nhánh phát ra Loa ngoài trình duyệt (tôn trọng nút Mute của người chơi)
        let spkGain = ctx.createGain();
        spkGain.gain.setValueAtTime(window.isMuted ? 0.0 : 1.38, now);
        spkGain._internalMasterConnect = true;

        src.connect(lowEQ);
        lowEQ.connect(presEQ);
        presEQ.connect(recGain);
        presEQ.connect(spkGain);

        let delayNode = null;
        let wetGain = null;
        if (stage === "climax" || stage === "finisher" || stage === "outro") {
            try {
                delayNode = ctx.createDelay(0.2);
                delayNode.delayTime.setValueAtTime(0.065, now);
                wetGain = ctx.createGain();
                wetGain.gain.setValueAtTime(0.15, now);
                delayNode._internalMasterConnect = true;
                wetGain._internalMasterConnect = true;
                presEQ.connect(delayNode);
                delayNode.connect(wetGain);
                wetGain.connect(recGain);
                wetGain.connect(spkGain);
            } catch (e) {}
        }

        if (window.masterRecordDestination) {
            try { recGain.connect(window.masterRecordDestination); } catch (e) {}
        }
        if (ctx.destination) {
            try { spkGain.connect(ctx.destination); } catch (e) {}
        }

        let nodeRef = {
            src: src, lowEQ: lowEQ, presEQ: presEQ,
            delayNode: delayNode, wetGain: wetGain,
            recGain: recGain, spkGain: spkGain
        };
        this._activeNodes = nodeRef;
        this._speakingNow = true;
        this._speechStartedAt = Date.now();
        this._speechDurationMs = playDurationMs;

        src.onended = () => {
            if (this._activeNodes === nodeRef) {
                this._activeNodes = null;
                this._speakingNow = false;
            }
            try { src.disconnect(); lowEQ.disconnect(); presEQ.disconnect(); recGain.disconnect(); spkGain.disconnect(); } catch (e) {}
            if (typeof onEndedCallback === "function") onEndedCallback();
        };

        src.start(0);
        return playDurationMs;
    },

    _speakFallbackWebSpeech: function(cleanText, isPlayer, onDurationResolved, onEndedCallback) {
        if (window.isMuted || typeof window.speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
            return false;
        }
        try {
            window.speechSynthesis.cancel();
            let u = new SpeechSynthesisUtterance(cleanText);
            u.lang = "vi-VN";
            u.rate = isPlayer ? 1.15 : 1.10;
            u.pitch = isPlayer ? 1.05 : 0.94;
            u.volume = 1.0;

            let voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            let viVoice = voices.find(v => /vi[-_]?VN/i.test(v.lang) && /Google/i.test(v.name))
                       || voices.find(v => /vi[-_]?VN/i.test(v.lang));
            if (viVoice) u.voice = viVoice;

            let estMs = this.estimateSpeechDurationMs(cleanText);
            this._activeUtterance = u;
            this._speakingNow = true;
            this._speechStartedAt = Date.now();
            this._speechDurationMs = estMs;

            if (typeof onDurationResolved === "function") {
                onDurationResolved(estMs);
            }

            u.onend = u.onerror = () => {
                if (this._activeUtterance === u) {
                    this._activeUtterance = null;
                    this._speakingNow = false;
                }
                if (typeof onEndedCallback === "function") onEndedCallback();
            };

            window.speechSynthesis.speak(u);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Hồi kết trận đấu: đọc "[Tên nhân vật] chiến thắng!" (ví dụ: "Rô Nan Đô chiến thắng!")
    playOutroVoice: function(isP1Win) {
        this.stop();
        let winner = isP1Win
            ? (window.p1 || null)
            : ((window.enemies && window.enemies[0]) || null);
        let winnerId = String((winner && (winner.classId || winner.id)) || "").toLowerCase();
        let clipId = (window.LOCAL_STORY_WINNER_MAP && window.LOCAL_STORY_WINNER_MAP[winnerId]) || null;
        if (!clipId) {
            // Dự phòng: chỉ đọc tên nếu thiếu câu "chiến thắng"
            let nameMap = (window.LOCAL_STORY_ENEMY_NAME_MAP && window.LOCAL_STORY_ENEMY_NAME_MAP[winnerId]) || null;
            clipId = nameMap ? (nameMap.exclaim || nameMap.mid) : null;
        }
        if (!clipId) return;

        let prof = this._getVoiceProfile(winnerId, !!isP1Win, "outro");
        let cacheKey = "OUTRO_WINNER::" + winnerId;
        let cached = this._lineBufferCache.get(cacheKey);
        if (cached) {
            this._playSoulfulBuffer(cached, prof, "outro", null);
            return;
        }
        this._decodeLocalClipId(clipId).then((decoded) => {
            if (!decoded || !window.gameOver || !window.audioCtx) return;
            let buf = this._buildSoulfulExpressiveBuffer(
                [{ buf: decoded, tone: "punch", joinNext: false }],
                prof, "outro", window.audioCtx
            ) || decoded;
            this._lineBufferCache.set(cacheKey, buf);
            this._playSoulfulBuffer(buf, prof, "outro", null);
        });
    },

    speakDialogueLine: function(lineObj, onDurationResolved, onEndedCallback) {
        this.stop();
        if (!lineObj || !lineObj.text) return;

        let prof = this._getVoiceProfile(lineObj.speakerId, !!lineObj.isPlayer, lineObj.category);
        let cacheKey = this._getCacheKeyForLine(lineObj);

        // 1. Nếu AudioBuffer cảm xúc đã được giải mã sẵn trong RAM -> Phát ngay lập tức 0ms!
        let cachedBuf = cacheKey ? this._lineBufferCache.get(cacheKey) : null;
        if (cachedBuf) {
            let playMs = this._playSoulfulBuffer(cachedBuf, prof, lineObj.category, onEndedCallback);
            if (playMs > 0 && typeof onDurationResolved === "function") {
                onDurationResolved(playMs);
            }
            return;
        }

        // 2. Giải mã tức thì từ kho LOCAL_STORY_VOICE_CLIPS trong RAM (< 5ms, không cần mạng!)
        let estMs = this.estimateSpeechDurationMs(lineObj.text);
        if (typeof onDurationResolved === "function") {
            onDurationResolved(estMs);
        }

        this.preloadDialogueObj(lineObj).then((buf) => {
            if (!window.StoryDialogueEngine || window.StoryDialogueEngine.activeLine !== lineObj) return;
            if (buf) {
                let elapsedAlready = Date.now() - (lineObj.startedAt || Date.now());
                let playMs = this._playSoulfulBuffer(buf, prof, lineObj.category, onEndedCallback);
                if (playMs > 0 && typeof onDurationResolved === "function") {
                    onDurationResolved(elapsedAlready + playMs);
                }
            } else {
                let clean = this.cleanTextForSpeech(lineObj.text);
                this._speakFallbackWebSpeech(clean, !!lineObj.isPlayer, null, onEndedCallback);
            }
        });
    }
};

// ==========================================
// KHO KỊCH BẢN DUYÊN NỢ & CHIỀU SÂU CỐT TRUYỆN THEO CẶP ĐẤU (DEEP RIVALRY SCRIPTS)
// Giúp mỗi trận đấu thực sự có hồn, đối đáp đúng tâm lý nhân vật và biến cố trên sân!
// ==========================================
window.DEEP_RIVALRY_SCRIPTS = {
    "ronaldo|messi": {
        opening: "Ê {enemy}! Mang 8 Quả Bóng Vàng ra đây xem có đỡ nổi cú sút Knuckleball 130km/h và pha bật nhảy 2m93 của anh Bảy không nào! ⚽🔥",
        replyOpening: "Bình tĩnh đi {enemy} ơi! Có Cúp Vàng World Cup ở Qatar như tôi chưa mà mới vào trận đã gáy vang cả sân vận động thế?! 🏆🐐",
        mid1: "Nhìn kỹ đây {enemy}! Kỷ luật thép phòng gym mỗi ngày giúp tôi chạy 90 phút không biết mệt, còn ông bắt đầu đi bộ trên sân rồi kìa! 💪⚡",
        mid2: "Tôi đi bộ để quan sát khoảng trống đấy {enemy} ạ! Chỉ cần 1 pha rê bóng lắc hông thôi là hàng thủ của ông tự động ngã sóng xoài! ✨⚽",
        climax: "Phút 90+3 rồi {enemy}! Chuẩn bị nghe cả thế giới đồng thanh hô SIUUUUUU trong trận Siêu Kinh Điển cuối cùng này đi! 👑🔥"
    },
    "ronaldo|vozinha": {
        opening: "Đứng nghiêm lại nào con trai {enemy}! Hôm nay bố kiểm tra bài tập gập bụng 1000 cái và sút phạt hàng rào của con đấy! ⚽💪",
        replyOpening: "Con tập xong từ 5 giờ sáng rồi bố {enemy} ơi! Trận này con sẽ dùng chính tuyệt chiêu SIUUUU của bố để vượt qua bố! 🔥🐐",
        mid1: "Khá lắm {enemy}, lực sút căng đấy! Nhưng muốn thắng được bố thì phải bỏ hẳn nước ngọt và giữ kỷ luật thép thêm 10 năm nữa nhé! 💧😤",
        mid2: "Bố nhìn kỹ pha bứt tốc này đi {enemy}! Dòng máu CR7 trong người con đang sôi sục để lập kỷ lục mới rồi đây! ⚡⚽",
        climax: "Dù kết quả thế nào thì nhà họ Cristiano cũng thống trị giải đấu! Tung cú sút mạnh nhất của con ra đây nào {enemy}! 👑🏆"
    },
    "domixi|phuonghang": {
        opening: "Chào cô {enemy} ạ! Cháu lương tháng có 7 đến 8 triệu bạc bán khô gà thôi, cô đừng lôi sổ đỏ với kim cương ra dọa cháu nhé! 🎙️🐔",
        replyOpening: "Quý vị khán giả nhìn xem kìa! Hôm nay tôi nằm mơ thấy Tộc Trưởng {enemy} giấu quỹ đen trong vỏ case máy tính chưa nộp cho vợ nhé! 💎📢",
        mid1: "Ấy chết cô {enemy} ơi! Cô nói bé cái mồm thôi không bà chủ kênh nhà cháu nghe thấy là tối nay cháu ngủ ngoài gầm cầu thật đấy! 💸😂",
        mid2: "Không phải lươn lẹo nhé {enemy}! Chị đã bật máy livestream chốt đơn là chỉ có chuẩn đét, đố con Lươn Cao Bằng chạy thoát! 🔥💎",
        climax: "Đã thế thì khô máu luôn cô {enemy} ơi! Anh em Bộ Tộc đâu, bật nhạc Độ Tộc 2 át tiếng loa phường của cô Hằng cho tôi! 🎙️⚡"
    },
    "domixi|mtp": {
        opening: "Ê Tùng {enemy}! Anh em Bộ Tộc hỏi bao giờ em mới ra bài mới đấy, hay lại định bắt khán giả chờ tới mùa quýt năm sau?! 🎙️😂",
        replyOpening: "Anh Độ {enemy} cứ bình tĩnh! Nghệ thuật cần thời gian ủ rượu, còn hôm nay Tùng lên đây tặng anh Độ vé về rửa bát sớm nhé! 👑🎶",
        mid1: "Gớm, nhìn quả áo vest tổng tài của {enemy} cháy phết nhờ! Nhưng ăn một rổ Khô Gà MixiFood của anh là hết làm màu ngay! 🐔🔥",
        mid2: "Chúng ta của hiện tại không nói nhiều đâu anh {enemy} ạ! Chỉ cần một giai điệu Sky Tour vang lên là phòng stream của anh sập nguồn! ✨🎤",
        climax: "Tầm này không có nhường nhịn gì nữa nhé {enemy}! Xem Độ Tộc 2 với Sky bên nào gáy to hơn ở giây cuối cùng nào! ⚡👑"
    },
    "elonmusk|billgates": {
        opening: "Này ông già {enemy}! Hệ điều hành Windows của ông lại vừa bị màn hình xanh trên tên lửa SpaceX của tôi đấy, đền tiền đi! 🚀💻",
        replyOpening: "Bớt đăng bài chém gió trên mạng xã hội X lại đi {enemy}! Tiền tôi đi làm từ thiện còn nhiều hơn cả đống xe điện của cậu đấy! 💵😎",
        mid1: "Ông dám bán khống cổ phiếu Tesla của tôi à {enemy}? Hôm nay tôi phóng thẳng vệ tinh Starlink khóa sóng máy tính của ông luôn! 🛰️⚡",
        mid2: "Cậu tưởng mình là Iron Man thật đấy à {enemy}? Để tôi cài bản cập nhật bắt buộc khởi động lại não bộ của cậu ngay giữa trận nhé! 💻🔥",
        climax: "Cuộc chiến Tỷ Phú Thế Giới chỉ có một người đứng đầu bảng xếp hạng Forbes thôi, chuẩn bị bay lên Sao Hỏa đi {enemy}! 🚀👑"
    },
    "elonmusk|donaldtrump": {
        opening: "Ngài Tổng thống {enemy} à! Hôm nay ngài muốn đi chuyên cơ Air Force One hay ngồi xe bọc thép Cybertruck của tôi lên sàn đấu đây?! 🛻🚀",
        replyOpening: "Nghe đây {enemy}! Không ai hiểu về võ thuật hơn tôi cả, tôi sẽ xây một bức tường thuế quan khổng lồ chặn đứng mọi đòn đánh của cậu! 🇺🇸🔥",
        mid1: "Cú đấm vừa rồi là một thương vụ quá tệ hại đối với cậu đấy {enemy}! Chuẩn bị nhận sắc lệnh trục xuất khỏi võ đài đi là vừa! 🦅💼",
        mid2: "Đừng vội ăn mừng ngài {enemy}! Tôi vừa kích hoạt trí tuệ nhân tạo Grok phân tích toàn bộ sơ hở của ngài trong 0.01 giây rồi! 🤖⚡",
        climax: "Cả nước Mỹ và Sao Hỏa đang xem trực tiếp kèo này đấy {enemy}! Đòn quyết định triệu tỷ đô la bắt đầu! 💰👑"
    }
};

window.StoryDialogueEngine = {
    activeLine: null,
    queue: [],
    transcript: [],
    usedTexts: {},
    triggeredStages: {},
    cooldownTicks: 0,
    pendingStageWait: 0,
    act2SpeakerIsPlayer: null,
    _preplannedLines: {},
    _PendingActionPayoff: null,

    _getPairRivalryScript: function(charA, charB) {
        if (!charA || !charB || !window.DEEP_RIVALRY_SCRIPTS) return null;
        let idA = String(charA.classId || charA.id || "").toLowerCase();
        let idB = String(charB.classId || charB.id || "").toLowerCase();
        if (window.DEEP_RIVALRY_SCRIPTS[idA + "|" + idB]) {
            return { pairKey: idA + "|" + idB, script: window.DEEP_RIVALRY_SCRIPTS[idA + "|" + idB], firstIsA: true };
        }
        if (window.DEEP_RIVALRY_SCRIPTS[idB + "|" + idA]) {
            return { pairKey: idB + "|" + idA, script: window.DEEP_RIVALRY_SCRIPTS[idB + "|" + idA], firstIsA: false };
        }
        return null;
    },

    initMatch: function() {
        if (window.GoogleStoryTTS) window.GoogleStoryTTS.stop();
        this.activeLine = null;
        this.queue = [];
        this.transcript = [];
        this.usedTexts = {};
        this.triggeredStages = {
            opening: false,
            mid1: false,
            mid2: false,
            climax: false,
            miracle: false,
            finisher: false
        };
        this.cooldownTicks = 0;
        this.pendingStageWait = 0;
        this.act2SpeakerIsPlayer = null;
        this._preplannedLines = {};
        this._pendingActionPayoff = null;
        window._matchDialogueTranscript = this.transcript;

        if (window.p1) window.p1._isSpeakingNow = false;
        if (window.enemies) {
            window.enemies.forEach(e => { if (e) e._isSpeakingNow = false; });
        }

        // Lên kịch bản sâu sắc cho trận đấu & dựng trước toàn bộ AudioBuffer giọng đọc có hồn ngay trong lúc nhảy Intro!
        let p1 = window.p1;
        let p2 = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
        if (p1 && p2) {
            this._prebuildAndPreloadMatchScript(p1, p2);
        }
    },

    _buildRivalryDescriptor: function(riv, stageKey, dialogCategory, spk, opp) {
        let raw = (riv && riv.script && riv.script[stageKey]) ? riv.script[stageKey] : "";
        let eName = (opp && opp.className) ? opp.className : "Đối thủ";
        let mName = (spk && spk.className) ? spk.className : "Ta";
        let text = String(raw)
            .replace(/\{enemy\}/gi, eName)
            .replace(/\{opp\}/gi, eName)
            .replace(/\{target\}/gi, eName)
            .replace(/\{me\}/gi, mName);
        return {
            text: text,
            rawTemplate: raw,
            voiceKey: (riv && riv.pairKey) ? ("RIV::" + riv.pairKey + "::" + stageKey) : raw,
            speakerId: (spk && (spk.classId || spk.id)) || "fighter",
            isPlayer: !!(spk && spk.isPlayer),
            opponent: opp,
            category: dialogCategory || stageKey
        };
    },

    _prebuildAndPreloadMatchScript: function(p1, p2) {
        let riv = this._getPairRivalryScript(p1, p2);
        let p1Starts = riv ? riv.firstIsA : (Math.random() < 0.58);
        let starter = p1Starts ? p1 : p2;
        let responder = p1Starts ? p2 : p1;
        this._openingStarterIsP1 = p1Starts;

        let openDesc = (riv && riv.script.opening && Math.random() < 0.82)
            ? this._buildRivalryDescriptor(riv, "opening", "opening", starter, responder)
            : this._pickLineDescriptorFromChar(starter, responder, "opening");
        let replyDesc = (riv && riv.script.replyOpening && Math.random() < 0.82)
            ? this._buildRivalryDescriptor(riv, "replyOpening", "replyOpening", responder, starter)
            : this._pickLineDescriptorFromChar(responder, starter, "replyOpening");

        this._preplannedLines = {
            opening_starter: openDesc,
            reply_responder: replyDesc,
            mid1_p1: (riv && riv.firstIsA && riv.script.mid1 && Math.random() < 0.75)
                ? this._buildRivalryDescriptor(riv, "mid1", "midFight", p1, p2)
                : this._pickLineDescriptorFromChar(p1, p2, "midFight"),
            mid1_p2: (riv && !riv.firstIsA && riv.script.mid1 && Math.random() < 0.75)
                ? this._buildRivalryDescriptor(riv, "mid1", "midFight", p2, p1)
                : this._pickLineDescriptorFromChar(p2, p1, "midFight"),
            mid2_p1: (riv && !riv.firstIsA && riv.script.mid2 && Math.random() < 0.75)
                ? this._buildRivalryDescriptor(riv, "mid2", "midFight", p1, p2)
                : this._pickLineDescriptorFromChar(p1, p2, "midFight"),
            mid2_p2: (riv && riv.firstIsA && riv.script.mid2 && Math.random() < 0.75)
                ? this._buildRivalryDescriptor(riv, "mid2", "midFight", p2, p1)
                : this._pickLineDescriptorFromChar(p2, p1, "midFight"),
            climax_p1: (riv && riv.script.climax && Math.random() < 0.72)
                ? this._buildRivalryDescriptor(riv, "climax", "climax", p1, p2)
                : this._pickLineDescriptorFromChar(p1, p2, "climax"),
            climax_p2: this._pickLineDescriptorFromChar(p2, p1, "climax"),
            finisher_p1: this._pickLineDescriptorFromChar(p1, p2, "finisher"),
            finisher_p2: this._pickLineDescriptorFromChar(p2, p1, "finisher")
        };

        if (window.GoogleStoryTTS) {
            window.GoogleStoryTTS.preloadLines([
                this._preplannedLines.opening_starter,
                this._preplannedLines.reply_responder,
                this._preplannedLines.mid1_p1,
                this._preplannedLines.mid1_p2,
                this._preplannedLines.mid2_p1,
                this._preplannedLines.mid2_p2,
                this._preplannedLines.climax_p1,
                this._preplannedLines.climax_p2,
                this._preplannedLines.finisher_p1,
                this._preplannedLines.finisher_p2
            ]);
        }
    },

    isDialoguePausingCombat: function() {
        if (!this.activeLine) return false;
        if (window.gameOver || window.introTimer > 0) return false;
        return !!this.activeLine.pauseCombat;
    },

    getActiveSpeaker: function() {
        return this.activeLine ? this.activeLine.speaker : null;
    },

    _pickLineDescriptorFromChar: function(speaker, opponent, category) {
        if (!speaker) return { text: "", rawTemplate: "", voiceKey: "" };
        let cId = String(speaker.classId || speaker.id || "").toLowerCase();
        let stats = (window.classStats && cId && window.classStats[cId]) ? window.classStats[cId] : null;
        let fullPool = [];

        if (stats && stats.storyDialogues && Array.isArray(stats.storyDialogues[category]) && stats.storyDialogues[category].length > 0) {
            fullPool = stats.storyDialogues[category];
        } else if (stats && stats.trashTalk && Array.isArray(stats.trashTalk.midMatch) && stats.trashTalk.midMatch.length > 0) {
            fullPool = stats.trashTalk.midMatch;
        }

        if (!fullPool || fullPool.length === 0) {
            fullPool = ["Đứng im nhìn kỹ mặt anh đây {enemy}, kèo này mày nằm sàn chắc rồi! 😎🔥"];
        }

        // Ưu tiên chọn những câu đã được đóng gói sẵn giọng đọc Studio trong LOCAL_STORY_LINE_MAP (100% có giọng trong Video Recorder!)
        let indexedPool = fullPool.map((raw, idx) => ({
            raw: raw,
            idx: idx,
            voiceKey: "CHAR::" + cId + "::" + category + "::" + idx
        }));

        if (window.LOCAL_STORY_LINE_MAP) {
            let localMatches = indexedPool.filter(item =>
                window.LOCAL_STORY_LINE_MAP[item.voiceKey] || window.LOCAL_STORY_LINE_MAP[item.raw]
            );
            if (localMatches.length > 0) {
                indexedPool = localMatches;
            }
        }

        let enemyName = (opponent && opponent.className) ? opponent.className : "Đối thủ";
        let myName = speaker.className || "Ta";

        let candidates = indexedPool.filter(item => !this.usedTexts[cId + "::" + item.raw]);
        if (candidates.length === 0) candidates = indexedPool;

        let chosen = candidates[Math.floor(Math.random() * candidates.length)];
        this.usedTexts[cId + "::" + chosen.raw] = true;

        let formattedText = String(chosen.raw)
            .replace(/\{enemy\}/gi, enemyName)
            .replace(/\{opp\}/gi, enemyName)
            .replace(/\{target\}/gi, enemyName)
            .replace(/\{me\}/gi, myName);

        return {
            text: formattedText,
            rawTemplate: chosen.raw,
            voiceKey: chosen.voiceKey,
            speakerId: cId || "fighter",
            isPlayer: !!speaker.isPlayer,
            opponent: opponent,
            category: category
        };
    },

    _pickLineFromChar: function(speaker, opponent, category) {
        let desc = this._pickLineDescriptorFromChar(speaker, opponent, category);
        return desc ? desc.text : "";
    },

    enqueueDialogue: function(speaker, opponent, category, badge, durationTicks, pauseCombat, preselectedItem, actionPayoffType) {
        if (!speaker) return;
        let desc = null;
        if (preselectedItem && typeof preselectedItem === "object" && preselectedItem.text) {
            desc = preselectedItem;
        } else if (typeof preselectedItem === "string" && preselectedItem.trim().length > 0) {
            desc = {
                text: preselectedItem,
                rawTemplate: preselectedItem,
                voiceKey: preselectedItem
            };
        } else {
            desc = this._pickLineDescriptorFromChar(speaker, opponent, category);
        }
        if (!desc || !desc.text) return;

        let text = desc.text;
        let estMs = window.GoogleStoryTTS ? window.GoogleStoryTTS.estimateSpeechDurationMs(text) : 2200;
        let calcTicks = Math.max(85, Math.ceil((estMs + 120) / (1000 / 60)));

        this.queue.push({
            speaker: speaker,
            opponent: opponent,
            speakerId: speaker.classId || speaker.id || "fighter",
            speakerName: speaker.className || (speaker.isPlayer ? "PLAYER 1" : "ENEMY"),
            isPlayer: !!speaker.isPlayer,
            avatarUrl: speaker.avatarUrl || "",
            color: speaker.isPlayer ? "#00f3ff" : "#ff3366",
            charColor: speaker.color || (speaker.isPlayer ? "#00f3ff" : "#ff3366"),
            category: category,
            badge: badge || "HỘI THOẠI",
            text: text,
            rawTemplate: desc.rawTemplate || text,
            voiceKey: desc.voiceKey || desc.rawTemplate || text,
            durationTicks: calcTicks,
            voiceDurationMs: estMs,
            ticksElapsed: 0,
            pauseCombat: (pauseCombat !== undefined) ? pauseCombat : true,
            actionPayoffType: actionPayoffType || null
        });
    },

    // Kích hoạt hành động thực tế trên sân ngay khi nhân vật đọc xong câu thoại (Tạo chiều sâu Lời Nói Đi Đôi Hành Động!)
    _executeStoryActionPayoff: function(finishedLine) {
        if (!finishedLine || window.gameOver) return;
        let spk = finishedLine.speaker;
        let opp = finishedLine.opponent;
        if (!spk || spk.hp <= 0) return;

        let payoff = finishedLine.actionPayoffType;
        if (!payoff) return;

        if (payoff === "clash_rush" && opp && opp.hp > 0) {
            // Vừa đấu khẩu mở màn xong -> 2 bên bật hào quang lao vào ăn tươi nuốt sống nhau!
            let dir = (opp.x >= spk.x) ? 1 : -1;
            spk.vx = dir * 11;
            opp.vx = -dir * 11;
            if (typeof window.spawnAura === "function") {
                window.spawnAura(spk.x, window.GROUND_Y, spk.color || "#00f3ff", 55, 18);
                window.spawnAura(opp.x, window.GROUND_Y, opp.color || "#ff3366", 55, 18);
            }
        } else if (payoff === "rage_boost") {
            // Phản pháo giữa trận -> Hồi Nộ + Bật hào quang phản công ngay lập tức!
            spk.stamina = Math.min(100, (spk.stamina || 0) + 42);
            spk.superArmor = Math.max(spk.superArmor || 0, 35);
            if (typeof window.spawnAura === "function") {
                window.spawnAura(spk.x, window.GROUND_Y, spk.color || "#f1c40f", 65, 22);
            }
            if (window.floatingTexts) {
                window.floatingTexts.push({
                    x: spk.x, y: spk.y - 92,
                    text: "🔥 BÙNG NỔ NỘI LỰC!",
                    color: "#ffeb3b", alpha: 1.0, vx: 0, vy: -1.1,
                    font: "italic 900 17px 'Arial Black', Arial", life: 42, scale: 1.1, noGravity: true
                });
            }
        } else if (payoff === "climax_awakening") {
            // Cao trào sinh tử -> Khán giả thả tim truyền sức mạnh, đầy thanh Nộ chuẩn bị tung Tuyệt Kỹ!
            spk.stamina = 100;
            spk.shield = Math.max(spk.shield || 0, Math.round((spk.maxHp || 100) * 0.12));
            spk.superArmor = Math.max(spk.superArmor || 0, 45);
            window._heartAwakeningBurstUntil = Date.now() + 2600;
            window._heartAwakeningTargetName = (spk.className || "IDOL").toUpperCase();
            if (typeof window.spawnEnergyPillar === "function") {
                window.spawnEnergyPillar(spk.x, window.GROUND_Y, "#ff0055", 52, 22);
            }
            if (window.floatingTexts) {
                window.floatingTexts.push({
                    x: spk.x, y: spk.y - 102,
                    text: "💖 TIM KHÁN GIẢ -> NỘ MAX 100%!",
                    color: "#ff0055", alpha: 1.0, vx: 0, vy: -1.2,
                    font: "italic 900 18px 'Arial Black', Arial", life: 48, scale: 1.15, noGravity: true
                });
            }
        }
    },

    _startNextFromQueue: function() {
        if (this.queue.length === 0) {
            this.activeLine = null;
            if (window.p1) window.p1._isSpeakingNow = false;
            if (window.enemies) window.enemies.forEach(e => { if (e) e._isSpeakingNow = false; });
            if (typeof window.onStoryDialogueEnd === "function") {
                try { window.onStoryDialogueEnd(); } catch (e) {}
            }
            return;
        }

        let next = this.queue.shift();
        next.ticksElapsed = 0;
        next.startedAt = Date.now();
        this.activeLine = next;

        if (window.p1) window.p1._isSpeakingNow = (next.speaker === window.p1);
        if (window.enemies) {
            window.enemies.forEach(e => {
                if (e) e._isSpeakingNow = (next.speaker === e);
            });
        }

        if (next.pauseCombat && !window.gameOver) {
            window.activeSequences = [];
            window.hitStopFrames = 0;
        }

        let record = {
            index: this.transcript.length + 1,
            stage: next.category,
            badge: next.badge,
            speakerId: next.speakerId,
            speakerName: next.speakerName,
            isPlayer: next.isPlayer,
            avatarUrl: next.avatarUrl,
            color: next.color,
            text: next.text,
            timestampSec: Math.max(0, Math.round((window.matchTimer || 0) / 60))
        };
        this.transcript.push(record);
        window._matchDialogueTranscript = this.transcript;

        // Khởi tạo khung hội thoại (window._activeQuote) TRƯỚC KHI kích hoạt giọng đọc để đồng bộ thời lượng chính xác 100%!
        if (typeof window.onStoryDialogueStart === 'function') {
            try {
                window.onStoryDialogueStart(record, next);
            } catch (err) {
                console.warn("Story dialogue hook error:", err);
            }
        }

        // Cho chị Google đọc ngay khi câu chat hiển thị và đồng bộ thời lượng đóng câu chat đúng lúc đọc xong!
        if (window.GoogleStoryTTS) {
            window.GoogleStoryTTS.speakDialogueLine(
                next,
                (resolvedMs) => {
                    if (this.activeLine !== next) return;
                    let totalMs = Math.max(950, resolvedMs + 110);
                    next.voiceDurationMs = resolvedMs;
                    next.durationTicks = Math.max(next.ticksElapsed + 8, Math.ceil(totalMs / (1000 / 60)));
                    if (typeof window.onStoryDialogueDurationUpdate === "function") {
                        try { window.onStoryDialogueDurationUpdate(totalMs); } catch (e) {}
                    }
                },
                () => {
                    // Ngay khi chị Google đọc dứt câu -> Kết thúc câu chat sau đúng 4 nhịp (0.06s) mượt mà!
                    if (this.activeLine === next) {
                        next.durationTicks = Math.min(next.durationTicks, next.ticksElapsed + 4);
                        if (typeof window.onStoryDialogueDurationUpdate === "function") {
                            let elapsedNow = Date.now() - (next.startedAt || Date.now());
                            try { window.onStoryDialogueDurationUpdate(elapsedNow + 70); } catch (e) {}
                        }
                    }
                }
            );
        } else if (typeof window.playSound === 'function') {
            window.playSound(next.isPlayer ? 560 : 440, 'triangle', 0.09, 0.22);
        }
    },

    _isArenaClearForPause: function(p1, p2) {
        if (window.isCinematicActive || window.cinematicTimer > 0 || window.timeStopTimer > 0 || (window.ultZoomTicks || 0) > 0) return false;
        if (window._combatTimers && window._combatTimers.length > 0) return false;
        if ((p1.teslaCar && p1.teslaCar.active) || (p2.teslaCar && p2.teslaCar.active)) return false;
        if (window.projectiles && window.projectiles.length > 0) return false;
        if (window.giantDrops && window.giantDrops.length > 0) return false;
        if (window.cr7Balls && window.cr7Balls.length > 0) return false;
        if (window.theRockBoulders && window.theRockBoulders.length > 0) return false;
        if ((p1.attackTimer || 0) > 6 || (p2.attackTimer || 0) > 6) return false;
        return true;
    },

    triggerFinisher: function(winner, loser) {
        if (this.triggeredStages.finisher || !winner) return;
        this.triggeredStages.finisher = true;
        this.queue = [];
        this.activeLine = null;
        let preText = winner.isPlayer ? this._preplannedLines.finisher_p1 : this._preplannedLines.finisher_p2;
        this.enqueueDialogue(winner, loser, 'finisher', '👑 PHÁN QUYẾT K.O', 145, false, preText, null);
        this._startNextFromQueue();
    },

    update: function(allFighters) {
        let p1 = window.p1;
        let p2 = (window.enemies && window.enemies.length > 0) ? window.enemies[0] : null;
        if (!p1 || !p2) return;

        // 1. Nếu đang có câu thoại hiển thị -> đếm nhịp và chuyển câu tiếp theo ngay khi chị Google đọc xong!
        if (this.activeLine) {
            this.activeLine.ticksElapsed++;
            if (this.activeLine.ticksElapsed >= this.activeLine.durationTicks) {
                let justFinished = this.activeLine;
                if (this.queue.length > 0) {
                    this._startNextFromQueue();
                } else {
                    this.activeLine = null;
                    this.cooldownTicks = 115; // Cho 2 bên giao chiến dồn dập ít nhất ~1.9s trước khi xét mốc mới
                    p1._isSpeakingNow = false;
                    p2._isSpeakingNow = false;
                    if (p1.hp > 0 && p1.state === 'story_talk') p1.state = 'idle';
                    if (p2.hp > 0 && p2.state === 'story_talk') p2.state = 'idle';
                    if (typeof window.onStoryDialogueEnd === "function") {
                        try { window.onStoryDialogueEnd(); } catch (e) {}
                    }
                    this._executeStoryActionPayoff(justFinished);
                }
            }
            return;
        }

        if (this.queue.length > 0) {
            this._startNextFromQueue();
            return;
        }

        p1._isSpeakingNow = false;
        p2._isSpeakingNow = false;

        if (window.introTimer > 0 || window.gameOver || p1.hp <= 0 || p2.hp <= 0) return;

        if (this.cooldownTicks > 0) {
            this.cooldownTicks--;
            return;
        }

        let clearNow = this._isArenaClearForPause(p1, p2);

        // 2. HỒI 1: MỞ MÀN ĐẤU KHẨU (Sau ~1.5s lao vào va chạm nảy lửa đầu trận để giữ chân người xem 100%!)
        if (!this.triggeredStages.opening && window.matchTimer >= 90) {
            this.pendingStageWait++;
            if (clearNow || this.pendingStageWait >= 35) {
                this.triggeredStages.opening = true;
                this.pendingStageWait = 0;
                let p1Starts = (this._openingStarterIsP1 !== undefined) ? this._openingStarterIsP1 : (Math.random() < 0.55);
                let starter = p1Starts ? p1 : p2;
                let responder = p1Starts ? p2 : p1;
                this.enqueueDialogue(starter, responder, 'opening', '🔥 KHAI CHIẾN CÀ KHỊA', 132, true, this._preplannedLines.opening_starter, null);
                this.enqueueDialogue(responder, starter, 'replyOpening', '⚡ ĐÁP TRẢ CỰC GẮT', 132, true, this._preplannedLines.reply_responder, "clash_rush");
                this._startNextFromQueue();
            }
            return;
        }

        let p1Pct = p1.hp / (p1.maxHp || 100);
        let p2Pct = p2.hp / (p2.maxHp || 100);
        let minPct = Math.min(p1Pct, p2Pct);

        // 3. HỒI 2: GIỮA TRẬN HIỆP 1 (Khi 1 bên tụt xuống <= 68% máu)
        if (this.triggeredStages.opening && !this.triggeredStages.mid1 && minPct <= 0.68) {
            this.pendingStageWait++;
            if (clearNow || this.pendingStageWait >= 48) {
                this.triggeredStages.mid1 = true;
                this.pendingStageWait = 0;
                let leader = (p1Pct >= p2Pct) ? p1 : p2;
                let trailer = (leader === p1) ? p2 : p1;
                this.act2SpeakerIsPlayer = !!leader.isPlayer;
                let preMid1 = leader.isPlayer ? this._preplannedLines.mid1_p1 : this._preplannedLines.mid1_p2;
                this.enqueueDialogue(leader, trailer, 'midFight', '😏 CHIẾM THẾ THƯỢNG PHONG', 126, true, preMid1, "rage_boost");
                this._startNextFromQueue();
            }
            return;
        }

        // 4. HỒI 3: PHẢN PHÁO GIÀ DƠ (Khi 1 bên tụt xuống <= 44% máu — người chưa nói ở Hồi 2 sẽ lên tiếng + Bật Nội Lực!)
        if (this.triggeredStages.mid1 && !this.triggeredStages.mid2 && minPct <= 0.44) {
            this.pendingStageWait++;
            if (clearNow || this.pendingStageWait >= 48) {
                this.triggeredStages.mid2 = true;
                this.pendingStageWait = 0;
                let speaker = (this.act2SpeakerIsPlayer === true) ? p2 : p1;
                let other = (speaker === p1) ? p2 : p1;
                let preMid2 = speaker.isPlayer ? this._preplannedLines.mid2_p1 : this._preplannedLines.mid2_p2;
                this.enqueueDialogue(speaker, other, 'midFight', '🌶️ BẬT LẠI KHÔNG TRƯỢT PHÁT NÀO', 126, true, preMid2, "rage_boost");
                this._startNextFromQueue();
            }
            return;
        }

        // 5. HỒI 4: CAO TRÀO SINH TỬ & THỨC TỈNH LẬT KÈO (Khi 1 bên còn <= 24% máu)
        if (this.triggeredStages.mid2 && !this.triggeredStages.climax && minPct <= 0.24) {
            this.pendingStageWait++;
            if (clearNow || this.pendingStageWait >= 42) {
                this.triggeredStages.climax = true;
                this.pendingStageWait = 0;
                // Ưu tiên người đang nguy kịch lên tiếng thức tỉnh lật kèo (hoặc người kết liễu) để tạo kịch tính tột độ!
                let underdog = (p1Pct <= p2Pct) ? p1 : p2;
                let other = (underdog === p1) ? p2 : p1;
                let preClimax = underdog.isPlayer ? this._preplannedLines.climax_p1 : this._preplannedLines.climax_p2;
                this.enqueueDialogue(underdog, other, 'climax', '💀 THỨC TỈNH PHÚT 90+3', 126, true, preClimax, "climax_awakening");
                this._startNextFromQueue();
            }
        }
    }
};
