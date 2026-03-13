const { db } = require("../config/firebaseAdmin");

const SPECIAL_TYPES = new Set(["food", "drink"]);

function slugify(text = "") {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-{2,}/g, "-");
}

function actorLabel(actor) {
  return actor?.userData?.email || actor?.email || actor?.uid || "system";
}

function buildSpecialImageAlt(name = "") {
  const cleaned = String(name || "").trim();

  if (!cleaned) {
    return "Specials at Westville Warehouse";
  }

  return `${cleaned} specials at Westville Warehouse`;
}

function validateWeekDays(weekDays) {
  if (!Array.isArray(weekDays) || !weekDays.length) {
    throw new Error("At least one weekday is required.");
  }

  const cleaned = [...new Set(
    weekDays
      .map((day) => Number(day))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
  )].sort((a, b) => a - b);

  if (!cleaned.length) {
    throw new Error("At least one valid weekday is required.");
  }

  return cleaned;
}

function validateOffers(offers) {
  if (!Array.isArray(offers) || !offers.length) {
    throw new Error("At least one offer is required.");
  }

  const cleaned = offers
    .map((row) => ({
      offer: String(row?.offer || "").trim(),
      price:
        row?.price === null || row?.price === undefined || row?.price === ""
          ? null
          : Number(row.price),
    }))
    .filter(
      (row) =>
        row.offer &&
        (row.price === null || (Number.isInteger(row.price) && row.price >= 0))
    );

  if (!cleaned.length) {
    throw new Error("At least one valid offer is required.");
  }

  return cleaned;
}

function normalizeImage(image, name) {
  if (!image || !image.value) return null;

  return {
    alt: buildSpecialImageAlt(name),
    value: image.value,
    type: "storage",
  };
}

function validateSpecialPayload(data = {}) {
  const name = String(data.name || "").trim();
  if (!name) throw new Error("Name is required.");

  const type = String(data.type || "").trim();
  if (!SPECIAL_TYPES.has(type)) {
    throw new Error("Type must be food or drink.");
  }

  return {
    name,
    slug: slugify(name),
    type,
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    weekDays: validateWeekDays(data.weekDays),
    offers: validateOffers(data.offers),
    image: normalizeImage(data.image, name),
  };
}

async function ensureUniqueSpecialSlug(payload, docId = null) {
  const nextId = `${payload.type}-${payload.slug}`;
  if (docId && docId === nextId) return;

  const snap = await db.collection("specials").doc(nextId).get();
  if (snap.exists) {
    throw new Error("A special with this name already exists.");
  }
}

function buildSpecialDocId(payload) {
  return `${payload.type}-${payload.slug}`;
}

module.exports = {
  actorLabel,
  buildSpecialDocId,
  ensureUniqueSpecialSlug,
  validateSpecialPayload,
};