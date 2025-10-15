
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'clearcache',
    version: '1.0.0',
    credits: 'Kashif Raza',
    hasPermission: 2,
    description: 'Clear cache files for users and bots',
    commandCategory: 'Admin',
    usages: 'clearcache [user|bot|all]',
    cooldown: 5,
    usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    try {
        const type = args[0] ? args[0].toLowerCase() : 'all';
        let cleared = [];
        
        if (type === 'user' || type === 'all') {
            const userCachePath = path.join(__dirname, '../cmds/cache');
            if (fs.existsSync(userCachePath)) {
                const files = fs.readdirSync(userCachePath);
                let count = 0;
                for (const file of files) {
                    if (file !== '.gitkeep') {
                        fs.unlinkSync(path.join(userCachePath, file));
                        count++;
                    }
                }
                cleared.push(`🗑️ Cleared ${count} user cache files`);
            }
        }
        
        if (type === 'bot' || type === 'all') {
            const botCachePaths = [
                path.join(__dirname, '../../ryk/script/commands/cache'),
                path.join(__dirname, '../../ryk/script/events/cache')
            ];
            
            let botCount = 0;
            for (const cachePath of botCachePaths) {
                if (fs.existsSync(cachePath)) {
                    const files = fs.readdirSync(cachePath);
                    for (const file of files) {
                        if (file !== '.gitkeep' && file !== 'cache') {
                            try {
                                fs.unlinkSync(path.join(cachePath, file));
                                botCount++;
                            } catch (err) {
                                console.error('Error deleting file:', err);
                            }
                        }
                    }
                }
            }
            cleared.push(`🗑️ Cleared ${botCount} bot cache files`);
        }
        
        if (type === 'gc' || type === 'all') {
            const gcCachePath = path.join(__dirname, '../cmds/cache');
            if (fs.existsSync(gcCachePath)) {
                const files = fs.readdirSync(gcCachePath).filter(f => f.startsWith('gc_'));
                for (const file of files) {
                    fs.unlinkSync(path.join(gcCachePath, file));
                }
                cleared.push(`🗑️ Cleared ${files.length} group cache files`);
            }
        }
        
        const message = `
╔════════════════════════════╗
║      CACHE CLEARED         ║
╚════════════════════════════╝

${cleared.join('\n')}

✅ Cache cleared successfully!
        `.trim();
        
        return api.sendMessage(message, threadID, messageID);
        
    } catch (err) {
        return api.sendMessage(`❌ Error clearing cache: ${err.message}`, threadID, messageID);
    }
};
