const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { db, admin } = require("../config/firebaseAdmin");

function createMetadataBumpTrigger(documentPath, versionField) {
  return onDocumentWritten(
    {
      region: "us-central1",
      document: documentPath,
    },
    async () => {
      console.log(`Bumping metadata version for: ${versionField}`);

      await db
        .collection("metadata")
        .doc("collections")
        .set(
          {
            [versionField]: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    }
  );
}

exports.bumpGalleryMetadata = createMetadataBumpTrigger(
  "gallery/{docId}",
  "gallery"
);

exports.bumpMenuMetadata = createMetadataBumpTrigger(
  "menu/{docId}",
  "menu"
);

exports.bumpSpecialsMetadata = createMetadataBumpTrigger(
  "specials/{docId}",
  "specials"
);

exports.bumpEventsMetadata = createMetadataBumpTrigger(
  "events/{docId}",
  "events"
);