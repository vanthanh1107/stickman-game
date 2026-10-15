// ==========================================
// DANCES.JS - BỘ ĐIỀU KHIỂN VŨ ĐẠO DÙNG CHÍNH THÂN THỂ & TAY CHÂN GỐC CỦA NHÂN VẬT
// ==========================================

window.DanceEngine = {
    currentP1Dance: "dance_hakari",
    currentP2Dance: "dance_griddy",
    currentWinDance: "dance_siuuuu",

    danceList: [
        "dance_hakari",         // 1. Vũ điệu Hakari (Lắc hông vẩy tay cao)
        "dance_griddy",         // 2. Điệu nhảy The Griddy (Dậm chân sáo + tạo dáng kính mắt)
        "dance_orange_justice", // 3. Múa quạt Fortnite (Đập đầu gối + vung tay chéo)
        "dance_twerk",          // 4. Ngoáy mông khiêu khích
        "dance_billy_bounce",   // 5. Bước nhảy lò xo dẻo toàn thân
        "dance_windmill",       // 6. Đá chân Shuffle & Chốt dáng DAB
        "dance_jojo",           // 7. Vũ điệu JoJo uốn người tạo dáng
        "dance_siuuuu"          // 8. Bật nhảy xoay người tiếp đất SIUUUU
    ],

    isDanceState: function(state) {
        return typeof state === "string" && state.startsWith("dance_");
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

    // Cung cấp tọa độ 11 khớp xương cho window.drawBaseLimb để p.drawMethod vẽ tay chân thật của nhân vật
    getSkeletonPose: function(p) {
        let t = Date.now() / 1000;
        let beat = t * 12;
        let s = Math.sin(beat);
        let c = Math.cos(beat);
        let s2 = Math.sin(beat * 2);
        let bounce = Math.abs(s2) * 6;

        let pts = {
            head:   { x: 0,   y: -60 + bounce },
            neck:   { x: 0,   y: -45 + bounce },
            pelvis: { x: 0,   y: -20 + bounce },
            footL:  { x: -15, y: 0 },
            kneeL:  { x: -10, y: -10 + bounce },
            footR:  { x: 15,  y: 0 },
            kneeR:  { x: 10,  y: -10 + bounce },
            handL:  { x: -15, y: -35 + bounce },
            elbowL: { x: -10, y: -25 + bounce },
            handR:  { x: 15,  y: -40 + bounce },
            elbowR: { x: 5,   y: -30 + bounce }
        };

        p.headTilt = s * 0.18;
        p.scarfWind = s * 4.5; // Làm khăn choàng bay theo nhạc mà không làm trôi vị trí nhân vật

        switch (p.state) {
            case "dance_hakari":
                pts.pelvis.x = s * 14;
                pts.pelvis.y = -20 + bounce;
                pts.neck.x = -s * 5;
                pts.head.x = -s * 8;
                pts.head.y = -60 + bounce;
                p.headTilt = s * 0.28;

                pts.elbowL = { x: -20 - s * 5, y: -48 + c * 4 };
                pts.handL  = { x: -28 + s2 * 10, y: -68 + Math.abs(c) * 8 };
                pts.elbowR = { x: 20 - s * 5,  y: -48 - c * 4 };
                pts.handR  = { x: 28 + s2 * 10,  y: -68 + Math.abs(s) * 8 };

                pts.kneeL = { x: -14 + s * 8, y: -12 + bounce };
                pts.footL = { x: -18 + Math.max(0, s) * 10, y: -Math.max(0, s) * 12 };
                pts.kneeR = { x: 14 + s * 8,  y: -12 + bounce };
                pts.footR = { x: 18 + Math.min(0, s) * 10,  y: -Math.max(0, -s) * 12 };
                break;

            case "dance_griddy":
                let griddyPhase = Math.sin(beat * 0.5);
                pts.pelvis.x = -4;
                pts.pelvis.y = -18 + bounce * 1.2;
                pts.neck.x = 8;
                pts.head.x = 12;
                pts.head.y = -56 + bounce * 1.2;
                p.headTilt = 0.15 + s * 0.15;

                if (griddyPhase > 0) {
                    pts.elbowL = { x: -12, y: -38 + bounce };
                    pts.handL  = { x: 8,   y: -58 + bounce };
                    pts.elbowR = { x: 22,  y: -38 + bounce };
                    pts.handR  = { x: 16,  y: -58 + bounce };
                } else {
                    let armSwing = s * 28;
                    pts.elbowL = { x: -8 + armSwing * 0.5, y: -30 };
                    pts.handL  = { x: -15 + armSwing,      y: -18 };
                    pts.elbowR = { x: 8 + armSwing * 0.5,  y: -30 };
                    pts.handR  = { x: 15 + armSwing,       y: -18 };
                }

                pts.kneeL = { x: -8 + s * 14, y: -12 };
                pts.footL = { x: -12 + s * 22, y: s > 0 ? -10 : 0 };
                pts.kneeR = { x: 8 - s * 14,  y: -12 };
                pts.footR = { x: 12 - s * 22,  y: s < 0 ? -10 : 0 };
                break;

            case "dance_orange_justice":
                let swing = Math.sin(beat * 1.1);
                pts.pelvis.x = swing * 12;
                pts.pelvis.y = -18 + bounce * 1.4;
                pts.neck.x = -swing * 6;
                pts.head.x = -swing * 10;
                pts.head.y = -58 + bounce * 1.4;
                p.headTilt = -swing * 0.3;

                pts.elbowL = { x: -18 + swing * 15, y: -35 - swing * 15 };
                pts.handL  = { x: -10 + swing * 35, y: -38 - swing * 38 };
                pts.elbowR = { x: 18 + swing * 15,  y: -35 + swing * 15 };
                pts.handR  = { x: 10 + swing * 35,  y: -38 + swing * 38 };

                let kneeSpread = Math.cos(beat * 2.2) * 16;
                pts.kneeL = { x: -14 + kneeSpread, y: -10 };
                pts.footL = { x: -18, y: 0 };
                pts.kneeR = { x: 14 - kneeSpread,  y: -10 };
                pts.footR = { x: 18,  y: 0 };
                break;

            case "dance_twerk":
                let twerk = Math.sin(beat * 2.5);
                pts.pelvis.x = -18 + twerk * 7;
                pts.pelvis.y = -22 + Math.abs(twerk) * 12;
                pts.neck.x = 12;
                pts.neck.y = -38 + twerk * 3;
                pts.head.x = 20;
                pts.head.y = -52 + twerk * 4;
                p.headTilt = -0.25 + twerk * 0.15;

                pts.elbowL = { x: 2,  y: -25 }; pts.handL = { x: 8,  y: -10 };
                pts.elbowR = { x: 16, y: -25 }; pts.handR = { x: 16, y: -10 };

                pts.kneeL = { x: -12, y: -10 }; pts.footL = { x: -18, y: 0 };
                pts.kneeR = { x: 14,  y: -10 }; pts.footR = { x: 16,  y: 0 };
                break;

            case "dance_billy_bounce":
                let wave = Math.sin(beat);
                let waveLag = Math.sin(beat - 1.2);
                pts.pelvis.x = wave * 10;
                pts.pelvis.y = -18 + bounce * 1.3;
                pts.neck.x = waveLag * 10;
                pts.head.x = wave * 8;
                pts.head.y = -58 + bounce * 1.3;
                p.headTilt = waveLag * 0.25;

                pts.elbowL = { x: -22, y: -35 + wave * 10 };
                pts.handL  = { x: -32 + waveLag * 12, y: -22 - wave * 14 };
                pts.elbowR = { x: 22,  y: -35 - wave * 10 };
                pts.handR  = { x: 32 + waveLag * 12,  y: -22 + wave * 14 };

                pts.kneeL = { x: -12 + wave * 10, y: -12 };
                pts.footL = { x: -16 + waveLag * 14, y: wave > 0 ? -12 : 0 };
                pts.kneeR = { x: 12 + wave * 10,  y: -12 };
                pts.footR = { x: 16 + waveLag * 14,  y: wave <= 0 ? -12 : 0 };
                break;

            case "dance_windmill":
                let cycle = (t % 1.5) / 1.5;
                if (cycle < 0.65) {
                    let shuf = Math.sin(t * 20);
                    pts.pelvis.x = shuf * 8;
                    pts.pelvis.y = -20 + Math.abs(shuf) * 8;
                    pts.head.x = -shuf * 6;
                    p.headTilt = shuf * 0.2;

                    pts.elbowL = { x: -20, y: -35 }; pts.handL = { x: -28, y: -50 + shuf * 15 };
                    pts.elbowR = { x: 20,  y: -35 }; pts.handR = { x: 28,  y: -50 - shuf * 15 };

                    pts.kneeL = { x: -12 + shuf * 18, y: -14 };
                    pts.footL = { x: -18 + shuf * 28, y: shuf > 0 ? -12 : 0 };
                    pts.kneeR = { x: 12 - shuf * 18,  y: -14 };
                    pts.footR = { x: 18 - shuf * 28,  y: shuf < 0 ? -12 : 0 };
                } else {
                    pts.pelvis = { x: -5, y: -16 };
                    pts.neck   = { x: 10, y: -38 };
                    pts.head   = { x: 18, y: -48 };
                    p.headTilt = 0.48;

                    pts.elbowL = { x: -22, y: -52 }; pts.handL = { x: -48, y: -72 };
                    pts.elbowR = { x: 28,  y: -48 }; pts.handR = { x: 2,   y: -54 };

                    pts.kneeL = { x: -16, y: -10 }; pts.footL = { x: -24, y: 0 };
                    pts.kneeR = { x: 18,  y: -10 }; pts.footR = { x: 24,  y: 0 };
                }
                break;

            case "dance_jojo":
                let poseSwitch = Math.sin(beat * 0.75);
                pts.pelvis.x = -14 * poseSwitch;
                pts.pelvis.y = -18 + bounce;
                pts.neck.x = 12 * poseSwitch;
                pts.head.x = 6 * poseSwitch;
                pts.head.y = -58 + bounce;
                p.headTilt = -0.32 * poseSwitch;

                pts.elbowL = { x: -24, y: -52 };
                pts.handL  = { x: -5 + poseSwitch * 15, y: -74 };
                pts.elbowR = { x: 26,  y: -35 };
                pts.handR  = { x: 38 * poseSwitch, y: -42 + bounce };

                pts.kneeL = { x: -16, y: -10 }; pts.footL = { x: -20, y: 0 };
                pts.kneeR = { x: 22,  y: -24 + bounce }; pts.footR = { x: 12, y: -16 + bounce };
                break;

            case "dance_siuuuu":
            default:
                let jumpCycle = (t % 1.4) / 1.4;
                if (jumpCycle < 0.45) {
                    let airH = Math.sin((jumpCycle / 0.45) * Math.PI) * 32;
                    pts.pelvis = { x: 0, y: -20 - airH };
                    pts.neck   = { x: 0, y: -45 - airH };
                    pts.head   = { x: 0, y: -60 - airH };
                    p.headTilt = -0.15;

                    pts.elbowL = { x: -15, y: -55 - airH }; pts.handL = { x: -5, y: -70 - airH };
                    pts.elbowR = { x: 15,  y: -55 - airH }; pts.handR = { x: 5,  y: -70 - airH };
                    pts.kneeL  = { x: -12, y: -12 - airH }; pts.footL = { x: -8, y: -2 - airH };
                    pts.kneeR  = { x: 12,  y: -12 - airH }; pts.footR = { x: 8,  y: -2 - airH };
                } else {
                    let shake = Math.sin(t * 35) * 1.5;
                    pts.pelvis = { x: 0, y: -15 };
                    pts.neck   = { x: 0, y: -40 };
                    pts.head   = { x: shake, y: -55 };
                    p.headTilt = shake * 0.08;

                    pts.elbowL = { x: -22, y: -28 }; pts.handL = { x: -34, y: -8 };
                    pts.elbowR = { x: 22,  y: -28 }; pts.handR = { x: 34,  y: -8 };
                    pts.kneeL  = { x: -18, y: -8 };  pts.footL = { x: -24, y: 0 };
                    pts.kneeR  = { x: 18,  y: -8 };  pts.footR = { x: 24,  y: 0 };
                }
                break;
        }
        return pts;
    },

    // Vẽ nhân vật nhảy bằng CHÍNH THÂN THỂ & TAY CHÂN GỐC (drawStickman / p.drawMethod)
    drawDancer: function(ctx, charObj, cx, cy, isFacingRight, scaleOverride, danceId) {
        if (!charObj || typeof window.drawStickman !== 'function') return;
        let activeDance = (danceId && this.isDanceState(danceId)) ? danceId : "dance_hakari";

        ctx.save();
        ctx.filter = "none"; // Giữ nguyên 100% màu sắc và hiệu ứng thân thể thật của nhân vật
        let clone = Object.assign({}, charObj, {
            x: cx,
            y: cy,
            scale: scaleOverride || 3.5,
            isFacingRight: isFacingRight !== false,
            state: activeDance,
            onGround: true,
            hideHpBar: true,
            scarfNodes: charObj._danceScarfNodes,
            currentSkeleton: charObj._danceSkeleton
        });

        if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone);
        else if (clone.isBruceLee && typeof window.drawBruceLee === 'function') window.drawBruceLee(ctx, clone);
        else if (clone.isSamurai && typeof window.drawSamurai === 'function') window.drawSamurai(ctx, clone);
        else if (clone.isNinja && typeof window.drawNinja === 'function') window.drawNinja(ctx, clone);
        else window.drawStickman(ctx, clone);

        // Lưu lại trạng thái khăn choàng và khung xương để chuyển động mượt giữa các frame
        charObj._danceScarfNodes = clone.scarfNodes;
        charObj._danceSkeleton = clone.currentSkeleton;
        ctx.restore();
    }
};
