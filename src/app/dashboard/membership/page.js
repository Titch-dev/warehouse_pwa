"use client";

import RequireRole from "@/components/dashboard/require-role";
import MembershipView from "@/components/membership/membership-view";
import { USER_ROLES } from "@/lib/auth";

export default function MembershipPage() {
  return (
    <RequireRole allowedRoles={[USER_ROLES.CUSTOMER]}>
      <MembershipView />
    </RequireRole>
  );
}