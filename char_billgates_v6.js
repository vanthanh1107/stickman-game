// ==========================================
// CHAR_BILLGATES.JS - NHÂN VẬT BILL GATES (AUTO-CAST SKILLS & PNG SUPPORT)
// ==========================================

window.currentLoadedChar = {
    id: "billgates",
    className: "Bill Gates",
    hp: 1100, speed: 6, dmgMod: 1.6, color: "#0984e3",
    avatarUrl: "https://i.ibb.co/39n8XdgJ/Generated-Image-July-05-2026-8-47-PM.png",
    
    // ==========================================
    // ⭐ MẢNG KỸ NĂNG TỰ ĐỘNG (AUTO-CAST SKILLS) ⭐
    // ==========================================
    skills: [
        {
            name: "Cập Nhật Windows 11 (Ép buộc)",
            cooldown: 180, // Hồi chiêu 3 giây
            staminaCost: 20,
            minRange: 0, 
            maxRange: 150, // Cận chiến
            currentCooldown: 0,
            execute: function(caster, target, ctx) {
                caster.state = 'cast'; 
                caster.attackTimer = 30;
                
                // Lướt tới áp sát
                ctx.dash(caster, caster.isFacingRight ? 12 : -12, 0);
                ctx.playSound(600, 'sine', 0.3, 0.6);
                
                // Giam cầm & Làm choáng kẻ địch (Update 1%)
                setTimeout(() => {
                    if (Math.abs(caster.x - target.x) < 180) {
                        ctx.takeDamage(target, 25 * caster.dmgMod, "#0984e3", false, false, caster.isFacingRight);
                        target.state = 'stunned'; target.stunTimer = 90; // Choáng 1.5 giây
                        ctx.spawnAura(target.x, window.GROUND_Y, "rgba(9, 132, 227, 0.6)", 60, 90); // Vòng aura xanh
                        ctx.floatingTexts.push({ x: target.x, y: target.y - 80, text: "⏳ UPDATING 1%...", color: "#00f3ff", alpha: 1.5, vx: 0, vy: -2, font: "900 25px Arial", life: 80, scale: 2.0, targetScale: 1.0, scaleVel: 0, rot: 0 });
                    }
                }, 100);
            }
        },
        {
            name: "Pay To Win (Tiền Đè Chết Người)",
            cooldown: 120, // Hồi chiêu 2 giây
            staminaCost: 15,
            minRange: 200, 
            maxRange: 800, // Đánh xa
            currentCooldown: 0,
            execute: function(caster, target, ctx) {
                caster.state = 'cast'; 
                caster.attackTimer = 25;
                ctx.playSound(800, 'sawtooth', 0.2, 0.4);
                
                // Bắn ra 3 tệp Đô La (Đạn xanh lá) liên tiếp
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        if (caster.hp <= 0) return;
                        let vx = caster.isFacingRight ? 18 : -18;
                        let vy = (Math.random() - 0.5) * 4;
                        ctx.spawnProjectile(caster.x, caster.y - 40 + vy * 5, vx, vy, 14, "#2ecc71", 20 * caster.dmgMod, target);
                        ctx.spawnParticles(caster.x, caster.y - 40, "#2ecc71"); // Văng hạt xanh lá
                    }, i * 150); // Bắn cách nhau 150ms
                }
            }
        },
        {
            name: "Ctrl + Alt + Delete (Xóa Sổ)",
            cooldown: 300, // Hồi chiêu 5 giây
            staminaCost: 35,
            minRange: 100,
            maxRange: 600,
            currentCooldown: 0,
            execute: function(caster, target, ctx) {
                caster.state = 'bsod_hack'; // Tạo dáng gõ phím
                caster.attackTimer = 40;
                ctx.shakeScreen(20, 10);
                ctx.playSound(200, 'square', 0.5, 0.8, true);
                
                // 1. Tạo Hố Đen (Thùng Rác Recycle Bin) hút địch lại
                ctx.spawnBlackHole(target.x, target.y, 80, 50);
                ctx.spawnSpaceRipple(target.x, target.y - 40, "#9b59b6");
                
                // 2. Chém một nhát Xóa Sổ (Delete) cực mạnh
                setTimeout(() => {
                    ctx.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#fff", true, 3.5, Math.PI/4);
                    ctx.takeDamage(target, 55 * caster.dmgMod, "#9b59b6", true, true, caster.isFacingRight);
                    ctx.floatingTexts.push({ x: target.x, y: target.y - 120, text: "🗑️ DELETED!", color: "#e74c3c", alpha: 1.5, vx: 0, vy: -5, font: "italic 900 40px 'Arial Black'", life: 60, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: 0 });
                }, 400);
            }
        }
    ],

    // ==========================================
    // ⭐ TUYỆT CHIÊU CUỐI: BLUE SCREEN OF DEATH ⭐
    // ==========================================
    executeUltimate: function(caster, target, baseDmg, ctx) {
        caster.state = 'bsod_hack'; 
        caster.attackTimer = 60; 
        caster.vx = 0; 
        
        // 1. NGƯNG ĐỌNG THỜI GIAN THE WORLD
        ctx.triggerTimeStop(60, caster);
        
        // 2. CHUYỂN CẢNH CINEMATIC CHẺ MÀN HÌNH
        ctx.triggerCinematic(caster, () => {
            // 3. ĐỔI MÀN HÌNH THÀNH MÀU XANH BSOD ĐÁNG SỢ
            ctx.applyFilter('blue', 40); 
            ctx.shakeScreen(40, 20);
            ctx.playSound(100, 'square', 1.5, 1.0, true);
            
            // 4. Giáng sấm sét chém thẳng vào MỌI KẺ ĐỊCH TRÊN BẢN ĐỒ
            ctx.enemies.forEach(e => {
                if (e.hp > 0) {
                    // Tạo trụ ánh sáng xanh
                    ctx.spawnEnergyPillar(e.x, window.GROUND_Y, "rgba(9, 132, 227, 0.5)", 80, 20);
                    // Giật sét
                    ctx.spawnLightning(e.x, e.y - 40, "#0984e3", 60, 4);
                    // Chém 2 vệt Xanh Dương chữ X
                    ctx.spawnSlash(e.x, e.y - 30, true, "#0984e3", true, 5.0, Math.PI/4);
                    ctx.spawnSlash(e.x, e.y - 30, false, "#74b9ff", true, 4.0, -Math.PI/4);
                    // Trừ máu & Băng sát
                    ctx.takeDamage(e, baseDmg * 3.5, "#0984e3", true, false, caster.isFacingRight);
                    ctx.floatingTexts.push({ x: e.x, y: e.y - 120, text: "FATAL_ERROR", color: "#fff", alpha: 1.5, vx: 0, vy: -6, font: "900 45px monospace", life: 80, scale: 3.0, targetScale: 1.0, scaleVel: 0, rot: 0 });
                }
            });
        });
    },

    // ==========================================
    // VẼ NGOẠI HÌNH: ÁO VEST, TABLET & PNG HEAD
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Vẽ Thân (Mặc áo len/vest màu xanh dương đậm)
        ctx.strokeStyle = "#2c3e50"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // 2. Vẽ Chân tay
        ctx.strokeStyle = "#34495e"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 3. VẼ ĐẦU NHÂN VẬT (PNG SUPPORT)
        let headSize = 34;
        let faceDir = p.isFacingRight ? 1 : -1;
        let currentAvatar = p.avatarUrl;
        
        if (!currentAvatar && window.currentLoadedChar) currentAvatar = window.currentLoadedChar.avatarUrl;

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
                // Xoay ảnh nếu quay mặt (Tùy chọn)
                if(!p.isFacingRight) ctx.scale(-1, 1);
                ctx.drawImage(img, -headSize / 2, -headSize / 2, headSize, headSize);
                ctx.restore();
            } else { drawFallbackHead(); }
        } else { drawFallbackHead(); }

        function drawFallbackHead() {
            ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
            ctx.fillStyle = "#ffddc1"; ctx.fill(); 
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        }

        // 4. Vũ khí: Cầm Tablet Windows ở tay phải
        ctx.fillStyle = "#0984e3"; 
        ctx.shadowBlur = isTrail ? 0 : 8; 
        ctx.shadowColor = "#00cec9"; 
        ctx.fillRect(handR.x - 6, handR.y - 8, 12, 16);
        
        // 5. Vẽ Bàn tay / Bàn chân
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

if (!window.classStats) window.classStats = {};
window.classStats["billgates"] = window.currentLoadedChar;
