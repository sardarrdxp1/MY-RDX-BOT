module.exports.config = {
    name: "protectgroup",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Group settings ko protect karo (name, picture, theme, emoji)",
    commandCategory: "Group",
    usages: "protectgroup on/off",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Threads }) {
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
            
            protectData[threadID] = {
                enabled: true,
                name: threadInfo.threadName || "Unnamed Group",
                emoji: threadInfo.emoji || "👍",
                themeId: threadInfo.color || "196241301102133",
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
                `🎨 Theme: Protected\n` +
                `🖼️ Picture: ${groupImage ? "Protected" : "No picture"}\n\n` +
                `Ab koi bhi in settings ko change karega to bot automatically restore kar dega!`,
                threadID,
                messageID
            );
            
        } catch (error) {
            console.log("Error enabling protection:", error);
            return api.sendMessage("❌ Protection enable karne me error aaya!", threadID, messageID);
        }
        
    } else if (args[0] === "off") {
        if (!protectData[threadID] || !protectData[threadID].enabled) {
            return api.sendMessage("⚠️ Group protection pehle se hi disabled hai!", threadID, messageID);
        }
        
        protectData[threadID].enabled = false;
        fs.writeFileSync(cachePath, JSON.stringify(protectData, null, 4));
        
        return api.sendMessage(
            `🔓 Group Protection Disabled!\n\n` +
            `Ab group settings freely change kar sakte ho.`,
            threadID,
            messageID
        );
        
    } else {
        return api.sendMessage(
            `📋 Group Protection Command\n\n` +
            `Usage: protectgroup on/off\n\n` +
            `💡 protectgroup on - Group settings lock kar do\n` +
            `💡 protectgroup off - Protection disable kar do\n\n` +
            `Protected Settings:\n` +
            `• Group Name\n` +
            `• Group Picture\n` +
            `• Group Theme\n` +
            `• Group Emoji\n\n` +
            `⚠️ Note: Agar group me originally koi picture nahi thi, to bot transparent image use karega (platform limitation).`,
            threadID,
            messageID
        );
    }
};
