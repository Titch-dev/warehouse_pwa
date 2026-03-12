const syncFacebook = require("./src/functions/syncFacebookEvents");
const autoBump = require("./src/functions/autoBumpMetadata");
const rollWeekly = require("./src/functions/rollWeeklyEvents");
const optimiseUploadedImage = require("./src/functions/optimiseUploadedImage");
const { setUserRole, suspendUser } = require("./src/functions/adminUsers");
const closePoolSessions = require("./src/functions/closeAllSessionsDaily");
const { extendMembership } = require("./src/functions/extendMembership");
const adminEvents = require("./src/functions/adminEvents");

exports.syncFacebookEvents = syncFacebook.syncFacebookEvents;

exports.bumpGalleryMetadata = autoBump.bumpGalleryMetadata;
exports.bumpMenuMetadata = autoBump.bumpMenuMetadata;
exports.bumpSpecialsMetadata = autoBump.bumpSpecialsMetadata;
exports.bumpEventsMetadata = autoBump.bumpEventsMetadata;

exports.rollWeeklyEvents = rollWeekly.rollWeeklyEvents;

exports.optimiseUploadedImage = optimiseUploadedImage.optimiseUploadedImage;

exports.setUserRole = setUserRole;
exports.suspendUser = suspendUser;

exports.closeAllSessionsDaily = closePoolSessions.closeAllSessionsDaily;

exports.extendMembership = extendMembership;

exports.createEvent = adminEvents.createEvent;
exports.updateEvent = adminEvents.updateEvent;
exports.deleteEvent = adminEvents.deleteEvent;
exports.syncFacebookEventsNow = adminEvents.syncFacebookEventsNow;