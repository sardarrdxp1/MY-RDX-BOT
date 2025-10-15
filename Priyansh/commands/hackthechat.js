const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "hackthechat",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Lock the chat so no one can send messages",
    commandCategory: "Admin",
    usages: "hackthechat on/off",
    cooldowns: 10
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID, messageID, body } = event;
    
    console.log(`[HACK DEBUG] Event triggered - Thread: ${threadID}, Sender: ${senderID}, Message: ${body || 'no body'}`);
    
    const cachePath = path.join(__dirname, "cache", "hackthechat.json");
    
    if (!fs.existsSync(cachePath)) {
        console.log("[HACK DEBUG] Cache file not found");
        return;
    }
    
    let hackData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    console.log(`[HACK DEBUG] Cache data:`, hackData);
    
    if (!hackData[threadID] || !hackData[threadID].enabled) {
        console.log(`[HACK DEBUG] Chat not locked for thread ${threadID}`);
        return;
    }
    
    // Don't block bot's own messages
    if (senderID == api.getCurrentUserID()) {
        console.log("[HACK DEBUG] Bot's own message, skipping");
        return;
    }
    
    // Block ALL messages - group is completely dead
    console.log(`[HACK THE CHAT] Attempting to block message ${messageID} from user ${senderID}`);
    try {
        await api.unsendMessage(messageID);
        console.log(`[HACK THE CHAT] Successfully blocked message from user ${senderID} in thread ${threadID}`);
    } catch (err) {
        console.log("[HACK THE CHAT] Error blocking message:", err);
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    const cachePath = path.join(__dirname, "cache", "hackthechat.json");

    if (!fs.existsSync(cachePath)) {
        fs.writeFileSync(cachePath, JSON.stringify({}, null, 4));
    }

    let hackData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));

    if (args[0] === "on") {
        hackData[threadID] = {
            enabled: true,
            locked_by: event.senderID,
            locked_at: Date.now()
        };

        fs.writeFileSync(cachePath, JSON.stringify(hackData, null, 4));

        return api.sendMessage(
            `✅ Chat Locked Successfully!\n\n` +
            `🔒 No one can send messages in this group now.\n` +
            `📝 All message attempts will be blocked.\n\n` +
            `To unlock, use: hackthechat off`,
            threadID,
            messageID
        );

    } else if (args[0] === "off") {
        if (!hackData[threadID] || !hackData[threadID].enabled) {
            return api.sendMessage("⚠️ Chat is not locked!", threadID, messageID);
        }

        delete hackData[threadID];
        fs.writeFileSync(cachePath, JSON.stringify(hackData, null, 4));

        return api.sendMessage(
            `🔓 Chat Unlocked!\n\n` +
            `Members can now send messages freely.`,
            threadID,
            messageID
        );

    } else {
        const status = hackData[threadID] && hackData[threadID].enabled ? "🔒 Locked" : "🔓 Unlocked";

        return api.sendMessage(
            `📋 Hack The Chat Command\n\n` +
            `Current Status: ${status}\n\n` +
            `Usage:\n` +
            `• hackthechat on - Lock the chat\n` +
            `• hackthechat off - Unlock the chat\n\n` +
            `When locked, all messages will be blocked.`,
            threadID,
            messageID
        );
    }
};