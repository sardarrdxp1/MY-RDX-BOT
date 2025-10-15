"use strict";

const utils = require("../../../utils");

module.exports = (defaultFuncs, api, ctx) => {
  return async (callback) => {
    let resolveFunc = () => {};
    let rejectFunc = () => {};
    const returnPromise = new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;
    });
    
    if (!callback) {
      callback = (err, data) => {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc(data);
      };
    }

    try {
      const url = `https://www.facebook.com/profile.php?id=${ctx.userID}`;
      const response = await defaultFuncs.get(url, ctx.jar, null, ctx.globalOptions);
      
      if (!response || !response.body) {
        return callback(null, { error: "Failed to fetch profile data" });
      }

      const profileMatch = response.body.match(/"CurrentUserInitialData",\[\],\{(.*?)\},(.*?)\]/);
      
      if (profileMatch && profileMatch[1]) {
        const accountJson = JSON.parse(`{${profileMatch[1]}}`);
        const result = {
          name: accountJson.NAME,
          uid: accountJson.USER_ID,
          thumbSrc: accountJson.PROFILE_PICTURE_URI || `https://graph.facebook.com/${accountJson.USER_ID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        };
        return callback(null, result);
      } else {
        return callback(null, { 
          error: "Could not parse profile data",
          name: "Facebook User",
          uid: ctx.userID,
          thumbSrc: `https://graph.facebook.com/${ctx.userID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        });
      }
    } catch (err) {
      return callback(null, { 
        error: err.message,
        name: "Facebook User",
        uid: ctx.userID,
        thumbSrc: `https://graph.facebook.com/${ctx.userID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      });
    }

    return returnPromise;
  };
};
