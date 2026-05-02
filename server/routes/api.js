const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const contentController = require('../controllers/contentController');
const bookmarkController = require('../controllers/bookmarkController');
const adminController = require('../controllers/adminController');
const codingController = require('../controllers/codingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const adminAuth = require('../middleware/adminAuth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/sync', authController.syncUser);

// Content Routes
router.get('/courses', contentController.getCourses);
router.get('/years', contentController.getYears);
router.get('/semesters', contentController.getSemesters);
router.get('/subjects', contentController.getSubjects);
router.get('/subjects/:id', contentController.getSubjectById);
router.get('/questions', contentController.getQuestions);

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
