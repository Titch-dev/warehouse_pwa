const { db } = require("../config/firebaseAdmin");

const MENU_TYPES = new Set(["food", "drink"]);
const ENTITY_TYPES = new Set(["item"]);

const FOOD_CATEGORIES = new Set([
  "burgers",
  "chicken",
  "loaded fries",
]);

const DRINK_CATEGORIES = new Set([
  "shooters",
  "craft beer",
  "cocktails",
  "pre-mixed",
]);

const BURGER_BADGES = new Set(["beef", "chicken", "vegetarian"]);

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

function supportsBadges(menuType, category) {
  return menuType === "food" && category === "burgers";
}

function supportsBrewery(menuType, category) {
  return menuType === "drink" &&
    (category === "craft beer" || category === "pre-mixed");
}

function supportsImage(menuType, category) {
  return menuType === "drink" &&
    (category === "craft beer" || category === "pre-mixed");
}

function validateCategory(menuType, category) {
  if (!category || typeof category !== "string") {
    throw new Error("Category is required.");
  }

  if (menuType === "food" && !FOOD_CATEGORIES.has(category)) {
    throw new Error("Invalid food category.");
  }

  if (menuType === "drink" && !DRINK_CATEGORIES.has(category)) {
    throw new Error("Invalid drink category.");
  }
}

function validatePricing(pricing) {
  if (!Array.isArray(pricing) || pricing.length === 0) {
    throw new Error("At least one pricing row is required.");
  }

  const cleaned = pricing
    .map((row) => ({
      amount: Number(row?.amount),
      label: row?.label ? String(row.label).trim() : null,
    }))
    .filter((row) => Number.isInteger(row.amount) && row.amount >= 0);

  if (!cleaned.length) {
    throw new Error("At least one valid pricing row is required.");
  }

  return cleaned;
}

function validateBadges(menuType, category, badges) {
  if (!supportsBadges(menuType, category)) return [];
  if (!Array.isArray(badges)) return [];
  return badges.filter((badge) => BURGER_BADGES.has(badge));
}

function normalizeImage(menuType, category, image, name) {
  if (!supportsImage(menuType, category)) return null;
  if (!image || !image.value) return null;

  return {
    alt: `${name} menu item image at Westville Warehouse`,
    value: image.value,
    type: image.type === "external" ? "external" : "storage",
  };
}

function validateMenuItemPayload(data = {}) {
  const entityType = data.entityType || "item";
  if (!ENTITY_TYPES.has(entityType)) {
    throw new Error("Invalid entity type.");
  }

  const menuType = data.menuType;
  if (!MENU_TYPES.has(menuType)) {
    throw new Error("Menu type is required.");
  }

  const name = String(data.name || "").trim();
  if (!name) throw new Error("Name is required.");

  const slug = slugify(name);
  const category = String(data.category || "").trim();

  validateCategory(menuType, category);

  const description =
    data.description === null || data.description === undefined
      ? null
      : String(data.description).trim() || null;

  const brewery = supportsBrewery(menuType, category)
    ? String(data.brewery || "").trim() || null
    : null;

  const pricing = validatePricing(data.pricing);
  const badges = validateBadges(menuType, category, data.badges);

  const sortOrder =
    data.sortOrder === null || data.sortOrder === undefined || data.sortOrder === ""
      ? null
      : Number(data.sortOrder);

  if (sortOrder !== null && !Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number or blank.");
  }

  return {
    entityType: "item",
    menuType,
    name,
    slug,
    category,
    description,
    brewery,
    badges,
    pricing,
    image: normalizeImage(menuType, category, data.image, name),
    isAvailable: true,
    sortOrder,
  };
}

function buildMenuDocId(payload) {
  return `${payload.menuType}-${payload.slug}`;
}

async function ensureUniqueMenuSlug(payload, docId = null) {
  const existingId = buildMenuDocId(payload);
  if (docId && existingId === docId) return;

  const snap = await db.collection("menu").doc(existingId).get();
  if (snap.exists) {
    throw new Error("A menu item with this name already exists.");
  }
}

module.exports = {
  actorLabel,
  buildMenuDocId,
  ensureUniqueMenuSlug,
  slugify,
  validateMenuItemPayload,
};