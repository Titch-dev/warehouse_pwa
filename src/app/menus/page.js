import MenuHeader from '@/components/menus/menu-header';
import MenuNavigation from '@/components/menus/menu-navigation';

import styles from './menus-page.module.css';


// import MenuCard from '@/components/menus/to-delete/menu-card';



export default function MenusPage() {
  
  return (
    <div className={styles.page_wrapper}>
      <div className={styles.container}>
        <MenuNavigation/>
      </div>

    </div>
    
  )
}
