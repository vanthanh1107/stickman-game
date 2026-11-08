/**
 * BUILD_STORY_VOICES.JS
 * Tải & đóng gói sẵn toàn bộ giọng đọc Chị Google Tiếng Việt (phân tách theo từng vế cảm xúc ! ? ,)
 * kèm KHO TÊN RIÊNG ĐỘNG (LOCAL_STORY_ENEMY_NAME_MAP) của cả 19 nhân vật vào `character/story_voice_data.js`.
 * - Đảm bảo 100% có giọng đọc trong Video tải về từ Recorder (kể cả khi mở file:// hoặc Offline).
 * - Đọc ĐÍCH DANH TÊN NHÂN VẬT ĐỐI THỦ ngay tại vị trí {enemy} trong từng câu thoại (không bao giờ gọi chung chung là "đối thủ").
 * - Ngắt nhịp theo từng vế cảm xúc giúp giọng đọc có hồn, lên giọng câu hỏi (?) và gằn giọng câu cảm thán (!).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

const ROOT = __dirname;
const CHAR_DIR = path.join(ROOT, 'character');
const ENGINE_FILE = path.join(ROOT, 'engine_core_v25.js');
const OUT_FILE = path.join(CHAR_DIR, 'story_voice_data.js');

// Dùng để khôi phục cache từ file story_voice_data.js cũ (nếu có)
const OLD_VOCATIVE_MAP = {
    phuonghang: 'cưng',
    domixi: 'bạn hiền',
    donaldtrump: 'cậu',
    elonmusk: 'đối thủ',
    billgates: 'cậu em',
    stevejobs: 'đối thủ',
    muoikho: 'con',
    jonny: 'chú em',
    mtp: 'em',
    ronaldo: 'đối thủ',
    messi: 'đối thủ',
    mbappe: 'đối thủ',
    haaland: 'đối thủ',
    neymar: 'đối thủ',
    lamineyamal: 'tiền bối',
    vozinha: 'chú',
    spiderman: 'đối thủ',
    therock: 'đối thủ',
    nguyenvanhien: 'bạn'
};

const OLD_PHONETIC_CHAR_NAMES = {
    ronaldo: 'Rô Nan Đô',
    messi: 'Lê Ô Nen Mét Xi',
    domixi: 'Tộc Trưởng Độ Mi Xi',
    phuonghang: 'Bà Phương Hằng',
    mtp: 'Sơn Tùng Em Ti Pi',
    elonmusk: 'I Lon Mắc',
    billgates: 'Tỷ Phú Biu Ghết',
    donaldtrump: 'Tổng Thống Đô Nan Trăm',
    haaland: 'Ơ Linh Haa Lan',
    mbappe: 'Mờ Bắp Pê',
    lamineyamal: 'La Min Gia Man',
    neymar: 'Nây Ma',
    jonny: 'Giôn Ni Trí Nguyễn',
    muoikho: 'Ông Mười Khó',
    spiderman: 'Người Nhện',
    stevejobs: 'Sờ Típ Gióp',
    therock: 'Đờ Rốc',
    vozinha: 'Rô Nan Đô Con',
    nguyenvanhien: 'Anh Hiến Nhựa Hắt Đê Pê E'
};

// Tên đọc tự nhiên khi ghép trực tiếp vào vị trí {enemy} trong câu thoại của 19 nhân vật
const PHONETIC_CHAR_NAMES = {
    ronaldo: 'Rô Nan Đô',
    messi: 'Mét Xi',
    domixi: 'Độ Mi Xi',
    phuonghang: 'Bà Phương Hằng',
    mtp: 'Sơn Tùng Em Ti Pi',
    elonmusk: 'I Lon Mắc',
    billgates: 'Biu Ghết',
    donaldtrump: 'Đô Nan Trăm',
    haaland: 'Haa Lan',
    mbappe: 'Mờ Bắp Pê',
    lamineyamal: 'La Min Gia Man',
    neymar: 'Nây Ma',
    jonny: 'Giôn Ni Trí Nguyễn',
    muoikho: 'Mười Khó',
    spiderman: 'Người Nhện',
    stevejobs: 'Sờ Típ Gióp',
    therock: 'Đờ Rốc',
    vozinha: 'Rô Nan Đô Con',
    nguyenvanhien: 'Nguyễn Văn Hiến'
};

function humanizeTextForSoulfulSpeech(rawText, speakerId, explicitEnemyName) {
    if (!rawText) return '';
    let s = String(rawText);

    if (explicitEnemyName) {
        s = s.replace(/\b(anh|em|cô|chú|ông|bà|ngài|bố|con|tiền bối|tộc trưởng|tổng thống)\s+\{enemy\}/gi, '$1 ' + explicitEnemyName);
        s = s.replace(/\{enemy\}|\{opp\}|\{target\}/gi, explicitEnemyName);
    } else {
        let voc = OLD_VOCATIVE_MAP[String(speakerId || '').toLowerCase()] || 'đối thủ';
        s = s.replace(/\b(chú hề|thằng ranh|thằng|kẻ thất bại thảm hại)\s+\{enemy\}/gi, '$1 này');
        s = s.replace(/\b(anh|em|cô|chú|ông|bà|ngài|bố|con|con trai|tiền bối|tộc trưởng|tổng thống|ông già)\s+\{enemy\}/gi, '$1');
        s = s.replace(/\{enemy\}|\{opp\}|\{target\}/gi, voc);
    }

    s = s
        .replace(/\*BÙM!\*/gi, 'Bùm!')
        .replace(/\*VINE BOOM CHẤN ĐỘNG!\*/gi, 'Vai Bum chấn động!')
        .replace(/[\u{1F000}-\u{1FFFF}\u{2300}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]+/gu, ' ')
        .replace(/[•|_*#~^`<>[\]{}"']/g, ' ');

    s = s
        .replace(/Qué mirás,\s*bobo\??/gi, 'Nhìn cái gì mà nhìn hả thằng ngốc?')
        .replace(/Stay humble,\s*eh!?/gi, 'Khiêm tốn lại đi bạn ơi!')
        .replace(/Gonna cry\??/gi, 'Định khóc nhè đấy à?')
        .replace(/ONE MORE THING!?/gi, 'Và còn một điều đặc biệt nữa!')
        .replace(/MAKE STICKMAN GREAT AGAIN!?/gi, 'Mếch Sờ Tích Men Grết Ơ Ghen!')
        .replace(/FAKE NEWS/gi, 'Phếch Niu')
        .replace(/\bWRONG!\s*/gi, 'Sai hoàn toàn! ')
        .replace(/\bSad!\s*/gi, 'Đáng buồn thật! ')
        .replace(/Activate Windows/gi, 'Ắc Ti Vết Guyn Đâu')
        .replace(/Internet Explorer/gi, 'In Tơ Nét Ích Plo Rơ')
        .replace(/Shift\s*\+\s*Delete/gi, 'Síp Đi Lít')
        .replace(/Joga Bonito!?/gi, 'Vũ điệu sân cỏ!')
        .replace(/Top\s*1\s*Trending/gi, 'Tốp một thịnh hành')
        .replace(/3-0-4\s*Rocafonda/gi, 'Ba Không Bốn Rô Ca Phôn Đa')
        .replace(/Golden Boy/gi, 'Cậu Bé Vàng')
        .replace(/Mr\.\s*Champions\s*League/gi, 'Ông Vua Cúp Cê Một')
        .replace(/Champions\s*League/gi, 'Cúp Cê Một')
        .replace(/World\s*Cup/gi, 'Guôn Cúp')
        .replace(/Bicycle\s*Kick/gi, 'Xe Đạp Chổng Ngược')
        .replace(/Knuckleball/gi, 'sút phạt lắc bóng')
        .replace(/Vine\s*Boom/gi, 'Vai Bum')
        .replace(/Supercharger/gi, 'Siêu Sạc')
        .replace(/Cybertruck/gi, 'Sai Bơ Trắc')
        .replace(/Air\s*Force\s*One/gi, 'Chuyên cơ Tổng thống')
        .replace(/Iron\s*Man/gi, 'Ai Ơn Men')
        .replace(/AI\s*Grok/gi, 'Trí tuệ nhân tạo Grốc')
        .replace(/\bGrok\b/gi, 'Grốc')
        .replace(/\bSpaceX\b/gi, 'Spây Ích')
        .replace(/\bStarlink\b/gi, 'Sta Linh')
        .replace(/\bTesla\b/gi, 'Tét La')
        .replace(/\bForbes\b/gi, 'Phóp')
        .replace(/\bWindows\b/gi, 'Guyn Đâu')
        .replace(/\bKeynote\b/gi, 'ra mắt')
        .replace(/\biPhone\b/gi, 'Ai Phôn')
        .replace(/\bEuro\b/gi, 'Ơ Rô')
        .replace(/\bQatar\b/gi, 'Ca Ta')
        .replace(/\bSamba\b/gi, 'Sam Ba')
        .replace(/\bSky\s*Tour\b/gi, 'Skai Tua')
        .replace(/\bSky\b/gi, 'Sờ Kai')
        .replace(/\bCoca-?Cola\b/gi, 'Cô Ca Cô La')
        .replace(/\bAqua\b/gi, 'A Qua')
        .replace(/\bhãng nói chuyện\b/gi, 'hẵng nói chuyện')
        .replace(/\bMini\s+SIU+\b/gi, 'Mi Ni Siuuu')
        .replace(/\bSIU+\b/gi, 'Siuuu')
        .replace(/\bCR7\b/gi, 'Cê Rờ Bảy')
        .replace(/\bM-?TP\b/gi, 'Em Ti Pi')
        .replace(/\bHDPE\b/gi, 'Hắt Đê Pê E')
        .replace(/\bPN25\b/gi, 'Pê Nờ hai mươi lăm')
        .replace(/\bK\.?O\.?\b/gi, 'Nốc ao')
        .replace(/\b90\+3\b/g, 'chín mươi cộng ba')
        .replace(/\b7-8\s*triệu\b/gi, 'bảy đến tám triệu')
        .replace(/\b5m50\b/gi, 'năm mét năm mươi')
        .replace(/\b(\d+)m(\d+)\b/gi, '$1 mét $2')
        .replace(/\b(\d+)\s*km\/h\b/gi, '$1 ki lô mét trên giờ')
        .replace(/\b(\d+)\s*nhịp\/phút\b/gi, '$1 nhịp một phút')
        .replace(/\b0\.01\b/g, 'không chấm không một')
        .replace(/\b(\d+)\s*%\b/g, '$1 phần trăm')
        .replace(/\b2G\b/gi, 'hai Gờ')
        .replace(/\b1\s*HP\b/gi, 'một máu')
        .replace(/\bHP\b/gi, 'máu')
        .replace(/\bVAR\b/gi, 'Va')
        .replace(/\bGOAT\b/gi, 'Gốt')
        .replace(/\bC1\b/gi, 'Cê Một')
        .replace(/\bRAM\b/gi, 'Ram')
        .replace(/\bWin\b/gi, 'Guyn')
        .replace(/\bOut\s+trình\b/gi, 'ao trình')
        .replace(/\b500\s*IQ\b/gi, 'năm trăm Ai Kiu')
        .replace(/\b999\s*ms\b/gi, 'chín trăm chín mươi chín mi li giây')
        .replace(/\bsolo\b/gi, 'sô lô')
        .replace(/\bcombo\b/gi, 'com bô')
        .replace(/\blivestream\b/gi, 'lai chim')
        .replace(/\bstream\b/gi, 'lai chim')
        .replace(/\bdonate\b/gi, 'đô nết')
        .replace(/\bdemo\b/gi, 'bản thu thử')
        .replace(/\bBass\b/gi, 'Bát')
        .replace(/\bonline\b/gi, 'on lai')
        .replace(/\bbalo\b/gi, 'ba lô')
        .replace(/\bbye\b/gi, 'bai')
        .replace(/\btivi\b/gi, 'ti vi')
        .replace(/\bku\b/gi, 'cu')
        .replace(/\bacc\b/gi, 'ắc')
        .replace(/\blag\b/gi, 'lác')
        .replace(/\bHat-?trick\b/gi, 'Hát trích')
        .replace(/\bPenalty\b/gi, 'Pê nan ti')
        .replace(/\bMixiGaming\b/gi, 'Mi Xi Gêm Minh')
        .replace(/\bMixiFood\b/gi, 'Mi Xi Phút')
        .replace(/\bCristiano\s+Ronaldo\b/gi, 'Rô Nan Đô')
        .replace(/\bLionel\s+Messi\b/gi, 'Mét Xi')
        .replace(/\bRonaldo\b/gi, 'Rô Nan Đô')
        .replace(/\bMessi\b/gi, 'Mét Xi')
        .replace(/\bElon\s+Musk\b/gi, 'I Lon Mắc')
        .replace(/\bBill\s+Gates\b/gi, 'Biu Ghết')
        .replace(/\bDonald\s+Trump\b/gi, 'Đô Nan Trăm')
        .replace(/!+/g, '!')
        .replace(/\?+/g, '?')
        .replace(/\.{2,}/g, ',')
        .replace(/\s+/g, ' ')
        .trim();

    return s;
}

function splitIntoSoulfulClauses(cleanText) {
    if (!cleanText) return [];
    let rawParts = cleanText.split(/(?<=[!?])\s+/);
    let clauses = [];
    let cur = '';

    for (let i = 0; i < rawParts.length; i++) {
        let p = rawParts[i].trim();
        if (!p) continue;
        if (!cur) {
            cur = p;
        } else if ((cur + ' ' + p).length <= 36 && !/\?$/.test(cur) && !cur.includes('XENEMYX') && !p.includes('XENEMYX')) {
            cur += ' ' + p;
        } else {
            clauses.push(cur);
            cur = p;
        }
    }
    if (cur) clauses.push(cur);

    let finalClauses = [];
    for (const c of clauses) {
        if (c.length <= 155) {
            finalClauses.push(c);
        } else {
            let sub = c.split(/,\s+/);
            let acc = '';
            for (let j = 0; j < sub.length; j++) {
                let piece = j < sub.length - 1 ? (sub[j] + ',') : sub[j];
                if (!acc) acc = piece;
                else if ((acc + ' ' + piece).length <= 145) acc += ' ' + piece;
                else {
                    finalClauses.push(acc);
                    acc = piece;
                }
            }
            if (acc) finalClauses.push(acc);
        }
    }
    return finalClauses;
}

function classifyClauseTone(clauseText, idx, total) {
    if (/\?$/.test(clauseText) || /\b(hả|à|chưa|không|sao|nhỉ|nhở)\s*[!?]?$/i.test(clauseText)) {
        return 'question';
    }
    if (idx === 0 && /!$/.test(clauseText) && clauseText.length <= 58) {
        return 'hook';
    }
    if (idx === total - 1) {
        return 'punch';
    }
    return 'body';
}

/**
 * Tách câu thoại có chứa {enemy} thành chuỗi mệnh đề tĩnh + khe đọc TÊN THẬT CỦA ĐỐI THỦ (enemySlot)
 * để khi vào trận gặp bất kỳ ai trong 19 tướng cũng đọc đúng tên tướng đó ngay tại chỗ {enemy}!
 */
function tokenizeLineWithEnemySlot(rawText, speakerId) {
    let preCleaned = String(rawText)
        .replace(/\b(ông chú|tiền bối|chú|ngài|tộc trưởng|tổng thống)\s+\{enemy\}/gi, '{enemy}')
        .replace(/\{enemy\}|\{opp\}|\{target\}/gi, 'XENEMYX');

    let clean = humanizeTextForSoulfulSpeech(preCleaned, speakerId, 'XENEMYX');
    let rawClauses = splitIntoSoulfulClauses(clean);
    let out = [];

    rawClauses.forEach((c, idx) => {
        c = c.replace(/^[,.\s]+|[,.\s]+$/g, '').trim();
        if (!c) return;
        if (!c.includes('XENEMYX')) {
            out.push({ text: c, tone: classifyClauseTone(c, idx, rawClauses.length) });
            return;
        }

        // Trường hợp mở đầu bằng "Ê {enemy}," hoặc "Ơ kìa {enemy}," hoặc "Này {enemy}," -> Dùng luôn clip "Này [Tên Tướng]!" cực tự nhiên!
        let callPrefixMatch = c.match(/^(ê|ơ kìa|này|hê lô)\s+XENEMYX\s*[,!?:.]*\s*(.*)$/i);
        if (callPrefixMatch) {
            let greeting = callPrefixMatch[1].toLowerCase();
            let rest = (callPrefixMatch[2] || '').trim();
            if (greeting === 'hê lô') {
                out.push({ text: 'Hê lô', tone: 'hook', joinNext: true });
                out.push({ enemySlot: 'exclaim', tone: 'hook', joinNext: false });
            } else {
                out.push({ enemySlot: 'nay', tone: 'callout', joinNext: false });
            }
            if (rest) {
                out.push({ text: rest, tone: classifyClauseTone(rest, idx, rawClauses.length) });
            }
            return;
        }

        let m = c.match(/^(.*?)XENEMYX\s*(ơi\s*[!?]?|à\s*[!?]?|[!?.,:])?(.*)$/i);
        if (!m) {
            out.push({ text: c.replace(/XENEMYX/g, ''), tone: 'body' });
            return;
        }

        let pre = (m[1] || '').replace(/[,\s:]+$/, '').trim();
        let punc = (m[2] || '').trim().toLowerCase();
        let post = (m[3] || '').replace(/^[,\s:]+/, '').trim();

        let slot = 'mid';
        let slotTone = 'callout';
        if (punc.startsWith('ơi')) {
            slot = 'oi';
            slotTone = 'hook';
        } else if (punc.startsWith('à')) {
            slot = 'a';
            slotTone = 'hook';
        } else if (punc === '?') {
            slot = 'question';
            slotTone = 'question';
        } else if (punc === '!' || (!post && idx === 0)) {
            slot = 'exclaim';
            slotTone = 'hook';
        } else if (!post && /\?$/.test(c)) {
            slot = 'question';
            slotTone = 'question';
        } else if (!post) {
            slot = 'exclaim';
            slotTone = 'punch';
        }

        if (pre) {
            out.push({ text: pre, tone: idx === 0 ? 'hook' : 'body', joinNext: true });
        }
        out.push({
            enemySlot: slot,
            tone: slotTone,
            joinNext: Boolean(post && slot === 'mid')
        });
        if (post) {
            out.push({ text: post, tone: classifyClauseTone(post, idx, rawClauses.length) });
        }
    });

    return out;
}

function fetchGoogleTtsMp3(text) {
    return new Promise((resolve, reject) => {
        const q = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${q}`;
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            },
            timeout: 8000
        }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error('HTTP ' + res.statusCode));
            }
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => {
                const buf = Buffer.concat(chunks);
                if (buf.length < 200) return reject(new Error('Buffer too short'));
                resolve(buf.toString('base64'));
            });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    });
}

async function main() {
    const sandbox = { window: {} };
    for (const f of fs.readdirSync(CHAR_DIR)) {
        if (f.startsWith('char_') && f.endsWith('.js')) {
            vm.runInNewContext(fs.readFileSync(path.join(CHAR_DIR, f), 'utf8'), sandbox);
        }
    }
    vm.runInNewContext(fs.readFileSync(ENGINE_FILE, 'utf8'), sandbox);

    const cs = sandbox.window.classStats || {};
    const riv = sandbox.window.DEEP_RIVALRY_SCRIPTS || {};

    const RIVAL_PAIR_SPEAKERS = {
        'ronaldo|messi': { opening: ['ronaldo', 'Mét Xi'], replyOpening: ['messi', 'Rô Nan Đô'], mid1: ['ronaldo', 'Mét Xi'], mid2: ['messi', 'Rô Nan Đô'], climax: ['ronaldo', 'Mét Xi'] },
        'ronaldo|vozinha': { opening: ['ronaldo', 'Rô Nan Đô Con'], replyOpening: ['vozinha', 'bố Rô Nan Đô'], mid1: ['ronaldo', 'Rô Nan Đô Con'], mid2: ['vozinha', 'bố Rô Nan Đô'], climax: ['ronaldo', 'Rô Nan Đô Con'] },
        'domixi|phuonghang': { opening: ['domixi', 'Phương Hằng'], replyOpening: ['phuonghang', 'Độ Mi Xi'], mid1: ['domixi', 'Phương Hằng'], mid2: ['phuonghang', 'Độ Mi Xi'], climax: ['domixi', 'Phương Hằng'] },
        'domixi|mtp': { opening: ['domixi', 'Em Ti Pi'], replyOpening: ['mtp', 'Độ Mi Xi'], mid1: ['domixi', 'Sơn Tùng'], mid2: ['mtp', 'Độ Mi Xi'], climax: ['domixi', 'Sơn Tùng'] },
        'elonmusk|billgates': { opening: ['elonmusk', 'Biu Ghết'], replyOpening: ['billgates', 'I Lon Mắc'], mid1: ['elonmusk', 'Biu Ghết'], mid2: ['billgates', 'I Lon Mắc'], climax: ['elonmusk', 'Biu Ghết'] },
        'elonmusk|donaldtrump': { opening: ['elonmusk', 'Đô Nan Trăm'], replyOpening: ['donaldtrump', 'I Lon Mắc'], mid1: ['elonmusk', 'Đô Nan Trăm'], mid2: ['donaldtrump', 'I Lon Mắc'], climax: ['elonmusk', 'Đô Nan Trăm'] }
    };

    // 0. Khôi phục bộ đệm MP3 từ file story_voice_data.js hiện có (nếu có)
    const cachedTextToB64 = {};
    if (fs.existsSync(OUT_FILE)) {
        try {
            const oldSand = { window: {} };
            vm.runInNewContext(fs.readFileSync(OUT_FILE, 'utf8'), oldSand);
            const oldClips = oldSand.window.LOCAL_STORY_VOICE_CLIPS || {};
            const oldLineMap = oldSand.window.LOCAL_STORY_LINE_MAP || {};
            const oldCalloutMap = oldSand.window.LOCAL_STORY_CALLOUT_MAP || {};
            const oldTextToId = oldSand.window.LOCAL_STORY_TEXT_TO_ID || {};

            for (const [txt, id] of Object.entries(oldTextToId)) {
                if (oldClips[id]) cachedTextToB64[txt] = oldClips[id];
            }
            for (const cid of Object.keys(OLD_PHONETIC_CHAR_NAMES)) {
                const pName = OLD_PHONETIC_CHAR_NAMES[cid];
                const ids = oldCalloutMap[cid] || [];
                if (ids[0] && oldClips[ids[0]]) cachedTextToB64[`Này ${pName}!`] = oldClips[ids[0]];
                if (ids[1] && oldClips[ids[1]]) cachedTextToB64[`Nghe cho rõ đây ${pName}!`] = oldClips[ids[1]];
            }
            for (const pairKey of Object.keys(riv)) {
                for (const stage of Object.keys(riv[pairKey])) {
                    const [spkId, enemySpoken] = RIVAL_PAIR_SPEAKERS[pairKey][stage];
                    const clean = humanizeTextForSoulfulSpeech(riv[pairKey][stage], spkId, enemySpoken);
                    const clauses = splitIntoSoulfulClauses(clean);
                    const mapped = oldLineMap[`RIV::${pairKey}::${stage}`] || [];
                    clauses.forEach((c, i) => {
                        if (mapped[i] && mapped[i].id && oldClips[mapped[i].id]) {
                            cachedTextToB64[c] = oldClips[mapped[i].id];
                        }
                    });
                }
            }
            for (const cid of Object.keys(cs)) {
                const sd = (cs[cid] && cs[cid].storyDialogues) || {};
                for (const cat of ['opening', 'replyOpening', 'midFight', 'climax', 'finisher']) {
                    (sd[cat] || []).slice(0, 2).forEach((raw, idx) => {
                        const clean = humanizeTextForSoulfulSpeech(raw, cid, null);
                        const clauses = splitIntoSoulfulClauses(clean);
                        const mapped = oldLineMap[`CHAR::${cid}::${cat}::${idx}`] || [];
                        clauses.forEach((c, i) => {
                            if (mapped[i] && mapped[i].id && oldClips[mapped[i].id]) {
                                cachedTextToB64[c] = oldClips[mapped[i].id];
                            }
                        });
                    });
                }
            }
            const oldOutroLines = [
                'Hồi kết trận đấu! Out trình hoàn toàn, ai đặt cửa chiến thắng vào điểm danh nhận thưởng ngay!',
                'Hồi kết trận đấu! Thắng làm vua, thua xóa ắc, màn trình diễn năm trăm Ai Kiu đỉnh cao!',
                'Hồi kết trận đấu! Á đù lỗi kỹ thuật, hẹn đối thủ tập hai phục thù ngay lập tức!',
                'Hồi kết trận đấu! Kèo đấu nghẹt thở đến giây cuối cùng, bấm vào trang cá nhân để chơi ngay!'
            ];
            oldOutroLines.forEach((ol, idx) => {
                const clauses = splitIntoSoulfulClauses(ol);
                const mapped = oldLineMap[`OUTRO::${idx}`] || [];
                clauses.forEach((c, i) => {
                    if (mapped[i] && mapped[i].id && oldClips[mapped[i].id]) {
                        cachedTextToB64[c] = oldClips[mapped[i].id];
                    }
                });
            });
        } catch (e) {
            console.warn('⚠️ Không đọc được cache cũ:', e.message);
        }
    }

    const lineMap = {};
    const calloutMap = {};
    const enemyNameMap = {};
    const uniqueClauseTexts = new Set();

    // 1. Tạo kho Tên Tướng Động (LOCAL_STORY_ENEMY_NAME_MAP) với đủ ngữ điệu cảm xúc (!, ?, ơi!, à!, gọi tên giữa câu)
    for (const cid of Object.keys(PHONETIC_CHAR_NAMES)) {
        const pName = PHONETIC_CHAR_NAMES[cid];
        const oldCallName = OLD_PHONETIC_CHAR_NAMES[cid] || pName;
        const callA = `Này ${oldCallName}!`;
        const callB = `Nghe cho rõ đây ${oldCallName}!`;
        const exclaim = `${pName}!`;
        const question = `${pName}?`;
        const oi = `${pName} ơi!`;
        const a = `${pName} à!`;
        const mid = `${pName}`;

        [callA, callB, exclaim, question, oi, a, mid].forEach(t => uniqueClauseTexts.add(t));
        calloutMap[cid] = [callA, callB];
        enemyNameMap[cid] = {
            nay: callA,
            listen: callB,
            exclaim: exclaim,
            question: question,
            oi: oi,
            a: a,
            mid: mid
        };
    }

    // 2. Kịch bản Duyên Nợ (DEEP_RIVALRY_SCRIPTS) - đã gọi thẳng tên riêng của nhau
    for (const pairKey of Object.keys(riv)) {
        const scriptObj = riv[pairKey];
        const pairInfo = RIVAL_PAIR_SPEAKERS[pairKey] || {};
        for (const stage of Object.keys(scriptObj)) {
            const rawLine = scriptObj[stage];
            const [spkId, enemySpoken] = pairInfo[stage] || ['ronaldo', 'Rô Nan Đô'];
            const clean = humanizeTextForSoulfulSpeech(rawLine, spkId, enemySpoken);
            const clauses = splitIntoSoulfulClauses(clean);
            const mapKey = `RIV::${pairKey}::${stage}`;
            lineMap[mapKey] = clauses.map((c, idx) => {
                uniqueClauseTexts.add(c);
                return { text: c, tone: classifyClauseTone(c, idx, clauses.length) };
            });
            lineMap[rawLine] = lineMap[mapKey];
        }
    }

    // 3. Kịch bản 19 Nhân Vật (19 x 5 x 2 = 190 câu) - Gắn khe đọc tên thật của đối thủ (enemySlot) ngay tại {enemy}!
    for (const cid of Object.keys(cs)) {
        const sd = (cs[cid] && cs[cid].storyDialogues) || {};
        for (const cat of ['opening', 'replyOpening', 'midFight', 'climax', 'finisher']) {
            const arr = (sd[cat] || []).slice(0, 2);
            arr.forEach((rawTemplate, idx) => {
                const tokens = tokenizeLineWithEnemySlot(rawTemplate, cid);
                tokens.forEach(t => {
                    if (t.text) uniqueClauseTexts.add(t.text);
                });
                lineMap[`CHAR::${cid}::${cat}::${idx}`] = tokens;
                lineMap[rawTemplate] = tokens;
            });
        }
    }

    // 4. Hồi kết trận đấu: chỉ đọc TÊN NGƯỜI CHIẾN THẮNG (dùng clip "exclaim" trong LOCAL_STORY_ENEMY_NAME_MAP), không cần câu dẫn riêng.

    const allClauses = Array.from(uniqueClauseTexts);
    console.log(`🎙️ Tổng số vế câu & tên riêng cần đóng gói: ${allClauses.length}`);

    const clipsMap = {};
    const textToId = {};
    let nextId = 1;
    const toFetch = [];

    for (const cText of allClauses) {
        const id = 'v' + (nextId++);
        textToId[cText] = id;
        if (cachedTextToB64[cText]) {
            clipsMap[id] = cachedTextToB64[cText];
        } else {
            toFetch.push({ id, text: cText });
        }
    }

    console.log(`⚡ Tái sử dụng từ bộ đệm: ${allClauses.length - toFetch.length} | Cần tải mới: ${toFetch.length}`);

    const BATCH_SIZE = 16;
    let done = 0;
    for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
        const batch = toFetch.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (item) => {
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const b64 = await fetchGoogleTtsMp3(item.text);
                    clipsMap[item.id] = b64;
                    done++;
                    return;
                } catch (err) {
                    await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
                }
            }
            console.warn('⚠️ Không tải được:', item.text);
        }));
        process.stdout.write(`\r✅ Đã tải: ${done}/${toFetch.length} vế thoại...`);
    }
    console.log('\n🎉 Hoàn tất tải giọng đọc!');
    if (toFetch.length > 0 && done < toFetch.length) {
        throw new Error(`Chưa tải đủ các vế thoại mới (${done}/${toFetch.length}). Hủy ghi đè để bảo toàn dữ liệu!`);
    }

    const compactLineMap = {};
    for (const k of Object.keys(lineMap)) {
        compactLineMap[k] = lineMap[k].map(item => {
            if (item.enemySlot) {
                return {
                    enemySlot: item.enemySlot,
                    tone: item.tone || 'callout',
                    joinNext: item.joinNext ? 1 : 0
                };
            }
            return {
                id: textToId[item.text],
                tone: item.tone || 'body',
                joinNext: item.joinNext ? 1 : 0
            };
        }).filter(x => x.enemySlot || (x.id && clipsMap[x.id]));
    }

    const compactCalloutMap = {};
    for (const cid of Object.keys(calloutMap)) {
        compactCalloutMap[cid] = calloutMap[cid].map(t => textToId[t]).filter(id => id && clipsMap[id]);
    }

    const compactEnemyNameMap = {};
    for (const cid of Object.keys(enemyNameMap)) {
        const m = enemyNameMap[cid];
        compactEnemyNameMap[cid] = {
            nay: textToId[m.nay],
            listen: textToId[m.listen],
            exclaim: textToId[m.exclaim],
            question: textToId[m.question],
            oi: textToId[m.oi],
            a: textToId[m.a],
            mid: textToId[m.mid]
        };
    }

    const jsOut = [
        '/**',
        ' * LOCAL STORY VOICE DATA - KHO GIỌNG ĐỌC CHỊ GOOGLE CÓ HỒN & GỌI ĐÍCH DANH TÊN NHÂN VẬT (100% TRONG VIDEO RECORDER)',
        ' * Lưu trữ các vế câu cảm xúc (hook !, question ?, punch !) và tên riêng 19 nhân vật dạng MP3 Base64',
        ' * giúp phát trực tiếp qua Web Audio API (window.audioCtx -> window.masterRecordDestination) với độ trễ 0ms!',
        ' */',
        'window.LOCAL_STORY_VOICE_CLIPS = ' + JSON.stringify(clipsMap) + ';',
        'window.LOCAL_STORY_CALLOUT_MAP = ' + JSON.stringify(compactCalloutMap) + ';',
        'window.LOCAL_STORY_ENEMY_NAME_MAP = ' + JSON.stringify(compactEnemyNameMap) + ';',
        'window.LOCAL_STORY_LINE_MAP = ' + JSON.stringify(compactLineMap) + ';',
        ''
    ].join('\n');

    fs.writeFileSync(OUT_FILE, jsOut, 'utf8');
    console.log(`📦 Đã xuất file: ${OUT_FILE} (${(Buffer.byteLength(jsOut) / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(err => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
});
