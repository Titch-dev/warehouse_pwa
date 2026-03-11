"use client";

import { useEffect, useState } from "react";

import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth";

import { warehouseAuth } from "@/firebase/firebaseConfig";

import { useActivePoolSession } from "@/hooks/useActivePoolSession";
import PoolSessionTimer from "@/components/pool/pool-session-timer";
import { endPoolSession } from "@/lib/firestore";
import { formatDateTime } from "@/lib/datetime";

function PoolContent() {
  const [user, setUser] = useState(warehouseAuth.currentUser);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [endSessionError, setEndSessionError] = useState("");

  useEffect(() => {
    const unsubscribe = warehouseAuth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  const { session, loading } = useActivePoolSession(user?.uid);

  async function handleEndSession() {
    if (!user?.uid || isEndingSession) return;

    setIsEndingSession(true);
    setEndSessionError("");

    try {
      const result = await endPoolSession(user.uid);

      if (!result?.ended) {
        setEndSessionError(result?.message || "No active session found.");
      }
    } catch (error) {
      setEndSessionError(error?.message || "Unable to end pool session.");
    } finally {
      setIsEndingSession(false);
    }
  }

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

        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={handleEndSession}
            disabled={isEndingSession}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              cursor: isEndingSession ? "not-allowed" : "pointer",
            }}
          >
            {isEndingSession ? "Ending session..." : "End session"}
          </button>
        </div>

        {endSessionError ? (
          <p style={{ marginTop: "0.75rem", color: "#ff6b6b" }}>
            {endSessionError}
          </p>
        ) : null}
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