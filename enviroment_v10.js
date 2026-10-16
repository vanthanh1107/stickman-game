// ==========================================
// ENVIRONMENT.JS - TRẠM MÔI TRƯỜNG ĐA VŨ TRỤ (V7.0 - 3D PARALLAX & REALISTIC FX)
// NÂNG CẤP ĐỈNH CAO:
// 1. Hệ thống 3 tầng chiều sâu (3D Depth Parallax): Hạt nhỏ ở xa trôi chậm, hạt lớn ở gần phát sáng Bokeh lung linh.
// 2. Fix triệt để lỗi tốc độ mưa số (matrix_rain): Rơi chậm rãi, có dải đuôi 4-5 ký tự mờ dần và đầu sáng trắng-lục.
// 3. Tuyết rơi (snow) & Hoa anh đào (petals) lượn sóng nhẹ nhàng, mỗi hạt có tần số đung đưa độc lập.
// 4. Mưa rào (rain / blood_rain) tạo vòng sóng nước (rainSplashes) chân thực ngay khi chạm mặt đất.
// 5. Giữ vững 60FPS tuyệt đối (Vẽ hào quang đa lớp, không dùng shadowBlur trong vòng lặp).
// ==========================================

// Danh sách Map dự phòng đa dạng thời tiết nếu window.MAPS chưa được khai báo ở ngoài
window.DEFAULT_ENV_MAPS = [
    { sky: "#0b132b", bg1: "#1c2541", bg2: "#3a506b", ground: "#0f172a", line: "#00f3ff", weather: "snow", bg1Type: "pines", bg2Type: "mountains" },
    { sky: "#020b05", bg1: "#051f0e", bg2: "#0a3618", ground: "#041208", line: "#00ff66", weather: "matrix_rain", bg1Type: "digital", bg2Type: "stars" },
    { sky: "#1a1423", bg1: "#2d1e2f", bg2: "#4e2a4f", ground: "#120d18", line: "#ff7eb3", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },
    { sky: "#0f172a", bg1: "#1e293b", bg2: "#334155", ground: "#090d16", line: "#38bdf8", weather: "rain", bg1Type: "city", bg2Type: "river" },
    { sky: "#090a10", bg1: "#16192b", bg2: "#252945", ground: "#07080d", line: "#f1c40f", weather: "fireflies", bg1Type: "trees", bg2Type: "stars" },
    { sky: "#12061c", bg1: "#240b36", bg2: "#3b1254", ground: "#0b0312", line: "#c084fc", weather: "cosmic_dust", bg1Type: "pillars", bg2Type: "stars" },
    { sky: "#240b0b", bg1: "#3d1010", bg2: "#5c1616", ground: "#140505", line: "#ff4757", weather: "ash", bg1Type: "pillars", bg2Type: "flowing_lava" },
    { sky: "#060c1c", bg1: "#0f1e3d", bg2: "#1b3366", ground: "#050914", line: "#00f3ff", weather: "shooting_stars", bg1Type: "pillars", bg2Type: "clouds" }
];

const MATRIX_CHARS = ["0", "1", "7", "9", "Z", "λ", "Ξ", "∑", "∆", "8", "4", "2"];

// ==========================================
// 1. BỘ KHỞI TẠO MAP VÀ HẠT THỜI TIẾT 3 CHIỀU
// ==========================================
window.setupEnvironment = function() {
    let mapPool = (window.MAPS && window.MAPS.length > 0) ? window.MAPS : window.DEFAULT_ENV_MAPS;
    window.currentMap = mapPool[Math.floor(Math.random() * mapPool.length)];
    window.currentWeather = window.currentMap.weather || window.currentWeather || 'snow';
    
    window.weatherParticles = [];
    window.activeWeatherFX = [];
    window.rainSplashes = [];
    window.envDamage = [];
    window.envHazards = [];

    let wType = window.currentWeather;
    let ptCount = 0;
    if (wType === 'rain' || wType === 'blood_rain') ptCount = 80;
    else if (wType === 'snow') ptCount = 85;
    else if (wType === 'matrix_rain') ptCount = 42;
    else if (wType === 'ash' || wType === 'toxic') ptCount = 65;
    else if (wType === 'petals') ptCount = 55;
    else if (wType === 'fireflies') ptCount = 45;
    else if (wType === 'cosmic_dust') ptCount = 60;
    else if (wType === 'shooting_stars') ptCount = 22;

    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;

    for (let i = 0; i < ptCount; i++) {
        // Phân bổ chiều sâu 3D: 45% hạt nhỏ ở xa, 35% hạt vừa ở giữa, 20% hạt lớn Bokeh ở gần
        let randLayer = Math.random();
        let depth = (randLayer < 0.45)
            ? (0.38 + Math.random() * 0.32)   // Xa (nhỏ, chậm, mờ nhẹ)
            : (randLayer < 0.80)
                ? (0.72 + Math.random() * 0.35) // Trung bình
                : (1.08 + Math.random() * 0.42); // Gần (lớn, sáng lung linh)

        // Tính tốc độ rơi thực tế theo đúng từng loại thời tiết
        let baseSpeed = 1.0;
        if (wType === 'rain' || wType === 'blood_rain') {
            baseSpeed = (6.8 + Math.random() * 3.8) * (0.65 + depth * 0.45);
        } else if (wType === 'matrix_rain') {
            baseSpeed = (0.75 + Math.random() * 0.85) * (0.6 + depth * 0.5); // Rơi số chậm rãi, mượt mà
        } else if (wType === 'snow') {
            baseSpeed = (0.42 + Math.random() * 0.65) * (0.55 + depth * 0.55); // Tuyết rơi êm ái
        } else if (wType === 'petals') {
            baseSpeed = (0.55 + Math.random() * 0.65) * (0.6 + depth * 0.5);
        } else if (wType === 'ash' || wType === 'toxic') {
            baseSpeed = (0.45 + Math.random() * 0.65) * (0.6 + depth * 0.5);
        } else if (wType === 'fireflies' || wType === 'cosmic_dust') {
            baseSpeed = (0.22 + Math.random() * 0.45) * depth;
        } else if (wType === 'shooting_stars') {
            baseSpeed = (3.8 + Math.random() * 2.5) * (0.7 + depth * 0.4);
        }

        let baseSize = (1.2 + Math.random() * 1.6) * depth;
        let trailLen = (depth > 1.0) ? 5 : (depth > 0.65 ? 4 : 3);
        let trailChars = [];
        for (let c = 0; c < trailLen; c++) {
            trailChars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }

        window.activeWeatherFX.push({
            x: -200 + Math.random() * (cW + 400),
            y: -250 + Math.random() * (cH + 350),
            depth: depth,
            speed: baseSpeed,
            size: baseSize,
            ang: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() - 0.5) * 0.04,
            swayAmp: (0.4 + Math.random() * 0.9) * depth,
            swayFreq: 0.012 + Math.random() * 0.018,
            phase: Math.random() * Math.PI * 2,
            trailChars: trailChars,
            alpha: Math.min(0.95, (0.28 + Math.random() * 0.32) * (0.55 + depth * 0.45))
        });
    }
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
// 2. VẬT LÝ THỜI TIẾT 3D & BẪY MÔI TRƯỜNG
// ==========================================
window.updateWeatherPhysics = function() {
    if (window.timeStopTimer > 0) return;

    // 1. Dọn dẹp vết nứt sân đấu
    if (window.envDamage && window.envDamage.length > 0) {
        if (window.envDamage.length > 4) window.envDamage.splice(0, window.envDamage.length - 4);
        for (let i = window.envDamage.length - 1; i >= 0; i--) {
            let d = window.envDamage[i];
            if (d.life === undefined) d.life = 240;
            d.life--;
            if (d.life <= 0) window.envDamage.splice(i, 1);
        }
    }

    // 2. Cập nhật vòng gợn nước mưa dưới mặt đất (rainSplashes)
    if (window.rainSplashes && window.rainSplashes.length > 0) {
        for (let i = window.rainSplashes.length - 1; i >= 0; i--) {
            let sp = window.rainSplashes[i];
            sp.r += sp.speed;
            sp.life--;
            if (sp.life <= 0) window.rainSplashes.splice(i, 1);
        }
    }

    let wType = window.currentWeather || 'none';
    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;
    let cX = -(window.camX || 0);
    let cY = -(window.camY || 0);

    // 3. Cập nhật chuyển động Hạt thời tiết theo chiều sâu 3D
    if (window.activeWeatherFX && window.activeWeatherFX.length > 0) {
        let leftBound = cX - 220;
        let rightBound = cX + cW + 220;
        let topBound = cY - 260;
        let bottomBound = cY + cH + 120;

        let nowTime = Date.now() / 1000;
        let gentleWind = (window.globalWind || 0) * 0.35;

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            w.phase += 0.035;

            if (wType === 'toxic' || wType === 'ash') { 
                // Tro tàn & Khói độc bay lơ lửng từ dưới lên nhẹ nhàng
                w.y -= w.speed; 
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * w.swayAmp + gentleWind * w.depth; 
            } 
            else if (wType === 'fireflies') {
                // Đom đóm bay lượn tự do 2 chiều
                w.x += Math.cos(nowTime * 1.2 + w.phase) * w.speed;
                w.y += Math.sin(nowTime * 1.5 + w.phase) * w.speed * 0.8;
            }
            else if (wType === 'cosmic_dust') {
                // Bụi tinh vân trôi bồng bềnh trong vũ trụ
                w.y += Math.sin(nowTime * 0.8 + w.phase) * 0.35 * w.depth; 
                w.x += Math.cos(nowTime * 0.7 + w.phase) * 0.45 * w.depth;
            } 
            else if (wType === 'matrix_rain') {
                // Mưa số rơi thẳng đứng êm ái, thỉnh thoảng đổi ký tự số
                w.y += w.speed;
                if (Math.random() < 0.04 && w.trailChars && w.trailChars.length > 0) {
                    w.trailChars[0] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                }
            } 
            else if (wType === 'shooting_stars') {
                // Sao băng bay chéo bầu trời
                w.y += w.speed * 1.4; 
                w.x -= w.speed * 1.9;
            } 
            else if (wType === 'rain' || wType === 'blood_rain') {
                // Mưa rào rơi xiên nhẹ theo chiều sâu
                w.y += w.speed; 
                w.x += (-1.8 * w.depth) + gentleWind * w.depth;

                // Khi hạt mưa chạm mặt đất -> Tạo vòng sóng nước bắn lên!
                if (w.y >= window.GROUND_Y && w.y - w.speed < window.GROUND_Y && Math.random() < 0.35 && window.rainSplashes.length < 28) {
                    window.rainSplashes.push({
                        x: w.x,
                        y: window.GROUND_Y + (Math.random() - 0.5) * 6,
                        r: 2 * w.depth,
                        speed: 0.85 * w.depth,
                        life: 12,
                        maxLife: 12,
                        isBlood: (wType === 'blood_rain')
                    });
                }
            }
            else if (wType === 'snow') {
                // Tuyết rơi đung đưa nhẹ nhàng theo làn gió
                w.y += w.speed;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 0.75) + gentleWind * w.depth * 0.6;
                w.ang += w.spinSpeed;
            }
            else if (wType === 'petals') {
                // Cánh hoa anh đào xoay nghiêng trong gió
                w.y += w.speed;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 1.1) + gentleWind * w.depth * 0.8;
                w.ang += w.spinSpeed * 1.5;
            }
            else { 
                w.y += w.speed; 
                w.x += Math.sin(w.phase) * w.swayAmp; 
            }

            // Thuật toán Wrap-Around giữ hạt luôn nằm trong vùng nhìn của Camera
            if (w.y > bottomBound) {
                w.y = topBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
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

    // 4. Xử lý Bẫy Môi trường & Thiên thạch
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
// 3. RENDER VẾT NỨT, THIÊN TAI & HẠT THỜI TIẾT LUNG LINH
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

// ==========================================
// 4. VẼ HIỆU ỨNG THỜI TIẾT ĐA TẦNG CHIỀU SÂU (CÓ LỚN CÓ NHỎ & LUNG LINH)
// ==========================================
window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    ctx.save();
    let wType = window.currentWeather;

    // 1. TUYẾT RƠI 3D LUNG LINH (SNOW)
    if (wType === 'snow') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let twinkle = 0.75 + Math.sin(w.phase * 1.5) * 0.25;
            let curAlpha = w.alpha * twinkle;

            // Hạt tuyết lớn ở gần có quầng sáng Bokeh mềm mại bao quanh
            if (w.depth > 0.95) {
                ctx.fillStyle = `rgba(200, 240, 255, ${curAlpha * 0.28})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 2.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Nhân tuyết trắng sáng
            ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();

            // Những bông tuyết to nhất ở tiền cảnh có ánh sao băng giá nhẹ
            if (w.depth > 1.22) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${curAlpha * 0.65})`;
                ctx.lineWidth = 1;
                let r = w.size * 1.65;
                ctx.beginPath();
                ctx.moveTo(w.x - r, w.y); ctx.lineTo(w.x + r, w.y);
                ctx.moveTo(w.x, w.y - r); ctx.lineTo(w.x, w.y + r);
                ctx.stroke();
            }
        }
    }
    // 2. MƯA SỐ MA TRẬN 3 TẦNG KÍCH CỠ (MATRIX RAIN)
    else if (wType === 'matrix_rain') {
        ctx.textAlign = "center";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let fontSize = Math.round(9 + w.depth * 6.5); // Chữ xa 11px, chữ gần 18px
            ctx.font = `bold ${fontSize}px monospace`;

            let chars = w.trailChars || ["1", "0", "1"];
            for (let c = 0; c < chars.length; c++) {
                let charY = w.y - c * (fontSize * 1.05);
                if (c === 0) {
                    // Ký tự dẫn đầu sáng rực màu trắng-ngọc lục bảo
                    if (w.depth > 0.9) {
                        ctx.fillStyle = `rgba(0, 255, 128, ${w.alpha * 0.28})`;
                        ctx.beginPath();
                        ctx.arc(w.x, charY - fontSize * 0.35, fontSize * 0.75, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = `rgba(220, 255, 235, ${Math.min(1, w.alpha * 1.25)})`;
                    ctx.fillText(chars[c], w.x, charY);
                } else {
                    // Các ký tự đuôi phía trên mờ dần tạo vệt mưa số thực tế
                    let tailAlpha = w.alpha * (1 - c / chars.length) * 0.82;
                    ctx.fillStyle = `rgba(0, 255, 95, ${tailAlpha})`;
                    ctx.fillText(chars[c], w.x, charY);
                }
            }
        }
    }
    // 3. MƯA RÀO & MƯA HUYẾT KÈM SÓNG NƯỚC BẮN DƯỚI SÀN (RAIN / BLOOD RAIN)
    else if (wType === 'rain' || wType === 'blood_rain') {
        let isBlood = (wType === 'blood_rain');
        ctx.lineCap = "round";

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let len = (isBlood ? 20 : 16) * w.depth;
            let dx = -len * 0.22;
            ctx.lineWidth = (isBlood ? 1.8 : 1.25) * w.depth;
            ctx.strokeStyle = isBlood
                ? `rgba(255, 55, 75, ${w.alpha * 0.85})`
                : `rgba(175, 225, 255, ${w.alpha * 0.75})`;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x + dx, w.y + len);
            ctx.stroke();
        }

        // Vẽ các vòng sóng nước bắn lên trên mặt đất
        if (window.rainSplashes && window.rainSplashes.length > 0) {
            for (let i = 0; i < window.rainSplashes.length; i++) {
                let sp = window.rainSplashes[i];
                let spAlpha = (sp.life / sp.maxLife) * 0.65;
                ctx.strokeStyle = sp.isBlood
                    ? `rgba(255, 70, 90, ${spAlpha})`
                    : `rgba(190, 235, 255, ${spAlpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.ellipse(sp.x, sp.y, sp.r * 2.2, sp.r * 0.55, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    // 4. CÁNH HOA ANH ĐÀO XOAY 3D TRONG GIÓ (PETALS)
    else if (wType === 'petals') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let flipScale = 0.35 + Math.abs(Math.cos(w.phase)) * 0.65;
            let pW = w.size * 1.65;
            let pH = w.size * 0.85 * flipScale;

            if (w.depth > 1.0) {
                ctx.fillStyle = `rgba(255, 160, 200, ${w.alpha * 0.25})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, pW * 1.3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = (i % 2 === 0)
                ? `rgba(255, 145, 190, ${w.alpha})`
                : `rgba(255, 205, 225, ${w.alpha})`;
            ctx.beginPath();
            ctx.ellipse(w.x, w.y, pW, pH, w.ang, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // 5. TRO TÀN NÚI LỬA & KHÓI ĐỘC PHÁT SÁNG (ASH / TOXIC)
    else if (wType === 'ash' || wType === 'toxic') {
        let isAsh = (wType === 'ash');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let pulse = 0.65 + Math.abs(Math.sin(w.phase)) * 0.35;
            let a = w.alpha * pulse;

            // Lớp quầng sáng ngoài
            ctx.fillStyle = isAsh
                ? `rgba(255, 90, 0, ${a * 0.32})`
                : `rgba(46, 213, 115, ${a * 0.25})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Lõi tàn lửa / hạt độc sáng rực
            ctx.fillStyle = isAsh
                ? `rgba(255, 200, 70, ${Math.min(1, a * 1.2)})`
                : `rgba(120, 255, 170, ${a})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // 6. ĐOM ĐÓM RỪNG ĐÊM & BỤI TINH VÂN VŨ TRỤ (FIREFLIES / COSMIC DUST)
    else if (wType === 'fireflies' || wType === 'cosmic_dust') {
        let isFirefly = (wType === 'fireflies');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let glow = 0.25 + Math.abs(Math.sin(w.phase * 0.85)) * 0.75;
            let outerCol = isFirefly
                ? `rgba(241, 196, 15, ${glow * w.alpha * 0.32})`
                : (i % 2 === 0 ? `rgba(0, 243, 255, ${glow * w.alpha * 0.3})` : `rgba(185, 103, 255, ${glow * w.alpha * 0.3})`);
            let coreCol = isFirefly
                ? `rgba(255, 250, 190, ${glow * w.alpha})`
                : `rgba(255, 255, 255, ${glow * w.alpha})`;

            ctx.fillStyle = outerCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 3.0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = coreCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 0.95, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // 7. MƯA SAO BĂNG ĐA TẦNG (SHOOTING STARS)
    else if (wType === 'shooting_stars') {
        ctx.lineCap = "round";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let tailX = w.x + w.speed * 7.5;
            let tailY = w.y - w.speed * 5.5;

            let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${w.alpha})`);
            grad.addColorStop(0.3, `rgba(0, 243, 255, ${w.alpha * 0.65})`);
            grad.addColorStop(1, "rgba(0, 243, 255, 0)");

            ctx.strokeStyle = grad;
            ctx.lineWidth = w.size * 0.95;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Đầu ngôi sao băng lấp lánh
            ctx.fillStyle = `rgba(255, 255, 255, ${w.alpha})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 1.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
};
