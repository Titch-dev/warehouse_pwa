import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { warehouseAuth } from "@/firebase/firebaseConfig";
import { googleProvider } from "./auth-providers";
import {
  createUserDoc,
  ensureUserDoc,
  updateUserLoginMeta,
} from "@/lib/firestore/users";

export async function signInWithEmail({ email, password }) {
  const result = await signInWithEmailAndPassword(
    warehouseAuth,
    email,
    password
  );

  await ensureUserDoc(result.user);

  await updateUserLoginMeta(result.user.uid, {
    displayName: result.user.displayName ?? null,
    email: result.user.email ?? null,
  });

  return result.user;
}

export async function signUpWithEmail({ name, email, password }) {
  const result = await createUserWithEmailAndPassword(
    warehouseAuth,
    email,
    password
  );

  const trimmedName = name.trim();

  if (trimmedName) {
    await updateProfile(result.user, {
      displayName: trimmedName,
    });
  }

  const authUserForDoc = {
    ...result.user,
    displayName: trimmedName || result.user.displayName || null,
  };

  await createUserDoc(authUserForDoc);

  return result.user;
}

export async function sendResetPasswordEmail(email) {
  await sendPasswordResetEmail(warehouseAuth, email);
}

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(warehouseAuth, googleProvider);

  await ensureUserDoc(result.user);

  await updateUserLoginMeta(result.user.uid, {
    displayName: result.user.displayName ?? null,
    email: result.user.email ?? null,
  });

  return result.user;
}