module.exports.config = {
    name: "stats",
    version: "2.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Show bot system statistics and performance",
    category: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const os = require('os');
    const pidusage = require('pidusage');

    try {
        const stats = await pidusage(process.pid);
        
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const totalBots = global.client.accounts.size;
        const totalCommands = global.client.commands.size;
        const totalEvents = global.client.events.size;

        const message = `
╔═══════════════════════════╗
║     BOT STATISTICS        ║
╚═══════════════════════════╝

🤖 BOT INFO
├─ Name: Kashif Raza Bot
├─ Version: 2.0.0
├─ Active Bots: ${totalBots}
├─ Commands: ${totalCommands}
└─ Events: ${totalEvents}

📊 SYSTEM INFO
├─ Uptime: ${hours}h ${minutes}m ${seconds}s
├─ CPU: ${stats.cpu.toFixed(2)}%
├─ Memory: ${(stats.memory / 1024 / 1024).toFixed(2)} MB
├─ Platform: ${os.platform()}
└─ Node: ${process.version}

💻 SERVER INFO
├─ Total RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB
├─ Free RAM: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB
├─ CPU Cores: ${os.cpus().length}
└─ Architecture: ${os.arch()}

✨ Powered by Kashif Raza FCA
        `.trim();

        return api.sendMessage(message, threadID, messageID);
    } catch (error) {
        return api.sendMessage("❌ Error fetching statistics!", threadID, messageID);
    }
};
