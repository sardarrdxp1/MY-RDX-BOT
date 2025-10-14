module.exports.config = {
    name: "video",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Search and download video from YouTube",
    commandCategory: "media",
    usages: "[video name]",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const fs = require('fs-extra');
    const { threadID, messageID } = event;

    try {
        const query = args.join(" ");

        if (!query) {
            return api.sendMessage("Please provide a video name!\n\nExample: /video Saiyaara", threadID, messageID);
        }

        // Send searching message
        const searchMsg = await api.sendMessage("Searching for: " + query + "\nPlease wait...", threadID);

        // Search for the video
        const searchUrl = `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);

        if (!searchResponse.data.status || !searchResponse.data.result || searchResponse.data.result.length === 0) {
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("No results found for your search!", threadID, messageID);
        }

        const firstResult = searchResponse.data.result[0];

        // Update message with download status
        api.unsendMessage(searchMsg.messageID);
        const downloadMsg = await api.sendMessage("Downloading: " + firstResult.title + "\nDuration: " + firstResult.duration + "\nPlease wait...", threadID);

        // Download the video
        const downloadUrl = `https://apis-keith.vercel.app/download/mp4?url=${encodeURIComponent(firstResult.url)}`;
        const downloadResponse = await axios.get(downloadUrl);

        if (!downloadResponse.data.status || !downloadResponse.data.download_url) {
            api.unsendMessage(downloadMsg.messageID);
            return api.sendMessage("Failed to download the video!", threadID, messageID);
        }

        const videoUrl = downloadResponse.data.download_url;
        const filePath = __dirname + `/cache/video_${Date.now()}.mp4`;

        // Download video file to cache
        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, Buffer.from(videoResponse.data));

        // Send the video file
        api.unsendMessage(downloadMsg.messageID);
        await api.sendMessage({
            body: firstResult.title + "\nDuration: " + firstResult.duration + "\nViews: " + parseInt(firstResult.views).toLocaleString() + "\nPublished: " + firstResult.published,
            attachment: fs.createReadStream(filePath)
        }, threadID, messageID);

        // Delete file after sending
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error(error);
        return api.sendMessage("Error: " + error.message + "\n\nPlease try again later!", threadID, messageID);
    }
};