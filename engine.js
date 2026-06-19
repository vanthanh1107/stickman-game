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
        // CƠ CHẾ HỒI GIÁP & TRẠNG THÁI KIỆT SỨC
        if (f.isGuardBroken) {
            f.shieldBreak += 0.4; 
            if (Math.random() < 0.1) { window.particles.push({ x: f.x + (Math.random()-0.5)*20, y: f.y - 50, vx: 0, vy: Math.random() * 2, life: 20, maxLife: 20, color: "rgba(189, 195, 199, 0.8)", size: 3 }); }
            if (f.shieldBreak >= 100) {
                f.shieldBreak = 100; f.isGuardBroken = false; 
                window.spawnParticles(f.x, f.y, "#0984e3"); window.playSound(200, 'sine', 0.2, 0.5, false);
                window.floatingTexts.push({ x: f.x, y: f.y - 60, text: "🛡️ HỒI PHỤC!", color: "#0984e3", alpha: 1, vx: 0, vy: -2, font: "bold 28px Arial", life: 40 });
            }
        } else {
            // TỰ ĐỘNG HỒI GIÁP CHẬM NẾU ĐANG YÊN BÌNH (Tối ưu hóa chiến thuật)
            if (f.hitStun <= 0 && f.shieldBreak < 100) {
                f.shieldBreak += 0.05; 
                if (f.shieldBreak > 100) f.shieldBreak = 100;
            }
        }
        
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout === 0) f.comboStep = 0; }
        if (f.superArmor > 0) f.superArmor--; 
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.3); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; f.currentRegen = f.regen || 0.3;
        if (f.isGuardBroken) { f.currentSpeed *= 0.4; f.currentDmgMod *= 0.5; }

        if (f.hp > 0 && f.stamina < 100) f.stamina += f.currentRegen; if (f.stamina > 100) f.stamina = 100;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false;
        
        if (f.isRage && !f.isGuardBroken) { f.currentSpeed *= 1.2; f.currentDmgMod *= 1.2; f.currentRegen += 0.2; if (Math.random() < 0.3) window.particles.push({ x: f.x + (Math.random() - 0.5) * 30, y: f.y - Math.random() * 60, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 3 - 1, life: 15, maxLife: 15, color: f.color, size: Math.random() * 3 + 2 }); }
        if (f.isExhausted) { f.currentSpeed *= 0.6; }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        if (f.attackTimer === 0 && f.hitStun === 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            let targetGroup = f.isPlayer ? window.enemies : [window.p1]; let closest = window.getClosestEnemy(f, targetGroup);
            if (closest && closest.hp > 0) {
                let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);
                
                if (f.isGuardBroken && Math.random() < 0.6 && !f.isPlayer) { f.vx = -Math.sign(dist) * f.currentSpeed; f.state = 'walk'; } 
                else if (absDist > reach) { f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) window.spawnDust(f.x, f.y); } 
                else {
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; 
                        let usedSkill = false;
                        if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.05 && !f.isGuardBroken) { f.stamina -= 100; usedSkill = true; window.triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
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
        if (f.x < bounds) { f.x = bounds; if (f.hitStun > 0 && f.vx < -4) { f.vx = -f.vx * 0.4; f.hitStun = 5; window.shakeScreen(5, 3); if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }
        if (f.x > window.canvas.width - bounds) { f.x = window.canvas.width - bounds; if (f.hitStun > 0 && f.vx > 4) { f.vx = -f.vx * 0.4; f.hitStun = 5; window.shakeScreen(5, 3); if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }

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
