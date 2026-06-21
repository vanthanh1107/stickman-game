// ==========================================
// INVENTORY.JS - QUẢN LÝ VÀNG & VẬT PHẨM (CLOUD FIRESTORE)
// ==========================================

// 1. ĐỊNH NGHĨA DANH SÁCH VẬT PHẨM
window.GAME_ITEMS = {
    "gang_sat": { name: "Găng Tay Sắt", desc: "Tăng 10% Sát thương", dmgBonus: 0.1, price: 500 },
    "giay_toc_do": { name: "Giày Thần Tốc", desc: "Tăng 15% Tốc độ di chuyển", speedBonus: 0.15, price: 700 },
    "nhan_bao_kich": { name: "Nhẫn Chí Mạng", desc: "Tăng 10% Tỷ lệ bạo kích", critBonus: 0.1, price: 1000 }
};

// 2. KHỞI TẠO TÀI KHOẢN MẶC ĐỊNH
window.playerData = {
    gold: 0,
    inventory: [] 
};

// 3. TẢI DỮ LIỆU TỪ CLOUD HOẶC TRÌNH DUYỆT
window.loadPlayerData = async function() {
    // NẾU ĐÃ ĐĂNG NHẬP -> TẢI TỪ FIRESTORE
    if (window.currentUser && window.currentUser.uid && window.db) {
        try {
            let docRef = window.db.collection("players").doc(window.currentUser.uid);
            let doc = await docRef.get();
            
            if (doc.exists) {
                window.playerData = doc.data();
                if (window.playerData.gold === undefined) window.playerData.gold = 0;
                if (!Array.isArray(window.playerData.inventory)) window.playerData.inventory = [];
                console.log("☁️ Đã tải rương đồ từ Cloud Firestore!");
            } else {
                // Tài khoản mới hoàn toàn, khởi tạo trên Cloud
                await docRef.set(window.playerData);
                console.log("☁️ Đã tạo rương đồ mới trên Cloud!");
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Cloud, tự động dùng Local tạm:", error);
            loadLocalData();
        }
    } 
    // NẾU CHƯA ĐĂNG NHẬP -> TẢI TỪ LOCALSTORAGE
    else {
        loadLocalData();
    }
};

// Hàm phụ tải offline
function loadLocalData() {
    let savedData = localStorage.getItem("stickman_player_data");
    if (savedData) {
        try { window.playerData = JSON.parse(savedData); console.log("💾 Đã tải rương đồ Offline!"); } 
        catch (e) {}
    }
}

// 4. LƯU DỮ LIỆU LÊN CLOUD VÀ TRÌNH DUYỆT
window.savePlayerData = function() {
    // Luôn lưu một bản backup ở LocalStorage phòng khi rớt mạng
    localStorage.setItem("stickman_player_data", JSON.stringify(window.playerData));

    // Đẩy thẳng lên máy chủ Firestore nếu có kết nối và đăng nhập
    if (window.currentUser && window.currentUser.uid && window.db) {
        window.db.collection("players").doc(window.currentUser.uid)
            .set(window.playerData, { merge: true }) // Dùng merge để không đè mất các trường dữ liệu khác sau này
            .then(() => console.log("☁️ Đã đồng bộ Vàng/Đồ lên máy chủ!"))
            .catch(error => console.error("Lỗi khi lưu lên mây:", error));
    }
};

// 5. CỘNG VÀNG KHI CHIẾN THẮNG
window.rewardPlayer = function(goldAmount) {
    if (isNaN(goldAmount) || goldAmount <= 0) return;
    
    window.playerData.gold += goldAmount;
    window.savePlayerData(); // Tự động bắn dữ liệu lên máy chủ
    
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

// 6. THÊM VẬT PHẨM VÀO RƯƠNG
window.gainItem = function(itemId) {
    if (!window.GAME_ITEMS[itemId]) return false;
    if (!window.playerData.inventory.includes(itemId)) {
        window.playerData.inventory.push(itemId);
        window.savePlayerData(); // Tự động bắn dữ liệu lên máy chủ
        return true;
    }
    return false;
};

// 7. ÁP DỤNG SỨC MẠNH VÀO TRẬN ĐẤU
window.applyInventoryBuffs = function(fighter) {
    if (!fighter || !fighter.isPlayer) return;
    
    window.playerData.inventory.forEach(itemId => {
        let item = window.GAME_ITEMS[itemId];
        if (item) {
            if (item.dmgBonus) fighter.dmgMod += item.dmgBonus;
            if (item.speedBonus) fighter.speed += item.speedBonus;
            if (item.critBonus) fighter.critChance += item.critBonus;
        }
    });
};
