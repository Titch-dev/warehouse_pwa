import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/firebase/firebaseConfig";

export const functionsUsCentral1 = getFunctions(app, "us-central1");
export const functionsAfricaSouth1 = getFunctions(app, "africa-south1");

export const callable = (name) => httpsCallable(functionsUsCentral1, name);
export const callableAfricaSouth1 = (name) =>
  httpsCallable(functionsAfricaSouth1, name);