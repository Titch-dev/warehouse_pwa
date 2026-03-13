const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebaseAdmin");
const { requireRole } = require("../helpers/auth");
const {
  actorLabel,
  buildMenuMiscDocId,
  ensureUniqueMenuMiscDoc,
  validateMenuMiscPayload,
} = require("../helpers/menu-misc");

const REGION = "us-central1";
const ALLOWED_ROLES = ["admin", "owner"];

exports.createMenuMisc = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const payload = validateMenuMiscPayload(request.data || {});
    await ensureUniqueMenuMiscDoc(payload);

    const docId = buildMenuMiscDocId(payload);
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
      message: "Menu misc document created successfully.",
    };
  } catch (error) {
    console.error("createMenuMisc failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Create failed.");
  }
});

exports.updateMenuMisc = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { menuId, updates } = request.data || {};
    if (!menuId) throw new Error("menuId is required.");

    const ref = db.collection("menu").doc(menuId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Menu misc document not found.");

    const existing = snap.data();
    const payload = validateMenuMiscPayload(updates || {});

    if (existing.entityType !== payload.entityType) {
      throw new Error("Entity type cannot be changed.");
    }

    await ensureUniqueMenuMiscDoc(payload, menuId);

    const nextDocId = buildMenuMiscDocId(payload);
    const actorValue = actorLabel(actor);

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

    return {
      ok: true,
      id: nextDocId,
      message: "Menu misc document updated successfully.",
    };
  } catch (error) {
    console.error("updateMenuMisc failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Update failed.");
  }
});

exports.deleteMenuMisc = onCall({ region: REGION }, async (request) => {
  const actor = await requireRole(request, ALLOWED_ROLES);

  try {
    const { menuId } = request.data || {};
    if (!menuId) throw new Error("menuId is required.");

    const ref = db.collection("menu").doc(menuId);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("Menu misc document not found.");

    await ref.delete();

    return {
      ok: true,
      id: menuId,
      deletedBy: actorLabel(actor),
      message: "Menu misc document deleted successfully.",
    };
  } catch (error) {
    console.error("deleteMenuMisc failed:", error);
    throw new HttpsError("invalid-argument", error.message || "Delete failed.");
  }
});