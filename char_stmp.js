// ==========================================
// NHÂN VẬT: SƠN TÙNG M-TP
// CLASS: Sát Thủ Ánh Nhìn (Assassin)
// KỸ NĂNG: Lạc Trôi (Time-stop Backstab) -> Bầu Trời Năm Ấy (Air Combo)
// ==========================================

window.classStats = window.classStats || {};

window.classStats["char_mtp"] = {
    className: "stmb",
    hp: 120, 
    speed: 8, // Tốc độ di chuyển rất nhanh
    dmgMod: 1.5, 
    scale: 1.0, 
    color: "#00f3ff", // Xanh ngọc sếp Tùng
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=mtp&hairColor=Black",

    executeUltimate: async function(caster, target, baseDmg) {
        // --- PHASE 1: LẠC TRÔI (NGƯNG ĐỌNG THỜI GIAN) ---
        window.triggerTimeStop(220, caster);
        caster.isCinematic = true; // Bật khiên đạo diễn (bất tử, không rớt đất)
        
        // Camera quay cận cảnh Sếp
        window.setCamera(caster.x, caster.y - 50, 1.7);
        caster.state = 'taunt_dance'; // Múa nhẹ
        
        window.floatingTexts.push({ x: caster.x, y: caster.y - 120, text: "🎶 Lạc Trôi...", color: "#00f3ff", alpha: 1, vx: 0, vy: -1, font: "italic 900 40px Teko", life: 60 });
        
        // Chờ 1 giây (60 frame)
        await window.waitFrames(60, caster);

        // --- PHASE 2: CHẠY NGAY ĐI (TELEPORT BACKSTAB) ---
        let backstabX = target.x + (target.isFacingRight ? -70 : 70);
        caster.isFacingRight = target.x > backstabX;
        caster.state = 'dash';
        
        window.spawnParticles(caster.x, caster.y, "#fff");
        window.playSound(200, 'sine', 0.2, 0.5);
        
        // Tween lướt tới sau lưng mục tiêu cực mượt trong 10 frame
        await window.doTween(caster, { x: backstabX }, 10, 'easeOut', caster);

        window.setCamera(target.x, target.y - 40, 1.4);
        caster.state = 'uppercut';
        window.spawnSlash(target.x, target.y - 30, caster.isFacingRight, "#00f3ff", true, 3.0, -Math.PI/4);
        window.takeDamage(target, baseDmg * 2.0, "#00f3ff", true, false);
        window.shakeScreen(30, 15);
        
        // HẤT TUNG MỤC TIÊU LÊN TRỜI
        target.vy = -20; 
        target.onGround = false;
        
        await window.waitFrames(20, caster);

        // --- PHASE 3: BẦU TRỜI NĂM ẤY (AIR JUGGLE COMBO) ---
        // Sếp bay lên theo mục tiêu
        caster.state = 'levitate';
        await window.doTween(caster, { y: target.y - 100 }, 15, 'easeOut', caster);
        
        caster.state = 'asura_strike'; // Đấm ảo ảnh liên hoàn
        window.floatingTexts.push({ x: caster.x, y: caster.y - 100, text: "🌌 BẦU TRỜI NĂM ẤY!", color: "#ff00ff", alpha: 1, vx: 0, vy: -1, font: "900 50px Teko", life: 60 });
        
        // Chém 6 nhát lơ lửng trên không
        for(let i=0; i<6; i++) {
            if(target.hp <= 0 && target.maxHp < 1000) break; // Bỏ qua nếu mục tiêu (không phải boss) đã chết
            
            window.spawnSlash(target.x + (Math.random()-0.5)*50, target.y + (Math.random()-0.5)*50, caster.isFacingRight, "#ff00ff", false, 1.5, Math.random()*Math.PI);
            window.takeDamage(target, baseDmg * 0.4, "#ff00ff", false, false);
            target.vy = -2; // Giữ mục tiêu không bị rớt (Air juggle)
            window.playSound(350 + i*50, 'triangle', 0.1, 0.4, true); // Âm thanh cao dần
            
            await window.waitFrames(6, caster);
        }

        // --- PHASE 4: KẾT LIỄU ĐẠP CẮM XUỐNG ĐẤT ---
        window.resetCamera();
        caster.state = 'axe_kick'; // Cú đá chẻ từ trên xuống
        window.spawnSlash(target.x, target.y + 20, caster.isFacingRight, "#ff003c", true, 4.0, Math.PI/2);
        window.takeDamage(target, baseDmg * 1.8, "#ff003c", true, true);
        
        target.vy = 30; // Vận tốc rơi tự do cực gắt
        
        // Thả Sếp rơi xuống tự nhiên
        caster.isCinematic = false; 
    },

    // Sếp Tùng có Aura phát sáng màu xanh dưới chân
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        if (!isTrail && p.onGround) {
            ctx.save();
            let glow = 0.5 + Math.abs(Math.sin(Date.now() / 200)) * 0.5;
            ctx.globalCompositeOperation = 'lighter';
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
            grad.addColorStop(0, `rgba(0, 243, 255, ${glow * 0.6})`);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.ellipse(0, 0, 40, 10, 0, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }
        // Return undefined để cho Engine tự động vẽ thân hình (Graphics 3.0)
    }
};
