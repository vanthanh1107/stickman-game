// ==========================================
// CHAR_BILLGATES.JS - KỊCH BẢN COMBAT NHƯ PHIM ANIME
// ==========================================

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/39n8XdgJ/Generated-Image-July-05-2026-8-47-PM.png",
    skill: {},
    
    // 🟢 HỆ THỐNG COMBAT THEO CỐT TRUYỆN (CHOREOGRAPHY)
    executeUltimate: function(caster, target, baseDmg) {
        
        // Khóa AI của cả 2 để diễn kịch bản
        caster.aiDelay = 999; 
        target.aiDelay = 999;
        
        // Bắt đầu Đạo diễn Kịch bản theo từng Frame (Khung hình - 60 FPS)
        window.playSequence([
            // 🎬 FRAME 1: Bắt đầu ngưng đọng thời gian, Bill Gates đọc thoại
            { frame: 1, action: () => {
                caster.state = 'cast'; caster.vx = 0; target.vx = 0; target.state = 'idle';
                window.targetZoom = 1.6; // Cận cảnh
                window.targetCamOrbitAngle = caster.isFacingRight ? -0.5 : 0.5; // Góc quay nghiêng 3D
                window.applyFilter('dark', 100); // Tối màn hình
                window.playSound(400, 'sine', 0.5, 0.5);
                
                window.floatingTexts.push({ 
                    x: caster.x, y: caster.y - 120, 
                    text: "Ngươi xài Windows lậu?!", 
                    color: "#00f3ff", alpha: 1.5, vx: 0, vy: -1, font: "900 35px Arial", life: 80, scale: 2.5 
                });
            }},

            // 🎬 FRAME 60: Hết thoại, lao chớp nhoáng ra sau lưng kẻ địch (Hất tung)
            { frame: 60, action: () => {
                caster.x = target.x + (caster.isFacingRight ? 50 : -50); // Dịch chuyển ra sau lưng
                caster.isFacingRight = !caster.isFacingRight; // Quay mặt lại
                caster.state = 'uppercut';
                
                window.shakeScreen(15, 10);
                window.playSound(600, 'square', 0.2, 0.8, true);
                window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#0984e3", true, 3.0, -Math.PI/4);
                window.impactAberration = 15;
                window.hitStopFrames = 10; // Khựng khung hình tạo lực
                
                // Hất kẻ địch bay vút lên trời
                target.state = 'hurt';
                target.vy = -18; 
                target.onGround = false;
            }},

            // 🎬 FRAME 80: Kẻ địch đang bay trên trời, Bill Gates dịch chuyển bay theo đạp xuống
            { frame: 80, action: () => {
                caster.x = target.x;
                caster.y = target.y - 80; // Dịch chuyển lên trên đầu kẻ địch
                caster.onGround = false;
                caster.state = 'axe_kick'; // Đạp xuống
                
                window.shakeScreen(10, 8);
                window.spawnSlash(target.x, target.y, caster.isFacingRight, "#fff", true, 4.0, Math.PI/2);
                
                // Đóng đối thủ xuống đất với tốc độ bàn thờ
                target.vy = 25; 
            }},

            // 🎬 FRAME 95: Kẻ địch đập mặt xuống đất nát sàn
            { frame: 95, action: () => {
                window.shakeScreen(40, 25);
                window.playSound(200, 'sawtooth', 0.5, 1.0, true);
                window.spawnEnergyPillar(target.x, window.GROUND_Y, "rgba(9, 132, 227, 0.6)", 60, 40); // Khói xanh bốc lên
                
                // Triệu hồi cửa sổ báo lỗi 404 đè lên người
                window.spawnCustomObj(target.x, window.GROUND_Y - 50, 0, 0, "🪟 SYSTEM FAILURE", "#0984e3", "900 30px 'Arial Black'", 60, false);
            }},

            // 🎬 FRAME 130: Búng tay kích nổ Màn Hình Xanh & Mưa Đô La (Kết liễu)
            { frame: 130, action: () => {
                caster.y = window.GROUND_Y; caster.onGround = true; caster.state = 'taunt_flex';
                
                window.screenFlash = 1.0;
                window.applyFilter('invert', 15);
                window.playSound(800, 'triangle', 0.8, 1.5, true);
                window.targetZoom = 1.1; // Trả camera về bình thường
                window.targetCamOrbitAngle = 0;

                // Nổ sát thương thực tế
                if(typeof window.takeDamage === 'function') {
                    window.takeDamage(target, baseDmg * 5.0, "#0984e3", true, false, caster.isFacingRight);
                }

                // Mưa Đô la tung tóe
                if(typeof window.spawnCustomObj === 'function') {
                    for(let k = 0; k < 20; k++) {
                        window.spawnCustomObj(
                            target.x + (Math.random()-0.5)*100, target.y - 50, 
                            (Math.random() - 0.5) * 30, -Math.random() * 25 - 5, 
                            "💵", "#2ecc71", "35px Arial", 80, true
                        );
                    }
                }
                
                // Trả lại AI cho 2 nhân vật
                caster.aiDelay = 0; 
                target.aiDelay = 0;
            }}
        ]);
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
