module.exports.config = {
    name: "restart",
    description: "Restart the bot system",
    permission: 2,
    credits: "System"
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID } = event;
    const chalk = require('chalk');

    try {
        console.log(chalk.yellow('\n⚡ Initiating bot restart...\n'));

        await api.sendMessage('🔄 Restarting bot...', threadID, messageID);

        const currentUID = api.getCurrentUserID();

        // Step 1: Stop ALL existing listeners first
        console.log(chalk.blue('🛑 Stopping all existing listeners...'));
        for (const [uid, botAccount] of global.client.accounts.entries()) {
            if (typeof botAccount.stopListening === 'function') {
                try {
                    botAccount.stopListening();
                    console.log(chalk.yellow(`✓ Stopped listener for bot: ${uid}`));
                } catch (err) {
                    console.log(chalk.red(`✗ Error stopping listener for ${uid}:`, err.message));
                }
            }
        }

        // Step 2: Clear module cache
        console.log(chalk.blue('📦 Clearing module cache...'));
        Object.keys(require.cache).forEach((key) => {
            if (key.includes('modules/cmds') || key.includes('modules/events') || key.includes('raza/listen')) {
                delete require.cache[key];
            }
        });

        // Step 3: Reload commands and events
        console.log(chalk.blue('♻️ Reloading commands and events...'));
        const loader = require('../../raza/loader');
        const { commands, events } = loader.loadAll();

        global.client.commands = commands;
        global.client.events = events;

        console.log(chalk.green(`✓ Loaded ${commands.size} commands`));
        console.log(chalk.green(`✓ Loaded ${events.size} events\n`));

        // Step 4: Wait a bit to ensure old listeners are fully stopped
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 5: Create new listener for current bot only
        const botAccount = global.client.accounts.get(currentUID);

        if (botAccount) {
            console.log(chalk.blue(`🔄 Creating new listener for bot: ${currentUID}`));

            const config = JSON.parse(require('fs').readFileSync('./config/config.json', 'utf8'));
            const listen = require('../../raza/listen');

            const stopListening = api.listenMqtt(async (err, event) => {
                if (err) {
                    console.error(chalk.red(`Listen error:`, err));
                    return;
                }

                const botConfig = {
                    ...config,
                    prefix: botAccount.info.prefix,
                    botName: botAccount.info.botname,
                    adminUIDs: botAccount.info.admins
                };

                await listen.handleEvent(api, event, global.client.commands, global.client.events, botConfig);
            });

            // Update the account with new listener
            global.client.accounts.set(currentUID, {
                ...botAccount,
                stopListening: stopListening
            });

            console.log(chalk.green(`✓ New listener created for bot: ${currentUID}`));
        }

        await api.sendMessage(`
╔════════════════════════════╗
║      BOT RESTARTED         ║
╚════════════════════════════╝

✅ Bot restarted successfully!

📊 Loaded:
• ${commands.size} commands
• ${events.size} events

🤖 All systems operational!
        `.trim(), threadID, messageID);

        console.log(chalk.green('✓ Bot restart completed successfully!\n'));

    } catch (error) {
        console.error(chalk.red('❌ Restart failed:'), error);
        await api.sendMessage(`❌ Restart failed: ${error.message}`, threadID, messageID);
    }
};