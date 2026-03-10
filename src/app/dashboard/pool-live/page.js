"use client";

import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

import { useActivePoolSessions } from "@/hooks/useActivePoolSessions";
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

function PoolLiveContent() {
  const { sessions, loading } = useActivePoolSessions();

  if (loading) {
    return (
      <section>
        <h1>Pool Live</h1>
        <p>Loading active sessions...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Pool Live</h1>
      <p>
        <strong>Currently active:</strong> {sessions.length}
      </p>

      {sessions.length === 0 ? (
        <p>No active pool sessions right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "760px",
          }}
        >
          {sessions.map((session) => (
            <article
              key={session.id}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "1rem",
              }}
            >
              <h2>{session?.userSnapshot?.displayName || "Unnamed member"}</h2>

              <p>
                <strong>Email:</strong> {session?.userSnapshot?.email || "—"}
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

              <p>
                <strong>Plan:</strong>{" "}
                {session?.membershipSnapshot?.plan || "—"}
              </p>

              <p>
                <strong>Table:</strong>{" "}
                {session?.checkInSource?.tableId || "General pool area"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PoolLivePage() {
  return (
    <RequireRole allowedRoles={[USER_ROLES.STAFF, USER_ROLES.OWNER]}>
      <PoolLiveContent />
    </RequireRole>
  );
}