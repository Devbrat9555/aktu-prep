const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Subject = require('../models/Subject');
const Question = require('../models/Question');
const StudyMaterial = require('../models/StudyMaterial');

// User Management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.adminAddUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password || 'PIT_OS_TEMP_123', 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Feedback & Community Management
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPublicFeedback = async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortCriteria = { createdAt: -1 };
        
        if (sortBy === 'top') {
            const feedbacks = await Feedback.find();
            feedbacks.sort((a, b) => b.likes.length - a.likes.length);
            return res.json(feedbacks.map(f => ({
                _id: f._id,
                content: f.content,
                type: f.type,
                tags: f.tags,
                likes: f.likes.length,
                targetCollege: f.targetCollege,
                targetTeacher: f.targetTeacher,
                createdAt: f.createdAt,
                userName: f.isAnonymous ? 'Anonymous Student' : f.userName
            })));
        }

        const feedback = await Feedback.find().sort(sortCriteria);
        const sanitized = feedback.map(f => ({
            _id: f._id,
            content: f.content,
            type: f.type,
            tags: f.tags,
            likes: f.likes.length,
            targetCollege: f.targetCollege,
            targetTeacher: f.targetTeacher,
            createdAt: f.createdAt,
            userName: f.isAnonymous ? 'Anonymous Student' : f.userName
        }));
        res.json(sanitized);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Feedback.findById(id);
        
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json({ likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const { userId, userName, userEmail, content, type, isAnonymous, tags, targetCollege, targetTeacher } = req.body;

        // Content Moderation Filter
        const bannedWords = ['sex', 'porn', 'hot', 'nude', 'xxx', 'sexy', 'horny', 'pussy', 'dick', 'fuck', 'ass'];
        const contentLower = content.toLowerCase();
        const containsBanned = bannedWords.some(word => contentLower.includes(word));

        if (containsBanned) {
            return res.status(400).json({ 
                error: 'Your message contains inappropriate language. Please keep the community clean.' 
            });
        }

        const feedback = new Feedback({
            userId,
            userName,
            userEmail,
            content,
            type,
            isAnonymous,
            tags,
            targetCollege,
            targetTeacher
        });
        await feedback.save();
        res.status(201).json({ message: 'Post submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Resource Management
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.find().sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        await StudyMaterial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(material);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const subjectCount = await Subject.countDocuments();
        const materialCount = await StudyMaterial.countDocuments();
        const questionCount = await Question.countDocuments();
        
        res.json({
            users: userCount,
            posts: feedbackCount,
            subjects: subjectCount,
            materials: materialCount,
            questions: questionCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bulkUploadNotes = async (req, res) => {
    console.log('--- STARTING BULK UPLOAD HANDLER ---');
    try {
        const fs = require('fs');
        const path = require('path');
        const files = req.files;
        const relativePaths = req.body.paths;

        console.log(`Received ${files?.length} files and ${Array.isArray(relativePaths) ? relativePaths.length : '1'} paths`);

        if (!files || files.length === 0) {
            console.log('No files received in request');
            return res.status(400).json({ error: 'No files received' });
        }

        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const rawPath = Array.isArray(relativePaths) ? relativePaths[i] : relativePaths;
            console.log(`Processing file: ${file.originalname}, Raw Path: ${rawPath}`);
            
            // Clean up the path
            let relativePath = rawPath;
            if (!relativePath.startsWith('notes/') && !relativePath.startsWith('public/')) {
                relativePath = 'notes/' + relativePath;
            } else if (relativePath.startsWith('public/notes/')) {
                relativePath = relativePath.replace('public/', '');
            }

            const storagePath = path.join(__dirname, '../../public', relativePath);
            const dir = path.dirname(storagePath);
            console.log(`Storage Path: ${storagePath}, Dir: ${dir}`);

            if (!fs.existsSync(dir)) {
                console.log(`Creating directory: ${dir}`);
                fs.mkdirSync(dir, { recursive: true });
            }

            try {
                console.log(`Moving file from ${file.path} to ${storagePath}`);
                fs.copyFileSync(file.path, storagePath);
                fs.unlinkSync(file.path);
            } catch (fileErr) {
                console.error(`FILE OPERATION FAILED:`, fileErr);
                continue;
            }

            const pathParts = relativePath.split('/');
            const subjectName = pathParts[1] || 'General';
            console.log(`Subject Name identified: ${subjectName}`);

            let subject = await Subject.findOne({ name: new RegExp(`^${subjectName}$`, 'i') });
            if (!subject) {
                console.log(`Subject not found, creating: ${subjectName}`);
                subject = new Subject({ 
                    name: subjectName, 
                    course: 'B.Tech', 
                    year: 1, 
                    semester: 1 
                });
                await subject.save();
            }

            const fileName = path.basename(relativePath, '.pdf');
            // Auto-detect unit from filename (e.g., "Unit 1", "U1", "Unit-1")
            const unitMatch = fileName.match(/(?:Unit|U|Unit-)\s*(\d+)/i);
            const unitNumber = unitMatch ? parseInt(unitMatch[1]) : 0;

            const materialData = {
                subjectId: subject._id,
                title: fileName,
                type: 'notes',
                unit: unitNumber,
                url: `/${relativePath}`
            };
            console.log(`Saving StudyMaterial: ${materialData.title} as unit ${unitNumber}`);

            await StudyMaterial.findOneAndUpdate(
                { url: materialData.url },
                materialData,
                { upsert: true, new: true }
            );
            
            results.push(materialData);
        }

        console.log(`Batch injection complete. Successfully processed ${results.length} files.`);
        res.json({ message: `Successfully synced ${results.length} files.`, count: results.length });
    } catch (err) {
        console.error('CRITICAL BULK SYNC CRASH:', err);
        res.status(500).json({ 
            error: err.message, 
            stack: err.stack,
            context: 'Global Catch'
        });
    }
};
