// ==========================================
// CONFIG.JS - HỆ SINH THÁI BẢN ĐỒ VÀ KẾT NỐI API
// [PHIÊN BẢN MỞ RỘNG VŨ TRỤ - 32 BẢN ĐỒ SIÊU THỰC]
// ==========================================

window.MAPS = [
    // ==========================================
    // 1. CÁC BẢN ĐỒ THÀNH PHỐ & VÕ ĐƯỜNG (URBAN & DOJOS)
    // ==========================================
    { id: "cyberpunk", sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" },
    { id: "neon_alley", sky: "#0f0c29", bg1: "#302b63", bg2: "#24243e", ground: "#050505", line: "#ff00ff", weather: "rain", bg1Type: "city", bg2Type: "stars" },
    { id: "golden_dojo", sky: "#8e44ad", bg1: "#d35400", bg2: "#e67e22", ground: "#2c3e50", line: "#f1c40f", weather: "petals", bg1Type: "pillars", bg2Type: "mountains" },
    { id: "shaolin_temple", sky: "#873600", bg1: "#a04000", bg2: "#ba4a00", ground: "#4a2311", line: "#f1c40f", weather: "petals", bg1Type: "pillars", bg2Type: "trees" },
    { id: "ruined_city", sky: "#5d6d7e", bg1: "#34495e", bg2: "#2e4053", ground: "#283747", line: "#e67e22", weather: "ash", bg1Type: "ruins", bg2Type: "mountains" },

    // ==========================================
    // 2. THIÊN NHIÊN: RỪNG, BIỂN & SA MẠC (NATURE & ELEMENTS)
    // ==========================================
    { id: "sahara_desert", sky: "#e67e22", bg1: "#d35400", bg2: "#f39c12", ground: "#a04000", line: "#f1c40f", weather: "ash", bg1Type: "ruins", bg2Type: "pyramids" },
    { id: "deep_forest", sky: "#145a32", bg1: "#0b5345", bg2: "#1e8449", ground: "#0a2614", line: "#2ecc71", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },
    { id: "autumn_woods", sky: "#ba4a00", bg1: "#a04000", bg2: "#d35400", ground: "#6e2c00", line: "#f39c12", weather: "petals", bg1Type: "trees", bg2Type: "mountains" }, // Petals giả làm lá vàng rơi
    { id: "river_styx", sky: "#154360", bg1: "#1b4f72", bg2: "#21618c", ground: "#0e2c40", line: "#3498db", weather: "rain", bg1Type: "pines", bg2Type: "river" },
    { id: "sunset_beach", sky: "#c0392b", bg1: "#d35400", bg2: "#2980b9", ground: "#f39c12", line: "#16a085", weather: "none", bg1Type: "trees", bg2Type: "river" },
    { id: "frozen_peak", sky: "#2c3e50", bg1: "#bdc3c7", bg2: "#95a5a6", ground: "#ecf0f1", line: "#3498db", weather: "snow", bg1Type: "pines", bg2Type: "mountains" },
    { id: "thunder_peak", sky: "#1b2631", bg1: "#212f3d", bg2: "#283747", ground: "#17202a", line: "#f1c40f", weather: "rain", bg1Type: "pines", bg2Type: "mountains" }, // Bản đồ bão tố sấm sét

    // ==========================================
    // 3. ĐỊA ĐIỂM VIỄN TƯỞNG & KINH DỊ (SCI-FI & HORROR)
    // ==========================================
    { id: "blood_moon", sky: "#2c0000", bg1: "#4a0000", bg2: "#1a0000", ground: "#0a0000", line: "#ff0000", weather: "ash", bg1Type: "graves", bg2Type: "mountains" },
    { id: "zombie_highway", sky: "#424949", bg1: "#566573", bg2: "#273746", ground: "#17202a", line: "#ff0000", weather: "toxic", bg1Type: "city", bg2Type: "ruins" },
    { id: "toxic_zone", sky: "#0b1c0b", bg1: "#1b301b", bg2: "#27ae60", ground: "#0a120a", line: "#2ecc71", weather: "toxic", bg1Type: "ruins", bg2Type: "river" },
    { id: "haunted_grave", sky: "#2c3e50", bg1: "#17202a", bg2: "#212f3d", ground: "#0a0c10", line: "#8e44ad", weather: "toxic", bg1Type: "graves", bg2Type: "trees" },
    { id: "volcanic_core", sky: "#4a2311", bg1: "#641e16", bg2: "#7b241c", ground: "#111", line: "#e74c3c", weather: "ash", bg1Type: "crystals", bg2Type: "mountains" },
    { id: "mars_colony", sky: "#641e16", bg1: "#7b241c", bg2: "#922b21", ground: "#4a2311", line: "#e67e22", weather: "ash", bg1Type: "city", bg2Type: "pyramids" }, // Pyramids giả làm núi lửa sao Hỏa

    // ==========================================
    // 4. THẦN THOẠI & SỬ THI (MYTHIC & HISTORICAL)
    // ==========================================
    { id: "roman_colosseum", sky: "#e67e22", bg1: "#b9770e", bg2: "#a04000", ground: "#7e5109", line: "#f1c40f", weather: "ash", bg1Type: "pillars", bg2Type: "mountains" },
    { id: "viking_fjord", sky: "#154360", bg1: "#21618c", bg2: "#2e86c1", ground: "#1b4f72", line: "#aed6f1", weather: "snow", bg1Type: "pines", bg2Type: "river" },
    { id: "dragon_nest", sky: "#1a0500", bg1: "#4a0e00", bg2: "#330800", ground: "#110000", line: "#ff4500", weather: "ash", bg1Type: "ruins", bg2Type: "mountains" },
    { id: "underwater_atlantis", sky: "#001f3f", bg1: "#003366", bg2: "#00509e", ground: "#001122", line: "#00ffff", weather: "snow", bg1Type: "crystals", bg2Type: "river" }, // Snow giả làm bong bóng nước
    { id: "sakura_shrine", sky: "#ffb6c1", bg1: "#fd8adc", bg2: "#ff69b4", ground: "#4a235a", line: "#ffffff", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },

    // ==========================================
    // 5. KHÔNG GIAN SIÊU THỰC & VŨ TRỤ (SURREAL & COSMIC)
    // ==========================================
    { id: "galaxy_void", sky: "#000000", bg1: "#1b1464", bg2: "#4a235a", ground: "#000000", line: "#9b59b6", weather: "snow", bg1Type: "crystals", bg2Type: "stars" },
    { id: "alien_world", sky: "#4a235a", bg1: "#633974", bg2: "#76448a", ground: "#154360", line: "#00ff00", weather: "toxic", bg1Type: "crystals", bg2Type: "stars" },
    { id: "cloud_temple", sky: "#85c1e9", bg1: "#aed6f1", bg2: "#d6eaf8", ground: "#fdfefe", line: "#f1c40f", weather: "snow", bg1Type: "pillars", bg2Type: "clouds" },
    { id: "heaven_gates", sky: "#aed6f1", bg1: "#d6eaf8", bg2: "#ebf5fb", ground: "#ffffff", line: "#f1c40f", weather: "none", bg1Type: "pillars", bg2Type: "clouds" },
    { id: "crystal_cave", sky: "#0e6251", bg1: "#0e6655", bg2: "#117864", ground: "#08362d", line: "#1abc9c", weather: "snow", bg1Type: "crystals", bg2Type: "mountains" },
    { id: "matrix_grid", sky: "#000000", bg1: "#001a00", bg2: "#003300", ground: "#000000", line: "#00ff00", weather: "rain", bg1Type: "digital", bg2Type: "none" },
    { id: "shadow_realm", sky: "#000000", bg1: "#111111", bg2: "#222222", ground: "#000000", line: "#ffffff", weather: "ash", bg1Type: "graves", bg2Type: "stars" },
    { id: "mirror_dimension", sky: "#17202a", bg1: "#1b2631", bg2: "#212f3d", ground: "#000000", line: "#00ffff", weather: "rain", bg1Type: "crystals", bg2Type: "stars" }
];
