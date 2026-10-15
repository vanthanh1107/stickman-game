// ==========================================
// DANCES.JS - TRẠM VŨ ĐẠO, TAUNT & MEME TRUNG TÂM (BẢN THUẦN 1V1 - SIÊU SẠCH)
// ĐÃ BỎ HOÀN TOÀN: Cụm kiểm tra Boss cũ -> Gọi trực tiếp window.drawStickman
// ==========================================

window.DanceEngine = {
    currentP1Dance: "dance_hakari",
    currentP2Dance: "dance_griddy",
    currentWinDance: "dance_siuuuu",

    // Danh sách các điệu nhảy chính dùng cho Intro / Outro / Preview
    danceList: [
        "dance_hakari",         // 1. Vũ điệu Hakari (Lắc hông vẩy tay cao)
        "dance_griddy",         // 2. Điệu nhảy The Griddy (Dậm chân sáo + mắt kính)
        "dance_orange_justice", // 3. Múa quạt Fortnite (Đập đầu gối + vung tay chéo)
        "dance_twerk",          // 4. Ngoáy mông khiêu khích
        "dance_billy_bounce",   // 5. Bước nhảy lò xo dẻo toàn thân
        "dance_windmill",       // 6. Đá chân Shuffle & Chốt dáng DAB
        "dance_jojo",           // 7. Vũ điệu JoJo uốn người tạo dáng
        "dance_siuuuu",         // 8. Bật nhảy xoay người tiếp đất SIUUUU
        "gangnam_style",        // 9. Nhảy cưỡi ngựa Gangnam Style
        "moonwalk",             // 10. Trượt lùi Moonwalk Michael Jackson
        "breakdance"            // 11. Xoay người trồng cây chuối Breakdance
    ],

    // Danh sách toàn bộ các trạng thái do dances.js quản lý
    allExpressiveStates: new Set([
        "dance_hakari", "dance_griddy", "dance_orange_justice", "dance_twerk",
        "dance_billy_bounce", "dance_windmill", "dance_jojo", "dance_siuuuu",
        "taunt_crane", "taunt_power", "taunt_dance", "taunt_point", "taunt_flex",
        "t_pose", "dab", "floss", "siuuuu", "smooth_criminal", "salt_bae",
        "gangnam_style", "robot_dance", "zombie", "rickroll", "breakdance",
        "moonwalk", "giorno_pose"
    ]),

    isDanceState: function(state) {
        if (typeof state !== "string") return false;
        return state.startsWith("dance_") || this.allExpressiveStates.has(state);
    },

    pickRandomDances: function() {
        const r = () => this.danceList[Math.floor(Math.random() * this.danceList.length)];
        this.currentP1Dance = r();
        this.currentP2Dance = r();
        while (this.currentP2Dance === this.currentP1Dance) {
            this.currentP2Dance = r();
        }
        this.currentWinDance = r();
    },

    // ==========================================
    // TÍNH TOÁN TỌA ĐỘ 11 KHỚP XƯƠNG CHO MỌI ĐIỆU NHẢY, TAUNT & MEME
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

        switch (p.state) {
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
    // HÀM VẼ VŨ CÔNG TRỰC TIẾP QUA WINDOW.DRAWSTICKMAN (KHÔNG QUA TRUNG GIAN BOSS)
    // ==========================================
    drawDancer: function(ctx, charObj, cx, cy, isFacingRight, scaleOverride, danceId) {
        if (!charObj || typeof window.drawStickman !== 'function') return;
        let activeDance = (danceId && this.isDanceState(danceId)) ? danceId : "dance_hakari";

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
