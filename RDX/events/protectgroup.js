
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "protectgroup",
    eventType: ["log:thread-name", "log:thread-icon", "log:thread-color", "log:thread-image"],
    version: "2.0.0",
    credits: "Kashif Raza",
    description: "Protect group settings"
};

if (!global.gcProtectionProcessing) {
    global.gcProtectionProcessing = new Map();
}

module.exports.run = async function({ event, api }) {
    const { threadID, logMessageType, author } = event;

    console.log(`[PROTECT EVENT] ========== EVENT RECEIVED ==========`);
    console.log(`[PROTECT EVENT] Type: ${logMessageType}`);
    console.log(`[PROTECT EVENT] Thread: ${threadID}`);
    console.log(`[PROTECT EVENT] Author: ${author}`);
    console.log(`[PROTECT EVENT] Full event:`, JSON.stringify(event, null, 2));

    const cachePath = path.join(__dirname, "../commands/cache", "protectgroup.json");

    if (!fs.existsSync(cachePath)) {
        console.log(`[PROTECT EVENT] No cache file found`);
        return;
    }

    let protectData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));

    if (!protectData[threadID] || !protectData[threadID].enabled) {
        console.log(`[PROTECT EVENT] Protection not enabled for thread ${threadID}`);
        return;
    }

    const botID = api.getCurrentUserID();
    if (author == botID) {
        console.log(`[PROTECT EVENT] Bot made the change, ignoring`);
        return;
    }

    const eventKey = `${threadID}_${logMessageType}_${Date.now()}`;
    const botRestorationKey = `bot_restore_${threadID}_${logMessageType}`;

    if (global.gcProtectionProcessing.has(eventKey)) {
        console.log(`[PROTECT EVENT] Already processing this event`);
        return;
    }

    if (global.gcProtectionProcessing.has(botRestorationKey)) {
        console.log(`[PROTECT EVENT] Bot restoration in progress, clearing key`);
        global.gcProtectionProcessing.delete(botRestorationKey);
        return;
    }

    global.gcProtectionProcessing.set(eventKey, true);
    setTimeout(() => global.gcProtectionProcessing.delete(eventKey), 8000);

    const savedSettings = protectData[threadID];

    try {
        console.log(`[PROTECT EVENT] Processing restoration...`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        let restoredSettings = [];

        if (logMessageType === "log:thread-name" && savedSettings.name) {
            try {
                console.log(`[PROTECT EVENT] Restoring name: ${savedSettings.name}`);
                global.gcProtectionProcessing.set(botRestorationKey, true);
                await api.setTitle(savedSettings.name, threadID);
                restoredSettings.push('📝 Name');
                setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
            } catch (err) {
                console.log("Error restoring name:", err);
                global.gcProtectionProcessing.delete(botRestorationKey);
            }
        }

        if (logMessageType === "log:thread-icon" && savedSettings.emoji) {
            try {
                console.log(`[PROTECT EVENT] Restoring emoji: ${savedSettings.emoji}`);
                global.gcProtectionProcessing.set(botRestorationKey, true);
                await api.changeThreadEmoji(savedSettings.emoji, threadID);
                restoredSettings.push('🎭 Emoji');
                setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
            } catch (err) {
                console.log("Error restoring emoji:", err);
                global.gcProtectionProcessing.delete(botRestorationKey);
            }
        }

        if (logMessageType === "log:thread-color" && savedSettings.themeId) {
            try {
                console.log(`[PROTECT EVENT] Restoring theme: ${savedSettings.themeId}`);
                global.gcProtectionProcessing.set(botRestorationKey, true);
                await api.changeThreadColor(savedSettings.themeId, threadID);
                restoredSettings.push('🎨 Theme');
                setTimeout(() => global.gcProtectionProcessing.delete(botRestorationKey), 3000);
            } catch (err) {
                console.log("Error restoring theme:", err);
                global.gcProtectionProcessing.delete(botRestorationKey);
            }
        }

        if (logMessageType === "log:thread-image") {
            console.log(`[PROTECT EVENT] Image change detected!`);
            if (savedSettings.imagePath && fs.existsSync(savedSettings.imagePath)) {
                try {
                    console.log(`[PROTECT EVENT] Restoring image from: ${savedSettings.imagePath}`);
                    global.gcProtectionProcessing.set(botRestorationKey, true);

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const imageStream = fs.createReadStream(savedSettings.imagePath);

                    await new Promise((resolve, reject) => {
                        api.changeGroupImage(imageStream, threadID, (err) => {
                            if (err) {
                                console.log("Error restoring photo:", err);
                                global.gcProtectionProcessing.delete(botRestorationKey);
                                reject(err);
                            } else {
                                console.log("[PROTECT EVENT] Image restored successfully!");
                                setTimeout(() => {
                                    global.gcProtectionProcessing.delete(botRestorationKey);
                                    resolve();
                                }, 3000);
                            }
                        });
                    });

                    restoredSettings.push('🖼️ Picture');
                } catch (err) {
                    console.log("Error restoring picture:", err);
                    global.gcProtectionProcessing.delete(botRestorationKey);
                }
            } else {
                console.log(`[PROTECT EVENT] No saved image found`);
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
    }
};
