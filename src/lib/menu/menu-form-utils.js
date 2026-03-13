import {
  MENU_TYPES,
  categorySupportsBadges,
  categorySupportsBrewery,
  categorySupportsImage,
} from "./menu-config";

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

export function buildMenuImageAlt(name = "") {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "Menu item image at Westville Warehouse";
  return `${cleaned} menu item image at Westville Warehouse`;
}

export function buildInitialMenuItemForm(menuDoc = null) {
  return {
    menuType: menuDoc?.menuType || MENU_TYPES.FOOD,
    name: menuDoc?.name || "",
    category: menuDoc?.category || "",
    description: menuDoc?.description || "",
    brewery: menuDoc?.brewery || "",
    badges: Array.isArray(menuDoc?.badges) ? menuDoc.badges : [],
    sortOrder:
      typeof menuDoc?.sortOrder === "number" ? String(menuDoc.sortOrder) : "",
    pricing: Array.isArray(menuDoc?.pricing) && menuDoc.pricing.length
      ? menuDoc.pricing.map((row) => ({
          amount: String(row?.amount ?? ""),
          label: row?.label || "",
        }))
      : [{ amount: "", label: "" }],
    imagePath: menuDoc?.image?.value || "",
  };
}

export function buildMenuItemPayload(values) {
  const pricing = (values.pricing || [])
    .map((row) => ({
      amount: Number(row.amount),
      label: row.label?.trim() || null,
    }))
    .filter((row) => Number.isInteger(row.amount) && row.amount >= 0);

  const supportsBadges = categorySupportsBadges(values.menuType, values.category);
  const supportsBrewery = categorySupportsBrewery(values.menuType, values.category);
  const supportsImage = categorySupportsImage(values.menuType, values.category);

  return {
    entityType: "item",
    menuType: values.menuType,
    name: values.name,
    category: values.category,
    description: values.description?.trim() || null,
    brewery: supportsBrewery ? values.brewery?.trim() || null : null,
    badges: supportsBadges ? values.badges || [] : [],
    isAvailable: true,
    sortOrder:
      values.sortOrder === "" || values.sortOrder === null
        ? null
        : Number(values.sortOrder),
    pricing,
    image: supportsImage && values.imagePath
      ? {
          alt: buildMenuImageAlt(values.name),
          value: values.imagePath,
          type: "storage",
        }
      : null,
  };
}

export function formatPricing(pricing = []) {
  if (!Array.isArray(pricing) || pricing.length === 0) return "—";

  return pricing
    .map((row) => {
      const amount = Number(row.amount);
      if (!Number.isFinite(amount)) return null;

      return row.label ? `${row.label} R${amount}` : `R${amount}`;
    })
    .filter(Boolean)
    .join(", ");
}

export function formatUpdatedMeta(menuItem) {
  const updatedAt = menuItem?.updatedAt?.toDate?.();
  const updatedBy = menuItem?.updatedBy || "unknown";

  if (!updatedAt) return updatedBy;

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(updatedAt);

  return `${formattedDate}, ${updatedBy}`;
}