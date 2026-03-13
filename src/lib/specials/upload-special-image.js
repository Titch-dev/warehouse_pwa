import { ref, uploadBytes } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

function getExtension(file) {
  const name = file?.name || "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

export async function uploadSpecialRawImage({ file, specialId }) {
  if (!file || !specialId) {
    throw new Error("File and specialId are required.");
  }

  const ext = getExtension(file);
  const uniqueSuffix = Date.now();
  const baseName = `${specialId}-${uniqueSuffix}`;

  const rawPath = `uploads/raw/specials/${baseName}.${ext}`;
  const optimizedPath = `specials/${baseName}.webp`;

  const storageRef = ref(warehouseStorage, rawPath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return {
    rawPath,
    optimizedPath,
  };
}