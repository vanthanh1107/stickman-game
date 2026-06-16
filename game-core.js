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
            if(typeof currentPlayer !== 'undefined') currentPlayer.classId = id; 
        };
        carousel.appendChild(card); if (typeof currentPlayer !== 'undefined' && currentPlayer.classId && id === currentPlayer.classId) { card.click(); firstCardId = id; } if(!firstCardId) { firstCardId = id; }
    }
    if(!selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

window.startGame = function() { 
    if(!selectedRedClass) return; 
    let selScreen = document.getElementById("selection-screen"); if(selScreen) selScreen.style.display = "none";
    let gameScreen = document.getElementById("game-screen"); if(gameScreen) gameScreen.style.display = "block";
    matchStart(); 
    if (!isLoopRunning) { isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.backToMenu = function() { 
    let gameScreen = document.getElementById("game-screen"); if(gameScreen) gameScreen.style.display = "none";
    let selScreen = document.getElementById("selection-screen"); if(selScreen) selScreen.style.display = "block";
    gameOver = true; isLoopRunning = false; 
    if (typeof updatePlayerUI === 'function') updatePlayerUI(); 
}

function getClosestEnemy(source, targetsArray) {
    if (!targetsArray || targetsArray.length === 0) return null;
    let closest = null; let minDist = Infinity;
    for (let i = 0; i < targetsArray.length; i++) { 
        if (!targetsArray[i] || targetsArray[i].hp <= 0) continue;
        let d = Math.abs(source.x - targetsArray[i].x); 
        if (d < minDist) { minDist = d; closest = targetsArray[i]; } 
    }
    return closest;
}

function matchStart() {
    try {
        let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
        if (!selectedRedClass || !window.classStats[selectedRedClass]) { selectedRedClass = allKeys[0]; }
        
        let s1 = window.classStats[selectedRedClass];
        let nameRed = document.getElementById("name-display-red"); if(nameRed) nameRed.innerText = `👤`; 
        
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1;
        let isBossMode = (selectedMode === 99);
        
        window.rewardMultiplier = isBossMode ? 15 : selectedMode;
        let actualEnemiesCount = isBossMode ? 1 : selectedMode;
        
        let btnExit = document.querySelector(".control-btns .game-btn");
        if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }
        
        let bHp = typeof currentPlayer !== 'undefined' ? (currentPlayer.bonusHp || 0) : 0;
        let bDmg = typeof currentPlayer !== 'undefined' ? (currentPlayer.bonusDmg || 0) : 0;
        let bSpd = typeof currentPlayer !== 'undefined' ? (currentPlayer.bonusSpeed || 0) : 0;
        let bCrit = typeof currentPlayer !== 'undefined' ? (currentPlayer.bonusCrit || 0) : 0;

        let finalHp = s1.hp + bHp; let finalDmg = s1.dmgMod * (1 + bDmg/100); let finalSpd = s1.speed * (1 + bSpd/100); let finalCrit = 0.25 + bCrit/100;

        p1 = { 
            id: "player", classId: selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, 
            speed: finalSpd, color: "#ff4757", hp: finalHp, maxHp: finalHp, dmgMod: finalDmg, scale: 1,
            onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
            stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: s1.regen || 0.4, shield: 0, 
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
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: s2.regen || 0.3, shield: 0, 
                buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, 
                shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false,
                taunt: isBossMode ? "👹" : ["🤖", "🔪", "🎯", "🩸"][Math.floor(Math.random()*4)]
            });
        }
        
        let nameBlue = document.getElementById("name-display-blue"); if(nameBlue) nameBlue.innerText = isBossMode ? `👹 THE BOSS` : ((actualEnemiesCount > 1) ? `🤖 x${enemies.length}` : `🤖`);
        floatingTexts = []; particles = []; projectiles = []; traps = []; slashes = []; shockwaves = []; impactSparks = [];
        shakeTime = 0; hitStopFrames = 0; cinematicTimer = 0; cinematicCaster = null; cinematicCallback = null; currentZoom = 1; targetZoom = 1;
        camX = 0; screenFlash = 0; slowMoTimer = 0; uiShakeP1 = 0; uiShakeP2 = 0; matchResolved = false; gameOver = false; introTimer = 160;
        
        weatherParticles = []; for(let i=0; i<100; i++) { weatherParticles.push({ x: Math.random() * 1200 - 300, y: Math.random() * 400, speed: 3 }); }
        updateHPUIs();
    } catch(e) { console.error("Match Start Error:", e); }
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

function attack(attacker, potentialTargets) {
    if (!attacker || attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
    if (!Array.isArray(potentialTargets)) potentialTargets = [potentialTargets];

    let cStep = attacker.comboStep || 0; let currentType = 'jab';
    let dmgMult = 1; let knockback = 5; let liftVy = 0; let atkTime = 15;

    if (cStep === 0) { currentType = 'jab'; atkTime = 12; dmgMult = 1.0; knockback = 5; }
    else if (cStep === 1) { currentType = 'cross'; atkTime = 15; dmgMult = 1.3; knockback = 8; attacker.vx = attacker.isFacingRight ? 4 : -4; }
    else if (cStep === 2) { currentType = 'hook'; atkTime = 18; dmgMult = 1.6; knockback = 12; } 
    else if (cStep === 3) { currentType = 'uppercut'; atkTime = 24; dmgMult = 2.2; knockback = 3; liftVy = -13; } 
    else if (cStep === 4) { currentType = 'heavy_slam'; atkTime = 34; dmgMult = 3.5; knockback = 0; attacker.vy = -3; }

    attacker.state = currentType; attacker.attackTimer = atkTime; 
    playSound(420 - (cStep * 35), 'square', 0.1, 0.1);
    
    let attackRange = (currentType === 'heavy_slam') ? 115 : 80;
    attackRange *= (attacker.scale || 1); let hitTargets = [];
    
    potentialTargets.forEach(defender => {
        if (!defender || defender.hp <= 0) return;
        let dist = defender.x - attacker.x; let isHit = false;
        let hitBoxAllowance = 35 * (defender.scale || 1);
        if (attacker.isFacingRight && dist > -hitBoxAllowance && dist <= attackRange + hitBoxAllowance) isHit = true;
        if (!attacker.isFacingRight && dist < hitBoxAllowance && dist >= -attackRange - hitBoxAllowance) isHit = true;
        let verticalDist = Math.abs(attacker.y - defender.y);
        if (verticalDist > 130 * Math.max(attacker.scale, defender.scale)) isHit = false; 
        if(isHit) hitTargets.push(defender);
    });

    if (hitTargets.length > 0) {
        let isCrit = Math.random() < attacker.critChance; let primaryDefender = hitTargets[0];
        if (currentType === 'heavy_slam') {
            targetZoom = 1.15; shakeScreen(25, 15); shockwaves.push({x: primaryDefender.x, y: GROUND_Y, r: 10, maxR: 260, color: "#ff4757", alpha: 1, speed: 14});
            playSound(90, 'sawtooth', 0.5, 0.4); spawnSlash(primaryDefender.x, primaryDefender.y - 30, attacker.isFacingRight, "#ff4757", true, 2.5);
        } else if (currentType === 'uppercut') {
            targetZoom = 1.08; shakeScreen(10, 7); slashes.push({ x: primaryDefender.x, y: primaryDefender.y - 50, isRight: attacker.isFacingRight, life: 12, maxLife: 12, color: "#3498db", scale: 2 });
        } else {
            spawnSlash(primaryDefender.x + (attacker.isFacingRight ? -15 : 15), primaryDefender.y - 30, attacker.isFacingRight, attacker.color, isCrit, attacker.scale || 1);
        }
        
        hitTargets.forEach(defender => {
            let dmg = 6 * (attacker.currentDmgMod || 1) * dmgMult * (1 + (attacker.comboHits * 0.05));
            if (defender.state === 'stunned') dmg *= 1.5; if (isCrit) dmg *= attacker.critMult; dmg = Math.floor(dmg + Math.random() * 3); 

            if (defender.state === 'dash_back' && defender.iFrames > 0) return; 
            if (defender.state === 'block') { dmg = Math.floor(dmg * 0.2); playSound(500, 'triangle', 0.1, 0.1); defender.vx = attacker.isFacingRight ? 5 : -5; return; } 
            
            let isCounter = defender.attackTimer > 0 && defender.state !== 'hurt';
            if (isCounter) {
                spawnParticles(defender.x, defender.y - 40, "#fff", true);
                floatingTexts.push({ x: defender.x, y: defender.y - 60, text: "⚔️", color: "#fff", alpha: 1, vx: 0, vy: -2, font: "900 28px Arial", life: 30 });
                dmg = Math.floor(dmg * 1.5); playSound(600, 'triangle', 0.1, 0.4); hitStopFrames = 8; 
            }

            takeDamage(defender, dmg, "#fff", isCrit, false);
            defender.hitStun = (currentType === 'heavy_slam' || isCounter) ? 30 : 15; defender.state = 'hurt';
            let pushForce = (attacker.comboHits > 0 && attacker.comboHits % 5 === 0) ? 55 : (isCrit ? 35 : 12);
            defender.vx = attacker.isFacingRight ? pushForce : -pushForce; spawnDust(defender.x, defender.y);
            
            if (liftVy !== 0) { defender.vy = liftVy; defender.onGround = false; spawnDust(defender.x, GROUND_Y); }
            if (currentType === 'heavy_slam') { defender.y = GROUND_Y; defender.vy = 0; defender.vx = 0; defender.state = 'stunned'; defender.stunTimer = 60; defender.shieldBreak = 0; }
            
            if (defender.shieldBreak > 0 && defender.state !== 'stunned' && currentType !== 'heavy_slam') {
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

// THANH KỸ NĂNG DỰ PHÒNG HOẠT ĐỘNG 100% KỂ CẢ SHEET TRỐNG
window.playerUseSkill = function(skillType) {
    if (gameOver || !p1 || p1.attackTimer > 0 || p1.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || p1.stunTimer > 0 || introTimer > 0) return;
    let closestEnemy = getClosestEnemy(p1, enemies); if(!closestEnemy) return;
    let gameContext = { floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, dash: (f, fx, vy) => { f.vx = fx; if(vy) f.vy = vy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, addBuff: (f, st, v, fr) => { f.buffs.push({stat: f.state, value: v, life: fr, maxLife: fr}); }, setInvulnerable: (f, fr) => { f.iFrames = fr; } };

    if (skillType === 1 && p1.stamina >= 25) { 
        p1.stamina -= 25; 
        if (p1.skill && p1.skill.actionCode1) { p1.skill.actionCode1(p1, closestEnemy, gameContext); } 
        else { p1.vx = p1.isFacingRight ? 28 : -28; p1.state = 'punch'; p1.attackTimer = 15; takeDamage(closestEnemy, 25 * p1.dmgMod, "#ff9f43", true); }
    }
    if (skillType === 2 && p1.stamina >= 50) { 
        p1.stamina -= 50; 
        if (p1.skill && p1.skill.actionCode2) { p1.skill.actionCode2(p1, closestEnemy, gameContext); } 
        else { p1.state = 'uppercut'; p1.attackTimer = 22; closestEnemy.vy = -15; closestEnemy.onGround = false; takeDamage(closestEnemy, 40 * p1.dmgMod, "#3498db", true); }
    }
    if (skillType === 3 && p1.stamina >= 100) { 
        p1.stamina -= 100; 
        triggerCinematic(p1, () => { 
            if (p1.skill && p1.skill.actionCode3) { p1.skill.actionCode3(p1, closestEnemy, gameContext); } 
            else { p1.superArmor = 30; p1.state = 'heavy_slam'; p1.attackTimer = 30; enemies.forEach(e => { if(Math.abs(e.x - p1.x) < 200) takeDamage(e, 80 * p1.dmgMod, "#e74c3c", true); }); }
        });
    }
}

window.playerDodge = function(fighter = p1) {
    if (gameOver || !fighter || fighter.attackTimer > 0 || fighter.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || fighter.stunTimer > 0 || introTimer > 0) return;
    if (fighter.stamina >= 15) { fighter.stamina -= 15; fighter.state = 'dash_back'; fighter.iFrames = 20; fighter.attackTimer = 15; playSound(300, 'sine', 0.1, 0.1); spawnDust(fighter.x, fighter.y); fighter.x += fighter.isFacingRight ? -35 : 35; spawnDust(fighter.x, fighter.y); shockwaves.push({x: fighter.x, y: fighter.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6}); triggerVibration(20); }
}

function checkGameOver() {
    if (matchResolved) return; let allDead = enemies.length === 0 || enemies.every(e => e.hp <= 0);
    if (p1 && (p1.hp <= 0 || allDead)) {
        matchResolved = true; gameOver = true; let mul = window.rewardMultiplier || 1; 
        if (p1.hp > 0) {
            let winXp = 50 * mul; let winElo = 15 * mul; let winCoins = 50 * mul;
            if(typeof currentPlayer !== 'undefined') { currentPlayer.xp = parseInt(currentPlayer.xp || 0) + winXp; currentPlayer.level = parseInt(currentPlayer.level || 1); currentPlayer.elo = parseInt(currentPlayer.elo || 1000) + winElo; currentPlayer.coins = parseInt(currentPlayer.coins || 0) + winCoins; let xpNeeded = currentPlayer.level * 100; while (currentPlayer.xp >= xpNeeded) { currentPlayer.xp -= xpNeeded; currentPlayer.level += 1; xpNeeded = currentPlayer.level * 100; } }
        } else {
            let loseElo = 10 * mul; let loseCoins = 10 * mul; if(typeof currentPlayer !== 'undefined') { currentPlayer.elo = Math.max(0, parseInt(currentPlayer.elo || 1000) - loseElo); currentPlayer.coins = parseInt(currentPlayer.coins || 0) + loseCoins; }
        }
        if (typeof savePlayerData === 'function') savePlayerData(); if (typeof updatePlayerUI === 'function') updatePlayerUI(); 
        triggerVibration([100, 50, 100]);
        let btnExit = document.querySelector(".control-btns .game-btn"); if (btnExit) { btnExit.innerText = "⏭️"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
    }
}

function updateHPUIs() {
    if (!p1) return; let p1Pct = (p1.hp / p1.maxHp * 100) + "%"; let currentEnemyHp = 0; enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = totalEnemyMaxHp > 0 ? (currentEnemyHp / totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = p1.stamina + "%"; if(h6) h6.style.width = p1.shieldBreak + "%";
    let closestEnemy = getClosestEnemy(p1, enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; }
    checkGameOver(); 
}

function update() {
    if (!canvas) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); } if (!canvas || !ctx || !p1) return; 
    if (uiShakeP1 > 0) { uiShakeP1--; let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w1 = document.getElementById("hp-wrapper-1"); if (w1) w1.style.transform = "none"; }
    if (uiShakeP2 > 0) { uiShakeP2--; let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; } else { let w2 = document.getElementById("hp-wrapper-2"); if (w2) w2.style.transform = "none"; }
    if (introTimer > 0) { introTimer--; if (introTimer === 60) playSound(800, 'square', 0.2, 0.5); return; }

    let isSlowMoFrame = false; if (slowMoTimer > 0) { slowMoTimer--; if (slowMoTimer % 4 !== 0) isSlowMoFrame = true; }
    if (shakeTime > 0) shakeTime--; if (screenFlash > 0) screenFlash -= 0.05;
    if (cinematicTimer > 0 && !isSlowMoFrame) { cinematicTimer--; if (cinematicTimer === 0 && cinematicCallback) { cinematicCallback(); cinematicCallback = null; } return; }
    if (hitStopFrames > 0 && !isSlowMoFrame) { hitStopFrames--; return; } 
    if (isSlowMoFrame) return;

    weatherParticles.forEach(w => { w.y += w.speed; w.x += (currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2; if(w.y > canvas.height + 20) { w.y = -20; w.x = Math.random() * 1200 - 300; } });
    for (let i = shockwaves.length - 1; i >= 0; i--) { let sw = shockwaves[i]; sw.r += sw.speed; sw.alpha -= 0.05; if (sw.alpha <= 0 || sw.r >= sw.maxR) shockwaves.splice(i, 1); }
    for (let i = impactSparks.length - 1; i >= 0; i--) { impactSparks[i].life--; if (impactSparks[i].life <= 0) impactSparks.splice(i, 1); }
    particles.forEach(pt => { if(pt.isCoin) { pt.vy += GRAVITY * 0.5; if (pt.y > GROUND_Y) { pt.y = GROUND_Y; pt.vy *= -0.5; pt.vx *= 0.8; } pt.x += pt.vx; pt.y += pt.vy; } });
    if (Math.random() < 0.12) { particles.push({ x: Math.random() * canvas.width, y: GROUND_Y, vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", size: Math.random() * 3 + 1 }); }

    enemies = enemies.filter(e => { 
        if(e.hp <= 0) { 
            spawnParticles(e.x, e.y, "#fff", true); playSound(300, 'sawtooth', 0.2, 0.2); 
            for(let c=0; c<5; c++) particles.push({ x: e.x, y: e.y - 20, vx: (Math.random()-0.5)*8, vy: -Math.random()*8, life: 60, maxLife: 60, color: "#f1c40f", size: 4, isCoin: true });
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
    allFighters.forEach(f => {
        if (f.attackTimer > 0) f.attackTimer--; if (f.hitStun > 0) f.hitStun--; if (f.stunTimer > 0) f.stunTimer--; if (f.dashTimer > 0) f.dashTimer--; if (f.aiDelay > 0) f.aiDelay--;
        if (f.comboTimeout > 0) { f.comboTimeout--; if (f.comboTimeout === 0) f.comboStep = 0; }
        if (f.superArmor > 0) f.superArmor--; if (f.stunTimer === 0 && f.state === 'stunned') f.shieldBreak = 100;
        
        f.isRage = (f.hp > 0 && f.hp <= f.maxHp * 0.3); f.currentSpeed = f.speed || 3; f.currentDmgMod = f.dmgMod || 1; f.currentRegen = f.regen || 0.3;
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
                        f.aiDelay = Math.floor(Math.random() * 8) + 8; let usedSkill = false;
                        if (!usedSkill) {
                            let rand = Math.random();
                            if (closest.attackTimer > 0 || closest.state === 'dash') {
                                if (rand < 0.6) { f.dashTimer = 10; f.dashDir = -Math.sign(dist); f.state = 'dash_back'; f.iFrames = 10; f.attackTimer = 10; spawnDust(f.x, f.y); } 
                                else if (rand < 0.9) { f.state = 'block'; f.attackTimer = 15; } else { attack(f, targetGroup); }
                            } else {
                                if (rand < 0.85) {
                                    if (f.comboTimer > 0 && f.comboStep < 4) { f.comboStep++; attack(f, targetGroup); } else { f.comboStep = 0; attack(f, targetGroup); } f.comboTimer = 50;
                                } else { if (Math.random() < 0.6) { f.state = 'block'; f.attackTimer = 10; } else { f.vx = -Math.sign(dist) * f.currentSpeed * 1.5; f.state = 'walk'; } }
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
        if (f.x < bounds) { f.x = bounds; if (f.hitStun > 0 && f.vx < -4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }
        if (f.x > 600 - bounds) { f.x = 600 - bounds; if (f.hitStun > 0 && f.vx > 4) { f.vx = -f.vx * 0.4; f.hitStun = 10; shakeScreen(10, 4); takeDamage(f, Math.floor(Math.random() * 4) + 4, "#fff", false, true); playSound(100, 'square', 0.2, 0.3); spawnDust(f.x, f.y); } else if(f.state !== 'walk' && f.state !== 'dash_back') { f.vx = 0; } }
    });

    currentZoom += (targetZoom - currentZoom) * 0.1; if (Math.abs(targetZoom - currentZoom) < 0.01 && targetZoom !== 1) targetZoom = 1;
    for (let i = floatingTexts.length - 1; i >= 0; i--) { let t = floatingTexts[i]; if (t.life !== undefined) { t.vy += GRAVITY * 0.3; t.x += t.vx; t.y += t.vy; t.life--; if (t.life <= 0) t.alpha -= 0.05; } else { t.x += t.vx; t.y += t.vy; t.vy += 0.15; t.alpha -= 0.02; } if (t.alpha <= 0) floatingTexts.splice(i, 1); }
    if(p1 && !gameOver) checkGameOver();
}

// KHÔI PHỤC HÀM VẼ KHÔNG BỊ PHỤ THUỘC VÀO SHEET GÂY TÀNG HÌNH NHÂN VẬT
function draw() {
    if (!canvas) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); } if (!canvas || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save();
    
    try {
        ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(currentZoom, currentZoom); ctx.translate(-canvas.width/2, -canvas.height/2);
        if (slowMoTimer > 0) { 
            let loserX = (p1 && p1.hp <= 0) ? p1.x : (enemies.length > 0 ? enemies[0].x : 300); let targetCamX = (canvas.width / 2) - loserX; camX += (targetCamX - camX) * 0.1; ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(1.2, 1.2); ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); 
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
        ctx.globalCompositeOperation = 'lighter'; shockwaves.forEach(sw => { ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); ctx.lineWidth = 5; ctx.strokeStyle = sw.color; ctx.globalAlpha = Math.max(0, sw.alpha); ctx.stroke(); });
        impactSparks.forEach(isp => { ctx.save(); ctx.translate(isp.x, isp.y); ctx.rotate(isp.angle); ctx.scale(isp.scale, isp.scale); ctx.globalAlpha = isp.life / isp.maxLife; ctx.fillStyle = isp.color; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(3, -5); ctx.lineTo(30, 0); ctx.lineTo(3, 5); ctx.lineTo(0, 30); ctx.lineTo(-3, 5); ctx.lineTo(-30, 0); ctx.lineTo(-3, -5); ctx.closePath(); ctx.fill(); ctx.restore(); }); ctx.globalCompositeOperation = 'source-over';

        if (p1) {
            let allFighters = [p1].concat(enemies); ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => { if (p.trailArr) { p.trailArr.forEach(t => { let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); drawStickman(ctx, trailP, true); }); } });
            ctx.globalCompositeOperation = 'source-over';
            if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; } enemies.forEach(e => drawStickman(ctx, e)); drawStickman(ctx, p1); ctx.shadowBlur = 0;
            if (p1.comboHits >= 2) { ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = "#ff9f43"; ctx.textAlign = "left"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff9f43"; ctx.fillText(`🔥 ${p1.comboHits}`, 30 - camX, 100 + Math.sin(Date.now() / 100) * 5); ctx.restore(); }
        }

        slashes.forEach(s => { ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.globalAlpha = s.life / s.maxLife; ctx.beginPath(); ctx.arc(0, 0, 40, -Math.PI/4, Math.PI/4); ctx.lineWidth = 8; ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.stroke(); ctx.restore(); });
        particles.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); if (pt.isCoin) { ctx.strokeStyle = "#d35400"; ctx.lineWidth = 1; ctx.stroke(); } }); ctx.globalAlpha = 1.0;
        floatingTexts.forEach(t => { ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; ctx.globalAlpha = t.alpha; ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; }); ctx.globalAlpha = 1.0;

        if (screenFlash > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        if (cinematicTimer > 0 && cinematicCaster) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let stripY = canvas.height / 2 - 50; ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
            let progress = (50 - cinematicTimer) / 50; let slideX = -200 + (progress * 800);
            ctx.fillStyle = "#fff"; ctx.font = "italic 900 60px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillText("⚡", slideX, stripY + 70); ctx.shadowBlur = 0;
            let avaX = canvas.width - slideX; let casterClone = Object.assign({}, cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); drawStickman(ctx, casterClone);
        }
        
        if (introTimer > 0 && !gameOver && p1) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.textAlign = "center";
            if (introTimer > 60) {
                let slideProgress = Math.min(1, (160 - introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let slideX1 = -200 + easeOut * (canvas.width / 2 - 120); let slideX2 = canvas.width + 200 - easeOut * (canvas.width / 2 - 120);
                let p1Clone = Object.assign({}, p1, {x: slideX1, y: canvas.height/2 + 30, state: 'idle', isFacingRight: true}); drawStickman(ctx, p1Clone);
                if (enemies && enemies.length > 0) {
                    let repEnemy = enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: canvas.height/2 + 30, state: 'idle', isFacingRight: false}); drawStickman(ctx, p2Clone);
                    if (introTimer < 130 && introTimer > 70) { ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.fillRect(slideX2 - 20, canvas.height/2 - 140, 40, 30); ctx.fillStyle = "#111"; ctx.font = "bold 20px Arial"; ctx.fillText(repEnemy.taunt || "🤖", slideX2, canvas.height/2 - 118); }
                }
                ctx.font = "italic 900 35px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("👤", slideX1, canvas.height/2 + 80);
                let eName = (rewardMultiplier === 15) ? `👹` : (rewardMultiplier > 1 ? `🤖 x${rewardMultiplier}` : "🤖"); ctx.fillStyle = "#1e90ff"; ctx.fillText(eName, slideX2, canvas.height/2 + 80);
                if (introTimer < 130 && introTimer > 70) { ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.fillRect(slideX1 - 20, canvas.height/2 - 140, 40, 30); ctx.fillStyle = "#111"; ctx.font = "bold 20px Arial"; ctx.fillText(p1.taunt || "🔥", slideX1, canvas.height/2 - 118); }
                if (introTimer <= 120) { ctx.font = "italic 900 80px Arial"; ctx.fillStyle = "#f1c40f"; ctx.shadowBlur = 25; ctx.shadowColor = "#f1c40f"; ctx.fillText("🆚", canvas.width/2, canvas.height/2 - 10); ctx.shadowBlur = 0; }
            } else { let scale = 1 + (introTimer / 60); ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale); ctx.font = "italic 900 90px Arial"; ctx.fillStyle = "#ff9f43"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff9f43"; ctx.fillText("🥊", 0, 30); ctx.restore(); }
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { ctx.restore(); }
}

function drawStickman(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = "#fff"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : (p.color || "#fff"); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    let maxT = (p.state === 'punch' || p.state === 'jab' || p.state === 'cross' || p.state === 'hook') ? 15 : (p.state === 'heavy_slam' ? 34 : 25); 
    let pext = 0; let progress = (p.attackTimer > 0) ? 1 - (p.attackTimer / maxT) : 0; let ext = Math.sin(progress * Math.PI); 

    let customDrawSuccess = false;
    // GẮN CHUẨN XÁC MÃ VẼ HÌNH CUSTOM TỪ GOOGLE SHEET VÀO ĐÂY
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        try { 
            p.drawMethod(ctx, p, bounce, ext, pext, isTrail); 
            customDrawSuccess = true;
        } catch (e) { console.error("Lỗi mã vẽ riêng từ Sheet:", e); } 
    }

    if (!customDrawSuccess) {
        let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
        let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
        let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};  

        if (p.state === 'jab') { head.x = 5 * ext; handR.x = 15 + 45 * ext; handR.y = -45 + bounce; handL.x = -10; handL.y = -45 + bounce; } 
        else if (p.state === 'cross') { head.x = 12 * ext; neck.x = 8 * ext; pelvis.x = 4 * ext; handR.x = -5; handR.y = -45 + bounce; handL.x = 15 + 55 * ext; handL.y = -40 + bounce; } 
        else if (p.state === 'hook') { head.x = 6 * ext; handR.x = 15 + 35 * ext; handR.y = -45 - 12 * Math.sin(ext * Math.PI); handL.x = -12; } 
        else if (p.state === 'uppercut') { head.x = 5; head.y = -65 - 10*ext; neck.x = 2; neck.y = -50 - 10*ext; pelvis.x = 0; pelvis.y = -25 - 5*ext; handR = {x: 15 + 10*ext, y: -40 - 50*ext}; elbowR = {x: 10 + 5*ext, y: -30 - 25*ext}; handL = {x: -15, y: -40}; elbowL = {x: -10, y: -30}; footL = {x: -10, y: 0}; footR = {x: 10, y: -10*ext}; } 
        else if (p.state === 'heavy_slam') { head.x = 15 * ext; head.y = -40 + 20*ext; neck.x = 10 * ext; neck.y = -30 + 15*ext; pelvis.x = 5 * ext; pelvis.y = -10 + 10*ext; handR = {x: 30 * ext, y: 0}; elbowR = {x: 25 * ext, y: -15}; handL = {x: 20 * ext, y: 0}; elbowL = {x: 15 * ext, y: -15}; footL = {x: -20, y: 0}; footR = {x: -5, y: 0}; }
        else if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch' && p.state !== 'walk') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
        else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
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

        ctx.shadowBlur = 0; ctx.fillStyle = p.color || "#fff"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    }

    if (!isTrail && p.onGround && p.y >= GROUND_Y) { ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); }
    if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -95, 40, 6); ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -95, 40 * (Math.max(0, p.hp)/p.maxHp), 6); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -95, 40, 6); }
    ctx.restore();
}

window.gameLoop = function(timestamp) { 
    if (!isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - lastFrameTime; 
    if (deltaTime >= FRAME_MIN_TIME) { 
        lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME); 
        try { update(); } catch(e) {console.error(e);} 
        try { draw(); } catch(e) {console.error(e);} 
    } 
}

let gridCheckTimer = setInterval(() => {
    if (typeof window.classStats !== 'undefined' && Object.keys(window.classStats).length > 0) {
        let grid = document.getElementById("character-carousel");
        if (grid && grid.innerHTML.trim() === "" && typeof window.renderCharacterGrid === 'function') {
            window.renderCharacterGrid(); clearInterval(gridCheckTimer); 
        }
    }
}, 100);
