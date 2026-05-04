const { fetchFilesFromFolder } = require('./utils/googleDrive');

const FOLDER_ID = '1e-oxKRm2DCqgKLJ_cSkEBoW2EROm_Gib';

const run = async () => {
    try {
        console.log('Fetching files from Google Drive...');
        const files = await fetchFilesFromFolder(FOLDER_ID);
        
        console.log('\n--- DRIVE FILES JSON ---');
        console.log(JSON.stringify(files, null, 2));
        console.log('--- END ---\n');
        
        console.log(`Successfully fetched ${files.length} files.`);
    } catch (error) {
        console.error('Failed to fetch files:', error.message);
        console.log('\nTIP: Make sure you have added your GOOGLE_DRIVE_API_KEY to the server/.env file.');
    }
};

run();
