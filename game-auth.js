// ==========================================
// GAME-AUTH.JS - XÁC THỰC VÀ QUẢN LÝ TÀI KHOẢN FIREBASE
// ==========================================

// Khởi tạo các biến toàn cục cho Database và User
window.db = firebase.firestore();
window.currentUser = null;
window.recaptchaVerifier = null; // Bắt buộc phải có để Firebase gửi mã OTP SĐT

document.addEventListener("DOMContentLoaded", () => {
    let authSection = document.getElementById("auth-section");
    if(authSection) {
        // Giao diện gồm 2 phần: Khung đăng nhập (login-box) và Khung thông tin (user-info-box)
        authSection.innerHTML = `
            <div id="login-box" style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block; border: 2px solid #555;">
                <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #f1c40f;">Đăng nhập để lưu tiến trình (Cloud):</p>
                <div id="recaptcha-container"></div>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold; transition: 0.2s;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #7f8c8d; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold; transition: 0.2s;">🍎 Đăng nhập Apple</button>
            </div>
            
            <div id="user-info-box" style="display: none; background: #2c3e50; padding: 10px 20px; border-radius: 8px; border: 2px solid #3498db; color: #fff; font-weight: bold;">
                <span id="user-display-name"></span>
                <button id="btn-logout" style="margin-left: 15px; background: #e74c3c; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Đăng xuất</button>
            </div>
        `;

        // 1. Cấu hình bảo mật reCAPTCHA ẩn cho Số Điện Thoại
        try {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => { console.log("ReCAPTCHA verified"); }
            });
        } catch (e) {
            console.error("Lỗi khởi tạo reCAPTCHA (có thể thiếu thư viện Firebase):", e);
        }

        // 2. Xử lý logic Đăng nhập Số Điện Thoại
        document.getElementById("btn-phone-login").onclick = function() { 
            let phoneNumber = prompt("Vui lòng nhập số điện thoại của bạn (Bắt đầu bằng +84, VD: +84912345678):");
            if (!phoneNumber) return;
            
            alert("Đang gửi mã OTP... Vui lòng đợi trong giây lát.");
            
            firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    let code = prompt("Nhập mã OTP gồm 6 chữ số vừa được gửi tới tin nhắn của bạn:");
                    if (!code) return;
                    return confirmationResult.confirm(code);
                }).then((result) => {
                    alert("✅ Đăng nhập Số điện thoại thành công!");
                }).catch((error) => {
                    console.error("Lỗi đăng nhập SĐT:", error);
                    alert("❌ Đăng nhập thất bại. Hãy chắc chắn bạn nhập đúng định dạng +84 và OTP.");
                });
        };

        // 3. Xử lý logic Đăng nhập Apple
        document.getElementById("btn-apple-login").onclick = function() { 
            let provider = new firebase.auth.OAuthProvider('apple.com');
            // Cấu hình xin quyền lấy Tên và Email (Tùy chọn)
            provider.addScope('email');
            provider.addScope('name');
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    alert("✅ Đăng nhập Apple thành công!");
                })
                .catch((error) => {
                    console.error("Lỗi đăng nhập Apple:", error);
                    alert("❌ Lỗi đăng nhập Apple. Xem chi tiết trong Console (F12).");
                });
        };

        // 4. Xử lý Đăng xuất
        document.getElementById("btn-logout").onclick = function() {
            firebase.auth().signOut().then(() => {
                alert("Đã đăng xuất an toàn!");
                // Reset lại dữ liệu rương đồ tạm thời
                window.playerData = { gold: 0, inventory: [] };
            });
        };
    }
});

// ==========================================
// LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP (QUAN TRỌNG NHẤT)
// Kích hoạt ngay khi load trang hoặc đăng nhập thành công
// ==========================================
firebase.auth().onAuthStateChanged(function(user) {
    let loginBox = document.getElementById("login-box");
    let userInfoBox = document.getElementById("user-info-box");
    let userNameDisplay = document.getElementById("user-display-name");

    if (user) {
        // NGƯỜI CHƠI ĐÃ ĐĂNG NHẬP
        window.currentUser = user;
        console.log("Đã đăng nhập với UID:", user.uid);
        
        // Cập nhật giao diện ẩn/hiện
        if (loginBox) loginBox.style.display = "none";
        if (userInfoBox) userInfoBox.style.display = "inline-block";
        if (userNameDisplay) {
            // Hiển thị tên (nếu dùng Apple) hoặc SĐT, nếu không có thì để mặc định
            let identifier = user.displayName || user.phoneNumber || user.email || "Chiến Binh";
            userNameDisplay.innerText = "👋 Xin chào, " + identifier;
        }

        // KÍCH HOẠT HÀM TẢI DATA TỪ FIRESTORE (Nằm bên inventory.js)
        if (typeof window.loadPlayerData === 'function') {
            window.loadPlayerData();
        }
        
    } else {
        // CHƯA ĐĂNG NHẬP HOẶC VỪA ĐĂNG XUẤT
        window.currentUser = null;
        console.log("Chơi ở chế độ Khách (Offline)");
        
        // Cập nhật giao diện ẩn/hiện
        if (loginBox) loginBox.style.display = "inline-block";
        if (userInfoBox) userInfoBox.style.display = "none";

        // KÍCH HOẠT HÀM TẢI DATA TỪ LOCALSTORAGE (Nằm bên inventory.js)
        if (typeof window.loadPlayerData === 'function') {
            window.loadPlayerData();
        }
    }
});
