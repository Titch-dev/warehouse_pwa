import dayjs from 'dayjs';
import { rubikFont } from '@/lib/fonts';
import SmartImage from '../ui/smart-image';

import styles from './specials-item.module.css';

export default function SpecialsItem({ item }) {
  const today = dayjs().day();
  const tomorrow = (today + 1) % 7;

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dayIndexes = [...(item?.weekDays || [])]
    .filter((d) => Number.isInteger(d))
    .sort((a, b) => a - b);

  const isSequential =
    dayIndexes.length > 1 &&
    dayIndexes.every((day, i) => i === 0 || day === dayIndexes[i - 1] + 1);

  let label = '';

  if (!dayIndexes.length) {
    label = 'Specials';
  } else if (isSequential) {
    label = `${DAY_NAMES[dayIndexes[0]]} - ${DAY_NAMES[dayIndexes[dayIndexes.length - 1]]}`;
  } else {
    const formattedDays = dayIndexes.map((d) => {
      if (d === today) return 'Today';
      if (d === tomorrow) return 'Tomorrow';
      return DAY_NAMES[d];
    });
    label = formattedDays.join(', ');
  }

  const offers = Array.isArray(item?.offers) ? item.offers : [];
  const title = item?.name || '';

  return (
    <div className={styles.container}>
      <h3 className={`${styles.weekday} ${rubikFont.className}`}>{label}</h3>
      <div className={styles.special_image_wrapper}>
          <div className={styles.backdrop_wrap} aria-hidden="true">
              <SmartImage
              image={item?.image}
              alt=""
              fit="cover"
              className={styles.backdrop_image}
              priority={false}
              />
          </div>
          <SmartImage 
              image={item.image}
              alt={item?.image?.alt || item?.name || 'Special'}
              fit='contain'
              className={styles.foreground_image}
          />
      </div>

      <div className={styles.content}>
        {!!title && <h4 className={`${styles.title} ${rubikFont.className}`}>{title}</h4>}

        <div className={`${styles.offer_wrap} ${offers.length > 2 ? styles.sml_text : styles.lg_text}`}>
          {offers.map((e, index) => {
            const hasPrice = typeof e?.price === 'number' && Number.isFinite(e.price);
            return (
              <div
                key={index}
                className={`${styles.offer_line} ${!hasPrice ? styles.centered : ''}`}
              >
                <p>{e?.offer}</p>
                {hasPrice && <p className={styles.offer_price}>R{e.price}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}