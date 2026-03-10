"use client";

import RequireRole from "@/components/dashboard/require-role";
import PoolLiveView from "@/components/pool/pool-live/pool-live-view";
import { USER_ROLES } from "@/lib/auth/roles";

export default function PoolLivePage() {
  return (
    <RequireRole
      allowedRoles={[
        USER_ROLES.STAFF,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
      ]}
    >
      <PoolLiveView />
    </RequireRole>
  );
}