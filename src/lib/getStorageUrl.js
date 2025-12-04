import { getDownloadURL, ref } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

export async function getStorageUrl(path) {
  if (!path) return "";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path; // remove leading slash
  const fileRef = ref(warehouseStorage, cleanPath);
  return await getDownloadURL(fileRef);
}