'use client'

import { useState, useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';

import EventIcons from './event-icons';

import styles from './event-item.module.css';

import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';
import TornBorder from '@/components/assets/patterns/torn-border';
import ChevronDownSVG from '../assets/icons/chevron-down-svg';

import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';


export default function EventItem({ props, isReversed }) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showDescription, setShowDescription] = useState(false);
  const { id, title, description, start, end, price, img, alt} = props;

  const [formattedDate, setFormattedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  useEffect(() => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const date = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC',
      }).format(startDate);

      const options = { hour: 'numeric', hour12: true, timeZone: 'UTC' };
      const startT = startDate.toLocaleTimeString('en-GB', options).toLowerCase();
      const endT = endDate.toLocaleTimeString('en-GB', options).toLowerCase();

      setFormattedDate(date);
      setStartTime(startT);
      setEndTime(endT);
    }, [start, end]);

  const handleDescriptionShow = () =>{
    setShowDescription(prev => !prev);
  }

  const eventMeta = { date: formattedDate, price: price, start: startTime, end: endTime };

  return (
    <div className={`${styles.container} ${isReversed ? styles.reversed : ""}`}>
        <TornBorder top={true} color={colors.greydark1} mobile_view={true}></TornBorder>
        <TornBackgroundSVG className={styles.event_bg}/>
        <div className={styles.content}>
          <h2 className={`${styles.event_title} ${rubikFont.className}`}>{title}</h2>
          <img src={img} className={styles.image} width={500} height={500} alt={alt} />
          <EventIcons {...eventMeta} />
          <p 
            className={`
              ${styles.description}
              ${isMobile && !showDescription ? styles.hidden : undefined}  
            `}>
              {description}
          </p>
          {isMobile && (
            <button 
              className={`
                ${styles.toggle_button} 
                ${showDescription ? styles.show : undefined}
              `}
              onClick={handleDescriptionShow}
              >
              <ChevronDownSVG/>
            </button>
          )}
        </div>
        <TornBorder top={false} color={colors.greydark1} mobile_view={true}/>
    </div>
  )
}
