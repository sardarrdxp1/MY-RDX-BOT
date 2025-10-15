
module.exports.config = {
    name: "help2",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Beginner's Guide - Shows all commands",
    commandCategory: "system",
    usages: "[command name]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 300
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

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body, senderID } = event;

    if (!body || typeof body == "undefined" || body.indexOf("help2") != 0) return;
    const splitBody = body.slice(body.indexOf("help2")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, senderID } = event;

    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    // If command name is provided, show command details
    if (command) {
        return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
    }

    // Show all commands grouped by category
    const categories = {};
    
    for (const [name, value] of commands) {
        const category = value.config.commandCategory || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
    }

    let msg = "✥﹤┈┈┈┈┈┈┈┈﹥✥\n";
    msg += "   ALL COMMANDS LIST\n";
    msg += "✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n";

    Object.keys(categories).sort().forEach(category => {
        msg += `✿ ${category.toUpperCase()}\n`;
        categories[category].sort().forEach((cmd) => {
            msg += `╰┈➤${cmd}\n`;
        });
        msg += `\n`;
    });

    msg += `✥﹤┈┈┈┈┈┈┈┈﹥✥\n`;
    msg += `Total: ${commands.size} commands\n`;
    msg += `✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n`;
    msg += `Use ${prefix}help2 <command> for details`;

    return api.sendMessage(msg, threadID, async (error, info) => {
        if (autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
            return api.unsendMessage(info.messageID);
        } else return;
    }, event.messageID);
};
