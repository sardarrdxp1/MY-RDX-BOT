
module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Beginner's Guide - Shows all commands with pagination",
    commandCategory: "system",
    usages: "[page number] or [command name]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: false,
        delayUnsend: 60
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "✥﹤┈┈┈┈┈┈┈┈﹥✥\n╰┈➤ Command: %1\n╰┈➤ Description: %2\n╰┈➤ Usage: %3\n╰┈➤ Category: %4\n╰┈➤ Cooldown: %5s\n╰┈➤ Permission: %6\n╰┈➤ By: %7\n✥﹤┈┈┈┈┈┈┈┈﹥✥",
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

    // If command name is provided, show command details
    if (command) {
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
    }

    // Pagination system - 10 commands per page
    const categories = {};
    const allCommands = [];
    
    for (const [name, value] of commands) {
        const category = value.config.commandCategory || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
        allCommands.push({ name, category });
    }

    const page = parseInt(args[0]) || 1;
    const commandsPerPage = 10;
    const totalPages = Math.ceil(allCommands.length / commandsPerPage);
    
    if (page < 1 || page > totalPages) {
        return api.sendMessage(`Invalid page number! Total pages: ${totalPages}`, threadID, messageID);
    }

    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const pageCommands = allCommands.slice(startIndex, endIndex);

    let msg = "✥﹤┈┈┈┈┈┈┈┈﹥✥\n";
    msg += "     COMMAND LIST\n";
    msg += "✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n";

    let currentCategory = "";
    pageCommands.forEach((cmd) => {
        if (cmd.category !== currentCategory) {
            if (currentCategory !== "") msg += "\n";
            msg += `✿ ${cmd.category.toUpperCase()}\n`;
            currentCategory = cmd.category;
        }
        msg += `╰┈➤${cmd.name}\n`;
    });

    msg += `\n✥﹤┈┈┈┈┈┈┈┈﹥✥\n`;
    msg += `Page ${page}/${totalPages}\n`;
    msg += `Total: ${commands.size} commands\n`;
    msg += `✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n`;
    msg += `Use ${prefix}help <command> for details\n`;
    msg += `Use ${prefix}help <page> for next page`;

    return api.sendMessage(msg, threadID, messageID);
};
