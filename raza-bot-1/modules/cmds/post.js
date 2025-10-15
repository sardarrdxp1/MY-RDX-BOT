
module.exports.config = {
    name: "post",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Create a Facebook post",
    category: "social",
    usages: "<text>",
    cooldowns: 30
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
        return api.sendMessage("❌ Please provide post content!\n\nExample: /post Hello World", threadID, messageID);
    }
    
    const content = args.join(" ");
    
    api.sendMessage("📤 Creating post...", threadID, async (err, info) => {
        try {
            // Facebook doesn't allow automated posting via unofficial API
            api.editMessage("❌ Automated posting is not supported!", info.messageID);
        } catch (error) {
            api.editMessage(`❌ Error: ${error.message}`, info.messageID);
        }
    });
};
