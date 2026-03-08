"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserDoc } from "@/hooks/useCurrentUserDoc";
import { ROLE_HOME } from "@/lib/auth/roles";

export default function DashboardClient() {
  const router = useRouter();
  const { authUser, userDoc, loading, error } = useCurrentUserDoc();

  useEffect(() => {
    if (loading) return;
    if (!authUser) return;

    const role = userDoc?.role;
    const destination = ROLE_HOME[role] || "/dashboard/access-denied";

    router.replace(destination);
  }, [authUser, userDoc, loading, router]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading your dashboard…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <p>Redirecting…</p>
    </main>
  );
}