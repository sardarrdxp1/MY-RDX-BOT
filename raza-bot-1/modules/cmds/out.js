
module.exports.config = {
    name: "out",
    version: "1.0.0",
    permission: 1,
    credits: "Kashif Raza",
    description: "Make bot leave the current group",
    category: "admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    
    api.sendMessage("👋 Goodbye! Bot is leaving...", threadID, async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }, messageID);
};
