import { ref, uploadBytes } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

function getExtension(file) {
  const name = file?.name || "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

export async function uploadGalleryRawImage({ file, galleryId }) {
  if (!file || !galleryId) {
    throw new Error("File and galleryId are required.");
  }

  const ext = getExtension(file);
  const uniqueSuffix = Date.now();
  const baseName = `${galleryId}-${uniqueSuffix}`;

  const rawPath = `uploads/raw/gallery/${baseName}.${ext}`;
  const optimizedPath = `gallery/${baseName}.webp`;

  const storageRef = ref(warehouseStorage, rawPath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return {
    rawPath,
    optimizedPath,
  };
}