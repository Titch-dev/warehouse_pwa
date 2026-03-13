"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import CmsTable from "@/components/dashboard/cms/cms-table";
import CmsRowActions from "@/components/dashboard/cms/cms-row-actions";
import { warehouseDb } from "@/firebase/firebaseConfig";
import { callable, callableAfricaSouth1 } from "@/lib/firebase/functions";
import { formatUpdatedMeta, getEventLifecycleStatus } from "@/lib/events/event-form-utils";

export default function CmsEventsPage() {
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [syncingFacebook, setSyncingFacebook] = useState(false);

  async function handleSyncFacebook() {
    if (syncingFacebook) return;

    try {
      setSyncingFacebook(true);
      const syncNow = callableAfricaSouth1("syncFacebookEventsNow");
      await syncNow({});
      alert("Facebook sync completed.");
    } catch (error) {
      alert(error?.message || "Facebook sync failed.");
    } finally {
      setSyncingFacebook(false);
    }
  }

  useEffect(() => {
    const q = query(collection(warehouseDb, "events"), orderBy("start_time", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const lifecycle = getEventLifecycleStatus(event);

      const statusMatch =
        statusFilter === "all" ? true : lifecycle === statusFilter;

      const sourceMatch =
        sourceFilter === "all" ? true : event.source === sourceFilter;

      return statusMatch && sourceMatch;
    });
  }, [events, statusFilter, sourceFilter]);

  async function handleDelete(event) {
    if (event.type === "weekly") {
      alert("Weekly events cannot be permanently deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${event.name}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(event.id);
      const deleteEvent = callable("deleteEvent");
      await deleteEvent({ eventId: event.id });
    } catch (error) {
      alert(error?.message || "Failed to delete event.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <CmsSectionHeader
        title="Events"
        description="Create and manage manual and recurring events. Facebook events are synced and read-only."
        actions={
          <>
            <button
              type="button"
              onClick={handleSyncFacebook}
              disabled={syncingFacebook}
            >
              {syncingFacebook ? "Syncing..." : "Sync Facebook Now"}
            </button>
            <Link href="/dashboard/cms/events/new">Create Event</Link>
          </>
        }
      />

      <CmsTable
        rows={filteredEvents}
        searchPlaceholder="Search events..."
        searchKeys={["name", "slug", "source", "type"]}
        getRowKey={(row) => row.id}
        columns={[
          {
            key: "name",
            label: "Name",
          },
          {
            key: "date",
            label: "Date",
            render: (row) =>
              row.start_time?.toDate
                ? row.start_time.toDate().toLocaleString()
                : "—",
          },
          {
            key: "status",
            label: "Status",
            render: (row) => getEventLifecycleStatus(row),
          },
          {
            key: "source",
            label: "Source",
          },
          {
            key: "type",
            label: "Type",
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ended">Ended</option>
              <option value="weekly">Weekly</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="all">All sources</option>
              <option value="manual">Manual</option>
              <option value="facebook">Facebook</option>
            </select>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            disableEdit={row.source === "facebook"}
            disableDelete={row.type === "weekly"}
            editHref={
              row.source === "facebook"
                ? null
                : `/dashboard/cms/events/edit?eventId=${row.id}`
            }
            onDelete={() => handleDelete(row)}
            loading={busyId === row.id}
          />
        )}
      />
    </section>
  );
}