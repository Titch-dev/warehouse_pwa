"use client";

import LogoutButton from "@/components/auth/logout-button";

export default function DashboardTopbar({ userDoc, authUser }) {
  return (
    <header className="dashboard-topbar">
      <div>
        <strong>
          {userDoc?.displayName || authUser?.displayName || authUser?.email || "Dashboard"}
        </strong>
      </div>

      <div className="dashboard-topbar__actions">
        <span>{userDoc?.role || ""}</span>
        <LogoutButton />
      </div>
    </header>
  );
}