import { useEffect } from 'react';
import dayjs from 'dayjs';
import LoadingData from '../loading-data';

import { getEventStatus } from '@/lib/utils';
import styles from './event-list.module.css';
import EventListItem from './event-list-item';

const EventList = ({ events, selectedEvent, onEventSelect, selectedFilter }) => {
  const now = dayjs();
  
  // Sort events by date
  const upcomingEvents = events.filter(e => dayjs(e.start_time).isAfter(now));
  const nextEvent = upcomingEvents[0] || null;

  const thisMonth = events.filter(e =>
    dayjs(e.start_time).isSame(now, 'month')
  );

  const nextMonthEvents = events.filter(e =>
    dayjs(e.start_time).isSame(now.add(1, 'month'), 'month')
  );

  let filteredEvents;

  switch (selectedFilter) {
    case 'next':
      filteredEvents = nextEvent ? [nextEvent] : [];
      break;
    case 'this-month':
      filteredEvents = thisMonth;
      break;
    case 'next-month':
      filteredEvents = nextMonthEvents;
      break;
    case 'all':
    default:
      filteredEvents = events;
  }

  useEffect(() => {}, [events])

  if (!events || events.length === 0) {
    return (
      <LoadingData dataName={'events'}/>
    );
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
              selectedFilter === 'this-month' ? 'this month' : 'next month'
            }
          </h3>
        </div>
      )}
    </div>
  );
};

export default EventList;