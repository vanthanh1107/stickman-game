// ==========================================
// INVENTORY.JS - QUẢN LÝ VÀNG VÀ VẬT PHẨM NGƯỜI CHƠI
// ==========================================

// 1. ĐỊNH NGHĨA DANH SÁCH VẬT PHẨM CÓ TRONG GAME
window.GAME_ITEMS = {
    "gang_sat": { name: "Găng Tay Sắt", desc: "Tăng 10% Sát thương", dmgBonus: 0.1, price: 500 },
    "giay_toc_do": { name: "Giày Thần Tốc", desc: "Tăng 15% Tốc độ di chuyển", speedBonus: 0.15, price: 700 },
    "nhan_bao_kich": { name: "Nhẫn Chí Mạng", desc: "Tăng 10% Tỷ lệ bạo kích", critBonus: 0.1, price: 1000 }
};

// 2. KHỞI TẠO TÀI KHOẢN MẶC ĐỊNH CHO NGƯỜI CHƠI
window.playerData = {
    gold: 0,
    inventory: [] // Chứa ID của các vật phẩm đã sở hữu
};

// 3. TẢI DỮ LIỆU TỪ TRÌNH DUYỆT (LOAD GAME)
window.loadPlayerData = function() {
    let savedData = localStorage.getItem("stickman_player_data");
    if (savedData) {
        try {
            window.playerData = JSON.parse(savedData);
            // Đảm bảo cấu trúc dữ liệu không bị lỗi nếu thiếu trường
            if (window.playerData.gold === undefined) window.playerData.gold = 0;
            if (!Array.isArray(window.playerData.inventory)) window.playerData.inventory = [];
            console.log("Đã tải dữ liệu người chơi thành công!");
        } catch (e) {
            console.error("Lỗi dữ liệu lưu, khởi tạo lại từ đầu.");
        }
    }
};

// 4. LƯU DỮ LIỆU VÀO TRÌNH DUYỆT (SAVE GAME)
window.savePlayerData = function() {
    localStorage.setItem("stickman_player_data", JSON.stringify(window.playerData));
};

// 5. HÀM CỘNG VÀNG KHI CHIẾN THẮNG
window.rewardPlayer = function(goldAmount) {
    if (isNaN(goldAmount) || goldAmount <= 0) return;
    
    window.playerData.gold += goldAmount;
    window.savePlayerData(); // Lưu ngay lập tức
    
    // Tạo thông báo bay lên màn hình để chúc mừng
    if (window.p1) {
        window.floatingTexts.push({
            x: window.p1.x,
            y: window.GROUND_Y - 100,
            text: `+${goldAmount} 🪙 VÀNG!`,
            color: "#f1c40f",
            alpha: 1,
            vx: 0,
            vy: -4,
            font: "900 26px Arial",
            life: 60
        });
    }
};

// 6. HÀM MUA/NHẬN VẬT PHẨM GÀI VÀO HÒM ĐỒ
window.gainItem = function(itemId) {
    if (!window.GAME_ITEMS[itemId]) return;
    if (!window.playerData.inventory.includes(itemId)) {
        window.playerData.inventory.push(itemId);
        window.savePlayerData();
        return true;
    }
    return false; // Đã có vật phẩm này rồi
};

// 7. ÁP DỤNG CHỈ SỐ CỦA ĐỒ TRONG RƯƠNG VÀO STATS CHÂN THỰC KHI TRẬN ĐẤU BẮT ĐẦU
window.applyInventoryBuffs = function(fighter) {
    if (!fighter || !f1.isPlayer) return;
    
    window.playerData.inventory.forEach(itemId => {
        let item = window.GAME_ITEMS[itemId];
        if (item) {
            if (item.dmgBonus) fighter.dmgMod += item.dmgBonus;
            if (item.speedBonus) fighter.speed += item.speedBonus;
            if (item.critBonus) fighter.critChance += item.critBonus;
        }
    });
};
