const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { db, admin } = require("../config/firebaseAdmin");

const COLLECTION_VERSION_MAP = {
  gallery: "gallery",
  menu: "menu",
  specials: "specials",
  events: "events",
  users: "users",
};

exports.autoBumpMetadata = onDocumentWritten(
  {
    region: "us-central1",
    document: "{collectionId}/{docId}",
  },
  async (event) => {
    const { collectionId } = event.params;

    if (!COLLECTION_VERSION_MAP[collectionId]) {
      return;
    }

    const versionField = COLLECTION_VERSION_MAP[collectionId];

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