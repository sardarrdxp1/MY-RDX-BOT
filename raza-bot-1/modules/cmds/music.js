const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "music",
    version: "1.0.3",
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
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found for your search query.");
      }

      // Get the top result
      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;
      await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

      // Song found
      await updateProgress(animationSteps[1]); // Edit 2: Song found (30%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

      // Construct API URL for downloading
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyanshu-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      // Downloading
      await updateProgress(animationSteps[2]); // Edit 3: Downloading (50%)
      const downloadStartTime = Date.now();
      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://cnvmp3.com/',
        'Cookie': '_ga=GA1.1.1062081074.1735238555; _ga_MF283RRQCW=GS1.1.1735238554.1.1.1735239728.0.0.0',
      };

      const response = await fetch(downloadUrl, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch song. Status code: ${response.status}`);
      }

      // Adjust delay to match download time
      const downloadTime = Date.now() - downloadStartTime;
      const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));

      // Processing
      await updateProgress(animationSteps[3]); // Edit 4: Processing (70%)
      const filename = `${topResult.title}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadPath = path.join(__dirname, filename);
      const songBuffer = await response.buffer();
      fs.writeFileSync(downloadPath, songBuffer);
      await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

      // Finalizing
      await updateProgress(animationSteps[4]); // Edit 5: Finalizing (90%)
      await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

      // Complete
      await updateProgress(animationSteps[5]); // Edit 6: Complete (100%)
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send the file
      await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🖤 Title: ${topResult.title}\n\n🎧 Song: ${topResult.title}\n\nHere is your ${type === "audio" ? "audio" : "video"} 🎧:`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
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