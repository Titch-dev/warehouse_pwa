import Image from 'next/image';

import { rubikFont } from '@/lib/fonts';
import styles from './specials-item.module.css';

export default function SpecialsItem({ item }) {

  return (
    <div className={styles.container}>
        <h1 className={`${styles.weekday} ${rubikFont.className}`}>{item.day}</h1>
        <Image className={styles.image} src={item.img} width={350} height={250} alt={item.title} />
        <div className={`${styles.content} `}>
            <h1 className={`${styles.title} ${rubikFont.className}`}>{item.title}</h1>
            <div className={`${styles.offer_wrap} ${item.offers.length > 2 ? styles.sml_text : styles.lg_text}`}>
              {item.offers.map((e, index) => (
                <div key={index} className={styles.offer_line}>
                    <p>{e.offer}</p>
                    <p>{typeof e.price === 'number'
                        ? `R${e.price}`
                        : `${e.price}`}</p>
                </div>
              ))}
            </div>
              
        </div>
    </div>
  )
}
