module.exports.config = {
    name: "protectgroup",
    eventType: ["log:thread-name", "log:thread-icon", "log:thread-color", "log:thread-image"],
    version: "1.0.0",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Group settings ko automatically restore karo agar koi change kare"
};

module.exports.run = async function({ event, api }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    
    const cachePath = path.join(__dirname, "../commands/cache", "protectgroup.json");
    
    if (!fs.existsSync(cachePath)) {
        return;
    }
    
    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    if (!protectData[threadID] || !protectData[threadID].enabled) {
        return;
    }
    
    if (author == api.getCurrentUserID()) {
        return;
    }
    
    const savedSettings = protectData[threadID];
    
    try {
        switch (logMessageType) {
            case "log:thread-name": {
                const newName = logMessageData.name;
                if (newName !== savedSettings.name) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await api.setTitle(savedSettings.name, threadID);
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group name change detect hua aur restore kar diya gaya.\n` +
                        `🔒 Original Name: ${savedSettings.name}`,
                        threadID
                    );
                }
                break;
            }
            
            case "log:thread-icon": {
                const newEmoji = logMessageData.thread_icon;
                if (newEmoji !== savedSettings.emoji) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await api.changeThreadEmoji(savedSettings.emoji, threadID);
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group emoji change detect hua aur restore kar diya gaya.\n` +
                        `🔒 Original Emoji: ${savedSettings.emoji}`,
                        threadID
                    );
                }
                break;
            }
            
            case "log:thread-color": {
                const newTheme = logMessageData.thread_color;
                if (newTheme !== savedSettings.themeId) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await api.changeThreadColor(savedSettings.themeId, threadID);
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group theme change detect hua aur restore kar diya gaya.`,
                        threadID
                    );
                }
                break;
            }
            
            case "log:thread-image": {
                if (savedSettings.hasImage && savedSettings.image) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const imagePath = path.join(__dirname, "cache", `protect_${threadID}.jpg`);
                    const imageBuffer = Buffer.from(savedSettings.image, 'base64');
                    
                    const cacheDir = path.join(__dirname, "cache");
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                    }
                    
                    fs.writeFileSync(imagePath, imageBuffer);
                    
                    await api.changeGroupImage(fs.createReadStream(imagePath), threadID);
                    
                    fs.unlinkSync(imagePath);
                    
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group picture change detect hua aur restore kar diya gaya.`,
                        threadID
                    );
                } else if (!savedSettings.hasImage) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const transparentPath = path.join(__dirname, "cache", "transparent.png");
                    
                    await api.changeGroupImage(fs.createReadStream(transparentPath), threadID);
                    
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group picture add kiya gaya tha, lekin original group me koi picture nahi thi.\n` +
                        `Picture ko restore kar diya gaya (blank image).`,
                        threadID
                    );
                }
                
                break;
            }
        }
    } catch (error) {
        console.log("Error restoring group settings:", error);
    }
};
