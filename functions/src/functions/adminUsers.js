const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { admin, db, auth } = require("../config/firebaseAdmin");

const ALLOWED_ROLES = ["customer", "staff", "admin", "owner"];

function requireAuth(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
}

function requireOwner(request) {
  requireAuth(request);

  const role = request.auth.token?.role || null;
  const suspended = request.auth.token?.suspended === true;

  if (suspended) {
    throw new HttpsError(
      "permission-denied",
      "Suspended users cannot perform this action."
    );
  }

  if (role !== "owner") {
    throw new HttpsError(
      "permission-denied",
      "Only owners can perform this action."
    );
  }
}

function actorLabel(request) {
  return request.auth?.token?.email || request.auth?.uid || "system";
}

exports.setUserRole = onCall({ region: "us-central1" }, async (request) => {
  requireOwner(request);

  const actorUid = request.auth.uid;
  const actorRole = request.auth.token?.role || null;
  const actorIdentifier = actorLabel(request);

  const { userId, role } = request.data || {};

  if (!userId || typeof userId !== "string") {
    throw new HttpsError("invalid-argument", "userId is required.");
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw new HttpsError(
      "invalid-argument",
      `role must be one of: ${ALLOWED_ROLES.join(", ")}`
    );
  }

  if (userId === actorUid && role !== "owner") {
    throw new HttpsError(
      "failed-precondition",
      "Owners cannot demote themselves."
    );
  }

  const userRef = db.collection("users").doc(userId);

  const [userSnap, userRecord] = await Promise.all([
    userRef.get(),
    auth.getUser(userId),
  ]);

  if (!userSnap.exists) {
    throw new HttpsError("not-found", "User document not found.");
  }

  const currentClaims = userRecord.customClaims || {};
  const suspended =
    currentClaims.suspended === true || userSnap.data()?.suspended === true;

  const newClaims = {
    ...currentClaims,
    role,
    suspended,
  };

  await auth.setCustomUserClaims(userId, newClaims);

  await userRef.update({
    role,
    claimsRole: role,
    claimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: actorIdentifier,
  });

  return {
    ok: true,
    userId,
    role,
    updatedBy: actorIdentifier,
  };
});

exports.suspendUser = onCall({ region: "us-central1" }, async (request) => {
  requireOwner(request);

  const actorUid = request.auth.uid;
  const actorIdentifier = actorLabel(request);

  const { userId, suspended } = request.data || {};

  if (!userId || typeof userId !== "string") {
    throw new HttpsError("invalid-argument", "userId is required.");
  }

  if (typeof suspended !== "boolean") {
    throw new HttpsError(
      "invalid-argument",
      "suspended must be true or false."
    );
  }

  if (userId === actorUid && suspended) {
    throw new HttpsError(
      "failed-precondition",
      "Owners cannot suspend themselves."
    );
  }

  const userRef = db.collection("users").doc(userId);

  const [userSnap, userRecord] = await Promise.all([
    userRef.get(),
    auth.getUser(userId),
  ]);

  if (!userSnap.exists) {
    throw new HttpsError("not-found", "User document not found.");
  }

  const currentClaims = userRecord.customClaims || {};
  const role = currentClaims.role || userSnap.data()?.role || "customer";

  const newClaims = {
    ...currentClaims,
    role,
    suspended,
  };

  await auth.setCustomUserClaims(userId, newClaims);

  await userRef.update({
    suspended,
    claimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: actorIdentifier,
  });

  return {
    ok: true,
    userId,
    suspended,
    updatedBy: actorIdentifier,
  };
});