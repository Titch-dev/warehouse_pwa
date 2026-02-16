const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const fetch = global.fetch;

const FB_PAGE_ACCESS_TOKEN = defineSecret("FB_PAGE_ACCESS_TOKEN");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const BAR_CLOSE_HOUR = 23;
const BAR_CLOSE_MINUTE = 0;
const VENUE_NAME = "Westville Warehouse bar and events venue";

/* ---------------- Utilities ---------------- */

function stripEmojis(text = "") {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractPrices(description = "") {
  const regex = /\[PRICE\]([\s\S]*?)\[\/PRICE\]/gi;

  let match;
  let prices = [];
  let hasTBC = false;

  while ((match = regex.exec(description)) !== null) {
    const content = match[1].trim();

    if (/^tbc$/i.test(content)) {
      hasTBC = true;
      continue;
    }

    const numbers = content.match(/\d+(\.\d+)?/g);
    if (numbers) {
      numbers.forEach(n => prices.push(Number(n)));
    }
  }

  const sortedPrices = prices.sort((a, b) => a - b);

  return {
    prices: sortedPrices,
    hasTBC,
    cleanedDescription: description.replace(regex, "").trim(),
  };
}

function defaultEndTime(start) {
  const end = new Date(start);
  end.setHours(BAR_CLOSE_HOUR, BAR_CLOSE_MINUTE, 0, 0);
  return end;
}

function buildAltText(eventName) {
  if (!eventName) return `Event at ${VENUE_NAME}`;
  return `${eventName} at ${VENUE_NAME}`;
}

/* ---------------- CORE SYNC LOGIC ---------------- */

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

/* ---------- FETCH ALL FUTURE EVENTS (with pagination) ---------- */

  let allEvents = [];
  let nextUrl = baseUrl;

  while (nextUrl) {
    const res = await fetch(nextUrl);
    const fb = await res.json();

    if (!fb.data) {
      console.error("❌ Facebook API error", fb);
      throw new Error("Facebook API returned no data")
    }

    allEvents = allEvents.concat(fb.data);
    nextUrl = fb.paging?.next || null;
  }

console.log(`📥 Facebook events fetched (total): ${allEvents.length}`);

 /* ---------- WRITE TO FIRESTORE (chunked batches) ---------- */

  let batch = db.batch();
  let operationCount = 0;
  const activeFbIds = new Set();

  for (const event of allEvents) {
    const baseDescription = stripEmojis(event.description || "");

   const {
      prices: extractedPrices,
      hasTBC: priceHasTBC,
      cleanedDescription: cleanedDescription,
    } = extractPrices(baseDescription);

  const prices =
      priceHasTBC ? ["TBC"] : extractedPrices;

    const occurrences = event.event_times?.length
      ? event.event_times
      : [{ start_time: event.start_time, end_time: event.end_time }];

    for (let index = 0; index < occurrences.length; index++) {
      const occ = occurrences[index];

      const start = new Date(occ.start_time);
      const end = occ.end_time
        ? new Date(occ.end_time)
        : defaultEndTime(start);

      if (end < now) continue;

      const docId =
        occurrences.length > 1
          ? `fb_${event.id}_${index}`
          : `fb_${event.id}`;

      activeFbIds.add(docId);

      const ref = db.collection("events").doc(docId);

      batch.set(ref, {
        name: event.name,
        description: cleanedDescription,
        prices,
        ticketUrl: event.ticket_uri || null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        imageUrl: 
          event.cover?.source || 
          event.cover?.photo?.image?.source ||
          null,
        alt_image: buildAltText(event.name),
        source: "facebook",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      operationCount++

      // Commit early if nearing 500 batch limit
      if (operationCount >= 450) {
        await batch.commit();
        console.log("⚡ Partial batch committed");
        batch = db.batch();
        operationCount = 0;
      }
    }
  }

/* ---------- CLEAN UP OLD EVENTS ---------- */

  const snapshot = await db
    .collection("events")
    .where("source", "==", "facebook")
    .get();

  snapshot.forEach((doc) => {
    const end = doc.data().end_time
    ? new Date(doc.data().end_time)
    : null;

    if (
      (end && end < now) ||
      !activeFbIds.has(doc.id)
    ) {
        batch.delete(doc.ref);
        operationCount++;
      }
  });

  /* ---------- FINAL COMMIT ---------- */
  if (operationCount > 0) {
    await batch.commit();
  }

  console.log("✅ Facebook events sync complete");
}

/* ---------------- TRIGGERS ---------------- */

exports.syncFacebookEvents = onSchedule(
  {
    schedule: "every 24 hours",
    secrets: [FB_PAGE_ACCESS_TOKEN],
  },
  syncFacebookEventsCore
);

exports.syncFacebookEventsNow = onRequest(
  {
    secrets: [FB_PAGE_ACCESS_TOKEN],
  },
  async (req, res) => {
    await syncFacebookEventsCore();
    res.send("Facebook events sync triggered");
  }
);