
module.exports.config = {
    name: "admin",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Show list of bot admins",
    category: "admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID } = event;
    
    if (!config.adminUIDs || config.adminUIDs.length === 0) {
        return api.sendMessage("⚠️ No admins configured for this bot", threadID, messageID);
    }
    
    const adminList = config.adminUIDs.map((uid, i) => `${i + 1}. ${uid}`).join('\n');
    
    const message = `
╔═══════════════════════════╗
║      BOT ADMINS           ║
╚═══════════════════════════╝

👑 Total Admins: ${config.adminUIDs.length}

${adminList}
    `.trim();
    
    return api.sendMessage(message, threadID, messageID);
};
