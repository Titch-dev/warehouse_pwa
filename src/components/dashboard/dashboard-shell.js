"use client";

import DashboardSidebar from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";
import styles from "./dashboard-shell.module.css"

export default function DashboardShell({ authUser, userDoc, children }) {
  return (
    <div className={styles.shell}>
      <DashboardSidebar role={userDoc?.role} />

      <div>
        <DashboardTopbar authUser={authUser} userDoc={userDoc} />
        <main>{children}</main>
      </div>
    </div>
  );
}