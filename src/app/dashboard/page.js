import RequireAuth from "@/components/auth/require-auth";
import DashboardClient from "./dashboard-client";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardClient />
    </RequireAuth>
  );
}