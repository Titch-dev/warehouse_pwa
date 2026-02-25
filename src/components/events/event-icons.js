import { formatEventTime, formatEventDate, formatPriceDisplay } from '@/lib/utils';

import CalendarSVG from '@/components/assets/icons/calendar-svg';
import DoorSVG from '@/components/assets/icons/money-svg';
import ClockSVG from '@/components/assets/icons/clock-svg';

import styles from './event-icons.module.css'

export default function EventIcons({column=false, price, start, end}) {

  return (
    <div className={`${styles.icons} ${column ? styles.column : ''}
          `}>
        <div 
          className={`
            ${styles.icon_container}
            ${column ? styles.column : ''}
            `}>
            <CalendarSVG className={styles.icon}></CalendarSVG>
            <p>{formatEventDate(start)}</p>
        </div>
        <div 
          className={`
            ${styles.icon_container}
            ${column ? styles.column : ''}
          `}>
            <ClockSVG className={styles.icon}></ClockSVG>
            <p>{formatEventTime(start, end)}</p>
        </div>
        <div 
          className={`
            ${styles.icon_container}
            ${column ? styles.column : ''}
          `}>
            <DoorSVG className={styles.icon}></DoorSVG>
            <p>{formatPriceDisplay(price)}</p>
        </div>
    </div>
  )
}
