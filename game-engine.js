// ==========================================
// GAME ENGINE - CỐT LÕI ĐỒ HỌA & VẬT LÝ GỐC
// KHÔNG CẦN CHỈNH SỬA FILE NÀY
// ==========================================

var canvas = null; 
var ctx = null;
var audioCtx = null;
var isMuted = false; 

// Biến toàn cục (Global Variables) chia sẻ với game-logic.js
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
var rewardMultiplier = 1; 

var shakeTime = 0, shakeMag = 0;
var matchResolved = false;
var camX = 0, screenFlash = 0, cinematicTimer = 0, cinematicCaster = null, cinematicCallback = null; 
var slowMoTimer = 0, introTimer = 0, uiShakeP1 = 0, uiShakeP2 = 0;

var currentWeather = 'none';
var weatherParticles = [];
var GROUND_Y = 320; 
var GRAVITY = 0.8;

// --- HỆ THỐNG ÂM THANH & THIẾT BỊ ---
function triggerVibration(pattern) { if (typeof window !== 'undefined' && navigator && navigator.vibrate) { try { navigator.vibrate(pattern); } catch(e) {} } }

window.toggleAudio = function(e) { 
    e.stopPropagation(); isMuted = !isMuted; 
    let btn = document.getElementById("btn-audio"); 
    if(btn) btn.innerText = isMuted ? "🔇" : "🔊"; 
    if (!isMuted && audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); } 
}

function playSound(freq, type, duration, vol) { 
    if (isMuted) return; 
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain(); 
        osc.connect(gain); gain.connect(audioCtx.destination); 
        osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
        gain.gain.setValueAtTime(vol, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); 
        osc.start(); osc.stop(audioCtx.currentTime + duration); 
    } catch(e){}
}

// --- HỆ THỐNG HIỆU ỨNG (PARTICLES) ---
function shakeScreen(frames, magnitude) { shakeTime = frames; shakeMag = magnitude; }
function spawnTrap(x, y, radius, color, damage, lifeFrames, owner) { traps.push({x: x, y: y, radius: radius, color: color, damage: damage, life: lifeFrames, maxLife: lifeFrames, owner: owner}); }
function spawnProjectile(x, y, vx, vy, radius, color, dmg, target, customOnHit) { projectiles.push({ x: x, y: y, vx: vx, vy: vy, radius: radius, color: color, dmg: dmg, target: target, onHit: customOnHit }); }
function spawnSlash(x, y, isRight, color, isCrit, scale) { slashes.push({ x: x, y: y, isRight: isRight, life: 10, maxLife: 10, color: isCrit ? "#fff" : color, scale: (isCrit ? 1.8 : 1) * scale }); }
function spawnParticles(x, y, color, isCrit = false) {
    let count = isCrit ? 30 : 15;
    for(let i=0; i<count; i++) { let angle = Math.random() * Math.PI * 2; let speed = Math.random() * (isCrit?15:8) + 2; particles.push({ x: x, y: y - 30, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 20, maxLife: 20, color: color, size: Math.random() * 5 + 2 }); }
}
function spawnDust(x, y) { for(let i=0; i<8; i++) { particles.push({ x: x + (Math.random()*20-10), y: y, vx: (Math.random()-0.5)*3, vy: -Math.random()*3, life: 15, maxLife: 15, color: "rgba(200, 200, 200, 0.5)", size: Math.random() * 8 + 4 }); } }
function spawnSweat(x, y) { particles.push({ x: x + (Math.random()*20-10), y: y, vx: 0, vy: Math.random()*2 + 1, life: 15, maxLife: 15, color: "#74b9ff", size: Math.random()*3 + 1 }); }

// --- HỆ THỐNG VẼ ĐỒ HỌA (RENDER) ---
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
    if (!canvas) { canvas = document.getElementById("battleCanvas"); if(canvas) ctx = canvas.getContext("2d"); }
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save();
    
    if (slowMoTimer > 0) { 
        let loserX = p1.hp <= 0 ? p1.x : (enemies.length > 0 ? enemies[0].x : p1.x); let targetCamX = (canvas.width / 2) - loserX; camX += (targetCamX - camX) * 0.1; ctx.translate(canvas.width/2, canvas.height/2); ctx.scale(1.2, 1.2); ctx.translate(-canvas.width/2 + camX, -canvas.height/2 + 20); 
    } else if (p1 && !gameOver && introTimer === 0) { 
        let closest = null;
        if(enemies.length > 0) { closest = enemies[0]; let minDist = Math.abs(p1.x - closest.x); for(let i=1; i<enemies.length; i++) { let d = Math.abs(p1.x - enemies[i].x); if(d < minDist) { minDist = d; closest = enemies[i]; } } }
        let centerX = closest ? (p1.x + closest.x) / 2 : p1.x; let targetCamX = (canvas.width / 2) - centerX; targetCamX = Math.max(-100, Math.min(100, targetCamX)); camX += (targetCamX - camX) * 0.1; ctx.translate(camX, 0); 
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
            if (p1.comboHits >= 5) { ctx.fillText("👑", 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            else if (p1.comboHits >= 3) { ctx.fillText("🌟", 30 - camX, 130 + Math.sin(Date.now() / 100) * 5); } 
            ctx.restore(); 
        }
        if (p1.isRage && p1.hp > 0 && Math.sin(Date.now() / 100) > 0.5) { drawAnnouncer(ctx, "💢", "#ff4757", (canvas.width/4) - camX, 60); }
    }

    slashes.forEach(s => { ctx.save(); ctx.translate(s.x, s.y); if (!s.isRight) ctx.scale(-1, 1); ctx.scale(s.scale, s.scale); ctx.globalAlpha = s.life / s.maxLife; ctx.beginPath(); ctx.arc(0, 0, 40, -Math.PI/4, Math.PI/4); ctx.lineWidth = 8; ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.stroke(); ctx.restore(); });
    
    // TẠO HẠT VÀNG KHI RƠI TIỀN (Hiệu ứng)
    particles.forEach(pt => { 
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life / pt.maxLife; ctx.fill(); 
        if (pt.isCoin) { ctx.strokeStyle = "#d35400"; ctx.lineWidth = 1; ctx.stroke(); }
    }); 
    ctx.globalAlpha = 1.0;
    
    floatingTexts.forEach(t => { ctx.font = t.font || "900 22px Arial"; ctx.fillStyle = t.color; ctx.shadowBlur = 5; ctx.shadowColor = t.color; ctx.fillText(t.text, t.x, t.y); ctx.shadowBlur = 0; });
    ctx.restore(); 

    if (p1 && p1.hp > 0) {
        let distToWall = Math.min(p1.x, canvas.width - p1.x);
        if (distToWall < 100) { let alpha = ((100 - distToWall) / 100) * 0.4 * (0.5 + Math.sin(Date.now() / 50) * 0.5); if (p1.x < 100) { let grad = ctx.createLinearGradient(0, 0, 100, 0); grad.addColorStop(0, `rgba(255, 71, 87, ${alpha})`); grad.addColorStop(1, 'transparent'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 100, canvas.height); } else { let grad = ctx.createLinearGradient(canvas.width - 100, 0, canvas.width, 0); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, `rgba(255, 71, 87, ${alpha})`); ctx.fillStyle = grad; ctx.fillRect(canvas.width - 100, 0, 100, canvas.height); } }
    }
    if (screenFlash > 0) { ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }

    if (cinematicTimer > 0 && cinematicCaster) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let stripY = canvas.height / 2 - 50; ctx.fillStyle = cinematicCaster.color; ctx.fillRect(0, stripY, canvas.width, 100);
        let progress = (50 - cinematicTimer) / 50; let slideX = -200 + (progress * 800);
        ctx.fillStyle = "#fff"; ctx.font = "italic 900 60px Arial"; ctx.textAlign = "center"; ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillText("⚡", slideX, stripY + 70); ctx.shadowBlur = 0;
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
            let eName = (window.rewardMultiplier === 15) ? `👹` : (window.rewardMultiplier > 1 ? `🤖 x${window.rewardMultiplier}` : "🤖"); ctx.fillStyle = "#1e90ff"; ctx.fillText(eName, slideX2, canvas.height/2 + 80);
            
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
function gameLoop(timestamp) { 
    if (!isLoopRunning) return; requestAnimationFrame(gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - lastFrameTime; 
    if (deltaTime >= FRAME_MIN_TIME) { 
        lastFrameTime = timestamp - (deltaTime % FRAME_MIN_TIME); 
        try { if(typeof window.updateLogic === 'function') window.updateLogic(); } catch(e) {} 
        try { draw(); } catch(e) {} 
    } 
}
