const { formatMessage } = require('../../utils/formatter');


module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Kashif Raza",
  description: "Bot leaves the current group",
  commandCategory: "Admin",
  usages: "out [tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const tid = args.join(" ");
    
    if (!tid) {
        // Leave current group
        return api.sendMessage(formatMessage("⚠️ Order from admin to leave group. Goodbye! 👋"), event.threadID, () => {
            api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        });
    } else {
        // Leave specified group
        return api.sendMessage(formatMessage("⚠️ Order from admin to leave group. Goodbye! 👋"), tid, () => {
            api.removeUserFromGroup(api.getCurrentUserID(), tid);
        });
    }
}
