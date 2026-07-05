// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT NEYMAR (N10)
// ==========================================
window.currentLoadedChar = {
    id: "neymar",
    className: "Neymar Jr",
    hp: 850, 
    maxHp: 850,
    speed: 9.5, // Chạy cực nhanh, lắt léo như lươn
    dmgMod: 1.3, 
    color: "#f1c40f", 
    scale: 0.92,
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=neymar&backgroundColor=bfl211",
    
    // BASIC ATTACK: "Samba Taunt" (Đánh khịa)
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { 
            caster.state = 'kick'; 
            caster.vx = caster.isFacingRight ? 14 : -14; 
        } else if (caster.comboStep === 1) { 
            caster.state = 'low_kick'; 
            caster.vx = caster.isFacingRight ? 16 : -16; 
        } else { 
            caster.state = 'high_kick'; 
            caster.vx = caster.isFacingRight ? -8 : 8; // Đánh xong nhảy giật lùi để trêu
        }
        
        caster.attackTimer = 12; 
        if (typeof window.playSound === 'function') window.playSound(320, 'triangle', 0.05, 0.1);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                let damage = 9 * caster.dmgMod;
                
                // 30% tỷ lệ văng chữ khịa đối thủ
                if (Math.random() < 0.30) { 
                    damage *= 1.5;
                    target.hitStun = 15; // Bị khịa nên cay cú đứng hình
                    
                    let trollWords = ["🤡 EZ PZ!", "🗑️ TRASH!", "🥱 TOO SLOW!", "❓ NOOB!"];
                    let randomWord = trollWords[Math.floor(Math.random() * trollWords.length)];
                    
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: target.x, y: target.y - 60, text: randomWord, color: "#f1c40f", alpha: 1, vx: (Math.random()-0.5)*2, vy: -2, font: "900 16px Arial", life: 35 });
                    }
                }
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#2ecc71", false);
            }
        });
    },

    skill: {
        // SKILL 1: "THE OSCAR DIVE" (Lăn lộn bất tử + Hồi máu diễn xuất)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; // Nằm úp mặt lướt đi
            caster.attackTimer = 28;
            caster.vx = caster.isFacingRight ? 35 : -35; 
            
            caster.iFrames = 28; // Bất tử tuyệt đối khi đang lăn
            
            // Bẩn bựa: Mỗi lần lăn lộn thành công được trả tiền cát-xê diễn xuất (Hồi 15 máu)
            caster.hp += 15;
            if (caster.hp > caster.maxHp) caster.hp = caster.maxHp;

            if(typeof window.spawnDust === 'function') {
                window.spawnDust(caster.x, window.GROUND_Y);
                window.spawnDust(caster.x + (caster.isFacingRight ? -20 : 20), window.GROUND_Y);
            }
            if(typeof window.playSound === 'function') window.playSound(150, 'sawtooth', 0.1, 0.4);
            
            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🥇 OSCAR DIVE!", color: "#e74c3c", alpha: 1, vx: 0, vy: -3, font: "bold 16px Arial", life: 25 });
                window.floatingTexts.push({ x: caster.x, y: caster.y - 50, text: "+$15 ACTING FEE", color: "#2ecc71", alpha: 1, vx: 0, vy: -1, font: "bold 12px Arial", life: 30 });
            }

            if(target && Math.abs(target.x - caster.x) < 160) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 20 * caster.dmgMod, "#f1c40f", true, false, caster);
                target.vy = -10; // Hất tung cực mạnh
                target.vx = caster.isFacingRight ? 20 : -20;
                target.hitStun = 40; // Đối thủ bị choáng vì không hiểu tại sao chạm nhẹ lại văng xa thế
            }
        },
        
        // SKILL 2: "DISRESPECT RAINBOW" (Gắp bóng cầu vồng nhục nhã)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'high_kick'; 
            caster.attackTimer = 20; 
            caster.vy = -8; 
            caster.vx = caster.isFacingRight ? 8 : -8;
            
            if(typeof window.playSound === 'function') window.playSound(500, 'sine', 0.1, 0.2);
            
            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: caster.x, y: caster.y - 90, text: "🌈 DISRESPECT!", color: "#9b59b6", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
            }

            // Bóng bay cực dị, dội từ trên đầu xuống
            if (window.cr7Balls) {
                window.cr7Balls.push({
                    x: caster.x + (caster.isFacingRight ? 20 : -20), 
                    y: caster.y - 50,
                    vx: caster.isFacingRight ? 15 : -15, 
                    vy: -18, // Bay tuốt lên trời
                    radius: 12, 
                    isFire: false,
                    hasHit: false, 
                    dmg: 45 * caster.dmgMod, 
                    rotation: 0
                });
            }
        }
    },
    
    // ==========================================
    // ULTIMATE: "VAR CORRUPTION" (GỌI VAR PHẠT THẺ ĐỎ)
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        // Bước 1: Ngã gục xuống sân ôm chân la hét
        caster.state = 'low_kick'; 
        caster.attackTimer = 75; 
        caster.vx = 0; 
        caster.iFrames = 40; // Bất tử lúc đang khóc lóc để không bị ngắt chiêu
        
        if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.3, 0.5);
        if (typeof window.shakeScreen === 'function') window.shakeScreen(8, 15);
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "🚑 MY LEG IS BROKEN!!!", color: "#ff4757", alpha: 1, vx: 0, vy: -0.5, font: "900 24px Arial", life: 60 });
        }

        // Bước 2: 400ms sau, mua chuộc xong Trọng Tài -> Phạt thẻ đỏ đối thủ
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            caster.state = 'high_kick'; // Bật dậy tươi rói như chưa từng có cuộc chia ly
            
            if (typeof window.playSound === 'function') window.playSound(800, 'sawtooth', 0.5, 0.8, true); 
            if (typeof window.shakeScreen === 'function') window.shakeScreen(30, 20); // Màn hình rung chuyển mạnh

            if (typeof window.floatingTexts !== 'undefined') {
                // Hiển thị VAR siêu bự
                window.floatingTexts.push({ x: caster.x + (caster.isFacingRight ? 100 : -100), y: caster.y - 140, text: "🟥 VAR: RED CARD! GG!", color: "#ff1744", alpha: 1, vx: 0, vy: -1.5, font: "bold 32px Impact", life: 60 });
                window.floatingTexts.push({ x: caster.x, y: caster.y - 70, text: "🤑 MONEY TRANSFER COMPLETE", color: "#2ecc71", alpha: 1, vx: 0, vy: -2, font: "bold 14px Arial", life: 40 });
            }

            // Quét toàn bản đồ, đày đọa kẻ địch
            window.enemies.forEach(enemy => {
                if (enemy.hp > 0 && Math.abs(enemy.x - caster.x) < 400) { 
                    let ultiDmg = baseDmg * 1.8; // Sát thương khủng
                    
                    if (typeof window.takeDamage === 'function') window.takeDamage(enemy, ultiDmg, "#ff1744", true, false, caster);
                    
                    // Treo giò đối thủ (Choáng 1.5 giây - siêu lâu)
                    enemy.hitStun = 90; 
                    enemy.vy = -3;
                    
                    if (typeof window.spawnParticles === 'function') {
                        for(let i=0; i<20; i++) window.spawnParticles(enemy.x, enemy.y - 40, "#ff1744", true);
                    }
                    
                    // Thêm chữ BANNED cắm lên đầu đối thủ
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: enemy.x, y: enemy.y - 80, text: "🚫 BANNED!", color: "#111", alpha: 1, vx: 0, vy: 0, font: "bold 20px Arial", life: 80 });
                    }
                }
            });

        }, 400); 
        
        // Bước 3: Về dáng bình thường
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 950);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT NEYMAR
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#f1c40f"; 
        ctx.lineWidth = 6.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            ctx.strokeStyle = "#2ecc71"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(neck.x - 2, neck.y); ctx.lineTo(neck.x + 2, neck.y); ctx.stroke(); 
        }

        ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        ctx.strokeStyle = "#2980b9"; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#f3a683"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Tóc Mohawk màu hồng chói lóa
            ctx.fillStyle = "#ff7979"; 
            ctx.beginPath();
            ctx.moveTo(head.x - 6, head.y - 7);
            ctx.lineTo(head.x, head.y - 17); 
            ctx.lineTo(head.x + 6, head.y - 7);
            ctx.closePath();
            ctx.fill();
            
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 11px Impact"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("10", midX + (p.isFacingRight ? 2 : -2), midY);
            
            // Giày neon hồng
            ctx.fillStyle = "#ff4757";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4.5, 0, Math.PI*2); ctx.fill();
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["neymar"] = window.currentLoadedChar;
