/**
 * Firebase Cloud Functions entry point
 */

const admin = require("firebase-admin");
admin.initializeApp();

// Import function modules
const syncFacebook = require("./syncFacebookEvents");

// Re-export functions so Firebase deploys them
exports.syncFacebookEvents = syncFacebook.syncFacebookEvents;
exports.syncFacebookEventsNow = syncFacebook.syncFacebookEventsNow;

// Other modules
const imageFunctions = require("./updateImageURLs");
exports.updateImageURLs = imageFunctions.updateImageURLs;