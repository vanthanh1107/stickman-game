// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA TRUNG TÂM HOÀN CHỈNH 2.0
// KHUNG XƯƠNG HOẠT ẢNH, NỘI SUY MMA, 30 SIÊU KỸ NĂNG & ĐỒ HỌA ĐỘC QUYỀN BOSS
// ==========================================

// 1. HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG TOÀN CỤC
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
    let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
    let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
    let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
    
    let t = Date.now() / 150; 
    let tFrame = Date.now() / 150;
    let fastF = Date.now() / 50;
    let progress = (p.attackTimer > 0 && p.maxT) ? 1 - (p.attackTimer / p.maxT) : ext;

    // --- CÁC TRẠNG THÁI CƠ BẢN VÀ CHIẾN ĐẤU ---
    if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch' && p.state !== 'levitate' && p.state !== 'shoryuken' && p.state !== 'tatsumaki') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
    else if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
    else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
    else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
    else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } 
    else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } 
    else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } 
    else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
    
    // --- CÁC ĐIỆU TAUNT (CÀ KHỊA) ---
    else if (p.state === 'taunt_crane') { head.y += Math.sin(t)*2; footR = {x: -5, y: -25}; kneeR = {x: 15, y: -20}; footL = {x: 0, y: 0}; kneeL = {x: -10, y: -10}; handL = {x: -30, y: -60 + Math.sin(t)*5}; elbowL = {x: -15, y: -50}; handR = {x: 30, y: -60 - Math.sin(t)*5}; elbowR = {x: 15, y: -50}; }
    else if (p.state === 'taunt_power') { let shake = Math.random()*2 - 1; head.x += shake; head.y = -50 + shake; pelvis.y = -10; footL = {x: -20, y: 0}; kneeL = {x: -25, y: -10}; footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10}; handL = {x: -15, y: -40}; elbowL = {x: -25, y: -30}; handR = {x: 15, y: -40}; elbowR = {x: 25, y: -30}; if(Math.random()<0.2 && window.particles){ window.particles.push({x: p.x+(Math.random()-0.5)*30, y: window.GROUND_Y, vx: 0, vy: -Math.random()*4, life: 15, maxLife: 15, color: p.color||"#f1c40f", size: 2}); } }
    else if (p.state === 'taunt_dance') { let swing = Math.sin(t * 2) * 20; let hip = Math.cos(t * 2) * 10; pelvis.x = hip; head.x = -hip/2; handL = {x: -15 + swing, y: -30}; elbowL = {x: -20 + swing, y: -40}; handR = {x: 15 + swing, y: -30}; elbowR = {x: 20 + swing, y: -40}; }
    else if (p.state === 'taunt_point') { head.x = 5; handR = {x: 35, y: -40 + Math.sin(t)*2}; elbowR = {x: 20, y: -40}; handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; }
    else if (p.state === 'taunt_flex') { head.y = -55 + Math.sin(t)*2; pelvis.y = -20; handL = {x: -20, y: -55}; elbowL = {x: -30, y: -45}; handR = {x: 20, y: -55}; elbowR = {x: 30, y: -45}; }

    // ==========================================
    // 🌟 KHO TÀNG 30 ĐIỆU MÚA VÀ TUYỆT KỸ
    // ==========================================
    
    // 🎭 NHÓM 1: MEMES & VŨ ĐIỆU KINH ĐIỂN
    else if (p.state === 't_pose') {
        head.y = -60; neck.y = -45; pelvis.y = -20;
        handL = {x: -40, y: -45}; elbowL = {x: -20, y: -45};
        handR = {x: 40, y: -45}; elbowR = {x: 20, y: -45};
        footL = {x: -15, y: 0}; footR = {x: 15, y: 0}; kneeL = {x: -10, y: -10}; kneeR = {x: 10, y: -10};
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
        footL = {x: -25, y: 0}; footR = {x: 25, y: 0}; kneeL = {x: -20, y: -10}; kneeR = {x: 20, y: -10};
    }
    else if (p.state === 'smooth_criminal') { 
        let lean = 25;
        pelvis.x = lean; pelvis.y = -15; neck.x = lean * 2; neck.y = -40; head.x = lean * 2.2; head.y = -55;
        footL = {x: -10, y: 0}; footR = {x: 10, y: 0}; kneeL = {x: lean/2, y: -10}; kneeR = {x: 10 + lean/2, y: -10};
        handL = {x: lean*1.5, y: -20}; handR = {x: lean*2, y: -20};
    }
    else if (p.state === 'salt_bae') { 
        head.y = -60; handL = {x: -10, y: -40}; elbowL = {x: -15, y: -30};
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

    // 🔮 NHÓM 2: ANIME & MANGA
    else if (p.state === 'super_saiyan') {
        let vibe = Math.random() * 4; pelvis.y = -15 + vibe; head.y = -55 + vibe;
        handL = {x: -25+vibe, y: -30+vibe}; elbowL = {x: -30, y: -40};
        handR = {x: 25+vibe, y: -30+vibe}; elbowR = {x: 30, y: -40};
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; kneeL = {x: -25, y: -15}; kneeR = {x: 25, y: -15};
        if(window.particles) window.particles.push({x: p.x + (Math.random()-0.5)*40, y: p.y, vx: 0, vy: -6, life: 20, maxLife: 20, color: "#f1c40f", size: Math.random()*5});
    }
    else if (p.state === 'jojo_dio') { 
        pelvis.x = 10; pelvis.y = -25; neck.x = -15; neck.y = -40; head.x = -25; head.y = -45; 
        handL = {x: -35, y: -60}; elbowL = {x: -25, y: -50};
        handR = {x: 15, y: -60}; elbowR = {x: 5, y: -50};
        footL = {x: -15, y: 0}; footR = {x: 30, y: 0}; kneeR = {x: 20, y: -20};
    }
    else if (p.state === 'jojo_jotaro') { 
        head.y = -60; head.x = 5;
        handL = {x: -10, y: -20}; elbowL = {x: -15, y: -30}; 
        handR = {x: 40, y: -45}; elbowR = {x: 20, y: -45}; 
        footL = {x: -15, y: 0}; footR = {x: 15, y: 0};
    }
    else if (p.state === 'gear_second') { 
        pelvis.y = 5; head.y = -20; neck.y = -10; head.x = 15;
        footL = {x: -25, y: 0}; kneeL = {x: -30, y: 5};
        footR = {x: 15, y: 0}; kneeR = {x: 20, y: -5};
        handL = {x: 20, y: 0}; elbowL = {x: 15, y: -10}; 
        handR = {x: -10, y: -10}; elbowR = {x: -20, y: -15}; 
        if(window.particles && Math.random()<0.5) window.particles.push({x: p.x, y: p.y, vx: (Math.random()-0.5)*2, vy: -4, life: 30, maxLife: 30, color: "rgba(255, 100, 100, 0.6)", size: 6});
    }
    else if (p.state === 'goku_teleport') { 
        head.y = -60; handR = {x: 5, y: -60}; elbowR = {x: 15, y: -45}; 
        handL = {x: -10, y: -30}; elbowL = {x: -15, y: -40};
    }
    else if (p.state === 'sasageyo') { 
        head.y = -60; 
        handR = {x: -5, y: -45}; elbowR = {x: 10, y: -35}; 
        handL = {x: -20, y: -20}; elbowL = {x: -30, y: -30}; 
    }
    else if (p.state === 'yamcha_death') { 
        pelvis.y = 0; head.x = 15; head.y = 5; neck.x = 10; neck.y = 5;
        footL = {x: -15, y: 0}; footR = {x: -25, y: 0}; kneeL = {x: -10, y: -5}; kneeR = {x: -20, y: -5};
        handL = {x: 5, y: 0}; handR = {x: 25, y: 0}; elbowL = {x: 0, y: -5}; elbowR = {x: 20, y: -5};
    }
    else if (p.state === 'kame_charge') { 
        let vibe = Math.random() * 2; 
        pelvis.y = -10 + vibe; head.x = 5 + vibe; head.y = -50 + vibe; neck.x = 2;
        footL = {x: -25, y: 0}; kneeL = {x: -15, y: -10}; 
        footR = {x: 25, y: 0}; kneeR = {x: 15, y: -10};
        handR = {x: -25 + vibe, y: -25 + vibe}; elbowR = {x: -15, y: -30}; 
        handL = {x: -20 + vibe, y: -20 + vibe}; elbowL = {x: -10, y: -25};
        if(window.particles && Math.random() < 0.3) window.particles.push({x: p.x - 20, y: p.y - 25, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, life: 10, maxLife: 10, color: "#3498db", size: 3});
    }
    else if (p.state === 'kame_fire') { 
        pelvis.y = -15; head.x = 15; head.y = -45; neck.x = 5;
        footL = {x: -25, y: 0}; footR = {x: 25, y: 0}; kneeR = {x: 20, y: -10};
        handL = {x: 40, y: -30}; handR = {x: 45, y: -35}; 
        elbowL = {x: 20, y: -25}; elbowR = {x: 25, y: -30};
        if(window.particles) window.particles.push({x: p.x + 45, y: p.y - 32, vx: 18, vy: (Math.random()-0.5)*2, life: 15, maxLife: 15, color: "#3498db", size: 7});
    }
    else if (p.state === 'fusion_dance') { 
        let sway = Math.sin(tFrame) * 15;
        pelvis.x = sway; head.x = sway + 5; head.y = -60; neck.x = sway + 2;
        handL = {x: sway + 30, y: -70}; elbowL = {x: sway + 15, y: -50}; 
        handR = {x: sway + 40, y: -60}; elbowR = {x: sway + 25, y: -45};
        footL = {x: -15 + sway/2, y: 0}; footR = {x: 20 + sway/2, y: 0}; kneeL = {x: -10, y: -10};
    }
    else if (p.state === 'naruto_run') { 
        let runCycle = Math.sin(fastF) * 15;
        pelvis.x = 10; pelvis.y = -15; head.x = 35; head.y = -40; neck.x = 25; neck.y = -30; 
        handL = {x: -30, y: -45}; elbowL = {x: -15, y: -40}; 
        handR = {x: -25, y: -50}; elbowR = {x: -10, y: -45};
        footL = {x: 10 + runCycle, y: -10 - runCycle}; kneeL = {x: 15, y: -20};
        footR = {x: 10 - runCycle, y: -10 + runCycle}; kneeR = {x: 15, y: -20};
    }

    // 🦸 NHÓM 3: SUPERHERO & ARCADE
    else if (p.state === 'ironman_landing') {
        pelvis.y = -5; head.x = 10; head.y = -30; neck.y = -20;
        footL = {x: -20, y: 0}; kneeL = {x: -25, y: 0}; 
        footR = {x: 20, y: 0}; kneeR = {x: 25, y: -15};
        handR = {x: 15, y: 0}; elbowR = {x: 10, y: -10}; 
        handL = {x: -20, y: -40}; elbowL = {x: -30, y: -30}; 
    }
    else if (p.state === 'spiderman_shoot') {
        pelvis.y = -15; head.x = 15; head.y = -45; neck.x = 5;
        footL = {x: -20, y: 0}; footR = {x: 25, y: 0}; kneeR = {x: 30, y: -10};
        handR = {x: 35, y: -35}; elbowR = {x: 20, y: -35}; 
        handL = {x: -25, y: -25}; elbowL = {x: -15, y: -35}; 
        if(window.particles && Math.random()<0.3) window.particles.push({x: p.x + 35, y: p.y - 35, vx: 12, vy: 0, life: 10, maxLife: 10, color: "#fff", size: 2});
    }
    else if (p.state === 'wolverine_pose') { 
        head.y = -55; head.x = 5; pelvis.y = -15; neck.y = -40;
        handL = {x: 5, y: -40}; elbowL = {x: -15, y: -30}; 
        handR = {x: -5, y: -40}; elbowR = {x: 15, y: -30};
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0};
    }
    else if (p.state === 'matrix_dodge') { 
        let lean = Math.min(1, progress * 2); 
        pelvis.x = 10; pelvis.y = -10; 
        neck.x = -15 * lean; neck.y = -30; 
        head.x = -30 * lean; head.y = -20 * lean; 
        footL = {x: -10, y: 0}; footR = {x: 30, y: 0}; kneeR = {x: 20, y: -15};
        handL = {x: -20, y: 0}; elbowL = {x: -25, y: -15}; 
        handR = {x: 10, y: -10}; elbowR = {x: 0, y: -20};
    }
    else if (p.state === 'hadouken') {
        pelvis.y = -15; head.x = 10; head.y = -45; neck.x = 5;
        footL = {x: -20, y: 0}; footR = {x: 20, y: 0}; kneeR = {x: 25, y: -10};
        handL = {x: 30, y: -30}; handR = {x: 30, y: -35}; 
        elbowL = {x: 15, y: -25}; elbowR = {x: 15, y: -35};
        if(window.particles && Math.random()<0.6) window.particles.push({x: p.x + 35, y: p.y - 32, vx: 6, vy: 0, life: 15, maxLife: 15, color: "#00ffff", size: 5});
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
    else if (p.state === 'praise_the_sun') { 
        head.y = -65; head.x = 0; neck.y = -50; pelvis.y = -15;
        handL = {x: -35, y: -80}; elbowL = {x: -20, y: -60}; 
        handR = {x: 35, y: -80}; elbowR = {x: 20, y: -60};
        footL = {x: -15, y: 0}; footR = {x: 15, y: 0};
    }

    return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
};

// 2. HÀM CHỦ LỰC VẼ STICKMAN 
window.drawStickman = function(ctx, p, isTrail = false) {
    if(!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    // [BẢN VÁ LỖI BÓNG ĐỔ] Vẽ bóng ngay lót mặt đất TRƯỚC KHI vẽ nhân vật, tắt glow.
    if (!isTrail && p.onGround) {
        ctx.save();
        ctx.shadowBlur = 0; // Ngăn bóng bị lan màu/phát sáng nhòe nhoẹt
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 4, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

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
    else if (p.state === 'dragon_uppercut') maxT = 35; 
    else if (p.state === 'machine_gun_punches') maxT = 60; 
    else if (p.state === 'one_inch_punch') maxT = 38; 
    else if (p.state === 'asura_strike') maxT = 35; 
    else if (p.state === 'cast') maxT = 45; 
    else if (p.state === 'dash' || p.state === 'dash_back') maxT = 15; 
    else if (p.state === 'dempsey_roll') maxT = 30;
    
    p.maxT = maxT;
    
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; if (progress > 0) { if (progress < 0.3) ext = Math.sin((progress / 0.3) * (Math.PI / 2)); else ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); }
    let pext = (progress > 0.5) ? (1 - progress)*2 : progress*2;

    let customDrawSuccess = false;
    
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
        } catch (e) { console.error("Lỗi vẽ nhân vật tùy chỉnh:", e); } finally { p.state = oldState; }
    }

    if (!customDrawSuccess) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;

        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        ctx.shadowBlur = 0; ctx.fillStyle = p.color || "#fff"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill(); 
    }

    // Vẽ Vòng Shield bảo vệ nhân vật
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
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    // [BẢN VÁ LỖI BÓNG ĐỔ RỒNG] Đã xóa bỏ setTransform(1,0,0,1,0,0) tàn phá hệ thống Camera!
    if (!isTrail && p.onGround) {
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 7, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

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

window.assignDrawMethods = function(statsObj) { };
