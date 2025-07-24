import EventIcons from './event-icons';

import styles from './event-item.module.css';

import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';
import TornBorder from '@/components/assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';


export default function EventItem({ props, isReversed }) {
    const { id, title, description, start, end, price, img, alt} = props;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const eventDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
    }).format(startDate);
    
    const options = {
        hour: "numeric",
        hour12: true,
        timeZone: "UTC"
    }

    const startTime = startDate.toLocaleTimeString("en-GB", options).toLowerCase();
    const endTime = endDate.toLocaleTimeString("en-GB", options).toLowerCase();

    const eventMeta = { date: eventDate, price: price, start: startTime, end: endTime};

  return (
    <div className={`${styles.container} ${isReversed ? styles.reversed : ""}`}>
        <TornBorder top={true} color={colors.greydark1} mobile_view={true}></TornBorder>
        <TornBackgroundSVG className={styles.event_bg}/>
        <div className={styles.content}>
          <h1 className={`${styles.event_title} ${rubikFont.className}`}>{title}</h1>
          <img src={img} className={styles.image} width={500} height={500} alt={alt} />
          <EventIcons {...eventMeta} />
          <p className={styles.description}>{description}</p>
        </div>
        <TornBorder top={false} color={colors.greydark1} mobile_view={true}/>
    </div>
  )
}
