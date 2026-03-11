import dayjs from "dayjs";

export function getDate(value) {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "object" &&
    typeof value.seconds === "number" &&
    typeof value.nanoseconds === "number"
  ) {
    return new Date(value.seconds * 1000);
  }

  return null;
}

export function getMillis(value) {
  const date = getDate(value);
  return date ? date.getTime() : null;
}

export function formatDateTime(value) {
  const date = getDate(value);

  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getDaysRemaining(value) {
  const date = getDate(value);

  if (!date) return 0;

  const diffMs = date.getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatElapsed(startedAt) {
  const startMs = getMillis(startedAt);

  if (!startMs) return "00:00:00";

  const elapsedMs = Math.max(0, Date.now() - startMs);
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

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

export const formatEventTime = (start_time, end_time = null) => {
  const start = dayjs(start_time);

  if (!end_time) {
    return `${start.format('h:mm a')} - late`;
  }

  const end = dayjs(end_time);
  return `${start.format('h:mm a')} - ${end.format('h:mm a')}`;
};