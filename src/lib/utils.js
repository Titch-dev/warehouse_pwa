import { ref, getDownloadURL } from 'firebase/storage'
import dayjs from "dayjs";
import { warehouseStorage } from '@/firebase/firebaseConfig';



// get the menupdf from stroage
export async function getMenuPdfUrl(menuType) {
  const fileRef = ref(warehouseStorage, `menu/${menuType}-menu.pdf`)
  return await getDownloadURL(fileRef)
}

// Order the specials by closest day
export function orderSpecialsByClosestDay(specials = []) {
  if (!specials.length) return []

  const todayIndex = dayjs().day()

  return [...specials]
    .map(special => {
      const dayIndexes = Object.values(special.days || {})

      // Find closest upcoming day for this doc
      const closestDiff = Math.min(
        ...dayIndexes.map(dayIndex =>
          (dayIndex - todayIndex + 7) % 7
        )
      )

      return {
        ...special,
        dayIndexes,
        sortValue: closestDiff
      }
    })
    .sort((a, b) => a.sortValue - b.sortValue)
}





// get firebase image
export function getStorageImageUrl(path) {
  if (!path) return null

  return `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_BUCKET}/o/${encodeURIComponent(
    path
  )}?alt=media`
}



// get next event
export function getNextEvent(events) {
  const today = dayjs().startOf('day');

  return (
    events
      .filter(event =>
        dayjs(event.start_time).isSame(today, 'day') ||
        dayjs(event.start_time).isAfter(today)
      )
      .sort((a, b) =>
        dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf()
      )[0] || null
  );
}

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

// Get the opening & closing time for today
export function getOpeningHoursForToday(openingTimes) {
  const todayIndex = dayjs().day(); // 0 = Sunday, 6 = Saturday
  const today = openingTimes[todayIndex];

  if (!today) {
    return { open: null, close: null };
  }

  return {
    open: today.open,
    close: today.close
  };
}

// grouped opening times for the week
export function groupOpeningTimes(openingTimes) {
  const groups = [];

  for (let i = 0; i < 7; i++) {
    const entryDay =  openingTimes[i];
    let foundGroup = false;

    // check if there is already a group with same start & end
    for (let group of groups) {
      if (group.open === entryDay.open && group.close === entryDay.close) {
        group.days.push(i);
        foundGroup = true;
        break;
      }
    }

    // if no existing group matched, create a new one
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

// Get events in date order
export function sortEvents(events) {
    return [...events].sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))
  )
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

