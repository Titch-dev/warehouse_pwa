const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { admin, db } = require("../config/firebaseAdmin");
const { deleteStorageFileIfExists } = require("../helpers/storage");
const { requireRole } = require("../helpers/auth");
const {
  actorLabel,
  ensureUniqueSlug,
  validateEventPayload,
} = require("../helpers/events");

const REGION = "us-central1";
const ALLOWED_ROLES = ["admin", "owner"];

exports.createEvent = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const data = request.data || {};
    const payload = validateEventPayload(data, { isUpdate: false });

    if (payload.source === "facebook") {
      throw new Error("Facebook events cannot be created manually.");
    }

    const ref = db.collection("events").doc();
    await ensureUniqueSlug(payload.slug);

    const actorValue = actorLabel(actor);

    await ref.set({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: actorValue,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorValue,
    });

    return {
      ok: true,
      id: ref.id,
      message: "Event created successfully.",
    };
  } catch (error) {
    throw new HttpsError("invalid-argument", error.message || "Create failed.");
  }
});

exports.updateEvent = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { eventId, updates } = request.data || {};
    if (!eventId) throw new Error("eventId is required.");

    const ref = db.collection("events").doc(eventId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Event not found.");

    const existing = snap.data();

    if (existing.source === "facebook") {
      throw new Error("Facebook-synced events are read-only.");
    }

    const payload = validateEventPayload(updates || {}, {
      isUpdate: true,
      existing,
    });

    await ensureUniqueSlug(payload.slug, eventId);

    const oldImagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    const newImagePath =
      payload.image?.type === "storage" ? payload.image?.value || null : null;

    const shouldDeleteOldImage =
      oldImagePath &&
      oldImagePath !== newImagePath;


    await ref.update({
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorLabel(actor),
    });

    if (shouldDeleteOldImage) {
      await deleteStorageFileIfExists(oldImagePath);
    }

    return {
      ok: true,
      id: eventId,
      message: "Event updated successfully.",
    };
  } catch (error) {
    throw new HttpsError("invalid-argument", error.message || "Update failed.");
  }
});

exports.deleteEvent = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { eventId } = request.data || {};
    if (!eventId) throw new Error("eventId is required.");

    const ref = db.collection("events").doc(eventId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Event not found.");

    const existing = snap.data();

    if (existing.type === "weekly") {
      throw new Error("Weekly events cannot be permanently deleted.");
    }

    const imagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    await ref.delete();

    if (imagePath) {
      await deleteStorageFileIfExists(imagePath);
    }

    return {
      ok: true,
      id: eventId,
      deletedBy: actorLabel(actor),
      message: "Event deleted successfully.",
    };
  } catch (error) {
    throw new HttpsError("invalid-argument", error.message || "Delete failed.");
  }
});

exports.syncFacebookEventsNow = onCall(
  {
    region: "africa-south1",
    secrets: [require("../config/env").FB_PAGE_ACCESS_TOKEN],
  },
  async (request) => {
    const actor = await requireRole(request, ALLOWED_ROLES);

    try {
      const { syncFacebookEventsCore } = require("./syncFacebookEvents");
      const result = await syncFacebookEventsCore(actorLabel(actor));

      return {
        ok: true,
        message: "Facebook events sync completed.",
        ...result,
      };
    } catch (error) {
      console.error("syncFacebookEventsNow failed:", error);
      throw new HttpsError(
        "internal",
        error?.message || "Facebook events sync failed."
      );
    }
  }
);