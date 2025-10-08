const { formatMessage } = require('../../utils/formatter');


module.exports.config = {
    name: "help",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Kashif Raza",
    description: "Display commands with page system",
    commandCategory: "System",
    usages: "[page number]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Threads }) {
    const { threadID, messageID } = event;
    const threadInfo = await Threads.getInfo(threadID);
    const threadData = global.data.threadData.get(threadID) || {};
    const prefix = threadData.PREFIX || global.config.PREFIX;
    
    const commands = Array.from(global.client.commands.values());
    const commandsPerPage = 10;
    const totalPages = Math.ceil(commands.length / commandsPerPage);
    
    let page = parseInt(args[0]) || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const pageCommands = commands.slice(startIndex, endIndex);
    
    const categories = {};
    pageCommands.forEach(cmd => {
        const category = cmd.config.commandCategory || "Uncategorized";
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(cmd.config.name);
    });
    
    let message = `Help - Page ${page}/${totalPages}\n\n`;
    
    for (const [category, cmds] of Object.entries(categories)) {
        message += `${category}\n`;
        cmds.forEach(cmd => {
            message += `  - ${prefix}${cmd}\n`;
        });
        message += "\n";
    }
    
    message += `Usage: ${prefix}help <page>\n`;
    message += `Total: ${commands.length} commands\n`;
    message += `Prefix: ${prefix}`;
    
    return api.sendMessage(formatMessage(message), threadID, messageID);
};
