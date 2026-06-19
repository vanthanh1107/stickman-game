// ==========================================
// GAME-AUTH.JS - TỰ ĐỘNG ĐỒNG BỘ TÀI KHOẢN TRÊN BLOGSPOT
// ==========================================

function renderAuthUI(user) {
    let authSection = document.getElementById("auth-section");
    if (!authSection) return;

    if (user) {
        // Đã có tài khoản từ Blogspot -> Hiện thông tin, giấu bảng đăng nhập
        let displayName = user.phoneNumber || user.email || "Chiến Binh";
        authSection.innerHTML = `
            <div style="background: #27ae60; padding: 10px 15px; border-radius: 8px; display: inline-block; border: 2px solid #2ecc71;">
                <span style="color: #fff; font-weight: bold; margin-right: 10px;">👋 Xin chào: ${displayName}</span>
            </div>
        `;
    } else {
        // Chưa có tài khoản -> Hiện Form đăng nhập
        authSection.innerHTML = `
            <div style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block; border: 2px solid #555;">
                <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #f1c40f;">Đăng nhập để lưu tiến trình:</p>
                <div id="recaptcha-container" style="display: none;"></div>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold; transition: 0.2s;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #7f8c8d; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold; transition: 0.2s;">🍎 Đăng nhập Apple</button>
            </div>
        `;

        document.getElementById("btn-apple-login").onclick = function() {
            if (typeof firebase === 'undefined') return alert("Đang tải hệ thống...");
            const provider = new firebase.auth.OAuthProvider('apple.com');
            firebase.auth().signInWithPopup(provider).catch(e => alert("Lỗi Apple: " + e.message));
        };

        document.getElementById("btn-phone-login").onclick = function() {
            if (typeof firebase === 'undefined') return alert("Đang tải hệ thống...");
            let phoneNumber = prompt("Nhập số điện thoại (+84...):", "+84");
            if (!phoneNumber) return;

            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
            }

            firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    let code = prompt("Nhập mã OTP (6 số):");
                    if (code) {
                        confirmationResult.confirm(code).catch(() => alert("Mã OTP sai!"));
                    }
                }).catch((error) => {
                    alert("Lỗi gửi SMS. Vui lòng thử lại sau.");
                    if(window.recaptchaVerifier) {
                        window.recaptchaVerifier.render().then(wId => grecaptcha.reset(wId));
                    }
                });
        };
    }
}

// BỘ ĐỌC TRẠNG THÁI (LẮNG NGHE TÀI KHOẢN TỪ BLOGSPOT)
// BỘ ĐỌC TRẠNG THÁI (LẮNG NGHE VÀ ĐỒNG BỘ TÀI KHOẢN SANG BLOGSPOT)
function initAuthSystem() {
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.warn("Chưa khởi tạo Firebase trên trang này, game sẽ chạy ở chế độ khách.");
        renderAuthUI(null);
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("Game đã bắt được tín hiệu tài khoản:", user.uid);
            
            // ÉP CƠ CHẾ ĐỒNG BỘ: Xuất dữ liệu User ra biến toàn cục 
            // giúp đoạn mã dòng 896 của file 123.html lấy được dữ liệu ngay lập tức
            window.firebaseUser = user; 
            window.currentUser = user;
            
            renderAuthUI(user);
            
            // Nếu Blogspot có hàm kích hoạt đồng bộ sau khi đăng nhập, game sẽ tự gọi luôn
            if (typeof window.onFirebaseSyncComplete === 'function') {
                window.onFirebaseSyncComplete(user);
            }
        } else {
            window.firebaseUser = null;
            window.currentUser = null;
            renderAuthUI(null);
        }
    });
}

// Gọi hệ thống đăng nhập tự động ngay sau khi nạp xong code
setTimeout(initAuthSystem, 500);
// Gọi hệ thống đăng nhập tự động ngay sau khi nạp xong code
setTimeout(initAuthSystem, 500);
