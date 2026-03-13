const { db } = require("../config/firebaseAdmin");

const MENU_TYPES = new Set(["food", "drink"]);
const ENTITY_TYPES = new Set(["extras_group", "notice"]);

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

function validateAppliesTo(appliesTo, menuType) {
  if (!Array.isArray(appliesTo) || !appliesTo.length) {
    throw new Error("At least one appliesTo category is required.");
  }

  const allowed = menuType === "drink" ? DRINK_CATEGORIES : FOOD_CATEGORIES;
  const cleaned = appliesTo
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => allowed.has(value));

  if (!cleaned.length) {
    throw new Error("No valid appliesTo categories were provided.");
  }

  return [...new Set(cleaned)];
}

function validateExtrasItems(items) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("At least one extras item is required.");
  }

  const cleaned = items
    .map((item) => {
      const name = String(item?.name || "").trim();
      const amount = Number(item?.amount);

      return {
        name,
        slug: slugify(`extras-${name}`),
        amount,
        isAvailable: true,
      };
    })
    .filter(
      (item) =>
        item.name &&
        Number.isInteger(item.amount) &&
        item.amount >= 0
    );

  if (!cleaned.length) {
    throw new Error("At least one valid extras item is required.");
  }

  return cleaned;
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) {
    throw new Error("At least one message is required.");
  }

  const cleaned = messages
    .map((message) => String(message || "").trim())
    .filter(Boolean);

  if (!cleaned.length) {
    throw new Error("At least one valid message is required.");
  }

  return cleaned;
}

function validateMenuMiscPayload(data = {}) {
  const entityType = data.entityType;
  if (!ENTITY_TYPES.has(entityType)) {
    throw new Error("Invalid entity type.");
  }

  if (entityType === "extras_group") {
    const name = String(data.name || "").trim();
    if (!name) throw new Error("Name is required.");

    return {
      entityType: "extras_group",
      menuType: "food",
      name,
      slug: slugify(name),
      appliesTo: validateAppliesTo(data.appliesTo, "food"),
      items: validateExtrasItems(data.items),
    };
  }

  const menuType = String(data.menuType || "").trim();
  if (!MENU_TYPES.has(menuType)) {
    throw new Error("Menu type is required for notices.");
  }

  return {
    entityType: "notice",
    menuType,
    appliesTo: validateAppliesTo(data.appliesTo, menuType),
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    messages: validateMessages(data.messages),
  };
}

function buildMenuMiscDocId(payload) {
  if (payload.entityType === "extras_group") {
    return `extras-group-${payload.slug}`;
  }

  const appliesKey = payload.appliesTo.join("-");
  return `notice-${payload.menuType}-${appliesKey}`;
}

async function ensureUniqueMenuMiscDoc(payload, docId = null) {
  const nextId = buildMenuMiscDocId(payload);
  if (docId && docId === nextId) return;

  const snap = await db.collection("menu").doc(nextId).get();
  if (snap.exists) {
    throw new Error("A menu misc document with this configuration already exists.");
  }
}

module.exports = {
  actorLabel,
  buildMenuMiscDocId,
  ensureUniqueMenuMiscDoc,
  validateMenuMiscPayload,
};