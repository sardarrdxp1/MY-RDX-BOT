module.exports.config = {
  name: "adminNotify",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Modified by Zain",
  description: "Notify admin when mentioned or when the 'calladmin' command is used.",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0,
};

module.exports.run = () => {}; // This command doesn't require manual triggering.

module.exports.handleEvent = async function ({ api, event, Users, Threads }) {
  try {
    const adminID = "100086033644262"; // Your Facebook ID here
    const mentions = event.mentions || {};
    const senderID = event.senderID;

    const senderInfo = await Users.getData(senderID);
    const senderName = senderInfo.name || "Unknown User";

    const threadInfo = await Threads.getData(event.threadID);
    const threadName = threadInfo.threadInfo.threadName || "Unknown Group";
    const participants = threadInfo.threadInfo.participantIDs || [];
    const message = event.body || "No text message";

    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");

    // Check if the admin is mentioned
    if (Object.keys(mentions).includes(adminID)) {
      api.sendMessage(
        `[🔔] You were mentioned in a group!\n\n` +
          `👤 **User:** ${senderName} (ID: ${senderID})\n` +
          `📌 **Group Name:** ${threadName}\n` +
          `👥 **Participants:** ${participants.length}\n` +
          `💬 **Message:** "${message}"\n` +
          `⏰ **Time:** ${time}`,
        adminID
      );
    }

    // Check if the "calladmin" command is used
    if (message.toLowerCase().startsWith("calladmin")) {
      const reportMessage = message.slice(9).trim() || "No additional details provided.";
      api.sendMessage(
        `[📲] A user used the 'calladmin' command!\n\n` +
          `👤 **User:** ${senderName} (ID: ${senderID})\n` +
          `📌 **Group Name:** ${threadName}\n` +
          `👥 **Participants:** ${participants.length}\n` +
          `💬 **Report Message:** "${reportMessage}"\n` +
          `⏰ **Time:** ${time}`,
        adminID
      );
    }
  } catch (error) {
    console.error(error);
  }
};
