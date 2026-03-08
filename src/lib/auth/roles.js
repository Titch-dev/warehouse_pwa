export const USER_ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin",
  OWNER: "owner",
};

export const ROLE_HOME = {
  [USER_ROLES.CUSTOMER]: "/dashboard/membership",
  [USER_ROLES.STAFF]: "/dashboard/pool-live",
  [USER_ROLES.ADMIN]: "/dashboard/cms",
  [USER_ROLES.OWNER]: "/dashboard/admin",
};

export const ROLE_NAV = {
  [USER_ROLES.CUSTOMER]: [
    { label: "Membership", href: "/dashboard/membership" },
    { label: "Pool", href: "/dashboard/pool" },
  ],
  [USER_ROLES.STAFF]: [
    { label: "Pool Live", href: "/dashboard/pool-live" },
  ],
  [USER_ROLES.ADMIN]: [
    { label: "CMS", href: "/dashboard/cms" },
  ],
  [USER_ROLES.OWNER]: [
    { label: "Owner Admin", href: "/dashboard/admin" },
    { label: "CMS", href: "/dashboard/cms" },
    { label: "Pool Live", href: "/dashboard/pool-live" },
  ],
};

export function hasRequiredRole(userRole, allowedRoles = []) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}