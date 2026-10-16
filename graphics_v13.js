// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA NHÂN VẬT & VÕ THUẬT 1V1 (V8.2 PRO EDITION)
// NÂNG CẤP ĐỈNH CAO:
// 1. Vẽ Full 100% đầu PNG nguyên bản trong drawAvatarHead (Không cắt vòng tròn, không che mặt/tóc, bỏ ctx.filter gây lag).
// 2. Mở khóa 15+ thế võ chuyên nghiệp (Uppercut, Axe Kick, Low Sweep, Flying Knee, Wall Splat...) cho cả nhân vật có drawMethod riêng.
// 3. Tự động tạo vệt sáng đòn đánh (attackTrail) cho MỌI nhân vật kể cả khi dùng drawMethod tùy chỉnh.
// 4. Hỗ trợ tự động cầm vũ khí trên tay (weaponIcon) cho các nhân vật tạo nhanh.
// ==========================================

const lerp = (a, b, t) => a + (b - a) * t;

// Đồng bộ chung 1 kho ảnh đệm giữa graphics.js và recorder.js
window.avatarImageCache = window.avatarImageCache || window.hudImages || {};
window.hudImages = window.avatarImageCache;

window.initSkeleton = function(p) {
    if (!p.currentSkeleton) {
        p.currentSkeleton = {
            head: {x: 0, y: -60}, neck: {x: 0, y: -45}, pelvis: {x: 0, y: -20},
            footL: {x: -15, y: 0}, kneeL: {x: -10, y: -10}, footR: {x: 15, y: 0}, kneeR: {x: 10, y: -10},
            handL: {x: -15, y: -35}, elbowL: {x: -10, y: -25}, handR: {x: 15, y: -40}, elbowR: {x: 5, y: -30}
        };
    }
};

window.blendSkeleton = function(p, targetPts, speed = 0.38) {
    window.initSkeleton(p);
    let skel = p.currentSkeleton;
    let isDance = window.DanceEngine && window.DanceEngine.isDanceState(p.state);
    let blendSpeed = (p.attackTimer > 0 || isDance) ? 0.68 : speed;

    for (let key in targetPts) {
        if (targetPts[key] && !isNaN(targetPts[key].x)) {
            skel[key].x = lerp(skel[key].x, targetPts[key].x, blendSpeed);
            skel[key].y = lerp(skel[key].y, targetPts[key].y, blendSpeed);
        }
    }
    return skel;
};

// ==========================================
// HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG VÕ THUẬT & ỦY QUYỀN VŨ ĐẠO SANG DANCES.JS
// ==========================================
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
    p.headTilt = undefined;
    p.scarfWind = undefined;

    let moveState = p.rawMoveState || p.state;

    // 1. Ủy quyền mọi điệu nhảy, Taunt & Meme sang dances.js
    if (window.DanceEngine && window.DanceEngine.isDanceState(moveState)) {
        let prevState = p.state;
        p.state = moveState;
        let dancePts = window.DanceEngine.getSkeletonPose(p, bounce);
        p.state = prevState;
        let finalDancePts = isTrail ? dancePts : window.blendSkeleton(p, dancePts, 0.62);
        p._lastRenderedPts = finalDancePts;
        return finalDancePts;
    }

    let head = {x: 0, y: -60 + bounce}; 
    let neck = {x: 0, y: -45 + bounce}; 
    let pelvis = {x: 0, y: -20 + bounce};
    
    let footL = {x: -15, y: 0}; 
    let kneeL = {x: -10, y: -10 + bounce}; 
    let footR = {x: 15, y: 0}; 
    let kneeR = {x: 10, y: -10 + bounce};
    
    let handL = {x: -15, y: -35 + bounce}; 
    let elbowL = {x: -10, y: -25 + bounce}; 
    let handR = {x: 15, y: -40 + bounce}; 
    let elbowR = {x: 5, y: -30 + bounce};
    
    let tFrame = Date.now() / 150;
    let fastF = Date.now() / 50;
    let progress = (p.attackTimer > 0 && p.maxT) ? 1 - (p.attackTimer / p.maxT) : ext;

    // 2. Tư thế khi đang nhảy trên không trung
    if (!p.onGround && moveState === 'idle' || (!p.onGround && moveState === 'walk')) { 
        footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; 
        footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; 
        handL = {x: -22, y: -45}; elbowL = {x: -14, y: -35}; 
        handR = {x: 22, y: -50}; elbowR = {x: 14, y: -40}; 
        head.y -= 5; 
    }
    // 3. Tư thế Trúng đòn, Dính tường (Wall Splat) & Choáng (Stunned)
    else if (moveState === 'wall_splat') {
        head = {x: -8, y: -56}; neck = {x: -5, y: -42}; pelvis = {x: -2, y: -18};
        p.headTilt = -0.35;
        handL = {x: -18, y: -62}; elbowL = {x: -12, y: -46};
        handR = {x: 14, y: -60}; elbowR = {x: 8, y: -45};
        footL = {x: -14, y: 0}; kneeL = {x: -8, y: -10};
        footR = {x: 12, y: -4}; kneeR = {x: 6, y: -12};
    }
    else if (moveState === 'stunned') {
        let sway = Math.sin(fastF * 0.6) * 8;
        head = {x: sway, y: -56}; neck = {x: sway * 0.6, y: -43}; pelvis = {x: -sway * 0.4, y: -18};
        p.headTilt = sway * 0.03;
        handL = {x: -18 + sway, y: -28}; elbowL = {x: -14 + sway * 0.5, y: -36};
        handR = {x: 18 + sway, y: -28}; elbowR = {x: 14 + sway * 0.5, y: -36};
    }
    else if (moveState === 'hurt') { 
        head.x = -18; neck.x = -13; pelvis.x = -5; p.headTilt = -0.28;
        handL = {x: -22, y: -52}; handR = {x: -8, y: -56}; 
        elbowL = {x: -18, y: -35}; elbowR = {x: 0, y: -38}; 
        footL.x = -15; footR.x = 22; 
    } 
    else if (moveState === 'block') { 
        head.x = -5; 
        handR = {x: 12, y: -55 + bounce}; elbowR = {x: 16, y: -35 + bounce}; 
        handL = {x: 2, y: -55 + bounce}; elbowL = {x: -8, y: -35 + bounce}; 
    } 
    // 4. Các Thế Đấm Võ Thuật Chi Tiết (Jab, Cross, Uppercut, One-Inch Punch, Dempsey Roll...)
    else if (moveState === 'uppercut' || moveState === 'dragon_uppercut') {
        let lift = ext * 16;
        pelvis = {x: 6 * ext, y: -20 - lift * 0.4};
        neck = {x: 10 * ext, y: -45 - lift * 0.5};
        head = {x: 12 * ext, y: -60 - lift * 0.5};
        p.headTilt = -0.15 * ext;
        handR = {x: 22 + 12 * ext, y: -35 - 48 * ext};
        elbowR = {x: 18 + 10 * ext, y: -28 - 22 * ext};
        handL = {x: -12, y: -38}; elbowL = {x: -16, y: -28};
        footR = {x: 18, y: -lift * 0.3}; kneeR = {x: 14, y: -12 - lift * 0.3};
    }
    else if (moveState === 'one_inch_punch' || moveState === 'palm_strike') {
        pelvis = {x: 10 * ext, y: -16};
        neck = {x: 16 * ext, y: -42};
        head = {x: 20 * ext, y: -56};
        p.headTilt = 0.15 * ext;
        handR = {x: 20 + 42 * ext, y: -42};
        elbowR = {x: 12 + 22 * ext, y: -38};
        handL = {x: -18, y: -32}; elbowL = {x: -22, y: -25};
        footL = {x: -22, y: 0}; footR = {x: 26, y: 0}; kneeR = {x: 22, y: -10};
    }
    else if (moveState === 'elbow_strike' || moveState === 'shoulder_bash') {
        pelvis = {x: 12 * ext, y: -18};
        neck = {x: 18 * ext, y: -43};
        head = {x: 22 * ext, y: -58};
        elbowR = {x: 18 + 38 * ext, y: -42};
        handR = {x: 8 + 20 * ext, y: -48};
        handL = {x: -14, y: -35}; elbowL = {x: -18, y: -28};
    }
    else if (moveState === 'dempsey_roll' || moveState === 'machine_gun_punches' || moveState === 'asura_strike') {
        let flurry = Math.sin(fastF * 2.2);
        pelvis = {x: 8, y: -18}; neck = {x: 14, y: -42}; head = {x: 18, y: -56 + flurry * 2};
        handR = {x: 28 + flurry * 24, y: -42 + flurry * 6};
        elbowR = {x: 14 + flurry * 10, y: -34};
        handL = {x: 28 - flurry * 24, y: -38 - flurry * 6};
        elbowL = {x: 14 - flurry * 10, y: -32};
        footL = {x: -18, y: 0}; footR = {x: 22, y: 0};
    }
    else if (p.state === 'punch' || ['jab', 'cross', 'hook', 'backfist', 'spinning_backfist', 'superman_punch'].includes(moveState)) { 
        head.x = (10 + pext / 2) * ext; 
        neck.x = (8 + pext / 2) * ext; 
        pelvis.x = (4 + pext / 2) * ext; 
        handR = {x: 15 + (40 + pext) * ext, y: -40 + bounce}; 
        elbowR = {x: 10 + (20 + pext / 2) * ext, y: -35 + bounce}; 
        handL = {x: -10, y: -40 + bounce}; 
    } 
    // 5. Các Thế Đá Cước Pháp Chi Tiết (Axe Kick, Low Sweep, Flying Knee, High Kick...)
    else if (moveState === 'axe_kick') {
        head = {x: -8 * ext, y: -58}; neck = {x: -5 * ext, y: -44}; pelvis = {x: 4 * ext, y: -20};
        let axeY = (progress < 0.45) ? (-68 * ext) : (-12 * ext);
        footR = {x: 18 + 38 * ext, y: axeY};
        kneeR = {x: 12 + 20 * ext, y: axeY * 0.6 - 10};
        footL = {x: -12, y: 0}; kneeL = {x: -10, y: -10};
        handL = {x: -20, y: -42}; handR = {x: 18, y: -48};
    }
    else if (moveState === 'low_kick') {
        pelvis = {x: 8 * ext, y: -12};
        neck = {x: -6 * ext, y: -34};
        head = {x: -10 * ext, y: -48};
        footR = {x: 18 + 46 * ext, y: -2};
        kneeR = {x: 12 + 22 * ext, y: -6};
        footL = {x: -18, y: 0}; kneeL = {x: -16, y: -8};
        handL = {x: -22, y: -24}; handR = {x: 12, y: -28};
    }
    else if (moveState === 'knee_strike' || moveState === 'flying_knee') {
        pelvis = {x: 8 * ext, y: -24};
        neck = {x: 4 * ext, y: -48};
        head = {x: 6 * ext, y: -62};
        kneeR = {x: 16 + 34 * ext, y: -34 - 10 * ext};
        footR = {x: 6 + 14 * ext, y: -14 - 8 * ext};
        footL = {x: -16, y: -4}; kneeL = {x: -12, y: -14};
        handL = {x: 14 * ext, y: -48}; handR = {x: 20 * ext, y: -52};
    }
    else if (p.state === 'kick' || ['teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick'].includes(moveState)) { 
        head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; 
        let kickHeight = (moveState === 'high_kick' || moveState === 'spinning_heel') ? 32 : 20;
        footR = {x: 15 + 45 * ext, y: -10 - kickHeight * ext + bounce}; 
        kneeR = {x: 10 + 20 * ext, y: -15 - (kickHeight * 0.5) * ext + bounce}; 
        footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; 
        handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; 
    } 
    // 6. Các Tư Thế Lướt & Chiêu Thức Đặc Biệt
    else if (moveState === 'dash') { 
        head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; 
        handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; 
        handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; 
        footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; 
        footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; 
    } 
    else if (moveState === 'dash_back') { 
        head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; 
        handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; 
        handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; 
        footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; 
        footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; 
    } 
    else if (moveState === 'cast') { 
        head.x = 0; head.y = -65 + bounce; 
        handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; 
        elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; 
        footL.x = -25; footR.x = 25; 
    }
    else if (moveState === 'hollow_purple') { 
        let floatY = Math.sin(tFrame) * 10; 
        pelvis.y = -35 + floatY; head.y = -75 + floatY; neck.y = -60 + floatY; 
        handR = {x: 15, y: -65 + floatY}; elbowR = {x: 5, y: -50 + floatY}; 
        handL = {x: 25, y: -50 + floatY}; elbowL = {x: 10, y: -40 + floatY}; 
        footL = {x: -10, y: -15 + floatY}; kneeL = {x: -15, y: -25 + floatY}; 
        footR = {x: 10, y: -10 + floatY}; kneeR = {x: 15, y: -20 + floatY}; 
    }
    else if (moveState === 'naruto_seal') { 
        head.y = -55; head.x = 5; pelvis.y = -15;
        handL = {x: 10, y: -45}; elbowL = {x: -5, y: -35}; 
        handR = {x: 15, y: -45}; elbowR = {x: 25, y: -35}; 
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; 
        kneeL = {x: -25, y: -15}; kneeR = {x: 25, y: -15}; 
    }
    else if (moveState === 'super_saiyan') { 
        let vibe = Math.random() * 4; 
        pelvis.y = -15 + vibe; head.y = -55 + vibe; 
        handL = {x: -25+vibe, y: -30+vibe}; elbowL = {x: -30, y: -40}; 
        handR = {x: 25+vibe, y: -30+vibe}; elbowR = {x: 30, y: -40}; 
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; 
        kneeL = {x: -25, y: -15}; kneeR = {x: 25, y: -15}; 
    }
    else if (moveState === 'kame_fire') { 
        pelvis.y = -15; head.x = 15; head.y = -45; neck.x = 5; 
        footL = {x: -25, y: 0}; footR = {x: 25, y: 0}; kneeR = {x: 20, y: -10}; 
        handL = {x: 40, y: -30}; handR = {x: 45, y: -35}; 
        elbowL = {x: 20, y: -25}; elbowR = {x: 25, y: -30}; 
    }
    else if (moveState === 'matrix_dodge') { 
        let lean = Math.min(1, progress * 2); 
        pelvis.x = 10; pelvis.y = -10; 
        neck.x = -15 * lean; neck.y = -30; 
        head.x = -30 * lean; head.y = -20 * lean; 
        footL = {x: -10, y: 0}; footR = {x: 30, y: 0}; kneeR = {x: 20, y: -15}; 
        handL = {x: -20, y: 0}; elbowL = {x: -25, y: -15}; 
        handR = {x: 10, y: -10}; elbowR = {x: 0, y: -20}; 
    }
    else if (moveState === 'shoryuken') { 
        pelvis.y = -40; head.x = 10; head.y = -80; neck.y = -65; 
        footL = {x: -10, y: -20}; kneeL = {x: -15, y: -30}; 
        footR = {x: 15, y: -30}; kneeR = {x: 20, y: -45}; 
        handR = {x: 15, y: -100}; elbowR = {x: 15, y: -70}; 
        handL = {x: -15, y: -40}; elbowL = {x: -20, y: -50}; 
    }
    else if (moveState === 'tatsumaki') { 
        pelvis.y = -30; head.y = -70; neck.y = -50; 
        let spin = Math.sin(fastF * 2.5); 
        footR = {x: 35 * spin, y: -40}; kneeR = {x: 20 * spin, y: -35}; 
        footL = {x: 0, y: -20}; kneeL = {x: -10, y: -25}; 
        handL = {x: -20 * spin, y: -50}; handR = {x: 20 * spin, y: -50}; 
    }
    else if (moveState === 'levitate') { 
        let floatY = Math.sin(tFrame) * 15; 
        pelvis.y = -40 + floatY; head.y = -80 + floatY; neck.y = -65 + floatY; 
        handL = {x: -25, y: -30 + floatY}; elbowL = {x: -15, y: -40 + floatY}; 
        handR = {x: 25, y: -30 + floatY}; elbowR = {x: 15, y: -40 + floatY}; 
        footL = {x: -10, y: -15 + floatY}; kneeL = {x: -15, y: -25 + floatY}; 
        footR = {x: 10, y: -15 + floatY}; kneeR = {x: 15, y: -25 + floatY}; 
    }

    let resultPts = { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    p._lastRenderedPts = resultPts;
    return resultPts;
};

// --- HÀM VẼ NHÂN VẬT DUY NHẤT TOÀN GAME ---
window.drawStickman = function(ctx, p, isTrail = false) {
    if (!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    
    if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    // Bóng đổ dưới đất (khi ở màn hình Preview/Intro không có bóng của engine_rend.js)
    if (!isTrail && p.onGround && !p.hasEngineShadow) {
        ctx.save();
        ctx.shadowBlur = 0; 
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath(); 
        ctx.ellipse(0, 0, 22, 4, 0, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }

    ctx.strokeStyle = "#fff"; 
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    
    if (isTrail) { 
        ctx.globalAlpha = p.alpha || 0.3; 
        ctx.shadowBlur = 0; 
    } else if (p.iFrames > 0) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#bdc3c7";
    }

    let isDancingNow = window.DanceEngine && window.DanceEngine.isDanceState(p.state);
    let bounce = (p.state === 'walk' || isDancingNow) ? Math.abs(Math.sin(Date.now() / 90)) * 5 : 0;
    
    let maxT = 15;
    if (p.state === 'jab') maxT = 10; 
    else if (p.state === 'cross' || p.state === 'hook') maxT = 14; 
    else if (p.state === 'low_kick' || p.state === 'teep_kick') maxT = 16; 
    else if (p.state === 'backfist' || p.state === 'spinning_backfist' || p.state === 'elbow_strike' || p.state === 'palm_strike') maxT = 18; 
    else if (p.state === 'shoulder_bash' || p.state === 'knee_strike' || p.state === 'flying_knee' || p.state === 'superman_punch') maxT = 20; 
    else if (p.state === 'high_kick' || p.state === 'spinning_heel') maxT = 22; 
    else if (p.state === 'uppercut' || p.state === 'tornado_kick') maxT = 24; 
    else if (p.state === 'axe_kick') maxT = 26; 
    else if (p.state === 'dragon_uppercut') maxT = 35; 
    else if (p.state === 'machine_gun_punches') maxT = 60; 
    else if (p.state === 'one_inch_punch') maxT = 38; 
    else if (p.state === 'asura_strike') maxT = 35; 
    else if (p.state === 'cast') maxT = 45; 
    else if (p.state === 'dash' || p.state === 'dash_back') maxT = 15; 
    else if (p.state === 'dempsey_roll') maxT = 30;
    
    p.maxT = maxT;
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); 
    let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; 
    
    if (progress > 0) { 
        if (progress < 0.3) {
            ext = Math.sin((progress / 0.3) * (Math.PI / 2)); 
        } else {
            ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); 
        }
    }
    
    let pext = (progress > 0.5) ? (1 - progress) * 2 : progress * 2;
    let customDrawSuccess = false;
    let originalMoveState = p.state;
    p.rawMoveState = originalMoveState;
    
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let passedExt = ext; 
        let passedPext = pext;
        
        if (originalMoveState === 'machine_gun_punches') { 
            p.state = 'punch'; 
            passedExt = Math.sin(((progress * 5) % 1) * Math.PI); 
            passedPext = passedExt; 
        } 
        else if (originalMoveState === 'asura_strike') { 
            p.state = 'punch'; 
            passedExt = progress < 0.2 ? 0 : (progress > 0.8 ? 0 : 1); 
            passedPext = passedExt; 
        } 
        else if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'one_inch_punch', 'dempsey_roll'].includes(originalMoveState)) { 
            p.state = 'punch'; 
        } 
        else if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(originalMoveState)) { 
            p.state = 'kick'; 
        }

        try { 
            p.drawMethod(ctx, p, bounce, passedExt, passedPext, isTrail); 
            customDrawSuccess = true; 
        } 
        catch (e) { 
            console.error("Lỗi vẽ nhân vật tùy chỉnh:", e); 
        } 
        finally { 
            p.state = originalMoveState; 
            p.rawMoveState = undefined;
        }
    }

    if (!customDrawSuccess) {
        let targetPts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let smoothedPts = isTrail ? targetPts : window.blendSkeleton(p, targetPts);
        p._lastRenderedPts = smoothedPts;
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = smoothedPts;

        const drawLimb = (start, mid, end) => { 
            let grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            grad.addColorStop(0, p.color || "#2c3e50"); 
            grad.addColorStop(1, isTrail ? "rgba(255,255,255,0.2)" : "#ecf0f1"); 
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 6.5;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.stroke();
            
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(mid.x, mid.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Hào quang khớp xương 2 lớp siêu mượt (Không dùng shadowBlur trong hàm con)
            if (!isTrail) {
                ctx.save();
                ctx.fillStyle = p.color || "#00f3ff";
                ctx.globalAlpha = 0.28;
                ctx.beginPath(); ctx.arc(mid.x, mid.y, 5.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(end.x, end.y, 7.0, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1.0;
                ctx.beginPath(); ctx.arc(mid.x, mid.y, 2.5, 0, Math.PI * 2); ctx.fill(); 
                ctx.beginPath(); ctx.arc(end.x, end.y, 3.5, 0, Math.PI * 2); ctx.fill(); 
                ctx.restore();
            }
        };

        if (!isTrail) {
            if (!p.scarfNodes) {
                p.scarfNodes = Array(6).fill().map(() => ({x: neck.x, y: neck.y, oldX: neck.x, oldY: neck.y}));
            }

            let wind = window.globalWind || 0.8;
            let gravity = 0.6;
            let nodeDist = 5.5; 

            p.scarfNodes[0].x = neck.x;
            p.scarfNodes[0].y = neck.y;

            ctx.beginPath();
            ctx.moveTo(neck.x, neck.y);

            for (let i = 1; i < p.scarfNodes.length; i++) {
                let node = p.scarfNodes[i];
                let prevNode = p.scarfNodes[i - 1];

                let vx = (node.x - node.oldX) * 0.85;
                let vy = (node.y - node.oldY) * 0.85;
                
                node.oldX = node.x;
                node.oldY = node.y;
                
                let charVx = (p.scarfWind !== undefined) ? p.scarfWind : (p.vx || 0); 
                node.x += vx - charVx * 0.3 + (Math.random() * wind * 2 - wind);
                node.y += vy - (p.vy || 0) * 0.3 + gravity;

                let dx = node.x - prevNode.x;
                let dy = node.y - prevNode.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.001) dist = 0.001; 
                let diff = (nodeDist - dist) / dist;
                
                node.x += dx * diff * 0.6;
                node.y += dy * diff * 0.6;

                let xc = (prevNode.x + node.x) / 2;
                let yc = (prevNode.y + node.y) / 2;
                ctx.quadraticCurveTo(prevNode.x, prevNode.y, xc, yc);
            }
            
            ctx.lineCap = "round";
            ctx.lineWidth = 3.2;
            ctx.strokeStyle = p.color || "#ff2a2a";
            ctx.stroke();
        }

        ctx.fillStyle = "#1a1a1a";
        ctx.strokeStyle = p.color || "#fff";
        ctx.lineWidth = 2; 
        ctx.beginPath();
        ctx.moveTo(neck.x - 4, neck.y); 
        ctx.lineTo(neck.x + 4, neck.y); 
        ctx.lineTo(pelvis.x + 3, pelvis.y); 
        ctx.lineTo(pelvis.x - 3, pelvis.y);
        ctx.closePath();
        ctx.fill(); 
        ctx.stroke(); 

        drawLimb(pelvis, kneeL, footL); 
        drawLimb(pelvis, kneeR, footR); 
        drawLimb(neck, elbowL, handL); 
        drawLimb(neck, elbowR, handR); 

        if (typeof window.drawAvatarHead === 'function') {
            window.drawAvatarHead(ctx, head, p, isTrail);
        }

        // Tự động vẽ vũ khí/vật phẩm cầm tay nếu nhân vật có khai báo weaponIcon
        let charDef = (p.classId && window.classStats) ? window.classStats[p.classId] : null;
        let wIcon = p.weaponIcon || (charDef && charDef.weaponIcon);
        if (wIcon && !isTrail) {
            ctx.save();
            ctx.translate(handR.x, handR.y);
            ctx.rotate(p.attackTimer > 0 ? 0.55 : 0.15);
            ctx.font = "22px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(wIcon, 6, -4);
            ctx.restore();
        }
    }

    // VỆT SÁNG ĐÒN ĐÁNH (ATTACK TRAIL) DÙNG CHUNG CHO CẢ NHÂN VẬT CÓ DRAWMETHOD RIÊNG (NHƯ BILL GATES)
    let activePts = p._lastRenderedPts || p.currentSkeleton;
    if (!isTrail && p.attackTimer > 0 && activePts && p.state !== 'block' && p.state !== 'cast') {
        if (!p.attackTrail) p.attackTrail = [];
        
        let isKickMove = originalMoveState.includes('kick') || originalMoveState.includes('knee') || originalMoveState.includes('heel') || originalMoveState === 'tatsumaki';
        let strikePoint = isKickMove ? (activePts.footR || {x: 20, y: -20}) : (activePts.handR || {x: 25, y: -40});

        p.attackTrail.unshift({x: strikePoint.x, y: strikePoint.y});
        if (p.attackTrail.length > 8) p.attackTrail.pop(); 

        if (p.attackTrail.length > 2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.attackTrail[0].x, p.attackTrail[0].y);
            for (let i = 1; i < p.attackTrail.length; i++) {
                ctx.lineTo(p.attackTrail[i].x, p.attackTrail[i].y);
            }
            
            ctx.lineWidth = 10; 
            let grad = ctx.createLinearGradient(
                p.attackTrail[0].x, p.attackTrail[0].y,
                p.attackTrail[p.attackTrail.length - 1].x, p.attackTrail[p.attackTrail.length - 1].y
            );
            grad.addColorStop(0, p.color || "#00f3ff"); 
            grad.addColorStop(1, "rgba(0,0,0,0)");      
            
            ctx.strokeStyle = grad;
            ctx.globalCompositeOperation = "lighter"; 
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.restore();
        }
    } else if (p.attackTrail && p.attackTrail.length > 0) {
        p.attackTrail = []; 
    }

    if (!isTrail && p.shield > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); 
        ctx.fillStyle = "rgba(52, 152, 219, 0.12)"; ctx.fill(); 
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.85)"; ctx.stroke(); 
    }
    
    if (!isTrail && p.superArmor > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); 
        ctx.lineWidth = 2.5; ctx.strokeStyle = "rgba(255, 71, 87, 0.85)"; ctx.stroke(); 
        ctx.fillStyle = "rgba(255, 71, 87, 0.15)"; ctx.fill(); 
    }
    
    if (!p.isPlayer && !isTrail && !p.hideHpBar) { 
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -105, 40, 5); 
        ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -105, 40 * (Math.max(0, p.hp) / (p.maxHp || 100)), 5); 
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -105, 40, 5); 
    }
    
    ctx.restore();
};

window.assignDrawMethods = function(statsObj) { };

// ==========================================
// HÀM VẼ ĐẦU AVATAR NGUYÊN BẢN (HIỂN THỊ 100% MẶT & TÓC PNG, KHÔNG CẮT VÒNG TRÒN)
// ==========================================
window.drawAvatarHead = function(ctx, head, p, isTrail, headSize = 34) {
    let avatarUrl = p.avatarUrl;
    if (!avatarUrl && p.classId && window.classStats && window.classStats[p.classId]) {
        avatarUrl = window.classStats[p.classId].avatarUrl;
    }
    if (!avatarUrl && window.currentLoadedChar) {
        avatarUrl = window.currentLoadedChar.avatarUrl;
    }

    const drawFallbackHead = () => {
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffddc1"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
    };

    if (avatarUrl) {
        if (!window.avatarImageCache[avatarUrl]) {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = avatarUrl;
            window.avatarImageCache[avatarUrl] = img;
        }

        let img = window.avatarImageCache[avatarUrl];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.translate(head.x, head.y - 4);

            let tilt = (p.headTilt !== undefined) ? p.headTilt : (p.vx || 0) * 0.05;
            ctx.rotate(tilt);

            // Vẽ trực tiếp ảnh PNG nguyên đầu, giữ nguyên 100% tóc, mắt kính, tai và cằm
            ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
            ctx.restore();
        } else {
            drawFallbackHead();
        }
    } else {
        drawFallbackHead();
    }
};
