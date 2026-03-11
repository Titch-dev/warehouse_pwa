"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasRequiredRole } from "@/lib/auth";
import { useCurrentUserDoc } from "@/hooks/useCurrentUserDoc";

export default function RequireRole({ allowedRoles = [], children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, userDoc, loading, error } = useCurrentUserDoc();

  useEffect(() => {
    if (loading) return;
    if (!authUser) return; // RequireAuth should already handle this

    const role = userDoc?.role;

    if (!role || !hasRequiredRole(role, allowedRoles)) {
      router.replace(
        `/dashboard/access-denied?from=${encodeURIComponent(pathname)}`
      );
    }
  }, [authUser, userDoc, loading, allowedRoles, pathname, router]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading dashboard access…</div>;
  }

  if (error) {
    return <div style={{ padding: 24 }}>{error}</div>;
  }

  if (!authUser) return null;
  if (!userDoc?.role) return null;
  if (!hasRequiredRole(userDoc.role, allowedRoles)) return null;

  return children;
}