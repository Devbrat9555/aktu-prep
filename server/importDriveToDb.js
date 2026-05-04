const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

const drive = google.drive({
    version: 'v3',
    auth: process.env.GOOGLE_DRIVE_API_KEY
});

const FOLDER_ID = '1e-oxKRm2DCqgKLJ_cSkEBoW2EROm_Gib';

const abbreviationMap = {
    'COA': 'Computer Organization and Architecture',
    'TOC': 'Theory of Automata and Formal Languages',
    'DAA': 'Design and Analysis of Algorithm',
    'DBMS': 'Database Management System',
    'PPS': 'Programming for Problem Solving',
    'OOPS JAVA': 'Object Oriented Programming with Java',
    'DATA STRUCTURE': 'Data Structure',
    'COMPUTER NETWORK': 'Computer Networks',
    'OPERATING SYSTEM': 'Operating System',
    'AI': 'Artificial Intelligence',
    'WEB TECHNOLOGY': 'Web Technology',
    'Compiler Design': 'Compiler Design',
    'CLOUD COMPUTING': 'Cloud Computing',
    'BIG DATA': 'Big Data',
    'PYTHON': 'Python programming',
    'SOFTWARE ENGINEERING': 'Software Engineering',
    'NLP': 'Natural Language Processing',
    'MACHINE LEARNING': 'Machine Learning',
    'DEEP LEARNING': 'Deep Learning',
    'DATA ANALYTICS': 'Data Analytics',
    'DATA WAREHOUSING': 'Data Warehousing',
    'CYBER SECURITY': 'Cyber Security',
    'TECHNICAL COMMUNICATION': 'Technical Communication',
    'CONSTITUTION OF INDIA': 'Constitution of India',
    'SOFT SKILL': 'Soft Skills',
    'UHV': 'Universal Human Values',
    'MATH 1': 'Engineering Mathematics-I',
    'MATH 2': 'Engineering Mathematics-II',
    'MATH 4': 'Mathematics-IV',
    'CHEMISTRY': 'Engineering Chemistry',
    'PHYSICS': 'Engineering Physics',
    'ELECTRICAL ENG 1ST YEAR': 'Basic Electrical Engineering',
    'ELECTRONIS ENG 1ST YEAR': 'Basic Electronics Engineering',
    'FMS MECHNICAL ENG 1ST YEAR': 'Fundamentals of Mechanical Engineering',
    'FME': 'Fundamentals of Mechanical Engineering',
    'DISCRETE MATH': 'Discrete Structures & Theory of Logic',
    'DIGITAL LOGIC': 'Digital Electronics',
    'IOT': 'Internet of Things',
    'SOFT COMPUTING': 'Soft Computing',
    'COMPUTER GRAPHICS': 'Computer Graphics',
    'PROJECT MANAGEMENT': 'Project Management',
    'EVS': 'Environment & Ecology',
    'ITCS': 'Indian Tradition, Culture and Society'
};

const semesterMapping = {
    'MATH 1': { year: 1, semester: 1 },
    'CHEMISTRY': { year: 1, semester: 1 },
    'PPS': { year: 1, semester: 1 },
    'ELECTRICAL ENG 1ST YEAR': { year: 1, semester: 1 },
    'SOFT SKILL': { year: 1, semester: 1 },
    'MATH 2': { year: 1, semester: 2 },
    'PHYSICS': { year: 1, semester: 2 },
    'TECHNICAL COMMUNICATION': { year: 1, semester: 2 },
    'UHV': { year: 1, semester: 2 },
    'ELECTRONIS ENG 1ST YEAR': { year: 1, semester: 2 },
    'FMS MECHNICAL ENG 1ST YEAR': { year: 1, semester: 2 },
    'EVS': { year: 1, semester: 2 },
    'DATA STRUCTURE': { year: 2, semester: 3 },
    'COA': { year: 2, semester: 3 },
    'DISCRETE MATH': { year: 2, semester: 3 },
    'DIGITAL LOGIC': { year: 2, semester: 3 },
    'ITCS': { year: 2, semester: 3 },
    'OPERATING SYSTEM': { year: 2, semester: 4 },
    'DAA': { year: 2, semester: 4 },
    'TOC': { year: 2, semester: 4 },
    'PYTHON': { year: 2, semester: 4 },
    'CYBER SECURITY': { year: 2, semester: 4 },
    'MATH 4': { year: 2, semester: 4 },
    'COMPUTER GRAPHICS': { year: 2, semester: 4 },
    'DBMS': { year: 3, semester: 5 },
    'Compiler Design': { year: 3, semester: 5 },
    'SOFTWARE ENGINEERING': { year: 3, semester: 5 },
    'WEB TECHNOLOGY': { year: 3, semester: 5 },
    'CONSTITUTION OF INDIA': { year: 3, semester: 5 },
    'OOPS JAVA': { year: 3, semester: 5 },
    'COMPUTER NETWORK': { year: 3, semester: 6 },
    'AI': { year: 3, semester: 6 },
    'IOT': { year: 3, semester: 6 },
    'BIG DATA': { year: 3, semester: 6 },
    'SOFT COMPUTING': { year: 3, semester: 6 },
    'MACHINE LEARNING': { year: 4, semester: 7 },
    'DEEP LEARNING': { year: 4, semester: 7 },
    'NLP': { year: 4, semester: 7 },
    'CLOUD COMPUTING': { year: 4, semester: 7 },
    'PROJECT MANAGEMENT': { year: 4, semester: 8 },
    'DATA WAREHOUSING': { year: 4, semester: 8 },
    'DATA ANALYTICS': { year: 4, semester: 8 },
};

const importFromDrive = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for Drive sync...');

        // Step 1: Clear existing Drive notes to prevent duplicates
        // Note: We only clear ones that have drive links or we can just clear all 'notes' type
        await StudyMaterial.deleteMany({ type: 'notes', url: { $regex: /drive\.google\.com/ } });
        console.log('Cleared existing Drive notes entries.');

        // Step 2: Fetch all folders in the root
        const rootResponse = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id, name)',
            pageSize: 100
        });

        const folders = rootResponse.data.files || [];
        console.log(`Found ${folders.length} subject folders on Drive.`);

        for (const folder of folders) {
            const searchName = abbreviationMap[folder.name] || folder.name;
            const mapping = semesterMapping[folder.name] || { year: 1, semester: 1 };

            // Find or Create Subject
            let subject = await Subject.findOne({ 
                name: { $regex: new RegExp(`^${searchName}$`, 'i') },
                course: 'B.Tech'
            });

            if (!subject) {
                console.log(`[NEW SUBJECT] Creating ${searchName}...`);
                subject = new Subject({
                    name: searchName,
                    course: 'B.Tech',
                    year: mapping.year,
                    semester: mapping.semester
                });
                await subject.save();
            }

            // Fetch files in this folder
            const filesResponse = await drive.files.list({
                q: `'${folder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name)',
                pageSize: 1000
            });

            const files = filesResponse.data.files || [];
            console.log(`[SYNCING] ${searchName} - ${files.length} files`);

            for (const file of files) {
                const driveUrl = `https://drive.google.com/file/d/${file.id}/view?usp=sharing`;
                
                // Smart Title Formatting
                let title = file.name.replace('.pdf', '').replace(/-/g, ' ').replace(/_/g, ' ');
                const unitMatch = title.match(/(?:Unit|Unit-|\bU)\s*(\d+)/i);
                const unitNumber = unitMatch ? parseInt(unitMatch[1]) : null;

                title = title.split(' ')
                    .map(word => word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
                    .join(' ');

                await new StudyMaterial({
                    subjectId: subject._id,
                    title: title,
                    type: 'notes',
                    url: driveUrl,
                    unit: unitNumber,
                    description: `Study notes for ${subject.name}${unitNumber ? ` - Unit ${unitNumber}` : ''} (Fetched from Drive)`
                }).save();
            }
        }

        console.log('Successfully synced all Drive notes to Database!');
        process.exit();
    } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
    }
};

importFromDrive();
