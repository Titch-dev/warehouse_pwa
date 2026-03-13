const syncFacebook = require("./src/functions/syncFacebookEvents");
const autoBump = require("./src/functions/autoBumpMetadata");
const rollWeekly = require("./src/functions/rollWeeklyEvents");
const optimiseUploadedImage = require("./src/functions/optimiseUploadedImage");
const { setUserRole, suspendUser } = require("./src/functions/adminUsers");
const closePoolSessions = require("./src/functions/closeAllSessionsDaily");
const { extendMembership } = require("./src/functions/extendMembership");
const adminEvents = require("./src/functions/adminEvents");
const adminMenu = require("./src/functions/adminMenu");
const adminMenuMisc = require("./src/functions/adminMenuMisc");
const adminSpecials = require("./src/functions/adminSpecials");

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

exports.createMenuItem = adminMenu.createMenuItem;
exports.updateMenuItem = adminMenu.updateMenuItem;
exports.deleteMenuItem = adminMenu.deleteMenuItem;

exports.createMenuMisc = adminMenuMisc.createMenuMisc;
exports.updateMenuMisc = adminMenuMisc.updateMenuMisc;
exports.deleteMenuMisc = adminMenuMisc.deleteMenuMisc;

exports.createSpecial = adminSpecials.createSpecial;
exports.updateSpecial = adminSpecials.updateSpecial;
exports.deleteSpecial = adminSpecials.deleteSpecial;