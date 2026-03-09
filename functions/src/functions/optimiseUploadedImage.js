const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { admin } = require("../config/firebaseAdmin");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

const bucket = admin.storage().bucket();

exports.optimiseUploadedImage = onObjectFinalized(
  {
    region: "africa-south1",
  },
  async (event) => {
    const filePath = event.data.name;

    if (!filePath) return;

    // Only process raw uploads
    if (!filePath.startsWith("uploads/raw/")) {
      return;
    }

    // Only process images
    if (!event.data.contentType?.startsWith("image/")) {
      return;
    }

    console.log("🖼 Processing:", filePath);

    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    const file = bucket.file(filePath);

    // Download original
    await file.download({ destination: tempFilePath });

    // Decide max width based on folder
    let maxWidth = 1200;

    if (filePath.includes("/gallery/")) {
      maxWidth = 1600;
    }

    if (filePath.includes("/specials/")) {
      maxWidth = 1000;
    }

    // Process image
    const optimizedBuffer = await sharp(tempFilePath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    // Build optimized path
    const relativePath = filePath.replace("uploads/raw/", "");
    const outputPath =
      path.dirname(relativePath) +
      "/" +
      path.parse(fileName).name +
      ".webp";

    const optimizedFile = bucket.file(outputPath);

    await optimizedFile.save(optimizedBuffer, {
        metadata: {
            contentType: "image/webp",
            metadata: {
            optimized: "true",
            },
        },
    });

    console.log("☁ Saved optimized:", outputPath);

    // Delete original raw file
    await file.delete();
    fs.unlinkSync(tempFilePath);

    console.log("🗑 Deleted raw upload:", filePath);
  }
);
