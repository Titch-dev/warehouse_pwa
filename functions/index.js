const syncFacebook = require("./syncFacebookEvents");
const autoBump = require("./autoBumpMetadata");
const optimiseUploadedImage = require("./optimiseUploadedImage");

exports.syncFacebookEvents = syncFacebook.syncFacebookEvents;

exports.bumpGalleryMetadata = autoBump.bumpGalleryMetadata;
exports.bumpMenuMetadata = autoBump.bumpMenuMetadata;
exports.bumpSpecialsMetadata = autoBump.bumpSpecialsMetadata;
exports.bumpEventsMetadata = autoBump.bumpEventsMetadata;


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

exports.createGalleryItem = adminGallery.createGalleryItem;
exports.updateGalleryItem = adminGallery.updateGalleryItem;
exports.deleteGalleryItem = adminGallery.deleteGalleryItem;