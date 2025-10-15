
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "deadgroup",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Permanently destroy a group - no one can send messages even if bot is offline",
    commandCategory: "Admin",
    usages: "deadgroup on/off",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args, Threads }) {
    const { threadID, messageID } = event;

    if (args[0] === "on") {
        try {
            // Get thread info
            const threadInfo = await api.getThreadInfo(threadID);
            
            // Check if bot is admin
            const botID = api.getCurrentUserID();
            const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id == botID);
            
            if (!botIsAdmin) {
                return api.sendMessage("❌ Bot must be admin to execute this command!", threadID, messageID);
            }

            // Step 1: Remove all other admins (demote them)
            for (const admin of threadInfo.adminIDs) {
                if (admin.id != botID) {
                    try {
                        await api.changeAdminStatus(threadID, admin.id, false);
                        console.log(`[DEAD GROUP] Demoted admin: ${admin.id}`);
                    } catch (err) {
                        console.log(`[DEAD GROUP] Failed to demote ${admin.id}:`, err);
                    }
                }
            }

            // Step 2: Enable approval mode (requires admin approval for all messages)
            await api.changeThreadApprovalMode(threadID, true);

            // Step 3: Save the thread as permanently dead
            const cachePath = path.join(__dirname, "cache", "deadgroup.json");
            if (!fs.existsSync(cachePath)) {
                fs.writeFileSync(cachePath, JSON.stringify({}, null, 4));
            }
            
            let deadData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
            deadData[threadID] = {
                enabled: true,
                locked_by: event.senderID,
                locked_at: Date.now()
            };
            fs.writeFileSync(cachePath, JSON.stringify(deadData, null, 4));

            return api.sendMessage(
                `💀 GROUP PERMANENTLY DESTROYED! 💀\n\n` +
                `✅ All admins removed\n` +
                `✅ Approval mode enabled\n` +
                `✅ All messages will be auto-rejected\n\n` +
                `⚠️ This group is now permanently dead even if bot goes offline!\n` +
                `📝 No one can send messages anymore.\n\n` +
                `To restore (only bot admin): /deadgroup off`,
                threadID,
                messageID
            );

        } catch (error) {
            return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
        }

    } else if (args[0] === "off") {
        try {
            // Disable approval mode
            await api.changeThreadApprovalMode(threadID, false);

            // Remove from dead list
            const cachePath = path.join(__dirname, "cache", "deadgroup.json");
            if (fs.existsSync(cachePath)) {
                let deadData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
                delete deadData[threadID];
                fs.writeFileSync(cachePath, JSON.stringify(deadData, null, 4));
            }

            return api.sendMessage(
                `✅ Group Restored!\n\n` +
                `Members can now send messages.\n` +
                `⚠️ You may need to manually add back admins.`,
                threadID,
                messageID
            );

        } catch (error) {
            return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
        }

    } else {
        const cachePath = path.join(__dirname, "cache", "deadgroup.json");
        let status = "🔓 Normal";
        
        if (fs.existsSync(cachePath)) {
            let deadData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
            if (deadData[threadID] && deadData[threadID].enabled) {
                status = "💀 DEAD";
            }
        }

        return api.sendMessage(
            `💀 Dead Group Command\n\n` +
            `Current Status: ${status}\n\n` +
            `Usage:\n` +
            `• deadgroup on - Permanently destroy the group\n` +
            `• deadgroup off - Restore the group\n\n` +
            `⚠️ When dead:\n` +
            `- All admins removed (except bot)\n` +
            `- Approval mode enabled\n` +
            `- No one can send messages\n` +
            `- Works even if bot is offline!`,
            threadID,
            messageID
        );
    }
};
