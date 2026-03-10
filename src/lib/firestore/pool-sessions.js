import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { warehouseDb } from "@/firebase/firebaseConfig";

function toMillis(value) {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return null;
}

function getPoolSessionDocId(uid) {
  return uid;
}

function getPoolSessionRef(uid) {
  return doc(warehouseDb, "pool_sessions", getPoolSessionDocId(uid));
}

export function getMembershipSnapshotFromUserDoc(userData = {}) {
  const membership = userData?.membership || {};

  const expiry = membership?.expiry ?? null;
  const expiryMs = toMillis(expiry);

  const isActive = membership?.isActive === true;
  const suspended = userData?.suspended === true;
  const status = userData?.status ?? "active";
  const now = Date.now();

  const isValid = !suspended && isActive && !!expiryMs && expiryMs > now;

  return {
    isValid,
    isActive,
    expiresAt: expiry,
    plan: membership?.plan ?? null,
    startDate: membership?.startDate ?? null,
    suspended,
    status,
  };
}

export async function getUserProfile(uid) {
  const ref = doc(warehouseDb, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("User profile not found.");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}

export async function getPoolSession(uid) {
  if (!uid) return null;

  const ref = getPoolSessionRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}

export async function getActivePoolSession(uid) {
  if (!uid) return null;

  const ref = getPoolSessionRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  if (data?.status !== "active") return null;

  return {
    id: snap.id,
    ...data,
  };
}

export async function createPoolSession({
  uid,
  checkInSource = { type: "qr" },
}) {
  if (!uid) {
    throw new Error("Authenticated user required.");
  }

  const sessionRef = getPoolSessionRef(uid);
  const existingSnap = await getDoc(sessionRef);

  if (existingSnap.exists()) {
    const existingData = existingSnap.data();

    if (existingData?.status === "active") {
      return {
        id: existingSnap.id,
        ...existingData,
      };
    }
  }

  const userProfile = await getUserProfile(uid);
  const membershipSnapshot = getMembershipSnapshotFromUserDoc(userProfile);

  const payload = {
    userId: uid,
    status: "active",

    startedAt: serverTimestamp(),
    endedAt: null,
    endReason: null,

    membershipSnapshot,

    checkInSource: {
      type: checkInSource?.type || "qr",
      tableId: checkInSource?.tableId || null,
      stationId: checkInSource?.stationId || null,
    },

    userSnapshot: {
      displayName: userProfile?.displayName || userProfile?.name || "",
      email: userProfile?.email || "",
      role: userProfile?.role || "customer",
    },

    createdAt: existingSnap.exists()
      ? (existingSnap.data()?.createdAt ?? serverTimestamp())
      : serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  await setDoc(sessionRef, payload, { merge: false });

  const createdSnap = await getDoc(sessionRef);

  return {
    id: createdSnap.id,
    ...createdSnap.data(),
  };
}

export async function endPoolSession(uid) {
  if (!uid) {
    throw new Error("Authenticated user required.");
  }

  const sessionRef = getPoolSessionRef(uid);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    return {
      ended: false,
      message: "No pool session found.",
    };
  }

  const sessionData = sessionSnap.data();

  if (sessionData?.userId !== uid) {
    throw new Error("You can only end your own session.");
  }

  if (sessionData?.status !== "active") {
    return {
      ended: false,
      message: "No active session found.",
    };
  }

  await updateDoc(sessionRef, {
    status: "ended",
    endedAt: serverTimestamp(),
    endReason: "customer",
    updatedAt: serverTimestamp(),
  });

  return {
    ended: true,
    message: "Pool session ended.",
  };
}

export function subscribeToPoolSession(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }

  const ref = getPoolSessionRef(uid);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snap.id,
      ...snap.data(),
    });
  });
}

export function subscribeToActivePoolSession(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }

  const ref = getPoolSessionRef(uid);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    const data = snap.data();

    if (data?.status !== "active") {
      callback(null);
      return;
    }

    callback({
      id: snap.id,
      ...data,
    });
  });
}

export function subscribeToAllActivePoolSessions(callback) {
  const q = query(
    collection(warehouseDb, "pool_sessions"),
    where("status", "==", "active"),
    orderBy("startedAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const sessions = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    callback(sessions);
  });
}