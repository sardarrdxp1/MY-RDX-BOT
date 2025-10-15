const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const configPath = path.join(__dirname, "../config/config.json");

const handlers = {
    message: require("./handles/message"),
    reply: require("./handles/reply"),
    reaction: require("./handles/reaction"),
    unsend: require("./handles/unsend"),
    event: require("./handles/event"),
    read: require("./handles/read"),
    typing: require("./handles/typing"),
    presence: require("./handles/presence"),
    attachment: require("./handles/attachment"),
    call: require("./handles/call")
};

async function handleEvent(api, event, commands, events, customConfig) {
    if (!event) return;

    const config = customConfig || JSON.parse(fs.readFileSync(configPath, "utf8"));

    try {
        for (const [name, eventModule] of events) {
            if (eventModule.run) {
                await eventModule.run({ api, event, config });
            }
        }

        if (event.type === "message" && event.body) {
            const botAccount = Array.from(global.client.accounts.values()).find(
                acc => acc.api.getCurrentUserID && acc.api.getCurrentUserID() === api.getCurrentUserID()
            );
            const botConfig = botAccount ? {
                ...config,
                prefix: botAccount.info.prefix,
                botName: botAccount.info.botname,
                adminUIDs: botAccount.info.admins
            } : config;

            await handlers.message.handle({ api, event, commands, config: botConfig });
        } else if (event.type === "message_reply") {
            const botAccount = Array.from(global.client.accounts.values()).find(
                acc => acc.api.getCurrentUserID && acc.api.getCurrentUserID() === api.getCurrentUserID()
            );
            const botConfig = botAccount ? {
                ...config,
                prefix: botAccount.info.prefix,
                botName: botAccount.info.botname,
                adminUIDs: botAccount.info.admins
            } : config;
            await handlers.reply.handle({ api, event, commands, config: botConfig });
        } else if (event.type === "message_reaction") {
            await handlers.reaction.handle({ api, event, config });
        } else if (event.type === "message_unsend") {
            await handlers.unsend.handle({ api, event, config });
        } else if (event.type === "event") {
            await handlers.event.handle({ api, event, events, config });
        } else if (event.type === "read" || event.type === "read_receipt") {
            await handlers.read.handle({ api, event, config });
        } else if (event.type === "typ") {
            await handlers.typing.handle({ api, event, config });
        } else if (event.type === "presence") {
            await handlers.presence.handle({ api, event, config });
        } else if (event.type === "call") {
            await handlers.call.handle({ api, event, config });
        }
    } catch (err) {
        console.error("Error handling event:", err);
    }
}

module.exports = { handleEvent };