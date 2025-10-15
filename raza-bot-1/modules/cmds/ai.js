module.exports.config = {
    name: "ai",
    version: "2.0.0",
    permission: 0,
    credits: "Kashif Raza",
    description: "Chat with AI (Gemini)",
    category: "ai",
    usages: "<question>",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (args.length === 0) {
        return api.sendMessage("❌ Please provide a question!\n\nExample: /ai What is AI?", threadID, messageID);
    }

    const question = args.join(" ");
    
    api.sendMessage("🤖 Thinking...", threadID, async (err, info) => {
        if (err) return;
        
        try {
            const axios = require('axios');
            
            const response = await axios.get(`https://api.kastg.xyz/api/ai/gemini-advanced?prompt=${encodeURIComponent(question)}`);
            
            if (response.data && response.data.response) {
                const answer = response.data.response;
                
                const message = `
╔═══════════════════════════╗
║       KASHIF AI           ║
╚═══════════════════════════╝

❓ Question: ${question}

💡 Answer:
${answer}

✨ Powered by Gemini AI
                `.trim();

                api.editMessage(message, info.messageID);
            } else {
                api.editMessage("❌ No response from AI. Please try again!", info.messageID);
            }
        } catch (error) {
            api.editMessage("❌ Error: Unable to connect to AI service!\n\nPlease try again later.", info.messageID);
        }
    }, messageID);
};
