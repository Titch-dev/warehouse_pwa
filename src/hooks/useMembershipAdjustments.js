"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { warehouseDb } from "@/firebase/firebaseConfig";

export function useMembershipAdjustments(userId, maxItems = 10) {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setAdjustments([]);
      setLoading(false);
      setError(null);
      return;
    }

    const q = query(
      collection(warehouseDb, "membership_adjustments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(maxItems)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setAdjustments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to load membership adjustments:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, maxItems]);

  return { adjustments, loading, error };
}