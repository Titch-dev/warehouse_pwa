import { formatEventTime, formatEventDate } from '@/lib/utils';

import CalendarSVG from '@/components/assets/icons/calendar-svg';
import DoorSVG from '@/components/assets/icons/door-svg';
import ClockSVG from '@/components/assets/icons/clock-svg';

import styles from './event-icons.module.css'

export default function EventIcons({column=false, date=null, prices, start, end}) {

  function formatPriceDisplay(prices = []) {
    if (!Array.isArray(prices) || prices.length === 0) {
      return "Free";
    }

    // Case: ["TBC"]
    if (prices.length === 1 && prices[0] === "TBC") {
      return "TBC";
    }

    // Filter numeric values only
    const numericPrices = prices
      .filter(p => typeof p === "number" && !isNaN(p))
      .sort((a, b) => a - b);

    if (numericPrices.length === 0) {
      return "Free";
    }

    const lowest = numericPrices[0];
    const highest = numericPrices[numericPrices.length - 1];

    if (lowest === highest) {
      return `R${lowest} pp`;
    }

    return `R${lowest} - R${highest} pp`;
  }

  return (
    <div className={`${styles.icons} ${column ? styles.column : ''}
          `}>
        <div 
          className={`
            ${styles.icon_container}
            ${column ? styles.column : ''}
            `}>
            <CalendarSVG className={styles.icon}></CalendarSVG>
            <p>{formatEventDate(date)}</p>
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
            <p>{formatPriceDisplay(prices)}</p>
        </div>
    </div>
  )
}
