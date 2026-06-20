var canvas, ctx, audioCtx; var isMuted = false; window.selectedRedClass = null;
var floatingTexts = [], particles = [], projectiles = [], traps = [], slashes = [], shockwaves = [], impactSparks = [];
var p1 = null, gameOver = false, isLoopRunning = false; var enemies = []; var totalEnemyMaxHp = 0; window.rewardMultiplier = 1; 
var shakeTime = 0, shakeMag = 0, hitStopFrames = 0, matchResolved = false;
var camX = 0, screenFlash = 0, cinematicTimer = 0, cinematicCaster = null, cinematicCallback = null; 
var slowMoTimer = 0, introTimer = 0, uiShakeP1 = 0, uiShakeP2 = 0, currentZoom = 1, targetZoom = 1;
var currentWeather = 'none', weatherParticles = []; var GROUND_Y = 320, GRAVITY = 0.8; var lastFrameTime = 0, FRAME_MIN_TIME = 1000 / 60;

function triggerVibration(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }
window.toggleAudio = function(e) { e.stopPropagation(); isMuted = !isMuted; let btn = document.getElementById("btn-audio"); if(btn) btn.innerText = isMuted ? "🔇" : "🔊"; if (!isMuted && audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); } }

function playSound(freq, type, duration, vol, isImpact = false) { 
    if (isMuted) return; 
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        let t = audioCtx.currentTime; let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); 
        osc.connect(gain); gain.connect(audioCtx.destination); 
        if (isImpact) { osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(30, t + duration); gain.gain.setValueAtTime(vol * 2.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); } 
        else { osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 0.5, t); osc.frequency.linearRampToValueAtTime(freq, t + duration * 0.5); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(vol * 1.5, t + duration * 0.1); gain.gain.exponentialRampToValueAtTime(0.01, t + duration); }
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
    if (!targetsArray || targetsArray.length === 0) return null; let closest = targetsArray[0]; let minDist = Math.abs(source.x - closest.x);
    for (let i = 1; i < targetsArray.length; i++) { if (targetsArray[i].hp <= 0) continue; let d = Math.abs(source.x - targetsArray[i].x); if (d < minDist) { minDist = d; closest = targetsArray[i]; } }
    return closest.hp > 0 ? closest : null;
}
