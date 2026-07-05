// KHỞI TẠO KHO CHỨA BÓNG (Dùng chung cho cả CR7 và Messi để bóng nằm lại trên sân)
if (!window.cr7Balls) window.cr7Balls = [];

// ==========================================
// [HACK ENGINE] TÍCH HỢP BÓNG VẬT LÝ VÀO GAME LOOP
// ==========================================
// Mình vẫn giữ hook này trong file Messi để phòng trường hợp bạn chơi Messi mà không nạp Ronaldo, bóng vẫn sẽ chạy vật lý bình thường!
if (!window.cr7Hooked) {
    let oldUpdate = window.update;
    window.update = function() {
        if (typeof oldUpdate === 'function') oldUpdate();
        
        if (window.matchTimer === 1) window.cr7Balls = [];
        if (window.isCinematicActive) return;

        if (window.cr7Balls && window.cr7Balls.length > 0) {
            window.cr7Balls.forEach(ball => {
                ball.vy += window.GRAVITY || 0.8; 
                ball.x += ball.vx;
                ball.y += ball.vy;
                ball.rotation += ball.vx * 0.05; 

                if (ball.y >= window.GROUND_Y) {
                    ball.y = window.GROUND_Y;
                    ball.vy *= -0.65; 
                    ball.vx *= 0.96; 
                }

                if (ball.x < 40) { ball.x = 40; ball.vx *= -0.8; }
                if (window.canvas && ball.x > window.canvas.width - 40) { ball.x = window.canvas.width - 40; ball.vx *= -0.8; }

                if (!ball.hasHit && Math.abs(ball.vx) > 3) {
                    window.enemies.forEach(target => {
                        if (target.hp > 0 && Math.abs(ball.x - target.x) < 45 && Math.abs(ball.y - target.y) < 65) {
                            ball.hasHit = true;
                            ball.vx *= -0.4; 
                            ball.vy = -6;
                            
                            if (typeof window.takeDamage === 'function') window.takeDamage(target, ball.dmg, ball.isFire ? "#ff4757" : "#fff", true, false);
                            if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);
                            if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, ball.isFire ? "#ff4757" : "#fff", true);
                        }
                    });
                }
            });
        }
    };

    let oldDraw = window.draw;
    window.draw = function() {
        if (typeof oldDraw === 'function') oldDraw();
        
        if (window.cr7Balls && window.cr7Balls.length > 0 && window.ctx && window.canvas) {
            window.ctx.save();
            if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
            window.ctx.scale(window.currentZoom, window.currentZoom); 
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

            window.cr7Balls.forEach(ball => {
                window.ctx.save();
                window.ctx.translate(ball.x, ball.y - ball.radius);
                window.ctx.rotate(ball.rotation);

                if (ball.isFire && !ball.hasHit) {
                    window.ctx.shadowBlur = 15; window.ctx.shadowColor = "#ff4757";
                    window.ctx.fillStyle = "#ff7675";
                } else {
                    window.ctx.shadowBlur = 5; window.ctx.shadowColor = "#000";
                    window.ctx.fillStyle = "#fff"; 
                }

                window.ctx.beginPath(); window.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); 
                window.ctx.fill(); window.ctx.lineWidth = 1.5; window.ctx.strokeStyle = "#111"; window.ctx.stroke();
                
                window.ctx.fillStyle = "#111"; window.ctx.shadowBlur = 0;
                window.ctx.beginPath(); window.ctx.arc(0, 0, ball.radius * 0.4, 0, Math.PI * 2); window.ctx.fill();
                window.ctx.fillRect(-ball.radius*0.8, -1, ball.radius*1.6, 2);
                window.ctx.fillRect(-1, -ball.radius*0.8, 2, ball.radius*1.6);
                
                window.ctx.restore();
            });
            window.ctx.restore();
        }
    };
    window.cr7Hooked = true;
}


// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT MESSI
// ==========================================
window.currentLoadedChar = {
    id: "messi",
    className: "Messi",
    hp: 1000, 
    speed: 9.0, // Chạy và rê bóng cực nhanh
    dmgMod: 1.4, 
    color: "#0984e3", // Xanh dương Argentina
    scale: 0.9, // Trọng tâm thấp, người hơi nhỏ để rê bóng mượt
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=messi&backgroundColor=c7ecee",
    
    // ĐÁNH THƯỜNG: Những cú vẩy chân trái điệu nghệ
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Messi chủ yếu dùng chân trái, combo linh hoạt
        if (caster.comboStep === 0) { caster.state = 'low_kick'; caster.vx = caster.isFacingRight ? 12 : -12; }
        else if (caster.comboStep === 1) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else { caster.state = 'high_kick'; caster.vx = caster.isFacingRight ? 15 : -15; }
        
        caster.attackTimer = 14; // Nhanh hơn CR7 một nhịp
        if (typeof window.playSound === 'function') window.playSound(220, 'square', 0.1, 0.15);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                let damage = 10 * caster.dmgMod;
                if (Math.random() < 0.20) { 
                    damage *= 2;
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💫 KỸ THUẬT!", color: "#0984e3", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#0984e3", false);
            }
        });
    },

    skill: {
        // SKILL 1: Rê bóng ảo diệu (Lướt xuyên người)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; caster.attackTimer = 18;
            caster.vx = caster.isFacingRight ? 35 : -35; // Lướt cực xa
            caster.iFrames = 18; 
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            if(typeof window.playSound === 'function') window.playSound(400, 'sawtooth', 0.1, 0.3);
            
            if(target && Math.abs(target.x - caster.x) < 150) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 25 * caster.dmgMod, "#0984e3", true, false, caster);
                target.hitStun = 20; // Làm đối thủ quay cuồng
            }
        },
        // SKILL 2: Nhảy lên vung chân
        actionCode2: function(caster, target, ctx) {
            caster.state = 'kick'; caster.attackTimer = 22; 
            caster.vy = -14; 
            caster.vx = caster.isFacingRight ? 10 : -10;
            if(typeof window.playSound === 'function') window.playSound(300, 'sine', 0.2, 0.4);
            
            if(target && Math.abs(target.x - caster.x) < 90) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 30 * caster.dmgMod, "#0984e3", false, false, caster);
            }
        }
    },
    
    // ==========================================
    // TUYỆT CHIÊU CỦA MESSI: LÙI LẠI VÀ CỨA LÒNG 1 QUẢ (SÁT THƯƠNG 50%)
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        // Bước 1: Lùi về sau để lấy đà
        caster.state = 'dash_back'; 
        caster.attackTimer = 50; // Tổng thời gian chiêu thức
        caster.vx = caster.isFacingRight ? -18 : 18; // Lướt lùi lại
        
        if (typeof window.playSound === 'function') window.playSound(250, 'sawtooth', 0.2, 0.3);
        if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "⚽ ANKARA MESSI!", color: "#0984e3", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // Bước 2: Sau khi lùi được 250ms, dừng lại và Sút
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            caster.state = 'kick'; // Đổi dáng sút
            caster.vx = 0; // Đứng im sút
            
            if (typeof window.playSound === 'function') window.playSound(180, 'square', 0.2, 0.5, true);
            if (typeof window.shakeScreen === 'function') window.shakeScreen(10, 6);

            // Bắn ra 1 quả bóng xoáy, Sát thương đúng 50%
            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30), 
                y: caster.y - 10,
                vx: caster.isFacingRight ? 35 : -35, // Bay cực nhanh
                vy: -3, // Sút là là mặt cỏ
                radius: 12, 
                isFire: false, // Bóng trắng xoáy
                hasHit: false, 
                dmg: baseDmg * 0.5, // 50% sát thương như yêu cầu
                rotation: 0
            });
        }, 250); 
        
        // Bước 3: Thu thế về trạng thái bình thường
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 600);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT (Áo Sọc Xanh Trắng - Quần Đen)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. ÁO ĐẤU ARGENTINA (Sọc Xanh Nhạt / Trắng)
        ctx.strokeStyle = "#74b9ff"; // Xanh dương nhạt (Argentina)
        ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Vẽ 1 sọc trắng nhỏ dọc giữa thân để tạo hiệu ứng sọc Argentina
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        }

        // Cánh tay áo
        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN ĐEN TẤT TRẮNG
        ctx.strokeStyle = "#111"; // Quần đen
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. ĐẦU VÀ MẶT
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; ctx.fill(); // Da người
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Tóc Messi (Màu nâu, bồng bềnh)
            ctx.fillStyle = "#634731";
            ctx.beginPath();
            ctx.arc(head.x, head.y - 2, 10, Math.PI, 0); 
            ctx.fill();
            
            // Vẽ số 10 ở ngực
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#111"; ctx.font = "bold 11px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("10", midX + (p.isFacingRight ? 3 : -3), midY);
            
            // Giày Vàng (Golden Boots)
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["messi"] = window.currentLoadedChar;
