import Image from 'next/image';
import dayjs from 'dayjs';
import { getStorageImageUrl } from '@/lib/utils'

import { rubikFont } from '@/lib/fonts';
import styles from './specials-item.module.css';

export default function SpecialsItem({ item }) {

  const today = dayjs().day()
  const tomorrow = (today + 1) % 7

  const dayIndexes = Object.values(item.days || {}).sort((a, b) => a - b)

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Detect sequential days
  const isSequential =
    dayIndexes.length > 1 &&
    dayIndexes.every((day, i) =>
      i === 0 || day === dayIndexes[i - 1] + 1
    )

  let label = ''

  if (isSequential) {
    // Example: Mon - Fri
    label = `${DAY_NAMES[dayIndexes[0]]} - ${DAY_NAMES[dayIndexes[dayIndexes.length - 1]]}`
  } else {
    const formattedDays = dayIndexes.map(dayIndex => {
      if (dayIndex === today) return 'Today'
      if (dayIndex === tomorrow) return 'Tomorrow'
      return DAY_NAMES[dayIndex]
    })

    label = formattedDays.join(', ')
  }

  return (
    <div className={styles.container}>
        <h1 className={`${styles.weekday} ${rubikFont.className}`}>
          {label}
        </h1>
        <Image 
          className={styles.image} 
          src={getStorageImageUrl(item.imagePath)} 
          width={350} 
          height={250} 
          alt={item.imageAlt || `${item.title} special`} 
        />
        <div className={`${styles.content} `}>
            <h1 className={`${styles.title} ${rubikFont.className}`}>{item.title}</h1>
            <div className={`${styles.offer_wrap} ${item.offers.length > 2 ? styles.sml_text : styles.lg_text}`}>
              {item.offers.map((e, index) => (
                <div
                  key={index}
                  className={`${styles.offer_line} ${
                    typeof e.price !== 'number' ? styles.centered : ''
                  }`}
                >
                  <p>{e.offer}</p>

                  {typeof e.price === 'number' && (
                    <p className={styles.offer_price}>R{e.price}</p>
                  )}
                </div>
              ))}
            </div>
              
        </div>
    </div>
  )
}
