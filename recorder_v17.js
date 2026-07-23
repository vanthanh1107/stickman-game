// ==========================================
// RECORDER.JS - BẢN HOÀN HẢO CHO CONTENT CREATOR (V50.0 - HYPNOTIC CTA OPTIMIZED)
// [NEW] SMART COMBO ALIGNMENT: Chữ Combo không bao giờ bị che trên màn hình dọc
// [NEW] DYNAMIC SUBSCRIBE BUTTON: Nút Đăng ký màu đỏ nảy theo nhịp âm thanh
// [NEW] HYPNOTIC OUTRO CTA: Màn hình "Tạo nhân vật" từ từ hiện lên, trôi nổi 3D siêu đẹp
// ==========================================

window.mediaRecorderH = null; window.recordedChunksH = []; window.recordCanvasH = null; window.recordCtxH = null;
window.mediaRecorderV = null; window.recordedChunksV = []; window.recordCanvasV = null; window.recordCtxV = null;
window.isRecording = false; 
window.currentVideoExt = "webm"; 
window.savedVideos = [];

// Khởi tạo Audio Context toàn cục và Bộ phân tích Sóng Âm
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
if (!window.masterRecordDestination) window.masterRecordDestination = window.audioCtx.createMediaStreamDestination();
if (!window.recordAnalyser) {
    window.recordAnalyser = window.audioCtx.createAnalyser();
    window.recordAnalyser.fftSize = 128; 
    window.analyserData = new Uint8Array(window.recordAnalyser.frequencyBinCount);
}

// ==========================================
// 🧠 HỆ THỐNG STORYTELLING AI (MEGA MATRIX - 12 CHỦ ĐỀ VIRAL)
// ==========================================
window.StoryModeAI = {
    scriptLines: [],      
    currentLineIndex: 0,  
    currentAudioSource: null,   
    
    fullText: "",
    displayedText: "",
    charIndex: 0,
    isTyping: false,
    scriptProgress: 0, 
    viralTitle: "",

    generateScript: function(hero, enemy) {
        let h = hero.toUpperCase(); let e = enemy.toUpperCase();
        const narratives = [
            { title: `Bro really tried to disrespect ${e} like that 💀 #shorts #gaming`, lines: ["Never disrespect a boss like this unless you are ready for the consequences.", "Watch what happens when you push the game's mechanics to the absolute limit.", "Most players would panic here, but you just need to stay perfectly calm.", "Notice the exact frame the dodge happens. That is not luck, that is pure muscle memory.", `If you thought ${e} was hard, just wait until you see this ending.`] },
            { title: `Stop making this huge mistake against ${e} ❌ #gamingtips #protips`, lines: ["Stop making this one massive mistake every time you fight this boss.", "You are probably dodging way too early and getting caught in the secondary hitbox.", "The secret is to actually step IN towards the attack, not away from it.", "Look at how the spacing completely nullifies the damage output.", `Send this to a friend who is still struggling against ${e}.`] },
            { title: `The psychology trick to never lose focus in gaming 🧠 #psychology #gamer`, lines: ["Here is a psychological trick pro gamers use to never lose their focus.", "Your brain naturally filters out repetitive visual information, causing reaction time to drop.", "To reset your visual cortex, quickly blink hard three times and refocus on the center.", "This instantly forces your brain to process the frame rate as completely new information.", `This is exactly how you maintain perfect reaction time against someone like ${e}.`] },
            { title: `The hidden truth behind ${e} will ruin your childhood 😳 #gamelore #gamingdetails`, lines: ["Nobody realizes the incredibly dark secret hidden right in front of us.", "Look closely at the animation design during this exact phase of the fight.", "The developers actually left a massive clue about the true origin of this character.", "They are not the villain. They are actually the original protector who got corrupted.", `Once you realize why ${e} is fighting ${h}, this entire battle feels completely different.`] },
            { title: `This ${h} vs ${e} fight is absolute CINEMA 🍿 #epicmoments #gamingclips`, lines: ["This might be the most cinematic sequence ever captured in this game.", "The choreography, the timing, everything here feels like a perfectly directed movie.", "Most fights are just button mashing, but this is a pure dance of mechanics.", "One missed frame and this entire run is completely dead.", `I cannot believe the clutch at the very end of this video. Watch this!`] },
            { title: `How to break the game using ${h} 🤫 (Devs plz don't patch) #glitch #mechanics`, lines: ["There is a borderline broken mechanic in this game that nobody is using.", "By canceling your animation at the exact moment of impact, you can manipulate the DPS.", "The game engine actually gets confused and registers massive damage in a single frame.", "Look at how fast the health bar just completely melts away.", `Use this trick with ${h} right now before the developers patch it.`] },
            { title: `POV: You finally figured out how to counter ${e} 😭 #pov #relatablegaming`, lines: ["We have all been stuck on this exact part of the game for way too long.", "You memorize the patterns, you upgrade your gear, but nothing seems to work.", "Until you finally reach that flow state where everything just clicks.", "The attack telegraphs start moving in slow motion, and you see the matrix.", `Watch how satisfying it is when ${h} finally gets the perfect run.`] },
            { title: `Is this the most illegal ${h} build ever? 🤯 #gamingbuilds #meta`, lines: ["Let's break down exactly why this specific setup is completely dominating the meta.", "Instead of stacking raw damage, this relies entirely on stamina and cooldown manipulation.", "It creates an infinite loop where the opponent literally cannot counter-attack.", "It is a masterclass in exploiting the game's internal stat scaling.", `Watch ${e} try to retaliate, only to realize they are completely trapped.`] },
            { title: `99% of players would have panicked here 🥶 #clutch #gamingskills`, lines: ["I want you to honestly ask yourself: would you have survived this situation?", "Look at the health bar. Look at the spacing. The margin for error is absolute zero.", "When your HP gets this low, the adrenaline usually makes you spam buttons.", "But the discipline to hold back and wait for the perfect parry window is insane.", `This is the exact difference between an average player and an absolute god.`] },
            { title: `The strategy that got banned in tournaments 🚫 #esports #banned`, lines: ["This specific strategy is actually banned in most competitive tournaments.", "It is considered so overpowered that it completely ruins the competitive integrity.", "By abusing the invincibility frames on this specific dodge, you become untouchable.", "Opponents literally have no mathematical way to punish you if done correctly.", `Watch how ${h} uses it here to completely humiliate ${e}.`] },
            { title: `Only 1% of players know this hidden ${h} mechanic 👑 #secret #proplayer`, lines: ["There is a secret rule that separates the top 1 percent of players from the rest.", "It is not about having faster reflexes, it is about animation priority.", "Average players attack when they see an opening. Pros attack before the opening even happens.", "They read the opponent's input buffering and punish the startup frames.", `Look at how ${h} is constantly three steps ahead of ${e} in this fight.`] },
            { title: `The unspoken rule of fighting ${e} 🤫 #unspokenrizz #gamingcommunity`, lines: ["There is an unspoken rule in the community when you fight this exact boss.", "You never, ever try to trade damage during their second phase transition.", "The hyper-armor they get will absolutely destroy your entire health bar.", "You have to respect the spacing and let them finish the animation completely.", `If you break this rule, you end up on a highlight reel for all the wrong reasons.`] }
        ];
        return narratives[Math.floor(Math.random() * narratives.length)];
    },

    init: function(hero, enemy) {
        let narrative = this.generateScript(hero, enemy);
        this.scriptLines = narrative.lines;
        this.viralTitle = narrative.title;
        this.currentLineIndex = 0; this.fullText = ""; this.displayedText = ""; this.charIndex = 0; this.isTyping = false; this.scriptProgress = 0;
    },

    playNextLine: function() {
        if (!window.isRecording || this.currentLineIndex >= this.scriptLines.length || window.gameOver) {
            this.fullText = ""; this.displayedText = ""; this.isTyping = false;
            return;
        }

        let textToSpeak = this.scriptLines[this.currentLineIndex];
        this.fullText = textToSpeak; this.charIndex = 0; this.displayedText = ""; this.isTyping = true;
        this.scriptProgress = (this.currentLineIndex) / this.scriptLines.length;

        let ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(textToSpeak)}`;
        let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ttsUrl)}`;
        
        if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();

        let fetchPromise = fetch(ttsUrl).catch(() => fetch(proxyUrl));
        fetchPromise
            .then(res => { if (!res.ok) throw new Error("Blocked"); return res.arrayBuffer(); })
            .then(buffer => window.audioCtx.decodeAudioData(buffer))
            .then(decodedData => {
                if (this.currentAudioSource) { try { this.currentAudioSource.stop(); } catch(e){} }
                let source = window.audioCtx.createBufferSource(); source.buffer = decodedData;
                
                let gainNode = window.audioCtx.createGain(); gainNode.gain.value = 1.6; 
                source.connect(gainNode); gainNode.connect(window.audioCtx.destination);
                
                if (window.masterRecordDestination) gainNode.connect(window.masterRecordDestination);
                if (window.recordAnalyser) gainNode.connect(window.recordAnalyser);
                
                this.currentAudioSource = source;
                source.onended = () => {
                    this.isTyping = false; this.currentLineIndex++;
                    if(this.currentLineIndex >= this.scriptLines.length) this.scriptProgress = 1.0;
                    setTimeout(() => { this.playNextLine(); }, 1200); 
                };
                source.start(0);
            })
            .catch(err => {
                let fallbackAudio = new Audio(proxyUrl); fallbackAudio.crossOrigin = "anonymous"; fallbackAudio.volume = 1.0;
                try { let fbSrc = window.audioCtx.createMediaElementSource(fallbackAudio); fbSrc.connect(window.masterRecordDestination); fbSrc.connect(window.audioCtx.destination); } catch(e){}
                fallbackAudio.onended = () => { this.isTyping = false; this.currentLineIndex++; if(this.currentLineIndex >= this.scriptLines.length) this.scriptProgress = 1.0; setTimeout(() => { this.playNextLine(); }, 1200); };
                fallbackAudio.play().catch(e => { setTimeout(() => { fallbackAudio.onended(); }, textToSpeak.length * 60); });
            });
    },

    stop: function() {
        if (this.currentAudioSource) { try { this.currentAudioSource.stop(); } catch(e){} this.currentAudioSource = null; }
        this.fullText = ""; this.displayedText = ""; this.isTyping = false; this.scriptProgress = 0;
    }
};

window.sanitizeFileName = function(str) { return str.replace(/[^a-z0-9\s_-]/gi, '').trim().replace(/\s+/g, '_'); };

// ==========================================
// HỆ THỐNG AUTO-CAPTURE TOÀN BỘ ÂM THANH IN-GAME
// ==========================================
if (!window.audioInterceptorInjected) {
    window.audioInterceptorInjected = true;
    const OriginalAudio = window.Audio;
    window.Audio = function() { let audio = new OriginalAudio(...arguments); audio.crossOrigin = "anonymous"; return audio; };

    const originalAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        if (!this.crossOrigin && this.src && this.src.startsWith('http')) this.crossOrigin = "anonymous";
        if (!this._routedToRecorder && window.audioCtx && window.masterRecordDestination) {
            try {
                let source = window.audioCtx.createMediaElementSource(this);
                source.connect(window.masterRecordDestination); source.connect(window.audioCtx.destination);
                if (window.recordAnalyser) source.connect(window.recordAnalyser); 
                this._routedToRecorder = true;
            } catch (e) { }
        }
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        return originalAudioPlay.apply(this, arguments);
    };

    const originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function() {
        let target = arguments[0]; let isDestination = target && (target.toString().includes('Destination') || (target.context && target === target.context.destination));
        if (isDestination && window.masterRecordDestination) { 
            try { originalConnect.call(this, window.masterRecordDestination); if (window.recordAnalyser) originalConnect.call(this, window.recordAnalyser); } catch(e){} 
        }
        return originalConnect.apply(this, arguments);
    };
}

window.initRecorder = function() {
    if (!document.getElementById("hiddenRecordCanvasH")) {
        window.recordCanvasH = document.createElement("canvas"); window.recordCanvasH.id = "hiddenRecordCanvasH"; window.recordCanvasH.width = 1920; window.recordCanvasH.height = 1080;
        window.recordCanvasH.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasH); window.recordCtxH = window.recordCanvasH.getContext("2d");
    }
    if (!document.getElementById("hiddenRecordCanvasV")) {
        window.recordCanvasV = document.createElement("canvas"); window.recordCanvasV.id = "hiddenRecordCanvasV"; window.recordCanvasV.width = 1080; window.recordCanvasV.height = 1920;
        window.recordCanvasV.style.cssText = "position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -9999;";
        document.body.appendChild(window.recordCanvasV); window.recordCtxV = window.recordCanvasV.getContext("2d");
    }
};

window.startRecording = function() {
    if (window.isRecording) return; if (!window.recordCanvasH || !window.recordCanvasV) window.initRecorder();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    
    if (window.bgmBase && !window.bgmBase._routedToRecorder) {
        try { if (!window.bgmBase.crossOrigin) window.bgmBase.crossOrigin = "anonymous"; let bgmSrc = window.audioCtx.createMediaElementSource(window.bgmBase); bgmSrc.connect(window.masterRecordDestination); bgmSrc.connect(window.audioCtx.destination); if (window.recordAnalyser) bgmSrc.connect(window.recordAnalyser); window.bgmBase._routedToRecorder = true; } catch (e) { }
    }

    try { if (window.silenceOsc) window.silenceOsc.stop(); window.silenceOsc = window.audioCtx.createOscillator(); let silenceGain = window.audioCtx.createGain(); silenceGain.gain.value = 0; window.silenceOsc.connect(silenceGain); silenceGain.connect(window.masterRecordDestination); window.silenceOsc.start(); } catch(e) {}
    
    window.recordedChunksH = []; window.recordedChunksV = [];
    let videoStreamH = window.recordCanvasH.captureStream(); let videoStreamV = window.recordCanvasV.captureStream(); 
    let audioTracks = window.masterRecordDestination.stream.getAudioTracks();
    
    let combinedStreamH = new MediaStream(); let combinedStreamV = new MediaStream();
    videoStreamH.getVideoTracks().forEach(track => combinedStreamH.addTrack(track));
    videoStreamV.getVideoTracks().forEach(track => combinedStreamV.addTrack(track));
    audioTracks.forEach(track => { combinedStreamH.addTrack(track); combinedStreamV.addTrack(track); });
    
    let options = { videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm";
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) { options = { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "mp4"; } 
    else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) { options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 8000000 }; window.currentVideoExt = "webm"; }
    
    try { window.mediaRecorderH = new MediaRecorder(combinedStreamH, options); window.mediaRecorderV = new MediaRecorder(combinedStreamV, options); } 
    catch (e) { window.mediaRecorderH = new MediaRecorder(combinedStreamH); window.mediaRecorderV = new MediaRecorder(combinedStreamV); }

    window.mediaRecorderH.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksH.push(e.data); };
    window.mediaRecorderV.ondataavailable = (e) => { if (e.data && e.data.size > 0) window.recordedChunksV.push(e.data); };

    let charName = "PLAYER", charAvatar = "https://i.imgur.com/q3813rX.png";
    if (window.p1) {
        charName = window.p1.className || window.p1.name || "PLAYER";
        if (window.classStats && window.classStats[window.p1.classId]) { charName = window.classStats[window.p1.classId].className || charName; charAvatar = window.classStats[window.p1.classId].avatarUrl || charAvatar; }
    }

    let enemyName = "BOSS";
    if (window.enemies && window.enemies.length > 0) {
        let e0 = window.enemies[0];
        enemyName = e0.className || e0.name || "BOSS";
        if (e0.isDragon) enemyName = "DRAGON";
        if (e0.isBruceLee) enemyName = "BRUCE LEE";
        if (window.classStats && window.classStats[e0.classId]) enemyName = window.classStats[e0.classId].className || enemyName;
    }

    window.StoryModeAI.init(charName, enemyName);

    let stoppedCount = 0;
    const finalizeRecordings = () => {
        stoppedCount++;
        if (stoppedCount === 2) {
            setTimeout(() => {
                if (window.recordedChunksH.length === 0 || window.recordedChunksV.length === 0) return;
                let safeFileName = window.sanitizeFileName(window.StoryModeAI.viralTitle);
                let mimeType = window.currentVideoExt === "mp4" ? "video/mp4" : "video/webm";
                
                let blobH = new Blob(window.recordedChunksH, { type: mimeType }); let videoUrlH = URL.createObjectURL(blobH);
                let blobV = new Blob(window.recordedChunksV, { type: mimeType }); let videoUrlV = URL.createObjectURL(blobV);

                window.savedVideos.push({ 
                    id: Date.now(), urlH: videoUrlH, urlV: videoUrlV, ext: window.currentVideoExt, 
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heroName: charName, heroAvatar: charAvatar,
                    viralTitle: window.StoryModeAI.viralTitle, 
                    safeFileName: safeFileName
                });
                if (typeof window.updateVideoListUI === 'function') window.updateVideoListUI();
            }, 200);
        }
    };

    window.mediaRecorderH.onstop = finalizeRecordings; window.mediaRecorderV.onstop = finalizeRecordings;
    window.mediaRecorderH.start(); window.mediaRecorderV.start(); 
    window.isRecording = true;

    setTimeout(() => { window.StoryModeAI.playNextLine(); }, 1500);
};

window.stopRecording = function() { 
    if (!window.isRecording) return; 
    try { window.mediaRecorderH.requestData(); window.mediaRecorderV.requestData(); } catch(e){} 
    window.mediaRecorderH.stop(); window.mediaRecorderV.stop(); 
    window.isRecording = false; 
    window.StoryModeAI.stop();
    if (window.silenceOsc) { window.silenceOsc.stop(); window.silenceOsc = null; }
};

if (!window._hookedDrawForRecorder) {
    window._hookedDrawForRecorder = true;
    const oldDraw = window.draw;
    window.draw = function() {
        if (oldDraw) oldDraw.apply(this, arguments);
        if (typeof window.captureFrames === 'function') window.captureFrames();
    };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' '); let line = '';
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.shadowColor = "#000"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
            ctx.strokeText(line, x, y);
            ctx.shadowColor = "#f1c40f"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.fillText(line, x, y);
            line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.shadowColor = "#000"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
    ctx.strokeText(line, x, y);
    ctx.shadowColor = "#f1c40f"; ctx.shadowBlur = 10; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    ctx.fillText(line, x, y);
}

function drawAudioVisualizer(ctx, x, y, width, height) {
    let numBars = 24; let barWidth = (width / numBars) - 4; let center = x;
    ctx.save();
    for (let i = 0; i < numBars / 2; i++) {
        let barHeight = (window.analyserData[i + 2] / 255) * height; 
        if (barHeight < 5) barHeight = 5; 
        let grad = ctx.createLinearGradient(0, y, 0, y - barHeight);
        grad.addColorStop(0, "#00f3ff"); grad.addColorStop(1, "#f1c40f");
        ctx.fillStyle = grad;
        let offsetX = i * (barWidth + 4) + (barWidth/2);
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(center + offsetX, y - barHeight, barWidth, barHeight, 5); ctx.fill(); } else { ctx.fillRect(center + offsetX, y - barHeight, barWidth, barHeight); }
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(center - offsetX - barWidth, y - barHeight, barWidth, barHeight, 5); ctx.fill(); } else { ctx.fillRect(center - offsetX - barWidth, y - barHeight, barWidth, barHeight); }
    }
    ctx.restore();
}

// =====================================
// [NEW] HÀM VẼ COMBO CHO ĐIỆN THOẠI KHÔNG BỊ CẮT XÉN
// =====================================
function renderMobileSafeCombo(ctx, fighter, xPos, yPos, align, isMobile) {
    if (fighter && fighter.comboHits >= 2) {
        let scale = isMobile ? 1.4 : 1; 
        let alpha = Math.max(0, fighter.comboAlpha || 1);
        let hits = fighter.comboHits;
        let rank = "D"; let rankColor = "#bdc3c7"; let rankText = "NICE";
        
        if (hits >= 4) { rank = "C"; rankColor = "#2ecc71"; rankText = "COOL!"; }
        if (hits >= 6) { rank = "B"; rankColor = "#3498db"; rankText = "BRUTAL!"; }
        if (hits >= 8) { rank = "A"; rankColor = "#9b59b6"; rankText = "AWESOME!"; }
        if (hits >= 12) { rank = "S"; rankColor = "#f1c40f"; rankText = "SAVAGE!"; }
        if (hits >= 16) { rank = "SS"; rankColor = "#e67e22"; rankText = "SICK!!"; }
        if (hits >= 20) { rank = "SSS"; rankColor = "#ff003c"; rankText = "SMOKIN' SICK!!!"; }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = align;
        
        ctx.font = `italic 900 ${28 * scale}px 'Arial Black', Impact`;
        ctx.fillStyle = fighter.isPlayer ? "#ff9f43" : "#ff4757";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10 * scale;
        ctx.fillText(`🔥 ${hits} HITS`, xPos, yPos);
        
        ctx.font = `italic 900 ${20 * scale}px 'Arial Black', Impact`;
        ctx.fillStyle = rankColor;
        ctx.shadowColor = rankColor; ctx.shadowBlur = 15 * scale;
        ctx.fillText(`${rank} - ${rankText}`, xPos, yPos + (32 * scale));
        
        ctx.restore();
    }
}

// ==========================================
// RENDER KHUNG HÌNH CHÍNH
// ==========================================
window.captureFrames = function() {
    if (!window.isRecording || !window.recordCtxH || !window.recordCtxV || !window.canvas) return;
    
    let ctxH = window.recordCtxH; let ctxV = window.recordCtxV; 
    if (window.recordAnalyser) window.recordAnalyser.getByteFrequencyData(window.analyserData);
    let audioPeak = window.analyserData[3] / 255 || 0; 
    
    let shakeX = 0, shakeY = 0;
    if (audioPeak > 0.6) {
        let shakeIntensity = (audioPeak - 0.6) * 30; 
        shakeX = (Math.random() - 0.5) * shakeIntensity;
        shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    // --- 1. RENDER NGANG (16:9) ---
    ctxH.fillStyle = "#050505"; ctxH.fillRect(0, 0, 1920, 1080); 
    ctxH.imageSmoothingEnabled = false; 
    ctxH.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, shakeX, shakeY, 1920, 880); 
    let vignetteH = ctxH.createRadialGradient(960, 440, 500, 960, 440, 1200); 
    vignetteH.addColorStop(0, 'rgba(0,0,0,0)'); vignetteH.addColorStop(1, 'rgba(0,0,0,0.7)'); 
    ctxH.fillStyle = vignetteH; ctxH.fillRect(0, 0, 1920, 880);

    // --- 2. RENDER DỌC (9:16) ---
    ctxV.fillStyle = "#0a0a14"; ctxV.fillRect(0, 0, 1080, 1920); 
    ctxV.save(); ctxV.strokeStyle = "rgba(0, 243, 255, 0.1)"; ctxV.lineWidth = 3;
    let timeOffset = (Date.now() / 20) % 100; ctxV.beginPath();
    for(let i = 0; i < 1080; i += 100) { ctxV.moveTo(i, 0); ctxV.lineTo(i, 1920); }
    for(let j = timeOffset; j < 1920; j += 100) { ctxV.moveTo(0, j); ctxV.lineTo(1080, j); }
    ctxV.stroke(); ctxV.restore();

    ctxV.imageSmoothingEnabled = false;
    ctxV.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, -420 + shakeX, 420 + shakeY, 1920, 1080); 
    let vignetteV = ctxV.createRadialGradient(540, 960, 400, 540, 960, 1000); 
    vignetteV.addColorStop(0, 'rgba(0,0,0,0)'); vignetteV.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctxV.fillStyle = vignetteV; ctxV.fillRect(0, 420, 1080, 1080);

    // =====================================
    // VẼ HUD MÁU & COMBO OVERLAY
    // =====================================
    if (!window.hudImages) window.hudImages = {};
    const getHudImg = (url) => { if (!url) return null; if (window.hudImages[url] && window.hudImages[url].complete && window.hudImages[url].naturalWidth > 0) return window.hudImages[url]; if (!window.hudImages[url]) { let img = new Image(); img.crossOrigin = "Anonymous"; img.src = url; window.hudImages[url] = img; } return null; };

    let repEnemyObj = window.enemies && window.enemies.length > 0 ? window.enemies[0] : null;

    if (window.p1 && !window.gameOver && window.introTimer <= 120) {
        const drawSkewedPath = (ctx, x, y, w, h, isLeft) => { ctx.beginPath(); if (isLeft) { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - 25, y + h); ctx.lineTo(x - 25, y + h); } else { ctx.moveTo(x + 25, y); ctx.lineTo(x + w + 25, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); } ctx.closePath(); };
        
        let p1Hp = Math.max(0, window.p1.hp / window.p1.maxHp); let p1Stam = Math.max(0, window.p1.stamina / 100);
        let eHp = 0, eMax = window.totalEnemyMaxHp || 1, p2Hp = 0, eStam = 0;
        
        let p1Name = "PLAYER", p1Url = "https://i.imgur.com/q3813rX.png";
        if (window.p1) { p1Name = (window.p1.className || window.p1.name || "PLAYER").toUpperCase(); if (window.classStats && window.classStats[window.p1.classId]) { p1Name = (window.classStats[window.p1.classId].className || p1Name).toUpperCase(); p1Url = window.classStats[window.p1.classId].avatarUrl || p1Url; } }

        let eName = "ENEMY", p2Url = "https://i.imgur.com/q3813rX.png";
        if (repEnemyObj) {
            window.enemies.forEach(e => eHp += Math.max(0, e.hp)); p2Hp = Math.max(0, eHp / eMax); eStam = Math.max(0, repEnemyObj.stamina / 100);
            eName = (repEnemyObj.className || repEnemyObj.name || "ENEMY").toUpperCase();
            if (repEnemyObj.isDragon) eName = "DRAGON"; if (repEnemyObj.isBruceLee) eName = "BRUCE LEE";
            if (window.classStats && window.classStats[repEnemyObj.classId]) { eName = (window.classStats[repEnemyObj.classId].className || eName).toUpperCase(); p2Url = window.classStats[repEnemyObj.classId].avatarUrl || p2Url; }
            if (window.enemies.length > 1) eName += ` x${window.enemies.length}`;
        }

        let img1 = getHudImg(p1Url); let img2 = getHudImg(p2Url);

        // HUD NGANG
        ctxH.lineJoin = "round"; ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.font = "900 48px Arial"; ctxH.textAlign = "left";
        if (img1) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(70, 25, 55, 55, 6); else ctxH.rect(70, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img1, 70, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#00f3ff"; ctxH.strokeRect(70, 25, 55, 55); }
        ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(p1Name, 145, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(p1Name, 145, 72);
        drawSkewedPath(ctxH, 80, 90, 750, 45, true); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
        if (p1Hp > 0) { let hpGrad = ctxH.createLinearGradient(80, 0, 830, 0); hpGrad.addColorStop(0, "#ff4757"); hpGrad.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxH, 80, 90, 750 * p1Hp, 45, true); ctxH.fillStyle = hpGrad; ctxH.fill(); }
        ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(60, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(60, 145, 400 * p1Stam, 15);

        if (repEnemyObj) {
            ctxH.textAlign = "right"; 
            if (img2) { ctxH.save(); ctxH.beginPath(); if (ctxH.roundRect) ctxH.roundRect(1795, 25, 55, 55, 6); else ctxH.rect(1795, 25, 55, 55); ctxH.clip(); ctxH.drawImage(img2, 1795, 25, 55, 55); ctxH.restore(); ctxH.lineWidth = 4; ctxH.strokeStyle = "#ff003c"; ctxH.strokeRect(1795, 25, 55, 55); }
            ctxH.lineWidth = 8; ctxH.strokeStyle = "#000"; ctxH.strokeText(eName, 1780, 72); ctxH.fillStyle = "#fff"; ctxH.fillText(eName, 1780, 72);
            drawSkewedPath(ctxH, 1090, 90, 750, 45, false); ctxH.fillStyle = "rgba(0,0,0,0.7)"; ctxH.fill(); ctxH.lineWidth = 5; ctxH.strokeStyle = "rgba(255,255,255,0.9)"; ctxH.stroke();
            if (p2Hp > 0) { let hpGrad = ctxH.createLinearGradient(1090, 0, 1840, 0); hpGrad.addColorStop(0, "#c0392b"); hpGrad.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxH, 1090 + (750 - eHpWidth), 90, eHpWidth, 45, false); ctxH.fillStyle = hpGrad; ctxH.fill(); }
            ctxH.fillStyle = "rgba(0,0,0,0.8)"; ctxH.fillRect(1460, 145, 400, 15); ctxH.fillStyle = "#f1c40f"; ctxH.fillRect(1460 + (400 - (400 * eStam)), 145, 400 * eStam, 15);
        }
        ctxH.textAlign = "center"; ctxH.font = "italic 900 80px Arial"; ctxH.lineWidth = 10; ctxH.strokeStyle = "#000"; ctxH.strokeText("VS", 960, 130); let vsGrad = ctxH.createLinearGradient(0, 50, 0, 140); vsGrad.addColorStop(0, "#f1c40f"); vsGrad.addColorStop(1, "#e67e22"); ctxH.fillStyle = vsGrad; ctxH.fillText("VS", 960, 130);

        // HUD DỌC
        ctxV.lineJoin = "round"; ctxV.lineWidth = 8; ctxV.strokeStyle = "#000"; ctxV.font = "900 42px Arial"; ctxV.textAlign = "left";
        if (img1) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(40, 450, 80, 80, 10); else ctxV.rect(40, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img1, 40, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#00f3ff"; ctxV.strokeRect(40, 450, 80, 80); }
        ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(p1Name, 140, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(p1Name, 140, 490);
        drawSkewedPath(ctxV, 140, 505, 380, 40, true); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
        if (p1Hp > 0) { let hpGradV = ctxV.createLinearGradient(140, 0, 520, 0); hpGradV.addColorStop(0, "#ff4757"); hpGradV.addColorStop(1, "#ff7f50"); drawSkewedPath(ctxV, 140, 505, 380 * p1Hp, 40, true); ctxV.fillStyle = hpGradV; ctxV.fill(); }
        ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(140, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(140, 555, 300 * p1Stam, 15);

        if (repEnemyObj) {
            ctxV.textAlign = "right"; 
            if (img2) { ctxV.save(); ctxV.beginPath(); if (ctxV.roundRect) ctxV.roundRect(960, 450, 80, 80, 10); else ctxV.rect(960, 450, 80, 80); ctxV.clip(); ctxV.drawImage(img2, 960, 450, 80, 80); ctxV.restore(); ctxV.lineWidth = 5; ctxV.strokeStyle = "#ff003c"; ctxV.strokeRect(960, 450, 80, 80); }
            ctxV.lineWidth = 7; ctxV.strokeStyle = "#000"; ctxV.strokeText(eName, 940, 490); ctxV.fillStyle = "#fff"; ctxV.fillText(eName, 940, 490);
            drawSkewedPath(ctxV, 560, 505, 380, 40, false); ctxV.fillStyle = "rgba(0,0,0,0.7)"; ctxV.fill(); ctxV.lineWidth = 5; ctxV.strokeStyle = "rgba(255,255,255,0.9)"; ctxV.stroke();
            if (p2Hp > 0) { let hpGradV2 = ctxV.createLinearGradient(560, 0, 940, 0); hpGradV2.addColorStop(0, "#c0392b"); hpGradV2.addColorStop(1, "#e74c3c"); let eHpWidth = 380 * p2Hp; drawSkewedPath(ctxV, 560 + (380 - eHpWidth), 505, eHpWidth, 40, false); ctxV.fillStyle = hpGradV2; ctxV.fill(); }
            ctxV.fillStyle = "rgba(0,0,0,0.8)"; ctxV.fillRect(640, 555, 300, 15); ctxV.fillStyle = "#f1c40f"; ctxV.fillRect(640 + (300 - (300 * eStam)), 555, 300 * eStam, 15);
        }
    }

    if (!window.gameOver) {
        renderMobileSafeCombo(ctxH, window.p1, 80, 190, "left", false);
        let maxEnemyCombo = null; window.enemies.forEach(e => { if (e.comboHits >= 2 && (!maxEnemyCombo || e.comboHits > maxEnemyCombo.comboHits)) maxEnemyCombo = e; });
        renderMobileSafeCombo(ctxH, maxEnemyCombo, 1840, 190, "right", false);

        renderMobileSafeCombo(ctxV, window.p1, 140, 600, "left", true);
        renderMobileSafeCombo(ctxV, maxEnemyCombo, 940, 600, "right", true);
    }

    // =====================================
    // [NEW] NÚT SUBSCRIBE 🔴 (Nảy nhịp)
    // =====================================
    if (!window.gameOver) {
        ctxV.save();
        ctxV.translate(540, 240); 
        let subScale = 1 + (audioPeak * 0.12); 
        ctxV.scale(subScale, subScale);
        
        ctxV.fillStyle = "#ff0000"; 
        ctxV.shadowColor = "rgba(255,0,0,0.8)"; ctxV.shadowBlur = 20;
        ctxV.beginPath(); 
        if(ctxV.roundRect) ctxV.roundRect(-200, -45, 400, 90, 45); else ctxV.rect(-200, -45, 400, 90); 
        ctxV.fill();

        ctxV.fillStyle = "#ffffff"; 
        ctxV.font = "900 42px 'Montserrat', 'Arial Black', sans-serif"; 
        ctxV.textAlign = "center"; ctxV.textBaseline = "middle";
        ctxV.shadowBlur = 0;
        ctxV.fillText("▶ SUBSCRIBE", 0, 4);
        ctxV.restore();
    }

    // =====================================
    // XỬ LÝ TYPEWRITER VÀ SUBTITLE PULSE
    // =====================================
    if (!window.gameOver) {
        if (window.StoryModeAI.isTyping) {
            window.StoryModeAI.charIndex += 0.5;
            if (window.StoryModeAI.charIndex > window.StoryModeAI.fullText.length) window.StoryModeAI.charIndex = window.StoryModeAI.fullText.length;
            window.StoryModeAI.displayedText = window.StoryModeAI.fullText.substring(0, Math.floor(window.StoryModeAI.charIndex));
        }

        if (window.StoryModeAI.displayedText.length > 0) {
            drawAudioVisualizer(ctxV, 540, 1580, 600, 80); 
            drawAudioVisualizer(ctxH, 960, 910, 600, 60);  

            let textPulse = 1 + (audioPeak * 0.1);

            ctxV.save(); 
            ctxV.translate(540, 1600); 
            ctxV.scale(textPulse, textPulse); 
            ctxV.textAlign = "center"; ctxV.textBaseline = "top";
            ctxV.font = "900 45px 'Montserrat', 'Arial Black', sans-serif";
            ctxV.fillStyle = "#fff"; ctxV.strokeStyle = "#000000"; ctxV.lineWidth = 10; ctxV.lineJoin = "round";
            wrapText(ctxV, window.StoryModeAI.displayedText, 0, 0, 950, 60); 
            ctxV.restore();

            ctxH.save(); 
            ctxH.translate(960, 930);
            ctxH.scale(textPulse, textPulse);
            ctxH.textAlign = "center"; ctxH.textBaseline = "top";
            ctxH.font = "900 40px 'Montserrat', 'Arial Black', sans-serif";
            ctxH.fillStyle = "#fff"; ctxH.strokeStyle = "#000000"; ctxH.lineWidth = 8; ctxH.lineJoin = "round";
            wrapText(ctxH, window.StoryModeAI.displayedText, 0, 0, 1700, 50); 
            ctxH.restore();
        }

        let progressWidthV = 1080 * window.StoryModeAI.scriptProgress;
        ctxV.save(); ctxV.fillStyle = "rgba(255,255,255,0.1)"; ctxV.fillRect(0, 1910, 1080, 10); 
        let gradV = ctxV.createLinearGradient(0, 0, progressWidthV, 0); gradV.addColorStop(0, "#00f3ff"); gradV.addColorStop(1, "#f1c40f");
        ctxV.fillStyle = gradV; ctxV.shadowColor = "#00f3ff"; ctxV.shadowBlur = 15; ctxV.fillRect(0, 1910, progressWidthV, 10); ctxV.restore();

        let progressWidthH = 1920 * window.StoryModeAI.scriptProgress;
        ctxH.save(); ctxH.fillStyle = "rgba(255,255,255,0.1)"; ctxH.fillRect(0, 1070, 1920, 10);
        let gradH = ctxH.createLinearGradient(0, 0, progressWidthH, 0); gradH.addColorStop(0, "#00f3ff"); gradH.addColorStop(1, "#f1c40f");
        ctxH.fillStyle = gradH; ctxH.shadowColor = "#00f3ff"; ctxH.shadowBlur = 15; ctxH.fillRect(0, 1070, progressWidthH, 10); ctxH.restore();
    }

    // =====================================
    // [NEW] MÀN HÌNH CHỐT SALE CUỐI VIDEO (HYPNOTIC OUTRO CTA)
    // Hiện lên từ từ, trôi nổi 3D mượt mà để tăng tỷ lệ Click (CTR)
    // =====================================
    if (window.gameOver && window.matchEndTimer > 90) { 
        let outroAlpha = Math.min(1, (window.matchEndTimer - 90) / 80); 
        
        let drawOutroCTA = (ctx, w, h, isMobile) => {
            ctx.save();
            ctx.globalAlpha = outroAlpha;
            
            let bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
            bgGrad.addColorStop(0, "rgba(10, 13, 20, 0.85)");
            bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            let cx = w / 2; let cy = h / 2;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillStyle = "#00f3ff";
            ctx.shadowColor = "#00f3ff"; ctx.shadowBlur = 25;
            
            let floatY = Math.sin(window.matchEndTimer * 0.05) * 10;
            
            if (isMobile) {
                ctx.font = `italic 900 65px 'Arial Black', sans-serif`;
                ctx.fillText("CREATE YOUR OWN", cx, cy - 250 + floatY);
                ctx.fillStyle = "#ffeb3b"; ctx.shadowColor = "#ffeb3b";
                ctx.fillText("CHARACTER", cx, cy - 170 + floatY);
                ctx.fillStyle = "#fff"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
                ctx.font = `900 45px 'Arial Black', sans-serif`;
                ctx.fillText("BY DESCRIBING IT!", cx, cy - 90 + floatY);
            } else {
                ctx.font = `italic 900 80px 'Arial Black', sans-serif`;
                ctx.fillText("CREATE YOUR OWN CHARACTER", cx, cy - 150 + floatY);
                ctx.fillStyle = "#ffeb3b"; ctx.shadowColor = "#ffeb3b"; ctx.shadowBlur = 15;
                ctx.font = `900 55px 'Arial Black', sans-serif`;
                ctx.fillText("BY DESCRIBING IT!", cx, cy - 60 + floatY);
            }

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${isMobile ? 40 : 35}px 'Montserrat', sans-serif`;
            ctx.fillText("Check Link in Bio / Comments 👇", cx, cy + 20 + floatY);

            let btnWidth = isMobile ? 480 : 420;
            let btnHeight = isMobile ? 120 : 100;
            let btnY = cy + 140 + floatY;
            
            let btnPulse = 1 + (audioPeak * 0.08);
            ctx.translate(cx, btnY);
            ctx.scale(btnPulse, btnPulse);
            
            let btnGrad = ctx.createLinearGradient(-btnWidth/2, 0, btnWidth/2, 0);
            btnGrad.addColorStop(0, "#ff003c");
            btnGrad.addColorStop(1, "#ff4757");
            ctx.fillStyle = btnGrad;
            ctx.shadowColor = "#ff003c"; ctx.shadowBlur = 30 + Math.sin(window.matchEndTimer * 0.1) * 10;
            ctx.beginPath();
            if(ctx.roundRect) ctx.roundRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, btnHeight/2); 
            else ctx.rect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight);
            ctx.fill();

            ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.font = `900 ${isMobile ? 45 : 35}px 'Arial Black', sans-serif`;
            ctx.fillText("✨ TRY IT FREE", 0, 5);

            ctx.restore();
        };

        drawOutroCTA(ctxH, 1920, 1080, false);
        drawOutroCTA(ctxV, 1080, 1920, true);
    }
};

window.captureFrameTo1080p = window.captureFrames;

window.copyToClipboard = function(text) { navigator.clipboard.writeText(text).then(() => { alert("✅ Title copied! Paste into TikTok/YouTube."); }); };

window.updateVideoListUI = function() {
    let container = document.getElementById("video-list-container");
    if (!container) { container = document.createElement("div"); container.id = "video-list-container"; container.style.cssText = "margin-top: 35px; padding: 20px; background: #0a0d14; border-radius: 12px; border: 1px solid #1e293b; max-width: 850px; margin-left: auto; margin-right: auto; color: #fff; font-family: 'Rajdhani', Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"; let gameContainer = document.getElementById("game-container"); if (gameContainer) gameContainer.appendChild(container); else document.body.appendChild(container); }
    if (window.savedVideos.length === 0) { container.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 MATCH ARCHIVE</h3><p style="text-align: center; color: #64748b; margin: 0; font-size: 16px;">No data yet. Fight and hit Exit!</p>`; return; }
    
    let html = `<h3 style="margin: 0 0 15px 0; color: #00f3ff; text-align: center; font-family: 'Teko', sans-serif; letter-spacing: 2px; font-size: 28px;">📹 MATCH ARCHIVE (${window.savedVideos.length} VIDEOS)</h3><div style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 5px;">`;
    window.savedVideos.forEach((vid) => { 
        html += `<div style="display: flex; flex-direction: column; background: #141a27; padding: 15px; border-radius: 8px; border: 1px solid #334155; box-shadow: inset 0 0 5px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                        <span style="font-weight: bold; color: #ffeb3b; font-size: 18px; text-shadow: 0 0 5px rgba(255,235,59,0.3); flex: 1; text-align: left;">📝 ${vid.viralTitle}</span>
                        <button onclick="window.copyToClipboard('${vid.viralTitle.replace(/'/g, "\\'")}')" style="margin-left: 10px; background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">📋 Copy Title</button>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${vid.heroAvatar}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #00f3ff;">
                            <div style="text-align: left; display: flex; flex-direction: column;">
                                <span style="font-weight: 700; color: #f8fafc; font-family: 'Teko', sans-serif; font-size: 22px; letter-spacing: 1px;">${vid.heroName}</span>
                                <span style="font-size: 13px; color: #94a3b8; font-weight: 600;">🕒 Time: ${vid.timestamp}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <a href="${vid.urlH}" download="[HORIZONTAL]_${vid.safeFileName}.${vid.ext}" style="background: #ff003c; color: #fff; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: 600;">📥 HORIZONTAL</a>
                            <a href="${vid.urlV}" download="[VERTICAL]_${vid.safeFileName}.${vid.ext}" style="background: #00f3ff; color: #0a0d14; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: 600;">📱 VERTICAL (TikTok)</a>
                            <button onclick="window.deleteVideo(${vid.id})" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">❌</button>
                        </div>
                    </div>
                </div>`; 
    });
    html += `</div>`; container.innerHTML = html;
};

window.deleteVideo = function(id) { 
    let index = window.savedVideos.findIndex(v => v.id === id); 
    if (index !== -1) { URL.revokeObjectURL(window.savedVideos[index].urlH); URL.revokeObjectURL(window.savedVideos[index].urlV); window.savedVideos.splice(index, 1); window.updateVideoListUI(); } 
};
