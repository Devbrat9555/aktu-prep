const axios = require('axios');

const debugHtml = async () => {
    const channelUsername = "VratCodingLectures";
    try {
        const webResponse = await axios.get(`https://t.me/s/${channelUsername}`);
        const html = webResponse.data;
        const messageBlocks = html.split('tgme_widget_message_wrap');
        
        console.log("FIRST BLOCK TEXT (cleaned):");
        console.log(messageBlocks[1].substring(0, 500).replace(/<[^>]*>/g, ' '));
        
        console.log("\nCHECKING FOR HASHTAGS IN ENTIRE HTML:");
        console.log("Contains #Delta:", html.toLowerCase().includes('#delta'));
        console.log("Contains #Dot:", html.toLowerCase().includes('#dot'));
        console.log("Contains #RohitNegi:", html.toLowerCase().includes('#rohitnegi'));
    } catch (err) {
        console.error(err.message);
    }
};

debugHtml();
