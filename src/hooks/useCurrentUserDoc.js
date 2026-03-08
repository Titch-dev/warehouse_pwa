"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { warehouseAuth } from "@/firebase/firebaseConfig";
import { getOrCreateUserDoc } from "@/lib/firestore/users";

export function useCurrentUserDoc() {
  const [authUser, setAuthUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(warehouseAuth, async (user) => {
      setLoading(true);
      setError("");

      try {
        setAuthUser(user);

        if (!user) {
          setUserDoc(null);
          setLoading(false);
          return;
        }

        const doc = await getOrCreateUserDoc(user);
        setUserDoc(doc);
      } catch (err) {
        console.error("Failed to load user document:", err);
        setError("Unable to load your profile.");
        setUserDoc(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    userDoc,
    loading,
    error,
  };
}