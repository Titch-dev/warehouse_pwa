import dayjs from "dayjs";

export function sortEvents(events) {
  return [...events].sort((a, b) =>
    dayjs(a.start_time).diff(dayjs(b.start_time))
  );
}

export function applyEventFilters(events, filters) {
  const now = dayjs();
  let out = [...events];

  if (filters.time === "next") {
    out = out.length ? [out[0]] : [];
  } else if (filters.time === "thisMonth") {
    out = out.filter((e) => dayjs(e.start_time).isSame(now, "month"));
  } else if (filters.time === "nextMonth") {
    out = out.filter((e) =>
      dayjs(e.start_time).isSame(now.add(1, "month"), "month")
    );
  }

  if (filters.type === "weekly") {
    out = out.filter((e) => e.type === "weekly");
  } else if (filters.type === "one_off") {
    out = out.filter((e) => e.type === "one_off");
  }

  if (filters.price === "free") {
    out = out.filter((e) => {
      const amounts = e?.price?.amount;

      if (!Array.isArray(amounts)) return false;
      if (amounts.length === 0) return true;

      return amounts.every((a) => Number(a) === 0);
    });
  }

  return out;
}

export function formatPriceDisplay(price = {}) {
  const amounts = price?.amount;

  if (!Array.isArray(amounts) || amounts.length === 0) {
    return "Free entry";
  }

  if (amounts.length === 1 && amounts[0] === "TBC") {
    return "TBC";
  }

  const suffix =
    typeof price?.denom === "string" && price.denom.trim()
      ? price.denom.trim()
      : "pp";

  const numericPrices = amounts
    .filter((p) => typeof p === "number" && Number.isFinite(p))
    .sort((a, b) => a - b);

  if (numericPrices.length === 0) {
    return "Free entry";
  }

  const lowest = numericPrices[0];
  const highest = numericPrices[numericPrices.length - 1];

  if (lowest === highest) {
    return `R${lowest} ${suffix}`;
  }

  return `R${lowest} - R${highest} ${suffix}`;
}