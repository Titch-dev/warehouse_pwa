"use client";

import RequireAuth from "@/components/auth/require-auth";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { useCurrentUserDoc } from "@/hooks/useCurrentUserDoc";

export default function DashboardLayout({ children }) {
  const { authUser, userDoc, loading, error } = useCurrentUserDoc();

  return (
    <RequireAuth>
      {loading ? (
        <div style={{ padding: 24 }}>Loading dashboard…</div>
      ) : error ? (
        <div style={{ padding: 24 }}>{error}</div>
      ) : (
        <DashboardShell authUser={authUser} userDoc={userDoc}>
          {children}
        </DashboardShell>
      )}
    </RequireAuth>
  );
}