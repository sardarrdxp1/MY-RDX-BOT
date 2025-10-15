
module.exports.config = {
    name: "onlyadmin",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Toggle admin only mode for the bot",
    category: "admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID, senderID } = event;
    const fs = require("fs-extra");
    const path = require("path");
    
    if (!config.adminUIDs || !config.adminUIDs.includes(senderID)) {
        return api.sendMessage("❌ Only bot admins can use this command!", threadID, messageID);
    }
    
    const configPath = path.join(__dirname, "../../config/config.json");
    let currentConfig = {};
    
    try {
        currentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (e) {
        currentConfig = { ...config };
    }
    
    currentConfig.adminOnlyMode = !currentConfig.adminOnlyMode;
    
    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
    
    global.config.adminOnlyMode = currentConfig.adminOnlyMode;
    
    const message = `
╔═══════════════════════════╗
║   ADMIN ONLY MODE         ║
╚═══════════════════════════╝

${currentConfig.adminOnlyMode ? '🔒 Admin Only Mode: ENABLED' : '🔓 Admin Only Mode: DISABLED'}

${currentConfig.adminOnlyMode ? '✅ Only admins can use commands' : '✅ All users can use commands'}
    `.trim();
    
    return api.sendMessage(message, threadID, messageID);
};
