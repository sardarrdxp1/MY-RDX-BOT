const { formatMessage } = require('../../utils/formatter');


module.exports.config = {
    name: "help2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Kashif Raza",
    description: "Display all commands",
    commandCategory: "System",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const commands = Array.from(global.client.commands.values());
    
    const categories = {};
    commands.forEach(cmd => {
        const category = cmd.config.commandCategory || "Uncategorized";
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(cmd.config.name);
    });
    
    let message = "╔═══════════════════════╗\n";
    message += "║  📋 All Commands List  ║\n";
    message += "╚═══════════════════════╝\n\n";
    
    for (const [category, cmds] of Object.entries(categories)) {
        message += `📌 ${category}\n`;
        cmds.forEach(cmd => {
            message += `  ├─ ${global.config.PREFIX}${cmd}\n`;
        });
        message += "\n";
    }
    
    message += "━━━━━━━━━━━━━━━━━━━━━━━\n";
    message += `📊 Total: ${commands.length} commands\n`;
    message += `💡 Use ${global.config.PREFIX}help <cmd> for details\n`;
    message += "━━━━━━━━━━━━━━━━━━━━━━━";
    
    return api.sendMessage(message, event.threadID, event.messageID);
};
