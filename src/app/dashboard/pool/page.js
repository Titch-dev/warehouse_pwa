"use client";

import { useEffect, useState } from "react";

import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

import { warehouseAuth } from "@/firebase/firebaseConfig";

import { useActivePoolSession } from "@/hooks/useActivePoolSession";
import PoolSessionTimer from "@/components/pool/pool-session-timer";

function formatDateTime(value) {
  if (!value) return "—";

  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
      ? value
      : null;

  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function PoolContent() {
  const [user, setUser] = useState(warehouseAuth.currentUser);

  useEffect(() => {
    const unsubscribe = warehouseAuth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  const { session, loading } = useActivePoolSession(user?.uid);

  if (loading) {
    return (
      <section>
        <h1>Pool</h1>
        <p>Loading pool session...</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section>
        <h1>Pool</h1>
        <p>You are not currently in a pool session.</p>
        <p>Scan the pool QR code to begin.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Pool</h1>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "1rem",
          maxWidth: "520px",
        }}
      >
        <h2>Active Session</h2>

        <p>
          <strong>Status:</strong> Active
        </p>

        <p>
          <strong>Started:</strong> {formatDateTime(session.startedAt)}
        </p>

        <p>
          <strong>Elapsed:</strong>{" "}
          <PoolSessionTimer startedAt={session.startedAt} />
        </p>

        <p>
          <strong>Membership valid at check-in:</strong>{" "}
          {session?.membershipSnapshot?.isValid ? "Yes" : "No"}
        </p>

        <p>
          <strong>Membership expiry snapshot:</strong>{" "}
          {formatDateTime(session?.membershipSnapshot?.expiresAt)}
        </p>
      </div>
    </section>
  );
}

export default function PoolPage() {
  return (
    <RequireRole allowedRoles={[USER_ROLES.CUSTOMER]}>
      <PoolContent />
    </RequireRole>
  );
}