// ==========================================
// ENGINE_REND.JS - V9.1 HYPER COMBO & 5-LAYER MAP RENDERER (60FPS - 1V1)
// ĐÃ ĐỒNG BỘ 100% VỚI ENVIRONMENT.JS V8.0:
// 1. Ủy quyền vẽ 16 Bản đồ 5 lớp chiều sâu cho window.drawMapBackground(ctx) (Vẫn hỗ trợ Lãnh Địa activeDomain).
// 2. Giữ trọn vẹn hiệu ứng Hyper Combo V9.0: Vòng xung kích 3D (hitRings), Mưa kình lực (phantomFists) & Sét Hắc Thiểm (Black Flash).
// ==========================================

// --- 1. QUẢN LÝ & VẼ TÀN ẢNH (GHOST TRAILS) ---
window.updateGhostTrails = function() {
    if (!window.p1 || window.gameOver) return;
    if (!window.ghostTrails) window.ghostTrails = [];
    
    if ((window.p1.dashTimer > 0 || window.p1.state === 'cast') && window.ghostTrails.length < 5) {
        if (Math.random() > 0.5) {
            window.ghostTrails.push({
                x: window.p1.x, y: window.p1.y,
                scale: window.p1.scale, state: window.p1.state,
                isFacingRight: window.p1.isFacingRight,
                alpha: 0.35, life: 10,
                drawMethod: window.p1.drawMethod,
                avatarUrl: window.p1.avatarUrl,
                color: window.p1.color
            });
        }
    }

    for (let i = window.ghostTrails.length - 1; i >= 0; i--) {
        let t = window.ghostTrails[i];
        t.life--; 
        t.alpha -= 0.035;
        if (t.life <= 0 || t.alpha <= 0) window.ghostTrails.splice(i, 1);
    }
};

window.drawGhostTrails = function(ctx) {
    if (!window.ghostTrails || window.ghostTrails.length === 0) return;
    window.ghostTrails.forEach(t => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.alpha);
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, t, true);
        ctx.restore();
    });
};

// --- 2. VẼ HÀO QUANG KHI GỒNG ULTIMATE (AURA) ---
window.drawAura = function(ctx, char) {
    if (!char || char.state !== 'cast') return;
    let time = Date.now() / 60; 
    ctx.save();
    ctx.translate(char.x, char.y);
    for (let i = 0; i < 2; i++) {
        let offsetY = Math.sin(time + i) * 6 - 25;
        let scaleX = 0.9 + Math.sin(time * 0.5 + i) * 0.15;
        ctx.beginPath();
        ctx.ellipse(0, offsetY, 32 * scaleX * (char.scale || 1), 65 * (char.scale || 1), 0, 0, Math.PI * 2);
        ctx.fillStyle = char.isPlayer ? "rgba(241, 196, 15, 0.22)" : "rgba(255, 71, 87, 0.22)";
        ctx.fill();
    }
    ctx.restore();
};

// --- 3. HÀM DUY NHẤT VẼ CHỮ SÁT THƯƠNG / FLOATING TEXTS ---
window.drawFloatingTexts = function(ctx) {
    if (!window.floatingTexts || window.floatingTexts.length === 0) return;
    window.floatingTexts.forEach(t => { 
        ctx.save(); 
        ctx.translate(t.x, t.y); 
        let safeScale = Math.max(0.8, Math.min(1.25, t.scale || 1.0)); 
        ctx.scale(safeScale, safeScale); 
        ctx.font = t.font || "bold 16px Arial, sans-serif"; 
        ctx.fillStyle = t.color; 
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle"; 
        ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha)); 
        ctx.lineWidth = 3; 
        ctx.strokeStyle = "rgba(0, 0, 0, 0.85)"; 
        ctx.strokeText(t.text, 0, 0); 
        ctx.fillText(t.text, 0, 0); 
        ctx.restore();
    });
};

// ==========================================
// 4. HÀM VẼ TRUNG TÂM (WINDOW.DRAW)
// ==========================================
window.draw = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx) return;
    
    window.camOrbitAngle = 0;
    window.targetCamOrbitAngle = 0;
    window.cameraTilt = 0;
    window.targetTilt = 0;
    window.cinemaBarsHeight = ((window.targetCinemaBars || 0) - (window.cinemaBarsHeight || 0)) * 0.1 + (window.cinemaBarsHeight || 0);

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;
    window.ctx.filter = (window.invertFrames > 0) ? 'invert(100%)' : 'none';

    window.ctx.fillStyle = "#000000";
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    let allFighters = []; 
    if (window.p1) allFighters.push(window.p1); 
    if (window.enemies) allFighters = allFighters.concat(window.enemies); 
    allFighters = allFighters.filter(f => f);
    
    let sortedFighters = allFighters.map(f => { 
        f.drawX = f.x; 
        f.drawY = f.y; 
        f.drawZ = 0; 
        f.drawScale = f.scale || 1.0; 
        f.drawFacingRight = f.isFacingRight; 
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
        window.ctx.fillRect(cx - 177, window.canvas.height - 52, ((window.loadProgress || 0) / 100) * 354, 10);
        return; 
    }

    window.ctx.save();

    try {
        window.ctx.save();

        if (window.shakeTime > 0) {
            let safeMag = Math.min(window.shakeMag || 2, 6);
            window.ctx.translate((Math.random() - 0.5) * safeMag, (Math.random() - 0.5) * safeMag); 
        }
        
        let actualZoom = Math.max(0.95, Math.min(1.25, window.currentZoom || 1));
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        window.ctx.translate(-window.canvas.width / 2 + (window.camX || 0), -window.canvas.height / 2 + (window.camY || 0));

        // 1. VẼ LÃNH ĐỊA (DOMAIN EXPANSION) HOẶC BẢN ĐỒ 5 LỚP CHIỀU SÂU TỪ ENVIRONMENT.JS
        if (window.activeDomain) {
            let dom = window.activeDomain;
            let domGrad = window.ctx.createLinearGradient(0, -300, 0, window.GROUND_Y);
            domGrad.addColorStop(0, dom.bg1);
            domGrad.addColorStop(1, dom.bg2);
            window.ctx.fillStyle = domGrad;
            window.ctx.fillRect(-(window.camX || 0) - 1000, -1000, window.canvas.width + 2000, window.canvas.height + 2000);

            window.ctx.save();
            window.ctx.translate(window.canvas.width / 2 - (window.camX || 0), window.GROUND_Y - 145);
            window.ctx.globalAlpha = 0.25 + Math.sin(Date.now() / 120) * 0.08;
            window.ctx.font = "160px Arial";
            window.ctx.textAlign = "center";
            window.ctx.textBaseline = "middle";
            window.ctx.fillText(dom.emoji, 0, 0);
            window.ctx.restore();

            let groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200); 
            groundGrad.addColorStop(0, dom.bg1); 
            groundGrad.addColorStop(1, "#000000"); 
            window.ctx.fillStyle = groundGrad; 
            window.ctx.fillRect(-3000, window.GROUND_Y, window.canvas.width + 6000, window.canvas.height - window.GROUND_Y + 600); 

            window.ctx.strokeStyle = dom.bg2; 
            window.ctx.lineWidth = 3; 
            window.ctx.beginPath(); 
            window.ctx.moveTo(-2000, window.GROUND_Y); 
            window.ctx.lineTo(window.canvas.width + 2000, window.GROUND_Y); 
            window.ctx.stroke();
        } else if (typeof window.drawMapBackground === 'function') {
            window.drawMapBackground(window.ctx);
        }

        if (typeof window.updateWeatherPhysics === 'function') window.updateWeatherPhysics();
        if (typeof window.drawEnvironmentDamage === 'function') window.drawEnvironmentDamage(window.ctx);
        
        // 3. BÓNG ĐỔ DƯỚI CHÂN NHÂN VẬT
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

        // 4. VẼ TÀN ẢNH (GHOST TRAILS) & PHÂN THÂN (PHANTOM CLONES)
        window.drawGhostTrails(window.ctx);

        (window.phantomClones || []).forEach(cl => {
            window.ctx.save();
            window.ctx.globalAlpha = 0.75;
            if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, cl, true);
            window.ctx.restore();
        });

        // 5. VẼ HAI ĐẤU SĨ 1 VS 1
        if (window.p1) {
            sortedFighters.forEach(p => { 
                window.ctx.save(); 
                window.ctx.globalAlpha = 1.0;
                window.drawAura(window.ctx, p);

                if (p.state === 'ko_falling' || p.state === 'dead') { 
                    window.ctx.translate(p.drawX, p.drawY); 
                    let angle = Math.PI / 2; 
                    if (p.state === 'ko_falling') { 
                        let progress = (100 - (p.koTimer || 0)) / 30; 
                        if (progress > 1) progress = 1; 
                        angle = progress * (Math.PI / 2); 
                    } 
                    let fallDir = p.drawFacingRight ? -1 : 1; 
                    window.ctx.rotate(angle * fallDir); 
                    let clone = Object.assign({}, p, { x: 0, y: 0, scale: p.drawScale, hasEngineShadow: true, scarfNodes: p.scarfNodes, currentSkeleton: p.currentSkeleton }); 
                    if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 
                } else { 
                    window.ctx.translate(p.drawX, p.drawY); 
                    let clone = Object.assign({}, p, {
                        x: 0, y: 0,
                        scale: p.drawScale,
                        isFacingRight: p.drawFacingRight,
                        hasEngineShadow: true,
                        scarfNodes: p.scarfNodes,
                        currentSkeleton: p.currentSkeleton,
                        attackTrail: p.attackTrail
                    }); 

                    if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, clone); 

                    p.scarfNodes = clone.scarfNodes;
                    p.currentSkeleton = clone.currentSkeleton;
                    p.attackTrail = clone.attackTrail;
                }
                window.ctx.restore();
            }); 
        }

        // 6. VẼ HIỆU ỨNG KỸ NĂNG, VÒNG XUNG KÍCH 3D, MƯA KÌNH LỰC & BLACK FLASH
        (window.giantDrops || []).forEach(gd => {
            window.ctx.save();
            window.ctx.translate(gd.x, gd.y);
            window.ctx.globalAlpha = Math.min(1, gd.life / 15);
            window.ctx.font = `${gd.size}px Arial`;
            window.ctx.textAlign = "center";
            window.ctx.textBaseline = "bottom";
            window.ctx.fillText(gd.emoji, 0, 0);
            window.ctx.restore();
        });

        (window.blackHoles || []).forEach(b => {
            window.ctx.save(); window.ctx.translate(b.x, b.y);
            window.ctx.globalAlpha = Math.min(1, b.life / 20); 
            window.ctx.fillStyle = "#08080c";
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.55, 0, Math.PI * 2); window.ctx.fill(); 
            window.ctx.strokeStyle = b.color || "#8e44ad"; window.ctx.lineWidth = 8;
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * (0.7 + Math.sin(Date.now() / 60) * 0.1), 0, Math.PI * 2); window.ctx.stroke(); 
            window.ctx.restore();
        });

        window.ctx.globalCompositeOperation = 'lighter';
        (window.energyPillars || []).forEach(p => {
            window.ctx.save(); window.ctx.translate(p.x, p.y);
            window.ctx.globalAlpha = Math.min(1, p.life / 15);
            let grad = window.ctx.createLinearGradient(0, 0, 0, -600 * p.scaleY); 
            grad.addColorStop(0, p.color); grad.addColorStop(1, "rgba(255,255,255,0)");
            window.ctx.fillStyle = grad; 
            window.ctx.fillRect(-p.r, -600 * p.scaleY, p.r * 2, 600 * p.scaleY);
            window.ctx.restore();
        });

        (window.phantomFists || []).forEach(pf => {
            window.ctx.save();
            window.ctx.translate(pf.x, pf.y);
            window.ctx.globalAlpha = pf.life / pf.maxLife;
            let tailLen = 38;
            let dir = pf.isRight ? 1 : -1;
            let grad = window.ctx.createLinearGradient(0, 0, -dir * tailLen, 0);
            grad.addColorStop(0, pf.color);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            window.ctx.strokeStyle = grad;
            window.ctx.lineWidth = pf.size;
            window.ctx.lineCap = "round";
            window.ctx.beginPath();
            window.ctx.moveTo(0, 0);
            window.ctx.lineTo(-dir * tailLen, 0);
            window.ctx.stroke();

            window.ctx.fillStyle = "#ffffff";
            window.ctx.beginPath();
            window.ctx.arc(0, 0, pf.size * 0.45, 0, Math.PI * 2);
            window.ctx.fill();
            window.ctx.restore();
        });

        (window.hitRings || []).forEach(hr => {
            window.ctx.save();
            window.ctx.translate(hr.x, hr.y);
            window.ctx.rotate(hr.angle || 0);
            let prog = hr.life / hr.maxLife;
            window.ctx.globalAlpha = prog * 0.85;
            window.ctx.strokeStyle = hr.color || "#00f3ff";
            window.ctx.lineWidth = 4.5 * prog;
            window.ctx.beginPath();
            window.ctx.ellipse(0, 0, hr.r, hr.r * 0.35, 0, 0, Math.PI * 2);
            window.ctx.stroke();

            window.ctx.strokeStyle = "#ffffff";
            window.ctx.lineWidth = 1.5 * prog;
            window.ctx.beginPath();
            window.ctx.ellipse(0, 0, hr.r * 0.88, hr.r * 0.28, 0, 0, Math.PI * 2);
            window.ctx.stroke();
            window.ctx.restore();
        });

        window.ctx.globalCompositeOperation = 'source-over'; 
        window.ctx.globalAlpha = 1.0;

        (window.traps || []).forEach(t => { 
            window.ctx.beginPath(); window.ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2); 
            window.ctx.fillStyle = t.color; window.ctx.globalAlpha = Math.max(0, Math.min(1, t.life / t.maxLife)) * 0.5; 
            window.ctx.fill(); window.ctx.globalAlpha = 1.0; 
        });

        (window.projectiles || []).forEach(proj => { 
            if (proj.emoji) {
                window.ctx.save();
                window.ctx.font = `${proj.radius * 2}px Arial`;
                window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle";
                window.ctx.fillText(proj.emoji, proj.x, proj.y);
                window.ctx.restore();
            } else {
                window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2); 
                window.ctx.fillStyle = proj.color; window.ctx.fill(); 
                if (proj.isMeteor) { 
                    window.ctx.beginPath(); window.ctx.arc(proj.x, proj.y, proj.radius + 8, 0, Math.PI * 2); 
                    window.ctx.fillStyle = "rgba(230, 126, 34, 0.35)"; window.ctx.fill(); 
                } 
            }
        });

        (window.customObjs || []).forEach(obj => {
            window.ctx.save();
            window.ctx.translate(obj.x, obj.y);
            if (obj.spin) window.ctx.rotate(obj.ang);
            window.ctx.globalAlpha = Math.max(0, Math.min(1, obj.life / 15));
            window.ctx.font = obj.font || "bold 20px Arial";
            window.ctx.textAlign = "center";
            window.ctx.textBaseline = "middle";
            window.ctx.lineWidth = 3;
            window.ctx.strokeStyle = "rgba(0,0,0,0.8)";
            window.ctx.strokeText(obj.text, 0, 0);
            window.ctx.fillStyle = obj.color || "#ffffff";
            window.ctx.fillText(obj.text, 0, 0);
            window.ctx.restore();
        });
        
        (window.auras || []).forEach(a => { 
            let prog = a.life / a.maxLife; 
            window.ctx.globalCompositeOperation = 'lighter'; 
            window.ctx.globalAlpha = prog * 0.6; 
            window.ctx.fillStyle = a.color; 
            if (a.life % 4 > 1) { 
                window.ctx.beginPath(); window.ctx.ellipse(a.x, window.GROUND_Y, a.r, a.r * 0.25, 0, 0, Math.PI * 2); window.ctx.fill(); 
            } 
            window.ctx.globalAlpha = 1.0; window.ctx.globalCompositeOperation = 'source-over'; 
        });

        (window.lasers || []).forEach(l => { 
            let prog = l.life / l.maxLife; 
            window.ctx.save();
            window.ctx.globalCompositeOperation = 'lighter'; 
            window.ctx.globalAlpha = prog; 
            window.ctx.fillStyle = l.color; 
            let currentWidth = l.width * (0.8 + Math.random() * 0.3); 
            let startX = l.x; 
            let endX = l.isRight ? window.canvas.width + 500 : -500; 
            window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth / 2, Math.abs(endX - startX), currentWidth); 
            window.ctx.fillStyle = "#fff"; 
            window.ctx.fillRect(l.isRight ? startX : endX, l.y - currentWidth / 4, Math.abs(endX - startX), currentWidth / 2); 
            window.ctx.restore();
        });

        (window.slashes || []).forEach(s => { 
            window.ctx.save(); window.ctx.translate(s.x, s.y); 
            if (!s.isRight) window.ctx.scale(-1, 1); 
            let safeScale = Math.min(s.scale || 1.2, 4.5);
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
        
        (window.particles || []).forEach(pt => { 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / (pt.maxLife || 30))); 
            window.ctx.fillStyle = pt.color; 
            if (pt.isGroundDust) { window.ctx.beginPath(); window.ctx.ellipse(pt.x, window.GROUND_Y - pt.size / 2, pt.size * 1.3, pt.size * 0.35, 0, 0, Math.PI * 2); window.ctx.fill(); }
            else if (pt.isRubble) { window.ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size); } 
            else { window.ctx.beginPath(); window.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); window.ctx.fill(); }
        }); 
        window.ctx.globalAlpha = 1.0;

        (window.lightningArcs || []).forEach(l => {
            if (!l.pts || l.pts.length === 0) return;
            window.ctx.save();
            window.ctx.beginPath();
            window.ctx.moveTo(l.pts[0].x, l.pts[0].y);
            for (let i = 1; i < l.pts.length; i++) { window.ctx.lineTo(l.pts[i].x, l.pts[i].y); }

            if (l.isBlackFlash) {
                window.ctx.strokeStyle = "#ff003c";
                window.ctx.lineWidth = 8.5;
                window.ctx.stroke();
                window.ctx.strokeStyle = "#000000";
                window.ctx.lineWidth = 3.5;
                window.ctx.stroke();
            } else {
                window.ctx.globalCompositeOperation = 'lighter';
                window.ctx.strokeStyle = l.color || "#fff";
                window.ctx.lineWidth = 2.8;
                window.ctx.stroke();
            }
            window.ctx.restore();
        });

        window.ctx.globalCompositeOperation = 'lighter';
        (window.shockwaves || []).forEach(sw => { 
            window.ctx.beginPath(); window.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2); 
            window.ctx.lineWidth = 3; window.ctx.strokeStyle = sw.color; 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha)); window.ctx.stroke(); 
        });

        (window.spaceRipples || []).forEach(sr => {
            window.ctx.beginPath(); window.ctx.arc(sr.x, sr.y, sr.r, 0, Math.PI * 2);
            window.ctx.lineWidth = 2; window.ctx.strokeStyle = sr.color || "#00f3ff";
            window.ctx.globalAlpha = Math.max(0, sr.life / sr.maxLife) * 0.65; window.ctx.stroke();
        });
        
        (window.impactSparks || []).forEach(isp => { 
            window.ctx.save(); window.ctx.translate(isp.x, isp.y); 
            window.ctx.globalAlpha = Math.max(0, Math.min(1, isp.life / isp.maxLife)); 
            window.ctx.fillStyle = isp.color; 
            let len = Math.min(25, Math.sqrt(isp.vx * isp.vx + isp.vy * isp.vy) * 1.8); 
            let ang = Math.atan2(isp.vy, isp.vx); 
            window.ctx.rotate(ang); 
            window.ctx.fillRect(-len / 2, -1.5, len, 3);
            window.ctx.restore(); 
        });

        (window.dimensionCracks || []).forEach(dc => {
            window.ctx.save();
            window.ctx.globalAlpha = Math.max(0, dc.life / dc.maxLife);
            window.ctx.strokeStyle = dc.color || "#00f3ff";
            window.ctx.lineWidth = 3;
            window.ctx.beginPath();
            dc.main.forEach((pt, idx) => { if (idx === 0) window.ctx.moveTo(pt.x, pt.y); else window.ctx.lineTo(pt.x, pt.y); });
            window.ctx.stroke();
            window.ctx.lineWidth = 1.5;
            window.ctx.strokeStyle = "#ffffff";
            dc.branches.forEach(br => {
                window.ctx.beginPath();
                br.forEach((pt, idx) => { if (idx === 0) window.ctx.moveTo(pt.x, pt.y); else window.ctx.lineTo(pt.x, pt.y); });
                window.ctx.stroke();
            });
            window.ctx.restore();
        });

        window.ctx.globalCompositeOperation = "source-over"; 
        window.ctx.globalAlpha = 1.0;

        // 7. VẼ THIÊN TAI & THỜI TIẾT
        if (typeof window.drawEnvironmentalHazards === 'function') window.drawEnvironmentalHazards(window.ctx);
        if (typeof window.drawWeatherEffects === 'function') window.drawWeatherEffects(window.ctx);

        // 8. VẼ CHỮ SÁT THƯƠNG / FLOATING TEXTS
        window.drawFloatingTexts(window.ctx);

        window.ctx.restore(); // KẾT THÚC CAMERA TRANSFORM

        // HIỆU ỨNG NHIỄU SÓNG RGB (IMPACT ABERRATION) & CHỚP MÀN HÌNH
        if (window.impactAberration > 0) {
            let shift = window.impactAberration * 2.5;
            window.ctx.save();
            window.ctx.globalAlpha = 0.35;
            window.ctx.globalCompositeOperation = "screen";
            window.ctx.drawImage(window.canvas, -shift, 0);
            window.ctx.drawImage(window.canvas, shift, 0);
            window.ctx.restore();
        }
        if (window.screenFlash > 0) {
            window.ctx.save();
            window.ctx.globalAlpha = window.screenFlash;
            window.ctx.fillStyle = window.screenFlashColor || "#ffffff";
            window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
            window.ctx.restore();
        }

        // 9. BẢNG XẾP HẠNG HYPER COMBO (D -> SSS -> GODLIKE) + THANH THỜI GIAN DUY TRÌ COMBO
        let renderComboRank = function(fighter, xPos, align) {
            if (fighter && fighter.comboHits >= 2) {
                let alpha = Math.max(0, fighter.comboAlpha || 1); 
                let hits = fighter.comboHits; 
                let rank = "D"; let rankTitle = "RUSHDOWN"; let rankColor = "#bdc3c7"; let rankSize = 26;
                if (hits >= 4) { rank = "C"; rankTitle = "SAVAGE!"; rankColor = "#2ecc71"; rankSize = 28; } 
                if (hits >= 6) { rank = "B"; rankTitle = "BRUTAL!"; rankColor = "#3498db"; rankSize = 30; } 
                if (hits >= 8) { rank = "A"; rankTitle = "RELENTLESS!"; rankColor = "#9b59b6"; rankSize = 33; } 
                if (hits >= 12) { rank = "S"; rankTitle = "SUPREME!"; rankColor = "#f1c40f"; rankSize = 36; } 
                if (hits >= 16) { rank = "SS"; rankTitle = "UNSTOPPABLE!"; rankColor = "#e67e22"; rankSize = 39; } 
                if (hits >= 20) { rank = "SSS"; rankTitle = "GODLIKE!!"; rankColor = "#ff003c"; rankSize = 44; }
                
                let pop = fighter.comboPopScale || 1.0;

                if (hits >= 12) {
                    window.ctx.save();
                    window.ctx.strokeStyle = rankColor;
                    window.ctx.globalAlpha = 0.22 * alpha;
                    window.ctx.lineWidth = 2;
                    let cx = window.canvas.width / 2;
                    let cy = window.canvas.height / 2;
                    for (let sl = 0; sl < 10; sl++) {
                        let ang = (Math.PI * 2 / 10) * sl + (Date.now() / 120);
                        window.ctx.beginPath();
                        window.ctx.moveTo(cx + Math.cos(ang) * 280, cy + Math.sin(ang) * 160);
                        window.ctx.lineTo(cx + Math.cos(ang) * 520, cy + Math.sin(ang) * 320);
                        window.ctx.stroke();
                    }
                    window.ctx.restore();
                }

                window.ctx.save();
                window.ctx.globalAlpha = alpha; 
                let baseY = 74; 
                window.ctx.translate(xPos, baseY);
                window.ctx.scale(pop, pop);
                window.ctx.textAlign = align; 

                window.ctx.fillStyle = rankColor; 
                window.ctx.font = `italic 900 ${rankSize}px 'Arial Black', Impact`; 
                window.ctx.lineWidth = 4;
                window.ctx.strokeStyle = "#000";
                window.ctx.strokeText(rank, 0, 0);
                window.ctx.fillText(rank, 0, 0);
                
                window.ctx.font = "italic 900 15px Arial"; 
                window.ctx.fillStyle = "#fff"; 
                window.ctx.strokeText(`🔥 ${hits} HITS • ${rankTitle}`, 0, 20);
                window.ctx.fillText(`🔥 ${hits} HITS • ${rankTitle}`, 0, 20); 

                let barW = 105;
                let timerPct = Math.max(0, Math.min(1, (fighter.comboDisplayTimer || 0) / 95));
                let barX = (align === "left") ? 0 : -barW;
                window.ctx.fillStyle = "rgba(0,0,0,0.65)";
                window.ctx.fillRect(barX, 27, barW, 5);
                window.ctx.fillStyle = rankColor;
                window.ctx.fillRect(barX, 27, barW * timerPct, 5);

                window.ctx.restore();
            }
        };

        renderComboRank(window.p1, 28, "left"); 
        let maxEnemyCombo = (window.enemies && window.enemies[0] && window.enemies[0].comboHits >= 2) ? window.enemies[0] : null;
        renderComboRank(maxEnemyCombo, window.canvas.width - 28, "right");

        // ==========================================
        // 10. MÀN HÌNH INTRO VS & CHỮ "🥊 FIGHT! 🥊" ĐẦU TRẬN
        // ==========================================
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.save(); 
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.introTimer > 55) {
                let progress = Math.min(1, Math.max(0, (215 - window.introTimer) / 45)); 
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
                let p1IntroDance = (window.DanceEngine && window.DanceEngine.currentP1Dance) ? window.DanceEngine.currentP1Dance : (window.p1.introState || 'idle');
                
                if (window.DanceEngine) {
                    window.DanceEngine.drawDancer(window.ctx, window.p1, slideX1, window.GROUND_Y + 40, true, (window.p1.scale || 1) * 1.35, p1IntroDance);
                } else {
                    let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y + 40, state: p1IntroDance, isFacingRight: true, scale: (window.p1.scale || 1) * 1.35, hideHpBar: true}); 
                    if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                }
                
                if (repEnemy) { 
                    let p2IntroDance = (window.DanceEngine && window.DanceEngine.currentP2Dance) ? window.DanceEngine.currentP2Dance : (repEnemy.introState || 'idle');
                    if (window.DanceEngine) {
                        window.DanceEngine.drawDancer(window.ctx, repEnemy, slideX2, window.GROUND_Y + 40, false, (repEnemy.scale || 1) * 1.35, p2IntroDance);
                    } else {
                        let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y + 40, state: p2IntroDance, isFacingRight: false, scale: (repEnemy.scale || 1) * 1.35, hideHpBar: true}); 
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                    }
                }
                if (window.introTimer <= 190) { 
                    window.ctx.save(); window.ctx.translate(cx, cy + 30); 
                    window.ctx.font = "italic 900 55px Arial"; window.ctx.textAlign = "center"; 
                    window.ctx.fillStyle = "#fff"; window.ctx.fillText("VS", 0, 0); window.ctx.restore(); 
                }
            } else { 
                let fadeAlpha = (window.introTimer / 55) * 0.55; 
                window.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`; 
                window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
                window.ctx.save(); 
                window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
                let fightScale = 1 + (1 - window.introTimer / 55) * 0.22;
                window.ctx.scale(fightScale, fightScale);
                window.ctx.font = "italic 900 56px 'Arial Black', Arial"; 
                window.ctx.fillStyle = "#ff4757"; 
                window.ctx.strokeStyle = "#fff"; 
                window.ctx.lineWidth = 5; 
                window.ctx.textAlign = "center"; 
                window.ctx.textBaseline = "middle"; 
                window.ctx.strokeText("🥊 FIGHT! 🥊", 0, 0); 
                window.ctx.fillText("🥊 FIGHT! 🥊", 0, 0); 
                window.ctx.restore(); 
            }
            window.ctx.restore();
        }

    } finally { 
        window.ctx.restore(); 
    }
};

// ==========================================
// 5. TIME-ENGINE VÀ PHYSICS LOOP CHUẨN XÁC (60FPS)
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
    
    window.hitStopFrames = 0;
    window.timeScale = 1.0;
    window.physicsAccumulator += deltaTime;

    while (window.physicsAccumulator >= window.PHYSICS_STEP) {
        try { if (typeof window.update === 'function') window.update(); } catch(e) { } 
        window.physicsAccumulator -= window.PHYSICS_STEP;
    }

    window.currentZoom += ((window.targetZoom || 1) - (window.currentZoom || 1)) * 0.08;
    window.camX += ((window.targetCamX || 0) - (window.camX || 0)) * 0.1; 
    window.camY += ((window.targetCamY || 0) - (window.camY || 0)) * 0.1; 
    window.cameraTilt = 0;
    window.camOrbitAngle = 0;

    try { if (typeof window.draw === 'function') window.draw(); } catch(e) { } 
};

if (typeof window !== 'undefined') {
    setTimeout(() => { if (typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100);
}
