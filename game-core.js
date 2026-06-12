// Đổi hết thành VAR để nối kết tự động với game-auth.js
var canvas = document.getElementById("battleCanvas");
var ctx = canvas ? canvas.getContext("2d") : null;
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
                                    p.vx =
