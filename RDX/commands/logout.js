const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
    name: "logout",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Logout ACC Bot",
    commandCategory: "System",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, event })
{
api.sendMessage(formatMessage("Logout ..."),event.threadID,event.messageID)
api.logout()
}