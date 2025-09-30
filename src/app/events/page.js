'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { sortEvents } from '@/lib/utilies';

import EventView from '@/components/events/event-view';
import EventCalendar from '@/components/events/event-calendar';
import EventList from '@/components/events/event-list';
import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './events-page.module.css';

import { events } from '@/data/synthetic-data';
import { rubikFont } from '@/lib/fonts';

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    // Set initial selected event to the next upcoming event
    const now = dayjs();
    const upcomingEvents = events
      .filter(event => dayjs(event.start).isAfter(now))
      .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
    
    if (upcomingEvents.length > 0) {
      setSelectedEvent(upcomingEvents[0]);
    } else if (events.length > 0) {
      setSelectedEvent(events[0]);
    }
  }, []);

  // Handle changes to selected event
  useEffect(() => {
    if (selectedEvent) {  
      console.log("Selected event changed:", selectedEvent);
      
      
    }
  }, [selectedEvent]); 

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
  const filterOptions = ['all', 'next', 'week', 'month'];

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
                      filter === 'week' ? 'This Week' :
                      'This Month'}
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
                    filter === 'week' ? 'This Week' :
                    'This Month'}
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