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
        // SKILL 2: Phản lực SpaceX bay lên trời
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; 
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<15; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true); 
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI CYBERTRUCK TÔNG ĐỊCH (BẢN FIX CỐ ĐỊNH TỐC ĐỘ CHẬM)
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; 
        caster.attackTimer = 120; // Giữ Elon đứng im gồng chiêu lâu hơn
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 TESLA CYBERTRUCK TỚI!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 80 });
        }

        // KHỞI TẠO THÔNG SỐ XE CHẠY CHẬM VÀ ĐẦM
        caster.teslaCar = {
            active: true,
            // Cho xe xuất hiện ngay gần sau lưng Elon để đỡ tốn thời gian lướt vào
            x: caster.isFacingRight ? caster.x - 200 : caster.x + 200, 
            y: window.GROUND_Y,
            vx: caster.isFacingRight ? 6 : -6, // TỐC ĐỘ SIÊU CHẬM (6px/frame) giúp nhìn rõ mồn một chiếc xe
            timer: 0
        };

        // Xe chạy chậm nên tăng thời gian delay nổ sát thương lên 900ms (0.9 giây) để khớp với đồ họa
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 3.5, "#bdc3c7", true, true, caster);
            if(typeof window.shakeScreen === 'function') window.shakeScreen(40, 25);

            let knockbackForce = 25; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -15; 
            target.state = 'hit';
            target.stunTimer = 80; 
        }, 900); 
    },
    
    // =======================================================
    // HÀM VẼ: FIX LỖI TÀNG HÌNH BÁNH XE VÀ MẤT NÉT KHUNG HÌNH
    // =======================================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. VẼ CHIẾC CYBERTRUCK ĐỘC LẬP HOÀN TOÀN
        if (p.teslaCar && p.teslaCar.active) {
            let car = p.teslaCar;
            
            // CHỈ cập nhật vị trí xe nếu đây là lượt vẽ chính, không cập nhật khi vẽ bóng mờ Trail
            if (!isTrail) {
                car.x += car.vx;
                car.timer++;
            }

            let dir = car.vx > 0 ? 1 : -1; 
            
            ctx.save();
            ctx.globalAlpha = isTrail ? 0.2 : 1.0; // Nếu là bóng mờ thì mờ hẳn đi, xe chính nét căng
            ctx.fillStyle = "#95a5a6"; 
            ctx.strokeStyle = "#7f8c8d";
            ctx.lineWidth = 3; 
            
            // Thân xe Cybertruck khổng lồ
            ctx.beginPath();
            ctx.moveTo(car.x - 90 * dir, car.y - 15); 
            ctx.lineTo(car.x - 90 * dir, car.y - 45); 
            ctx.lineTo(car.x - 20 * dir, car.y - 80); 
            ctx.lineTo(car.x + 80 * dir, car.y - 35); 
            ctx.lineTo(car.x + 95 * dir, car.y - 10); 
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Cửa sổ kính xe
            ctx.fillStyle = "#2c3e50";
            ctx.beginPath();
            ctx.moveTo(car.x - 20 * dir, car.y - 75);
            ctx.lineTo(car.x - 80 * dir, car.y - 45);
            ctx.lineTo(car.x + 50 * dir, car.y - 40);
            ctx.closePath(); ctx.fill();

            // ĐÈN PHA ĐẦU XE (Không dùng hiệu ứng nhấp nháy phát sáng để chống lỗi tàng hình)
            ctx.fillStyle = "#ff4757";
            ctx.fillRect(car.x + (dir > 0 ? 90 : -95), car.y - 30, 6, 12);

            // BẢN SỬA LỖI BÁNH XE: Vẽ bằng tọa độ tuyệt đối, không xoay ma trận phức tạp
            ctx.fillStyle = "#111";
            // Bánh sau
            ctx.beginPath(); ctx.arc(car.x - 50 * dir, car.y - 10, 20, 0, Math.PI * 2); ctx.fill();
            // Bánh trước
            ctx.beginPath(); ctx.arc(car.x + 50 * dir, car.y - 10, 20, 0, Math.PI * 2); ctx.fill();

            // Tâm bánh xe màu bạc
            ctx.fillStyle = "#bdc3c7";
            ctx.beginPath(); ctx.arc(car.x - 50 * dir, car.y - 10, 8, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(car.x + 50 * dir, car.y - 10, 8, 0, Math.PI * 2); ctx.fill();
            
            // Vẽ các chấu mâm xe xoay nhẹ theo thời gian thực
            ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 2;
            let rotateAngle = car.timer * 0.1 * dir;
            
            const drawSpokes = (wx, wy) => {
                ctx.save();
                ctx.translate(wx, wy);
                ctx.rotate(rotateAngle);
                ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke();
                ctx.restore();
            };
            drawSpokes(car.x - 50 * dir, car.y - 10);
            drawSpokes(car.x + 50 * dir, car.y - 10);

            ctx.restore();

            // Xe biến mất khi chạy hết màn hình
            if (car.timer > 150) {
                p.teslaCar.active = false;
            }
        }

        // 2. VẼ NHÂN VẬT ELON MUSK (Giữ nguyên phong cách người que gọn gàng)
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        if (!isTrail) {
            ctx.fillStyle = "#34495e"; ctx.fillRect(handR.x - 4, handR.y - 8, 8, 14); 
            ctx.fillStyle = "#2ecc71"; ctx.fillRect(handR.x - 2, handR.y - 6, 4, 8); 
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
