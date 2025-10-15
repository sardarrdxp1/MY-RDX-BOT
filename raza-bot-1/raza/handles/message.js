
module.exports = {
    async handle({ api, event, commands, config }) {
        const { body, threadID, messageID, senderID } = event;

        if (!body || !body.startsWith(config.prefix)) return;

        const args = body.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);

        if (!command) return;

        try {
            // Check permissions
            const permission = command.config?.permission || 0;
            if (permission === 1 || permission === 2) {
                if (!config.adminUIDs || !config.adminUIDs.includes(senderID)) {
                    return api.sendMessage("⚠️ Only admins can use this command!", threadID, messageID);
                }
            }

            // Helper objects for compatibility
            const Users = global.data?.userName || new Map();
            const Threads = global.data?.threadInfo || new Map();
            const Currencies = global.data?.allCurrenciesID || new Map();
            
            const message = {
                send: (msg, callback) => api.sendMessage(msg, threadID, callback),
                reply: (msg, callback) => api.sendMessage(msg, threadID, messageID, callback),
                react: (emoji) => api.setMessageReaction(emoji, messageID, () => {}, true),
                unsend: (msgID) => api.unsendMessage(msgID || messageID)
            };

            // Modern format with run()
            if (typeof command.run === 'function') {
                await command.run({ api, event, args, config, Users, Threads, Currencies });
            }
            // Mirai/Goat bot format with handleCommand()
            else if (typeof command.handleCommand === 'function') {
                await command.handleCommand({ 
                    api, 
                    event, 
                    args, 
                    Users, 
                    Threads, 
                    Currencies,
                    global,
                    client: api
                });
            }
            // GoatBot V2 format with onStart()
            else if (typeof command.onStart === 'function') {
                await command.onStart({ 
                    api, 
                    event, 
                    args, 
                    message,
                    getLang: (key) => key,
                    commandName
                });
            }
            // AutoBot format with execute()
            else if (typeof command.execute === 'function') {
                await command.execute({ api, event, args });
            }
            // Direct function format
            else if (typeof command === 'function') {
                await command({ api, event, args, config });
            }
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
        }
    }
};
