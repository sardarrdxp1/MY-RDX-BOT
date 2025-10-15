const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "protectgroup",
    eventType: ["log:thread-name", "log:thread-icon", "log:thread-color", "log:thread-image"],
    version: "5.0.0",
    credits: "Kashif Raza",
    description: "Automatically restore group settings if someone changes them"
};

if (!global.gcProtectionProcessing) {
    global.gcProtectionProcessing = new Map();
}

module.exports.run = async function({ event, api }) {
    const { threadID, logMessageType, author } = event;

    const cachePath = path.join(__dirname, "../commands/cache", "protectgroup.json");

    if (!fs.existsSync(cachePath)) {
        return;
    }

    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));

    if (!protectData[threadID] || !protectData[threadID].enabled) {
        return;
    }

    const botID = api.getCurrentUserID();
    if (author == botID) {
        return;
    }

    const eventKey = `${threadID}_${logMessageType}_${Date.now()}`;
    const botRestorationKey = `bot_restore_${threadID}_${logMessageType}`;

    if (global.gcProtectionProcessing.has(eventKey)) {
        return;
    }

    if (global.gcProtectionProcessing.has(botRestorationKey)) {
        global.gcProtectionProcessing.delete(botRestorationKey);
        return;
    }

    global.gcProtectionProcessing.set(eventKey, true);
    setTimeout(() => global.gcProtectionProcessing.delete(eventKey), 8000);

    const savedSettings = protectData[threadID];

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let restoredSettings = [];

        switch (logMessageType) {
            case "log:thread-name": {
                try {
                    global.gcProtectionProcessing.set(botRestorationKey, true);
                    await api.setTitle(savedSettings.name, threadID);
                    setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
                    restoredSettings.push('📝 Name');
                } catch (err) {
                    console.log("Error restoring name:", err);
                    global.gcProtectionProcessing.delete(botRestorationKey);
                }
                break;
            }

            case "log:thread-icon": {
                try {
                    global.gcProtectionProcessing.set(botRestorationKey, true);
                    await api.changeThreadEmoji(savedSettings.emoji, threadID);
                    setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
                    restoredSettings.push('😊 Emoji');
                } catch (err) {
                    console.log("Error restoring emoji:", err);
                    global.gcProtectionProcessing.delete(botRestorationKey);
                }
                break;
            }

            case "log:thread-color": {
                if (savedSettings.themeId) {
                    try {
                        global.gcProtectionProcessing.set(botRestorationKey, true);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        await api.changeThreadColor(savedSettings.themeId, threadID);
                        setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
                        restoredSettings.push('🎨 Theme');
                    } catch (err) {
                        console.log("Error restoring theme:", err);
                        global.gcProtectionProcessing.delete(botRestorationKey);
                    }
                }
                break;
            }

            case "log:thread-image": {
                if (savedSettings.imagePath && fs.existsSync(savedSettings.imagePath)) {
                    try {
                        global.gcProtectionProcessing.set(botRestorationKey, true);
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        const imageStream = fs.createReadStream(savedSettings.imagePath);

                        await new Promise((resolve, reject) => {
                            api.changeGroupImage(imageStream, threadID, (err) => {
                                if (err) {
                                    console.log("Error restoring photo:", err);
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });

                        setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        restoredSettings.push('🖼️ Picture');
                    } catch (err) {
                        console.log("Error restoring picture:", err);
                        global.gcProtectionProcessing.delete(botRestorationKey);
                    }
                } else if (!savedSettings.hasImage) {
                    api.sendMessage(
                        `⚠️ Group Protection Active!\n\nPicture was added, but original group had no picture.\nNote: Picture cannot be removed automatically.`,
                        threadID
                    );
                }
                break;
            }
        }

        if (restoredSettings.length > 0) {
            await api.sendMessage(
                `⚠️ Group Protection Active!\n\nSettings changed and restored:\n${restoredSettings.join('\n')}`,
                threadID
            );
        }

        setTimeout(() => global.gcProtectionProcessing.delete(eventKey), 1000);

    } catch (error) {
        console.log("Error in protectgroup event:", error);
        global.gcProtectionProcessing.delete(eventKey);
        global.gcProtectionProcessing.delete(botRestorationKey);
        api.sendMessage(
            `❌ Protection Error: ${error.message || 'Unknown error'}`,
            threadID
        );
    }
};