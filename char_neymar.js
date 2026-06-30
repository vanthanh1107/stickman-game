// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT NEYMAR (N10)
// ==========================================
window.currentLoadedChar = {
    id: "neymar",
    className: "Neymar Jr (Troll King)",
    hp: 850, // Máu ít hơn Messi/CR7 một chút để bù lại bộ kỹ năng quá bựa
    speed: 9.5, // Tốc độ chạy cực nhanh, lắt léo
    dmgMod: 1.3, 
    color: "#f1c40f", // Vàng hoàng gia Brazil
    scale: 0.92,
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=neymar&backgroundColor=bfl211",
    
    // ĐÁNH THƯỜNG: Quẩy Samba & Nhảy múa trêu ngươi
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { 
            caster.state = 'kick'; 
            caster.vx = caster.isFacingRight ? 14 : -14; 
        } else if (caster.comboStep === 1) { 
            caster.state = 'low_kick'; 
            caster.vx = caster.isFacingRight ? 16 : -16; 
        } else { 
            caster.state = 'high_kick'; // Cú đá gót điệu nghệ
            caster.vx = caster.isFacingRight ? -5 : 5; // Nhảy giật lùi trêu đối thủ
        }
        
        caster.attackTimer = 12; // Tốc độ ra đòn siêu nhanh
        if (typeof window.playSound === 'function') window.playSound(320, 'triangle', 0.05, 0.1);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                let damage = 9 * caster.dmgMod;
                
                // 25% tỷ lệ làm mù/choáng nhẹ đối thủ bằng skill nhảy múa
                if (Math.random() < 0.25) { 
                    damage *= 1.8;
                    target.hitStun = 15;
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: target.x, y: target.y - 60, text: "🤪 CHẢY NƯỚC MẮT!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "900 15px Arial", life: 30 });
                    }
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#2ecc71", false);
            }
        });
    },

    skill: {
        // SKILL 1: "ĂN VẠ THẦN CHƯỞNG" (Lăn lộn bất tử xuyên bản đồ)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; // Giả lập dáng người nằm xuống lướt đi
            caster.attackTimer = 25;
            caster.vx = caster.isFacingRight ? 32 : -32; 
            
            // Khung hình bất tử (iFrames) cực cao suốt thời gian lăn lộn!
            caster.iFrames = 25; 
            
            if(typeof window.spawnDust === 'function') {
                window.spawnDust(caster.x, window.GROUND_Y);
                window.spawnDust(caster.x + 20, window.GROUND_Y);
            }
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🤸 LĂN LỘN VÔ ĐỊCH!!", color: "#e74c3c", alpha: 1, vx: 0, vy: -3, font: "bold 16px Arial", life: 25 });
            }

            // Gây ức chế và hất tung kẻ địch trúng chiêu
            if(target && Math.abs(target.x - caster.x) < 160) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#f1c40f", true, false, caster);
                target.vy = -8; // Hất tung kẻ địch lên trời
                target.vx = caster.isFacingRight ? 15 : -15;
                target.hitStun = 30;
            }
        },
        
        // SKILL 2: "GẮP BÓNG CẦU VỒNG TROLL" (Rainbow Flick hạ gục từ trên cao)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'high_kick'; 
            caster.attackTimer = 20; 
            caster.vy = -8; // Nhảy nhẹ lên tinh tế
            caster.vx = caster.isFacingRight ? 8 : -8;
            
            if(typeof window.playSound === 'function') window.playSound(500, 'sine', 0.1, 0.2);
            
            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x, y: caster.y - 90, text: "🌈 RAINBOW FLICK!", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
            }

            // Tạo ra một quả bóng bay quỹ đạo hình cầu vồng dội từ trên đầu địch xuống
            if (window.cr7Balls) {
                window.cr7Balls.push({
                    x: caster.x + (caster.isFacingRight ? 20 : -20), 
                    y: caster.y - 50,
                    vx: caster.isFacingRight ? 18 : -18, 
                    vy: -15, // Bay vút lên cao rồi rớt xuống đầu địch
                    radius: 11, 
                    isFire: false,
                    hasHit: false, 
                    dmg: 40 * caster.dmgMod, // Sát thương khá thốn
                    rotation: 0
                });
            }
        }
    },
    
    // ==========================================
    // TUYỆT CHIÊU BẨN BỰA: "TRIỆU HỒI VAR & THẺ ĐỎ HỦY DIỆT"
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        // Bước 1: Nằm ôm chân khóc lóc kịch liệt
        caster.state = 'low_kick'; 
        caster.attackTimer = 70; 
        caster.vx = 0; // Đứng im ôm chân ăn vạ
        
        if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.3, 0.5);
        if (typeof window.shakeScreen === 'function') window.shakeScreen(5, 10);
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "😭 ĐAU QUÁ TRỌNG TÀI ƠI!!!", color: "#ff4757", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 60 });
        }

        // Bước 2: Sau 350ms, Trọng tài xuất hiện check VAR và rút thẻ đỏ trực tiếp!
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            caster.state = 'high_kick'; // Dáng đứng dậy ăn mừng troll
            
            if (typeof window.playSound === 'function') window.playSound(800, 'sawtooth', 0.4, 0.6, true); // Tiếng còi gắt
            if (typeof window.shakeScreen === 'function') window.shakeScreen(25, 15); // Rung màn hình cực mạnh

            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x + (caster.isFacingRight ? 150 : -150), y: caster.y - 130, text: "🟥 VAR: THẺ ĐỎ TRỰC TIẾP!", color: "#ff1744", alpha: 1, vx: 0, vy: -1, font: "bold 28px Impact", life: 50 });
            }

            // Gây choáng diện rộng và sát thương hủy diệt lên mục tiêu (Giảm 75% máu hiện tại hoặc số cực lớn)
            window.enemies.forEach(enemy => {
                if (enemy.hp > 0 && Math.abs(enemy.x - caster.x) < 350) { // Tầm quét cực rộng
                    let ultiDmg = baseDmg * 1.6; // Sát thương khủng khiếp từ quyết định của trọng tài
                    
                    if (typeof window.takeDamage === 'function') window.takeDamage(enemy, ultiDmg, "#ff1744", true, false, caster);
                    
                    enemy.hitStun = 70; // Đối thủ đứng im chịu trận vì uất ức (Choáng cực lâu)
                    enemy.vy = -5;
                    
                    if (typeof window.spawnParticles === 'function') {
                        // Bung ra toàn hạt năng lượng màu đỏ cảnh cáo
                        for(let i=0; i<15; i++) window.spawnParticles(enemy.x, enemy.y - 30, "#ff1744", true);
                    }
                }
            });

        }, 400); 
        
        // Bước 3: Thu thế về trạng thái bình thường đầy ngạo nghễ
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 900);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT NEYMAR (Áo Vàng Chanh - Quần Xanh Dương - Tóc Hồng Vuốt Chất)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. ÁO ĐẤU SELECAO (Vàng Chanh phối cổ xanh lá)
        ctx.strokeStyle = "#f1c40f"; // Màu vàng sáng Brazil
        ctx.lineWidth = 6.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Điểm xuyết viền cổ áo xanh lá đặc trưng
            ctx.strokeStyle = "#2ecc71"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(neck.x - 2, neck.y); ctx.lineTo(neck.x + 2, neck.y); ctx.stroke(); 
        }

        // Cánh tay áo vàng
        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN XANH DƯƠNG ĐẬM
        ctx.strokeStyle = "#2980b9"; // Xanh dương tuyển quốc gia
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. ĐẦU VÀ KIỂU TÓC HỒNG TROLL RỰC SÁỠ
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#f3a683"; ctx.fill(); // Da hơi bánh mật một chút
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Kiểu tóc Mohawk vuốt dựng màu hồng cánh sen cực kỳ chất chơi và bẩn bựa
            ctx.fillStyle = "#ff7979"; 
            ctx.beginPath();
            ctx.moveTo(head.x - 6, head.y - 7);
            ctx.lineTo(head.x, head.y - 17); // Vuốt dựng cao lên hẳn đầu
            ctx.lineTo(head.x + 6, head.y - 7);
            ctx.closePath();
            ctx.fill();
            
            // Vẽ số 10 huyền thoại màu xanh lá sau lưng/ngực
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 11px Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("10", midX + (p.isFacingRight ? 2 : -2), midY);
            
            // Giày đấu hồng Neon ton-sur-ton với tóc
            ctx.fillStyle = "#ff4757";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI*2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["neymar"] = window.currentLoadedChar;
