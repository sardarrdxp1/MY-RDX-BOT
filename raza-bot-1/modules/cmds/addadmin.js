
module.exports.config = {
    name: "addadmin",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Add a new admin to the bot",
    category: "admin",
    usages: "<uid or reply>",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID } = event;
    const utils = require("../../raza/utils");
    
    const uid = args[0] || (event.messageReply && event.messageReply.senderID);
    
    if (!uid) {
        return api.sendMessage("❌ Please tag someone or reply to their message to add as admin", threadID, messageID);
    }
    
    if (config.adminUIDs.includes(uid)) {
        return api.sendMessage("⚠️ This user is already an admin!", threadID, messageID);
    }
    
    config.adminUIDs.push(uid);
    utils.saveConfig(config);
    
    const message = `
╔═══════════════════════════╗
║      ADMIN ADDED          ║
╚═══════════════════════════╝

✅ Successfully added admin!
👤 User ID: ${uid}
📊 Total Admins: ${config.adminUIDs.length}
    `.trim();
    
    return api.sendMessage(message, threadID, messageID);
};
