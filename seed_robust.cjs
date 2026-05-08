const axios = require('axios');

const API_URL = 'https://aktu-prep.onrender.com/api';

const subjects = [
    // B.Pharm Sem 1
    { name: 'Human Anatomy & Physiology I', course: 'B.Pharma', year: 1, semester: 1 },
    { name: 'Pharmaceutical Analysis I', course: 'B.Pharma', year: 1, semester: 1 },
    { name: 'Pharmaceutics I', course: 'B.Pharma', year: 1, semester: 1 },
    { name: 'Pharmaceutical Inorganic Chemistry', course: 'B.Pharma', year: 1, semester: 1 },
    
    // B.Pharm Sem 2
    { name: 'Human Anatomy & Physiology II', course: 'B.Pharma', year: 1, semester: 2 },
    { name: 'Pharmaceutical Organic Chemistry I', course: 'B.Pharma', year: 1, semester: 2 },
    { name: 'Biochemistry', course: 'B.Pharma', year: 1, semester: 2 },
    { name: 'Pathophysiology', course: 'B.Pharma', year: 1, semester: 2 },
    
    // B.Pharm Sem 3
    { name: 'Pharmaceutical Organic Chemistry II', course: 'B.Pharma', year: 2, semester: 3 },
    { name: 'Physical Pharmaceutics I', course: 'B.Pharma', year: 2, semester: 3 },
    { name: 'Pharmaceutical Microbiology', course: 'B.Pharma', year: 2, semester: 3 },
    { name: 'Pharmaceutical Engineering', course: 'B.Pharma', year: 2, semester: 3 },
    
    // B.Pharm Sem 4
    { name: 'Pharmaceutical Organic Chemistry III', course: 'B.Pharma', year: 2, semester: 4 },
    { name: 'Medicinal Chemistry I', course: 'B.Pharma', year: 2, semester: 4 },
    { name: 'Physical Pharmaceutics II', course: 'B.Pharma', year: 2, semester: 4 },
    { name: 'Pharmacology I', course: 'B.Pharma', year: 2, semester: 4 },
    { name: 'Pharmacognosy and Phytochemistry I', course: 'B.Pharma', year: 2, semester: 4 },
    
    // B.Pharm Sem 5
    { name: 'Medicinal Chemistry II', course: 'B.Pharma', year: 3, semester: 5 },
    { name: 'Industrial Pharmacy I', course: 'B.Pharma', year: 3, semester: 5 },
    { name: 'Pharmacology II', course: 'B.Pharma', year: 3, semester: 5 },
    { name: 'Pharmacognosy and Phytochemistry II', course: 'B.Pharma', year: 3, semester: 5 },
    { name: 'Pharmaceutical Jurisprudence', course: 'B.Pharma', year: 3, semester: 5 },
    
    // B.Pharm Sem 6
    { name: 'Medicinal Chemistry III', course: 'B.Pharma', year: 3, semester: 6 },
    { name: 'Pharmacology III', course: 'B.Pharma', year: 3, semester: 6 },
    { name: 'Herbal Drug Technology', course: 'B.Pharma', year: 3, semester: 6 },
    { name: 'Biopharmaceutics and Pharmacokinetics', course: 'B.Pharma', year: 3, semester: 6 },
    { name: 'Pharmaceutical Biotechnology', course: 'B.Pharma', year: 3, semester: 6 },
    { name: 'Quality Assurance', course: 'B.Pharma', year: 3, semester: 6 },
    
    // B.Pharm Sem 7
    { name: 'Instrumental Methods of Analysis', course: 'B.Pharma', year: 4, semester: 7 },
    { name: 'Industrial Pharmacy II', course: 'B.Pharma', year: 4, semester: 7 },
    { name: 'Pharmacy Practice', course: 'B.Pharma', year: 4, semester: 7 },
    { name: 'Novel Drug Delivery System', course: 'B.Pharma', year: 4, semester: 7 },
    
    // B.Pharm Sem 8
    { name: 'Biostatistics and Research Methodology', course: 'B.Pharma', year: 4, semester: 8 },
    { name: 'Social and Preventive Pharmacy', course: 'B.Pharma', year: 4, semester: 8 },
    { name: 'Pharma Marketing Management', course: 'B.Pharma', year: 4, semester: 8 },
    { name: 'Pharmaceutical Regulatory Science', course: 'B.Pharma', year: 4, semester: 8 },
    
    // MBA Sem 1
    { name: 'Management Concepts & Organisational Behaviour', course: 'MBA', year: 1, semester: 1 },
    { name: 'Managerial Economics', course: 'MBA', year: 1, semester: 1 },
    { name: 'Financial Accounting & Analysis', course: 'MBA', year: 1, semester: 1 },
    { name: 'Business Statistics & Analytics', course: 'MBA', year: 1, semester: 1 },
    { name: 'Marketing Management', course: 'MBA', year: 1, semester: 1 },
    { name: 'Design Thinking', course: 'MBA', year: 1, semester: 1 },
    { name: 'Business Communication', course: 'MBA', year: 1, semester: 1 },
    
    // MBA Sem 2
    { name: 'Human Resource Management', course: 'MBA', year: 1, semester: 2 },
    { name: 'Financial Management', course: 'MBA', year: 1, semester: 2 },
    { name: 'Operations Management', course: 'MBA', year: 1, semester: 2 },
    { name: 'Business Analytics', course: 'MBA', year: 1, semester: 2 },
    { name: 'Business Environment & Legal Aspects', course: 'MBA', year: 1, semester: 2 },
    
    // MBA Sem 3
    { name: 'Strategic Management', course: 'MBA', year: 2, semester: 3 },
    { name: 'Innovation and Entrepreneurship', course: 'MBA', year: 2, semester: 3 },
    
    // MBA Sem 4
    { name: 'Project Management', course: 'MBA', year: 2, semester: 4 },
    { name: 'Corporate Governance & Ethics', course: 'MBA', year: 2, semester: 4 }
];

async function seed() {
    console.log('Robust Seeding started...');
    
    for (const s of subjects) {
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!success && attempts < maxAttempts) {
            try {
                // Check if exists first (to avoid duplicates)
                const check = await axios.get(`${API_URL}/subjects?course=${s.course}&year=${s.year}&semester=${s.semester}`);
                const existing = check.data.find(item => item.name === s.name);
                
                if (existing) {
                    console.log('EXISTS: ' + s.name);
                    success = true;
                    continue;
                }
                
                await axios.post(`${API_URL}/subjects`, s);
                console.log('OK: ' + s.name);
                success = true;
            } catch (e) {
                attempts++;
                console.log('RETRY (' + attempts + '): ' + s.name + ' - ' + (e.response?.status || e.message));
                await new Promise(r => setTimeout(r, 2000)); // Wait before retry
            }
        }
        
        if (!success) {
            console.log('GIVING UP: ' + s.name);
        }
    }
    console.log('Seeding Complete.');
}

seed();
