// ==========================================
// CHARACTERS.JS - KHO DỮ LIỆU & ĐỒ HỌA NHÂN VẬT
// ==========================================

// 1. CHỈ SỐ MẶC ĐỊNH CỦA CÁC CLASS (Sẽ được Google Sheets cập nhật đè lên sau)
window.classStats = {
    "dausi": { className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf" },
    "satthu": { className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, color: "#2ed573", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf" },
    "phapsu": { className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf" },
    "hove": { className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf" },
    "thichkhach": { className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, color: "#dfe4ea", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf" }
};

// 2. HỆ THỐNG GẮN ĐỒ HỌA (VŨ KHÍ, ÁO CHOÀNG, HIỆU ỨNG) CHO TỪNG NHÂN VẬT
window.assignDrawMethods = function(statsObj) {
    
    // Hàm vẽ khung xương cơ bản (Chạy chung cho mọi nhân vật để tối ưu tốc độ)
    let drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
        let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
        let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
        let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
        
        if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
        if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } 
        else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } 
        else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } 
        else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } 
        else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } 
        else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } 
        else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
        
        return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    };

    // Duyệt qua từng nhân vật và Gắn phụ kiện tương ứng
    for (let id in statsObj) {
        let type = id.trim().toLowerCase();
        
        statsObj[id].drawMethod = function(ctx, p, bounce, ext, pext, isTrail) {
            let pts = drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
            let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
            const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
            
            // ------------------------------------
            // 1. LỚP BACKGROUND (Áo choàng bay phía sau lưng)
            // ------------------------------------
            if (type === 'phapsu' && !isTrail) { 
                ctx.strokeStyle = "rgba(155, 89, 182, 0.4)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 12, pelvis.y + 10); ctx.stroke(); 
            }
            if (type === 'thichkhach' && !isTrail) { 
                ctx.strokeStyle = "rgba(241, 196, 15, 0.4)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(neck.x - 25, neck.y + 15 + Math.sin(Date.now()/120)*4); ctx.stroke(); 
            }
            
            // ------------------------------------
            // 2. LỚP CƠ THỂ CHÍNH
            // ------------------------------------
            ctx.strokeStyle = "#fff"; ctx.lineWidth = (type === 'hove') ? 6 : 5; // Hộ vệ xương to hơn
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
            drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);
            ctx.beginPath(); ctx.arc(head.x, head.y, (type === 'hove') ? 11 : 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke();
            
            // ------------------------------------
            // 3. LỚP FOREGROUND (Vũ khí, Phụ kiện phía trước)
            // ------------------------------------
            if (type === 'dausi') {
                if (!isTrail) { ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(head.x - 10, head.y); ctx.lineTo(head.x - 22, head.y + 5 + Math.sin(Date.now()/150)*3); ctx.moveTo(head.x - 10, head.y + 2); ctx.lineTo(head.x - 18, head.y + 12 + Math.cos(Date.now()/150)*2); ctx.stroke(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; }
                ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#ff9f43"; ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
            } 
            else if (type === 'satthu') {
                ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#2ed573"; ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - 15, handL.y + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 18, handR.y - 5); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } 
            else if (type === 'phapsu') {
                ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); ctx.fillStyle = "#9b59b6"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#9b59b6"; ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } 
            else if (type === 'hove') {
                if(!isTrail) { ctx.save(); ctx.translate(handL.x, handL.y); ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; ctx.fillRect(-8, -20, 16, 40); ctx.strokeRect(-8, -20, 16, 40); ctx.restore(); }
                ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 15, handR.y - 15); ctx.stroke(); ctx.fillStyle = "#57606f"; ctx.beginPath(); ctx.arc(handR.x + 15, handR.y - 15, 5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } 
            else if (type === 'thichkhach') {
                ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 2; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#fff"; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 30, handR.y - 12); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            }
            
            // Vẽ bàn chân khi xuất cước
            if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
        };
    }
}
