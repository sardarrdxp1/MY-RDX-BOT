
"use strict";

const utils = require('../../../utils');

module.exports = function (defaultFuncs, api, ctx) {
  return function changeGroupImage(image, threadID, callback) {
    let resolveFunc = function () {};
    let rejectFunc = function () {};
    const returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, friendList) {
        if (err) return rejectFunc(err);
        resolveFunc(friendList);
      };
    }

    let form = {
      file: image,
      thread_id: threadID
    };

    defaultFuncs
      .postFormData(
        "https://www.facebook.com/messaging/set_group_photo/?dpr=1",
        ctx.jar,
        form,
        {}
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) {
          throw resData;
        }
        return callback();
      })
      .catch(function (err) {
        return callback(err);
      });

    return returnPromise;
  };
};
