'use client'

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './event-view.module.css';
import { rubikFont } from '@/lib/fonts';
import EventIcons from './event-icons';

import ChevronDownSVG from '../assets/icons/chevron-down-svg';

const EventView = ({ selectedEvent, events }) => {
  const [ descShow, setDescShow ] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setDescShow(false);
  }, [selectedEvent])

  const now = dayjs()
  // Sort events by date
  const upcomingEvents = events.filter(e => dayjs(e.start_time).isAfter(now));
  const nextEvent = upcomingEvents[0] || null;

  const currentEvent = selectedEvent || nextEvent;

  if (!currentEvent) {
    return (
      // create element if no events
      null
    );
  }

  const handleShowDesc = () => {
    if (isMobile) {
      setDescShow(prev => !prev)
      console.log(descShow);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img 
          className={styles.header_image}
          src={currentEvent.imageUrl}
          alt={currentEvent.alt_image || currentEvent.name}/>
        <div className={styles.header_content}>
          <h3 className={`${rubikFont.className} ${styles.header_title}`}>
            {currentEvent.name}
          </h3>
              <EventIcons
                date={currentEvent.start_time} 
                prices={currentEvent.prices} 
                start={currentEvent.start_time} 
                end={currentEvent.end_time}
            />
        </div>
      </div>
      <div
        onClick={() => handleShowDesc()}
        className={`
          ${styles.body}
          ${descShow ? styles.open : ''}
        `}>
        {isMobile &&
        <div 
          className={`
            ${styles.body_icon}
            ${descShow ? styles.open : ''}
          `}>
          <ChevronDownSVG />
        </div>
        }
        <p 
          className={`
            ${styles.body_desc}
            ${descShow ? styles.open : ''}
          `}>
            {currentEvent.description}
          </p>
      </div>
    </div>
  );
};

export default EventView;