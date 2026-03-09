import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/firebase/firebaseConfig";

export const functions = getFunctions(app);
export const callable = (name) => httpsCallable(functions, name);