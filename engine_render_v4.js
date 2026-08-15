// ==========================================
// ENGINE_RENDER.JS - HỆ THỐNG VẼ ĐỒ HỌA TRUNG TÂM
// PHONG CÁCH: RAW COMBAT & ESCALATING COMBO (Bỏ Manga Burst, Nâng cấp Hit VFX)
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
    
    // BỘ LỌC MÀU: Tone lạnh, tương phản gắt chuẩn Cinematic Martial Arts
    window.ctx.filter = 'saturate(0.35) contrast(1.4) brightness(0.9)';

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

    if (window.isLoading) return; 

    window.ctx.save(); // BẮT ĐẦU CAMERA 3D
    try {
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        
        // Gia tăng độ rung camera dựa trên Combo hiện tại của P1 để tạo cảm giác đòn bạo lực hơn
        let p1ComboHits = (window.p1 && window.p1.comboHits) ? window.p1.comboHits : 0;
        if (p1ComboHits > 3 && window.shakeTime > 0) {
            let comboShake = Math.min(p1ComboHits, 15) * 0.5; // Tối đa thêm 7.5px rung
            window.ctx.translate((Math.random() - 0.5) * comboShake, (Math.random() - 0.5) * comboShake);
        }
        
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

        if (isFatalKO) {
            window.ctx.fillStyle = `rgba(5, 5, 5, ${Math.min(0.85, window.fatalKOTimer / 20)})`; 
            window.ctx.fillRect(-3000, -3000, 6000, 6000);
        }

        // Bóng nhân vật
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

        // =========================================================
        // NÂNG CẤP COMBO 1: TÀN ẢNH SÁT KHÍ (KILLING INTENT TRAILS)
        // =========================================================
        if (window.p1) {
            window.ctx.globalCompositeOperation = 'screen'; 
            sortedFighters.forEach(p => { 
                if (p && p.hp > 0 && p.trailArr) { 
                    
                    // Combo > 5: Tàn ảnh biến thành Đỏ Máu rực rỡ, Combo thấp: Bạc Lạnh
                    let isHighCombo = (p.comboHits >= 5); 
                    
                    p.trailArr.forEach(t => { 
                        let pseudoObj = {x: t.x, y: p.y, scale: t.scale, isFacingRight: t.isFacingRight}; let proj = project3D(pseudoObj); window.ctx.save(); 
                        window.ctx.globalAlpha = t.alpha * (isHighCombo ? 0.7 : 0.4); 
                        let scaleDown = 1 - (t.timer * 0.02); if (scaleDown < 0.1) scaleDown = 0.1;
                        
                        if (isHighCombo) {
                            window.ctx.filter = 'sepia(1) hue-rotate(320deg) saturate(600%) brightness(150%) drop-shadow(0 0 10px red)'; 
                        } else {
                            window.ctx.filter = 'grayscale(100%) brightness(200%)'; 
                        }
                        
                        let trailP = Object.assign({}, p, {x: 0, y: 0, state: t.state, isFacingRight: proj.drawFacingRight, color: "#fff", alpha: t.alpha, scale: proj.drawScale * scaleDown}); 
                        window.ctx.translate(proj.drawX, proj.drawY); if (!proj.drawFacingRight) window.ctx.scale(-1, 1);
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                        window.ctx.restore();
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = "source-over"; window.ctx.globalAlpha = 1.0; window.ctx.filter = 'none';

            // VẼ NHÂN VẬT CHÍNH
            let chromaOffset = window.impactAberration > 0 ? window.impactAberration * 0.5 : 0; 
            let renderPasses = chromaOffset > 0 ? [{c: 'drop-shadow(0 0 0 red)', o: -chromaOffset}, {c: 'drop-shadow(0 0 0 cyan)', o: chromaOffset}] : [{c: 'none', o: 0}];
            if (chromaOffset > 0) window.ctx.globalCompositeOperation = 'screen';

            renderPasses.forEach(pass => {
                sortedFighters.forEach(p => { 
                    window.ctx.save(); window.ctx.globalAlpha = 1.0; 
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
        // NÂNG CẤP COMBO 2 & 3: VẾT CHÉM THƯ PHÁP & TIA LỬA GIA LỰC
        // =========================================================
        if (!isFatalKO) {
            
            // 2. NHÁT CHÉM (Calligraphy Slashes) - Cứng cáp, đanh gọn và rỉ mực
            window.slashes.forEach(s => { 
                let pr = project3D(s); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale * pr.drawScale, s.scale * pr.drawScale); window.ctx.rotate(s.rotation || 0); 
                let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); 
                
                // Lõi chém trắng sáng sắc lẹm
                window.ctx.beginPath(); window.ctx.arc(0, 0, 60, -Math.PI/2 + prog*1.5, Math.PI/2 - prog*1.5); 
                window.ctx.lineWidth = 4 * (1 - prog); 
                window.ctx.strokeStyle = "#ffffff"; 
                window.ctx.lineCap = "butt"; 
                window.ctx.stroke(); 
                
                // Vỏ bọc máu/mực đen đứt đoạn (Thư pháp võ thuật)
                window.ctx.beginPath(); window.ctx.arc(0, 0, 58, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); 
                window.ctx.lineWidth = 15 * (1 - prog); 
                let slashColor = s.color === "#ffffff" ? "#aaaaaa" : s.color;
                
                // NẾU COMBO CAO, vết chém chuyển sang màu đỏ rực
                if (p1ComboHits >= 5) slashColor = "#ff003c"; 

                window.ctx.strokeStyle = slashColor; 
                window.ctx.globalAlpha *= 0.7; 
                window.ctx.setLineDash([Math.random()*40, Math.random()*20]); // Tạo rãnh đứt gãy vết mực
                window.ctx.stroke(); 
                window.ctx.setLineDash([]); // Reset
                
                // Điểm xuyết các giọt mực văng li ti từ đuôi vết chém
                for(let i=0; i<3; i++) {
                    window.ctx.fillStyle = slashColor;
                    let randAng = -Math.PI/2 + prog*1.2 + Math.random()*0.5;
                    let randR = 58 + (Math.random()-0.5)*20;
                    window.ctx.beginPath(); window.ctx.arc(Math.cos(randAng)*randR, Math.sin(randAng)*randR, Math.random()*3, 0, Math.PI*2); window.ctx.fill();
                }

                window.ctx.restore(); 
            });
            
            // 3. TIA LỬA ĐỘNG LỰC HỌC (Combo-Scaling Sparks) - Càng nhiều Hit, xé gió càng dài
            window.impactSparks.forEach(isp => { 
                let pr = project3D(isp); window.ctx.save(); window.ctx.translate(pr.drawX, pr.drawY); 
                let lifeRatio = isp.life / isp.maxLife;
                window.ctx.globalAlpha = Math.max(0, lifeRatio); 
                
                let speed = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy);
                // Độ dài hạt tỉ lệ thuận với Combo hiện tại (tối đa x2.5 lần)
                let comboMultiplier = 1 + Math.min(p1ComboHits, 15) * 0.1; 
                let len = speed * 4 * comboMultiplier * pr.drawScale * (0.5 + lifeRatio); 
                let ang = Math.atan2(isp.vy, isp.vx); 
                window.ctx.rotate(ang); 
                
                // Đổi màu tia lửa: Combo thấp -> Vàng cơ khí, Combo cao -> Đỏ trắng nung chảy
                let sparkColor = isp.color;
                if (sparkColor === "#ffffff") sparkColor = p1ComboHits >= 8 ? "#ff3333" : "#ffcc00";

                window.ctx.fillStyle = sparkColor;
                window.ctx.beginPath();
                window.ctx.moveTo(len/2, 0); // Đầu nhọn lao đi
                window.ctx.lineTo(-len/2, 1.5 * pr.drawScale); // Thân
                window.ctx.lineTo(-len/2, -1.5 * pr.drawScale);
                window.ctx.fill();
                window.ctx.restore(); 
            });

            // SÓNG LỰC ĐẤM (Sharp Shockwaves)
            window.shockwaves.forEach(sw => { 
                let pr = project3D(sw); 
                let prog = 1 - (sw.life / sw.maxLife); 
                window.ctx.save();
                window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, sw.r * pr.drawScale, 0, Math.PI*2); 
                window.ctx.lineWidth = Math.max(1, 8 * (1 - prog)); 
                window.ctx.strokeStyle = "#ffffff"; 
                window.ctx.globalAlpha = Math.max(0, 1 - prog); 
                window.ctx.stroke(); 
                
                window.ctx.beginPath(); window.ctx.arc(pr.drawX, pr.drawY, (sw.r - 10) * pr.drawScale, 0, Math.PI*2);
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

        // =========================================================
        // UI COMBO TỐI GIẢN CHUẨN KINETICS
        // =========================================================
        if (!isFatalKO) { 
            let renderComboRank = function(fighter, xPos, align) {
                if (fighter && fighter.comboHits >= 2) {
                    let alpha = Math.max(0, fighter.comboAlpha || 1); 
                    let hits = fighter.comboHits; 
                    
                    window.ctx.save();
                    window.ctx.globalAlpha = alpha; 
                    window.ctx.textAlign = align;
                    
                    // Rung nhẹ text theo nhịp độ combo
                    let pulse = Math.sin(Date.now() / 50) * Math.min(hits, 10);
                    
                    // Vệt mực đỏ lót dưới UI nếu hit to (để báo hiệu chuỗi combo lớn)
                    if (hits >= 5) {
                        window.ctx.fillStyle = "rgba(255, 0, 60, 0.5)";
                        window.ctx.font = `italic 900 ${45 + pulse}px Impact`;
                        window.ctx.fillText(`${hits} HITS`, xPos + (align==='left'? -5 : 5), 80 + pulse);
                    }
                    
                    // Text chính thuần trắng
                    window.ctx.fillStyle = "#ffffff"; 
                    window.ctx.font = `italic 900 ${40 + pulse/2}px Impact`; 
                    window.ctx.fillText(`${hits} HITS`, xPos, 80);
                    
                    window.ctx.restore();
                }
            };
            renderComboRank(window.p1, 50, "left"); 
            let maxEnemyCombo = null; 
            window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; }); 
            renderComboRank(maxEnemyCombo, window.canvas.width - 50, "right");
        }

        if (window.noiseCanvas) {
            window.ctx.save(); window.ctx.setTransform(1,0,0,1,0,0); window.ctx.globalCompositeOperation = 'overlay'; window.ctx.globalAlpha = 0.4; 
            let offsetX = (Math.random() * 100) % window.noiseCanvas.width; let offsetY = (Math.random() * 100) % window.noiseCanvas.height;
            let ptrn = window.ctx.createPattern(window.noiseCanvas, 'repeat'); window.ctx.fillStyle = ptrn; window.ctx.translate(-offsetX, -offsetY); window.ctx.fillRect(0, 0, window.canvas.width + 100, window.canvas.height + 100); window.ctx.restore();
        }

    } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}
