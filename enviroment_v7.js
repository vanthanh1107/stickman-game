// ==========================================
// ENVIRONMENT.JS - TRẠM MÔI TRƯỜNG ĐA VŨ TRỤ (V5.0 - BULLETPROOF)
// [FIXED 100%] Khóa mưa/tuyết bám chặt theo Camera, không bao giờ biến mất khi nhảy.
// [ANTI-CONFLICT] Cách ly hoàn toàn mảng thời tiết, chạy vật lý cùng nhịp Render.
// ==========================================

// ==========================================
// 1. BỘ KHỞI TẠO MAP VÀ THỜI TIẾT ĐỘC LẬP
// ==========================================
window.setupEnvironment = function() {
    // Đọc loại thời tiết do engine gốc bốc thăm
    window.currentWeather = window.currentWeather || 'none';
    
    // TẠO MẢNG MỚI HOÀN TOÀN ĐỂ KHÔNG BỊ ENGINE CŨ GHI ĐÈ
    window.activeWeatherFX = [];

    let ptCount = 0;
    if (window.currentWeather === 'rain' || window.currentWeather === 'blood_rain') ptCount = 150;
    else if (window.currentWeather === 'snow') ptCount = 180;
    else if (window.currentWeather === 'matrix_rain') ptCount = 100;
    else if (window.currentWeather === 'ash' || window.currentWeather === 'toxic') ptCount = 120;
    else if (window.currentWeather === 'petals') ptCount = 80;
    else if (window.currentWeather === 'fireflies') ptCount = 50;
    else if (window.currentWeather === 'cosmic_dust' || window.currentWeather === 'shooting_stars') ptCount = 100;

    for (let i = 0; i < ptCount; i++) {
        window.activeWeatherFX.push({
            x: -1500 + Math.random() * 4000, // Phân bổ cực rộng
            y: -1500 + Math.random() * 3000, // Trần rất cao
            speed: Math.random() * 3 + (window.currentWeather.includes('rain') ? 12 : 1.5),
            size: Math.random() * 3 + 1.5,
            ang: Math.random() * Math.PI * 2, 
            char: Math.random() > 0.5 ? "1" : "0",
            alpha: Math.random() * 0.5 + 0.3
        });
    }
    
    window.envDamage = [];
    window.envHazards = [];
};

// ==========================================
// 2. VẬT LÝ BÁM THEO CAMERA (DYNAMIC BOUNDS)
// ==========================================
window.updateWeatherPhysics = function() {
    if (window.timeStopTimer > 0) return;
    if (!window.activeWeatherFX || window.activeWeatherFX.length === 0) return;

    let wType = window.currentWeather || 'none';
    
    // ĐÓNG KHUNG THEO CAMERA: Hạt nào lọt ra ngoài sẽ bị dịch chuyển về lại đúng góc nhìn
    let cX = window.camX || 0;
    let cY = window.camY || 0;
    let topBound = cY - 1200;
    let bottomBound = cY + 1000;
    let leftBound = cX - 1500;
    let rightBound = cX + 1500;

    window.activeWeatherFX.forEach(w => { 
        // 1. Tính toán hướng bay
        if (['toxic', 'ash', 'fireflies'].includes(wType)) { 
            w.y -= w.speed * 0.5; w.x += Math.sin(w.y/30)*2 + (window.globalWind || 0); 
        } 
        else if (wType === 'matrix_rain') {
            w.y += w.speed * 1.6; 
        } 
        else if (wType === 'cosmic_dust') {
            w.y += Math.sin(Date.now()/1000 + w.x)*0.3; w.x += Math.cos(Date.now()/1000 + w.y)*0.3;
        } 
        else if (wType === 'shooting_stars') {
            w.y += w.speed * 3; w.x -= w.speed * 2;
        } 
        else { 
            w.y += w.speed; w.x += ((wType === 'rain' || wType === 'blood_rain') ? -3 : Math.sin(w.y/50)*2) + (window.globalWind || 0); 
        }

        // 2. THUẬT TOÁN WRAP ROUND (Chống hạt bị biến mất khi nhảy cao/thấp)
        if(w.y > bottomBound) { w.y = topBound; w.x = leftBound + Math.random() * (rightBound - leftBound); w.char = Math.random() > 0.5 ? "1" : "0"; }
        else if(w.y < topBound) { w.y = bottomBound; w.x = leftBound + Math.random() * (rightBound - leftBound); w.char = Math.random() > 0.5 ? "1" : "0"; }
        
        if(w.x > rightBound) { w.x = leftBound; w.y = topBound + Math.random() * (bottomBound - topBound); }
        else if(w.x < leftBound) { w.x = rightBound; w.y = topBound + Math.random() * (bottomBound - topBound); }
    });

    // Cập nhật Bẫy Môi trường
    if (!window.gameOver && window.matchTimer) {
        if (!window.envHazards) window.envHazards = [];
        if (!window.projectiles) window.projectiles = [];
        
        let meteorChance = 0.002 + ((window.matchTimer || 0) / 3600) * 0.01; 
        if (Math.random() < meteorChance && window.projectiles.length < 10) { 
            window.projectiles.push({ x: Math.random() * (window.canvas?window.canvas.width:800), y: cY - 800, vx: (Math.random() - 0.5) * 4, vy: 12 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); 
        }
        
        if (wType === 'rain' && Math.random() < 0.005) { 
            window.envHazards.push({ type: 'lightning', x: Math.random() * (window.canvas?window.canvas.width:800), timer: 45, state: 'warning' }); 
        }
        else if (wType === 'ash' && Math.random() < 0.003) { 
            window.envHazards.push({ type: 'lava', x: Math.random() * (window.canvas?window.canvas.width:800), timer: 60 }); 
        }

        for (let i = window.envHazards.length - 1; i >= 0; i--) {
            let haz = window.envHazards[i]; haz.timer--;
            if (haz.type === 'lightning') {
                if (haz.state === 'warning' && haz.timer <= 0) {
                    haz.state = 'striking'; haz.timer = 12;
                    if(typeof window.playSound==='function') window.playSound(300, 'sawtooth', 0.8, 0.8, true); 
                    window.screenFlash = 0.8; 
                    if(typeof window.shakeScreen==='function') window.shakeScreen(20, 15); 
                    if(typeof window.spawnEnvDamage==='function') window.spawnEnvDamage(haz.x, window.GROUND_Y, 'crater', 1.2, false);
                    
                    let allFighters = []; if(window.p1) allFighters.push(window.p1); if(window.enemies) allFighters = allFighters.concat(window.enemies);
                    allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 70) { if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#00f3ff", true, false); f.state = 'hurt'; f.hitStun = 45; f.vx = (f.x - haz.x > 0 ? 18 : -18); } });
                } else if (haz.state === 'striking' && haz.timer <= 0) { window.envHazards.splice(i, 1); }
            } 
            else if (haz.type === 'lava' && haz.timer <= 0) {
                if(typeof window.playSound==='function') window.playSound(100, 'square', 0.8, 0.8, true); 
                if(typeof window.shakeScreen==='function') window.shakeScreen(25, 12); 
                if(typeof window.spawnParticles==='function') window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                
                let allFighters = []; if(window.p1) allFighters.push(window.p1); if(window.enemies) allFighters = allFighters.concat(window.enemies);
                allFighters.forEach(f => { if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false); f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; } });
                window.envHazards.splice(i, 1);
            }
        }
    }
};

// ==========================================
// 3. RENDER MÔI TRƯỜNG
// ==========================================
window.drawEnvironmentDamage = function(ctx) {
    if (!ctx || !window.envDamage || window.envDamage.length === 0) return;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    window.envDamage.forEach(dmg => {
        let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1;
        ctx.globalAlpha = alpha; ctx.save(); ctx.translate(dmg.x, dmg.y);
        if (dmg.type === 'crater') {
            ctx.save(); ctx.scale(1, 0.15); 
            if (dmg.isBurning) {
                let pulse = 0.5 + Math.abs(Math.sin(Date.now() / 150)) * 0.5;
                let burnGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, (dmg.radius || 40) * 1.5);
                burnGrad.addColorStop(0, `rgba(255, 150, 0, ${pulse * 0.9 * alpha})`);
                burnGrad.addColorStop(0.3, `rgba(255, 30, 0, ${pulse * 0.5 * alpha})`);
                burnGrad.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = burnGrad; ctx.beginPath(); ctx.arc(0, 0, (dmg.radius || 40) * 1.5, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = `rgba(15, 15, 15, ${0.8 * alpha})`; ctx.beginPath(); ctx.arc(0, 0, (dmg.radius || 40), 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }
        let baseLw = (dmg.isBurning ? 4 : 3) * (dmg.scale || 1);
        dmg.cracks.forEach(path => {
            if (Array.isArray(path) && path.length > 1) {
                if (dmg.isBurning) { ctx.strokeStyle = `rgba(255, 50, 0, ${0.8 * alpha})`; ctx.lineWidth = baseLw + 2; ctx.shadowBlur = 15; ctx.shadowColor = "#ff4757"; } 
                else { ctx.strokeStyle = `rgba(10, 10, 10, ${0.5 * alpha})`; ctx.lineWidth = baseLw + 2; ctx.shadowBlur = 5; ctx.shadowColor = "#000"; }
                ctx.beginPath(); path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); }); ctx.stroke();
                ctx.strokeStyle = dmg.isBurning ? `rgba(255, 230, 100, ${1.0 * alpha})` : `rgba(0, 0, 0, ${0.9 * alpha})`;
                ctx.lineWidth = baseLw * 0.4; ctx.shadowBlur = 0;
                ctx.beginPath(); path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); }); ctx.stroke();
            }
        });
        ctx.restore();
    });
    ctx.restore();
};

window.drawEnvironmentalHazards = function(ctx) {
    if (!ctx || !window.envHazards || window.envHazards.length === 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; 
    window.envHazards.forEach(haz => {
        if (haz.type === 'lightning') {
            if (haz.state === 'warning') {
                let pulse = 0.5 + Math.sin(haz.timer * 0.4) * 0.5;
                ctx.fillStyle = `rgba(0, 243, 255, ${0.05 + pulse * 0.25})`;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 35 + pulse * 25, 8, 0, 0, Math.PI*2); ctx.fill();
                if (Math.random() < 0.3) {
                    ctx.strokeStyle = "rgba(0, 243, 255, 0.8)"; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y); ctx.lineTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y - 20 - Math.random()*40); ctx.stroke();
                }
            } 
            else if (haz.state === 'striking') {
                ctx.shadowBlur = 20; ctx.shadowColor = "#00f3ff"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3 + Math.random() * 5;
                let startX = haz.x + (Math.random() - 0.5) * 150; let startY = window.GROUND_Y - 800; 
                let steps = 14; let path = [{x: startX, y: startY}]; let branches = [];
                for(let s=1; s<=steps; s++) {
                    let px = startX + (haz.x - startX)*(s/steps) + (Math.random()-0.5)*90; let py = startY + (window.GROUND_Y - startY)*(s/steps); path.push({x: px, y: py});
                    if (Math.random() < 0.35 && s < steps - 2) branches.push({x: px, y: py, tx: px + (Math.random()-0.5)*200, ty: py + 100 + Math.random()*150});
                }
                ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y); path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
                ctx.lineWidth = 1.5 + Math.random() * 2; ctx.strokeStyle = "rgba(180, 255, 255, 0.9)";
                branches.forEach(b => { ctx.beginPath(); ctx.moveTo(b.x, b.y); let bx = b.x, by = b.y; for(let j=0; j<4; j++) { bx += (b.tx - b.x)/4 + (Math.random()-0.5)*30; by += (b.ty - b.y)/4; ctx.lineTo(bx, by); } ctx.stroke(); });
                ctx.shadowBlur = 0; ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random()*0.6})`;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 70, 15, 0, 0, Math.PI*2); ctx.fill();
            }
        } 
        else if (haz.type === 'lava') { 
            ctx.fillStyle = `rgba(231, 76, 60, ${0.1 + Math.sin(haz.timer)/5})`; 
            ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 60 + Math.sin(haz.timer)*10, 15, 0, 0, Math.PI*2); ctx.fill(); 
        }
    });
    ctx.restore();
};

window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    ctx.save(); ctx.lineWidth = 1; let wType = window.currentWeather;

    if (['snow', 'ash', 'toxic'].includes(wType)) {
        if (wType === 'snow') ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        else if (wType === 'ash') ctx.fillStyle = "rgba(230, 126, 34, 0.6)";
        else if (wType === 'toxic') ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
        ctx.beginPath();
        window.activeWeatherFX.forEach(w => { ctx.moveTo(w.x, w.y); ctx.arc(w.x, w.y, wType === 'toxic' ? w.size*1.2 : (wType === 'ash' ? w.size*0.8 : w.size), 0, Math.PI*2); });
        ctx.fill();
    }
    else if (['rain', 'blood_rain'].includes(wType)) {
        ctx.strokeStyle = wType === 'rain' ? "rgba(155, 155, 255, 0.6)" : "rgba(214, 48, 49, 0.75)";
        ctx.lineWidth = wType === 'rain' ? 1.5 : 2.5;
        ctx.beginPath();
        window.activeWeatherFX.forEach(w => { ctx.moveTo(w.x, w.y); ctx.lineTo(w.x - (wType === 'rain' ? 8 : 6), w.y + (wType === 'rain' ? 20 : 30)); });
        ctx.stroke();
    }
    else {
        window.activeWeatherFX.forEach(w => { 
            if (wType === 'petals') { ctx.fillStyle = "rgba(253, 121, 168, 0.8)"; ctx.beginPath(); ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); ctx.fill(); }
            else if (wType === 'fireflies') { let glow = 0.4 + Math.abs(Math.sin(Date.now()/350 + w.x)) * 0.6; ctx.fillStyle = `rgba(241, 196, 15, ${glow})`; ctx.shadowBlur = 10; ctx.shadowColor = "#f1c40f"; ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 1.4, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0; } 
            else if (wType === 'matrix_rain') { ctx.fillStyle = `rgba(0, 255, 68, ${0.4 + Math.random()*0.5})`; ctx.font = "bold 15px monospace"; ctx.fillText(w.char || "1", w.x, w.y); } 
            else if (wType === 'cosmic_dust') { let cglow = 0.3 + Math.abs(Math.sin(Date.now()/500 + w.y)) * 0.7; ctx.fillStyle = w.size > 2 ? `rgba(0, 243, 255, ${cglow})` : `rgba(155, 89, 182, ${cglow})`; ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 2, 0, Math.PI*2); ctx.fill(); } 
            else if (wType === 'shooting_stars') { if (Math.random() > 0.95) return; let tailX = w.x + w.speed * 2; let tailY = w.y - w.speed * 3; let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY); grad.addColorStop(0, "rgba(255, 255, 255, 1)"); grad.addColorStop(1, "rgba(0, 243, 255, 0)"); ctx.strokeStyle = grad; ctx.lineWidth = w.size * 0.8; ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(tailX, tailY); ctx.stroke(); }
        });
    }
    ctx.restore();
};

// ==========================================
// 4. BỘ INJECTOR BẤT TỬ (ANTI-OVERRIDE)
// ==========================================
// Dùng SetInterval liên tục kiểm tra để móc vào Engine ngay khi các hàm được load, chống lỗi Load Order tuyệt đối.

let injectAttempts = 0;
let envInjector = setInterval(() => {
    
    // Móc vào hàm Bắt đầu trận
    if (window.resetMatchVariables && !window._envHookedResetBulletproof) {
        window._envHookedResetBulletproof = true;
        const origReset = window.resetMatchVariables;
        window.resetMatchVariables = function() {
            origReset.apply(this, arguments);
            window.setupEnvironment(); // Tự động thiết lập Mưa / Tuyết khi bấm PLAY
        };
    }

    // Móc vào hàm Vẽ và cập nhật Vật lý
    if (window.draw && !window._envHookedDrawBulletproof) {
        window._envHookedDrawBulletproof = true;
        const origDraw = window.draw;
        
        window.draw = function() {
            // Chạy engine gốc trước để nó vẽ các layer
            origDraw.apply(this, arguments);

            // Bắt đầu vẽ môi trường ĐÈ LÊN trên
            if (window.ctx && window.canvas && !window.isLoading) {
                window.ctx.save();
                
                // Trả lại Camera chuẩn xác
                if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
                window.ctx.scale(window.currentZoom, window.currentZoom); 
                if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
                window.ctx.translate(-window.canvas.width / 2 + (window.camX||0), -window.canvas.height / 2 + (window.camY||0));

                // ÉP CẬP NHẬT VẬT LÝ Ở ĐÂY ĐỂ ĐẢM BẢO CHẠY ĐỒNG BỘ 100% CÙNG FRAME VẼ
                window.updateWeatherPhysics();
                
                window.drawEnvironmentDamage(window.ctx);
                window.drawEnvironmentalHazards(window.ctx);
                window.drawWeatherEffects(window.ctx);

                window.ctx.restore();
            }
        };
    }

    injectAttempts++;
    if ((window._envHookedResetBulletproof && window._envHookedDrawBulletproof) || injectAttempts > 50) {
        clearInterval(envInjector); // Dừng quét khi đã móc xong
    }
}, 100);
