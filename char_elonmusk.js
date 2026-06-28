window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 6.0, 
    dmgMod: 1.5, 
    color: "#e82127", 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: Dùng từ khóa 'punch' của Engine + Bắn đạn tiền
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; 
        caster.attackTimer = 18; 
        caster.vx = caster.isFacingRight ? -2 : 2; // Giật lùi
        
        if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.1, 0.2);
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            let dirX = caster.isFacingRight ? 16 : -16;
            // Cục đạn màu xanh lá tượng trưng cho cọc tiền (có rớt trọng lực vy = -2)
            window.spawnProjectile(caster.x, caster.y - 45, dirX, -2, 8, "#2ecc71", 12 * caster.dmgMod, target);
            if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: caster.x, y: caster.y - 60, text: "$$$", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "bold 14px Arial", life: 20 });
        }
    },

    skill: {
        // SKILL 1: Súng phun lửa (Dùng từ khóa 'punch')
        actionCode1: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 35;
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            let dir = caster.isFacingRight ? 1 : -1;
            let fireInt = setInterval(() => {
                if(caster.attackTimer <= 0 || caster.hp <= 0) { clearInterval(fireInt); return; }
                if(typeof window.spawnProjectile === 'function') {
                    // Bắn hạt lửa sát thương nhỏ nhưng nhiều
                    window.spawnProjectile(caster.x + (30*dir), caster.y - 40, (12 + Math.random()*6)*dir, (Math.random()-0.5)*5, 12, "#e74c3c", 6 * caster.dmgMod, target);
                }
            }, 50);
        },
        // SKILL 2: Bay lên bằng phản lực
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; // Bay vút lên trời
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<15; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true); 
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI CYBERTRUCK TÔNG ĐỊCH (Dùng từ khóa 'punch')
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; // Bắt buộc dùng chữ punch để Engine lưu bóng mờ chuẩn
        caster.attackTimer = 50; 
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 CYBERTRUCK GIAO HÀNG!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // TẠO THỰC THỂ XE ĐỘC LẬP BẰNG OBJECT RIÊNG (Không gắn vào caster nữa để tránh bị Engine nhân bản bóng mờ)
        let carObj = {
            active: true,
            x: caster.isFacingRight ? caster.x - 500 : caster.x + 500, // Xuất hiện cách 500px
            y: window.GROUND_Y || target.y, // Canh xe chạy ngang mặt đất
            vx: caster.isFacingRight ? 22 : -22, // Tốc độ chạy 22 pixel/frame (Rất đầm)
            timer: 0
        };

        // Hàm setInterval tự vẽ và di chuyển xe độc lập
        let carInt = setInterval(() => {
            if(window.gameOver) { clearInterval(carInt); return; }
            
            carObj.x += carObj.vx;
            carObj.timer++;

            // Vẽ xe trực tiếp lên màn hình
            let ctx = document.querySelector("canvas").getContext("2d");
            if (ctx) {
                let dir = carObj.vx > 0 ? 1 : -1; 
                ctx.save();
                
                // Khung xe Cybertruck góc cạnh
                ctx.fillStyle = "#95a5a6"; ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(carObj.x - 70 * dir, carObj.y - 15); 
                ctx.lineTo(carObj.x - 70 * dir, carObj.y - 35); 
                ctx.lineTo(carObj.x - 10 * dir, carObj.y - 65); 
                ctx.lineTo(carObj.x + 60 * dir, carObj.y - 25); 
                ctx.lineTo(carObj.x + 75 * dir, carObj.y - 10); 
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Kính xe đen ngòm
                ctx.fillStyle = "#2c3e50";
                ctx.beginPath();
                ctx.moveTo(carObj.x - 10 * dir, carObj.y - 62);
                ctx.lineTo(carObj.x - 60 * dir, carObj.y - 38);
                ctx.lineTo(carObj.x + 40 * dir, carObj.y - 32);
                ctx.closePath(); ctx.fill();

                // Bánh xe tự động xoay
                const drawWheel = (wx, wy) => {
                    ctx.save(); ctx.translate(wx, wy); ctx.rotate(carObj.timer * 0.5 * dir); 
                    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#bdc3c7"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
                    ctx.restore();
                };
                drawWheel(carObj.x - 45 * dir, carObj.y - 15); drawWheel(carObj.x + 45 * dir, carObj.y - 15);
                
                // Đèn hậu Laser
                ctx.fillStyle = "#ff4757"; ctx.fillRect(carObj.x + (dir > 0 ? 70 : -75), carObj.y - 25, 5, 8);
                ctx.restore();
            }

            // Xóa bộ đếm xe khi nó vượt ra ngoài màn hình (sau 60 frame)
            if (carObj.timer > 60) {
                clearInterval(carInt);
            }
        }, 16); // Chạy 60 khung hình/giây

        // Canh chuẩn 300ms sau là xe đụng mặt kẻ địch
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            // Tông sát thương
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 3.5, "#bdc3c7", true, true, caster);
            
            // Rung màn hình
            if(typeof window.shakeScreen === 'function') window.shakeScreen(30, 20);

            // Hất văng (Knockback cực mạnh)
            let knockbackForce = 25; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -15; 
            target.state = 'hit';
            target.stunTimer = 60; 
        }, 300); 
    },
    
    // VẼ NHÂN VẬT ELON MUSK (Stickman gốc cực mượt)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Trên tay Elon Musk cầm chiếc Điện thoại điều khiển từ xa
        if (!isTrail) {
            ctx.fillStyle = "#34495e"; 
            ctx.fillRect(handR.x - 4, handR.y - 8, 8, 14); // Khung điện thoại
            ctx.fillStyle = "#2ecc71"; 
            ctx.fillRect(handR.x - 2, handR.y - 6, 4, 8); // Màn hình xanh lá
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
