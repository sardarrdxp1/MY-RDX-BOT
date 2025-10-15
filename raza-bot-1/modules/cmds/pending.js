
module.exports.config = {
    name: "pending",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Show all pending groups",
    category: "admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID } = event;
    
    if (!config.pendingGroups || config.pendingGroups.length === 0) {
        return api.sendMessage("📝 No pending groups at the moment!", threadID, messageID);
    }
    
    const pendingList = config.pendingGroups.map((id, i) => `${i + 1}. ${id}`).join('\n');
    
    const message = `
╔═══════════════════════════╗
║    PENDING GROUPS         ║
╚═══════════════════════════╝

📋 Total Pending: ${config.pendingGroups.length}

${pendingList}

💡 Use approve command to approve a group
    `.trim();
    
    return api.sendMessage(message, threadID, messageID);
};
