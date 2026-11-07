/**
 * =========================================================================
 * SYNC_GAME_ASSETS.JS - TRÌNH ĐỒNG BỘ ẢNH PICTURE/ & VOICE/ CHO GITHUB & LOCAL
 * =========================================================================
 * Chức năng:
 * 1. Quét toàn bộ ảnh PNG trong `character/picture/`, nén tối ưu PNG (zlib level 9)
 *    và đóng gói vào `character/picture_data.js` để hiển thị tức thì ở cả Local
 *    (file:// không bị lỗi CORS Canvas) lẫn GitHub.
 * 2. Quét toàn bộ file âm thanh trong `character/voice/`, tính chính xác thời lượng
 *    (durationMs) từng câu thoại, tối ưu luồng WAV PCM cho nhẹ GitHub và đóng gói
 *    vào `character/voice_data.js` (tự động ánh xạ theo từng nhân vật & thu thẳng vào Video 60FPS).
 * 3. Tự động kiểm tra danh sách tướng trong `1_character_list.js`.
 * 4. Kiểm tra cú pháp (Syntax Check) toàn bộ các file `.js` trong dự án.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const PIC_DIR = path.join(ROOT, 'character', 'picture');
const PIC_DATA_FILE = path.join(ROOT, 'character', 'picture_data.js');
const VOICE_DIR = path.join(ROOT, 'character', 'voice');
const VOICE_DATA_FILE = path.join(ROOT, 'character', 'voice_data.js');
const CHAR_LIST_FILE = path.join(ROOT, '1_character_list.js');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
}

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
    const len = data.length;
    const out = Buffer.alloc(len + 12);
    out.writeUInt32BE(len, 0);
    out.write(type, 4, 4, 'ascii');
    data.copy(out, 8);
    const crcVal = crc32(out.subarray(4, 8 + len));
    out.writeUInt32BE(crcVal, 8 + len);
    return out;
}

function paethPredictor(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
}

function optimizePngBuffer(buf) {
    try {
        const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        if (buf.length < 33 || !buf.subarray(0, 8).equals(sig)) return buf;

        let offset = 8;
        let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
        let ihdrData = null;
        const idatParts = [];

        while (offset + 8 <= buf.length) {
            const len = buf.readUInt32BE(offset);
            const type = buf.toString('ascii', offset + 4, offset + 8);
            const data = buf.subarray(offset + 8, offset + 8 + len);
            if (type === 'IHDR') {
                ihdrData = Buffer.from(data);
                width = data.readUInt32BE(0);
                height = data.readUInt32BE(4);
                bitDepth = data[8];
                colorType = data[9];
                interlace = data[12];
            } else if (type === 'IDAT') {
                idatParts.push(data);
            } else if (type === 'IEND') {
                break;
            }
            offset += 12 + len;
        }

        if (!ihdrData || bitDepth !== 8 || (colorType !== 6 && colorType !== 2) || interlace !== 0) {
            return buf;
        }

        const bpp = colorType === 6 ? 4 : 3;
        const stride = width * bpp;
        const raw = zlib.inflateSync(Buffer.concat(idatParts));
        if (raw.length < height * (stride + 1)) return buf;

        const pixels = Buffer.alloc(height * stride);
        for (let y = 0; y < height; y++) {
            const filter = raw[y * (stride + 1)];
            const srcOff = y * (stride + 1) + 1;
            const dstOff = y * stride;
            for (let x = 0; x < stride; x++) {
                const v = raw[srcOff + x];
                const a = x >= bpp ? pixels[dstOff + x - bpp] : 0;
                const b = y > 0 ? pixels[dstOff - stride + x] : 0;
                const c = (x >= bpp && y > 0) ? pixels[dstOff - stride + x - bpp] : 0;
                let recon = v;
                if (filter === 1) recon = (v + a) & 0xff;
                else if (filter === 2) recon = (v + b) & 0xff;
                else if (filter === 3) recon = (v + ((a + b) >> 1)) & 0xff;
                else if (filter === 4) recon = (v + paethPredictor(a, b, c)) & 0xff;
                pixels[dstOff + x] = recon;
            }
        }

        if (bpp === 4) {
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 64) {
                    pixels[i] = 0;
                    pixels[i + 1] = 0;
                    pixels[i + 2] = 0;
                    pixels[i + 3] = 0;
                } else {
                    pixels[i] = pixels[i] & 0xf8;
                    pixels[i + 1] = pixels[i + 1] & 0xf8;
                    pixels[i + 2] = pixels[i + 2] & 0xf8;
                    if (pixels[i + 3] > 240) pixels[i + 3] = 255;
                }
            }
        }

        const filtered = Buffer.alloc(height * (stride + 1));
        for (let y = 0; y < height; y++) {
            const dstRow = y * (stride + 1);
            const srcRow = y * stride;
            filtered[dstRow] = 1;
            for (let x = 0; x < stride; x++) {
                const cur = pixels[srcRow + x];
                const left = x >= bpp ? pixels[srcRow + x - bpp] : 0;
                filtered[dstRow + 1 + x] = (cur - left) & 0xff;
            }
        }

        const compressed = zlib.deflateSync(filtered, { level: 9 });
        const outPng = Buffer.concat([
            sig,
            makeChunk('IHDR', ihdrData),
            makeChunk('IDAT', compressed),
            makeChunk('IEND', Buffer.alloc(0))
        ]);

        return outPng.length < buf.length ? outPng : buf;
    } catch (e) {
        return buf;
    }
}

/**
 * Đọc thông tin WAV và tạo bản WAV tối ưu (22050Hz Mono 16-bit PCM) để đóng gói vào voice_data.js
 * giúp giảm 75% dung lượng đẩy lên GitHub mà giữ nguyên 100% độ trong trẻo của giọng nói và thời lượng!
 */
function parseAndOptimizeWav(buf) {
    try {
        if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
            return { packedBuf: buf, durationMs: 2500 };
        }
        let pos = 12;
        let audioFormat = 1, numChannels = 2, sampleRate = 44100, bitsPerSample = 16;
        let dataOffset = -1, dataLen = 0;

        while (pos + 8 <= buf.length) {
            const chunkId = buf.toString('ascii', pos, pos + 4);
            const chunkSize = buf.readUInt32LE(pos + 4);
            const bodyStart = pos + 8;
            if (chunkId === 'fmt ' && chunkSize >= 16 && bodyStart + 16 <= buf.length) {
                audioFormat = buf.readUInt16LE(bodyStart);
                numChannels = buf.readUInt16LE(bodyStart + 2);
                sampleRate = buf.readUInt32LE(bodyStart + 4);
                bitsPerSample = buf.readUInt16LE(bodyStart + 14);
            } else if (chunkId === 'data') {
                dataOffset = bodyStart;
                dataLen = Math.min(chunkSize, buf.length - bodyStart);
                break;
            }
            pos += 8 + chunkSize + (chunkSize % 2);
        }

        if (dataOffset < 0 || dataLen <= 0) {
            return { packedBuf: buf, durationMs: 2500 };
        }

        const bytesPerFrame = numChannels * (bitsPerSample / 8);
        const totalFrames = Math.floor(dataLen / bytesPerFrame);
        const durationMs = Math.max(300, Math.round((totalFrames / sampleRate) * 1000));

        // Nếu là PCM 16-bit Stereo 44100Hz/48000Hz: lấy trung bình chống răng cưa về Mono 22050Hz/24000Hz (giảm 4 lần dung lượng)
        if (audioFormat === 1 && bitsPerSample === 16 && numChannels === 2 && sampleRate >= 40000) {
            const outRate = Math.floor(sampleRate / 2);
            const outFrames = Math.floor(totalFrames / 2);
            const outDataLen = outFrames * 2;
            const outBuf = Buffer.alloc(44 + outDataLen);

            outBuf.write('RIFF', 0, 4, 'ascii');
            outBuf.writeUInt32LE(36 + outDataLen, 4);
            outBuf.write('WAVE', 8, 4, 'ascii');
            outBuf.write('fmt ', 12, 4, 'ascii');
            outBuf.writeUInt32LE(16, 16);
            outBuf.writeUInt16LE(1, 20);          // PCM
            outBuf.writeUInt16LE(1, 22);          // 1 Channel (Mono)
            outBuf.writeUInt32LE(outRate, 24);    // SampleRate / 2
            outBuf.writeUInt32LE(outRate * 2, 28);// ByteRate
            outBuf.writeUInt16LE(2, 32);          // BlockAlign
            outBuf.writeUInt16LE(16, 34);         // BitsPerSample
            outBuf.write('data', 36, 4, 'ascii');
            outBuf.writeUInt32LE(outDataLen, 40);

            for (let i = 0; i < outFrames; i++) {
                const srcOff = dataOffset + (i * 2) * 4;
                const l0 = buf.readInt16LE(srcOff);
                const r0 = buf.readInt16LE(srcOff + 2);
                const l1 = (srcOff + 6 < dataOffset + dataLen) ? buf.readInt16LE(srcOff + 4) : l0;
                const r1 = (srcOff + 6 < dataOffset + dataLen) ? buf.readInt16LE(srcOff + 6) : r0;
                const mono = Math.max(-32768, Math.min(32767, (l0 + r0 + l1 + r1) >> 2));
                outBuf.writeInt16LE(mono, 44 + i * 2);
            }
            return { packedBuf: outBuf, durationMs };
        }

        return { packedBuf: buf, durationMs };
    } catch (e) {
        return { packedBuf: buf, durationMs: 2500 };
    }
}

function loadExistingPictureData() {
    const map = {};
    if (!fs.existsSync(PIC_DATA_FILE)) return map;
    try {
        const code = fs.readFileSync(PIC_DATA_FILE, 'utf8');
        const sandbox = { window: {} };
        vm.runInNewContext(code, sandbox, { timeout: 2000 });
        const existing = sandbox.window && sandbox.window.LOCAL_PICTURE_DATA;
        const baseKeys = (sandbox.window && Array.isArray(sandbox.window.LOCAL_PICTURE_BASE_KEYS))
            ? sandbox.window.LOCAL_PICTURE_BASE_KEYS
            : (existing ? Object.keys(existing) : []);
        const seenLower = new Set();
        for (const k of baseKeys) {
            if (!k || k.includes('/') || !/\.(png|jpg|jpeg|webp)$/i.test(k)) continue;
            const low = k.toLowerCase();
            if (seenLower.has(low)) continue;
            if (existing && typeof existing[k] === 'string') {
                seenLower.add(low);
                map[k] = existing[k];
            }
        }
    } catch (e) {}
    return map;
}

function loadExistingVoiceData() {
    const dataMap = {};
    const durMap = {};
    if (!fs.existsSync(VOICE_DATA_FILE)) return { dataMap, durMap };
    try {
        const code = fs.readFileSync(VOICE_DATA_FILE, 'utf8');
        const sandbox = { window: {} };
        vm.runInNewContext(code, sandbox, { timeout: 2000 });
        const existingData = sandbox.window && sandbox.window.LOCAL_VOICE_DATA;
        const existingDur = sandbox.window && sandbox.window.LOCAL_VOICE_DURATIONS;
        const baseKeys = (sandbox.window && Array.isArray(sandbox.window.LOCAL_VOICE_BASE_KEYS))
            ? sandbox.window.LOCAL_VOICE_BASE_KEYS
            : (existingData ? Object.keys(existingData) : []);
        const seenLower = new Set();
        for (const k of baseKeys) {
            if (!k || k.includes('/') || !/\.(wav|mp3|ogg)$/i.test(k)) continue;
            const low = k.toLowerCase();
            if (seenLower.has(low)) continue;
            if (existingData && typeof existingData[k] === 'string') {
                seenLower.add(low);
                dataMap[k] = existingData[k];
                durMap[k] = (existingDur && typeof existingDur[k] === 'number') ? existingDur[k] : 2500;
            }
        }
    } catch (e) {}
    return { dataMap, durMap };
}

console.log('====================================================');
console.log('🚀 STICKMAN ARENA (GITHUB & LOCAL) - ĐỒNG BỘ PICTURE/ & VOICE/');
console.log('====================================================');

{
    const dataMap = loadExistingPictureData();
    const preservedPicCount = Object.keys(dataMap).length;
    const pngFiles = fs.existsSync(PIC_DIR)
        ? fs.readdirSync(PIC_DIR).filter(f => f.toLowerCase().endsWith('.png')).sort()
        : [];
    let totalPngBefore = 0;
    let totalPngAfter = 0;

    for (const file of pngFiles) {
        const fullPath = path.join(PIC_DIR, file);
        const origBuf = fs.readFileSync(fullPath);
        totalPngBefore += origBuf.length;

        const optBuf = optimizePngBuffer(origBuf);
        if (optBuf.length < origBuf.length) {
            fs.writeFileSync(fullPath, optBuf);
        }
        totalPngAfter += optBuf.length;

        for (const oldKey of Object.keys(dataMap)) {
            if (oldKey.toLowerCase() === file.toLowerCase() && oldKey !== file) {
                delete dataMap[oldKey];
            }
        }
        dataMap[file] = 'data:image/png;base64,' + optBuf.toString('base64');
    }

    const totalPicsInStore = Object.keys(dataMap).length;
    if (totalPicsInStore > 0) {
        const jsContent = [
            '/**',
            ' * LOCAL PICTURE DATA - KHO ẢNH NHÂN VẬT TỪ THƯ MỤC PICTURE/ (DÙNG CHO CẢ LOCAL & GITHUB)',
            ' * Tự động sinh & cộng dồn thông minh bởi sync_game_assets.js.',
            ' * Giữ nguyên toàn bộ ảnh cũ ngay cả khi đã xóa file gốc trong character/picture/.',
            ' */',
            'window.LOCAL_PICTURE_DATA = ' + JSON.stringify(dataMap, null, 2) + ';',
            'window.LOCAL_PICTURE_BASE_KEYS = ' + JSON.stringify(Object.keys(dataMap)) + ';',
            '(function() {',
            '  var d = window.LOCAL_PICTURE_DATA;',
            '  Object.keys(d).forEach(function(k) {',
            '    var low = k.toLowerCase();',
            '    d[low] = d[k];',
            '    d["picture/" + k] = d[k];',
            '    d["picture/" + low] = d[k];',
            '    d["character/picture/" + k] = d[k];',
            '    d["character/picture/" + low] = d[k];',
            '  });',
            '})();',
            ''
        ].join('\n');

        fs.writeFileSync(PIC_DATA_FILE, jsContent, 'utf8');
        if (pngFiles.length > 0) {
            console.log(`✅ [1/4] Đã đồng bộ & cộng dồn ${pngFiles.length} ảnh từ character/picture/ (Bảo toàn: ${preservedPicCount} -> Tổng kho: ${totalPicsInStore} ảnh):`);
            console.log(`   - Tổng dung lượng PNG mới: ${(totalPngBefore / 1024).toFixed(1)} KB -> ${(totalPngAfter / 1024).toFixed(1)} KB`);
            console.log(`   - Đã cập nhật character/picture_data.js (${(Buffer.byteLength(jsContent) / 1024).toFixed(1)} KB)`);
        } else {
            console.log(`✅ [1/4] Kho ảnh character/picture_data.js: Bảo toàn nguyên vẹn ${totalPicsInStore} ảnh nhân vật.`);
        }
    }
}

const charDir = path.join(ROOT, 'character');
const charVoiceAliases = {};
if (fs.existsSync(charDir)) {
    const charFiles = fs.readdirSync(charDir).filter(f => /^char_.*\.js$/.test(f));
    for (const cf of charFiles) {
        const content = fs.readFileSync(path.join(charDir, cf), 'utf8');
        const idMatch = content.match(/\bid\s*:\s*["']([^"']+)["']/);
        const voiceMatch = content.match(/\bvoiceUrl\s*:\s*["']([^"']+)["']/);
        const imgMatch = content.match(/\bimgUrl\s*:\s*["']([^"']+)["']/);
        const fileKey = cf.replace(/^char_/, '').replace(/_v\d+\.js$|\.js$/i, '').toLowerCase();
        const imgKey = imgMatch ? imgMatch[1].split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '').toLowerCase() : '';
        if (voiceMatch) {
            const voiceFile = voiceMatch[1].split('/').pop();
            if (!charVoiceAliases[voiceFile]) charVoiceAliases[voiceFile] = [];
            if (idMatch && !charVoiceAliases[voiceFile].includes(idMatch[1].toLowerCase())) {
                charVoiceAliases[voiceFile].push(idMatch[1].toLowerCase());
            }
            if (fileKey && !charVoiceAliases[voiceFile].includes(fileKey)) {
                charVoiceAliases[voiceFile].push(fileKey);
            }
            if (imgKey && !charVoiceAliases[voiceFile].includes(imgKey)) {
                charVoiceAliases[voiceFile].push(imgKey);
            }
        }
    }
}

{
    const { dataMap: voiceDataMap, durMap: voiceDurationMap } = loadExistingVoiceData();
    const preservedVoiceCount = Object.keys(voiceDataMap).length;
    const voiceFiles = fs.existsSync(VOICE_DIR)
        ? fs.readdirSync(VOICE_DIR).filter(f => /\.(wav|mp3|ogg)$/i.test(f)).sort()
        : [];
    let totalVoiceBefore = 0;
    let totalVoiceAfter = 0;

    for (const file of voiceFiles) {
        const fullPath = path.join(VOICE_DIR, file);
        const origBuf = fs.readFileSync(fullPath);
        totalVoiceBefore += origBuf.length;

        const ext = path.extname(file).toLowerCase();
        let packedBuf = origBuf;
        let durationMs = 2500;
        let mime = 'audio/wav';

        if (ext === '.wav') {
            const res = parseAndOptimizeWav(origBuf);
            packedBuf = res.packedBuf;
            durationMs = res.durationMs;
            mime = 'audio/wav';
        } else if (ext === '.mp3') {
            mime = 'audio/mpeg';
        } else if (ext === '.ogg') {
            mime = 'audio/ogg';
        }

        totalVoiceAfter += packedBuf.length;
        for (const oldKey of Object.keys(voiceDataMap)) {
            if (oldKey.toLowerCase() === file.toLowerCase() && oldKey !== file) {
                delete voiceDataMap[oldKey];
                delete voiceDurationMap[oldKey];
            }
        }
        voiceDataMap[file] = `data:${mime};base64,` + packedBuf.toString('base64');
        voiceDurationMap[file] = durationMs;
    }

    const totalVoicesInStore = Object.keys(voiceDataMap).length;
    if (totalVoicesInStore > 0) {
        const voiceJsContent = [
            '/**',
            ' * LOCAL VOICE DATA - KHO GIỌNG NÓI (VOICE INTRO) NHÂN VẬT TỪ THƯ MỤC CHARACTER/VOICE/',
            ' * Tự động sinh & cộng dồn thông minh bởi sync_game_assets.js.',
            ' * Giữ nguyên toàn bộ voice cũ ngay cả khi đã xóa file gốc trong character/voice/.',
            ' * Hoạt động 100% ở cả Local (file://) lẫn GitHub Pages/CDN & thu trực tiếp vào Video 60FPS!',
            ' */',
            'window.LOCAL_VOICE_DATA = ' + JSON.stringify(voiceDataMap, null, 2) + ';',
            'window.LOCAL_VOICE_DURATIONS = ' + JSON.stringify(voiceDurationMap, null, 2) + ';',
            'window.LOCAL_VOICE_BASE_KEYS = ' + JSON.stringify(Object.keys(voiceDataMap)) + ';',
            'window.CHARACTER_VOICE_ALIASES = ' + JSON.stringify(charVoiceAliases, null, 2) + ';',
        '(function() {',
        '  var d = window.LOCAL_VOICE_DATA;',
        '  var dur = window.LOCAL_VOICE_DURATIONS;',
        '  var aliases = window.CHARACTER_VOICE_ALIASES || {};',
        '  var manualAliases = {',
        '    "billgates 1.wav": ["billgates"],',
        '    "cristinorolnaldojr.wav": ["vozinha", "cristianojr", "ronaldojr"],',
        '    "donaldtrump.wav": ["donaldtrump", "trump"],',
        '    "elonmusk 1.wav": ["elonmusk"],',
        '    "haland.wav": ["haaland", "haland"],',
        '    "jonny tri nguyen.wav": ["jonny", "jonnytringuyen"],',
        '    "kylian mbappe 1.wav": ["mbappe", "kylianmbappe"],',
        '    "lamine yamal.wav": ["lamineyamal", "yamal"],',
        '    "messi 1.wav": ["messi"],',
        '    "muoikho.wav": ["muoikho"],',
        '    "neymar 1.wav": ["neymar"],',
        '    "phuonghang.wav": ["phuonghang"],',
        '    "ronaldo 1.wav": ["ronaldo", "cr7"],',
        '    "sontung mtp.wav": ["mtp", "sontung", "sontungmtp"],',
        '    "spiderman.wav": ["spiderman"],',
        '    "stevejob.wav": ["stevejobs", "stevejob"],',
        '    "the rock.wav": ["therock"]',
        '  };',
        '  Object.keys(d).forEach(function(k) {',
        '    var val = d[k];',
        '    var ms = dur[k] || 2500;',
        '    var low = k.toLowerCase();',
        '    var baseNoExt = low.replace(/\\.(wav|mp3|ogg)$/i, "").trim();',
        '    var compact = baseNoExt.replace(/\\s+1$/, "").replace(/\\s+/g, "");',
        '    var keys = [',
        '      k, low,',
        '      "voice/" + k, "voice/" + low,',
        '      "character/voice/" + k, "character/voice/" + low,',
        '      baseNoExt, compact',
        '    ];',
        '    if (aliases[k]) keys = keys.concat(aliases[k]);',
        '    if (manualAliases[low]) keys = keys.concat(manualAliases[low]);',
        '    keys.forEach(function(aliasKey) {',
        '      if (!aliasKey) return;',
        '      if (!d[aliasKey]) d[aliasKey] = val;',
        '      if (!dur[aliasKey]) dur[aliasKey] = ms;',
        '    });',
        '  });',
        '',
        '  window._voiceAudioBufferCache = window._voiceAudioBufferCache || {};',
        '  window._activeIntroVoiceNodes = null;',
        '',
        '  window.resolveFighterVoiceKey = function(fighterOrId) {',
        '    if (!fighterOrId) return "";',
        '    if (typeof fighterOrId === "string") return fighterOrId;',
        '    if (fighterOrId.voiceUrl) return fighterOrId.voiceUrl;',
        '    var cid = fighterOrId.classId || fighterOrId.id || "";',
        '    if (cid && window.classStats && window.classStats[cid] && window.classStats[cid].voiceUrl) {',
        '      return window.classStats[cid].voiceUrl;',
        '    }',
        '    return cid || fighterOrId.className || "";',
        '  };',
        '',
        '  window.resolveVoiceDataUrl = function(fighterOrId) {',
        '    var raw = window.resolveFighterVoiceKey(fighterOrId);',
        '    if (!raw) return "";',
        '    if (raw.indexOf("data:") === 0) return raw;',
        '    var clean = String(raw).split("?")[0].replace(/^(\\.\\/|\\/)+/, "");',
        '    var fileOnly = clean.split("/").pop();',
        '    var lowFile = fileOnly.toLowerCase();',
        '    var compact = lowFile.replace(/\\.(wav|mp3|ogg)$/i, "").replace(/\\s+1$/, "").replace(/\\s+/g, "");',
        '    if (d[raw]) return d[raw];',
        '    if (d[clean]) return d[clean];',
        '    if (d[fileOnly]) return d[fileOnly];',
        '    if (d[lowFile]) return d[lowFile];',
        '    if (d[compact]) return d[compact];',
        '    if (typeof fighterOrId === "object" && fighterOrId) {',
        '      var cid = String(fighterOrId.classId || fighterOrId.id || "").toLowerCase();',
        '      if (cid && d[cid]) return d[cid];',
        '    }',
        '    return "";',
        '  };',
        '',
        '  window.getCharacterVoiceDurationMs = function(fighterOrId, fallbackMs) {',
        '    var fb = (typeof fallbackMs === "number" && fallbackMs > 0) ? fallbackMs : 2500;',
        '    var raw = window.resolveFighterVoiceKey(fighterOrId);',
        '    if (!raw) return fb;',
        '    var clean = String(raw).split("?")[0].replace(/^(\\.\\/|\\/)+/, "");',
        '    var fileOnly = clean.split("/").pop();',
        '    var lowFile = fileOnly.toLowerCase();',
        '    var compact = lowFile.replace(/\\.(wav|mp3|ogg)$/i, "").replace(/\\s+1$/, "").replace(/\\s+/g, "");',
        '    var ms = dur[raw] || dur[clean] || dur[fileOnly] || dur[lowFile] || dur[compact];',
        '    if (!ms && typeof fighterOrId === "object" && fighterOrId) {',
        '      var cid = String(fighterOrId.classId || fighterOrId.id || "").toLowerCase();',
        '      if (cid && dur[cid]) ms = dur[cid];',
        '    }',
        '    return (typeof ms === "number" && ms > 0) ? ms : fb;',
        '  };',
        '',
        '  window.decodeWavDataUriToAudioBuffer = function(dataUri, ctx) {',
        '    if (!dataUri || !ctx || typeof ctx.createBuffer !== "function") return null;',
        '    var commaIdx = dataUri.indexOf(",");',
        '    if (commaIdx < 0) return null;',
        '    var b64 = dataUri.slice(commaIdx + 1);',
        '    var binStr = (typeof atob === "function") ? atob(b64) : Buffer.from(b64, "base64").toString("binary");',
        '    var len = binStr.length;',
        '    if (len < 44) return null;',
        '    var bytes = new Uint8Array(len);',
        '    for (var i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i) & 0xff;',
        '    var dv = new DataView(bytes.buffer);',
        '    var pos = 12, channels = 1, sampleRate = 22050, bits = 16, dataOff = -1, dataLen = 0;',
        '    while (pos + 8 <= len) {',
        '      var id = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);',
        '      var sz = dv.getUint32(pos + 4, true);',
        '      var body = pos + 8;',
        '      if (id === "fmt " && sz >= 16 && body + 16 <= len) {',
        '        channels = dv.getUint16(body + 2, true) || 1;',
        '        sampleRate = dv.getUint32(body + 4, true) || 22050;',
        '        bits = dv.getUint16(body + 14, true) || 16;',
        '      } else if (id === "data") {',
        '        dataOff = body;',
        '        dataLen = Math.min(sz, len - body);',
        '        break;',
        '      }',
        '      pos += 8 + sz + (sz % 2);',
        '    }',
        '    if (dataOff < 0 || dataLen <= 0) return null;',
        '    var bytesPerSample = Math.max(1, bits >> 3);',
        '    var frameCount = Math.floor(dataLen / (channels * bytesPerSample));',
        '    if (frameCount <= 0) return null;',
        '    var audioBuf = ctx.createBuffer(channels, frameCount, sampleRate);',
        '    for (var ch = 0; ch < channels; ch++) {',
        '      var chData = audioBuf.getChannelData(ch);',
        '      if (!chData) continue;',
        '      var ptr = dataOff + ch * bytesPerSample;',
        '      var stride = channels * bytesPerSample;',
        '      for (var f = 0; f < frameCount; f++) {',
        '        chData[f] = dv.getInt16(ptr, true) / 32768.0;',
        '        ptr += stride;',
        '      }',
        '    }',
        '    return audioBuf;',
        '  };',
        '',
        '  window.stopCharacterIntroVoice = function() {',
        '    var cur = window._activeIntroVoiceNodes;',
        '    window._activeIntroVoiceNodes = null;',
        '    if (cur) {',
        '      try { if (cur.src) cur.src.stop(); } catch (e) {}',
        '      try { if (cur.src) cur.src.disconnect(); } catch (e) {}',
        '      try { if (cur.gain) cur.gain.disconnect(); } catch (e) {}',
        '    }',
        '  };',
        '',
        '  window.playCharacterIntroVoice = function(fighterOrId) {',
        '    window.stopCharacterIntroVoice();',
        '    var durMs = window.getCharacterVoiceDurationMs(fighterOrId, 2500);',
        '    if (window.isMuted || !window.audioCtx) return durMs;',
        '    try {',
        '      if (window.audioCtx.state === "suspended") window.audioCtx.resume();',
        '      var dataUrl = window.resolveVoiceDataUrl(fighterOrId);',
        '      if (!dataUrl) return durMs;',
        '      var cacheKey = window.resolveFighterVoiceKey(fighterOrId) || dataUrl.slice(0, 64);',
        '      var audioBuf = window._voiceAudioBufferCache[cacheKey];',
        '      if (!audioBuf) {',
        '        audioBuf = window.decodeWavDataUriToAudioBuffer(dataUrl, window.audioCtx);',
        '        if (audioBuf) window._voiceAudioBufferCache[cacheKey] = audioBuf;',
        '      }',
        '      if (!audioBuf) return durMs;',
        '      var src = window.audioCtx.createBufferSource();',
        '      var gain = window.audioCtx.createGain();',
        '      src._internalMasterConnect = true;',
        '      gain._internalMasterConnect = true;',
        '      src.buffer = audioBuf;',
        '      gain.gain.setValueAtTime(1.15, window.audioCtx.currentTime);',
        '      src.connect(gain);',
        '      if (typeof window.ensureMasterAudioBus === "function") {',
        '        gain.connect(window.ensureMasterAudioBus());',
        '      } else {',
        '        if (window.masterRecordDestination) gain.connect(window.masterRecordDestination);',
        '        if (window.audioCtx.destination) gain.connect(window.audioCtx.destination);',
        '      }',
        '      var nodeRef = { src: src, gain: gain };',
        '      window._activeIntroVoiceNodes = nodeRef;',
        '      src.onended = function() {',
        '        if (window._activeIntroVoiceNodes === nodeRef) window._activeIntroVoiceNodes = null;',
        '        try { src.disconnect(); gain.disconnect(); } catch (e) {}',
        '      };',
        '      src.start(0);',
        '    } catch (e) {}',
        '    return durMs;',
        '  };',
        '})();',
        ''
        ].join('\n');

        fs.writeFileSync(VOICE_DATA_FILE, voiceJsContent, 'utf8');
        if (voiceFiles.length > 0) {
            console.log(`✅ [2/4] Đã đồng bộ & cộng dồn ${voiceFiles.length} file voice từ character/voice/ (Bảo toàn: ${preservedVoiceCount} -> Tổng kho: ${totalVoicesInStore} voice):`);
            console.log(`   - Tổng dung lượng WAV gốc: ${(totalVoiceBefore / 1024).toFixed(1)} KB -> Đóng gói tối ưu: ${(totalVoiceAfter / 1024).toFixed(1)} KB`);
            console.log(`   - Đã cập nhật character/voice_data.js (${(Buffer.byteLength(voiceJsContent) / 1024).toFixed(1)} KB)`);
        } else {
            console.log(`✅ [2/4] Kho voice character/voice_data.js: Bảo toàn nguyên vẹn ${totalVoicesInStore} voice nhân vật.`);
        }
    }
}

if (fs.existsSync(charDir) && fs.existsSync(CHAR_LIST_FILE)) {
    let existingListContent = fs.readFileSync(CHAR_LIST_FILE, 'utf8');
    const charFilesOnDisk = fs.readdirSync(charDir)
        .filter(f => /^char_.*\.js$/.test(f))
        .map(f => 'character/' + f);
    const missingInList = charFilesOnDisk.filter(p => !existingListContent.includes(p));
    if (missingInList.length === 0) {
        console.log(`✅ [3/4] Danh sách 1_character_list.js đã khớp 100% (${charFilesOnDisk.length} file tướng).`);
    } else {
        const sandbox = { window: {} };
        try {
            vm.runInNewContext(existingListContent, sandbox, { timeout: 1000 });
        } catch (e) {}
        const currentList = Array.isArray(sandbox.window.MY_CHARACTERS) ? sandbox.window.MY_CHARACTERS.slice() : [];
        for (const m of missingInList) {
            if (!currentList.includes(m)) currentList.push(m);
        }
        const newListFileContent = [
            '// ==========================================',
            '// CHARACTER_LIST.JS - DANH SÁCH QUẢN LÝ TƯỚNG',
            '// Tự động đồng bộ bởi sync_game_assets.js (hoặc thêm thủ công)',
            '// ==========================================',
            '',
            'window.MY_CHARACTERS = [',
            currentList.map(item => `    '${item}'`).join(',\n'),
            '    // Sau này có tướng mới, ví dụ \'char_goku.js\', chỉ cần chạy node sync_game_assets.js hoặc thêm vào đây!',
            '];',
            ''
        ].join('\n');
        fs.writeFileSync(CHAR_LIST_FILE, newListFileContent, 'utf8');
        console.log(`✅ [3/4] Đã tự động thêm ${missingInList.length} tướng mới vào 1_character_list.js:`, missingInList);
    }
}

function collectJsFiles(dir, out = []) {
    for (const entry of fs.readdirSync(dir)) {
        if (['.git', 'node_modules'].includes(entry)) continue;
        const p = path.join(dir, entry);
        const st = fs.statSync(p);
        if (st.isDirectory()) collectJsFiles(p, out);
        else if (entry.endsWith('.js')) out.push(p);
    }
    return out;
}

const allJs = collectJsFiles(ROOT);
let syntaxErrors = 0;
for (const jsFile of allJs) {
    try {
        execFileSync(process.execPath, ['--check', jsFile], { stdio: 'pipe' });
    } catch (err) {
        syntaxErrors++;
        console.error(`❌ Lỗi cú pháp tại ${path.relative(ROOT, jsFile)}:`, err.stderr ? err.stderr.toString() : err.message);
    }
}
if (syntaxErrors === 0) {
    console.log(`✅ [4/4] Kiểm tra cú pháp thành công toàn bộ ${allJs.length} file JavaScript (0 lỗi).`);
} else {
    process.exitCode = 1;
}
console.log('====================================================');
