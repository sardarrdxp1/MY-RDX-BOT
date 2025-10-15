const cron = require('node-cron');
const moment = require('moment-timezone');

const islamicMessages = [
    "🌙 SubhanAllah! Remember Allah in all your actions. (Quran 33:41)",
    "☪️ Alhamdulillah! Be grateful for every blessing. (Quran 14:7)",
    "🕌 La ilaha illallah! There is no god but Allah. (Quran 47:19)",
    "📿 Allahu Akbar! Allah is the Greatest. Seek His guidance in everything.",
    "🤲 Make dua, for verily Allah loves those who ask of Him. (Hadith)"
];

let cronJob = null;
let activeGroups = new Set();

module.exports = {
    config: {
        name: "autoSend",
        description: "Automatically send Islamic messages every hour to all groups"
    },
    
    async run({ api, event }) {
        const { threadID } = event;
        const fs = require('fs-extra');
        const path = require('path');
        
        const dataPath = path.join(__dirname, '../../data/autosend.json');
        let autoSendGroups = {};
        if (fs.existsSync(dataPath)) {
            autoSendGroups = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
        
        if (autoSendGroups[threadID]?.enabled) {
            activeGroups.add(threadID);
        }
        
        if (!cronJob && activeGroups.size > 0) {
            cronJob = cron.schedule('0 * * * *', async () => {
                const randomMessage = islamicMessages[Math.floor(Math.random() * islamicMessages.length)];
                const timestamp = moment().tz('Asia/Karachi').format('DD/MM/YYYY hh:mm A');
                
                const message = `
╔════════════════════════════╗
║   ISLAMIC REMINDER ☪️       ║
╚════════════════════════════╝

${randomMessage}

🕐 Time: ${timestamp} PKT
                `.trim();
                
                for (const groupID of activeGroups) {
                    try {
                        await api.sendMessageMqtt(message, groupID);
                    } catch (err) {
                        console.error(`AutoSend error for group ${groupID}: ${err.message}`);
                        activeGroups.delete(groupID);
                    }
                }
                
                if (activeGroups.size === 0 && cronJob) {
                    cronJob.stop();
                    cronJob = null;
                    console.log('❌ AutoSend cron job stopped - no active groups');
                }
            }, {
                scheduled: true,
                timezone: "Asia/Karachi"
            });
            
            console.log('✅ AutoSend cron job started - sending messages every hour');
        }
    },
    
    removeGroup(threadID) {
        activeGroups.delete(threadID);
        if (activeGroups.size === 0 && cronJob) {
            cronJob.stop();
            cronJob = null;
            console.log('❌ AutoSend cron job stopped - no active groups');
        }
    },
    
    stop() {
        if (cronJob) {
            cronJob.stop();
            cronJob = null;
            activeGroups.clear();
            console.log('❌ AutoSend cron job stopped');
        }
    }
};
