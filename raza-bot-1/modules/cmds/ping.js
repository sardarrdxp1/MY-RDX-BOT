module.exports.config = {
    name: "ping",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Check bot response time",
    category: "system",
    usages: "",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const timeStart = Date.now();

    await api.sendMessage("📡 Pinging...", threadID, async (err, info) => {
        if (err) return;
        
        const ping = Date.now() - timeStart;
        
        let status = "🟢 Excellent";
        if (ping > 500) status = "🟡 Good";
        if (ping > 1000) status = "🟠 Fair";
        if (ping > 2000) status = "🔴 Poor";

        const message = `
╔═══════════════════════════╗
║       PING RESULT         ║
╚═══════════════════════════╝

⏱️ Response Time: ${ping}ms
📊 Status: ${status}
🤖 Bot: Online
✅ Connection: Stable
        `.trim();

        api.editMessage(message, info.messageID);
    }, messageID);
};
