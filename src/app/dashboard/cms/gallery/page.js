"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import CmsTable from "@/components/dashboard/cms/cms-table";
import CmsRowActions from "@/components/dashboard/cms/cms-row-actions";
import SmartImage from "@/components/ui/smart-image";
import { warehouseDb } from "@/firebase/firebaseConfig";
import { callableAfricaSouth1 } from "@/lib/firebase/functions";
import { formatUpdatedMeta } from "@/lib/gallery/gallery-form-utils";

export default function CmsGalleryPage() {
  const [items, setItems] = useState([]);
  const [visibleFilter, setVisibleFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const q = query(collection(warehouseDb, "gallery"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      nextItems.sort((a, b) => {
        const aOrder =
          typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
        const bOrder =
          typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;

        if (aOrder !== bOrder) return aOrder - bOrder;

        const aCreated = a.createdAt?.toDate?.()?.getTime?.() || 0;
        const bCreated = b.createdAt?.toDate?.()?.getTime?.() || 0;

        return bCreated - aCreated;
      });

      setItems(nextItems);
    });

    return unsubscribe;
  }, []);

  const tagOptions = useMemo(() => {
    return [...new Set(items.flatMap((item) => item.tags || []).filter(Boolean))];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const visibleMatch =
        visibleFilter === "all"
          ? true
          : visibleFilter === "visible"
            ? item.visible === true
            : item.visible === false;

      const tagMatch =
        tagFilter === "all"
          ? true
          : Array.isArray(item.tags) && item.tags.includes(tagFilter);

      return visibleMatch && tagMatch;
    });
  }, [items, visibleFilter, tagFilter]);

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "Delete this gallery image permanently? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setBusyId(item.id);
      const deleteGalleryItem = callableAfricaSouth1("deleteGalleryItem");
      await deleteGalleryItem({ galleryId: item.id });
    } catch (error) {
      alert(error?.message || "Failed to delete gallery item.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <CmsSectionHeader
        title="Gallery"
        description="Upload and manage gallery images."
        actions={<Link href="/dashboard/cms/gallery/new">Upload image</Link>}
      />

      <CmsTable
        rows={filteredItems}
        searchPlaceholder="Search gallery..."
        searchKeys={["updatedBy", "tags"]}
        getRowKey={(row) => row.id}
        columns={[
          {
            key: "thumb",
            label: "Preview",
            render: (row) => (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <SmartImage
                  image={row.image}
                  alt="The Westville Warehouse gallery image"
                  sizes="64px"
                  fit="cover"
                />
              </div>
            ),
          },
          {
            key: "tags",
            label: "Tags",
            render: (row) =>
              Array.isArray(row.tags) && row.tags.length
                ? row.tags.join(", ")
                : "—",
          },
          {
            key: "visible",
            label: "Visible",
            render: (row) => (row.visible ? "Yes" : "No"),
          },
          {
            key: "order",
            label: "Order",
            render: (row) =>
              typeof row.order === "number" ? row.order : "—",
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
              value={visibleFilter}
              onChange={(e) => setVisibleFilter(e.target.value)}
            >
              <option value="all">All visibility</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="all">All tags</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            editHref={`/dashboard/cms/gallery/edit?galleryId=${row.id}`}
            onDelete={() => handleDelete(row)}
            loading={busyId === row.id}
          />
        )}
      />
    </section>
  );
}