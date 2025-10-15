
module.exports.config = {
    name: "accept",
    version: "1.0.0",
    permission: 1,
    credits: "Kashif Raza",
    description: "Accept pending group chat requests",
    category: "admin",
    usages: "[list/all]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    try {
        const spam = await api.getThreadList(100, null, ["OTHER"]);
        const list = spam.filter(group => group.isSubscribed && group.isGroup);
        
        if (args[0] === "list") {
            let msg = "📋 Pending Group Requests:\n\n";
            let i = 0;
            for (const single of list) {
                i++;
                msg += `${i}. ${single.name}\nTID: ${single.threadID}\n\n`;
            }
            return api.sendMessage(msg, threadID, messageID);
        }
        
        if (args[0] === "all") {
            if (list.length === 0) {
                return api.sendMessage("✅ No pending requests!", threadID, messageID);
            }
            
            api.sendMessage(`🔄 Accepting ${list.length} group requests...`, threadID, async (err, info) => {
                if (!err) {
                    for (const single of list) {
                        await api.sendMessage("✅ Your group has been approved by admin!", single.threadID);
                    }
                    api.editMessage(`✅ Successfully accepted ${list.length} group requests!`, info.messageID);
                }
            });
        } else {
            return api.sendMessage("Usage:\n/accept list - View pending requests\n/accept all - Accept all requests", threadID, messageID);
        }
    } catch (error) {
        api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
