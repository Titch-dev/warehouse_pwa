"use client";

import { useState } from "react";

import PoolSessionTimer from "@/components/pool/pool-session-timer";
import PoolLiveStatusBadge from "@/components/pool/pool-live/pool-live-status-badge";
import ExtendMembershipModal from "@/components/pool/pool-live/extend-membership-modal";

import { getMembershipStatusMeta } from "@/lib/membership";
import { formatDateTime } from "@/lib/datetime";

export default function PoolLiveSessionCard({ session }) {
  const meta = getMembershipStatusMeta(session?.membershipSnapshot);
  const [isExtendOpen, setIsExtendOpen] = useState(false);

  return (
    <>
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

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setIsExtendOpen(true)}
            style={{
              border: "1px solid #444",
              background: "rgba(255,255,255,0.08)",
              color: "inherit",
              borderRadius: "10px",
              padding: "0.65rem 0.95rem",
              cursor: "pointer",
            }}
          >
            Extend membership
          </button>
        </div>

        <p>
          <strong>Started:</strong> {formatDateTime(session?.startedAt)}
        </p>

        <p>
          <strong>Elapsed:</strong>{" "}
          <PoolSessionTimer startedAt={session?.startedAt} />
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

      <ExtendMembershipModal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        session={session}
      />
    </>
  );
}