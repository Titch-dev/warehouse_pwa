import useMediaQuery from '@/hooks/useMediaQuery';

import { formatEventDate } from '@/lib/utils';

import styles from './event-list-item.module.css'
import { rubikFont } from '@/lib/fonts';
import CalendarSVG from '../assets/icons/calendar-svg';

export default function EventListItem({event, isSelected, onClick}) {
    const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <li 
        className={`
            ${styles.event_wrapper}
            ${isSelected? styles.selected : ''}
        `}
        onClick={onClick}
        >
        <div className={styles.image_container}>
            <img
                className={styles.event_image}
                src={event.img}
                alt={event.alt}
            />
        </div>
        <div className={styles.event_shroud}></div>
        <div className={styles.event_content_wrapper}>
            <div className={styles.event_content}>
                <h3 className={`${rubikFont.className} ${styles.event_title}`}>
                    {event.title}
                </h3>
                {!isMobile &&
                    <p className={styles.event_desc}>
                        {event.description}
                    </p>
                }
            </div>
            <div className={styles.date_container}>
                <CalendarSVG className={styles.date_icon}></CalendarSVG>
                <p>{formatEventDate(event.start)}</p>
            </div>
        </div>
        
    </li>
  )
}
