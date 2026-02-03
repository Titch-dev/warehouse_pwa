'use client';

import React, { useState, useEffect } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

import { getNextEvent, sortEvents } from '@/lib/utils';

import EventView from '@/components/events/event-view';
import EventCalendar from '@/components/events/event-calendar';
import EventList from '@/components/events/event-list';

import styles from './events-page.module.css';

import { rubikFont } from '@/lib/fonts';


export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Fetch Events data
  const {data: events, loading: eventsLoading, error: eventsError } = useFirestoreCollection('events', true);

  // Handle client-side mounting (SSR safety only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!events.length) return;
    if (selectedEvent) return;

    const nextEvent = getNextEvent(events);

    if (nextEvent) {
      setSelectedEvent(nextEvent);
    }
  }, [events, selectedEvent]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);

    // on event selected - scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (!mounted) {
    return null; // Prevent SSR mismatch
  }

  const sortedEvents = sortEvents(events);
  
  const filterOptions = ['all', 'next', 'this-month', 'next-month'];

  return (
    <div className={styles.page_wrapper}>
      <main className={styles.page_content}>
        <section className={styles.event_view_wrapper}>
          <EventView 
            selectedEvent={selectedEvent} 
            events={sortedEvents}
          />
        </section>
        <section className={styles.calendar_wrapper}>
          <EventCalendar 
            events={sortedEvents}
            onEventSelect={handleEventSelect}
            selectedEvent={selectedEvent}
          />
        </section>
        <section className={styles.event_list_wrapper}>
          <div className={styles.event_list_header}>
            <div className={styles.filters}>
              {isMobile ?
                <>
                  <select className={rubikFont.className}>
                    {filterOptions.map(filter => (
                    <option
                      key={filter}
                      className={`${styles.btn} ${selectedFilter === filter ? styles.btn_selected : ''}`}
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter === 'all' ? 'All Events' :
                      filter === 'next' ? 'Next Event' :
                      filter === 'this-month' ? 'This Month' :
                      'Next Month'}
                    </option>
                    ))}
                  </select>
                </>
                :
                <>
                {filterOptions.map(filter => (
                  <button
                    key={filter}
                    className={`${styles.btn} ${selectedFilter === filter ? styles.btn_selected : ''}`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter === 'all' ? 'All Events' :
                      filter === 'next' ? 'Next Event' :
                      filter === 'this-month' ? 'This Month' :
                      'Next Month'}
                  </button>
                ))}  
                </>
              }
            </div>
          </div>
          
          <EventList 
            events={sortedEvents}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
            selectedFilter={selectedFilter}
          />
          <div className={styles.event_list_footer}>
            
          </div>
        </section>
      </main>
    </div>
  );
}