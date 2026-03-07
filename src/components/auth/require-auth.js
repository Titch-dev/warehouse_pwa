"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function RequireAuth({ children }) {
  const { user, authReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      const qs = searchParams?.toString();
      const current = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/login?next=${encodeURIComponent(current)}`);
    }
  }, [authReady, user, router, pathname, searchParams]);

  if (!authReady) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!user) return null; // while redirecting
  return children;
}