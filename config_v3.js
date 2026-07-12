// ==========================================
// CONFIG.JS - HỆ SINH THÁI BẢN ĐỒ VÀ KẾT NỐI API
// [PHIÊN BẢN ULTIMATE MULTIVERSE - 62 BẢN ĐỒ SIÊU THỰC & ĐIÊN RỒ NHẤT]
// ==========================================

window.MAPS = [
    // ==========================================
    // 1. CÁC BẢN ĐỒ THÀNH PHỐ & VÕ ĐƯỜNG (URBAN & DOJOS)
    // ==========================================
    { id: "cyberpunk", sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" },
    { id: "neon_alley", sky: "#0f0c29", bg1: "#302b63", bg2: "#24243e", ground: "#050505", line: "#ff00ff", weather: "matrix_rain", bg1Type: "city", bg2Type: "stars" }, // Đổi sang mưa ma trận
    { id: "golden_dojo", sky: "#8e44ad", bg1: "#d35400", bg2: "#e67e22", ground: "#2c3e50", line: "#f1c40f", weather: "petals", bg1Type: "pillars", bg2Type: "mountains" },
    { id: "shaolin_temple", sky: "#873600", bg1: "#a04000", bg2: "#ba4a00", ground: "#4a2311", line: "#f1c40f", weather: "petals", bg1Type: "pillars", bg2Type: "trees" },
    { id: "ruined_city", sky: "#5d6d7e", bg1: "#34495e", bg2: "#2e4053", ground: "#283747", line: "#e67e22", weather: "ash", bg1Type: "ruins", bg2Type: "mountains" },

    // Map Rừng Trúc Nước Chảy
    { id: "flowing_river", sky: "#145a32", bg1: "#0b5345", bg2: "#1e8449", ground: "#0a2614", line: "#2ecc71", weather: "fireflies", bg1Type: "pines", bg2Type: "flowing_water" },
    
    // Map Núi Lửa Dung Nham
    { id: "flowing_volcano", sky: "#2c0000", bg1: "#4a0000", bg2: "#7b241c", ground: "#1a0000", line: "#e67e22", weather: "ash", bg1Type: "mountains", bg2Type: "flowing_lava" },

    // ==========================================
    // 2. THIÊN NHIÊN: RỪNG, BIỂN & SA MẠC (NATURE & ELEMENTS)
    // ==========================================
    { id: "sahara_desert", sky: "#e67e22", bg1: "#d35400", bg2: "#f39c12", ground: "#a04000", line: "#f1c40f", weather: "ash", bg1Type: "ruins", bg2Type: "pyramids" },
    { id: "deep_forest", sky: "#145a32", bg1: "#0b5345", bg2: "#1e8449", ground: "#0a2614", line: "#2ecc71", weather: "fireflies", bg1Type: "trees", bg2Type: "mountains" }, // Thả đom đóm vào rừng
    { id: "autumn_woods", sky: "#ba4a00", bg1: "#a04000", bg2: "#d35400", ground: "#6e2c00", line: "#f39c12", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },
    { id: "river_styx", sky: "#154360", bg1: "#1b4f72", bg2: "#21618c", ground: "#0e2c40", line: "#3498db", weather: "rain", bg1Type: "pines", bg2Type: "river" },
    { id: "sunset_beach", sky: "#c0392b", bg1: "#d35400", bg2: "#2980b9", ground: "#f39c12", line: "#16a085", weather: "none", bg1Type: "trees", bg2Type: "river" },
    { id: "frozen_peak", sky: "#2c3e50", bg1: "#bdc3c7", bg2: "#95a5a6", ground: "#ecf0f1", line: "#3498db", weather: "snow", bg1Type: "pines", bg2Type: "mountains" },
    { id: "thunder_peak", sky: "#1b2631", bg1: "#212f3d", bg2: "#283747", ground: "#17202a", line: "#f1c40f", weather: "rain", bg1Type: "pines", bg2Type: "mountains" },

    // ==========================================
    // 3. ĐỊA ĐIỂM VIỄN TƯỞNG & KINH DỊ (SCI-FI & HORROR)
    // ==========================================
    { id: "blood_moon", sky: "#2c0000", bg1: "#4a0000", bg2: "#1a0000", ground: "#0a0000", line: "#ff0000", weather: "blood_rain", bg1Type: "graves", bg2Type: "mountains" }, // Mưa máu trăng máu
    { id: "zombie_highway", sky: "#424949", bg1: "#566573", bg2: "#273746", ground: "#17202a", line: "#ff0000", weather: "toxic", bg1Type: "city", bg2Type: "ruins" },
    { id: "toxic_zone", sky: "#0b1c0b", bg1: "#1b301b", bg2: "#27ae60", ground: "#0a120a", line: "#2ecc71", weather: "toxic", bg1Type: "ruins", bg2Type: "river" },
    { id: "haunted_grave", sky: "#2c3e50", bg1: "#17202a", bg2: "#212f3d", ground: "#0a0c10", line: "#8e44ad", weather: "fireflies", bg1Type: "graves", bg2Type: "trees" }, // Đom đóm nghĩa địa ma mị
    { id: "volcanic_core", sky: "#4a2311", bg1: "#641e16", bg2: "#7b241c", ground: "#111", line: "#e74c3c", weather: "ash", bg1Type: "crystals", bg2Type: "mountains" },
    { id: "mars_colony", sky: "#641e16", bg1: "#7b241c", bg2: "#922b21", ground: "#4a2311", line: "#e67e22", weather: "ash", bg1Type: "city", bg2Type: "pyramids" },

    // ==========================================
    // 4. THẦN THOẠI & SỬ THI (MYTHIC & HISTORICAL)
    // ==========================================
    { id: "roman_colosseum", sky: "#e67e22", bg1: "#b9770e", bg2: "#a04000", ground: "#7e5109", line: "#f1c40f", weather: "ash", bg1Type: "pillars", bg2Type: "mountains" },
    { id: "viking_fjord", sky: "#154360", bg1: "#21618c", bg2: "#2e86c1", ground: "#1b4f72", line: "#aed6f1", weather: "snow", bg1Type: "pines", bg2Type: "river" },
    { id: "dragon_nest", sky: "#1a0500", bg1: "#4a0e00", bg2: "#330800", ground: "#110000", line: "#ff4500", weather: "ash", bg1Type: "ruins", bg2Type: "mountains" },
    { id: "underwater_atlantis", sky: "#001f3f", bg1: "#003366", bg2: "#00509e", ground: "#001122", line: "#00ffff", weather: "cosmic_dust", bg1Type: "crystals", bg2Type: "river" }, // Bụi nước lấp lánh
    { id: "sakura_shrine", sky: "#ffb6c1", bg1: "#fd8adc", bg2: "#ff69b4", ground: "#4a235a", line: "#ffffff", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },

    // ==========================================
    // 5. KHÔNG GIAN SIÊU THỰC & VŨ TRỤ (SURREAL & COSMIC)
    // ==========================================
    { id: "galaxy_void", sky: "#000000", bg1: "#1b1464", bg2: "#4a235a", ground: "#000000", line: "#9b59b6", weather: "shooting_stars", bg1Type: "crystals", bg2Type: "stars" }, // Mưa sao băng
    { id: "alien_world", sky: "#4a235a", bg1: "#633974", bg2: "#76448a", ground: "#154360", line: "#00ff00", weather: "cosmic_dust", bg1Type: "crystals", bg2Type: "stars" }, // Bụi tinh vân vũ trụ
    { id: "cloud_temple", sky: "#85c1e9", bg1: "#aed6f1", bg2: "#d6eaf8", ground: "#fdfefe", line: "#f1c40f", weather: "snow", bg1Type: "pillars", bg2Type: "clouds" },
    { id: "heaven_gates", sky: "#aed6f1", bg1: "#d6eaf8", bg2: "#ebf5fb", ground: "#ffffff", line: "#f1c40f", weather: "none", bg1Type: "pillars", bg2Type: "clouds" },
    { id: "crystal_cave", sky: "#0e6251", bg1: "#0e6655", bg2: "#117864", ground: "#08362d", line: "#1abc9c", weather: "cosmic_dust", bg1Type: "crystals", bg2Type: "mountains" },
    { id: "matrix_grid", sky: "#000000", bg1: "#001a00", bg2: "#003300", ground: "#000000", line: "#00ff00", weather: "matrix_rain", bg1Type: "digital", bg2Type: "none" }, // Mưa mã độc
    { id: "shadow_realm", sky: "#000000", bg1: "#111111", bg2: "#222222", ground: "#000000", line: "#ffffff", weather: "ash", bg1Type: "graves", bg2Type: "stars" },
    { id: "mirror_dimension", sky: "#17202a", bg1: "#1b2631", bg2: "#212f3d", ground: "#000000", line: "#00ffff", weather: "matrix_rain", bg1Type: "crystals", bg2Type: "stars" },

    // ==========================================
    // 6. ĐA VŨ TRỤ HỖN MẠNG & GLITCH (CYBER-NIGHTMARES)
    // ==========================================
    { id: "mainframe_core", sky: "#001100", bg1: "#004400", bg2: "#002200", ground: "#000500", line: "#00ff00", weather: "matrix_rain", bg1Type: "digital", bg2Type: "pillars" }, // Lõi máy chủ ma trận
    { id: "synthwave_drive", sky: "#2a0845", bg1: "#8e44ad", bg2: "#e67e22", ground: "#110011", line: "#ff00ff", weather: "none", bg1Type: "digital", bg2Type: "mountains" }, 
    { id: "glitch_dimension", sky: "#000000", bg1: "#ff00ff", bg2: "#00ffff", ground: "#111111", line: "#ffffff", weather: "toxic", bg1Type: "digital", bg2Type: "stars" }, 
    { id: "steampunk_slums", sky: "#4a2311", bg1: "#873600", bg2: "#5c4033", ground: "#2e150b", line: "#d35400", weather: "ash", bg1Type: "city", bg2Type: "ruins" }, 
    { id: "cyber_yakuza", sky: "#0a0a0a", bg1: "#800000", bg2: "#330000", ground: "#050505", line: "#ff003c", weather: "rain", bg1Type: "pillars", bg2Type: "city" }, 

    // ==========================================
    // 7. CÕI ÂM & KHÔNG GIAN BẤT ĐỊNH (PURGATORY & LIMBO)
    // ==========================================
    { id: "the_backrooms", sky: "#f4f4d7", bg1: "#e3e3b5", bg2: "#d1d193", ground: "#baba7a", line: "#8c8c54", weather: "none", bg1Type: "pillars", bg2Type: "none" }, 
    { id: "eldritch_abyss", sky: "#1a0033", bg1: "#330066", bg2: "#00331a", ground: "#0a001a", line: "#00ff66", weather: "toxic", bg1Type: "graves", bg2Type: "trees" }, 
    { id: "blood_ocean", sky: "#330000", bg1: "#660000", bg2: "#990000", ground: "#1a0000", line: "#ff3333", weather: "blood_rain", bg1Type: "graves", bg2Type: "river" }, // Biển máu
    { id: "infernal_throne", sky: "#000000", bg1: "#cc3300", bg2: "#ff6600", ground: "#110000", line: "#ff9900", weather: "ash", bg1Type: "crystals", bg2Type: "mountains" }, 
    { id: "frozen_hell", sky: "#001122", bg1: "#003366", bg2: "#005599", ground: "#000a14", line: "#00ffff", weather: "snow", bg1Type: "crystals", bg2Type: "mountains" }, 
    { id: "limbo_void", sky: "#555555", bg1: "#777777", bg2: "#333333", ground: "#222222", line: "#ffffff", weather: "ash", bg1Type: "graves", bg2Type: "clouds" }, 

    // ==========================================
    // 8. ĐỈNH CAO THẦN THÁNH & THIÊN CỔ (DIVINE REALMS)
    // ==========================================
    { id: "valhalla_hall", sky: "#f9e79f", bg1: "#f1c40f", bg2: "#f39c12", ground: "#d4ac0d", line: "#ffffff", weather: "snow", bg1Type: "pillars", bg2Type: "clouds" }, 
    { id: "olympus_peak", sky: "#aed6f1", bg1: "#d6eaf8", bg2: "#85c1e9", ground: "#ebf5fb", line: "#3498db", weather: "petals", bg1Type: "pillars", bg2Type: "mountains" }, 
    { id: "yggdrasil_roots", sky: "#0b5345", bg1: "#1d8348", bg2: "#f1c40f", ground: "#073b26", line: "#27ae60", weather: "fireflies", bg1Type: "trees", bg2Type: "stars" }, // Đom đóm cây thần
    { id: "shambhala", sky: "#117864", bg1: "#1abc9c", bg2: "#48c9b0", ground: "#0b5345", line: "#a2d9ce", weather: "petals", bg1Type: "trees", bg2Type: "mountains" }, 
    { id: "astral_forge", sky: "#154360", bg1: "#8e44ad", bg2: "#2980b9", ground: "#0e2c40", line: "#9b59b6", weather: "cosmic_dust", bg1Type: "crystals", bg2Type: "stars" }, 

    // ==========================================
    // 9. NHỮNG GIẤC MƠ BẤT BÌNH THƯỜNG (BIZARRE DREAMS)
    // ==========================================
    { id: "candy_land", sky: "#ffb6c1", bg1: "#ff69b4", bg2: "#00ffff", ground: "#ff1493", line: "#ffffff", weather: "snow", bg1Type: "trees", bg2Type: "mountains" }, 
    { id: "neon_jungle", sky: "#000000", bg1: "#39ff14", bg2: "#ff00ff", ground: "#050505", line: "#00ffff", weather: "toxic", bg1Type: "trees", bg2Type: "river" }, 
    { id: "paper_manga", sky: "#ffffff", bg1: "#dddddd", bg2: "#cccccc", ground: "#eeeeee", line: "#000000", weather: "none", bg1Type: "ruins", bg2Type: "city" }, 
    { id: "shattered_glass", sky: "#e5e8e8", bg1: "#85c1e9", bg2: "#d6eaf8", ground: "#b2babb", line: "#000000", weather: "snow", bg1Type: "crystals", bg2Type: "mountains" }, 
    { id: "quantum_realm", sky: "#1a0033", bg1: "#ff00ff", bg2: "#00ffff", ground: "#0a001a", line: "#ffffff", weather: "cosmic_dust", bg1Type: "digital", bg2Type: "stars" }, 
    { id: "time_chamber", sky: "#fcf3cf", bg1: "#f1c40f", bg2: "#b9770e", ground: "#f8c471", line: "#ffffff", weather: "ash", bg1Type: "digital", bg2Type: "pillars" }, 
    { id: "abyssal_trench", sky: "#000511", bg1: "#001133", bg2: "#002244", ground: "#00020a", line: "#0088ff", weather: "snow", bg1Type: "ruins", bg2Type: "river" }, 
    { id: "solar_core", sky: "#ffdd00", bg1: "#ff8800", bg2: "#ff4400", ground: "#aa3300", line: "#ffffff", weather: "ash", bg1Type: "mountains", bg2Type: "none" } 

    
];
