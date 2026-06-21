// ==========================================
// FIGHTER.JS - HỆ THỐNG VẼ KHUNG XƯƠNG HOẠT ẢNH VÕ THUẬT & RỒNG
// ==========================================

window.drawDragon = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = p.color || "#e74c3c"; 
    ctx.shadowBlur = p.iFrames > 0 ? 25 : 15; 
    ctx.shadowColor = p.color || "#e74c3c"; 
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    // Tốc độ nhịp thở và nhịp đập cánh
    let t = Date.now() / 150; 
    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(t)) * 6 : Math.sin(t) * 4; 
    let wingFlap = Math.sin(t * 1.5) * 15; 

    // Các điểm neo khớp xương cơ bản của rồng
    let cx = 0, cy = -45 + bounce;
    let head = { x: cx + 45, y: cy - 35 }; 
    let jaw = { x: cx + 45, y: cy - 20 }; 
    let neck = { x: cx + 15, y: cy - 15 }; 
    let pelvis = { x: cx - 25, y: cy + 10 }; 
    let tailTip = { x: cx - 70 - Math.cos(t)*15, y: cy - 10 + Math.sin(t*1.5)*20 };
    
    let wingJoint = { x: cx - 5, y: cy - 20 }; 
    let wingTip1 = { x: cx - 20, y: cy - 70 + wingFlap }; 
    let wingTip2 = { x: cx + 20, y: cy - 55 + wingFlap*0.8 }; 
    let wingTip3 = { x: cx - 45, y: cy - 40 + wingFlap*1.2 };
    
    let legFrontKnee = { x: cx + 15, y: cy + 20 }; let legFrontFoot = { x: cx + 25, y: 0 }; 
    let legBackKnee = { x: cx - 15, y: cy + 25 }; let legBackFoot = { x: cx - 10, y: 0 };
    
    let armElbow1 = { x: cx + 30, y: cy + 5 }; let armClaw1 = { x: cx + 45, y: cy + 20 };
    let armElbow2 = { x: cx + 15, y: cy + 0 }; let armClaw2 = { x: cx + 30, y: cy + 15 };

    // ================== TRẠNG THÁI TẤN CÔNG CỦA RỒNG ==================
    if (p.state === 'scratch') {
        let progress = 1 - (p.attackTimer / 30);
        let strike = Math.sin(progress * Math.PI);
        cx += strike * 20; // Rướn người tới trước
        head.x += 10; jaw.x += 10; 
        wingFlap = -25; // Cánh giật lại phía sau
        
        // Cử động vung tay cào xé
        armElbow1.x += strike * 30; armElbow1.y -= strike * 20;
        armClaw1.x += strike * 50; armClaw1.y -= strike * 10;
        armElbow2.x -= strike * 10; armClaw2.x -= strike * 10;

        // Vẽ hiệu ứng cào (VFX vết xé màu vàng)
        if (progress > 0.2 && progress < 0.8 && !isTrail) {
            ctx.save(); ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 3; ctx.shadowColor = "#f1c40f";
            ctx.beginPath(); ctx.moveTo(armClaw1.x - 15, armClaw1.y - 15); ctx.lineTo(armClaw1.x + 25, armClaw1.y + 25); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(armClaw1.x - 5, armClaw1.y - 25); ctx.lineTo(armClaw1.x + 35, armClaw1.y + 15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(armClaw1.x - 25, armClaw1.y - 5); ctx.lineTo(armClaw1.x + 15, armClaw1.y + 35); ctx.stroke();
            ctx.restore();
        }
    } else if (p.state === 'breathe_fire') {
        // Thu đầu về sau
        head.x -= 15; head.y -= 10; 
        // Trễ hàm dưới xuống để mở to mồm khạc lửa
        jaw.x += 5; jaw.y += 20; 
        neck.x -= 10; wingFlap = 20; // Vươn rộng cánh oai vệ
        armElbow1.y -= 10; armClaw1.y -= 10; // Giơ móng vuốt lên đe dọa
        
        // Hiệu ứng hạt lửa tuôn trào từ mồm
        if (!isTrail) {
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            for(let i=0; i<8; i++) {
                let fx = jaw.x + 10 + Math.random() * 80;
                let fy = (head.y + jaw.y)/2 + (Math.random() - 0.5) * fx * 0.6;
                ctx.fillStyle = Math.random() > 0.4 ? "#e74c3c" : "#f1c40f";
                ctx.beginPath(); ctx.arc(fx, fy, Math.random() * 12 + 4, 0, Math.PI*2); ctx.fill();
            }
            ctx.restore();
        }
    } else if (p.state === 'stunned') {
        head.y += 20; jaw.y += 20; neck.y += 15; wingFlap = 20;
        if (!isTrail) { ctx.fillStyle = "#f1c40f"; ctx.font = "20px Arial"; ctx.fillText("💫", head.x, head.y - 20); }
    } else if (p.state === 'hurt') {
        head.x -= 15; jaw.x -= 15; neck.x -= 10; cx -= 10; wingFlap = -10;
    }

    // ================== HÀM VẼ TỔNG HỢP ==================
    const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
    
    // 1. Vẽ Đôi Cánh
    ctx.lineWidth = 3; ctx.beginPath(); 
    ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip1.x, wingTip1.y); 
    ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip2.x, wingTip2.y); 
    ctx.moveTo(wingJoint.x, wingJoint.y); ctx.lineTo(wingTip3.x, wingTip3.y); 
    ctx.moveTo(wingTip2.x, wingTip2.y); ctx.quadraticCurveTo(cx, cy - 50 + wingFlap, wingTip1.x, wingTip1.y); 
    ctx.quadraticCurveTo(cx - 25, cy - 40 + wingFlap, wingTip3.x, wingTip3.y); ctx.stroke();

    // 2. Vẽ Đuôi & Xương sống
    ctx.lineWidth = 5; 
    ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx - 30, cy + 20, tailTip.x, tailTip.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x - 8, tailTip.y - 12); ctx.moveTo(tailTip.x, tailTip.y); ctx.lineTo(tailTip.x + 8, tailTip.y - 8); ctx.stroke(); // Gai đuôi
    ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.quadraticCurveTo(cx, cy + 15, neck.x, neck.y); ctx.stroke();

    // 3. Vẽ Chân & Móng vuốt trước
    drawLimb(pelvis, legBackKnee, legBackFoot); 
    drawLimb({x: cx+5, y: cy+10}, legFrontKnee, legFrontFoot); 
    drawLimb(neck, armElbow2, armClaw2); 
    drawLimb(neck, armElbow1, armClaw1);

    // 4. Vẽ Sọ, Hàm và Sừng
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(head.x, head.y); ctx.stroke(); // Sọ
    ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(jaw.x, jaw.y); ctx.stroke();   // Hàm
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(head.x - 5, head.y - 5); ctx.lineTo(head.x - 15, head.y - 20); ctx.stroke(); // Sừng 1
    ctx.beginPath(); ctx.moveTo(head.x - 12, head.y); ctx.lineTo(head.x - 22, head.y - 12); ctx.stroke(); // Sừng 2

    // 5. Mắt Rồng sát thủ
    ctx.beginPath(); ctx.arc(head.x - 8, head.y + 2, 2.5, 0, Math.PI*2); 
    ctx.fillStyle = (p.state === 'scratch' || p.state === 'breathe_fire' || p.isRage) ? "#f1c40f" : "#fff"; 
    ctx.fill();

    // Bóng mờ & Thanh máu lơ lửng trên đầu Boss
    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.translate(p.x, window.GROUND_Y); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 0; ctx.beginPath(); ctx.ellipse(0, 0, 45, 7, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-35, -100, 70, 8); ctx.fillStyle = p.color || "#e74c3c"; ctx.fillRect(-35, -100, 70 * (Math.max(0, p.hp)/p.maxHp), 8); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-35, -100, 70, 8); }
    ctx.restore();
}

// ------------------------------------------------------------
// KHUNG XƯƠNG STICKMAN CƠ BẢN (KHÔNG ĐỔI)
window.drawStickman = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); ctx.translate(p.x, p.y); if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    ctx.strokeStyle = "#fff"; ctx.shadowBlur = p.iFrames > 0 ? 25 : 8; ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : (p.color || "#fff"); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isTrail) { ctx.globalAlpha = p.alpha || 0.3; ctx.shadowBlur = 0; }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    let maxT = 15;
    if (p.state === 'jab') maxT = 10; 
    else if (p.state === 'cross' || p.state === 'hook') maxT = 14; 
    else if (p.state === 'low_kick' || p.state === 'teep_kick') maxT = 16; 
    else if (p.state === 'backfist' || p.state === 'spinning_backfist' || p.state === 'elbow_strike' || p.state === 'palm_strike') maxT = 18; 
    else if (p.state === 'shoulder_bash' || p.state === 'knee_strike' || p.state === 'flying_knee' || p.state === 'superman_punch') maxT = 20; 
    else if (p.state === 'high_kick' || p.state === 'spinning_heel') maxT = 22; 
    else if (p.state === 'uppercut' || p.state === 'tornado_kick') maxT = 24; 
    else if (p.state === 'axe_kick') maxT = 26; 
    else if (p.state === 'dragon_uppercut') maxT = 28; 
    else if (p.state === 'machine_gun_punches') maxT = 30; 
    else if (p.state === 'one_inch_punch' || p.state === 'asura_strike') maxT = 38; 
    else if (p.state === 'cast') maxT = 25; 
    else if (p.state === 'dash' || p.state === 'dash_back') maxT = 15; 
    else if (p.state === 'dempsey_roll') maxT = 30;
    
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; if (progress > 0) { if (progress < 0.3) ext = Math.sin((progress / 0.3) * (Math.PI / 2)); else ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); }
    let pext = (progress > 0.5) ? (1 - progress)*2 : progress*2;

    let customDrawSuccess = false;
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let oldState = p.state;
        if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'machine_gun_punches', 'asura_strike', 'one_inch_punch', 'dempsey_roll'].includes(p.state)) p.state = 'punch';
        if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(p.state)) p.state = 'kick';
        try { ctx.beginPath(); p.drawMethod(ctx, p, bounce, ext, pext, isTrail); ctx.beginPath(); customDrawSuccess = true; } catch (e) {} finally { p.state = oldState; }
    }

    if (!customDrawSuccess) {
        let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
        let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
        let handL = {x: -5, y: -48 + bounce}; let elbowL = {x: -10, y: -30 + bounce}; let handR = {x: 12, y: -45 + bounce}; let elbowR = {x: 5, y: -30 + bounce};  

        if (p.state === 'jab' || p.state === 'punch') { head.x = 4 * ext; pelvis.x = 2 * ext; handR.x = 12 + 15 * ext; handR.y = -45 + bounce; elbowR.x = 5 + 8 * ext; elbowR.y = -35 + bounce; handL.x = -5; handL.y = -48; } 
        else if (p.state === 'cross') { head.x = 8 * ext; neck.x = 6 * ext; pelvis.x = 4 * ext; handL.x = -5 + 25 * ext; handL.y = -45 + bounce; elbowL.x = -10 + 15 * ext; elbowL.y = -35 + bounce; handR.x = 5; handR.y = -40; footL.x = -10 + 5 * ext; } 
        else if (p.state === 'low_kick') { head.x = -3 * ext; pelvis.x = 2 * ext; kneeR.x = 10 + 10 * ext; kneeR.y = -15 - 5 * ext; footR.x = 10 + 20 * ext; footR.y = 0 - 10 * ext; handR.y = -30; handL.y = -35; }
        else if (p.state === 'hook') { head.x = 4 * ext; pelvis.x = 3 * ext; handR.x = 15 + 12 * ext; handR.y = -40 - 5 * Math.sin(ext * Math.PI); elbowR.x = 15 + 5 * ext; elbowR.y = -35; neck.x = 5 * ext; } 
        else if (p.state === 'spinning_backfist') { head.x = -5 * ext; neck.x = -2 * ext; pelvis.x = 3 * ext; handR.x = 10 + 30 * ext; handR.y = -45; elbowR.x = 10 + 15 * ext; elbowR.y = -45; handL.x = -15; handL.y = -40; }
        else if (p.state === 'elbow_strike') { head.x = 10 * ext; pelvis.x = 8 * ext; elbowR.x = 5 + 20 * ext; elbowR.y = -40; handR.x = 12 + 5 * ext; handR.y = -35; footR.x = 15 + 5 * ext; }
        else if (p.state === 'backfist') { head.x = -5 * ext; pelvis.x = 5 * ext; handR.x = 10 + 20 * ext; handR.y = -40; elbowR.x = 10 + 10 * ext; elbowR.y = -40; handL.x = -10; handL.y = -40; }
        else if (p.state === 'teep_kick') { head.x = -10 * ext; pelvis.x = -5 * ext; footR.x = 10 + 25 * ext; footR.y = -25 - 5 * ext; kneeR.x = 5 + 10 * ext; kneeR.y = -20 - 5 * ext; handR.x = 10; handR.y = -40; handL.x = -20 * ext; handL.y = -35; }
        else if (p.state === 'high_kick') { head.x = -15 * ext; pelvis.x = -5 * ext; footR.x = 10 + 20 * ext; footR.y = -10 - 45 * ext; kneeR.x = 5 + 10 * ext; kneeR.y = -10 - 20 * ext; handR.y = -35; handL.y = -40; }
        else if (p.state === 'tornado_kick') { head.x = 15 * ext; pelvis.y = -30 - 15*ext; footR.x = 10 + 25 * ext; footR.y = -20 - 40 * ext; kneeR.x = 5 + 15 * ext; kneeR.y = -20 - 20 * ext; footL.y = -15; kneeL.y = -25; handR.y = -50; handL.y = -50; }
        else if (p.state === 'spinning_heel') { head.x = -18 * ext; neck.x = -12 * ext; pelvis.x = -6 * ext; footR.x = 15 + 30 * ext; footR.y = -15 - 30 * ext; kneeR.x = 10 + 15 * ext; kneeR.y = -15 - 15 * ext; footL.x = -10; kneeL.x = -10; kneeL.y = -5; handR.x = -8; handR.y = -40; handL.x = 8; handL.y = -35; }
        else if (p.state === 'shoulder_bash') { pelvis.y = -15; head.x = 15 * ext; head.y = -50; neck.x = 12 * ext; neck.y = -40; pelvis.x = 10 * ext; footR.x = 15 + 15 * ext; footL.x = -15; elbowR.x = 25 * ext; elbowR.y = -35; handR.x = 20 * ext; handR.y = -30; handL.x = -10; }
        else if (p.state === 'superman_punch') { pelvis.y = -35 - 10*Math.sin(progress*Math.PI); head.x = 20 * ext; neck.x = 15 * ext; pelvis.x = 10 * ext; handR.x = 15 + 30 * ext; handR.y = -40; elbowR.x = 10 + 15*ext; footL.x = -20 - 15*ext; footL.y = -15; kneeL.x = -15 - 10*ext; footR.x = 10; footR.y = -15; handL.x = -10; }
        else if (p.state === 'palm_strike') { head.x = 5 * ext; pelvis.x = 5 * ext; handL.x = -5 + 25 * ext; handL.y = -42 + bounce; elbowL.x = -10 + 15 * ext; handR.x = 5; handR.y = -40; footL.x = -10 + 5 * ext; }
        else if (p.state === 'uppercut') { head.x = 5 * ext; head.y = -60 - 15 * ext; neck.y = -45 - 15 * ext; pelvis.y = -20 - 5 * ext; handR.x = 12 + 10 * ext; handR.y = -45 + 10 * Math.sin(progress*Math.PI*0.5) - 30 * ext; elbowR.x = 5 + 5 * ext; elbowR.y = -30 + 10 * Math.sin(progress*Math.PI*0.5) - 15 * ext; footR.x = 15 + 5 * ext; } 
        else if (p.state === 'dragon_uppercut') { let spin = Math.sin(progress*Math.PI*2); pelvis.y = -20 - 40*ext; head.y = -60 - 40*ext; head.x = 5*spin; handR.x = 15*spin; handR.y = -45 - 50*ext; elbowR.y = -35 - 35*ext; footL.y = -15; footR.y = -25; handL.y = -55; }
        else if (p.state === 'knee_strike') { head.x = 8 * ext; neck.x = 4 * ext; pelvis.x = 5 * ext; footL.x = -15; footL.y = 0; kneeL.x = -10; kneeL.y = -5; kneeR.x = 10 + 20 * ext; kneeR.y = -10 - 25 * ext; footR.x = 5 + 10 * ext; footR.y = -5 - 10 * ext; handR.x = 20 - 5 * ext; handR.y = -50 + 25 * ext; elbowR.x = 15; elbowR.y = -40 + 10 * ext; handL.x = 10 - 5 * ext; handL.y = -50 + 25 * ext; elbowL.x = 5; elbowL.y = -40 + 10 * ext; }
        else if (p.state === 'flying_knee') { pelvis.y = -35 - 15*ext; head.x = 10 * ext; head.y = -70 - 15*ext; footL.y = -15; kneeR.x = 15 + 20 * ext; kneeR.y = -25 - 30 * ext; footR.x = 5 + 10 * ext; footR.y = -15 - 15 * ext; handR.x = 15; handL.x = 5; }
        else if (p.state === 'axe_kick') { let lift = (progress < 0.5) ? progress * 2 : 1 - (progress - 0.5) * 2; let smash = (progress > 0.5) ? (progress - 0.5) * 2 : 0; head.x = -10 + 15 * smash; pelvis.x = -5 + 10 * smash; footL.x = -10; footL.y = 0; kneeL.x = -10; kneeL.y = -5; footR.x = 10 + 15 * lift + 15 * smash; footR.y = 0 - 60 * lift + 60 * Math.pow(smash, 3); kneeR.x = 5 + 10 * lift + 10 * smash; kneeR.y = -10 - 30 * lift + 30 * smash; handR.y = -30; handL.y = -35; }
        else if (p.state === 'machine_gun_punches') { let punchAlt = Math.sin(progress * Math.PI * 15); head.x = 10; pelvis.x = 5; handR.x = 15 + (punchAlt > 0 ? 25 : 0); handL.x = -5 + (punchAlt < 0 ? 30 : 0); handR.y = -42; handL.y = -45; elbowR.x = 10 + (punchAlt > 0 ? 15 : 0); elbowL.x = -10 + (punchAlt < 0 ? 15 : 0); footR.x = 20; footL.x = -20; }
        else if (p.state === 'one_inch_punch') { let charge = (progress < 0.3) ? progress / 0.3 : 1; let burst = (progress > 0.3) ? (progress - 0.3) / 0.7 : 0; pelvis.y = -20 + 10 * charge - 5 * burst; head.y = -60 + 10 * charge - 5 * burst; head.x = 20 * burst; neck.x = 10 * burst; pelvis.x = 10 * burst; footL.x = -20; footL.y = 0; kneeL.x = -15; kneeL.y = pelvis.y + 10; footR.x = 15 + 10 * burst; footR.y = 0; kneeR.x = 10 + 10 * burst; kneeR.y = pelvis.y + 10; handR.x = 0 + 35 * Math.pow(burst, 3); handR.y = -35; elbowR.x = -10 + 20 * Math.pow(burst, 3); elbowR.y = -35; handL.x = -10; handL.y = -45; }
        else if (p.state === 'asura_strike') { head.x = 10; pelvis.x = 5; handR.x = 35; handR.y = -40; handL.x = 25; handL.y = -30; elbowR.x = 20; elbowL.x = 10; ctx.globalAlpha = 0.5; drawLimb(neck, {x: 10, y:-50}, {x: 30, y:-60}); drawLimb(neck, {x: 15, y:-20}, {x: 35, y:-20}); drawLimb(neck, {x: 0, y:-50}, {x: 20, y:-55}); drawLimb(neck, {x: 0, y:-20}, {x: 25, y:-15}); ctx.globalAlpha = 1.0; }
        else if (p.state === 'dempsey_roll') { let weaveX = Math.sin(progress * Math.PI * 4); let weaveY = Math.abs(Math.cos(progress * Math.PI * 4)); head.x = 15 * weaveX; head.y = -60 + 10 * weaveY; neck.x = 10 * weaveX; neck.y = -45 + 10 * weaveY; pelvis.x = 5 * weaveX; pelvis.y = -20 + 5 * weaveY; if (weaveX > 0) { handR.x = 25; handR.y = -40; handL.x = -5; handL.y = -48; } else { handL.x = 25; handL.y = -40; handR.x = 12; handR.y = -45; } }
        else if (!p.onGround && p.state !== 'hurt' && p.state !== 'walk' && p.state !== 'stunned') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -5, y: -50}; elbowL = {x: -10, y: -40}; handR = {x: 12, y: -55}; elbowR = {x: 5, y: -45}; head.y -= 5; }
        else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -20, y: -40}; handR = {x: -5, y: -45}; elbowL = {x: -15, y: -30}; elbowR = {x: 0, y: -35}; footL.x = -15; footR.x = 25; } 
        else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 25, y: -30}; elbowR = {x: 15, y: -30}; handL = {x: 5, y: -30}; elbowL = {x: -5, y: -30}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -20, y: -5}; kneeL = {x: -10, y: -10}; }
        else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -40}; elbowR = {x: 5, y: -30}; handL = {x: 0, y: -40}; elbowL = {x: -10, y: -30}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; }
        else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -70}; handR = {x: 25, y: -70}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
        else if (p.state === 'stunned') { head.x = Math.sin(Date.now() / 50) * 5; head.y += 15; neck.y += 10; handL = {x: -10, y: -15}; elbowL = {x: -15, y: -20}; handR = {x: 10, y: -15}; elbowR = {x: 15, y: -20}; ctx.fillStyle = "#f1c40f"; ctx.font = "16px Arial"; ctx.fillText("💫", head.x, head.y - 15); }

        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 

        ctx.shadowBlur = 0; ctx.fillStyle = p.color || "#fff"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    }

    if (!isTrail && p.onGround && p.y >= window.GROUND_Y) { ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
    if (!isTrail && p.shield > 0) { ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); }
    if (p.superArmor > 0) { ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); }
    if (!p.isPlayer && !isTrail) { ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -95, 40, 6); ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -95, 40 * (Math.max(0, p.hp)/p.maxHp), 6); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -95, 40, 6); }
    ctx.restore();
}
