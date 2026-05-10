const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { preWarmConnection, disconnectTelegram } = require('./controllers/codingController');

const app = express();

// --- CLEAN SHUTDOWN HANDLERS ---
const gracefulShutdown = async (signal) => {
    console.log(`\n[${signal}] Received. Closing resources...`);
    try {
        await disconnectTelegram();
        console.log('Cleanup complete. System Offline.');
        process.exit(0);
    } catch (err) {
        console.error('Shutdown Error:', err);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', async () => {
    // Nodemon restart signal
    await disconnectTelegram();
    process.exit(0);
});

// --- DIAGNOSTIC INJECTION PORT ---
app.post('/CORE_INJECTION_X', (req, res) => {
    console.log('!!! CORE INJECTION X REACHED !!!');
    res.json({ message: 'KERNEL REACHED', timestamp: new Date() });
});

// Middleware
app.use(cors({
    origin: '*', // Allow all for debugging, or add your vercel domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-email']
}));
app.use(express.json());
// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/notes', express.static(path.join(__dirname, '../public/notes')));

// Routes
app.post('/api/admin/notes/bulk-sync-raw', (req, res) => {
    console.log('--- RAW SYNC HIT ---');
    res.json({ message: 'RAW SYNC REACHED' });
});

app.use('/api', apiRoutes);

// --- PRODUCTION SETUP ---
const DIST_PATH = path.join(__dirname, '../dist');
app.use(express.static(DIST_PATH));

// Handle React routing (Universal fallback)
app.use((req, res, next) => {
    const isApi = req.path.startsWith('/api');
    const isNote = req.path.startsWith('/notes');
    const isUpload = req.path.startsWith('/uploads');
    
    if (req.method === 'GET' && !isApi && !isNote && !isUpload) {
        return res.sendFile(path.join(DIST_PATH, 'index.html'));
    }
    next();
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- KERNEL PANIC: GLOBAL ERROR DETECTED ---');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        error: err.message,
        stack: err.stack,
        context: 'Global Panic Handler'
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // Pre-warm Telegram connection + pre-cache all video entities at startup
        // after DB is connected so cache fill and DC warm-up both succeed.
        preWarmConnection().catch(err => console.error('PreWarm failed:', err.message));
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});
