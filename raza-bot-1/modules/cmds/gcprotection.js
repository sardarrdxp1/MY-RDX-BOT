
module.exports.config = {
    name: "gcprotection",
    version: "2.0.0",
    credits: "Kashif Raza",
    description: "Protect group settings with cached photo support",
    permission: 0
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID, senderID } = event;
    const fs = require('fs-extra');
    const path = require('path');
    const axios = require('axios');

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === senderID);
        const isBotAdmin = config.adminUIDs && config.adminUIDs.includes(senderID);

        if (!isAdmin && !isBotAdmin) {
            return api.sendMessage("❌ Only group admins can use this command!", threadID, messageID);
        }

        const dataDir = path.join(__dirname, 'data');
        const cacheDir = path.join(__dirname, 'cache');

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const dataPath = path.join(dataDir, 'gcprotection.json');

        let protectedGroups = {};
        if (fs.existsSync(dataPath)) {
            try {
                protectedGroups = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            } catch (e) {
                protectedGroups = {};
            }
        }

        const action = args[0]?.toLowerCase();

        if (action === 'on') {
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
                        console.error('Error caching group image:', err.message);
                    }
                }

                let savedThemeID = null;
                if (threadInfo.threadTheme && threadInfo.threadTheme.id) {
                    savedThemeID = threadInfo.threadTheme.id;
                } else if (threadInfo.color) {
                    savedThemeID = threadInfo.color;
                }

                protectedGroups[threadID] = {
                    name: threadInfo.threadName || threadInfo.name || "Unnamed Group",
                    emoji: threadInfo.emoji || "👍",
                    color: threadInfo.color || "0084FF",
                    themeID: savedThemeID,
                    imagePath: cachedImagePath,
                    imageSrc: threadInfo.imageSrc || threadInfo.image || null,
                    enabled: true
                };

                fs.writeFileSync(dataPath, JSON.stringify(protectedGroups, null, 2));

                return api.sendMessage(`
╔════════════════════════════╗
║   GROUP PROTECTION ON      ║
╚════════════════════════════╝

🔒 Group protection activated!

Protected Settings:
📝 Name: ${protectedGroups[threadID].name}
🎭 Emoji: ${protectedGroups[threadID].emoji}
🎨 Theme: Protected
🖼️ Picture: ${cachedImagePath ? 'Cached' : 'Not Available'}

⚠️ Any changes will be automatically restored!
                `.trim(), threadID, messageID);
            } catch (err) {
                return api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
            }
        }

        else if (action === 'off') {
            if (protectedGroups[threadID]) {
                if (protectedGroups[threadID].imagePath) {
                    try {
                        if (fs.existsSync(protectedGroups[threadID].imagePath)) {
                            fs.unlinkSync(protectedGroups[threadID].imagePath);
                        }
                    } catch (err) {
                        console.error('Error deleting cached image:', err.message);
                    }
                }

                delete protectedGroups[threadID];
                fs.writeFileSync(dataPath, JSON.stringify(protectedGroups, null, 2));

                return api.sendMessage(`
╔════════════════════════════╗
║   GROUP PROTECTION OFF     ║
╚════════════════════════════╝

🔓 Group protection deactivated!

The group settings are no longer protected.
                `.trim(), threadID, messageID);
            } else {
                return api.sendMessage('❌ Group protection is already off!', threadID, messageID);
            }
        }

        else {
            const status = protectedGroups[threadID]?.enabled ? '🔒 ON' : '🔓 OFF';
            const protection = protectedGroups[threadID];

            return api.sendMessage(`
╔════════════════════════════╗
║   GROUP PROTECTION         ║
╚════════════════════════════╝

Status: ${status}

${protection ? `Protected Settings:
📝 Name: ${protection.name}
🎭 Emoji: ${protection.emoji}
🎨 Theme: ${protection.color}
🖼️ Photo: ${protection.imagePath ? 'Cached' : 'Not cached'}` : 'No protection active'}

Usage:
• ${config.prefix}gcprotection on - Enable protection
• ${config.prefix}gcprotection off - Disable protection
            `.trim(), threadID, messageID);
        }

    } catch (error) {
        console.error('gcprotection error:', error);
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
