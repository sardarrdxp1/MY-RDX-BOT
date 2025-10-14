module.exports.config = {
    name: "help",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Beginner's Guide - Shows all commands",
    commandCategory: "system",
    usages: "[command name]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: false,
        delayUnsend: 60
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "━━━━━━━━━━━━━━━━━━\n📌 Command: %1\n📝 Description: %2\n📖 Usage: %3\n📂 Category: %4\n⏱️ Cooldown: %5s\n👤 Permission: %6\n✨ By: %7\n━━━━━━━━━━━━━━━━━━",
        "user": "User",
        "adminGroup": "Admin Group",
        "adminBot": "Admin Bot"
    }
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (!command) {
        const categories = {};
        let msg = "╔══════════════╗\n";
        msg += "║  📜 COMMAND LIST  ║\n";
        msg += "╚══════════════╝\n\n";

        for (const [name, value] of commands) {
            const category = value.config.commandCategory || "Uncategorized";
            if (!categories[category]) categories[category] = [];
            categories[category].push(name);
        }

        Object.keys(categories).sort().forEach(category => {
            msg += `━━ ${category.toUpperCase()} ━━\n`;
            categories[category].sort().forEach((cmd, index) => {
                msg += `${index + 1}. ${prefix}${cmd}\n`;
            });
            msg += `\n`;
        });

        msg += `\n📝 Total: ${commands.size} commands\n`;
        msg += `💡 Use ${prefix}help <command> for details`;

        return api.sendMessage(msg, threadID, messageID);
    }

    return api.sendMessage(
        getText(
            "moduleInfo", 
            command.config.name, 
            command.config.description, 
            `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
            command.config.commandCategory, 
            command.config.cooldowns, 
            ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
            command.config.credits
        ), 
        threadID, 
        messageID
    );
};
