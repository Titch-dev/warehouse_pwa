const admin = require("firebase-admin");

const USE_EMULATORS = process.env.USE_FIREBASE_EMULATORS === "true";

if (USE_EMULATORS) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST =
    process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
  process.env.FIRESTORE_EMULATOR_HOST =
    process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  process.env.GCLOUD_PROJECT =
    process.env.GCLOUD_PROJECT || "warehouse-37025";
}

if (!admin.apps.length) {
  if (USE_EMULATORS) {
    admin.initializeApp({
      projectId: process.env.GCLOUD_PROJECT || "warehouse-37025",
    });
  } else {
    const path = require("path");
    const serviceAccount = require(path.resolve(
      __dirname,
      "../firebase-service-account.json"
    ));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function main() {
  const [, , email, role] = process.argv;

  if (!email || !role) {
    console.error("Usage: node scripts/setUserRole.js <email> <role>");
    process.exit(1);
  }

  const allowedRoles = ["owner", "admin", "staff", "customer"];

  if (!allowedRoles.includes(role)) {
    console.error(
      `Invalid role "${role}". Allowed roles: ${allowedRoles.join(", ")}`
    );
    process.exit(1);
  }

  try {
    const user = await auth.getUserByEmail(email);
    const existingClaims = user.customClaims || {};

    await auth.setCustomUserClaims(user.uid, {
      ...existingClaims,
      role,
    });

    await db.collection("users").doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email || email,
        role,
        claimsRole: role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection("auditLogs").add({
      type: "set_user_role",
      targetUid: user.uid,
      targetEmail: user.email || email,
      assignedRole: role,
      performedBy: USE_EMULATORS ? "local-emulator-script" : "local-admin-script",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Success`);
    console.log(`Mode: ${USE_EMULATORS ? "EMULATOR" : "PRODUCTION"}`);
    console.log(`User: ${user.email}`);
    console.log(`UID: ${user.uid}`);
    console.log(`Role set to: ${role}`);
    console.log(`They must sign out and sign back in to receive the new claim.`);
  } catch (error) {
    console.error("❌ Failed to set role");
    console.error(error.message);
    process.exit(1);
  }
}

main();