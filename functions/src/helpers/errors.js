const { HttpsError } = require("firebase-functions/v2/https");

function unauthenticated(message = "Authentication required.") {
  return new HttpsError("unauthenticated", message);
}

function permissionDenied(message = "You do not have permission to perform this action.") {
  return new HttpsError("permission-denied", message);
}

function invalidArgument(message = "Invalid request data.") {
  return new HttpsError("invalid-argument", message);
}

module.exports = {
  unauthenticated,
  permissionDenied,
  invalidArgument,
};