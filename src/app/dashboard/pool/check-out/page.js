"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import { warehouseAuth } from "@/firebase/firebaseConfig";
import { endPoolSession } from "@/lib/firestore";

export default function PoolCheckOutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Checking you out...");

  useEffect(() => {
    let cancelled = false;

    async function runCheckOut(user) {
      if (!user) {
        router.replace("/login?next=/dashboard/pool/check-out");
        return;
      }

      try {
        const result = await endPoolSession(user.uid);

        if (!cancelled) {
          if (result?.ended) {
            router.replace("/dashboard/pool");
          } else {
            setMessage(result?.message || "No active session found.");
          }
        }
      } catch (error) {
        console.error("[pool check-out] endPoolSession failed", error);

        if (!cancelled) {
          setMessage(error?.message || "Unable to end pool session.");
        }
      }
    }

    const existingUser = warehouseAuth.currentUser;

    if (existingUser) {
      runCheckOut(existingUser);
      return () => {
        cancelled = true;
      };
    }

    const unsubscribe = onAuthStateChanged(warehouseAuth, (user) => {
      runCheckOut(user);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Pool Check-out</h1>
      <p>{message}</p>
    </main>
  );
}