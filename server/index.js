const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { preWarmConnection } = require('./controllers/codingController');

const app = express();

// Middleware
app.use(cors());
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
