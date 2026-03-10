"use client";

import { useEffect, useState } from "react";
import { subscribeToActivePoolSession } from "@/lib/firestore/pool-sessions";

export function useActivePoolSession(uid) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(!!uid);

  useEffect(() => {
    if (!uid) {
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToActivePoolSession(uid, (nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { session, loading };
}