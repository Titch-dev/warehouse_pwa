function toMillis(value) {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return null;
}

export function getMembershipStatusMeta(snapshot = {}) {
  const expiresAt = snapshot?.expiresAt ?? null;
  const expiresMs = toMillis(expiresAt);

  const suspended = snapshot?.suspended === true;
  const userStatus = snapshot?.status ?? "active";
  const isActive = snapshot?.isActive === true;
  const hasPlan = !!snapshot?.plan;
  const now = Date.now();

  const isExpired = !!expiresMs && expiresMs <= now;
  const hasExpiry = !!expiresMs;

  if (suspended) {
    return {
      key: "suspended",
      label: "Suspended",
      tone: "danger",
      isValid: false,
      action: "Do not allow play",
      detail: "User account is suspended.",
    };
  }

  if (userStatus !== "active") {
    return {
      key: "user_inactive",
      label: "User Disabled",
      tone: "danger",
      isValid: false,
      action: "Investigate account",
      detail: `User status is "${userStatus}".`,
    };
  }

  if (!hasPlan && !hasExpiry && !isActive) {
    return {
      key: "no_membership",
      label: "No Membership",
      tone: "danger",
      isValid: false,
      action: "Ask customer to purchase/renew",
      detail: "No active membership data found.",
    };
  }

  if (!isActive) {
    return {
      key: "membership_inactive",
      label: "Membership Inactive",
      tone: "warning",
      isValid: false,
      action: "Check with manager before allowing",
      detail: "Membership exists but is not marked active.",
    };
  }

  if (!hasExpiry) {
    return {
      key: "missing_expiry",
      label: "Missing Expiry",
      tone: "warning",
      isValid: false,
      action: "Check membership record",
      detail: "Membership has no expiry date.",
    };
  }

  if (isExpired) {
    return {
      key: "expired",
      label: "Expired",
      tone: "danger",
      isValid: false,
      action: "Ask customer to renew",
      detail: "Membership expiry date has passed.",
    };
  }

  return {
    key: "valid",
    label: "Valid",
    tone: "success",
    isValid: true,
    action: "OK to play",
    detail: "Membership is active and in date.",
  };
}

export function getBadgeStyles(tone) {
  if (tone === "success") {
    return {
      borderColor: "#1f7a1f",
      background: "rgba(31, 122, 31, 0.14)",
      color: "#b9f5b9",
    };
  }

  if (tone === "warning") {
    return {
      borderColor: "#b7791f",
      background: "rgba(183, 121, 31, 0.14)",
      color: "#f6d29a",
    };
  }

  return {
    borderColor: "#a33a3a",
    background: "rgba(163, 58, 58, 0.14)",
    color: "#ffb3b3",
  };
}