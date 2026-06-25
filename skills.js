// ==========================================
// 2. SKILLS.JS - KHO KỸ NĂNG VÀ TUYỆT CHIÊU
// ==========================================

window.classSkills = {
    "satthu": {
        actionCode2: function(caster, target, ctx) {
            if(!target) return; let behindX = target.x + (target.isFacingRight ? -50 : 50);
            ctx.teleport(caster, behindX, target.y); caster.isFacingRight = target.x > caster.x; 
            caster.state = 'spinning_backfist'; caster.attackTimer = 15;
            ctx.takeDamage(target, 80 * caster.dmgMod, "#2ed573", true);
            ctx.floatingTexts.push({ x: target.x, y: target.y - 70, text: "BÁM SÁT!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 24px Arial", life: 40 });
        }
    },
    "phapsu": {
        actionCode1: function(caster, target, ctx) {
            caster.state = 'cast'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? -8 : 8; 
            ctx.playSound(600, 'sine', 0.2, 0.5);
            let bulletVx = caster.isFacingRight ? 12 : -12;
            ctx.spawnProjectile(caster.x, caster.y - 40, bulletVx, 0, 12, "#9b59b6", 45 * caster.dmgMod, target);
        },
        actionCode3: function(caster, target, ctx) {
            caster.state = 'cast'; caster.attackTimer = 40; ctx.shakeScreen(30, 15); ctx.playSound(100, 'sawtooth', 0.8, 0.8);
            window.enemies.forEach(e => { ctx.spawnProjectile(e.x, -50, 0, 20, 15, "#f1c40f", 100 * caster.dmgMod, e); });
        }
    },
    "hove": {
        actionCode2: function(caster, target, ctx) {
            caster.state = 'block'; caster.attackTimer = 30; ctx.setInvulnerable(caster, 60); 
            let healAmount = Math.floor(caster.maxHp * 0.2); caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
            ctx.playSound(300, 'sine', 0.5, 0.5); ctx.spawnParticles(caster.x, caster.y, "#e67e22", true);
            ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${healAmount} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -3, font: "900 28px Arial", life: 50 });
        }
    }
};

// Hàm bơm kỹ năng vào classStats (Sẽ được gọi tự động ở main.js)
window.injectSkills = function() {
    for (let id in window.classSkills) {
        if (window.classStats && window.classStats[id]) {
            window.classStats[id].skill = window.classSkills[id];
        }
    }
};
