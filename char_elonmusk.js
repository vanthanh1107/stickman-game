window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 5.5, 
    dmgMod: 1.5, 
    color: "#e82127", 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    
    // ĐÁNH THƯỜNG: Ném từng cọc tiền Dollar xanh lá
    executeBasicAttack: function(caster, enemies) {
        caster.state = 'punch'; 
        caster.attackTimer = 18; 
        caster.vx = caster.isFacingRight ? -2 : 2; // Ném tiền xong lùi lại
        
        if (typeof window.spawnProjectile === 'function') {
            let target = enemies[0];
            let dirX = caster.isFacingRight ? 15 : -15;
            // Cục đạn màu xanh lá (tiền)
            window.spawnProjectile(caster.x, caster.y - 45, dirX, -2, 8, "#2ecc71", 12 * caster.dmgMod, target);
            if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: caster.x, y: caster.y - 60, text: "$$$", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "bold 14px Arial", life: 20 });
        }
    },

    skill: {
        // SKILL 1: Súng phun lửa (Boring Company Flamethrower)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'cast'; caster.attackTimer = 35;
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            let dir = caster.isFacingRight ? 1 : -1;
            // Xả ra hàng loạt hạt lửa liên tiếp
            let fireInt = setInterval(() => {
                if(caster.attackTimer <= 0 || caster.hp <= 0) { clearInterval(fireInt); return; }
                if(typeof window.spawnProjectile === 'function') {
                    window.spawnProjectile(caster.x + (30*dir), caster.y - 40, (10 + Math.random()*5)*dir, (Math.random()-0.5)*4, 12, "#e74c3c", 5 * caster.dmgMod, target);
                }
            }, 50);
        },
        // SKILL 2: Bay lên bằng tên lửa SpaceX
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; // Bay vút lên trời
            caster.vx = caster.isFacingRight ? 10 : -10;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<10; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true);
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI XE CYBERTRUCK TÔNG ĐỊCH
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'summon_tesla'; 
        caster.attackTimer = 60; // Gồng trong 1 giây
        caster.vx = 0; 
        
        // Hiện chữ cảnh báo
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 CYBERTRUCK GIAO HÀNG!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // Khởi tạo xe Tesla
        caster.teslaCar = {
            active: true,
            x: caster.isFacingRight ? caster.x - 450 : caster.x + 450, // Cự ly vừa phải để nhìn thấy xe chạy vào
            y: window.GROUND_Y || target.y, // Cố định xe dưới mặt đất
            vx: caster.isFacingRight ? 28 : -28, // Tốc độ vừa đủ nhanh nhưng mắt vẫn nhìn rõ
            timer: 0
        };

        // Thời gian để xe đụng mục tiêu với vx = 28
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            // Sát thương
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 3.5, "#bdc3c7", true, true, caster);

            // Rung màn hình cực mạnh
            if(typeof window.shakeScreen === 'function') window.shakeScreen(30, 20);

            // Hất văng (Knockback cực mạnh)
            let knockbackForce = 25; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -12; 
            target.state = 'hit';
            target.stunTimer = 60; 
            
        }, 300); // Khớp chuẩn thời gian xe chạm mặt
    },
    
    // VẼ NHÂN VẬT & CHIẾC XE
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // --- 1. VẼ CHIẾC CYBERTRUCK NẾU ĐANG GỌI CHIÊU ---
        if (p.teslaCar && p.teslaCar.active && !isTrail) {
            let car = p.teslaCar;
            car.x += car.vx; 
            car.timer++;

            let dir = car.vx > 0 ? 1 : -1; 

            ctx.save();
            
            // Khung xe kim loại góc cạnh
            ctx.fillStyle = "#95a5a6"; 
            ctx.strokeStyle = "#7f8c8d";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(car.x - 70 * dir, car.y - 15); 
            ctx.lineTo(car.x - 70 * dir, car.y - 35); 
            ctx.lineTo(car.x - 10 * dir, car.y - 65); // Nóc tam giác
            ctx.lineTo(car.x + 60 * dir, car.y - 25); 
            ctx.lineTo(car.x + 75 * dir, car.y - 10); 
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Kính xe vác chéo
            ctx.fillStyle = "#2c3e50";
            ctx.beginPath();
            ctx.moveTo(car.x - 10 * dir, car.y - 62);
            ctx.lineTo(car.x - 60 * dir, car.y - 38);
            ctx.lineTo(car.x + 40 * dir, car.y - 32);
            ctx.closePath();
            ctx.fill();

            // Hàm vẽ bánh xe (có hoạt ảnh xoay mâm xe)
            const drawWheel = (wx, wy) => {
                ctx.save();
                ctx.translate(wx, wy);
                ctx.rotate(car.timer * 0.5 * dir); // Mâm xe xoay tít thò lò
                // Lốp xe
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
                // Mâm xe
                ctx.fillStyle = "#bdc3c7";
                ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
                // Chấu xe (Spokes)
                ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
                ctx.restore();
            };

            // Gắn 2 bánh xe vào thân
            drawWheel(car.x - 45 * dir, car.y - 15);
            drawWheel(car.x + 45 * dir, car.y - 15);
            
            // Đèn pha Laser đỏ phía trước mui xe
            ctx.fillStyle = "#ff4757";
            ctx.shadowBlur = 15; ctx.shadowColor = "#ff4757";
            ctx.fillRect(car.x + (dir > 0 ? 70 : -75), car.y - 25, 5, 8);
            ctx.shadowBlur = 0;

            ctx.restore();

            // Xóa xe khi chạy ra ngoài màn hình (80 frame ~ 1.3 giây)
            if (car.timer > 80) p.teslaCar.active = false;
        }

        // --- 2. VẼ NHÂN VẬT ELON MUSK MẶC VEST ĐEN ---
        ctx.strokeStyle = "#111"; // Áo đen
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#2f3640"; // Quần xám tối
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Đầu Elon (màu da người)
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        // Kính mát (Thug life)
        if (!isTrail) {
            ctx.fillStyle = "#111";
            ctx.fillRect(p.isFacingRight ? head.x : head.x - 8, head.y - 3, 8, 4);
        }

        // Cầm Remote điều khiển trên tay phải
        if (p.state === 'summon_tesla') {
            ctx.fillStyle = "#2d3436"; ctx.fillRect(handR.x - 4, handR.y - 6, 8, 12);
            ctx.fillStyle = "#e82127"; ctx.beginPath(); ctx.arc(handR.x, handR.y - 2, 2, 0, Math.PI*2); ctx.fill(); // Nút đỏ
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
