// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA TRUNG TÂM AAA LEVEL (ULTIMATE EDITION)
// BẢN NÂNG CẤP: PROCEDURAL ANIMATION, VERLET CLOTH PHYSICS, WEAPON TRAILS & CYBERPUNK NEON
// ==========================================

// --- [NÂNG CẤP 1] HỆ THỐNG LÀM MƯỢT HOẠT ẢNH (STATE BLENDING) ---
const lerp = (a, b, t) => a + (b - a) * t;

window.initSkeleton = function(p) {
    if (!p.currentSkeleton) {
        // Khởi tạo khung xương mặc định
        p.currentSkeleton = {
            head: {x: 0, y: -60}, neck: {x: 0, y: -45}, pelvis: {x: 0, y: -20},
            footL: {x: -15, y: 0}, kneeL: {x: -10, y: -10}, footR: {x: 15, y: 0}, kneeR: {x: 10, y: -10},
            handL: {x: -15, y: -35}, elbowL: {x: -10, y: -25}, handR: {x: 15, y: -40}, elbowR: {x: 5, y: -30}
        };
    }
};

window.blendSkeleton = function(p, targetPts, speed = 0.35) {
    window.initSkeleton(p);
    let skel = p.currentSkeleton;
    
    // Đang tấn công thì tốc độ chuyển khung xương nhanh hơn để đòn đánh có lực (Snap effect)
    let blendSpeed = p.attackTimer > 0 ? 0.7 : speed;

    for (let key in targetPts) {
        skel[key].x = lerp(skel[key].x, targetPts[key].x, blendSpeed);
        skel[key].y = lerp(skel[key].y, targetPts[key].y, blendSpeed);
    }
    return skel;
};

// --- HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG TOÀN CỤC (GIỮ NGUYÊN BỘ 35+ ANIMATIONS CỦA BẠN) ---
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
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
    
    let t = Date.now() / 150; 
    let tFrame = Date.now() / 150;
    let fastF = Date.now() / 50;
    let progress = (p.attackTimer > 0 && p.maxT) ? 1 - (p.attackTimer / p.maxT) : ext;

    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch' && p.state !== 'levitate' && p.state !== 'shoryuken' && p.state !== 'tatsumaki' && p.state !== 'hollow_purple') { 
        footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; 
        footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; 
        handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; 
        handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; 
        head.y -= 5; 
    }
    else if (p.state === 'hurt') { 
        head.x = -20; neck.x = -15; pelvis.x = -5; 
        handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; 
        elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; 
        footL.x = -15; footR.x = 25; 
    } 
    else if (p.state === 'block') { 
        head.x = -5; 
        handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; 
        handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; 
    } 
    else if (p.state === 'punch') { 
        head.x = (10+pext/2) * ext; 
        neck.x = (8+pext/2) * ext; 
        pelvis.x = (4+pext/2) * ext; 
        handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; 
        elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; 
        handL = {x: -10, y: -40 + bounce}; 
    } 
    else if (p.state === 'kick') { 
        head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; 
        footR = {x: 15 + 45 * ext, y: -10 - 20 * ext + bounce}; 
        kneeR = {x: 10 + 20 * ext, y: -15 - 10 * ext + bounce}; 
        footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; 
        handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; 
    } 
    else if (p.state === 'dash') { 
        head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; 
        handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; 
        handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; 
        footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; 
        footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; 
    } 
    else if (p.state === 'dash_back') { 
        head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; 
        handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; 
        handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; 
        footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; 
        footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; 
    } 
    else if (p.state === 'cast') { 
        head.x = 0; head.y = -65 + bounce; 
        handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; 
        elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; 
        footL.x = -25; footR.x = 25; 
    }
    
    // --- ĐIỆU TAUNT (CÀ KHỊA) ---
    else if (p.state === 'taunt_crane') { 
        head.y += Math.sin(t)*2; 
        footR = {x: -5, y: -25}; kneeR = {x: 15, y: -20}; 
        footL = {x: 0, y: 0}; kneeL = {x: -10, y: -10}; 
        handL = {x: -30, y: -60 + Math.sin(t)*5}; elbowL = {x: -15, y: -50}; 
        handR = {x: 30, y: -60 - Math.sin(t)*5}; elbowR = {x: 15, y: -50}; 
    }
    else if (p.state === 'taunt_power') { 
        let shake = Math.random()*2 - 1; 
        head.x += shake; head.y = -50 + shake; pelvis.y = -10; 
        footL = {x: -20, y: 0}; kneeL = {x: -25, y: -10}; 
        footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10}; 
        handL = {x: -15, y: -40}; elbowL = {x: -25, y: -30}; 
        handR = {x: 15, y: -40}; elbowR = {x: 25, y: -30}; 
        if(Math.random()<0.2 && window.particles){ 
            window.particles.push({x: p.x+(Math.random()-0.5)*30, y: window.GROUND_Y, vx: 0, vy: -Math.random()*4, life: 15, maxLife: 15, color: p.color||"#f1c40f", size: 2}); 
        } 
    }
    else if (p.state === 'taunt_dance') { 
        let swing = Math.sin(t * 2) * 20; 
        let hip = Math.cos(t * 2) * 10; 
        pelvis.x = hip; head.x = -hip/2; 
        handL = {x: -15 + swing, y: -30}; elbowL = {x: -20 + swing, y: -40}; 
        handR = {x: 15 + swing, y: -30}; elbowR = {x: 20 + swing, y: -40}; 
    }
    else if (p.state === 'taunt_point') { 
        head.x = 5; 
        handR = {x: 35, y: -40 + Math.sin(t)*2}; elbowR = {x: 20, y: -40}; 
        handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; 
    }
    else if (p.state === 'taunt_flex') { 
        head.y = -55 + Math.sin(t)*2; pelvis.y = -20; 
        handL = {x: -20, y: -55}; elbowL = {x: -30, y: -45}; 
        handR = {x: 20, y: -55}; elbowR = {x: 30, y: -45}; 
    }

    // --- MEMES & VŨ ĐIỆU KINH ĐIỂN ---
    else if (p.state === 't_pose') { 
        head.y = -60; neck.y = -45; pelvis.y = -20; 
        handL = {x: -40, y: -45}; elbowL = {x: -20, y: -45}; 
        handR = {x: 40, y: -45}; elbowR = {x: 20, y: -45}; 
        footL = {x: -15, y: 0}; footR = {x: 15, y: 0}; 
        kneeL = {x: -10, y: -10}; kneeR = {x: 10, y: -10}; 
    }
    else if (p.state === 'dab') { 
        head.x = 15; head.y = -40; neck.x = 5; neck.y = -35; 
        handL = {x: 25, y: -50}; elbowL = {x: 10, y: -40}; 
        handR = {x: 45, y: -60}; elbowR = {x: 30, y: -50}; 
        footL = {x: -15, y: 0}; footR = {x: 20, y: 0}; 
    }
    else if (p.state === 'floss') { 
        let swing = Math.sin(fastF) * 20; pelvis.x = -swing / 2; 
        handL = {x: -10 + swing, y: -20}; elbowL = {x: -20 + swing, y: -30}; 
        handR = {x: 10 + swing, y: -20}; elbowR = {x: 20 + swing, y: -30}; 
    }
    else if (p.state === 'siuuuu') { 
        pelvis.y = -15; head.y = -55; head.x = -5; neck.x = -2; 
        handL = {x: -30, y: 0}; elbowL = {x: -20, y: -20}; 
        handR = {x: 30, y: 0}; elbowR = {x: 20, y: -20}; 
        footL = {x: -25, y: 0}; footR = {x: 25, y: 0}; 
        kneeL = {x: -20, y: -10}; kneeR = {x: 20, y: -10}; 
    }
    else if (p.state === 'smooth_criminal') { 
        let lean = 25; 
        pelvis.x = lean; pelvis.y = -15; neck.x = lean * 2; neck.y = -40; head.x = lean * 2.2; head.y = -55; 
        footL = {x: -10, y: 0}; footR = {x: 10, y: 0}; 
        kneeL = {x: lean/2, y: -10}; kneeR = {x: 10 + lean/2, y: -10}; 
        handL = {x: lean*1.5, y: -20}; handR = {x: lean*2, y: -20}; 
    }
    else if (p.state === 'salt_bae') { 
        head.y = -60; 
        handL = {x: -10, y: -40}; elbowL = {x: -15, y: -30}; 
        handR = {x: 25, y: -50}; elbowR = {x: 15, y: -20}; 
        if(window.particles && Math.random()<0.5) window.particles.push({x: p.x + 25, y: p.y - 45, vx: 0, vy: 2, life: 10, maxLife: 10, color: "#fff", size: 2}); 
    }
    else if (p.state === 'gangnam_style') { 
        let hop = Math.abs(Math.sin(fastF)) * 10; 
        pelvis.y = -20 - hop; head.y = -60 - hop; neck.y = -45 - hop; 
        handL = {x: 5, y: -35}; elbowL = {x: -10, y: -40}; 
        handR = {x: -5, y: -35}; elbowR = {x: 10, y: -40}; 
        footL = {x: -15, y: 0}; kneeL = {x: -20, y: -15}; 
        footR = {x: 15, y: -hop*1.5}; kneeR = {x: 20, y: -15 - hop*1.5}; 
    }
    else if (p.state === 'robot_dance') { 
        let tick = Math.floor(tFrame * 2) % 2 === 0; 
        head.y = -60; head.x = tick ? 5 : -5; 
        handL = {x: tick ? -20 : -30, y: tick ? -20 : -40}; elbowL = {x: -25, y: -30}; 
        handR = {x: tick ? 30 : 20, y: tick ? -40 : -20}; elbowR = {x: 25, y: -30}; 
    }
    else if (p.state === 'zombie') { 
        pelvis.x = 5; head.x = 15; head.y = -55; neck.x = 10; 
        handL = {x: 30, y: -40}; elbowL = {x: 20, y: -35}; 
        handR = {x: 35, y: -45}; elbowR = {x: 25, y: -40}; 
        footL = {x: -10, y: 0}; footR = {x: 15, y: 0}; kneeR = {x: 15, y: -10}; 
    }
    else if (p.state === 'rickroll') { 
        let sway = Math.sin(tFrame)*10; 
        pelvis.x = sway; head.x = sway; head.y = -60; neck.x = sway; 
        handL = {x: sway - 15, y: -50}; elbowL = {x: sway - 20, y: -40}; 
        handR = {x: sway + 25, y: -20}; elbowR = {x: sway + 30, y: -30}; 
    }
    else if (p.state === 'breakdance') { 
        let spin = fastF * 2; 
        pelvis.y = -10; head.y = 0; head.x = -15; neck.y = -5; 
        handL = {x: 0, y: 0}; handR = {x: 10, y: 0}; 
        footL = {x: Math.cos(spin)*40, y: -30 + Math.sin(spin)*20}; 
        footR = {x: Math.cos(spin+Math.PI)*40, y: -30 + Math.sin(spin+Math.PI)*20}; 
    }
    else if (p.state === 'moonwalk') { 
        head.y = -62 + Math.cos(tFrame)*2; neck.y = -48 + Math.cos(tFrame)*2; 
        let slide = Math.sin(tFrame); 
        if (slide > 0) { 
            footL = {x: -20 + slide*20, y: 0}; kneeL = {x: -10 + slide*10, y: -10}; 
            footR = {x: 20 - slide*20, y: -5}; kneeR = {x: 15 - slide*10, y: -20}; 
        } else { 
            footL = {x: -20 - slide*20, y: -5}; kneeL = {x: -10 - slide*10, y: -20}; 
            footR = {x: 20 + slide*20, y: 0}; kneeR = {x: 15 + slide*10, y: -10}; 
        } 
        handL = {x: -15, y: -30 + Math.sin(tFrame)*5}; elbowL = {x: -10, y: -40}; 
        handR = {x: 15, y: -30 - Math.sin(tFrame)*5}; elbowR = {x: 10, y: -40}; 
    }

    // --- ANIME & MANGA ---
    else if (p.state === 'hollow_purple') { 
        let floatY = Math.sin(tFrame) * 10; 
        pelvis.y = -35 + floatY; head.y = -75 + floatY; neck.y = -60 + floatY; 
        handR = {x: 15, y: -65 + floatY}; elbowR = {x: 5, y: -50 + floatY}; 
        handL = {x: 25, y: -50 + floatY}; elbowL = {x: 10, y: -40 + floatY}; 
        footL = {x: -10, y: -15 + floatY}; kneeL = {x: -15, y: -25 + floatY}; 
        footR = {x: 10, y: -10 + floatY}; kneeR = {x: 15, y: -20 + floatY}; 
        if(window.particles && Math.random()<0.4) {
            window.particles.push({x: p.x + 20, y: p.y - 60, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 25, maxLife: 25, color: Math.random()>0.5?"#8e44ad":"#e74c3c", size: Math.random()*4+2}); 
        }
    }
    else if (p.state === 'giorno_pose') { 
        pelvis.x = -15; head.x = 10; head.y = -55; neck.x = 0; 
        handL = {x: -5, y: -35}; elbowL = {x: -20, y: -45}; 
        handR = {x: 15, y: -65}; elbowR = {x: 25, y: -45}; 
        footL = {x: -20, y: 0}; footR = {x: 25, y: 0}; 
        kneeR = {x: 15, y: -15}; kneeL = {x: -25, y: -10}; 
    }
    else if (p.state === 'naruto_seal') { 
        head.y = -55; head.x = 5; pelvis.y = -15;
        handL = {x: 10, y: -45}; elbowL = {x: -5, y: -35}; 
        handR = {x: 15, y: -45}; elbowR = {x: 25, y: -35}; 
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; 
        kneeL = {x: -25, y: -15}; kneeR = {x: 25, y: -15}; 
    }
    else if (p.state === 'super_saiyan') { 
        let vibe = Math.random() * 4; 
        pelvis.y = -15 + vibe; head.y = -55 + vibe; 
        handL = {x: -25+vibe, y: -30+vibe}; elbowL = {x: -30, y: -40}; 
        handR = {x: 25+vibe, y: -30+vibe}; elbowR = {x: 30, y: -40}; 
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; 
        kneeL = {x: -25, y: -15}; kneeR = {x: 25, y: -15}; 
        if(window.particles) window.particles.push({x: p.x + (Math.random()-0.5)*40, y: p.y, vx: 0, vy: -6, life: 20, maxLife: 20, color: "#f1c40f", size: Math.random()*5}); 
    }
    else if (p.state === 'kame_fire') { 
        pelvis.y = -15; head.x = 15; head.y = -45; neck.x = 5; 
        footL = {x: -25, y: 0}; footR = {x: 25, y: 0}; kneeR = {x: 20, y: -10}; 
        handL = {x: 40, y: -30}; handR = {x: 45, y: -35}; 
        elbowL = {x: 20, y: -25}; elbowR = {x: 25, y: -30}; 
        if(window.particles) window.particles.push({x: p.x + 45, y: p.y - 32, vx: 18, vy: (Math.random()-0.5)*2, life: 15, maxLife: 15, color: "#3498db", size: 7}); 
    }

    // --- CHIẾN ĐẤU & KỸ NĂNG ĐẶC BIỆT ---
    else if (p.state === 'matrix_dodge') { 
        let lean = Math.min(1, progress * 2); 
        pelvis.x = 10; pelvis.y = -10; 
        neck.x = -15 * lean; neck.y = -30; 
        head.x = -30 * lean; head.y = -20 * lean; 
        footL = {x: -10, y: 0}; footR = {x: 30, y: 0}; kneeR = {x: 20, y: -15}; 
        handL = {x: -20, y: 0}; elbowL = {x: -25, y: -15}; 
        handR = {x: 10, y: -10}; elbowR = {x: 0, y: -20}; 
    }
    else if (p.state === 'shoryuken') { 
        pelvis.y = -40; head.x = 10; head.y = -80; neck.y = -65; 
        footL = {x: -10, y: -20}; kneeL = {x: -15, y: -30}; 
        footR = {x: 15, y: -30}; kneeR = {x: 20, y: -45}; 
        handR = {x: 15, y: -100}; elbowR = {x: 15, y: -70}; 
        handL = {x: -15, y: -40}; elbowL = {x: -20, y: -50}; 
    }
    else if (p.state === 'tatsumaki') { 
        pelvis.y = -30; head.y = -70; neck.y = -50; 
        let spin = Math.sin(fastF * 2.5); 
        footR = {x: 35 * spin, y: -40}; kneeR = {x: 20 * spin, y: -35}; 
        footL = {x: 0, y: -20}; kneeL = {x: -10, y: -25}; 
        handL = {x: -20 * spin, y: -50}; handR = {x: 20 * spin, y: -50}; 
    }
    else if (p.state === 'levitate') { 
        let floatY = Math.sin(tFrame) * 15; 
        pelvis.y = -40 + floatY; head.y = -80 + floatY; neck.y = -65 + floatY; 
        handL = {x: -25, y: -30 + floatY}; elbowL = {x: -15, y: -40 + floatY}; 
        handR = {x: 25, y: -30 + floatY}; elbowR = {x: 15, y: -40 + floatY}; 
        footL = {x: -10, y: -15 + floatY}; kneeL = {x: -15, y: -25 + floatY}; 
        footR = {x: 10, y: -15 + floatY}; kneeR = {x: 15, y: -25 + floatY}; 
        if(window.particles && Math.random()<0.3) window.particles.push({x: p.x, y: p.y, vx: (Math.random()-0.5)*4, vy: 2, life: 20, maxLife: 20, color: "#9b59b6", size: 3}); 
    }

    return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
};

// --- HÀM VẼ NHÂN VẬT CHÍNH (TÍCH HỢP TOÀN BỘ NÂNG CẤP) ---
window.drawStickman = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    // Hệ quy chiếu động: Xoay nhân vật dựa trên hướng nhìn
    if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    // Bóng đổ dưới đất
    if (!isTrail && p.onGround) {
        ctx.save();
        ctx.shadowBlur = 0; 
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath(); 
        ctx.ellipse(0, 0, 22, 4, 0, 0, Math.PI*2); 
        ctx.fill();
        ctx.restore();
    }

    ctx.strokeStyle = "#fff"; 
    // Giảm shadowBlur tổng thể để tối ưu, chỉ giữ cho các điểm tụ sáng Neon
    ctx.shadowBlur = p.iFrames > 0 ? 15 : (isTrail ? 0 : 5); 
    ctx.shadowColor = p.iFrames > 0 ? "#bdc3c7" : (p.color || "#fff"); 
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    
    if (isTrail) { 
        ctx.globalAlpha = p.alpha || 0.3; 
        ctx.shadowBlur = 0; 
    }

    let bounce = (p.state === 'walk') ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
    
    // Tính toán MaxT cho Easing (Nội suy đòn đánh)
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
    
    let pext = (progress > 0.5) ? (1 - progress)*2 : progress*2;
    let customDrawSuccess = false;
    
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let oldState = p.state; 
        let passedExt = ext; 
        let passedPext = pext;
        
        if (p.state === 'machine_gun_punches') { 
            p.state = 'punch'; 
            passedExt = Math.sin(((progress * 5) % 1) * Math.PI); 
            passedPext = passedExt; 
        } 
        else if (p.state === 'asura_strike') { 
            p.state = 'punch'; 
            passedExt = progress < 0.2 ? 0 : (progress > 0.8 ? 0 : 1); 
            passedPext = passedExt; 
        } 
        else if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'one_inch_punch', 'dempsey_roll'].includes(p.state)) { 
            p.state = 'punch'; 
        } 
        else if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(p.state)) { 
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
            p.state = oldState; 
        }
    }

    if (!customDrawSuccess) {
        // [TÍCH HỢP LERP] Lấy bộ xương mục tiêu và nội suy để tạo độ mượt
        let targetPts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let smoothedPts = window.blendSkeleton(p, targetPts);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = smoothedPts;

        // [NÂNG CẤP 4] VẼ TAY CHÂN CYBERPUNK (Gradient Volume & Neon Joints)
        const drawLimb = (start, mid, end) => { 
            ctx.beginPath();
            
            // Hiệu ứng Gradient khối lượng
            let grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            grad.addColorStop(0, "#2c3e50"); // Góc tối gần thân
            grad.addColorStop(1, isTrail ? "rgba(255,255,255,0.2)" : "#ecf0f1"); // Sáng ở phần ngọn tứ chi
            
            ctx.strokeStyle = grad;
            
            // Đoạn trên (Bắp tay / Đùi) - Dày hơn
            ctx.lineWidth = 6.5;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.stroke();
            
            // Đoạn dưới (Cẳng tay / Cẳng chân) - Mỏng dần
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(mid.x, mid.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Điểm nhấn Cyberpunk tại các khớp (Neon Joint)
            if (!isTrail) {
                ctx.save();
                ctx.globalCompositeOperation = "lighter"; // Chế độ phát sáng chói
                ctx.fillStyle = p.color || "#00f3ff";
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color || "#00f3ff";
                ctx.beginPath(); ctx.arc(mid.x, mid.y, 2.5, 0, Math.PI*2); ctx.fill(); // Khớp giữa (Cùi chỏ/Đầu gối)
                ctx.beginPath(); ctx.arc(end.x, end.y, 3.5, 0, Math.PI*2); ctx.fill(); // Bàn tay / Bàn chân
                ctx.restore();
            }
        };

        // [NÂNG CẤP 2] VẬT LÝ VẢI VERLET DÀNH CHO KHĂN QUÀNG / BĂNG ĐÔ
        if (!isTrail) {
            if (!p.scarfNodes) {
                // Tạo 6 đốt cho khăn quàng cổ mềm mại
                p.scarfNodes = Array(6).fill().map(() => ({x: 0, y: -45, oldX: 0, oldY: -45}));
            }

            let wind = window.globalWind || 0.8;
            let gravity = 0.6;
            let nodeDist = 5.5; // Chiều dài mỗi đốt khăn

            p.scarfNodes[0].x = neck.x;
            p.scarfNodes[0].y = neck.y;

            ctx.beginPath();
            ctx.moveTo(neck.x, neck.y);

            for (let i = 1; i < p.scarfNodes.length; i++) {
                let node = p.scarfNodes[i];
                let prevNode = p.scarfNodes[i-1];

                // Quán tính (Verlet)
                let vx = (node.x - node.oldX) * 0.85;
                let vy = (node.y - node.oldY) * 0.85;
                
                node.oldX = node.x;
                node.oldY = node.y;
                
                // Cập nhật vị trí bị ảnh hưởng bởi chuyển động nhân vật, Gió, Trọng lực
                // p.vx được nhân hệ số đảo ngược theo ctx.scale nếu cần, nhưng Verlet tự xử lý rất tốt
                let charVx = (p.vx || 0); 
                node.x += vx - charVx * 0.3 + (Math.random() * wind * 2 - wind);
                node.y += vy - (p.vy || 0) * 0.3 + gravity;

                // Constraint - Kéo các đốt lại đúng khoảng cách
                let dx = node.x - prevNode.x;
                let dy = node.y - prevNode.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist === 0) dist = 0.001; // tránh lỗi chia 0
                let diff = (nodeDist - dist) / dist;
                
                node.x += dx * diff * 0.6;
                node.y += dy * diff * 0.6;

                // Vẽ nội suy Curve mềm mại giữa các điểm
                let xc = (prevNode.x + node.x) / 2;
                let yc = (prevNode.y + node.y) / 2;
                ctx.quadraticCurveTo(prevNode.x, prevNode.y, xc, yc);
            }
            
            // Render khăn quàng bay trong gió
            ctx.lineCap = "round";
            ctx.lineWidth = 3;
            ctx.strokeStyle = p.color || "#ff2a2a";
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color || "#ff2a2a";
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
        }

        // VẼ ĐỘ KHỐI CƠ THỂ (TORSO POLYGON)
        ctx.fillStyle = "#1a1a1a";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2; // Viền mỏng cho Torso
        ctx.beginPath();
        ctx.moveTo(neck.x - 4, neck.y); 
        ctx.lineTo(neck.x + 4, neck.y); 
        ctx.lineTo(pelvis.x + 3, pelvis.y); 
        ctx.lineTo(pelvis.x - 3, pelvis.y);
        ctx.closePath();
        ctx.fill(); 
        ctx.stroke(); 

        // VẼ TAY CHÂN VỚI ENGINE MỚI
        drawLimb(pelvis, kneeL, footL); 
        drawLimb(pelvis, kneeR, footR); 
        drawLimb(neck, elbowL, handL); 
        drawLimb(neck, elbowR, handR); 

        // VẼ ĐẦU VÀ MẮT SÁNG
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        ctx.beginPath(); 
        ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#111"; 
        ctx.fill(); 
        ctx.stroke(); 
        
        if (!isTrail) {
            ctx.fillStyle = p.color || "#00f3ff"; 
            ctx.shadowBlur = 10; 
            ctx.shadowColor = p.color;
            ctx.beginPath(); 
            // Vị trí mắt xoay theo hướng mặt
            ctx.arc(head.x + 4, head.y - 2, 2.5, 0, Math.PI*2); 
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        // [NÂNG CẤP 3] WEAPON TRAILS / STRIKE ARCS (Quỹ đạo đòn đánh rực rỡ)
        if (!isTrail && p.attackTimer > 0) {
            if (!p.attackTrail) p.attackTrail = [];
            
            // Chân cho đòn đá, Tay cho đòn đấm (Lấy chi trước - handR/footR mặc định do hệ quy chiếu đã flip)
            let isKick = p.state.includes('kick') || p.state === 'tatsumaki';
            let strikePoint = isKick ? footR : handR;

            p.attackTrail.unshift({x: strikePoint.x, y: strikePoint.y});
            if (p.attackTrail.length > 10) p.attackTrail.pop(); // Giữ 10 khung hình ảo ảnh

            if (p.attackTrail.length > 2) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p.attackTrail[0].x, p.attackTrail[0].y);
                for (let i = 1; i < p.attackTrail.length; i++) {
                    ctx.lineTo(p.attackTrail[i].x, p.attackTrail[i].y);
                }
                
                ctx.lineWidth = 12; // Độ dày của luồng chưởng/kiếm khí
                let grad = ctx.createLinearGradient(p.attackTrail[0].x, p.attackTrail[0].y, p.attackTrail[p.attackTrail.length-1].x, p.attackTrail[p.attackTrail.length-1].y);
                grad.addColorStop(0, p.color || "#00f3ff"); // Màu chủ đạo tại điểm đánh
                grad.addColorStop(1, "rgba(0,0,0,0)");      // Mờ dần về đuôi
                
                ctx.strokeStyle = grad;
                ctx.globalCompositeOperation = "screen"; // Chế độ hòa trộn tạo vệt sáng
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.stroke();
                ctx.restore();
            }
        } else {
            // Xóa mảng quỹ đạo khi kết thúc đòn đánh
            if (p.attackTrail && p.attackTrail.length > 0) p.attackTrail = []; 
        }
    }

    // Vẽ Vòng Shield bảo vệ nhân vật
    if (!isTrail && p.shield > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); 
        ctx.fillStyle = "rgba(52, 152, 219, 0.1)"; ctx.fill(); 
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.8)"; ctx.stroke(); 
    }
    
    if (p.superArmor > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); 
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255, 71, 87, 0.8)"; ctx.stroke(); 
        ctx.fillStyle = "rgba(255, 71, 87, 0.2)"; ctx.fill(); 
    }
    
    // Vẽ thanh máu cho Enemy
    if (!p.isPlayer && !isTrail) { 
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -105, 40, 5); 
        ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -105, 40 * (Math.max(0, p.hp)/p.maxHp), 5); 
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -105, 40, 5); 
    }
    
    ctx.restore();
};

window.assignDrawMethods = function(statsObj) { 
    // Các logic Boss/nhân vật đặc biệt khác của bạn giữ nguyên ở đây.
};
