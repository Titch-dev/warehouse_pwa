import { ref, getDownloadURL } from "firebase/storage";
import { warehouseStorage } from "@/firebase/firebaseConfig";

export async function getMenuPdfUrl(menuType) {
  const fileRef = ref(warehouseStorage, `menu/${menuType}-menu.pdf`);
  return await getDownloadURL(fileRef);
}