
module.exports.config = {
    name: "setnicall",
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Set same nickname for all group members",
    permission: 0
};

module.exports.run = async function({ api, event, args, config }) {
    const { threadID, messageID, senderID } = event;

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === senderID);
        const isBotAdmin = config.adminUIDs && config.adminUIDs.includes(senderID);

        if (!isAdmin && !isBotAdmin) {
            return api.sendMessage("❌ Only group admins can use this command!", threadID, messageID);
        }

        const nickname = args.join(" ");

        if (!nickname) {
            return api.sendMessage("❌ Please provide a nickname!\nUsage: .setnicall nickname", threadID, messageID);
        }

        const participantIDs = threadInfo.participantIDs || [];
        
        for (const userID of participantIDs) {
            try {
                await api.nickname(nickname, threadID, userID);
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (err) {
                console.error(`Error setting nickname for ${userID}:`, err.message);
            }
        }

        return api.sendMessage(`✅ Successfully set nickname "${nickname}" for all ${participantIDs.length} members!`, threadID, messageID);
        
    } catch (error) {
        console.error('setnicall error:', error);
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
