import { getOpeningHoursForToday } from '@/lib/utilies';
import styles from './opening-hours.module.css';

const OpeningHours = () => {
  const { start, end } = getOpeningHoursForToday();

  return (
    <div className={styles.opening_hours}>
      <p><strong>Open Today</strong></p> 
      <p>{start} – {end}</p>
    </div>
  );
};

export default OpeningHours;