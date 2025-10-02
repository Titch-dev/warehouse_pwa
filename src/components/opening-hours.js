import dayjs from 'dayjs';

import { groupOpeningTimes } from '@/lib/utilies';

import styles from './opening-hours.module.css';

import { openingTimes } from '@/data/synthetic-data';

const OpeningHours = () => {

  const todayIndex = dayjs().day();
  const grouped = groupOpeningTimes(openingTimes);
  console.log(openingTimes);
  console.log(grouped);

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
            <p className={styles.times}>{group.start} - {group.end}</p>
        </div>
        )
      })}
    </div>
  );
};

export default OpeningHours;