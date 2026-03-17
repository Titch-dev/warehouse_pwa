import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "@/firebase/firebaseConfig";

const useEmulators =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

const functionsUsCentral1 = getFunctions(app, "us-central1");
const functionsAfricaSouth1 = getFunctions(app, "africa-south1");

if (useEmulators) {
  connectFunctionsEmulator(functionsUsCentral1, "127.0.0.1", 5001);
  connectFunctionsEmulator(functionsAfricaSouth1, "127.0.0.1", 5001);
}

export const callable = (name) => httpsCallable(functionsUsCentral1, name);
export const callableAfricaSouth1 = (name) =>
  httpsCallable(functionsAfricaSouth1, name);