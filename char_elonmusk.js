window.currentLoadedChar = {
    id: "elonmusk",
    className: "Elon Musk",
    hp: 1200, 
    speed: 7, 
    dmgMod: 1.5, 
    color: "#e82127", // Đỏ Tesla
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=elonmusk&backgroundColor=ffcccc",
    skill: {},
    
    executeUltimate: function(caster, target, baseDmg) {
        // Trạng thái bấm Remote gọi xe Tesla
        caster.state = 'summon_tesla'; 
        caster.attackTimer = 60; 
        caster.vx = 0; // Đứng yên để bấm gọi xe
        
        // Mô phỏng thời gian xe Tesla lao đến (sau 400ms)
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            
            // Tạo hiệu ứng vệt xé gió màu Đỏ và Bạc kim loại (tượng trưng cho xe lướt qua với tốc độ cao)
            if(typeof window.spawnSlash === 'function') {
                window.spawnSlash(target.x, target.y - 20, caster.isFacingRight, "#e82127", true, 8.0, 0);
                window.spawnSlash(target.x, target.y - 5, caster.isFacingRight, "#bdc3c7", true, 6.0, 0);
            }
            
            if(typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 3.5, "#e82127", true, false, caster);
            }

            // Xử lý logic tông hất văng (Knockback cực mạnh)
            // Ghi đè gia tốc X và Y của mục tiêu để mô phỏng lực đâm của ô tô
            let knockbackForce = 25; 
            target.vx = caster.isFacingRight ? knockbackForce : -knockbackForce;
            target.vy = -12; // Hất tung bổng lên trời
            
            // Đưa mục tiêu vào trạng thái bị choáng/tuyệt chiêu nếu game có hỗ trợ
            target.state = 'hit';
            target.stunTimer = 30; // Choáng một lúc sau khi bị tông
            
        }, 400);
    },
    
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // Vẽ Thân (Mặc áo phông/áo khoác tông màu đen xám phong cách tỷ phú công nghệ)
        ctx.strokeStyle = "#1e272e"; 
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // Vẽ Chân tay (Cùng tông màu đen/xám)
        ctx.strokeStyle = "#2f3640"; 
        ctx.lineWidth = 4;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // Vẽ Đầu
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffeaa7"; // Màu da
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        // Vũ khí: Cầm một chiếc Remote điều khiển xe Tesla ở tay phải
        ctx.fillStyle = "#2d3436"; // Thân remote màu đen
        ctx.shadowBlur = isTrail ? 0 : 5; 
        ctx.shadowColor = "#ff7675"; // Tỏa sáng nhẹ màu đỏ khi gọi xe
        
        // Vẽ hình chữ nhật làm remote
        ctx.fillRect(handR.x - 4, handR.y - 6, 8, 12);
        
        // Vẽ nút bấm màu đỏ trên remote
        ctx.fillStyle = "#e82127";
        ctx.beginPath(); ctx.arc(handR.x, handR.y - 2, 2, 0, Math.PI*2); ctx.fill();
        
        // Vẽ Bàn tay / Bàn chân
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 4, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 4, 0, Math.PI*2); ctx.fill();
        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

// Lưu nhân vật vào danh sách class
if (!window.classStats) window.classStats = {};
window.classStats["elonmusk"] = window.currentLoadedChar;
