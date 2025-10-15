const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "uid",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Kashif Raza",
	description: "Get User ID.",
	commandCategory: "Tools",
	cooldowns: 5
};

module.exports.run = function({ api, event }) {
	if (Object.keys(event.mentions) == 0) return api.sendMessage(formatMessage(`${event.senderID}`), event.threadID, event.messageID);
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(formatMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`), event.threadID);
		return;
	}
}