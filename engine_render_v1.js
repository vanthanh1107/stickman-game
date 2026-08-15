// ==========================================
// ENGINE_RENDER.JS - HỆ THỐNG VẼ ĐỒ HỌA TRUNG TÂM
// Đã tích hợp Nâng cấp KO Điện ảnh Tối giản (Minimalist Cinematic KO)
// ==========================================

window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    // Khởi tạo các biến trạng thái KO
    let isFatalKO = (window.fatalKOTimer > 0);
    let isKoImpact = (window.fatalKOTimer > 90); // Giả sử timer bắt đầu từ 100-120

    window.camVelocityX = window.targetCamX - window.camX;
    
    // Snap khung hình điện ảnh lập tức nếu đang KO
    if (isFatalKO) { window.cinemaBarsHeight = 120; } 
    else { window.cinemaBarsHeight += (window.targetCinemaBars - window.cinemaBarsHeight) * 0.1; }

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;
    
    if (window.bassDropFrames > 0) { window.ctx.filter = `blur(${window.bassDropFrames * 1.5}px) saturate(${100 + window.bassDropFrames * 30}%) contrast(1.5)`; } else { window.ctx.filter = 'none'; }

    let blurStrength = 0.35 + (Math.abs(window.camVelocityX) * 0.01);
    if (blurStrength > 0.9) blurStrength = 0.9;
    window.ctx.fillStyle = `rgba(0, 0, 0, ${blurStrength})`;
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    let impactShift = 0; if (window.impactAberration > 0) { impactShift = window.impactAberration * (Math.random() > 0.5 ? 1 : -1); }

    let cosA = Math.cos(window.camOrbitAngle || 0); let sinA = Math.sin(window.camOrbitAngle || 0);
    window.orbitFocusX = window.orbitFocusX || window.canvas.width/2;

    let project3D = (obj) => {
        let dx = obj.x - window.orbitFocusX; let pX = window.orbitFocusX + dx * cosA; let pZ = dx * sinA;
        let pY = obj.y - pZ * 0.02; 
        let bScale = obj.scale || 1.0; let pScale = bScale * (1 + pZ * 0.0035); if (pScale < 0.1) pScale = 0.1;
        let pFacing = obj.isFacingRight;
        if (typeof obj.isFacingRight !== 'undefined') {
            let normAngle = ((window.camOrbitAngle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2);
            if (normAngle > Math.PI / 2 && normAngle < Math.PI * 1.5) { pFacing = !pFacing; }
        }
        return { drawX: pX, drawY: pY, drawZ: pZ, drawScale: pScale, drawFacingRight: pFacing };
    };

    let allFighters = []; if (window.p1) allFighters.push(window.p1); if (window.enemies) allFighters = allFighters.concat(window.enemies); allFighters = allFighters.filter(f => f);
    let sortedFighters = allFighters.map(f => { let proj = project3D(f); f.drawX = proj.drawX; f.drawY = proj.drawY; f.drawZ = proj.drawZ; f.drawScale = proj.drawScale; f.drawFacingRight = proj.drawFacingRight; return f; }).sort((a,b) => a.drawZ - b.drawZ);

    if (window.invertFrames > 0) {
        window.ctx.save(); window.ctx.fillStyle = "#ffffff"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = 'difference';
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0 && typeof window.drawStickman === 'function') { 
                window.ctx.save(); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
                let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                else window.drawStickman(window.ctx, clone); 
                window.ctx.restore(); 
            } 
        }); window.ctx.restore(); return; 
    }

    if (window.impactFrameCount > 0) {
        window.ctx.save(); window.ctx.fillStyle = window.impactFrameCount % 2 === 0 ? "#000000" : "#ffffff"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = window.impactFrameCount % 2 === 0 ? 'screen' : 'multiply';
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0) { 
                window.ctx.save(); window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(window.currentZoom, window.currentZoom); window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1);
                let sketchColor = window.impactFrameCount % 2 === 0 ? "#ff003c" : "#000000";
                if (typeof window.drawStickman === 'function') { window.ctx.strokeStyle = sketchColor; window.ctx.lineWidth = 15; window.ctx.lineCap = "round"; window.ctx.lineJoin = "round"; window.ctx.beginPath(); window.ctx.moveTo(0, 0); window.ctx.lineTo(0, -60); window.ctx.lineTo(-20, -30); window.ctx.moveTo(0, -60); window.ctx.lineTo(20, -30); window.ctx.moveTo(0, 0); window.ctx.lineTo(-20, 40); window.ctx.moveTo(0, 0); window.ctx.lineTo(20, 40); window.ctx.stroke(); window.ctx.fillStyle = sketchColor; window.ctx.beginPath(); window.ctx.arc(0, -80, 20, 0, Math.PI*2); window.ctx.fill(); }
                window.ctx.restore(); 
            } 
        }); window.ctx.restore(); return; 
    }
    
    if (window.isLoading) {
        // [Đã thu gọn để tiết kiệm không gian - Giữ nguyên mã của bạn]
        let cx = window.canvas.width / 2; let cy = window.canvas.height / 2;
        let tConf = window.thumbnailConfig || { hue: 0, title: "LOADING", emoji: "🔥", rayCount: 16 };
        window.ctx.fillStyle = `hsl(${tConf.hue}, 90%, 25%)`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.save(); window.ctx.translate(cx, cy); window.ctx.rotate(Date.now() / 2000); window.ctx.fillStyle = `hsl(${tConf.hue + 30}, 100%, 50%)`; window.ctx.globalAlpha = 0.4;
        for (let i = 0; i < tConf.rayCount; i++) { window.ctx.beginPath(); window.ctx.moveTo(0, 0); let angle1 = (Math.PI * 2 / tConf.rayCount) * i; let angle2 = (Math.PI * 2 / tConf.rayCount) * (i + 0.5); window.ctx.lineTo(Math.cos(angle1) * 2000, Math.sin(angle1) * 2000); window.ctx.lineTo(Math.cos(angle2) * 2000, Math.sin(angle2) * 2000); window.ctx.fill(); } window.ctx.restore();
        window.ctx.save(); window.ctx.translate(cx, cy - 50 + Math.sin(Date.now()/150)*20); window.ctx.rotate(Math.sin(Date.now()/200)*0.2); window.ctx.font = "250px Arial"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.shadowBlur = 50; window.ctx.shadowColor = "#000"; window.ctx.fillText(tConf.emoji, 0, 0); window.ctx.restore();
        window.ctx.font = "italic 900 85px 'Arial Black', Impact"; window.ctx.textAlign = "center"; window.ctx.lineWidth = 15; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(tConf.title, cx, cy + 150); window.ctx.fillStyle = "#fff"; window.ctx.fillText(tConf.title, cx, cy + 150);
        window.ctx.shadowBlur = 0; window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 6; window.ctx.strokeRect(cx - 250, window.canvas.height - 80, 500, 24); window.ctx.fillStyle = "#ff4757"; window.ctx.fillRect(cx - 247, window.canvas.height - 77, (window.loadProgress / 100) * 494, 18); window.ctx.fillStyle = "#fff"; window.ctx.font = "bold 20px monospace"; window.ctx.fillText(`RENDERING MASTERPIECE... ${Math.floor(window.loadProgress)}%`, cx, window.canvas.height - 20); 
        return; 
    }

    window.ctx.save(); // BẮT ĐẦU CAMERA 3D
    if (window.screenTearing > 0) {
        let tearY = Math.random() * window.canvas.height; let tearHeight = Math.random() * 150 + 50; let tearShift = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 50 + 20);
        window.ctx.beginPath(); window.ctx.rect(0, tearY, window.canvas.width, tearHeight); window.ctx.clip(); window.ctx.translate(tearShift, 0); window.ctx.filter = `hue-rotate(${Math.random()*360}deg) saturate(300%)`;
    }

    try {
        if (window.vhsGlitchTimer > 0) { let glitchShift = (Math.random() - 0.5) * 30; window.ctx.translate(glitchShift, 0); }
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        
        window.camDriftX = (window.camDriftX || 0) + (Math.random() - 0.5) * 0.5; window.camDriftY = (window.camDriftY || 0) + (Math.random() - 0.5) * 0.5;
        window.camDriftX *= 0.95; window.camDriftY *= 0.95;
        
        let camBreathX = Math.sin(Date.now() / 1300) * 3 + Math.cos(Date.now() / 700) * 2 + window.camDriftX;
        let camBreathY = Math.cos(Date.now() / 1100) * 3 + Math.sin(Date.now() / 900) * 2 + window.camDriftY;
        window.ctx.translate(camBreathX, camBreathY);
        if (typeof impactShift !== 'undefined' && impactShift !== 0) { window.ctx.translate(impactShift, 0); }

        let focusHunt = Math.sin(Date.now() / 200) * 0.005; let actualZoom = window.currentZoom + focusHunt;
        let dynamicYaw = Math.max(0.85, 1 - Math.abs(window.camVelocityX) * 0.001);
        let dynamicSkew = -(window.camVelocityX * 0.002) + window.actionCamSkew; 
        
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        window.ctx.transform(dynamicYaw, 0, dynamicSkew, 1, 0, 0);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        if (window.filterTimer > 0 && window.screenFilter) {
            if (window.screenFilter === 'invert') { window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = "#fff"; window.ctx.fillRect(-800, -800, 3000, 3000); window.ctx.globalCompositeOperation = 'source-over'; }
            else if (window.screenFilter === 'blood') { window.ctx.globalCompositeOperation = 'multiply'; window.ctx.fillStyle = `rgba(255, 0, 0, ${window.filterTimer/100})`; window.ctx.fillRect(-800, -800, 3000, 3000); window.ctx.globalCompositeOperation = 'source-over'; }
            else if (window.screenFilter === 'dark') { window.ctx.fillStyle = `rgba(0, 0, 0, 0.75)`; window.ctx.fillRect(-800, -800, 3000, 3000); }
        }
        
        if (window.screenFilter === 'grayscale') { window.ctx.filter = 'grayscale(100%) contrast(120%) brightness(60%)'; } 
        else if (!window.bassDropFrames) { window.ctx.filter = `contrast(${window.viralColorGrade.contrast}%) brightness(${window.viralColorGrade.brightness}%) saturate(${window.viralColorGrade.saturation}%) hue-rotate(${window.viralColorGrade.hue}deg)`; }

        // --- MÔI TRƯỜNG & BACKGROUND ---
        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        let bgPanOffset = window.camOrbitAngle * 1200;
        let skyGrad = window.ctx.createLinearGradient(0, -400, 0, window.GROUND_Y); skyGrad.addColorStop(0, cmap.sky); skyGrad.addColorStop(1, cmap.bg1); 
        window.ctx.fillStyle = skyGrad; window.ctx.save(); let cxSky = (window.camX + bgPanOffset) * 0.95; window.ctx.translate(cxSky, 0); 
        window.ctx.fillRect(-cxSky - 1500, -3000, window.canvas.width + 3000, window.canvas.height + 6000); window.ctx.restore();

        window.ctx.save(); window.ctx.globalCompositeOperation = "screen"; let rayShift = Date.now() / 3000; let cxRays = (window.camX + bgPanOffset) * 0.85; window.ctx.translate(cxRays, 0);
        let startR = Math.floor((-cxRays - 1500) / 250) * 250; let endR = -cxRays + window.canvas.width + 1500;
        for(let r = startR; r < endR; r += 250) { 
            let rayAlpha = 0.05 + Math.abs(Math.sin(rayShift + r * 0.01)) * 0.05; window.ctx.fillStyle = `rgba(255, 255, 255, ${rayAlpha})`; window.ctx.beginPath(); 
            window.ctx.moveTo(r + Math.sin(rayShift)*100, -800); window.ctx.lineTo(r + 100 + Math.sin(rayShift)*100, -800); window.ctx.lineTo(r + 400, window.GROUND_Y); window.ctx.lineTo(r + 200, window.GROUND_Y); window.ctx.fill(); 
        } window.ctx.restore();

        window.ctx.save(); let cx2 = (window.camX + bgPanOffset) * 0.6; window.ctx.translate(cx2, 0); window.ctx.fillStyle = cmap.bg2; let t2 = cmap.bg2Type || "mountains";
        if (t2 === "flowing_water" || t2 === "flowing_lava") {
            let isLava = (t2 === "flowing_lava"); let waveSpeed = Date.now() / (isLava ? 600 : 300); let waterBaseY = window.GROUND_Y - 10; 
            let colorBack = isLava ? "rgba(192, 57, 43, 0.9)" : "rgba(22, 160, 133, 0.9)"; let colorMid = isLava ? "rgba(211, 84, 0, 0.8)" : "rgba(41, 128, 185, 0.8)"; let colorFront = isLava ? "rgba(241, 196, 15, 0.7)" : "rgba(52, 152, 219, 0.7)"; 
            const drawWaveLayer = (color, amplitude, frequency, phase, offsetY) => { 
                window.ctx.fillStyle = color; window.ctx.beginPath(); let startX = -cx2 - 1500; let endX = -cx2 + window.canvas.width + 1500; 
                window.ctx.moveTo(startX, window.canvas.height + 400); window.ctx.lineTo(startX, waterBaseY + offsetY); 
                for (let x = startX; x <= endX; x += 40) { let y = waterBaseY + offsetY + Math.sin((x * frequency) + waveSpeed + phase) * amplitude; window.ctx.lineTo(x, y); } 
                window.ctx.lineTo(endX, window.canvas.height + 400); window.ctx.fill(); 
            };
            drawWaveLayer(colorBack, 12, 0.008, 0, -5); drawWaveLayer(colorMid, 8, 0.012, 2, 5); drawWaveLayer(colorFront, 5, 0.018, 4, 15); 
        } else {
            let startI2 = Math.floor((-cx2 - 1500) / 150) * 150; let endI2 = -cx2 + window.canvas.width + 1500;
            for(var i = startI2; i < endI2; i += 150) {
                if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+75, window.GROUND_Y-120+Math.sin(i*0.01)*30); window.ctx.lineTo(i+150, window.GROUND_Y); window.ctx.fill(); }
                else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+100, window.GROUND_Y-150); window.ctx.lineTo(i+200, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+40, window.GROUND_Y-50, 120, 5); window.ctx.fillRect(i+60, window.GROUND_Y-80, 80, 5); }
                else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i+75, window.GROUND_Y-15, 100, 10, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.ellipse(i+20, window.GROUND_Y-30, 60, 5, 0, 0, Math.PI*2); window.ctx.fill(); }
                else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y-180+Math.sin(i*0.01)*30, 60, 0, Math.PI*2); window.ctx.arc(i+50, window.GROUND_Y-150+Math.cos(i*0.01)*20, 50, 0, Math.PI*2); window.ctx.fill(); }
                else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i+Math.sin(i*0.01)*50, window.GROUND_Y-250+Math.cos(i*0.01)*100, 3+Math.random()*4, 0, Math.PI*2); window.ctx.fill(); }
            }
        } window.ctx.restore();

        window.ctx.save(); let cx1 = (window.camX + bgPanOffset) * 0.2; window.ctx.translate(cx1, 0); window.ctx.fillStyle = cmap.bg1; let startI1 = Math.floor((-cx1 - 1500) / 120) * 120; let endI1 = -cx1 + window.canvas.width + 1500;
        for(var i = startI1; i < endI1; i += 120) {
            let t1 = cmap.bg1Type || "city"; let h = 100 + Math.abs(Math.sin(i*0.01))*80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y-h, 70, h); if(Math.abs(i)%360===0) window.ctx.clearRect(i+10, window.GROUND_Y-h+20, 15, 20); }
            else if (t1 === "trees") { window.ctx.fillRect(i+25, window.GROUND_Y-h, 20, h); window.ctx.beginPath(); window.ctx.arc(i+35, window.GROUND_Y-h, 45, 0, Math.PI*2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i+25, window.GROUND_Y-30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y-20); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+60, window.GROUND_Y-20); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y-10); window.ctx.lineTo(i+30, window.GROUND_Y-h+40); window.ctx.lineTo(i+70, window.GROUND_Y-10); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i+10, window.GROUND_Y-h, 40, h); window.ctx.fillRect(i, window.GROUND_Y-20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y-h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i+30, window.GROUND_Y-60, 30, Math.PI, 0); window.ctx.lineTo(i+60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+25, window.GROUND_Y-100, 10, 30); window.ctx.fillRect(i+15, window.GROUND_Y-90, 30, 5); }
            else if (t1 === "digital") { window.ctx.fillStyle = "rgba(0, 255, 0, 0.15)"; window.ctx.font="bold 20px monospace"; window.ctx.fillText("01", i, window.GROUND_Y-h); }
        } window.ctx.restore();

        window.ctx.save(); let fogT = Date.now() / 1500; let startFog = Math.floor((-window.camX * 0.2 - 1500) / 250) * 250; let endFog = -window.camX * 0.2 + window.canvas.width + 1500;
        for(let i = startFog; i < endFog; i += 250) {
            let fogX = i + Math.cos(fogT + i*0.01)*40; let fogY = window.GROUND_Y - 20 + Math.sin(fogT + i*0.01)*10;
            let fogGrad = window.ctx.createRadialGradient(fogX, fogY, 0, fogX, fogY, 180); fogGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 + Math.sin(fogT+i*0.01)*0.03})`); fogGrad.addColorStop(1, "rgba(255, 255, 255, 0)"); window.ctx.fillStyle = fogGrad; window.ctx.beginPath(); window.ctx.arc(fogX, fogY, 180, 0, Math.PI*2); window.ctx.fill();
        } window.ctx.restore();
        
        let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); groundGrad.addColorStop(0, cmap.ground); groundGrad.addColorStop(1, "#000000"); 
        window.ctx.fillStyle = groundGrad; window.ctx.fillRect(-6000, window.GROUND_Y, window.canvas.width + 12000, window.canvas.height - window.GROUND_Y + 1000); 

        window.ctx.save(); window.ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`; window.ctx.lineWidth = 2; window.ctx.beginPath();
        let vanishingPointX = window.canvas.width / 2 + window.camX * 0.3 + Math.sin(window.camOrbitAngle) * 500; 
        let startG = Math.floor((-window.camX * 1.5 - 6000) / 150) * 150; let endG = -window.camX * 1.5 + window.canvas.width + 6000;
        for(let i = startG; i <= endG; i += 150) { window.ctx.moveTo(vanishingPointX, window.GROUND_Y); window.ctx.lineTo(i, window.canvas.height + 800); }
        for(let j = 0; j <= 800; j += 40) { let wY = window.GROUND_Y + j*j*0.005; if(wY > window.canvas.height + 300) break; window.ctx.moveTo(-6000, wY); window.ctx.lineTo(window.canvas.width + 6000, wY); }
        window.ctx.stroke(); window.ctx.restore();

        if (window.lethalVoid > 0) { window.ctx.save(); window.ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.95, window.lethalVoid / 20)})`; window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000); window.ctx.restore(); }

        // ====================================================
        // KHỐI NÂNG CẤP KO 1: THE VOID (BÓNG TỐI TỬ THẦN)
        // Phủ bóng tối lên toàn bộ bối cảnh để tập trung vào nhân vật
        // ====================================================
        if (isKoImpact) {
            // Chớp sáng đỏ/trắng toàn màn hình lúc va chạm
            window.ctx.save();
            window.ctx.fillStyle = (window.fatalKOTimer % 4 < 2) ? "#ffffff" : "#ff0000";
            window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000);
            window.ctx.restore();
            // Xóa bớt rác rườm rà
            window.particles = []; window.bokehs = [];
        } else if (isFatalKO) {
            window.ctx.save();
            let voidAlpha = Math.min(0.85, window.fatalKOTimer / 20); 
            window.ctx.fillStyle = `rgba(5, 5, 10, ${voidAlpha})`; // Lớp sương mù đen tuyền
            window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000);
            
            // Spotlight lờ mờ rọi vào trung tâm
            let spotlight = window.ctx.createRadialGradient(
                -window.camX, window.GROUND_Y - 200 - window.camY, 0,
                -window.camX, window.GROUND_Y - 200 - window.camY, 800
            );
            spotlight.addColorStop(0, `rgba(255, 255, 255, ${voidAlpha * 0.25})`);
            spotlight.addColorStop(1, "rgba(0, 0, 0, 0)");
            window.ctx.fillStyle = spotlight;
            window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000);
            window.ctx.restore();
            
            // Tắt các hạt thừa trong quá trình ngã
            window.particles = []; window.bokehs = [];
        }
        // ====================================================

        window.ctx.save();
        let reflectionGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.GROUND_Y + 300);
        reflectionGrad.addColorStop(0, "rgba(255, 255, 255, 0.2)"); reflectionGrad.addColorStop(1, "rgba(0, 0, 0, 0.8)"); 
        window.ctx.globalAlpha = 0.35; window.ctx.translate(0, window.GROUND_Y); window.ctx.scale(1, -0.6); 
        let distY = window.shakeTime > 0 ? Math.sin(Date.now() / 50) * 10 : 0; window.ctx.translate(0, -window.GROUND_Y + distY);
        sortedFighters.forEach(p => { 
            if (p && p.hp > 0 && typeof window.drawStickman === 'function' && !isKoImpact) { 
                window.ctx.save(); window.ctx.translate(p.drawX, p.drawY); if (!p.drawFacingRight) window.ctx.scale(-1, 1); 
                let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); 
                if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                else window.drawStickman(window.ctx, clone); 
                window.ctx.restore(); 
            } 
        });
        window.ctx.restore();
        window.ctx.save(); window.ctx.fillStyle = reflectionGrad; window.ctx.globalCompositeOperation = "overlay"; window.ctx.fillRect(-6000, window.GROUND_Y, window.canvas.width + 12000, 300); window.ctx.restore();

        if (window.globalIllumination && window.lethalVoid <= 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = window.globalIllumination.mix;
            let cx = window.canvas.width/2 - window.camX; let cy = window.GROUND_Y - 300 - window.camY;
            let dynGlow = window.ctx.createRadialGradient(cx, cy, 0, cx, cy, 2500);
            dynGlow.addColorStop(0, window.globalIllumination.color1); dynGlow.addColorStop(1, window.globalIllumination.color2);
            window.ctx.fillStyle = dynGlow; window.ctx.fillRect(-3000, -3000, window.canvas.width + 6000, window.canvas.height + 6000); window.ctx.restore();
        }

        window.ctx.strokeStyle = cmap.line; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-2000, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 2000, window.GROUND_Y); window.ctx.stroke();
        
        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        sortedFighters.forEach(p => { if (p && p.hp >= 0) { let heightDist = Math.max(0, window.GROUND_Y - p.drawY); let shadowScale = Math.max(0.15, 1 - heightDist / 250) * p.drawScale; window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.drawX, window.GROUND_Y - p.drawZ * 0.15, 35 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2); window.ctx.fill(); } });
        window.ctx.restore();

        if (window.inkSplatters) { window.inkSplatters.forEach(ink => { let proj = project3D(ink); window.ctx.save(); window.ctx.translate(proj.drawX, proj.drawY); window.ctx.rotate(ink.ang); window.ctx.scale(proj.drawScale, proj.drawScale); window.ctx.globalAlpha = Math.max(0, ink.life / ink.maxLife); window.ctx.fillStyle = ink.color; window.ctx.beginPath(); window.ctx.moveTo(0,0); window.ctx.quadraticCurveTo(60, -25, 200, -10); window.ctx.quadraticCurveTo(90, 25, 0, 0); window.ctx.fill(); for(let i=0; i<4; i++) { window.ctx.beginPath(); window.ctx.arc(120 + Math.random()*100, (Math.random()-0.5)*70, Math.random()*12, 0, Math.PI*2); window.ctx.fill(); } window.ctx.restore(); }); }

        window.ctx.filter = 'none';

        if (window.p1) {
            window.ctx.globalCompositeOperation = 'lighter'; 
            if (!isKoImpact) { // Ẩn trail khi đang ăn chém
                sortedFighters.forEach(p => { 
                    if (p && p.hp > 0 && p.trailArr) { 
                        p.trailArr.forEach(t => { 
                            let pseudoObj = {x: t.x, y: p.y, scale: t.scale, isFacingRight: t.isFacingRight}; let proj = project3D(pseudoObj); window.ctx.save(); window.ctx.globalAlpha = t.alpha;
                            let scaleDown = 1 - (t.timer * 0.02); if (scaleDown < 0.1) scaleDown = 0.1;
                            window.ctx.filter = p.isPlayer ? 'sepia(1) hue-rotate(180deg) saturate(300%) contrast(200%)' : 'sepia(1) hue-rotate(300deg) saturate(300%) contrast(200%)';
                            let trailP = Object.assign({}, p, {x: 0, y: 0, state: t.state, isFacingRight: proj.drawFacingRight, color: t.color, alpha: t.alpha, scale: proj.drawScale * scaleDown}); 
                            window.ctx.translate(proj.drawX, proj.drawY); if (!proj.drawFacingRight) window.ctx.scale(-1, 1);
                            if (trailP.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, trailP, true); 
                            else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                            window.ctx.restore();
                        }); 
                    } 
                });
            }
            window.ctx.globalCompositeOperation = "source-over"; window.ctx.globalAlpha = 1.0; window.ctx.filter = 'none';

            let chromaOffset = window.impactAberration > 0 ? window.impactAberration * 0.8 : 0;
            let renderPasses = chromaOffset > 0 ? [{c: 'drop-shadow(0 0 0 red)', o: -chromaOffset}, {c: 'drop-shadow(0 0 0 blue)', o: chromaOffset}] : [{c: 'none', o: 0}];
            
            if (chromaOffset > 0) window.ctx.globalCompositeOperation = 'screen';

            renderPasses.forEach(pass => {
                sortedFighters.forEach(p => { 
                    window.ctx.save(); window.ctx.globalAlpha = 1.0; 
                    
                    // ====================================================
                    // KHỐI NÂNG CẤP KO 2: SILHOUETTE (HÌNH BÓNG TƯƠNG PHẢN)
                    // ====================================================
                    let activeFilter = pass.c;
                    if (isKoImpact) {
                        // Biến nhân vật thành bóng đen tuyền với viền trắng phát sáng
                        activeFilter = 'brightness(0) drop-shadow(0 0 15px rgba(255,255,255,1))';
                    } else if (isFatalKO) {
                        // Nhạt màu và tối đi sau khi nhát chém kết thúc
                        activeFilter = 'contrast(1.4) saturate(0.2) ' + (pass.c === 'none' ? '' : pass.c);
                    }
                    window.ctx.filter = activeFilter;
                    // ====================================================

                    if (p.state === 'ko_falling' || p.state === 'dead') { window.ctx.translate(p.drawX + pass.o, p.drawY); let angle = Math.PI / 2; if (p.state === 'ko_falling') { let progress = (100 - p.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = p.drawFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                    } else { let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); window.ctx.translate(p.drawX + pass.o, p.drawY); if(!p.drawFacingRight) window.ctx.scale(-1, 1); if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone); else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone); else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); }
                    window.ctx.restore();
                }); 
            });
            window.ctx.globalCompositeOperation = "source-over";
        }

        window.ctx.filter = 'none'; window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0;

        // Bỏ qua vẽ hiệu ứng phụ rườm rà nếu đang trong KO đặc biệt
        if (!isFatalKO) {
            window.blackHoles.forEach(b => {
                let pr = project3D(b); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.scale(pr.drawScale, pr.drawScale);
                let alpha = Math.min(1, b.life / 20); window.ctx.globalAlpha = alpha; window.ctx.globalCompositeOperation = 'destination-out';
                window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.5, 0, Math.PI*2); window.ctx.fill(); 
                window.ctx.globalCompositeOperation = 'lighter'; window.ctx.shadowBlur = 50; window.ctx.shadowColor = "#9b59b6"; window.ctx.strokeStyle = "#8e44ad"; window.ctx.lineWidth = 15;
                window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.8 + Math.random()*20, 0, Math.PI*2); window.ctx.stroke(); window.ctx.restore();
            });

            window.ctx.globalCompositeOperation = 'lighter';
            window.energyPillars.forEach(p => {
                let pr = project3D(p); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY);
                let alpha = Math.min(1, p.life / 15); window.ctx.globalAlpha = alpha;
                let grad = window.ctx.createLinearGradient(0, 0, 0, -800 * p.scaleY); grad.addColorStop(0, p.color); grad.addColorStop(1, "rgba(255,255,255,0)");
                window.ctx.fillStyle = grad; window.ctx.shadowBlur = 40; window.ctx.shadowColor = p.color; window.ctx.fillRect(-p.r * pr.drawScale, -800 * p.scaleY, p.r * 2 * pr.drawScale, 800 * p.scaleY);
                window.ctx.restore();
            });
            window.ctx.globalCompositeOperation = 'source-over'; window.ctx.globalAlpha = 1.0;

            window.traps.forEach(t => { let proj = project3D(t); window.ctx.beginPath(); window.ctx.arc(proj.drawX, proj.drawY, t.radius * proj.drawScale, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
            window.projectiles.forEach(proj => { let pr = project3D(proj); window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, proj.radius * pr.drawScale, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.shadowBlur = 15; window.ctx.shadowColor = proj.color; window.ctx.fill(); if(proj.isMeteor) { window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, (proj.radius + 10) * pr.drawScale, 0, Math.PI * 2); window.ctx.fillStyle = "rgba(230, 126, 34, 0.4)"; window.ctx.fill(); } window.ctx.shadowBlur = 0; });
            
            window.auras.forEach(a => { let pr = project3D(a); let prog = a.life / a.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog * 0.8; let aGrad = window.ctx.createRadialGradient(pr.drawX, pr.drawY - 10, 0, pr.drawX, pr.drawY - 10, a.r * pr.drawScale); aGrad.addColorStop(0, a.color); aGrad.addColorStop(1, "rgba(0,0,0,0)"); window.ctx.fillStyle = aGrad; if (a.life % 4 > 1) { window.ctx.beginPath(); window.ctx.ellipse(pr.drawX, window.GROUND_Y - pr.drawZ*0.15, a.r*pr.drawScale, a.r*0.3*pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); } window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; });
            window.lasers.forEach(l => { let pr = project3D(l); let prog = l.life / l.maxLife; window.ctx.globalCompositeOperation = 'lighter'; window.ctx.globalAlpha = prog; window.ctx.shadowBlur = 20; window.ctx.shadowColor = l.color; window.ctx.fillStyle = l.color; let currentWidth = l.width * (0.8 + Math.random() * 0.4) * pr.drawScale; let startX = pr.drawX; let endX = l.isRight ? window.canvas.width + 500 : -500; window.ctx.fillRect(l.isRight ? startX : endX, pr.drawY - currentWidth/2, Math.abs(endX - startX), currentWidth); window.ctx.fillStyle = "#fff"; window.ctx.fillRect(l.isRight ? startX : endX, pr.drawY - currentWidth/4, Math.abs(endX - startX), currentWidth/2); window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0; window.ctx.globalCompositeOperation = 'source-over'; });

            window.slashes.forEach(s => { 
                let pr = project3D(s); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale * pr.drawScale, s.scale * pr.drawScale); window.ctx.rotate(s.rotation || 0); 
                let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); 
                window.ctx.beginPath(); window.ctx.arc(0, 0, 50 + prog * 30, -Math.PI/2 + prog*1.5, Math.PI/2 - prog*1.5); 
                window.ctx.lineWidth = 20 * (1 - prog); window.ctx.strokeStyle = "#fff"; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 30; window.ctx.shadowColor = s.color; window.ctx.stroke(); 
                window.ctx.beginPath(); window.ctx.arc(0, 0, 45 + prog * 35, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); 
                window.ctx.lineWidth = 40 * (1 - prog); window.ctx.strokeStyle = s.color; window.ctx.globalAlpha *= 0.5; window.ctx.stroke(); 
                window.ctx.restore(); 
            });
            
            window.particles.forEach(pt => { 
                let pr = project3D(pt); window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fillStyle = pt.color; 
                if (pt.isGroundDust) { window.ctx.beginPath(); window.ctx.ellipse(pr.drawX, window.GROUND_Y - pr.drawZ*0.15 - pt.size/2, pt.size * 1.5 * pr.drawScale, pt.size * 0.4 * pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); }
                else if (pt.isRubble) { window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(pt.life * 0.1); window.ctx.fillRect(-pt.size/2*pr.drawScale, -pt.size/2*pr.drawScale, pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.restore(); } 
                else if (pt.isGlass) { window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(pt.life * 0.2); window.ctx.beginPath(); window.ctx.moveTo(0, -pt.size*pr.drawScale); window.ctx.lineTo(pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.lineTo(-pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.fill(); window.ctx.restore(); } 
                else { window.ctx.shadowBlur = 10; window.ctx.shadowColor = pt.color; window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, pt.size*pr.drawScale, 0, Math.PI*2); window.ctx.fill(); window.ctx.shadowBlur = 0; if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } }
            }); window.ctx.globalAlpha = 1.0; window.ctx.shadowBlur = 0;
            
            window.ctx.globalCompositeOperation = 'lighter';
            window.lensFlares.forEach(lf => { let pr = project3D(lf); let lProg = lf.life / lf.maxLife; window.ctx.globalAlpha = Math.pow(lProg, 2); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); let lfGrad = window.ctx.createRadialGradient(0, 0, 0, 0, 0, 300 * lf.scale * pr.drawScale); lfGrad.addColorStop(0, "#fff"); lfGrad.addColorStop(0.1, lf.color); lfGrad.addColorStop(1, "rgba(0,0,0,0)"); window.ctx.fillStyle = lfGrad; window.ctx.fillRect(-400 * lf.scale * pr.drawScale, -4 * lf.scale * pr.drawScale, 800 * lf.scale * pr.drawScale, 8 * lf.scale * pr.drawScale); window.ctx.fillRect(-8 * lf.scale, -100 * lf.scale, 16 * lf.scale, 200 * lf.scale); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 * lf.scale * pr.drawScale, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
            window.ctx.globalAlpha = 1.0;

            window.ctx.globalCompositeOperation = 'lighter';
            window.lightningArcs.forEach(l => {
                window.ctx.save(); window.ctx.shadowBlur = 20; window.ctx.shadowColor = l.color; window.ctx.strokeStyle = "#fff"; window.ctx.lineWidth = 3 + Math.random()*2; window.ctx.beginPath();
                let p0 = project3D(l.pts[0]); window.ctx.moveTo(p0.drawX, p0.drawY);
                for(let i=1; i<l.pts.length; i++) { let pi = project3D({x: l.pts[i].x + (Math.random()-0.5)*10, y: l.pts[i].y + (Math.random()-0.5)*10}); window.ctx.lineTo(pi.drawX, pi.drawY); }
                window.ctx.stroke(); window.ctx.restore();
            });
            window.ctx.globalCompositeOperation = 'source-over';

            window.shockwaves.forEach(sw => { let pr = project3D(sw); window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, sw.r*pr.drawScale, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.shadowBlur = 15; window.ctx.shadowColor = sw.color; window.ctx.stroke(); window.ctx.shadowBlur = 0; });
            
            window.ctx.globalCompositeOperation = 'lighter';
            window.spaceRipples.forEach(r => {
                let pr = project3D(r); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY);
                window.ctx.beginPath(); window.ctx.arc(0, 0, r.r * pr.drawScale, 0, Math.PI*2);
                window.ctx.lineWidth = 20 * (r.life / r.maxLife) * pr.drawScale; 
                window.ctx.strokeStyle = r.color; window.ctx.shadowBlur = 40; window.ctx.shadowColor = r.color; 
                window.ctx.globalAlpha = Math.max(0, r.life / r.maxLife); window.ctx.stroke(); window.ctx.restore();
            });
            
            window.impactSparks.forEach(isp => { 
                let pr = project3D(isp); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); 
                window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.shadowBlur = 15; window.ctx.shadowColor = isp.color; 
                window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2.5 * pr.drawScale; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 3*pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); 
            });
            window.ctx.globalCompositeOperation = "source-over"; window.ctx.shadowBlur = 0;

            if (window.dimensionCracks && window.dimensionCracks.length > 0) {
                window.ctx.save(); window.ctx.globalCompositeOperation = 'lighter'; 
                window.dimensionCracks.forEach(c => {
                    let alpha = Math.max(0, c.life / c.maxLife); window.ctx.globalAlpha = alpha;
                    const drawCrackPath = (path, width) => {
                        if (path.length < 2) return; window.ctx.beginPath(); let p0 = project3D(path[0]); window.ctx.moveTo(p0.drawX, p0.drawY);
                        for (let i = 1; i < path.length; i++) { let pi = project3D(path[i]); window.ctx.lineTo(pi.drawX, pi.drawY); }
                        window.ctx.lineWidth = width * alpha * p0.drawScale; window.ctx.stroke();
                    };
                    window.ctx.lineCap = "round"; window.ctx.lineJoin = "miter";
                    window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#ffffff"; window.ctx.strokeStyle = "rgba(220, 255, 255, 0.5)"; 
                    drawCrackPath(c.main, 12); c.branches.forEach(b => drawCrackPath(b, 5));
                    window.ctx.shadowBlur = 0; window.ctx.strokeStyle = "#ffffff";
                    drawCrackPath(c.main, 3); c.branches.forEach(b => drawCrackPath(b, 1.5));
                }); window.ctx.restore();
            }
        } // KẾT THÚC KHỐI BỎ QUA KHI KO

        if (window.mangaSfx) {
            window.mangaSfx.forEach(sfx => {
                let pr = project3D(sfx); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(sfx.ang); window.ctx.scale(pr.drawScale, pr.drawScale); let alpha = Math.min(1, sfx.life / 10); window.ctx.globalAlpha = alpha;
                window.ctx.font = `900 italic ${sfx.size}px Impact, Arial Black, sans-serif`; window.ctx.lineWidth = 4; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(sfx.text, 0, 0); window.ctx.fillStyle = sfx.isCrit ? "#ff003c" : "#ffffff"; window.ctx.fillText(sfx.text, 0, 0); window.ctx.restore();
            });
        }

        if (window.foregroundDebris && window.foregroundDebris.length > 0) {
            window.ctx.save(); window.ctx.filter = 'blur(4px)'; 
            window.foregroundDebris.forEach(d => { window.ctx.save(); window.ctx.translate(d.x, d.y); window.ctx.rotate(d.rot); window.ctx.scale(d.scale, d.scale); window.ctx.globalAlpha = Math.max(0, d.life / d.maxLife); window.ctx.fillStyle = "#333"; window.ctx.fillRect(-15, -15, 30, 30); window.ctx.restore(); });
            window.ctx.restore();
        }

        if (!isFatalKO) { // Ẩn overlay tròn khi KO
            window.ctx.save(); window.ctx.filter = 'blur(15px)'; window.ctx.globalCompositeOperation = 'screen'; let timeB = Date.now() / 1000; window.ctx.fillStyle = window.p1 ? (window.p1.isFacingRight ? 'rgba(255, 50, 50, 0.15)' : 'rgba(50, 150, 255, 0.15)') : 'rgba(255, 255, 255, 0.1)';
            for(let b=0; b<6; b++) { let bx = ((b * 500 + timeB * 400 - window.camX * 2.5) % 3000) - 500; let by = window.canvas.height/2 + Math.sin(b + timeB)*300; window.ctx.beginPath(); window.ctx.arc(bx, by, 80 + b*20, 0, Math.PI*2); window.ctx.fill(); }
            window.ctx.restore();
        }

        window.floatingTexts.forEach(t => { 
            let pr = project3D(t); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (t.rot) window.ctx.rotate(t.rot); let s = t.scale || 1.0; window.ctx.scale(s * pr.drawScale, s * pr.drawScale); window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.lineWidth = 4; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(t.text, 0, 0); window.ctx.shadowBlur = 15; window.ctx.shadowColor = t.color; window.ctx.fillText(t.text, 0, 0); window.ctx.restore();
        }); 

        window.ctx.restore(); // KẾT THÚC CAMERA 3D --- (CHUYỂN SANG VẼ TRÊN SCREEN SPACE)

        // ====================================================
        // KHỐI NÂNG CẤP KO 3: NHÁT CHÉM TỬ THẦN (RAZOR SLASH)
        // Vẽ cứng trên màn hình (Screen Space), không bị trôi theo Camera
        // ====================================================
        if (isFatalKO && window.fatalKOTimer > 60) { // Chỉ xuất hiện nhanh rồi biến mất
            window.ctx.save();
            let slashProgress = 1 - ((window.fatalKOTimer - 60) / 40); // 0.0 -> 1.0
            
            if (slashProgress < 0.6) {
                let slashAngle = window.koSlashAngle || (Math.PI / 5); 
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2);
                window.ctx.rotate(slashAngle);
                
                let thickness = (window.fatalKOTimer % 3 === 0) ? 15 : (50 * Math.max(0, (0.5 - slashProgress)*2));
                window.ctx.fillStyle = "#ffffff";
                window.ctx.globalCompositeOperation = 'screen'; // Làm sáng lóa
                
                // Vẽ dải chém chính
                window.ctx.fillRect(-window.canvas.width*1.5, -thickness/2, window.canvas.width*3, thickness);
                
                // Vẽ các vệt xước nhỏ xung quanh đường chém
                for(let i = 0; i < 8; i++) {
                    let offset = (Math.random() - 0.5) * 80;
                    let long = 500 + Math.random() * 1000;
                    window.ctx.fillRect(-long/2 + (Math.random()-0.5)*500, offset, long, 2 + Math.random()*3);
                }
            }
            window.ctx.restore();
        }
        // ====================================================

        if (window.bokehs.length > 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = 'screen';
            window.bokehs.forEach(b => {
                window.ctx.save();
                let prX = window.canvas.width/2 + (b.x - window.camX) * b.z;
                let prY = window.canvas.height/2 + (b.y - window.camY) * b.z;
                window.ctx.translate(prX, prY);
                window.ctx.globalAlpha = Math.min(1, b.life / 50) * 0.4;
                window.ctx.fillStyle = b.color;
                window.ctx.filter = 'blur(10px)'; 
                window.ctx.beginPath(); window.ctx.arc(0, 0, b.size * b.z, 0, Math.PI*2); window.ctx.fill();
                window.ctx.restore();
            });
            window.ctx.restore();
        }

        window.ctx.save();
        window.ctx.globalCompositeOperation = 'multiply';
        let vignette = window.ctx.createRadialGradient(window.canvas.width/2, window.canvas.height/2, window.canvas.height*0.3, window.canvas.width/2, window.canvas.height/2, window.canvas.width*0.8);
        vignette.addColorStop(0, "rgba(255, 255, 255, 1)"); 
        vignette.addColorStop(1, "rgba(100, 100, 100, 1)"); 
        window.ctx.fillStyle = vignette;
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.restore();

        if (window.screenFlash > 0 && !isKoImpact) { 
            window.ctx.globalCompositeOperation = 'screen'; window.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(window.screenFlash, 0.8)})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = 'source-over';
        }

        // ====================================================
        // KHỐI NÂNG CẤP KO 4: CINEMATIC SNAP (VIỀN ĐEN & CHỮ FATALITY)
        // ====================================================
        if (window.cinemaBarsHeight > 1) {
            window.ctx.save();
            window.ctx.fillStyle = "#000000"; 
            window.ctx.fillRect(0, 0, window.canvas.width, window.cinemaBarsHeight); 
            window.ctx.fillRect(0, window.canvas.height - window.cinemaBarsHeight, window.canvas.width, window.cinemaBarsHeight);
            
            // Text Fatality hiện lên mượt mà sau khi hết nhát chém
            if (isFatalKO && window.fatalKOTimer < 70) { 
                let textAlpha = Math.min(1, (70 - window.fatalKOTimer) / 10);
                window.ctx.globalAlpha = textAlpha;
                window.ctx.font = "italic 900 30px 'Arial Black', sans-serif";
                window.ctx.textAlign = "right";
                window.ctx.fillStyle = "#ff003c";
                
                // Thủ thuật tạo letter spacing (khoảng cách chữ) cho canvas
                let text = "F A T A L I T Y"; 
                window.ctx.fillText(text, window.canvas.width - 40, window.cinemaBarsHeight / 2 + 10);
            }
            window.ctx.restore();
        }
        // ====================================================

        let renderComboRank = function(fighter, xPos, align) {
            if (fighter && fighter.comboHits >= 2) {
                let alpha = Math.max(0, fighter.comboAlpha || 1); let hits = fighter.comboHits; let rank = "D"; let rankColor = "#bdc3c7"; let rankSize = 40; let rankGlow = 10;
                if (hits >= 4) { rank = "C"; rankColor = "#2ecc71"; rankSize = 45; } if (hits >= 6) { rank = "B"; rankColor = "#3498db"; rankSize = 50; } if (hits >= 8) { rank = "A"; rankColor = "#9b59b6"; rankSize = 55; rankGlow = 15; } if (hits >= 12) { rank = "S"; rankColor = "#f1c40f"; rankSize = 65; rankGlow = 20; } if (hits >= 16) { rank = "SS"; rankColor = "#e67e22"; rankSize = 75; rankGlow = 25; } if (hits >= 20) { rank = "SSS"; rankColor = "#ff003c"; rankSize = 90 + Math.sin(Date.now()/50)*10; rankGlow = 35; }
                window.ctx.globalAlpha = alpha; window.ctx.textAlign = align; let bounceY = Math.sin(Date.now() / 100) * 5; let baseY = 80; 
                window.ctx.shadowBlur = rankGlow; window.ctx.shadowColor = rankColor; window.ctx.fillStyle = rankColor; window.ctx.font = `italic 900 ${rankSize}px 'Arial Black', Impact`; window.ctx.fillText(rank, xPos, baseY + bounceY);
                window.ctx.font = "italic 900 20px Arial"; window.ctx.fillStyle = "#fff"; window.ctx.shadowBlur = 5; window.ctx.shadowColor = "#000"; window.ctx.fillText(`🔥 ${hits} HITS`, xPos, baseY + rankSize * 0.5 + 15 + bounceY); window.ctx.shadowBlur = 0;
            }
        };

        if (!isFatalKO) { // Ẩn UI hiển thị hit combo đi cho deep
            renderComboRank(window.p1, 40, "left"); let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; }); renderComboRank(maxEnemyCombo, window.canvas.width - 40, "right");
        }

        if (window.gameOver && window.endIconType && !isFatalKO) {
            window.ctx.save(); let popScale = Math.min(1, (window.matchEndTimer - 90) / 25); if(popScale < 0) popScale = 0; let easeScale = Math.sin(popScale * Math.PI / 2); window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(easeScale * 1.2, easeScale * 1.2); window.ctx.font = "140px Arial"; window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle"; if (window.endIconType === 'win') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🏆", 0, 0); } else if (window.endIconType === 'lose') { window.ctx.shadowBlur = 35; window.ctx.shadowColor = "#ff4757"; window.ctx.fillText("💀", 0, 0); } window.ctx.restore(); 
        }

        if (window.cinematicTimer > 0 && window.cinematicCaster) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let stripY = window.canvas.height / 2 - 50; window.ctx.fillStyle = window.cinematicCaster.color; window.ctx.fillRect(0, stripY, window.canvas.width, 100); let progress = (50 - window.cinematicTimer) / 50; let slideX = -200 + (progress * 800); window.ctx.fillStyle = "#fff"; window.ctx.font = "italic 900 60px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#fff"; window.ctx.fillText("⚡", slideX, stripY + 70); window.ctx.shadowBlur = 0; let avaX = window.canvas.width - slideX; let casterClone = Object.assign({}, window.cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); if(casterClone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, casterClone); else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, casterClone);
        }
        
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            // [Đã thu gọn để tiết kiệm không gian - Giữ nguyên mã intro của bạn]
            // ... (Phần intro của bạn)
        }

        if (window.noiseCanvas) {
            window.ctx.save(); window.ctx.setTransform(1,0,0,1,0,0); window.ctx.globalCompositeOperation = 'overlay'; window.ctx.globalAlpha = 0.6; 
            let offsetX = (Math.random() * 100) % window.noiseCanvas.width; let offsetY = (Math.random() * 100) % window.noiseCanvas.height;
            let ptrn = window.ctx.createPattern(window.noiseCanvas, 'repeat'); window.ctx.fillStyle = ptrn; window.ctx.translate(-offsetX, -offsetY); window.ctx.fillRect(0, 0, window.canvas.width + 100, window.canvas.height + 100); window.ctx.restore();
        }

    } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}
