// ==========================================
// MAIN.JS - GIAO DIỆN, NHÂN VẬT & MAP & KHO CHIÊU CHÀO SÂN
// ==========================================

// KHO DỮ LIỆU 75 KIỂU CHÀO SÂN VÀ CHỌC TỨC CỰC DÍNH
window.TAUNT_POOL = [
    // --- NHÓM 1: VÕ THUẬT CỔ TRUYỀN & KHÍ CÔNG ---
    "Hạc Tấn Thiếu Lâm! Thủ thế! 🦩",
    "Mãnh Hổ Xuất Sơn! Biến sắc! 🐅",
    "Vịnh Xuân Quyền: Đại sư xuống núi! 🥊",
    "La Hán Thần Quyền! Kim cang hạ thế! 🧘",
    "Thái Cực Quyền - Dĩ Nhu Khắc Cương! ☯️",
    "Tuyệt kỹ: Khinh Công Đạp Tuyết Tầm Mai! 🍃",
    "Thiết Sa Chưởng - Vạn phát xuyên tâm! ✋",
    "Kim Cang Bất Hoại Thể! Đao thương bất nhập! 🛡️",
    "Túy Quyền - Túy tửu bộ pháp! Say mà tỉnh! 🍶",
    "Long Trảo Thủ! Xé toạc hư không! 🐉",
    "Bát Cực Quyền - Chấn thiên địa! 💥",
    "Hàng Long Thập Bát Chưởng! Long ngâm! 🐉",
    "Như Lai Thần Chưởng từ trên trời rơi xuống! 🖐️",
    "Độc Cô Cửu Kiếm - Phá kiếm thức! ⚔️",
    "Quỳ Hoa Bảo Điển - Tốc độ tối thượng! 🧭",
    
    // --- NHÓM 2: BIỂU DIỄN VÀ CÁC ĐIỆU NHẢY HUYỀN THOẠI ---
    "Moonwalk lướt mượt mà kiểu Michael Jackson! 🕺",
    "Nhảy Floss Dance chọc tức đối thủ! 🤙",
    "Múa quạt khởi động, nhạc lên là quẩy! 🪭",
    "Nhảy Gangnam Style vô tri cực đỉnh! 🐎",
    "Twerk Dance chọc mù mắt người xem! 🍑",
    "Hiphop Breakdance - Xoay đầu chấn động! 🤸",
    "Dab một phát bẻ cong mọi định luật vật lý! 🙅",
    "Shuffle Dance thần tốc, chân vô ảnh! 👟",
    "Pop Lock chấn động từng khớp xương! ⚡",
    "Điệu nhảy ăn mừng Thua Cuộc (Take the L)! 🇱",
    "Orange Justice Dance quạt tay điên cuồng! 🍊",
    "Xoay người Disco thập niên 80 rực rỡ! 🪩",
    "Nhảy Billie Jean xoay gót nhón chân! 🧦",
    "Waving tay dẻo kẹo như làn sóng biển! 🌊",
    "Nhảy Ma-ca-re-na khởi động khớp hông! 💃",

    // --- NHÓM 3: TUYỆT KỸ ANIME & PHIM ẢNH ---
    "Kamehamehaaa... Gồng siêu xay da! ⚡",
    "Chidori! Thiên điểu minh chấn! ⚡",
    "Triệu hồi thuật: Ngoại Đạo Ma Tượng! 👹",
    "Bật trạng thái Gear 5 - Nhảy tưng tưng! ☀️",
    "Lục Thức Hải Quân: Nguyệt Bộ bay vào! 🕊️",
    "Thuật Đa Trọng Ảnh Phân Thân! 👥",
    "Za Warudo! Ngưng đọng thời gian! ⏱️",
    "Thiên Chiếu! Ngọn lửa đen hủy diệt! 🔥",
    "Vô Hạn Bản Chất - Lĩnh vực triển khai! 🌌",
    "Gomu Gồng Liên Hoàn Đấm Máy Khâu! 👊",

    // --- NHÓM 4: GÁY KHÉT & CHỌC TỨC GAME THỦ ---
    "Chấp bạn một tay và nửa cây máu luôn! 🤫",
    "Trận này tôi thắng trong vòng 10 giây! ⏱️",
    "Bạn không có cửa chung mâm với ta đâu! 📉",
    "Gà mờ quá, về luyện thêm 10 năm đi! 🐔",
    "Chuẩn bị sẵn sàng nằm đo đất chưa? 🛌",
    "Nhìn kỹ bộ pháp ảo ma của ta đây! 👀",
    "Yếu thế này đấm không bõ dính răng! 🦷",
    "Né được một chiêu của ta, cho 10 tỷ! 💸",
    "Trọng tài ơi chuẩn bị sẵn cáng cứu thương! 🚑",
    "Đánh nhanh thắng nhanh còn về ăn cơm vợ nấu! 🍚",
    "Sát thương của bạn chỉ như muỗi gãi ngứa! 🦟",
    "Đứng im chịu trận đi cho đỡ đau đớn! 🛑",
    "Tuổi trẻ chưa trải sự đời rồi bạn ơi! 🍼",
    "Xin nhẹ cái đầu và chuỗi thắng của bạn nhé! 🎯",
    "Đấm phát này bay màu khỏi bản đồ luôn! 🎨",
    "Nhìn cái gì? Nhào vô đây ăn đấm! 💢",
    "Hạ gục được ta đi rồi hãy gáy nhé! 🥇",
    "Trận này tôi bật Auto-bot cũng thắng! 🤖",
    "Bạn đánh như tập dưỡng sinh buổi sáng vậy! 👵",
    "Đấu với ta là sai lầm lớn nhất đời bạn! 💀",
    "Sức mạnh này... Cảm giác thật vô đối! 🌌",
    "Né đòn đỉnh cao, không trúng một vết xước! 🛡️",
    "Bạn chỉ là một quân tốt thí trên bàn cờ thôi! ♟️",
    "Một phát Nhất Kiếm Tất Sát tiễn bạn lên đường! 🗡️",
    "Hào quang nhân vật chính phát sáng chói lòa! ✨",
    "Hôm nay ai cho bạn gan gạ kèo sinh tử với ta? 🌋",
    "Không cần vũ khí, nắm đấm này là đủ rồi! 👊",
    "Vừa ngủ vừa đánh cũng thắng được bạn! 💤",
    "Đừng khóc nhè khi bị ta hất tung lên trời nhé! 😭",
    "Tuyệt vọng đi! Đối thủ của bạn là thần thánh! ⛩️",
    "Thần linh cũng không cứu được bạn trận này! 🌌",
    "Bao nhiêu người như bạn cũng chỉ làm nền thôi! 🎞️",
    "Chuẩn bị nếm mùi vị của nỗi đau tột cùng! 🩸",
    "Chiến thắng đã được định đoạt từ lúc bắt đầu! 👑",
    "Xem ta biểu diễn nghệ thuật bạo lực đây! 🎬"
];

window.MAPS = [
    { id: "cyberpunk", sky: "#1e272e", bg1: "#2f3640", bg2: "#353b48", ground: "#111", line: "#ff4757", weather: "rain" },
    { id: "blood_moon", sky: "#2c0000", bg1: "#4a0000", bg2: "#1a0000", ground: "#0a0000", line: "#ff0000", weather: "ash" },
    { id: "frozen_peak", sky: "#2c3e50", bg1: "#bdc3c7", bg2: "#95a5a6", ground: "#ecf0f1", line: "#3498db", weather: "snow" },
    { id: "toxic_zone", sky: "#0b1c0b", bg1: "#1b301b", bg2: "#27ae60", ground: "#0a120a", line: "#2ecc71", weather: "toxic" },
    { id: "golden_dojo", sky: "#8e44ad", bg1: "#d35400", bg2: "#e67e22", ground: "#2c3e50", line: "#f1c40f", weather: "petals" }
];

window.classStats = {
    "dausi": { className: "Đấu Sĩ MMA", hp: 1500, speed: 6, dmgMod: 1.5, color: "#ff4757", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=dausi&backgroundColor=ffdfbf" },
    "satthu": { className: "Sát Thủ", hp: 1000, speed: 8, dmgMod: 2.0, color: "#2ed573", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=satthu&backgroundColor=ffdfbf",
        skill: {
            actionCode2: function(caster, target, ctx) {
                if(!target) return; let behindX = target.x + (target.isFacingRight ? -50 : 50);
                ctx.teleport(caster, behindX, target.y); caster.isFacingRight = target.x > caster.x; 
                caster.state = 'spinning_backfist'; caster.attackTimer = 15;
                ctx.takeDamage(target, 80 * caster.dmgMod, "#2ed573", true);
                ctx.floatingTexts.push({ x: target.x, y: target.y - 70, text: "BÁM SÁT!", color: "#2ed573", alpha: 1, vx: 0, vy: -2, font: "bold 24px Arial", life: 40 });
            }
        }
    },
    "phapsu": { className: "Pháp Sư", hp: 800, speed: 4, dmgMod: 2.5, color: "#9b59b6", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=phapsu&backgroundColor=ffdfbf",
        skill: {
            actionCode1: function(caster, target, ctx) {
                caster.state = 'cast'; caster.attackTimer = 20; caster.vx = caster.isFacingRight ? -8 : 8; 
                ctx.playSound(600, 'sine', 0.2, 0.5);
                let bulletVx = caster.isFacingRight ? 12 : -12;
                ctx.spawnProjectile(caster.x, caster.y - 40, bulletVx, 0, 12, "#9b59b6", 45 * caster.dmgMod, target);
            },
            actionCode3: function(caster, target, ctx) {
                caster.state = 'cast'; caster.attackTimer = 40; ctx.shakeScreen(30, 15); ctx.playSound(100, 'sawtooth', 0.8, 0.8);
                window.enemies.forEach(e => { ctx.spawnProjectile(e.x, -50, 0, 20, 15, "#f1c40f", 100 * caster.dmgMod, e); });
            }
        }
    },
    "hove": { className: "Hộ Vệ", hp: 2500, speed: 3, dmgMod: 1.0, color: "#e67e22", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=hove&backgroundColor=ffdfbf",
        skill: {
            actionCode2: function(caster, target, ctx) {
                caster.state = 'block'; caster.attackTimer = 30; ctx.setInvulnerable(caster, 60); 
                let healAmount = Math.floor(caster.maxHp * 0.2); caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
                ctx.playSound(300, 'sine', 0.5, 0.5); ctx.spawnParticles(caster.x, caster.y, "#e67e22", true);
                ctx.floatingTexts.push({ x: caster.x, y: caster.y - 80, text: `+${healAmount} 💚`, color: "#2ecc71", alpha: 1, vx: 0, vy: -3, font: "900 28px Arial", life: 50 });
            }
        }
    },
    "thichkhach": { className: "Thích Khách", hp: 1200, speed: 7, dmgMod: 1.8, color: "#dfe4ea", avatarUrl: "https://api.dicebear.com/7.x/adventurer/png?seed=thichkhach&backgroundColor=ffdfbf" }
};

window.GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXYZ_ABC_123/pub?gid=0&single=true&output=csv";

window.assignDrawMethods = function(statsObj) {
    let drawBaseLimb = function(ctx, p, bounce, ext, pext, isTrail) {
        let head = {x: 0, y: -60 + bounce}; let neck = {x: 0, y: -45 + bounce}; let pelvis = {x: 0, y: -20 + bounce};
        let footL = {x: -15, y: 0}; let kneeL = {x: -10, y: -10 + bounce}; let footR = {x: 15, y: 0}; let kneeR = {x: 10, y: -10 + bounce};
        let handL = {x: -15, y: -35 + bounce}; let elbowL = {x: -10, y: -25 + bounce}; let handR = {x: 15, y: -40 + bounce}; let elbowR = {x: 5, y: -30 + bounce};
        if (!p.onGround && p.state !== 'hurt' && p.state !== 'kick' && p.state !== 'punch') { footL = {x: -12, y: -15}; kneeL = {x: -10, y: -25}; footR = {x: 12, y: -20}; kneeR = {x: 10, y: -30}; handL = {x: -25, y: -45}; elbowL = {x: -15, y: -35}; handR = {x: 25, y: -50}; elbowR = {x: 15, y: -40}; head.y -= 5; }
        if (p.state === 'hurt') { head.x = -20; neck.x = -15; pelvis.x = -5; handL = {x: -25, y: -55}; handR = {x: -10, y: -60}; elbowL = {x: -20, y: -35}; elbowR = {x: 0, y: -40}; footL.x = -15; footR.x = 25; } else if (p.state === 'block') { handR = {x: 10, y: -55 + bounce}; elbowR = {x: 15, y: -35 + bounce}; handL = {x: 0, y: -55 + bounce}; elbowL = {x: -10, y: -35 + bounce}; } else if (p.state === 'punch') { head.x = (10+pext/2) * ext; neck.x = (8+pext/2) * ext; pelvis.x = (4+pext/2) * ext; handR = {x: 15 + (40+pext) * ext, y: -40 + bounce}; elbowR = {x: 10 + (20+pext/2) * ext, y: -35 + bounce}; handL = {x: -10, y: -40 + bounce}; } else if (p.state === 'kick') { head.x = -15 * ext; neck.x = -10 * ext; pelvis.x = -5 * ext; footR = {x: 15 + 45 * ext, y: -10 + bounce}; kneeR = {x: 10 + 20 * ext, y: -15 + bounce}; footL = {x: -15, y: 0}; kneeL = {x: -10, y: -10}; handR = {x: -10 * ext, y: -40}; handL = {x: -30 * ext, y: -35}; } else if (p.state === 'dash') { head.x = 25; head.y = -45; neck.x = 15; neck.y = -35; pelvis.x = 0; pelvis.y = -20; handR = {x: 35, y: -25}; elbowR = {x: 20, y: -25}; handL = {x: 5, y: -25}; elbowL = {x: 10, y: -25}; footR = {x: 15, y: -10}; kneeR = {x: 15, y: -15}; footL = {x: -30, y: -5}; kneeL = {x: -15, y: -10}; } else if (p.state === 'dash_back') { head.x = -15; head.y = -50; neck.x = -10; neck.y = -40; pelvis.x = 5; pelvis.y = -20; handR = {x: 15, y: -45}; elbowR = {x: 5, y: -35}; handL = {x: -5, y: -45}; elbowL = {x: -15, y: -35}; footR = {x: 20, y: 0}; kneeR = {x: 15, y: -10}; footL = {x: -15, y: -5}; kneeL = {x: 5, y: -15}; } else if (p.state === 'cast') { head.x = 0; head.y = -65 + bounce; handL = {x: -25, y: -75}; handR = {x: 25, y: -75}; elbowL = {x: -15, y: -45}; elbowR = {x: 15, y: -45}; footL.x = -25; footR.x = 25; }
        return { head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR };
    };

    for (let id in statsObj) {
        let type = id.trim().toLowerCase();
        statsObj[id].drawMethod = function(ctx, p, bounce, ext, pext, isTrail) {
            let pts = drawBaseLimb(ctx, p, bounce, ext, pext, isTrail);
            let {head, neck, pelvis, footL, kneeL, footR, kneeR, handL, elbowL, handR, elbowR} = pts;
            const drawLimb = (start, mid, end) => { ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke(); };
            
            if (type === 'phapsu' && !isTrail) { ctx.strokeStyle = "rgba(155, 89, 182, 0.4)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x - 12, pelvis.y + 10); ctx.stroke(); }
            if (type === 'thichkhach' && !isTrail) { ctx.strokeStyle = "rgba(241, 196, 15, 0.4)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(neck.x - 25, neck.y + 15 + Math.sin(Date.now()/120)*4); ctx.stroke(); }
            
            ctx.strokeStyle = "#fff"; ctx.lineWidth = (type === 'hove') ? 6 : 5;
            ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.lineTo(pelvis.x, pelvis.y); ctx.stroke();
            drawLimb(pelvis, kneeL, footL); drawLimb(pelvis, kneeR, footR); drawLimb(neck, elbowL, handL); drawLimb(neck, elbowR, handR);
            ctx.beginPath(); ctx.arc(head.x, head.y, (type === 'hove') ? 11 : 10, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill(); ctx.stroke();
            
            if (type === 'dausi') {
                if (!isTrail) { ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(head.x - 10, head.y); ctx.lineTo(head.x - 22, head.y + 5 + Math.sin(Date.now()/150)*3); ctx.moveTo(head.x - 10, head.y + 2); ctx.lineTo(head.x - 18, head.y + 12 + Math.cos(Date.now()/150)*2); ctx.stroke(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; }
                ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#ff9f43"; ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(handL.x, handL.y, 8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 8, 0, Math.PI*2); ctx.fill();
            } else if (type === 'satthu') {
                ctx.strokeStyle = "#2ed573"; ctx.lineWidth = 3; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#2ed573"; ctx.beginPath(); ctx.moveTo(handL.x, handL.y); ctx.lineTo(handL.x - 15, handL.y + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 18, handR.y - 5); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'phapsu') {
                ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x - 5, handR.y + 25); ctx.lineTo(handR.x + 8, handR.y - 30); ctx.stroke(); ctx.fillStyle = "#9b59b6"; ctx.shadowBlur = isTrail ? 0 : 12; ctx.shadowColor = "#9b59b6"; ctx.beginPath(); ctx.arc(handR.x + 8, handR.y - 32, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'hove') {
                if(!isTrail) { ctx.save(); ctx.translate(handL.x, handL.y); ctx.fillStyle = "#57606f"; ctx.strokeStyle = "#f1c40f"; ctx.lineWidth = 2; ctx.fillRect(-8, -20, 16, 40); ctx.strokeRect(-8, -20, 16, 40); ctx.restore(); }
                ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 15, handR.y - 15); ctx.stroke(); ctx.fillStyle = "#57606f"; ctx.beginPath(); ctx.arc(handR.x + 15, handR.y - 15, 5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'thichkhach') {
                ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 2; ctx.shadowBlur = isTrail ? 0 : 8; ctx.shadowColor = "#fff"; ctx.beginPath(); ctx.moveTo(handR.x, handR.y); ctx.lineTo(handR.x + 30, handR.y - 12); ctx.stroke();
                ctx.shadowBlur = 0; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(handL.x, handL.y, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(handR.x, handR.y, 5, 0, Math.PI*2); ctx.fill();
            }
            if (p.state === 'kick') { ctx.beginPath(); ctx.arc(footR.x, footR.y, 5, 0, Math.PI*2); ctx.fill(); }
        };
    }
}

window.initGame = async function() {
    try {
        let response = await fetch(window.GOOGLE_SHEET_URL);
        if(response.ok) {
            let csvText = await response.text(); let rows = csvText.split('\n');
            for (let i = 1; i < rows.length; i++) {
                let rowText = rows[i] ? rows[i].trim() : ""; if (rowText === "") continue;
                let cols = rowText.split(','); let id = cols[0] ? cols[0].trim().toLowerCase() : "";
                if (id !== "" && window.classStats[id]) {
                    if (cols[1] && cols[1].trim() !== "") window.classStats[id].className = cols[1].trim();
                    for(let c=2; c<cols.length; c++) { if (cols[c] && cols[c].includes("http")) { window.classStats[id].avatarUrl = cols[c].trim().replace(/\r/g, ''); break; } }
                }
            }
        }
    } catch(e) {}
    window.assignDrawMethods(window.classStats); window.renderCharacterGrid(); 
}

window.renderCharacterGrid = function() {
    const carousel = document.getElementById("character-carousel"); if(!carousel) return; carousel.innerHTML = ""; let firstCardId = null;
    for (let id in window.classStats) {
        let item = window.classStats[id]; let card = document.createElement("div"); card.className = "char-card"; 
        card.innerHTML = `<div class="char-avatar"><img src="${item.avatarUrl}"></div><div class="char-name">${item.className}</div>`;
        card.onclick = () => { 
            window.selectedRedClass = id; document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); 
            let desc = document.getElementById("desc-red");
            if(desc) desc.innerHTML = `<span>❤️ Máu: <strong>${item.hp}</strong></span><span>💨 Tốc: <strong>${(item.speed/3).toFixed(1)}</strong></span><span>⚔️ Công: <strong>x${item.dmgMod}</strong></span>`; 
        };
        carousel.appendChild(card); if (!firstCardId) { firstCardId = id; }
    }
    if(!window.selectedRedClass && firstCardId) { let firstCard = carousel.querySelector(`.char-card`); if(firstCard) firstCard.click(); }
}

window.startGame = function() { 
    if(!window.selectedRedClass) return; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "none"; 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "block"; 
    if(typeof window.matchStart === 'function') window.matchStart(); 
    if (!window.isLoopRunning) { window.isLoopRunning = true; requestAnimationFrame(window.gameLoop); } 
}

window.backToMenu = function() { 
    let game = document.getElementById("game-screen"); if(game) game.style.display = "none"; 
    let sel = document.getElementById("selection-screen"); if(sel) sel.style.display = "block"; 
    window.gameOver = true; window.isLoopRunning = false; if(typeof window.updateHPUIs === 'function') window.updateHPUIs(); 
}

window.matchStart = function() {
    try {
        let allKeys = Object.keys(window.classStats || {}); if(allKeys.length === 0) return; 
        if (!window.selectedRedClass || !window.classStats[window.selectedRedClass]) { window.selectedRedClass = allKeys[0]; }
        let s1 = window.classStats[window.selectedRedClass];
        
        let nr = document.getElementById("name-display-red"); if(nr) nr.innerText = `👤`; 
        let enemyCountEl = document.getElementById("enemy-count-select");
        let selectedMode = enemyCountEl ? parseInt(enemyCountEl.value) : 1; if(isNaN(selectedMode)) selectedMode = 1;
        let isBossMode = (selectedMode === 99);
        window.rewardMultiplier = isBossMode ? 15 : selectedMode;
        let actualEnemiesCount = isBossMode ? 1 : selectedMode;
        let btnExit = document.querySelector(".control-btns .game-btn");
        if (btnExit) { btnExit.innerText = "🔙"; btnExit.style.background = "#2f3542"; btnExit.style.boxShadow = "none"; btnExit.style.transform = "none"; }

        // BỐC THĂM BẢN ĐỒ VÀ THỜI TIẾT NGẪU NHIÊN
        window.currentMap = window.MAPS[Math.floor(Math.random() * window.MAPS.length)];
        window.currentWeather = window.currentMap.weather;

        // BỐC THĂM TƯ THẾ INTRO (MÚA VÕ/NHẢY) CHO 2 BÊN
        let introPoses = ['punch', 'kick', 'block', 'cast'];
        let p1Pose = introPoses[Math.floor(Math.random() * introPoses.length)];
        let p2Pose = introPoses[Math.floor(Math.random() * introPoses.length)];

        window.p1 = { 
            id: "player", classId: window.selectedRedClass, isPlayer: true, x: 100, y: window.GROUND_Y, vx: 0, vy: 0, 
            speed: s1.speed, color: s1.color, hp: s1.hp, maxHp: s1.hp, dmgMod: s1.dmgMod, scale: 1,
            onGround: true, isFacingRight: true, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
            drawMethod: s1.drawMethod, skill: s1.skill || {}, regen: 0.4, shield: 0, buffs: [], iFrames: 0, aiDelay: 0, comboHits: 0, comboTimeout: 0, 
            critChance: 0.25, critMult: 1.5, className: s1.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false, killCount: 0,
            taunt: window.TAUNT_POOL[Math.floor(Math.random() * window.TAUNT_POOL.length)],
            introState: p1Pose // Lưu tư thế chào sân
        };

        window.enemies = []; window.totalEnemyMaxHp = 0;
        for(let i = 0; i < actualEnemiesCount; i++) {
            let blueClass = allKeys[Math.floor(Math.random() * allKeys.length)]; let s2 = window.classStats[blueClass];
            let hpMultiplier = (actualEnemiesCount > 1) ? 0.5 : 1.0; if(isBossMode) hpMultiplier = 10.0;
            let eHp = Math.floor(s2.hp * hpMultiplier); window.totalEnemyMaxHp += eHp;
            window.enemies.push({ 
                id: "enemy_" + i, classId: blueClass, isPlayer: false, x: 400 + (i * 80) + Math.random() * 40, y: window.GROUND_Y, vx: 0, vy: 0, 
                speed: s2.speed * (isBossMode ? 0.7 : (0.8 + Math.random()*0.4)), color: isBossMode ? "#e74c3c" : "#1e90ff", 
                hp: eHp, maxHp: eHp, dmgMod: s2.dmgMod * (isBossMode ? 2.5 : hpMultiplier), scale: isBossMode ? 2.2 : 1, isDragon: isBossMode,
                onGround: true, isFacingRight: false, state: 'idle', attackTimer: 0, hitStun: 0, stamina: 0, comboStep: 0, comboTimer: 0, dashTimer: 0, dashDir: 0, 
                drawMethod: s2.drawMethod, skill: s2.skill || {}, regen: 0.3, shield: 0, buffs: [], iFrames: 0, aiDelay: Math.floor(Math.random() * 20), comboHits: 0, comboTimeout: 0, 
                critChance: 0.1, critMult: 1.5, className: s2.className, isRage: false, shieldBreak: 100, isGuardBroken: false, stunTimer: 0, maxStunTimer: 180, superArmor: 0, isExhausted: false,
                taunt: isBossMode ? "🐉 GÀO THÉT: BOSS THỨC TỈNH!!" : window.TAUNT_POOL[Math.floor(Math.random() * window.TAUNT_POOL.length)],
                introState: p2Pose // Lưu tư thế chào sân của bot
            });
        }
        
        let nb = document.getElementById("name-display-blue");
        if(nb) nb.innerText = isBossMode ? `🐉` : ((actualEnemiesCount > 1) ? `🤖 x${window.enemies.length}` : `🤖`);
        
        window.floatingTexts = []; window.particles = []; window.projectiles = []; window.traps = []; window.slashes = []; window.shockwaves = []; window.impactSparks = [];
        window.shakeTime = 0; window.hitStopFrames = 0; window.cinematicTimer = 0; window.cinematicCaster = null; window.cinematicCallback = null; window.currentZoom = 1; window.targetZoom = 1;
        window.camX = 0; window.screenFlash = 0; window.slowMoTimer = 0; window.uiShakeP1 = 0; window.uiShakeP2 = 0; window.matchResolved = false; window.gameOver = false; window.introTimer = 160; window.matchTimer = 0;
        
        window.weatherParticles = []; 
        let ptCount = (window.currentWeather === 'none') ? 0 : 150;
        for(let i=0; i<ptCount; i++) { 
            window.weatherParticles.push({ 
                x: Math.random() * 1200 - 300, y: Math.random() * 400, 
                speed: (window.currentWeather === 'rain') ? 12 + Math.random() * 10 : 2 + Math.random() * 3,
                size: Math.random() * 3 + 1, ang: Math.random() * Math.PI * 2
            }); 
        }
        
        if(typeof window.updateHPUIs === 'function') window.updateHPUIs();

        if (!window.attackBound) {
            window.attackBound = true;
            let triggerAttack = function(e) { 
                let gScreen = document.getElementById("game-screen"); if (!gScreen || gScreen.style.display === "none") return;
                if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || (e.target.closest && e.target.closest('.control-btns')))) return;
                e.preventDefault(); 
                if (!window.gameOver && window.p1 && window.introTimer <= 0 && window.p1.attackTimer === 0 && window.p1.hitStun === 0 && window.p1.stunTimer === 0) {
                    if (window.p1.comboTimeout > 0 && window.p1.comboStep < 14) { window.p1.comboStep++; } else { window.p1.comboStep = 0; }
                    window.p1.comboTimeout = 60; if(typeof window.attack === 'function') window.attack(window.p1, window.enemies); 
                }
            };
            window.addEventListener('touchstart', triggerAttack, {passive: false});
            window.addEventListener('mousedown', triggerAttack);
        }
    } catch(e) { console.error("Lỗi:", e); }
}

window.checkGameOver = function() {
    if (window.matchResolved) return; let allDead = window.enemies.length === 0 || window.enemies.every(e => e.hp <= 0);
    if (window.p1 && (window.p1.hp <= 0 || allDead)) {
        window.matchResolved = true; window.gameOver = true; 
        if (typeof window.triggerVibration === 'function') window.triggerVibration([100, 50, 100]);
        let btnExit = document.querySelector(".control-btns .game-btn"); 
        if (btnExit) { btnExit.innerText = "⏭️"; btnExit.style.background = "#2ed573"; btnExit.style.boxShadow = "0 0 10px #2ed573"; btnExit.style.transform = "scale(1.1)"; }
    }
}

window.updateHPUIs = function() {
    if (!window.p1) return; let p1Pct = (window.p1.hp / window.p1.maxHp * 100) + "%"; let currentEnemyHp = 0; window.enemies.forEach(e => currentEnemyHp += e.hp); let p2Pct = window.totalEnemyMaxHp > 0 ? (currentEnemyHp / window.totalEnemyMaxHp * 100) + "%" : "0%";
    let h1 = document.getElementById("hp-red"), h2 = document.getElementById("hp-red-trail"), h3 = document.getElementById("hp-blue"), h4 = document.getElementById("hp-blue-trail"), h5 = document.getElementById("stamina-red"), h6 = document.getElementById("stun-red");
    if(h1) h1.style.width = p1Pct; if(h2) h2.style.width = p1Pct; if(h3) h3.style.width = p2Pct; if(h4) h4.style.width = p2Pct; if(h5) h5.style.width = window.p1.stamina + "%"; if(h6) h6.style.width = window.p1.shieldBreak + "%";
    if(typeof window.getClosestEnemy === 'function') {
        let closestEnemy = window.getClosestEnemy(window.p1, window.enemies); if(closestEnemy) { let sb = document.getElementById("stamina-blue"), stb = document.getElementById("stun-blue"); if(sb) sb.style.width = closestEnemy.stamina + "%"; if(stb) stb.style.width = closestEnemy.shieldBreak + "%"; }
    }
    window.checkGameOver(); 
}

window.gameLoop = function(timestamp) { 
    if (!window.isLoopRunning) return; requestAnimationFrame(window.gameLoop); 
    if (!timestamp) timestamp = 0; let deltaTime = timestamp - window.lastFrameTime; 
    if (deltaTime >= window.FRAME_MIN_TIME) { window.lastFrameTime = timestamp - (deltaTime % window.FRAME_MIN_TIME); 
        try { if(typeof window.update === 'function') window.update(); } catch(e) { } 
        try { if(typeof window.draw === 'function') window.draw(); } catch(e) { } 
    } 
}
