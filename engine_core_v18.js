// ==========================================
// ENGINE_CORE_V7.JS - ULTIMATE MARTIAL ARTS & UNPREDICTABLE COMEBACK EDITION (60FPS)
// + 100% ENGLISH ARCADE CALLOUTS (AUTO-TRANSLATES VIETNAMESE TEXTS FROM MAIN.JS)
// + 8-STAGE HAND & FOOT MARTIAL ARTS COMBO: PUNCH -> SLIDE SWEEP -> FLYING KNEE -> AIR LAUNCH -> AIR RAVE -> METEOR SLAM -> FINISHER
// + ACROBATIC MOVEMENTS: FLYING JUMP KICKS, LOW SLIDE KICKS, FLASH STEP CROSS-UPS & AIR JUGGLES
// + UNPREDICTABLE COMEBACKS: MIRACLE 1 HP SURVIVAL, COMBO BREAKER, UNDERDOG BOOST & VAMPIRIC CRITS
// + ROCK-SOLID CAMERA (NO TILT/SKEW) & COMPACT TEXT SIZES (NEVER BLOCKS SCREEN)
// ==========================================

window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; 
window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.auras = []; window.lasers = []; window.customObjs = []; window.lensFlares = [];

window.lightningArcs = []; window.energyPillars = []; window.blackHoles = [];
window.bokehs = []; window.spaceRipples = [];
window.activeSequences = []; 

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

const MAX_PARTICLES = 230; 
const MAX_SHOCKWAVES = 16;

// ==========================================
// 1. AUDIO & ENGINE INITIALIZATION
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    
    window.thumbnailConfig = {
        hue: Math.floor(Math.random() * 360),
        title: ["EPIC BRAWL", "STICKMAN VIBES", "LEGENDARY", "SUPREME FIGHT"][Math.floor(Math.random() * 4)],
        emoji: ["🔥", "⚡", "⚔️", "👑"][Math.floor(Math.random() * 4)],
        rayCount: 12
    };

    window.viralShakeMult = 0.6;

    if (!window.audioCtx) { try { window.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} }
    let loadInterval = setInterval(() => {
        window.loadProgress += 15; 
        if (window.loadProgress >= 100) { 
            window.loadProgress = 100; 
            clearInterval(loadInterval); 
            setTimeout(() => { window.isLoading = false; window.playSound(800, 'sine', 0.3, 0.3); }, 150); 
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
        osc.connect(gain); gain.connect(window.audioCtx.destination); let safeVol = Math.min(vol, 0.85); 
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : type; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(18, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
            let snap = window.audioCtx.createOscillator(); let snapGain = window.audioCtx.createGain(); 
            snap.type = 'square'; snap.frequency.setValueAtTime(freq * 2.5, t); snap.frequency.exponentialRampToValueAtTime(30, t + 0.045); 
            snapGain.gain.setValueAtTime(safeVol * 0.35, t); snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.045); 
            snap.connect(snapGain); snapGain.connect(window.audioCtx.destination); snap.start(t); snap.stop(t + 0.045);
        } else { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); 
            gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.55, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
};

// ==========================================
// 2. MULTI-LAYER VFX & MARTIAL ARTS EFFECTS
// ==========================================
window.shakeScreen = function(frames, magnitude) { 
    window.shakeTime = Math.min(frames, 10); 
    window.shakeMag = Math.min(magnitude * 0.35, 3.5); 
};

window.playSequence = function(sequenceEvents) {
    window.activeSequences.push({ currentFrame: 0, events: sequenceEvents });
};

window.spawnEnergyPillar = function(x, y, color, radius, life) { 
    window.energyPillars.push({x: x, y: y, color: color, r: Math.min(radius, 55), life: life, maxLife: life, scaleY: 0}); 
    window.shakeScreen(8, 4); 
};

window.spawnLightning = function(x, y, color, length, branches) { 
    let pts = [{x: x, y: y}]; 
    let currX = x, currY = y; 
    for (let i = 0; i < branches; i++) { 
        currX += (Math.random() - 0.5) * length; 
        currY -= Math.random() * length; 
        pts.push({x: currX, y: currY}); 
    } 
    window.lightningArcs.push({pts: pts, color: color, life: 12, maxLife: 12}); 
};

window.spawnBlackHole = function(x, y, radius, life) { 
    window.blackHoles.push({x: x, y: y - 50, r: Math.min(radius, 65), life: life, maxLife: life}); 
};

window.spawnSpaceRipple = function(x, y, color) { 
    window.spaceRipples.push({x: x, y: y, r: 10, maxR: 250, color: color, life: 26, maxLife: 26}); 
    if (window.shockwaves.length < MAX_SHOCKWAVES) {
        window.shockwaves.push({x: x, y: y, r: 8, maxR: 210, color: color, alpha: 0.85, speed: 15});
    }
};

window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { 
    window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); 
};

window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit, imageUrl = null, imgW = 100, imgH = 100) { 
    window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit, imageUrl: imageUrl, imgW: imgW, imgH: imgH }); 
};

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ 
        x: x, y: y, isRight: isRight, life: 13, maxLife: 13, color: color, 
        scale: (isCrit ? 1.9 : 1.35) * Math.min(scale || 1, 1.55), 
        rotation: rotation 
    }); 
    let sparkCount = isCrit ? 7 : 4;
    for (let i = 0; i < sparkCount; i++) { 
        window.impactSparks.push({ 
            x: x, y: y, 
            vx: (isRight ? 1 : -1) * (Math.random() * 15 + 5), 
            vy: (Math.random() - 0.5) * 14, 
            life: 18 + Math.random() * 8, maxLife: 26, 
            color: color, scale: Math.random() * 1.2 + 0.5 
        }); 
    }
};

// Cross-Slash (X-Slash) + Ground Aura
window.spawnCrossSlash = function(x, y, isRight, color1, color2, scale = 1.45) {
    window.spawnSlash(x, y, isRight, color1, true, scale, -0.48);
    window.spawnSlash(x, y, isRight, color2 || "#ffffff", true, scale * 0.92, 0.48);
    window.spawnAura(x, window.GROUND_Y, color1, 65, 18);
    if (window.shockwaves.length < MAX_SHOCKWAVES) {
        window.shockwaves.push({x: x, y: y, r: 10, maxR: 190, color: color1, alpha: 0.9, speed: 16});
    }
};

// Dynamic Afterimage (Ghost Trail) for acrobatic jumps & slides
window.spawnFighterAfterimage = function(f, customColor) {
    if (!f) return;
    if (!window.ghostTrails) window.ghostTrails = [];
    if (window.ghostTrails.length < 12) {
        window.ghostTrails.push({
            x: f.x, y: f.y,
            scale: f.scale || 1, state: f.state,
            isFacingRight: f.isFacingRight,
            alpha: 0.48, life: 12,
            drawMethod: f.drawMethod,
            isBruceLee: f.isBruceLee, isSamurai: f.isSamurai, isNinja: f.isNinja, isDragon: f.isDragon,
            avatarUrl: f.avatarUrl,
            color: customColor || f.color
        });
    }
};

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    let count = isCrit ? 12 : 6; 
    for (let i = 0; i < count; i++) { 
        let angle = Math.random() * Math.PI * 2; 
        let speed = Math.random() * (isCrit ? 16 : 9) + 2; 
        window.particles.push({ 
            x: x, y: y - 30, 
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, 
            life: 28, maxLife: 28, color: color, size: Math.random() * 4.5 + 2 
        }); 
    } 
};

window.spawnDust = function(x, y) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    for (let i = 0; i < 5; i++) { 
        window.particles.push({ 
            x: x + (Math.random() * 36 - 18), y: y, 
            vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 2 - 0.2, 
            life: 24, maxLife: 24, color: "rgba(189, 195, 199, 0.4)", 
            size: Math.random() * 8 + 5, isGroundDust: true 
        }); 
    } 
};

window.spawnInk = function(x, y, color, isRight) {};
window.spawnForegroundDebris = function(x, y, isRight) {};
window.triggerCinematic = function(caster, callback) { if (callback) callback(); };
window.spawnAura = function(x, y, color, radius, duration) { window.auras.push({ x: x, y: y, color: color, r: Math.min(radius, 80), life: duration, maxLife: duration }); };
window.spawnLaser = function(x, y, isRight, color, width, duration) { window.lasers.push({ x: x, y: y, isRight: isRight, color: color, width: Math.min(width, 36), life: duration, maxLife: duration }); };
window.focusCinematic = function(frames) {};
window.applyFilter = function(type, frames) {};
window.triggerTimeStop = function(frames, caster) { 
    window.playSound(120, 'square', 0.5, 0.6, true); 
    if (window.shockwaves.length < MAX_SHOCKWAVES) { 
        window.shockwaves.push({x: caster.x, y: caster.y, r: 10, maxR: 450, color: "#fff", alpha: 0.85, speed: 30}); 
    } 
};
window.spawnCustomObj = function(x, y, vx, vy, textOrEmoji, color, font, duration, isSpinning = false) { window.customObjs.push({ x: x, y: y, vx: vx, vy: vy, text: textOrEmoji, color: color, font: font, life: duration, maxLife: duration, spin: isSpinning, ang: 0 }); };
window.spawnGlassShatter = function(x, y) { 
    window.playSound(550, 'sawtooth', 0.4, 0.7, true); 
    window.spawnParticles(x, y, "#00f3ff", true); 
    window.spawnSpaceRipple(x, y, "#00f3ff");
};
window.spawnLensFlare = function(x, y, color, scale) {};
window.spawnMangaSFX = function(x, y, isCrit) {};
window.triggerDimensionShatter = function(x, y) {};
window.spawnEnvDamage = function(x, y, type, scale, isBurning = false) {};

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

// ==========================================
// 3. DAMAGE SYSTEM + MIRACLE COMEBACK & COMBO BREAKER (100% ENGLISH)
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    let wasInAir = !target.onGround || target.y < window.GROUND_Y - 5;
    let wasBlocking = target.state === 'block';

    // 1. PERFECT EVADE (Flash Step Dodge)
    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 16) {
            window.playSound(800, 'sine', 0.4, 0.8, true); 
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "⚡ EVADED!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 38, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            window.spawnParticles(target.x, target.y - 40, "#00f3ff", true);
            window.spawnSpaceRipple(target.x, target.y - 40, "#00f3ff");
            window.spawnFighterAfterimage(target, "#00f3ff");
            target.stamina = Math.min(100, target.stamina + 35); 
            target.x += target.isFacingRight ? -95 : 95; 
            target.iFrames = 26; 
            return; 
        }
    }

    // 2. COMBO BREAKER (Shockwave Escape when trapped in a long combo)
    target.consecutiveHitsTaken = (target.consecutiveHitsTaken || 0) + 1;
    target.lastHitResetTimer = 45;
    let hpRatio = target.hp / (target.maxHp || 100);
    if (target.consecutiveHitsTaken >= 4 && hpRatio < 0.65 && (!target.breakerCooldown || target.breakerCooldown <= 0) && Math.random() < 0.45) {
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
        window.spawnEnergyPillar(target.x, window.GROUND_Y, "#00f3ff", 45, 22);
        window.spawnLightning(target.x, target.y - 40, "#00f3ff", 35, 5);
        window.floatingTexts.push({ 
            x: target.x, y: target.y - 90, text: "⚡ COMBO BREAKER!", color: "#00f3ff", 
            alpha: 1.0, vx: 0, vy: -1.4, font: "bold 16px Arial", life: 42, 
            scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        let allFighters = [window.p1].concat(window.enemies);
        allFighters.forEach(e => {
            if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 165) {
                e.vx = (e.x > target.x ? 1 : -1) * 11.5;
                e.vy = -6;
                e.onGround = false;
                e.state = 'hurt';
                e.hitStun = 28;
                window.spawnDust(e.x, window.GROUND_Y);
            }
        });
        return;
    }

    let finalDmg = amount;

    // 3. BLOCK, PARRY & GUARD CRUSH
    if (target.state === 'block') { 
        if (target.stamina < 15) {
            target.stamina = 0; target.state = 'stunned'; target.stunTimer = 85; target.hitStun = 85; 
            window.spawnParticles(target.x, target.y - 40, "#ff003c", true); 
            window.spawnGlassShatter(target.x, target.y - 40);
            window.floatingTexts.push({ x: target.x, y: target.y - 85, text: "💔 GUARD CRUSH!", color: "#ff003c", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 45, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
        } 
        else if (target.attackTimer >= 20) { 
            window.playSound(650, 'triangle', 0.4, 0.85, true); 
            window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
            window.spawnSpaceRipple(target.x, target.y - 40, "#00ffff");
            window.spawnLightning(target.x, target.y - 40, "#00ffff", 25, 4);
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🛡️ PARRY COUNTER!", color: "#00ffff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            target.stamina = Math.min(100, target.stamina + 35); 
            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => { 
                if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 145) { 
                    e.state = 'hurt'; e.hitStun = 45; e.vx = target.isFacingRight ? 10 : -10; 
                    e.vy = -5; e.onGround = false;
                    window.spawnDust(e.x, e.y); 
                } 
            });
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
            finalDmg *= 1.22; // Bonus Air Juggle damage
        }

        // MIRACLE 1 HP LAST STAND (Unpredictable Comeback Mechanic)
        let canMiracle = !target.miracleUsed && (target.isPlayer || window.enemies.length === 1);
        if (canMiracle && (target.hp - finalDmg <= 0) && Math.random() < 0.82) {
            target.miracleUsed = true;
            target.hp = Math.floor(target.maxHp * 0.16) + 1;
            target.shield = Math.floor(target.maxHp * 0.12);
            target.stamina = 100; // Instant 100% Stamina for Ultimate reversal!
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
            window.spawnEnergyPillar(target.x, window.GROUND_Y, miracleColor, 55, 45);
            window.spawnSpaceRipple(target.x, target.y - 40, miracleColor);
            window.spawnCrossSlash(target.x, target.y - 40, target.isFacingRight, miracleColor, "#ffffff", 1.7);
            window.spawnLightning(target.x, target.y - 45, miracleColor, 35, 5);

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
                    e.vx = (e.x > target.x ? 1 : -1) * 12;
                    e.vy = -7;
                    e.onGround = false;
                    e.state = 'hurt';
                    e.hitStun = 32;
                }
            });

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
            window.spawnLightning(target.x, target.y - 40, color || "#f1c40f", 28, 3);
            window.spawnSpaceRipple(target.x, target.y - 40, color || "#f1c40f");
            window.targetZoom = 1.06;
            setTimeout(() => { window.targetZoom = 1.0; }, 120);
        }

        if (target.hp > 0 && wasInAir && !wasBlocking) {
            target.vy = isCrit ? -10 : -7.5; 
            target.onGround = false;
            window.spawnLightning(target.x, target.y - 45, "#00f3ff", 22, 3);
        }

        if (target.superArmor <= 0 && target.state !== 'stunned') { 
            target.state = 'hurt'; 
            target.hitStun = isCrit ? 20 : 12; 
            target.attackTimer = 0; 
            target.comboStep = 0; 
        }
        if (wallBounce) { target.vx = target.isFacingRight ? -6 : 6; } 
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        // 6. K.O FINISH VFX
        if (target.hp <= 0) {
            window.spawnEnergyPillar(target.x, window.GROUND_Y, "#ff003c", 52, 45);
            window.spawnSpaceRipple(target.x, target.y - 40, "#ff003c");
            window.spawnCrossSlash(target.x, target.y - 40, attackerDirRight, "#ff003c", "#f1c40f", 1.65);
            window.floatingTexts.push({ 
                x: target.x, y: target.y - 95, text: "💀 K.O!", color: "#ff4757", 
                alpha: 1.0, vx: 0, vy: -0.6, font: "italic 900 22px 'Arial Black', Impact", 
                life: 70, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
            });
            window.shakeScreen(10, 6);
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
// 4. 8-STAGE HAND & FOOT MARTIAL ARTS COMBO SYSTEM (SLIDES, JUMPS & AIR COMBOS)
// ==========================================
window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) { attacker.state = 'jab'; attacker.attackTimer = 10; return; }

    let MathDist = Math.abs(attacker.x - target.x); 
    let reach = 90 * (attacker.scale || 1); 
    attacker.isFacingRight = target.x > attacker.x;
    let dir = attacker.isFacingRight ? 1 : -1;

    // ----------------------------------------------------
    // A. ACROBATIC GAP CLOSERS (SLIDE KICK OR FLYING JUMP KICK)
    // ----------------------------------------------------
    if (MathDist > reach + 15) { 
        if (MathDist < 240 && Math.random() < 0.55) {
            if (Math.random() < 0.5) {
                // 1. FLYING JUMP KICK (Leaps through the air with a high kick / spinning heel)
                attacker.state = Math.random() < 0.5 ? 'high_kick' : 'spinning_heel';
                attacker.vy = -9.0;
                attacker.vx = dir * ((attacker.currentSpeed || 5) * 2.5);
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
                // 2. JET SLIDE SWEEP (Slides low across the ground to trip the opponent)
                attacker.state = 'low_kick';
                attacker.vx = dir * ((attacker.currentSpeed || 5) * 3.1);
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
        // Standard High-Speed Dash
        attacker.vx = dir * (attacker.currentSpeed || 5) * 3.2; 
        attacker.state = 'dash'; 
        attacker.attackTimer = 11; 
        window.spawnDust(attacker.x, attacker.y); 
        window.spawnFighterAfterimage(attacker);
        return; 
    }

    // ----------------------------------------------------
    // B. 8-STAGE HAND-TO-FOOT MARTIAL ARTS COMBO TREE
    // ----------------------------------------------------
    let step = attacker.comboStep || 0;
    let selectedMove = 'jab';
    let isFinisher = false;
    let isLauncher = false;
    let isMultiHit = false;
    let isSlideSweep = false;
    let isMeteorSlam = false;
    let isFlyingKick = false;

    // If enemy is already airborne, automatically perform an Aerial Pursuit / Air Combo!
    let targetInAir = !target.onGround && target.y < window.GROUND_Y - 25;

    if (targetInAir && step >= 4 && Math.random() < 0.75) {
        if (step >= 6) {
            // METEOR AXE SLAM: Jump up and slam the airborne enemy straight into the floor!
            selectedMove = 'axe_kick';
            isMeteorSlam = true;
            attacker.vy = -6;
            attacker.onGround = false;
            attacker.comboStep = 0;
        } else {
            // AIR RAVE: Leap up to match target's height and kick/flurry in mid-air!
            selectedMove = Math.random() < 0.5 ? 'spinning_heel' : 'asura_strike';
            isMultiHit = true;
            attacker.vy = -8.5;
            attacker.onGround = false;
        }
    } else if (step === 0) {
        // Stage 1: Fast Hand Strike Opener
        selectedMove = Math.random() < 0.5 ? 'jab' : 'palm_strike';
    } else if (step === 1) {
        // Stage 2: Step-In Power Punch
        selectedMove = Math.random() < 0.5 ? 'cross' : 'hook';
    } else if (step === 2) {
        // Stage 3: Low Slide Kick / Push Kick (Hand-to-Foot Transition)
        selectedMove = Math.random() < 0.5 ? 'low_kick' : 'teep_kick';
        isSlideSweep = true;
    } else if (step === 3) {
        // Stage 4: Hopping Knee Strike or Muay Thai Elbow
        selectedMove = Math.random() < 0.55 ? 'knee_strike' : 'elbow_strike';
        if (selectedMove === 'knee_strike' && attacker.onGround) {
            attacker.vy = -5.5; // Hop into a Flying Knee!
            attacker.onGround = false;
        }
    } else if (step === 4) {
        // Stage 5: Acrobatic Launcher (Uppercut or Rising High Kick)
        selectedMove = Math.random() < 0.5 ? 'uppercut' : 'high_kick';
        isLauncher = true;
        if (attacker.onGround) {
            attacker.vy = -7.0; // Attacker jumps up with the launcher!
            attacker.onGround = false;
        }
    } else if (step === 5) {
        // Stage 6: Rapid Multi-Hit Martial Arts Flurry (Punches + Kicks)
        selectedMove = Math.random() < 0.5 ? 'dempsey_roll' : 'asura_strike';
        isMultiHit = true;
    } else if (step === 6) {
        // Stage 7: Tornado Spin Kick or Jumping Axe Kick
        selectedMove = Math.random() < 0.5 ? 'spinning_heel' : 'axe_kick';
        if (selectedMove === 'axe_kick') {
            isMeteorSlam = true;
            if (attacker.onGround) { attacker.vy = -7.5; attacker.onGround = false; }
        } else {
            isFlyingKick = true;
            if (attacker.onGround) { attacker.vy = -6.0; attacker.onGround = false; }
        }
    } else {
        // Stage 8+: Grand Martial Arts Finisher (or Flash Step Behind Enemy!)
        if (Math.random() < 0.38) {
            // FLASH STEP CROSS-UP: Teleport behind the enemy and strike!
            window.spawnFighterAfterimage(attacker, "#00f3ff");
            attacker.x = target.x + (attacker.isFacingRight ? 55 : -55);
            attacker.isFacingRight = !attacker.isFacingRight;
            dir = attacker.isFacingRight ? 1 : -1;
            window.floatingTexts.push({ x: attacker.x, y: attacker.y - 85, text: "💨 FLASH CROSS-UP!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
        }
        let finishers = ['dragon_uppercut', 'one_inch_punch', 'asura_strike', 'shoulder_bash'];
        selectedMove = finishers[Math.floor(Math.random() * finishers.length)];
        isFinisher = true;
        attacker.comboStep = 0; 
    }

    // Clutch Finisher chance when in Rage or Underdog state
    if (!isFinisher && !isMeteorSlam && (attacker.isRage || attacker.isUnderdog) && step >= 3 && Math.random() < 0.38) {
        let clutchFinishers = ['dragon_uppercut', 'one_inch_punch', 'asura_strike'];
        selectedMove = clutchFinishers[Math.floor(Math.random() * clutchFinishers.length)];
        isFinisher = true;
        attacker.comboStep = 0;
    }

    attacker.state = selectedMove; 
    attacker.attackTimer = isFinisher ? 24 : (isMultiHit ? 22 : 14); 
    
    // Apply dynamic forward momentum for slides, kicks, and finishers
    if (isSlideSweep) {
        attacker.vx = dir * 8.0;
        window.spawnDust(attacker.x, window.GROUND_Y);
    } else if (isFlyingKick || isMeteorSlam) {
        attacker.vx = dir * 5.5;
    } else {
        attacker.vx = dir * (isFinisher ? 6.0 : (isLauncher ? 4.0 : 2.5)); 
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
// 5. CORE PHYSICS UPDATE, UNDERDOG SCALING & BOSS AI
// ==========================================
window.update = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx || !window.p1 || window.isLoading) return; 

    // Lock camera tilt/skew/3D orbit to 0 for a clean, stable fighting stage
    window.actionCamOffsetX = 0; 
    window.actionCamOffsetY = 0; 
    window.actionCamSkew = 0; 
    window.cameraTilt = 0;
    window.targetTilt = 0;
    window.camOrbitAngle = 0;
    window.targetCamOrbitAngle = 0;
    window.isSpinningCam = false;

    window.lightningArcs.forEach(l => l.life--); window.lightningArcs = window.lightningArcs.filter(l => l.life > 0);
    window.energyPillars.forEach(p => { p.life--; p.scaleY += (1 - p.scaleY) * 0.22; }); window.energyPillars = window.energyPillars.filter(p => p.life > 0);
    window.blackHoles.forEach(b => b.life--); window.blackHoles = window.blackHoles.filter(b => b.life > 0);
    window.spaceRipples.forEach(r => { r.r += 12; r.life--; }); window.spaceRipples = window.spaceRipples.filter(r => r.life > 0);
    window.auras.forEach(a => a.life--); window.auras = window.auras.filter(a => a.life > 0);
    window.lasers.forEach(l => l.life--); window.lasers = window.lasers.filter(l => l.life > 0);

    if (window.gameOver) { window.matchEndTimer = (window.matchEndTimer || 0) + 1; }
    if (window.introTimer > 0) { window.introTimer -= 2; }
    window.globalWind = Math.sin(Date.now() / 2500) * 1.2;

    if (!window.gameOver) {
        window.matchTimer++; 
        if (window.matchTimer === 1) { window.envHazards = []; window.envDamage = []; }
        
        let hazardChance = 0.0012; 
        if (Math.random() < hazardChance && window.projectiles.length < 6) { 
            window.projectiles.push({ x: Math.random() * window.canvas.width, y: -80, vx: (Math.random() - 0.5) * 3, vy: 8 + Math.random() * 4, radius: 12, color: "#e67e22", dmg: 35, target: null, isMeteor: true }); 
        }
    }

    if (window.shakeTime > 0) window.shakeTime--; 
    if (window.cinematicTimer > 0) { 
        window.cinematicTimer--; 
        if (window.cinematicTimer === 0 && window.cinematicCallback) { 
            try { window.cinematicCallback(); } catch(e) {} 
            window.cinematicCallback = null; 
        } 
    }

    let allFighters = [window.p1].concat(window.enemies);

    // Projectiles & Meteors
    for (let i = window.projectiles.length - 1; i >= 0; i--) {
        let proj = window.projectiles[i]; 
        proj.x += proj.vx; 
        proj.y += proj.vy;
        if (proj.isMeteor) {
            window.particles.push({ x: proj.x, y: proj.y, vx: 0, vy: -1.5, life: 12, maxLife: 12, color: "#f1c40f", size: 3 });
            if (proj.y >= window.GROUND_Y) {
                window.shakeScreen(8, 4); 
                window.playSound(200, 'sawtooth', 0.35, 0.45, true);
                if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: proj.x, y: window.GROUND_Y, r: 10, maxR: 130, color: "#e74c3c", alpha: 0.85, speed: 10});
                allFighters.forEach(fighter => { 
                    if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 85 && fighter.y >= window.GROUND_Y - 50) { 
                        window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false, true); 
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

    for (let i = window.traps.length - 1; i >= 0; i--) { 
        window.traps[i].life--; 
        if (window.traps[i].life <= 0) window.traps.splice(i, 1); 
    }
    
    for (let i = window.shockwaves.length - 1; i >= 0; i--) { 
        let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.045; 
        if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); 
    }
    
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { 
        window.impactSparks[i].x += window.impactSparks[i].vx; 
        window.impactSparks[i].y += window.impactSparks[i].vy; 
        window.impactSparks[i].vy += window.GRAVITY * 0.6; 
        window.impactSparks[i].life--; 
        if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); 
    }
    
    for (let i = window.particles.length - 1; i >= 0; i--) { 
        let pt = window.particles[i]; 
        if (pt.isAuraFlame) { pt.vy -= 0.35; pt.size *= 0.95; }
        else if (!pt.isGroundDust) { pt.vy += window.GRAVITY * 0.7; }
        pt.x += pt.vx; pt.y += pt.vy; pt.life--; 
        if (pt.life <= 0) window.particles.splice(i, 1); 
    }

    for (let i = window.slashes.length - 1; i >= 0; i--) { 
        window.slashes[i].life--; 
        if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); 
    }

    // Enemy Defeat & Kill Heal
    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; 
            window.spawnParticles(e.x, e.y, "#fff", true); 
            if (window.p1 && window.p1.hp > 0) { 
                let heal = Math.floor(window.p1.maxHp * 0.08); 
                window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); 
                window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 75, text: `+${heal} HP 💚`, color: "#2ed573", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 38, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
            }
        }
    });
    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { 
        window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -8; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; 
    }
    
    let gameContext = { 
        floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, 
        spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, 
        playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, 
        dash: (f, fx, fy) => { f.vx = fx; if (fy) { f.vy = fy; f.onGround = false; } f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnFighterAfterimage(f); }, 
        teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if (dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, 
        addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, 
        setInvulnerable: (f, fr) => { f.iFrames = fr; } 
    };

    // Update Fighters & Dynamic Underdog Comeback AI
    allFighters.forEach(f => {
        if (!f) return;
        
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; 
            f.vy += window.GRAVITY * 0.5; 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.92; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }

        if (f.iFrames > 0) f.iFrames--;
        if (f.attackTimer > 0) f.attackTimer--; 
        if (f.hitStun > 0) f.hitStun--; 
        if (f.dashTimer > 0) f.dashTimer--; 
        if (f.aiDelay > 0) f.aiDelay--;
        if (f.breakerCooldown > 0) f.breakerCooldown--;
        if (f.lastHitResetTimer > 0) { f.lastHitResetTimer--; if (f.lastHitResetTimer <= 0) f.consecutiveHitsTaken = 0; }
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout <= 0) f.comboStep = 0; }
        if (f.comboTimer > 0) f.comboTimer--; 
        if (f.superArmor > 0) f.superArmor--;
        
        if (f.comboDisplayTimer > 0) { f.comboDisplayTimer--; f.comboAlpha = 1; } 
        else if (f.comboHits > 0) { f.comboAlpha = (f.comboAlpha || 1) - 0.025; if (f.comboAlpha <= 0) { f.comboAlpha = 0; f.comboHits = 0; } }

        if (window.gameOver && f.hp > 0) {
            f.dashTimer = 0; 
            if (f.onGround) { f.vx *= 0.5; if (Math.abs(f.vx) < 0.5) f.vx = 0; }
            if (f.state === 'walk' || f.state === 'dash' || f.state === 'dash_back') f.state = 'idle';
        }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) f.state = 'idle'; }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') f.state = 'idle'; }
        if (f.state === 'idle' || f.state === 'walk') f.iFrames = 0;

        let targetGroup = f.isPlayer ? window.enemies : [window.p1]; 
        let closestTarget = window.getClosestEnemy(f, targetGroup);

        // DYNAMIC UNDERDOG & RAGE AWAKENING
        let myHpPct = f.hp / (f.maxHp || 100);
        let oppHpPct = (closestTarget && closestTarget.maxHp) ? (closestTarget.hp / closestTarget.maxHp) : myHpPct;
        let hpDeficit = Math.max(0, oppHpPct - myHpPct);

        f.isUnderdog = (hpDeficit > 0.18);
        f.isRage = (f.hp > 0 && myHpPct <= 0.30); 
        f.currentSpeed = f.speed || 4; 
        f.currentDmgMod = f.dmgMod || 1; 
        f.dynamicCritChance = (f.critChance || 0.12) + (hpDeficit * 0.45);

        if (f.isUnderdog) {
            f.currentSpeed *= (1 + hpDeficit * 0.35);
            f.currentDmgMod *= (1 + hpDeficit * 0.45);
        }

        if (f.isRage) { 
            f.currentSpeed *= 1.4; 
            f.currentDmgMod *= 1.35; 
            if (window.particles.length < MAX_PARTICLES && Math.random() < 0.45) { 
                let auraColor = f.isPlayer ? "#ff4757" : "#9b59b6"; 
                window.particles.push({ x: f.x + (Math.random() - 0.5) * 45, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1.5, vy: -Math.random() * 6 - 3, life: 30, maxLife: 30, color: auraColor, size: Math.random() * 6 + 3, isAuraFlame: true }); 
            }
            if (Math.random() < 0.05) window.spawnLightning(f.x, f.y - 40, f.isPlayer ? "#ff4757" : "#9b59b6", 22, 3);
        }

        // Spawn afterimages automatically when performing aerial moves or fast slides
        if (!f.onGround && Math.abs(f.vy) > 3 && Math.random() < 0.45) {
            window.spawnFighterAfterimage(f);
        }

        let staminaGain = f.isRage ? 0.55 : (f.regen * 0.22 || 0.07);
        if (f.isUnderdog) staminaGain += hpDeficit * 0.35;
        if (f.hp > 0 && f.stamina < 100) f.stamina += staminaGain; 
        if (f.stamina > 100) f.stamina = 100;

        for (let i = f.buffs.length - 1; i >= 0; i--) { 
            let b = f.buffs[i]; b.life--; 
            if (b.life <= 0) { f.buffs.splice(i, 1); continue; } 
            if (b.stat === 'dmg') f.currentDmgMod += b.value; 
            if (b.stat === 'speed') f.currentSpeed += b.value; 
        }

        let launchedUltimate = false; 

        // Auto-Trigger Ultimate at 100 Stamina
        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x; 
                let absDist = Math.abs(distToTarget); 
                let type = (f.classId || "dausi").toLowerCase(); 
                let isCloseEnough = (absDist < 230) || type.includes('satthu') || type.includes('phapsu');
                if (isCloseEnough) {
                    if (window.classStats && window.classStats[type] && typeof window.classStats[type].executeUltimate === 'function') {
                        f.stamina = 0; 
                        let baseDmg = (f.isPlayer ? 50 : 38) * (f.currentDmgMod || 1); 
                        window.playSound(400, 'sine', 0.4, 0.5); 
                        window.spawnParticles(f.x, f.y, "#f1c40f", true); 
                        window.floatingTexts.push({ x: f.x, y: f.y - 90, text: f.isPlayer ? "🔥 ULTIMATE ARTS!" : "⚠️ DANGER!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.0, font: "bold 17px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
                        f.isFacingRight = distToTarget > 0; 
                        window.classStats[type].executeUltimate(f, closestTarget, baseDmg); 
                        f.vx = 0; 
                    } else if (typeof window.useUltimate === 'function') { 
                        window.useUltimate(f, closestTarget); 
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

        // BOSS & FIGHTER AI
        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (f.isDragon) {
                if (f.hp > 0 && f.hp <= f.maxHp * 0.35 && !f.isEvolved) { 
                    f.isEvolved = true; f.color = "#8e44ad"; f.scale *= 1.18; 
                    window.playSound(60, 'sawtooth', 1.2, 0.8, true);
                    window.spawnEnergyPillar(f.x, window.GROUND_Y, "#8e44ad", 55, 45);
                    window.spawnSpaceRipple(f.x, window.GROUND_Y - 40, "#8e44ad");
                    window.floatingTexts.push({ x: f.x, y: f.y - 115, text: "🐉 DARK DRAGON AWAKENED!", color: "#9b59b6", alpha: 1.0, vx: 0, vy: -1, font: "bold 17px Arial", life: 60, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
                }
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isEvolved ? 12 : 24; 
                        let randAction = Math.random();
                        if (randAction < 0.45) { 
                            f.state = 'breathe_fire'; f.attackTimer = 40; f.vx = 0; 
                            window.playSound(250, 'sawtooth', 0.5, 0.35, false);
                            let fireCount = 0;
                            let fireInterval = setInterval(() => {
                                if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(fireInterval); return; }
                                let fireVx = f.isFacingRight ? (f.isEvolved ? 14 : 11) : (f.isEvolved ? -14 : -11);
                                if (f.isEvolved) {
                                    window.spawnProjectile(f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, -2.5, 14, "#9b59b6", Math.floor(28 * f.dmgMod), window.p1);
                                    window.spawnProjectile(f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 0, 14, "#8e44ad", Math.floor(28 * f.dmgMod), window.p1);
                                    window.spawnProjectile(f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 2.5, 14, "#9b59b6", Math.floor(28 * f.dmgMod), window.p1);
                                } else {
                                    window.spawnProjectile(f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, (Math.random() - 0.5) * 3, 13, "#e74c3c", Math.floor(22 * f.dmgMod), window.p1);
                                }
                                fireCount++;
                                if (fireCount >= (f.isEvolved ? 6 : 4)) clearInterval(fireInterval);
                            }, 75);
                        } else if (randAction < 0.85) { 
                            f.state = 'scratch'; f.attackTimer = 30; f.vx = Math.sign(dist) * f.currentSpeed * (f.isEvolved ? 1.8 : 1.5); 
                            let scratchCount = 0;
                            let scratchInterval = setInterval(() => {
                                if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(scratchInterval); return; }
                                if (Math.abs(window.p1.x - f.x) < (f.isEvolved ? 155 : 130)) {
                                    window.takeDamage(window.p1, Math.floor(10 * f.dmgMod * (f.isEvolved ? 1.4 : 1)), f.isEvolved ? "#9b59b6" : "#ff7675", Math.random() < 0.25);
                                    window.spawnSlash(window.p1.x, window.p1.y - 35, f.isFacingRight, f.isEvolved ? "#9b59b6" : "#ff4757", false, 1.3, (Math.random() - 0.5) * 0.6);
                                }
                                scratchCount++;
                                if (scratchCount >= 4) clearInterval(scratchInterval);
                            }, 65);
                        } else { 
                            f.vx = Math.sign(dist) * (f.currentSpeed * 0.4); f.state = 'walk'; 
                        }
                    }
                }
            } 
            else if (f.isBruceLee) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 10) + 6; 
                        let randAction = Math.random();
                        if (absDist > 110) { 
                            if (Math.random() < 0.45) {
                                // Bruce Lee Flying Dragon Kick
                                f.state = 'high_kick'; f.vy = -8.5; f.vx = Math.sign(dist) * f.currentSpeed * 2.4; f.onGround = false; f.attackTimer = 18;
                                window.spawnFighterAfterimage(f, "#f1c40f");
                                window.floatingTexts.push({ x: f.x, y: f.y - 85, text: "🦅 DRAGON KICK!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                            } else {
                                f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.5; 
                            }
                        } 
                        else if (randAction < 0.34) { 
                            f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 4; 
                            window.playSound(380, 'square', 0.25, 0.85, true);
                            if (absDist < 75) {
                                window.takeDamage(window.p1, Math.floor(30 * f.currentDmgMod), "#f1c40f", true, false, f.isFacingRight); 
                                window.p1.vx = Math.sign(dist) * 7;
                                window.spawnLaser(f.x, f.y - 38, f.isFacingRight, "#f1c40f", 22, 10);
                                window.spawnSpaceRipple(window.p1.x, window.p1.y - 40, "#f1c40f");
                                window.floatingTexts.push({ x: f.x, y: f.y - 85, text: "🗣️ WATAA!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                            }
                        } else if (randAction < 0.68) { 
                            f.state = 'high_kick'; f.attackTimer = 28; f.vx = Math.sign(dist) * 5; f.vy = -5.5; f.onGround = false;
                            let kickCount = 0;
                            let kickInterval = setInterval(() => {
                                if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(kickInterval); return; }
                                if (Math.abs(window.p1.x - f.x) < 90) {
                                    window.takeDamage(window.p1, Math.floor(11 * f.currentDmgMod), "#f1c40f", kickCount === 2, false, f.isFacingRight);
                                    window.spawnSlash(window.p1.x, window.p1.y - 40, f.isFacingRight, "#f1c40f", kickCount === 2, 1.2, -0.4);
                                }
                                kickCount++;
                                if (kickCount >= 3) clearInterval(kickInterval);
                            }, 70);
                        } else {
                            f.state = 'machine_gun_punches'; f.attackTimer = 26; f.vx = Math.sign(dist) * 3;
                            window.playSound(280, 'sine', 0.35, 0.5);
                            if (absDist < 85) {
                                window.takeDamage(window.p1, Math.floor(18 * f.currentDmgMod), "#f1c40f", false, false, f.isFacingRight);
                                window.spawnCrossSlash(window.p1.x, window.p1.y - 35, f.isFacingRight, "#f1c40f", "#ffffff", 1.25);
                            }
                        }
                    }
                }
            }
            else if (f.isSamurai) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 16) + 22; 
                        if (absDist > 210 && Math.random() < 0.6) { 
                            f.state = 'cast'; f.attackTimer = 24; 
                            window.playSound(320, 'sine', 0.3, 0.6);
                            window.spawnSlash(f.x + (f.isFacingRight ? 45 : -45), f.y - 40, f.isFacingRight, "#ffffff", true, 1.5, Math.PI / 2); 
                            window.spawnProjectile(f.x, f.y - 40, f.isFacingRight ? 12 : -12, 0, 14, "#ffffff", Math.floor(24 * f.dmgMod), window.p1); 
                        } else { 
                            f.state = 'dash'; f.dashTimer = 14; f.dashDir = Math.sign(dist); f.currentSpeed *= 2.2; f.iFrames = 18;
                            window.playSound(420, 'sawtooth', 0.35, 0.75, true);
                            window.spawnFighterAfterimage(f, "#e74c3c");
                            setTimeout(() => { 
                                if (window.gameOver || f.hp <= 0 || !window.p1) return; 
                                if (Math.abs(window.p1.x - f.x) < 170) {
                                    window.takeDamage(window.p1, Math.floor(36 * f.dmgMod), "#e74c3c", true, false, f.isFacingRight); 
                                    window.p1.vx = Math.sign(dist) * 6;
                                }
                                window.spawnCrossSlash(window.p1.x, window.p1.y - 35, f.isFacingRight, "#e74c3c", "#ffffff", 1.7); 
                            }, 180); 
                        }
                    } else if (absDist > 140) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 0.6; }
                }
            }
            else if (f.isNinja) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 14) + 14; 
                        let randAction = Math.random();
                        if (randAction < 0.42) { 
                            f.state = 'cast'; f.attackTimer = 18; f.vy = -7; f.onGround = false;
                            window.playSound(420, 'sine', 0.2, 0.4);
                            window.spawnProjectile(f.x, f.y - 48, f.isFacingRight ? 15 : -15, 0, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); 
                            window.spawnProjectile(f.x, f.y - 58, f.isFacingRight ? 14 : -14, -2.5, 8, "#8e44ad", Math.floor(15 * f.dmgMod), window.p1);
                        } else if (randAction < 0.75) { 
                            window.spawnParticles(f.x, f.y, "#2c3e50", true);
                            window.spawnFighterAfterimage(f, "#8e44ad");
                            f.x = window.p1.x + (window.p1.isFacingRight ? -75 : 75); f.y = window.p1.y; f.isFacingRight = window.p1.x > f.x; 
                            window.spawnParticles(f.x, f.y, "#9b59b6", true);
                            f.state = 'spinning_backfist'; f.attackTimer = 16; 
                            window.playSound(220, 'square', 0.2, 0.6);
                            window.takeDamage(window.p1, Math.floor(20 * f.dmgMod), "#9b59b6", true, false, f.isFacingRight); 
                            window.spawnCrossSlash(window.p1.x, window.p1.y - 35, f.isFacingRight, "#9b59b6", "#ffffff", 1.35);
                        } else { 
                            f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 2.2; 
                        }
                    }
                }
            }
            else {
                // Fighter & AI Acrobatic Martial Arts Logic
                let targetList = f.isPlayer ? window.enemies : [window.p1]; 
                let closest = window.getClosestEnemy(f, targetList);
                if (closest && closest.hp > 0) {
                    let dist = closest.x - f.x; f.isFacingRight = dist > 0; 
                    let absDist = Math.abs(dist); 
                    let reach = 70 * Math.max(f.scale || 1, closest.scale || 1);
                    if (absDist > reach) { 
                        // Acrobatic approach: Jump Kick or Slide Sweep when closing distance!
                        if (absDist < 220 && f.aiDelay <= 0 && Math.random() < 0.28) {
                            f.aiDelay = 10;
                            window.attack(f, targetList);
                        } else {
                            f.vx = Math.sign(dist) * f.currentSpeed; 
                            f.state = 'walk'; 
                            if (Math.random() < 0.08 && f.onGround) window.spawnDust(f.x, f.y);
                        }
                    } else {
                        f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                        if (f.aiDelay <= 0) {
                            f.aiDelay = f.isUnderdog ? 4 : (f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 6) + 6); 
                            let usedSkill = false;
                            if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.1) {
                                f.stamina -= 100; usedSkill = true;
                                f.superArmor = 25;
                                try { f.skill.actionCode3(f, closest, gameContext); if (f.state === 'idle') { f.state = 'cast'; f.attackTimer = 15; } } catch(e) {}
                            }
                            if (!usedSkill) {
                                let evadeChance = (f.isUnderdog || f.isRage) ? 0.50 : 0.30;
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
                                    f.comboTimer = 55; 
                                    window.attack(f, targetList);
                                }
                            }
                        }
                    }
                } else { 
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle'; 
                }
            }
        }

        // Gravity & Ground Impact Physics
        f.vy += window.GRAVITY; 
        if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) {
            window.spawnDust(f.x, window.GROUND_Y);
            // If slammed down by a Meteor Slam, trigger ground shockwave on impact!
            if (f.slammedDown) {
                f.slammedDown = false;
                window.shakeScreen(8, 5);
                window.spawnSpaceRipple(f.x, window.GROUND_Y, "#ff4757");
                window.spawnParticles(f.x, window.GROUND_Y, "#f1c40f", true);
            }
        }
        f.y += f.vy; 
        if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        
        if (f.dashTimer > 0) { 
            f.vx = f.dashDir * f.currentSpeed * 1.75; 
            if (f.onGround && window.matchTimer % 3 === 0) window.spawnDust(f.x, window.GROUND_Y);
        } else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { 
            f.vx *= 0.82; 
        }
        f.x += f.vx;

        if (window.canvas) {
            let minX = 40;
            let maxX = window.canvas.width - 40;
            if (f.x < minX) { f.x = minX; f.vx = 0; }
            if (f.x > maxX) { f.x = maxX; f.vx = 0; }
        }
    });

    // Collision Push & CLASH System
    for (let i = 0; i < allFighters.length; i++) { 
        for (let j = i + 1; j < allFighters.length; j++) { 
            let f1 = allFighters[i], f2 = allFighters[j]; 
            if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
            
            let overlapX = f2.x - f1.x; 
            let pushDist = 32 * Math.max(f1.scale || 1, f2.scale || 1); 
            if (Math.abs(overlapX) < pushDist) { 
                let pushForce = (pushDist - Math.abs(overlapX)) / 2; 
                let sign = overlapX === 0 ? 1 : Math.sign(overlapX); 
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
                    window.spawnLightning(midX, midY, "#f1c40f", 28, 4);
                    window.spawnCrossSlash(midX, midY, true, "#f1c40f", "#00f3ff", 1.3);
                    f1.vx = f1.isFacingRight ? -5.5 : 5.5;
                    f2.vx = f2.isFacingRight ? -5.5 : 5.5;
                    window.floatingTexts.push({ x: midX, y: midY - 45, text: "⚔️ CLASH!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                }
            }
            if (f1.clashCooldown > 0) f1.clashCooldown--;
            if (f2.clashCooldown > 0) f2.clashCooldown--;
        } 
    }

    // ==========================================
    // PENDING HIT RESOLUTION (MARTIAL ARTS COMBO VFX & LIFESTEAL)
    // ==========================================
    allFighters.forEach(f => {
        if (f && f.pendingHit && f.hp > 0) {
            let hit = f.pendingHit;
            hit.delay--;
            if (hit.delay <= 0) {
                let target = hit.target;
                let reach = 95 * (f.scale || 1);
                if (target && target.hp > 0 && Math.abs(f.x - target.x) <= reach + 42) {
                    let isCrit = false;
                    let finalDmg = hit.baseDmg;

                    // 1. GRAND FINISHER (Laser Punch / Rising Dragon Pillar / Asura X-Slash)
                    if (hit.isFinisher) {
                        isCrit = true; 
                        finalDmg *= 2.9;
                        target.vx = (f.isFacingRight ? 7.5 : -7.5); 
                        target.vy = -6.5;
                        target.onGround = false;
                        target.state = 'hurt'; 
                        target.hitStun = 40; 
                        window.shakeScreen(10, 6);
                        window.spawnParticles(target.x, target.y - 40, "#ff4757", true);

                        if (hit.moveName === 'one_inch_punch') {
                            window.spawnLaser(f.x, f.y - 38, f.isFacingRight, "#00f3ff", 24, 12);
                            window.spawnSpaceRipple(target.x, target.y - 38, "#00f3ff");
                            window.spawnCrossSlash(target.x, target.y - 38, f.isFacingRight, "#00f3ff", "#ffffff", 1.65);
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "⚡ ONE INCH BLAST!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        } else if (hit.moveName === 'dragon_uppercut') {
                            target.vy = -12.5;
                            window.spawnEnergyPillar(target.x, window.GROUND_Y, "#f1c40f", 45, 30);
                            window.spawnCrossSlash(target.x, target.y - 40, f.isFacingRight, "#f1c40f", "#ff4757", 1.75);
                            window.spawnLightning(target.x, target.y - 45, "#f1c40f", 38, 5);
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "🐉 DRAGON FANG!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        } else {
                            window.spawnCrossSlash(target.x, target.y - 38, f.isFacingRight, "#ff003c", "#9b59b6", 1.7);
                            window.spawnEnergyPillar(target.x, window.GROUND_Y, "#ff003c", 40, 26);
                            window.spawnLightning(target.x, target.y - 40, "#ff003c", 32, 4);
                            window.floatingTexts.push({ x: target.x, y: target.y - 88, text: "🔥 ASURA FINISH!", color: "#ff4757", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                        }
                    } 
                    // 2. METEOR AXE SLAM (Overhead Smash into the floor)
                    else if (hit.isMeteorSlam) {
                        isCrit = true;
                        finalDmg *= 2.1;
                        target.vy = 14;
                        target.vx = (f.isFacingRight ? 4 : -4);
                        target.slammedDown = true;
                        target.state = 'hurt';
                        target.hitStun = 35;
                        window.spawnCrossSlash(target.x, target.y - 35, f.isFacingRight, "#ff9f43", "#ff4757", 1.55);
                        window.spawnEnergyPillar(target.x, window.GROUND_Y, "#ff9f43", 36, 20);
                        window.floatingTexts.push({ x: target.x, y: target.y - 85, text: "☄️ METEOR SLAM!", color: "#ff9f43", alpha: 1.0, vx: 0, vy: -1.3, font: "bold 15px Arial", life: 34, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                    }
                    // 3. MULTI-HIT RUSH / AIR RAVE FLURRY
                    else if (hit.isMultiHit) {
                        finalDmg *= 0.85;
                        target.vx = (f.isFacingRight ? 2 : -2);
                        target.hitStun = 28;
                        target.state = 'hurt';
                        window.spawnSlash(target.x, target.y - 35, f.isFacingRight, "#00f3ff", true, 1.4, 0.3);
                        window.spawnAura(f.x, window.GROUND_Y, "#00f3ff", 60, 18);

                        for (let m = 1; m <= 2; m++) {
                            setTimeout(() => {
                                if (window.gameOver || !f || f.hp <= 0 || !target || target.hp <= 0) return;
                                if (Math.abs(f.x - target.x) <= reach + 55) {
                                    let isLast = (m === 2);
                                    // Alternate visual state to show punch -> kick transition during flurry!
                                    f.state = isLast ? 'spinning_heel' : 'hook';
                                    window.takeDamage(target, Math.floor(hit.baseDmg * (isLast ? 1.25 : 0.85)), isLast ? "#f1c40f" : "#00f3ff", isLast, false, f.isFacingRight);
                                    if (isLast) {
                                        window.spawnCrossSlash(target.x, target.y - 38, f.isFacingRight, "#f1c40f", "#00f3ff", 1.5);
                                    } else {
                                        window.spawnSlash(target.x, target.y - 38, f.isFacingRight, "#9b59b6", true, 1.4, -0.35);
                                    }
                                    f.comboHits = (f.comboHits || 0) + 1;
                                    f.comboDisplayTimer = 85;
                                }
                            }, m * 60);
                        }
                    }
                    // 4. RISING LAUNCHER (Uppercut / High Kick into the air)
                    else if (hit.isLauncher) {
                        isCrit = true;
                        finalDmg *= 1.5;
                        target.vy = -11.5;
                        target.vx = (f.isFacingRight ? 2.5 : -2.5);
                        target.onGround = false;
                        target.state = 'hurt';
                        target.hitStun = 32;
                        window.spawnSlash(target.x, target.y - 40, f.isFacingRight, "#00f3ff", true, 1.55, -Math.PI / 3);
                        window.spawnSpaceRipple(target.x, window.GROUND_Y, "#00f3ff");
                        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🌪️ AIR LAUNCH!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.4, font: "bold 15px Arial", life: 32, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
                    }
                    // 5. SLIDE SWEEP / FLYING KICK / STANDARD STRIKES
                    else {
                        if (hit.isSlideSweep) {
                            target.vy = -6.5;
                            target.onGround = false;
                            target.stunTimer = 24;
                            target.state = 'stunned';
                            window.spawnSlash(target.x, target.y - 15, f.isFacingRight, "#f1c40f", true, 1.4, 0.05);
                        } else if (hit.isFlyingKick) {
                            isCrit = true;
                            finalDmg *= 1.45;
                            target.vx = (f.isFacingRight ? 6.5 : -6.5);
                            target.vy = -5.5;
                            target.onGround = false;
                            window.spawnCrossSlash(target.x, target.y - 40, f.isFacingRight, "#00f3ff", "#ffffff", 1.45);
                        } else {
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
                            target.vx = (f.isFacingRight ? 2.8 : -2.8); 
                            target.hitStun = 15; 
                            target.state = 'hurt';

                            let slashColors = ["#00f3ff", "#f1c40f", "#ff4757", "#9b59b6", "#2ed573"];
                            let pickColor = isCrit ? "#ff4757" : slashColors[(f.comboStep || 0) % slashColors.length];
                            let slashAngle = (f.state.includes('spinning') || f.state.includes('axe')) ? 0.15 : (Math.random() - 0.5) * 0.45;
                            window.spawnSlash(target.x, target.y - 35, f.isFacingRight, pickColor, isCrit, isCrit ? 1.45 : 1.15, slashAngle);
                        }
                    }

                    // VAMPIRIC COMEBACK LIFESTEAL (Heals on Crit when low HP)
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

                    window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, false, f.isFacingRight);
                    f.comboHits = (f.comboHits || 0) + 1; 
                    f.comboDisplayTimer = 85; 
                    f.comboAlpha = 1; 
                    f.stamina = Math.min(100, f.stamina + (isCrit ? 6.0 : 2.5));
                } else if (f.onGround) {
                    window.spawnDust(f.x + (f.isFacingRight ? 35 : -35), f.y);
                }
                f.pendingHit = null; 
            }
        }
    });

    // Update Floating Texts + Auto-Translate any Vietnamese strings from main.js into English!
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { 
        let t = window.floatingTexts[i]; 
        t.scale = 1.0;
        t.targetScale = 1.0;

        // Auto-convert any Vietnamese text from main.js or character files into English
        if (typeof t.text === 'string') {
            if (t.text.includes("ĐANG TỤ LỰC") || t.text.includes("TUYỆT KỸ")) t.text = "🔥 ULTIMATE ARTS!";
            else if (t.text.includes("NGUY HIỂM")) t.text = "⚠️ DANGER!";
        }

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

    // ==========================================
    // STABLE & SMOOTH CAMERA TRACKING (100% LEVEL HORIZON)
    // ==========================================
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
    if (!window.targetZoom || window.targetZoom > 1.08) window.targetZoom = 1.0;
    window.targetTilt = 0;
};
