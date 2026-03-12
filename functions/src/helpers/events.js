const { admin, db } = require("../config/firebaseAdmin");
const { Timestamp } = require("firebase-admin/firestore");

const VENUE_NAME = "Westville Warehouse bar and events venue";

function stripEmojis(text = "") {
  return (text || "")
    .normalize("NFKC")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u2600-\u27BF]/g, "")
    .replace(/[\u200D\uFE0E\uFE0F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function slugify(text = "") {
  return stripEmojis(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-{2,}/g, "-");
}

function buildAltText(eventName) {
  if (!eventName) return `Event at ${VENUE_NAME}`;
  return `${eventName} at ${VENUE_NAME}`;
}

function actorLabel(actor) {
  return actor?.userData?.email || actor?.email || actor?.uid || "system";
}

function toTimestamp(value, fieldName) {
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date.`);
  }

  return Timestamp.fromDate(date);
}

function normalizePrice(price = {}) {
  const rawAmount = Array.isArray(price.amount) ? price.amount : [];
  const cleaned = rawAmount
    .map((entry) => {
      if (entry === "TBC") return "TBC";
      if (entry === null || entry === undefined || entry === "") return null;

      const n = Number(entry);
      return Number.isFinite(n) && n >= 0 ? n : null;
    })
    .filter((entry) => entry !== null);

  const hasTBC = cleaned.includes("TBC");
  const numeric = cleaned.filter((entry) => typeof entry === "number");

  if (hasTBC && numeric.length) {
    throw new Error('Price cannot contain both numeric values and "TBC".');
  }

  if (hasTBC) {
    return {
      amount: ["TBC"],
      denom: null,
    };
  }

  if (!numeric.length) {
    return {
      amount: [],
      denom: null,
    };
  }

  const uniqueSorted = [...new Set(numeric)].sort((a, b) => a - b);

  return {
    amount: uniqueSorted,
    denom: (price.denom || "").trim() || "pp",
  };
}

function normalizeImage(image = {}, name = "") {
  if (!image || !image.value) return null;

  return {
    alt: (image.alt || "").trim() || buildAltText(name),
    type: "storage",
    value: image.value,
  };
}

async function ensureUniqueSlug(slug, docId = null) {
  const snap = await db.collection("events").where("slug", "==", slug).get();

  const conflict = snap.docs.find((doc) => doc.id !== docId);
  if (conflict) {
    throw new Error("An event with this slug already exists.");
  }
}

function validateEventPayload(data, { isUpdate = false, existing = null } = {}) {
  const name = stripEmojis(data.name || "");
  if (!name) throw new Error("Event name is required.");

  const description = stripEmojis(data.description || "");

  const source = existing?.source || data.source || "manual";
  const type = data.type || existing?.type || "one_off";

  if (!["manual", "facebook"].includes(source)) {
    throw new Error("Invalid event source.");
  }

  if (!["one_off", "weekly"].includes(type)) {
    throw new Error("Invalid event type.");
  }

  const startTimestamp = toTimestamp(data.start_time, "Start time");

  let endTimestamp = null;
  if (data.end_time) {
    endTimestamp = toTimestamp(data.end_time, "End time");
    if (endTimestamp.toMillis() <= startTimestamp.toMillis()) {
      throw new Error("End time must be after start time.");
    }
  }

  const now = Date.now();
  const isPastStart = startTimestamp.toMillis() < now;

  if (!isUpdate && isPastStart) {
    throw new Error("Start time must be in the future.");
  }

  const ticketUrl = (data.ticket_url || "").trim() || null;
  if (ticketUrl) {
    try {
      new URL(ticketUrl);
    } catch {
      throw new Error("Ticket URL must be a valid URL.");
    }
  }

  const normalizedPrice = normalizePrice(data.price || {});
  const normalizedImage = normalizeImage(data.image, name);
  const slug = slugify(name);

  return {
    name,
    slug,
    description,
    price: normalizedPrice,
    ticket_url: ticketUrl,
    start_time: startTimestamp,
    end_time: endTimestamp,
    image: normalizedImage,
    source,
    type,
  };
}

module.exports = {
  actorLabel,
  buildAltText,
  ensureUniqueSlug,
  normalizeImage,
  slugify,
  stripEmojis,
  validateEventPayload,
};