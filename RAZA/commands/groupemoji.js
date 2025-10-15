const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "groupemoji",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "Kashif Raza",
	description: "Change your group Emoji",
	commandCategory: "Box", 
	usages: "groupemoji [name]", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	var emoji = args.join(" ")
	if (!emoji) api.sendMessage(formatMessage("You have not entered Emoji 💩💩"), event.threadID, event.messageID)
	else api.changeThreadEmoji(emoji, event.threadID, () => api.sendMessage(formatMessage(`🔨 The bot successfully changed Emoji to: ${emoji}`), event.threadID, event.messageID));
}