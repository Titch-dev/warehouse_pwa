"use client";

import DashboardSidebar from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";

export default function DashboardShell({ authUser, userDoc, children }) {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar role={userDoc?.role} />

      <div className="dashboard-shell__main">
        <DashboardTopbar authUser={authUser} userDoc={userDoc} />
        <main className="dashboard-shell__content">{children}</main>
      </div>
    </div>
  );
}