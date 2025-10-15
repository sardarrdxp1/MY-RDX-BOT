module.exports.config = {
    name: "uptime",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Check how long the bot has been running",
    category: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const message = `
╔═══════════════════════════╗
║      BOT UPTIME           ║
╚═══════════════════════════╝

⏰ Current Uptime:
${days > 0 ? `📅 ${days} day(s)\n` : ''}🕐 ${hours} hour(s)
⏱️ ${minutes} minute(s)
⏳ ${seconds} second(s)

🤖 Status: Running Smoothly
✅ All Systems Operational
    `.trim();

    return api.sendMessage(message, threadID, messageID);
};
