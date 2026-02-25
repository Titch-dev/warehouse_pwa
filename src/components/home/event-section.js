'use client'

import Link from 'next/link';

import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

import EventView from '../events/event-view';

import { rubikFont } from '@/lib/fonts';

import TornBackgroundSVG from '../assets/patterns/torn-background-svg';
import styles from './event-section.module.css';
import { sortEvents } from '@/lib/utils';
import WeeklyEvents from '../events/weekly-events';
import TornBorder from '../assets/patterns/torn-border';
import { colors } from '@/lib/colors';


function EventSection() {
    const {data: events, loading: eventsLoading, error: eventsError } = useFirestoreCollection('events', 'events');
    const sortedEvents = sortEvents(events);
  
    return (
    <section className={styles.event}>
        <h1 className={`${styles.event_title} ${rubikFont.className}`}>Up next...</h1>
        <div className={styles.next_event_wrapper}>
            <TornBackgroundSVG 
                className={styles.content_background} 
                height={980}
                width={980}
            />
            <div className={styles.event_view_wrapper}>
                <TornBorder top mobile_view color={colors.greydark1}/>
                <EventView events={sortedEvents}/>
                <TornBorder top={false} mobile_view color={colors.greydark1}/>
            </div>
        </div>
        <h1 className={`${styles.event_title} ${rubikFont.className}`}>Our weekly events ...</h1>
        <div className={styles.weekly_events_wrapper}>
            <TornBackgroundSVG 
                className={styles.content_weekly_background} 
                height={980}
                width={980}
            />
            <div className={styles.weekly_event_wrapper}>
                <TornBorder top mobile_view color={colors.greydark1}/>
                <WeeklyEvents/>
                <TornBorder top={false} mobile_view color={colors.greydark1}/>
            </div>
        </div>
        <Link 
            href='/events' 
            className={styles.event_link}>
            <button className={styles.event_btn}>
                more events
            </button>
        </Link>
        
    </section>
  )
}

export default EventSection