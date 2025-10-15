const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Kashif Raza",
	description: "Restart Bot",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(formatMessage(`${global.config.BOTNAME} Bot are now Restarting...`), threadID, () => process.exit(1));
}
module.exports.config = {
    name: "restart",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Flash Bot",
    description: "Restart bot without server crash",
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    
    try {
        await api.sendMessage("⚡ Restarting bot...", threadID, messageID);
        
        // Clear command cache
        const commandsPath = require('path').join(__dirname);
        Object.keys(require.cache).forEach(key => {
            if (key.includes(commandsPath)) {
                delete require.cache[key];
            }
        });
        
        // Reload commands
        const fs = require('fs');
        const commands = new Map();
        
        fs.readdirSync(commandsPath).forEach(file => {
            if (file.endsWith('.js')) {
                try {
                    delete require.cache[require.resolve(`./${file}`)];
                    const command = require(`./${file}`);
                    if (command.config) {
                        commands.set(command.config.name, command);
                    }
                } catch (err) {
                    console.error(`Failed to load ${file}:`, err);
                }
            }
        });
        
        global.client.commands = commands;
        
        await api.sendMessage(`✅ Bot restarted successfully!\n\n📊 Loaded ${commands.size} commands`, threadID, messageID);
        
    } catch (error) {
        await api.sendMessage(`❌ Restart failed: ${error.message}`, threadID, messageID);
    }
};
