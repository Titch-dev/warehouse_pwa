"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

import { warehouseAuth } from "@/firebase/firebaseConfig";
import { createPoolSession } from "@/lib/firestore/pool-sessions";

export default function PoolCheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Checking you in...");

  useEffect(() => {
    let cancelled = false;

    async function runCheckIn(user) {
      if (!user) {
        router.replace("/login?next=/dashboard/pool/check-in");
        return;
      }

      try {
        const tableId = searchParams.get("table");
        const stationId = searchParams.get("station");

        await createPoolSession({
          uid: user.uid,
          checkInSource: {
            type: "qr",
            tableId: tableId || null,
            stationId: stationId || null,
          },
        });

        if (!cancelled) {
          router.replace("/dashboard/pool");
        }
      } catch (error) {
        console.error("[pool check-in] createPoolSession failed", error);

        if (!cancelled) {
          setMessage(error?.message || "Unable to start pool session.");
        }
      }
    }

    const existingUser = warehouseAuth.currentUser;

    if (existingUser) {
      runCheckIn(existingUser);
      return () => {
        cancelled = true;
      };
    }

    const unsubscribe = onAuthStateChanged(warehouseAuth, (user) => {
      runCheckIn(user);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Pool Check-in</h1>
      <p>{message}</p>
    </main>
  );
}