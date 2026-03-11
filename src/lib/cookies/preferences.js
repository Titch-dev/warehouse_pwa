const COOKIE_NAME = "ww_cookie_prefs";
const VERSION = 1;
const MAX_AGE_DAYS = 180;

export function getDefaultPrefs() {
  return {
    v: VERSION,
    necessary: true,
    analytics: false,
    ts: Date.now(),
  };
}

export function readCookiePrefs() {
  if (typeof document === "undefined") return null;

  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!raw) return null;

  try {
    const json = decodeURIComponent(raw);
    const parsed = JSON.parse(json);

    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.v !== VERSION) return null;

    return {
      ...getDefaultPrefs(),
      ...parsed,
      necessary: true,
    };
  } catch {
    return null;
  }
}

export function writeCookiePrefs(prefs) {
  if (typeof document === "undefined") return;

  const payload = {
    ...getDefaultPrefs(),
    ...prefs,
    necessary: true,
    ts: Date.now(),
  };

  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;

  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "SameSite=Lax",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  try {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(payload));
  } catch {}
}

export function clearCookiePrefs() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  try {
    localStorage.removeItem(COOKIE_NAME);
  } catch {}
}