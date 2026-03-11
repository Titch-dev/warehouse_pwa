"use client";

import { getMembershipBadgeStyles } from "@/lib/membership";

export default function MembershipStatusBadge({ label, tone }) {
  const styles = getMembershipBadgeStyles(tone);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.45rem 0.8rem",
        borderRadius: "999px",
        fontSize: "0.875rem",
        fontWeight: 700,
        border: "1px solid",
        ...styles,
      }}
    >
      {label}
    </span>
  );
}