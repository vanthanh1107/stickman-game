// ==========================================
// CONFIG.JS - CHỈ SỐ NHÂN VẬT & CẤU HÌNH HỆ THỐNG
// ==========================================

window.classStats = {
    "dausi": { className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf" },
    "satthu": { className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, color: "#2ed573", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
        skill: {
            actionCode2: function(caster, target, ctx) {
                if(!target) return; let behindX = target.x + (target.isFacingRight ? -50 : 50);
                ctx.teleport(caster, behindX, target.y); caster.isFacingRight = target.x > caster.x; 
                caster.state = 'spinning_backfist'; caster.attackTimer = 15;
                ctx.takeDamage(target, 80 * caster.dmgMod, "#2ed573", true);
                ctx.floatingTexts.push({ x: target.x, y: target.y - 70, text: "BÁM SÁT!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 24px Arial", life: 40 });
            }
        }
    },
    "phapsu": { className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
        skill: {
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
        }
    },
    "hove": { className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
        skill: {
            actionCode2: function(caster, target, ctx) {
                caster.state = 'block'; caster.attackTimer = 30; ctx.setInvulnerable(caster, 60); 
                let healAmount = Math.floor(caster.maxHp * 0.2); caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
                ctx.playSound(300, 'sine', 0.5, 0.5); ctx.spawnParticles(caster.x, caster.y, "#e67e22", true);
                ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${healAmount} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -3, font: "900 28px Arial", life: 50 });
            }
        }
    },
    "thichkhach": { className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, color: "#dfe4ea", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf" }
};

window.GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXYZ_ABC_123/pub?gid=0&single=true&output=csv";
