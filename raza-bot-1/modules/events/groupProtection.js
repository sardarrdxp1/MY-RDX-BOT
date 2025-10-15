module.exports.config = {
    name: "groupProtection",
    version: "2.0.0",
    credits: "Kashif Raza",
    description: "Automatically restore group settings when changed"
};

if (!global.gcProtectionProcessing) {
    global.gcProtectionProcessing = new Map();
}

module.exports.run = async function({ api, event }) {
    const fs = require('fs-extra');
    const path = require('path');
    const axios = require('axios');

    try {
        // Validate event structure
        if (!event || !event.threadID || !event.logMessageType) {
            return;
        }

        // Get bot's own user ID
        const botID = api.getCurrentUserID();

        // Ignore if bot itself made the change
        if (event.author === botID) {
            return;
        }

        if (event.logMessageType === 'log:thread-name' || 
            event.logMessageType === 'log:thread-image' ||
            event.logMessageType === 'log:thread-color' ||
            event.logMessageType === 'log:thread-icon') {

            const eventKey = `${event.threadID}_${event.logMessageType}_${event.author || 'unknown'}`;
            const botRestorationKey = `bot_restore_${event.threadID}_${event.logMessageType}`;

            if (global.gcProtectionProcessing.has(eventKey)) {
                return;
            }

            if (global.gcProtectionProcessing.has(botRestorationKey)) {
                global.gcProtectionProcessing.delete(botRestorationKey);
                return;
            }

            global.gcProtectionProcessing.set(eventKey, true);
            setTimeout(() => global.gcProtectionProcessing.delete(eventKey), 5000);

            const dataPath = path.join(__dirname, '../cmds/data/gcprotection.json');

            if (!fs.existsSync(dataPath)) {
                global.gcProtectionProcessing.delete(eventKey);
                return;
            }

            let protectedGroups = {};
            try {
                protectedGroups = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            } catch (e) {
                global.gcProtectionProcessing.delete(eventKey);
                return;
            }

            const protection = protectedGroups[event.threadID];

            if (!protection || !protection.enabled) {
                global.gcProtectionProcessing.delete(eventKey);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            let restoredSettings = [];

            if (event.logMessageType === 'log:thread-name' && protection.name) {
                try {
                    global.gcProtectionProcessing.set(botRestorationKey, true);
                    await api.gcname(protection.name, event.threadID);
                    restoredSettings.push('📝 Name');
                } catch (err) {
                    console.error('Error restoring name:', err.message);
                    global.gcProtectionProcessing.delete(botRestorationKey);
                }
            }

            if (event.logMessageType === 'log:thread-icon' && protection.emoji) {
                try {
                    global.gcProtectionProcessing.set(botRestorationKey, true);
                    await api.emoji(protection.emoji, event.threadID);
                    restoredSettings.push('🎭 Emoji');
                } catch (err) {
                    console.error('Error restoring emoji:', err.message);
                    global.gcProtectionProcessing.delete(botRestorationKey);
                }
            }

            if (event.logMessageType === 'log:thread-color') {
                if (protection.themeID) {
                    try {
                        global.gcProtectionProcessing.set(botRestorationKey, true);
                        await api.theme(protection.themeID, event.threadID);
                        restoredSettings.push('🎨 Theme');
                    } catch (err) {
                        console.error('Error restoring theme:', err.message);
                        global.gcProtectionProcessing.delete(botRestorationKey);
                    }
                } else {
                    console.log('Cannot restore theme: No theme ID stored. Please re-enable protection.');
                }
            }

            if (event.logMessageType === 'log:thread-image') {
                if (protection.imagePath && fs.existsSync(protection.imagePath)) {
                    try {
                        global.gcProtectionProcessing.set(botRestorationKey, true);

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const imageStream = fs.createReadStream(protection.imagePath);

                        await api.changeGroupImage(imageStream, event.threadID, (err) => {
                            global.gcProtectionProcessing.delete(botRestorationKey);
                            if (err) {
                                console.error('Error restoring photo:', err.message);
                            }
                        });

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        restoredSettings.push('🖼️ Photo');
                    } catch (err) {
                        console.error('Error restoring photo:', err.message);
                        global.gcProtectionProcessing.delete(botRestorationKey);
                    }
                }
            }

            if (restoredSettings.length > 0) {
                await api.sendMessage(`⚠️ Group settings changed!\nRestored: ${restoredSettings.join(', ')}`, event.threadID);
            }

            global.gcProtectionProcessing.delete(eventKey);
        }
    } catch (err) {
        console.error('Group protection event error:', err.message);
    }
};