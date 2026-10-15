// ==========================================
// DANCES.JS - MODULE VŨ ĐẠO TIKTOK TÍCH HỢP TRỰC TIẾP VÀO GRAPHICS.JS
// Hệ tọa độ chuẩn Graphics.js: Mặt đất (y = 0), Hông (y = -20), Cổ (y = -45), Đầu (y = -60)
// Hỗ trợ: Lắc đầu 3D (headTilt), Nhấc chân, Lắc hông, Vung tay & Khăn choàng vật lý
// ==========================================

window.DanceEngine = {
    currentP1Dance: "dance_hakari",
    currentP2Dance: "dance_griddy",
    currentWinDance: "dance_siuuuu",

    danceList: [
        "dance_hakari",         // 1. Vũ điệu Hakari (Jujutsu Kaisen - Lắc hông vẩy tay cực cuốn)
        "dance_griddy",         // 2. Điệu nhảy The Griddy (Dậm nhảy chân sáo + đeo kính mắt)
        "dance_orange_justice", // 3. Múa quạt Fortnite (Đập đầu gối + vung tay chéo qua đầu)
        "dance_twerk",          // 4. Ngoáy mông khiêu khích tốc độ cao
        "dance_billy_bounce",   // 5. Bước nhảy lò xo Billy Bounce dẻo toàn thân
        "dance_windmill",       // 6. Breakdance đá chân Shuffle & Chốt dáng DAB
        "dance_jojo",           // 7. Vũ điệu JoJo Torture Dance cực dị
        "dance_siuuuu"          // 8. Nhảy xoay người tiếp đất SIUUUU
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

    // Trả về tọa độ 11 khớp chuẩn xác cho window.drawBaseLimb trong graphics.js
    getSkeletonPose: function(p) {
        let t = Date.now() / 1000;
        let beat = t * 12; // Nhịp BPM sôi động
        let s = Math.sin(beat);
        let c = Math.cos(beat);
        let s2 = Math.sin(beat * 2);
        let bounce = Math.abs(s2) * 6;

        // Khởi tạo bộ khung chuẩn của graphics.js
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

        p.headTilt = s * 0.18; // Mặc định cho đầu 3D nghiêng theo nhịp nhạc

        switch (p.state) {
            case "dance_hakari":
                // Hông đánh ngang mạnh, 2 tay giơ cao ngang thái dương vẩy liên hoàn, chân bật gót
                pts.pelvis.x = s * 14;
                pts.pelvis.y = -20 + bounce;
                pts.neck.x = -s * 5;
                pts.head.x = -s * 8;
                pts.head.y = -60 + bounce;
                p.headTilt = s * 0.28;

                // Hai tay giơ lên cao vẩy cổ tay
                pts.elbowL = { x: -20 - s * 5, y: -48 + c * 4 };
                pts.handL  = { x: -28 + s2 * 10, y: -68 + Math.abs(c) * 8 };
                pts.elbowR = { x: 20 - s * 5,  y: -48 - c * 4 };
                pts.handR  = { x: 28 + s2 * 10,  y: -68 + Math.abs(s) * 8 };

                // Chân nhún đổi trụ liên tục
                pts.kneeL = { x: -14 + s * 8, y: -12 + bounce };
                pts.footL = { x: -18 + Math.max(0, s) * 10, y: -Math.max(0, s) * 12 };
                pts.kneeR = { x: 14 + s * 8,  y: -12 + bounce };
                pts.footR = { x: 18 + Math.min(0, s) * 10,  y: -Math.max(0, -s) * 12 };
                break;

            case "dance_griddy":
                // Điệu The Griddy: Người hơi rướn tới, chân bước dậm gót liên hoàn, tay vung rồi đưa lên mắt làm kính
                let griddyPhase = Math.sin(beat * 0.5);
                pts.pelvis.x = -4;
                pts.pelvis.y = -18 + bounce * 1.2;
                pts.neck.x = 8;
                pts.head.x = 12;
                pts.head.y = -56 + bounce * 1.2;
                p.headTilt = 0.15 + s * 0.15;

                if (griddyPhase > 0) {
                    // Nhịp 1: Hai tay đưa lên mắt tạo hình mắt kính 👌
                    pts.elbowL = { x: -12, y: -38 + bounce };
                    pts.handL  = { x: 8,   y: -58 + bounce };
                    pts.elbowR = { x: 22,  y: -38 + bounce };
                    pts.handR  = { x: 16,  y: -58 + bounce };
                } else {
                    // Nhịp 2: Hai tay vung rộng ra sau lưng rồi đánh mạnh về trước
                    let armSwing = s * 28;
                    pts.elbowL = { x: -8 + armSwing * 0.5, y: -30 };
                    pts.handL  = { x: -15 + armSwing,      y: -18 };
                    pts.elbowR = { x: 8 + armSwing * 0.5,  y: -30 };
                    pts.handR  = { x: 15 + armSwing,       y: -18 };
                }

                // Chân sáo dậm gót tốc độ cao
                pts.kneeL = { x: -8 + s * 14, y: -12 };
                pts.footL = { x: -12 + s * 22, y: s > 0 ? -10 : 0 };
                pts.kneeR = { x: 8 - s * 14,  y: -12 };
                pts.footR = { x: 12 - s * 22,  y: s < 0 ? -10 : 0 };
                break;

            case "dance_orange_justice":
                // Múa quạt Fortnite: Đầu gối đập ra vào, tay vung chéo từ bụng vút qua đầu
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
                // Ngoáy mông khiêu khích: Cúi người chống tay lên gối, hông giật nảy tốc độ cao
                let twerk = Math.sin(beat * 2.5);
                pts.pelvis.x = -18 + twerk * 7;
                pts.pelvis.y = -22 + Math.abs(twerk) * 12;
                pts.neck.x = 12;
                pts.neck.y = -38 + twerk * 3;
                pts.head.x = 20;
                pts.head.y = -52 + twerk * 4;
                p.headTilt = -0.25 + twerk * 0.15;

                // Tay chống xuống đầu gối
                pts.elbowL = { x: 2,  y: -25 }; pts.handL = { x: 8,  y: -10 };
                pts.elbowR = { x: 16, y: -25 }; pts.handR = { x: 16, y: -10 };

                pts.kneeL = { x: -12, y: -10 }; pts.footL = { x: -18, y: 0 };
                pts.kneeR = { x: 14,  y: -10 }; pts.footR = { x: 16,  y: 0 };
                break;

            case "dance_billy_bounce":
                // Bước nhảy lò xo dẻo toàn thân
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
                // Nửa đầu đá chân Shuffle tốc độ cao, nửa sau đóng băng tư thế DAB cực gắt
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
                    // Khóa tư thế DAB!
                    pts.pelvis = { x: -5, y: -16 };
                    pts.neck   = { x: 10, y: -38 };
                    pts.head   = { x: 18, y: -48 };
                    p.headTilt = 0.48; // Cúi gập đầu vào khuỷu tay

                    pts.elbowL = { x: -22, y: -52 }; pts.handL = { x: -48, y: -72 }; // Tay trái phóng thẳng lên trời
                    pts.elbowR = { x: 28,  y: -48 }; pts.handR = { x: 2,   y: -54 }; // Tay phải che mặt

                    pts.kneeL = { x: -16, y: -10 }; pts.footL = { x: -24, y: 0 };
                    pts.kneeR = { x: 18,  y: -10 }; pts.footR = { x: 24,  y: 0 };
                }
                break;

            case "dance_jojo":
                // Vũ điệu JoJo Torture Dance: Uốn người chữ S, 1 chân co cao, tay tạo dáng liên hoàn
                let poseSwitch = Math.sin(beat * 0.75);
                pts.pelvis.x = -14 * poseSwitch;
                pts.pelvis.y = -18 + bounce;
                pts.neck.x = 12 * poseSwitch;
                pts.head.x = 6 * poseSwitch;
                pts.head.y = -58 + bounce;
                p.headTilt = -0.32 * poseSwitch;

                pts.elbowL = { x: -24, y: -52 };
                pts.handL  = { x: -5 + poseSwitch * 15, y: -74 }; // Tay vòng lên đỉnh đầu
                pts.elbowR = { x: 26,  y: -35 };
                pts.handR  = { x: 38 * poseSwitch, y: -42 + bounce };

                pts.kneeL = { x: -16, y: -10 }; pts.footL = { x: -20, y: 0 };
                pts.kneeR = { x: 22,  y: -24 + bounce }; pts.footR = { x: 12, y: -16 + bounce }; // Chân nhấc cao
                break;

            case "dance_siuuuu":
            default:
                // Bật nhảy lên cao rồi tiếp đất tung 2 tay SIUUUU
                let jumpCycle = (t % 1.4) / 1.4;
                if (jumpCycle < 0.45) {
                    // Đang bật nhảy trên không trung
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
                    // Tiếp đất dứt khoát vung 2 tay ra sau gồng lực
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

        // Gắn vận tốc giả lập cho khăn choàng (scarfNodes) bay phấp phới khi nhân vật đứng nhảy tại chỗ
        p.vx = s * 4.5;
        return pts;
    }
};
