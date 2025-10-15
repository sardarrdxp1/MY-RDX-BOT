
module.exports = {
    async handle({ api, event, config }) {
        if (event.type === "call") {
            const callType = event.isVideo ? "📹 Video" : "📞 Voice";
            console.log(`${callType} call from ${event.senderID} in thread ${event.threadID}`);
            
            if (config.autoDeclineCall) {
                api.sendMessageMqtt(`❌ Bot cannot receive ${callType.toLowerCase()} calls.`, event.threadID);
            }
        }
    }
};
