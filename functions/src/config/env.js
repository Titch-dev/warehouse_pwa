const { defineSecret } = require("firebase-functions/params");

// Already set up by you:
const FB_PAGE_ACCESS_TOKEN = defineSecret("FB_PAGE_ACCESS_TOKEN");

module.exports = {
  FB_PAGE_ACCESS_TOKEN,
};