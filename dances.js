// ==========================================
// DANCES.JS - THƯ VIỆN ĐIỆU NHẢY TIKTOK CHO STICKMAN (@gamenhuclon)
// File độc lập chuyên xử lý khung xương vũ đạo (10 khớp) cho Intro & Outro
// Dễ dàng thêm/sửa các điệu nhảy mới mà không cần đụng vào recorder.js
// ==========================================

window.DanceEngine = {
    currentP1Dance: "hakari",
    currentP2Dance: "orange_justice",
    currentWinDance: "jojo_pose",
    _avatarCache: {},

    // Danh sách tên các điệu nhảy để chọn ngẫu nhiên mỗi trận
    danceList: [
        "hakari",          // 1. Điệu nhảy Hakari (Jujutsu Kaisen - Lobotomy Trend)
        "orange_justice",  // 2. Múa quạt Fortnite (Đập gối vung tay cực sung)
        "twerk",           // 3. Ngoáy mông khiêu khích đối thủ
        "gangnam",         // 4. Nhảy cưỡi ngựa quăng dây thừng
        "moonwalk_dab",    // 5. Trượt Moonwalk kết hợp cú chốt DAB
        "jojo_pose"        // 6. Uốn dẻo gồng cơ bắp kiểu Anime JoJo
    ],

    // Gọi hàm này lúc bắt đầu quay để mỗi video có một điệu nhảy khác nhau
    pickRandomDances: function() {
        const r = () => this.danceList[Math.floor(Math.random() * this.danceList.length)];
        this.currentP1Dance = r();
        this.currentP2Dance = r();
        while (this.currentP2Dance === this.currentP1Dance) {
            this.currentP2Dance = r();
        }
        this.currentWinDance = r();
    },

    // Tự động lấy ảnh mặt (Avatar) của nhân vật từ hệ thống game
    getAvatarImg: function(charObj) {
        if (!charObj) return null;
        let url = charObj.avatarUrl || charObj.imgUrl || null;
        if (charObj.classId !== undefined && window.classStats && window.classStats[charObj.classId]) {
            url = window.classStats[charObj.classId].avatarUrl || url;
        }
        if (!url) return null;
        if (window.hudImages && window.hudImages[url] && window.hudImages[url].complete) {
            return window.hudImages[url];
        }
        if (this._avatarCache[url] && this._avatarCache[url].complete) {
            return this._avatarCache[url];
        }
        if (!this._avatarCache[url]) {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            this._avatarCache[url] = img;
        }
        return null;
    },

    // ==========================================
    // TOÁN HỌC KHUNG XƯƠNG CHO TỪNG ĐIỆU NHẢY
    // t: Thời gian tính bằng giây (tự động chạy theo nhịp beat)
    // ==========================================
    getPose: function(danceId, t) {
        let beat = t * 11; // Tốc độ nhịp nhạc (BPM cao cho TikTok)
        let s = Math.sin(beat);
        let c = Math.cos(beat);
        let s2 = Math.sin(beat * 2);

        // Tọa độ mặc định của 10 khớp cơ thể (Tính từ tâm Hông là 0,0)
        let pose = {
            hipX: 0, hipY: 0,
            neckX: 0, neckY: -75,
            headX: 0, headY: -120, headRot: 0,
            lElbowX: -35, lElbowY: -45, lHandX: -55, lHandY: -20,
            rElbowX: 35,  rElbowY: -45, rHandX: 55,  rHandY: -20,
            lKneeX: -25,  lKneeY: 45,   lFootX: -30, lFootY: 95,
            rKneeX: 25,   rKneeY: 45,   rFootX: 30,  rFootY: 95,
            fxText: ""
        };

        switch (danceId) {
            case "hakari":
                // Điệu nhảy Hakari: Lắc hông ngang mạnh, 2 tay giơ lên ngang tai vẩy liên tục
                pose.hipX = s * 22;
                pose.hipY = Math.abs(s2) * 12;
                pose.neckX = -s * 8;
                pose.neckY = -75 + Math.abs(s2) * 10;
                pose.headX = -s * 12;
                pose.headY = -122 + Math.abs(s2) * 10;
                pose.headRot = s * 0.22;

                // Hai tay giơ cao vẩy cổ tay theo nhịp
                pose.lElbowX = -45 - s * 10; pose.lElbowY = -65 + c * 8;
                pose.lHandX  = -65 + s2 * 18; pose.lHandY  = -115 + Math.abs(c) * 15;
                pose.rElbowX = 45 - s * 10;  pose.rElbowY = -65 - c * 8;
                pose.rHandX  = 65 + s2 * 18;  pose.rHandY  = -115 + Math.abs(s) * 15;

                // Chân nhún chéo điệu nghệ
                pose.lKneeX = -28 + s * 15; pose.lKneeY = 48;
                pose.lFootX = -32 + Math.max(0, s) * 20; pose.lFootY = 95 - Math.max(0, s) * 18;
                pose.rKneeX = 28 + s * 15;  pose.rKneeY = 48;
                pose.rFootX = 32 + Math.min(0, s) * 20;  pose.rFootY = 95 - Math.max(0, -s) * 18;
                pose.fxText = "🎵";
                break;

            case "orange_justice":
                // Điệu múa quạt Fortnite: Hai đầu gối đập ra vào, tay vung chéo từ bụng lên trời
                let swing = Math.sin(beat * 1.15);
                pose.hipX = swing * 16;
                pose.hipY = Math.abs(s2) * 18;
                pose.neckX = swing * 6;
                pose.neckY = -72 + Math.abs(s2) * 18;
                pose.headX = swing * 10;
                pose.headY = -118 + Math.abs(s2) * 18;
                pose.headRot = -swing * 0.25;

                // Tay vung mạnh từ dưới lên qua đầu
                pose.lElbowX = -40 + swing * 25; pose.lElbowY = -50 - swing * 30;
                pose.lHandX  = -20 + swing * 65; pose.lHandY  = -60 - swing * 75;
                pose.rElbowX = 40 + swing * 25;  pose.rElbowY = -50 + swing * 30;
                pose.rHandX  = 20 + swing * 65;  pose.rHandY  = -60 + swing * 75;

                // Đầu gối khép mở liên tục
                let kneeSpread = Math.cos(beat * 2.3) * 28;
                pose.lKneeX = -25 + kneeSpread; pose.lKneeY = 50;
                pose.rKneeX = 25 - kneeSpread;  pose.rKneeY = 50;
                pose.fxText = "🔥";
                break;

            case "twerk":
                // Ngoáy mông khiêu khích: Cúi người sang một bên, tay chống gối, mông nảy tốc độ cao
                let twerkShake = Math.sin(beat * 2.6);
                pose.hipX = -28 + twerkShake * 10;
                pose.hipY = -5 + Math.abs(twerkShake) * 22;
                pose.neckX = 25;
                pose.neckY = -55 + twerkShake * 6;
                pose.headX = 42;
                pose.headY = -98 + twerkShake * 8;
                pose.headRot = 0.2 + twerkShake * 0.12;

                // Hai tay chống xuống đầu gối
                pose.lElbowX = 10; pose.lElbowY = -15;
                pose.lHandX  = 18; pose.lHandY  = 35;
                pose.rElbowX = 35; pose.rElbowY = -15;
                pose.rHandX  = 32; pose.rHandY  = 40;

                pose.lKneeX = -15; pose.lKneeY = 50; pose.lFootX = -25; pose.lFootY = 95;
                pose.rKneeX = 28;  pose.rKneeY = 45; pose.rFootX = 30;  pose.rFootY = 95;
                pose.fxText = "🍑";
                break;

            case "gangnam":
                // Gangnam Style: Chân dạng rộng dậm nhảy 1-2, một tay quay dây thừng trên đầu
                let bounce = Math.abs(Math.sin(beat * 1.5));
                let sideStep = Math.sin(beat * 0.75);
                pose.hipX = sideStep * 14;
                pose.hipY = bounce * 22;
                pose.neckX = sideStep * 10;
                pose.neckY = -75 + bounce * 22;
                pose.headX = sideStep * 12;
                pose.headY = -122 + bounce * 22;
                pose.headRot = sideStep * 0.15;

                // Tay trái cầm dây cương trước ngực, tay phải quay tít trên đầu
                pose.lElbowX = -42; pose.lElbowY = -40 + bounce * 18;
                pose.lHandX  = 10;  pose.lHandY  = -42 + bounce * 18;
                pose.rElbowX = 48;  pose.rElbowY = -95 + bounce * 15;
                pose.rHandX  = 45 + Math.cos(beat * 3) * 35;
                pose.rHandY  = -145 + Math.sin(beat * 3) * 18;

                // Hai chân khuỳnh rộng kiểu cưỡi ngựa
                pose.lKneeX = -48; pose.lKneeY = 45 + bounce * 10;
                pose.lFootX = -42; pose.lFootY = 95 - (sideStep > 0 ? bounce * 25 : 0);
                pose.rKneeX = 48;  pose.rKneeY = 45 + bounce * 10;
                pose.rFootX = 42;  pose.rFootY = 95 - (sideStep <= 0 ? bounce * 25 : 0);
                pose.fxText = "🕶️";
                break;

            case "moonwalk_dab":
                // Nửa nhịp đầu trượt Moonwalk, nửa nhịp sau đứng phắt lại DAB cực gắt
                let cycle = (t % 1.6) / 1.6;
                if (cycle < 0.65) {
                    // Trượt Moonwalk
                    let walk = t * 14;
                    let slideX = ((cycle / 0.65) - 0.5) * -50;
                    pose.hipX = slideX;
                    pose.neckX = slideX - 8; pose.neckY = -75;
                    pose.headX = slideX - 15; pose.headY = -120; pose.headRot = -0.15;

                    pose.lElbowX = slideX - 25 * Math.sin(walk); pose.lElbowY = -40;
                    pose.lHandX  = slideX - 40 * Math.sin(walk); pose.lHandY  = -15;
                    pose.rElbowX = slideX + 25 * Math.sin(walk); pose.rElbowY = -40;
                    pose.rHandX  = slideX + 40 * Math.sin(walk); pose.rHandY  = -15;

                    pose.lKneeX = slideX - 15 * Math.cos(walk); pose.lKneeY = 48;
                    pose.lFootX = slideX - 35 * Math.sin(walk); pose.lFootY = 95;
                    pose.rKneeX = slideX + 15 * Math.cos(walk); pose.rKneeY = 48;
                    pose.rFootX = slideX + 35 * Math.sin(walk); pose.rFootY = 95;
                    pose.fxText = "👟";
                } else {
                    // Đóng băng tư thế DAB
                    pose.hipX = 5; pose.hipY = 8;
                    pose.neckX = 18; pose.neckY = -65;
                    pose.headX = 32; pose.headY = -92; pose.headRot = 0.55; // Cúi đầu giấu vào khuỷu tay

                    // Một tay gập che mặt, một tay phóng thẳng chéo lên trời
                    pose.lElbowX = -45; pose.lElbowY = -85;
                    pose.lHandX  = -95; pose.lHandY  = -125;
                    pose.rElbowX = 52;  pose.rElbowY = -82;
                    pose.rHandX  = 5;   pose.rHandY  = -95;

                    pose.lKneeX = -30; pose.lKneeY = 50; pose.lFootX = -45; pose.lFootY = 95;
                    pose.rKneeX = 30;  pose.rKneeY = 50; pose.rFootX = 40;  pose.rFootY = 95;
                    pose.fxText = "⚡DAB!";
                }
                break;

            case "jojo_pose":
            default:
                // Tư thế uốn dẻo JoJo chữ S + chữ tượng thanh ゴゴゴ bay quanh người
                let flex = Math.sin(beat * 0.6);
                pose.hipX = -22 * flex;
                pose.hipY = 5;
                pose.neckX = 18 * flex;
                pose.neckY = -72;
                pose.headX = 10 * flex;
                pose.headY = -118;
                pose.headRot = -0.3 * flex;

                pose.lElbowX = -48; pose.lElbowY = -88;
                pose.lHandX  = -10; pose.lHandY  = -135; // Tay vòng lên tạo dáng trên đầu
                pose.rElbowX = 52;  pose.rElbowY = -45;
                pose.rHandX  = 18;  pose.rHandY  = -15;  // Tay chống hông

                pose.lKneeX = -32; pose.lKneeY = 48; pose.lFootX = -45; pose.lFootY = 95;
                pose.rKneeX = 18;  pose.rKneeY = 42; pose.rFootX = 38;  pose.rFootY = 95;
                pose.fxText = "ゴゴゴ";
                break;
        }
        return pose;
    },

    // ==========================================
    // HÀM VẼ VŨ CÔNG STICKMAN HOÀN CHỈNH LÊN CANVAS
    // ==========================================
    drawDancer: function(ctx, charObj, cx, cy, isFacingRight, scaleOverride, danceId) {
        if (!charObj) return;
        let t = Date.now() / 1000;
        let pose = this.getPose(danceId || "hakari", t);
        let avatarImg = this.getAvatarImg(charObj);

        ctx.save();
        ctx.translate(cx, cy);
        if (!isFacingRight) ctx.scale(-1, 1);

        // Chuyển đổi tỷ lệ để khớp 100% với vị trí nhân vật gốc (scale 3.5 của game tương đương 1.15 của khung xương)
        let rigScale = (scaleOverride || 3.5) * 0.34;
        ctx.scale(rigScale, rigScale);

        // Bóng đổ dưới mặt đất nhấp nhô theo bước nhảy
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.beginPath();
        ctx.ellipse(pose.hipX * 0.5, 102, 48, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cấu hình nét vẽ thân người Stickman đậm chất Manga
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 18;

        // 1. Vẽ 2 Chân (Hông -> Đầu gối -> Bàn chân)
        ctx.beginPath();
        ctx.moveTo(pose.hipX, pose.hipY); ctx.lineTo(pose.lKneeX, pose.lKneeY); ctx.lineTo(pose.lFootX, pose.lFootY);
        ctx.moveTo(pose.hipX, pose.hipY); ctx.lineTo(pose.rKneeX, pose.rKneeY); ctx.lineTo(pose.rFootX, pose.rFootY);
        ctx.stroke();

        // 2. Vẽ Xương Sống (Hông -> Cổ)
        ctx.lineWidth = 22;
        ctx.beginPath();
        ctx.moveTo(pose.hipX, pose.hipY);
        ctx.lineTo(pose.neckX, pose.neckY);
        ctx.stroke();

        // 3. Vẽ 2 Tay (Cổ -> Khuỷu tay -> Bàn tay)
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(pose.neckX, pose.neckY + 8); ctx.lineTo(pose.lElbowX, pose.lElbowY); ctx.lineTo(pose.lHandX, pose.lHandY);
        ctx.moveTo(pose.neckX, pose.neckY + 8); ctx.lineTo(pose.rElbowX, pose.rElbowY); ctx.lineTo(pose.rHandX, pose.rHandY);
        ctx.stroke();

        // 4. Vẽ Găng Tay (2 nắm đấm tròn giống tạo hình nhân vật trong game)
        ctx.fillStyle = "#222222";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(pose.lHandX, pose.lHandY, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(pose.rHandX, pose.rHandY, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 5. Vẽ Đầu Nhân Vật (Lấy đúng ảnh mặt Avatar của Bill Gates, Haaland... và nghiêng theo điệu nhảy)
        ctx.save();
        ctx.translate(pose.headX, pose.headY);
        ctx.rotate(pose.headRot);
        let headRadius = 46;

        if (avatarImg && avatarImg.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
            ctx.clip();
            ctx.filter = "grayscale(100%) contrast(175%) sepia(25%)";
            ctx.drawImage(avatarImg, -headRadius, -headRadius, headRadius * 2, headRadius * 2);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#111111";
            ctx.stroke();
        } else {
            // Đầu mặc định nếu nhân vật không có ảnh Avatar
            ctx.fillStyle = "#111111";
            ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // 6. Vẽ Hiệu ứng biểu cảm / Nốt nhạc bay quanh người khi nhảy
        if (pose.fxText) {
            ctx.save();
            if (!isFacingRight) ctx.scale(-1, 1); // Giữ chữ không bị ngược
            let floatY = -140 + Math.sin(t * 10) * 12;
            ctx.font = "900 32px 'Arial Black', sans-serif";
            ctx.fillStyle = "#111111";
            ctx.textAlign = "center";
            ctx.fillText(pose.fxText, isFacingRight ? 85 : -85, floatY);
            ctx.restore();
        }

        ctx.restore();
    }
};
