const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const contentController = require('../controllers/contentController');
const bookmarkController = require('../controllers/bookmarkController');
const adminController = require('../controllers/adminController');
const codingController = require('../controllers/codingController');
const aiController = require('../controllers/aiController');
const contributionController = require('../controllers/contributionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const adminAuth = require('../middleware/adminAuth');

// AI Routes (Cached)
router.post('/ai/query', aiController.queryAI);

// Contribution Routes
router.post('/contributions/submit', upload.single('file'), contributionController.submitContribution);
router.get('/contributions/approved', contributionController.getApprovedContributions);

// Admin Contribution Management (Protected)
router.get('/admin/contributions/pending', adminAuth, contributionController.getPendingContributions);
router.post('/admin/contributions/:id/approve', adminAuth, contributionController.approveContribution);
router.delete('/admin/contributions/:id', adminAuth, contributionController.deleteContribution);

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/sync', authController.syncUser);
router.post('/auth/profile', authController.updateProfile);

// Content Routes
router.get('/courses', contentController.getCourses);
router.get('/years', contentController.getYears);
router.get('/semesters', contentController.getSemesters);
router.get('/subjects', contentController.getSubjects);
router.get('/subjects/:id', contentController.getSubjectById);
router.get('/questions', contentController.getQuestions);
router.get('/drive/notes', contentController.getDriveNotes);

// Coding Routes
router.get('/coding', codingController.getCodingResources);
router.post('/coding/sync-telegram', adminAuth, codingController.syncTelegramVideos);
router.get('/coding/stream/:msgId', codingController.streamVideo);

// Admin Content Management (Basic)
router.post('/subjects', contentController.addSubject);
router.post('/questions', upload.single('file'), contentController.addQuestion);
router.get('/study-material', contentController.getStudyMaterial);
router.post('/study-material', upload.single('file'), contentController.addStudyMaterial);

// Global Admin Matrix (Protected by Kernel Guard)
router.get('/admin/stats', adminController.getAdminStats);
router.get('/community/feedback', adminController.getPublicFeedback);
router.post('/feedback', adminController.submitFeedback);
router.post('/feedback/:id/like', adminController.likePost);

// --- SECURE KERNEL ZONE ---
router.use('/admin', adminAuth); // Protect all following /admin routes

// Student Contributions Management
router.get('/admin/contributions/pending', contributionController.getPendingContributions);
router.post('/admin/contributions/:id/approve', contributionController.approveContribution);
router.delete('/admin/contributions/:id', contributionController.deleteContribution);

// User Registry
router.get('/admin/users', adminController.getAllUsers);
router.post('/admin/users/add', adminController.adminAddUser);
router.post('/admin/users/:id/toggle-block', adminController.toggleBlockUser);
router.delete('/admin/users/:id', adminController.deleteUser);

// Pulse Monitor
router.get('/admin/feedback', adminController.getAllFeedback);
router.delete('/admin/feedback/:id', adminController.deletePost);

// Resource Matrix
router.get('/admin/subjects', adminController.getAllSubjects);
router.put('/admin/subjects/:id', adminController.updateSubject);
router.delete('/admin/subjects/:id', adminController.deleteSubject);

router.get('/admin/questions', adminController.getAllQuestions);
router.put('/admin/questions/:id', adminController.updateQuestion);
router.delete('/admin/questions/:id', adminController.deleteQuestion);

router.get('/admin/materials', adminController.getAllMaterials);
router.put('/admin/materials/:id', adminController.updateMaterial);
router.delete('/admin/materials/:id', adminController.deleteMaterial);
router.post('/admin/notes/bulk-sync', (req, res, next) => {
    upload.array('files')(req, res, (err) => {
        if (err) {
            console.error('MULTER ERROR:', err);
            return res.status(500).json({ 
                error: 'Multer Error', 
                message: err.message, 
                stack: err.stack 
            });
        }
        next();
    });
}, adminController.bulkUploadNotes);

// Bookmark Routes (Protected)
router.post('/bookmark', auth, bookmarkController.addBookmark);
router.get('/bookmark', auth, bookmarkController.getBookmarks);

module.exports = router;
