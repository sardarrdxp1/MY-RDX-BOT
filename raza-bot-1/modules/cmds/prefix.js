
module.exports.config = {
    name: "prefix",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Show bot prefix",
    category: "system",
    usages: "",
    cooldowns: 3
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID } = event;
    
    const message = `
╔════════════════════════════╗
║       BOT PREFIX           ║
╚════════════════════════════╝

🤖 Bot Name: ${config.botName || 'RK Premium Bot'}
⚙️ Prefix: ${config.prefix || '/'}

💡 Example: ${config.prefix || '/'}help
    `.trim();
    
    api.sendMessage(message, threadID, messageID);
};
