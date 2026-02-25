import { ref, getDownloadURL } from 'firebase/storage'
import dayjs from "dayjs";
import { warehouseStorage } from '@/firebase/firebaseConfig';


/* -------------- Image Resolver ---------------- */

const storageUrlCache = new Map();

// get firebase image
  export const getStorageImageUrl = async (path) => {
  if (!path) return null;

  // return cached if exists
  if (storageUrlCache.has(path)) {
    return storageUrlCache.get(path);
  }

  try {
    const storageRef = ref(warehouseStorage, path);
    const url = await getDownloadURL(storageRef);

    storageUrlCache.set(path, url); // cache it
    return url;
  } catch (err) {
    console.error('Error fetching storage image:', err);
    return null;
  }
};

export const resolveImageUrl = (image) => {
  if (!image) return null;

  const { type, value } = image;
  if (!value) return null;

  if (type === 'storage') {
    return `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_BUCKET}/o/${encodeURIComponent(value)}?alt=media`;
  }

  if (type === 'external') {
    return value;
  }

  return null;
};


/* -------------- Event specific functions ---------------- */

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

// format event price
export function formatPriceDisplay(price = {}) {
    const amounts = price?.amount;

    if (!Array.isArray(amounts) || amounts.length === 0) {
      return "Free entry";
    }

    // Case: ["TBC"]
    if (amounts.length === 1 && amounts[0] === "TBC") {
      return "TBC";
    }

    // Suffix: use denom if present, else default to 'pp'
    const suffix =
      typeof price?.denom === "string" && price.denom.trim()
        ? price.denom.trim()
        : "pp";

    // Filter numeric values only
    const numericPrices = amounts
      .filter(p => typeof p === "number" && Number.isFinite(p))
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
export const formatEventTime = (start_time, end_time = null) => {
    const start = dayjs(start_time);

    if (!end_time) {
      return `${start.format('h:mm a')} - late`;
    }

    const end = dayjs(end_time);
    return `${start.format('h:mm a')} - ${end.format('h:mm a')}`;
  };


  // Get events in date order
export function sortEvents(events) {
    return [...events].sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))
  )
};

 // apply event filters

export function applyEventFilters(events, filters) {
  const now = dayjs();
  let out = [...events];

  // TIME (mutually exclusive)
  if (filters.time === 'next') {
    out = out.length ? [out[0]] : [];
  } else if (filters.time === 'thisMonth') {
    out = out.filter(e => dayjs(e.start_time).isSame(now, 'month'));
  } else if (filters.time === 'nextMonth') {
    out = out.filter(e => dayjs(e.start_time).isSame(now.add(1, 'month'), 'month'));
  }

  // TYPE (mutually exclusive)
  if (filters.type === 'weekly') {
    out = out.filter(e => e.type === 'weekly');
  } else if (filters.type === 'one_off') {
    out = out.filter(e => e.type === 'one_off');
  }

  // PRICE
 if (filters.price === 'free') {
  out = out.filter(e => {
    const amounts = e?.price?.amount;

    // must be an array
    if (!Array.isArray(amounts)) return false;

    // empty array = free
    if (amounts.length === 0) return true;

    // if every value is 0 (e.g. [0])
    return amounts.every(a => Number(a) === 0);
  });
}

  return out;
} 

// Share event and share builder
export function buildShareUrl(event) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return `${siteUrl}/events/${encodeURIComponent(event.slug)}`;
}

export async function shareEvent(event) {
  const url = buildShareUrl(event);

  const shareData = {
    title: event.name,
    text: (event.description || '').slice(0, 140),
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // user cancelled
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard');
  } else {
    prompt('Copy this link:', url);
  }
}

/* -------------- Menu specific functions ---------------- */

// Get unique categories from a flattened menu array
export function getUniqueCategories(menuItems) {
  const categoriesSet = new Set()
  menuItems.forEach(item => {
    if (item.itemCategory) categoriesSet.add(item.itemCategory)
  })
  return Array.from(categoriesSet)
}


// Order the specials or weekly by closest day
export function orderByClosestDay(specials = []) {
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


// get the menupdf from stroage
export async function getMenuPdfUrl(menuType) {
  const fileRef = ref(warehouseStorage, `menu/${menuType}-menu.pdf`)
  return await getDownloadURL(fileRef)
}


// Slugify names of docs - 'Chicken Burger' => 'chicken_burger'
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '')
}


/* ----------- Venue opening and closing functions -------------- */

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