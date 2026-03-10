"use client";

import { useEffect, useState } from "react";
import { subscribeToAllActivePoolSessions } from "@/lib/firestore/pool-sessions";

export function useActivePoolSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllActivePoolSessions(
      (nextSessions) => {
        setSessions(nextSessions);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to subscribe to active pool sessions:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { sessions, loading, error };
}