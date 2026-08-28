// ==========================================
// CHAR_ELONMUSK.JS - NHÂN VẬT ELON MUSK (ĐÃ NÂNG CẤP AVATAR HÌNH ẢNH)
// ==========================================

window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 6.0, 
    dmgMod: 1.5, 
    color: "#e82127", 
    avatarUrl: "https://i.ibb.co/jZkZy4sS/Generated-Image-July-05-2026-8-52-PM.jpg",
    
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
        // SKILL 2: Phản lực bay lên trời (SpaceX)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'dash_back'; caster.attackTimer = 20; 
            caster.vy = -18; 
            caster.vx = caster.isFacingRight ? 12 : -12;
            if(typeof window.spawnParticles === 'function') {
                for(let i=0; i<15; i++) window.spawnParticles(caster.x, caster.y, "#f1c40f", true); 
            }
        }
    },
    
    // TUYỆT CHIÊU: GỌI TESLA CYBERTRUCK TÔNG ĐỊCH (Chạy cực đầm)
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'punch'; 
        caster.attackTimer = 80; // Giữ nhân vật bấm remote trong 1.5 giây
        caster.vx = 0; 
        
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🚗 TESLA CYBERTRUCK!", color: "#bdc3c7", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 80 });
        }

        // Tạo dữ liệu cho chiếc xe (Tính bằng thời gian thực để mượt mà nhất)
        caster.teslaCar = {
            active: true,
            startX: caster.isFacingRight ? caster.x - 650 : caster.x + 650, // Bắt đầu từ ngoài màn hình
            y: window.GROUND_Y,
            vx: caster.isFacingRight ? 850 : -850, // Tốc độ chạy: 850 pixel / giây
            startTime: Date.now(), 
            duration: 1500 // Sống trong 1.5 giây rồi biến mất
        };

        // Với vận tốc 850px/s và khoảng cách 650px, xe sẽ chạm địch ở khoảng 750ms
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0 || !target) return;
            
            // Va chạm tạo sát thương khủng
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 4.0, "#bdc3c7", true, true, caster);
            
            // Rung màn hình uy lực mạnh
            if(typeof window.shakeScreen === 'function') window.shakeScreen(45, 30);

            // Kẻ địch bị tông văng tít mù
            let knockbackForce = 35; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -15; 
            target.state = 'hit';
            target.stunTimer = 90; 
        }, 750); 
    },
    
    // ===============================================
    // HÀM VẼ: ĐÃ FIX HOÀN TOÀN LỖI "BÓNG MỜ TÀNG HÌNH"
    // ===============================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. VẼ CHIẾC CYBERTRUCK (Chỉ vẽ khi không phải là bóng mờ)
        if (p.teslaCar && p.teslaCar.active && !isTrail) {
            let car = p.teslaCar;
            let elapsed = (Date.now() - car.startTime) / 1000; 
            
            if (elapsed > car.duration / 1000) {
                car.active = false;
            } else {
                let currentX = car.startX + (car.vx * elapsed); 
                let dir = car.vx > 0 ? 1 : -1; 
                
                ctx.save();
                ctx.fillStyle = "#95a5a6"; // Màu bạc kim loại
                ctx.strokeStyle = "#7f8c8d";
                ctx.lineWidth = 3; 
                
                // Khung xe Cybertruck
                ctx.beginPath();
                ctx.moveTo(currentX - 100 * dir, car.y - 15); 
                ctx.lineTo(currentX - 100 * dir, car.y - 45); 
                ctx.lineTo(currentX - 30 * dir, car.y - 85); 
                ctx.lineTo(currentX + 70 * dir, car.y - 40); 
                ctx.lineTo(currentX + 95 * dir, car.y - 10); 
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Kính xe đen
                ctx.fillStyle = "#2c3e50";
                ctx.beginPath();
                ctx.moveTo(currentX - 30 * dir, car.y - 80);
                ctx.lineTo(currentX - 90 * dir, car.y - 48);
                ctx.lineTo(currentX + 45 * dir, car.y - 43);
                ctx.closePath(); 
                ctx.fill();

                // Đèn pha Laser
                ctx.fillStyle = "#ff4757";
                ctx.fillRect(currentX + (dir > 0 ? 80 : -85), car.y - 30, 8, 12);

                // Hàm vẽ bánh xe lăn mượt mà
                const drawWheel = (wx, wy) => {
                    ctx.save(); 
                    ctx.translate(wx, wy); 
                    ctx.rotate(elapsed * 20 * dir); 
                    
                    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#bdc3c7"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 4; 
                    ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(0, 22); ctx.stroke();
                    ctx.restore();
                };
                
                drawWheel(currentX - 60 * dir, car.y - 15); 
                drawWheel(currentX + 60 * dir, car.y - 15);
                ctx.restore();
            }
        }

        // 2. VẼ NHÂN VẬT (CƠ THỂ)
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // ==========================================
        // 3. VẼ ĐẦU ELON MUSK BẰNG AVATAR HÌNH ẢNH
        // ==========================================
        let headSize = 34; 
        
        let currentAvatar = p.avatarUrl;
        if (!currentAvatar && p.classId && window.classStats && window.classStats[p.classId]) {
            currentAvatar = window.classStats[p.classId].avatarUrl;
        }
        if (!currentAvatar && window.currentLoadedChar) {
            currentAvatar = window.currentLoadedChar.avatarUrl;
        }

        if (currentAvatar) {
            if (!window.avatarImageCache) window.avatarImageCache = {};
            if (!window.avatarImageCache[currentAvatar]) {
                let img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = currentAvatar;
                window.avatarImageCache[currentAvatar] = img;
            }

            let img = window.avatarImageCache[currentAvatar];
            
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.translate(head.x, head.y - 4); 
                
                ctx.beginPath();
                ctx.arc(0, 0, headSize / 2, 0, Math.PI * 2);
                ctx.clip();
                
                ctx.fillStyle = "#111";
                ctx.fill();

                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
                ctx.restore();

                // Viền màu đỏ đặc trưng của Elon Musk
                ctx.beginPath();
                ctx.arc(head.x, head.y - 4, headSize / 2, 0, Math.PI * 2);
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = p.color || "#e82127";
                ctx.shadowBlur = isTrail ? 0 : 8;
                ctx.shadowColor = p.color || "#e82127";
                ctx.stroke();
                ctx.shadowBlur = 0;

            } else {
                drawFallbackHead(); 
            }
        } else {
            drawFallbackHead();
        }

        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#ffddc1"; ctx.fill(); 
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }
        // ==========================================
        
        // 4. Cầm Điện thoại điều khiển từ xa (X app)
        if (!isTrail && (p.state === 'punch' || p.state === 'summon_tesla')) {
            ctx.fillStyle = "#34495e"; 
            ctx.fillRect(handR.x - 4, handR.y - 8, 8, 14); 
            ctx.fillStyle = "#2ecc71"; // Nút xanh bấm gọi xe
            ctx.fillRect(handR.x - 2, handR.y - 6, 4, 8); 
        }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
