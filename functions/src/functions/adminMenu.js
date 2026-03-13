const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebaseAdmin");
const { requireRole } = require("../helpers/auth");
const { deleteStorageFileIfExists } = require("../helpers/storage");
const {
  actorLabel,
  buildMenuDocId,
  ensureUniqueMenuSlug,
  validateMenuItemPayload,
} = require("../helpers/menu");

const REGION = "us-central1";
const ALLOWED_ROLES = ["admin", "owner"];

exports.createMenuItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const payload = validateMenuItemPayload(request.data || {});
    await ensureUniqueMenuSlug(payload);

    const docId = buildMenuDocId(payload);
    const actorValue = actorLabel(actor);

    await db.collection("menu").doc(docId).set({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorValue,
    });

    return {
      ok: true,
      id: docId,
      message: "Menu item created successfully.",
    };
  } catch (error) {
    console.error("createMenuItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Create failed.");
  }
});

exports.updateMenuItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { menuId, updates } = request.data || {};
    if (!menuId) throw new Error("menuId is required.");

    const ref = db.collection("menu").doc(menuId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Menu item not found.");

    const existing = snap.data();

    if (existing.entityType !== "item") {
      throw new Error("This editor only supports standard menu items.");
    }

    const payload = validateMenuItemPayload(updates || {});
    await ensureUniqueMenuSlug(payload, menuId);

    const nextDocId = buildMenuDocId(payload);
    const actorValue = actorLabel(actor);

    const oldImagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    const newImagePath =
      payload.image?.type === "storage" ? payload.image?.value || null : null;

    const shouldDeleteOldImage =
      oldImagePath &&
      oldImagePath !== newImagePath;

    const writeData = {
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: actorValue,
    };

    if (nextDocId === menuId) {
      await ref.update(writeData);
    } else {
      await db.collection("menu").doc(nextDocId).set({
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
      message: "Menu item updated successfully.",
    };
  } catch (error) {
    console.error("updateMenuItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Update failed.");
  }
});

exports.deleteMenuItem = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { menuId } = request.data || {};
    if (!menuId) throw new Error("menuId is required.");

    const ref = db.collection("menu").doc(menuId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Menu item not found.");

    const existing = snap.data();
    if (existing.entityType !== "item") {
      throw new Error("This delete action only supports standard menu items.");
    }

    const imagePath =
      existing.image?.type === "storage" ? existing.image?.value || null : null;

    await ref.delete();

    if (imagePath) {
      await deleteStorageFileIfExists(imagePath);
    }

    return {
      ok: true,
      id: menuId,
      deletedBy: actorLabel(actor),
      message: "Menu item deleted successfully.",
    };
  } catch (error) {
    console.error("deleteMenuItem failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Delete failed.");
  }
});