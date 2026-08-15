// ==========================================
// ENGINE_RENDER.JS - HỆ THỐNG VẼ ĐỒ HỌA TRUNG TÂM
// PHONG CÁCH: RAW COMBAT (Không bóng đen rườm rà, Focus vào Lực Đấm)
// ==========================================

window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    let isFatalKO = (window.fatalKOTimer > 0);

    window.camVelocityX = window.targetCamX - window.camX;
    if (isFatalKO) { window.cinemaBarsHeight = 120; } 
    else { window.cinemaBarsHeight += (window.targetCinemaBars - window.cinemaBarsHeight) * 0.1; }

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0; 
    
    // BỘ LỌC MÀU: Giảm bão hòa màu, tăng tương phản để giống phim võ thuật
    window.ctx.filter = 'saturate(0.3) contrast(1.4) brightness(0.9)';

    let blurStrength = 0.35 + (Math.abs(window.camVelocityX) * 0.01);
    if (blurStrength > 0.9) blurStrength = 0.9;
    window.ctx.fillStyle = `rgba(10, 10, 12, ${blurStrength})`;
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

    // =========================================================
    // NÂNG CẤP: IMPACT FRAMES ĐỈNH CAO KHI ĐẤM TRÚNG (MANGA BURST)
    // =========================================================
    if (window.impactFrameCount > 0) {
        window.ctx.save(); 
        let isDark = (window.impactFrameCount % 2 === 0);
        window.ctx.fillStyle = isDark ? "#050505" : "#ffffff"; 
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
        
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        
        // Vẽ tia sọc vỡ òa từ tâm (Impact Starburst)
        window.ctx.fillStyle = isDark ? "#ffffff" : "#000000";
        window.ctx.beginPath();
        let rayCount = 20 + Math.random() * 20;
        for (let i = 0; i < rayCount; i++) {
            let angle = (Math.PI * 2 / rayCount) * i;
            let innerRadius = 50 + Math.random() * 100;
            let outerRadius = window.canvas.width;
            let thickness = 0.02 + Math.random() * 0.05; // Độ sắc của gai nhọn
            
            window.ctx.moveTo(Math.cos(angle - thickness) * outerRadius, Math.sin(angle - thickness) * outerRadius);
            window.ctx.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            window.ctx.lineTo(Math.cos(angle + thickness) * outerRadius, Math.sin(angle + thickness) * outerRadius);
        }
        window.ctx.fill();

        // Điểm xuyết một nhát rạch đỏ máu bạo lực ở giữa
        window.ctx.strokeStyle = "#ff003c";
        window.ctx.lineWidth = 15 + Math.random() * 20;
        window.ctx.lineCap = "butt";
        window.ctx.beginPath();
        let slashAng = Math.random() * Math.PI;
        window.ctx.rotate(slashAng);
        window.ctx.moveTo(-800, 0);
        window.ctx.lineTo(800, 0);
        window.ctx.stroke();

        window.ctx.restore(); 
        return; // Dừng render toàn bộ bối cảnh để tạo độ "khựng" của chấn động
    }
    
    if (window.isLoading) return; 

    window.ctx.save(); // BẮT ĐẦU CAMERA 3D
    try {
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        
        let focusHunt = Math.sin(Date.now() / 200) * 0.005; let actualZoom = window.currentZoom + focusHunt;
        let dynamicYaw = Math.max(0.85, 1 - Math.abs(window.camVelocityX) * 0.001);
        let dynamicSkew = -(window.camVelocityX * 0.002) + window.actionCamSkew; 
        
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        window.ctx.transform(dynamicYaw, 0, dynamicSkew, 1, 0, 0);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        // --- BACKGROUND TỐI GIẢN ---
        let bgPanOffset = window.camOrbitAngle * 1200;
        let skyGrad = window.ctx.createLinearGradient(0, -400, 0, window.GROUND_Y); 
        skyGrad.addColorStop(0, "#111418"); 
        skyGrad.addColorStop(1, "#202428"); 
        window.ctx.fillStyle = skyGrad; window.ctx.fillRect(-6000, -3000, 12000, window.canvas.height + 6000);

        let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); 
        groundGrad.addColorStop(0, "#0a0a0c"); groundGrad.addColorStop(1, "#000000"); 
        window.ctx.fillStyle = groundGrad; window.ctx.fillRect(-6000, window.GROUND_Y, 12000, 2000); 

        window.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; window.ctx.lineWidth = 2; 
        window.ctx.beginPath(); window.ctx.moveTo(-6000, window.GROUND_Y); window.ctx.lineTo(6000, window.GROUND_Y); window.ctx.stroke();

        // Không gian tử thần KO (Chỉ tối đi, không nhấp nháy, không chớp)
        if (isFatalKO) {
            window.ctx.fillStyle = `rgba(5, 5, 5, ${Math.min(0.85, window.fatalKOTimer / 20)})`; 
            window.ctx.fillRect(-3000, -3000, 6000, 6000);
        }

        // Bóng nhân vật dưới mặt đất
        window.ctx.save(); window.ctx.globalCompositeOperation = "multiply";
        sortedFighters.forEach(p => { if (p && p.hp >= 0) { let heightDist = Math.max(0, window.GROUND_Y - p.drawY); let shadowScale = Math.max(0.15, 1 - heightDist / 250) * p.drawScale; window.ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * shadowScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.drawX, window.GROUND_Y - p.drawZ * 0.15, 30 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2); window.ctx.fill(); } });
        window.ctx.restore();

        // Mực Văng / Máu
        if (window.inkSplatters) { 
            window.inkSplatters.forEach(ink => { 
                let proj = project3D(ink); window.ctx.save(); window.ctx.translate(proj.drawX, proj.drawY); window.ctx.rotate(ink.ang); window.ctx.scale(proj.drawScale, proj.drawScale); window.ctx.globalAlpha = Math.max(0, ink.life / ink.maxLife); 
                window.ctx.fillStyle = ink.color === "#ffffff" ? "#ff003c" : "#000000"; 
                window.ctx.beginPath(); window.ctx.moveTo(0,0); window.ctx.quadraticCurveTo(60, -15, 150, -5); window.ctx.quadraticCurveTo(90, 15, 0, 0); window.ctx.fill(); 
                for(let i=0; i<3; i++) { window.ctx.beginPath(); window.ctx.arc(80 + Math.random()*80, (Math.random()-0.5)*40, Math.random()*8, 0, Math.PI*2); window.ctx.fill(); } window.ctx.restore(); 
            }); 
        }

        // Tàn ảnh nhạt màu (Xám bạc)
        if (window.p1) {
            window.ctx.globalCompositeOperation = 'screen'; 
            sortedFighters.forEach(p => { 
                if (p && p.hp > 0 && p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let pseudoObj = {x: t.x, y: p.y, scale: t.scale, isFacingRight: t.isFacingRight}; let proj = project3D(pseudoObj); window.ctx.save(); window.ctx.globalAlpha = t.alpha * 0.5;
                        let scaleDown = 1 - (t.timer * 0.02); if (scaleDown < 0.1) scaleDown = 0.1;
                        window.ctx.filter = 'grayscale(100%) brightness(200%)'; 
                        let trailP = Object.assign({}, p, {x: 0, y: 0, state: t.state, isFacingRight: proj.drawFacingRight, color: "#fff", alpha: t.alpha, scale: proj.drawScale * scaleDown}); 
                        window.ctx.translate(proj.drawX, proj.drawY); if (!proj.drawFacingRight) window.ctx.scale(-1, 1);
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                        window.ctx.restore();
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = "source-over"; window.ctx.globalAlpha = 1.0; window.ctx.filter = 'none';

            // VẼ NHÂN VẬT (Bỏ hoàn toàn bóng đen Silhouette)
            let chromaOffset = window.impactAberration > 0 ? window.impactAberration * 0.5 : 0; 
            let renderPasses = chromaOffset > 0 ? [{c: 'drop-shadow(0 0 0 red)', o: -chromaOffset}, {c: 'drop-shadow(0 0 0 cyan)', o: chromaOffset}] : [{c: 'none', o: 0}];
            if (chromaOffset > 0) window.ctx.globalCompositeOperation = 'screen';

            renderPasses.forEach(pass => {
                sortedFighters.forEach(p => { 
                    window.ctx.save(); window.ctx.globalAlpha = 1.0; 
                    
                    // Chỉnh tông màu nhân vật cho lạnh lẽo và điện ảnh hơn lúc KO
                    if (isFatalKO) { window.ctx.filter = 'contrast(1.2) brightness(0.8) ' + (pass.c === 'none' ? '' : pass.c); }
                    else { window.ctx.filter = pass.c; }
                    
                    if (p.state === 'ko_falling' || p.state === 'dead') { window.ctx.translate(p.drawX + pass.o, p.drawY); let angle = Math.PI / 2; if (p.state === 'ko_falling') { let progress = (100 - p.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = p.drawFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                    } else { let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale }); window.ctx.translate(p.drawX + pass.o, p.drawY); if(!p.drawFacingRight) window.ctx.scale(-1, 1); if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); }
                    window.ctx.restore();
                }); 
            });
            window.ctx.globalCompositeOperation = "source-over";
        }
        window.ctx.filter = 'none';

        // =========================================================
        // NÂNG CẤP VFX: ĐẤM TRÚNG (HIT IMPACTS)
        // =========================================================
        if (!isFatalKO) {
            
            // 1. NHÁT CHÉM (Slashes) - Cứng cáp, đanh gọn
            window.slashes.forEach(s => { 
                let pr = project3D(s); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale * pr.drawScale, s.scale * pr.drawScale); window.ctx.rotate(s.rotation || 0); 
                let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); 
                
                window.ctx.beginPath(); window.ctx.arc(0, 0, 60, -Math.PI/2 + prog*1.5, Math.PI/2 - prog*1.5); 
                window.ctx.lineWidth = 6 * (1 - prog); 
                window.ctx.strokeStyle = "#ffffff"; 
                window.ctx.lineCap = "butt"; 
                window.ctx.stroke(); 
                
                window.ctx.beginPath(); window.ctx.arc(0, 0, 58, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); 
                window.ctx.lineWidth = 15 * (1 - prog); 
                window.ctx.strokeStyle = s.color === "#ffffff" ? "#aaaaaa" : s.color; 
                window.ctx.globalAlpha *= 0.5; window.ctx.stroke(); 
                window.ctx.restore(); 
            });
            
            // 2. TIA LỬA ĐỘNG LỰC HỌC (Needle Sparks) - Bắn ra cực gắt khi đấm trúng
            window.impactSparks.forEach(isp => { 
                let pr = project3D(isp); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); 
                let lifeRatio = isp.life / isp.maxLife;
                window.ctx.globalAlpha = Math.max(0, lifeRatio); 
                let speed = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy);
                let len = speed * 5 * pr.drawScale * (0.5 + lifeRatio); // Đuôi dài mỏng
                let ang = Math.atan2(isp.vy, isp.vx); 
                window.ctx.rotate(ang); 
                
                // Thay vì hạt tròn, tia lửa biến thành cây kim ánh sáng xé gió
                window.ctx.fillStyle = isp.color === "#ffffff" ? "#ffcc00" : isp.color;
                window.ctx.beginPath();
                window.ctx.moveTo(len/2, 0);
                window.ctx.lineTo(-len/2, 1.5 * pr.drawScale);
                window.ctx.lineTo(-len/2, -1.5 * pr.drawScale);
                window.ctx.fill();
                window.ctx.restore(); 
            });

            // 3. SÓNG LỰC ĐẤM (Sharp Shockwaves) - Đứt gãy không khí
            window.shockwaves.forEach(sw => { 
                let pr = project3D(sw); 
                let prog = 1 - (sw.life / sw.maxLife); // 0 to 1 (mở rộng)
                
                window.ctx.save();
                window.ctx.beginPath(); 
                window.ctx.arc(pr.drawX, pr.drawY, sw.r * pr.drawScale, 0, Math.PI*2); 
                
                // Vòng sóng ép khí siêu mỏng, siêu sắc
                window.ctx.lineWidth = Math.max(1, 8 * (1 - prog)); 
                window.ctx.strokeStyle = "#ffffff"; 
                window.ctx.globalAlpha = Math.max(0, 1 - prog); 
                window.ctx.stroke(); 
                
                // Lớp viền thứ 2 màu đen mờ tạo cảm giác lõm không gian
                window.ctx.beginPath(); 
                window.ctx.arc(pr.drawX, pr.drawY, (sw.r - 10) * pr.drawScale, 0, Math.PI*2);
                window.ctx.lineWidth = Math.max(1, 15 * (1 - prog));
                window.ctx.strokeStyle = "rgba(0,0,0,0.4)";
                window.ctx.stroke();
                window.ctx.restore();
            });

            // Hạt vật lý văng (Cát đá)
            window.particles.forEach(pt => { 
                let pr = project3D(pt); window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); window.ctx.fillStyle = pt.color; 
                if (pt.isGroundDust) { window.ctx.beginPath(); window.ctx.ellipse(pr.drawX, window.GROUND_Y - pr.drawZ*0.15 - pt.size/2, pt.size * 1.5 * pr.drawScale, pt.size * 0.4 * pr.drawScale, 0, 0, Math.PI*2); window.ctx.fill(); }
                else if (pt.isRubble) { window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(pt.life * 0.1); window.ctx.fillRect(-pt.size/2*pr.drawScale, -pt.size/2*pr.drawScale, pt.size*pr.drawScale, pt.size*pr.drawScale); window.ctx.restore(); } 
                else { window.ctx.fillRect(pr.drawX - pt.size/2, pr.drawY - pt.size/2, pt.size*pr.drawScale, pt.size*pr.drawScale); } 
            });
            window.ctx.globalAlpha = 1.0;
        }

        // Chữ SFX (BAM, CRASH)
        if (window.mangaSfx) {
            window.mangaSfx.forEach(sfx => {
                let pr = project3D(sfx); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); window.ctx.rotate(sfx.ang); window.ctx.scale(pr.drawScale, pr.drawScale); let alpha = Math.min(1, sfx.life / 10); window.ctx.globalAlpha = alpha;
                window.ctx.font = `900 italic ${sfx.size}px Impact`; window.ctx.lineWidth = 6; window.ctx.strokeStyle = "#000"; window.ctx.strokeText(sfx.text, 0, 0); window.ctx.fillStyle = sfx.isCrit ? "#ff003c" : "#ffffff"; window.ctx.fillText(sfx.text, 0, 0); window.ctx.restore();
            });
        }
        window.ctx.restore(); // KẾT THÚC CAMERA 3D

        // =========================================================
        // NHÁT CẮT TỬ THẦN KHI KO (Razor Slash)
        // =========================================================
        if (isFatalKO && window.fatalKOTimer > 60) { 
            window.ctx.save();
            let slashProgress = 1 - ((window.fatalKOTimer - 60) / 40); 
            if (slashProgress < 0.6) {
                let slashAngle = window.koSlashAngle || (Math.PI / 5); 
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2);
                window.ctx.rotate(slashAngle);
                let thickness = (window.fatalKOTimer % 3 === 0) ? 5 : (30 * Math.max(0, (0.5 - slashProgress)*2));
                
                window.ctx.fillStyle = "#ffffff"; 
                window.ctx.fillRect(-window.canvas.width*1.5, -thickness/2, window.canvas.width*3, thickness);
            }
            window.ctx.restore();
        }

        // GIAO DIỆN (Viền đen, Flash)
        if (window.screenFlash > 0) { 
            window.ctx.globalCompositeOperation = 'screen'; window.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(window.screenFlash, 0.8)})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = 'source-over';
        }

        if (window.cinemaBarsHeight > 1) {
            window.ctx.save(); window.ctx.fillStyle = "#000000"; 
            window.ctx.fillRect(0, 0, window.canvas.width, window.cinemaBarsHeight); 
            window.ctx.fillRect(0, window.canvas.height - window.cinemaBarsHeight, window.canvas.width, window.cinemaBarsHeight);
            if (isFatalKO && window.fatalKOTimer < 70) { 
                window.ctx.globalAlpha = Math.min(1, (70 - window.fatalKOTimer) / 10);
                window.ctx.font = "italic 900 25px 'Arial Black', sans-serif"; window.ctx.textAlign = "center"; window.ctx.fillStyle = "#ff0000"; 
                window.ctx.fillText("F A T A L I T Y", window.canvas.width / 2, window.cinemaBarsHeight / 2 + 10); 
            }
            window.ctx.restore();
        }

        if (!isFatalKO) { // Bảng Combo tối giản
            let renderComboRank = function(fighter, xPos, align) {
                if (fighter && fighter.comboHits >= 2) {
                    let alpha = Math.max(0, fighter.comboAlpha || 1); let hits = fighter.comboHits; 
                    window.ctx.globalAlpha = alpha; window.ctx.textAlign = align;
                    window.ctx.fillStyle = "#ffffff"; window.ctx.font = `italic 900 40px Impact`; window.ctx.fillText(`${hits} HITS`, xPos, 80);
                }
            };
            renderComboRank(window.p1, 40, "left"); let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; }); renderComboRank(maxEnemyCombo, window.canvas.width - 40, "right");
        }

        if (window.noiseCanvas) {
            window.ctx.save(); window.ctx.setTransform(1,0,0,1,0,0); window.ctx.globalCompositeOperation = 'overlay'; window.ctx.globalAlpha = 0.4; 
            let offsetX = (Math.random() * 100) % window.noiseCanvas.width; let offsetY = (Math.random() * 100) % window.noiseCanvas.height;
            let ptrn = window.ctx.createPattern(window.noiseCanvas, 'repeat'); window.ctx.fillStyle = ptrn; window.ctx.translate(-offsetX, -offsetY); window.ctx.fillRect(0, 0, window.canvas.width + 100, window.canvas.height + 100); window.ctx.restore();
        }

    } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}
