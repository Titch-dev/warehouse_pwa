"use client";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import CmsTable from "@/components/dashboard/cms/cms-table";
import CmsRowActions from "@/components/dashboard/cms/cms-row-actions";

const MOCK_EVENTS = [
  {
    id: "evt_001",
    title: "Friday DJ Night",
    status: "published",
    date: "2026-03-20",
  },
  {
    id: "evt_002",
    title: "Quiz Evening",
    status: "draft",
    date: "2026-03-24",
  },
  {
    id: "evt_003",
    title: "Live Acoustic Session",
    status: "published",
    date: "2026-03-28",
  },
];

export default function CmsEventsPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Events"
        description="Events management scaffold ready for collection wiring."
      />

      <CmsTable
        columns={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
        ]}
        rows={MOCK_EVENTS}
        getRowKey={(row) => row.id}
        searchKeys={["title", "status", "date"]}
        searchPlaceholder="Search events..."
        filtersSlot={
          <>
            <button type="button">All</button>
            <button type="button">Published</button>
            <button type="button">Draft</button>
          </>
        }
        renderRowActions={(row) => (
          <CmsRowActions
            onEdit={() => console.log("Edit event", row.id)}
            onDelete={() => console.log("Delete event", row.id)}
          />
        )}
      />
    </section>
  );
}