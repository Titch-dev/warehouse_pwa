"use client";

import { useCurrentUserDoc } from "@/hooks/useCurrentUserDoc";
import { useMembershipAdjustments } from "@/hooks/useMembershipAdjustments";

import { formatDateTime } from "@/lib/datetime";
import { getMembershipStatusMeta } from "@/lib/membership";

import MembershipStatusBadge from "@/components/membership/membership-status-badge";
import MembershipHistoryList from "@/components/membership/membership-history-list";

export default function MembershipView() {
  const { authUser, userDoc, loading, error } = useCurrentUserDoc();

  const {
    adjustments,
    loading: historyLoading,
    error: historyError,
  } = useMembershipAdjustments(authUser?.uid);

  if (loading) {
    return (
      <section>
        <h1>Membership</h1>
        <p>Loading membership...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>Membership</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (!authUser || !userDoc) {
    return null;
  }

  const membershipMeta = getMembershipStatusMeta({
    ...userDoc?.membership,
    status: userDoc?.status,
    suspended: userDoc?.suspended,
  });

  return (
    <section
      style={{
        display: "grid",
        gap: "1rem",
        maxWidth: "820px",
      }}
    >
      <div>
        <h1>Membership</h1>
        <p>View your current membership status and recent changes.</p>
      </div>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "1rem",
          display: "grid",
          gap: "0.9rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>Current status</h2>
          <MembershipStatusBadge
            label={membershipMeta.label}
            tone={membershipMeta.tone}
          />
        </div>

        <p style={{ margin: 0 }}>
          <strong>Expiry date:</strong> {formatDateTime(membershipMeta.expiryDate)}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Days remaining:</strong> {membershipMeta.daysRemaining}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Plan:</strong> {userDoc?.membership?.plan || "—"}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "1rem",
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <h2 style={{ margin: 0 }}>History</h2>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Recent membership changes recorded on your account.
        </p>

        <MembershipHistoryList
          adjustments={adjustments}
          loading={historyLoading}
          error={historyError}
        />
      </div>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "1rem",
          display: "grid",
          gap: "0.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Renewal</h2>
        <p style={{ margin: 0 }}>
          To renew or extend your membership, please visit the bar.
        </p>
        <p style={{ margin: 0, opacity: 0.85 }}>
          In-app renewal can be added later.
        </p>
      </div>
    </section>
  );
}