const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("./firebaseAdmin");

const fetch = global.fetch;
const FB_PAGE_ACCESS_TOKEN = defineSecret("FB_PAGE_ACCESS_TOKEN");

const db = admin.firestore();
const bucket = admin.storage().bucket();

const VENUE_NAME = "Westville Warehouse bar and events venue";

/* ---------------- Utilities ---------------- */

function stripEmojis(text = "") {
  return text
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Component}]/gu, "")
    .replace(/\uFE0F/gu, "")
    .replace(/\u200D/gu, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractPrices(description = "") {
  const blockRegex = /\[\s*PRICE\s*\]([\s\S]*?)\[\s*\/\s*PRICE\s*\]/gi;

  let match;
  const prices = [];
  let hasTBC = false;

  const parseNumbersFromText = (text) => {
    const normalized = (text || "")
      .replace(/\u00A0/g, " ")
      .replace(/\u2028|\u2029/g, "\n")
      .replace(/[–—]/g, "-");
    const tokens = normalized.match(/\d[\d\s.,]*/g);
    if (!tokens) return [];

    const out = [];

    for (let raw of tokens) {
      let s = raw.trim().replace(/\s+/g, "");

      const hasComma = s.includes(",");
      const hasDot = s.includes(".");

      if (hasComma && hasDot) {
        if (s.lastIndexOf(".") > s.lastIndexOf(",")) {
          s = s.replace(/,/g, "");
        } else {
          s = s.replace(/\./g, "").replace(/,/g, ".");
        }
      } else if (hasComma && !hasDot) {
        if (/,\d{1,2}$/.test(s)) s = s.replace(/,/g, ".");
        else s = s.replace(/,/g, "");
      } else if (hasDot && !hasComma) {
        if (/\.\d{3}(\.|$)/.test(s) && !/\.\d{1,2}$/.test(s)) {
          s = s.replace(/\./g, "");
        }
      }

      const n = Number(s);
      if (Number.isFinite(n)) out.push(n);
    }

    return out;
  };

  blockRegex.lastIndex = 0;

  while ((match = blockRegex.exec(description)) !== null) {
    const content = (match[1] || "").trim();

    if (/\bTBC\b/i.test(content)) hasTBC = true;

    if (/\bfree\b|\bno\s*cover\b/i.test(content)) {
      prices.push(0);
      continue;
    }

    const nums = parseNumbersFromText(content);
    for (const n of nums) prices.push(n);

    if (nums.length === 0 && !hasTBC) {
      console.warn("⚠️ PRICE block found but no numbers parsed");
      console.warn("RAW PRICE CONTENT:", JSON.stringify(content));
      console.warn(
        "CHAR CODES (first 120):",
        Array.from(content.slice(0, 120)).map(c => c.charCodeAt(0))
      );
    }
  }

  const uniqueSorted = [...new Set(prices)].sort((a, b) => a - b);

  const cleanedDescription = description.replace(
    /\[\s*PRICE\s*\][\s\S]*?\[\s*\/\s*PRICE\s*\]/gi,
    ""
  ).trim();

  return {
    prices: uniqueSorted,
    hasTBC,
    cleanedDescription,
  };
}

function buildAltText(eventName) {
  if (!eventName) return `Event at ${VENUE_NAME}`;
  return `${eventName} at ${VENUE_NAME}`;
}

function slugify(text = "") {
  return stripEmojis(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-{2,}/g, "-");
}

function formatDateSlug(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ---------------- IMAGE UPLOAD (RAW ONLY) ---------------- */

async function uploadRawFacebookImage(imageUrl, docId) {
  if (!imageUrl) return null;

  const rawPath = `uploads/raw/events/facebook/${docId}.jpg`;
  const optimizedPath = `events/facebook/${docId}.webp`;

  const optimizedFile = bucket.file(optimizedPath);
  const [optimizedExists] = await optimizedFile.exists();

  if (optimizedExists) {
    return optimizedPath;
  }

  console.log(`⬇ Downloading Facebook image for ${docId}`);

  const response = await fetch(imageUrl);
  if (!response.ok) {
    console.error("Failed to fetch image:", imageUrl);
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  const rawFile = bucket.file(rawPath);

  await rawFile.save(buffer, {
    metadata: {
      contentType:
        response.headers.get("content-type") || "image/jpeg",
    },
  });

  console.log(`☁ Uploaded RAW image: ${rawPath}`);

  return optimizedPath;
}

/* ---------------- CORE SYNC ---------------- */

async function syncFacebookEventsCore() {
  console.log("🔁 Starting Facebook event sync");

  const token = FB_PAGE_ACCESS_TOKEN.value();
  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);

  const baseUrl =
    `https://graph.facebook.com/v19.0/2031566960468299/events` +
    `?fields=id,name,description,start_time,end_time,cover,event_times,ticket_uri` +
    `&since=${nowUnix}` +
    `&access_token=${token}`;

  let allEvents = [];
  let nextUrl = baseUrl;

  while (nextUrl) {
    const res = await fetch(nextUrl);
    const fb = await res.json();
    if (!fb.data) throw new Error("Facebook API error");

    allEvents = allEvents.concat(fb.data);
    nextUrl = fb.paging?.next || null;
  }

  console.log(`📥 Events fetched: ${allEvents.length}`);

  let batch = db.batch();
  let operationCount = 0;
  const activeFbIds = new Set();

  for (const event of allEvents) {
    const rawDescription = (event.description || "").replace(/\r\n/g, "\n");
    const cleanedName = stripEmojis(event.name);

    const { prices, hasTBC, cleanedDescription: descWithoutPriceBlock } =
    extractPrices(rawDescription);

    const cleanedDescription = stripEmojis(descWithoutPriceBlock);

    const finalPrices = prices.length ? prices : (hasTBC ? ["TBC"] : []);

    const occurrences = event.event_times?.length
      ? event.event_times
      : [{ start_time: event.start_time, end_time: event.end_time }];

    for (let index = 0; index < occurrences.length; index++) {
      const occ = occurrences[index];
      const start = new Date(occ.start_time);
      if (start < now) continue;

      const end = occ.end_time ? new Date(occ.end_time) : null;
      if (end && end < now) continue;

      const docId =
        occurrences.length > 1
          ? `fb_${event.id}_${index}`
          : `fb_${event.id}`;

      activeFbIds.add(docId);

      const externalImage =
        event.cover?.source ||
        event.cover?.photo?.image?.source ||
        null;

      let storageImagePath = null;

      if (externalImage) {
        storageImagePath = await uploadRawFacebookImage(
          externalImage,
          docId
        );
      }

      const baseSlug = slugify(cleanedName || "event");
      const slug =
        occurrences.length > 1
          ? `${baseSlug}-${formatDateSlug(start)}`
          : baseSlug;

      const ref = db.collection("events").doc(docId);

      batch.set(ref, {
        name: cleanedName,
        slug,
        description: cleanedDescription,
        price: {
          amount: finalPrices,
          denom: null,
        },
        ticket_url: event.ticket_uri || null,
        start_time: admin.firestore.Timestamp.fromDate(start),
        end_time: end
          ? admin.firestore.Timestamp.fromDate(end)
          : null,
        image: storageImagePath
          ? {
              alt: buildAltText(cleanedName),
              type: "storage",
              value: storageImagePath,
            }
          : null,
        source: "facebook",
        type: "one_off",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: "system",
      });

      operationCount++;

      if (operationCount >= 450) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }
  }

  /* -------- Cleanup -------- */

  const snapshot = await db
    .collection("events")
    .where("source", "==", "facebook")
    .get();

  for (const doc of snapshot.docs) {
    if (!activeFbIds.has(doc.id)) {
      const data = doc.data();

      if (data.image?.type === "storage") {
        try {
          await bucket.file(data.image.value).delete();
          console.log(`🗑 Deleted optimized image ${data.image.value}`);
        } catch (err) {
          console.warn("Image delete failed:", err.message);
        }
      }

      batch.delete(doc.ref);
      operationCount++;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  console.log("✅ Facebook sync complete");
}

/* ---------------- TRIGGERS ---------------- */

exports.syncFacebookEvents = onSchedule(
  {
    region: "us-central1",
    schedule: "0 2 * * *",
    timeZone: "Africa/Johannesburg",
    secrets: [FB_PAGE_ACCESS_TOKEN],
  },
  syncFacebookEventsCore
);

exports.syncFacebookEventsNow = onRequest(
  {
    region: "us-central1",
    secrets: [FB_PAGE_ACCESS_TOKEN],
  },
  async (req, res) => {
    await syncFacebookEventsCore();
    res.send("Facebook events sync triggered");
  }
);
