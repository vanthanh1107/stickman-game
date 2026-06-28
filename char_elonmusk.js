window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 6.0, 
    dmgMod: 1.5, 
    color: "#e82127", 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: Ném tiền Dollar
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; 
        caster.attackTimer = 16; 
        caster.vx = caster.isFacingRight ? -2 : 2; // Ném xong lùi lại nhẹ nhàng
        
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            let dirX = caster.isFacingRight ? 16 : -16;
            // Cục đạn màu xanh lá tượng trưng cho cọc tiền
            window.spawnProjectile(caster.x, caster.y - 45, dirX, -2, 8, "#2ecc71", 12 * caster.dmgMod, target);
            if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: caster.x, y: caster.y - 60, text: "$$$", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "bold 14px Arial", life: 20 });
        }
    },

    skill: {
        // SKILL 1: Súng phun lửa (Boring Company)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'punch'; caster.attackTimer = 35;
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            let dir = caster.isFacingRight ? 1 : -1;
            // Xả ra hàng loạt hạt lửa liên tiếp bằng setInterval
            let fireInt = setInterval(() => {
                if(caster.attackTimer <= 0 || caster.hp <= 0) { clearInterval(fireInt); return; }
                if(typeof window.spawnProjectile === 'function') {
                    window.spawnProjectile(caster.x + (30*dir), caster.y - 40, (12 + Math.random()*6)*dir, (Math.random()-0.5)*5, 12, "#e74c3c", 6 * caster.dmgMod, target);
                }
            }, 50);
        },
        // SKILL 2: Phản lực tên lửa SpaceX bay lên không trung
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; // Bay vút lên trời
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<15; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true); // Lửa đẩy dưới chân
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI CYBERTRUCK TÔNG ĐỊCH
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'summon_tesla'; 
        caster.attackTimer = 50; 
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 CYBERTRUCK TỚI ĐÂY!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // BẢN VÁ LỖI: Dùng Time-based (Thời gian thực) thay vì vận tốc Frame
        caster.teslaCar = {
            active: true,
            startX: caster.isFacingRight ? caster.x - 500 : caster.x + 500, // Xe xuất hiện cách 500px
            y: caster.y, // Canh xe chạy ngang chân Elon Musk
            vx: caster.isFacingRight ? 1500 : -1500, // Tốc độ chạy: 1500 Pixel trên Giây
            startTime: Date.now(),
            duration: 1500 // Thời gian tồn tại của xe: 1.5 giây
        };

        // Canh chuẩn 300ms sau là xe đụng mặt kẻ địch
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            // Sát thương
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
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // ===============================================
        // 1. VẼ CYBERTRUCK BẰNG THỜI GIAN THỰC (CHỐNG LỖI TÀNG HÌNH)
        // ===============================================
        if (p.teslaCar && p.teslaCar.active) {
            let car = p.teslaCar;
            // Tính số giây đã trôi qua kể từ lúc tung chiêu
            let elapsed = (Date.now() - car.startTime) / 1000; 
            
            if (elapsed > car.duration / 1000) {
                car.active = false;
            } else {
                // Tọa độ Hiện tại = Tọa độ Gốc + (Vận tốc * Thời gian)
                let currentX = car.startX + (car.vx * elapsed);
                let dir = car.vx > 0 ? 1 : -1; 
                
                ctx.save();
                ctx.fillStyle = "#95a5a6"; 
                ctx.strokeStyle = "#7f8c8d";
                ctx.lineWidth = 2;
                
                // Khung xe góc cạnh
                ctx.beginPath();
                ctx.moveTo(currentX - 70 * dir, car.y - 15); 
                ctx.lineTo(currentX - 70 * dir, car.y - 35); 
                ctx.lineTo(currentX - 10 * dir, car.y - 65); // Chóp nhọn
                ctx.lineTo(currentX + 60 * dir, car.y - 25); 
                ctx.lineTo(currentX + 75 * dir, car.y - 10); 
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Kính xe đen ngòm
                ctx.fillStyle = "#2c3e50";
                ctx.beginPath();
                ctx.moveTo(currentX - 10 * dir, car.y - 62);
                ctx.lineTo(currentX - 60 * dir, car.y - 38);
                ctx.lineTo(currentX + 40 * dir, car.y - 32);
                ctx.closePath();
                ctx.fill();

                // Bánh xe tự động xoay
                const drawWheel = (wx, wy) => {
                    ctx.save(); ctx.translate(wx, wy);
                    ctx.rotate(elapsed * 20 * dir); // Càng đi lâu bánh càng xoay tít
                    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#bdc3c7"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
                    ctx.restore();
                };

                drawWheel(currentX - 45 * dir, car.y - 15);
                drawWheel(currentX + 45 * dir, car.y - 15);
                
                // Đèn hậu Laser
                ctx.fillStyle = "#ff4757";
                ctx.shadowBlur = 15; ctx.shadowColor = "#ff4757";
                ctx.fillRect(currentX + (dir > 0 ? 70 : -75), car.y - 25, 5, 8);
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        // ===============================================
        // 2. VẼ NHÂN VẬT ELON MUSK (CHUẨN STICKMAN CỦA BẠN)
        // ===============================================
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Trên tay Elon Musk cầm chiếc Điện thoại điều khiển từ xa
        if (!isTrail && (p.state === 'summon_tesla' || p.state === 'punch')) {
            ctx.fillStyle = "#34495e"; 
            ctx.fillRect(handR.x - 4, handR.y - 8, 8, 14); // Khung điện thoại
            ctx.fillStyle = "#2ecc71"; 
            ctx.fillRect(handR.x - 2, handR.y - 6, 4, 8); // Màn hình sáng
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
