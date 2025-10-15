
module.exports.config = {
    name: "protectgroup",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "Kashif Raza",
    description: "Protect group settings (name, picture, theme, emoji)",
    commandCategory: "Group",
    usages: "protectgroup on/off",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    
    const cachePath = path.join(__dirname, "cache", "protectgroup.json");
    
    if (!fs.existsSync(cachePath)) {
        fs.writeFileSync(cachePath, JSON.stringify({}, null, 4));
    }
    
    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    if (args[0] === "on") {
        try {
            const threadInfo = await api.getThreadInfo(threadID);
            
            let groupImage = null;
            if (threadInfo.imageSrc) {
                try {
                    const response = await axios.get(threadInfo.imageSrc, { 
                        responseType: 'arraybuffer' 
                    });
                    groupImage = Buffer.from(response.data).toString('base64');
                } catch (err) {
                    console.log("Error downloading group image:", err);
                }
            }
            
            // Get theme ID - it could be in different properties
            const themeId = threadInfo.color || threadInfo.threadColor || threadInfo.theme_id || "196241301102133";
            
            protectData[threadID] = {
                enabled: true,
                name: threadInfo.threadName || "Unnamed Group",
                emoji: threadInfo.emoji || "👍",
                themeId: themeId,
                image: groupImage,
                imageSrc: threadInfo.imageSrc || null,
                hasImage: !!groupImage
            };
            
            fs.writeFileSync(cachePath, JSON.stringify(protectData, null, 4));
            
            return api.sendMessage(
                `✅ Group Protection Enabled!\n\n` +
                `🔒 Protected Settings:\n` +
                `📝 Name: ${protectData[threadID].name}\n` +
                `😊 Emoji: ${protectData[threadID].emoji}\n` +
                `🎨 Theme ID: ${themeId}\n` +
                `🖼️ Picture: ${groupImage ? "Protected" : "No picture"}\n\n` +
                `If anyone changes these settings, the bot will automatically restore them!`,
                threadID,
                messageID
            );
            
        } catch (error) {
            console.log("Error enabling protection:", error);
            return api.sendMessage("❌ Error enabling protection!", threadID, messageID);
        }
        
    } else if (args[0] === "off") {
        if (!protectData[threadID] || !protectData[threadID].enabled) {
            return api.sendMessage("⚠️ Group protection is already disabled!", threadID, messageID);
        }
        
        protectData[threadID].enabled = false;
        fs.writeFileSync(cachePath, JSON.stringify(protectData, null, 4));
        
        return api.sendMessage(
            `🔓 Group Protection Disabled!\n\n` +
            `Group settings can now be changed freely.`,
            threadID,
            messageID
        );
        
    } else {
        const status = protectData[threadID] && protectData[threadID].enabled ? "🔒 Enabled" : "🔓 Disabled";
        
        return api.sendMessage(
            `📋 Group Protection Command\n\n` +
            `Current Status: ${status}\n\n` +
            `Usage:\n` +
            `• protectgroup on - Lock group settings\n` +
            `• protectgroup off - Disable protection\n\n` +
            `Protected Settings:\n` +
            `• Group Name\n` +
            `• Group Picture\n` +
            `• Group Theme\n` +
            `• Group Emoji\n\n` +
            `⚠️ Note: Theme restoration may fail due to Facebook API limitations.`,
            threadID,
            messageID
        );
    }
};
