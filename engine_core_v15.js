// ==========================================
// ENGINE_CORE_V7.JS - BIẾN TOÀN CỤC, LOGIC, COMBAT & UPDATE (BẢN PRO 60FPS)
// ĐÃ FIX: CHỮ SÁT THƯƠNG, TÊN SKILL & K.O NHỎ GỌN, DỄ NHÌN, KHÔNG CHE MÀN HÌNH
// ĐÃ FIX: TẮT CAMERA TILT, TẮT XOAY 3D & GIật LẮC MÀN HÌNH KHI NHÂN VẬT LƯỚT
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

const MAX_PARTICLES = 150; 
const MAX_SHOCKWAVES = 10;

// ==========================================
// 1. HỆ THỐNG ÂM THANH & KHỞI TẠO
// ==========================================
window.initGameEngine = function() {
    window.isLoading = true; window.loadProgress = 0;
    
    window.thumbnailConfig = {
        hue: Math.floor(Math.random() * 360),
        title: ["EPIC BRAWL", "STICKMAN VIBES", "LEGENDARY", "SUPREME FIGHT"][Math.floor(Math.random() * 4)],
        emoji: ["🔥", "⚡", "⚔️", "👑"][Math.floor(Math.random() * 4)],
        rayCount: 12
    };

    window.viralShakeMult = 0.5;

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
        osc.connect(gain); gain.connect(window.audioCtx.destination); let safeVol = Math.min(vol, 0.8); 
        if (isImpact) { 
            osc.type = type === 'sine' ? 'triangle' : type; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(15, t + Math.min(0.15, duration)); 
            gain.gain.setValueAtTime(safeVol, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        } else { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration); gain.gain.setValueAtTime(0.01, t); gain.gain.linearRampToValueAtTime(safeVol * 0.5, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); 
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
};

// ==========================================
// 2. HỆ THỐNG SPAWN VFX GỌN NHẸ
// ==========================================
// Giảm rung màn hình xuống mức cực nhẹ để không gây nhức mắt
window.shakeScreen = function(frames, magnitude) { 
    window.shakeTime = Math.min(frames, 8); 
    window.shakeMag = Math.min(magnitude * 0.3, 3); 
};

window.playSequence = function(sequenceEvents) {
    window.activeSequences.push({ currentFrame: 0, events: sequenceEvents });
};

window.spawnEnergyPillar = function(x, y, color, radius, life) { window.energyPillars.push({x: x, y: y, color: color, r: Math.min(radius, 45), life: life, maxLife: life, scaleY: 0}); };
window.spawnLightning = function(x, y, color, length, branches) { let pts = [{x: x, y: y}]; let currX = x, currY = y; for (let i = 0; i < branches; i++) { currX += (Math.random() - 0.5) * length; currY -= Math.random() * length; pts.push({x: currX, y: currY}); } window.lightningArcs.push({pts: pts, color: color, life: 10, maxLife: 10}); };
window.spawnBlackHole = function(x, y, radius, life) { window.blackHoles.push({x: x, y: y - 50, r: Math.min(radius, 60), life: life, maxLife: life}); };
window.spawnSpaceRipple = function(x, y, color) { window.spaceRipples.push({x: x, y: y, r: 10, maxR: 220, color: color, life: 25, maxLife: 25}); };
window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); };

window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit, imageUrl = null, imgW = 100, imgH = 100) { 
    window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit, imageUrl: imageUrl, imgW: imgW, imgH: imgH }); 
};

window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { 
    window.slashes.push({ x: x, y: y, isRight: isRight, life: 10, maxLife: 10, color: color, scale: (isCrit ? 1.5 : 1.1) * Math.min(scale || 1, 1.3), rotation: rotation }); 
    let sparkCount = isCrit ? 4 : 2;
    for (let i = 0; i < sparkCount; i++) { window.impactSparks.push({ x: x, y: y, vx: (isRight ? 1 : -1) * (Math.random() * 10 + 4), vy: (Math.random() - 0.5) * 10, life: 16, maxLife: 16, color: color, scale: 1 }); }
};

window.spawnParticles = function(x, y, color, isCrit = false) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    let count = isCrit ? 8 : 4; 
    for (let i = 0; i < count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit ? 12 : 7) + 2; window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 25, maxLife: 25, color: color, size: Math.random() * 3.5 + 1.5 }); } 
};

window.spawnDust = function(x, y) { 
    if (window.particles.length > MAX_PARTICLES) return; 
    for (let i = 0; i < 4; i++) { window.particles.push({ x: x + (Math.random() * 30 - 15), y: y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 1.5 - 0.2, life: 22, maxLife: 22, color: "rgba(189, 195, 199, 0.35)", size: Math.random() * 7 + 4, isGroundDust: true }); } 
};

window.spawnInk = function(x, y, color, isRight) {};
window.spawnForegroundDebris = function(x, y, isRight) {};
window.triggerCinematic = function(caster, callback) { if (callback) callback(); };
window.spawnAura = function(x, y, color, radius, duration) { window.auras.push({ x: x, y: y, color: color, r: Math.min(radius, 70), life: duration, maxLife: duration }); };
window.spawnLaser = function(x, y, isRight, color, width, duration) { window.lasers.push({ x: x, y: y, isRight: isRight, color: color, width: Math.min(width, 35), life: duration, maxLife: duration }); };
window.focusCinematic = function(frames) {};
window.applyFilter = function(type, frames) {};
window.triggerTimeStop = function(frames, caster) { 
    window.playSound(120, 'square', 0.4, 0.5, true); 
    if (window.shockwaves.length < MAX_SHOCKWAVES) { 
        window.shockwaves.push({x: caster.x, y: caster.y, r: 10, maxR: 350, color: "#fff", alpha: 0.7, speed: 25}); 
    } 
};
window.spawnCustomObj = function(x, y, vx, vy, textOrEmoji, color, font, duration, isSpinning = false) { window.customObjs.push({ x: x, y: y, vx: vx, vy: vy, text: textOrEmoji, color: color, font: font, life: duration, maxLife: duration, spin: isSpinning, ang: 0 }); };
window.spawnGlassShatter = function(x, y) { window.playSound(500, 'sawtooth', 0.3, 0.5, true); window.spawnParticles(x, y, "#00f3ff", true); };
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
// 4. HỆ THỐNG VẬT LÝ NHẬN SÁT THƯƠNG & ATTACK (CHỮ NHỎ GỌN)
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    let wasInAir = !target.onGround || target.y < window.GROUND_Y;
    let wasBlocking = target.state === 'block';

    // Né đòn (Evade) - Chữ nhỏ 16px
    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 14) {
            window.playSound(700, 'sine', 0.3, 0.6, true); 
            window.floatingTexts.push({ x: target.x, y: target.y - 75, text: "⚡ NÉ ĐÒN!", color: "#00f3ff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            window.spawnParticles(target.x, target.y - 40, "#00f3ff", false);
            target.stamina = Math.min(100, target.stamina + 25); 
            target.x += target.isFacingRight ? -80 : 80; 
            target.iFrames = 22; 
            return; 
        }
    }

    let finalDmg = amount;

    if (target.state === 'block') { 
        if (target.stamina < 15) {
            target.stamina = 0; target.state = 'stunned'; target.stunTimer = 80; target.hitStun = 80; 
            window.spawnParticles(target.x, target.y - 40, "#ff003c", true); 
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "💔 VỠ KHIÊN!", color: "#ff003c", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 17px Arial", life: 45, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
        } 
        else if (target.attackTimer >= 22) { 
            window.playSound(600, 'triangle', 0.3, 0.7, true); 
            window.spawnParticles(target.x, target.y - 40, "#00ffff", true);
            window.floatingTexts.push({ x: target.x, y: target.y - 75, text: "🛡️ PHẢN ĐÒN!", color: "#00ffff", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 16px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true });
            target.stamina = Math.min(100, target.stamina + 25); 
            let allFighters = [window.p1].concat(window.enemies);
            allFighters.forEach(e => { if (e && e !== target && e.hp > 0 && Math.abs(e.x - target.x) < 130) { e.state = 'hurt'; e.hitStun = 35; e.vx = target.isFacingRight ? 8 : -8; } });
            return;
        } else { 
            target.stamina -= finalDmg * 0.5; 
            finalDmg *= 0.2; 
        }
    }
    
    if (target.shield > 0) { 
        target.shield -= finalDmg; 
        if (target.shield < 0) { finalDmg = -target.shield; target.shield = 0; } else { finalDmg = 0; } 
        window.playSound(300, 'sine', 0.15, 0.3, true); 
    }

    if (finalDmg > 0) {
        target.hp -= finalDmg; 
        if (target.hp < 0) target.hp = 0;
        let dmgText = isCrit ? `💥-${Math.floor(finalDmg)}` : `-${Math.floor(finalDmg)}`;
        
        // Số sát thương nhỏ gọn (15px - 18px), nảy nhẹ và tự biến mất nhanh
        let textVx = (attackerDirRight ? 1 : -1) * (Math.random() * 3 + 1.5); 
        let textVy = -4.5 - Math.random() * 2; 
        
        window.floatingTexts.push({ 
            x: target.x + (Math.random() * 16 - 8), 
            y: target.y - 55, 
            text: dmgText, 
            color: color || (isCrit ? "#ff9f43" : "#ffffff"), 
            alpha: 1.0, 
            vx: textVx, 
            vy: textVy, 
            font: isCrit ? "bold 18px Arial, sans-serif" : "bold 15px Arial, sans-serif", 
            life: 36, 
            scale: 1.0, 
            targetScale: 1.0, 
            scaleVel: 0, 
            rot: 0 
        });
        window.spawnParticles(target.x, target.y - 40, color || "#fff", isCrit);

        if (target.hp > 0 && wasInAir && !wasBlocking) {
            target.vy = isCrit ? -10 : -7; 
            target.onGround = false;
        }

        if (target.superArmor <= 0 && target.state !== 'stunned') { 
            target.state = 'hurt'; 
            target.hitStun = isCrit ? 18 : 10; 
            target.attackTimer = 0; 
            target.comboStep = 0; 
        }
        if (wallBounce) { target.vx = target.isFacingRight ? -5 : 5; } 
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (target.hp <= 0) {
            if (isCrit) {
                // Chữ K.O vừa vặn (24px), không che màn hình
                window.floatingTexts.push({ 
                    x: target.x, 
                    y: target.y - 95, 
                    text: "💀 K.O!", 
                    color: "#ff4757", 
                    alpha: 1.0, 
                    vx: 0, 
                    vy: -0.6, 
                    font: "italic 900 24px 'Arial Black', Impact", 
                    life: 70, 
                    scale: 1.0, 
                    targetScale: 1.0, 
                    scaleVel: 0, 
                    rot: 0, 
                    noGravity: true 
                });
            }
            window.playSound(90, 'square', 0.8, 0.6, true); 
            target.state = 'ko_falling'; 
            target.koTimer = 100; 
            target.vy = -9; 
            target.onGround = false;
        } else if (isCrit) { 
            window.playSound(180, 'square', 0.2, 0.5, true); 
        } else { 
            window.playSound(250, 'sine', 0.12, 0.25, true); 
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

    let selectedMove = 'jab'; 
    let isFinisher = false;
    let finisherChance = attacker.isRage ? 0.30 : 0.18;

    if (attacker.comboStep >= 3 || Math.random() < finisherChance) { 
        selectedMove = moves_Finisher[Math.floor(Math.random() * moves_Finisher.length)]; 
        isFinisher = true; 
        attacker.comboStep = 0; 
    } else { 
        if (MathDist < 55) selectedMove = moves_Close[Math.floor(Math.random() * moves_Close.length)]; 
        else if (MathDist < 90) selectedMove = moves_Mid[Math.floor(Math.random() * moves_Mid.length)]; 
        else selectedMove = moves_Far[Math.floor(Math.random() * moves_Far.length)]; 
    }

    if (MathDist > reach && !isFinisher) { 
        attacker.vx = (attacker.isFacingRight ? 1 : -1) * (attacker.currentSpeed || 5) * 2.8; 
        attacker.state = 'dash'; 
        attacker.attackTimer = 12; 
        window.spawnDust(attacker.x, attacker.y); 
        return; 
    }

    attacker.state = selectedMove; 
    attacker.attackTimer = isFinisher ? 26 : 16; 
    attacker.vx = (attacker.isFacingRight ? 1 : -1) * (isFinisher ? 4.5 : 1.8); 
    
    attacker.pendingHit = {
        target: target,
        delay: isFinisher ? 10 : 5,
        isFinisher: isFinisher,
        baseDmg: 12 * (attacker.currentDmgMod || attacker.dmgMod || 1)
    };
};

// ==========================================
// 5. CORE UPDATE VẬT LÝ (CAMERA ĐẦM & ỔN ĐỊNH)
// ==========================================
window.update = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx || !window.p1 || window.isLoading) return; 

    window.actionCamOffsetX = 0; 
    window.actionCamOffsetY = 0; 
    window.actionCamSkew = 0; 
    window.cameraTilt = 0;
    window.targetTilt = 0;
    window.camOrbitAngle = 0;
    window.targetCamOrbitAngle = 0;
    window.isSpinningCam = false;

    window.lightningArcs.forEach(l => l.life--); window.lightningArcs = window.lightningArcs.filter(l => l.life > 0);
    window.energyPillars.forEach(p => { p.life--; p.scaleY += (1 - p.scaleY) * 0.2; }); window.energyPillars = window.energyPillars.filter(p => p.life > 0);
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

    // Xử lý đạn bắn (Projectiles)
    for (let i = window.projectiles.length - 1; i >= 0; i--) {
        let proj = window.projectiles[i]; 
        proj.x += proj.vx; 
        proj.y += proj.vy;
        if (proj.isMeteor) {
            if (proj.y >= window.GROUND_Y) {
                window.playSound(200, 'sawtooth', 0.3, 0.4, true);
                allFighters.forEach(fighter => { 
                    if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 90 && fighter.y >= window.GROUND_Y - 50) { 
                        window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false, true); 
                    } 
                }); 
                window.projectiles.splice(i, 1);
            }
        } else if (proj.target) {
            let dx = proj.x - proj.target.x; 
            let dy = proj.y - (proj.target.y - 35);
            if (Math.sqrt(dx * dx + dy * dy) < proj.radius + 25) { 
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
        let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; 
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
        if (pt.isAuraFlame) { pt.vy -= 0.3; pt.size *= 0.95; }
        else if (!pt.isGroundDust) { pt.vy += window.GRAVITY * 0.7; }
        pt.x += pt.vx; pt.y += pt.vy; pt.life--; 
        if (pt.life <= 0) window.particles.splice(i, 1); 
    }

    for (let i = window.slashes.length - 1; i >= 0; i--) { 
        window.slashes[i].life--; 
        if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); 
    }

    // Xử lý khi kẻ địch bị hạ gục
    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -7; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; 
            window.spawnParticles(e.x, e.y, "#fff", true); 
            if (window.p1 && window.p1.hp > 0) { 
                let heal = Math.floor(window.p1.maxHp * 0.08); 
                window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); 
                window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 75, text: `+${heal} 💚`, color: "#2ed573", alpha: 1.0, vx: 0, vy: -1.2, font: "bold 15px Arial", life: 35, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
            }
        }
    });
    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { 
        window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -7; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; 
    }
    
    let gameContext = { 
        floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, 
        spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, 
        playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, 
        dash: (f, fx, fy) => { f.vx = fx; if (fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; }, 
        teleport: (f, dx, dy) => { f.x = dx; if (dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; }, 
        addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, 
        setInvulnerable: (f, fr) => { f.iFrames = fr; } 
    };

    // Cập nhật từng nhân vật
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

        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.25); 
        f.currentSpeed = f.speed || 4; 
        f.currentDmgMod = f.dmgMod || 1; 

        if (f.isRage) { 
            f.currentSpeed *= 1.35; 
            f.currentDmgMod *= 1.3; 
        }

        if (f.hp > 0 && f.stamina < 100) f.stamina += (f.isRage ? 0.45 : (f.regen * 0.2 || 0.06)); 
        if (f.stamina > 100) f.stamina = 100;

        for (let i = f.buffs.length - 1; i >= 0; i--) { 
            let b = f.buffs[i]; b.life--; 
            if (b.life <= 0) { f.buffs.splice(i, 1); continue; } 
            if (b.stat === 'dmg') f.currentDmgMod += b.value; 
            if (b.stat === 'speed') f.currentSpeed += b.value; 
        }

        let launchedUltimate = false; 
        let targetGroup = f.isPlayer ? window.enemies : [window.p1]; 
        let closestTarget = window.getClosestEnemy(f, targetGroup);

        // Tự động dùng Ultimate khi đầy 100 Stamina
        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x; 
                let absDist = Math.abs(distToTarget); 
                let type = (f.classId || "dausi").toLowerCase(); 
                let isCloseEnough = (absDist < 220) || type.includes('satthu') || type.includes('phapsu');
                if (isCloseEnough) {
                    if (window.classStats && window.classStats[type] && typeof window.classStats[type].executeUltimate === 'function') {
                        f.stamina = 0; 
                        let baseDmg = (f.isPlayer ? 50 : 35) * (f.currentDmgMod || 1); 
                        window.playSound(400, 'sine', 0.4, 0.5); 
                        window.spawnParticles(f.x, f.y, "#f1c40f", true); 
                        window.floatingTexts.push({ x: f.x, y: f.y - 90, text: f.isPlayer ? "🔥 TUYỆT KỸ!" : "⚠️ NGUY HIỂM!", color: "#f1c40f", alpha: 1.0, vx: 0, vy: -1.0, font: "bold 17px Arial", life: 40, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
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

        // AI Điều khiển Boss & Nhân vật
        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (f.isDragon) {
                if (f.hp > 0 && f.hp <= f.maxHp * 0.3 && !f.isEvolved) { 
                    f.isEvolved = true; f.color = "#8e44ad"; f.scale *= 1.15; 
                    window.floatingTexts.push({ x: f.x, y: f.y - 110, text: "🐉 CUỒNG LONG!", color: "#8e44ad", alpha: 1.0, vx: 0, vy: -1, font: "bold 18px Arial", life: 60, scale: 1.0, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true }); 
                }
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isEvolved ? 15 : 30; 
                        let randAction = Math.random();
                        if (randAction < 0.45) { 
                            f.state = 'breathe_fire'; f.attackTimer = 35; f.vx = 0; 
                            let fireVx = f.isFacingRight ? 11 : -11; 
                            window.spawnProjectile(f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 0, 13, "#e74c3c", Math.floor(25 * f.dmgMod), window.p1); 
                        } else if (randAction < 0.85) { 
                            f.state = 'scratch'; f.attackTimer = 25; f.vx = Math.sign(dist) * f.currentSpeed * 1.4; 
                            if (Math.abs(window.p1.x - f.x) < 130) window.takeDamage(window.p1, Math.floor(18 * f.dmgMod), "#ff7675", false); 
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
                        f.aiDelay = 14; let randAction = Math.random();
                        if (absDist > 100) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.3; } 
                        else if (randAction < 0.35) { 
                            f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 3; 
                            if (absDist < 70) window.takeDamage(window.p1, Math.floor(28 * f.currentDmgMod), "#f1c40f", true, false); 
                        } else { 
                            f.state = 'high_kick'; f.attackTimer = 24; f.vx = Math.sign(dist) * 4; 
                            if (absDist < 85) window.takeDamage(window.p1, Math.floor(16 * f.currentDmgMod), "#ecf0f1", false, false); 
                        }
                    }
                }
            }
            else if (f.isSamurai) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                    if (f.aiDelay <= 0) {
                        f.aiDelay = 30; 
                        if (absDist > 220 && Math.random() < 0.5) { 
                            f.state = 'cast'; f.attackTimer = 22; 
                            window.spawnSlash(f.x + (f.isFacingRight ? 40 : -40), f.y - 40, f.isFacingRight, "#fff", true, 1.3, Math.PI / 2); 
                            window.spawnProjectile(f.x, f.y - 40, f.isFacingRight ? 11 : -11, 0, 14, "#fff", Math.floor(22 * f.dmgMod), window.p1); 
                        } else { 
                            f.state = 'dash'; f.dashTimer = 12; f.dashDir = Math.sign(dist); 
                            setTimeout(() => { 
                                if (window.gameOver || f.hp <= 0 || !window.p1) return; 
                                if (Math.abs(window.p1.x - f.x) < 150) window.takeDamage(window.p1, Math.floor(32 * f.dmgMod), "#e74c3c", true, false); 
                                window.spawnSlash(f.x, window.p1.y - 30, f.isFacingRight, "#e74c3c", true, 1.5, 0); 
                            }, 180); 
                        }
                    } else if (absDist > 130) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 0.6; }
                }
            }
            else if (f.isNinja) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = 22; let randAction = Math.random();
                        if (randAction < 0.4) { 
                            f.state = 'cast'; f.attackTimer = 18; 
                            window.spawnProjectile(f.x, f.y - 50, f.isFacingRight ? 14 : -14, 0, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); 
                        } else if (randAction < 0.7) { 
                            f.x = window.p1.x + (window.p1.isFacingRight ? -70 : 70); f.y = window.p1.y; f.isFacingRight = window.p1.x > f.x; 
                            f.state = 'spinning_backfist'; f.attackTimer = 15; 
                            window.takeDamage(window.p1, Math.floor(18 * f.dmgMod), "#9b59b6", false, false); 
                        } else { 
                            f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.8; 
                        }
                    }
                }
            }
            else {
                let targetList = f.isPlayer ? window.enemies : [window.p1]; 
                let closest = window.getClosestEnemy(f, targetList);
                if (closest && closest.hp > 0) {
                    let dist = closest.x - f.x; f.isFacingRight = dist > 0; 
                    let absDist = Math.abs(dist); 
                    let reach = 65 * Math.max(f.scale || 1, closest.scale || 1);
                    if (absDist > reach) { 
                        f.vx = Math.sign(dist) * f.currentSpeed; 
                        f.state = 'walk'; 
                    } else {
                        f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                        if (f.aiDelay <= 0) {
                            f.aiDelay = f.isPlayer ? 6 : 12; 
                            if (f.comboTimer > 0 && f.comboStep < 14) f.comboStep++; else f.comboStep = 0; 
                            f.comboTimer = 50; 
                            window.attack(f, targetList);
                        }
                    }
                } else { 
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle'; 
                }
            }
        }

        // Trọng lực & di chuyển mượt mà (giữ giới hạn sân đấu để không trượt ra ngoài màn hình)
        f.vy += window.GRAVITY; 
        f.y += f.vy; 
        if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        
        if (f.dashTimer > 0) { 
            f.vx = f.dashDir * f.currentSpeed * 1.6; 
        } else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { 
            f.vx *= 0.82; 
        }
        f.x += f.vx;
        // Giữ nhân vật trong phạm vi sân đấu hợp lý
        if (window.canvas) {
            let minX = 40;
            let maxX = window.canvas.width - 40;
            if (f.x < minX) { f.x = minX; f.vx = 0; }
            if (f.x > maxX) { f.x = maxX; f.vx = 0; }
        }
    });

    // Chống chồng lấn vị trí giữa 2 nhân vật
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
        } 
    }

    // Xử lý sát thương chờ (Pending Hit)
    allFighters.forEach(f => {
        if (f && f.pendingHit && f.hp > 0) {
            let hit = f.pendingHit;
            hit.delay--;
            if (hit.delay <= 0) {
                let target = hit.target;
                let reach = 85 * (f.scale || 1);
                if (target && target.hp > 0 && Math.abs(f.x - target.x) <= reach + 35) {
                    let isCrit = false;
                    let finalDmg = hit.baseDmg;
                    if (hit.isFinisher) {
                        isCrit = true; 
                        finalDmg *= 2.8;
                        target.vx = (f.isFacingRight ? 5 : -5); 
                        target.state = 'hurt'; 
                        target.hitStun = 35; 
                    } else {
                        if (Math.random() < (f.critChance || 0.1)) { isCrit = true; finalDmg *= (f.critMult || 1.5); }
                        target.vx = (f.isFacingRight ? 2.5 : -2.5); 
                        target.hitStun = 14; 
                        target.state = 'hurt';
                    }
                    window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, false, f.isFacingRight);
                    f.comboHits = (f.comboHits || 0) + 1; 
                    f.comboDisplayTimer = 80; 
                    f.comboAlpha = 1; 
                    f.stamina = Math.min(100, f.stamina + (isCrit ? 5.0 : 2.0));
                    
                    let slashAngle = (f.state.includes('uppercut') || f.state.includes('high_kick')) ? -Math.PI / 5 : (Math.random() - 0.5) * 0.3;
                    window.spawnSlash(target.x, target.y - 35, f.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, hit.isFinisher ? 1.4 : 1.0, slashAngle);
                }
                f.pendingHit = null; 
            }
        }
    });

    // Cập nhật vật lý cho dòng chữ (Floating Texts) - Giữ scale ổn định = 1.0
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

    // Chạy kịch bản kỹ năng (Active Sequences)
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
    // CAMERA CỐ ĐỊNH TÂM DỊU NHẸ (KHÔNG TRƯỢT LẮC THEO VẬN TỐC VX)
    // ==========================================
    let midPointX = window.canvas.width / 2;
    if (window.p1 && window.enemies.length > 0) {
        let aliveEnemy = window.getClosestEnemy(window.p1, window.enemies) || window.enemies[0];
        midPointX = (window.p1.x + aliveEnemy.x) / 2;
    } else if (window.p1) { 
        midPointX = window.p1.x; 
    }

    window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.08;
    // Chỉ dịch chuyển camera tối đa 30% độ lệch so với tâm màn hình để nền phía sau luôn đầm và tĩnh
    window.targetCamX = ((window.canvas.width / 2) - window.orbitFocusX) * 0.3;
    window.targetCamY = 0;
    window.targetZoom = 1.0;
    window.targetTilt = 0;
};
