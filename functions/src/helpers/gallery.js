function actorLabel(actor) {
  return actor?.userData?.email || actor?.email || actor?.uid || "system";
}

function validateGalleryPayload(data = {}) {
  const visible =
    typeof data.visible === "boolean" ? data.visible : true;

  const order =
    data.order === null || data.order === undefined || data.order === ""
      ? null
      : Number(data.order);

  if (order !== null && !Number.isFinite(order)) {
    throw new Error("Order must be a number or blank.");
  }

  const tags = Array.isArray(data.tags)
    ? data.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  const image =
    data.image?.value
      ? {
          alt: "The Westville Warehouse gallery image",
          type: "storage",
          value: data.image.value,
        }
      : null;

  if (!image) {
    throw new Error("Gallery image is required.");
  }

  return {
    visible,
    order,
    tags,
    image,
  };
}

module.exports = {
  actorLabel,
  validateGalleryPayload,
};