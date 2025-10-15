
module.exports.config = {
    name: "help2",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Shows all commands",
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

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (command) {
        return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
    }

    const allCommands = [];
    for (const [name, value] of commands) {
        if (!value.config) continue;
        allCommands.push(name);
    }

    let msg = "✥﹤┈┈┈┈┈┈┈┈﹥✥\n";
    msg += "   ALL COMMANDS\n";
    msg += "✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n";

    allCommands.sort().forEach((cmd) => {
        msg += `❥ ${cmd}\n`;
    });

    msg += `\n✥﹤┈┈┈┈┈┈┈┈﹥✥\n`;
    msg += `Total: ${commands.size} commands\n`;
    msg += `✥﹤┈┈┈┈┈┈┈┈﹥✥\n\n`;
    msg += `Use ${prefix}help2 <command> for details`;

    return api.sendMessage(msg, threadID, async (error, info) => {
        if (autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
            return api.unsendMessage(info.messageID);
        } else return;
    }, messageID);
};
