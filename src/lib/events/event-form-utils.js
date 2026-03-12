import dayjs from "dayjs";

export const EVENT_TYPES = {
  ONE_OFF: "one_off",
  WEEKLY: "weekly",
};

export const EVENT_SOURCES = {
  MANUAL: "manual",
  FACEBOOK: "facebook",
};

export function buildEventImageAlt(eventName = "") {
  const cleaned = String(eventName || "").trim();

  if (!cleaned) {
    return "Event image at Westville Warehouse";
  }

  return `${cleaned} event image at Westville Warehouse`;
}

export function buildInitialEventForm(eventDoc = null) {
  return {
    name: eventDoc?.name || "",
    description: eventDoc?.description || "",
    type: eventDoc?.type || EVENT_TYPES.ONE_OFF,
    ticket_url: eventDoc?.ticket_url || "",
    start_time: eventDoc?.start_time
      ? dayjs(eventDoc.start_time.toDate?.() || eventDoc.start_time)
      : null,
    end_time: eventDoc?.end_time
      ? dayjs(eventDoc.end_time.toDate?.() || eventDoc.end_time)
      : null,
    priceMode: getPriceMode(eventDoc?.price),
    priceValues: getPriceValues(eventDoc?.price),
    priceDenom: eventDoc?.price?.denom || "pp",
    imagePath: eventDoc?.image?.value || "",
  };
}

export function getPriceMode(price) {
  const amount = price?.amount;

  if (amount === "TBC") return "tbc";
  if (Array.isArray(amount) && amount.length > 0) return "paid";
  return "free";
}

export function getPriceValues(price) {
  const amount = price?.amount;
  if (!Array.isArray(amount)) return "";
  return amount.filter((value) => typeof value === "number").join(", ");
}

export function buildEventPayload(values, existingSource = "manual") {
  let amount = [];
  let denom = null;

  if (values.priceMode === "tbc") {
    amount = "TBC";
  }

  if (values.priceMode === "paid") {
    amount = String(values.priceValues || "")
      .split(",")
      .map((entry) => Number(entry.trim()))
      .filter((n) => Number.isFinite(n) && n >= 0);

    denom = (values.priceDenom || "").trim() || "pp";
  }

  return {
    name: values.name,
    description: values.description,
    type: values.type,
    source: existingSource,
    ticket_url: values.ticket_url || null,
    start_time: values.start_time ? values.start_time.toISOString() : null,
    end_time: values.end_time ? values.end_time.toISOString() : null,
    price: {
      amount,
      denom,
    },
    image: values.imagePath
      ? {
          alt: buildEventImageAlt(values.name),
          value: values.imagePath,
          type: "storage",
        }
      : null,
  };
}

export function getEventLifecycleStatus(event) {
  if (event.type === "weekly") return "weekly";

  const now = Date.now();
  const end = event.end_time?.toDate?.()?.getTime?.() || null;
  const start = event.start_time?.toDate?.()?.getTime?.() || null;

  if (end && end < now) return "ended";
  if (!end && start && start < now) return "ended";

  return "upcoming";
}

export function formatUpdatedMeta(event) {
  const updatedAt = event?.updatedAt?.toDate?.();
  const updatedBy = event?.updatedBy || "unknown";

  if (!updatedAt) {
    return `Updated by ${updatedBy}`;
  }

  return `Updated ${updatedAt.toLocaleString()} by ${updatedBy}`;
}