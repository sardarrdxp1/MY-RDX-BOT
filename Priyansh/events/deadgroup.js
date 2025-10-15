
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "deadgroup",
    eventType: ["event"],
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Auto-reject all approval requests in dead groups"
};

module.exports.run = async function({ api, event }) {
    const { threadID, logMessageType, logMessageData } = event;

    // Check if this is an approval request
    if (logMessageType !== "log:thread-approval-queue") return;

    const cachePath = path.join(__dirname, "..", "commands", "cache", "deadgroup.json");
    
    if (!fs.existsSync(cachePath)) return;
    
    let deadData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    // If this thread is marked as dead, reject all approval requests
    if (deadData[threadID] && deadData[threadID].enabled) {
        try {
            // Reject the approval request
            if (logMessageData && logMessageData.messageID) {
                await api.handleMessageRequest(threadID, false);
                console.log(`[DEAD GROUP] Rejected approval request in thread ${threadID}`);
            }
        } catch (err) {
            console.log("[DEAD GROUP] Error rejecting approval:", err);
        }
    }
};
