const fs = require('fs');
const path = require('path');

if (!global.processedEvents) {
    global.processedEvents = new Map();
}

module.exports = {
    async handle({ api, event, events, config }) {
        try {
            const eventKey = `${event.threadID}_${event.logMessageType}_${Date.now()}`;

            if (global.processedEvents.has(eventKey)) {
                return;
            }

            global.processedEvents.set(eventKey, true);
            setTimeout(() => global.processedEvents.delete(eventKey), 2000);

            for (const [name, eventModule] of events) {
                if (!eventModule) continue;

                try {
                    // Modern format with run()
                    if (typeof eventModule.run === 'function') {
                        await eventModule.run({ api, event, config });
                    }
                    // Mirai/Goat bot format with handleEvent()
                    else if (typeof eventModule.handleEvent === 'function') {
                        const Users = global.data?.userName || new Map();
                        const Threads = global.data?.threadInfo || new Map();
                        const Currencies = global.data?.allCurrenciesID || new Map();
                        await eventModule.handleEvent({
                            api,
                            event,
                            Users,
                            Threads,
                            Currencies,
                            global,
                            client: api
                        });
                    }
                    // GoatBot V2 format with onStart()
                    else if (typeof eventModule.onStart === 'function') {
                        const message = {
                            send: (msg, callback) => api.sendMessage(msg, event.threadID, callback),
                            reply: (msg, callback) => api.sendMessage(msg, event.threadID, event.messageID, callback),
                            react: (emoji) => api.setMessageReaction(emoji, event.messageID, () => {}, true)
                        };
                        await eventModule.onStart({ api, event, message, args: [], getLang: (key) => key });
                    }
                    // AutoBot format with onEvent()
                    else if (eventModule.config && typeof eventModule.onEvent === 'function') {
                        await eventModule.onEvent({ api, event });
                    }
                    // Direct function format
                    else if (typeof eventModule === 'function') {
                        await eventModule({ api, event, config });
                    }
                } catch (moduleErr) {
                    console.error(`Error in event module ${name}:`, moduleErr);
                }
            }
        } catch (err) {
            console.error("Event handler error:", err);
        }
    }
};