const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
        name: "shell",
        version: "7.3.1",
        hasPermssion: 2,
        credits: "Kashif Raza",
        description: "running shell",
        commandCategory: "System",
        usages: "[shell]",
        cooldowns: 0,
        dependencies: {
                "child_process": ""
        }
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
        const { exec } = require("child_process");
        
        let text = args.join(" ");
        
        if (!text) {
                return api.sendMessage(formatMessage("Please provide a command to execute"), event.threadID, event.messageID);
        }
        
        exec(`${text}`, (error, stdout, stderr) => {
            if (error) {
                api.sendMessage(formatMessage(`Error:\n${error.message}`), event.threadID, event.messageID);
                return;
            }
            if (stderr) {
                api.sendMessage(formatMessage(`Stderr:\n${stderr}`), event.threadID, event.messageID);
                return;
            }
            api.sendMessage(formatMessage(`Output:\n${stdout}`), event.threadID, event.messageID);
        });
}
