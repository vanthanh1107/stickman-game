// ==========================================
// GAME-AUTH.JS - HỆ THỐNG ĐĂNG NHẬP
// ==========================================

function renderAuth() {
    let authSection = document.getElementById("auth-section");
    if(authSection && authSection.innerHTML.trim() === "") {
        authSection.innerHTML = `
            <div style="background: #353b48; padding: 15px; border-radius: 8px; display: inline-block; border: 2px solid #555;">
                <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #f1c40f;">Đăng nhập để lưu tiến trình:</p>
                <button id="btn-phone-login" style="background:#2ecc71; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; margin-right:5px; font-weight:bold; transition: 0.2s;">📱 Đăng nhập SĐT</button>
                <button id="btn-apple-login" style="background:#111; color:#fff; border:1px solid #7f8c8d; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold; transition: 0.2s;">🍎 Đăng nhập Apple</button>
            </div>
        `;
        let phoneBtn = document.getElementById("btn-phone-login");
        if(phoneBtn) phoneBtn.onclick = function() { alert("Đang gọi Firebase Phone Auth..."); };
        
        let appleBtn = document.getElementById("btn-apple-login");
        if(appleBtn) appleBtn.onclick = function() { alert("Đang gọi Firebase Apple Auth..."); };
    }
}

// Tự động kiểm tra và vẽ (Lặp lại 3 lần để chắc chắn 100% hiện ra)
setTimeout(renderAuth, 200);
setTimeout(renderAuth, 800);
setTimeout(renderAuth, 1500);
