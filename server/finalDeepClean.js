const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');

const fullTargetList = [
    // Year 1
    { name: 'Engineering Chemistry', year: 1, semester: 1 },
    { name: 'Engineering Mathematics-I', year: 1, semester: 1 },
    { name: 'Basic Electrical Engineering', year: 1, semester: 1 },
    { name: 'Programming for Problem Solving', year: 1, semester: 1 },
    { name: 'Environment & Ecology', year: 1, semester: 1 },
    { name: 'Engineering Physics', year: 1, semester: 2 },
    { name: 'Engineering Mathematics-II', year: 1, semester: 2 },
    { name: 'Basic Electronics Engineering', year: 1, semester: 2 },
    { name: 'Fundamentals of Mechanical Engineering', year: 1, semester: 2 },
    { name: 'Soft Skills', year: 1, semester: 2 },
    
    // Year 2
    { name: 'Digital Electronics', year: 2, semester: 3 },
    { name: 'Technical Communication', year: 2, semester: 3 },
    { name: 'Data Structure', year: 2, semester: 3 },
    { name: 'Computer Organization and Architecture', year: 2, semester: 3 },
    { name: 'Discrete Structures & Theory of Logic', year: 2, semester: 3 },
    { name: 'Cyber Security', year: 2, semester: 3 },
    { name: 'Mathematics-IV', year: 2, semester: 4 },
    { name: 'Universal Human Values', year: 2, semester: 4 },
    { name: 'Operating System', year: 2, semester: 4 },
    { name: 'Theory of Automata and Formal Languages', year: 2, semester: 4 },
    { name: 'Object Oriented Programming with Java', year: 2, semester: 4 },
    { name: 'Python programming', year: 2, semester: 4 },
    { name: 'Computer Graphics', year: 2, semester: 4 },
    
    // Year 3
    { name: 'Database Management System', year: 3, semester: 5 },
    { name: 'Web Technology', year: 3, semester: 5 },
    { name: 'Design and Analysis of Algorithm', year: 3, semester: 5 },
    { name: 'Data Analytics', year: 3, semester: 5 },
    { name: 'Machine Learning', year: 3, semester: 5 },
    { name: 'Indian Tradition, Culture and Society', year: 3, semester: 5 },
    { name: 'Software Engineering', year: 3, semester: 6 },
    { name: 'Compiler Design', year: 3, semester: 6 },
    { name: 'Computer Networks', year: 3, semester: 6 },
    { name: 'Big Data', year: 3, semester: 6 },
    { name: 'Project Management', year: 3, semester: 6 },
    { name: 'Constitution of India', year: 3, semester: 6 },
    { name: 'Soft Computing', year: 3, semester: 6 },
    
    // Year 4
    { name: 'Artificial Intelligence', year: 4, semester: 7 },
    { name: 'Internet of Things', year: 4, semester: 7 },
    { name: 'Cloud Computing', year: 4, semester: 7 },
    { name: 'Natural Language Processing', year: 4, semester: 7 },
    { name: 'Deep Learning', year: 4, semester: 8 }, // Inferred
    { name: 'Data Warehousing', year: 4, semester: 8 },
    { name: 'Blockchain Technology', year: 4, semester: 8 },
    { name: 'Distributed Systems', year: 4, semester: 8 }
];

const finalDeepClean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for FINAL Deep Clean...');

        const keptIds = [];

        for (const target of fullTargetList) {
            let subject = await Subject.findOne({ 
                name: { $regex: new RegExp(`^${target.name}$`, 'i') },
                course: 'B.Tech'
            });

            if (subject) {
                console.log(`[KEEPING] ${target.name} (Sem ${target.semester})`);
                subject.year = target.year;
                subject.semester = target.semester;
                await subject.save();
                keptIds.push(subject._id.toString());
            } else {
                console.log(`[CREATING] ${target.name} (Sem ${target.semester})`);
                const newSub = new Subject({
                    name: target.name,
                    course: 'B.Tech',
                    year: target.year,
                    semester: target.semester
                });
                await newSub.save();
                keptIds.push(newSub._id.toString());
            }
        }

        // DELETE EVERYTHING ELSE for B.Tech
        const deleteRes = await Subject.deleteMany({ 
            course: 'B.Tech', 
            _id: { $nin: keptIds } 
        });

        console.log(`Final Deep Clean complete! Deleted ${deleteRes.deletedCount} redundant subjects.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

finalDeepClean();
