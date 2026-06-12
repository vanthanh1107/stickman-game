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

var p1, p2, gameOver, isLoopRunning = false;
var shakeTime = 0, shakeMag = 0, hitStopFrames = 0;

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

function triggerVibration(pattern) {
    if (typeof window !== 'undefined' && navigator && navigator.vibrate) {
        try { navigator.vibrate(pattern); } catch(e) {}
    }
}

// Gọi từ nút HTML để tắt bật âm thanh
window.toggleAudio = function(e) {
    e.stopPropagation(); 
    isMuted = !isMuted;
    let btn = document.getElementById("btn-audio");
    if(btn) btn.innerText = isMuted ? "🔇" : "🔊";
    if (!isMuted && audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function renderCharacterGrid() {
    const carousel = document.getElementById("character-carousel"); 
    if(!carousel) return;
    carousel.innerHTML = ""; 
    let firstCardId = null;
    for (let id in classStats) {
        let item = classStats[id]; 
        let card = document.createElement("div"); 
        card.className = "char-card"; 
        let avatarSrc = item.avatarUrl || classImages[id] || `https://api.dicebear.com/7.x/adventurer/png?seed=${id}&backgroundColor=ffdfbf`; 
        card.innerHTML = `<div class="char-avatar"><img src="${avatarSrc}"></div><div class="char-name">${item.className}</div>`;
        
        card.onclick = () => { 
            selectedRedClass = id; 
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); 
            card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>⚡ Tốc độ: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Sát thương: <strong>x${item.dmgMod}</strong></span>`; 
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

window.startGame = function() { 
    if(!selectedRedClass) return alert("Vui lòng chọn võ sĩ!"); 
    document.getElementById("selection-screen").style.display = "none"; 
    document.getElementById("game-screen").style.display = "block"; 
    matchStart(); 
    if (!isLoopRunning) { 
        isLoopRunning = true; 
        requestAnimationFrame(gameLoop); 
    } 
}

window.backToMenu = function() { 
    document.getElementById("game-screen").style.display = "none"; 
    document.getElementById("selection-screen").style.display = "block"; 
    gameOver = true; 
    updatePlayerUI(); 
}

function matchStart() {
    let allKeys = Object.keys(classStats); 
    if(allKeys.length === 0) return alert("Dữ liệu Võ Sĩ bị lỗi!"); 
    if (!selectedRedClass || !classStats[selectedRedClass]) { selectedRedClass = allKeys[0]; }
    
    let opponentName = "Máy Xịn"; 
    let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; 
    if (latestPlayersData && latestPlayersData.length > 0) { 
        let randPlayer = latestPlayersData[Math.floor(Math.random() * latestPlayersData.length)]; 
        if(randPlayer && randPlayer.classId && classStats[randPlayer.classId]) { 
            opponentName = randPlayer.name + " (Bóng)"; 
            blueClass = randPlayer.classId; 
        } 
    }
    
    let s1 = classStats[selectedRedClass], s2 = classStats[blueClass];
    document.getElementById("name-display-red").innerText = `${currentPlayer.name} (${s1.className})`; 
    document.getElementById("name-display-blue").innerText = opponentName;
    
    let tauntsP1 = ["Tới đây!", "Sợ chưa?", "Nhào vô!", "Lên luôn!"];
    let tauntsP2 = ["Bỏ cuộc đi!", "Yếu xìu!", "Gà mờ!", "Kết thúc!"];
    
    p1 = { 
        classId: selectedRedClass, isPlayer: true, x: 100, y: GROUND_Y, vx: 0, vy: 0, 
        speed: s1.speed, color: "#ff4757", hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, 
        onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, 
        stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: s1.drawMethod, skill: s1.skill, regen: s1.regen, shield: 0, 
        buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.2, critMult: 1.5, className: s1.className, isRage: false, 
        shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false, 
        taunt: tauntsP1[Math.floor(Math.random()*tauntsP1.length)]
    };
    p2 = { 
        classId: blueClass, isPlayer: false, x: 500, y: GROUND_Y, vx: 0, vy: 0, 
        speed: s2.speed, color: "#1e90ff", hp: s2.hp, maxHp: s2.hp, dmgMod: s2.dmgMod, 
        onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, 
        stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
        drawMethod: s2.drawMethod, skill: s2.skill, regen: s2.regen, shield: 0, 
        buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
        critChance: 0.15, critMult: 1.5, className: s2.className, isRage: false, 
        shieldBreak: 100, stunTimer: 0, superArmor: 0, isExhausted: false,
        taunt: tauntsP2[Math.floor(Math.random()*tauntsP2.length)]
    };

    floatingTexts = []; particles = []; projectiles = []; traps = []; 
    slashes = []; shockwaves = []; impactSparks = [];
    
    shakeTime = 0; hitStopFrames = 0; cinematicTimer = 0; 
    cinematicCaster = null; cinematicCallback = null; 
    camX = 0; screenFlash = 0; slowMoTimer = 0; uiShakeP1 = 0; uiShakeP2 = 0;
    
    matchResolved = false; 
    gameOver = false; 
    introTimer = 160;
    
    let weatherTypes = ['rain', 'snow', 'none', 'none'];
    currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    weatherParticles = [];
    for(let i=0; i<100; i++) { 
        weatherParticles.push({
            x: Math.random() * 1200 - 300, 
            y: Math.random() * 400, 
            speed: (currentWeather === 'rain') ? 15 + Math.random() * 10 : 2 + Math.random() * 3
        }); 
    }
    
    document.getElementById("hp-red").style.width = "100%"; 
    document.getElementById("hp-red-trail").style.width = "100%"; 
    document.getElementById("hp-blue").style.width = "100%"; 
    document.getElementById("hp-blue-trail").style.width = "100%";
    document.getElementById("stun-red").style.width = "100%"; 
    document.getElementById("stun-blue").style.width = "100%";
    
    let p1w = document.getElementById("hp-wrapper-1"); 
    if (p1w) p1w.style.transform = "none";
    let p2w = document.getElementById("hp-wrapper-2"); 
    if (p2w) p2w.style.transform = "none";
}

window.initAudio = function() { 
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    if (!isMuted && audioCtx.state === 'suspended') audioCtx.resume(); 
}

function playSound(freq, type, duration, vol) { 
    if (isMuted || !audioCtx) return; 
    let osc = audioCtx.createOscillator(); 
    let gain = audioCtx.createGain(); 
    osc.connect(gain); 
    gain.connect(audioCtx.destination); 
    osc.type = type; 
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
    gain.gain.setValueAtTime(vol, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); 
    osc.start(); 
    osc.stop(audioCtx.currentTime + duration); 
}

function shakeScreen(frames, magnitude) { 
    shakeTime = frames; shakeMag = magnitude; 
}
function spawnTrap(x, y, radius, color, damage, lifeFrames, owner) { 
    traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); 
}
function spawnProjectile(x, y, vx, vy, radius, color, dmg, target, customOnHit) { 
    projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); 
}
function spawnSlash(x, y, isRight, color, isCrit) { 
    slashes.push({ x: x, y: y, isRight: isRight, life: 10, maxLife: 10, color: isCrit ? "#fff" : color, scale: isCrit ? 1.8 : 1 }); 
}
function spawnParticles(x, y, color, isCrit = false) {
    let count = isCrit ? 30 : 15;
    for(let i=0; i<count; i++) { 
        let angle = Math.random() * Math.PI * 2; 
        let speed = Math.random() * (isCrit?15:8) + 2; 
        particles.push({ 
            x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, 
            life: 20, maxLife: 20, color: color, size: Math.random() * 5 + 2 
        }); 
    }
}
function spawnDust(x, y) {
    for(let i=0; i<8; i++) { 
        particles.push({ 
            x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*3, vy: -Math.random()*3, 
            life: 15, maxLife: 15, color: "rgba(200, 200, 200, 0.5)", size: Math.random() * 8 + 4 
        }); 
    }
}
function spawnSweat(x, y) {
    particles.push({ 
        x: x + (Math.random()*20-10), y: y, vx: 0, vy: Math.random()*2 + 1, 
        life: 15, maxLife: 15, color: "#74b9ff", size: Math.random()*3 + 1 
    });
}

function takeDamage(target, amount, text, color, isCrit = false, isWallBounce = false) {
    if (target.iFrames > 0 && !isWallBounce) { 
        floatingTexts.push({ x: target.x, y: target.y - 80, text: "MISS", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" }); 
        return; 
    }
    if (target.shield > 0 && !isWallBounce) { 
        target.shield--; 
        floatingTexts.push({ x: target.x, y: target.y - 80, text: `🛡️ ĐỠ!`, color: "#3498db", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" }); 
        spawnParticles(target.x, target.y, "#3498db"); 
        return; 
    }
    
    let actualDmg = amount;
    if (target.hp - amount <= 0 && !matchResolved) { 
        actualDmg = target.hp; 
        slowMoTimer = 120; 
        screenFlash = 0.8; 
        playSound(150, 'square', 1.0, 0.5); 
    }
    target.hp -= actualDmg; 
    if(target.hp < 0) target.hp = 0;
    
    let hitWord = text || `-${Math.round(actualDmg)}`;
    if (isCrit && !isWallBounce) { 
        hitWord = "CRITICAL!"; 
        screenFlash = 0.5; 
        shockwaves.push({x: target.x, y: target.y - 30, r: 10, maxR: 120, color: "#f1c40f", alpha: 1, speed: 8}); 
        triggerVibration([40, 30, 40]); 
    } 
    if (isWallBounce) { 
        hitWord = "💥 ĐẬP TƯỜNG!"; 
        screenFlash = 0.2; 
        shockwaves.push({x: target.x, y: target.y, r: 10, maxR: 150, color: "#fff", alpha: 1, speed: 10}); 
        triggerVibration(60); 
    } 
    
    let dynamicSize = Math.min(45, 18 + actualDmg * 0.4); 
    let fontStyle = (isCrit || isWallBounce || actualDmg >= target.maxHp*0.1) ? `900 ${dynamicSize + 8}px Arial` : `bold ${dynamicSize}px Arial`;
    let rndX = (Math.random() - 0.5) * 40; 
    let rndY = -Math.random() * 30 - 50;
    
    floatingTexts.push({ 
        x: target.x + rndX, y: target.y + rndY, text: hitWord, color: isCrit ? "#f1c40f" : color, 
        alpha: 1, vx: (Math.random() - 0.5) * 4, vy: isCrit ? -5 : -3, font: fontStyle 
    });
    
    if (!isWallBounce && amount > 0) {
        impactSparks.push({
            x: target.x, y: target.y - 30, life: 10, maxLife: 10, angle: Math.random() * Math.PI, 
            color: isCrit ? "#fff" : "#ff9f43", scale: isCrit ? 2 : 1
        });
        if (target === p1) uiShakeP1 = 15; else uiShakeP2 = 15;
    }

    spawnParticles(target.x, target.y, isCrit ? "#f1c40f" : color, isCrit); 
    updateHPUIs();
}

function triggerCinematic(caster, callback) { 
    cinematicTimer = 50; 
    cinematicCaster = caster; 
    cinematicCallback = callback; 
    playSound(600, 'sawtooth', 0.8, 0.3); 
}

// Bắt sự kiện xuất chiêu người chơi
window.playerUseSkill = function(skillType) {
    if (gameOver || !p1 || p1.attackTimer > 0 || p1.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || p1.stunTimer > 0 || introTimer > 0) return;
    
    let gameContext = { 
        floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, 
        dash: (f, fx, fy) => { 
            f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); 
        }, 
        teleport: (f, dx, dy) => { 
            spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); 
        }, 
        addBuff: (f, stat, val, fr) => { 
            f.buffs.push({stat: stat, value: val, life: fr, maxLife: fr}); 
        }, 
        setInvulnerable: (f, fr) => { f.iFrames = fr; } 
    };

    if (skillType === 1 && p1.stamina >= 25 && p1.skill.actionCode1) { 
        p1.stamina -= 25; 
        p1.skill.actionCode1(p1, p2, gameContext); 
        p1.state = 'punch'; 
        p1.attackTimer = 15; 
    }
    if (skillType === 2 && p1.stamina >= 50 && p1.skill.actionCode2) { 
        p1.stamina -= 50; 
        p1.skill.actionCode2(p1, p2, gameContext); 
        p1.state = 'kick'; 
        p1.attackTimer = 20; 
    }
    if (skillType === 3 && p1.stamina >= 100 && p1.skill.actionCode3) { 
        p1.stamina -= 100; 
        triggerCinematic(p1, () => { 
            p1.superArmor = 25; 
            p1.skill.actionCode3(p1, p2, gameContext); 
            p1.state = 'cast'; 
            p1.attackTimer = 25; 
        }); 
    }
}

window.playerDodge = function() {
    if (gameOver || !p1 || p1.attackTimer > 0 || p1.hitStun > 0 || cinematicTimer > 0 || slowMoTimer > 0 || p1.stunTimer > 0 || introTimer > 0) return;
    if (p1.stamina >= 15) { 
        p1.stamina -= 15; 
        p1.state = 'dash_back'; 
        p1.iFrames = 20; 
        p1.attackTimer = 15; 
        playSound(300, 'sine', 0.1, 0.1); 
        spawnDust(p1.x, p1.y); 
        p1.x += p1.isFacingRight ? -60 : 60; 
        spawnDust(p1.x, p1.y);
        shockwaves.push({x: p1.x, y: p1.y - 20, r: 10, maxR: 60, color: "#bdc3c7", alpha: 0.6, speed: 6});
        triggerVibration(20);
    }
}

function attack(attacker, defender, type) {
    if (attacker.attackTimer > 0 || attacker.hitStun > 0 || attacker.state === 'dash_back' || attacker.stunTimer > 0) return; 
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
        // CƠ CHẾ PARRY
        if (defender.state === 'dash_back' && defender.iFrames > 10) {
            defender.stamina = Math.min(100, defender.stamina + 35); 
            attacker.hitStun = 40; 
            attacker.state = 'hurt'; 
            attacker.vx = attacker.isFacingRight ? -8 : 8; 
            screenFlash = 0.4; 
            playSound(500, 'sine', 0.2, 0.4);
            shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 150, color: "#f39c12", alpha: 1, speed: 12});
            floatingTexts.push({ x: defender.x, y: defender.y - 90, text: "⚔️ PARRY!", color: "#f39c12", alpha: 1, vx: 0, vy: -2, font: "900 26px Arial" });
            attacker.comboHits = 0; 
            triggerVibration([50, 50, 100]); 
            return;
        }

        let isCrit = Math.random() < attacker.critChance;
        spawnSlash(defender.x + (attacker.isFacingRight ? -20 : 20), defender.y - 30, attacker.isFacingRight, attacker.color, isCrit);
        if (isCrit) hitStopFrames = 6; else if (type === 'kick') hitStopFrames = 3;

        setTimeout(() => {
            if (gameOver || attacker.hitStun > 0 || attacker.stunTimer > 0) return; 
            let dmg = (type === 'punch') ? (6 * (attacker.currentDmgMod || 1)) : (10 * (attacker.currentDmgMod || 1));
            let comboBonus = 1 + (attacker.comboHits * 0.05); 
            dmg = dmg * comboBonus;
            if (defender.state === 'stunned') dmg *= 1.5;
            if (isCrit) dmg *= attacker.critMult; 
            dmg = Math.floor(dmg + Math.random() * 3); 

            if (defender.superArmor > 0) {
                takeDamage(defender, dmg, null, "#fff", isCrit);
                floatingTexts.push({ x: defender.x, y: defender.y - 100, text: "BÁ THỂ!", color: "#e74c3c", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial" });
                spawnParticles(defender.x, defender.y, "#e74c3c"); 
                attacker.comboHits++; 
                attacker.comboTimeout = 120; 
                return; 
            }

            if (defender.state === 'block') {
                dmg = Math.floor(dmg * 0.2); 
                playSound(500, 'triangle', 0.1, 0.1); 
                defender.vx = attacker.isFacingRight ? 5 : -5; 
                attacker.comboHits = 0; 
            } else if (defender.state === 'dash_back' && defender.iFrames > 0) {
                floatingTexts.push({ x: defender.x, y: defender.y - 80, text: "NÉ TRƯỢT!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "bold 20px Arial" }); 
                attacker.comboHits = 0; 
            } else {
                playSound(150, 'sawtooth', 0.1, 0.2); 
                shakeScreen(isCrit ? 10 : 5, isCrit ? 8 : ((type==='kick')? 6:3));
                takeDamage(defender, dmg, null, "#fff", isCrit); 
                defender.hitStun = 12; 
                defender.state = 'hurt';
                if (type === 'kick' || isCrit) { 
                    defender.vx = attacker.isFacingRight ? 35 : -35; 
                    spawnDust(defender.x, defender.y); 
                } else { 
                    defender.vx = attacker.isFacingRight ? 12 : -12; 
                }
                
                if (defender.state !== 'stunned') {
                    defender.shieldBreak -= isCrit ? 35 : 15;
                    if (defender.shieldBreak <= 0) {
                        defender.shieldBreak = 0; 
                        defender.stunTimer = 90; 
                        defender.state = 'stunned'; 
                        defender.vx = 0;
                        takeDamage(defender, 0, "⚡ SHIELD BREAK!", "#00d2d3");
                        shockwaves.push({x: defender.x, y: defender.y - 30, r: 10, maxR: 100, color: "#00d2d3", alpha: 1, speed: 8});
                    }
                }
                attacker.comboHits++; 
                attacker.comboTimeout = 120; 
                defender.comboHits = 0; 
            }
        }, (type === 'punch') ? 50 : 80); 
    } else { 
        attacker.comboHits = 0; 
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
            currentPlayer.elo = parseInt(currentPlayer.elo || 1000) + 15; 
            currentPlayer.coins = parseInt(currentPlayer.coins || 0) + 50;
            
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
            triggerVibration([100, 50, 100, 50, 300]);
            setTimeout(() => { 
                alert(`🎉 CHÚC MỪNG!\nNhận 50 Vàng và +15 ELO` + (isLevelUp ? `\nLên LEVEL ${currentPlayer.level}!` : "")); 
                backToMenu(); 
            }, 2500); 
        } else {
            currentPlayer.elo = Math.max(0, parseInt(currentPlayer.elo || 1000) - 10); 
            currentPlayer.coins = parseInt(currentPlayer.coins || 0) + 10; 
            savePlayerData(); 
            updatePlayerUI(); 
            triggerVibration([300, 100, 400]);
            setTimeout(() => { 
                alert(`💀 BẠN ĐÃ BỊ HẠ GỤC!\nNhận an ủi 10 Vàng, trừ 10 ELO`); 
                backToMenu(); 
            }, 2500);
        }
    }
}

function updateHPUIs() {
    if (!p1 || !p2) return;
    let p1Pct = (p1.hp / p1.maxHp * 100) + "%"; 
    let p2Pct = (p2.hp / p2.maxHp * 100) + "%";
    
    document.getElementById("hp-red").style.width = p1Pct; 
    document.getElementById("hp-red-trail").style.width = p1Pct; 
    
    document.getElementById("hp-blue").style.width = p2Pct; 
    document.getElementById("hp-blue-trail").style.width = p2Pct;
    
    document.getElementById("stamina-red").style.width = p1.stamina + "%"; 
    document.getElementById("stamina-blue").style.width = p2.stamina + "%";
    
    document.getElementById("stun-red").style.width = p1.shieldBreak + "%"; 
    document.getElementById("stun-blue").style.width = p2.shieldBreak + "%";
    
    checkGameOver(); 
}

function update() {
    if (!p1 || !p2) return;

    if (uiShakeP1 > 0) { 
        uiShakeP1--; 
        let w1 = document.getElementById("hp-wrapper-1"); 
        if (w1) w1.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; 
    } else { 
        let w1 = document.getElementById("hp-wrapper-1"); 
        if (w1) w1.style.transform = "none"; 
    }
    
    if (uiShakeP2 > 0) { 
        uiShakeP2--; 
        let w2 = document.getElementById("hp-wrapper-2"); 
        if (w2) w2.style.transform = `translate(${(Math.random()*6-3)}px, ${(Math.random()*6-3)}px)`; 
    } else { 
        let w2 = document.getElementById("hp-wrapper-2"); 
        if (w2) w2.style.transform = "none"; 
    }

    if (introTimer > 0) {
        introTimer--;
        if (introTimer === 60) playSound(800, 'square', 0.2, 0.5); 
        return;
    }

    let isSlowMoFrame = false; 
    if (slowMoTimer > 0) { 
        slowMoTimer--; 
        if (slowMoTimer % 4 !== 0) isSlowMoFrame = true; 
    }
    
    if (shakeTime > 0) shakeTime--; 
    if (screenFlash > 0) screenFlash -= 0.05;
    
    if (cinematicTimer > 0 && !isSlowMoFrame) { 
        cinematicTimer--; 
        if (cinematicTimer === 0 && cinematicCallback) { 
            cinematicCallback(); 
            cinematicCallback = null; 
        } 
        return; 
    }
    
    if (hitStopFrames > 0 && !isSlowMoFrame) { 
        hitStopFrames--; 
        return; 
    } 
    
    weatherParticles.forEach(w => {
        w.y += w.speed;
        w.x += (currentWeather === 'rain') ? -2 : Math.sin(w.y/50)*2;
        if(w.y > canvas.height + 20) {
            w.y = -20;
            w.x = Math.random() * 1200 - 300;
        }
    });

    for (let i = shockwaves.length - 1; i >= 0; i--) { 
        let sw = shockwaves[i]; 
        if (!isSlowMoFrame) sw.r += sw.speed; 
        sw.alpha -= 0.05; 
        if (sw.alpha <= 0 || sw.r >= sw.maxR) shockwaves.splice(i, 1); 
    }
    
    for (let i = impactSparks.length - 1; i >= 0; i--) { 
        impactSparks[i].life--; 
        if (impactSparks[i].life <= 0) impactSparks.splice(i, 1); 
    }

    if (isSlowMoFrame) return;

    if (Math.random() < 0.12) { 
        particles.push({ 
            x: Math.random() * canvas.width, y: GROUND_Y, 
            vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 2 - 0.5, 
            life: 40, maxLife: 40, color: "rgba(255, 159, 67, 0.35)", 
            size: Math.random() * 3 + 1 
        }); 
    }

    [p1, p2].forEach(p => {
        if (!p.trailArr) p.trailArr = [];
        if ((p.state === 'dash' || p.state === 'dash_back' || p.isRage) && Math.abs(p.vx) > 1) { 
            p.trailArr.push({x: p.x, y: p.y, state: p.state, isFacingRight: p.isFacingRight, alpha: 0.5, classId: p.classId, color: p.color}); 
        }
        for (let i = p.trailArr.length - 1; i >= 0; i--) { 
            p.trailArr[i].alpha -= 0.05; 
            if (p.trailArr[i].alpha <= 0) p.trailArr.splice(i, 1); 
        }
    });

    [p1, p2].forEach(p => {
        if (p.hp <= 0 && gameOver) { 
            p.state = 'hurt'; 
            p.vx *= 0.95; 
            p.x += p.vx; 
            return; 
        }
        let enemy = (p === p1) ? p2 : p1;

        if (p.stunTimer > 0) { 
            p.stunTimer--; 
            p.state = 'stunned'; 
            p.vx = 0; 
            if (p.stunTimer === 0) p.shieldBreak = 100; 
        }
        
        if (p.superArmor > 0) p.superArmor--;

        if (p.attackTimer > 0) p.attackTimer--; 
        if (p.hitStun > 0) p.hitStun--; 
        if (p.iFrames > 0) p.iFrames--;
        if (p.comboTimer > 0) p.comboTimer--; 
        if (p.dashTimer > 0) p.dashTimer--; 
        if (p.aiDelay > 0) p.aiDelay--;
        if (p.comboTimeout > 0) { 
            p.comboTimeout--; 
            if (p.comboTimeout === 0) p.comboHits = 0; 
        }

        if (p.stamina < 10) p.isExhausted = true;
        if (p.stamina > 40) p.isExhausted = false;

        p.isRage = (p.hp > 0 && p.hp <= p.maxHp * 0.3);
        p.currentDmgMod = p.dmgMod || 1; 
        p.currentSpeed = p.speed || 3; 
        p.currentRegen = p.regen || 0.3;
        
        if (p.isRage) { 
            p.currentDmgMod *= 1.2; 
            p.currentSpeed *= 1.2; 
            p.currentRegen += 0.2; 
            if (Math.random() < 0.2) spawnParticles(p.x, p.y - 20, "rgba(255, 71, 87, 0.4)"); 
        }
        
        if (p.isExhausted) {
            p.currentSpeed *= 0.6;
            if (Math.random() < 0.05) spawnSweat(p.x, p.y - 40);
        }

        for (let i = p.buffs.length - 1; i >= 0; i--) {
            let b = p.buffs[i]; 
            b.life--; 
            if (b.life <= 0) { p.buffs.splice(i, 1); continue; }
            if (b.stat === 'dmg') p.currentDmgMod += b.value; 
            if (b.stat === 'speed') p.currentSpeed += b.value; 
            if (b.stat === 'regen') p.currentRegen += b.value;
            if (b.life % 15 === 0) particles.push({ x: p.x + (Math.random()*20-10), y: p.y - 10, vx: 0, vy: -2, life: 10, maxLife: 10, color: "#f1c40f", size: 2 });
        }

        p.vy += GRAVITY; 
        p.y += p.vy; 
        if (p.y >= GROUND_Y) { 
            p.y = GROUND_Y; 
            p.vy = 0; 
            p.onGround = true; 
        }
        
        if(isNaN(p.x)) p.x = 100; 
        if(isNaN(p.vx)) p.vx = 0;
        
        if (p.dashTimer > 0) { 
            p.vx = p.dashDir * p.currentSpeed * 2.5; 
            if (p.onGround && Math.random() < 0.5) spawnDust(p.x, p.y); 
        } else { 
            if (p.state !== 'walk' && p.state !== 'dash' && p.state !== 'dash_back' && p.onGround) p.vx *= 0.85; 
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
        
        if (p.x < 30) { 
            p.x = 30; 
            if (p.hitStun > 0 && p.vx < -4) { 
                p.vx = -p.vx * 0.4; 
                p.hitStun = 10; 
                shakeScreen(10, 4); 
                let bounceDmg = Math.floor(Math.random() * 4) + 4; 
                takeDamage(p, bounceDmg, null, "#fff", false, true); 
                playSound(100, 'square', 0.2, 0.3); 
                spawnDust(p.x, p.y); 
            } else { 
                p.vx = 0; 
            } 
        }
        
        if (p.x > canvas.width - 30) { 
            p.x = canvas.width - 30; 
            if (p.hitStun > 0 && p.vx > 4) { 
                p.vx = -p.vx * 0.4; 
                p.hitStun = 10; 
                shakeScreen(10, 4); 
                let bounceDmg = Math.floor(Math.random() * 4) + 4; 
                takeDamage(p, bounceDmg, null, "#fff", false, true); 
                playSound(100, 'square', 0.2, 0.3); 
                spawnDust(p.x, p.y); 
            } else { 
                p.vx = 0; 
            } 
        }

        if (p.attackTimer === 0 && p.hitStun === 0 && p.onGround && p.dashTimer <= 0 && p.stunTimer <= 0) p.state = 'idle';
        p.stamina = Math.min(100, p.stamina + p.currentRegen);

        if (p === p1) {
            let b1 = document.getElementById("btn-s1"), b2 = document.getElementById("btn-s2"), b3 = document.getElementById("btn-s3"), bDodge = document.getElementById("btn-dodge");
            if (b1 && b2 && b3 && bDodge) { 
                b1.className = (p.stamina >= 25) ? "skill-btn s1-ready" : "skill-btn"; 
                b2.className = (p.stamina >= 50) ? "skill-btn s2-ready" : "skill-btn"; 
                b3.className = (p.stamina >= 100) ? "skill-btn s3-ready" : "skill-btn"; 
                bDodge.className = (p.stamina >= 15) ? "skill-btn s-dodge-ready" : "skill-btn"; 
            }
        }

        let gameContext = { 
            floatingTexts, projectiles, traps, spawnTrap, spawnParticles, spawnProjectile, playSound, shakeScreen, takeDamage, updateHPUIs, 
            dash: (f, fx, fy) => { f.vx = fx; if(fy) f.vy = fy; f.state = 'dash'; f.attackTimer = 15; f.iFrames = 10; spawnParticles(f.x, f.y, "#bdc3c7"); }, 
            teleport: (f, dx, dy) => { spawnParticles(f.x, f.y, "#8e44ad"); f.x = dx; if(dy) f.y = dy; f.state = 'cast'; f.attackTimer = 10; spawnParticles(f.x, f.y, "#8e44ad"); }, 
            addBuff: (f, st, v, fr) => { f.buffs.push({stat: st, value: v, life: fr, maxLife: fr}); }, 
            setInvulnerable: (f, fr) => { f.iFrames = fr; } 
        };

        if (p.attackTimer === 0 && p.hitStun === 0 && p.dashTimer <= 0 && p.stunTimer <= 0 && !gameOver) {
            let dist = enemy.x - p.x; 
            p.isFacingRight = dist > 0; 
            let absDist = Math.abs(dist);
            
            if (p.aiDelay <= 0) {
                p.aiDelay = Math.floor(Math.random() * 5) + 3; 
                let usedSkill = false;
                
                if (!p.isPlayer && p.skill) {
                    if (p.stamina >= 100 && p.skill.actionCode3) { 
                        p.stamina -= 100; 
                        usedSkill = true; 
                        triggerCinematic(p, () => { 
                            p.superArmor = 25; 
                            try { 
                                p.skill.actionCode3(p, enemy, gameContext); 
                                if(p.state==='idle') { p.state = 'cast'; p.attackTimer = 15; } 
                            } catch (e) {} 
                        }); 
                    }
                    else if (p.stamina >= 50 && p.skill.actionCode2 && Math.random() < 0.05) { 
                        p.stamina -= 50; 
                        try { 
                            p.skill.actionCode2(p, enemy, gameContext); 
                            usedSkill = true; 
                            if(p.state==='idle') { p.state = 'kick'; p.attackTimer = 20; } 
                        } catch (e) {} 
                    }
                    else if (p.stamina >= 25 && p.skill.actionCode1 && Math.random() < 0.03) { 
                        p.stamina -= 25; 
                        try { 
                            p.skill.actionCode1(p, enemy, gameContext); 
                            usedSkill = true; 
                            if(p.state==='idle') { p.state = 'punch'; p.attackTimer = 12; } 
                        } catch (e) {} 
                    }
                }
                
                if (!usedSkill && !p.isPlayer) {
                    if (absDist > 60) { 
                        p.vx += Math.sign(dist) * p.currentSpeed * 0.4; 
                        if(Math.abs(p.vx) > p.currentSpeed) p.vx = Math.sign(p.vx) * p.currentSpeed; 
                        p.state = 'walk'; 
                        if(Math.random() < 0.1) spawnDust(p.x, p.y);
                    } else { 
                        let rand = Math.random();
                        if (enemy.attackTimer > 0 || enemy.state === 'dash') {
                            if (rand < 0.6) { 
                                p.dashTimer = 12; p.dashDir = -Math.sign(dist); p.state = 'dash_back'; 
                                p.iFrames = 12; p.attackTimer = 12; spawnDust(p.x, p.y); 
                            } 
                            else if (rand < 0.9) { p.state = 'block'; p.attackTimer = 15; } 
                            else { attack(p, enemy, 'punch'); p.vx = Math.sign(dist) * 2; }
                        } else {
                            const COMBO_WINDOW = 35; 
                            let decidedToAttack = (rand < 0.85);
                            if (decidedToAttack) {
                                if (p.comboTimer > 0 && p.comboStep < 2) { 
                                    p.comboStep++; 
                                    if (p.comboStep === 1) { attack(p, enemy, 'punch'); p.vx = Math.sign(dist) * 4; } 
                                    else if (p.comboStep === 2) { attack(p, enemy, 'kick'); p.vx = Math.sign(dist) * 6; } 
                                } 
                                else { p.comboStep = 0; attack(p, enemy, 'punch'); p.vx = Math.sign(dist) * 2; } 
                                p.comboTimer = COMBO_WINDOW;
                            } else { 
                                if (Math.random() < 0.6) { p.state = 'block'; p.attackTimer = 10; } 
                                else { p.vx = -Math.sign(dist) * p.currentSpeed * 1.5; } 
                            }
                        }
                    }
                }
            }
        }
    });

    for (let i = projectiles.length - 1; i >= 0; i--) { 
        let proj = projectiles[i]; 
        proj.x += proj.vx; 
        proj.y += proj.vy; 
        let dx = proj.x - proj.target.x; 
        let dy = proj.y - proj.target.y; 
        if (Math.sqrt(dx*dx + dy*dy) < proj.radius + 20) { 
            if(proj.onHit) proj.onHit(); 
            takeDamage(proj.target, proj.dmg, `🎇 -${proj.dmg}`, "#9b59b6"); 
            shakeScreen(8, 4); 
            projectiles.splice(i, 1); 
        } else if (proj.x < -100 || proj.x > canvas.width + 100 || proj.y < -100 || proj.y > canvas.height + 100) { 
            projectiles.splice(i, 1); 
        } 
    }
    
    for (let i = traps.length - 1; i >= 0; i--) { 
        let t = traps[i]; 
        t.life--; 
        if (t.life <= 0) { traps.splice(i, 1); continue; } 
        let enemy = (t.owner === p1) ? p2 : p1; 
        let dx = enemy.x - t.x; 
        let dy = enemy.y - t.y; 
        if (Math.sqrt(dx*dx + dy*dy) < 20 + t.radius && t.life % 30 === 0) { 
            takeDamage(enemy, t.damage, `🤢 -${t.damage}`, t.color); 
        } 
    }
    
    for (let i = particles.length - 1; i >= 0; i--) { 
        let pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; pt.life--; 
        if (pt.life <= 0) particles.splice(i, 1); 
    }
    
    for (let i = slashes.length - 1; i >= 0; i--) { 
        slashes[i].life--; 
        if (slashes[i].life <= 0) slashes.splice(i, 1); 
    }
    
    for (let i = floatingTexts.length - 1; i >= 0; i--) { 
        let t = floatingTexts[i]; 
        t.x += t.vx; 
        t.y += t.vy; 
        t.vy += 0.15; 
        t.alpha -= 0.02; 
        if (t.alpha <= 0) floatingTexts.splice(i, 1); 
    }
}

// BỘ VẼ NHÂN VẬT AVATAR MỚI THAY STICKMAN
function drawCharacter(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return;
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    if (!p.isFacingRight) ctx.scale(-1, 1);
    
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
            console.error("Lỗi thực thi mã drawCode:", e); 
        } 
    }
    
    if (p.state === 'dash' || p.state === 'dash_back') bounce = -10; 
    if (!p.onGround) bounce = -20;
    
    let s = 1; 
    if (p.state === 'punch') { bounce -= 5; s = 1.1; } 
    if (p.state === 'kick') { bounce -= 10; s = 1.15; } 
    if (p.state === 'hurt' || p.state === 'stunned') { 
        bounce = -5; 
        if(p.state==='stunned') bounce += Math.sin(Date.now()/30)*3; 
        ctx.rotate(p.state==='stunned'? 0.1 : -0.2); 
    }

    let imgSize = 70 * s;

    // Vẽ Bóng đổ
    if (!isTrail && p.y >= GROUND_Y) { 
        ctx.save(); 
        ctx.scale(1, -0.3); 
        ctx.globalAlpha = 0.2; 
        let img = imageCache[p.classId]; 
        if (img && img.complete) { ctx.drawImage(img, -imgSize/2, -imgSize - 10, imgSize, imgSize); } 
        ctx.restore();
    }

    if (isTrail) { 
        ctx.globalAlpha = 0.3; 
    } else { 
        ctx.fillStyle = "rgba(0,0,0,0.5)"; 
        ctx.beginPath(); 
        let shadowW = Math.max(10, 25 - (GROUND_Y - p.y) * 0.2); 
        ctx.ellipse(0, GROUND_Y - p.y, shadowW, 6, 0, 0, Math.PI*2); 
        ctx.fill(); 
        if (p.iFrames > 0) ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.5; 
    }

    let img = imageCache[p.classId];
    if (img && img.complete) {
        ctx.drawImage(img, -imgSize/2, -imgSize + bounce + 10, imgSize, imgSize);
        ctx.fillStyle = p.color;
        if (p.state === 'punch') { 
            ctx.beginPath(); ctx.arc(imgSize/2 + 5, -imgSize/2 + bounce, 12, 0, Math.PI*2); ctx.fill(); 
        } else if (p.state === 'kick') { 
            ctx.beginPath(); ctx.arc(imgSize/2 + 10, -10 + bounce, 15, 0, Math.PI*2); ctx.fill(); 
        } else if (p.state === 'block') { 
            ctx.beginPath(); ctx.arc(0, -imgSize/2 + bounce + 10, imgSize/2 + 10, -Math.PI/2.5, Math.PI/2.5); 
            ctx.lineWidth = 6; ctx.strokeStyle = "rgba(52, 152, 219, 0.9)"; ctx.stroke(); 
            ctx.fillStyle = "rgba(52, 152, 219, 0.3)"; ctx.fill(); 
        }
        if (p.state === 'stunned') { 
            ctx.fillStyle = "#f1c40f"; ctx.font = "14px Arial"; 
            let rotX = Math.sin(Date.now()/100) * 15; 
            ctx.fillText("💫", rotX, -imgSize + bounce - 5); 
        }
    } else { 
        // Fallback vẽ tay chân tròn
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, -35 + bounce, 25 * s, 0, Math.PI*2); ctx.fill(); 
    }
    
    // Shield
    if (!isTrail && p.shield > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); 
        ctx.fillStyle = "rgba(52, 152, 219, 0.2)"; ctx.fill(); 
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(52, 152, 219, 0.9)"; ctx.stroke(); 
    }
    
    // Bá thể
    if (p.superArmor > 0) { 
        ctx.beginPath(); ctx.arc(0, -imgSize/2 + bounce, imgSize/2 + 5, 0, Math.PI * 2); 
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); 
        ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); 
    }
    
    ctx.restore();
}

function drawAnnouncer(ctx, text, color, x, y, size = 32) { 
    ctx.save(); 
    ctx.font = `italic 900 ${size}px Arial`; ctx.textAlign = "center"; 
    ctx.lineWidth = 4; ctx.strokeStyle = "#111"; ctx.strokeText(text, x, y); 
    ctx.fillStyle = color; ctx.shadowBlur = 15; ctx.shadowColor = color; 
    ctx.fillText(text, x, y); 
    ctx.restore(); 
}

function draw() {
    if(!ctx) {
        canvas = document.getElementById("battleCanvas");
        if(canvas) ctx = canvas.getContext("2d");
        if(!ctx) return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.save();
    
    if (slowMoTimer > 0) { 
        let loser = (p1.hp <= 0) ? p1 : p2; 
        let targetCamX = (canvas.width / 2) - loser.x; 
        camX += (targetCamX - camX) * 0.1; 
        ctx.translate(canvas.width/2, canvas.height/2); 
        ctx.scale(1.2, 1.2); 
        ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); 
    } else if (p1 && p2 && !gameOver && introTimer === 0) { 
        let centerX = (p1.x + p2.x) / 2; 
        let targetCamX = (canvas.width / 2) - centerX; 
        targetCamX = Math.max(-60, Math.min(60, targetCamX)); 
        camX += (targetCamX - camX) * 0.1; 
        ctx.translate(camX, 0); 
    }
    
    if (shakeTime > 0) ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag); 

    // Background lớp sau
    ctx.fillStyle = "#1e272e"; 
    ctx.fillRect(-200, -100, canvas.width + 400, canvas.height + 100);
    
    ctx.save(); 
    ctx.translate(camX * 0.2, 0); 
    ctx.fillStyle = "#2f3640"; 
    for(let i = -500; i < canvas.width + 500; i += 120) { ctx.fillRect(i, GROUND_Y - 150 + Math.sin(i)*30, 80, 150); } 
    ctx.restore();
    
    // Background lớp trước
    ctx.save(); 
    ctx.translate(camX * 0.5, 0); 
    ctx.fillStyle = "#353b48"; 
    for(let i = -500; i < canvas.width + 500; i += 90) { 
        ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i + 45, GROUND_Y - 100); ctx.lineTo(i + 90, GROUND_Y); ctx.fill(); 
    } 
    ctx.restore();

    // Sàn đấu
    ctx.fillStyle = "#111"; 
    ctx.fillRect(-200, GROUND_Y, canvas.width + 400, canvas.height - GROUND_Y);
    ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 4; 
    ctx.beginPath(); ctx.moveTo(-200, GROUND_Y); ctx.lineTo(canvas.width + 200, GROUND_Y); ctx.stroke();
    
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2; 
    for(let i = -200; i < canvas.width + 200; i+=50) { 
        ctx.beginPath(); ctx.moveTo(i, GROUND_Y); ctx.lineTo(i - 20, canvas.height); ctx.stroke(); 
    }
    
    ctx.fillStyle = "#ff4757"; ctx.fillRect(10, 0, 5, canvas.height); 
    ctx.fillStyle = "#1e90ff"; ctx.fillRect(canvas.width - 15, 0, 5, canvas.height); 

    // Thời tiết
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    weatherParticles.forEach(w => {
        if (currentWeather === 'snow') {
            ctx.beginPath(); ctx.arc(w.x + camX * 0.8, w.y, 2, 0, Math.PI*2); ctx.fill();
        } else if (currentWeather === 'rain') {
            ctx.beginPath(); ctx.moveTo(w.x + camX * 0.8, w.y); ctx.lineTo(w.x - 5 + camX * 0.8, w.y + 15); ctx.stroke();
        }
    });
    ctx.restore();

    traps.forEach(t => { 
        ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); 
        ctx.fillStyle = t.color; ctx.globalAlpha = (t.life / t.maxLife) * 0.5; ctx.fill(); ctx.globalAlpha = 1.0; 
    });
    
    projectiles.forEach(proj => { 
        ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); 
        ctx.fillStyle = proj.color; ctx.fill(); ctx.shadowBlur = 10; ctx.shadowColor = proj.color; ctx.shadowBlur = 0;
    });

    ctx.globalCompositeOperation = 'lighter';
    shockwaves.forEach(sw => { 
        ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); 
        ctx.lineWidth = 5; ctx.strokeStyle = sw.color; ctx.globalAlpha = Math.max(0, sw.alpha); ctx.stroke(); 
    });
    
    impactSparks.forEach(isp => {
        ctx.save(); 
        ctx.translate(isp.x, isp.y); ctx.rotate(isp.angle); ctx.scale(isp.scale, isp.scale); 
        ctx.globalAlpha = isp.life / isp.maxLife; ctx.fillStyle = isp.color;
        ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(3, -5); ctx.lineTo(30, 0); ctx.lineTo(3, 5); ctx.lineTo(0, 30); ctx.lineTo(-3, 5); ctx.lineTo(-30, 0); ctx.lineTo(-3, -5); ctx.closePath(); ctx.fill(); 
        ctx.restore();
    });
    ctx.globalCompositeOperation = 'source-over';

    if (p1 && p2) {
        ctx.globalCompositeOperation = 'lighter';
        [p1, p2].forEach(p => { 
            if (p.trailArr) { 
                p.trailArr.forEach(t => { 
                    ctx.save(); ctx.translate(t.x, p.y); if (!t.isFacingRight) ctx.scale(-1, 1); 
                    ctx.globalAlpha = t.alpha * 0.6; 
                    let img = imageCache[t.classId]; 
                    if (img && img.complete) { ctx.drawImage(img, -35, -70 + 10, 70, 70); } 
                    else { ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(0, -35, 25, 0, Math.PI*2); ctx.fill(); } 
                    ctx.restore(); 
                }); 
            } 
        });
        ctx.globalCompositeOperation = 'source-over';

        if (p1.stamina >= 100) { ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f"; } 
        if (p1.attackTimer > 0 || p1.state === 'cast') { 
            drawCharacter(ctx, p2); drawCharacter(ctx, p1); 
        } else { 
            drawCharacter(ctx, p1); drawCharacter(ctx, p2); 
        } 
        ctx.shadowBlur = 0;
        
        if (p1.comboHits >= 2) { 
            ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = "#ff9f43"; ctx.textAlign = "left"; ctx.shadowBlur = 10; ctx.shadowColor = "#ff9f43"; 
            ctx.fillText(`🔥 ${p1.comboHits} HITS!`, 30 - camX, 100 + Math.sin(Date.now() / 100) * 5); 
            if (p1.comboHits >= 5) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("UNSTOPPABLE!", 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            else if (p1.comboHits >= 3) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#2ed573"; ctx.fillText("AWESOME!", 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            ctx.restore(); 
        }
        if (p2.comboHits >= 2) { 
            ctx.save(); ctx.font = "italic 900 28px Arial"; ctx.fillStyle = "#1e90ff"; ctx.textAlign = "right"; ctx.shadowBlur = 10; ctx.shadowColor = "#1e90ff"; 
            ctx.fillText(`🔥 ${p2.comboHits} HITS!`, canvas.width - 30 - camX, 100 + Math.sin(Date.now() / 100) * 5); 
            if (p2.comboHits >= 5) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#ff4757"; ctx.fillText("UNSTOPPABLE!", canvas.width - 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            else if (p2.comboHits >= 3) { ctx.font = "italic 900 20px Arial"; ctx.fillStyle = "#2ed573"; ctx.fillText("AWESOME!", canvas.width - 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            ctx.restore(); 
        }
        
        if (p1.isRage && p1.hp > 0 && Math.sin(Date.now() / 100) > 0.5) { drawAnnouncer(ctx, "P1 RAGE MODE", "#ff4757", (canvas.width/4) - camX, 60); }
        if (p2.isRage && p2.hp > 0 && Math.sin(Date.now() / 100) > 0.5) { drawAnnouncer(ctx, "P2 RAGE MODE", "#ff4757", (canvas.width*0.75) - camX, 60); }
    }

    slashes.forEach(s => { 
        ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.globalAlpha = s.life / s.maxLife; 
        ctx.beginPath(); ctx.arc(0, 0, 40, -Math.PI/4, Math.PI/4); ctx.lineWidth = 8; ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.stroke(); ctx.restore(); 
    });
    
    particles.forEach(pt => { 
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); 
    }); 
    ctx.globalAlpha = 1.0;
    
    ctx.textAlign = "center"; 
    floatingTexts.forEach(t => { 
        ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; 
        ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; 
    });
    ctx.restore(); 

    if (p1 && p1.hp > 0) {
        let distToWall = Math.min(p1.x, canvas.width - p1.x);
        if (distToWall < 100) {
            let alpha = ((100 - distToWall) / 100) * 0.4 * (0.5 + Math.sin(Date.now() / 50) * 0.5); 
            if (p1.x < 100) { 
                let grad = ctx.createLinearGradient(0, 0, 100, 0); grad.addColorStop(0, `rgba(255, 71, 87, ${alpha})`); grad.addColorStop(1, 'transparent'); 
                ctx.fillStyle = grad; ctx.fillRect(0, 0, 100, canvas.height); 
            } else { 
                let grad = ctx.createLinearGradient(canvas.width - 100, 0, canvas.width, 0); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, `rgba(255, 71, 87, ${alpha})`); 
                ctx.fillStyle = grad; ctx.fillRect(canvas.width - 100, 0, 100, canvas.height); 
            }
        }
    }

    if (screenFlash > 0) { 
        ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }

    if (cinematicTimer > 0 && cinematicCaster) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; ctx.fillRect(0, 0, canvas.width, canvas.height); 
        let stripY = canvas.height / 2 - 50; 
        ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
        
        let progress = (50 - cinematicTimer) / 50; 
        let slideX = -200 + (progress * 800);
        
        ctx.fillStyle = "#fff"; ctx.font = "italic 900 45px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 15; ctx.shadowColor = "#fff"; 
        ctx.fillText(cinematicCaster.className + " ULTIMATE!", slideX, stripY + 60); ctx.shadowBlur = 0;
        
        let img = imageCache[cinematicCaster.classId]; 
        if (img && img.complete) { 
            let avaX = canvas.width - slideX; ctx.drawImage(img, avaX - 60, stripY - 60, 120, 120); 
        }
    }

    if (gameOver && p1 && p2 && slowMoTimer <= 0) { 
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); 
        ctx.font = "bold 35px Arial"; ctx.fillStyle = p1.hp > 0 ? "#2ed573" : "#ff4757"; ctx.textAlign = "center"; 
        ctx.fillText(p1.hp > 0 ? "K.O! BẠN ĐÃ CHIẾN THẮNG 🏆" : "K.O! BẠN ĐÃ BỊ HẠ 💥", canvas.width / 2, canvas.height / 2); 
    } else if (slowMoTimer > 0) { 
        let size = 150 - (120 - slowMoTimer); 
        ctx.font = `italic 900 ${Math.max(50, size)}px Arial`; ctx.fillStyle = "#ff4757"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = "#ff4757"; 
        ctx.fillText("K.O!", canvas.width / 2, canvas.height / 2 + 20); ctx.shadowBlur = 0; 
    }
    
    // MÀN HÌNH INTRO CÀ KHỊA & HIỆU ỨNG TÊN
    if (introTimer > 0 && !gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        
        if (introTimer > 60) {
            let slideProgress = Math.min(1, (160 - introTimer) / 40);
            let easeOut = 1 - Math.pow(1 - slideProgress, 3);
            
            let slideX1 = -200 + easeOut * (canvas.width / 2 - 120);
            let slideX2 = canvas.width + 200 - easeOut * (canvas.width / 2 - 120);
            
            let img1 = imageCache[p1.classId];
            if (img1 && img1.complete) { ctx.drawImage(img1, slideX1 - 50, canvas.height/2 - 100, 100, 100); }
            let img2 = imageCache[p2.classId];
            if (img2 && img2.complete) { 
                ctx.save(); ctx.translate(slideX2, canvas.height/2 - 50); ctx.scale(-1, 1); 
                ctx.drawImage(img2, -50, -50, 100, 100); ctx.restore(); 
            }

            ctx.font = "italic 900 35px Arial";
            ctx.fillStyle = "#ff4757"; ctx.fillText(p1.className, slideX1, canvas.height/2 + 40);
            ctx.fillStyle = "#1e90ff"; ctx.fillText(p2.className, slideX2, canvas.height/2 + 40);
            
            if (introTimer < 130 && introTimer > 70) {
                ctx.font = "bold 15px Arial";
                // Bubble P1
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.beginPath(); ctx.roundRect(slideX1 - 30, canvas.height/2 - 150, ctx.measureText(p1.taunt).width + 20, 30, 8); ctx.fill();
                ctx.fillStyle = "#111"; ctx.fillText(p1.taunt, slideX1 - 20 + ctx.measureText(p1.taunt).width/2, canvas.height/2 - 130);
                // Bubble P2
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.beginPath(); ctx.roundRect(slideX2 - 40, canvas.height/2 - 150, ctx.measureText(p2.taunt).width + 20, 30, 8); ctx.fill();
                ctx.fillStyle = "#111"; ctx.fillText(p2.taunt, slideX2 - 30 + ctx.measureText(p2.taunt).width/2, canvas.height/2 - 130);
            }
            
            if (introTimer <= 120) {
                ctx.font = "italic 900 80px Arial"; ctx.fillStyle = "#f1c40f"; ctx.shadowBlur = 25; ctx.shadowColor = "#f1c40f";
                ctx.fillText("VS", canvas.width/2, canvas.height/2 - 10); ctx.shadowBlur = 0;
            }
        } else {
            let scale = 1 + (introTimer / 60);
            ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(scale, scale);
            ctx.font = "italic 900 90px Arial"; ctx.fillStyle = "#ff9f43"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff9f43";
            ctx.fillText("FIGHT!", 0, 30); ctx.restore();
        }
    }
}

var lastFrameTime = 0; 
var FRAME_MIN_TIME = 1000 / 60; 

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
