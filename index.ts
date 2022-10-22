import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import getWhatsappChatIdFromPhoneNumber from "./utils/getWhatsappChatIdFromPhoneNumber";
import getPromotionTargetsFromDatabase from "./utils/getPromotionTargetsFromDatabase";
import getTemplate from "./utils/getTemplate";
import sleep from "./utils/sleep";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

const DEBUG = (process.env.DEBUG as string) === "true";
const DEBUG_PHONE_NUMBER = process.env.DEBUG_PHONE_NUMBER as string;
const TEMPLATE_NAME = process.env.TEMPLATE_NAME as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

console.log("Settings loaded...");
console.log({ DEBUG, DEBUG_PHONE_NUMBER, TEMPLATE_NAME, DATABASE_NAME });

(async () => {
  const notificationTemplate = await getTemplate(TEMPLATE_NAME);
  const promotionTargets = await getPromotionTargetsFromDatabase(DATABASE_NAME);

  console.log(`Promotion targets loaded...`);
  console.log({ total: promotionTargets.length });

  ///////////////////////// START OF HANDLER ////////////////////////////////

  client.on("ready", async () => {
    console.log("Starting in 5 seconds");
    await sleep(5000);
    for (const promotionTarget of promotionTargets) {
      for (const phoneNumber of promotionTarget.internationalPhoneNumbers) {
        const chatId = getWhatsappChatIdFromPhoneNumber(
          DEBUG ? DEBUG_PHONE_NUMBER : phoneNumber
        );
        await client.sendMessage(chatId, notificationTemplate(promotionTarget));
        console.log("Promotion sent to:", promotionTarget);
        await sleep(2000);
      }
    }
  });

  /////////////////////////// END OF HANDLER /////////////////////////////////

  client.initialize();
})();
