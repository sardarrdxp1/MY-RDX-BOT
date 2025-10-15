

if (!global.callNotiProcessing) {
    global.callNotiProcessing = new Map();
}

module.exports = {
    config: {
        name: "callNoti",
        description: "Notify when someone starts or joins a call"
    },
    async run({ api, event }) {
        if (event.logMessageType === "log:thread-call") {
            const { threadID, logMessageData, author } = event;
            
            try {
                if (!logMessageData) return;

                const eventKey = `${threadID}_${logMessageData.event || 'call'}_${logMessageData.joining_user || author}`;
                
                if (global.callNotiProcessing.has(eventKey)) {
                    return;
                }
                
                global.callNotiProcessing.set(eventKey, true);
                setTimeout(() => { global.callNotiProcessing.delete(eventKey); }, 3000);

                const isVideo = logMessageData.video === 'true' || logMessageData.video === true;
                const callType = isVideo ? "Video Call" : "Audio Call";
                
                if (logMessageData.event === 'group_call_started') {
                    let callerName = "Someone";
                    try {
                        const callerID = author || logMessageData.caller_id;
                        if (callerID && callerID !== '0') {
                            const userInfo = await api.getUserInfo(callerID);
                            if (userInfo && userInfo.name) {
                                callerName = userInfo.name;
                            } else if (userInfo[callerID] && userInfo[callerID].name) {
                                callerName = userInfo[callerID].name;
                            }
                        }
                    } catch (err) {
                        console.error('Error getting caller name:', err.message);
                    }

                    const callMsg = `
╔════════════════════════════╗
║      CALL NOTIFICATION     ║
╚════════════════════════════╝

${isVideo ? '📹' : '📞'} ${callType} Started!
👤 ${callerName} started the call

📱 Join the call to connect!
                    `.trim();
                    
                    await api.sendMessage(callMsg, threadID);
                } 
                else if (logMessageData.joining_user) {
                    let joinerName = "Someone";
                    try {
                        const joinerID = logMessageData.joining_user;
                        const userInfo = await api.getUserInfo(joinerID);
                        if (userInfo && userInfo.name) {
                            joinerName = userInfo.name;
                        } else if (userInfo[joinerID] && userInfo[joinerID].name) {
                            joinerName = userInfo[joinerID].name;
                        }
                    } catch (err) {
                        console.error('Error getting joiner name:', err.message);
                    }

                    const joinMsg = `👤 ${joinerName} joined the ${callType.toLowerCase()}!`;
                    await api.sendMessage(joinMsg, threadID);
                }

            } catch (err) {
                console.error(`CallNoti error: ${err.message}`);
            }
        }
    }
};
