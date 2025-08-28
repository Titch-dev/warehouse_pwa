import Image from 'next/image';

import styles from './menu-display.module.css';

export default function MenuDisplay({ imageSrc, alt }) {
  return (
    <div className={styles.wrapper}>
        <Image 
          src={imageSrc} 
          className={styles.menu} 
          width={500} 
          height={500}
          alt={alt}
        />
    </div>
  )
}
