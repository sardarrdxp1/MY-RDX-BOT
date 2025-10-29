const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
  name: "rdxhere",           // <-- changed from "hackgc"
  version: "1.0.1",
  hasPermssion: 2,
  credits: "SARDAR RDX",
  description: "Flood group with messages and add users, then rename group",
  commandCategory: "Admin",
  usages: "rdxhere",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  
  // Check if user is bot admin
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage(formatMessage("❌ Only bot admins can use this command!"), threadID, messageID);
  }

  const messages = [
    "𝐍𝐨𝐰 𝐥𝐨𝐚𝐝𝐢𝐧𝐠...",
    "⋘ 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎...⋙",
    "[■■■■■■■■■■] 100%",
    "𝗔𝗝𝗨𝗢 𝗗𝗢𝗦𝗧𝗢 𝗬𝗔 𝗚𝗥𝗢𝗨𝗣 𝗕𝗛𝗜 𝗛𝗜𝗚𝗛𝗝𝗔𝗖𝗞 𝗛𝗢 𝗚𝗬𝗔"
  ];

  const usersToAdd = [
    "61582862311675",
    "61582915079134",
    "61582448566237",
    "61583038793097",
    "61582740037285",
    "61583077011427",
    "61582528696444",
    "61582664773755",
    "61582596827519",
    "61578127172132",
    "61582857304912",
    "61583082354079"
  ];

  // Desired new group name (the exact string you requested)
  const newGroupName = "🩷𓆩𝐊𝐎𝐈 𝐏𝐎𝐂𝐇𝐘 𝐓𝐎 𝐊𝐇𝐍𝐀 𝐒𝐀𝐑𝐃𝐀𝐑 𝐑𝐃𝐗 𝐀𝐘𝐀 𝐓𝐇𝐀 🖤𓆪𓆤";

  // Helper: try multiple common API rename methods & common argument orders
  async function tryRename(threadID, name) {
    const candidates = [
      { fn: api.changeGroupName, argsOrders: [["name", "threadID"], ["threadID", "name"]] },
      { fn: api.changeThreadName, argsOrders: [["name", "threadID"], ["threadID", "name"]] },
      { fn: api.setTitle, argsOrders: [["threadID", "name"], ["name", "threadID"]] },
      { fn: api.setThreadName, argsOrders: [["threadID", "name"], ["name", "threadID"]] },
      { fn: api.changeTitle, argsOrders: [["threadID", "name"], ["name", "threadID"]] },
      // add other possible method holders if you know them
    ];

    for (const candidate of candidates) {
      if (typeof candidate.fn !== "function") continue;
      for (const order of candidate.argsOrders) {
        try {
          const args = order.map(key => (key === "threadID" ? threadID : name));
          // Some APIs accept a callback instead of returning a promise; handle both
          const result = candidate.fn.length > args.length
            ? await new Promise((resolve, reject) => {
                // call with callback as last arg
                try {
                  candidate.fn(...args, (err, res) => err ? reject(err) : resolve(res));
                } catch (e) {
                  reject(e);
                }
              })
            : await candidate.fn(...args);
          // if no exception — assume success
          return { success: true, method: candidate.fn.name || "unknown", result };
        } catch (err) {
          // ignore and try next signature
        }
      }
    }

    throw new Error("No supported group-rename method found on api");
  }

  try {
    // Send initial confirmation
    await api.sendMessage(formatMessage("🚀𝑹𝑫𝑿 𝑯𝑰𝑮𝑯𝑱𝑨𝑪𝑲 𝑮𝑪 𝑳𝑶𝑨𝑫𝑰𝑵𝑮 ........"), threadID);

    // Send messages one by one with 2 second delay
    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await api.sendMessage(messages[i], threadID);
    }

    // Add users one by one with 2 second delay
    let addedCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < usersToAdd.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        await api.addUserToGroup(usersToAdd[i], threadID);
        addedCount++;
        await api.sendMessage(`✅ Added user ${i + 1}/${usersToAdd.length}`, threadID);
      } catch (error) {
        failedCount++;
        console.log(`Failed to add user ${usersToAdd[i]}:`, error && error.message ? error.message : error);
      }
    }

    // Try renaming the group now
    let renameInfo = { success: false, message: "Rename not attempted" };
    try {
      const res = await tryRename(threadID, newGroupName);
      renameInfo = { success: true, message: `Group renamed using ${res.method}` };
      await api.sendMessage(formatMessage(`✅ Group renamed to:\n${newGroupName}`), threadID);
    } catch (renameError) {
      renameInfo = { success: false, message: `Could not rename group: ${renameError.message}` };
      await api.sendMessage(formatMessage(`⚠️ Unable to rename group automatically.\nYou may need to use a specific API method supported by your bot framework.`), threadID);
    }

    // Send completion message
    await api.sendMessage(
      formatMessage(`✅ Hack sequence completed!\n\n📊 Results:\n✅ Added: ${addedCount}\n❌ Failed: ${failedCount}\n\n🔁 Rename: ${renameInfo.message}`),
      threadID
    );

  } catch (error) {
    console.error("rdxhere error:", error);
    return api.sendMessage(
      formatMessage(`❌ Error during hack sequence: ${error.message}`),
      threadID,
      messageID
    );
  }
};
