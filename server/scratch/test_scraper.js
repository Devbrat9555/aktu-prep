const axios = require('axios');

const testScraper = async () => {
    const channelUsername = "VratCodingLectures";
    try {
        console.log(`Fetching https://t.me/s/${channelUsername}...`);
        const webResponse = await axios.get(`https://t.me/s/${channelUsername}`);
        const html = webResponse.data;
        
        console.log("HTML Length:", html.length);
        
        const messageBlocks = html.split('tgme_widget_message_wrap');
        console.log("Found Blocks:", messageBlocks.length);
        
        let currentBatchName = 'DSA Essentials';
        let foundVideos = 0;

        for (const block of messageBlocks) {
            const lowerBlock = block.toLowerCase();
            if (lowerBlock.includes('#delta')) currentBatchName = 'Delta Batch 6.0';
            else if (lowerBlock.includes('#dot')) currentBatchName = 'Dot Batch';
            else if (lowerBlock.includes('#rohitnegi')) currentBatchName = 'Rohit Negi Batch';

            const msgIdMatch = block.match(new RegExp(`${channelUsername}\/(\\d+)`));
            if (msgIdMatch) {
                const msgId = msgIdMatch[1];
                const hasVideo = block.includes('video') || block.includes('media') || block.includes('tgme_widget_message_video');
                
                if (hasVideo) {
                    foundVideos++;
                    console.log(`[${currentBatchName}] Found Video ID: ${msgId}`);
                }
            }
        }
        
        console.log(`Total Videos Found: ${foundVideos}`);
    } catch (err) {
        console.error('Error:', err.message);
    }
};

testScraper();
