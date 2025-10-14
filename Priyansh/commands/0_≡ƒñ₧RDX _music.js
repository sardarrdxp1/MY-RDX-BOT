
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "music",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "Mian Amir",
    description: "Download YouTube song from keyword search and link",
    category: "media",
    prefix: true,
    premium: false,
    usages: "[songName] [type]",
    cooldowns: 5,
    dependencies: {
      "axios": ""
    },
  },
  run: async function ({ api, event, args }) {
    let songName, type;
    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "audio";
    }

    if (!songName) {
      return api.sendMessage("Please provide a song name!\n\nExample: /music Saiyaara", event.threadID, event.messageID);
    }

    let processingMessage = await api.sendMessage(
      "🔍 Searching for your song...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      // Define the 6 animation steps (limited to 6 edits due to Messenger restrictions)
      const progressBarLength = 20; // Length of the progress bar
      const animationSteps = [
        { message: "🔍 Searching...", progress: 10, delay: 1000 },
        { message: "🎵 Song found!", progress: 30, delay: 1000 },
        { message: "🎵 Downloading...", progress: 50, delay: 1500 },
        { message: "🎵 Processing...", progress: 70, delay: 1500 },
        { message: "🎵 Finalizing...", progress: 90, delay: 1000 },
        { message: "🎵 Complete! ✅", progress: 100, delay: 500 }
      ];

      // Function to update progress bar
      const updateProgress = async (step) => {
        const filled = Math.round((step.progress / 100) * progressBarLength);
        const empty = progressBarLength - filled;
        const progressBar = "█".repeat(filled) + "░".repeat(empty);
        const message = `${step.message}\n\n${progressBar} ${step.progress}%`;
        await api.editMessage(message, processingMessage.messageID);
      };

      // Search for the song on YouTube
      api.setMessageReaction("⌛", event.messageID, () => {}, true);
      await updateProgress(animationSteps[0]); // Edit 1: Searching (10%)
      
      const searchUrl = `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(songName)}`;
      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data.status || !searchResponse.data.result || searchResponse.data.result.length === 0) {
        throw new Error("No results found for your search!");
      }

      const firstResult = searchResponse.data.result[0];
      await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

      // Song found
      await updateProgress(animationSteps[1]); // Edit 2: Song found (30%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

      // Downloading
      await updateProgress(animationSteps[2]); // Edit 3: Downloading (50%)
      const downloadStartTime = Date.now();
      
      const downloadUrl = `https://apis-keith.vercel.app/download/audio?url=${encodeURIComponent(firstResult.url)}`;
      const downloadResponse = await axios.get(downloadUrl);

      if (!downloadResponse.data.status || !downloadResponse.data.result) {
        throw new Error("Failed to download the audio!");
      }

      const audioUrl = downloadResponse.data.result;
      const filename = `music_${Date.now()}.mp3`;
      const filePath = path.join(__dirname, 'cache', filename);

      // Download audio file to cache
      const audioData = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(audioData.data));

      // Adjust delay to match download time
      const downloadTime = Date.now() - downloadStartTime;
      const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));

      // Processing
      await updateProgress(animationSteps[3]); // Edit 4: Processing (70%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

      // Finalizing
      await updateProgress(animationSteps[4]); // Edit 5: Finalizing (90%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

      // Complete
      await updateProgress(animationSteps[5]); // Edit 6: Complete (100%)
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send the audio file
      await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
      await api.sendMessage({
        body: `🎧 ${firstResult.title}\nDuration: ${firstResult.duration}\nViews: ${parseInt(firstResult.views).toLocaleString()}\nPublished: ${firstResult.published}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, event.messageID);

      // Clean up files after messages are sent
      setTimeout(() => {
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          api.unsendMessage(processingMessage.messageID);
        } catch (cleanupError) {
          console.log("Cleanup error:", cleanupError);
        }
      }, 3000);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      await api.editMessage(
        `❌ Error: ${error.message}\n\nPlease try again later!`,
        processingMessage.messageID
      );
    }
  },
};
