import { MENU_MISC_ENTITY_TYPES, MENU_TYPES } from "./menu-config";

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

export function buildInitialMenuMiscForm(menuDoc = null) {
  const entityType =
    menuDoc?.entityType || MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP;

  return {
    entityType,
    menuType: menuDoc?.menuType || MENU_TYPES.FOOD,
    name: menuDoc?.name || "",
    appliesTo: Array.isArray(menuDoc?.appliesTo) ? menuDoc.appliesTo : [],
    isActive:
      typeof menuDoc?.isActive === "boolean" ? menuDoc.isActive : true,
    messages:
      Array.isArray(menuDoc?.messages) && menuDoc.messages.length
        ? menuDoc.messages.map((message) => ({ value: message }))
        : [{ value: "" }],
    items:
      Array.isArray(menuDoc?.items) && menuDoc.items.length
        ? menuDoc.items.map((item) => ({
            name: item?.name || "",
            amount: String(item?.amount ?? ""),
          }))
        : [{ name: "", amount: "" }],
  };
}

export function buildMenuMiscPayload(values) {
  if (values.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP) {
    const cleanedName = values.name?.trim() || "";

    return {
      entityType: MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP,
      menuType: MENU_TYPES.FOOD,
      name: cleanedName,
      slug: slugify(cleanedName),
      appliesTo: values.appliesTo || [],
      items: (values.items || [])
        .map((item) => {
          const name = item.name?.trim() || "";
          return {
            name,
            slug: slugify(`extras-${name}`),
            amount: Number(item.amount),
            isAvailable: true,
          };
        })
        .filter(
          (item) =>
            item.name &&
            Number.isInteger(item.amount) &&
            item.amount >= 0
        ),
    };
  }

  return {
    entityType: MENU_MISC_ENTITY_TYPES.NOTICE,
    menuType: values.menuType,
    appliesTo: values.appliesTo || [],
    isActive: Boolean(values.isActive),
    messages: (values.messages || [])
      .map((message) => message.value?.trim() || "")
      .filter(Boolean),
  };
}

export function formatUpdatedMeta(menuDoc) {
  const updatedAt = menuDoc?.updatedAt?.toDate?.();
  const updatedBy = menuDoc?.updatedBy || "unknown";

  if (!updatedAt) return updatedBy;

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(updatedAt);

  return `${formattedDate}, ${updatedBy}`;
}

export function formatAppliesTo(appliesTo = []) {
  if (!Array.isArray(appliesTo) || !appliesTo.length) return "—";
  return appliesTo.join(", ");
}

export function formatMessages(messages = []) {
  if (!Array.isArray(messages) || !messages.length) return "—";

  return messages
    .map((message) => truncateText(message, 18))
    .join(" | ");
}

export function formatExtrasItems(items = []) {
  if (!Array.isArray(items) || !items.length) return "—";

  return items
    .map((item) => `${truncateText(item.name, 15)} R${item.amount}`)
    .join(", ");
}

export function truncateText(value = "", maxLength = 18) {
  const text = String(value || "").trim();

  if (!text) return "—";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
}