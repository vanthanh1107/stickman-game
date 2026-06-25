// ==========================================
// 1. CONFIG.JS - CHỈ SỐ NHÂN VẬT & MÔI TRƯỜNG
// ==========================================

window.MAPS = [
    { id: "cyberpunk", sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain", bg1Type: "city", bg2Type: "mountains" },
    { id: "golden_dojo", sky: "#8e44ad", bg1: "#d35400", bg2: "#e67e22", ground: "#2c3e50", line: "#f1c40f", weather: "petals", bg1Type: "pillars", bg2Type: "mountains" },
    { id: "ruined_city", sky: "#5d6d7e", bg1: "#34495e", bg2: "#2e4053", ground: "#283747", line: "#e67e22", weather: "ash", bg1Type: "ruins", bg2Type: "mountains" },
    { id: "matrix_grid", sky: "#000000", bg1: "#001a00", bg2: "#003300", ground: "#000000", line: "#00ff00", weather: "rain", bg1Type: "digital", bg2Type: "none" },
    { id: "sahara_desert", sky: "#e67e22", bg1: "#d35400", bg2: "#f39c12", ground: "#a04000", line: "#f1c40f", weather: "ash", bg1Type: "ruins", bg2Type: "pyramids" },
    { id: "deep_forest", sky: "#145a32", bg1: "#0b5345", bg2: "#1e8449", ground: "#0a2614", line: "#2ecc71", weather: "petals", bg1Type: "trees", bg2Type: "mountains" },
    { id: "river_styx", sky: "#154360", bg1: "#1b4f72", bg2: "#21618c", ground: "#0e2c40", line: "#3498db", weather: "rain", bg1Type: "pines", bg2Type: "river" },
    { id: "sunset_beach", sky: "#c0392b", bg1: "#d35400", bg2: "#2980b9", ground: "#f39c12", line: "#16a085", weather: "none", bg1Type: "trees", bg2Type: "river" },
    { id: "frozen_peak", sky: "#2c3e50", bg1: "#bdc3c7", bg2: "#95a5a6", ground: "#ecf0f1", line: "#3498db", weather: "snow", bg1Type: "pines", bg2Type: "mountains" },
    { id: "blood_moon", sky: "#2c0000", bg1: "#4a0000", bg2: "#1a0000", ground: "#0a0000", line: "#ff0000", weather: "ash", bg1Type: "graves", bg2Type: "mountains" },
    { id: "toxic_zone", sky: "#0b1c0b", bg1: "#1b301b", bg2: "#27ae60", ground: "#0a120a", line: "#2ecc71", weather: "toxic", bg1Type: "ruins", bg2Type: "river" },
    { id: "haunted_grave", sky: "#2c3e50", bg1: "#17202a", bg2: "#212f3d", ground: "#0a0c10", line: "#8e44ad", weather: "toxic", bg1Type: "graves", bg2Type: "trees" },
    { id: "volcanic_core", sky: "#4a2311", bg1: "#641e16", bg2: "#7b241c", ground: "#111", line: "#e74c3c", weather: "ash", bg1Type: "crystals", bg2Type: "mountains" },
    { id: "galaxy_void", sky: "#000000", bg1: "#1b1464", bg2: "#4a235a", ground: "#000000", line: "#9b59b6", weather: "snow", bg1Type: "crystals", bg2Type: "stars" },
    { id: "cloud_temple", sky: "#85c1e9", bg1: "#aed6f1", bg2: "#d6eaf8", ground: "#fdfefe", line: "#f1c40f", weather: "snow", bg1Type: "pillars", bg2Type: "clouds" },
    { id: "crystal_cave", sky: "#0e6251", bg1: "#0e6655", bg2: "#117864", ground: "#08362d", line: "#1abc9c", weather: "snow", bg1Type: "crystals", bg2Type: "mountains" }
];

window.classStats = {
    "dausi": { className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf" },
    "satthu": { className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, color: "#2ed573", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf" },
    "phapsu": { className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf" },
    "hove": { className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf" },
    "thichkhach": { className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, color: "#dfe4ea", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf" }
};

window.GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXYZ_ABC_123/pub?gid=0&single=true&output=csv";
