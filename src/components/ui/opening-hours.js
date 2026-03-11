import dayjs from 'dayjs';

import { groupOpeningTimes } from '@/lib/venue/index';

import styles from './opening-hours.module.css';

export default async function OpeningHours() {

  const todayIndex = dayjs().day();
  const grouped = groupOpeningTimes();

  return (
    <div className={styles.open_times}>
      <h3>Opening Times...</h3>

      {grouped.map((group, idx) => {
        return (
          <div key={idx} className={styles.times_row}>
            <div className={styles.days}> 
              {group.days.map((day) => {
                return (
                <span 
                  key={day}
                  className={
                    `${todayIndex === day? styles.highlight : ''}`
                  }
                >
                  {dayjs().day(day).format('ddd')}
                </span>
                )
              })}
            </div>
            <p 
              className={
                `${styles.times} ${group.days.includes(todayIndex) ? styles.highlight : ''}`
              }>
                {group.open} - {group.close}
            </p>
        </div>
        )
      })}
    </div>
  );
};