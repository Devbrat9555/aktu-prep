require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Question = require('./models/Question');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to seed data...');

        // Clear existing data
        await Course.deleteMany({});
        await Subject.deleteMany({});
        await Question.deleteMany({});

        // Add Courses
        const courses = await Course.insertMany([
            { name: 'B.Tech' },
            { name: 'MBA' },
            { name: 'B.Pharma' }
        ]);

        const subjectsData = [];

        // --- B.Tech 1st Year 1st Semester (AKTU Focused) ---
        const btech1stSem = [
            'Engineering Mathematics I',
            'Engineering Physics',
            'Engineering Chemistry',
            'Programming for Problem Solving',
            'Basic Electrical Engineering',
            'Fundamentals of Mechanical Engineering',
            'Basic Electronics Engineering',
            'Environment & Ecology',
            'Soft Skills',
            'Technical Communication'
        ];

        btech1stSem.forEach(name => {
            subjectsData.push({ name, course: 'B.Tech', year: 1, semester: 1 });
        });

        const insertedSubjects = await Subject.insertMany(subjectsData);

        // Add placeholder papers
        const allQuestions = insertedSubjects.map(subject => ({
            subjectId: subject._id,
            question: `${subject.name} - Previous Year Paper 2023`,
            solution: `Detailed step-by-step solution for ${subject.name} (2023). Complete notes are available in the Study Material tab.`,
            year: 2023,
            difficulty: 'Medium'
        }));

        await Question.insertMany(allQuestions);

        console.log(`Successfully seeded ${insertedSubjects.length} subjects for 1st Semester.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
