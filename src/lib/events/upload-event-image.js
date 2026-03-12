import { ref, uploadBytes } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

function getExtension(file) {
  const name = file?.name || "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
}

export async function uploadEventRawImage({ file, eventId }) {
  if (!file || !eventId) {
    throw new Error("File and eventId are required.");
  }

  const ext = getExtension(file);
  const rawPath = `uploads/raw/events/manual/${eventId}.${ext}`;
  const storageRef = ref(warehouseStorage, rawPath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return {
    rawPath,
    optimizedPath: `events/manual/${eventId}.webp`,
  };
}