// ==========================================
// DANCES.JS - TRẠM VŨ ĐẠO, HOT TREND TIKTOK, ANIME MEME & TAUNT (V12.0 ULTRA MEGA 118+ COLLECTION)
// ĐẢM NHIỆM 100%:
// 1. Sở hữu 118 Điệu nhảy & Biểu cảm (Giữ nguyên 100% các điệu nhảy cũ + Thêm 66 điệu nhảy hài hước, viral mới).
// 2. Điều khiển trực tiếp 11 khớp xương, độ nghiêng đầu (headTilt), gió khăn choàng (scarfWind) & Đạo cụ vui nhộn (drawDanceProps).
// 3. Tương thích 100% với bộ lọc màu cổ điển (Vintage Manga Filter) ở Intro/Outro của recorder.js & Preview của main.js.
// ==========================================

window.DanceEngine = {
    currentP1Dance: "dance_apt",
    currentP2Dance: "dance_slickback",
    currentWinDance: "dance_siuuuu",

    // Danh sách 108 điệu nhảy chính dùng cho Intro / Outro / Menu Preview / Chiến thắng
    danceList: [
        // --- 1. GIỮ NGUYÊN 34 ĐIỆU NHẢY GỐC + 8 ĐIỆU NHẢY KINH ĐIỂN ---
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
        "dance_luffy_gear5",        // 13. Luffy Gear 5 (Nhảy nhịp trống Nika giải phóng)
        "dance_gojo_backbend",      // 14. Gojo Satoru ngửa người uốn dẻo "Duy ngã độc tôn"
        "dance_sukuna_shrine",      // 15. Sukuna Kết Ấn Lãnh Địa ngạo nghễ
        "dance_jojo",               // 16. Vũ điệu JoJo uốn người tạo dáng
        "dance_take_the_l",         // 17. Fortnite Take The L (Tay chữ L trên trán + đá chân 2 bên)
        "dance_kazotsky_kick",      // 18. Điệu nhảy Cossack Nga (Khoanh tay ngồi xổm đá chân liên hoàn)
        "dance_specialist",         // 19. Persona 4 Specialist Meme
        "dance_yama_split",         // 20. Yujiro Hanma xoạc chân chữ nhất 180 độ sát đất
        "dance_praise_the_sun",     // 21. Dark Souls Praise The Sun \o/
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
        "dance_cung_hy",            // 34. Chắp tay xin lì xì / Chúc Tết cà khịa
        "floss",                    // 35. Điệu nhảy Floss vung tay qua hông
        "smooth_criminal",          // 36. Michael Jackson nghiêng người 45 độ chống trọng lực
        "salt_bae",                 // 37. Thánh Rắc Muối Salt Bae
        "robot_dance",              // 38. Nhảy Robot giật cục
        "zombie",                   // 39. Vũ điệu Zombie Thriller
        "rickroll",                 // 40. Vũ điệu Rick Astley Never Gonna Give You Up
        "dab",                      // 41. Tạo dáng DAB kinh điển
        "t_pose",                   // 42. Đứng T-Pose áp đảo tinh thần

        // --- 2. HOT TREND TIKTOK, K-POP & MEME QUỐC TẾ MỚI (18 ĐIỆU) ---
        "dance_pedro_raccoon",      // 43. Gấu trúc Pedro Pedro xoay vòng vẫy tay ngắn
        "dance_toothless",          // 44. Rồng Sún Toothless đập cánh ngoáy đuôi lắc đầu
        "dance_chipi_chapa",        // 45. Mèo Chipi Chipi Chapa Chapa ôm gáy lắc lư
        "dance_skibidi",            // 46. Vũ điệu Skibidi Dop Dop Yes Yes
        "dance_sigma_walk",         // 47. Bước đi Sigma Patrick Bateman chỉ tay ngạo nghễ
        "dance_zerotwo_hip",        // 48. Vũ điệu lắc hông Zero Two / Phút Hơn
        "dance_super_shy",          // 49. NewJeans Super Shy / Hype Boy quạt tay đá gót
        "dance_see_tinh",           // 50. Vũ điệu See Tình (Bắn tim Tình Tình Tình Tang Tang Tính)
        "dance_cat_vibing",         // 51. Mèo vỗ trống Bongo gật đầu theo nhạc
        "dance_coffin_dance",       // 52. Vũ điệu Khiêng Hòm Ghana dậm chân đồng đều
        "dance_tunak_tunak",        // 53. Vũ điệu Ấn Độ Tunak Tunak Tun lắc cổ chỉ trời
        "dance_caramelldansen",     // 54. Vũ điệu Tai Thỏ Caramelldansen lắc hông tốc độ cao
        "dance_banana_cat",         // 55. Happy Happy Happy Cat nhảy tưng tưng vẫy tay
        "dance_nyan_cat",           // 56. Nyan Cat bay lơ lửng đạp chân trên không
        "dance_crab_rave",          // 57. Vũ điệu Cua Nhảy Crab Rave bấm càng lên trời
        "dance_harlem_shake",       // 58. Vũ điệu Harlem Shake co giật hỗn loạn cực lầy
        "dance_toca_toca",          // 59. Vũ điệu Toca Toca vỗ tay xoay hông
        "dance_party_rock",         // 60. Everyday I'm Shuffling LMFAO chạy bộ trên không

        // --- 3. ANIME, MANGA & GAME MEME MỚI (16 ĐIỆU) ---
        "dance_goku_fusion",        // 61. Lưỡng Long Nhất Thể Dragon Ball "Fuuu-sion HA!"
        "dance_ginyu_force",        // 62. Biệt đội Sát Thủ Ginyu Tokusentai tạo dáng siêu dị
        "dance_naruto_run",         // 63. Chạy Ninja Naruto vắt tay sau lưng tốc độ bàn thờ
        "dance_one_piece_franky",   // 64. Franky SUUUUPER!! ghép tay ngôi sao
        "dance_sanji_heart",        // 65. Sanji uốn dẻo mì sợi dâng trái tim tình yêu
        "dance_chopper_peek",       // 66. Chopper lắc mông vẫy tay ngại ngùng
        "dance_baki_schizo",        // 67. Baki ngồi bàn ăn tưởng tượng cắt bít tết vô hình
        "dance_dio_wryyy",          // 68. DIO ngửa lưng cực gắt hét WRYYYYY!!
        "dance_torture_dance",      // 69. JoJo Torture Dance (Vocal Percussion)
        "dance_saitama_ok",         // 70. Saitama đứng nhún vai mặt đơ tập Squat
        "dance_default_fortnite",   // 71. Fortnite Default Dance (Vỗ tay - Khoanh tay - Chỉ tay)
        "dance_electro_swing",      // 72. Fortnite Electro Swing cổ điển vui nhộn
        "dance_boogie_down",        // 73. Fortnite Boogie Down xoay ngón trỏ disco
        "dance_gta_san_andreas",    // 74. CJ GTA San Andreas Respect Groove
        "dance_minecraft_crouch",   // 75. Minecraft Spam Shift ngồi xổm hòa bình
        "dance_among_us_vent",      // 76. Among Us Impostor lắc lư giấu dao sau lưng

        // --- 4. ĐẶC SẢN HÀI HƯỚC VIỆT NAM & ĐỜI THƯỜNG (14 ĐIỆU) ---
        "dance_vinh_rau_mua",       // 77. Múa Võ Bịp chém gió rồi ôm lưng đau cột sống
        "dance_lac_bau_cua",        // 78. Ngồi xổm lắc đĩa Bầu Cua Tôm Cá rồi đập mở bát
        "dance_da_cau",             // 79. Đá Cầu Kiểng công viên (Tâng đùi, búng gót)
        "dance_tap_the_duc",        // 80. Tập Thể Dục Buổi Sáng 1-2-3-4-5-6-7-8
        "dance_vinh_xuan_bip",      // 81. Múa Mộc Nhân Vịnh Xuân vỗ tay tốc độ bàn thờ
        "dance_bua_yeu_dj",         // 82. DJ Chà Đĩa Vinahouse gật đầu căng đét
        "dance_dua_thuyen",         // 83. Ngồi bệt Chèo Thuyền Đua Ghe Ngo trên cạn
        "dance_nhay_day",           // 84. Nhảy Dây tốc độ cao tại chỗ
        "dance_lac_vong",           // 85. Lắc Vòng Hula Hoop siêu dẻo
        "dance_cau_ca",             // 86. Ngồi Câu Cá thư giãn giật cần trêu ngươi
        "dance_uong_tra",           // 87. Ngồi vắt chân Thưởng Trà Đạo phong lưu
        "dance_lau_nha",            // 88. Vừa cầm chổi Lau Nhà vừa gẩy đàn Guitar Rock
        "dance_bom_xe",             // 89. Bơm Xe Đạp thụt ống bơm liên hồi giữa sân
        "dance_gac_chan_ngay",      // 90. Nằm nghiêng chống cằm Rung Đùi Ngủ Trưa

        // --- 5. VŨ ĐẠO SLAPSTICK, THỂ THAO & BIỂU DIỄN SIÊU NHỘN (18 ĐIỆU) ---
        "dance_chicken",            // 91. Vũ điệu Gà Con (Vẫy cánh gà - Lắc đuôi vịt - Vỗ tay)
        "dance_ballet_spin",        // 92. Múa Ba-lê Hồ Thiên Nga kiễng chân xoay vòng
        "dance_hula_hawaii",        // 93. Vũ điệu Hula Hawaii uốn sóng tay mềm mại
        "dance_samba_carnival",     // 94. Vũ điệu Samba Lễ Hội Brazil cuồng nhiệt
        "dance_salsa_spin",         // 95. Vũ điệu Salsa bước chéo chân điệu nghệ
        "dance_tap_dance",          // 96. Nhảy Thiết Hài Tap Dance gõ gót chân siêu tốc
        "dance_air_guitar",         // 97. Solo Đàn Air Guitar Rock N' Roll cháy bỏng
        "dance_drummer_solo",       // 98. Đánh Trống Jazz Solo đập dùi liên hoàn
        "dance_cheerleader",        // 99. Hoạt Náo Viên tung bông Pom-Pom bật nhảy chữ V
        "dance_weightlifting",      // 100. Cử Tạ quá sức chân run bần bật rồi giơ cao
        "dance_sumo_stomp",         // 101. Võ sĩ Sumo nâng cao chân dậm đất Shiko
        "dance_matador_ole",        // 102. Đấu sĩ Bò Tót vẫy khăn đỏ "¡Olé!"
        "dance_crying_baby",        // 103. Ăn vạ khóc nhè dụi mắt dậm chân đành đạch
        "dance_belly_laugh",        // 104. Ôm bụng cười ngặt nghẽo chỉ thẳng mặt đối thủ
        "dance_magic_levitate",     // 105. Ảo thuật gia ngồi thiền bay lơ lửng trên không
        "dance_matrix_dodge",       // 106. Neo Matrix ngửa lưng 90 độ né đạn
        "dance_helicopter_legs",    // 107. Chống tay chổng ngược xoay chân cánh quạt trực thăng
        "dance_jumping_jacks"       // 108. Nhảy bật tách chụm tay chân Jumping Jacks
    ],

    // Danh sách toàn bộ 118 trạng thái biểu cảm do dances.js quản lý
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
        "robot_dance", "zombie", "rickroll", "giorno_pose",
        // 66 Điệu nhảy mới
        "dance_pedro_raccoon", "dance_toothless", "dance_chipi_chapa", "dance_skibidi",
        "dance_sigma_walk", "dance_zerotwo_hip", "dance_super_shy", "dance_see_tinh",
        "dance_cat_vibing", "dance_coffin_dance", "dance_tunak_tunak", "dance_caramelldansen",
        "dance_banana_cat", "dance_nyan_cat", "dance_crab_rave", "dance_harlem_shake",
        "dance_toca_toca", "dance_party_rock", "dance_goku_fusion", "dance_ginyu_force",
        "dance_naruto_run", "dance_one_piece_franky", "dance_sanji_heart", "dance_chopper_peek",
        "dance_baki_schizo", "dance_dio_wryyy", "dance_torture_dance", "dance_saitama_ok",
        "dance_default_fortnite", "dance_electro_swing", "dance_boogie_down", "dance_gta_san_andreas",
        "dance_minecraft_crouch", "dance_among_us_vent", "dance_vinh_rau_mua", "dance_lac_bau_cua",
        "dance_da_cau", "dance_tap_the_duc", "dance_vinh_xuan_bip", "dance_bua_yeu_dj",
        "dance_dua_thuyen", "dance_nhay_day", "dance_lac_vong", "dance_cau_ca",
        "dance_uong_tra", "dance_lau_nha", "dance_bom_xe", "dance_gac_chan_ngay",
        "dance_chicken", "dance_ballet_spin", "dance_hula_hawaii", "dance_samba_carnival",
        "dance_salsa_spin", "dance_tap_dance", "dance_air_guitar", "dance_drummer_solo",
        "dance_cheerleader", "dance_weightlifting", "dance_sumo_stomp", "dance_matador_ole",
        "dance_crying_baby", "dance_belly_laugh", "dance_magic_levitate", "dance_matrix_dodge",
        "dance_helicopter_legs", "dance_jumping_jacks"
    ]),

    isDanceState: function(state) {
        if (typeof state !== "string") return false;
        return state.startsWith("dance_") || this.allExpressiveStates.has(state);
    },

    // Bộ trộn bài thông minh giúp mỗi trận ra các điệu nhảy hoàn toàn mới
    _shuffledBag: [],
    _nextFromBag: function() {
        if (!this._shuffledBag || this._shuffledBag.length === 0) {
            this._shuffledBag = (typeof window.shuffleTrashTalk === 'function')
                ? window.shuffleTrashTalk(this.danceList)
                : this.danceList.slice();
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
    // (ĐÃ CHUẨN HÓA TỈ LỆ GIẢI PHẪU TAY & CHÂN KHÔNG BAO GIỜ BỊ DÀI QUÁ MỨC)
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
                pelvis.x = aptHeadSway * 6;
                pelvis.y = -19 + bounce;
                neck.x = -aptHeadSway * 3;
                head.x = -aptHeadSway * 8;
                head.y = -59 + bounce;
                p.headTilt = -aptHeadSway * 0.35;

                let stackH1 = -36 - (aptStep % 2) * 10;
                let stackH2 = -36 - ((aptStep + 1) % 2) * 10;
                elbowL = { x: neck.x - 13, y: -36 + bounce * 0.5 };
                handL  = { x: neck.x + 5,  y: stackH1 + bounce * 0.5 };
                elbowR = { x: neck.x + 14, y: -36 + bounce * 0.5 };
                handR  = { x: neck.x + 5,  y: stackH2 + bounce * 0.5 };

                kneeL = { x: pelvis.x - 10, y: -10 };
                footL = { x: -14, y: aptHeadSway > 0 ? -5 : 0 };
                kneeR = { x: pelvis.x + 10, y: -10 };
                footR = { x: 14,  y: aptHeadSway <= 0 ? -5 : 0 };
                break;

            case "dance_slickback":
                // Jubi Slide / Slickback: Trượt chân lơ lửng trên không siêu mượt
                let glide = Math.sin(beat * 0.9);
                let glideCos = Math.cos(beat * 0.9);
                let floatOffset = -3 + Math.abs(s2) * 2;
                pelvis = { x: glide * 12, y: -21 + floatOffset };
                neck   = { x: glide * 10 + 3, y: -45 + floatOffset };
                head   = { x: glide * 9 + 5,  y: -59 + floatOffset };
                p.headTilt = glide * 0.18;

                elbowL = { x: neck.x - 11 - glideCos * 5, y: -34 };
                handL  = { x: neck.x - 18 - glideCos * 8, y: -23 };
                elbowR = { x: neck.x + 11 + glideCos * 5, y: -34 };
                handR  = { x: neck.x + 18 + glideCos * 8, y: -23 };

                // Hai đầu gối co cao thay phiên nhau bước trên không
                kneeL = { x: pelvis.x - 6 + glideCos * 12, y: -14 - Math.max(0, glideCos) * 8 };
                footL = { x: pelvis.x - 10 + glideCos * 18, y: -3 - Math.max(0, glideCos) * 10 };
                kneeR = { x: pelvis.x + 6 - glideCos * 12, y: -14 - Math.max(0, -glideCos) * 8 };
                footR = { x: pelvis.x + 10 - glideCos * 18, y: -3 - Math.max(0, -glideCos) * 10 };
                break;

            case "dance_mua_quat":
                // Múa Quạt Khá Bảnh: Nhún gối sâu + hai tay cuộn tròn như cánh quạt hai bên
                let fanSpin = t * 16;
                let squat = Math.abs(s) * 7;
                pelvis = { x: s * 6, y: -17 + squat };
                neck   = { x: -s * 3, y: -41 + squat };
                head   = { x: -s * 5, y: -56 + squat };
                p.headTilt = Math.sin(t * 8) * 0.25;

                elbowL = { x: neck.x - 14, y: -38 + squat };
                handL  = { x: neck.x - 21 + Math.cos(fanSpin) * 7, y: -42 + Math.sin(fanSpin) * 7 + squat };
                elbowR = { x: neck.x + 14, y: -38 + squat };
                handR  = { x: neck.x + 21 + Math.cos(-fanSpin) * 7, y: -42 + Math.sin(-fanSpin) * 7 + squat };

                kneeL = { x: pelvis.x - 12, y: -10 + squat * 0.5 };
                footL = { x: -18, y: 0 };
                kneeR = { x: pelvis.x + 12, y: -10 + squat * 0.5 };
                footR = { x: 18,  y: 0 };
                break;

            case "dance_california_gurls":
                // Lethal Company / California Gurls: Hai tay đan trên đỉnh đầu + đánh hông mạnh sang 2 bên
                let hipSway = Math.sin(beat * 1.1) * 12;
                pelvis = { x: hipSway, y: -19 + bounce };
                neck   = { x: -hipSway * 0.25, y: -44 + bounce };
                head   = { x: -hipSway * 0.4,  y: -59 + bounce };
                p.headTilt = hipSway * 0.02;

                elbowL = { x: neck.x - 14, y: -55 + bounce };
                handL  = { x: neck.x - 4,  y: -68 + bounce };
                elbowR = { x: neck.x + 14, y: -55 + bounce };
                handR  = { x: neck.x + 4,  y: -68 + bounce };

                kneeL = { x: pelvis.x - 10, y: -10 };
                footL = { x: -15, y: hipSway > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x + 10, y: -10 };
                footR = { x: 15,  y: hipSway < 0 ? -4 : 0 };
                break;

            case "dance_wednesday":
                // Điệu nhảy Wednesday Addams: Tay vẫy lên xuống đối xứng + mặt lạnh lùng nghiêng nhẹ
                let wedBeat = Math.sin(beat * 0.85);
                pelvis = { x: wedBeat * 5, y: -20 + bounce * 0.5 };
                neck   = { x: 0, y: -45 };
                head   = { x: -wedBeat * 4, y: -60 };
                p.headTilt = -wedBeat * 0.22;

                if (wedBeat > 0) {
                    elbowL = { x: -13, y: -48 }; handL = { x: -21, y: -58 + s2 * 4 };
                    elbowR = { x: 13,  y: -33 }; handR = { x: 20,  y: -22 - s2 * 4 };
                } else {
                    elbowL = { x: -13, y: -33 }; handL = { x: -20, y: -22 + s2 * 4 };
                    elbowR = { x: 13,  y: -48 }; handR = { x: 21,  y: -58 - s2 * 4 };
                }
                kneeL = { x: pelvis.x - 10, y: -10 };
                kneeR = { x: pelvis.x + 10, y: -10 };
                break;

            case "dance_luffy_gear5":
                // Luffy Gear 5 (Nika): Nhảy bật cao trên không, ưỡn bụng cười / che mặt cười sảng khoái
                let nikaHop = Math.abs(Math.sin(beat * 0.85)) * 20;
                let nikaLean = Math.cos(beat * 0.85) * 8;
                pelvis = { x: 6 + nikaLean * 0.4,  y: -20 - nikaHop };
                neck   = { x: -3 - nikaLean * 0.3, y: -44 - nikaHop };
                head   = { x: -8 - nikaLean * 0.5, y: -58 - nikaHop };
                p.headTilt = -0.35 + Math.sin(fastF) * 0.12;

                // Tay trái che trán cười, tay phải ôm bụng
                elbowL = { x: neck.x - 12, y: -54 - nikaHop };
                handL  = { x: head.x + 2,  y: -61 - nikaHop };
                elbowR = { x: neck.x + 14, y: -34 - nikaHop };
                handR  = { x: pelvis.x + 4, y: -24 - nikaHop };

                kneeL = { x: pelvis.x - 13, y: -13 - nikaHop };
                footL = { x: pelvis.x - 9,  y: -2 - nikaHop * 1.05 };
                kneeR = { x: pelvis.x + 14, y: -16 - nikaHop };
                footR = { x: pelvis.x + 10, y: -5 - nikaHop * 1.1 };
                break;

            case "dance_gojo_backbend":
                // Gojo Satoru lơ lửng ngửa người uốn dẻo chỉ tay lên trời "Thiên thượng thiên hạ duy ngã độc tôn"
                let gojoFloat = Math.sin(t * 4) * 7;
                pelvis = { x: 10,  y: -26 + gojoFloat };
                neck   = { x: -6,  y: -44 + gojoFloat };
                head   = { x: -17, y: -52 + gojoFloat };
                p.headTilt = -0.75;

                elbowR = { x: neck.x + 8,  y: -58 + gojoFloat };
                handR  = { x: neck.x + 12, y: -72 + gojoFloat + Math.sin(t * 8) * 2 };
                elbowL = { x: neck.x - 8,  y: -32 + gojoFloat };
                handL  = { x: neck.x - 14, y: -20 + gojoFloat };

                kneeL = { x: pelvis.x - 11, y: -14 + gojoFloat };
                footL = { x: pelvis.x - 18, y: -3 + gojoFloat };
                kneeR = { x: pelvis.x + 12, y: -15 + gojoFloat };
                footR = { x: pelvis.x + 8,  y: -3 + gojoFloat };
                break;

            case "dance_sukuna_shrine":
                // Sukuna Kết Ấn Phục Ma Ngự Trù Tử + Lắc đầu cười khinh bỉ
                let sukunaPulse = Math.sin(t * 6) * 2;
                pelvis = { x: 0, y: -16 };
                neck   = { x: 0, y: -41 };
                head   = { x: sukunaPulse, y: -56 };
                p.headTilt = 0.22 + Math.sin(t * 4) * 0.08;

                // Hai bàn tay chắp ấn trước ngực
                elbowL = { x: -14, y: -35 };
                handL  = { x: -2,  y: -43 + sukunaPulse };
                elbowR = { x: 14,  y: -35 };
                handR  = { x: 2,   y: -43 + sukunaPulse };

                // Tư thế đứng tấn rộng uy nghiêm
                kneeL = { x: -14, y: -9 }; footL = { x: -20, y: 0 };
                kneeR = { x: 14,  y: -9 }; footR = { x: 20,  y: 0 };
                break;

            case "dance_take_the_l":
                // Fortnite Take The L: Tay phải giơ chữ L trên trán, 2 chân đá văng sang 2 bên
                let lKick = Math.sin(beat * 1.15);
                let lHop = Math.abs(Math.cos(beat * 1.15)) * 5;
                pelvis = { x: -lKick * 5, y: -18 - lHop };
                neck   = { x: lKick * 3,  y: -43 - lHop };
                head   = { x: lKick * 5,  y: -58 - lHop };
                p.headTilt = lKick * 0.22;

                // Tay phải đặt chữ L ngay trên trán, tay trái chống hông
                elbowR = { x: neck.x + 14, y: -49 - lHop };
                handR  = { x: head.x + 3,  y: head.y - 4 };
                elbowL = { x: neck.x - 14, y: -32 - lHop };
                handL  = { x: pelvis.x - 8, y: -22 - lHop };

                if (lKick > 0) {
                    kneeL = { x: pelvis.x - 12 - lKick * 4, y: -11 };
                    footL = { x: pelvis.x - 20 - lKick * 8, y: -8 };
                    kneeR = { x: pelvis.x + 8,  y: -10 };
                    footR = { x: pelvis.x + 10, y: 0 };
                } else {
                    kneeL = { x: pelvis.x - 8,  y: -10 };
                    footL = { x: pelvis.x - 10, y: 0 };
                    kneeR = { x: pelvis.x + 12 - lKick * 4, y: -11 };
                    footR = { x: pelvis.x + 20 - lKick * 8, y: -8 };
                }
                break;

            case "dance_kazotsky_kick":
                // Điệu nhảy Cossack Nga (TF2): Ngồi xổm thấp, khoanh tay trước ngực, đá tung chân liên hoàn
                let kazKick = Math.sin(beat * 1.3);
                let kazBounce = Math.abs(Math.cos(beat * 1.3)) * 4;
                pelvis = { x: -2, y: -12 + kazBounce };
                neck   = { x: 0,  y: -35 + kazBounce };
                head   = { x: 2,  y: -50 + kazBounce };
                p.headTilt = kazKick * 0.15;

                // Hai tay khoanh ngang trước ngực vừa vặn tỉ lệ
                elbowL = { x: -13, y: -28 + kazBounce }; handL = { x: 2,  y: -28 + kazBounce };
                elbowR = { x: 13,  y: -28 + kazBounce }; handR = { x: -2, y: -28 + kazBounce };

                if (kazKick > 0) {
                    kneeL = { x: -11, y: -6 };  footL = { x: -9, y: 0 };
                    kneeR = { x: 11,  y: -11 }; footR = { x: 14 + 12 * kazKick, y: -7 * kazKick };
                } else {
                    kneeR = { x: 9,   y: -6 };  footR = { x: 8,  y: 0 };
                    kneeL = { x: 10,  y: -11 }; footL = { x: 13 + 12 * (-kazKick), y: -7 * (-kazKick) };
                }
                break;

            case "dance_specialist":
                // Persona 4 Specialist Meme: Bước trượt ngang kết hợp chỉ tay tạo dáng cực ngầu
                let specPhase = Math.sin(beat * 0.8);
                pelvis = { x: -specPhase * 7, y: -19 + bounce };
                neck   = { x: specPhase * 5,  y: -44 + bounce };
                head   = { x: specPhase * 8,  y: -59 + bounce };
                p.headTilt = specPhase * 0.25;

                elbowL = { x: neck.x - 13, y: -37 };
                handL  = { x: neck.x - 22, y: -27 + specPhase * 10 };
                elbowR = { x: neck.x + 13, y: -46 };
                handR  = { x: neck.x + 24, y: -55 - specPhase * 8 };

                kneeL = { x: pelvis.x - 10 + specPhase * 5, y: -10 };
                footL = { x: pelvis.x - 16 + specPhase * 8, y: 0 };
                kneeR = { x: pelvis.x + 10 + specPhase * 5, y: -10 };
                footR = { x: pelvis.x + 16 + specPhase * 8, y: 0 };
                break;

            case "dance_yama_split":
                // Yujiro Hanma Xoạc Chân Chữ Nhất 180 độ sát đất + Gồng cơ tay đôi
                let splitPulse = Math.abs(Math.sin(t * 6)) * 3;
                pelvis = { x: 0, y: -4 + splitPulse };
                neck   = { x: 0, y: -28 + splitPulse };
                head   = { x: 0, y: -43 + splitPulse };
                p.headTilt = Math.sin(t * 4) * 0.12;

                elbowL = { x: -15, y: -28 + splitPulse }; handL = { x: -12, y: -41 + splitPulse };
                elbowR = { x: 15,  y: -28 + splitPulse }; handR = { x: 12,  y: -41 + splitPulse };

                kneeL = { x: -15, y: -2 }; footL = { x: -29, y: 0 };
                kneeR = { x: 15,  y: -2 }; footR = { x: 29,  y: 0 };
                break;

            case "dance_praise_the_sun":
                // Dark Souls Praise The Sun \o/
                let sunGlow = Math.sin(t * 5) * 2;
                pelvis = { x: 0, y: -20 };
                neck   = { x: 0, y: -45 };
                head   = { x: 0, y: -60 + sunGlow };
                p.headTilt = -0.35;

                elbowL = { x: -11, y: -55 }; handL = { x: -20, y: -67 + sunGlow };
                elbowR = { x: 11,  y: -55 }; handR = { x: 20,  y: -67 + sunGlow };
                footL  = { x: -13, y: 0 };   footR = { x: 13,  y: 0 };
                break;

            case "dance_worm":
                // Nhảy Con Sâu (The Worm): Uốn sóng toàn thân nằm ngang sát mặt đất
                let wWave1 = Math.sin(beat * 1.3);
                let wWave2 = Math.sin(beat * 1.3 - 1.2);
                let wWave3 = Math.sin(beat * 1.3 - 2.4);
                let wWave4 = Math.sin(beat * 1.3 - 3.6);

                head   = { x: 27,  y: -13 - Math.max(0, wWave1) * 12 };
                neck   = { x: 14,  y: -11 - Math.max(0, wWave1) * 10 };
                pelvis = { x: -8,  y: -9  - Math.max(0, wWave2) * 12 };
                kneeL  = { x: -22, y: -7  - Math.max(0, wWave3) * 10 };
                kneeR  = { x: -22, y: -7  - Math.max(0, wWave3) * 10 };
                footL  = { x: -35, y: -3  - Math.max(0, wWave4) * 10 };
                footR  = { x: -35, y: -3  - Math.max(0, wWave4) * 10 };

                elbowL = { x: 11, y: -4 }; handL = { x: 18, y: 0 };
                elbowR = { x: 15, y: -4 }; handR = { x: 22, y: 0 };
                p.headTilt = 0.45 - wWave1 * 0.25;
                break;

            case "dance_headspin":
                // B-Boy Headspin: Cắm đầu xuống đất xoay chân chữ V tốc độ cao
                let hSpin = fastF * 2.4;
                head   = { x: 0, y: -8 };
                neck   = { x: 0, y: -21 };
                pelvis = { x: Math.sin(hSpin) * 3, y: -43 };
                p.headTilt = Math.PI;

                elbowL = { x: -12, y: -12 }; handL = { x: -10, y: 0 };
                elbowR = { x: 12,  y: -12 }; handR = { x: 10,  y: 0 };

                kneeL = { x: Math.cos(hSpin) * 12, y: -53 };
                footL = { x: Math.cos(hSpin) * 22, y: -63 + Math.sin(hSpin) * 5 };
                kneeR = { x: Math.cos(hSpin + Math.PI) * 12, y: -53 };
                footR = { x: Math.cos(hSpin + Math.PI) * 22, y: -63 + Math.sin(hSpin + Math.PI) * 5 };
                break;

            case "dance_hype_shoot":
                // Shoot Dance (BlocBoy JB): Nhảy lò cò 1 chân, chân phải và tay phải vung cùng nhịp về phía trước
                let shootKick = Math.max(0, Math.sin(beat * 1.1));
                let shootHop = Math.abs(Math.cos(beat * 1.1)) * 5;
                pelvis = { x: -shootKick * 4, y: -20 - shootHop };
                neck   = { x: -shootKick * 2, y: -45 - shootHop };
                head   = { x: 3, y: -60 - shootHop };
                p.headTilt = shootKick * 0.22;

                elbowR = { x: neck.x + 11, y: -34 - shootHop };
                handR  = { x: neck.x + 10 + shootKick * 16, y: -24 - shootKick * 14 };
                elbowL = { x: neck.x - 13, y: -48 - shootHop };
                handL  = { x: neck.x - 10, y: -60 - shootHop };

                kneeL = { x: pelvis.x - 10, y: -10 - shootHop };
                footL = { x: pelvis.x - 12, y: -shootHop };
                kneeR = { x: pelvis.x + 10 + shootKick * 8,  y: -12 - shootKick * 6 };
                footR = { x: pelvis.x + 10 + shootKick * 18, y: -4 - shootKick * 10 };
                break;

            case "dance_shuffle_melbourne":
                // Melbourne Shuffle trượt chân tốc độ cao
                let shufFast = Math.sin(t * 18);
                let shufCos = Math.cos(t * 18);
                pelvis = { x: shufFast * 6, y: -19 + Math.abs(shufCos) * 4 };
                neck   = { x: 3, y: -44 };
                head   = { x: 5, y: -59 };
                p.headTilt = shufFast * 0.15;

                elbowL = { x: neck.x - 13, y: -34 }; handL = { x: neck.x - 16 + shufFast * 10, y: -23 };
                elbowR = { x: neck.x + 13, y: -34 }; handR = { x: neck.x + 16 - shufFast * 10, y: -23 };

                kneeL = { x: pelvis.x - 8 + shufFast * 10,  y: -11 };
                footL = { x: pelvis.x - 12 + shufFast * 16, y: shufCos > 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 8 - shufFast * 10,  y: -11 };
                footR = { x: pelvis.x + 12 - shufFast * 16, y: shufCos <= 0 ? -6 : 0 };
                break;

            case "dance_macarena":
                // Vũ điệu Macarena 4 nhịp: Đưa tay trước -> Đặt lên đầu -> Đặt lên hông -> Lắc vòng hông
                let macPhase = Math.floor(t * 2.5) % 4;
                pelvis = { x: (macPhase === 3 ? s * 11 : s * 3), y: -20 + bounce * 0.6 };
                head.y = -60 + bounce * 0.6;
                if (macPhase === 0) {
                    elbowL = { x: -11, y: -40 }; handL = { x: 18, y: -42 };
                    elbowR = { x: 12,  y: -40 }; handR = { x: 22, y: -42 };
                } else if (macPhase === 1) {
                    elbowL = { x: -15, y: -54 }; handL = { x: -6, y: -62 };
                    elbowR = { x: 15,  y: -54 }; handR = { x: 6,  y: -62 };
                } else {
                    elbowL = { x: -15, y: -33 }; handL = { x: pelvis.x - 8, y: -21 };
                    elbowR = { x: 15,  y: -33 }; handR = { x: pelvis.x + 8, y: -21 };
                }
                break;

            case "dance_ymca":
                // Vũ điệu Y-M-C-A
                let ymcaStep = Math.floor(t * 2.2) % 4;
                pelvis.y = -20 + bounce;
                head.y = -60 + bounce;
                if (ymcaStep === 0) { // Chữ Y
                    elbowL = { x: -12, y: -55 }; handL = { x: -21, y: -67 };
                    elbowR = { x: 12,  y: -55 }; handR = { x: 21,  y: -67 };
                } else if (ymcaStep === 1) { // Chữ M
                    elbowL = { x: -15, y: -58 }; handL = { x: -5, y: -50 };
                    elbowR = { x: 15,  y: -58 }; handR = { x: 5,  y: -50 };
                } else if (ymcaStep === 2) { // Chữ C
                    elbowL = { x: -8,  y: -57 }; handL = { x: 15, y: -63 };
                    elbowR = { x: 10,  y: -33 }; handR = { x: 18, y: -25 };
                } else { // Chữ A
                    elbowL = { x: -12, y: -56 }; handL = { x: 0,  y: -68 };
                    elbowR = { x: 12,  y: -56 }; handR = { x: 0,  y: -68 };
                }
                break;

            case "dance_shadow_boxing":
                // Đấm gió Mike Tyson Peek-a-Boo: Lắc đầu né đòn chữ U + đấm móc tốc độ cao
                let bobWeave = Math.sin(beat * 1.4);
                let bobDrop = Math.abs(Math.cos(beat * 1.4)) * 6;
                pelvis = { x: bobWeave * 5,  y: -18 + bobDrop };
                neck   = { x: bobWeave * 9,  y: -42 + bobDrop };
                head   = { x: bobWeave * 12, y: -56 + bobDrop };
                p.headTilt = bobWeave * 0.25;

                let jabPunch = Math.sin(fastF * 2.4);
                elbowL = { x: neck.x + 6,  y: -36 + bobDrop };
                handL  = { x: neck.x + 12 + Math.max(0, jabPunch) * 16, y: -45 + bobDrop };
                elbowR = { x: neck.x + 8,  y: -36 + bobDrop };
                handR  = { x: neck.x + 14 + Math.max(0, -jabPunch) * 16, y: -44 + bobDrop };

                kneeL = { x: -13, y: -10 }; footL = { x: -16, y: 0 };
                kneeR = { x: 14,  y: -10 }; footR = { x: 17,  y: 0 };
                break;

            case "dance_thai_cuc_quyen":
                // Thái Cực Quyền dưỡng sinh chậm rãi trêu ngươi đối thủ
                let taiChi = Math.sin(t * 3.2);
                let taiChiCos = Math.cos(t * 3.2);
                pelvis = { x: taiChi * 5, y: -16 };
                neck   = { x: taiChi * 3, y: -41 };
                head   = { x: taiChi * 3, y: -56 };
                p.headTilt = taiChi * 0.08;

                elbowL = { x: neck.x - 10 + taiChi * 6, y: -34 + taiChiCos * 6 };
                handL  = { x: neck.x + 4 + taiChi * 14, y: -38 + taiChiCos * 10 };
                elbowR = { x: neck.x + 10 - taiChi * 6, y: -34 - taiChiCos * 6 };
                handR  = { x: neck.x + 12 - taiChi * 14, y: -38 - taiChiCos * 10 };

                kneeL = { x: -15, y: -10 }; footL = { x: -18, y: 0 };
                kneeR = { x: 15,  y: -10 }; footR = { x: 18,  y: 0 };
                break;

            case "dance_sad_violin":
                // Kéo đàn Violin buồn tiễn đối thủ
                let bowMove = Math.sin(fastF * 1.4) * 10;
                pelvis = { x: 0, y: -20 };
                neck   = { x: 2, y: -45 };
                head   = { x: 5, y: -58 };
                p.headTilt = 0.28;

                // Tay trái giữ cần đàn, tay phải kéo vĩ đàn qua lại
                elbowL = { x: 10, y: -37 }; handL = { x: 22, y: -46 };
                elbowR = { x: 14, y: -35 }; handR = { x: 12 + bowMove, y: -43 + bowMove * 0.25 };
                break;

            case "dance_cung_hy":
                // Chắp tay xin lì xì / chúc Tết cà khịa
                let bowShake = Math.sin(beat * 1.5) * 6;
                pelvis = { x: -3, y: -18 + bounce };
                neck   = { x: 5,  y: -42 + bounce };
                head   = { x: 8,  y: -56 + bounce };
                p.headTilt = 0.2 + Math.sin(beat) * 0.12;

                elbowL = { x: -8, y: -33 };
                handL  = { x: 15, y: -41 + bowShake };
                elbowR = { x: 14, y: -33 };
                handR  = { x: 17, y: -41 + bowShake };
                break;

            // ==========================================
            // PHẦN B: CÁC ĐIỆU NHẢY & TAUNT KINH ĐIỂN
            // ==========================================
            case "dance_hakari":
            case "taunt_dance":
                pelvis.x = s * 10;
                pelvis.y = -20 + bounce;
                neck.x = -s * 4;
                head.x = -s * 6;
                head.y = -60 + bounce;
                p.headTilt = s * 0.28;

                elbowL = { x: neck.x - 13, y: -48 + c * 3 };
                handL  = { x: neck.x - 18 + s2 * 6, y: -61 + Math.abs(c) * 5 };
                elbowR = { x: neck.x + 13, y: -48 - c * 3 };
                handR  = { x: neck.x + 18 + s2 * 6, y: -61 + Math.abs(s) * 5 };

                kneeL = { x: pelvis.x - 10, y: -11 + bounce };
                footL = { x: pelvis.x - 13 + Math.max(0, s) * 6, y: -Math.max(0, s) * 8 };
                kneeR = { x: pelvis.x + 10, y: -11 + bounce };
                footR = { x: pelvis.x + 13 + Math.min(0, s) * 6, y: -Math.max(0, -s) * 8 };
                break;

            case "dance_griddy":
                let griddyPhase = Math.sin(beat * 0.5);
                pelvis.x = -3;
                pelvis.y = -18 + bounce;
                neck.x = 5;
                head.x = 8;
                head.y = -56 + bounce;
                p.headTilt = 0.15 + s * 0.15;

                if (griddyPhase > 0) {
                    elbowL = { x: neck.x - 12, y: -39 + bounce };
                    handL  = { x: head.x - 2,  y: -55 + bounce };
                    elbowR = { x: neck.x + 13, y: -39 + bounce };
                    handR  = { x: head.x + 6,  y: -55 + bounce };
                } else {
                    let armSwing = s * 15;
                    elbowL = { x: neck.x - 8 + armSwing * 0.5, y: -32 };
                    handL  = { x: neck.x - 12 + armSwing,      y: -21 };
                    elbowR = { x: neck.x + 8 + armSwing * 0.5, y: -32 };
                    handR  = { x: neck.x + 12 + armSwing,      y: -21 };
                }

                kneeL = { x: pelvis.x - 7 + s * 9,  y: -11 };
                footL = { x: pelvis.x - 10 + s * 14, y: s > 0 ? -7 : 0 };
                kneeR = { x: pelvis.x + 7 - s * 9,  y: -11 };
                footR = { x: pelvis.x + 10 - s * 14, y: s < 0 ? -7 : 0 };
                break;

            case "dance_orange_justice":
                let swing = Math.sin(beat * 1.1);
                pelvis.x = swing * 9;
                pelvis.y = -18 + bounce;
                neck.x = -swing * 4;
                head.x = -swing * 7;
                head.y = -58 + bounce;
                p.headTilt = -swing * 0.28;

                elbowL = { x: neck.x - 11 + swing * 8, y: -36 - swing * 8 };
                handL  = { x: neck.x - 6 + swing * 18, y: -38 - swing * 18 };
                elbowR = { x: neck.x + 11 + swing * 8, y: -36 + swing * 8 };
                handR  = { x: neck.x + 6 + swing * 18, y: -38 + swing * 18 };

                let kneeSpread = Math.cos(beat * 2.2) * 10;
                kneeL = { x: pelvis.x - 10 + kneeSpread * 0.6, y: -10 };
                footL = { x: -15, y: 0 };
                kneeR = { x: pelvis.x + 10 - kneeSpread * 0.6, y: -10 };
                footR = { x: 15,  y: 0 };
                break;

            case "dance_twerk":
                let twerk = Math.sin(beat * 2.5);
                pelvis.x = -13 + twerk * 5;
                pelvis.y = -20 + Math.abs(twerk) * 8;
                neck.x = 9;
                neck.y = -38 + twerk * 2;
                head.x = 16;
                head.y = -51 + twerk * 3;
                p.headTilt = -0.25 + twerk * 0.15;

                elbowL = { x: 2,  y: -26 }; handL = { x: -4, y: -14 };
                elbowR = { x: 12, y: -26 }; handR = { x: 10, y: -13 };
                kneeL  = { x: -12, y: -10 }; footL = { x: -16, y: 0 };
                kneeR  = { x: 10,  y: -10 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_billy_bounce":
                let wave = Math.sin(beat);
                let waveLag = Math.sin(beat - 1.2);
                pelvis.x = wave * 7;
                pelvis.y = -18 + bounce;
                neck.x = waveLag * 6;
                head.x = wave * 6;
                head.y = -58 + bounce;
                p.headTilt = waveLag * 0.25;

                elbowL = { x: neck.x - 13, y: -35 + wave * 6 };
                handL  = { x: neck.x - 19 + waveLag * 7, y: -25 - wave * 9 };
                elbowR = { x: neck.x + 13, y: -35 - wave * 6 };
                handR  = { x: neck.x + 19 + waveLag * 7, y: -25 + wave * 9 };

                kneeL = { x: pelvis.x - 9 + wave * 6,  y: -11 };
                footL = { x: pelvis.x - 12 + waveLag * 9, y: wave > 0 ? -8 : 0 };
                kneeR = { x: pelvis.x + 9 + wave * 6,  y: -11 };
                footR = { x: pelvis.x + 12 + waveLag * 9, y: wave <= 0 ? -8 : 0 };
                break;

            case "dance_windmill":
                let cycle = (t % 1.5) / 1.5;
                if (cycle < 0.65) {
                    let shuf = Math.sin(t * 20);
                    pelvis.x = shuf * 6;
                    pelvis.y = -20 + Math.abs(shuf) * 5;
                    head.x = -shuf * 5;
                    p.headTilt = shuf * 0.2;

                    elbowL = { x: -14, y: -36 }; handL = { x: -20, y: -46 + shuf * 10 };
                    elbowR = { x: 14,  y: -36 }; handR = { x: 20,  y: -46 - shuf * 10 };

                    kneeL = { x: pelvis.x - 9 + shuf * 10,  y: -12 };
                    footL = { x: pelvis.x - 13 + shuf * 16, y: shuf > 0 ? -8 : 0 };
                    kneeR = { x: pelvis.x + 9 - shuf * 10,  y: -12 };
                    footR = { x: pelvis.x + 13 - shuf * 16, y: shuf < 0 ? -8 : 0 };
                } else {
                    pelvis = { x: -4, y: -18 };
                    neck   = { x: 6,  y: -40 };
                    head   = { x: 13, y: -51 };
                    p.headTilt = 0.45;

                    elbowL = { x: neck.x - 14, y: -47 }; handL = { x: neck.x - 26, y: -56 };
                    elbowR = { x: neck.x + 15, y: -45 }; handR = { x: neck.x + 2,  y: -50 };
                    kneeL  = { x: -13, y: -10 }; footL = { x: -19, y: 0 };
                    kneeR  = { x: 13,  y: -10 }; footR = { x: 19,  y: 0 };
                }
                break;

            case "dance_jojo":
            case "giorno_pose":
                let poseSwitch = Math.sin(beat * 0.75);
                pelvis.x = -9 * poseSwitch;
                pelvis.y = -18 + bounce;
                neck.x = 7 * poseSwitch;
                head.x = 4 * poseSwitch;
                head.y = -58 + bounce;
                p.headTilt = -0.32 * poseSwitch;

                elbowL = { x: neck.x - 14, y: -51 };
                handL  = { x: neck.x - 3 + poseSwitch * 8, y: -64 };
                elbowR = { x: neck.x + 14, y: -36 };
                handR  = { x: neck.x + 20 * poseSwitch, y: -42 + bounce };

                kneeL = { x: pelvis.x - 11, y: -10 }; footL = { x: -16, y: 0 };
                kneeR = { x: pelvis.x + 14, y: -18 + bounce }; footR = { x: pelvis.x + 10, y: -10 + bounce };
                break;

            case "dance_siuuuu":
            case "siuuuu":
                let jumpCycle = (t % 1.4) / 1.4;
                if (jumpCycle < 0.45) {
                    let airH = Math.sin((jumpCycle / 0.45) * Math.PI) * 28;
                    pelvis = { x: 0, y: -20 - airH };
                    neck   = { x: 0, y: -45 - airH };
                    head   = { x: 0, y: -60 - airH };
                    p.headTilt = -0.15;

                    elbowL = { x: -13, y: -54 - airH }; handL = { x: -5, y: -66 - airH };
                    elbowR = { x: 13,  y: -54 - airH }; handR = { x: 5,  y: -66 - airH };
                    kneeL  = { x: -11, y: -12 - airH }; footL = { x: -8, y: -2 - airH };
                    kneeR  = { x: 11,  y: -12 - airH }; footR = { x: 8,  y: -2 - airH };
                } else {
                    let shake = Math.sin(t * 35) * 1.5;
                    pelvis = { x: 0, y: -16 };
                    neck   = { x: 0, y: -40 };
                    head   = { x: shake, y: -55 };
                    p.headTilt = shake * 0.08;

                    elbowL = { x: -14, y: -30 }; handL = { x: -23, y: -18 };
                    elbowR = { x: 14,  y: -30 }; handR = { x: 23,  y: -18 };
                    kneeL  = { x: -14, y: -8 };  footL = { x: -20, y: 0 };
                    kneeR  = { x: 14,  y: -8 };  footR = { x: 20,  y: 0 };
                }
                break;

            case "taunt_crane":
                head.y += Math.sin(tSlow) * 2;
                p.headTilt = Math.sin(tSlow) * 0.15;
                footR  = { x: 4,   y: -22 }; kneeR  = { x: 13,  y: -18 };
                footL  = { x: -2,  y: 0 };   kneeL  = { x: -9,  y: -10 };
                handL  = { x: -24, y: -56 + Math.sin(tSlow) * 4 }; elbowL = { x: -13, y: -48 };
                handR  = { x: 24,  y: -56 - Math.sin(tSlow) * 4 }; elbowR = { x: 13,  y: -48 };
                break;

            case "taunt_power":
                let pShake = Math.random() * 2 - 1;
                head.x += pShake; head.y = -52 + pShake; pelvis.y = -14; neck.y = -38;
                p.headTilt = pShake * 0.1;
                footL  = { x: -18, y: 0 };   kneeL  = { x: -16, y: -9 };
                footR  = { x: 18,  y: 0 };   kneeR  = { x: 16,  y: -9 };
                handL  = { x: -15, y: -38 }; elbowL = { x: -18, y: -28 };
                handR  = { x: 15,  y: -38 }; elbowR = { x: 18,  y: -28 };
                break;

            case "taunt_point":
                head.x = 4;
                p.headTilt = 0.1;
                handR  = { x: 28,  y: -42 + Math.sin(tSlow) * 2 }; elbowR = { x: 15,  y: -42 };
                handL  = { x: -10, y: -22 };                       elbowL = { x: -13, y: -32 };
                break;

            case "taunt_flex":
                head.y = -57 + Math.sin(tSlow) * 2; pelvis.y = -20;
                handL  = { x: -16, y: -54 }; elbowL = { x: -20, y: -43 };
                handR  = { x: 16,  y: -54 }; elbowR = { x: 20,  y: -43 };
                break;

            case "t_pose":
                head.y = -60; neck.y = -45; pelvis.y = -20; p.headTilt = 0;
                handL  = { x: -29, y: -45 }; elbowL = { x: -15, y: -45 };
                handR  = { x: 29,  y: -45 }; elbowR = { x: 15,  y: -45 };
                footL  = { x: -14, y: 0 };   footR  = { x: 14,  y: 0 };
                kneeL  = { x: -10, y: -10 }; kneeR  = { x: 10,  y: -10 };
                break;

            case "dab":
                head.x = 11; head.y = -45; neck.x = 4; neck.y = -38; p.headTilt = 0.42;
                handL  = { x: 18,  y: -48 }; elbowL = { x: 6,  y: -40 };
                handR  = { x: -22, y: -52 }; elbowR = { x: -8, y: -44 };
                footL  = { x: -15, y: 0 };   footR  = { x: 16, y: 0 };
                break;

            case "floss":
                let fSwing = Math.sin(fastF) * 14;
                pelvis.x = -fSwing * 0.45;
                p.headTilt = fSwing * 0.012;
                handL  = { x: -9 + fSwing, y: -21 }; elbowL = { x: -13 + fSwing * 0.6, y: -32 };
                handR  = { x: 9 + fSwing,  y: -21 }; elbowR = { x: 13 + fSwing * 0.6,  y: -32 };
                break;

            case "smooth_criminal":
                let lean = 11 + Math.sin(tSlow) * 2;
                pelvis.x = lean; pelvis.y = -18;
                neck.x = lean * 1.9; neck.y = -40;
                head.x = lean * 2.3; head.y = -53;
                p.headTilt = 0.35;
                footL  = { x: -6, y: 0 }; footR = { x: 8, y: 0 };
                kneeL  = { x: lean * 0.4, y: -9 }; kneeR = { x: 6 + lean * 0.4, y: -9 };
                elbowL = { x: neck.x - 8, y: -30 }; handL = { x: pelvis.x - 4, y: -20 };
                elbowR = { x: neck.x + 6, y: -31 }; handR = { x: head.x + 4,   y: -48 };
                break;

            case "salt_bae":
                head.y = -60; p.headTilt = 0.2;
                handL  = { x: -10, y: -36 }; elbowL = { x: -14, y: -28 };
                handR  = { x: 18,  y: -48 + Math.sin(fastF) * 3 }; elbowR = { x: 14, y: -32 };
                break;

            case "gangnam_style":
                let hop = Math.abs(Math.sin(fastF)) * 10;
                let sideStep = Math.sin(tSlow);
                pelvis.x = sideStep * 6; pelvis.y = -20 - hop;
                head.x = sideStep * 5;   head.y = -60 - hop;
                neck.x = sideStep * 5;   neck.y = -45 - hop;
                p.headTilt = sideStep * 0.2;

                handL  = { x: neck.x + 4,  y: -36 - hop * 0.5 }; elbowL = { x: neck.x - 12, y: -40 - hop * 0.5 };
                handR  = { x: neck.x + 10 + Math.cos(fastF * 1.5) * 10, y: -64 - hop + Math.sin(fastF * 1.5) * 5 };
                elbowR = { x: neck.x + 15, y: -52 - hop * 0.5 };

                footL  = { x: -16, y: sideStep > 0 ? -hop : 0 }; kneeL = { x: -18, y: -12 - hop * 0.5 };
                footR  = { x: 16,  y: sideStep <= 0 ? -hop : 0 }; kneeR = { x: 18,  y: -12 - hop * 0.5 };
                break;

            case "robot_dance":
                let tick = Math.floor(tSlow * 2) % 2 === 0;
                head.y = -60; head.x = tick ? 4 : -4;
                p.headTilt = tick ? 0.18 : -0.18;
                handL  = { x: -16, y: tick ? -23 : -45 }; elbowL = { x: -16, y: -34 };
                handR  = { x: 16,  y: tick ? -45 : -23 }; elbowR = { x: 16,  y: -34 };
                break;

            case "zombie":
                pelvis.x = 4; head.x = 12; head.y = -55 + bounce * 0.5; neck.x = 8;
                p.headTilt = 0.28;
                handL  = { x: 24, y: -40 + Math.sin(tSlow) * 3 }; elbowL = { x: 16, y: -37 };
                handR  = { x: 27, y: -44 - Math.sin(tSlow) * 3 }; elbowR = { x: 18, y: -41 };
                footL  = { x: -10, y: 0 }; footR = { x: 14, y: 0 }; kneeR = { x: 12, y: -10 };
                break;

            case "rickroll":
                let sway = Math.sin(tSlow) * 9;
                pelvis.x = sway; head.x = sway; head.y = -60 + bounce * 0.5; neck.x = sway;
                p.headTilt = sway * 0.02;
                handL  = { x: sway - 13, y: -48 }; elbowL = { x: sway - 16, y: -36 };
                handR  = { x: sway + 16, y: -26 }; elbowR = { x: sway + 18, y: -36 };
                break;

            case "breakdance":
                let spin = fastF * 1.8;
                pelvis.x = 0; pelvis.y = -28;
                neck.x = 0;   neck.y = -14;
                head.x = -6;  head.y = -4;
                p.headTilt = Math.PI;
                elbowL = { x: -11, y: -8 }; handL = { x: -8, y: 0 };
                elbowR = { x: 11,  y: -8 }; handR = { x: 8,  y: 0 };
                footL  = { x: Math.cos(spin) * 23, y: -44 + Math.sin(spin) * 10 };
                kneeL  = { x: Math.cos(spin) * 12, y: -36 + Math.sin(spin) * 5 };
                footR  = { x: Math.cos(spin + Math.PI) * 23, y: -44 + Math.sin(spin + Math.PI) * 10 };
                kneeR  = { x: Math.cos(spin + Math.PI) * 12, y: -36 + Math.sin(spin + Math.PI) * 5 };
                break;

            case "moonwalk":
                head.y = -60 + Math.cos(tSlow) * 2;
                neck.y = -45 + Math.cos(tSlow) * 2;
                p.headTilt = -0.18;
                let slide = Math.sin(tSlow);
                if (slide > 0) {
                    footL = { x: -15 + slide * 16, y: 0 };  kneeL = { x: -8 + slide * 8, y: -10 };
                    footR = { x: 15 - slide * 16,  y: -5 }; kneeR = { x: 10 - slide * 8, y: -15 };
                } else {
                    footL = { x: -15 - slide * 16, y: -5 }; kneeL = { x: -8 - slide * 8, y: -15 };
                    footR = { x: 15 + slide * 16,  y: 0 };  kneeR = { x: 10 + slide * 8, y: -10 };
                }
                handL = { x: -13, y: -28 + Math.sin(tSlow) * 5 }; elbowL = { x: -10, y: -37 };
                handR = { x: 13,  y: -28 - Math.sin(tSlow) * 5 }; elbowR = { x: 10,  y: -37 };
                break;

            // ==========================================
            // PHẦN C: 18 ĐIỆU NHẢY HOT TREND TIKTOK, K-POP & MEME QUỐC TẾ MỚI
            // ==========================================
            case "dance_pedro_raccoon":
                // Gấu trúc Pedro Pedro xoay vòng vẫy 2 tay ngắn ngủn cực hài
                let pedroSpin = Math.sin(beat * 1.4);
                let pedroCos = Math.cos(beat * 1.4);
                pelvis = { x: pedroSpin * 7, y: -16 + Math.abs(pedroCos) * 4 };
                neck   = { x: pedroSpin * 9, y: -39 + Math.abs(pedroCos) * 4 };
                head   = { x: pedroSpin * 11, y: -53 + Math.abs(pedroCos) * 4 };
                p.headTilt = pedroSpin * 0.35;

                elbowL = { x: neck.x - 11, y: neck.y + 4 };
                handL  = { x: neck.x - 16 + pedroCos * 6, y: neck.y - 6 + pedroSpin * 7 };
                elbowR = { x: neck.x + 11, y: neck.y + 4 };
                handR  = { x: neck.x + 16 - pedroCos * 6, y: neck.y - 6 - pedroSpin * 7 };

                kneeL = { x: pelvis.x - 8, y: -8 }; footL = { x: pelvis.x - 10, y: pedroSpin > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x + 8, y: -8 }; footR = { x: pelvis.x + 10, y: pedroSpin <= 0 ? -4 : 0 };
                break;

            case "dance_toothless":
                // Rồng Sún Toothless Dancing Meme: Đập 2 cánh tay khép nách + ngoáy hông + lắc đầu
                let toothPhase = Math.floor(t * 2.2) % 2 === 0 ? 1 : -1;
                let toothFlap = Math.sin(beat * 2.0);
                pelvis = { x: -toothPhase * 8 + toothFlap * 3, y: -18 + Math.abs(toothFlap) * 3 };
                neck   = { x: toothPhase * 5, y: -42 + Math.abs(toothFlap) * 3 };
                head   = { x: toothPhase * 9, y: -56 + Math.abs(toothFlap) * 2 };
                p.headTilt = toothPhase * 0.28 + toothFlap * 0.1;

                elbowL = { x: neck.x - 13, y: -33 + toothFlap * 6 };
                handL  = { x: neck.x - 5,  y: -24 + toothFlap * 8 };
                elbowR = { x: neck.x + 13, y: -33 + toothFlap * 6 };
                handR  = { x: neck.x + 5,  y: -24 + toothFlap * 8 };

                kneeL = { x: pelvis.x - 9, y: -9 }; footL = { x: -13, y: 0 };
                kneeR = { x: pelvis.x + 9, y: -9 }; footR = { x: 13,  y: 0 };
                break;

            case "dance_chipi_chapa":
                // Mèo Chipi Chipi Chapa Chapa: Hai tay ôm sau gáy lắc đầu + nhún chân nhịp đôi
                let chipiSway = Math.sin(beat * 1.5);
                let chipiHop = Math.abs(Math.sin(beat * 3.0)) * 5;
                pelvis = { x: -chipiSway * 8, y: -19 - chipiHop };
                neck   = { x: chipiSway * 5,  y: -43 - chipiHop };
                head   = { x: chipiSway * 9,  y: -57 - chipiHop };
                p.headTilt = chipiSway * 0.36;

                elbowL = { x: neck.x - 14, y: -53 - chipiHop }; handL = { x: head.x - 3, y: -58 - chipiHop };
                elbowR = { x: neck.x + 14, y: -53 - chipiHop }; handR = { x: head.x + 3, y: -58 - chipiHop };

                kneeL = { x: pelvis.x - 9, y: -10 - chipiHop * 0.5 }; footL = { x: -13, y: chipiSway > 0 ? -5 : 0 };
                kneeR = { x: pelvis.x + 9, y: -10 - chipiHop * 0.5 }; footR = { x: 13,  y: chipiSway <= 0 ? -5 : 0 };
                break;

            case "dance_skibidi":
                // Vũ điệu Skibidi Dop Dop Yes Yes: Ưỡn bụng nhún nhịp + đánh tay vuông góc
                let skibStep = Math.sin(beat * 1.25);
                let skibBelly = Math.abs(Math.cos(beat * 1.25)) * 7;
                pelvis = { x: 7 + skibBelly, y: -18 + Math.abs(skibStep) * 4 };
                neck   = { x: -3, y: -42 + Math.abs(skibStep) * 4 };
                head   = { x: 2,  y: -57 + Math.abs(skibStep) * 3 };
                p.headTilt = skibStep * 0.22;

                elbowL = { x: neck.x - 13, y: -38 };
                handL  = { x: neck.x - 13, y: skibStep > 0 ? -51 : -25 };
                elbowR = { x: neck.x + 13, y: -38 };
                handR  = { x: neck.x + 13, y: skibStep <= 0 ? -51 : -25 };

                kneeL = { x: pelvis.x - 9, y: -9 }; footL = { x: -12, y: skibStep > 0 ? -5 : 0 };
                kneeR = { x: pelvis.x + 9, y: -9 }; footR = { x: 14,  y: skibStep <= 0 ? -5 : 0 };
                break;

            case "dance_sigma_walk":
                // Bước đi Patrick Bateman Sigma Phonk: Đi bộ chậm tại chỗ + chu môi chỉ tay ngạo nghễ
                let sigWalk = Math.sin(beat * 0.75);
                let sigCos = Math.cos(beat * 0.75);
                pelvis = { x: 2, y: -20 + Math.abs(sigCos) * 3 };
                neck   = { x: -2, y: -45 + Math.abs(sigCos) * 3 };
                head   = { x: 0, y: -60 + Math.abs(sigCos) * 3 };
                p.headTilt = -0.14 + sigWalk * 0.08;

                // Tay trái đút túi quần, tay phải chỉ ngang ngạo nghễ
                elbowL = { x: neck.x - 11, y: -33 }; handL = { x: pelvis.x - 6, y: -22 };
                elbowR = { x: neck.x + 12, y: -40 }; handR = { x: neck.x + 25, y: -43 + sigWalk * 3 };

                kneeL = { x: pelvis.x - 4 + sigWalk * 10, y: -10 - Math.max(0, sigCos) * 4 };
                footL = { x: pelvis.x - 6 + sigWalk * 15, y: -Math.max(0, sigCos) * 5 };
                kneeR = { x: pelvis.x + 4 - sigWalk * 10, y: -10 - Math.max(0, -sigCos) * 4 };
                footR = { x: pelvis.x + 6 - sigWalk * 15, y: -Math.max(0, -sigCos) * 5 };
                break;

            case "dance_zerotwo_hip":
                // Vũ điệu lắc hông Zero Two / Phút Hơn: Hai tay đặt sau đầu, đánh hông trái phải cực mượt
                let ztHip = Math.sin(beat * 1.05) * 11;
                pelvis = { x: ztHip, y: -19 + Math.abs(ztHip) * 0.2 };
                neck   = { x: -ztHip * 0.25, y: -44 };
                head   = { x: -ztHip * 0.35, y: -59 };
                p.headTilt = -ztHip * 0.025;

                elbowL = { x: neck.x - 13, y: -53 }; handL = { x: head.x - 3, y: -61 };
                elbowR = { x: neck.x + 13, y: -53 }; handR = { x: head.x + 3, y: -61 };

                kneeL = { x: pelvis.x * 0.5 - 9, y: -10 }; footL = { x: -12, y: 0 };
                kneeR = { x: pelvis.x * 0.5 + 9, y: -10 }; footR = { x: 12,  y: 0 };
                break;

            case "dance_super_shy":
                // NewJeans Super Shy / Hype Boy: Quạt tay chéo trên cao rồi dưới thấp + đá gót chân
                let shyWave = Math.sin(beat * 1.2);
                let shySide = Math.floor(t * 2) % 2 === 0 ? 1 : -1;
                pelvis = { x: -shySide * 5, y: -19 + bounce };
                neck   = { x: shySide * 3,  y: -44 + bounce };
                head   = { x: shySide * 5,  y: -59 + bounce };
                p.headTilt = shySide * 0.2;

                elbowL = { x: neck.x - 11 + shySide * 5, y: -46 };
                handL  = { x: neck.x - 4 + shySide * 14, y: -56 + shyWave * 8 };
                elbowR = { x: neck.x + 11 + shySide * 5, y: -46 };
                handR  = { x: neck.x + 8 + shySide * 14, y: -54 - shyWave * 8 };

                kneeL = { x: pelvis.x - 9, y: -10 };
                footL = { x: shySide < 0 ? -21 : -12, y: shySide < 0 ? -5 : 0 };
                kneeR = { x: pelvis.x + 9, y: -10 };
                footR = { x: shySide > 0 ? 21 : 12,   y: shySide > 0 ? -5 : 0 };
                break;

            case "dance_see_tinh":
                // Vũ điệu See Tình: Ghép trái tim trước ngực rồi chỉ tay bắn tim "Tình tình tình tang tang tính"
                let seePhase = Math.floor(t * 2.4) % 2;
                let seeSway = Math.sin(beat * 1.2);
                pelvis = { x: seeSway * 8, y: -19 + bounce * 0.6 };
                neck   = { x: -seeSway * 3, y: -44 + bounce * 0.6 };
                head   = { x: -seeSway * 5, y: -59 + bounce * 0.6 };
                p.headTilt = seeSway * 0.25;

                if (seePhase === 0) {
                    // Ghép tim trên má
                    elbowL = { x: neck.x - 13, y: -48 }; handL = { x: head.x - 2, y: -55 };
                    elbowR = { x: neck.x + 13, y: -48 }; handR = { x: head.x + 2, y: -55 };
                } else {
                    // Bắn tim sang ngang
                    elbowL = { x: neck.x - 12, y: -34 }; handL = { x: pelvis.x - 8, y: -23 };
                    elbowR = { x: neck.x + 13, y: -43 }; handR = { x: neck.x + 25,  y: -46 + seeSway * 5 };
                }
                kneeL = { x: pelvis.x - 9, y: -10 }; footL = { x: -13, y: seeSway > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x + 9, y: -10 }; footR = { x: 13,  y: seeSway <= 0 ? -4 : 0 };
                break;

            case "dance_cat_vibing":
                // Mèo vỗ trống Bongo gật đầu cực mạnh theo nhịp Polka
                let catNod = Math.sin(beat * 1.8);
                pelvis = { x: -2, y: -18 };
                neck   = { x: 3 + Math.max(0, catNod) * 5, y: -42 + Math.max(0, catNod) * 4 };
                head   = { x: 7 + Math.max(0, catNod) * 9, y: -55 + Math.max(0, catNod) * 7 };
                p.headTilt = 0.25 + catNod * 0.32;

                let patL = Math.sin(fastF * 2.2) * 6;
                elbowL = { x: neck.x + 4, y: -33 }; handL = { x: neck.x + 15, y: -28 + patL };
                elbowR = { x: neck.x + 8, y: -33 }; handR = { x: neck.x + 19, y: -28 - patL };

                kneeL = { x: -10, y: -10 }; footL = { x: -14, y: 0 };
                kneeR = { x: 10,  y: -10 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_coffin_dance":
                // Vũ điệu Khiêng Hòm Ghana: Tay phải đỡ trên vai, bước dậm chân nhún gối đồng đều
                let cofStep = Math.sin(beat * 1.1);
                let cofDrop = Math.abs(Math.cos(beat * 1.1)) * 6;
                pelvis = { x: cofStep * 4, y: -17 + cofDrop };
                neck   = { x: cofStep * 3, y: -41 + cofDrop };
                head   = { x: cofStep * 3, y: -56 + cofDrop };
                p.headTilt = cofStep * 0.15;

                // Tay trái vác hòm trên vai trái, tay phải đánh nhịp
                elbowL = { x: neck.x - 13, y: -38 + cofDrop }; handL = { x: neck.x - 6, y: -48 + cofDrop };
                elbowR = { x: neck.x + 12, y: -33 + cofDrop }; handR = { x: neck.x + 18, y: -25 + cofStep * 6 };

                kneeL = { x: pelvis.x - 10, y: -9 - Math.max(0, cofStep) * 6 };
                footL = { x: pelvis.x - 13, y: -Math.max(0, cofStep) * 8 };
                kneeR = { x: pelvis.x + 10, y: -9 - Math.max(0, -cofStep) * 6 };
                footR = { x: pelvis.x + 13, y: -Math.max(0, -cofStep) * 8 };
                break;

            case "dance_tunak_tunak":
                // Vũ điệu Ấn Độ Tunak Tunak Tun: Lắc cổ ngang + xoay cổ tay chỉ trời + nhấc chân
                let tunakNeck = Math.sin(beat * 1.6) * 7;
                let tunakHop = Math.abs(s) * 5;
                pelvis = { x: -tunakNeck * 0.4, y: -18 - tunakHop };
                neck   = { x: 0, y: -42 - tunakHop };
                head   = { x: tunakNeck, y: -57 - tunakHop };
                p.headTilt = -tunakNeck * 0.03;

                elbowL = { x: -13, y: -52 - tunakHop }; handL = { x: -15 + Math.cos(fastF) * 5, y: -65 - tunakHop };
                elbowR = { x: 13,  y: -52 - tunakHop }; handR = { x: 15 - Math.cos(fastF) * 5,  y: -65 - tunakHop };

                kneeL = { x: -13, y: -11 - (s > 0 ? 6 : 0) }; footL = { x: -11, y: s > 0 ? -8 : 0 };
                kneeR = { x: 13,  y: -11 - (s <= 0 ? 6 : 0) }; footR = { x: 11,  y: s <= 0 ? -8 : 0 };
                break;

            case "dance_caramelldansen":
                // Vũ điệu Tai Thỏ Caramelldansen: Hai bàn tay làm tai thỏ trên đỉnh đầu + lắc hông tốc độ cao
                let caraHip = Math.sin(beat * 1.45) * 12;
                let caraBounce = Math.abs(Math.cos(beat * 1.45)) * 5;
                pelvis = { x: caraHip, y: -18 - caraBounce };
                neck   = { x: -caraHip * 0.3, y: -43 - caraBounce };
                head   = { x: -caraHip * 0.5, y: -58 - caraBounce };
                p.headTilt = -caraHip * 0.035;

                elbowL = { x: head.x - 10, y: -56 - caraBounce }; handL = { x: head.x - 5, y: -69 - caraBounce };
                elbowR = { x: head.x + 10, y: -56 - caraBounce }; handR = { x: head.x + 5, y: -69 - caraBounce };

                kneeL = { x: pelvis.x - 8, y: -10 }; footL = { x: -12, y: caraHip > 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 8, y: -10 }; footR = { x: 12,  y: caraHip <= 0 ? -6 : 0 };
                break;

            case "dance_banana_cat":
                // Happy Happy Happy Cat: Nhảy tưng tưng 2 chân vẫy tay mừng rỡ
                let hapJump = Math.abs(Math.sin(beat * 1.5)) * 16;
                let hapTilt = Math.sin(beat * 1.5);
                pelvis = { x: hapTilt * 4, y: -19 - hapJump };
                neck   = { x: hapTilt * 6, y: -43 - hapJump };
                head   = { x: hapTilt * 8, y: -58 - hapJump };
                p.headTilt = hapTilt * 0.32;

                elbowL = { x: neck.x - 12, y: -48 - hapJump }; handL = { x: neck.x - 18, y: -59 - hapJump + s2 * 4 };
                elbowR = { x: neck.x + 12, y: -48 - hapJump }; handR = { x: neck.x + 18, y: -59 - hapJump - s2 * 4 };

                kneeL = { x: pelvis.x - 8, y: -10 - hapJump }; footL = { x: pelvis.x - 7, y: -hapJump };
                kneeR = { x: pelvis.x + 8, y: -10 - hapJump }; footR = { x: pelvis.x + 7, y: -hapJump };
                break;

            case "dance_nyan_cat":
                // Nyan Cat: Bay ngang lơ lửng trên không, tay chân bơi bốn phía
                let nyanY = Math.sin(beat * 1.4) * 6;
                let nyanPad = Math.sin(fastF * 2.2) * 6;
                pelvis = { x: -10, y: -28 + nyanY };
                neck   = { x: 12,  y: -32 + nyanY };
                head   = { x: 24,  y: -38 + nyanY };
                p.headTilt = 0.25;

                elbowL = { x: neck.x - 2, y: neck.y + 10 }; handL = { x: neck.x + 6 + nyanPad, y: neck.y + 18 };
                elbowR = { x: neck.x + 4, y: neck.y + 10 }; handR = { x: neck.x + 12 - nyanPad, y: neck.y + 18 };

                kneeL = { x: pelvis.x - 8, y: pelvis.y + 10 }; footL = { x: pelvis.x - 16 - nyanPad, y: pelvis.y + 16 };
                kneeR = { x: pelvis.x - 2, y: pelvis.y + 10 }; footR = { x: pelvis.x - 10 + nyanPad, y: pelvis.y + 16 };
                break;

            case "dance_crab_rave":
                // Vũ điệu Cua Nhảy Crab Rave: Đứng tấn ngang khuỳnh rộng + 2 tay giơ cao bấm càng cua
                let crabSway = Math.sin(beat * 1.3) * 9;
                let crabSquat = Math.abs(Math.cos(beat * 1.3)) * 6;
                pelvis = { x: crabSway, y: -13 + crabSquat };
                neck   = { x: crabSway, y: -36 + crabSquat };
                head   = { x: crabSway, y: -51 + crabSquat };
                p.headTilt = crabSway * 0.025;

                elbowL = { x: neck.x - 14, y: -44 + crabSquat }; handL = { x: neck.x - 18, y: -57 + crabSquat + Math.abs(s2) * 5 };
                elbowR = { x: neck.x + 14, y: -44 + crabSquat }; handR = { x: neck.x + 18, y: -57 + crabSquat + Math.abs(s2) * 5 };

                kneeL = { x: pelvis.x - 14, y: -9 }; footL = { x: pelvis.x - 18, y: 0 };
                kneeR = { x: pelvis.x + 14, y: -9 }; footR = { x: pelvis.x + 18, y: 0 };
                break;

            case "dance_harlem_shake":
                // Vũ điệu Harlem Shake: Co giật toàn thân + vung tay chân hỗn loạn cực lầy
                let hs1 = Math.sin(fastF * 2.1);
                let hs2 = Math.cos(fastF * 1.7);
                pelvis = { x: hs1 * 9,  y: -18 + hs2 * 4 };
                neck   = { x: -hs1 * 7, y: -42 + hs2 * 4 };
                head   = { x: -hs1 * 11, y: -56 + Math.abs(hs1) * 4 };
                p.headTilt = hs1 * 0.45;

                elbowL = { x: neck.x - 12, y: -38 + hs1 * 10 }; handL = { x: neck.x - 20 + hs2 * 8, y: -48 - hs1 * 12 };
                elbowR = { x: neck.x + 12, y: -38 - hs1 * 10 }; handR = { x: neck.x + 20 - hs2 * 8, y: -48 + hs1 * 12 };

                kneeL = { x: pelvis.x - 11, y: -10 }; footL = { x: -16 + hs2 * 5, y: hs1 > 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 11, y: -10 }; footR = { x: 16 - hs2 * 5,  y: hs1 <= 0 ? -6 : 0 };
                break;

            case "dance_toca_toca":
                // Vũ điệu Anime Toca Toca: Vỗ tay bên trái -> Vỗ tay bên phải -> Xoay hông
                let tocaBeat = Math.sin(beat * 1.15);
                pelvis = { x: -tocaBeat * 8, y: -19 + bounce };
                neck   = { x: tocaBeat * 4,  y: -44 + bounce };
                head   = { x: tocaBeat * 7,  y: -59 + bounce };
                p.headTilt = tocaBeat * 0.25;

                let clapSide = tocaBeat > 0 ? 12 : -12;
                elbowL = { x: neck.x + clapSide * 0.5 - 6, y: -38 };
                handL  = { x: neck.x + clapSide - 2,       y: -45 + Math.abs(s2) * 3 };
                elbowR = { x: neck.x + clapSide * 0.5 + 6, y: -38 };
                handR  = { x: neck.x + clapSide + 2,       y: -45 + Math.abs(s2) * 3 };

                kneeL = { x: pelvis.x - 9, y: -10 }; footL = { x: -13, y: tocaBeat < 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 9, y: -10 }; footR = { x: 13,  y: tocaBeat >= 0 ? -6 : 0 };
                break;

            case "dance_party_rock":
                // Everyday I'm Shuffling LMFAO: Bước chạy bộ trên không + bơm tay chuẩn bài
                let prStep = Math.sin(beat * 1.35);
                let prCos = Math.cos(beat * 1.35);
                pelvis = { x: prStep * 4, y: -19 - Math.abs(prCos) * 4 };
                neck   = { x: 2, y: -44 - Math.abs(prCos) * 4 };
                head   = { x: 4, y: -59 - Math.abs(prCos) * 4 };
                p.headTilt = 0.15 + prStep * 0.1;

                elbowL = { x: neck.x - 10, y: -34 }; handL = { x: neck.x - 4 - prStep * 10, y: -25 - prCos * 6 };
                elbowR = { x: neck.x + 10, y: -34 }; handR = { x: neck.x + 4 + prStep * 10, y: -25 + prCos * 6 };

                kneeL = { x: pelvis.x - 5 + prStep * 11, y: -11 - Math.max(0, prCos) * 7 };
                footL = { x: pelvis.x - 8 + prStep * 15, y: -Math.max(0, prCos) * 9 };
                kneeR = { x: pelvis.x + 5 - prStep * 11, y: -11 - Math.max(0, -prCos) * 7 };
                footR = { x: pelvis.x + 8 - prStep * 15, y: -Math.max(0, -prCos) * 9 };
                break;

            // ==========================================
            // PHẦN D: 16 ĐIỆU NHẢY ANIME, MANGA & GAME MEME MỚI
            // ==========================================
            case "dance_goku_fusion":
                // Lưỡng Long Nhất Thể Dragon Ball "Fuuu-sion HA!": Nghiêng người chụm 2 ngón trỏ
                let fusPhase = Math.sin(beat * 0.7);
                let fusLean = fusPhase > 0 ? 10 : -8;
                pelvis = { x: -fusLean * 0.5, y: -17 };
                neck   = { x: fusLean * 0.7,  y: -40 };
                head   = { x: fusLean * 1.1,  y: -54 };
                p.headTilt = fusLean * 0.03;

                elbowL = { x: neck.x + (fusPhase > 0 ? 8 : -14), y: -46 };
                handL  = { x: neck.x + (fusPhase > 0 ? 21 : -24), y: -50 };
                elbowR = { x: neck.x + (fusPhase > 0 ? 12 : -10), y: -48 };
                handR  = { x: neck.x + (fusPhase > 0 ? 23 : -22), y: -50 };

                kneeL = { x: -14, y: -10 }; footL = { x: -19, y: 0 };
                kneeR = { x: 14,  y: -12 }; footR = { x: 14,  y: fusPhase > 0 ? -6 : 0 };
                break;

            case "dance_ginyu_force":
                // Biệt đội Sát Thủ Ginyu Tokusentai: Tạo dáng siêu nhân cực dị thay đổi liên tục
                let ginStep = Math.floor(t * 2.0) % 3;
                if (ginStep === 0) {
                    pelvis = { x: -8, y: -15 }; neck = { x: 6, y: -37 }; head = { x: 10, y: -51 };
                    p.headTilt = 0.4;
                    elbowL = { x: neck.x - 14, y: -45 }; handL = { x: neck.x - 24, y: -54 };
                    elbowR = { x: neck.x + 14, y: -29 }; handR = { x: neck.x + 24, y: -22 };
                    kneeL = { x: -16, y: -8 }; footL = { x: -21, y: 0 };
                    kneeR = { x: 8,   y: -8 }; footR = { x: 15,  y: 0 };
                } else if (ginStep === 1) {
                    pelvis = { x: 8, y: -16 }; neck = { x: -6, y: -38 }; head = { x: -8, y: -52 };
                    p.headTilt = -0.35;
                    elbowL = { x: neck.x - 13, y: -48 }; handL = { x: neck.x - 2, y: -59 };
                    elbowR = { x: neck.x + 13, y: -48 }; handR = { x: neck.x + 2, y: -59 };
                    kneeL = { x: -6, y: -14 }; footL = { x: -4, y: -7 };
                    kneeR = { x: 14, y: -8 };  footR = { x: 18, y: 0 };
                } else {
                    pelvis = { x: 0, y: -12 }; neck = { x: 0, y: -34 }; head = { x: 0, y: -48 };
                    p.headTilt = 0;
                    elbowL = { x: -14, y: -34 }; handL = { x: -24, y: -44 };
                    elbowR = { x: 14,  y: -34 }; handR = { x: 24,  y: -44 };
                    kneeL = { x: -15, y: -6 }; footL = { x: -20, y: 0 };
                    kneeR = { x: 15,  y: -6 }; footR = { x: 20,  y: 0 };
                }
                break;

            case "dance_naruto_run":
                // Chạy Ninja Naruto tại chỗ: Cúi rạp người về trước, 2 tay vắt ngược ra sau, chân guồng tốc độ cao
                let narRun = Math.sin(fastF * 2.4);
                let narCos = Math.cos(fastF * 2.4);
                pelvis = { x: -6, y: -18 + Math.abs(narCos) * 3 };
                neck   = { x: 12, y: -33 + Math.abs(narCos) * 3 };
                head   = { x: 23, y: -42 + Math.abs(narCos) * 3 };
                p.headTilt = 0.35;

                // Hai tay vắt thẳng ra sau lưng
                elbowL = { x: neck.x - 13, y: -31 }; handL = { x: neck.x - 26, y: -28 + narRun * 2 };
                elbowR = { x: neck.x - 11, y: -29 }; handR = { x: neck.x - 24, y: -25 - narRun * 2 };

                kneeL = { x: pelvis.x + narRun * 12, y: -10 - Math.max(0, narCos) * 6 };
                footL = { x: pelvis.x + narRun * 16, y: -Math.max(0, narCos) * 9 };
                kneeR = { x: pelvis.x - narRun * 12, y: -10 - Math.max(0, -narCos) * 6 };
                footR = { x: pelvis.x - narRun * 16, y: -Math.max(0, -narCos) * 9 };
                break;

            case "dance_one_piece_franky":
                // Franky SUUUUPER!! Pose: Hai cẳng tay chập nhau trên đỉnh đầu ghép ngôi sao
                let supPulse = Math.sin(t * 7) * 2;
                pelvis = { x: -5, y: -17 };
                neck   = { x: 3,  y: -41 };
                head   = { x: 5,  y: -56 + supPulse };
                p.headTilt = -0.2;

                elbowL = { x: neck.x - 13, y: -52 }; handL = { x: neck.x - 2, y: -64 + supPulse };
                elbowR = { x: neck.x + 13, y: -52 }; handR = { x: neck.x + 2, y: -64 + supPulse };

                kneeL = { x: -14, y: -9 }; footL = { x: -20, y: 0 };
                kneeR = { x: 12,  y: -9 }; footR = { x: 18,  y: 0 };
                break;

            case "dance_sanji_heart":
                // Sanji Mắt Trái Tim: Uốn lượn toàn thân như sợi mì + dâng trái tim về phía trước
                let noodle = Math.sin(beat * 1.5);
                let noodle2 = Math.cos(beat * 1.5);
                pelvis = { x: noodle * 9,  y: -19 + bounce };
                neck   = { x: noodle2 * 8, y: -43 + bounce };
                head   = { x: -noodle * 7, y: -58 + bounce };
                p.headTilt = noodle * 0.35;

                elbowL = { x: neck.x + 10, y: -38 }; handL = { x: neck.x + 21, y: -44 + noodle * 4 };
                elbowR = { x: neck.x + 12, y: -36 }; handR = { x: neck.x + 23, y: -42 + noodle * 4 };

                kneeL = { x: pelvis.x - 8 + noodle2 * 5, y: -10 }; footL = { x: -11, y: noodle > 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 8 - noodle2 * 5, y: -10 }; footR = { x: 11,  y: noodle <= 0 ? -6 : 0 };
                break;

            case "dance_chopper_peek":
                // Chopper ngại ngùng lắc mông vẫy tay "Đồ ngốc có khen cũng không vui đâu!"
                let chopWiggle = Math.sin(beat * 1.6) * 9;
                pelvis = { x: chopWiggle, y: -18 + bounce * 0.5 };
                neck   = { x: -chopWiggle * 0.5, y: -42 + bounce * 0.5 };
                head   = { x: -chopWiggle * 0.8, y: -56 + bounce * 0.5 };
                p.headTilt = -chopWiggle * 0.04;

                elbowL = { x: neck.x - 12, y: -35 }; handL = { x: neck.x - 19, y: -27 + chopWiggle * 0.6 };
                elbowR = { x: neck.x + 12, y: -35 }; handR = { x: neck.x + 19, y: -27 - chopWiggle * 0.6 };

                kneeL = { x: pelvis.x - 8, y: -9 }; footL = { x: -11, y: 0 };
                kneeR = { x: pelvis.x + 8, y: -9 }; footR = { x: 11,  y: 0 };
                break;

            case "dance_baki_schizo":
                // Baki ngồi ghế vô hình dùng dao nĩa ăn bít tết tưởng tượng giữa trận
                let cutMove = Math.sin(fastF * 1.8) * 5;
                pelvis = { x: -6, y: -14 };
                neck   = { x: 2,  y: -37 };
                head   = { x: 6,  y: -51 + Math.abs(cutMove) * 0.4 };
                p.headTilt = 0.22;

                elbowL = { x: neck.x + 8,  y: -29 }; handL = { x: neck.x + 17 - cutMove, y: -25 };
                elbowR = { x: neck.x + 10, y: -29 }; handR = { x: neck.x + 19 + cutMove, y: -25 };

                // Đùi vuông góc như đang ngồi ghế vô hình
                kneeL = { x: pelvis.x + 11, y: -13 }; footL = { x: pelvis.x + 11, y: 0 };
                kneeR = { x: pelvis.x + 14, y: -13 }; footR = { x: pelvis.x + 14, y: 0 };
                break;

            case "dance_dio_wryyy":
                // DIO WRYYYYY!! Ngửa lưng cực gắt ra sau, hai tay quặp xuống hét vang
                let wryShake = Math.sin(fastF * 3.0) * 1.5;
                pelvis = { x: 11,  y: -17 };
                neck   = { x: -4,  y: -35 };
                head   = { x: -15 + wryShake, y: -44 };
                p.headTilt = -0.85;

                elbowL = { x: neck.x - 6, y: -23 }; handL = { x: neck.x - 10, y: -11 + wryShake };
                elbowR = { x: neck.x + 8, y: -23 }; handR = { x: neck.x + 12, y: -11 - wryShake };

                kneeL = { x: pelvis.x - 12, y: -9 }; footL = { x: -14, y: 0 };
                kneeR = { x: pelvis.x + 8,  y: -9 }; footR = { x: 18,  y: 0 };
                break;

            case "dance_torture_dance":
                // JoJo Torture Dance (Vocal Percussion): Khuỵu gối, 1 tay che mắt, 1 tay chỉ ngang giật nhịp
                let tortPop = Math.floor(beat * 1.2) % 2 === 0 ? 1 : -1;
                let tortBounce = Math.abs(s2) * 5;
                pelvis = { x: -4 * tortPop, y: -15 + tortBounce };
                neck   = { x: 4 * tortPop,  y: -38 + tortBounce };
                head   = { x: 6 * tortPop,  y: -52 + tortBounce };
                p.headTilt = 0.25 * tortPop;

                elbowL = { x: neck.x - 12, y: -46 + tortBounce }; handL = { x: head.x + 2,  y: head.y + 1 };
                elbowR = { x: neck.x + 13, y: -38 + tortBounce }; handR = { x: neck.x + 25, y: -38 + tortBounce };

                kneeL = { x: pelvis.x - 12, y: -8 }; footL = { x: -16, y: 0 };
                kneeR = { x: pelvis.x + 14, y: -8 }; footR = { x: 18,  y: 0 };
                break;

            case "dance_saitama_ok":
                // Saitama đứng mặt đơ nhún vai rồi tập Squat nhàn hạ
                let saiSquat = Math.max(0, Math.sin(beat * 0.85)) * 10;
                pelvis = { x: 0, y: -20 + saiSquat };
                neck   = { x: 0, y: -45 + saiSquat };
                head   = { x: 0, y: -60 + saiSquat };
                p.headTilt = 0;

                elbowL = { x: -12, y: -33 + saiSquat * 0.6 }; handL = { x: -14, y: -21 + saiSquat * 0.4 };
                elbowR = { x: 12,  y: -33 + saiSquat * 0.6 }; handR = { x: 14,  y: -21 + saiSquat * 0.4 };

                kneeL = { x: -10 - saiSquat * 0.4, y: -10 + saiSquat * 0.4 }; footL = { x: -14, y: 0 };
                kneeR = { x: 10 + saiSquat * 0.4,  y: -10 + saiSquat * 0.4 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_default_fortnite":
                // Fortnite Default Dance: Vỗ tay -> Khoanh tay trước ngực -> Chỉ tay
                let fnStep = Math.floor(t * 2.4) % 3;
                pelvis = { x: s * 5, y: -19 + bounce };
                neck   = { x: 0, y: -44 + bounce };
                head   = { x: -s * 3, y: -59 + bounce };
                p.headTilt = s * 0.18;

                if (fnStep === 0) { // Vỗ tay
                    elbowL = { x: -11, y: -38 }; handL = { x: -1, y: -44 + bounce };
                    elbowR = { x: 11,  y: -38 }; handR = { x: 1,  y: -44 + bounce };
                } else if (fnStep === 1) { // Khoanh tay
                    elbowL = { x: -14, y: -35 }; handL = { x: 4,  y: -35 };
                    elbowR = { x: 14,  y: -35 }; handR = { x: -4, y: -35 };
                } else { // Chỉ tay
                    elbowL = { x: -12, y: -33 }; handL = { x: -8, y: -22 };
                    elbowR = { x: 13,  y: -43 }; handR = { x: 25, y: -46 };
                }
                kneeL = { x: pelvis.x - 10, y: -10 }; footL = { x: -14, y: fnStep === 1 ? -5 : 0 };
                kneeR = { x: pelvis.x + 10, y: -10 }; footR = { x: 14,  y: fnStep === 2 ? -5 : 0 };
                break;

            case "dance_electro_swing":
                // Fortnite Electro Swing: Đánh tay cổ điển + đá gót chân vui nhộn
                let elSwing = Math.sin(beat * 1.25);
                pelvis = { x: elSwing * 7, y: -19 + bounce };
                neck   = { x: -elSwing * 4, y: -44 + bounce };
                head   = { x: -elSwing * 6, y: -59 + bounce };
                p.headTilt = -elSwing * 0.25;

                elbowL = { x: neck.x - 12, y: -35 }; handL = { x: neck.x - 18 + elSwing * 8, y: -25 - elSwing * 7 };
                elbowR = { x: neck.x + 12, y: -42 }; handR = { x: neck.x + 20 + elSwing * 6, y: -50 + elSwing * 7 };

                kneeL = { x: pelvis.x - 9 + elSwing * 6, y: -11 }; footL = { x: pelvis.x - 14 + elSwing * 10, y: elSwing > 0 ? -6 : 0 };
                kneeR = { x: pelvis.x + 9 + elSwing * 6, y: -11 }; footR = { x: pelvis.x + 14 + elSwing * 10, y: elSwing <= 0 ? -6 : 0 };
                break;

            case "dance_boogie_down":
                // Fortnite Boogie Down: Xoay 2 bàn tay trước ngực + nhún nhảy disco
                let bgSpin = t * 15;
                pelvis = { x: s * 6, y: -18 + bounce };
                neck   = { x: -s * 3, y: -43 + bounce };
                head   = { x: -s * 4, y: -58 + bounce };
                p.headTilt = s * 0.2;

                elbowL = { x: neck.x - 12, y: -35 };
                handL  = { x: neck.x - 4 + Math.cos(bgSpin) * 6, y: -36 + Math.sin(bgSpin) * 6 };
                elbowR = { x: neck.x + 12, y: -35 };
                handR  = { x: neck.x + 4 + Math.cos(bgSpin + Math.PI) * 6, y: -36 + Math.sin(bgSpin + Math.PI) * 6 };

                kneeL = { x: pelvis.x - 10, y: -10 }; footL = { x: -14, y: s > 0 ? -5 : 0 };
                kneeR = { x: pelvis.x + 10, y: -10 }; footR = { x: 14,  y: s <= 0 ? -5 : 0 };
                break;

            case "dance_gta_san_andreas":
                // CJ GTA San Andreas Respect Groove: Nhún chân hiphop + vung tay chữ W
                let cjBounce = Math.abs(s) * 7;
                pelvis = { x: -4, y: -17 + cjBounce };
                neck   = { x: 2,  y: -41 + cjBounce };
                head   = { x: 4,  y: -56 + cjBounce };
                p.headTilt = 0.18 + s * 0.1;

                elbowL = { x: neck.x - 14, y: -34 + cjBounce }; handL = { x: neck.x - 9,  y: -45 + cjBounce + s * 4 };
                elbowR = { x: neck.x + 14, y: -34 + cjBounce }; handR = { x: neck.x + 12, y: -45 + cjBounce - s * 4 };

                kneeL = { x: -13, y: -9 + cjBounce * 0.4 }; footL = { x: -16, y: 0 };
                kneeR = { x: 13,  y: -9 + cjBounce * 0.4 }; footR = { x: 16,  y: 0 };
                break;

            case "dance_minecraft_crouch":
                // Minecraft Spam Shift Hòa Bình: Nhấp nhổm ngồi xổm tốc độ cao + đập tay chào bạn
                let mcCrouch = (Math.floor(t * 9) % 2) * 8;
                let mcPunch = Math.sin(fastF * 2.5) * 8;
                pelvis = { x: -3, y: -18 + mcCrouch };
                neck   = { x: 3 + mcCrouch * 0.3, y: -42 + mcCrouch };
                head   = { x: 6 + mcCrouch * 0.4, y: -56 + mcCrouch };
                p.headTilt = mcCrouch * 0.03;

                elbowL = { x: neck.x - 10, y: -32 + mcCrouch }; handL = { x: neck.x - 6, y: -22 + mcCrouch };
                elbowR = { x: neck.x + 11, y: -35 + mcCrouch }; handR = { x: neck.x + 18 + Math.max(0, mcPunch), y: -32 + mcCrouch + mcPunch * 0.5 };

                kneeL = { x: -11, y: -9 + mcCrouch * 0.4 }; footL = { x: -14, y: 0 };
                kneeR = { x: 11,  y: -9 + mcCrouch * 0.4 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_among_us_vent":
                // Among Us Impostor Sus Dance: Lắc lư cái đầu + giấu tay lén lút sau lưng
                let susSway = Math.sin(beat * 1.4) * 6;
                pelvis = { x: susSway, y: -18 + bounce };
                neck   = { x: susSway * 0.8, y: -42 + bounce };
                head   = { x: susSway * 1.1, y: -56 + bounce };
                p.headTilt = susSway * 0.04;

                // Tay trái giấu sau lưng, tay phải đưa lên miệng "Shhh!"
                elbowL = { x: neck.x - 12, y: -32 }; handL = { x: pelvis.x - 8, y: -22 };
                elbowR = { x: neck.x + 12, y: -42 }; handR = { x: head.x + 4,   y: -52 };

                kneeL = { x: pelvis.x - 9, y: -9 }; footL = { x: -12, y: susSway > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x + 9, y: -9 }; footR = { x: 12,  y: susSway <= 0 ? -4 : 0 };
                break;

            // ==========================================
            // PHẦN E: 14 ĐIỆU NHẢY ĐẶC SẢN HÀI HƯỚC VIỆT NAM & ĐỜI THƯỜNG
            // ==========================================
            case "dance_vinh_rau_mua":
                // Múa Võ Bịp chém gió rồi ôm lưng đau cột sống cực hài
                let vrPhase = (t % 2.0) / 2.0;
                if (vrPhase < 0.65) {
                    let vrSpin = t * 22;
                    pelvis = { x: s * 5, y: -16 };
                    neck   = { x: -s * 4, y: -40 };
                    head   = { x: -s * 6, y: -55 };
                    p.headTilt = s * 0.25;

                    elbowL = { x: neck.x - 13, y: -38 }; handL = { x: neck.x - 18 + Math.cos(vrSpin) * 10, y: -40 + Math.sin(vrSpin) * 10 };
                    elbowR = { x: neck.x + 13, y: -38 }; handR = { x: neck.x + 18 + Math.sin(vrSpin) * 10, y: -40 + Math.cos(vrSpin) * 10 };
                    kneeL = { x: -14, y: -8 }; footL = { x: -18, y: 0 };
                    kneeR = { x: 14,  y: -14 }; footR = { x: 12,  y: -6 };
                } else {
                    // Ôm lưng đau cột sống
                    let ache = Math.sin(fastF * 3) * 1.5;
                    pelvis = { x: -8, y: -15 };
                    neck   = { x: 6,  y: -36 };
                    head   = { x: 12 + ache, y: -49 };
                    p.headTilt = 0.42;

                    elbowL = { x: -12, y: -26 }; handL = { x: pelvis.x - 3, y: -17 };
                    elbowR = { x: 6,   y: -26 }; handR = { x: pelvis.x + 2, y: -17 };
                    kneeL = { x: -12, y: -8 }; footL = { x: -14, y: 0 };
                    kneeR = { x: 8,   y: -8 }; footR = { x: 12,  y: 0 };
                }
                break;

            case "dance_lac_bau_cua":
                // Ngồi xổm lắc đĩa Bầu Cua Tôm Cá 2 tay rồi đập mạnh xuống mở bát
                let bcCycle = (t % 1.8) / 1.8;
                pelvis = { x: -4, y: -11 };
                neck   = { x: 4,  y: -33 };
                head   = { x: 7,  y: -47 };
                kneeL  = { x: -12, y: -6 }; footL = { x: -10, y: 0 };
                kneeR  = { x: 12,  y: -6 }; footR = { x: 12,  y: 0 };

                if (bcCycle < 0.65) {
                    let shakeD = Math.sin(fastF * 3.0) * 8;
                    p.headTilt = shakeD * 0.03;
                    elbowL = { x: neck.x - 8, y: -26 }; handL = { x: neck.x + 12, y: -32 + shakeD };
                    elbowR = { x: neck.x + 10, y: -26 }; handR = { x: neck.x + 16, y: -32 + shakeD };
                } else {
                    // Đập bát xuống đất hô to
                    p.headTilt = 0.35;
                    elbowL = { x: neck.x - 10, y: -24 }; handL = { x: -14, y: -18 };
                    elbowR = { x: neck.x + 10, y: -18 }; handR = { x: 15,  y: -2 };
                }
                break;

            case "dance_da_cau":
                // Đá Cầu Kiểng Công Viên: Tâng cầu bằng đùi và mu bàn chân
                let cauKick = Math.max(0, Math.sin(beat * 1.25));
                let cauSide = Math.sin(beat * 0.625) >= 0 ? 1 : -1;
                pelvis = { x: -cauSide * 3, y: -19 + bounce * 0.4 };
                neck   = { x: 0, y: -44 + bounce * 0.4 };
                head   = { x: cauSide * 3, y: -59 + bounce * 0.4 };
                p.headTilt = cauSide * 0.15;

                elbowL = { x: -13, y: -34 }; handL = { x: -19, y: -25 - cauKick * 6 };
                elbowR = { x: 13,  y: -34 }; handR = { x: 19,  y: -25 - cauKick * 6 };

                if (cauSide > 0) {
                    kneeL = { x: -10, y: -10 }; footL = { x: -12, y: 0 };
                    kneeR = { x: 12,  y: -11 - cauKick * 9 }; footR = { x: 18, y: -2 - cauKick * 12 };
                } else {
                    kneeR = { x: 10,  y: -10 }; footR = { x: 12, y: 0 };
                    kneeL = { x: -12, y: -11 - cauKick * 9 }; footL = { x: -18, y: -2 - cauKick * 12 };
                }
                break;

            case "dance_tap_the_duc":
                // Tập Thể Dục Buổi Sáng 1-2-3-4-5-6-7-8
                let tdStep = Math.floor(t * 2.5) % 4;
                pelvis = { x: 0, y: -20 + bounce * 0.4 };
                neck   = { x: 0, y: -45 + bounce * 0.4 };
                head   = { x: 0, y: -60 + bounce * 0.4 };
                p.headTilt = 0;

                if (tdStep === 0) { // Nhịp 1: Tay giơ thẳng lên trời
                    elbowL = { x: -10, y: -56 }; handL = { x: -8, y: -69 };
                    elbowR = { x: 10,  y: -56 }; handR = { x: 8,  y: -69 };
                    footL = { x: -16, y: 0 }; footR = { x: 16, y: 0 };
                } else if (tdStep === 1) { // Nhịp 2: Tay dang ngang vai
                    elbowL = { x: -14, y: -44 }; handL = { x: -28, y: -44 };
                    elbowR = { x: 14,  y: -44 }; handR = { x: 28,  y: -44 };
                    footL = { x: -18, y: 0 }; footR = { x: 18, y: 0 };
                } else if (tdStep === 2) { // Nhịp 3: Hai tay đan trước ngực + ngồi khuỵu gối
                    pelvis.y = -14; neck.y = -38; head.y = -53;
                    elbowL = { x: -13, y: -36 }; handL = { x: -2, y: -38 };
                    elbowR = { x: 13,  y: -36 }; handR = { x: 2,  y: -38 };
                    kneeL = { x: -13, y: -8 }; kneeR = { x: 13, y: -8 };
                } else { // Nhịp 4: Đứng nghiêm
                    elbowL = { x: -10, y: -32 }; handL = { x: -10, y: -19 };
                    elbowR = { x: 10,  y: -32 }; handR = { x: 10,  y: -19 };
                    footL = { x: -8, y: 0 }; footR = { x: 8, y: 0 };
                }
                break;

            case "dance_vinh_xuan_bip":
                // Múa Mộc Nhân Vịnh Xuân: Đứng tấn Diệp Vấn + 2 tay quạt liên hoàn trước ngực tốc độ cao
                let vxFast = Math.sin(fastF * 3.2);
                let vxCos = Math.cos(fastF * 3.2);
                pelvis = { x: -3, y: -17 };
                neck   = { x: 0,  y: -41 };
                head   = { x: 2,  y: -56 };
                p.headTilt = 0.08;

                elbowL = { x: 6, y: -34 }; handL = { x: 18 + vxFast * 7, y: -40 + vxCos * 6 };
                elbowR = { x: 8, y: -35 }; handR = { x: 20 - vxFast * 7, y: -42 - vxCos * 6 };

                kneeL = { x: -10, y: -9 }; footL = { x: -14, y: 0 };
                kneeR = { x: 11,  y: -9 }; footR = { x: 15,  y: 0 };
                break;

            case "dance_bua_yeu_dj":
                // DJ Chà Đĩa Vinahouse: Một tay giữ tai nghe một bên, một tay chà đĩa + gật đầu cực căng
                let djNod = Math.abs(Math.sin(beat * 1.6)) * 6;
                let djScratch = Math.sin(fastF * 2.6) * 7;
                pelvis = { x: -3, y: -18 + djNod * 0.5 };
                neck   = { x: 3,  y: -42 + djNod * 0.7 };
                head   = { x: 6,  y: -56 + djNod };
                p.headTilt = 0.22 + djNod * 0.03;

                // Tay trái áp tai nghe lên đầu, tay phải chà đĩa phía trước
                elbowL = { x: neck.x - 12, y: -48 + djNod * 0.7 }; handL = { x: head.x - 3, y: head.y + 1 };
                elbowR = { x: neck.x + 10, y: -33 }; handR = { x: neck.x + 19 + djScratch, y: -27 };

                kneeL = { x: -11, y: -9 }; footL = { x: -15, y: 0 };
                kneeR = { x: 11,  y: -9 }; footR = { x: 15,  y: djNod > 3 ? -3 : 0 };
                break;

            case "dance_dua_thuyen":
                // Ngồi bệt Chèo Thuyền Đua Ghe Ngo trên cạn cực sung
                let rowCycle = Math.sin(beat * 1.4);
                let rowCos = Math.cos(beat * 1.4);
                pelvis = { x: -6, y: -7 };
                neck   = { x: -2 + rowCycle * 6, y: -29 };
                head   = { x: rowCycle * 8,      y: -43 };
                p.headTilt = rowCycle * 0.22;

                elbowL = { x: neck.x + 6 - rowCycle * 6, y: -22 + rowCos * 4 };
                handL  = { x: neck.x + 14 - rowCycle * 11, y: -14 + rowCos * 6 };
                elbowR = { x: neck.x + 8 - rowCycle * 6, y: -20 + rowCos * 4 };
                handR  = { x: neck.x + 16 - rowCycle * 11, y: -10 + rowCos * 6 };

                kneeL = { x: 7,  y: -7 }; footL = { x: 19, y: -2 };
                kneeR = { x: 10, y: -5 }; footR = { x: 22, y: 0 };
                break;

            case "dance_nhay_day":
                // Nhảy Dây Tốc Độ Cao: Bật nhảy 2 chân chụm + 2 cổ tay xoay dây
                let ropeHop = Math.abs(Math.sin(beat * 1.6)) * 14;
                let ropeRot = beat * 1.6;
                pelvis = { x: 0, y: -20 - ropeHop };
                neck   = { x: 0, y: -45 - ropeHop };
                head   = { x: 0, y: -60 - ropeHop };
                p.headTilt = Math.sin(ropeRot) * 0.08;

                elbowL = { x: -12, y: -34 - ropeHop };
                handL  = { x: -19 + Math.cos(ropeRot) * 4, y: -28 - ropeHop + Math.sin(ropeRot) * 4 };
                elbowR = { x: 12,  y: -34 - ropeHop };
                handR  = { x: 19 + Math.cos(ropeRot) * 4,  y: -28 - ropeHop + Math.sin(ropeRot) * 4 };

                kneeL = { x: -6, y: -10 - ropeHop * 1.1 }; footL = { x: -5, y: -ropeHop * 1.15 };
                kneeR = { x: 6,  y: -10 - ropeHop * 1.1 }; footR = { x: 5,  y: -ropeHop * 1.15 };
                break;

            case "dance_lac_vong":
                // Lắc Vòng Hula Hoop Siêu Dẻo: Hai tay chắp cao, hông ngoáy vòng tròn biên độ lớn
                let hulaSwirl = Math.sin(beat * 1.7) * 13;
                pelvis = { x: hulaSwirl, y: -19 + Math.abs(Math.cos(beat * 1.7)) * 3 };
                neck   = { x: -hulaSwirl * 0.2, y: -44 };
                head   = { x: -hulaSwirl * 0.3, y: -59 };
                p.headTilt = hulaSwirl * 0.02;

                elbowL = { x: neck.x - 13, y: -53 }; handL = { x: neck.x - 5, y: -65 };
                elbowR = { x: neck.x + 13, y: -53 }; handR = { x: neck.x + 5, y: -65 };

                kneeL = { x: pelvis.x * 0.5 - 9, y: -10 }; footL = { x: -12, y: 0 };
                kneeR = { x: pelvis.x * 0.5 + 9, y: -10 }; footR = { x: 12,  y: 0 };
                break;

            case "dance_cau_ca":
                // Ngồi Câu Cá Thư Giãn rồi giật cần câu trêu ngươi đối thủ
                let fishPull = Math.max(0, Math.sin(beat * 0.85));
                pelvis = { x: -8, y: -12 };
                neck   = { x: -2 - fishPull * 5, y: -35 };
                head   = { x: 1 - fishPull * 6,  y: -49 };
                p.headTilt = 0.15 - fishPull * 0.3;

                elbowL = { x: neck.x + 9,  y: -28 }; handL = { x: neck.x + 18 - fishPull * 6, y: -31 - fishPull * 10 };
                elbowR = { x: neck.x + 11, y: -27 }; handR = { x: neck.x + 20 - fishPull * 6, y: -30 - fishPull * 10 };

                kneeL = { x: 5, y: -11 }; footL = { x: 11, y: 0 };
                kneeR = { x: 8, y: -11 }; footR = { x: 15, y: 0 };
                break;

            case "dance_uong_tra":
                // Ngồi Vắt Chân Thưởng Trà Đạo Phong Lưu
                let sipTea = Math.max(0, Math.sin(beat * 0.75));
                pelvis = { x: -4, y: -13 };
                neck   = { x: -2, y: -36 };
                head   = { x: 0,  y: -50 };
                p.headTilt = -sipTea * 0.22;

                // Tay trái đặt lên đùi, tay phải nâng tách trà lên miệng
                elbowL = { x: -10, y: -25 }; handL = { x: 2, y: -16 };
                elbowR = { x: 10,  y: -28 - sipTea * 6 };
                handR  = { x: 8 - sipTea * 5, y: -34 - sipTea * 13 };

                kneeL = { x: 8,  y: -12 }; footL = { x: 8,  y: 0 };
                kneeR = { x: 10, y: -16 }; footR = { x: 18, y: -8 };
                break;

            case "dance_lau_nha":
                // Cầm Chổi Lau Nhà kết hợp gẩy đàn Guitar Bằng Chổi
                let mopSweep = Math.sin(beat * 1.3) * 11;
                pelvis = { x: -mopSweep * 0.4, y: -18 + bounce * 0.5 };
                neck   = { x: mopSweep * 0.3,  y: -42 + bounce * 0.5 };
                head   = { x: mopSweep * 0.5,  y: -56 + bounce * 0.5 };
                p.headTilt = 0.22 + mopSweep * 0.02;

                elbowL = { x: neck.x - 6, y: -33 }; handL = { x: neck.x + 6 + mopSweep * 0.6, y: -25 };
                elbowR = { x: neck.x + 9, y: -35 }; handR = { x: neck.x + 16 + mopSweep,      y: -31 };

                kneeL = { x: pelvis.x - 10, y: -9 }; footL = { x: -14, y: 0 };
                kneeR = { x: pelvis.x + 10, y: -9 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_bom_xe":
                // Bơm Xe Đạp Giữa Sân Đấu: Hai tay ấn ống bơm lên xuống theo nhịp nhún
                let pumpDown = Math.abs(Math.sin(beat * 1.4)) * 10;
                pelvis = { x: -4, y: -19 + pumpDown * 0.6 };
                neck   = { x: 5,  y: -41 + pumpDown * 0.9 };
                head   = { x: 9,  y: -55 + pumpDown };
                p.headTilt = 0.25;

                elbowL = { x: neck.x + 5, y: -32 + pumpDown }; handL = { x: 12, y: -22 + pumpDown * 1.1 };
                elbowR = { x: neck.x + 8, y: -32 + pumpDown }; handR = { x: 16, y: -22 + pumpDown * 1.1 };

                kneeL = { x: -11, y: -10 + pumpDown * 0.3 }; footL = { x: -14, y: 0 };
                kneeR = { x: 9,   y: -10 + pumpDown * 0.3 }; footR = { x: 11,  y: 0 };
                break;

            case "dance_gac_chan_ngay":
                // Nằm Dài Chống Cằm Rung Đùi Ngủ Trưa Trêu Tức Đối Thủ
                let legShake = Math.sin(fastF * 2.0) * 5;
                pelvis = { x: -6,  y: -6 };
                neck   = { x: 15,  y: -14 };
                head   = { x: 24,  y: -25 };
                p.headTilt = 0.35;

                // Tay phải chống khuỷu xuống đất đỡ cằm, tay trái đặt lên hông
                elbowR = { x: 19, y: -2 };  handR = { x: 23, y: -15 };
                elbowL = { x: 4,  y: -16 }; handL = { x: -5, y: -11 };

                kneeL = { x: -19, y: -7 };  footL = { x: -31, y: -1 };
                kneeR = { x: -17, y: -16 }; footR = { x: -25 + legShake, y: -22 - legShake * 0.5 };
                break;

            // ==========================================
            // PHẦN F: 18 VŨ ĐẠO SLAPSTICK, THỂ THAO & BIỂU DIỄN SIÊU NHỘN
            // ==========================================
            case "dance_chicken":
                // Vũ điệu Gà Con (Chicken Dance): Vẫy 2 khuỷu tay như cánh gà + nhún mông vịt
                let chkFlap = Math.abs(Math.sin(beat * 2.2));
                let chkSway = Math.sin(beat * 1.1) * 7;
                pelvis = { x: chkSway, y: -17 + chkFlap * 4 };
                neck   = { x: -chkSway * 0.3, y: -41 + chkFlap * 4 };
                head   = { x: -chkSway * 0.4, y: -56 + chkFlap * 3 };
                p.headTilt = chkSway * 0.03;

                // Bàn tay kẹp nách, 2 khuỷu tay vẫy lên xuống như cánh gà
                elbowL = { x: neck.x - 15, y: -33 - chkFlap * 12 }; handL = { x: neck.x - 5, y: -37 };
                elbowR = { x: neck.x + 15, y: -33 - chkFlap * 12 }; handR = { x: neck.x + 5, y: -37 };

                kneeL = { x: pelvis.x - 10, y: -9 }; footL = { x: -13, y: chkSway > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x + 10, y: -9 }; footR = { x: 13,  y: chkSway <= 0 ? -4 : 0 };
                break;

            case "dance_ballet_spin":
                // Múa Ba-lê Hồ Thiên Nga: Kiễng 1 chân xoay người, 2 tay vòng cung trên đỉnh đầu
                let balSpin = Math.sin(beat * 1.2);
                let balFloat = Math.abs(Math.cos(beat * 1.2)) * 5;
                pelvis = { x: 0, y: -22 - balFloat };
                neck   = { x: 0, y: -47 - balFloat };
                head   = { x: balSpin * 3, y: -62 - balFloat };
                p.headTilt = balSpin * 0.18;

                elbowL = { x: -13 * Math.abs(balSpin) - 3, y: -57 - balFloat }; handL = { x: -2, y: -69 - balFloat };
                elbowR = { x: 13 * Math.abs(balSpin) + 3,  y: -57 - balFloat }; handR = { x: 2,  y: -69 - balFloat };

                kneeL = { x: -4, y: -11 - balFloat }; footL = { x: 0, y: -balFloat * 0.5 };
                kneeR = { x: 12 * balSpin, y: -16 - balFloat }; footR = { x: 3, y: -13 - balFloat };
                break;

            case "dance_hula_hawaii":
                // Vũ điệu Hula Hawaii: Lắc hông mềm mại + 2 tay uốn sóng cùng chiều
                let hulaWave = Math.sin(beat * 1.0);
                let hulaCos = Math.cos(beat * 1.0);
                pelvis = { x: -hulaWave * 9, y: -18 + Math.abs(hulaCos) * 2 };
                neck   = { x: hulaWave * 3,  y: -43 };
                head   = { x: hulaWave * 5,  y: -58 };
                p.headTilt = hulaWave * 0.2;

                let sideDir = hulaWave >= 0 ? 1 : -1;
                elbowL = { x: neck.x + sideDir * 8 - 6, y: -38 + hulaCos * 4 };
                handL  = { x: neck.x + sideDir * 19 - 4, y: -40 - hulaCos * 5 };
                elbowR = { x: neck.x + sideDir * 8 + 6, y: -36 - hulaCos * 4 };
                handR  = { x: neck.x + sideDir * 19 + 4, y: -38 + hulaCos * 5 };

                kneeL = { x: pelvis.x - 8, y: -9 }; footL = { x: -11, y: 0 };
                kneeR = { x: pelvis.x + 8, y: -9 }; footR = { x: 11,  y: 0 };
                break;

            case "dance_samba_carnival":
                // Vũ điệu Samba Lễ Hội Brazil: Đá chân tốc độ cao + lắc vai cuồng nhiệt
                let samFast = Math.sin(beat * 1.8);
                let samCos = Math.cos(beat * 1.8);
                pelvis = { x: samFast * 8, y: -19 + Math.abs(samCos) * 4 };
                neck   = { x: -samFast * 5, y: -44 };
                head   = { x: -samFast * 6, y: -59 };
                p.headTilt = -samFast * 0.22;

                elbowL = { x: neck.x - 13, y: -46 + samCos * 6 }; handL = { x: neck.x - 20, y: -56 - samCos * 6 };
                elbowR = { x: neck.x + 13, y: -46 - samCos * 6 }; handR = { x: neck.x + 20, y: -56 + samCos * 6 };

                kneeL = { x: pelvis.x - 7 + samFast * 8, y: -11 }; footL = { x: pelvis.x - 10 + samFast * 12, y: samFast > 0 ? -7 : 0 };
                kneeR = { x: pelvis.x + 7 - samFast * 8, y: -11 }; footR = { x: pelvis.x + 10 - samFast * 12, y: samFast <= 0 ? -7 : 0 };
                break;

            case "dance_salsa_spin":
                // Vũ điệu Salsa Latin: Bước chéo chân + tay xoay vòng điệu nghệ
                let salBeat = Math.sin(beat * 1.15);
                let salCos = Math.cos(beat * 1.15);
                pelvis = { x: salBeat * 7, y: -19 + bounce * 0.5 };
                neck   = { x: -salBeat * 3, y: -44 + bounce * 0.5 };
                head   = { x: -salBeat * 5, y: -59 + bounce * 0.5 };
                p.headTilt = salBeat * 0.2;

                elbowL = { x: neck.x - 12, y: -36 }; handL = { x: neck.x - 6 + salCos * 10, y: -32 };
                elbowR = { x: neck.x + 12, y: -50 }; handR = { x: neck.x + 6 - salCos * 10, y: -62 };

                kneeL = { x: pelvis.x + salBeat * 8 - 5, y: -10 }; footL = { x: salBeat * 12 - 7, y: salCos > 0 ? -4 : 0 };
                kneeR = { x: pelvis.x - salBeat * 8 + 5, y: -10 }; footR = { x: -salBeat * 12 + 7, y: salCos <= 0 ? -4 : 0 };
                break;

            case "dance_tap_dance":
                // Nhảy Thiết Hài Tap Dance: Hai tay chống nạnh, cổ chân gõ nhịp siêu tốc
                let tapFoot = Math.sin(fastF * 3.0);
                let tapCos = Math.cos(fastF * 3.0);
                pelvis = { x: Math.sin(beat) * 3, y: -20 + Math.abs(tapFoot) * 2 };
                neck   = { x: 0, y: -45 };
                head   = { x: 0, y: -60 };
                p.headTilt = Math.sin(beat) * 0.15;

                // Hai tay chống nạnh lịch lãm
                elbowL = { x: -14, y: -33 }; handL = { x: -7, y: -22 };
                elbowR = { x: 14,  y: -33 }; handR = { x: 7,  y: -22 };

                kneeL = { x: -9 + tapFoot * 5, y: -11 - Math.max(0, tapFoot) * 5 };
                footL = { x: -12 + tapCos * 8, y: -Math.max(0, tapFoot) * 8 };
                kneeR = { x: 9 - tapFoot * 5,  y: -11 - Math.max(0, -tapFoot) * 5 };
                footR = { x: 12 - tapCos * 8,  y: -Math.max(0, -tapFoot) * 8 };
                break;

            case "dance_air_guitar":
                // Solo Đàn Air Guitar Rock N' Roll: Ngửa người gẩy đàn guitar vô hình điên cuồng
                let strum = Math.sin(fastF * 3.2) * 8;
                let rockHead = Math.abs(Math.sin(beat * 1.8)) * 7;
                pelvis = { x: 6,  y: -17 + rockHead * 0.4 };
                neck   = { x: -4, y: -40 + rockHead * 0.6 };
                head   = { x: -6 + rockHead, y: -54 + rockHead };
                p.headTilt = -0.3 + rockHead * 0.08;

                // Tay trái bấm cần đàn cao, tay phải quạt dây đàn ở hông
                elbowL = { x: neck.x - 11, y: -35 }; handL = { x: neck.x - 20, y: -44 };
                elbowR = { x: neck.x + 10, y: -30 }; handR = { x: pelvis.x + 2, y: -22 + strum };

                kneeL = { x: -13, y: -9 }; footL = { x: -19, y: 0 };
                kneeR = { x: 14,  y: -9 }; footR = { x: 20,  y: 0 };
                break;

            case "dance_drummer_solo":
                // Đánh Trống Jazz Solo: Hai tay cầm dùi trống đập liên hoàn + chân phải đạp pedal
                let drumHit = Math.sin(fastF * 3.4) * 10;
                pelvis = { x: -3, y: -16 };
                neck   = { x: 3,  y: -40 };
                head   = { x: 6,  y: -54 + Math.abs(drumHit) * 0.4 };
                p.headTilt = 0.2 + drumHit * 0.02;

                elbowL = { x: neck.x + 5, y: -33 }; handL = { x: neck.x + 17, y: -32 + drumHit };
                elbowR = { x: neck.x + 8, y: -33 }; handR = { x: neck.x + 20, y: -32 - drumHit };

                kneeL = { x: -10, y: -9 }; footL = { x: -13, y: 0 };
                kneeR = { x: 11,  y: -10 }; footR = { x: 16,  y: drumHit > 0 ? -5 : 0 };
                break;

            case "dance_cheerleader":
                // Hoạt Náo Viên Cổ Vũ Pom-Pom: Bật nhảy tách chân chữ V trên không + tung 2 tay
                let cheerJump = Math.max(0, Math.sin(beat * 1.3)) * 18;
                pelvis = { x: 0, y: -19 - cheerJump };
                neck   = { x: 0, y: -44 - cheerJump };
                head   = { x: 0, y: -59 - cheerJump };
                p.headTilt = Math.sin(beat * 1.3) * 0.22;

                let spread = cheerJump / 18;
                elbowL = { x: -12, y: -48 - cheerJump - spread * 6 };
                handL  = { x: -18 - spread * 6, y: -54 - cheerJump - spread * 12 };
                elbowR = { x: 12,  y: -48 - cheerJump - spread * 6 };
                handR  = { x: 18 + spread * 6,  y: -54 - cheerJump - spread * 12 };

                kneeL = { x: -9 - spread * 6, y: -10 - cheerJump };
                footL = { x: -11 - spread * 12, y: -cheerJump * 1.1 };
                kneeR = { x: 9 + spread * 6,  y: -10 - cheerJump };
                footR = { x: 11 + spread * 12,  y: -cheerJump * 1.1 };
                break;

            case "dance_weightlifting":
                // Cử Tạ Quá Sức: Rặn nâng thanh tạ nặng chân run bần bật rồi đẩy bật lên trời
                let liftCycle = (t % 2.2) / 2.2;
                let liftTremble = Math.sin(fastF * 4.0) * 1.8;
                if (liftCycle < 0.55) {
                    // Đang rặn nâng từ dưới lên ngực
                    let liftH = (liftCycle / 0.55) * 18;
                    pelvis = { x: liftTremble, y: -13 + liftH * 0.2 };
                    neck   = { x: liftTremble, y: -36 + liftH * 0.2 };
                    head   = { x: liftTremble, y: -50 + liftH * 0.2 };
                    p.headTilt = liftTremble * 0.08;

                    elbowL = { x: -14, y: -22 - liftH * 0.6 }; handL = { x: -16, y: -14 - liftH };
                    elbowR = { x: 14,  y: -22 - liftH * 0.6 }; handR = { x: 16,  y: -14 - liftH };
                    kneeL = { x: -13 + liftTremble, y: -7 }; footL = { x: -16, y: 0 };
                    kneeR = { x: 13 - liftTremble,  y: -7 }; footR = { x: 16,  y: 0 };
                } else {
                    // Đẩy thẳng tạ lên trên đầu ăn mừng
                    pelvis = { x: 0, y: -19 };
                    neck   = { x: 0, y: -44 };
                    head   = { x: 0, y: -59 };
                    p.headTilt = -0.15;

                    elbowL = { x: -13, y: -55 }; handL = { x: -15, y: -68 + liftTremble * 0.5 };
                    elbowR = { x: 13,  y: -55 }; handR = { x: 15,  y: -68 + liftTremble * 0.5 };
                    kneeL = { x: -12, y: -10 }; footL = { x: -16, y: 0 };
                    kneeR = { x: 12,  y: -10 }; footR = { x: 16,  y: 0 };
                }
                break;

            case "dance_sumo_stomp":
                // Võ Sĩ Sumo Dậm Chân Shiko: Nâng cao từng chân sang ngang rồi dậm mạnh xuống đất
                let sumoPhase = Math.sin(beat * 0.85);
                pelvis = { x: -sumoPhase * 6, y: -13 };
                neck   = { x: -sumoPhase * 9, y: -36 };
                head   = { x: -sumoPhase * 11, y: -50 };
                p.headTilt = -sumoPhase * 0.28;

                elbowL = { x: neck.x - 13, y: -27 }; handL = { x: pelvis.x - 11, y: -15 };
                elbowR = { x: neck.x + 13, y: -27 }; handR = { x: pelvis.x + 11, y: -15 };

                if (sumoPhase > 0) {
                    kneeL = { x: pelvis.x - 11, y: -7 }; footL = { x: -17, y: 0 };
                    kneeR = { x: pelvis.x + 13, y: -13 - sumoPhase * 8 };
                    footR = { x: pelvis.x + 22, y: -sumoPhase * 16 };
                } else {
                    kneeR = { x: pelvis.x + 11, y: -7 }; footR = { x: 17,  y: 0 };
                    kneeL = { x: pelvis.x - 13, y: -13 - (-sumoPhase) * 8 };
                    footL = { x: pelvis.x - 22, y: -(-sumoPhase) * 16 };
                }
                break;

            case "dance_matador_ole":
                // Đấu Sĩ Bò Tót Tây Ban Nha "¡Olé!": Nghiêng người vẫy khăn đỏ qua một bên
                let oleSweep = Math.sin(beat * 1.0);
                pelvis = { x: -oleSweep * 7, y: -19 };
                neck   = { x: oleSweep * 4,  y: -44 };
                head   = { x: oleSweep * 6,  y: -59 };
                p.headTilt = oleSweep * 0.22;

                elbowL = { x: neck.x - 12, y: -33 }; handL = { x: pelvis.x - 6, y: -22 };
                elbowR = { x: neck.x + 11, y: -36 }; handR = { x: neck.x + 14 + oleSweep * 11, y: -28 - Math.abs(oleSweep) * 6 };

                kneeL = { x: pelvis.x - 10, y: -10 }; footL = { x: -14, y: 0 };
                kneeR = { x: pelvis.x + 10, y: -10 }; footR = { x: 14,  y: 0 };
                break;

            case "dance_crying_baby":
                // Ăn Vạ Khóc Nhè: Hai tay dụi mắt hu hu + chân dậm đành đạch tại chỗ
                let crySob = Math.sin(fastF * 2.2) * 3;
                let cryStomp = Math.sin(beat * 2.0);
                pelvis = { x: 0, y: -17 + Math.abs(crySob) };
                neck   = { x: 2, y: -41 + Math.abs(crySob) };
                head   = { x: 4, y: -55 + Math.abs(crySob) };
                p.headTilt = 0.2 + crySob * 0.06;

                // Hai tay đưa lên dụi mắt
                elbowL = { x: -12, y: -44 }; handL = { x: head.x - 3, y: head.y + 1 + crySob };
                elbowR = { x: 13,  y: -44 }; handR = { x: head.x + 4, y: head.y + 1 - crySob };

                kneeL = { x: -10, y: -10 - Math.max(0, cryStomp) * 6 }; footL = { x: -12, y: -Math.max(0, cryStomp) * 8 };
                kneeR = { x: 10,  y: -10 - Math.max(0, -cryStomp) * 6 }; footR = { x: 12,  y: -Math.max(0, -cryStomp) * 8 };
                break;

            case "dance_belly_laugh":
                // Ôm Bụng Cười Ngặt Nghẽo Chỉ Thẳng Mặt Đối Thủ
                let laughShake = Math.sin(fastF * 2.8) * 3;
                pelvis = { x: 5,  y: -17 + Math.abs(laughShake) };
                neck   = { x: -4, y: -40 + Math.abs(laughShake) };
                head   = { x: -9, y: -54 + laughShake };
                p.headTilt = -0.38 + laughShake * 0.05;

                // Tay trái ôm bụng, tay phải chỉ thẳng về phía đối thủ
                elbowL = { x: -10, y: -30 }; handL = { x: pelvis.x + 2, y: -20 + laughShake };
                elbowR = { x: 11,  y: -40 }; handR = { x: 24, y: -42 + laughShake * 1.2 };

                kneeL = { x: -11, y: -9 }; footL = { x: -15, y: 0 };
                kneeR = { x: 13,  y: -11 }; footR = { x: 16,  y: laughShake > 0 ? -4 : 0 };
                break;

            case "dance_magic_levitate":
                // Ảo Thuật Gia Ngồi Thiền Xếp Bằng Tự Bay Lơ Lửng Trên Không
                let levY = -18 + Math.sin(t * 4.5) * 7;
                pelvis = { x: 0, y: -18 + levY };
                neck   = { x: 0, y: -42 + levY };
                head   = { x: 0, y: -57 + levY };
                p.headTilt = Math.sin(t * 3) * 0.1;

                // Hai tay chắp ấn thiền định
                elbowL = { x: -13, y: -32 + levY }; handL = { x: -2, y: -34 + levY };
                elbowR = { x: 13,  y: -32 + levY }; handR = { x: 2,  y: -34 + levY };

                // Hai chân xếp bằng chữ ngũ trên không
                kneeL = { x: -14, y: -15 + levY }; footL = { x: 3,  y: -13 + levY };
                kneeR = { x: 14,  y: -15 + levY }; footR = { x: -3, y: -13 + levY };
                break;

            case "dance_matrix_dodge":
                // Neo Matrix Né Đạn: Ngửa lưng gần ngang mặt đất + 2 tay quạt tròn giữ thăng bằng
                let matDip = Math.abs(Math.sin(beat * 0.9)) * 5;
                let matArm = t * 14;
                pelvis = { x: 10,  y: -16 + matDip * 0.4 };
                neck   = { x: -11, y: -24 + matDip };
                head   = { x: -24, y: -28 + matDip };
                p.headTilt = -1.15;

                elbowL = { x: neck.x - 4, y: neck.y - 11 };
                handL  = { x: neck.x - 4 + Math.cos(matArm) * 10, y: neck.y - 18 + Math.sin(matArm) * 6 };
                elbowR = { x: neck.x + 6, y: neck.y - 11 };
                handR  = { x: neck.x + 6 - Math.cos(matArm) * 10, y: neck.y - 18 - Math.sin(matArm) * 6 };

                kneeL = { x: 14, y: -11 }; footL = { x: 6,  y: 0 };
                kneeR = { x: 18, y: -11 }; footR = { x: 18, y: 0 };
                break;

            case "dance_helicopter_legs":
                // Trực Thăng Chổng Ngược: Chống 2 tay xuống đất, xoay 2 chân ngang như cánh quạt trực thăng
                let heliRot = fastF * 2.5;
                pelvis = { x: 0, y: -32 };
                neck   = { x: 0, y: -14 };
                head   = { x: 4, y: -5 };
                p.headTilt = Math.PI * 0.95;

                elbowL = { x: -11, y: -8 }; handL = { x: -9, y: 0 };
                elbowR = { x: 11,  y: -8 }; handR = { x: 9,  y: 0 };

                kneeL = { x: Math.cos(heliRot) * 14, y: -34 + Math.sin(heliRot) * 3 };
                footL = { x: Math.cos(heliRot) * 27, y: -35 + Math.sin(heliRot) * 5 };
                kneeR = { x: Math.cos(heliRot + Math.PI) * 14, y: -34 + Math.sin(heliRot + Math.PI) * 3 };
                footR = { x: Math.cos(heliRot + Math.PI) * 27, y: -35 + Math.sin(heliRot + Math.PI) * 5 };
                break;

            case "dance_jumping_jacks":
                // Nhảy Bật Tách Chụm Tay Chân (Jumping Jacks)
                let jjOpen = Math.max(0, Math.sin(beat * 1.4));
                let jjAir = jjOpen * 12;
                pelvis = { x: 0, y: -20 - jjAir };
                neck   = { x: 0, y: -45 - jjAir };
                head   = { x: 0, y: -60 - jjAir };
                p.headTilt = 0;

                elbowL = { x: -11 - jjOpen * 3, y: -35 - jjAir - jjOpen * 18 };
                handL  = { x: -12 - jjOpen * 2, y: -22 - jjAir - jjOpen * 44 };
                elbowR = { x: 11 + jjOpen * 3,  y: -35 - jjAir - jjOpen * 18 };
                handR  = { x: 12 + jjOpen * 2,  y: -22 - jjAir - jjOpen * 44 };

                kneeL = { x: -6 - jjOpen * 7, y: -10 - jjAir };
                footL = { x: -6 - jjOpen * 13, y: -jjAir * 0.9 };
                kneeR = { x: 6 + jjOpen * 7,  y: -10 - jjAir };
                footR = { x: 6 + jjOpen * 13,  y: -jjAir * 0.9 };
                break;
        }

        let pose = { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
        return (typeof window.constrainSkeletonPose === 'function') ? window.constrainSkeletonPose(pose, false) : pose;
    },

    // ==========================================
    // HÀM VẼ ĐẠO CỤ & HIỆU ỨNG VUI NHỘN CHO CÁC ĐIỆU NHẢY (KHÔNG GHI ĐÈ CTX.FILTER)
    // ==========================================
    drawDanceProps: function(ctx, p, pts) {
        if (!ctx || !p || !pts) return;
        let state = p.rawMoveState || p.state;
        if (!this.isDanceState(state)) return;

        let now = Date.now();
        let t = now / 1000;
        let handL = pts.handL || { x: -15, y: -35 };
        let handR = pts.handR || { x: 15,  y: -35 };
        let head  = pts.head  || { x: 0,   y: -60 };
        let footL = pts.footL || { x: -12, y: 0 };
        let footR = pts.footR || { x: 12,  y: 0 };

        ctx.save();

        // 1. Nốt nhạc bay lơ lửng quanh vũ công cho mọi điệu nhảy
        let notePhase = (t * 1.8) % 1;
        let noteX = -22 + Math.sin(t * 4) * 6;
        let noteY = head.y - 10 - notePhase * 18;
        ctx.save();
        ctx.globalAlpha = (1 - notePhase) * 0.85;
        ctx.fillStyle = p.color || "#00f3ff";
        ctx.font = "bold 11px Arial";
        ctx.fillText(Math.floor(t * 2) % 2 === 0 ? "♪" : "♫", noteX, noteY);
        ctx.restore();

        // 2. Đạo cụ đặc trưng theo từng điệu nhảy hài hước
        switch (state) {
            case "dance_nhay_day": {
                // Vẽ sợi dây nhảy vòng qua đầu và dưới chân
                let ropePhase = Math.sin((now / 1000) * 12 * 1.6);
                let arcY = head.y - 22 * ropePhase;
                ctx.beginPath();
                ctx.moveTo(handL.x, handL.y);
                ctx.quadraticCurveTo(0, arcY, handR.x, handR.y);
                ctx.strokeStyle = "#f1c40f";
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
            }
            case "dance_lac_vong": {
                // Vẽ chiếc vòng Hula Hoop xoay quanh eo
                let pelvis = pts.pelvis || { x: 0, y: -20 };
                ctx.beginPath();
                ctx.ellipse(pelvis.x + Math.cos(t * 15) * 4, pelvis.y, 18, 4.5, 0.12 * Math.sin(t * 10), 0, Math.PI * 2);
                ctx.strokeStyle = "#ff4757";
                ctx.lineWidth = 2.5;
                ctx.stroke();
                break;
            }
            case "dance_weightlifting": {
                // Vẽ thanh tạ đòn nặng trên 2 bàn tay
                let barY = (handL.y + handR.y) * 0.5;
                ctx.strokeStyle = "#bdc3c7";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(-26, barY);
                ctx.lineTo(26, barY);
                ctx.stroke();
                ctx.fillStyle = "#2c3e50";
                ctx.fillRect(-28, barY - 6, 5, 12);
                ctx.fillRect(23, barY - 6, 5, 12);
                break;
            }
            case "dance_cheerleader": {
                // Vẽ 2 chùm bông cổ vũ Pom-Pom trên 2 tay
                [handL, handR].forEach((h, idx) => {
                    ctx.fillStyle = idx === 0 ? "#ff4757" : "#f1c40f";
                    for (let a = 0; a < 6; a++) {
                        let ang = a * (Math.PI / 3) + t * 8;
                        ctx.beginPath();
                        ctx.arc(h.x + Math.cos(ang) * 4, h.y + Math.sin(ang) * 4, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                break;
            }
            case "dance_da_cau": {
                // Vẽ quả cầu đá kiểng bay nảy giữa không trung
                let cauY = -14 - Math.abs(Math.sin(t * 12 * 1.25)) * 28;
                let cauX = Math.sin(t * 12 * 0.625) * 14;
                ctx.fillStyle = "#f1c40f";
                ctx.beginPath();
                ctx.arc(cauX, cauY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cauX, cauY);
                ctx.lineTo(cauX - 3, cauY - 6);
                ctx.moveTo(cauX, cauY);
                ctx.lineTo(cauX + 3, cauY - 6);
                ctx.stroke();
                break;
            }
            case "dance_cau_ca": {
                // Vẽ cần câu cá và dây câu
                ctx.strokeStyle = "#e67e22";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(handR.x, handR.y);
                ctx.lineTo(handR.x + 24, handR.y - 18);
                ctx.stroke();
                ctx.strokeStyle = "rgba(255,255,255,0.65)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(handR.x + 24, handR.y - 18);
                ctx.lineTo(handR.x + 26, 0);
                ctx.stroke();
                break;
            }
            case "dance_uong_tra": {
                // Vẽ tách trà bốc khói trên tay phải
                ctx.fillStyle = "#ecf0f1";
                ctx.fillRect(handR.x - 3, handR.y - 5, 6, 5);
                ctx.strokeStyle = "rgba(255,255,255,0.7)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(handR.x, handR.y - 7);
                ctx.lineTo(handR.x + Math.sin(t * 8) * 2, handR.y - 13);
                ctx.stroke();
                break;
            }
            case "dance_bom_xe": {
                // Vẽ ống bơm xe đạp thẳng đứng
                ctx.strokeStyle = "#95a5a6";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(14, 0);
                ctx.lineTo(14, -18);
                ctx.stroke();
                ctx.strokeStyle = "#e74c3c";
                ctx.beginPath();
                ctx.moveTo(9, handR.y);
                ctx.lineTo(19, handR.y);
                ctx.stroke();
                break;
            }
            case "dance_matador_ole": {
                // Vẽ tấm khăn đỏ đấu sĩ bò tót
                ctx.fillStyle = "rgba(231, 76, 60, 0.85)";
                ctx.beginPath();
                ctx.moveTo(handR.x, handR.y);
                ctx.lineTo(handR.x + 14, handR.y + 4 + Math.sin(t * 10) * 4);
                ctx.lineTo(handR.x + 10, handR.y + 18);
                ctx.lineTo(handR.x - 2, handR.y + 14);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case "dance_sad_violin": {
                // Vẽ cây vĩ cầm nhỏ và cây vĩ kéo đàn
                ctx.strokeStyle = "#d35400";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(head.x + 2, head.y + 6);
                ctx.lineTo(handL.x, handL.y);
                ctx.stroke();
                ctx.strokeStyle = "#ecf0f1";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(handR.x - 8, handR.y + 4);
                ctx.lineTo(handR.x + 10, handR.y - 6);
                ctx.stroke();
                break;
            }
            case "dance_see_tinh":
            case "dance_sanji_heart": {
                // Vẽ trái tim bay lên
                ctx.fillStyle = "#ff4757";
                ctx.font = "bold 12px Arial";
                ctx.fillText("❤", handR.x + 4, handR.y - 6 - ((t * 14) % 12));
                break;
            }
            case "dance_gac_chan_ngay": {
                // Vẽ chữ Zzz ngủ trưa
                ctx.fillStyle = "#00f3ff";
                ctx.font = "bold 10px Arial";
                ctx.fillText("Zzz", head.x + 6, head.y - 12 - ((t * 10) % 10));
                break;
            }
            case "dance_crying_baby": {
                // Vẽ tia nước mắt bắn sang 2 bên
                ctx.strokeStyle = "#00f3ff";
                ctx.lineWidth = 2;
                let tearOff = (t * 25) % 8;
                ctx.beginPath();
                ctx.moveTo(head.x - 8, head.y);
                ctx.lineTo(head.x - 14 - tearOff, head.y + 3 + tearOff * 0.5);
                ctx.moveTo(head.x + 8, head.y);
                ctx.lineTo(head.x + 14 + tearOff, head.y + 3 + tearOff * 0.5);
                ctx.stroke();
                break;
            }
            case "salt_bae": {
                // Vẽ các hạt muối rơi lấp lánh từ tay phải
                ctx.fillStyle = "#ffffff";
                for (let i = 0; i < 4; i++) {
                    let dropY = handR.y + 4 + ((t * 30 + i * 5) % 18);
                    ctx.fillRect(handR.x - 1 + (i % 2) * 2, dropY, 2, 2);
                }
                break;
            }
        }

        ctx.restore();
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
            iFrames: 0,
            shield: 0,
            superArmor: 0,
            attackTimer: 0,
            attackTrail: [],
            scarfNodes: charObj._danceScarfNodes,
            currentSkeleton: charObj._danceSkeleton
        });

        window.drawStickman(ctx, clone, false);

        charObj._danceScarfNodes = clone.scarfNodes;
        charObj._danceSkeleton = clone.currentSkeleton;
    }
};

