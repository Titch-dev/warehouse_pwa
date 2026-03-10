const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { admin, db } = require("../config/firebaseAdmin");

const { FieldValue } = admin.firestore;

async function closeAllSessionsDailyCore() {
  logger.info("Starting closeAllSessionsDaily job");

  const snapshot = await db
    .collection("pool_sessions")
    .where("status", "==", "active")
    .get();

  if (snapshot.empty) {
    logger.info("No active pool sessions found to auto-close.");
    return;
  }

  // Firestore batch limit is 500 operations.
  // We only update the session docs here, so 450 is a safe chunk size.
  const docs = snapshot.docs;
  const chunkSize = 450;
  let totalClosed = 0;

  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const batch = db.batch();

    for (const docSnap of chunk) {
      batch.update(docSnap.ref, {
        status: "ended",
        endedAt: FieldValue.serverTimestamp(),
        endReason: "auto_close",
        updatedAt: FieldValue.serverTimestamp(),
      });

      totalClosed += 1;
    }

    await batch.commit();
  }

  logger.info("closeAllSessionsDaily completed successfully", {
    totalClosed,
    collection: "pool_sessions",
    closeReason: "auto_close",
  });
}

exports.closeAllSessionsDaily = onSchedule(
  {
    region: "us-central1",
    schedule: "0 2 * * *",
    timeZone: "Africa/Johannesburg",
  },
  async () => {
    await closeAllSessionsDailyCore();
  }
);

// Export core as well so you can reuse/test it later if needed
exports.closeAllSessionsDailyCore = closeAllSessionsDailyCore;