export function buildGalleryImageAlt() {
  return "The Westville Warehouse gallery image";
}

export function buildInitialGalleryForm(galleryDoc = null) {
  return {
    visible:
      typeof galleryDoc?.visible === "boolean" ? galleryDoc.visible : true,
    order:
      typeof galleryDoc?.order === "number" ? String(galleryDoc.order) : "",
    tags:
      Array.isArray(galleryDoc?.tags) && galleryDoc.tags.length
        ? galleryDoc.tags.join(", ")
        : "",
    imagePath: galleryDoc?.image?.value || "",
  };
}

export function buildGalleryPayload(values) {
  return {
    visible: Boolean(values.visible),
    order:
      values.order === "" || values.order === null
        ? null
        : Number(values.order),
    tags: String(values.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    image: values.imagePath
      ? {
          alt: "The Westville Warehouse gallery image",
          type: "storage",
          value: values.imagePath,
        }
      : null,
  };
}

export function formatUpdatedMeta(galleryItem) {
  const updatedAt = galleryItem?.updatedAt?.toDate?.();
  const updatedBy = galleryItem?.updatedBy || "unknown";

  if (!updatedAt) return updatedBy;

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(updatedAt);

  return `${formattedDate}, ${updatedBy}`;
}