window.canvas = null; window.ctx = null; window.audioCtx = null; window.isMuted = false;
window.selectedRedClass = null; window.floatingTexts = []; window.particles = []; window.projectiles = []; 
window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
window.p1 = null; window.gameOver = false; window.isLoopRunning = false;
window.enemies = []; window.totalEnemyMaxHp = 0; window.rewardMultiplier = 1; 
window.shakeTime = 0; window.shakeMag = 0; window.hitStopFrames = 0; window.matchResolved = false;
window.camX = 0; window.screenFlash = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; 
window.slowMoTimer = 0; window.introTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0;
window.currentZoom = 1; window.targetZoom = 1; window.currentWeather = 'none'; window.weatherParticles = [];
window.GROUND_Y = 320; window.GRAVITY = 0.8; window.lastFrameTime = 0; window.FRAME_MIN_TIME = 1000 / 60;

window.triggerVibration = function(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); window.isMuted = !window.isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = window.isMuted ? "🔇" : "🔊"; if (!window.isMuted && window.audioCtx && window.audioCtx.state === 'suspended') { window.audioCtx.resume(); } }

window.playSound = function(freq, type, duration, vol, isImpact = false) { 
    if (window.isMuted) return; 
    try {
        if (!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        let t = window.audioCtx.currentTime; let osc = window.audioCtx.createOscillator(); let gain = window.audioCtx.createGain(); 
        osc.connect(gain); gain.connect(window.audioCtx.destination); 
        if (isImpact) { osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(30, t + duration); gain.gain.setValueAtTime(vol * 2.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); } 
        else { osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 0.5, t); osc.frequency.linearRampToValueAtTime(freq, t + duration * 0.5); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(vol * 1.5, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
}

window.shakeScreen = function(frames, magnitude) { window.shakeTime = frames; window.shakeMag = magnitude; }
window.spawnTrap = function(x, y, radius, color, damage, lifeFrames, owner) { window.traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
window.spawnProjectile = function(x, y, vx, vy, radius, color, dmg, target, customOnHit) { window.projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
window.spawnSlash = function(x, y, isRight, color, isCrit, scale, rotation = 0) { window.slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 1.5 : 1) * scale, rotation: rotation }); }
window.spawnParticles = function(x, y, color, isCrit = false) { let count = isCrit ? 20 : 10; for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; window.particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 4 + 2 }); } }
window.spawnDust = function(x, y) { for(let i=0; i<6; i++) { window.particles.push({ x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*4, vy: -Math.random()*3, life: 15, maxLife: 15, color: "rgba(236, 240, 241, 0.6)", size: Math.random() * 8 + 4 }); } }
window.triggerCinematic = function(caster, callback) { window.cinematicTimer = 50; window.cinematicCaster = caster; window.cinematicCallback = callback; window.targetZoom = 1.15; window.playSound(400, 'sine', 0.4, 0.2, false); }

window.getClosestEnemy = function(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}

window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1) return; 

    if (window.uiShakeP1 > 0) { window.uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }
    if (window.introTimer > 0) { window.introTimer--; if (window.introTimer === 60) window.playSound(100, 'sine', 0.5, 0.5, true); return; }

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; if (window.screenFlash > 0) window.screenFlash -= 0.05;
    if (window.cinematicTimer > 0 && !isSlowMoFrame) { window.cinematicTimer--; if (window.cinematicTimer === 0 && window.cinematicCallback) { window.cinematicCallback(); window.cinematicCallback = null; } return; }
    if (window.hitStopFrames > 0 && !isSlowMoFrame) { window.hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    window.weatherParticles.forEach(w => { w.y += w.speed; w.x += (window.currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2; if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } });
    for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
    for (let i = window.particles.length - 1; i >= 0; i--) { let pt = window.particles[i]; if (pt.isCoin) { pt.vy += window.GRAVITY * 0.5; if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) window.particles.splice(i, 1); }
    if (Math.random() < 0.12) { window.particles.push({ x: Math.random() * window.canvas.width, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    window.enemies = window.enemies.filter(e => { 
        if(e.hp <= 0) { 
            window.spawnParticles(e.x, e.y, "#fff", true); window.playSound(100, 'sine', 0.5, 0.5, true); 
            for(let c=0; c<5; c++) window.particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true });
            if (window.p1 && window.p1.hp > 0) {
                let heal = Math.floor(window.p1.maxHp * 0.08); window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal);
                window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 });
                window.p1.killCount = (window.p1.killCount || 0) + 1;
            } return false; 
        } return true; 
    });
    
    let allFighters = [window.p1].concat(window.enemies);
    let gameContext = { floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (f.state === 'stunned' || f.stunTimer > 0) {
            f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; f.shieldBreak = ((f.maxStunTimer - f.stunTimer) / f.maxStunTimer) * 100; 
            if (f.stunTimer <= 0) { f.shieldBreak = 100; f.state = 'idle'; window.spawnParticles(f.x, f.y, "#2ed573"); window.floatingTexts.push({ x: f.x, y: f.y - 60, text: "🛡️✨", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 32px Arial", life: 40 }); }
        } else { if (f.hitStun <= 0 && f.shieldBreak < 100) { f.shieldBreak += 0.3; if (f.shieldBreak > 100) f.shieldBreak = 100; } }

      if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout === 0) f.comboStep = 0; }
if (f.comboTimer > 0) f.comboTimer--; // <-- THÊM DÒNG NÀY để AI reset combo mượt mà
if (f.superArmor > 0) f.superArmor--;

// Đảm bảo đếm lùi iFrames chính xác và luôn đưa về 0 nếu có lỗi âm/NaN
if (f.iFrames > 0) { 
    f.iFrames--; 
} else { 
    f.iFrames = 0; 
}
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.3); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; f.currentRegen = f.regen || 0.3;
        if (f.hp > 0 && f.stamina < 100) f.stamina += f.currentRegen; if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false;
        if (f.isRage) { f.currentSpeed *= 1.2; f.currentDmgMod *= 1.2; f.currentRegen += 0.2; if (Math.random() < 0.3) window.particles.push({ x: f.x + (Math.random() - 0.5) * 30, y: f.y - Math.random() * 60, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 3 - 1, life: 15, maxLife: 15, color: f.color, size: Math.random() * 3 + 2 }); }
        if (f.isExhausted) { f.currentSpeed *= 0.6; }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        if (f.attackTimer === 0 && f.hitStun === 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            let targetGroup = f.isPlayer ? window.enemies : [window.p1]; let closest = window.getClosestEnemy(f, targetGroup);
            if (closest && closest.hp > 0) {
                let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);
                if (absDist > reach) { f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) window.spawnDust(f.x, f.y); } 
                else {
                   else {
                        f.vx = 0; 
                        
                        // SỬA TẠI ĐÂY: Nếu đã hết thời gian hành động và đang ở tầm gần, xóa sạch trạng thái cũ để về 'idle'
                        if (['walk', 'dash_back', 'dash', 'block', 'hurt'].includes(f.state)) {
                            f.state = 'idle';
                        }
                        
                        if (f.aiDelay <= 0) {
                        f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; 
                        let usedSkill = false;
                        if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.05) { f.stamina -= 100; usedSkill = true; window.triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                        if (!usedSkill) {
                            let rand = Math.random();
                            if (closest.attackTimer > 0 || closest.state === 'dash') {
                                if (rand < 0.3) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; window.spawnDust(f.x, f.y); } 
                                else if (rand < 0.5) { f.state = 'block'; f.attackTimer = 15; } else { if(typeof window.attack === 'function') window.attack(f, targetGroup); }
                            } else {
                                if (rand < 0.9) { if (f.comboTimer > 0 && f.comboStep < 14) { f.comboStep++; } else { f.comboStep = 0; } f.comboTimer = 50; if(typeof window.attack === 'function') window.attack(f, targetGroup); } 
                                else { if (Math.random() < 0.3) { f.state = 'block'; f.attackTimer = 10; } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } }
                            }
                        }
                    }
                }
            } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
        }

        f.vy += window.GRAVITY; f.y += f.vy; if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; } else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { f.vx *= 0.85; }
        f.x += f.vx;

        let bounds = 30 * (f.scale || 1);
        // Kiểm tra giới hạn tường bên trái
if (f.x < bounds) { 
    f.x = bounds; 
    if (f.hitStun > 0 && f.vx < -4) { 
        f.vx = -f.vx * 0.4; 
        f.hitStun = 10; 
        window.shakeScreen(10, 4); 
        if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
        window.playSound(100, 'sine', 0.2, 0.3, true); 
        window.spawnDust(f.x, f.y); 
    } else if(f.state !== 'walk' && f.state !== 'dash_back') { 
        f.vx = 0; 
    } 
}

// Kiểm tra giới hạn tường bên phải (Đã sửa từ 600 thành độ rộng Canvas thực tế)
if (f.x > window.canvas.width - bounds) { 
    f.x = window.canvas.width - bounds; 
    if (f.hitStun > 0 && f.vx > 4) { 
        f.vx = -f.vx * 0.4; 
        f.hitStun = 10; 
        window.shakeScreen(10, 4); 
        if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
        window.playSound(100, 'sine', 0.2, 0.3, true); 
        window.spawnDust(f.x, f.y); 
    } else if(f.state !== 'walk' && f.state !== 'dash_back') { 
        f.vx = 0; 
    } 
}
        if (!f.trailArr) f.trailArr = [];
        let isAttacking = f.attackTimer > 0 && ['jab','cross','low_kick','hook','backfist','teep_kick','elbow_strike','high_kick','spinning_heel','shoulder_bash','palm_strike','uppercut','knee_strike','axe_kick','one_inch_punch','dempsey_roll'].includes(f.state);
        if (((f.state === 'dash' || f.state === 'dash_back' || f.isRage) && Math.abs(f.vx) > 1) || (isAttacking && f.attackTimer % 2 === 0)) { f.trailArr.push({x: f.x, y: f.y, state: f.state, isFacingRight: f.isFacingRight, color: f.color, alpha: 0.5, scale: f.scale, isDragon: f.isDragon}); }
        for (let i = f.trailArr.length - 1; i >= 0; i--) { f.trailArr[i].alpha -= 0.05; if (f.trailArr[i].alpha <= 0) f.trailArr.splice(i, 1); }
    });

    for (let i = 0; i < allFighters.length; i++) { for (let j = i + 1; j < allFighters.length; j++) { let f1 = allFighters[i], f2 = allFighters[j]; let overlapX = f2.x - f1.x; let pushDist = 30 * Math.max(f1.scale||1, f2.scale||1); if (Math.abs(overlapX) < pushDist) { let pushForce = (pushDist - Math.abs(overlapX)) / 2; if (overlapX === 0) overlapX = 1; let sign = Math.sign(overlapX); f1.x -= pushForce * sign; f2.x += pushForce * sign; } } }

    if (window.p1) { let b1 = document.getElementById("btn-s1"), b2 = document.getElementById("btn-s2"), b3 = document.getElementById("btn-s3"), bDodge = document.getElementById("btn-dodge"); if (b1 && b2 && b3 && bDodge) { b1.className = (window.p1.stamina >= 25) ? "skill-btn s1-ready" : "skill-btn"; b2.className = (window.p1.stamina >= 50) ? "skill-btn s2-ready" : "skill-btn"; b3.className = (window.p1.stamina >= 100) ? "skill-btn s3-ready" : "skill-btn"; bDodge.className = (window.p1.stamina >= 15) ? "skill-btn s-dodge-ready" : "skill-btn"; } }

    for (let i = window.projectiles.length - 1; i >= 0; i--) { let proj = window.projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); if(typeof window.takeDamage === 'function') window.takeDamage(proj.target, proj.dmg, "#9b59b6", false, false); window.shakeScreen(8, 4); window.projectiles.splice(i, 1); } else if (proj.x < -100 || proj.x > window.canvas.width + 100 || proj.y < -100 || proj.y > window.canvas.height + 100) { window.projectiles.splice(i, 1); } }
    for (let i = window.traps.length - 1; i >= 0; i--) { let t = window.traps[i]; t.life--; if (t.life <= 0) { window.traps.splice(i, 1); continue; } }
    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }
    
    window.currentZoom += (window.targetZoom - window.currentZoom) * 0.1; if (Math.abs(window.targetZoom - window.currentZoom) < 0.01 && window.targetZoom !== 1) window.targetZoom = 1;
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { let t = window.floatingTexts[i]; if (t.life !== undefined) { t.vy += window.GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) window.floatingTexts.splice(i, 1); }
}

window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    window.ctx.setTransform(1, 0, 0, 1, 0, 0); window.ctx.globalAlpha = 1.0; window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.save();
    
    try {
        window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(window.currentZoom, window.currentZoom); window.ctx.translate(-window.canvas.width/2, -window.canvas.height/2);
        
        if (window.slowMoTimer > 0) { let loserX = (window.p1 && window.p1.hp <= 0) ? window.p1.x : (window.enemies.length > 0 ? window.enemies[0].x : 300); let targetCamX = (window.canvas.width / 2) - loserX; window.camX += (targetCamX - window.camX) * 0.1; window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(1.2, 1.2); window.ctx.translate(-window.canvas.width/2 + window.camX, -window.canvas.height/2 + 20); } 
        else if (window.p1 && !window.gameOver && window.introTimer === 0) { let closest = window.getClosestEnemy(window.p1, window.enemies); let centerX = closest ? (window.p1.x + closest.x) / 2 : window.p1.x; let targetCamX = (window.canvas.width / 2) - centerX; targetCamX = Math.max(-100, Math.min(100, targetCamX)); window.camX += (targetCamX - window.camX) * 0.1; window.ctx.translate(window.camX, 0); }
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 

        window.ctx.fillStyle = "#1e272e"; window.ctx.fillRect(-400, -100, window.canvas.width + 800, window.canvas.height + 100);
        window.ctx.save(); window.ctx.translate(window.camX * 0.2, 0); window.ctx.fillStyle = "#2f3640"; for(var i = -500; i < window.canvas.width + 1000; i += 120) { window.ctx.fillRect(i, window.GROUND_Y - 150 + Math.sin(i)*30, 80, 150); } window.ctx.restore();
        window.ctx.save(); window.ctx.translate(window.camX * 0.5, 0); window.ctx.fillStyle = "#353b48"; for(var i = -500; i < window.canvas.width + 1000; i += 90) { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i + 45, window.GROUND_Y - 100); window.ctx.lineTo(i + 90, window.GROUND_Y); window.ctx.fill(); } window.ctx.restore();
        
        window.ctx.fillStyle = "#111"; window.ctx.fillRect(-400, window.GROUND_Y, window.canvas.width + 800, window.canvas.height - window.GROUND_Y); 
        window.ctx.strokeStyle = "#ff4757"; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-400, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 400, window.GROUND_Y); window.ctx.stroke();
        window.ctx.strokeStyle = "#222"; window.ctx.lineWidth = 2; for(var i = -400; i < window.canvas.width + 400; i+=50) { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i - 20, window.canvas.height); window.ctx.stroke(); }
        window.ctx.fillStyle = "#ff4757"; window.ctx.fillRect(10, 0, 5, window.canvas.height); window.ctx.fillStyle = "#1e90ff"; window.ctx.fillRect(window.canvas.width - 15, 0, 5, window.canvas.height); 

        window.ctx.save(); window.ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; window.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; window.ctx.lineWidth = 1;
        window.weatherParticles.forEach(w => { if (window.currentWeather === 'snow') { window.ctx.beginPath(); window.ctx.arc(w.x + window.camX * 0.8, w.y, 2, 0, Math.PI*2); window.ctx.fill(); } else if (window.currentWeather === 'rain') { window.ctx.beginPath(); window.ctx.moveTo(w.x + window.camX * 0.8, w.y); window.ctx.lineTo(w.x - 5 + window.camX * 0.8, w.y + 15); window.ctx.stroke(); } });
        window.ctx.restore();

        window.traps.forEach(t => { window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
        window.projectiles.forEach(proj => { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.fill(); });
        
        window.ctx.globalCompositeOperation = 'lighter';
        window.shockwaves.forEach(sw => { window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); });
        window.impactSparks.forEach(isp => { window.ctx.save(); window.ctx.translate(isp.x, isp.y); window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 2, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
        window.ctx.globalCompositeOperation = 'source-over';

        if (window.p1) {
            let allFighters = [window.p1].concat(window.enemies); window.ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => { 
                if (p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); 
                        if (trailP.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, trailP, true); 
                        else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = 'source-over';
            if (window.p1.stamina >= 100) { window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#f1c40f"; } 
            window.enemies.forEach(e => { if(e.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, e); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, e); }); 
            if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, window.p1); window.ctx.shadowBlur = 0;
            if (window.p1.comboHits >= 2) { window.ctx.save(); window.ctx.font = "italic 900 28px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.textAlign = "left"; window.ctx.shadowBlur = 10; window.ctx.shadowColor = "#ff9f43"; window.ctx.fillText(`🔥 ${window.p1.comboHits}`, 30 - window.camX, 100 + Math.sin(Date.now() / 100) * 5); window.ctx.restore(); }
        }

        window.slashes.forEach(s => { window.ctx.save(); window.ctx.translate(s.x, s.y); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale, s.scale); window.ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); window.ctx.lineWidth = 15 * (1 - prog); let grad = window.ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); window.ctx.strokeStyle = grad; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 15; window.ctx.shadowColor = s.color; window.ctx.stroke(); window.ctx.restore(); });
        window.particles.forEach(pt => { window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); window.ctx.fillStyle = pt.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fill(); if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } }); window.ctx.globalAlpha = 1.0;
        window.floatingTexts.forEach(t => { window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.shadowBlur = 5; window.ctx.shadowColor = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.fillText(t.text, t.x, t.y); window.ctx.shadowBlur = 0; }); window.ctx.globalAlpha = 1.0;

        if (window.screenFlash > 0) { window.ctx.fillStyle = `rgba(255, 255, 255, ${window.screenFlash})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); }
        if (window.cinematicTimer > 0 && window.cinematicCaster) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let stripY = window.canvas.height / 2 - 50; window.ctx.fillStyle = window.cinematicCaster.color; window.ctx.fillRect(0, stripY, window.canvas.width, 100);
            let progress = (50 - window.cinematicTimer) / 50; let slideX = -200 + (progress * 800);
            window.ctx.fillStyle = "#fff"; window.ctx.font = "italic 900 60px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#fff"; window.ctx.fillText("⚡", slideX, stripY + 70); window.ctx.shadowBlur = 0;
            let avaX = window.canvas.width - slideX; let casterClone = Object.assign({}, window.cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); 
            if(casterClone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, casterClone); else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, casterClone);
        }
        
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.textAlign = "center";
            if (window.introTimer > 60) {
                let slideProgress = Math.min(1, (160 - window.introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let slideX1 = -200 + easeOut * (window.canvas.width / 2 - 120); let slideX2 = window.canvas.width + 200 - easeOut * (window.canvas.width / 2 - 120);
                let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.canvas.height/2 + 30, state: 'idle', isFacingRight: true}); 
                if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                
                if (window.enemies && window.enemies.length > 0) {
                    let repEnemy = window.enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.canvas.height/2 + 30, state: 'idle', isFacingRight: false}); 
                    if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, p2Clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone);
                    if (window.introTimer < 130 && window.introTimer > 70) { window.ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; window.ctx.fillRect(slideX2 - 20, window.canvas.height/2 - 140, 40, 30); window.ctx.fillStyle = "#111"; window.ctx.font = "bold 20px Arial"; window.ctx.fillText(repEnemy.taunt || "🤖", slideX2, window.canvas.height/2 - 118); }
                }
                window.ctx.font = "italic 900 35px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.fillText("👤", slideX1, window.canvas.height/2 + 80);
                let eName = (window.rewardMultiplier === 15) ? `👹` : (window.rewardMultiplier > 1 ? `🤖 x${window.rewardMultiplier}` : "🤖"); window.ctx.fillStyle = "#1e90ff"; window.ctx.fillText(eName, slideX2, window.canvas.height/2 + 80);
                if (window.introTimer < 130 && window.introTimer > 70) { window.ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; window.ctx.fillRect(slideX1 - 20, window.canvas.height/2 - 140, 40, 30); window.ctx.fillStyle = "#111"; window.ctx.font = "bold 20px Arial"; window.ctx.fillText(window.p1.taunt || "🔥", slideX1, window.canvas.height/2 - 118); }
                if (window.introTimer <= 120) { window.ctx.font = "italic 900 80px Arial"; window.ctx.fillStyle = "#f1c40f"; window.ctx.shadowBlur = 25; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🆚", window.canvas.width/2, window.canvas.height/2 - 10); window.ctx.shadowBlur = 0; }
            } else { let scale = 1 + (window.introTimer / 60); window.ctx.save(); window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(scale, scale); window.ctx.font = "italic 900 90px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.shadowBlur = 30; window.ctx.shadowColor = "#ff9f43"; window.ctx.fillText("🥊", 0, 30); window.ctx.restore(); }
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { window.ctx.restore(); }
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { 
        window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); 
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
    } 
}
