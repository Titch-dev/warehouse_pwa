import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { warehouseDb } from "@/firebase/firebaseConfig";

export function getUserDocRef(uid) {
  return doc(warehouseDb, "users", uid);
}

export function buildUserDoc(authUser, overrides = {}) {
  return {
    uid: authUser.uid,
    displayName: authUser.displayName ?? null,
    email: authUser.email ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    role: "customer",
    status: "active",
    membership: {
      plan: null,
      startDate: null,
      expiry: null,
      isActive: false,
    },
    ...overrides,
  };
}

export async function getUserDoc(uid) {
  if (!uid) return null;

  const snapshot = await getDoc(getUserDocRef(uid));

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function createUserDoc(authUser, overrides = {}) {
  if (!authUser?.uid) {
    throw new Error("Cannot create user document without a valid auth user.");
  }

  const ref = getUserDocRef(authUser.uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    return {
      id: existing.id,
      ...existing.data(),
    };
  }

  const payload = buildUserDoc(authUser, overrides);
  await setDoc(ref, payload);

  const created = await getDoc(ref);

  return created.exists()
    ? { id: created.id, ...created.data() }
    : null;
}

export async function ensureUserDoc(authUser, overrides = {}) {
  if (!authUser?.uid) return null;

  const existing = await getUserDoc(authUser.uid);

  if (existing) {
    return existing;
  }

  return await createUserDoc(authUser, overrides);
}

export async function updateUserLoginMeta(uid, extraFields = {}) {
  if (!uid) {
    throw new Error("Cannot update user login metadata without uid.");
  }

  const ref = getUserDocRef(uid);

  await setDoc(
    ref,
    {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extraFields,
    },
    { merge: true }
  );
}