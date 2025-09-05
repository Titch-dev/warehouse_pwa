import styles from './menu-category.module.css';

import { rubikFont } from '@/lib/fonts';

export default function MenuCategory({action, category}) {

  return (
    <button 
        className={`${styles.button} ${rubikFont.className}`}
        onClick={() => action(category)}>
            {category}
    </button>
  )
}
