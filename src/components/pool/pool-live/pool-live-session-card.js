"use client";

import PoolSessionTimer from "@/components/pool/pool-session-timer";
import PoolLiveStatusBadge from "@/components/pool/pool-live/pool-live-status-badge";
import { getMembershipStatusMeta } from "@/lib/pool/pool-live-status";
import { formatDateTime } from "@/lib/date/format-date-time";

export default function PoolLiveSessionCard({ session }) {
  const meta = getMembershipStatusMeta(session?.membershipSnapshot);

  return (
    <article
      style={{
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "1rem",
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {session?.userSnapshot?.displayName || "Unnamed member"}
          </h2>

          <p style={{ margin: "0.35rem 0 0 0" }}>
            <strong>Email:</strong> {session?.userSnapshot?.email || "—"}
          </p>
        </div>
        <PoolLiveStatusBadge meta={meta} />
      </div>

      <div
        style={{
          padding: "0.75rem 0.9rem",
          borderRadius: "10px",
          border: "1px solid #2f2f2f",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Staff action:</strong> {meta.action}
        </p>

        <p style={{ margin: "0.35rem 0 0 0", opacity: 0.85 }}>
          {meta.detail}
        </p>
      </div>

      <p>
        <strong>Started:</strong> {formatDateTime(session?.startedAt)}
      </p>

      <p>
        <strong>Elapsed:</strong> <PoolSessionTimer startedAt={session?.startedAt} />
      </p>

      <p>
        <strong>Expiry:</strong>{" "}
        {formatDateTime(session?.membershipSnapshot?.expiresAt)}
      </p>

      <p>
        <strong>Plan:</strong> {session?.membershipSnapshot?.plan || "—"}
      </p>

      <p>
        <strong>Membership active flag:</strong>{" "}
        {session?.membershipSnapshot?.isActive ? "Yes" : "No"}
      </p>

      <p>
        <strong>User suspended:</strong>{" "}
        {session?.membershipSnapshot?.suspended ? "Yes" : "No"}
      </p>

      <p>
        <strong>User status:</strong>{" "}
        {session?.membershipSnapshot?.status || "—"}
      </p>

      <p>
        <strong>Check-in source:</strong> {session?.checkInSource?.type || "—"}
      </p>

      <p>
        <strong>Table:</strong>{" "}
        {session?.checkInSource?.tableId || "General pool area"}
      </p>
    </article>
  );
}