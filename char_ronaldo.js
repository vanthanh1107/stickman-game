window.currentLoadedChar = {
    id: "ronaldo",
    className: "CR7 - The GOAT",
    hp: 1100, 
    speed: 8.0, // Tốc độ chạy rất nhanh của cầu thủ
    dmgMod: 1.3, 
    color: "#e74c3c", // Đỏ cờ Bồ Đào Nha
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=ronaldo&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: CHỈ DÙNG CHÂN (COMBO 3 NHỊP ĐÁ)
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Chuỗi combo toàn bằng chân
        if (caster.comboStep === 0) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 8 : -8; }
        else if (caster.comboStep === 1) { caster.state = 'low_kick'; caster.vx = caster.isFacingRight ? 12 : -12; }
        else { caster.state = 'spinning_heel'; caster.vx = caster.isFacingRight ? 16 : -16; } // Xoay gót đá chốt
        
        caster.attackTimer = 16; 
        if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.1, 0.2);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) { // Tầm chân dài
                let dmg = 12 * caster.dmgMod;
                if (Math.random() < 0.3) { // 30% Chí mạng (Bản năng sát thủ)
                    dmg *= 2.0;
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💥 CRITICAL!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, dmg, "#e74c3c", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#fff", false);
            }
        });
    },

    skill: {
        // SKILL 1: Lướt xoạc bóng (Sliding Tackle)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash_back'; // Dùng dáng này chế lại thành xoạc bóng
            caster.attackTimer = 22;
            caster.vx = caster.isFacingRight ? 25 : -25; // Trượt cực nhanh trên cỏ
            caster.vy = 2; // Ép sát đất
            caster.iFrames = 20; // Bất tử khi xoạc
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            
            if(target && Math.abs(target.x - caster.x) < 120) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#fff", true, false, caster);
                target.vy = -12; // Hất tung địch lên
            }
        },
        // SKILL 2: Ngả bàn đèn (Bicycle Kick)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'high_kick'; 
            caster.attackTimer = 30; 
            caster.vy = -18; // Nhảy ngược lên
            caster.vx = caster.isFacingRight ? 8 : -8;
            if(typeof window.playSound === 'function') window.playSound(350, 'sine', 0.2, 0.4);
            
            if(target && Math.abs(target.x - caster.x) < 100) {
                target.vy = -15; // Địch cũng bị đá bay lên trời
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 35 * caster.dmgMod, "#e74c3c", true, false, caster);
            }
        }
    },
    
    // TUYỆT CHIÊU: SÚT 2 QUẢ BÓNG SIÊU LỰC (Bóng nằm lại vĩnh viễn trên sân)
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'kick'; 
        caster.attackTimer = 60; // Pose dáng sút
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "⚽ SIUUUUUU!", color: "#f1c40f", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // Tạo kho chứa bóng vật lý riêng cho CR7 nếu chưa có
        if (!caster.soccerBalls) caster.soccerBalls = [];

        let shootBall = (delay, speed, arc, isFire) => {
            setTimeout(() => {
                if (window.gameOver || caster.hp <= 0) return;
                
                if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.2, 0.6, true);
                if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);

                // Thêm bóng vào hệ thống vật lý riêng
                caster.soccerBalls.push({
                    x: caster.x + (caster.isFacingRight ? 30 : -30),
                    y: caster.y,
                    vx: caster.isFacingRight ? speed : -speed,
                    vy: arc, // Độ bổng của quả bóng
                    radius: 12,
                    isFire: isFire,
                    hasHit: false, // Để chỉ gây sát thương 1 lần
                    dmg: baseDmg * 1.5,
                    rotation: 0
                });
            }, delay);
        };

        // Quả 1: Sút sệt cực căng
        shootBall(100, 25, -2, false);
        
        // Quả 2: Sút bổng rực lửa (Đổi dáng chân)
        setTimeout(() => { caster.state = 'high_kick'; caster.attackTimer = 30; }, 350);
        shootBall(400, 28, -10, true);
    },
    
    // VẼ NHÂN VẬT VÀ TÍNH TOÁN BÓNG VẬT LÝ TRÊN SÂN
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        // ==========================================
        // 1. XỬ LÝ VÀ VẼ CÁC QUẢ BÓNG ĐÁ (Chỉ xử lý ở bản vẽ chính, không chạy ở bóng mờ)
        // ==========================================
        if (p.soccerBalls && !isTrail) {
            p.soccerBalls.forEach(ball => {
                // Vật lý rơi tự do
                ball.vy += window.GRAVITY || 0.8;
                ball.x += ball.vx;
                ball.y += ball.vy;
                ball.rotation += ball.vx * 0.1; // Bóng lăn

                // Xử lý nảy trên mặt đất
                if (ball.y >= window.GROUND_Y) {
                    ball.y = window.GROUND_Y;
                    ball.vy *= -0.6; // Nảy lên với 60% lực
                    ball.vx *= 0.95; // Lăn chậm dần do ma sát cỏ
                }

                // Xử lý va chạm với kẻ địch (Chỉ nổ sát thương 1 lần)
                if (!ball.hasHit && window.enemies && window.enemies.length > 0) {
                    let target = window.enemies[0]; // Nhắm vào địch
                    if (target.hp > 0 && Math.abs(ball.x - target.x) < 40 && Math.abs(ball.y - target.y) < 60) {
                        ball.hasHit = true; // Đánh dấu đã nổ
                        ball.vx *= -0.5; // Bật ngược lại một chút
                        
                        if (typeof window.takeDamage === 'function') window.takeDamage(target, ball.dmg, "#f1c40f", true, false, p);
                        if (typeof window.shakeScreen === 'function') window.shakeScreen(20, 15);
                        
                        // Hiệu ứng lưới tung
                        if (typeof window.spawnParticles === 'function') {
                            for(let i=0; i<15; i++) window.spawnParticles(target.x, target.y - 20, ball.isFire ? "#ff4757" : "#fff", true);
                        }
                    }
                }

                // Vẽ quả bóng đá
                ctx.save();
                ctx.translate(ball.x, ball.y - ball.radius);
                ctx.rotate(ball.rotation);

                // Hiệu ứng lửa cho quả bóng sút sau
                if (ball.isFire && !ball.hasHit) {
                    ctx.shadowBlur = 20; ctx.shadowColor = "#ff4757";
                    ctx.fillStyle = "#ff7675";
                } else {
                    ctx.fillStyle = "#fff"; // Bóng trắng
                }

                // Hình tròn bóng
                ctx.beginPath(); ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); 
                ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "#111"; ctx.stroke();
                
                // Múi lục giác trên bóng đá
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(0, 0, ball.radius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.fillRect(-ball.radius*0.8, -1, ball.radius*1.6, 2);
                ctx.fillRect(-1, -ball.radius*0.8, 2, ball.radius*1.6);
                
                ctx.restore();
            });
        }

        // ==========================================
        // 2. VẼ NHÂN VẬT RONALDO Y CHANG ĐỜI THẬT
        // ==========================================
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;

        // Vẽ ÁO ĐẤU BỒ ĐÀO NHA (Jersey đỏ)
        if (!isTrail) {
            ctx.fillStyle = "#e74c3c"; // Đỏ
            ctx.beginPath();
            ctx.moveTo(neck.x - 12, neck.y); ctx.lineTo(neck.x + 12, neck.y);
            ctx.lineTo(pelvis.x + 10, pelvis.y); ctx.lineTo(pelvis.x - 10, pelvis.y);
            ctx.closePath(); ctx.fill();

            // SỐ 7 HUYỀN THOẠI TRƯỚC NGỰC
            ctx.fillStyle = "#f1c40f"; // Màu vàng
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("7", pelvis.x, neck.y + 18);
            
            // Quần đùi xanh lá cây đậm
            ctx.fillStyle = "#27ae60"; 
            ctx.fillRect(pelvis.x - 10, pelvis.y - 2, 20, 15);
        }

        // Cổ và tay chân
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
        
        // Vẽ Giày đá bóng (Cleats) phát sáng neon ở chân
        if (!isTrail) {
            let dir = p.isFacingRight ? 1 : -1;
            ctx.fillStyle = "#00d2d3"; // Giày màu xanh neon
            ctx.fillRect(footL.x - 5, footL.y - 4, 12, 6);
            ctx.fillRect(footR.x - 5, footR.y - 4, 12, 6);
        }

        // Tay vung tự nhiên (Không dùng tay đánh)
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ Đầu
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#ffeaa7"; ctx.fill(); ctx.stroke(); 
        
        // Vẽ Tóc vuốt keo (Fade haircut) đặc trưng của CR7
        if (!isTrail) {
            ctx.fillStyle = "#111"; // Tóc đen
            ctx.beginPath();
            ctx.moveTo(head.x - 10, head.y); // Nửa đầu
            ctx.lineTo(head.x - 8, head.y - 12); 
            ctx.lineTo(head.x + 2, head.y - 14); // Đỉnh nhọn vuốt chéo
            ctx.lineTo(head.x + 10, head.y - 4); 
            ctx.closePath(); ctx.fill();
            
            // Một chút đường cạo (Line) ở bên hông tóc
            ctx.strokeStyle = "#ffeaa7"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(head.x - 5, head.y - 6); ctx.lineTo(head.x - 1, head.y - 8); ctx.stroke();
        }
    }
};

// Đăng ký nhân vật vào danh sách
if (!window.classStats) window.classStats = {};
window.classStats["ronaldo"] = window.currentLoadedChar;
