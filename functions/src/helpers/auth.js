const { HttpsError } = require("firebase-functions/v2/https");
const { db } = require("../config/firebaseAdmin");

async function requireAuth(request) {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }

  return { uid };
}

async function getUserDoc(uid) {
  const userSnap = await db.collection("users").doc(uid).get();

  if (!userSnap.exists) {
    throw new HttpsError("permission-denied", "User profile not found.");
  }

  return userSnap.data();
}

async function requireRole(request, allowedRoles = []) {
  const { uid } = await requireAuth(request);
  const userData = await getUserDoc(uid);
  const role = userData?.role || null;

  if (!role || !allowedRoles.includes(role)) {
    throw new HttpsError(
      "permission-denied",
      "You do not have permission to perform this action."
    );
  }

  return {
    uid,
    role,
    userData,
  };
}

module.exports = {
  requireAuth,
  getUserDoc,
  requireRole,
};