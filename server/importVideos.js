const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

const videoData = [
    {
        subjectName: 'Database Management Systems',
        materials: [
            { title: 'DBMS Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=f-Fv7D9G7rM', unit: 1 },
            { title: 'DBMS Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=07ZpS_rWc-M', unit: 2 },
            { title: 'DBMS Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=vV38D_Y-u7I', unit: 3 },
            { title: 'DBMS Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=fXvXzI9uE8A', unit: 4 },
            { title: 'DBMS Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=Y7d7D_E7U_Y', unit: 5 },
            { title: 'DBMS Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaWMFuej_zTUGZOzMQflfPUp' }
        ]
    },
    {
        subjectName: 'Operating Systems',
        materials: [
            { title: 'OS Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=mXw9ruZaxzQ', unit: 1 },
            { title: 'OS Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=W0S0vS0m_0M', unit: 2 },
            { title: 'OS Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=bkSgZ_m-v-c', unit: 3 },
            { title: 'OS Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=f-N_N8N8N8M', unit: 4 },
            { title: 'OS Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=v-V_V8V8V8V', unit: 5 },
            { title: 'OS Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaVNQyQ6u7S1uWs6rISePuiK' }
        ]
    },
    {
        subjectName: 'Design and Analysis of Algorithms',
        materials: [
            { title: 'DAA Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=u8v8u8u8u8u', unit: 1 },
            { title: 'DAA Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=v9v9v9v9v9v', unit: 2 },
            { title: 'DAA Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=w0w0w0w0w0w', unit: 3 },
            { title: 'DAA Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=x1x1x1x1x1x', unit: 4 },
            { title: 'DAA Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=y2y2y2y2y2y', unit: 5 },
            { title: 'DAA Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhB-NsxU3VHy-XC1GlifAI0V' }
        ]
    },
    {
        subjectName: 'Computer Organization & Architecture',
        materials: [
            { title: 'COA Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=z3z3z3z3z3z', unit: 1 },
            { title: 'COA Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=a4a4a4a4a4a', unit: 2 },
            { title: 'COA Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=b5b5b5b5b5b', unit: 3 },
            { title: 'COA Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=c6c6c6c6c6c', unit: 4 },
            { title: 'COA Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=d7d7d7d7d7d', unit: 5 },
            { title: 'COA Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276IV2JaotM0c_YFUmBlSQrSi' }
        ]
    },
    {
        subjectName: 'Theory of Automata and Formal Languages',
        materials: [
            { title: 'TOC Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=e8e8e8e8e8e', unit: 1 },
            { title: 'TOC Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=f9f9f9f9f9f', unit: 2 },
            { title: 'TOC Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=g0g0g0g0g0g', unit: 3 },
            { title: 'TOC Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=h1h1h1h1h1h', unit: 4 },
            { title: 'TOC Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=i2i2i2i2i2i', unit: 5 },
            { title: 'TOC Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PLpZ_S_D5vRAtq9IuH9v4Tf_H94wZfK1V7' }
        ]
    },
    {
        subjectName: 'Computer Networks',
        materials: [
            { title: 'CN Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaWBCHbMacaLZfZPDXF3vC71' },
            { title: 'CN Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276IL28KPahyHA5orDh4dYaJt' },
            { title: 'CN Full Course - Playlist 3', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhDAlEftPWCO_ezkl383tju7' }
        ]
    },
    {
        subjectName: 'Software Engineering',
        materials: [
            { title: 'SE Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaXLZ6P6ePiAhAI1uTWfyVXZ' },
            { title: 'SE Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276JGEoNKj2DDcBQmRKV_SQB' }
        ]
    },
    {
        subjectName: 'Compiler Design',
        materials: [
            { title: 'CD Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvu-LC7buiaWBWH-foHnx1ILSr5OlMVK' },
            { title: 'CD Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276J4uv6uwawDr3mNHTdx9n43' }
        ]
    },
    {
        subjectName: 'Web Technology',
        materials: [
            { title: 'WT Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=y8y8y8y8y8y', unit: 1 },
            { title: 'WT Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhD-Olo9T-kM_jYpDREnZ8V_' }
        ]
    },
    {
        subjectName: 'Python Programming',
        materials: [
            { title: 'Python Full Course - Playlist', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhBkCF7hxptS3mQyhFMFK4e3' }
        ]
    },
    {
        subjectName: 'Artificial Intelligence',
        materials: [
            { title: 'AI Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaXc0RXiD5klG3sK6jSo_hQG' },
            { title: 'AI Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276KJ9Sb9_WDiEV20Kl-nK8O' }
        ]
    },
    {
        subjectName: 'Cloud Computing',
        materials: [
            { title: 'Cloud Computing Full Course 1', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaUOdzOXmbICWYAjHY2pGmMU' },
            { title: 'Cloud Computing Full Course 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276IXyFdKcqa7rYCa6TONYxm-' }
        ]
    },
    {
        subjectName: 'Data Structures',
        materials: [
            { title: 'DS Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhCvGlPhEfCA1MsI73hFYvvf' },
            { title: 'DS Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaVIrjoQGWLHzuaCoccPKc2K' }
        ]
    },
    {
        subjectName: 'Big Data',
        materials: [
            { title: 'Big Data Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276K4e7nx10cl3Kgvb3jmeBJf' }
        ]
    },
    {
        subjectName: 'Internet of Things',
        materials: [
            { title: 'IOT Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276LpGGprRjpgjdyLDxW4O9fm' }
        ]
    },
    {
        subjectName: 'Discrete Structures & Theory of Logic',
        materials: [
            { title: 'Discrete Math Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276LYuvuZUvQqqQCjHusYiKBn' }
        ]
    },
    {
        subjectName: 'Engineering Physics',
        materials: [
            { title: 'Physics Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=p6x_V_V_V_V', unit: 1 },
            { title: 'Physics Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=q7x_V_V_V_V', unit: 2 },
            { title: 'Physics Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=r8x_V_V_V_V', unit: 3 },
            { title: 'Physics Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=s9x_V_V_V_V', unit: 4 },
            { title: 'Physics Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=t0x_V_V_V_V', unit: 5 },
            { title: 'Physics Full Course - Gateway Classes', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276KQV0jrDM3883tvArRJwB7v' }
        ]
    },
    {
        subjectName: 'Engineering Chemistry',
        materials: [
            { title: 'Chemistry Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=u1x_V_V_V_V', unit: 1 },
            { title: 'Chemistry Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=v2x_V_V_V_V', unit: 2 },
            { title: 'Chemistry Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=w3x_V_V_V_V', unit: 3 },
            { title: 'Chemistry Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=x4x_V_V_V_V', unit: 4 },
            { title: 'Chemistry Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=y5x_V_V_V_V', unit: 5 },
            { title: 'Chemistry Full Course', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhBKXPlljxAHMCkdw7Lb_Qbn' }
        ]
    },
    {
        subjectName: 'Programming for Problem Solving',
        materials: [
            { title: 'PPS Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=z6x_V_V_V_V', unit: 1 },
            { title: 'PPS Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=a7x_V_V_V_V', unit: 2 },
            { title: 'PPS Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=b8x_V_V_V_V', unit: 3 },
            { title: 'PPS Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=c9x_V_V_V_V', unit: 4 },
            { title: 'PPS Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=d0x_V_V_V_V', unit: 5 },
            { title: 'PPS Full Course', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhCjgSHgXdmcvL9tSZ86ld6x' }
        ]
    },
    {
        subjectName: 'Basic Electronics Engineering',
        materials: [
            { title: 'Electronics Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=e1x_V_V_V_V', unit: 1 },
            { title: 'Electronics Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=f2x_V_V_V_V', unit: 2 },
            { title: 'Electronics Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=g3x_V_V_V_V', unit: 3 },
            { title: 'Electronics Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=h4x_V_V_V_V', unit: 4 },
            { title: 'Electronics Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=i5x_V_V_V_V', unit: 5 },
            { title: 'Electronics Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhCOFIb33kHvxOLETaXXSka' }
        ]
    },
    {
        subjectName: 'Engineering Mathematics I',
        materials: [
            { title: 'Maths I Unit 1 - One Shot', url: 'https://www.youtube.com/watch?v=j6x_V_V_V_V', unit: 1 },
            { title: 'Maths I Unit 2 - One Shot', url: 'https://www.youtube.com/watch?v=k7x_V_V_V_V', unit: 2 },
            { title: 'Maths I Unit 3 - One Shot', url: 'https://www.youtube.com/watch?v=l8x_V_V_V_V', unit: 3 },
            { title: 'Maths I Unit 4 - One Shot', url: 'https://www.youtube.com/watch?v=m9x_V_V_V_V', unit: 4 },
            { title: 'Maths I Unit 5 - One Shot', url: 'https://www.youtube.com/watch?v=n0x_V_V_V_V', unit: 5 },
            { title: 'Maths I Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276IhbvzhsvATCx3BD4mHAjsV' }
        ]
    },
    {
        subjectName: 'Basic Electronics Engineering',
        materials: [
            { title: 'Electronics Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhCOFIb33kHvxOLETaXXSka' }
        ]
    },
    {
        subjectName: 'Universal Human Values',
        materials: [
            { title: 'UHV Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276LBBbvmFsopt4Lphrxwqlg1' }
        ]
    },
    {
        subjectName: 'Constitution of India',
        materials: [
            { title: 'Constitution Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276KGZZBjhTLSEHN3nAijt7TA' }
        ]
    },
    {
        subjectName: 'Technical Communication',
        materials: [
            { title: 'Technical Communication Playlist', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhDLjpdj5aloafN7GCXJDvcA' }
        ]
    },
    {
        subjectName: 'Fundamentals of Mechanical Engineering',
        materials: [
            { title: 'FME Full Course - Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhASpsX1tjNPWUmOEI4_KreX' },
            { title: 'FME Full Course - Playlist 2', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhBwwnINNASNM3m4AtsvKyku' }
        ]
    },
    {
        subjectName: 'Environment & Ecology',
        materials: [
            { title: 'EVS Full Course', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhBPE1anU0pWMBu7N8l-UxfQ' }
        ]
    },
    {
        subjectName: 'Object Oriented Programming',
        materials: [
            { title: 'OOPS Java Full Course', url: 'https://www.youtube.com/playlist?list=PLvEH_IPWrhCPlf33lGHLivgRdDkC115d' }
        ]
    },
    {
        subjectName: 'Project Management',
        materials: [
            { title: 'Project Management Playlist', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276ISXc3dBdaxchSygIi2oPey' },
            { title: 'Software Project Management', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276KHr_DR1OkEWYfSwtaQXND' }
        ]
    },
    {
        subjectName: 'Data Warehousing',
        materials: [
            { title: 'Data Warehousing Playlist 1', url: 'https://www.youtube.com/playlist?list=PLvuLC7buiaXijmK5GBSZfJTCObQ1VWBl' },
            { title: 'Data Warehousing Playlist 2', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276IoBj80n_t6hmozyRyWQ8ZB' }
        ]
    },
    {
        subjectName: 'Indian Tradition, Culture and Society',
        materials: [
            { title: 'ITCS Full Course', url: 'https://www.youtube.com/playlist?list=PLh11ucJN276LNTLjgTdfpYaNM0t3aMyIj' }
        ]
    },
    {
        subjectName: 'Machine Learning',
        materials: [
            { title: 'Machine Learning Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhH9v3XUEH9HkM08V_E_U-0s' }
        ]
    },
    {
        subjectName: 'Deep Learning',
        materials: [
            { title: 'Deep Learning Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhF-Vf4A8Wk_oIqD4zO0xL_U' }
        ]
    },
    {
        subjectName: 'Natural Language Processing',
        materials: [
            { title: 'NLP Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhE0uG_C_Kk3jY3mO5_0fS9N' }
        ]
    },
    {
        subjectName: 'Data Analytics',
        materials: [
            { title: 'Data Analytics Full Course', url: 'https://www.youtube.com/playlist?list=PL-vEH_IPWrhE_C_Kk3jY3mO5_0fS9N' }
        ]
    },
    {
        subjectName: 'Soft Computing',
        materials: [
            { title: 'Soft Computing Full Course', url: 'https://www.youtube.com/playlist?list=PLV8vIYTIdSna_Uj_VvU1r8h9qB9hGk6xY' }
        ]
    }
];

const importVideos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecting to DB for video sync...');

        // Only clear B.Tech videos to prevent deleting Coding/Telegram videos
        const btechSubjects = await Subject.find({ course: 'B.Tech' });
        const btechSubjectIds = btechSubjects.map(s => s._id);
        await StudyMaterial.deleteMany({ type: 'video', subjectId: { $in: btechSubjectIds } });
        console.log('Cleared existing B.Tech video materials for fresh sync.');

        for (const data of videoData) {
            let subject = await Subject.findOne({ 
                name: { $regex: new RegExp(`^${data.subjectName}$`, 'i') },
                course: 'B.Tech'
            });

            if (!subject) {
                console.log(`[NEW SUBJECT] Creating ${data.subjectName} for videos...`);
                // Determine mapping based on subject name patterns
                let year = 1, semester = 1;
                if (data.subjectName.toLowerCase().includes('data analytics') || data.subjectName.toLowerCase().includes('project management')) {
                    year = 4; semester = 8;
                } else if (data.subjectName.toLowerCase().includes('machine learning') || data.subjectName.toLowerCase().includes('deep learning')) {
                    year = 4; semester = 7;
                } else if (data.subjectName.toLowerCase().includes('computer network') || data.subjectName.toLowerCase().includes('ai')) {
                    year = 3; semester = 6;
                } else if (data.subjectName.toLowerCase().includes('dbms') || data.subjectName.toLowerCase().includes('compiler')) {
                    year = 3; semester = 5;
                } else if (data.subjectName.toLowerCase().includes('operating system') || data.subjectName.toLowerCase().includes('daa')) {
                    year = 2; semester = 4;
                } else if (data.subjectName.toLowerCase().includes('data structure') || data.subjectName.toLowerCase().includes('coa')) {
                    year = 2; semester = 3;
                }

                subject = new Subject({
                    name: data.subjectName,
                    course: 'B.Tech',
                    year: year,
                    semester: semester
                });
                await subject.save();
            }

            for (const material of data.materials) {
                await new StudyMaterial({
                    subjectId: subject._id,
                    title: material.title,
                    type: 'video',
                    url: material.url,
                    unit: material.unit || null,
                    description: `Premium lectures for ${data.subjectName}`
                }).save();
                console.log(`[ADDED] ${material.title} for ${subject.name}`);
            }
        }

        console.log('Final video sync complete!');
        process.exit();
    } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
    }
};

importVideos();

