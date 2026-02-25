const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("./firebaseAdmin");

const db = admin.firestore();

exports.rollWeeklyEvents = onSchedule(
  {
    schedule: "0 2 * * *", // 02:00 AM daily
    timeZone: "Africa/Johannesburg", // change if needed
  },
  async () => {
    const now = admin.firestore.Timestamp.now();
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    try {
      const snapshot = await db
        .collection("events")
        .where("type", "==", "weekly")
        .get();

      if (snapshot.empty) {
        console.log("No weekly events found.");
        return;
      }

      const batch = db.batch();

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (!data.start_time) return;

        let startMillis = data.start_time.toMillis();

        // Skip if still in the future
        if (startMillis > now.toMillis()) return;

        // Catch-up logic: keep adding weeks until future
        while (startMillis <= now.toMillis()) {
          startMillis += WEEK_MS;
        }

        const updatePayload = {
          start_time: admin.firestore.Timestamp.fromMillis(startMillis),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedBy: "system",
        };

        if (data.end_time) {
          let endMillis = data.end_time.toMillis();

          while (endMillis <= now.toMillis()) {
            endMillis += WEEK_MS;
          }

          updatePayload.end_time =
            admin.firestore.Timestamp.fromMillis(endMillis);
        }

        batch.update(doc.ref, updatePayload);
      });

      await batch.commit();

      console.log("Weekly events rolled successfully.");
    } catch (error) {
      console.error("Error rolling weekly events:", error);
    }
  }
);