import { SPECIAL_TYPES, WEEK_DAYS } from "./specials-config";

export function slugify(text = "") {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildSpecialImageAlt(name = "") {
  const cleaned = String(name || "").trim();

  if (!cleaned) {
    return "Specials at Westville Warehouse";
  }

  return `${cleaned} specials at Westville Warehouse`;
}

export function buildInitialSpecialForm(specialDoc = null) {
  return {
    name: specialDoc?.name || "",
    type: specialDoc?.type || SPECIAL_TYPES.FOOD,
    isActive:
      typeof specialDoc?.isActive === "boolean" ? specialDoc.isActive : true,
    imagePath: specialDoc?.image?.value || "",
    weekDays: Array.isArray(specialDoc?.weekDays) ? specialDoc.weekDays : [],
    offers:
      Array.isArray(specialDoc?.offers) && specialDoc.offers.length
        ? specialDoc.offers.map((offer) => ({
            offer: offer?.offer || "",
            price:
              typeof offer?.price === "number" ? String(offer.price) : "",
          }))
        : [{ offer: "", price: "" }],
  };
}

export function buildSpecialPayload(values) {
  return {
    name: values.name,
    type: values.type,
    isActive: Boolean(values.isActive),
    weekDays: [...new Set(values.weekDays)].sort((a, b) => a - b),
    offers: (values.offers || [])
      .map((row) => ({
        offer: row.offer?.trim() || "",
        price:
          row.price === "" || row.price === null
            ? null
            : Number(row.price),
      }))
      .filter(
        (row) =>
          row.offer &&
          (row.price === null || (Number.isInteger(row.price) && row.price >= 0))
      ),
    image: values.imagePath
      ? {
          alt: buildSpecialImageAlt(values.name),
          value: values.imagePath,
          type: "storage",
        }
      : null,
  };
}

export function formatWeekDays(days = []) {
  if (!Array.isArray(days) || !days.length) return "—";

  return WEEK_DAYS
    .filter((day) => days.includes(day.value))
    .map((day) => day.label)
    .join(", ");
}

export function formatOffers(offers = [], maxLength = 40) {
  if (!Array.isArray(offers) || !offers.length) return "—";

  const text = offers
    .map((row) =>
      row.price === null ? row.offer : `${row.offer} R${row.price}`
    )
    .join(" | ");

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function formatUpdatedMeta(special) {
  const updatedAt = special?.updatedAt?.toDate?.();
  const updatedBy = special?.updatedBy || "unknown";

  if (!updatedAt) return updatedBy;

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(updatedAt);

  return `${formattedDate}, ${updatedBy}`;
}