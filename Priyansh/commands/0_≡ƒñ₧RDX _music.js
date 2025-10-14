
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "music",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "Mian Amir",
    description: "Download YouTube song from keyword search and link",
    category: "media",
    prefix: true,
    premium: false,
    usages: "[songName] [type]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
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
      const searchResponse = await axios.get(`https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(songName)}`);
      if (!searchResponse.data.status || !searchResponse.data.result.length) {
        throw new Error("No results found for your search query.");
      }

      // Get the top result
      const topResult = searchResponse.data.result[0];
      const videoId = topResult.id;
      let title = topResult.title;
      let thumbnail = topResult.thumbnail;
      await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

      // Song found
      await updateProgress(animationSteps[1]); // Edit 2: Song found (30%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

      // Construct API URL for downloading
      const youtubeUrl = `https://youtu.be/${videoId}`;
      const apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(youtubeUrl)}`;

      // Downloading
      await updateProgress(animationSteps[2]); // Edit 3: Downloading (50%)
      const downloadStartTime = Date.now();
      const downloadResponse = await axios.get(apiUrl);
      
      // Extract download URL from API response
      if (!downloadResponse.data.status || !downloadResponse.data.result || !downloadResponse.data.result.data) {
        console.log("API Response:", JSON.stringify(downloadResponse.data));
        throw new Error("Failed to fetch download link.");
      }

      const downloadUrl = downloadResponse.data.result.data.downloadUrl;
      const songTitle = downloadResponse.data.result.data.title || "song";
      title = songTitle; // Update title from API
      thumbnail = downloadResponse.data.result.data.thumbnail || thumbnail; // Update thumbnail from API
      const filename = `${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.mp3`;

      const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      if (!response.data) {
        throw new Error(`Failed to fetch song.`);
      }

      // Adjust delay to match download time
      const downloadTime = Date.now() - downloadStartTime;
      const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));

      // Processing
      await updateProgress(animationSteps[3]); // Edit 4: Processing (70%)
      const downloadPath = path.join(__dirname, filename);
      const songBuffer = Buffer.from(response.data);
      fs.writeFileSync(downloadPath, songBuffer);
      await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

      // Finalizing
      await updateProgress(animationSteps[4]); // Edit 5: Finalizing (90%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

      // Complete
      await updateProgress(animationSteps[5]); // Edit 6: Complete (100%)
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send the audio file first
      await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🎧 Song: ${title}\n\nHere is your ${type === "audio" ? "audio" : "video"} 🎧:`
        },
        event.threadID,
        event.messageID
      );
      
      // Wait 2 seconds, then send thumbnail separately
      let thumbPath = null;
      if (thumbnail) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const thumbResponse = await axios.get(thumbnail, { responseType: 'arraybuffer' });
          thumbPath = path.join(__dirname, `thumb_${Date.now()}.jpg`);
          fs.writeFileSync(thumbPath, Buffer.from(thumbResponse.data));
          
          await api.sendMessage(
            {
              attachment: fs.createReadStream(thumbPath),
              body: `🖤 Title: ${title}`
            },
            event.threadID
          );
        } catch (thumbError) {
          console.log("Thumbnail download failed:", thumbError);
        }
      }
      
      // Clean up files after messages are sent
      setTimeout(() => {
        try {
          if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
          if (thumbPath && fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
          api.unsendMessage(processingMessage.messageID);
        } catch (cleanupError) {
          console.log("Cleanup error:", cleanupError);
        }
      }, 3000);
    } catch (error) {
      console.error(`Failed to download and send song: ${error.message}`);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      await api.editMessage(
        `Failed to download song: ${error.message}`,
        processingMessage.messageID
      );
    }
  },
};
