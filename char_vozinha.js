// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT VOZINHA (CAPE VERDE)
// ==========================================
window.currentLoadedChar = {
    id: "vozinha",
    className: "Vozinha",
    hp: 1350, // Thủ môn nên máu rất trâu (Tanker)
    speed: 7.5, // Tốc độ chạy vừa phải nhưng độ vọt cực cao
    dmgMod: 1.5, // Lực tay của thủ môn đấm bóng rất mạnh
    color: "#003893", // Xanh dương đậm (Màu áo Cabo Verde)
    scale: 1.05, // Thân hình to cao, sải tay dài
    avatarUrl: "https://i.ibb.co/fVqB9g8Y/Generated-Image-July-06-2026-6-05-AM.png", // Bạn có thể thay link ảnh đại diện Vozinha
    
    // ==========================================
    // ĐÁNH THƯỜNG: Đấm bóng và ném bóng tốc độ cao
    // ==========================================
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Vozinha dùng tay đấm và ném (Phong cách thủ môn)
        if (caster.comboStep === 0) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else if (caster.comboStep === 1) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 12 : -12; }
        else { caster.state = 'jump_attack'; caster.vy = -6; caster.vx = caster.isFacingRight ? 15 : -15; } // Vừa nhảy vừa ném
        
        caster.attackTimer = 16; 
        if (typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.15); // Âm thanh trầm, uy lực

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) { // Tầm đánh tay dài hơn chút
                let damage = 12 * caster.dmgMod;
                if (Math.random() < 0.25) { 
                    damage *= 2.5; // Bạo kích đấm bóng
                    if (typeof window.floatingTexts !== 'undefined') window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "🥊 FORÇA!", color: "#003893", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#cf142b", false); // Hạt máu đỏ
            }
        });
    },

    skill: {
        // SKILL 1: MERGULHO DO TUBARÃO (Cú bay người của Cá Mập)
        // Vozinha bay người cản phá bóng, tông bay mọi kẻ địch trên đường
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; caster.attackTimer = 22;
            caster.vy = -4; // Hơi bay lên khỏi mặt đất
            caster.vx = caster.isFacingRight ? 40 : -40; // Tốc độ vọt cực mạnh
            caster.iFrames = 22; // Bất tử trong lúc bay người (Thủ môn bắt bóng)
            
            if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
            if(typeof window.playSound === 'function') window.playSound(200, 'square', 0.2, 0.4);
            
            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🌊 Mergulho!", color: "#003893", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 40 });
            }

            if(target && Math.abs(target.x - caster.x) < 160) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#003893", true, false, caster);
                target.hitStun = 25; // Gây choáng lâu
                target.vy = -10; // Hất văng lên trời
            }
        },
        
        // SKILL 2: MURALHA CRIOULA (Bức tường Creole)
        // Vozinha nhảy lên đấm mạnh xuống đất, tạo sóng xung kích (như đấm bóng giải nguy)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'kick'; caster.attackTimer = 25; 
            caster.vy = -18; // Nhảy rất cao
            caster.vx = caster.isFacingRight ? 5 : -5;
            
            if(typeof window.playSound === 'function') window.playSound(100, 'sawtooth', 0.3, 0.5);
            
            setTimeout(() => {
                if(typeof window.shakeScreen === 'function') window.shakeScreen(15, 10);
                if(typeof window.spawnDust === 'function') {
                    window.spawnDust(caster.x - 20, window.GROUND_Y);
                    window.spawnDust(caster.x + 20, window.GROUND_Y);
                }
                if(target && Math.abs(target.x - caster.x) < 120) {
                    if(typeof window.takeDamage === 'function') window.takeDamage(target, 35 * caster.dmgMod, "#cf142b", true, false, caster);
                }
            }, 300); // Đợi rơi xuống đất tạo damage
        }
    },
    
    // ==========================================
    // TUYỆT CHIÊU: TUBARÕES AZUIS (CÚ PHÁ BÓNG CỦA CÁ MẬP XANH)
    // Vozinha tung người phát bóng bổng cực mạnh (Drop-kick) xuyên thủng đội hình địch
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'charge'; 
        caster.attackTimer = 60;
        caster.vx = 0; 
        
        if (typeof window.playSound === 'function') window.playSound(300, 'square', 0.2, 0.5);
        if (typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
        
        // Tiếng hét tiếng Creole Cabo Verde: "Tubarões Azuis!" (Những chú cá mập xanh)
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "🦈 TUBARÕES AZUIS!!", color: "#cf142b", alpha: 1, vx: 0, vy: -1.5, font: "900 26px Arial", life: 70 });
        }

        // Sau khi vận nội công 300ms, tiến hành phát bóng
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            caster.state = 'kick'; 
            caster.vy = -8; // Hơi bật lên để sút vô lê
            
            if (typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.3, 0.6, true);
            if (typeof window.shakeScreen === 'function') window.shakeScreen(20, 15);

            // Bắn ra 1 quả bóng rực lửa SIÊU TO
            if (!window.cr7Balls) window.cr7Balls = [];
            window.cr7Balls.push({
                x: caster.x + (caster.isFacingRight ? 40 : -40), 
                y: caster.y - 30, // Tầm vung chân cao
                vx: caster.isFacingRight ? 28 : -28, // Bay hơi chậm hơn bóng lùi sút để húc tung địch
                vy: -8, // Bóng bay bổng lên
                radius: 25, // BÓNG CỰC TO (Khác bọt so với 12 của Messi)
                isFire: true, // Hiệu ứng lửa đỏ (Màu cờ CV)
                hasHit: false, 
                dmg: baseDmg * 1.5, // Sát thương 150% cực khủng
                rotation: 0
            });
        }, 300); 
        
        // Thu thế
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 800);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT (Áo Cabo Verde, Găng tay thủ môn, Đầu trọc)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. ÁO THỦ MÔN CABO VERDE (Xanh dương đậm)
        ctx.strokeStyle = "#003893"; 
        ctx.lineWidth = 9; // Áo thủ môn thường làm to và có đệm
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Sọc ngang Đỏ và Trắng đặc trưng trên cờ Cape Verde giữa ngực
            let chestY = neck.y + (pelvis.y - neck.y) * 0.4;
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; // Sọc trắng 1
            ctx.beginPath(); ctx.moveTo(neck.x - 4, chestY - 2); ctx.lineTo(neck.x + 4, chestY - 2); ctx.stroke();
            ctx.strokeStyle = "#cf142b"; ctx.lineWidth = 3; // Sọc đỏ giữa
            ctx.beginPath(); ctx.moveTo(neck.x - 5, chestY); ctx.lineTo(neck.x + 5, chestY); ctx.stroke();
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; // Sọc trắng 2
            ctx.beginPath(); ctx.moveTo(neck.x - 4, chestY + 2); ctx.lineTo(neck.x + 4, chestY + 2); ctx.stroke();
        }

        // Cánh tay áo thủ môn dài (Xanh đậm)
        ctx.strokeStyle = "#003893"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN VÀ TẤT
        ctx.strokeStyle = "#00205b"; // Quần màu xanh đen
        ctx.lineWidth = 7;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. ĐẦU VÀ MẶT (Da ngăm đen, Đầu trọc nam tính)
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#5c3a21"; // Màu da ngăm đen của Vozinha
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        // Vozinha cạo trọc đầu nên KHÔNG vẽ tóc, chỉ vẽ râu quai nón mờ (nếu thích)
        if (!isTrail) {
            // Râu cằm
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(head.x + (p.isFacingRight ? 2 : -2), head.y + 4, 3, 0, Math.PI); 
            ctx.fill();

            // Vẽ số 1 ở ngực (Số áo thủ môn)
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#fff"; ctx.font = "bold 10px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("1", midX + (p.isFacingRight ? 2 : -2), midY + 5);
            
            // 4. GĂNG TAY THỦ MÔN (Màu Vàng chanh)
            ctx.fillStyle = "#ccff00"; // Găng tay vàng phản quang nổi bật
            // Găng tay trái
            ctx.beginPath(); ctx.arc(handL.x, handL.y, 6, 0, Math.PI*2); ctx.fill();
            ctx.lineWidth = 1; ctx.strokeStyle = "#111"; ctx.stroke();
            // Găng tay phải
            ctx.beginPath(); ctx.arc(handR.x, handR.y, 6, 0, Math.PI*2); ctx.fill();
            ctx.stroke();

            // Giày đinh
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["vozinha"] = window.currentLoadedChar;
