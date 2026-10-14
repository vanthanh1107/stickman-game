// ==========================================
// ENGINE_REND.JS - HỆ THỐNG VẼ ĐỒ HỌA & VÒNG LẶP CHÍNH (BẢN PRO 60FPS)
// ĐÃ FIX: TẮT HOÀN TOÀN NGHIÊNG MÀN HÌNH (TILT), MÉO HÌNH (SKEW) & XOAY 3D CHÓNG MẶT
// ĐÃ TỐI ƯU: LOẠI BỎ CTX.FILTER BLUR GÂY GIẬT LAG, GIỮ KHUNG HÌNH TRONG TRẺO & MƯỢT MÀ
// ==========================================

window.draw = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx) return;
    
    // Giữ khóa góc xoay 3D & độ nghiêng luôn bằng 0 để nền không bao giờ bị chao đảo
    window.camOrbitAngle = 0;
    window.targetCamOrbitAngle = 0;
    window.cameraTilt = 0;
    window.targetTilt = 0;
    window.cinemaBarsHeight += ((window.targetCinemaBars || 0) - (window.cinemaBarsHeight || 0)) * 0.1;

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;
    window.ctx.filter = 'none';

    // Xóa sạch khung hình mỗi frame (không dùng mờ nhòe gây bóng ma khó nhìn)
    window.ctx.fillStyle = "#000000";
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    // Phép chiếu phẳng ổn định (không làm lật mặt hay méo tỷ lệ nhân vật khi trượt)
    let project3D = (obj) => {
        return { 
            drawX: obj.x, 
            drawY: obj.y, 
            drawZ: 0, 
            drawScale: obj.scale || 1.0, 
            drawFacingRight: obj.isFacingRight 
        };
    };

    let allFighters = []; 
    if (window.p1) allFighters.push(window.p1); 
    if (window.enemies) allFighters = allFighters.concat(window.enemies); 
    allFighters = allFighters.filter(f => f);
    
    let sortedFighters = allFighters.map(f => { 
        let proj = project3D(f); 
        f.drawX = proj.drawX; 
        f.drawY = proj.drawY; 
        f.drawZ = proj.drawZ; 
        f.drawScale = proj.drawScale; 
        f.drawFacingRight = proj.drawFacingRight; 
        return f; 
    });

    // Màn hình Loading
    if (window.isLoading) {
        let cx = window.canvas.width / 2; 
        let cy = window.canvas.height / 2;
        let tConf = window.thumbnailConfig || { hue: 0, title: "LOADING", emoji: "🔥", rayCount: 16 };
        
        window.ctx.fillStyle = `hsl(${tConf.hue}, 85%, 22%)`;
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        
        window.ctx.save();
        window.ctx.translate(cx, cy);
        window.ctx.rotate(Date.now() / 2000);
        window.ctx.fillStyle = `hsl(${tConf.hue + 30}, 100%, 50%)`;
        window.ctx.globalAlpha = 0.35;
        for (let i = 0; i < tConf.rayCount; i++) {
            window.ctx.beginPath();
            window.ctx.moveTo(0, 0);
            let angle1 = (Math.PI * 2 / tConf.rayCount) * i;
            let angle2 = (Math.PI * 2 / tConf.rayCount) * (i + 0.5);
            window.ctx.lineTo(Math.cos(angle1) * 1500, Math.sin(angle1) * 1500);
            window.ctx.lineTo(Math.cos(angle2) * 1500, Math.sin(angle2) * 1500);
            window.ctx.fill();
        }
        window.ctx.restore();

        window.ctx.save();
        window.ctx.translate(cx, cy - 35 + Math.sin(Date.now() / 150) * 10);
        window.ctx.font = "110px Arial";
        window.ctx.textAlign = "center";
        window.ctx.textBaseline = "middle";
        window.ctx.fillText(tConf.emoji, 0, 0);
        window.ctx.restore();

        window.ctx.font = "italic 900 42px 'Arial Black', Impact";
        window.ctx.textAlign = "center";
        window.ctx.lineWidth = 8; 
        window.ctx.strokeStyle = "#000";
        window.ctx.strokeText(tConf.title, cx, cy + 75);
        window.ctx.fillStyle = "#fff";
        window.ctx.fillText(tConf.title, cx, cy + 75);

        window.ctx.strokeStyle = "#fff"; 
        window.ctx.lineWidth = 3; 
        window.ctx.strokeRect(cx - 180, window.canvas.height - 55, 360, 16);
        window.ctx.fillStyle = "#ff4757"; 
        window.ctx.fillRect(cx - 177, window.canvas.height - 52, (window.loadProgress / 100) * 354, 10);
        return; 
    }

    window.ctx.save();

    try {
        // Rung nhẹ tại chỗ khi có đòn đánh cực mạnh (giới hạn biên độ nhỏ để không nhức mắt)
        if (window.shakeTime > 0) {
            let safeMag = Math.min(window.shakeMag || 2, 4);
            window.ctx.translate((Math.random() - 0.5) * safeMag, (Math.random() - 0.5) * safeMag); 
        }
        
        // Camera phẳng, KHÔNG rotate, KHÔNG skew biến dạng
        let actualZoom = Math.max(0.95, Math.min(1.15, window.currentZoom || 1));
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        // Vẽ bầu trời & cảnh nền
        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        let skyGrad = window.ctx.createLinearGradient(0, -300, 0, window.GROUND_Y); 
        skyGrad.addColorStop(0, cmap.sky); 
        skyGrad.addColorStop(1, cmap.bg1); 
        window.ctx.fillStyle = skyGrad; 
        window.ctx.fillRect(-window.camX - 1000, -1000, window.canvas.width + 2000, window.canvas.height + 2000);

        // Lớp nền xa (bg2) - Parallax mượt mà
        window.ctx.save(); 
        let cx2 = window.camX * 0.3; 
        window.ctx.translate(cx2, 0); 
        window.ctx.fillStyle = cmap.bg2; 
        let t2 = cmap.bg2Type || "mountains";
        if (t2 === "flowing_water" || t2 === "flowing_lava") {
            let isLava = (t2 === "flowing_lava"); 
            let waveSpeed = Date.now() / (isLava ? 600 : 300); 
            let waterBaseY = window.GROUND_Y - 10; 
            let colorBack = isLava ? "rgba(192, 57, 43, 0.9)" : "rgba(22, 160, 133, 0.9)"; 
            let colorMid = isLava ? "rgba(211, 84, 0, 0.8)" : "rgba(41, 128, 185, 0.8)"; 
            const drawWaveLayer = (color, amplitude, frequency, phase, offsetY) => { 
                window.ctx.fillStyle = color; 
                window.ctx.beginPath(); 
                let startX = -cx2 - 800; 
                let endX = -cx2 + window.canvas.width + 800; 
                window.ctx.moveTo(startX, window.canvas.height + 200); 
                window.ctx.lineTo(startX, waterBaseY + offsetY); 
                for (let x = startX; x <= endX; x += 50) { 
                    let y = waterBaseY + offsetY + Math.sin((x * frequency) + waveSpeed + phase) * amplitude; 
                    window.ctx.lineTo(x, y); 
                } 
                window.ctx.lineTo(endX, window.canvas.height + 200); 
                window.ctx.fill(); 
            };
            drawWaveLayer(colorBack, 10, 0.008, 0, -5); 
            drawWaveLayer(colorMid, 6, 0.012, 2, 5); 
        } else {
            let startI2 = Math.floor((-cx2 - 800) / 150) * 150; 
            let endI2 = -cx2 + window.canvas.width + 800;
            for (var i = startI2; i < endI2; i += 150) {
                if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i + 75, window.GROUND_Y - 120 + Math.sin(i * 0.01) * 30); window.ctx.lineTo(i + 150, window.GROUND_Y); window.ctx.fill(); }
                else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i + 100, window.GROUND_Y - 150); window.ctx.lineTo(i + 200, window.GROUND_Y); window.ctx.fill(); }
                else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i + 75, window.GROUND_Y - 15, 100, 10, 0, 0, Math.PI * 2); window.ctx.fill(); }
                else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y - 180 + Math.sin(i * 0.01) * 30, 60, 0, Math.PI * 2); window.ctx.arc(i + 50, window.GROUND_Y - 150 + Math.cos(i * 0.01) * 20, 50, 0, Math.PI * 2); window.ctx.fill(); }
                else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i + Math.sin(i * 0.01) * 50, window.GROUND_Y - 220 + Math.cos(i * 0.01) * 80, 3, 0, Math.PI * 2); window.ctx.fill(); }
            }
        } 
        window.ctx.restore();

        // Lớp nền gần (bg1)
        window.ctx.save(); 
        let cx1 = window.camX * 0.15; 
        window.ctx.translate(cx1, 0); 
        window.ctx.fillStyle = cmap.bg1; 
        let startI1 = Math.floor((-cx1 - 800) / 120) * 120; 
        let endI1 = -cx1 + window.canvas.width + 800;
        for (var i = startI1; i < endI1; i += 120) {
            let t1 = cmap.bg1Type || "city"; 
            let h = 100 + Math.abs(Math.sin(i * 0.01)) * 80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y - h, 70, h); }
            else if (t1 === "trees") { window.ctx.fillRect(i + 25, window.GROUND_Y - h, 20, h); window.ctx.beginPath(); window.ctx.arc(i + 35, window.GROUND_Y - h, 45, 0, Math.PI * 2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i + 25, window.GROUND_Y - 30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y - 20); window.ctx.lineTo(i + 30, window.GROUND_Y - h); window.ctx.lineTo(i + 60, window.GROUND_Y - 20); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i + 10, window.GROUND_Y - h, 40, h); window.ctx.fillRect(i, window.GROUND_Y - 20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y - h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i + 30, window.GROUND_Y - 60, 30, Math.PI, 0); window.ctx.lineTo(i + 60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); }
            else if (t1 === "digital") { window.ctx.fillStyle = "rgba(0, 255, 0, 0.15)"; window.ctx.font = "bold 20px monospace"; window.ctx.fillText("01", i, window.GROUND_Y - h); }
        } 
        window.ctx.restore();

        // Mặt đất phẳng, rõ nét
        let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); 
        groundGrad.addColorStop(0, cmap.ground); 
        groundGrad.addColorStop(1, "#000000"); 
        window.ctx.fillStyle = groundGrad; 
        window.ctx.fillRect(-3000, window.GROUND_Y, window.canvas.width + 6000, window.canvas.height - window.GROUND_Y + 600); 

        window.ctx.strokeStyle = cmap.line; 
        window.ctx.lineWidth = 3; 
        window.ctx.beginPath(); 
        window.ctx.moveTo(-2000, window.GROUND_Y); 
        window.ctx.lineTo(window.canvas.width + 2000, window.GROUND_Y); 
        window.ctx.stroke();
        
        // Bóng đổ dưới chân nhân vật
        window.ctx.save(); 
        sortedFighters.forEach(p => { 
            if (p && p.hp >= 0) { 
                let heightDist = Math.max(0, window.GROUND_Y - p.drawY); 
                let shadowScale = Math.max(0.15, 1 - heightDist / 250) * p.drawScale; 
                window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`; 
                window.ctx.beginPath(); 
                window.ctx.ellipse(p.drawX, window.GROUND_Y, 32 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2); 
                window.ctx.fill(); 
            } 
        });
        window.ctx.restore();

        // Vẽ tàn ảnh (Ghost Trails) từ main.js nếu có
        if (typeof window.drawGhostTrails === 'function') {
            window.drawGhostTrails(window.ctx);
        }

        // Vẽ Nhân Vật Chính & Boss
        if (window.p1) {
            sortedFighters.forEach(p => { 
                window.ctx.save(); 
                window.ctx.globalAlpha = 1.0;
                if (typeof window.drawAura === 'function') window.drawAura(window.ctx, p);

                if (p.state === 'ko_falling' || p.state === 'dead') { 
                    window.ctx.translate(p.drawX, p.drawY); 
                    let angle = Math.PI / 2; 
                    if (p.state === 'ko_falling') { 
                        let progress = (100 - p.koTimer) / 30; 
                        if (progress > 1) progress = 1; 
                        angle = progress * (Math.PI / 2); 
                    } 
                    let fallDir = p.drawFacingRight ? -1 : 1; 
                    window.ctx.rotate(angle * fallDir); 
                    let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                    if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                    else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); 
                    else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); 
                    else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); 
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } else { 
                    let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                    window.ctx.translate(p.drawX, p.drawY); 
                    if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
                    if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                    else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); 
                    else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); 
                    else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); 
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                }
                window.ctx.restore();
            }); 
        }

        // Vẽ các hiệu ứng kỹ năng (Hố đen, Cột năng lượng, Bẫy, Đạn, Laser, Vệt chém)
        window.blackHoles.forEach(b => {
            window.ctx.save(); window.ctx.translate(b.x, b.y);
            window.ctx.globalAlpha = Math.min(1, b.life / 20); 
            window.ctx.fillStyle = "#111";
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.5, 0, Math.PI * 2); window.ctx.fill(); 
            window.ctx.strokeStyle = "#8e44ad"; window.ctx.lineWidth = 8;
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.75, 0, Math.PI * 2); window.ctx.stroke(); 
            window.ctx.restore();
        });

        window.ctx.globalCompositeOperation = 'lighter';
        window.energyPillars.forEach(p => {
            window.ctx.save(); window.ctx.translate(p.x, p.y);
            window.ctx.globalAlpha = Math.min(1, p.life / 15);
            let grad = window.ctx.createLinearGradient(0, 0, 0, -600 * p.scaleY); 
            grad.addColorStop(0, p.color); grad.addColorStop(1, "rgba(255,255,255,0)");
            window.ctx.fillStyle = grad; 
            window.ctx.fillRect(-p.r, -600 * p.scaleY, p.r * 2, 600 * p.scaleY);
            window.ctx.restore();
        });
        window.ctx.globalCompositeOperation = 'source-over'; 
        window.ctx.globalAlpha = 1.0;

        window.traps.forEach(t => { 
            window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2); 
            window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; 
            window.ctx.fill(); window.ctx.globalAlpha = 1.0; 
        });

        window.projectiles.forEach(proj => { 
            window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); 
            window.ctx.fillStyle = proj.color; window.ctx.fill(); 
            if (proj.isMeteor) { 
                window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius + 8, 0, Math.PI * 2); 
                window.ctx.fillStyle = "rgba(230, 126, 34, 0.35)"; window.ctx.fill(); 
            } 
        });
        
        window.auras.forEach(a => { 
            let prog = a.life / a.maxLife; 
            window.ctx.globalCompositeOperation = 'lighter'; 
            window.ctx.globalAlpha = prog * 0.6; 
            window.ctx.fillStyle = a.color; 
            if (a.life % 4 > 1) { 
                window.ctx.beginPath(); window.ctx.ellipse(a.x, window.GROUND_Y, a.r, a.r * 0.25, 0, 0, Math.PI * 2); window.ctx.fill(); 
            } 
            window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; 
        });

        window.lasers.forEach(l => { 
            let prog = l.life / l.maxLife; 
            window.ctx.globalCompositeOperation = 'lighter'; 
            window.ctx.globalAlpha = prog; 
            window.ctx.fillStyle = l.color; 
            let currentWidth = l.width * (0.8 + Math.random() * 0.3); 
            let startX = l.x; 
            let endX = l.isRight ? window.canvas.width + 500 : -500; 
            window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth / 2, Math.abs(endX - startX), currentWidth); 
            window.ctx.fillStyle = "#fff"; 
            window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth / 4, Math.abs(endX - startX), currentWidth / 2); 
            window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; 
        });

        window.slashes.forEach(s => { 
            window.ctx.save(); window.ctx.translate(s.x, s.y); 
            if (!s.isRight) window.ctx.scale(-1, 1); 
            let safeScale = Math.min(s.scale || 1.2, 1.8);
            window.ctx.scale(safeScale, safeScale); 
            window.ctx.rotate(s.rotation || 0); 
            let prog = 1 - (s.life / s.maxLife); 
            window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); 
            window.ctx.beginPath(); window.ctx.arc(0, 0, 45 + prog * 20, -Math.PI / 2 + prog * 1.5, Math.PI / 2 - prog * 1.5); 
            window.ctx.lineWidth = 14 * (1 - prog); window.ctx.strokeStyle = "#fff"; window.ctx.lineCap = "round"; window.ctx.stroke(); 
            window.ctx.beginPath(); window.ctx.arc(0, 0, 42 + prog * 25, -Math.PI / 2 + prog * 1.2, Math.PI / 2 - prog * 1.2); 
            window.ctx.lineWidth = 26 * (1 - prog); window.ctx.strokeStyle = s.color; window.ctx.globalAlpha *= 0.45; window.ctx.stroke(); 
            window.ctx.restore(); 
        });
        
        window.particles.forEach(pt => { 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); 
            window.ctx.fillStyle = pt.color; 
            if (pt.isGroundDust) { window.ctx.beginPath(); window.ctx.ellipse(pt.x, window.GROUND_Y - pt.size / 2, pt.size * 1.3, pt.size * 0.35, 0, 0, Math.PI * 2); window.ctx.fill(); }
            else if (pt.isRubble) { window.ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size); } 
            else { window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); window.ctx.fill(); }
        }); 
        window.ctx.globalAlpha = 1.0;

        window.ctx.globalCompositeOperation = 'lighter';
        window.lightningArcs.forEach(l => {
            if (!l.pts || l.pts.length === 0) return;
            window.ctx.save(); window.ctx.strokeStyle = l.color || "#fff"; window.ctx.lineWidth = 2.5; window.ctx.beginPath();
            window.ctx.moveTo(l.pts[0].x, l.pts[0].y);
            for (let i = 1; i < l.pts.length; i++) { window.ctx.lineTo(l.pts[i].x, l.pts[i].y); }
            window.ctx.stroke(); window.ctx.restore();
        });

        window.shockwaves.forEach(sw => { 
            window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2); 
            window.ctx.lineWidth = 3; window.ctx.strokeStyle = sw.color; 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); 
        });
        
        window.impactSparks.forEach(isp => { 
            window.ctx.save(); window.ctx.translate(isp.x, isp.y); 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); 
            window.ctx.fillStyle = isp.color; 
            let len = Math.min(25, Math.sqrt(isp.vx * isp.vx + isp.vy * isp.vy) * 1.8); 
            let ang = Math.atan2(isp.vy, isp.vx); 
            window.ctx.rotate(ang); 
            window.ctx.fillRect(-len / 2, -1.5, len, 3);
            window.ctx.restore(); 
        });
        window.ctx.globalCompositeOperation = "source-over"; 
        window.ctx.globalAlpha = 1.0;

        // Vẽ chữ Floating Texts nhỏ gọn, có giới hạn chống phình to
        window.floatingTexts.forEach(t => { 
            window.ctx.save(); 
            window.ctx.translate(t.x, t.y); 
            // Khóa chặt tỷ lệ scale tối đa là 1.15 để chữ không bao giờ phóng to che màn hình
            let safeScale = Math.max(0.8, Math.min(1.15, t.scale || 1.0)); 
            window.ctx.scale(safeScale, safeScale); 
            window.ctx.font = t.font || "bold 16px Arial, sans-serif"; 
            window.ctx.fillStyle = t.color; 
            window.ctx.textAlign = "center"; 
            window.ctx.textBaseline = "middle"; 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); 
            window.ctx.lineWidth = 3; 
            window.ctx.strokeStyle = "rgba(0, 0, 0, 0.85)"; 
            window.ctx.strokeText(t.text, 0, 0); 
            window.ctx.fillText(t.text, 0, 0); 
            window.ctx.restore();
        }); 

        window.ctx.restore(); // KẾT THÚC CAMERA TRANSFORM

        // Hiển thị Combo Rank nhỏ gọn ở góc trên
        let renderComboRank = function(fighter, xPos, align) {
            if (fighter && fighter.comboHits >= 2) {
                let alpha = Math.max(0, fighter.comboAlpha || 1); 
                let hits = fighter.comboHits; 
                let rank = "D"; let rankColor = "#bdc3c7"; let rankSize = 26;
                if (hits >= 4) { rank = "C"; rankColor = "#2ecc71"; rankSize = 28; } 
                if (hits >= 6) { rank = "B"; rankColor = "#3498db"; rankSize = 30; } 
                if (hits >= 8) { rank = "A"; rankColor = "#9b59b6"; rankSize = 32; } 
                if (hits >= 12) { rank = "S"; rankColor = "#f1c40f"; rankSize = 35; } 
                if (hits >= 16) { rank = "SS"; rankColor = "#e67e22"; rankSize = 38; } 
                if (hits >= 20) { rank = "SSS"; rankColor = "#ff003c"; rankSize = 42; }
                
                window.ctx.save();
                window.ctx.globalAlpha = alpha; 
                window.ctx.textAlign = align; 
                let baseY = 75; 
                window.ctx.fillStyle = rankColor; 
                window.ctx.font = `italic 900 ${rankSize}px 'Arial Black', Impact`; 
                window.ctx.lineWidth = 3;
                window.ctx.strokeStyle = "#000";
                window.ctx.strokeText(rank, xPos, baseY);
                window.ctx.fillText(rank, xPos, baseY);
                
                window.ctx.font = "bold 14px Arial"; 
                window.ctx.fillStyle = "#fff"; 
                window.ctx.strokeText(`🔥 ${hits} HITS`, xPos, baseY + 22);
                window.ctx.fillText(`🔥 ${hits} HITS`, xPos, baseY + 22); 
                window.ctx.restore();
            }
        };

        renderComboRank(window.p1, 30, "left"); 
        let maxEnemyCombo = null; 
        window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; }); 
        renderComboRank(maxEnemyCombo, window.canvas.width - 30, "right");

        // Màn hình Intro VS đầu trận gọn đẹp
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.save(); 
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.introTimer > 60) {
                let progress = Math.min(1, (160 - window.introTimer) / 40); 
                let cx = window.canvas.width / 2; 
                let cy = window.canvas.height / 2; 
                let p1Name = (window.p1.className || "PLAYER 1").toUpperCase(); 
                let repEnemy = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; 
                let p2Name = repEnemy ? (repEnemy.className || "ENEMY").toUpperCase() : "ENEMY";
                
                window.ctx.fillStyle = "#001b36"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
                window.ctx.beginPath(); window.ctx.moveTo(cx + 120, 0); window.ctx.lineTo(window.canvas.width, 0); window.ctx.lineTo(window.canvas.width, window.canvas.height); window.ctx.lineTo(cx - 120, window.canvas.height); window.ctx.fillStyle = "#2b000b"; window.ctx.fill();
                window.ctx.beginPath(); window.ctx.moveTo(cx + 120, 0); window.ctx.lineTo(cx - 120, window.canvas.height); window.ctx.lineWidth = 6; window.ctx.strokeStyle = "#f1c40f"; window.ctx.stroke();
                
                let easeOut = 1 - Math.pow(1 - progress, 4); 
                let textX1 = -200 + (cx - 80 - (-200)) * easeOut; 
                let textX2 = window.canvas.width + 200 - ((window.canvas.width + 200) - (cx + 80)) * easeOut;
                
                window.ctx.font = "900 32px Arial"; window.ctx.textAlign = "right"; window.ctx.textBaseline = "middle"; 
                window.ctx.fillStyle = "#00f3ff"; window.ctx.fillText(p1Name, textX1, cy - 70); 
                window.ctx.textAlign = "left"; window.ctx.fillStyle = "#ff003c"; window.ctx.fillText(p2Name, textX2, cy - 70); 
                
                let targetX1 = 180; let targetX2 = window.canvas.width - 180; 
                let slideX1 = -100 + (targetX1 - (-100)) * easeOut; 
                let slideX2 = window.canvas.width + 100 - (window.canvas.width + 100 - targetX2) * easeOut; 
                let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y + 40, state: window.p1.introState || 'idle', isFacingRight: true, scale: (window.p1.scale || 1) * 1.35}); 
                if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                
                if (repEnemy) { 
                    let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y + 40, state: repEnemy.isDragon ? 'idle' : (repEnemy.introState || 'idle'), isFacingRight: false, scale: (repEnemy.scale || 1) * 1.35}); 
                    if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, repEnemy); 
                    else if (repEnemy.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p2Clone); 
                    else if (repEnemy.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p2Clone); 
                    else if (repEnemy.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p2Clone); 
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                }
                if (window.introTimer <= 140) { 
                    window.ctx.save(); window.ctx.translate(cx, cy + 30); 
                    window.ctx.font = "italic 900 55px Arial"; window.ctx.textAlign = "center"; 
                    window.ctx.fillStyle = "#fff"; window.ctx.fillText("VS", 0, 0); window.ctx.restore(); 
                }
            } else { 
                let fadeAlpha = (window.introTimer / 60) * 0.6; 
                window.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`; 
                window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
                window.ctx.save(); window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
                window.ctx.font = "italic 900 54px Arial"; window.ctx.fillStyle = "#ff4757"; 
                window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 4; 
                window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; 
                window.ctx.strokeText("🥊 FIGHT! 🥊", 0, 0); window.ctx.fillText("🥊 FIGHT! 🥊", 0, 0); 
                window.ctx.restore(); 
            }
            window.ctx.restore();
        }

    } finally { 
        window.ctx.restore(); 
    }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
};

// ==========================================
// 7. TIME-ENGINE VÀ PHYSICS LOOP CHUẨN XÁC (KHÔNG KHỰNG HITSTOP)
// ==========================================
window.lastFrameTime = 0; 
window.physicsAccumulator = 0;
window.PHYSICS_STEP = 1000 / 60; 

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    
    if (!timestamp) timestamp = performance.now(); 
    if (!window.lastFrameTime) window.lastFrameTime = timestamp;
    let deltaTime = timestamp - window.lastFrameTime; 
    window.lastFrameTime = timestamp; 
    
    if (deltaTime > 100) deltaTime = 100; 
    
    // Luôn giữ tốc độ thời gian thực 1.0 để không bao giờ bị khựng/lag
    window.hitStopFrames = 0;
    window.timeScale = 1.0;
    window.physicsAccumulator += deltaTime;

    while (window.physicsAccumulator >= window.PHYSICS_STEP) {
        try { if (typeof window.update === 'function') window.update(); } catch(e) { } 
        window.physicsAccumulator -= window.PHYSICS_STEP;
    }

    // Nội suy Camera êm ái, khóa cứng độ nghiêng = 0
    window.currentZoom += ((window.targetZoom || 1) - window.currentZoom) * 0.08;
    window.camX += ((window.targetCamX || 0) - window.camX) * 0.1; 
    window.camY += ((window.targetCamY || 0) - window.camY) * 0.1; 
    window.cameraTilt = 0;
    window.camOrbitAngle = 0;

    try { if (typeof window.draw === 'function') window.draw(); } catch(e) { } 
};

if (typeof window !== 'undefined') {
    setTimeout(() => { if (typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100);
}
