
module.exports.config = {
    name: "pair",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Find your perfect match",
    commandCategory: "Love",
    usages: "pair [tag someone or leave empty]",
    cooldowns: 10,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/`;
    const path = resolve(__dirname, 'cache', 'pair.png');
    if (!existsSync(dirMaterial + "")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/j96ooUs.jpeg", path);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache");

    let pair_img = await jimp.read(__root + "/pair.png");
    let pathImg = __root + `/pair_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    pair_img.resize(700, 440).composite(circleOne.resize(150, 150), 100, 150).composite(circleTwo.resize(150, 150), 450, 150);
    
    let raw = await pair_img.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}

async function circle(image) {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args, Currencies, Users }) { 
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID, participantIDs } = event;
    const mention = Object.keys(event.mentions);
    
    try {
        var one = senderID;
        var two;
        
        if (mention[0]) {
            two = mention[0];
        } else {
            // Random pair from group
            const allUsers = participantIDs.filter(id => id !== senderID);
            two = allUsers[Math.floor(Math.random() * allUsers.length)];
        }
        
        const matchPercent = Math.floor(Math.random() * 101);
        const name1 = await Users.getNameUser(one);
        const name2 = await Users.getNameUser(two);
        
        let msg = `💑 Perfect Match 💑\n\n`;
        msg += `${name1} ❤️ ${name2}\n\n`;
        msg += `Match Percentage: ${matchPercent}%\n`;
        
        if (matchPercent < 30) {
            msg += `Status: Just Friends 👫`;
        } else if (matchPercent < 60) {
            msg += `Status: Good Match 💕`;
        } else if (matchPercent < 80) {
            msg += `Status: Great Match 💖`;
        } else {
            msg += `Status: Perfect Couple 💗`;
        }
        
        const path = await makeImage({ one, two });
        return api.sendMessage({
            body: msg, 
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
        
    } catch (error) {
        console.error("Canvas Error in pair command:", error);
        const name1 = await Users.getNameUser(senderID).catch(() => "User");
        const name2 = await Users.getNameUser(two || senderID).catch(() => "User");
        return api.sendMessage(`💑 Perfect Match 💑\n\n${name1} ❤️ ${name2}\n\n❌ Image creation failed but here's your match!`, threadID, messageID);
    }
};
