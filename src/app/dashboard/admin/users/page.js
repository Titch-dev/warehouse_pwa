"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { warehouseDb } from "@/firebase/firebaseConfig";
import { setUserRole, suspendUser } from "@/lib/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const q = query(collection(warehouseDb, "users"), orderBy("createdAt", "desc"), limit(100));
      const snap = await getDocs(q);

      const rows = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(rows);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(userId, role) {
    const key = `role-${userId}`;
    setBusyKey(key);
    setError("");

    try {
      await setUserRole({ userId, role });
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to update role.");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleSuspendToggle(userId, suspended) {
    const key = `suspend-${userId}`;
    setBusyKey(key);
    setError("");

    try {
      await suspendUser({ userId, suspended: !suspended });
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to update suspension.");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) return <div>Loading users...</div>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Manage Users</h1>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
            }}
          >
            <p><strong>UID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.displayName || "—"}</p>
            <p><strong>Email:</strong> {user.email || "—"}</p>
            <p><strong>Role:</strong> {user.role || "customer"}</p>
            <p><strong>Suspended:</strong> {user.suspended ? "Yes" : "No"}</p>

            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {["customer", "staff", "admin", "owner"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(user.id, role)}
                  disabled={busyKey !== null}
                >
                  Make {role}
                </button>
              ))}

              <button
                onClick={() => handleSuspendToggle(user.id, !!user.suspended)}
                disabled={busyKey !== null}
              >
                {user.suspended ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}