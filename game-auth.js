// Khởi tạo các biến để kết nối giao diện Auth
document.addEventListener("DOMContentLoaded", () => {
    let authSection = document.getElementById("auth-section");
    if(authSection) {
        // Khung UI đăng nhập
        authSection.innerHTML = `
            <div style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 0 0 10px 0; font-size: 14px;">Đăng nhập để lưu tiến trình:</p>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #555; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">🍎 Đăng nhập Apple</button>
            </div>
        `;
        
        // Gắn sự kiện (Kết nối API Firebase của bạn vào đây)
        document.getElementById("btn-phone-login").addEventListener("click", () => {
            console.log("Kích hoạt Firebase Phone Auth...");
            // firebase.auth().signInWithPhoneNumber(...)
        });

        document.getElementById("btn-apple-login").addEventListener("click", () => {
            console.log("Kích hoạt Firebase Apple Auth...");
            // var provider = new firebase.auth.OAuthProvider('apple.com');
            // firebase.auth().signInWithPopup(provider)...
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let authSection = document.getElementById("auth-section");
    if(authSection) {
        authSection.innerHTML = `
            <div style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block; border: 2px solid #555;">
                <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #f1c40f;">Đăng nhập để lưu tiến trình:</p>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold; transition: 0.2s;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #7f8c8d; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold; transition: 0.2s;">🍎 Đăng nhập Apple</button>
            </div>
        `;

        document.getElementById("btn-phone-login").addEventListener("click", () => {
            alert("Hệ thống Firebase Phone Auth đang được kết nối...");
            // Gọi firebase.auth().signInWithPhoneNumber(...) tại đây
        });

        document.getElementById("btn-apple-login").addEventListener("click", () => {
            alert("Hệ thống Firebase Apple Auth đang được kết nối...");
            // Gọi firebase.auth().signInWithPopup(new firebase.auth.OAuthProvider('apple.com')) tại đây
        });
    }
});
