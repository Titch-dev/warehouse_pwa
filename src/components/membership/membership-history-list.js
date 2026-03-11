"use client";

import { formatDateTime } from "@/lib/datetime";

export default function MembershipHistoryList({
  adjustments,
  loading,
  error,
}) {
  if (loading) {
    return <p>Loading membership history...</p>;
  }

  if (error) {
    return <p>Could not load membership history right now.</p>;
  }

  if (!adjustments.length) {
    return <p>No membership history available yet.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      {adjustments.map((item) => (
        <article
          key={item.id}
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "0.9rem 1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Added:</strong> {item.monthsAdded} month
            {item.monthsAdded > 1 ? "s" : ""}
          </p>

          <p style={{ margin: 0 }}>
            <strong>Date:</strong> {formatDateTime(item.createdAt)}
          </p>

          <p style={{ margin: 0 }}>
            <strong>New expiry:</strong> {formatDateTime(item.newExpiry)}
          </p>

          {item.receiptRef ? (
            <p style={{ margin: 0 }}>
              <strong>Receipt ref:</strong> {item.receiptRef}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}