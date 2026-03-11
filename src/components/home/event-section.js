'use client'

import { useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

import EventView from './event-view';

import { rubikFont } from '@/theme/fonts';

import styles from './event-section.module.css';
import WeeklyEvents from './weekly-events';
import TornBorder from '../assets/patterns/torn-border';
import { colors } from '@/theme/colors';
import TornBackgroundSmSVG from '../assets/patterns/torn-background-sm-svg';


function EventSection() {
    const { data: events, loading, error } = useFirestoreCollection('events', 'events');

    const { nextEvent, weeklyEvents } = useMemo(() => {
        const now = dayjs();
        const oneOff = (events || [])
            .filter(e => e.type === 'one_off')
            .filter(e => dayjs(e.start_time).isAfter(now) || dayjs(e.start_time).isSame(now, 'minute'))
            .sort((a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf());

        const weekly = (events || [])
            .filter(e => e.type === 'weekly')
            .sort((a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf());

        return {
            nextEvent: oneOff[0] ?? null,
            weeklyEvents: weekly,
        };
    }, [events]);
  
    return (
    <section className={styles.event}>
        <h1 className={`${styles.event_title} ${rubikFont.className}`}>Up next...</h1>
        <div className={styles.next_wrapper}>
            <TornBackgroundSmSVG 
                className={styles.next_background}
            />
            <div className={styles.next_event_wrapper}>
                <TornBorder top mobile_view color={colors.greydark1}/>
                <EventView event={nextEvent} loading={loading}/>
                <TornBorder top={false} mobile_view color={colors.greydark1}/>
            </div>
        </div>
        <h1 className={`${styles.event_title} ${rubikFont.className}`}>Weekly events ...</h1>
        <div className={styles.weekly_wrapper}>
            <TornBackgroundSmSVG
                className={styles.weekly_background}
            />
            <div className={styles.weekly_event_wrapper}>
                <TornBorder top mobile_view color={colors.greydark1}/>
                <WeeklyEvents events={weeklyEvents} loading={loading} />
                <TornBorder top={false} mobile_view color={colors.greydark1}/>
            </div>
        </div>
        <Link 
            href='/events' 
            className={styles.event_link}>
            <button 
                className={`
                    ${styles.event_btn}
                    ${rubikFont.className}
                `}>
                    <p>... more events</p>
                
            </button>
        </Link>
        
    </section>
  )
}

export default EventSection