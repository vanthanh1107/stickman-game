// Chạy trực tiếp không cần chờ DOMContentLoaded
setTimeout(() => {
    let authSection = document.getElementById("auth-section");
    if(authSection) {
        authSection.innerHTML = `
            <div style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block; border: 2px solid #555;">
                <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #f1c40f;">Đăng nhập để lưu tiến trình:</p>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold; transition: 0.2s;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #7f8c8d; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold; transition: 0.2s;">🍎 Đăng nhập Apple</button>
            </div>
        `;

        document.getElementById("btn-phone-login").onclick = function() {
            alert("Đang gọi Firebase Phone Auth...");
            // Gọi firebase.auth().signInWithPhoneNumber(...) tại đây
        };

        document.getElementById("btn-apple-login").onclick = function() {
            alert("Đang gọi Firebase Apple Auth...");
            // Gọi firebase.auth().signInWithPopup(...) tại đây
        };
    }
}, 100); // Trễ 0.1 giây để đảm bảo thẻ div HTML đã tồn tại
