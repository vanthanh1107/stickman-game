// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT LAMINE YAMAL
// ==========================================
window.currentLoadedChar = {
    id: "yamal",
    className: "Lamine Yamal",
    hp: 1050, // Trẻ khỏe nhưng lượng máu thấp hơn CR7 một chút
    speed: 9.8, // Tốc độ rê bóng bùng nổ của thần đồng (nhanh hơn CR7)
    dmgMod: 1.25, 
    color: "#e10600", // Màu đỏ rực của tuyển Tây Ban Nha
    scale: 0.92, // Form người thanh mảnh, lắt léo
    avatarUrl: "https://i.ibb.co/4ZcwfrcC/Generated-Image-July-20-2026-6-36-AM.png", 
    
    // ĐÁNH THƯỜNG: Những pha ngoặt bóng và vẩy má ngoài chân trái lắt léo
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Chuỗi 3 đòn chân trái tốc độ cao
        if (caster.comboStep === 0) { caster.state = 'low_kick'; caster.vx = caster.isFacingRight ? 13 : -13; }
        else if (caster.comboStep === 1) { caster.state = 'kick'; caster.vx = caster.isFacingRight ? 11 : -11; }
        else { caster.state = 'high_kick'; caster.vx = caster.isFacingRight ? 15 : -15; }
        
        caster.attackTimer = 13; // Tốc độ ra đòn cực nhanh
        if (typeof window.playSound === 'function') window.playSound(230, 'square', 0.1, 0.15);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                let damage = 10 * caster.dmgMod;
                if (Math.random() < 0.25) { // 25% nổ damage x2
                    damage *= 2;
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "💎 Wonderkid!", color: "#ffb400", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#ffb400", false);
            }
        });
    },

    skill: {
        // SKILL 1: Dốc bóng tốc độ cao dọc biên (Lướt xuyên người)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; caster.attackTimer = 18;
            caster.vx = caster.isFacingRight ? 35 : -35; // Lướt cực xa và nhanh
            caster.iFrames = 16; // Tàng hình nhẹ để né đòn
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            if(typeof window.playSound === 'function') window.playSound(420, 'sawtooth', 0.1, 0.25);
            
            if(target && Math.abs(target.x - caster.x) < 140) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#e10600", true, false, caster);
                target.hitStun = 20; // Làm địch khựng lại
            }
        },
        // SKILL 2: Nhảy cắt mặt đánh gót
        actionCode2: function(caster, target, ctx) {
            caster.state = 'high_kick'; caster.attackTimer = 20; 
            caster.vy = -14; // Nhảy nhẹ
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.playSound === 'function') window.playSound(320, 'sine', 0.2, 0.35);
            
            if(target && Math.abs(target.x - caster.x) < 95) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 28 * caster.dmgMod, "#e10600", false, false, caster);
            }
        }
    },
    
    // ==========================================
    // TUYỆT CHIÊU: CỨA LÒNG SIÊU PHẨM EURO + ĂN MỪNG 304
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'dash_back'; // Lùi lại một bước lấy đà
        caster.attackTimer = 80; 
        caster.vx = caster.isFacingRight ? -10 : 10; // Giật lùi
        
        // Hiện text làm dấu ấn thương hiệu 304
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "✨ 304 YAMAL!", color: "#ffb400", alpha: 1, vx: 0, vy: -1.5, font: "900 24px Arial", life: 60 });
        }
        if (typeof window.playSound === 'function') window.playSound(260, 'sawtooth', 0.2, 0.3);

        // Bước 1: Tung cú nã đại bác cầu vồng (Bóng lửa xoáy)
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            caster.state = 'kick'; // Gập người sút
            caster.vx = 0;
            
            if (typeof window.playSound === 'function') window.playSound(140, 'square', 0.3, 0.6, true);
            if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 8); // Rung màn hình

            // Sử dụng chung hệ thống window.cr7Balls của engine
            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 35 : -35), 
                y: caster.y - 30, // Điểm tiếp xúc bóng hơi bổng để tạo độ cong
                vx: caster.isFacingRight ? 45 : -45, // Tốc độ bóng cực nhanh
                vy: -3.5, // Bóng bay hơi hướng lên trên (Quỹ đạo siêu phẩm)
                radius: 13, 
                isFire: true, // Quả bóng rực lửa
                hasHit: false, 
                dmg: baseDmg * 2.0, // Sát thương khủng (x2)
                rotation: 0
            });
        }, 250); 
        
        // Bước 2: Tạo dáng đứng nhìn bóng bay vào lưới
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle'; // Đứng yên chiêm ngưỡng
        }, 550);

        // Bước 3: Mở khóa di chuyển
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.attackTimer = 0;
        }, 900);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT LAMINE YAMAL (Áo đỏ, tất đen, tóc xù fade)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. ÁO ĐẤU TÂY BAN NHA (Màu Đỏ)
        ctx.strokeStyle = "#e10600"; 
        ctx.lineWidth = 6; 
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Viền cổ áo màu vàng 
            ctx.strokeStyle = "#ffb400"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(neck.x - 2, neck.y); ctx.lineTo(neck.x + 2, neck.y + 2); ctx.stroke(); 
        }

        // Cánh tay áo
        ctx.strokeStyle = "#e10600"; ctx.lineWidth = 5.5;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN VÀ TẤT (Quần xanh than, tất đen)
        ctx.strokeStyle = "#001489"; // Xanh than Tây Ban Nha
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();
        
        ctx.strokeStyle = "#111"; // Tất màu đen
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(footL.x, footL.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(footR.x, footR.y); ctx.stroke();

        // 3. ĐẦU VÀ MẶT (Da ngăm, tóc xoăn xù)
        ctx.beginPath(); ctx.arc(head.x, head.y, 9.5, 0, Math.PI * 2); 
        ctx.fillStyle = "#d2a679"; ctx.fill(); // Tone da ngăm đặc trưng
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Tóc xoăn xù nhô cao của Yamal
            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(head.x, head.y - 3, 11, Math.PI, 0); // Vòng cung tóc to hơn đầu 1 chút
            ctx.fill();
            
            // Thêm các chỏm gợn sóng đằng sau
            ctx.beginPath(); ctx.arc(head.x - (p.isFacingRight ? 5 : -5), head.y - 6, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(head.x + (p.isFacingRight ? 4 : -4), head.y - 8, 4, 0, Math.PI*2); ctx.fill();
            
            // Số áo 19
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#ffb400"; // Chữ số màu vàng
            ctx.font = "bold 10px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("19", midX + (p.isFacingRight ? 3 : -3), midY);
            
            // Giày thể thao Neon Pink
            ctx.fillStyle = "#ff007f"; 
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI*2); ctx.fill();
        }
    }
};

// ĐƯA VÀO KHO DỮ LIỆU CHUNG
if (!window.classStats) window.classStats = {};
window.classStats["yamal"] = window.currentLoadedChar;
