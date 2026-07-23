// ==========================================
// ENVIRONMENT.JS - TRẠM KẾT XUẤT HIỆU ỨNG ĐA VŨ TRỤ (CHỐNG LAG 60FPS)
// [TỐI ƯU BATCHING] Gộp lệnh vẽ cho Mưa, Tuyết, Bụi giúp tăng 200% hiệu năng
// [ĐỒNG BỘ CONFIG] Render chuẩn xác 10 loại thời tiết từ config.js
// ==========================================

window.drawEnvironmentDamage = function(ctx) {
    if (!ctx || !window.envDamage || window.envDamage.length === 0) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    window.envDamage.forEach(dmg => {
        let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1;
        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(dmg.x, dmg.y);

        // Vẽ Hố Thiên Thạch / Nổ (Crater)
        if (dmg.type === 'crater') {
            ctx.save();
            ctx.scale(1, 0.15); // Tạo góc nhìn 3D nghiêng
            if (dmg.isBurning) {
                let pulse = 0.5 + Math.abs(Math.sin(Date.now() / 150)) * 0.5;
                let burnGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, (dmg.radius || 40) * 1.5);
                burnGrad.addColorStop(0, `rgba(255, 150, 0, ${pulse * 0.9 * alpha})`);
                burnGrad.addColorStop(0.3, `rgba(255, 30, 0, ${pulse * 0.5 * alpha})`);
                burnGrad.addColorStop(1, "rgba(0,0,0,0)");
                
                ctx.fillStyle = burnGrad;
                ctx.beginPath();
                ctx.arc(0, 0, (dmg.radius || 40) * 1.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = `rgba(15, 15, 15, ${0.8 * alpha})`;
                ctx.beginPath();
                ctx.arc(0, 0, (dmg.radius || 40), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Vẽ Các Vết Nứt (Cracks)
        let baseLw = (dmg.isBurning ? 4 : 3) * (dmg.scale || 1);
        dmg.cracks.forEach(path => {
            if (Array.isArray(path) && path.length > 0) {
                // Viền ngoài của vết nứt
                if (dmg.isBurning) {
                    ctx.strokeStyle = `rgba(255, 50, 0, ${0.8 * alpha})`;
                    ctx.lineWidth = baseLw + 2;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = "#ff4757";
                } else {
                    ctx.strokeStyle = `rgba(10, 10, 10, ${0.5 * alpha})`;
                    ctx.lineWidth = baseLw + 2;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#000";
                }
                
                ctx.beginPath();
                path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
                ctx.stroke();

                // Lõi sáng của vết nứt
                ctx.strokeStyle = dmg.isBurning ? `rgba(255, 230, 100, ${1.0 * alpha})` : `rgba(0, 0, 0, ${0.9 * alpha})`;
                ctx.lineWidth = baseLw * 0.4;
                ctx.shadowBlur = 0;
                
                ctx.beginPath();
                path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
                ctx.stroke();
            }
        });
        ctx.restore();
    });
    ctx.globalAlpha = 1.0;
    ctx.restore();
};

window.drawEnvironmentalHazards = function(ctx) {
    if (!ctx || !window.envHazards || window.envHazards.length === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Giúp hiệu ứng ánh sáng rực rỡ hơn

    window.envHazards.forEach(haz => {
        if (haz.type === 'lightning') {
            if (haz.state === 'warning') {
                let pulse = 0.5 + Math.sin(haz.timer * 0.4) * 0.5;
                ctx.fillStyle = `rgba(0, 243, 255, ${0.05 + pulse * 0.25})`;
                ctx.beginPath();
                ctx.ellipse(haz.x, window.GROUND_Y, 35 + pulse * 25, 8, 0, 0, Math.PI*2);
                ctx.fill();
                
                // Tia lửa điện xẹt trên mặt đất
                if (Math.random() < 0.3) {
                    ctx.strokeStyle = "rgba(0, 243, 255, 0.8)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y);
                    ctx.lineTo(haz.x + (Math.random()-0.5)*40, window.GROUND_Y - 20 - Math.random()*40);
                    ctx.stroke();
                }
            } 
            else if (haz.state === 'striking') {
                ctx.shadowBlur = 20; 
                ctx.shadowColor = "#00f3ff";
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3 + Math.random() * 5;
                
                let startX = haz.x + (Math.random() - 0.5) * 150; 
                let startY = window.GROUND_Y - 800; 
                let targetX = haz.x;
                let targetY = window.GROUND_Y;
                
                let steps = 14;
                let path = [{x: startX, y: startY}];
                let branches = [];
                
                for(let s=1; s<=steps; s++) {
                    let px = startX + (targetX - startX)*(s/steps) + (Math.random()-0.5)*90; 
                    let py = startY + (targetY - startY)*(s/steps);
                    path.push({x: px, y: py});
                    if (Math.random() < 0.35 && s < steps - 2) {
                        branches.push({x: px, y: py, tx: px + (Math.random()-0.5)*200, ty: py + 100 + Math.random()*150});
                    }
                }
                
                // Vẽ tia sét chính
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.stroke();
                
                // Vẽ tia phân nhánh
                ctx.lineWidth = 1.5 + Math.random() * 2;
                ctx.strokeStyle = "rgba(180, 255, 255, 0.9)";
                branches.forEach(b => {
                    ctx.beginPath(); ctx.moveTo(b.x, b.y);
                    let bx = b.x, by = b.y;
                    for(let j=0; j<4; j++) {
                        bx += (b.tx - b.x)/4 + (Math.random()-0.5)*30;
                        by += (b.ty - b.y)/4;
                        ctx.lineTo(bx, by);
                    }
                    ctx.stroke();
                });
                
                ctx.shadowBlur = 0;
                
                // Vùng sáng dưới đất khi sét chạm
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random()*0.6})`;
                ctx.beginPath();
                ctx.ellipse(haz.x, window.GROUND_Y, 70, 15, 0, 0, Math.PI*2);
                ctx.fill();
            }
        } 
        else if (haz.type === 'lava') { 
            ctx.fillStyle = `rgba(231, 76, 60, ${0.1 + Math.sin(haz.timer)/5})`; 
            ctx.beginPath();
            ctx.ellipse(haz.x, window.GROUND_Y, 60 + Math.sin(haz.timer)*10, 15, 0, 0, Math.PI*2);
            ctx.fill(); 
        }
    });
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
};

window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.weatherParticles || window.weatherParticles.length === 0) return;

    ctx.save();
    ctx.lineWidth = 1;
    let wType = window.currentWeather;

    // KỸ THUẬT BATCHING: Các loại hạt đơn giản được gộp chung 1 path để chống lag tuyệt đối
    if (['snow', 'ash', 'toxic'].includes(wType)) {
        if (wType === 'snow') ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        else if (wType === 'ash') ctx.fillStyle = "rgba(230, 126, 34, 0.6)";
        else if (wType === 'toxic') ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
        
        ctx.beginPath();
        window.weatherParticles.forEach(w => {
            ctx.moveTo(w.x, w.y);
            ctx.arc(w.x, w.y, wType === 'toxic' ? w.size*1.2 : (wType === 'ash' ? w.size*0.8 : w.size), 0, Math.PI*2);
        });
        ctx.fill();
    }
    else if (['rain', 'blood_rain'].includes(wType)) {
        ctx.strokeStyle = wType === 'rain' ? "rgba(155, 155, 255, 0.6)" : "rgba(214, 48, 49, 0.75)";
        ctx.lineWidth = wType === 'rain' ? 1 : 2;
        
        ctx.beginPath();
        window.weatherParticles.forEach(w => {
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x - (wType === 'rain' ? 6 : 4), w.y + (wType === 'rain' ? 15 : 22));
        });
        ctx.stroke();
    }
    else {
        // CÁC LOẠI THỜI TIẾT ĐẶC BIỆT CẦN TÍNH TOÁN RIÊNG
        window.weatherParticles.forEach(w => { 
            if (wType === 'petals') { 
                ctx.fillStyle = "rgba(253, 121, 168, 0.7)"; 
                ctx.beginPath(); 
                ctx.ellipse(w.x, w.y, w.size, w.size*0.5, w.ang + (w.y/50), 0, Math.PI*2); 
                ctx.fill(); 
            }
            else if (wType === 'fireflies') {
                let glow = 0.3 + Math.abs(Math.sin(Date.now()/350 + w.x)) * 0.7; 
                ctx.fillStyle = `rgba(241, 196, 15, ${glow})`;
                ctx.shadowBlur = 8; 
                ctx.shadowColor = "#f1c40f"; 
                ctx.beginPath(); 
                ctx.arc(w.x, w.y, w.size * 1.4, 0, Math.PI*2); 
                ctx.fill(); 
                ctx.shadowBlur = 0;
            } 
            else if (wType === 'matrix_rain') {
                ctx.fillStyle = `rgba(0, 255, 68, ${0.4 + Math.random()*0.5})`; 
                ctx.font = "bold 15px monospace";
                ctx.fillText(w.char || (Math.random() > 0.5 ? "1" : "0"), w.x, w.y);
            } 
            else if (wType === 'cosmic_dust') {
                let cglow = 0.2 + Math.abs(Math.sin(Date.now()/500 + w.y)) * 0.6;
                ctx.fillStyle = w.size > 2 ? `rgba(0, 243, 255, ${cglow})` : `rgba(155, 89, 182, ${cglow})`;
                ctx.beginPath(); 
                ctx.arc(w.x, w.y, w.size * 2, 0, Math.PI*2); 
                ctx.fill();
            } 
            else if (wType === 'shooting_stars') {
                if (Math.random() > 0.95) return; 
                let tailX = w.x + w.speed * 2; 
                let tailY = w.y - w.speed * 3;
                let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY);
                grad.addColorStop(0, "rgba(255, 255, 255, 1)"); 
                grad.addColorStop(1, "rgba(0, 243, 255, 0)");
                
                ctx.strokeStyle = grad; 
                ctx.lineWidth = w.size * 0.8;
                ctx.beginPath(); 
                ctx.moveTo(w.x, w.y); 
                ctx.lineTo(tailX, tailY); 
                ctx.stroke();
            }
        });
    }
    ctx.restore();
};

// ==========================================
// TỰ ĐỘNG GẮN VÀO CAMERA CỦA ENGINE.JS MÀ KHÔNG GÂY LỖI
// ==========================================
if (!window._hookedEnvironmentRender) {
    window._hookedEnvironmentRender = true;
    const originalDrawEngine = window.draw;
    
    window.draw = function() {
        // Chạy nền engine.js gốc
        if (originalDrawEngine) originalDrawEngine.apply(this, arguments);

        if (window.ctx && window.canvas && !window.gameOver && !window.isLoading) {
            window.ctx.save();
            
            // Lặp lại logic Camera để môi trường khớp chính xác 100% tọa độ
            if (window.shakeTime > 0) window.ctx.translate((Math.random() - 0.5) * window.shakeMag, (Math.random() - 0.5) * window.shakeMag); 
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2); 
            window.ctx.scale(window.currentZoom, window.currentZoom); 
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + window.camX, -window.canvas.height / 2 + window.camY);

            // Bắt đầu vẽ môi trường
            window.drawEnvironmentDamage(window.ctx);
            window.drawEnvironmentalHazards(window.ctx);
            window.drawWeatherEffects(window.ctx);

            window.ctx.restore();
        }
    };
}
