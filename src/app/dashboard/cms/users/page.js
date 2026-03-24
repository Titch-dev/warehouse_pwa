"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import RequireRole from "@/components/dashboard/require-role";
import CmsTable from "@/components/dashboard/cms/cms-table";
import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import UserDetailPanel from "@/components/dashboard/cms/user-detail-panel";
import { warehouseDb } from "@/firebase/firebaseConfig";
import { USER_ROLES } from "@/lib/auth";
import styles from "./users-page.module.css";

export default function CmsUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const q = query(collection(warehouseDb, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(nextUsers);

      if (selectedUser) {
        const fresh = nextUsers.find((user) => user.id === selectedUser.id) || null;
        setSelectedUser(fresh);
      }
    });

    return unsubscribe;
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch =
        roleFilter === "all" ? true : user.role === roleFilter;

      const statusMatch =
        statusFilter === "all"
          ? true
          : statusFilter === "suspended"
            ? user.suspended === true
            : user.suspended !== true;

      return roleMatch && statusMatch;
    });
  }, [users, roleFilter, statusFilter]);

  return (
    <RequireRole allowedRoles={[USER_ROLES.OWNER]}>
      <section className={styles.layout}>
        <div className={styles.tablePane}>
          <CmsSectionHeader
            title="Users"
            description="Owner-only user management."
          />

          <CmsTable
            rows={filteredUsers}
            searchPlaceholder="Search users..."
            searchKeys={["displayName", "email", "role", "status"]}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "displayName",
                label: "Name",
                render: (row) => row.displayName || "—",
              },
              {
                key: "email",
                label: "Email",
                render: (row) => row.email || "—",
              },
              {
                key: "role",
                label: "Role",
                render: (row) => row.role || "customer",
              },
              {
                key: "suspended",
                label: "Suspended",
                render: (row) => (row.suspended ? "Yes" : "No"),
              },
              {
                key: "membership",
                label: "Membership",
                render: (row) =>
                  row.membership?.isActive ? "Active" : "Inactive",
              },
            ]}
            filtersSlot={
              <>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All roles</option>
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </>
            }
            renderRowActions={(row) => (
              <button
                type="button"
                className={styles.viewButton}
                onClick={() => setSelectedUser(row)}
              >
                View
              </button>
            )}
            emptyMessage="No users found."
          />
        </div>

        <div className={styles.detailPane}>
          <UserDetailPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        </div>
      </section>
    </RequireRole>
  );
}