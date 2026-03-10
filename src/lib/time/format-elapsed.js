export function formatElapsed(startedAt) {
  if (!startedAt) return "00:00:00";

  const startMs =
    typeof startedAt?.toMillis === "function"
      ? startedAt.toMillis()
      : startedAt instanceof Date
        ? startedAt.getTime()
        : null;

  if (!startMs) return "00:00:00";

  const elapsedMs = Math.max(0, Date.now() - startMs);
  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}