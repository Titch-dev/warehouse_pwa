const { storage } = require("../config/firebaseAdmin");

const bucket = storage.bucket();

async function deleteStorageFileIfExists(path) {
  if (!path) return;

  try {
    const file = bucket.file(path);
    const [exists] = await file.exists();

    if (!exists) {
      console.warn(`Storage file not found, skipping delete: ${path}`);
      return;
    }

    await file.delete();
    console.log(`Deleted storage file: ${path}`);
  } catch (error) {
    console.error(`Failed to delete storage file: ${path}`, error);
  }
}

module.exports = {
  deleteStorageFileIfExists,
};