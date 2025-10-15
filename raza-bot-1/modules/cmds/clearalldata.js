
module.exports.config = {
    name: "clearalldata",
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Clear all bots and users data (Admin only)",
    permission: 2
};

module.exports.run = async function({ api, event, config }) {
    const { threadID, messageID, senderID } = event;
    const fs = require('fs-extra');
    const path = require('path');

    try {
        if (!config.adminUIDs || !config.adminUIDs.includes(senderID)) {
            return api.sendMessage("❌ Only bot admins can use this command!", threadID, messageID);
        }

        const usersPath = path.join(__dirname, '../../config/users.json');
        const dashboardUsersPath = path.join(__dirname, '../../config/dashboard_users.json');
        const statesDir = path.join(__dirname, '../../states');
        const rykBotsPath = path.join(__dirname, '../../ryk/bots.json');

        fs.writeFileSync(usersPath, JSON.stringify({ bots: [] }, null, 2));
        console.log('✓ Cleared config/users.json');

        fs.writeFileSync(dashboardUsersPath, JSON.stringify({ users: [] }, null, 2));
        console.log('✓ Cleared config/dashboard_users.json');

        if (fs.existsSync(rykBotsPath)) {
            fs.writeFileSync(rykBotsPath, JSON.stringify([], null, 2));
            console.log('✓ Cleared ryk/bots.json');
        }

        if (fs.existsSync(statesDir)) {
            const files = fs.readdirSync(statesDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    fs.unlinkSync(path.join(statesDir, file));
                }
            }
            console.log('✓ Cleared all state files');
        }

        for (const [uid, botAccount] of global.client.accounts) {
            if (botAccount.stopListening && typeof botAccount.stopListening === 'function') {
                try {
                    botAccount.stopListening();
                } catch (err) {
                    console.error(`Error stopping listener for ${uid}: ${err.message}`);
                }
            }
            if (botAccount.api && typeof botAccount.api.logout === 'function') {
                try {
                    botAccount.api.logout();
                } catch (err) {
                    console.error(`Error logging out ${uid}: ${err.message}`);
                }
            }
        }
        global.client.accounts.clear();

        return api.sendMessage(`
╔════════════════════════════╗
║   ALL DATA CLEARED         ║
╚════════════════════════════╝

✅ Successfully cleared:
• All bot accounts
• All user data
• All state files
• All dashboard users

⚠️ Please restart the bot to complete the cleanup.
        `.trim(), threadID, messageID);

    } catch (error) {
        console.error('Error clearing data:', error);
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
