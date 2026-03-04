import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let analyticsSingleton = null;

export async function enableAnalyticsIfAllowed() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  if (analyticsSingleton) return analyticsSingleton;

  const app = getFirebaseApp();

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const supported = await isSupported();
  if (!supported) return null;

  analyticsSingleton = getAnalytics(app);
  return analyticsSingleton;
}