import { getFirestoreCollection } from "@/lib/getFirestoreCollection";
import { getStorageUrl } from "@/lib/getStorageUrl";

export async function getMenuItems(collection) {
  const items = await getFirestoreCollection(collection);

  const withUrls = await Promise.all(
    items.map(async (item) => ({
      ...item,
      imageUrl: await getStorageUrl(item.itemImagePath),
    }))
  );

  return withUrls;
}