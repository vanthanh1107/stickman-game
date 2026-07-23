// ==========================================
// ENVIRONMENT.JS - MODULE XỬ LÝ VÀ VẼ HIỆU ỨNG MÔI TRƯỜNG & THỜI TIẾT
// Khôi phục hoàn toàn: Vết nứt đất (Crraters/Walls), Thiên thạch, Sét, Dung nham & 8 Loại thời tiết
// ==========================================

// 1. HÀM VẼ VẾT NỨT MÔI TRƯỜNG (MẶT ĐẤT & TƯỜNG)
window.drawEnvironmentDamage = function(ctx) {
    if (!ctx || !window.envDamage || window.envDamage.length === 0) return;

    ctx.save();
    window.envDamage.forEach(dmg => {
        let alpha = Math.min(1, dmg.life / 100);
        ctx.globalAlpha = alpha;
        
        ctx.strokeStyle = dmg.isBurning ? "#e74c3c" : "#2c3e50";
        ctx.lineWidth = Math.max(1, 3 * dmg.scale);
        ctx.lineCap = "round";

        ctx.save();
        ctx.translate(dmg.x, dmg.y);

        // Vẽ các vết nứt chính và nhánh
        if (dmg.cracks) {
            dmg.cracks.forEach(path => {
                if (path.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(path[0].x, path[0].y);
                    for (let i = 1; i < path.length; i++) {
                        ctx.lineTo(path[i].x, path[i].y);
                    }
                    ctx.stroke();
                }
            });
        }

        // Lõi rực cháy nếu là vết nứt dung nham/thiên thạch
        if (dmg.isBurning) {
            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = Math.max(1, 1.5 * dmg.scale);
            ctx.shadowColor = "#e74c3c";
            ctx.shadowBlur = 10;
            if (dmg.cracks) {
                dmg.cracks.forEach(path => {
                    if (path.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(path[0].x, path[0].y);
                        for (let i = 1; i < path.length; i++) {
                            ctx.lineTo(path[i].x, path[i].y);
                        }
                        ctx.stroke();
                    }
                });
            }
        }
        ctx.restore();
    });
    ctx.restore();
};

// 2. HÀM VẼ HIỆU ỨNG THỜI TIẾT DỰA THEO MAP CONFIG
window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.weatherParticles || window.weatherParticles.length === 0) return;

    ctx.save();
    let type = window.currentWeather || 'none';

    window.weatherParticles.forEach(w => {
        ctx.save();
        ctx.globalAlpha = w.alpha || 0.7;

        if (type === 'rain' || type === 'blood_rain') {
            ctx.strokeStyle = type === 'blood_rain' ? '#ff003c' : '#74b9ff';
            ctx.lineWidth = w.size > 2 ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x - 4, w.y + w.size * 5);
            ctx.stroke();
        } 
        else if (type === 'snow') {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (type === 'matrix_rain') {
            ctx.fillStyle = "#00ff00";
            ctx.font = "bold 14px monospace";
            ctx.shadowColor = "#00ff00";
            ctx.shadowBlur = 5;
            ctx.fillText(w.char || "1", w.x, w.y);
        } 
        else if (type === 'fireflies') {
            ctx.fillStyle = "#f1c40f";
            ctx.shadowColor = "#f1c40f";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (type === 'ash' || type === 'toxic') {
            ctx.fillStyle = type === 'toxic' ? '#2ecc71' : '#e67e22';
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (type === 'petals') {
            ctx.fillStyle = "#ff75a0";
            ctx.translate(w.x, w.y);
            ctx.rotate(w.ang || 0);
            ctx.beginPath();
            ctx.ellipse(0, 0, w.size * 2, w.size, 0, 0, Math.PI * 2);
            ctx.fill();
        } 
        else if (type === 'shooting_stars' || type === 'cosmic_dust') {
            ctx.fillStyle = "#00f3ff";
            ctx.shadowColor = "#00f3ff";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    });

    ctx.restore();
};

// 3. HÀM VẼ MỐI NGUY MÔI TRƯỜNG (SÉT, DUNG NHAM, THIÊN THẠCH)
window.drawEnvironmentalHazards = function(ctx) {
    if (!ctx || !window.envHazards) return;

    ctx.save();
    window.envHazards.forEach(haz => {
        if (haz.type === 'lightning') {
            if (haz.state === 'warning') {
                // Tia cảnh báo đỏ dưới đất
                ctx.fillStyle = "rgba(255, 0, 60, 0.3)";
                ctx.fillRect(haz.x - 30, window.GROUND_Y - 5, 60, 5);
            } else if (haz.state === 'striking') {
                // Luồng sét đánh từ trời xuống
                ctx.strokeStyle = "#00f3ff";
                ctx.lineWidth = 12;
                ctx.shadowColor = "#00f3ff";
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.moveTo(haz.x, 0);
                ctx.lineTo(haz.x + (Math.random() - 0.5) * 20, window.GROUND_Y);
                ctx.stroke();

                // Lõi sét màu trắng
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(haz.x, 0);
                ctx.lineTo(haz.x, window.GROUND_Y);
                ctx.stroke();
            }
        } else if (haz.type === 'lava') {
            // Vùng dung nham phun trào
            ctx.fillStyle = "rgba(231, 76, 60, 0.6)";
            ctx.shadowColor = "#e67e22";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.ellipse(haz.x, window.GROUND_Y, 40, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.restore();
};

// ==========================================
// MOOK HOOK VÀO VÒNG LẶP RENDER DƯỚI DẠNG ĐỰNG CHẾ ĐỘ ĐỘC LẬP
// ==========================================
if (!window._hookedEnvironmentRender) {
    window._hookedEnvironmentRender = true;
    const originalDrawEngine = window.draw;
    
    window.draw = function() {
        // Chạy hàm draw gốc của engine trước
        if (originalDrawEngine) originalDrawEngine.apply(this, arguments);

        // Sau đó chèn vẽ các hiệu ứng môi trường đè lên bề mặt sân đấu
        if (window.ctx && window.canvas && !window.isLoading) {
            window.ctx.save();
            
            // Áp dụng transform theo Camera để môi trường di chuyển chuẩn 3D Parallax
            let focusHunt = Math.sin(Date.now() / 200) * 0.005;
            let actualZoom = (window.currentZoom || 1) + focusHunt;
            
            window.ctx.translate(window.canvas.width / 2, window.canvas.height / 2);
            window.ctx.scale(actualZoom, actualZoom);
            if (window.cameraTilt) window.ctx.rotate(window.cameraTilt);
            window.ctx.translate(-window.canvas.width / 2 + (window.camX || 0), -window.canvas.height / 2 + (window.camY || 0));

            // Tiến hành render vết nứt, bẫy môi trường và thời tiết
            if (typeof window.drawEnvironmentDamage === 'function') window.drawEnvironmentDamage(window.ctx);
            if (typeof window.drawEnvironmentalHazards === 'function') window.drawEnvironmentalHazards(window.ctx);
            if (typeof window.drawWeatherEffects === 'function') window.drawWeatherEffects(window.ctx);

            window.ctx.restore();
        }
    };
}
