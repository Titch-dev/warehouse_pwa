import React from 'react';
import dayjs from 'dayjs';
import { sortEvents, getEventStatus } from '@/lib/utilies';
import styles from './event-list.module.css';
import EventListItem from './event-list-item';

const EventList = ({ events, selectedEvent, onEventSelect, selectedFilter }) => {
  const now = dayjs();
  
  // Sort events by date
  const upcomingEvents = events.filter(e => dayjs(e.start).isAfter(now));
  const nextEvent = upcomingEvents[0] || null;

  const thisWeek = events.filter(e =>
    dayjs(e.start).isSame(now, 'week')
  );

  const thisMonth = events.filter(e =>
    dayjs(e.start).isSame(now, 'month')
  );

  let filteredEvents = [];
  switch (selectedFilter) {
    case 'next':
      filteredEvents = nextEvent ? [nextEvent] : [];
      break;
    case 'week':
      filteredEvents = thisWeek;
      break;
    case 'month':
      filteredEvents = thisMonth;
      break;
    default:
      filteredEvents = events;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.event_list}>
        {filteredEvents.map((event, index) => {
          const isSelected = selectedEvent && selectedEvent.id === event.id;
          const eventStatus = getEventStatus(event);
          
          return (
            <EventListItem 
              key={event.id}
              event={event}
              isSelected={isSelected}
              eventStatus={eventStatus}
              onClick={() => onEventSelect(event)}
            />
          );
        })}
      </ul>
      
      {filteredEvents.length === 0 && (
        <div className={styles.emptyState}>
          <h3>
            No events scheduled
            
          </h3>
          <h3>
            {
              selectedFilter === 'all' ? '' :
              selectedFilter === 'next' ? '' :
              selectedFilter === 'week' ? 'this week' : 'this month'
            }
          </h3>
        </div>
      )}
    </div>
  );
};

export default EventList;