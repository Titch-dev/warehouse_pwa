"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import EventForm from "@/components/dashboard/cms/event-form";
import { warehouseDb } from "@/firebase/firebaseConfig";

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [eventDoc, setEventDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setEventDoc(null);
      return;
    }

    const ref = doc(warehouseDb, "events", eventId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setEventDoc(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [eventId]);

  if (loading) {
    return (
      <section>
        <p>Loading event...</p>
      </section>
    );
  }

  if (!eventId) {
    return (
      <section>
        <p>Missing eventId.</p>
      </section>
    );
  }

  if (!eventDoc) {
    return (
      <section>
        <p>Event not found.</p>
      </section>
    );
  }

  return (
    <section>
      <CmsSectionHeader
        title={`Edit: ${eventDoc.name}`}
        description="Update this event."
      />
      <EventForm mode="edit" eventDoc={eventDoc} eventId={eventId} />
    </section>
  );
}