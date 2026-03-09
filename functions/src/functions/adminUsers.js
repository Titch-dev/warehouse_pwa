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
    throw new HttpsError("permission-denied", "Suspended users cannot perform this action.");
  }

  if (role !== "owner") {
    throw new HttpsError("permission-denied", "Only owners can perform this action.");
  }
}

async function writeAuditLog({
  actorUid,
  actorRole,
  action,
  targetUid,
  before = null,
  after = null,
  metadata = {},
}) {
  await db.collection("auditLogs").add({
    actorUid,
    actorRole,
    action,
    targetUid,
    before,
    after,
    metadata,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

exports.setUserRole = onCall(async (request) => {
  requireOwner(request);

  const actorUid = request.auth.uid;
  const actorRole = request.auth.token?.role || null;

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
  const currentRole = currentClaims.role || userSnap.data()?.role || "customer";
  const suspended = currentClaims.suspended === true || userSnap.data()?.suspended === true;

  const before = {
    role: currentRole,
    suspended,
  };

  const newClaims = {
    ...currentClaims,
    role,
    suspended,
  };

  await auth.setCustomUserClaims(userId, newClaims);

  await userRef.update({
    role,
    claimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: actorUid,
  });

  const after = {
    role,
    suspended,
  };

  await writeAuditLog({
    actorUid,
    actorRole,
    action: "setUserRole",
    targetUid: userId,
    before,
    after,
  });

  return {
    ok: true,
    userId,
    role,
  };
});

exports.suspendUser = onCall(async (request) => {
  requireOwner(request);

  const actorUid = request.auth.uid;
  const actorRole = request.auth.token?.role || null;

  const { userId, suspended } = request.data || {};

  if (!userId || typeof userId !== "string") {
    throw new HttpsError("invalid-argument", "userId is required.");
  }

  if (typeof suspended !== "boolean") {
    throw new HttpsError("invalid-argument", "suspended must be true or false.");
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
  const currentSuspended =
    currentClaims.suspended === true || userSnap.data()?.suspended === true;

  const before = {
    role,
    suspended: currentSuspended,
  };

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
    updatedBy: actorUid,
  });

  const after = {
    role,
    suspended,
  };

  await writeAuditLog({
    actorUid,
    actorRole,
    action: "suspendUser",
    targetUid: userId,
    before,
    after,
  });

  return {
    ok: true,
    userId,
    suspended,
  };
});