"use client";

import { useAuth } from "@/components/auth/auth-provider";
import LogoutButton from "@/components/auth/logout-button";

export default function DashboardClient() {
  const { user } = useAuth();

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {user?.email}</p>
      <LogoutButton />
    </main>
  );
}