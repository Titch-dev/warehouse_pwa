/**
 * Firebase Cloud Functions entry point
 */

const admin = require("firebase-admin");
admin.initializeApp();

// Import function modules
const syncFacebook = require("./syncFacebookEvents");
const autoBump = require("./autoBumpMetadata");


// Re-export functions so Firebase deploys them
exports.syncFacebookEvents = syncFacebook.syncFacebookEvents;
exports.syncFacebookEventsNow = syncFacebook.syncFacebookEventsNow;
exports.autoBumpMetadata = autoBump.autoBumpMetadata;
