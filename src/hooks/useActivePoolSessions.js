"use client";

import { useEffect, useState } from "react";
import { subscribeToAllActivePoolSessions } from "@/lib/firestore/pool-sessions";

export function useActivePoolSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllActivePoolSessions((nextSessions) => {
      setSessions(nextSessions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { sessions, loading };
}