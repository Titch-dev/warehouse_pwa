"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import CmsTable from "@/components/dashboard/cms/cms-table";
import CmsRowActions from "@/components/dashboard/cms/cms-row-actions";
import { warehouseDb } from "@/firebase/firebaseConfig";
import { callable } from "@/lib/firebase/functions";
import {
  formatOffers,
  formatUpdatedMeta,
  formatWeekDays,
} from "@/lib/specials/specials-form-utils";

export default function CmsSpecialsPage() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const q = query(collection(warehouseDb, "specials"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = typeFilter === "all" ? true : item.type === typeFilter;

      const activeMatch =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
            ? item.isActive === true
            : item.isActive === false;

      return typeMatch && activeMatch;
    });
  }, [items, typeFilter, activeFilter]);

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.name}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(item.id);
      const deleteSpecial = callable("deleteSpecial");
      await deleteSpecial({ specialId: item.id });
    } catch (error) {
      alert(error?.message || "Failed to delete special.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <CmsSectionHeader
        title="Specials"
        description="Manage weekly food and drink specials."
        actions={
          <Link href="/dashboard/cms/specials/new">Create special</Link>
        }
      />

      <CmsTable
        rows={filteredItems}
        searchPlaceholder="Search specials..."
        searchKeys={["name", "slug", "type"]}
        getRowKey={(row) => row.id}
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          {
            key: "weekDays",
            label: "Days",
            render: (row) => formatWeekDays(row.weekDays),
          },
          {
            key: "offers",
            label: "Offers",
            render: (row) => formatOffers(row.offers),
          },
          {
            key: "active",
            label: "Status",
            render: (row) => (row.isActive ? "Active" : "Inactive"),
          },
          {
            key: "updated",
            label: "Last Updated",
            render: (row) => formatUpdatedMeta(row),
          },
        ]}
        filtersSlot={
          <>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            editHref={`/dashboard/cms/specials/edit?specialId=${row.id}`}
            onDelete={() => handleDelete(row)}
            loading={busyId === row.id}
          />
        )}
      />
    </section>
  );
}