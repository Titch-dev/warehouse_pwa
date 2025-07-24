import Link from 'next/link';

import styles from './web-footer.module.css';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';

import LogoSVG from '@/components/assets/logo/logo-svg';
import MapSVG from '@/components/assets/icons/map-svg';
import TornBorder from '@/components/assets/patterns/torn-border';
import Socials from '@/components/assets/icons/socials'; 

export default function WebFooter() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=The+Westville+Warehouse`;

  return (
    <footer className={styles.wrapper}>
      <TornBorder top={true} color={colors.greydark1} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo_container}>
            <Socials size={30}/>
            <LogoSVG className={styles.logo}/>
          </div>
          <div className={styles.nav_container}>
            <h2 className={`${styles.nav_title} ${rubikFont.className}`}>Navigation</h2>
            <div className={styles.nav_menu}>
              <Link href='/'>Home</Link>
              <Link href='/events'>Events</Link>
              <Link href='/menus'>Menus</Link>
              <Link href='/gallery'>Gallery</Link>
              <Link href='/contact'>Contact</Link>
            </div>
          </div>
          <Link className={styles.address_container} href={mapUrl} target='_blank'>
            <address>48a Buckingham Tce.,<br/>Westville,<br/>Durban,<br/>4001,<br/>South Africa</address>
          </Link>
        </div>
        <div className={styles.copy_right}>
          <p>&copy; 2025 The Westville Warehouse</p>
        </div>
      </div>
    </footer>
  );
}
