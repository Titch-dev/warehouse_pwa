const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { region } = require("firebase-functions/v2");

// testing the fb connection
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");


// Whitelist collections to listen to
const IMAGE_COLLECTIONS = ["menuDrinkItems", "specialsDrinkItems", "specialsFoodItems"];

/**
 * Generate a public URL for a given storage path
 * Only works if your storage rules allow public read
 */
function generatePublicURL(path) {
  const bucketName = "warehouse-37025.firebasestorage.app";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  // URL-encode path (replace / with %2F)
  const encodedPath = encodeURIComponent(cleanPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

/**
 * Cloud Function: Auto-update imageURL when a document with imagePath is created or updated
 */
exports.updateImageURLs = onDocumentWritten(
  { 
    document: "{collectionId}/{docId}",
    region: "africa-south1",
  },
  async (event) => {
    const { collectionId, docId } = event.params;

    // Only run for the whitelisted collections
    if (!IMAGE_COLLECTIONS.includes(collectionId)) return;

    const afterSnap = event.data?.after;
    const afterData = afterSnap?.data();
    if (!afterData) return; // doc deleted or empty

    const path = afterData.imagePath;
    if (!path) return; // no imagePath, skip

    const currentURL = afterData.imageURL;

    // Prevent infinite update loops if the URL is already correct
    if (currentURL && currentURL.includes(path)) return;

    const newURL = generatePublicURL(path);
    // if (!newURL) return;

    await afterSnap.ref.update({ imageURL: newURL });
    console.log(`Updated imageURL for ${collectionId}/${docId}`);
  }
);