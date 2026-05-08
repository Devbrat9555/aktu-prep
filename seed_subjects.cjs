const axios = require('axios');

const API_URL = 'https://aktu-prep.onrender.com/api';

const subjectsToSeed = [
    // B.Pharm
    { name: 'B.Pharm 1st Sem Notes', course: 'B.Pharm', year: 1, semester: 1 },
    { name: 'B.Pharm 2nd Sem Notes', course: 'B.Pharm', year: 1, semester: 2 },
    { name: 'B.Pharm 3rd Sem Notes', course: 'B.Pharm', year: 2, semester: 3 },
    { name: 'B.Pharm 4th Sem Notes', course: 'B.Pharm', year: 2, semester: 4 },
    { name: 'B.Pharm 5th Sem Notes', course: 'B.Pharm', year: 3, semester: 5 },
    { name: 'B.Pharm 6th Sem Notes', course: 'B.Pharm', year: 3, semester: 6 },
    { name: 'B.Pharm 7th Sem Notes', course: 'B.Pharm', year: 4, semester: 7 },
    { name: 'B.Pharm 8th Sem Notes', course: 'B.Pharm', year: 4, semester: 8 },
    
    // MBA
    { name: 'MBA 1st Sem Notes', course: 'MBA', year: 1, semester: 1 },
    { name: 'MBA 2nd Sem Notes', course: 'MBA', year: 1, semester: 2 },
    { name: 'MBA 3rd Sem Notes', course: 'MBA', year: 2, semester: 3 },
    { name: 'MBA 4th Sem Notes', course: 'MBA', year: 2, semester: 4 }
];

async function seed() {
    console.log('Starting Subject Seeding to /api/subjects...');
    for (const subject of subjectsToSeed) {
        try {
            // Using public POST /api/subjects as found in routes
            const res = await axios.post(`${API_URL}/subjects`, subject);
            console.log(`Successfully seeded: ${subject.name}`);
        } catch (err) {
            console.error(`Failed to seed ${subject.name}: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
        }
    }
    console.log('Seeding Complete.');
}

seed();
