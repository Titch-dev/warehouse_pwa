import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import EventForm from "@/components/dashboard/cms/event-form";

export default function CreateEventPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Create Event"
        description="Create a manual or weekly event."
      />
      <EventForm mode="create" />
    </section>
  );
}