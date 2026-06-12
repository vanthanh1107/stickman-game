// Đổi các dòng let này thành var
var canvas = document.getElementById("battleCanvas");
var ctx = canvas.getContext("2d");
var audioCtx = null, floatingTexts = [], particles = [], projectiles = [], traps = [];
var p1, p2, gameOver, isLoopRunning = false;
var shakeTime = 0, shakeMag = 0, hitStopFrames = 0;
var matchResolved = false;

const GROUND_Y = 320; 
const GRAVITY = 0.8;

function renderCharacterGrid() {
    const carousel = document.getElementById("character-carousel"); carousel.innerHTML = ""; 
    let firstCardId = null;
    for (let id in classStats) {
        let item = classStats[id]; let card = document.createElement("div"); card.className = "char-card";
        let avatarSrc = item.avatarUrl || classImages[id] || `https://api.dicebear.com/7.x/adventurer/png?seed=${id}&backgroundColor=ffdfbf`;
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => {
            selectedRedClass = id;
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            document.getElementById("desc-red").innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>⚡ Tốc độ: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Sát thương: <strong>x${item.dmgMod}</strong></span>`;
            currentPlayer.classId = id; 
        };
        carousel.appendChild(card);
        if (currentPlayer.classId && id === currentPlayer.classId) { card.click(); firstCardId = id; }
        if(!firstCardId) { firstCardId = id; }
    }
    if(!selectedRedClass && firstCardId) {
        let firstCard = carousel.querySelector(`.char-card`);
        if(firstCard) firstCard.click();
    }
}

function startGame() {
    if(!selectedRedClass) return alert("Vui lòng chọn võ sĩ!");
    document.getElementById("selection-screen").style.display = "none"; document.getElementById("game-screen").style.display = "block";
    matchStart(); 
    if (!isLoopRunning) { isLoopRunning = true; requestAnimationFrame(gameLoop); }
}

function backToMenu() {
    document.getElementById("game-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block";
    gameOver = true; updatePlayerUI();
}

function matchStart() {
    let allKeys = Object.keys(classStats); 
    if(allKeys.length === 0) return alert("Dữ liệu Võ Sĩ bị lỗi!");

    if (!selectedRedClass || !classStats[selectedRedClass]) { selectedRedClass = allKeys[0]; }

    let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)];
    let s1 = classStats[selectedRedClass]; 
    let s2 = classStats[blueClass];

    document.getElementById("name-display-red").innerText = `${currentPlayer.name} (${s1.className})`;
    document.getElementById("name-display-blue").innerText = `Máy (${s2.className})`;
    
    p1 = { isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, speed: s1.speed, color: "#ff4757", hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, drawMethod: s1.drawMethod, skill: s1.skill, regen: s1.regen, shield: 0, buffs: [], iFrames: 0, aiDelay: 0 };
    p2 = { isPlayer: false, x: 500, y: GROUND_Y, vx: 0, vy: 0, speed: s2.speed, color: "#1e90ff", hp: s2.hp, maxHp: s2.hp, dmgMod: s2.dmgMod, onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, drawMethod: s2.drawMethod, skill: s2.skill, regen: s2.regen, shield: 0, buffs: [], iFrames: 0, aiDelay: 0 };

    floatingTexts = []; particles = []; projectiles = []; traps = []; shakeTime = 0; hitStopFrames = 0; 
    
    gameOver = false;
    matchResolved = false; 
    
    document.getElementById("hp-red").style.width = "100%"; 
    document.getElementById("hp-blue").style.width = "100%";
}

function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function playSound(freq, type, duration, vol) { if (!audioCtx) return; let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); gain.gain.setValueAtTime(vol, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); osc.start(); osc.stop(audioCtx.currentTime + duration); }

function shakeScreen(frames, magnitude) { shakeTime = frames; shakeMag = magnitude; }
function spawnTrap(x, y, radius, color, damage, lifeFrames, owner) { traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
function spawnProjectile(x, y, vx, vy, radius, color, dmg, target, customOnHit) { projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }

function spawnParticles(x, y, color) {
    for(let i=0; i<12; i++) {
        let angle = Math.random() * Math.PI * 2; let speed = Math.random() * 6 + 2;
        particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 15, maxLife: 15, color: color, size: Math.random() * 4 + 2 });
    }
}

function takeDamage(target, amount, text, color) {
    if (target.iFrames > 0) {
        floatingTexts.push({ x: target.x, y: target.y - 80, text: "MISS", color: "#bdc3c7", alpha: 1, yVel: -0.5 });
        return;
    }
    if (target.shield > 0) {
        target.shield--; floatingTexts.push({ x: target.x, y: target.y - 80, text: `🛡️ ĐỠ! (${target.shield})`, color: "#3498db", alpha: 1, yVel: -0.5 });
        spawnParticles(target.x, target.y, "#3498db"); return;
    }
    target.hp -= amount; if(target.hp < 0) target.hp = 0;
    
    let comboTexts = ["BAM!", "POW!", "SMASH!"];
    let hitWord = (amount > 15) ? comboTexts[Math.floor(Math.random()*comboTexts.length)] : `-${Math.round(amount)}`;
    floatingTexts.push({ x: target.x + (Math.random()*20-10), y: target.y - 60 - Math.random()*20, text: hitWord, color: color, alpha: 1, yVel: -1 });
    
    spawnParticles(target.x, target.y, color); 
    updateHPUIs();
}

function attack(attacker, defender, type) {
    if (attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.state === 'dash_back') return; 
    
    attacker.state = type; 
    attacker.attackTimer = (type === 'punch') ? 12 : 20; 
    playSound(type === 'punch' ? 400 : 250, 'square', 0.1, 0.1);

    let attackRange = (type === 'punch') ? 70 : 90; 
    let dist = defender.x - attacker.x;
    
    let isHit = false;
    if (attacker.isFacingRight && dist > 0 && dist <= attackRange) isHit = true;
    if (!attacker.isFacingRight && dist < 0 && dist >= -attackRange) isHit = true;
    
    if (Math.abs(attacker.y - defender.y) > 60) isHit = false;

    if (isHit) {
        setTimeout(() => {
            if (gameOver || attacker.hitStun > 0) return; 
            let dmg = (type === 'punch') ? (6 * (attacker.currentDmgMod || 1)) : (10 * (attacker.currentDmgMod || 1));
            dmg = Math.floor(dmg + Math.random() * 3); 

            if (defender.state === 'block') {
                dmg = Math.floor(dmg * 0.2); 
                playSound(500, 'triangle', 0.1, 0.1);
                defender.vx = attacker.isFacingRight ? 5 : -5; 
            } else if (defender.state === 'dash_back' && defender.iFrames > 0) {
                floatingTexts.push({ x: defender.x, y: defender.y - 80, text: "NÉ TRƯỢT!", color: "#bdc3c7", alpha: 1, yVel: -0.5 });
            } else {
                playSound(150, 'sawtooth', 0.1, 0.2);
                shakeScreen(4, (type==='kick')? 5:2);
                takeDamage(defender, dmg, `-${dmg}`, "#fff");
                defender.hitStun = 8; 
                defender.state = 'hurt';
                defender.vx = attacker.isFacingRight ? 12 : -12; 
            }
        }, (type === 'punch') ? 50 : 80); 
    }
}

function checkGameOver() {
    if (matchResolved) return; 
    
    if (p1.hp <= 0 || p2.hp <= 0) {
        matchResolved = true; 
        gameOver = true; 
        
        if (p1.hp > 0) {
            currentPlayer.xp = parseInt(currentPlayer.xp || 0) + 50; 
            currentPlayer.level = parseInt(currentPlayer.level || 1);
            
            let xpNeeded = currentPlayer.level * 100;
            let isLevelUp = false;
            
            while (currentPlayer.xp >= xpNeeded) {
                currentPlayer.xp -= xpNeeded;
                currentPlayer.level += 1;
                xpNeeded = currentPlayer.level * 100;
                isLevelUp = true;
            }
            
            savePlayerData(); 
            updatePlayerUI(); 
            
            if (isLevelUp) {
                setTimeout(() => { alert(`🎉 CHÚC MỪNG! Bạn thăng hạng lên LEVEL ${currentPlayer.level}!`); }, 200);
            }
        } else {
            setTimeout(() => { alert(`💀 BẠN ĐÃ BỊ HẠ GỤC! Hãy cố gắng phục thù nhé!`); }, 200);
        }
    }
}

function updateHPUIs() {
    if (!p1 || !p2) return;
    document.getElementById("hp-red").style.width = (p1.hp / p1.maxHp * 100) + "%"; 
    document.getElementById("hp-blue").style.width = (p2.hp / p2.maxHp * 100) + "%";
    document.getElementById("stamina-red").style.width = p1.stamina + "%"; 
    document.getElementById("stamina-blue").style.width = p2.stamina + "%";
    checkGameOver(); 
}

function update() {
    if (gameOver || !p1 || !p2) return;
    if (shakeTime > 0) shakeTime--;
    
    if (hitStopFrames > 0) { hitStopFrames--; return; }

    [p1, p2].forEach(p => {
        let enemy = (p === p1) ? p2 : p1;

        if (p.attackTimer > 0) p.attackTimer--;
        if (p.hitStun > 0) p.hitStun--;
        if (p.iFrames > 0) p.iFrames--;
        if (p.comboTimer > 0) p.comboTimer--;
        if (p.dashTimer > 0) p.dashTimer--; 
        if (p.aiDelay > 0) p.aiDelay--; 

        p.currentDmgMod = p.dmgMod || 1;
        p.currentSpeed = p.speed || 3;
        p.currentRegen = p.regen || 0.3;
        
        for (let i = p.buffs.length - 1; i >= 0; i--) {
            let b = p.buffs[i]; b.life--;
            if (b.life <= 0) { p.buffs.splice(i, 1); continue; }
            if (b.stat === 'dmg') p.currentDmgMod += b.value;
            if (b.stat === 'speed') p.currentSpeed += b.value;
            if (b.stat === 'regen') p.currentRegen += b.value;
            if (b.life % 15 === 0) particles.push({ x: p.x + (Math.random()*20-10), y: p.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 });
        }

        p.vy += GRAVITY; p.y += p.vy;
        if (p.y >= GROUND_Y) { p.y = GROUND_Y; p.vy = 0; p.onGround = true; }
        
        if(isNaN(p.x)) p.x = 100;
        if(isNaN(p.vx)) p.vx = 0;
        
        if (p.dashTimer > 0) {
            p.vx = p.dashDir * p.currentSpeed * 2.5; 
        } else {
            if (p.state !== 'walk' && p.state !== 'dash_back' && p.onGround) p.vx *= 0.85; 
        }

        p.x += p.vx;
        
        let overlapX = p2.x - p1.x;
        if (Math.abs(overlapX) < 40) { 
            let pushForce = (40 - Math.abs(overlapX)) / 2;
            if (overlapX === 0) overlapX = 1; 
            let sign = Math.sign(overlapX);
            p1.x -= pushForce * sign;
            p2.x += pushForce * sign;
        }

        if (p.x < 30) { p.x = 30; p.vx = 0; }
        if (p.x > canvas.width - 30) { p.x = canvas.width - 30; p.vx = 0; }

        if (p.attackTimer === 0 && p.hitStun === 0 && p.onGround && p.dashTimer <= 0) p.state = 'idle';
        p.stamina = Math.min(100, p.stamina + p.currentRegen);

        if (p === p1) {
            let b1 = document.getElementById("btn-s1"), b2 = document.getElementById("btn-s2"), b3 = document.getElementById("btn-s3");
            if (b1 && b2 && b3) {
                b1.className = (p.stamina >= 25) ? "skill-btn s1-ready" : "skill-btn";
                b2.className = (p.stamina >= 50) ? "skill-btn s2-ready" : "skill-btn";
                b3.className = (p.stamina >= 100) ? "skill-btn s3-ready" : "skill-btn";
            }
        }

        let gameContext = { 
            floatingTexts: floatingTexts, projectiles: projectiles, traps: traps, 
            spawnTrap: spawnTrap, spawnParticles: spawnParticles, spawnProjectile: spawnProjectile,
            playSound: playSound, shakeScreen: shakeScreen, takeDamage: takeDamage, updateHPUIs: updateHPUIs,
            dash: (fighter, forceX, forceY) => { fighter.vx = forceX; if(forceY) fighter.vy = forceY; fighter.state = 'dash'; fighter.attackTimer = 15; fighter.iFrames = 10; spawnParticles(fighter.x, fighter.y, "#bdc3c7"); },
            teleport: (fighter, destX, destY) => { spawnParticles(fighter.x, fighter.y, "#8e44ad"); fighter.x = destX; if(destY) fighter.y = destY; fighter.state = 'cast'; fighter.attackTimer = 10; spawnParticles(fighter.x, fighter.y, "#8e44ad"); },
            addBuff: (fighter, stat, value, frames) => { fighter.buffs.push({stat: stat, value: value, life: frames, maxLife: frames}); },
            setInvulnerable: (fighter, frames) => { fighter.iFrames = frames; }
        };

        if (p.attackTimer === 0 && p.hitStun === 0 && p.dashTimer <= 0) {
            let dist = enemy.x - p.x;
            p.isFacingRight = dist > 0;
            let absDist = Math.abs(dist);
            
            let usedSkill = false;
            if (p.skill) {
                if (p.stamina >= 100 && p.skill.actionCode3) { p.stamina -= 100; try { p.skill.actionCode3(p, enemy, gameContext); usedSkill = true; if(p.state==='idle') { p.state = 'cast'; p.attackTimer = 15; } } catch (e) {} }
                else if (p.stamina >= 50 && p.skill.actionCode2 && Math.random() < 0.05) { p.stamina -= 50; try { p.skill.actionCode2(p, enemy, gameContext); usedSkill = true; if(p.state==='idle') { p.state = 'kick'; p.attackTimer = 20; } } catch (e) {} }
                else if (p.stamina >= 25 && p.skill.actionCode1 && Math.random() < 0.03) { p.stamina -= 25; try { p.skill.actionCode1(p, enemy, gameContext); usedSkill = true; if(p.state==='idle') { p.state = 'punch'; p.attackTimer = 12; } } catch (e) {} }
            }

            if (!usedSkill) {
                if (absDist > 60) { 
                    p.vx = Math.sign(dist) * p.currentSpeed;
                    p.state = 'walk';
                } else { 
                    let rand = Math.random();
                    
                    if (enemy.attackTimer > 0 || enemy.state === 'dash') {
                        if (rand < 0.6) {
                            p.dashTimer = 12; 
                            p.dashDir = -Math.sign(dist); 
                            p.state = 'dash_back';
                            p.iFrames = 12; 
                            p.attackTimer = 12;
                            for(let i=0; i<4; i++) {
                                particles.push({ x: p.x, y: GROUND_Y, vx: Math.sign(dist)*(Math.random()*2+1), vy: -Math.random()*2, life: 10, maxLife: 10, color: "rgba(255,255,255,0.3)", size: Math.random()*2+2 });
                            }
                        } else if (rand < 0.9) { 
                            p.state = 'block'; 
                            p.attackTimer = 15;
                        } else {
                            attack(p, enemy, 'punch');
                            p.vx = Math.sign(dist) * 2; 
                        }
                    } else {
                        const COMBO_WINDOW = 35; 
                        let decidedToAttack = (rand < 0.85);

                        if (decidedToAttack) {
                            if (p.comboTimer > 0 && p.comboStep < 2) {
                                p.comboStep++; 
                                if (p.comboStep === 1) { 
                                    attack(p, enemy, 'punch');
                                    p.vx = Math.sign(dist) * 4; 
                                } else if (p.comboStep === 2) { 
                                    attack(p, enemy, 'kick');
                                    p.vx = Math.sign(dist) * 6; 
                                }
                            } else {
                                p.comboStep = 0;
                                attack(p, enemy, 'punch');
                                p.vx = Math.sign(dist) * 2; 
                            }
                            p.comboTimer = COMBO_WINDOW;
                        } else {
                            if (Math.random() < 0.6) {
                                p.state = 'block'; 
                                p.attackTimer = 10;
                            } else {
                                p.vx = -Math.sign(dist) * p.currentSpeed * 1.5; 
                            }
                        }
                    }
                }
            }
        }
    });

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let proj = projectiles[i]; proj.x += proj.vx; proj.y += proj.vy;
        let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; 
        if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) {
            if(proj.onHit) proj.onHit(); 
            takeDamage(proj.target, proj.dmg, `🎇 -${proj.dmg}`, "#9b59b6");
            shakeScreen(8, 4); projectiles.splice(i, 1);
        } else if (proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) { projectiles.splice(i, 1); }
    }

    for (let i = traps.length - 1; i >= 0; i--) {
        let t = traps[i]; t.life--;
        if (t.life <= 0) { traps.splice(i, 1); continue; }
        let enemy = (t.owner === p1) ? p2 : p1;
        let dx = enemy.x - t.x; let dy = enemy.y - t.y;
        if (Math.sqrt(dx*dx + dy*dy) < 20 + t.radius && t.life % 30 === 0) { takeDamage(enemy, t.damage, `🤢 -${t.damage}`, t.color); }
    }

    for (let i = particles.length - 1; i >= 0; i--) { let pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) particles.splice(i, 1); }
    for (let i = floatingTexts.length - 1; i >= 0; i--) { let t = floatingTexts[i]; t.y += t.yVel; t.alpha -= 0.03; if (t.alpha <= 0) floatingTexts.splice(i, 1); }
}

function drawStickman(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return;
    ctx.save();
    ctx.translate(p.x, p.y); 
    if (!p.isFacingRight) ctx.scale(-1, 1);

    ctx.strokeStyle = "#fff"; 
    ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; 
    ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : p.color; 
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (isTrail) {
        ctx.globalAlpha = 0.3; 
        ctx.shadowBlur = 0;
    }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    let maxT = (p.state === 'punch') ? 15 : 20;
    
    let pext = 0; 
    if (p.state === 'punch' && p.comboStep === 1) pext = 10;
    
    let progress = (p.attackTimer > 0) ? 1 - (p.attackTimer / maxT) : 0;
    let ext = Math.sin(progress * Math.PI); 

    if (p.drawMethod) {
        try {
            p.drawMethod(ctx, p, bounce, ext, pext, isTrail);
            ctx.restore();
            return; 
        } catch (e) {
            console.error("Lỗi thực thi mã drawCode từ Cloud Sheet:", e);
        }
    }

    let head = {x: 0, y: -60 + bounce}; 
    let neck = {x: 0, y: -45 + bounce}; 
    let pelvis = {x: 0, y: -20 + bounce};
    
    let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce};
    let footR = {x: 15, y: 0};  let kneeR = {x: 10, y: -10 + bounce};
    
    let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; 
    let handR = {x: 15, y: -40 + bounce};  let elbowR = {x: 5, y: -30 + bounce};  

    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') {
        footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25};
        footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30};
        handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35};
        handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40};
        head.y -= 5;
    }

    if (p.state === 'hurt') {
        head.x = -20; neck.x = -15; pelvis.x = -5;
        handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40};
        footL.x = -15; footR.x = 25;
    } 
    else if (p.state === 'block') {
        handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce};
        handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce};
    } 
    else if (p.state === 'punch') {
        head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext;
        handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; 
        handL = {x: -10, y: -40 + bounce}; 
    } 
    else if (p.state === 'kick') {
        head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext;
        footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; 
        footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; 
        handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; 
    }
    else if (p.state === 'dash') {
        head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20;
        handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25};
        footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10};
    }
    else if (p.state === 'dash_back') { 
        head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20;
        handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35};
        footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; 
    }
    else if (p.state === 'cast') {
        head.x = 0; head.y = -65 + bounce;
        handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45};
        footL.x = -25; footR.x = 25; 
    }

    const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };

    ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
    drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
    drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 

    ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

    ctx.shadowBlur = 0; 
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); 
    ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    
    if (p.state === 'kick') {
        ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill();
    }

    if (!isTrail && p.shield > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); 
        ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); 
    }

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.save();
    if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag); 

    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2;
    for(let i = 0; i < canvas.width; i+=50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, GROUND_Y); ctx.stroke(); }
    for(let i = 0; i < GROUND_Y; i+=50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    ctx.strokeStyle = "#57606f"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(canvas.width, GROUND_Y); ctx.stroke();

    traps.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); ctx.fillStyle = t.color; ctx.globalAlpha = (t.life / t.maxLife) * 0.5; ctx.fill(); ctx.globalAlpha = 1.0; });
    projectiles.forEach(proj => { ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); ctx.fillStyle = proj.color; ctx.fill(); ctx.shadowBlur = 10; ctx.shadowColor = proj.color; ctx.shadowBlur = 0;});

    if (p1 && p2) {
        [p1, p2].forEach(p => {
            if ((p.state === 'dash' || p.state === 'dash_back') && Math.abs(p.vx) > 3) {
                let trail1 = Object.assign({}, p); trail1.x -= p.vx * 1.2; drawStickman(ctx, trail1, true);
                let trail2 = Object.assign({}, p); trail2.x -= p.vx * 2.2; drawStickman(ctx, trail2, true);
            }
        });

        if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; } 
        if (p1.attackTimer > 0 || p1.state === 'cast') { drawStickman(ctx, p2); drawStickman(ctx, p1); } 
        else { drawStickman(ctx, p1); drawStickman(ctx, p2); }
        ctx.shadowBlur = 0;
    }

    particles.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); }); ctx.globalAlpha = 1.0;
    
    ctx.textAlign = "center"; ctx.font = "900 22px Arial";
    floatingTexts.forEach(t => { 
        ctx.fillStyle = t.color; 
        ctx.shadowBlur = 5; ctx.shadowColor = t.color; 
        ctx.fillText(t.text, t.x, t.y); 
        ctx.shadowBlur = 0;
    });
    ctx.restore(); 

    if (gameOver && p1 && p2) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 35px Arial"; ctx.fillStyle = p1.hp > 0 ? "#2ed573" : "#ff4757"; ctx.textAlign = "center";
        ctx.fillText(p1.hp > 0 ? "K.O! BẠN ĐÃ CHIẾN THẮNG 🏆" : "K.O! NGƯỜI QUE ĐÃ BỊ HẠ 💥", canvas.width / 2, canvas.height / 2);
    }
}

let lastFrameTime = 0;
const FRAME_MIN_TIME = 1000 / 60; // 60 FPS Limit

function gameLoop(timestamp) { 
    if (!isLoopRunning) return;
    requestAnimationFrame(gameLoop); 
    
    if (!timestamp) timestamp = 0;
    let deltaTime = timestamp - lastFrameTime;
    
    if (deltaTime >= FRAME_MIN_TIME) {
        lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME);
        try { update(); } catch(e) { console.error("Lỗi update:", e); }
        try { draw(); } catch(e) { console.error("Lỗi draw:", e); }
    }
}
