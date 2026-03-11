const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const ALLOWED_ROLES = new Set(["staff", "admin", "owner"]);
const ALLOWED_MONTHS = new Set([1, 3, 12]);
const RECEIPT_REF_MIN_LENGTH = 3;
const RECEIPT_REF_MAX_LENGTH = 60;

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function normalizeReceiptRef(value) {
  if (typeof value !== "string") return null;

  const normalized = value.trim();

  if (!normalized) return null;

  return normalized;
}

function isValidReceiptRef(value) {
  if (!value) return false;

  if (value.length < RECEIPT_REF_MIN_LENGTH) return false;
  if (value.length > RECEIPT_REF_MAX_LENGTH) return false;

  return true;
}

function buildMembershipSnapshot(userData = {}, membership = {}, expiryTs) {
  const suspended = userData?.suspended === true;
  const userStatus = userData?.status ?? "active";
  const isActive = membership?.isActive === true;
  const expiryDate = toDate(expiryTs);
  const now = Date.now();

  const isValid =
    !suspended &&
    userStatus === "active" &&
    isActive &&
    !!expiryDate &&
    expiryDate.getTime() > now;

  return {
    isValid,
    isActive,
    expiresAt: expiryTs ?? null,
    plan: membership?.plan ?? null,
    startDate: membership?.startDate ?? null,
    suspended,
    status: userStatus,
  };
}

const extendMembership = onCall(
  { region: "us-central1" },
  async (request) => {
    try {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Authentication required.");
      }

      const actorUid = request.auth.uid;
      const actorRole = request.auth.token?.role ?? null;

      if (!ALLOWED_ROLES.has(actorRole)) {
        throw new HttpsError(
          "permission-denied",
          "Only staff, admin, or owner can extend memberships."
        );
      }

      const userId = String(request.data?.userId ?? "").trim();
      const monthsAdded = Number(request.data?.monthsAdded);
      const receiptRef = normalizeReceiptRef(request.data?.receiptRef);

      if (!userId) {
        throw new HttpsError("invalid-argument", "userId is required.");
      }

      if (!ALLOWED_MONTHS.has(monthsAdded)) {
        throw new HttpsError(
          "invalid-argument",
          "monthsAdded must be one of: 1, 3, or 12."
        );
      }

      if (!isValidReceiptRef(receiptRef)) {
        throw new HttpsError(
          "invalid-argument",
          "A valid POS receipt reference is required."
        );
      }

      const userRef = db.collection("users").doc(userId);
      const sessionRef = db.collection("pool_sessions").doc(userId);
      const adjustmentRef = db.collection("membership_adjustments").doc();

      logger.info("extendMembership start", {
        userId,
        monthsAdded,
        receiptRef,
        actorUid,
        actorRole,
      });

      const result = await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        const sessionSnap = await tx.get(sessionRef);

        if (!userSnap.exists) {
          throw new HttpsError("not-found", "User profile not found.");
        }

        const userData = userSnap.data() || {};
        const membership = userData?.membership || {};

        logger.info("extendMembership user snapshot", {
          userId,
          hasUser: userSnap.exists,
          hasSession: sessionSnap.exists,
          membership,
        });

        const nowDate = new Date();
        const previousExpiryDate = toDate(membership?.expiry);

        const baseDate =
          previousExpiryDate &&
          previousExpiryDate.getTime() > nowDate.getTime()
            ? previousExpiryDate
            : nowDate;

        const newExpiryDate = addMonths(baseDate, monthsAdded);
        const newExpiryTs = admin.firestore.Timestamp.fromDate(newExpiryDate);

        const nextStartDate =
          membership?.startDate ??
          admin.firestore.Timestamp.fromDate(nowDate);

        const previousExpiryTs = previousExpiryDate
          ? admin.firestore.Timestamp.fromDate(previousExpiryDate)
          : null;

        const hasActiveSession =
          sessionSnap.exists && sessionSnap.data()?.status === "active";

        tx.update(userRef, {
          "membership.expiry": newExpiryTs,
          "membership.isActive": true,
          "membership.startDate": nextStartDate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (hasActiveSession) {
          const nextMembershipSnapshot = buildMembershipSnapshot(
            userData,
            {
              ...membership,
              expiry: newExpiryTs,
              isActive: true,
              startDate: nextStartDate,
            },
            newExpiryTs
          );

          tx.update(sessionRef, {
            membershipSnapshot: nextMembershipSnapshot,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        tx.set(adjustmentRef, {
          userId,
          actorUid,
          actorRole,
          monthsAdded,
          receiptRef,
          previousExpiry: previousExpiryTs,
          newExpiry: newExpiryTs,
          activeSessionPatched: hasActiveSession,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          source: "pool_live_manual_extension",
        });

        return {
          ok: true,
          userId,
          monthsAdded,
          receiptRef,
          previousExpiry: previousExpiryDate
            ? previousExpiryDate.toISOString()
            : null,
          newExpiry: newExpiryDate.toISOString(),
          activeSessionPatched: hasActiveSession,
        };
      });

      logger.info("extendMembership success", result);

      return result;
    } catch (error) {
      logger.error("extendMembership failed", {
        message: error?.message || null,
        stack: error?.stack || null,
        code: error?.code || null,
        data: request?.data || null,
        authUid: request?.auth?.uid || null,
        authRole: request?.auth?.token?.role || null,
      });

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError("internal", "Failed to extend membership.");
    }
  }
);

module.exports = {
  extendMembership,
};