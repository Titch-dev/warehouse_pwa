import EventItem from '@/components/events/event-item';

import styles from './events-page.module.css';
import { rubikFont } from '@/lib/fonts';

import { events } from '@/data/synthetic-data';


const todaysDate = "2025-04-29T00:00:00Z";

export default function EventsPage() {

  const eventDateParser = (date) => {
    
    const eventDate = new Date(date);

    const dateFormatted = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        timeZone: "UTC",
    }).format(eventDate);
    
    return dateFormatted;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={`${rubikFont.className} ${styles.page_title}`}>Our Events</h1>
      <section className={styles.event_wrapper}>
          {events.map((event, index) => (
              <div key={event.id} className={styles.event_item_wrapper}>
                <h2 className={styles.event_date}>{eventDateParser(event.start)}:</h2>
                <EventItem key={event.id} props={event} isReversed={index % 2 === 1}/>
              </div>
          ))}
      </section>
    </div>
  )
}
