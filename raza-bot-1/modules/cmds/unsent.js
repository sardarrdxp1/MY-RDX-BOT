
module.exports.config = {
    name: "unsent",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Unsend a message by replying to it",
    category: "utility",
    usages: "Reply to a message",
    cooldowns: 2
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    
    if (!messageReply) {
        return api.sendMessage("❌ Please reply to a message you want to unsend!", threadID, messageID);
    }
    
    try {
        await api.unsendMessage(messageReply.messageID);
        
        // Silently unsend the command message too
        setTimeout(() => {
            api.unsendMessage(messageID);
        }, 1000);
    } catch (error) {
        api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
