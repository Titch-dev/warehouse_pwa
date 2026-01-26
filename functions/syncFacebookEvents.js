const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

const FB_PAGE_ACCESS_TOKEN = defineSecret("FB_PAGE_ACCESS_TOKEN");
const db = admin.firestore();

const BAR_CLOSE_HOUR = 23;
const BAR_CLOSE_MINUTE = 0;
const VENUE_NAME = "Westville Warehouse bar and events venue";

/* ---------------- Utilities ---------------- */

function stripEmojis(text = "") {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
    ""
  );
}

function extractPrices(description = "") {
  const prices = [];
  const regex = /\[PRICE\]([\s\S]*?)\[\/PRICE\]/gi;

  let match;
  while ((match = regex.exec(description)) !== null) {
    const numbers = match[1].match(/\d+(\.\d+)?/g);
    if (numbers) numbers.forEach(n => prices.push(Number(n)));
  }

  return {
    prices,
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

  const url =
    `https://graph.facebook.com/v19.0/2031566960468299/events` +
    `?fields=id,name,description,start_time,end_time,cover,event_times` +
    `&access_token=${token}`;

  const res = await fetch(url);
  const fb = await res.json();

  if (!fb.data) {
    console.error("❌ Facebook API error", fb);
    return;
  }

  console.log(`📥 Facebook events fetched: ${fb.data.length}`);

  const batch = db.batch();
  const activeFbIds = new Set();

  fb.data.forEach(event => {
    const baseDescription = stripEmojis(event.description || "");
    const { prices, cleanedDescription } = extractPrices(baseDescription);

    const occurrences = event.event_times?.length
      ? event.event_times
      : [{ start_time: event.start_time, end_time: event.end_time }];

    occurrences.forEach((occ, index) => {
      const start = new Date(occ.start_time);
      if (start < now) return;

      const end = occ.end_time
        ? new Date(occ.end_time)
        : defaultEndTime(start);

      if (end < now) return;

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
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        imageUrl: event.cover?.source || 
        event.cover?.photo?.image?.source ||
        null,
        alt_image: buildAltText(event.name),
        source: "facebook",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  });

  const snapshot = await db
    .collection("events")
    .where("source", "==", "facebook")
    .get();

  snapshot.forEach(doc => {
    const end = doc.data().end_time
    ? new Date(doc.data().end_time)
    : null;
    if ((end && end < now) || !activeFbIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  await batch.commit();
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
    region: "africa-south1",
    secrets: [FB_PAGE_ACCESS_TOKEN],
  },
  async (req, res) => {
    await syncFacebookEventsCore();
    res.send("Facebook events sync triggered");
  }
);