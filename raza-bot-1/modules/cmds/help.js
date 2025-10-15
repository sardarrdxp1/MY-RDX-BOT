module.exports.config = {
    name: "help",
    version: "2.0.1",
    permission: 0,
    credits: "RK Premium",
    description: "Display all available commands and their information",
    category: "system",
    usages: "[command name]",
    cooldowns: 3
};

module.exports.run = async function({ api, event, args, config }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const prefix = config.prefix || "/";

    if (args[0]) {
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName);

        if (!command) {
            return api.sendMessage(`❌ Command "${commandName}" not found!`, threadID, messageID);
        }

        const commandInfo = `
╔════════════════════════════╗
║   COMMAND INFORMATION      ║
╚════════════════════════════╝

📝 Name: ${command.config.name}
📖 Description: ${command.config.description || 'No description'}
📂 Category: ${command.config.category || 'general'}
💫 Usage: ${prefix}${command.config.name} ${command.config.usages || ''}
⏱️ Cooldown: ${command.config.cooldowns || 0}s
👤 Permission: ${command.config.permission === 0 ? 'User' : command.config.permission === 1 ? 'Admin' : 'Bot Admin'}
👨‍💻 Author: ${command.config.credits || 'Unknown'}
🔢 Version: ${command.config.version || '1.0.0'}
        `.trim();

        return api.sendMessage(commandInfo, threadID, messageID);
    }

    const categories = {};
    for (const [name, cmd] of commands) {
        const category = cmd.config.category || 'general';
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd.config.name);
    }

    let message = `
╔════════════════════════════╗
║   RK PREMIUM BOT - HELP    ║
╚════════════════════════════╝

🤖 Total Commands: ${commands.size}
📂 Categories: ${Object.keys(categories).length}
⚙️ Prefix: ${prefix}

`;

    for (const [category, cmds] of Object.entries(categories)) {
        message += `\n📁 ${category.toUpperCase()} (${cmds.length})\n`;
        message += `├─ ${cmds.join(', ')}\n`;
    }

    message += `\n💡 Use "${prefix}help <command>" for detailed info\n`;
    message += `📝 Example: ${prefix}help balance\n`;

    return api.sendMessage(message, threadID, messageID);
};
