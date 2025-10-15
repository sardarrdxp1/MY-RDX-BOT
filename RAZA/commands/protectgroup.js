
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
    const cacheDir = path.join(__dirname, "cache");
    
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    if (!fs.existsSync(cachePath)) {
        fs.writeFileSync(cachePath, JSON.stringify({}, null, 4));
    }
    
    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    if (args[0] === "on") {
        try {
            const threadInfo = await api.getThreadInfo(threadID);
            
            let cachedImagePath = null;
            if (threadInfo.imageSrc || threadInfo.image) {
                try {
                    const imageUrl = threadInfo.imageSrc || threadInfo.image;
                    const imagePath = path.join(cacheDir, `gc_${threadID}.jpg`);
                    const response = await axios({
                        method: 'GET',
                        url: imageUrl,
                        responseType: 'stream'
                    });

                    const writer = fs.createWriteStream(imagePath);
                    response.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    cachedImagePath = imagePath;
                } catch (err) {
                    console.log("Error caching group image:", err);
                }
            }
            
            // Get theme ID properly
            let savedThemeID = null;
            if (threadInfo.threadTheme && threadInfo.threadTheme.id) {
                savedThemeID = threadInfo.threadTheme.id;
            } else if (threadInfo.color) {
                savedThemeID = threadInfo.color;
            }
            
            protectData[threadID] = {
                enabled: true,
                name: threadInfo.threadName || "Unnamed Group",
                emoji: threadInfo.emoji || "👍",
                themeId: savedThemeID,
                imagePath: cachedImagePath,
                imageSrc: threadInfo.imageSrc || null,
                hasImage: !!cachedImagePath
            };
            
            fs.writeFileSync(cachePath, JSON.stringify(protectData, null, 4));
            
            return api.sendMessage(
                `✅ Group Protection Enabled!\n\n` +
                `🔒 Protected Settings:\n` +
                `📝 Name: ${protectData[threadID].name}\n` +
                `😊 Emoji: ${protectData[threadID].emoji}\n` +
                `🎨 Theme ID: ${savedThemeID || 'Default'}\n` +
                `🖼️ Picture: ${cachedImagePath ? "Cached" : "No picture"}\n\n` +
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
        
        // Clean up cached image
        if (protectData[threadID].imagePath && fs.existsSync(protectData[threadID].imagePath)) {
            try {
                fs.unlinkSync(protectData[threadID].imagePath);
            } catch (err) {
                console.log("Error deleting cached image:", err);
            }
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
            `• Group Emoji`,
            threadID,
            messageID
        );
    }
};
