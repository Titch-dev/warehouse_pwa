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
  DRINK_CATEGORIES,
  FOOD_CATEGORIES,
  MENU_TYPES,
} from "@/lib/menu/menu-config";
import {
  formatPricing,
  formatUpdatedMeta,
} from "@/lib/menu/menu-form-utils";

export default function CmsMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [menuTypeFilter, setMenuTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const q = query(collection(warehouseDb, "menu"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((doc) => doc.entityType === "item")
      );
    });

    return unsubscribe;
  }, []);

  const categoryOptions = useMemo(() => {
    if (menuTypeFilter === MENU_TYPES.FOOD) return FOOD_CATEGORIES;
    if (menuTypeFilter === MENU_TYPES.DRINK) return DRINK_CATEGORIES;
    return [...FOOD_CATEGORIES, ...DRINK_CATEGORIES];
  }, [menuTypeFilter]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const menuTypeMatch =
        menuTypeFilter === "all" ? true : item.menuType === menuTypeFilter;

      const categoryMatch =
        categoryFilter === "all" ? true : item.category === categoryFilter;

      return menuTypeMatch && categoryMatch;
    });
  }, [items, menuTypeFilter, categoryFilter]);

  const columns = useMemo(() => {
    const out = [{ key: "name", label: "Name" }];

    if (menuTypeFilter === "all") {
      out.push({ key: "menuType", label: "Type" });
    }

    if (categoryFilter === "all") {
      out.push({ key: "category", label: "Category" });
    }

    out.push(
      {
        key: "pricing",
        label: "Pricing",
        render: (row) => formatPricing(row.pricing),
      },
      {
        key: "updated",
        label: "Last Updated",
        render: (row) => formatUpdatedMeta(row),
      }
    );

    return out;
  }, [menuTypeFilter, categoryFilter]);

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.name}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(item.id);
      const deleteMenuItem = callable("deleteMenuItem");
      await deleteMenuItem({ menuId: item.id });
    } catch (error) {
      alert(error?.message || "Failed to delete menu item.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <CmsSectionHeader
        title="Menu Items"
        description="Manage standard food and drink items."
        actions={
          <Link href="/dashboard/cms/menu-items/new">Create menu item</Link>
        }
      />

      <CmsTable
        rows={filteredItems}
        searchPlaceholder="Search menu items..."
        searchKeys={["name", "slug", "category", "menuType"]}
        getRowKey={(row) => row.id}
        columns={columns}
        filtersSlot={
          <>
            <select
              value={menuTypeFilter}
              onChange={(e) => {
                setMenuTypeFilter(e.target.value);
                setCategoryFilter("all");
              }}
            >
              <option value="all">All types</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            editHref={`/dashboard/cms/menu-items/edit?menuId=${row.id}`}
            onDelete={() => handleDelete(row)}
            loading={busyId === row.id}
          />
        )}
      />
    </section>
  );
}