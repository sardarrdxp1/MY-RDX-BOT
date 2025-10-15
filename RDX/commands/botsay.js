const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "bot-say",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "Kashif Raza",
	description: "Bot Saying",
	commandCategory: "ai",
	usages: "[text/message/chat]",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
var say = args.join(" ")
	if (!say) api.sendMessage(formatMessage("Please enter a message"), event.threadID, event.messageID)
	else api.sendMessage(formatMessage(`${say}`), event.threadID, event.messageID);
}
