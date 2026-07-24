// ==========================================
// ENVIRONMENT.JS - TRẠM MÔI TRƯỜNG ĐA VŨ TRỤ (V3.0 BULLETPROOF)
// [TỰ ĐỘNG BẢO VỆ] Chống lỗi Load Order bị mất hiệu ứng do file tải sai thứ tự
// [PHỤC HỒI VẬT LÝ] Hồi sinh toàn bộ sấm sét, lava, mưa sao băng, mưa ma trận từ Engine v8.0
// ==========================================

// 1. BỘ KHỞI TẠO MAP VÀ THỜI TIẾT
window.setupEnvironment = function() {
    if (window.MAPS && window.MAPS.length > 0) {
        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
    } else {
        window.currentMap = { id: "default", sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
    }

    window.currentWeather = window.currentMap.weather || 'none';
    window.weatherParticles = [];

    let ptCount = 0;
    if (window.currentWeather === 'rain' || window.currentWeather === 'blood_rain') ptCount = 120;
    else if (window.currentWeather === 'snow') ptCount = 150;
    else if (window.currentWeather === 'matrix_rain') ptCount = 80;
    else if (window.currentWeather === 'ash' || window.currentWeather === 'toxic') ptCount = 100;
    else if (window.currentWeather === 'petals') ptCount = 60;
    else if (window.currentWeather === 'fireflies') ptCount = 40;
    else if (window.currentWeather === 'cosmic_dust' || window.currentWeather === 'shooting_stars') ptCount = 80;

    for (let i = 0; i < ptCount; i++) {
        window.weatherParticles.push({
            x: Math.random() * 2000 - 500,
            y: Math.random() * 1000 - 200,
            speed: Math.random() * 3 + (window.currentWeather.includes('rain') ? 8 : 1),
            size: Math.random() * 2.5 + 1.5,
            ang: Math.random() * Math.PI * 2, 
            char: Math.random() > 0.5 ? "1" : "0",
            alpha: Math.random() * 0.5 + 0.3
        });
    }
    
    window.envDamage = [];
    window.envHazards = [];
};

// 2. BỘ CẬP NHẬT VẬT LÝ ĐỘC LẬP (PHYSICS UPDATE)
window.updateWeatherPhysics = function() {
    if (window.timeStopTimer > 0) return;

    let wType = window.currentWeather;
    let canvasW = window.canvas ? window.canvas.width : 1000;
    let canvasH = window.canvas ? window.canvas.height : 600;

    // --- Cập nhật vị trí hạt thời tiết ---
    if (window.weatherParticles) {
        window.weatherParticles.forEach(w => { 
            if (['toxic', 'ash', 'fireflies'].includes(wType)) { 
                w.y -= w.speed * 0.5; w.x += Math.sin(w.y/30)*2 + (window.globalWind || 0); 
                if(w.y < -20) { w.y = canvasH + 20; w.x = Math.random() * 2000 - 500; } 
            } 
            else if (wType === 'matrix_rain') {
                w.y += w.speed * 1.6; 
                if(w.y > canvasH + 20) { w.y = -20; w.x = Math.random() * 2000 - 500; w.char = Math.random() > 0.5 ? "1" : "0"; }
            } 
            else if (wType === 'cosmic_dust') {
                w.y += Math.sin(Date.now()/1000 + w.x)*0.3; w.x += Math.cos(Date.now()/1000 + w.y)*0.3;
            } 
            else if (wType === 'shooting_stars') {
                w.y += w.speed * 3; w.x -= w.speed * 2;
                if(w.y > canvasH + 20 || w.x < -100) { w.y = -200 - Math.random()*200; w.x = Math.random() * 2000; }
            } 
            else { 
                w.y += w.speed; w.x += ((wType === 'rain' || wType === 'blood_rain') ? -3 : Math.sin(w.y/50)*2) + (window.globalWind || 0); 
                if(w.y > canvasH + 20) { w.y = -20; w.x = Math.random() * 2000 - 500; } 
            }
        });
    }

    // --- Sinh và Cập nhật Bẫy Môi Trường (Sét / Dung Nham / Thiên Thạch) ---
    if (!window.gameOver && window.matchTimer) {
        if (!window.envHazards) window.envHazards = [];
        if (!window.projectiles) window.projectiles = [];
        
        let meteorChance = 0.002 + ((window.matchTimer || 0) / 3600) * 0.01; 
        if (Math.random() < meteorChance && window.projectiles.length < 10) { 
            window.projectiles.push({ x: Math.random() * canvasW, y: -100, vx: (Math.random() - 0.5) * 4, vy: 8 + Math.random() * 6, radius: 12 + Math.random() * 8, color: "#e67e22", dmg: 45, target: null, isMeteor: true }); 
        }
        
        if (wType === 'rain' && Math.random() < 0.005) { 
            window.envHazards.push({ type: 'lightning', x: Math.random() * canvasW, timer: 45, state: 'warning' }); 
        }
        else if (wType === 'ash' && Math.random() < 0.003) { 
            window.envHazards.push({ type: 'lava', x: Math.random() * canvasW, timer: 60 }); 
        }

        // Xử lý sát thương từ Bẫy Môi trường
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
                    allFighters.forEach(f => { 
                        if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 70) { 
                            if(typeof window.takeDamage==='function') window.takeDamage(f, 35, "#00f3ff", true, false); 
                            f.state = 'hurt'; f.hitStun = 45; f.vx = (f.x - haz.x > 0 ? 18 : -18); 
                        } 
                    });
                } else if (haz.state === 'striking' && haz.timer <= 0) {
                    window.envHazards.splice(i, 1);
                }
            } 
            else if (haz.type === 'lava' && haz.timer <= 0) {
                if(typeof window.playSound==='function') window.playSound(100, 'square', 0.8, 0.8, true); 
                if(typeof window.shakeScreen==='function') window.shakeScreen(25, 12); 
                if(typeof window.spawnParticles==='function') window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                
                let allFighters = []; if(window.p1) allFighters.push(window.p1); if(window.enemies) allFighters = allFighters.concat(window.enemies);
                allFighters.forEach(f => { 
                    if(f && f.hp > 0 && Math.abs(f.x - haz.x) < 80 && f.y >= window.GROUND_Y - 120) { 
                        if(typeof window.takeDamage==='function') window.takeDamage(f, 40, "#e74c3c", true, false); 
                        f.vy = -16; f.onGround = false; f.state = 'ko_falling'; f.koTimer = 40; f.hitStun = 45; 
                    } 
                });
                window.envHazards.splice(i, 1);
            }
        }
    }
};

// 3. BỘ VẼ MÔI TRƯỜNG ĐỘC LẬP
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
                    ctx.beginPath(); ctx.moveTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y);
                    ctx.lineTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y - 20 - Math.random()*40); ctx.stroke();
                }
            } 
            else if (haz.state === 'striking') {
                ctx.shadowBlur = 20; ctx.shadowColor = "#00f3ff"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3 + Math.random() * 5;
                let startX = haz.x + (Math.random() - 0.5) * 150; let startY = window.GROUND_Y - 800; 
                let steps = 14; let path = [{x: startX, y: startY}]; let branches = [];
                for(let s=1; s<=steps; s++) {
                    let px = startX + (haz.x - startX)*(s/steps) + (Math.random()-0.5)*90; 
                    let py = startY + (window.GROUND_Y - startY)*(s/steps);
                    path.push({x: px, y: py});
                    if (Math.random() < 0.35 && s < steps - 2) branches.push({x: px, y: py, tx: px + (Math.random()-0.5)*200, ty: py + 100 + Math.random()*150});
                }
                ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y); path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
                ctx.lineWidth = 1.5 + Math.random() * 2; ctx.strokeStyle = "rgba(180, 255, 255, 0.9)";
                branches.forEach(b => {
                    ctx.beginPath(); ctx.moveTo(b.x, b.y); let bx = b.x, by = b.y;
                    for(let j=0; j<4; j++) { bx += (b.tx - b.x)/4 + (Math.random()-0.5)*30; by += (b.ty - b.y)/4; ctx.lineTo(bx, by); }
                    ctx.stroke();
                });
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
    if (!ctx || !window.weatherParticles || window.weatherParticles.length === 0) return;
    ctx.save(); ctx.lineWidth = 1; let wType = window.currentWeather;

    if (['snow', 'ash', 'toxic'].includes(wType)) {
        if (wType === 'snow') ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        else if (wType === 'ash') ctx.fillStyle = "rgba(230, 126, 34, 0.6)";
        else if (wType === 'toxic') ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
        ctx.beginPath();
        window.weatherParticles.forEach(w => { ctx.moveTo(w.x, w.y); ctx.arc(w.x, w.y, wType === 'toxic' ? w.size*1.2 : (wType === 'ash' ? w.size*0.8 : w.size), 0, Math.PI*2); });
        ctx.fill();
    }
    else if (['rain', 'blood_rain'].includes(wType)) {
        ctx.strokeStyle = wType === 'rain' ? "rgba(155, 155, 255, 0.6)" : "rgba(214, 48, 49, 0.75)";
        ctx.lineWidth = wType === 'rain' ? 1 : 2;
        ctx.beginPath();
        window.weatherParticles.forEach(w => { ctx.moveTo(w.x, w.y); ctx.lineTo(w.x - (wType === 'rain' ? 6 : 4), w.y + (wType === 'rain' ? 15 : 22)); });
        ctx.stroke();
    }
    else {
        window.weatherParticles.forEach(w => { 
            if (wType === 'petals') { ctx.fillStyle = "rgba(253, 121, 168, 0.7)"; ctx.beginPath(); ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); ctx.fill(); }
            else if (wType === 'fireflies') {
                let glow = 0.3 + Math.abs(Math.sin(Date.now()/350 + w.x)) * 0.7; ctx.fillStyle = `rgba(241, 196, 15, ${glow})`; ctx.shadowBlur = 8; ctx.shadowColor = "#f1c40f"; 
                ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 1.4, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
            } 
            else if (wType === 'matrix_rain') {
                ctx.fillStyle = `rgba(0, 255, 68, ${0.4 + Math.random()*0.5})`; ctx.font = "bold 15px monospace"; ctx.fillText(w.char || "1", w.x, w.y);
            } 
            else if (wType === 'cosmic_dust') {
                let cglow = 0.2 + Math.abs(Math.sin(Date.now()/500 + w.y)) * 0.6; ctx.fillStyle = w.size > 2 ? `rgba(0, 243, 255, ${cglow})` : `rgba(155, 89, 182, ${cglow})`;
                ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 2, 0, Math.PI*2); ctx.fill();
            } 
            else if (wType === 'shooting_stars') {
                if (Math.random() > 0.95) return; 
                let tailX = w.x + w.speed * 2; let tailY = w.y - w.speed * 3;
                let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY);
                grad.addColorStop(0, "rgba(255, 255, 255, 1)"); grad.addColorStop(1, "rgba(0, 243, 255, 0)");
                ctx.strokeStyle = grad; ctx.lineWidth = w.size * 0.8;
                ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(tailX, tailY); ctx.stroke();
            }
        });
    }
    ctx.restore();
};

// ==========================================
// 4. AUTO-INJECTOR: MÓC VÀO GAME ENGINE (CHỐNG LỖI LOAD ORDER)
// ==========================================
window.injectEnvironmentHooks = function() {
    // 1. Móc vào hàm Bắt đầu trận
    if (window.resetMatchVariables && !window._envHookedReset) {
        const origReset = window.resetMatchVariables;
        window.resetMatchVariables = function() {
            origReset.apply(this, arguments);
            window.setupEnvironment();
        };
        window._envHookedReset = true;
    }
    // 2. Móc vào vòng lặp Vật lý
    if (window.update && !window._envHookedUpdate) {
        const origUpdate = window.update;
        window.update = function() {
            window.updateWeatherPhysics();
            origUpdate.apply(this, arguments);
        };
        window._envHookedUpdate = true;
    }
    // 3. Móc vào vòng lặp Vẽ hình
    if (window.draw && !window._envHookedDraw) {
        const origDraw = window.draw;
        window.draw = function() {
            origDraw.apply(this, arguments);
            if (window.ctx && window.canvas && !window.gameOver && !window.isLoading) {
                window.ctx.save();
                if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
                window.ctx.scale(window.currentZoom, window.currentZoom); 
                if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
                window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

                window.drawEnvironmentDamage(window.ctx);
                window.drawEnvironmentalHazards(window.ctx);
                window.drawWeatherEffects(window.ctx);
                window.ctx.restore();
            }
        };
        window._envHookedDraw = true;
    }
};

// CHẠY NGAY CƠ CHẾ QUÉT AUTO-INJECTOR ĐỂ CHỐNG LỖI (Mỗi 100ms cho đến khi thấy hàm Engine)
let checkInterval = setInterval(() => {
    if (window.resetMatchVariables && window.update && window.draw) {
        window.injectEnvironmentHooks();
        clearInterval(checkInterval);
    }
}, 100);
