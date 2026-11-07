// ==========================================
// ENGINE_REND.JS - V9.1 HYPER COMBO & 5-LAYER MAP RENDERER (60FPS - 1V1)
// ĐÃ ĐỒNG BỘ 100% VỚI ENVIRONMENT.JS V8.0:
// 1. Ủy quyền vẽ 16 Bản đồ 5 lớp chiều sâu cho window.drawMapBackground(ctx) (Vẫn hỗ trợ Lãnh Địa activeDomain).
// 2. Giữ trọn vẹn hiệu ứng Hyper Combo V9.0: Vòng xung kích 3D (hitRings), Mưa kình lực (phantomFists) & Sét Hắc Thiểm (Black Flash).
// ==========================================

// --- 1. QUẢN LÝ & VẼ TÀN ẢNH (GHOST TRAILS) ---
window.updateGhostTrails = function() {
    if (!window.ghostTrails) window.ghostTrails = [];
    if (window.gameOver) {
        if (window.ghostTrails.length > 0) window.ghostTrails = [];
        if (window.phantomClones && window.phantomClones.length > 0) window.phantomClones = [];
        return;
    }
    if (!window.p1) return;
    
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
    if (window.gameOver || !window.ghostTrails || window.ghostTrails.length === 0) return;
    window.ghostTrails.forEach(t => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.alpha);
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, t, true);
        ctx.restore();
    });
};

// ==========================================
// VẼ BÓNG MA LINH HỒN BAY LÊN THIÊN ĐƯỜNG KHI BỊ K.O (ANGEL GHOST)
// ==========================================
window.drawKoGhosts = function(ctx) {
    if (!window.koGhosts || window.koGhosts.length === 0) return;
    ctx.save();
    window.koGhosts.forEach(g => {
        ctx.save();
        ctx.globalAlpha = g.alpha * 0.9;
        ctx.translate(g.x, g.y);

        let t = Date.now() / 140 + g.seed;
        let wingFlap = Math.sin(t * 2.4) * 0.45;

        // 1. CẶP CÁNH THIÊN THẦN (ANGEL WINGS) ĐẬP NHẸ NHÀNG
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 1.5;

        // Cánh trái
        ctx.save();
        ctx.translate(-10, -22);
        ctx.rotate(-0.35 + wingFlap);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-18, -20, -32, -8, -25, 12);
        ctx.bezierCurveTo(-18, 14, -8, 8, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Cánh phải
        ctx.save();
        ctx.translate(10, -22);
        ctx.rotate(0.35 - wingFlap);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(18, -20, 32, -8, 25, 12);
        ctx.bezierCurveTo(18, 14, 8, 8, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();

        // 2. THÂN HÌNH BÓNG MA / LINH HỒN STICKMAN (GHOST TAIL)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";

        let sway = Math.sin(t * 1.6) * 7;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.quadraticCurveTo(sway * 0.5, 0, sway, 20);
        ctx.stroke();

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.beginPath();
        ctx.moveTo(sway, 20);
        ctx.quadraticCurveTo(sway * 1.5, 30, sway * 0.8, 40);
        ctx.stroke();

        // Hai tay buông thõng thanh thản
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(-12, -2 + Math.sin(t) * 3);
        ctx.moveTo(0, -14);
        ctx.lineTo(12, -2 - Math.sin(t) * 3);
        ctx.stroke();

        // 3. ĐẦU LINH HỒN & AVATAR (Hào quang mềm không dùng shadowBlur)
        let headRadius = 13;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -30, headRadius + 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 243, 255, 0.28)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -30, headRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();
        ctx.restore();

        if (g.avatarUrl && typeof window.getSharedCachedImg === 'function') {
            let img = window.getSharedCachedImg(g.avatarUrl);
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, -30, headRadius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img._mip96 || img, -headRadius, -30 - headRadius, headRadius * 2, headRadius * 2);
                ctx.restore();
            }
        }

        // 4. VÒNG HÀO QUANG VÀNG KIM TRÊN ĐẦU (ANGEL HALO)
        ctx.save();
        let haloY = -48 + Math.sin(t * 2) * 2;
        ctx.beginPath();
        ctx.ellipse(0, haloY, 17, 5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 235, 59, 0.35)";
        ctx.lineWidth = 6.5;
        ctx.stroke();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.8;
        ctx.stroke();
        ctx.restore();

        // 5. CÁC ĐỐM SÁNG LINH HỒN BAY LƠ LỬNG (SOUL SPARKLES)
        ctx.fillStyle = "#ffd700";
        for (let s = 0; s < 3; s++) {
            let spX = Math.sin(t * 2 + s * 2) * 16;
            let spY = -15 + Math.cos(t * 1.5 + s * 3) * 22;
            ctx.fillRect(spX - 1.5, spY - 1.5, 3, 3);
        }

        ctx.restore();
    });
    ctx.restore();
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

// --- 3. HÀM DUY NHẤT VẼ CHỮ SÁT THƯƠNG / FLOATING TEXTS (SPRITE-CACHED ZERO-JANK) ---
window.drawFloatingTexts = function(ctx) {
    if (!window.floatingTexts || window.floatingTexts.length === 0) return;
    let interpA = (window._renderInterpAlpha !== undefined) ? window._renderInterpAlpha : 1.0;
    let back = 1 - interpA;
    for (let i = 0; i < window.floatingTexts.length; i++) {
        let t = window.floatingTexts[i];
        if (!t) continue;
        if (t.isSkillTitle) { window.drawSkillTitleText(ctx, t, back); continue; }
        let alpha = Math.max(0, Math.min(1, t.alpha));
        if (alpha <= 0.01) continue;
        let tx = t.x - (t.vx || 0) * back;
        let ty = t.y - (t.vy || 0) * back;
        let safeScale = Math.max(0.8, Math.min(1.25, t.scale || 1.0));
        let fontStr = t.font || "bold 16px Arial, sans-serif";
        let sp = (typeof window.getTextSpriteCached === 'function')
            ? window.getTextSpriteCached(t.text, fontStr, t.color || "#ffffff", "rgba(0, 0, 0, 0.85)", 3)
            : null;
        ctx.save();
        ctx.translate(tx, ty);
        if (safeScale !== 1.0) ctx.scale(safeScale, safeScale);
        ctx.globalAlpha = alpha;
        if (sp) {
            ctx.drawImage(sp.cv, -sp.w * 0.5, -sp.h * 0.5, sp.w, sp.h);
        } else {
            ctx.font = fontStr;
            ctx.fillStyle = t.color || "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
            ctx.strokeText(t.text, 0, 0);
            ctx.fillText(t.text, 0, 0);
        }
        ctx.restore();
    }
};

// --- 3A. TÊN TUYỆT KỸ TRÊN ĐẦU NHÂN VẬT (PRE-BAKED OFF-SCREEN BANNER 0.04ms) ---
window._skillBannerCache = new Map();
window.getSkillTitleBannerCached = function(text, col) {
    if (typeof document === 'undefined' || !text) return null;
    let safeCol = col || "#00f3ff";
    let key = text + '|' + safeCol;
    let hit = window._skillBannerCache.get(key);
    if (hit) return hit;

    if (window._skillBannerCache.size >= 48) {
        let firstKey = window._skillBannerCache.keys().next().value;
        if (firstKey !== undefined) window._skillBannerCache.delete(firstKey);
    }

    let fontStr = "italic 900 19px 'Arial Black', Impact, Arial, sans-serif";
    let mCtx = window._textMeasureCtx;
    if (!mCtx) {
        let mCv = document.createElement('canvas');
        mCv.width = 16; mCv.height = 16;
        mCtx = mCv.getContext('2d');
        window._textMeasureCtx = mCtx;
    }
    mCtx.font = fontStr;
    let textW = Math.ceil(mCtx.measureText(text).width);
    let h = 28;
    let padX = 18;
    let skew = 8;
    let halfW = textW * 0.5 + padX;
    let logW = Math.ceil((halfW + skew + 12) * 2);
    let logH = 44;
    let dpr = 1.25;

    let cv = document.createElement('canvas');
    cv.width = Math.ceil(logW * dpr);
    cv.height = Math.ceil(logH * dpr);
    let bCtx = cv.getContext('2d');
    bCtx.scale(dpr, dpr);
    bCtx.translate(logW * 0.5, logH * 0.5);

    bCtx.beginPath();
    bCtx.moveTo(-halfW + skew, -h * 0.5);
    bCtx.lineTo(halfW + skew, -h * 0.5);
    bCtx.lineTo(halfW - skew, h * 0.5);
    bCtx.lineTo(-halfW - skew, h * 0.5);
    bCtx.closePath();
    let bg = bCtx.createLinearGradient(-halfW, 0, halfW, 0);
    bg.addColorStop(0, "rgba(0, 0, 0, 0)");
    bg.addColorStop(0.16, "rgba(5, 8, 16, 0.68)");
    bg.addColorStop(0.84, "rgba(5, 8, 16, 0.68)");
    bg.addColorStop(1, "rgba(0, 0, 0, 0)");
    bCtx.fillStyle = bg;
    bCtx.fill();

    let lineG = bCtx.createLinearGradient(-halfW, 0, halfW, 0);
    lineG.addColorStop(0, "rgba(255,255,255,0)");
    lineG.addColorStop(0.5, safeCol);
    lineG.addColorStop(1, "rgba(255,255,255,0)");
    bCtx.strokeStyle = lineG;
    bCtx.lineWidth = 1.6;
    bCtx.beginPath();
    bCtx.moveTo(-halfW + skew, -h * 0.5); bCtx.lineTo(halfW + skew, -h * 0.5);
    bCtx.moveTo(-halfW - skew, h * 0.5); bCtx.lineTo(halfW - skew, h * 0.5);
    bCtx.stroke();

    bCtx.font = fontStr;
    bCtx.textAlign = "center";
    bCtx.textBaseline = "middle";
    bCtx.lineJoin = "round";

    bCtx.save();
    bCtx.globalAlpha = 0.34;
    bCtx.lineWidth = 8.5;
    bCtx.strokeStyle = safeCol;
    bCtx.strokeText(text, 0, 1);
    bCtx.restore();

    bCtx.lineWidth = 4.5;
    bCtx.strokeStyle = "rgba(0, 0, 0, 0.92)";
    bCtx.strokeText(text, 0, 1);

    let txtG = bCtx.createLinearGradient(0, -10, 0, 10);
    txtG.addColorStop(0, "#ffffff");
    txtG.addColorStop(0.55, "#ffffff");
    txtG.addColorStop(1, safeCol);
    bCtx.fillStyle = txtG;
    bCtx.fillText(text, 0, 1);

    let entry = { cv: cv, w: logW, h: logH };
    window._skillBannerCache.set(key, entry);
    return entry;
};

window.drawSkillTitleText = function(ctx, t, backOffset) {
    let age = t.age || 0;
    let col = t.skillColor || t.color || "#00f3ff";
    let alpha = Math.max(0, Math.min(1, t.alpha));
    if (alpha <= 0.01) return;

    let back = (backOffset !== undefined) ? backOffset : 0;
    let tx = t.x - (t.vx || 0) * back;
    let ty = t.y - (t.vy || 0) * back;

    let k = Math.min(1, age / 10);
    let c1 = 1.70158, c3 = c1 + 1;
    let pop = 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
    let scale = 0.58 + 0.42 * pop;
    let revealX = Math.min(1, 0.35 + (age / 7) * 0.65);

    let sp = window.getSkillTitleBannerCached(t.text, col);
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(scale * revealX, scale);
    ctx.globalAlpha = alpha;
    if (sp) {
        ctx.drawImage(sp.cv, -sp.w * 0.5, -sp.h * 0.5, sp.w, sp.h);
    }
    ctx.restore();
};

// --- 3B. HOOK VẼ HIỆU ỨNG THẾ GIỚI RIÊNG CỦA NHÂN VẬT ---
// Nhân vật có thể khai báo drawWorldFX(ctx, fighter, layer) để vẽ vật thể theo TỌA ĐỘ THẾ GIỚI
// (vd: xe Tesla). Lý do: drawMethod chạy trong hệ tọa độ của nhân vật (đã translate/scale/lật),
// nên vật thể lớn vẽ trong đó sẽ bị lệch khỏi màn hình.
window.drawCharacterWorldFX = function(ctx, fighters, layer) {
    if (!ctx || !fighters || !window.classStats || window.gameOver) return;
    for (let i = 0; i < fighters.length; i++) {
        let f = fighters[i];
        if (!f || !f.classId) continue;
        let cd = window.classStats[f.classId] || window.classStats[String(f.classId).toLowerCase()];
        if (cd && typeof cd.drawWorldFX === 'function') {
            ctx.save();
            try { cd.drawWorldFX(ctx, f, layer); } catch (e) { console.error("Lỗi drawWorldFX:", e); }
            ctx.restore();
        }
    }
};

// ==========================================
// 4. HÀM VẼ TRUNG TÂM (WINDOW.DRAW)
// ==========================================
window.draw = function() {
    if (!window.canvas) { 
        window.canvas = document.getElementById("battleCanvas"); 
        if (window.canvas) window.ctx = window.canvas.getContext("2d", { alpha: false }) || window.canvas.getContext("2d"); 
    } 
    if (!window.canvas || !window.ctx) return;
    if (!window.ctx._fastGlowInstalled && typeof window.installFastGlowContext === 'function') {
        window.installFastGlowContext(window.ctx);
    }
    
    window.camOrbitAngle = 0;
    window.targetCamOrbitAngle = 0;
    window.cameraTilt = 0;
    window.targetTilt = 0;
    window.cinemaBarsHeight = ((window.targetCinemaBars || 0) - (window.cinemaBarsHeight || 0)) * 0.1 + (window.cinemaBarsHeight || 0);

    window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    window.ctx.globalAlpha = 1.0; 
    window.ctx.globalCompositeOperation = 'source-over'; 
    window.ctx.shadowBlur = 0;

    window.ctx.fillStyle = "#000000";
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    let sortedFighters = [];
    if (window.p1) sortedFighters.push(window.p1);
    if (window.enemies) {
        for (let i = 0; i < window.enemies.length; i++) {
            if (window.enemies[i]) sortedFighters.push(window.enemies[i]);
        }
    }

    let interpA = (window._renderInterpAlpha !== undefined) ? window._renderInterpAlpha : 1.0;
    for (let i = 0; i < sortedFighters.length; i++) {
        let f = sortedFighters[i];
        f.drawX = (f._prevX !== undefined && Math.abs(f.x - f._prevX) < 120) ? (f._prevX + (f.x - f._prevX) * interpA) : f.x;
        f.drawY = (f._prevY !== undefined && Math.abs(f.y - f._prevY) < 120) ? (f._prevY + (f.y - f._prevY) * interpA) : f.y;
        f.drawZ = 0;
        f.drawScale = f.scale || 1.0;
        f.drawFacingRight = f.isFacingRight;
    }

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
        let back = 1 - interpA;

        let shakeX = (window._prevShakeX || 0) + ((window._simShakeX || 0) - (window._prevShakeX || 0)) * interpA;
        let shakeY = (window._prevShakeY || 0) + ((window._simShakeY || 0) - (window._prevShakeY || 0)) * interpA;
        if (Math.abs(shakeX) > 0.02 || Math.abs(shakeY) > 0.02) {
            window.ctx.translate(shakeX, shakeY);
        }
        
        let actualZoom = Math.max(0.95, Math.min(1.25, window.currentZoom || 1));
        window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
        window.ctx.scale(actualZoom, actualZoom); 
        window.ctx.translate(-window.canvas.width / 2 + (window.camX || 0), -window.canvas.height / 2 + (window.camY || 0));

        // 1. VẼ LÃNH ĐỊA (DOMAIN EXPANSION - CACHED GRADIENTS & SPRITE) HOẶC BẢN ĐỒ 5 LỚP CHIỀU SÂU
        if (window.activeDomain) {
            let dom = window.activeDomain;
            if (!dom._skyGrad) {
                dom._skyGrad = window.ctx.createLinearGradient(0, -300, 0, window.GROUND_Y);
                dom._skyGrad.addColorStop(0, dom.bg1);
                dom._skyGrad.addColorStop(1, dom.bg2);
                dom._groundGrad = window.ctx.createLinearGradient(0, window.GROUND_Y, 0, window.canvas.height + 200);
                dom._groundGrad.addColorStop(0, dom.bg1);
                dom._groundGrad.addColorStop(1, "#000000");
            }
            window.ctx.fillStyle = dom._skyGrad;
            window.ctx.fillRect(-(window.camX || 0) - 1000, -1000, window.canvas.width + 2000, window.canvas.height + 2000);

            window.ctx.save();
            window.ctx.translate(window.canvas.width / 2 - (window.camX || 0), window.GROUND_Y - 145);
            window.ctx.globalAlpha = 0.25 + Math.sin((dom.maxLife - dom.life) * 0.14) * 0.08;
            let domSp = (typeof window.getTextSpriteCached === 'function')
                ? window.getTextSpriteCached(dom.emoji, "132px Arial", "#ffffff", "", 0)
                : null;
            if (domSp) {
                window.ctx.drawImage(domSp.cv, -domSp.w * 0.6, -domSp.h * 0.6, domSp.w * 1.2, domSp.h * 1.2);
            } else {
                window.ctx.font = "150px Arial";
                window.ctx.textAlign = "center";
                window.ctx.textBaseline = "middle";
                window.ctx.fillText(dom.emoji, 0, 0);
            }
            window.ctx.restore();

            window.ctx.fillStyle = dom._groundGrad; 
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

        if (!window.gameOver) {
            (window.phantomClones || []).forEach(cl => {
                let ox = cl.x, oy = cl.y;
                cl.x = ox - (cl.vx || 0) * back;
                cl.y = oy - (cl.vy || 0) * back;
                window.ctx.save();
                window.ctx.globalAlpha = 0.75;
                try {
                    if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, cl, true);
                } finally {
                    cl.x = ox; cl.y = oy;
                    window.ctx.restore();
                }
            });
        }

        // 5A. HIỆU ỨNG THẾ GIỚI RIÊNG CỦA TỪNG NHÂN VẬT - LỚP SAU LƯNG ĐẤU SĨ (vd: xe Tesla Cybertruck)
        window.drawCharacterWorldFX(window.ctx, sortedFighters, 'back');

        // 5. VẼ HAI ĐẤU SĨ 1 VS 1 (Zero Object.assign GC Allocation)
        if (window.p1) {
            for (let fi = 0; fi < sortedFighters.length; fi++) {
                let p = sortedFighters[fi];
                window.ctx.save(); 
                window.ctx.globalAlpha = 1.0;

                let origX = p.x, origY = p.y, origScale = p.scale, origFacing = p.isFacingRight, origHasShadow = p.hasEngineShadow;
                p.x = p.drawX;
                p.y = p.drawY;
                window.drawAura(window.ctx, p);

                try {
                    if (p.state === 'ko_falling' || p.state === 'dead') { 
                        let sobY = (p.state === 'dead') ? Math.sin(Date.now() / 45) * 1.5 : 0;
                        window.ctx.translate(p.drawX, p.drawY + sobY); 
                        let angle = Math.PI / 2; 
                        if (p.state === 'ko_falling') { 
                            let progress = (100 - (p.koTimer || 0)) / 30; 
                            if (progress > 1) progress = 1; 
                            angle = progress * (Math.PI / 2); 
                        } 
                        let fallDir = p.drawFacingRight ? -1 : 1; 
                        window.ctx.rotate(angle * fallDir); 
                        p.x = 0; p.y = 0; p.scale = p.drawScale; p.hasEngineShadow = true;
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p); 
                    } else { 
                        window.ctx.translate(p.drawX, p.drawY); 
                        p.x = 0; p.y = 0; p.scale = p.drawScale; p.isFacingRight = p.drawFacingRight; p.hasEngineShadow = true;
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p); 
                    }
                } finally {
                    p.x = origX;
                    p.y = origY;
                    p.scale = origScale;
                    p.isFacingRight = origFacing;
                    p.hasEngineShadow = origHasShadow;
                }
                window.ctx.restore();
            } 
        }

        // 5B. HIỆU ỨNG THẾ GIỚI RIÊNG CỦA TỪNG NHÂN VẬT - LỚP TRƯỚC MẶT ĐẤU SĨ
        window.drawCharacterWorldFX(window.ctx, sortedFighters, 'front');

        // 6. VẼ HIỆU ỨNG KỸ NĂNG, VÒNG XUNG KÍCH 3D, MƯA KÌNH LỰC & BLACK FLASH (SUB-FRAME + SPRITE CACHE)
        (window.giantDrops || []).forEach(gd => {
            let gy = gd.impacted ? gd.y : (gd.y - (gd.vy || 0) * back);
            window.ctx.save();
            window.ctx.translate(gd.x, gy);
            window.ctx.globalAlpha = Math.min(1, gd.life / 15);
            let gdSp = (typeof window.getTextSpriteCached === 'function')
                ? window.getTextSpriteCached(gd.emoji, `${gd.size}px Arial`, "#ffffff", "", 0)
                : null;
            if (gdSp) {
                window.ctx.drawImage(gdSp.cv, -gdSp.w * 0.5, -gdSp.h * 0.88, gdSp.w, gdSp.h);
            } else {
                window.ctx.font = `${gd.size}px Arial`;
                window.ctx.textAlign = "center";
                window.ctx.textBaseline = "bottom";
                window.ctx.fillText(gd.emoji, 0, 0);
            }
            window.ctx.restore();
        });

        (window.blackHoles || []).forEach(b => {
            window.ctx.save(); window.ctx.translate(b.x, b.y);
            window.ctx.globalAlpha = Math.min(1, b.life / 20); 
            window.ctx.fillStyle = "#08080c";
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * 0.55, 0, Math.PI * 2); window.ctx.fill(); 
            window.ctx.strokeStyle = b.color || "#8e44ad"; window.ctx.lineWidth = 8;
            window.ctx.beginPath(); window.ctx.arc(0, 0, b.r * (0.7 + Math.sin(b.life * 0.28) * 0.1), 0, Math.PI * 2); window.ctx.stroke(); 
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
            let pfx = pf.x - (pf.vx || 0) * back;
            let pfy = pf.y - (pf.vy || 0) * back;
            window.ctx.save();
            window.ctx.translate(pfx, pfy);
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
            let px = proj.x - (proj.vx || 0) * back;
            let py = proj.y - (proj.vy || 0) * back;
            if (proj.emoji) {
                let pSp = (typeof window.getTextSpriteCached === 'function')
                    ? window.getTextSpriteCached(proj.emoji, `${proj.radius * 2}px Arial`, "#ffffff", "", 0)
                    : null;
                if (pSp) {
                    window.ctx.drawImage(pSp.cv, px - pSp.w * 0.5, py - pSp.h * 0.5, pSp.w, pSp.h);
                } else {
                    window.ctx.save();
                    window.ctx.font = `${proj.radius * 2}px Arial`;
                    window.ctx.textAlign = "center"; window.ctx.textBaseline = "middle";
                    window.ctx.fillText(proj.emoji, px, py);
                    window.ctx.restore();
                }
            } else {
                window.ctx.beginPath(); window.ctx.arc(px, py, proj.radius, 0, Math.PI * 2); 
                window.ctx.fillStyle = proj.color; window.ctx.fill(); 
                if (proj.isMeteor) { 
                    window.ctx.beginPath(); window.ctx.arc(px, py, proj.radius + 8, 0, Math.PI * 2); 
                    window.ctx.fillStyle = "rgba(230, 126, 34, 0.35)"; window.ctx.fill(); 
                } 
            }
        });

        (window.customObjs || []).forEach(obj => {
            let alpha = Math.max(0, Math.min(1, obj.life / 15));
            if (alpha <= 0.01) return;
            let ox = obj.x - (obj.vx || 0) * back;
            let oy = obj.y - (obj.vy || 0) * back;
            let oAng = obj.spin ? ((obj.ang || 0) - 0.22 * back) : 0;
            let fontStr = obj.font || "bold 20px Arial";
            let sp = (typeof window.getTextSpriteCached === 'function')
                ? window.getTextSpriteCached(obj.text, fontStr, obj.color || "#ffffff", "rgba(0,0,0,0.8)", 3)
                : null;
            window.ctx.save();
            window.ctx.translate(ox, oy);
            if (obj.spin) window.ctx.rotate(oAng);
            window.ctx.globalAlpha = alpha;
            if (sp) {
                window.ctx.drawImage(sp.cv, -sp.w * 0.5, -sp.h * 0.5, sp.w, sp.h);
            } else {
                window.ctx.font = fontStr;
                window.ctx.textAlign = "center";
                window.ctx.textBaseline = "middle";
                window.ctx.lineWidth = 3;
                window.ctx.strokeStyle = "rgba(0,0,0,0.8)";
                window.ctx.strokeText(obj.text, 0, 0);
                window.ctx.fillStyle = obj.color || "#ffffff";
                window.ctx.fillText(obj.text, 0, 0);
            }
            window.ctx.restore();
        });

        // VẼ BÓNG ĐÁ TUYỆT KỸ (CR7, MESSI, NEYMAR, VOZINHA, YAMAL) - SUB-FRAME SMOOTH
        (window.cr7Balls || []).forEach(b => {
            let bx = b.x - (b.vx || 0) * back;
            let by = b.y - (b.vy || 0) * back;
            window.ctx.save();
            window.ctx.translate(bx, by);
            window.ctx.rotate((b.rot || 0) - 0.35 * back);
            if (b.isUlt) {
                window.ctx.save();
                window.ctx.globalAlpha = 0.32;
                window.ctx.fillStyle = b.color || "#f1c40f";
                window.ctx.beginPath();
                window.ctx.arc(0, 0, b.r * 1.45, 0, Math.PI * 2);
                window.ctx.fill();
                window.ctx.restore();
            }
            window.ctx.beginPath();
            window.ctx.arc(0, 0, b.r, 0, Math.PI * 2);
            window.ctx.fillStyle = "#ffffff";
            window.ctx.fill();
            window.ctx.lineWidth = 2;
            window.ctx.strokeStyle = "#111111";
            window.ctx.stroke();

            window.ctx.fillStyle = "#111111";
            window.ctx.beginPath();
            window.ctx.arc(0, 0, b.r * 0.4, 0, Math.PI * 2);
            window.ctx.fill();
            for (let j = 0; j < 5; j++) {
                let angle = (j * 2 * Math.PI) / 5;
                window.ctx.beginPath();
                window.ctx.moveTo(0, 0);
                window.ctx.lineTo(Math.cos(angle) * b.r, Math.sin(angle) * b.r);
                window.ctx.stroke();
                window.ctx.beginPath();
                window.ctx.arc(Math.cos(angle) * (b.r * 0.85), Math.sin(angle) * (b.r * 0.85), b.r * 0.25, 0, Math.PI * 2);
                window.ctx.fill();
            }
            window.ctx.restore();
        });

        // VẼ TẢNG ĐÁ KHỔNG LỒ (THE ROCK) - SUB-FRAME SMOOTH
        (window.theRockBoulders || []).forEach(r => {
            let rx = r.x - (r.vx || 0) * back;
            let ry = r.y - (r.vy || 0) * back;
            window.ctx.save();
            window.ctx.translate(rx, ry);
            window.ctx.rotate(r.rot || 0);
            if (r.type === 'falling') {
                window.ctx.save();
                window.ctx.globalAlpha = 0.28;
                window.ctx.fillStyle = "#e67e22";
                window.ctx.beginPath();
                window.ctx.arc(0, 0, r.size * 1.25, 0, Math.PI * 2);
                window.ctx.fill();
                window.ctx.restore();
            }
            window.ctx.fillStyle = "#576574";
            window.ctx.strokeStyle = "#222f3e";
            window.ctx.lineWidth = 3;
            window.ctx.beginPath();
            for (let j = 0; j < 8; j++) {
                let angle = (j * 2 * Math.PI) / 8;
                let radius = r.size * (j % 2 === 0 ? 1.0 : 0.85);
                if (j === 0) window.ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                else window.ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            window.ctx.closePath();
            window.ctx.fill();
            window.ctx.stroke();

            window.ctx.strokeStyle = r.type === 'falling' ? "#e67e22" : "#222f3e";
            window.ctx.lineWidth = 2;
            window.ctx.beginPath();
            window.ctx.moveTo(-r.size * 0.5, -r.size * 0.2);
            window.ctx.lineTo(0, r.size * 0.1);
            window.ctx.lineTo(r.size * 0.4, -r.size * 0.4);
            window.ctx.moveTo(0, r.size * 0.1);
            window.ctx.lineTo(-r.size * 0.2, r.size * 0.6);
            window.ctx.stroke();
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
            let currentWidth = l.width * (0.88 + Math.sin((l.maxLife - l.life) * 0.9) * 0.14); 
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

        // 8. VẼ BÓNG MA LINH HỒN BAY LÊN TRỜI KHI BỊ KO (KO GHOSTS)
        if (typeof window.drawKoGhosts === 'function') window.drawKoGhosts(window.ctx);

        // 9. VẼ CHỮ SÁT THƯƠNG / FLOATING TEXTS
        window.drawFloatingTexts(window.ctx);

        window.ctx.restore(); // KẾT THÚC CAMERA TRANSFORM

        // HIỆU ỨNG VIỀN XUNG LỰC MƯỢT (ENCODER-FRIENDLY EDGE GLOW - KHÔNG CHỚP TOÀN MÀN HÌNH GÂY NGHẼN H.264)
        if ((window.impactAberration > 0 || window.invertFrames > 0) && !window.gameOver) {
            let cw = window.canvas.width, ch = window.canvas.height;
            if (!window._impactEdgeCanvas || window._impactEdgeCanvas.width !== cw || window._impactEdgeCanvas.height !== ch) {
                if (typeof document !== 'undefined') {
                    let eCv = document.createElement('canvas');
                    eCv.width = cw; eCv.height = ch;
                    let eCtx = eCv.getContext('2d');
                    let rOuter = Math.hypot(cw * 0.5, ch * 0.5);
                    let rg = eCtx.createRadialGradient(cw * 0.5, ch * 0.5, rOuter * 0.62, cw * 0.5, ch * 0.5, rOuter);
                    rg.addColorStop(0, "rgba(0, 243, 255, 0)");
                    rg.addColorStop(0.7, "rgba(0, 243, 255, 0.22)");
                    rg.addColorStop(1, "rgba(255, 0, 90, 0.55)");
                    eCtx.fillStyle = rg;
                    eCtx.fillRect(0, 0, cw, ch);
                    window._impactEdgeCanvas = eCv;
                }
            }
            if (window._impactEdgeCanvas) {
                let strength = Math.max(window.impactAberration || 0, window.invertFrames || 0);
                window.ctx.save();
                window.ctx.globalAlpha = Math.min(0.55, strength * 0.075);
                window.ctx.drawImage(window._impactEdgeCanvas, 0, 0);
                window.ctx.restore();
            }
        }
        if (window.screenFlash > 0) {
            window.ctx.save();
            window.ctx.globalAlpha = Math.min(0.32, window.screenFlash);
            window.ctx.fillStyle = window.screenFlashColor || "#ffffff";
            window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
            window.ctx.restore();
        }

        // 9. BẢNG XẾP HẠNG HYPER COMBO (D -> SSS -> GODLIKE) + THANH THỜI GIAN DUY TRÌ COMBO (SPRITE-CACHED)
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
                    window.ctx.globalAlpha = 0.20 * alpha;
                    window.ctx.lineWidth = 2;
                    let cx = window.canvas.width / 2;
                    let cy = window.canvas.height / 2;
                    let spinBase = (window.matchTimer || 0) * 0.14;
                    for (let sl = 0; sl < 8; sl++) {
                        let ang = (Math.PI * 2 / 8) * sl + spinBase;
                        window.ctx.beginPath();
                        window.ctx.moveTo(cx + Math.cos(ang) * 290, cy + Math.sin(ang) * 165);
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

                let rankFont = `italic 900 ${rankSize}px 'Arial Black', Impact`;
                let subText = `🔥 ${hits} HITS • ${rankTitle}`;
                let subFont = "italic 900 15px Arial";
                let rSp = (typeof window.getTextSpriteCached === 'function')
                    ? window.getTextSpriteCached(rank, rankFont, rankColor, "#000000", 4)
                    : null;
                let sSp = (typeof window.getTextSpriteCached === 'function')
                    ? window.getTextSpriteCached(subText, subFont, "#ffffff", "#000000", 4)
                    : null;

                if (rSp && sSp) {
                    let rDrawX = (align === "left") ? 0 : -rSp.w;
                    let sDrawX = (align === "left") ? 0 : -sSp.w;
                    window.ctx.drawImage(rSp.cv, rDrawX, -rSp.h * 0.62, rSp.w, rSp.h);
                    window.ctx.drawImage(sSp.cv, sDrawX, 20 - sSp.h * 0.55, sSp.w, sSp.h);
                } else {
                    window.ctx.textAlign = align;
                    window.ctx.fillStyle = rankColor; 
                    window.ctx.font = rankFont; 
                    window.ctx.lineWidth = 4;
                    window.ctx.strokeStyle = "#000";
                    window.ctx.strokeText(rank, 0, 0);
                    window.ctx.fillText(rank, 0, 0);
                    window.ctx.font = subFont; 
                    window.ctx.fillStyle = "#fff"; 
                    window.ctx.strokeText(subText, 0, 20);
                    window.ctx.fillText(subText, 0, 20);
                }

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

        // 9.5. HỘP THOẠI STORY MODE TRỰC TIẾP TRÊN ĐẦU NHÂN VẬT (ZERO-LAG CACHED WRAP)
        if (typeof window.drawStorySpeechBubble === 'function') {
            window.drawStorySpeechBubble(window.ctx);
        }

        // ==========================================
        // 10. MÀN HÌNH INTRO THEO VOICE NHÂN VẬT & CHỮ "🥊 FIGHT! 🥊" ĐẦU TRẬN
        // ==========================================
        if (window.introTimer > 0 && !window.gameOver && window.p1) {
            window.ctx.save(); 
            window.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            if (window.introTimer > 55) {
                let cx = window.canvas.width / 2; 
                let cy = window.canvas.height / 2; 
                let p1Name = (window.p1.className || "PLAYER 1").toUpperCase(); 
                let repEnemy = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; 
                let p2Name = repEnemy ? (repEnemy.className || "ENEMY").toUpperCase() : "ENEMY";
                let p1IntroDance = (window.DanceEngine && window.DanceEngine.currentP1Dance) ? window.DanceEngine.currentP1Dance : (window.p1.introState || 'idle');
                let p2IntroDance = (repEnemy && window.DanceEngine && window.DanceEngine.currentP2Dance) ? window.DanceEngine.currentP2Dance : ((repEnemy && repEnemy.introState) || 'idle');

                let elapsedIntro = (window.introStartTime > 0) ? Math.max(0, Date.now() - window.introStartTime) : 0;
                let totalDur = window.introDuration || 3200;
                let p1End = window.introP1EndMs || (totalDur * 0.32);
                let p2End = window.introP2EndMs || (totalDur * 0.64);
                let introAct = (elapsedIntro < p1End) ? 0 : ((elapsedIntro < p2End) ? 1 : 2);

                if (introAct === 0) {
                    // Màn 1: Nhân vật 1 nhảy riêng ở trung tâm theo hết đoạn Voice của Nhân vật 1
                    window.ctx.fillStyle = "#001b36";
                    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
                    window.ctx.fillStyle = "rgba(0, 243, 255, 0.10)";
                    window.ctx.beginPath();
                    window.ctx.arc(cx, cy + 15, 118, 0, Math.PI * 2);
                    window.ctx.fill();

                    window.ctx.font = "900 32px Arial";
                    window.ctx.textAlign = "center";
                    window.ctx.textBaseline = "middle";
                    window.ctx.fillStyle = "#00f3ff";
                    window.ctx.fillText(p1Name, cx, 64);

                    if (window.DanceEngine) {
                        window.DanceEngine.drawDancer(window.ctx, window.p1, cx, window.GROUND_Y + 45, true, (window.p1.scale || 1) * 1.48, p1IntroDance);
                    } else {
                        let p1Clone = Object.assign({}, window.p1, {x: cx, y: window.GROUND_Y + 45, state: p1IntroDance, isFacingRight: true, scale: (window.p1.scale || 1) * 1.48, hideHpBar: true});
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                    }
                } else if (introAct === 1 && repEnemy) {
                    // Màn 2: Nhân vật 2 nhảy riêng ở trung tâm theo hết đoạn Voice của Nhân vật 2
                    window.ctx.fillStyle = "#2b000b";
                    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
                    window.ctx.fillStyle = "rgba(255, 0, 60, 0.10)";
                    window.ctx.beginPath();
                    window.ctx.arc(cx, cy + 15, 118, 0, Math.PI * 2);
                    window.ctx.fill();

                    window.ctx.font = "900 32px Arial";
                    window.ctx.textAlign = "center";
                    window.ctx.textBaseline = "middle";
                    window.ctx.fillStyle = "#ff003c";
                    window.ctx.fillText(p2Name, cx, 64);

                    if (window.DanceEngine) {
                        window.DanceEngine.drawDancer(window.ctx, repEnemy, cx, window.GROUND_Y + 45, false, (repEnemy.scale || 1) * 1.48, p2IntroDance);
                    } else {
                        let p2Clone = Object.assign({}, repEnemy, {x: cx, y: window.GROUND_Y + 45, state: p2IntroDance, isFacingRight: false, scale: (repEnemy.scale || 1) * 1.48, hideHpBar: true});
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone);
                    }
                } else {
                    // Màn 3: Sau khi hết Voice của cả 2 -> 2 nhân vật tiến lại gần nhau đối mặt VS!
                    let progress = Math.min(1, Math.max(0, (elapsedIntro - p2End) / Math.max(1, totalDur - p2End)));
                    let easeOut = 1 - Math.pow(1 - progress, 3); 

                    window.ctx.fillStyle = "#001b36"; window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height); 
                    window.ctx.beginPath(); window.ctx.moveTo(cx + 120, 0); window.ctx.lineTo(window.canvas.width, 0); window.ctx.lineTo(window.canvas.width, window.canvas.height); window.ctx.lineTo(cx - 120, window.canvas.height); window.ctx.fillStyle = "#2b000b"; window.ctx.fill();
                    window.ctx.beginPath(); window.ctx.moveTo(cx + 120, 0); window.ctx.lineTo(cx - 120, window.canvas.height); window.ctx.lineWidth = 6; window.ctx.strokeStyle = "#f1c40f"; window.ctx.stroke();

                    let textX1 = -200 + (cx - 80 - (-200)) * easeOut; 
                    let textX2 = window.canvas.width + 200 - ((window.canvas.width + 200) - (cx + 80)) * easeOut;
                    
                    window.ctx.font = "900 32px Arial"; window.ctx.textAlign = "right"; window.ctx.textBaseline = "middle"; 
                    window.ctx.fillStyle = "#00f3ff"; window.ctx.fillText(p1Name, textX1, cy - 70); 
                    window.ctx.textAlign = "left"; window.ctx.fillStyle = "#ff003c"; window.ctx.fillText(p2Name, textX2, cy - 70); 
                    
                    let targetX1 = 180; let targetX2 = window.canvas.width - 180; 
                    let slideX1 = -100 + (targetX1 - (-100)) * easeOut; 
                    let slideX2 = window.canvas.width + 100 - (window.canvas.width + 100 - targetX2) * easeOut; 
                    
                    if (window.DanceEngine) {
                        window.DanceEngine.drawDancer(window.ctx, window.p1, slideX1, window.GROUND_Y + 40, true, (window.p1.scale || 1) * 1.35, p1IntroDance);
                    } else {
                        let p1Clone = Object.assign({}, window.p1, {x: slideX1, y: window.GROUND_Y + 40, state: p1IntroDance, isFacingRight: true, scale: (window.p1.scale || 1) * 1.35, hideHpBar: true}); 
                        if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p1Clone);
                    }
                    
                    if (repEnemy) { 
                        if (window.DanceEngine) {
                            window.DanceEngine.drawDancer(window.ctx, repEnemy, slideX2, window.GROUND_Y + 40, false, (repEnemy.scale || 1) * 1.35, p2IntroDance);
                        } else {
                            let p2Clone = Object.assign({}, repEnemy, {x: slideX2, y: window.GROUND_Y + 40, state: p2IntroDance, isFacingRight: false, scale: (repEnemy.scale || 1) * 1.35, hideHpBar: true}); 
                            if (typeof window.drawStickman === 'function') window.drawStickman(window.ctx, p2Clone); 
                        }
                    }
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
// 4.8. VẼ BONG BÓNG HỘI THOẠI STORY MODE TRÊN ĐẦU NHÂN VẬT (ZERO-LAG CACHED WRAP)
// ==========================================
window.drawStorySpeechBubble = function(ctx) {
    if (!ctx || !window.canvas || !window.StoryDialogueEngine) return;
    let line = window.StoryDialogueEngine.activeLine;
    if (!line || !line.speaker || window.introTimer > 0) return;

    let speaker = line.speaker;
    let cw = window.canvas.width;
    let ch = window.canvas.height;
    let cx = cw * 0.5;
    let cy = ch * 0.5;
    let actualZoom = Math.max(0.95, Math.min(1.25, window.currentZoom || 1));

    let worldX = (speaker.drawX !== undefined) ? speaker.drawX : speaker.x;
    let worldHeadY = ((speaker.drawY !== undefined) ? speaker.drawY : speaker.y) - 86 * (speaker.scale || 1);
    let screenHeadX = cx + (worldX + (window.camX || 0) - cx) * actualZoom;
    let screenHeadY = cy + (worldHeadY + (window.camY || 0) - cy) * actualZoom;

    let maxBubbleW = Math.min(350, Math.floor(cw * 0.58));
    let padX = 12;
    let padY = 9;
    let textFont = "700 13px 'Segoe UI', system-ui, Arial, sans-serif";

    // Pre-wrap một lần duy nhất cho mỗi câu thoại (không gọi measureText lặp lại mỗi khung hình!)
    if (!line._wrappedLines || line._wrapCanvasW !== cw) {
        ctx.save();
        ctx.font = textFont;
        let maxTextW = maxBubbleW - padX * 2 - 4;
        let words = String(line.text || "").split(" ");
        let wrapped = [];
        let cur = "";
        for (let i = 0; i < words.length; i++) {
            let test = cur ? (cur + " " + words[i]) : words[i];
            if (ctx.measureText(test).width > maxTextW && cur) {
                wrapped.push(cur);
                cur = words[i];
            } else {
                cur = test;
            }
        }
        if (cur) wrapped.push(cur);
        line._wrappedLines = wrapped.slice(0, 4);
        line._wrapCanvasW = cw;
        ctx.restore();
    }

    let lines = line._wrappedLines;
    if (!lines || lines.length === 0) return;

    let headerH = 22;
    let lineH = 17;
    let bubbleW = maxBubbleW;
    let bubbleH = padY * 2 + headerH + lines.length * lineH + 2;

    // Hiệu ứng bật nảy mượt lúc mới xuất hiện & mờ dần 10 nhịp cuối
    let tIn = Math.min(1, (line.ticksElapsed || 1) / 8);
    let popScale = tIn < 1 ? (0.82 + 0.18 * (1 - Math.pow(1 - tIn, 3))) : 1.0;
    let remain = (line.durationTicks || 120) - (line.ticksElapsed || 0);
    let fadeAlpha = remain < 10 ? Math.max(0, remain / 10) : 1.0;

    let bx = screenHeadX - bubbleW * 0.5;
    bx = Math.max(12, Math.min(cw - bubbleW - 12, bx));
    let by = screenHeadY - bubbleH - 16;
    by = Math.max(54, Math.min(ch - bubbleH - 28, by));

    let tailTipX = Math.max(bx + 22, Math.min(bx + bubbleW - 22, screenHeadX));
    let tailBaseY = by + bubbleH;
    let accent = line.color || (line.isPlayer ? "#00f3ff" : "#ff3366");

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = fadeAlpha;
    ctx.shadowBlur = 0;

    if (popScale !== 1.0) {
        let pivX = tailTipX;
        let pivY = tailBaseY + 10;
        ctx.translate(pivX, pivY);
        ctx.scale(popScale, popScale);
        ctx.translate(-pivX, -pivY);
    }

    // Khung bong bóng hội thoại chuẩn Comic + Đuôi trỏ thẳng đầu nhân vật đang nói
    let r = 11;
    ctx.fillStyle = "rgba(10, 14, 24, 0.93)";
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.4;

    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bubbleW - r, by);
    ctx.quadraticCurveTo(bx + bubbleW, by, bx + bubbleW, by + r);
    ctx.lineTo(bx + bubbleW, by + bubbleH - r);
    ctx.quadraticCurveTo(bx + bubbleW, by + bubbleH, bx + bubbleW - r, by + bubbleH);
    ctx.lineTo(tailTipX + 9, tailBaseY);
    ctx.lineTo(tailTipX, tailBaseY + 12);
    ctx.lineTo(tailTipX - 9, tailBaseY);
    ctx.lineTo(bx + r, by + bubbleH);
    ctx.quadraticCurveTo(bx, by + bubbleH, bx, by + bubbleH - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Thanh tiêu đề tên nhân vật + nhãn hồi truyện
    let avImg = (line.avatarUrl && typeof window.getSharedCachedImg === 'function')
        ? window.getSharedCachedImg(line.avatarUrl)
        : null;
    let textStartX = bx + padX;
    if (avImg && avImg.complete && avImg.naturalWidth > 0) {
        let drawAv = avImg._mip96 || avImg;
        ctx.drawImage(drawAv, bx + padX - 2, by + 6, 20, 20);
        textStartX += 24;
    }

    ctx.font = "900 11.5px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = accent;
    let spkUpper = String(line.speakerName || "FIGHTER").toUpperCase();
    ctx.fillText("🎙️ " + spkUpper, textStartX, by + 16);

    if (line.pauseCombat && !window.gameOver) {
        ctx.font = "800 10px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "#f1c40f";
        ctx.fillText(line.badge || "⏸ DỪNG ĐÁNH GÁY", bx + bubbleW - padX, by + 16);
    } else if (line.badge) {
        ctx.font = "800 10px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "#f1c40f";
        ctx.fillText(line.badge, bx + bubbleW - padX, by + 16);
    }

    // Đường kẻ mảnh ngăn cách header và lời thoại
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(bx + padX, by + 27, bubbleW - padX * 2, 1);

    // Hiệu ứng gõ chữ Typewriter siêu mượt ở 30% thời lượng đầu
    let fullCharCount = 0;
    for (let i = 0; i < lines.length; i++) fullCharCount += lines[i].length;
    let revealWindow = Math.max(18, Math.floor((line.durationTicks || 120) * 0.30));
    let visibleChars = ((line.ticksElapsed || 0) >= revealWindow)
        ? fullCharCount
        : Math.max(1, Math.floor(((line.ticksElapsed || 1) / revealWindow) * fullCharCount));

    ctx.font = textFont;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";

    let remChars = visibleChars;
    for (let i = 0; i < lines.length; i++) {
        if (remChars <= 0) break;
        let ln = lines[i];
        let sub = (remChars >= ln.length) ? ln : ln.substring(0, remChars);
        ctx.fillText(sub, bx + padX, by + 32 + i * lineH);
        remChars -= ln.length;
    }

    ctx.restore();
};

// ==========================================
// 5. TIME-ENGINE, SUB-FRAME INTERPOLATION & SYNC RECORDER LOOP (SIÊU MƯỢT 60Hz - 240Hz)
// ==========================================
window.lastFrameTime = 0; 
window.physicsAccumulator = 0;
window.PHYSICS_STEP = 1000 / 60; 
window._physicsTickCounter = 0;
window._renderInterpAlpha = 1.0;

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; 
    requestAnimationFrame(window.gameLoop); 
    
    if (!timestamp) timestamp = performance.now(); 
    if (!window.lastFrameTime) window.lastFrameTime = timestamp;
    let deltaTime = timestamp - window.lastFrameTime; 
    window.lastFrameTime = timestamp; 
    
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 50) deltaTime = 50; 
    // Khóa nhịp 1:1 hoàn hảo cho màn hình 60Hz (chống rung VSync 15.8ms - 17.4ms gây đúp/hụt tick)
    if (deltaTime > 14.5 && deltaTime < 19.0) {
        deltaTime = window.PHYSICS_STEP;
    }
    
    window.hitStopFrames = 0;
    window.timeScale = 1.0;
    window.physicsAccumulator += deltaTime;

    if (window._simZoom === undefined || window.introTimer > 210) {
        window._simZoom = window.currentZoom || 1;
        window._simCamX = window.camX || 0;
        window._simCamY = window.camY || 0;
        window._prevZoom = window._simZoom;
        window._prevCamX = window._simCamX;
        window._prevCamY = window._simCamY;
    }

    // Giới hạn tối đa 3 ticks mỗi frame để chống giật dồn toa (Spiral of Death)
    let maxPhysicsTicks = 3;
    while (window.physicsAccumulator >= window.PHYSICS_STEP && maxPhysicsTicks > 0) {
        if (window.p1) { window.p1._prevX = window.p1.x; window.p1._prevY = window.p1.y; }
        if (window.enemies) {
            for (let i = 0; i < window.enemies.length; i++) {
                let en = window.enemies[i];
                if (en) { en._prevX = en.x; en._prevY = en.y; }
            }
        }
        window._prevZoom = window._simZoom;
        window._prevCamX = window._simCamX;
        window._prevCamY = window._simCamY;

        try { if (typeof window.update === 'function') window.update(); } catch(e) { } 
        try { if (!window.isLoading && typeof window.updateWeatherPhysics === 'function') window.updateWeatherPhysics(); } catch(e) { }

        window._simZoom += ((window.targetZoom || 1) - window._simZoom) * 0.08;
        window._simCamX += ((window.targetCamX || 0) - window._simCamX) * 0.1;
        window._simCamY += ((window.targetCamY || 0) - window._simCamY) * 0.1;
        window._physicsTickCounter = (window._physicsTickCounter || 0) + 1;

        window.physicsAccumulator -= window.PHYSICS_STEP;
        maxPhysicsTicks--;
    }
    if (window.physicsAccumulator >= window.PHYSICS_STEP) {
        window.physicsAccumulator = window.physicsAccumulator % window.PHYSICS_STEP;
    }

    // Nội suy Sub-Frame mượt tuyệt đối cho cả màn hình 60Hz, 120Hz, 144Hz, 165Hz & 240Hz
    let alpha = Math.max(0, Math.min(1, window.physicsAccumulator / window.PHYSICS_STEP));
    window._renderInterpAlpha = alpha;
    window.currentZoom = window._prevZoom + (window._simZoom - window._prevZoom) * alpha;
    window.camX = window._prevCamX + (window._simCamX - window._prevCamX) * alpha;
    window.camY = window._prevCamY + (window._simCamY - window._prevCamY) * alpha;
    window.cameraTilt = 0;
    window.camOrbitAngle = 0;

    try { if (typeof window.draw === 'function') window.draw(); } catch(e) { } 

    // Đồng bộ ghép khung hình quay Video ngay sau khi vẽ xong trên cùng 1 vòng lặp (Zero rAF contention)
    if (window.isRecording && typeof window.captureFrames === 'function') {
        try { window.captureFrames(timestamp); } catch(e) { }
    }
};

if (typeof window !== 'undefined') {
    setTimeout(() => { if (typeof window.initGameEngine === 'function') window.initGameEngine(); }, 100);
}
