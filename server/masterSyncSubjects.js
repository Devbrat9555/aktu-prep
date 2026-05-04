const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');

const masterSubjects = [
    // Semester 1
    { name: 'Engineering Chemistry', year: 1, semester: 1 },
    { name: 'Engineering Mathematics-I', year: 1, semester: 1 },
    { name: 'Basic Electrical Engineering', year: 1, semester: 1 },
    { name: 'Programming for Problem Solving', year: 1, semester: 1 },
    { name: 'Environment & Ecology', year: 1, semester: 1 },
    
    // Semester 2
    { name: 'Engineering Physics', year: 1, semester: 2 },
    { name: 'Engineering Mathematics-II', year: 1, semester: 2 },
    { name: 'Basic Electronics Engineering', year: 1, semester: 2 },
    { name: 'Fundamentals of Mechanical Engineering', year: 1, semester: 2 },
    { name: 'Soft Skills', year: 1, semester: 2 },
    
    // Semester 3
    { name: 'Digital Electronics', year: 2, semester: 3 },
    { name: 'Technical Communication', year: 2, semester: 3 },
    { name: 'Data Structure', year: 2, semester: 3 },
    { name: 'Computer Organization and Architecture', year: 2, semester: 3 },
    { name: 'Discrete Structures & Theory of Logic', year: 2, semester: 3 },
    { name: 'Cyber Security', year: 2, semester: 3 },
    
    // Semester 4
    { name: 'Mathematics-IV', year: 2, semester: 4 },
    { name: 'Universal Human Values', year: 2, semester: 4 },
    { name: 'Operating System', year: 2, semester: 4 },
    { name: 'Theory of Automata and Formal Languages', year: 2, semester: 4 },
    { name: 'Object Oriented Programming with Java', year: 2, semester: 4 },
    { name: 'Python programming', year: 2, semester: 4 },
    
    // Semester 5
    { name: 'Database Management System', year: 3, semester: 5 },
    { name: 'Web Technology', year: 3, semester: 5 },
    { name: 'Design and Analysis of Algorithm', year: 3, semester: 5 },
    { name: 'Data Analytics', year: 3, semester: 5 },
    { name: 'Machine Learning', year: 3, semester: 5 },
    { name: 'Indian Tradition, Culture and Society', year: 3, semester: 5 },
    
    // Semester 6
    { name: 'Software Engineering', year: 3, semester: 6 },
    { name: 'Compiler Design', year: 3, semester: 6 },
    { name: 'Computer Networks', year: 3, semester: 6 },
    { name: 'Big Data', year: 3, semester: 6 },
    { name: 'Project Management', year: 3, semester: 6 },
    { name: 'Constitution of India', year: 3, semester: 6 },
    
    // Semester 7
    { name: 'Artificial Intelligence', year: 4, semester: 7 },
    { name: 'Internet of Things', year: 4, semester: 7 },
    { name: 'Cloud Computing', year: 4, semester: 7 },
    { name: 'Natural Language Processing', year: 4, semester: 7 },
    { name: 'Deep Learning', year: 4, semester: 7 },
    
    // Semester 8
    { name: 'Data Warehousing', year: 4, semester: 8 },
    { name: 'Blockchain Technology', year: 4, semester: 8 },
    { name: 'Distributed Systems', year: 4, semester: 8 }
];

const syncMasterSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for Master Sync...');

        for (const master of masterSubjects) {
            // Find by name (case-insensitive)
            let subject = await Subject.findOne({ 
                name: { $regex: new RegExp(`^${master.name}$`, 'i') },
                course: 'B.Tech'
            });

            if (subject) {
                // Update existing subject
                console.log(`[UPDATING] ${master.name} -> Sem ${master.semester}`);
                subject.year = master.year;
                subject.semester = master.semester;
                await subject.save();
            } else {
                // Create new subject
                console.log(`[CREATING] ${master.name} (Sem ${master.semester})`);
                subject = new Subject({
                    name: master.name,
                    course: 'B.Tech',
                    year: master.year,
                    semester: master.semester
                });
                await subject.save();
            }
        }

        // Optional: Clean up subjects that are NOT in the master list for B.Tech
        // But let's be careful not to delete subjects that might have materials.
        // For now, we only update/create.
        
        console.log('Master Sync complete!');
        process.exit(0);
    } catch (err) {
        console.error('Sync error:', err);
        process.exit(1);
    }
};

syncMasterSubjects();
