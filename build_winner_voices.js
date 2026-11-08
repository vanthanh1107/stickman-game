/**
 * BUILD_WINNER_VOICES.JS
 * Tải giọng đọc "[Tên nhân vật] chiến thắng!" cho cả 19 nhân vật và gắn vào cuối
 * `character/story_voice_data.js` dưới dạng window.LOCAL_STORY_WINNER_MAP = { classId: clipId }.
 * Chạy lại an toàn nhiều lần (tự xóa khối cũ trước khi ghi khối mới).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_FILE = path.join(__dirname, 'character', 'story_voice_data.js');
const MARK_START = '/* ==WINNER_VOICES_START== */';
const MARK_END = '/* ==WINNER_VOICES_END== */';

const WINNER_NAMES = {
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

function fetchGoogleTtsMp3(text) {
    return new Promise((resolve, reject) => {
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            },
            timeout: 8000
        }, (res) => {
            if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
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
    let src = fs.readFileSync(OUT_FILE, 'utf8');
    const s = src.indexOf(MARK_START);
    if (s !== -1) {
        const e = src.indexOf(MARK_END, s);
        src = src.slice(0, s) + src.slice(e + MARK_END.length);
        src = src.replace(/\n+$/, '\n');
    }

    const clips = {};
    const map = {};
    for (const cid of Object.keys(WINNER_NAMES)) {
        const text = `${WINNER_NAMES[cid]} chiến thắng!`;
        let b64 = null;
        for (let attempt = 0; attempt < 3 && !b64; attempt++) {
            try { b64 = await fetchGoogleTtsMp3(text); }
            catch (err) { await new Promise(r => setTimeout(r, 300 * (attempt + 1))); }
        }
        if (!b64) throw new Error('Không tải được: ' + text + ' (hủy để bảo toàn dữ liệu)');
        const id = 'w_' + cid;
        clips[id] = b64;
        map[cid] = id;
        console.log('✅', text);
    }

    const block = [
        MARK_START,
        'Object.assign(window.LOCAL_STORY_VOICE_CLIPS, ' + JSON.stringify(clips) + ');',
        'window.LOCAL_STORY_WINNER_MAP = ' + JSON.stringify(map) + ';',
        MARK_END,
        ''
    ].join('\n');

    fs.writeFileSync(OUT_FILE, src + block, 'utf8');
    console.log('📦 Đã gắn', Object.keys(map).length, 'câu "chiến thắng" vào', OUT_FILE);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
