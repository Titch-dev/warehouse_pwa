import EventItem from '@/components/events/event-item';

import styles from './events-page.module.css';
import { rubikFont } from '@/lib/fonts';

import { events } from '@/data/synthetic-data';


const todaysDate = "2025-04-29T00:00:00Z";

export default function EventsPage() {

  return (
    <div className={styles.wrapper}>
      <h1 className={`${rubikFont.className} ${styles.page_title}`}>Our Events</h1>
      <section className={styles.event_list_wrapper}>
          {events.map((event, index) => (
              <div key={event.id} className={styles.event_wrapper}>
                <EventItem key={event.id} props={event} isReversed={index % 2 === 1}/>
              </div>
          ))}
      </section>
    </div>
  )
}
