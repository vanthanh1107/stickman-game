window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 7, 
    dmgMod: 1.5, 
    color: "#e82127", // Đỏ 
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    skill: {},
    
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'summon_tesla'; 
        caster.attackTimer = 60; 
        caster.vx = 0; 
        
        // Tạo một đối tượng xe Cybertruck đính kèm vào caster để vẽ
        caster.teslaCar = {
            active: true,
            // Xe bắt đầu từ tuốt phía sau lưng Elon Musk
            x: caster.isFacingRight ? caster.x - 600 : caster.x + 600,
            y: target.y, // Chạy ngang tầm mục tiêu
            // Vận tốc cực nhanh lao tới
            vx: caster.isFacingRight ? 45 : -45,
            timer: 0
        };

        // Thời gian để xe chạy đến trúng mục tiêu (khoảng 300ms - 400ms)
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Sát thương
            if(typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.5, "#bdc3c7", true, false, caster);
            }

            // Hất văng (Knockback cực mạnh)
            let knockbackForce = 30; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -12; 
            target.state = 'hit';
            target.stunTimer = 40; 
            
        }, 350); // Căn khớp với lúc chiếc xe vừa chạm tới target
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // --- 1. Vẽ chiếc Tesla Cybertruck (nếu chiêu cuối đang kích hoạt) ---
        // Phải vẽ xe trước hoặc sau nhân vật. Ở đây vẽ xe ra trước.
        if (p.teslaCar && p.teslaCar.active && !isTrail) {
            let car = p.teslaCar;
            car.x += car.vx; // Cập nhật vị trí xe
            car.timer++;

            let dir = car.vx > 0 ? 1 : -1; // Hướng xe chạy

            ctx.save();
            // Vẽ thân xe Cybertruck (Góc cạnh)
            ctx.fillStyle = "#95a5a6"; // Bạc kim loại
            ctx.strokeStyle = "#7f8c8d";
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            // Vẽ đa giác hình xe
            ctx.moveTo(car.x - 60 * dir, car.y - 10); // Đuôi xe
            ctx.lineTo(car.x - 60 * dir, car.y - 30); // Đuôi nhô lên
            ctx.lineTo(car.x - 10 * dir, car.y - 50); // Nóc xe (chóp tam giác)
            ctx.lineTo(car.x + 50 * dir, car.y - 25); // Mũi xe
            ctx.lineTo(car.x + 70 * dir, car.y - 10); // Cản trước
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Vẽ kính cửa sổ màu đen
            ctx.fillStyle = "#2c3e50";
            ctx.beginPath();
            ctx.moveTo(car.x - 10 * dir, car.y - 48);
            ctx.lineTo(car.x - 50 * dir, car.y - 30);
            ctx.lineTo(car.x + 30 * dir, car.y - 30);
            ctx.closePath();
            ctx.fill();

            // Vẽ bánh xe
            ctx.fillStyle = "#111";
            // Bánh sau
            ctx.beginPath(); ctx.arc(car.x - 40 * dir, car.y - 10, 15, 0, Math.PI*2); ctx.fill();
            // Bánh trước
            ctx.beginPath(); ctx.arc(car.x + 40 * dir, car.y - 10, 15, 0, Math.PI*2); ctx.fill();

            // Vẽ mâm xe (Lazang)
            ctx.fillStyle = "#bdc3c7";
            ctx.beginPath(); ctx.arc(car.x - 40 * dir, car.y - 10, 6, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(car.x + 40 * dir, car.y - 10, 6, 0, Math.PI*2); ctx.fill();
            
            // Vẽ đèn pha Laser đỏ đằng trước
            ctx.fillStyle = "#ff4757";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ff4757";
            ctx.fillRect(car.x + (dir > 0 ? 65 : -70), car.y - 22, 5, 8);
            ctx.shadowBlur = 0;

            ctx.restore();

            // Nếu xe chạy đủ xa ra ngoài màn hình thì xóa nó đi
            if (car.timer > 60) { 
                p.teslaCar.active = false;
            }
        }

        // --- 2. Vẽ nhân vật Elon Musk (Giữ nguyên như cũ) ---
        ctx.strokeStyle = "#1e272e"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#2f3640"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; 
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        // Tay cầm Remote 
        ctx.fillStyle = "#2d3436"; 
        ctx.shadowBlur = isTrail ? 0 : 5; 
        ctx.shadowColor = "#ff7675"; 
        ctx.fillRect(handR.x - 4, handR.y - 6, 8, 12);
        ctx.fillStyle = "#e82127";
        ctx.beginPath(); ctx.arc(handR.x, handR.y - 2, 2, 0, Math.PI*2); ctx.fill();
        
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
