import styles from './menu-category-navigation.module.css';

import { rubikFont } from '@/lib/fonts';

export default function MenuCategoryNavigation({action, category}) {

  return (
    <button 
        className={`${styles.button} ${rubikFont.className}`}
        onClick={() => action(category)}>
            {category}
    </button>
  )
}
