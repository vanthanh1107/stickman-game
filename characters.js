// ==========================================
// 3. CHARACTERS.JS - KHUNG XƯƠNG CƠ BẢN VÀ GẮN TRANG BỊ
// ==========================================

window.assignDrawMethods = function(statsObj) {
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

    for (let id in statsObj) {
        let type = id.trim().toLowerCase();
        statsObj[id].drawMethod = function(ctx, p, bounce, ext, pext, isTrail) {
            let pts = drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
            let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
            const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
            
            if (type === 'phapsu' && !isTrail) { ctx.strokeStyle = "rgba(155, 89, 182, 0.4)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 12, pelvis.y + 10); ctx.stroke(); }
            if (type === 'thichkhach' && !isTrail) { ctx.strokeStyle = "rgba(241, 196, 15, 0.4)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(neck.x - 25, neck.y + 15 + Math.sin(Date.now()/120)*4); ctx.stroke(); }
            
            ctx.strokeStyle = "#fff"; ctx.lineWidth = (type === 'hove') ? 6 : 5;
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
            drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);
            ctx.beginPath(); ctx.arc(head.x, head.y, (type === 'hove') ? 11 : 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke();
            
            if (type === 'dausi') {
                if (!isTrail) { ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(head.x - 10, head.y); ctx.lineTo(head.x - 22, head.y + 5 + Math.sin(Date.now()/150)*3); ctx.moveTo(head.x - 10, head.y + 2); ctx.lineTo(head.x - 18, head.y + 12 + Math.cos(Date.now()/150)*2); ctx.stroke(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; }
                ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#ff9f43"; ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
            } else if (type === 'satthu') {
                ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#2ed573"; ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - 15, handL.y + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 18, handR.y - 5); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'phapsu') {
                ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); ctx.fillStyle = "#9b59b6"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#9b59b6"; ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'hove') {
                if(!isTrail) { ctx.save(); ctx.translate(handL.x, handL.y); ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; ctx.fillRect(-8, -20, 16, 40); ctx.strokeRect(-8, -20, 16, 40); ctx.restore(); }
                ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 15, handR.y - 15); ctx.stroke(); ctx.fillStyle = "#57606f"; ctx.beginPath(); ctx.arc(handR.x + 15, handR.y - 15, 5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'thichkhach') {
                ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 2; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#fff"; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 30, handR.y - 12); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            }
            if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
        };
    }
}
