const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("./firebaseAdmin");

const db = admin.firestore();

const COLLECTION_VERSION_MAP = {
  gallery: "gallery",
  menuFoodItems: "menuFood",
  menuDrinkItems: "menuDrink",
  specials: "specials",
  events: "events",
};

exports.autoBumpMetadata = onDocumentWritten(
  "{collectionId}/{docId}",
  async (event) => {
    const { collectionId } = event.params;

    if (!COLLECTION_VERSION_MAP[collectionId]) {
      return;
    }

    const versionField = COLLECTION_VERSION_MAP[collectionId];

    console.log(`Bumping metadata version for: ${versionField}`);

    await db.collection("metadata")
      .doc("collections")
      .set(
        {
          [versionField]: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
  }
);