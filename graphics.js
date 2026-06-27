// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA TRUNG TÂM HOÀN CHỈNH 2.0
// KHUNG XƯƠNG HOẠT ẢNH, NỘI SUY MMA & ĐỒ HỌA ĐỘC QUYỀN BOSS
// ==========================================

// 1. HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG TOÀN CỤC
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
    let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
    let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
    let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
    
    let t = Date.now() / 150; 

    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
    else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
    else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
    else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
    else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } 
    else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } 
    else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } 
    else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
    
    else if (p.state === 'taunt_crane') { head.y += Math.sin(t)*2; footR = {x: -5, y: -25}; kneeR = {x: 15, y: -20}; footL = {x: 0, y: 0}; kneeL = {x: -10, y: -10}; handL = {x: -30, y: -60 + Math.sin(t)*5}; elbowL = {x: -15, y: -50}; handR = {x: 30, y: -60 - Math.sin(t)*5}; elbowR = {x: 15, y: -50}; }
    else if (p.state === 'taunt_power') { let shake = Math.random()*2 - 1; head.x += shake; head.y = -50 + shake; pelvis.y = -10; footL = {x: -20, y: 0}; kneeL = {x: -25, y: -10}; footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10}; handL = {x: -15, y: -40}; elbowL = {x: -25, y: -30}; handR = {x: 15, y: -40}; elbowR = {x: 25, y: -30}; if(Math.random()<0.2 && window.particles){ window.particles.push({x: p.x+(Math.random()-0.5)*30, y: window.GROUND_Y, vx: 0, vy: -Math.random()*4, life: 15, maxLife: 15, color: p.color||"#f1c40f", size: 2}); } }
    else if (p.state === 'taunt_dance') { let swing = Math.sin(t * 2) * 20; let hip = Math.cos(t * 2) * 10; pelvis.x = hip; head.x = -hip/2; handL = {x: -15 + swing, y: -30}; elbowL = {x: -20 + swing, y: -40}; handR = {x: 15 + swing, y: -30}; elbowR = {x: 20 + swing, y: -40}; }
    else if (p.state === 'taunt_point') { head.x = 5; handR = {x: 35, y: -40 + Math.sin(t)*2}; elbowR = {x: 20, y: -40}; handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; }
    else if (p.state === 'taunt_flex') { head.y = -55 + Math.sin(t)*2; pelvis.y = -20; handL = {x: -20, y: -55}; elbowL = {x: -30, y: -45}; handR = {x: 20, y: -55}; elbowR = {x: 30, y: -45}; }

    return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
};

// 2. HÀM CHỦ LỰC VẼ STICKMAN (GỌI TỪ ENGINE_V2.JS)
window.drawStickman = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = "#fff"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : (p.color || "#fff"); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    
    // Đồng bộ frame toán học đòn đánh với engine
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
    
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; if (progress > 0) { if (progress < 0.3) ext = Math.sin((progress / 0.3) * (Math.PI / 2)); else ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); }
    let pext = (progress > 0.5) ? (1 - progress)*2 : progress*2;

    let customDrawSuccess = false;
    
    // Nếu nhân vật từ tệp char_*.js đã nạp xong phương thức vẽ riêng, chuyển nhượng quyền vẽ
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let oldState = p.state;
        let passedExt = ext;
        let passedPext = pext;

        if (p.state === 'machine_gun_punches') {
            p.state = 'punch';
            let multiProgress = (progress * 5) % 1; 
            passedExt = Math.sin(multiProgress * Math.PI);
            passedPext = passedExt;
        } else if (p.state === 'asura_strike') {
            p.state = 'punch';
            passedExt = progress < 0.2 ? 0 : (progress > 0.8 ? 0 : 1);
            passedPext = passedExt;
        } else if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'one_inch_punch', 'dempsey_roll'].includes(p.state)) {
            p.state = 'punch';
        } else if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(p.state)) {
            p.state = 'kick';
        }

        try { 
            p.drawMethod(ctx, p, bounce, passedExt, passedPext, isTrail); 
            customDrawSuccess = true; 
        } catch (e) {
            console.error("Lỗi vẽ nhân vật tùy chỉnh, chuyển sang vẽ dự phòng:", e);
        } finally { 
            p.state = oldState; 
        }
    }

    // NẾU CHƯA LOAD ĐƯỢC FILE NHÂN VẬT TÙY CHỈNH -> VẼ KHUNG MẶC ĐỊNH CHỐNG TÀNG HÌNH
    if (!customDrawSuccess) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;

        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

        ctx.shadowBlur = 0; ctx.fillStyle = p.color || "#fff"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    }

    // Vẽ Aura bảo vệ
    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); }
    if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -95, 40, 6); ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -95, 40 * (Math.max(0, p.hp)/p.maxHp), 6); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -95, 40, 6); }
    ctx.restore();
};

// ==========================================
// ĐỒ HỌA ĐỘC QUYỀN CỦA BỐN ĐẠI ÁC BOSS TẦNG CAO
// ==========================================

window.drawDragon = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);
    ctx.strokeStyle = p.color || "#e74c3c"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 15; ctx.shadowColor = p.color || "#e74c3c"; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }
    let t = Date.now() / 150; let bounce = (p.state === 'walk') ? Math.abs(Math.sin(t)) * 6 : Math.sin(t) * 4; let wingFlap = Math.sin(t * 1.5) * 15; 
    let cx = 0, cy = -45 + bounce; let head = { x: cx + 45, y: cy - 35 }; let jaw = { x: cx + 45, y: cy - 20 }; let neck = { x: cx + 15, y: cy - 15 }; let pelvis = { x: cx - 25, y: cy + 10 }; let tailTip = { x: cx - 70 - Math.cos(t)*15, y: cy - 10 + Math.sin(t*1.5)*20 };
    let wingJoint = { x: cx - 5, y: cy - 20 }; let wingTip1 = { x: cx - 20, y: cy - 70 + wingFlap }; let wingTip2 = { x: cx + 20, y: cy - 55 + wingFlap*0.8 }; let wingTip3 = { x: cx - 45, y: cy - 40 + wingFlap*1.2 };
    let legFrontKnee = { x: cx + 15, y: cy + 20 }; let legFrontFoot = { x: cx + 25, y: 0 }; let legBackKnee = { x: cx - 15, y: cy + 25 }; let legBackFoot = { x: cx - 10, y: 0 };
    let armElbow1 = { x: cx + 30, y: cy + 5 }; let armClaw1 = { x: cx + 45, y: cy + 20 }; let armElbow2 = { x: cx + 15, y: cy + 0 }; let armClaw2 = { x: cx + 30, y: cy + 15 };
    if (p.state === 'scratch') { let progress = 1 - (p.attackTimer / 30); let strike = Math.sin(progress * Math.PI); cx += strike * 20; head.x += 10; jaw.x += 10; wingFlap = -25; armElbow1.x += strike * 30; armElbow1.y -= strike * 20; armClaw1.x += strike * 50; armClaw1.y -= strike * 10; armElbow2.x -= strike * 10; armClaw2.x -= strike * 10; if (progress > 0.2 && progress < 0.8 && !isTrail) { ctx.save(); ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3; ctx.shadowColor = "#f1c40f"; ctx.beginPath(); ctx.moveTo(armClaw1.x - 15, armClaw1.y - 15); ctx.lineTo(armClaw1.x + 25, armClaw1.y + 25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(armClaw1.x - 5, armClaw1.y - 25); ctx.lineTo(armClaw1.x + 35, armClaw1.y + 15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(armClaw1.x - 25, armClaw1.y - 5); ctx.lineTo(armClaw1.x + 15, armClaw1.y + 35); ctx.stroke(); ctx.restore(); } } 
    else if (p.state === 'breathe_fire') { head.x -= 15; head.y -= 10; jaw.x += 5; jaw.y += 20; neck.x -= 10; wingFlap = 20; armElbow1.y -= 10; armClaw1.y -= 10; if (!isTrail) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for(let i=0; i<8; i++) { let fx = jaw.x + 10 + Math.random() * 80; let fy = (head.y + jaw.y)/2 + (Math.random() - 0.5) * fx * 0.6; ctx.fillStyle = Math.random() > 0.4 ? "#e74c3c" : "#f1c40f"; ctx.beginPath(); ctx.arc(fx, fy, Math.random() * 12 + 4, 0, Math.PI*2); ctx.fill(); } ctx.restore(); } } 
    else if (p.state === 'stunned') { head.y += 20; jaw.y += 20; neck.y += 15; wingFlap = 20; if (!isTrail) { ctx.fillStyle = "#f1c40f"; ctx.font = "20px Arial"; ctx.fillText("💫", head.x, head.y - 20); } } 
    else if (p.state === 'hurt') { head.x -= 15; jaw.x -= 15; neck.x -= 10; cx -= 10; wingFlap = -10; }
    const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip1.x, wingTip1.y); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip2.x, wingTip2.y); ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip3.x, wingTip3.y); ctx.moveTo(wingTip2.x, wingTip2.y); ctx.quadraticCurveTo(cx, cy - 50 + wingFlap, wingTip1.x, wingTip1.y); ctx.quadraticCurveTo(cx - 25, cy - 40 + wingFlap, wingTip3.x, wingTip3.y); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx - 30, cy + 20, tailTip.x, tailTip.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x - 8, tailTip.y - 12); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x + 8, tailTip.y - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx, cy + 15, neck.x, neck.y); ctx.stroke();
    drawLimb(pelvis, legBackKnee, legBackFoot); drawLimb({x: cx+5, y: cy+10}, legFrontKnee, legFrontFoot); drawLimb(neck, armElbow2, armClaw2); drawLimb(neck, armElbow1, armClaw1);
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(head.x, head.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(jaw.x, jaw.y); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(head.x - 5, head.y - 5); ctx.lineTo(head.x - 15, head.y - 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(head.x - 12, head.y); ctx.lineTo(head.x - 22, head.y - 12); ctx.stroke(); ctx.beginPath(); ctx.arc(head.x - 8, head.y + 2, 2.5, 0, Math.PI*2); ctx.fillStyle = (p.state === 'scratch' || p.state === 'breathe_fire' || p.isRage) ? "#f1c40f" : "#fff"; ctx.fill();
    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.translate(p.x, window.GROUND_Y); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 0; ctx.beginPath(); ctx.ellipse(0, 0, 45, 7, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-35, -100, 70, 8); ctx.fillStyle = p.color || "#e74c3c"; ctx.fillRect(-35, -100, 70 * (Math.max(0, p.hp)/p.maxHp), 8); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-35, -100, 70, 8); }
    ctx.restore();
};

window.drawBruceLee = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, -62, 16, Math.PI, Math.PI * 2); ctx.lineTo(-5, -76); ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-3, -45); ctx.lineTo(-3, -15); ctx.stroke(); ctx.fillStyle = "#f1c40f"; ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.save(); ctx.translate(-12, -32); if (['machine_gun_punches', 'one_inch_punch'].includes(p.state)) { ctx.rotate(Math.sin(Date.now() * 0.05)); } ctx.fillRect(0, 0, 5, 22); ctx.strokeRect(0, 0, 5, 22); ctx.restore(); ctx.restore();
};

window.drawSamurai = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.fillStyle = "#d2b48c"; ctx.strokeStyle = "#5c4033"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-28, -58); ctx.lineTo(0, -75); ctx.lineTo(28, -58); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5c4033"; ctx.beginPath(); ctx.arc(0, -74, 4, 0, Math.PI, true); ctx.fill(); ctx.fillStyle = "rgba(192, 57, 43, 0.85)"; ctx.beginPath(); ctx.moveTo(0, -45); let waveX = -42 + Math.sin(Date.now() * 0.01) * 8; let waveY = -22 + Math.cos(Date.now() * 0.01) * 5; ctx.lineTo(waveX, waveY); ctx.lineTo(-10, -12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#eaf2f8"; ctx.lineWidth = 3; ctx.save(); ctx.translate(0, -25); ctx.rotate(p.state === 'dash' ? -Math.PI / 4 : Math.PI / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(35, -8); ctx.stroke(); ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, 2); ctx.stroke(); ctx.restore(); ctx.restore();
};

window.drawNinja = function(ctx, p, isTrail = false) {
    window.drawStickman(ctx, p, isTrail); if(!p || isNaN(p.x) || isNaN(p.y)) return; ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1); if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale); if (isTrail) ctx.globalAlpha = p.alpha || 0.3;
    ctx.strokeStyle = "#9b59b6"; ctx.lineWidth = 3; ctx.shadowBlur = 10; ctx.shadowColor = "#9b59b6"; ctx.beginPath(); ctx.moveTo(-6, -62); ctx.lineTo(12, -62); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = "#8e44ad"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-6, -55); let sX1 = -25; let sY1 = -45 + Math.sin(Date.now() * 0.015) * 8; let sX2 = -45; let sY2 = -50 + Math.cos(Date.now() * 0.015) * 12; ctx.quadraticCurveTo(sX1, sY1, sX2, sY2); ctx.stroke(); ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-5, -45); ctx.lineTo(15, -15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(5, -45); ctx.lineTo(-15, -15); ctx.stroke(); if (!isTrail && Math.random() < 0.25 && window.particles) { window.particles.push({ x: p.x + (Math.random() - 0.5) * 25 * (p.scale || 1), y: p.y - Math.random() * 60 * (p.scale || 1), vx: (Math.random() - 0.5) * 1.5, vy: -Math.random() * 2, life: 15, maxLife: 15, color: Math.random() > 0.5 ? "rgba(142, 68, 173, 0.4)" : "rgba(44, 62, 80, 0.4)", size: Math.random() * 3 + 2 }); } ctx.restore();
};

// Đăng ký rỗng giữ tính tương thích kiến trúc cũ
window.assignDrawMethods = function(statsObj) { };
