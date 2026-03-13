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
  MENU_MISC_ENTITY_TYPES,
  MENU_TYPES,
} from "@/lib/menu/menu-config";
import {
  formatAppliesTo,
  formatExtrasItems,
  formatMessages,
  formatUpdatedMeta,
} from "@/lib/menu/menu-misc-form-utils";

export default function CmsMenuMiscPage() {
  const [items, setItems] = useState([]);
  const [entityFilter, setEntityFilter] = useState("all");
  const [menuTypeFilter, setMenuTypeFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const q = query(collection(warehouseDb, "menu"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (doc) =>
              doc.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP ||
              doc.entityType === MENU_MISC_ENTITY_TYPES.NOTICE
          )
      );
    });

    return unsubscribe;
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const entityMatch =
        entityFilter === "all" ? true : item.entityType === entityFilter;

      const menuTypeMatch =
        menuTypeFilter === "all" ? true : item.menuType === menuTypeFilter;

      return entityMatch && menuTypeMatch;
    });
  }, [items, entityFilter, menuTypeFilter]);

  const columns = useMemo(() => {
    const out = [];

    if (entityFilter === "all") {
      out.push({
        key: "entityType",
        label: "Type",
        render: (row) =>
          row.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP
            ? "Extras Group"
            : "Notice",
      });
    }

    if (menuTypeFilter === "all") {
      out.push({
        key: "menuType",
        label: "Menu Type",
        render: (row) => row.menuType || "—",
      });
    }

    out.push(
      {
        key: "name",
        label: "Title",
        render: (row) =>
            row.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP
            ? row.name
            : "-",
      },
      {
        key: "appliesTo",
        label: "Applies To",
        render: (row) => formatAppliesTo(row.appliesTo),
      },
      {
        key: "details",
        label: "Details",
        render: (row) =>
          row.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP
            ? formatExtrasItems(row.items)
            : formatMessages(row.messages),
      },
      {
        key: "updated",
        label: "Last Updated",
        render: (row) => formatUpdatedMeta(row),
      }
    );

    return out;
  }, [entityFilter, menuTypeFilter]);

  async function handleDelete(item) {
    const label =
      item.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP
        ? item.name
        : "this notice";

    const confirmed = window.confirm(
      `Delete "${label}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(item.id);
      const deleteMenuMisc = callable("deleteMenuMisc");
      await deleteMenuMisc({ menuId: item.id });
    } catch (error) {
      alert(error?.message || "Failed to delete menu misc document.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <CmsSectionHeader
        title="Menu Misc"
        description="Manage extras groups and notices."
        actions={
          <Link href="/dashboard/cms/menu-misc/new">Create menu misc</Link>
        }
      />

      <CmsTable
        rows={filteredItems}
        searchPlaceholder="Search menu misc..."
        searchKeys={["name", "entityType", "menuType"]}
        getRowKey={(row) => row.id}
        columns={columns}
        filtersSlot={
          <>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="all">All document types</option>
              <option value="extras_group">Extras Groups</option>
              <option value="notice">Notices</option>
            </select>

            <select
              value={menuTypeFilter}
              onChange={(e) => setMenuTypeFilter(e.target.value)}
            >
              <option value="all">All menu types</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
            </select>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            editHref={`/dashboard/cms/menu-misc/edit?menuId=${row.id}`}
            onDelete={() => handleDelete(row)}
            loading={busyId === row.id}
          />
        )}
      />
    </section>
  );
}