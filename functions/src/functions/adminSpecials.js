const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebaseAdmin");
const { requireRole } = require("../helpers/auth");
const {
  actorLabel,
  buildSpecialDocId,
  ensureUniqueSpecialSlug,
  validateSpecialPayload,
} = require("../helpers/specials");
const { deleteStorageFileIfExists } = require("../helpers/storage");

const REGION = "us-central1";
const ALLOWED_ROLES = ["admin", "owner"];

exports.createSpecial = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const payload = validateSpecialPayload(request.data || {});
    await ensureUniqueSpecialSlug(payload);

    const docId = buildSpecialDocId(payload);
    const actorValue = actorLabel(actor);

    await db.collection("specials").doc(docId).set({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorValue,
    });

    return {
      ok: true,
      id: docId,
      message: "Special created successfully.",
    };
  } catch (error) {
    console.error("createSpecial failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Create failed.");
  }
});

exports.updateSpecial = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { specialId, updates } = request.data || {};
    if (!specialId) throw new Error("specialId is required.");

    const ref = db.collection("specials").doc(specialId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Special not found.");

    const existing = snap.data();
    const payload = validateSpecialPayload(updates || {});
    await ensureUniqueSpecialSlug(payload, specialId);

    const nextDocId = buildSpecialDocId(payload);
    const actorValue = actorLabel(actor);

    const oldImagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    const newImagePath =
      payload.image?.type === "storage" ? payload.image?.value || null : null;

    const shouldDeleteOldImage =
      oldImagePath &&
      newImagePath &&
      oldImagePath !== newImagePath;

    if (nextDocId === specialId) {
      await ref.update({
        ...payload,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: actorValue,
      });
    } else {
      await db.collection("specials").doc(nextDocId).set({
        ...existing,
        ...payload,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: actorValue,
      });
      await ref.delete();
    }

    if (shouldDeleteOldImage) {
      await deleteStorageFileIfExists(oldImagePath);
    }

    return {
      ok: true,
      id: nextDocId,
      message: "Special updated successfully.",
    };
  } catch (error) {
    console.error("updateSpecial failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Update failed.");
  }
});

exports.deleteSpecial = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { specialId } = request.data || {};
    if (!specialId) throw new Error("specialId is required.");

    const ref = db.collection("specials").doc(specialId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Special not found.");

    const existing = snap.data();
    const imagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    await ref.delete();

    if (imagePath) {
      await deleteStorageFileIfExists(imagePath);
    }

    return {
      ok: true,
      id: specialId,
      deletedBy: actorLabel(actor),
      message: "Special deleted successfully.",
    };
  } catch (error) {
    console.error("deleteSpecial failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Delete failed.");
  }
});