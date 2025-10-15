module.exports.config = {
    name: "autosend",
    version: "1.0.0",
    permission: 1,
    credits: "Kashif Raza",
    description: "Control auto-sending Islamic messages every hour",
    category: "group",
    usages: "on/off",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const fs = require('fs-extra');
    const path = require('path');
    
    const dataPath = path.join(__dirname, '../../data/autosend.json');
    
    let autoSendGroups = {};
    if (fs.existsSync(dataPath)) {
        autoSendGroups = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        autoSendGroups[threadID] = {
            enabled: true,
            addedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(dataPath, JSON.stringify(autoSendGroups, null, 2));
        
        const autoSendEvent = global.client.events.get('autoSend');
        if (autoSendEvent && autoSendEvent.run) {
            await autoSendEvent.run({ api, event: { threadID } });
        }
        
        return api.sendMessage(`
╔════════════════════════════╗
║   AUTO-SEND ENABLED ☪️      ║
╚════════════════════════════╝

✅ Auto-send Islamic messages activated!

📅 Schedule: Every hour
🕐 Timezone: Asia/Karachi (PKT)
📝 Random Islamic reminders will be sent

May Allah bless this group! 🤲
        `.trim(), threadID, messageID);
    }
    
    else if (action === 'off') {
        if (autoSendGroups[threadID]) {
            delete autoSendGroups[threadID];
            fs.writeFileSync(dataPath, JSON.stringify(autoSendGroups, null, 2));
            
            const autoSendEvent = global.client.events.get('autoSend');
            if (autoSendEvent && autoSendEvent.removeGroup) {
                autoSendEvent.removeGroup(threadID);
            }
            
            return api.sendMessage(`
╔════════════════════════════╗
║   AUTO-SEND DISABLED       ║
╚════════════════════════════╝

❌ Auto-send has been disabled for this group.
            `.trim(), threadID, messageID);
        } else {
            return api.sendMessage('ℹ️ Auto-send is already disabled in this group.', threadID, messageID);
        }
    }
    
    else {
        const status = autoSendGroups[threadID]?.enabled ? '✅ Enabled' : '❌ Disabled';
        return api.sendMessage(`
╔════════════════════════════╗
║   AUTO-SEND STATUS ☪️       ║
╚════════════════════════════╝

📊 Current Status: ${status}

Usage:
• autosend on - Enable auto-send
• autosend off - Disable auto-send

ℹ️ When enabled, Islamic messages will be sent every hour to this group.
        `.trim(), threadID, messageID);
    }
};
