// ==========================================
// CHAR_BILLGATES.JS - KỸ NĂNG REAL-TIME (KHÔNG KHỰNG, MƯỢT MÀ)
// ==========================================

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/39n8XdgJ/Generated-Image-July-05-2026-8-47-PM.png",
    skill: {},
    
    // 🟢 ULTIMATE REAL-TIME: Nhanh, gọn, mượt mà, không dừng hình
    executeUltimate: function(caster, target, baseDmg) {
        
        // Caster đứng lại vận chiêu trong thời gian rất ngắn
        caster.state = 'cast'; 
        caster.attackTimer = 40; 
        caster.vx = 0; 
        
        // Gọi tên Skill nho nhỏ trên đầu (noGravity giúp chữ trôi lơ lửng, không rớt đất)
        window.floatingTexts.push({ 
            x: caster.x, y: caster.y - 90, 
            text: "💻 BSOD HACK!", 
            color: "#00f3ff", alpha: 1.5, vx: 0, vy: -1.5, 
            font: "900 20px Arial", life: 50, scale: 1.2, targetScale: 1.0, scaleVel: 0, rot: 0, noGravity: true 
        });

        // Tiếng vận chiêu
        if(typeof window.playSound === 'function') window.playSound(600, 'sine', 0.2, 0.4);

        // Sau 300ms tung chiêu nổ damage trực tiếp mà KHÔNG ngưng đọng thời gian
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            // Rung màn hình nhẹ nhàng
            window.shakeScreen(10, 8);
            if(typeof window.playSound === 'function') window.playSound(200, 'square', 0.4, 0.8, true);
            
            // Chém 2 dải sóng Màn hình xanh
            if(typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#0984e3", true, 3.5, Math.PI/4);
                window.spawnSlash(target.x, target.y - 40, !caster.isFacingRight, "#74b9ff", true, 3.5, -Math.PI/4);
            }

            // Gây sát thương thực tế
            if(typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 4.0, "#0984e3", true, false, caster.isFacingRight);
            }

            // Văng ra vài cái popup ERROR nhỏ và Mưa Đô La nhỏ
            if(typeof window.spawnCustomObj === 'function') {
                for(let k = 0; k < 6; k++) {
                    // Mưa Đô la
                    window.spawnCustomObj(
                        target.x + (Math.random()-0.5)*60, target.y - 40, 
                        (Math.random() - 0.5) * 12, -Math.random() * 15 - 5, 
                        "💵", "#2ecc71", "18px Arial", 45, true
                    );
                    // Bảng lỗi Windows tí hon
                    if (k < 3) {
                        window.spawnCustomObj(
                            target.x + (Math.random()-0.5)*80, target.y - 60 + (Math.random()-0.5)*40, 
                            (Math.random() - 0.5) * 8, -Math.random() * 8, 
                            "🪟 ERROR", "#0984e3", "900 12px Arial", 35, false
                        );
                    }
                }
            }
            
            // Thêm hiệu ứng nhiễu sóng nhẹ
            window.impactAberration = 5;
            
        }, 300);
    },

    // Giữ nguyên phần vẽ đồ họa (Họa Sĩ)
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        ctx.strokeStyle = "#2c3e50"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#34495e"; ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        let headSize = 34; 
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
            ctx.fillStyle = "#ffddc1"; ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }

        ctx.save(); ctx.translate(handR.x, handR.y); ctx.rotate(p.isFacingRight ? 0.2 : -0.2); 
        ctx.fillStyle = "#0984e3"; ctx.shadowBlur = isTrail ? 0 : 15; ctx.shadowColor = "#00cec9"; ctx.fillRect(-6, -8, 12, 16); 
        ctx.strokeStyle = "#2d3436"; ctx.lineWidth = 2; ctx.shadowBlur = 0; ctx.strokeRect(-6, -8, 12, 16); ctx.restore();
        
        ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
