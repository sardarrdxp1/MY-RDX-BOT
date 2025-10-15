
module.exports.config = {
    name: "outall",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Make bot leave all groups except admin groups",
    category: "admin",
    usages: "",
    cooldowns: 60
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID } = event;
    
    api.sendMessage("🔄 Starting to leave all groups...", threadID, async (err, info) => {
        try {
            const threadList = await api.getThreadList(100, null, ["INBOX"]);
            const adminUIDs = config.adminUIDs || [];
            let leftCount = 0;
            
            for (const thread of threadList) {
                if (thread.isGroup && thread.threadID !== threadID) {
                    try {
                        const threadInfo = await api.getThreadInfo(thread.threadID);
                        const hasAdmin = threadInfo && threadInfo.adminIDs ? 
                            threadInfo.adminIDs.some(admin => adminUIDs.includes(admin.id || admin)) : false;
                        
                        if (!hasAdmin) {
                            await api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
                            leftCount++;
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    } catch (error) {
                        console.log(`Error leaving group ${thread.threadID}:`, error.message);
                    }
                }
            }
            
            api.editMessage(`✅ Successfully left ${leftCount} groups!`, info.messageID);
        } catch (error) {
            api.editMessage(`❌ Error: ${error.message}`, info.messageID);
        }
    }, messageID);
};
