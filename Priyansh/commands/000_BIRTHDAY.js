module.exports = {
  config: {
    name: "bd",
    version: "1.0",
    author: "rdx zain",
    role: 0,
    category: "𝗪𝗜𝗦𝗛𝗘𝗦𝗛",
    guide: {
      vi: "Not Available",
      en: "cpx @(mention)"
    } 
  },

  onStart: async function ({ api, event, userData, args }) {
    var mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Please tag a friend to wish them a happy birthday.", event.threadID);
    let name = event.mentions[mention];
    var arraytag = []; 
    arraytag.push({ id: mention, tag: name });
    var a = function (a) { api.sendMessage(a, event.threadID); }
    
    setTimeout(() => {a({body: "🥳🎉🎂 Happy Birthday to You 🍰🎁🎈🧁🕯️" + " " + name, mentions: arraytag})}, 2000);
    setTimeout(() => {a({body: "🎁 جنم دن مبارک ہو! 🥳" + " " + name, mentions: arraytag})}, 5000);
    setTimeout(() => {a({body: "🎂 تم ہزاروں سال جیئو 🥳" + " " + name, mentions: arraytag})}, 10000);
    setTimeout(() => {a({body: "🎁 تمہارے لئے ڈھیر ساری خوشیاں! 💌" + " " + name, mentions: arraytag})}, 15000);
    setTimeout(() => {a({body: "🎉 میری دعا ہے کہ ہمیشہ خوش رہو! 🧁" + " " + name, mentions: arraytag})}, 20000);
    setTimeout(() => {a({body: "🎂 تمہارے لئے زندگی میں خوشحالی ہو! 🎁" + " " + name, mentions: arraytag})}, 25000);
    setTimeout(() => {a({body: "🕯️ جتنے بڑے ہو رہے ہو، اتنے ہی مزیدار بھی ہو رہے ہو 🎂" + " " + name, mentions: arraytag})}, 30000);
    setTimeout(() => {a({body: "🥳 خوشیوں سے بھرپور سالگرہ مبارک ہو! 🎁" + " " + name, mentions: arraytag})}, 35000);
    setTimeout(() => {a({body: "🎂 ہمیشہ کامیاب رہو! 🎉" + " " + name, mentions: arraytag})}, 40000);
    setTimeout(() => {a({body: "🎁 ہمیشہ مسکراتے رہو! 🧁" + " " + name, mentions: arraytag})}, 45000);
    setTimeout(() => {a({body: "🎈 یہ دن تمہارے لئے خاص ہے! 🍰" + " " + name, mentions: arraytag})}, 50000);
    setTimeout(() => {a({body: "🎂 اللہ کرے تم ہمیشہ خوش رہو! 🕯️" + " " + name, mentions: arraytag})}, 55000);
    setTimeout(() => {a({body: "🎉 دنیا میں ہمیشہ روشنی پھیلاؤ! 🎁" + " " + name, mentions: arraytag})}, 60000);
    setTimeout(() => {a({body: "🎈 جنم دن مبارک ہو! 🧁" + " " + name, mentions: arraytag})}, 65000);
    
    // مزید پیغامات کے لئے یہاں مزید setTimeout شامل کریں۔
    
  }
};
