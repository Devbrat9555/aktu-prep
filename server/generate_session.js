const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

(async () => {
  console.log("--- Telegram Session Generator ---");
  if (!apiId || !apiHash) {
    console.error("Error: Please make sure TELEGRAM_API_ID and TELEGRAM_API_HASH are in your server/.env file.");
    process.exit(1);
  }

  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number (with country code): "),
    password: async () => await input.text("Please enter your password (if any): "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("\n✅ Login successful!");
  console.log("--- YOUR NEW STRING SESSION (COPY EVERYTHING BELOW) ---");
  console.log(client.session.save());
  console.log("------------------------------------------------------");
  
  await client.disconnect();
  process.exit(0);
})();
