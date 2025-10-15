
module.exports.config = {
    name: "removebg",
    version: "1.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Remove background from image",
    category: "image",
    usages: "Reply to an image",
    cooldowns: 15
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const axios = require('axios');
    const fs = require('fs-extra');
    const path = require('path');
    
    if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
        return api.sendMessage("❌ Please reply to an image!", threadID, messageID);
    }
    
    const imageUrl = messageReply.attachments[0].url;
    
    api.sendMessage("🎨 Removing background...", threadID, async (err, info) => {
        try {
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
                image_url: imageUrl,
                size: 'auto'
            }, {
                headers: {
                    'X-Api-Key': 'YOUR_API_KEY_HERE'
                },
                responseType: 'arraybuffer'
            });
            
            const imagePath = path.join(__dirname, 'cache', `${Date.now()}.png`);
            fs.writeFileSync(imagePath, response.data);
            
            api.sendMessage({
                body: "✅ Background removed!",
                attachment: fs.createReadStream(imagePath)
            }, threadID, () => {
                fs.unlinkSync(imagePath);
                api.unsendMessage(info.messageID);
            }, messageID);
            
        } catch (error) {
            api.editMessage(`❌ Error: ${error.message}`, info.messageID);
        }
    }, messageID);
};
