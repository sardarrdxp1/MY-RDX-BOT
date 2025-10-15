const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
    name: "hackthechat",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Add multiple users to group, set nicknames, and lock the chat",
    commandCategory: "Admin",
    usages: "hackthechat",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    const userIDsToAdd = [
        "100001234567890",
        "100002345678901", 
        "100003456789012",
        "100004567890123",
        "100005678901234"
    ];
    
    const userNicknames = [
        "HACK-BOT",
        "Shawx BOT",
        "Shaw 3",
        "Karan",
        "Shawx II"
    ];
    
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const currentMembers = threadInfo.participantIDs;
        
        let addedCount = 0;
        let alreadyInGroup = 0;
        let failedCount = 0;
        
        for (let i = 0; i < userIDsToAdd.length && i < 5; i++) {
            const userID = userIDsToAdd[i];
            const nickname = userNicknames[i];
            
            try {
                if (currentMembers.includes(userID)) {
                    alreadyInGroup++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                    api.changeNickname(nickname, threadID, userID);
                    continue;
                }
                
                await api.addUserToGroup(userID, threadID);
                addedCount++;
                
                api.sendMessage(`HACK-BOT added ${nickname} to the group.`, threadID);
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                api.changeNickname(nickname, threadID, userID);
                
            } catch (err) {
                console.log(`Failed to add user ${userID}:`, err);
                failedCount++;
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return api.sendMessage(
            `✅ Hack Complete!\n\n` +
            `✓ Added: ${addedCount} users\n` +
            `✓ Already in group: ${alreadyInGroup}\n` +
            `✗ Failed: ${failedCount}\n\n` +
            `⚠️ Important: Admin ko group settings se Approval Mode ON karna hoga taaki koi message na kar sake!\n\n` +
            `📌 Steps:\n` +
            `1. Group Info open karo\n` +
            `2. Settings > Edit Group Settings\n` +
            `3. "Approve New Members" ko ON karo\n\n` +
            `Ab group locked hai! 🔒`,
            threadID,
            messageID
        );
        
    } catch (error) {
        console.log("Error in hackthechat:", error);
        return api.sendMessage(
            `❌ Error occurred!\n${error.message || error}`,
            threadID,
            messageID
        );
    }
};
