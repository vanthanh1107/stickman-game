// ==========================================
// CHAR_DONALDTRUMP.JS - KỸ NĂNG REAL-TIME (KHÔNG KHỰNG, MƯỢT MÀ)
// ==========================================

window.currentLoadedChar = {
    id: "donaldtrump",
    className: "Donald Trump",
    hp: 1200, speed: 5, dmgMod: 1.8, color: "#e74c3c", // Trâu hơn một chút, đòn đánh mạnh
    // Bạn có thể thay link URL dưới đây bằng ảnh khuôn mặt Trump đã tách nền (PNG)
    avatarUrl: "https://i.ibb.co/zhGqyH13/donald-trump.png", 
    skill: {},
    
    // 🟢 ULTIMATE REAL-TIME: "YOU'RE FIRED!" & Xây tường
    executeUltimate: function(caster, target, baseDmg) {
        
        // Caster đứng lại vận chiêu trong thời gian rất ngắn
        caster.state = 'cast'; 
        caster.attackTimer = 40; 
        caster.vx = 0; 
        
        // Gọi tên Skill nho nhỏ trên đầu
        window.floatingTexts.push({ 
            x: caster.x, y: caster.y - 90, 
            text: "🦅 YOU'RE FIRED!", 
            color: "#e74c3c", alpha: 1.5, vx: 0, vy: -1.5, 
            font: "900 22px Arial", life: 50, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        // Tiếng vận chiêu (Âm thanh uy lực hơn)
        if(typeof window.playSound === 'function') window.playSound(300, 'sawtooth', 0.2, 0.5);

        // Sau 300ms tung chiêu nổ damage trực tiếp mà KHÔNG ngưng đọng thời gian
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            // Rung màn hình mạnh (Quyền lực)
            window.shakeScreen(15, 10);
            if(typeof window.playSound === 'function') window.playSound(150, 'square', 0.5, 0.8, true);
            
            // Chém 2 dải sóng Đỏ và Vàng kim (Màu cờ Mỹ / Quyền lực)
            if(typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#c0392b", true, 4.0, Math.PI/4);
                window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#f1c40f", true, 4.0, -Math.PI/4);
            }

            // Gây sát thương cực lớn
            if(typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.5, "#e74c3c", true, false, caster.isFacingRight);
            }

            // Văng ra gạch (Xây tường) và Mưa Đô La
            if(typeof window.spawnCustomObj === 'function') {
                for(let k = 0; k < 8; k++) {
                    // Mưa Đô la
                    window.spawnCustomObj(
                        target.x + (Math.random()-0.5)*80, target.y - 50, 
                        (Math.random() - 0.5) * 15, -Math.random() * 12 - 5, 
                        "💵", "#2ecc71", "20px Arial", 50, true
                    );
                    // Tường gạch rơi lả tả
                    if (k < 4) {
                        window.spawnCustomObj(
                            target.x + (Math.random()-0.5)*60, target.y - 70 + (Math.random()-0.5)*30, 
                            (Math.random() - 0.5) * 10, -Math.random() * 15, 
                            "🧱", "#e67e22", "22px Arial", 40, true
                        );
                    }
                }
            }
            
            // Hiệu ứng chấn động
            window.impactAberration = 6;
            
        }, 300);
    },

    // 🎨 HỌA SĨ: Vẽ ngoại hình Donald Trump (Vest Navy, Cà vạt đỏ dài, Cầm gậy Golf)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Áo Vest Xanh Navy (Dark Navy Suit)
        ctx.strokeStyle = "#192a56"; 
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. Chân và tay khoác vest (Xanh Navy)
        ctx.strokeStyle = "#273c75"; 
        ctx.lineWidth = 5;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 3. Cà vạt đỏ cực dài đặc trưng (Red Tie)
        ctx.strokeStyle = "#c0392b"; 
        ctx.lineWidth = 3;
        ctx.beginPath(); 
        ctx.moveTo(neck.x, neck.y); 
        // Vẽ cà vạt trễ xuống tận 70% thân người
        ctx.lineTo(neck.x + (pelvis.x - neck.x) * 0.7, neck.y + (pelvis.y - neck.y) * 0.7); 
        ctx.stroke();

        // 4. Vẽ Đầu (Avatar)
        let headSize = 36; // Đầu to hơn một chút
        let currentAvatar = p.avatarUrl;
        if (!currentAvatar && p.classId && window.classStats && window.classStats[p.classId]) { currentAvatar = window.classStats[p.classId].avatarUrl; }
        if (!currentAvatar && window.currentLoadedChar) { currentAvatar = window.currentLoadedChar.avatarUrl; }

        if (currentAvatar) {
            if (!window.avatarImageCache) window.avatarImageCache = {};
            if (!window.avatarImageCache[currentAvatar]) {
                let img = new Image(); img.crossOrigin = "Anonymous"; img.src = currentAvatar; window.avatarImageCache[currentAvatar] = img;
            }
            let img = window.avatarImageCache[currentAvatar];
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.save(); ctx.translate(head.x, head.y - 4); ctx.rotate((p.vx || 0) * 0.05);
                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize); ctx.restore();
            } else { drawFallbackHead(); }
        } else { drawFallbackHead(); }

        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#f39c12"; // Tóc/Da hơi cam cam
            ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }

        // 5. Vẽ vũ khí (Gậy đánh Golf ở tay phải)
        ctx.save(); 
        ctx.translate(handR.x, handR.y); 
        ctx.rotate(p.isFacingRight ? 0.8 : -0.8); 
        
        // Cán gậy (Shaft)
        ctx.strokeStyle = "#bdc3c7"; // Bạc
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -35); ctx.stroke();
        
        // Đầu gậy Golf (Club head)
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(-6, -35, 12, 6);
        ctx.restore();
        
        // Vẽ bàn tay
        ctx.fillStyle = "#ffddc1"; // Da người
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        
        // Vẽ bàn chân khi đá
        if (p.state === 'kick') { ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["donaldtrump"] = window.currentLoadedChar;
