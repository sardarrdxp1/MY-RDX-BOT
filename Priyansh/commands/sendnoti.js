
const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
	name: "sendnoti",
	version: "1.0.3",
	hasPermssion: 2,
	credits: "Kashif Raza",
	description: "announcement from admin",
	commandCategory: "Admin",
	usages: "[Text]",
	cooldowns: 5
};
 
module.exports.languages = {
	"vi": {
		"sendSuccess": "Đã gửi thành chỉ tới %1 nhóm",
		"sendFail": "Không thể gửi thành chỉ tới %1 nhóm"
	},
	"en": {
		"sendSuccess": "Sent message to %1 thread!",
		"sendFail": "[!] Can't send message to %1 thread"
	}
}
 
module.exports.run = async ({ api, event, args, getText, Users }) => {
	if (!args || args.length === 0) {
		return api.sendMessage("Please provide a message to send!", event.threadID, event.messageID);
	}

	const name = await Users.getNameUser(event.senderID);
	const moment = require("moment-timezone");
	const gio = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:s");

	if (event.type == "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
		const fs = require('fs');
		const axios = require('axios');
		
		try {
			const attachmentUrl = event.messageReply.attachments[0].url;
			const ext = attachmentUrl.split('.').pop().split('?')[0] || 'jpg';
			const path = __dirname + `/cache/snoti_${Date.now()}.${ext}`;

			const response = await axios.get(attachmentUrl, { responseType: 'arraybuffer' });
			fs.writeFileSync(path, Buffer.from(response.data));

			var allThread = global.data.allThreadID || [];
			var count = 0;
			var cantSend = [];
			
			for (const idThread of allThread) {
				if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
				
				try {
					await api.sendMessage({
						body: formatMessage(`${args.join(" ")}\n\n━━━━━━━━━━━━━━━\nFrom Admin: ${name}\nTime: ${gio}`),
						attachment: fs.createReadStream(path)
					}, idThread);
					count++;
					await new Promise(resolve => setTimeout(resolve, 800));
				} catch (error) {
					if (error.toString().includes('1545012')) {
						// Bot is not part of this thread anymore, remove from list
						const index = allThread.indexOf(idThread);
						if (index > -1) {
							allThread.splice(index, 1);
						}
					}
					cantSend.push(idThread);
				}
			}
			
			// Clean up attachment file
			if (fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
			
			return api.sendMessage(formatMessage(`✅ ${getText("sendSuccess", count)}\n${cantSend.length > 0 ? `❌ Failed: ${cantSend.length} threads` : ''}`), event.threadID, event.messageID);
		} catch (error) {
			return api.sendMessage(formatMessage(`Error: ${error.message}`), event.threadID, event.messageID);
		}
	} else {
		var allThread = global.data.allThreadID || [];
		var count = 0;
		var cantSend = [];
		
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
			
			try {
				await api.sendMessage(formatMessage(`${args.join(" ")}\n\n━━━━━━━━━━━━━━━\nFrom Admin: ${name}\nTime: ${gio}`), idThread);
				count++;
				await new Promise(resolve => setTimeout(resolve, 800));
			} catch (error) {
				if (error.toString().includes('1545012')) {
					// Bot is not part of this thread anymore, remove from list
					const index = allThread.indexOf(idThread);
					if (index > -1) {
						allThread.splice(index, 1);
					}
				}
				cantSend.push(idThread);
			}
		}
		
		return api.sendMessage(formatMessage(`✅ ${getText("sendSuccess", count)}\n${cantSend.length > 0 ? `❌ Failed: ${cantSend.length} threads` : ''}`), event.threadID, event.messageID);
	}
}
