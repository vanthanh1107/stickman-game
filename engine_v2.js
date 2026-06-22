// ==========================================
// HỆ THỐNG VÕ THUẬT TỔNG HỢP MMA (DÁN XUỐNG DƯỚI CÙNG ENGINE_V2.JS)
// ==========================================

window.attack = function(attacker, targetGroup) {
    if (!attacker || attacker.hp <= 0) return;
    
    // Tìm mục tiêu gần nhất
    let target = window.getClosestEnemy(attacker, targetGroup);
    if (!target || target.hp <= 0) {
        attacker.state = 'jab'; attacker.attackTimer = 10;
        return;
    }

    let MathDist = Math.abs(attacker.x - target.x);
    let reach = 85 * (attacker.scale || 1); // Tầm đánh
    
    // Quay mặt về phía đối thủ
    attacker.isFacingRight = target.x > attacker.x;
    
    // ------------------------------------------
    // TỪ ĐIỂN ĐÒN ĐÁNH MMA THEO CỰ LY
    // ------------------------------------------
    let moves_Close = ['hook', 'elbow_strike', 'uppercut', 'knee_strike', 'backfist']; // Cận chiến (Chỏ, Gối, Móc)
    let moves_Mid = ['jab', 'cross', 'low_kick', 'axe_kick', 'palm_strike'];        // Tầm trung (Đấm thẳng, Đá tạt)
    let moves_Far = ['teep_kick', 'high_kick', 'spinning_heel', 'shoulder_bash'];   // Tầm xa (Đá vòng cầu, Đạp trước)
    let moves_Finisher = ['dragon_uppercut', 'asura_strike', 'dempsey_roll', 'one_inch_punch']; // Tuyệt Kỹ

    let selectedMove = 'jab';
    let isFinisher = false;
    let isCrit = false;

    // AI Quyết định Đòn đánh theo chuỗi Combo
    if (attacker.comboStep >= 4 || Math.random() < 0.15) {
        selectedMove = moves_Finisher[Math.floor(Math.random() * moves_Finisher.length)];
        isFinisher = true;
        attacker.comboStep = 0; // Xả xong tuyệt kỹ thì reset chuỗi
    } else {
        if (MathDist < 55) { selectedMove = moves_Close[Math.floor(Math.random() * moves_Close.length)]; }
        else if (MathDist < 90) { selectedMove = moves_Mid[Math.floor(Math.random() * moves_Mid.length)]; }
        else { selectedMove = moves_Far[Math.floor(Math.random() * moves_Far.length)]; }
    }

    // Nếu đứng quá xa, tự động Lướt (Dash) vào áp sát nhồi combo
    if (MathDist > reach && !isFinisher) {
        attacker.vx = (attacker.isFacingRight ? 1 : -1) * attacker.currentSpeed * 3;
        attacker.state = 'dash';
        attacker.attackTimer = 12;
        window.spawnDust(attacker.x, attacker.y);
        return;
    }

    // Thực thi Động tác đấm đá
    attacker.state = selectedMove;
    attacker.attackTimer = isFinisher ? 30 : 18;
    
    // Nhào người tới phía trước theo lực đòn đánh
    attacker.vx = (attacker.isFacingRight ? 1 : -1) * (isFinisher ? 5 : 1.5); 

    // ------------------------------------------
    // XỬ LÝ SÁT THƯƠNG HIỂM HÓC
    // ------------------------------------------
    let baseDmg = 12 * attacker.currentDmgMod;
    let finalDmg = baseDmg;
    let slashAngle = (Math.random() - 0.5) * Math.PI;

    if (isFinisher) {
        // ĐÒN KẾT LIỄU: Sát thương x3.5, Rung camera, Hất tung kẻ địch lên trời
        isCrit = true;
        finalDmg = baseDmg * 3.5;
        window.playSound(200, 'square', 0.5, 1.0, true);
        window.shakeScreen(15, 12);
        
        // Hất văng (Air Juggling)
        target.vy = -14; 
        target.vx = (attacker.isFacingRight ? 8 : -8);
        target.onGround = false;
        target.state = 'hurt';
        target.hitStun = 45;
        
        window.spawnParticles(target.x, target.y - 40, "#ff4757", true);
        window.floatingTexts.push({ x: target.x, y: target.y - 80, text: "💥 K.O STRIKE!", color: "#ff4757", alpha: 1, vx: (Math.random()-0.5)*2, vy: -4, font: "900 35px Arial", life: 50 });
        slashAngle = -Math.PI / 2; // Vết chém dọc hất lên
        
    } else {
        // Tỉ lệ Chí Mạng ngẫu nhiên
        if (Math.random() < attacker.critChance) {
            isCrit = true;
            finalDmg = baseDmg * attacker.critMult;
            window.playSound(250, 'sine', 0.2, 0.8, true);
            window.shakeScreen(6, 5);
            window.floatingTexts.push({ x: target.x + (Math.random()*40-20), y: target.y - 60, text: "CRITICAL!", color: "#f1c40f", alpha: 1, vx: 0, vy: -2, font: "italic 900 20px Arial", life: 30 });
        } else {
            window.playSound(180, 'sine', 0.15, 0.5, false);
        }
        
        // ĐÒN HIỂM: Phá Trụ (Low Kick / Teep Kick) làm đối thủ bị khựng
        if ((selectedMove === 'low_kick' || selectedMove === 'teep_kick') && Math.random() < 0.4) {
            target.stunTimer = 35; // Khóa cứng 35 khung hình
            target.state = 'stunned';
            window.playSound(120, 'square', 0.3, 0.7, true);
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🦵 PHÁ TRỤ!", color: "#e67e22", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 40 });
            slashAngle = Math.PI / 4;
        }
        
        // ĐÒN HIỂM: Móc Cằm / Chỏ (Uppercut / Elbow) gây hiệu ứng chảy máu (Bleed)
        if ((selectedMove === 'uppercut' || selectedMove === 'elbow_strike') && Math.random() < 0.3) {
            finalDmg *= 1.5;
            window.spawnParticles(target.x, target.y - 60, "#c0392b", true); // Máu đỏ văng ra
            window.floatingTexts.push({ x: target.x, y: target.y - 50, text: "🩸 HIỂM HÓC!", color: "#c0392b", alpha: 1, vx: 0, vy: -1, font: "900 24px Arial", life: 40 });
            slashAngle = -Math.PI / 3;
        }

        // Đẩy lùi địch nhẹ
        target.vx = (attacker.isFacingRight ? 2 : -2);
        target.hitStun = 15;
        target.state = 'hurt';
    }

    // ------------------------------------------
    // GÂY SÁT THƯƠNG VÀ VẼ HIỆU ỨNG
    // ------------------------------------------
    if (typeof window.takeDamage === 'function') {
        window.takeDamage(target, Math.floor(finalDmg), isCrit ? "#ff4757" : "#fff", isCrit, false);
    }
    
    // Tích điểm Combo
    attacker.comboHits = (attacker.comboHits || 0) + 1;
    
    // Vẽ vệt chém dứt khoát
    window.spawnSlash(target.x, target.y - 35, attacker.isFacingRight, isCrit ? "#ff4757" : "#ecf0f1", isCrit, isFinisher ? 1.8 : 1.2, slashAngle);
};
