
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
	const name = await Users.getNameUser(event.senderID);
	const moment = require("moment-timezone");
	const gio = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:s");

	if (event.type == "message_reply") {
		const request = global.nodemodule["request"];
		const fs = require('fs');
		const axios = require('axios');
		
		var getURL = await request.get(event.messageReply.attachments[0].url);
		var pathname = getURL.uri.pathname;
		var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
		var path = __dirname + `/cache/snoti.${ext}`;

		var abc = event.messageReply.attachments[0].url;
		let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));

		var allThread = global.data.allThreadID || [];
		var count = 0;
		var cantSend = [];
		
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
			
			try {
				await api.sendMessage({
					body: formatMessage(`${args.join(" ")}\n\nfrom Admin: ${name}`),
					attachment: fs.createReadStream(path)
				}, idThread);
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			} catch (error) {
				cantSend.push(idThread);
			}
		}
		
		// Clean up attachment file
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
		
		return api.sendMessage(getText("sendSuccess", count), event.threadID, () => {
			if (cantSend.length > 0) {
				api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID);
			}
		}, event.messageID);
	} else {
		var allThread = global.data.allThreadID || [];
		var count = 0;
		var cantSend = [];
		
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
			
			try {
				await api.sendMessage(formatMessage(`${args.join(" ")}\n\nfrom Admin: ${name}`), idThread);
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			} catch (error) {
				cantSend.push(idThread);
			}
		}
		
		return api.sendMessage(getText("sendSuccess", count), event.threadID, () => {
			if (cantSend.length > 0) {
				api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID);
			}
		}, event.messageID);
	}
}
