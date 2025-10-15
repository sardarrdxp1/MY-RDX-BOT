
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "hackthechat",
    eventType: ["message", "message_reply"],
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Block messages when chat is locked"
};

module.exports.run = async function({ event, api }) {
    const { threadID, senderID, messageID } = event;
    
    const cachePath = path.join(__dirname, "../commands/cache", "hackthechat.json");
    
    if (!fs.existsSync(cachePath)) {
        return;
    }
    
    let hackData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    if (!hackData[threadID] || !hackData[threadID].enabled) {
        return;
    }
    
    // Don't block bot's own messages
    if (senderID == api.getCurrentUserID()) {
        return;
    }
    
    // Don't block the admin who locked the chat
    if (senderID == hackData[threadID].locked_by) {
        return;
    }
    
    // Block the message by unsending it
    try {
        await api.unsendMessage(messageID);
    } catch (err) {
        console.log("Error blocking message:", err);
    }
};
