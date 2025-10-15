const fs = require("fs");
const path = require("path");
const chalk = require('chalk');

function loadCommands() {
    const commands = new Map();
    const cmdPath = path.join(__dirname, '../modules/cmds');

    if (!fs.existsSync(cmdPath)) {
        console.log(chalk.yellow('⚠ Commands directory not found'));
        return commands;
    }

    const files = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
        try {
            delete require.cache[require.resolve(path.join(cmdPath, file))];
            const command = require(path.join(cmdPath, file));

            // Support multiple bot formats
            let cmdName = null;
            if (command.config && command.config.name) {
                cmdName = command.config.name.toLowerCase();
            } else if (command.name) {
                cmdName = command.name.toLowerCase();
            }

            if (cmdName) {
                // Normalize command structure
                const normalizedCmd = {
                    config: command.config || { name: cmdName, description: command.description || '' },
                    run: command.run || command.handleCommand || command.onStart || command.execute
                };

                commands.set(cmdName, normalizedCmd);
                console.log(chalk.green(`✅ Loaded command: ${cmdName}`));
            }
        } catch (error) {
            console.log(chalk.red(`❌ Error loading ${file}: ${error.message}`));
        }
    }

    return commands;
}

function loadEvents() {
    const events = new Map();
    const eventPath = path.join(__dirname, '../modules/events');

    if (!fs.existsSync(eventPath)) {
        console.log(chalk.yellow('⚠ Events directory not found'));
        return events;
    }

    const files = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
        try {
            delete require.cache[require.resolve(path.join(eventPath, file))];
            const event = require(path.join(eventPath, file));

            // Support multiple bot formats
            let eventName = null;
            if (event.config && event.config.name) {
                eventName = event.config.name.toLowerCase();
            } else if (event.name) {
                eventName = event.name.toLowerCase();
            } else {
                eventName = file.replace('.js', '').toLowerCase();
            }

            if (eventName) {
                // Normalize event structure
                const normalizedEvent = {
                    config: event.config || { name: eventName, description: event.description || '' },
                    run: event.run || event.handleEvent || event.onEvent || event
                };

                events.set(eventName, normalizedEvent);
                console.log(chalk.green(`✅ Loaded event: ${eventName}`));
            }
        } catch (error) {
            console.log(chalk.red(`❌ Error loading ${file}: ${error.message}`));
        }
    }

    return events;
}

module.exports = {
    loadAll: () => ({
        commands: loadCommands(),
        events: loadEvents()
    })
};