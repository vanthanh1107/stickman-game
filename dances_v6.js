// ==========================================
// DANCES.JS - TRẠM VŨ ĐẠO, HOT TREND TIKTOK, ANIME MEME & TAUNT (V9.5 MEGA COLLECTION)
// ĐẢM NHIỆM 100%:
// 1. Sở hữu 52 Điệu nhảy Hot Trend (APT, Slickback, Múa Quạt, Gear 5, Take The L, Kazotsky Kick, The Worm...).
// 2. Điều khiển trực tiếp 11 khớp xương, độ nghiêng đầu (headTilt) và gió khăn choàng (scarfWind).
// 3. Tương thích 100% với bộ lọc màu cổ điển (Vintage Manga Filter) ở Intro/Outro của recorder.js & Preview của main.js.
// ==========================================

window.DanceEngine = {
    currentP1Dance: "dance_apt",
    currentP2Dance: "dance_slickback",
    currentWinDance: "dance_siuuuu",

    // Danh sách 34 điệu nhảy chính dùng cho Intro / Outro / Menu Preview
    danceList: [
        // --- HOT TREND TIKTOK & VIRAL ---
        "dance_apt",                // 1. Vũ điệu APT. (Rosé & Bruno Mars - Chồng tay lắc đầu)
        "dance_slickback",          // 2. Jubi Slide / Slickback (Trượt chân lơ lửng không chạm đất)
        "dance_mua_quat",           // 3. Múa Quạt Khá Bảnh (Cuộn cổ tay + nhún gối sâu)
        "dance_california_gurls",   // 4. Lethal Company / California Gurls (Lắc hông vỗ tay trên đầu)
        "dance_wednesday",          // 5. Điệu nhảy Wednesday Addams
        "dance_hakari",             // 6. Vũ điệu Hakari (Lắc hông vẩy tay cao)
        "dance_griddy",             // 7. Điệu nhảy The Griddy (Dậm chân sáo + mắt kính)
        "dance_orange_justice",     // 8. Múa quạt Fortnite Orange Justice
        "dance_twerk",              // 9. Ngoáy mông khiêu khích
        "dance_billy_bounce",       // 10. Bước nhảy lò xo dẻo toàn thân
        "dance_hype_shoot",         // 11. Shoot Dance (Nhảy lò cò 1 chân vung tay cùng nhịp)
        "dance_shuffle_melbourne",  // 12. Trượt chân Melbourne Shuffle tốc độ cao

        // --- ANIME & GAME MEMES ---
        "dance_luffy_gear5",        // 13. Luffy Gear 5 (Nhảy nhịp trống Nika giải phóng)
        "dance_gojo_backbend",      // 14. Gojo Satoru ngửa người uốn dẻo "Duy ngã độc tôn"
        "dance_sukuna_shrine",      // 15. Sukuna Kết Ấn Lãnh Địa ngạo nghễ
        "dance_jojo",               // 16. Vũ điệu JoJo uốn người tạo dáng
        "dance_take_the_l",         // 17. Fortnite Take The L (Tay chữ L trên trán + đá chân 2 bên)
        "dance_kazotsky_kick",      // 18. Điệu nhảy Cossack Nga (Khoanh tay ngồi xổm đá chân liên hoàn)
        "dance_specialist",         // 19. Persona 4 Specialist Meme
        "dance_yama_split",         // 20. Yujiro Hanma xoạc chân chữ nhất 180 độ sát đất
        "dance_praise_the_sun",     // 21. Dark Souls Praise The Sun \o/

        // --- HUYỀN THOẠI & HÀI HƯỚC ---
        "dance_siuuuu",             // 22. Bật nhảy xoay người tiếp đất SIUUUU
        "gangnam_style",            // 23. Nhảy cưỡi ngựa Gangnam Style
        "moonwalk",                 // 24. Trượt lùi Moonwalk Michael Jackson
        "breakdance",               // 25. Xoay người trồng cây chuối Breakdance
        "dance_headspin",           // 26. Cắm đầu xoay 360 độ B-Boy Headspin
        "dance_worm",               // 27. Nhảy Con Sâu (The Worm) uốn sóng dưới đất
        "dance_windmill",           // 28. Đá chân Shuffle & Chốt dáng DAB
        "dance_macarena",           // 29. Vũ điệu Macarena kinh điển
        "dance_ymca",               // 30. Vũ điệu Y-M-C-A
        "dance_shadow_boxing",      // 31. Đấm gió Mike Tyson Peek-a-Boo
        "dance_thai_cuc_quyen",     // 32. Múa Thái Cực Quyền dưỡng sinh trêu ngươi
        "dance_sad_violin",         // 33. Kéo đàn Violin buồn tiễn đối thủ
        "dance_cung_hy"             // 34. Chắp tay xin lì xì / Chúc Tết cà khịa
    ],

    // Danh sách toàn bộ 52 trạng thái biểu cảm do dances.js quản lý
    allExpressiveStates: new Set([
        "dance_apt", "dance_slickback", "dance_mua_quat", "dance_california_gurls",
        "dance_wednesday", "dance_hakari", "dance_griddy", "dance_orange_justice",
        "dance_twerk", "dance_billy_bounce", "dance_hype_shoot", "dance_shuffle_melbourne",
        "dance_luffy_gear5", "dance_gojo_backbend", "dance_sukuna_shrine", "dance_jojo",
        "dance_take_the_l", "dance_kazotsky_kick", "dance_specialist", "dance_yama_split",
        "dance_praise_the_sun", "dance_siuuuu", "gangnam_style", "moonwalk", "breakdance",
        "dance_headspin", "dance_worm", "dance_windmill", "dance_macarena", "dance_ymca",
        "dance_shadow_boxing", "dance_thai_cuc_quyen", "dance_sad_violin", "dance_cung_hy",
        "taunt_crane", "taunt_power", "taunt_dance", "taunt_point", "taunt_flex",
        "t_pose", "dab", "floss", "siuuuu", "smooth_criminal", "salt_bae",
        "robot_dance", "zombie", "rickroll", "giorno_pose"
    ]),

    isDanceState: function(state) {
        if (typeof state !== "string") return false;
        return state.startsWith("dance_") || this.allExpressiveStates.has(state);
    },

    // Bộ trộn bài thông minh giúp mỗi trận ra các điệu nhảy hoàn toàn mới
    _shuffledBag: [],
    _nextFromBag: function() {
        if (!this._shuffledBag || this._shuffledBag.length === 0) {
            this._shuffledBag = this.danceList.slice();
            for (let i = this._shuffledBag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this._shuffledBag[i], this._shuffledBag[j]] = [this._shuffledBag[j], this._shuffledBag[i]];
            }
        }
        return this._shuffledBag.pop();
    },

    pickRandomDances: function() {
        this.currentP1Dance = this._nextFromBag();
        this.currentP2Dance = this._nextFromBag();
        if (this.currentP2Dance === this.currentP1Dance) {
            this.currentP2Dance = this._nextFromBag();
        }
        this.currentWinDance = this._nextFromBag();
    },

    // ==========================================
    // TÍNH TOÁN TỌA ĐỘ 11 KHỚP XƯƠNG CHO 52 ĐIỆU NHẢY, TAUNT & MEME
    // ==========================================
    getSkeletonPose: function(p, baseBounce) {
        let now = Date.now();
        let t = now / 1000;
        let tSlow = now / 150;
        let fastF = now / 50;
        let beat = t * 12;
        let s = Math.sin(beat);
        let c = Math.cos(beat);
        let s2 = Math.sin(beat * 2);
        let bounce = (baseBounce !== undefined && baseBounce > 0) ? baseBounce : Math.abs(s2) * 5;

        let head   = { x: 0,   y: -60 + bounce };
        let neck   = { x: 0,   y: -45 + bounce };
        let pelvis = { x: 0,   y: -20 + bounce };
        let footL  = { x: -15, y: 0 };
        let kneeL  = { x: -10, y: -10 + bounce };
        let footR  = { x: 15,  y: 0 };
        let kneeR  = { x: 10,  y: -10 + bounce };
        let handL  = { x: -15, y: -35 + bounce };
        let elbowL = { x: -10, y: -25 + bounce };
        let handR  = { x: 15,  y: -40 + bounce };
        let elbowR = { x: 5,   y: -30 + bounce };

        p.headTilt = s * 0.16;
        p.scarfWind = s * 4.2;

        let activeState = p.rawMoveState || p.state;

        switch (activeState) {
            // ==========================================
            // PHẦN A: CÁC ĐIỆU NHẢY HOT TREND MỚI NHẤT
            // ==========================================
            case "dance_apt":
                // APT. (Rosé & Bruno Mars): Chồng luân phiên 2 bàn tay trước ngực + lắc đầu cực đáng yêu
                let aptStep = Math.floor(beat * 0.8) % 4;
                let aptHeadSway = Math.sin(beat * 1.2);
                pelvis.x = aptHeadSway * 7;
                pelvis.y = -19 + bounce;
                neck.x = -aptHeadSway * 4;
                head.x = -aptHeadSway * 10;
                head.y = -59 + bounce;
                p.headTilt = -aptHeadSway * 0.35;

                let stackH1 = -36 - (aptStep % 2) * 12;
                let stackH2 = -36 - ((aptStep + 1) % 2) * 12;
                elbowL = { x: -20, y: -36 + bounce * 0.5 };
                handL  = { x: 8,   y: stackH1 + bounce * 0.5 };
                elbowR = { x: 22,  y: -36 + bounce * 0.5 };
                handR  = { x: 8,   y: stackH2 + bounce * 0.5 };

                kneeL = { x: -12 + aptHeadSway * 6, y: -10 };
                footL = { x: -16, y: aptHeadSway > 0 ? -6 : 0 };
                kneeR = { x: 12 + aptHeadSway * 6,  y: -10 };
                footR = { x: 16,  y: aptHeadSway <= 0 ? -6 : 0 };
                break;

            case "dance_slickback":
                // Jubi Slide / Slickback: Trượt chân lơ lửng trên không siêu mượt
                let glide = Math.sin(beat * 0.9);
                let glideCos = Math.cos(beat * 0.9);
                let floatOffset = -4 + Math.abs(s2) * 2;
                pelvis = { x: glide * 16, y: -22 + floatOffset };
                neck   = { x: glide * 12 + 4, y: -46 + floatOffset };
                head   = { x: glide * 10 + 6, y: -60 + floatOffset };
                p.headTilt = glide * 0.18;

                elbowL = { x: pelvis.x - 16 - glideCos * 10, y: -34 };
                handL  = { x: pelvis.x - 24 - glideCos * 18, y: -22 };
                elbowR = { x: pelvis.x + 16 + glideCos * 10, y: -34 };
                handR  = { x: pelvis.x + 24 + glideCos * 18, y: -22 };

                // Hai đầu gối co cao thay phiên nhau bước trên không
                kneeL = { x: pelvis.x - 8 + glideCos * 20, y: -16 - Math.max(0, glideCos) * 12 };
                footL = { x: pelvis.x - 12 + glideCos * 28, y: -4 - Math.max(0, glideCos) * 14 };
                kneeR = { x: pelvis.x + 8 - glideCos * 20, y: -16 - Math.max(0, -glideCos) * 12 };
                footR = { x: pelvis.x + 12 - glideCos * 28, y: -4 - Math.max(0, -glideCos) * 14 };
                break;

            case "dance_mua_quat":
                // Múa Quạt Khá Bảnh: Nhún gối sâu + hai tay cuộn tròn như cánh quạt hai bên
                let fanSpin = t * 16;
                let squat = Math.abs(s) * 9;
                pelvis = { x: s * 8, y: -16 + squat };
                neck   = { x: -s * 4, y: -41 + squat };
                head   = { x: -s * 6, y: -56 + squat };
                p.headTilt = Math.sin(t * 8) * 0.25;

                elbowL = { x: -24, y: -38 + squat };
                handL  = { x: -34 + Math.cos(fanSpin) * 12, y: -42 + Math.sin(fanSpin) * 12 + squat };
                elbowR = { x: 24,  y: -38 + squat };
                handR  = { x: 34 + Math.cos(-fanSpin) * 12, y: -42 + Math.sin(-fanSpin) * 12 + squat };

                kneeL = { x: -20 + s * 6, y: -10 + squat * 0.5 };
                footL = { x: -22, y: 0 };
                kneeR = { x: 20 + s * 6,  y: -10 + squat * 0.5 };
                footR = { x: 22,  y: 0 };
                break;

            case "dance_california_gurls":
                // Lethal Company / California Gurls: Hai tay đan trên đỉnh đầu + đánh hông mạnh sang 2 bên
                let hipSway = Math.sin(beat * 1.1) * 16;
                pelvis = { x: hipSway, y: -19 + bounce };
                neck   = { x: -hipSway * 0.3, y: -44 + bounce };
                head   = { x: -hipSway * 0.5, y: -59 + bounce };
                p.headTilt = hipSway * 0.02;

                elbowL = { x: -22 - hipSway * 0.3, y: -58 + bounce };
                handL  = { x: -6 - hipSway * 0.4,  y: -76 + bounce };
                elbowR = { x: 22 - hipSway * 0.3,  y: -58 + bounce };
                handR  = { x: 6 - hipSway * 0.4,   y: -76 + bounce };

                kneeL = { x: -12 + hipSway * 0.6, y: -10 };
                footL = { x: -16, y: hipSway > 0 ? -5 : 0 };
                kneeR = { x: 12 + hipSway * 0.6,  y: -10 };
                footR = { x: 16,  y: hipSway < 0 ? -5 : 0 };
                break;

            case "dance_wednesday":
                // Điệu nhảy Wednesday Addams: Tay vẫy lên xuống đối xứng + mặt lạnh lùng nghiêng nhẹ
                let wedBeat = Math.sin(beat * 0.85);
                pelvis = { x: wedBeat * 6, y: -20 + bounce * 0.5 };
                neck   = { x: 0, y: -45 };
                head   = { x: -wedBeat * 5, y: -60 };
                p.headTilt = -wedBeat * 0.22;

                if (wedBeat > 0) {
                    elbowL = { x: -16, y: -48 }; handL = { x: -28, y: -64 + s2 * 6 };
                    elbowR = { x: 16,  y: -32 }; handR = { x: 26,  y: -18 - s2 * 6 };
                } else {
                    elbowL = { x: -16, y: -32 }; handL = { x: -26, y: -18 + s2 * 6 };
                    elbowR = { x: 16,  y: -48 }; handR = { x: 28,  y: -64 - s2 * 6 };
                }
                kneeL = { x: -12 + wedBeat * 6, y: -10 };
                kneeR = { x: 12 + wedBeat * 6,  y: -10 };
                break;

            case "dance_luffy_gear5":
                // Luffy Gear 5 (Nika): Nhảy bật cao trên không, ưỡn bụng cười / che mặt cười sảng khoái
                let nikaHop = Math.abs(Math.sin(beat * 0.85)) * 24;
                let nikaLean = Math.cos(beat * 0.85) * 12;
                pelvis = { x: 8 + nikaLean * 0.5, y: -20 - nikaHop };
                neck   = { x: -4 - nikaLean * 0.4, y: -44 - nikaHop };
                head   = { x: -10 - nikaLean * 0.6, y: -58 - nikaHop };
                p.headTilt = -0.35 + Math.sin(fastF) * 0.12;

                // Tay trái che trán cười, tay phải ôm bụng
                elbowL = { x: -18, y: -56 - nikaHop };
                handL  = { x: -6,  y: -64 - nikaHop };
                elbowR = { x: 20,  y: -32 - nikaHop };
                handR  = { x: 10,  y: -22 - nikaHop };

                kneeL = { x: -18, y: -14 - nikaHop * 1.1 };
                footL = { x: -12, y: -2 - nikaHop * 1.2 };
                kneeR = { x: 22,  y: -18 - nikaHop * 1.2 };
                footR = { x: 16,  y: -6 - nikaHop * 1.3 };
                break;

            case "dance_gojo_backbend":
                // Gojo Satoru lơ lửng ngửa người uốn dẻo chỉ tay lên trời "Thiên thượng thiên hạ duy ngã độc tôn"
                let gojoFloat = Math.sin(t * 4) * 8;
                pelvis = { x: 14,  y: -28 + gojoFloat };
                neck   = { x: -8,  y: -44 + gojoFloat };
                head   = { x: -22, y: -50 + gojoFloat };
                p.headTilt = -0.75;

                elbowR = { x: 6,   y: -62 + gojoFloat };
                handR  = { x: 12,  y: -86 + gojoFloat + Math.sin(t * 8) * 3 };
                elbowL = { x: -14, y: -32 + gojoFloat };
                handL  = { x: -24, y: -18 + gojoFloat };

                kneeL = { x: -4,  y: -14 + gojoFloat };
                footL = { x: -14, y: -2 + gojoFloat };
                kneeR = { x: 24,  y: -16 + gojoFloat };
                footR = { x: 18,  y: -4 + gojoFloat };
                break;

            case "dance_sukuna_shrine":
                // Sukuna Kết Ấn Phục Ma Ngự Tr厨 Tử + Lắc đầu cười khinh bỉ
                let sukunaPulse = Math.sin(t * 6) * 2;
                pelvis = { x: 0, y: -15 };
                neck   = { x: 0, y: -41 };
                head   = { x: sukunaPulse, y: -57 };
                p.headTilt = 0.22 + Math.sin(t * 4) * 0.08;

                // Hai bàn tay chắp ấn trước ngực
                elbowL = { x: -22, y: -36 };
                handL  = { x: -2,  y: -44 + sukunaPulse };
                elbowR = { x: 22,  y: -36 };
                handR  = { x: 2,   y: -44 + sukunaPulse };

                // Tư thế đứng tấn rộng uy nghiêm
                kneeL = { x: -22, y: -10 }; footL = { x: -26, y: 0 };
                kneeR = { x: 22,  y: -10 }; footR = { x: 26,  y: 0 };
                break;

            case "dance_take_the_l":
                // Fortnite Take The L: Tay phải giơ chữ L trên trán, 2 chân đá văng sang 2 bên
                let lKick = Math.sin(beat * 1.15);
                let lHop = Math.abs(Math.cos(beat * 1.15)) * 7;
                pelvis = { x: -lKick * 8, y: -18 - lHop };
                neck   = { x: lKick * 4,  y: -43 - lHop };
                head   = { x: lKick * 6,  y: -58 - lHop };
                p.headTilt = lKick * 0.22;

                // Tay phải đặt chữ L ngay trên trán, tay trái chống hông
                elbowR = { x: 22, y: -50 - lHop };
                handR  = { x: head.x + 4, y: head.y - 8 };
                elbowL = { x: -20, y: -30 - lHop };
                handL  = { x: -10, y: -20 - lHop };

                if (lKick > 0) {
                    kneeL = { x: -20 - lKick * 12, y: -12 };
                    footL = { x: -34 - lKick * 16, y: -10 };
                    kneeR = { x: 8, y: -10 };
                    footR = { x: 10, y: 0 };
                } else {
                    kneeL = { x: -8, y: -10 };
                    footL = { x: -10, y: 0 };
                    kneeR = { x: 20 - lKick * 12, y: -12 };
                    footR = { x: 34 - lKick * 16, y: -10 };
                }
                break;

            case "dance_kazotsky_kick":
                // Điệu nhảy Cossack Nga (TF2): Ngồi xổm thấp, khoanh tay trước ngực, đá tung chân liên hoàn
                let kazKick = Math.sin(beat * 1.3);
                let kazBounce = Math.abs(Math.cos(beat * 1.3)) * 5;
                pelvis = { x: -4, y: -10 + kazBounce };
                neck   = { x: 0,  y: -32 + kazBounce };
                head   = { x: 2,  y: -46 + kazBounce };
                p.headTilt = kazKick * 0.15;

                // Hai tay khoanh ngang trước ngực
                elbowL = { x: -20, y: -26 + kazBounce }; handL = { x: 10,  y: -26 + kazBounce };
                elbowR = { x: 20,  y: -26 + kazBounce }; handR = { x: -10, y: -26 + kazBounce };

                if (kazKick > 0) {
                    kneeL = { x: -14, y: -6 };  footL = { x: -10, y: 0 };
                    kneeR = { x: 18,  y: -10 }; footR = { x: 42 * kazKick + 12, y: -8 * kazKick };
                } else {
                    kneeR = { x: 14,  y: -6 };  footR = { x: 10, y: 0 };
                    kneeL = { x: -18, y: -10 }; footL = { x: 42 * (-kazKick) + 12, y: -8 * (-kazKick) };
                }
                break;

            case "dance_specialist":
                // Persona 4 Specialist Meme: Bước trượt ngang kết hợp chỉ tay tạo dáng cực ngầu
                let specPhase = Math.sin(beat * 0.8);
                pelvis = { x: -specPhase * 12, y: -18 + bounce };
                neck   = { x: specPhase * 8,   y: -43 + bounce };
                head   = { x: specPhase * 12,  y: -58 + bounce };
                p.headTilt = specPhase * 0.25;

                elbowL = { x: -22, y: -38 };
                handL  = { x: -34, y: -24 + specPhase * 16 };
                elbowR = { x: 24,  y: -46 };
                handR  = { x: 42,  y: -58 - specPhase * 12 };

                kneeL = { x: -16 + specPhase * 10, y: -10 };
                footL = { x: -24 + specPhase * 14, y: 0 };
                kneeR = { x: 16 + specPhase * 10,  y: -10 };
                footR = { x: 24 + specPhase * 14,  y: 0 };
                break;

            case "dance_yama_split":
                // Yujiro Hanma Xoạc Chân Chữ Nhất 180 độ sát đất + Gồng cơ tay đôi
                let splitPulse = Math.abs(Math.sin(t * 6)) * 3;
                pelvis = { x: 0, y: -4 + splitPulse };
                neck   = { x: 0, y: -28 + splitPulse };
                head   = { x: 0, y: -43 + splitPulse };
                p.headTilt = Math.sin(t * 4) * 0.12;

                elbowL = { x: -26, y: -28 + splitPulse }; handL = { x: -18, y: -44 + splitPulse };
                elbowR = { x: 26,  y: -28 + splitPulse }; handR = { x: 18,  y: -44 + splitPulse };

                kneeL = { x: -22, y: -2 }; footL = { x: -44, y: 0 };
                kneeR = { x: 22,  y: -2 }; footR = { x: 44,  y: 0 };
                break;

            case "dance_praise_the_sun":
                // Dark Souls Praise The Sun \o/
                let sunGlow = Math.sin(t * 5) * 2;
                pelvis = { x: 0, y: -20 };
                neck   = { x: 0, y: -46 };
                head   = { x: 0, y: -62 + sunGlow };
                p.headTilt = -0.35;

                elbowL = { x: -18, y: -58 }; handL = { x: -34, y: -78 + sunGlow };
                elbowR = { x: 18,  y: -58 }; handR = { x: 34,  y: -78 + sunGlow };
                footL  = { x: -14, y: 0 };   footR = { x: 14,  y: 0 };
                break;

            case "dance_worm":
                // Nhảy Con Sâu (The Worm): Uốn sóng toàn thân nằm ngang sát mặt đất
                let wWave1 = Math.sin(beat * 1.3);
                let wWave2 = Math.sin(beat * 1.3 - 1.2);
                let wWave3 = Math.sin(beat * 1.3 - 2.4);
                let wWave4 = Math.sin(beat * 1.3 - 3.6);

                head   = { x: 32,  y: -14 - Math.max(0, wWave1) * 16 };
                neck   = { x: 18,  y: -12 - Math.max(0, wWave1) * 14 };
                pelvis = { x: -4,  y: -10 - Math.max(0, wWave2) * 16 };
                kneeL  = { x: -22, y: -8  - Math.max(0, wWave3) * 14 };
                kneeR  = { x: -22, y: -8  - Math.max(0, wWave3) * 14 };
                footL  = { x: -40, y: -4  - Math.max(0, wWave4) * 14 };
                footR  = { x: -40, y: -4  - Math.max(0, wWave4) * 14 };

                elbowL = { x: 14, y: -4 }; handL = { x: 22, y: 0 };
                elbowR = { x: 18, y: -4 }; handR = { x: 26, y: 0 };
                p.headTilt = 0.45 - wWave1 * 0.25;
                break;

            case "dance_headspin":
                // B-Boy Headspin: Cắm đầu xuống đất xoay chân chữ V tốc độ cao
                let hSpin = fastF * 2.4;
                head   = { x: 0, y: -8 };
                neck   = { x: 0, y: -18 };
                pelvis = { x: Math.sin(hSpin) * 4, y: -42 };
                p.headTilt = Math.PI;

                elbowL = { x: -16, y: -14 }; handL = { x: -12, y: 0 };
                elbowR = { x: 16,  y: -14 }; handR = { x: 12,  y: 0 };

                kneeL = { x: Math.cos(hSpin) * 18, y: -54 };
                footL = { x: Math.cos(hSpin) * 34, y: -68 + Math.sin(hSpin) * 8 };
                kneeR = { x: Math.cos(hSpin + Math.PI) * 18, y: -54 };
                footR = { x: Math.cos(hSpin + Math.PI) * 34, y: -68 + Math.sin(hSpin + Math.PI) * 8 };
                break;

            case "dance_hype_shoot":
                // Shoot Dance (BlocBoy JB): Nhảy lò cò 1 chân, chân phải và tay phải vung cùng nhịp về phía trước
                let shootKick = Math.max(0, Math.sin(beat * 1.1));
                let shootHop = Math.abs(Math.cos(beat * 1.1)) * 6;
                pelvis = { x: -shootKick * 8, y: -20 - shootHop };
                neck   = { x: -shootKick * 4, y: -45 - shootHop };
                head   = { x: 4, y: -60 - shootHop };
                p.headTilt = shootKick * 0.22;

                elbowR = { x: 14, y: -32 - shootHop };
                handR  = { x: 12 + shootKick * 28, y: -16 - shootKick * 24 };
                elbowL = { x: -18, y: -46 - shootHop };
                handL  = { x: -12, y: -60 - shootHop };

                kneeL = { x: -12, y: -10 - shootHop };
                footL = { x: -14, y: -shootHop };
                kneeR = { x: 12 + shootKick * 16, y: -14 - shootKick * 10 };
                footR = { x: 10 + shootKick * 32, y: -4 - shootKick * 16 };
                break;

            case "dance_shuffle_melbourne":
                // Melbourne Shuffle trượt chân tốc độ cao
                let shufFast = Math.sin(t * 18);
                let shufCos = Math.cos(t * 18);
                pelvis = { x: shufFast * 10, y: -19 + Math.abs(shufCos) * 5 };
                neck   = { x: 4, y: -44 };
                head   = { x: 6, y: -59 };
                p.headTilt = shufFast * 0.15;

                elbowL = { x: -18, y: -34 }; handL = { x: -24 + shufFast * 14, y: -22 };
                elbowR = { x: 18,  y: -34 }; handR = { x: 24 - shufFast * 14,  y: -22 };

                kneeL = { x: -10 + shufFast * 18, y: -12 };
                footL = { x: -14 + shufFast * 28, y: shufCos > 0 ? -8 : 0 };
                kneeR = { x: 10 - shufFast * 18,  y: -12 };
                footR = { x: 14 - shufFast * 28,  y: shufCos <= 0 ? -8 : 0 };
                break;

            case "dance_macarena":
                // Vũ điệu Macarena 4 nhịp: Đưa tay trước -> Đặt lên đầu -> Đặt lên hông -> Lắc vòng hông
                let macPhase = Math.floor(t * 2.5) % 4;
                pelvis = { x: (macPhase === 3 ? s * 16 : s * 4), y: -20 + bounce * 0.6 };
                head.y = -60 + bounce * 0.6;
                if (macPhase === 0) {
                    elbowL = { x: -16, y: -40 }; handL = { x: 24, y: -42 };
                    elbowR = { x: 16,  y: -40 }; handR = { x: 28, y: -42 };
                } else if (macPhase === 1) {
                    elbowL = { x: -24, y: -56 }; handL = { x: -8, y: -64 };
                    elbowR = { x: 24,  y: -56 }; handR = { x: 8,  y: -64 };
                } else {
                    elbowL = { x: -22, y: -32 }; handL = { x: pelvis.x - 10, y: -20 };
                    elbowR = { x: 22,  y: -32 }; handR = { x: pelvis.x + 10, y: -20 };
                }
                break;

            case "dance_ymca":
                // Vũ điệu Y-M-C-A
                let ymcaStep = Math.floor(t * 2.2) % 4;
                pelvis.y = -20 + bounce;
                head.y = -60 + bounce;
                if (ymcaStep === 0) { // Chữ Y
                    elbowL = { x: -20, y: -58 }; handL = { x: -34, y: -78 };
                    elbowR = { x: 20,  y: -58 }; handR = { x: 34,  y: -78 };
                } else if (ymcaStep === 1) { // Chữ M
                    elbowL = { x: -26, y: -62 }; handL = { x: -6, y: -52 };
                    elbowR = { x: 26,  y: -62 }; handR = { x: 6,  y: -52 };
                } else if (ymcaStep === 2) { // Chữ C
                    elbowL = { x: -14, y: -64 }; handL = { x: 22, y: -72 };
                    elbowR = { x: 14,  y: -30 }; handR = { x: 22, y: -22 };
                } else { // Chữ A
                    elbowL = { x: -18, y: -58 }; handL = { x: 0, y: -78 };
                    elbowR = { x: 18,  y: -58 }; handR = { x: 0, y: -78 };
                }
                break;

            case "dance_shadow_boxing":
                // Đấm gió Mike Tyson Peek-a-Boo: Lắc đầu né đòn chữ U + đấm móc tốc độ cao
                let bobWeave = Math.sin(beat * 1.4);
                let bobDrop = Math.abs(Math.cos(beat * 1.4)) * 8;
                pelvis = { x: bobWeave * 6,  y: -18 + bobDrop };
                neck   = { x: bobWeave * 12, y: -42 + bobDrop };
                head   = { x: bobWeave * 16, y: -56 + bobDrop };
                p.headTilt = bobWeave * 0.25;

                let jabPunch = Math.sin(fastF * 2.4);
                elbowL = { x: 8,  y: -36 + bobDrop };
                handL  = { x: 18 + Math.max(0, jabPunch) * 28, y: -48 + bobDrop };
                elbowR = { x: 12, y: -36 + bobDrop };
                handR  = { x: 20 + Math.max(0, -jabPunch) * 28, y: -46 + bobDrop };

                kneeL = { x: -14, y: -10 }; footL = { x: -18, y: 0 };
                kneeR = { x: 16,  y: -10 }; footR = { x: 20,  y: 0 };
                break;

            case "dance_thai_cuc_quyen":
                // Thái Cực Quyền dưỡng sinh chậm rãi trêu ngươi đối thủ
                let taiChi = Math.sin(t * 3.2);
                let taiChiCos = Math.cos(t * 3.2);
                pelvis = { x: taiChi * 6, y: -15 };
                neck   = { x: taiChi * 4, y: -40 };
                head   = { x: taiChi * 4, y: -56 };
                p.headTilt = taiChi * 0.08;

                elbowL = { x: -14 + taiChi * 10, y: -34 + taiChiCos * 8 };
                handL  = { x: 6 + taiChi * 22,   y: -38 + taiChiCos * 14 };
                elbowR = { x: 14 - taiChi * 10,  y: -34 - taiChiCos * 8 };
                handR  = { x: 18 - taiChi * 22,  y: -38 - taiChiCos * 14 };

                kneeL = { x: -20, y: -10 }; footL = { x: -22, y: 0 };
                kneeR = { x: 20,  y: -10 }; footR = { x: 22,  y: 0 };
                break;

            case "dance_sad_violin":
                // Kéo đàn Violin buồn tiễn đối thủ
                let bowMove = Math.sin(fastF * 1.4) * 14;
                pelvis = { x: 0, y: -20 };
                neck   = { x: 2, y: -45 };
                head   = { x: 6, y: -58 };
                p.headTilt = 0.28;

                // Tay trái giữ cần đàn, tay phải kéo vĩ đàn qua lại
                elbowL = { x: 12, y: -38 }; handL = { x: 28, y: -48 };
                elbowR = { x: 18, y: -36 }; handR = { x: 14 + bowMove, y: -44 + bowMove * 0.3 };
                break;

            case "dance_cung_hy":
                // Chắp tay xin lì xì / chúc Tết cà khịa
                let bowShake = Math.sin(beat * 1.5) * 8;
                pelvis = { x: -4, y: -18 + bounce };
                neck   = { x: 6,  y: -42 + bounce };
                head   = { x: 10, y: -56 + bounce };
                p.headTilt = 0.2 + Math.sin(beat) * 0.12;

                elbowL = { x: -12, y: -32 };
                handL  = { x: 18,  y: -42 + bowShake };
                elbowR = { x: 16,  y: -32 };
                handR  = { x: 20,  y: -42 + bowShake };
                break;

            // ==========================================
            // PHẦN B: CÁC ĐIỆU NHẢY & TAUNT KINH ĐIỂN
            // ==========================================
            case "dance_hakari":
            case "taunt_dance":
                pelvis.x = s * 14;
                pelvis.y = -20 + bounce;
                neck.x = -s * 5;
                head.x = -s * 8;
                head.y = -60 + bounce;
                p.headTilt = s * 0.28;

                elbowL = { x: -20 - s * 5, y: -48 + c * 4 };
                handL  = { x: -28 + s2 * 10, y: -68 + Math.abs(c) * 8 };
                elbowR = { x: 20 - s * 5,  y: -48 - c * 4 };
                handR  = { x: 28 + s2 * 10,  y: -68 + Math.abs(s) * 8 };

                kneeL = { x: -14 + s * 8, y: -12 + bounce };
                footL = { x: -18 + Math.max(0, s) * 10, y: -Math.max(0, s) * 12 };
                kneeR = { x: 14 + s * 8,  y: -12 + bounce };
                footR = { x: 18 + Math.min(0, s) * 10,  y: -Math.max(0, -s) * 12 };
                break;

            case "dance_griddy":
                let griddyPhase = Math.sin(beat * 0.5);
                pelvis.x = -4;
                pelvis.y = -18 + bounce * 1.2;
                neck.x = 8;
                head.x = 12;
                head.y = -56 + bounce * 1.2;
                p.headTilt = 0.15 + s * 0.15;

                if (griddyPhase > 0) {
                    elbowL = { x: -12, y: -38 + bounce };
                    handL  = { x: 8,   y: -58 + bounce };
                    elbowR = { x: 22,  y: -38 + bounce };
                    handR  = { x: 16,  y: -58 + bounce };
                } else {
                    let armSwing = s * 28;
                    elbowL = { x: -8 + armSwing * 0.5, y: -30 };
                    handL  = { x: -15 + armSwing,      y: -18 };
                    elbowR = { x: 8 + armSwing * 0.5,  y: -30 };
                    handR  = { x: 15 + armSwing,       y: -18 };
                }

                kneeL = { x: -8 + s * 14, y: -12 };
                footL = { x: -12 + s * 22, y: s > 0 ? -10 : 0 };
                kneeR = { x: 8 - s * 14,  y: -12 };
                footR = { x: 12 - s * 22,  y: s < 0 ? -10 : 0 };
                break;

            case "dance_orange_justice":
                let swing = Math.sin(beat * 1.1);
                pelvis.x = swing * 12;
                pelvis.y = -18 + bounce * 1.4;
                neck.x = -swing * 6;
                head.x = -swing * 10;
                head.y = -58 + bounce * 1.4;
                p.headTilt = -swing * 0.3;

                elbowL = { x: -18 + swing * 15, y: -35 - swing * 15 };
                handL  = { x: -10 + swing * 35, y: -38 - swing * 38 };
                elbowR = { x: 18 + swing * 15,  y: -35 + swing * 15 };
                handR  = { x: 10 + swing * 35,  y: -38 + swing * 38 };

                let kneeSpread = Math.cos(beat * 2.2) * 16;
                kneeL = { x: -14 + kneeSpread, y: -10 };
                footL = { x: -18, y: 0 };
                kneeR = { x: 14 - kneeSpread,  y: -10 };
                footR = { x: 18,  y: 0 };
                break;

            case "dance_twerk":
                let twerk = Math.sin(beat * 2.5);
                pelvis.x = -18 + twerk * 7;
                pelvis.y = -22 + Math.abs(twerk) * 12;
                neck.x = 12;
                neck.y = -38 + twerk * 3;
                head.x = 20;
                head.y = -52 + twerk * 4;
                p.headTilt = -0.25 + twerk * 0.15;

                elbowL = { x: 2,  y: -25 }; handL = { x: 8,  y: -10 };
                elbowR = { x: 16, y: -25 }; handR = { x: 16, y: -10 };
                kneeL  = { x: -12, y: -10 }; footL = { x: -18, y: 0 };
                kneeR  = { x: 14,  y: -10 }; footR = { x: 16,  y: 0 };
                break;

            case "dance_billy_bounce":
                let wave = Math.sin(beat);
                let waveLag = Math.sin(beat - 1.2);
                pelvis.x = wave * 10;
                pelvis.y = -18 + bounce * 1.3;
                neck.x = waveLag * 10;
                head.x = wave * 8;
                head.y = -58 + bounce * 1.3;
                p.headTilt = waveLag * 0.25;

                elbowL = { x: -22, y: -35 + wave * 10 };
                handL  = { x: -32 + waveLag * 12, y: -22 - wave * 14 };
                elbowR = { x: 22,  y: -35 - wave * 10 };
                handR  = { x: 32 + waveLag * 12,  y: -22 + wave * 14 };

                kneeL = { x: -12 + wave * 10, y: -12 };
                footL = { x: -16 + waveLag * 14, y: wave > 0 ? -12 : 0 };
                kneeR = { x: 12 + wave * 10,  y: -12 };
                footR = { x: 16 + waveLag * 14,  y: wave <= 0 ? -12 : 0 };
                break;

            case "dance_windmill":
                let cycle = (t % 1.5) / 1.5;
                if (cycle < 0.65) {
                    let shuf = Math.sin(t * 20);
                    pelvis.x = shuf * 8;
                    pelvis.y = -20 + Math.abs(shuf) * 8;
                    head.x = -shuf * 6;
                    p.headTilt = shuf * 0.2;

                    elbowL = { x: -20, y: -35 }; handL = { x: -28, y: -50 + shuf * 15 };
                    elbowR = { x: 20,  y: -35 }; handR = { x: 28,  y: -50 - shuf * 15 };

                    kneeL = { x: -12 + shuf * 18, y: -14 };
                    footL = { x: -18 + shuf * 28, y: shuf > 0 ? -12 : 0 };
                    kneeR = { x: 12 - shuf * 18,  y: -14 };
                    footR = { x: 18 - shuf * 28,  y: shuf < 0 ? -12 : 0 };
                } else {
                    pelvis = { x: -5, y: -16 };
                    neck   = { x: 10, y: -38 };
                    head   = { x: 18, y: -48 };
                    p.headTilt = 0.48;

                    elbowL = { x: -22, y: -52 }; handL = { x: -48, y: -72 };
                    elbowR = { x: 28,  y: -48 }; handR = { x: 2,   y: -54 };
                    kneeL  = { x: -16, y: -10 }; footL = { x: -24, y: 0 };
                    kneeR  = { x: 18,  y: -10 }; footR = { x: 24,  y: 0 };
                }
                break;

            case "dance_jojo":
            case "giorno_pose":
                let poseSwitch = Math.sin(beat * 0.75);
                pelvis.x = -14 * poseSwitch;
                pelvis.y = -18 + bounce;
                neck.x = 12 * poseSwitch;
                head.x = 6 * poseSwitch;
                head.y = -58 + bounce;
                p.headTilt = -0.32 * poseSwitch;

                elbowL = { x: -24, y: -52 };
                handL  = { x: -5 + poseSwitch * 15, y: -74 };
                elbowR = { x: 26,  y: -35 };
                handR  = { x: 38 * poseSwitch, y: -42 + bounce };

                kneeL = { x: -16, y: -10 }; footL = { x: -20, y: 0 };
                kneeR = { x: 22,  y: -24 + bounce }; footR = { x: 12, y: -16 + bounce };
                break;

            case "dance_siuuuu":
            case "siuuuu":
                let jumpCycle = (t % 1.4) / 1.4;
                if (jumpCycle < 0.45) {
                    let airH = Math.sin((jumpCycle / 0.45) * Math.PI) * 32;
                    pelvis = { x: 0, y: -20 - airH };
                    neck   = { x: 0, y: -45 - airH };
                    head   = { x: 0, y: -60 - airH };
                    p.headTilt = -0.15;

                    elbowL = { x: -15, y: -55 - airH }; handL = { x: -5, y: -70 - airH };
                    elbowR = { x: 15,  y: -55 - airH }; handR = { x: 5,  y: -70 - airH };
                    kneeL  = { x: -12, y: -12 - airH }; footL = { x: -8, y: -2 - airH };
                    kneeR  = { x: 12,  y: -12 - airH }; footR = { x: 8,  y: -2 - airH };
                } else {
                    let shake = Math.sin(t * 35) * 1.5;
                    pelvis = { x: 0, y: -15 };
                    neck   = { x: 0, y: -40 };
                    head   = { x: shake, y: -55 };
                    p.headTilt = shake * 0.08;

                    elbowL = { x: -22, y: -28 }; handL = { x: -34, y: -8 };
                    elbowR = { x: 22,  y: -28 }; handR = { x: 34,  y: -8 };
                    kneeL  = { x: -18, y: -8 };  footL = { x: -24, y: 0 };
                    kneeR  = { x: 18,  y: -8 };  footR = { x: 24,  y: 0 };
                }
                break;

            case "taunt_crane":
                head.y += Math.sin(tSlow) * 2;
                p.headTilt = Math.sin(tSlow) * 0.15;
                footR  = { x: -5,  y: -25 }; kneeR  = { x: 15,  y: -20 };
                footL  = { x: 0,   y: 0 };   kneeL  = { x: -10, y: -10 };
                handL  = { x: -30, y: -60 + Math.sin(tSlow) * 5 }; elbowL = { x: -15, y: -50 };
                handR  = { x: 30,  y: -60 - Math.sin(tSlow) * 5 }; elbowR = { x: 15,  y: -50 };
                break;

            case "taunt_power":
                let pShake = Math.random() * 2 - 1;
                head.x += pShake; head.y = -50 + pShake; pelvis.y = -10;
                p.headTilt = pShake * 0.1;
                footL  = { x: -20, y: 0 };   kneeL  = { x: -25, y: -10 };
                footR  = { x: 20,  y: 0 };   kneeR  = { x: 25,  y: -10 };
                handL  = { x: -15, y: -40 }; elbowL = { x: -25, y: -30 };
                handR  = { x: 15,  y: -40 }; elbowR = { x: 25,  y: -30 };
                break;

            case "taunt_point":
                head.x = 5;
                p.headTilt = 0.1;
                handR  = { x: 35,  y: -40 + Math.sin(tSlow) * 2 }; elbowR = { x: 20,  y: -40 };
                handL  = { x: -10, y: -20 };                       elbowL = { x: -15, y: -30 };
                break;

            case "taunt_flex":
                head.y = -55 + Math.sin(tSlow) * 2; pelvis.y = -20;
                handL  = { x: -20, y: -55 }; elbowL = { x: -30, y: -45 };
                handR  = { x: 20,  y: -55 }; elbowR = { x: 30,  y: -45 };
                break;

            case "t_pose":
                head.y = -60; neck.y = -45; pelvis.y = -20; p.headTilt = 0;
                handL  = { x: -40, y: -45 }; elbowL = { x: -20, y: -45 };
                handR  = { x: 40,  y: -45 }; elbowR = { x: 20,  y: -45 };
                footL  = { x: -15, y: 0 };   footR  = { x: 15,  y: 0 };
                kneeL  = { x: -10, y: -10 }; kneeR  = { x: 10,  y: -10 };
                break;

            case "dab":
                head.x = 15; head.y = -40; neck.x = 5; neck.y = -35; p.headTilt = 0.42;
                handL  = { x: 25,  y: -50 }; elbowL = { x: 10, y: -40 };
                handR  = { x: 45,  y: -60 }; elbowR = { x: 30, y: -50 };
                footL  = { x: -15, y: 0 };   footR  = { x: 20, y: 0 };
                break;

            case "floss":
                let fSwing = Math.sin(fastF) * 20;
                pelvis.x = -fSwing / 2;
                p.headTilt = fSwing * 0.012;
                handL  = { x: -10 + fSwing, y: -20 }; elbowL = { x: -20 + fSwing, y: -30 };
                handR  = { x: 10 + fSwing,  y: -20 }; elbowR = { x: 20 + fSwing,  y: -30 };
                break;

            case "smooth_criminal":
                let lean = 22 + Math.sin(tSlow) * 3;
                pelvis.x = lean; pelvis.y = -15;
                neck.x = lean * 1.9; neck.y = -40;
                head.x = lean * 2.1; head.y = -55;
                p.headTilt = 0.35;
                footL  = { x: -10, y: 0 }; footR = { x: 10, y: 0 };
                kneeL  = { x: lean / 2, y: -10 }; kneeR = { x: 10 + lean / 2, y: -10 };
                handL  = { x: lean * 1.5, y: -20 }; handR = { x: lean * 2, y: -20 };
                break;

            case "salt_bae":
                head.y = -60; p.headTilt = 0.2;
                handL  = { x: -10, y: -40 }; elbowL = { x: -15, y: -30 };
                handR  = { x: 25,  y: -50 + Math.sin(fastF) * 3 }; elbowR = { x: 15, y: -20 };
                break;

            case "gangnam_style":
                let hop = Math.abs(Math.sin(fastF)) * 12;
                let sideStep = Math.sin(tSlow);
                pelvis.x = sideStep * 8; pelvis.y = -20 - hop;
                head.x = sideStep * 6;   head.y = -60 - hop;
                neck.x = sideStep * 6;   neck.y = -45 - hop;
                p.headTilt = sideStep * 0.2;

                handL  = { x: 6,  y: -35 - hop * 0.5 }; elbowL = { x: -14, y: -40 - hop * 0.5 };
                handR  = { x: 18 + Math.cos(fastF * 1.5) * 18, y: -72 - hop + Math.sin(fastF * 1.5) * 8 };
                elbowR = { x: 24, y: -55 - hop * 0.5 };

                footL  = { x: -18, y: sideStep > 0 ? -hop * 1.2 : 0 }; kneeL = { x: -24, y: -15 - hop * 0.5 };
                footR  = { x: 18,  y: sideStep <= 0 ? -hop * 1.2 : 0 }; kneeR = { x: 24,  y: -15 - hop * 0.5 };
                break;

            case "robot_dance":
                let tick = Math.floor(tSlow * 2) % 2 === 0;
                head.y = -60; head.x = tick ? 5 : -5;
                p.headTilt = tick ? 0.18 : -0.18;
                handL  = { x: tick ? -20 : -30, y: tick ? -20 : -40 }; elbowL = { x: -25, y: -30 };
                handR  = { x: tick ? 30 : 20,   y: tick ? -40 : -20 }; elbowR = { x: 25,  y: -30 };
                break;

            case "zombie":
                pelvis.x = 5; head.x = 15; head.y = -55 + bounce * 0.5; neck.x = 10;
                p.headTilt = 0.28;
                handL  = { x: 30, y: -40 + Math.sin(tSlow) * 3 }; elbowL = { x: 20, y: -35 };
                handR  = { x: 35, y: -45 - Math.sin(tSlow) * 3 }; elbowR = { x: 25, y: -40 };
                footL  = { x: -10, y: 0 }; footR = { x: 15, y: 0 }; kneeR = { x: 15, y: -10 };
                break;

            case "rickroll":
                let sway = Math.sin(tSlow) * 12;
                pelvis.x = sway; head.x = sway; head.y = -60 + bounce * 0.5; neck.x = sway;
                p.headTilt = sway * 0.02;
                handL  = { x: sway - 15, y: -50 }; elbowL = { x: sway - 20, y: -40 };
                handR  = { x: sway + 25, y: -20 }; elbowR = { x: sway + 30, y: -30 };
                break;

            case "breakdance":
                let spin = fastF * 1.8;
                pelvis.y = -12; head.y = -2; head.x = -12; neck.y = -6;
                p.headTilt = Math.PI;
                handL  = { x: -6, y: 0 }; handR = { x: 10, y: 0 };
                footL  = { x: Math.cos(spin) * 38, y: -32 + Math.sin(spin) * 18 };
                kneeL  = { x: Math.cos(spin) * 20, y: -20 + Math.sin(spin) * 10 };
                footR  = { x: Math.cos(spin + Math.PI) * 38, y: -32 + Math.sin(spin + Math.PI) * 18 };
                kneeR  = { x: Math.cos(spin + Math.PI) * 20, y: -20 + Math.sin(spin + Math.PI) * 10 };
                break;

            case "moonwalk":
                head.y = -62 + Math.cos(tSlow) * 2;
                neck.y = -48 + Math.cos(tSlow) * 2;
                p.headTilt = -0.18;
                let slide = Math.sin(tSlow);
                if (slide > 0) {
                    footL = { x: -20 + slide * 22, y: 0 };  kneeL = { x: -10 + slide * 10, y: -10 };
                    footR = { x: 20 - slide * 22,  y: -6 }; kneeR = { x: 15 - slide * 10,  y: -20 };
                } else {
                    footL = { x: -20 - slide * 22, y: -6 }; kneeL = { x: -10 - slide * 10, y: -20 };
                    footR = { x: 20 + slide * 22,  y: 0 };  kneeR = { x: 15 + slide * 10,  y: -10 };
                }
                handL = { x: -15, y: -30 + Math.sin(tSlow) * 6 }; elbowL = { x: -10, y: -40 };
                handR = { x: 15,  y: -30 - Math.sin(tSlow) * 6 }; elbowR = { x: 10,  y: -40 };
                break;
        }

        return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    },

    // ==========================================
    // HÀM VẼ VŨ CÔNG TRỰC TIẾP QUA WINDOW.DRAWSTICKMAN
    // (Không ghi đè ctx.filter để giữ nguyên màu cổ điển ít màu ở Intro/Outro của recorder.js)
    // ==========================================
    drawDancer: function(ctx, charObj, cx, cy, isFacingRight, scaleOverride, danceId) {
        if (!charObj || typeof window.drawStickman !== 'function') return;
        let activeDance = (danceId && this.isDanceState(danceId)) ? danceId : "dance_apt";

        let clone = Object.assign({}, charObj, {
            x: cx,
            y: cy,
            scale: scaleOverride || 3.5,
            isFacingRight: isFacingRight !== false,
            state: activeDance,
            onGround: true,
            hideHpBar: true,
            hasEngineShadow: false,
            scarfNodes: charObj._danceScarfNodes,
            currentSkeleton: charObj._danceSkeleton
        });

        window.drawStickman(ctx, clone, false);

        charObj._danceScarfNodes = clone.scarfNodes;
        charObj._danceSkeleton = clone.currentSkeleton;
    }
};
