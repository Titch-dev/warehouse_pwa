import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// TEMPORARY: force emulator mode while debugging
const useEmulators = true;

console.log("🔥 Firebase emulator mode:", useEmulators);

const firestoreSettings = {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
};

if (useEmulators) {
  firestoreSettings.host = "127.0.0.1:8080";
  firestoreSettings.ssl = false;
}

const warehouseDb = initializeFirestore(app, firestoreSettings);
const warehouseStorage = getStorage(app);
const warehouseAuth = getAuth(app);
const functions = getFunctions(app, "us-central1");

if (useEmulators) {
  connectAuthEmulator(warehouseAuth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  connectStorageEmulator(warehouseStorage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export {
  app,
  warehouseDb,
  warehouseStorage,
  warehouseAuth,
  functions,
};