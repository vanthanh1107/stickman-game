var canvas = document.getElementById("battleCanvas"); 
var ctx = canvas ? canvas.getContext("2d") : null;
var audioCtx = null;
var isMuted = false; 

var floatingTexts = [];
var particles = [];
var projectiles = [];
var traps = [];
var slashes = [];
var shockwaves = [];
var impactSparks = [];

var p1, gameOver, isLoopRunning = false;
var enemies = []; 
var totalEnemyMaxHp = 0; 
window.rewardMultiplier = 1; 

var shakeTime = 0, shakeMag = 0;
var matchResolved = false;
var camX = 0; 
var screenFlash = 0; 
var cinematicTimer = 0; 
var cinematicCaster = null; 
var cinematicCallback = null; 
var slowMoTimer = 0;
var introTimer = 0; 
var uiShakeP1 = 0, uiShakeP2 = 0;

var currentWeather = 'none';
var weatherParticles = [];

var GROUND_Y = 320; 
var GRAVITY = 0.8;

function triggerVibration(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); isMuted = !isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = isMuted ? "🔇" : "🔊"; if (!isMuted && audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); } }

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); 
    if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    if (!window.classStats || Object.keys(window.classStats).length === 0) return;

    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        let avatarSrc = item.avatarUrl || `https://api.dicebear.com/7.x/adventurer/png?seed=${id}&backgroundColor=ffdfbf`; 
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}"></div><div class="char-name">${item.className}</div>`;
        
        card.onclick = () => { 
            selectedRedClass = id; document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ <strong>${item.hp}</strong></span><span>💨 <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ <strong>x${item.dmgMod}</strong></span>`; 
            currentPlayer.classId = id; 
        };
        carousel.appendChild(card); if (currentPlayer.classId && id === currentPlayer.classId) { card.click(); firstCardId = id; } if(!firstCardId) { firstCardId = id; }
    }
    if(!selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

window.startGame = function() { 
    if(!selectedRedClass) return; 
    document.getElementById("selection-screen").style.display = "none"; document.getElementById("game-screen").style.display = "block"; 
    matchStart(); if (!isLoopRunning) { isLoopRunning = true; requestAnimationFrame(gameLoop); } 
}

window.backToMenu = function() { 
    document.getElementById("game-screen").style.display = "none"; document.getElementById("selection-screen").style.display = "block"; 
    gameOver = true; updatePlayerUI(); 
}

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

function matchStart() {
    let allKeys = Object.keys(window.classStats); if(allKeys.length === 0) return; 
    if (!selectedRedClass || !window.classStats[selectedRedClass]) { selectedRedClass = allKeys[0]; }
    
    let s1 = window.classStats[selectedRedClass];
    document.getElementById("name-display-red").innerText = `👤`; 
    
    let enemyCountEl = document.getElementById("enemy-count-select");
    let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1;
    let isBossMode = (selectedMode === 99);
    
    window.rewardMultiplier = isBossMode ? 15 : selectedMode;
    let actualEnemiesCount = isBossMode ? 1 : selectedMode;
    
    let btnExit = document.querySelector(".control-btns .game-btn");
    if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }
    
    let finalHp = s1.hp + (currentPlayer.bonusHp || 0);
    let finalDmg = s1.dmgMod * (1 + (currentPlayer.bonusDmg || 0)/100);
    let finalSpd = s1.speed * (1 + (currentPlayer.bonusSpeed || 0)/100);

    p1 = { 
        id: "player", classId: selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, 
        speed: finalSpd, color: "#ff4757", hp: finalHp, maxHp: finalHp, dmgMod: finalDmg, scale: 1,
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
        stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: s1.drawMethod, skill: s1.skill, regen: s1.regen, shield: 0, 
        buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, 
        shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false, 
        taunt: ["🔥", "💢", "💪", "👊"][Math.floor(Math.random()*4)]
    };

    enemies = []; totalEnemyMaxHp = 0;
    for(let i = 0; i < actualEnemiesCount; i++) {
        let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
        let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; 
        if(isBossMode) hpMultiplier = 10.0;
        let eHp = Math.floor(s2.hp * hpMultiplier); 
        totalEnemyMaxHp += eHp;

        enemies.push({ 
            id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: GROUND_Y, vx: 0, vy: 0, 
            speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), 
            color: isBossMode ? "#e74c3c" : "#1e90ff", 
            hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), scale: isBossMode ? 2.2 : 1,
            onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, 
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s2.drawMethod, skill: s2.skill, regen: s2.regen, shield: 0, 
            buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
            critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, 
            shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false,
            taunt: isBossMode ? "👹" : ["🤖", "🔪", "🎯", "🩸"][Math.floor(Math.random()*4)]
        });
    }
    
    document.getElementById("name-display-blue").innerText = isBossMode ? `👹` : ((actualEnemiesCount > 1) ? `🤖 x${enemies.length}` : `🤖`);

    floatingTexts = []; particles = []; projectiles = []; traps = []; slashes = []; shockwaves = []; impactSparks = [];
    shakeTime = 0; cinematicTimer = 0; cinematicCaster = null; cinematicCallback = null; 
    camX = 0; screenFlash = 0; slowMoTimer = 0; uiShakeP1 = 0; uiShakeP2 = 0;
    matchResolved = false; gameOver = false; introTimer = 160;
    
    let weatherTypes = ['rain', 'snow', 'none', 'none']; currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    weatherParticles = [];
    for(let i=0; i<100; i++) { weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: (currentWeather === 'rain') ? 15 + Math.random() * 10 : 2 + Math.random() * 3 }); }
    
    document.getElementById("hp-red").style.width = "100%"; document.getElementById("hp-red-trail").style.width = "100%"; 
    document.getElementById("hp-blue").style.width = "100%"; document.getElementById("hp-blue-trail").style.width = "100%";
    document.getElementById("stun-red").style.width = "100%"; document.getElementById("stun-blue").style.width = "100%";
}

function spawnParticles(x, y, color, isCrit = false) {
    let count = isCrit ? 30 : 15;
    for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 5 + 2 }); }
}
function spawnDust(x, y) { for(let i=0; i<8; i++) { particles.push({ x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*3, vy: -Math.random()*3, life: 15, maxLife: 15, color: "rgba(200, 200, 200, 0.5)", size: Math.random() * 8 + 4 }); } }

// HỆ THỐNG TRỪ MÁU TỨC THÌ (INSTANT HIT) ĐỂ CHỐNG LỖI
function takeDamage(target, amount, color, isCrit = false, isWallBounce = false) {
    if(!target || target.hp <= 0) return;
    if (target.iFrames > 0 && !isWallBounce) return;
    if (target.shield > 0 && !isWallBounce) { target.shield--; spawnParticles(target.x, target.y, "#3498db"); return; }
    
    let actualDmg = amount;
    if (target.hp - amount <= 0 && !matchResolved) { 
        actualDmg = target.hp; let aliveEnemies = enemies.filter(e => e.hp > 0).length;
        if (target.isPlayer || aliveEnemies <= 1) { slowMoTimer = 120; screenFlash = 0.8; playSound(150, 'square', 1.0, 0.5); }
    }
    target.hp -= actualDmg; if(target.hp < 0) target.hp = 0;
    
    let hitWord = `-${Math.round(actualDmg)}`;
    if (isCrit && !isWallBounce) { hitWord += " 💥"; screenFlash = 0.5; shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 120, color: "#f1c40f", alpha: 1, speed: 8}); triggerVibration([40, 30, 40]); } 
    if (isWallBounce) { hitWord += " 🧱"; screenFlash = 0.2; shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); triggerVibration(60); } 
    
    if (actualDmg > 0 || isCrit || isWallBounce) {
        let dynamicSize = Math.min(45, 18 + actualDmg * 0.4); 
        let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`;
        let rndX = (Math.random() - 0.5) * 40; let rndY = -Math.random() * 30 - 50 * (target.scale||1);
        floatingTexts.push({ x: target.x + rndX, y: target.y + rndY, text: hitWord, color: isCrit ? "#f1c40f" : color, alpha: 1, vx: (Math.random() - 0.5) * 4, vy: isCrit ? -5 : -3, font: fontStyle });
        impactSparks.push({ x: target.x, y: target.y - 30, life: 10, maxLife: 10, angle: Math.random() * Math.PI, color: isCrit ? "#fff" : "#ff9f43", scale: isCrit ? 2 : 1 });
        if (target.isPlayer) uiShakeP1 = 15; else uiShakeP2 = 15;
    }
    spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); updateHPUIs();
}

function attack(attacker, potentialTargets, type) {
    if (!attacker || attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
    if (!Array.isArray(potentialTargets)) potentialTargets = [potentialTargets];

    attacker.state = type; attacker.attackTimer = (type === 'punch') ? 15 : 20; playSound(type === 'punch' ? 400 : 250, 'square', 0.1, 0.1);
    let attackRange = ((type === 'punch') ? 70 : 90) * (attacker.scale || 1); let hitTargets = [];
    
    potentialTargets.forEach(defender => {
        if (!defender || defender.hp <= 0) return;
        let dist = defender.x - attacker.x; let isHit = false;
        let hitBoxAllowance = 30 * (defender.scale || 1);

        if (attacker.isFacingRight && dist > -hitBoxAllowance && dist <= attackRange + hitBoxAllowance) isHit = true;
        if (!attacker.isFacingRight && dist < hitBoxAllowance && dist >= -attackRange - hitBoxAllowance) isHit = true;
        if (Math.abs(attacker.y - defender.y) > 60 * Math.max(attacker.scale, defender.scale)) isHit = false; 
        if(isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        let isCrit = Math.random() < attacker.critChance;
        let spawnSlash = (x, y, isRight, color, isCrit, scale) => { slashes.push({ x: x, y: y, isRight: isRight, life: 10, maxLife: 10, color: isCrit ? "#fff" : color, scale: (isCrit ? 1.8 : 1) * scale }); };
        spawnSlash(hitTargets[0].x + (attacker.isFacingRight ? -20 : 20), hitTargets[0].y - 30, attacker.isFacingRight, attacker.color, isCrit, attacker.scale || 1);
        
        hitTargets.forEach(defender => {
            // SÁT THƯƠNG ĐƯỢC ÁP DỤNG NGAY LẬP TỨC ĐỂ TRÁNH LỖI GHOST OBJECT
            let dmg = (type === 'punch') ? (6 * (attacker.currentDmgMod || 1)) : (10 * (attacker.currentDmgMod || 1));
            let comboBonus = 1 + (attacker.comboHits * 0.05); dmg = dmg * comboBonus;
            if (defender.state === 'stunned') dmg *= 1.5; if (isCrit) dmg *= attacker.critMult; dmg = Math.floor(dmg + Math.random() * 3); 

            if (defender.state === 'dash_back' && defender.iFrames > 0) return; // Né thành công
            if (defender.state === 'block') { dmg = Math.floor(dmg * 0.2); playSound(500, 'triangle', 0.1, 0.1); defender.vx = attacker.isFacingRight ? 5 : -5; } 
            
            takeDamage(defender, dmg, "#fff", isCrit);
            defender.hitStun = 12; defender.state = 'hurt';
            if (type === 'kick' || isCrit) { defender.vx = attacker.isFacingRight ? 35 : -35; spawnDust(defender.x, defender.y); } else { defender.vx = attacker.isFacingRight ? 12 : -12; }
            
            if (defender.state !== 'stunned' && defender.shieldBreak > 0) {
                defender.shieldBreak -= isCrit ? 35 : 15;
                if (defender.shieldBreak <= 0) {
                    defender.shieldBreak = 0; defender.stunTimer = 90; defender.state = 'stunned'; defender.vx = 0;
                    takeDamage(defender, 0, "#00d2d3"); shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 100, color: "#00d2d3", alpha: 1, speed: 8});
                }
            }
            defender.comboHits = 0; 
        });
        attacker.comboHits++; attacker.comboTimeout = 120; 
    } else { attacker.comboHits = 0; }
}

function triggerCinematic(caster, callback) { cinematicTimer = 50; cinematicCaster = caster; cinematicCallback = callback; playSound(600, 'sawtooth', 0.8, 0.3); }

window.playerUseSkill = function(skillType) {
    if (gameOver || !p1 || p1.attackTimer > 0 || p1.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || p1.stunTimer > 0 || introTimer > 0) return;
    let closestEnemy = getClosestEnemy(p1, enemies); if(!closestEnemy) return;

    let gameContext = { 
        floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, 
        dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, 
        teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, 
        addBuff: (f, stat, val, fr) => { f.buffs.push({stat: stat, value: val, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } 
    };

    if (skillType === 1 && p1.stamina >= 25 && p1.skill.actionCode1) { p1.stamina -= 25; p1.skill.actionCode1(p1, closestEnemy, gameContext); p1.state = 'punch'; p1.attackTimer = 15; }
    if (skillType === 2 && p1.stamina >= 50 && p1.skill.actionCode2) { p1.stamina -= 50; p1.skill.actionCode2(p1, closestEnemy, gameContext); p1.state = 'kick'; p1.attackTimer = 20; }
    if (skillType === 3 && p1.stamina >= 100 && p1.skill.actionCode3) { p1.stamina -= 100; triggerCinematic(p1, () => { p1.superArmor = 25; p1.skill.actionCode3(p1, closestEnemy, gameContext); p1.state = 'cast'; p1.attackTimer = 25; }); }
}

window.playerDodge = function(fighter = p1) {
    if (gameOver || !fighter || fighter.attackTimer > 0 || fighter.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || fighter.stunTimer > 0 || introTimer > 0) return;
    if (fighter.stamina >= 15) { fighter.stamina -= 15; fighter.state = 'dash_back'; fighter.iFrames = 20; fighter.attackTimer = 15; playSound(300, 'sine', 0.1, 0.1); spawnDust(fighter.x, fighter.y); fighter.x += fighter.isFacingRight ? -60 : 60; spawnDust(fighter.x, fighter.y); shockwaves.push({x: fighter.x, y: fighter.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6}); triggerVibration(20); }
}

function checkGameOver() {
    if (matchResolved) return; 
    let allDead = enemies.length === 0 || enemies.every(e => e.hp <= 0);

    if (p1.hp <= 0 || allDead) {
        matchResolved = true; gameOver = true; 
        let mul = window.rewardMultiplier || 1; 

        if (p1.hp > 0) {
            let winXp = 50 * mul; let winElo = 15 * mul; let winCoins = 50 * mul;
            currentPlayer.xp = parseInt(currentPlayer.xp || 0) + winXp; currentPlayer.level = parseInt(currentPlayer.level || 1); currentPlayer.elo = parseInt(currentPlayer.elo || 1000) + winElo; currentPlayer.coins = parseInt(currentPlayer.coins || 0) + winCoins;
            let xpNeeded = currentPlayer.level * 100; while (currentPlayer.xp >= xpNeeded) { currentPlayer.xp -= xpNeeded; currentPlayer.level += 1; xpNeeded = currentPlayer.level * 100; }
            savePlayerData(); updatePlayerUI(); triggerVibration([100, 50, 100, 50, 300]);
        } else {
            let loseElo = 10 * mul; let loseCoins = 10 * mul;
            currentPlayer.elo = Math.max(0, parseInt(currentPlayer.elo || 1000) - loseElo); currentPlayer.coins = parseInt(currentPlayer.coins || 0) + loseCoins; 
            savePlayerData(); updatePlayerUI(); triggerVibration([300, 100, 400]);
        }
        
        let btnExit = document.querySelector(".control-btns .game-btn");
        if (btnExit) { btnExit.innerText = "⏭️"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
    }
}

function updateHPUIs() {
    if (!p1) return; let p1Pct = (p1.hp / p1.maxHp * 100) + "%"; 
    let currentEnemyHp = 0; enemies.forEach(e => currentEnemyHp += e.hp);
    let p2Pct = totalEnemyMaxHp > 0 ? (currentEnemyHp / totalEnemyMaxHp * 100) + "%" : "0%";
    
    document.getElementById("hp-red").style.width = p1Pct; document.getElementById("hp-red-trail").style.width = p1Pct; 
    document.getElementById("hp-blue").style.width = p2Pct; document.getElementById("hp-blue-trail").style.width = p2Pct;
    document.getElementById("stamina-red").style.width = p1.stamina + "%"; 
    
    let closestEnemy = getClosestEnemy(p1, enemies);
    if(closestEnemy) { document.getElementById("stamina-blue").style.width = closestEnemy.stamina + "%"; document.getElementById("stun-blue").style.width = closestEnemy.shieldBreak + "%"; }
    document.getElementById("stun-red").style.width = p1.shieldBreak + "%"; checkGameOver(); 
}

// BỘ TRÍ TUỆ NHÂN TẠO AUTO FIGHT (GỘP AI VÀ VẬT LÝ VÀO 1 VÒNG LẶP LIÊN HOÀN)
function update() {
    if (!p1) return;
    if (uiShakeP1 > 0) { uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (uiShakeP2 > 0) { uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }
    if (introTimer > 0) { introTimer--; if (introTimer === 60) playSound(800, 'square', 0.2, 0.5); return; }

    let isSlowMoFrame = false; if (slowMoTimer > 0) { slowMoTimer--; if (slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (shakeTime > 0) shakeTime--; if (screenFlash > 0) screenFlash -= 0.05;
    if (cinematicTimer > 0 && !isSlowMoFrame) { cinematicTimer--; if (cinematicTimer === 0 && cinematicCallback) { cinematicCallback(); cinematicCallback = null; } return; }
    if (isSlowMoFrame) return;

    weatherParticles.forEach(w => { w.y += w.speed; w.x += (currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2; if(w.y > canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } });
    for (let i = shockwaves.length - 1; i >= 0; i--) { let sw = shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) shockwaves.splice(i, 1); }
    for (let i = impactSparks.length - 1; i >= 0; i--) { impactSparks[i].life--; if (impactSparks[i].life <= 0) impactSparks.splice(i, 1); }
    if (Math.random() < 0.12) { particles.push({ x: Math.random() * canvas.width, y: GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    // Xóa xác chết
    enemies = enemies.filter(e => { if(e.hp <= 0) { spawnParticles(e.x, e.y, "#fff", true); playSound(300, 'sawtooth', 0.2, 0.2); return false; } return true; });
    
    let allFighters = [p1].concat(enemies);

    // =====================================
    // VÒNG LẶP ĐỒNG BỘ: AI -> VẬT LÝ -> TƯƠNG TÁC
    // =====================================
    allFighters.forEach(fighter => {
        // Cập nhật đếm ngược
        if (fighter.attackTimer > 0) fighter.attackTimer--; 
        if (fighter.hitStun > 0) fighter.hitStun--; 
        if (fighter.stunTimer > 0) fighter.stunTimer--; 
        if (fighter.dashTimer > 0) fighter.dashTimer--; 
        if (fighter.aiDelay > 0) fighter.aiDelay--;
        if (fighter.comboTimeout > 0) { fighter.comboTimeout--; if (fighter.comboTimeout === 0) fighter.comboHits = 0; }
        if (fighter.superArmor > 0) fighter.superArmor--;
        if (fighter.stunTimer === 0 && fighter.state === 'stunned') fighter.shieldBreak = 100;

        // Tính chỉ số Buff & Exhaustion
        fighter.isRage = (fighter.hp > 0 && fighter.hp <= fighter.maxHp * 0.3); 
        fighter.currentSpeed = fighter.speed || 3; fighter.currentDmgMod = fighter.dmgMod || 1; fighter.currentRegen = fighter.regen || 0.3;
        if (fighter.stamina < 10) fighter.isExhausted = true; if (fighter.stamina > 40) fighter.isExhausted = false;
        if (fighter.isRage) { fighter.currentSpeed *= 1.2; fighter.currentDmgMod *= 1.2; fighter.currentRegen += 0.2; }
        if (fighter.isExhausted) { fighter.currentSpeed *= 0.6; }

        // BỘ NÃO AI AUTO-FIGHT CHO CẢ NGƯỜI LẪN MÁY
        if (fighter.hp > 0 && !gameOver && fighter.attackTimer === 0 && fighter.hitStun === 0 && fighter.dashTimer <= 0 && fighter.stunTimer <= 0) {
            let targetGroup = fighter.isPlayer ? enemies : [p1];
            let target = getClosestEnemy(fighter, targetGroup);

            if (target) {
                let dist = target.x - fighter.x; fighter.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                let attackReach = 65 * Math.max(fighter.scale||1, target.scale||1);

                if (absDist > attackReach) {
                    // Áp sát mục tiêu: Truyền lực di chuyển TRỰC TIẾP
                    fighter.vx = Math.sign(dist) * fighter.currentSpeed;
                    fighter.state = 'walk';
                    if(Math.random() < 0.1 && fighter.onGround) spawnDust(fighter.x, fighter.y);
                } else {
                    // Tới tầm đánh, dừng bước
                    fighter.vx = 0;
                    if (fighter.aiDelay <= 0) {
                        fighter.aiDelay = Math.floor(Math.random() * 5) + 3; 
                        let rand = Math.random();
                        
                        // Kẻ địch có xài Skill tự động
                        if (!fighter.isPlayer && fighter.skill && rand < 0.1) {
                            // Máy tự gọi skill
                        } else if (rand < 0.15 && fighter.stamina >= 15) {
                            window.playerDodge(fighter);
                        } else {
                            attack(fighter, targetGroup, rand > 0.5 ? 'punch' : 'kick');
                        }
                    } else {
                        fighter.state = 'idle';
                    }
                }
            } else {
                fighter.vx = 0; fighter.state = 'idle';
            }
        }

        // HỆ THỐNG VẬT LÝ ÁP DỤNG NGAY SAU AI
        fighter.vy += GRAVITY; fighter.y += fighter.vy; 
        if (fighter.y >= GROUND_Y) { fighter.y = GROUND_Y; fighter.vy = 0; fighter.onGround = true; }
        
        // Chỉ bị ma sát kéo lại nếu ĐANG KHÔNG ĐI BỘ DO AI LỆNH
        if (fighter.dashTimer <= 0 && fighter.state !== 'walk') {
            fighter.vx *= 0.85; 
        }
        
        fighter.x += fighter.vx;

        // Xử lý góc tường
        let bounds = 30 * (fighter.scale || 1);
        if (fighter.x < bounds) { fighter.x = bounds; if(fighter.hitStun > 0 && fighter.vx < -4) { takeDamage(fighter, 5, null, "#fff", false, true); } }
        if (fighter.x > canvas.width - bounds) { fighter.x = canvas.width - bounds; if(fighter.hitStun > 0 && fighter.vx > 4) { takeDamage(fighter, 5, null, "#fff", false, true); } }

        // Cập nhật thể lực và Ảo ảnh
        fighter.stamina = Math.min(100, fighter.stamina + fighter.currentRegen);
        if (!fighter.trailArr) fighter.trailArr = [];
        if ((fighter.state === 'dash' || fighter.state === 'dash_back' || fighter.isRage) && Math.abs(fighter.vx) > 1) { fighter.trailArr.push({x: fighter.x, y: fighter.y, state: fighter.state, isFacingRight: fighter.isFacingRight, alpha: 0.5, classId: fighter.classId, color: fighter.color, scale: fighter.scale}); }
        for (let i = fighter.trailArr.length - 1; i >= 0; i--) { fighter.trailArr[i].alpha -= 0.05; if (fighter.trailArr[i].alpha <= 0) fighter.trailArr.splice(i, 1); }
    });

    // Chống đẩy đè nhau
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

    for (let i = projectiles.length - 1; i >= 0; i--) { let proj = projectiles[i]; proj.x += proj.vx; proj.y += proj.vy; let dx = proj.x - proj.target.x; let dy = proj.y - proj.target.y; if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { if(proj.onHit) proj.onHit(); takeDamage(proj.target, proj.dmg, `🎇 -${proj.dmg}`, "#9b59b6"); shakeScreen(8, 4); projectiles.splice(i, 1); } else if (proj.x < -100 || proj.x > canvas.width + 100 || proj.y < -100 || proj.y > canvas.height + 100) { projectiles.splice(i, 1); } }
    for (let i = traps.length - 1; i >= 0; i--) { let t = traps[i]; t.life--; if (t.life <= 0) { traps.splice(i, 1); continue; } }
    for (let i = particles.length - 1; i >= 0; i--) { let pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; pt.life--; if (pt.life <= 0) particles.splice(i, 1); }
    for (let i = slashes.length - 1; i >= 0; i--) { slashes[i].life--; if (slashes[i].life <= 0) slashes.splice(i, 1); }
    for (let i = floatingTexts.length - 1; i >= 0; i--) { let t = floatingTexts[i]; t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; if (t.alpha <= 0) floatingTexts.splice(i, 1); }
}

function drawStickman(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = "#fff"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : p.color; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    let maxT = (p.state === 'punch') ? 15 : 20; let pext = 0; if (p.state === 'punch' && p.comboStep === 1) pext = 10;
    let progress = (p.attackTimer > 0) ? 1 - (p.attackTimer / maxT) : 0; let ext = Math.sin(progress * Math.PI); 

    if (p.drawMethod) { try { p.drawMethod(ctx, p, bounce, ext, pext, isTrail); ctx.restore(); return; } catch (e) {} }
    let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
    let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
    let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};  

    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
    if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
    else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
    else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
    else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; }
    else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; }
    else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; }
    else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
    else if (p.state === 'stunned') { head.x = Math.sin(Date.now() / 50) * 5; handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; handR = {x: 10, y: -20}; elbowR = {x: 15, y: -30}; ctx.fillStyle = "#f1c40f"; ctx.font = "14px Arial"; ctx.fillText("💫", head.x, head.y - 15); }

    const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
    ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
    drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
    ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

    ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }

    if (!isTrail && p.onGround && p.y >= GROUND_Y) { ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); }
    if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -95, 40, 6); ctx.fillStyle = p.color; ctx.fillRect(-20, -95, 40 * (p.hp/p.maxHp), 6); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -95, 40, 6); }
    ctx.restore();
}

function drawAnnouncer(ctx, text, color, x, y, size = 32) { 
    ctx.save(); ctx.font = `italic 900 ${size}px Arial`; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "#111"; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.shadowBlur = 15; ctx.shadowColor = color; ctx.fillText(text, x, y); ctx.restore(); 
}

function draw() {
    if(!ctx) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); if(!ctx) return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save();
    
    if (slowMoTimer > 0) { 
        let loserX = p1.hp <= 0 ? p1.x : (enemies.length > 0 ? enemies[0].x : p1.x); let targetCamX = (canvas.width / 2) - loserX; camX += (targetCamX - camX) * 0.1; ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(1.2, 1.2); ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); 
    } else if (p1 && !gameOver && introTimer === 0) { 
        let closest = getClosestEnemy(p1, enemies); let centerX = closest ? (p1.x + closest.x) / 2 : p1.x; let targetCamX = (canvas.width / 2) - centerX; targetCamX = Math.max(-100, Math.min(100, targetCamX)); camX += (targetCamX - camX) * 0.1; ctx.translate(camX, 0); 
    }
    if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag); 

    ctx.fillStyle = "#1e272e"; ctx.fillRect(-400, -100, canvas.width + 800, canvas.height + 100);
    ctx.save(); ctx.translate(camX * 0.2, 0); ctx.fillStyle = "#2f3640"; for(var i = -500; i < canvas.width + 1000; i += 120) { ctx.fillRect(i, GROUND_Y - 150 + Math.sin(i)*30, 80, 150); } ctx.restore();
    ctx.save(); ctx.translate(camX * 0.5, 0); ctx.fillStyle = "#353b48"; for(var i = -500; i < canvas.width + 1000; i += 90) { ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i + 45, GROUND_Y - 100); ctx.lineTo(i + 90, GROUND_Y); ctx.fill(); } ctx.restore();
    ctx.fillStyle = "#111"; ctx.fillRect(-400, GROUND_Y, canvas.width + 800, canvas.height - GROUND_Y); ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-400, GROUND_Y); ctx.lineTo(canvas.width + 400, GROUND_Y); ctx.stroke();
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2; for(var i = -400; i < canvas.width + 400; i+=50) { ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i - 20, canvas.height); ctx.stroke(); }
    ctx.fillStyle = "#ff4757"; ctx.fillRect(10, 0, 5, canvas.height); ctx.fillStyle = "#1e90ff"; ctx.fillRect(canvas.width - 15, 0, 5, canvas.height); 

    ctx.save(); ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 1;
    weatherParticles.forEach(w => { if (currentWeather === 'snow') { ctx.beginPath(); ctx.arc(w.x + camX * 0.8, w.y, 2, 0, Math.PI*2); ctx.fill(); } else if (currentWeather === 'rain') { ctx.beginPath(); ctx.moveTo(w.x + camX * 0.8, w.y); ctx.lineTo(w.x - 5 + camX * 0.8, w.y + 15); ctx.stroke(); } });
    ctx.restore();

    traps.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); ctx.fillStyle = t.color; ctx.globalAlpha = (t.life / t.maxLife) * 0.5; ctx.fill(); ctx.globalAlpha = 1.0; });
    projectiles.forEach(proj => { ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); ctx.fillStyle = proj.color; ctx.fill(); ctx.shadowBlur = 10; ctx.shadowColor = proj.color; ctx.shadowBlur = 0; });
    ctx.globalCompositeOperation = 'lighter';
    shockwaves.forEach(sw => { ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); ctx.lineWidth = 5; ctx.strokeStyle = sw.color; ctx.globalAlpha = Math.max(0, sw.alpha); ctx.stroke(); });
    impactSparks.forEach(isp => { ctx.save(); ctx.translate(isp.x, isp.y); ctx.rotate(isp.angle); ctx.scale(isp.scale, isp.scale); ctx.globalAlpha = isp.life / isp.maxLife; ctx.fillStyle = isp.color; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(3, -5); ctx.lineTo(30, 0); ctx.lineTo(3, 5); ctx.lineTo(0, 30); ctx.lineTo(-3, 5); ctx.lineTo(-30, 0); ctx.lineTo(-3, -5); ctx.closePath(); ctx.fill(); ctx.restore(); });
    ctx.globalCompositeOperation = 'source-over';

    if (p1) {
        let allFighters = [p1].concat(enemies); ctx.globalCompositeOperation = 'lighter';
        allFighters.forEach(p => { if (p.trailArr) { p.trailArr.forEach(t => { let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); drawStickman(ctx, trailP, true); }); } });
        ctx.globalCompositeOperation = 'source-over';
        if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; } 
        enemies.forEach(e => drawStickman(ctx, e)); drawStickman(ctx, p1); ctx.shadowBlur = 0;
        
        if (p1.comboHits >= 2) { 
            ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = "#ff9f43"; ctx.textAlign = "left"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff9f43"; 
            ctx.fillText(`🔥 ${p1.comboHits}`, 30 - camX, 100 + Math.sin(Date.now() / 100) * 5); 
            ctx.restore(); 
        }
        if (p1.isRage && p1.hp > 0 && Math.sin(Date.now() / 100) > 0.5) { drawAnnouncer(ctx, "💢", "#ff4757", (canvas.width/4) - camX, 60); }
    }

    slashes.forEach(s => { ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.globalAlpha = s.life / s.maxLife; ctx.beginPath(); ctx.arc(0, 0, 40, -Math.PI/4, Math.PI/4); ctx.lineWidth = 8; ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.stroke(); ctx.restore(); });
    particles.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); }); ctx.globalAlpha = 1.0;
    floatingTexts.forEach(t => { ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; });
    ctx.restore(); 

    if (p1 && p1.hp > 0) {
        let distToWall = Math.min(p1.x, canvas.width - p1.x);
        if (distToWall < 100) { let alpha = ((100 - distToWall) / 100) * 0.4 * (0.5 + Math.sin(Date.now() / 50) * 0.5); if (p1.x < 100) { let grad = ctx.createLinearGradient(0, 0, 100, 0); grad.addColorStop(0, `rgba(255, 71, 87, ${alpha})`); grad.addColorStop(1, 'transparent'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 100, canvas.height); } else { let grad = ctx.createLinearGradient(canvas.width - 100, 0, canvas.width, 0); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, `rgba(255, 71, 87, ${alpha})`); ctx.fillStyle = grad; ctx.fillRect(canvas.width - 100, 0, 100, canvas.height); } }
    }
    if (screenFlash > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }

    if (cinematicTimer > 0 && cinematicCaster) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let stripY = canvas.height / 2 - 50; ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
        let progress = (50 - cinematicTimer) / 50; let slideX = -200 + (progress * 800);
        ctx.fillStyle = "#fff"; ctx.font = "italic 900 45px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 15; ctx.shadowColor = "#fff"; ctx.fillText("⚡", slideX, stripY + 60); ctx.shadowBlur = 0;
        let avaX = canvas.width - slideX; let casterClone = Object.assign({}, cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); drawStickman(ctx, casterClone);
    }

    if (gameOver && p1 && slowMoTimer <= 0) { 
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.font = "bold 32px Arial"; ctx.fillStyle = p1.hp > 0 ? "#2ed573" : "#ff4757"; ctx.textAlign = "center"; 
        let mul = window.rewardMultiplier || 1;
        if (p1.hp > 0) {
            ctx.fillText(`🏆 1 🆚 ${mul}`, canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = "bold 18px Arial"; ctx.fillStyle = "#fff"; ctx.fillText(`🎁 +${50*mul}💰, +${15*mul}🏆`, canvas.width / 2, canvas.height / 2 + 15);
        } else {
            ctx.fillText(`💀 1 🆚 ${mul}`, canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = "bold 18px Arial"; ctx.fillStyle = "#fff"; ctx.fillText(`📉 -${10*mul}🏆, +${10*mul}💰`, canvas.width / 2, canvas.height / 2 + 15);
        }
        ctx.fillStyle = "#f1c40f"; ctx.font = "bold 24px Arial"; ctx.fillText("⏭️", canvas.width / 2, canvas.height / 2 + 55);
    } else if (slowMoTimer > 0) { 
        let size = 150 - (120 - slowMoTimer); ctx.font = `italic 900 ${Math.max(50, size)}px Arial`; ctx.fillStyle = "#ff4757"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = "#ff4757"; ctx.fillText("☠️", canvas.width / 2, canvas.height / 2 + 20); ctx.shadowBlur = 0; 
    }
    
    if (introTimer > 0 && !gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.textAlign = "center";
        if (introTimer > 60) {
            let slideProgress = Math.min(1, (160 - introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
            let slideX1 = -200 + easeOut * (canvas.width / 2 - 120); let slideX2 = canvas.width + 200 - easeOut * (canvas.width / 2 - 120);
            let p1Clone = Object.assign({}, p1, {x: slideX1, y: canvas.height/2 + 30, state: 'idle', isFacingRight: true}); drawStickman(ctx, p1Clone);
            let repEnemy = enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: canvas.height/2 + 30, state: 'idle', isFacingRight: false}); drawStickman(ctx, p2Clone);
            
            ctx.font = "italic 900 35px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("👤", slideX1, canvas.height/2 + 80);
            let eName = (window.gameMultiplier === 99) ? `👹` : (window.gameMultiplier > 1 ? `🤖 x${window.gameMultiplier}` : "🤖"); ctx.fillStyle = "#1e90ff"; ctx.fillText(eName, slideX2, canvas.height/2 + 80);
            
            if (introTimer < 130 && introTimer > 70) {
                ctx.font = "bold 20px Arial"; ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.beginPath(); ctx.roundRect(slideX1 - 20, canvas.height/2 - 140, 40, 30, 8); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillText(p1.taunt, slideX1, canvas.height/2 - 118);
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.beginPath(); ctx.roundRect(slideX2 - 20, canvas.height/2 - 140, 40, 30, 8); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillText(repEnemy.taunt, slideX2, canvas.height/2 - 118);
            }
            if (introTimer <= 120) { ctx.font = "italic 900 80px Arial"; ctx.fillStyle = "#f1c40f"; ctx.shadowBlur = 25; ctx.shadowColor = "#f1c40f"; ctx.fillText("🆚", canvas.width/2, canvas.height/2 - 10); ctx.shadowBlur = 0; }
        } else {
            let scale = 1 + (introTimer / 60); ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale); ctx.font = "italic 900 90px Arial"; ctx.fillStyle = "#ff9f43"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff9f43"; ctx.fillText("🥊", 0, 30); ctx.restore();
        }
    }
}

var lastFrameTime = 0; var FRAME_MIN_TIME = 1000 / 60; 
function gameLoop(timestamp) { if (!isLoopRunning) return; requestAnimationFrame(gameLoop); if (!timestamp) timestamp = 0; let deltaTime = timestamp - lastFrameTime; if (deltaTime >= FRAME_MIN_TIME) { lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME); try { update(); } catch(e) {console.error(e);} try { draw(); } catch(e) {console.error(e);} } }

let gridCheckTimer = setInterval(() => {
    if (typeof window.classStats !== 'undefined' && Object.keys(window.classStats).length > 0) {
        let grid = document.getElementById("character-carousel");
        if (grid && grid.innerHTML.trim() === "" && typeof window.renderCharacterGrid === 'function') {
            window.renderCharacterGrid(); clearInterval(gridCheckTimer); 
        }
    }
}, 100);
