import { ref, getDownloadURL } from 'firebase/storage'
import dayjs from "dayjs";
import { warehouseStorage } from '@/firebase/firebaseConfig';

export const OPENING_TIMES = {
    0 : { open: "12:00", close: "21:00"},
    1 : { open: "12:00", close: "00:00"},
    2 : { open: "12:00", close: "00:00"},
    3 : { open: "12:00", close: "02:00"},
    4 : { open: "12:00", close: "02:00"},
    5 : { open: "12:00", close: "02:00"},
    6 : { open: "12:00", close: "02:00"}
}

/* -------------- Image Resolver ---------------- */

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
  if (!event?.slug) return null;

  // Prefer runtime origin (correct for preview domains, staging etc.)
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || '';

  return `${origin}/events/${encodeURIComponent(event.slug)}`;
}


export async function shareEvent(event) {
  if (!event?.slug) return;

  const url = buildShareUrl(event);
  if (!url) return;

  const shareData = {
    title: event?.name || 'Event',
    text: event?.description
      ? event.description.slice(0, 140)
      : undefined,
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    }
  } catch (err) {
    // AbortError = user cancelled — not a failure
    if (err?.name !== 'AbortError') {
      console.error('Share failed:', err);
    }
  }

  // Fallback: copy to clipboard
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'clipboard' };
    }
  } catch (err) {
    console.error('Clipboard failed:', err);
  }

  // Last fallback
  window.prompt('Copy this link:', url);
  return { success: true, method: 'prompt' };
}

/* -------------- Menu specific functions ---------------- */

// Get unique categories from a flattened menu array
export function getUniqueCategories(menuItems) {
  const categoriesSet = new Set()
  menuItems.forEach(item => {
    if (item.category) categoriesSet.add(item.category)
  })
  return Array.from(categoriesSet)
}

// get the lowest price of menu object
export const getLowestPrice = (item) => {
  if (!Array.isArray(item?.pricing)) return Infinity;

  const validPrices = item.pricing
    .map(p => p?.amount)
    .filter(a => typeof a === "number");

  return validPrices.length ? Math.min(...validPrices) : Infinity;
};

// Order the specials or weekly by closest day
export function orderByClosestDay(specials = []) {
  const today = dayjs().day();

  return specials
    .slice()
    .sort((a, b) => {
      const getClosest = (s) =>
        Math.min(
          ...(s.weekDays || []).map((d) => (d - today + 7) % 7)
        );

      return getClosest(a) - getClosest(b);
    });
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
export function getOpeningHoursForToday(){
  const todayIndex = dayjs().day(); // 0 = Sunday, 6 = Saturday
  const today = OPENING_TIMES[todayIndex];

  if (!today) {
    return { open: null, close: null };
  }

  return {
    open: today.open,
    close: today.close
  };
}

// grouped opening times for the week
export function groupOpeningTimes() {
  const groups = [];

  for (let i = 0; i < 7; i++) {
    const entryDay =  OPENING_TIMES[i];
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