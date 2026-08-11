// ==========================================
// RECORDER.JS - V74.0 THE ALGORITHM BREAKER (DIRECTOR'S CUT)
// ĐÃ FIX & GIỮ NGUYÊN: Intro 3.2s God-Tier, Vỡ kính 3D, Kanji Manga, Đa ngôn ngữ, Kill-Cam.
// NÂNG CẤP TỐI THƯỢNG: Mưa Tim & Bookmark thôi miên tương tác, Rung chấn combat, Viral Post Kit.
// CẢM XÚC: Tối ưu 100% cho Thuật toán TikTok/Shorts (Tăng Like, Save, Comment & Retention).
// NGÁCH VIRAL: "PSYCHOLOGICAL WARFARE & SCHIZO MOVEMENT" 
// ==========================================

window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.videoTrackV = null; window.isRecording = false; window.currentVideoExt = "mp4"; window.savedVideos = [];
window.bakedThumbV = null; 

// CẤU HÌNH THƯƠNG HIỆU
window.CREATOR_HANDLE = "@sticklom";

// QUẢN LÝ INTRO ĐIỆN ẢNH (3.2 GIÂY)
window.introStartTime = 0; 
window.introDuration = 3200; 
window._sfxCuts = [false, false, false, false]; 
window.introParams = null; 

window._cachedGradients = {}; window._glitchThrottle = 0; window._gridVerticalPath = null; 
window._liveAlerts = []; window._lastAlertTime = Date.now(); window._lastCaptureTime = 0; window._recordLoopId = null; 

// HỆ THỐNG ENGAGEMENT PARTICLES (TIM, SAVE, COMMENT BAY LÊN)
window._engagementParticles = Array.from({length: 20}, () => ({ active: false, x: 0, y: 0, v: 0, icon: "", alpha: 0 }));

// ====================================================================
// DEEP SCANNER: LẤY TÊN THỰC TẾ TRONG GAME
// ====================================================================
window.getRealCharName = function(obj, fallback) {
    if (!obj) return fallback.toUpperCase();
    let n = null;
    if (obj.classId !== undefined && window.classStats && window.classStats[obj.classId]) { n = window.classStats[obj.classId].className || window.classStats[obj.classId].name; }
    if (!n) n = obj.className || obj.name || obj.type || obj.id;
    if (!n || n === "undefined" || n === "null") return fallback.toUpperCase();
    return String(n).toUpperCase().trim();
};

// ====================================================================
// PROCEDURAL ENGINE & VIRAL POST KIT GENERATOR
// ====================================================================
const THEMES = [
    { id: "fire", c1: "#3a0000", c2: "#050000", aura: "#ff003c" }, { id: "ice", c1: "#001b3a", c2: "#00050a", aura: "#00f3ff" },
    { id: "toxic", c1: "#0a2a00", c2: "#000a00", aura: "#39ff14" }, { id: "void", c1: "#1a003a", c2: "#05000a", aura: "#b100ff" },
    { id: "gold", c1: "#3a2500", c2: "#0a0500", aura: "#ffb800" }, { id: "blood", c1: "#2a0000", c2: "#000000", aura: "#ff0000" }
];

const LORES = [
    { chapter: "ACT I: THE BETRAYAL", p2Sub: "I taught you everything...", p1Sub: "Now I'll show you my wrath." },
    { chapter: "FINAL CHAPTER: ENDGAME", p2Sub: "Know your place, kid.", p1Sub: "Your era ends tonight." },
    { chapter: "제 1막: 배신", p2Sub: "내가 모든 걸 가르쳤거늘...", p1Sub: "이제 내 분노를 보여주지." },
    { chapter: "마지막 장: 종말", p2Sub: "주제를 알아라, 꼬마야.", p1Sub: "네 시대는 오늘 끝난다." },
    { chapter: "第一幕：裏切り", p2Sub: "すべてを教えたというのに…", p1Sub: "今、私の怒りを見せてやる。" },
    { chapter: "最終章：終焉", p2Sub: "身の程を知れ、小僧。", p1Sub: "お前の時代は今夜終わる。" },
    { chapter: "第一幕：背叛", p2Sub: "我教了你一切...", p1Sub: "现在让你看看我的愤怒。" },
    { chapter: "CHƯƠNG 1: KẺ PHẢN BỘI", p2Sub: "Ta đã dạy ngươi mọi thứ...", p1Sub: "Và giờ ta sẽ kết liễu ông." }
];

const WAGER_BADGES = [
    "🏆 GLOBAL TOP 1% RANKED DUEL",
    "💰 $10,000 WAGER MATCH",
    "💀 PERMA-BAN DEATHMATCH",
    "🔥 WORLD TOURNAMENT FINALS",
    "⚡ UNRANKED SCHIZO INVADE"
];

window.generateIntroParams = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let t1 = r(THEMES); let t2 = r(THEMES.filter(t => t.id !== t1.id));
    let lore = r(LORES);
    return { themeP1: t1, themeP2: t2, lore: lore, badge: r(WAGER_BADGES) };
};

// ====================================================================
window.CELEB_LIST = [
    { name: "IShowSpeed 🐕", color: "#ff4757" }, { name: "xQc 🍌", color: "#ffeb3b" },
    { name: "Kai Cenat 🎬", color: "#00f3ff" }, { name: "CaseOh 🍔", color: "#ffa502" },
    { name: "Jynxzi 🎮", color: "#2ed573" }, { name: "Tyler1 😡", color: "#ff0055" },
    { name: "Ninja 🥷", color: "#1e90ff" }, { name: "Faker_T1 🐐", color: "#ff0055" }
];
window.generateLiveChatEvent = function() {
    const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let celeb = r(window.CELEB_LIST);
    const tmpls = [() => `THE LORE IS CRAZY 😭`, () => `Bro has anime protagonist aura ☢️`, () => `Absolute cinema 🍿🎬`, () => `Wait what language is this? 💀`, () => `RIP BOZO 📉`];
    return { name: celeb.name, color: celeb.color, msg: r(tmpls)(), lines: null, nameWidth: 0 };
};
window.precalcChatText = function(chatObj, ctx) {
    if(chatObj.lines) return; ctx.font = "bold 34px Arial"; chatObj.nameWidth = ctx.measureText(chatObj.name + ":").width;
    let maxMsgWidth = 960 - 60 - chatObj.nameWidth - 10; let words = chatObj.msg.split(' '); let lines = []; let currentLine = "";
    for(let n = 0; n < words.length; n++) { let testLine = currentLine + words[n] + " "; if(ctx.measureText(testLine).width > maxMsgWidth && n > 0) { lines.push(currentLine.trim()); currentLine = words[n] + " "; } else { currentLine = testLine; } }
    lines.push(currentLine.trim()); chatObj.lines = lines;
};

// ====================================================================
window.bannerText1 = ""; window.bannerText2 = "";
window.retentionParticles = Array.from({length: 40}, () => ({ active: false, x: 0, y: 0, s: 0, v: 0, h: 0, age: 0 }));
window.retentionEmojis = Array.from({length: 15}, () => ({ active: false, x: 0, y: 0, v: 0, e: "", r: 0, age: 0 }));

window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) { window.recordAnalyser = window.audioCtx.createAnalyser(); window.recordAnalyser.fftSize = 128; window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount); }

window.StoryModeAI = {
    scriptLines: [], viralTitle: "", _usedTitles: new Set(),
    generateViralStickmanTitle: function(hero, enemy) {
        const adjs = ["ILLEGAL", "SCHIZO", "BIBLICALLY ACCURATE", "UNETHICAL", "FORBIDDEN", "DIABOLICAL", "5D CHESS"];
        const acts = ["PSYCHOLOGICAL WARFARE", "LOBOTOMY COMBO", "SCHIZO MOVEMENT", "GASLIGHTING"];
        const subs = ["PAID ACTOR", "INNOCENT TIMMY", "DEV", "AI BOSS"];
        const reas = ["😭💀", "☢️", "🧠📉", "👁️👄👁️", "🍿", "🎬"];
        const tmpls = [`BRO INITIATED [ACTION] ON A [SUBJECT] [REACTION]`, `USING [ADJ] [ACTION] IS BANNED IN 14 COUNTRIES [REACTION]`, `ABSOLUTE CINEMA: 0 IQ [SUBJECT] VS [ADJ] AURA [REACTION]`];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let rawTitle = r(tmpls).replace(/\[ADJ\]/g, () => r(adjs)).replace(/\[ACTION\]/g, () => r(acts)).replace(/\[SUBJECT\]/g, () => r(subs)).replace(/\[REACTION\]/g, () => r(reas));
        let selectedTags = ["#schizomovement", "#psychologicalwarfare", "#villainarc", "#gaming", "#cinema"].sort(() => 0.5 - Math.random()).slice(0, 4).join(" ");
        return `${rawTitle} ${selectedTags}`;
    },
    generateViralPostKit: function(hero, enemy) {
        const title = this.generateViralStickmanTitle(hero, enemy);
        const pinnedComments = [
            `👇 PINNED: Did ${hero} actually deserve to win this or was it pure luck? Be honest. 💀`,
            `👇 PINNED: Rate this combo 1-10 in the comments. Be brutal. 🔥`,
            `👇 PINNED: Who should I fight next? Top comment gets recorded. 🏆`,
            `👇 PINNED: Devs really need to patch this movement before it ruins ranked... 📉`
        ];
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return `🎬 TIKTOK POST KIT\n\n📌 TITLE & TAGS:\n${title}\n\n💬 PINNED COMMENT TO POST:\n${r(pinnedComments)}`;
    },
    init: function(hero, enemy) { this.viralTitle = this.generateViralStickmanTitle(hero, enemy); }, stop: function() {}
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

function drawLiveBadge(ctx, x, y, audioPeak) {
    let pulse = 1 + (audioPeak * 0.1); ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 15; ctx.fillStyle = "#ff0000";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-70, -25, 140, 50, 15); else ctx.fillRect(-70, -25, 140, 50); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.font = "900 24px 'Arial Black'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🔴 LIVE", 0, 2); ctx.restore();
}

window.bakeThumbnailsForVideo = function(titleText) {
    if (!window.p1) return;
    try {
        window.bakedThumbV = document.createElement('canvas'); window.bakedThumbV.width = 1080; window.bakedThumbV.height = 1920; 
        let ctxV = window.bakedThumbV.getContext('2d');
        let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1; let prm = window.introParams; 
        
        ctxV.fillStyle = prm.themeP1.c1; ctxV.fillRect(0, 0, 1080, 1920); ctxV.save(); ctxV.translate(540, 960);
        for(let i=0; i<30; i++) { ctxV.rotate(Math.PI / 15); ctxV.fillStyle = prm.themeP2.c1; ctxV.beginPath(); ctxV.moveTo(0, 0); ctxV.lineTo(2000, 100); ctxV.lineTo(2000, -100); ctxV.fill(); }
        ctxV.restore(); ctxV.globalCompositeOperation = 'overlay'; ctxV.fillStyle = "rgba(0, 0, 0, 0.5)";
        for(let x=0; x<1080; x+=20) { for(let y=0; y<1920; y+=20) { if((x+y)%40===0) { ctxV.beginPath(); ctxV.arc(x, y, 4, 0, Math.PI*2); ctxV.fill(); } } } ctxV.globalCompositeOperation = 'source-over';
        
        const drawCharSafe = (ctx, charObj, cx, cy, scale, isFacingRight) => {
            if(!charObj) return; ctx.save(); ctx.translate(cx, cy); if(!isFacingRight) ctx.scale(-1, 1);
            let clone = Object.assign({}, charObj, {x:0, y:0, scale: scale, isFacingRight: true, state: 'cast'});
            for(let i=0; i<3; i++) { if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); }
            if (clone.isDragon && typeof window.drawDragon === 'function') window.drawDragon(ctx, clone); else if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        };
        drawCharSafe(ctxV, window.p1, 540, 1600, 5.5, true); drawCharSafe(ctxV, e1, 540, 700, 5.5, false);
        
        ctxV.save(); let rx = 540; let ry = 1920*0.4 + Math.random()*150;
        ctxV.strokeStyle = prm.themeP2.aura; ctxV.lineWidth = 18; ctxV.beginPath(); ctxV.ellipse(rx, ry, 90 + Math.random()*40, 135 + Math.random()*40, Math.random()*0.5, 0, Math.PI*2); ctxV.stroke();
        ctxV.font = "110px Arial"; ctxV.fillText(rx > 540 ? "⬅️" : "➡️", rx + (rx > 540 ? -150 : 75), ry);
        ctxV.translate(1080*0.7, 1920*0.6); ctxV.rotate((Math.random()-0.5)*0.5); 
        ctxV.font = "italic 900 80px 'Arial Black', sans-serif"; ctxV.textAlign = "center"; ctxV.lineWidth = 18; ctxV.strokeStyle = "#000"; ctxV.strokeText(prm.lore.chapter, 0,0);
        ctxV.fillStyle = prm.themeP2.aura; ctxV.fillText(prm.lore.chapter, 0,0); ctxV.fillStyle = "#fff"; ctxV.fillText(prm.lore.chapter, -4,-4); ctxV.restore();
        
        ctxV.save(); let grad = ctxV.createRadialGradient(540, 960, 500, 540, 960, 1920); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.85)");
        ctxV.fillStyle = grad; ctxV.fillRect(0,0,1080,1920); ctxV.translate(540, 300); ctxV.rotate(-0.06); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.font = `italic 900 85px 'Arial Black', Impact`; 
        let shortTitle = (titleText || "EPIC FIGHT").replace(/#.*/g, '').trim(); let words = shortTitle.split(" "); let lines = [words.slice(0, Math.ceil(words.length/2)).join(" "), words.slice(Math.ceil(words.length/2)).join(" ")]; 
        lines.forEach((line, index) => { let yOffset = index * 95; ctxV.lineWidth = 25; ctxV.strokeStyle = "#000"; for(let d=15; d>0; d--) { ctxV.strokeText(line, d, yOffset + d); ctxV.fillStyle = prm.themeP1.c1; ctxV.fillText(line, d, yOffset + d); } ctxV.strokeText(line, 0, yOffset); ctxV.fillStyle = prm.themeP1.aura; ctxV.fillText(line, 0, yOffset); ctxV.fillStyle = "#ffffff"; ctxV.fillText(line, -3, yOffset - 3); }); ctxV.restore();
    } catch (e) { console.error("Lỗi Bake Thumbnail:", e); }
};

// ====================================================================
// ĐẠO DIỄN: THE GOD-TIER SAKUGA (GLASS SHATTER + MANGA SFX + WAGER BADGE)
// ====================================================================
window.drawProceduralIntro = function(ctx, w, h, progress) {
    let originalCtx = window.ctx; window.ctx = ctx; ctx.save();
    let e1 = window.enemies && window.enemies.length > 0 ? window.enemies[0] : window.p1;
    let prm = window.introParams;

    let realP1Name = window.getRealCharName(window.p1, "CHALLENGER");
    let realP2Name = window.getRealCharName(e1, "OPPONENT");

    let act = 0; let localProg = 0;
    if (progress < 0.25) { act = 0; localProg = progress / 0.25; } 
    else if (progress < 0.50) { act = 1; localProg = (progress - 0.25) / 0.25; } 
    else if (progress < 0.65) { act = 2; localProg = (progress - 0.50) / 0.15; } 
    else { act = 3; localProg = (progress - 0.65) / 0.35; } 

    if (!window._sfxCuts[act]) {
        if (act === 0 && typeof window.playSound === 'function') window.playSound(100, 'sine', 0.5, 1.0); 
        if (act === 1 && typeof window.playSound === 'function') window.playSound(200, 'triangle', 0.2, 0.5); 
        if (act === 2 && typeof window.playSound === 'function') window.playSound(60, 'square', 0.5, 0.4); 
        if (act === 3 && typeof window.playSound === 'function') window.playSound(120, 'sawtooth', 0.8, 1.5, true); 
        window._sfxCuts[act] = true;
    }

    const drawCinematicDust = (theme, opacity) => {
        ctx.save(); ctx.fillStyle = theme.aura; ctx.globalAlpha = opacity;
        for(let i=0; i<35; i++) {
            let px = (Math.sin(i*12 + Date.now()*0.001)*w) - w/2;
            let py = (Math.cos(i*24 + Date.now()*0.002)*h) - h/2;
            ctx.beginPath(); ctx.arc(px, py, 1+Math.random()*4, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    };

    const drawCRTScanlines = () => {
        ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = "#000";
        for(let y=0; y<h; y+=8) ctx.fillRect(0, y, w, 2);
        ctx.restore();
    };

    const drawMangaKanji = (textStr, x, y, theme, scale) => {
        ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "900 120px 'Arial Black', 'Noto Sans CJK SC', 'Noto Sans KR', sans-serif";
        ctx.shadowColor = theme.aura; ctx.shadowBlur = 30;
        ctx.lineWidth = 15; ctx.strokeStyle = "#000"; ctx.strokeText(textStr, 0, 0);
        ctx.shadowBlur = 0; ctx.fillStyle = theme.aura; ctx.fillText(textStr, 0, 0);
        ctx.fillStyle = "#fff"; ctx.fillText(textStr, -4, -4);
        ctx.restore();
    };

    const drawFighterArtistic = (charObj, cx, cy, forcedState, isFacingRight, theme, charName, isTrail = false) => {
        if(!charObj) return; ctx.save(); ctx.translate(cx, cy); 
        
        if (charName && act < 2 && !isTrail) {
            ctx.save(); 
            ctx.translate(0, -200); 
            ctx.scale(0.8, 0.8); 
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.font = "900 40px 'Arial Black', sans-serif"; 
            ctx.shadowColor = theme.aura; ctx.shadowBlur = 25;
            ctx.lineWidth = 6; ctx.strokeStyle = "#000"; 
            ctx.strokeText(charName, 0, 0); 
            ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.fillText(charName, 0, 0);
            ctx.fillStyle = theme.aura; ctx.fillRect(-40, 25, 80, 4);
            ctx.restore();
        }

        if(!isFacingRight) ctx.scale(-1, 1);
        let clone = Object.assign({}, charObj, {x:0, y:0, scale: 3.2, isFacingRight: true, state: forcedState});
        
        if (!isTrail) ctx.filter = "contrast(115%) saturate(120%) drop-shadow(0 20px 20px rgba(0,0,0,0.8))";

        if (!isTrail) {
            ctx.save(); ctx.globalAlpha = 0.5 + Math.sin(Date.now()*0.02)*0.1; 
            ctx.shadowBlur = 50; ctx.shadowColor = theme.aura; ctx.scale(1.15, 1.15);
            if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); ctx.restore();
        }
        
        if (typeof window.drawStickman === 'function') window.drawStickman(ctx, clone); 
        ctx.restore();
    };

    if (act === 2) {
        let rumble = (Math.random() - 0.5) * 60; ctx.translate(rumble, rumble);
        let isP1Flash = Math.floor(localProg * 30) % 2 === 0;
        let tTheme = isP1Flash ? prm.themeP1 : prm.themeP2;
        let targetChar = isP1Flash ? window.p1 : e1;
        let isFacing = isP1Flash;
        
        ctx.fillStyle = tTheme.c2; ctx.fillRect(0,0,w,h);
        ctx.globalCompositeOperation = "difference"; 
        ctx.translate(w/2, h/2 + 50); ctx.scale(3.5, 3.5); 
        
        ctx.save();
        ctx.filter = `drop-shadow(25px 0px 0px red) drop-shadow(-25px 0px 0px cyan)`;
        drawFighterArtistic(targetChar, 0, 0, 'dash', isFacing, tTheme, "");
        ctx.restore();
        
        ctx.globalCompositeOperation = "source-over";
        drawCRTScanlines();
        ctx.restore(); window.ctx = originalCtx; return;
    }

    ctx.save();
    let cutShake = 0; let panX = 0; let currentZoom = 2.0; 

    if (act === 0) {
        currentZoom = 1.8 + localProg * 0.2; panX = (1 - localProg) * 60; 
    } else if (act === 1) {
        currentZoom = 1.8 + localProg * 0.2; panX = -(1 - localProg) * 60;
    } else if (act === 3) {
        currentZoom = 1.2 + Math.pow(localProg, 3) * 1.6; 
        if (localProg > 0.7) cutShake = (Math.random() - 0.5) * 80; 
    }
    
    ctx.translate(w/2 + cutShake + panX, h/2 + cutShake);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(0, 100); 

    let bgTheme = act === 0 ? prm.themeP2 : prm.themeP1;
    let bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    bgGrad.addColorStop(0, bgTheme.c1); bgGrad.addColorStop(1, bgTheme.c2);
    ctx.fillStyle = bgGrad; ctx.fillRect(-w, -h, w*2, h*2);
    
    if (act === 0) drawMangaKanji("ゴゴゴゴ", -150, -50, prm.themeP2, 0.9);
    if (act === 1) drawMangaKanji("ドォォォン!", 150, -50, prm.themeP1, 0.9);
    
    if (act === 3) {
        ctx.save();
        ctx.strokeStyle = prm.themeP1.aura; ctx.globalAlpha = localProg; ctx.lineWidth = 3;
        for(let i=0; i<40; i++) {
            ctx.rotate(Math.PI * 2 / 40);
            ctx.beginPath(); ctx.moveTo(400 - localProg * 300, 0); ctx.lineTo(1000, 0); ctx.stroke();
        }
        ctx.restore();
    }
    
    drawCinematicDust(bgTheme, 0.5);

    if (act === 0) {
        drawFighterArtistic(e1, 0, 100, 'idle', false, prm.themeP2, realP2Name);
    } 
    else if (act === 1) {
        drawFighterArtistic(window.p1, 0, 100, 'cast', true, prm.themeP1, realP1Name);
    } 
    else if (act === 3) {
        let easeIn = Math.pow(localProg, 4); 
        let pushP1 = -400 + (easeIn * 280); 
        let pushP2 = 400 - (easeIn * 280);
        
        for(let t=1; t<=3; t++) {
            let prevProg = Math.max(0, localProg - t*0.05);
            let prevEaseIn = Math.pow(prevProg, 4);
            let trP1 = -400 + (prevEaseIn * 280); 
            let trP2 = 400 - (prevEaseIn * 280);
            ctx.globalAlpha = 0.4 / t; 
            drawFighterArtistic(e1, trP2, 100, 'attack', false, prm.themeP2, null, true);
            drawFighterArtistic(window.p1, trP1, 100, 'attack', true, prm.themeP1, null, true);
        }
        ctx.globalAlpha = 1.0;

        drawFighterArtistic(e1, pushP2, 100, 'attack', false, prm.themeP2, null);
        drawFighterArtistic(window.p1, pushP1, 100, 'attack', true, prm.themeP1, null);

        let flareWidth = w * 3 * localProg; let flareHeight = 40 + Math.random() * 80;
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = prm.themeP1.aura; ctx.fillRect(-flareWidth/2, 50 - flareHeight/2, flareWidth, flareHeight);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(-flareWidth/2, 50 - flareHeight/4, flareWidth, flareHeight/2);
        
        ctx.translate(0, 50);
        for(let i=0; i<35; i++) {
            let ang = Math.random() * Math.PI * 2; let speed = Math.random(); 
            let dist = localProg * (400 + speed * 1200); let size = (1 - localProg) * (5 + speed * 30); 
            ctx.fillStyle = Math.random() > 0.4 ? "#fff" : prm.themeP1.aura;
            ctx.globalAlpha = (1 - localProg) * (0.4 + speed*0.6);
            ctx.save(); ctx.translate(Math.cos(ang)*dist, Math.sin(ang)*dist); ctx.rotate(ang);
            ctx.fillRect(0, 0, size * 5, size); ctx.restore();
        }
        ctx.globalAlpha = 1.0; ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore(); // THOÁT KHỎI CAMERA

    let vigGrad = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.8);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)"); vigGrad.addColorStop(1, "rgba(0,0,0,0.95)");
    ctx.fillStyle = vigGrad; ctx.fillRect(0, 0, w, h);

    let barHeight = 0;
    if (act === 0 || act === 1) barHeight = 180 + (localProg * 40); 
    else if (act === 2) barHeight = 220 + (localProg * 80); 
    else if (act === 3) barHeight = 300 - (localProg * 1200); 
    barHeight = Math.max(0, barHeight);

    if (barHeight > 0) {
        ctx.fillStyle = "#000000"; 
        ctx.fillRect(0, 0, w, barHeight); 
        ctx.fillRect(0, h - barHeight, w, barHeight); 
    }

    if (barHeight > 0 && prm.badge) {
        ctx.save();
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "900 22px 'Arial Black', sans-serif";
        let badgeY = barHeight - 35;
        ctx.shadowColor = "#ffeb3b"; ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffeb3b"; ctx.fillText(prm.badge, w/2, badgeY);
        ctx.restore();
    }

    if (act === 0 && barHeight > 0) {
        ctx.save();
        let chapterX = w/2 + (1-Math.pow(localProg, 0.3)) * 500; 
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.globalAlpha = Math.min(1, localProg * 3);
        ctx.fillStyle = prm.themeP2.aura; ctx.font = "italic 900 35px 'Arial Black', 'Noto Sans CJK SC', 'Noto Sans KR', sans-serif"; 
        ctx.letterSpacing = "3px";
        ctx.fillText(prm.lore.chapter, chapterX, barHeight / 2);
        ctx.restore();
    }

    if ((act === 0 || act === 1) && barHeight > 0) {
        ctx.save();
        let subText = act === 0 ? prm.lore.p2Sub : prm.lore.p1Sub;
        ctx.globalAlpha = Math.min(1, localProg * 5); 
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.font = "italic bold 42px 'Arial', 'Noto Sans CJK SC', 'Noto Sans KR', sans-serif"; 
        let subY = h - barHeight + 85; 
        ctx.lineWidth = 5; ctx.strokeStyle = "#000"; ctx.strokeText(`"${subText}"`, w/2, subY);
        ctx.fillStyle = "#f1c40f"; ctx.fillText(`"${subText}"`, w/2, subY);
        ctx.restore();
    }

    drawCRTScanlines();

    if (act === 3 && localProg > 0.75) {
        let shatterProg = (localProg - 0.75) * 4; 
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.strokeStyle = "#00f3ff"; ctx.lineWidth = 8; ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 20;
        for(let i=0; i<12; i++) {
            let ang = (Math.PI * 2 / 12) * i;
            let crackLen = Math.min(w, h) * shatterProg * 1.5;
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang)*crackLen, Math.sin(ang)*crackLen); ctx.stroke();
        }
        if (shatterProg > 0.5) {
            let whiteFlash = (shatterProg - 0.5) * 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${whiteFlash})`;
            ctx.fillRect(-w, -h, w*2, h*2);
        }
        ctx.restore();
    }

    ctx.restore(); window.ctx = originalCtx;
};

// AUDIO & RECORDER CORE
if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true; const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };
    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) { try { let source = window.audioCtx.createMediaElementSource(this); source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination); if (window.recordAnalyser) source.connect(window.recordAnalyser); this._routedToRecorder = true; } catch (e) { } }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };
    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { try { originalConnect.call(this, window.masterRecordDestination); if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser); } catch(e){} }
        return originalConnect.apply(this, arguments);
    };
}

window.initRecorder = function() {
    let ctxOpts = {alpha: false, desynchronized: true, willReadFrequently: false};
    window.recordCanvasV = document.getElementById("hiddenRecordCanvasV") || document.createElement("canvas");
    if (!window.recordCanvasV.id) { window.recordCanvasV.id = "hiddenRecordCanvasV"; document.body.appendChild(window.recordCanvasV); }
    window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920; window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
    window.recordCtxV = window.recordCanvasV.getContext("2d", ctxOpts);
};

window.showRenderToast = function() {
    let toast = document.getElementById("render-toast-noti");
    if (!toast) { toast = document.createElement("div"); toast.id = "render-toast-noti"; toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff0050; color: white; padding: 12px 25px; border-radius: 30px; font-family: 'Arial Black', sans-serif; font-size: 16px; z-index: 2147483647; box-shadow: 0 4px 15px rgba(255,0,80,0.5); border: 2px solid #fff; transition: opacity 0.3s; pointer-events: none;"; document.body.appendChild(toast); }
    toast.innerHTML = "⏳ RENDERING TIKTOK... PLEASE WAIT (DON'T CLOSE)"; toast.style.opacity = "1";
};
window.hideRenderToast = function() { let toast = document.getElementById("render-toast-noti"); if (toast) toast.style.opacity = "0"; };

window._recorderLoopFunction = function() {
    if (window.isRecording) { window.captureFrames(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction); }
};

if (window._hookedDrawForRecorder && window.draw && window._originalDrawBeforeHook) { window.draw = window._originalDrawBeforeHook; }
if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true; window._originalDrawBeforeHook = window.draw; 
    window.draw = function() { if (window._originalDrawBeforeHook) window._originalDrawBeforeHook.apply(this, arguments); };
}

window.startRecording = function() {
    if (window.isRecording) { window.stopRecording(); }
    window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    if (window.bgmBase && !window.bgmBase._routedToRecorder) { try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { } }
    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.introParams = window.generateIntroParams();

    window.recordedChunksV = []; window.retentionParticles.forEach(p => p.active = false); window.retentionEmojis.forEach(e => e.active = false);
    let videoStreamV = window.recordCanvasV.captureStream(0); let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    window.videoTrackV = videoStreamV.getVideoTracks()[0]; let combinedStreamV = new MediaStream([...videoStreamV.getVideoTracks(), ...audioTracks]);
    
    let options = { videoBitsPerSecond: 6000000 }; window.currentVideoExt = "mp4";
    if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1,mp4a.40.2"')) { options.mimeType = 'video/mp4; codecs="avc1,mp4a.40.2"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')) { options.mimeType = 'video/mp4; codecs="avc1"'; } 
    else if (MediaRecorder.isTypeSupported('video/mp4')) { options.mimeType = 'video/mp4'; } 
    else { options.mimeType = 'video/webm; codecs="vp8"'; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } catch (e) { window.mediaRecorderV = new MediaRecorder(combinedStreamV); }
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1 && window.classStats && window.classStats[window.p1.classId]) charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar;
    let charName = window.getRealCharName(window.p1, "PLAYER");
    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) enemyName = window.getRealCharName(window.enemies[0], "BOSS");

    window.StoryModeAI.init(charName, enemyName);
    
    window.bannerText1 = window.introParams.warningText;
    window.bakeThumbnailsForVideo(window.StoryModeAI.viralTitle);
    window._chatSystemInit = false; window._cachedGradients = {};

    window.mediaRecorderV.onstop = () => {
        setTimeout(() => {
            window.hideRenderToast();
            if (window.recordedChunksV.length === 0) return;
            let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
            let blobV = new Blob(window.recordedChunksV, { type: window.mediaRecorderV.mimeType }); 
            window.savedVideos.unshift({ 
                id: Date.now(), urlV: URL.createObjectURL(blobV), ext: window.currentVideoExt, 
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heroName: charName, heroAvatar: charAvatar, viralTitle: window.StoryModeAI.viralTitle, safeFileName: safeFileName,
                previewThumb: window.bakedThumbV ? window.bakedThumbV.toDataURL("image/jpeg", 0.3) : "" 
            });
            if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
        }, 800); 
    };

    window.mediaRecorderV.start(); window.isRecording = true;
    window.introStartTime = Date.now(); 
    window._sfxCuts = [false, false, false, false]; 
    window._lastCaptureTime = Date.now(); window._recordLoopId = requestAnimationFrame(window._recorderLoopFunction);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; window.isRecording = false; cancelAnimationFrame(window._recordLoopId); 
    window.showRenderToast();
    if (window.recordCtxV) { window.recordCtxV.fillStyle = "#000000"; window.recordCtxV.fillRect(0,0,1080,1920); }
    if (window.mediaRecorderV && window.mediaRecorderV.state !== "inactive") { try { window.mediaRecorderV.stop(); } catch(e){} }
    setTimeout(() => { if (window.videoTrackV) window.videoTrackV.stop(); }, 500);
    window.StoryModeAI.stop(); if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxV || !window.canvas) return;
    if (window.gameOver && window.matchEndTimer > 350) { window.stopRecording(); return; }

    let now = Date.now(); if (now - window._lastCaptureTime < 33) return; window._lastCaptureTime = now;
    let ctxV = window.recordCtxV; let isOutroActive = (window.gameOver && window.matchEndTimer > 90);

    ctxV.fillStyle = "#000000"; ctxV.fillRect(0,0,1080,1920);
    let renderNormalV = true; let elapsed = Date.now() - window.introStartTime;

    if (elapsed < 150) {
        if (window.bakedThumbV) ctxV.drawImage(window.bakedThumbV, 0, 0, 1080, 1920); renderNormalV = false; 
    } else if (elapsed < window.introDuration) {
        let introProgress = (elapsed - 150) / (window.introDuration - 150); 
        window.drawProceduralIntro(ctxV, 1080, 1920, introProgress); renderNormalV = false; 
    }

    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) { let shakeIntensity = (audioPeak - 0.6) * 35; shakeX = (Math.random() - 0.5) * shakeIntensity; shakeY = (Math.random() - 0.5) * shakeIntensity; }
    window._glitchThrottle++; let shouldGlitch = audioPeak > 0.75 && (window._glitchThrottle % 4 === 0);

    // KÍCH HOẠT KILL-CAM SAKUGA KHI KẾT THÚC TRẬN ĐẤU (IN-GAME COMBAT)
    let isKillCamActive = (window.gameOver && window.matchEndTimer > 0 && window.matchEndTimer < 45);

    if (renderNormalV) {
        let splitGameHeight = window.canvas ? Math.floor(1080 * (window.canvas.height / window.canvas.width)) : 607;
        ctxV.imageSmoothingEnabled = false;

        // HIỆU ỨNG KILL-CAM ĐỘNG
        if (isKillCamActive) {
            ctxV.save();
            ctxV.translate(540, splitGameHeight / 2);
            ctxV.scale(1.25, 1.25); // Zoom cận cảnh cú K.O.
            ctxV.translate(-540, -splitGameHeight / 2);
            // Chớp âm bản Anime cho 8 frame đầu tiên của đòn kết liễu
            if (window.matchEndTimer < 16 && window.matchEndTimer % 4 === 0) {
                ctxV.filter = "invert(100%) contrast(200%)";
            }
        }

        ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX | 0, shakeY | 0, 1080, splitGameHeight); 

        if (isKillCamActive) ctxV.restore();

        if (shouldGlitch) {
            let glitchStr = ((audioPeak - 0.75) * 30) | 0; ctxV.globalAlpha = 0.4; ctxV.fillStyle = '#ff0000'; 
            ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.fillStyle = '#00ffff'; ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, glitchStr, shakeY | 0, 1080 + glitchStr, splitGameHeight);
            ctxV.globalAlpha = 1.0; 
        }

        let retainY = splitGameHeight; let retainHeight = 1920 - retainY;
        if(!window._cachedGradients.bgGrid) { window._cachedGradients.bgGrid = ctxV.createLinearGradient(0, retainY, 0, 1920); window._cachedGradients.bgGrid.addColorStop(0, "#0b001a"); window._cachedGradients.bgGrid.addColorStop(1, "#3c003c"); }
        ctxV.fillStyle = window._cachedGradients.bgGrid; ctxV.fillRect(0, retainY, 1080, retainHeight); 
        
        ctxV.strokeStyle = "rgba(0, 255, 200, 0.15)"; ctxV.lineWidth = 2; 
        if(!window._gridVerticalPath) { window._gridVerticalPath = new Path2D(); for(let x = -20; x <= 20; x+=2) { window._gridVerticalPath.moveTo(540, retainY); window._gridVerticalPath.lineTo(540 + x * 200, 1920); } }
        ctxV.stroke(window._gridVerticalPath); ctxV.beginPath(); 
        let zSpeed = (Date.now() / 15) % 20; for(let y = 1; y < 30; y++) { let actualY = retainY + Math.pow(y, 1.8) * 2.5 + zSpeed; if (actualY <= 1920) { ctxV.moveTo(0, actualY | 0); ctxV.lineTo(1080, actualY | 0); } }
        ctxV.stroke(); 

        // WATERMARK BẢN QUYỀN ĐỘNG
        ctxV.save();
        ctxV.font = "bold 26px 'Arial Black', sans-serif";
        ctxV.fillStyle = "rgba(255, 255, 255, 0.28)";
        ctxV.textAlign = "right";
        ctxV.fillText(window.CREATOR_HANDLE || "@TIKTOK_GAMING", 1050, retainY + 35);
        ctxV.restore();

        if (Math.random() < 0.3) {
            let p = window.retentionParticles.find(p => !p.active);
            if (p) { p.active = true; p.x = Math.random() * 1080; p.y = 1920 + 50; p.s = Math.random() * 6 + 3; p.v = Math.random() * 8 + 4; p.h = Math.random() > 0.5 ? 300 : 190; p.age = 0; }
        }
        ctxV.fillStyle = "rgba(0, 255, 200, 0.8)"; ctxV.beginPath(); 
        for (let i = 0; i < window.retentionParticles.length; i++) {
            let p = window.retentionParticles[i]; if (!p.active) continue;
            p.age++; p.y -= p.v; p.x += Math.sin(p.age * 0.1) * 3; ctxV.rect(p.x | 0, p.y | 0, p.s | 0, p.s | 0); 
            if (p.y < retainY) p.active = false; 
        }
        ctxV.fill(); 

        if (!isOutroActive) {
            let bannerY = retainY; ctxV.fillStyle = "#ff0055"; ctxV.fillRect(0, bannerY, 1080, 60);
            ctxV.fillStyle = "#fff"; ctxV.font = "900 35px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle";
            let offsetBanner = ((Date.now() / 6) % 1000) | 0; 
            for(let i = -1; i < 5; i++) { ctxV.fillText("🚨 WAIT FOR THE END ⏩ DO NOT BLINK 🚨", i*850 - offsetBanner, bannerY + 30); }

            // ENGAGEMENT PARTICLES (MƯA TIM, SAVE, COMMENT BAY LÊN LÚC CAO TRÀO)
            if (audioPeak > 0.5 && Math.random() < 0.35) { 
                let ep = window._engagementParticles.find(e => !e.active);
                if (ep) {
                    const icons = ["❤️", "❤️", "🔖", "💬", "🔥", "💯"];
                    ep.active = true; ep.x = 900 + Math.random() * 120; ep.y = 1800;
                    ep.v = 6 + Math.random() * 6; ep.icon = icons[Math.floor(Math.random() * icons.length)];
                    ep.alpha = 1.0;
                }
            }
            for (let i = 0; i < window._engagementParticles.length; i++) {
                let ep = window._engagementParticles[i]; if (!ep.active) continue;
                ep.y -= ep.v; ep.alpha -= 0.008;
                ctxV.save();
                ctxV.globalAlpha = Math.max(0, ep.alpha);
                ctxV.font = "50px Arial"; ctxV.textAlign = "center";
                ctxV.fillText(ep.icon, ep.x + Math.sin(ep.y * 0.05) * 15, ep.y);
                ctxV.restore();
                if (ep.alpha <= 0 || ep.y < retainY) ep.active = false;
            }

            if (audioPeak > 0.35 && Math.random() < 0.25) { 
                let re = window.retentionEmojis.find(e => !e.active);
                if (re) { const emos = ["🔥", "💀", "🤯", "🥶", "💯", "📈"]; re.active = true; re.x = 100 + Math.random() * 880; re.y = 1920 + 50; re.v = 10 + Math.random() * 8; re.e = emos[(Math.random() * emos.length) | 0]; re.r = (Math.random() - 0.5) * 0.5; re.age = 0; }
            }
            for (let i = 0; i < window.retentionEmojis.length; i++) {
                let re = window.retentionEmojis[i]; if (!re.active) continue;
                re.age++; re.y -= re.v; let sway = Math.sin(re.age * 0.05) * 50; 
                ctxV.save(); ctxV.translate((re.x + sway) | 0, re.y | 0); ctxV.rotate(re.r + Math.sin(Date.now()/200)*0.2); let eScale = Math.min(1, re.age * 0.1); ctxV.scale(eScale, eScale);
                ctxV.font = "90px Arial"; ctxV.globalAlpha = Math.max(0, Math.min(1, (re.y - retainY - 100) / 400)); ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(re.e, 0, 0); ctxV.restore();
                if (re.y < retainY) re.active = false;
            }

            // HUD
            if (!window.hudImages) window.hudImages = {};
            const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };
            let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null; let p1Hp = 0.5, p2Hp = 0.5; 

            if (window.p1) {
                const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 33, y + h); ctx.lineTo(x - 33, y + h); } else { ctx.moveTo(x + 33, y); ctx.lineTo(x + w + 33, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
                p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100); let eHp = 0, eMax = window.totalEnemyMaxHp || 1, eStam = 0;
                
                let p1Name = window.getRealCharName(window.p1, "PLAYER");
                let eName = "BOSS";
                if (repEnemyObj) {
                    window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100); 
                    eName = window.getRealCharName(repEnemyObj, "BOSS");
                }

                let p1Url = "https://i.imgur.com/q3813rX.png"; let p2Url = "https://i.imgur.com/q3813rX.png";
                if (window.p1 && window.classStats && window.classStats[window.p1.classId]) { p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; }
                if (repEnemyObj && window.classStats && window.classStats[repEnemyObj.classId]) { p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
                
                let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url); let maxNameWidthV = 280; let hudBaseY = splitGameHeight + 90; 
                ctxV.lineJoin = "round"; ctxV.textAlign = "left"; ctxV.textBaseline = "alphabetic";
                
                if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(53, hudBaseY, 107, 107, 13); else ctxV.rect(53, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img1, 53, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(53, hudBaseY, 107, 107); }
                ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; ctxV.strokeText(p1Name, 180, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 180, hudBaseY + 50, maxNameWidthV);
                drawSkewedPath(ctxV, 187, hudBaseY + 73, 300, 53, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                if (p1Hp > 0) { if(!window._cachedGradients.hpP1) { window._cachedGradients.hpP1 = ctxV.createLinearGradient(187, 0, 487, 0); window._cachedGradients.hpP1.addColorStop(0, "#00f2fe"); window._cachedGradients.hpP1.addColorStop(1, "#4facfe"); } drawSkewedPath(ctxV, 187, hudBaseY + 73, (300 * p1Hp) | 0, 53, true); ctxV.fillStyle = window._cachedGradients.hpP1; ctxV.fill(); }
                ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(187, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(187, hudBaseY + 140, (250 * p1Stam) | 0, 20);
                
                if (repEnemyObj) {
                    ctxV.textAlign = "right"; 
                    if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(920, hudBaseY, 107, 107, 13); else ctxV.rect(920, hudBaseY, 107, 107); ctxV.clip(); ctxV.drawImage(img2, 920, hudBaseY, 107, 107); ctxV.restore(); ctxV.lineWidth = 7; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(920, hudBaseY, 107, 107); }
                    ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px 'Arial Black', sans-serif"; ctxV.strokeText(eName, 900, hudBaseY + 50, maxNameWidthV); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 900, hudBaseY + 50, maxNameWidthV);
                    drawSkewedPath(ctxV, 580, hudBaseY + 73, 300, 53, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 7; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
                    if (p2Hp > 0) { if(!window._cachedGradients.hpP2) { window._cachedGradients.hpP2 = ctxV.createLinearGradient(580, 0, 880, 0); window._cachedGradients.hpP2.addColorStop(0, "#ff0844"); window._cachedGradients.hpP2.addColorStop(1, "#ffb199"); } let eHpWidth = (300 * p2Hp) | 0; drawSkewedPath(ctxV, 580 + (300 - eHpWidth), hudBaseY + 73, eHpWidth, 53, false); ctxV.fillStyle = window._cachedGradients.hpP2; ctxV.fill(); }
                    ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(650, hudBaseY + 140, 250, 20); ctxV.fillStyle = "#ff0055"; ctxV.fillRect(650 + (250 - ((250 * eStam) | 0)), hudBaseY + 140, (250 * eStam) | 0, 20);
                }
            }

            // THANH WIN RATE TỐI GIẢN
            if (window.p1 && repEnemyObj) {
                ctxV.save(); let pollY = splitGameHeight + 315; let pollWidth = 800; let pollX = 540; ctxV.translate(pollX, pollY);
                let pulseText = 1 + Math.sin(Date.now() / 150) * 0.05; ctxV.save(); ctxV.scale(pulseText, pulseText); ctxV.fillStyle = "#ffeb3b"; ctxV.font = "900 22px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "bottom"; ctxV.shadowColor = "#ffeb3b"; ctxV.shadowBlur = 8; ctxV.fillText("👇 WHO WILL WIN? 👇", 0, -25); ctxV.restore();
                
                let actualP1 = Math.max(0, window.p1.hp); let actualP2 = 0; window.enemies.forEach(e => actualP2 += Math.max(0, e.hp)); let total = actualP1 + actualP2; let p1Pct = total > 0 ? (actualP1 / total) : 0.5;
                
                ctxV.fillStyle = "#ff0055"; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.fill(); } else { ctxV.fillRect(-pollWidth/2, 0, pollWidth, 36); }
                ctxV.save(); if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.clip(); } ctxV.fillStyle = "#00f3ff"; ctxV.fillRect(-pollWidth/2, 0, pollWidth * p1Pct, 36); ctxV.restore();
                ctxV.strokeStyle = "rgba(255,255,255,0.6)"; ctxV.lineWidth = 4; if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-pollWidth/2, 0, pollWidth, 36, 18); ctxV.stroke(); } else { ctxV.strokeRect(-pollWidth/2, 0, pollWidth, 36); }
                
                ctxV.fillStyle = "#1e293b"; ctxV.beginPath(); ctxV.arc(-pollWidth/2 + pollWidth * p1Pct, 18, 22, 0, Math.PI*2); ctxV.fill(); 
                ctxV.lineWidth = 3; ctxV.strokeStyle = "#fff"; ctxV.stroke(); ctxV.fillStyle = "#fff"; ctxV.font = "900 16px 'Arial Black'"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText("VS", -pollWidth/2 + pollWidth * p1Pct, 18);
                
                ctxV.fillStyle = "#000"; ctxV.font = "900 24px 'Arial Black'"; 
                ctxV.textAlign = "left"; ctxV.fillText(`${Math.round(p1Pct*100)}%`, -pollWidth/2 + 20, 18); 
                ctxV.textAlign = "right"; ctxV.fillText(`${Math.round((1-p1Pct)*100)}%`, pollWidth/2 - 20, 18);
                ctxV.restore();
            }

            if (!window._chatSystemInit) { window._chatSystemInit = true; window._liveChats = []; window._lastChatUpdate = Date.now(); window._nextChatDelay = 1000; window._fakeViewers = 1204512; for(let i = 0; i < 8; i++) { let c = window.generateLiveChatEvent(); window.precalcChatText(c, ctxV); window._liveChats.push(c); } }
            let chatNow = Date.now();
            if (chatNow - window._lastChatUpdate > window._nextChatDelay) { window._lastChatUpdate = chatNow; window._nextChatDelay = 1000 + Math.random() * 2000; let newChat = window.generateLiveChatEvent(); window.precalcChatText(newChat, ctxV); window._liveChats.push(newChat); if (window._liveChats.length > 12) window._liveChats.shift(); window._fakeViewers += Math.floor(Math.random() * 3000) - 1000; }
            if (Date.now() - window._lastAlertTime > 2500 + Math.random() * 3000) { window._lastAlertTime = Date.now(); let randomUser = window.CELEB_LIST[Math.floor(Math.random() * window.CELEB_LIST.length)].name.replace(/ 🚀| ⚽| 🐕| 💰| 🐐| 🍳| 🌿| 🦉| 🏎️| 👊| 🥷| 🎧| 👨‍🏫| 🐻| 🎤| 🪨| 🤫| 🤨| 🇺🇸| ⛳| 🍦| 🤣| 😤| 🕺| 🐉| 🦇| 🧤/g, ''); let alertTypes = [`❤️ ${randomUser} liked the LIVE!`, `👍 ${randomUser} liked the stream!`, `👤 ${randomUser} started following you!`, `🎁 ${randomUser} sent a Rose!`, `🔥 ${randomUser} joined the LIVE!`]; window._liveAlerts.push({ text: alertTypes[Math.floor(Math.random() * alertTypes.length)], life: 1.0, yOffset: 0 }); }

            let boxWidth = 960; let boxHeight = 780; let boxX = 540; let boxY = 1450; let chatTopY = boxY - boxHeight/2; let alertStartY = chatTopY - 20; 
            for (let i = window._liveAlerts.length - 1; i >= 0; i--) {
                let al = window._liveAlerts[i]; al.life -= 0.015; al.yOffset += 1.2; ctxV.save(); ctxV.globalAlpha = Math.max(0, Math.min(1, al.life * 1.5)); ctxV.font = "bold 24px Arial"; let textW = ctxV.measureText(al.text).width; ctxV.translate(540, alertStartY - al.yOffset); ctxV.fillStyle = "rgba(0, 0, 0, 0.5)"; ctxV.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctxV.lineWidth = 2;
                if(ctxV.roundRect) { ctxV.beginPath(); ctxV.roundRect(-textW/2 - 20, 0, textW + 40, 46, 23); ctxV.fill(); ctxV.stroke(); } else { ctxV.fillRect(-textW/2 - 20, 0, textW + 40, 46); } ctxV.fillStyle = "#fff"; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; ctxV.fillText(al.text, 0, 23); ctxV.restore(); if (al.life <= 0) window._liveAlerts.splice(i, 1);
            }

            drawLiveBadge(ctxV, boxX + boxWidth/2 - 70, chatTopY - 35, audioPeak);

            ctxV.save(); ctxV.translate(boxX, boxY); ctxV.fillStyle = "rgba(10, 15, 30, 0.6)"; ctxV.strokeStyle = "rgba(0, 243, 255, 0.3)"; ctxV.lineWidth = 3;
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); else ctxV.rect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight); ctxV.fill(); ctxV.stroke();
            ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.clip(); 
            ctxV.fillStyle = "#ff0055"; ctxV.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, 70); ctxV.fillStyle = "#fff"; ctxV.font = "900 36px 'Arial Black'"; ctxV.textAlign = "left"; ctxV.textBaseline = "middle"; ctxV.fillText("💬 TOXIC LIVE CHAT", -boxWidth/2 + 30, -boxHeight/2 + 35); ctxV.font = "900 28px 'Arial'"; ctxV.textAlign = "right"; ctxV.fillText("👥 " + window._fakeViewers.toLocaleString() + " VIEWERS", boxWidth/2 - 30, -boxHeight/2 + 35);

            ctxV.save(); ctxV.beginPath(); ctxV.rect(-boxWidth/2, -boxHeight/2 + 70, boxWidth, boxHeight - 70); ctxV.clip();
            let currentY = boxHeight/2 - 20; let lineHeight = 45; ctxV.textAlign = "left"; ctxV.textBaseline = "bottom"; ctxV.font = "bold 34px Arial"; let headerBottomY = -boxHeight/2 + 70; 

            for (let i = window._liveChats.length - 1; i >= 0; i--) { 
                let chat = window._liveChats[i]; let nameStr = chat.name + ":"; 
                for(let l = chat.lines.length - 1; l >= 0; l--) {
                    if (currentY - lineHeight < headerBottomY - 10) break;
                    if (l === 0) { ctxV.fillStyle = chat.color; ctxV.fillText(nameStr, -boxWidth/2 + 30, currentY); ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY); } 
                    else { ctxV.fillStyle = "#ffffff"; ctxV.fillText(" " + chat.lines[l], -boxWidth/2 + 30 + chat.nameWidth, currentY); }
                    currentY -= lineHeight; 
                }
                if (currentY - lineHeight < headerBottomY - 10) break; currentY -= 15; 
            }
            ctxV.restore(); 

            if (audioPeak > 0.6) { ctxV.strokeStyle = "rgba(255, 0, 85, 0.6)"; ctxV.lineWidth = 12; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 25); ctxV.stroke(); }
            ctxV.restore();
            
        } else {
            let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
            ctxV.save(); ctxV.globalAlpha = outroAlpha;
            let bgGrad = ctxV.createRadialGradient(540, 960, 0, 540, 960, 1920); bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.95)"); bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)"); ctxV.fillStyle = bgGrad; ctxV.fillRect(0, 0, 1080, 1920);
            let cx = 540; let cy = 960; ctxV.textAlign = "center"; ctxV.textBaseline = "middle"; let floatY = (Math.sin(window.matchEndTimer * 0.05) * 10) | 0;
            
            ctxV.fillStyle = "#ffffff"; ctxV.font = `900 65px 'Arial Black', sans-serif`; ctxV.fillText("BINGE WATCH MY PAGE 👀", cx, cy - 500 + floatY); ctxV.fillStyle = "#ff0050"; ctxV.font = `900 45px 'Montserrat', sans-serif`; ctxV.fillText("👇 MORE COMBOS BELOW 👇", cx, cy - 430 + floatY);
            let gridY = cy - 350 + floatY; ctxV.lineWidth = 4;
            for(let i=-1; i<=1; i++) {
                let rx = cx + i*340 - 150; ctxV.fillStyle = "#111827"; ctxV.strokeStyle = (i===0) ? "#00f3ff" : "#334155";
                ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(rx, gridY, 300, 450, 20); else ctxV.rect(rx, gridY, 300, 450); ctxV.fill(); ctxV.stroke();
                ctxV.fillStyle = "#ffffff"; ctxV.font = "900 35px Arial Black"; ctxV.textAlign = "left"; let views = (i===-1) ? "1.2M" : (i===0) ? "3.4M" : "800K"; ctxV.fillText(`▶ ${views}`, rx + 20, gridY + 410);
            }
            ctxV.textAlign = "center"; let btnWidth = 640; let btnHeight = 160; let btnY = cy + 200 + floatY; let btnPulse = 1 + (audioPeak * 0.08); ctxV.translate(cx, btnY); ctxV.scale(btnPulse, btnPulse);
            if(!window._cachedGradients.btnCTA) { window._cachedGradients.btnCTA = ctxV.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0); window._cachedGradients.btnCTA.addColorStop(0, "#ff0050"); window._cachedGradients.btnCTA.addColorStop(1, "#00f2fe"); }
            ctxV.fillStyle = window._cachedGradients.btnCTA; ctxV.beginPath(); if(ctxV.roundRect) ctxV.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); else ctxV.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight); ctxV.fill();
            ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctxV.stroke(); ctxV.fillStyle = "#ffffff"; ctxV.font = `900 60px 'Arial Black', sans-serif`; ctxV.fillText("✨ CREATE YOUR OWN", 0, 7);
            ctxV.restore();
        }
    }

    if (window.videoTrackV && window.videoTrackV.requestFrame) window.videoTrackV.requestFrame();
};

window.captureFrameTo1080p = window.captureFrames;
window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 25px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; max-width: 800px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 99999; position: relative;"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 32px;">🎬 STUDIO ARCHIVE</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">No battles recorded yet. Fight to generate content!</p>`; return; }
    let html = `<h3 style="margin: 0 0 20px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 35px;">🎬 STUDIO ARCHIVE (${window.savedVideos.length} VIDEOS)</h3><div style="display: flex; flex-direction: column; gap: 15px; max-height: 500px; overflow-y: auto; padding-right: 10px;">`;
    window.savedVideos.forEach((vid) => { 
        let postKitText = window.StoryModeAI.generateViralPostKit ? window.StoryModeAI.generateViralPostKit(vid.heroName, "BOSS") : vid.viralTitle;
        html += `<div style="display: flex; gap: 20px; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;">
                    <div style="position: relative; width: 140px; height: 249px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 2px solid #0f172a; box-shadow: 0 0 10px rgba(0,243,255,0.2);"><img src="${vid.previewThumb || vid.heroAvatar}" style="width: 100%; height: 100%; object-fit: cover;"><span style="position: absolute; bottom: 0px; left: 0px; width: 100%; text-align: center; background: rgba(30, 215, 96, 0.95); color: #fff; font-size: 11px; padding: 5px 0px; font-weight: bold; letter-spacing: 1px;">✅ THUMBNAIL</span></div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div><span style="font-weight: 900; color: #ffeb3b; font-size: 20px; text-shadow: 0 0 5px rgba(255,235,59,0.3); display: block; margin-bottom: 8px; line-height: 1.2;">${vid.viralTitle}</span><div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; font-weight: 600;"><img src="${vid.heroAvatar}" style="width: 20px; height: 20px; border-radius: 50%;"> <span>${vid.heroName}</span><span>•</span><span>🕒 ${vid.timestamp}</span></div></div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;"><button onclick="window.copyToClipboard('${postKitText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')" style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 13px;">📋 Copy Viral Post Kit</button><a href="${vid.urlV}" download="[SHORT]_${vid.safeFileName}.${vid.ext}" style="background: linear-gradient(90deg, #ff0050, #00f2fe); color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: 900; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(255, 0, 80, 0.4); border: 1px solid rgba(255,255,255,0.3); flex: 1; justify-content: center;">🚀 Download TikTok Video</a><button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #ff4757; border: 1px solid #ff4757; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: bold; cursor: pointer;">❌ DEL</button></div>
                    </div></div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { let index = window.savedVideos.findIndex(v => v.id === id); if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } };
