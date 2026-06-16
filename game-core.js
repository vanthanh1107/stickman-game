var canvas = null, ctx = null, audioCtx = null, isMuted = false; 
var floatingTexts = [], particles = [], projectiles = [], traps = [], slashes = [], shockwaves = [], impactSparks = [];
var p1 = null, gameOver = false, isLoopRunning = false;
var enemies = [], totalEnemyMaxHp = 0, rewardMultiplier = 1; 

var shakeTime = 0, shakeMag = 0, matchResolved = false;
var camX = 0, screenFlash = 0, cinematicTimer = 0, cinematicCaster = null, cinematicCallback = null; 
var slowMoTimer = 0, introTimer = 0, uiShakeP1 = 0, uiShakeP2 = 0;
var currentZoom = 1, targetZoom = 1;

var currentWeather = 'none', weatherParticles = [];
var GROUND_Y = 320, GRAVITY = 0.8;
var lastFrameTime = 0, FRAME_MIN_TIME = 1000 / 60;

function triggerVibration(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); isMuted = !isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = isMuted ? "🔇" : "🔊"; if (!isMuted && audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); } }

function playSound(freq, type, duration, vol) { 
    if (isMuted) return; 
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); 
        osc.connect(gain); gain.connect(audioCtx.destination); 
        osc.type = type; let dynamicFreq = freq + (Math.random() - 0.5) * 60;
        osc.frequency.setValueAtTime(dynamicFreq, audioCtx.currentTime); 
        gain.gain.setValueAtTime(vol, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); 
        osc.start(); osc.stop(audioCtx.currentTime + duration); 
    } catch(e){}
}

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
    matchStart(); if (!isLoopRunning) { isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
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
    
    rewardMultiplier = isBossMode ? 15 : selectedMode;
    let actualEnemiesCount = isBossMode ? 1 : selectedMode;
    
    let btnExit = document.querySelector(".control-btns .game-btn");
    if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }
    
    let finalHp = s1.hp + (currentPlayer.bonusHp || 0);
    let finalDmg = s1.dmgMod * (1 + (currentPlayer.bonusDmg || 0)/100);
    let finalSpd = s1.speed * (1 + (currentPlayer.bonusSpeed || 0)/100);
    let finalCrit = 0.25 + (currentPlayer.bonusCrit || 0)/100;

    p1 = { 
        id: "player", classId: selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, 
        speed: finalSpd, color: "#ff4757", hp: finalHp, maxHp: finalHp, dmgMod: finalDmg, scale: 1,
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
        stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: s1.drawMethod, skill: s1.skill, regen: s1.regen, shield: 0, 
        buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: finalCrit, critMult: 1.5, className: s1.className, isRage: false, 
        shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false, killCount: 0,
        taunt: ["🔥", "💢", "💪", "👊"][Math.floor(Math.random()*4)]
    };

    enemies = []; totalEnemyMaxHp = 0;
    for(let i = 0; i < actualEnemiesCount; i++) {
        let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
        let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; if(isBossMode) hpMultiplier = 10.0;
        let eHp = Math.floor(s2.hp * hpMultiplier); totalEnemyMaxHp += eHp;

        enemies.push({ 
            id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: GROUND_Y, vx: 0, vy: 0, 
            speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
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
    
    document.getElementById("name-display-blue").innerText = isBossMode ? `👹 THE BOSS` : ((actualEnemiesCount > 1) ? `🤖 x${enemies.length}` : `🤖`);

    floatingTexts = []; particles = []; projectiles = []; traps = []; slashes = []; shockwaves = []; impactSparks = [];
    shakeTime = 0; cinematicTimer = 0; cinematicCaster = null; cinematicCallback = null; currentZoom = 1; targetZoom = 1;
    camX = 0; screenFlash = 0; slowMoTimer = 0; uiShakeP1 = 0; uiShakeP2 = 0; matchResolved = false; gameOver = false; introTimer = 160;
    
    document.getElementById("hp-red").style.width = "100%"; document.getElementById("hp-red-trail").style.width = "100%"; 
    document.getElementById("hp-blue").style.width = "100%"; document.getElementById("hp-blue-trail").style.width = "100%";
    document.getElementById("stun-red").style.width = "100%"; document.getElementById("stun-blue").style.width = "100%";
}

function shakeScreen(frames, magnitude) { shakeTime = frames; shakeMag = magnitude; }
function spawnTrap(x, y, radius, color, damage, lifeFrames, owner) { traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
function spawnProjectile(x, y, vx, vy, radius, color, dmg, target, customOnHit) { projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
function spawnSlash(x, y, isRight, color, isCrit, scale) { slashes.push({ x: x, y: y, isRight: isRight, life: 10, maxLife: 10, color: isCrit ? "#fff" : color, scale: (isCrit ? 1.8 : 1) * scale }); }
function spawnParticles(x, y, color, isCrit = false) { let count = isCrit ? 30 : 15; for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 5 + 2 }); } }
function spawnDust(x, y) { for(let i=0; i<8; i++) { particles.push({ x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*3, vy: -Math.random()*3, life: 15, maxLife: 15, color: "rgba(200, 200, 200, 0.5)", size: Math.random() * 8 + 4 }); } }

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
    
    let hitWord = actualDmg > 0 ? `-${Math.round(actualDmg)}` : "";
    if (isCrit && !isWallBounce) { hitWord += " 💥"; screenFlash = 0.5; targetZoom = 1.08; shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 120, color: "#f1c40f", alpha: 1, speed: 8}); triggerVibration([40, 30, 40]); } 
    if (isWallBounce) { hitWord += " 🧱"; screenFlash = 0.2; shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); triggerVibration(60); } 
    
    if (actualDmg > 0 || isCrit || isWallBounce) {
        let dynamicSize = Math.min(45, 18 + actualDmg * 0.4); 
        let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`;
        let rndX = (Math.random() - 0.5) * 40; let rndY = -Math.random() * 30 - 50 * (target.scale||1);
        
        floatingTexts.push({ x: target.x + rndX, y: target.y + rndY, text: hitWord.trim(), color: isCrit ? "#f1c40f" : color, alpha: 1, vx: (Math.random() - 0.5) * 6, vy: isCrit ? -8 : -5, font: fontStyle, life: 40 });
        impactSparks.push({ x: target.x, y: target.y - 30, life: 10, maxLife: 10, angle: Math.random() * Math.PI, color: isCrit ? "#fff" : "#ff9f43", scale: isCrit ? 2 : 1 });
        if (target.isPlayer) uiShakeP1 = 15; else uiShakeP2 = 15;
    }

    spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); updateHPUIs();
}

// =====================================
// NÂNG CẤP VÕ THUẬT: CÂN CHỈNH KHOẢNG CÁCH VÀ KHẮC CHẾ (CLASH)
// =====================================
function attack(attacker, potentialTargets) {
    if (!attacker || attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
    if (!Array.isArray(potentialTargets)) potentialTargets = [potentialTargets];

    let cStep = attacker.comboStep || 0;
    let currentType = 'punch';
    let dmgMult = 1; let knockback = 5; let liftVy = 0; let atkTime = 15;

    // ĐÃ CHỈNH SỬA: Giảm lực đẩy (knockback) và lực tiến tới (vx) để đánh không bị trôi tuột
    if (cStep === 0) { currentType = 'punch'; atkTime = 15; dmgMult = 1; knockback = 6; }
    else if (cStep === 1) { currentType = 'kick'; atkTime = 18; dmgMult = 1.2; knockback = 8; }
    else if (cStep === 2) { currentType = 'spin_kick'; atkTime = 22; dmgMult = 1.5; knockback = 10; attacker.vx = attacker.isFacingRight ? 5 : -5; } // Giảm trượt
    else if (cStep === 3) { currentType = 'uppercut'; atkTime = 25; dmgMult = 2.0; knockback = 2; liftVy = -12; } // Giảm lực hất văng
    else if (cStep === 4) { currentType = 'slam'; atkTime = 35; dmgMult = 3.0; knockback = 0; attacker.vy = -4; }

    attacker.state = currentType; attacker.attackTimer = atkTime; 
    playSound(400 - (cStep * 30), 'square', 0.1, 0.1);
    
    let attackRange = (currentType === 'spin_kick' || currentType === 'slam') ? 110 : 80;
    attackRange *= (attacker.scale || 1); 
    
    let hitTargets = [];
    potentialTargets.forEach(defender => {
        if (!defender || defender.hp <= 0) return;
        let dist = defender.x - attacker.x; let isHit = false;
        let hitBoxAllowance = 30 * (defender.scale || 1);

        if (attacker.isFacingRight && dist > -hitBoxAllowance && dist <= attackRange + hitBoxAllowance) isHit = true;
        if (!attacker.isFacingRight && dist < hitBoxAllowance && dist >= -attackRange - hitBoxAllowance) isHit = true;
        
        let verticalDist = Math.abs(attacker.y - defender.y);
        if (verticalDist > 120 * Math.max(attacker.scale, defender.scale)) isHit = false; 
        
        if(isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        let isCrit = Math.random() < attacker.critChance;
        let primaryDefender = hitTargets[0];
        
        if (currentType === 'slam') {
            targetZoom = 1.15; shakeScreen(25, 15);
            shockwaves.push({x: primaryDefender.x, y: GROUND_Y, r: 10, maxR: 250, color: "#e74c3c", alpha: 1, speed: 15});
            playSound(100, 'sawtooth', 0.5, 0.5);
            spawnSlash(primaryDefender.x, primaryDefender.y - 30, attacker.isFacingRight, "#e74c3c", true, 2.5);
        } else if (currentType === 'uppercut') {
            targetZoom = 1.08; shakeScreen(10, 8);
            slashes.push({ x: primaryDefender.x, y: primaryDefender.y - 50, isRight: attacker.isFacingRight, life: 12, maxLife: 12, color: "#3498db", scale: 2 });
        } else {
            spawnSlash(primaryDefender.x + (attacker.isFacingRight ? -20 : 20), primaryDefender.y - 30, attacker.isFacingRight, attacker.color, isCrit, attacker.scale || 1);
        }
        
        hitTargets.forEach(defender => {
            let baseDmg = 6 * (attacker.currentDmgMod || 1);
            let dmg = baseDmg * dmgMult * (1 + (attacker.comboHits * 0.05));
            if (defender.state === 'stunned') dmg *= 1.5; if (isCrit) dmg *= attacker.critMult; dmg = Math.floor(dmg + Math.random() * 3); 

            if (defender.state === 'dash_back' && defender.iFrames > 0) return; 
            if (defender.state === 'block') { dmg = Math.floor(dmg * 0.2); playSound(500, 'triangle', 0.1, 0.1); defender.vx = attacker.isFacingRight ? 5 : -5; return; } 
            
            // HỆ THỐNG KHẮC CHẾ (CLASH): Nếu đối thủ cũng đang đánh
            let isCounter = defender.attackTimer > 0 && defender.state !== 'hurt';
            if (isCounter) {
                spawnParticles(defender.x, defender.y - 40, "#fff", true);
                floatingTexts.push({ x: defender.x, y: defender.y - 60, text: "⚔️", color: "#fff", alpha: 1, vx: 0, vy: -2, font: "900 28px Arial", life: 30 });
                dmg = Math.floor(dmg * 1.5); // Sát thương khắc chế to hơn
                playSound(600, 'triangle', 0.1, 0.4);
                hitStopFrames = 8; // Đứng hình lâu hơn tạo cảm giác nặng
            }

            takeDamage(defender, dmg, "#fff", isCrit, false);
            defender.hitStun = (currentType === 'slam' || isCounter) ? 30 : 15; 
            defender.state = 'hurt';
            
            defender.vx = attacker.isFacingRight ? knockback : -knockback;
            
            if (liftVy !== 0) { defender.vy = liftVy; defender.onGround = false; spawnDust(defender.x, GROUND_Y); }

            if (currentType === 'slam') {
                defender.y = GROUND_Y; defender.vy = 0; defender.vx = 0; defender.state = 'stunned'; defender.stunTimer = 60; defender.shieldBreak = 0;
            }
            
            if (defender.shieldBreak > 0 && defender.state !== 'stunned' && currentType !== 'slam') {
                defender.shieldBreak -= isCrit ? 35 : (15 + cStep*5);
                if (defender.shieldBreak <= 0) {
                    defender.shieldBreak = 0; defender.stunTimer = 90; defender.state = 'stunned'; defender.vx = 0;
                    takeDamage(defender, 0, "#00d2d3", false, false); 
                    shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 100, color: "#00d2d3", alpha: 1, speed: 8});
                }
            }
            defender.comboHits = 0; 
        });
        attacker.comboHits++; attacker.comboTimeout = 120; 
    } else { attacker.comboHits = 0; }
}

function triggerCinematic(caster, callback) { cinematicTimer = 50; cinematicCaster = caster; cinematicCallback = callback; targetZoom = 1.15; playSound(600, 'sawtooth', 0.8, 0.3); }

window.playerUseSkill = function(skillType) {
    if (gameOver || !p1 || p1.attackTimer > 0 || p1.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || p1.stunTimer > 0 || introTimer > 0) return;
    let closestEnemy = getClosestEnemy(p1, enemies); if(!closestEnemy) return;

    let gameContext = { floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: st, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    if (skillType === 1 && p1.stamina >= 25 && p1.skill.actionCode1) { p1.stamina -= 25; p1.skill.actionCode1(p1, closestEnemy, gameContext); p1.state = 'punch'; p1.attackTimer = 15; }
    if (skillType === 2 && p1.stamina >= 50 && p1.skill.actionCode2) { p1.stamina -= 50; p1.skill.actionCode2(p1, closestEnemy, gameContext); p1.state = 'kick'; p1.attackTimer = 20; }
    if (skillType === 3 && p1.stamina >= 100 && p1.skill.actionCode3) { p1.stamina -= 100; triggerCinematic(p1, () => { p1.superArmor = 25; p1.skill.actionCode3(p1, closestEnemy, gameContext); p1.state = 'cast'; p1.attackTimer = 25; }); }
}

// ĐÃ CHỈNH SỬA: Giảm quãng đường lướt né để không bị trôi tuột
window.playerDodge = function(fighter = p1) {
    if (gameOver || !fighter || fighter.attackTimer > 0 || fighter.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || fighter.stunTimer > 0 || introTimer > 0) return;
    if (fighter.stamina >= 15) { 
        fighter.stamina -= 15; fighter.state = 'dash_back'; fighter.iFrames = 20; fighter.attackTimer = 15; 
        playSound(300, 'sine', 0.1, 0.1); spawnDust(fighter.x, fighter.y); 
        // Lực trượt thu hẹp lại (chỉ còn 35px thay vì 60px)
        fighter.x += fighter.isFacingRight ? -35 : 35; 
        spawnDust(fighter.x, fighter.y); shockwaves.push({x: fighter.x, y: fighter.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6}); triggerVibration(20); 
    }
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

window.updateLogic = function() {
    if (!p1) return;
    
    enemies = enemies.filter(e => { 
        if(e.hp <= 0) { 
            spawnParticles(e.x, e.y, "#fff", true); playSound(300, 'sawtooth', 0.2, 0.2); 
            for(let c=0; c<5; c++) particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*10, vy: -Math.random()*10, life: 40, maxLife: 40, color: "#f1c40f", size: 4, isCoin: true });
            
            if (p1 && p1.hp > 0) {
                let heal = Math.floor(p1.maxHp * 0.08); p1.hp = Math.min(p1.maxHp, p1.hp + heal);
                floatingTexts.push({ x: p1.x, y: p1.y - 80, text: `+${heal} 💚`, color: "#2ed573", alpha: 1, vx: (Math.random()-0.5)*4, vy: -6, font: "bold 24px Arial", life: 45 });
                p1.killCount = (p1.killCount || 0) + 1;
                let sT = ""; if(p1.killCount===2) sT="DOUBLE 💀💀"; else if(p1.killCount===3) sT="TRIPLE 💀💀💀"; else if(p1.killCount===5) sT="RAMPAGE 🔥"; else if(p1.killCount>=8) sT="GODLIKE 👑";
                if(sT) floatingTexts.push({ x: p1.x, y: p1.y - 120, text: sT, color: "#ff4757", alpha: 1, vx: 0, vy: -5, font: "italic 900 32px Arial", life: 50 });
            }
            return false; 
        } 
        return true; 
    });
    
    let allFighters = [p1].concat(enemies);
    let gameContext = { floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: st, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    allFighters.forEach(f => {
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.stunTimer > 0) f.stunTimer--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout === 0) f.comboStep = 0; }
        if (f.superArmor > 0) f.superArmor--; if (f.stunTimer === 0 && f.state === 'stunned') f.shieldBreak = 100;
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.3); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; f.currentRegen = f.regen || 0.3;
        if (f.stamina < 10) f.isExhausted = true; if (f.stamina > 40) f.isExhausted = false;
        if (f.isRage) { f.currentSpeed *= 1.2; f.currentDmgMod *= 1.2; f.currentRegen += 0.2; if (Math.random() < 0.3) particles.push({ x: f.x + (Math.random() - 0.5) * 30, y: f.y - Math.random() * 60, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 3 - 1, life: 15, maxLife: 15, color: f.color, size: Math.random() * 3 + 2 }); }
        if (f.isExhausted) { f.currentSpeed *= 0.6; if (Math.random() < 0.05) spawnSweat(f.x, f.y - 40); }

        for (let i = f.buffs.length - 1; i >= 0; i--) { let b = f.buffs[i]; b.life--; if (b.life <= 0) { f.buffs.splice(i, 1); continue; } if (b.stat === 'dmg') f.currentDmgMod += b.value; if (b.stat === 'speed') f.currentSpeed += b.value; if (b.stat === 'regen') f.currentRegen += b.value; if (b.life % 15 === 0) particles.push({ x: f.x + (Math.random()*20-10), y: f.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 }); }

        if (f.attackTimer === 0 && f.hitStun === 0 && f.dashTimer <= 0 && f.stunTimer <= 0 && !gameOver && f.hp > 0) {
            let targetGroup = f.isPlayer ? enemies : [p1];
            let closest = getClosestEnemy(f, targetGroup);
            
            if (closest && closest.hp > 0) {
                let dist = closest.x - f.x; f.isFacingRight = dist > 0; let absDist = Math.abs(dist);
                let reach = 65 * Math.max(f.scale||1, closest.scale||1);

                if (absDist > reach) {
                    f.vx = Math.sign(dist) * f.currentSpeed; f.state = 'walk';
                    if (Math.random() < 0.1 && f.onGround) spawnDust(f.x, f.y);
                } else {
                    f.vx = 0; if (f.state === 'walk') f.state = 'idle';
                    
                    if (f.aiDelay <= 0) {
                        f.aiDelay = Math.floor(Math.random() * 8) + 8; let usedSkill = false;
                        if (f.skill && !f.isPlayer) {
                             if (f.stamina >= 100 && f.skill.actionCode3) { f.stamina -= 100; usedSkill = true; triggerCinematic(f, () => { f.superArmor = 25; try { f.skill.actionCode3(f, closest, gameContext); if(f.state==='idle') { f.state = 'cast'; f.attackTimer = 15; } } catch (e) {} }); }
                             else if (f.stamina >= 50 && f.skill.actionCode2 && Math.random() < 0.05) { f.stamina -= 50; try { f.skill.actionCode2(f, closest, gameContext); usedSkill = true; if(f.state==='idle') { f.state = 'kick'; f.attackTimer = 20; } } catch (e) {} }
                             else if (f.stamina >= 25 && f.skill.actionCode1 && Math.random() < 0.03) { f.stamina -= 25; try { f.skill.actionCode1(f, closest, gameContext); usedSkill = true; if(f.state==='idle') { f.state = 'punch'; f.attackTimer = 12; } } catch (e) {} }
                        }
                        if (!usedSkill) {
                            let rand = Math.random();
                            if (closest.attackTimer > 0 || closest.state === 'dash') {
                                // ĐÃ CHỈNH SỬA: AI lướt né nhẹ nhàng hơn
                                if (rand < 0.6) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; spawnDust(f.x, f.y); } 
                                else if (rand < 0.9) { f.state = 'block'; f.attackTimer = 15; } else { attack(f, targetGroup); }
                            } else {
                                if (rand < 0.85) {
                                    if (f.comboTimer > 0 && f.comboStep < 4) { f.comboStep++; attack(f, targetGroup); } 
                                    else { f.comboStep = 0; attack(f, targetGroup); } 
                                    f.comboTimer = 50;
                                } else { if (Math.random() < 0.6) { f.state = 'block'; f.attackTimer = 10; } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } }
                            }
                        }
                    }
                }
            } else { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }
        }

        f.vy += GRAVITY; f.y += f.vy; if (f.y >= GROUND_Y) { f.y = GROUND_Y; f.vy = 0; f.onGround = true; }
        if (isNaN(f.x)) f.x = 100; if (isNaN(f.vx)) f.vx = 0;
        
        // ĐÃ CHỈNH SỬA: Giảm hệ số trượt khi AI lướt
        if (f.dashTimer > 0) { f.vx = f.dashDir * f.currentSpeed * 1.8; } 
        else if (f.state !== 'walk' && f.state !== 'dash' && f.state !== 'dash_back' && f.onGround) { f.vx *= 0.85; }
        
        f.x += f.vx;

        let bounds = 30 * (f.scale || 1);
        if (f.x < bounds) { f.x = bounds; if (f.hitStun > 0 && f.vx < -4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }
        if (f.x > 600 - bounds) { f.x = 600 - bounds; if (f.hitStun > 0 && f.vx > 4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }

        if (f.attackTimer === 0 && f.hitStun === 0 && f.onGround && f.dashTimer <= 0 && f.stunTimer <= 0 && f.state !== 'walk') f.state = 'idle'; 
    });
}
