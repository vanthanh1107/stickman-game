// KHỞI TẠO KHO CHỨA ĐÁ TẢNG TỪ TRÊN TRỜI RƠI XUỐNG
if (!window.theRockBoulders) window.theRockBoulders = [];

// ==========================================
// [HACK ENGINE] TÍCH HỢP VẬT LÝ ĐÁ RƠI VÀ CƠ CHẾ LÀM CHOÁNG (STUN)
// ==========================================
if (!window.theRockHooked) {
    let oldUpdateTR = window.update;
    window.update = function() {
        if (typeof oldUpdateTR === 'function') oldUpdateTR();
        
        // Reset đá khi qua màn mới
        if (window.matchTimer === 1) window.theRockBoulders = [];

        // Bỏ qua nếu game đang dừng (Cinematic)
        if (window.isCinematicActive) return;

        // TÍNH TOÁN VẬT LÝ CHO ĐÁ TẢNG RƠI
        if (window.theRockBoulders && window.theRockBoulders.length > 0) {
            for (let i = window.theRockBoulders.length - 1; i >= 0; i--) {
                let rock = window.theRockBoulders[i];
                rock.vy += window.GRAVITY || 0.8; // Rơi nhanh dần
                rock.y += rock.vy;

                // Khi đá đập xuống đất
                if (rock.y >= window.GROUND_Y) {
                    rock.y = window.GROUND_Y;
                    
                    // RUNG CHẤN MÀN HÌNH KHỦNG KHIẾP
                    if (typeof window.shakeScreen === 'function') window.shakeScreen(30, 20);
                    if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.5, 1.0); // Tiếng nổ lớn
                    if (typeof window.spawnDust === 'function') {
                        window.spawnDust(rock.x, window.GROUND_Y);
                        window.spawnDust(rock.x - 40, window.GROUND_Y);
                        window.spawnDust(rock.x + 40, window.GROUND_Y);
                    }

                    // LÀM CHOÁNG KẺ ĐỊCH (KHÔNG GÂY DAMGE)
                    window.enemies.forEach(target => {
                        if (target.hp > 0 && Math.abs(target.x - rock.x) < 250) { // Phạm vi ảnh hưởng cực rộng (250px)
                            target.rockStunTimer = 120; // Stun 120 frames (Tương đương 2 giây ở 60 FPS)
                            
                            if (typeof window.floatingTexts !== 'undefined') {
                                window.floatingTexts.push({ x: target.x, y: target.y - 70, text: " Dizzy! ", color: "#f39c12", alpha: 1, vx: 0, vy: -1, font: "bold 18px Arial", life: 120 });
                            }
                        }
                    });

                    // Xóa tảng đá sau khi chạm đất (hoặc bạn có thể để lại làm chướng ngại vật tùy ý, ở đây sẽ xóa đi cho mượt)
                    window.theRockBoulders.splice(i, 1);
                }
            }
        }

        // THỰC THI HIỆU ỨNG CHOÁNG (KHÓA HÀNH ĐỘNG CỦA ĐỊCH)
        window.enemies.forEach(target => {
            if (target.rockStunTimer && target.rockStunTimer > 0) {
                target.rockStunTimer--;
                target.vx = 0; // Không thể di chuyển ngang
                target.state = 'hurt'; // Giữ nguyên ở dáng bị ăn đòn
                target.attackTimer = 10; // Không thể tung đòn đánh
            }
        });
    };

    let oldDrawTR = window.draw;
    window.draw = function() {
        if (typeof oldDrawTR === 'function') oldDrawTR();
        
        // VẼ TẢNG ĐÁ
        if (window.theRockBoulders && window.theRockBoulders.length > 0 && window.ctx && window.canvas) {
            window.ctx.save();
            if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
            window.ctx.scale(window.currentZoom, window.currentZoom); 
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

            window.theRockBoulders.forEach(rock => {
                window.ctx.save();
                window.ctx.translate(rock.x, rock.y - rock.radius);
                
                // Khối đá xám đen
                window.ctx.fillStyle = "#7f8c8d";
                window.ctx.strokeStyle = "#2c3e50";
                window.ctx.lineWidth = 4;
                
                window.ctx.beginPath();
                // Vẽ tảng đá mấp mô
                window.ctx.moveTo(0, -rock.radius);
                window.ctx.lineTo(rock.radius * 0.8, -rock.radius * 0.6);
                window.ctx.lineTo(rock.radius, rock.radius * 0.2);
                window.ctx.lineTo(rock.radius * 0.5, rock.radius);
                window.ctx.lineTo(-rock.radius * 0.5, rock.radius);
                window.ctx.lineTo(-rock.radius, rock.radius * 0.3);
                window.ctx.lineTo(-rock.radius * 0.7, -rock.radius * 0.7);
                window.ctx.closePath();
                
                window.ctx.fill();
                window.ctx.stroke();
                
                // Chi tiết lõm trên tảng đá
                window.ctx.fillStyle = "#95a5a6";
                window.ctx.beginPath(); window.ctx.arc(-15, -10, 10, 0, Math.PI * 2); window.ctx.fill();
                window.ctx.beginPath(); window.ctx.arc(15, 15, 8, 0, Math.PI * 2); window.ctx.fill();
                
                window.ctx.restore();
            });
            window.ctx.restore();
        }

        // VẼ NGÔI SAO TRÊN ĐẦU KẺ ĐỊCH BỊ STUN
        if (window.ctx && window.canvas) {
            window.ctx.save();
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
            window.ctx.scale(window.currentZoom, window.currentZoom); 
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

            window.enemies.forEach(target => {
                if (target.rockStunTimer && target.rockStunTimer > 0) {
                    window.ctx.fillStyle = "#f1c40f"; // Sao vàng
                    let t = Date.now() / 150;
                    let starX1 = target.x + Math.cos(t) * 15;
                    let starY1 = target.y - 70 + Math.sin(t) * 5;
                    let starX2 = target.x + Math.cos(t + Math.PI) * 15;
                    let starY2 = target.y - 70 + Math.sin(t + Math.PI) * 5;
                    
                    window.ctx.beginPath(); window.ctx.arc(starX1, starY1, 3, 0, Math.PI*2); window.ctx.fill();
                    window.ctx.beginPath(); window.ctx.arc(starX2, starY2, 3, 0, Math.PI*2); window.ctx.fill();
                }
            });
            window.ctx.restore();
        }
    };
    window.theRockHooked = true;
}

// ==========================================
// THÔNG SỐ VÀ KỸ NĂNG NHÂN VẬT THE ROCK
// ==========================================
window.theRockChar = {
    id: "therock",
    className: "The Rock",
    hp: 2000, // Cực trâu bò
    speed: 6.5, // Chạy chậm hơn CR7 nhưng đầm
    dmgMod: 1.5, // Tay to sát thương cao
    color: "#e67e22", 
    avatarUrl: "https://i.ibb.co/chw4yX9J/Generated-Image-July-13-2026-9-17-PM.png", // Bạn có thể thay link ảnh đại diện
    
    // ĐÁNH THƯỜNG: Đấm bốc WWE
    executeBasicAttack: function(caster, enemies) {
        caster.comboStep = (caster.comboStep + 1) % 3; 
        
        // Chuỗi 3 cú đấm ngực, đấm móc
        if (caster.comboStep === 0) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 8 : -8; }
        else if (caster.comboStep === 1) { caster.state = 'punch'; caster.vx = caster.isFacingRight ? 10 : -10; }
        else { caster.state = 'heavy_attack'; caster.vx = caster.isFacingRight ? 12 : -12; }
        
        caster.attackTimer = 20; 
        if (typeof window.playSound === 'function') window.playSound(180, 'square', 0.1, 0.3);

        enemies.forEach(target => {
            // Không target đòn đánh thường vào mục tiêu đang bị đá rơi làm choáng
            if (target.hp > 0 && Math.abs(target.x - caster.x) < 80) {
                let damage = 20 * caster.dmgMod;
                if (typeof window.takeDamage === 'function') window.takeDamage(target, damage, "#fff", false, false, caster);
                if (typeof window.spawnParticles === 'function') window.spawnParticles(target.x, target.y - 30, "#e67e22", false);
            }
        });
    },

    skill: {
        // SKILL 1: Cú húc vai (Shoulder Tackle)
        actionCode1: function(caster, target, ctx) {
            caster.state = 'dash'; caster.attackTimer = 25;
            caster.vx = caster.isFacingRight ? 20 : -20;
            caster.iFrames = 15; 
            if(typeof window.playSound === 'function') window.playSound(220, 'sawtooth', 0.2, 0.4);
            
            if(target && Math.abs(target.x - caster.x) < 100) {
                if(typeof window.takeDamage === 'function') window.takeDamage(target, 30 * caster.dmgMod, "#fff", true, false, caster);
                target.vx = caster.isFacingRight ? 15 : -15; // Đẩy lùi địch
                target.state = 'hurt';
            }
        },
        // SKILL 2: Dậm chân (Ground Stomp)
        actionCode2: function(caster, target, ctx) {
            caster.state = 'heavy_attack'; caster.attackTimer = 30; 
            caster.vy = -10; 
            caster.vx = 0;
            
            setTimeout(() => {
                if(typeof window.shakeScreen === 'function') window.shakeScreen(10, 10);
                if(typeof window.spawnDust === 'function') window.spawnDust(caster.x, window.GROUND_Y);
                if(target && Math.abs(target.x - caster.x) < 150) {
                    if(typeof window.takeDamage === 'function') window.takeDamage(target, 40 * caster.dmgMod, "#e67e22", true, false, caster);
                    target.vy = -8; // Hất tung nhẹ
                }
            }, 300); // Đợi rơi xuống đất mới nổ damage
        }
    },
    
    // ==========================================
    // TUYỆT CHIÊU (ULTIMATE): TRIỆU HỒI ĐÁ RƠI KHÔNG GÂY SÁT THƯƠNG
    // ==========================================
    executeUltimate: function(caster, target, baseDmg) {
        caster.state = 'heavy_attack'; // Dáng gồng cơ bắp
        caster.attackTimer = 60; // Gồng 1 giây
        caster.vx = 0; 
        
        // Hét câu châm ngôn
        if (typeof window.floatingTexts !== 'undefined') {
            window.floatingTexts.push({ x: caster.x, y: caster.y - 110, text: "🤨 CAN YOU SMELL...", color: "#e67e22", alpha: 1, vx: 0, vy: -1.5, font: "900 24px Arial", life: 80 });
        }

        // Đợi 0.5s sau tiếng hét, gọi đá rơi xuống vị trí của địch (hoặc phía trước caster nếu không có target)
        setTimeout(() => {
            if (window.gameOver || caster.hp <= 0) return;
            
            let dropX = target ? target.x : caster.x + (caster.isFacingRight ? 150 : -150);
            
            window.theRockBoulders.push({
                x: dropX, 
                y: -400, // Sinh ra rất cao trên trời
                vy: 5,   // Gia tốc ban đầu
                radius: 60 // Cục đá siêu to khổng lồ
            });
            
        }, 500); 
    },
    
    // ==========================================
    // VẼ STICKMAN THE ROCK: CƠ BẮP, ĐẦU TRỌC, QUẦN ĐEN
    // ==========================================
    drawMethod: function(ctx, p, bounce, ext, pext, isTrail) {
        let pts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
        const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
        
        // 1. CƠ BẮP NGƯỜI VÀ CÁNH TAY (Da rám nắng, nét vẽ siêu dày)
        ctx.strokeStyle = "#d35400"; // Da nâu cam
        ctx.lineWidth = 10; // Cánh tay và ngực cực dày (Cơ bắp)
        ctx.lineCap = "round";
        
        // Thân hình
        ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke(); 
        
        // Cánh tay xăm trổ (mô phỏng bằng một chút đậm màu ở vai)
        drawLimb(neck, elbowL, handL); 
        drawLimb(neck, elbowR, handR); 
        
        // 2. QUẦN WRESTLING ĐEN VÀ CHÂN CƠ BẮP
        ctx.lineWidth = 9; 
        drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); 
        
        if (!isTrail) {
            // Mặc quần đùi màu đen (Tô đè lên phần đùi)
            ctx.strokeStyle = "#111";
            ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeL.x, kneeL.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pelvis.x, pelvis.y); ctx.lineTo(kneeR.x, kneeR.y); ctx.stroke();
            
            // Vẽ bắp tay to hơn (Brahma Bull)
            ctx.beginPath(); ctx.arc(elbowR.x, elbowR.y, 6, 0, Math.PI*2); ctx.fillStyle="#d35400"; ctx.fill();
            ctx.beginPath(); ctx.arc(elbowL.x, elbowL.y, 6, 0, Math.PI*2); ctx.fill();
            
            // Giày đấu vật đen
            ctx.fillStyle = "#2d3436";
            ctx.beginPath(); ctx.arc(footL.x, footL.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill();
        }

        // 3. ĐẦU TRỌC VÀ LÔNG MÀY THƯƠNG HIỆU
        ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#d35400"; ctx.fill(); // Da đầu
        ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.stroke(); // Viền đầu
        
        if (!isTrail) {
            // Biểu cảm The Rock (Nhíu lông mày)
            ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5;
            // Mắt
            ctx.beginPath(); ctx.arc(head.x + (p.isFacingRight ? 4 : -4), head.y - 2, 1, 0, Math.PI*2); ctx.stroke(); // Mắt phải
            ctx.beginPath(); ctx.arc(head.x + (p.isFacingRight ? -2 : 2), head.y - 2, 1, 0, Math.PI*2); ctx.stroke(); // Mắt trái
            
            // The People's Eyebrow (Nhướng 1 bên lông mày cực cao)
            ctx.beginPath(); 
            ctx.moveTo(head.x + (p.isFacingRight ? 2 : -2), head.y - 6); 
            ctx.lineTo(head.x + (p.isFacingRight ? 6 : -6), head.y - 8); // Lông mày nhướng
            ctx.stroke();
            
            ctx.beginPath(); 
            ctx.moveTo(head.x + (p.isFacingRight ? -4 : 4), head.y - 4); 
            ctx.lineTo(head.x + (p.isFacingRight ? 0 : 0), head.y - 5); // Lông mày cụp
            ctx.stroke();
        }
    }
};

// Đăng ký nhân vật
if (!window.classStats) window.classStats = {};
window.classStats["therock"] = window.theRockChar;
window.currentLoadedChar = window.theRockChar; // Load thẳng The Rock vào chơi
