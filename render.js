// ==========================================
// RENDER.JS - HỆ THỐNG VẼ ĐỒ HỌA (CANVAS RENDERER)
// ==========================================

window.draw = function() {
    if (!window.canvas) { window.canvas = document.getElementById("battleCanvas"); if(window.canvas) window.ctx = window.canvas.getContext("2d"); } 
    if (!window.canvas || !window.ctx) return;
    
    window.ctx.setTransform(1, 0, 0, 1, 0, 0); window.ctx.globalAlpha = 1.0; window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.save();
    
    try {
        if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); window.ctx.scale(window.currentZoom, window.currentZoom); 
        if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
        window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

        if (window.impactFrameTimer > 0) { window.impactFrameTimer--; window.ctx.fillStyle = (window.impactFrameTimer % 2 === 0) ? "#ffffff" : "#000000"; window.ctx.fillRect(-800, -800, window.canvas.width + 1600, window.canvas.height + 1600); window.ctx.globalCompositeOperation = "difference"; } 
        else { window.ctx.globalCompositeOperation = "source-over"; }

        let cmap = window.currentMap || { sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" };
        window.ctx.fillStyle = cmap.sky; window.ctx.fillRect(-400, -100, window.canvas.width + 800, window.canvas.height + 100);
        
        window.ctx.save(); window.ctx.translate(-window.camX * 0.7, 0); window.ctx.fillStyle = cmap.bg2;
        for(var i = -800; i < window.canvas.width + 1200; i += 150) {
            let t2 = cmap.bg2Type || "mountains";
            if (t2 === "mountains") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+75, window.GROUND_Y-120+Math.sin(i)*30); window.ctx.lineTo(i+150, window.GROUND_Y); window.ctx.fill(); }
            else if (t2 === "pyramids") { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i+100, window.GROUND_Y-150); window.ctx.lineTo(i+200, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+40, window.GROUND_Y-50, 120, 5); window.ctx.fillRect(i+60, window.GROUND_Y-80, 80, 5); }
            else if (t2 === "river") { window.ctx.beginPath(); window.ctx.ellipse(i+75, window.GROUND_Y-15, 100, 10, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.ellipse(i+20, window.GROUND_Y-30, 60, 5, 0, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "clouds") { window.ctx.beginPath(); window.ctx.arc(i, window.GROUND_Y-180+Math.sin(i)*30, 60, 0, Math.PI*2); window.ctx.arc(i+50, window.GROUND_Y-150+Math.cos(i)*20, 50, 0, Math.PI*2); window.ctx.fill(); }
            else if (t2 === "stars") { window.ctx.beginPath(); window.ctx.arc(i+Math.sin(i)*50, window.GROUND_Y-250+Math.cos(i)*100, 3+Math.random()*4, 0, Math.PI*2); window.ctx.fill(); }
        }
        window.ctx.restore();

        window.ctx.save(); window.ctx.translate(-window.camX * 0.4, 0); window.ctx.fillStyle = cmap.bg1;
        for(var i = -800; i < window.canvas.width + 1200; i += 120) {
            let t1 = cmap.bg1Type || "city"; let h = 100 + Math.abs(Math.sin(i))*80;
            if (t1 === "city") { window.ctx.fillRect(i, window.GROUND_Y-h, 70, h); if(i%3===0) window.ctx.clearRect(i+10, window.GROUND_Y-h+20, 15, 20); }
            else if (t1 === "trees") { window.ctx.fillRect(i+25, window.GROUND_Y-h, 20, h); window.ctx.beginPath(); window.ctx.arc(i+35, window.GROUND_Y-h, 45, 0, Math.PI*2); window.ctx.fill(); }
            else if (t1 === "pines") { window.ctx.fillRect(i+25, window.GROUND_Y-30, 10, 30); window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y-20); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+60, window.GROUND_Y-20); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y-10); window.ctx.lineTo(i+30, window.GROUND_Y-h+40); window.ctx.lineTo(i+70, window.GROUND_Y-10); window.ctx.fill(); }
            else if (t1 === "pillars") { window.ctx.fillRect(i+10, window.GROUND_Y-h, 40, h); window.ctx.fillRect(i, window.GROUND_Y-20, 60, 20); window.ctx.fillRect(i, window.GROUND_Y-h, 60, 15); }
            else if (t1 === "graves") { window.ctx.beginPath(); window.ctx.arc(i+30, window.GROUND_Y-60, 30, Math.PI, 0); window.ctx.lineTo(i+60, window.GROUND_Y); window.ctx.lineTo(i, window.GROUND_Y); window.ctx.fill(); window.ctx.fillRect(i+25, window.GROUND_Y-100, 10, 30); window.ctx.fillRect(i+15, window.GROUND_Y-90, 30, 10); }
            else if (t1 === "crystals") { window.ctx.beginPath(); window.ctx.moveTo(i+10, window.GROUND_Y); window.ctx.lineTo(i+30, window.GROUND_Y-h); window.ctx.lineTo(i+50, window.GROUND_Y); window.ctx.fill(); window.ctx.beginPath(); window.ctx.moveTo(i-10, window.GROUND_Y); window.ctx.lineTo(i+10, window.GROUND_Y-h*0.6); window.ctx.lineTo(i+30, window.GROUND_Y); window.ctx.fill(); }
            else if (t1 === "ruins") { window.ctx.fillRect(i, window.GROUND_Y-h, 50, h); window.ctx.clearRect(i+10, window.GROUND_Y-h-5, 20, 30); window.ctx.clearRect(i+30, window.GROUND_Y-h+40, 25, 20); }
            else if (t1 === "digital") { window.ctx.font="bold 24px monospace"; window.ctx.fillText(Math.random()>0.5?"10101":"01100", i, window.GROUND_Y-h); window.ctx.fillText(Math.random()>0.5?"111":"000", i+10, window.GROUND_Y-h+30); }
        }
        window.ctx.restore();
        
        window.ctx.fillStyle = cmap.ground; window.ctx.fillRect(-400, window.GROUND_Y, window.canvas.width + 800, window.canvas.height - window.GROUND_Y); 
        window.ctx.strokeStyle = cmap.line; window.ctx.lineWidth = 4; window.ctx.beginPath(); window.ctx.moveTo(-400, window.GROUND_Y); window.ctx.lineTo(window.canvas.width + 400, window.GROUND_Y); window.ctx.stroke();
        window.ctx.strokeStyle = "#222"; window.ctx.lineWidth = 2; for(var i = -400; i < window.canvas.width + 400; i+=50) { window.ctx.beginPath(); window.ctx.moveTo(i, window.GROUND_Y); window.ctx.lineTo(i - 20, window.canvas.height); window.ctx.stroke(); }
        
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.WALL_PADDING, 0, 4, window.canvas.height); 
        window.ctx.fillStyle = cmap.line; window.ctx.fillRect(window.canvas.width - window.WALL_PADDING, 0, 4, window.canvas.height); 

        // ==========================================
        // VẼ MÔI TRƯỜNG NỨT VỠ VÀ HỐ DUNG NHAM CÓ CHIỀU SÂU
        // ==========================================
        if (window.envDamage && window.envDamage.length > 0) {
            window.ctx.save(); window.ctx.lineCap = "round"; window.ctx.lineJoin = "round";
            window.envDamage.forEach(dmg => {
                let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1;
                window.ctx.globalAlpha = alpha;
                window.ctx.save(); window.ctx.translate(dmg.x, dmg.y);
                
                if (dmg.type === 'crater') {
                    window.ctx.scale(1, 0.35); 
                    
                    let craterGrad = window.ctx.createRadialGradient(0, 0, 0, 0, 0, (dmg.radius || 40));
                    craterGrad.addColorStop(0, "rgba(5, 5, 5, 0.95)");
                    craterGrad.addColorStop(0.7, "rgba(15, 15, 15, 0.7)");
                    craterGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    
                    window.ctx.fillStyle = craterGrad; 
                    window.ctx.beginPath(); window.ctx.arc(0, 0, dmg.radius || 40, 0, Math.PI * 2); window.ctx.fill();
                    
                    if (dmg.isBurning) {
                        let pulse = 0.5 + Math.abs(Math.sin(Date.now() / 200)) * 0.5;
                        let burnGrad = window.ctx.createRadialGradient(0, 0, 0, 0, 0, (dmg.radius || 40) * 0.75);
                        burnGrad.addColorStop(0, `rgba(255, 200, 0, ${pulse})`);
                        burnGrad.addColorStop(0.4, `rgba(255, 50, 0, ${pulse * 0.8})`);
                        burnGrad.addColorStop(1, "rgba(0,0,0,0)");
                        window.ctx.fillStyle = burnGrad;
                        window.ctx.beginPath(); window.ctx.arc(0, 0, (dmg.radius || 40) * 0.75, 0, Math.PI * 2); window.ctx.fill();
                    }
                }
                
                let baseLw = (dmg.isBurning ? 4 : 3) * (dmg.scale || 1);
                
                dmg.cracks.forEach(path => {
                    if (Array.isArray(path)) {
                        if (dmg.isBurning) {
                            window.ctx.strokeStyle = `rgba(231, 76, 60, ${0.9 * alpha})`;
                            window.ctx.lineWidth = baseLw + 2;
                            window.ctx.shadowBlur = 10;
                            window.ctx.shadowColor = "#ff4757";
                        } else {
                            window.ctx.strokeStyle = `rgba(0, 0, 0, ${0.6 * alpha})`;
                            window.ctx.lineWidth = baseLw + 1.5;
                            window.ctx.shadowBlur = 0;
                        }
                        
                        window.ctx.beginPath(); 
                        path.forEach((pt, idx) => {
                            if (idx === 0) window.ctx.moveTo(pt.x, pt.y);
                            else window.ctx.lineTo(pt.x, pt.y);
                        });
                        window.ctx.stroke();
                        
                        window.ctx.strokeStyle = dmg.isBurning ? `rgba(255, 200, 0, ${0.9 * alpha})` : `rgba(20, 20, 20, ${0.9 * alpha})`;
                        window.ctx.lineWidth = baseLw * 0.4;
                        window.ctx.shadowBlur = 0;
                        window.ctx.beginPath(); 
                        path.forEach((pt, idx) => {
                            if (idx === 0) window.ctx.moveTo(pt.x, pt.y);
                            else window.ctx.lineTo(pt.x, pt.y);
                        });
                        window.ctx.stroke();
                    }
                });
                window.ctx.restore();
            });
            window.ctx.restore(); window.ctx.globalAlpha = 1.0;
        }

        if (window.envHazards && window.envHazards.length > 0) {
            window.ctx.save(); window.ctx.globalCompositeOperation = 'lighter';
            window.envHazards.forEach(haz => {
                if (haz.type === 'lightning') { window.ctx.fillStyle = `rgba(241, 196, 15, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.fillRect(haz.x - 40, -500, 80, window.GROUND_Y + 500); } 
                else if (haz.type === 'lava') { window.ctx.fillStyle = `rgba(231, 76, 60, ${0.1 + Math.sin(haz.timer)/5})`; window.ctx.beginPath(); window.ctx.ellipse(haz.x, window.GROUND_Y, 60 + Math.sin(haz.timer)*10, 15, 0, 0, Math.PI*2); window.ctx.fill(); }
            });
            window.ctx.restore(); window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";
        }

        window.ctx.save(); window.ctx.lineWidth = 1;
        window.weatherParticles.forEach(w => { 
            if (window.currentWeather === 'snow') { window.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size, 0, Math.PI*2); window.ctx.fill(); } 
            else if (window.currentWeather === 'rain') { window.ctx.strokeStyle = "rgba(155, 155, 255, 0.6)"; window.ctx.beginPath(); window.ctx.moveTo(w.x, w.y); window.ctx.lineTo(w.x - 6, w.y + 15); window.ctx.stroke(); } 
            else if (window.currentWeather === 'ash') { window.ctx.fillStyle = "rgba(230, 126, 34, 0.6)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 0.8, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'toxic') { window.ctx.fillStyle = "rgba(46, 204, 113, 0.4)"; window.ctx.beginPath(); window.ctx.arc(w.x, w.y, w.size * 1.2, 0, Math.PI*2); window.ctx.fill(); }
            else if (window.currentWeather === 'petals') { window.ctx.fillStyle = "rgba(253, 121, 168, 0.7)"; window.ctx.beginPath(); window.ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); window.ctx.fill(); }
        });
        window.ctx.restore();

        window.traps.forEach(t => { window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; window.ctx.fill(); window.ctx.globalAlpha = 1.0; });
        window.projectiles.forEach(proj => { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); window.ctx.fillStyle = proj.color; window.ctx.fill(); if(proj.isMeteor) { window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius + 10, 0, Math.PI * 2); window.ctx.fillStyle = "rgba(230, 126, 34, 0.4)"; window.ctx.fill(); } });
        
        window.ctx.globalCompositeOperation = 'lighter';
        window.shockwaves.forEach(sw => { window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); window.ctx.lineWidth = 5; window.ctx.strokeStyle = sw.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); });
        window.impactSparks.forEach(isp => { window.ctx.save(); window.ctx.translate(isp.x, isp.y); window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); window.ctx.fillStyle = isp.color; window.ctx.beginPath(); let len = Math.sqrt(isp.vx*isp.vx + isp.vy*isp.vy) * 2; let ang = Math.atan2(isp.vy, isp.vx); window.ctx.rotate(ang); window.ctx.ellipse(0, 0, len, 2, 0, 0, Math.PI*2); window.ctx.fill(); window.ctx.restore(); });
        window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";

        let allFighters = [window.p1].concat(window.enemies); 

        window.ctx.save(); window.ctx.globalCompositeOperation = "source-over";
        allFighters.forEach(p => {
            if (p && p.hp >= 0) {
                let heightDist = Math.max(0, window.GROUND_Y - p.y); 
                let shadowScale = Math.max(0.15, 1 - heightDist / 250) * (p.scale || 1);
                window.ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`; window.ctx.beginPath(); window.ctx.ellipse(p.x, window.GROUND_Y, 35 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2); window.ctx.fill();
            }
        });
        window.ctx.restore();

        if (window.p1) {
            window.ctx.globalCompositeOperation = 'lighter';
            allFighters.forEach(p => { 
                if (p && p.hp > 0 && p.trailArr) { 
                    p.trailArr.forEach(t => { 
                        let trailP = Object.assign({}, p, {x: t.x, y: p.y, state: t.state, isFacingRight: t.isFacingRight, color: t.color, alpha: t.alpha, scale: t.scale}); 
                        if (trailP.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, trailP, true); 
                        else if (trailP.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, trailP);
                        else if (trailP.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, trailP);
                        else if (trailP.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, trailP);
                        else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, trailP, true); 
                    }); 
                } 
            });
            window.ctx.globalCompositeOperation = window.impactFrameTimer > 0 ? "difference" : "source-over";

            window.enemies.forEach(e => { 
                window.ctx.save();
                if (e.state === 'ko_falling' || e.state === 'dead') { 
                    window.ctx.translate(e.x, e.y); let angle = Math.PI / 2; if (e.state === 'ko_falling') { let progress = (100 - e.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = e.isFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, e, { x: 0, y: 0 }); 
                    if(clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, clone); 
                    else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, clone);
                    else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, clone);
                    else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } 
                else { 
                    if(e.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, e); 
                    else if (e.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, e);
                    else if (e.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, e);
                    else if (e.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, e);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, e); 
                }
                window.ctx.restore();
            }); 

            window.ctx.save();
            if (window.p1.state === 'ko_falling' || window.p1.state === 'dead') { window.ctx.translate(window.p1.x, window.p1.y); let angle = Math.PI / 2; if (window.p1.state === 'ko_falling') { let progress = (100 - window.p1.koTimer) / 30; if (progress > 1) progress = 1; angle = progress * (Math.PI / 2); } let fallDir = window.p1.isFacingRight ? -1 : 1; window.ctx.rotate(angle * fallDir); let clone = Object.assign({}, window.p1, { x: 0, y: 0 }); if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); } 
            else { if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, window.p1); }
            window.ctx.restore();
        }

        window.slashes.forEach(s => { window.ctx.save(); window.ctx.translate(s.x, s.y); if (!s.isRight) window.ctx.scale(-1, 1); window.ctx.scale(s.scale, s.scale); window.ctx.rotate(s.rotation || 0); let prog = 1 - (s.life / s.maxLife); window.ctx.globalAlpha = Math.max(0, 1 - Math.pow(prog, 2)); window.ctx.beginPath(); window.ctx.arc(0, 0, 40 + prog * 20, -Math.PI/2 + prog*1.2, Math.PI/2 - prog*1.2); window.ctx.lineWidth = 15 * (1 - prog); let grad = window.ctx.createRadialGradient(0, 0, 10, 0, 0, 60); grad.addColorStop(0, "white"); grad.addColorStop(1, s.color); window.ctx.strokeStyle = grad; window.ctx.lineCap = "round"; window.ctx.shadowBlur = 15; window.ctx.shadowColor = s.color; window.ctx.stroke(); window.ctx.restore(); });
        
        window.particles.forEach(pt => { 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife)); 
            window.ctx.fillStyle = pt.color; 
            if (pt.isRubble) {
                window.ctx.save(); window.ctx.translate(pt.x, pt.y); window.ctx.rotate(pt.life * 0.1); 
                window.ctx.fillRect(-pt.size/2, -pt.size/2, pt.size, pt.size); window.ctx.restore();
            } else {
                window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2); window.ctx.fill(); 
                if (pt.isCoin) { window.ctx.strokeStyle = "#d35400"; window.ctx.lineWidth = 1; window.ctx.stroke(); } 
            }
        }); 
        window.ctx.globalAlpha = 1.0;
        
        window.floatingTexts.forEach(t => { window.ctx.font = t.font || "900 22px Arial"; window.ctx.fillStyle = t.color; window.ctx.shadowBlur = 5; window.ctx.shadowColor = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); window.ctx.fillText(t.text, t.x, t.y); window.ctx.shadowBlur = 0; }); window.ctx.globalAlpha = 1.0;

        window.ctx.save();
        window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
        
        if (window.p1 && window.p1.comboHits >= 2) {
            window.ctx.globalAlpha = Math.max(0, window.p1.comboAlpha || 1);
            window.ctx.font = "italic 900 24px Arial"; 
            window.ctx.fillStyle = "#ff9f43";
            window.ctx.textAlign = "left";
            window.ctx.shadowBlur = 10;
            window.ctx.shadowColor = "#ff9f43";
            window.ctx.fillText(`🔥 ${window.p1.comboHits} HITS`, 20, 70 + Math.sin(Date.now() / 100) * 2);
        }
        
        let maxEnemyCombo = null;
        window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; });
        if (maxEnemyCombo) {
            window.ctx.globalAlpha = Math.max(0, maxEnemyCombo.comboAlpha || 1);
            window.ctx.font = "italic 900 24px Arial"; 
            window.ctx.fillStyle = "#ff4757";
            window.ctx.textAlign = "right";
            window.ctx.shadowBlur = 10;
            window.ctx.shadowColor = "#ff4757";
            window.ctx.fillText(`🔥 ${maxEnemyCombo.comboHits} HITS`, window.canvas.width - 20, 70 + Math.sin(Date.now() / 100) * 2);
        }
        
        window.ctx.restore();

        if (window.screenFlash > 0) { window.ctx.fillStyle = `rgba(255, 255, 255, ${window.screenFlash})`; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); }
        if (window.cinematicTimer > 0 && window.cinematicCaster) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.82)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); let stripY = window.canvas.height / 2 - 50; window.ctx.fillStyle = window.cinematicCaster.color; window.ctx.fillRect(0, stripY, window.canvas.width, 100);
            let progress = (50 - window.cinematicTimer) / 50; let slideX = -200 + (progress * 800); window.ctx.fillStyle = "#fff"; window.ctx.font = "italic 900 60px Arial"; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#fff"; window.ctx.fillText("⚡", slideX, stripY + 70); window.ctx.shadowBlur = 0;
            let avaX = window.canvas.width - slideX; let casterClone = Object.assign({}, window.cinematicCaster, {x: avaX, y: stripY + 70, state: 'cast', isFacingRight: true}); if(casterClone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, casterClone); else if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, casterClone);
        }
        
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.textAlign = "center";
            if (window.introTimer > 60) {
                let slideProgress = Math.min(1, (160 - window.introTimer) / 40); let easeOut = 1 - Math.pow(1 - slideProgress, 3);
                let targetX1 = 150; let targetX2 = window.canvas.width - 150; let slideX1 = -100 + (targetX1 - (-100)) * easeOut; let slideX2 = window.canvas.width + 100 - (window.canvas.width + 100 - targetX2) * easeOut;
                
                let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y, state: window.p1.introState || 'idle', isFacingRight: true, scale: (window.p1.scale || 1) * 1.2}); if(typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                if (window.enemies && window.enemies.length > 0) { 
                    let repEnemy = window.enemies[0]; let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y, state: repEnemy.isDragon ? 'idle' : (repEnemy.introState || 'idle'), isFacingRight: false, scale: (repEnemy.scale || 1) * 1.2}); 
                    if (repEnemy.isDragon && typeof window.drawDragon === 'function') window.drawDragon(window.ctx, repEnemy); 
                    else if (repEnemy.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(window.ctx, p2Clone);
                    else if (repEnemy.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(window.ctx, p2Clone);
                    else if (repEnemy.isNinja && typeof window.drawNinja === 'function') window.drawNinja(window.ctx, p2Clone);
                    else if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                }
                
                window.ctx.font = "italic 900 35px Arial"; window.ctx.fillStyle = "#ff4757"; window.ctx.fillText("👤", slideX1, window.GROUND_Y + 60);
                
                let eName = (window.rewardMultiplier === 15) ? (window.enemies[0].isBruceLee ? "🥋" : (window.enemies[0].isSamurai ? "🗡️" : (window.enemies[0].isNinja ? "🥷" : "🐉"))) : "🤖"; 
                window.ctx.fillStyle = "#1e90ff"; window.ctx.fillText(eName, slideX2, window.GROUND_Y + 60);
                
                if (window.introTimer <= 120) { window.ctx.font = "italic 900 80px Arial"; window.ctx.fillStyle = "#f1c40f"; window.ctx.shadowBlur = 25; window.ctx.shadowColor = "#f1c40f"; window.ctx.fillText("🆚", window.canvas.width/2, window.GROUND_Y - 120); window.ctx.shadowBlur = 0; }
            } else { let scale = 1 + (window.introTimer / 60); window.ctx.save(); window.ctx.translate(window.canvas.width/2, window.canvas.height/2); window.ctx.scale(scale, scale); window.ctx.font = "italic 900 90px Arial"; window.ctx.fillStyle = "#ff9f43"; window.ctx.shadowBlur = 30; window.ctx.shadowColor = "#ff9f43"; window.ctx.fillText("🥊", 0, 30); window.ctx.restore(); }
        }

        if (window.koGlitchTimer > 0) {
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.koGlitchTimer % 3 === 0) {
                for(let i=0; i<3; i++) {
                    let sliceY = Math.random() * window.canvas.height; let sliceH = Math.random() * 80 + 10; let offset = (Math.random() - 0.5) * 50;
                    window.ctx.drawImage(window.canvas, 0, sliceY, window.canvas.width, sliceH, offset, sliceY, window.canvas.width, sliceH);
                    window.ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 0, 0, 0.25)" : "rgba(0, 255, 255, 0.25)";
                    window.ctx.globalCompositeOperation = 'screen'; window.ctx.fillRect(0, sliceY, window.canvas.width, sliceH); window.ctx.globalCompositeOperation = 'source-over';
                }
            }
            if (window.koGlitchTimer > 45) { window.ctx.globalCompositeOperation = 'difference'; window.ctx.fillStyle = 'white'; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); window.ctx.globalCompositeOperation = 'source-over'; }
            if (window.koGlitchTimer > 10) {
                window.ctx.font = "italic 900 120px Courier New"; window.ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.5})`; window.ctx.textAlign = "center"; window.ctx.shadowBlur = 20; window.ctx.shadowColor = "#ff0000";
                window.ctx.fillText("💀", window.canvas.width/2 + (Math.random()-0.5)*10, window.canvas.height/2 + (Math.random()-0.5)*10); window.ctx.shadowBlur = 0;
            }
            window.ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; for(let i=0; i<window.canvas.height; i+=5) { window.ctx.fillRect(0, i, window.canvas.width, 1); }
        }
    } catch (err) { console.error("Lỗi Render:", err); } finally { window.ctx.restore(); }
    if (typeof window.captureFrameTo1080p === 'function') { window.captureFrameTo1080p(); }
}
