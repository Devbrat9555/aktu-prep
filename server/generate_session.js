const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require('fs');
require('dotenv').config();

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(""); // Start with empty session

(async () => {
    console.log("Loading interactive session generator...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number (with country code): "),
        password: async () => await input.text("Please enter your password (if any): "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    
    console.log("-----------------------------------------");
    console.log("SUCCESSFULLY LOGGED IN!");
    const sessionString = client.session.save();
    console.log("YOUR SESSION STRING (SAVE THIS):");
    console.log(sessionString);
    console.log("-----------------------------------------");
    
    // Proactively append to .env
    fs.appendFileSync('.env', `\nTELEGRAM_STRING_SESSION=${sessionString}`);
    console.log("Session saved to .env automatically!");
    
    await client.sendMessage("me", { message: "GateQuest Streaming activated!" });
    process.exit(0);
})();
