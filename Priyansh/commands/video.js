
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mian Amir",
  description: "Download YouTube video from keyword search",
  commandCategory: "media",
  usages: "[videoName]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

// Unicode Bold Converter
const boldUnicode = (text) => {
  const boldMap = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  
  return text.split('').map(char => boldMap[char] || char).join('');
};

// Format message with decorative borders
const formatMessage = (message) => {
  const lines = message.split('\n');
  const boldLines = lines.map(line => boldUnicode(line));
  
  return `╔═══════☆♡☆═══════╗\n${boldLines.join('\n')}\n╚═══════☆♡☆═══════╝`;
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  const videoName = args.join(" ");
  if (!videoName) {
    return api.sendMessage(
      formatMessage("Please provide a video name to search."),
      threadID,
      messageID
    );
  }

  let processingMessage = await api.sendMessage(
    formatMessage("🔍 Searching for your video..."),
    threadID,
    null,
    messageID
  );

  try {
    const progressBarLength = 20;
    const animationSteps = [
      { message: "🔍 Searching...", progress: 10, delay: 1000 },
      { message: "🎬 Video found!", progress: 30, delay: 1000 },
      { message: "🎬 Downloading...", progress: 50, delay: 1500 },
      { message: "🎬 Processing...", progress: 70, delay: 1500 },
      { message: "🎬 Finalizing...", progress: 90, delay: 1000 },
      { message: "🎬 Complete! ✅", progress: 100, delay: 500 }
    ];

    const updateProgress = async (step) => {
      const filled = Math.round((step.progress / 100) * progressBarLength);
      const empty = progressBarLength - filled;
      const progressBar = "█".repeat(filled) + "░".repeat(empty);
      const message = formatMessage(`${step.message}\n\n${progressBar} ${step.progress}%`);
      await api.editMessage(message, processingMessage.messageID);
    };

    api.setMessageReaction("⌛", messageID, () => {}, true);
    await updateProgress(animationSteps[0]);
    
    const searchResponse = await axios.get(
      `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(videoName)}`
    );
    
    if (!searchResponse.data.status || !searchResponse.data.result.length) {
      throw new Error("No results found for your search query.");
    }

    const topResult = searchResponse.data.result[0];
    const videoId = topResult.id;
    const videoTitle = topResult.title;
    await new Promise(resolve => setTimeout(resolve, animationSteps[0].delay));

    await updateProgress(animationSteps[1]);
    await new Promise(resolve => setTimeout(resolve, animationSteps[1].delay));

    const apiUrl = `https://apis-keith.vercel.app/download/video?url=https://youtu.be/${videoId}`;

    await updateProgress(animationSteps[2]);
    const downloadStartTime = Date.now();
    const downloadResponse = await axios.get(apiUrl, { timeout: 30000 });
    
    if (!downloadResponse.data.status || !downloadResponse.data.result) {
      throw new Error("Failed to fetch download link.");
    }

    const downloadUrl = downloadResponse.data.result;
    const response = await axios.get(downloadUrl, { 
      responseType: 'arraybuffer',
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    if (!response.data) {
      throw new Error(`Failed to fetch video.`);
    }

    const downloadTime = Date.now() - downloadStartTime;
    const remainingDelay = Math.max(0, animationSteps[2].delay - downloadTime);
    await new Promise(resolve => setTimeout(resolve, remainingDelay));

    await updateProgress(animationSteps[3]);
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    const filename = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.mp4`;
    const downloadPath = path.join(cachePath, filename);
    const videoBuffer = Buffer.from(response.data);
    fs.writeFileSync(downloadPath, videoBuffer);
    await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

    await updateProgress(animationSteps[4]);
    await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

    await updateProgress(animationSteps[5]);
    api.setMessageReaction("✅", messageID, () => {}, true);

    await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
    await api.sendMessage(
      {
        attachment: fs.createReadStream(downloadPath),
        body: formatMessage(`🎬 Title: ${videoTitle}\n\nHere is your video 🎬`)
      },
      threadID,
      messageID
    );
    
    setTimeout(() => {
      try {
        if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
        api.unsendMessage(processingMessage.messageID);
      } catch (cleanupError) {
        console.log("Cleanup error:", cleanupError);
      }
    }, 3000);
  } catch (error) {
    console.error(`Failed to download video: ${error.message}`);
    api.setMessageReaction("❌", messageID, () => {}, true);
    await api.editMessage(
      formatMessage(`Failed to download video: ${error.message}`),
      processingMessage.messageID
    );
  }
};
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Download YouTube video from keyword search",
  commandCategory: "media",
  usages: "[videoName]",
  cooldowns: 10,
  dependencies: {
    "axios": ""
  }
};

const formatMessage = (message) => {
  return `╔═══════☆♡☆═══════╗\n${message}\n╚═══════☆♡☆═══════╝`;
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  const videoName = args.join(" ");

  if (!videoName) {
    return api.sendMessage(
      formatMessage("Please provide a video name to search."),
      threadID,
      messageID
    );
  }

  let processingMessage = await api.sendMessage(
    formatMessage("🔍 Searching for your video..."),
    threadID,
    null,
    messageID
  );

  try {
    const progressBarLength = 20;
    const animationSteps = [
      { message: "🔍 Searching...", progress: 10, delay: 1000 },
      { message: "🎬 Video found!", progress: 30, delay: 1000 },
      { message: "🎬 Downloading...", progress: 50, delay: 1500 },
      { message: "🎬 Processing...", progress: 70, delay: 1500 },
      { message: "🎬 Finalizing...", progress: 90, delay: 1000 },
      { message: "🎬 Complete! ✅", progress: 100, delay: 500 }
    ];

    const updateProgress = async (step) => {
      const filled = Math.round((step.progress / 100) * progressBarLength);
      const empty = progressBarLength - filled;
      const progressBar = "█".repeat(filled) + "░".repeat(empty);
      const message = formatMessage(`${step.message}\n\n${progressBar} ${step.progress}%`);
      await api.editMessage(message, processingMessage.messageID);
    };

    api.setMessageReaction("⌛", messageID, () => {}, true);
    await updateProgress(animationSteps[0]);
    
    const searchResponse = await axios.get(
      `https://apis-keith.vercel.app/search/yts?query=${encodeURIComponent(videoName)}`
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
    const apiUrl = `https://apis-keith.vercel.app/download/dlmp4?url=${encodeURIComponent(youtubeUrl)}`;

    await updateProgress(animationSteps[2]);
    const downloadStartTime = Date.now();
    const downloadResponse = await axios.get(apiUrl);
    
    if (!downloadResponse.data.status || !downloadResponse.data.result || !downloadResponse.data.result.data) {
      throw new Error("Failed to fetch download link.");
    }

    const downloadUrl = downloadResponse.data.result.data.downloadUrl;
    const videoTitle = downloadResponse.data.result.data.title || "video";
    title = videoTitle;
    thumbnail = downloadResponse.data.result.data.thumbnail || thumbnail;
    const filename = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.mp4`;

    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    if (!response.data) {
      throw new Error(`Failed to fetch video.`);
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
    const videoBuffer = Buffer.from(response.data);
    fs.writeFileSync(downloadPath, videoBuffer);
    await new Promise(resolve => setTimeout(resolve, animationSteps[3].delay));

    await updateProgress(animationSteps[4]);
    await new Promise(resolve => setTimeout(resolve, animationSteps[4].delay));

    await updateProgress(animationSteps[5]);
    api.setMessageReaction("✅", messageID, () => {}, true);

    await new Promise(resolve => setTimeout(resolve, animationSteps[5].delay));
    await api.sendMessage(
      {
        attachment: fs.createReadStream(downloadPath),
        body: formatMessage(`🎬 Video: ${title}\n\nHere is your video 🎬`)
      },
      threadID,
      messageID
    );
    
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
            body: formatMessage(`🖤 Title: ${title}`)
          },
          threadID
        );
      } catch (thumbError) {
        console.log("Thumbnail download failed:", thumbError);
      }
    }
    
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
    console.error(`Failed to download video: ${error.message}`);
    api.setMessageReaction("❌", messageID, () => {}, true);
    await api.editMessage(
      formatMessage(`Failed to download video: ${error.message}`),
      processingMessage.messageID
    );
  }
};
