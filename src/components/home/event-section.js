'use client'

import Link from 'next/link';

import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

import EventView from '../events/event-view';

import { rubikFont } from '@/lib/fonts';

import TornBackgroundSVG from '../assets/patterns/torn-background-svg';
import TornBorder from '../assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import styles from './event-section.module.css';
import { sortEvents } from '@/lib/utils';


function EventSection() {
    const {data: events, loading: eventsLoading, error: eventsError } = useFirestoreCollection('events', true);
    const sortedEvents = sortEvents(events);
  
    return (
    <section className={styles.event}>
        <h1 className={`${styles.event_title} ${rubikFont.className}`}>Coming Up ...</h1>
        <TornBackgroundSVG 
            className={styles.content_background} 
            height={980}
            width={980}/>
        <div className={styles.event_view_wrapper}>
            <EventView events={sortedEvents}/>
        </div>
        <Link 
            href='/events' 
            className={styles.event_link}>
            … more events
        </Link>
    </section>
  )
}

export default EventSection