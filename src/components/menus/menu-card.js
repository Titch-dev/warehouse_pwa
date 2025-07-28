import Link from 'next/link';

import TornBorder from '@/components/assets/patterns/torn-border';

import ViewIcon from '@/components/assets/icons/magnifying-glass-svg';
import { rubikFont } from '@/lib/fonts';
import { colors } from '@/lib/colors';
import styles from './menu-card.module.css';

export default function MenuCard({ title, description, view, className }) {

  return (
    <section className={`${styles.menu_container} ${styles[className]}`}>
          <TornBorder top={true} color={colors.greydark2}/>
          <div className={styles.menu_content}>
            <h2 className={`${styles.menu_title} ${rubikFont.className}`}>{title}</h2>
            <p className={styles.menu_description}>{description}</p>
            <Link 
                href={view}
                className={styles.icon_content}>
                <ViewIcon className={styles.view_icon} />
            </Link>
          </div>
        </section>
  )
}
