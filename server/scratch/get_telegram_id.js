const axios = require('axios');
require('dotenv').config();

const getChatId = async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`);
        console.log('Updates:', JSON.stringify(response.data, null, 2));
        
        // Try to find the chat ID from the updates
        const updates = response.data.result;
        if (updates.length > 0) {
            const lastUpdate = updates[updates.length - 1];
            if (lastUpdate.message) {
                console.log('Detected Chat ID:', lastUpdate.message.chat.id);
            } else if (lastUpdate.my_chat_member) {
                console.log('Detected Channel ID:', lastUpdate.my_chat_member.chat.id);
            }
        } else {
            console.log('No updates found. Please send a message in the channel or group where the bot is admin.');
        }
    } catch (err) {
        console.error('Error fetching updates:', err.message);
    }
};

getChatId();
