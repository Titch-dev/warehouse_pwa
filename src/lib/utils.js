import dayjs from "dayjs";

import { colors } from "./colors";

// format event date
export const formatEventDate = (dateString) => {
    const date = dayjs(dateString);
    const today = dayjs();
    const tomorrow = today.add(1, 'day');
    
    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(tomorrow, 'day')) {
      return 'Tomorrow';
    } else if (date.isSame(today, 'week')) {
      return date.format('dddd');
    } else {
      return date.format('ddd D MMM');
    }
  };

// format event time
export const formatEventTime = (startString, endString) => {
    const start = dayjs(startString);
    const end = dayjs(endString);
    return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
  };

// Get the opening time for today
export function getOpeningHoursForToday(openingTimes = []) {
  const todayIndex = dayjs().day(); // 0 = Sunday, 6 = Saturday
  const today = openingTimes.find(entry => entry.day === todayIndex);

  if (!today) return { start: null, end: null };

  const { start, end } = today;
  return { start, end };
}
// grouped opening times for the week

export function groupOpeningTimes(openingTimes) {
  const groups = [];

  for (let i = 0; i < 7; i++) {
    const entryDay = openingTimes[i];
    let foundGroup = false;

    // check if there is already a group with same start & end
    for (let group of groups) {
      if (group.start === entryDay.start && group.end === entryDay.end) {
        group.days.push(i);
        foundGroup = true;
        break;
      }
    }

    // if no existing group matched, create a new one
    if (!foundGroup) {
      groups.push({
        days: [i],
        start: entryDay.start,
        end: entryDay.end,
      });
    }
  }

  return groups;
}

// Get events in date order
export function sortEvents(events) {
    return [...events].sort((a, b) => dayjs(a.start).diff(dayjs(b.start))
  )
};

// Get event Status
export const getEventStatus = (event) => {
    const now = dayjs();
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end);
    
    if (now.isBefore(eventStart)) {
      return { status: 'upcoming', color: colors.blue };
    } else if (now.isBetween(eventStart, eventEnd)) {
      return { status: 'live', color: colors.pink};
    } else {
      return { status: 'past', color: colors.greydark3 };
    }
  };

// Slugify names of docs - 'Chicken Burger' => 'chicken_burger'
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '')
}

// Get unique categories from a flattened menu array
export function getUniqueCategories(menuItems) {
  const categoriesSet = new Set()
  menuItems.forEach(item => {
    if (item.itemCategory) categoriesSet.add(item.itemCategory)
  })
  return Array.from(categoriesSet)
}