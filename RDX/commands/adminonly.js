const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
    name: "adminonly",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Toggle admin only mode for the bot",
    commandCategory: "Admin",
    usages: "adminonly on/off",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const { writeFileSync } = require("fs-extra");
    const path = require("path");
    const configPath = path.join(__dirname, '../../config.json');

    // Check if user is bot admin
    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage(formatMessage("❌ Only bot admins can use this command!"), threadID, messageID);
    }

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);

    if (!args[0]) {
        const status = config.adminOnly ? "ON ✅" : "OFF ❌";
        return api.sendMessage(formatMessage(`📋 Admin Only Mode Status: ${status}\n\nUsage: adminonly on/off`), threadID, messageID);
    }

    const action = args[0].toLowerCase();

    if (action === "on") {
        if (config.adminOnly === true) {
            return api.sendMessage(formatMessage("ℹ️ Admin Only mode is already enabled!"), threadID, messageID);
        }

        config.adminOnly = true;
        global.config.adminOnly = true;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

        return api.sendMessage(formatMessage(`✅ Admin Only Mode: ENABLED\n\n🔒 Only bot admins can use the bot now!`), threadID, messageID);

    } else if (action === "off") {
        if (config.adminOnly === false) {
            return api.sendMessage(formatMessage("ℹ️ Admin Only mode is already disabled!"), threadID, messageID);
        }

        config.adminOnly = false;
        global.config.adminOnly = false;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

        return api.sendMessage(formatMessage(`✅ Admin Only Mode: DISABLED\n\n🔓 Everyone can use the bot now!`), threadID, messageID);

    } else {
        return api.sendMessage(formatMessage("❌ Invalid option! Use: adminonly on/off"), threadID, messageID);
    }
};