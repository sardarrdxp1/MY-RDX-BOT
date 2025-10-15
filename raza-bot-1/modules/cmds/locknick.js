
module.exports.config = {
    name: "locknick",
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Lock nickname for tagged user",
    permission: 0
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID, mentions, senderID } = event;
    const fs = require('fs-extra');
    const path = require('path');

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === senderID);
        const isBotAdmin = config.adminUIDs && config.adminUIDs.includes(senderID);

        if (!isAdmin && !isBotAdmin) {
            return api.sendMessage("❌ Only group admins can use this command!", threadID, messageID);
        }

        const mentionKeys = Object.keys(mentions);
        
        if (mentionKeys.length === 0) {
            return api.sendMessage("❌ Please mention a user to lock nickname!\nUsage: .locknick @user", threadID, messageID);
        }

        const userID = mentionKeys[0];
        const dataDir = path.join(__dirname, 'data');
        const dataPath = path.join(dataDir, 'locknick.json');

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let lockedNicks = {};
        if (fs.existsSync(dataPath)) {
            try {
                lockedNicks = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            } catch (e) {
                lockedNicks = {};
            }
        }

        if (!lockedNicks[threadID]) {
            lockedNicks[threadID] = {};
        }

        const userInfo = threadInfo.nicknames && threadInfo.nicknames[userID] 
            ? threadInfo.nicknames[userID] 
            : threadInfo.participantNames && threadInfo.participantNames[userID]
            ? threadInfo.participantNames[userID]
            : "User";

        lockedNicks[threadID][userID] = userInfo;
        fs.writeFileSync(dataPath, JSON.stringify(lockedNicks, null, 2));

        return api.sendMessage(`🔒 Locked nickname "${userInfo}" for ${mentions[userID]}\nNickname changes will be automatically restored!`, threadID, messageID);
        
    } catch (error) {
        console.error('locknick error:', error);
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
