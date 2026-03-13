import { ref, uploadBytes } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

function getExtension(file) {
  const name = file?.name || "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

export async function uploadMenuRawImage({ file, menuId }) {
  if (!file || !menuId) {
    throw new Error("File and menuId are required.");
  }

  const ext = getExtension(file);
  const uniqueSuffix = Date.now();
  const baseName = `${menuId}-${uniqueSuffix}`;

  const rawPath = `uploads/raw/menu/${baseName}.${ext}`;
  const optimizedPath = `menu/${baseName}.webp`;

  const storageRef = ref(warehouseStorage, rawPath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return {
    rawPath,
    optimizedPath,
  };
}