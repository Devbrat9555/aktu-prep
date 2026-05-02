const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Question = require('../models/Question');
const StudyMaterial = require('../models/StudyMaterial');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getYears = async (req, res) => {
    const { course } = req.query;
    const yearsMap = { 'B.Tech': 4, 'MBA': 2, 'B.Pharma': 4 };
    const maxYears = yearsMap[course] || 0;
    const years = Array.from({ length: maxYears }, (_, i) => i + 1);
    res.json(years);
};

exports.getSemesters = async (req, res) => {
    const { course, year } = req.query;
    const semesters = [year * 2 - 1, year * 2];
    res.json(semesters);
};

exports.getSubjects = async (req, res) => {
    try {
        const { course, year, semester } = req.query;
        const subjects = await Subject.find({ course, year, semester });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const { subjectId } = req.query;
        if (!subjectId) {
            return res.status(400).json({ error: 'subjectId is required' });
        }
        const questions = await Question.find({ subjectId });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addSubject = async (req, res) => {
    try {
        const { name, course, year, semester } = req.body;
        const subject = new Subject({ name, course, year, semester });
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addQuestion = async (req, res) => {
    try {
        const { subjectId, question, solution, year, difficulty } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const newQuestion = new Question({
            subjectId,
            question,
            solution,
            year,
            difficulty,
            fileUrl
        });
        
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudyMaterial = async (req, res) => {
    try {
        const { subjectId } = req.query;
        // Sort by unit number, then by title
        const materials = await StudyMaterial.find({ subjectId }).sort({ unit: 1, title: 1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStudyMaterial = async (req, res) => {
    try {
        const { subjectId, title, type, url, unit, description } = req.body;
        let finalUrl = url;
        if (type === 'notes' && req.file) {
            finalUrl = `/uploads/${req.file.filename}`;
        }
        
        const material = new StudyMaterial({
            subjectId,
            title,
            type,
            url: finalUrl,
            unit: unit || null,
            description
        });
        
        await material.save();
        res.status(201).json(material);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const Feedback = require('../models/Feedback');

// Feedback & Community
exports.createFeedback = async (req, res) => {
    try {
        const { content, type, isAnonymous } = req.body;
        // In a real app, we'd get these from req.auth (Clerk middleware)
        // For now, we'll expect them in the body or use placeholders
        const { userId, userName, userEmail } = req.body; 

        const feedback = new Feedback({
            userId,
            userName,
            userEmail,
            content,
            type,
            isAnonymous
        });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        // Sanitize for public view: remove user details for public requests/vents
        const publicFeedbacks = feedbacks.map(f => ({
            _id: f._id,
            content: f.content,
            type: f.type,
            createdAt: f.createdAt,
            // Only show name if NOT anonymous
            userName: f.isAnonymous ? 'Anonymous Student' : f.userName 
        }));
        res.json(publicFeedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminData = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        const subjectsCount = await Subject.countDocuments();
        const materialsCount = await StudyMaterial.countDocuments();
        const questionsCount = await Question.countDocuments();

        res.json({
            feedbacks, // Admin sees full details including user info
            stats: {
                subjects: subjectsCount,
                materials: materialsCount,
                questions: questionsCount
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
