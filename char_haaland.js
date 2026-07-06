// ==========================================
// HAALAND STATS & SKILLS (THE CYBORG VIKING)
// ==========================================
window.currentLoadedChar = {
    id: "haaland",
    className: "Haaland",
    hp: 1200,    // Very tanky
    maxHp: 1200,
    speed: 6.5,  // Slower but relentless
    dmgMod: 1.5, // Heavy hitter
    color: "#74b9ff", // Man City Light Blue
    scale: 1.15, // Giant body size
    avatarUrl: "https://i.ibb.co/Q7HGd3vL/Generated-Image-July-07-2026-6-45-AM.png", // Replace with your image
    
    // BASIC ATTACK: Heavy and brutal strikes
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        if (caster.comboStep === 0) { caster.state = 'jab'; caster.vx = caster.isFacingRight ? 8 : -8; }
        else if (caster.comboStep === 1) { caster.state = 'hook'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else { caster.state = 'heavy_kick'; caster.vx = caster.isFacingRight ? 15 : -15; }
        
        caster.attackTimer = 18; // Slower attack animation than Mbappe but hits harder
        if (typeof window.playSound === 'function') window.playSound(200, 'square', 0.1, 0.2);

        enemies.forEach(target => {
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 110) {
                let damage = 15 * caster.dmgMod;
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 30, "#74b9ff", false);
            }
        });
    },

    skill: {
        // SKILL 1: "VIKING SMASH" (The requested skill - Smashes ground at enemy location)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'smash_down'; 
            caster.attackTimer = 35; // Long windup
            
            // Find target location or smash in front if no target
            let targetX = target ? target.x : caster.x + (caster.isFacingRight ? 120 : -120);
            
            // Instantly leap to the target's position
            caster.x = targetX - (caster.isFacingRight ? 30 : -30);
            caster.vx = 0;

            // Earthquake and Sound effects
            if(ctx && ctx.playSound) ctx.playSound(100, 'sawtooth', 0.6, 0.8);
            if(typeof window.shakeScreen === 'function') window.shakeScreen(25, 20); // Heavy screen shake

            // Spawn massive dust at impact zone
            if(ctx && ctx.spawnDust) { 
                for(let i=0; i<8; i++) ctx.spawnDust(targetX + (Math.random()*60-30), window.GROUND_Y); 
            }

            // Visual: Create a ground crack (Using static text/symbols on the ground that fades away)
            if(ctx && ctx.floatingTexts) {
                // The Ground Crack Graphic (Stays on ground, doesn't move up)
                ctx.floatingTexts.push({ 
                    x: targetX, y: window.GROUND_Y + 5, 
                    text: "💥/\\/\\/\\💥", // Simulating a crack
                    color: "#2d3436", alpha: 1, vx: 0, vy: 0, 
                    font: "900 28px Arial", life: 60 
                });
                
                // Skill Name Text
                ctx.floatingTexts.push({ 
                    x: caster.x, y: caster.y - 100, 
                    text: "⚒️ VIKING SMASH!", color: "#74b9ff", alpha: 1, vx: 0, vy: -1.5, 
                    font: "900 20px Arial", life: 40 
                });
            }

            // Deal heavy AOE damage and stun
            if(target && Math.abs(target.x - caster.x) < 150) {
                if(ctx && ctx.takeDamage) ctx.takeDamage(target, 45 * caster.dmgMod, "#e17055", true, true, caster);
                target.vy = -10; // Bounce enemy off the ground
                target.hitStun = 40; // Stun them
            }
        },
        
        // SKILL 2: "CYBORG CHARGE" (Shoulder tackle like a truck)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'shoulder_bash'; 
            caster.attackTimer = 20; 
            caster.vx = caster.isFacingRight ? 35 : -35; // Heavy fast charge
            caster.iFrames = 20; // Super armor during charge
            
            if(ctx && ctx.playSound) ctx.playSound(250, 'square', 0.3, 0.5);
            if(target && Math.abs(target.x - caster.x) < 130) {
                if(ctx && ctx.takeDamage) ctx.takeDamage(target, 25 * caster.dmgMod, "#fdcb6e", true, false, caster);
                target.vx = caster.isFacingRight ? 25 : -25; // Knockback extremely far
                if(ctx && ctx.floatingTexts) ctx.floatingTexts.push({ x: target.x, y: target.y - 80, text: "🤖 CYBORG FORCE!", color: "#fdcb6e", alpha: 1, vx: 0, vy: -2, font: "900 16px Arial", life: 30 });
            }
        }
    },
    
    // ==========================================
    // ULTIMATE: "PROTOCOL: GOAL MACHINE"
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        if (typeof window.focusCinematic === 'function') window.focusCinematic(100);
        window.targetZoom = 1.4;
        window.targetCamX = (window.canvas.width / 2) - caster.x;

        caster.state = 'power_up'; // Powering up like a machine
        caster.attackTimer = 100;
        caster.vx = 0;
        caster.iFrames = 100;

        if (typeof window.playSound === 'function') window.playSound(150, 'sine', 0.8, 1.5); 
        
        // Scan Effect
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 120, text: "🤖 TARGET ACQUIRED. INITIATING...", color: "#00cec9", alpha: 1, vx: 0, vy: -0.5, font: "900 22px Courier New", life: 70 });
        }

        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            // Teleport behind target
            caster.x = target.x + (caster.isFacingRight ? 50 : -50);
            caster.isFacingRight = !caster.isFacingRight; // Turn around

            if (typeof window.shakeScreen === 'function') window.shakeScreen(30, 20);
            if (typeof window.playSound === 'function') window.playSound(50, 'square', 0.6, 0.8, true); // Explosion sound

            window.enemies.forEach(enemy => {
                if (enemy.hp > 0 && Math.abs(enemy.x - caster.x) < 180) {
                    let ultiDmg = baseDmg * 2.5; 
                    if (typeof window.takeDamage === 'function') window.takeDamage(enemy, ultiDmg, "#ff7675", true, true, caster);
                    
                    enemy.vy = -20; // Massive uppercut knock-up
                    enemy.hitStun = 90; 
                    
                    if (typeof window.spawnParticles === 'function') {
                        for(let i=0; i<40; i++) window.spawnParticles(enemy.x, enemy.y, "#00cec9", true);
                    }
                    if (typeof window.floatingTexts !== 'undefined') {
                        window.floatingTexts.push({ x: enemy.x, y: enemy.y - 80, text: "TERMINATED 🎯", color: "#d63031", alpha: 1, vx: 0, vy: -1, font: "900 35px Arial", life: 80 });
                    }
                }
            });

            caster.state = 'taunt_flex';
        }, 800);

        setTimeout(() => {
            window.targetZoom = 1.0; 
            window.targetCamX = 0;
            if (window.gameOver || caster.hp <= 0) return;
            caster.state = 'idle';
            caster.attackTimer = 0;
        }, 1600);
    },
    
    // ==========================================
    // DRAW HAALAND (Giant body, Man City colors, Blonde Man-bun)
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. Man City Light Blue Jersey (Thicker lines for a bigger body)
        ctx.strokeStyle = "#74b9ff"; 
        ctx.lineWidth = 8; // Thicker than Mbappe's 6
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        ctx.strokeStyle = "#74b9ff"; ctx.lineWidth = 7;
        drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR); 
        
        // 2. White Shorts & Socks
        ctx.strokeStyle = "#dfe6e9"; ctx.lineWidth = 7;
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 

        // 3. Head (Pale skin)
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); // Slightly bigger head
        ctx.fillStyle = "#ffeaa7"; // Pale/Blonde skin tone base
        ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 
        
        if (!isTrail) {
            // Blonde Hair (Top layer)
            ctx.fillStyle = "#fdcb6e"; // Golden blonde
            ctx.beginPath();
            ctx.arc(head.x, head.y, 11, Math.PI, 0); 
            ctx.fill();

            // The Viking Man-bun (Bun on the back of the head)
            ctx.beginPath();
            let bunX = head.x + (p.isFacingRight ? -10 : 10);
            ctx.arc(bunX, head.y - 5, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Cyborg Glowing Eye (Left eye glows blue/red)
            ctx.fillStyle = "#00cec9"; // Cyan glow
            ctx.beginPath(); 
            ctx.arc(head.x + (p.isFacingRight ? 5 : -5), head.y - 2, 2.5, 0, Math.PI*2); 
            ctx.fill();

            // Number 9 on Chest
            let midX = (neck.x + pelvis.x) / 2;
            let midY = (neck.y + pelvis.y) / 2;
            ctx.fillStyle = "#fff"; ctx.font = "bold 13px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("9", midX + (p.isFacingRight ? 3 : -3), midY);
            
            // Neon Green Cleats
            ctx.fillStyle = "#55efc4";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill();
        }
    }
};

// Register character to engine
if (!window.classStats) window.classStats = {};
window.classStats["haaland"] = window.currentLoadedChar;
