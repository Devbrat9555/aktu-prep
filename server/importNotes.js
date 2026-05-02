const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

const NOTES_PATH = path.join(__dirname, '../public/notes');

const abbreviationMap = {
    'COA': 'Computer Organization & Architecture',
    'TOC': 'Theory of Automata and Formal Languages',
    'DAA': 'Design and Analysis of Algorithms',
    'DBMS': 'Database Management Systems',
    'PPS': 'Programming for Problem Solving',
    'OOPS JAVA': 'Object Oriented Programming',
    'DATA STRUCTURE': 'Data Structures',
    'COMPUTER NETWORK': 'Computer Networks',
    'OPERATING SYSTEM': 'Operating Systems',
    'AI': 'Artificial Intelligence',
    'WEB TECHNOLOGY': 'Web Technology',
    'Compiler Design': 'Compiler Design',
    'CLOUD COMPUTING': 'Cloud Computing',
    'BIG DATA': 'Big Data',
    'PYTHON': 'Python Programming',
    'SOFTWARE ENGINEERING': 'Software Engineering',
    'NLP': 'Natural Language Processing',
    'MACHINE LEARNING': 'Machine Learning',
    'DEEP LEARNING': 'Deep Learning',
    'DATA ANALYTICS': 'Data Analytics',
    'DATA WAREHOUSING': 'Data Warehousing',
    'CYBER SECURITY': 'Cyber Security',
    'TECHNICAL COMMUNICATION': 'Technical Communication',
    'CONSTITUTION OF INDIA': 'Constitution of India',
    'SOFT SKILL': 'Soft Skill',
    'UHV': 'Universal Human Values',
    'MATH 1': 'Engineering Mathematics I',
    'MATH 2': 'Engineering Mathematics II',
    'MATH 4': 'Engineering Mathematics IV',
    'CHEMISTRY': 'Engineering Chemistry',
    'PHYSICS': 'Engineering Physics',
    'ELECTRICAL ENG 1ST YEAR': 'Basic Electrical Engineering',
    'ELECTRONIS ENG 1ST YEAR': 'Basic Electronics Engineering',
    'FMS MECHNICAL ENG 1ST YEAR': 'Fundamentals of Mechanical Engineering',
    'FME': 'Fundamentals of Mechanical Engineering',
    'DISCRETE MATH': 'Discrete Structures & Theory of Logic',
    'DIGITAL LOGIC': 'Digital System Design',
    'IOT': 'Internet of Things',
    'SOFT COMPUTING': 'Soft Computing',
    'COMPUTER GRAPHICS': 'Computer Graphics',
    'PROJECT MANAGEMENT': 'Project Management',
    'EVS': 'Environment & Ecology',
    'ITCS': 'Indian Tradition, Culture and Society'
};

const semesterMapping = {
    // Semester 1
    'MATH 1': { year: 1, semester: 1 },
    'CHEMISTRY': { year: 1, semester: 1 },
    'PPS': { year: 1, semester: 1 },
    'ELECTRICAL ENG 1ST YEAR': { year: 1, semester: 1 },
    'SOFT SKILL': { year: 1, semester: 1 },
    // Semester 2
    'MATH 2': { year: 1, semester: 2 },
    'PHYSICS': { year: 1, semester: 2 },
    'TECHNICAL COMMUNICATION': { year: 1, semester: 2 },
    'UHV': { year: 1, semester: 2 },
    'ELECTRONIS ENG 1ST YEAR': { year: 1, semester: 2 },
    'FMS MECHNICAL ENG 1ST YEAR': { year: 1, semester: 2 },
    'EVS': { year: 1, semester: 2 },
    // Semester 3
    'DATA STRUCTURE': { year: 2, semester: 3 },
    'COA': { year: 2, semester: 3 },
    'DISCRETE MATH': { year: 2, semester: 3 },
    'DIGITAL LOGIC': { year: 2, semester: 3 },
    'TECHNICAL COMMUNICATION (3RD)': { year: 2, semester: 3 },
    'ITCS': { year: 2, semester: 3 },
    // Semester 4
    'OPERATING SYSTEM': { year: 2, semester: 4 },
    'DAA': { year: 2, semester: 4 },
    'TOC': { year: 2, semester: 4 },
    'PYTHON': { year: 2, semester: 4 },
    'CYBER SECURITY': { year: 2, semester: 4 },
    'MATH 4': { year: 2, semester: 4 },
    'COMPUTER GRAPHICS': { year: 2, semester: 4 },
    // Semester 5
    'DBMS': { year: 3, semester: 5 },
    'Compiler Design': { year: 3, semester: 5 },
    'SOFTWARE ENGINEERING': { year: 3, semester: 5 },
    'WEB TECHNOLOGY': { year: 3, semester: 5 },
    'CONSTITUTION OF INDIA': { year: 3, semester: 5 },
    'OOPS JAVA': { year: 3, semester: 5 },
    // Semester 6
    'COMPUTER NETWORK': { year: 3, semester: 6 },
    'AI': { year: 3, semester: 6 },
    'IOT': { year: 3, semester: 6 },
    'BIG DATA': { year: 3, semester: 6 },
    'SOFT COMPUTING': { year: 3, semester: 6 },
    // Semester 7
    'MACHINE LEARNING': { year: 4, semester: 7 },
    'DEEP LEARNING': { year: 4, semester: 7 },
    'NLP': { year: 4, semester: 7 },
    'CLOUD COMPUTING': { year: 4, semester: 7 },
    // Semester 8
    'PROJECT MANAGEMENT': { year: 4, semester: 8 },
    'DATA WAREHOUSING': { year: 4, semester: 8 },
    'DATA ANALYTICS': { year: 4, semester: 8 },
};

const importNotes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for notes import...');

        // Clear existing local notes entries to prevent duplicates
        await StudyMaterial.deleteMany({ type: 'notes', url: { $regex: /^\/notes\// } });

        const folders = fs.readdirSync(NOTES_PATH);
        
        for (const folder of folders) {
            const folderPath = path.join(NOTES_PATH, folder);
            if (!fs.lstatSync(folderPath).isDirectory()) continue;

            const files = fs.readdirSync(folderPath);
            if (files.length === 0) continue;

            const searchName = abbreviationMap[folder] || folder;
            const mapping = semesterMapping[folder] || { year: 1, semester: 1 };
            
            let subject = await Subject.findOne({ 
                $or: [
                    { name: { $regex: new RegExp(`^${searchName}$`, 'i') } },
                    { name: { $regex: new RegExp(searchName, 'i') } }
                ],
                course: 'B.Tech'
            });

            if (!subject) {
                console.log(`[NEW SUBJECT] Creating ${searchName} (Year ${mapping.year}, Sem ${mapping.semester})...`);
                subject = new Subject({
                    name: searchName,
                    course: 'B.Tech',
                    year: mapping.year,
                    semester: mapping.semester
                });
                await subject.save();
            } else {
                // Update existing subject metadata if it's default
                if (subject.year !== mapping.year || subject.semester !== mapping.semester) {
                    console.log(`[UPDATING METADATA] ${subject.name} -> Year ${mapping.year}, Sem ${mapping.semester}`);
                    subject.year = mapping.year;
                    subject.semester = mapping.semester;
                    await subject.save();
                }
            }

            console.log(`[SYNCING] ${subject.name} - ${files.length} files`);

            for (const file of files) {
                const fileUrl = `/notes/${folder}/${file}`;
                
                // Smart Title Formatting
                let title = file.replace('.pdf', '').replace(/-/g, ' ').replace(/_/g, ' ');
                
                // Extract Unit Number
                const unitMatch = title.match(/(?:Unit|Unit-|\bU)\s*(\d+)/i);
                const unitNumber = unitMatch ? parseInt(unitMatch[1]) : null;

                // Capitalize important words
                title = title.split(' ')
                    .map(word => word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
                    .join(' ');

                await new StudyMaterial({
                    subjectId: subject._id,
                    title: title,
                    type: 'notes',
                    url: fileUrl,
                    unit: unitNumber,
                    description: `Complete study notes for ${subject.name}${unitNumber ? ` - Unit ${unitNumber}` : ''}`
                }).save();
            }
        }

        console.log('Successfully synced all B.Tech notes!');
        process.exit();
    } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
    }
};

importNotes();
