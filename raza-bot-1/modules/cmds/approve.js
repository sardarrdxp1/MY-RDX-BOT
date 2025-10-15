
module.exports.config = {
    name: "approve",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Approve a pending group",
    category: "admin",
    usages: "[threadID]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID, isGroup } = event;
    const utils = require("../../raza/utils");
    
    if (!isGroup) {
        return api.sendMessage("❌ This command is only for groups!", threadID, messageID);
    }
    
    const targetThreadID = args[0] || threadID;
    
    if (!config.pendingGroups) config.pendingGroups = [];
    if (!config.approvedGroups) config.approvedGroups = [];
    
    const index = config.pendingGroups.indexOf(targetThreadID);
    if (index === -1) {
        return api.sendMessage("⚠️ This group is not in pending list!", threadID, messageID);
    }
    
    config.pendingGroups.splice(index, 1);
    config.approvedGroups.push(targetThreadID);
    utils.saveConfig(config);
    
    const message = `
╔═══════════════════════════╗
║    GROUP APPROVED         ║
╚═══════════════════════════╝

✅ Group approved successfully!
🆔 Thread ID: ${targetThreadID}
📊 Pending Groups: ${config.pendingGroups.length}
    `.trim();
    
    api.sendMessage(message, threadID, messageID);
    api.sendMessage("🎉 Your group has been approved by the admin!", targetThreadID);
};
