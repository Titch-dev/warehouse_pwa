import MenuNavigation from '@/components/menus/menu-navigation';

import styles from './menus-page.module.css';
import TornBorder from '@/components/assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';

export default function MenusPage() {
  
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          <h1 className={rubikFont.className}>The best texan BBQ, craft beers & cocktails in Durban</h1>
        </div>
      </div>
      <div className={styles.border_container}>
         <TornBorder top={true} color={colors.greydark1}/>
      </div>
      <div className={styles.container}>
        <MenuNavigation/>
      </div>

    </div>
    
  )
}
