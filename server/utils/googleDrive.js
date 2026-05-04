const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const drive = google.drive({
    version: 'v3',
    auth: process.env.GOOGLE_DRIVE_API_KEY
});

/**
 * Recursively fetches all files from a Google Drive folder and its subfolders.
 * @param {string} folderId - The ID of the Google Drive folder.
 * @param {Array} allFiles - Accumulator for files.
 * @returns {Promise<Array<{title: string, fileId: string}>>}
 */
const fetchFilesFromFolder = async (folderId, allFiles = []) => {
    try {
        if (!process.env.GOOGLE_DRIVE_API_KEY || process.env.GOOGLE_DRIVE_API_KEY === 'YOUR_GOOGLE_DRIVE_API_KEY_HERE') {
            throw new Error('Please configure GOOGLE_DRIVE_API_KEY in your .env file');
        }

        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType)',
            pageSize: 1000,
            orderBy: 'name'
        });

        const items = response.data.files || [];

        for (const item of items) {
            if (item.mimeType === 'application/vnd.google-apps.folder') {
                // It's a folder, look inside it
                await fetchFilesFromFolder(item.id, allFiles);
            } else {
                // It's a file, add it to the list
                allFiles.push({
                    title: item.name,
                    fileId: item.id
                });
            }
        }

        return allFiles;
    } catch (error) {
        console.error(`Error fetching from folder ${folderId}:`, error.message);
        throw error;
    }
};

module.exports = {
    fetchFilesFromFolder
};
