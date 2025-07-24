import CalendarSVG from '@/components/assets/icons/calendar-svg';
import DoorSVG from '@/components/assets/icons/door-svg';
import ClockSVG from '@/components/assets/icons/clock-svg';

import styles from './event-icons.module.css'

export default function EventIcons({date, price, start, end}) {

  return (
    <div className={styles.icons}>
        <div className={styles.icon_container}>
            <CalendarSVG className={styles.icon}></CalendarSVG>
            <p>{date}</p>
        </div>
        <div className={styles.icon_container}>
            <DoorSVG className={styles.icon}></DoorSVG>
            <p>{price === 0 ? "Free" : `R ${price} pp`}</p>
        </div>
        <div className={styles.icon_container}>
            <ClockSVG className={styles.icon}></ClockSVG>
            <p>{`${start} - ${end} `}</p>
        </div>
    </div>
  )
}
