const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "load",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Kashif Raza",
	description: "reload config file data",
	commandCategory: "Admin",
	usages: "[]",
	cooldowns: 30
};
module.exports.run = async function({ api, event, args,Threads, Users }) {
delete require.cache[require.resolve(global.client.configPath)];
global.config = require(global.client.configPath);
return api.sendMessage(formatMessage("[OK] Reloading config..."), event.threadID, event.messageID);    
} 