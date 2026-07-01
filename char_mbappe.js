// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT MBAPPE (NINJA RÙA TỐC ĐỘ)
// ==========================================
window.currentLoadedChar = {
    id: "mbappe",
    className: "Mbappe (Chủ Tịch)",
    hp: 950, 
    maxHp: 950,
    speed: 11.0, // Chạy nhanh nhất game (Tốc độ ánh sáng)
    dmgMod: 1.1, 
    color: "#0984e3", // Xanh dương Pháp / PSG
    scale: 0.95,
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=mbappe&backgroundColor=74b9ff",
    
    // ĐÁNH THƯỜNG: Vung đấm/đá cực nhanh như chớp
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { caster.state = 'jab'; caster.vx = caster.isFacingRight ? 15 : -15; }
        else if (caster.comboStep === 1) { caster.state = 'cross'; caster.vx = caster.isFacingRight ? 18 : -18; }
        else { caster.state = 'high_kick'; caster.vx = caster.isFacingRight ? 22 : -22; }
        
        caster.attackTimer = 10; // Đòn đánh thi triển cực nhanh (10 frames)
        if (typeof window.playSound === 'function') window.playSound(400, 'triangle', 0.05, 0.1);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 95) {
                let damage = 10 * caster.dmgMod;
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#0984e3", false);
            }
        });
    },

    skill: {
        // SKILL 1: "FLASH DASH" (Lướt chớp nhoáng xé gió)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; 
            caster.attackTimer = 15;
            caster.vx = caster.isFacingRight ? 50 : -50; // Quãng đường lướt siêu xa
            caster.iFrames = 15; // Bất tử khi lướt
            
            if(ctx && ctx.playSound) ctx.playSound(600, 'sine', 0.2, 0.5);
            if(ctx && ctx.spawnDust) { ctx.spawnDust(caster.x, window.GROUND_Y); ctx.spawnDust(caster.x, window.GROUND_Y); }
            if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "💨 TỐC ĐỘ BÀN THỜ!", color: "#00cec9", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
        },
        
        // SKILL 2: "TURTLE SPIN" (Xoay người Ninja Rùa gót cước)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'spinning_heel'; 
            caster.attackTimer = 25; 
            caster.vx = caster.isFacingRight ? 18 : -18;
            
            if(ctx && ctx.playSound) ctx.playSound(350, 'sawtooth', 0.1, 0.4);
            if(target && Math.abs(target.x - caster.x) < 120) {
                if(ctx && ctx.takeDamage) ctx.takeDamage(target, 30 * caster.dmgMod, "#00b894", true, false, caster);
                target.vx = caster.isFacingRight ? 15 : -15; // Đá văng ra xa
                if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🐢 NINJA RÙA!", color: "#00b894", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
            }
        }
    },
    
    // ==========================================
    // ULTIMATE: "QUYỀN LỰC CHỦ TỊCH" (GỌI TRỌNG TÀI GẠT GIÒ)
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        // [CINEMATIC 1]: Bóp đen màn hình, bật ngưng đọng thời gian, zoom vào Mbappe đang khiếu nại
        if (typeof window.focusCinematic === 'function') window.focusCinematic(120);
        window.targetZoom = 1.3;
        window.targetCamX = (window.canvas.width / 2) - caster.x;

        caster.state = 'taunt_point'; // Đứng chỉ tay khiếu nại đối thủ
        caster.attackTimer = 120; // Giữ tư thế chỉ tay 2 giây
        caster.vx = 0;
        caster.iFrames = 120;

        if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.5, 0.7); 
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "🗣️ TRỌNG TÀI!!! NÓ CHƠI XẤU EM!", color: "#0984e3", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 80 });
        }

        // Tọa độ để Trọng Tài bay từ ngoài màn hình vào
        let startX = caster.isFacingRight ? caster.x - 600 : caster.x + 600;
        let refVx = caster.isFacingRight ? 35 : -35; // Tốc độ trượt cỏ cực gắt của Trọng Tài

        // [CINEMATIC 2]: Trọng tài xuất hiện sau khi Mbappe gọi
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            if (typeof window.playSound === 'function') window.playSound(900, 'sawtooth', 0.8, 1.0, true); // Tiếng còi tuýt chói tai
            if (typeof window.shakeScreen === 'function') window.shakeScreen(20, 10);

            // Dùng Quyền Năng mới ném Emoji Trọng Tài trượt dọc sân
            if (typeof window.spawnCustomObj === 'function') {
                window.spawnCustomObj(startX, window.GROUND_Y - 20, refVx, 0, "🏃‍♂️💨 (Trọng Tài)", "#111", "bold 45px Arial", 60, false);
            }

            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: target.x, y: target.y - 150, text: "🚨 PENALTY!!!", color: "#d63031", alpha: 1, vx: 0, vy: -0.5, font: "bold 50px Impact", life: 60 });
            }

        }, 400); // Trọng tài xuất hiện sau 400ms

        // [CINEMATIC 3]: Khoảnh khắc Trọng Tài tông gãy giò đối thủ
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            // Chuyển Camera sang nhìn nạn nhân bị tông
            window.targetCamX = (window.canvas.width / 2) - target.x;
            window.targetZoom = 1.6; // Zoom lút kim vào nỗi đau
            if (typeof window.shakeScreen === 'function') window.shakeScreen(40, 30); // Rung nát màn hình
            if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.4, 1.0, true); // Tiếng gãy giò

            // Tính sát thương và hất văng
            window.enemies.forEach(enemy => {
                if (enemy.hp > 0 && Math.abs(enemy.x - target.x) < 200) {
                    let ultiDmg = baseDmg * 3.0; // Sát thương tuyệt đối (Gãy chân)
                    if (typeof window.takeDamage === 'function') window.takeDamage(enemy, ultiDmg, "#ff4757", true, true, caster);
                    
                    enemy.vy = -15; // Hất bay lên trời
                    enemy.vx = caster.isFacingRight ? 20 : -20; // Văng cực xa
                    enemy.hitStun = 120; // Choáng tận 2 giây vì đau
                    
                    if (typeof window.spawnParticles === 'function') {
                        for(let i=0; i<30; i++) window.spawnParticles(enemy.x, enemy.y, "#ff7675", true);
                    }
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: enemy.x, y: enemy.y - 80, text: "🟥 THẺ ĐỎ TRỰC TIẾP!", color: "#ff1744", alpha: 1, vx: 0, vy: -1, font: "900 32px Arial", life: 80 });
                    }
                }
            });

            // Sau khi kẻ địch bị thương, Mbappe đứng khoanh tay ăn mừng (Taunt Flex)
            caster.state = 'taunt_flex';

        }, 650); // Mất 250ms để trọng tài lướt từ ngoài vào chạm mặt mục tiêu

        // Trả vạn vật về bình thường
        setTimeout(() => {
            window.targetZoom = 1.0; 
            window.targetCamX = 0;
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 1800);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT MBAPPE (Mặt rùa Ninja + Đội tuyển Pháp)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Áo đấu đội tuyển Pháp (Xanh dương thẫm)
        ctx.strokeStyle = "#0984e3"; 
        ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Sọc đỏ ngang ngực áo
            ctx.strokeStyle = "#d63031"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(neck.x - 5, neck.y + 10); ctx.lineTo(neck.x + 5, neck.y + 10); ctx.stroke(); 
        }

        ctx.strokeStyle = "#0984e3"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. Quần và tất trắng tinh
        ctx.strokeStyle = "#dfe6e9"; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. Đầu (Da ngăm đen)
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#8d6e63"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Tóc cắt ngắn (Fade sát da đầu)
            ctx.fillStyle = "#2d3436";
            ctx.beginPath();
            ctx.arc(head.x, head.y, 10, Math.PI, 0); 
            ctx.fill();

            // Đeo băng đô Rùa Ninja ngang mắt (Màu Cam - Michelangelo)
            ctx.fillStyle = "#e17055";
            ctx.fillRect(head.x - 10, head.y - 4, 20, 5);
            // Điểm mắt trắng sáng lên trên băng đô
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(head.x + (p.isFacingRight ? 4 : -4), head.y - 1.5, 1.5, 0, Math.PI*2); ctx.fill();

            // Số 10 Giữa Ngực Áo
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#fff"; ctx.font = "bold 11px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("10", midX + (p.isFacingRight ? 3 : -3), midY);
            
            // Giày tốc độ màu hồng chói lóa (Pink Cleats)
            ctx.fillStyle = "#fd79a8";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();
        }
    }
};

// Đăng ký nhân vật vào kho
if (!window.classStats) window.classStats = {};
window.classStats["mbappe"] = window.currentLoadedChar;
