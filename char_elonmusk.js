window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 6.0, 
    dmgMod: 1.5, 
    color: "#e82127", 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: Ném tiền Dollar xanh lá
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; 
        caster.attackTimer = 18; 
        caster.vx = caster.isFacingRight ? -2 : 2; 
        
        if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.1, 0.2);
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            let dirX = caster.isFacingRight ? 16 : -16;
            // Phóng ra cục tiền
            window.spawnProjectile(caster.x, caster.y - 45, dirX, -2, 8, "#2ecc71", 12 * caster.dmgMod, target);
            if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: caster.x, y: caster.y - 60, text: "$$$", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "bold 14px Arial", life: 20 });
        }
    },

    skill: {
        // SKILL 1: Súng phun lửa Boring Company
        actionCode1: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 35;
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            let dir = caster.isFacingRight ? 1 : -1;
            let fireInt = setInterval(() => {
                if(caster.attackTimer <= 0 || caster.hp <= 0 || window.gameOver) { clearInterval(fireInt); return; }
                if(typeof window.spawnProjectile === 'function') {
                    window.spawnProjectile(caster.x + (30*dir), caster.y - 40, (12 + Math.random()*6)*dir, (Math.random()-0.5)*5, 12, "#e74c3c", 6 * caster.dmgMod, target);
                }
            }, 50);
        },
        // SKILL 2: Bay lên bằng phản lực
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; 
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<15; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true); 
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI CYBERTRUCK TÔNG ĐỊCH (Chậm lại, Đầm hơn)
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; 
        caster.attackTimer = 100; // Elon Musk gồng thế đứng bấm điện thoại trong 1.5 giây
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 CYBERTRUCK GIAO HÀNG!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 80 });
        }

        // KÍCH HOẠT XE TESLA (Gắn thẳng vào nhân vật)
        caster.teslaCar = {
            active: true,
            x: caster.isFacingRight ? caster.x - 450 : caster.x + 450, // Xuất hiện cách 450px đằng sau
            y: window.GROUND_Y || target.y,
            vx: caster.isFacingRight ? 12 : -12, // TỐC ĐỘ CHẬM LẠI RẤT NHIỀU (12 pixel/khung hình) để bạn nhìn rõ
            timer: 0
        };

        // Với tốc độ 12px/frame, xe mất khoảng 600ms (0.6 giây) để đến mặt địch
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            // Va chạm tạo sát thương
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 3.5, "#bdc3c7", true, true, caster);
            
            // Rung màn hình uy lực mạnh
            if(typeof window.shakeScreen === 'function') window.shakeScreen(40, 25);

            // Kẻ địch bị tông bay xa tít
            let knockbackForce = 25; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -15; 
            target.state = 'hit';
            target.stunTimer = 80; 
        }, 600); 
    },
    
    // ===============================================
    // HÀM VẼ (HIỂN THỊ RÕ NÉT VÀ KHÔNG BỊ TÀNG HÌNH)
    // ===============================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. VẼ CHIẾC CYBERTRUCK TO & RÕ NÉT
        if (p.teslaCar && p.teslaCar.active) {
            let car = p.teslaCar;
            
            // [CHÌA KHÓA]: Chỉ cập nhật di chuyển xe nếu đây là lượt vẽ nhân vật CHÍNH (Tránh bị nhân x10 tốc độ bởi hệ thống bóng mờ Trail)
            if (!isTrail) {
                car.x += car.vx;
                car.timer++;
            }

            let dir = car.vx > 0 ? 1 : -1; 
            
            ctx.save();
            ctx.fillStyle = "#95a5a6"; 
            ctx.strokeStyle = "#7f8c8d";
            ctx.lineWidth = 3; 
            
            // Khung xe Cybertruck to hơn
            ctx.beginPath();
            ctx.moveTo(car.x - 90 * dir, car.y - 15); 
            ctx.lineTo(car.x - 90 * dir, car.y - 45); 
            ctx.lineTo(car.x - 20 * dir, car.y - 80); 
            ctx.lineTo(car.x + 80 * dir, car.y - 35); 
            ctx.lineTo(car.x + 95 * dir, car.y - 10); 
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Kính xe cửa sổ
            ctx.fillStyle = "#2c3e50";
            ctx.beginPath();
            ctx.moveTo(car.x - 20 * dir, car.y - 75);
            ctx.lineTo(car.x - 80 * dir, car.y - 45);
            ctx.lineTo(car.x + 50 * dir, car.y - 40);
            ctx.closePath();
            ctx.fill();

            // Bánh xe lăn vòng vòng chậm rãi
            const drawWheel = (wx, wy) => {
                ctx.save(); ctx.translate(wx, wy); 
                ctx.rotate(car.timer * 0.2 * dir); // Xoay mượt mà
                ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#bdc3c7"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke();
                ctx.restore();
            };
            drawWheel(car.x - 55 * dir, car.y - 15); 
            drawWheel(car.x + 55 * dir, car.y - 15);
            
            // Đèn pha Laser gầm đầu xe
            ctx.fillStyle = "#ff4757";
            ctx.shadowBlur = 20; ctx.shadowColor = "#ff4757";
            ctx.fillRect(car.x + (dir > 0 ? 90 : -95), car.y - 30, 6, 12);
            ctx.shadowBlur = 0;
            
            // Hiệu ứng xả khói bụi ở đuôi xe
            if (!isTrail && car.timer % 2 === 0) {
                ctx.fillStyle = "rgba(189, 195, 199, 0.4)";
                ctx.beginPath(); ctx.arc(car.x - 110 * dir, car.y - 5, Math.random()*15+8, 0, Math.PI*2); ctx.fill();
            }

            ctx.restore();

            // Xe biến mất sau khi chạy quá 120 frame (~2 giây)
            if (car.timer > 120) {
                p.teslaCar.active = false;
            }
        }

        // 2. VẼ ELON MUSK BẤM ĐIỆN THOẠI
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        if (!isTrail) {
            ctx.fillStyle = "#34495e"; 
            ctx.fillRect(handR.x - 4, handR.y - 8, 8, 14); // Khung Điện thoại
            ctx.fillStyle = "#2ecc71"; 
            ctx.fillRect(handR.x - 2, handR.y - 6, 4, 8); // Nút điều khiển xanh lá
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
