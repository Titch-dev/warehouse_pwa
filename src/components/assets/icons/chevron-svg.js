import styles from './chevron-svg.module.css';

import ChevronLeftSVG from './chevron-left-svg';
import ChevronRightSVG from './chevron-right-svg';

export default function Chevron({ direction = 'right' }) {
  return (
    <>
      {direction === 'left' ? 
        <ChevronLeftSVG className={styles.chevron}>
          <linearGradient id="Gradient1" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
          </linearGradient>
        </ChevronLeftSVG> 
        : 
        <ChevronRightSVG className={styles.chevron}>
          <linearGradient id="Gradient1" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
          </linearGradient>
        </ChevronRightSVG>}
    </>
  )
}
