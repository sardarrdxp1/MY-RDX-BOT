
module.exports.config = {
    name: "setnic",
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Set nickname for tagged user",
    permission: 0
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID, mentions, senderID } = event;

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === senderID);
        const isBotAdmin = config.adminUIDs && config.adminUIDs.includes(senderID);

        if (!isAdmin && !isBotAdmin) {
            return api.sendMessage("❌ Only group admins can use this command!", threadID, messageID);
        }

        const mentionKeys = Object.keys(mentions);
        
        if (mentionKeys.length === 0) {
            return api.sendMessage("❌ Please mention a user to set nickname!\nUsage: .setnic @user nickname", threadID, messageID);
        }

        const userID = mentionKeys[0];
        const nickname = args.slice(1).join(" ").replace(mentions[userID], "").trim();

        if (!nickname) {
            return api.sendMessage("❌ Please provide a nickname!\nUsage: .setnic @user nickname", threadID, messageID);
        }

        await api.nickname(nickname, threadID, userID);
        
        return api.sendMessage(`✅ Successfully set nickname "${nickname}" for ${mentions[userID]}`, threadID, messageID);
        
    } catch (error) {
        console.error('setnic error:', error);
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
