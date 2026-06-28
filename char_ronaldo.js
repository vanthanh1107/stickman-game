// KHỞI TẠO KHO CHỨA BÓNG VĨNH CỬU CHO CR7
if (!window.cr7Balls) window.cr7Balls = [];

// ==========================================
// [HACK ENGINE] TÍCH HỢP BÓNG VẬT LÝ VÀO GAME LOOP
// ==========================================
if (!window.cr7Hooked) {
    let oldUpdate = window.update;
    window.update = function() {
        if (typeof oldUpdate === 'function') oldUpdate();
        
        // Reset bóng khi bắt đầu trận mới
        if (window.matchTimer === 1) window.cr7Balls = [];

        // Nếu Time Stop đang bật thì bóng dừng lại
        if (window.isCinematicActive) return;

        // Tính toán vật lý cho từng quả bóng trên sân
        if (window.cr7Balls && window.cr7Balls.length > 0) {
            window.cr7Balls.forEach(ball => {
                ball.vy += window.GRAVITY || 0.8; // Trọng lực rơi
                ball.x += ball.vx;
                ball.y += ball.vy;
                ball.rotation += ball.vx * 0.05; // Lăn tròn

                // Nảy trên mặt đất
                if (ball.y >= window.GROUND_Y) {
                    ball.y = window.GROUND_Y;
                    ball.vy *= -0.65; // Lực nảy
                    ball.vx *= 0.96; // Lực ma sát cỏ (lăn chậm dần)
                }

                // Dội tường trái phải
                if (ball.x < 40) { ball.x = 40; ball.vx *= -0.8; }
                if (window.canvas && ball.x > window.canvas.width - 40) { ball.x = window.canvas.width - 40; ball.vx *= -0.8; }

                // Gây sát thương nổ (CHỈ 1 LẦN DUY NHẤT VÀO MẶT ĐỊCH)
                if (!ball.hasHit && Math.abs(ball.vx) > 3) {
                    window.enemies.forEach(target => {
                        if (target.hp > 0 && Math.abs(ball.x - target.x) < 45 && Math.abs(ball.y - target.y) < 65) {
                            ball.hasHit = true;
                            ball.vx *= -0.4; // Bóng dội ngược lại sau khi đập mặt
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
        
        // Vẽ những quả bóng bám chặt vào không gian thế giới thật
        if (window.cr7Balls && window.cr7Balls.length > 0 && window.ctx && window.canvas) {
            window.ctx.save();
            // Khớp tọa độ Camera của Engine
            if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
            window.ctx.scale(window.currentZoom, window.currentZoom); 
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

            // Bắt đầu vẽ bóng
            window.cr7Balls.forEach(ball => {
                window.ctx.save();
                window.ctx.translate(ball.x, ball.y - ball.radius);
                window.ctx.rotate(ball.rotation);

                // Bóng lửa bốc cháy
                if (ball.isFire && !ball.hasHit) {
                    window.ctx.shadowBlur = 15; window.ctx.shadowColor = "#ff4757";
                    window.ctx.fillStyle = "#ff7675";
                } else {
                    window.ctx.shadowBlur = 5; window.ctx.shadowColor = "#000";
                    window.ctx.fillStyle = "#fff"; // Bóng trắng
                }

                // Hình tròn quả bóng
                window.ctx.beginPath(); window.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); 
                window.ctx.fill(); window.ctx.lineWidth = 1.5; window.ctx.strokeStyle = "#111"; window.ctx.stroke();
                
                // Múi lục giác trên bóng đá
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
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT CR7
// ==========================================
window.currentLoadedChar = {
    id: "ronaldo",
    className: "CR7",
    hp: 1100, 
    speed: 8.5, // Chạy cực nhanh
    dmgMod: 1.3, 
    color: "#e74c3c", 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=ronaldo&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: Chỉ sử dụng chân, vung chân cực mượt
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Chuỗi 3 đòn chân uy lực
        if (caster.comboStep === 0) { caster.state = 'low_kick'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else if (caster.comboStep === 1) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 14 : -14; }
        else { caster.state = 'high_kick'; caster.vx = caster.isFacingRight ? 18 : -18; }
        
        caster.attackTimer = 16; 
        if (typeof window.playSound === 'function') window.playSound(250, 'square', 0.1, 0.2);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                let damage = 12 * caster.dmgMod;
                if (Math.random() < 0.25) { 
                    damage *= 2;
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💥 SÁT THỦ!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#e74c3c", false);
            }
        });
    },

    skill: {
        // SKILL 1: Xoạc bóng cực mạnh (Dùng dáng dash gập người)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 22;
            caster.vx = caster.isFacingRight ? 28 : -28; // Trượt siêu nhanh
            caster.iFrames = 20; 
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            if(typeof window.playSound === 'function') window.playSound(300, 'sawtooth', 0.2, 0.5);
            
            if(target && Math.abs(target.x - caster.x) < 120) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 25 * caster.dmgMod, "#fff", true, false, caster);
                target.vy = -12; // Xoạc địch bay lên không trung
                target.state = 'hurt';
            }
        },
        // SKILL 2: Ngả bàn đèn (Bicycle Kick)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'high_kick'; caster.attackTimer = 25; 
            caster.vy = -18; // Bay lên không trung
            caster.vx = caster.isFacingRight ? 8 : -8;
            if(typeof window.playSound === 'function') window.playSound(350, 'sine', 0.2, 0.4);
            
            if(target && Math.abs(target.x - caster.x) < 100) {
                target.vy = -16; 
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 35 * caster.dmgMod, "#e74c3c", true, false, caster);
            }
        }
    },
    
    // TUYỆT CHIÊU: SÚT 2 QUẢ BÓNG BAY TỚI TẤP (BÓNG NẰM LẠI TRÊN SÂN)
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'kick'; // Gồng dáng sút bóng
        caster.attackTimer = 60; 
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "⚽ SIUUUUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 26px Arial", life: 60 });
        }

        // Quả bóng 1: Sút sệt căng ngang
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            if (typeof window.playSound === 'function') window.playSound(150, 'square', 0.2, 0.6, true);
            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30), y: caster.y,
                vx: caster.isFacingRight ? 32 : -32, vy: -2, 
                radius: 12, isFire: false, hasHit: false, dmg: baseDmg * 1.5, rotation: 0
            });
        }, 100);
        
        // Đổi tư thế sút cho sinh động
        setTimeout(() => { caster.state = 'high_kick'; caster.attackTimer = 30; }, 300);

        // Quả bóng 2: Sút bổng rực lửa Knuckleball
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.3, 0.8, true);
            if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);
            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 30 : -30), y: caster.y - 20,
                vx: caster.isFacingRight ? 38 : -38, vy: -6, 
                radius: 14, isFire: true, hasHit: false, dmg: baseDmg * 2.0, rotation: 0
            });
        }, 350);
    },
    
    // ==========================================
    // VẼ STICKMAN THEO MÀU ÁO ĐẤU BỒ ĐÀO NHA (Tinh gọn, mượt mà)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. ÁO ĐẤU BỒ ĐÀO NHA (Cổ tới hông và cánh tay MÀU ĐỎ)
        ctx.strokeStyle = "#e74c3c"; 
        ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN & TẤT (Hông tới chân MÀU XANH LÁ)
        ctx.strokeStyle = "#27ae60"; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. ĐẦU (Da người và tóc)
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; ctx.fill(); // Da người
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); // Viền đen đầu
        
        if (!isTrail) {
            // Vẽ Tóc Cạo Gọn (Fade)
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(head.x, head.y, 10, Math.PI, 0); // Bao quanh nửa trên đầu
            ctx.fill();
            // Vuốt keo chéo đỉnh đầu
            ctx.beginPath(); ctx.moveTo(head.x + 8, head.y - 4); ctx.lineTo(head.x + 12, head.y - 12); ctx.lineTo(head.x + 4, head.y - 10); ctx.fill();

            // Số 7 Huyền Thoại Giữa Ngực Áo
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#f1c40f"; ctx.font = "bold 12px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("7", midX + (p.isFacingRight ? 3 : -3), midY);
            
            // Giày đá bóng (Cleats) Xanh Neon ở điểm bàn chân
            ctx.fillStyle = "#00d2d3";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["ronaldo"] = window.currentLoadedChar;
