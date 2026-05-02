const axios = require('axios');

const checkWords = async () => {
    const channelUsername = "VratCodingLectures";
    try {
        const webResponse = await axios.get(`https://t.me/s/${channelUsername}`);
        const html = webResponse.data.toLowerCase();
        
        console.log("Contains 'delta':", html.includes('delta'));
        console.log("Contains 'dot':", html.includes('dot'));
        console.log("Contains 'rohit negi':", html.includes('rohit negi'));
    } catch (err) {
        console.error(err.message);
    }
};

checkWords();
