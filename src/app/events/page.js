import { Suspense } from "react";
import EventsPageClient from "./events-page-client";

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsPageClient initialSlug={null} />;
    </Suspense>
  )
}