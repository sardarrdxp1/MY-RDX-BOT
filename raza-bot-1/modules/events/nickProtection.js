
module.exports.config = {
    name: "nickProtection",
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Automatically restore locked nicknames when changed"
};

if (!global.nickProtectionProcessing) {
    global.nickProtectionProcessing = new Map();
}

module.exports.run = async function({ api, event }) {
    const fs = require('fs-extra');
    const path = require('path');

    try {
        if (event.logMessageType === 'log:user-nickname') {
            const eventKey = `${event.threadID}_${event.participant}_${event.author}`;
            const botRestorationKey = `bot_restore_nick_${event.threadID}_${event.participant}`;
            
            if (global.nickProtectionProcessing.has(eventKey)) {
                return;
            }
            
            if (global.nickProtectionProcessing.has(botRestorationKey)) {
                global.nickProtectionProcessing.delete(botRestorationKey);
                return;
            }
            
            global.nickProtectionProcessing.set(eventKey, true);
            setTimeout(() => global.nickProtectionProcessing.delete(eventKey), 2000);

            const dataPath = path.join(__dirname, '../cmds/data/locknick.json');

            if (!fs.existsSync(dataPath)) return;

            let lockedNicks = {};
            try {
                lockedNicks = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            } catch (e) {
                return;
            }
            
            if (!lockedNicks[event.threadID]) return;
            
            const lockedNickname = lockedNicks[event.threadID][event.participant];
            
            if (!lockedNickname) return;

            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                global.nickProtectionProcessing.set(botRestorationKey, true);
                await api.nickname(lockedNickname, event.threadID, event.participant);
                
                await api.sendMessage(`🔒 Nickname restored to "${lockedNickname}" (Locked)`, event.threadID);
            } catch (err) {
                console.error('Error restoring nickname:', err.message);
                global.nickProtectionProcessing.delete(botRestorationKey);
            }
        }
    } catch (err) {
        console.error('Nickname protection event error:', err.message);
    }
};
