var canvas, ctx, audioCtx;
var isMuted = false; 
window.selectedRedClass = null;

var floatingTexts = [], particles = [], projectiles = [], traps = [], slashes = [], shockwaves = [], impactSparks = [];
var p1 = null, gameOver = false, isLoopRunning = false;
var enemies = []; 
var totalEnemyMaxHp = 0; 
window.rewardMultiplier = 1; 

var shakeTime = 0, shakeMag = 0, hitStopFrames = 0;
var matchResolved = false;
var camX = 0, screenFlash = 0, cinematicTimer = 0, cinematicCaster = null, cinematicCallback = null; 
var slowMoTimer = 0, introTimer = 0, uiShakeP1 = 0, uiShakeP2 = 0;
var currentZoom = 1, targetZoom = 1;

var currentWeather = 'none', weatherParticles = [];
var GROUND_Y = 320, GRAVITY = 0.8;
var lastFrameTime = 0, FRAME_MIN_TIME = 1000 / 60;

function triggerVibration(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); isMuted = !isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = isMuted ? "🔇" : "🔊"; if (!isMuted && audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); } }

function playSound(freq, type, duration, vol, isImpact = false) { 
    if (isMuted) return; 
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        let t = audioCtx.currentTime; let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); 
        osc.connect(gain); gain.connect(audioCtx.destination); 
        
        if (isImpact) {
            osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(30, t + duration); 
            gain.gain.setValueAtTime(vol * 2.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
        } else {
            osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 0.5, t); osc.frequency.linearRampToValueAtTime(freq, t + duration * 0.5);
            gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(vol * 1.5, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
        }
        osc.start(t); osc.stop(t + duration); 
    } catch(e){}
}

function shakeScreen(frames, magnitude) { shakeTime = frames; shakeMag = magnitude; }
function spawnTrap(x, y, radius, color, damage, lifeFrames, owner) { traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
function spawnProjectile(x, y, vx, vy, radius, color, dmg, target, customOnHit) { projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
function spawnSlash(x, y, isRight, color, isCrit, scale, rotation = 0) { slashes.push({ x: x, y: y, isRight: isRight, life: 12, maxLife: 12, color: color, scale: (isCrit ? 1.5 : 1) * scale, rotation: rotation }); }
function spawnParticles(x, y, color, isCrit = false) { let count = isCrit ? 20 : 10; for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 4 + 2 }); } }
function spawnDust(x, y) { for(let i=0; i<6; i++) { particles.push({ x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*4, vy: -Math.random()*3, life: 15, maxLife: 15, color: "rgba(236, 240, 241, 0.6)", size: Math.random() * 8 + 4 }); } }
function triggerCinematic(caster, callback) { cinematicTimer = 50; cinematicCaster = caster; cinematicCallback = callback; targetZoom = 1.15; playSound(400, 'sine', 0.4, 0.2, false); }

function getClosestEnemy(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { 
        if (targetsArray[i].hp <= 0) continue;
        let d = Math.abs(source.x - targetsArray[i].x); 
        if (d < minDist) { minDist = d; closest = targetsArray[i]; } 
    }
    return closest.hp > 0 ? closest : null;
}

function update() {
    if (!canvas) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); } if (!canvas || !ctx || !p1) return; 
    if (uiShakeP1 > 0) { uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (uiShakeP2 > 0) { uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }
    if (introTimer > 0) { introTimer--; if (introTimer === 60) playSound(100, 'sine', 0.5, 0.5, true); return; }

    let isSlowMoFrame = false; if (slowMoTimer > 0) { slowMoTimer--; if (slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (shakeTime > 0) shakeTime--; if (screenFlash > 0) screenFlash -= 0.05;
    if (cinematicTimer > 0 && !isSlowMoFrame) { cinematicTimer--; if (cinematicTimer === 0 && cinematicCallback) { cinematicCallback(); cinematicCallback = null; } return; }
    if (hitStopFrames > 0 && !isSlowMoFrame) { hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    weatherParticles.forEach(w => { w.y += w.speed; w.x += (currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2; if(w.y > canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } });
    for (let i = shockwaves.length - 1; i >= 0; i--) { let sw = shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) shockwaves.splice(i, 1); }
    for (let i = impactSparks.length - 1; i >= 0; i--) { impactSparks[i].x += impactSparks[i].vx; impactSparks[i].y += impactSparks[i].vy; impactSparks[i].vy += GRAVITY * 0.8; impactSparks[i].life--; if (impactSparks[i].life <= 0) impactSparks.splice(i, 1); }
    for (let i = particles.length - 1; i >= 0; i--) { let pt = particles[i]; if (pt.isCoin) { pt.vy += GRAVITY * 0.5; if (pt.y > GROUND_Y) { pt.y = GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } } pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) particles.splice(i, 1); }
    if (Math.random() < 0.12) { particles.push({ x: Math.random() * canvas.width, y: GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    enemies = enemies.filter(e => { 
        if(e.hp <= 0) { 
            spawnParticles(e.x, e.y, "#fff", true); playSound(100, 'sine', 0.5, 0.5, true); 
            for(let c=0; c<5; c++) particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true });
            if (p1 && p1.hp > 0) {
                let heal = Math.floor(p1.maxHp * 0.08); p1.hp = Math.min(p1.maxHp, p1.hp + heal);
                floatingTexts.push({ x: p1.x, y: p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 });
                p1.killCount = (p1.killCount || 0) + 1;
                let sT = ""; if(p1.killCount===2) sT="DOUBLE 💀💀"; else if(p1.killCount===3) sT="TRIPLE 💀💀💀"; else if(p1.killCount===5) sT="RAMPAGE 🔥"; else if(p1.killCount>=8) sT="GODLIKE 👑";
                if(sT) floatingTexts.push({ x: p1.x, y: p1.y - 120, text: sT, color: "#ff4757", alpha: 1, vx: 0, vy: -5, font: "italic 900 32px Arial", life: 50 });
            } return false; 
        } return true; 
    });
    
    let allFighters = [p1].concat(enemies);
    let gameContext = { floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (f.state === 'stunned' || f.stunTimer > 0) {
            f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; f.shieldBreak = ((f.maxStunTimer - f.stunTimer) / f.maxStunTimer) * 100; 
            if (f.stunTimer <= 0) { f.shieldBreak = 100; f.state = 'idle'; spawnParticles(f.x, f.y, "#2ed573"); floatingTexts.push({ x: f.x, y: f.y - 60, text: "🛡️✨", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 32px Arial", life: 40 }); }
        } else { if (f.hitStun <= 0 && f.shieldBreak < 100) { f.shieldBreak += 0.3; if (f.shieldBreak > 100) f.shieldBreak = 100; } }

        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout === 0) f.comboStep = 0; }
        if (f.superArmor > 0) f.superArmor--; 
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.3); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; f.currentRegen = f.regen || 0.3;
        if (f.hp > 0 && f.stamina < 100) f.stamina += f.currentRegen; if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false;
        
        if (f.isRage) { f.currentSpeed *= 1.2; f.currentDmgMod *= 1.2; f.currentRegen += 0.2; if (Math.random() < 0.3) particles.push({ x: f.x + (Math.random() - 0.5) * 30, y: f.y - Math.random() * 60, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 3 - 1, life: 15, maxLife: 15, color: f.color, size: Math.random() * 3 + 2 }); }
        if (f.isExhausted) { f.currentSpeed *= 0.6; }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        if (f.attackTimer === 0 && f.hitStun === 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !gameOver && f.hp > 0) {
            let targetGroup = f.isPlayer ? enemies : [p1]; let closest = getClosestEnemy(f, targetGroup);
            if (closest && closest.hp > 0) {
                let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);

                if (absDist > reach) {
                    f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) spawnDust(f.x, f.y);
                } else {
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                    
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; 
                        let usedSkill = false;
                        if (f.skill) {
                             if (f.stamina >= 100 && typeof f.skill.actionCode3 === 'function' && Math.random() < 0.05) { f.stamina -= 100; usedSkill = true; triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                             else if (f.stamina >= 50 && typeof f.skill.actionCode2 === 'function' && Math.random() < 0.05) { f.stamina -= 50; try { f.skill.actionCode2(f, closest, gameContext); usedSkill = true; if(f.state==='idle') { f.state = 'kick'; f.attackTimer = 20; } } catch (e) {} }
                             else if (f.stamina >= 25 && typeof f.skill.actionCode1 === 'function' && Math.random() < 0.05) { f.stamina -= 25; try { f.skill.actionCode1(f, closest, gameContext); usedSkill = true; if(f.state==='idle') { f.state = 'punch'; f.attackTimer = 12; } } catch (e) {} }
                        }
                        if (!usedSkill) {
                            let rand = Math.random();
                            if (closest.attackTimer > 0 || closest.state === 'dash') {
                                if (rand < 0.3) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; spawnDust(f.x, f.y); } 
                                else if (rand < 0.5) { f.state = 'block'; f.attackTimer = 15; } else { if (typeof attack === 'function') attack(f, targetGroup); }
                            } else {
                                if (rand < 0.9) {
                                    if (f.comboTimer > 0 && f.comboStep < 14) { f.comboStep++; } else { f.comboStep = 0; }
                                    f.comboTimer = 50; if (typeof attack === 'function') attack(f, targetGroup);
                                } else { if (Math.random() < 0.3) { f.state = 'block'; f.attackTimer = 10; } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } }
                            }
                        }
                    }
                }
            } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
        }

        f.vy += GRAVITY; f.y += f.vy; if (f.y >= GROUND_Y) { f.y = GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; } else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { f.vx *= 0.85; }
        f.x += f.vx;

        let bounds = 30 * (f.scale || 1);
        if (f.x < bounds) { f.x = bounds; if (f.hitStun > 0 && f.vx < -4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); if (typeof takeDamage === 'function') takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'sine', 0.2, 0.3, true); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }
        if (f.x > 600 - bounds) { f.x = 600 - bounds; if (f.hitStun > 0 && f.vx > 4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); if (typeof takeDamage === 'function') takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'sine', 0.2, 0.3, true); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }

        if (!f.trailArr) f.trailArr = [];
        let isAttacking = f.attackTimer > 0 && ['jab','cross','low_kick','hook','backfist','teep_kick','elbow_strike','high_kick','spinning_heel','shoulder_bash','palm_strike','uppercut','knee_strike','axe_kick','one_inch_punch','dempsey_roll'].includes(f.state);
        if (((f.state === 'dash' || f.state === 'dash_back' || f.isRage) && Math.abs(f.vx) > 1) || (isAttacking && f.attackTimer % 2 === 0)) { 
            f.trailArr.push({x: f.x, y: f.y, state: f.state, isFacingRight: f.isFacingRight, color: f.color, alpha: 0.5, scale: f.scale, isDragon: f.isDragon}); 
        }
        for (let i = f.trailArr.length - 1; i >= 0; i--) { f.trailArr[i].alpha -= 0.05; if (f.trailArr[i].alpha <= 0) f.trailArr.splice(i, 1); }
    });

    for (let i = 0; i < allFighters.length; i++) {
        for (let j = i + 1; j < allFighters.length; j++) {
            let f1 = allFighters[i], f2 = allFighters[j]; let overlapX = f2.x - f1.x;
            let pushDist = 30 * Math.max(f1.scale||1, f2.scale||1);
            if (Math.abs(overlapX) < pushDist) { let pushForce = (pushDist - Math.abs(overlapX)) / 2; if (overlapX === 0) overlapX = 1; let sign = Math.sign(overlapX); f1.x -= pushForce * sign; f2.x += pushForce * sign; }
        }
    }

    if (p1) {
        let b1 = document.getElementById("btn-s1"), b2 = document.getElementById("btn-s2"), b3 = document.getElementById("btn-s3"), bDodge = document.getElementById("btn-dodge");
        if (b1 && b2 && b3 && bDodge) { b1.className = (p1.stamina >= 25) ? "skill-btn s1-ready" : "skill-btn"; b2.className = (p1.stamina >= 50) ? "skill-btn s2-ready" : "skill-btn"; b3.className = (p1.stamina >= 100) ? "skill-btn s3-ready" : "skill-btn"; bDodge.className = (p1.stamina >= 15) ? "skill-btn s-dodge-ready" : "skill-btn"; }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) { let proj = projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); if (typeof takeDamage === 'function') takeDamage(proj.target, proj.dmg, "#9b59b6", false, false); shakeScreen(8, 4); projectiles.splice(i, 1); } else if (proj.x < -100 || proj.x > canvas.width + 100 || proj.y < -100 || proj.y > canvas.height + 100) { projectiles.splice(i, 1); } }
    for (let i = traps.length - 1; i >= 0; i--) { let t = traps[i]; t.life--; if (t.life <= 0) { traps.splice(i, 1); continue; } }
    for (let i = slashes.length - 1; i >= 0; i--) { slashes[i].life--; if (slashes[i].life <= 0) slashes.splice(i, 1); }
    
    currentZoom += (targetZoom - currentZoom) * 0.1; if (Math.abs(targetZoom - currentZoom) < 0.01 && targetZoom !== 1) targetZoom = 1;
    for (let i = floatingTexts.length - 1; i >= 0; i--) { let t = floatingTexts[i]; if (t.life !== undefined) { t.vy += GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) floatingTexts.splice(i, 1); }
}

function draw() {
    if (!canvas) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); } if (!canvas || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1.0; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save();
    try {
        ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(currentZoom, currentZoom); ctx.translate(-canvas.width/2, -canvas.height/2);
        
        if (slowMoTimer > 0) { let loserX = (p1 && p1.hp <= 0) ? p1.x : (enemies.length > 0 ? enemies[0].x : 300); let targetCamX = (canvas.width / 2) - loserX; camX += (targetCamX - camX) * 0.1; ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(1.2, 1.2); ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); } 
        else if (p1 && !gameOver && introTimer === 0) { let closest = getClosestEnemy(p1, enemies); let centerX = closest ? (p1.x + closest.x) / 2 : p1.x; let targetCamX = (canvas.width / 2) - centerX; targetCamX = Math.max(-100, Math.min(100, targetCamX)); camX += (targetCamX - camX) * 0.1; ctx.translate(camX, 0); }
        if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag); 

        ctx.fillStyle = "#1e272e"; ctx.fillRect(-400, -100, canvas.width + 800, canvas.height + 100);
        ctx.save(); ctx.translate(camX * 0.2, 0); ctx.fillStyle = "#2f3640"; for(var i = -500; i < canvas.width + 1000; i += 120) { ctx.fillRect(i, GROUND_Y - 150 + Math.sin(i)*30, 80, 150); } ctx.restore();
        ctx.save(); ctx.translate(camX * 0.5, 0); ctx.fillStyle = "#353b48"; for(var i = -500; i < canvas.width + 1000; i += 90) { ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i + 45, GROUND_Y - 100); ctx.lineTo(i + 90, GROUND_Y); ctx.fill(); } ctx.restore();
        
        ctx.fillStyle = "#111"; ctx.fillRect(-400, GROUND_Y, canvas.width + 800, canvas.height - GROUND_Y); 
        ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-400, GROUND_Y); ctx.lineTo(canvas.width + 400, GROUND_Y); ctx.stroke();
        ctx.strokeStyle = "#222"; ctx.lineWidth = 2; for(var i = -400; i < canvas.width + 400; i+=50) { ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i - 20, canvas.height); ctx.stroke(); }
        ctx.fillStyle = "#ff4757"; ctx.fillRect(10, 0, 5, canvas.height); ctx.fillStyle = "#1e90ff"; ctx.fillRect(canvas.width - 15, 0, 5, canvas.height); 

        ctx.save(); ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 1;
        weatherParticles.forEach(w => { if (currentWeather === 'snow') { ctx.beginPath(); ctx.arc(w.x + camX * 0.8, w.y, 2, 0, Math.PI*2); ctx.fill(); } else if (currentWeather === 'rain') { ctx.beginPath(); ctx.moveTo(w.x + camX * 0.8, w.y); ctx.lineTo(w.x - 5 + camX * 0.8, w.y + 15); ctx.stroke(); } });
        ctx.restore();

        traps.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); ctx.fillStyle = t.color; ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; ctx.fill(); ctx.globalAlpha = 1.0; });
        projectiles.forEach(proj => { ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); ctx.fillStyle = proj.color; ctx.fill(); });
        
        ctx.globalCompositeOperation = 'lighter';
        shockwaves.forEach(sw => { ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); ctx.lineWidth = 5; ctx.strokeStyle = sw.color; ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); ctx.stroke(); });
        impactSparks.forEach(isp => { ctx.save(); ctx.translate(isp.x, isp.y); ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); ctx.fillStyle = isp.color; ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2; let ang = Math.atan2(isp.vy, isp.vx); ctx.rotate(ang); ctx.ellipse(0, 0, len, 2, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); });
        ctx.globalCompositeOperation = 'source-over';

        if (p1) {
            let allFighters = [p1].concat(enemies); ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => { 
                if (p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); 
                        if (typeof drawDragon === 'function' && trailP.isDragon) drawDragon(ctx, trailP, true); 
                        else if (typeof drawStickman === 'function') drawStickman(ctx, trailP, true); 
                    }); 
                } 
            });
            ctx.globalCompositeOperation = 'source-over';
            if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; } 
            
            enemies.forEach(e => {
                if(e.isDragon && typeof drawDragon === 'function') drawDragon(ctx, e);
                else if (typeof drawStickman === 'function') drawStickman(ctx, e);
            }); 
            if(typeof drawStickman === 'function') drawStickman(ctx, p1); ctx.shadowBlur = 0;
            if (p1.comboHits >= 2) { ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = "#ff9f43"; ctx.textAlign = "left"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff9f43"; ctx.fillText(`🔥 ${p1.comboHits}`, 30 - camX, 100 + Math.sin(Date.now() / 100) * 5); ctx.restore(); }
        }

        slashes.forEach(s => { ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); ctx.beginPath(); ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); ctx.lineWidth = 15 * (1 - prog); let grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); ctx.strokeStyle = grad; ctx.lineCap = "round"; ctx.shadowBlur = 15; ctx.shadowColor = s.color; ctx.stroke(); ctx.restore(); });
        particles.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); ctx.fill(); if (pt.isCoin) { ctx.strokeStyle = "#d35400"; ctx.lineWidth = 1; ctx.stroke(); } }); ctx.globalAlpha = 1.0;
        floatingTexts.forEach(t => { ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; }); ctx.globalAlpha = 1.0;

        if (screenFlash > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        if (cinematicTimer > 0 && cinematicCaster) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let stripY = canvas.height / 2 - 50; ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
            let progress = (50 - cinematicTimer) / 50; let slideX = -200 + (progress * 800);
            ctx.fillStyle = "#fff"; ctx.font = "italic 900 60px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillText("⚡", slideX, stripY + 70); ctx.shadowBlur = 0;
            let avaX = canvas.width - slideX; let casterClone = Object.assign({}, cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); 
            if(casterClone.isDragon && typeof drawDragon === 'function') drawDragon(ctx, casterClone); else if(typeof drawStickman === 'function') drawStickman(ctx, casterClone);
        }
        
        if (introTimer > 0 && !gameOver && p1) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.textAlign = "center";
            if (introTimer > 60) {
                let slideProgress = Math.min(1, (160 - introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let slideX1 = -200 + easeOut * (canvas.width / 2 - 120); let slideX2 = canvas.width + 200 - easeOut * (canvas.width / 2 - 120);
                let p1Clone = Object.assign({}, p1, {x: slideX1, y: canvas.height/2 + 30, state: 'idle', isFacingRight: true}); 
                if(typeof drawStickman === 'function') drawStickman(ctx, p1Clone);
                
                if (enemies && enemies.length > 0) {
                    let repEnemy = enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: canvas.height/2 + 30, state: 'idle', isFacingRight: false}); 
                    if (repEnemy.isDragon && typeof drawDragon === 'function') drawDragon(ctx, p2Clone);
                    else if (typeof drawStickman === 'function') drawStickman(ctx, p2Clone);
                    if (introTimer < 130 && introTimer > 70) { ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.fillRect(slideX2 - 20, canvas.height/2 - 140, 40, 30); ctx.fillStyle = "#111"; ctx.font = "bold 20px Arial"; ctx.fillText(repEnemy.taunt || "🤖", slideX2, canvas.height/2 - 118); }
                }
                ctx.font = "italic 900 35px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("👤", slideX1, canvas.height/2 + 80);
                let eName = (window.rewardMultiplier === 15) ? `👹` : (window.rewardMultiplier > 1 ? `🤖 x${window.rewardMultiplier}` : "🤖"); ctx.fillStyle = "#1e90ff"; ctx.fillText(eName, slideX2, canvas.height/2 + 80);
                if (introTimer < 130 && introTimer > 70) { ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.fillRect(slideX1 - 20, canvas.height/2 - 140, 40, 30); ctx.fillStyle = "#111"; ctx.font = "bold 20px Arial"; ctx.fillText(p1.taunt || "🔥", slideX1, canvas.height/2 - 118); }
                if (introTimer <= 120) { ctx.font = "italic 900 80px Arial"; ctx.fillStyle = "#f1c40f"; ctx.shadowBlur = 25; ctx.shadowColor = "#f1c40f"; ctx.fillText("🆚", canvas.width/2, canvas.height/2 - 10); ctx.shadowBlur = 0; }
            } else { let scale = 1 + (introTimer / 60); ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale); ctx.font = "italic 900 90px Arial"; ctx.fillStyle = "#ff9f43"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff9f43"; ctx.fillText("🥊", 0, 30); ctx.restore(); }
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { ctx.restore(); }
}
