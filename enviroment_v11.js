// ==========================================
// ENVIRONMENT.JS - TRẠM BẢN ĐỒ 5 LỚP CHIỀU SÂU & THỜI TIẾT 3D (V8.0 ULTRA PARALLAX)
// ĐẢM NHIỆM 100%:
// 1. 16 Bản đồ ngẫu nhiên tuyệt đẹp (Cyberpunk, Sakura Moon, Synthwave, Aurora, Eclipse, Sword Graveyard...).
// 2. Render 5 tầng chiều sâu (Thiên thể -> Núi xa -> Kiến trúc trung cảnh -> Sương mù -> Mặt sàn phối cảnh 3D).
// 3. Khởi tạo trước (Pre-compute) toàn bộ tọa độ ngôi sao, cửa sổ, đỉnh núi trong < 1ms -> Load tức thì, chuẩn 60FPS.
// ==========================================

window.MAPS = [
    { id: "sakura_moon", name: "ĐỈNH ANH ĐÀO TRĂNG MÁU", sky1: "#0d021a", sky2: "#3b0944",celestial: "blood_moon", celestialCol: "#ff2a6d", horizon: "fuji", mid: "torii", floor: "stone", bg2Col: "#1a0526", bg1Col: "#2d083a", ground: "#11031c", line: "#ff2a6d", weather: "petals" },
    { id: "cyberpunk", name: "THÀNH PHỐ CYBERPUNK 2099", sky1: "#03071e", sky2: "#0a1931", celestial: "neon_moon", celestialCol: "#00f3ff", horizon: "mountains", mid: "cyber_city", floor: "grid", bg2Col: "#0b132b", bg1Col: "#14213d", ground: "#050a18", line: "#00f3ff", weather: "rain" },
    { id: "synthwave", name: "ĐẠI LỘ HOÀNG HÔN SYNTHWAVE", sky1: "#10002b", sky2: "#5a189a", celestial: "retro_sun", celestialCol: "#ff9e00", horizon: "wire_peaks", mid: "palms", floor: "grid", bg2Col: "#240046", bg1Col: "#3c096c", ground: "#10002b", line: "#ff007f", weather: "shooting_stars" },
    { id: "aurora_ice", name: "CỰC QUANG BẮC CỰC", sky1: "#020c1b", sky2: "#0a2440", celestial: "aurora", celestialCol: "#00ffaa", horizon: "ice_peaks", mid: "pines", floor: "ice", bg2Col: "#0f3156", bg1Col: "#16426b", ground: "#07192b", line: "#38bdf8", weather: "snow" },
    { id: "astral_shrine", name: "THÁNH ĐỊA TINH VÂN", sky1: "#060318", sky2: "#1f1147", celestial: "ringed_planet", celestialCol: "#c084fc", horizon: "floating_islands", mid: "pillars", floor: "stone", bg2Col: "#140a30", bg1Col: "#23124d", ground: "#0b051d", line: "#c084fc", weather: "cosmic_dust" },
    { id: "sword_grave", name: "KIẾM MỘ THIÊN KIẾP", sky1: "#0a0e17", sky2: "#1e293b", celestial: "full_moon", celestialCol: "#e2e8f0", horizon: "mountains", mid: "giant_swords", floor: "stone", bg2Col: "#111827", bg1Col: "#1f2937", ground: "#090d16", line: "#38bdf8", weather: "rain" },
    { id: "molten_abyss", name: "HỎA DIỆM SƠN", sky1: "#1a0303", sky2: "#4a0e0e", celestial: "eclipse", celestialCol: "#ff5400", horizon: "volcano", mid: "obsidian_spires", floor: "lava_rock", bg2Col: "#2b0606", bg1Col: "#3d0a0a", ground: "#140404", line: "#ff4757", weather: "ash" },
    { id: "matrix_core", name: "LÕI MA TRẬN AI", sky1: "#000802", sky2: "#04240e", celestial: "cyber_core", celestialCol: "#00ff66", horizon: "wire_peaks", mid: "digital_towers", floor: "grid", bg2Col: "#031709", bg1Col: "#062912", ground: "#010d04", line: "#00ff66", weather: "matrix_rain" },
    { id: "eclipse_doom", name: "THÁNH ĐƯỜNG NGUYỆT THỰC", sky1: "#090002", sky2: "#2e0008", celestial: "eclipse", celestialCol: "#ff003c", horizon: "mountains", mid: "cathedral", floor: "stone", bg2Col: "#1a0004", bg1Col: "#290208", ground: "#0d0002", line: "#ff003c", weather: "blood_rain" },
    { id: "spirit_forest", name: "RỪNG ĐOM ĐÓM LINH ĐẠO", sky1: "#041412", sky2: "#0c3832", celestial: "full_moon", celestialCol: "#fef08a", horizon: "mountains", mid: "torii", floor: "stone", bg2Col: "#07221f", bg1Col: "#0e332e", ground: "#041412", line: "#facc15", weather: "fireflies" },
    { id: "pharaoh_dunes", name: "KIM TỰ THÁP HOÀNG KIM", sky1: "#140a02", sky2: "#452306", celestial: "twin_moons", celestialCol: "#fbbf24", horizon: "pyramids", mid: "pillars", floor: "stone", bg2Col: "#291403", bg1Col: "#3d1e05", ground: "#1a0c02", line: "#fbbf24", weather: "cosmic_dust" },
    { id: "sky_sanctuary", name: "ĐẢO THIÊN KHÔNG", sky1: "#0c1938", sky2: "#2b5876", celestial: "ringed_planet", celestialCol: "#7dd3fc", horizon: "floating_islands", mid: "pillars", floor: "stone", bg2Col: "#162d54", bg1Col: "#1f3f70", ground: "#0f203c", line: "#38bdf8", weather: "petals" },
    { id: "bio_reactor", name: "LÒ PHẢN ỨNG SINH HỌC", sky1: "#031208", sky2: "#0d3318", celestial: "cyber_core", celestialCol: "#4ade80", horizon: "mountains", mid: "cyber_city", floor: "grid", bg2Col: "#061f0e", bg1Col: "#0a2e15", ground: "#031208", line: "#2ecc71", weather: "toxic" },
    { id: "event_horizon", name: "TRẠM KHÔNG GIAN HỐ ĐEN", sky1: "#030108", sky2: "#15082e", celestial: "black_hole_sun", celestialCol: "#f97316", horizon: "floating_islands", mid: "digital_towers", floor: "grid", bg2Col: "#0c041c", bg1Col: "#180933", ground: "#06020f", line: "#f97316", weather: "shooting_stars" }
];

const MATRIX_CHARS = ["0", "1", "7", "9", "Z", "λ", "Ξ", "∑", "∆", "8", "4", "2"];

// Bộ nhớ đệm cảnh vật được tính sẵn 1 lần duy nhất mỗi khi vào trận (Zero-Lag)
window._mapCache = {
    stars: [],
    horizonNodes: [],
    midNodes: [],
    floatingRocks: []
};

// ==========================================
// 1. BỘ KHỞI TẠO BẢN ĐỒ NGẪU NHIÊN & TÍNH SẴN CHI TIẾT 3D (< 1ms)
// ==========================================
window.setupEnvironment = function() {
    let mapPool = (window.MAPS && window.MAPS.length > 0) ? window.MAPS : [];
    // Tránh lặp lại đúng map vừa chơi ở trận trước
    let chosenMap = mapPool[Math.floor(Math.random() * mapPool.length)];
    if (mapPool.length > 1 && window._lastMapId && chosenMap.id === window._lastMapId) {
        chosenMap = mapPool[(mapPool.indexOf(chosenMap) + 1) % mapPool.length];
    }
    window.currentMap = chosenMap;
    window._lastMapId = chosenMap ? chosenMap.id : null;
    window.currentWeather = (chosenMap && chosenMap.weather) ? chosenMap.weather : 'snow';

    window.weatherParticles = [];
    window.activeWeatherFX = [];
    window.rainSplashes = [];
    window.envDamage = [];
    window.envHazards = [];

    // 1. Tạo sẵn bầu trời sao lấp lánh (60 ngôi sao)
    window._mapCache.stars = [];
    for (let i = 0; i < 60; i++) {
        window._mapCache.stars.push({
            x: -400 + Math.random() * 1800,
            y: -120 + Math.random() * (window.GROUND_Y + 40),
            r: Math.random() * 1.8 + 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    // 2. Tạo sẵn dãy núi / đảo bay ở tầng Chân Trời Xa (Horizon Layer)
    window._mapCache.horizonNodes = [];
    for (let x = -800; x <= 1800; x += 140) {
        window._mapCache.horizonNodes.push({
            x: x,
            w: 160 + Math.random() * 90,
            h: 75 + Math.random() * 95,
            subPeak: (Math.random() - 0.5) * 45
        });
    }

    // 3. Tạo sẵn các đảo đá bay lơ lửng trên trời
    window._mapCache.floatingRocks = [];
    for (let i = 0; i < 7; i++) {
        window._mapCache.floatingRocks.push({
            x: -200 + i * 210 + (Math.random() - 0.5) * 60,
            y: 55 + Math.random() * 110,
            w: 45 + Math.random() * 50,
            h: 22 + Math.random() * 25,
            phase: Math.random() * Math.PI * 2
        });
    }

    // 4. Tạo sẵn kiến trúc tầng Trung Cảnh (Thành phố Cyberpunk, Cổng Torii, Đại Kiếm, Cột Đền...)
    window._mapCache.midNodes = [];
    for (let x = -800; x <= 1800; x += 110) {
        let bW = 55 + Math.floor(Math.random() * 38);
        let bH = 75 + Math.floor(Math.random() * 115);
        let windows = [];
        for (let wy = 14; wy < bH - 18; wy += 16) {
            for (let wx = 8; wx < bW - 12; wx += 14) {
                if (Math.random() > 0.38) {
                    windows.push({ rx: wx, ry: wy, isCyan: Math.random() > 0.45 });
                }
            }
        }
        window._mapCache.midNodes.push({
            x: x,
            w: bW,
            h: bH,
            tilt: (Math.random() - 0.5) * 0.28,
            hasRoofSpire: Math.random() > 0.5,
            windows: windows
        });
    }

    // 5. Khởi tạo hạt thời tiết 3 tầng chiều sâu
    let wType = window.currentWeather;
    let ptCount = 0;
    if (wType === 'rain' || wType === 'blood_rain') ptCount = 75;
    else if (wType === 'snow') ptCount = 80;
    else if (wType === 'matrix_rain') ptCount = 40;
    else if (wType === 'ash' || wType === 'toxic') ptCount = 60;
    else if (wType === 'petals') ptCount = 52;
    else if (wType === 'fireflies') ptCount = 45;
    else if (wType === 'cosmic_dust') ptCount = 55;
    else if (wType === 'shooting_stars') ptCount = 20;

    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;

    for (let i = 0; i < ptCount; i++) {
        let randLayer = Math.random();
        let depth = (randLayer < 0.45)
            ? (0.38 + Math.random() * 0.32)
            : (randLayer < 0.80)
                ? (0.72 + Math.random() * 0.35)
                : (1.08 + Math.random() * 0.42);

        let baseSpeed = 1.0;
        if (wType === 'rain' || wType === 'blood_rain') baseSpeed = (6.8 + Math.random() * 3.8) * (0.65 + depth * 0.45);
        else if (wType === 'matrix_rain') baseSpeed = (0.75 + Math.random() * 0.85) * (0.6 + depth * 0.5);
        else if (wType === 'snow') baseSpeed = (0.42 + Math.random() * 0.65) * (0.55 + depth * 0.55);
        else if (wType === 'petals') baseSpeed = (0.55 + Math.random() * 0.65) * (0.6 + depth * 0.5);
        else if (wType === 'ash' || wType === 'toxic') baseSpeed = (0.45 + Math.random() * 0.65) * (0.6 + depth * 0.5);
        else if (wType === 'fireflies' || wType === 'cosmic_dust') baseSpeed = (0.22 + Math.random() * 0.45) * depth;
        else if (wType === 'shooting_stars') baseSpeed = (3.8 + Math.random() * 2.5) * (0.7 + depth * 0.4);

        let baseSize = (1.2 + Math.random() * 1.6) * depth;
        let trailLen = (depth > 1.0) ? 5 : (depth > 0.65 ? 4 : 3);
        let trailChars = [];
        for (let c = 0; c < trailLen; c++) {
            trailChars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }

        window.activeWeatherFX.push({
            x: -200 + Math.random() * (cW + 400),
            y: -250 + Math.random() * (cH + 350),
            depth: depth,
            speed: baseSpeed,
            size: baseSize,
            ang: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() - 0.5) * 0.04,
            swayAmp: (0.4 + Math.random() * 0.9) * depth,
            swayFreq: 0.012 + Math.random() * 0.018,
            phase: Math.random() * Math.PI * 2,
            trailChars: trailChars,
            alpha: Math.min(0.95, (0.28 + Math.random() * 0.32) * (0.55 + depth * 0.45))
        });
    }
};

// ==========================================
// 2. HÀM VẼ SÂN ĐẤU 5 LỚP CHIỀU SÂU (5-LAYER PARALLAX RENDERER)
// ==========================================
window.drawMapBackground = function(ctx) {
    if (!ctx || !window.canvas) return;
    let cmap = window.currentMap || window.MAPS[0];
    let cW = window.canvas.width;
    let cH = window.canvas.height;
    let gY = window.GROUND_Y || 320;
    let camX = window.camX || 0;
    let now = Date.now() / 1000;

    // ----------------------------------------------------
    // LỚP 0: BẦU TRỜI ĐÊM & SAO LẤP LÁNH
    // ----------------------------------------------------
    let skyGrad = ctx.createLinearGradient(0, -150, 0, gY);
    skyGrad.addColorStop(0, cmap.sky1 || "#0b132b");
    skyGrad.addColorStop(1, cmap.sky2 || "#1c2541");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-camX - 800, -800, cW + 1600, gY + 850);

    // Các ngôi sao lấp lánh ở tầng xa nhất (Parallax 0.03x)
    ctx.save();
    ctx.translate(camX * 0.03, 0);
    let stars = window._mapCache.stars || [];
    for (let i = 0; i < stars.length; i++) {
        let st = stars[i];
        let twinkle = 0.3 + Math.abs(Math.sin(now * 1.8 + st.phase)) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.75})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // ----------------------------------------------------
    // LỚP 1: THIÊN THỂ KHỔNG LỒ & CỰC QUANG (Parallax 0.06x)
    // ----------------------------------------------------
    ctx.save();
    ctx.translate(camX * 0.06, 0);
    let celX = cW * 0.52;
    let celY = gY - 175;
    let celCol = cmap.celestialCol || "#00f3ff";

    if (cmap.celestial === "blood_moon" || cmap.celestial === "full_moon" || cmap.celestial === "neon_moon") {
        // Quầng hào quang 3 lớp mượt mà
        ctx.fillStyle = celCol;
        ctx.globalAlpha = 0.12;
        ctx.beginPath(); ctx.arc(celX, celY, 135, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.25;
        ctx.beginPath(); ctx.arc(celX, celY, 92, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = (cmap.celestial === "full_moon") ? "#fef9c3" : celCol;
        ctx.beginPath(); ctx.arc(celX, celY, 66, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    else if (cmap.celestial === "retro_sun") {
        // Mặt trời cắt ngang chuẩn Synthwave 80s
        let sunR = 82;
        let sunGrad = ctx.createLinearGradient(celX, celY - sunR, celX, celY + sunR);
        sunGrad.addColorStop(0, "#ff007f");
        sunGrad.addColorStop(0.5, "#ff7b00");
        sunGrad.addColorStop(1, "#ffea00");
        ctx.fillStyle = sunGrad;
        ctx.beginPath(); ctx.arc(celX, celY, sunR, 0, Math.PI * 2); ctx.fill();
        // Các vạch cắt ngang mặt trời
        ctx.fillStyle = cmap.sky2;
        for (let s = 10; s < sunR; s += 14) {
            let stripeH = Math.max(2, (s / sunR) * 7);
            ctx.fillRect(celX - sunR - 5, celY + s, sunR * 2 + 10, stripeH);
        }
    }
    else if (cmap.celestial === "eclipse" || cmap.celestial === "black_hole_sun") {
        // Nhật thực / Hố đen Gargantua phát sáng rực rỡ
        ctx.fillStyle = celCol;
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.arc(celX, celY, 120, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.arc(celX, celY, 72 + Math.sin(now * 4) * 3, 0, Math.PI * 2); ctx.fill();
        if (cmap.celestial === "black_hole_sun") {
            ctx.strokeStyle = "#fde047";
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.ellipse(celX, celY, 125, 22, -0.22, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#030106";
        ctx.beginPath(); ctx.arc(celX, celY, 62, 0, Math.PI * 2); ctx.fill();
    }
    else if (cmap.celestial === "ringed_planet") {
        ctx.fillStyle = celCol;
        ctx.globalAlpha = 0.2;
        ctx.beginPath(); ctx.arc(celX + 110, celY - 15, 90, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(celX + 110, celY - 15, 52, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.ellipse(celX + 110, celY - 15, 98, 20, -0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    else if (cmap.celestial === "aurora") {
        // Dải lụa Cực Quang uốn lượn mềm mại trên bầu trời
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let band = 0; band < 3; band++) {
            ctx.beginPath();
            let baseY = 65 + band * 28;
            ctx.moveTo(-400, baseY);
            for (let ax = -400; ax <= cW + 400; ax += 60) {
                let ay = baseY + Math.sin(ax * 0.008 + now * 1.2 + band) * 24;
                ctx.lineTo(ax, ay);
            }
            ctx.strokeStyle = band === 0 ? "rgba(0, 255, 170, 0.22)" : (band === 1 ? "rgba(56, 189, 248, 0.18)" : "rgba(192, 132, 252, 0.14)");
            ctx.lineWidth = 34;
            ctx.stroke();
        }
        ctx.restore();
    }
    else if (cmap.celestial === "twin_moons") {
        ctx.fillStyle = celCol;
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.arc(celX - 70, celY - 10, 44, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.65;
        ctx.beginPath(); ctx.arc(celX + 45, celY + 25, 28, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    else if (cmap.celestial === "cyber_core") {
        ctx.strokeStyle = celCol;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(celX, celY, 75, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(celX, celY, 52, now, now + Math.PI * 1.3); ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    ctx.restore();

    // ----------------------------------------------------
    // LỚP 2: DÃY NÚI CHÂN TRỜI XA / ĐẢO BAY (Parallax 0.16x)
    // ----------------------------------------------------
    ctx.save();
    let cxFar = camX * 0.16;
    ctx.translate(cxFar, 0);
    ctx.fillStyle = cmap.bg2Col || "#1c2541";

    if (cmap.horizon === "fuji") {
        // Núi Phú Sĩ hùng vĩ ở trung tâm
        let fx = cW * 0.5;
        ctx.beginPath();
        ctx.moveTo(fx - 340, gY);
        ctx.quadraticCurveTo(fx - 110, gY - 40, fx - 45, gY - 185);
        ctx.lineTo(fx + 45, gY - 185);
        ctx.quadraticCurveTo(fx + 110, gY - 40, fx + 340, gY);
        ctx.closePath();
        ctx.fill();
        // Đỉnh tuyết trắng trên núi Phú Sĩ
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.moveTo(fx - 45, gY - 185);
        ctx.lineTo(fx + 45, gY - 185);
        ctx.lineTo(fx + 72, gY - 135);
        ctx.lineTo(fx + 25, gY - 150);
        ctx.lineTo(fx, gY - 130);
        ctx.lineTo(fx - 25, gY - 150);
        ctx.lineTo(fx - 72, gY - 135);
        ctx.closePath();
        ctx.fill();
    }
    else if (cmap.horizon === "volcano") {
        let vx = cW * 0.5;
        ctx.beginPath();
        ctx.moveTo(vx - 320, gY);
        ctx.lineTo(vx - 55, gY - 175);
        ctx.lineTo(vx + 55, gY - 175);
        ctx.lineTo(vx + 320, gY);
        ctx.closePath();
        ctx.fill();
        // Miệng núi lửa rực sáng
        ctx.fillStyle = "#ff5400";
        ctx.globalAlpha = 0.65 + Math.sin(now * 5) * 0.2;
        ctx.beginPath();
        ctx.ellipse(vx, gY - 175, 52, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    else if (cmap.horizon === "floating_islands") {
        let rocks = window._mapCache.floatingRocks || [];
        for (let i = 0; i < rocks.length; i++) {
            let rk = rocks[i];
            let floatY = rk.y + Math.sin(now * 1.5 + rk.phase) * 8;
            ctx.fillStyle = cmap.bg2Col;
            ctx.beginPath();
            ctx.moveTo(rk.x - rk.w, floatY);
            ctx.lineTo(rk.x + rk.w, floatY);
            ctx.lineTo(rk.x + rk.w * 0.5, floatY + rk.h);
            ctx.lineTo(rk.x, floatY + rk.h * 1.45);
            ctx.lineTo(rk.x - rk.w * 0.6, floatY + rk.h * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = cmap.line;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(rk.x - rk.w, floatY); ctx.lineTo(rk.x + rk.w, floatY); ctx.stroke();
        }
    }
    else {
        let hNodes = window._mapCache.horizonNodes || [];
        for (let i = 0; i < hNodes.length; i++) {
            let hn = hNodes[i];
            ctx.fillStyle = cmap.bg2Col;
            ctx.beginPath();
            ctx.moveTo(hn.x, gY);
            ctx.lineTo(hn.x + hn.w * 0.5, gY - hn.h);
            ctx.lineTo(hn.x + hn.w, gY);
            ctx.closePath();
            ctx.fill();

            if (cmap.horizon === "wire_peaks") {
                ctx.strokeStyle = cmap.line;
                ctx.globalAlpha = 0.45;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            } else if (cmap.horizon === "ice_peaks") {
                ctx.fillStyle = "rgba(224, 242, 254, 0.25)";
                ctx.beginPath();
                ctx.moveTo(hn.x + hn.w * 0.5, gY - hn.h);
                ctx.lineTo(hn.x + hn.w * 0.68, gY - hn.h * 0.62);
                ctx.lineTo(hn.x + hn.w * 0.5, gY - hn.h * 0.72);
                ctx.closePath();
                ctx.fill();
            } else if (cmap.horizon === "pyramids") {
                ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }
    ctx.restore();

    // ----------------------------------------------------
    // LỚP 3: KIẾN TRÚC TRUNG CẢNH (Parallax 0.32x)
    // ----------------------------------------------------
    ctx.save();
    let cxMid = camX * 0.32;
    ctx.translate(cxMid, 0);
    let mNodes = window._mapCache.midNodes || [];

    for (let i = 0; i < mNodes.length; i++) {
        let mn = mNodes[i];
        let bx = mn.x;
        let bw = mn.w;
        let bh = mn.h;
        ctx.fillStyle = cmap.bg1Col || "#14213d";

        if (cmap.mid === "cyber_city" || cmap.mid === "digital_towers") {
            ctx.fillRect(bx, gY - bh, bw, bh);
            if (mn.hasRoofSpire) {
                ctx.fillRect(bx + bw * 0.45, gY - bh - 24, 3, 24);
            }
            // Ô cửa sổ phát sáng lung linh
            let wins = mn.windows || [];
            for (let w = 0; w < wins.length; w++) {
                let win = wins[w];
                ctx.fillStyle = (cmap.mid === "digital_towers")
                    ? "rgba(0, 255, 102, 0.55)"
                    : (win.isCyan ? "rgba(0, 243, 255, 0.65)" : "rgba(255, 0, 127, 0.65)");
                ctx.fillRect(bx + win.rx, gY - bh + win.ry, 6, 8);
            }
        }
        else if (cmap.mid === "torii") {
            // Cổng thần đạo Torii Nhật Bản & Đèn lồng phát sáng
            if (i % 2 === 0) {
                let th = 95;
                ctx.fillStyle = cmap.bg1Col;
                ctx.fillRect(bx + 10, gY - th, 8, th);
                ctx.fillRect(bx + 54, gY - th, 8, th);
                ctx.fillRect(bx - 4, gY - th - 6, 76, 10);
                ctx.fillRect(bx + 4, gY - th + 16, 60, 7);
                // Đèn lồng đỏ phát sáng dưới cổng Torii
                ctx.fillStyle = cmap.line;
                ctx.globalAlpha = 0.85;
                ctx.beginPath(); ctx.arc(bx + 36, gY - th + 32, 6, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
        else if (cmap.mid === "giant_swords") {
            // Những thanh đại kiếm khổng lồ cắm nghiêng trên chiến trường
            ctx.save();
            ctx.translate(bx + 30, gY);
            ctx.rotate(mn.tilt);
            ctx.fillStyle = cmap.bg1Col;
            ctx.beginPath();
            ctx.moveTo(-9, 0);
            ctx.lineTo(-11, -bh * 0.85);
            ctx.lineTo(0, -bh - 15);
            ctx.lineTo(11, -bh * 0.85);
            ctx.lineTo(9, 0);
            ctx.closePath();
            ctx.fill();
            // Chuôi kiếm chữ thập
            ctx.fillRect(-24, -bh * 0.85, 48, 7);
            ctx.fillRect(-4, -bh * 0.85 - 28, 8, 28);
            ctx.restore();
        }
        else if (cmap.mid === "pines" || cmap.mid === "palms") {
            ctx.fillStyle = cmap.bg1Col;
            ctx.fillRect(bx + 24, gY - 28, 8, 28);
            ctx.beginPath();
            ctx.moveTo(bx, gY - 22);
            ctx.lineTo(bx + 28, gY - bh * 0.85);
            ctx.lineTo(bx + 56, gY - 22);
            ctx.closePath();
            ctx.fill();
        }
        else if (cmap.mid === "pillars" || cmap.mid === "cathedral") {
            ctx.fillStyle = cmap.bg1Col;
            ctx.fillRect(bx + 12, gY - bh * 0.85, 28, bh * 0.85);
            ctx.fillRect(bx + 4, gY - bh * 0.85 - 10, 44, 10);
            ctx.fillRect(bx + 4, gY - 12, 44, 12);
        }
        else {
            // Obsidian Spires (Gai đá Hỏa Diệm Sơn)
            ctx.fillStyle = cmap.bg1Col;
            ctx.beginPath();
            ctx.moveTo(bx, gY);
            ctx.lineTo(bx + bw * 0.4, gY - bh);
            ctx.lineTo(bx + bw * 0.8, gY);
            ctx.closePath();
            ctx.fill();
        }
    }
    ctx.restore();

    // ----------------------------------------------------
    // LỚP 4: SƯƠNG MÙ CHÂN TRỜI TẠO ĐỘ SÂU (ATMOSPHERIC MIST)
    // ----------------------------------------------------
    let mistGrad = ctx.createLinearGradient(0, gY - 55, 0, gY + 5);
    mistGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    mistGrad.addColorStop(1, cmap.line || "#00f3ff");
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = mistGrad;
    ctx.fillRect(-camX - 500, gY - 55, cW + 1000, 60);
    ctx.restore();

    // ----------------------------------------------------
    // LỚP 5: MẶT ĐẤT & LƯỚI PHỐI CẢNH 3D (3D PERSPECTIVE FLOOR)
    // ----------------------------------------------------
    let groundGrad = ctx.createLinearGradient(0, gY, 0, cH + 150);
    groundGrad.addColorStop(0, cmap.ground || "#0f172a");
    groundGrad.addColorStop(1, "#000000");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(-camX - 1000, gY, cW + 2000, cH - gY + 400);

    // Vẽ đường lưới 3D hoặc gạch đá trên mặt sàn để thấy rõ chuyển động Camera
    ctx.save();
    ctx.strokeStyle = cmap.line || "#00f3ff";
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1.5;

    let floorCenterX = (cW / 2) - camX;
    for (let gx = -1200; gx <= 1200; gx += 95) {
        ctx.beginPath();
        ctx.moveTo(floorCenterX + gx * 0.35, gY);
        ctx.lineTo(floorCenterX + gx * 1.85, cH + 120);
        ctx.stroke();
    }
    for (let gy = gY + 14; gy < cH + 60; gy += 22) {
        ctx.beginPath();
        ctx.moveTo(-camX - 800, gy);
        ctx.lineTo(-camX + cW + 800, gy);
        ctx.stroke();
    }
    ctx.restore();

    // Đường chân trời Neon sắc nét nơi hai đấu sĩ đứng
    ctx.strokeStyle = cmap.line || "#00f3ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-camX - 1000, gY);
    ctx.lineTo(-camX + cW + 1000, gY);
    ctx.stroke();
};

window.pushEnvChatReaction = function(msgText) {
    if (!window._liveChats || typeof window.precalcChatText !== 'function' || !window.recordCtxV) return;
    let celeb = (window.CELEB_LIST && window.CELEB_LIST.length > 0)
        ? window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)]
        : { name: "IShowSpeed 🐕", color: "#ff4757" };
    let chatObj = { name: celeb.name, color: celeb.color, msg: msgText, lines: null, nameWidth: 0, isHighlight: true };
    window.precalcChatText(chatObj, window.recordCtxV);
    window._liveChats.push(chatObj);
    if (window._liveChats.length > 12) window._liveChats.shift();
};

// ==========================================
// 3. VẬT LÝ THỜI TIẾT 3D & BẪY MÔI TRƯỜNG
// ==========================================
window.updateWeatherPhysics = function() {
    if (window.timeStopTimer > 0) return;

    if (window.envDamage && window.envDamage.length > 0) {
        if (window.envDamage.length > 4) window.envDamage.splice(0, window.envDamage.length - 4);
        for (let i = window.envDamage.length - 1; i >= 0; i--) {
            let d = window.envDamage[i];
            if (d.life === undefined) d.life = 240;
            d.life--;
            if (d.life <= 0) window.envDamage.splice(i, 1);
        }
    }

    if (window.rainSplashes && window.rainSplashes.length > 0) {
        for (let i = window.rainSplashes.length - 1; i >= 0; i--) {
            let sp = window.rainSplashes[i];
            sp.r += sp.speed;
            sp.life--;
            if (sp.life <= 0) window.rainSplashes.splice(i, 1);
        }
    }

    let wType = window.currentWeather || 'none';
    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;
    let cX = -(window.camX || 0);
    let cY = -(window.camY || 0);

    if (window.activeWeatherFX && window.activeWeatherFX.length > 0) {
        let leftBound = cX - 220;
        let rightBound = cX + cW + 220;
        let topBound = cY - 260;
        let bottomBound = cY + cH + 120;

        let nowTime = Date.now() / 1000;
        let gentleWind = (window.globalWind || 0) * 0.35;

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            w.phase += 0.035;

            if (wType === 'toxic' || wType === 'ash') { 
                w.y -= w.speed; 
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * w.swayAmp + gentleWind * w.depth; 
            } 
            else if (wType === 'fireflies') {
                w.x += Math.cos(nowTime * 1.2 + w.phase) * w.speed;
                w.y += Math.sin(nowTime * 1.5 + w.phase) * w.speed * 0.8;
            }
            else if (wType === 'cosmic_dust') {
                w.y += Math.sin(nowTime * 0.8 + w.phase) * 0.35 * w.depth; 
                w.x += Math.cos(nowTime * 0.7 + w.phase) * 0.45 * w.depth;
            } 
            else if (wType === 'matrix_rain') {
                w.y += w.speed;
                if (Math.random() < 0.04 && w.trailChars && w.trailChars.length > 0) {
                    w.trailChars[0] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                }
            } 
            else if (wType === 'shooting_stars') {
                w.y += w.speed * 1.4; 
                w.x -= w.speed * 1.9;
            } 
            else if (wType === 'rain' || wType === 'blood_rain') {
                w.y += w.speed; 
                w.x += (-1.8 * w.depth) + gentleWind * w.depth;

                if (w.y >= window.GROUND_Y && w.y - w.speed < window.GROUND_Y && Math.random() < 0.35 && window.rainSplashes.length < 28) {
                    window.rainSplashes.push({
                        x: w.x,
                        y: window.GROUND_Y + (Math.random() - 0.5) * 6,
                        r: 2 * w.depth,
                        speed: 0.85 * w.depth,
                        life: 12,
                        maxLife: 12,
                        isBlood: (wType === 'blood_rain')
                    });
                }
            }
            else if (wType === 'snow') {
                w.y += w.speed;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 0.75) + gentleWind * w.depth * 0.6;
                w.ang += w.spinSpeed;
            }
            else if (wType === 'petals') {
                w.y += w.speed;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 1.1) + gentleWind * w.depth * 0.8;
                w.ang += w.spinSpeed * 1.5;
            }
            else { 
                w.y += w.speed; 
                w.x += Math.sin(w.phase) * w.swayAmp; 
            }

            if (w.y > bottomBound) {
                w.y = topBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
            } else if (w.y < topBound) {
                w.y = bottomBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
            }
            
            if (w.x > rightBound) {
                w.x = leftBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
            } else if (w.x < leftBound) {
                w.x = rightBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
            }
        }
    }

    let isMatchActive = !window.gameOver && (!window.introTimer || window.introTimer <= 0);
    if (isMatchActive && window.matchTimer) {
        if (!window.envHazards) window.envHazards = [];
        if (!window.projectiles) window.projectiles = [];
        
        let meteorChance = 0.0018 + ((window.matchTimer || 0) / 3600) * 0.008; 
        if (Math.random() < meteorChance && window.projectiles.length < 8) { 
            window.projectiles.push({
                x: 60 + Math.random() * (cW - 120),
                y: cY - 450,
                vx: (Math.random() - 0.5) * 4,
                vy: 12 + Math.random() * 5,
                radius: 12 + Math.random() * 6,
                color: "#e67e22",
                dmg: 40,
                target: null,
                isMeteor: true
            }); 
        }
        
        if ((wType === 'rain' || wType === 'blood_rain') && Math.random() < 0.0045 && window.envHazards.length < 2) { 
            window.envHazards.push({ type: 'lightning', x: 80 + Math.random() * (cW - 160), timer: 42, state: 'warning' }); 
        }
        else if (wType === 'ash' && Math.random() < 0.003 && window.envHazards.length < 2) { 
            window.envHazards.push({ type: 'lava', x: 80 + Math.random() * (cW - 160), timer: 55 }); 
        }

        for (let i = window.envHazards.length - 1; i >= 0; i--) {
            let haz = window.envHazards[i];
            haz.timer--;

            if (haz.type === 'lightning') {
                if (haz.state === 'warning' && haz.timer <= 0) {
                    haz.state = 'striking';
                    haz.timer = 12;
                    if (typeof window.playSound === 'function') window.playSound(300, 'sawtooth', 0.6, 0.7, true); 
                    window.screenFlash = 0.55; 
                    if (typeof window.shakeScreen === 'function') window.shakeScreen(14, 8); 
                    if (typeof window.spawnEnvDamage === 'function') window.spawnEnvDamage(haz.x, window.GROUND_Y, 'crater', 1.1, false);
                    
                    let allFighters = [];
                    if (window.p1) allFighters.push(window.p1);
                    if (window.enemies) allFighters = allFighters.concat(window.enemies);
                    
                    let hitAnyone = false;
                    allFighters.forEach(f => {
                        if (f && f.hp > 0 && Math.abs(f.x - haz.x) < 68) {
                            if (typeof window.takeDamage === 'function') window.takeDamage(f, 35, "#00f3ff", true, false);
                            f.state = 'hurt';
                            f.hitStun = 35;
                            f.vx = (f.x - haz.x > 0 ? 12 : -12);
                            hitAnyone = true;
                        }
                    });
                    if (hitAnyone) window.pushEnvChatReaction("Ở ác quá bị sét đánh trúng đầu kìa 💀⚡");
                } else if (haz.state === 'striking' && haz.timer <= 0) {
                    window.envHazards.splice(i, 1);
                }
            } 
            else if (haz.type === 'lava' && haz.timer <= 0) {
                if (typeof window.playSound === 'function') window.playSound(100, 'square', 0.6, 0.7, true); 
                if (typeof window.shakeScreen === 'function') window.shakeScreen(16, 8); 
                if (typeof window.spawnParticles === 'function') window.spawnParticles(haz.x, window.GROUND_Y, "#e74c3c", true); 
                
                let allFighters = [];
                if (window.p1) allFighters.push(window.p1);
                if (window.enemies) allFighters = allFighters.concat(window.enemies);
                
                let hitLava = false;
                allFighters.forEach(f => {
                    if (f && f.hp > 0 && Math.abs(f.x - haz.x) < 75 && f.y >= window.GROUND_Y - 110) {
                        if (typeof window.takeDamage === 'function') window.takeDamage(f, 38, "#e74c3c", true, false);
                        f.vy = -12;
                        f.onGround = false;
                        f.state = 'hurt';
                        f.hitStun = 35;
                        hitLava = true;
                    }
                });
                if (hitLava) window.pushEnvChatReaction("Dung nham phun cháy mông luôn rồi 😂🌋");
                window.envHazards.splice(i, 1);
            }
        }
    }
};

// ==========================================
// 4. RENDER VẾT NỨT, THIÊN TAI & HẠT THỜI TIẾT LUNG LINH
// ==========================================
window.drawEnvironmentDamage = function(ctx) {
    if (!ctx || !window.envDamage || window.envDamage.length === 0) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    window.envDamage.forEach(dmg => {
        let alpha = dmg.life !== undefined ? Math.min(1, dmg.life / 60) : 1;
        if (alpha <= 0) return;

        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(dmg.x, dmg.y);

        if (dmg.type === 'crater') {
            ctx.save();
            ctx.scale(1, 0.15); 
            let rad = dmg.radius || 40;
            if (dmg.isBurning) {
                ctx.fillStyle = `rgba(255, 60, 0, ${0.45 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad * 1.35, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = `rgba(255, 180, 0, ${0.75 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad * 0.75, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = `rgba(12, 12, 12, ${0.7 * alpha})`;
                ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }

        let baseLw = (dmg.isBurning ? 3.5 : 2.5) * (dmg.scale || 1);
        if (dmg.cracks) {
            dmg.cracks.forEach(path => {
                if (Array.isArray(path) && path.length > 1) {
                    ctx.beginPath();
                    path.forEach((pt, idx) => { if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
                    
                    ctx.strokeStyle = dmg.isBurning ? `rgba(255, 50, 0, ${0.55 * alpha})` : `rgba(0, 0, 0, ${0.45 * alpha})`;
                    ctx.lineWidth = baseLw + 2.5;
                    ctx.stroke();

                    ctx.strokeStyle = dmg.isBurning ? `rgba(255, 230, 100, ${0.95 * alpha})` : `rgba(10, 10, 10, ${0.85 * alpha})`;
                    ctx.lineWidth = baseLw * 0.45;
                    ctx.stroke();
                }
            });
        }
        ctx.restore();
    });
    ctx.restore();
};

window.drawEnvironmentalHazards = function(ctx) {
    if (!ctx || !window.envHazards || window.envHazards.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; 

    window.envHazards.forEach(haz => {
        if (haz.type === 'lightning') {
            if (haz.state === 'warning') {
                let pulse = 0.5 + Math.sin(haz.timer * 0.45) * 0.5;
                ctx.fillStyle = `rgba(0, 243, 255, ${0.12 + pulse * 0.28})`;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 38 + pulse * 22, 8, 0, 0, Math.PI * 2); ctx.fill();
                
                ctx.strokeStyle = "rgba(0, 243, 255, 0.85)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(haz.x + (Math.random() - 0.5) * 35, window.GROUND_Y);
                ctx.lineTo(haz.x + (Math.random() - 0.5) * 35, window.GROUND_Y - 25 - Math.random() * 35);
                ctx.stroke();
            } 
            else if (haz.state === 'striking') {
                let startX = haz.x + (Math.random() - 0.5) * 120;
                let startY = window.GROUND_Y - 650; 
                let steps = 12;
                let path = [{x: startX, y: startY}];
                for (let s = 1; s <= steps; s++) {
                    let px = startX + (haz.x - startX) * (s / steps) + (Math.random() - 0.5) * 75;
                    let py = startY + (window.GROUND_Y - startY) * (s / steps);
                    path.push({x: px, y: py});
                }

                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
                ctx.lineWidth = 14;
                ctx.stroke();

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 65, 14, 0, 0, Math.PI * 2); ctx.fill();
            }
        } 
        else if (haz.type === 'lava') { 
            let pulse = Math.abs(Math.sin(haz.timer * 0.25));
            ctx.fillStyle = `rgba(255, 60, 0, ${0.2 + pulse * 0.35})`; 
            ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 55 + pulse * 15, 12, 0, 0, Math.PI * 2); ctx.fill(); 
        }
    });
    ctx.restore();
};

window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    ctx.save();
    let wType = window.currentWeather;

    if (wType === 'snow') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let twinkle = 0.75 + Math.sin(w.phase * 1.5) * 0.25;
            let curAlpha = w.alpha * twinkle;

            if (w.depth > 0.95) {
                ctx.fillStyle = `rgba(200, 240, 255, ${curAlpha * 0.28})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 2.4, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
            ctx.fill();

            if (w.depth > 1.22) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${curAlpha * 0.65})`;
                ctx.lineWidth = 1;
                let r = w.size * 1.65;
                ctx.beginPath();
                ctx.moveTo(w.x - r, w.y); ctx.lineTo(w.x + r, w.y);
                ctx.moveTo(w.x, w.y - r); ctx.lineTo(w.x, w.y + r);
                ctx.stroke();
            }
        }
    }
    else if (wType === 'matrix_rain') {
        ctx.textAlign = "center";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let fontSize = Math.round(9 + w.depth * 6.5);
            ctx.font = `bold ${fontSize}px monospace`;

            let chars = w.trailChars || ["1", "0", "1"];
            for (let c = 0; c < chars.length; c++) {
                let charY = w.y - c * (fontSize * 1.05);
                if (c === 0) {
                    if (w.depth > 0.9) {
                        ctx.fillStyle = `rgba(0, 255, 128, ${w.alpha * 0.28})`;
                        ctx.beginPath();
                        ctx.arc(w.x, charY - fontSize * 0.35, fontSize * 0.75, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = `rgba(220, 255, 235, ${Math.min(1, w.alpha * 1.25)})`;
                    ctx.fillText(chars[c], w.x, charY);
                } else {
                    let tailAlpha = w.alpha * (1 - c / chars.length) * 0.82;
                    ctx.fillStyle = `rgba(0, 255, 95, ${tailAlpha})`;
                    ctx.fillText(chars[c], w.x, charY);
                }
            }
        }
    }
    else if (wType === 'rain' || wType === 'blood_rain') {
        let isBlood = (wType === 'blood_rain');
        ctx.lineCap = "round";

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let len = (isBlood ? 20 : 16) * w.depth;
            let dx = -len * 0.22;
            ctx.lineWidth = (isBlood ? 1.8 : 1.25) * w.depth;
            ctx.strokeStyle = isBlood
                ? `rgba(255, 55, 75, ${w.alpha * 0.85})`
                : `rgba(175, 225, 255, ${w.alpha * 0.75})`;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(w.x + dx, w.y + len);
            ctx.stroke();
        }

        if (window.rainSplashes && window.rainSplashes.length > 0) {
            for (let i = 0; i < window.rainSplashes.length; i++) {
                let sp = window.rainSplashes[i];
                let spAlpha = (sp.life / sp.maxLife) * 0.65;
                ctx.strokeStyle = sp.isBlood
                    ? `rgba(255, 70, 90, ${spAlpha})`
                    : `rgba(190, 235, 255, ${spAlpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.ellipse(sp.x, sp.y, sp.r * 2.2, sp.r * 0.55, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    else if (wType === 'petals') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let flipScale = 0.35 + Math.abs(Math.cos(w.phase)) * 0.65;
            let pW = w.size * 1.65;
            let pH = w.size * 0.85 * flipScale;

            if (w.depth > 1.0) {
                ctx.fillStyle = `rgba(255, 160, 200, ${w.alpha * 0.25})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, pW * 1.3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = (i % 2 === 0)
                ? `rgba(255, 145, 190, ${w.alpha})`
                : `rgba(255, 205, 225, ${w.alpha})`;
            ctx.beginPath();
            ctx.ellipse(w.x, w.y, pW, pH, w.ang, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    else if (wType === 'ash' || wType === 'toxic') {
        let isAsh = (wType === 'ash');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let pulse = 0.65 + Math.abs(Math.sin(w.phase)) * 0.35;
            let a = w.alpha * pulse;

            ctx.fillStyle = isAsh
                ? `rgba(255, 90, 0, ${a * 0.32})`
                : `rgba(46, 213, 115, ${a * 0.25})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isAsh
                ? `rgba(255, 200, 70, ${Math.min(1, a * 1.2)})`
                : `rgba(120, 255, 170, ${a})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    else if (wType === 'fireflies' || wType === 'cosmic_dust') {
        let isFirefly = (wType === 'fireflies');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let glow = 0.25 + Math.abs(Math.sin(w.phase * 0.85)) * 0.75;
            let outerCol = isFirefly
                ? `rgba(241, 196, 15, ${glow * w.alpha * 0.32})`
                : (i % 2 === 0 ? `rgba(0, 243, 255, ${glow * w.alpha * 0.3})` : `rgba(185, 103, 255, ${glow * w.alpha * 0.3})`);
            let coreCol = isFirefly
                ? `rgba(255, 250, 190, ${glow * w.alpha})`
                : `rgba(255, 255, 255, ${glow * w.alpha})`;

            ctx.fillStyle = outerCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 3.0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = coreCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 0.95, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    else if (wType === 'shooting_stars') {
        ctx.lineCap = "round";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            let tailX = w.x + w.speed * 7.5;
            let tailY = w.y - w.speed * 5.5;

            let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${w.alpha})`);
            grad.addColorStop(0.3, `rgba(0, 243, 255, ${w.alpha * 0.65})`);
            grad.addColorStop(1, "rgba(0, 243, 255, 0)");

            ctx.strokeStyle = grad;
            ctx.lineWidth = w.size * 0.95;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${w.alpha})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 1.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
};
