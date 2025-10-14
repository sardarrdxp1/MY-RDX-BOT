
module.exports.config = {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Get user ID",
    commandCategory: "info",
    usages: "[tag/reply/leave empty]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;
    
    // If replying to a message
    if (type === "message_reply") {
        return api.sendMessage(`User ID: ${messageReply.senderID}`, threadID, messageID);
    }
    
    // If mentioning users
    if (Object.keys(mentions).length > 0) {
        let msg = "";
        for (let id in mentions) {
            msg += `${mentions[id].replace("@", "")}: ${id}\n`;
        }
        return api.sendMessage(msg, threadID, messageID);
    }
    
    // If no mention or reply, return sender's ID
    return api.sendMessage(`Your ID: ${senderID}`, threadID, messageID);
};
