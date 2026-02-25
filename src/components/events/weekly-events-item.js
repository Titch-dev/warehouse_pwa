import { getStorageImageUrl } from '@/lib/utils';

import CalendarSVG from '../assets/icons/calendar-svg';

import { rubikFont } from '@/lib/fonts'
import styles from './weekly-events-item.module.css'
import ClockSVG from '../assets/icons/clock-svg';
import DoorSVG from '../assets/icons/money-svg';

function WeeklyEventsItem({ item }) {

    const formatPrice = (price) => {
        if (!price || price.amount === null) {
            return 'Free';
        }

        if (price.amount && price.denom === null) {
            return `R${price.amount} pp`
        }

        return `R${price.amount} ${price.denom ?? ''}`.trim();
    }

  return (
    <div className={styles.container}>
        <div className={styles.event_image_wrapper}>
            <img 
            className={styles.event_image}
            // src={getStorageImageUrl(item.image.path)}
            src={item.image.path}
            alt={item.image.alt || item.name}/>
        </div>
        <h1 className={`
            ${styles.title}
            ${rubikFont.className}
        `}>
            {item.name}
        </h1>
        <div className={styles.icons_wrapper}>
            <div className={styles.icon_container}>
                <CalendarSVG className={styles.icon}/>
                <p style={{ textTransform: 'capitalize'}}>
                    {Object.keys(item.days)}
                </p>
            </div>
            <div className={styles.icon_container}>
                <ClockSVG className={styles.icon}/>
                <p style={{ textTransform: 'uppercase'}}>
                    {item.start_time}
                </p>
            </div>
            <div className={styles.icon_container}>
                <DoorSVG className={styles.icon}/>
                <p>{formatPrice(item.price)}</p>
            </div>
        </div>
        <div className={styles.event_desc}>
            {item.desc}
        </div>
    </div>
  )
}

export default WeeklyEventsItem