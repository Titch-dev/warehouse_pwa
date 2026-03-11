'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { sortEvents } from '@/lib/events/index'

import EventList from '@/components/events/event-list';
import EventsHeader from '@/components/events/events-header';
import { rubikFont } from '@/theme/fonts';
import styles from './events-page.module.css';

export default function EventsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({ time: 'all', type: 'all', price: 'all' });
  const [mounted, setMounted] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const { data: events } = useFirestoreCollection('events', 'events');
  const sortedEvents = useMemo(() => sortEvents(events || []), [events]);

  useEffect(() => setMounted(true), []);

  const selectedSlugFromUrl = searchParams.get('event');

  useEffect(() => {
    if (!sortedEvents?.length) return;

    if (!selectedSlugFromUrl) {
      setSelectedEvent(null);
      return;
    }

    const ev = sortedEvents.find(e => e?.slug === selectedSlugFromUrl) || null;
    setSelectedEvent(ev);

    if (!ev) router.replace('/events');
  }, [selectedSlugFromUrl, sortedEvents, router]);

  const handleEventSelect = (event) => {
    if (!event?.slug) {
      setSelectedEvent(null);
      router.replace('/events', { scroll: false });
      return;
    }

    setSelectedEvent(event);
    router.replace(`/events?event=${encodeURIComponent(event.slug)}`, { scroll: false });
  };

  if (!mounted) return null;

  return (
    <div className={styles.page_wrapper}>
      <main className={styles.page_content}>
        <h1 className={`${styles.title} ${rubikFont.className}`}>Events</h1>

        <section className={styles.event_list_wrapper}>
          <EventsHeader
            filters={filters}
            onChangeFilters={setFilters}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            events={sortedEvents}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
          />
          <div className={styles.event_list_body}>
            <EventList
              events={sortedEvents}
              selectedEvent={selectedEvent}
              onEventSelect={handleEventSelect}
              filters={filters}
            />
          </div>
        </section>
      </main>
    </div>
  );
}