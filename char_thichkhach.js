// ==========================================
// FILE: characters/thichkhach.js (Thích Khách)
// ==========================================

const CharacterModule = {
    id: "thichkhach",
    className: "Thích Khách",
    hp: 1200,
    speed: 7,
    dmgMod: 1.8,
    color: "#dfe4ea",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf",
    
    skill: {},

    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'one_inch_punch'; 
        caster.attackTimer = 38;
        caster.vx = caster.isFacingRight ? 10 : -10;
        setTimeout(() => { 
            if(window.gameOver || caster.hp <= 0) return;
            if(typeof window.spawnSlash === 'function') window.spawnSlash(target.x, target.y - 40, caster.isFacingRight, "#f1c40f", true, 4.0, 0);
            if(typeof window.takeDamage === 'function') window.takeDamage(target, baseDmg * 2.5, "#f1c40f", true, false, caster);
        }, 300);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // Vẽ Phụ kiện Background
        if (!isTrail) { 
            ctx.strokeStyle = "rgba(241, 196, 15, 0.4)"; ctx.lineWidth = 3; 
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(neck.x - 25, neck.y + 15 + Math.sin(Date.now()/120)*4); ctx.stroke(); 
        }

        // Vẽ Body Khung xương chính
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Vẽ Phụ kiện Foreground
        ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 2; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#fff"; 
        ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 30, handR.y - 12); ctx.stroke();
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();

        if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
    }
};

window.currentLoadedChar = CharacterModule;
