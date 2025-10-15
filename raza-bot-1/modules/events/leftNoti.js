module.exports = {
    config: {
        name: "leftNoti",
        description: "Notify when members leave the group"
    },
    async run({ api, event, config }) {
        if (event.logMessageType === "log:unsubscribe") {
            const { leftParticipantFbId } = event.logMessageData;
            const { threadID } = event;
            
            if (!leftParticipantFbId) return;
            
            try {
                let userName = "A member";
                
                try {
                    const userInfo = await api.getUserInfo(leftParticipantFbId);
                    if (userInfo && userInfo[leftParticipantFbId]) {
                        userName = userInfo[leftParticipantFbId].name || "A member";
                    }
                } catch (err) {
                    console.error(`Could not fetch user info: ${err.message}`);
                }
                
                const leaveMsg = `
╔════════════════════════════╗
║      GOODBYE 👋            ║
╚════════════════════════════╝

😢 ${userName} has left the group

We'll miss you! Take care! 💫
                `.trim();
                
                await api.sendMessageMqtt(leaveMsg, threadID);
            } catch (err) {
                console.error(`LeftNoti error: ${err.message}`);
            }
        }
    }
};
