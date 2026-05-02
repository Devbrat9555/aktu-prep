const StudyMaterial = require('../models/StudyMaterial');
const Subject = require('../models/Subject');
const axios = require('axios');
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const path = require('path');
const fs = require('fs');
const bigInt = require('big-integer');

const log = (tag, msg) => {
    const line = `[${new Date().toISOString()}] [${tag}] ${msg}\n`;
    try {
        fs.appendFileSync('debug.log', line);
    } catch (e) {}
    console.log(line.trim());
};

// ─── Persistent singleton client ─────────────────────────────────────────────
let client = null;
let clientReady = false; // true only after first successful connect
let connectPromise = null; // prevent double-connect race
let warmMediaForDc = null;
const CACHE_DIR = path.join(__dirname, '..', 'cache', 'coding-stream');
const cacheDownloads = new Map();
let autoSyncInProgress = false;
let lastSupremeAutoSyncAt = 0;
const REQUIRED_CODING_BATCHES = ['Dot Web Dev', 'Rohit Negi Web Dev', 'PW Web Dev', 'Supreme DSA'];

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCachePaths(msgId) {
    const safeId = String(msgId).replace(/[^a-zA-Z0-9_-]/g, '');
    return {
        finalPath: path.join(CACHE_DIR, `${safeId}.bin`),
        tempPath: path.join(CACHE_DIR, `${safeId}.part`),
        metaPath: path.join(CACHE_DIR, `${safeId}.json`),
    };
}

async function enforceCacheBudget() {
    const maxBytes = parseInt(process.env.CODING_CACHE_MAX_BYTES || `${20 * 1024 * 1024 * 1024}`, 10);
    if (!Number.isFinite(maxBytes) || maxBytes <= 0) return;

    const entries = await fs.promises.readdir(CACHE_DIR);
    const metas = [];
    let total = 0;

    for (const name of entries) {
        if (!name.endsWith('.json')) continue;
        const metaPath = path.join(CACHE_DIR, name);
        try {
            const raw = await fs.promises.readFile(metaPath, 'utf8');
            const meta = JSON.parse(raw);
            const id = name.replace(/\.json$/, '');
            const binPath = path.join(CACHE_DIR, `${id}.bin`);
            const partPath = path.join(CACHE_DIR, `${id}.part`);
            const dataPath = fs.existsSync(binPath) ? binPath : (fs.existsSync(partPath) ? partPath : null);
            if (!dataPath) continue;
            const stat = await fs.promises.stat(dataPath);
            total += stat.size;
            metas.push({
                id,
                metaPath,
                dataPath,
                size: stat.size,
                updatedAt: new Date(meta.updatedAt || 0).getTime() || 0,
            });
        } catch (_) {}
    }

    if (total <= maxBytes) return;
    metas.sort((a, b) => a.updatedAt - b.updatedAt);

    for (const item of metas) {
        if (total <= maxBytes) break;
        try { await fs.promises.unlink(item.dataPath); } catch (_) {}
        try { await fs.promises.unlink(item.metaPath); } catch (_) {}
        total -= item.size;
    }
}

function parseRange(rangeHeader, fileSize) {
    let start = 0;
    let end = fileSize - 1;

    if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const parsedStart = parseInt(parts[0], 10);
        start = Number.isFinite(parsedStart) ? parsedStart : 0;
        end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    }

    if (start >= fileSize) return null;
    end = Math.min(end, fileSize - 1);
    if (end < start) {
        end = Math.min(start + (512 * 1024) - 1, fileSize - 1);
    }

    return {
        start,
        end,
        chunksize: (end - start) + 1,
    };
}

async function writeMeta(metaPath, data) {
    await fs.promises.writeFile(metaPath, JSON.stringify(data), 'utf8');
}

async function readMeta(metaPath) {
    try {
        const raw = await fs.promises.readFile(metaPath, 'utf8');
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
}

async function updatePartialCache({
    msgId,
    contentType,
    fileSize,
    start,
    bytesWritten,
    logMsg
}) {
    const key = String(msgId);
    if (cacheDownloads.has(key)) return;

    const task = (async () => {
        const { finalPath, tempPath, metaPath } = getCachePaths(msgId);
        const oldMeta = await readMeta(metaPath);
        const previousCachedBytes = Number(oldMeta?.cachedBytes || 0);
        // cachedBytes tracks only contiguous bytes from offset 0.
        const contiguousAdvance = start <= previousCachedBytes
            ? Math.max(previousCachedBytes, start + bytesWritten)
            : previousCachedBytes;
        const nextMeta = {
            msgId: String(msgId),
            fileSize,
            contentType,
            cachedBytes: contiguousAdvance,
            updatedAt: new Date().toISOString(),
        };
        await writeMeta(metaPath, nextMeta);

        // Promote .part -> .bin only when full file is cached.
        if (nextMeta.cachedBytes >= fileSize && fs.existsSync(tempPath)) {
            const stat = await fs.promises.stat(tempPath);
            if (stat.size >= fileSize) {
                await fs.promises.rename(tempPath, finalPath);
                logMsg(`Cache promoted to full file for msgId=${msgId}`);
            }
        }
        await enforceCacheBudget();
    })()
        .catch((err) => logMsg(`Cache meta update failed for msgId=${msgId}: ${err.message}`))
        .finally(() => cacheDownloads.delete(key));

    cacheDownloads.set(key, task);
}

async function tryServeFromCache({ msgId, req, res, fallbackContentType, fallbackFileSize, logMsg }) {
    const { finalPath, tempPath, metaPath } = getCachePaths(msgId);
    const meta = await readMeta(metaPath);
    const cachePath = fs.existsSync(finalPath) ? finalPath : (fs.existsSync(tempPath) ? tempPath : null);
    if (!cachePath) return false;

    const stat = await fs.promises.stat(cachePath);
    const fileSize = Number(meta?.fileSize || fallbackFileSize || stat.size);
    const contentType = meta?.contentType || fallbackContentType || 'video/mp4';
    const cachedBytes = Math.min(Number(meta?.cachedBytes || stat.size), stat.size);

    const parsedRange = parseRange(req.headers.range, cachedBytes);
    if (!parsedRange) {
        return false;
    }
    const { start, end, chunksize } = parsedRange;

    if (end >= cachedBytes) return false;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "X-Video-Cache": "HIT",
    };
    res.writeHead(206, headers);

    await new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(cachePath, { start, end });
        readStream.on('error', reject);
        readStream.on('end', resolve);
        readStream.pipe(res);
    });
    logMsg(`Served from local cache msgId=${msgId} range=${start}-${end}`);
    return true;
}

async function getTelegramClient() {
    // If client is already connected and ready, return it
    if (client && client.connected && clientReady) return client;
    
    // If a connection is already in progress, wait for it
    if (connectPromise) {
        try {
            return await connectPromise;
        } catch (e) {
            // If the previous attempt failed, we'll try again below
        }
    }

    connectPromise = (async () => {
        try {
            log('Client', 'Initializing and connecting...');
            const sessionString = process.env.TELEGRAM_STRING_SESSION || "";
            const session = new StringSession(sessionString);
            const apiId = parseInt(process.env.TELEGRAM_API_ID);
            const apiHash = process.env.TELEGRAM_API_HASH;

            if (!apiId || !apiHash) {
                throw new Error("TELEGRAM_API_ID or TELEGRAM_API_HASH is missing in .env");
            }

            client = new TelegramClient(session, apiId, apiHash, {
                connectionRetries: 10,
                retryDelay: 2000,
                autoReconnect: true
            });

            await client.connect();
            log('Client', 'Connected successfully.');
            clientReady = true;
            connectPromise = null; // Reset so future calls use the live client
            return client;
        } catch (err) {
            log('Client', `Connection failed: ${err.message}`);
            connectPromise = null;
            clientReady = false;
            client = null;
            throw err;
        }
    })();

    return connectPromise;
}

// ─── Media entity cache ───────────────────────────────────────────────────────
// Populated at startup by preWarmConnection() so first-click is instant
const mediaCache = new Map();
let cachedChannel = null;

/**
 * Called once at server startup.
 * Connects to Telegram and pre-fetches ALL video/document message objects
 * into mediaCache so every subsequent streaming request is a cache hit.
 */
exports.preWarmConnection = async () => {
    try {
        const tg = await getTelegramClient();
        cachedChannel = await tg.getEntity('VratCodingLectures');
        log('PreWarm', `Channel resolved: ${cachedChannel.title}`);

        // Keep startup light: warm only one representative video to establish
        // DC session and first-byte path, without flooding Telegram API.
        // Pre-warm the latest video from EACH required batch to prevent DC migration delays
        for (const batchName of REQUIRED_CODING_BATCHES) {
            const subject = await Subject.findOne({ name: batchName, course: 'Coding' });
            if (!subject) continue;

            const latestMat = await StudyMaterial.findOne({ subjectId: subject._id, type: 'video' }).sort({ _id: -1 });
            if (!latestMat) continue;

            const msgId = parseInt(latestMat.url.split('/').pop(), 10);
            if (!Number.isFinite(msgId)) continue;

            try {
                const messages = await tg.getMessages(cachedChannel, { ids: [msgId] });
                if (messages?.[0]?.media) {
                    mediaCache.set(`${msgId}`, messages[0]);
                    log('PreWarm', `Warmed: ${batchName} (ID: ${msgId})`);
                    
                    // Trigger a tiny download to keep the DC connection alive/hot
                    await tg.downloadFile(messages[0].media, {
                        offset: bigInt(0),
                        limit: 1024,
                        dcId: (messages[0].media.document || messages[0].media).dcId
                    });
                }
            } catch (e) {
                log('PreWarm', `Warmup failed for ${batchName}: ${e.message}`);
            }
        }

        log('PreWarm', 'Multi-batch warmup complete.');


        // ─── DC Pre-warm ───────────────────────────────────────────────
        // The biggest bottleneck is Telegram's Data Center migration.
        // Files are stored on DC 1 but we connect to DC 5. The FIRST
        // download triggers a ~10s migration. By downloading a tiny
        // chunk NOW (at startup), we force the migration to happen
        // before any user clicks a video. Subsequent downloads will
        // reuse the already-established DC 1 connection (~1-2s).
        // ────────────────────────────────────────────────────────────────
        const firstVideoMsg = [...mediaCache.values()].find(m => m.media?.document);
        if (firstVideoMsg) {
            try {
                const stream = tg.iterDownload({
                    file: firstVideoMsg.media,
                    offset: bigInt(0),
                    limit: bigInt(256 * 1024),
                    dcId: firstVideoMsg.media.document.dcId,
                    requestSize: 256 * 1024,
                });
                for await (const chunk of stream) {
                    log('PreWarm', `DC warm-up complete! Got ${chunk.length} bytes. DC connection is now hot.`);
                    break; // only need the first chunk
                }
            } catch (dcErr) {
                log('PreWarm', `DC warm-up error (non-fatal): ${dcErr.message}`);
            }
        }

        log('PreWarm', `✅ READY. ${mediaCache.size} warm entities cached, DC connection warmed.`);
    } catch (err) {
        log('PreWarm', `Error: ${err.message}`);
    }
};

exports.getCodingResources = async (req, res) => {
    log('API', 'getCodingResources called');
    try {
        let codingSubjects = await Subject.find({ course: 'Coding' });
        let subjectIds = codingSubjects.map(s => s._id);

        let materials = await StudyMaterial.find({ subjectId: { $in: subjectIds } }).populate('subjectId');
        let syncing = false;
        const now = Date.now();

        // AUTO-SYNC: If no materials found, trigger background sync
        if (materials.length === 0) {
            console.log("No materials found, triggering background sync...");
            // Run in background to avoid timeout
            exports.syncTelegramVideosInternal().catch(err => console.error("Background sync error:", err));
            syncing = true;
        }

        // Group by batch name
        const grouped = materials.reduce((acc, item) => {
            if (!item.subjectId || !item.subjectId.name) {
                return acc;
            }
            const batchName = item.subjectId.name;
            if (!acc[batchName]) acc[batchName] = [];
            acc[batchName].push(item);
            return acc;
        }, {});

        // Always expose required sections on UI, even while data is syncing.
        for (const batchName of REQUIRED_CODING_BATCHES) {
            if (!grouped[batchName]) grouped[batchName] = [];
        }

        const missingOrEmptyRequired = REQUIRED_CODING_BATCHES.some(
            (batchName) => (grouped[batchName] || []).length === 0
        );

        if (missingOrEmptyRequired && !autoSyncInProgress && now - lastSupremeAutoSyncAt > 5 * 60 * 1000) {
            syncing = true;
            autoSyncInProgress = true;
            lastSupremeAutoSyncAt = now;
            exports.syncTelegramVideosInternal()
                .catch(err => console.error("Required batches auto-sync error:", err))
                .finally(() => {
                    autoSyncInProgress = false;
                    lastSupremeAutoSyncAt = Date.now();
                });
        }

        res.json({
            success: true,
            data: grouped,
            syncing
        });
    } catch (err) {
        require('fs').appendFileSync('debug.log', `[${new Date().toISOString()}] [ERROR] getCodingResources: ${err.message}\n`);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Internal sync function (no req/res)
exports.syncTelegramVideosInternal = async () => {
    const channelUsername = "VratCodingLectures";

    try {
        const tgClient = await getTelegramClient();
        const channel = cachedChannel || await tgClient.getEntity(channelUsername);
        if (!cachedChannel) cachedChannel = channel;

        // INCREMENTAL SYNC: We don't delete everything, just update/add new ones
        // This prevents the "empty folder" problem during sync.
        const codingSubjects = await Subject.find({ course: 'Coding' });

        let addedCount = 0;
        let currentBatchName = 'DSA Essentials';

        // 1. Get the latest message ID to know where to start
        const webResponse = await axios.get(`https://t.me/s/${channelUsername}`);
        const html = webResponse.data;
        const msgIdRegex = new RegExp(`${channelUsername}\/(\\d+)`, 'g');
        let match;
        let latestId = 410;
        while ((match = msgIdRegex.exec(html)) !== null) {
            latestId = Math.max(latestId, parseInt(match[1]));
        }

        console.log(`Starting High-Speed API Sync from ID ${latestId} downwards...`);

        // 2. Crawl history using high-speed Telegram API
        // Fetch in chunks of 100 for maximum efficiency
        for (let i = latestId + 10; i > 0 && addedCount < 4000; i -= 100) {
            try {
                const batchIds = Array.from({ length: 100 }, (_, k) => i - k).filter(id => id > 0);
                const messages = await tgClient.getMessages(channel, { ids: batchIds });
                
                for (const msg of messages) {
                    if (!msg) continue;
                    const text = msg.message || "";
                    const lowerText = text.toLowerCase();
                    
                    // BATCH DETECTION
                    if (text.includes('➭ 𝐁𝐚𝐭𝐜𝐡 »')) {
                        const bMatch = text.match(/➭\s*𝐁𝐚𝐭𝐜𝐡\s*»\s*([^\n<]+)/i);
                        if (bMatch) {
                            const detected = bMatch[1].trim().toUpperCase();
                            if (detected.includes('DOT')) currentBatchName = 'Dot Web Dev';
                            else if (detected.includes('DELTA')) currentBatchName = 'Rohit Negi Web Dev';
                            else if (detected.includes('ROHIT')) currentBatchName = 'Rohit Negi Web Dev';
                            else if (detected.includes('PW') || detected.includes('FULL STACK')) currentBatchName = 'PW Web Dev';
                            else if (detected.includes('SUPREME')) currentBatchName = 'Supreme DSA';
                        }
                    } else if (lowerText.includes('#dot')) currentBatchName = 'Dot Web Dev';
                    else if (lowerText.includes('#delta')) currentBatchName = 'Rohit Negi Web Dev';
                    else if (lowerText.includes('#pw') || lowerText.includes('#pwstart')) currentBatchName = 'PW Web Dev';
                    else if (lowerText.includes('#supreme')) currentBatchName = 'Supreme DSA';
                    else if (lowerText.includes('#rohitnegi')) currentBatchName = 'Rohit Negi Batch';

                    // MEDIA CHECK (Video or Video-Document)
                    if (msg.media && (msg.video || (msg.media.document && msg.media.document.mimeType?.includes('video')))) {
                        const msgId = msg.id;
                        const url = `https://t.me/${channelUsername}/${msgId}`;
                        
                        // Smart Title Extraction
                        const tMatch = text.match(/➭\s*𝐓𝐢𝐭𝐥𝐞\s*»\s*([^\n]+)/i) || 
                                       text.match(/Lecture\s*\d+\s*:\s*([^\n]+)/i) ||
                                       text.match(/([^\n]+)/);
                        
                        let title = tMatch ? tMatch[1].trim() : `Lecture ${msgId}`;
                        title = title.replace(/<[^>]*>?/gm, '').split('\n')[0].trim();
                        title = title.replace(/@\w+/g, '').replace(/\.mp4/gi, '').replace(/➭/g, '').replace(/»/g, '').trim();

                        const subjectId = await getCodingSubjectId(currentBatchName);

                        await StudyMaterial.findOneAndUpdate(
                            { url },
                            {
                                subjectId,
                                title: title || `${currentBatchName} - Lecture ${msgId}`,
                                type: 'video',
                                description: `Premium batch content for ${currentBatchName}.`
                            },
                            { upsert: true }
                        );
                        addedCount++;
                    }
                }
                console.log(`Synced up to ID ${i - 100}. Total added: ${addedCount}`);
            } catch (batchErr) {
                console.error(`Error syncing batch at ID ${i}:`, batchErr.message);
            }
        }
        
        await ensureRequiredBatchCoverage();
        return addedCount;
    } catch (err) {
        console.error('Deep-sync error:', err.message);
        return 0;
    }
};



exports.syncTelegramVideos = async (req, res) => {
    try {
        const addedCount = await exports.syncTelegramVideosInternal();
        res.json({
            success: true,
            message: `Sync complete. Synced ${addedCount} videos.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Helper functions
async function getCodingSubjectId(batchName) {
    let subject = await Subject.findOne({ course: 'Coding', name: batchName });
    if (!subject) {
        subject = new Subject({
            name: batchName,
            course: 'Coding',
            year: 0,
            semester: 0
        });
        await subject.save();
    }
    return subject._id;
}

async function processTelegramPost(post, channelUsername, currentBatchName) {
    const text = post.text || post.caption || "";
    const messageId = post.message_id;
    
    // Use the passed in currentBatchName if no new hashtag is found
    let batchName = currentBatchName;
    
    if (text.toLowerCase().includes('#delta')) batchName = 'Delta Batch 6.0';
    else if (text.toLowerCase().includes('#dot')) batchName = 'Dot Batch';
    else if (text.toLowerCase().includes('#rohitnegi')) batchName = 'Rohit Negi Batch';
    else if (text.toLowerCase().includes('#supreme')) batchName = 'DSA Supreme Batch';

    const subjectId = await getCodingSubjectId(batchName);
    const url = `https://t.me/${channelUsername}/${messageId}`;
    
    const exists = await StudyMaterial.findOne({ url });
    if (!exists) {
        await new StudyMaterial({
            subjectId,
            title: text.split('\n')[0] || `${batchName} - Lecture ${messageId}`,
            type: 'video',
            url: url,
            description: text
        }).save();
        return true;
    }
    return false;
}

async function ensureRequiredBatchCoverage() {
    const requiredBatches = ['Dot Batch', 'Delta Batch 6.0', 'DSA Essentials', 'DSA Supreme Batch'];
    const subjectMap = {};
    for (const batchName of requiredBatches) {
        const id = await getCodingSubjectId(batchName);
        subjectMap[batchName] = id;
    }

    const counts = {};
    for (const batchName of requiredBatches) {
        counts[batchName] = await StudyMaterial.countDocuments({ subjectId: subjectMap[batchName], type: 'video' });
    }

    // If DSA Essentials is empty but Supreme has many, move a starter set so all tabs have lectures.
    if (counts['DSA Essentials'] === 0 && counts['DSA Supreme Batch'] > 80) {
        const toMove = Math.min(80, Math.floor(counts['DSA Supreme Batch'] / 4));
        const sourceRows = await StudyMaterial.find({
            subjectId: subjectMap['DSA Supreme Batch'],
            type: 'video',
        }).sort({ _id: 1 }).limit(toMove);

        if (sourceRows.length > 0) {
            await StudyMaterial.updateMany(
                { _id: { $in: sourceRows.map((row) => row._id) } },
                { $set: { subjectId: subjectMap['DSA Essentials'] } }
            );
        }
    }
}


exports.streamVideo = async (req, res) => {
    const { msgId } = req.params;
    const streamDebugEnabled = process.env.DEBUG_STREAM === 'true';

    const logMsg = (msg) => {
        if (!streamDebugEnabled) return;
        const data = `[${new Date().toISOString()}] [Stream] ${msg}\n`;
        fs.appendFileSync('debug.log', data);
        console.log(msg);
    };

    const cacheKey = `${msgId}`;
    logMsg(`Request: msgId=${msgId}`);

    try {
        const tgClient = await getTelegramClient();
        
        let message = mediaCache.get(cacheKey);
        if (!message) {
            logMsg(`Cache miss – fetching message ${msgId}...`);
            try {
                let channel;
                try {
                    channel = cachedChannel || await tgClient.getEntity('VratCodingLectures');
                } catch (entityErr) {
                    logMsg(`Entity resolution failed for VratCodingLectures: ${entityErr.message}. Retrying...`);
                    channel = await tgClient.getEntity('VratCodingLectures');
                }
                if (!cachedChannel) cachedChannel = channel;

                logMsg(`Channel resolved: ${channel.title || channel.firstName || 'Unknown'} (ID: ${channel.id})`);
                
                const messages = await tgClient.getMessages(channel, { ids: [parseInt(msgId)] });
                
                if (!messages || messages.length === 0) {
                    logMsg(`[ERROR] No messages returned for msgId ${msgId}`);
                    return res.status(404).send("Video not found");
                }

                const msg = messages[0];
                if (!msg.media && !msg.video) {
                    logMsg(`[ERROR] Message ${msgId} has no media.`);
                    return res.status(404).send("Message has no media");
                }

                message = msg;
                mediaCache.set(cacheKey, message);
                logMsg(`Cached msgId ${msgId}`);
            } catch (resolveErr) {
                logMsg(`[ERROR] Failed to fetch message ${msgId}: ${resolveErr.message}`);
                return res.status(500).send("Telegram Error: " + resolveErr.message);
            }
        } else {
            logMsg(`Cache HIT for ${msgId} – instant serve`);
        }

        const media = message.media || message.video;
        
        logMsg(`Media detected: ${media ? media.className : 'NONE'}`);
        if (media && media.document) logMsg(`Document size: ${media.document.size}`);

        if (!media || (!media.document && !media.video)) {
            logMsg(`[ERROR] Message media is not a document/video file`);
            return res.status(400).send("Message media is not a document/video file");
        }

        const document = media.document || media;
        const fileSize = Number(document.size || media.size || 0);
        const dcId = document.dcId || media.dcId || 1; // Fallback to DC 1
        const range = req.headers.range;
        logMsg(`File size: ${fileSize}, DC: ${dcId}, Range: ${range}`);

        // Determine Content-Type dynamically
        let contentType = "video/mp4";
        if (document.mimeType) {
            contentType = document.mimeType;
        } else if (message.message && message.message.toLowerCase().includes('.pdf')) {
            contentType = "application/pdf";
        }

        const servedFromCache = await tryServeFromCache({
            msgId,
            req,
            res,
            fallbackContentType: contentType,
            fallbackFileSize: fileSize,
            logMsg,
        });
        if (servedFromCache) return;

        // Browser usually requests "bytes=0-" first. Keep first response big to avoid
        // rapid follow-up range requests that cause visible pause after 2-3 seconds.
        const MAX_CHUNK_SIZE = 32 * 1024 * 1024;
        const parsedRange = parseRange(range, fileSize);
        if (!parsedRange) {
            res.status(416).send('Requested range not satisfiable');
            return;
        }
        let { start, end } = parsedRange;
        if (range && (end - start + 1) > MAX_CHUNK_SIZE) {
            end = start + MAX_CHUNK_SIZE - 1;
        }
        
        const chunksize = (end - start) + 1;

        const statusCode = 206;
        const headers = {
            "Content-Range": `bytes ${Number(start)}-${Number(end)}/${Number(fileSize)}`,
            "Accept-Ranges": "bytes",
            "Content-Length": Number(chunksize),
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
            "Connection": "keep-alive",
            "X-Video-Cache": "MISS",
        };

        if (contentType === 'application/zip' || (message.message && message.message.toLowerCase().includes('.zip'))) {
            headers["Content-Disposition"] = `attachment; filename="Delta_Batch_Materials.zip"`;
        }

        res.writeHead(statusCode, headers);
        
        const bigInt = require('big-integer');
        const { Api } = require("telegram");
        
        // MTProto requires offset to be a multiple of 4096 bytes.
        // If we don't align, iterDownload or getFile may be slow or fail.
        const startAligned = Math.floor(start / 4096) * 4096;
        const skip = start - startAligned;
        
        // We need to download from startAligned and enough to cover the original range
        const downloadLimit = (end - startAligned) + 1;

        logMsg(`MTProto download: msgId=${msgId}, start=${start}, startAligned=${startAligned}, skip=${skip}, downloadLimit=${downloadLimit}`);
        
        try {
            const document = media.document || media;
            const stream = tgClient.iterDownload({
                file: media,
                offset: bigInt(startAligned),
                limit: bigInt(downloadLimit),
                dcId: dcId,
                requestSize: 1536 * 1024, // 1.5MB chunks for high-speed streaming
            });

            let totalSent = 0;
            let firstChunk = true;
            const shouldCacheChunk = contentType.startsWith('video/');
            const { tempPath } = getCachePaths(msgId);
            let cacheFd = null;

            if (shouldCacheChunk) {
                try {
                    cacheFd = await fs.promises.open(tempPath, 'r+');
                } catch (_) {
                    cacheFd = await fs.promises.open(tempPath, 'w+');
                }
            }

            for await (let chunk of stream) {
                if (firstChunk) {
                    if (skip > 0) {
                        chunk = chunk.slice(skip);
                    }
                    firstChunk = false;
                }

                // Ensure we don't send more than the requested chunksize
                const remaining = chunksize - totalSent;
                if (remaining <= 0) break;

                if (chunk.length > remaining) {
                    chunk = chunk.slice(0, remaining);
                }

                res.write(chunk);
                if (cacheFd) {
                    const chunkOffset = start + totalSent;
                    await cacheFd.write(chunk, 0, chunk.length, chunkOffset);
                }
                totalSent += chunk.length;
            }
            if (cacheFd) {
                await cacheFd.close();
                    cacheFd = null;
                await updatePartialCache({
                    msgId,
                    contentType,
                    fileSize,
                    start,
                    bytesWritten: totalSent,
                    logMsg,
                });
            }
            logMsg(`Streaming complete for msgId=${msgId}. Total sent: ${totalSent} bytes.`);
        } catch (downloadErr) {
            try {
                if (cacheFd) {
                    await cacheFd.close();
                }
            } catch (_) {}
            logMsg(`Streaming Error for msgId=${msgId}: ${downloadErr.message}\n${downloadErr.stack}`);
        }
        res.end();

    } catch (err) {
        const errorStack = err.stack || 'No stack trace';
        require('fs').appendFileSync('debug.log', `[ERROR] ${new Date().toISOString()} - ${err.message}\n${errorStack}\n`);
        console.error("Stream error for msgId", msgId, ":", err);
        
        // If it's an entity error, clear the cache to force re-resolution next time
        if (err.message.includes('entity') || err.message.includes('Peer')) {
            cachedChannel = null;
        }

        if (!res.headersSent) {
            res.status(500).send("Streaming Error: " + err.message);
        }
    }
};
