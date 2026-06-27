// ==========================================
// GRAPHICS.JS - HỆ THỐNG KHUNG XƯƠNG TOÀN CỤC
// ==========================================

// Đưa hàm này ra ngoài toàn cục để các file nhân vật độc lập gọi được
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

// Bây giờ hàm assignDrawMethods cũ không cần vòng lặp gán đè phức tạp nữa, xóa bỏ nó hoặc để trống.
window.assignDrawMethods = function(statsObj) { };
