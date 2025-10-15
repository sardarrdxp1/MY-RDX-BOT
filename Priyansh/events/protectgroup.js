
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "protectgroup",
    eventType: ["log:thread-name", "log:thread-icon", "log:thread-color", "log:thread-image"],
    version: "3.0.0",
    credits: "Kashif Raza",
    description: "Automatically restore group settings if someone changes them"
};

module.exports.run = async function({ event, api }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    
    const cachePath = path.join(__dirname, "../commands/cache", "protectgroup.json");
    
    if (!fs.existsSync(cachePath)) {
        return;
    }
    
    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    
    if (!protectData[threadID] || !protectData[threadID].enabled) {
        return;
    }
    
    // Don't restore if bot made the change
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
                        `Group name change detected and restored.\n` +
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
                        `Group emoji change detected and restored.\n` +
                        `🔒 Original Emoji: ${savedSettings.emoji}`,
                        threadID
                    );
                }
                break;
            }
            
            case "log:thread-color": {
                const newTheme = logMessageData.theme_color || logMessageData.thread_color;
                if (newTheme && savedSettings.themeId) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    try {
                        // Try to restore theme
                        await api.changeThreadColor(savedSettings.themeId, threadID);
                        api.sendMessage(
                            `⚠️ Group Protection Active!\n\n` +
                            `Group theme change detected and restored.`,
                            threadID
                        );
                    } catch (err) {
                        console.log("Error restoring theme:", err);
                        api.sendMessage(
                            `⚠️ Group Protection Active!\n\n` +
                            `Theme change detected but could not be restored due to Facebook limitations.`,
                            threadID
                        );
                    }
                }
                break;
            }
            
            case "log:thread-image": {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (savedSettings.hasImage && savedSettings.image) {
                    const imagePath = path.join(__dirname, "cache", `protect_${threadID}.jpg`);
                    
                    try {
                        const imageBuffer = Buffer.from(savedSettings.image, 'base64');
                        
                        const cacheDir = path.join(__dirname, "cache");
                        if (!fs.existsSync(cacheDir)) {
                            fs.mkdirSync(cacheDir, { recursive: true });
                        }
                        
                        fs.writeFileSync(imagePath, imageBuffer);
                        
                        await api.changeGroupImage(fs.createReadStream(imagePath), threadID);
                        
                        api.sendMessage(
                            `⚠️ Group Protection Active!\n\n` +
                            `Group picture change detected and restored.`,
                            threadID
                        );
                        
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    } catch (err) {
                        console.log("Error restoring image:", err);
                        api.sendMessage(
                            `⚠️ Group Protection Active!\n\n` +
                            `Picture change detected but could not be restored.`,
                            threadID
                        );
                    }
                } else if (!savedSettings.hasImage) {
                    // Original group had no picture
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\n` +
                        `Group picture was added, but original group had no picture.\n` +
                        `Note: Due to platform limitations, picture cannot be removed automatically.`,
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
