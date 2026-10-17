// ==========================================
// ENVIRONMENT.JS - TRẠM BẢN ĐỒ 5 LỚP CHIỀU SÂU & THỜI TIẾT 3D (V8.0 ULTRA PARALLAX)
// ĐẢM NHIỆM 100%:
// 1. 16 Bản đồ ngẫu nhiên tuyệt đẹp (Cyberpunk, Sakura Moon, Synthwave, Aurora, Eclipse, Sword Graveyard...).
// 2. Render 5 tầng chiều sâu (Thiên thể -> Núi xa -> Kiến trúc trung cảnh -> Sương mù -> Mặt sàn phối cảnh 3D).
// 3. Khởi tạo trước (Pre-compute) toàn bộ tọa độ ngôi sao, cửa sổ, đỉnh núi trong < 1ms -> Load tức thì, chuẩn 60FPS.
// ==========================================

// Danh sách 14 bản đồ 5 lớp chiều sâu & hàm trộn ngẫu nhiên dùng chung toàn game
window.MAPS = [
    { id: "sakura_moon", name: "ĐỈNH ANH ĐÀO TRĂNG MÁU", sky1: "#0d021a", sky2: "#3b0944", celestial: "blood_moon", celestialCol: "#ff2a6d", horizon: "fuji", mid: "torii", floor: "stone", bg2Col: "#1a0526", bg1Col: "#2d083a", ground: "#11031c", line: "#ff2a6d", weather: "petals" },
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

// Hàm dùng chung trộn ngẫu nhiên câu thoại Trash Talk cho tất cả các tướng & điệu nhảy
window.shuffleTrashTalk = function(arr) {
    if (!Array.isArray(arr)) return [];
    let copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

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
    window.weatherSubParticles = [];
    window.ambientMist = [];
    window.envDamage = [];
    window.envHazards = [];
    window.weatherWindGust = 0;
    window._ambientLightningAlpha = 0;

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

    // 5. Khởi tạo sương mù mặt đất (Volumetric Ground Mist Ribbons)
    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;
    let gY = window.GROUND_Y || 350;
    for (let m = 0; m < 10; m++) {
        window.ambientMist.push({
            x: -350 + m * 165 + (Math.random() - 0.5) * 60,
            y: gY - 12 + (Math.random() - 0.5) * 26,
            rx: 95 + Math.random() * 85,
            ry: 16 + Math.random() * 16,
            vx: (0.18 + Math.random() * 0.28) * (m % 2 === 0 ? 1 : -1),
            phase: Math.random() * Math.PI * 2,
            alpha: 0.06 + Math.random() * 0.08
        });
    }

    // 6. Khởi tạo hạt thời tiết 3 tầng chiều sâu (Far / Mid / Foreground Bokeh)
    let wType = window.currentWeather;
    let ptCount = 0;
    if (wType === 'rain' || wType === 'blood_rain') ptCount = 95;
    else if (wType === 'snow') ptCount = 90;
    else if (wType === 'matrix_rain') ptCount = 44;
    else if (wType === 'ash' || wType === 'toxic') ptCount = 70;
    else if (wType === 'petals') ptCount = 64;
    else if (wType === 'fireflies') ptCount = 52;
    else if (wType === 'cosmic_dust') ptCount = 65;
    else if (wType === 'shooting_stars') ptCount = 24;

    for (let i = 0; i < ptCount; i++) {
        let randLayer = Math.random();
        let depth = (randLayer < 0.42)
            ? (0.36 + Math.random() * 0.34)
            : (randLayer < 0.80)
                ? (0.72 + Math.random() * 0.34)
                : (1.08 + Math.random() * 0.45);

        let baseSpeed = 1.0;
        if (wType === 'rain' || wType === 'blood_rain') baseSpeed = (8.2 + Math.random() * 4.5) * (0.62 + depth * 0.48);
        else if (wType === 'matrix_rain') baseSpeed = (0.85 + Math.random() * 0.95) * (0.6 + depth * 0.5);
        else if (wType === 'snow') baseSpeed = (0.45 + Math.random() * 0.68) * (0.52 + depth * 0.55);
        else if (wType === 'petals') baseSpeed = (0.58 + Math.random() * 0.68) * (0.58 + depth * 0.52);
        else if (wType === 'ash' || wType === 'toxic') baseSpeed = (0.48 + Math.random() * 0.72) * (0.58 + depth * 0.52);
        else if (wType === 'fireflies' || wType === 'cosmic_dust') baseSpeed = (0.26 + Math.random() * 0.48) * depth;
        else if (wType === 'shooting_stars') baseSpeed = (4.2 + Math.random() * 3.0) * (0.68 + depth * 0.42);

        let baseSize = (1.25 + Math.random() * 1.75) * depth;
        let trailLen = (depth > 1.0) ? 6 : (depth > 0.65 ? 5 : 4);
        let trailChars = [];
        for (let c = 0; c < trailLen; c++) {
            trailChars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }

        window.activeWeatherFX.push({
            x: -240 + Math.random() * (cW + 480),
            y: -260 + Math.random() * (cH + 360),
            vxTurb: 0,
            vyTurb: 0,
            depth: depth,
            speed: baseSpeed,
            size: baseSize,
            ang: Math.random() * Math.PI * 2,
            tiltPhase: Math.random() * Math.PI * 2,
            spinSpeed: (Math.random() - 0.5) * 0.045,
            swayAmp: (0.42 + Math.random() * 0.95) * depth,
            swayFreq: 0.012 + Math.random() * 0.018,
            phase: Math.random() * Math.PI * 2,
            trailChars: trailChars,
            history: [],
            variant: i % 3,
            alpha: Math.min(0.96, (0.30 + Math.random() * 0.34) * (0.55 + depth * 0.48))
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

    // Hiệu ứng mặt sàn phản chiếu ướt (Mưa) hoặc phủ sương băng lấp lánh (Tuyết)
    let wTypeBg = window.currentWeather || 'none';
    if (wTypeBg === 'rain' || wTypeBg === 'blood_rain') {
        let isBloodBg = (wTypeBg === 'blood_rain');
        let sheenGrad = ctx.createLinearGradient(0, gY, 0, gY + 65);
        sheenGrad.addColorStop(0, isBloodBg ? "rgba(255, 40, 70, 0.18)" : "rgba(120, 210, 255, 0.16)");
        sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(-camX - 800, gY, cW + 1600, 65);
    } else if (wTypeBg === 'snow') {
        let frostGrad = ctx.createLinearGradient(0, gY - 4, 0, gY + 28);
        frostGrad.addColorStop(0, "rgba(225, 245, 255, 0.22)");
        frostGrad.addColorStop(1, "rgba(225, 245, 255, 0)");
        ctx.fillStyle = frostGrad;
        ctx.fillRect(-camX - 800, gY - 3, cW + 1600, 32);
    }

    // Chớp sấm sét tầng mây xa (Ambient Sheet Lightning) làm bừng sáng bầu trời khi trời mưa
    if (window._ambientLightningAlpha > 0.01) {
        ctx.save();
        ctx.fillStyle = (wTypeBg === 'blood_rain')
            ? `rgba(255, 70, 100, ${window._ambientLightningAlpha})`
            : `rgba(195, 235, 255, ${window._ambientLightningAlpha})`;
        ctx.fillRect(-camX - 800, -camY - 500, cW + 1600, gY + 500);
        ctx.restore();
    }

    // Đường chân trời Neon sắc nét nơi hai đấu sĩ đứng
    ctx.strokeStyle = cmap.line || "#00f3ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-camX - 1000, gY);
    ctx.lineTo(-camX + cW + 1000, gY);
    ctx.stroke();

    // Vẽ tầng hạt thời tiết Xa & Trung Cảnh (depth < 0.92) nằm phía sau lưng nhân vật tạo chiều sâu 3D thật
    if (typeof window.drawWeatherLayer === 'function') {
        window.drawWeatherLayer(ctx, 0, 0.92, true);
        window._bgWeatherDrawnThisFrame = true;
    }
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
// 3. VẬT LÝ THỜI TIẾT 3D, TƯƠNG TÁC GIÓ ĐẤU SĨ & BẪY MÔI TRƯỜNG
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

    // Cập nhật vòng sóng nước & hạt bắn tung tóe (Splashes + Crown Droplets)
    if (window.rainSplashes && window.rainSplashes.length > 0) {
        for (let i = window.rainSplashes.length - 1; i >= 0; i--) {
            let sp = window.rainSplashes[i];
            sp.r += sp.speed;
            if (sp.droplets) {
                for (let d = 0; d < sp.droplets.length; d++) {
                    let dr = sp.droplets[d];
                    dr.x += dr.vx;
                    dr.y += dr.vy;
                    dr.vy += 0.32;
                }
            }
            sp.life--;
            if (sp.life <= 0) window.rainSplashes.splice(i, 1);
        }
    }

    // Cập nhật hạt phụ trợ (Tia lửa tàn tro, Bụi sao băng, Bong bóng độc vỡ)
    if (window.weatherSubParticles && window.weatherSubParticles.length > 0) {
        for (let i = window.weatherSubParticles.length - 1; i >= 0; i--) {
            let sub = window.weatherSubParticles[i];
            sub.x += sub.vx;
            sub.y += sub.vy;
            if (sub.gravity) sub.vy += sub.gravity;
            if (sub.grow) sub.r += sub.grow;
            sub.life--;
            if (sub.life <= 0) window.weatherSubParticles.splice(i, 1);
        }
    }

    let wType = window.currentWeather || 'none';
    let cW = (window.canvas && window.canvas.width) ? window.canvas.width : 800;
    let cH = (window.canvas && window.canvas.height) ? window.canvas.height : 450;
    let cX = -(window.camX || 0);
    let cY = -(window.camY || 0);
    let nowTime = Date.now() / 1000;

    // Hiệu ứng chớp mây xa tự nhiên khi trời mưa
    if (wType === 'rain' || wType === 'blood_rain') {
        if (window._ambientLightningAlpha > 0) {
            window._ambientLightningAlpha *= 0.84;
            if (window._ambientLightningAlpha < 0.005) window._ambientLightningAlpha = 0;
        } else if (Math.random() < 0.0035) {
            window._ambientLightningAlpha = 0.14 + Math.random() * 0.14;
        }
    } else {
        window._ambientLightningAlpha = 0;
    }

    // Gió tự nhiên uốn lượn theo từng đợt (Dynamic Wind Gusts)
    let naturalGust = Math.sin(nowTime * 0.55) * 0.85 + Math.sin(nowTime * 1.35) * 0.45;
    window.weatherWindGust = naturalGust;
    let gentleWind = ((window.globalWind || 0) * 0.35) + naturalGust * 0.55;

    // Cập nhật dải sương mù mặt đất trôi bồng bềnh
    if (window.ambientMist && window.ambientMist.length > 0) {
        let mistLeft = cX - 450;
        let mistRight = cX + cW + 450;
        for (let m = 0; m < window.ambientMist.length; m++) {
            let mist = window.ambientMist[m];
            mist.phase += 0.018;
            mist.x += mist.vx + gentleWind * 0.22;
            if (mist.x > mistRight) mist.x = mistLeft;
            else if (mist.x < mistLeft) mist.x = mistRight;
        }
    }

    // Thu thập danh sách đấu sĩ đang di chuyển nhanh để tạo luồng gió cuốn hạt thời tiết
    let activeMovers = [];
    if (window.p1 && window.p1.hp > 0) activeMovers.push(window.p1);
    if (window.enemies && window.enemies.length > 0) {
        for (let e = 0; e < window.enemies.length; e++) {
            if (window.enemies[e] && window.enemies[e].hp > 0) activeMovers.push(window.enemies[e]);
        }
    }

    if (window.activeWeatherFX && window.activeWeatherFX.length > 0) {
        let leftBound = cX - 240;
        let rightBound = cX + cW + 240;
        let topBound = cY - 260;
        let bottomBound = cY + cH + 120;

        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            w.phase += 0.036;
            w.tiltPhase = (w.tiltPhase || 0) + 0.048;

            // Giảm dần vận tốc nhiễu động từ đấu sĩ
            w.vxTurb = (w.vxTurb || 0) * 0.91;
            w.vyTurb = (w.vyTurb || 0) * 0.91;

            // Tương tác khí động học khi đấu sĩ lướt / tung đòn gần hạt thời tiết
            for (let fIdx = 0; fIdx < activeMovers.length; fIdx++) {
                let f = activeMovers[fIdx];
                let fvx = f.vx || 0;
                let fvy = f.vy || 0;
                let speedSq = fvx * fvx + fvy * fvy;
                if (speedSq > 6 || f.state === 'attack') {
                    let dx = w.x - f.x;
                    let dy = w.y - (f.y - 45);
                    let distSq = dx * dx + dy * dy;
                    if (distSq < 11000 && distSq > 4) {
                        let invDist = (1 - Math.sqrt(distSq) / 105) * 0.32 * w.depth;
                        w.vxTurb += (fvx * 0.45 + (dx > 0 ? 2.2 : -2.2)) * invDist;
                        w.vyTurb += (fvy * 0.35 - 1.4) * invDist;
                        w.ang += (dx > 0 ? 0.08 : -0.08) * invDist;
                    }
                }
            }

            if (wType === 'toxic' || wType === 'ash') {
                if (w.history) {
                    w.history.unshift({ x: w.x, y: w.y });
                    if (w.history.length > 4) w.history.pop();
                }
                w.y -= w.speed - w.vyTurb;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * w.swayAmp + gentleWind * w.depth + w.vxTurb;
                w.ang += w.spinSpeed;

                // Tàn lửa nổ nhẹ hoặc bong bóng độc vỡ tạo vòng sóng nhỏ
                if (Math.random() < 0.004 && window.weatherSubParticles && window.weatherSubParticles.length < 30) {
                    if (wType === 'ash') {
                        for (let s = 0; s < 2; s++) {
                            window.weatherSubParticles.push({
                                type: 'ember_spark',
                                x: w.x,
                                y: w.y,
                                vx: (Math.random() - 0.5) * 2.2,
                                vy: -0.8 - Math.random() * 1.6,
                                r: 0.9 * w.depth,
                                life: 14,
                                maxLife: 14
                            });
                        }
                    } else {
                        window.weatherSubParticles.push({
                            type: 'toxic_pop',
                            x: w.x,
                            y: w.y,
                            vx: 0,
                            vy: -0.2,
                            r: w.size * 0.9,
                            grow: 0.38 * w.depth,
                            life: 14,
                            maxLife: 14
                        });
                    }
                }
            }
            else if (wType === 'fireflies') {
                if (w.history) {
                    w.history.unshift({ x: w.x, y: w.y });
                    if (w.history.length > 5) w.history.pop();
                }
                w.x += Math.cos(nowTime * 1.25 + w.phase) * w.speed + gentleWind * 0.25 * w.depth + w.vxTurb;
                w.y += Math.sin(nowTime * 1.55 + w.phase) * w.speed * 0.85 + w.vyTurb;
            }
            else if (wType === 'cosmic_dust') {
                w.y += Math.sin(nowTime * 0.85 + w.phase) * 0.38 * w.depth + w.vyTurb;
                w.x += Math.cos(nowTime * 0.72 + w.phase) * 0.48 * w.depth + gentleWind * 0.18 * w.depth + w.vxTurb;
                w.ang += w.spinSpeed * 0.6;
            }
            else if (wType === 'matrix_rain') {
                w.y += w.speed;
                if (Math.random() < 0.06 && w.trailChars && w.trailChars.length > 0) {
                    let idx = Math.floor(Math.random() * w.trailChars.length);
                    w.trailChars[idx] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                }
                if (w.y >= window.GROUND_Y && w.y - w.speed < window.GROUND_Y && Math.random() < 0.35 && window.weatherSubParticles.length < 25) {
                    window.weatherSubParticles.push({
                        type: 'matrix_ripple',
                        x: w.x,
                        y: window.GROUND_Y + (Math.random() - 0.5) * 4,
                        vx: 0,
                        vy: 0,
                        r: 2 * w.depth,
                        grow: 0.9 * w.depth,
                        life: 14,
                        maxLife: 14
                    });
                }
            }
            else if (wType === 'shooting_stars') {
                w.y += w.speed * 1.45;
                w.x -= w.speed * 1.95;
                if (Math.random() < 0.38 && window.weatherSubParticles && window.weatherSubParticles.length < 36) {
                    window.weatherSubParticles.push({
                        type: 'star_wake',
                        x: w.x + (Math.random() - 0.5) * 4,
                        y: w.y + (Math.random() - 0.5) * 4,
                        vx: 0.4 + Math.random() * 0.6,
                        vy: -0.3 - Math.random() * 0.5,
                        r: (0.8 + Math.random() * 0.9) * w.depth,
                        life: 14 + Math.floor(Math.random() * 8),
                        maxLife: 22
                    });
                }
            }
            else if (wType === 'rain' || wType === 'blood_rain') {
                let rainDrift = (-2.1 + gentleWind * 0.85) * w.depth + w.vxTurb * 0.5;
                w.y += w.speed;
                w.x += rainDrift;
                w.rainDx = rainDrift;

                if (w.y >= window.GROUND_Y && w.y - w.speed < window.GROUND_Y && Math.random() < 0.48 && window.rainSplashes.length < 38) {
                    let drops = [];
                    if (w.depth > 0.72) {
                        let dCount = w.depth > 1.05 ? 3 : 2;
                        for (let d = 0; d < dCount; d++) {
                            drops.push({
                                x: 0,
                                y: 0,
                                vx: (Math.random() - 0.5) * 2.6 * w.depth,
                                vy: -(1.4 + Math.random() * 1.8) * w.depth
                            });
                        }
                    }
                    window.rainSplashes.push({
                        x: w.x,
                        y: window.GROUND_Y + (Math.random() - 0.5) * 8,
                        r: 1.8 * w.depth,
                        speed: 0.92 * w.depth,
                        depth: w.depth,
                        life: 14,
                        maxLife: 14,
                        droplets: drops,
                        isBlood: (wType === 'blood_rain')
                    });
                }
            }
            else if (wType === 'snow') {
                w.y += w.speed + w.vyTurb;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 0.85) + gentleWind * w.depth * 0.75 + w.vxTurb;
                w.ang += w.spinSpeed;
            }
            else if (wType === 'petals') {
                w.y += w.speed + Math.sin(w.tiltPhase) * 0.18 * w.depth + w.vyTurb;
                w.x += Math.sin(w.phase + w.y * w.swayFreq) * (w.swayAmp * 1.25) + (0.65 + gentleWind * 0.85) * w.depth + w.vxTurb;
                w.ang += w.spinSpeed * 1.65 + Math.cos(w.phase) * 0.015;
            }
            else {
                w.y += w.speed + w.vyTurb;
                w.x += Math.sin(w.phase) * w.swayAmp + w.vxTurb;
            }

            if (w.y > bottomBound) {
                w.y = topBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
                if (w.history) w.history.length = 0;
            } else if (w.y < topBound) {
                w.y = bottomBound;
                w.x = leftBound + Math.random() * (rightBound - leftBound);
                if (w.history) w.history.length = 0;
            }

            if (w.x > rightBound) {
                w.x = leftBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
                if (w.history) w.history.length = 0;
            } else if (w.x < leftBound) {
                w.x = rightBound;
                w.y = topBound + Math.random() * (bottomBound - topBound);
                if (w.history) w.history.length = 0;
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
// 4. RENDER VẾT NỨT, THIÊN TAI & HẠT THỜI TIẾT ĐIỆN ẢNH ĐA TẦNG
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
                let ringR = 38 + pulse * 22;
                ctx.fillStyle = `rgba(0, 243, 255, ${0.14 + pulse * 0.28})`;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, ringR, 9, 0, 0, Math.PI * 2); ctx.fill();

                ctx.strokeStyle = `rgba(140, 250, 255, ${0.55 + pulse * 0.4})`;
                ctx.lineWidth = 1.6;
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, ringR * 0.72, 5.5, 0, 0, Math.PI * 2); ctx.stroke();

                // Tia tĩnh điện nhảy lách tách từ mặt đất lên
                for (let s = 0; s < 2; s++) {
                    let sx = haz.x + (Math.random() - 0.5) * 44;
                    ctx.strokeStyle = "rgba(180, 250, 255, 0.9)";
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(sx, window.GROUND_Y);
                    ctx.lineTo(sx + (Math.random() - 0.5) * 16, window.GROUND_Y - 18 - Math.random() * 22);
                    ctx.lineTo(sx + (Math.random() - 0.5) * 24, window.GROUND_Y - 38 - Math.random() * 28);
                    ctx.stroke();
                }
            }
            else if (haz.state === 'striking') {
                let startX = haz.x + (Math.random() - 0.5) * 100;
                let startY = window.GROUND_Y - 650;
                let steps = 14;
                let path = [{ x: startX, y: startY }];
                for (let s = 1; s <= steps; s++) {
                    let px = startX + (haz.x - startX) * (s / steps) + (s === steps ? 0 : (Math.random() - 0.5) * 68);
                    let py = startY + (window.GROUND_Y - startY) * (s / steps);
                    path.push({ x: px, y: py });
                }

                // Luồng hào quang thiên lôi ngoài
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.strokeStyle = "rgba(0, 225, 255, 0.42)";
                ctx.lineWidth = 18;
                ctx.stroke();

                // Nhánh sét phụ (Side Branches)
                ctx.strokeStyle = "rgba(130, 245, 255, 0.75)";
                ctx.lineWidth = 2.2;
                for (let b = 3; b < path.length - 2; b += 3) {
                    let bp = path[b];
                    let dir = (b % 2 === 0 ? 1 : -1);
                    ctx.beginPath();
                    ctx.moveTo(bp.x, bp.y);
                    ctx.lineTo(bp.x + dir * (28 + Math.random() * 25), bp.y + 35 + Math.random() * 20);
                    ctx.lineTo(bp.x + dir * (52 + Math.random() * 35), bp.y + 72 + Math.random() * 25);
                    ctx.stroke();
                }

                // Lõi sét trắng rực
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 4.5;
                ctx.stroke();

                ctx.fillStyle = "rgba(220, 252, 255, 0.85)";
                ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 72, 16, 0, 0, Math.PI * 2); ctx.fill();
            }
        }
        else if (haz.type === 'lava') {
            let pulse = Math.abs(Math.sin(haz.timer * 0.25));
            let heatRatio = Math.max(0, 1 - haz.timer / 55);
            ctx.fillStyle = `rgba(255, 55, 0, ${0.22 + pulse * 0.38})`;
            ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, 55 + pulse * 18, 12, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = `rgba(255, 210, 60, ${0.35 + heatRatio * 0.5})`;
            ctx.beginPath(); ctx.ellipse(haz.x, window.GROUND_Y, (28 + pulse * 12) * heatRatio, 6, 0, 0, Math.PI * 2); ctx.fill();

            // Bong bóng dung nham sôi sùng sục báo hiệu sắp phun trào
            if (haz.timer < 22) {
                let jetH = (22 - haz.timer) * 4.5;
                let lavaGrad = ctx.createLinearGradient(haz.x, window.GROUND_Y, haz.x, window.GROUND_Y - jetH);
                lavaGrad.addColorStop(0, "rgba(255, 220, 80, 0.85)");
                lavaGrad.addColorStop(1, "rgba(255, 60, 0, 0)");
                ctx.fillStyle = lavaGrad;
                ctx.beginPath();
                ctx.moveTo(haz.x - 18, window.GROUND_Y);
                ctx.quadraticCurveTo(haz.x, window.GROUND_Y - jetH * 1.3, haz.x + 18, window.GROUND_Y);
                ctx.fill();
            }
        }
    });
    ctx.restore();
};

// Hàm vẽ bông tuyết tinh thể 6 cánh (6-Pointed Crystalline Snowflake)
function drawCrystallineSnowflake(ctx, x, y, r, angle, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = `rgba(240, 250, 255, ${alpha})`;
    ctx.lineWidth = Math.max(0.85, r * 0.24);
    ctx.lineCap = "round";

    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
        let a = (k * Math.PI) / 3;
        let dx = Math.cos(a) * r;
        let dy = Math.sin(a) * r;
        ctx.moveTo(-dx, -dy);
        ctx.lineTo(dx, dy);

        // Nhánh tinh thể nhỏ ở hai đầu
        let bDist = r * 0.55;
        let bLen = r * 0.36;
        for (let dir = -1; dir <= 1; dir += 2) {
            let bx = Math.cos(a) * bDist * dir;
            let by = Math.sin(a) * bDist * dir;
            let a1 = a + dir * 0.55;
            let a2 = a - dir * 0.55;
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a1) * bLen * dir, by + Math.sin(a1) * bLen * dir);
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a2) * bLen * dir, by + Math.sin(a2) * bLen * dir);
        }
    }
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.15)})`;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Hàm vẽ cánh hoa anh đào 3D có khía trái tim chuẩn (Authentic Sakura Petal Silhouette)
function drawSakuraPetal3D(ctx, w) {
    ctx.save();
    ctx.translate(w.x, w.y);
    ctx.rotate(w.ang);

    let flipX = 0.42 + Math.abs(Math.cos(w.phase)) * 0.58;
    let flipY = 0.65 + Math.abs(Math.sin(w.tiltPhase || w.phase)) * 0.35;
    ctx.scale(flipX, flipY);

    let s = w.size * 1.55;
    if (w.depth > 1.02) {
        ctx.fillStyle = `rgba(255, 165, 205, ${w.alpha * 0.22})`;
        ctx.beginPath();
        ctx.arc(0, 0, s * 1.35, 0, Math.PI * 2);
        ctx.fill();
    }

    let pGrad = ctx.createLinearGradient(0, s, 0, -s);
    if (w.variant === 0) {
        pGrad.addColorStop(0, `rgba(255, 115, 168, ${w.alpha})`);
        pGrad.addColorStop(1, `rgba(255, 225, 238, ${w.alpha})`);
    } else if (w.variant === 1) {
        pGrad.addColorStop(0, `rgba(255, 145, 190, ${w.alpha})`);
        pGrad.addColorStop(1, `rgba(255, 240, 246, ${w.alpha})`);
    } else {
        pGrad.addColorStop(0, `rgba(248, 105, 155, ${w.alpha})`);
        pGrad.addColorStop(1, `rgba(255, 210, 228, ${w.alpha})`);
    }

    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.95);
    ctx.bezierCurveTo(-s * 0.92, s * 0.35, -s * 0.85, -s * 0.65, -s * 0.26, -s * 0.95);
    ctx.lineTo(0, -s * 0.62); // Khía chữ V đặc trưng của cánh hoa Sakura
    ctx.lineTo(s * 0.26, -s * 0.95);
    ctx.bezierCurveTo(s * 0.85, -s * 0.65, s * 0.92, s * 0.35, 0, s * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Hàm vẽ dải sương mù là là mặt đất (Volumetric Ground Mist)
function drawAmbientMistLayer(ctx, wType, isForeground) {
    if (!window.ambientMist || window.ambientMist.length === 0) return;
    ctx.save();
    for (let m = 0; m < window.ambientMist.length; m++) {
        if ((m % 2 === 0) !== isForeground) continue;
        let mist = window.ambientMist[m];
        let breathe = 0.75 + Math.sin(mist.phase) * 0.25;
        let a = mist.alpha * breathe;

        let r = 200, g = 230, b = 255;
        if (wType === 'blood_rain') { r = 220; g = 35; b = 65; }
        else if (wType === 'petals') { r = 255; g = 195; b = 220; }
        else if (wType === 'toxic') { r = 60; g = 235; b = 130; }
        else if (wType === 'ash') { r = 255; g = 110; b = 40; }
        else if (wType === 'fireflies') { r = 190; g = 230; b = 110; }
        else if (wType === 'cosmic_dust' || wType === 'shooting_stars') { r = 140; g = 120; b = 255; }
        else if (wType === 'matrix_rain') { r = 0; g = 220; b = 100; }

        let radGrad = ctx.createRadialGradient(mist.x, mist.y, 4, mist.x, mist.y, mist.rx);
        radGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
        radGrad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${a * 0.45})`);
        radGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.save();
        ctx.translate(mist.x, mist.y);
        ctx.scale(1, mist.ry / mist.rx);
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, mist.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.restore();
}

// Hàm vẽ từng tầng chiều sâu của thời tiết (Hỗ trợ tách lớp Far/Mid sau lưng đấu sĩ & Foreground trước mặt đấu sĩ)
window.drawWeatherLayer = function(ctx, minDepth, maxDepth, isBackgroundPass) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    let wType = window.currentWeather;
    ctx.save();

    // Sương mù mặt đất
    drawAmbientMistLayer(ctx, wType, !isBackgroundPass);

    if (wType === 'snow') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let twinkle = 0.76 + Math.sin(w.phase * 1.5) * 0.24;
            let curAlpha = w.alpha * twinkle;

            if (w.depth < 0.72) {
                // Tầng xa: Bụi tuyết mịn màng
                ctx.fillStyle = `rgba(225, 242, 255, ${curAlpha * 0.85})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 0.95, 0, Math.PI * 2);
                ctx.fill();
            } else if (w.depth < 1.12) {
                // Tầng trung: Bông tuyết tinh thể 6 cánh xoay nhẹ trong gió
                drawCrystallineSnowflake(ctx, w.x, w.y, w.size * 1.55, w.ang, curAlpha);
            } else {
                // Tầng cận cảnh (Camera Bokeh): Hạt tuyết lớn mờ ảo + nhân pha lê lấp lánh
                let bokehGrad = ctx.createRadialGradient(w.x, w.y, w.size * 0.2, w.x, w.y, w.size * 2.7);
                bokehGrad.addColorStop(0, `rgba(255, 255, 255, ${curAlpha * 0.92})`);
                bokehGrad.addColorStop(0.45, `rgba(205, 240, 255, ${curAlpha * 0.38})`);
                bokehGrad.addColorStop(1, "rgba(190, 235, 255, 0)");
                ctx.fillStyle = bokehGrad;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 2.7, 0, Math.PI * 2);
                ctx.fill();

                drawCrystallineSnowflake(ctx, w.x, w.y, w.size * 1.35, w.ang, curAlpha * 0.85);
            }
        }
    }
    else if (wType === 'matrix_rain') {
        ctx.textAlign = "center";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let fontSize = Math.round(9 + w.depth * 6.5);
            ctx.font = `bold ${fontSize}px monospace`;

            let chars = w.trailChars || ["1", "0", "1"];
            for (let c = 0; c < chars.length; c++) {
                let charY = w.y - c * (fontSize * 1.05);
                if (c === 0) {
                    if (w.depth > 0.85) {
                        ctx.fillStyle = `rgba(0, 255, 140, ${w.alpha * 0.32})`;
                        ctx.beginPath();
                        ctx.arc(w.x, charY - fontSize * 0.35, fontSize * 0.82, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = `rgba(230, 255, 242, ${Math.min(1, w.alpha * 1.3)})`;
                    ctx.fillText(chars[c], w.x, charY);
                } else {
                    let tailAlpha = w.alpha * Math.pow(1 - c / chars.length, 1.25) * 0.88;
                    ctx.fillStyle = (c === 1)
                        ? `rgba(80, 255, 160, ${tailAlpha})`
                        : `rgba(0, 235, 95, ${tailAlpha})`;
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
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let len = (isBlood ? 23 : 19) * w.depth;
            let windSlant = (w.rainDx !== undefined ? w.rainDx : -2.0 * w.depth) * 1.85;
            let tailX = w.x - windSlant;
            let tailY = w.y - len;

            let rGrad = ctx.createLinearGradient(tailX, tailY, w.x, w.y);
            if (isBlood) {
                rGrad.addColorStop(0, "rgba(180, 10, 30, 0)");
                rGrad.addColorStop(0.6, `rgba(255, 45, 70, ${w.alpha * 0.55})`);
                rGrad.addColorStop(1, `rgba(255, 165, 180, ${Math.min(1, w.alpha * 0.95)})`);
            } else {
                rGrad.addColorStop(0, "rgba(120, 195, 255, 0)");
                rGrad.addColorStop(0.6, `rgba(175, 225, 255, ${w.alpha * 0.52})`);
                rGrad.addColorStop(1, `rgba(235, 250, 255, ${Math.min(1, w.alpha * 0.92)})`);
            }

            ctx.lineWidth = (isBlood ? 1.75 : 1.35) * w.depth;
            ctx.strokeStyle = rGrad;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(w.x, w.y);
            ctx.stroke();
        }

        // Vẽ vòng sóng nước + hạt nước bắn tung tóe ở lớp tiền cảnh
        if (!isBackgroundPass && window.rainSplashes && window.rainSplashes.length > 0) {
            for (let i = 0; i < window.rainSplashes.length; i++) {
                let sp = window.rainSplashes[i];
                let progress = sp.life / sp.maxLife;
                let spAlpha = progress * 0.72;

                ctx.strokeStyle = sp.isBlood
                    ? `rgba(255, 75, 95, ${spAlpha})`
                    : `rgba(195, 238, 255, ${spAlpha})`;
                ctx.lineWidth = 1.15;
                ctx.beginPath();
                ctx.ellipse(sp.x, sp.y, sp.r * 2.35, sp.r * 0.52, 0, 0, Math.PI * 2);
                ctx.stroke();

                if (sp.droplets && sp.droplets.length > 0) {
                    ctx.fillStyle = sp.isBlood
                        ? `rgba(255, 120, 135, ${spAlpha * 1.1})`
                        : `rgba(225, 248, 255, ${spAlpha * 1.1})`;
                    for (let d = 0; d < sp.droplets.length; d++) {
                        let dr = sp.droplets[d];
                        ctx.beginPath();
                        ctx.arc(sp.x + dr.x, sp.y + dr.y, 1.1 * (sp.depth || 1), 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
    }
    else if (wType === 'petals') {
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;
            drawSakuraPetal3D(ctx, w);
        }
    }
    else if (wType === 'ash' || wType === 'toxic') {
        let isAsh = (wType === 'ash');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let pulse = 0.65 + Math.abs(Math.sin(w.phase * 1.2)) * 0.35;
            let a = w.alpha * pulse;

            if (isAsh) {
                // Đuôi lửa tàn tro uốn lượn
                if (w.history && w.history.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(w.x, w.y);
                    for (let h = 0; h < w.history.length; h++) {
                        ctx.lineTo(w.history[h].x, w.history[h].y);
                    }
                    ctx.strokeStyle = `rgba(255, 110, 20, ${a * 0.45})`;
                    ctx.lineWidth = w.size * 0.9;
                    ctx.lineCap = "round";
                    ctx.stroke();
                }

                ctx.fillStyle = `rgba(255, 80, 0, ${a * 0.34})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 2.4, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 220, 95, ${Math.min(1, a * 1.25)})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 0.88, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Bào tử & Bong bóng axit phát quang (Toxic Spores & Acid Bubbles)
                ctx.fillStyle = `rgba(46, 213, 115, ${a * 0.24})`;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 2.3, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = `rgba(130, 255, 180, ${a * 0.78})`;
                ctx.lineWidth = 1.05;
                ctx.beginPath();
                ctx.arc(w.x, w.y, w.size * 1.15, 0, Math.PI * 2);
                ctx.stroke();

                // Đốm sáng phản quang trên bong bóng độc
                ctx.fillStyle = `rgba(220, 255, 235, ${a * 0.9})`;
                ctx.beginPath();
                ctx.arc(w.x - w.size * 0.38, w.y - w.size * 0.38, w.size * 0.32, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    else if (wType === 'fireflies' || wType === 'cosmic_dust') {
        let isFirefly = (wType === 'fireflies');
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let glow = 0.25 + Math.abs(Math.sin(w.phase * 0.85)) * 0.75;
            let curA = glow * w.alpha;

            if (isFirefly && w.history && w.history.length > 1) {
                ctx.beginPath();
                ctx.moveTo(w.x, w.y);
                for (let h = 0; h < w.history.length; h++) {
                    ctx.lineTo(w.history[h].x, w.history[h].y);
                }
                ctx.strokeStyle = `rgba(210, 255, 90, ${curA * 0.35})`;
                ctx.lineWidth = w.size * 0.85;
                ctx.lineCap = "round";
                ctx.stroke();
            }

            let outerCol = isFirefly
                ? `rgba(220, 245, 40, ${curA * 0.34})`
                : (w.variant === 0 ? `rgba(0, 243, 255, ${curA * 0.32})` : (w.variant === 1 ? `rgba(185, 103, 255, ${curA * 0.32})` : `rgba(255, 210, 110, ${curA * 0.32})`));
            let coreCol = isFirefly
                ? `rgba(255, 255, 200, ${Math.min(1, curA * 1.15)})`
                : `rgba(255, 255, 255, ${Math.min(1, curA * 1.15)})`;

            ctx.fillStyle = outerCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 3.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = coreCol;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 0.95, 0, Math.PI * 2);
            ctx.fill();

            // Tia sao 4 cánh lấp lánh cho Bụi Vũ Trụ & Đom Đóm cận cảnh
            if ((!isFirefly || w.depth > 0.95) && glow > 0.65) {
                let flareR = w.size * (isFirefly ? 2.1 : 2.6);
                ctx.strokeStyle = coreCol;
                ctx.lineWidth = 0.9;
                ctx.beginPath();
                ctx.moveTo(w.x - flareR, w.y); ctx.lineTo(w.x + flareR, w.y);
                ctx.moveTo(w.x, w.y - flareR); ctx.lineTo(w.x, w.y + flareR);
                ctx.stroke();
            }
        }
    }
    else if (wType === 'shooting_stars') {
        ctx.lineCap = "round";
        for (let i = 0; i < window.activeWeatherFX.length; i++) {
            let w = window.activeWeatherFX[i];
            if (w.depth < minDepth || w.depth >= maxDepth) continue;

            let tailX = w.x + w.speed * 9.2;
            let tailY = w.y - w.speed * 6.8;

            let grad = ctx.createLinearGradient(w.x, w.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${w.alpha})`);
            grad.addColorStop(0.25, `rgba(120, 245, 255, ${w.alpha * 0.78})`);
            grad.addColorStop(0.65, `rgba(165, 105, 255, ${w.alpha * 0.35})`);
            grad.addColorStop(1, "rgba(0, 243, 255, 0)");

            ctx.strokeStyle = grad;
            ctx.lineWidth = w.size * 1.15;
            ctx.beginPath();
            ctx.moveTo(w.x, w.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Đầu sao băng phát sáng + chữ thập Lens Flare
            ctx.fillStyle = `rgba(160, 248, 255, ${w.alpha * 0.38})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, w.alpha * 1.2)})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.size * 1.15, 0, Math.PI * 2);
            ctx.fill();

            let crossR = w.size * 2.8;
            ctx.strokeStyle = `rgba(255, 255, 255, ${w.alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(w.x - crossR, w.y); ctx.lineTo(w.x + crossR, w.y);
            ctx.moveTo(w.x, w.y - crossR); ctx.lineTo(w.x, w.y + crossR);
            ctx.stroke();
        }
    }

    // Vẽ các hạt phụ trợ (Tia lửa tàn tro, Bụi sao băng, Vòng sóng Matrix, Bong bóng độc vỡ) ở tiền cảnh
    if (!isBackgroundPass && window.weatherSubParticles && window.weatherSubParticles.length > 0) {
        for (let i = 0; i < window.weatherSubParticles.length; i++) {
            let sub = window.weatherSubParticles[i];
            let pAlpha = (sub.life / sub.maxLife) * 0.85;
            if (sub.type === 'ember_spark') {
                ctx.fillStyle = `rgba(255, 210, 90, ${pAlpha})`;
                ctx.beginPath();
                ctx.arc(sub.x, sub.y, sub.r, 0, Math.PI * 2);
                ctx.fill();
            } else if (sub.type === 'toxic_pop') {
                ctx.strokeStyle = `rgba(120, 255, 170, ${pAlpha * 0.75})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(sub.x, sub.y, sub.r, 0, Math.PI * 2);
                ctx.stroke();
            } else if (sub.type === 'matrix_ripple') {
                ctx.strokeStyle = `rgba(0, 255, 128, ${pAlpha * 0.65})`;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.ellipse(sub.x, sub.y, sub.r * 2.2, sub.r * 0.5, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (sub.type === 'star_wake') {
                ctx.fillStyle = `rgba(190, 248, 255, ${pAlpha})`;
                ctx.beginPath();
                ctx.arc(sub.x, sub.y, sub.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    ctx.restore();
};

window.drawWeatherEffects = function(ctx) {
    if (!ctx || !window.activeWeatherFX || window.activeWeatherFX.length === 0) return;
    // Nếu lớp nền đã vẽ tầng Xa & Trung Cảnh (depth < 0.92), chỉ cần vẽ tầng Tiền Cảnh (depth >= 0.92) đè lên trước mặt đấu sĩ
    let minD = window._bgWeatherDrawnThisFrame ? 0.92 : 0;
    window._bgWeatherDrawnThisFrame = false;
    window.drawWeatherLayer(ctx, minD, 99, false);
};

