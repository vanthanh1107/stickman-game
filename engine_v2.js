// ==========================================
// ENGINE.JS - LÕI XỬ LÝ VẬT LÝ, AI VÀ VÒNG LẶP UPDATE
// ==========================================

window.update = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx || !window.p1) return; 

    if (window.koGlitchTimer > 0) { window.koGlitchTimer--; if (window.bgmBase) window.bgmBase.volume = 0; if (window.bgmClimax) window.bgmClimax.volume = 0; }
    if (window.uiShakeP1 > 0) { window.uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (window.uiShakeP2 > 0) { window.uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }

    if (window.introTimer > 0) { 
        window.introTimer--; 
        if (window.p1 && window.enemies.length > 0) { window.p1.x = 150; window.enemies.forEach((e, i) => { e.x = window.canvas.width - 150 + (i * 40); }); }
        if (window.introTimer === 60) window.playSound(100, 'sine', 0.5, 0.5, true); 
        return; 
    }

    if (!window.gameOver) {
        window.matchTimer++; if (window.matchTimer === 1) { window.envHazards = []; window.envDamage = []; }
        let meteorChance = 0.002 + (window.matchTimer / 3600) * 0.01; 
        if (Math.random() < meteorChance) { window.projectiles.push({ x: Math.random() * window.canvas.width, y: -100, vx: (Math.random() - 0.5) * 4, vy: 8 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); }
        if (window.currentWeather === 'rain' && Math.random() < 0.005) { window.envHazards.push({ type: 'lightning', x: Math.random() * window.canvas.width, timer: 45 }); } 
        else if (window.currentWeather === 'ash' && Math.random() < 0.003) { window.envHazards.push({ type: 'lava', x: Math.random() * window.canvas.width, timer: 60 }); }
    }

    let isSlowMoFrame = false; if (window.slowMoTimer > 0) { window.slowMoTimer--; if (window.slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (window.shakeTime > 0) window.shakeTime--; if (window.screenFlash > 0) window.screenFlash -= 0.05;
    if (window.cinematicTimer > 0 && !isSlowMoFrame) { window.cinematicTimer--; if (window.cinematicTimer === 0 && window.cinematicCallback) { try { window.cinematicCallback(); } catch(e) {} window.cinematicCallback = null; } return; }
    if (window.hitStopFrames > 0 && !isSlowMoFrame) { window.hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    for (let i = window.envDamage.length - 1; i >= 0; i--) {
        let dmg = window.envDamage[i];
        if (dmg.life !== undefined) {
            dmg.life--;
            if (dmg.life <= 0) { window.envDamage.splice(i, 1); continue; }
            if (dmg.isBurning && Math.random() < 0.15) {
                window.particles.push({ 
                    x: dmg.x + (Math.random()-0.5) * dmg.radius * 0.8, y: window.GROUND_Y, 
                    vx: (Math.random()-0.5), vy: -Math.random()*5 - 1, 
                    life: 40, maxLife: 40, color: Math.random() > 0.4 ? "#e74c3c" : "#f1c40f", size: Math.random()*4+1 
                });
            }
        }
    }

    let allFighters = [window.p1].concat(window.enemies);

    for (let i = window.envHazards.length - 1; i >= 0; i--) {
        let haz = window.envHazards[i]; haz.timer--;
        if (haz.timer <= 0) {
            if (haz.type === 'lightning') {
                window.playSound(300, 'sawtooth', 0.8, 0.8, true); window.screenFlash = 0.8; window.shakeScreen(20, 15); window.slashes.push({ x: haz.x, y: window.GROUND_Y - 300, isRight: true, life: 15, maxLife: 15, color: "#ffffff", scale: 5, rotation: Math.PI/2 });
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 60) { if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#f1c40f", true, false); f.state = 'hurt'; f.hitStun = 35; f.vx = (f.x - haz.x > 0 ? 15 : -15); } });
            } else if (haz.type === 'lava') {
                window.playSound(100, 'square', 0.8, 0.8, true); window.shakeScreen(25, 12); window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); for(let k=0; k<15; k++) window.particles.push({ x: haz.x + (Math.random()-0.5)*40, y: window.GROUND_Y, vx: (Math.random()-0.5)*12, vy: -10 - Math.random()*15, life: 40, maxLife: 40, color: "#e67e22", size: Math.random()*12+5 });
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false); f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; } });
            } window.envHazards.splice(i, 1);
        }
    }

    window.weatherParticles.forEach(w => { 
        if (window.currentWeather === 'toxic' || window.currentWeather === 'ash') { w.y -= w.speed * 0.5; w.x += Math.sin(w.y/30)*2; if(w.y < -20) { w.y = window.canvas.height + 20; w.x = Math.random() * 1200 - 300; } } 
        else { w.y += w.speed; w.x += (window.currentWeather === 'rain') ? -3 : Math.sin(w.y/50)*2; if(w.y > window.canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } }
    });

    for (let i = window.shockwaves.length - 1; i >= 0; i--) { let sw = window.shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) window.shockwaves.splice(i, 1); }
    for (let i = window.impactSparks.length - 1; i >= 0; i--) { window.impactSparks[i].x += window.impactSparks[i].vx; window.impactSparks[i].y += window.impactSparks[i].vy; window.impactSparks[i].vy += window.GRAVITY * 0.8; window.impactSparks[i].life--; if (window.impactSparks[i].life <= 0) window.impactSparks.splice(i, 1); }
    
    for (let i = window.particles.length - 1; i >= 0; i--) { 
        let pt = window.particles[i]; 
        if (pt.isCoin) { 
            pt.vy += window.GRAVITY * 0.5; 
            if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } 
        } else if (pt.isRubble) { 
            pt.vy += window.GRAVITY * 0.9;
            if (pt.y > window.GROUND_Y) { pt.y = window.GROUND_Y; pt.vy *= -0.4; pt.vx *= 0.6; }
        }
        pt.x += pt.vx; pt.y += pt.vy; pt.life--; 
        if (pt.life <= 0) window.particles.splice(i, 1); 
    }
    
    if (Math.random() < 0.12) { window.particles.push({ x: Math.random() * window.canvas.width, y: window.GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    window.enemies.forEach(e => { 
        if (e.hp <= 0 && !e.deathTriggered) {
            e.deathTriggered = true; e.state = 'ko_falling'; e.koTimer = 100; e.vy = -8; e.vx = e.isFacingRight ? -3 : 3; e.onGround = false; window.spawnParticles(e.x, e.y, "#fff", true); window.playSound(100, 'sine', 0.5, 0.5, true); 
            for(let c=0; c<5; c++) window.particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true });
            if (window.p1 && window.p1.hp > 0) { let heal = Math.floor(window.p1.maxHp * 0.08); window.p1.hp = Math.min(window.p1.maxHp, window.p1.hp + heal); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 }); }
        }
    });

    if (window.p1 && window.p1.hp <= 0 && !window.p1.deathTriggered) { window.p1.deathTriggered = true; window.p1.state = 'ko_falling'; window.p1.koTimer = 100; window.p1.vy = -8; window.p1.vx = window.p1.isFacingRight ? -3 : 3; window.p1.onGround = false; window.spawnParticles(window.p1.x, window.p1.y, "#fff", true); }
    
    let gameContext = { floatingTexts: window.floatingTexts, projectiles: window.projectiles, traps: window.traps, spawnTrap: window.spawnTrap, spawnParticles: window.spawnParticles, spawnProjectile: window.spawnProjectile, playSound: window.playSound, shakeScreen: window.shakeScreen, takeDamage: window.takeDamage, updateHPUIs: window.updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; window.spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { window.spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; window.spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (!f) return;
        if (f.hp <= 0) { 
            if (f.koTimer > 0) f.koTimer--; f.vy += window.GRAVITY * 0.5; 
            if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { 
                window.spawnDust(f.x, window.GROUND_Y); 
                if (f.vy > 8 || f.state === 'ko_falling') { 
                    window.shakeScreen(f.vy > 10 ? 8 : 5, 4); 
                    window.spawnEnvDamage(f.x, window.GROUND_Y, 'crater', f.scale || 1, false); 
                } else if (f.vy > 6) { window.shakeScreen(4, 2); }
            } 
            f.y += f.vy; f.x += f.vx; f.vx *= 0.93; 
            if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.vx = 0; f.onGround = true; f.state = 'dead'; } 
            return; 
        }

        if (f.iFrames > 0) { f.iFrames--; } else { f.iFrames = 0; }
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout <= 0) f.comboStep = 0; }
        if (f.comboTimer > 0) f.comboTimer--; if (f.superArmor > 0) f.superArmor--; 
        
        if (f.comboDisplayTimer > 0) {
            f.comboDisplayTimer--;
            f.comboAlpha = 1;
        } else if (f.comboHits > 0) {
            f.comboAlpha = (f.comboAlpha || 1) - 0.02; 
            if (f.comboAlpha <= 0) {
                f.comboAlpha = 0;
                f.comboHits = 0; 
            }
        }

        if (f.state === 'stunned' || f.stunTimer > 0) { f.stunTimer--; f.state = 'stunned'; f.vx *= 0.5; if (f.stunTimer <= 0) { f.state = 'idle'; } }
        if (f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0) { if (f.state !== 'idle' && f.state !== 'walk') { f.state = 'idle'; } }
        if (f.state === 'idle' || f.state === 'walk') { f.iFrames = 0; }

        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.2); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; 

        f.inCrater = false;
        f.craterDepth = 0;
        if (f.onGround) {
            window.envDamage.forEach(dmg => {
                if (dmg.type === 'crater') {
                    let distToCenter = Math.abs(f.x - dmg.x);
                    if (distToCenter < (dmg.radius || 40) * 0.9) {
                        f.inCrater = true;
                        
                        let depthRatio = 1 - (distToCenter / ((dmg.radius || 40) * 0.9));
                        f.craterDepth = 25 * Math.pow(depthRatio, 0.8) * dmg.scale; 
                        f.currentSpeed *= (0.4 + 0.6 * (1 - depthRatio));
                        
                        if ((f.state === 'walk' || f.state === 'dash' || f.state === 'dash_back') && window.matchTimer % 6 === 0) {
                            window.spawnDust(f.x, window.GROUND_Y + f.craterDepth);
                            window.particles.push({x: f.x, y: window.GROUND_Y, vx: (Math.random()-0.5)*5, vy: -Math.random()*4-2, life: 20, maxLife: 20, color: "#555", size: 3, isRubble: true});
                        }
                        
                        if (dmg.isBurning && window.matchTimer % 20 === 0 && f.hp > 0 && f.iFrames <= 0) {
                            if (typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(4 * dmg.scale), "#e74c3c", false, false);
                            window.spawnParticles(f.x, f.y - 15, "#e74c3c");
                            window.floatingTexts.push({ x: f.x, y: f.y - 70, text: "🔥", color: "#e74c3c", alpha: 1, vx: 0, vy: -1.5, font: "20px Arial", life: 30 });
                        }
                    }
                }
            });
        }

        if (window.currentWeather === 'snow') { f.currentSpeed *= 0.65; } else if (window.currentWeather === 'rain') { f.currentSpeed *= 1.25; } else if (window.currentWeather === 'ash') { f.currentDmgMod *= 1.30; } 
        else if (window.currentWeather === 'toxic') { f.currentDmgMod *= 0.80; if (window.matchTimer % 90 === 0 && f.hp > 1 && !window.gameOver) { f.hp -= 1; window.particles.push({x: f.x, y: f.y-30, vx:0, vy:-1, life:20, maxLife:20, color:"#2ecc71", size:4}); } }

        if (f.isRage) { f.currentSpeed *= 1.5; f.currentDmgMod *= 1.5; f.aiDelay = 0; window.particles.push({ x: f.x + (Math.random() - 0.5) * 40, y: f.y - Math.random() * 80, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 6 - 2, life: 30, maxLife: 30, color: "#ff4757", size: Math.random() * 6 + 3 }); if (Math.random() < 0.05) window.shakeScreen(2, 2); }
        
        if (f.hp > 0 && f.stamina < 100) f.stamina += (f.isRage ? 0.4 : (f.regen * 0.2 || 0.05)); 
        if (f.stamina > 100) f.stamina = 100;
        
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false; if (f.isExhausted) { f.currentSpeed *= 0.6; }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) window.particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        let launchedUltimate = false;
        let targetGroup = f.isPlayer ? window.enemies : [window.p1];
        let closestTarget = typeof window.getClosestEnemy === 'function' ? window.getClosestEnemy(f, targetGroup) : null;

        if (f.stamina >= 100 && f.hp > 0 && closestTarget && closestTarget.hp > 0 && window.introTimer <= 0 && !window.gameOver) {
            if (f.hitStun <= 0 && f.stunTimer <= 0 && f.state !== 'dash_back' && f.state !== 'block') {
                let distToTarget = closestTarget.x - f.x;
                let absDist = Math.abs(distToTarget);
                let type = (f.classId || "dausi").toLowerCase();
                let isCloseEnough = (absDist < 250) || type.includes('satthu') || type.includes('phapsu');

                if (isCloseEnough) {
                    if (window.classStats && window.classStats[type] && typeof window.classStats[type].executeUltimate === 'function') {
                        f.stamina = 0;
                        let baseDmg = 50 * (f.currentDmgMod || 1); if (!f.isPlayer) baseDmg = 35 * (f.currentDmgMod || 1);
                        window.playSound(400, 'sine', 0.5, 0.6); window.shakeScreen(15, 10); window.spawnParticles(f.x, f.y, "#f1c40f", true);
                        let ultText = f.isPlayer ? "🔥 ULTIMATE!" : "⚠️ DANGER!"; let ultColor = f.isPlayer ? "#ff4757" : "#ff0000";
                        window.floatingTexts.push({ x: f.x, y: f.y - 100, text: ultText, color: ultColor, alpha: 1, vx: 0, vy: -3, font: "900 35px Arial", life: 50 });
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
                    f.vx = Math.sign(distToTarget) * f.currentSpeed * 1.5;
                    f.attackTimer = 5; 
                    launchedUltimate = true;
                }
            }
        }

        if (!launchedUltimate && f.attackTimer <= 0 && f.hitStun <= 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !window.gameOver && f.hp > 0) {
            if (f.isDragon) {
                if (f.hp > 0 && f.hp <= f.maxHp * 0.3 && !f.isEvolved) { f.isEvolved = true; window.slowMoTimer = 60; window.screenFlash = 1.0; window.shakeScreen(50, 15); window.playSound(50, 'sawtooth', 2.0, 1.0, true); f.color = "#8e44ad"; f.scale *= 1.25; window.floatingTexts.push({ x: f.x, y: f.y - 150, text: "🐉🔥", color: "#8e44ad", alpha: 1, vx: 0, vy: -3, font: "italic 900 60px Arial", life: 100 }); window.shockwaves.push({x: f.x, y: window.GROUND_Y, r: 10, maxR: 500, color: "#8e44ad", alpha: 1, speed: 25}); }
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0;
                    if (f.aiDelay <= 0) {
                        f.aiDelay = f.isEvolved ? 0 : Math.floor(Math.random() * 20) + 20; let randAction = Math.random();
                        if (randAction < 0.45) { f.state = 'breathe_fire'; f.attackTimer = 40; f.vx = 0; window.playSound(250, 'sawtooth', 0.6, 0.3, false); let fireCount = 0; let fireInterval = setInterval(() => { if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(fireInterval); return; } let fireVx = f.isFacingRight ? (f.isEvolved ? 15 : 11) : (f.isEvolved ? -15 : -11); if (f.isEvolved) { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, -3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 0, 15, "#8e44ad", Math.floor(35 * f.dmgMod), window.p1 ); window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, 3, 15, "#9b59b6", Math.floor(35 * f.dmgMod), window.p1 ); } else { window.spawnProjectile( f.x + (f.isFacingRight ? 55 : -55), f.y - 65, fireVx, (Math.random() - 0.5) * 4, 13, "#e74c3c", Math.floor(25 * f.dmgMod), window.p1 ); } fireCount++; if (fireCount >= (f.isEvolved ? 8 : 6)) clearInterval(fireInterval); }, f.isEvolved ? 60 : 85); } 
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
                        if (absDist > 110) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 1.5; if (Math.random() < 0.3) { f.state = 'dash'; f.dashTimer = 8; f.dashDir = Math.sign(dist); window.spawnDust(f.x, f.y); } } 
                        else if (randAction < 0.33) { 
                            f.state = 'one_inch_punch'; f.attackTimer = 22; f.vx = Math.sign(dist) * 4; window.playSound(380, 'square', 0.25, 0.9, true); 
                            if (absDist < 65) { 
                                if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(32 * f.currentDmgMod), "#f1c40f", true, false); 
                                window.p1.vx = Math.sign(dist) * 6; window.shakeScreen(15, 12); window.floatingTexts.push({ x: window.p1.x, y: window.p1.y - 80, text: "🗣️", color: "#f1c40f", alpha: 1, vx: 0, vy: -3, font: "900 40px Arial", life: 50 }); 
                            } 
                        } 
                        else if (randAction < 0.66) { 
                            f.state = 'high_kick'; f.attackTimer = 28; f.vx = Math.sign(dist) * 5; let kickCount = 0; 
                            let kickInterval = setInterval(() => { 
                                if (window.gameOver || f.hp <= 0 || !window.p1) { clearInterval(kickInterval); return; } 
                                if (Math.abs(window.p1.x - f.x) < 85) { 
                                    if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(12 * f.currentDmgMod), "#ecf0f1", false, false); 
                                    window.p1.vx = Math.sign(dist) * 3; window.shakeScreen(4, 3); 
                                } 
                                kickCount++; if (kickCount >= 3) clearInterval(kickInterval); 
                            }, 70); 
                            window.floatingTexts.push({ x: f.x, y: f.y - 100, text: "👟", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); 
                        } 
                        else { 
                            f.state = 'machine_gun_punches'; f.attackTimer = 30; f.vx = Math.sign(dist) * 2.5; window.playSound(280, 'sine', 0.4, 0.5); 
                            if (absDist < 85) { 
                                if (typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(16 * f.currentDmgMod), "#f1c40f", false, false); 
                                window.shakeScreen(5, 4); window.spawnParticles(window.p1.x, window.p1.y, "#f1c40f"); 
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
                        f.aiDelay = Math.floor(Math.random() * 20) + 30; 
                        if (absDist > 250 && Math.random() < 0.6) { f.state = 'cast'; f.attackTimer = 25; window.playSound(300, 'sine', 0.3, 0.6); window.spawnSlash(f.x + (f.isFacingRight? 50:-50), f.y - 40, f.isFacingRight, "#fff", true, 2.0, Math.PI/2); window.spawnProjectile(f.x, f.y - 40, f.isFacingRight ? 12 : -12, 0, 15, "#fff", Math.floor(25 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🗡️", color: "#fff", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); } 
                        else { 
                            f.state = 'dash'; f.dashTimer = 15; f.dashDir = Math.sign(dist); f.currentSpeed *= 2.5; f.iFrames = 20; window.playSound(400, 'sawtooth', 0.4, 0.8, true); 
                            setTimeout(() => { 
                                if(window.gameOver || f.hp <= 0 || !window.p1) return; 
                                if(Math.abs(window.p1.x - f.x) < 180) { 
                                    if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(40 * f.dmgMod), "#e74c3c", true, false); 
                                    window.shakeScreen(20, 15); window.p1.vx = Math.sign(dist) * 6; 
                                } 
                                window.spawnSlash(f.x, window.p1.y - 30, f.isFacingRight, "#e74c3c", true, 3.0, (Math.random()-0.5)); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "⚡", color: "#e74c3c", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 40 }); 
                            }, 200); 
                        }
                    } else if (absDist > 150) { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 0.5; }
                }
            }
            else if (f.isNinja) {
                let targetFighter = window.p1;
                if (targetFighter && targetFighter.hp > 0) {
                    let dist = targetFighter.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 15) + 15; let randAction = Math.random();
                        if (randAction < 0.4) { f.state = 'cast'; f.attackTimer = 20; window.playSound(400, 'sine', 0.2, 0.4); window.spawnProjectile(f.x, f.y - 50, f.isFacingRight ? 15 : -15, 0, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); if(Math.random() < 0.5) window.spawnProjectile(f.x, f.y - 60, f.isFacingRight ? 14 : -14, -3, 8, "#9b59b6", Math.floor(15 * f.dmgMod), window.p1); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "🥷", color: "#9b59b6", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 30 }); } 
                        else if (randAction < 0.7) { window.spawnParticles(f.x, f.y, "#2c3e50"); f.x = window.p1.x + (window.p1.isFacingRight ? -80 : 80); f.y = window.p1.y; f.isFacingRight = window.p1.x > f.x; window.spawnParticles(f.x, f.y, "#9b59b6"); f.state = 'spinning_backfist'; f.attackTimer = 15; window.playSound(200, 'square', 0.2, 0.6); if(typeof window.takeDamage === 'function') window.takeDamage(window.p1, Math.floor(20 * f.dmgMod), "#9b59b6", false, false); window.floatingTexts.push({ x: f.x, y: f.y - 80, text: "💨", color: "#8e44ad", alpha: 1, vx: 0, vy: -2, font: "900 40px Arial", life: 30 }); } 
                        else { f.state = 'walk'; f.vx = Math.sign(dist) * f.currentSpeed * 2.5; }
                    }
                }
            }
            else {
                let targetGroup = f.isPlayer ? window.enemies : [window.p1]; let closest = window.getClosestEnemy(f, targetGroup);
                if (closest && closest.hp > 0) {
                    let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist); let reach = 65 * Math.max(f.scale||1, closest.scale||1);
                    if (absDist > reach) { f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk'; if (Math.random() < 0.1 && f.onGround) window.spawnDust(f.x, f.y); } 
                    else {
                        f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                        if (f.aiDelay <= 0) {
                            f.aiDelay = f.isPlayer ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 8) + 8; let usedSkill = false;
                            if (f.skill && typeof f.skill.actionCode3 === 'function' && f.stamina >= 100 && Math.random() < 0.05) { f.stamina -= 100; usedSkill = true; window.triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                            if (!usedSkill) { let rand = Math.random(); if (closest.attackTimer > 0 || closest.state === 'dash') { if (rand < 0.4) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; window.spawnDust(f.x, f.y); } else { if(typeof window.attack === 'function') window.attack(f, targetGroup); } } else { if (rand < 0.9) { if (f.comboTimer > 0 && f.comboStep < 14) { f.comboStep++; } else { f.comboStep = 0; } f.comboTimer = 50; if(typeof window.attack === 'function') window.attack(f, targetGroup); } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } } }
                        }
                    }
                } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
            }
        }

        f.vy += window.GRAVITY; if (f.vy > 0 && f.y + f.vy >= window.GROUND_Y && !f.onGround) { window.spawnDust(f.x, window.GROUND_Y); if (f.vy > 8) window.shakeScreen(5, 3); }
        f.y += f.vy; if (f.y >= window.GROUND_Y) { f.y = window.GROUND_Y; f.vy = 0; f.onGround = true; } else { f.onGround = false; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        let friction = (window.currentWeather === 'rain') ? 0.95 : 0.85;
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; if (f.onGround && window.matchTimer % 4 === 0) window.spawnDust(f.x, window.GROUND_Y); } 
        else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { f.vx *= friction; }
        f.x += f.vx;
    });

    for (let i = 0; i < allFighters.length; i++) { 
        for (let j = i + 1; j < allFighters.length; j++) { 
            let f1 = allFighters[i], f2 = allFighters[j]; if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) continue;
            let overlapX = f2.x - f1.x; let pushDist = 30 * Math.max(f1.scale||1, f2.scale||1); 
            if (Math.abs(overlapX) < pushDist) { let pushForce = (pushDist - Math.abs(overlapX)) / 2; if (overlapX === 0) overlapX = 1; let sign = Math.sign(overlapX); f1.x -= pushForce * sign; f2.x += pushForce * sign; } 
        } 
    }

    allFighters.forEach(f => {
        if (!f || f.hp <= 0) return;
        let wallBound = 35 * (f.scale || 1);
        
        if (f.x < wallBound) { 
            f.x = wallBound; 
            if (f.hitStun > 0 && f.vx < -4 && !f.wallBounced) { 
                f.wallBounced = true; f.vx = 4; f.hitStun = 15; window.shakeScreen(10, 4); 
                window.spawnEnvDamage(wallBound, f.y, 'wall_left', f.scale || 1, false);
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } 
        }
        if (window.canvas && f.x > window.canvas.width - wallBound) { 
            f.x = window.canvas.width - wallBound; 
            if (f.hitStun > 0 && f.vx > 4 && !f.wallBounced) { 
                f.wallBounced = true; f.vx = -4; f.hitStun = 15; window.shakeScreen(10, 4); 
                window.spawnEnvDamage(window.canvas.width - wallBound, f.y, 'wall_right', f.scale || 1, false);
                if(typeof window.takeDamage === 'function') window.takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); 
                window.playSound(100, 'sine', 0.2, 0.3, true); window.spawnDust(f.x, f.y); 
            } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } 
        }
        if (f.hitStun <= 0 || f.onGround) f.wallBounced = false; 

        if (!f.trailArr) f.trailArr = [];
        let isAttacking = f.attackTimer > 0 && ['jab','cross','low_kick','hook','backfist','teep_kick','elbow_strike','high_kick','spinning_heel','shoulder_bash','palm_strike','uppercut','knee_strike','axe_kick','one_inch_punch','dempsey_roll','machine_gun_punches','dragon_uppercut','asura_strike','scratch','breathe_fire', 'taunt_crane', 'taunt_power', 'taunt_dance', 'taunt_point', 'taunt_flex'].includes(f.state);
        if (((f.state === 'dash' || f.state === 'dash_back' || f.isRage) && Math.abs(f.vx) > 1) || (isAttacking && f.attackTimer % 2 === 0)) { f.trailArr.push({x: f.x, y: f.y, state: f.state, isFacingRight: f.isFacingRight, color: f.color, alpha: 0.5, scale: f.scale, isDragon: f.isDragon}); }
        for (let i = f.trailArr.length - 1; i >= 0; i--) { f.trailArr[i].alpha -= 0.05; if (f.trailArr[i].alpha <= 0) f.trailArr.splice(i, 1); }
    });

    for (let i = window.projectiles.length - 1; i >= 0; i--) { 
        let proj = window.projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; 
        if (proj.isMeteor) {
            window.particles.push({ x: proj.x + (Math.random()-0.5)*10, y: proj.y, vx: 0, vy: -2, life: 15, maxLife: 15, color: "#f1c40f", size: Math.random()*4+2 });
            if (proj.y >= window.GROUND_Y) {
                window.shakeScreen(15, 6); window.shockwaves.push({x: proj.x, y: window.GROUND_Y, r: 10, maxR: 150, color: "#e74c3c", alpha: 1, speed: 10}); window.playSound(200, 'sawtooth', 0.5, 0.6, true);
                window.spawnEnvDamage(proj.x, window.GROUND_Y, 'crater', 1.5, true);
                let allActiveFighters = [window.p1].concat(window.enemies);
                allActiveFighters.forEach(fighter => { if (fighter && fighter.hp > 0 && Math.abs(fighter.x - proj.x) < 100 && fighter.y >= window.GROUND_Y - 50) { if(typeof window.takeDamage === 'function') window.takeDamage(fighter, proj.dmg, "#e74c3c", true, false); fighter.vx = Math.sign(fighter.x - proj.x) * 12; fighter.state = 'hurt'; fighter.hitStun = 25; } }); window.projectiles.splice(i, 1);
            }
        } else {
            let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; 
            if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); if(typeof window.takeDamage === 'function') window.takeDamage(proj.target, proj.dmg, proj.color || "#e74c3c", false, false); window.shakeScreen(8, 4); window.projectiles.splice(i, 1); } 
            else if (proj.x < -100 || proj.x > window.canvas.width + 100 || proj.y < -100 || proj.y > window.canvas.height + 100) { window.projectiles.splice(i, 1); } 
        }
    }
    for (let i = window.traps.length - 1; i >= 0; i--) { let t = window.traps[i]; t.life--; if (t.life <= 0) { window.traps.splice(i, 1); continue; } }
    for (let i = window.slashes.length - 1; i >= 0; i--) { window.slashes[i].life--; if (window.slashes[i].life <= 0) window.slashes.splice(i, 1); }
    
    if (window.p1 && window.introTimer === 0) {
        let closest = window.getClosestEnemy(window.p1, window.enemies);
        if (closest && !window.gameOver && window.slowMoTimer <= 0) {
            let midX = (window.p1.x + closest.x) / 2; let midY = (window.p1.y + closest.y) / 2; let maxPanX = window.canvas.width * 0.25; let desiredCamX = (window.canvas.width / 2) - midX; window.targetCamX = Math.max(-maxPanX, Math.min(maxPanX, desiredCamX));
            let jumpFollowY = (window.GROUND_Y - midY) * 0.5; window.targetCamY = Math.max(0, Math.min(100, jumpFollowY)); 
            let distance = Math.abs(window.p1.x - closest.x); let dynamicZoom = 1.25 - (distance / 600) * 0.35; window.targetZoom = Math.max(0.9, Math.min(1.25, dynamicZoom));
            let p1Low = window.p1.hp < window.p1.maxHp * 0.3; let eLow = closest.hp < closest.maxHp * 0.3;
            if (p1Low && eLow) { window.targetTilt = 0.05 * Math.sin(window.matchTimer * 0.06); } else if (p1Low || eLow) { window.targetTilt = 0.025 * Math.sin(window.matchTimer * 0.04); } else { window.targetTilt = 0; }
        } else if (window.slowMoTimer > 0) {
            let focusX = window.canvas.width / 2; let focusY = window.GROUND_Y; if (window.p1 && window.p1.hp > 0) { focusX = window.p1.x; focusY = window.p1.y; } else { let aliveEnemy = window.enemies.find(e => e.hp > 0); if (aliveEnemy) { focusX = aliveEnemy.x; focusY = aliveEnemy.y; } }
            window.targetCamX = (window.canvas.width / 2) - focusX; window.targetCamY = Math.max(0, (window.GROUND_Y - focusY) * 0.5); window.targetZoom = 1.35; window.targetTilt = 0.025 * Math.sin(window.slowMoTimer * 0.1);
        } else { window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0; }
    } else { window.targetCamX = 0; window.targetCamY = 0; window.targetZoom = 1; window.targetTilt = 0; }

    window.camX += (window.targetCamX - window.camX) * 0.08; window.camY += (window.targetCamY - window.camY) * 0.08; window.currentZoom += (window.targetZoom - window.currentZoom) * 0.08; window.cameraTilt += (window.targetTilt - window.cameraTilt) * 0.08;
    for (let i = window.floatingTexts.length - 1; i >= 0; i--) { let t = window.floatingTexts[i]; if (t.life !== undefined) { t.vy += window.GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) window.floatingTexts.splice(i, 1); }
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); try { if(typeof window.update === 'function') window.update(); } catch(e) { } try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } } 
}
