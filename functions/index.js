const syncFacebook = require("./src/functions/syncFacebookEvents");
const autoBump = require("./src/functions/autoBumpMetadata");
const rollWeekly = require("./src/functions/rollWeeklyEvents");
const optimiseUploadedImage = require("./src/functions/optimiseUploadedImage");
const { setUserRole, suspendUser } = require("./src/functions/adminUsers");

exports.syncFacebookEvents = syncFacebook.syncFacebookEvents;
exports.syncFacebookEventsNow = syncFacebook.syncFacebookEventsNow;

exports.autoBumpMetadata = autoBump.autoBumpMetadata;

exports.rollWeeklyEvents = rollWeekly.rollWeeklyEvents;

exports.optimiseUploadedImage = optimiseUploadedImage.optimiseUploadedImage;

exports.setUserRole = setUserRole;
exports.suspendUser = suspendUser;