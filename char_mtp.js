// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT M-TP (THE PRINCE OF V-POP)
// ==========================================
window.currentLoadedChar = {
    id: "mtp",
    className: "M-TP (The Prince)",
    hp: 850, 
    maxHp: 850,
    speed: 9.5, // Tốc độ di chuyển rất lướt và nghệ sĩ
    dmgMod: 1.2, // Sát thương kỹ năng cao
    color: "#00cec9", // Xanh mint / Sky blue
    scale: 0.95,
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=mtp&backgroundColor=00cec9",
    
    // ĐÁNH THƯỜNG: Vung Mic và bắn nốt nhạc
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { caster.state = 'jab'; caster.vx = caster.isFacingRight ? 12 : -12; }
        else if (caster.comboStep === 1) { caster.state = 'cross'; caster.vx = caster.isFacingRight ? 15 : -15; }
        else { caster.state = 'high_kick'; caster.vx = caster.isFacingRight ? 10 : -10; }
        
        caster.attackTimer = 12; 
        if (typeof window.playSound === 'function') window.playSound(500, 'sine', 0.05, 0.1);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 100) {
                let damage = 12 * caster.dmgMod;
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                // Hiệu ứng nốt nhạc văng ra khi đánh trúng
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 20, "#00cec9", false);
                if (typeof window.floatingTexts !== 'undefined' && Math.random() > 0.5) {
                    window.floatingTexts.push({ x: target.x, y: target.y - 40, text: "🎵", color: "#00cec9", alpha: 1, vx: (Math.random() - 0.5)*5, vy: -3, font: "20px Arial", life: 20 });
                }
            }
        });
    },

    skill: {
        // SKILL 1: "MELODY DASH" (Lướt đi trên những nốt nhạc)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; 
            caster.attackTimer = 18;
            caster.vx = caster.isFacingRight ? 40 : -40; 
            caster.iFrames = 18; // Bất tử khi lướt
            
            if(ctx && ctx.playSound) ctx.playSound(700, 'sine', 0.2, 0.6);
            if(ctx && ctx.spawnDust) { ctx.spawnDust(caster.x, window.GROUND_Y); }
            if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: "🎶 MELODY DASH!", color: "#74b9ff", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
        },
        
        // SKILL 2: "BASS DROP" (Dậm chân tạo sóng âm hất văng đối thủ)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'spinning_heel'; // Tận dụng animation xoay người hoặc dậm chân
            caster.attackTimer = 30; 
            caster.vx = 0; // Đứng yên gồng skill
            
            if(ctx && ctx.playSound) ctx.playSound(150, 'square', 0.3, 0.6); // Tiếng bass trầm
            
            // Sát thương diện rộng (AOE) xung quanh caster
            if(window.enemies) {
                window.enemies.forEach(enemy => {
                    if(enemy.hp > 0 && Math.abs(enemy.x - caster.x) < 150) {
                        if(ctx && ctx.takeDamage) ctx.takeDamage(enemy, 25 * caster.dmgMod, "#fdcb6e", true, false, caster);
                        enemy.vy = -10; // Hất tung nhẹ
                        enemy.vx = caster.x < enemy.x ? 12 : -12; // Đẩy ra xa
                        if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: enemy.x, y: enemy.y - 80, text: "🎧 BASS DROP!", color: "#fdcb6e", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
                    }
                });
            }
        }
    },
    
    // ==========================================
    // ULTIMATE: "SKY TOUR ENCORE" (TRIỆU HỒI DÀN LOA SÂN KHẤU)
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        // [CINEMATIC 1]: Ngưng đọng thời gian, zoom vào M-TP đưa mic lên hát
        if (typeof window.focusCinematic === 'function') window.focusCinematic(130);
        window.targetZoom = 1.4;
        window.targetCamX = (window.canvas.width / 2) - caster.x;

        caster.state = 'taunt_point'; 
        caster.attackTimer = 130; 
        caster.vx = 0;
        caster.iFrames = 130;

        if (typeof window.playSound === 'function') window.playSound(600, 'sine', 0.5, 1.0); 
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "🎤 MAKE SOME NOISE!!!", color: "#00cec9", alpha: 1, vx: 0, vy: -1, font: "900 26px Arial", life: 90 });
        }

        let startX = caster.isFacingRight ? caster.x - 500 : caster.x + 500;
        let speakerVx = caster.isFacingRight ? 30 : -30; 

        // [CINEMATIC 2]: Sóng âm / Dàn loa lao tới
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            if (typeof window.playSound === 'function') window.playSound(200, 'sawtooth', 0.9, 1.5, true); // Tiếng loa rít
            if (typeof window.shakeScreen === 'function') window.shakeScreen(15, 20);

            // Bắn một chiếc Loa khổng lồ kèm nốt nhạc xuyên qua sân khấu
            if (typeof window.spawnCustomObj === 'function') {
                window.spawnCustomObj(startX, window.GROUND_Y - 40, speakerVx, 0, "🔊🎶 (Soundwave)", "#111", "bold 55px Arial", 70, false);
            }

            if (typeof window.floatingTexts !== 'undefined') {
                window.floatingTexts.push({ x: target.x, y: target.y - 160, text: "✨ SKY TOUR!!!", color: "#ffeaa7", alpha: 1, vx: 0, vy: -0.5, font: "bold 55px Impact", life: 60 });
            }

        }, 500); 

        // [CINEMATIC 3]: Khoảnh khắc sóng âm quét qua đối thủ
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            window.targetCamX = (window.canvas.width / 2) - target.x;
            window.targetZoom = 1.5; 
            if (typeof window.shakeScreen === 'function') window.shakeScreen(35, 25); 
            if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.6, 1.0, true); // Vụ nổ âm thanh

            window.enemies.forEach(enemy => {
                if (enemy.hp > 0 && Math.abs(enemy.x - target.x) < 250) {
                    let ultiDmg = baseDmg * 2.8; 
                    if (typeof window.takeDamage === 'function') window.takeDamage(enemy, ultiDmg, "#00cec9", true, true, caster);
                    
                    enemy.vy = -18; // Hất tung rất cao
                    enemy.vx = caster.isFacingRight ? 15 : -15; 
                    enemy.hitStun = 100; // Choáng
                    
                    if (typeof window.spawnParticles === 'function') {
                        for(let i=0; i<40; i++) window.spawnParticles(enemy.x, enemy.y, "#00cec9", true);
                        for(let i=0; i<20; i++) window.spawnParticles(enemy.x, enemy.y, "#fdcb6e", true);
                    }
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: enemy.x, y: enemy.y - 90, text: "🎸 PERFECT CHORD!", color: "#fdcb6e", alpha: 1, vx: 0, vy: -1, font: "900 30px Arial", life: 80 });
                    }
                }
            });

            caster.state = 'taunt_flex'; // Ăn mừng chuẩn phong cách "ngông"

        }, 700); 

        // Trả vạn vật về bình thường
        setTimeout(() => {
            window.targetZoom = 1.0; 
            window.targetCamX = 0;
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 1900);
    },
    
    // ==========================================
    // VẼ NHÂN VẬT M-TP (Tóc lãng tử, Vest thời trang & Cầm Mic)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Áo vest thời trang (Đen sọc vàng hoặc Xanh dương đậm)
        ctx.strokeStyle = "#2d3436"; 
        ctx.lineWidth = 6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        if (!isTrail) {
            // Cà vạt / Dây chuyền lấp lánh ở cổ
            ctx.strokeStyle = "#fdcb6e"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y + 2); ctx.lineTo(neck.x, neck.y + 12); ctx.stroke(); 
        }

        ctx.strokeStyle = "#2d3436"; ctx.lineWidth = 6;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. Quần âu đen và giày tây lấp lánh
        ctx.strokeStyle = "#1e272e"; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. Đầu (Da sáng hơn chút)
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Tóc lãng tử rẽ ngôi (Màu bạch kim / Bạc)
            ctx.fillStyle = "#dfe6e9";
            ctx.beginPath();
            ctx.arc(head.x, head.y - 2, 11, Math.PI, 0); // Đỉnh tóc phồng
            ctx.fill();
            // Mái rủ xuống
            ctx.beginPath();
            ctx.moveTo(head.x - 5, head.y - 12);
            ctx.lineTo(head.x + (p.isFacingRight ? 8 : -8), head.y - 2);
            ctx.lineTo(head.x, head.y - 10);
            ctx.fill();

            // Đeo kính râm ngầu (Sunglasses)
            ctx.fillStyle = "#000";
            ctx.fillRect(head.x - 7, head.y - 4, 14, 4);

            // Giày tây mũi nhọn (Boots)
            ctx.fillStyle = "#000";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 4, 0, Math.PI*2); ctx.fill();

            // TRANG BỊ VŨ KHÍ: MICROPHONE trên tay phải
            let micX = handR.x + (p.isFacingRight ? 5 : -5);
            let micY = handR.y - 5;
            // Thân mic
            ctx.strokeStyle = "#b2bec3"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(micX, micY); ctx.stroke();
            // Đầu mic
            ctx.fillStyle = "#2d3436";
            ctx.beginPath(); ctx.arc(micX, micY, 3, 0, Math.PI*2); ctx.fill();
        }
    }
};

// Đăng ký nhân vật vào kho
if (!window.classStats) window.classStats = {};
window.classStats["mtp"] = window.currentLoadedChar;
