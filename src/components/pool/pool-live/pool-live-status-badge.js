"use client";

import { getMembershipBadgeStyles } from "@/lib/membership/membership-status";

export default function PoolLiveStatusBadge({ meta }) {
  const styles = getMembershipBadgeStyles(meta?.tone);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.4rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.875rem",
        fontWeight: 700,
        border: "1px solid",
        ...styles,
      }}
    >
      {meta?.label || "Unknown"}
    </span>
  );
}