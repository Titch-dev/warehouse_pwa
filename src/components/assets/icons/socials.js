
import Link from 'next/link';

import InstagramSVG from './instagram-svg';
import FacebookSVG from './facebook-svg';

import styles from './socials.module.css';

export default function Socials({ size }) {
  const fBUrl = "https://www.facebook.com/TheWestvilleWarehouse/";
  const instaUrl = "https://www.instagram.com/thewestvillewarehouse/";

  return (
    <div className={styles.container}>
        <Link href={instaUrl} target='_blank'>
            <InstagramSVG className={styles.icon} width={size} height={size}>
                <linearGradient id="Gradient1" x2="0" y2="1">
                    <stop className={styles.stop1} offset="0%" />
                    <stop className={styles.stop2} offset="50%" />
                    <stop className={styles.stop3} offset="100%" />
                </linearGradient>
            </InstagramSVG>
        </Link>
        <Link href={fBUrl} target='_blank'>
            <FacebookSVG className={styles.icon} width={size} height={size}>
                <linearGradient id="Gradient1" x2="0" y2="1">
                    <stop className={styles.stop1} offset="0%" />
                    <stop className={styles.stop2} offset="50%" />
                    <stop className={styles.stop3} offset="100%" />
                </linearGradient>
            </FacebookSVG>
        </Link>
        
    </div>
  )
}
