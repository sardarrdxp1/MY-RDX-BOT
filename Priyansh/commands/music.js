const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Download YouTube song from keyword search",
  commandCategory: "media",
  usages: "[songName]",
  cooldowns: 10,
  dependencies: {
    "axios": ""
  }
};

module.exports.languages = {
  "en": {
    "missingInput": "Please provide a song name to search.",
    "searching": "🔍 Searching for your song...",
    "error": "Failed to download song: %1",
    "success": "🎧 Song: %1\n\nHere is your audio 🎧",
    "thumbnail": "🖤 Title: %1"
  }
};

const formatMessage = (message) => {
  return `╔═══════☆♡☆═══════╗\n${message}\n╚═══════☆♡☆═══════╝`;
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  
  const songName = args.join(" ");

  if (!songName) {
    return api.sendMessage(
      formatMessage(getText("missingInput")),
      threadID,
      messageID
    );
  }

  let processingMessage = await api.sendMessage(
    formatMessage(getText("searching")),
    threadID,
    null,
    messageID
  );

  try {
    const progressBarLength = 20;
    const animationSteps = [
      { message: "🔍 Searching...", progress: 10, delay: 1000 },
      { message: "🎵 Song found!", progress: 30, delay: 1000 },
      { message: "🎵 Downloading...", progress: 50, delay: 1500 },
      { message: "🎵 Processing...", progress: 70, delay: 1500 },
      { message: "🎵 Finalizing...", progress: 90, delay: 1000 },
      { message: "🎵 Complete! ✅", progress: 100, delay: 500 }
    ];

    const updateProgress = async (step) => {
      try {
        const filled = Math.round((step.progress / 100) * progressBarLength);
        const empty = progressBarLength - filled;
        const progressBar = "█".repeat(filled) + "░".repeat(empty);
        const message = formatMessage(`${step.message}\n\n${progressBar} ${step.progress}%`);
        await api.editMessage(message, processingMessage.messageID);
      } catch (err) {
        console.log("Progress update error:", err.message);
      }
    };

    api.setMessageReaction("⌛", messageID, () => {}, true);
    await updateProgress(animationSteps[0]);
    
    const searchResponse = await axios.get(
      `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(songName)}`
    );
    
    if (!searchResponse.data.status || !searchResponse.data.result.length) {
      throw new Error("No results found for your search query.");
    }

    const topResult = searchResponse.data.result[0];
    const videoId = topResult.id;
    let title = topResult.title;
    let thumbnail = topResult.thumbnail;
    await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

    await updateProgress(animationSteps[1]);
    await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

    const youtubeUrl = `https://youtu.be/${videoId}`;
    const apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(youtubeUrl)}`;

    await updateProgress(animationSteps[2]);
    const downloadStartTime = Date.now();
    const downloadResponse = await axios.get(apiUrl);
    
    if (!downloadResponse.data.status || !downloadResponse.data.result || !downloadResponse.data.result.data) {
      throw new Error("Failed to fetch download link.");
    }

    const downloadUrl = downloadResponse.data.result.data.downloadUrl;
    const songTitle = downloadResponse.data.result.data.title || "song";
    title = songTitle;
    thumbnail = downloadResponse.data.result.data.thumbnail || thumbnail;
    const filename = `${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.mp3`;

    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    if (!response.data) {
      throw new Error(`Failed to fetch song.`);
    }

    const downloadTime = Date.now() - downloadStartTime;
    const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
    await new Promise(resolve => setTimeout(resolve, remainingDelay));

    await updateProgress(animationSteps[3]);
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    const downloadPath = path.join(cachePath, filename);
    const songBuffer = Buffer.from(response.data);
    fs.writeFileSync(downloadPath, songBuffer);
    await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

    await updateProgress(animationSteps[4]);
    await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

    await updateProgress(animationSteps[5]);
    api.setMessageReaction("✅", messageID, () => {}, true);

    await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
    
    const sendResult = await api.sendMessage(
      {
        attachment: fs.createReadStream(downloadPath),
        body: formatMessage(getText("success", title))
      },
      threadID,
      messageID
    );
    
    console.log("Music sent successfully:", sendResult);
    
    let thumbPath = null;
    if (thumbnail) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const thumbResponse = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        thumbPath = path.join(cachePath, `thumb_${Date.now()}.jpg`);
        fs.writeFileSync(thumbPath, Buffer.from(thumbResponse.data));
        
        await api.sendMessage(
          {
            attachment: fs.createReadStream(thumbPath),
            body: formatMessage(getText("thumbnail", title))
          },
          threadID
        );
      } catch (thumbError) {
        console.log("Thumbnail download failed:", thumbError.message);
      }
    }
    
    setTimeout(() => {
      try {
        if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
        if (thumbPath && fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
        api.unsendMessage(processingMessage.messageID);
      } catch (cleanupError) {
        console.log("Cleanup error:", cleanupError.message);
      }
    }, 5000);
  } catch (error) {
    console.error(`Failed to download song: ${error.message}`);
    api.setMessageReaction("❌", messageID, () => {}, true);
    try {
      await api.editMessage(
        formatMessage(getText("error", error.message)),
        processingMessage.messageID
      );
    } catch (editErr) {
      await api.sendMessage(
        formatMessage(getText("error", error.message)),
        threadID,
        messageID
      );
    }
  }
};
