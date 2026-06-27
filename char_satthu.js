// ==========================================
// FILE: char_satthu.js (Sát Thủ)
// ==========================================

const CharacterModule = {
    id: "satthu",
    className: "Sát Thủ",
    hp: 1000,
    speed: 8,
    dmgMod: 2.0,
    color: "#2ed573",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
    
    skill: {
        actionCode2: function(caster, target, ctx) {
            if(!target) return; 
            let behindX = target.x + (target.isFacingRight ? -50 : 50);
            if(ctx && ctx.teleport) ctx.teleport(caster, behindX, target.y); 
            caster.isFacingRight = target.x > caster.x; 
            caster.state = 'spinning_backfist'; caster.attackTimer = 15;
            if(ctx && ctx.takeDamage) ctx.takeDamage(target, 80 * caster.dmgMod, "#2ed573", true);
            if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: target.x, y: target.y - 70, text: "BÁM SÁT!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 24px Arial", life: 40 });
        }
    },

    executeUltimate: function(caster, target, baseDmg) {
        caster.x = target.x + (target.x > caster.x ? -40 : 40);
        caster.isFacingRight = target.x > caster.x;
        caster.state = 'asura_strike'; 
        caster.attackTimer = 35;
        setTimeout(() => { 
            if (!window.gameOver && typeof window.takeDamage === 'function') {
                window.takeDamage(target, baseDmg * 2.5, "#2ed573", true, false, caster);
            }
        }, 200);
    },

    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // Vẽ Body Khung xương chính
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        ctx.beginPath(); ctx.arc(head.x, head.y, 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke(); 
        
        // Gắn vũ khí: Song Dao phát sáng xanh của Sát Thủ
        ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = isTrail ? 0 : 10; ctx.shadowColor = "#2ed573"; 
        ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - 18, handL.y + 12); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 20, handR.y - 8); ctx.stroke();
        
        ctx.shadowBlur = 0; ctx.fillStyle = p.color; 
        ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); 
        ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
    }
};

window.currentLoadedChar = CharacterModule;
