"use client";

import { useState } from "react";
import { callable } from "@/lib/firebase/functions";
import styles from "./user-detail-panel.module.css";

const ROLE_OPTIONS = ["customer", "staff", "admin", "owner"];

function formatDate(value) {
  const date = value?.toDate?.() || null;
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function UserDetailPanel({ user, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRoleChange(nextRole) {
    if (!user?.id || !nextRole || nextRole === user.role) return;

    try {
      setBusy(true);
      setError("");

      const setUserRole = callable("setUserRole");
      await setUserRole({
        userId: user.id,
        role: nextRole,
      });
    } catch (err) {
      console.error("Role change failed:", err);
      setError(err?.message || "Failed to change role.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSuspendToggle() {
    if (!user?.id) return;

    try {
      setBusy(true);
      setError("");

      const suspendUser = callable("suspendUser");
      await suspendUser({
        userId: user.id,
        suspended: !user.suspended,
      });
    } catch (err) {
      console.error("Suspend toggle failed:", err);
      setError(err?.message || "Failed to update suspension.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <aside className={styles.panel}>
        <div className={styles.empty}>
          <h3>User detail</h3>
          <p>Select a user to view and manage their account.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>{user.displayName || "Unnamed user"}</h3>
          <p>{user.email || "No email"}</p>
        </div>

        <button type="button" onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.section}>
        <h4>Profile</h4>
        <dl className={styles.metaList}>
          <div>
            <dt>UID</dt>
            <dd>{user.uid || user.id}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{user.role || "customer"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{user.status || "—"}</dd>
          </div>
          <div>
            <dt>Suspended</dt>
            <dd>{user.suspended ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </div>
          <div>
            <dt>Last login</dt>
            <dd>{formatDate(user.lastLoginAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatDate(user.updatedAt)}</dd>
          </div>
          <div>
            <dt>Updated by</dt>
            <dd>{user.updatedBy || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.section}>
        <h4>Membership</h4>
        <dl className={styles.metaList}>
          <div>
            <dt>Plan</dt>
            <dd>{user.membership?.plan || "—"}</dd>
          </div>
          <div>
            <dt>Active</dt>
            <dd>{user.membership?.isActive ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Start</dt>
            <dd>{formatDate(user.membership?.startDate)}</dd>
          </div>
          <div>
            <dt>Expiry</dt>
            <dd>{formatDate(user.membership?.expiry)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.section}>
        <h4>Actions</h4>

        <label className={styles.field}>
          <span>Role</span>
          <select
            value={user.role || "customer"}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={busy}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleSuspendToggle}
          disabled={busy}
          className={styles.actionButton}
        >
          {busy
            ? "Saving..."
            : user.suspended
              ? "Unsuspend user"
              : "Suspend user"}
        </button>
      </div>
    </aside>
  );
}