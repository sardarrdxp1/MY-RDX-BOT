module.exports.config = {
    name: "video",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RDX_ZAIN",
    description: "Search and download videos from YouTube",
    commandCategory: "media",
    usages: "[video name]",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const fs = require('fs-extra');
    const path = require('path');
    const { threadID, messageID } = event;

    try {
        const query = args.join(" ");

        if (!query) {
            return api.sendMessage("Please provide a video name!\n\nExample: /video Spectre", threadID, messageID);
        }

        // Send searching message
        const searchMsg = await api.sendMessage("🔍 Searching for: " + query + "\nPlease wait...", threadID);

        // Define the 6 animation steps (limited to 6 edits due to Messenger restrictions)
        const progressBarLength = 20; // Length of the progress bar
        const animationSteps = [
            { message: "🔍 Searching...", progress: 10, delay: 1000 },
            { message: "🎥 Video found!", progress: 30, delay: 1000 },
            { message: "🎥 Downloading...", progress: 50, delay: 1500 },
            { message: "🎥 Processing...", progress: 70, delay: 1500 },
            { message: "🎥 Finalizing...", progress: 90, delay: 1000 },
            { message: "🎥 Complete! ✅", progress: 100, delay: 500 }
        ];

        // Function to update progress bar
        const updateProgress = async (step) => {
            const filled = Math.round((step.progress / 100) * progressBarLength);
            const empty = progressBarLength - filled;
            const progressBar = "█".repeat(filled) + "░".repeat(empty);
            const message = `${step.message}\n\n${progressBar} ${step.progress}%`;
            await api.editMessage(message, searchMsg.messageID);
        };

        // Search for the video
        api.setMessageReaction("⌛", event.messageID, () => {}, true);
        await updateProgress(animationSteps[0]); // Edit 1: Searching (10%)
        const searchUrl = `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);
        await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

        // Log the API response for debugging
        console.log("Search API Response:", JSON.stringify(searchResponse.data, null, 2));

        if (!searchResponse.data.status || !searchResponse.data.result || searchResponse.data.result.length === 0) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("No results found for your search!", threadID, messageID);
        }

        const firstResult = searchResponse.data.result[0];

        // Validate required fields
        if (!firstResult.title || !firstResult.url) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("Invalid video data received from the API!", threadID, messageID);
        }

        // Handle duration safely
        const duration = firstResult.duration && typeof firstResult.duration === 'string' 
            ? firstResult.duration 
            : "Unknown duration";

        // Video found
        await updateProgress(animationSteps[1]); // Edit 2: Video found (30%)
        await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

        // Downloading
        await updateProgress(animationSteps[2]); // Edit 3: Downloading (50%)
        const downloadStartTime = Date.now();
        const downloadUrl = `https://apis-keith.vercel.app/download/video?url=${encodeURIComponent(firstResult.url)}`;
        const downloadResponse = await axios.get(downloadUrl);

        // Log the download API response for debugging
        console.log("Download API Response:", JSON.stringify(downloadResponse.data, null, 2));

        if (!downloadResponse.data.status || !downloadResponse.data.result) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("Failed to download the video!", threadID, messageID);
        }

        const videoUrl = downloadResponse.data.result;
        const filePath = path.join(__dirname, `cache/video_${Date.now()}.mp4`);

        // Adjust delay to match download time
        const downloadTime = Date.now() - downloadStartTime;
        const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
        await new Promise(resolve => setTimeout(resolve, remainingDelay));

        // Processing
        await updateProgress(animationSteps[3]); // Edit 4: Processing (70%)
        const videoData = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, Buffer.from(videoData.data));
        await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

        // Finalizing
        await updateProgress(animationSteps[4]); // Edit 5: Finalizing (90%)
        await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

        // Complete
        await updateProgress(animationSteps[5]); // Edit 6: Complete (100%)
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // Send the video file
        await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
        await api.sendMessage({
            body: `${firstResult.title}\nDuration: ${duration}\nViews: ${firstResult.views ? parseInt(firstResult.views).toLocaleString() : "Unknown"}\nPublished: ${firstResult.published || "Unknown"}`,
            attachment: fs.createReadStream(filePath)
        }, threadID, messageID);

        // Delete file and unsend progress message after sending
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                api.unsendMessage(searchMsg.messageID);
            } catch (cleanupError) {
                console.log("Cleanup error:", cleanupError);
            }
        }, 3000);

    } catch (error) {
        console.error("Error:", error);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("Error: " + error.message + "\n\nPlease try again later!", threadID, messageID);
    }
};