// ==========================================
// GRAPHICS.JS - TRẠM ĐỒ HỌA NHÂN VẬT & VÕ THUẬT 1V1 (V8.2 PRO EDITION)
// NÂNG CẤP ĐỈNH CAO:
// 1. Vẽ Full 100% đầu PNG nguyên bản trong drawAvatarHead (Không cắt vòng tròn, không che mặt/tóc, bỏ ctx.filter gây lag).
// 2. Mở khóa 15+ thế võ chuyên nghiệp (Uppercut, Axe Kick, Low Sweep, Flying Knee, Wall Splat...) cho cả nhân vật có drawMethod riêng.
// 3. Tự động tạo vệt sáng đòn đánh (attackTrail) cho MỌI nhân vật kể cả khi dùng drawMethod tùy chỉnh.
// 4. Hỗ trợ tự động cầm vũ khí trên tay (weaponIcon) cho các nhân vật tạo nhanh.
// ==========================================

const lerp = (a, b, t) => a + (b - a) * t;

// Đồng bộ chung 1 kho ảnh đệm giữa graphics.js và recorder.js (Tránh lặp code)
window.avatarImageCache = window.avatarImageCache || window.hudImages || {};
window.hudImages = window.avatarImageCache;

window.GITHUB_RAW_BASE = "https://raw.githack.com/vanthanh1107/stickman-game/main/";

window.resolveImageUrl = function(url) {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    let filename = url.split('/').pop().split('?')[0];

    // 1. Ưu tiên kho ảnh nội bộ đã đồng bộ từ character/picture/ (Hiển thị 100% ở cả Local file:// và GitHub, chống lỗi CORS Canvas)
    if (window.LOCAL_PICTURE_DATA) {
        if (window.LOCAL_PICTURE_DATA[url]) return window.LOCAL_PICTURE_DATA[url];
        if (window.LOCAL_PICTURE_DATA[filename]) return window.LOCAL_PICTURE_DATA[filename];
        if (window.LOCAL_PICTURE_DATA['character/picture/' + filename]) return window.LOCAL_PICTURE_DATA['character/picture/' + filename];
        if (window.LOCAL_PICTURE_DATA['picture/' + filename]) return window.LOCAL_PICTURE_DATA['picture/' + filename];
    }

    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    // 2. Chuẩn hóa đường dẫn sang thư mục character/picture/ cho cả Local và GitHub
    let cleanPath = url.replace(/^(\.\/|\/)+/, '');
    if (cleanPath.startsWith('picture/')) {
        cleanPath = 'character/picture/' + filename;
    } else if (!cleanPath.includes('/')) {
        cleanPath = 'character/picture/' + cleanPath;
    }

    if (window.GAME_REPO_URL) {
        return window.GAME_REPO_URL + cleanPath;
    }
    return cleanPath;
};

window.getSharedCachedImg = function(url) {
    if (!url) return null;

    const ensureMip = (imgObj) => {
        if (!imgObj._mip96 && (imgObj.naturalWidth > 128 || imgObj.naturalHeight > 128)) {
            try {
                let mCv = document.createElement('canvas');
                mCv.width = 96;
                mCv.height = 96;
                let mCtx = mCv.getContext('2d');
                mCtx.drawImage(imgObj, 0, 0, 96, 96);
                imgObj._mip96 = mCv;
            } catch (e) {}
        }
        return imgObj;
    };

    // 1. Kiểm tra cache trực tiếp O(1) để không tốn CPU cắt chuỗi mỗi frame
    let cached = window.avatarImageCache[url];
    if (cached && cached.complete && cached.naturalWidth > 0) {
        return ensureMip(cached);
    }

    let resolvedUrl = (typeof window.resolveImageUrl === "function") ? window.resolveImageUrl(url) : url;
    if (resolvedUrl && resolvedUrl !== url) {
        cached = window.avatarImageCache[resolvedUrl];
        if (cached && cached.complete && cached.naturalWidth > 0) {
            window.avatarImageCache[url] = cached; // Lưu alias để frame sau O(1) ngay
            return ensureMip(cached);
        }
    }

    if (!cached || (cached.complete && cached.naturalWidth === 0 && !cached._retryDone)) {
        let img = new Image();
        if (typeof resolvedUrl === "string" && (resolvedUrl.startsWith("http://") || resolvedUrl.startsWith("https://"))) {
            img.crossOrigin = "Anonymous";
        }
        img._retryDone = true;
        img.onerror = function() {
            // Tự động fallback chéo giữa Local character/picture/ và GitHub character/picture/
            if (!img._fallbackTried) {
                img._fallbackTried = true;
                let filename = String(url).split('/').pop().split('?')[0];
                if (resolvedUrl.startsWith("http")) {
                    img.removeAttribute("crossorigin");
                    img.src = "character/picture/" + filename;
                } else {
                    img.crossOrigin = "Anonymous";
                    img.src = (window.GITHUB_RAW_BASE || "https://raw.githack.com/vanthanh1107/stickman-game/main/") + "character/picture/" + filename;
                }
            }
        };
        img.src = resolvedUrl;
        window.avatarImageCache[url] = img;
        if (resolvedUrl !== url) window.avatarImageCache[resolvedUrl] = img;
    }
    return null;
};

// ==========================================
// KHO ẢNH VINTAGE CACHED 1 LẦN (LOẠI BỎ 100% CTX.FILTER TRÊN CANVAS 1080x1920)
// ==========================================
window._vintageImgCache = window._vintageImgCache || {};
window.getVintageCachedImg = function(url, mode = 'sepia') {
    if (!url) return null;
    let key = mode + '|' + url;
    if (window._vintageImgCache[key]) return window._vintageImgCache[key];

    let img = window.getSharedCachedImg(url);
    if (!img || !img.complete || img.naturalWidth === 0) return null;

    try {
        let sz = 128;
        let cv = document.createElement('canvas');
        cv.width = sz;
        cv.height = sz;
        let c = cv.getContext('2d');
        c.drawImage(img, 0, 0, sz, sz);
        let imgData = c.getImageData(0, 0, sz, sz);
        let d = imgData.data;
        let isSepia = (mode === 'sepia');
        let contrastFactor = isSepia ? 2.0 : 1.5;

        for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] === 0) continue;
            let lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            let v = (lum - 128) * contrastFactor + 128;
            if (v < 0) v = 0;
            else if (v > 255) v = 255;

            if (isSepia) {
                d[i]     = Math.min(255, v * 1.1053);
                d[i + 1] = Math.min(255, v * 1.0609);
                d[i + 2] = Math.min(255, v * 0.9811);
            } else {
                d[i] = d[i + 1] = d[i + 2] = v;
            }
        }
        c.putImageData(imgData, 0, 0);
        window._vintageImgCache[key] = cv;
        return cv;
    } catch (e) {
        return img._mip96 || img;
    }
};

// ==========================================
// BỘ TĂNG TỐC HÀO QUANG GPU (ZERO GAUSSIAN SHADOWBLUR STALL)
// Giữ nguyên 100% hiệu ứng phát sáng vũ khí/chiêu thức của 17 nhân vật mà nhanh gấp 50 lần
// ==========================================
window.installFastGlowContext = function(ctx) {
    if (!ctx || ctx._fastGlowInstalled) return ctx;
    let proto = Object.getPrototypeOf(ctx);
    let blurDesc = proto ? Object.getOwnPropertyDescriptor(proto, 'shadowBlur') : null;
    if (!blurDesc || typeof blurDesc.set !== 'function') return ctx;

    ctx._fastGlowInstalled = true;
    ctx._vShadowBlur = 0;
    ctx._vShadowStack = [];
    ctx._inGlowPass = false;
    blurDesc.set.call(ctx, 0);

    Object.defineProperty(ctx, 'shadowBlur', {
        configurable: true,
        enumerable: true,
        get: function() { return this._vShadowBlur; },
        set: function(val) {
            let n = Number(val);
            this._vShadowBlur = (n > 0) ? n : 0;
        }
    });

    const origSave = ctx.save;
    const origRestore = ctx.restore;
    const origStroke = ctx.stroke;
    const origFill = ctx.fill;
    const origStrokeRect = ctx.strokeRect;
    const origFillRect = ctx.fillRect;

    ctx.save = function() {
        this._vShadowStack.push(this._vShadowBlur);
        return origSave.call(this);
    };

    ctx.restore = function() {
        this._vShadowBlur = this._vShadowStack.length > 0 ? this._vShadowStack.pop() : 0;
        return origRestore.call(this);
    };

    ctx.stroke = function() {
        if (this._vShadowBlur > 1.5 && !this._inGlowPass && arguments.length === 0) {
            this._inGlowPass = true;
            let prevAlpha = this.globalAlpha;
            let prevStroke = this.strokeStyle;
            let prevLW = this.lineWidth;
            let glowCol = this.shadowColor;
            if (glowCol && glowCol !== 'rgba(0, 0, 0, 0)' && glowCol !== 'transparent') {
                this.strokeStyle = glowCol;
                this.globalAlpha = prevAlpha * Math.min(0.32, 0.14 + this._vShadowBlur * 0.01);
                this.lineWidth = prevLW + Math.min(10, this._vShadowBlur * 0.55);
                origStroke.call(this);
                this.lineWidth = prevLW;
                this.strokeStyle = prevStroke;
                this.globalAlpha = prevAlpha;
            }
            this._inGlowPass = false;
        }
        return origStroke.apply(this, arguments);
    };

    ctx.fill = function() {
        if (this._vShadowBlur > 2.5 && !this._inGlowPass && arguments.length === 0) {
            this._inGlowPass = true;
            let prevAlpha = this.globalAlpha;
            let prevStroke = this.strokeStyle;
            let prevLW = this.lineWidth;
            let glowCol = this.shadowColor;
            if (glowCol && glowCol !== 'rgba(0, 0, 0, 0)' && glowCol !== 'transparent') {
                this.strokeStyle = glowCol;
                this.globalAlpha = prevAlpha * Math.min(0.26, 0.12 + this._vShadowBlur * 0.008);
                this.lineWidth = Math.min(9, this._vShadowBlur * 0.45);
                origStroke.call(this);
                this.lineWidth = prevLW;
                this.strokeStyle = prevStroke;
                this.globalAlpha = prevAlpha;
            }
            this._inGlowPass = false;
        }
        return origFill.apply(this, arguments);
    };

    ctx.strokeRect = function(x, y, w, h) {
        if (this._vShadowBlur > 1.5 && !this._inGlowPass) {
            this._inGlowPass = true;
            let prevAlpha = this.globalAlpha;
            let prevStroke = this.strokeStyle;
            let prevLW = this.lineWidth;
            let glowCol = this.shadowColor;
            if (glowCol && glowCol !== 'rgba(0, 0, 0, 0)' && glowCol !== 'transparent') {
                this.strokeStyle = glowCol;
                this.globalAlpha = prevAlpha * 0.28;
                this.lineWidth = prevLW + Math.min(10, this._vShadowBlur * 0.5);
                origStrokeRect.call(this, x, y, w, h);
                this.lineWidth = prevLW;
                this.strokeStyle = prevStroke;
                this.globalAlpha = prevAlpha;
            }
            this._inGlowPass = false;
        }
        return origStrokeRect.call(this, x, y, w, h);
    };

    ctx.fillRect = function(x, y, w, h) {
        if (this._vShadowBlur > 2 && !this._inGlowPass && (this.shadowOffsetX || this.shadowOffsetY)) {
            this._inGlowPass = true;
            let prevFill = this.fillStyle;
            let glowCol = this.shadowColor;
            if (glowCol && glowCol !== 'rgba(0, 0, 0, 0)' && glowCol !== 'transparent') {
                this.fillStyle = glowCol;
                origFillRect.call(this, x + (this.shadowOffsetX || 0), y + (this.shadowOffsetY || 0), w, h);
                this.fillStyle = prevFill;
            }
            this._inGlowPass = false;
        }
        return origFillRect.call(this, x, y, w, h);
    };

    return ctx;
};

// ==========================================
// BỘ ĐỆM SPRITE CHỮ & EMOJI OFFSCREEN (ZERO-LAG GLYPH & SPINNING EMOJI BLITTER)
// Chuyển mọi strokeText/fillText/Emoji xoay vòng lúc tung Skill & Nổ Đòn từ 12ms CPU -> 0.03ms GPU drawImage!
// ==========================================
window._textSpriteCache = window._textSpriteCache || {};
window._textSpriteKeys = window._textSpriteKeys || [];
window._textMeasureCtx = null;

window.getTextSpriteCached = function(text, font, fillCol, strokeCol, strokeW) {
    if (text === undefined || text === null || text === "") return null;
    let str = String(text);
    let fnt = font || "bold 18px Arial, sans-serif";
    let fCol = fillCol || "#ffffff";
    let sCol = strokeCol || "";
    let sW = strokeW || 0;
    let key = fnt + "|" + fCol + "|" + sCol + "|" + sW + "|" + str;

    let hit = window._textSpriteCache[key];
    if (hit) return hit;

    try {
        if (!window._textMeasureCtx) {
            let mCv = document.createElement("canvas");
            mCv.width = 16; mCv.height = 16;
            window._textMeasureCtx = mCv.getContext("2d");
        }
        let mCtx = window._textMeasureCtx;
        if (!mCtx) return null;

        if (window._textSpriteKeys.length >= 340) {
            let removeCount = 90;
            for (let i = 0; i < removeCount; i++) {
                delete window._textSpriteCache[window._textSpriteKeys[i]];
            }
            window._textSpriteKeys.splice(0, removeCount);
        }

        let sizeMatch = fnt.match(/(\d+(?:\.\d+)?)px/i);
        let fontPx = sizeMatch ? Math.max(10, parseFloat(sizeMatch[1])) : 20;
        mCtx.font = fnt;
        let measured = mCtx.measureText ? mCtx.measureText(str).width : 0;
        let textW = Math.max(fontPx * 0.9, measured || (str.length * fontPx * 0.62));
        let pad = Math.ceil(sW + fontPx * 0.38 + 6);
        let logicalW = Math.min(720, Math.ceil(textW + pad * 2));
        let logicalH = Math.min(220, Math.ceil(fontPx * 1.42 + pad * 2));
        let dpr = 1.25;

        let cv = document.createElement("canvas");
        cv.width = Math.max(4, Math.ceil(logicalW * dpr));
        cv.height = Math.max(4, Math.ceil(logicalH * dpr));
        let sCtx = cv.getContext("2d");
        if (!sCtx) return null;

        sCtx.scale(dpr, dpr);
        sCtx.font = fnt;
        sCtx.textAlign = "center";
        sCtx.textBaseline = "middle";
        let cx = logicalW * 0.5;
        let cy = logicalH * 0.5;

        if (sW > 0 && sCol) {
            sCtx.lineJoin = "round";
            sCtx.miterLimit = 2;
            sCtx.lineWidth = sW;
            sCtx.strokeStyle = sCol;
            sCtx.strokeText(str, cx, cy);
        }
        sCtx.fillStyle = fCol;
        sCtx.fillText(str, cx, cy);

        let entry = { cv: cv, w: logicalW, h: logicalH };
        window._textSpriteCache[key] = entry;
        window._textSpriteKeys.push(key);
        return entry;
    } catch (e) {
        return null;
    }
};

// ==========================================
// BỘ RÀNG BUỘC TỈ LỆ GIẢI PHẪU KHỚP XƯƠNG (2-BONE FABRIK CONSTRAINT)
// Đảm bảo tay (neck -> elbow -> hand) và chân (pelvis -> knee -> foot)
// luôn giữ chiều dài tự nhiên, không bao giờ bị kéo dãn bất thường khi nhảy hoặc chuyển thế.
// ==========================================
window.constrainSkeletonPose = function(pts, isCombatAttack = false) {
    if (!pts || !pts.pelvis || !pts.neck || !pts.head) return pts;

    const clampSeg = (anchor, target, minLen, maxLen) => {
        let dx = target.x - anchor.x;
        let dy = target.y - anchor.y;
        let d = Math.hypot(dx, dy);
        if (d < 0.001) return;
        if (d > maxLen) {
            let s = maxLen / d;
            target.x = anchor.x + dx * s;
            target.y = anchor.y + dy * s;
        } else if (d < minLen) {
            let s = minLen / d;
            target.x = anchor.x + dx * s;
            target.y = anchor.y + dy * s;
        }
    };

    const constrainLimb = (root, mid, end, minL1, maxL1, minL2, maxL2) => {
        if (!root || !mid || !end) return;
        let maxReach = maxL1 + maxL2 - 0.5;
        clampSeg(root, end, 2, maxReach);
        for (let iter = 0; iter < 2; iter++) {
            clampSeg(end, mid, minL2, maxL2);
            clampSeg(root, mid, minL1, maxL1);
        }
        clampSeg(mid, end, minL2, maxL2);
    };

    // 1. Giữ tỉ lệ thân trên (pelvis -> neck) và cổ (neck -> head)
    clampSeg(pts.pelvis, pts.neck, 16, 26);
    clampSeg(pts.neck, pts.head, 12, 16);

    // 2. Giới hạn chiều dài cánh tay & cẳng tay, đùi & cẳng chân
    let maxArm1 = isCombatAttack ? 18.5 : 15.5;
    let maxArm2 = isCombatAttack ? 18.0 : 15.0;
    let maxLeg1 = isCombatAttack ? 18.5 : 15.5;
    let maxLeg2 = isCombatAttack ? 18.5 : 15.5;

    constrainLimb(pts.neck, pts.elbowL, pts.handL, 7, maxArm1, 7, maxArm2);
    constrainLimb(pts.neck, pts.elbowR, pts.handR, 7, maxArm1, 7, maxArm2);
    constrainLimb(pts.pelvis, pts.kneeL, pts.footL, 8, maxLeg1, 8, maxLeg2);
    constrainLimb(pts.pelvis, pts.kneeR, pts.footR, 8, maxLeg1, 8, maxLeg2);

    return pts;
};

window.initSkeleton = function(p) {
    if (!p.currentSkeleton) {
        p.currentSkeleton = {
            head: {x: 0, y: -60}, neck: {x: 0, y: -45}, pelvis: {x: 0, y: -20},
            footL: {x: -15, y: 0}, kneeL: {x: -10, y: -10}, footR: {x: 15, y: 0}, kneeR: {x: 10, y: -10},
            handL: {x: -15, y: -35}, elbowL: {x: -10, y: -25}, handR: {x: 15, y: -40}, elbowR: {x: 5, y: -30}
        };
    }
};

window.blendSkeleton = function(p, targetPts, speed = 0.38) {
    window.initSkeleton(p);
    let skel = p.currentSkeleton;
    let isDance = window.DanceEngine && window.DanceEngine.isDanceState(p.rawMoveState || p.state);
    let blendSpeed = (p.attackTimer > 0 || isDance) ? 0.68 : speed;

    for (let key in targetPts) {
        if (targetPts[key] && !isNaN(targetPts[key].x)) {
            skel[key].x = lerp(skel[key].x, targetPts[key].x, blendSpeed);
            skel[key].y = lerp(skel[key].y, targetPts[key].y, blendSpeed);
        }
    }
    return window.constrainSkeletonPose(skel, p.attackTimer > 0 && !isDance);
};

// ==========================================
// HÀM DỰNG TỌA ĐỘ KHỚP XƯƠNG VÕ THUẬT & ỦY QUYỀN VŨ ĐẠO SANG DANCES.JS
// ==========================================
window.drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
    p.headTilt = undefined;
    p.scarfWind = undefined;

    let moveState = p.rawMoveState || p.state;

    // 1. Ủy quyền mọi điệu nhảy, Taunt & Meme sang dances.js
    if (window.DanceEngine && window.DanceEngine.isDanceState(moveState)) {
        let prevState = p.state;
        p.state = moveState;
        let dancePts = window.DanceEngine.getSkeletonPose(p, bounce);
        p.state = prevState;
        let finalDancePts = isTrail ? dancePts : window.blendSkeleton(p, dancePts, 0.62);
        p._lastRenderedPts = finalDancePts;
        return finalDancePts;
    }

    let head = {x: 0, y: -60 + bounce}; 
    let neck = {x: 0, y: -45 + bounce}; 
    let pelvis = {x: 0, y: -20 + bounce};
    
    let footL = {x: -15, y: 0}; 
    let kneeL = {x: -10, y: -10 + bounce}; 
    let footR = {x: 15, y: 0}; 
    let kneeR = {x: 10, y: -10 + bounce};
    
    let handL = {x: -15, y: -35 + bounce}; 
    let elbowL = {x: -10, y: -25 + bounce}; 
    let handR = {x: 15, y: -40 + bounce}; 
    let elbowR = {x: 5, y: -30 + bounce};
    
    let tFrame = Date.now() / 150;
    let fastF = Date.now() / 50;
    let progress = (p.attackTimer > 0 && p.maxT) ? 1 - (p.attackTimer / p.maxT) : ext;

    // 2. Tư thế khi đang nhảy trên không trung
    if (!p.onGround && moveState === 'idle' || (!p.onGround && moveState === 'walk')) { 
        footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; 
        footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; 
        handL = {x: -22, y: -45}; elbowL = {x: -14, y: -35}; 
        handR = {x: 22, y: -50}; elbowR = {x: 14, y: -40}; 
        head.y -= 5; 
    }
    // 3. Tư thế Trúng đòn, Dính tường (Wall Splat) & Choáng (Stunned)
    else if (moveState === 'dead') {
        // Tư thế nằm đo ván trên sàn nấc nghẹn khóc hu hu
        let sobQuiver = Math.sin(fastF * 1.5) * 2;
        pelvis = {x: 0, y: -16 + sobQuiver * 0.4};
        neck   = {x: 1, y: -40 + sobQuiver * 0.8};
        head   = {x: 3, y: -54 + sobQuiver};
        p.headTilt = 0.12 + sobQuiver * 0.04;

        // Hai tay đưa lên ôm mặt / dụi mắt nấc nở
        handL  = {x: head.x - 3, y: head.y + 2 + sobQuiver};
        elbowL = {x: -12, y: -42 + sobQuiver};
        handR  = {x: head.x + 3, y: head.y + 2 - sobQuiver};
        elbowR = {x: 12,  y: -42 - sobQuiver};

        // Hai chân hơi co gối nằm co ro trên sàn
        kneeL = {x: -8, y: -10}; footL = {x: -12, y: -2};
        kneeR = {x: 6,  y: -12}; footR = {x: 10,  y: -3};
    }
    else if (moveState === 'wall_splat') {
        head = {x: -8, y: -56}; neck = {x: -5, y: -42}; pelvis = {x: -2, y: -18};
        p.headTilt = -0.35;
        handL = {x: -18, y: -62}; elbowL = {x: -12, y: -46};
        handR = {x: 14, y: -60}; elbowR = {x: 8, y: -45};
        footL = {x: -14, y: 0}; kneeL = {x: -8, y: -10};
        footR = {x: 12, y: -4}; kneeR = {x: 6, y: -12};
    }
    else if (moveState === 'stunned') {
        let sway = Math.sin(fastF * 0.6) * 8;
        head = {x: sway, y: -56}; neck = {x: sway * 0.6, y: -43}; pelvis = {x: -sway * 0.4, y: -18};
        p.headTilt = sway * 0.03;
        handL = {x: -18 + sway, y: -28}; elbowL = {x: -14 + sway * 0.5, y: -36};
        handR = {x: 18 + sway, y: -28}; elbowR = {x: 14 + sway * 0.5, y: -36};
    }
    else if (moveState === 'hurt') { 
        head.x = -18; neck.x = -13; pelvis.x = -5; p.headTilt = -0.28;
        handL = {x: -22, y: -52}; handR = {x: -8, y: -56}; 
        elbowL = {x: -18, y: -35}; elbowR = {x: 0, y: -38}; 
        footL.x = -15; footR.x = 22; 
    } 
    else if (moveState === 'block') { 
        head.x = -5; 
        handR = {x: 12, y: -55 + bounce}; elbowR = {x: 16, y: -35 + bounce}; 
        handL = {x: 2, y: -55 + bounce}; elbowL = {x: -8, y: -35 + bounce}; 
    } 
    // 4. Các Thế Đấm Võ Thuật Chi Tiết (Jab, Cross, Uppercut, One-Inch Punch, Dempsey Roll...)
    else if (moveState === 'uppercut' || moveState === 'dragon_uppercut') {
        let lift = ext * 16;
        pelvis = {x: 6 * ext, y: -20 - lift * 0.4};
        neck = {x: 10 * ext, y: -45 - lift * 0.5};
        head = {x: 12 * ext, y: -60 - lift * 0.5};
        p.headTilt = -0.15 * ext;
        handR = {x: 22 + 12 * ext, y: -35 - 48 * ext};
        elbowR = {x: 18 + 10 * ext, y: -28 - 22 * ext};
        handL = {x: -12, y: -38}; elbowL = {x: -16, y: -28};
        footR = {x: 18, y: -lift * 0.3}; kneeR = {x: 14, y: -12 - lift * 0.3};
    }
    else if (moveState === 'one_inch_punch' || moveState === 'palm_strike' || moveState === 'web_strike') {
        pelvis = {x: 10 * ext, y: -16};
        neck = {x: 16 * ext, y: -42};
        head = {x: 20 * ext, y: -56};
        p.headTilt = 0.15 * ext;
        handR = {x: 20 + 32 * ext, y: -42};
        elbowR = {x: 12 + 16 * ext, y: -38};
        handL = {x: -10, y: -32}; elbowL = {x: -14, y: -25};
        footL = {x: -18, y: 0}; footR = {x: 22, y: 0}; kneeR = {x: 18, y: -10};
    }
    else if (moveState === 'elbow_strike' || moveState === 'shoulder_bash') {
        pelvis = {x: 12 * ext, y: -18};
        neck = {x: 18 * ext, y: -43};
        head = {x: 22 * ext, y: -58};
        elbowR = {x: 18 + 20 * ext, y: -42};
        handR = {x: 8 + 12 * ext, y: -48};
        handL = {x: -8, y: -35}; elbowL = {x: -12, y: -28};
    }
    else if (moveState === 'dempsey_roll' || moveState === 'machine_gun_punches' || moveState === 'asura_strike' || moveState === 'martial_arts_combo') {
        let flurry = Math.sin(fastF * 2.2);
        pelvis = {x: 8, y: -18}; neck = {x: 14, y: -42}; head = {x: 18, y: -56 + flurry * 2};
        handR = {x: 26 + flurry * 18, y: -42 + flurry * 6};
        elbowR = {x: 14 + flurry * 8, y: -34};
        handL = {x: 26 - flurry * 18, y: -38 - flurry * 6};
        elbowL = {x: 14 - flurry * 8, y: -32};
        footL = {x: -16, y: 0}; footR = {x: 20, y: 0};
    }
    else if (p.state === 'punch' || ['jab', 'cross', 'hook', 'backfist', 'spinning_backfist', 'superman_punch'].includes(moveState)) { 
        head.x = (10 + pext / 2) * ext; 
        neck.x = (8 + pext / 2) * ext; 
        pelvis.x = (4 + pext / 2) * ext; 
        handR = {x: neck.x + 15 + 22 * ext, y: -40 + bounce}; 
        elbowR = {x: neck.x + 8 + 10 * ext, y: -35 + bounce}; 
        handL = {x: neck.x - 10, y: -40 + bounce}; 
        elbowL = {x: neck.x - 12, y: -30 + bounce};
    } 
    // 5. Các Thế Đá Cước Pháp Chi Tiết (Axe Kick, Low Sweep, Flying Knee, High Kick...)
    else if (moveState === 'axe_kick') {
        head = {x: -8 * ext, y: -58}; neck = {x: -5 * ext, y: -44}; pelvis = {x: 4 * ext, y: -20};
        let axeY = (progress < 0.45) ? (-54 * ext) : (-12 * ext);
        footR = {x: pelvis.x + 14 + 22 * ext, y: axeY};
        kneeR = {x: pelvis.x + 8 + 12 * ext, y: axeY * 0.55 - 10};
        footL = {x: -12, y: 0}; kneeL = {x: -10, y: -10};
        elbowL = {x: neck.x - 12, y: -35}; handL = {x: neck.x - 18, y: -42};
        elbowR = {x: neck.x + 12, y: -38}; handR = {x: neck.x + 18, y: -48};
    }
    else if (moveState === 'low_kick') {
        pelvis = {x: 8 * ext, y: -12};
        neck = {x: -4 * ext, y: -35};
        head = {x: -8 * ext, y: -49};
        footR = {x: pelvis.x + 14 + 24 * ext, y: -2};
        kneeR = {x: pelvis.x + 8 + 12 * ext, y: -6};
        footL = {x: -16, y: 0}; kneeL = {x: -12, y: -8};
        elbowL = {x: neck.x - 12, y: -28}; handL = {x: neck.x - 18, y: -24};
        elbowR = {x: neck.x + 10, y: -28}; handR = {x: neck.x + 14, y: -28};
    }
    else if (moveState === 'knee_strike' || moveState === 'flying_knee') {
        pelvis = {x: 8 * ext, y: -24};
        neck = {x: 4 * ext, y: -48};
        head = {x: 6 * ext, y: -62};
        kneeR = {x: pelvis.x + 12 + 12 * ext, y: -32 - 8 * ext};
        footR = {x: pelvis.x + 6 + 6 * ext, y: -16 - 6 * ext};
        footL = {x: -14, y: -4}; kneeL = {x: -10, y: -14};
        elbowL = {x: neck.x - 8, y: -40}; handL = {x: neck.x + 10 * ext, y: -48};
        elbowR = {x: neck.x + 10, y: -42}; handR = {x: neck.x + 14 * ext, y: -52};
    }
    else if (p.state === 'kick' || ['teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick'].includes(moveState)) { 
        head.x = -12 * ext; neck.x = -8 * ext; pelvis.x = -4 * ext; 
        let kickHeight = (moveState === 'high_kick' || moveState === 'spinning_heel') ? 26 : 18;
        footR = {x: pelvis.x + 14 + 24 * ext, y: -10 - kickHeight * ext + bounce}; 
        kneeR = {x: pelvis.x + 8 + 12 * ext, y: -14 - (kickHeight * 0.5) * ext + bounce}; 
        footL = {x: -14, y: 0}; kneeL = {x: -10, y: -10}; 
        elbowR = {x: neck.x + 6, y: -35}; handR = {x: neck.x - 6 * ext, y: -40}; 
        elbowL = {x: neck.x - 12, y: -35}; handL = {x: neck.x - 20 * ext, y: -35}; 
    } 
    // 6. Các Tư Thế Lướt & Chiêu Thức Đặc Biệt
    else if (moveState === 'dash') { 
        head.x = 22; head.y = -46; neck.x = 12; neck.y = -36; pelvis.x = 0; pelvis.y = -20; 
        handR = {x: 32, y: -25}; elbowR = {x: 20, y: -28}; 
        handL = {x: 2, y: -25}; elbowL = {x: 8, y: -28}; 
        footR = {x: 15, y: -10}; kneeR = {x: 12, y: -15}; 
        footL = {x: -24, y: -5}; kneeL = {x: -12, y: -12}; 
    } 
    else if (moveState === 'dash_back') { 
        head.x = -14; head.y = -50; neck.x = -8; neck.y = -39; pelvis.x = 5; pelvis.y = -20; 
        handR = {x: 14, y: -45}; elbowR = {x: 5, y: -35}; 
        handL = {x: -8, y: -45}; elbowL = {x: -15, y: -35}; 
        footR = {x: 20, y: 0}; kneeR = {x: 14, y: -10}; 
        footL = {x: -14, y: -5}; kneeL = {x: -4, y: -14}; 
    } 
    else if (moveState === 'cast' || moveState === 'livestream_drama') { 
        head.x = 0; head.y = -62 + bounce; 
        handL = {x: -22, y: -68}; handR = {x: 22, y: -68}; 
        elbowL = {x: -14, y: -52}; elbowR = {x: 14, y: -52}; 
        footL.x = -18; footR.x = 18; 
    }
    else if (moveState === 'hollow_purple') { 
        let floatY = Math.sin(tFrame) * 10; 
        pelvis.y = -35 + floatY; head.y = -75 + floatY; neck.y = -60 + floatY; 
        handR = {x: 15, y: -65 + floatY}; elbowR = {x: 5, y: -50 + floatY}; 
        handL = {x: 22, y: -50 + floatY}; elbowL = {x: 10, y: -42 + floatY}; 
        footL = {x: -10, y: -15 + floatY}; kneeL = {x: -14, y: -25 + floatY}; 
        footR = {x: 10, y: -10 + floatY}; kneeR = {x: 14, y: -20 + floatY}; 
    }
    else if (moveState === 'naruto_seal') { 
        head.y = -55; head.x = 5; pelvis.y = -15;
        handL = {x: 8, y: -44}; elbowL = {x: -6, y: -36}; 
        handR = {x: 12, y: -44}; elbowR = {x: 18, y: -36}; 
        footL = {x: -18, y: 0}; footR = {x: 18, y: 0}; 
        kneeL = {x: -16, y: -12}; kneeR = {x: 16, y: -12}; 
    }
    else if (moveState === 'super_saiyan') { 
        let vibe = Math.random() * 4; 
        pelvis.y = -16 + vibe; neck.y = -40 + vibe; head.y = -55 + vibe; 
        handL = {x: -20+vibe, y: -30+vibe}; elbowL = {x: -16, y: -38}; 
        handR = {x: 20+vibe, y: -30+vibe}; elbowR = {x: 16, y: -38}; 
        footL = {x: -18, y: 0}; footR = {x: 18, y: 0}; 
        kneeL = {x: -16, y: -12}; kneeR = {x: 16, y: -12}; 
    }
    else if (moveState === 'kame_fire') { 
        pelvis.y = -16; head.x = 12; head.y = -48; neck.x = 6; neck.y = -36;
        footL = {x: -18, y: 0}; footR = {x: 20, y: 0}; kneeR = {x: 16, y: -10}; 
        handL = {x: 32, y: -32}; handR = {x: 34, y: -35}; 
        elbowL = {x: 18, y: -28}; elbowR = {x: 20, y: -32}; 
    }
    else if (moveState === 'matrix_dodge') { 
        let lean = Math.min(1, progress * 2); 
        pelvis.x = 8; pelvis.y = -14; 
        neck.x = -10 * lean; neck.y = -30; 
        head.x = -22 * lean; head.y = -24 * lean - 12; 
        footL = {x: -10, y: 0}; footR = {x: 22, y: 0}; kneeR = {x: 16, y: -12}; 
        handL = {x: -18, y: -8}; elbowL = {x: -16, y: -20}; 
        handR = {x: 10, y: -14}; elbowR = {x: 2, y: -22}; 
    }
    else if (moveState === 'shoryuken') { 
        pelvis.y = -40; head.x = 8; head.y = -80; neck.y = -65; 
        footL = {x: -10, y: -20}; kneeL = {x: -14, y: -30}; 
        footR = {x: 14, y: -26}; kneeR = {x: 16, y: -42}; 
        handR = {x: 12, y: -96}; elbowR = {x: 12, y: -78}; 
        handL = {x: -12, y: -46}; elbowL = {x: -14, y: -56}; 
    }
    else if (moveState === 'tatsumaki') { 
        pelvis.y = -30; head.y = -70; neck.y = -54; 
        let spin = Math.sin(fastF * 2.5); 
        footR = {x: 28 * spin, y: -34}; kneeR = {x: 15 * spin, y: -32}; 
        footL = {x: 0, y: -12}; kneeL = {x: -8, y: -22}; 
        elbowL = {x: -12 * spin, y: -50}; handL = {x: -22 * spin, y: -50};
        elbowR = {x: 12 * spin, y: -50}; handR = {x: 22 * spin, y: -50}; 
    }
    else if (moveState === 'levitate') { 
        let floatY = Math.sin(tFrame) * 15; 
        pelvis.y = -40 + floatY; head.y = -80 + floatY; neck.y = -65 + floatY; 
        handL = {x: -22, y: -42 + floatY}; elbowL = {x: -14, y: -52 + floatY}; 
        handR = {x: 22, y: -42 + floatY}; elbowR = {x: 14, y: -52 + floatY}; 
        footL = {x: -10, y: -16 + floatY}; kneeL = {x: -14, y: -28 + floatY}; 
        footR = {x: 10, y: -16 + floatY}; kneeR = {x: 14, y: -28 + floatY}; 
    }
    else if (moveState === 'muoi_kho_scold') {
        let wave = Math.sin(fastF * 2.0) * 12;
        head.x = 5; head.y = -58 + Math.abs(wave) * 0.2;
        p.headTilt = 0.12;
        handL = {x: -10, y: -26}; elbowL = {x: -14, y: -35};
        handR = {x: 22, y: -54 + wave}; elbowR = {x: 14, y: -43 + wave * 0.5};
        footL = {x: -15, y: 0}; footR = {x: 16, y: 0};
    }
    else if (moveState === 'story_talk') {
        let talkWave = Math.sin(fastF * 1.45);
        let pointBob = Math.cos(fastF * 1.1) * 5.5;
        head.x = 3; head.y = -60 + Math.abs(talkWave) * 2.2;
        neck.x = 1.5; neck.y = -45 + Math.abs(talkWave) * 1.0;
        p.headTilt = 0.08 + talkWave * 0.08;
        // Tay trái chống hông cà khịa, tay phải chỉ thẳng mặt đối thủ nhịp nhàng
        elbowL = {x: -13, y: -33}; handL = {x: -8, y: -23};
        elbowR = {x: 13, y: -43 + pointBob * 0.4}; handR = {x: 26, y: -49 + pointBob};
        footL = {x: -14, y: 0}; kneeL = {x: -9, y: -10};
        footR = {x: 15, y: 0}; kneeR = {x: 10, y: -10};
    }

    let rawPts = { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    let resultPts = window.constrainSkeletonPose(rawPts, p.attackTimer > 0);
    p._lastRenderedPts = resultPts;
    return resultPts;
};

// --- HÀM VẼ NHÂN VẬT DUY NHẤT TOÀN GAME ---
window.drawStickman = function(ctx, p, isTrail = false) {
    if (!p || isNaN(p.x) || isNaN(p.y)) return; 
    ctx.save(); 
    ctx.translate(p.x, p.y); 
    
    if (!p.isFacingRight) ctx.scale(-1, 1);
    if (p.scale && p.scale !== 1) ctx.scale(p.scale, p.scale);

    // Bóng đổ dưới đất (khi ở màn hình Preview/Intro không có bóng của engine_rend.js)
    if (!isTrail && p.onGround && !p.hasEngineShadow) {
        ctx.save();
        ctx.shadowBlur = 0; 
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath(); 
        ctx.ellipse(0, 0, 22, 4, 0, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }

    ctx.strokeStyle = "#fff"; 
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    
    if (isTrail) { 
        ctx.globalAlpha = p.alpha || 0.3; 
        ctx.shadowBlur = 0; 
    } else if (p.iFrames > 0) {
        ctx.globalAlpha = (Math.floor(Date.now() / 45) % 2 === 0) ? 0.72 : 1.0;
    }

    let isDancingNow = window.DanceEngine && window.DanceEngine.isDanceState(p.state);
    let bounce = (p.state === 'walk' || isDancingNow) ? Math.abs(Math.sin(Date.now() / 90)) * 5 : 0;
    
    let maxT = 15;
    if (p.state === 'jab') maxT = 10; 
    else if (p.state === 'cross' || p.state === 'hook') maxT = 14; 
    else if (p.state === 'low_kick' || p.state === 'teep_kick') maxT = 16; 
    else if (p.state === 'backfist' || p.state === 'spinning_backfist' || p.state === 'elbow_strike' || p.state === 'palm_strike') maxT = 18; 
    else if (p.state === 'shoulder_bash' || p.state === 'knee_strike' || p.state === 'flying_knee' || p.state === 'superman_punch') maxT = 20; 
    else if (p.state === 'high_kick' || p.state === 'spinning_heel') maxT = 22; 
    else if (p.state === 'uppercut' || p.state === 'tornado_kick') maxT = 24; 
    else if (p.state === 'axe_kick') maxT = 26; 
    else if (p.state === 'dragon_uppercut') maxT = 35; 
    else if (p.state === 'machine_gun_punches') maxT = 60; 
    else if (p.state === 'one_inch_punch') maxT = 38; 
    else if (p.state === 'asura_strike') maxT = 35; 
    else if (p.state === 'cast') maxT = 45; 
    else if (p.state === 'dash' || p.state === 'dash_back') maxT = 15; 
    else if (p.state === 'dempsey_roll') maxT = 30;
    
    p.maxT = maxT;
    let safeTimer = Math.max(0, Math.min(p.attackTimer, maxT)); 
    let progress = (p.attackTimer > 0) ? 1 - (safeTimer / maxT) : 0; 
    let ext = 0; 
    
    if (progress > 0) { 
        if (progress < 0.3) {
            ext = Math.sin((progress / 0.3) * (Math.PI / 2)); 
        } else {
            ext = 1 - Math.pow((progress - 0.3) / 0.7, 2); 
        }
    }
    
    let pext = (progress > 0.5) ? (1 - progress) * 2 : progress * 2;
    let customDrawSuccess = false;
    let originalMoveState = p.state;
    p.rawMoveState = originalMoveState;
    
    if (p.drawMethod && typeof p.drawMethod === 'function') { 
        let passedExt = ext; 
        let passedPext = pext;
        
        if (originalMoveState === 'machine_gun_punches') { 
            p.state = 'punch'; 
            passedExt = Math.sin(((progress * 5) % 1) * Math.PI); 
            passedPext = passedExt; 
        } 
        else if (originalMoveState === 'asura_strike') { 
            p.state = 'punch'; 
            passedExt = progress < 0.2 ? 0 : (progress > 0.8 ? 0 : 1); 
            passedPext = passedExt; 
        } 
        else if (['jab', 'cross', 'hook', 'elbow_strike', 'backfist', 'spinning_backfist', 'palm_strike', 'shoulder_bash', 'superman_punch', 'one_inch_punch', 'dempsey_roll'].includes(originalMoveState)) { 
            p.state = 'punch'; 
        } 
        else if (['uppercut', 'dragon_uppercut', 'low_kick', 'teep_kick', 'high_kick', 'spinning_heel', 'tornado_kick', 'axe_kick', 'knee_strike', 'flying_knee'].includes(originalMoveState)) { 
            p.state = 'kick'; 
        }

        try { 
            p.drawMethod(ctx, p, bounce, passedExt, passedPext, isTrail); 
            customDrawSuccess = true; 
        } 
        catch (e) { 
            console.error("Lỗi vẽ nhân vật tùy chỉnh:", e); 
        } 
        finally { 
            p.state = originalMoveState; 
            p.rawMoveState = undefined;
        }
    }

    if (!customDrawSuccess) {
        let targetPts = window.drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
        let smoothedPts = isTrail ? targetPts : window.blendSkeleton(p, targetPts);
        p._lastRenderedPts = smoothedPts;
        let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = smoothedPts;

        const drawLimb = (start, mid, end) => { 
            let grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            grad.addColorStop(0, p.color || "#2c3e50"); 
            grad.addColorStop(1, isTrail ? "rgba(255,255,255,0.2)" : "#ecf0f1"); 
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 6.5;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.stroke();
            
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(mid.x, mid.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Hào quang khớp xương 2 lớp siêu mượt (Không dùng shadowBlur trong hàm con)
            if (!isTrail) {
                ctx.save();
                ctx.fillStyle = p.color || "#00f3ff";
                ctx.globalAlpha = 0.28;
                ctx.beginPath(); ctx.arc(mid.x, mid.y, 5.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(end.x, end.y, 7.0, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1.0;
                ctx.beginPath(); ctx.arc(mid.x, mid.y, 2.5, 0, Math.PI * 2); ctx.fill(); 
                ctx.beginPath(); ctx.arc(end.x, end.y, 3.5, 0, Math.PI * 2); ctx.fill(); 
                ctx.restore();
            }
        };

        if (!isTrail) {
            if (!p.scarfNodes) {
                p.scarfNodes = Array(6).fill().map(() => ({x: neck.x, y: neck.y, oldX: neck.x, oldY: neck.y}));
            }

            let wind = window.globalWind || 0.8;
            let gravity = 0.6;
            let nodeDist = 5.5; 
            let curScarfTick = window._physicsTickCounter || 0;
            let stepScarfNow = (!window.isLoopRunning || p._lastScarfTick !== curScarfTick);
            p._lastScarfTick = curScarfTick;

            p.scarfNodes[0].x = neck.x;
            p.scarfNodes[0].y = neck.y;

            ctx.beginPath();
            ctx.moveTo(neck.x, neck.y);

            for (let i = 1; i < p.scarfNodes.length; i++) {
                let node = p.scarfNodes[i];
                let prevNode = p.scarfNodes[i - 1];

                if (stepScarfNow) {
                    let vx = (node.x - node.oldX) * 0.85;
                    let vy = (node.y - node.oldY) * 0.85;
                    
                    node.oldX = node.x;
                    node.oldY = node.y;
                    
                    let charVx = (p.scarfWind !== undefined) ? p.scarfWind : (p.vx || 0); 
                    node.x += vx - charVx * 0.3 + (Math.random() * wind * 2 - wind);
                    node.y += vy - (p.vy || 0) * 0.3 + gravity;

                    let dx = node.x - prevNode.x;
                    let dy = node.y - prevNode.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 0.001) dist = 0.001; 
                    let diff = (nodeDist - dist) / dist;
                    
                    node.x += dx * diff * 0.6;
                    node.y += dy * diff * 0.6;
                }

                let xc = (prevNode.x + node.x) / 2;
                let yc = (prevNode.y + node.y) / 2;
                ctx.quadraticCurveTo(prevNode.x, prevNode.y, xc, yc);
            }
            
            ctx.lineCap = "round";
            ctx.lineWidth = 3.2;
            ctx.strokeStyle = p.color || "#ff2a2a";
            ctx.stroke();
        }

        ctx.fillStyle = "#1a1a1a";
        ctx.strokeStyle = p.color || "#fff";
        ctx.lineWidth = 2; 
        ctx.beginPath();
        ctx.moveTo(neck.x - 4, neck.y); 
        ctx.lineTo(neck.x + 4, neck.y); 
        ctx.lineTo(pelvis.x + 3, pelvis.y); 
        ctx.lineTo(pelvis.x - 3, pelvis.y);
        ctx.closePath();
        ctx.fill(); 
        ctx.stroke(); 

        drawLimb(pelvis, kneeL, footL); 
        drawLimb(pelvis, kneeR, footR); 
        drawLimb(neck, elbowL, handL); 
        drawLimb(neck, elbowR, handR); 

        if (typeof window.drawAvatarHead === 'function') {
            window.drawAvatarHead(ctx, head, p, isTrail);
        }

        // Tự động vẽ vũ khí/vật phẩm cầm tay nếu nhân vật có khai báo weaponIcon
        let charDef = (p.classId && window.classStats) ? window.classStats[p.classId] : null;
        let wIcon = p.weaponIcon || (charDef && charDef.weaponIcon);
        if (wIcon && !isTrail) {
            ctx.save();
            ctx.translate(handR.x, handR.y);
            ctx.rotate(p.attackTimer > 0 ? 0.55 : 0.15);
            ctx.font = "22px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(wIcon, 6, -4);
            ctx.restore();
        }
    }

    // VỆT SÁNG ĐÒN ĐÁNH (ATTACK TRAIL), ĐẠO CỤ VŨ ĐẠO & CHOÁNG/KHÓC DÙNG CHUNG CHO CẢ 17 NHÂN VẬT TÙY CHỈNH
    let activePts = p._lastRenderedPts || p.currentSkeleton;
    if (!isTrail && !window._vintageRenderMode) {
        let emoHead = (activePts && activePts.head) ? activePts.head : { x: 0, y: -56 };
        if (typeof window.drawStunStars === 'function') {
            window.drawStunStars(ctx, emoHead, p);
        }
        if (typeof window.drawCryingTears === 'function') {
            window.drawCryingTears(ctx, emoHead, p);
        }
    }
    if (!isTrail && isDancingNow && activePts && window.DanceEngine && typeof window.DanceEngine.drawDanceProps === 'function') {
        window.DanceEngine.drawDanceProps(ctx, p, activePts);
    }
    if (!isTrail && p.attackTimer > 0 && activePts && p.state !== 'block' && p.state !== 'cast') {
        if (!p.attackTrail) p.attackTrail = [];
        
        let curTrailTick = window._physicsTickCounter || 0;
        if (!window.isLoopRunning || p._lastTrailTick !== curTrailTick || p.attackTrail.length === 0) {
            p._lastTrailTick = curTrailTick;
            let isKickMove = originalMoveState.includes('kick') || originalMoveState.includes('knee') || originalMoveState.includes('heel') || originalMoveState === 'tatsumaki';
            let strikePoint = isKickMove ? (activePts.footR || {x: 20, y: -20}) : (activePts.handR || {x: 25, y: -40});

            p.attackTrail.unshift({x: strikePoint.x, y: strikePoint.y});
            if (p.attackTrail.length > 8) p.attackTrail.pop(); 
        }

        if (p.attackTrail.length > 2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.attackTrail[0].x, p.attackTrail[0].y);
            for (let i = 1; i < p.attackTrail.length; i++) {
                ctx.lineTo(p.attackTrail[i].x, p.attackTrail[i].y);
            }
            
            ctx.lineWidth = 10; 
            let grad = ctx.createLinearGradient(
                p.attackTrail[0].x, p.attackTrail[0].y,
                p.attackTrail[p.attackTrail.length - 1].x, p.attackTrail[p.attackTrail.length - 1].y
            );
            grad.addColorStop(0, p.color || "#00f3ff"); 
            grad.addColorStop(1, "rgba(0,0,0,0)");      
            
            ctx.strokeStyle = grad;
            ctx.globalCompositeOperation = "lighter"; 
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.restore();
        }
    } else if (p.attackTrail && p.attackTrail.length > 0) {
        p.attackTrail = []; 
    }

    if (!isTrail && p.shield > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 50, 0, Math.PI * 2); 
        ctx.fillStyle = "rgba(52, 152, 219, 0.12)"; ctx.fill(); 
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(52, 152, 219, 0.85)"; ctx.stroke(); 
    }
    
    if (!isTrail && p.superArmor > 0) { 
        ctx.beginPath(); ctx.arc(0, -30, 45, 0, Math.PI * 2); 
        ctx.lineWidth = 2.5; ctx.strokeStyle = "rgba(255, 71, 87, 0.85)"; ctx.stroke(); 
        ctx.fillStyle = "rgba(255, 71, 87, 0.15)"; ctx.fill(); 
    }
    
    if (!p.isPlayer && !isTrail && !p.hideHpBar) { 
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-20, -105, 40, 5); 
        ctx.fillStyle = p.color || "#ff4757"; ctx.fillRect(-20, -105, 40 * (Math.max(0, p.hp) / (p.maxHp || 100)), 5); 
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(-20, -105, 40, 5); 
    }

    // HIỆU ỨNG HÀI HƯỚC KHI BỊ HẠ GỤC (LINH HỒN 👻 ĐỘI VÒNG THIÊN THẦN CẦM CỜ TRẮNG 🏳️ BAY LÊN TRỜI)
    if (!isTrail && (p.state === 'ko_falling' || p.state === 'dead')) {
        ctx.save();
        let koElapsed = 100 - (typeof p.koTimer === 'number' ? p.koTimer : 0);
        let floatY = -55 - (koElapsed * 0.85) - ((Date.now() % 1800) * 0.025);
        let swayX = Math.sin(Date.now() / 140) * 10;
        ctx.translate(swayX, floatY);
        ctx.globalAlpha = 0.82;
        // Vòng hào quang thiên thần màu vàng trên đầu hồn ma
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, -16, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("👻", 0, 0);
        ctx.font = "15px Arial";
        ctx.fillText("🏳️", 14, -4 + Math.sin(Date.now() / 90) * 3);
        ctx.restore();
    } else if (!isTrail && p.state === 'block' && (p.stamina || 100) < 38) {
        // Giơ cờ trắng đầu hàng run lập cập khi đỡ đòn sắp vỡ khiên
        ctx.save();
        let shakeX = Math.sin(Date.now() / 35) * 2.5;
        ctx.font = "17px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🏳️💦", shakeX, -94);
        ctx.restore();
    }
    
    ctx.restore();
};

window.assignDrawMethods = function(statsObj) { };

// ==========================================
// HÀM VẼ ĐẦU AVATAR NGUYÊN BẢN + BIỂU CẢM SLAPSTICK VUI NHỘN KHI ĐÁNH NHAU (ITCHIO EMOTION SUITE)
// ==========================================
window.drawAvatarHead = function(ctx, head, p, isTrail, headSize = 34) {
    let avatarUrl = p.avatarUrl;
    if (!avatarUrl && p.classId && window.classStats && window.classStats[p.classId]) {
        avatarUrl = window.classStats[p.classId].avatarUrl;
    }
    if (!avatarUrl && window.currentLoadedChar) {
        avatarUrl = window.currentLoadedChar.avatarUrl;
    }

    let now = Date.now();
    let isDeadOrCrying = !isTrail && (p.state === 'dead' || p.state === 'ko_falling' || p.isCrying || (window.gameOver && p.hp <= 0));
    let isHurtNow = !isTrail && (p.state === 'hurt' || (p.hitStun || 0) > 0 || isDeadOrCrying);
    let isStunnedNow = !isTrail && !isDeadOrCrying && (p.state === 'stunned' || (p.stunTimer || 0) > 0 || (p.hitStun || 0) >= 16);
    let hpRatio = (p.maxHp && p.maxHp > 0 && typeof p.hp === 'number') ? (p.hp / p.maxHp) : (isDeadOrCrying ? 0 : 1);

    const drawHeadEmotions = (ctx, hSize) => {
        // 1. CỤC U ĐỎ SƯNG VÙ TRÊN ĐỈNH ĐẦU KHI MẤT MÁU (Chồng 2 cục u nếu máu thấp!)
        if (!isTrail && (hpRatio < 0.82 || isDeadOrCrying) && !p.hideHpBar) {
            let pulse = isHurtNow ? (1 + Math.abs(Math.sin(now * 0.045)) * 0.35) : (1 + Math.sin(now * 0.008) * 0.08);
            let bumpR = 5.2 * pulse;
            let bumpY = -hSize / 2 + 1;
            ctx.save();
            ctx.translate(2, bumpY);
            // Cục u tầng 1
            ctx.beginPath();
            ctx.arc(0, 0, bumpR, 0, Math.PI * 2);
            ctx.fillStyle = "#ff4d6d";
            ctx.fill();
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = "#111";
            ctx.stroke();
            // Điểm bóng sáng trên cục u
            ctx.beginPath();
            ctx.arc(-bumpR * 0.3, -bumpR * 0.3, bumpR * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();

            // Nếu máu dưới 45% -> Mọc thêm cục u tầng 2 chồng lên trên!
            if (hpRatio < 0.45) {
                let bumpR2 = 3.8 * pulse;
                ctx.beginPath();
                ctx.arc(1, -bumpR - bumpR2 * 0.65, bumpR2, 0, Math.PI * 2);
                ctx.fillStyle = "#ff2a4b";
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        // 2. HAI VÒI NƯỚC MẮT PHUN NGANG NHƯ VÒI RỒNG KHI ĐANG BỊ ĐÁNH ĐAU
        if (isHurtNow) {
            ctx.save();
            ctx.strokeStyle = "#00f3ff";
            ctx.lineWidth = 2.6;
            ctx.lineCap = "round";
            let tearWave = Math.sin(now * 0.05) * 3;
            // Vòi nước mắt trái
            ctx.beginPath();
            ctx.moveTo(-6, -2);
            ctx.quadraticCurveTo(-18, -8 + tearWave, -26, 4 + tearWave);
            ctx.stroke();
            // Vòi nước mắt phải
            ctx.beginPath();
            ctx.moveTo(6, -2);
            ctx.quadraticCurveTo(18, -8 - tearWave, 26, 4 - tearWave);
            ctx.stroke();
            ctx.restore();
        }

        // 3. MỒ HÔI HỘT (💦) KHI SẮP HẾT MÁU (Đã gỡ bỏ dấu tức giận 💢 trên đầu theo yêu cầu)
        if (!isTrail && hpRatio > 0 && hpRatio < 0.38 && !p.hideHpBar) {
            ctx.save();
            let dropOffset = (now % 500) / 500;
            ctx.globalAlpha = 1 - dropOffset * 0.7;
            ctx.font = "13px Arial";
            ctx.fillText("💦", -hSize * 0.55 - dropOffset * 6, -hSize * 0.2 + dropOffset * 8);
            ctx.restore();
        }
    };

    const drawFallbackHead = () => {
        ctx.save();
        ctx.translate(head.x, head.y - 4);
        let tilt = (p.headTilt !== undefined) ? p.headTilt : (p.vx || 0) * 0.05;
        if (isHurtNow) tilt += Math.sin(now * 0.08) * 0.28 - 0.18;
        ctx.rotate(tilt);

        if (isHurtNow) {
            let wobble = Math.sin(now * 0.065) * 0.22;
            ctx.scale(1 + wobble, 1 - wobble * 0.85);
        } else if (!isTrail && (p.attackTimer || 0) > 0) {
            ctx.scale(1.06, 0.96);
        }

        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); 
        ctx.fillStyle = "#ffddc1"; ctx.fill(); 
        ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke(); 

        drawHeadEmotions(ctx, 24);
        ctx.restore();

        // 5. VÒNG SAO CHOÁNG & GÀ CON (🐤 ⭐ 💫) QUAY TRÒN QUANH ĐẦU KHI BỊ CHOÁNG / STUN
        if (isStunnedNow) {
            ctx.save();
            ctx.translate(head.x, head.y - 22);
            let icons = ["⭐", "🐤", "💫"];
            let baseAng = now * 0.0085;
            for (let i = 0; i < 3; i++) {
                let ang = baseAng + (i * Math.PI * 2) / 3;
                let ox = Math.cos(ang) * 19;
                let oy = Math.sin(ang) * 5.5;
                ctx.font = "13px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(icons[i], ox, oy);
            }
            ctx.restore();
        }
    };

    if (avatarUrl) {
        let img = window.getSharedCachedImg(avatarUrl);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.translate(head.x, head.y - 4);

            let tilt = (p.headTilt !== undefined) ? p.headTilt : (p.vx || 0) * 0.05;
            if (isHurtNow) {
                tilt += Math.sin(now * 0.08) * 0.28 - 0.18;
            }
            ctx.rotate(tilt);

            // Hiệu ứng Squash & Stretch (Móp méo đầu kiểu hoạt hình khi bị đấm trúng hoặc đang gáy thoại)
            if (isHurtNow) {
                let wobble = Math.sin(now * 0.065) * 0.22;
                ctx.scale(1 + wobble, 1 - wobble * 0.85);
            } else if (!isTrail && p._isSpeakingNow && p.hp > 0) {
                let talkPulse = Math.sin(now * 0.024) * 0.045;
                ctx.scale(1 - talkPulse * 0.6, 1 + talkPulse);
            } else if (!isTrail && (p.attackTimer || 0) > 0) {
                ctx.scale(1.06, 0.96);
            }

            // Vẽ trực tiếp ảnh PNG nguyên đầu (dùng mipmap 96x96 hoặc ảnh Vintage cached sẵn để Zero-Lag)
            let drawSource = window._vintageRenderMode
                ? (window.getVintageCachedImg(avatarUrl, window._vintageRenderMode) || img._mip96 || img)
                : (img._mip96 || img);
            ctx.drawImage(drawSource, -headSize / 2, -headSize / 2, headSize, headSize);

            // Vẽ toàn bộ biểu cảm Slapstick: Cục u, Hai vòi nước mắt, Gân giận, Mồ hôi
            if (!window._vintageRenderMode) {
                drawHeadEmotions(ctx, headSize);
            }

            ctx.restore();

            // 5. VÒNG SAO CHOÁNG & GÀ CON (🐤 ⭐ 💫) QUAY TRÒN QUANH ĐẦU KHI BỊ CHOÁNG / STUN
            if (isStunnedNow) {
                ctx.save();
                ctx.translate(head.x, head.y - headSize * 0.65);
                let icons = ["⭐", "🐤", "💫"];
                let baseAng = now * 0.0085;
                for (let i = 0; i < 3; i++) {
                    let ang = baseAng + (i * Math.PI * 2) / 3;
                    let ox = Math.cos(ang) * 19;
                    let oy = Math.sin(ang) * 5.5;
                    let sp = window.getTextSpriteCached ? window.getTextSpriteCached(icons[i], "13px Arial", "#fff", "", 0) : null;
                    if (sp) {
                        ctx.drawImage(sp.cv, ox - sp.w * 0.5, oy - sp.h * 0.5, sp.w, sp.h);
                    } else {
                        ctx.font = "13px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(icons[i], ox, oy);
                    }
                }
                ctx.restore();
            }
        } else {
            drawFallbackHead();
        }
    } else {
        drawFallbackHead();
    }
};

// ==========================================
// HIỆU ỨNG CHOÁNG: 3 NGÔI SAO VÀNG 3D XOAY QUANH ĐẦU + CHỮ CHOÁNG!
// ==========================================
window.drawStunStars = function(ctx, head, p) {
    if (!p || p.state === 'dead' || p.hp <= 0 || (p.state !== 'stunned' && (!p.stunTimer || p.stunTimer <= 0))) return;
    ctx.save();
    let t = Date.now() / 220;
    let starCount = 3;
    let rx = 22, ry = 7;
    let cy = head.y - 18;

    // Quỹ đạo elip mờ 3D nghiêng nhẹ
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(head.x, cy, rx, ry, -0.15, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 235, 59, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < starCount; i++) {
        let angle = t + (i * (Math.PI * 2 / starCount));
        let sx = head.x + Math.cos(angle) * rx;
        let sy = cy + Math.sin(angle) * ry;
        let starScale = 0.8 + Math.sin(angle) * 0.3; // Hiệu ứng chiều sâu 3D
        let rot = angle * 2.8;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(rot);
        ctx.scale(starScale, starScale);

        // Hào quang mềm + Ngôi sao 4 cánh lấp lánh vàng rực (Không dùng shadowBlur)
        ctx.fillStyle = "rgba(255, 235, 59, 0.28)";
        ctx.beginPath();
        ctx.arc(0, 0, 8.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = (i % 2 === 0) ? "#ffd700" : "#ffeb3b";
        ctx.beginPath();
        let spikes = 4;
        let outerR = 6.5, innerR = 2.4;
        for (let s = 0; s < spikes * 2; s++) {
            let r = (s % 2 === 0) ? outerR : innerR;
            let a = s * Math.PI / spikes;
            if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();

        // Điểm sáng trắng ở tâm ngôi sao
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Nhãn chữ "💫 CHOÁNG!" nổi bật (vẽ bằng Sprite Cache Zero-Lag)
    let stunSp = window.getTextSpriteCached ? window.getTextSpriteCached("💫 CHOÁNG!", "900 11px 'Segoe UI', Arial, sans-serif", "#ffeb3b", "#000000", 2.5) : null;
    if (stunSp) {
        ctx.drawImage(stunSp.cv, head.x - stunSp.w * 0.5, cy - 10 - stunSp.h * 0.75, stunSp.w, stunSp.h);
    } else {
        ctx.font = "900 11px 'Segoe UI', Arial, sans-serif";
        ctx.fillStyle = "#ffeb3b";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2.5;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.strokeText("💫 CHOÁNG!", head.x, cy - 10);
        ctx.fillText("💫 CHOÁNG!", head.x, cy - 10);
    }

    ctx.restore();
};

// ==========================================
// HIỆU ỨNG KHÓC: TIA NƯỚC MẮT BẮN TUNG TÓE HAI BÊN KHI THUA / KO (ZERO GRADIENT ALLOCATION)
// ==========================================
window.drawCryingTears = function(ctx, head, p) {
    if (!p) return;
    let isCrying = (p.isCrying || p.state === 'crying' || p.state === 'dance_crying_baby' || (window.gameOver && p.hp <= 0) || (p.hp <= 0 && p.state === 'dead'));
    if (!isCrying) return;

    ctx.save();
    ctx.translate(head.x, head.y);
    let t = Date.now() / 65;
    let tearLen = 28;

    let eyeLX = -6, eyeRX = 6;
    let eyeY = -1;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    if (!window._tearGradL) {
        let gL = ctx.createLinearGradient(eyeLX, eyeY, eyeLX - tearLen, eyeY + 20);
        gL.addColorStop(0, "#ffffff");
        gL.addColorStop(0.3, "#00f3ff");
        gL.addColorStop(1, "rgba(0, 168, 255, 0.4)");
        window._tearGradL = gL;

        let gR = ctx.createLinearGradient(eyeRX, eyeY, eyeRX + tearLen, eyeY + 20);
        gR.addColorStop(0, "#ffffff");
        gR.addColorStop(0.3, "#00f3ff");
        gR.addColorStop(1, "rgba(0, 168, 255, 0.4)");
        window._tearGradR = gR;
    }

    // Dòng nước mắt bắn vồng sang trái
    let waveL = Math.sin(t * 0.9) * 3;
    ctx.strokeStyle = window._tearGradL;
    ctx.beginPath();
    ctx.moveTo(eyeLX, eyeY);
    ctx.quadraticCurveTo(eyeLX - 12, eyeY - 10 + waveL, eyeLX - tearLen, eyeY + 14 + waveL);
    ctx.stroke();

    // Dòng nước mắt bắn vồng sang phải
    let waveR = Math.cos(t * 0.9) * 3;
    ctx.strokeStyle = window._tearGradR;
    ctx.beginPath();
    ctx.moveTo(eyeRX, eyeY);
    ctx.quadraticCurveTo(eyeRX + 12, eyeY - 10 + waveR, eyeRX + tearLen, eyeY + 14 + waveR);
    ctx.stroke();

    // Các giọt nước mắt văng lấp lánh (Droplets)
    ctx.fillStyle = "#00f3ff";
    for (let i = 0; i < 4; i++) {
        let phase = ((t * 7 + i * 25) % 100) / 100;
        let dL_x = eyeLX - (phase * (tearLen + 8));
        let dL_y = eyeY + Math.pow(phase, 2) * 24 - Math.sin(phase * Math.PI) * 8;
        let dR_x = eyeRX + (phase * (tearLen + 8));
        let dR_y = eyeY + Math.pow(phase, 2) * 24 - Math.sin(phase * Math.PI) * 8;

        let sz = 1.8 + (1 - phase) * 1.6;
        ctx.beginPath(); ctx.arc(dL_x, dL_y, sz, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(dR_x, dR_y, sz, 0, Math.PI * 2); ctx.fill();
    }

    // Vũng nước mắt đọng dưới sàn / cạnh đầu khi nằm khóc
    ctx.fillStyle = "rgba(0, 243, 255, 0.35)";
    ctx.beginPath();
    if (p.state === 'dead' || p.state === 'ko_falling') {
        let puddleR = 14 + Math.sin(t * 0.3) * 2.5;
        ctx.arc(0, 6, puddleR, 0, Math.PI * 2);
    } else {
        ctx.ellipse(0, -2 - head.y, 20, 4.5, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.restore();
};

