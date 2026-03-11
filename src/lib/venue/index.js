import dayjs from "dayjs";

export const OPENING_TIMES = {
  0: { open: "12:00", close: "21:00" },
  1: { open: "12:00", close: "00:00" },
  2: { open: "12:00", close: "00:00" },
  3: { open: "12:00", close: "02:00" },
  4: { open: "12:00", close: "02:00" },
  5: { open: "12:00", close: "02:00" },
  6: { open: "12:00", close: "02:00" },
};

export function getOpeningHoursForToday() {
  const todayIndex = dayjs().day();
  const today = OPENING_TIMES[todayIndex];

  if (!today) {
    return { open: null, close: null };
  }

  return {
    open: today.open,
    close: today.close,
  };
}

export function groupOpeningTimes() {
  const groups = [];

  for (let i = 0; i < 7; i++) {
    const entryDay = OPENING_TIMES[i];
    let foundGroup = false;

    for (const group of groups) {
      if (group.open === entryDay.open && group.close === entryDay.close) {
        group.days.push(i);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groups.push({
        days: [i],
        open: entryDay.open,
        close: entryDay.close,
      });
    }
  }

  return groups;
}

export function orderByClosestDay(items = []) {
  const today = dayjs().day();

  return items
    .slice()
    .sort((a, b) => {
      const getClosest = (item) =>
        Math.min(...(item.weekDays || []).map((d) => (d - today + 7) % 7));

      return getClosest(a) - getClosest(b);
    });
}