"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { getUserDoc } from "@/lib/firestore";

export function useCurrentUserDoc() {
  const { user, authReady } = useAuth();

  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUserDoc() {
      if (!authReady) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        if (!user) {
          if (!cancelled) {
            setUserDoc(null);
            setLoading(false);
          }
          return;
        }

        const doc = await getUserDoc(user.uid);

        if (!cancelled) {
          setUserDoc(doc);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load user document:", err);

        if (!cancelled) {
          setError("Unable to load your profile.");
          setUserDoc(null);
          setLoading(false);
        }
      }
    }

    loadUserDoc();

    return () => {
      cancelled = true;
    };
  }, [user, authReady]);

  return {
    authUser: user,
    userDoc,
    loading: !authReady || loading,
    error,
  };
}