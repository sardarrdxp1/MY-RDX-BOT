const { formatMessage } = require('../../utils/formatter');


module.exports.config = {
    name: "outall",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Bot leaves all groups except current one",
    commandCategory: "Admin",
    usages: "outall",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    return api.getThreadList(100, null, ["INBOX"], (err, list) => {
        if (err) throw err;
        
        let count = 0;
        list.forEach(item => {
            if (item.isGroup == true && item.threadID != event.threadID) {
                api.sendMessage(formatMessage("⚠️ Order from admin to leave group. Goodbye! 👋"), item.threadID, () => {
                    api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
                });
                count++;
            }
        });
        
        api.sendMessage(formatMessage(`✅ Successfully left ${count} groups (excluding this group)`), event.threadID);
    });
}
