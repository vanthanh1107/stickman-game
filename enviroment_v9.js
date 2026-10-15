// ==========================================
// ENVIRONMENT.JS - TRẠM MÔI TRƯỜNG & THỜI TIẾT ĐỘC LẬP (V6.2 OPTIMIZED)
// ĐÃ FIX:
// 1. Gỡ lệnh return sớm khi không có mưa/tuyết -> Thiên thạch (Meteor) vẫn rơi bình thường ở các map trời quang (weather: 'none').
// 2. Xóa bỏ setInterval hook thừa (Đã được main.js và engine_rend.js gọi trực tiếp đúng lớp Camera).
// 3. Kết nối thông báo thiên tai trực tiếp với khung Live Chat của livechat.js & recorder.js.
// ==========================================

// ==========================================
// 1. BỘ KHỞI TẠO MAP VÀ THỜI TIẾT TRUNG TÂM
// ==========================================
window.setupEnvironment = function() {
    if (window.MAPS && window.MAPS.length > 0) {
        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
        window.currentWeather = window.currentMap.weather || 'none';
    } else {
        window.currentWeather = window.currentWeather || 'none';
    }
    
    window.weatherParticles = [];
    window.activeWeatherFX = [];

    let ptCount = 0;
    if (window.currentWeather === 'rain' || window.currentWeather === 'blood_rain') ptCount = 75;
    else if (window.currentWeather === 'snow') ptCount = 70;
    else if (window.currentWeather === 'matrix_rain') ptCount = 55;
    else if (window.currentWeather === 'ash' || window.currentWeather === 'toxic') ptCount = 60;
    else if (window.currentWeather === 'petals') ptCount = 50;
    else if (window.currentWeather === 'fireflies') ptCount = 35;
    else if (window.currentWeather === 'cosmic_dust' || window.currentWeather === 'shooting_stars') ptCount = 45;

    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;

    for (let i = 0; i < ptCount; i++) {
        window.activeWeatherFX.push({
            x: -200 + Math.random() * (cW + 400),
            y: -250 + Math.random() * (cH + 350),
            speed: Math.random() * 2.5 + (window.currentWeather.includes('rain') ? 13 : 1.8),
            size: Math.random() * 2.8 + 1.5,
            ang: Math.random() * Math.PI * 2, 
            char: Math.random() > 0.5 ? "1" : "0",
            alpha: Math.random() * 0.5 + 0.35
        });
    }
    
    window.envDamage = [];
    window.envHazards = [];
};

window.pushEnvChatReaction = function(msgText) {
    if (!window._liveChats || typeof window.precalcChatText !== 'function' || !window.recordCtxV) return;
    let celeb = (window.CELEB_LIST && window.CELEB_LIST.length > 0)
        ? window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)]
        : { name: "IShowSpeed 🐕", color: "#ff4757" };
    let chatObj = { name: celeb.name, color: celeb.color, msg: msgText, lines: null, nameWidth: 0, isHighlight: true };
    window.precalcChatText(chatObj, window.recordCtxV);
    window._liveChats.push(chatObj);
    if (window._liveChats.length > 12) window._liveChats.shift();
};

// ==========================================
// 2. VẬT LÝ THỜI TIẾT & BẪY MÔI TRƯỜNG BÁM THEO CAMERA
// ==========================================
window.updateWeatherPhysics = function() {
    if (window.timeStopTimer > 0) return;

    // 1. Tự động giảm thời gian tồn tại và dọn dẹp hố thiên thạch / vết nứt sân đấu
    if (window.envDamage && window.envDamage.length > 0) {
        if (window.envDamage.length > 4) window.envDamage.splice(0, window.envDamage.length - 4);
        for (let i = window.envDamage.length - 1; i >= 0; i--) {
            let d = window.envDamage[i];
            if (d.life === undefined) d.life = 240;
            d.life--;
            if (d.life <= 0) window.envDamage.splice(i, 1);
        }
    }

    let wType = window.currentWeather || 'none';
    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;
    let cX = -(window.camX || 0);
    let cY = -(window.camY || 0);

    // 2. Cập nhật Hạt thời tiết (Nếu bản đồ hiện tại có mưa/tuyết/hoa...)
    if (window.activeWeatherFX && window.activeWeatherFX.length > 0) {
        let leftBound = cX - 220;
        let rightBound = cX + cW + 220;
        let topBound = cY - 260;
        let bottomBound = cY + cH + 120;

        let nowTime = Date.now() / 1000;
        let wind = window.globalWind || 0;

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];

            if (wType === 'toxic' || wType === 'ash' || wType === 'fireflies') { 
                w.y -= w.speed * 0.55; 
                w.x += Math.sin(w.y / 30) * 1.8 + wind; 
            } 
            else if (wType === 'matrix_rain') {
                w.y += w.speed * 1.4; 
            } 
            else if (wType === 'cosmic_dust') {
                w.y += Math.sin(nowTime + w.x) * 0.35; 
                w.x += Math.cos(nowTime + w.y) * 0.35;
            } 
            else if (wType === 'shooting_stars') {
                w.y += w.speed * 3.2; 
                w.x -= w.speed * 2.2;
            } 
            else { 
                w.y += w.speed; 
                w.x += ((wType === 'rain' || wType === 'blood_rain') ? -3.2 : Math.sin(w.y / 45) * 1.8) + wind; 
            }

            if (w.y > bottomBound) {
                w.y = topBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
                if (wType === 'matrix_rain') w.char = Math.random() > 0.5 ? "1" : "0";
            } else if (w.y < topBound) {
                w.y = bottomBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
            }
            
            if (w.x > rightBound) {
                w.x = leftBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
            } else if (w.x < leftBound) {
                w.x = rightBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
            }
        }
    }

    // 3. Xử lý Bẫy Môi trường & Thiên thạch (Chạy trên MỌI bản đồ kể cả khi không có mưa/tuyết)
    let isMatchActive = !window.gameOver && (!window.introTimer || window.introTimer <= 0);
    if (isMatchActive && window.matchTimer) {
        if (!window.envHazards) window.envHazards = [];
        if (!window.projectiles) window.projectiles = [];
        
        let meteorChance = 0.0018 + ((window.matchTimer || 0) / 3600) * 0.008; 
        if (Math.random() < meteorChance && window.projectiles.length < 8) { 
            window.projectiles.push({
                x: 60 + Math.random() * (cW - 120),
                y: cY - 450,
                vx: (Math.random() - 0.5) * 4,
                vy: 12 + Math.random() * 5,
                radius: 12 + Math.random() * 6,
                color: "#e67e22",
                dmg: 40,
                target: null,
                isMeteor: true
            }); 
        }
        
        if ((wType === 'rain' || wType === 'blood_rain') && Math.random() < 0.0045 && window.envHazards.length < 2) { 
            window.envHazards.push({ type: 'lightning', x: 80 + Math.random() * (cW - 160), timer: 42, state: 'warning' }); 
        }
        else if (wType === 'ash' && Math.random() < 0.003 && window.envHazards.length < 2) { 
            window.envHazards.push({ type: 'lava', x: 80 + Math.random() * (cW - 160), timer: 55 }); 
        }

        for (let i = window.envHazards.length - 1; i >= 0; i--) {
            let haz = window.envHazards[i];
            haz.timer--;

            if (haz.type === 'lightning') {
                if (haz.state === 'warning' && haz.timer <= 0) {
                    haz.state = 'striking';
                    haz.timer = 12;
                    if (typeof window.playSound === 'function') window.playSound(300, 'sawtooth', 0.6, 0.7, true); 
                    window.screenFlash = 0.55; 
                    if (typeof window.shakeScreen === 'function') window.shakeScreen(14, 8); 
                    if (typeof window.spawnEnvDamage === 'function') window.spawnEnvDamage(haz.x, window.GROUND_Y, 'crater', 1.1, false);
                    
                    let allFighters = [];
                    if (window.p1) allFighters.push(window.p1);
                    if (window.enemies) allFighters = allFighters.concat(window.enemies);
                    
                    let hitAnyone = false;
                    allFighters.forEach(f => {
                        if (f && f.hp > 0 && Math.abs(f.x - haz.x) < 68) {
                            if (typeof window.takeDamage === 'function') window.takeDamage(f, 35, "#00f3ff", true, false);
                            f.state = 'hurt';
                            f.hitStun = 35;
                            f.vx = (f.x - haz.x > 0 ? 12 : -12);
                            hitAnyone = true;
                        }
                    });
                    if (hitAnyone) window.pushEnvChatReaction("Ở ác quá bị sét đánh trúng đầu kìa 💀⚡");
                } else if (haz.state === 'striking' && haz.timer <= 0) {
                    window.envHazards.splice(i, 1);
                }
            } 
            else if (haz.type === 'lava' && haz.timer <= 0) {
                if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.6, 0.7, true); 
                if (typeof window.shakeScreen === 'function') window.shakeScreen(16, 8); 
                if (typeof window.spawnParticles === 'function') window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                
                let allFighters = [];
                if (window.p1) allFighters.push(window.p1);
                if (window.enemies) allFighters = allFighters.concat(window.enemies);
                
                let hitLava = false;
                allFighters.forEach(f => {
                    if (f && f.hp > 0 && Math.abs(f.x - haz.x) < 75 && f.y >= window.GROUND_Y - 110) {
                        if (typeof window.takeDamage === 'function') window.takeDamage(f, 38, "#e74c3c", true, false);
                        f.vy = -12;
                        f.onGround = false;
                        f.state = 'hurt';
                        f.hitStun = 35;
                        hitLava = true;
                    }
                });
                if (hitLava) window.pushEnvChatReaction("Dung nham phun cháy mông luôn rồi 😂🌋");
                window.envHazards.splice(i, 1);
            }
        }
    }
};

// ==========================================
// 3. RENDER VẾT NỨT, THIÊN TAI & HẠT THỜI TIẾT
// ==========================================
window.drawEnvironmentDamage = function(ctx) {
    if (!ctx || !window.envDamage || window.envDamage.length === 0) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    window.envDamage.forEach(dmg => {
        let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1;
        if (alpha <= 0) return;

        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(dmg.x, dmg.y);

        if (dmg.type === 'crater') {
            ctx.save();
            ctx.scale(1, 0.15); 
            let rad = dmg.radius || 40;
            if (dmg.isBurning) {
                ctx.fillStyle = `rgba(255, 60, 0, ${0.45 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad * 1.35, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = `rgba(255, 180, 0, ${0.75 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad * 0.75, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = `rgba(12, 12, 12, ${0.7 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }

        let baseLw = (dmg.isBurning ? 3.5 : 2.5) * (dmg.scale || 1);
        if (dmg.cracks) {
            dmg.cracks.forEach(path => {
                if (Array.isArray(path) && path.length > 1) {
                    ctx.beginPath();
                    path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
                    
                    ctx.strokeStyle = dmg.isBurning ? `rgba(255, 50, 0, ${0.55 * alpha})` : `rgba(0, 0, 0, ${0.45 * alpha})`;
                    ctx.lineWidth = baseLw + 2.5;
                    ctx.stroke();

                    ctx.strokeStyle = dmg.isBurning ? `rgba(255, 230, 100, ${0.95 * alpha})` : `rgba(10, 10, 10, ${0.85 * alpha})`;
                    ctx.lineWidth = baseLw * 0.45;
                    ctx.stroke();
                }
            });
        }
        ctx.restore();
    });
    ctx.restore();
};

window.drawEnvironmentalHazards = function(ctx) {
    if (!ctx || !window.envHazards || window.envHazards.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; 

    window.envHazards.forEach(haz => {
        if (haz.type === 'lightning') {
            if (haz.state === 'warning') {
                let pulse = 0.5 + Math.sin(haz.timer * 0.45) * 0.5;
                ctx.fillStyle = `rgba(0, 243, 255, ${0.12 + pulse * 0.28})`;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 38 + pulse * 22, 8, 0, 0, Math.PI * 2); ctx.fill();
                
                ctx.strokeStyle = "rgba(0, 243, 255, 0.85)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(haz.x + (Math.random() - 0.5) * 35, window.GROUND_Y);
                ctx.lineTo(haz.x + (Math.random() - 0.5) * 35, window.GROUND_Y - 25 - Math.random() * 35);
                ctx.stroke();
            } 
            else if (haz.state === 'striking') {
                let startX = haz.x + (Math.random() - 0.5) * 120;
                let startY = window.GROUND_Y - 650; 
                let steps = 12;
                let path = [{x: startX, y: startY}];
                for (let s = 1; s <= steps; s++) {
                    let px = startX + (haz.x - startX) * (s / steps) + (Math.random() - 0.5) * 75;
                    let py = startY + (window.GROUND_Y - startY) * (s / steps);
                    path.push({x: px, y: py});
                }

                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
                ctx.lineWidth = 14;
                ctx.stroke();

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 65, 14, 0, 0, Math.PI * 2); ctx.fill();
            }
        } 
        else if (haz.type === 'lava') { 
            let pulse = Math.abs(Math.sin(haz.timer * 0.25));
            ctx.fillStyle = `rgba(255, 60, 0, ${0.2 + pulse * 0.35})`; 
            ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 55 + pulse * 15, 12, 0, 0, Math.PI * 2); ctx.fill(); 
        }
    });
    ctx.restore();
};

window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    ctx.save();
    let wType = window.currentWeather;

    if (wType === 'snow' || wType === 'ash' || wType === 'toxic') {
        if (wType === 'snow') ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
        else if (wType === 'ash') ctx.fillStyle = "rgba(255, 140, 40, 0.7)";
        else if (wType === 'toxic') ctx.fillStyle = "rgba(46, 213, 115, 0.5)";
        
        ctx.beginPath();
        let radMult = wType === 'toxic' ? 1.2 : (wType === 'ash' ? 0.85 : 1);
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            ctx.moveTo(w.x, w.y);
            ctx.arc(w.x, w.y, w.size * radMult, 0, Math.PI * 2);
        }
        ctx.fill();
    }
    else if (wType === 'rain' || wType === 'blood_rain') {
        ctx.strokeStyle = wType === 'rain' ? "rgba(160, 210, 255, 0.62)" : "rgba(255, 45, 65, 0.78)";
        ctx.lineWidth = wType === 'rain' ? 1.6 : 2.4;
        let dx = wType === 'rain' ? -7 : -5;
        let dy = wType === 'rain' ? 22 : 28;
        ctx.beginPath();
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x + dx, w.y + dy);
        }
        ctx.stroke();
    }
    else if (wType === 'petals') {
        ctx.fillStyle = "rgba(255, 135, 185, 0.85)";
        ctx.beginPath();
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            ctx.moveTo(w.x, w.y);
            ctx.ellipse(w.x, w.y, w.size * 1.2, w.size * 0.6, w.ang + (w.y / 45), 0, Math.PI * 2);
        }
        ctx.fill();
    }
    else if (wType === 'fireflies') {
        let nowT = Date.now() / 350;
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let glow = 0.35 + Math.abs(Math.sin(nowT + w.x)) * 0.65;
            ctx.fillStyle = `rgba(241, 196, 15, ${glow * 0.3})`;
            ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 3.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = `rgba(255, 245, 160, ${glow})`;
            ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 1.1, 0, Math.PI * 2); ctx.fill();
        }
    }
    else if (wType === 'matrix_rain') {
        ctx.fillStyle = "rgba(0, 255, 85, 0.72)";
        ctx.font = "bold 15px monospace";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            ctx.fillText(w.char || "1", w.x, w.y);
        }
    }
    else if (wType === 'cosmic_dust') {
        let nowT = Date.now() / 500;
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let cglow = 0.3 + Math.abs(Math.sin(nowT + w.y)) * 0.7;
            ctx.fillStyle = w.size > 2 ? `rgba(0, 243, 255, ${cglow})` : `rgba(180, 100, 255, ${cglow})`;
            ctx.beginPath(); ctx.arc(w.x, w.y, w.size * 1.6, 0, Math.PI * 2); ctx.fill();
        }
    }
    else if (wType === 'shooting_stars') {
        ctx.strokeStyle = "rgba(0, 243, 255, 0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x + w.speed * 2.5, w.y - w.speed * 3.5);
        }
        ctx.stroke();
    }
    ctx.restore();
};
