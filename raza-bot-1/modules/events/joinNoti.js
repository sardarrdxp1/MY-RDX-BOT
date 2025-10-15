module.exports = {
    config: {
        name: "joinNoti",
        description: "Welcome new members to the group"
    },
    async run({ api, event, config }) {
        if (event.logMessageType === "log:subscribe") {
            const { addedParticipants } = event.logMessageData;
            const { threadID } = event;
            
            if (!addedParticipants || addedParticipants.length === 0) return;
            
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const threadName = threadInfo.threadName || threadInfo.name || "this group";
                
                for (const participant of addedParticipants) {
                    const name = participant.fullName || "New Member";
                    
                    const welcomeMsg = `
╔════════════════════════════╗
║      WELCOME! 🎉           ║
╚════════════════════════════╝

👋 Welcome ${name}!

🎊 Welcome to ${threadName}
💫 We're happy to have you here!
📝 Type ${config.prefix}help to see available commands

Enjoy your stay! 🌟
                    `.trim();
                    
                    await api.sendMessageMqtt(welcomeMsg, threadID);
                }
            } catch (err) {
                console.error(`JoinNoti error: ${err.message}`);
            }
        }
    }
};
