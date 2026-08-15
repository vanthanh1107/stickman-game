// ==========================================
// ENGINE_LOGIC.JS - NÃO BỘ CỦA GAME (Vật lý, AI, Combat, Vòng lặp)
// NÂNG CẤP: COMBAT CHUYÊN SÂU (Parry, Juggling, Guard Break, Smart AI)
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

window.camOrbitAngle = 0; window.targetCamOrbitAngle = 0; window.isSpinningCam = false; window.orbitFocusX = 0; window.orbitFocusY = window.GROUND_Y - 60; 
window.globalWind = 0; window.chromaTimer = 0; window.vhsGlitchTimer = 0;
window.envHazards = []; window.WALL_PADDING = 40; window.koGlitchTimer = 0; window.envDamage = []; 
window.timeStopTimer = 0; window.timeStopCaster = null; window.screenFilter = null; window.filterTimer = 0;
window.vignetteAlpha = 0.5; window.isLowHpPulsing = 0; window.speedLinesAlpha = 0; 
window.impactFrameCount = 0; window.cameraZoomVel = 0; window.actionCamSkew = 0;

window.mangaSfx = []; window.dimensionCracks = []; window.inkSplatters = []; window.invertFrames = 0; window.noiseCanvas = null; 
window.timeScale = 1.0; window.targetTimeScale = 1.0; window.camVelocityX = 0; window.camDriftX = 0; window.camDriftY = 0;
window.foregroundDebris = []; window.lethalVoid = 0; window.impactAberration = 0; window.bassDropFrames = 0; window.screenTearing = 0; 

const MAX_PARTICLES = 300; const MAX_SHOCKWAVES = 15;

// (Giữ nguyên phần 1 và 2: Init, Sound, Spawn VFX vì nó chỉ là các hàm Helper)
// [BẠN CÓ THỂ GIỮ NGUYÊN CODE TỪ DÒNG window.initGameEngine ĐẾN window.spawnEnvDamage NHƯ BẢN CŨ CỦA BẠN]
// Dưới đây là phần mình viết lại từ phần 4 trở đi

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null; let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}

// ==========================================
// 4. HỆ THỐNG VẬT LÝ NHẬN SÁT THƯƠNG ĐỈNH CAO
// ==========================================
window.takeDamage = function(target, amount, color, isCrit, wallBounce, attackerDirRight = true, isLauncher = false, isSpike = false) {
    if (!target || target.hp <= 0 || target.iFrames > 0) return;

    // CƠ CHẾ 1: NE DART HOÀN HẢO KHI ĐANG DASH
    if (target.state === 'dash' || target.state === 'dash_back') {
        if (target.dashTimer > 2 && target.dashTimer < 14) {
            window.playSound(800, 'sine', 0.5, 1.0, true); 
            window.targetTimeScale = 0.2; setTimeout(()=>{ window.targetTimeScale = 1.0; }, 300);
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "GHOST DODGE", color: "#fff", alpha: 1.5, vx: (Math.random()-0.5)*2, vy: -5, font: "italic 900 30px Impact", life: 40, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 });
            target.stamina = Math.min(100, target.stamina + 20); target.iFrames = 20; return; 
        }
    }

    let finalDmg = amount;

    // CƠ CHẾ 2: HỆ THỐNG BLOCK VÀ PERFECT PARRY
    if (target.state === 'block') { 
        target.blockFrames = (target.blockFrames || 0) + 1;

        // Perfect Parry (Bấm block trong 10 frame đầu)
        if (target.blockFrames <= 10) {
            window.playSound(1000, 'triangle', 0.3, 0.8, true); 
            window.impactSparks.push({ x: target.x + (attackerDirRight?-20:20), y: target.y - 40, vx: (attackerDirRight?-15:15), vy: -10, life: 20, maxLife: 20, color: "#ffffff", scale: 2.0 });
            window.shockwaves.push({x: target.x, y: target.y - 40, r: 5, maxR: 150, color: "#ffffff", alpha: 1, speed: 20});
            window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "PARRY!", color: "#ffffff", alpha: 1.5, vx: 0, vy: -3, font: "italic 900 40px Impact", life: 40, scale: 2.5, targetScale: 1.0, scaleVel: 0 });
            
            target.stamina = Math.min(100, target.stamina + 25);
            window.hitStopFrames = 15; window.shakeScreen(10, 8); window.targetZoom = 1.2;
            
            // Bật ngược sát thương/choáng lại kẻ tấn công
            return { parried: true }; 
        } 
        // Đỡ đòn thường (Mất thể lực)
        else {
            if (target.stamina < finalDmg * 0.8) {
                // GUARD BREAK (Vỡ phòng thủ)
                target.stamina = 0; target.state = 'stunned'; target.stunTimer = 60; target.hitStun = 60;
                window.playSound(300, 'square', 0.5, 1.0, true);
                window.spawnEnvDamage(target.x, target.y, 'wall_left', 0.8);
                window.floatingTexts.push({ x: target.x, y: target.y - 90, text: "GUARD BREAK!", color: "#ff003c", alpha: 1.5, vx: 0, vy: -4, font: "italic 900 45px Impact", life: 60, scale: 3.0, targetScale: 1.2, scaleVel: 0 });
                window.targetZoom = 1.3; window.shakeScreen(20, 15);
            } else { 
                target.stamina -= finalDmg * 0.8; finalDmg *= 0.1; // Chỉ nhận 10% sát thương chip damage
                window.playSound(400, 'sawtooth', 0.2, 0.4, true);
                window.impactSparks.push({ x: target.x, y: target.y - 40, vx: (attackerDirRight?-5:5), vy: -5, life: 10, maxLife: 10, color: "#aaa", scale: 0.5 });
            }
        }
    }

    // CƠ CHẾ 3: JUGGLING DAMAGE (Đang bị hất tung nhận thêm sát thương)
    let isAirborne = !target.onGround && target.y < window.GROUND_Y - 10;
    if (isAirborne) { finalDmg *= 1.3; isCrit = true; } // Bồi đòn trên không luôn là bạo kích

    if (finalDmg > 0) {
        target.hp -= finalDmg; if (target.hp < 0) target.hp = 0;
        
        let dmgText = isCrit ? `${Math.floor(finalDmg)}` : `${Math.floor(finalDmg)}`;
        window.floatingTexts.push({ x: target.x, y: target.y - 60 + (Math.random()*20-10), text: dmgText, color: isCrit ? "#ff003c" : "#fff", alpha: 1.5, vx: (attackerDirRight ? 1 : -1) * (Math.random() * 5 + 2), vy: -6 - Math.random() * 4, font: "italic 900 35px Impact", life: 40, scale: isCrit ? 2.5 : 1.5, targetScale: 1.0, scaleVel: 0 });

        // Tia lửa động năng
        let sparkCount = isCrit ? 6 : 2; let baseDirX = attackerDirRight ? 1 : -1;
        for(let i=0; i<sparkCount; i++) { window.impactSparks.push({ x: target.x, y: target.y - 40, vx: baseDirX * (Math.random() * 15 + 5), vy: (Math.random()-0.5)*10, life: 15 + Math.random()*10, maxLife: 25, color: isCrit ? "#ff003c" : "#ffffff", scale: 1.0 }); }

        // Máu văng
        if (isCrit || finalDmg > 15) window.spawnInk(target.x, target.y - 40, "#ff003c", attackerDirRight);

        // Hiệu ứng màn hình & Thời gian
        if (isCrit) {
            window.screenFlash = 0.1; window.impactFrameCount = 1; window.targetZoom = 1.15; window.impactAberration = 10;
            window.targetCamOrbitAngle = attackerDirRight ? -0.2 : 0.2; setTimeout(() => { window.targetCamOrbitAngle = 0; }, 200);
            window.hitStopFrames = 8; window.shakeScreen(15, 10);
            if (window.shockwaves.length < MAX_SHOCKWAVES) window.shockwaves.push({x: target.x, y: target.y-40, r: 5, maxR: 250, color: "#ffffff", alpha: 0.8, speed: 18});
        } else {
            window.hitStopFrames = 2; window.shakeScreen(5, 4); window.impactAberration = 4;
        }

        // TRẠNG THÁI VẬT LÝ KHI TRÚNG ĐÒN (Launchers & Spikes)
        if (target.superArmor <= 0 && target.state !== 'stunned') {
            target.state = 'hurt'; target.hitStun = isCrit ? 25 : 14; target.attackTimer = 0; target.comboStep = 0;
            
            if (isLauncher) {
                target.vy = -14; target.onGround = false; target.vx = attackerDirRight ? 3 : -3;
            } else if (isSpike && isAirborne) {
                target.vy = 20; // Đập mạnh xuống đất
                target.vx = 0;
            } else {
                target.vx = (attackerDirRight ? 4 : -4);
                if (isAirborne) target.vy = -4; // Nảy nhẹ trên không để tiếp tục combo
            }
        }
        
        if (typeof window.updateHPUIs === 'function') window.updateHPUIs();

        // KẾT LIỄU ĐIỆN ẢNH (FATALITY)
        if (target.hp <= 0) {
            window.fatalKOTimer = 100; // Kích hoạt hiệu ứng Tối giản Điện ảnh từ Render
            window.koSlashAngle = (Math.random() - 0.5) * Math.PI/2;
            window.hitStopFrames = 30; window.shakeScreen(40, 20); window.targetZoom = 1.5; window.actionCamOffsetY = -30;
            window.playSound(80, 'square', 1.5, 0.8, true); 
            target.state = 'ko_falling'; target.koTimer = 100; target.vy = isAirborne ? -5 : -10; target.vx = attackerDirRight ? 5 : -5; target.onGround = false;
        }
    }
    return { parried: false };
};

// ==========================================
// 5. COMBAT KINETICS (Hệ thống ra đòn liên hoàn)
// ==========================================
window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) { attacker.state = 'jab'; attacker.attackTimer = 10; return; }

    let MathDist = Math.abs(attacker.x - target.x); let reach = 85 * (attacker.scale || 1); attacker.isFacingRight = target.x > attacker.x;
    
    // CƠ CHẾ AI & KHOẢNG CÁCH
    if (MathDist > reach + 30 && Math.random() < 0.8) { 
        // Lao vào tấn công (Dash Strike)
        attacker.vx = (attacker.isFacingRight ? 1 : -1) * attacker.currentSpeed * 4.0; 
        attacker.state = 'dash'; attacker.attackTimer = 12; window.spawnDust(attacker.x, attacker.y); 
        return; 
    }

    // ĐỌC TRẠNG THÁI MỤC TIÊU ĐỂ TUNG ĐÒN COMBO CHUẨN
    let isTargetAirborne = (!target.onGround && target.y < window.GROUND_Y - 20);
    let isTargetBlocking = target.state === 'block';

    let selectedMove = 'jab'; let isLauncher = false; let isSpike = false; let isGuardBreaker = false;
    let baseDmg = 10 * attacker.currentDmgMod; let slashAngle = 0; 
    let atkDuration = 15; let forwardMove = 2;

    // LOGIC CHỌN ĐÒN (Branching Moveset)
    if (isTargetAirborne) {
        // Kẻ địch đang bay -> Tung đòn Juggle hoặc Đập xuống
        if (Math.random() < 0.4) { selectedMove = 'axe_kick'; isSpike = true; slashAngle = Math.PI/3; baseDmg *= 1.5; }
        else { selectedMove = 'high_kick'; slashAngle = -Math.PI/6; atkDuration = 12; forwardMove = 4; } // Đạp đuổi theo
    } 
    else if (isTargetBlocking && Math.random() < 0.5) {
        // Kẻ địch đang đỡ -> Tung đòn nặng vỡ giáp
        selectedMove = 'heavy_hook'; isGuardBreaker = true; baseDmg *= 2.0; atkDuration = 25; forwardMove = 5; slashAngle = 0;
    }
    else {
        // Chuỗi combo mặt đất cơ bản
        attacker.comboStep = (attacker.comboStep || 0) + 1;
        if (attacker.comboStep === 1) { selectedMove = 'jab'; atkDuration = 10; forwardMove = 1; }
        else if (attacker.comboStep === 2) { selectedMove = 'cross'; atkDuration = 12; forwardMove = 3; }
        else if (attacker.comboStep === 3) { selectedMove = 'low_kick'; atkDuration = 15; forwardMove = 2; slashAngle = Math.PI/8; }
        else { 
            // Finisher / Hất tung
            selectedMove = 'uppercut'; isLauncher = true; atkDuration = 20; forwardMove = 4; slashAngle = -Math.PI/4; baseDmg *= 1.8; attacker.comboStep = 0; 
        }
    }

    // THỰC THI ANIMATION & LỰC
    attacker.state = selectedMove; attacker.attackTimer = atkDuration; 
    attacker.vx = (attacker.isFacingRight ? 1 : -1) * forwardMove; 
    
    // TÍNH TOÁN SÁT THƯƠNG GỬI ĐI
    let isCrit = isGuardBreaker || isLauncher || (Math.random() < attacker.critChance);
    if (isCrit && !isGuardBreaker && !isLauncher) baseDmg *= (attacker.critMult || 1.5);

    let hitResult = window.takeDamage(target, Math.floor(baseDmg), "#ffffff", isCrit, false, attacker.isFacingRight, isLauncher, isSpike);
    
    // XỬ LÝ NẾU BỊ PARRY
    if (hitResult && hitResult.parried) {
        attacker.state = 'hurt'; attacker.hitStun = 30; attacker.vx = attacker.isFacingRight ? -6 : 6;
        attacker.comboStep = 0; return; // Bị phản đòn, kết thúc tấn công
    }

    // LƯU TRỮ COMBO ĐỂ VFX (Render) XỬ LÝ LÀM RỰC SÁNG
    attacker.comboHits = (attacker.comboHits || 0) + 1; 
    attacker.comboDisplayTimer = 90; attacker.comboAlpha = 1; 
    attacker.stamina = Math.min(100, attacker.stamina + 2.0);
    
    // TẠO VẾT CHÉM (Cung chém sắc bén)
    window.slashes.push({ x: target.x, y: target.y - 40, isRight: attacker.isFacingRight, life: 10, maxLife: 10, color: "#ffffff", scale: isCrit ? 2.2 : 1.4, rotation: slashAngle });
};


// ==========================================
// 6. CORE UPDATE VẬT LÝ VÀ AI ĐỌC TÌNH HUỐNG
// ==========================================
window.update = function() {
    if (!window.canvas || !window.p1 || window.isLoading) return; 

    // HẠT GIỐNG VẬT LÝ & HIỆU ỨNG (Giảm dần)
    window.actionCamOffsetX *= 0.85; window.actionCamOffsetY *= 0.85; window.actionCamSkew *= 0.85; window.dynamicBlur *= 0.9;
    if (window.impactAberration > 0) window.impactAberration -= 1.5; 
    if (window.invertFrames > 0) window.invertFrames--; if (window.impactFrameCount > 0) window.impactFrameCount--;
    if (window.hitStopFrames > 0) { window.hitStopFrames--; return; } // Frame Freeze bạo lực

    // Cập nhật các mảng VFX (Mực, Bụi, Sóng...)
    for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
    for (let i = window.particles.length - 1; i >= 0; i--) { let pt = window.particles[i]; pt.vy += window.GRAVITY * 0.9; pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); }
    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }
    if (window.inkSplatters) { window.inkSplatters.forEach(i => i.life--); window.inkSplatters = window.inkSplatters.filter(i => i.life > 0); }

    let allFighters = [window.p1].concat(window.enemies);

    // ==========================================
    // VÒNG LẶP TRÍ TUỆ NHÂN TẠO (SMART AI) & VẬT LÝ CHUẨN
    // ==========================================
    allFighters.forEach(f => {
        if (!f) return;
        
        // VẬT LÝ TRỌNG LỰC
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; f.vy += window.GRAVITY * 0.6; 
            if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { 
                window.shakeScreen(5, 3); // Chạm đất rung nhẹ
                if (f.vy > 10) window.spawnEnvDamage(f.x, window.GROUND_Y, 'crater', 0.8);
            } 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.93; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }

        // GIẢM TIMERS
        if (f.iFrames > 0) f.iFrames--;
        if (f.attackTimer > 0) f.attackTimer--; 
        if (f.hitStun > 0) f.hitStun--; 
        if (f.dashTimer > 0) f.dashTimer--; 
        if (f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.8; if(f.stunTimer <= 0) f.state = 'idle'; }
        if (f.comboDisplayTimer > 0) { f.comboDisplayTimer--; f.comboAlpha = 1; } else if (f.comboHits > 0) { f.comboHits = 0; }

        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk' && f.state !== 'block') f.state = 'idle'; }
        if (f.state !== 'block') f.blockFrames = 0; // Reset parry window

        f.isRage = (f.hp <= f.maxHp * 0.3); 
        f.currentSpeed = f.speed || 3.5; 
        f.currentDmgMod = f.dmgMod || 1; 
        if (f.stamina < 100) f.stamina += 0.2; // Hồi thể lực liên tục

        // AI XỬ LÝ (Áp dụng cho Enemies)
        if (!f.isPlayer && f.state !== 'stunned' && f.hitStun <= 0 && f.attackTimer <= 0 && f.dashTimer <= 0) {
            let target = window.p1;
            if (target && target.hp > 0) {
                let dist = target.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                
                f.aiDelay = (f.aiDelay || 0) - 1;
                if (f.aiDelay <= 0) {
                    f.aiDelay = 5 + Math.random() * 15; // Phản xạ AI cực nhanh
                    
                    // 1. NE TRÁNH / CHẶN ĐÒN
                    if (target.attackTimer > 0 && target.state !== 'walk' && target.state !== 'idle') {
                        if (absDist < 120 && f.stamina > 30) {
                            if (Math.random() < 0.6) { f.state = 'block'; f.blockFrames = 0; f.attackTimer = 15; } // Cố gắng Parry
                            else { f.state = 'dash_back'; f.dashDir = -Math.sign(dist); f.dashTimer = 12; f.iFrames = 10; f.stamina -= 15; } // Lướt lùi
                        }
                    } 
                    // 2. PHẢN CÔNG HOẶC TẤN CÔNG
                    else {
                        if (absDist < 90) {
                            if (Math.random() < 0.8) window.attack(f, [target]);
                            else { f.state = 'walk'; f.vx = -Math.sign(dist) * f.currentSpeed; } // Baiting (dụ dỗ)
                        } 
                        else if (absDist < 250) {
                            f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.5; // Đi bộ nhanh lại gần
                        } 
                        else {
                            f.state = 'dash'; f.dashDir = Math.sign(dist); f.dashTimer = 15; // Lao vào
                        }
                    }
                }
            }
        }

        // VẬT LÝ DI CHUYỂN & MA SÁT TRỤC Y / X
        f.vy += window.GRAVITY; 
        f.y += f.vy; 
        if (f.y >= window.GROUND_Y) { 
            if (!f.onGround && f.vy > 5) window.spawnDust(f.x, window.GROUND_Y); // Bụi khi tiếp đất
            f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; 
        } else { f.onGround = false; }
        
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 2.5; } 
        else if (f.onGround && f.state !== 'walk' && f.state !== 'dash_back') { f.vx *= 0.8; } // Ma sát đất mạnh
        
        f.x += f.vx;
        // Chặn tường
        if (f.x < window.WALL_PADDING) f.x = window.WALL_PADDING;
        if (f.x > window.canvas.width - window.WALL_PADDING) f.x = window.canvas.width - window.WALL_PADDING;
    });

    // CAMERA THÔNG MINH (ACTION CAM)
    let midPointX = window.canvas.width / 2;
    if (window.p1 && window.enemies.length > 0) {
        let aliveEnemy = window.getClosestEnemy(window.p1, window.enemies) || window.enemies[0];
        midPointX = (window.p1.x + aliveEnemy.x) / 2;
    } else if (window.p1) { midPointX = window.p1.x; }

    window.orbitFocusX += (midPointX - window.orbitFocusX) * 0.15;

    let closest = window.p1 ? window.getClosestEnemy(window.p1, window.enemies) : null;
    let actionPan = (!window.gameOver && closest) ? (window.p1.vx + (closest.vx || 0)) * 4 : 0;
    
    window.targetCamX = (window.canvas.width / 2) - window.orbitFocusX + window.actionCamOffsetX + actionPan;
    window.targetCamY = (window.canvas.height / 2) - window.orbitFocusY + window.actionCamOffsetY + 60;

    if (closest && !window.gameOver) {
        let distance = Math.abs(window.p1.x - closest.x); 
        let dynamicZoom = 1.3 - (distance / 800) * 0.3; // Zoom in khi áp sát
        window.targetZoom = Math.max(1.0, Math.min(1.4, dynamicZoom));
    }
}

// ==========================================
// 7. TIME-ENGINE VÀ PHYSICS LOOP
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
    
    window.physicsAccumulator += deltaTime;

    while (window.physicsAccumulator >= window.PHYSICS_STEP) {
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        window.physicsAccumulator -= window.PHYSICS_STEP;
    }

    let dZoom = window.targetZoom - window.currentZoom;
    window.cameraZoomVel += dZoom * 0.18; window.cameraZoomVel *= 0.72; 
    window.currentZoom += window.cameraZoomVel;

    let lerpFactor = 0.15;
    window.camX += (window.targetCamX - window.camX) * lerpFactor; 
    window.camY += (window.targetCamY - window.camY) * lerpFactor; 
    window.cameraTilt += (window.targetTilt - window.cameraTilt) * lerpFactor;

    try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
}

if (typeof window !== 'undefined') {
    setTimeout(() => { if(typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100);
}
