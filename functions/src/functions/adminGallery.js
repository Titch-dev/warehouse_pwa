const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebaseAdmin");
const { requireRole } = require("../helpers/auth");
const { actorLabel, validateGalleryPayload } = require("../helpers/gallery");
const { deleteStorageFileIfExists } = require("../helpers/storage");

const REGION = "africa-south1";
const ALLOWED_ROLES = ["admin", "owner"];

exports.createGalleryItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const payload = validateGalleryPayload(request.data || {});
    const actorValue = actorLabel(actor);

    const ref = db.collection("gallery").doc();

    await ref.set({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorValue,
    });

    return {
      ok: true,
      id: ref.id,
      message: "Gallery item created successfully.",
    };
  } catch (error) {
    console.error("createGalleryItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Create failed.");
  }
});

exports.updateGalleryItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { galleryId, updates } = request.data || {};
    if (!galleryId) throw new Error("galleryId is required.");

    const ref = db.collection("gallery").doc(galleryId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Gallery item not found.");

    const existing = snap.data();
    const payload = validateGalleryPayload(updates || {});
    const actorValue = actorLabel(actor);

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
      updatedBy: actorValue,
    });

    if (shouldDeleteOldImage) {
      await deleteStorageFileIfExists(oldImagePath);
    }

    return {
      ok: true,
      id: galleryId,
      message: "Gallery item updated successfully.",
    };
  } catch (error) {
    console.error("updateGalleryItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Update failed.");
  }
});

exports.deleteGalleryItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { galleryId } = request.data || {};
    if (!galleryId) throw new Error("galleryId is required.");

    const ref = db.collection("gallery").doc(galleryId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Gallery item not found.");

    const existing = snap.data();

    const imagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    await ref.delete();

    if (imagePath) {
      await deleteStorageFileIfExists(imagePath);
    }

    return {
      ok: true,
      id: galleryId,
      deletedBy: actorLabel(actor),
      message: "Gallery item deleted successfully.",
    };
  } catch (error) {
    console.error("deleteGalleryItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Delete failed.");
  }
});